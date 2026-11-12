/**
 * Analytics layer without any SDK (docs/design/17): catalog limits, the "never logged" rules, the consent gate
 * (nothing before consent, flush after, drop on denial — per purpose), sessions, the Firebase / Meta mappings and
 * Remote Config parsing. Everything runs on AnalyticsCore with fake providers / fake SDKs and a manual clock.
 */
import { describe, expect, it } from 'vitest';
import { analyticsState, consentModeV2, deriveConsent, emptyChoice, marketingState, NOTICE_VERSION, type AdsConsentView, type ConsentSnapshot } from '../src/analytics/consent';
import { ANALYTICS_KEY, AnalyticsCore, decodeStored } from '../src/analytics/core';
import {
  AGE_BANDS, COMMON_PARAMS, EVENTS, EVENT_NAMES, ID_RE, LIMITS, SCHEMA_VERSION, USER_PROPS, ageBand, causeClass, isoWeek, livesBucket, sanitizeEvent, sanitizeUserProps,
  type EventName, type EventSpec, type Params,
} from '../src/analytics/events';
import { createHooks, snakeId } from '../src/analytics/gameHooks';
import { analyticsPromptDue } from '../src/analytics/promptStore';
import { DebugBuffer, DebugProvider } from '../src/analytics/providers/DebugProvider';
import { FirebaseProvider, firebaseParams, type FirebaseSdk } from '../src/analytics/providers/FirebaseProvider';
import { MetaProvider, type MetaSdk } from '../src/analytics/providers/MetaProvider';
import { META_EVENTS, META_MAPPED, isMetaMapped, toMeta } from '../src/analytics/providers/metaMap';
import { NoopProvider } from '../src/analytics/providers/NoopProvider';
import type { AnalyticsProvider } from '../src/analytics/providers/types';
import { RC_DEFAULTS, RemoteConfig, parseRc } from '../src/analytics/remoteConfig';
import { analyticsTr } from '../src/i18n/analyticsTr';
import { analyticsEn } from '../src/i18n/analyticsEn';

const SPECS = EVENTS as Record<string, EventSpec>;
const tick = async (n = 6): Promise<void> => { for (let i = 0; i < n; i++) await Promise.resolve(); };

function memKV() {
  const data = new Map<string, string>();
  return { data, read: async (k: string) => data.get(k) ?? null, write: async (k: string, v: string) => { data.set(k, v); return true; } };
}

/** A sink that records everything it is handed. */
class Spy implements AnalyticsProvider {
  log: { name: EventName; params: Params }[] = [];
  inits = 0; resets = 0; consents: ConsentSnapshot[] = []; users: Record<string, string>[] = [];
  constructor(readonly name: string, readonly purpose: 'analytics' | 'marketing', private readonly only?: (n: EventName) => boolean, private readonly fail = false) {}
  accepts(n: EventName): boolean { return this.only ? this.only(n) : true; }
  async init(): Promise<void> { this.inits++; if (this.fail) throw new Error('sdk missing'); }
  setConsent(c: ConsentSnapshot): void { this.consents.push(c); }
  logEvent(name: EventName, params: Params): void { this.log.push({ name, params }); }
  setUserProps(p: Readonly<Record<string, string>>): void { this.users.push({ ...p }); }
  reset(): void { this.resets++; }
  names(): string[] { return this.log.map((e) => e.name); }
}

const ADS_OFF: AdsConsentView = { resolved: false, adsPersonalized: false, isMinor: false, att: 'undetermined' };
const ADS_DECLINED: AdsConsentView = { resolved: true, adsPersonalized: false, isMinor: false, att: 'skipped' };
const ADS_ON = (att: AdsConsentView['att'] = 'authorized'): AdsConsentView => ({ resolved: true, adsPersonalized: true, isMinor: false, att });

function rig(o: { platform?: 'ios' | 'android' | 'web'; kv?: ReturnType<typeof memKV>; providers?: AnalyticsProvider[]; queueLimit?: number; gap?: number } = {}) {
  const clock = { t: Date.UTC(2026, 10, 12, 9, 0, 0) };
  const kv = o.kv ?? memKV();
  const fa = new Spy('fa', 'analytics');
  const meta = new Spy('meta', 'marketing', isMetaMapped);
  const core = new AnalyticsCore({ providers: o.providers ?? [fa, meta], platform: o.platform ?? 'android', kv, now: () => clock.t, localDay: () => '2026-11-12',
    queueLimit: o.queueLimit ?? 400, sessionGapMs: o.gap ?? 600_000, saveDelayMs: 0 });
  return { core, kv, fa, meta, clock, hooks: createHooks(core, { daySamplePct: () => 100, random: () => 0 }) };
}

