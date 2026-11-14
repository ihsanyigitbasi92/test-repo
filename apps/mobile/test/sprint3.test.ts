/**
 * Denge sprinti 3 (playtests 2026-11-13): labels and consistency, first minutes, the single privacy card, D-161
 * default-on analytics, the shop decoy, in-app legal drafts and opt-in reminders. Pure modules only (node).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CATALOG as I18N } from '../src/i18n';
import { catAlive, jobLabel, partnerStage, speakerLabel } from '../src/i18n/labels';
import { flowLineText } from '../src/state/feed';
import { HINT_GAP_DAYS, HINT_GAP_MS, HINT_IDS, INTRO_PAGES, TAUGHT_BY_INTRO, TutorialStore, effectiveSeen, nextHint, type HintCtx } from '../src/state/tutorial';
import { SHIPPED_FEATURES } from '../src/monetization/config';
import { productOf, visibleSkus, type Sku } from '../src/monetization/catalog';
import { DRAFT_TAG, LEGAL_TEXTS, parseLegal } from '../src/legal';
import { FORBIDDEN, LINES, SERIES_DAYS, buildSeries, decodeReminders, emptyReminders, recordHour, seriesTimes, shouldAsk, usualHour } from '../src/notifications/plan';
import { AnalyticsCore, awayHours } from '../src/analytics/core';
import { deriveConsent, emptyChoice, type ConsentSnapshot } from '../src/analytics/consent';
import { isMetaMapped } from '../src/analytics/providers/metaMap';
import type { AnalyticsProvider } from '../src/analytics/providers/types';
import type { EventName, Params } from '../src/analytics/events';
import type { LifeState } from '@motto/engine';

const APP = join(__dirname, '..');
const tick = async (n = 8): Promise<void> => { for (let i = 0; i < n; i++) await Promise.resolve(); };

// ── 1. labels and consistency ────────────────────────────────────────────────
describe('labels follow the life state', () => {
  const s = I18N.tr, en = I18N.en;
  it('own / inherited home: dues, never a landlord; mom\'s house keeps the contribution line', () => {
    expect(flowLineText(s, { kind: 'rent', para: 100 }, { momsHouse: false, home: 'owned' })).toMatch(/^Aidat/);
    expect(flowLineText(s, { kind: 'rent', para: 100 }, { momsHouse: false, home: 'owned' })).not.toMatch(/ev sahibi|evladım/i);
    expect(flowLineText(en, { kind: 'upkeep', para: 80 }, { momsHouse: false, home: 'owned' })).toMatch(/^Upkeep/);
    expect(flowLineText(s, { kind: 'rent', para: 500 }, { momsHouse: false, home: 'flat' })).toMatch(/Kira günü/);
    expect(flowLineText(s, { kind: 'rent', para: 100 }, { momsHouse: true })).toMatch(/katkı/);
  });
  it('"cat food included" only while the cat lives (engine flag wins over the state)', () => {
    expect(flowLineText(s, { kind: 'daily', para: -40 }, { momsHouse: false, cat: true })).toMatch(/Mama dahil/);
    expect(flowLineText(s, { kind: 'daily', para: -40 }, { momsHouse: false, cat: false })).not.toMatch(/Mama/);
    expect(flowLineText(s, { kind: 'daily', para: -40 }, { momsHouse: false })).not.toMatch(/Mama/);       // old saves: plain
    expect(flowLineText(en, { kind: 'daily', para: -40, cat: false } as never, { momsHouse: false, cat: true })).not.toMatch(/Cat food/);
    expect(flowLineText(s, { kind: 'daily', para: -40, cat: -12 }, { momsHouse: false })).toMatch(/Mama dahil/);   // engine: cat part of the line
    expect(flowLineText(s, { kind: 'pension', para: 3000 }, { momsHouse: false })).toMatch(/^Emekli aylığı/);
    expect(flowLineText(en, { kind: 'mortgage', para: 900 }, { momsHouse: false })).toMatch(/^Mortgage/);
    const view = (alive: boolean, assets: string[]) => ({ npcs: [{ role: 'cat', exists: true, alive, affinity: 0, memories: [] }], status: { assets } }) as unknown as LifeState;
    expect(catAlive(view(true, ['kedi']))).toBe(true);
    expect(catAlive(view(false, ['kedi']))).toBe(false);
  });
  it('the partner speaks as EŞ / NİŞANLI (SPOUSE / FIANCÉ(E)) by stage', () => {
    const v = (flags: string[], stage?: string) => ({ flags, status: { partner: { npc: 'partner', since: 0, ...(stage ? { stage } : {}) } } }) as unknown as LifeState;
    expect(partnerStage(v(['evli']))).toBe('married');
    expect(partnerStage(v(['nisanli']))).toBe('engaged');
    expect(partnerStage(v([], 'married'))).toBe('married');                          // engine field, when it lands
    expect(speakerLabel(s, 'tr', 'partner', 'married')).toBe('EŞ');
    expect(speakerLabel(s, 'tr', 'partner', 'engaged')).toBe('NİŞANLI');
    expect(speakerLabel(s, 'tr', 'partner', 'dating')).toBe('SEVGİLİ');
    expect(speakerLabel(en, 'en', 'partner', 'married')).toBe('SPOUSE');
    expect(speakerLabel(en, 'en', 'partner', 'engaged')).toBe('FIANCÉ(E)');
  });
  it('a promotion shows a new title: rank from tier 2, an engine display title wins', () => {
    expect(jobLabel(s, 'tr', 'ofis', 1)).toBe('Ofis Elemanı');
    expect(jobLabel(s, 'tr', 'ofis', 2)).toBe('Ofis Elemanı · Uzman');
    expect(jobLabel(en, 'en', 'ofis', 4)).toMatch(/Team Lead$/);
    expect(jobLabel(s, 'tr', 'emekli', 5)).toBe('Emekli');
    expect(jobLabel(s, 'tr', 'ofis', 3, { rankTitle: 'Kıdemli Muhasebeci' })).toBe('Kıdemli Muhasebeci');
  });
  it('the Roast counts scenes, not days lived (UX #17)', () => {
    expect(s.nums.shownDays).not.toMatch(/gün yaşadın/);
    expect(en.nums.shownDays).toMatch(/scenes/);
  });
});

// ── 2. first minutes ─────────────────────────────────────────────────────────
const ctx = (over: Partial<HintCtx> = {}): HintCtx => ({
  open: true, phase: 'idle', choicesUp: false, birthdayUp: false, shownDays: 5, flowing: false, statsChanged: false, moneyChanged: false,
  epoch: 2, lastHintEpoch: 1, ...over,
});
describe('tutorial and hints', () => {
  it('three pages, ≤ 150 words in all (≤ 45 s to read), no "Ben Motto" page', () => {
    expect(INTRO_PAGES).toBe(3);
    for (const loc of ['tr', 'en'] as const) {
      const t = I18N[loc].tutorial.pages;
      const words = JSON.stringify(t).replace(/"[a-z]+":/g, ' ').split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;
      expect(words, loc).toBeLessThanOrEqual(150);
      expect(JSON.stringify(t)).not.toMatch(/Ben Motto|I'm Motto/);
    }
  });
  it('hints are spaced: ≥ 30 s and ≥ 2 shown days after the last one (report excepted)', () => {
    const now = 1_000_000;
    expect(nextHint(ctx({ statsChanged: true, now, lastHintAt: now - 5_000, lastHintDay: 5 }), ['choices'])).toBeNull();
    expect(nextHint(ctx({ statsChanged: true, now, lastHintAt: now - HINT_GAP_MS, lastHintDay: 5 - HINT_GAP_DAYS + 1 }), ['choices'])).toBeNull();
    expect(nextHint(ctx({ statsChanged: true, now, lastHintAt: now - HINT_GAP_MS, lastHintDay: 5 - HINT_GAP_DAYS }), ['choices'])).toBe('stats');
    expect(nextHint(ctx({ phase: 'birthday', birthdayUp: true, now, lastHintAt: now - 1, lastHintDay: 5 }), [])).toBe('report');
  });
  it('a full read of the intro drops the hints it taught; a skip keeps them', () => {
    expect(effectiveSeen([], 'done').sort()).toEqual([...TAUGHT_BY_INTRO].sort());
    expect(effectiveSeen([], 'skip')).toEqual([]);
  });
  it('a first life on Auto: the unseen hints come in the next life', async () => {
    const data = new Map<string, string>();
    const t = new TutorialStore({ kv: { read: async (k) => data.get(k) ?? null, write: async (k, v) => { data.set(k, v); } }, saveKey: 'save' });
    await t.load();
    t.closeIntro('skip', 0);
    expect(t.hintsAllowed(false)).toBe(true);                       // nothing seen yet
    for (const id of HINT_IDS) { t.showHint(id); t.dismissHint(); }
    expect(t.hintsAllowed(false)).toBe(false);
  });
});

// ── 5. shop ──────────────────────────────────────────────────────────────────
describe('shop: no decoy', () => {
  const listed: Sku[] = ['no_ads', 'torpil'];
  it('Torpil is hidden while it ships nothing beyond No Ads (demo store too), shown only when owned', () => {
    expect(visibleSkus(listed, SHIPPED_FEATURES, () => 'none')).toEqual(['no_ads']);
    expect(visibleSkus(listed, SHIPPED_FEATURES, (s) => (s === 'no_ads' ? 'owned' : 'none'))).toEqual(['no_ads']);
    expect(visibleSkus(listed, SHIPPED_FEATURES, (s) => (s === 'torpil' ? 'owned' : 'included'))).toEqual(['no_ads', 'torpil']);
    expect(visibleSkus(listed, ['ads.interstitial.off', 'stamp.inks'], () => 'none')).toEqual(['no_ads', 'torpil']);
  });
  it('No Ads fallback price follows the behaviour expert (owner decides the final price)', () => {
    expect(productOf('no_ads')!.fallbackPrice).toEqual({ TRY: 49.99, USD: 1.99 });
  });
});

// ── legal drafts ─────────────────────────────────────────────────────────────
describe('in-app legal drafts', () => {
  it('TR + EN, marked as drafts, parse to blocks, no certainty claims', () => {
    expect(DRAFT_TAG.tr).toMatch(/taslak — avukat onayı bekliyor/i);
    for (const doc of Object.values(LEGAL_TEXTS)) {
      for (const loc of ['tr', 'en'] as const) {
        const b = parseLegal(doc[loc]);
        expect(b[0]!.k).toBe('title');
        expect(doc[loc]).toMatch(loc === 'tr' ? /taslak/i : /draft/i);
        expect(doc[loc]).not.toMatch(/kesinlikle uygundur|fully compliant|guarantee/i);
      }
    }
  });
  it('the notice says analytics + crash reports are on by default, who processes, transfer abroad, retention', () => {
    expect(LEGAL_TEXTS.notice.tr).toMatch(/varsayılan/i);
    expect(LEGAL_TEXTS.notice.tr).toMatch(/Google/);
    expect(LEGAL_TEXTS.notice.tr).toMatch(/yurt dışı/i);
    expect(LEGAL_TEXTS.notice.tr).toMatch(/Saklama/);
    expect(LEGAL_TEXTS.notice.en).toMatch(/by default/i);
  });
  it('no example.com placeholder URL anywhere in the app source', () => {
    const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
    for (const f of walk(join(APP, 'src')).filter((p) => /\.(ts|tsx)$/.test(p))) expect(readFileSync(f, 'utf8'), f).not.toMatch(/https?:\/\/example\.com/);
  });
});

// ── 7. reminders ─────────────────────────────────────────────────────────────
describe('reminders (docs/design/19)', () => {
  it('asked once, from the 2nd session', () => {
    expect(shouldAsk(emptyReminders(), 1)).toBe(false);
    expect(shouldAsk(emptyReminders(), 2)).toBe(true);
    expect(shouldAsk({ ...emptyReminders(), optIn: 'no' }, 9)).toBe(false);
  });
  it('daily ×3, then weekly, 7 in all; at most one per day; near the usual hour, never at night', () => {
    expect(SERIES_DAYS).toHaveLength(7);
    const now = new Date(2026, 10, 14, 21, 30).getTime();
    const times = seriesTimes(now, 20);
    const days = times.map((t) => Math.round((t - now) / 86_400_000));
    expect(new Set(days).size).toBe(7);
    for (const t of times) expect(new Date(t).getHours()).toBe(20);
    expect(usualHour([20, 21, 19, 20])).toBe(20);
    expect(usualHour([1, 2, 3])).toBe(9);
    expect(usualHour([23, 23])).toBe(21);
    expect(usualHour([])).toBe(19);
    let st = emptyReminders();
    for (let i = 0; i < 12; i++) st = recordHour(st, i);
    expect(st.hours).toHaveLength(7);
    expect(decodeReminders(JSON.stringify(st))).toEqual(st);
  });
  it('in-world lines: no numbers, no streak / loss / urgency words, the cat only when alive', () => {
    for (const loc of ['tr', 'en'] as const) for (const l of [...LINES[loc].any, ...LINES[loc].cat]) expect(l, l).not.toMatch(FORBIDDEN);
    const noCat = buildSeries({ now: Date.now(), hours: [], locale: 'tr', catAlive: false, seed: 3 });
    for (const r of noCat) expect(LINES.tr.cat).not.toContain(r.body);
  });
});

// ── D-161: analytics on by default ───────────────────────────────────────────
class Spy implements AnalyticsProvider {
  log: { name: EventName; params: Params }[] = [];
  constructor(readonly name: string, readonly purpose: 'analytics' | 'marketing', private readonly only?: (n: EventName) => boolean) {}
  accepts(n: EventName): boolean { return this.only ? this.only(n) : true; }
  async init(): Promise<void> { /* ok */ }
  setConsent(_c: ConsentSnapshot): void { /* recorded elsewhere */ }
  logEvent(name: EventName, params: Params): void { this.log.push({ name, params }); }
  setUserProps(): void { /* no-op */ }
  reset(): void { /* no-op */ }
}
function rig() {
  const clock = { t: Date.UTC(2026, 10, 14, 9, 0, 0) };
  const data = new Map<string, string>();
  const fa = new Spy('fa', 'analytics'), meta = new Spy('meta', 'marketing', isMetaMapped);
  const core = new AnalyticsCore({ providers: [fa, meta], platform: 'android', kv: { read: async (k) => data.get(k) ?? null, write: async (k, v) => { data.set(k, v); } },
    now: () => clock.t, localDay: () => '2026-11-14', saveDelayMs: 0 });
  return { core, fa, meta, clock, data };
}
const base = { resolved: false, adsPersonalized: false, isMinor: false, att: 'undetermined' as const };

