/**
 * NEXT_DAY reducer body (10 §3.1 contract, 03 §2.3.11 planNextDay, D-088 single gap rule):
 * dayIndex+1 → re-derive channels → gap → applyGap (drift + cash flow, ≤ 3 flowLog lines) → obligations
 * (rent card, İcra card) → birthday pulse | today's event card.
 */
import { TUNING, bandFor } from './tuning';
import { queueMilestones, careerRaise } from './milestones';
import { birthdayAfterYears, civilFromDays, parseISO, toISO, daysFromCivil } from './calendar';
import { applyBankruptcy, applyCashflow, bankruptcyAllowed, BANKRUPTCY_PENDING, startAbs } from './cashflow';
import { eligible } from './salience';
import { drawGap, drawYearBudget, dropDue, pickDay, settleFreePlay, skipSummary } from './director';
import { notePlayed } from './pity';
import { rollHazard } from './hazard';
import { ageNpcs, deferDeath, killNpc, lossRole } from './mortality';
import { buildReportCard, pickRitual, rankPatterns } from './report';
import { freshYearStats } from './life';
import { indexContent } from './content';
import { bailoutCheck } from './bailout';
import { buildEventCard } from './card';
import { addFlag, drawChanceBp, drawInt, removeFlag } from './util';
import { applyDrift, birthdayPressure } from './drift';
import { openEnvelope, setHome } from './apply';
import { isEmployed, isRetired, RETIRED_TITLE } from './status';
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

/**
 * Retirement (sprint 3, P1-3): from retirement.minAge each birthday rolls chanceBp (certain at maxAge). The pension is
 * pm × the last salary (full after fullYears worked); the job becomes 'emekli', the boss leaves, the 'emekli' flag is set.
 */
function retire(st: LifeState): void {
  const R = E.retirement, job = st.status.job;
  if (!job || isRetired(job) || st.calendar.age < R.minAge) return;
  if (st.calendar.age < R.maxAge && !drawChanceBp(st, 'director', R.chanceBp)) return;
  const pm = st.counters.yearsWorked >= R.fullYears ? R.pensionPm.full : R.pensionPm.short;
  st.status.job = { title: RETIRED_TITLE, tier: job.tier, monthly: pensionFor(st, job.monthly, pm), since: st.calendar.calendarDay };
  addFlag(st, R.flag);
  const boss = st.npcs.find((n) => n.role === 'boss');
  if (boss) boss.exists = false;
}

/**
 * Old-age sprint: pm × max(last salary, peakRefPm × the best salary ever paid), never below minPensionPara; a renter's pension also covers the rent plus
 * renterCoverPara (capped at the reference salary, so a pension never out-earns the career) — a short career no longer
 * retires straight into a rent deficit.
 */
export function pensionFor(st: LifeState, lastMonthly: number, pm: number): number {
  const R = E.retirement, home = st.status.home;
  const ref = Math.max(lastMonthly, Math.trunc(((st.counters.peakMonthly ?? 0) * R.peakRefPm) / 1000));
  let p = Math.max(Math.trunc((ref * pm) / 1000), R.minPensionPara);
  if ((E.rentCard.kinds as string[]).includes(home.kind)) p = Math.max(p, Math.min(home.rent + R.renterCoverPara, ref));
  return p;
}

/**
 * Old-age sprint: a jobless elder is never left without income. From retirement.minAge someone with at least
 * earlyMinYears worked files for the pension (peak-based, as above); otherwise at socialAge a social old-age pension
 * (socialPensionPara, flag socialFlag) starts.
 */