// ── catalog ──────────────────────────────────────────────────────────────────
describe('event catalog — Firebase / GA4 limits', () => {
  // React Native Firebase rejects these names (analytics/lib/index.ts ReservedEventNames) — GA4 reserves them.
  const RESERVED = ['ad_activeview', 'ad_click', 'ad_exposure', 'ad_query', 'ad_reward', 'adunit_exposure', 'app_background', 'app_clear_data', 'app_remove', 'app_store_refund',
    'app_store_subscription_cancel', 'app_store_subscription_convert', 'app_store_subscription_renew', 'app_update', 'app_upgrade', 'dynamic_link_app_open', 'dynamic_link_app_update',
    'dynamic_link_first_open', 'error', 'first_open', 'first_visit', 'in_app_purchase', 'notification_dismiss', 'notification_foreground', 'notification_open', 'notification_receive',
    'os_update', 'session_start', 'session_start_with_rollout', 'user_engagement'];

  it('has few, well-formed, non-reserved event names', () => {
    expect(EVENT_NAMES.length).toBeGreaterThan(20);
    expect(EVENT_NAMES.length).toBeLessThanOrEqual(LIMITS.eventNames);
    expect(EVENT_NAMES.length).toBeLessThanOrEqual(60);                        // our own budget (11: "42 events")
    for (const n of EVENT_NAMES) {
      expect(n, n).toMatch(/^[a-z][a-z0-9_]*$/);
      expect(n.length, n).toBeLessThanOrEqual(LIMITS.eventNameLen);
      expect(RESERVED, n).not.toContain(n);
      expect(/^(firebase_|google_|ga_)/.test(n), n).toBe(false);
    }
  });

  it('keeps every event within 25 params (common params included) and 40-char param names', () => {
    for (const n of EVENT_NAMES) {
      const keys = Object.keys(SPECS[n]!.p);
      expect(keys.length + COMMON_PARAMS.length + 1 /* purchase `items` */, n).toBeLessThanOrEqual(LIMITS.paramsPerEvent);
      for (const k of keys) {
        expect(k, `${n}.${k}`).toMatch(/^[a-z][a-z0-9_]*$/);
        expect(k.length, `${n}.${k}`).toBeLessThanOrEqual(LIMITS.paramNameLen);
        expect(COMMON_PARAMS as readonly string[], `${n}.${k}`).not.toContain(k);
      }
      for (const k of SPECS[n]!.opt ?? []) expect(keys, `${n} opt ${k}`).toContain(k);
      expect(SPECS[n]!.kpi.length, n).toBeGreaterThan(0);
    }
  });

  it('keeps string values short: enums ≤ 100 chars, ids ≤ 64', () => {
    for (const n of EVENT_NAMES) for (const kind of Object.values(SPECS[n]!.p)) {
      if (Array.isArray(kind)) for (const v of kind as string[]) { expect(v.length).toBeLessThanOrEqual(LIMITS.stringValueLen); expect(v).toMatch(ID_RE); }
    }
    expect(sanitizeEvent('answer', { event_id: 'a'.repeat(65), choice_id: 'x', domain: 'y', age_band: '18_24', via: 'tap' })).toBeNull();
  });

  it('user properties fit GA4 (≤ 25, name ≤ 24, value ≤ 36)', () => {
    const names = Object.keys(USER_PROPS);
    expect(names.length).toBeLessThanOrEqual(LIMITS.userProps);
    for (const n of names) {
      expect(n.length, n).toBeLessThanOrEqual(LIMITS.userPropNameLen);
      const kind = (USER_PROPS as Record<string, 'id' | readonly string[]>)[n]!;
      if (Array.isArray(kind)) for (const v of kind) expect(v.length).toBeLessThanOrEqual(LIMITS.userPropValueLen);
    }
    expect(sanitizeUserProps({ app_version: 'x'.repeat(37) })).toEqual({});
    expect(sanitizeUserProps({ locale: 'tr', payer: '1', lives_bucket: '2_3', bogus: 'x', sound: 'loud' })).toEqual({ locale: 'tr', payer: '1', lives_bucket: '2_3' });
  });

  it('the standard revenue events have the GA4 shapes', () => {
    expect(Object.keys(EVENTS.purchase.p)).toEqual(expect.arrayContaining(['value', 'currency']));
    expect(Object.keys(EVENTS.ad_impression.p)).toEqual(expect.arrayContaining(['ad_platform', 'ad_format', 'ad_unit_name', 'value', 'currency']));
    expect(firebaseParams('purchase', { sku: 'torpil', value: 199.99, currency: 'try', surface: 'store' })).toMatchObject({
      value: 199.99, currency: 'try', items: [{ item_id: 'torpil', quantity: 1, price: 199.99 }] });
  });

  it('buckets ages, lives and weeks', () => {
    expect([18, 24, 25, 44, 64, 65, 90].map(ageBand)).toEqual(['18_24', '18_24', '25_34', '35_44', '55_64', '65_plus', '65_plus']);
    expect(AGE_BANDS).toHaveLength(6);
    expect([1, 2, 3, 4, 9, 10].map(livesBucket)).toEqual(['1', '2_3', '2_3', '4_9', '4_9', '10_plus']);
    expect(isoWeek(new Date(2026, 10, 12))).toBe('2026w46');
    expect(isoWeek(new Date(2027, 0, 1))).toBe('2026w53');
    expect(causeClass('old.circ')).toBe('circ');
    expect(causeClass('Şaka ölümü')).toBe('unknown');
    expect(causeClass(null)).toBe('unknown');
    expect(snakeId('extraPractice')).toBe('extra_practice');
  });
});

// ── no personal data ─────────────────────────────────────────────────────────
describe('never logged (11 §2.2.3)', () => {
  const WORDS = new Set(['name', 'city', 'seed', 'email', 'mail', 'phone', 'address', 'device', 'advertising', 'idfa', 'idfv', 'gaid', 'adid', 'aaid', 'ip', 'lat', 'lon', 'lng', 'geo',
    'location', 'birth', 'birthday', 'gender', 'token', 'receipt', 'transaction', 'user', 'uid', 'text', 'message', 'note', 'hour', 'time', 'timestamp']);
  const FORBIDDEN = { test: (key: string): boolean => key.split('_').some((w) => WORDS.has(w)) };
  const ALLOWED = new Set(['screen_name', 'ad_unit_name']);                                       // GA4 standard param names; enum / machine-id valued here

  it('no param or user property is named like personal data', () => {
    for (const n of EVENT_NAMES) for (const k of Object.keys(SPECS[n]!.p)) if (!ALLOWED.has(k)) expect(FORBIDDEN.test(k), `${n}.${k}`).toBe(false);
    for (const k of Object.keys(USER_PROPS)) expect(FORBIDDEN.test(k), k).toBe(false);
  });

  it('there is no free-text param kind: every param is a number, a boolean, an enum or a machine id', () => {
    for (const n of EVENT_NAMES) for (const [k, kind] of Object.entries(SPECS[n]!.p)) {
      expect(Array.isArray(kind) || ['int', 'num', 'bool', 'id'].includes(kind as string), `${n}.${k}`).toBe(true);
    }
  });

  it('prose, player names and unknown keys cannot pass the sanitizer', () => {
    const base = { event_id: 'ev_1', choice_id: 'a', domain: 'aile', age_band: '18_24', via: 'tap' };
    expect(sanitizeEvent('answer', base)).toEqual(base);
    expect(sanitizeEvent('answer', { ...base, event_id: 'Ayşe Yılmaz' })).toBeNull();          // a name is not an id
    expect(sanitizeEvent('answer', { ...base, choice_id: 'I said no to mom' })).toBeNull();
    expect(sanitizeEvent('answer', { ...base, player_name: 'Ayşe', lifeSeed: 'L-abc' })).toEqual(base);   // extra keys are dropped
    expect(sanitizeEvent('answer', { ...base, via: 'voice' })).toBeNull();
    expect(sanitizeEvent('not_in_catalog', {})).toBeNull();
    expect(sanitizeEvent('death', { age: 71, cause_class: 'circ', channel: 'hazard', life_no: 2, shown_days: 900, auto_days: 0, name: 'Ali' }))
      .toEqual({ age: 71, cause_class: 'circ', channel: 'hazard', life_no: 2, shown_days: 900, auto_days: 0 });
    expect(sanitizeEvent('ftue_decision', { ms: Number.NaN })).toBeNull();
  });

  it('the hooks only ever emit catalog-clean events, even when the game hands them names and prose', async () => {
    const r = rig();
    await r.core.ready();
    r.core.setAnalyticsConsent(true);
    r.core.foreground();
    r.hooks.game.lifeStart({ lifeNo: 1, fastLife: false });
    r.hooks.game.answer({ eventId: 'Çok Özel Olay!', choiceId: 'Annemi aradım', tags: ['Aile Meselesi'], age: 30, via: 'tap' });
    r.hooks.game.death({ age: 70, cause: 'Ayşe düştü', channel: 'scripted', lifeNo: 1, shownDays: 10, autoDays: 0 });
    await tick();
    const blob = JSON.stringify(r.fa.log);
    expect(blob).not.toMatch(/Ayşe|Annemi|Özel|Mesele/);
    expect(r.fa.log.find((e) => e.name === 'answer')!.params).toMatchObject({ event_id: 'other', choice_id: 'other', domain: 'other' });
    expect(r.fa.log.find((e) => e.name === 'death')!.params.cause_class).toBe('unknown');
    for (const e of r.fa.log) for (const v of Object.values(e.params)) if (typeof v === 'string') expect(v).toMatch(ID_RE);
  });

  it('sound has no event: only a user property with the current value', () => {
    expect(EVENTS.settings_change.p.setting).not.toContain('sound');
    expect(Object.keys(USER_PROPS)).toContain('sound');
  });
});

