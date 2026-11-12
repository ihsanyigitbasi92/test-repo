/**
 * NEXT_DAY reducer body (10 §3.1 contract, 03 §2.3.11 planNextDay, D-088 single gap rule):
 * dayIndex+1 → re-derive channels → gap → applyGap (drift + cash flow, ≤ 3 flowLog lines) → obligations
 * (rent card, İcra card) → birthday pulse | today's event card.
 */
import { TUNING, bandFor } from './tuning';
import { queueMilestones } from './milestones';
import { birthdayAfterYears, civilFromDays, parseISO, toISO, daysFromCivil } from './calendar';
import { applyDrift } from './drift';
import { applyBankruptcy, applyCashflow, BANKRUPTCY_PENDING, startAbs } from './cashflow';
import { drawGap, drawYearBudget, dropDue, pickDay, settleFreePlay, skipSummary } from './director';
import { notePlayed } from './pity';
import { rollHazard } from './hazard';
import { buildReportCard, rankPatterns } from './report';
import { freshYearStats } from './life';
import { indexContent } from './content';
import { openEnvelope } from './apply';
import { bailoutCheck } from './bailout';
import { buildEventCard } from './card';
import { drawInt } from './util';
import type { ContentBundle, DayCard, Effect, GapLine, LifeState, MetaState, SkipSummary } from './types';

const RENT_EVENT = 'evt_kira_gunu';
const E = TUNING.economy;

/** Death bookkeeping shared by hazard and scripted channels; writes the meta legacy (02 §2.5.3). */
export function die(st: LifeState, meta: MetaState, cause: string, channel: 'hazard' | 'scripted', out: Effect[]): void {
  st.death = { cause, channel, age: st.calendar.age };
  st.phase = 'dead';
  const lifeNo = meta.legacy.livesCompleted;
  for (const id of Object.keys(st.seen)) if (!id.includes('.')) meta.legacy.seenLives[id] = lifeNo;   // event ids only
  const top = rankPatterns(st).slice(0, 3).map((p) => p.id);
  meta.legacy.patternRanks.push(top);
  meta.legacy.metaLog.push({ lifeSeed: st.lifeSeed, ageAtDeath: st.calendar.age, cause, shownDays: st.counters.shownDays, topPatterns: top });
  meta.legacy.livesCompleted = lifeNo + 1;
  meta.legacy.familiarity++;
  out.push({ kind: 'DEATH', age: st.calendar.age, cause, channel });
}

/** Ensure ≥ 1 open envelope (birthday / session end, 03 §2.8) using a system opener whose resolver exists. */
export function ensureEnvelope(st: LifeState, content: ContentBundle): void {
  if (st.envelopes.some((e) => !e.resolved)) return;
  const idx = indexContent(content);
  const resolver = TUNING.envelope.systemResolvers.find((id) => idx.byId.has(id));
  if (!resolver) return;
  openEnvelope(st, 'sys', { teaserKey: TUNING.envelope.systemTeasers[0]!, dueDays: TUNING.envelope.dueDays, weight: TUNING.envelope.weightDefault, resolverEventId: resolver });
}

/** Pension (02 §2.3): 0.9 × last salary after ≥ 20 working years, else 0.5 ×. */
function retire(st: LifeState): void {
  const job = st.status.job;
  if (!job || st.calendar.age < E.retirementAge || job.title === 'emekli') return;
  const pm = st.counters.yearsWorked >= E.pensionFullYears ? E.pensionPm.full : E.pensionPm.short;
  st.status.job = { title: 'emekli', tier: job.tier, monthly: Math.trunc((job.monthly * pm) / 1000), since: st.calendar.calendarDay };
}

function birthday(st: LifeState, meta: MetaState, content: ContentBundle, base: Omit<DayCard, 'eventId'>, out: Effect[]): void {
  st.calendar.age++;
  if (st.status.job) { st.counters.yearsWorked++; retire(st); }
  const cause = rollHazard(st);                                   // hazard before the report card: the dead get no card
  if (cause) { st.card = { ...base, eventId: 'sys_death', choices: [] }; die(st, meta, cause, 'hazard', out); return; }
  bailoutCheck(st, content);                                      // 02 §2.3.6: the pulse may queue tomorrow's offer
  queueMilestones(st, meta, content);                             // D-157 Hayat Yolu
  const report = buildReportCard(st);
  st.lastReport = report;
  ensureEnvelope(st, content);
  st.envelopes = st.envelopes.filter((e) => !e.resolved);
  st.yearStats = freshYearStats(st);                              // snapshots lifestylePm for the new year
  st.wagerLog.thisYear = 0;
  st.director.shownThisYear = 0;
  st.director.yearBudget = drawYearBudget(st);
  const start = parseISO(st.calendar.startDateISO);
  st.calendar.nextBirthdayDay = daysFromCivil(birthdayAfterYears(start, st.calendar.age - TUNING.calendar.startAge + 1)) - startAbs(st);
  st.card = { ...base, eventId: 'sys_report_card', choices: [] };
  st.phase = 'birthday';
  out.push({ kind: 'SHOW_DAY', card: st.card }, { kind: 'REPORT_CARD', data: report });
}

