import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ContentBundle, GameEventSchema } from '../src/index';

type Raw = Record<string, any>;
const dir = join(import.meta.dirname, '..', 'fixtures');
const kurye = (): Raw => JSON.parse(readFileSync(join(dir, 'evt_kurye_yanlis_adres.json'), 'utf8'));
const ik = (): Raw => JSON.parse(readFileSync(join(dir, 'evt_is_gorusmesi_ik.json'), 'utf8'));

/** A minimal valid event whose first outcome carries `effects`. */
function ev(id: string, effects: Raw = {}, extra: Raw = {}): Raw {
  const base = kurye();
  base.id = id;
  delete base.shared;
  const first = Object.keys(base.outcomes)[0]!;
  const out = Array.isArray(base.outcomes[first]) ? base.outcomes[first][0] : base.outcomes[first];
  out.effects = { ...out.effects, ...effects };
  return { ...base, ...extra };
}
const bundle = (...events: Raw[]) => ({ contentHash: 'h', events, skipLines: [] });
const messages = (b: unknown): string[] => {
  const r = ContentBundle.safeParse(b);
  return r.success ? [] : r.error.issues.map((i) => i.message);
};

describe('ContentBundle reference checks (L03-10, L03-11, chains)', () => {
  it('accepts a bundle whose references all resolve', () => {
    const resolver = ev('evt_res', {}, { pre: { envelopeOpen: true } });
    const opener = ev('evt_open', { envelope: { teaserKey: 't', dueDays: [7, 45], weight: 1, resolverEventId: 'evt_res' }, followUp: [{ eventId: 'evt_res', delayDays: [1, 2] }] });
    const a1 = ev('evt_a1', { chainNext: 'a2' }, { chain: { id: 'c', node: 'a1', next: [{ node: 'a2', delayDays: [1, 2] }] } });
    const a2 = ev('evt_a2', {}, { chain: { id: 'c', node: 'a2' } });
    expect(messages(bundle(resolver, opener, a1, a2))).toEqual([]);
  });
  it('rejects a missing followUp target', () => {
    expect(messages(bundle(ev('evt_x', { followUp: [{ eventId: 'evt_ghost', delayDays: [1, 2] }] }))).join()).toMatch(/followUp target evt_ghost/);
  });
  it('rejects a missing envelope resolver', () => {
    expect(messages(bundle(ev('evt_x', { envelope: { teaserKey: 't', dueDays: [7, 45], weight: 1, resolverEventId: 'evt_ghost' } }))).join()).toMatch(/resolver evt_ghost does not exist/);
  });
  it('rejects a resolver whose pre lacks envelopeOpen:true', () => {
    const m = messages(bundle(ev('evt_x', { envelope: { teaserKey: 't', dueDays: [7, 45], weight: 1, resolverEventId: 'evt_y' } }), ev('evt_y')));
    expect(m.join()).toMatch(/must contain envelopeOpen:true/);
  });
  it('rejects chainNext without a matching node (and without a chain)', () => {
    const a1 = ev('evt_a1', { chainNext: 'zz' }, { chain: { id: 'c', node: 'a1' } });
    expect(messages(bundle(a1)).join()).toMatch(/chainNext "zz"/);
    expect(messages(bundle(ev('evt_b', { chainNext: 'a2' }))).join()).toMatch(/event has no chain/);
  });
  it('rejects a chain.next node that does not exist', () => {
    const a1 = ev('evt_a1', {}, { chain: { id: 'c', node: 'a1', next: [{ node: 'a9', delayDays: [1, 2] }] } });
    expect(messages(bundle(a1)).join()).toMatch(/has no node "a9"/);
  });
});

describe('honesty rule (03 §2.6): shown odds = dice threshold', () => {
  it('the fixture check events pass', () => expect(GameEventSchema.safeParse(ik()).success).toBe(true));
  it('rejects a success branch whose p differs from check.base', () => {
    const bad = ik();
    bad.outcomes.durust[0].p = 5000; bad.outcomes.durust[1].p = 5000;
    const r = GameEventSchema.safeParse(bad);
    expect(r.success).toBe(false);
    expect(r.error!.issues.map((i) => i.message).join()).toMatch(/must equal check.base/);
  });
  it('rejects nearMiss on the success branch', () => {
    const bad = ik();
    bad.outcomes.durust[0].nearMiss = { tr: 'x', en: 'x' };
    expect(GameEventSchema.safeParse(bad).success).toBe(false);
  });
});