// ── consent model ────────────────────────────────────────────────────────────
describe('consent model', () => {
  it('analytics: unknown until answered, locked off for a minor, asked again on a newer notice', () => {
    expect(analyticsState(emptyChoice(), false)).toBe('unknown');
    expect(analyticsState({ analytics: true, decidedDay: 'd', noticeVersion: NOTICE_VERSION }, false)).toBe('granted');
    expect(analyticsState({ analytics: false, decidedDay: 'd', noticeVersion: NOTICE_VERSION }, false)).toBe('denied');
    expect(analyticsState({ analytics: true, decidedDay: 'd', noticeVersion: NOTICE_VERSION }, true)).toBe('denied');
    expect(analyticsState({ analytics: true, decidedDay: 'd', noticeVersion: NOTICE_VERSION - 1 }, false)).toBe('unknown');
  });

  it('marketing: needs the explicit ad opt-in and, on iOS, ATT authorised', () => {
    expect(marketingState(ADS_OFF, 'android')).toBe('unknown');
    expect(marketingState(ADS_DECLINED, 'android')).toBe('denied');
    expect(marketingState(ADS_ON('skipped'), 'android')).toBe('granted');
    expect(marketingState(ADS_ON('undetermined'), 'ios')).toBe('unknown');
    expect(marketingState(ADS_ON('denied'), 'ios')).toBe('denied');
    expect(marketingState(ADS_ON('restricted'), 'ios')).toBe('denied');
    expect(marketingState(ADS_ON('authorized'), 'ios')).toBe('granted');
    expect(marketingState({ ...ADS_ON(), isMinor: true }, 'ios')).toBe('denied');
  });

  it('maps to Consent Mode v2: all four denied by default, analytics and ad signals independent', () => {
    expect(consentModeV2(deriveConsent(emptyChoice(), ADS_OFF, 'android'))).toEqual({ analytics_storage: false, ad_storage: false, ad_user_data: false, ad_personalization: false });
    const yes = { analytics: true, decidedDay: 'd', noticeVersion: NOTICE_VERSION };
    expect(consentModeV2(deriveConsent(yes, ADS_DECLINED, 'android'))).toEqual({ analytics_storage: true, ad_storage: false, ad_user_data: false, ad_personalization: false });
    expect(consentModeV2(deriveConsent(emptyChoice(), ADS_ON(), 'ios'))).toEqual({ analytics_storage: false, ad_storage: true, ad_user_data: true, ad_personalization: true });
    expect(consentModeV2(deriveConsent(yes, ADS_ON('denied'), 'ios'))).toEqual({ analytics_storage: true, ad_storage: false, ad_user_data: false, ad_personalization: false });
  });

  it('the question is due after the ad consent step or from the second session, never twice', () => {
    expect(analyticsPromptDue({ analytics: 'unknown', adsResolved: false, sessionCount: 1 })).toBe(false);
    expect(analyticsPromptDue({ analytics: 'unknown', adsResolved: true, sessionCount: 1 })).toBe(true);
    expect(analyticsPromptDue({ analytics: 'unknown', adsResolved: false, sessionCount: 2 })).toBe(true);
    expect(analyticsPromptDue({ analytics: 'denied', adsResolved: true, sessionCount: 9 })).toBe(false);
    expect(analyticsPromptDue({ analytics: 'granted', adsResolved: true, sessionCount: 9 })).toBe(false);
  });

  it('consent strings exist in both languages and say where the data goes', () => {
    expect(Object.keys(analyticsEn).sort()).toEqual(Object.keys(analyticsTr).sort());
    expect(analyticsTr.promptBody).toMatch(/yurt dışı/);
    expect(analyticsEn.promptBody).toMatch(/abroad/);
  });
});

