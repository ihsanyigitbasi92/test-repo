/**
 * Native store provider: RevenueCat `react-native-purchases` 11.x (D-043; why this library: doc 14 §2.3).
 *
 * The SDK object is INJECTED (provider.native.ts requires the package), so this file has type-only imports and is
 * unit-tested in node with a fake SDK. RevenueCat validates receipts on its backend, finishes / acknowledges
 * transactions itself (purchasesAreCompletedBy = REVENUECAT, the default) and consumes Android consumables, so
 * `finish()` is a no-op here.
 *
 * Ownership is read from CustomerInfo: active RevenueCat entitlements whose identifier equals a SKU (dashboard
 * setup: doc 14 §5) plus non-subscription transactions mapped back from store product ids.
 */
import type { CustomerInfo, PurchasesError, PurchasesStoreProduct } from 'react-native-purchases';
import { isSku, type Sku } from './catalog';
import { kindOf, type IapErrorCode, type IapProvider, type Ownership, type PurchaseResult, type StoreProduct, type StoreTransaction } from './iap';

/** The slice of the `Purchases` static API this provider uses. */
export interface PurchasesSdk {
  configure(config: { apiKey: string }): void;
  getProducts(ids: string[], type?: never): Promise<PurchasesStoreProduct[]>;
  purchaseStoreProduct(product: PurchasesStoreProduct): Promise<{ productIdentifier: string; customerInfo: CustomerInfo; transaction: { transactionIdentifier: string; productIdentifier: string; purchaseDate: string } }>;
  restorePurchases(): Promise<CustomerInfo>;
  getCustomerInfo(): Promise<CustomerInfo>;
  addCustomerInfoUpdateListener(listener: (info: CustomerInfo) => void): void;
  canMakePayments(): Promise<boolean>;
  PRODUCT_CATEGORY: { NON_SUBSCRIPTION: unknown };
  PURCHASES_ERROR_CODE: Record<string, string>;
}

export interface RevenueCatOptions {
  apiKey: string;
  /** SKU → store product id on this platform (app.json → extra.monetization.productIds). */
  storeIdOf: (sku: Sku) => string;
  skus: readonly Sku[];
}

const ms = (iso: string | null | undefined): number | null => { const t = iso ? Date.parse(iso) : NaN; return Number.isFinite(t) ? t : null; };

export class RevenueCatIapProvider implements IapProvider {
  readonly name = 'revenuecat' as const;
  private configured = false;
  private readonly bySku = new Map<Sku, PurchasesStoreProduct>();
  private readonly skuByStoreId = new Map<string, Sku>();
  private readonly listeners = new Set<() => void>();

  constructor(private readonly sdk: PurchasesSdk, private readonly opts: RevenueCatOptions) {
    for (const sku of opts.skus) this.skuByStoreId.set(opts.storeIdOf(sku), sku);
  }

  async init(): Promise<{ available: boolean }> {
    try {
      if (!this.configured) {
        // Anonymous app user id (generated and kept by the SDK): no account, no e-mail (06 §2.6.3).
        this.sdk.configure({ apiKey: this.opts.apiKey });
        this.sdk.addCustomerInfoUpdateListener(() => { for (const l of [...this.listeners]) l(); });
        this.configured = true;
      }
      return { available: await this.sdk.canMakePayments().catch(() => true) };
    } catch (e) {
      console.warn('[iap] RevenueCat configure failed:', e);
      return { available: false };
    }
  }

  async getProducts(skus: readonly Sku[]): Promise<StoreProduct[]> {
    if (!this.configured) return [];
    try {
      const found = await this.sdk.getProducts(skus.map(this.opts.storeIdOf), this.sdk.PRODUCT_CATEGORY.NON_SUBSCRIPTION as never);
      const out: StoreProduct[] = [];
      for (const p of found) {
        const sku = this.skuByStoreId.get(p.identifier);
        if (!sku || !skus.includes(sku)) continue;
        this.bySku.set(sku, p);
        out.push({ sku, priceString: p.priceString, price: p.price, currencyCode: p.currencyCode, title: p.title });
      }
      return out;
    } catch (e) {
      console.warn('[iap] getProducts failed:', e);
      return [];
    }
  }

