/**
 * Text lints for every `tr` / `en` string of an event (see scripts/textlint.ts for the CLI).
 * Pure functions, no I/O except the list loaders — imported by test/textlint.test.ts.
 *
 *  raw-id      snake_case / camelCase tokens in player-facing text (item/job/flag ids leaking: "aile_yuzugu",
 *              "boilerTech"). A token inside quotes ('son_son', "final_final") is a deliberate file name and passes.
 *  tr-suffix   Turkish case/copula suffix after a number or percent: vowel harmony, d/t + c/ç assimilation and
 *              buffer letters follow how the number is READ ("%39'du", "3'te", "2'ye", "263'tü", "11:53'te").
 *  en-tr-name  Turkish NPC names / Turkish-only words in EN strings ("Nermin", "Pamuk"); allow-list for lines
 *              that keep a name on purpose: scripts/lint/en-keep.txt. localeOnly events are skipped.
 *  typo        Known misspellings (scripts/lint/typos.txt); quoted occurrences are deliberate and pass.
 *  persona     (info) share of coach lines carrying a Motto persona marker + over-used persona phrasings.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export type Loc = 'tr' | 'en';
export type RuleId = 'raw-id' | 'tr-suffix' | 'en-tr-name' | 'typo';
export interface TextHit { rule: RuleId; match: string; message: string }

const LISTS = join(import.meta.dirname, 'lint');

/* ───────────────────────── shared ───────────────────────── */

const QUOTE_OPEN = `'"“‘«`;
const QUOTE_CLOSE = `'"”’»`;

/** Text with quoted spans blanked out (keeps offsets). A quote span starts at a quote char not preceded by a letter. */
export function blankQuoted(s: string): string {
  const out = s.split('');
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]!;
    if (!QUOTE_OPEN.includes(ch)) continue;
    if (i > 0 && /[\p{L}\p{N}]/u.test(s[i - 1]!)) continue;          // an apostrophe inside a word (Barış'ın, don't)
    const close = ch === '“' ? '”' : ch === '‘' ? '’' : ch === '«' ? '»' : ch;
    let j = i + 1;
    while (j < s.length && s[j] !== close && !(close === "'" && s[j] === '’')) j++;
    if (j >= s.length) continue;
    for (let k = i; k <= j; k++) out[k] = ' ';
    i = j;
  }
  return out.join('');
}

/* ───────────────────────── raw-id ───────────────────────── */

const SNAKE = /(?<![\p{L}\p{N}_{])[\p{Ll}\p{N}]+(?:_[\p{L}\p{N}]+)+(?![\p{L}\p{N}_}]|\.(?:pdf|docx?|xlsx?|pptx?|txt|jpe?g|png|zip|csv)\b)/gu;
const CAMEL = /(?<![\p{L}\p{N}_{])\p{Ll}+\p{Lu}[\p{L}\p{N}]*(?![\p{L}\p{N}_}])/gu;
/** camelCase that is ordinary writing, not an id. */
const CAMEL_OK = new Set(['iPad', 'iPhone', 'eBay', 'mRNA', 'pH', 'kWh', 'mAh', 'dB', 'eSports', 'eKart']);

export function rawIdHits(text: string): TextHit[] {
  const t = blankQuoted(text);
  const hits: TextHit[] = [];
  for (const m of t.matchAll(SNAKE)) hits.push({ rule: 'raw-id', match: m[0], message: 'snake_case token (raw id?) — translate it or quote it as a file name' });
  for (const m of t.matchAll(CAMEL)) if (!CAMEL_OK.has(m[0])) hits.push({ rule: 'raw-id', match: m[0], message: 'camelCase token (raw id?)' });
  return hits;
}

/* ───────────────────────── tr-suffix ───────────────────────── */

const UNITS = ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const TENS = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
const VOWELS = 'aeıioöuü';
const HARD = 'çfhkpsşt';   // fıstıkçı şahap

/**
 * The last spoken word of a number as written in TR text: "39" → dokuz, "2.400" → yüz, "10.000" → bin,
 * "3,5" → beş, "11:53" → üç, "09:00" → dokuz, "1.000.000" → milyon.
 */
