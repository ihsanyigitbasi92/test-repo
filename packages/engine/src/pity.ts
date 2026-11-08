/**
 * Good-surprise pity and legendary cadence (03 §2.5), unit = shown day, `surprise` RNG channel only.
 * Counters advance in `notePlayed` after every shown (non-birthday) day.
 */
import { TUNING } from './tuning';
import { drawInt } from './util';
import type { GameEvent, LifeState, PityCounter } from './types';

const SU = TUNING.surprise;
const LE = TUNING.legendary;

function pityChanceBp(c: PityCounter, base: number, soft: number, hard: number, ramp: number): number {
  if (c.sinceLast >= hard) return 10000;
  if (c.sinceLast > soft) return Math.min(10000, base + ramp * (c.sinceLast - soft));
  return base;
}

/** Roll the good-surprise tier for today, or null. */
export function rollSurprise(st: LifeState): 'nice' | 'great' | null {
  const c = st.reward.surprise;
  if (st.calendar.dayIndex < SU.startDay || c.sinceLast < SU.minGap || c.sessionCount >= SU.sessionCap) return null;
  const p = pityChanceBp(c, SU.baseBp, SU.softPity, SU.hardPity, SU.rampBp);
  if (drawInt(st, 'surprise', 0, 9999) >= p) return null;
  return drawInt(st, 'surprise', 0, 999) < SU.greatSharePm ? 'great' : 'nice';
}

/** Roll a legendary day (luck never affects it: everyone sees the same cadence). */
export function rollLegendary(st: LifeState): boolean {
  const c = st.reward.legendary;
  if (st.calendar.dayIndex < LE.minDay || c.sessionCount >= LE.sessionCap) return false;
  return drawInt(st, 'surprise', 0, 9999) < pityChanceBp(c, LE.baseBp, LE.softPity, LE.hardPity, LE.rampBp);
}

export const isSurprise = (ev: GameEvent): boolean => ev.tags.some((t) => t === 'surprise.nice' || t === 'surprise.great');

function hit(c: PityCounter, day: number): void { c.sinceLast = 0; c.sessionCount++; c.total++; c.lastDay = day; }

/** Update pity counters, LOL/wow/neg-streak trackers after a shown event day. */
export function notePlayed(st: LifeState, ev: GameEvent | null, legendary: boolean): void {
  const r = st.reward, day = st.calendar.dayIndex;
  if (ev && isSurprise(ev)) { hit(r.surprise, day); st.counters.surprises++; } else r.surprise.sinceLast++;
  if (legendary) { hit(r.legendary, day); st.counters.legendaries++; } else r.legendary.sinceLast++;
  const valence = ev?.valence ?? 0;
  r.negStreak = valence < 0 ? r.negStreak + 1 : 0;
  if (r.negStreak > st.counters.maxNegStreak) st.counters.maxNegStreak = r.negStreak;
  r.beatsSinceLol = ev?.isLOL ? 0 : r.beatsSinceLol + 1;
  if (ev?.wow) r.wowCount++;
  st.director.lastValence = valence;
}
