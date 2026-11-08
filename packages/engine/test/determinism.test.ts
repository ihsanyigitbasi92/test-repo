import { describe, it, expect } from 'vitest';
import { step, applyAction, hashState, emptyMeta } from '../src/index';
import type { Action, LifeState, MetaState } from '../src/index';
import { BUNDLE } from './helpers/content';
import { runLife } from './helpers/sim';

/** Replay an action list through the PURE step() and return the final state hash. */
function replay(actions: Action[]): { hash: string; state: LifeState; meta: MetaState } {
  let state = null as unknown as LifeState;
  let meta = emptyMeta();
  for (const a of actions) ({ state, meta } = step(state, meta, a, BUNDLE));
  return { hash: hashState(state), state, meta };
}

describe('determinism (D-044, D-098, AC-03-18)', () => {
  const run = runLife('DET-0001', BUNDLE, 'chaotic', { maxSteps: 400 });

  it('same seed + same actions → identical state hash across runs', () => {
    const a = replay(run.actions), b = replay(run.actions);
    expect(a.hash).toBe(b.hash);
    expect(JSON.stringify(a.state)).toBe(JSON.stringify(b.state));
  });

  it('pure step() and the in-place reducer agree bit for bit', () => {
    expect(replay(run.actions).hash).toBe(hashState(run.state));
  });

  it('different seeds diverge', () => {
    const other = runLife('DET-0002', BUNDLE, 'chaotic', { maxSteps: 400 });
    expect(hashState(other.state)).not.toBe(hashState(run.state));
  });

  it('mid-day save/load (JSON round trip) yields the same outcome', () => {
    const prefix = run.actions.slice(0, run.actions.findIndex((a, i) => i > 40 && a.type === 'ANSWER'));
    const answerAction = run.actions[prefix.length]!;
    const { state, meta } = replay(prefix);
    expect(state.phase).toBe('day');
    const direct = step(state, meta, answerAction, BUNDLE);
    const loaded = step(JSON.parse(JSON.stringify(state)) as LifeState, JSON.parse(JSON.stringify(meta)) as MetaState, answerAction, BUNDLE);
    expect(hashState(loaded.state)).toBe(hashState(direct.state));
    expect(loaded.effects).toEqual(direct.effects);
  });

  it('step() never mutates its inputs; PAUSE/RESUME are engine no-ops', () => {
    const { state, meta } = replay(run.actions.slice(0, 30));
    const before = JSON.stringify([state, meta]);
    step(state, meta, { type: 'NEXT_DAY' }, BUNDLE);
    step(state, meta, { type: 'END_SESSION' }, BUNDLE);
    expect(JSON.stringify([state, meta])).toBe(before);
    const p = step(state, meta, { type: 'PAUSE' }, BUNDLE);
    expect(p.state).toBe(state);
    expect(p.effects).toEqual([]);
    expect(step(state, meta, { type: 'RESUME' }, BUNDLE).effects).toEqual([]);
  });

  it('a whole life replays identically (1 full life)', () => {
    const life = runLife('DET-FULL', BUNDLE, 'first');
    const meta = emptyMeta();
    let st = null as unknown as LifeState;
    for (const a of life.actions) st = applyAction(st, meta, a, BUNDLE).state;
    expect(hashState(st)).toBe(hashState(life.state));
    expect(st.phase).toBe('dead');
  });
});
