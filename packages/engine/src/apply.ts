/**
 * Apply one outcome's `effects` block to LifeState (03 §2.2.1 Effects; 02 protection window; D-067 status strip).
 * Content units → engine units: stat/meter/hidden points ×100 = bp; money is Para as written.
 * Returns FLOAT_NUM effects for the UI plus a scripted-death cause when one fires.
 */
import type { EffectsT } from '@motto/content-schema';
import { TUNING } from './tuning';
import { addFlag, clamp, drawChanceBp, drawInt, mulDiv, removeFlag } from './util';
import { moneyDelta, protectionMultPm } from './cashflow';
import { evalPre } from './pre';
import { indexContent } from './content';
import { bailoutCheck } from './bailout';
import type { ContentBundle, Effect, GameEvent, Housing, LifeState, MetaState, MeterId, StatId } from './types';

const ST = TUNING.stats;
const FLOOR: Record<StatId, number> = { health: 0, joy: ST.floors.joy, brain: 0, charm: ST.floors.charm };

function npc(st: LifeState, role: string) {
  let n = st.npcs.find((x) => x.role === role);
  if (!n) { n = { role, exists: false, alive: true, affinity: 20, memories: [] }; st.npcs.push(n); }
  return n;
}

/** A job brings a boss (D-062 speaker gate: `boss` exists only while employed). */
function setJobNpc(st: LifeState, employed: boolean): void { npc(st, 'boss').exists = employed; }

function setHome(st: LifeState, kind: Housing, rent?: number): void {
  st.status.home = { kind, rent: rent ?? TUNING.economy.housing[kind].rent, since: st.calendar.calendarDay };
  if (kind === 'momsHouse') addFlag(st, 'anne_evinde'); else removeFlag(st, 'anne_evinde');
}

function enqueueChain(st: LifeState, content: ContentBundle, ev: GameEvent, node: string): void {
  const target = indexContent(content).bundle.events.find((e) => e.chain && e.chain.id === ev.chain?.id && e.chain.node === node);
  if (!target) return;
  const delay = ev.chain?.next?.find((n) => n.node === node)?.delayDays ?? [1, 1];
  const day = st.calendar.calendarDay + drawInt(st, 'beats', delay[0], Math.max(delay[0], delay[1]));
  st.dueQueue.push({ day, eventId: target.id, priority: 5, valence: target.valence, deferredOnce: false, source: `chain:${ev.chain!.id}` });
}

