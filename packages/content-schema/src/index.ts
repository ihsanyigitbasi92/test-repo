/**
 * @motto/content-schema — the one zod schema for game content (D-045, D-099).
 * The engine imports only types from here; zod runs at build/lint time and in the validate CLI.
 */
export * from './primitives.ts';
export { Pre, specificity2 } from './pre.ts';
export {
  DialogLine, Check, Choice, StatusEffect, Effects, CoachLine, Outcome, Intent, Review, L10n, GameEventBase,
} from './event.ts';
export type { GameEvent, Outcome as OutcomeT, Choice as ChoiceT, Effects as EffectsT, CoachLine as CoachLineT, DialogLine as DialogLineT, Check as CheckT, StatusEffect as StatusEffectT } from './event.ts';
export { GameEvent as GameEventSchema, refineEvent } from './refine.ts';
export { SkipLine, ContentBundle } from './bundle.ts';
export type { SkipLine as SkipLineT, ContentBundle as ContentBundleT } from './bundle.ts';

import { GameEvent as GameEventSchema } from './refine.ts';
import type { GameEvent } from './event.ts';

/** Parse one event; throws a ZodError with paths on failure. */
export function parseEvent(input: unknown): GameEvent {
  return GameEventSchema.parse(input);
}
