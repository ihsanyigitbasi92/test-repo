/**
 * "Arada bir efektli an" — full-screen avatar moments. Pure helpers (no React Native) used by useGame:
 * which life change a step produced (observed from engine state, never decided here), the ≤ 1 per 8 shown days
 * cadence, and the outcome valence that drives the player's HUD mood.
 */
import type { Mood, TopStyle } from './look';

export type MomentKind = 'birthday' | 'promotion' | 'sad' | 'legendary' | 'wagerWin' | 'death';
export type MomentReason = 'newJob' | 'promotion' | 'retired' | 'breakup' | 'fired';

/** At most one moment per this many shown days (death is exempt). */
export const MOMENT_GAP_DAYS = 8;

export function momentAllowed(kind: MomentKind, shownDays: number, lastMomentDay: number): boolean {
  if (kind === 'death') return true;
  return shownDays - lastMomentDay >= MOMENT_GAP_DAYS;
}

/** Highest first: only one moment is played per step. */
export const MOMENT_PRIORITY: readonly MomentKind[] = ['death', 'legendary', 'birthday', 'promotion', 'wagerWin', 'sad'];

export function pickMoment(candidates: readonly MomentKind[], shownDays: number, lastMomentDay: number): MomentKind | null {
  for (const k of MOMENT_PRIORITY) if (candidates.includes(k) && momentAllowed(k, shownDays, lastMomentDay)) return k;
  return null;
}

/** Structural slice of LifeState.status the detector reads. */
export interface StatusSlice {
  job: { title: string; tier: number } | null;
  partner: { npc: string; since: number } | null;
}

/** Career / relationship transition between two engine states (null when nothing moment-worthy changed). */
export function lifeChange(prev: StatusSlice | null | undefined, next: StatusSlice): { kind: 'promotion' | 'sad'; reason: MomentReason } | null {
  if (!prev) return null;
  const a = prev.job, b = next.job;
  if (b && b.title === 'emekli' && a?.title !== 'emekli') return { kind: 'promotion', reason: 'retired' };
  if (!a && b) return { kind: 'promotion', reason: 'newJob' };
  if (a && b && a.title !== b.title) return { kind: 'promotion', reason: 'newJob' };
  if (a && b && b.tier > a.tier) return { kind: 'promotion', reason: 'promotion' };
  if (a && !b) return { kind: 'sad', reason: 'fired' };
  if (prev.partner && !next.partner) return { kind: 'sad', reason: 'breakup' };
  return null;
}

export interface DeltaLike { stat: string; delta: number }
/** Lower is better for these meters. Ego is left out: up or down, it is never clearly good news. */
const INVERTED = new Set(['momPressure', 'cringe']);

/** Outcome deltas → player face: more good than bad → happy, more bad → sad. */
export function outcomeMood(deltas: readonly DeltaLike[]): Mood | null {
  let score = 0;
  for (const d of deltas) {
    if (!d.delta || d.stat === 'ego') continue;
    const good = INVERTED.has(d.stat) ? d.delta < 0 : d.delta > 0;
    score += good ? 1 : -1;
  }
  return score > 0 ? 'happy' : score < 0 ? 'sad' : null;
}

export interface MomentView {
  id: number;
  kind: MomentKind;
  reason?: MomentReason;
  /** Player age now (birthday: the new age). */
  age: number;
  fromAge: number;
  outfitFrom: TopStyle;
  outfitTo: TopStyle;
  /** Engine job title id after the change (promotion / new job). */
  jobTitle?: string;
  cat: boolean;
  /** Auto-dismiss after this many ms (tap skips earlier). */
  ms: number;
}
