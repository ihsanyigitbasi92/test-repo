/**
 * Content indexing and text keys. The engine never carries prose: it emits `textKey`s the UI turns back into
 * the bundle's tr/en strings with `resolveText` (10 §3.3). Key formats (all built here, nowhere else):
 *   evt.<id>.text.<variantId>                 narration variant (`text[]`)
 *   evt.<id>.dialog.<i>  · evt.<id>.dialog.<i>.alt.<k>     dialog line i (or its k-th alt variant)
 *   evt.<id>.c.<choice>                       choice / player reply bubble
 *   evt.<id>.o.<choice>.<b>.text | .nearMiss | .coach.<j>  outcome branch b
 *   evt.<id>.wager.slip                       wager slip
 *   skip.<lineId>                             skip-summary line
 *   skip.generic · coach.wager.slip.default   engine fallbacks (SYSTEM_TEXT)
 */
import type { GameEvent, OutcomeT, ChoiceT, SkipLineT, Locale } from '@motto/content-schema';
import type { ContentBundle } from './types';

export interface ContentIndex {
  bundle: ContentBundle;
  byId: Map<string, GameEvent>;
  pool: GameEvent[];            // selectable by the director (not report_card, not legendary)
  free: GameEvent[];            // pool minus calls (calls arrive only through the mom-call trigger)
  surprise: { nice: GameEvent[]; great: GameEvent[] };
  legendary: GameEvent[];
  shared: GameEvent[];          // Günün Günü pool (`shared:true`), sorted by id so every device sees the same order
  skipLines: SkipLineT[];
}

const cache = new WeakMap<ContentBundle, ContentIndex>();

export function indexContent(bundle: ContentBundle): ContentIndex {
  const hit = cache.get(bundle);
  if (hit) return hit;
  const byId = new Map<string, GameEvent>();
  for (const e of bundle.events) byId.set(e.id, e);
  const pool = bundle.events.filter((e) => e.type !== 'report_card' && e.rarity !== 'legendary');
  const free = pool.filter((e) => e.type !== 'call');
  const idx: ContentIndex = {
    bundle, byId, pool, free,
    surprise: { nice: free.filter((e) => e.tags.includes('surprise.nice')), great: free.filter((e) => e.tags.includes('surprise.great')) },
    legendary: bundle.events.filter((e) => e.rarity === 'legendary'),
    shared: free.filter((e) => e.shared).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)),
    skipLines: bundle.skipLines,
  };
  cache.set(bundle, idx);
  return idx;
}

export const branchesOf = (o: OutcomeT | OutcomeT[]): OutcomeT[] => (Array.isArray(o) ? o : [o]);
export const choiceOf = (ev: GameEvent, id: string): ChoiceT | undefined => ev.choices.find((c) => c.id === id);

export const keyText = (ev: GameEvent, variantId: string) => `evt.${ev.id}.text.${variantId}`;
export const keyDialog = (ev: GameEvent, i: number, alt?: number) => (alt === undefined ? `evt.${ev.id}.dialog.${i}` : `evt.${ev.id}.dialog.${i}.alt.${alt}`);
export const keyChoice = (ev: GameEvent, c: string) => `evt.${ev.id}.c.${c}`;
export const keyOutcome = (ev: GameEvent, c: string, b: number) => `evt.${ev.id}.o.${c}.${b}.text`;
export const keyNearMiss = (ev: GameEvent, c: string, b: number) => `evt.${ev.id}.o.${c}.${b}.nearMiss`;
export const keyCoach = (ev: GameEvent, c: string, b: number, j: number) => `evt.${ev.id}.o.${c}.${b}.coach.${j}`;
export const keySlip = (ev: GameEvent) => (ev.wager?.slip ? `evt.${ev.id}.wager.slip` : 'coach.wager.slip.default');
export const keySkip = (line: SkipLineT) => `skip.${line.id}`;

/** Fallback strings for the two keys the engine invents without content (the UI catalog may override them). */
export const SYSTEM_TEXT: Readonly<Record<string, Readonly<Record<Locale, string>>>> = {
  'skip.generic': { tr: '{days} gün geçti.', en: '{days} days passed.' },
  'coach.wager.slip.default': { tr: 'İDDİA: Olmaz. — M.', en: 'WAGER: Won\'t happen. — M.' },
};

type Pair = { tr: string; en: string } | undefined;
const pick = (p: Pair, locale: Locale): string | null => (p ? p[locale] : null);
const nat = (s: string | undefined): number => (s !== undefined && /^\d+$/.test(s) ? Number(s) : -1);

function resolveEventKey(ev: GameEvent, rest: string[], locale: Locale): string | null {
  const [kind, a, b, c, d] = rest;
  switch (kind) {
    case 'text': return pick(ev.text?.find((t) => t.id === rest.slice(1).join('.')), locale);
    case 'dialog': {
      const line = ev.dialog?.[nat(a)];
      if (!line) return null;
      if (b === undefined) return line[locale];
      return b === 'alt' ? pick(line.alt?.[nat(c)], locale) : null;
    }
    case 'c': return pick(a === undefined ? undefined : choiceOf(ev, a), locale);
    case 'o': {
      const out = a === undefined ? undefined : ev.outcomes[a];
      const br = out ? branchesOf(out)[nat(b)] : undefined;
      if (!br) return null;
      if (c === 'text') return br[locale];
      if (c === 'nearMiss') return pick(br.nearMiss, locale);
      if (c === 'coach') return pick(br.coach[nat(d)], locale);
      return null;
    }
    case 'wager': return a === 'slip' ? pick(ev.wager?.slip, locale) : null;
    default: return null;
  }
}

/** Pure inverse of the key builders above: `textKey` → the bundle's string for `locale` (null when unknown). */
export function resolveText(bundle: ContentBundle, key: string, locale: Locale): string | null {
  const sys = SYSTEM_TEXT[key];
  if (sys) return sys[locale];
  if (key.startsWith('skip.')) return pick(bundle.skipLines.find((l) => l.id === key.slice(5)), locale);
  if (!key.startsWith('evt.')) return null;
  const parts = key.split('.');
  const ev = indexContent(bundle).byId.get(parts[1] ?? '');
  return ev ? resolveEventKey(ev, parts.slice(2), locale) : null;
}

/** Fill `{param}` placeholders (unknown ones are left as written). */
export function fillParams(text: string, params: Readonly<Record<string, number | string>> | undefined): string {
  if (!params) return text;
  return text.replace(/\{([a-zA-Z]+)\}/g, (m, k: string) => (params[k] !== undefined ? String(params[k]) : m));
}

/** resolveText + fillParams; convenience for UIs and tests. */
export function renderText(bundle: ContentBundle, key: string, locale: Locale, params?: Readonly<Record<string, number | string>>): string | null {
  const t = resolveText(bundle, key, locale);
  return t === null ? null : fillParams(t, params);
}
