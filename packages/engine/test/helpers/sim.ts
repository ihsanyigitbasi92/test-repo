/** Headless life runner shared by the harness, budget and property tests (03 §6.2 personas, reduced). */
import { applyAction, emptyMeta, sfc32 } from '../../src/index';
import type { Action, ContentBundle, Effect, LifeState, MetaState, ReportCardData } from '../../src/index';

export type Persona = 'first' | 'chaotic' | 'last';

export interface LifeRun {
  state: LifeState; meta: MetaState; actions: Action[]; reports: ReportCardData[];
  minMoney: number; effects: number; stampCount: number; maxNegStreak: number;
  everyStep?: (st: LifeState, a: Action, fx: Effect[]) => void;
}

export function runLife(seed: string, content: ContentBundle, persona: Persona = 'chaotic', opts: {
  meta?: MetaState; maxSteps?: number; sessionDays?: number; onStep?: (st: LifeState, a: Action, fx: Effect[]) => void;
} = {}): LifeRun {
  const meta = opts.meta ?? emptyMeta();
  const pick = sfc32(`persona:${seed}`);
  const actions: Action[] = [];
  const reports: ReportCardData[] = [];
  let effects = 0, stampCount = 0, minMoney = Infinity, shownInSession = 0;
  const go = (st: LifeState, a: Action): LifeState => {
    actions.push(a);
    const r = applyAction(st, meta, a, content);
    effects += r.effects.length;
    for (const e of r.effects) { if (e.kind === 'REPORT_CARD') reports.push(e.data); if (e.kind === 'STAMP') stampCount++; }
    if (r.state.money.balance < minMoney) minMoney = r.state.money.balance;
    opts.onStep?.(r.state, a, r.effects);
    return r.state;
  };
  let st = go(null as unknown as LifeState, { type: 'START_LIFE', seed, name: 'Test' });
  const max = opts.maxSteps ?? 6000;
  for (let i = 0; i < max && st.phase !== 'dead'; i++) {
    st = go(st, { type: 'NEXT_DAY' });
    shownInSession++;
    if (st.phase === 'day' && st.card) {
      const open = st.card.choices.filter((c) => !c.locked);
      const c = persona === 'first' ? open[0]! : persona === 'last' ? open[open.length - 1]! : open[pick.int(0, open.length - 1)]!;
      st = go(st, { type: 'ANSWER', eventId: st.card.eventId, choiceId: c.id, via: 'auto' });
    }
    if (shownInSession >= (opts.sessionDays ?? 20)) { st = go(st, { type: 'END_SESSION' }); shownInSession = 0; }
  }
  return { state: st, meta, actions, reports, minMoney, effects, stampCount, maxNegStreak: st.counters.maxNegStreak };
}

export const quantile = (xs: number[], q: number): number => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))))]!;
};
