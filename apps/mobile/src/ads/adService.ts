/**
 * AdService — the one object the game talks to. It owns the ledger (caps, cooldowns, sessions, play clock), the
 * consent state and the provider, and applies placements.ts / consent.ts to them. Dependencies (clock, storage,
 * provider, entitlement lookups) are injected, so the whole service runs in node tests with the mock provider.
 *
 * Order of things, always: consent step → SDK init → ads. Before the consent step is done no SDK is started and
 * no ad surface exists. Without explicit opt-in every request is non-personalised.
 */
import type { AdConfig, PlacementId } from './config';
import {
  applyCardChoice, applyMinor, applyUmp, attDue, consentDue, consentSteps, emptyConsent, personalizedAllowed, regionOfCountry, requestPrefs, sdkAllowed,
  type AdPlatform, type ConsentState, type Region,
} from './consent';
import {
  addPlay, canOfferRewarded, canShowInterstitial, emptyLedger, fulfilment, noteDeath, noteGrief, recordGrant, recordInterstitial, recordOffer,
  recordRewardedShown, sponsorAmount, startSession,
  type AdEnv, type AdGameContext, type AdLedger, type Decision, type InterstitialSlot,
} from './placements';
import type { AdProvider, AdRequestPrefs, ConsentInfo, RewardedResult } from './types';
import { present, type PrivacyStatus } from './uiStore';

export const ADS_KEY = 'motto.ads.v1';

export interface AdServiceDeps {
  cfg: AdConfig;
  provider: AdProvider;
  platform: AdPlatform;
  kv: { read(key: string): Promise<string | null>; write(key: string, value: string): Promise<unknown> };
  now: () => number;
  /** Device-local 'YYYY-MM-DD'. */
  localDay: () => string;
  /** Entitlement store: `hasNoAds` and its change subscription (src/monetization/entitlements). */
  noAds: () => boolean;
  onNoAdsChange?: (cb: () => void) => () => void;
  /** Best-effort device country ('TR', 'DE', …) or null. */
  country: () => string | null;
}

/** A mounted rewarded offer. `free`: the no-ads entitlement grants it without showing an ad. */
export interface Offer { placement: PlacementId; amount: number; free: boolean }
export type ReturnSlot = 'consent' | 'att' | 'interstitial';
/** What the consent step ended with (`analytics: null` = no analytics switch on the card). */
export interface ConsentOutcome { via: 'card' | 'ump'; choice: 'save' | 'decline' | 'ok'; personalized: boolean; analytics: boolean | null; resolved: boolean }

interface Stored { v: 1; ledger: AdLedger; consent: ConsentState }
const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);

export function decodeAds(raw: string | null | undefined): Stored | null {
  if (!raw) return null;
  try {
    const x: unknown = JSON.parse(raw);
    if (!isObj(x) || x.v !== 1 || !isObj(x.ledger) || !isObj(x.consent)) return null;
    const l = x.ledger as Partial<AdLedger>, c = x.consent as Partial<ConsentState>;
    if (l.v !== 1 || typeof l.playMs !== 'number' || typeof l.sessionCount !== 'number' || typeof l.dayKey !== 'string' || c.v !== 1) return null;
    return { v: 1, ledger: { ...emptyLedger(0, l.dayKey), ...l } as AdLedger, consent: { ...emptyConsent(), ...c } as ConsentState };
  } catch { return null; }
}

const PLAY_SAVE_MS = 15_000;
const READY_TIMEOUT_MS = 2500;

export class AdService {
  private ledger: AdLedger;
  private consentState: ConsentState = emptyConsent();
  private ump: ConsentInfo | null = null;
  private loading: Promise<void> | null = null;
  private loaded = false;
  private unsavedPlay = 0;
  private listeners = new Set<() => void>();
  private regionOverride: Region | null = null;
  /** Answer of the neutral age gate; null until it is known — and until then there is no ad surface and no SDK. */
  private ageMinor: boolean | null = null;

  constructor(private readonly d: AdServiceDeps) {
    this.ledger = emptyLedger(d.now(), d.localDay());
    d.onNoAdsChange?.(() => this.emit());
  }

  // ── store plumbing ────────────────────────────────────────────────────────
  subscribe = (l: () => void): (() => void) => { this.listeners.add(l); return () => { this.listeners.delete(l); }; };
  private emit(): void { for (const l of this.listeners) l(); }
  private save(): void {
    this.unsavedPlay = 0;
    const blob: Stored = { v: 1, ledger: this.ledger, consent: this.consentState };
    void Promise.resolve(this.d.kv.write(ADS_KEY, JSON.stringify(blob))).catch(() => undefined);
  }

