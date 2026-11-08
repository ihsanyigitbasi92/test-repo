/**
 * Birthday report card (02 §2.2.6, D-061, D-121) and the Roast Report data contract (02 §2.5.2).
 * Every number comes from LifeState counters — nothing is invented ("hafıza uydurulmaz").
 */
import { TUNING } from './tuning';
import { meanAffinity } from './life';
import { PATTERNS, POSITIVE_PATTERNS } from './types';
import type { Grade, LifeState, PatternId, ReportCardData } from './types';

const R = TUNING.report;

/** Points delta → grade: ≥10 A · ≥3 B · ≥−2 C · ≥−9 D · else F. */
export const gradeForDelta = (dPoints: number): Grade => {
  const [a, b, c, d] = R.gradeDelta as [number, number, number, number];
  return dPoints >= a ? 4 : dPoints >= b ? 3 : dPoints >= c ? 2 : dPoints >= d ? 1 : 0;
};

/** Money: net change relative to the year's spend (not income: the rich can have bad years too). */
export function gradeForMoney(netDelta: number, yearlyCost: number): Grade {
  const rPm = Math.trunc((netDelta * 1000) / Math.max(yearlyCost, 1));
  const [a, b, c, d] = R.moneyRatioPm as [number, number, number, number];
  return rPm >= a ? 4 : rPm >= b ? 3 : rPm >= c ? 2 : rPm >= d ? 1 : 0;
}

export const gradeForCourage = (riskChoices: number): Grade => Math.min(4, riskChoices) as Grade;

/** D-121 "Spectacle": Cringe-only; no spikes → B, each spike (single outcome ≥ +8 Cringe) costs one grade. */
export const gradeForSpectacle = (cringeSpikes: number): Grade => (cringeSpikes === 0 ? 3 : Math.max(0, 2 - cringeSpikes)) as Grade;

const pts = (bp: number) => Math.trunc(bp / 100);

function dominant(counts: Partial<Record<PatternId, number>>): PatternId | null {
  let best: PatternId | null = null, n = 0;
  for (const p of PATTERNS) { const c = counts[p] ?? 0; if (c > n) { n = c; best = p; } }
  return best;
}

export function buildReportCard(st: LifeState): ReportCardData {
  const y = st.yearStats;
  const open = st.envelopes.filter((e) => !e.resolved).sort((a, b) => b.weight - a.weight);
  return {
    age: st.calendar.age,
    grades: {
      health: gradeForDelta(pts(st.stats.health - y.startStats.health)),
      money: gradeForMoney(st.money.balance - y.startMoney, y.spend),
      relationships: gradeForDelta(meanAffinity(st.npcs) - y.startAffinity),
      brain: gradeForDelta(pts(st.stats.brain - y.startStats.brain)),
      courage: gradeForCourage(y.riskChoices),
      spectacle: gradeForSpectacle(y.cringeSpikes),
    },
    coachAccuracyYear: { hits: y.wagerHits, total: y.wagers },
    mottoCell: { dominant: dominant(y.patterns), netValence: y.valenceSum > 0 ? 1 : y.valenceSum < 0 ? -1 : 0 },
    envelopeTeaser: open[0]?.teaserKey ?? null,
    decadeReview: (R.decadeAges as number[]).includes(st.calendar.age),
    shownDaysThisYear: st.director.shownThisYear,
  };
}

export interface RoastReport {
  ageAtDeath: number;
  cause: { lineKey: string; channel: 'hazard' | 'scripted'; isAbsurd: boolean };
  numbers: {
    yearsWorked: number; wagersTotal: number; wagersPlayerWon: number; peakMoney: number;
    shownDays: number; calendarDays: number; rentEvents: number; momCalls: number;
  };
  patterns: { id: PatternId; count: number; sharePm: number }[];   // top-3 (gentle: top-2)
  rightMoment: { eventId: string; dayIndex: number; pOddsBp: number } | null;
  lastWord: { pattern: PatternId; count: number } | null;
}

/** Ranked patterns of a life (count desc, then canonical order — deterministic). */
export function rankPatterns(st: LifeState): { id: PatternId; count: number }[] {
  return PATTERNS.map((id) => ({ id, count: st.patterns[id] })).filter((p) => p.count > 0)
    .sort((a, b) => b.count - a.count || PATTERNS.indexOf(a.id) - PATTERNS.indexOf(b.id));
}

export function buildRoast(st: LifeState): RoastReport {
  const total = PATTERNS.reduce((s, p) => s + st.patterns[p], 0);
  const top = rankPatterns(st).slice(0, st.voice === 'gentle' ? TUNING.roast.gentleTopPatterns : TUNING.roast.topPatterns);
  const lost = st.wagers.filter((w) => w.outcome === 'iWasWrong').sort((a, b) => a.pOddsBp - b.pOddsBp || a.dayIndex - b.dayIndex)[0];
  let lastWord: RoastReport['lastWord'] = null;
  for (const p of POSITIVE_PATTERNS) if (st.patterns[p] > 0 && (!lastWord || st.patterns[p] > lastWord.count)) lastWord = { pattern: p, count: st.patterns[p] };
  const cause = st.death?.cause ?? 'unknown';
  return {
    ageAtDeath: st.death?.age ?? st.calendar.age,
    cause: { lineKey: `death.${cause}`, channel: st.death?.channel ?? 'hazard', isAbsurd: cause.endsWith('absurd') },
    numbers: {
      yearsWorked: st.counters.yearsWorked, wagersTotal: st.wagerLog.total, wagersPlayerWon: st.wagerLog.total - st.wagerLog.coachHits,
      peakMoney: st.counters.peakMoney, shownDays: st.counters.shownDays, calendarDays: st.calendar.calendarDay,
      rentEvents: st.counters.rentEvents, momCalls: st.counters.momCalls,
    },
    patterns: top.map((p) => ({ ...p, sharePm: total ? Math.trunc((p.count * 1000) / total) : 0 })),
    rightMoment: lost ? { eventId: lost.eventId, dayIndex: lost.dayIndex, pOddsBp: lost.pOddsBp } : null,
    lastWord,
  };
}
