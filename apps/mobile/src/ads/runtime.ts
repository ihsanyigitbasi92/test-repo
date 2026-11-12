/**
 * Runtime wiring of the ad layer: the `ads` singleton with its React Native dependencies (storage, platform,
 * entitlement store, provider) and the demo / test hooks. Game code imports from here (or from ./index).
 */
import { Platform } from 'react-native';
import { hasNoAds, onEntitlementsChange } from '../monetization/entitlements';
import { readItem, writeItem } from '../state/storage';
import { AdService } from './adService';
import { AD_CONFIG } from './config';
import { countryOfLocaleTag, type AdPlatform, type Region } from './consent';
import { createAdProvider } from './provider';

const pad2 = (x: number) => (x < 10 ? `0${x}` : String(x));
const localDay = () => { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };

/** Best effort only (no location permission, no IP lookup): device locale region, then the Istanbul time zone. */
function deviceCountry(): string | null {
  try {
    const c = countryOfLocaleTag(Intl.DateTimeFormat().resolvedOptions().locale);
    if (c) return c;
  } catch { /* no Intl */ }
  try {
    const nav = (globalThis as { navigator?: { language?: string; languages?: readonly string[] } }).navigator;
    for (const tag of [nav?.language, ...(nav?.languages ?? [])]) { const c = countryOfLocaleTag(tag); if (c) return c; }
  } catch { /* no navigator */ }
  try { if (Intl.DateTimeFormat().resolvedOptions().timeZone === 'Europe/Istanbul') return 'TR'; } catch { /* no Intl */ }
  return null;
}

const platform: AdPlatform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';

export const ads: AdService = new AdService({
  cfg: AD_CONFIG,
  provider: createAdProvider(AD_CONFIG, () => ads.region()),
  platform,
  kv: { read: readItem, write: writeItem },
  now: () => Date.now(),
  localDay,
  noAds: hasNoAds,
  onNoAdsChange: onEntitlementsChange,
  country: deviceCountry,
});

// ── demo / test hooks ───────────────────────────────────────────────────────
/**
 * Never in production: native needs a development build (`__DEV__`); the web export is the demo and has the hooks
 * unless it was built with EXPO_PUBLIC_MOTTO_ENV=production.
 *   ?adsDebug=1        exposes `window.__mottoAds`
 *   ?adsDebug=relaxed  also removes the waiting gates (first session, 10 min, 6 h away, cooldowns) — caps, the
 *                      consent step, the grief / death / decision rules stay exactly as shipped
 *   ?adsRegion=EEA     pretends to be in a region (TR | EEA | US | OTHER) to see its consent flow
 */
export const ADS_DEBUG: boolean = Platform.OS === 'web' ? process.env.EXPO_PUBLIC_MOTTO_ENV !== 'production' : __DEV__;

export function relaxAdGates(): void {
  Object.assign(AD_CONFIG.ftue, { minSessionCount: 1, minPlayMs: 0, firstLifeMinAge: 0 });
  Object.assign(AD_CONFIG.interstitial, { minSessionCount: 1, minAwayMs: 0, minGapMs: 0 });
  Object.assign(AD_CONFIG.consent, { minSessionCount: 1, attMinSessionCount: 1 });
  Object.assign(AD_CONFIG.rewarded, { cooldownMs: 0, offersPerSession: 99 });
  Object.assign(AD_CONFIG.session, { gapMs: 0 });
}

const debugHooks: Record<string, unknown> = { ads, relax: relaxAdGates, config: AD_CONFIG };
/** The game registers its own demo actions here (e.g. "mount the sponsor offer now"). No-op outside debug. */
export function registerAdDebug(name: string, fn: (...a: never[]) => unknown): void { if (ADS_DEBUG) debugHooks[name] = fn; }

if (ADS_DEBUG && Platform.OS === 'web' && typeof window !== 'undefined') {
  try {
    const q = new URLSearchParams(window.location.search);
    const mode = q.get('adsDebug');
    if (mode) (window as unknown as { __mottoAds?: unknown }).__mottoAds = debugHooks;
    if (mode === 'relaxed') relaxAdGates();
    const region = (q.get('adsRegion') ?? '').toUpperCase();
    if (['TR', 'EEA', 'US', 'OTHER'].includes(region)) ads.setRegion(region as Region);
  } catch { /* no URL */ }
}
