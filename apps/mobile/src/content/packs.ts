/**
 * Content pack source — web (and the default for tests / tools). D-156: packs are not in the JS bundle; the web
 * export publishes them next to index.html as `content/<pack>.json` (+ `content/manifest.json`), built by
 * `@motto/content-schema build:packs`. They are fetched relative to the page, so the export works under any base path.
 * Metro picks `packs.native.ts` on iOS / Android instead (same API, `require()`d JSON).
 * Outside a browser (vitest, node) there is no page to resolve against: every load resolves to null.
 */
import type { PackFile, PackManifest } from './packTypes';

export const PACK_SOURCE = 'fetch' as const;

async function getJson<T>(file: string): Promise<T | null> {
  if (typeof document === 'undefined' || typeof fetch === 'undefined') return null;
  const url = new URL(`content/${encodeURIComponent(file)}`, document.baseURI).toString();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return (await res.json()) as T;
}

export const loadManifest = (): Promise<PackManifest | null> => getJson<PackManifest>('manifest.json');
export const loadPack = (file: string): Promise<PackFile | null> => getJson<PackFile>(file);
