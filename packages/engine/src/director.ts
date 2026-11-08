/**
 * The single DayDirector (D-101; 03 §2.3): yearly shown-day budget by age band, gap sampling from the
 * log-normal quantile table, skip summary, and today's event pick:
 *   forced dueQueue (valence-guarded, ≤ 1 deferral) → mom call → legendary → pity surprise → salience.
 * Channels: `director` (budget, gap, hour, skip line), `beats` (event pick), `surprise` (pity/legendary).
 */
import type { SkipLineT } from '@motto/content-schema';
import { TUNING, bandFor } from './tuning';
import { gapMultiplierPm } from './tables/index';
import { clamp, drawInt, weightedIndex } from './util';
import { indexContent } from './content';
import { currentCivil } from './pre';
import { seasonOf } from './calendar';
import { eligible, noveltyPm, salience, salienceCtx } from './salience';
import { rollLegendary, rollSurprise } from './pity';
import type { ContentBundle, DueItem, GameEvent, LifeState, MetaState, SkipSummary } from './types';

const DB = TUNING.dayBudget;

/** Shown days for the coming year (birthday card included). fastLife → band minimum. */
export function drawYearBudget(st: LifeState): number {
  const b = bandFor(st.calendar.age);
  let n = st.fastLife ? b.min : drawInt(st, 'director', b.min, b.max);
  if (st.hidden.stress > DB.stressBonusAboveBp) n++;
  if (Object.keys(st.chains).length > 0 && st.dueQueue.some((d) => d.priority === 5)) n += DB.chainBonus;
  return Math.min(n, b.max + DB.capAboveMax);
}

/** Earliest due calendar day in the forced queue, if any. */
const earliestDue = (st: LifeState): number | null => (st.dueQueue.length ? Math.min(...st.dueQueue.map((d) => d.day)) : null);

/**
 * Calendar days until the next shown day (03 §2.3.2). Self-correcting: mean = days-to-birthday / remaining budget;
 * at least one day is kept per remaining shown day so the birthday is never reached early; capped by the band's
 * max gap (a cap overrun adds one shown day, bounded by band max + capAboveMax).
 */
export function drawGap(st: LifeState): number {
  const c = st.calendar, d = st.director;
  const toBirthday = c.nextBirthdayDay - c.calendarDay;               // ≥ 1
  const remaining = Math.max(1, d.yearBudget - d.shownThisYear);       // birthday included
  const maxGap = bandFor(c.age).maxGap;
  const overCap = d.shownThisYear >= bandFor(c.age).max + DB.capAboveMax - 1;
  if (remaining <= 1 || overCap) return toBirthday <= maxGap || overCap ? toBirthday : maxGap;
  const meanPm = Math.floor((toBirthday * 1000) / remaining);
  let gap = Math.floor((meanPm * gapMultiplierPm(drawInt(st, 'director', 0, 255)) + 500_000) / 1_000_000);
  gap = clamp(gap, 1, Math.max(1, Math.min(maxGap, toBirthday - (remaining - 1))));
  const due = earliestDue(st);
  if (due !== null && due - c.calendarDay < gap) gap = Math.max(1, due - c.calendarDay);
  if (d.momCall.pending) gap = 1;
  return gap;
}

/** Skip summary (03 §2.3.3): bucket × context × least-seen, from the `director` channel. */
export function skipSummary(st: LifeState, gap: number, lines: readonly SkipLineT[]): SkipSummary | null {
  if (gap < 2) return null;
  const ctx = new Set<string>(['default']);
  ctx.add(st.status.job ? 'employed' : 'unemployed');
  if (st.meters.momPressure >= 5000) ctx.add('momHigh');
  if (st.envelopes.some((e) => !e.resolved)) ctx.add('envelopeOpen');
  const season = seasonOf(currentCivil(st).m);
  if (season === 'winter' || season === 'summer') ctx.add(season);
  const band = bandFor(st.calendar.age).name;
  if (band === 'secondHalf' || band === 'overtime') ctx.add(band);
  const fit = lines.filter((l) => gap >= l.bucket[0] && gap <= l.bucket[1] && l.ctx.every((x) => ctx.has(x) || x === 'default'));
  if (!fit.length) return { days: gap, key: 'skip.generic', params: { days: gap } };
  const minSeen = Math.min(...fit.map((l) => st.seen[`skip.${l.id}`] ?? 0));
  const least = fit.filter((l) => (st.seen[`skip.${l.id}`] ?? 0) === minSeen);
  const line = least[drawInt(st, 'director', 0, least.length - 1)]!;
  st.seen[`skip.${line.id}`] = minSeen + 1;
  const params: Record<string, number> = { days: gap };
  if (line.number === 'days') params.n = gap;
  else if (line.number === 'momCallsSinceLast') params.n = st.director.momCall.count;
  return { days: gap, key: `skip.${line.id}`, params };
}