// ── consent gate ─────────────────────────────────────────────────────────────
describe('consent gate', () => {
  it('records nothing and starts no SDK before a choice; events wait on the device', async () => {
    const r = rig();
    r.core.foreground();
    r.core.track('life_start', { life_no: 1, fast_life: false });               // before storage is even read
    await r.core.ready();
    r.core.track('answer', { event_id: 'e1', choice_id: 'a', domain: 'is', age_band: '18_24', via: 'tap' });
    r.core.setUserProps({ locale: 'tr' });
    await tick();
    expect(r.fa.inits).toBe(0);
    expect(r.fa.log).toEqual([]);
    expect(r.fa.users).toEqual([]);
    expect(r.meta.inits).toBe(0);
    expect(r.core.pending().analytics).toBe(4);                                // app_first_launch, session start, life_start, answer
    expect(r.core.pending().marketing).toBe(0);                                // none of them is a Meta-mapped event
  });

  it('flushes the queue in order once analytics is granted, with schema_v and lag_s', async () => {
    const r = rig();
    r.core.foreground();
    await r.core.ready();
    r.core.track('life_start', { life_no: 1, fast_life: false });
    r.clock.t += 5 * 60_000;
    r.core.setAnalyticsConsent(true);
    r.core.track('year_end', { age: 19, grades: 'abcdef', shown_days_year: 20 });
    await tick();
    expect(r.fa.inits).toBe(1);
    expect(r.fa.names()).toEqual(['app_first_launch', 'game_session_start', 'life_start', 'year_end']);
    expect(r.fa.log[2]!.params).toMatchObject({ life_no: 1, schema_v: SCHEMA_VERSION, lag_s: 300 });
    expect(r.fa.log[3]!.params.lag_s).toBeUndefined();
    expect(r.fa.consents.at(-1)).toMatchObject({ analytics: 'granted' });
    expect(r.core.pending().analytics).toBe(0);
    expect(r.meta.log).toEqual([]);                                            // analytics consent says nothing about Meta
  });

  it('drops the queue when consent is denied, and nothing is recorded afterwards', async () => {
    const r = rig();
    r.core.foreground();
    await r.core.ready();
    r.core.track('life_start', { life_no: 1, fast_life: false });
    expect(r.core.pending().analytics).toBe(3);
    r.core.setAnalyticsConsent(false);
    r.core.track('year_end', { age: 19, grades: 'abcdef', shown_days_year: 20 });
    r.hooks.game.answer({ eventId: 'e1', choiceId: 'a', age: 20, via: 'tap' });
    r.core.background();
    await tick();
    expect(r.core.pending().analytics).toBe(0);
    expect(r.fa.inits).toBe(0);
    expect(r.fa.log).toEqual([]);
    expect(JSON.parse(r.kv.data.get(ANALYTICS_KEY)!).queue.analytics).toEqual([]);
    r.core.setAdsConsent(ADS_DECLINED);                                        // the ad consent step was declined too
    expect(JSON.parse(r.kv.data.get(ANALYTICS_KEY)!).queue).toEqual({ analytics: [], marketing: [] });
  });

  it('turning the switch off later stops the flow and tells the SDK; turning it on again resumes', async () => {
    const r = rig();
    await r.core.ready();
    r.core.setAnalyticsConsent(true);
    r.core.track('tutorial_begin');
    await tick();
    r.core.setAnalyticsConsent(false);
    r.core.track('tutorial_complete');
    await tick();
    expect(r.fa.names()).toEqual(['app_first_launch', 'tutorial_begin']);
    expect(r.fa.consents.at(-1)).toMatchObject({ analytics: 'denied' });
    r.core.setAnalyticsConsent(true);
    r.core.track('tutorial_complete');
    await tick();
    expect(r.fa.names()).toEqual(['app_first_launch', 'tutorial_begin', 'tutorial_complete']);
    expect(r.fa.inits).toBe(1);
  });

  it('a known minor is never tracked, whatever was answered', async () => {
    const r = rig();
    await r.core.ready();
    r.core.setAdsConsent({ ...ADS_ON(), isMinor: true });
    r.core.setAnalyticsConsent(true);
    r.core.track('tutorial_begin');
    r.core.track('tutorial_complete');
    await tick();
    expect(r.core.getConsent()).toMatchObject({ analytics: 'denied', marketing: 'denied', minor: true });
    expect(r.fa.inits + r.meta.inits).toBe(0);
    expect(r.fa.log.length + r.meta.log.length).toBe(0);
  });

  it('keeps the choice and the waiting events across launches; a stored denial stays a denial', async () => {
    const kv = memKV();
    const a = rig({ kv });
    a.core.foreground();
    await a.core.ready();
    a.core.track('life_start', { life_no: 1, fast_life: false });
    a.core.background();
    await tick();
    const b = rig({ kv });
    b.core.foreground();
    await b.core.ready();
    expect(b.core.pending().analytics).toBe(5);                                // 4 from launch one + this launch's session start
    b.core.setAnalyticsConsent(true);
    await tick();
    expect(b.fa.names()).toEqual(['app_first_launch', 'game_session_start', 'life_start', 'game_session_end', 'game_session_start']);
    expect(b.fa.names().filter((n) => n === 'app_first_launch')).toHaveLength(1);
    b.core.setAnalyticsConsent(false);
    await tick();
    const c = rig({ kv });
    await c.core.ready();
    c.core.track('tutorial_begin');
    await tick();
    expect(c.core.getConsent().analytics).toBe('denied');
    expect(c.fa.inits).toBe(0);
    expect(c.fa.log).toEqual([]);
  });

  it('bounds the waiting queue (oldest dropped) and re-validates stored events', async () => {
    const r = rig({ queueLimit: 5 });
    await r.core.ready();
    for (let i = 0; i < 20; i++) r.core.track('year_end', { age: 19 + i, grades: 'abcdef', shown_days_year: 1 });
    expect(r.core.pending().analytics).toBe(5);
    r.core.setAnalyticsConsent(true);
    await tick();
    expect(r.fa.log.map((e) => e.params.age)).toEqual([34, 35, 36, 37, 38]);
    const stored = decodeStored(JSON.stringify({ v: 1, queue: { analytics: [{ n: 'renamed_event', p: {}, t: 1 }, { n: 'tutorial_begin', p: { name: 'Ali' }, t: 2 }], marketing: 'x' } }), 10)!;
    expect(stored.queue.analytics).toEqual([{ n: 'tutorial_begin', p: { schema_v: SCHEMA_VERSION }, t: 2 }]);
    expect(decodeStored('{broken', 10)).toBeNull();
  });

  it('"delete my data" wipes the device queue and resets every started SDK', async () => {
    const r = rig();
    await r.core.ready();
    r.core.track('tutorial_begin');
    await r.core.resetData();
    expect(r.core.pending().analytics).toBe(0);
    expect(r.fa.resets).toBe(0);                                               // never started → nothing to reset
    r.core.setAnalyticsConsent(true);
    await tick();
    await r.core.resetData();
    expect(r.fa.resets).toBe(1);
    expect(r.fa.names()).toEqual([]);                                          // the wiped events were never sent
  });

  it('never throws: broken storage, a provider that fails to start, a provider that throws on every call', async () => {
    const angry: AnalyticsProvider = { name: 'angry', purpose: 'analytics', init: async () => undefined, setConsent: () => { throw new Error('x'); },
      logEvent: () => { throw new Error('x'); }, setUserProps: () => { throw new Error('x'); }, reset: () => { throw new Error('x'); } };
    const missing = new Spy('missing', 'analytics', undefined, true);
    const ok = new Spy('ok', 'analytics');
    const kv = { read: async (): Promise<string | null> => { throw new Error('disk'); }, write: async (): Promise<boolean> => { throw new Error('disk'); } };
    const core = new AnalyticsCore({ providers: [angry, missing, ok, new NoopProvider()], platform: 'web', kv, now: () => 1, localDay: () => 'd', saveDelayMs: 0 });
    expect(() => {
      core.foreground();
      core.track('tutorial_begin');
      (core.track as (n: string, p?: unknown) => void)('nope', { a: 1 });
      (core.track as (n: string, p?: unknown) => void)('answer', null);
      core.setUserProps({ locale: 'tr' });
      core.recordError('save', 'write_failed', new Error('boom'));
      core.background();
    }).not.toThrow();
    await core.ready();
    core.setAnalyticsConsent(true);
    core.track('tutorial_complete');
    core.setUserProps({ locale: 'en' });
    await tick();
    await expect(core.resetData()).resolves.toBeUndefined();
    expect(ok.names()).toContain('tutorial_complete');
    expect(missing.log).toEqual([]);
  });

  it('the debug sink obeys the same gate (what the demo buffer shows is what would have left the device)', async () => {
    const buffer = new DebugBuffer(50);
    const r = rig({ providers: [new DebugProvider(buffer)] });
    r.core.foreground();
    await r.core.ready();
    r.core.track('tutorial_begin');
    await tick();
    expect(buffer.all()).toEqual([]);
    r.core.setAnalyticsConsent(true);
    await tick();
    expect(buffer.all().filter((e) => e.kind === 'event').map((e) => e.name)).toEqual(['app_first_launch', 'game_session_start', 'tutorial_begin']);
    expect(buffer.all()[0]).toMatchObject({ kind: 'init' });
  });
});

