/**
 * The ad layer's own full-screen views (demo ad, consent cards, ATT pre-prompt, privacy sheet) as a tiny external
 * store: logic calls `present(view, fallback)` and awaits the player's answer; <AdHost/> renders the current view.
 * Pure TS. With no host mounted (unit tests, a headless run) `present` resolves with `fallback` at once.
 */
export interface ChoiceResult { personalized: boolean; adult: boolean }
/** The single privacy card's answer (Save). Decline / "Got it" resolve `null`: every switch stays off. */
export interface PrivacyCardResult { personalized: boolean; analytics: boolean }
export interface PrivacyStatus {
  resolved: boolean; personalized: boolean; adult: boolean; minor: boolean; noAds: boolean;
  /** noAds and rewards are granted without an ad (`noAdsMode: 'grantWithoutAd'`). */
  noAdsFree: boolean;
  /** Google's own form decides in this region (EEA / UK / CH): the sheet shows a button instead of the switch. */
  ump: boolean; ios: boolean;
}
export type PrivacyResult = { k: 'save'; choice: ChoiceResult } | { k: 'ump' } | { k: 'cancel' };

export type AdView =
  | { k: 'mockInterstitial'; skipMs: number }
  | { k: 'mockRewarded'; ms: number }
  /**
   * ONE privacy card (sprint 3, docs/design/15 §5): notice text + personalised-ads switch (`ads`) + analytics switch
   * (`analytics`), both OFF; equal [Keep all off] [Save my choice]. A minor sees the locked line and one [Got it].
   */
  | { k: 'privacyCard'; ads: boolean; analytics: boolean; minor: boolean }
  | { k: 'ump' }
  | { k: 'att' }
  | { k: 'privacy'; status: PrivacyStatus };

export interface ViewResult {
  mockInterstitial: null;
  /** true: watched to the end. */
  mockRewarded: boolean;
  /** null: declined / acknowledged (all off). */
  privacyCard: PrivacyCardResult | null;
  /** true: consented in the (mock) UMP form. */
  ump: boolean;
  att: null;
  privacy: PrivacyResult;
}

export interface Presented { id: number; view: AdView }
interface Entry extends Presented { resolve: (v: never) => void }

let seq = 1;
let hosts = 0;
const queue: Entry[] = [];
let current: Presented | null = null;
const listeners = new Set<() => void>();
const emit = () => { current = queue[0] ? { id: queue[0].id, view: queue[0].view } : null; for (const l of listeners) l(); };

export const subscribeView = (l: () => void): (() => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export const getView = (): Presented | null => current;
/** <AdHost/> mounted / unmounted. */
export function hostMounted(on: boolean): void { hosts = Math.max(0, hosts + (on ? 1 : -1)); }
export const hasHost = (): boolean => hosts > 0;

export function present<K extends AdView['k']>(view: Extract<AdView, { k: K }>, fallback: ViewResult[K]): Promise<ViewResult[K]> {
  if (!hasHost()) return Promise.resolve(fallback);
  return new Promise<ViewResult[K]>((resolve) => {
    queue.push({ id: seq++, view, resolve: resolve as (v: never) => void });
    emit();
  });
}

/** The host answers the view it is showing. A stale id (already answered) is ignored. */
export function resolveView<K extends AdView['k']>(id: number, value: ViewResult[K]): void {
  if (queue[0]?.id !== id) return;
  const e = queue.shift()!;
  emit();
  (e.resolve as (v: ViewResult[K]) => void)(value);
}
