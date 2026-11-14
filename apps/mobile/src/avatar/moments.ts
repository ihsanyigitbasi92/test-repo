/**
 * "Arada bir efektli an" — full-screen avatar moments. Pure helpers (no React Native) used by useGame:
 * which life change a step produced (observed from engine state, never decided here), the "arada bir" cadence
 * (milestone birthdays, per-kind cooldowns, a global gap), and the outcome valence that drives the player's HUD mood.
 */
import type { Mood, TopStyle } from './look';

export type MomentKind = 'birthday' | 'promotion' | 'sad' | 'legendary' | 'wagerWin' | 'death';
export type MomentReason = 'newJob' | 'promotion' | 'retired' | 'breakup' | 'fired';

/**
 * Global gap: at most one moment per this many shown days (≈ 2–3 in-game years; death and legendary are exempt).
 * "Arada bir" means a handful per life (≤ ~12), not a takeover every birthday.
 */
export const MOMENT_GAP_DAYS = 20;

/**
 * Birthday moments only on milestone ages / aging-tier changes (the first adult year, the decades, and the ages where
 * the face visibly changes: 40 forehead line + eye bags, 55 crow's feet, 65 cardigan + sag). Every other birthday
 * keeps the plain AgeUp overlay.
 */
export const BIRTHDAY_MILESTONES: readonly number[] = [19, 30, 40, 50, 55, 60, 65, 70, 80, 90];
export const isMilestoneBirthday = (age: number | null | undefined): boolean => age != null && BIRTHDAY_MILESTONES.includes(age);

/** Per-kind cooldown in in-game years (since that kind was last shown). Death and legendary have none. */
export const MOMENT_COOLDOWN_YEARS: Readonly<Record<MomentKind, number>> = {
  death: 0, legendary: 0, birthday: 5, promotion: 6, wagerWin: 12, sad: 10,
};

/** Per-life cap per kind (birthday is bounded by the milestone list; death / legendary by the engine). */
export const MOMENT_LIFE_CAP: Readonly<Partial<Record<MomentKind, number>>> = { promotion: 2, wagerWin: 2, sad: 2 };
/** Shared per-life budget of the "life event" kinds (promotion + wagerWin + sad), so milestone birthdays keep room. */
export const EVENT_MOMENTS_PER_LIFE = 5;
/** Hard ceiling of non-death moments per life (legendary included). */
export const MOMENTS_PER_LIFE = 12;
const EVENT_KINDS = new Set<MomentKind>(['promotion', 'wagerWin', 'sad']);
const sumOf = (hist: MomentHistory, pred: (k: MomentKind) => boolean): number =>
  (Object.keys(hist.count) as MomentKind[]).reduce((n, k) => n + (pred(k) ? hist.count[k] ?? 0 : 0), 0);

/** What the gate remembers about shown moments (per life). */
export interface MomentHistory {
  /** shownDays at the last moment of any kind. */
  lastDay: number;
  /** Player age when each kind was last shown. */
  lastAge: Partial<Record<MomentKind, number>>;
  /** How many of each kind this life. */
  count: Partial<Record<MomentKind, number>>;
}
export const emptyMomentHistory = (): MomentHistory => ({ lastDay: -999, lastAge: {}, count: {} });

export interface MomentClock { shownDays: number; age: number }

const EXEMPT = new Set<MomentKind>(['death', 'legendary']);

export function momentAllowed(kind: MomentKind, now: MomentClock, hist: MomentHistory): boolean {
  if (kind === 'death') return true;
  if (sumOf(hist, (k) => k !== 'death') >= MOMENTS_PER_LIFE) return false;
  if (EXEMPT.has(kind)) return true;
  if (EVENT_KINDS.has(kind) && sumOf(hist, (k) => EVENT_KINDS.has(k)) >= EVENT_MOMENTS_PER_LIFE) return false;
  if (now.shownDays - hist.lastDay < MOMENT_GAP_DAYS) return false;
  const cap = MOMENT_LIFE_CAP[kind];
  if (cap !== undefined && (hist.count[kind] ?? 0) >= cap) return false;
  const last = hist.lastAge[kind];
  return last === undefined || now.age - last >= MOMENT_COOLDOWN_YEARS[kind];
}

/** Highest first: only one moment is played per step. */
export const MOMENT_PRIORITY: readonly MomentKind[] = ['death', 'legendary', 'birthday', 'promotion', 'wagerWin', 'sad'];

export function pickMoment(candidates: readonly MomentKind[], now: MomentClock, hist: MomentHistory): MomentKind | null {
  for (const k of MOMENT_PRIORITY) if (candidates.includes(k) && momentAllowed(k, now, hist)) return k;
  return null;
}

/** Remember a shown moment (mutates and returns `hist`). */
export function recordMoment(hist: MomentHistory, kind: MomentKind, now: MomentClock): MomentHistory {
  hist.lastDay = now.shownDays;
  hist.lastAge[kind] = now.age;
  hist.count[kind] = (hist.count[kind] ?? 0) + 1;
  return hist;
}

/** What one engine step showed, reduced to the moment triggers (observed from effects / state, never rolled). */
export interface MomentSignals {
  death: boolean;
  legendary: boolean;
  /** New age on a REPORT_CARD step, else null. Only milestone ages become a candidate. */
  birthdayAge: number | null;
  career: 'promotion' | 'sad' | null;
  wagerWin: boolean;
}

export function momentCandidates(sig: MomentSignals): MomentKind[] {
  const out: MomentKind[] = [];
  if (sig.death) out.push('death');
  if (sig.legendary) out.push('legendary');
  if (isMilestoneBirthday(sig.birthdayAge)) out.push('birthday');
  if (sig.career) out.push(sig.career);
  if (sig.wagerWin) out.push('wagerWin');
  return out;
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
  /** Engine `Job.tier` (career rank) and the job itself (an engine display title, when it has one). */
  jobTier?: number;
  job?: object | null;
  cat: boolean;
  /** Auto-dismiss after this many ms (tap skips earlier). */
  ms: number;
}
