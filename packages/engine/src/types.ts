/**
 * Engine state, actions and effects (10 §2.3.2/§2.3.3 + §3.1, revised by D-061/066/067/088/099/101).
 * Units (D-098): stats/meters/stress are integer basis points 0..10000 (100 bp = 1 point on the 0–100 scale);
 * luck is bp in -5000..5000 (= -50..50); money is integer Para (1 Birim = 1000 Para).
 * Everything is a plain JSON-serialisable value: `JSON.stringify(state)` is the replay/compare key.
 */
import type { GameEvent, PatternId, Locale, VoiceLevel, Housing, Season, SkipLineT } from '@motto/content-schema';

export type { GameEvent, PatternId, Locale, VoiceLevel, Housing, Season };
export type StatId = 'health' | 'joy' | 'brain' | 'charm';
export type MeterId = 'ego' | 'cringe' | 'momPressure';
export type HiddenId = 'luck' | 'stress';
export type Speed = 'pause' | 'play' | 'fast';
export type Phase = 'idle' | 'day' | 'answered' | 'birthday' | 'dead' | 'ended';

export interface Calendar {
  dayIndex: number;          // shown-day counter (0 = Client File day); seeds/pity/cooldowns run on this
  calendarDay: number;       // calendar days since the 18th birthday (day 0)
  dateISO: string;           // 'YYYY-MM-DD' (cosmetic; never bound to the real clock — D-050)
  hour: number;              // event hour of the shown day (D-088 eventHour)
  age: number;
  startDateISO: string;      // 18th birthday
  nextBirthdayDay: number;   // calendarDay of the next birthday
  skippedSinceLast: number;  // gap that preceded this shown day
}

export interface Job { title: string; tier: number; monthly: number; since: number }
export interface Home { kind: Housing; rent: number; since: number }
export interface Status {                   // D-067 permanent "Status strip"
  job: Job | null;
  home: Home;
  partner: { npc: string; since: number } | null;
  assets: string[];
}

export interface Npc { role: string; exists: boolean; alive: boolean; affinity: number; memories: string[] }

export interface WagerEntry {
  id: string; dayIndex: number; eventId: string; choiceId: string;
  prediction: 'fail' | 'succeed'; pOddsBp: number;
  outcome?: 'calledIt' | 'iWasWrong'; stampVariant?: number;
}
export interface WagerLog { lastDay: number; thisYear: number; recentDays: number[]; total: number; coachHits: number }

export interface Envelope {
  id: string; createdDay: number; dueDay: number; teaserKey: string; weight: number;
  sourceEventId: string; resolverEventId: string; opened: boolean; resolved: boolean;
}

export type DuePriority = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;   // 03 §2.3.5 classes
export interface DueItem { day: number; eventId: string; priority: DuePriority; valence: number; deferredOnce: boolean; source: string }

export interface ChainState { node: string; startedDay: number; done: string[] }

export interface RewardState {
  negStreak: number; beatsSinceLol: number; wowCount: number;
  surprise: { sinceLast: number; sessionCount: number; total: number };
  legendary: { sinceLast: number; sessionCount: number; total: number };
  nearMiss: { count: number; failCount: number; sessionCount: number; lastDayByGoal: Record<string, number>; bonusApplied: number };
  pendingBonus: Record<string, number>;      // goal → bp (near-miss promise, applied once)
}

export interface DirectorState {
  yearBudget: number; shownThisYear: number; sessionDayIndex: number; expectedSessionDays: number;
  momCall: { pending: boolean; lastDay: number; count: number; highSince: number };
  documentsThisSession: number; lastValence: number;
}

export interface YearStats {
  startStats: Record<StatId, number>; startMoney: number; income: number; spend: number;
  riskChoices: number; kindChoices: number; cringeSpikes: number; egoCrossed85: boolean;
  momAccruedBp: number; rentShortfalls: number; paydays: number; valenceSum: number; shownDays: number;
}

export interface GapLine { kind: 'payday' | 'rent' | 'cat' | 'health' | 'daily' | 'momLoan' | 'bankruptcy' | 'allowance'; para: number }
export interface SkipSummary { days: number; key: string; params: Record<string, number> }

