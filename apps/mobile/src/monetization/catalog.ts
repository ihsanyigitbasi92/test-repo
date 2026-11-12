/**
 * Product catalog (06 §2.2 + docs/design/14). Pure TS, store-agnostic: what exists, what it grants, which phase it
 * ships in. Store prices are NEVER taken from here on a real store — the shop shows the `priceString` the store
 * returns (VAT-inclusive where the storefront includes it). `fallbackPrice` feeds only the mock / demo provider.
 *
 * Rules encoded in the types (06 §2.2.1, D-040, D-041): no subscription kind, `randomness: false` on every product,
 * and nothing from `NEVER_SOLD` may appear as a product id or feature (test/monetization.test.ts).
 */
export type Sku = 'no_ads' | 'torpil' | 'tickets_5' | `season_${string}`;
/** Durable ownership. Consumables are not entitlements: tickets live in the ledger (entitlements.ts). */
export type EntitlementId = 'no_ads' | 'torpil' | `season_${string}`;
export type ProductKind = 'non_consumable' | 'consumable';          // no 'subscription' (D-041)
export type Phase = 'mvp' | 'soft' | 'v1';

export type Feature =
  | 'ads.interstitial.off' | 'persona.kader' | 'persona.extra'
  | 'report.themes.torpil' | 'stamp.inks' | 'notebook.archive.unlimited' | 'notebook.export' | 'profiles.3'
  | `season.${string}.camps` | `season.${string}.events` | `season.${string}.persona` | `season.${string}.themes`;

export interface Product {
  id: Sku;
  kind: ProductKind;
  /** Features unlocked while owned ([] for consumables). */
  grants: readonly Feature[];
  /** Consumable payload: Practice Tickets credited once per store transaction. */
  tickets?: number;
  availableFrom: Phase;
  /** Fixed contents, no chance involved — type-level constant (D-040, Apple 3.1.1 odds rule never applies). */
  randomness: false;
  /** Demo / mock prices only (06 §2.2.1 list prices; `no_ads` is a proposal, see doc 14 §3). */
  fallbackPrice: { TRY: number; USD: number };
}

export const SEASON_1 = 'season_2701' as const;

export const CATALOG: readonly Product[] = [
  // "Reklamsız": interstitials off, nothing else. Not in 06's table — added by doc 14 (D-ÖNERİ-14-01).
  { id: 'no_ads', kind: 'non_consumable', grants: ['ads.interstitial.off'], availableFrom: 'mvp', randomness: false,
    fallbackPrice: { TRY: 89.99, USD: 2.99 } },
  // Torpil (D-038): a menu change, never a life change. Includes everything `no_ads` grants.
  { id: 'torpil', kind: 'non_consumable', availableFrom: 'mvp', randomness: false,
    grants: ['ads.interstitial.off', 'notebook.archive.unlimited', 'profiles.3', 'report.themes.torpil', 'stamp.inks', 'notebook.export', 'persona.kader', 'persona.extra'],
    fallbackPrice: { TRY: 199.99, USD: 6.99 } },
  // Practice Tickets ×5 (06 §2.2.4): a ticket instead of a rewarded ad; never opens a cap; device-local.
  { id: 'tickets_5', kind: 'consumable', grants: [], tickets: 5, availableFrom: 'soft', randomness: false,
    fallbackPrice: { TRY: 29.99, USD: 0.99 } },
  // Season Pack (D-040): fixed, counted contents; stays on sale forever.
  { id: SEASON_1, kind: 'non_consumable', availableFrom: 'v1', randomness: false,
    grants: ['season.2701.camps', 'season.2701.events', 'season.2701.persona', 'season.2701.themes'],
    fallbackPrice: { TRY: 119.99, USD: 3.99 } },
];

export const SKUS: readonly Sku[] = CATALOG.map((p) => p.id);
export const productOf = (sku: Sku): Product | undefined => CATALOG.find((p) => p.id === sku);
export const isSku = (x: unknown): x is Sku => typeof x === 'string' && CATALOG.some((p) => p.id === x);
/** Non-consumable SKU ids double as entitlement ids. */
export const isEntitlementId = (x: unknown): x is EntitlementId => isSku(x) && productOf(x)!.kind === 'non_consumable';

/** Features of a set of owned entitlements (union). */
export function featuresOf(owned: Iterable<EntitlementId>): Set<Feature> {
  const out = new Set<Feature>();
  for (const id of owned) for (const f of productOf(id)?.grants ?? []) out.add(f);
  return out;
}

/** True when `a` grants everything `b` grants (Torpil ⊇ Reklamsız): `b` is then shown as "included". */
export function covers(a: Sku, b: Sku): boolean {
  const pa = productOf(a), pb = productOf(b);
  if (!pa || !pb || a === b || pb.kind !== 'non_consumable' || !pb.grants.length) return false;
  return pb.grants.every((f) => pa.grants.includes(f));
}

/** Negative catalog (06 §2.2.5, D-029 / D-055): concepts that are never a product, a feature or a ticket use. */
export const NEVER_SOLD = ['streak', 'injuryLeave', 'makeup', 'deathReturn', 'lifeExtension', 'kondisyon', 'diagnosis',
  'campScore', 'statEdit', 'wagerOdds', 'envelope', 'speed', 'notification', 'lootBox', 'subscription', 'banner', 'excessBaggage'] as const;
