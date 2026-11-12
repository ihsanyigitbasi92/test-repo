/**
 * validate — CLI: `pnpm --filter @motto/content-schema validate [dir-or-file...] [-q]` (Node type stripping + scripts/ts-register.mjs)
 * Walks directories recursively (fixtures/, fixtures/demo/, fixtures/pack/<domain>/…).
 * Parses every *.json as a GameEvent (or a *.skip.json as SkipLine[]), then runs pool-level checks:
 * duplicate ids, dangling followUp/envelope/chain references (warnings), document share (L03-03).
 * Exit code 1 on any schema error.
 */
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { GameEventSchema, SkipLine } from '../src/index';
import type { GameEvent } from '../src/index';
import { collectJson, parseArgs } from './lib';

function main(argv: string[]): number {
  const { pos, opt } = parseArgs(argv);
  const quiet = Boolean(opt.q || opt.quiet);
  const files = collectJson(pos.length ? pos : ['fixtures']);
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
    if (!quiet) console.log(`✓ ${f}`);
  }
  const ids = new Set(events.map((e) => e.id));
  if (ids.size !== events.length) {
    errors++;
    const seen = new Set<string>();
    const dup = events.map((e) => e.id).filter((id) => (seen.has(id) ? true : (seen.add(id), false)));
    console.error(`✗ duplicate event ids: ${[...new Set(dup)].slice(0, 20).join(', ')}`);
  }
  const refs = new Set<string>();
  for (const e of events) for (const o of Object.values(e.outcomes)) for (const b of Array.isArray(o) ? o : [o]) {
    for (const fu of b.effects?.followUp ?? []) refs.add(fu.eventId);
    if (b.effects?.envelope) refs.add(b.effects.envelope.resolverEventId);
  }
  for (const r of refs) if (!ids.has(r)) console.warn(`! dangling reference: ${r} (not in this set)`);
  // Kılavuz §4.1: lift satırı yalnızca aktif Tek Hedef ya da açık zarf koşuluna bağlı gösterilir.
  let liftBad = 0;
  for (const e of events) {
    const eventGoal = JSON.stringify((e as any).pre ?? {}).includes('"goal"')
      || e.choices.some((c) => c.check?.goal || JSON.stringify(c.requires ?? {}).includes('"goal"'));
    for (const o of Object.values(e.outcomes)) for (const b of Array.isArray(o) ? o : [o]) {
      const ok = eventGoal || !!b.effects?.envelope;
      for (const c of b.coach) if (c.lift && !ok && !JSON.stringify(c.when ?? {}).includes('"goal"')) {
        liftBad++; console.error(`✗ ${e.id}: lift coach line without goal/envelope condition (§4.1)`);
      }
    }
  }
  errors += liftBad;
  const docs = events.filter((e) => e.type === 'document').length;
  if (events.length >= 20 && docs * 100 > events.length * 15) { errors++; console.error(`✗ document share ${docs}/${events.length} > 15% (L03-03)`); }
  console.log(`${files.length} files, ${events.length} events, ${errors} error(s)`);
  return errors ? 1 : 0;
}

process.exit(main(process.argv.slice(2)));
