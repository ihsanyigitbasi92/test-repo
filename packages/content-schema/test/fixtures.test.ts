import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { GameEventSchema, parseEvent, specificity2, SkipLine } from '../src/index';

const dir = join(import.meta.dirname, '..', 'fixtures');
const files = readdirSync(dir).filter((f) => f.endsWith('.json') && !f.endsWith('.skip.json'));

describe('fixture events parse against the single schema (D-099)', () => {
  it('has the six 03 §3 example days', () => expect(files.length).toBeGreaterThanOrEqual(6));
  for (const f of files) {
    it(`parses ${f}`, () => {
      const ev = parseEvent(JSON.parse(readFileSync(join(dir, f), 'utf8')));
      expect(ev.id).toBe(f.replace(/\.json$/, ''));
      expect(specificity2(ev.pre)).toBeGreaterThanOrEqual(0);
    });
  }
  it('skip lines parse', () => {
    const lines = SkipLine.array().parse(JSON.parse(readFileSync(join(dir, 'lines.skip.json'), 'utf8')));
    expect(lines.length).toBeGreaterThanOrEqual(5);
  });
  it('rejects a missing locale, a stray outcome key and a non-integer delta', () => {
    const base = JSON.parse(readFileSync(join(dir, 'evt_kurye_yanlis_adres.json'), 'utf8'));
    expect(GameEventSchema.safeParse({ ...base, dialog: [{ speaker: 'mom', tr: 'x' }] }).success).toBe(false);
    expect(GameEventSchema.safeParse({ ...base, outcomes: { ...base.outcomes, ghost: base.outcomes.alma } }).success).toBe(false);
    const bad = structuredClone(base);
    bad.outcomes.alma.effects.meters.ego = 2.5;
    expect(GameEventSchema.safeParse(bad).success).toBe(false);
  });
});
