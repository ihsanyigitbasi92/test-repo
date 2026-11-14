/**
 * Purchases without a store: the entitlement cache, the purchase / restore / reconcile rules (06 §2.6) and the
 * catalog's negative tests (06 §2.2.5), driven through MockIapProvider and a fake RevenueCat SDK.
 */
import { describe, expect, it } from 'vitest';
import { CATALOG, NEVER_SOLD, covers, featuresOf, productOf } from '../src/monetization/catalog';
import {
  ENTITLEMENTS_KEY, EntitlementStore, decodeEntitlements, hasNoAds, onEntitlementsChange, type KV,
} from '../src/monetization/entitlements';
import { DisabledIapProvider, MOCK_STORE_KEY, MockIapProvider, formatDemoPrice, type MockDecision } from '../src/monetization/iap';
import { RevenueCatIapProvider, type PurchasesSdk } from '../src/monetization/iapRevenueCat';
import { PurchaseController } from '../src/monetization/purchases';
import { ON_SALE, SHIPPED_FEATURES, isPlaceholder, storeIdOf } from '../src/monetization/config';
import { shopTr } from '../src/i18n/shopTr';
import { shopEn } from '../src/i18n/shopEn';

/** A device's local storage. */
function memKV(): KV & { data: Map<string, string>; writes: number } {
  const data = new Map<string, string>();
  const kv = { data, writes: 0, read: async (k: string) => data.get(k) ?? null, write: async (k: string, v: string) => { kv.writes++; data.set(k, v); return true; } };
  return kv;
}

/** One device (its own entitlement cache) signed in to a store account (the mock's storage). */
function device(account: ReturnType<typeof memKV> = memKV(), decide: MockDecision | (() => MockDecision) = 'approve', now = () => 1_000_000) {
  const disk = memKV();
  const provider = new MockIapProvider({ kv: account, confirm: () => (typeof decide === 'function' ? decide() : decide), now });
  const ents = new EntitlementStore(disk, now);
  const shop = new PurchaseController(provider, ents);
  return { disk, account, provider, ents, shop };
}

describe('entitlement store', () => {
  it('is empty and ad-supported until loaded, then persists grants across restarts', async () => {
    const disk = memKV();
    const a = new EntitlementStore(disk);
    expect(a.hasNoAds()).toBe(false);
    await a.load();
    expect(a.hasNoAds()).toBe(false);
    await a.grant('no_ads', 'purchase', 'tx-1');
    expect(a.hasNoAds()).toBe(true);
    expect(JSON.parse(disk.data.get(ENTITLEMENTS_KEY)!).owned.no_ads.transactionId).toBe('tx-1');

    const b = new EntitlementStore(disk);                       // app restart
    expect(b.hasNoAds()).toBe(false);                            // sync API: false until the read finished
    await b.load();
    expect(b.hasNoAds()).toBe(true);
    expect(b.owns('no_ads')).toBe(true);
    expect(b.owns('torpil')).toBe(false);
  });

  it('notifies subscribers on load, grant and revoke; unsubscribe stops it', async () => {
    const s = new EntitlementStore(memKV());
    let n = 0;
    const off = s.subscribe(() => { n++; });
    await s.load();
    expect(n).toBe(1);
    await s.grant('torpil', 'purchase');
    await s.grant('torpil', 'purchase');                          // already owned: no second event
    expect(n).toBe(2);
    await s.revoke('torpil');
    expect(n).toBe(3);
    off();
    await s.grant('no_ads', 'purchase');
    expect(n).toBe(3);
  });

  it('no_ads is granted by Reklamsız and by Torpil alike; nothing else switches ads off', async () => {
    for (const id of ['no_ads', 'torpil'] as const) {
      const s = new EntitlementStore(memKV());
      await s.load();
      await s.grant(id, 'purchase');
      expect(s.hasNoAds()).toBe(true);
      expect(s.snapshot().noAds).toBe(true);
    }
    const s = new EntitlementStore(memKV());
    await s.load();
    await s.grant('season_2701', 'purchase');
    await s.creditConsumable('t1', 5);
    expect(s.hasNoAds()).toBe(false);
    expect(covers('torpil', 'no_ads')).toBe(true);
    expect(covers('no_ads', 'torpil')).toBe(false);
  });

  it('survives a corrupt / foreign blob by starting empty, and drops unknown ids', async () => {
    expect(decodeEntitlements('{nope')).toBeNull();
    expect(decodeEntitlements(JSON.stringify({ v: 2, createdAt: 1, owned: {} }))).toBeNull();
    const d = decodeEntitlements(JSON.stringify({ v: 1, createdAt: 1, owned: { no_ads: { at: 1 }, tickets_5: { at: 1 }, hacked_pack: { at: 1 } }, tickets: -3 }))!;
    expect(Object.keys(d.owned)).toEqual(['no_ads']);            // a consumable or unknown id is never an entitlement
    expect(d.tickets).toBe(0);
    const disk = memKV();
    disk.data.set(ENTITLEMENTS_KEY, 'garbage');
    const s = new EntitlementStore(disk);
    await s.load();
    expect(s.ownedIds()).toEqual([]);
  });

  it('keeps a grant that raced the initial read', async () => {
    const disk = memKV();
    const first = new EntitlementStore(disk);
    await first.load();
    await first.grant('no_ads', 'purchase');
    const s = new EntitlementStore(disk);
    const g = s.grant('torpil', 'purchase');                      // before load()
    await s.load(); await g;
    expect(s.ownedIds().sort()).toEqual(['no_ads', 'torpil']);
    const again = new EntitlementStore(disk);
    await again.load();
    expect(again.ownedIds().sort()).toEqual(['no_ads', 'torpil']);
  });

  it('module API for the ads layer: sync boolean + unsubscribe function', () => {
    expect(hasNoAds()).toBe(false);
    const off = onEntitlementsChange(() => {});
    expect(typeof off).toBe('function');
    off();
  });
});

