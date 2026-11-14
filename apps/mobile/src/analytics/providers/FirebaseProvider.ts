/**
 * Firebase provider: Google Analytics for Firebase + Crashlytics behind one consent purpose (`analytics`).
 *
 * The SDK is injected (`FirebaseSdk`): native builds get the React Native Firebase binding (firebaseSdk.native.ts,
 * required lazily at `init`, i.e. only after consent); tests get a recording fake. Natively, collection is OFF
 * by default (apps/mobile/firebase.json: analytics / crashlytics auto collection disabled, Consent Mode defaults
 * denied), so a build where this provider never initialises sends nothing.
 */
import { consentModeV2, type ConsentSnapshot } from '../consent';
import type { EventName, Params } from '../events';
import type { AnalyticsProvider } from './types';

export interface FirebaseSdk {
  setConsent(c: { analytics_storage: boolean; ad_storage: boolean; ad_user_data: boolean; ad_personalization: boolean }): Promise<void>;
  setAnalyticsCollectionEnabled(on: boolean): Promise<void>;
  setCrashlyticsCollectionEnabled(on: boolean): Promise<void>;
  logEvent(name: string, params: Record<string, unknown>): Promise<void>;
  setUserProperties(props: Record<string, string | null>): Promise<void>;
  resetAnalyticsData(): Promise<void>;
  deleteUnsentCrashReports(): Promise<void>;
  recordError(error: Error, name?: string): void;
}

export interface FirebaseProviderOptions {
  /** Resolves the SDK, or null when the native module / google-services files are not in this binary. */
  load: () => Promise<FirebaseSdk | null> | FirebaseSdk | null;
  /**
   * Events NOT forwarded to Firebase. `ad_impression` belongs here when AdMob is linked to the Firebase project:
   * the Google Mobile Ads SDK then logs `ad_impression` (with revenue) itself and a manual copy would double it.
   */
  skip?: readonly EventName[];
}

const swallow = (p: Promise<unknown> | void): void => { if (p && typeof (p as Promise<unknown>).catch === 'function') void (p as Promise<unknown>).catch(() => undefined); };

/** GA4 `purchase` wants `items[]` for the item reports; value / currency drive the revenue reports. */
export function firebaseParams(name: EventName, p: Params): Record<string, unknown> {
  if (name !== 'purchase') return p;
  return { ...p, items: [{ item_id: p.sku, item_name: p.sku, item_category: 'iap', quantity: 1, price: p.value }] };
}

export class FirebaseProvider implements AnalyticsProvider {
  readonly name = 'firebase';
  readonly purpose = 'analytics' as const;
  private sdk: FirebaseSdk | null = null;
  private readonly skipped: ReadonlySet<EventName>;

  constructor(private readonly opts: FirebaseProviderOptions) { this.skipped = new Set(opts.skip ?? []); }

  accepts(name: EventName): boolean { return !this.skipped.has(name); }

  async init(consent: ConsentSnapshot): Promise<void> {
    const sdk = await this.opts.load();
    if (!sdk) throw new Error('firebase unavailable');
    this.sdk = sdk;
    await this.apply(consent);
  }

  /** Consent Mode v2 first, then the collection switches (so nothing is collected under stale signals). */
  private async apply(consent: ConsentSnapshot): Promise<void> {
    const sdk = this.sdk;
    if (!sdk) return;
    const on = consent.analytics === 'granted';
    await sdk.setConsent(consentModeV2(consent));
    await sdk.setAnalyticsCollectionEnabled(on);
    await sdk.setCrashlyticsCollectionEnabled(on);
    if (!on) await sdk.deleteUnsentCrashReports();
  }

  setConsent(consent: ConsentSnapshot): Promise<void> { return this.apply(consent); }

  logEvent(name: EventName, params: Params): void {
    if (this.sdk && !this.skipped.has(name)) swallow(this.sdk.logEvent(name, firebaseParams(name, params)));
  }

  setUserProps(props: Readonly<Record<string, string>>): void { if (this.sdk) swallow(this.sdk.setUserProperties({ ...props })); }

  /** New app-instance id; data already uploaded is deleted through the Firebase console / User Deletion API (doc 17 §5.4). */
  async reset(): Promise<void> {
    if (!this.sdk) return;
    await this.sdk.resetAnalyticsData();
    await this.sdk.deleteUnsentCrashReports();
  }

  recordError(error: Error, scope: string): void { try { this.sdk?.recordError(error, scope); } catch { /* reporter must not throw */ } }
}
