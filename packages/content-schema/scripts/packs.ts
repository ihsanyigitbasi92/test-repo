/**
 * Content packs (D-156) — the pure part of `build-packs`, shared with the tests that play the full pool.
 *
 * - Reads every event under fixtures/pack/** (and *.skip.json skip lines), validates it with the one zod schema,
 *   and drops authoring-only fields the runtime never reads (`intent`, `review`, `notes`, `wager.reason`,
 *   `l10n.mechanismNote`).
 * - Groups the events into age-band packs from their age preconditions (`pre.age.min`, AND-ed `pre.all[*].age`,
 *   `ageBand`): an event goes to the band holding the youngest age it can fire at. No age bound → `core`.
 * - The app loads packs cumulatively (core + every band it has reached), so a pack only has to hold what can fire
 *   from its band on. Cross-pack references are pulled down: a followUp / envelope-resolver target and every node
 *   of a chain live in the earliest pack that references them, so a reference is never to an unloaded event.
 * Files that cannot be parsed (e.g. half-written by a concurrent author) are retried, then reported and skipped.
 */
import { readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { GameEventSchema, SkipLine } from '../src/index';
import type { GameEvent, Pre, SkipLineT } from '../src/index';
import { FIXTURES, collectJson } from './lib';

export const PACK_ROOT = join(FIXTURES, 'pack');

/** Age-band packs in load order; `core` (no age bound) is always loaded first. `maxAge: null` = open-ended. */
export const PACK_BANDS = [
  { name: '18-25', minAge: 18, maxAge: 25 },
  { name: '26-35', minAge: 26, maxAge: 35 },
  { name: '36-50', minAge: 36, maxAge: 50 },
  { name: '51-65', minAge: 51, maxAge: 65 },
  { name: '66plus', minAge: 66, maxAge: null },
] as const;
export type PackName = 'core' | (typeof PACK_BANDS)[number]['name'];
export const PACK_ORDER: readonly PackName[] = ['core', ...PACK_BANDS.map((b) => b.name)];

/** Youngest age per engine band (tuning.json dayBudget.bands: warmup ≤25, season ≤40, secondHalf ≤60, overtime). */
const AGE_BAND_MIN: Record<string, number> = { warmup: 18, season: 26, secondHalf: 41, overtime: 61 };

/** An event as shipped in a pack: authoring metadata removed. The engine never reads those fields. */
export type PackedEvent = Omit<GameEvent, 'intent' | 'review'>;
export interface Pack { name: PackName; minAge: number | null; maxAge: number | null; events: PackedEvent[]; skipLines: SkipLineT[] }

/** Youngest age at which `pre` can hold, or null when it sets no lower age bound (only AND-ed bounds count). */
export function minAgeOf(pre: Pre | undefined): number | null {
  if (!pre) return null;
  let m: number | null = pre.age?.min ?? null;
  for (const p of pre.all ?? []) {
    const k = minAgeOf(p);
    if (k !== null) m = m === null ? k : Math.max(m, k);
  }
  return m;
}

export function hasAgeBound(ev: Pick<GameEvent, 'pre' | 'ageBand'>): boolean {
  const any = (p: Pre | undefined): boolean => !!p && (!!p.age || (p.all ?? []).some(any));
  return any(ev.pre) || !!ev.ageBand?.length;
}

/** Pack an event belongs to by its own preconditions (before reference pull-down). */
export function packOf(ev: Pick<GameEvent, 'pre' | 'ageBand'>): PackName {
  if (!hasAgeBound(ev)) return 'core';
  let min = minAgeOf(ev.pre) ?? 18;
  if (ev.ageBand?.length) min = Math.max(min, Math.min(...ev.ageBand.map((b) => AGE_BAND_MIN[b] ?? 18)));
  for (let i = PACK_BANDS.length - 1; i >= 0; i--) if (min >= PACK_BANDS[i]!.minAge) return PACK_BANDS[i]!.name;
  return PACK_BANDS[0].name;
}

/** Packs to hold at `age` (cumulative: core + every band whose minAge ≤ age). */
export function packsForAge(age: number): PackName[] {
  return ['core', ...PACK_BANDS.filter((b) => b.minAge <= age).map((b) => b.name)];
}

/** Drops authoring-only fields; everything the engine / UI reads is kept as is. */
export function stripAuthoring(ev: GameEvent): PackedEvent {
  const { intent: _i, review: _r, ...rest } = ev as GameEvent & { notes?: unknown };
  const out = rest as PackedEvent & { notes?: unknown };
  delete out.notes;
  if (out.wager && 'reason' in out.wager) { const { reason: _w, ...w } = out.wager; out.wager = w; }
  if (out.l10n) {
    const { mechanismNote: _m, ...l } = out.l10n;
    if (Object.keys(l).length) out.l10n = l; else delete out.l10n;
  }
  return out;
}

export interface LoadIssue { file: string; kind: 'unreadable' | 'schema' | 'duplicate'; message: string }

function readJson(file: string, retries = 3): unknown {
  for (let i = 0; ; i++) {
    try { return JSON.parse(readFileSync(file, 'utf8')); } catch (e) {
      if (i >= retries) throw e;
      const until = Date.now() + 150;                     // a concurrent writer may be mid-file: wait and retry
      while (Date.now() < until) { /* spin */ }
    }
  }
}

/** Reads + validates the pack pool. Invalid / unreadable files are returned as issues, never thrown. */
export function loadPackPool(root = PACK_ROOT): { events: GameEvent[]; skipLines: SkipLineT[]; files: number; issues: LoadIssue[] } {
  const files = collectJson([root]);
  const events: GameEvent[] = [];
  const skipLines: SkipLineT[] = [];
  const issues: LoadIssue[] = [];
  const seen = new Set<string>();
  for (const file of files) {
    let raw: unknown;
    try { raw = readJson(file); } catch (e) { issues.push({ file, kind: 'unreadable', message: (e as Error).message }); continue; }
    if (basename(file).endsWith('.skip.json')) {
      const r = SkipLine.array().safeParse(raw);
      if (r.success) skipLines.push(...r.data);
      else issues.push({ file, kind: 'schema', message: r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') });
      continue;
    }
    const r = GameEventSchema.safeParse(raw);
    if (!r.success) { issues.push({ file, kind: 'schema', message: r.error.issues.slice(0, 5).map((i) => `${i.path.join('.') || '<root>'}: ${i.message}`).join('; ') }); continue; }
    const ev = r.data as GameEvent;
    if (seen.has(ev.id)) { issues.push({ file, kind: 'duplicate', message: `duplicate event id ${ev.id}` }); continue; }
    seen.add(ev.id);
    events.push(ev);
  }
  return { events, skipLines, files: files.length, issues };
}

/** Event ids an event points at (followUp, envelope resolver). */
function refsOf(ev: GameEvent): string[] {
  const out: string[] = [];
  for (const o of Object.values(ev.outcomes)) for (const b of Array.isArray(o) ? o : [o]) {
    for (const f of b.effects?.followUp ?? []) out.push(f.eventId);
    if (b.effects?.envelope) out.push(b.effects.envelope.resolverEventId);
  }
  return out;
}

/**
 * Groups validated events into packs (stripped, sorted by id inside each pack for stable bytes / hashes).
 * `exclude`: ids already shipped elsewhere (the app's statically bundled fixtures) — dropped from the packs.
 */
export function groupPacks(events: readonly GameEvent[], skipLines: readonly SkipLineT[] = [], exclude: ReadonlySet<string> = new Set()): Pack[] {
  const pool = events.filter((e) => !exclude.has(e.id));
  const rank = new Map<string, number>(pool.map((e) => [e.id, PACK_ORDER.indexOf(packOf(e))]));
  // chains: every node in the chain's earliest pack
  const chainMin = new Map<string, number>();
  for (const e of pool) if (e.chain) chainMin.set(e.chain.id, Math.min(chainMin.get(e.chain.id) ?? Infinity, rank.get(e.id)!));
  for (const e of pool) if (e.chain) rank.set(e.id, chainMin.get(e.chain.id)!);
  // references: target no later than its earliest referrer (fixpoint; ranks only decrease)
  for (let changed = true; changed;) {
    changed = false;
    for (const e of pool) for (const t of refsOf(e)) {
      const rt = rank.get(t), re = rank.get(e.id)!;
      if (rt !== undefined && rt > re) { rank.set(t, re); changed = true; }
    }
    for (const e of pool) if (e.chain) {
      const r = rank.get(e.id)!;
      if (r < chainMin.get(e.chain.id)!) { chainMin.set(e.chain.id, r); changed = true; }
    }
    for (const e of pool) if (e.chain && rank.get(e.id)! > chainMin.get(e.chain.id)!) { rank.set(e.id, chainMin.get(e.chain.id)!); changed = true; }
  }
  const packs: Pack[] = PACK_ORDER.map((name) => {
    const band = PACK_BANDS.find((b) => b.name === name);
    return { name, minAge: band?.minAge ?? null, maxAge: band?.maxAge ?? null, events: [], skipLines: name === 'core' ? [...skipLines] : [] };
  });
  for (const e of [...pool].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))) packs[rank.get(e.id)!]!.events.push(stripAuthoring(e));
  return packs;
}