describe('D-161: analytics on by default after the age gate', () => {
  it('nothing leaves before the age gate; a TR adult then sends the queued install / session events', async () => {
    const r = rig();
    await r.core.ready();
    r.core.foreground();
    r.core.track('life_start', { life_no: 1, fast_life: false });
    await tick();
    expect(r.fa.log).toEqual([]);
    r.core.setAdsConsent({ ...base, age: 'adult', region: 'TR' });
    await tick();
    expect(r.core.getConsent()).toMatchObject({ analytics: 'granted', marketing: 'unknown' });
    expect(r.fa.log.map((e) => e.name)).toEqual(expect.arrayContaining(['app_first_launch', 'game_session_start', 'life_start']));
    expect(r.meta.log).toEqual([]);                                   // Meta stays gated on the ads opt-in
  });
  it('16–17 (TR): analytics on, marketing denied; under 16: nothing at all', () => {
    expect(deriveConsent(emptyChoice(), { ...base, age: 'minor', region: 'TR' }, 'android')).toMatchObject({ analytics: 'granted', marketing: 'denied' });
    expect(deriveConsent(emptyChoice(), { ...base, age: 'blocked', region: 'TR' }, 'android')).toMatchObject({ analytics: 'denied', marketing: 'denied' });
  });
  it('EEA / unknown region: still gated on the privacy card; an explicit yes opens it', () => {
    expect(deriveConsent(emptyChoice(), { ...base, age: 'adult', region: 'EEA' }, 'android').analytics).toBe('unknown');
    expect(deriveConsent(emptyChoice(), { ...base, age: 'adult', region: 'UNKNOWN' }, 'android').analytics).toBe('unknown');
    expect(deriveConsent({ analytics: true, decidedDay: 'd', noticeVersion: 1 }, { ...base, age: 'adult', region: 'EEA' }, 'android').analytics).toBe('granted');
  });
  it('Meta / ad-id measurement is unchanged: opt-in (+ ATT on iOS) only', () => {
    expect(deriveConsent(emptyChoice(), { ...base, resolved: true, att: 'skipped', age: 'adult', region: 'TR' }, 'android').marketing).toBe('denied');
    expect(deriveConsent(emptyChoice(), { resolved: true, adsPersonalized: true, isMinor: false, att: 'denied', age: 'adult', region: 'TR' }, 'ios').marketing).toBe('denied');
  });
  it('game_session_start carries the time away, bucketed', async () => {
    const r = rig();
    await r.core.ready();
    r.core.setAdsConsent({ ...base, age: 'adult', region: 'TR' });
    r.core.foreground();
    r.core.background();
    r.clock.t += 26 * 3_600_000;
    r.core.foreground();
    await tick();
    const starts = r.fa.log.filter((e) => e.name === 'game_session_start');
    expect(starts.at(-1)!.params.away_h).toBe(24);
    expect(awayHours(0)).toBe(0);
    expect(awayHours(7 * 3_600_000)).toBe(6);
    expect(awayHours(1e12)).toBe(720);
  });
});