describe('purchase flow (mock store)', () => {
  it('buying no_ads grants it, persists it before finishing, and survives a restart', async () => {
    const d = device();
    await d.shop.init();
    expect(d.shop.snapshot().products.no_ads?.priceString).toBe('49,99 ₺');
    expect(await d.shop.buy('no_ads')).toEqual({ status: 'ok', sku: 'no_ads' });
    expect(d.ents.hasNoAds()).toBe(true);
    expect(d.shop.ownership('no_ads')).toBe('owned');
    const restarted = new EntitlementStore(d.disk);
    await restarted.load();
    expect(restarted.hasNoAds()).toBe(true);
  });

  it('buying Torpil switches ads off and shows Reklamsız as included', async () => {
    const d = device();
    await d.shop.init();
    await d.shop.buy('torpil');
    expect(d.ents.hasNoAds()).toBe(true);
    expect(d.ents.owns('no_ads')).toBe(false);
    expect(d.shop.ownership('no_ads')).toBe('included');
    expect(await d.shop.buy('no_ads')).toEqual({ status: 'restored', sku: 'no_ads' });   // never charged for what is covered
    expect(JSON.parse(d.account.data.get(MOCK_STORE_KEY)!).transactions).toHaveLength(1);
  });

  it.each(['cancel', 'fail', 'pending'] as const)('a %s purchase leaves no entitlement and nothing on disk', async (decision) => {
    const d = device(memKV(), decision);
    await d.shop.init();
    const r = await d.shop.buy('no_ads');
    expect(r.status).toBe(decision === 'cancel' ? 'cancelled' : decision === 'fail' ? 'failed' : 'pending');
    expect(d.ents.hasNoAds()).toBe(false);
    expect(d.ents.ownedIds()).toEqual([]);
    expect(JSON.parse(d.disk.data.get(ENTITLEMENTS_KEY)!).owned).toEqual({});
    expect(d.shop.snapshot().busy).toBeNull();
    const restarted = new EntitlementStore(d.disk);
    await restarted.load();
    expect(restarted.hasNoAds()).toBe(false);
  });

  it('with no confirm handler the mock never completes a purchase', async () => {
    const ents = new EntitlementStore(memKV());
    const shop = new PurchaseController(new MockIapProvider({ kv: memKV() }), ents);
    await shop.init();
    expect((await shop.buy('torpil')).status).toBe('cancelled');
    expect(ents.ownedIds()).toEqual([]);
  });

  it('a pending payment is granted only when the store confirms it', async () => {
    const d = device(memKV(), 'pending');
    await d.shop.init();
    await d.shop.buy('torpil');
    await d.shop.sync();
    expect(d.ents.owns('torpil')).toBe(false);
    await d.provider.resolvePending();                              // store update → controller syncs
    await d.shop.sync();
    expect(d.ents.owns('torpil')).toBe(true);
  });

  it('an offline store fails the purchase and keeps what the device already owns', async () => {
    const d = device();
    await d.shop.init();
    await d.shop.buy('no_ads');
    d.provider.offline = true;
    expect(await d.shop.buy('torpil')).toEqual({ status: 'failed', sku: 'torpil', code: 'network' });
    await d.shop.sync();
    expect(d.ents.ownedIds()).toEqual(['no_ads']);                  // cache stands while the store is unreachable
    expect((await d.shop.restore()).status).toBe('failed');
  });

  it('one store operation at a time', async () => {
    let release!: (d: MockDecision) => void;
    const d = device(memKV());
    d.provider.setConfirm(() => new Promise<MockDecision>((r) => { release = r; }));
    await d.shop.init();
    const first = d.shop.buy('no_ads');
    await new Promise((r) => setTimeout(r, 0));
    expect(d.shop.snapshot().busy).toBe('no_ads');
    expect((await d.shop.buy('torpil')).status).toBe('cancelled');
    expect((await d.shop.restore()).status).toBe('failed');
    release('approve');
    expect((await first).status).toBe('ok');
    expect(d.ents.ownedIds()).toEqual(['no_ads']);
  });
});

