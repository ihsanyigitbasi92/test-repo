/** Engine state → what the placement rules look at (placements.ts `AdGameContext`). Types only from the engine. */
import type { LifeState } from '@motto/engine';
import type { AdGameContext } from './placements';

/** Engine grief tags (tuning.json `npcLife.griefTags`) + every `loss:<role>` card: death of a loved one, funeral, farewell. */
const GRIEF_TAGS = new Set(['veda_kayip', 'cenaze_taziye', 'miras_vasiyet', 'yas']);
export function isGriefScene(tags: readonly string[] | null | undefined): boolean {
  return !!tags?.some((t) => GRIEF_TAGS.has(t) || t.startsWith('loss:'));
}

export function adGameContext(st: LifeState | null, ui: { stage: 'file' | 'play' | 'death'; busy: boolean; auto: boolean; lifeNo: number }): AdGameContext {
  return {
    stage: ui.stage, busy: ui.busy, auto: ui.auto, lifeNo: ui.lifeNo,
    phase: st?.phase ?? null,
    lifeId: st?.lifeSeed ?? null,
    age: st?.calendar.age ?? 0,
    shownDays: st?.counters.shownDays ?? 0,
    joyBp: st?.stats.joy ?? 10000,
    negStreak: st?.reward.negStreak ?? 0,
    nearMiss: !!st?.card?.answered?.nearMiss,
    pendingDeath: !!st?.pendingDeath || !!st?.death,
    inDebt: !!st && (st.money.debt > 0 || st.money.balance < 0),
    monthlySalary: st?.status.job?.monthly ?? 0,
    payday: !!st?.card?.flowLog.some((l) => l.kind === 'payday'),
  };
}

/**
 * Forma Sponsoru reward: a one-off bonus on the balance. The engine has no reward action yet, so the grant is a
 * pure copy-on-write patch of the engine state made by the UI (the only one). TODO(engine): replace with a
 * `GRANT_REWARD` action so the bonus shows up in `yearStats.income` and the replay log.
 */
export function grantMoney(st: LifeState, amount: number): LifeState {
  if (!(amount > 0)) return st;
  const balance = st.money.balance + Math.round(amount);
  return { ...st, money: { ...st.money, balance }, counters: { ...st.counters, peakMoney: Math.max(st.counters.peakMoney, balance) } };
}
