/**
 * Sound vocabulary + the event → sound mapping (docs/design/16-ses-efektleri.md). Pure data and pure functions:
 * no audio, no React Native — the manager (soundCore.ts) plays what this file names, and vitest covers it.
 * The files themselves are synthesized by scripts/gen-sfx.mjs (no third-party audio).
 */
import type { Effect } from '@motto/engine';
import type { MomentKind } from '../avatar/moments';
import type { CardVariant, StampResult } from './feed';

/**
 * `variants`: files `<name>_1..n.wav` (slight pitch variants, never the same one twice in a row).
 * `gain`: 0..1 mix level (files are all peak-normalized; this is where "soft" is decided).
 * `gapMs`: the same sound cannot restart sooner than this (many stat ticks in one frame → one).
 * `pri`: 0 ambient (first to go: global budget, ▶▶ auto) · 1 feedback · 2 moments (always heard).
 */
export interface SfxSpec { variants: number; gain: number; gapMs: number; pri: 0 | 1 | 2 }

export const SFX = {
  ui_tap: { variants: 3, gain: 0.45, gapMs: 50, pri: 1 },
  card_slide: { variants: 3, gain: 0.4, gapMs: 150, pri: 0 },
  choice_confirm: { variants: 1, gain: 0.45, gapMs: 120, pri: 1 },
  swipe_left: { variants: 1, gain: 0.45, gapMs: 120, pri: 1 },
  swipe_right: { variants: 1, gain: 0.45, gapMs: 120, pri: 1 },
  stamp_thud: { variants: 1, gain: 1, gapMs: 250, pri: 2 },
  stamp_heavy: { variants: 1, gain: 1, gapMs: 250, pri: 2 },
  stamp_small: { variants: 1, gain: 0.7, gapMs: 200, pri: 1 },
  money_gain: { variants: 2, gain: 0.5, gapMs: 200, pri: 1 },
  money_loss: { variants: 1, gain: 0.45, gapMs: 200, pri: 1 },
  stat_up: { variants: 2, gain: 0.3, gapMs: 150, pri: 0 },
  stat_down: { variants: 2, gain: 0.3, gapMs: 150, pri: 0 },
  // Income / rent lines show on most days (the calendar skips weeks): softer, and at most one each per 20 s —
  // the feed line always shows, the register only now and then.
  payday: { variants: 1, gain: 0.42, gapMs: 20000, pri: 1 },
  bill: { variants: 1, gain: 0.4, gapMs: 20000, pri: 1 },
  phone_ring: { variants: 1, gain: 0.5, gapMs: 1500, pri: 2 },
  page_turn: { variants: 1, gain: 0.5, gapMs: 250, pri: 1 },
  birthday: { variants: 1, gain: 0.55, gapMs: 1000, pri: 2 },
  report_reveal: { variants: 1, gain: 0.7, gapMs: 500, pri: 2 },
  surprise_good: { variants: 1, gain: 0.5, gapMs: 800, pri: 2 },
  bad_news: { variants: 1, gain: 0.9, gapMs: 600, pri: 2 },
  milestone: { variants: 1, gain: 0.65, gapMs: 1500, pri: 2 },
  legendary: { variants: 1, gain: 0.65, gapMs: 3000, pri: 2 },
  omen: { variants: 1, gain: 0.55, gapMs: 2000, pri: 2 },
  death: { variants: 1, gain: 0.75, gapMs: 3000, pri: 2 },
  grief: { variants: 1, gain: 0.3, gapMs: 2000, pri: 2 },
  purchase_success: { variants: 1, gain: 0.65, gapMs: 800, pri: 2 },
  error_locked: { variants: 1, gain: 0.55, gapMs: 250, pri: 1 },
  day_advance: { variants: 3, gain: 0.16, gapMs: 350, pri: 0 },
  wager_pin: { variants: 1, gain: 0.7, gapMs: 300, pri: 1 },
  paper_rustle: { variants: 1, gain: 0.45, gapMs: 300, pri: 0 },
  bubble: { variants: 2, gain: 0.28, gapMs: 120, pri: 0 },
} as const satisfies Record<string, SfxSpec>;

export type SfxName = keyof typeof SFX;
export const SFX_NAMES = Object.keys(SFX) as SfxName[];

/** Asset keys of a sound (= file names without `.wav`), as written by gen-sfx.mjs. */
export function sfxFiles(name: SfxName): string[] {
  const v = SFX[name].variants;
  return v > 1 ? Array.from({ length: v }, (_, i) => `${name}_${i + 1}`) : [name];
}

/** Played right at launch / on every screen: decoded first (the rest follows in the background). */
export const SFX_CORE: readonly SfxName[] = ['ui_tap', 'stamp_thud', 'card_slide', 'choice_confirm', 'day_advance', 'bubble', 'stat_up', 'stat_down', 'money_gain', 'money_loss'];