// ── content agent notes: last word, EN job titles, asset labels ──────────────
import { lastWordText, type LifeFacts } from '../src/i18n/lastWord';
import { assetLabel } from '../src/i18n/labels';

describe('coach\'s last word follows the life', () => {
  const f = (o: Partial<LifeFacts> = {}): LifeFacts => ({ age: 70, marriedYears: null, hasChild: false, hasGrandchild: false, catYears: null, catAlive: false,
    momAlive: false, momOutlivedAge: null, alone: false, ownedHome: false, ...o });
  it('a long marriage is named; a dead cat never "liked you"', () => {
    expect(lastWordText('tr', f({ marriedYears: 39 }), null, '', 1)).toMatch(/39 yıl/);
    expect(lastWordText('tr', f(), null, '', 0)).not.toMatch(/Pamuk|Kedi/);
    expect(lastWordText('en', f({ catAlive: true, age: 60 }), null, '', 0)).toMatch(/Biscuit|Pamuk/);
    expect(lastWordText('tr', f({ age: 60 }), { pattern: 'patience', count: 12 }, 'Sabır', 2)).toMatch(/12/);
  });
});

describe('EN never shows a Turkish job title; every content asset id has a label', () => {
  const walk = (o: unknown, out: { titles: Set<string>; assets: Set<string> }): void => {
    if (Array.isArray(o)) { for (const v of o) walk(v, out); return; }
    if (!o || typeof o !== 'object') return;
    const r = o as Record<string, unknown>;
    const job = r.job as { title?: unknown } | undefined;
    if (job && typeof job.title === 'string') out.titles.add(job.title);
    const st = r.status as { assets?: unknown } | undefined;
    const a = st?.assets;
    if (Array.isArray(a)) for (const x of a) if (typeof x === 'string') out.assets.add(x);
    if (a && typeof a === 'object' && !Array.isArray(a)) for (const v of Object.values(a)) for (const x of [v].flat()) if (typeof x === 'string') out.assets.add(x);
    for (const v of Object.values(r)) walk(v, out);
  };
  const out = { titles: new Set<string>(), assets: new Set<string>() };
  const root = join(APP, '..', '..', 'packages', 'content-schema', 'fixtures');
  const files = (d: string): string[] => readdirSync(d).flatMap((x) => { const p = join(d, x); return statSync(p).isDirectory() ? files(p) : p.endsWith('.json') ? [p] : []; });
  for (const p of files(root)) { try { walk(JSON.parse(readFileSync(p, 'utf8')), out); } catch { /* not ours */ } }
  it('job titles', () => {
    expect(out.titles.size).toBeGreaterThan(50);
    for (const t of out.titles) expect(jobLabel(I18N.en, 'en', t), t).not.toMatch(/[çğıöşüÇĞİÖŞÜ]/);
    expect(jobLabel(I18N.en, 'en', 'kıdemli bilinmeyen unvan')).toBe('Employee');
  });
  it('asset labels (no "Kosu bandi")', () => {
    for (const a of out.assets) for (const loc of ['tr', 'en'] as const) expect(I18N[loc].asset[a], `${loc}.${a}`).toBeTruthy();
    expect(assetLabel(I18N.tr, 'tr', 'anne_kosu_bandi')).toBe('Annenin koşu bandı');
  });
});