export interface CardChoice { id: string; textKey: string; locked: boolean; pattern?: PatternId; swipe?: 'left' | 'right' }
export interface Bubble { speaker: string; textKey: string; avatar?: string; roast?: boolean; lift?: boolean; delayMs: number }
export interface WagerOffer { choiceId: string; prediction: 'fail' | 'succeed'; pOddsBp: number; slipKey: string }
export interface DayCard {
  eventId: string; dayIndex: number; dateISO: string; hour: number;
  skip: SkipSummary | null; flowLog: GapLine[];
  legendary: boolean; momCall: boolean; forced: boolean; surpriseTier: 'nice' | 'great' | null;
  bubbles: Bubble[]; choices: CardChoice[]; wager: WagerOffer | null;
  reply?: Bubble; outcome?: Bubble[]; coach?: Bubble[]; nearMiss?: boolean;
}

export type Grade = 0 | 1 | 2 | 3 | 4;
export interface ReportCardData {
  age: number; grades: { health: Grade; money: Grade; relationships: Grade; brain: Grade; courage: Grade; conduct: Grade };
  coachAccuracyYear: { hits: number; total: number }; mottoCell: { dominant: PatternId | null; netValence: -1 | 0 | 1 };
  envelopeTeaser: string | null; decadeReview: boolean; shownDaysThisYear: number;
}

export interface LifeState {
  schemaVersion: 1;
  lifeSeed: string; name: string; locale: Locale; voice: VoiceLevel; contentHash: string;
  phase: Phase; speed: Speed; fastLife: boolean;
  calendar: Calendar;
  stats: Record<StatId, number>; meters: Record<MeterId, number>; hidden: Record<HiddenId, number>;
  money: { balance: number; debt: number };
  status: Status;
  npcs: Npc[];
  flags: string[];
  patterns: Record<PatternId, number>;
  wagers: WagerEntry[]; wagerLog: WagerLog;
  envelopes: Envelope[]; dueQueue: DueItem[]; chains: Record<string, ChainState>;
  seen: Record<string, number>; cooldowns: { self: Record<string, number>; tags: Record<string, number> };
  reward: RewardState; director: DirectorState; yearStats: YearStats;
  card: DayCard | null;
  notebook: { kind: 'note' | 'wager'; key: string; dayIndex: number }[];
  diagnoses: string[]; glossary: string[];
  death: { cause: string; channel: 'hazard' | 'scripted'; age: number } | null;
}

export interface MetaState {
  schemaVersion: 1;
  legacy: {
    livesCompleted: number; familiarity: number;
    patternRanks: PatternId[][]; seenLives: Record<string, number>;
    metaLog: { lifeSeed: string; ageAtDeath: number; cause: string; shownDays: number; topPatterns: PatternId[] }[];
  };
}

export type Action =
  | { type: 'START_LIFE'; seed: string; name: string; locale?: Locale; voice?: VoiceLevel; fastLife?: boolean }
  | { type: 'NEXT_DAY' }
  | { type: 'ANSWER'; choiceId: string; via?: 'tap' | 'swipe' | 'tactic' | 'auto' }
  | { type: 'SET_SPEED'; speed: Speed }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'END_SESSION' };

export type Effect =
  | { kind: 'SHOW_DAY'; card: DayCard }
  | { kind: 'SHOW_DIALOG'; bubbles: Bubble[]; layer: 'dialog' | 'reply' | 'outcome' | 'coach' }
  | { kind: 'STAMP'; result: 'calledIt' | 'iWasWrong'; pOddsBp: number; variant: number }
  | { kind: 'FLOAT_NUM'; stat: StatId | MeterId | 'money'; delta: number }
  | { kind: 'REPORT_CARD'; data: ReportCardData }
  | { kind: 'DEATH'; age: number; cause: string; channel: 'hazard' | 'scripted' }
  | { kind: 'NOTIFY_PLAN'; teaserKeys: string[] };

export interface StepResult { state: LifeState; meta: MetaState; effects: Effect[] }

/** Content as the engine consumes it: validated events + skip lines, indexed. */
export interface ContentBundle { contentHash: string; events: GameEvent[]; skipLines: SkipLineT[] }
