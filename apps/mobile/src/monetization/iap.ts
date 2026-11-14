/**
 * Store access behind one interface (06 §2.6, D-043): the shop and the entitlement logic never see a store SDK.
 *
 *   MockIapProvider       web export, demos and tests — a fake "store account" kept in local storage; a purchase
 *                         completes only after the confirm callback (the on-screen "deneme ödemesi" sheet) says so.
 *   RevenueCatIapProvider native builds (iapRevenueCat.ts), wired by provider.native.ts.
 *   DisabledIapProvider   native build without store keys: nothing can be bought, nothing is granted.
 *
 * No backend exists: this app cannot validate receipts on a server of its own. On native, RevenueCat's backend does
 * the receipt validation; the local entitlement store is a cache of its answer (doc 14 §2.4).
 */
import { readItem, writeItem } from '../state/storage';
import { CATALOG, isSku, productOf, type ProductKind, type Sku } from './catalog';
import type { KV } from './entitlements';

export interface StoreProduct {
  sku: Sku;
  /** Localized, currency-formatted price exactly as the store returns it (VAT-inclusive where the store includes it). */
  priceString: string;
  price: number;
  currencyCode: string;
  /** Store-side localized title (informational; the shop uses its own i18n names). */
  title: string;
}

export interface StoreTransaction {
  sku: Sku;
  /** Store primary key of the purchase (iOS transactionId / Android order or token): the credit-once key. */
  transactionId: string;
  /** Epoch ms, when the store reports it. */
  purchasedAt: number | null;
  /** Other ids the same purchase may show up under later (SDK id vs store id): all are remembered as credited. */
  aliases?: string[];
}

export type IapErrorCode = 'unavailable' | 'network' | 'not_allowed' | 'product_unavailable' | 'already_owned' | 'store' | 'unknown';

export type PurchaseResult =
  | { status: 'ok'; transaction: StoreTransaction }
  /** Ask to Buy / Play PENDING: nothing is granted until the store confirms (delivered later through `owned()` / `onUpdate`). */
  | { status: 'pending' }
  | { status: 'cancelled' }
  | { status: 'failed'; code: IapErrorCode; message: string };

/** What the store account holds right now. */
export interface Ownership {
  /**
   * True when this is a fresh, complete answer from the store (not a cache, not offline): only then may a missing
   * entitlement be read as "refunded / revoked".
   */
  authoritative: boolean;
  transactions: StoreTransaction[];
}

export interface IapProvider {
  readonly name: 'mock' | 'revenuecat' | 'disabled';
  /** Connects to the store. `available: false` → the shop shows "store unreachable"; the game is unaffected. */
  init(): Promise<{ available: boolean }>;
  /** Products with localized store prices. A SKU the store does not return is simply missing (its card cannot be bought). */
  getProducts(skus: readonly Sku[], opts?: { demoCurrency?: 'TRY' | 'USD' }): Promise<StoreProduct[]>;
  /** Opens the store's own purchase sheet. Never throws: every outcome is a `PurchaseResult`. */
  purchase(sku: Sku): Promise<PurchaseResult>;
  /** User-initiated "Restore purchases" (may prompt for the store account). Throws when the store cannot be reached. */
  restore(): Promise<Ownership>;
  /** Silent ownership query for reconciliation at launch / foreground. Throws when the store cannot be reached. */
  owned(): Promise<Ownership>;
  /** Finishes / acknowledges / consumes a transaction AFTER its grant is on disk (06 §2.6.3). */
  finish(tx: StoreTransaction): Promise<void>;
  /** Late changes (a pending payment clearing, a refund). Optional. */
  onUpdate?(cb: () => void): () => void;
}

export const kindOf = (sku: Sku): ProductKind => productOf(sku)?.kind ?? 'non_consumable';

/** Purchases switched off (native build without store keys). */
export class DisabledIapProvider implements IapProvider {
  readonly name = 'disabled' as const;
  async init(): Promise<{ available: boolean }> { return { available: false }; }
  async getProducts(): Promise<StoreProduct[]> { return []; }
  async purchase(): Promise<PurchaseResult> { return { status: 'failed', code: 'unavailable', message: 'purchases are not configured in this build' }; }
  async restore(): Promise<Ownership> { throw new Error('purchases are not configured in this build'); }
  async owned(): Promise<Ownership> { throw new Error('purchases are not configured in this build'); }
  async finish(): Promise<void> { /* nothing to finish */ }
}

// ── mock ──────────────────────────────────────────────────────────────────────────────────────────────────────────
export const MOCK_STORE_KEY = 'motto.iap.mock.v1';
export type MockDecision = 'approve' | 'cancel' | 'fail' | 'pending';
/** Asked once per purchase; the UI shows the fake payment sheet and resolves with the tester's choice. */
export type MockConfirm = (product: StoreProduct) => Promise<MockDecision> | MockDecision;

interface MockAccount { seq: number; transactions: StoreTransaction[]; finished: string[] }

/** "199,99 ₺" / "$6.99" — the shapes the two stores return for TRY / USD storefronts. */
export function formatDemoPrice(amount: number, currency: 'TRY' | 'USD'): string {
  const fixed = amount.toFixed(2);
  return currency === 'TRY' ? `${fixed.replace('.', ',')} ₺` : `$${fixed}`;
}

export interface MockOptions {
  kv?: KV;
  /** Default decision source; `setConfirm` replaces it (the shop registers its sheet). No handler → cancel. */
  confirm?: MockConfirm;
  now?: () => number;
  currency?: 'TRY' | 'USD';
  /** Simulated store outage. */
  offline?: boolean;
}