// ── sessions / FTUE ──────────────────────────────────────────────────────────
describe('sessions and FTUE', () => {
  it('session length is foreground time only; a short break continues the session, a long one starts a new one', async () => {
    const r = rig({ gap: 600_000 });
    await r.core.ready();
    r.core.setAnalyticsConsent(true);
    r.core.foreground();
    r.hooks.game.dayShown({ eventId: 'e1', age: 20, kind: 'event', auto: false, fast: false });
    r.hooks.game.dayShown({ eventId: 'e2', age: 20, kind: 'event', auto: false, fast: true });
    r.hooks.game.dayShown({ eventId: 'e3', age: 20, kind: 'event', auto: true, fast: true });
    r.hooks.game.answer({ eventId: 'e1', choiceId: 'a', age: 20, via: 'auto' });
    r.clock.t += 120_000;
    r.core.background();
    r.clock.t += 60_000;                                                       // 1 min away: same session
    r.core.foreground();
    r.clock.t += 30_000;
    expect(r.core.sessionDurMs()).toBe(150_000);
    r.hooks.game.enough();
    r.core.background();
    r.clock.t += 3_600_000;                                                    // 1 h away: new session
    r.core.foreground();
    r.core.foreground();                                                       // idempotent
    r.clock.t += 10_000;
    r.core.background();
    await tick();
    const ends = r.fa.log.filter((e) => e.name === 'game_session_end').map((e) => e.params);
    expect(ends).toHaveLength(3);
    expect(ends[0]).toMatchObject({ dur_ms: 120_000, shown_days: 3, answers: 1, auto_answers: 1, speed_play: 1, speed_fast: 1, speed_auto: 1, session_no: 1, part: 1, end_reason: 'background' });
    expect(ends[1]).toMatchObject({ dur_ms: 150_000, shown_days: 3, session_no: 1, part: 2, end_reason: 'enough' });
    expect(ends[2]).toMatchObject({ dur_ms: 10_000, shown_days: 0, session_no: 2, part: 1, end_reason: 'background' });
    const starts = r.fa.log.filter((e) => e.name === 'game_session_start').map((e) => e.params);
    expect(starts.map((p) => [p.source, p.session_no])).toEqual([['cold', 1], ['resume', 2]]);
    expect(r.core.playMs()).toBe(160_000);
  });

  it('session numbers continue across launches', async () => {
    const kv = memKV();
    const a = rig({ kv }); a.core.foreground(); await a.core.ready(); a.core.background(); await tick();
    const b = rig({ kv }); await b.core.ready(); b.core.foreground();
    expect(a.core.sessionNo()).toBe(1);
    expect(b.core.sessionNo()).toBe(2);
  });

  it('FTUE steps fire once per install with ms since the first launch; tutorial begin / complete wrap them', async () => {
    const kv = memKV();
    const r = rig({ kv });
    await r.core.ready();
    r.core.setAnalyticsConsent(true);
    r.core.foreground();
    r.clock.t += 3000; r.hooks.game.coachLine(); r.hooks.game.coachLine();
    r.clock.t += 9000; r.hooks.game.lifeStart({ lifeNo: 1, fastLife: false });
    r.clock.t += 8000; r.hooks.game.answer({ eventId: 'e1', choiceId: 'a', tags: ['is'], age: 18, via: 'tap' });
    r.hooks.game.answer({ eventId: 'e2', choiceId: 'b', tags: ['is'], age: 18, via: 'tap' });
    r.clock.t += 5000; r.hooks.game.stamp({ eventId: 'e2', result: 'iWasWrong', pOddsBp: 6200 });
    r.clock.t += 30000; r.hooks.game.reportCard({ age: 19, grades: { health: 4, money: 0, relationships: 2, brain: 3, courage: 1, spectacle: 2 }, shownDaysYear: 21 });
    r.hooks.game.reportCard({ age: 20, grades: { health: 4, money: 0, relationships: 2, brain: 3, courage: 1, spectacle: 2 }, shownDaysYear: 19 });
    r.core.background();
    await tick();
    const ftue = r.fa.log.filter((e) => /^ftue_|^tutorial_/.test(e.name)).map((e) => [e.name, e.params.ms]);
    expect(ftue).toEqual([['ftue_line_seen', 3000], ['tutorial_begin', undefined], ['ftue_life_start', 12000], ['ftue_decision', 20000], ['ftue_stamp', 25000],
      ['ftue_report_card', 55000], ['tutorial_complete', undefined]]);
    expect(r.fa.log.find((e) => e.name === 'wager_resolved')!.params).toMatchObject({ event_id: 'e2', p_odds: 62, result: 'wrong' });
    expect(r.fa.log.find((e) => e.name === 'year_end')!.params).toMatchObject({ age: 19, grades: 'afcbdc', shown_days_year: 21 });
    // second launch: nothing FTUE again
    const b = rig({ kv });
    await b.core.ready();
    b.core.foreground();
    b.hooks.game.coachLine(); b.hooks.game.lifeStart({ lifeNo: 2, fastLife: true });
    await tick();
    expect(b.fa.names().filter((n) => /^ftue_|^tutorial_/.test(n))).toEqual([]);
  });

  it('death → new client is measured once', async () => {
    const r = rig();
    await r.core.ready();
    r.core.setAnalyticsConsent(true);
    r.core.foreground();
    r.hooks.game.death({ age: 74, cause: 'old.circ', channel: 'hazard', lifeNo: 1, shownDays: 1100, autoDays: 3 });
    r.clock.t += 45_000;
    r.hooks.game.lifeStart({ lifeNo: 2, fastLife: false });
    r.hooks.game.lifeStart({ lifeNo: 3, fastLife: false });
    await tick();
    expect(r.fa.log.filter((e) => e.name === 'rebirth').map((e) => e.params)).toMatchObject([{ ms_since_death: 45_000, life_no: 2 }]);
    expect(r.fa.log.find((e) => e.name === 'death')!.params).toMatchObject({ age: 74, cause_class: 'circ', channel: 'hazard', life_no: 1 });
    expect(r.fa.users.some((u) => u.lives_bucket === '2_3')).toBe(true);
  });

  it('day_shown follows the sampling rate', async () => {
    const r = rig();
    const h = createHooks(r.core, { daySamplePct: () => 10, random: (() => { let i = 0; return () => (i++ % 20) / 20; })() });
    await r.core.ready();
    r.core.setAnalyticsConsent(true);
    for (let i = 0; i < 200; i++) h.game.dayShown({ eventId: `e${i}`, tags: ['aile'], age: 30, kind: 'event', auto: false, fast: false });
    await tick();
    expect(r.fa.names().filter((n) => n === 'day_shown')).toHaveLength(20);
    expect(r.fa.log.find((e) => e.name === 'day_shown')!.params).toMatchObject({ domain: 'aile', age_band: '25_34', sample_pct: 10 });
  });
});

