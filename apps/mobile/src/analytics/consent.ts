/**
 * Analytics consent — pure (no React Native imports; unit-tested in node). docs/design/17 §5.
 *
 * D-161 (owner decision, 2026-11-13): analytics is ON by default after the age gate (adult and 16–17), except in
 * EEA / UK / CH / unknown regions where it stays gated on the privacy card's analytics switch. Marketing (Meta,
 * ad-id, ad signals) is unchanged: personalised-ads opt-in + iOS ATT. Under 16: nothing.
 *
 * Two separate purposes (11 §2.2.4, D-104):
 *   analytics  "Analitik paylaşımı"        → Firebase Analytics + Crashlytics (+ Remote Config fetch, see config.ts)
 *   marketing  "Kişiselleştirilmiş reklam" → Meta App Events (campaign measurement) and Firebase's ad signals.
 *              This one is owned by the ad layer (src/ads ConsentState.adsPersonalized + iOS ATT); it is only READ here.
 * Both start OFF. `unknown` (not asked yet) queues events on the device; `denied` drops them; nothing leaves the
 * device before `granted`. A known minor (D-102) is `denied` for both and the switch is locked.
 *
 * Nothing here is legal advice — the open questions are listed in docs/design/17 §11.
 */
export type Purpose = 'analytics' | 'marketing';
export type PurposeState = 'unknown' | 'granted' | 'denied';
export type Platform = 'ios' | 'android' | 'web';

/** The player's own answer to the analytics switch. `null`: never asked. */
export interface AnalyticsChoice {
  analytics: boolean | null;
  /** Local day of the answer ('YYYY-MM-DD'); kept on the device only (proof of when consent was given). */
  decidedDay: string | null;
  /** Version of the notice text the answer was given under; a newer NOTICE_VERSION asks again. */
  noticeVersion: number;
}
export const NOTICE_VERSION = 1;
export const emptyChoice = (): AnalyticsChoice => ({ analytics: null, decidedDay: null, noticeVersion: 0 });

/** The fields of the ad layer's ConsentState (src/ads/consent.ts) this module reads — structural, no import. */
export interface AdsConsentView {
  resolved: boolean;
  adsPersonalized: boolean;
  isMinor: boolean;
  att: 'authorized' | 'denied' | 'restricted' | 'undetermined' | 'unavailable' | 'skipped';
  /**
   * The ad layer's single "cross-app tracking / advertising-id use is OK" flag (src/ads/consentApi.ts):
   * opt-in + not a minor + (iOS) ATT authorised. When present, marketing is never `granted` without it.
   */
  trackingAllowed?: boolean;
  /**
   * Neutral age gate (src/ads/ageGate.ts). `loading` / `ask`: not answered yet → NOTHING is initialised (both
   * purposes stay `unknown`, events wait on the device). `blocked` (younger than the 16+ rating, which covers every
   * under-13 case): both purposes `denied`, the device queue is dropped, no SDK is ever started. `minor`: both denied.
   * Absent (older builds, tests): treated as answered.
   */
  age?: 'loading' | 'ask' | 'blocked' | 'minor' | 'adult';
  /**
   * Ad-layer region (src/ads/consent.ts `Region`). D-161: analytics is ON by default after the age gate everywhere
   * except EEA / UK / CH — and an unknown region, which might be one of them — where it stays gated on consent
   * (the analytics switch of the single privacy card). Absent (older builds, tests): treated as unknown → gated.
   */
  region?: 'TR' | 'EEA' | 'US' | 'OTHER' | 'UNKNOWN';
}
export const NO_ADS_CONSENT: AdsConsentView = { resolved: false, adsPersonalized: false, isMinor: false, att: 'undetermined' };

const ageUnknown = (ads: AdsConsentView): boolean => ads.age === 'loading' || ads.age === 'ask';
const isMinorView = (ads: AdsConsentView): boolean => ads.isMinor || ads.age === 'minor' || ads.age === 'blocked';

export interface ConsentSnapshot {
  analytics: PurposeState;
  marketing: PurposeState;
  /** iOS: ATT authorised (Meta `setAdvertiserTrackingEnabled`, IDFA). Always false elsewhere unless marketing is granted on Android. */
  advertiserTracking: boolean;
  minor: boolean;
}

/** D-161 (owner decision): regions where anonymous usage analytics + crash reports run by default after the age gate. */
export function analyticsDefaultOn(region: AdsConsentView['region']): boolean {
  return region === 'TR' || region === 'US' || region === 'OTHER';
}

/**
 * `defaultOn` (D-161): no question, analytics runs for adults and 16–17 alike (no advertising id, no ad signals —
 * those are the marketing purpose). An explicit "no" stored by an older build is still honoured.
 * Gated regions: unknown until answered, locked off for a minor (as before).
 */
export function analyticsState(choice: AnalyticsChoice, minor: boolean, defaultOn = false): PurposeState {
  if (defaultOn) return choice.analytics === false ? 'denied' : 'granted';
  if (minor) return 'denied';
  if (choice.analytics === null || choice.noticeVersion < NOTICE_VERSION) return 'unknown';
  return choice.analytics ? 'granted' : 'denied';
}

/**
 * Marketing measurement: explicit opt-in to personalised ads AND (iOS) ATT authorised. While the ad consent step
 * or the ATT prompt has not been answered yet the state is `unknown`; there is exactly ONE ATT prompt, the ad
 * layer's (ads.runAtt) — this module never asks.
 */
export function marketingState(ads: AdsConsentView, platform: Platform): PurposeState {
  if (isMinorView(ads)) return 'denied';
  if (ageUnknown(ads) || !ads.resolved) return 'unknown';
  if (!ads.adsPersonalized) return 'denied';
  let st: PurposeState;
  if (platform !== 'ios') st = 'granted';
  else if (ads.att === 'authorized') st = 'granted';
  else st = ads.att === 'undetermined' ? 'unknown' : 'denied';
  return st === 'granted' && ads.trackingAllowed === false ? 'denied' : st;
}

export function deriveConsent(choice: AnalyticsChoice, ads: AdsConsentView, platform: Platform): ConsentSnapshot {
  const minor = isMinorView(ads);
  const blocked = ads.age === 'blocked';
  const marketing = marketingState(ads, platform);
  const defaultOn = !blocked && !ageUnknown(ads) && analyticsDefaultOn(ads.region);
  const analytics = blocked ? 'denied' : ageUnknown(ads) && !minor ? 'unknown' : analyticsState(choice, minor, defaultOn);
  return { analytics, marketing, advertiserTracking: marketing === 'granted', minor };
}

export const UNKNOWN_CONSENT: ConsentSnapshot = { analytics: 'unknown', marketing: 'unknown', advertiserTracking: false, minor: false };
export const purposeState = (c: ConsentSnapshot, p: Purpose): PurposeState => c[p];

/** Google Consent Mode v2 signals (Firebase `setConsent`). Everything is denied unless explicitly granted. */
export interface ConsentModeV2 { analytics_storage: boolean; ad_storage: boolean; ad_user_data: boolean; ad_personalization: boolean }
export function consentModeV2(c: ConsentSnapshot): ConsentModeV2 {
  const ad = c.marketing === 'granted';
  return { analytics_storage: c.analytics === 'granted', ad_storage: ad, ad_user_data: ad, ad_personalization: ad };
}

/** The player answered the analytics switch. A minor's switch is locked off. */
export function applyAnalyticsChoice(on: boolean, minor: boolean, localDay: string): AnalyticsChoice {
  return { analytics: on && !minor, decidedDay: localDay, noticeVersion: NOTICE_VERSION };
}
