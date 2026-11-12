/**
 * Thin, typed call sites for the game, the shop and the ad layer (pure: bound to a core by `createHooks`).
 * Each hook is one cheap synchronous call — a few counter increments and at most a couple of `track()`s — so the
 * game loop pays nothing measurable. Game code passes ids and numbers only; names and prose never enter here.
 */
import type { AnalyticsCore } from './core';
import { ageBand, causeClass, livesBucket, toId, type EventParams } from './events';

type Surface = EventParams<'paywall_view'>['surface'];
type FailReason = EventParams<'purchase_fail'>['reason'];
type AdFormat = EventParams<'ad_shown'>['format'];

const FAIL_REASONS: readonly string[] = ['cancelled', 'pending', 'unavailable', 'network', 'not_allowed', 'product_unavailable', 'already_owned', 'store', 'unknown'];
/** `extraPractice` → `extra_practice` (ad placement ids are camelCase in src/ads). */
export const snakeId = (s: string): string => toId(String(s).replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase());
const domainOf = (tags: readonly string[] | undefined): string => toId(tags?.[0]);

export interface HookOptions {
  /** 0..100: share of shown days that emit `day_shown` (Remote Config `day_shown_sample_pct`). */
  daySamplePct?: () => number;
  random?: () => number;
}

