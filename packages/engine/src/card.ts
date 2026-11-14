/**
 * Day-card view model (10 §3.3): narration + dialog bubbles, choices, wager offer; and the text parameters
 * the UI substitutes into `{…}` placeholders.
 * Variant selection (03 §2.2.7, Yarn RBLRV): `text[]` and `dialog[].alt[]` use the least-seen eligible variant,
 * counted in `seen['txt.<id>.<variant>']`; ties are broken on the `cosmetic` channel (no gameplay stream moves).
 */
import { evalPre } from './pre';
import { keyChoice, keyDialog, keyText } from './content';
import { screenWager } from './wager';
import { drawInt } from './util';
import type { Bubble, CardChoice, DayCard, GameEvent, LifeState, MetaState } from './types';

const pts = (bp: number): number => Math.floor(bp / 100);

/** Placeholder values (integers in points / Para; `n` is supplied by the caller where it means a counter). */
export function textParams(st: LifeState, n?: number): Record<string, number | string> {
  const p: Record<string, number | string> = {
    name: st.name, ego: pts(st.meters.ego), cringe: pts(st.meters.cringe), momPressure: pts(st.meters.momPressure), money: st.money.balance,
  };
  if (n !== undefined) p.n = n;
  return p;
}

const hasPlaceholder = (...s: (string | undefined)[]): boolean => s.some((x) => x !== undefined && x.includes('{'));

/** Least-seen index among `keys` (seen counters), ties on `cosmetic`; bumps the winner's counter. */
function leastSeen(st: LifeState, keys: string[]): number {
  const counts = keys.map((k) => st.seen[k] ?? 0);
  const min = Math.min(...counts);
  const ties = counts.map((c, i) => (c === min ? i : -1)).filter((i) => i >= 0);
  const i = ties.length === 1 ? ties[0]! : ties[drawInt(st, 'cosmetic', 0, ties.length - 1)]!;
  st.seen[keys[i]!] = min + 1;
  return i;
}

function narration(st: LifeState, meta: MetaState, ev: GameEvent): Bubble | null {
  const variants = (ev.text ?? []).filter((t) => !t.when || evalPre(t.when, st, meta, ev.id));
  if (!variants.length) return null;
  const v = variants[leastSeen(st, variants.map((t) => `txt.${ev.id}.${t.id}`))]!;
  const b: Bubble = { speaker: 'narrator', textKey: keyText(ev, v.id), delayMs: 0 };
  if (hasPlaceholder(v.tr, v.en)) b.params = textParams(st);
  return b;
}

function dialogBubbles(st: LifeState, meta: MetaState, ev: GameEvent): Bubble[] {
  const out: Bubble[] = [];
  (ev.dialog ?? []).forEach((d, i) => {
    if (d.when && !evalPre(d.when, st, meta, ev.id)) return;
    let key = keyDialog(ev, i), texts = [d.tr, d.en];
    if (d.alt?.length) {
      const k = leastSeen(st, [`txt.${ev.id}.d${i}`, ...d.alt.map((_, j) => `txt.${ev.id}.d${i}.${j}`)]);
      if (k > 0) { key = keyDialog(ev, i, k - 1); texts = [d.alt[k - 1]!.tr, d.alt[k - 1]!.en]; }
    }
    const b: Bubble = { speaker: d.speaker, textKey: key, avatar: d.avatar, delayMs: d.delayMs ?? 0 };
    if (hasPlaceholder(...texts)) b.params = textParams(st);
    out.push(b);
  });
  return out;
}

export function buildEventCard(st: LifeState, meta: MetaState, ev: GameEvent, base: Omit<DayCard, 'eventId'>): DayCard {
  const bubbles: Bubble[] = [];
  const nar = narration(st, meta, ev);
  if (nar) bubbles.push(nar);
  bubbles.push(...dialogBubbles(st, meta, ev));
  let choices: CardChoice[] = ev.choices.map((c) => ({
    id: c.id, textKey: keyChoice(ev, c.id), locked: c.requires ? !evalPre(c.requires, st, meta, ev.id) : false, pattern: c.pattern, swipe: c.swipe,
  }));
  if (choices.every((c) => c.locked)) choices = choices.map((c) => ({ ...c, locked: false }));
  const wager = screenWager(ev, st);
  return { ...base, eventId: ev.id, bubbles, choices, wager: wager && !choices.find((c) => c.id === wager.choiceId)?.locked ? wager : null };
}
