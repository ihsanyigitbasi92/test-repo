/**
 * Provider contract (10 `AnalyticsPort`, D-054). The facade never sees an SDK; a provider never sees consent
 * logic: the core calls `init()` only once the provider's purpose is granted, and nothing before that.
 * A publisher's MMP (Adjust / AppsFlyer / Singular) or GameAnalytics plugs in as one more provider.
 */
import type { ConsentSnapshot, Purpose } from '../consent';
import type { EventName, Params } from '../events';

export interface AnalyticsProvider {
  readonly name: string;
  /** The consent purpose that must be `granted` before this provider is initialised or receives anything. */
  readonly purpose: Purpose;
  /** Only these events are queued / delivered (undefined: every catalog event). */
  accepts?(name: EventName): boolean;
  /** Starts the SDK. Called at most once at a time, and only while `purpose` is granted. May reject. */
  init(consent: ConsentSnapshot): Promise<void>;
  /** Consent changed while the SDK is running (including the revoke: switch collection off). */
  setConsent(consent: ConsentSnapshot): void | Promise<void>;
  logEvent(name: EventName, params: Params): void;
  setUserProps(props: Readonly<Record<string, string>>): void;
  /** "Verilerimi sil": reset the analytics instance id / delete what the SDK holds on the device. */
  reset(): void | Promise<void>;
  /** Non-fatal error for the crash reporter (only providers that have one). */
  recordError?(error: Error, scope: string): void;
}
