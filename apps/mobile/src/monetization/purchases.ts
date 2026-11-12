/**
 * Purchase orchestration (06 §2.6.3–2.6.4): the only place that turns a store answer into an entitlement.
 *
 *   buy      ok → grant ON DISK → finish;  pending / cancelled / failed → nothing is granted
 *   restore  user action; grants what the store account holds
 *   sync     silent reconciliation at launch / foreground / store update: late (pending) purchases arrive here,
 *            and an authoritative store answer that no longer lists an entitlement closes it (refund)
 * Consumables are credited once per store transaction id; a transaction older than this install is acknowledged
 * without credit ("tickets stay on this device").
 */
import { useSyncExternalStore } from 'react';
import { CATALOG, covers, productOf, type EntitlementId, type Sku } from './catalog';
import { DEMO_ON_SALE, ON_SALE, phaseReached } from './config';
import { entitlements as defaultEntitlements, type EntitlementStore, type GrantSource } from './entitlements';
import { kindOf, type IapErrorCode, type IapProvider, type Ownership, type StoreProduct, type StoreTransaction } from './iap';
import { createIapProvider } from './provider';

export type BuyOutcome =
  | { status: 'ok'; sku: Sku }
  | { status: 'pending'; sku: Sku }
  | { status: 'cancelled'; sku: Sku }
  /** The store said "already owned": the purchase was restored instead (no second charge). */
  | { status: 'restored'; sku: Sku }
  | { status: 'failed'; sku: Sku; code: IapErrorCode };

export type RestoreOutcome =
  | { status: 'ok'; restored: EntitlementId[] }       // newly granted on this device (may be empty: all already here)
  | { status: 'none' }                                 // the store account holds nothing
  | { status: 'failed' };

export interface ShopView {
  /** init() finished (products may still be empty when the store is unreachable). */
  ready: boolean;
  available: boolean;
  provider: IapProvider['name'];
  /** SKUs listed in this build, in catalog order. */
  listed: Sku[];
  products: Partial<Record<Sku, StoreProduct>>;
  /** SKU being purchased, or 'restore' — one store operation at a time. */
  busy: Sku | 'restore' | null;
}

/** Clock skew allowance between the store's purchase time and this device's install time. */
const INSTALL_SLACK_MS = 10 * 60_000;

export class PurchaseController {
  private view: ShopView;
  private readonly listeners = new Set<() => void>();
  private initing: Promise<void> | null = null;
  private syncing: Promise<void> | null = null;
  /** Bumped by every grant path: a sync that started before a purchase must not read it as "refunded". */
  private epoch = 0;

  constructor(readonly provider: IapProvider, readonly ents: EntitlementStore = defaultEntitlements) {
    this.view = { ready: false, available: false, provider: provider.name, listed: this.listedSkus(), products: {}, busy: null };
  }

  /** Products of this build's phase that are on sale (real store) or enabled for the demo store. */
  private listedSkus(): Sku[] {
    const demo = this.provider.name === 'mock';
    const sale = demo ? DEMO_ON_SALE : ON_SALE;
    return CATALOG.filter((p) => sale[p.id] && (demo || phaseReached(p.availableFrom))).map((p) => p.id);
  }

  snapshot = (): ShopView => this.view;
  subscribe = (cb: () => void): (() => void) => { this.listeners.add(cb); return () => { this.listeners.delete(cb); }; };
  private set(patch: Partial<ShopView>): void {
    this.view = { ...this.view, ...patch };
    for (const l of [...this.listeners]) l();
  }

  /** Connects to the store, loads prices and reconciles once. Idempotent; never throws. */
  init(): Promise<void> {
    this.initing ??= (async () => {
      await this.ents.load();
      let available = false;
      try { available = (await this.provider.init()).available; } catch (e) { console.warn('[shop] init failed:', e); }
      this.set({ available });
      this.provider.onUpdate?.(() => { void this.sync(); });
      await this.loadProducts();
      this.set({ ready: true });
      await this.sync();
    })();
    return this.initing;
  }

  /** (Re)loads store prices. `demoCurrency` only affects the mock store (real stores price by store account). */
  async loadProducts(demoCurrency?: 'TRY' | 'USD'): Promise<void> {
    try {
      const found = await this.provider.getProducts(this.view.listed, demoCurrency ? { demoCurrency } : undefined);
      if (!found.length && Object.keys(this.view.products).length) return;          // keep the last good prices
      const products: ShopView['products'] = {};
      for (const p of found) products[p.sku] = p;
      this.set({ products });
    } catch (e) { console.warn('[shop] products failed:', e); }
  }

  /** Owned directly, or covered by a bigger owned pack (Torpil ⊇ Reklamsız). */
  ownership(sku: Sku): 'owned' | 'included' | 'none' {
    if (kindOf(sku) !== 'non_consumable') return 'none';
    if (this.ents.owns(sku as EntitlementId)) return 'owned';
    return this.ents.ownedIds().some((id) => covers(id, sku)) ? 'included' : 'none';
  }

