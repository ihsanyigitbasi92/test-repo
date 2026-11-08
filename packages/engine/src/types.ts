/**
 * Engine state, actions and effects (10 §2.3.2/§2.3.3 + §3.1, revised by D-061/066/067/088/099/101/121).
 * Units (D-098): stats/meters/stress are integer basis points 0..10000 (100 bp = 1 point on the 0–100 scale);
 * luck is bp in -5000..5000 (= -50..50); money is integer Para (1 Birim = 1000 Para).
 * Everything is a plain JSON-serialisable value: `JSON.stringify(state)` is the replay/compare key.
 *
 * The engine imports ONLY types from @motto/content-schema (zod never enters the runtime bundle).
 */
import type { GameEvent, PatternId, Locale, VoiceLevel, Housing, Season, SkipLineT } from '@motto/content-schema';

export type { GameEvent, PatternId, Locale, VoiceLevel, Housing, Season };
export type StatId = 'health' | 'joy' | 'brain' | 'charm';
export type MeterId = 'ego' | 'cringe' | 'momPressure';
export type HiddenId = 'luck' | 'stress';
export type Speed = 'pause' | 'play' | 'fast';
/** idle = Client File (day 0) · day = card awaiting ANSWER · answered = NEXT_DAY allowed · birthday = report card shown. */
export type Phase = 'idle' | 'day' | 'answered' | 'birthday' | 'dead';
export type Channel = 'beats' | 'outcome' | 'hazard' | 'names' | 'wager' | 'director' | 'surprise' | 'cosmetic' | 'cohort' | 'daily';

/** Runtime copies of the content enums the engine iterates (kept here so zod stays out of the engine bundle). */
export const PATTERNS: readonly PatternId[] = [
  'procrastination', 'avoidance', 'impulseSpend', 'peoplePleasing', 'risk', 'selfCare',
  'overwork', 'leanOnFamily', 'shortcut', 'pride', 'generosity', 'patience',
];
export const FACES = ['mom', 'roommate', 'boss', 'ex', 'neighbor', 'uncle', 'cat', 'cabbie'] as const;
export const POSITIVE_PATTERNS: readonly PatternId[] = ['generosity', 'patience', 'selfCare'];

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
  dayIndex: number; eventId: string; choiceId: string;
  prediction: 'fail'; pOddsBp: number;
  outcome: 'calledIt' | 'iWasWrong'; stampVariant: number;
}
export interface WagerLog { lastDay: number; thisYear: number; recentDays: number[]; total: number; coachHits: number }

export interface Envelope {
  id: string; createdDay: number; dueDay: number; teaserKey: string; weight: number;
  sourceEventId: string; resolverEventId: string; opened: boolean; resolved: boolean;
}

/** 03 §2.3.5 priority classes: 3 mom-call · 4 envelope · 5 chain · 6 forced follow-up · 7 rent/bailout · 9 lucky follow-up. */
export type DuePriority = 3 | 4 | 5 | 6 | 7 | 9;
/** `envelopeId` ties a priority-4 resolver to its exact envelope; `source` is 'rent' | 'bailout' | 'bankruptcy' | 'chain:<id>' | … */
export interface DueItem { day: number; eventId: string; priority: DuePriority; valence: number; deferredOnce: boolean; source: string; envelopeId?: string }

export interface ChainState { node: string; startedDay: number; done: string[] }

export interface PityCounter { sinceLast: number; sessionCount: number; total: number; lastDay: number }
export interface RewardState {
  negStreak: number; beatsSinceLol: number; wowCount: number;
  surprise: PityCounter; legendary: PityCounter;
  nearMiss: { count: number; failCount: number; sessionCount: number; lastDayByGoal: Record<string, number>; bonusApplied: number };
  pendingBonus: Record<string, number>;      // goal → bp (near-miss promise, applied once)
}

export interface DirectorState {
  yearBudget: number; shownThisYear: number; sessionDayIndex: number; expectedSessionDays: number;
  momCall: { pending: boolean; lastDay: number; count: number; highSince: number };
  lastValence: number;
  /** Last ≤ 5 session lengths (shown days); expectedSessionDays = their median (03 §2.3.4). */
  recentSessions: number[];
  /** SESSION_END_SUGGESTED already emitted this session (t ≥ 0.85). */
  endSuggested: boolean;
  /** Günün Günü (03 §2.3.7): wall-clock local date from RESUME (seed only) and whether today's shared day played. */
  daily: { localDay: string; played: boolean } | null;
}

export interface YearStats {
  startStats: Record<StatId, number>; startMoney: number; startAffinity: number; income: number; spend: number;
  riskChoices: number; cringeSpikes: number; egoCrossed85: boolean;
  momAccruedBp: number; rentShortfalls: number; paydays: number; valenceSum: number; shownDays: number;
  wagers: number; wagerHits: number;
  patterns: Partial<Record<PatternId, number>>;
  /** Lifestyle spend share (per-mille of income) snapshotted at the birthday (02 §2.3.3). */
  lifestylePm: number;
}

