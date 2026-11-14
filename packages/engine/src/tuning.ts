/**
 * tuning.json loader (D-100). Validates at import time that every leaf number is an integer (D-098) and
 * exposes typed accessors. No runtime schema library: a small recursive walk is enough and keeps the engine dep-free.
 */
import raw from './tuning.json';

export type Tuning = typeof raw;
export type BandDef = Tuning['dayBudget']['bands'][number];

function assertIntegers(node: unknown, path: string): void {
  if (typeof node === 'number') {
    if (!Number.isInteger(node)) throw new Error(`tuning.json: ${path} must be an integer (D-098), got ${node}`);
  } else if (Array.isArray(node)) node.forEach((v, i) => assertIntegers(v, `${path}[${i}]`));
  else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) if (k !== '$comment') assertIntegers(v, `${path}.${k}`);
}
assertIntegers(raw, 'tuning');

export const TUNING: Tuning = raw;

/** Age band definition (D-061) for a given age. */
export function bandFor(age: number): BandDef {
  const b = TUNING.dayBudget.bands.find((x) => age <= x.maxAge);
  return b ?? TUNING.dayBudget.bands[TUNING.dayBudget.bands.length - 1]!;
}

/** Look up a stepped table of [maxAge, value] pairs. */
export function steppedByAge(table: readonly (readonly [number, number])[] | readonly number[][], age: number): number {
  for (const row of table) if (age <= row[0]!) return row[1]!;
  return table[table.length - 1]![1]!;
}
