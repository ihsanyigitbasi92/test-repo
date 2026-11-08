import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { GameEventSchema, SkipLine } from '@motto/content-schema';
import { renderText } from '../src/index';
import type { ContentBundle, Effect, GameEvent, Locale } from '../src/index';
import { runLife } from './helpers/sim';

/**
 * The app's content (top-level fixtures + fixtures/demo, no synthetic filler) must carry whole lives on its own:
 * day 1 has NPC dialog, wager slips show up, birthdays and death are reached, and every emitted text key
 * resolves in both locales. The golden-hash bundle (helpers/content.ts) is untouched by the demo pack.
 */
const FIX = join(import.meta.dirname, '..', '..', 'content-schema', 'fixtures');
const read = (dir: string) => readdirSync(dir).filter((f) => f.endsWith('.json') && !f.endsWith('.skip.json'))
  .map((f) => GameEventSchema.parse(JSON.parse(readFileSync(join(dir, f), 'utf8'))) as GameEvent);
const APP: ContentBundle = {
  contentHash: 'app-demo',
  events: [...read(FIX), ...read(join(FIX, 'demo'))],
  skipLines: [...SkipLine.array().parse(JSON.parse(readFileSync(join(FIX, 'lines.skip.json'), 'utf8'))),
    ...SkipLine.array().parse(JSON.parse(readFileSync(join(FIX, 'demo', 'lines.skip.json'), 'utf8')))],
};

const keysOf = (fx: Effect[]): { key: string; params?: Record<string, number | string> }[] => fx.flatMap((e) => {
  if (e.kind === 'SHOW_DIALOG') return e.bubbles.map((b) => ({ key: b.textKey, params: b.params }));
  if (e.kind === 'SHOW_DAY') return [...(e.card.skip ? [{ key: e.card.skip.key, params: e.card.skip.params }] : []), ...e.card.choices.map((c) => ({ key: c.textKey })),
    ...(e.card.wager ? [{ key: e.card.wager.slipKey }] : [])];
  return [];
});

describe('app content (fixtures + demo pack) plays whole lives', () => {
  const seeds = ['APP-1', 'APP-2', 'APP-3', 'APP-4', 'APP-5', 'APP-6'];
  const runs = seeds.map((s, i) => {
    const keys: { key: string; params?: Record<string, number | string> }[] = [];
    let firstDay: Effect[] | null = null, wagers = 0, stamps = 0, quiet = 0, birthdays = 0;
    const run = runLife(s, APP, (['first', 'chaotic', 'last'] as const)[i % 3], {
      onStep: (st, a, fx) => {
        if (a.type === 'NEXT_DAY' && !firstDay) firstDay = fx;
        keys.push(...keysOf(fx));
        for (const e of fx) {
          if (e.kind === 'SHOW_DAY' && e.card.wager) wagers++;
          if (e.kind === 'SHOW_DAY' && e.card.eventId === 'sys_quiet') quiet++;
          if (e.kind === 'REPORT_CARD') birthdays++;
          if (e.kind === 'STAMP') stamps++;
        }
      },
    });
    return { run, keys, firstDay: firstDay as Effect[] | null, wagers, stamps, quiet, birthdays };
  });

  it('day 1 is an event card with NPC dialog and choices', () => {
    for (const r of runs) {
      const show = r.firstDay!.find((e) => e.kind === 'SHOW_DAY');
      expect(show && show.kind === 'SHOW_DAY' && show.card.choices.length).toBeGreaterThanOrEqual(2);
      expect(r.firstDay!.some((e) => e.kind === 'SHOW_DIALOG' && e.layer === 'dialog' && e.bubbles.some((b) => b.speaker !== 'narrator'))).toBe(true);
    }
  });
  it('every life reaches birthdays and death; wager slips and stamps appear; quiet days stay rare', () => {
    for (const r of runs) {
      expect(r.run.state.phase).toBe('dead');
      expect(r.birthdays).toBeGreaterThanOrEqual(10);
      expect(r.quiet * 10).toBeLessThan(r.run.state.counters.shownDays);
    }
    expect(runs.reduce((s, r) => s + r.wagers, 0)).toBeGreaterThanOrEqual(seeds.length * 2);
    expect(runs.reduce((s, r) => s + r.stamps, 0)).toBeGreaterThan(0);
  });
  it('every text key the engine emits resolves in tr and en with no unfilled placeholder', () => {
    for (const { key, params } of runs.flatMap((r) => r.keys)) for (const loc of ['tr', 'en'] as Locale[]) {
      const s = renderText(APP, key, loc, params);
      expect(s, `${key} (${loc})`).not.toBeNull();
      expect(s!, `${key} (${loc})`).not.toMatch(/\{[a-zA-Z]+\}/);
    }
  });
});
