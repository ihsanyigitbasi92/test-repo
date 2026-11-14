/**
 * Share card data selection ("Müşteri Dosyası — KAPANDI"): highlights tracking, row choice, grief safety, no
 * personal data, TR/EN, and the analytics `share` event with its channel.
 */
import { describe, expect, it } from 'vitest';
import { createLife, emptyMeta, step } from '@motto/engine';
import type { Action, Effect, LifeState, MetaState } from '@motto/engine';
import { BASE_BUNDLE } from '../src/content/bundle';
import { CATALOG } from '../src/i18n';
import { RAW_ID } from '../src/i18n/labels';
import { emptyHighlights, fromFinalState, noteStep, readHighlights } from '../src/share/highlights';
import type { LifeHighlights } from '../src/share/highlights';
import { buildShareCard, causeClass, shareMessage, SHARE_SIZE, STORE_LINK_PLACEHOLDER } from '../src/share/shareCard';
import type { ShareInput } from '../src/share/shareCard';
import { wrapLines } from '../src/share/render';
import { sanitizeEvent } from '../src/analytics/events';

const clone = (st: LifeState): LifeState => JSON.parse(JSON.stringify(st)) as LifeState;
const base = (): LifeState => createLife('share-test', 'Deniz Yarınbaşlar', 'h');

function input(over: Partial<ShareInput> = {}, h: LifeHighlights = emptyHighlights()): ShareInput {
  return {
    name: 'Deniz Yarınbaşlar', birthYear: 1990, deathYear: 2067, age: 77, cause: 'overtime.circ', highlights: h,
    family: { married: true, marriedYears: 39, hasChild: true, hasGrandchild: false, partner: true },
    job: { title: 'emekli', tier: 4 }, lastWord: 'Erteledin. Ama hiç ertelemediğin bir şey vardı.', ...over,
  };
}