// ── Firebase provider ────────────────────────────────────────────────────────
function fakeFirebase() {
  const calls: [string, unknown][] = [];
  const sdk: FirebaseSdk = {
    setConsent: async (c) => { calls.push(['consent', c]); },
    setAnalyticsCollectionEnabled: async (on) => { calls.push(['analytics', on]); },
    setCrashlyticsCollectionEnabled: async (on) => { calls.push(['crashlytics', on]); },
    logEvent: async (name, params) => { calls.push(['event', { name, params }]); },
    setUserProperties: async (p) => { calls.push(['user', p]); },
    resetAnalyticsData: async () => { calls.push(['reset', null]); },
    deleteUnsentCrashReports: async () => { calls.push(['deleteCrash', null]); },
    recordError: (e, name) => { calls.push(['error', `${name}:${e.message}`]); },
  };
  const events = () => calls.filter((c) => c[0] === 'event').map((c) => c[1] as { name: string; params: Record<string, unknown> });
  return { sdk, calls, events };
}
function fakeMeta() {
  const calls: [string, ...unknown[]][] = [];
  const sdk: MetaSdk = {
    initializeSDK: () => { calls.push(['init']); },
    setAutoLogAppEventsEnabled: (on) => { calls.push(['autoLog', on]); },
    setAdvertiserIDCollectionEnabled: (on) => { calls.push(['adId', on]); },
    setAdvertiserTrackingEnabled: async (on) => { calls.push(['ate', on]); },
    setDataProcessingOptions: (o, c, s) => { calls.push(['dpo', o, c, s]); },
    logEvent: (name, value, params) => { calls.push(['event', name, value, params]); },
    logPurchase: (amount, currency, params) => { calls.push(['purchase', amount, currency, params]); },
    flush: () => { calls.push(['flush']); },
  };
  return { sdk, calls, of: (k: string) => calls.filter((c) => c[0] === k) };
}

