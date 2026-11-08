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

/** Cause key `<band>.<class>` drawn from the age-band weight table (02 §2.4.3; text lives in content). */
export function pickCause(st: LifeState): string {
  const age = st.calendar.age;
  const rows = H.causeWeightsByAge as unknown as [number, number[]][];
  const row = rows.find((r) => age <= r[0]) ?? rows[rows.length - 1]!;
  const i = weightedIndex(st, 'hazard', row[1]);
  const band = age <= 29 ? '18-29' : age <= 44 ? '30-44' : age <= 64 ? '45-64' : '65+';
  return `${band}.${H.causeClasses[Math.max(0, i)]}`;
}

/** Roll the yearly die; returns the cause key on death. */
export function rollHazard(st: LifeState): string | null {
  const p = hazardPpm(st);
  if (p <= 0) return null;
  return drawInt(st, 'hazard', 0, 999_999) < p ? pickCause(st) : null;
}
