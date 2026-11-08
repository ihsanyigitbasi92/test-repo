/**
 * The content bundle the app plays: every fixture under packages/content-schema/fixtures (top-level + demo pack).
 * Validation happens at build/test time (content-schema tests, D-099); zod never enters the app bundle.
 */
import { cyrb128, indexContent } from '@motto/engine';
import type { ContentBundle, GameEvent } from '@motto/engine';
import { RAW_EVENTS, RAW_SKIP_LINES } from './fixtures.gen';

const events = RAW_EVENTS as GameEvent[];
const skipLines = RAW_SKIP_LINES as ContentBundle['skipLines'];

export const BUNDLE: ContentBundle = {
  contentHash: cyrb128(events.map((e) => `${e.id}@${e.v}`).join('|')).map((h) => h.toString(16)).join('').slice(0, 16),
  events,
  skipLines,
};

/** Read-only lookup of an event's content (document letterhead, tags) — never used to decide rules. */
export const eventById = (id: string): GameEvent | undefined => indexContent(BUNDLE).byId.get(id);
