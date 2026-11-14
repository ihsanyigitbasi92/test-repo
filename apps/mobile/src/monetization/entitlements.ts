/**
 * Persistent entitlement store (06 §2.6, doc 14 §2): what this device owns, plus the Practice Ticket ledger.
 *
 * One versioned JSON blob under `ENTITLEMENTS_KEY` through src/state/storage.ts (AsyncStorage / localStorage), kept
 * apart from the game save so a dropped save (content / engine change) never drops a purchase. It is a CACHE of
 * what the store said: the store account stays the source of truth and "Restore purchases" rebuilds it.
 *
 * Contract for the ads layer — import exactly these two from 'src/monetization/entitlements':
 *   hasNoAds(): boolean                        sync; false until the store has loaded
 *   onEntitlementsChange(cb): () => void       fires after load and on every grant / revoke
 * `hasNoAds()` means "forced ads are off" (interstitials). Rewarded ads are opt-in and stay available to
 * owners (D-038: "aldım, yine reklam görüyorum" yok ama isteyen ödüllü reklamı izler).
 */
import { useSyncExternalStore } from 'react';
import { readItem, writeItem } from '../state/storage';
import { featuresOf, isEntitlementId, type EntitlementId, type Feature } from './catalog';

export const ENTITLEMENTS_KEY = 'motto.entitlements.v1';
export const ENTITLEMENTS_VERSION = 1 as const;
/** Ring size of remembered consumable transactions / spent reward ids (06 §2.6.4). */
export const LEDGER_RING = 500;

export type GrantSource = 'purchase' | 'restore' | 'sync';
export interface OwnedRecord { at: number; source: GrantSource; transactionId: string | null }

export interface EntitlementState {
  v: typeof ENTITLEMENTS_VERSION;
  /** First launch of this install: consumable transactions older than this are never credited here. */
  createdAt: number;
  owned: Partial<Record<EntitlementId, OwnedRecord>>;
  /** Practice Tickets on this device (never negative). */
  tickets: number;
  /** Store transaction ids of consumables already credited (or deliberately skipped): credit-once key. */
  creditedTx: string[];
  /** Reward ids a ticket was already spent on: spend-once key. */
  spentRewards: string[];
}

export interface KV { read(key: string): Promise<string | null>; write(key: string, value: string): Promise<boolean> }
const defaultKV: KV = { read: readItem, write: writeItem };

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
const strings = (x: unknown): string[] => (Array.isArray(x) ? x.filter((s): s is string => typeof s === 'string').slice(-LEDGER_RING) : []);

export const emptyEntitlements = (now: number): EntitlementState =>
  ({ v: ENTITLEMENTS_VERSION, createdAt: now, owned: {}, tickets: 0, creditedTx: [], spentRewards: [] });

/** Parses a stored blob; anything unreadable yields null (the store then starts empty and waits for a restore). */
export function decodeEntitlements(raw: string | null | undefined): EntitlementState | null {
  if (!raw) return null;
  let x: unknown;
  try { x = JSON.parse(raw); } catch { return null; }
  if (!isObj(x) || x.v !== ENTITLEMENTS_VERSION || typeof x.createdAt !== 'number' || !isObj(x.owned)) return null;
  const owned: EntitlementState['owned'] = {};
  for (const [id, rec] of Object.entries(x.owned)) {
    if (!isEntitlementId(id) || !isObj(rec)) continue;                 // unknown ids (a removed SKU) are dropped
    owned[id] = { at: typeof rec.at === 'number' ? rec.at : 0, source: rec.source === 'restore' || rec.source === 'sync' ? rec.source : 'purchase',
      transactionId: typeof rec.transactionId === 'string' ? rec.transactionId : null };
  }
  const tickets = typeof x.tickets === 'number' && Number.isFinite(x.tickets) ? Math.max(0, Math.floor(x.tickets)) : 0;
  return { v: ENTITLEMENTS_VERSION, createdAt: x.createdAt, owned, tickets, creditedTx: strings(x.creditedTx), spentRewards: strings(x.spentRewards) };
}

export class EntitlementStore {
  private state: EntitlementState;
  private loaded = false;
  private loading: Promise<void> | null = null;
  private writes: Promise<unknown> = Promise.resolve();
  private readonly listeners = new Set<() => void>();
  /** Memoized feature set; rebuilt on every change (also the useSyncExternalStore snapshot identity). */
  private view: EntitlementsView;

  constructor(private readonly kv: KV = defaultKV, private readonly now: () => number = Date.now) {
    this.state = emptyEntitlements(now());
    this.view = this.makeView();
  }

  /** Reads the stored blob once; safe to call many times. Every mutation awaits it first, so a write never clobbers an unread blob. */
  load(): Promise<void> {
    this.loading ??= (async () => {
      const stored = decodeEntitlements(await this.kv.read(ENTITLEMENTS_KEY));
      if (stored) this.state = stored;
      this.loaded = true;
      this.emit();
      if (!stored) await this.persist();                              // pins `createdAt` of this install
    })();
    return this.loading;
  }

