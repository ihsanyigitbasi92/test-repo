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
import { isRetired, RETIRED_TITLE } from './status';
import type { ContentBundle, DueItem, Effect, GameEvent, Housing, LifeState, MetaState, MeterId, StatId } from './types';

const ST = TUNING.stats;
const FLOOR: Record<StatId, number> = { health: 0, joy: ST.floors.joy, brain: 0, charm: ST.floors.charm };

function npc(st: LifeState, role: string) {
  let n = st.npcs.find((x) => x.role === role);
  if (!n) { n = { role, exists: false, alive: true, affinity: 20, memories: [] }; st.npcs.push(n); }
  return n;
}

const JH = ST.joyHedonic;
/** Sprint 3 hedonic adaptation: a positive joy delta (bp) shrinks when joy is already high (never below 1 point). */
export function hedonic(joy: number, d: number): number {
  const pm = joy >= JH.topBp ? JH.topPm : joy >= JH.highBp ? JH.highPm : 1000;
  return pm === 1000 ? d : Math.max(100, mulDiv(d, pm, 1000));
}

/** A job brings a boss (D-062 speaker gate: `boss` exists only while employed). */
function setJobNpc(st: LifeState, employed: boolean): void { npc(st, 'boss').exists = employed; }

export function setHome(st: LifeState, kind: Housing, rent?: number): void {
  const h = TUNING.economy.housing[kind];
  const since = st.status.home.kind === kind ? st.status.home.since : st.calendar.calendarDay;   // sprint 3: a re-set mortgage keeps its term
  st.status.home = { kind, rent: clamp(rent ?? h.rent, Math.min(h.rent, h.maxRent), h.maxRent), since };   // D-159 rent band
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
    if (d > 0 && k === 'joy') d = hedonic(st.stats.joy, d);     // sprint 3: a happy life gets used to good news
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
  if (fx.money) {                                                 // sprint 3 (P1-4): money applies exactly as the text says
    moneyDelta(st, fx.money);
    out.push({ kind: 'FLOAT_NUM', stat: 'money', delta: fx.money });
  }
  const wasMarried = st.flags.includes('evli'), hadPartner = st.status.partner !== null;
  for (const f of fx.flags?.add ?? []) addFlag(st, f);
  for (const f of fx.flags?.remove ?? []) removeFlag(st, f);
  for (const n of fx.npc ?? []) {
    const x = npc(st, n.role);
    if (n.create) {
      if (!x.alive && n.role === 'cat') {                         // a new cat after the old one died (same role, fresh life)
        x.alive = true; x.affinity = 20; x.memories = []; x.bornDay = st.calendar.calendarDay - 365;
        removeFlag(st, 'pamuk_vefat');
        if (!st.status.assets.includes('kedi')) st.status.assets.push('kedi');
      }
      x.exists = true; if (n.role === 'child' && x.bornDay === undefined) x.bornDay = st.calendar.calendarDay;
    }
    if (n.kill) x.alive = false;
    if (n.affinity) x.affinity = clamp(x.affinity + n.affinity, 0, 100);
    if (n.memory && !x.memories.includes(n.memory)) x.memories.push(n.memory);
  }
  if (fx.career) {
    const tiers = TUNING.economy.tiersMonthlyPara;
    const retired = isRetired(st.status.job);                    // sprint 3: a pension is not a job (no firing, no rungs)
    if (fx.career.fire && st.status.job && !retired) { st.status.job = null; addFlag(st, 'is_ariyor'); setJobNpc(st, false); }
    if (fx.career.set && fx.career.set !== RETIRED_TITLE && !retired) {   // a retiree keeps the pension (no "Maaş günü" at 90)
      const prev = st.status.job;
      st.status.job = { title: fx.career.set, tier: prev?.tier ?? 1, monthly: prev?.monthly ?? tiers[1]!, since: st.calendar.calendarDay };
      setJobNpc(st, true);
    }
    if (fx.career.rungDelta && st.status.job && !isRetired(st.status.job)) {
      const tier = clamp(st.status.job.tier + fx.career.rungDelta, 1, tiers.length - 1);   // D-159: a job never pays 0
      st.status.job = { ...st.status.job, tier, monthly: tiers[tier]! };
    }
  }
  if (fx.housing) setHome(st, fx.housing);
  const s = fx.status;
  if (s) {
    if (s.job === null) { if (!isRetired(st.status.job)) { st.status.job = null; addFlag(st, 'is_ariyor'); setJobNpc(st, false); } }
    else if (s.job && !isRetired(st.status.job)) { st.status.job = { ...s.job, since: st.calendar.calendarDay }; removeFlag(st, 'is_ariyor'); setJobNpc(st, true); }
    if (s.home) setHome(st, s.home.kind, s.home.rent);
    if (s.rentDelta) st.status.home.rent = clamp(st.status.home.rent + s.rentDelta, 0, TUNING.economy.housing[st.status.home.kind].maxRent);
    if (s.partner === null) st.status.partner = null;
    else if (s.partner) st.status.partner = { npc: s.partner.npc, since: st.calendar.calendarDay };
    for (const a of s.assets?.add ?? []) if (!st.status.assets.includes(a)) st.status.assets.push(a);
    for (const a of s.assets?.remove ?? []) st.status.assets = st.status.assets.filter((x) => x !== a);
  }
  relationshipContinuity(st, wasMarried, hadPartner);
  const idx = indexContent(content);
  const grief = ev.tags.some((t) => (TUNING.npcLife.griefTags as string[]).includes(t) || t.startsWith('loss:'));
  for (const fu of fx.followUp ?? []) {
    const target = idx.byId.get(fu.eventId);
    if (!target) continue;
    if (fu.chance !== undefined && !drawChanceBp(st, 'beats', fu.chance)) continue;
    const day = st.calendar.calendarDay + drawInt(st, 'beats', fu.delayDays[0], Math.max(fu.delayDays[0], fu.delayDays[1]));
    const item: DueItem = { day, eventId: fu.eventId, priority: fu.forced ? 6 : 9, valence: target.valence, deferredOnce: false, source: `followUp:${ev.id}` };
    if (grief) item.minDayIndex = st.calendar.dayIndex + 1 + TUNING.npcLife.griefShownDays;   // O3: a grief pause of N shown days
    st.dueQueue.push(item);
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

/**
 * Playtest 2026-11-12 continuity: married tenure counts from the wedding (HUD "Evli · N yıldır" read `since` from the
 * first date), and a single life carries no engagement (a stale `nisanli` let a ring-congratulation fire on "Bekâr").
 */
function relationshipContinuity(st: LifeState, wasMarried: boolean, hadPartner: boolean): void {
  const p = st.status.partner;
  if (!p) {
    removeFlag(st, 'nisanli');
    // a finished breakup / divorce closes the partner role (speaker gate), so "your partner" scenes stop firing;
    // a divorce still in progress (`bosanma_sureci`) keeps it for its negotiation scenes
    const done = (st.flags.includes('ayrildi') || st.flags.includes('bosandi')) && !st.flags.includes('bosanma_sureci');
    const n = st.npcs.find((x) => x.role === 'partner');
    if (hadPartner && done && n?.alive) n.exists = false;
    return;
  }
  if (!hadPartner) npc(st, 'partner').exists = true;              // a new relationship reopens the role
  if (!wasMarried && st.flags.includes('evli')) {
    st.status.partner = { ...p, since: st.calendar.calendarDay, datingSince: p.datingSince ?? p.since };
    removeFlag(st, 'nisanli');
  }
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
