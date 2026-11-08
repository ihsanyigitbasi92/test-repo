/**
 * createLife — initial LifeState for START_LIFE (02 §2.2.1 FTUE start values, D-067 status strip).
 * The 18th-birthday date is drawn from the `names` channel at dayIndex 0 (02 §2.1.2); day 0 is the Client File day.
 */
import { TUNING } from './tuning';
import { birthdayAfterYears, civilFromDays, daysFromCivil, toISO } from './calendar';
import { channelRng } from './rng';
import { lifestylePm } from './cashflow';
import { FACES, PATTERNS } from './types';
import type { LifeState, MetaState, YearStats, PatternId, Locale, VoiceLevel, StatId, LifeCounters, Npc } from './types';

export function emptyMeta(): MetaState {
  return { schemaVersion: 1, legacy: { livesCompleted: 0, familiarity: 0, patternRanks: [], seenLives: {}, metaLog: [] } };
}

/** Mean affinity of living, existing NPCs (02 §2.2.2 `ilişkiOrt`), integer points. */
export function meanAffinity(npcs: readonly Npc[]): number {
  let s = 0, n = 0;
  for (const x of npcs) if (x.exists && x.alive) { s += x.affinity; n++; }
  return n ? Math.floor(s / n) : 0;
}

/** New year's counters; snapshots the lifestyle spend share from the patterns so far (02 §2.3.3). */
export function freshYearStats(st: Pick<LifeState, 'stats' | 'money' | 'npcs' | 'patterns'>): YearStats {
  return {
    startStats: { ...st.stats }, startMoney: st.money.balance, startAffinity: meanAffinity(st.npcs), income: 0, spend: 0,
    riskChoices: 0, cringeSpikes: 0, egoCrossed85: false,
    momAccruedBp: 0, rentShortfalls: 0, paydays: 0, valenceSum: 0, shownDays: 0, wagers: 0, wagerHits: 0, patterns: {}, lifestylePm: lifestylePm(st),
  };
}

const zeroCounters = (): LifeCounters => ({
  shownDays: 0, yearsWorked: 0, peakMoney: TUNING.economy.startMoneyPara, rentEvents: 0, momCalls: 0,
  surprises: 0, legendaries: 0, maxNegStreak: 0, quietDays: 0, bailouts: 0, bankruptcies: 0,
});

const pity = () => ({ sinceLast: 0, sessionCount: 0, total: 0, lastDay: -999 });

export interface LifeOpts { locale?: Locale; voice?: VoiceLevel; fastLife?: boolean }

export function createLife(seed: string, name: string, contentHash: string, opts: LifeOpts = {}): LifeState {
  const names = channelRng(seed, 0, 'names');
  const startAbs = daysFromCivil({ y: TUNING.calendar.startYear, m: 1, d: 1 }) + names.int(0, 364);
  const start = civilFromDays(startAbs);
  const nextBirthdayDay = daysFromCivil(birthdayAfterYears(start, 1)) - startAbs;
  const patterns = Object.fromEntries(PATTERNS.map((p) => [p, 0])) as Record<PatternId, number>;
  const stats = { ...TUNING.stats.start } as Record<StatId, number>;
  const money = { balance: TUNING.economy.startMoneyPara, debt: 0 };
  const npcs: Npc[] = FACES.map((role) => ({ role, exists: role !== 'ex' && role !== 'boss', alive: true, affinity: role === 'mom' ? 60 : 20, memories: [] }));
  const iso = toISO(start);
  const st: LifeState = {
    schemaVersion: 1, lifeSeed: seed, name, locale: opts.locale ?? 'tr', voice: opts.voice ?? 'normal', contentHash,
    phase: 'idle', speed: 'play', fastLife: opts.fastLife ?? false,
    calendar: { dayIndex: 0, calendarDay: 0, dateISO: iso, hour: 9, age: TUNING.calendar.startAge, startDateISO: iso, nextBirthdayDay, skippedSinceLast: 0 },
    stats, meters: { ...TUNING.stats.metersStart }, hidden: { ...TUNING.stats.hiddenStart, luck: names.int(-1000, 1000) },
    money,
    status: { job: null, home: { kind: 'momsHouse', rent: TUNING.economy.housing.momsHouse.rent, since: 0 }, partner: null, assets: ['kedi'] },
    npcs,
    flags: ['anne_evinde', 'is_ariyor'],
    patterns, wagers: [], wagerLog: { lastDay: -999, thisYear: 0, recentDays: [], total: 0, coachHits: 0 },
    envelopes: [], dueQueue: [], chains: {},
    seen: {}, cooldowns: { self: {}, tags: {} },
    reward: {
      negStreak: 0, beatsSinceLol: 0, wowCount: 0, surprise: pity(), legendary: pity(),
      nearMiss: { count: 0, failCount: 0, sessionCount: 0, lastDayByGoal: {}, bonusApplied: 0 }, pendingBonus: {},
    },
    director: {
      yearBudget: 0, shownThisYear: 0, sessionDayIndex: 0, expectedSessionDays: TUNING.session.expectedDays,
      momCall: { pending: false, lastDay: -999, count: 0, highSince: -1 }, lastValence: 0,
      recentSessions: [], endSuggested: false, daily: null,
    },
    yearStats: freshYearStats({ stats, money, npcs, patterns }),
    counters: zeroCounters(),
    card: null, lastReport: null, notebook: [], diagnoses: [], glossary: [], death: null,
    rng: {},
  };
  return st;
}
