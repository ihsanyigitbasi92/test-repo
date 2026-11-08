import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { GameEventSchema, SkipLine } from '@motto/content-schema';
import { groupPacks, loadPackPool, packsForAge } from '../../content-schema/scripts/packs';
import { applyAction, emptyMeta, renderText, sfc32 } from '../src/index';
import type { Action, ContentBundle, Effect, GameEvent, LifeState, Locale } from '../src/index';
import { runLife } from './helpers/sim';

/**
 * D-155 / D-156: the FULL production pool (fixtures/pack/**), packed exactly as build-packs ships it (authoring
 * fields stripped, age-band packs), on top of the app's static fixtures (top-level + demo).
 *  - 6 whole lives on the merged bundle: no crash, death reached, every emitted text key resolves in tr and en.
 *  - 2 lives that grow the bundle band by band mid-life, the way the app's loader does (core + 18-25 at start,
 *    the next pack merged on the birthday that reaches it): no crash, keys resolve against the bundle of that step.
 * Files a concurrent author left half-written / invalid are skipped (build-packs reports them; `--strict` fails).
 */
const FIX = join(import.meta.dirname, '..', '..', 'content-schema', 'fixtures');
const read = (dir: string) => readdirSync(dir).filter((f) => f.endsWith('.json') && !f.endsWith('.skip.json'))
  .map((f) => GameEventSchema.parse(JSON.parse(readFileSync(join(dir, f), 'utf8'))) as GameEvent);
const baseEvents = [...read(FIX), ...read(join(FIX, 'demo'))];
const baseSkip = [...SkipLine.array().parse(JSON.parse(readFileSync(join(FIX, 'lines.skip.json'), 'utf8'))),
  ...SkipLine.array().parse(JSON.parse(readFileSync(join(FIX, 'demo', 'lines.skip.json'), 'utf8')))];

const pool = loadPackPool();
const packs = groupPacks(pool.events, pool.skipLines, new Set(baseEvents.map((e) => e.id)));
const bundleOf = (names: readonly string[], hash = 'full-pack'): ContentBundle => {
  const ps = packs.filter((p) => names.includes(p.name));
  return {
    contentHash: hash,
    events: [...baseEvents, ...ps.flatMap((p) => p.events as GameEvent[])],
    skipLines: [...baseSkip, ...ps.flatMap((p) => p.skipLines)],
  };
};
const FULL = bundleOf(packs.map((p) => p.name));

type Key = { key: string; params?: Record<string, number | string> };
const keysOf = (fx: Effect[]): Key[] => fx.flatMap((e) => {
  if (e.kind === 'SHOW_DIALOG') return e.bubbles.map((b) => ({ key: b.textKey, params: b.params }));
  if (e.kind === 'SHOW_DAY') return [...(e.card.skip ? [{ key: e.card.skip.key, params: e.card.skip.params }] : []), ...e.card.choices.map((c) => ({ key: c.textKey })),
    ...(e.card.wager ? [{ key: e.card.wager.slipKey }] : [])];
  return [];
});
const unresolved = (content: ContentBundle, keys: Key[]): string[] => {
  const bad: string[] = [];
  for (const { key, params } of keys) for (const loc of ['tr', 'en'] as Locale[]) {
    const s = renderText(content, key, loc, params);
    if (s === null || s.trim() === '' || /\{[a-zA-Z]+\}/.test(s)) bad.push(`${key} (${loc}): ${s === null ? 'missing' : JSON.stringify(s)}`);
  }
  return bad;
};

describe('full pack content (D-156) plays whole lives', () => {
  it('the pool is the production pool, packed', () => {
    expect(pool.events.length).toBeGreaterThanOrEqual(1000);
    expect(packs.reduce((s, p) => s + p.events.length, 0) + baseEvents.length).toBe(FULL.events.length);
    expect(new Set(FULL.events.map((e) => e.id)).size).toBe(FULL.events.length);
    for (const e of FULL.events.slice(baseEvents.length)) expect('intent' in e || 'review' in e).toBe(false);
  });

  const seeds = ['PACK-1', 'PACK-2', 'PACK-3', 'PACK-4', 'PACK-5', 'PACK-6'];
  it('6 lives on the merged bundle: no crash, death, every text key resolves in tr and en', () => {
    const played = new Set<string>();
    for (const [i, seed] of seeds.entries()) {
      const keys: Key[] = [];
      const run = runLife(seed, FULL, (['first', 'chaotic', 'last'] as const)[i % 3], {
        onStep: (_st, _a, fx) => {
          keys.push(...keysOf(fx));
          for (const e of fx) if (e.kind === 'SHOW_DAY') played.add(e.card.eventId);
        },
      });
      expect(run.state.phase, seed).toBe('dead');
      expect(unresolved(FULL, keys), seed).toEqual([]);
    }
    // the pack events are actually drawn, not only the base fixtures
    const packIds = new Set(packs.flatMap((p) => p.events.map((e) => e.id)));
    expect([...played].filter((id) => packIds.has(id)).length).toBeGreaterThan(100);
  }, 120_000);

  it('2 lives that load packs band by band mid-life (app loader order): no crash, keys resolve', () => {
    for (const seed of ['BAND-1', 'BAND-2']) {
      const meta = emptyMeta();
      const pick = sfc32(`persona:${seed}`);
      const cache = new Map<string, ContentBundle>();
      const contentAt = (age: number) => {
        const names = packsForAge(age);
        const k = names.join(',');
        if (!cache.has(k)) cache.set(k, bundleOf(names));
        return cache.get(k)!;
      };
      const bad: string[] = [];
      let content = contentAt(18);
      const go = (st: LifeState, a: Action): LifeState => {
        const r = applyAction(st, meta, a, content);
        bad.push(...unresolved(content, keysOf(r.effects)));
        content = contentAt(r.state.calendar.age);              // merge on the birthday that reaches a band
        return r.state;
      };
      let st = go(null as unknown as LifeState, { type: 'START_LIFE', seed, name: 'Test' });
      for (let i = 0; i < 6000 && st.phase !== 'dead'; i++) {
        st = go(st, { type: 'NEXT_DAY' });
        if (st.phase === 'day' && st.card) {
          const open = st.card.choices.filter((c) => !c.locked);
          st = go(st, { type: 'ANSWER', eventId: st.card.eventId, choiceId: open[pick.int(0, open.length - 1)]!.id, via: 'auto' });
        }
      }
      expect(st.phase, seed).toBe('dead');
      expect(bad, seed).toEqual([]);
      expect(cache.size, seed).toBeGreaterThanOrEqual(3);
    }
  }, 120_000);
});
