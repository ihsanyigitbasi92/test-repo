/**
 * Salience scoring (03 §2.4), integer per-mille arithmetic:
 *   score = rarityW × weight × (1 + 0.35·specificity) × novelty × recency × curveFit × arcBoost
 *         × valenceMult × moodMult × lolMult × relaxMult × wowBudget
 * goalBoost is 1 in the MVP engine (goals are not modelled yet).
 */
import { TUNING, bandFor } from './tuning';
import { evalPre, specificity2 } from './pre';
import { FACES } from './types';
import type { Pre } from '@motto/content-schema';
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

const FACE_SET: ReadonlySet<string> = new Set(FACES);
const speakerCache = new WeakMap<GameEvent, readonly string[]>();
/** Familiar Faces voicing an unconditional dialog line (D-062 / 03 §2.2.3 implicit precondition), memoised. */
export function requiredSpeakers(ev: GameEvent): readonly string[] {
  let v = speakerCache.get(ev);
  if (v === undefined) {
    v = [...new Set((ev.dialog ?? []).filter((d) => !d.when && FACE_SET.has(d.speaker)).map((d) => d.speaker))];
    speakerCache.set(ev, v);
  }
  return v;
}

/** Roles whose `alive` the precondition tree sets explicitly (anywhere under all/any/none). */
function preAliveRoles(pre: Pre | undefined, out: Set<string>): Set<string> {
  if (!pre) return out;
  for (const [role, c] of Object.entries(pre.npc ?? {})) if (c && c.alive !== undefined) out.add(role);
  for (const p of [...(pre.all ?? []), ...(pre.any ?? []), ...(pre.none ?? [])]) preAliveRoles(p, out);
  return out;
}

const NL = TUNING.npcLife;
const TAG_ROLE = Object.entries(NL.impliedByTag).filter(([k]) => k !== '$comment') as [string, string][];
const FLAG_TAGS = Object.entries(NL.flagsByTag).filter(([k]) => k !== '$comment') as [string, string[]][];
interface TextGate { role?: string; flagsAny?: string[]; words: string[]; skipWords: string[] }
const TEXT_GATES = NL.textGates as unknown as TextGate[];
const isGrief = (ev: GameEvent): boolean => ev.tags.some((t) => NL.griefTags.includes(t) || t.startsWith('loss:'));
const textCache = new WeakMap<GameEvent, string>();
/** Every string of an event (ids, tags, tr/en text) — memoised; the text gates look for names in it. */
function eventText(ev: GameEvent): string {
  let v = textCache.get(ev);
  if (v === undefined) { v = JSON.stringify(ev); textCache.set(ev, v); }
  return v;
}
const mentions = (text: string, words: readonly string[]): boolean => words.some((w) => text.includes(w));

/** Flags the precondition tree names anywhere (flags.all / any / none under all/any/none). */
function preFlags(pre: Pre | undefined, out: Set<string>): Set<string> {
  if (!pre) return out;
  for (const f of [...(pre.flags?.all ?? []), ...(pre.flags?.any ?? []), ...(pre.flags?.none ?? [])]) out.add(f);
  for (const p of [...(pre.all ?? []), ...(pre.any ?? []), ...(pre.none ?? [])]) preFlags(p, out);
  return out;
}

const tagRoleCache = new WeakMap<GameEvent, readonly string[]>();
/**
 * NPC aging: roles an event's tags imply must be alive (e.g. `kedi` → cat, `anne` → mom), like the D-062 speaker
 * gate for narration-only scenes. Sprint 3: a text gate role counts too (an untagged scene that names Pamuk / Biscuit
 * needs the cat). Skipped for a role the pre sets `alive` for, and for grief-tagged events. Memoised.
 */
export function tagImpliedRoles(ev: GameEvent): readonly string[] {
  let v = tagRoleCache.get(ev);
  if (v === undefined) {
    if (isGrief(ev)) v = [];
    else {
      const explicit = preAliveRoles(ev.pre, new Set());
      const roles = TAG_ROLE.filter(([t]) => ev.tags.includes(t)).map(([, r]) => r);
      for (const g of TEXT_GATES) if (g.role && mentions(eventText(ev), g.words)) roles.push(g.role);
      v = [...new Set(roles.filter((r) => !explicit.has(r)))];
    }
    tagRoleCache.set(ev, v);
  }
  return v;
}

