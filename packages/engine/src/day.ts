/**
 * NEXT_DAY reducer body (10 §3.1 contract, 03 §2.3.11 planNextDay, D-088 single gap rule):
 * dayIndex+1 → re-derive channels → gap → applyGap (drift + cash flow) → birthday pulse | today's event card.
 */
import { TUNING } from './tuning';
import { birthdayAfterYears, civilFromDays, parseISO, toISO, daysFromCivil } from './calendar';
import { applyDrift } from './drift';
import { applyCashflow, maybeMomLoan, startAbs } from './cashflow';
import { drawGap, drawYearBudget, dropDue, pickDay, skipSummary } from './director';
import { notePlayed } from './pity';
import { rollHazard } from './hazard';
import { buildReportCard, rankPatterns } from './report';
import { freshYearStats } from './life';
import { evalPre } from './pre';
import { indexContent, keyChoice, keyDialog } from './content';
import { screenWager } from './wager';
import { openEnvelope } from './apply';
import { drawInt } from './util';
import type { Bubble, CardChoice, ContentBundle, DayCard, Effect, GameEvent, GapLine, LifeState, MetaState, SkipSummary } from './types';

const RENT_EVENT = 'evt_kira_gunu';

/** Death bookkeeping shared by hazard and scripted channels; writes the meta legacy (02 §2.5.3). */
export function die(st: LifeState, meta: MetaState, cause: string, channel: 'hazard' | 'scripted', out: Effect[]): void {
  st.death = { cause, channel, age: st.calendar.age };
  st.phase = 'dead';
  const lifeNo = meta.legacy.livesCompleted;
  for (const id of Object.keys(st.seen)) if (!id.startsWith('skip.')) meta.legacy.seenLives[id] = lifeNo;
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

function birthday(st: LifeState, meta: MetaState, content: ContentBundle, base: Omit<DayCard, 'eventId'>, out: Effect[]): void {
  st.calendar.age++;
  if (st.status.job) {
    st.counters.yearsWorked++;
    if (st.calendar.age >= TUNING.economy.retirementAge && st.status.job.title !== 'emekli')
      st.status.job = { title: 'emekli', tier: st.status.job.tier, monthly: Math.trunc((st.status.job.monthly * TUNING.economy.pensionPm) / 1000), since: st.calendar.calendarDay };
  }
  const cause = rollHazard(st);                                   // hazard before the report card: the dead get no card
  if (cause) { st.card = { ...base, eventId: 'sys_death', choices: [] }; die(st, meta, cause, 'hazard', out); return; }
  const report = buildReportCard(st);
  st.lastReport = report;
  ensureEnvelope(st, content);
  st.envelopes = st.envelopes.filter((e) => !e.resolved);
  st.yearStats = freshYearStats(st);
  st.wagerLog.thisYear = 0;
  st.director.shownThisYear = 0;
  st.director.yearBudget = drawYearBudget(st);
  const start = parseISO(st.calendar.startDateISO);
  st.calendar.nextBirthdayDay = daysFromCivil(birthdayAfterYears(start, st.calendar.age - TUNING.calendar.startAge + 1)) - startAbs(st);
  st.card = { ...base, eventId: 'sys_report_card', choices: [] };
  st.phase = 'birthday';
  out.push({ kind: 'SHOW_DAY', card: st.card }, { kind: 'REPORT_CARD', data: report });
}

function buildEventCard(st: LifeState, meta: MetaState, ev: GameEvent, base: Omit<DayCard, 'eventId'>): DayCard {
  const bubbles: Bubble[] = [];
  (ev.dialog ?? []).forEach((d, i) => {
    if (d.when && !evalPre(d.when, st, meta)) return;
    bubbles.push({ speaker: d.speaker, textKey: keyDialog(ev, i), avatar: d.avatar, delayMs: d.delayMs ?? 0 });
  });
  let choices: CardChoice[] = ev.choices.map((c) => ({
    id: c.id, textKey: keyChoice(ev, c.id), locked: c.requires ? !evalPre(c.requires, st, meta) : false, pattern: c.pattern, swipe: c.swipe,
  }));
  if (choices.every((c) => c.locked)) choices = choices.map((c) => ({ ...c, locked: false }));
  const wager = screenWager(ev, st);
  return { ...base, eventId: ev.id, bubbles, choices, wager: wager && !choices.find((c) => c.id === wager.choiceId)?.locked ? wager : null };
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
  const day = st.calendar.calendarDay;
  st.seen[ev.id] = (st.seen[ev.id] ?? 0) + 1;
  st.cooldowns.self[ev.id] = day;
  for (const t of ev.tags) st.cooldowns.tags[t] = day;
  if (pick.momCall) { const mc = st.director.momCall; mc.count++; mc.lastDay = st.calendar.dayIndex; st.counters.momCalls++; }
  if (ev.id === RENT_EVENT) st.counters.rentEvents++;
  st.yearStats.valenceSum += ev.valence;
  notePlayed(st, ev, pick.legendary);
  st.card = { ...buildEventCard(st, meta, ev, { ...base, legendary: pick.legendary, momCall: pick.momCall, forced: !!pick.forced, surpriseTier: pick.surpriseTier }) };
  st.phase = 'day';
  out.push({ kind: 'SHOW_DAY', card: st.card });
  if (st.card.bubbles.length) out.push({ kind: 'SHOW_DIALOG', bubbles: st.card.bubbles, layer: 'dialog' });
}

/** The NEXT_DAY transition; caller guarantees phase ∈ {idle, answered, birthday}. */
export function nextDay(st: LifeState, meta: MetaState, content: ContentBundle, out: Effect[]): void {
  const c = st.calendar;
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
  const flowLog: GapLine[] = [...cash.lines];
  const loan = new Map();
  if (maybeMomLoan(st, loan)) flowLog.push({ kind: 'momLoan', para: loan.get('momLoan') ?? 0 });
  if (cash.rentShortfall && indexContent(content).byId.has(RENT_EVENT) && !st.dueQueue.some((d) => d.eventId === RENT_EVENT))
    st.dueQueue.push({ day: c.calendarDay, eventId: RENT_EVENT, priority: 7, valence: -1, deferredOnce: false, source: 'rent' });
  st.counters.shownDays++;
  st.director.shownThisYear++;
  st.director.sessionDayIndex++;
  st.yearStats.shownDays++;
  const skip: SkipSummary | null = skipSummary(st, gap, indexContent(content).skipLines);
  const base: Omit<DayCard, 'eventId'> = {
    dayIndex: c.dayIndex, dateISO: c.dateISO, hour: c.hour, skip, flowLog,
    legendary: false, momCall: false, forced: false, surpriseTier: null, bubbles: [], choices: [], wager: null,
  };
  if (c.calendarDay >= c.nextBirthdayDay) birthday(st, meta, content, base, out);
  else eventDay(st, meta, content, base, out);
}