  /** One transaction → at most one grant / one credit, persisted before the store transaction is finished. */
  private async apply(tx: StoreTransaction, source: GrantSource): Promise<{ granted: EntitlementId | null; credited: boolean }> {
    const product = productOf(tx.sku);
    if (!product) return { granted: null, credited: false };
    this.epoch++;
    if (product.kind === 'non_consumable') {
      const fresh = await this.ents.grant(tx.sku as EntitlementId, source, tx.transactionId);
      await this.provider.finish(tx).catch((e) => console.warn('[shop] finish failed:', e));
      return { granted: fresh ? (tx.sku as EntitlementId) : null, credited: false };
    }
    const ids = [tx.transactionId, ...(tx.aliases ?? [])].filter(Boolean);
    const known = ids.some((id) => this.ents.wasCredited(id));
    // A purchase made before this install's ledger existed (reinstall, another device) is not credited here.
    const stale = source !== 'purchase' && tx.purchasedAt !== null && tx.purchasedAt < this.ents.createdAt() - INSTALL_SLACK_MS;
    let credited = false;
    if (!known && !stale && ids.length) credited = await this.ents.creditConsumable(ids[0]!, product.tickets ?? 0);
    for (const id of ids) await this.ents.creditConsumable(id, 0);                    // remember every id; no-op if known
    await this.provider.finish(tx).catch((e) => console.warn('[shop] finish failed:', e));
    return { granted: null, credited };
  }

  private async applyOwnership(own: Ownership, source: GrantSource): Promise<EntitlementId[]> {
    const granted: EntitlementId[] = [];
    for (const tx of own.transactions) {
      const r = await this.apply(tx, source);
      if (r.granted) granted.push(r.granted);
    }
    return granted;
  }

  async buy(sku: Sku): Promise<BuyOutcome> {
    if (this.view.busy) return { status: 'cancelled', sku };
    if (this.ownership(sku) !== 'none') return { status: 'restored', sku };
    this.set({ busy: sku });
    try {
      const r = await this.provider.purchase(sku);
      if (r.status === 'ok') { await this.apply({ ...r.transaction, sku }, 'purchase'); return { status: 'ok', sku }; }
      if (r.status === 'pending') return { status: 'pending', sku };                  // no grant until the store confirms
      if (r.status === 'cancelled') return { status: 'cancelled', sku };
      if (r.code === 'already_owned') {
        try { await this.applyOwnership(await this.provider.restore(), 'restore'); } catch (e) { console.warn('[shop] restore after already-owned failed:', e); }
        if (this.ownership(sku) !== 'none') return { status: 'restored', sku };
      }
      return { status: 'failed', sku, code: r.code };
    } catch (e) {
      console.warn('[shop] purchase threw:', e);
      return { status: 'failed', sku, code: 'unknown' };
    } finally {
      this.set({ busy: null });
    }
  }

  async restore(): Promise<RestoreOutcome> {
    if (this.view.busy) return { status: 'failed' };
    this.set({ busy: 'restore' });
    try {
      const own = await this.provider.restore();
      const restored = await this.applyOwnership(own, 'restore');
      const holdsDurable = own.transactions.some((t) => kindOf(t.sku) === 'non_consumable');
      return holdsDurable ? { status: 'ok', restored } : { status: 'none' };
    } catch (e) {
      console.warn('[shop] restore failed:', e);
      return { status: 'failed' };
    } finally {
      this.set({ busy: null });
    }
  }

  /** Silent reconciliation. Offline / store errors leave the cached entitlements exactly as they are. */
  sync(): Promise<void> {
    this.syncing ??= (async () => {
      try {
        const before = this.epoch;
        const own = await this.provider.owned();
        if (this.view.busy || this.epoch !== before) return;                          // a purchase / restore overtook this answer
        await this.applyOwnership(own, 'sync');
        if (own.authoritative && !this.view.busy) {
          const held = new Set(own.transactions.map((t) => t.sku));
          for (const id of this.ents.ownedIds()) if (!held.has(id)) await this.ents.revoke(id);   // refunded / revoked
        }
      } catch { /* unreachable store: the cache stands, no time limit (06 §2.6.1 rule 3) */ }
      finally { this.syncing = null; }
    })();
    return this.syncing;
  }
}

let controller: PurchaseController | null = null;
/** App-wide controller (created on first use so importing this module has no side effects). */
export function shop(): PurchaseController {
  controller ??= new PurchaseController(createIapProvider());
  return controller;
}

export function useShop(): ShopView {
  const c = shop();
  return useSyncExternalStore(c.subscribe, c.snapshot, c.snapshot);
}
