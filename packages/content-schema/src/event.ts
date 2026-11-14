/**
 * GameEvent — the single zod schema (D-045, D-099). Readable contract: docs/design/03 §2.2.1.
 * Additions: D-062 dialog[], D-093 punchOwner, D-ÖNERİ-02-15 status effects / forced,
 * D-ÖNERİ-04-01 effects.status, D-ÖNERİ-09-02 review.locales, D-ÖNERİ-09-03 l10n + mechanism enum.
 * Units: see primitives.ts (integer points / Para / basis points).
 */
import { z } from 'zod';
import {
  AgeBand, Avatar, Bp, CheckBp, EventType, Housing, L, NpcSpeaker, PatternId, Rarity, Universality, Valence,
  CHECK_STATS, HIDDEN_IDS, METER_IDS, STAT_IDS, MECHANISMS, PUNCH_OWNERS, REVIEW_STATUSES, VOICE_LEVELS,
} from './primitives';
import { Pre } from './pre';

const intDelta = (lim: number) => z.number().int().min(-lim).max(lim);
const partialInts = <K extends string>(keys: readonly K[], lim: number) =>
  z.object(Object.fromEntries(keys.map((k) => [k, intDelta(lim).optional()])) as Record<K, z.ZodOptional<z.ZodNumber>>).strict();

export const DialogLine = z.object({
  speaker: NpcSpeaker,                          // L03-02: never `you`
  avatar: Avatar.optional(),
  tr: z.string().min(1).max(110), en: z.string().min(1).max(110),   // 03 §4 line budget
  when: Pre.optional(),
  alt: z.array(L).optional(),
  delayMs: z.number().int().min(0).max(5000).optional(),
}).strict();

export const Check = z.object({
  base: CheckBp,                                // bp; L03-04 ∈ [0.05, 0.95]
  stat: z.enum(CHECK_STATS).optional(),
  goal: z.string().optional(),
  skill: z.boolean().optional(),
}).strict();

export const Choice = z.object({
  id: z.string().regex(/^[a-z][a-z0-9_]*$/),
  tr: z.string().min(1).max(40), en: z.string().min(1).max(40),
  pattern: PatternId.optional(),
  requires: Pre.optional(),
  hint: L.optional(),
  check: Check.optional(),
  tactic: z.boolean().optional(),
  swipe: z.enum(['left', 'right']).optional(),
}).strict();

const delayDays = z.tuple([z.number().int().min(0), z.number().int().min(0).max(1500)]);   // L03-10

/** Permanent Status strip changes (D-067, D-ÖNERİ-04-01). `monthly`/`rent` in Para. */
export const StatusEffect = z.object({
  job: z.union([z.null(), z.object({ title: z.string(), tier: z.number().int().min(0).max(6), monthly: z.number().int().min(0) }).strict()]).optional(),
  home: z.object({ kind: Housing, rent: z.number().int().min(0) }).strict().optional(),
  rentDelta: z.number().int().optional(),
  partner: z.union([z.null(), z.object({ npc: NpcSpeaker }).strict()]).optional(),
  assets: z.object({ add: z.array(z.string()).optional(), remove: z.array(z.string()).optional() }).strict().optional(),
}).strict();

export const Effects = z.object({
  stats: partialInts(STAT_IDS, 25).optional(),              // L03-13 |delta| ≤ 25
  meters: partialInts(METER_IDS, 25).optional(),
  hidden: partialInts(HIDDEN_IDS, 25).optional(),
  money: z.number().int().min(-25000).max(25000).optional(), // Para; L03-13 ±10 Birim (legendary ≤ +25) checked in refinement
  flags: z.object({ add: z.array(z.string()).optional(), remove: z.array(z.string()).optional() }).strict().optional(),
  npc: z.array(z.object({
    role: NpcSpeaker, affinity: z.number().int().optional(), memory: z.string().optional(),
    create: z.boolean().optional(), kill: z.boolean().optional(),
  }).strict()).optional(),
  career: z.object({ set: z.string().optional(), rungDelta: z.number().int().optional(), fire: z.boolean().optional() }).strict().optional(),
  housing: Housing.optional(),
  status: StatusEffect.optional(),
  followUp: z.array(z.object({ eventId: z.string(), delayDays, chance: Bp.optional(), forced: z.boolean().optional() }).strict()).optional(),
  envelope: z.object({ teaserKey: z.string(), dueDays: delayDays, weight: z.number().int().min(1), resolverEventId: z.string() }).strict().optional(),
  chainNext: z.string().optional(),
  diagnosis: z.string().optional(),
  glossary: z.string().optional(),
  death: z.object({ cause: z.string() }).strict().optional(),
  notebook: z.object({ kind: z.literal('note'), key: z.string() }).strict().optional(),
  bailoutCheck: z.boolean().optional(),                      // D-ÖNERİ-02-15
}).strict();

