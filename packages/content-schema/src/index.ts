/**
 * @motto/content-schema — the one zod schema for game content (D-045, D-099).
 * The engine imports only types from here; zod runs at build/lint time and in the validate CLI.
 */
export * from './primitives';
export { Pre, specificity2 } from './pre';
export {
  DialogLine, Check, Choice, StatusEffect, Effects, CoachLine, Outcome, Intent, Review, L10n, GameEventBase,
} from './event';
export type { GameEvent, Outcome as OutcomeT, Choice as ChoiceT, Effects as EffectsT, CoachLine as CoachLineT, DialogLine as DialogLineT, Check as CheckT, StatusEffect as StatusEffectT } from './event';
export { GameEvent as GameEventSchema, refineEvent } from './refine';
export { SkipLine, ContentBundle } from './bundle';
export type { SkipLine as SkipLineT, ContentBundle as ContentBundleT } from './bundle';

import { GameEvent as GameEventSchema } from './refine';
import type { GameEvent } from './event';

/** Parse one event; throws a ZodError with paths on failure. */
export function parseEvent(input: unknown): GameEvent {
  return GameEventSchema.parse(input);
}
