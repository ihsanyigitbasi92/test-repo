#!/usr/bin/env node
// Store metadata checker: character limits, banned words, keyword format.
// Usage: node docs/store/check-limits.mjs [--write]   (--write refreshes the count table at the end of each listing file)
// Counts Unicode code points (what App Store Connect and Play Console count); "İ", "ş", "→" each count as 1.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const FIELDS = {
  tr: { AD: ['App name (iOS+Play)', 30], 'ALT BAŞLIK': ['Subtitle (iOS)', 30], PROMOSYON: ['Promotional text (iOS)', 170],
    'KISA AÇIKLAMA': ['Short description (Play)', 80], AÇIKLAMA: ['Full description (both)', 4000],
    'ANAHTAR KELİMELER': ['Keywords (iOS)', 100], YENİLİKLER: ["What's new (both)", 4000] },
  en: { NAME: ['App name (iOS+Play)', 30], SUBTITLE: ['Subtitle (iOS)', 30], PROMO: ['Promotional text (iOS)', 170],
    SHORT: ['Short description (Play)', 80], DESCRIPTION: ['Full description (both)', 4000],
    KEYWORDS: ['Keywords (iOS)', 100], WHATS_NEW: ["What's new (both)", 4000] },
};
// 00 §1.2, 11 §2.8.2, 08 K22, D-106. Matched case-insensitively on word starts.
const BANNED = ['motivasyon', 'motivation', 'motive', 'wellness', 'alışkanlık', 'habit', 'terapi', 'therap', 'self-help',
  'kişisel gelişim', 'mindfulness', 'bitlife', 'altlife', 'alter ego', 'reigns', 'games like', 'benzeri oyun', 'rüşvet',
  'bribe', 'bahis', 'bet', 'bets', 'betting', 'gambl', 'kumar', 'casino', 'kumarhane', 'en popüler', 'most popular',
  'sınırlı süre', 'limited time', 'şu an', 'kader', 'terminal', 'son durak', 'last stop', 'toparlan', 'get a grip',
  '#1', 'number one', 'best game', 'en iyi oyun', 'top rated', '5 yıldız', '5 star', 'therapy', 'mental health'];
const len = (s) => [...s].length;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let fail = 0;
const write = process.argv.includes('--write');
for (const lang of ['tr', 'en']) {
  const file = join(here, `listing-${lang}.md`);
  let md = readFileSync(file, 'utf8');
  const rows = [];
  for (const [key, [label, max]] of Object.entries(FIELDS[lang])) {
    const m = md.match(new RegExp(`==== ${esc(key)} ====\\n([\\s\\S]*?)\\n==== /${esc(key)} ====`));
    if (!m) { console.log(`[${lang}] MISSING ${key}`); fail++; continue; }
    const text = m[1];
    const n = len(text);
    const notes = [];
    if (n > max) { notes.push(`OVER by ${n - max}`); fail++; }
    for (const w of BANNED) {
      const re = new RegExp(`(^|[^\\p{L}])${esc(w)}`, 'iu');
      if (re.test(text)) { notes.push(`banned "${w}"`); fail++; }
    }
    if (/KEYWORDS|ANAHTAR/.test(key)) {
      if (/,\s|\s,/.test(text)) { notes.push('space next to comma'); fail++; }
      const kw = text.split(',');
      const dup = kw.filter((k, i) => kw.indexOf(k) !== i);
      if (dup.length) { notes.push(`duplicate ${dup}`); fail++; }
      notes.push(`${kw.length} terms`);
    }
    rows.push(`| ${label} | ${n} | ${max} | ${n <= max ? 'OK' : 'OVER'} | ${notes.join('; ')} |`);
    console.log(`[${lang}] ${label.padEnd(26)} ${String(n).padStart(4)} / ${max} ${n <= max ? 'OK' : 'OVER'} ${notes.join('; ')}`);
  }
  if (write) {
    const table = ['| Alan | Karakter | Sınır | Durum | Not |', '|---|---|---|---|---|', ...rows].join('\n');
    md = md.replace(new RegExp(`<!-- COUNTS:${lang} -->[\\s\\S]*$`), `<!-- COUNTS:${lang} -->\n${table}\n\n(\`node docs/store/check-limits.mjs --write\` ile üretildi; yasak sözcük taraması temiz.)\n`);
    writeFileSync(file, md);
  }
}
if (fail) { console.log(`\n${fail} problem(s)`); process.exit(1); }
console.log('\nAll fields within limits; no banned words.');