export interface DayPick { event: GameEvent | null; forced: DueItem | null; momCall: boolean; legendary: boolean; surpriseTier: 'nice' | 'great' | null }

function weighted(st: LifeState, events: GameEvent[], score: (e: GameEvent) => number): GameEvent | null {
  const w = events.map((e) => { const s = score(e); return s > 0 ? Math.max(1, Math.floor(s / 1000)) : 0; });
  const i = weightedIndex(st, 'beats', w);
  return i < 0 ? null : events[i]!;
}

/** Take the first playable forced item; drops items whose event vanished or whose preconditions fail. */
function takeForced(st: LifeState, meta: MetaState, content: ContentBundle): { item: DueItem; event: GameEvent } | null {
  const idx = indexContent(content);
  const due = st.dueQueue.filter((d) => d.day <= st.calendar.calendarDay).sort((a, b) => a.priority - b.priority || a.day - b.day);
  for (const item of due) {
    const ev = idx.byId.get(item.eventId);
    if (!ev || !evalForced(ev, st, meta)) { dropDue(st, item); continue; }
    if (st.reward.negStreak >= 2 && ev.valence < 0) {
      if (!item.deferredOnce) { item.deferredOnce = true; return null; }     // one deferral, then it plays
    }
    return { item, event: ev };
  }
  return null;
}

/** Forced items ignore cooldowns and salience but still honour preconditions and per-life caps. */
const evalForced = (ev: GameEvent, st: LifeState, meta: MetaState): boolean => eligible(ev, st, meta);

export function dropDue(st: LifeState, item: DueItem): void {
  const i = st.dueQueue.indexOf(item);
  if (i >= 0) st.dueQueue.splice(i, 1);
  if (item.priority === 4) for (const e of st.envelopes) if (e.resolverEventId === item.eventId && !e.resolved) { e.resolved = true; break; }
}

function pickMomCall(st: LifeState, meta: MetaState, content: ContentBundle): GameEvent | null {
  const calls = indexContent(content).bundle.events.filter((e) => e.type === 'call' && e.call?.speaker === 'mom' && eligible(e, st, meta));
  return calls.length ? weighted(st, calls, (e) => noveltyPm(e, st, meta) * 1000) : null;
}

/** Today's event (non-birthday day). */
export function pickDay(st: LifeState, meta: MetaState, content: ContentBundle): DayPick {
  const none: DayPick = { event: null, forced: null, momCall: false, legendary: false, surpriseTier: null };
  const forced = takeForced(st, meta, content);
  if (forced) return { ...none, event: forced.event, forced: forced.item };
  if (st.director.momCall.pending && st.reward.negStreak < 2) {        // valence guard binds the call too (03 §2.3.5)
    st.director.momCall.pending = false;
    const call = pickMomCall(st, meta, content);
    if (call) return { ...none, event: call, momCall: true };
  }
  const idx = indexContent(content);
  if (rollLegendary(st)) {
    const leg = weighted(st, idx.legendary.filter((e) => eligible(e, st, meta)), (e) => noveltyPm(e, st, meta) * 1000);
    if (leg) return { ...none, event: leg, legendary: true };
  }
  const tier = rollSurprise(st);
  // salience first (cheap gates: cooldown, valence guard), preconditions only for live candidates
  const ctx = salienceCtx(st);
  const score = (ignoreRecency: boolean) => (e: GameEvent) => {
    const s = salience(e, st, meta, ignoreRecency, ctx);
    return s > 0 && eligible(e, st, meta) ? s : 0;
  };
  if (tier) {
    const sp = weighted(st, idx.surprise[tier], score(false));
    if (sp) return { ...none, event: sp, surpriseTier: tier };
  }
  const pick = weighted(st, idx.free, score(false)) ?? weighted(st, idx.free, score(true));
  return { ...none, event: pick };
}
