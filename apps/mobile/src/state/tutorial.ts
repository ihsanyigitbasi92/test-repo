/**
 * Tutorial / first-time help (docs/design/18-egitim-ve-ilk-kullanim.md) — pure logic + a small store with injected
 * storage, so it is unit-tested in node (no React Native imports here).
 *
 * Two parts:
 *  1. The intro ("Nasıl oynanır" / "How it works"): a few skippable pages after the splash and the age gate, before
 *     the first Client File. Shown once per install; replayable from Settings at any time.
 *  2. Coach-mark hints during the FIRST life: one highlighted UI piece + one line each, shown once, dismissed by a
 *     tap. While the intro or a hint is up the game clock is held (`holdsClock`).
 *
 * Stored under its own key (`TUTORIAL_KEY`), never inside the game save: a dropped save (content changed) must not
 * replay the tutorial, and a reset tutorial must not touch the life. Players who already have a save from before
 * this feature (a life in progress or a finished one) are treated as "already know the game": no intro, no hints —
 * they get the Settings entry.
 */

export const TUTORIAL_KEY = 'motto.tutorial.v1';

/** Hint ids in priority order (when two are due at once the earlier one wins; the other waits for a later beat). */
export const HINT_IDS = ['report', 'choices', 'stats', 'speed', 'meters'] as const;
export type HintId = (typeof HINT_IDS)[number];

/** Number of intro pages (TutorialIntro renders exactly this many; i18n `tutorial.pages` must match). */
export const INTRO_PAGES = 5;

export interface TutorialRecord {
  v: 1;
  /** The intro was finished or skipped (or the player predates it). */
  introDone: boolean;
  /** How the intro ended the first time: read to the end, skipped, or never shown (existing player). */
  via?: 'done' | 'skip' | 'legacy';
  /** Hints already shown (each is shown once). */
  hints: HintId[];
  /** Settings → "Reset hints": hints may show again even outside the first life, until all were seen again. */
  replayHints?: boolean;
}

export const emptyRecord = (): TutorialRecord => ({ v: 1, introDone: false, hints: [] });

const isHint = (x: unknown): x is HintId => typeof x === 'string' && (HINT_IDS as readonly string[]).includes(x);

export function decodeTutorial(raw: string | null | undefined): TutorialRecord | null {
  if (!raw) return null;
  try {
    const x = JSON.parse(raw) as Partial<TutorialRecord> | null;
    if (!x || typeof x !== 'object' || x.v !== 1 || typeof x.introDone !== 'boolean') return null;
    const hints = Array.isArray(x.hints) ? [...new Set(x.hints.filter(isHint))] : [];
    const via = x.via === 'done' || x.via === 'skip' || x.via === 'legacy' ? x.via : undefined;
    return { v: 1, introDone: x.introDone, hints, ...(via ? { via } : {}), ...(x.replayHints ? { replayHints: true } : {}) };
  } catch { return null; }
}

/**
 * Raw game save (save.ts SAVE_KEY) → did this install already play? True when a life is in progress or at least one
 * life was finished. A save with no life and no finished life (the Client File was only looked at) is a new player.
 * Deliberately lighter than `decodeSave`: a save dropped for an engine / content change still proves the player
 * knows the game.
 */
export function isExistingPlayer(rawSave: string | null | undefined): boolean {
  if (!rawSave) return false;
  try {
    const x = JSON.parse(rawSave) as { life?: unknown; meta?: { legacy?: { livesCompleted?: unknown } } } | null;
    if (!x || typeof x !== 'object') return false;
    const done = x.meta?.legacy?.livesCompleted;
    return (x.life !== null && typeof x.life === 'object') || (typeof done === 'number' && done > 0);
  } catch { return false; }
}

// ── hint triggers ────────────────────────────────────────────────────────────

