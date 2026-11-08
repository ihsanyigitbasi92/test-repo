/**
 * Precondition DSL (03 §2.2.2). All keys are AND-ed; `all/any/none` combine sub-trees.
 * Numeric bounds are integer points (0–100 scale) or Para for `money`; `luck` is -50..50.
 */
import { z } from 'zod';
import { HOUSING, PATTERN_IDS, STAT_IDS, METER_IDS, HIDDEN_IDS, NpcSpeaker, Season } from './primitives';

const range = z.object({ min: z.number().int().optional(), max: z.number().int().optional() }).strict();
const partialRanges = <K extends string>(keys: readonly K[]) =>
  z.object(Object.fromEntries(keys.map((k) => [k, range.optional()])) as Record<K, z.ZodOptional<typeof range>>).strict();

const npcCond = z.object({
  alive: z.boolean().optional(),
  exists: z.boolean().optional(),
  minAffinity: z.number().int().optional(),
  maxAffinity: z.number().int().optional(),
  memoryHas: z.array(z.string()).optional(),
  memoryNone: z.array(z.string()).optional(),
}).strict();

export type Pre = {
  all?: Pre[]; any?: Pre[]; none?: Pre[];
  age?: { min?: number; max?: number };
  stats?: Partial<Record<(typeof STAT_IDS)[number], { min?: number; max?: number }>>;
  meters?: Partial<Record<(typeof METER_IDS)[number], { min?: number; max?: number }>>;
  hidden?: Partial<Record<(typeof HIDDEN_IDS)[number], { min?: number; max?: number }>>;
  money?: { min?: number; max?: number };
  flags?: { all?: string[]; any?: string[]; none?: string[] };
  career?: { anyOf?: string[]; minRung?: number; employed?: boolean };
  housing?: (typeof HOUSING)[number][];
  npc?: Partial<Record<string, z.infer<typeof npcCond>>>;
  goal?: { anyOf?: string[]; active?: boolean };
  season?: z.infer<typeof Season>[];
  chain?: { id: string; nodeDone?: string[]; nodeNotDone?: string[] };
  pattern?: Partial<Record<(typeof PATTERN_IDS)[number], { min?: number; max?: number }>>;
  wagerOpen?: boolean; envelopeOpen?: boolean;
  dayOfMonth?: { min?: number; max?: number };      // D-ÖNERİ-02-15
  rentShortfall?: boolean;                           // D-ÖNERİ-02-15
  meta?: { livesMin?: number; baggageEventId?: string; pastFlags?: string[]; familiarityMin?: number };
  expr?: string;
};

export const Pre: z.ZodType<Pre> = z.lazy(() =>
  z.object({
    all: z.array(Pre).optional(),
    any: z.array(Pre).optional(),
    none: z.array(Pre).optional(),
    age: z.object({ min: z.number().int().min(18).optional(), max: z.number().int().max(100).optional() }).strict().optional(),
    stats: partialRanges(STAT_IDS).optional(),
    meters: partialRanges(METER_IDS).optional(),
    hidden: partialRanges(HIDDEN_IDS).optional(),
    money: range.optional(),
    flags: z.object({ all: z.array(z.string()).optional(), any: z.array(z.string()).optional(), none: z.array(z.string()).optional() }).strict().optional(),
    career: z.object({ anyOf: z.array(z.string()).optional(), minRung: z.number().int().optional(), employed: z.boolean().optional() }).strict().optional(),
    housing: z.array(z.enum(HOUSING)).optional(),
    npc: z.record(NpcSpeaker, npcCond).optional(),
    goal: z.object({ anyOf: z.array(z.string()).optional(), active: z.boolean().optional() }).strict().optional(),
    season: z.array(Season).optional(),
    chain: z.object({ id: z.string(), nodeDone: z.array(z.string()).optional(), nodeNotDone: z.array(z.string()).optional() }).strict().optional(),
    pattern: partialRanges(PATTERN_IDS).optional(),
    wagerOpen: z.boolean().optional(),
    envelopeOpen: z.boolean().optional(),
    dayOfMonth: z.object({ min: z.number().int().min(1).optional(), max: z.number().int().max(31).optional() }).strict().optional(),
    rentShortfall: z.boolean().optional(),
    meta: z.object({
      livesMin: z.number().int().optional(), baggageEventId: z.string().optional(),
      pastFlags: z.array(z.string()).optional(), familiarityMin: z.number().int().optional(),
    }).strict().optional(),
    expr: z.string().optional(),
  }).strict(),
) as z.ZodType<Pre>;

/** Specificity = leaf count; `any` leaves count 0.5 (03 §2.2.2). Returned ×2 to stay integer. */
export function specificity2(pre: Pre | undefined): number {
  if (!pre) return 0;
  let n = 0;
  for (const [k, v] of Object.entries(pre)) {
    if (v === undefined) continue;
    if (k === 'all' || k === 'none') for (const p of v as Pre[]) n += specificity2(p);
    else if (k === 'any') for (const p of v as Pre[]) n += specificity2(p) >> 1;
    else n += 2;
  }
  return n;
}