describe('Firebase provider', () => {
  it('is not loaded before consent; then sets Consent Mode v2 before it enables collection', async () => {
    const f = fakeFirebase();
    let loads = 0;
    const r = rig({ providers: [new FirebaseProvider({ load: () => { loads++; return f.sdk; } })] });
    r.core.foreground();
    await r.core.ready();
    r.core.track('tutorial_begin');
    await tick(12);
    expect(loads).toBe(0);
    expect(f.calls).toEqual([]);
    r.core.setAnalyticsConsent(true);
    await tick(20);
    expect(loads).toBe(1);
    expect(f.calls.slice(0, 3)).toEqual([
      ['consent', { analytics_storage: true, ad_storage: false, ad_user_data: false, ad_personalization: false }], ['analytics', true], ['crashlytics', true]]);
    expect(f.events().map((e) => e.name)).toEqual(['app_first_launch', 'game_session_start', 'tutorial_begin']);
  });

  it('revoking switches analytics AND crashlytics collection off and deletes unsent crash reports', async () => {
    const f = fakeFirebase();
    const r = rig({ providers: [new FirebaseProvider({ load: () => f.sdk })] });
    await r.core.ready();
    r.core.setAnalyticsConsent(true);
    await tick(20);
    f.calls.length = 0;
    r.core.setAnalyticsConsent(false);
    r.core.track('tutorial_begin');
    r.core.recordError('save', 'write_failed', new Error('boom'));
    await tick(20);
    expect(f.calls).toEqual([['consent', { analytics_storage: false, ad_storage: false, ad_user_data: false, ad_personalization: false }], ['analytics', false], ['crashlytics', false], ['deleteCrash', null]]);
  });

  it('ad signals follow the ad layer; crash reports only flow with consent', async () => {
    const f = fakeFirebase();
    const r = rig({ providers: [new FirebaseProvider({ load: () => f.sdk })], platform: 'android' });
    await r.core.ready();
    r.core.setAnalyticsConsent(true);
    await tick(20);
    r.core.setAdsConsent(ADS_ON());
    r.core.recordError('save', 'write_failed', new Error('boom'));
    await tick(20);
    expect(f.calls.filter((c) => c[0] === 'consent').at(-1)![1]).toEqual({ analytics_storage: true, ad_storage: true, ad_user_data: true, ad_personalization: true });
    expect(f.calls.filter((c) => c[0] === 'error')).toEqual([['error', 'save:write_failed:boom']]);
    expect(f.events().find((e) => e.name === 'app_error')!.params).toMatchObject({ scope: 'save', code: 'write_failed', fatal: false });
    expect(JSON.stringify(f.events())).not.toContain('boom');                  // the message never becomes an event param
  });

  it('skips the manual ad_impression when AdMob is linked (the SDK logs it itself)', async () => {
    const f = fakeFirebase();
    const r = rig({ providers: [new FirebaseProvider({ load: () => f.sdk, skip: ['ad_impression'] })] });
    await r.core.ready();
    r.core.setAnalyticsConsent(true);
    r.hooks.trackAdShown('sponsor', 'rewarded');
    r.hooks.trackAdRevenue({ placement: 'sponsor', format: 'rewarded', valueMicros: 12_000, currency: 'USD' });
    await tick(20);
    expect(f.events().map((e) => e.name)).toEqual(['app_first_launch', 'ad_shown']);
  });

  it('a binary without Firebase stays silent', async () => {
    const r = rig({ providers: [new FirebaseProvider({ load: async () => null })] });
    await r.core.ready();
    r.core.setAnalyticsConsent(true);
    r.core.track('tutorial_begin');
    await tick(20);
    expect(() => r.core.track('tutorial_complete')).not.toThrow();
  });
});