  get config(): AdConfig { return this.d.cfg; }
  getLedger(): AdLedger { return this.ledger; }
  getConsent(): ConsentState { return this.consentState; }
  region(): Region { return this.regionOverride ?? regionOfCountry(this.d.country()); }
  /** Demo / tests: pretend to be in another region. */
  setRegion(r: Region | null): void { this.regionOverride = r; }
  env(): AdEnv {
    return { now: this.d.now(), localDay: this.d.localDay(), noAds: this.d.noAds(), adsAllowed: this.ageMinor !== null && sdkAllowed(this.d.cfg, this.consentState, this.ump) };
  }
  /** What every request is made with right now. Non-personalised unless explicitly allowed. */
  prefs(): AdRequestPrefs { return requestPrefs(this.d.cfg, this.consentState, this.d.platform); }

  // ── lifecycle ─────────────────────────────────────────────────────────────
  /** Reads the ledger, starts the session and (only if consent is already done) the SDK. Never rejects. */
  ready(): Promise<void> {
    this.loading ??= (async () => {
      try {
        const s = decodeAds(await this.d.kv.read(ADS_KEY));
        if (s) { this.ledger = s.ledger; this.consentState = s.consent; }
      } catch { /* starts empty */ }
      this.loaded = true;
      if (this.ageMinor !== null) this.consentState = applyMinor(this.consentState, this.ageMinor);
      this.foreground();
      // The game must never wait long for an ad SDK: init continues in the background after the timeout.
      await Promise.race([this.ensureSdk(), new Promise<void>((r) => setTimeout(r, READY_TIMEOUT_MS))]);
    })();
    return this.loading;
  }

  /** App launch or return to the foreground: a new session after `session.gapMs` away. */
  foreground(): void {
    if (!this.loaded) return;
    this.ledger = startSession(this.d.cfg, this.ledger, this.d.now(), this.d.localDay());
    this.save();
  }

  /** Foreground play time in a life (the game's own tick calls this). */
  tickPlay(ms: number): void {
    if (!this.loaded) return;
    this.ledger = addPlay(this.ledger, ms, this.d.now());
    this.unsavedPlay += ms;
    if (this.unsavedPlay >= PLAY_SAVE_MS) this.save();
  }

  /** A day card was shown: grief scenes open a quiet zone (no commercial surface around them). */
  noteGrief(lifeId: string, shownDay: number): void {
    this.ledger = noteGrief(this.ledger, lifeId, shownDay, this.d.now());
    this.save();
  }
  noteDeath(): void { this.ledger = noteDeath(this.ledger, this.d.now()); this.save(); }

  private async ensureSdk(): Promise<boolean> {
    const p = this.d.provider;
    if (!this.consentState.resolved || this.ageMinor === null) return false;
    try {
      if (this.consentState.source === 'ump' && !this.ump) this.ump = await p.consent.getStatus();
      if (!sdkAllowed(this.d.cfg, this.consentState, this.ump)) return false;
      if (!p.initialized) await p.init(this.prefs());
      p.preload('rewarded');
      if (!this.d.noAds()) p.preload('interstitial');
      return true;
    } catch (e) { console.warn('[ads] init failed:', e); return false; }
  }

  // ── return slot (D-084 / D-104) ───────────────────────────────────────────
  /** What (if anything) the return slot holds: the consent step, the ATT pre-prompt, or the one interstitial. */
  returnSlot(game: AdGameContext, awayMs: number): ReturnSlot | null {
    const cfg = this.d.cfg;
    if (!this.loaded || this.ageMinor === null || !cfg.enabled || cfg.kill.all || game.stage !== 'play' || game.phase === 'dead' || game.pendingDeath) return null;
    const n = this.ledger.sessionCount;
    // An owner who never sees an ad (no interstitials, rewards granted without one) is not asked for ad consent.
    const adFree = this.d.noAds() && fulfilment(cfg, { noAds: true }) === 'free';
    if (!adFree && consentDue(cfg, this.consentState, n)) return game.phase === 'birthday' ? null : 'consent';
    if (!adFree && attDue(cfg, this.consentState, this.d.platform, n)) return 'att';
    return this.interstitialDecision(game, { kind: 'return', awayMs }).ok && this.d.provider.isReady('interstitial') ? 'interstitial' : null;
  }

