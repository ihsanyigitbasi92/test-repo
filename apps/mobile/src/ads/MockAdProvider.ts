/**
 * Demo ad provider for web, Expo Go, tests and any binary built without the AdMob module. It shows a clearly
 * labelled placeholder ("DEMO AD · NOT A REAL AD") through the ad host; nothing leaves the device.
 * Every request is logged with the prefs it was made with, so tests can assert "non-personalised by default".
 */
import type { AdConfig } from './config';
import type { Region } from './consent';
import type { AdConsentApi, AdFormat, AdProvider, AdRequestPrefs, ConsentInfo, InterstitialResult, RewardedResult, TrackingStatus } from './types';
import { present } from './uiStore';

export interface MockOptions {
  cfg: AdConfig;
  /** Region the mock UMP pretends to be in (EEA → the demo consent form is "required"). */
  region?: () => Region;
  /** false simulates no-fill. */
  fill?: () => boolean;
  /** Headless runs (no host mounted): does the rewarded ad count as watched? Default true. */
  headlessRewarded?: boolean;
  /** iOS tracking answer the mock gives (web has no ATT). */
  tracking?: TrackingStatus;
}

export interface MockRequest { format: AdFormat; placement: string; prefs: AdRequestPrefs }

const NOT_REQUIRED: ConsentInfo = { status: 'notRequired', canRequestAds: true, privacyOptionsRequired: false, personalized: false };

export class MockAdProvider implements AdProvider {
  readonly name = 'mock' as const;
  initialized = false;
  prefs: AdRequestPrefs | null = null;
  /** Everything that was shown, in order. */
  readonly requests: MockRequest[] = [];
  private ump: ConsentInfo = { status: 'unknown', canRequestAds: false, privacyOptionsRequired: false, personalized: false };
  private att: TrackingStatus;

  constructor(private readonly o: MockOptions) { this.att = o.tracking ?? 'unavailable'; }

  async init(prefs: AdRequestPrefs): Promise<void> { this.prefs = prefs; this.initialized = true; }
  setRequestPrefs(prefs: AdRequestPrefs): void { this.prefs = prefs; }
  preload(): void { /* nothing to load */ }
  isReady(): boolean { return this.initialized && (this.o.fill?.() ?? true); }

  async showRewarded(placement: string): Promise<RewardedResult> {
    if (!this.initialized || !this.prefs) return { rewarded: false, reason: 'error' };
    if (!(this.o.fill?.() ?? true)) return { rewarded: false, reason: 'noFill' };
    this.requests.push({ format: 'rewarded', placement, prefs: this.prefs });
    const watched = await present({ k: 'mockRewarded', ms: this.o.cfg.mock.rewardedMs }, this.o.headlessRewarded ?? true);
    return watched ? { rewarded: true } : { rewarded: false, reason: 'closed' };
  }

  async showInterstitial(placement: string): Promise<InterstitialResult> {
    if (!this.initialized || !this.prefs) return { shown: false, reason: 'error' };
    if (!(this.o.fill?.() ?? true)) return { shown: false, reason: 'noFill' };
    this.requests.push({ format: 'interstitial', placement, prefs: this.prefs });
    await present({ k: 'mockInterstitial', skipMs: this.o.cfg.mock.interstitialSkipMs }, null);
    return { shown: true };
  }

  readonly consent: AdConsentApi = {
    getStatus: async () => this.ump,
    gather: async () => {
      if ((this.o.region?.() ?? 'UNKNOWN') !== 'EEA') { this.ump = NOT_REQUIRED; return this.ump; }
      if (this.ump.status !== 'obtained') {
        const ok = await present({ k: 'ump' }, false);
        this.ump = { status: 'obtained', canRequestAds: true, privacyOptionsRequired: true, personalized: ok };
      }
      return this.ump;
    },
    showPrivacyOptions: async () => {
      const ok = await present({ k: 'ump' }, false);
      this.ump = { status: 'obtained', canRequestAds: true, privacyOptionsRequired: true, personalized: ok };
      return this.ump;
    },
    requestTracking: async () => this.att,
    getTracking: async () => this.att,
  };
}
