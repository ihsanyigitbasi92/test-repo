/**
 * Save / continue (playtest 2026-11-12: a reload lost the life and the language).
 *
 * One versioned JSON blob under `SAVE_KEY`: the engine's LifeState + MetaState as returned by `step()` (plain
 * JSON — the engine itself hashes `JSON.stringify(state)`), plus the UI-only state needed to put the screen back
 * where it was: the look of the life, locale, life number, speed / auto / fastLife prefs, the last feed items and
 * a few per-life UI counters. Pure TS (no React Native imports) so it is unit-tested in node.
 *
 * A save is dropped (the app starts fresh) when it does not parse, has another version, or was written against
 * other content (`contentHash` of the merged bundle) — a life must never continue on events it did not start with —
 * or by an engine whose LifeState has another shape (`engineShape`: a field added / renamed since the save).
 */
import { ENGINE_VERSION, createLife, cyrb128 } from '@motto/engine';
import type { LifeState, Locale, MetaState, ReportCardData, Speed } from '@motto/engine';
import type { Look } from '../avatar/look';
import type { MomentHistory } from '../avatar/moments';
import type { LifeHighlights } from '../share/highlights';
import type { FeedItem } from './feed';

export const SAVE_KEY = 'motto.save.v1';
export const SAVE_VERSION = 1 as const;
/** Feed items kept in a save (enough that the screen is not empty on resume). */
export const SAVE_FEED_ITEMS = 40;

export interface SavedLife {
  state: LifeState;
  look: Look | null;
  lifeNo: number;
  feed: FeedItem[];
  ui: {
    autoDays: number;
    lowJoyShown: boolean;
    healthWarned?: boolean;
    lastMotto: string | null;
    lastReport: ReportCardData | null;
    unread: number;
    momentHist: MomentHistory;
    /** The "enough for today" sheet was up when saved. */
    session: { years: number; days: number } | null;
    /** Share card highlights (share/highlights.ts); absent in saves written before the share card. */
    highlights?: LifeHighlights;
  };
}

export interface SaveV1 {
  v: typeof SAVE_VERSION;
  savedAt: number;
  /** `engineShape()` of the engine that wrote the save. */
  engine: string;
  /** contentHash of the content bundle the save was written with. */
  contentHash: string;
  locale: Locale;
  speed: Speed;
  auto: boolean;
  fastLife: boolean;
  meta: MetaState;
  /** null between lives (after a death): the next launch opens the Client File with the right life number. */
  life: SavedLife | null;
}

/** Sorted key paths of a plain object tree (arrays and empty records are leaves). */
function shapeOf(x: unknown, path: string, out: string[]): void {
  if (typeof x !== 'object' || x === null || Array.isArray(x)) return;
  for (const k of Object.keys(x).sort()) { out.push(`${path}${k}`); shapeOf((x as Record<string, unknown>)[k], `${path}${k}.`, out); }
}
let shapeMemo: string | null = null;
/** Fingerprint of the engine's LifeState layout (+ ENGINE_VERSION): a save from another layout is not resumed. */
export function engineShape(): string {
  if (shapeMemo) return shapeMemo;
  const keys: string[] = [];
  shapeOf(createLife('shape', 'shape', 'shape'), '', keys);
  shapeMemo = `${ENGINE_VERSION}:${cyrb128(keys.join('|')).map((h) => h.toString(16)).join('')}`;
  return shapeMemo;
}

const LOCALES: readonly string[] = ['tr', 'en'];
const SPEEDS: readonly string[] = ['pause', 'play', 'fast'];
const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);

/** Feed items that only make sense mid-animation are not saved. */
export function feedForSave(feed: readonly FeedItem[]): FeedItem[] {
  return feed.filter((f) => f.kind !== 'typing').slice(-SAVE_FEED_ITEMS);
}

export function encodeSave(save: SaveV1): string {
  return JSON.stringify(save);
}

/**
 * Parses and validates a stored blob. Returns null for anything that cannot be resumed safely
 * (missing, corrupt, other version, unknown locale/speed, a life without engine state).
 */
export function decodeSave(raw: string | null | undefined): SaveV1 | null {
  if (!raw) return null;
  let x: unknown;
  try { x = JSON.parse(raw); } catch { return null; }
  if (!isObj(x) || x.v !== SAVE_VERSION || x.engine !== engineShape()) return null;
  if (typeof x.contentHash !== 'string' || !LOCALES.includes(x.locale as string) || !SPEEDS.includes(x.speed as string)) return null;
  if (!isObj(x.meta) || (x.meta as { schemaVersion?: unknown }).schemaVersion !== 1 || !isObj((x.meta as { legacy?: unknown }).legacy)) return null;
  if (x.life !== null) {
    if (!isObj(x.life)) return null;
    const life = x.life as Record<string, unknown>;
    const st = life.state;
    if (!isObj(st) || st.schemaVersion !== 1 || !isObj(st.calendar) || !isObj(st.status) || typeof st.lifeSeed !== 'string') return null;
    if (st.phase === 'dead' || st.death) return null;                       // a finished life is never resumed
    if (!Array.isArray(life.feed) || !isObj(life.ui) || typeof life.lifeNo !== 'number') return null;
  }
  return { ...(x as unknown as SaveV1), auto: !!x.auto, fastLife: !!x.fastLife };
}

/** A save is usable only with the content it was written against. */
export const saveMatchesContent = (save: SaveV1, contentHash: string): boolean => save.contentHash === contentHash;

/** Engine age of the saved life (content packs for this age must be loaded before its first step). */
export const savedAge = (save: SaveV1): number | null => save.life?.state.calendar.age ?? null;