  interstitialDecision(game: AdGameContext, slot: InterstitialSlot | null): Decision {
    return canShowInterstitial(this.d.cfg, this.ledger, this.env(), game, slot);
  }

  /** Runs what `returnSlot` announced. Resolves when the player is back in the game. */
  async runReturnSlot(slot: ReturnSlot, game: AdGameContext, awayMs: number): Promise<void> {
    if (slot === 'consent') { await this.runConsent(); return; }
    if (slot === 'att') return this.runAtt();
    await this.showInterstitial(game, { kind: 'return', awayMs });
  }

  /** Shows the interstitial if (still) allowed; the ledger moves only when an ad was really shown. */
  async showInterstitial(game: AdGameContext, slot: InterstitialSlot | null): Promise<boolean> {
    if (!this.interstitialDecision(game, slot).ok) return false;
    if (!(await this.ensureSdk())) return false;
    const r = await this.d.provider.showInterstitial(slot!.kind);
    if (r.shown) { this.ledger = recordInterstitial(this.ledger, this.env()); this.save(); }
    this.d.provider.preload('interstitial');
    return r.shown;
  }

  // ── consent ───────────────────────────────────────────────────────────────
  /** Storage was read (ledger + consent). */
  isLoaded(): boolean { return this.loaded; }

  /**
   * The ad consent question may be asked now. Normally from the 2nd session on (return slot); `early`: the first
   * report card of session 1 (sprint 3 — the single privacy card comes after the hook, before the player can leave
   * without ever being asked). Never before the age gate, never for an owner who never sees an ad.
   */
  consentAskDue(early = false): boolean {
    const cfg = this.d.cfg;
    if (!this.loaded || this.ageMinor === null || !cfg.enabled || cfg.kill.all) return false;
    if (this.d.noAds() && fulfilment(cfg, { noAds: true }) === 'free') return false;
    const n = early && cfg.consent.firstReportAsk ? Math.max(this.ledger.sessionCount, cfg.consent.minSessionCount) : this.ledger.sessionCount;
    return consentDue(cfg, this.consentState, n);
  }

  /**
   * The consent step. Google's UMP form where it is required (EEA / UK / CH); everywhere else ONE privacy card
   * (notice + personalised-ads switch, OFF; [Keep all off] and [Save] equal). `opts.analytics`: the analytics
   * switch sits on the same card (after UMP: a card with the analytics switch only). Returns what was answered;
   * `analytics: null` = that switch was not on the card.
   */
  async runConsent(opts: { analytics?: boolean } = {}): Promise<ConsentOutcome> {
    const cfg = this.d.cfg, region = this.region(), now = this.d.now();
    let c = this.consentState;
    const out: ConsentOutcome = { via: 'card', choice: 'decline', personalized: false, analytics: null, resolved: false };
    try { this.ump = await this.d.provider.consent.gather({ underAgeOfConsent: c.isMinor }); } catch { this.ump = null; }
    if (consentSteps(region).includes('ump') || this.ump?.status === 'obtained') {
      out.via = 'ump';
      // UMP did not answer (offline, form not configured): nothing is resolved, no ads, asked again next session.
      if (this.ump && this.ump.status !== 'unknown' && this.ump.status !== 'required') {
        c = applyUmp(cfg, c, this.ump, region, now);
        out.resolved = true;
        out.personalized = c.adsPersonalized;
      }
      if (opts.analytics) {
        const r = await present({ k: 'privacyCard', ads: false, analytics: true, minor: c.isMinor }, null);
        out.analytics = !!r?.analytics && !c.isMinor;
        out.choice = c.isMinor ? 'ok' : r ? 'save' : 'decline';
      } else out.choice = 'ok';
      if (!out.resolved) return out;
    } else {
      const r = await present({ k: 'privacyCard', ads: true, analytics: !!opts.analytics, minor: c.isMinor }, null);
      c = applyCardChoice(cfg, c, r ? { personalized: r.personalized, adult: !c.isMinor } : { personalized: false, adult: false }, region, now);
      out.choice = c.isMinor ? 'ok' : r ? 'save' : 'decline';
      out.personalized = c.adsPersonalized;
      out.analytics = opts.analytics ? !!r?.analytics && !c.isMinor : null;
      out.resolved = true;
    }
    this.setConsent(c);
    await this.ensureSdk();
    return out;
  }

