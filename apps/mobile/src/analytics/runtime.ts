/**
 * Runtime wiring of the analytics layer: the `analytics` singleton with its React Native dependencies (storage,
 * AppState, platform, providers), Remote Config refresh and the demo / test hook. Imports NO sibling feature
 * module (ads, monetization), so those can call the helpers in ./hooks without an import cycle; the consent
 * bridge to the ad layer lives in ./bridge.
 */
import { AppState, Platform } from 'react-native';
import { readItem, writeItem } from '../state/storage';
import { ANALYTICS_CONFIG, APP_VERSION } from './config';
import { AnalyticsCore } from './core';
import { loadRemoteConfigSource } from './firebaseSdk';
import { ANALYTICS_DEBUG, createProviders, debugBuffer } from './provider';
import { remoteConfig } from './remoteConfig';

const pad2 = (x: number) => (x < 10 ? `0${x}` : String(x));
const localDay = () => { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
const platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';

let providers: ReturnType<typeof createProviders> = [];
try { providers = createProviders(); } catch (e) { console.warn('[analytics] providers unavailable:', e); }

/** The facade: `analytics.track(name, params)`, `.screen()`, `.setUserProps()`, `.setAnalyticsConsent()`, `.resetData()`. */
export const analytics = new AnalyticsCore({
  providers, platform,
  kv: { read: readItem, write: writeItem },
  now: () => Date.now(),
  localDay,
  queueLimit: ANALYTICS_CONFIG.queueLimit,
  sessionGapMs: ANALYTICS_CONFIG.sessionGapMs,
  onReject: ANALYTICS_DEBUG ? (name, params) => console.warn('[analytics] rejected event', name, params) : undefined,
});

// ── remote config ───────────────────────────────────────────────────────────
function refreshRemoteConfig(): void {
  if (ANALYTICS_CONFIG.remoteConfigRequiresConsent && analytics.getConsent().analytics !== 'granted') return;
  void remoteConfig.refresh(loadRemoteConfigSource, ANALYTICS_DEBUG ? 0 : ANALYTICS_CONFIG.remoteConfigMinFetchSec);
}
remoteConfig.subscribe(() => { const v = remoteConfig.get('ab_variant'); if (v) analytics.setUserProps({ ab_variant: v }); });

// ── lifecycle ───────────────────────────────────────────────────────────────
let started = false;
/** Idempotent. Called once at module load; the game never waits for it. */
export function startAnalytics(): void {
  if (started) return;
  started = true;
  try {
    analytics.setUserProps({ app_version: APP_VERSION });
    if (AppState.currentState !== 'background') analytics.foreground();
    AppState.addEventListener('change', (st) => {
      if (st === 'active') { analytics.foreground(); refreshRemoteConfig(); }
      else if (st === 'background') analytics.background();
    });
    if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('pagehide', () => analytics.background());
    }
    analytics.subscribe(refreshRemoteConfig);
    void analytics.ready().then(refreshRemoteConfig);
  } catch (e) { console.warn('[analytics] start failed:', e); }
}
startAnalytics();

// ── demo / test hook ────────────────────────────────────────────────────────
/**
 * Never in production (same rule as the ad layer's hook). `window.__mottoAnalytics`:
 *   buffer()            every row the demo sinks received (what would have left the device)
 *   events(sink?)       just the event names, in order
 *   pending()           events waiting on the device for a consent answer
 *   consent()           current consent snapshot
 *   setAnalytics(bool)  answer the analytics switch · reset() "delete my data" · rc: Remote Config (apply({...}))
 */
if (ANALYTICS_DEBUG && Platform.OS === 'web' && typeof window !== 'undefined') {
  (window as unknown as { __mottoAnalytics?: unknown }).__mottoAnalytics = {
    core: analytics,
    buffer: () => debugBuffer.all(),
    events: (sink?: string) => debugBuffer.all().filter((e) => e.kind === 'event' && (!sink || e.sink.startsWith(sink))).map((e) => e.name),
    pending: () => analytics.pending(),
    consent: () => analytics.getConsent(),
    setAnalytics: (on: boolean) => analytics.setAnalyticsConsent(on),
    reset: () => analytics.resetData(),
    rc: remoteConfig,
  };
}
