/**
 * dupes — CLI: `pnpm --filter @motto/content-schema dupes [dir-or-file...] [--threshold 0.6] [--k 2] [--report <file>]`
 * Near-duplicate detection across every event under fixtures/** (core + demo + pack/<domain>/…).
 * Each event's TR "setup + outcome" text (intent.setup, dialog/text/document body, every outcome line) is normalised
 * (Turkish lower-case, punctuation stripped, tokens cut to a 5-letter stem so suffixes don't hide copies) and turned
 * into word k-shingles; pairs with Jaccard ≥ threshold are reported (YAZIM-KILAVUZU §tekrar). Identical
 * `intent.setup` strings are reported too. Exit 1 when any near-duplicate pair is found.
 */
import { writeFileSync } from 'node:fs';
import { FIXTURES, bucketOf, fold, loadRawEvents, loadTaxonomy, parseArgs, rel } from './lib';

const STEM = 5;
/** Very common TR function words that carry no situation. */
const STOP = new Set(['ve', 'bir', 'bu', 'şu', 'o', 'da', 'de', 'ki', 'mi', 'mı', 'mu', 'mü', 'ne', 'ile', 'için', 'gibi', 'daha', 'çok', 'en', 'sen', 'ben', 'biz', 'siz', 'onu', 'sana', 'bana', 'ama', 'yok', 'var', 'değil', 'hem', 'ya', 'veya']);

export function tokens(s: string): string[] {
  return fold(s, 'tr').replace(/[^\p{L}\p{N}\s]+/gu, ' ').split(/\s+/)
    .filter((t) => t && !STOP.has(t)).map((t) => t.slice(0, STEM));
}

export function shingles(toks: string[], k: number): Set<string> {
  const out = new Set<string>();
  if (toks.length < k) { if (toks.length) out.add(toks.join(' ')); return out; }
  for (let i = 0; i + k <= toks.length; i++) out.add(toks.slice(i, i + k).join(' '));
  return out;
}

/** TR setup (+ intent.setup) and every TR outcome line. */
export function setupOutcomeText(ev: any): string {
  const parts: string[] = [];
  if (ev?.intent?.setup) parts.push(ev.intent.setup);
  for (const d of ev?.dialog ?? []) if (d?.tr) parts.push(d.tr);
  for (const t of ev?.text ?? []) if (t?.tr) parts.push(t.tr);
  if (ev?.document?.body?.tr) parts.push(ev.document.body.tr);
  for (const o of Object.values(ev?.outcomes ?? {}) as any[]) for (const b of Array.isArray(o) ? o : [o]) if (b?.tr) parts.push(b.tr);
  return parts.join(' . ');
}

function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  const [s, l] = a.size <= b.size ? [a, b] : [b, a];
  for (const x of s) if (l.has(x)) inter++;
  return inter / (a.size + b.size - inter || 1);
}

function main(argv: string[]): number {
  const { pos, opt } = parseArgs(argv, ['threshold', 'k', 'report']);
  const t = Number(opt.threshold ?? 0.6);
  const k = Number(opt.k ?? 2);
  const domainIds = new Set(loadTaxonomy().map((d) => d.id));
  const evs = loadRawEvents(pos.length ? pos : [FIXTURES]).map(({ file, raw }) => ({
    file, id: String(raw?.id ?? '?'), bucket: bucketOf(file, domainIds).bucket,
    setup: fold(String(raw?.intent?.setup ?? ''), 'tr').trim(),
    sh: shingles(tokens(setupOutcomeText(raw)), k),
  }));

  // inverted index; skip shingles so common they only add noise (they still count in the exact Jaccard)
  const index = new Map<string, number[]>();
  evs.forEach((e, i) => { for (const s of e.sh) { const p = index.get(s); p ? p.push(i) : index.set(s, [i]); } });
  const maxDf = Math.max(50, Math.ceil(evs.length * 0.01));

  const pairs: { a: number; b: number; j: number }[] = [];
  const shared = new Int32Array(evs.length);
  for (let i = 0; i < evs.length; i++) {
    const ei = evs[i]!;
    const touched: number[] = [];
    for (const s of ei.sh) {
      const p = index.get(s)!;
      if (p.length > maxDf) continue;
      for (const j of p) if (j > i) { if ((shared[j] = shared[j]! + 1) === 1) touched.push(j); }
    }
    for (const j of touched) {
      shared[j] = 0;
      const ej = evs[j]!;
      const [x, y] = [ei.sh.size, ej.sh.size];
      if (Math.min(x, y) / Math.max(x, y) < t) continue;      // size filter: J ≤ min/max
      const jac = jaccard(ei.sh, ej.sh);
      if (jac >= t) pairs.push({ a: i, b: j, j: jac });
    }
  }
  pairs.sort((p, q) => q.j - p.j);

  const sameSetup = new Map<string, number[]>();
  evs.forEach((e, i) => { if (e.setup) { const l = sameSetup.get(e.setup); l ? l.push(i) : sameSetup.set(e.setup, [i]); } });
  const setupDupes = [...sameSetup].filter(([, l]) => l.length > 1);

  const out: string[] = [];
  if (pairs.length) {
    out.push(`YAKIN KOPYA — ${pairs.length} çift (Jaccard ≥ ${t}, ${k}-shingle):`);
    for (const p of pairs) {
      const [a, b] = [evs[p.a]!, evs[p.b]!];
      out.push(`  ✗ ${p.j.toFixed(2)}  ${a.id} [${a.bucket}]  ↔  ${b.id} [${b.bucket}]\n      ${rel(a.file)}\n      ${rel(b.file)}`);
    }
  }
  if (setupDupes.length) {
    out.push(`Aynı intent.setup — ${setupDupes.length}:`);
    for (const [s, l] of setupDupes) out.push(`  ! "${s}": ${l.map((i) => evs[i]!.id).join(', ')}`);
  }
  out.push(`${evs.length} olay karşılaştırıldı → ${pairs.length} yakın kopya çifti, ${setupDupes.length} aynı setup`);
  const report = out.join('\n');
  (pairs.length ? console.error : console.log)(report);
  if (typeof opt.report === 'string') { writeFileSync(opt.report, report + '\n'); console.log(`→ ${opt.report}`); }
  return pairs.length ? 1 : 0;
}

process.exit(main(process.argv.slice(2)));
