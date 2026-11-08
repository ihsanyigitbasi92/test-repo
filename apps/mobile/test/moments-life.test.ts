/**
 * "Arada bir" cadence over whole lives: drives the real engine (auto-play with random choices, as the ▶▶ auto mode
 * does) and replays useGame's moment detection + gate. A life must show only a handful of full-screen moments.
 */
import { describe, expect, it } from 'vitest';
import { step, emptyMeta } from '@motto/engine';
import type { Effect, LifeState, MetaState } from '@motto/engine';
import { BUNDLE } from '../src/content/bundle';
import { seededRng } from '../src/avatar/look';
import {
  BIRTHDAY_MILESTONES, emptyMomentHistory, isMilestoneBirthday, lifeChange, momentCandidates, pickMoment, recordMoment,
} from '../src/avatar/moments';
import type { MomentKind } from '../src/avatar/moments';

function simulateLife(seed: string): { kinds: MomentKind[]; birthdays: number; endAge: number } {
  const rnd = seededRng(`auto:${seed}`);
  let meta: MetaState = emptyMeta();
  let r = step(null as unknown as LifeState, meta, { type: 'START_LIFE', seed, name: 'Deniz', locale: 'tr' }, BUNDLE);
  let st = r.state; meta = r.meta;
  const hist = emptyMomentHistory();
  let deferred: 'promotion' | 'sad' | null = null;
  const kinds: MomentKind[] = [];
  let birthdays = 0;
  for (let guard = 0; guard < 6000; guard++) {
    const prev = st;
    if (st.phase === 'day' && st.card) {
      const open = st.card.choices.filter((c) => !c.locked);
      const c = open[Math.floor(rnd() * open.length)]!;
      r = step(st, meta, { type: 'ANSWER', eventId: st.card.eventId, choiceId: c.id, via: 'auto' }, BUNDLE);
    } else {
      r = step(st, meta, { type: 'NEXT_DAY' }, BUNDLE);
    }
    st = r.state; meta = r.meta;
    const fx: Effect[] = r.effects;
    const pending = st.phase === 'day';
    const change = lifeChange(prev.status, st.status);
    if (change && pending) deferred ??= change.kind;
    const career = !pending ? (change ? change.kind : deferred) : null;
    const report = fx.find((e): e is Extract<Effect, { kind: 'REPORT_CARD' }> => e.kind === 'REPORT_CARD');
    if (report) birthdays++;
    const cands = momentCandidates({
      death: fx.some((e) => e.kind === 'DEATH'),
      legendary: fx.some((e) => e.kind === 'SHOW_DAY' && !!e.card.legendary),
      birthdayAge: report ? report.data.age : null,
      career,
      wagerWin: fx.some((e) => e.kind === 'STAMP' && e.result === 'iWasWrong'),
    });
    const now = { shownDays: st.counters.shownDays, age: st.calendar.age };
    const pick = pickMoment(cands, now, hist);
    if (career && !pending) deferred = null;
    if (pick) { kinds.push(pick); recordMoment(hist, pick, now); }
    if (fx.some((e) => e.kind === 'DEATH')) break;
  }
  return { kinds, birthdays, endAge: st.calendar.age };
}

describe('avatar moments over a whole life', () => {
  it('birthday moments only on milestone ages', () => {
    expect(isMilestoneBirthday(19)).toBe(true);
    expect(isMilestoneBirthday(65)).toBe(true);
    expect(isMilestoneBirthday(31)).toBe(false);
    expect(isMilestoneBirthday(null)).toBe(false);
    expect(BIRTHDAY_MILESTONES.length).toBeLessThanOrEqual(10);
  });

  for (const seed of ['life-a', 'life-b', 'life-c', 'life-d', 'life-e', 'life-f', 'life-g', 'life-h', 'life-i', 'life-j', 'life-k', 'life-l']) {
    it(`shows only a handful of moments (${seed})`, () => {
      const { kinds, birthdays, endAge } = simulateLife(seed);
      const nonDeath = kinds.filter((k) => k !== 'death');
      const count = (k: MomentKind) => kinds.filter((x) => x === k).length;
      // eslint-disable-next-line no-console
      if (process.env.MOMENT_DEBUG) console.log(seed, endAge, birthdays, kinds.join(','));
      expect(nonDeath.length).toBeLessThanOrEqual(12);
      expect(count('birthday')).toBeLessThanOrEqual(BIRTHDAY_MILESTONES.length);
      // most birthdays keep the plain AgeUp overlay
      if (birthdays >= 20) expect(count('birthday')).toBeLessThan(birthdays / 3);
      expect(count('wagerWin')).toBeLessThanOrEqual(Math.ceil(Math.max(1, endAge - 18) / 12));
    });
  }
});
