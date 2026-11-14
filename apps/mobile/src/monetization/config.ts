/**
 * Monetization configuration. Everything an owner has to paste lives in app.json → expo.extra.monetization
 * (RevenueCat public SDK keys, store product ids, legal URLs); this file only reads and validates it.
 * Values starting with "PLACEHOLDER" are treated as "not configured": the native build then runs with purchases
 * switched off (never with the mock — a release binary must not hand out entitlements for free).
 */
import appJson from '../../app.json';
import type { Feature, Phase, Sku } from './catalog';

interface MonetizationExtra {
  revenueCat?: { iosApiKey?: string; androidApiKey?: string };
  productIds?: { ios?: Partial<Record<string, string>>; android?: Partial<Record<string, string>> };
  legal?: { termsUrl?: string; privacyUrl?: string };
}
const extra = ((appJson as { expo?: { extra?: { company?: string; monetization?: MonetizationExtra } } }).expo?.extra) ?? {};
const m: MonetizationExtra = extra.monetization ?? {};

export const isPlaceholder = (v: string | undefined | null): boolean => !v || v.startsWith('PLACEHOLDER');

export const SELLER = extra.company ?? 'D2P Technology';
export const REVENUECAT_KEYS = { ios: m.revenueCat?.iosApiKey ?? '', android: m.revenueCat?.androidApiKey ?? '' };
export const LEGAL_URLS = {
  terms: m.legal?.termsUrl ?? '', privacy: m.legal?.privacyUrl ?? '',
  refundIos: 'https://reportaproblem.apple.com', refundAndroid: 'https://play.google.com/store/account/orderhistory',
};

/** Store product id of a SKU on a platform (falls back to the SKU itself, which is what the mock uses). */
export function storeIdOf(sku: Sku, platform: 'ios' | 'android'): string {
  const id = m.productIds?.[platform]?.[sku];
  return id && !isPlaceholder(id) ? id : sku;
}

/** Release phase of this build: products of a later phase are not listed. */
export const BUILD_PHASE: Phase = 'mvp';
const PHASE_ORDER: Record<Phase, number> = { mvp: 0, soft: 1, v1: 2 };
export const phaseReached = (p: Phase): boolean => PHASE_ORDER[p] <= PHASE_ORDER[BUILD_PHASE];

/**
 * Features this build really delivers. A shop card lists ONLY these (06 §2.2.2 "sürüm kapılı pazarlama",
 * Apple 2.3.1 / Reklam Kurulu: nothing is promised that the binary does not do). Add a feature here in the same
 * PR that ships it.
 */
export const SHIPPED_FEATURES: readonly Feature[] = ['ads.interstitial.off'];

/**
 * On-sale switch per SKU for real stores. `torpil` stays off until at least one Torpil-only feature ships
 * (today it would sell the same thing as `no_ads` for more). The demo store (mock provider) lists DEMO_ON_SALE
 * so the whole flow can be exercised without a store account.
 */
export const ON_SALE: Partial<Record<Sku, boolean>> = { no_ads: true, torpil: false, tickets_5: false };
export const DEMO_ON_SALE: Partial<Record<Sku, boolean>> = { no_ads: true, torpil: true, tickets_5: false };
