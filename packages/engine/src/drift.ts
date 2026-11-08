/**
 * Passive updates over a calendar gap (02 §2.1.4 applyGap, D-088): yearly constants × gap/365, all integer.
 * Order: stat drift → joy pull → meters → hidden. Cash flow is applied separately (cashflow.ts).
 * Threshold events never fire inside a gap; death never happens inside a gap (hazard only on birthdays).
 */
import { TUNING, steppedByAge } from './tuning';
import { joyPullPm, luckKeepBp, tanhPm } from './tables/index';
import { clamp, divRound, mulDiv } from './util';
import { meanAffinity } from './life';
import type { LifeState } from './types';

const S = TUNING.stats;
const yearly = (perYearBp: number, gap: number): number => divRound(perYearBp * gap, 365);

/** Joy target (02 §2.2.2) in bp: 50 + 0.15·(health−50) + 8·tanh(money/24) + 0.10·(rel−50) − 0.25·max(0, stress−50). */
export function joyTargetBp(st: LifeState): number {
  const jt = S.joyTarget;
  const health = mulDiv(st.stats.health - 5000, jt.healthWeightPm, 1000);
  const money = mulDiv(jt.moneyTanhScaleBp, tanhPm(Math.trunc((st.money.balance * 1000) / jt.moneyTanhDivisorPara)), 1000);
  const rel = (meanAffinity(st.npcs) - 50) * 10;                 // 0.10 · (rel − 50) points → bp
  const stress = -mulDiv(Math.max(0, st.hidden.stress - jt.stressFromBp), jt.stressWeightPm, 1000);
  return clamp(5000 + health + money + rel + stress, S.floors.joy, 10000);
}

export function applyDrift(st: LifeState, gap: number): void {
  if (gap <= 0) return;
  const age = st.calendar.age;
  // 1) core stats: age drift, stress → health; drift alone never pushes below the floors
  let dh = yearly(steppedByAge(S.healthDriftYearBp, age), gap);
  if (st.hidden.stress > 8500) dh += yearly(S.stressHealthYearBp.above85, gap);
  else if (st.hidden.stress > 7000) dh += yearly(S.stressHealthYearBp.above70, gap);
  if (dh < 0) st.stats.health = Math.max(Math.min(st.stats.health, S.floors.health), st.stats.health + dh);
  const db = yearly(steppedByAge(S.brainDriftYearBp, age), gap);
  if (db < 0) st.stats.brain = Math.max(Math.min(st.stats.brain, S.floors.brain), st.stats.brain + db);
  const dc = yearly(steppedByAge(S.charmDriftYearBp, age), gap);
  if (dc < 0) st.stats.charm = Math.max(Math.min(st.stats.charm, S.floors.charm), st.stats.charm + dc);
  // 2) joy pulled toward its target by 1 − 0.70^(gap/365)
  st.stats.joy = clamp(st.stats.joy + mulDiv(joyTargetBp(st) - st.stats.joy, joyPullPm(gap), 1000), S.floors.joy, 10000);
  if (st.stats.joy < S.lowJoyBelowBp && st.stats.brain > S.brainCapLowJoyBp) st.stats.brain = S.brainCapLowJoyBp;
  // 3) comedy meters
  const egoStep = yearly(S.egoReversionYearBp, gap);
  if (st.meters.ego > 5000) st.meters.ego = Math.max(5000, st.meters.ego - egoStep);
  else if (st.meters.ego < 5000) st.meters.ego = Math.min(5000, st.meters.ego + egoStep);
  st.meters.cringe = clamp(st.meters.cringe + yearly(S.cringeDecayYearBp, gap), 0, 10000);
  const mom = st.npcs.find((n) => n.role === 'mom');
  if (mom?.alive) {                                              // D-ÖNERİ-02-04: frozen once mom is gone; D-108 drops "single 24+"
    let perYear = 0;
    if (!st.status.job) perYear += S.momAccrualYearBp.unemployed;
    if (st.status.home.kind === 'momsHouse') perYear += S.momAccrualYearBp.momsHouse;
    const add = Math.min(yearly(perYear, gap), Math.max(0, S.momYearCapBp - st.yearStats.momAccruedBp));
    st.yearStats.momAccruedBp += add;
    st.meters.momPressure = clamp(st.meters.momPressure + add, 0, 10000);
  }
  // 4) hidden: stress decay, luck reversion ×0.85^(gap/365)
  let ds = yearly(S.stressDecayYearBp, gap);
  if (st.stats.joy >= S.highJoyBp) ds += yearly(S.stressDecayHighJoyYearBp, gap);
  st.hidden.stress = clamp(st.hidden.stress + ds, 0, 10000);
  st.hidden.luck = clamp(Math.trunc((st.hidden.luck * luckKeepBp(gap)) / 10000), -5000, 5000);
}
