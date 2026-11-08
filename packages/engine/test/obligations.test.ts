import { describe, it, expect } from 'vitest';
import { applyAction, emptyMeta, openEnvelope, TUNING, BANKRUPTCY_PENDING } from '../src/index';
import type { Action, ContentBundle, Effect, LifeState, MetaState } from '../src/index';
import { BUNDLE, FIXTURE_ONLY } from './helpers/content';

/** A fresh life plus a tiny driver: `day()` = NEXT_DAY, `ans()` answers the open card with its first choice. */
function life(seed: string, content: ContentBundle = BUNDLE) {
  const meta: MetaState = emptyMeta();
  let st = applyAction(null as unknown as LifeState, meta, { type: 'START_LIFE', seed, name: 'Ada' }, content).state;
  const act = (a: Action): Effect[] => { const r = applyAction(st, meta, a, content); st = r.state; return r.effects; };
  return {
    get st() { return st; },
    day: () => act({ type: 'NEXT_DAY' }),
    ans: (choiceId?: string) => {
      if (st.phase !== 'day' || !st.card) return [];
      const id = choiceId ?? st.card.choices.find((c) => !c.locked)!.id;
      return act({ type: 'ANSWER', eventId: st.card.eventId, choiceId: id, via: 'tap' });
    },
    act,
  };
}

/** Advance until the next card whose event id matches, answering everything else; returns shown days used. */
function until(l: ReturnType<typeof life>, id: string, maxDays = 40): number {
  for (let n = 1; n <= maxDays; n++) {
    l.day();
    if (l.st.card?.eventId === id) return n;
    l.ans();
  }
  return -1;
}

describe('rent day + bailout are day cards (02 §2.3.2, §2.3.6)', () => {
  it('a rent shortfall becomes the forced evt_kira_gunu card; "anne" (bailoutCheck) queues the bailout card', () => {
    const l = life('RENT-CARD');
    l.st.status.home = { kind: 'flat', rent: 500, since: 0 };
    l.st.money.balance = -2000;
    expect(until(l, 'evt_kira_gunu')).toBeGreaterThan(0);
    expect(l.st.card!.forced).toBe(true);
    expect(l.st.card!.flowLog.length).toBeLessThanOrEqual(3);
    expect(l.st.counters.bailouts).toBe(0);                          // nothing was credited silently
    l.ans('anne');
    expect(l.st.money.balance).toBeLessThan(0);
    expect(l.st.counters.bailouts).toBe(1);
    l.day();
    expect(l.st.card!.eventId).toBe('evt_anne_borc_verdi');
    expect(l.st.card!.forced).toBe(true);
    const before = l.st.money.balance;
    l.ans('al');
    expect(l.st.money.balance).toBeGreaterThan(before);
    expect(l.st.flags).toContain('bailoutUsed');
  });

  it('no bailout after 27, and never more than once', () => {
    const l = life('RENT-OLD');
    l.st.calendar.age = 30;
    l.st.status.home = { kind: 'flat', rent: 500, since: 0 };
    l.st.money.balance = -2000;
    until(l, 'evt_kira_gunu');
    l.ans('anne');
    expect(l.st.counters.bailouts).toBe(0);
    expect(l.st.dueQueue.some((d) => d.source === 'bailout')).toBe(false);
  });
});

describe('İcra/İflas (02 §2.3.4)', () => {
  it('crossing −24 Birim only raises a flag; the doc_icra card applies the reset', () => {
    const l = life('ICRA');
    l.st.status.home = { kind: 'flat', rent: 500, since: 0 };
    l.st.money.balance = -23_990;
    const ego = l.st.meters.ego;
    const n = until(l, 'doc_icra', 4);
    expect(n).toBeGreaterThan(0);
    expect(l.st.card!.forced).toBe(true);
    expect(l.st.money.balance).toBe(TUNING.economy.bankruptcyResetPara);
    expect(l.st.flags).toContain('iflas');
    expect(l.st.flags).not.toContain(BANKRUPTCY_PENDING);
    expect(l.st.meters.ego).toBeLessThan(ego);
    expect(l.st.counters.bankruptcies).toBe(1);
  });

  it('falls back to the immediate reset when the bundle has no İcra card', () => {
    const l = life('ICRA-FB', FIXTURE_ONLY);
    l.st.money.balance = -23_990;
    l.st.status.home = { kind: 'flat', rent: 500, since: 0 };
    for (let i = 0; i < 4 && l.st.counters.bankruptcies === 0; i++) { l.day(); l.ans(); }
    expect(l.st.counters.bankruptcies).toBe(1);
    expect(l.st.flags).not.toContain(BANKRUPTCY_PENDING);
    expect(l.st.money.balance).toBeGreaterThanOrEqual(TUNING.economy.bankruptcyAtPara);
  });
});

describe('envelopes (03 §2.8, L03-11)', () => {
  it('a resolver with pre envelopeOpen:true plays within 6 shown days of its due date and resolves its envelope', () => {
    const l = life('ENV-RES');
    l.day(); l.ans();
    openEnvelope(l.st, 'test', { teaserKey: 'env.t', dueDays: [10, 10], weight: 3, resolverEventId: 'evt_syn_env_resolve' });
    const env = l.st.envelopes.at(-1)!;
    expect(l.st.dueQueue.find((d) => d.envelopeId === env.id)).toBeDefined();
    let shownAfterDue = -1;
    for (let i = 0; i < 60; i++) {
      l.day();
      if (l.st.calendar.calendarDay >= env.dueDay) shownAfterDue++;
      if (l.st.card?.eventId === 'evt_syn_env_resolve') break;
      expect(l.st.calendar.calendarDay < env.dueDay || shownAfterDue < 6).toBe(true);
      l.ans();
    }
    expect(l.st.card?.eventId).toBe('evt_syn_env_resolve');
    expect(l.st.calendar.calendarDay).toBeGreaterThanOrEqual(env.dueDay);   // never before its due date
    expect(shownAfterDue).toBeLessThan(6);
    const e = l.st.envelopes.find((x) => x.id === env.id)!;
    expect(e.opened && e.resolved).toBe(true);
    expect(l.st.dueQueue.some((d) => d.envelopeId === env.id)).toBe(false);
  });

  it('OPEN_ENVELOPE opens without resolving; an unknown id is a haptic error', () => {
    const l = life('ENV-OPEN');
    openEnvelope(l.st, 'test', { teaserKey: 'env.t', dueDays: [30, 30], weight: 1, resolverEventId: 'evt_syn_env_resolve' });
    const id = l.st.envelopes[0]!.id;
    expect(l.act({ type: 'OPEN_ENVELOPE', envelopeId: id })).toEqual([]);
    expect(l.st.envelopes[0]).toMatchObject({ opened: true, resolved: false });
    expect(l.act({ type: 'OPEN_ENVELOPE', envelopeId: 'nope' })).toEqual([{ kind: 'HAPTIC', pattern: 'error' }]);
  });
});
