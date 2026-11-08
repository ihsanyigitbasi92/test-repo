/**
 * Mini harness (03 §6.2, reduced for CI): N lives × personas, aggregated metrics + relaxed thresholds.
 * The full 10k-life harness with session timing lives in packages/engine/sim (later sprint).
 */
import { expect } from 'vitest';
import { TUNING, bandFor } from '../../src/index';
import { BUNDLE } from './content';
import { quantile, runLife, type Persona } from './sim';

export function harness(from: number, to: number): void {
  const ages: number[] = [], shown: number[] = [], legs: number[] = [], wagers: number[] = [];
  let hits = 0, total = 0, nm = 0, fails = 0, bonus = 0, yearsChecked = 0, yearsOut = 0, maxNeg = 0, maxCalls = 0, quiet = 0;
  const personas: Persona[] = ['chaotic', 'first', 'last'];
  for (let i = from; i < to; i++) {
    const r = runLife(`H${i}`, BUNDLE, personas[i % 3]!);
    const s = r.state;
    expect(s.phase).toBe('dead');
    ages.push(s.calendar.age); shown.push(s.counters.shownDays); legs.push(s.counters.legendaries); wagers.push(s.wagerLog.total);
    hits += s.wagerLog.coachHits; total += s.wagerLog.total;
    nm += s.reward.nearMiss.count; fails += s.reward.nearMiss.failCount; bonus += s.reward.nearMiss.bonusApplied;
    maxNeg = Math.max(maxNeg, s.counters.maxNegStreak); maxCalls = Math.max(maxCalls, s.counters.momCalls); quiet += s.counters.quietDays;
    expect(r.reports.length).toBe(s.calendar.age - TUNING.calendar.startAge - 1);   // one card per survived birthday
    for (const rep of r.reports) {
      const b = bandFor(rep.age - 1);
      yearsChecked++;
      if (rep.shownDaysThisYear < b.min || rep.shownDaysThisYear > b.max + TUNING.dayBudget.capAboveMax) yearsOut++;
    }
  }
  const n = to - from;
  // 03 §6.2 thresholds, relaxed where the synthetic test pool (≈ 90 events) cannot meet MVP-content targets
  expect(Math.min(...ages)).toBeGreaterThanOrEqual(28);                         // protection window: nobody dies before 28
  expect(quantile(ages, 0.5)).toBeGreaterThanOrEqual(68);                       // spec 72–78
  expect(quantile(ages, 0.5)).toBeLessThanOrEqual(88);
  expect(quantile(ages, 0.05)).toBeGreaterThanOrEqual(40);                      // spec ≥ 42
  expect(quantile(shown, 0.5)).toBeGreaterThanOrEqual(400);                     // spec 450–600
  expect(quantile(shown, 0.5)).toBeLessThanOrEqual(650);
  expect(yearsOut).toBe(0);                                                     // AC-03-02: 100 % of years in band
  expect(yearsChecked).toBeGreaterThan(n * 20);
  expect(hits / total).toBeGreaterThanOrEqual(0.45);                            // spec 0.50–0.62
  expect(hits / total).toBeLessThanOrEqual(0.65);
  expect(quantile(wagers, 0.5)).toBeGreaterThanOrEqual(10);                     // spec 20–45
  expect(quantile(wagers, 0.5)).toBeLessThanOrEqual(60);
  expect(quantile(legs, 0.5)).toBeGreaterThanOrEqual(1);                        // spec 2–6
  expect(quantile(legs, 0.5)).toBeLessThanOrEqual(8);
  expect(nm / Math.max(1, fails)).toBeLessThanOrEqual(0.30);                    // near-miss ≤ 30 % of fails
  expect(bonus).toBeLessThanOrEqual(nm);                                        // every promise applied at most once
  expect(maxNeg).toBeLessThanOrEqual(3);                                        // spec ≤ 2 (+1 forced item after one deferral)
  expect(maxCalls).toBeLessThanOrEqual(TUNING.momCall.maxPerLife);              // D-108
  expect(quiet).toBe(0);                                                        // AC-03-01 with a sufficient pool
}
