import { describe, it, expect } from 'vitest';
import { applyAction, emptyMeta, hashState } from '../src/index';
import type { LifeState } from '../src/index';
import { BUNDLE } from './helpers/content';

/**
 * AC-10-03 cross-platform bit identity: a fixed seed + a fixed action script must land on this exact hash on
 * every JS engine (Hermes, V8, JSC). Changing engine rules or tuning legitimately changes it — update the literal
 * in the same commit and say why.
 */
const GOLDEN = '27de4a79385e8b95fbb4ff3ee4343ed2';   // playtest 2026-11-12: NPC bornDay, rituals/pendingDeath state, report ritual + absolute grade bounds, state-weighted causes

describe('golden state hash (AC-10-03)', () => {
  it('seed GOLDEN-1, 250 days, always the first open choice, a session end every 20 days', () => {
    const meta = emptyMeta();
    let st = applyAction(null as unknown as LifeState, meta, { type: 'START_LIFE', seed: 'GOLDEN-1', name: 'Ada' }, BUNDLE).state;
    st = applyAction(st, meta, { type: 'RESUME', localDay: '2026-01-14', nowWall: 0 }, BUNDLE).state;
    for (let i = 1; i <= 250 && st.phase !== 'dead'; i++) {
      st = applyAction(st, meta, { type: 'NEXT_DAY' }, BUNDLE).state;
      if (st.phase === 'day') st = applyAction(st, meta, { type: 'ANSWER', eventId: st.card!.eventId, choiceId: st.card!.choices.find((c) => !c.locked)!.id }, BUNDLE).state;
      if (i % 20 === 0) st = applyAction(st, meta, { type: 'SESSION_END', reason: 'enough' }, BUNDLE).state;
    }
    expect(hashState(st)).toBe(GOLDEN);
  });
});
