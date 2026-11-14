/**
 * ANSWER reducer body (03 §2.2, §2.6, §2.7, §2.9): pattern count → outcome die (`outcome` channel; the date-seeded
 * `daily` stream on Günün Günü) → honest near-miss framing → effects → wager stamp (observer only)
 * → reply / outcome / coach bubbles (with `params` for `{n}`, `{ego}`, `{name}` …).
 * Honesty rule: success ⇔ die < effectivePBp(check.base …) — the same number the wager slip shows. The schema
 * pins branch[0].p === check.base, so content cannot advertise other odds; fail branches (index ≥ 1) share the
 * rest by their `p` as relative weights (normalised over the fail branches).
 */
import type { CoachLineT, OutcomeT } from '@motto/content-schema';
import { TUNING } from './tuning';
import { drawInt } from './util';
import { dailyRng } from './director';
import { textParams } from './card';
import { branchesOf, choiceOf, indexContent, keyChoice, keyCoach, keyNearMiss, keyOutcome } from './content';
import { evalPre } from './pre';
import { effectivePBp, resolveWager } from './wager';
import { applyEffects } from './apply';
import { die } from './day';
import { noteFelt } from './pity';
import type { Bubble, ContentBundle, Effect, GameEvent, LifeState, MetaState } from './types';

const NM = TUNING.nearMiss;

interface Roll { branch: number; success: boolean; nearMiss: boolean }

/** Honest near-miss (03 §2.7): only on a real fail within the window, with caps; promises a real bonus next time. */
function frameNearMiss(st: LifeState, goal: string | undefined, marginBp: number): boolean {
  const nm = st.reward.nearMiss;
  if (!goal || marginBp > NM.windowBp || nm.sessionCount >= NM.sessionCap) return false;
  if (st.calendar.dayIndex - (nm.lastDayByGoal[goal] ?? -999) < NM.goalCooldownDays) return false;
  if ((nm.count + 1) * 1000 > NM.maxRatePm * Math.max(1, nm.failCount)) return false;
  nm.count++; nm.sessionCount++; nm.lastDayByGoal[goal] = st.calendar.dayIndex;
  st.reward.pendingBonus[goal] = NM.bonusBp;
  return true;
}

type Draw = (min: number, max: number) => number;

/** Weighted index with an injected integer draw (fail-branch weights are normalised by their sum). */
function weightedBy(draw: Draw, weights: readonly number[]): number {
  let total = 0;
  for (const w of weights) total += w;
  if (total <= 0) return 0;
  let r = draw(0, total - 1);
  for (let i = 0; i < weights.length; i++) { r -= weights[i]!; if (r < 0) return i; }
  return weights.length - 1;
}

function roll(st: LifeState, ev: GameEvent, choiceId: string, branches: OutcomeT[], draw: Draw): Roll {
  const ch = choiceOf(ev, choiceId)!;
  if (!ch.check) return { branch: 0, success: true, nearMiss: false };
  const p = effectivePBp(ev, ch, st);
  const goal = ch.check.goal;
  if (goal && st.reward.pendingBonus[goal] !== undefined) { delete st.reward.pendingBonus[goal]; st.reward.nearMiss.bonusApplied++; }
  const r = draw(0, 9999);
  if (r < p) return { branch: 0, success: true, nearMiss: false };
  st.reward.nearMiss.failCount++;
  let branch = 0;
  if (branches.length === 2) branch = 1;
  else if (branches.length > 2) branch = 1 + weightedBy(draw, branches.slice(1).map((b) => b.p ?? 1));
  const nearMiss = !!branches[branch]?.nearMiss && frameNearMiss(st, goal, r - p);
  return { branch, success: false, nearMiss };
}

