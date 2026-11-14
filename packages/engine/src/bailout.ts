/**
 * Bailout offer (02 §2.3.6): once per life, only at age ≤ 27, only with a negative balance and a living mom.
 * It is never applied silently: one of the three bailout events (tuning `economy.bailout.events`, picked on the
 * `beats` channel among those present in the bundle) is queued as a priority-7 forced day card for the next
 * shown day. Called from `effects.bailoutCheck` (rent-day event) and from the birthday pulse.
 * The amounts (+3 Birim, momPressure, debts) live in the events; the `bailoutUsed` flag is set by their effects,
 * `counters.bailouts` (offers) is the engine-side once-per-life guard.
 */
import { TUNING } from './tuning';
import { indexContent } from './content';
import { drawInt } from './util';
import type { ContentBundle, LifeState } from './types';

const B = TUNING.economy.bailout;

/** Returns the queued event id, or null when no offer is due. */
export function bailoutCheck(st: LifeState, content: ContentBundle): string | null {
  const mom = st.npcs.find((n) => n.role === 'mom');
  if (st.money.balance >= 0 || st.calendar.age > B.maxAge || !mom?.alive) return null;
  if (st.flags.includes('bailoutUsed') || st.counters.bailouts > 0 || st.dueQueue.some((d) => d.source === 'bailout')) return null;
  const idx = indexContent(content);
  const pool = B.events.filter((id) => idx.byId.has(id));
  if (!pool.length) return null;
  const id = pool[drawInt(st, 'beats', 0, pool.length - 1)]!;
  st.dueQueue.push({ day: st.calendar.calendarDay, eventId: id, priority: 7, valence: idx.byId.get(id)!.valence, deferredOnce: false, source: 'bailout' });
  st.counters.bailouts++;
  return id;
}