describe('restore', () => {
  it('a new device on the same store account gets its durable purchases back', async () => {
    const account = memKV();
    const old = device(account);
    await old.shop.init();
    await old.shop.buy('no_ads');
    await old.shop.buy('torpil');

    const fresh = new EntitlementStore(memKV());
    const shop = new PurchaseController(new MockIapProvider({ kv: account, offline: true }), fresh);   // first launch offline: nothing yet
    await shop.init();
    expect(fresh.ownedIds()).toEqual([]);
    (shop.provider as MockIapProvider).offline = false;
    const r = await shop.restore();
    expect(r).toEqual({ status: 'ok', restored: ['no_ads', 'torpil'] });
    expect(fresh.hasNoAds()).toBe(true);
    expect(await shop.restore()).toEqual({ status: 'ok', restored: [] });                               // second tap: nothing new, still fine
  });

  it('reports an empty store account without granting anything', async () => {
    const d = device();
    await d.shop.init();
    expect(await d.shop.restore()).toEqual({ status: 'none' });
    expect(d.ents.ownedIds()).toEqual([]);
  });

  it('launch reconciliation restores silently and "already owned" never charges twice', async () => {
    const account = memKV();
    const old = device(account);
    await old.shop.init();
    await old.shop.buy('torpil');
    const next = device(account);
    await next.shop.init();                                         // init → sync
    expect(next.ents.owns('torpil')).toBe(true);

    const third = new EntitlementStore(memKV());
    const provider = new MockIapProvider({ kv: account, confirm: () => 'approve' });
    const shop = new PurchaseController(provider, third);
    await third.load();                                             // no init/sync: the cache does not know yet
    expect(await shop.buy('torpil')).toEqual({ status: 'restored', sku: 'torpil' });
    expect(JSON.parse(account.data.get(MOCK_STORE_KEY)!).transactions).toHaveLength(1);
  });

  it('a refund reported by a reachable store closes the entitlement; tickets stay', async () => {
    const d = device();
    await d.shop.init();
    await d.shop.buy('torpil');
    await d.shop.buy('tickets_5');
    await d.provider.refund('torpil');
    await d.shop.sync();
    expect(d.ents.owns('torpil')).toBe(false);
    expect(d.ents.hasNoAds()).toBe(false);
    expect(d.ents.tickets()).toBe(5);
  });
});