function pensionForJobless(st: LifeState): void {
  const R = E.retirement, age = st.calendar.age;
  if (st.status.job || age < R.minAge) return;
  if (st.counters.yearsWorked >= R.earlyMinYears) {
    const pm = st.counters.yearsWorked >= R.fullYears ? R.pensionPm.full : R.pensionPm.short;
    st.status.job = { title: RETIRED_TITLE, tier: 0, monthly: pensionFor(st, 0, pm), since: st.calendar.calendarDay };
  } else if (age >= R.socialAge) {
    st.status.job = { title: RETIRED_TITLE, tier: 0, monthly: R.socialPensionPara, since: st.calendar.calendarDay };
    addFlag(st, R.socialFlag);
  } else return;
  addFlag(st, R.flag); removeFlag(st, 'is_ariyor');
}

/** Sprint 3: a mortgage ends after economy.mortgage.termYears — the home becomes owned (upkeep only). */
function payOffMortgage(st: LifeState): void {
  const h = st.status.home;
  if (h.kind === 'mortgage' && st.calendar.calendarDay - h.since >= E.mortgage.termYears * 365) { setHome(st, 'owned'); addFlag(st, 'ev_sahibi'); }
}

function birthday(st: LifeState, meta: MetaState, content: ContentBundle, base: Omit<DayCard, 'eventId'>, out: Effect[]): void {
  st.calendar.age++;
  if (isEmployed(st)) { st.counters.yearsWorked++; retire(st); }   // a retiree's years are not "years worked"
  else pensionForJobless(st);
  payOffMortgage(st);
  birthdayPressure(st);                                           // sprint 3: mid-life Anne Baskısı / Cringe pulses
  const start = parseISO(st.calendar.startDateISO);
  st.calendar.nextBirthdayDay = daysFromCivil(birthdayAfterYears(start, st.calendar.age - TUNING.calendar.startAge + 1)) - startAbs(st);   // before the die: son perde needs the year's end
  const cause = st.pendingDeath ? null : rollHazard(st);         // hazard before the report card: the dead get no card
  if (cause && !deferDeath(st, meta, content, cause)) { st.card = { ...base, eventId: 'sys_death', choices: [] }; die(st, meta, cause, 'hazard', out); return; }
  ageNpcs(st, meta, content);                                     // NPC lifespans (npcLife): may queue a loss card
  bailoutCheck(st, content);                                      // 02 §2.3.6: the pulse may queue tomorrow's offer
  queueMilestones(st, meta, content);                             // D-157 Hayat Yolu
  careerRaise(st);                                                // D-159 career ladder
  const report = buildReportCard(st);
  pickRitual(st, report);                                         // cosmetic channel: no gameplay stream moves
  st.lastReport = report;
  ensureEnvelope(st, content);
  st.envelopes = st.envelopes.filter((e) => !e.resolved);
  st.yearStats = freshYearStats(st);                              // snapshots lifestylePm for the new year
  st.wagerLog.thisYear = 0;
  st.director.shownThisYear = 0;
  st.director.yearBudget = drawYearBudget(st);
  st.card = { ...base, eventId: 'sys_report_card', choices: [] };
  st.phase = 'birthday';
  out.push({ kind: 'SHOW_DAY', card: st.card }, { kind: 'REPORT_CARD', data: report });
}

function eventDay(st: LifeState, meta: MetaState, content: ContentBundle, base: Omit<DayCard, 'eventId'>, out: Effect[]): void {
  const pick = pickDay(st, meta, content);
  if (pick.forced) dropDue(st, pick.forced, true);
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
  notePlayed(st, ev, pick.legendary, pick.surpriseTier !== null);
  const daily = pick.daily && st.director.daily ? { localDay: st.director.daily.localDay } : undefined;
  st.card = buildEventCard(st, meta, ev, { ...base, legendary: pick.legendary, momCall: pick.momCall, forced: !!pick.forced, surpriseTier: pick.surpriseTier, ...(daily ? { daily } : {}) });
  const lost = lossRole(pick.forced);                             // the loss card is the NPC's last scene
  if (lost) killNpc(st, lost);
  st.phase = 'day';
  out.push({ kind: 'SHOW_DAY', card: st.card });
  if (st.card.bubbles.length) out.push({ kind: 'SHOW_DIALOG', bubbles: st.card.bubbles, layer: 'dialog' });
}