/**
 * In-memory + local-storage fake store. Behaves like the real ones where it matters to the app: a non-consumable
 * cannot be bought twice ('already_owned'), consumables can; pending pays out later; restore returns what the
 * "account" owns; unfinished transactions come back from `owned()` until finished.
 */
export class MockIapProvider implements IapProvider {
  readonly name = 'mock' as const;
  private account: MockAccount = { seq: 0, transactions: [], finished: [] };
  private loaded: Promise<void> | null = null;
  private confirm: MockConfirm | null;
  private readonly kv: KV;
  private readonly now: () => number;
  private currency: 'TRY' | 'USD';
  private readonly listeners = new Set<() => void>();
  private pending: StoreTransaction[] = [];
  offline: boolean;

  constructor(opts: MockOptions = {}) {
    this.kv = opts.kv ?? { read: readItem, write: writeItem };
    this.confirm = opts.confirm ?? null;
    this.now = opts.now ?? Date.now;
    this.currency = opts.currency ?? 'TRY';
    this.offline = !!opts.offline;
  }

  setConfirm(confirm: MockConfirm | null): void { this.confirm = confirm; }

  private load(): Promise<void> {
    this.loaded ??= (async () => {
      try {
        const x = JSON.parse((await this.kv.read(MOCK_STORE_KEY)) ?? 'null') as Partial<MockAccount> | null;
        if (x && Array.isArray(x.transactions)) {
          this.account = { seq: typeof x.seq === 'number' ? x.seq : x.transactions.length,
            transactions: x.transactions.filter((t) => t && isSku(t.sku) && typeof t.transactionId === 'string'),
            finished: Array.isArray(x.finished) ? x.finished.filter((s) => typeof s === 'string') : [] };
        }
      } catch { /* a broken fake account is just an empty one */ }
    })();
    return this.loaded;
  }
  private save(): Promise<boolean> { return this.kv.write(MOCK_STORE_KEY, JSON.stringify(this.account)); }

  async init(): Promise<{ available: boolean }> { await this.load(); return { available: !this.offline }; }

  async getProducts(skus: readonly Sku[], opts?: { demoCurrency?: 'TRY' | 'USD' }): Promise<StoreProduct[]> {
    if (this.offline) return [];
    if (opts?.demoCurrency) this.currency = opts.demoCurrency;
    const cur = this.currency;
    return CATALOG.filter((p) => skus.includes(p.id)).map((p) => ({
      sku: p.id, price: p.fallbackPrice[cur], currencyCode: cur, priceString: formatDemoPrice(p.fallbackPrice[cur], cur), title: p.id,
    }));
  }

  private ownsDurable(sku: Sku): boolean { return kindOf(sku) === 'non_consumable' && this.account.transactions.some((t) => t.sku === sku); }

  private async record(sku: Sku): Promise<StoreTransaction> {
    const tx: StoreTransaction = { sku, transactionId: `mock-${++this.account.seq}-${this.now().toString(36)}`, purchasedAt: this.now() };
    this.account.transactions.push(tx);
    await this.save();
    return tx;
  }

  async purchase(sku: Sku): Promise<PurchaseResult> {
    await this.load();
    if (this.offline) return { status: 'failed', code: 'network', message: 'mock store offline' };
    const [product] = await this.getProducts([sku]);
    if (!product) return { status: 'failed', code: 'product_unavailable', message: `unknown product ${sku}` };
    if (this.ownsDurable(sku)) return { status: 'failed', code: 'already_owned', message: `${sku} is already owned` };
    let decision: MockDecision;
    try { decision = this.confirm ? await this.confirm(product) : 'cancel'; } catch { decision = 'cancel'; }
    if (decision === 'cancel') return { status: 'cancelled' };
    if (decision === 'fail') return { status: 'failed', code: 'store', message: 'mock store error' };
    if (decision === 'pending') {
      this.pending.push({ sku, transactionId: '', purchasedAt: null });
      return { status: 'pending' };
    }
    return { status: 'ok', transaction: await this.record(sku) };
  }

  /** Test / demo hook: the store confirms every pending payment (Ask to Buy approved, bank transfer cleared). */
  async resolvePending(): Promise<void> {
    const waiting = this.pending;
    this.pending = [];
    for (const p of waiting) if (!this.ownsDurable(p.sku)) await this.record(p.sku);
    for (const l of [...this.listeners]) l();
  }

  /** Test / demo hook: the store refunds a purchase (it disappears from the account). */
  async refund(sku: Sku): Promise<void> {
    await this.load();
    this.account.transactions = this.account.transactions.filter((t) => t.sku !== sku);
    await this.save();
    for (const l of [...this.listeners]) l();
  }

  private async ownership(): Promise<Ownership> {
    await this.load();
    if (this.offline) throw new Error('mock store offline');
    // Durable purchases always; consumables only while unfinished (a finished consumable is gone from a real store too).
    const transactions = this.account.transactions.filter((t) => kindOf(t.sku) === 'non_consumable' || !this.account.finished.includes(t.transactionId));
    return { authoritative: true, transactions: transactions.map((t) => ({ ...t })) };
  }
  restore(): Promise<Ownership> { return this.ownership(); }
  owned(): Promise<Ownership> { return this.ownership(); }

  async finish(tx: StoreTransaction): Promise<void> {
    await this.load();
    if (this.account.finished.includes(tx.transactionId)) return;
    this.account.finished.push(tx.transactionId);
    if (kindOf(tx.sku) === 'consumable') this.account.transactions = this.account.transactions.filter((t) => t.transactionId !== tx.transactionId);
    this.account.finished = this.account.finished.slice(-200);
    await this.save();
  }

  onUpdate(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => { this.listeners.delete(cb); };
  }
}
