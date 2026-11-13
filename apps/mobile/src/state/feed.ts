/**
 * Feed view-model: what the Life Flow screen renders, built only from engine effects (no rules here).
 * Items keep engine text keys + params (or UI-catalog keys), never resolved strings, so a TR/EN switch
 * re-renders the whole history in the new language.
 */
import type { GapLine, MeterId, ReportCardData, StatId, WagerOffer } from '@motto/engine';
import type { Strings } from '../i18n';
import type { PartnerStage } from '../i18n/labels';

/** A UI-catalog line: key of a string (or formatter) in tr.ts/en.ts + its arguments. */
type AdUiKey = keyof Strings['ads']['feed'];
export type UiKey = 'intro1' | 'intro2' | 'nameRoast' | 'birthdayLine' | 'quiet' | 'quietNoCat' | 'envelopeOpened' | 'lowJoy' | 'suggestEnd' | 'resumed' | 'unreadInfo' | 'lowHealth' | AdUiKey;
export interface UiLine { k: UiKey; a?: (string | number)[] }

export function uiText(s: Strings, line: UiLine): string {
  // Ad layer lines (adIncoming, adSponsorOffer, …) live in their own block: s.ads.feed.
  const v = (line.k in s.ads.feed ? s.ads.feed[line.k as AdUiKey] : s[line.k as Exclude<UiKey, AdUiKey>]) as string | ((...a: never[]) => string);
  return typeof v === 'function' ? (v as (...a: (string | number)[]) => string)(...(line.a ?? [])) : v;
}

export type Params = Readonly<Record<string, number | string>>;
export type CardVariant = 'event' | 'doc' | 'legend' | 'call' | 'surprise' | 'daily' | 'forced';
export type StampResult = 'calledIt' | 'iWasWrong';
export interface Delta { stat: StatId | MeterId | 'money'; delta: number }

/** `restored`: the item came back from a save — shown at once (no typewriter replay). */
export type FeedItem = { restored?: boolean } & (
  | { id: number; kind: 'date'; dayIndex: number; /** engine calendarDay (older saves: absent) */ calendarDay?: number; dateISO: string; birthday: boolean }
  | { id: number; kind: 'skip'; key: string; params?: Params }
  | { id: number; kind: 'flow'; lines: GapLine[]; momsHouse: boolean;
      /** Housing kind at that day (rent of an own / inherited home reads as upkeep) and whether the cat was alive. */
      home?: string; cat?: boolean }
  | { id: number; kind: 'typing'; speaker: string; pStage?: PartnerStage | null }
  | { id: number; kind: 'card'; eventId: string; variant: CardVariant; age: number; narration: { key: string; params?: Params } | null;
      wager: WagerOffer | null; stamp: { result: StampResult; variant: number } | null; /** partner stage that day (header label) */ pStage?: PartnerStage | null }
  | { id: number; kind: 'npc'; speaker: string; avatar?: string; key: string; params?: Params; /** player age when said (NPC faces age along) */ age?: number;
      /** partner stage when said: the partner speaks as EŞ / NİŞANLI */ pStage?: PartnerStage | null }
  | { id: number; kind: 'reply'; key?: string; raw?: string; auto: boolean }
  | { id: number; kind: 'outcome'; key: string; params?: Params; deltas: Delta[] }
  | { id: number; kind: 'coach'; key?: string; params?: Params; ui?: UiLine; roast?: boolean; lift?: boolean }
  | { id: number; kind: 'report'; data: ReportCardData; motto: string }
  | { id: number; kind: 'sys'; ui: UiLine }
  | { id: number; kind: 'mundane'; ui: UiLine });

/**
 * Text of one flowLog money line. Own / inherited home: the engine's upkeep kind (or, from an engine without it, a
 * `rent` line while the home is owned) reads as dues / upkeep, never as a landlord (deneyim P0-1). "Cat food
 * included" only while the cat is alive (P0-2): the engine's own flag on the line when it has one, else the
 * state at that day.
 */
export function flowLineText(s: Strings, line: GapLine, item: { momsHouse: boolean; home?: string; cat?: boolean }): string {
  const kind = String(line.kind);
  const l = line as GapLine & { cat?: unknown; catFood?: unknown };
  if (kind === 'rent' && item.momsHouse) return s.flow.rentMom(line.para);
  if (UPKEEP_KINDS.has(kind) || (kind === 'rent' && item.home === 'owned')) return s.flow.upkeep(line.para);
  if (kind === 'daily') {
    const cat = typeof l.cat === 'boolean' ? l.cat : typeof l.catFood === 'number' ? l.catFood !== 0 : item.cat === true;
    return cat ? s.flow.dailyCat(line.para) : s.flow.daily(line.para);
  }
  const f = (s.flow as unknown as Record<string, ((x: number) => string) | undefined>)[kind];
  return f ? f(line.para) : s.flow.daily(line.para);
}
const UPKEEP_KINDS = new Set(['upkeep', 'dues', 'aidat', 'maintenance', 'homeUpkeep', 'ownedUpkeep']);

export type FeedItemOf<K extends FeedItem['kind']> = Extract<FeedItem, { kind: K }>;