/** Coach lines: `when`, voice level, and AC-03-08 — no roast while joy < 25 (lift/plain stay). */
function coachLines(st: LifeState, meta: MetaState, lines: CoachLineT[], evId?: string): { line: CoachLineT; j: number }[] {
  const lowJoy = st.stats.joy < TUNING.salience.lowJoyBelowBp;
  return lines.map((line, j) => ({ line, j })).filter(({ line }) =>
    (!line.when || evalPre(line.when, st, meta, evId)) && (!line.level || line.level.includes(st.voice)) && !(lowJoy && line.roast));
}

export function answer(st: LifeState, meta: MetaState, content: ContentBundle, choiceId: string, out: Effect[]): void {
  const card = st.card;
  if (st.phase !== 'day' || !card) return;
  const cc = card.choices.find((c) => c.id === choiceId);
  const ev = indexContent(content).byId.get(card.eventId);
  if (!cc || cc.locked || !ev || !ev.outcomes[choiceId]) return;
  const ch = choiceOf(ev, choiceId)!;
  if (ch.pattern) {                                                // 03 §2.9: the detector only counts
    st.patterns[ch.pattern]++;
    st.yearStats.patterns[ch.pattern] = (st.yearStats.patterns[ch.pattern] ?? 0) + 1;
    if (ch.pattern === 'risk') st.yearStats.riskChoices++;
  }
  const branches = branchesOf(ev.outcomes[choiceId]!);
  const daily = card.daily ? dailyRng(st, card.daily.localDay, `:${ev.id}:${choiceId}`) : null;   // same choice → same die
  const r = roll(st, ev, choiceId, branches, daily ? (a, b) => daily.int(a, b) : (a, b) => drawInt(st, 'outcome', a, b));
  const outcome = branches[r.branch]!;
  const counterKey = `o.${ev.id}.${choiceId}.${r.branch}`;          // `{n}` = how often this branch happened this life
  const n = (st.seen[counterKey] ?? 0) + 1;
  st.seen[counterKey] = n;
  const reply: Bubble = { speaker: 'you', textKey: keyChoice(ev, choiceId), delayMs: 0 };
  out.push({ kind: 'SHOW_DIALOG', bubbles: [reply], layer: 'reply' });
  // the coach line `when: {wagerOpen}` reads the card's wager before it is resolved
  const lines = coachLines(st, meta, outcome.coach, ev.id);
  const floats: Effect[] = [];
  const deathCause = applyEffects(st, meta, content, ev, outcome.effects, floats);
  let felt = 0, money = 0;
  for (const f of floats) if (f.kind === 'FLOAT_NUM') {
    if (f.stat === 'money') money += f.delta;
    else if (f.stat === 'health' || f.stat === 'joy' || f.stat === 'brain' || f.stat === 'charm') felt += f.delta;
  }
  noteFelt(st, ev, felt, money);
  const params = textParams(st, n);                                // after effects: `{ego}` shows the new value
  out.push({ kind: 'SHOW_DIALOG', layer: 'outcome', bubbles: [{ speaker: 'narrator', delayMs: 0, params,
    textKey: r.nearMiss ? keyNearMiss(ev, choiceId, r.branch) : keyOutcome(ev, choiceId, r.branch) }] }, ...floats);
  const coach = lines.map(({ line, j }): Bubble => ({
    speaker: 'coach', textKey: keyCoach(ev, choiceId, r.branch, j), roast: line.roast, lift: line.lift, delayMs: 0, params }));
  if (card.wager && card.wager.choiceId === choiceId) {
    const s = resolveWager(st, ev, card.wager, r.success);
    out.push({ kind: 'STAMP', result: s.result, pOddsBp: card.wager.pOddsBp, variant: s.variant });
  }
  if (coach.length) out.push({ kind: 'SHOW_DIALOG', bubbles: coach, layer: 'coach' });
  card.answered = { choiceId, branch: r.branch, nearMiss: r.nearMiss };
  st.phase = 'answered';
  if (deathCause) die(st, meta, deathCause, 'scripted', out);
}
