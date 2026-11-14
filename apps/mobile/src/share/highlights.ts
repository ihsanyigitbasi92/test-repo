/**
 * Life highlights for the share card (pure TS, no React Native imports — unit-tested in node).
 *
 * The controller feeds every engine step through `noteStep(prev, next, effects)`; it keeps the best career reached
 * and the single best / hardest moment of the life with the age it happened at. Only things the engine already
 * knows are used (flags, status, counters, wager stamps): nothing is invented, and nothing about real people —
 * the only name that ever reaches the card is the character name the player typed.
 *
 * Grief-safe by construction: the loss of a person or a pet is never a "hardest moment" (it is not a meme line),
 * and nothing here mentions the cause of death (the card has its own gentle line for that).
 *
 * A save written before this module existed has no highlights: `fromFinalState()` derives what it can from the
 * last LifeState (wedding / child / home ages from their `since` / `bornDay`, the coach's lost wager).
 */
import type { Effect, LifeState } from '@motto/engine';

export type BestKind = 'wedding' | 'child' | 'grandchild' | 'home' | 'promotion' | 'wagerWin' | 'firstJob';
export type WorstKind = 'bankruptcy' | 'divorce' | 'fired' | 'breakup' | 'coachCalled' | 'rentCrisis';
export interface Moment<K extends string> { kind: K; age: number; score: number; /** wager odds in % for wager kinds */ odds?: number }
export interface LifeHighlights {
  v: 1;
  /** Highest job reached while working (a retiree keeps the job they retired from). */
  topJob: { title: string; tier: number } | null;
  best: Moment<BestKind> | null;
  worst: Moment<WorstKind> | null;
}

export const emptyHighlights = (): LifeHighlights => ({ v: 1, topJob: null, best: null, worst: null });

/** Base weights: a bigger number wins; ties keep the earlier moment. */
const BEST: Record<BestKind, number> = { child: 90, wedding: 85, grandchild: 80, home: 70, wagerWin: 50, promotion: 45, firstJob: 20 };
const WORST: Record<WorstKind, number> = { bankruptcy: 90, divorce: 85, fired: 60, breakup: 50, rentCrisis: 35, coachCalled: 30 };
const RETIRED = 'emekli';

const working = (st: LifeState | null | undefined): boolean => !!st?.status.job && st.status.job.title !== RETIRED;
const has = (st: LifeState | null | undefined, f: string): boolean => !!st && st.flags.includes(f);
const gained = (prev: LifeState | null, next: LifeState, f: string): boolean => has(next, f) && !has(prev, f);
const childExists = (st: LifeState | null | undefined): boolean => !!st && st.npcs.some((n) => n.role === 'child' && n.exists);
const grandchild = (st: LifeState | null | undefined): boolean => !!st && st.flags.some((f) => f.startsWith('torun'));
const homeOwned = (st: LifeState | null | undefined): boolean => !!st && (st.status.home.kind === 'owned' || st.status.home.kind === 'mortgage' || st.flags.includes('ev_sahibi'));

function better<K extends string>(cur: Moment<K> | null, cand: Moment<K>): Moment<K> {
  return !cur || cand.score > cur.score ? cand : cur;
}

/** Fold one engine step into the highlights (returns a new object only when something changed). */
export function noteStep(h: LifeHighlights, prev: LifeState | null, next: LifeState | null, effects: readonly Effect[]): LifeHighlights {
  if (!next || !next.status) return h;
  const age = next.calendar.age;
  let { topJob, best, worst } = h;
  const job = next.status.job;
  if (job && job.title !== RETIRED && (!topJob || job.tier > topJob.tier || (job.tier === topJob.tier && job.title !== topJob.title && !working(prev)))) {
    if (!topJob) best = better(best, { kind: 'firstJob', age, score: BEST.firstJob });
    else if (job.tier > topJob.tier) best = better(best, { kind: 'promotion', age, score: BEST.promotion + job.tier });
    topJob = { title: job.title, tier: job.tier };
  }
  if (prev) {
    if (gained(prev, next, 'evli')) best = better(best, { kind: 'wedding', age, score: BEST.wedding });
    if (childExists(next) && !childExists(prev)) best = better(best, { kind: 'child', age, score: BEST.child });
    if (grandchild(next) && !grandchild(prev)) best = better(best, { kind: 'grandchild', age, score: BEST.grandchild });
    if (homeOwned(next) && !homeOwned(prev)) best = better(best, { kind: 'home', age, score: BEST.home });
    if (next.counters.bankruptcies > prev.counters.bankruptcies) worst = better(worst, { kind: 'bankruptcy', age, score: WORST.bankruptcy });
    if (gained(prev, next, 'bosandi')) worst = better(worst, { kind: 'divorce', age, score: WORST.divorce });
    else if (prev.status.partner && !next.status.partner && !has(next, 'evli')) worst = better(worst, { kind: 'breakup', age, score: WORST.breakup });
    if (working(prev) && !next.status.job) worst = better(worst, { kind: 'fired', age, score: WORST.fired });
    if (next.counters.rentEvents > prev.counters.rentEvents && next.counters.rentEvents >= 3) worst = better(worst, { kind: 'rentCrisis', age, score: WORST.rentCrisis });
  }
  for (const e of effects) {
    if (e.kind !== 'STAMP') continue;
    const odds = Math.round(e.pOddsBp / 100);
    // The coach said "it won't happen" at these odds. Player proved it wrong: lower odds = sweeter.
    if (e.result === 'iWasWrong') best = better(best, { kind: 'wagerWin', age, score: BEST.wagerWin + Math.round((100 - odds) / 10), odds });
    else worst = better(worst, { kind: 'coachCalled', age, score: WORST.coachCalled + Math.round(odds / 10), odds });
  }
  if (topJob === h.topJob && best === h.best && worst === h.worst) return h;
  return { v: 1, topJob, best, worst };
}

/** Best effort for a life resumed from a save that predates highlights. */
export function fromFinalState(st: LifeState): LifeHighlights {
  const ageAt = (day: number) => Math.max(18, st.calendar.age - Math.floor((st.calendar.calendarDay - day) / 365));
  let best: Moment<BestKind> | null = null;
  let worst: Moment<WorstKind> | null = null;
  const kid = st.npcs.find((n) => n.role === 'child' && n.exists);
  if (kid?.bornDay !== undefined) best = better(best, { kind: 'child', age: ageAt(kid.bornDay), score: BEST.child });
  if (st.flags.includes('evli') && st.status.partner) best = better(best, { kind: 'wedding', age: ageAt(st.status.partner.since), score: BEST.wedding });
  if (homeOwned(st)) best = better(best, { kind: 'home', age: ageAt(st.status.home.since), score: BEST.home });
  if (st.counters.bankruptcies > 0) worst = { kind: 'bankruptcy', age: st.calendar.age, score: 0 };
  const job = st.status.job;
  return { v: 1, topJob: job ? { title: job.title, tier: job.tier } : null, best, worst };
}

/** Validates a highlights blob read back from a save (anything odd → null). */
export function readHighlights(x: unknown): LifeHighlights | null {
  if (typeof x !== 'object' || x === null) return null;
  const h = x as Partial<LifeHighlights>;
  if (h.v !== 1 || !('best' in h) || !('worst' in h) || !('topJob' in h)) return null;
  return { v: 1, topJob: h.topJob ?? null, best: h.best ?? null, worst: h.worst ?? null };
}
