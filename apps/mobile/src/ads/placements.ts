/**
 * Placement rules — pure functions over (config, ledger, environment, game context). No React Native, no clock,
 * no storage: everything comes in as arguments so the caps are unit-tested in node (test/ads-placements.test.ts).
 *
 * Interstitial (D-084): only the RETURN slot — the player comes back after a long break, the "where were we" line
 * is shown, the coach announces the ad, then the ad. Never from any other call site, so never over a decision,
 * never at "Enough for today", never in the death → roast → new client flow, never on the birthday report.
 * Rewarded (D-039 caps, D-085 shape): opt-in offers only; an offer that is not allowed is simply not mounted
 * (no greyed-out button). The ledger moves only when something was really shown / granted.
 */
import type { AdConfig, PlacementId, RewardedPlacementConfig } from './config';

export type Deny =
  | 'disabled' | 'kill' | 'noAds' | 'notReturnSlot' | 'stage' | 'death' | 'birthday' | 'decision' | 'busy' | 'auto'
  | 'consent' | 'ftueSession' | 'ftuePlayTime' | 'ftueYear' | 'grief' | 'lossQuiet' | 'lowJoy' | 'negStreak' | 'nearMiss'
  | 'session' | 'away' | 'dailyCap' | 'sessionCap' | 'gap' | 'cooldown' | 'placementDailyCap' | 'lifeCap' | 'yearGap'
  | 'age' | 'noJob' | 'debt' | 'noTrigger';
export type Decision = { ok: true } | { ok: false; reason: Deny };
const no = (reason: Deny): Decision => ({ ok: false, reason });
const YES: Decision = { ok: true };

interface PlacementLedger {
  /** Grants on `AdLedger.dayKey`. */
  today: number;
  /** Life the per-life counter belongs to. */
  lifeId: string;
  inLife: number;
  /** Character age at the last grant in `lifeId` (null: none yet). */
  lastAge: number | null;
}

export interface AdLedger {
  v: 1;
  installAt: number;
  /** Foreground play time since install, in a life (06 `playClockSinceInstall`). */
  playMs: number;
  sessionCount: number;
  lastActiveAt: number;
  /** Local 'YYYY-MM-DD', monotonic: a clock set back never resets the daily counters. */
  dayKey: string;
  rewardedToday: number;
  interstitialToday: number;
  lastRewardedAt: number;
  lastInterstitialAt: number;
  /** `sessionCount` of the session that last showed an interstitial / mounted a rewarded offer, and how many. */
  interstitialSession: { n: number; count: number };
  offerSession: { n: number; count: number };
  placements: Partial<Record<PlacementId, PlacementLedger>>;
  /** Last grief scene (death of a loved one, funeral, farewell): which life, at which shown day, wall time. */
  grief: { lifeId: string; shownDay: number; at: number } | null;
  /** Wall time of the last loss of any kind (grief scene or the player's own death). */
  lossAt: number;
}

export const emptyLedger = (now: number, localDay: string): AdLedger => ({
  v: 1, installAt: now, playMs: 0, sessionCount: 0, lastActiveAt: 0, dayKey: localDay, rewardedToday: 0, interstitialToday: 0,
  lastRewardedAt: 0, lastInterstitialAt: 0, interstitialSession: { n: 0, count: 0 }, offerSession: { n: 0, count: 0 },
  placements: {}, grief: null, lossAt: 0,
});

/** What the placement rules need to know about the world outside the game. */
export interface AdEnv {
  now: number;
  localDay: string;
  /** `hasNoAds()` of the entitlement store. */
  noAds: boolean;
  /** Consent step done and the SDK may run (consent.ts `sdkAllowed`). */
  adsAllowed: boolean;
}

/** What the placement rules need to know about the game (built by gameContext.ts from the engine state). */
export interface AdGameContext {
  stage: 'file' | 'play' | 'death';
  /** Engine phase (`day` = a card is waiting for an answer). */
  phase: string | null;
  /** A beat sequence is playing (lines still arriving). */
  busy: boolean;
  auto: boolean;
  lifeNo: number;
  lifeId: string | null;
  age: number;
  shownDays: number;
  joyBp: number;
  negStreak: number;
  nearMiss: boolean;
  /** "Son perde": a deferred death is already rolled. */
  pendingDeath: boolean;
  inDebt: boolean;
  monthlySalary: number;
  /** Today's shown day carried a payday line. */
  payday: boolean;
}

/** The interstitial slot the caller is in. Only `return` exists (D-084). */
export type InterstitialSlot = { kind: 'return'; awayMs: number };

// ── ledger transitions ────────────────────────────────────────────────────────

