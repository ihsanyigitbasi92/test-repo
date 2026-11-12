/** Types for gen-sfx.mjs (used by test/sound.test.ts). */
export const SR: number;
export const PEAK_DBFS: number;
export const MAX_BYTES: number;
export const SOUNDS: [name: string, variants: number, render: (variant: number) => Float64Array][];
export interface RenderedSfx { name: string; variant: number; file: string; bytes: Buffer; pcm: Int16Array }
export function renderAll(): RenderedSfx[];
export function sha256(b: Uint8Array): string;
export function analyze(pcm: Int16Array): { ms: number; peakDb: number; rmsDb: number; dc: number; clipped: number; hiShare: number; edge: number };
