/**
 * Google AdMob provider (react-native-google-mobile-ads 17.x: Google Mobile Ads SDK + UMP) — native only.
 *
 * - The package is `require`d inside `lib()`, i.e. on first use: nothing of the ad SDK is loaded before the
 *   consent gate lets `init` / `consent.gather` run (D-054 / AC-06-13).
 * - Formats: rewarded and standard interstitial. No banner, no app-open, no rewarded-interstitial (06 §2.4).
 * - Every request carries `requestNonPersonalizedAdsOnly` from the consent state; the global request configuration
 *   pins the content rating to T and the child / under-age tags (config.ts `request`, D-102, D-105).
 * - The reward exists only when EARNED_REWARD fired before CLOSED (06 §2.3.3); a load that takes longer than
 *   `loadTimeoutMs` is a no-fill (cap not spent).
 * Not exercised by unit tests (no native module in node) — see docs/design/15 §9 for the device test plan.
 */
import { Platform } from 'react-native';
import { adUnitId, type AdConfig } from './config';
import type { AdConsentApi, AdFormat, AdProvider, AdRequestPrefs, ConsentInfo, InterstitialResult, RewardedResult, TrackingStatus } from './types';

type Lib = typeof import('react-native-google-mobile-ads');
type Tracking = typeof import('expo-tracking-transparency');
type Loaded = InstanceType<Lib['RewardedAd']> | InstanceType<Lib['InterstitialAd']>;

const UNKNOWN: ConsentInfo = { status: 'unknown', canRequestAds: false, privacyOptionsRequired: false, personalized: false };

export class AdMobProvider implements AdProvider {
  readonly name = 'admob' as const;
  initialized = false;
  private prefs: AdRequestPrefs | null = null;
  private mod: Lib | null = null;
  private slots: Partial<Record<AdFormat, { ad: Loaded; loaded: boolean; failed: boolean; waiters: (() => void)[] }>> = {};
  private readonly platform: 'ios' | 'android' = Platform.OS === 'ios' ? 'ios' : 'android';

  constructor(private readonly cfg: AdConfig) {}

  private lib(): Lib {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return (this.mod ??= require('react-native-google-mobile-ads') as Lib);
  }

  private async configure(prefs: AdRequestPrefs): Promise<void> {
    const L = this.lib();
    await L.default().setRequestConfiguration({
      maxAdContentRating: L.MaxAdContentRating[prefs.maxAdContentRating],
      tagForChildDirectedTreatment: prefs.tagForChildDirectedTreatment,
      tagForUnderAgeOfConsent: prefs.tagForUnderAgeOfConsent,
    });
  }

  async init(prefs: AdRequestPrefs): Promise<void> {
    this.prefs = prefs;
    await this.configure(prefs);
    await this.lib().default().initialize();
    this.initialized = true;
  }

  setRequestPrefs(prefs: AdRequestPrefs): void {
    this.prefs = prefs;
    if (!this.initialized) return;
    void this.configure(prefs).catch((e) => console.warn('[ads] request configuration failed:', e));
    // Ads loaded under the old consent are dropped; the next preload uses the new prefs.
    for (const f of Object.keys(this.slots) as AdFormat[]) { this.slots[f]?.ad.removeAllListeners(); delete this.slots[f]; }
  }

  preload(format: AdFormat): void {
    if (!this.initialized || !this.prefs || this.slots[format]) return;
    const L = this.lib();
    const opts = { requestNonPersonalizedAdsOnly: this.prefs.nonPersonalizedOnly };
    const id = adUnitId(this.platform, format);
    const ad: Loaded = format === 'rewarded' ? L.RewardedAd.createForAdRequest(id, opts) : L.InterstitialAd.createForAdRequest(id, opts);
    const slot = { ad, loaded: false, failed: false, waiters: [] as (() => void)[] };
    this.slots[format] = slot;
    const settle = () => { for (const w of slot.waiters.splice(0)) w(); };
    // The union of the two ad classes has no common listener signature; the event names are checked by the enums.
    const on = (type: string, cb: () => void) => (ad as unknown as { addAdEventListener(t: string, l: () => void): () => void }).addAdEventListener(type, cb);
    on(format === 'rewarded' ? L.RewardedAdEventType.LOADED : L.AdEventType.LOADED, () => { slot.loaded = true; settle(); });
    on(L.AdEventType.ERROR, () => { slot.failed = true; settle(); if (this.slots[format] === slot) delete this.slots[format]; });
    ad.load();
  }

  isReady(format: AdFormat): boolean { return !!this.slots[format]?.loaded; }

  /** Waits for the preloaded ad (or starts a load) up to `loadTimeoutMs`. */
  private async take(format: AdFormat): Promise<Loaded | null> {
    this.preload(format);
    const slot = this.slots[format];
    if (!slot) return null;
    if (!slot.loaded && !slot.failed) {
      await new Promise<void>((resolve) => {
        const t = setTimeout(resolve, this.cfg.rewarded.loadTimeoutMs);
        slot.waiters.push(() => { clearTimeout(t); resolve(); });
      });
    }
    if (!slot.loaded) return null;
    delete this.slots[format];                                   // one show per loaded ad
    return slot.ad;
  }

