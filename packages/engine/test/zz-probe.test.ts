import { it } from 'vitest';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { GameEventSchema, SkipLine } from '@motto/content-schema';
import { groupPacks, loadPackPool } from '../../content-schema/scripts/packs';
import type { ContentBundle, GameEvent, LifeState } from '../src/index';
import { runLife } from './helpers/sim';

const FIX = join(import.meta.dirname, '..', '..', 'content-schema', 'fixtures');
const read = (dir: string) => readdirSync(dir).filter((f) => f.endsWith('.json') && !f.endsWith('.skip.json'))
  .map((f) => GameEventSchema.parse(JSON.parse(readFileSync(join(dir, f), 'utf8'))) as GameEvent);
const baseEvents = [...read(FIX), ...read(join(FIX, 'demo'))];
const baseSkip = [...SkipLine.array().parse(JSON.parse(readFileSync(join(FIX, 'lines.skip.json'), 'utf8'))),
  ...SkipLine.array().parse(JSON.parse(readFileSync(join(FIX, 'demo', 'lines.skip.json'), 'utf8')))];
const pool = loadPackPool();
const packs = groupPacks(pool.events, pool.skipLines, new Set(baseEvents.map((e) => e.id)));
const FULL: ContentBundle = { contentHash: 'full-pack', events: [...baseEvents, ...packs.flatMap((p) => p.events as GameEvent[])], skipLines: [...baseSkip, ...packs.flatMap((p) => p.skipLines)] };
const byId = new Map(FULL.events.map((e) => [e.id, e]));

it('probe', () => {
  const lines: string[] = [];
  const agg = { grief: 0, gradeBad: 0, reports: 0, wedBad: 0, weds: 0, singleRing: 0, kidEarly: 0, kids: 0, warn: 0, ritualRep: 0 };
  for (let i = 0; i < 20; i++) {
    const seed = `PROBE-${i}`;
    let catDied: number | null = null, momDied: number | null = null, grief = false, kidBorn: number | null = null, prevEvli = false;
    let lastTwo: string[] = [];
    const ritualHist: string[] = [];
    const run = runLife(seed, FULL, (['first', 'chaotic', 'last'] as const)[i % 3], {
      onStep: (st: LifeState, _a, fx) => {
        const cat = st.npcs.find((n) => n.role === 'cat'), mom = st.npcs.find((n) => n.role === 'mom');
        if (catDied === null && cat && !cat.alive) catDied = st.calendar.age;
        if (momDied === null && mom && !mom.alive) momDied = st.calendar.age;
        const child = st.npcs.find((n) => n.role === 'child');
        if (kidBorn === null && child?.exists) { kidBorn = st.calendar.calendarDay; agg.kids++; }
        const evli = st.flags.includes('evli');
        if (evli && !prevEvli && st.status.partner) { agg.weds++; if (st.calendar.calendarDay - st.status.partner.since > 30) agg.wedBad++; }
        prevEvli = evli;
        for (const e of fx) {
          if (e.kind === 'SHOW_DAY') {
            const ev = byId.get(e.card.eventId);
            if (ev) {
              lastTwo = [...lastTwo, ev.id].slice(-3);
              if ((catDied !== null || momDied !== null) && ev.tags.some((t) => t === 'veda_kayip' || t === 'cenaze_taziye' || t.startsWith('loss:'))) grief = true;
              if (!st.status.partner && ev.tags.some((t) => ['nisan', 'dugun', 'evlilik_gunluk', 'nisan_teklif_dugun'].includes(t))) agg.singleRing++;
              const kidSp = (ev.dialog ?? []).some((d) => d.speaker === 'child');
              if (kidSp && kidBorn !== null && st.calendar.calendarDay - kidBorn < 5 * 365 && ev.tags.some((t) => t === 'okul' || t === 'ergen' || t === 'cocuk_buyutme')) agg.kidEarly++;
            }
          }
          if (e.kind === 'REPORT_CARD') {
            agg.reports++;
            const g = e.data.grades, h = Math.trunc(st.stats.health / 100);
            if ((h < 20 && g.health >= 2) || (h >= 80 && g.health <= 1) || (st.money.balance < 0 && g.money >= 2)) agg.gradeBad++;
            const r = (e.data as unknown as { ritual?: { birthday: number; motto: number; noEnvelope: number } }).ritual;
            if (r) { const k = `${r.birthday}`; if (ritualHist.slice(-5).includes(k)) agg.ritualRep++; ritualHist.push(k); }
          }
        }
      },
    });
    const st = run.state;
    if (grief) agg.grief++;
    lines.push(`${seed} death ${st.death?.age} ${st.death?.cause} h=${Math.trunc(st.stats.health / 100)} stress=${Math.trunc(st.hidden.stress / 100)} cat=${catDied} mom=${momDied} grief=${grief} last=${lastTwo.join(',')}`);
  }
  lines.push(JSON.stringify(agg));
  writeFileSync(join(import.meta.dirname, '..', '..', '..', 'probe-' + (process.env.PROBE ?? 'out') + '.txt'), lines.join('\n'));
}, 600_000);
