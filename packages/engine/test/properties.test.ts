import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { TUNING, PATTERNS } from '../src/index';
import type { LifeState } from '../src/index';
import { BUNDLE } from './helpers/content';
import { runLife, type Persona } from './helpers/sim';

/** Every number in the state is a finite integer (D-098: no floats, no NaN). */
function assertIntegers(node: unknown, path: string): void {
  if (typeof node === 'number') { if (!Number.isInteger(node)) throw new Error(`${path} = ${node}`); return; }
  if (Array.isArray(node)) node.forEach((v, i) => assertIntegers(v, `${path}[${i}]`));
  else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) assertIntegers(v, `${path}.${k}`);
}

function checkInvariants(st: LifeState): void {
  assertIntegers(st, 'state');
  for (const v of [...Object.values(st.stats), ...Object.values(st.meters), st.hidden.stress]) { expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(10000); }
  expect(st.stats.joy).toBeGreaterThanOrEqual(TUNING.stats.floors.joy);                    // joy never 0 (02 §2.2.1)
  expect(Math.abs(st.hidden.luck)).toBeLessThanOrEqual(5000);
  expect(st.money.balance).toBeGreaterThanOrEqual(TUNING.economy.bankruptcyAtPara);         // floor holds (bankruptcy reset)
  if (st.death) expect(st.death.age).toBeGreaterThanOrEqual(TUNING.hazard.minAge);
  expect(st.calendar.age).toBeLessThanOrEqual(TUNING.hazard.ageHardCap);
}

describe('engine properties (fast-check)', () => {
  it('no NaN / floats, stats in bounds, money floor, no death before 28 — any seed, any persona', () => {
    fc.assert(fc.property(fc.string({ minLength: 1, maxLength: 12 }), fc.constantFrom<Persona>('first', 'chaotic', 'last'), (seed, persona) => {
      let loans = 0;
      const r = runLife(seed, BUNDLE, persona, {
        onStep: (st, a, fx) => {
          checkInvariants(st);
          if (a.type === 'NEXT_DAY' && st.card?.flowLog.some((l) => l.kind === 'momLoan')) {
            loans++;
            expect(st.calendar.age).toBeLessThanOrEqual(TUNING.economy.bailout.maxAge);   // mom loan only in the window
          }
          if (a.type !== 'ANSWER') expect(fx.some((e) => e.kind === 'STAMP')).toBe(false);
        },
      });
      expect(r.state.phase).toBe('dead');
      expect(r.state.counters.momLoans).toBe(loans);
      expect(loans).toBeLessThanOrEqual(1);                                                   // once per life
    }), { numRuns: 12 });
  }, 60_000);

  it('pattern counters only move on ANSWER, by exactly one (AC-03-20)', () => {
    let prev = -1;
    runLife('PAT-1', BUNDLE, 'chaotic', {
      maxSteps: 600,
      onStep: (st, a) => {
        const sum = PATTERNS.reduce((s, p) => s + st.patterns[p], 0);
        if (prev >= 0 && a.type !== 'ANSWER') expect(sum).toBe(prev);
        if (prev >= 0 && a.type === 'ANSWER') expect(sum - prev).toBeLessThanOrEqual(1);
        prev = a.type === 'START_LIFE' ? 0 : sum;
      },
    });
  });

  it('wager offers stay inside [0.35, 0.65] with integer odds and the coach always predicts fail (AC-03-09/10)', () => {
    fc.assert(fc.property(fc.string({ minLength: 1, maxLength: 8 }), (seed) => {
      runLife(seed, BUNDLE, 'chaotic', {
        maxSteps: 500,
        onStep: (st, a) => {
          const w = st.card?.wager;
          if (a.type !== 'NEXT_DAY' || !w) return;
          expect(Number.isInteger(w.pOddsBp)).toBe(true);
          expect(w.pOddsBp).toBeGreaterThanOrEqual(TUNING.wager.pMinBp);
          expect(w.pOddsBp).toBeLessThanOrEqual(TUNING.wager.pMaxBp);
          expect(w.prediction).toBe('fail');
          expect(st.wagerLog.thisYear).toBeLessThan(TUNING.wager.perYear);
        },
      });
    }), { numRuns: 8 });
  }, 60_000);
});
