import { describe, it, expect, vi } from 'vitest';
import * as engine from '../src/index';
import type { LifeState } from '../src/index';
import { BUNDLE } from './helpers/content';

type Engine = typeof engine;
type Snap = Pick<LifeState, 'stats' | 'meters' | 'money' | 'patterns' | 'calendar'> & { eventId: string | undefined; branch: number | undefined };

/** Play one life with `persona=first` and record the gameplay path (everything but the wager ledger). */
function path(eng: Engine, seed: string, steps: number): { snaps: Snap[]; wagers: number } {
  const meta = eng.emptyMeta();
  let st = eng.applyAction(null as unknown as LifeState, meta, { type: 'START_LIFE', seed, name: 'x' }, BUNDLE).state;
  const snaps: Snap[] = [];
  for (let i = 0; i < steps && st.phase !== 'dead'; i++) {
    st = eng.applyAction(st, meta, { type: 'NEXT_DAY' }, BUNDLE).state;
    if (st.phase === 'day') st = eng.applyAction(st, meta, { type: 'ANSWER', eventId: st.card!.eventId, choiceId: st.card!.choices.find((c) => !c.locked)!.id }, BUNDLE).state;
    snaps.push(structuredClone({ stats: st.stats, meters: st.meters, money: st.money, patterns: st.patterns, calendar: st.calendar, eventId: st.card?.eventId, branch: st.card?.answered?.branch }));
  }
  return { snaps, wagers: st.wagerLog.total };
}

describe('wager twin-life invariant (03 §2.6: the WagerService is an observer)', () => {
  it('turning the WagerService off leaves the stat / money / pattern path identical', async () => {
    vi.resetModules();
    vi.doMock('../src/wager', async (orig) => ({ ...(await orig<typeof import('../src/wager')>()), screenWager: () => null }));
    const off = (await import('../src/index')) as Engine;
    vi.doUnmock('../src/wager');
    for (const seed of ['TWIN-1', 'TWIN-2', 'TWIN-3']) {
      const on = path(engine, seed, 1500), noWager = path(off, seed, 1500);
      expect(on.wagers).toBeGreaterThan(0);
      expect(noWager.wagers).toBe(0);
      expect(noWager.snaps).toEqual(on.snaps);
    }
  }, 60_000);
});
