/**
 * Mortality beyond the yearly die (playtest 2026-11-12 "ölüm bağlamsız", "kimse ölmüyor, yas yok"):
 *  - Son perde: an illness death rolled while health is low or age is high is deferred a few weeks and
 *    foreshadowed by 1–2 forced `omen` cards; the death itself lands on the shown day that reaches `pendingDeath.day`.
 *  - NPC aging: every birthday each living NPC listed in `npcLife.roles` rolls an age-based yearly death chance;
 *    a hit queues one eligible `loss:<role>` card, and the NPC dies (alive=false) when that card is shown.
 * All draws are on the `hazard` channel after the player's own die, and only when the bundle has the matching
 * events — a bundle without omen / loss content draws nothing extra.
 */
import { TUNING, steppedByAge } from './tuning';
import { addFlag, drawChanceBp, drawInt, removeFlag, weightedIndex } from './util';
import { eligible, noveltyPm } from './salience';
import { indexContent } from './content';
import type { ContentBundle, DueItem, GameEvent, LifeState, MetaState } from './types';

const O = TUNING.hazard.omen;
const NL = TUNING.npcLife;
export const LOSS_SOURCE = 'loss:';
export const OMEN_SOURCE = 'omen';

const taggedCache = new WeakMap<ContentBundle, Map<string, GameEvent[]>>();
function tagged(content: ContentBundle, tag: string): GameEvent[] {
  let m = taggedCache.get(content);
  if (!m) { m = new Map(); taggedCache.set(content, m); }
  let v = m.get(tag);
  if (!v) { v = indexContent(content).bundle.events.filter((e) => e.tags.includes(tag)); m.set(tag, v); }
  return v;
}

function pickNovel(st: LifeState, meta: MetaState, pool: GameEvent[]): GameEvent | null {
  if (!pool.length) return null;
  const i = weightedIndex(st, 'hazard', pool.map((e) => noveltyPm(e, st, meta)));
  return i < 0 ? null : pool[i]!;
}

const due = (st: LifeState, day: number, ev: GameEvent, source: string): DueItem =>
  ({ day, eventId: ev.id, priority: 6, valence: ev.valence, deferredOnce: false, source });

/**
 * Called on the birthday that rolled `cause`. Returns true when the death is deferred (omen cards queued);
 * false → the caller kills now (sudden cause, healthy and not old, no omen content, or no room before next birthday).
 */
export function deferDeath(st: LifeState, meta: MetaState, content: ContentBundle, cause: string): boolean {
  const cls = cause.slice(cause.indexOf('.') + 1);
  if (!(O.illnessClasses as string[]).includes(cls)) return false;
  if (!(Math.trunc(st.stats.health / 100) < O.healthBelowPoints || st.calendar.age >= O.ageFrom)) return false;
  const all = tagged(content, O.tag);
  if (!all.length) return false;
  const now = st.calendar.calendarDay;
  const last = st.calendar.nextBirthdayDay - 1;                  // the death stays in this year of life
  addFlag(st, O.flag);
  const pool = all.filter((e) => eligible(e, st, meta));
  if (!pool.length || last - now < 4) { removeFlag(st, O.flag); return false; }
  const day = Math.min(last, now + drawInt(st, 'hazard', O.deathDelayDays[0]!, O.deathDelayDays[1]!));
  let d1 = Math.min(day - 1, now + drawInt(st, 'hazard', O.firstOmenDays[0]!, O.firstOmenDays[1]!));
  if (d1 <= now) d1 = now + 1;
  const first = pickNovel(st, meta, pool)!;
  st.dueQueue.push(due(st, d1, first, OMEN_SOURCE));
  if (O.maxCards >= 2 && pool.length > 1 && drawChanceBp(st, 'hazard', O.secondCardChanceBp)) {
    const d2 = d1 + drawInt(st, 'hazard', O.omenGapDays[0]!, O.omenGapDays[1]!);
    const second = pickNovel(st, meta, pool.filter((e) => e !== first));
    if (second && d2 < day) st.dueQueue.push(due(st, d2, second, OMEN_SOURCE));
  }
  st.pendingDeath = { cause, day };
  return true;
}

/** Kill an NPC (loss card shown or its item dropped): alive=false, the cat leaves the status strip. */
export function killNpc(st: LifeState, role: string): void {
  const n = st.npcs.find((x) => x.role === role);
  removeFlag(st, NL.pendingFlagPrefix + role);
  if (!n || !n.alive) return;
  n.alive = false;
  if (!n.memories.includes(NL.deadMemory)) n.memories.push(NL.deadMemory);
  if (role === 'cat') st.status.assets = st.status.assets.filter((a) => a !== 'kedi');
}

/** The role a `loss:<role>` due item stands for, or null. */
export const lossRole = (item: Pick<DueItem, 'source'> | null | undefined): string | null =>
  item && item.source.startsWith(LOSS_SOURCE) ? item.source.slice(LOSS_SOURCE.length) : null;

/** Integer age in years of an NPC with a known birth day. */
export const npcAge = (st: LifeState, role: string): number | null => {
  const n = st.npcs.find((x) => x.role === role);
  return n?.bornDay === undefined ? null : Math.floor((st.calendar.calendarDay - n.bornDay) / 365);
};

/** Birthday pulse: each living, aging NPC rolls its yearly death chance; a hit queues its loss card. */
export function ageNpcs(st: LifeState, meta: MetaState, content: ContentBundle): void {
  const now = st.calendar.calendarDay;
  const defs = NL as unknown as Record<string, { hazardBpByAge: number[][] } | undefined>;
  for (const role of NL.roles) {
    const n = st.npcs.find((x) => x.role === role);
    const def = defs[role];
    if (!n || !n.exists || !n.alive || n.bornDay === undefined || !def) continue;
    const source = LOSS_SOURCE + role;
    if (st.dueQueue.some((d) => d.source === source)) continue;
    const all = tagged(content, source);
    if (!all.length) continue;                                    // no loss content in this bundle → no roll
    const bp = steppedByAge(def.hazardBpByAge, Math.floor((now - n.bornDay) / 365));
    if (bp <= 0 || !drawChanceBp(st, 'hazard', bp)) continue;
    addFlag(st, NL.pendingFlagPrefix + role);                     // opens the engine-only loss cards
    const ev = pickNovel(st, meta, all.filter((e) => eligible(e, st, meta)));
    if (!ev) {                                                    // nothing can voice it this year: retry next birthday
      removeFlag(st, NL.pendingFlagPrefix + role);
      if (bp >= 10000) killNpc(st, role);
      continue;
    }
    st.dueQueue.push(due(st, now + drawInt(st, 'hazard', NL.dueDays[0]!, NL.dueDays[1]!), ev, source));
  }
}