describe('consumables (Practice Tickets)', () => {
  it('are credited exactly once per store transaction', async () => {
    const d = device();
    await d.shop.init();
    expect((await d.shop.buy('tickets_5')).status).toBe('ok');
    expect(d.ents.tickets()).toBe(5);
    await d.shop.sync(); await d.shop.sync(); await d.shop.restore();
    expect(d.ents.tickets()).toBe(5);
    await d.shop.buy('tickets_5');                                  // a second, separate purchase
    expect(d.ents.tickets()).toBe(10);
    const restarted = new EntitlementStore(d.disk);
    await restarted.load();
    expect(restarted.tickets()).toBe(10);
    expect(d.ents.ownedIds()).toEqual([]);                          // a consumable is never an entitlement
  });

  it('a purchase that crashed before it was credited is credited once on the next launch', async () => {
    const account = memKV();
    const disk = memKV();
    const now = () => 5_000_000;
    const boot = () => {
      const provider = new MockIapProvider({ kv: account, confirm: () => 'approve', now });
      const ents = new EntitlementStore(disk, now);
      return { provider, ents, shop: new PurchaseController(provider, ents) };
    };
    const a = boot();
    await a.ents.load();
    expect((await a.provider.purchase('tickets_5')).status).toBe('ok');   // store charged; app died before apply()
    expect(a.ents.tickets()).toBe(0);
    const b = boot();
    await b.shop.init();
    expect(b.ents.tickets()).toBe(5);
    const c = boot();
    await c.shop.init(); await c.shop.sync();
    expect(c.ents.tickets()).toBe(5);
  });

  it('a transaction replayed after it was credited but before it was finished only gets finished', async () => {
    const d = device();
    await d.ents.load();
    const r = await d.provider.purchase('tickets_5');
    if (r.status !== 'ok') throw new Error('expected ok');
    await d.ents.creditConsumable(r.transaction.transactionId, 5);  // persisted, then "crash" before finish
    await d.shop.init();
    expect(d.ents.tickets()).toBe(5);
    expect((await d.provider.owned()).transactions).toEqual([]);    // finished now
  });

  it('old tickets from before this install are acknowledged, not re-credited', async () => {
    const account = memKV();
    const early = new MockIapProvider({ kv: account, confirm: () => 'approve', now: () => 1_000 });
    await early.purchase('tickets_5');                               // bought long ago, never finished
    const ents = new EntitlementStore(memKV(), () => 9_000_000_000);
    const shop = new PurchaseController(new MockIapProvider({ kv: account }), ents);
    await shop.init();
    await shop.restore();
    expect(ents.tickets()).toBe(0);
  });

  it('ids the same purchase shows up under later (aliases) cannot credit it twice', async () => {
    const ents = new EntitlementStore(memKV());
    const tx = { sku: 'tickets_5' as const, transactionId: 'rc-1', purchasedAt: Date.now(), aliases: ['store-1'] };
    const provider = Object.assign(new MockIapProvider({ kv: memKV() }), {
      purchase: async () => ({ status: 'ok' as const, transaction: tx }),
      owned: async () => ({ authoritative: true, transactions: [{ sku: 'tickets_5' as const, transactionId: 'store-1', purchasedAt: Date.now() }] }),
    });
    const shop = new PurchaseController(provider, ents);
    await ents.load();
    await shop.buy('tickets_5');
    await shop.sync();
    expect(ents.tickets()).toBe(5);
  });

  it('spending is idempotent per reward and never goes negative', async () => {
    const s = new EntitlementStore(memKV());
    await s.load();
    expect(await s.spendTicket('r0')).toBe(false);
    await s.creditConsumable('t1', 1);
    expect(await s.spendTicket('r1')).toBe(true);
    expect(await s.spendTicket('r1')).toBe(true);                   // same reward: no second ticket
    expect(s.tickets()).toBe(0);
    expect(await s.spendTicket('r2')).toBe(false);
    expect(s.tickets()).toBe(0);
  });
});

