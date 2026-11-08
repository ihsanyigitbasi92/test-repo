/**
 * build-packs — CLI (D-156): `pnpm --filter @motto/content-schema build:packs [--out <dir>] [--strict] [-q]`
 *
 * fixtures/pack/** → <out>/<pack>.json + <out>/manifest.json (default out: apps/mobile/assets/content).
 *  1. validates every event with the zod schema (unreadable / invalid files are reported and left out;
 *     `--strict` turns any of them into exit code 1),
 *  2. drops authoring-only fields (intent, review, notes, wager.reason, l10n.mechanismNote) and whitespace,
 *  3. groups the events into age-band packs (core, 18-25, 26-35, 36-50, 51-65, 66plus; see scripts/packs.ts),
 *  4. writes one compact JSON per pack and a manifest (name, age range, event count, bytes, gzip bytes, sha256),
 *  5. prints raw vs gzip sizes for the pool and a linear projection to 10.000 events.
 * Events also present in the app's statically bundled fixtures (top-level + demo/) are not repeated in packs.
 * Pack files: `{ "name": "<pack>", "events": [...], "skipLines": [...] }`.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { ContentBundle, GameEventSchema } from '../src/index';
import type { GameEvent } from '../src/index';
import { FIXTURES, REPO_ROOT, parseArgs, rel } from './lib';
import { PACK_ROOT, groupPacks, loadPackPool } from './packs';

const TARGET = 10_000;
const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;
const mb = (n: number) => `${(n / 1024 / 1024).toFixed(2)} MB`;

/** Event ids the app already bundles statically (fixtures/*.json + fixtures/demo/*.json). */
function baseEvents(): GameEvent[] {
  const out: GameEvent[] = [];
  for (const dir of [FIXTURES, join(FIXTURES, 'demo')]) {
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.json') && !x.endsWith('.skip.json'))) {
      const r = GameEventSchema.safeParse(JSON.parse(readFileSync(join(dir, f), 'utf8')));
      if (r.success) out.push(r.data as GameEvent);
    }
  }
  return out;
}

function main(argv: string[]): number {
  const { opt } = parseArgs(argv, ['out']);
  const outDir = typeof opt.out === 'string' ? opt.out : join(REPO_ROOT, 'apps', 'mobile', 'assets', 'content');
  const strict = Boolean(opt.strict);
  const quiet = Boolean(opt.q || opt.quiet);

  const { events, skipLines, files, issues } = loadPackPool(PACK_ROOT);
  for (const i of issues) console.error(`✗ ${rel(i.file)} [${i.kind}] ${i.message}`);

  const base = baseEvents();
  const baseIds = new Set(base.map((e) => e.id));
  const shadowed = events.filter((e) => baseIds.has(e.id)).length;

  // pool-level checks on what the app can end up holding (base + every pack): references, document share
  const all = [...base, ...events.filter((e) => !baseIds.has(e.id))];
  const pool = ContentBundle.safeParse({ contentHash: 'build', events: all, skipLines });
  if (!pool.success) for (const i of pool.error.issues.slice(0, 30)) console.warn(`! pool: ${i.message}`);

  const packs = groupPacks(events, skipLines, baseIds);
  mkdirSync(outDir, { recursive: true });
  for (const f of readdirSync(outDir)) if (f.endsWith('.json')) rmSync(join(outDir, f));

  const rows = packs.map((p) => {
    const body = JSON.stringify({ name: p.name, events: p.events, skipLines: p.skipLines });
    const buf = Buffer.from(body, 'utf8');
    writeFileSync(join(outDir, `${p.name}.json`), buf);
    return {
      name: p.name, file: `${p.name}.json`, minAge: p.minAge, maxAge: p.maxAge,
      events: p.events.length, skipLines: p.skipLines.length,
      bytes: buf.length, gzipBytes: gzipSync(buf, { level: 9 }).length,
      sha256: createHash('sha256').update(buf).digest('hex'),
    };
  });
  const total = rows.reduce((s, r) => s + r.events, 0);
  const bytes = rows.reduce((s, r) => s + r.bytes, 0);
  const gz = rows.reduce((s, r) => s + r.gzipBytes, 0);
  const contentHash = createHash('sha256').update(rows.map((r) => `${r.name}:${r.sha256}`).join('|')).digest('hex').slice(0, 16);
  const manifest = { version: 1, contentHash, events: total, bytes, gzipBytes: gz, packs: rows };
  writeFileSync(join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  // authoring (pretty, with intent/review) vs shipped size, for the report
  const authored = events.filter((e) => !baseIds.has(e.id)).reduce((s, e) => s + Buffer.byteLength(JSON.stringify(e, null, 2)), 0);

  if (!quiet) {
    console.log(`${files} files under ${rel(PACK_ROOT)}, ${events.length} valid events (${shadowed} already in app fixtures), ${issues.length} issue(s)`);
    console.log(`${'pack'.padEnd(8)} ${'ages'.padEnd(7)} ${'events'.padStart(6)} ${'raw'.padStart(10)} ${'gzip'.padStart(10)}  sha256`);
    for (const r of rows) console.log(`${r.name.padEnd(8)} ${(r.minAge === null ? '—' : `${r.minAge}-${r.maxAge ?? '∞'}`).padEnd(7)} ${String(r.events).padStart(6)} ${kb(r.bytes).padStart(10)} ${kb(r.gzipBytes).padStart(10)}  ${r.sha256.slice(0, 12)}`);
    console.log(`total    ${''.padEnd(7)} ${String(total).padStart(6)} ${kb(bytes).padStart(10)} ${kb(gz).padStart(10)}  (authoring JSON: ${kb(authored)}, ${(bytes / Math.max(1, authored) * 100).toFixed(0)}% kept)`);
    if (total) {
      const per = bytes / total, perGz = gz / total;
      console.log(`per event: ${per.toFixed(0)} B raw, ${perGz.toFixed(0)} B gzip → ${TARGET.toLocaleString('en-US')} events ≈ ${mb(per * TARGET)} raw, ${mb(perGz * TARGET)} gzip`);
    }
    console.log(`→ ${rel(outDir)}/ (manifest.json + ${rows.length} packs, contentHash ${contentHash})`);
  }
  return strict && issues.length ? 1 : 0;
}

process.exit(main(process.argv.slice(2)));
