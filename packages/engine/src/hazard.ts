/**
 * Birthday pulse and the hazard die (02 §2.4.1–2.4.3). One die per year, `hazard` channel, birthdays only.
 * hazard = Gompertz(age, health bucket) [precomputed ppm table] × lifestyle × (1 − luck/1000); age ≥ 100 → 1.
 * The die is closed inside the 18–28 protection window (no death before 28).
 */
import { TUNING } from './tuning';
import { hazardBasePpm } from './tables/index';
import { drawInt, weightedIndex } from './util';
import type { LifeState } from './types';

const H = TUNING.hazard;

/** Yearly death probability in ppm (integer). */
export function hazardPpm(st: LifeState): number {
  const age = st.calendar.age;
  if (age >= H.ageHardCap) return 1_000_000;
  if (age < H.minAge) return 0;
  let p = hazardBasePpm(age, st.stats.health);
  const f = st.flags, L = H.lifestylePm;
  if (f.includes('sigara')) p = Math.trunc((p * L.sigara) / 1000);
  if (f.includes('sporcu')) p = Math.trunc((p * L.sporcu) / 1000);
  if (f.includes('kronik')) p = Math.trunc((p * L.kronik) / 1000);
  if (st.hidden.stress > 7000) p = Math.trunc((p * L.stress70) / 1000);
  p = Math.trunc((p * (H.luckDivisor - st.hidden.luck)) / H.luckDivisor);   // luck bp ±5000 → ±5 %
  return Math.min(1_000_000, Math.max(0, p));
}

/**
 * Cause weights for the current state (playtest 2026-11-12: a health-90 life died of "something from outside" at 47,
 * a health-4 life too). Age-band base weights × per-mille state multipliers: low health → illness, high health →
 * the (rare, age-appropriate) sudden causes; high stress → circulation; smoking → resp/tumor; sport → less circ.
 */
export function causeWeights(st: LifeState): number[] {
  const age = st.calendar.age, C = H.causeState;
  const rows = H.causeWeightsByAge as unknown as [number, number[]][];
  const base = (rows.find((r) => age <= r[0]) ?? rows[rows.length - 1]!)[1];
  const hp = Math.trunc(st.stats.health / 100);
  const hRow = (C.byHealth as unknown as [number, number, number][]).find((r) => hp <= r[0]) ?? C.byHealth[C.byHealth.length - 1]!;
  const [, illPm, suddenPm] = hRow as [number, number, number];
  return H.causeClasses.map((cls, i) => {
    let w = (base[i] ?? 0) * 1000;
    if (cls === 'circ' || cls === 'tumor' || cls === 'resp') w = Math.trunc((w * illPm) / 1000);
    else if (cls === 'accident' || cls === 'external') w = Math.trunc((w * suddenPm) / 1000);
    if (cls === 'circ' && Math.trunc(st.hidden.stress / 100) > C.stressAbovePoints) w = Math.trunc((w * C.stressCircPm) / 1000);
    if ((cls === 'resp' || cls === 'tumor') && st.flags.includes('sigara')) w = Math.trunc((w * C.sigaraRespTumorPm) / 1000);
    if (cls === 'circ' && st.flags.includes('sporcu')) w = Math.trunc((w * C.sporcuCircPm) / 1000);
    return w;
  });
}

/** Cause key `<band>.<class>` drawn from the state-weighted table (02 §2.4.3; text lives in content). */
export function pickCause(st: LifeState): string {
  const age = st.calendar.age;
  const i = weightedIndex(st, 'hazard', causeWeights(st));
  const band = age <= 29 ? '18-29' : age <= 44 ? '30-44' : age <= 64 ? '45-64' : '65+';
  return `${band}.${H.causeClasses[Math.max(0, i)]}`;
}

/** Roll the yearly die; returns the cause key on death. */
export function rollHazard(st: LifeState): string | null {
  const p = hazardPpm(st);
  if (p <= 0) return null;
  return drawInt(st, 'hazard', 0, 999_999) < p ? pickCause(st) : null;
}