describe('highlights', () => {
  it('records the top job, the best and the hardest moment with their ages', () => {
    let h = emptyHighlights();
    const a = base();
    a.calendar.age = 24; a.status.job = { title: 'accountant', tier: 1, monthly: 1000, since: 0 };
    h = noteStep(h, null, a, []);
    expect(h.topJob).toEqual({ title: 'accountant', tier: 1 });
    expect(h.best?.kind).toBe('firstJob');
    const b = clone(a); b.calendar.age = 31; b.flags.push('evli');
    h = noteStep(h, a, b, []);
    expect(h.best).toMatchObject({ kind: 'wedding', age: 31 });
    const c = clone(b); c.calendar.age = 33; c.status.job = { ...c.status.job!, tier: 3, monthly: 2500 };
    h = noteStep(h, b, c, []);
    expect(h.topJob?.tier).toBe(3);
    expect(h.best?.kind).toBe('wedding');                           // a promotion does not beat the wedding
    const d = clone(c); d.calendar.age = 44; d.status.job = null;
    h = noteStep(h, c, d, []);
    expect(h.worst).toMatchObject({ kind: 'fired', age: 44 });
    const e = clone(d); e.calendar.age = 50; e.flags.push('bosandi');
    h = noteStep(h, d, e, []);
    expect(h.worst).toMatchObject({ kind: 'divorce', age: 50 });
    const f = clone(e); f.calendar.age = 52; f.counters.bankruptcies = 1;
    h = noteStep(h, e, f, []);
    expect(h.worst).toMatchObject({ kind: 'bankruptcy', age: 52 });
    expect(h.topJob?.title).toBe('accountant');
  });

  it('a retiree keeps the job they retired from; a pension never becomes the top job', () => {
    const a = base(); a.calendar.age = 60; a.status.job = { title: 'ofis', tier: 5, monthly: 6000, since: 0 };
    let h = noteStep(emptyHighlights(), null, a, []);
    const b = clone(a); b.calendar.age = 64; b.status.job = { title: 'emekli', tier: 5, monthly: 4800, since: 1 };
    h = noteStep(h, a, b, []);
    expect(h.topJob).toEqual({ title: 'ofis', tier: 5 });
    expect(h.worst).toBeNull();                                     // retiring is not "fired"
  });

  it('wager stamps: the player beating long odds is a best moment, the coach calling it a hard one', () => {
    const a = base(); a.calendar.age = 29;
    const win: Effect = { kind: 'STAMP', result: 'iWasWrong', pOddsBp: 1200, variant: 0 };
    const hit: Effect = { kind: 'STAMP', result: 'calledIt', pOddsBp: 8000, variant: 0 };
    const h = noteStep(noteStep(emptyHighlights(), a, a, [win]), a, a, [hit]);
    expect(h.best).toMatchObject({ kind: 'wagerWin', odds: 12, age: 29 });
    expect(h.worst).toMatchObject({ kind: 'coachCalled', odds: 80 });
  });

  it('losing a person or a pet is never recorded as a moment (grief-safe)', () => {
    const a = base(); a.calendar.age = 60;
    const b = clone(a);
    for (const n of b.npcs) if (n.role === 'mom' || n.role === 'cat') n.alive = false;
    b.flags.push('yas_anne');
    expect(noteStep(emptyHighlights(), a, b, [])).toEqual(emptyHighlights());
  });

  it('old saves: highlights are derived from the final state; junk is rejected', () => {
    const st = base(); st.calendar.age = 70; st.calendar.calendarDay = 52 * 365; st.flags.push('evli');
    st.status.partner = { npc: 'partner', since: 10 * 365 };
    const h = fromFinalState(st);
    expect(h.best).toMatchObject({ kind: 'wedding', age: 28 });
    expect(readHighlights(h)).toEqual(h);
    expect(readHighlights({ v: 2 })).toBeNull();
    expect(readHighlights('x')).toBeNull();
  });

  it('a whole simulated life yields a card with 3–4 clean rows in both languages', () => {
    const meta: MetaState = emptyMeta();
    let h = emptyHighlights();
    let st = step(null as unknown as LifeState, meta, { type: 'START_LIFE', seed: 'share-sim-1', name: 'Ada' }, BASE_BUNDLE).state;
    for (let i = 0; i < 9000 && st.phase !== 'dead'; i++) {
      const a: Action = st.phase === 'day' && st.card ? { type: 'ANSWER', eventId: st.card.eventId, choiceId: st.card.choices.find((c) => !c.locked)!.id, via: 'auto' } : { type: 'NEXT_DAY' };
      const r = step(st, meta, a, BASE_BUNDLE);
      h = noteStep(h, st, r.state, r.effects);
      st = r.state;
    }
    expect(st.phase).toBe('dead');
    for (const locale of ['tr', 'en'] as const) {
      const d = buildShareCard(locale, CATALOG[locale], input({ age: st.death!.age, cause: st.death!.cause, job: st.status.job }, h));
      expect(d.rows.length).toBeGreaterThanOrEqual(2);
      expect(d.rows.length).toBeLessThanOrEqual(4);
      for (const r of d.rows) expect(r.text).not.toMatch(RAW_ID);
    }
  });
});