/** New local day → daily counters reset. An earlier date (clock set back) changes nothing. */
export function rollDay(l: AdLedger, localDay: string): AdLedger {
  if (localDay <= l.dayKey) return l;
  const placements: AdLedger['placements'] = {};
  for (const k of Object.keys(l.placements) as PlacementId[]) placements[k] = { ...l.placements[k]!, today: 0 };
  return { ...l, dayKey: localDay, rewardedToday: 0, interstitialToday: 0, placements };
}

/** App launch / return to foreground. A new session only after `session.gapMs` away (close-reopen is the same session). */
export function startSession(cfg: AdConfig, l: AdLedger, now: number, localDay: string): AdLedger {
  const r = rollDay(l, localDay);
  const fresh = r.sessionCount === 0 || now - r.lastActiveAt >= cfg.session.gapMs || now < r.lastActiveAt;
  return { ...r, sessionCount: fresh ? r.sessionCount + 1 : r.sessionCount, lastActiveAt: now };
}

export const addPlay = (l: AdLedger, ms: number, now: number): AdLedger => ({ ...l, playMs: l.playMs + Math.max(0, ms), lastActiveAt: now });

export function noteGrief(l: AdLedger, lifeId: string, shownDay: number, now: number): AdLedger {
  return { ...l, grief: { lifeId, shownDay, at: now }, lossAt: now };
}
export const noteDeath = (l: AdLedger, now: number): AdLedger => ({ ...l, lossAt: now });

export function recordInterstitial(l0: AdLedger, env: AdEnv): AdLedger {
  const l = rollDay(l0, env.localDay);
  const s = l.interstitialSession.n === l.sessionCount ? l.interstitialSession.count : 0;
  return { ...l, interstitialToday: l.interstitialToday + 1, lastInterstitialAt: env.now, interstitialSession: { n: l.sessionCount, count: s + 1 } };
}

/** An offer card was mounted (accepted or not): it does not come back in the same session. */
export function recordOffer(l: AdLedger): AdLedger {
  const s = l.offerSession.n === l.sessionCount ? l.offerSession.count : 0;
  return { ...l, offerSession: { n: l.sessionCount, count: s + 1 } };
}

/** A rewarded ad was really shown (earned or closed early): daily count + cooldown. No-fill never gets here. */
export function recordRewardedShown(l0: AdLedger, env: AdEnv): AdLedger {
  const l = rollDay(l0, env.localDay);
  return { ...l, rewardedToday: l.rewardedToday + 1, lastRewardedAt: env.now };
}

/** The reward was granted: the placement's own caps move (06 §2.3.3 `Granted → ledger++`). */
export function recordGrant(l0: AdLedger, env: AdEnv, placement: PlacementId, game: Pick<AdGameContext, 'lifeId' | 'age'>): AdLedger {
  const l = rollDay(l0, env.localDay);
  const lifeId = game.lifeId ?? '';
  const p = l.placements[placement];
  const same = p && p.lifeId === lifeId;
  return { ...l, placements: { ...l.placements, [placement]: { today: (p?.today ?? 0) + 1, lifeId, inLife: (same ? p.inLife : 0) + 1, lastAge: game.age } } };
}

// ── shared quiet zones ────────────────────────────────────────────────────────

/** Grief, a fresh loss or low joy: no commercial surface at all (06 §2.1 principle 3, D-052, D-115). */
function quietZone(cfg: AdConfig, l: AdLedger, env: AdEnv, g: AdGameContext): Deny | null {
  if (g.pendingDeath) return 'death';
  if (l.grief && g.lifeId && l.grief.lifeId === g.lifeId && g.shownDays - l.grief.shownDay < cfg.quiet.griefShownDays) return 'grief';
  if (l.lossAt && env.now - l.lossAt < cfg.quiet.afterLossMs && env.now >= l.lossAt) return 'lossQuiet';
  if (g.joyBp < cfg.quiet.lowJoyBp) return 'lowJoy';
  return null;
}

// ── interstitial ──────────────────────────────────────────────────────────────