/**
 * Old-age sprint (elderCare): a retiree / jobless elder in debt gets one gentle, forced help card — move in with
 * the grown child, downsize, or the municipal support desk (first eligible in tuning order) — at most once per
 * minGapDays. The help itself (home, money, flags) lives in the events; no event eligible → nothing happens.
 */
function elderCareCheck(st: LifeState, meta: MetaState, content: ContentBundle): void {
  const C = E.elderCare, day = st.calendar.calendarDay;
  if (st.dueQueue.some((d) => d.source === 'elderCare')) return;
  removeFlag(st, C.flag);                                         // the help events need it: forced-only, never a free pick
  if (st.calendar.age < C.fromAge || isEmployed(st) || st.money.balance >= C.triggerPara) return;
  if (C.events.some((id) => st.cooldowns.self[id] !== undefined && day - st.cooldowns.self[id]! < C.minGapDays)) return;
  const idx = indexContent(content);
  addFlag(st, C.flag);
  for (const id of C.events) {
    const ev = idx.byId.get(id);
    if (!ev || !eligible(ev, st, meta)) continue;
    st.dueQueue.push({ day, eventId: id, priority: 7, valence: ev.valence, deferredOnce: false, source: 'elderCare' });
    return;
  }
  removeFlag(st, C.flag);
}

/** Rent shortfall and İcra become forced day cards for today (02 §2.3.2 / §2.3.4); never silent gap effects. */
function queueObligations(st: LifeState, meta: MetaState, content: ContentBundle, rentShortfall: boolean): void {
  const idx = indexContent(content), day = st.calendar.calendarDay;
  const lastRent = st.cooldowns.self[RENT_EVENT];
  const rentCardOk = lastRent === undefined || day - lastRent >= E.rentCard.minGapDays;   // D-159: no rent-card loop
  if (rentShortfall && rentCardOk && idx.byId.has(RENT_EVENT) && !st.dueQueue.some((d) => d.eventId === RENT_EVENT))
    st.dueQueue.push({ day, eventId: RENT_EVENT, priority: 7, valence: idx.byId.get(RENT_EVENT)!.valence, deferredOnce: false, source: 'rent' });
  elderCareCheck(st, meta, content);
  if (!st.flags.includes(BANKRUPTCY_PENDING) || st.dueQueue.some((d) => d.source === 'bankruptcy')) return;
  if (!bankruptcyAllowed(st)) { removeFlag(st, BANKRUPTCY_PENDING); return; }   // old-age sprint: no İcra loop
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
  queueObligations(st, meta, content, cash.rentShortfall);
  st.counters.shownDays++;
  d.shownThisYear++;
  d.sessionDayIndex++;
  st.yearStats.shownDays++;
  const skip: SkipSummary | null = skipSummary(st, gap, indexContent(content).skipLines);
  const base: Omit<DayCard, 'eventId'> = {
    dayIndex: c.dayIndex, dateISO: c.dateISO, hour: c.hour, skip, flowLog,
    legendary: false, momCall: false, forced: false, surpriseTier: null, bubbles: [], choices: [], wager: null,
  };
  const pd = st.pendingDeath;
  if (pd && c.calendarDay >= pd.day) {                            // son perde: the deferred hazard death lands today
    st.pendingDeath = null;
    st.card = { ...base, eventId: 'sys_death', choices: [] };
    die(st, meta, pd.cause, 'hazard', out);
  } else if (c.calendarDay >= c.nextBirthdayDay) birthday(st, meta, content, base, out);
  else eventDay(st, meta, content, base, out);
  if (!d.endSuggested && st.phase !== 'dead' && d.sessionDayIndex * 1000 >= 850 * Math.max(1, d.expectedSessionDays)) {
    d.endSuggested = true;                                        // 03 §2.3.4 session-end heuristic t ≥ 0.85
    out.push({ kind: 'SESSION_END_SUGGESTED' });
  }
}
