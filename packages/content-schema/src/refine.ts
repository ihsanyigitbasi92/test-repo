/**
 * Cross-field rules from 03 §2.2.1 "Zod notları" and the schema-derived lints L03-xx that a
 * single event can verify alone (pool-level rules such as L03-03 document share belong to the CLI).
 */
import { z } from 'zod';
import { GameEventBase, type GameEvent as GameEventT, type Outcome } from './event';

type Ctx = z.RefinementCtx;
const issue = (ctx: Ctx, path: (string | number)[], message: string) => ctx.addIssue({ code: 'custom', path, message });

const branches = (o: Outcome | Outcome[]): Outcome[] => (Array.isArray(o) ? o : [o]);

export function refineEvent(ev: GameEventT, ctx: Ctx): void {
  const choiceIds = ev.choices.map((c) => c.id);
  if (new Set(choiceIds).size !== choiceIds.length) issue(ctx, ['choices'], 'choice ids must be unique');

  // outcomes keys ↔ choices 1:1
  const outKeys = Object.keys(ev.outcomes);
  for (const id of choiceIds) if (!(id in ev.outcomes)) issue(ctx, ['outcomes'], `missing outcome for choice "${id}"`);
  for (const k of outKeys) if (!choiceIds.includes(k)) issue(ctx, ['outcomes', k], 'outcome without a matching choice');

  for (const ch of ev.choices) {
    const out = ev.outcomes[ch.id];
    if (!out) continue;
    const br = branches(out);
    if (!ch.check) {
      if (br.length !== 1 || br[0]?.p !== undefined) issue(ctx, ['outcomes', ch.id], 'choice without check must have a single branch and no p');
      if (br.some((b) => b.nearMiss)) issue(ctx, ['outcomes', ch.id], 'nearMiss only on check-based choices (L03-05)');
    } else {
      const sum = br.reduce((s, b) => s + (b.p ?? (br.length === 1 ? 10000 : 0)), 0);
      if (Math.abs(sum - 10000) > 10) issue(ctx, ['outcomes', ch.id], `branch probabilities must sum to 10000 bp (got ${sum})`);
      if (br.some((b) => b.nearMiss && (b.p ?? 10000) >= 10000)) issue(ctx, ['outcomes', ch.id], 'nearMiss only on a fail branch with p < 1 (L03-05)');
      if (br.some((b) => b.nearMiss) && !ch.check.goal) issue(ctx, ['choices'], 'check.goal is required when nearMiss is used (L03-05)');
    }
    for (const [i, b] of br.entries()) {
      const m = b.effects?.money ?? 0;
      const lim = ev.rarity === 'legendary' ? 25000 : 10000;
      if (m > lim || m < -10000) issue(ctx, ['outcomes', ch.id, i, 'effects', 'money'], `money must be within ±10000 Para (legendary ≤ +25000) (L03-13)`);
      if (ev.rarity === 'legendary' && b.effects?.death) issue(ctx, ['outcomes', ch.id, i], 'legendary events cannot kill (L03-06)');
      if (b.coach.some((c) => c.roast) === false && ev.type !== 'report_card') {
        // D-093 relaxed D-064 to a 3-day budget; keep as a soft requirement: at least one roast OR a plain line.
        if (b.coach.length === 0) issue(ctx, ['outcomes', ch.id, i, 'coach'], 'coach[] must not be empty');
      }
    }
  }

  // pattern: no duplicates (L03-09)
  const patterns = ev.choices.map((c) => c.pattern).filter(Boolean);
  if (new Set(patterns).size !== patterns.length) issue(ctx, ['choices'], 'a pattern may not repeat within one event (L03-09)');

  // two-choice days must carry swipe (03 §2.2.4)
  if (ev.choices.length === 2 && ev.choices.some((c) => !c.swipe)) issue(ctx, ['choices'], 'two-choice days must define swipe left/right (D-065)');

  if (ev.rarity === 'legendary' && (ev.valence < 0 || !ev.wow)) issue(ctx, ['rarity'], 'legendary → valence ≥ 0 and wow:true (L03-06)');

  if (ev.shared) {
    const keys = Object.keys(ev.pre);
    if (keys.some((k) => k !== 'age')) issue(ctx, ['pre'], 'shared events may only constrain age (L03-07)');
    if (ev.universality !== 'universal') issue(ctx, ['universality'], 'shared events must be universal (L03-07)');
  }

  if (ev.call) {
    if (ev.type !== 'call') issue(ctx, ['call'], 'call block requires type:"call"');
    if (ev.call.takeover && ev.call.speaker !== 'mom') issue(ctx, ['call', 'takeover'], 'takeover only for mom (L03-08)');
    const relief = ev.choices.some((c) => branches(ev.outcomes[c.id]!).some((b) => (b.effects?.meters?.momPressure ?? 0) <= 0 && b.effects?.meters?.momPressure !== undefined));
    if (ev.call.speaker === 'mom' && !relief) issue(ctx, ['outcomes'], 'mom call needs ≥ 1 choice lowering momPressure (L03-08)');
  } else if (ev.type === 'call') issue(ctx, ['type'], 'type:"call" requires a call block');

  if (ev.type === 'document' && !ev.document) issue(ctx, ['document'], 'type:"document" requires a document block');
  if (ev.document && !ev.document.letterhead.tr.includes('(kurgusal)')) issue(ctx, ['document', 'letterhead', 'tr'], 'letterhead must carry "(kurgusal)" (03 §5.1)');
  if (ev.document && !ev.document.letterhead.en.includes('(fictional)')) issue(ctx, ['document', 'letterhead', 'en'], 'letterhead must carry "(fictional)" (03 §5.1)');

  if (ev.minigame) {
    if (ev.type !== 'minigame') issue(ctx, ['minigame'], 'minigame block requires type:"minigame"');
    const ch = ev.choices.find((c) => c.id === ev.minigame!.check);
    if (!ch?.check?.skill) issue(ctx, ['minigame', 'check'], 'minigame.check must name a choice with check.skill:true');
  }

  if (ev.type === 'report_card' && ev.id !== 'sys_report_card') issue(ctx, ['type'], 'report_card is reserved for sys_report_card');

  if (ev.wager?.eligible) {
    const target = ev.wager.check ? ev.choices.find((c) => c.id === ev.wager!.check) : ev.choices.find((c) => c.check && !c.check.skill);
    if (!target?.check || target.check.skill) issue(ctx, ['wager'], 'wager.eligible requires a check-based, non-skill choice (L03-04)');
    if (ev.type === 'document' || ev.type === 'call' || ev.type === 'minigame') issue(ctx, ['wager'], 'no wagers on document/call/minigame days (D-ÖNERİ-03-05)');
  }

  if (ev.valence <= -1) {
    const hope = ev.choices.some((c) => branches(ev.outcomes[c.id]!).some((b) => (b.effects?.stats?.joy ?? 0) >= 0 && (b.effects?.stats?.joy !== undefined || b.effects?.diagnosis || b.effects?.glossary)));
    if (!hope) issue(ctx, ['outcomes'], 'negative events need a hope door: a choice with joy ≥ 0 or diagnosis/glossary (L03-12)');
  }

  if ((ev.universality === 'localizedShell' || ev.universality === 'localeOnly') && !ev.review.cultureNote)
    issue(ctx, ['review', 'cultureNote'], 'cultureNote is mandatory for localizedShell/localeOnly (03 §2.2.8)');

  if (ev.pre.age?.min !== undefined && ev.pre.age.min < 18) issue(ctx, ['pre', 'age'], 'characters are ≥ 18 (T9 c-8)');
}

export const GameEvent = GameEventBase.superRefine(refineEvent);
