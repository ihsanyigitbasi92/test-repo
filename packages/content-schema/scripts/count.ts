/**
 * count — CLI: `pnpm --filter @motto/content-schema count [fixtures-dir] [--out <md>] [--no-write]`
 * Walks fixtures/** recursively, validates every event (GameEvent schema), and counts valid events per taxonomy
 * domain (folder name = domain id, e.g. fixtures/pack/<domain>/) against the quotas in docs/content/taxonomy.json
 * (D-155: Σ quota = 10.000). Events outside a domain folder (core fixtures, demo pack) are listed separately.
 * Prints the table and writes docs/content/SAYIM.md. Exit 1 on schema errors or files in unknown domain folders.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { GameEventSchema } from '../src/index';
import { FIXTURES, REPO_ROOT, bucketOf, loadRawEvents, loadTaxonomy, parseArgs, rel } from './lib';

interface Row { id: string; group: string; title: string; quota: number; count: number; invalid: number }

function pct(n: number, d: number): string { return d ? `${Math.round((n * 1000) / d) / 10}%` : '—'; }
function bar(n: number, d: number, w = 10): string {
  const k = d ? Math.min(w, Math.round((n / d) * w)) : 0;
  return '█'.repeat(k) + '░'.repeat(w - k);
}

function main(argv: string[]): number {
  const { pos, opt } = parseArgs(argv, ['out']);
  const root = pos[0] ?? FIXTURES;
  const outFile = typeof opt.out === 'string' ? opt.out : join(REPO_ROOT, 'docs', 'content', 'SAYIM.md');
  const tax = loadTaxonomy();
  const domainIds = new Set(tax.map((d) => d.id));
  const rows = new Map<string, Row>(tax.map((d) => [d.id, { id: d.id, group: d.group, title: d.title_tr, quota: d.quota, count: 0, invalid: 0 }]));
  const other = new Map<string, { count: number; invalid: number }>();
  const unknown: string[] = [];
  let invalid = 0;

  for (const { file, raw } of loadRawEvents([root])) {
    const ok = GameEventSchema.safeParse(raw).success;
    if (!ok) { invalid++; console.error(`✗ ${rel(file)} (schema; run validate for details)`); }
    const b = bucketOf(file, domainIds, root);
    if (b.domain) { const r = rows.get(b.domain)!; ok ? r.count++ : r.invalid++; continue; }
    if (b.bucket === 'pack') unknown.push(rel(file));
    const o = other.get(b.bucket) ?? { count: 0, invalid: 0 };
    ok ? o.count++ : o.invalid++;
    other.set(b.bucket, o);
  }

  const all = [...rows.values()];
  const quota = all.reduce((s, r) => s + r.quota, 0);
  const packed = all.reduce((s, r) => s + r.count, 0);
  const extra = [...other.values()].reduce((s, o) => s + o.count, 0);
  const done = all.filter((r) => r.count >= r.quota).length;
  const over = all.filter((r) => r.count > r.quota);

  // groups (taxonomy order)
  const groups = new Map<string, { quota: number; count: number; domains: number }>();
  for (const r of all) {
    const g = groups.get(r.group) ?? { quota: 0, count: 0, domains: 0 };
    g.quota += r.quota; g.count += r.count; g.domains++;
    groups.set(r.group, g);
  }

  // console
  const w = Math.max(10, ...all.map((r) => r.id.length));
  console.log(`${'alan'.padEnd(w)}  ${'sayı'.padStart(5)} / ${'kota'.padStart(5)}  ${'%'.padStart(6)}`);
  for (const r of all) console.log(`${r.id.padEnd(w)}  ${String(r.count).padStart(5)} / ${String(r.quota).padStart(5)}  ${pct(r.count, r.quota).padStart(6)}${r.invalid ? `  (${r.invalid} geçersiz)` : ''}${r.count > r.quota ? '  KOTA AŞILDI' : ''}`);
  for (const [k, o] of other) console.log(`${`(${k})`.padEnd(w)}  ${String(o.count).padStart(5)}        alan dışı${o.invalid ? `  (${o.invalid} geçersiz)` : ''}`);
  console.log(`\nPaket (alan) toplamı: ${packed} / ${quota} (${pct(packed, quota)}), tamamlanan alan: ${done}/${all.length}`);
  console.log(`Alan dışı (çekirdek + demo): ${extra}; genel toplam geçerli olay: ${packed + extra}; geçersiz: ${invalid}`);
  for (const u of unknown) console.error(`✗ ${u}: fixtures/pack altında ama taksonomide olmayan bir alan klasöründe`);

  // markdown
  if (!opt['no-write']) {
    const md: string[] = [
      '# İçerik sayımı (SAYIM)',
      '',
      `> Otomatik üretilir: \`pnpm --filter @motto/content-schema count\` — elle düzenleme. Kaynak: \`${relative(REPO_ROOT, root).split('\\').join('/')}/**\`, kotalar: \`docs/content/taxonomy.json\` (D-155, Σ kota = ${quota.toLocaleString('tr-TR')}).`,
      '',
      '## Özet',
      '',
      '| Ölçü | Değer |',
      '|---|---:|',
      `| Alan paketlerindeki geçerli olay | **${packed.toLocaleString('tr-TR')}** / ${quota.toLocaleString('tr-TR')} (${pct(packed, quota)}) |`,
      `| Kotası dolan alan | ${done} / ${all.length} |`,
      `| Kotayı aşan alan | ${over.length} |`,
      ...[...other].map(([k, o]) => `| Alan dışı: \`${k}\` | ${o.count} |`),
      `| Genel toplam geçerli olay | **${(packed + extra).toLocaleString('tr-TR')}** |`,
      `| Şema hatalı dosya | ${invalid} |`,
      '',
      '## Grup bazında',
      '',
      '| Grup | Alan | Sayı | Kota | % |',
      '|---|---:|---:|---:|---:|',
      ...[...groups].map(([g, x]) => `| ${g} | ${x.domains} | ${x.count} | ${x.quota} | ${pct(x.count, x.quota)} |`),
      '',
      '## Alan bazında',
      '',
      '| # | Alan | Grup | Başlık | Sayı | Kota | Kalan | % | İlerleme |',
      '|---:|---|---|---|---:|---:|---:|---:|---|',
      ...all.map((r, i) => `| ${i + 1} | \`${r.id}\` | ${r.group} | ${r.title} | ${r.count}${r.invalid ? ` (+${r.invalid} geçersiz)` : ''} | ${r.quota} | ${Math.max(0, r.quota - r.count)} | ${pct(r.count, r.quota)} | ${bar(r.count, r.quota)} |`),
      '',
    ];
    mkdirSync(dirname(outFile), { recursive: true });
    writeFileSync(outFile, md.join('\n'));
    console.log(`→ ${rel(outFile)}`);
  }
  return invalid || unknown.length ? 1 : 0;
}

process.exit(main(process.argv.slice(2)));
