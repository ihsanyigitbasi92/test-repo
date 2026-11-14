/**
 * The content the app plays (D-156).
 *
 * - Base: the top-level + demo fixtures, statically bundled (fixtures.gen.ts) — always there, so a life can start
 *   even with no packs (offline web, a failed fetch).
 * - Packs: the production pool (packages/content-schema/fixtures/pack/**), built into age-band packs by
 *   `build:packs` and loaded lazily through `./packs` (web: fetch next to index.html; native: require()).
 *   At life start `core` + the band of age 18 are loaded; the next band is prefetched `PREFETCH_YEARS` before
 *   the birthday that crosses into it and merged when that birthday is reached. Loaded bands stay loaded
 *   (cumulative), so followUps / chains into earlier packs always resolve.
 * - The engine takes its content per `step()` call and indexes each bundle object once (WeakMap), so growing the
 *   bundle mid-life is a new object passed to the next `step()`. A life keeps the contentHash it started with.
 * Validation happens at build/test time (content-schema, D-099); zod never enters the app bundle.
 */
import { cyrb128, indexContent } from '@motto/engine';
import type { ContentBundle, GameEvent } from '@motto/engine';
import { RAW_EVENTS, RAW_SKIP_LINES } from './fixtures.gen';
import { loadManifest, loadPack, PACK_SOURCE } from './packs';
import type { PackEntry, PackFile, PackManifest } from './packTypes';

export type { PackEntry, PackFile, PackManifest };
export { PACK_SOURCE };

/** Years before a band's first birthday at which its pack is prefetched. */
export const PREFETCH_YEARS = 2;
/** Age a life starts at (engine: Client File day 0). */
export const START_AGE = 18;

const hash16 = (s: string) => cyrb128(s).map((h) => h.toString(16)).join('').slice(0, 16);
const baseEvents = RAW_EVENTS as GameEvent[];
const baseSkip = RAW_SKIP_LINES as ContentBundle['skipLines'];
const baseHash = hash16(baseEvents.map((e) => `${e.id}@${e.v}`).join('|'));

/** The statically bundled fixtures alone (tests, fallback). */
export const BASE_BUNDLE: ContentBundle = { contentHash: baseHash, events: baseEvents, skipLines: baseSkip };

let current: ContentBundle = BASE_BUNDLE;
let manifest: PackManifest | null = null;
let manifestP: Promise<PackManifest | null> | null = null;
const data = new Map<string, PackFile>();                       // fetched / required, by pack name
const inflight = new Map<string, Promise<void>>();
const merged = new Set<string>();                               // pack names inside `current`
const listeners = new Set<() => void>();
let lifeAge = START_AGE;                                        // last age seen by advanceContent

/** The bundle to pass to the next `step()` / `renderText()`. */
export const getBundle = (): ContentBundle => current;
/** Called whenever packs are merged into the bundle. */
export const onContentChange = (l: () => void): (() => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
/** Pack names currently in the bundle. */
export const mergedPacks = (): string[] => [...merged];

/** Packs a life at `age` needs: `core` + every band whose minAge ≤ age. */
export const packsForAge = (m: PackManifest, age: number): PackEntry[] => m.packs.filter((p) => p.minAge === null || p.minAge <= age);

function getManifest(): Promise<PackManifest | null> {
  manifestP ??= loadManifest().then((m) => (manifest = m)).catch((e) => { console.warn('[content] manifest:', e); manifestP = null; return null; });
  return manifestP;
}

function fetchPack(p: PackEntry): Promise<void> {
  if (data.has(p.name)) return Promise.resolve();
  let f = inflight.get(p.name);
  if (!f) {
    f = loadPack(p.file)
      .then((d) => { if (d) data.set(p.name, d); })
      .catch((e) => { console.warn(`[content] pack ${p.name}:`, e); })
      .finally(() => { inflight.delete(p.name); });
    inflight.set(p.name, f);
  }
  return f;
}

/** Rebuilds `current` from base + every loaded pack whose minAge ≤ age (never drops a merged pack). */
function mergeUpTo(age: number): void {
  if (!manifest) return;
  const add = packsForAge(manifest, age).filter((p) => data.has(p.name) && !merged.has(p.name));
  if (!add.length) return;
  for (const p of add) merged.add(p.name);
  const seen = new Set(baseEvents.map((e) => e.id));
  const events = [...baseEvents];
  const skipLines = [...baseSkip];
  for (const p of manifest.packs) {
    if (!merged.has(p.name)) continue;
    const d = data.get(p.name)!;
    for (const e of d.events as GameEvent[]) if (!seen.has(e.id)) { seen.add(e.id); events.push(e); }
    skipLines.push(...(d.skipLines as ContentBundle['skipLines']));
  }
  current = { contentHash: hash16(`${baseHash}|${manifest.contentHash}`), events, skipLines };
  for (const l of listeners) l();
}

/** True when every pack a life at `age` needs is in the bundle (or there are no packs to load). */
export function contentReadyFor(age: number): boolean {
  if (!manifest) return false;
  return packsForAge(manifest, age).every((p) => merged.has(p.name));
}

/**
 * Loads (and merges) everything a life at `age` needs. Resolves even when loading fails — the bundle then holds
 * whatever did load (at worst the base fixtures), so the game never blocks on the network.
 */
export async function prepareContent(age: number = START_AGE): Promise<void> {
  lifeAge = age;
  const m = await getManifest();
  if (!m) return;
  await Promise.all(packsForAge(m, age).map(fetchPack));
  mergeUpTo(age);
}

/**
 * Per step: merge the packs the current age has reached (already fetched) and prefetch the band
 * `PREFETCH_YEARS` ahead, so the birthday that crosses into it finds the pack in memory.
 */
export function advanceContent(age: number): void {
  lifeAge = age;
  if (!manifest) { void getManifest().then((m) => { if (m) advanceContent(lifeAge); }); return; }
  mergeUpTo(age);
  for (const p of packsForAge(manifest, age + PREFETCH_YEARS)) {
    if (data.has(p.name) || inflight.has(p.name)) continue;
    void fetchPack(p).then(() => mergeUpTo(lifeAge));          // a late pack joins as soon as it lands
  }
}

/** Read-only lookup of an event's content (document letterhead, tags) — never used to decide rules. */
export const eventById = (id: string): GameEvent | undefined => indexContent(current).byId.get(id);
