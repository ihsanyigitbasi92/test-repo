/**
 * Provider wiring — web and vitest (Metro / vite resolve this file, never `provider.native.ts`): no native SDK
 * exists here. Outside production the demo providers record what Firebase and Meta WOULD receive, under exactly
 * the same consent gate, into one inspectable buffer (`window.__mottoAnalytics`).
 */
import { DebugBuffer, DebugProvider } from './providers/DebugProvider';
import { MetaProvider, type MetaSdk } from './providers/MetaProvider';
import type { AnalyticsProvider } from './providers/types';

export const ANALYTICS_DEBUG: boolean = process.env.EXPO_PUBLIC_MOTTO_ENV !== 'production';
export const debugBuffer = new DebugBuffer(1000, null);

/** A Meta SDK double: every call the real SDK would get becomes a buffer row (sink `meta`). */
export function recordingMetaSdk(buffer: DebugBuffer): MetaSdk {
  const row = (name: string, params: Record<string, unknown> = {}) => buffer.push({ sink: 'meta', kind: 'event', name, params });
  return {
    initializeSDK: () => buffer.push({ sink: 'meta', kind: 'init' }),
    setAutoLogAppEventsEnabled: (on) => buffer.push({ sink: 'meta', kind: 'consent', name: 'autoLogAppEvents', params: { on } }),
    setAdvertiserIDCollectionEnabled: (on) => buffer.push({ sink: 'meta', kind: 'consent', name: 'advertiserIDCollection', params: { on } }),
    setAdvertiserTrackingEnabled: async (on) => { buffer.push({ sink: 'meta', kind: 'consent', name: 'advertiserTracking', params: { on } }); },
    setDataProcessingOptions: (options) => buffer.push({ sink: 'meta', kind: 'consent', name: 'dataProcessingOptions', params: { options: options.join(',') } }),
    logEvent: (name, valueToSum, params) => row(name, valueToSum === undefined ? params : { ...params, _valueToSum: valueToSum }),
    logPurchase: (amount, currency, params) => row('fb_mobile_purchase', { ...params, _valueToSum: amount, fb_currency: currency }),
    flush: () => undefined,
  };
}

export function createProviders(): AnalyticsProvider[] {
  if (!ANALYTICS_DEBUG) return [];
  return [
    new DebugProvider(debugBuffer, 'analytics', 'firebase(demo)'),
    new MetaProvider({ platform: 'web', load: () => recordingMetaSdk(debugBuffer) }),
  ];
}
