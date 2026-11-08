/**
 * Content indexing and text-key helpers. The engine never carries prose: it emits `textKey`s
 * (`evt.<id>.dialog.<i>`, `evt.<id>.c.<choice>`, `evt.<id>.o.<choice>.<branch>.text|coach.<j>`) the UI resolves (10 §3.3).
 */
import type { GameEvent, OutcomeT, ChoiceT, SkipLineT } from '@motto/content-schema';
import type { ContentBundle } from './types.ts';

export interface ContentIndex {
  bundle: ContentBundle;
  byId: Map<string, GameEvent>;
  pool: GameEvent[];            // selectable by the director (not report_card)
  legendary: GameEvent[];
  skipLines: SkipLineT[];
}

const cache = new WeakMap<ContentBundle, ContentIndex>();

export function indexContent(bundle: ContentBundle): ContentIndex {
  const hit = cache.get(bundle);
  if (hit) return hit;
  const byId = new Map<string, GameEvent>();
  for (const e of bundle.events) byId.set(e.id, e);
  const idx: ContentIndex = {
    bundle, byId,
    pool: bundle.events.filter((e) => e.type !== 'report_card' && e.rarity !== 'legendary'),
    legendary: bundle.events.filter((e) => e.rarity === 'legendary'),
    skipLines: bundle.skipLines,
  };
  cache.set(bundle, idx);
  return idx;
}

export const branchesOf = (o: OutcomeT | OutcomeT[]): OutcomeT[] => (Array.isArray(o) ? o : [o]);
export const choiceOf = (ev: GameEvent, id: string): ChoiceT | undefined => ev.choices.find((c) => c.id === id);

export const keyDialog = (ev: GameEvent, i: number) => `evt.${ev.id}.dialog.${i}`;
export const keyChoice = (ev: GameEvent, c: string) => `evt.${ev.id}.c.${c}`;
export const keyOutcome = (ev: GameEvent, c: string, b: number) => `evt.${ev.id}.o.${c}.${b}.text`;
export const keyNearMiss = (ev: GameEvent, c: string, b: number) => `evt.${ev.id}.o.${c}.${b}.nearMiss`;
export const keyCoach = (ev: GameEvent, c: string, b: number, j: number) => `evt.${ev.id}.o.${c}.${b}.coach.${j}`;
export const keySlip = (ev: GameEvent) => (ev.wager?.slip ? `evt.${ev.id}.wager.slip` : 'coach.wager.slip.default');
export const keySkip = (line: SkipLineT) => `skip.${line.id}`;
