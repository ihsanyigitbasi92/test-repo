/** Shapes written by packages/content-schema/scripts/build-packs.ts (D-156). */
export interface PackEntry {
  name: string; file: string;
  /** Youngest age the pack is for; null = `core` (always loaded). */
  minAge: number | null; maxAge: number | null;
  events: number; skipLines: number; bytes: number; gzipBytes: number; sha256: string;
}
export interface PackManifest { version: number; contentHash: string; events: number; bytes: number; gzipBytes: number; packs: PackEntry[] }
/** Events are GameEvents minus authoring fields (intent, review, notes); the engine never reads those. */
export interface PackFile { name: string; events: unknown[]; skipLines: unknown[] }
