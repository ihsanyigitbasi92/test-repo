/**
 * Precondition evaluator for the 03 §2.2.2 DSL against LifeState. Integer comparisons only.
 * Points in content (0..100) are compared against bp/100; money bounds are Para.
 */
import type { Pre, PatternId } from '@motto/content-schema';
import { seasonOf, civilFromDays, absOfISO } from './calendar';
import type { LifeState, MetaState, StatId, MeterId, HiddenId } from './types';

const inRange = (v: number, r: { min?: number; max?: number } | undefined): boolean =>
  r === undefined || ((r.min === undefined || v >= r.min) && (r.max === undefined || v <= r.max));
const pts = (bp: number) => Math.floor(bp / 100);

export function currentCivil(st: LifeState) {
  return civilFromDays(absOfISO(st.calendar.startDateISO) + st.calendar.calendarDay);
}

const emptyCache = new WeakMap<object, boolean>();
const isEmpty = (pre: Pre): boolean => {
  let v = emptyCache.get(pre);
  if (v === undefined) { v = Object.keys(pre).length === 0; emptyCache.set(pre, v); }
  return v;
};

export function evalPre(pre: Pre | undefined, st: LifeState, meta: MetaState): boolean {
  if (!pre || isEmpty(pre)) return true;
  if (pre.all && !pre.all.every((p) => evalPre(p, st, meta))) return false;
  if (pre.any && !pre.any.some((p) => evalPre(p, st, meta))) return false;
  if (pre.none && pre.none.some((p) => evalPre(p, st, meta))) return false;
  if (!inRange(st.calendar.age, pre.age)) return false;
  if (pre.stats) for (const k of Object.keys(pre.stats) as StatId[]) if (!inRange(pts(st.stats[k]), pre.stats[k])) return false;
  if (pre.meters) for (const k of Object.keys(pre.meters) as MeterId[]) if (!inRange(pts(st.meters[k]), pre.meters[k])) return false;
  if (pre.hidden) for (const k of Object.keys(pre.hidden) as HiddenId[]) if (!inRange(pts(st.hidden[k]), pre.hidden[k])) return false;
  if (!inRange(st.money.balance, pre.money)) return false;
  if (pre.flags) {
    const f = st.flags;
    if (pre.flags.all && !pre.flags.all.every((x) => f.includes(x))) return false;
    if (pre.flags.any && !pre.flags.any.some((x) => f.includes(x))) return false;
    if (pre.flags.none && pre.flags.none.some((x) => f.includes(x))) return false;
  }
  if (pre.career) {
    const job = st.status.job;
    if (pre.career.employed !== undefined && (job !== null) !== pre.career.employed) return false;
    if (pre.career.minRung !== undefined && (job?.tier ?? 0) < pre.career.minRung) return false;
    if (pre.career.anyOf && !(job && pre.career.anyOf.includes(job.title))) return false;
  }
  if (pre.housing && !pre.housing.includes(st.status.home.kind)) return false;
  if (pre.npc) {
    for (const [role, c] of Object.entries(pre.npc)) {
      if (!c) continue;
      const n = st.npcs.find((x) => x.role === role);
      const exists = !!n?.exists;
      if (c.exists !== undefined && exists !== c.exists) return false;
      if (c.alive !== undefined && (exists && n!.alive) !== c.alive) return false;
      if (c.minAffinity !== undefined && (n?.affinity ?? 0) < c.minAffinity) return false;
      if (c.maxAffinity !== undefined && (n?.affinity ?? 0) > c.maxAffinity) return false;
      if (c.memoryHas && !c.memoryHas.every((m) => n?.memories.includes(m))) return false;
      if (c.memoryNone && c.memoryNone.some((m) => n?.memories.includes(m))) return false;
    }
  }
  if (pre.goal) return false;                                   // goals are not in the MVP engine → gated events never fire
  if (pre.season && !pre.season.includes(seasonOf(currentCivil(st).m))) return false;
  if (pre.chain) {
    const ch = st.chains[pre.chain.id];
    if (pre.chain.nodeDone && !pre.chain.nodeDone.every((n) => ch?.done.includes(n))) return false;
    if (pre.chain.nodeNotDone && pre.chain.nodeNotDone.some((n) => ch?.done.includes(n))) return false;
  }
  if (pre.pattern) for (const k of Object.keys(pre.pattern) as PatternId[]) if (!inRange(st.patterns[k], pre.pattern[k])) return false;
  if (pre.wagerOpen !== undefined && (st.card?.wager !== null && st.card?.wager !== undefined) !== pre.wagerOpen) return false;
  if (pre.envelopeOpen !== undefined && st.envelopes.some((e) => e.opened && !e.resolved) !== pre.envelopeOpen) return false;
  if (pre.dayOfMonth && !inRange(currentCivil(st).d, pre.dayOfMonth)) return false;
  if (pre.rentShortfall !== undefined && (st.yearStats.rentShortfalls > 0) !== pre.rentShortfall) return false;
  if (pre.meta) {
    if (pre.meta.livesMin !== undefined && meta.legacy.livesCompleted < pre.meta.livesMin) return false;
    if (pre.meta.familiarityMin !== undefined && meta.legacy.familiarity < pre.meta.familiarityMin) return false;
    if (pre.meta.baggageEventId !== undefined || pre.meta.pastFlags !== undefined) return false;   // not carried in MVP
  }
  if (pre.expr !== undefined) return false;                     // jsep expressions are not evaluated by the engine (lint warns)
  return true;
}

/** Specificity = leaf count, `any` leaves count 0.5 (03 §2.2.2); returned ×2 to stay integer (mirrors content-schema). */
export function specificity2(pre: Pre | undefined): number {
  if (!pre) return 0;
  let n = 0;
  for (const [k, v] of Object.entries(pre)) {
    if (v === undefined) continue;
    if (k === 'all' || k === 'none') for (const p of v as Pre[]) n += specificity2(p);
    else if (k === 'any') for (const p of v as Pre[]) n += specificity2(p) >> 1;
    else n += 2;
  }
  return n;
}
