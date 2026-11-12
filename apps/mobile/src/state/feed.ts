/**
 * Feed view-model: what the Life Flow screen renders, built only from engine effects (no rules here).
 * Items keep engine text keys + params (or UI-catalog keys), never resolved strings, so a TR/EN switch
 * re-renders the whole history in the new language.
 */
import type { GapLine, MeterId, ReportCardData, StatId, WagerOffer } from '@motto/engine';
import type { Strings } from '../i18n';

/** A UI-catalog line: key of a string (or formatter) in tr.ts/en.ts + its arguments. */
export type UiKey = 'intro1' | 'intro2' | 'nameRoast' | 'birthdayLine' | 'quiet' | 'envelopeOpened' | 'lowJoy' | 'suggestEnd' | 'resumed';
export interface UiLine { k: UiKey; a?: (string | number)[] }

export function uiText(s: Strings, line: UiLine): string {
  const v = s[line.k] as string | ((...a: never[]) => string);
  return typeof v === 'function' ? (v as (...a: (string | number)[]) => string)(...(line.a ?? [])) : v;
}

export type Params = Readonly<Record<string, number | string>>;
export type CardVariant = 'event' | 'doc' | 'legend' | 'call' | 'surprise' | 'daily' | 'forced';
export type StampResult = 'calledIt' | 'iWasWrong';
export interface Delta { stat: StatId | MeterId | 'money'; delta: number }

/** `restored`: the item came back from a save — shown at once (no typewriter replay). */
export type FeedItem = { restored?: boolean } & (
  | { id: number; kind: 'date'; dayIndex: number; dateISO: string; birthday: boolean }
  | { id: number; kind: 'skip'; key: string; params?: Params }
  | { id: number; kind: 'flow'; lines: GapLine[]; momsHouse: boolean }
  | { id: number; kind: 'typing'; speaker: string }
  | { id: number; kind: 'card'; eventId: string; variant: CardVariant; age: number; narration: { key: string; params?: Params } | null;
      wager: WagerOffer | null; stamp: { result: StampResult; variant: number } | null }
  | { id: number; kind: 'npc'; speaker: string; avatar?: string; key: string; params?: Params; /** player age when said (NPC faces age along) */ age?: number }
  | { id: number; kind: 'reply'; key?: string; raw?: string; auto: boolean }
  | { id: number; kind: 'outcome'; key: string; params?: Params; deltas: Delta[] }
  | { id: number; kind: 'coach'; key?: string; params?: Params; ui?: UiLine; roast?: boolean; lift?: boolean }
  | { id: number; kind: 'report'; data: ReportCardData; motto: string }
  | { id: number; kind: 'sys'; ui: UiLine }
  | { id: number; kind: 'mundane'; ui: UiLine });

export type FeedItemOf<K extends FeedItem['kind']> = Extract<FeedItem, { kind: K }>;
