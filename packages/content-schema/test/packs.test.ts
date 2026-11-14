import { describe, it, expect } from 'vitest';
import { packOf, packsForAge, minAgeOf, stripAuthoring, groupPacks } from '../scripts/packs';
import type { GameEvent } from '../src/index';

/** D-156 pack assignment: band of the youngest age an event can fire at; references pulled into earlier packs. */
const ev = (id: string, pre: GameEvent['pre'], extra: Partial<GameEvent> = {}): GameEvent => ({
  id, v: 1, type: 'event', tags: ['t'], rarity: 'common', valence: 0, intensity: 0, universality: 'universal', pre,
  choices: [{ id: 'a', tr: 'a', en: 'a' }, { id: 'b', tr: 'b', en: 'b' }],
  outcomes: { a: { tr: 'x', en: 'x', coach: [] }, b: { tr: 'y', en: 'y', coach: [] } },
  intent: { setup: 's', mechanism: 'm', punch: 'p', lift: 'l', target: 'decision' }, review: { status: 'draft', legal: 'ok' },
  ...extra,
} as unknown as GameEvent);

describe('content packs', () => {
  it('assigns bands from age preconditions; no age → core', () => {
    expect(packOf(ev('a', {}))).toBe('core');
    expect(packOf(ev('a', { age: { max: 30 } }))).toBe('18-25');
    expect(packOf(ev('a', { age: { min: 25, max: 40 } }))).toBe('18-25');
    expect(packOf(ev('a', { age: { min: 26 } }))).toBe('26-35');
    expect(packOf(ev('a', { all: [{ age: { min: 52 } }] }))).toBe('51-65');
    expect(packOf(ev('a', { age: { min: 70 } }))).toBe('66plus');
    expect(packOf(ev('a', {}, { ageBand: ['secondHalf'] }))).toBe('36-50');
    expect(minAgeOf({ any: [{ age: { min: 40 } }] })).toBeNull();
    expect(packsForAge(18)).toEqual(['core', '18-25']);
    expect(packsForAge(51)).toEqual(['core', '18-25', '26-35', '36-50', '51-65']);
  });
  it('strips authoring fields only', () => {
    const s = stripAuthoring(ev('a', {}, { wager: { eligible: false, reason: 'r' } } as Partial<GameEvent>)) as Record<string, unknown>;
    expect(s.intent).toBeUndefined();
    expect(s.review).toBeUndefined();
    expect(s.wager).toEqual({ eligible: false });
    expect(s.choices).toBeDefined();
  });
  it('pulls followUp targets and chain nodes into the earliest referencing pack', () => {
    const src = ev('src', { age: { min: 20 } }, {
      outcomes: { a: { tr: 'x', en: 'x', coach: [], effects: { followUp: [{ eventId: 'late', delayDays: 3 }] } }, b: { tr: 'y', en: 'y', coach: [] } },
    } as unknown as Partial<GameEvent>);
    const late = ev('late', { age: { min: 40 } });
    const c1 = ev('c1', { age: { min: 27 } }, { chain: { id: 'ch', node: 'n1' } });
    const c2 = ev('c2', { age: { min: 55 } }, { chain: { id: 'ch', node: 'n2' } });
    const packs = groupPacks([src, late, c1, c2]);
    const where = (id: string) => packs.find((p) => p.events.some((e) => e.id === id))!.name;
    expect(where('late')).toBe('18-25');
    expect(where('c2')).toBe('26-35');
    expect(groupPacks([src, late], [], new Set(['src'])).flatMap((p) => p.events.map((e) => e.id))).toEqual(['late']);
  });
});
