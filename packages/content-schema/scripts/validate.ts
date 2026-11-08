/**
 * validate — CLI: `pnpm --filter @motto/content-schema validate [dir-or-file...]` (Node type stripping + scripts/ts-register.mjs)
 * Parses every *.json as a GameEvent (or a *.skip.json as SkipLine[]), then runs pool-level checks:
 * duplicate ids, dangling followUp/envelope/chain references (warnings), document share (L03-03).
 * Exit code 1 on any schema error.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import { GameEventSchema, SkipLine } from '../src/index';
import type { GameEvent } from '../src/index';

function collect(paths: string[]): string[] {
  const out: string[] = [];
  for (const p of paths) {
    if (statSync(p).isDirectory()) out.push(...readdirSync(p).filter((f) => f.endsWith('.json')).map((f) => join(p, f)));
    else out.push(p);
  }
  return out.sort();
}

function main(argv: string[]): number {
  const files = collect(argv.length ? argv : ['fixtures']);
  const events: GameEvent[] = [];
  let errors = 0;
  for (const f of files) {
    const raw = JSON.parse(readFileSync(f, 'utf8')) as unknown;
    const r = basename(f).endsWith('.skip.json') ? SkipLine.array().safeParse(raw) : GameEventSchema.safeParse(raw);
    if (!r.success) {
      errors++;
      console.error(`✗ ${f}`);
      for (const i of r.error.issues) console.error(`    ${i.path.join('.') || '<root>'}: ${i.message}`);
      continue;
    }
    if (!basename(f).endsWith('.skip.json')) events.push(r.data as GameEvent);
    console.log(`✓ ${f}`);
  }
  const ids = new Set(events.map((e) => e.id));
  if (ids.size !== events.length) { errors++; console.error('✗ duplicate event ids'); }
  const refs = new Set<string>();
  for (const e of events) for (const o of Object.values(e.outcomes)) for (const b of Array.isArray(o) ? o : [o]) {
    for (const fu of b.effects?.followUp ?? []) refs.add(fu.eventId);
    if (b.effects?.envelope) refs.add(b.effects.envelope.resolverEventId);
  }
  for (const r of refs) if (!ids.has(r)) console.warn(`! dangling reference: ${r} (not in this set)`);
  const docs = events.filter((e) => e.type === 'document').length;
  if (events.length >= 20 && docs * 100 > events.length * 15) { errors++; console.error(`✗ document share ${docs}/${events.length} > 15% (L03-03)`); }
  console.log(`${events.length} events, ${errors} error(s)`);
  return errors ? 1 : 0;
}

process.exit(main(process.argv.slice(2)));