export function lastSpokenWord(num: string): string {
  let n = num;
  const time = /^(\d{1,2})[:.](\d{2})$/.exec(n);
  if (time && !/^\d{1,3}\.\d{3}$/.test(n)) n = /^0+$/.test(time[2]!) ? time[1]! : time[2]!;
  else if (n.includes(',')) n = n.split(',').pop()!;
  const d = n.replace(/\./g, '').replace(/^0+(?=\d)/, '');
  if (/^0+$/.test(d)) return UNITS[0]!;
  const last = Number(d.at(-1));
  if (last) return UNITS[last]!;
  const tens = Number(d.at(-2) ?? 0);
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

/** Expected surface form of `suffix` after the spoken word (returns null when the suffix looks fine). */
export function fixSuffix(word: string, suffix: string): string | null {
  const endsVowel = VOWELS.includes(word.at(-1)!);
  const hard = HARD.includes(word.at(-1)!);
  let s = suffix;
  // buffer letters: 2'yi / 3'ü, 6'ya / 5'e, 2'ydi / 3'tü
  if (!endsVowel && s[0] === 'y' && s.length > 1 && (VOWELS.includes(s[1]!) || 'dm'.includes(s[1]!))) s = s.slice(1);
  if (endsVowel && VOWELS.includes(s[0]!)) {
    if (/^[ıiuü]nc[ıiuü]/.test(s)) s = s.slice(1);                  // ordinal: 2'nci, 6'ncı
    else if (/^[ae]r$/.test(s)) s = 'ş' + s;                         // distributive: 2'şer, 6'şar
    else if (/^[ıiuü]n/.test(s)) s = 'n' + s;                        // genitive: 2'nin, 6'nın
    else s = 'y' + s;                                                // accusative / dative: 2'yi, 6'ya
  }
  // consonant assimilation on the first letter
  const first = s[0]!;
  if ('dt'.includes(first) && VOWELS.includes(s[1] ?? '')) s = (hard ? 't' : 'd') + s.slice(1);
  if ('cç'.includes(first) && VOWELS.includes(s[1] ?? '')) s = (hard ? 'ç' : 'c') + s.slice(1);
  // vowel harmony, propagated through the suffix chain (ki / ken / yor / leyin stay invariant)
  let v = lastVowel(word);
  const chars = [...s];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i]!;
    if (!VOWELS.includes(c)) continue;
    const rest = chars.slice(Math.max(0, i - 1)).join('');
    if (/^ki/.test(rest) || /^ken/.test(rest) || /^yor/.test(rest)) break;        // invariant tail — stop
    if ('ae'.includes(c)) chars[i] = harmony2(v);
    else if ('ıiuü'.includes(c)) chars[i] = harmony4(v);
    else break;                                                                       // o/ö: not a harmonizing suffix
    v = chars[i]!;
  }
  const fixed = chars.join('');
  return fixed === suffix ? null : fixed;
}

