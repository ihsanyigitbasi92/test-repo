/**
 * Meta (Facebook) App Events provider — campaign measurement, purpose `marketing`.
 *
 * Never initialised before the player opted in to personalised ads / measurement on the consent card and, on
 * iOS, authorised tracking in the ONE ATT prompt (the ad layer's). The native defaults are all off (config
 * plugin: isAutoInitEnabled / autoLogAppEventsEnabled / advertiserIDCollectionEnabled = false), so until
 * `init()` runs the SDK neither starts nor logs installs.
 *
 * On revoke: auto-logging, advertiser-id collection and advertiser tracking are switched off again and Limited
 * Data Use is set; later events are dropped by the core before they get here.
 */
import type { ConsentSnapshot } from '../consent';
import type { EventName, Params } from '../events';
import { isMetaMapped, toMeta } from './metaMap';
import type { AnalyticsProvider } from './types';

export interface MetaSdk {
  initializeSDK(): void;
  setAutoLogAppEventsEnabled(on: boolean): void;
  setAdvertiserIDCollectionEnabled(on: boolean): void;
  /** iOS only (ATE flag); a no-op resolve elsewhere. */
  setAdvertiserTrackingEnabled(on: boolean): Promise<unknown> | void;
  /** `[]`: no restriction · `['LDU'], 0, 0`: Limited Data Use, Meta geolocates (US state privacy laws). */
  setDataProcessingOptions(options: string[], country?: number, state?: number): void;
  logEvent(name: string, valueToSum: number | undefined, params: Record<string, string | number>): void;
  logPurchase(amount: number, currency: string, params: Record<string, string | number>): void;
  flush(): void;
}

export interface MetaProviderOptions {
  load: () => Promise<MetaSdk | null> | MetaSdk | null;
  platform: 'ios' | 'android' | 'web';
  /** Data-processing options while consent is granted. Default: LDU with geolocation by Meta (safe for US states). */
  dataProcessing?: { options: string[]; country: number; state: number };
}

export class MetaProvider implements AnalyticsProvider {
  readonly name = 'meta';
  readonly purpose = 'marketing' as const;
  private sdk: MetaSdk | null = null;
  private on = false;

  constructor(private readonly opts: MetaProviderOptions) {}

  accepts(name: EventName): boolean { return isMetaMapped(name); }

  async init(consent: ConsentSnapshot): Promise<void> {
    if (consent.marketing !== 'granted') throw new Error('meta: no consent');
    const sdk = await this.opts.load();
    if (!sdk) throw new Error('meta unavailable');
    this.sdk = sdk;
    await this.apply(consent, true);
  }

  private async apply(consent: ConsentSnapshot, start: boolean): Promise<void> {
    const sdk = this.sdk;
    if (!sdk) return;
    const on = consent.marketing === 'granted';
    this.on = on;
    const dp = this.opts.dataProcessing ?? { options: ['LDU'], country: 0, state: 0 };
    if (on) sdk.setDataProcessingOptions(dp.options, dp.country, dp.state);
    else sdk.setDataProcessingOptions(['LDU'], 0, 0);
    if (this.opts.platform === 'ios') await sdk.setAdvertiserTrackingEnabled(on && consent.advertiserTracking);
    sdk.setAdvertiserIDCollectionEnabled(on);
    sdk.setAutoLogAppEventsEnabled(on);
    if (on && start) sdk.initializeSDK();          // logs install / fb_mobile_activate_app now that auto-logging is on
  }

  setConsent(consent: ConsentSnapshot): Promise<void> { return this.apply(consent, false); }

  logEvent(name: EventName, params: Params): void {
    const sdk = this.sdk;
    if (!sdk || !this.on) return;
    const call = toMeta(name, params);
    if (!call) return;
    if (call.kind === 'purchase') sdk.logPurchase(call.amount, call.currency, call.params);
    else sdk.logEvent(call.name, call.valueToSum, call.params);
  }

  /** Meta gets no user properties: nothing in the catalog is needed for attribution. */
  setUserProps(): void { /* intentionally nothing */ }

  reset(): void { try { this.sdk?.flush(); } catch { /* nothing to flush */ } }
}
