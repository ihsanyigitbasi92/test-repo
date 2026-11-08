/**
 * step(state, meta, action, content) → { state, meta, effects }  (10 §2.3.3 / §3.1).
 * Pure: inputs are never mutated (`step` clones, then runs the in-place reducer `applyAction`).
 * PAUSE / RESUME are UI-only and return the inputs unchanged. Effects are data for the UI; the engine never
 * touches timers, storage, the clock or the network.
 */
import { TUNING } from './tuning';
import { createLife } from './life';
import { drawYearBudget } from './director';
import { ensureEnvelope, nextDay } from './day';
import { answer } from './answer';
import { cyrb128 } from './rng';
import type { Action, ContentBundle, Effect, LifeState, MetaState, StepResult } from './types';

const MC = TUNING.momCall;

/** ANNE ARIYOR trigger (03 §2.3.8 + D-108): edge ≥ 75 or chronic 20 shown days; cooldown 40; ≤ 3 per life; not in FTUE. */
function checkMomCall(st: LifeState): void {
  const mc = st.director.momCall;
  const mom = st.npcs.find((n) => n.role === 'mom');
  if (!mom?.alive || st.meters.momPressure < MC.thresholdBp) { mc.highSince = -1; return; }
  const day = st.calendar.dayIndex;
  const crossed = mc.highSince < 0;
  if (crossed) mc.highSince = day;
  if (mc.pending || mc.count >= MC.maxPerLife || day < MC.ftueDays || day - mc.lastDay < MC.cooldownDays) return;
  if (crossed || day - mc.highSince >= MC.chronicDays) mc.pending = true;
}

/** Session end (03 §2.3.4 / §2.8): open the heaviest envelope, schedule its resolver next session, reset session caps. */
function endSession(st: LifeState, content: ContentBundle, out: Effect[]): void {
  if (st.phase !== 'dead') ensureEnvelope(st, content);
  const open = st.envelopes.filter((e) => !e.resolved).sort((a, b) => b.weight - a.weight || a.createdDay - b.createdDay);
  const heavy = open[0];
  if (heavy && st.phase !== 'dead') {
    heavy.opened = true;
    const item = st.dueQueue.find((d) => d.priority === 4 && d.eventId === heavy.resolverEventId && d.day === heavy.dueDay);
    if (item) item.day = Math.min(item.day, st.calendar.calendarDay + 1);
  }
  out.push({ kind: 'NOTIFY_PLAN', teaserKeys: heavy && st.phase !== 'dead' ? [heavy.teaserKey] : [] });
  const r = st.reward;
  st.director.sessionDayIndex = 0;
  r.surprise.sessionCount = 0; r.legendary.sessionCount = 0; r.nearMiss.sessionCount = 0; r.wowCount = 0;
}

/**
 * In-place reducer. Exposed for the simulation harness (avoids a deep clone per action);
 * `step` is exactly `clone + applyAction`.
 */
export function applyAction(st: LifeState, meta: MetaState, action: Action, content: ContentBundle): { state: LifeState; effects: Effect[] } {
  const out: Effect[] = [];
  switch (action.type) {
    case 'START_LIFE': {
      const life = createLife(action.seed, action.name, content.contentHash, action);
      life.director.yearBudget = drawYearBudget(life);
      return { state: life, effects: out };
    }
    case 'NEXT_DAY':
      if (st.phase === 'idle' || st.phase === 'answered' || st.phase === 'birthday') {
        nextDay(st, meta, content, out);
        if (!st.death) checkMomCall(st);
      }
      break;
    case 'ANSWER':
      answer(st, meta, content, action.choiceId, out);
      if (!st.death) checkMomCall(st);
      break;
    case 'SET_SPEED':
      st.speed = action.speed;
      break;
    case 'END_SESSION':
      endSession(st, content, out);
      break;
    case 'PAUSE':
    case 'RESUME':
      break;
  }
  return { state: st, effects: out };
}

export function step(state: LifeState, meta: MetaState, action: Action, content: ContentBundle): StepResult {
  if (action.type === 'PAUSE' || action.type === 'RESUME') return { state, meta, effects: [] };
  const m = structuredClone(meta);
  const s = action.type === 'START_LIFE' ? state : structuredClone(state);
  const r = applyAction(s, m, action, content);
  return { state: r.state, meta: m, effects: r.effects };
}

/** Stable 128-bit hex digest of a state (replay / cross-platform comparison key). */
export function hashState(state: LifeState): string {
  return cyrb128(JSON.stringify(state)).map((h) => h.toString(16).padStart(8, '0')).join('');
}