/** What the life screen looks like right now, reduced to what the hint triggers need. */
export interface HintCtx {
  /** First life (or hints were reset), a life is on screen, nothing else is over it, Auto is off, no beat playing. */
  open: boolean;
  /** Engine phase of the shown day ('day' = a decision is open, 'birthday' = report card + One More Year). */
  phase: string | null;
  /** Choice buttons are on screen. */
  choicesUp: boolean;
  /** The birthday report card and One More Year are on screen. */
  birthdayUp: boolean;
  /** Engine `counters.shownDays` of the current life. */
  shownDays: number;
  /** The day clock is running (not paused, progress moving). */
  flowing: boolean;
  /** One of the four stat bars has changed this life (a float was shown). */
  statsChanged: boolean;
  /** Money changed this life (a money float, a payday / rent line). */
  moneyChanged: boolean;
  /** Increases every time a beat sequence finishes (busy → ready). */
  epoch: number;
  /** `epoch` when the last hint was dismissed (-1: none yet). A new hint needs a newer epoch: never two in a row. */
  lastHintEpoch: number;
}

/** Shown days before the money / counters hint may come (and the day it comes even without a money change). */
export const METERS_MIN_DAY = 3;
export const METERS_FALLBACK_DAY = 6;
/** Shown day from which the speed hint may come (the first day is busy enough). */
export const SPEED_MIN_DAY = 2;

function due(id: HintId, c: HintCtx): boolean {
  switch (id) {
    case 'report': return c.phase === 'birthday' && c.birthdayUp;
    case 'choices': return c.phase === 'day' && c.choicesUp;
    case 'stats': return c.statsChanged && c.phase !== 'day' && c.phase !== 'birthday';
    case 'speed': return c.flowing && c.shownDays >= SPEED_MIN_DAY;
    case 'meters': return c.phase !== 'day' && c.phase !== 'birthday' && ((c.moneyChanged && c.shownDays >= METERS_MIN_DAY) || c.shownDays >= METERS_FALLBACK_DAY);
  }
}

/** The hint to show now, or null. Pure: the caller marks it seen. */
export function nextHint(c: HintCtx, seen: readonly HintId[]): HintId | null {
  if (!c.open || c.epoch <= c.lastHintEpoch) return null;
  for (const id of HINT_IDS) if (!seen.includes(id) && due(id, c)) return id;
  return null;
}

// ── store ────────────────────────────────────────────────────────────────────

export interface TutorialState {
  loaded: boolean;
  introDone: boolean;
  /** The intro is on screen (first run or a replay from Settings). */
  introOpen: boolean;
  /** The intro was opened from Settings (its last button says "back to the game"). */
  replay: boolean;
  hints: readonly HintId[];
  replayHints: boolean;
  /** Hint currently on screen. */
  active: HintId | null;
}

export interface TutorialDeps {
  kv: { read(key: string): Promise<string | null>; write(key: string, value: string): Promise<unknown> };
  /** Key of the game save, read once to recognise players from before the tutorial existed. */
  saveKey: string;
  /** Hook for analytics (optional): intro shown / finished / skipped, hint shown. */
  onEvent?: (e: { kind: 'intro_open' | 'intro_done' | 'intro_skip' | 'hint'; replay?: boolean; page?: number; hint?: HintId }) => void;
}

export class TutorialStore {
  private st: TutorialState = { loaded: false, introDone: false, introOpen: false, replay: false, hints: [], replayHints: false, active: null };
  private via: TutorialRecord['via'];
  private loading: Promise<void> | null = null;
  private listeners = new Set<() => void>();
  constructor(private readonly d: TutorialDeps) {}

  subscribe = (l: () => void): (() => void) => { this.listeners.add(l); return () => { this.listeners.delete(l); }; };
  getState = (): TutorialState => this.st;
  private set(p: Partial<TutorialState>): void {
    this.st = { ...this.st, ...p };
    for (const l of this.listeners) l();
  }
  private record(): TutorialRecord {
    return { v: 1, introDone: this.st.introDone, hints: [...this.st.hints], ...(this.via ? { via: this.via } : {}), ...(this.st.replayHints ? { replayHints: true } : {}) };
  }
  private save(): void {
    void Promise.resolve().then(() => this.d.kv.write(TUTORIAL_KEY, JSON.stringify(this.record()))).catch(() => undefined);
  }

