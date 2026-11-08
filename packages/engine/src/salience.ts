/**
 * Salience scoring (03 §2.4), integer per-mille arithmetic:
 *   score = rarityW × weight × (1 + 0.35·specificity) × novelty × recency × curveFit × arcBoost
 *         × valenceMult × moodMult × lolMult × relaxMult × wowBudget
 * goalBoost is 1 in the MVP engine (goals are not modelled yet).
 */
import { TUNING, bandFor } from './tuning';
import { evalPre, specificity2 } from './pre';
import type { GameEvent, LifeState, MetaState } from './types';

const SAL = TUNING.salience;
const SELF_CARE_TAGS = ['selfCare', 'relax', 'wholesome'];
const mul = (s: number, pm: number): number => Math.floor((s * pm) / 1000);
const staticCache = new WeakMap<GameEvent, number>();
/** Content-only part: rarity × weight × (1 + 0.35·specificity), memoised per event object (content is immutable). */
function staticScore(ev: GameEvent): number {
  let v = staticCache.get(ev);
  if (v === undefined) {
    v = mul(SAL.rarityPm[ev.rarity] * (ev.weight ?? 1000), 1000 + Math.floor((SAL.specificityStepPm * (specificity2(ev.pre) + 2 * (ev.salienceBonus ?? 0))) / 2));
    staticCache.set(ev, v);
  }
  return v;
}

/** Session intensity target (03 §2.3.4) in per-mille for t = sessionDayIndex / expectedSessionDays (per-mille). */
export function targetIntensityPm(tPm: number): number {
  if (tPm < 150) return 250 + 2 * tPm;
  if (tPm < 750) return 550 + Math.floor((600 * (tPm - 150)) / 1000);
  if (tPm < 850) return 950;
  return 450;
}

/** Hard gates: preconditions, age band, per-life cap. */
export function eligible(ev: GameEvent, st: LifeState, meta: MetaState): boolean {
  if (ev.maxPerLife !== undefined && (st.seen[ev.id] ?? 0) >= ev.maxPerLife) return false;
  if (ev.ageBand && !ev.ageBand.includes(bandFor(st.calendar.age).name as never)) return false;
  return evalPre(ev.pre, st, meta);
}

/** Recency (cooldowns) in per-mille: 0 while on cooldown, ramps over `recencyRampDays` per tag. */
export function recencyPm(ev: GameEvent, st: LifeState): number {
  const now = st.calendar.calendarDay;
  const lastSelf = st.cooldowns.self[ev.id];
  if (lastSelf !== undefined && ev.cooldownDays?.self !== undefined && now - lastSelf < ev.cooldownDays.self) return 0;
  let r = 1000;
  for (const tag of ev.tags) {
    const last = st.cooldowns.tags[tag];
    if (last === undefined) continue;
    const since = now - last;
    if (since < (ev.cooldownDays?.tags?.[tag] ?? 0)) return 0;
    r = Math.floor((r * Math.min(1000, Math.floor((since * 1000) / SAL.recencyRampDays))) / 1000);
  }
  return r;
}

export function noveltyPm(ev: GameEvent, st: LifeState, meta: MetaState): number {
  const seen = st.seen[ev.id] ?? 0;
  let n = SAL.noveltyUnseenPm;
  if (seen > 0) { n = 1000; for (let i = 0; i < seen && n > SAL.noveltyFloorPm; i++) n = Math.floor((n * SAL.noveltySeenDecayPm) / 1000); }
  const lastLife = meta.legacy.seenLives[ev.id];
  if (lastLife !== undefined && meta.legacy.livesCompleted - lastLife <= 2) n = Math.floor((n * SAL.noveltyPastLivesPm) / 1000);
  return Math.max(SAL.noveltyFloorPm, n);
}

/** Day-constant inputs of the score, computed once per pick. */
export interface SalienceCtx { targetPm: number; lowJoy: boolean; relaxDay: boolean; lolBoost: boolean; lolStarve: boolean; negStreak: number; wowBlocked: boolean }

export function salienceCtx(st: LifeState): SalienceCtx {
  const d = st.director, r = st.reward;
  return {
    targetPm: targetIntensityPm(Math.floor((d.sessionDayIndex * 1000) / Math.max(1, d.expectedSessionDays))),
    lowJoy: st.stats.joy < SAL.lowJoyBelowBp,
    relaxDay: st.calendar.dayIndex % TUNING.session.relaxEvery === 0,
    lolBoost: r.beatsSinceLol >= TUNING.session.lolMinGap,
    lolStarve: r.beatsSinceLol >= TUNING.session.lolMaxGap,
    negStreak: r.negStreak,
    wowBlocked: r.wowCount >= TUNING.session.wowBudget,
  };
}

/** Integer salience score (0 = excluded). `ignoreRecency` is the empty-pool fallback. */
export function salience(ev: GameEvent, st: LifeState, meta: MetaState, ignoreRecency = false, ctx: SalienceCtx = salienceCtx(st)): number {
  let s = staticScore(ev);                                              // ≤ ~2e6
  if (s === 0) return 0;
  if (ev.valence < 0 && ctx.negStreak >= SAL.negStreakBlock) return 0;     // 03 §2.3.6 valence guard
  if (ev.wow && ctx.wowBlocked) return 0;
  const rec = ignoreRecency ? 1000 : recencyPm(ev, st);
  if (rec === 0) return 0;
  s = mul(s, noveltyPm(ev, st, meta));
  s = mul(s, rec);
  const diff = Math.abs(Math.floor(ev.intensity / 10) - ctx.targetPm);
  s = mul(s, Math.max(SAL.curveFitFloorPm, 1000 - Math.floor((SAL.curveFitSlopePm * diff) / 1000)));
  if (ev.chain && st.chains[ev.chain.id]) s = mul(s, SAL.arcBoostPm);
  if (ev.valence < 0 && ctx.negStreak === 1) s = mul(s, SAL.negStreakOneValencePm);
  if (ctx.lowJoy) {
    if (ev.valence <= -1) s = mul(s, SAL.lowJoyNegativePm);
    else if (ev.tags.some((t) => SELF_CARE_TAGS.includes(t))) s = mul(s, SAL.lowJoySelfCarePm);
  }
  if (ctx.lolBoost && ev.isLOL) s = mul(s, SAL.lolBoostPm);
  else if (ctx.lolStarve && !ev.isLOL) s = mul(s, SAL.lolStarvePm);
  if (ctx.relaxDay) {
    if (ev.relax) s = mul(s, SAL.relaxBoostPm);
    else if (ev.intensity > SAL.relaxDampIntensityAboveBp) s = mul(s, SAL.relaxDampPm);
  }
  return s;
}
