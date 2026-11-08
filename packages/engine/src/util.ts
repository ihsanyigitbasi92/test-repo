/**
 * Small integer helpers + channel RNG access with serialisable draw counters (D-044 / D-101).
 * Every channel is re-derived from `lifeSeed:dayIndex:channel` and fast-forwarded by the stored draw count,
 * so a mid-day save/load replays the exact same stream without storing closures.
 */
import { channelRng, type Rng } from './rng';
import type { Channel, LifeState } from './types';

export type { Channel };

export const clamp = (v: number, lo: number, hi: number): number => (v < lo ? lo : v > hi ? hi : v);
/** Integer a × b / c with round-half-up; all operands integers. */
export const mulDiv = (a: number, b: number, c: number): number => Math.floor((a * b + (c >> 1)) / c);
/** Signed round-half-away-from-zero division. */
export const divRound = (a: number, b: number): number => (a >= 0 ? Math.floor((a + (b >> 1)) / b) : -Math.floor((-a + (b >> 1)) / b));

/**
 * Channel stream positioned after `state.rng[ch]` draws. A tiny module cache keeps the live generator so
 * sequential draws are O(1); a miss (new day, reload, another life) re-derives and fast-forwards —
 * the result is identical either way, so the cache is invisible to determinism.
 */
const live = new Map<string, { rng: Rng; pos: number }>();
function rngFor(st: LifeState, ch: Channel): Rng {
  const key = `${st.lifeSeed}:${st.calendar.dayIndex}:${ch}`;
  const n = st.rng[ch] ?? 0;
  let c = live.get(key);
  if (!c || c.pos > n) {
    if (live.size > 256) live.clear();
    c = { rng: channelRng(st.lifeSeed, st.calendar.dayIndex, ch), pos: 0 };
    live.set(key, c);
  }
  while (c.pos < n) { c.rng.next(); c.pos++; }
  return c.rng;
}

/** Draw one uniform integer in [min, max] from a channel and advance its counter. */
export function drawInt(st: LifeState, ch: Channel, min: number, max: number): number {
  const v = rngFor(st, ch).int(min, max);
  st.rng[ch] = (st.rng[ch] ?? 0) + 1;
  live.get(`${st.lifeSeed}:${st.calendar.dayIndex}:${ch}`)!.pos++;
  return v;
}

/** Bernoulli with probability `pBp`/10000. */
export function drawChanceBp(st: LifeState, ch: Channel, pBp: number): boolean {
  return drawInt(st, ch, 0, 9999) < pBp;
}

/** Weighted pick over integer weights; returns index or -1 when all weights are zero. */
export function weightedIndex(st: LifeState, ch: Channel, weights: readonly number[]): number {
  let total = 0;
  for (const w of weights) total += w;
  if (total <= 0) return -1;
  let r = drawInt(st, ch, 0, total - 1);
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]!;
    if (r < 0) return i;
  }
  return weights.length - 1;
}

export const has = (arr: readonly string[], v: string): boolean => arr.includes(v);
export function addFlag(st: LifeState, f: string): void { if (!st.flags.includes(f)) st.flags.push(f); }
export function removeFlag(st: LifeState, f: string): void { const i = st.flags.indexOf(f); if (i >= 0) st.flags.splice(i, 1); }