const NUM_SUFFIX = /(?<![\p{L}\p{N}.,:])(%?)(\d{1,2}[:.]\d{2}(?![\d.,])|\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?)(['’])([a-zçğıöşü]+)/gu;

export function trSuffixHits(text: string): TextHit[] {
  const hits: TextHit[] = [];
  for (const m of text.matchAll(NUM_SUFFIX)) {
    const [whole, pct = '', num = '', ap = "'", suffix = ''] = m;
    const word = lastSpokenWord(num);
    const fixed = fixSuffix(word, suffix);
    if (fixed) hits.push({ rule: 'tr-suffix', match: whole, message: `"${whole}" → "${pct}${num}${ap}${fixed}" (okunuş: …${word})` });
  }
  return hits;
}

/* ───────────────────────── en-tr-name ───────────────────────── */

export interface ListEntry { term: string; note: string }

function readList(file: string): string[][] {
  const p = join(LISTS, file);
  if (!existsSync(p)) return [];
  return readFileSync(p, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split(/\s+\|\s+/).map((x) => x.trim()));
}

const asciiFold = (s: string): string => s.replace(/ç/g, 'c').replace(/Ç/g, 'C').replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
  .replace(/ı/g, 'i').replace(/İ/g, 'I').replace(/ö/g, 'o').replace(/Ö/g, 'O').replace(/ş/g, 's').replace(/Ş/g, 'S')
  .replace(/ü/g, 'u').replace(/Ü/g, 'U');

/** Honorific pattern that marks a TR proper name: "Nermin Hanım", "Sabri Amca", "Saadet Teyze". */
const TR_HONORIFIC = /(?<![\p{L}])(\p{Lu}[\p{Ll}]{2,})(?:['’][\p{Ll}]+)?\s+(?:Hanım|Bey|Teyze|Amca|Hoca|Abla|Abi|Usta|Dede|Nine)(?![\p{L}])/gu;

/** Turkish NPC names seen in TR text with an honorific — merged with scripts/lint/tr-names.txt by the CLI. */
export function harvestTrNames(trText: string): string[] {
  return [...trText.matchAll(TR_HONORIFIC)].map((m) => m[1]!);
}

export interface NameMatcher { re: RegExp; words: RegExp | null; names: Set<string> }

export function buildNameMatcher(names: Iterable<string>, words: Iterable<string> = []): NameMatcher {
  const set = new Set<string>();
  for (const n of names) { set.add(n); set.add(asciiFold(n)); set.add(n.toLocaleUpperCase('tr-TR')); set.add(asciiFold(n.toLocaleUpperCase('tr-TR'))); }
  const esc = (w: string): string => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const nameAlts = [...set].sort((a, b) => b.length - a.length).map(esc);
  const wordAlts = [...words].map(esc);
  // names are case-sensitive (Ada ≠ ada); Turkish-only words are matched case-insensitively
  const re = new RegExp(`(?<![\\p{L}])(?:${nameAlts.join('|') || '(?!)'})(?![\\p{L}])`, 'gu');
  const wre = wordAlts.length ? new RegExp(`(?<![\\p{L}])(?:${wordAlts.join('|')})(?![\\p{L}])`, 'giu') : null;
  return { re, words: wre, names: set };
}

export function enTrNameHits(text: string, m: NameMatcher, keep: Set<string> = new Set()): TextHit[] {
  const hits: TextHit[] = [];
  const found = [...text.matchAll(m.re), ...(m.words ? text.matchAll(m.words) : [])];
  for (const x of found) {
    if (keep.has(x[0]) || keep.has(asciiFold(x[0]))) continue;
    hits.push({ rule: 'en-tr-name', match: x[0], message: 'Turkish name/word in EN text — use the EN cast name or add to lint/en-keep.txt' });
  }
  return hits;
}

/* ───────────────────────── typo ───────────────────────── */

export interface Typo { wrong: string; right: string; loc: Loc | 'all'; re: RegExp }

export function compileTypos(rows: string[][]): Typo[] {
  return rows.map(([wrong = '', right = '', loc = 'all']) => ({
    wrong, right, loc: (loc === 'tr' || loc === 'en' ? loc : 'all') as Typo['loc'],
    re: new RegExp(`(?<![\\p{L}])${wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')}(?![\\p{L}])`, 'giu'),
  }));
}

export function typoHits(text: string, loc: Loc, typos: Typo[]): TextHit[] {
  const t = blankQuoted(text);
  const hits: TextHit[] = [];
  for (const ty of typos) {
    if (ty.loc !== 'all' && ty.loc !== loc) continue;
    ty.re.lastIndex = 0;
    const m = ty.re.exec(loc === 'tr' ? t.replace(/I/g, 'ı').replace(/İ/g, 'i') : t);
    if (m) hits.push({ rule: 'typo', match: text.slice(m.index, m.index + m[0].length), message: `yazım: "${ty.wrong}" → "${ty.right}"` });
  }
  return hits;
}

/* ───────────────────────── persona (info) ───────────────────────── */

/** Motto persona markers (01 §2.1): seminars, the formula, the notebook/pen/stamp kit, the uncertified self-own. */
export const PERSONA: Record<Loc, RegExp> = {
  tr: /semin[eo]r|ben olsam|sen bilirsin|sertifika(?:sız|m)|flipchart|balo salon|soğuk börek|başarının 7 sırrı|sinerji|kalem bende|silgi|koçun defteri|defterim|damga|koçluk|basılmamış kitab/iu,
  en: /seminar|i'd (?:pick|take|go|try|say|stay|wait|keep|sign|skip|do)|if i were you|your call|uncertified|certificat|flip ?chart|ballroom|cold pastr|7 secrets|synergy|eraser|my notebook|coaching|the stamp|unpublished book|i'd have/iu,
};

export const isPersona = (tr: string, en: string): boolean => PERSONA.tr.test(tr) || PERSONA.en.test(en);

export function loadLists(): { names: string[]; words: string[]; keep: Map<string, Set<string>>; typos: Typo[] } {
  const names = readList('tr-names.txt').map((r) => r[0]!).filter(Boolean);
  const words = readList('tr-words.txt').map((r) => r[0]!).filter(Boolean);
  const keep = new Map<string, Set<string>>();
  for (const [id = '', name = ''] of readList('en-keep.txt')) { const s = keep.get(id) ?? new Set(); s.add(name); keep.set(id, s); }
  return { names, words, keep, typos: compileTypos(readList('typos.txt')) };
}
