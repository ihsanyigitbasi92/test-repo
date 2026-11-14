/**
 * Analytics configuration: reads app.json › expo.extra.analytics (the only place an owner edits) — pure TS.
 * Values starting with "PLACEHOLDER" mean "not configured": that provider is simply not created.
 */
import appJson from '../../app.json';

interface AnalyticsExtra {
  firebase?: { admobLinked?: boolean; remoteConfigRequiresConsent?: boolean };
  meta?: { appId?: string; clientToken?: string };
}
const expo = (appJson as { expo?: { version?: string; extra?: { analytics?: AnalyticsExtra } } }).expo ?? {};
const a: AnalyticsExtra = expo.extra?.analytics ?? {};

export const isPlaceholder = (v: string | undefined | null): boolean => !v || v.startsWith('PLACEHOLDER');

export const APP_VERSION: string = expo.version ?? '0.0.0';

export const ANALYTICS_CONFIG = {
  /**
   * AdMob is linked to the Firebase project (doc 17 §6 step 7): the Google Mobile Ads SDK then logs
   * `ad_impression` with revenue itself, so the manual copy is NOT sent to Firebase (it still goes to Meta).
   */
  admobLinked: a.firebase?.admobLinked !== false,
  /**
   * Remote Config is fetched only once the analytics switch is on. Conservative default: the fetch sends a
   * Firebase installation id to Google. Whether it may run without consent is lawyer question 17 §11 #4.
   */
  remoteConfigRequiresConsent: a.firebase?.remoteConfigRequiresConsent !== false,
  remoteConfigMinFetchSec: 12 * 3600,
  metaConfigured: !isPlaceholder(a.meta?.appId) && !isPlaceholder(a.meta?.clientToken),
  /** Pre-consent queue cap per purpose (oldest dropped). A first session is ≈ 60–120 events. */
  queueLimit: 400,
  sessionGapMs: 10 * 60_000,
} as const;