  async showRewarded(): Promise<RewardedResult> {
    if (!this.initialized) return { rewarded: false, reason: 'error' };
    const L = this.lib();
    const ad = await this.take('rewarded') as InstanceType<Lib['RewardedAd']> | null;
    if (!ad) return { rewarded: false, reason: 'noFill' };
    return new Promise<RewardedResult>((resolve) => {
      let earned = false;
      const done = (r: RewardedResult) => { ad.removeAllListeners(); this.preload('rewarded'); resolve(r); };
      ad.addAdEventListener(L.RewardedAdEventType.EARNED_REWARD, () => { earned = true; });
      ad.addAdEventListener(L.AdEventType.CLOSED, () => done(earned ? { rewarded: true } : { rewarded: false, reason: 'closed' }));
      ad.addAdEventListener(L.AdEventType.ERROR, () => done(earned ? { rewarded: true } : { rewarded: false, reason: 'error' }));
      ad.show().catch(() => done({ rewarded: false, reason: 'error' }));
    });
  }

  async showInterstitial(): Promise<InterstitialResult> {
    if (!this.initialized) return { shown: false, reason: 'error' };
    const L = this.lib();
    // An interstitial is never worth waiting for: only an already loaded one is shown.
    if (!this.isReady('interstitial')) { this.preload('interstitial'); return { shown: false, reason: 'noFill' }; }
    const ad = await this.take('interstitial') as InstanceType<Lib['InterstitialAd']> | null;
    if (!ad) return { shown: false, reason: 'noFill' };
    return new Promise<InterstitialResult>((resolve) => {
      const done = (r: InterstitialResult) => { ad.removeAllListeners(); resolve(r); };
      ad.addAdEventListener(L.AdEventType.CLOSED, () => done({ shown: true }));
      ad.addAdEventListener(L.AdEventType.ERROR, () => done({ shown: false, reason: 'error' }));
      ad.show().catch(() => done({ shown: false, reason: 'error' }));
    });
  }

  private async info(raw: { status: string; canRequestAds: boolean; privacyOptionsRequirementStatus: string }): Promise<ConsentInfo> {
    const L = this.lib();
    const status = raw.status === L.AdsConsentStatus.OBTAINED ? 'obtained' : raw.status === L.AdsConsentStatus.REQUIRED ? 'required'
      : raw.status === L.AdsConsentStatus.NOT_REQUIRED ? 'notRequired' : 'unknown';
    let personalized = false;
    if (status === 'obtained') {
      try { const c = await L.AdsConsent.getUserChoices(); personalized = c.selectPersonalisedAds && c.storeAndAccessInformationOnDevice; } catch { personalized = false; }
    }
    return { status, canRequestAds: raw.canRequestAds, privacyOptionsRequired: raw.privacyOptionsRequirementStatus === L.AdsConsentPrivacyOptionsRequirementStatus.REQUIRED, personalized };
  }

  private tracking(): Tracking | null {
    if (this.platform !== 'ios') return null;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    try { return require('expo-tracking-transparency') as Tracking; } catch { return null; }
  }
  private static mapTracking(r: { status: string; granted: boolean }): TrackingStatus {
    return r.granted ? 'authorized' : r.status === 'undetermined' ? 'undetermined' : r.status === 'denied' ? 'denied' : 'restricted';
  }

  readonly consent: AdConsentApi = {
    getStatus: async () => { try { return await this.info(await this.lib().AdsConsent.getConsentInfo()); } catch { return UNKNOWN; } },
    // UMP: refresh the info, show Google's form only where it is required (EEA / UK / CH, configured US states).
    gather: async ({ underAgeOfConsent }) => {
      try { return await this.info(await this.lib().AdsConsent.gatherConsent({ tagForUnderAgeOfConsent: underAgeOfConsent })); }
      catch (e) { console.warn('[ads] UMP failed:', e); return UNKNOWN; }
    },
    showPrivacyOptions: async () => {
      try { return await this.info(await this.lib().AdsConsent.showPrivacyOptionsForm()); }
      catch (e) { console.warn('[ads] privacy options form failed:', e); return this.consent.getStatus(); }
    },
    requestTracking: async () => {
      const t = this.tracking();
      if (!t) return 'unavailable';
      try { return AdMobProvider.mapTracking(await t.requestTrackingPermissionsAsync()); } catch { return 'unavailable'; }
    },
    getTracking: async () => {
      const t = this.tracking();
      if (!t) return 'unavailable';
      try { return AdMobProvider.mapTracking(await t.getTrackingPermissionsAsync()); } catch { return 'unavailable'; }
    },
  };
}
