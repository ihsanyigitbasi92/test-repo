/**
 * Content pack source — iOS / Android (Metro resolves `.native.ts` before `packs.ts`). The packs built by
 * `@motto/content-schema build:packs` into assets/content/ are `require()`d: Metro bundles each JSON as its own
 * module and only evaluates it when the thunk runs, so a band's events are parsed into memory when that band is
 * reached, not at launch. The names must match PACK_ORDER in packages/content-schema/scripts/packs.ts.
 */
import type { PackFile, PackManifest } from './packTypes';

export const PACK_SOURCE = 'require' as const;

const PACKS: Record<string, () => unknown> = {
  'core.json': () => require('../../assets/content/core.json'),
  '18-25.json': () => require('../../assets/content/18-25.json'),
  '26-35.json': () => require('../../assets/content/26-35.json'),
  '36-50.json': () => require('../../assets/content/36-50.json'),
  '51-65.json': () => require('../../assets/content/51-65.json'),
  '66plus.json': () => require('../../assets/content/66plus.json'),
};

export const loadManifest = async (): Promise<PackManifest | null> => require('../../assets/content/manifest.json') as PackManifest;
export const loadPack = async (file: string): Promise<PackFile | null> => {
  const get = PACKS[file];
  if (!get) throw new Error(`unknown content pack ${file}`);
  return get() as PackFile;
};
