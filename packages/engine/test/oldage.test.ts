import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { GameEventSchema } from '@motto/content-schema';
import { applyAction, applyCashflow, bankruptcyAllowed, emptyMeta, pensionFor, TUNING, BANKRUPTCY_PENDING } from '../src/index';
import type { Action, ContentBundle, Effect, GameEvent, LifeState, MetaState } from '../src/index';
import { FIXTURE_ONLY } from './helpers/content';

/** Old-age sprint: no İcra loop in the 70s–80s, a pension that covers the rent, and a gentle help card. */
const E = TUNING.economy;
const PACK = join(import.meta.dirname, '..', '..', 'content-schema', 'fixtures', 'pack', 'yaslilik_gundelik');
const ELDER: GameEvent[] = E.elderCare.events.map((id) => GameEventSchema.parse(JSON.parse(readFileSync(join(PACK, `${id}.json`), 'utf8'))) as GameEvent);
const WITH_ELDER: ContentBundle = { ...FIXTURE_ONLY, contentHash: 'fixtures+elder', events: [...FIXTURE_ONLY.events, ...ELDER] };

function life(seed: string, content: ContentBundle = FIXTURE_ONLY) {
  const meta: MetaState = emptyMeta();
  let st = applyAction(null as unknown as LifeState, meta, { type: 'START_LIFE', seed, name: 'Ada' }, content).state;
  const act = (a: Action): Effect[] => { const r = applyAction(st, meta, a, content); st = r.state; return r.effects; };
  return {
    get st() { return st; },
    day: () => act({ type: 'NEXT_DAY' }),
    ans: (choiceId?: string) => {
      if (st.phase !== 'day' || !st.card) return [];
      return act({ type: 'ANSWER', eventId: st.card.eventId, choiceId: choiceId ?? st.card.choices.find((c) => !c.locked)!.id, via: 'tap' });
    },
  };
}

function retiree(st: LifeState, age: number, home: LifeState['status']['home']['kind'], rent: number): void {
  st.calendar.age = age;
  st.status.job = { title: 'emekli', tier: 2, monthly: 1100, since: 0 };
  st.status.home = { kind: home, rent, since: 0 };
  st.flags.push('emekli');
}

describe('İcra cap (old-age sprint)', () => {
  it('at most one İcra per bankruptcy.minGapDays; a blocked crossing leaves no pending flag', () => {
    const l = life('OA-ICRA');
    l.st.calendar.age = 40;
    l.st.money.balance = -23_990;
    for (let i = 0; i < 4 && l.st.counters.bankruptcies === 0; i++) { l.day(); l.ans(); }
    expect(l.st.counters.bankruptcies).toBe(1);
    expect(bankruptcyAllowed(l.st)).toBe(false);
    l.st.money.balance = -40_000;
    for (let i = 0; i < 6; i++) { l.day(); l.ans(); }
    expect(l.st.counters.bankruptcies).toBe(1);
    expect(l.st.flags).not.toContain(BANKRUPTCY_PENDING);
    l.st.calendar.calendarDay += E.bankruptcy.minGapDays;
    expect(bankruptcyAllowed(l.st)).toBe(true);
  });

  it('no İcra after bankruptcy.maxAge, and card debt stops compounding in old age', () => {
    const l = life('OA-OLD');
    retiree(l.st, E.bankruptcy.maxAge + 5, 'owned', 250);
    l.st.money.balance = -30_000;
    for (let i = 0; i < 6; i++) { l.day(); l.ans(); }
    expect(l.st.counters.bankruptcies).toBe(0);
    expect(l.st.flags).not.toContain(BANKRUPTCY_PENDING);
    const day = l.st.calendar.calendarDay;
    const r = applyCashflow(l.st, day, day + 365);
    expect(r.detail.debt).toBeUndefined();
  });
});