describe('catalog', () => {
  it('has the design SKUs, no subscription, no randomness', () => {
    expect(CATALOG.map((p) => p.id)).toEqual(['no_ads', 'torpil', 'tickets_5', 'season_2701']);
    for (const p of CATALOG) {
      expect(['non_consumable', 'consumable']).toContain(p.kind);
      expect(p.randomness).toBe(false);
      expect(p.fallbackPrice.TRY).toBeGreaterThan(0);
      expect(p.fallbackPrice.USD).toBeGreaterThan(0);
    }
    expect(productOf('torpil')!.fallbackPrice).toEqual({ TRY: 199.99, USD: 6.99 });
    expect(productOf('tickets_5')).toMatchObject({ kind: 'consumable', tickets: 5, grants: [] });
    expect(featuresOf(['no_ads'])).toEqual(new Set(['ads.interstitial.off']));
    expect(featuresOf(['torpil']).has('ads.interstitial.off')).toBe(true);
  });

  it('sells nothing from the never-sold list (06 §2.2.5) and uses no forbidden word (D-005)', () => {
    const haystack = CATALOG.flatMap((p) => [p.id, ...p.grants]).join(' ').toLowerCase();
    for (const concept of NEVER_SOLD) expect(haystack).not.toContain(concept.toLowerCase());
    expect(haystack).not.toMatch(/bribe|rüşvet|rusvet|loot|gacha|spin|chest|gem|coin/);
  });

  it('no feature touches the life simulation', () => {
    for (const p of CATALOG) for (const f of p.grants) expect(f).not.toMatch(/stat|money|health|hazard|odds|wager/);
  });

  it('config: placeholders mean "not configured"; a card lists only shipped features; Torpil is not sold before it does more', () => {
    expect(isPlaceholder('PLACEHOLDER_X')).toBe(true);
    expect(isPlaceholder('')).toBe(true);
    expect(isPlaceholder('appl_abc')).toBe(false);
    expect(storeIdOf('no_ads', 'ios')).toBe('no_ads');             // falls back to the SKU while ids are placeholders
    const all = new Set(CATALOG.flatMap((p) => p.grants));
    for (const f of SHIPPED_FEATURES) expect(all.has(f)).toBe(true);
    const torpilOnly = productOf('torpil')!.grants.filter((f) => !productOf('no_ads')!.grants.includes(f));
    if (ON_SALE.torpil) expect(torpilOnly.some((f) => SHIPPED_FEATURES.includes(f))).toBe(true);
    expect(formatDemoPrice(199.99, 'TRY')).toBe('199,99 ₺');
    expect(formatDemoPrice(6.99, 'USD')).toBe('$6.99');
  });

  it('shop copy: every listed SKU / feature is named in both languages, with no price and no pressure wording', () => {
    for (const t of [shopTr, shopEn]) {
      for (const p of CATALOG) {
        expect(t.name[p.id]).toBeTruthy();
        expect(t.line[p.id]).toBeTruthy();
        expect(t.notice.bought[p.id]).toBeTruthy();
        for (const f of p.grants) expect(t.feature[f]).toBeTruthy();
      }
      const flat = JSON.stringify(t, (_k, v) => (typeof v === 'function' ? (v as (...a: string[]) => string)('X', 'Y') : v));
      expect(flat).not.toMatch(/₺|\$\s?\d|\d+[.,]\d{2}/);           // prices come from the store, never from code
      expect(flat.toLowerCase()).not.toMatch(/son \d|sadece bugün|kaçırma|acele|indirim|en popüler|limited time|hurry|only today|last chance|most popular|discount|% ?off|rüşvet|bribe/);
    }
  });
});

