/**
 * D-157 Hayat Yolu (life milestones). A 10.000-event pool drowns the few events that move a life forward
 * (partner → engagement → wedding → baby): measured 30 lives, 0 weddings. On each birthday every stage whose
 * conditions hold rolls once; on success one eligible event tagged `milestone:<stage>` is queued as a forced
 * day card. The event itself still offers the choice (say yes / not yet), so the player decides the outcome.
 * No candidates → no RNG drawn, so bundles without milestone events keep their golden hash.
 */
import { TUNING } from './tuning';
import { drawChanceBp, drawInt, weightedIndex } from './util';
import { eligible, noveltyPm } from './salience';
import type { ContentBundle, LifeState, MetaState } from './types';

const M = TUNING.milestones;
export const MILESTONE_TAG = 'milestone:';

export function queueMilestones(st: LifeState, meta: MetaState, content: ContentBundle): void {
  const age = st.calendar.age, now = st.calendar.calendarDay, p = st.status.partner;
  for (const s of M.stages) {
    if (age < s.ageMin || age > s.ageMax) continue;
    if (s.needPartner !== !!p) continue;
    if (p && now - p.since < s.minPartnerYears * 365) continue;
    if (!s.flagsAll.every((f) => st.flags.includes(f)) || s.flagsNone.some((f) => st.flags.includes(f))) continue;
    const tag = MILESTONE_TAG + s.id;
    if (st.dueQueue.some((d) => d.source === tag)) continue;
    const pool = content.events.filter((e) => e.tags.includes(tag) && eligible(e, st, meta));
    if (!pool.length) continue;
    if (!drawChanceBp(st, 'director', s.chanceBp)) continue;
    const i = weightedIndex(st, 'director', pool.map((e) => noveltyPm(e, st, meta)));
    const ev = pool[Math.max(0, i)]!;
    st.dueQueue.push({ day: now + drawInt(st, 'director', M.dueMinDays, M.dueMaxDays), eventId: ev.id, priority: 6, valence: ev.valence, deferredOnce: false, source: tag });
    return;                                                       // one milestone per year
  }
}