  isLoaded = (): boolean => this.loaded;
  snapshot = (): EntitlementsView => this.view;
  owns = (id: EntitlementId): boolean => !!this.state.owned[id];
  ownedIds = (): EntitlementId[] => Object.keys(this.state.owned) as EntitlementId[];
  has = (f: Feature): boolean => this.view.features.has(f);
  hasNoAds = (): boolean => this.loaded && this.has('ads.interstitial.off');
  tickets = (): number => this.state.tickets;
  createdAt = (): number => this.state.createdAt;
  wasCredited = (transactionId: string): boolean => this.state.creditedTx.includes(transactionId);

  subscribe = (cb: () => void): (() => void) => {
    this.listeners.add(cb);
    return () => { this.listeners.delete(cb); };
  };

  /** Grants a durable entitlement and resolves once it is on disk (callers finish the store transaction after). */
  async grant(id: EntitlementId, source: GrantSource, transactionId: string | null = null): Promise<boolean> {
    await this.load();
    if (this.state.owned[id]) return false;
    this.state = { ...this.state, owned: { ...this.state.owned, [id]: { at: this.now(), source, transactionId } } };
    this.emit();
    await this.persist();
    return true;
  }

  /** Refund / revocation: the entitlement closes quietly (06 §2.5.3). Tickets are untouched. */
  async revoke(id: EntitlementId): Promise<boolean> {
    await this.load();
    if (!this.state.owned[id]) return false;
    const owned = { ...this.state.owned };
    delete owned[id];
    this.state = { ...this.state, owned };
    this.emit();
    await this.persist();
    return true;
  }

  /**
   * Credits a consumable exactly once per store transaction id (06 §2.6.4). `count = 0` only remembers the
   * transaction (an old purchase seen again after a reinstall is acknowledged, not re-credited).
   * Returns true when tickets were added by this call.
   */
  async creditConsumable(transactionId: string, count: number): Promise<boolean> {
    await this.load();
    if (this.state.creditedTx.includes(transactionId)) return false;
    const add = Math.max(0, Math.floor(count));
    this.state = { ...this.state, tickets: this.state.tickets + add, creditedTx: [...this.state.creditedTx, transactionId].slice(-LEDGER_RING) };
    this.emit();
    await this.persist();
    return add > 0;
  }

  /** Spends one ticket for `rewardId`; a second call with the same id is a no-op that still reports success. */
  async spendTicket(rewardId: string): Promise<boolean> {
    await this.load();
    if (this.state.spentRewards.includes(rewardId)) return true;
    if (this.state.tickets < 1) return false;
    this.state = { ...this.state, tickets: this.state.tickets - 1, spentRewards: [...this.state.spentRewards, rewardId].slice(-LEDGER_RING) };
    this.emit();
    await this.persist();
    return true;
  }

  private makeView(): EntitlementsView {
    const owned = this.ownedIds();
    const features = featuresOf(owned);
    return { loaded: this.loaded, owned, features, noAds: this.loaded && features.has('ads.interstitial.off'), tickets: this.state.tickets };
  }

  private emit(): void {
    this.view = this.makeView();
    for (const l of [...this.listeners]) { try { l(); } catch (e) { console.warn('[entitlements] listener failed:', e); } }
  }

  /** Serialized writes: the blob on disk is always a state that existed, in order. */
  private persist(): Promise<unknown> {
    const blob = JSON.stringify(this.state);
    this.writes = this.writes.then(() => this.kv.write(ENTITLEMENTS_KEY, blob)).catch((e) => { console.warn('[entitlements] write failed:', e); });
    return this.writes;
  }
}

export interface EntitlementsView {
  loaded: boolean;
  owned: EntitlementId[];
  features: ReadonlySet<Feature>;
  /** Same value as `hasNoAds()`. */
  noAds: boolean;
  tickets: number;
}

/** App-wide store. Loads itself on first use; nothing has to be initialised by callers. */
export const entitlements = new EntitlementStore();
const ensureLoaded = (): void => { void entitlements.load(); };

/** Forced ads (interstitials) are switched off: owner of `no_ads` or `torpil`. Sync; false until loaded. */
export function hasNoAds(): boolean {
  ensureLoaded();
  return entitlements.hasNoAds();
}

/** Subscribes to every entitlement change (including the initial load). Returns the unsubscribe function. */
export function onEntitlementsChange(cb: () => void): () => void {
  ensureLoaded();
  return entitlements.subscribe(cb);
}

/** React view of the store; re-renders on load, grant, revoke and ticket changes. */
export function useEntitlements(): EntitlementsView {
  ensureLoaded();
  return useSyncExternalStore(entitlements.subscribe, entitlements.snapshot, entitlements.snapshot);
}
