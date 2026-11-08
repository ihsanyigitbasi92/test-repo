/**
 * Integer lookup helpers over the generated tables (D-098: no Math.exp/pow/log/tanh in the engine).
 */
import { HAZARD_PPM, HAZARD_MIN_AGE } from './hazard.ts';
import { GAP_QUANTILE_PM } from './gapQuantile.ts';
import { DECAY_MAX_GAP, JOY_PULL_PM, LUCK_KEEP_BP, DEBT_GROW_PPM } from './decay.ts';
import { TANH_PM, TANH_STEP_INV } from './tanh.ts';

export { HAZARD_PPM, GAP_QUANTILE_PM, JOY_PULL_PM, LUCK_KEEP_BP, DEBT_GROW_PPM, TANH_PM };

const clampGap = (g: number) => (g < 0 ? 0 : g > DECAY_MAX_GAP ? DECAY_MAX_GAP : g);

/** Base yearly hazard in ppm for an age and a health value in bp (0..10000). */
export function hazardBasePpm(age: number, healthBp: number): number {
  const row = HAZARD_PPM[Math.min(HAZARD_PPM.length - 1, Math.max(0, age - HAZARD_MIN_AGE))]!;
  const bucket = Math.min(20, Math.max(0, Math.floor(healthBp / 500)));
  return row[bucket]!;
}

/** Log-normal gap multiplier (per-mille) for a uniform draw u ∈ [0, 255]. */
export function gapMultiplierPm(u256: number): number {
  return GAP_QUANTILE_PM[Math.min(255, Math.max(0, u256))]!;
}

/** 1 − 0.70^(gap/365) in per-mille. */
export const joyPullPm = (gap: number): number => JOY_PULL_PM[clampGap(gap)]!;
/** 0.85^(gap/365) in bp. */
export const luckKeepBp = (gap: number): number => LUCK_KEEP_BP[clampGap(gap)]!;
/** 1.18^(gap/365) in ppm. */
export const debtGrowPpm = (gap: number): number => DEBT_GROW_PPM[clampGap(gap)]!;

/** tanh(x) in per-mille for x given in per-mille (x ≥ 4 saturates); odd-symmetric; linear interpolation. */
export function tanhPm(xPm: number): number {
  const neg = xPm < 0;
  const x = neg ? -xPm : xPm;
  const pos = Math.floor((x * TANH_STEP_INV) / 1000);          // table index
  if (pos >= TANH_PM.length - 1) return neg ? -TANH_PM[TANH_PM.length - 1]! : TANH_PM[TANH_PM.length - 1]!;
  const frac = x * TANH_STEP_INV - pos * 1000;                 // 0..999
  const v = TANH_PM[pos]! + Math.floor(((TANH_PM[pos + 1]! - TANH_PM[pos]!) * frac) / 1000);
  return neg ? -v : v;
}
