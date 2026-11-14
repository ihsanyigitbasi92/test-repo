/**
 * The single DayDirector (D-101; 03 §2.3): yearly shown-day budget by age band, gap sampling from the
 * log-normal quantile table, skip summary, and today's event pick in 03 §2.3.5 priority order:
 *   (3) mom call → (4) envelope resolver → (5) chain → (6) forced follow-up → (7) rent / bailout / İcra
 *   → (9) lucky follow-up → Günün Günü (session day ≥ 2) → legendary → pity surprise → salience.
 * Valence guard (03 §2.3.6): while negStreak ≥ 2 no negative event plays — free picks score 0, the mom call
 * waits, and a due negative forced item is postponed by that one shown day (`deferredOnce` records it). The
 * postponing day is never negative, so the streak resets and the item plays next: a forced item is never held
 * back two shown days in a row, and the negative streak stays ≤ 2.
 * Channels: `director` (budget, gap, hour, skip line), `beats` (event pick), `surprise` (pity/legendary),
 * `daily` = the date-seeded stream cyrb128('day:'+localDay+':'+locale+':'+contentHash) (03 §2.3.7).
 */
import type { SkipLineT } from '@motto/content-schema';
import { TUNING, bandFor } from './tuning';
import { gapMultiplierPm } from './tables/index';
import { clamp, drawInt, weightedIndex } from './util';
import { sfc32, type Rng } from './rng';
import { applyBankruptcy, BANKRUPTCY_PENDING } from './cashflow';
import { indexContent } from './content';
import { currentCivil } from './pre';
import { seasonOf } from './calendar';
import { eligible, noveltyPm, salience, salienceCtx, skipLineBlocked } from './salience';
import { catAlive, isEmployed } from './status';
import { rollLegendary, rollSurprise } from './pity';
import { killNpc, lossRole } from './mortality';
import type { ContentBundle, DueItem, Envelope, GameEvent, LifeState, MetaState, SkipSummary } from './types';

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
const earliestDue = (st: LifeState): number | null => {
  const ready = st.dueQueue.filter((d) => notPaused(st, d));        // a grief-paused item must not shrink every gap to 1
  return ready.length ? Math.min(...ready.map((d) => d.day)) : null;
};
/** Sprint 3 grief pause: an item with `minDayIndex` waits until that shown day (drawGap runs after dayIndex++). */
const notPaused = (st: LifeState, d: DueItem): boolean => d.minDayIndex === undefined || st.calendar.dayIndex >= d.minDayIndex;

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
  const pd = st.pendingDeath;                                          // son perde: never skip past the death day
  const untilDeath = pd ? Math.max(1, pd.day - c.calendarDay) : Infinity;
  if (remaining <= 1 || overCap) return Math.min(untilDeath, toBirthday <= maxGap || overCap ? toBirthday : maxGap);
  const meanPm = Math.floor((toBirthday * 1000) / remaining);
  let gap = Math.floor((meanPm * gapMultiplierPm(drawInt(st, 'director', 0, 255)) + 500_000) / 1_000_000);
  gap = clamp(gap, 1, Math.max(1, Math.min(maxGap, toBirthday - (remaining - 1))));
  const due = earliestDue(st);
  if (due !== null && due - c.calendarDay < gap) gap = Math.max(1, due - c.calendarDay);
  if (untilDeath < gap) gap = untilDeath;
  if (d.momCall.pending) gap = 1;
  return gap;
}