// ── game events → sounds ────────────────────────────────────────────────────
/** Loss / farewell content: the scene plays in near-silence — one soft tone when the card arrives, nothing else. */
const GRIEF_TAGS = new Set(['veda_kayip', 'kayip', 'cenaze', 'cenaze_taziye', 'taziye']);
export const isGrief = (tags: readonly string[]): boolean => tags.some((t) => GRIEF_TAGS.has(t) || t.startsWith('loss:'));
export const isOmen = (tags: readonly string[]): boolean => tags.includes('omen');
/** D-157 life milestones (partner, proposal, wedding, baby, birth) and graduations. */
export const isMilestone = (tags: readonly string[]): boolean => tags.some((t) => t.startsWith('milestone:') || t === 'mezuniyet');

export interface CardCue { variant: CardVariant; tags: readonly string[]; valence: number; surpriseTier: 'nice' | 'great' | null }

/** The one sound a day card arrives with (most specific wins). */
export function sfxForCard(c: CardCue): SfxName {
  if (isGrief(c.tags)) return 'grief';
  if (isOmen(c.tags)) return 'omen';
  if (c.variant === 'call') return 'phone_ring';
  if (c.variant === 'legend') return 'legendary';
  if (c.surpriseTier || c.variant === 'surprise') return 'surprise_good';
  if (c.valence <= -2) return 'bad_news';
  if (c.variant === 'doc') return 'paper_rustle';
  return 'card_slide';
}

/** D-088 flow lines of a new day: income rings the register, rent tears a slip; the folded daily costs stay silent. */
export function sfxForFlow(lines: readonly { kind: string; para: number }[]): SfxName[] {
  const out: SfxName[] = [];
  if (lines.some((l) => (l.kind === 'payday' || l.kind === 'allowance') && l.para > 0)) out.push('payday');
  if (lines.some((l) => l.kind === 'rent')) out.push('bill');
  return out;
}

/** Stats where "up" is bad (same rule as the avatar's face, moments.ts). */
const INVERTED = new Set(['momPressure', 'cringe']);

/**
 * Outcome deltas → at most two sounds: money first (coin / loss), then ONE tick for the net direction of the
 * stats — never one tick per stat. A milestone that went well gets the fanfare instead of the tick.
 */
export function sfxForOutcome(deltas: readonly { stat: string; delta: number }[], o: { milestone?: boolean } = {}): SfxName[] {
  const out: SfxName[] = [];
  let money = 0, score = 0;
  for (const d of deltas) {
    if (!d.delta || d.stat === 'ego') continue;
    if (d.stat === 'money') { money += d.delta; continue; }
    score += (INVERTED.has(d.stat) ? d.delta < 0 : d.delta > 0) ? 1 : -1;
  }
  if (money > 0) out.push('money_gain'); else if (money < 0) out.push('money_loss');
  if (o.milestone && score + Math.sign(money) > 0) out.push('milestone');
  else if (score > 0) out.push('stat_up'); else if (score < 0) out.push('stat_down');
  return out;
}

export const sfxForStamp = (result: StampResult): SfxName => (result === 'iWasWrong' ? 'stamp_heavy' : 'stamp_thud');
export const sfxForChoice = (swipe?: 'left' | 'right'): SfxName => (swipe === 'left' ? 'swipe_left' : swipe === 'right' ? 'swipe_right' : 'choice_confirm');

/** Full-screen avatar moments. `wagerWin` is voiced by its stamp (stamp_heavy), not twice. */
export const MOMENT_SFX: Readonly<Record<MomentKind, SfxName | null>> = {
  birthday: 'birthday', promotion: 'milestone', sad: 'bad_news', legendary: 'legendary', wagerWin: null, death: 'death',
};

/** UI moments outside the engine's effects. */
export const UI_SFX = {
  tap: 'ui_tap', startLife: 'page_turn', oneMoreYear: 'page_turn', newClient: 'page_turn', endSession: 'paper_rustle',
  splashStamp: 'stamp_thud', translate: 'stamp_small', reportFiled: 'stamp_small', roastSheet: 'paper_rustle', purchase: 'purchase_success',
} as const satisfies Record<string, SfxName>;

/**
 * Every engine effect kind → the sounds it can produce (the doc's mapping table; exhaustive by type, and the test
 * suite checks it against the kinds the engine really emits). An empty list is a decision, not an omission:
 * FLOAT_NUM is voiced once through its outcome line, SESSION_END_SUGGESTED is a quiet hint.
 */
export const EFFECT_SFX: Readonly<Record<Effect['kind'], readonly SfxName[]>> = {
  SHOW_DAY: ['day_advance', 'payday', 'bill', 'card_slide', 'paper_rustle', 'phone_ring', 'legendary', 'surprise_good', 'bad_news', 'omen', 'grief', 'wager_pin'],
  SHOW_DIALOG: ['bubble', 'choice_confirm', 'swipe_left', 'swipe_right', 'money_gain', 'money_loss', 'stat_up', 'stat_down', 'milestone'],
  STAMP: ['stamp_thud', 'stamp_heavy'],
  FLOAT_NUM: [],
  REPORT_CARD: ['birthday', 'report_reveal', 'stamp_small'],
  DEATH: ['death'],
  NOTIFY_PLAN: ['paper_rustle'],
  HAPTIC: ['error_locked'],
  SESSION_END_SUGGESTED: [],
};