export const CoachLine = z.object({
  tr: z.string().min(1), en: z.string().min(1),
  roast: z.boolean(),
  lift: z.boolean().optional(),
  level: z.array(z.enum(VOICE_LEVELS)).optional(),
  when: Pre.optional(),
}).strict();

export const Outcome = z.object({
  p: Bp.optional(),
  luckScaled: z.boolean().optional(),
  effects: Effects.optional(),
  tr: z.string().min(1), en: z.string().min(1),
  nearMiss: L.optional(),
  coach: z.array(CoachLine).min(1),
}).strict();

export const Intent = z.object({
  setup: z.string(), mechanism: z.string(), punch: z.string(), lift: z.string(),
  target: z.enum(['decision', 'situation', 'coach', 'npc']),
  mechanismId: z.enum(MECHANISMS).optional(),               // D-ÖNERİ-09-03
  antithesis: z.boolean().optional(), closer: z.string().optional(),   // D-094
}).strict();

const LocaleReview = z.object({
  rev: z.number().int().min(0).optional(), reviewedRev: z.number().int().min(0).optional(),
  state: z.enum(['draft', 'reviewed', 'approved']).optional(),
  funny: z.number().int().min(1).max(5).optional(), punched: z.boolean().optional(), textHash: z.string().optional(),
}).strict();

export const Review = z.object({
  status: z.enum(REVIEW_STATUSES),
  funnyTr: z.number().int().min(1).max(5).optional(), funnyEn: z.number().int().min(1).max(5).optional(),
  legal: z.enum(['ok', 'review']),
  needsReview: z.array(z.string()).optional(),
  cultureNote: z.string().optional(),
  locales: z.object({ tr: LocaleReview.optional(), en: LocaleReview.optional() }).strict().optional(),   // D-ÖNERİ-09-02
  intentRev: z.number().int().min(0).optional(),
  tier: z.enum(['A', 'B', 'C']).optional(),
}).strict();

export const L10n = z.object({                               // D-ÖNERİ-09-03
  swaps: z.array(z.object({ key: z.string(), tr: z.string(), en: z.string() }).strict()).optional(),
  onlyLocale: z.enum(['tr', 'en']).optional(),
  mechanismNote: z.string().optional(),
}).strict();

export const GameEventBase = z.object({
  id: z.string().regex(/^[a-z][a-z0-9_]*$/),
  v: z.number().int().min(1),
  type: EventType,
  tags: z.array(z.string()).min(1),
  rarity: Rarity, weight: z.number().int().min(1).max(1000).optional(),      // per-mille of base weight
  valence: Valence, intensity: Bp,
  isLOL: z.boolean().optional(), wow: z.boolean().optional(), relax: z.boolean().optional(),
  punchOwner: z.enum(PUNCH_OWNERS).optional(),               // D-093
  universality: Universality, substituteFor: z.string().optional(),
  shared: z.boolean().optional(),
  cooldownDays: z.object({ self: z.number().int().min(0).optional(), tags: z.record(z.string(), z.number().int().min(0)).optional() }).strict().optional(),
  maxPerLife: z.number().int().min(1).optional(), exclusiveGroup: z.string().optional(), salienceBonus: z.number().int().min(0).optional(),
  pre: Pre,
  ageBand: z.array(AgeBand).optional(),
  chain: z.object({ id: z.string(), node: z.string(), next: z.array(z.object({ node: z.string(), delayDays, when: Pre.optional() }).strict()).optional() }).strict().optional(),
  dialog: z.array(DialogLine).optional(),
  text: z.array(z.object({ id: z.string(), when: Pre.optional(), tr: z.string(), en: z.string() }).strict()).optional(),
  document: z.object({
    letterhead: L, body: L,
    translate: z.object({ tr: z.object({ from: z.string(), to: z.string() }).strict(), en: z.object({ from: z.string(), to: z.string() }).strict() }).strict(),
    glossaryKey: z.string(),
  }).strict().optional(),
  call: z.object({ speaker: z.enum(['mom', 'uncle', 'boss', 'ex']), takeover: z.boolean() }).strict().optional(),
  minigame: z.object({ kind: z.enum(['eyeContact', 'timing']), green: Bp, bonus: Bp, check: z.string() }).strict().optional(),
  choices: z.array(Choice).min(2).max(4),
  outcomes: z.record(z.string(), z.union([Outcome, z.array(Outcome).min(1)])),
  wager: z.object({ eligible: z.boolean(), check: z.string().optional(), slip: L.optional(), reason: z.string().optional() }).strict().optional(),
  intent: Intent,
  review: Review,
  l10n: L10n.optional(),
}).strict();

export type GameEvent = z.infer<typeof GameEventBase>;
export type Outcome = z.infer<typeof Outcome>;
export type Choice = z.infer<typeof Choice>;
export type Effects = z.infer<typeof Effects>;
export type CoachLine = z.infer<typeof CoachLine>;
export type DialogLine = z.infer<typeof DialogLine>;
export type Check = z.infer<typeof Check>;
export type StatusEffect = z.infer<typeof StatusEffect>;