/** Skip summary (03 §2.3.3): bucket × context × least-seen, from the `director` channel. */
export function skipSummary(st: LifeState, gap: number, lines: readonly SkipLineT[]): SkipSummary | null {
  if (gap < 2) return null;
  const ctx = new Set<string>(['default']);
  ctx.add(isEmployed(st) ? 'employed' : st.status.job ? 'retired' : 'unemployed');
  ctx.add(catAlive(st) ? 'cat' : 'noCat');                             // sprint 3: content may pin a line to either
  if (st.meters.momPressure >= 5000) ctx.add('momHigh');
  if (st.envelopes.some((e) => !e.resolved)) ctx.add('envelopeOpen');
  const season = seasonOf(currentCivil(st).m);
  if (season === 'winter' || season === 'summer') ctx.add(season);
  const band = bandFor(st.calendar.age).name;
  if (band === 'secondHalf' || band === 'overtime') ctx.add(band);
  const fit = lines.filter((l) => gap >= l.bucket[0] && gap <= l.bucket[1] && l.ctx.every((x) => ctx.has(x) || x === 'default') && !skipLineBlocked(l, st));
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

export interface DayPick {
  event: GameEvent | null; forced: DueItem | null; momCall: boolean; legendary: boolean; surpriseTier: 'nice' | 'great' | null; daily: boolean;
}

function weighted(st: LifeState, events: GameEvent[], score: (e: GameEvent) => number): GameEvent | null {
  const w = events.map((e) => { const s = score(e); return s > 0 ? Math.max(1, Math.floor(s / 1000)) : 0; });
  const i = weightedIndex(st, 'beats', w);
  return i < 0 ? null : events[i]!;
}

/** The envelope a priority-4 item resolves (exact id; legacy items fall back to the resolver id). */
function envelopeOf(st: LifeState, item: DueItem): Envelope | undefined {
  return item.envelopeId !== undefined
    ? st.envelopes.find((e) => e.id === item.envelopeId)
    : st.envelopes.find((e) => !e.resolved && e.resolverEventId === item.eventId);
}

/**
 * Take the first playable forced item (priority, then due day). A due envelope is opened before its resolver's
 * preconditions are checked (L03-11 `envelopeOpen:true`); items whose event vanished or fails are dropped.
 */
function takeForced(st: LifeState, meta: MetaState, content: ContentBundle): { item: DueItem; event: GameEvent } | null {
  const idx = indexContent(content);
  const due = st.dueQueue.filter((d) => d.day <= st.calendar.calendarDay && notPaused(st, d)).sort((a, b) => a.priority - b.priority || a.day - b.day);
  for (const item of due) {
    if (item.priority === 4) { const env = envelopeOf(st, item); if (env) env.opened = true; }
    const ev = idx.byId.get(item.eventId);
    if (!ev || !eligible(ev, st, meta)) { dropDue(st, item); continue; }
    if (ev.valence < 0 && st.reward.negStreak >= 2) { item.deferredOnce = true; continue; }   // try the next item
    return { item, event: ev };
  }
  return null;
}

/**
 * Remove a due item (played or dropped) and settle what it stands for: a priority-4 item resolves exactly its
 * envelope; a `bankruptcy` item applies the İcra reset (on its card — or immediately when it cannot play).
 */
export function dropDue(st: LifeState, item: DueItem, deferLoss = false): void {
  const i = st.dueQueue.indexOf(item);
  if (i >= 0) st.dueQueue.splice(i, 1);
  if (item.priority === 4) { const env = envelopeOf(st, item); if (env) env.resolved = true; }
  if (item.source === 'bankruptcy' && st.flags.includes(BANKRUPTCY_PENDING)) applyBankruptcy(st);
  const lost = lossRole(item);                                         // played or not, the NPC's time has come
  if (lost && !deferLoss) killNpc(st, lost);                          // eventDay kills after building the card
}

/** An event picked freely also settles its own envelope / İcra / bailout due items (no second showing). */
export function settleFreePlay(st: LifeState, eventId: string): void {
  for (const d of st.dueQueue.filter((x) => x.eventId === eventId && (x.priority === 4 || x.priority === 7))) dropDue(st, d);
}

function pickMomCall(st: LifeState, meta: MetaState, content: ContentBundle): GameEvent | null {
  const calls = indexContent(content).bundle.events.filter((e) => e.type === 'call' && e.call?.speaker === 'mom' && eligible(e, st, meta));
  return calls.length ? weighted(st, calls, (e) => noveltyPm(e, st, meta) * 1000) : null;
}

/** Günün Günü stream: identical for everyone on the same local date, locale and content (03 §2.3.7). */
export function dailyRng(st: LifeState, localDay: string, salt = ''): Rng {
  return sfc32(`day:${localDay}:${st.locale}:${st.contentHash}${salt}`);
}

/** Today's shared event, if one is pending: session day ≥ 2, not yet played for this local date, eligible. */
function pickDaily(st: LifeState, meta: MetaState, content: ContentBundle): GameEvent | null {
  const d = st.director.daily;
  if (!d || d.played || st.director.sessionDayIndex < 2) return null;
  const pool = indexContent(content).shared;
  if (!pool.length) return null;
  const ev = pool[dailyRng(st, d.localDay).int(0, pool.length - 1)]!;
  if (!eligible(ev, st, meta) || (ev.valence < 0 && st.reward.negStreak >= 2)) return null;
  d.played = true;
  return ev;
}

/** Today's event (non-birthday day). */
export function pickDay(st: LifeState, meta: MetaState, content: ContentBundle): DayPick {
  const none: DayPick = { event: null, forced: null, momCall: false, legendary: false, surpriseTier: null, daily: false };
  if (st.director.momCall.pending && st.reward.negStreak < 2) {        // (3) mom call; the valence guard binds it too
    st.director.momCall.pending = false;
    const call = pickMomCall(st, meta, content);
    if (call) return { ...none, event: call, momCall: true };
  }
  const forced = takeForced(st, meta, content);                         // (4)–(9)
  if (forced) return { ...none, event: forced.event, forced: forced.item };
  const daily = pickDaily(st, meta, content);
  if (daily) return { ...none, event: daily, daily: true };
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
    const sp = weighted(st, idx.surprise[tier], score(false))
      ?? (tier === 'great' ? weighted(st, idx.surprise.nice, score(false)) : null)
      // sprint 3 (Y2): mid-life had few eligible uncommon/rare positives, so pity sat at hardPity and no surprise came
      // for ~120 shown days; fall back to a positive event this life has not seen yet
      ?? weighted(st, idx.positive, (e) => ((st.seen[e.id] ?? 0) === 0 ? score(false)(e) : 0));
    if (sp) return { ...none, event: sp, surpriseTier: idx.surprise.great.includes(sp) ? 'great' : 'nice' };
  }
  const pick = weighted(st, idx.free, score(false)) ?? weighted(st, idx.free, score(true));
  return { ...none, event: pick };
}