// ── Meta provider ────────────────────────────────────────────────────────────
describe('Meta provider', () => {
  const metaRig = (platform: 'ios' | 'android') => {
    const m = fakeMeta(), f = fakeFirebase();
    let loads = 0;
    const r = rig({ platform, providers: [new FirebaseProvider({ load: () => f.sdk }), new MetaProvider({ platform, load: () => { loads++; return m.sdk; } })] });
    return { ...r, m, f, loads: () => loads };
  };
  const buy = (r: ReturnType<typeof metaRig>) => {
    r.hooks.trackPaywallView('store');
    r.hooks.trackPurchaseStart('torpil');
    r.hooks.trackPurchaseResult({ status: 'ok', sku: 'torpil' }, { price: 199.99, currencyCode: 'TRY' });
  };

  it('receives nothing — not even an SDK load — before the ad consent step, with analytics consent alone, or after a decline', async () => {
    const r = metaRig('android');
    r.core.foreground();
    await r.core.ready();
    buy(r);
    r.hooks.game.reportCard({ age: 19, grades: {}, shownDaysYear: 20 });
    await tick(20);
    expect(r.loads()).toBe(0);
    r.core.setAnalyticsConsent(true);                                          // analytics ≠ marketing
    await tick(20);
    expect(r.loads()).toBe(0);
    expect(r.core.pending().marketing).toBeGreaterThan(0);                     // mapped events wait on the device
    r.core.setAdsConsent(ADS_DECLINED);
    buy(r);
    await tick(20);
    expect(r.loads()).toBe(0);
    expect(r.m.calls).toEqual([]);
    expect(r.core.pending().marketing).toBe(0);                                // declined: dropped
  });

  it('iOS: opt-in without an ATT answer is not enough; ATT denied means never; ATT authorised starts it with ATE on', async () => {
    const r = metaRig('ios');
    r.core.foreground();
    await r.core.ready();
    r.core.setAdsConsent(ADS_ON('undetermined'));
    buy(r);
    await tick(20);
    expect(r.loads()).toBe(0);
    expect(r.m.calls).toEqual([]);
    r.core.setAdsConsent(ADS_ON('authorized'));
    await tick(20);
    expect(r.loads()).toBe(1);
    expect(r.m.calls.slice(0, 5)).toEqual([['dpo', ['LDU'], 0, 0], ['ate', true], ['adId', true], ['autoLog', true], ['init']]);
    expect(r.m.of('purchase')).toEqual([['purchase', 199.99, 'TRY', { fb_content_id: 'torpil', fb_content_type: 'product', fb_num_items: 1 }]]);

    const d = metaRig('ios');
    await d.core.ready();
    d.core.setAdsConsent(ADS_ON('denied'));
    buy(d);
    await tick(20);
    expect(d.loads()).toBe(0);
    expect(d.m.calls).toEqual([]);
  });

  it('a purchase reaches Firebase and Meta exactly once each, with value and currency', async () => {
    const r = metaRig('android');
    r.core.foreground();
    await r.core.ready();
    r.core.setAnalyticsConsent(true);
    r.core.setAdsConsent(ADS_ON('skipped'));
    await tick(20);
    buy(r);
    r.hooks.trackPurchaseResult({ status: 'cancelled', sku: 'no_ads' });
    r.hooks.trackPurchaseResult({ status: 'failed', sku: 'no_ads', code: 'network' });
    await tick(20);
    const fa = r.f.events().filter((e) => e.name === 'purchase');
    expect(fa).toHaveLength(1);
    expect(fa[0]!.params).toMatchObject({ sku: 'torpil', value: 199.99, currency: 'try', surface: 'store', schema_v: SCHEMA_VERSION, items: [{ item_id: 'torpil', price: 199.99, quantity: 1 }] });
    expect(r.m.of('purchase')).toEqual([['purchase', 199.99, 'TRY', { fb_content_id: 'torpil', fb_content_type: 'product', fb_num_items: 1 }]]);
    expect(r.m.of('event').filter((c) => c[1] === META_EVENTS.purchase)).toEqual([]);     // not logged a second time as a generic event
    expect(r.m.of('event').map((c) => c[1])).toEqual([META_EVENTS.initiatedCheckout]);
    expect(r.f.events().filter((e) => e.name === 'purchase_fail').map((e) => e.params.reason)).toEqual(['cancelled', 'network']);
    expect(r.f.calls.filter((c) => c[0] === 'user').some((c) => (c[1] as Record<string, string>).payer === '1')).toBe(true);
    expect(JSON.stringify([r.f.calls, r.m.calls])).not.toMatch(/transaction|receipt|token/i);
  });

  it('a purchase made before both consents is delivered once to each when they arrive, never twice', async () => {
    const r = metaRig('android');
    r.core.foreground();
    await r.core.ready();
    buy(r);
    r.core.setAnalyticsConsent(true);
    r.core.setAdsConsent(ADS_ON('skipped'));
    r.core.setAdsConsent(ADS_ON('skipped'));
    r.core.setAnalyticsConsent(true);
    await tick(30);
    expect(r.f.events().filter((e) => e.name === 'purchase')).toHaveLength(1);
    expect(r.m.of('purchase')).toHaveLength(1);
  });

  it('revoking the ad opt-in switches the SDK flags off and stops events', async () => {
    const r = metaRig('android');
    await r.core.ready();
    r.core.setAdsConsent(ADS_ON('skipped'));
    await tick(20);
    r.m.calls.length = 0;
    r.core.setAdsConsent(ADS_DECLINED);
    buy(r);
    await tick(20);
    expect(r.m.calls).toEqual([['dpo', ['LDU'], 0, 0], ['adId', false], ['autoLog', false]]);
  });

  it('maps every mirrored event to a Meta standard event; everything else never reaches Meta', () => {
    const STANDARD = new Set<string>(Object.values(META_EVENTS));
    const sample: Partial<Record<EventName, Params>> = {
      purchase: { sku: 'torpil', value: 6.99, currency: 'usd', surface: 'store' },
      purchase_start: { sku: 'torpil', surface: 'store' },
      ad_impression: { ad_platform: 'admob', ad_format: 'rewarded', ad_unit_name: 'sponsor', value: 0.012, currency: 'usd' },
      tutorial_complete: {},
      milestone: { kind: 'promotion', age: 31 },
      year_end: { age: 19, grades: 'abcdef', shown_days_year: 20 },
    };
    expect(META_MAPPED.slice().sort()).toEqual(Object.keys(sample).sort());
    for (const n of META_MAPPED) {
      expect(EVENT_NAMES, n).toContain(n);
      expect(sanitizeEvent(n, sample[n]), n).not.toBeNull();
      const call = toMeta(n, sample[n]!)!;
      expect(call, n).not.toBeNull();
      const name = call.kind === 'purchase' ? META_EVENTS.purchase : call.name;
      expect(STANDARD.has(name), `${n} → ${name}`).toBe(true);
      for (const v of Object.values(call.params)) expect(['string', 'number']).toContain(typeof v);
    }
    for (const n of EVENT_NAMES) if (!META_MAPPED.includes(n)) expect(toMeta(n, {}), n).toBeNull();
    expect(toMeta('purchase', sample.purchase!)).toEqual({ kind: 'purchase', amount: 6.99, currency: 'USD', params: { fb_content_id: 'torpil', fb_content_type: 'product', fb_num_items: 1 } });
    expect(toMeta('ad_impression', sample.ad_impression!)).toMatchObject({ name: 'AdImpression', valueToSum: 0.012, params: { fb_currency: 'USD' } });
    expect(toMeta('tutorial_complete', {})).toMatchObject({ name: 'fb_mobile_tutorial_completion' });
    expect(toMeta('milestone', sample.milestone!)).toMatchObject({ name: 'fb_mobile_achievement_unlocked', params: { fb_description: 'promotion' } });
    expect(toMeta('year_end', sample.year_end!)).toMatchObject({ name: 'fb_mobile_level_achieved', params: { fb_level: '19' } });
  });

  it('ad revenue reaches Meta as AdImpression with value and currency', async () => {
    const r = metaRig('android');
    await r.core.ready();
    r.core.setAdsConsent(ADS_ON('skipped'));
    r.hooks.trackAdRevenue({ placement: 'extraPractice', format: 'rewarded', valueMicros: 12_000, currency: 'USD', source: 'admob_network' });
    r.hooks.trackAdRevenue({ placement: 'sponsor', format: 'rewarded', valueMicros: Number.NaN, currency: 'USD' });
    await tick(20);
    expect(r.m.of('event')).toEqual([['event', 'AdImpression', 0.012, { fb_currency: 'USD', ad_type: 'rewarded', placement: 'extra_practice' }]]);
  });
});

// ── remote config ────────────────────────────────────────────────────────────
describe('remote config', () => {
  it('has a safe default for every key and ignores bad remote values', () => {
    const rc = new RemoteConfig();
    expect(rc.get('ads_enabled')).toBe(true);
    expect(rc.get('day_shown_sample_pct')).toBe(10);
    rc.apply({ ads_enabled: 'false', day_shown_sample_pct: '250', ads_interstitial_min_gap_min: '5', ab_variant: 'zzz', ads_rewarded_daily_cap: 'many', unknown_key: '1' });
    expect(rc.get('ads_enabled')).toBe(false);
    expect(rc.get('day_shown_sample_pct')).toBe(100);                           // clamped
    expect(rc.get('ads_interstitial_min_gap_min')).toBe(360);                   // never below the design floor
    expect(rc.get('ab_variant')).toBe('');
    expect(rc.get('ads_rewarded_daily_cap')).toBe(RC_DEFAULTS.ads_rewarded_daily_cap.def);
    expect(parseRc('shop_enabled', 'maybe')).toBeUndefined();
    expect(Object.keys(rc.all()).sort()).toEqual(Object.keys(RC_DEFAULTS).sort());
  });

  it('refresh never rejects: no source, a failing source, a working source', async () => {
    const rc = new RemoteConfig();
    expect(await rc.refresh(async () => null, 0)).toBe(false);
    expect(await rc.refresh(async () => ({ fetchAndActivate: async () => { throw new Error('offline'); } }), 0)).toBe(false);
    let seenDefaults: Record<string, unknown> = {};
    expect(await rc.refresh(async () => ({ fetchAndActivate: async (d) => { seenDefaults = d; return { ab_variant: 'b' }; } }), 0)).toBe(true);
    expect(rc.get('ab_variant')).toBe('b');
    expect(seenDefaults.ads_enabled).toBe(true);
  });
});
