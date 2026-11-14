/**
 * Ad layer contracts (06 §2.3–2.4, 10 `AdProvider`). Two formats only — rewarded and interstitial. There is no
 * banner method on purpose (D-106 "no mid-game ads"; banners are out of the design for good).
 */
export type AdFormat = 'rewarded' | 'interstitial';

/** What every ad request carries; derived from the consent state by `requestPrefs` (consent.ts). */
export interface AdRequestPrefs {
  /** true until the player explicitly allowed personalised ads (and, on iOS, tracking). */
  nonPersonalizedOnly: boolean;
  tagForUnderAgeOfConsent: boolean;
  tagForChildDirectedTreatment: boolean;
  maxAdContentRating: 'G' | 'PG' | 'T' | 'MA';
}

/** `closed`: the player left before the reward · `noFill`: no ad came (cap not spent) · `error`: SDK failure. */
export type RewardedResult = { rewarded: true } | { rewarded: false; reason: 'closed' | 'noFill' | 'error' };
export type InterstitialResult = { shown: boolean; reason?: 'noFill' | 'error' };

export type UmpStatus = 'unknown' | 'required' | 'notRequired' | 'obtained';
export interface ConsentInfo {
  status: UmpStatus;
  /** UMP `canRequestAds`: the SDK may be initialised and ads requested. */
  canRequestAds: boolean;
  /** A privacy-options entry point must be offered (EEA / regulated US states). */
  privacyOptionsRequired: boolean;
  /** Only meaningful when status is `obtained`: the player allowed personalised ads in the UMP form. */
  personalized: boolean;
}
export type TrackingStatus = 'authorized' | 'denied' | 'restricted' | 'undetermined' | 'unavailable';

export interface AdConsentApi {
  /** Last known UMP state without showing anything. */
  getStatus(): Promise<ConsentInfo>;
  /** Refreshes UMP info and shows Google's form when (and only when) it is required. */
  gather(opts: { underAgeOfConsent: boolean }): Promise<ConsentInfo>;
  /** Re-opens Google's privacy options form (Settings entry). */
  showPrivacyOptions(): Promise<ConsentInfo>;
  /** iOS App Tracking Transparency system dialog (the caller shows the pre-prompt first). */
  requestTracking(): Promise<TrackingStatus>;
  getTracking(): Promise<TrackingStatus>;
}

export interface AdProvider {
  readonly name: 'mock' | 'admob';
  /** Starts the SDK. Never called before the consent gate allows it (D-054: no SDK before consent). */
  init(prefs: AdRequestPrefs): Promise<void>;
  readonly initialized: boolean;
  /** Consent changed: later requests use the new prefs (already loaded ads are dropped). */
  setRequestPrefs(prefs: AdRequestPrefs): void;
  preload(format: AdFormat): void;
  isReady(format: AdFormat): boolean;
  /** Resolves when the ad is closed. The reward exists only if `rewarded` is true. */
  showRewarded(placement: string): Promise<RewardedResult>;
  showInterstitial(placement: string): Promise<InterstitialResult>;
  readonly consent: AdConsentApi;
}