describe('providers', () => {
  it('disabled provider (release build without keys) sells and grants nothing', async () => {
    const ents = new EntitlementStore(memKV());
    const shop = new PurchaseController(new DisabledIapProvider(), ents);
    await shop.init();
    expect(shop.snapshot()).toMatchObject({ ready: true, available: false, products: {} });
    expect(await shop.buy('no_ads')).toEqual({ status: 'failed', sku: 'no_ads', code: 'unavailable' });
    expect((await shop.restore()).status).toBe('failed');
    expect(ents.ownedIds()).toEqual([]);
  });

  /** Minimal fake of the `Purchases` static API. */
  function fakeSdk(over: Partial<PurchasesSdk> = {}): PurchasesSdk & { info: Record<string, unknown> } {
    const info = { requestDate: new Date().toISOString(), entitlements: { active: {} }, nonSubscriptionTransactions: [] as unknown[] };
    const product = (id: string) => ({ identifier: id, priceString: '₺89,99', price: 89.99, currencyCode: 'TRY', title: id });
    return {
      info,
      configure: () => {}, addCustomerInfoUpdateListener: () => {}, canMakePayments: async () => true,
      getProducts: async (ids: string[]) => ids.filter((i) => i !== 'ios.season').map(product) as never,
      purchaseStoreProduct: async (p: { identifier: string }) => {
        const tx = { transactionIdentifier: 'store-77', productIdentifier: p.identifier, purchaseDate: new Date().toISOString() };
        info.nonSubscriptionTransactions.push({ ...tx, transactionIdentifier: 'rc-abc' });
        return { productIdentifier: p.identifier, customerInfo: info, transaction: tx } as never;
      },
      restorePurchases: async () => info as never, getCustomerInfo: async () => info as never,
      PRODUCT_CATEGORY: { NON_SUBSCRIPTION: 'NON_SUBSCRIPTION' },
      PURCHASES_ERROR_CODE: { PURCHASE_CANCELLED_ERROR: '1', STORE_PROBLEM_ERROR: '2', PURCHASE_NOT_ALLOWED_ERROR: '3', PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR: '5',
        PRODUCT_ALREADY_PURCHASED_ERROR: '6', NETWORK_ERROR: '10', PAYMENT_PENDING_ERROR: '20', OFFLINE_CONNECTION_ERROR: '35' },
      ...over,
    } as PurchasesSdk & { info: Record<string, unknown> };
  }
  const opts = { apiKey: 'appl_test', skus: CATALOG.map((p) => p.id), storeIdOf: (s: string) => (s === 'season_2701' ? 'ios.season' : `ios.${s}`) };

  it('RevenueCat: store price strings pass through untouched; a product the store does not return is not sellable', async () => {
    const p = new RevenueCatIapProvider(fakeSdk(), opts);
    expect(await p.init()).toEqual({ available: true });
    const products = await p.getProducts(opts.skus);
    expect(products.map((x) => x.sku)).toEqual(['no_ads', 'torpil', 'tickets_5']);
    expect(products[0]!.priceString).toBe('₺89,99');
    expect(await p.purchase('season_2701')).toMatchObject({ status: 'failed', code: 'product_unavailable' });
  });

  it('RevenueCat: cancel / pending / errors map to results, never to a grant', async () => {
    const outcomes: [unknown, string, string?][] = [
      [{ code: '1' }, 'cancelled'], [{ userCancelled: true }, 'cancelled'], [{ code: '20' }, 'pending'],
      [{ code: '10', message: 'x' }, 'failed', 'network'], [{ code: '3' }, 'failed', 'not_allowed'], [{ code: '6' }, 'failed', 'already_owned'], [new Error('boom'), 'failed', 'unknown'],
    ];
    for (const [err, status, code] of outcomes) {
      const ents = new EntitlementStore(memKV());
      const sdk = fakeSdk({ purchaseStoreProduct: async () => { throw err; } });
      const shop = new PurchaseController(new RevenueCatIapProvider(sdk, opts), ents);
      await shop.init();
      const r = await shop.buy('no_ads');
      expect(r.status).toBe(status);
      if (code) expect(r).toMatchObject({ code });
      expect(ents.ownedIds()).toEqual([]);
    }
  });

  it('RevenueCat: a purchase grants once; tickets are not double-credited across the two transaction ids; refund revokes', async () => {
    const sdk = fakeSdk();
    const ents = new EntitlementStore(memKV());
    const shop = new PurchaseController(new RevenueCatIapProvider(sdk, opts), ents);
    await shop.init();
    expect((await shop.buy('tickets_5')).status).toBe('ok');
    expect((await shop.buy('torpil')).status).toBe('ok');
    await shop.sync(); await shop.restore();
    expect(ents.tickets()).toBe(5);
    expect(ents.hasNoAds()).toBe(true);
    (sdk.info.nonSubscriptionTransactions as { productIdentifier: string }[]) = (sdk.info.nonSubscriptionTransactions as { productIdentifier: string }[]).filter((t) => t.productIdentifier !== 'ios.torpil');
    await shop.sync();
    expect(ents.owns('torpil')).toBe(false);
    // A stale (cached) CustomerInfo is not allowed to revoke anything.
    await ents.grant('no_ads', 'purchase');
    sdk.info.requestDate = new Date(Date.now() - 3_600_000).toISOString();
    await shop.sync();
    expect(ents.owns('no_ads')).toBe(true);
  });
});
