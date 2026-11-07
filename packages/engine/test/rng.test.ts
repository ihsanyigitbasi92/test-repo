import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { sfc32, channelRng, cyrb128 } from '../src/rng';

describe('rng determinism', () => {
  it('same seed → same sequence', () => {
    const a = sfc32('motto:1'), b = sfc32('motto:1');
    for (let i = 0; i < 100; i++) expect(a.next()).toBe(b.next());
  });
  it('different channels differ', () => {
    expect(channelRng('L', 3, 'events').next()).not.toBe(channelRng('L', 3, 'wager').next());
  });
  it('values in [0,1) and int within bounds (property)', () => {
    fc.assert(fc.property(fc.string(), fc.integer({ min: -50, max: 50 }), fc.integer({ min: -50, max: 50 }), (s, x, y) => {
      const [min, max] = x <= y ? [x, y] : [y, x];
      const r = sfc32(s);
      const v = r.next(); const n = r.int(min, max);
      return v >= 0 && v < 1 && n >= min && n <= max;
    }));
  });
  it('cyrb128 is stable', () => { expect(cyrb128('motto')).toEqual(cyrb128('motto')); });
});