  /** Reads the record; a missing one is created from the game save (existing player → done). Never rejects. */
  load(): Promise<void> {
    this.loading ??= (async () => {
      let r: TutorialRecord | null = null;
      try { r = decodeTutorial(await this.d.kv.read(TUTORIAL_KEY)); } catch { r = null; }
      let migrated = false;
      if (!r) {
        let raw: string | null = null;
        try { raw = await this.d.kv.read(this.d.saveKey); } catch { raw = null; }
        if (isExistingPlayer(raw)) { r = { v: 1, introDone: true, via: 'legacy', hints: [...HINT_IDS] }; migrated = true; }
        else r = emptyRecord();
      }
      this.via = r.via;
      this.set({ loaded: true, introDone: r.introDone, hints: r.hints, replayHints: !!r.replayHints, introOpen: !r.introDone, replay: false });
      if (migrated) this.save();
      if (!r.introDone) this.d.onEvent?.({ kind: 'intro_open', replay: false });
    })();
    return this.loading;
  }

  /** Intro must be on screen now (first run, not finished yet). */
  needsIntro(): boolean { return this.st.loaded && !this.st.introDone; }

  /** Settings → How to play. */
  openIntro(): void {
    if (!this.st.loaded || this.st.introOpen) return;
    this.set({ introOpen: true, replay: true, active: null });
    this.d.onEvent?.({ kind: 'intro_open', replay: true });
  }

  /** Last page's button (`done`) or Skip (`skip`, with the page it was pressed on, 0-based). */
  closeIntro(how: 'done' | 'skip', page = INTRO_PAGES - 1): void {
    if (!this.st.introOpen) return;
    const first = !this.st.introDone;
    if (first) this.via = how;
    this.set({ introOpen: false, replay: false, introDone: true });
    this.d.onEvent?.({ kind: how === 'done' ? 'intro_done' : 'intro_skip', replay: !first, page });
    if (first) this.save();
  }

  /** Hints may show in this life: the first life, or after "Reset hints". */
  hintsAllowed(firstLife: boolean): boolean { return firstLife || this.st.replayHints; }

  /** Puts a hint on screen and marks it seen at once (a kill while it is up must not show it twice). */
  showHint(id: HintId): boolean {
    if (this.st.active || this.st.introOpen || this.st.hints.includes(id)) return false;
    const hints = [...this.st.hints, id];
    const replayHints = this.st.replayHints && hints.length < HINT_IDS.length;
    this.set({ active: id, hints, replayHints });
    this.d.onEvent?.({ kind: 'hint', hint: id });
    this.save();
    return true;
  }

  dismissHint(): void { if (this.st.active) this.set({ active: null }); }

  /** Settings → Reset hints: every hint can show once more (also outside the first life). */
  resetHints(): void {
    this.set({ hints: [], replayHints: true, active: null });
    this.save();
  }

  /** The game clock must stand still: the intro or a hint is on screen. */
  holdsClock(): boolean { return this.st.introOpen || this.st.active !== null; }
}

// ── clock gate ───────────────────────────────────────────────────────────────

/** Everything that can stop the D-066 day clock, as read by `GameController.tick` (pure, tested). */
export interface ClockGate {
  stage: 'file' | 'play' | 'death';
  busy: boolean;
  hasLife: boolean;
  /** Engine phase allows the clock to run (idle / answered). */
  flowPhase: boolean;
  speed: 'pause' | 'play' | 'fast';
  covered: boolean;
  /** Overlays that stop time: age-up, avatar moment, rewarded offer, ad break, Enough-for-today sheet. */
  overlay: boolean;
  /** Holds from outside the game (the tutorial intro / a hint, the shop). */
  held: boolean;
}

export const clockMayRun = (g: ClockGate): boolean =>
  g.stage === 'play' && g.hasLife && !g.busy && g.flowPhase && g.speed !== 'pause' && !g.covered && !g.overlay && !g.held;