function eventDay(st: LifeState, meta: MetaState, content: ContentBundle, base: Omit<DayCard, 'eventId'>, out: Effect[]): void {
  const pick = pickDay(st, meta, content);
  if (pick.forced) dropDue(st, pick.forced);
  const ev = pick.event;
  if (!ev) {                                                      // empty pool (tiny content): a quiet day, no choices
    st.counters.quietDays++;
    notePlayed(st, null, false);
    st.card = { ...base, eventId: 'sys_quiet', choices: [] };
    st.phase = 'answered';
    out.push({ kind: 'SHOW_DAY', card: st.card });
    return;
  }
  if (!pick.forced) settleFreePlay(st, ev.id);
  const day = st.calendar.calendarDay;
  st.seen[ev.id] = (st.seen[ev.id] ?? 0) + 1;
  st.cooldowns.self[ev.id] = day;
  for (const t of ev.tags) st.cooldowns.tags[t] = day;
  if (pick.momCall) {                                             // 03 §2.3.1: a call day is outside the yearly budget
    const mc = st.director.momCall, d = st.director;
    mc.count++; mc.lastDay = st.calendar.dayIndex; st.counters.momCalls++;
    d.yearBudget = Math.min(d.yearBudget + 1, bandFor(st.calendar.age).max + TUNING.dayBudget.capAboveMax);
  }
  if (ev.id === RENT_EVENT) st.counters.rentEvents++;
  st.yearStats.valenceSum += ev.valence;
  notePlayed(st, ev, pick.legendary);
  const daily = pick.daily && st.director.daily ? { localDay: st.director.daily.localDay } : undefined;
  st.card = buildEventCard(st, meta, ev, { ...base, legendary: pick.legendary, momCall: pick.momCall, forced: !!pick.forced, surpriseTier: pick.surpriseTier, ...(daily ? { daily } : {}) });
  st.phase = 'day';
  out.push({ kind: 'SHOW_DAY', card: st.card });
  if (st.card.bubbles.length) out.push({ kind: 'SHOW_DIALOG', bubbles: st.card.bubbles, layer: 'dialog' });
}

/** Rent shortfall and İcra become forced day cards for today (02 §2.3.2 / §2.3.4); never silent gap effects. */
function queueObligations(st: LifeState, content: ContentBundle, rentShortfall: boolean): void {
  const idx = indexContent(content), day = st.calendar.calendarDay;
  if (rentShortfall && idx.byId.has(RENT_EVENT) && !st.dueQueue.some((d) => d.eventId === RENT_EVENT))
    st.dueQueue.push({ day, eventId: RENT_EVENT, priority: 7, valence: idx.byId.get(RENT_EVENT)!.valence, deferredOnce: false, source: 'rent' });
  if (!st.flags.includes(BANKRUPTCY_PENDING) || st.dueQueue.some((d) => d.source === 'bankruptcy')) return;
  const icra = idx.byId.get(E.bankruptcy.eventId);
  if (icra) st.dueQueue.push({ day, eventId: icra.id, priority: 7, valence: icra.valence, deferredOnce: false, source: 'bankruptcy' });
  else applyBankruptcy(st);                                       // no İcra card in this bundle → immediate reset
}

/** The NEXT_DAY transition; caller guarantees phase ∈ {idle, answered, birthday}. */
export function nextDay(st: LifeState, meta: MetaState, content: ContentBundle, out: Effect[]): void {
  const c = st.calendar, d = st.director;
  c.dayIndex++;
  st.rng = {};                                                    // D-101: every channel re-derived for the new dayIndex
  const gap = drawGap(st);
  const from = c.calendarDay;
  applyDrift(st, gap);
  const cash = applyCashflow(st, from, from + gap);
  c.calendarDay = from + gap;
  c.skippedSinceLast = gap;
  c.dateISO = toISO(civilFromDays(startAbs(st) + c.calendarDay));
  c.hour = drawInt(st, 'director', TUNING.calendar.eventHourMin, TUNING.calendar.eventHourMax);
  const flowLog: GapLine[] = cash.lines;                          // ≤ 3 lines (D-088)
  queueObligations(st, content, cash.rentShortfall);
  st.counters.shownDays++;
  d.shownThisYear++;
  d.sessionDayIndex++;
  st.yearStats.shownDays++;
  const skip: SkipSummary | null = skipSummary(st, gap, indexContent(content).skipLines);
  const base: Omit<DayCard, 'eventId'> = {
    dayIndex: c.dayIndex, dateISO: c.dateISO, hour: c.hour, skip, flowLog,
    legendary: false, momCall: false, forced: false, surpriseTier: null, bubbles: [], choices: [], wager: null,
  };
  if (c.calendarDay >= c.nextBirthdayDay) birthday(st, meta, content, base, out);
  else eventDay(st, meta, content, base, out);
  if (!d.endSuggested && st.phase !== 'dead' && d.sessionDayIndex * 1000 >= 850 * Math.max(1, d.expectedSessionDays)) {
    d.endSuggested = true;                                        // 03 §2.3.4 session-end heuristic t ≥ 0.85
    out.push({ kind: 'SESSION_END_SUGGESTED' });
  }
}
