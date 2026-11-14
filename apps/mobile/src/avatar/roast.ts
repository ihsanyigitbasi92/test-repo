/**
 * Coach roast on the Client File look (07 §2.3.2). The coach reacts to *choices* (hair, dye, glasses, facial hair,
 * headwear) — never to skin tone or face shape: those parts only ever get a neutral generic line.
 */
import { partValue } from './look';
import type { Look, LookPart } from './look';

/** Parts the coach may comment on by value. */
const ROASTABLE: readonly LookPart[] = ['hairColor', 'hair', 'glasses', 'facial'];
/** When the whole look is shuffled: the most "remarkable" choice wins. */
const PRIORITY: readonly string[] = [
  'hairColor.teal', 'hair.bald', 'hair.spiky', 'facial.mustache', 'hair.beanie', 'glasses.round', 'glasses.square',
  'facial.beard', 'hair.long', 'hair.curly', 'hair.bun', 'facial.stubble', 'hair.buzz', 'hairColor.blonde',
];

/**
 * Returns a catalog key (`hair.bald`, `glasses.round` …) or `generic:<n>` for the neutral pool.
 * `known(key)` tells whether the UI catalog has a line for that key.
 */
export function pickLookRoast(look: Look, changed: LookPart | null, known: (key: string) => boolean, genericCount: number, salt = 0): string {
  if (changed && ROASTABLE.includes(changed)) {
    const k = `${changed}.${partValue(look, changed)}`;
    if (known(k)) return k;
  }
  if (!changed) {
    for (const k of PRIORITY) {
      const [part, value] = k.split('.') as [LookPart, string];
      if (partValue(look, part) === value && known(k)) return k;
    }
  }
  const n = Math.max(1, genericCount);
  const sum = look.face + look.skin * 3 + look.hair * 5 + look.eyes * 7 + look.nose * 11 + salt;
  return `generic:${sum % n}`;
}