/** Apply effects; `out` receives FLOAT_NUM effects. Returns a scripted death cause or null. */
export function applyEffects(
  st: LifeState, meta: MetaState, content: ContentBundle, ev: GameEvent, fx: EffectsT | undefined, out: Effect[],
): string | null {
  if (!fx) return null;
  const prot = protectionMultPm(st.calendar.age);
  for (const [k, v] of Object.entries(fx.stats ?? {}) as [StatId, number | undefined][]) {
    if (!v) continue;
    let d = v * 100;
    if (d < 0 && k === 'health') d = -mulDiv(-d, prot, 1000);
    const before = st.stats[k];
    st.stats[k] = clamp(before + d, FLOOR[k], 10000);
    if (st.stats[k] !== before) out.push({ kind: 'FLOAT_NUM', stat: k, delta: st.stats[k] - before });
  }
  for (const [k, v] of Object.entries(fx.meters ?? {}) as [MeterId, number | undefined][]) {
    if (!v) continue;
    const before = st.meters[k];
    if (k === 'momPressure' && !st.npcs.find((n) => n.role === 'mom')?.alive) continue;   // frozen after mom dies
    st.meters[k] = clamp(before + v * 100, 0, 10000);
    if (k === 'cringe' && v * 100 >= ST.cringeSpikeBp) st.yearStats.cringeSpikes++;
    if (k === 'ego' && before <= ST.egoHighBp && st.meters.ego > ST.egoHighBp) st.yearStats.egoCrossed85 = true;
    if (st.meters[k] !== before) out.push({ kind: 'FLOAT_NUM', stat: k, delta: st.meters[k] - before });
  }
  if (fx.hidden?.luck) st.hidden.luck = clamp(st.hidden.luck + fx.hidden.luck * 100, -5000, 5000);
  if (fx.hidden?.stress) st.hidden.stress = clamp(st.hidden.stress + fx.hidden.stress * 100, 0, 10000);
  if (fx.money) {
    const m = fx.money < 0 ? -mulDiv(-fx.money, prot, 1000) : fx.money;
    moneyDelta(st, m);
    out.push({ kind: 'FLOAT_NUM', stat: 'money', delta: m });
  }
  for (const f of fx.flags?.add ?? []) addFlag(st, f);
  for (const f of fx.flags?.remove ?? []) removeFlag(st, f);
  for (const n of fx.npc ?? []) {
    const x = npc(st, n.role);
    if (n.create) x.exists = true;
    if (n.kill) x.alive = false;
    if (n.affinity) x.affinity = clamp(x.affinity + n.affinity, 0, 100);
    if (n.memory && !x.memories.includes(n.memory)) x.memories.push(n.memory);
  }
  if (fx.career) {
    const tiers = TUNING.economy.tiersMonthlyPara;
    if (fx.career.fire && st.status.job) { st.status.job = null; addFlag(st, 'is_ariyor'); setJobNpc(st, false); }
    if (fx.career.set) { st.status.job = { title: fx.career.set, tier: st.status.job?.tier ?? 1, monthly: st.status.job?.monthly ?? tiers[1]!, since: st.calendar.calendarDay }; setJobNpc(st, true); }
    if (fx.career.rungDelta && st.status.job) {
      const tier = clamp(st.status.job.tier + fx.career.rungDelta, 0, tiers.length - 1);
      st.status.job = { ...st.status.job, tier, monthly: tiers[tier]! };
    }
  }
  if (fx.housing) setHome(st, fx.housing);
  const s = fx.status;
  if (s) {
    if (s.job === null) { st.status.job = null; addFlag(st, 'is_ariyor'); setJobNpc(st, false); }
    else if (s.job) { st.status.job = { ...s.job, since: st.calendar.calendarDay }; removeFlag(st, 'is_ariyor'); setJobNpc(st, true); }
    if (s.home) setHome(st, s.home.kind, s.home.rent);
    if (s.rentDelta) st.status.home.rent = Math.max(0, st.status.home.rent + s.rentDelta);
    if (s.partner === null) st.status.partner = null;
    else if (s.partner) st.status.partner = { npc: s.partner.npc, since: st.calendar.calendarDay };
    for (const a of s.assets?.add ?? []) if (!st.status.assets.includes(a)) st.status.assets.push(a);
    for (const a of s.assets?.remove ?? []) st.status.assets = st.status.assets.filter((x) => x !== a);
  }
  const idx = indexContent(content);
  for (const fu of fx.followUp ?? []) {
    const target = idx.byId.get(fu.eventId);
    if (!target) continue;
    if (fu.chance !== undefined && !drawChanceBp(st, 'beats', fu.chance)) continue;
    const day = st.calendar.calendarDay + drawInt(st, 'beats', fu.delayDays[0], Math.max(fu.delayDays[0], fu.delayDays[1]));
    st.dueQueue.push({ day, eventId: fu.eventId, priority: fu.forced ? 6 : 9, valence: target.valence, deferredOnce: false, source: `followUp:${ev.id}` });
  }
  if (fx.envelope && idx.byId.has(fx.envelope.resolverEventId)) openEnvelope(st, ev.id, fx.envelope);
  if (ev.chain) {
    const ch = (st.chains[ev.chain.id] ??= { node: ev.chain.node, startedDay: st.calendar.calendarDay, done: [] });
    ch.node = ev.chain.node;
    if (!ch.done.includes(ev.chain.node)) ch.done.push(ev.chain.node);
    if (fx.chainNext) enqueueChain(st, content, ev, fx.chainNext);
    else { const nx = ev.chain.next?.find((n) => evalPre(n.when, st, meta, ev.id)); if (nx) enqueueChain(st, content, ev, nx.node); }
  } else if (fx.chainNext) enqueueChain(st, content, ev, fx.chainNext);
  if (fx.bailoutCheck) bailoutCheck(st, content);                // 02 §2.3.6: offered as tomorrow's day card
  if (fx.diagnosis && !st.diagnoses.includes(fx.diagnosis)) st.diagnoses.push(fx.diagnosis);
  if (fx.glossary && !st.glossary.includes(fx.glossary)) st.glossary.push(fx.glossary);
  if (fx.notebook) st.notebook.push({ kind: 'note', key: fx.notebook.key, dayIndex: st.calendar.dayIndex });
  if (fx.death && st.calendar.age >= TUNING.hazard.scriptedDeathMinAge) return fx.death.cause;
  return null;
}

/** Envelope queue (03 §2.8): due 7–45 calendar days; at most 2 open, the lightest drops silently. */
export function openEnvelope(st: LifeState, sourceEventId: string, e: { teaserKey: string; dueDays: readonly [number, number] | number[]; weight: number; resolverEventId: string }): void {
  const lo = e.dueDays[0] ?? 7, hi = Math.max(lo, e.dueDays[1] ?? lo);
  const dueDay = st.calendar.calendarDay + drawInt(st, 'beats', lo, hi);
  const id = `env_${st.calendar.dayIndex}_${st.envelopes.length}`;
  st.envelopes.push({ id, createdDay: st.calendar.calendarDay, dueDay, teaserKey: e.teaserKey, weight: e.weight, sourceEventId, resolverEventId: e.resolverEventId, opened: false, resolved: false });
  st.dueQueue.push({ day: dueDay, eventId: e.resolverEventId, priority: 4, valence: 0, deferredOnce: false, source: `envelope:${sourceEventId}`, envelopeId: id });
  const open = st.envelopes.filter((x) => !x.resolved).sort((a, b) => b.weight - a.weight || a.createdDay - b.createdDay);
  for (const drop of open.slice(TUNING.envelope.maxOpen)) {
    drop.resolved = true;
    const i = st.dueQueue.findIndex((d) => d.priority === 4 && d.envelopeId === drop.id);
    if (i >= 0) st.dueQueue.splice(i, 1);
  }
}