  /** iOS: plain-language pre-prompt, then the system dialog — once. */
  async runAtt(): Promise<void> {
    if (!attDue(this.d.cfg, this.consentState, this.d.platform, this.ledger.sessionCount)) return;
    await present({ k: 'att' }, null);
    let att = await this.d.provider.consent.requestTracking();
    if (att === 'undetermined' || att === 'unavailable') att = 'denied';      // asked once; never a second prompt
    this.setConsent({ ...this.consentState, att });
  }

  private setConsent(c: ConsentState): void {
    this.consentState = c;
    this.save();
    if (this.d.provider.initialized) this.d.provider.setRequestPrefs(this.prefs());
    this.emit();
  }

  /**
   * Result of the neutral age gate (ageGate.ts). Minor (D-102): personalisation off and locked, under-age tag on,
   * no ATT. May be called before `ready()`: it is applied on top of the stored consent once that is read.
   */
  setMinor(isMinor: boolean): void {
    this.ageMinor = isMinor;
    if (this.loaded) { this.setConsent(applyMinor(this.consentState, isMinor)); void this.ensureSdk(); } else this.emit();
  }
  /** null: the age gate has not been answered yet. */
  ageKnown(): boolean { return this.ageMinor !== null; }

  privacyStatus(): PrivacyStatus {
    const c = this.consentState;
    return { resolved: c.resolved, personalized: personalizedAllowed(c, this.d.platform), adult: !c.isMinor, minor: c.isMinor, noAds: this.d.noAds(), noAdsFree: fulfilment(this.d.cfg, { noAds: true }) === 'free',
      ump: c.source === 'ump' || (!c.resolved && consentSteps(this.region()).includes('ump')), ios: this.d.platform === 'ios' };
  }

  /** "Gizlilik / reklam tercihleri": the persistent entry to change (or give / withdraw) consent at any time. */
  async openPrivacy(): Promise<void> {
    const st = this.privacyStatus();
    const r = await present({ k: 'privacy', status: st }, { k: 'cancel' });
    if (r.k === 'cancel') return;
    const cfg = this.d.cfg, region = this.region(), now = this.d.now();
    if (r.k === 'ump') {
      this.ump = st.resolved ? await this.d.provider.consent.showPrivacyOptions() : await this.d.provider.consent.gather({ underAgeOfConsent: st.minor });
      if (this.ump.status === 'obtained' || this.ump.status === 'notRequired') this.setConsent(applyUmp(cfg, this.consentState, this.ump, region, now));
    } else this.setConsent(applyCardChoice(cfg, this.consentState, r.choice, region, now));
    await this.ensureSdk();
  }

  // ── rewarded ──────────────────────────────────────────────────────────────
  offerDecision(placement: PlacementId, game: AdGameContext): Decision {
    return canOfferRewarded(this.d.cfg, this.ledger, this.env(), game, placement);
  }

  /** Mounts an offer if it is allowed right now (and counts it for the session). null → nothing is shown at all. */
  offer(placement: PlacementId, game: AdGameContext): Offer | null {
    if (!this.loaded || this.ageMinor === null || !this.offerDecision(placement, game).ok) return null;
    const amount = placement === 'sponsor' ? sponsorAmount(this.d.cfg, game.monthlySalary) : 0;
    const free = fulfilment(this.d.cfg, this.env()) === 'free';
    if (placement === 'sponsor' && amount <= 0) return null;
    // A watched offer needs an ad to exist: no loaded ad → no offer (never a button that leads to "no ad").
    if (!free && !this.d.provider.isReady('rewarded')) { this.d.provider.preload('rewarded'); return null; }
    this.ledger = recordOffer(this.ledger);
    this.save();
    return { placement, amount, free };
  }

  /**
   * The player accepted the offer. With the no-ads entitlement the reward is granted without an ad (same caps);
   * otherwise the ad is shown and the reward exists only if it was watched to the end.
   */
  async claim(offer: Offer, game: Pick<AdGameContext, 'lifeId' | 'age'>): Promise<RewardedResult> {
    let r: RewardedResult;
    if (fulfilment(this.d.cfg, this.env()) === 'free') r = { rewarded: true };
    else if (!(await this.ensureSdk())) r = { rewarded: false, reason: 'noFill' };
    else r = await this.d.provider.showRewarded(offer.placement);
    const env = this.env();
    if (r.rewarded || r.reason === 'closed') this.ledger = recordRewardedShown(this.ledger, env);   // no-fill / error: cap not spent
    if (r.rewarded) this.ledger = recordGrant(this.ledger, env, offer.placement, game);
    this.save();
    this.d.provider.preload('rewarded');
    return r;
  }
}