export function canShowInterstitial(cfg: AdConfig, l0: AdLedger, env: AdEnv, g: AdGameContext, slot: InterstitialSlot | null): Decision {
  const c = cfg.interstitial;
  if (!cfg.enabled) return no('disabled');
  if (cfg.kill.all || cfg.kill.interstitial) return no('kill');
  if (env.noAds) return no('noAds');
  if (!slot || slot.kind !== 'return') return no('notReturnSlot');
  if (g.stage !== 'play' || !g.lifeId) return no(g.stage === 'death' ? 'death' : 'stage');
  if (g.phase === 'dead') return no('death');
  if (g.phase === 'birthday') return no('birthday');
  if (!env.adsAllowed) return no('consent');
  const l = rollDay(l0, env.localDay);
  if (l.sessionCount < Math.max(c.minSessionCount, cfg.ftue.minSessionCount)) return no('ftueSession');
  if (l.playMs < cfg.ftue.minPlayMs) return no('ftuePlayTime');
  if (slot.awayMs < c.minAwayMs) return no('away');
  const quiet = quietZone(cfg, l, env, g);
  if (quiet) return no(quiet);
  if (l.interstitialSession.n === l.sessionCount && l.interstitialSession.count >= c.perSession) return no('sessionCap');
  if (l.interstitialToday >= c.perLocalDay) return no('dailyCap');
  if (l.lastInterstitialAt && env.now - l.lastInterstitialAt < c.minGapMs && env.now >= l.lastInterstitialAt) return no('gap');
  return YES;
}

// ── rewarded ──────────────────────────────────────────────────────────────────

export function canOfferRewarded(cfg: AdConfig, l0: AdLedger, env: AdEnv, g: AdGameContext, placement: PlacementId): Decision {
  const c = cfg.rewarded;
  const p: RewardedPlacementConfig | undefined = c.placements[placement];
  if (!cfg.enabled || !p || !p.enabled) return no('disabled');
  if (cfg.kill.all || cfg.kill.rewarded || cfg.kill.placements.includes(placement)) return no('kill');
  if (g.stage !== 'play' || !g.lifeId) return no(g.stage === 'death' ? 'death' : 'stage');
  if (g.phase === 'dead') return no('death');
  if (g.phase === 'birthday') return no('birthday');          // D-085: no RewardedOffer on the report card
  if (g.phase === 'day') return no('decision');               // never next to an open choice
  if (g.busy) return no('busy');
  if (g.auto) return no('auto');                              // nobody is reading: no offer, and never an auto-watch
  // With the no-ads entitlement nothing is shown, so the ad consent gate does not apply.
  const free = env.noAds && c.noAdsMode === 'grantWithoutAd';
  if (!free && !env.adsAllowed) return no('consent');
  const l = rollDay(l0, env.localDay);
  if (l.sessionCount < cfg.ftue.minSessionCount) return no('ftueSession');
  if (l.playMs < cfg.ftue.minPlayMs) return no('ftuePlayTime');
  if (g.lifeNo <= 1 && g.age < cfg.ftue.firstLifeMinAge) return no('ftueYear');
  const quiet = quietZone(cfg, l, env, g);
  if (quiet) return no(quiet);
  if (g.negStreak >= cfg.quiet.negStreak) return no('negStreak');
  if (g.nearMiss) return no('nearMiss');
  if (l.rewardedToday >= c.perLocalDay) return no('dailyCap');
  if (l.lastRewardedAt && env.now - l.lastRewardedAt < c.cooldownMs && env.now >= l.lastRewardedAt) return no('cooldown');
  if (l.offerSession.n === l.sessionCount && l.offerSession.count >= c.offersPerSession) return no('sessionCap');
  const pl = l.placements[placement];
  if (p.perLocalDay !== null && (pl?.today ?? 0) >= p.perLocalDay) return no('placementDailyCap');
  const inLife = pl && pl.lifeId === g.lifeId ? pl : null;
  if (p.perLife !== null && (inLife?.inLife ?? 0) >= p.perLife) return no('lifeCap');
  if (p.minCharYearsGap !== null && inLife && inLife.lastAge !== null && g.age - inLife.lastAge < p.minCharYearsGap) return no('yearGap');
  if (p.maxAge !== null && g.age > p.maxAge) return no('age');
  if (p.requiresJob && g.monthlySalary <= 0) return no('noJob');
  if (p.blockInDebt && g.inDebt) return no('debt');
  if (p.requiresPayday && !g.payday) return no('noTrigger');
  return YES;
}

/** How a claimed offer is fulfilled: with the no-ads entitlement the reward is granted without showing an ad. */
export function fulfilment(cfg: AdConfig, env: Pick<AdEnv, 'noAds'>): 'ad' | 'free' {
  return env.noAds && cfg.rewarded.noAdsMode === 'grantWithoutAd' ? 'free' : 'ad';
}

/** Forma Sponsoru bonus (Para): monthly salary × months × pct, paid once. 0 when there is no salary. */
export function sponsorAmount(cfg: AdConfig, monthlySalary: number): number {
  const { pct, months } = cfg.rewarded.sponsorReward;
  return Math.max(0, Math.round((monthlySalary * months * pct) / 100));
}
