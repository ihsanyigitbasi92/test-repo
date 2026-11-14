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

/**
 * Update pity counters, LOL/wow trackers after a shown event day. `surprise` = the day was picked from the surprise
 * pool (sprint 3: untagged pool picks count too, so pity resets and the session cap binds). The negative streak is
 * kept by `noteFelt` after the answer (a quiet day without an event resets it here).
 */
export function notePlayed(st: LifeState, ev: GameEvent | null, legendary: boolean, surprise = false): void {
  const r = st.reward, day = st.calendar.dayIndex;
  if (ev && (surprise || isSurprise(ev))) { hit(r.surprise, day); st.counters.surprises++; } else r.surprise.sinceLast++;
  if (legendary) { hit(r.legendary, day); st.counters.legendaries++; } else r.legendary.sinceLast++;
  const valence = ev?.valence ?? 0;
  if (!ev) r.negStreak = 0;
  r.beatsSinceLol = ev?.isLOL ? 0 : r.beatsSinceLol + 1;
  if (ev?.wow) r.wowCount++;
  st.director.lastValence = valence;
}

/**
 * Sprint 3 (O7): the negative streak follows what the player felt, not only the event's label. `feltBp` = net stat
 * change of the answered outcome (health + joy + brain + charm, bp); 0 falls back to the money sign, then to the
 * event valence. The D-052 valence guard reads this counter on the next pick.
 */
export function noteFelt(st: LifeState, ev: GameEvent, feltBp: number, money: number): void {
  const r = st.reward;
  const sign = feltBp !== 0 ? Math.sign(feltBp) : money !== 0 ? Math.sign(money) : Math.sign(ev.valence);
  r.negStreak = sign < 0 ? r.negStreak + 1 : 0;
  if (r.negStreak > st.counters.maxNegStreak) st.counters.maxNegStreak = r.negStreak;
}
