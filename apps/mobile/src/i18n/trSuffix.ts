/**
 * Turkish suffix after a number ("%39'du", "%40'tı", "3'ü", "6'ya"): the suffix follows how the number is SPOKEN
 * (39 → "otuz dokuz" → dokuz → -du). Copied from packages/content-schema/scripts/textlint-rules.ts
 * (lastSpokenWord / fixSuffix) — scripts are not imported into the app bundle. Keep the two in sync.
 */
const UNITS = ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const TENS = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
const VOWELS = 'aeıioöuü';
const HARD = 'çfhkpsşt';   // fıstıkçı şahap

/** Last spoken word of a number as written in TR text: "39" → dokuz, "2.400" → yüz, "10.000" → bin, "3,5" → beş. */
export function lastSpokenWord(num: string): string {
  let n = num;
  const time = /^(\d{1,2})[:.](\d{2})$/.exec(n);
  if (time && !/^\d{1,3}\.\d{3}$/.test(n)) n = /^0+$/.test(time[2]!) ? time[1]! : time[2]!;
  else if (n.includes(',')) n = n.split(',').pop()!;
  const d = n.replace(/\./g, '').replace(/^0+(?=\d)/, '');
  if (/^0+$/.test(d)) return UNITS[0]!;
  const last = Number(d.charAt(d.length - 1));
  if (last) return UNITS[last]!;
  const tens = Number(d.charAt(d.length - 2) || 0);
  if (tens) return TENS[tens]!;
  const zeros = d.length - d.replace(/0+$/, '').length;
  if (zeros === 2) return 'yüz';
  if (zeros < 6) return 'bin';
  if (zeros < 9) return 'milyon';
  return 'milyar';
}

const lastVowel = (w: string): string => [...w].reverse().find((c) => VOWELS.includes(c))!;
const harmony2 = (v: string): string => ('aıou'.includes(v) ? 'a' : 'e');
const harmony4 = (v: string): string => ({ a: 'ı', ı: 'ı', o: 'u', u: 'u', e: 'i', i: 'i', ö: 'ü', ü: 'ü' } as Record<string, string>)[v]!;

/** Surface form of `suffix` after the spoken word `word` (null when the suffix is already right). */
export function fixSuffix(word: string, suffix: string): string | null {
  const endsVowel = VOWELS.includes(word.charAt(word.length - 1));
  const hard = HARD.includes(word.charAt(word.length - 1));
  let s = suffix;
  if (!endsVowel && s[0] === 'y' && s.length > 1 && (VOWELS.includes(s[1]!) || 'dm'.includes(s[1]!))) s = s.slice(1);
  if (endsVowel && VOWELS.includes(s[0]!)) {
    if (/^[ıiuü]nc[ıiuü]/.test(s)) s = s.slice(1);
    else if (/^[ae]r$/.test(s)) s = 'ş' + s;
    else if (/^[ıiuü]n/.test(s)) s = 'n' + s;
    else s = 'y' + s;
  }
  const first = s[0]!;
  if ('dt'.includes(first) && VOWELS.includes(s[1] ?? '')) s = (hard ? 't' : 'd') + s.slice(1);
  if ('cç'.includes(first) && VOWELS.includes(s[1] ?? '')) s = (hard ? 'ç' : 'c') + s.slice(1);
  let v = lastVowel(word);
  const chars = [...s];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i]!;
    if (!VOWELS.includes(c)) continue;
    const rest = chars.slice(Math.max(0, i - 1)).join('');
    if (/^ki/.test(rest) || /^ken/.test(rest) || /^yor/.test(rest)) break;
    if ('ae'.includes(c)) chars[i] = harmony2(v);
    else if ('ıiuü'.includes(c)) chars[i] = harmony4(v);
    else break;
    v = chars[i]!;
  }
  const fixed = chars.join('');
  return fixed === suffix ? null : fixed;
}

/** `n` + apostrophe + the suffix inflected for how `n` is read: sfx(39, 'ydi') → "39'du", sfx(40, 'ydi') → "40'tı", sfx(6, 'ydi') → "6'ydı". */
export function sfx(n: number | string, suffix: string): string {
  // Give the suffix in its full form (buffer letter included): 'ydi', 'yi', 'ya'; it is reduced as needed.
  const num = String(n);
  return `${num}'${fixSuffix(lastSpokenWord(num), suffix) ?? suffix}`;
}