  private errorCode(e: Partial<PurchasesError>): IapErrorCode {
    const C = this.sdk.PURCHASES_ERROR_CODE;
    switch (e.code) {
      case C.NETWORK_ERROR: case C.OFFLINE_CONNECTION_ERROR: return 'network';
      case C.PURCHASE_NOT_ALLOWED_ERROR: return 'not_allowed';
      case C.PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR: return 'product_unavailable';
      case C.PRODUCT_ALREADY_PURCHASED_ERROR: return 'already_owned';
      case C.STORE_PROBLEM_ERROR: return 'store';
      default: return 'unknown';
    }
  }

  async purchase(sku: Sku): Promise<PurchaseResult> {
    if (!this.configured) return { status: 'failed', code: 'unavailable', message: 'store not initialised' };
    const product = this.bySku.get(sku) ?? (await this.getProducts([sku]), this.bySku.get(sku));
    if (!product) return { status: 'failed', code: 'product_unavailable', message: `store returned no product for ${sku}` };
    try {
      const r = await this.sdk.purchaseStoreProduct(product);
      // The id on the purchase result and the id CustomerInfo later lists for the same purchase are not guaranteed to
      // be the same string (store id vs RevenueCat id): key on the CustomerInfo one and remember the other as an alias,
      // so a consumable can never be credited once now and once more at the next reconciliation.
      const direct = r.transaction.transactionIdentifier;
      const listed = (r.customerInfo?.nonSubscriptionTransactions ?? []).filter((t) => t.productIdentifier === product.identifier)
        .sort((a, b) => (ms(b.purchaseDate) ?? 0) - (ms(a.purchaseDate) ?? 0))[0];
      const transactionId = listed?.transactionIdentifier ?? direct;
      return { status: 'ok', transaction: { sku, transactionId, purchasedAt: ms(listed?.purchaseDate ?? r.transaction.purchaseDate), aliases: transactionId === direct ? [] : [direct] } };
    } catch (err) {
      const e = (err ?? {}) as Partial<PurchasesError>;
      const C = this.sdk.PURCHASES_ERROR_CODE;
      if (e.code === C.PURCHASE_CANCELLED_ERROR || e.userCancelled) return { status: 'cancelled' };
      if (e.code === C.PAYMENT_PENDING_ERROR) return { status: 'pending' };
      return { status: 'failed', code: this.errorCode(e), message: e.message ?? String(err) };
    }
  }

  private ownership(info: CustomerInfo): Ownership {
    const transactions: StoreTransaction[] = [];
    const seenDurable = new Set<Sku>();
    for (const t of info.nonSubscriptionTransactions ?? []) {
      const sku = this.skuByStoreId.get(t.productIdentifier);
      if (!sku) continue;
      if (kindOf(sku) === 'non_consumable') { if (seenDurable.has(sku)) continue; seenDurable.add(sku); }
      transactions.push({ sku, transactionId: t.transactionIdentifier, purchasedAt: ms(t.purchaseDate) });
    }
    // RevenueCat entitlements named after the SKU (covers grants made from the dashboard, e.g. support cases).
    for (const id of Object.keys(info.entitlements?.active ?? {})) {
      if (isSku(id) && kindOf(id) === 'non_consumable' && !seenDurable.has(id)) {
        seenDurable.add(id);
        transactions.push({ sku: id, transactionId: `rc-entitlement:${id}`, purchasedAt: ms(info.entitlements.active[id]?.latestPurchaseDate) });
      }
    }
    // Authoritative only when this CustomerInfo was just fetched from RevenueCat's backend (not the SDK's offline cache).
    const requested = ms(info.requestDate);
    const authoritative = requested !== null && Math.abs(Date.now() - requested) < 5 * 60_000;
    return { authoritative, transactions };
  }

  async restore(): Promise<Ownership> { return this.ownership(await this.sdk.restorePurchases()); }
  async owned(): Promise<Ownership> { return this.ownership(await this.sdk.getCustomerInfo()); }
  async finish(): Promise<void> { /* RevenueCat finishes / acknowledges / consumes */ }

  onUpdate(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => { this.listeners.delete(cb); };
  }
}
