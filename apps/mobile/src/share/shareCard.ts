/**
 * Share card data ("Müşteri Dosyası — KAPANDI", pure TS, unit-tested in node).
 *
 * Picks what the card says from the finished life: name (the character name the player typed — the only name on
 * the card), birth–death years and age, 3–4 highlight rows (career, family, best moment, hardest moment), a gentle
 * farewell line for the cause CLASS (never the roast's joke line, never a joke about the death), and the coach's
 * last word. No city, no device / account data, no real person: everything comes from the engine's LifeState.
 */
import type { Locale } from '@motto/engine';
import type { Strings } from '../i18n/tr';
import { jobLabel } from '../i18n/labels';
import type { LifeHighlights } from './highlights';

export type ShareFormat = 'story' | 'square';
export const SHARE_SIZE: Record<ShareFormat, { w: number; h: number }> = { story: { w: 1080, h: 1920 }, square: { w: 1080, h: 1080 } };
/** Placeholder until the store listings are live (open issue: swap in the real short link). */
export const STORE_LINK_PLACEHOLDER = 'motto · App Store · Google Play';

export interface ShareRow { key: 'career' | 'family' | 'best' | 'worst'; label: string; text: string }
export interface ShareCardData {
  locale: Locale;
  title: string;
  closed: string;
  name: string;
  years: string;
  ageLine: string;
  farewell: string;
  rows: ShareRow[];
  lastWordLabel: string;
  lastWord: string;
  stamp: string;
  by: string;
  link: string;
}

export interface ShareInput {
  name: string;
  birthYear: number;
  deathYear: number;
  age: number;
  /** Engine death cause id (e.g. `circ`, `circ_absurd`): only its class is used. */
  cause: string;
  highlights: LifeHighlights;
  family: { married: boolean; marriedYears: number | null; hasChild: boolean; hasGrandchild: boolean; partner: boolean };
  /** Final job (a retiree has title `emekli`). */
  job: { title: string; tier: number } | null;
  lastWord: string;
}

/** Engine cause id (`<band>.<class>`, e.g. `overtime.circ`) → class; anything else → `unknown`. */
export function causeClass(cause: string): string {
  const base = cause.split('.').pop() ?? 'unknown';
  return ['circ', 'tumor', 'resp', 'accident', 'external', 'absurd'].includes(base) ? base : 'unknown';
}

const clip = (x: string, max: number): string => (x.length <= max ? x : `${x.slice(0, max - 1).trimEnd()}…`);

export function buildShareCard(locale: Locale, s: Strings, inp: ShareInput): ShareCardData {
  const c = s.shareCard;
  const rows: ShareRow[] = [];
  const top = inp.highlights.topJob;
  const retired = inp.job?.title === 'emekli';
  if (top) rows.push({ key: 'career', label: c.career, text: c.careerLine(jobLabel(s, locale, top.title, top.tier), retired) });
  else if (retired) rows.push({ key: 'career', label: c.career, text: c.retiredOnly });
  const f = inp.family;
  const fam: string[] = [];
  if (f.married && f.marriedYears !== null) fam.push(c.married(f.marriedYears));
  else if (f.partner) fam.push(c.partner);
  if (f.hasChild) fam.push(c.child);
  if (f.hasGrandchild) fam.push(c.grandchild);
  if (fam.length) rows.push({ key: 'family', label: c.family, text: fam.join(' · ') });
  const b = inp.highlights.best;
  if (b) rows.push({ key: 'best', label: c.best, text: c.bestLine[b.kind](b.age, b.odds ?? 0) });
  const w = inp.highlights.worst;
  if (w) rows.push({ key: 'worst', label: c.worst, text: c.worstLine[w.kind](w.age, w.odds ?? 0) });
  if (rows.length < 3 && !fam.length) rows.push({ key: 'family', label: c.family, text: c.ownWay });
  return {
    locale,
    title: c.title,
    closed: c.closed,
    name: clip(inp.name.trim() || c.noName, 28),
    years: `${inp.birthYear}–${inp.deathYear}`,
    ageLine: c.age(inp.age),
    farewell: c.farewell[causeClass(inp.cause)] ?? c.farewell.unknown!,
    rows: rows.slice(0, 4),
    lastWordLabel: c.lastWord,
    lastWord: clip(inp.lastWord, 160),
    stamp: 'MOTTO',
    by: 'by D2P Technology',
    link: STORE_LINK_PLACEHOLDER,
  };
}

/** Text that goes with the image (share sheet message / alt text). */
export function shareMessage(d: ShareCardData): string {
  return `${d.title} · ${d.name} (${d.years}) — ${d.closed}. “${d.lastWord}” · MOTTO`;
}