describe('pension floor (old-age sprint)', () => {
  it('never below minPensionPara; a renter keeps rent + cover (capped by the career salary); a late low job does not collapse it', () => {
    const l = life('OA-PEN');
    const st = l.st;
    st.status.home = { kind: 'owned', rent: 250, since: 0 };
    expect(pensionFor(st, 1000, E.retirement.pensionPm.short)).toBe(E.retirement.minPensionPara);
    st.status.home = { kind: 'flat', rent: 900, since: 0 };
    expect(pensionFor(st, 2500, E.retirement.pensionPm.short)).toBe(900 + E.retirement.renterCoverPara);
    st.counters.peakMonthly = 12_000;
    expect(pensionFor(st, 1500, E.retirement.pensionPm.full)).toBe(Math.trunc((12_000 * E.retirement.peakRefPm / 1000) * E.retirement.pensionPm.full / 1000));
  });

  it('a jobless elder gets an income: the pension with enough years, else the social pension at socialAge', () => {
    const a = life('OA-JOBLESS-A');
    a.st.status.job = null; a.st.counters.yearsWorked = 20; a.st.counters.peakMonthly = 2500;
    a.st.calendar.age = E.retirement.minAge; a.st.calendar.nextBirthdayDay = a.st.calendar.calendarDay + 1;
    for (let i = 0; i < 3 && a.st.calendar.age === E.retirement.minAge; i++) { a.day(); a.ans(); }
    const job = a.st.status.job as LifeState['status']['job'];
    expect(job?.title).toBe('emekli');
    expect(job!.monthly).toBeGreaterThanOrEqual(E.retirement.minPensionPara);
    const b = life('OA-JOBLESS-B');
    b.st.status.job = null; b.st.counters.yearsWorked = 3;
    b.st.calendar.age = E.retirement.socialAge - 1; b.st.calendar.nextBirthdayDay = b.st.calendar.calendarDay + 1;
    for (let i = 0; i < 3 && b.st.calendar.age < E.retirement.socialAge; i++) { b.day(); b.ans(); }
    expect(b.st.status.job).toMatchObject({ title: 'emekli', monthly: E.retirement.socialPensionPara });
    expect(b.st.flags).toContain(E.retirement.socialFlag);
  });
});

describe('elder care card (old-age sprint)', () => {
  it('a retired renter in debt with a grown child is offered the spare room; moving in ends the rent', () => {
    const l = life('OA-CARE-KID', WITH_ELDER);
    retiree(l.st, 74, 'flat', 900);
    l.st.npcs.push({ role: 'child', exists: true, alive: true, affinity: 50, memories: [], bornDay: l.st.calendar.calendarDay - 45 * 365 });
    l.st.money.balance = -4000;
    let seen: string | null = null;
    for (let i = 0; i < 3 && !seen; i++) { l.day(); if (l.st.card?.eventId.startsWith('yaslilik_gundelik_')) seen = l.st.card.eventId; else l.ans(); }
    expect(seen).toBe('yaslilik_gundelik_cocugun_yanina_tasinma_01');
    expect(l.st.card!.forced).toBe(true);
    l.ans('tasin');
    expect(l.st.status.home.kind).toBe('family');
    expect(l.st.flags).toContain('cocugun_yaninda');
    const day = l.st.calendar.calendarDay;
    const r = applyCashflow(l.st, day, day + 31);
    expect(r.lines.some((x) => x.kind === 'rent')).toBe(false);
    expect(r.detail.upkeep).toBe(-E.housing.family.rent);
    expect(r.rentShortfall).toBe(false);
  });

  it('without a child: downsizing first, the support desk once the move is done; never twice within minGapDays', () => {
    const l = life('OA-CARE-SOLO', WITH_ELDER);
    retiree(l.st, 76, 'wide', 1300);
    l.st.money.balance = -3000;
    const cards: string[] = [];
    for (let i = 0; i < 8; i++) {
      l.day();
      const id = l.st.card?.eventId;
      if (id?.startsWith('yaslilik_gundelik_')) { cards.push(id); l.ans(cards.length === 1 ? 'tasin' : undefined); l.st.money.balance = -3000; }
      else l.ans();
    }
    expect(l.st.calendar.calendarDay - 40).toBeLessThan(E.elderCare.minGapDays);
    expect(cards[0]).toBe('yaslilik_gundelik_kucuk_eve_gecis_01');
    expect(cards).toHaveLength(1);                                   // minGapDays: one help card per stretch
    expect(l.st.status.home).toMatchObject({ kind: 'room', rent: 300 });
    l.st.calendar.calendarDay += E.elderCare.minGapDays;
    let next: string | null = null;
    for (let i = 0; i < 3 && !next; i++) { l.day(); if (l.st.card?.eventId.startsWith('yaslilik_gundelik_')) next = l.st.card.eventId; else l.ans(); }
    expect(next).toBe('yaslilik_gundelik_vefa_masasi_destek_01');
  });

  it('nothing for a working elder, a solvent one, or before fromAge', () => {
    for (const [age, job, bal] of [[70, 'ofis', -4000], [70, 'emekli', 5000], [E.elderCare.fromAge - 2, 'emekli', -4000]] as const) {
      const l = life(`OA-NONE-${age}-${job}-${bal}`, WITH_ELDER);
      retiree(l.st, age, 'flat', 900);
      l.st.status.job = { title: job, tier: 2, monthly: 1600, since: 0 };
      l.st.money.balance = bal;
      for (let i = 0; i < 5; i++) { l.day(); expect(l.st.card?.eventId ?? '').not.toMatch(/^yaslilik_gundelik_(cocugun|kucuk|vefa)/); l.ans(); }
    }
  });
});
