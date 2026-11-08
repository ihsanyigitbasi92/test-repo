/**
 * Shared helpers for the content production CLIs (validate, count, redline, dupes).
 * Pure Node (type stripping + scripts/ts-register.mjs); no extra dependencies.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, basename, relative, sep } from 'node:path';

export const PKG_ROOT = join(import.meta.dirname, '..');
export const REPO_ROOT = join(PKG_ROOT, '..', '..');
export const FIXTURES = join(PKG_ROOT, 'fixtures');
export const TAXONOMY = join(REPO_ROOT, 'docs', 'content', 'taxonomy.json');

/** Every *.json under the given paths (directories are walked recursively), sorted. */
export function collectJson(paths: string[]): string[] {
  const out: string[] = [];
  const walk = (p: string): void => {
    if (statSync(p).isDirectory()) {
      for (const f of readdirSync(p)) {
        if (f.startsWith('.') || f === 'node_modules') continue;
        walk(join(p, f));
      }
    } else if (p.endsWith('.json')) out.push(p);
  };
  for (const p of paths) walk(p);
  return out.sort();
}

export const isSkipFile = (f: string): boolean => basename(f).endsWith('.skip.json');

export interface Domain { id: string; group: string; title_tr: string; title_en: string; quota: number }

export function loadTaxonomy(path = TAXONOMY): Domain[] {
  return existsSync(path) ? (JSON.parse(readFileSync(path, 'utf8')) as Domain[]) : [];
}

/**
 * Where a file belongs: a taxonomy domain when any folder on its path (below fixtures/) is a domain id —
 * so both fixtures/pack/<domain>/ and fixtures/pack/<group>/<domain>/ work — otherwise the top folder
 * (`demo`, `pack`, …) or `core` for files directly in fixtures/.
 */
export function bucketOf(file: string, domainIds: Set<string>, root = FIXTURES): { domain?: string; bucket: string } {
  const r = relative(root, file);
  if (r.startsWith('..')) return { bucket: 'external' };
  const parts = r.split(sep).slice(0, -1);
  for (const part of [...parts].reverse()) if (domainIds.has(part)) return { domain: part, bucket: part };
  return { bucket: parts[0] ?? 'core' };
}

/** Loads the event files (not *.skip.json) under the given paths as raw JSON, with their file names. */
export function loadRawEvents(paths: string[]): { file: string; raw: any }[] {
  return collectJson(paths).filter((f) => !isSkipFile(f)).map((file) => ({ file, raw: JSON.parse(readFileSync(file, 'utf8')) }));
}

/** Every `tr` / `en` string anywhere in an event, with its JSON path (dialog, choices, outcomes, coach, slips, docs…). */
export function localeStrings(ev: unknown): { locale: 'tr' | 'en'; path: string; text: string }[] {
  const out: { locale: 'tr' | 'en'; path: string; text: string }[] = [];
  const walk = (x: unknown, path: string): void => {
    if (Array.isArray(x)) x.forEach((v, i) => walk(v, `${path}[${i}]`));
    else if (x && typeof x === 'object') {
      for (const [k, v] of Object.entries(x)) {
        const p = path ? `${path}.${k}` : k;
        if ((k === 'tr' || k === 'en') && typeof v === 'string') out.push({ locale: k, path: p, text: v });
        else walk(v, p);
      }
    }
  };
  walk(ev, '');
  return out;
}

/** Locale-aware case fold used by matching: lower-case, unify apostrophes, drop circumflexes (â î û). */
export function fold(s: string, locale: 'tr' | 'en'): string {
  return s.toLocaleLowerCase(locale === 'tr' ? 'tr-TR' : 'en-US')
    .replace(/[’‘`´]/g, "'")
    .replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u');
}

export const rel = (f: string): string => relative(REPO_ROOT, f);

/** argv helpers: `--name value` / `--name=value` options and boolean flags; the rest are positional. */
export function parseArgs(argv: string[], valued: string[] = []): { pos: string[]; opt: Record<string, string | true> } {
  const pos: string[] = [];
  const opt: Record<string, string | true> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a.startsWith('-')) {
      const [k = '', v] = a.replace(/^-+/, '').split('=', 2);
      if (v !== undefined) opt[k] = v;
      else if (valued.includes(k) && i + 1 < argv.length) opt[k] = argv[++i]!;
      else opt[k] = true;
    } else pos.push(a);
  }
  return { pos, opt };
}