const flagGateCache = new WeakMap<GameEvent, readonly (readonly string[])[]>();
/**
 * Sprint 3 implicit flag gates: each returned set needs at least one flag present — from a tag (npcLife.flagsByTag,
 * e.g. `kayin_aile` → evli / nisanli / …) or an in-law word in the text (npcLife.textGates). A set is skipped when
 * the pre already names one of its flags. Memoised.
 */
export function impliedFlagSets(ev: GameEvent): readonly (readonly string[])[] {
  let v = flagGateCache.get(ev);
  if (v === undefined) {
    const named = preFlags(ev.pre, new Set());
    const sets: string[][] = [];
    for (const [tag, flags] of FLAG_TAGS) if (ev.tags.includes(tag)) sets.push(flags);
    for (const g of TEXT_GATES) if (g.flagsAny && mentions(eventText(ev), g.words)) sets.push(g.flagsAny);
    v = sets.filter((fs) => !fs.some((f) => named.has(f)));
    flagGateCache.set(ev, v);
  }
  return v;
}

/** Sprint 3: a skip line that names a gated NPC (e.g. "kedi") needs it alive; one with in-law words needs the flags. */
export function skipLineBlocked(line: { tr: string; en: string }, st: LifeState): boolean {
  for (const g of TEXT_GATES) {
    if (!g.skipWords.length || !(mentions(line.tr, g.skipWords) || mentions(line.en, g.skipWords))) continue;
    if (g.role) {
      const n = st.npcs.find((x) => x.role === g.role);
      if (!n || !n.exists || !n.alive) return true;
    }
    if (g.flagsAny && !g.flagsAny.some((f) => st.flags.includes(f))) return true;
  }
  return false;
}

const CH = TUNING.child;
const childCache = new WeakMap<GameEvent, readonly [number, number] | null>();
/** Child-age window [min, max] in years (max −1 = open) for an event about the child, else null. Memoised. */
export function childWindow(ev: GameEvent): readonly [number, number] | null {
  let v = childCache.get(ev);
  if (v === undefined) {
    const about = requiredSpeakers(ev).includes('child') || ev.pre?.npc?.child?.exists === true;
    if (!about) v = null;
    else {
      let lo = -1, hi = -1;                                            // a stage tag wins over the player-age fallback
      for (const [tag, mn, mx] of CH.byTag as [string, number, number][]) {
        if (!ev.tags.includes(tag)) continue;
        lo = Math.max(lo, mn);
        if (mx >= 0) hi = hi < 0 ? mx : Math.min(hi, mx);
      }
      if (lo < 0) lo = Math.max(0, (ev.pre?.age?.min ?? 0) - CH.assumedParentAge);
      if (hi >= 0 && lo > hi) lo = hi;
      v = [lo, hi];
    }
    childCache.set(ev, v);
  }
  return v;
}

/** Hard gates: per-life cap, age band, implicit speaker / tag precondition (NPC exists ∧ alive), child age, preconditions. */
export function eligible(ev: GameEvent, st: LifeState, meta: MetaState): boolean {
  if (ev.maxPerLife !== undefined && (st.seen[ev.id] ?? 0) >= ev.maxPerLife) return false;
  if (ev.ageBand && !ev.ageBand.includes(bandFor(st.calendar.age).name as never)) return false;
  for (const role of requiredSpeakers(ev)) {
    const n = st.npcs.find((x) => x.role === role);
    if (!n || !n.exists || !n.alive) return false;
  }
  for (const role of tagImpliedRoles(ev)) {
    const n = st.npcs.find((x) => x.role === role);
    if (n && n.exists && !n.alive) return false;                        // only a known death closes it
  }
  for (const fs of impliedFlagSets(ev)) if (!fs.some((f) => st.flags.includes(f))) return false;
  const cw = childWindow(ev);
  if (cw) {
    const kid = st.npcs.find((x) => x.role === 'child');
    if (kid?.bornDay !== undefined) {                                   // legacy children (no bornDay) are not gated
      const years = Math.floor((st.calendar.calendarDay - kid.bornDay) / 365);
      if (years < cw[0] || (cw[1] >= 0 && years > cw[1])) return false;
    }
  }
  return evalPre(ev.pre, st, meta, ev.id);
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
