/**
 * Primitive enums and small shared shapes of the single content schema (D-045, D-099).
 * Source of truth: docs/design/03 §2.2.1, extended by D-071 (SpeakerId), D-ÖNERİ-09-03 (mechanism enum).
 *
 * Unit rule (D-098 determinism): every numeric effect is an INTEGER.
 *  - stat / meter / hidden deltas are "points" on the 0–100 scale (engine stores 100 bp per point);
 *  - `money` is in Para (display unit; 1 Birim = 1000 Para, so "-0.3 Birim" is written as -300);
 *  - probabilities (`check.base`, `Outcome.p`, `intensity`) are basis points 0..10000.
 */
import { z } from 'zod';

export const EVENT_TYPES = ['event', 'document', 'call', 'minigame', 'report_card'] as const;
export const RARITIES = ['common', 'uncommon', 'rare', 'legendary'] as const;
export const UNIVERSALITIES = ['universal', 'localizedShell', 'localeOnly'] as const;
export const STAT_IDS = ['health', 'joy', 'brain', 'charm'] as const;
export const METER_IDS = ['ego', 'cringe', 'momPressure'] as const;
export const HIDDEN_IDS = ['luck', 'stress'] as const;
export const CHECK_STATS = ['health', 'joy', 'brain', 'charm', 'ego', 'cringe'] as const;
export const AVATARS = ['neutral', 'worried', 'annoyed', 'happy', 'smug', 'tired', 'typing'] as const;
export const HOUSING = ['momsHouse', 'room', 'flat', 'wide', 'mortgage', 'owned'] as const;
export const SEASONS = ['winter', 'spring', 'summer', 'autumn'] as const;
export const AGE_BANDS = ['warmup', 'season', 'secondHalf', 'overtime'] as const;
export const VOICE_LEVELS = ['gentle', 'normal', 'brutal'] as const;
export const PUNCH_OWNERS = ['dialog', 'outcome', 'coach'] as const;
export const REVIEW_STATUSES = ['draft', 'curated', 'linted', 'punched', 'approved'] as const;
export const LOCALES = ['tr', 'en'] as const;

/** 12 neutral patterns (D-024); English camelCase only (D-099). */
export const PATTERN_IDS = [
  'procrastination', 'avoidance', 'impulseSpend', 'peoplePleasing', 'risk', 'selfCare',
  'overwork', 'leanOnFamily', 'shortcut', 'pride', 'generosity', 'patience',
] as const;

/** 8 Familiar Faces (D-017) + persistent roles (D-071). Situational NPCs use the `npc:` prefix. */
export const FAMILIAR_FACES = ['mom', 'roommate', 'boss', 'ex', 'neighbor', 'uncle', 'cat', 'cabbie'] as const;
export const PERSISTENT_ROLES = [...FAMILIAR_FACES, 'partner', 'child', 'sibling'] as const;
export const SITUATIONAL_NPCS = [
  'courier', 'boilerTech', 'landlord', 'hr', 'doctor', 'clerk', 'stranger', 'barber', 'coworker', 'neighborKid', 'waiter', 'banker',
] as const;

/** Joke mechanism enum (D-ÖNERİ-09-03) — `pun*` family folded into `pun`. */
export const MECHANISMS = [
  'bathos', 'reversal', 'literalism', 'escalation', 'callback', 'deadpan_report', 'translation', 'count', 'understatement', 'pun',
] as const;

export const EventType = z.enum(EVENT_TYPES);
export const Rarity = z.enum(RARITIES);
export const Valence = z.union([z.literal(-2), z.literal(-1), z.literal(0), z.literal(1), z.literal(2)]);
export const Universality = z.enum(UNIVERSALITIES);
export const StatId = z.enum(STAT_IDS);
export const MeterId = z.enum(METER_IDS);
export const HiddenId = z.enum(HIDDEN_IDS);
export const Avatar = z.enum(AVATARS);
export const PatternId = z.enum(PATTERN_IDS);
export const Housing = z.enum(HOUSING);
export const Season = z.enum(SEASONS);
export const AgeBand = z.enum(AGE_BANDS);
export const VoiceLevel = z.enum(VOICE_LEVELS);
export const Locale = z.enum(LOCALES);

const npcRole = z.string().regex(
  new RegExp(`^npc:(${SITUATIONAL_NPCS.join('|')})$`),
  'situational NPC must be npc:<role> from the 04 dictionary',
);
/** Any speaker except the engine-only `you` bubble. */
export const NpcSpeaker = z.union([z.enum(PERSISTENT_ROLES), npcRole]);
export const SpeakerId = z.union([NpcSpeaker, z.literal('you')]);

/** Basis points 0..10000 (probabilities, intensity). */
export const Bp = z.number().int().min(0).max(10000);
/** Integer in the open (0,1) band expressed as bp — L03-04: check.base ∈ [0.05, 0.95]. */
export const CheckBp = z.number().int().min(500).max(9500);

/** Two locales, written separately (09). */
export const L = z.object({ tr: z.string().min(1), en: z.string().min(1) }).strict();

export type EventType = z.infer<typeof EventType>;
export type Rarity = z.infer<typeof Rarity>;
export type Valence = z.infer<typeof Valence>;
export type Universality = z.infer<typeof Universality>;
export type StatId = z.infer<typeof StatId>;
export type MeterId = z.infer<typeof MeterId>;
export type HiddenId = z.infer<typeof HiddenId>;
export type Avatar = z.infer<typeof Avatar>;
export type PatternId = z.infer<typeof PatternId>;
export type Housing = z.infer<typeof Housing>;
export type Season = z.infer<typeof Season>;
export type AgeBand = z.infer<typeof AgeBand>;
export type VoiceLevel = z.infer<typeof VoiceLevel>;
export type Locale = z.infer<typeof Locale>;
export type NpcSpeaker = z.infer<typeof NpcSpeaker>;
export type SpeakerId = z.infer<typeof SpeakerId>;
export type L = z.infer<typeof L>;