describe('buildShareCard', () => {
  const h: LifeHighlights = { v: 1, topJob: { title: 'accountant', tier: 4 }, best: { kind: 'child', age: 33, score: 90 }, worst: { kind: 'fired', age: 47, score: 60 } };

  it('TR: name, years, age, four rows, last word, stamp, credit and link', () => {
    const d = buildShareCard('tr', CATALOG.tr, input({}, h));
    expect(d.title).toBe('MÜŞTERİ DOSYASI');
    expect(d.closed).toBe('KAPANDI');
    expect(d.name).toBe('Deniz Yarınbaşlar');
    expect(d.years).toBe('1990–2067');
    expect(d.ageLine).toBe('77 yaşında');
    expect(d.rows.map((r) => r.key)).toEqual(['career', 'family', 'best', 'worst']);
    expect(d.rows[0]!.text).toBe('Muhasebeci · Ekip Lideri · emekli');
    expect(d.rows[1]!.text).toBe('Eşiyle 39 yıl · Bir çocuk');
    expect(d.rows[2]!.text).toBe('33 yaşında ebeveyn oldu');
    expect(d.rows[3]!.text).toBe('47 yaşında işten çıkarıldı');
    expect(d.stamp).toBe('MOTTO');
    expect(d.by).toBe('by D2P Technology');
    expect(d.link).toBe(STORE_LINK_PLACEHOLDER);
    expect(shareMessage(d)).toContain('KAPANDI');
  });

  it('EN mirrors TR without Turkish text', () => {
    const d = buildShareCard('en', CATALOG.en, input({}, h));
    expect(d.title).toBe('CLIENT FILE');
    expect(d.closed).toBe('CLOSED');
    expect(d.ageLine).toBe('Age 77');
    expect(d.rows[1]!.text).toBe('39 years married · A child');
    const all = [d.title, d.closed, d.ageLine, d.farewell, d.lastWordLabel, ...d.rows.flatMap((r) => [r.label, r.text])].join(' ');
    expect(all).not.toMatch(/[çğıöşüÇĞİÖŞÜ]/);
  });

  it('cause: only its class, written gently — never the roast joke line', () => {
    for (const locale of ['tr', 'en'] as const) {
      const s = CATALOG[locale];
      for (const cls of ['circ', 'tumor', 'resp', 'accident', 'external', 'absurd', 'weird']) {
        const d = buildShareCard(locale, s, input({ cause: `overtime.${cls}` }, h));
        expect(d.farewell).toBe(s.shareCard.farewell[causeClass(`overtime.${cls}`)]);
        expect(Object.values(s.deathCause)).not.toContain(d.farewell);
        expect(d.farewell).not.toMatch(/hamak|hammock|rüzgâr|gust|şans|luck|joke|şaka/i);
      }
      expect(s.shareCard.farewell.absurd).toBe(s.shareCard.farewell.external);   // the absurd class reads like any sudden end
    }
    expect(causeClass('warmup.accident')).toBe('accident');
    expect(causeClass('')).toBe('unknown');
  });

  it('carries no personal data: only the typed character name, no city, no ids', () => {
    const d = buildShareCard('tr', CATALOG.tr, input({ name: '  Ece Sonradan  ' }, h));
    expect(d.name).toBe('Ece Sonradan');
    const blob = JSON.stringify(d);
    expect(blob).not.toMatch(/Kadıköy|Bornova|seed|L-[a-z0-9]+-/);
    expect(buildShareCard('tr', CATALOG.tr, input({ name: '' }, h)).name).toBe('İsimsiz müşteri');
    expect(buildShareCard('tr', CATALOG.tr, input({ name: 'x'.repeat(60) }, h)).name.length).toBeLessThanOrEqual(28);
  });

  it('a thin life still gets at least three lines; at most four', () => {
    const d = buildShareCard('tr', CATALOG.tr, input({ family: { married: false, marriedYears: null, hasChild: false, hasGrandchild: false, partner: false }, job: null }, emptyHighlights()));
    expect(d.rows.length).toBeGreaterThanOrEqual(1);
    expect(d.rows.find((r) => r.key === 'family')?.text).toBe('Kendi bildiği yolda');
    expect(buildShareCard('tr', CATALOG.tr, input({}, h)).rows.length).toBeLessThanOrEqual(4);
  });

  it('formats are 1080×1920 and 1080×1080', () => {
    expect(SHARE_SIZE).toEqual({ story: { w: 1080, h: 1920 }, square: { w: 1080, h: 1080 } });
  });
});

describe('render helpers + analytics', () => {
  it('wrapLines wraps greedily and ellipsizes overflow', () => {
    const m = (s: string) => s.length * 10;
    expect(wrapLines(m, 'bir iki üç dört', 80, 3)).toEqual(['bir iki', 'üç dört']);
    const out = wrapLines(m, 'a b c d e f g h i j k l', 30, 2);
    expect(out).toHaveLength(2);
    expect(out[1]!.endsWith('…')).toBe(true);
  });

  it('`share` carries the channel and format; unknown channels are dropped', () => {
    expect(sanitizeEvent('share', { card: 'death', channel: 'web_share', format: 'story' })).toMatchObject({ card: 'death', channel: 'web_share', format: 'story' });
    expect(sanitizeEvent('share', { card: 'death', channel: 'download' })).toMatchObject({ channel: 'download' });
    const bad = sanitizeEvent('share', { card: 'death', channel: 'twitter_dm' });
    expect(bad?.channel).toBeUndefined();
  });
});
