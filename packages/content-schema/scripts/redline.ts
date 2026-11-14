/**
 * redline — CLI: `pnpm --filter @motto/content-schema redline [dir-or-file...] [--report <file>] [--warn]`
 * Scans every `tr` / `en` string of every event under fixtures/** (dialog, choices, outcomes, coach, near-miss,
 * slips, documents, hints, l10n…) for red-line terms seeded from 08 §2.2.5: real brands, politicians & parties,
 * Atatürk / national symbols, real institutions, religion, slurs, self-harm, drugs, gambling.
 * Lists live in redlines/{tr,en,all,private}/*.txt (format: redlines/README.txt).
 * Exit 1 when any `block` hit is found (`warn` hits are reported only; --warn prints them).
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { FIXTURES, PKG_ROOT, fold, loadRawEvents, localeStrings, parseArgs, rel } from './lib';

type Loc = 'tr' | 'en';
interface Term { cat: string; source: string; sev: 'block' | 'warn'; gate?: string; re: Record<Loc, RegExp>; locales: Loc[] }
interface Hit { file: string; id: string; path: string; locale: Loc; term: Term; match: string; text: string }

const L = '\\p{L}\\p{N}';
const escape = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function compile(entry: string, cs: boolean, loc: Loc): RegExp {
  let body: string;
  if (entry.startsWith('re:')) body = entry.slice(3).trim();
  else {
    const stem = entry.endsWith('~');
    const t = cs ? entry.replace(/~$/, '') : fold(entry.replace(/~$/, ''), loc);
    body = t.split(/\s+/).map(escape).join('\\s+') + (stem ? `[${L}'’-]*` : '');
  }
  return new RegExp(`(?<![${L}])(?:${body})(?![${L}])`, cs ? 'gu' : 'giu');
}

function loadLists(dir = join(PKG_ROOT, 'redlines')): Term[] {
  const terms: Term[] = [];
  for (const sub of ['all', 'tr', 'en', 'private']) {
    let files: string[] = [];
    try { files = readdirSync(join(dir, sub)).filter((f) => f.endsWith('.txt')); } catch { continue; }
    for (const f of files) {
      const locales: Loc[] = sub === 'tr' || f.endsWith('.tr.txt') ? ['tr'] : sub === 'en' || f.endsWith('.en.txt') ? ['en'] : ['tr', 'en'];
      const cat = `${sub}/${basename(f, '.txt')}`;
      for (const line of readFileSync(join(dir, sub, f), 'utf8').split('\n')) {
        const t = line.trim();
        if (!t || t.startsWith('#')) continue;
        const [source = '', sev = 'block', opts = ''] = t.split(/\s+\|\s+/).map((x) => x.trim());
        const o = opts.split(',').map((x) => x.trim()).filter(Boolean);
        const cs = o.includes('cs');
        const gate = o.find((x) => x.startsWith('gate='))?.slice(5);
        terms.push({
          cat, source, sev: sev === 'warn' ? 'warn' : 'block', gate, locales,
          re: { tr: compile(source, cs, 'tr'), en: compile(source, cs, 'en') },
        });
      }
    }
  }
  return terms;
}

function main(argv: string[]): number {
  const { pos, opt } = parseArgs(argv, ['report']);
  const terms = loadLists();
  const events = loadRawEvents(pos.length ? pos : [FIXTURES]);
  const hits: Hit[] = [];
  let strings = 0;
  for (const { file, raw } of events) {
    const tags = new Set<string>(Array.isArray(raw?.tags) ? raw.tags : []);
    for (const s of localeStrings(raw)) {
      strings++;
      const folded = fold(s.text, s.locale);
      for (const term of terms) {
        if (!term.locales.includes(s.locale) || (term.gate && tags.has(term.gate))) continue;
        const re = term.re[s.locale];
        const hay = re.flags.includes('i') ? folded : s.text;
        re.lastIndex = 0;
        const m = re.exec(hay);
        if (m) hits.push({ file, id: String(raw?.id ?? '?'), path: s.path, locale: s.locale, term, match: m[0], text: s.text });
      }
    }
  }
  const block = hits.filter((h) => h.term.sev === 'block');
  const warn = hits.filter((h) => h.term.sev === 'warn');
  const lines: string[] = [];
  const fmt = (h: Hit): string => `  ${h.term.sev === 'block' ? '✗' : '!'} ${rel(h.file)} ${h.path} [${h.term.cat}] «${h.match}» (${h.term.source})\n      ${h.locale}: ${h.text}`;
  if (block.length) { lines.push(`KIRMIZI ÇİZGİ — ${block.length} blok:`); lines.push(...block.map(fmt)); }
  if (warn.length && (opt.warn || block.length === 0)) { lines.push(`Uyarı — ${warn.length}:`); lines.push(...warn.map(fmt)); }
  const byCat = new Map<string, number>();
  for (const h of block) byCat.set(h.term.cat, (byCat.get(h.term.cat) ?? 0) + 1);
  lines.push(`${events.length} olay, ${strings} metin, ${terms.length} terim/desen tarandı → ${block.length} blok, ${warn.length} uyarı` +
    (byCat.size ? ` (${[...byCat].map(([k, v]) => `${k}: ${v}`).join(', ')})` : ''));
  const report = lines.join('\n');
  (block.length ? console.error : console.log)(report);
  if (typeof opt.report === 'string') { writeFileSync(opt.report, report + '\n'); console.log(`→ ${opt.report}`); }
  return block.length ? 1 : 0;
}

process.exit(main(process.argv.slice(2)));