/** Lifetime counters for the Roast Report and the harness (02 §2.5.2 "numbers are never invented"). */
export interface LifeCounters {
  shownDays: number; yearsWorked: number; peakMoney: number; rentEvents: number; momCalls: number;
  surprises: number; legendaries: number; maxNegStreak: number; quietDays: number; bailouts: number; bankruptcies: number;
}

/** Detailed money movement kinds of a gap (CashflowResult.detail). */
export type GapKind = 'payday' | 'allowance' | 'rent' | 'cat' | 'health' | 'daily' | 'debt';
/**
 * D-088 flowLog line (≤ 3 per shown day): income (payday | allowance), rent, and one folded `daily` total
 * (living cost + cat + health cost + card-debt growth).
 */
export type FlowKind = 'payday' | 'allowance' | 'rent' | 'daily';
export interface GapLine { kind: FlowKind; para: number }
export interface SkipSummary { days: number; key: string; params: Record<string, number> }

export interface CardChoice { id: string; textKey: string; locked: boolean; pattern?: PatternId; swipe?: 'left' | 'right' }
/**
 * One chat bubble. `textKey` resolves through `resolveText(bundle, key, locale)`; `params` fills the
 * `{name}`, `{n}`, `{ego}`, `{cringe}`, `{momPressure}`, `{money}` placeholders (points / Para, integers).
 */
export interface Bubble {
  speaker: string; textKey: string; avatar?: string; roast?: boolean; lift?: boolean; delayMs: number;
  params?: Record<string, number | string>;
}
export interface WagerOffer { choiceId: string; prediction: 'fail'; pOddsBp: number; slipKey: string }
export interface DayCard {
  eventId: string; dayIndex: number; dateISO: string; hour: number;
  skip: SkipSummary | null; flowLog: GapLine[];
  legendary: boolean; momCall: boolean; forced: boolean; surpriseTier: 'nice' | 'great' | null;
  /** Günün Günü: shared event whose outcome die is seeded by the local date (03 §2.3.7). */
  daily?: { localDay: string };
  bubbles: Bubble[]; choices: CardChoice[]; wager: WagerOffer | null;
  answered?: { choiceId: string; branch: number; nearMiss: boolean };
}

export type Grade = 0 | 1 | 2 | 3 | 4;
export interface ReportCardData {
  age: number;
  /** `spectacle` is the D-121 Cringe-only replacement of "conduct". */
  grades: { health: Grade; money: Grade; relationships: Grade; brain: Grade; courage: Grade; spectacle: Grade };
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
  reward: RewardState; director: DirectorState; yearStats: YearStats; counters: LifeCounters;
  card: DayCard | null;
  lastReport: ReportCardData | null;
  notebook: { kind: 'note' | 'wager'; key: string; dayIndex: number }[];
  diagnoses: string[]; glossary: string[];
  death: { cause: string; channel: 'hazard' | 'scripted'; age: number } | null;
  /** Draws already taken on each channel at the current dayIndex (D-101: channels are re-derived each shown day). */
  rng: Partial<Record<Channel, number>>;
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
  /** `eventId` guards against a stale / double tap answering a newer card (10 §3.1). */
  | { type: 'ANSWER'; eventId: string; choiceId: string; via?: 'tap' | 'swipe' | 'tactic' | 'auto' }
  | { type: 'SET_SPEED'; speed: Speed }
  | { type: 'PAUSE' }
  /** `localDay` ('YYYY-MM-DD', device-local) seeds Günün Günü only; the engine never reads the clock (D-050). */
  | { type: 'RESUME'; localDay?: string; nowWall?: number }
  | { type: 'SESSION_END'; reason?: 'enough' | 'halfTime' | 'background' }
  /** Alias of SESSION_END kept for older callers. */
  | { type: 'END_SESSION' }
  /** TODO(goals): goals are not modelled in the MVP engine; accepted as a no-op. */
  | { type: 'PICK_GOAL'; goalId: string | null }
  /** Marks an envelope opened (not resolved). */
  | { type: 'OPEN_ENVELOPE'; envelopeId: string };

export type Effect =
  | { kind: 'SHOW_DAY'; card: DayCard }
  | { kind: 'SHOW_DIALOG'; bubbles: Bubble[]; layer: 'dialog' | 'reply' | 'outcome' | 'coach' }
  | { kind: 'STAMP'; result: 'calledIt' | 'iWasWrong'; pOddsBp: number; variant: number }
  | { kind: 'FLOAT_NUM'; stat: StatId | MeterId | 'money'; delta: number }
  | { kind: 'REPORT_CARD'; data: ReportCardData }
  | { kind: 'DEATH'; age: number; cause: string; channel: 'hazard' | 'scripted' }
  | { kind: 'NOTIFY_PLAN'; teaserKeys: string[] }
  | { kind: 'HAPTIC'; pattern: 'error' }
  /** t = sessionDayIndex / expectedSessionDays ≥ 0.85 (03 §2.3.4): the UI may offer "Bugünlük yeter". */
  | { kind: 'SESSION_END_SUGGESTED' };

export interface StepResult { state: LifeState; meta: MetaState; effects: Effect[] }

/** Content as the engine consumes it: validated events + skip lines. */
export interface ContentBundle { contentHash: string; events: GameEvent[]; skipLines: SkipLineT[] }
