import { describe, it, expect } from 'vitest';
import {
  applyCashflow, applyEffects, boundGrade, catAlive, createLife, eligible, emptyMeta, jobRank, partnerStage, skipLineBlocked, TUNING,
} from '../src/index';
import type { Effect, GameEvent } from '../src/index';
import { BUNDLE } from './helpers/content';

/** Denge sprinti 3 (playtest 2026-11-13): state ↔ text consistency and the economy retune. */
const ev = (over: Partial<GameEvent>): GameEvent => ({
  id: 'evt_t', v: 1, type: 'event', tags: ['gundelik'], rarity: 'common', valence: 0, intensity: 5000, universality: 'universal', pre: {},
  choices: [{ id: 'a', tr: 'a', en: 'a' }], outcomes: { a: { tr: 'x', en: 'x', coach: [{ tr: 'c', en: 'c', roast: false }] } }, ...over,
} as unknown as GameEvent);

describe('housing flow kinds (P0-1)', () => {
  it('owned home → upkeep line, never rent, no rent-card shortfall', () => {
    const st = createLife('OWN', 'x', 'h');
    st.status.home = { kind: 'owned', rent: 250, since: 0 };
    st.money.balance = 0;
    const r = applyCashflow(st, 0, 40);
    expect(r.lines.some((l) => l.kind === 'rent')).toBe(false);
    expect(r.lines.find((l) => l.kind === 'upkeep')!.para).toBe(-250);
    expect(r.rentShortfall).toBe(false);
  });
  it("mom's house: rent (katkı payı) while mom lives, upkeep after her death", () => {
    const st = createLife('MOM', 'x', 'h');
    st.money.balance = 10_000;
    expect(applyCashflow(st, 0, 40).lines.some((l) => l.kind === 'rent')).toBe(true);
    st.npcs.find((n) => n.role === 'mom')!.alive = false;
    const r = applyCashflow(st, 40, 80);
    expect(r.lines.some((l) => l.kind === 'rent')).toBe(false);
    expect(r.lines.some((l) => l.kind === 'upkeep')).toBe(true);
  });
  it('mortgage → mortgage line', () => {
    const st = createLife('MORT', 'x', 'h');
    st.status.home = { kind: 'mortgage', rent: 800, since: 0 };
    st.money.balance = 10_000;
    expect(applyCashflow(st, 0, 40).lines.map((l) => l.kind)).toContain('mortgage');
  });
});

describe('cat (P0-2)', () => {
  it('daily line carries `cat` only while the cat is alive', () => {
    const st = createLife('CAT', 'x', 'h');
    st.money.balance = 10_000;
    expect(catAlive(st)).toBe(true);
    expect(applyCashflow(st, 0, 40).lines.find((l) => l.kind === 'daily')!.cat).toBe(-TUNING.economy.catMonthlyPara);
    st.npcs.find((n) => n.role === 'cat')!.alive = false;
    st.status.assets = [];
    expect(catAlive(st)).toBe(false);
    expect(applyCashflow(st, 40, 80).lines.find((l) => l.kind === 'daily')?.cat).toBeUndefined();
  });
  it('an untagged event naming Pamuk and a cat skip line close once the cat is dead', () => {
    const st = createLife('CAT2', 'x', 'h'), meta = emptyMeta();
    const pamuk = ev({ id: 'evt_pamuk', tags: ['gundelik'], text: [{ id: 't', tr: 'Pamuk masada.', en: 'Biscuit is on the table.' }] } as Partial<GameEvent>);
    const line = { tr: 'Kedi bir kilo aldı.', en: 'The cat gained a pound.' };
    expect(eligible(pamuk, st, meta)).toBe(true);
    expect(skipLineBlocked(line, st)).toBe(false);
    st.npcs.find((n) => n.role === 'cat')!.alive = false;
    expect(eligible(pamuk, st, meta)).toBe(false);
    expect(skipLineBlocked(line, st)).toBe(true);
    expect(eligible(ev({ id: 'evt_pamuk_veda', tags: ['veda_kayip'], text: [{ id: 't', tr: 'Pamuk.', en: 'Biscuit.' }] } as Partial<GameEvent>), st, meta)).toBe(true);
  });
});

describe('partner and in-laws (P0-3/4)', () => {
  it('partnerStage follows the flags; kayin_aile needs engagement or marriage', () => {
    const st = createLife('P', 'x', 'h'), meta = emptyMeta();
    const inlaw = ev({ id: 'evt_kayin', tags: ['kayin_aile'] });
    expect(partnerStage(st)).toBeNull();
    st.status.partner = { npc: 'partner', since: 0 };
    expect(partnerStage(st)).toBe('sevgili');
    expect(eligible(inlaw, st, meta)).toBe(false);
    st.flags.push('nisanli');
    expect(partnerStage(st)).toBe('nisanli');
    expect(eligible(inlaw, st, meta)).toBe(true);
    st.flags.push('evli');
    expect(partnerStage(st)).toBe('evli');
  });
});

describe('career, retirement, protection (P1)', () => {
  it('jobRank moves with the tier; retired has no rank and ignores rungDelta / new jobs', () => {
    expect(jobRank({ title: 'ofis', tier: 1, monthly: 1000, since: 0 })).not.toBe(jobRank({ title: 'ofis', tier: 2, monthly: 1600, since: 0 }));
    const st = createLife('RET', 'x', 'h'), meta = emptyMeta(), out: Effect[] = [];
    st.status.job = { title: 'emekli', tier: 3, monthly: 1500, since: 0 };
    applyEffects(st, meta, BUNDLE, ev({}), { career: { rungDelta: 1, set: 'teacher' } } as never, out);
    expect(st.status.job).toEqual({ title: 'emekli', tier: 3, monthly: 1500, since: 0 });
    expect(jobRank(st.status.job)).toBe('');
  });
  it('money effects are not halved in the 18–28 window (text = number)', () => {
    const st = createLife('PROT', 'x', 'h'), out: Effect[] = [];
    const before = st.money.balance;
    applyEffects(st, emptyMeta(), BUNDLE, ev({}), { money: -600 } as never, out);
    expect(st.money.balance - before).toBe(-600);
    expect(out).toContainEqual({ kind: 'FLOAT_NUM', stat: 'money', delta: -600 });
  });
  it('health < 30 is always Zayıf', () => {
    const b = TUNING.report.absolute.health as unknown as { caps: number[][]; floors: number[][] };
    for (const h of [5, 19, 29]) expect(boundGrade(4, h, b)).toBe(0);
  });
});

describe('grief pause (O3)', () => {
  it('a forced follow-up of a grief event waits griefShownDays shown days', () => {
    const st = createLife('GRIEF', 'x', 'h'), out: Effect[] = [];
    const target = BUNDLE.events.find((e) => e.type === 'event')!;
    const loss = ev({ id: 'evt_loss', tags: ['veda_kayip'] });
    applyEffects(st, emptyMeta(), BUNDLE, loss, { followUp: [{ eventId: target.id, delayDays: [1, 1], forced: true }] } as never, out);
    expect(st.dueQueue.at(-1)!.minDayIndex).toBe(st.calendar.dayIndex + 1 + TUNING.npcLife.griefShownDays);
  });
});
