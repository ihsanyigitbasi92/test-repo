/**
 * createLife — initial LifeState for START_LIFE (02 §2.2.1 FTUE start values, D-067 status strip).
 * The 18th-birthday date is drawn from the `names` channel at dayIndex 0 (02 §2.1.2).
 */
import { PATTERN_IDS, FAMILIAR_FACES } from '@motto/content-schema';
import { TUNING } from './tuning.ts';
import { birthdayAfterYears, daysFromCivil, toISO } from './calendar.ts';
import { channelRng } from './rng.ts';
import type { LifeState, MetaState, YearStats, PatternId, Locale, VoiceLevel, StatId } from './types.ts';

export function emptyMeta(): MetaState {
  return { schemaVersion: 1, legacy: { livesCompleted: 0, familiarity: 0, patternRanks: [], seenLives: {}, metaLog: [] } };
}

export function freshYearStats(st: Pick<LifeState, 'stats' | 'money'>): YearStats {
  return {
    startStats: { ...st.stats }, startMoney: st.money.balance, income: 0, spend: 0,
    riskChoices: 0, kindChoices: 0, cringeSpikes: 0, egoCrossed85: false,
    momAccruedBp: 0, rentShortfalls: 0, paydays: 0, valenceSum: 0, shownDays: 0,
  };
}

export function createLife(seed: string, name: string, contentHash: string, opts: { locale?: Locale; voice?: VoiceLevel; fastLife?: boolean } = {}): LifeState {
  const names = channelRng(seed, 0, 'names');
  // 18th birthday: a day in the start year, drawn deterministically; this is the life's calendar origin.
  const startAbs = daysFromCivil({ y: TUNING.calendar.startYear, m: 1, d: 1 }) + names.int(0, 364);
  const startCivil = { ...birthdayAfterYears({ y: TUNING.calendar.startYear, m: 1, d: 1 }, 0) };
  const c = (() => { const d = startAbs; return d; })();
  const start = (() => { const { civilFromDays } = require_civil(); return civilFromDays(c); })();
  const nextBirthdayAbs = daysFromCivil(birthdayAfterYears(start, 1));
  void startCivil;
  const patterns = Object.fromEntries(PATTERN_IDS.map((p) => [p, 0])) as Record<PatternId, number>;
  const stats = { ...TUNING.stats.start } as Record<StatId, number>;
  const money = { balance: TUNING.economy.startMoneyPara, debt: 0 };
  const st: LifeState = {
    schemaVersion: 1, lifeSeed: seed, name, locale: opts.locale ?? 'tr', voice: opts.voice ?? 'normal', contentHash,
    phase: 'idle', speed: 'play', fastLife: opts.fastLife ?? false,
    calendar: { dayIndex: 0, calendarDay: 0, dateISO: toISO(start), hour: 9, age: TUNING.calendar.startAge, startDateISO: toISO(start), nextBirthdayDay: nextBirthdayAbs - startAbs, skippedSinceLast: 0 },
    stats, meters: { ...TUNING.stats.metersStart }, hidden: { ...TUNING.stats.hiddenStart, luck: names.int(-1000, 1000) },
    money,
    status: { job: null, home: { kind: 'momsHouse', rent: TUNING.economy.housing.momsHouse.rent, since: 0 }, partner: null, assets: ['kedi'] },
    npcs: FAMILIAR_FACES.map((role) => ({ role, exists: role !== 'ex' && role !== 'boss', alive: true, affinity: role === 'mom' ? 60 : 20, memories: [] })),
    flags: ['anne_evinde'],
    patterns, wagers: [], wagerLog: { lastDay: -999, thisYear: 0, recentDays: [], total: 0, coachHits: 0 },
    envelopes: [], dueQueue: [], chains: {},
    seen: {}, cooldowns: { self: {}, tags: {} },
    reward: {
      negStreak: 0, beatsSinceLol: 0, wowCount: 0,
      surprise: { sinceLast: 0, sessionCount: 0, total: 0 }, legendary: { sinceLast: 0, sessionCount: 0, total: 0 },
      nearMiss: { count: 0, failCount: 0, sessionCount: 0, lastDayByGoal: {}, bonusApplied: 0 }, pendingBonus: {},
    },
    director: { yearBudget: 0, shownThisYear: 0, sessionDayIndex: 0, expectedSessionDays: TUNING.session.expectedDays, momCall: { pending: false, lastDay: -999, count: 0, highSince: -1 }, documentsThisSession: 0, lastValence: 0 },
    yearStats: freshYearStats({ stats, money }),
    card: null, notebook: [], diagnoses: [], glossary: [], death: null,
    rng: {},
  };
  return st;
}

// Local indirection keeps calendar imports in one place for the start-date derivation.
import { civilFromDays } from './calendar.ts';
function require_civil() { return { civilFromDays }; }