export function createHooks(a: AnalyticsCore, o: HookOptions = {}) {
  const rnd = o.random ?? Math.random;
  let surface: Surface = 'store';
  return {
    // ── game (useGame) ───────────────────────────────────────────────────────
    game: {
      /** Launch finished: the first screen is up. */
      boot(p: { locale: string; lifeNo: number; contentHash: string; stage: 'file' | 'play' }): void {
        a.setUserProps({ locale: p.locale === 'en' ? 'en' : 'tr', lives_bucket: livesBucket(p.lifeNo), content_hash: toId(p.contentHash, 'unknown') });
        a.screen(p.stage === 'play' ? 'life' : 'client_file');
      },
      /** A coach line reached the feed (only the first one of the install is an event). */
      coachLine(): void { if (!a.ftueDone('line_seen')) a.ftue('line_seen'); },
      lifeStart(p: { lifeNo: number; fastLife: boolean }): void {
        a.ftue('life_start');
        const since = a.takeMsSinceDeath();
        if (since > 0) a.track('rebirth', { ms_since_death: since, life_no: p.lifeNo });
        a.track('life_start', { life_no: p.lifeNo, fast_life: p.fastLife });
        a.setUserProps({ lives_bucket: livesBucket(p.lifeNo) });
        a.sessionReason(null);
        a.screen('life');
      },
      dayShown(p: { eventId: string; tags?: readonly string[]; age: number; kind: string; auto: boolean; fast: boolean }): void {
        a.count('shown_days');
        a.count(p.auto ? 'speed_auto' : p.fast ? 'speed_fast' : 'speed_play');
        const pct = Math.max(0, Math.min(100, o.daySamplePct?.() ?? 10));
        if (pct > 0 && rnd() * 100 < pct) a.track('day_shown', { event_id: toId(p.eventId), domain: domainOf(p.tags), age_band: ageBand(p.age), kind: toId(p.kind, 'event'), sample_pct: Math.round(pct) });
      },
      answer(p: { eventId: string; choiceId: string; tags?: readonly string[]; age: number; via: 'tap' | 'auto' }): void {
        a.ftue('decision');
        a.count('answers');
        if (p.via === 'auto') a.count('auto_answers');
        a.track('answer', { event_id: toId(p.eventId), choice_id: toId(p.choiceId), domain: domainOf(p.tags), age_band: ageBand(p.age), via: p.via });
      },
      /** Wager stamp: `calledIt` = the coach was right. */
      stamp(p: { eventId?: string; result: 'calledIt' | 'iWasWrong'; pOddsBp: number }): void {
        a.ftue('stamp');
        a.track('wager_resolved', { ...(p.eventId ? { event_id: toId(p.eventId) } : {}), p_odds: Math.round(p.pOddsBp / 100), result: p.result === 'calledIt' ? 'hit' : 'wrong' });
      },
      reportCard(p: { age: number; grades: Readonly<Record<string, number>>; shownDaysYear: number }): void {
        a.ftue('report_card');
        a.count('birthdays');
        const g = p.grades;
        const code = ['health', 'money', 'relationships', 'brain', 'courage', 'spectacle'].map((k) => 'fdcba'[Math.max(0, Math.min(4, Math.round(g[k] ?? 0)))]).join('');
        a.track('year_end', { age: p.age, grades: code, shown_days_year: p.shownDaysYear });
      },
      oneMoreYear(p: { age: number; via: 'tap' | 'auto' }): void { a.track('year_continue', p); },
      milestone(kind: string, age: number): void {
        const k = kind === 'wagerWin' ? 'wager_win' : kind;
        if (k === 'birthday' || k === 'promotion' || k === 'sad' || k === 'legendary' || k === 'wager_win') a.track('milestone', { kind: k, age });
      },
      death(p: { age: number; cause: string | null | undefined; channel: 'hazard' | 'scripted'; lifeNo: number; shownDays: number; autoDays: number }): void {
        a.track('death', { age: p.age, cause_class: causeClass(p.cause), channel: p.channel, life_no: p.lifeNo, shown_days: p.shownDays, auto_days: p.autoDays });
        a.markDeath();
        a.sessionReason('death');
        a.screen('death');
      },
      newClient(): void { a.screen('client_file'); },
      enough(): void { a.sessionReason('enough'); },
      closed(): void { a.sessionReason('close'); },
      resumed(): void { a.sessionReason(null); },
      locale(locale: string): void {
        const l = locale === 'en' ? 'en' : 'tr';
        a.setUserProps({ locale: l });
        a.track('settings_change', { setting: 'language', value: l });
      },
      setting(setting: 'fast_life' | 'auto' | 'haptics', on: boolean): void { a.track('settings_change', { setting, value: on ? 'on' : 'off' }); },
      share(card: 'death' | 'report'): void { a.track('share', { card }); },
    },
    /** Current values only — the moment the sound switch is flipped is never an event (11 §2.2.3 #6). */
    userState(p: { soundOn?: boolean; payer?: boolean; noAds?: boolean }): void {
      a.setUserProps({ ...(p.soundOn === undefined ? {} : { sound: p.soundOn ? 'on' : 'off' }), ...(p.payer === undefined ? {} : { payer: p.payer ? '1' : '0' }),
        ...(p.noAds === undefined ? {} : { no_ads: p.noAds ? '1' : '0' }) });
    },

    // ── shop (ShopScreen / purchases) ────────────────────────────────────────
    /** The shop / a paywall became visible. `surface` is remembered for the purchase events that follow. */
    trackPaywallView(s: Surface = 'store'): void { surface = s; a.screen('shop'); a.track('paywall_view', { surface: s }); },
    trackPurchaseStart(sku: string): void { a.track('purchase_start', { sku: toId(sku), surface }); },
    /**
     * The outcome of `PurchaseController.buy`. `price` / `currencyCode` are the store product's numbers
     * (StoreProduct.price / .currencyCode) — never a receipt, token or transaction id.
     */
    trackPurchaseResult(r: { status: 'ok' | 'pending' | 'cancelled' | 'restored' | 'failed'; sku: string; code?: string }, product?: { price: number; currencyCode: string } | null): void {
      const sku = toId(r.sku);
      if (r.status === 'ok') {
        if (product && Number.isFinite(product.price) && /^[A-Za-z]{3}$/.test(product.currencyCode)) a.track('purchase', { sku, value: product.price, currency: product.currencyCode.toLowerCase(), surface });
        else a.recordError('shop', 'purchase_without_price');
        a.setUserProps({ payer: '1' });
        return;
      }
      const raw = r.status === 'failed' ? r.code ?? 'unknown' : r.status === 'restored' ? 'already_owned' : r.status;
      a.track('purchase_fail', { sku, surface, reason: (FAIL_REASONS.includes(raw) ? raw : 'unknown') as FailReason });
    },
    trackRestore(r: { status: 'ok' | 'none' | 'failed'; restored?: readonly unknown[] }): void {
      a.track('purchase_restore', { result: r.status, count: r.restored?.length ?? 0 });
      if (r.status === 'ok') a.setUserProps({ payer: '1' });
    },

    // ── ads (useGame offer flow / AdService) ─────────────────────────────────
    trackAdOffer(placement: string): void { a.track('ad_offer_shown', { placement: snakeId(placement) }); },
    /** `noFill` (src/ads RewardedResult) is accepted as `no_fill`. */
    trackAdSkip(placement: string, reason: 'declined' | 'no_fill' | 'noFill' | 'closed' | 'error'): void {
      a.track('ad_skip', { placement: snakeId(placement), reason: reason === 'noFill' ? 'no_fill' : reason });
    },
    trackAdShown(placement: string, format: AdFormat): void { a.track('ad_shown', { placement: snakeId(placement), format }); },
    trackAdReward(placement: string, free: boolean): void { a.track('ad_reward_earned', { placement: snakeId(placement), free }); },
    /**
     * Paid event of the ad SDK (AdMob `onPaidEvent`: valueMicros + currencyCode). Sent to Meta as `AdImpression`;
     * to Firebase only when AdMob is NOT linked to the Firebase project (the link logs it automatically).
     */
    trackAdRevenue(p: { placement: string; format: AdFormat; valueMicros: number; currency: string; source?: string; platform?: 'admob' | 'mock' }): void {
      if (!Number.isFinite(p.valueMicros) || p.valueMicros < 0 || !/^[A-Za-z]{3}$/.test(p.currency)) return;
      a.track('ad_impression', { ad_platform: p.platform ?? 'admob', ad_format: p.format, ad_unit_name: snakeId(p.placement), value: p.valueMicros / 1e6, currency: p.currency.toLowerCase(),
        ...(p.source ? { ad_source: toId(p.source) } : {}) });
    },
  };
}
export type AnalyticsHooks = ReturnType<typeof createHooks>;
