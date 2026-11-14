/**
 * WagerService — the coach's ledger (03 §2.6, D-009). The coach always predicts `fail`.
 * Eligibility: event.wager.eligible ∧ check-based non-skill choice ∧ type ∉ {document, call, minigame}
 * ∧ pEff ∈ [0.35, 0.65] ∧ ≥ 3 shown days since the last wager ∧ ≤ 2 per 10 shown days ∧ ≤ 2 per year (gentle: 1).
 * Odds are integer bp; the displayed odds ARE the dice threshold (honesty rule).
 * The service is an observer: it never draws from the `outcome` channel nor changes stats (twin-life invariant).
 */
import { TUNING } from './tuning';
import { clamp, drawInt } from './util';
import { branchesOf, choiceOf, keySlip } from './content';
import type { ChoiceT } from '@motto/content-schema';
import type { GameEvent, LifeState, WagerOffer } from './types';

const W = TUNING.wager;

function statBp(st: LifeState, stat: string | undefined): number {
  if (!stat) return 5000;
  if (stat in st.stats) return st.stats[stat as keyof LifeState['stats']];
  if (stat in st.meters) return st.meters[stat as keyof LifeState['meters']];
  return 5000;
}

/**
 * Effective success probability (bp) of a check choice: tension normalisation (±0.15 by stat), pending near-miss
 * bonus, luck scaling ×(1 + luck/500) when the success branch is `luckScaled` (02 §2.2.5). Clamped to [0.05, 0.95].
 */
export function effectivePBp(ev: GameEvent, ch: ChoiceT, st: LifeState): number {
  if (!ch.check) return 10000;
  let p = ch.check.base + Math.trunc((W.kStatBp * (statBp(st, ch.check.stat) - 5000)) / 5000);
  if (ch.check.goal) p += st.reward.pendingBonus[ch.check.goal] ?? 0;
  const out = ev.outcomes[ch.id];
  const first = out ? branchesOf(out)[0] : undefined;
  if (first?.luckScaled) p = Math.trunc((p * (50000 + st.hidden.luck)) / 50000);
  return clamp(p, 500, 9500);
}

/** Screen today's card for a wager offer (no RNG). */
export function screenWager(ev: GameEvent, st: LifeState): WagerOffer | null {
  if (!ev.wager?.eligible) return null;
  if (ev.type === 'document' || ev.type === 'call' || ev.type === 'minigame') return null;
  const ch = ev.wager.check ? choiceOf(ev, ev.wager.check) : ev.choices.find((c) => c.check && !c.check.skill);
  if (!ch?.check || ch.check.skill) return null;
  const p = effectivePBp(ev, ch, st);
  if (p < W.pMinBp || p > W.pMaxBp) return null;
  const w = st.wagerLog, day = st.calendar.dayIndex;
  if (day - w.lastDay < W.minGapDays) return null;
  if (w.recentDays.filter((d) => day - d < 10).length >= W.per10Days) return null;
  if (w.thisYear >= (st.voice === 'gentle' ? W.perYearGentle : W.perYear)) return null;
  return { choiceId: ch.id, prediction: 'fail', pOddsBp: p, slipKey: keySlip(ev) };
}

/** Resolve an open wager once its choice is answered; returns the stamp. */
export function resolveWager(st: LifeState, ev: GameEvent, offer: WagerOffer, success: boolean): { result: 'calledIt' | 'iWasWrong'; variant: number } {
  const result = success ? 'iWasWrong' : 'calledIt';
  const variant = result === 'iWasWrong' ? drawInt(st, 'wager', 0, W.stampVariants - 1) : 0;
  const day = st.calendar.dayIndex;
  const w = st.wagerLog;
  w.lastDay = day; w.thisYear++; w.total++;
  w.recentDays = [...w.recentDays.filter((d) => day - d < 10), day];
  if (result === 'calledIt') { w.coachHits++; st.yearStats.wagerHits++; }
  st.yearStats.wagers++;
  st.wagers.push({ dayIndex: day, eventId: ev.id, choiceId: offer.choiceId, prediction: 'fail', pOddsBp: offer.pOddsBp, outcome: result, stampVariant: variant });
  st.notebook.push({ kind: 'wager', key: `wager.${ev.id}`, dayIndex: day });
  return { result, variant };
}
