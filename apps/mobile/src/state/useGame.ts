/**
 * useGame — the only bridge between React and @motto/engine (10 §2.3: the UI consumes `step()` effects/state).
 *
 * - Every rule lives in the engine: this file only dispatches actions (START_LIFE, NEXT_DAY, ANSWER, SET_SPEED,
 *   SESSION_END, RESUME) and replays the returned effects as timed "beats" into the feed (D-088 effect order).
 * - D-066 self-flowing clock: a setInterval fills the day's progress bar and dispatches NEXT_DAY when the day ends,
 *   unless a decision is pending (phase `day`), the birthday report waits for "One More Year", a beat is still
 *   playing, an overlay is up, or the speed is ⏸ (manual: the Next Day button appears instead).
 * - D-067: the HUD shows the engine's persistent life state (job, home, partner, cat) as synced at each beat.
 * - "Auto" (D-066/D-092): the UI picks a random open choice with `via: 'auto'`; outcomes are still the engine's dice.
 * - Avatar: the player's look is UI state (the engine has no look field and its rules stay untouched); it is chosen
 *   on the Client File and kept per life, keyed by `lifeSeed`. The face mood and the full-screen "avatar moments"
 *   (birthday aging, new job, breakup, legendary, I WAS WRONG, death) are read from effects + state transitions,
 *   ≤ 1 per 8 shown days, never over a pending choice except as the intro of a legendary day.
 * - Save / continue (save.ts): written whenever the beat queue drains (feed and engine state agree there), on
 *   death, on app background and on "Close"; at launch a valid save resumes the life once its content is loaded.
 */
import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { AppState, BackHandler, Platform } from 'react-native';
import type { NativeEventSubscription } from 'react-native';
import { buildRoast, emptyMeta, step } from '@motto/engine';
import type { Action, Effect, LifeState, Locale, MetaState, ReportCardData, RoastReport, Speed, StepResult } from '@motto/engine';
import { START_AGE, advanceContent, contentReadyFor, eventById, getBundle, prepareContent } from '../content/bundle';
import { CATALOG, mottoLine } from '../i18n';
import { haptic } from './haptics';
import { sfx } from './sound';
import { MOMENT_SFX, SFX, UI_SFX, isGrief, isMilestone, sfxForCard, sfxForChoice, sfxForFlow, sfxForOutcome, sfxForStamp } from './sfx';
import type { SfxName } from './sfx';
import { HEALTH_DANGER } from '../components/hudConst';
import type { CardVariant, Delta, FeedItem, StampResult } from './feed';
import { cyclePart, generateLook, outfitFor } from '../avatar/look';
import type { Look, LookPart, Mood as FaceMood } from '../avatar/look';
import { emptyMomentHistory, lifeChange, momentCandidates, outcomeMood, pickMoment, recordMoment } from '../avatar/moments';
import type { MomentHistory, MomentKind, MomentReason, MomentView } from '../avatar/moments';
import { SAVE_KEY, decodeSave, encodeSave, engineShape, feedForSave, saveMatchesContent } from './save';
import type { SaveV1 } from './save';
import { readItem, writeItem } from './storage';
import { ads, registerAdDebug } from '../ads/runtime';
import { AD_CONFIG } from '../ads/config';
import { adGameContext, grantMoney, isGriefScene } from '../ads/gameContext';
import type { Offer } from '../ads/adService';

export type Mood = 'neutral' | 'smirk' | 'shock' | 'sad';
export type Stage = 'file' | 'play' | 'death';

export interface FloatItem { id: number; stat: Delta['stat']; delta: number }
export interface DeathView {
  roast: RoastReport; name: string; birthYear: number; deathYear: number; epitaph: string | null; autoDays: number;
  /** Last birthday report card of this life (share card). */
  report: ReportCardData | null;
  /** The player's face for the tombstone and the share card (desaturated there); null if the life had no look. */
  look: Look | null;
  outfit: ReturnType<typeof outfitFor>;
}
export interface Snapshot {
  stage: Stage;
  locale: Locale;
  speed: Speed;
  auto: boolean;
  fastLife: boolean;
  /** Engine state as last shown to the player (synced at beats, so the HUD moves with the feed). */
  view: LifeState | null;
  lifeNo: number;
  feed: FeedItem[];
  floats: FloatItem[];
  /** A beat sequence is still playing (choices / CTAs stay hidden). */
  busy: boolean;
  /** 0..1 of the current day's flow (D-066 DayProgress). */
  progress: number;
  candidate: { name: string; city: string; i: number };
  mood: Mood;
  bigStamp: { id: number; result: StampResult } | null;
  shake: { key: number; hard: boolean };
  flash: { key: number; color: 'red' | 'lime' | 'gold' } | null;
  ageUp: { from: number; to: number } | null;
  death: DeathView | null;
  /** "Enough for today" sheet; `closed`: the player chose Close — saved, nothing runs until Continue. */
  session: { years: number; days: number; closed?: boolean } | null;
  suggestEnd: boolean;
  /** Launch: the save is being read / its content loaded (no Client File, no clock yet). */
  booting: boolean;
  unread: number;
  /** Ms a coach line takes to type per character at the current speed (0 = instant). */
  typeMs: number;
  /** Client File: the look being edited, the part changed last (null = whole shuffle) and a roast salt. */
  draftLook: Look;
  lookChanged: LookPart | null;
  lookNonce: number;
  /** Look of the current life (kept per life id). */
  look: Look | null;
  /** Player face in the HUD: reacts to the last outcome / wager. */
  playerMood: FaceMood;
  /** Full-screen avatar moment ("arada bir efektli an"). Time stops while it is up; tap skips. */
  moment: MomentView | null;
  /** Ad layer: a rewarded offer waiting for the player's answer (time stops, as for a choice). */
  offer: Offer | null;
  /** Ad layer: a full-screen ad / consent view is up, or the return slot is being decided (clock and beats wait). */
  adBreak: boolean;
}

/** `hold`: after `run`, the beat queue waits until the moment it opened is dismissed (timer or tap). */
interface Beat { wait: number; run: () => void; hold?: boolean }
interface Timing { reportHold: number; typing: number; line: number; bubble: number; outcome: number; stamp: number; coach: number; resume: number; dayFlow: number; autoPick: number; report: number; ageUp: number; typeMs: number; delayScale: number; bigStamp: number; moment: number }

const TICK = 100;
/** Saves are coalesced: at most one write per this many ms (the last state always lands, trailing). */
const SAVE_GAP_MS = 1500;
const MAX_FEED = 90;
/** HUD cells that show a floating number (ego etc. only appear inline in the outcome line). */
const FLOAT_STATS = new Set<string>(['health', 'joy', 'brain', 'charm', 'money', 'momPressure', 'cringe']);
/** Unread counter: +1..3 per shown day depending on the skipped gap (pressure feedback, not a raw day count). */
const unreadGain = (gap: number) => Math.min(3, 1 + Math.floor(gap / 10));
/** ▶ 1 day ≈ 6 s all-in, ▶▶ ≈ 2 s (D-066); auto + ▶▶ runs a whole life in a few minutes. */
const PLAY: Timing = { reportHold: 900, typing: 380, line: 260, bubble: 420, outcome: 380, stamp: 420, coach: 520, resume: 600, dayFlow: 2600, autoPick: 1500, report: 3200, ageUp: 1100, typeMs: 14, delayScale: 1, bigStamp: 1700, moment: 2600 };
const FAST: Timing = { reportHold: 1100, typing: 140, line: 90, bubble: 150, outcome: 160, stamp: 260, coach: 220, resume: 250, dayFlow: 900, autoPick: 450, report: 1200, ageUp: 700, typeMs: 4, delayScale: 0.3, bigStamp: 1100, moment: 1800 };
const TURBO: Timing = { reportHold: 1300, typing: 0, line: 20, bubble: 35, outcome: 40, stamp: 120, coach: 50, resume: 60, dayFlow: 140, autoPick: 120, report: 2800, ageUp: 380, typeMs: 0, delayScale: 0, bigStamp: 650, moment: 1100 };

const PHASES_FLOW = new Set(['idle', 'answered']);
const FAMILY_TAGS = ['aile', 'anne', 'telefon'];
const pad2 = (x: number) => (x < 10 ? `0${x}` : String(x));
const localDay = () => { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
const randomSeed = () => `L-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;

function cardVariant(c: Extract<Effect, { kind: 'SHOW_DAY' }>['card']): CardVariant {
  if (c.momCall) return 'call';
  if (c.legendary) return 'legend';
  if (eventById(c.eventId)?.type === 'document') return 'doc';
  if (c.surpriseTier) return 'surprise';
  if (c.daily) return 'daily';
  return 'event';
}

function mottoKey(d: Extract<Effect, { kind: 'REPORT_CARD' }>['data']): string {
  if (d.mottoCell.dominant) return d.mottoCell.dominant;
  return d.mottoCell.netValence > 0 ? 'good' : d.mottoCell.netValence < 0 ? 'bad' : 'none';
}

export class GameController {
  private snap: Snapshot;
  private listeners = new Set<() => void>();
  private state: LifeState | null = null;
  private meta: MetaState = emptyMeta();
  private queue: Beat[] = [];
  private beatTimer: ReturnType<typeof setTimeout> | null = null;
  private tickTimer: ReturnType<typeof setInterval> | null = null;
  private autoTimer: ReturnType<typeof setTimeout> | null = null;
  private timers = new Set<ReturnType<typeof setTimeout>>();
  private seq = 1;
  private started = false;
  /** D-156: START_LIFE waits once for core + the first age band (web fetch); a failed load falls back to base content. */
  private waitingContent = false;
  private contentTried = false;
  private autoDays = 0;
  private lowJoyShown = false;
  /** One coach warning per life when health enters the HUD danger zone (UX playtest #6). */
  private healthWarned = false;
  private unreadInfoAt = 0;
  private lastMotto: string | null = null;
  private lastReport: ReportCardData | null = null;
  /** The beat queue is paused on a `hold` beat until the moment closes. */
  private held = false;
  /** Shown avatar moments this life (global gap + per-kind cooldowns, see moments.ts). */
  private momentHist: MomentHistory = emptyMomentHistory();
  /** A career / love change seen while a choice was pending: played after the answer. */
  private deferred: { kind: 'promotion' | 'sad'; reason: MomentReason; outfitFrom: ReturnType<typeof outfitFor> } | null = null;
  /** Look per life (engine `lifeSeed` → look). In-memory, like the rest of the session. */
  private looks = new Map<string, Look>();
  /** Splash / cover is up: the clock and auto wait (LifeScreen calls `uncover`). */
  private covered = true;
  private pendingSave: SaveV1 | null = null;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private lastSaveAt = 0;
  private appStateSub: NativeEventSubscription | null = null;
  private onPageHide: (() => void) | null = null;
  /** A loss / farewell card is on: the scene plays in near-silence (one soft tone, then nothing until the next day). */
  private hushed = false;

  /**
   * Sound at the same semantic moments as the haptics (16-ses-efektleri). Silent while beats are drained for a
   * background save, in grief scenes, and — for everything but the big moments — at ▶▶ auto, where days fly by.
   */
  private sfx(name: SfxName, delay = 0): void {
    if (this.draining || (this.hushed && name !== 'grief' && name !== 'death')) return;
    const minPri = this.t() === TURBO ? 2 : 0;
    if (SFX[name].pri < minPri) return;
    if (delay > 0) this.later(delay, () => { if (!this.draining && !this.hushed) sfx(name, { minPri }); });
    else sfx(name, { minPri });
  }

  constructor() {
    const locale: Locale = 'tr';
    this.snap = {
      stage: 'file', locale, speed: 'play', auto: false, fastLife: false, view: null, lifeNo: 1, feed: [], floats: [],
      progress: 0, candidate: this.pickName(locale, -1), mood: 'neutral', bigStamp: null, shake: { key: 0, hard: false }, flash: null,
      ageUp: null, death: null, session: null, suggestEnd: false, booting: true, busy: true, unread: 9, typeMs: PLAY.typeMs,
      draftLook: generateLook(randomSeed()), lookChanged: null, lookNonce: 0, look: null, playerMood: 'neutral', moment: null, offer: null, adBreak: false,
    };
    registerAdDebug('offer', () => this.debugOffer());
    registerAdDebug('returnSlot', (awayHours = 7) => this.enqueue([{ wait: 0, run: () => this.returnSlot(awayHours * 3_600_000), hold: true }]));
  }

  // ── store plumbing ────────────────────────────────────────────────────────
  subscribe = (l: () => void): (() => void) => { this.listeners.add(l); return () => { this.listeners.delete(l); }; };
  getSnapshot = (): Snapshot => this.snap;
  private set(patch: Partial<Snapshot>): void {
    this.snap = { ...this.snap, ...patch };
    for (const l of this.listeners) l();
  }
  private id(): number { return this.seq++; }
  private push(item: FeedItem): void { this.set({ feed: [...this.snap.feed, item].slice(-MAX_FEED) }); }
  private later(ms: number, f: () => void): void {
    const t = setTimeout(() => { this.timers.delete(t); f(); }, ms);
    this.timers.add(t);
  }
  private t(): Timing {
    const s = this.snap;
    return s.speed === 'fast' ? (s.auto ? TURBO : FAST) : PLAY;
  }

  start(): void {
    if (!this.tickTimer) this.tickTimer = setInterval(() => this.tick(), TICK);
    this.watchLifecycle();
    if (this.started) { this.scheduleAuto(); return; }
    this.started = true;
    void this.boot();
  }

  stop(): void {
    if (this.tickTimer) clearInterval(this.tickTimer);
    this.tickTimer = null;
    this.clearAuto();
    this.flushSave();
    this.appStateSub?.remove();
    this.appStateSub = null;
    if (this.onPageHide && typeof window !== 'undefined') window.removeEventListener('pagehide', this.onPageHide);
    this.onPageHide = null;
  }

  /** The splash is gone: the clock (and auto) may run. */
  uncover = (): void => {
    if (!this.covered) return;
    this.covered = false;
    for (const w of this.uncoverWaiters.splice(0)) w();
    this.scheduleAuto();
  };

  // ── save / continue ───────────────────────────────────────────────────────
  /** Launch: resume a valid save (content for its age loaded first), else the Client File. Never throws. */
  private async boot(): Promise<void> {
    let save: SaveV1 | null = null;
    try { save = decodeSave(await readItem(SAVE_KEY)); } catch { save = null; }
    if (save) {
      // Language, prefs and the legacy survive even when the life itself cannot be resumed.
      this.meta = save.meta;
      const locale = save.locale;
      this.set({ locale, fastLife: save.fastLife, speed: save.speed, auto: false, lifeNo: this.meta.legacy.livesCompleted + 1,
        candidate: this.pickName(locale, -1) });
      this.set({ typeMs: this.t().typeMs });
    }
    const life = save?.life ?? null;
    if (save && life) {
      const age = life.state.calendar.age;
      try { await prepareContent(age); } catch { /* resolves anyway; checked below */ }
      if (saveMatchesContent(save, getBundle().contentHash) && contentReadyFor(age)) {
        try { this.resume(save, life); return; } catch (e) { console.warn('[save] resume failed, starting fresh:', e); this.state = null; }
      } else console.warn('[save] content changed since the save; starting a new life');
    }
    this.freshStart();
  }

  private freshStart(): void {
    this.set({ booting: false, stage: 'file', view: null, feed: [] });
    void prepareContent(START_AGE);                                           // packs load while the Client File is up
    this.enqueue([
      { wait: 300, run: () => this.push({ id: this.id(), kind: 'coach', ui: { k: 'intro1' }, roast: true }) },
      { wait: 1400, run: () => this.push({ id: this.id(), kind: 'coach', ui: { k: 'intro2' } }) },
    ]);
  }

  private resume(save: SaveV1, life: NonNullable<SaveV1['life']>): void {
    this.state = life.state;
    const u = life.ui;
    this.autoDays = u.autoDays; this.lowJoyShown = u.lowJoyShown; this.healthWarned = !!u.healthWarned; this.lastMotto = u.lastMotto; this.lastReport = u.lastReport;
    this.momentHist = u.momentHist ?? emptyMomentHistory(); this.deferred = null;
    if (life.look) this.looks.set(life.state.lifeSeed, life.look);
    const feed = life.feed.filter((f) => f.kind !== 'typing').map((f) => ({ ...f, restored: true }));
    this.seq = Math.max(this.seq, ...feed.map((f) => f.id + 1));
    this.dispatch({ type: 'RESUME', localDay: localDay() });                 // new local day → new Günün Günü seed
    if (this.state.speed !== save.speed) this.dispatch({ type: 'SET_SPEED', speed: save.speed });
    advanceContent(this.state.calendar.age);
    this.set({
      booting: false, stage: 'play', view: this.state, lifeNo: life.lifeNo, look: life.look, unread: u.unread, session: u.session,
      auto: save.auto, speed: save.speed, progress: 0, busy: false, moment: null, playerMood: 'neutral', mood: 'neutral', suggestEnd: false,
      feed: [...feed, { id: this.id(), kind: 'coach', ui: { k: 'resumed' } }],
    });
    this.set({ typeMs: this.t().typeMs });
    // Ad layer return slot (D-084): decided before the first input, while the splash still covers the screen.
    this.enqueue([{ wait: 0, run: () => this.returnSlot(Date.now() - save.savedAt), hold: true }]);
    this.scheduleAuto();
  }

  private buildSave(): SaveV1 {
    const s = this.snap, st = this.state;
    const live = s.stage === 'play' && !!st && st.phase !== 'dead' && !st.death;
    return {
      v: 1, savedAt: Date.now(), engine: engineShape(), contentHash: getBundle().contentHash, locale: s.locale, speed: s.speed, auto: s.auto, fastLife: s.fastLife,
      meta: this.meta,
      life: live && st ? {
        state: st, look: this.looks.get(st.lifeSeed) ?? s.look, lifeNo: s.lifeNo, feed: feedForSave(s.feed),
        ui: { autoDays: this.autoDays, lowJoyShown: this.lowJoyShown, healthWarned: this.healthWarned, lastMotto: this.lastMotto, lastReport: this.lastReport, unread: s.unread,
          momentHist: this.momentHist, session: s.session },
      } : null,
    };
  }

  /**
   * Snapshot now (only where feed and engine agree: no beats in flight), write coalesced. Engine states and feed
   * arrays are never mutated after `step()` / `set()`, so holding the references until the write is safe.
   */
  private persist(now = false): void {
    if (this.snap.booting) return;
    if (!this.snap.busy && !this.held) this.pendingSave = this.buildSave();
    if (!this.pendingSave) return;
    if (now) { this.flushSave(); return; }
    if (this.saveTimer) return;
    this.saveTimer = setTimeout(() => this.flushSave(), Math.max(0, this.lastSaveAt + SAVE_GAP_MS - Date.now()));
  }

  /** Writes the current state at once, even mid-beat (only for states without a running life: death, new client). */
  private saveNow(): void {
    if (this.snap.booting) return;
    this.pendingSave = this.buildSave();
    this.flushSave();
  }

  private flushSave(): void {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = null;
    const save = this.pendingSave;
    if (!save) return;
    this.pendingSave = null;
    this.lastSaveAt = Date.now();
    let raw: string;
    try { raw = encodeSave(save); } catch (e) { console.warn('[save] encode failed:', e); return; }
    void writeItem(SAVE_KEY, raw);
  }

  /** App to background / page hidden: write what we have right away (a killed app must not lose the life). */
  private watchLifecycle(): void {
    if (!this.appStateSub) {
      try {
        this.appStateSub = AppState.addEventListener('change', (st) => {
          if (st === 'background' && this.snap.stage === 'play') this.drainBeats();          // the app may be killed next
          if (st === 'background' || st === 'inactive') this.persist(true);
          if (st === 'background') this.backgroundAt ||= Date.now();
          if (st === 'active' && this.backgroundAt) {                                         // back after a real break: new session, return slot
            const away = Date.now() - this.backgroundAt;
            this.backgroundAt = 0;
            if (away >= AD_CONFIG.session.gapMs) {
              ads.foreground();
              if (this.snap.stage === 'play' && !this.snap.adBreak && !this.snap.booting) this.enqueue([{ wait: 0, run: () => this.returnSlot(away), hold: true }]);
            }
          }
        });
      } catch { this.appStateSub = null; }
    }
    if (!this.onPageHide && Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      this.onPageHide = () => { if (this.snap.stage === 'play') this.drainBeats(); this.persist(true); };
      window.addEventListener('pagehide', this.onPageHide);
    }
  }

  // ── engine dispatch ───────────────────────────────────────────────────────
  private dispatch(action: Action): StepResult | null {
    if (!this.state && action.type !== 'START_LIFE') return null;
    const r = step(this.state as LifeState, this.meta, action, getBundle());
    this.state = r.state;
    this.meta = r.meta;
    if (r.state?.calendar) advanceContent(r.state.calendar.age);          // D-156: merge reached bands, prefetch the next
    if (r.effects.length === 1 && r.effects[0]!.kind === 'HAPTIC') { haptic.error(); this.sfx('error_locked'); }
    return r;
  }

  // ── beats ─────────────────────────────────────────────────────────────────
  private enqueue(beats: Beat[]): void {
    this.queue.push(...beats);
    if (!this.snap.busy) this.set({ busy: true });
    if (!this.beatTimer && !this.held && !this.draining) this.pump();
  }
  private pump(): void {
    const b = this.queue.shift();
    if (!b) { this.beatTimer = null; this.set({ busy: false }); this.maybeOffer(); this.scheduleAuto(); this.persist(); return; }
    this.beatTimer = setTimeout(() => {
      b.run();
      if (b.hold && (this.snap.moment || this.snap.adBreak)) { this.beatTimer = null; this.held = true; return; }
      this.pump();
    }, b.wait);
  }
  /**
   * Plays every queued beat at once (no waits, moments skipped) so feed and engine agree right now — used before a
   * save that cannot wait for the queue to drain (Close, app background / page hide).
   */
  private draining = false;
  private drainBeats(): void {
    this.draining = true;
    if (this.beatTimer) clearTimeout(this.beatTimer);
    this.beatTimer = null;
    this.held = false;
    for (let guard = 0; guard < 500 && this.queue.length; guard++) {
      const b = this.queue.shift()!;
      b.run();
      if (this.snap.moment) this.set({ moment: null });
    }
    this.queue = [];
    this.draining = false;
    if (this.snap.moment) this.set({ moment: null });
    this.set({ busy: false });
  }

  private flushBeats(): void {
    if (this.beatTimer) clearTimeout(this.beatTimer);
    this.beatTimer = null;
    this.queue = [];
    this.held = false;
  }

  // ── avatar moments ────────────────────────────────────────────────────────
  private openMoment(st: LifeState, kind: MomentKind, extra: Partial<MomentView> = {}): void {
    const id = this.id();
    const outfit = outfitFor({ job: st.status.job, age: st.calendar.age });
    const ms = kind === 'death' ? Math.max(1400, this.t().moment) : this.t().moment;
    recordMoment(this.momentHist, kind, { shownDays: st.counters.shownDays, age: st.calendar.age });
    this.set({
      moment: { id, kind, age: st.calendar.age, fromAge: st.calendar.age, outfitFrom: outfit, outfitTo: outfit,
        cat: st.status.assets.includes('kedi'), ms, ...extra },
    });
    const cue = MOMENT_SFX[kind];
    if (cue) this.sfx(cue);
    this.later(ms, () => this.closeMoment(id));
  }

  private closeMoment(id?: number): void {
    const m = this.snap.moment;
    if (!m || (id !== undefined && m.id !== id)) return;
    this.set({ moment: null });
    if (this.held) { this.held = false; this.pump(); }
  }

  /** Tap on a moment: skip to its end (07 §2.5.1 b — no juice blocks input). */
  skipMoment = (): void => { this.closeMoment(); };

  /** Effects → feed beats, in engine order (D-088: DateLine → skip → flow → card → bubbles → reply → outcome → stamp → coach). */
  private play(fx: Effect[], st: LifeState, prev: LifeState | null = null): void {
    const t = this.t();
    const beats: Beat[] = [];
    // ── which avatar moment (if any) this step earns: observed from effects / state, never rolled here.
    const pending = st.phase === 'day';
    const change = lifeChange(prev?.status, st.status);
    const prevOutfit = prev ? outfitFor({ job: prev.status.job, age: prev.calendar.age }) : outfitFor({ job: st.status.job, age: st.calendar.age });
    if (change && pending) this.deferred ??= { ...change, outfitFrom: prevOutfit };
    const career = !pending ? (change ? { ...change, outfitFrom: prevOutfit } : this.deferred) : null;
    const report = fx.find((e): e is Extract<Effect, { kind: 'REPORT_CARD' }> => e.kind === 'REPORT_CARD');
    const cands: MomentKind[] = momentCandidates({
      death: fx.some((e) => e.kind === 'DEATH'),
      legendary: fx.some((e) => e.kind === 'SHOW_DAY' && !!e.card.legendary),
      birthdayAge: report ? report.data.age : null,            // milestone ages only; other birthdays keep AgeUp
      career: career ? career.kind : null,
      wagerWin: fx.some((e) => e.kind === 'STAMP' && e.result === 'iWasWrong'),
    });
    const pick = pickMoment(cands, { shownDays: st.counters.shownDays, age: st.calendar.age }, this.momentHist);
    if (career && !pending) this.deferred = null;
    for (let i = 0; i < fx.length; i++) {
      const e = fx[i]!;
      switch (e.kind) {
        case 'SHOW_DAY': {
          const c = e.card;
          const birthday = c.eventId === 'sys_report_card';
          if (isGriefScene(eventById(c.eventId)?.tags)) ads.noteGrief(st.lifeSeed, st.counters.shownDays);   // quiet zone: no commercial surface around a loss
          beats.push({ wait: 0, run: () => {
            const gap = st.calendar.skippedSinceLast;
            const unread = c.dayIndex <= 1 ? this.snap.unread : Math.min(99, this.snap.unread + unreadGain(gap));
            this.set({ view: st, mood: 'neutral', playerMood: c.legendary ? 'shock' : 'neutral', progress: 0, unread });
            this.hushed = false;
            if (!birthday && c.eventId !== 'sys_death') this.sfx('day_advance');
            this.push({ id: this.id(), kind: 'date', dayIndex: c.dayIndex, calendarDay: st.calendar.calendarDay, dateISO: c.dateISO, birthday });
            this.warnHealth(st);                                                // drift lowers health between scenes too
          } });
          // Legendary day: the one moment allowed over a pending choice — as the intro, before the card.
          if (pick === 'legendary') beats.push({ wait: t.line, run: () => this.openMoment(st, 'legendary'), hold: true });
          if (c.skip && c.dayIndex > 1) { const sk = c.skip; beats.push({ wait: t.line, run: () => this.push({ id: this.id(), kind: 'skip', key: sk.key, params: sk.params }) }); }
          const momsHouse = st.status.home.kind === 'momsHouse';
          if (c.flowLog.length) beats.push({ wait: t.line, run: () => { this.push({ id: this.id(), kind: 'flow', lines: c.flowLog, momsHouse }); sfxForFlow(c.flowLog).forEach((n, k) => this.sfx(n, k * 260)); } });
          if (birthday) {
            beats.push({ wait: t.line, run: () => this.push({ id: this.id(), kind: 'coach', ui: { k: 'birthdayLine', a: [st.calendar.age, report?.data.ritual?.birthdayBand ?? 'warmup', report?.data.ritual?.birthday ?? 0] }, roast: true }) });
          } else if (c.eventId === 'sys_quiet') {
            beats.push({ wait: t.line, run: () => this.push({ id: this.id(), kind: 'mundane', ui: { k: 'quiet' } }) });
          } else if (c.eventId !== 'sys_death') {
            const nar = c.bubbles.find((b) => b.speaker === 'narrator');
            beats.push({ wait: t.line, run: () => {
              haptic.selection();
              const variant = cardVariant(c), ev = eventById(c.eventId);
              this.push({ id: this.id(), kind: 'card', eventId: c.eventId, variant, age: st.calendar.age,
                narration: nar ? { key: nar.textKey, params: nar.params } : null, wager: c.wager, stamp: null });
              const cue = sfxForCard({ variant, tags: ev?.tags ?? [], valence: ev?.valence ?? 0, surpriseTier: c.surpriseTier });
              this.sfx(cue);
              this.hushed = cue === 'grief';
              if (c.wager) this.sfx('wager_pin', 220);
            } });
          }
          break;
        }
        case 'SHOW_DIALOG': {
          if (e.layer === 'dialog') {
            for (const b of e.bubbles) {
              if (b.speaker === 'narrator') continue;
              const wait = t.bubble + Math.round(b.delayMs * t.delayScale);
              const typingId = this.id();
              if (t.typing > 0) {
                beats.push({ wait: Math.max(0, wait - t.typing), run: () => this.push({ id: typingId, kind: 'typing', speaker: b.speaker }) });
              }
              beats.push({ wait: t.typing > 0 ? t.typing : wait, run: () => {
                this.set({ feed: this.snap.feed.filter((f) => f.id !== typingId) });
                this.push({ id: this.id(), kind: 'npc', speaker: b.speaker, avatar: b.avatar, key: b.textKey, params: b.params, age: st.calendar.age });
                this.sfx('bubble');
              } });
            }
          } else if (e.layer === 'reply') {
            const b = e.bubbles[0]!;
            const auto = this.snap.auto;
            beats.push({ wait: 0, run: () => this.push({ id: this.id(), kind: 'reply', key: b.textKey, auto }) });
          } else if (e.layer === 'outcome') {
            const deltas: Delta[] = [];
            for (let j = i + 1; j < fx.length && fx[j]!.kind === 'FLOAT_NUM'; j++) {
              const f = fx[j] as Extract<Effect, { kind: 'FLOAT_NUM' }>;
              deltas.push({ stat: f.stat, delta: f.delta });
            }
            const b = e.bubbles[0]!;
            const face = outcomeMood(deltas);
            const answeredId = (st.card ?? prev?.card)?.eventId;
            const answered = answeredId ? eventById(answeredId) : undefined;
            const cues = sfxForOutcome(deltas, { milestone: !!answered && isMilestone(answered.tags) && !isGrief(answered.tags) });
            beats.push({ wait: t.outcome, run: () => {
              this.set(face ? { view: st, playerMood: face } : { view: st });
              this.push({ id: this.id(), kind: 'outcome', key: b.textKey, params: b.params, deltas });
              this.spawnFloats(deltas);
              if (deltas.length) haptic.light();
              cues.forEach((n, k) => this.sfx(n, k * 140));
              if (!this.lowJoyShown && st.stats.joy < 1500) {
                this.lowJoyShown = true;
                this.push({ id: this.id(), kind: 'sys', ui: { k: 'lowJoy' } });
              }
              this.warnHealth(st);
            } });
          } else {
            for (const b of e.bubbles) {
              beats.push({ wait: t.coach, run: () => {
                if (b.roast && this.snap.mood === 'neutral') this.set({ mood: 'smirk' });
                this.push({ id: this.id(), kind: 'coach', key: b.textKey, params: b.params, roast: b.roast, lift: b.lift });
              } });
            }
          }
          break;
        }
        case 'STAMP': {
          const res = e.result, variant = e.variant;
          const moment = pick === 'wagerWin' && res === 'iWasWrong';
          beats.push({ wait: t.stamp, run: () => {
            this.slam(res, variant, !moment);
            this.sfx(sfxForStamp(res));
            this.set({ playerMood: res === 'iWasWrong' ? 'smug' : 'sad' });
            if (moment) this.openMoment(st, 'wagerWin');
          }, hold: moment });
          break;
        }
        case 'REPORT_CARD': {
          const data = e.data;
          if (pick === 'birthday') {
            // Aging morph replaces the plain AgeUp overlay: old face → new age, page flip, YAŞLANIYORSUN.
            beats.push({ wait: t.line, run: () => { this.set({ playerMood: 'neutral' }); this.openMoment(st, 'birthday', { fromAge: data.age - 1, age: data.age }); }, hold: true });
          } else beats.push({ wait: t.line, run: () => { this.set({ ageUp: { from: data.age - 1, to: data.age } }); this.sfx('birthday'); } });
          beats.push({ wait: pick === 'birthday' ? 0 : t.ageUp, run: () => {
            this.lastMotto = mottoKey(data);
            this.lastReport = data;
            this.set({ ageUp: null });
            this.push({ id: this.id(), kind: 'report', data, motto: this.lastMotto });
            haptic.medium();
            this.sfx('report_reveal');
            this.sfx(UI_SFX.reportFiled, 300);                                  // the FILED stamp lands (useSlam 380 ms)
          } });
          // The report card must be on screen before "One More Year" (playtest: at ▶▶ the button beat the card).
          beats.push({ wait: t.reportHold, run: () => undefined });
          break;
        }
        case 'DEATH':
          // The face fades to gray ('dead') before the ECG takes over.
          beats.push({ wait: t.coach + 400, run: () => { this.set({ playerMood: 'dead', view: st }); this.openMoment(st, 'death'); }, hold: true });
          beats.push({ wait: 0, run: () => this.die(st) });
          break;
        case 'SESSION_END_SUGGESTED':
          beats.push({ wait: 0, run: () => {
            if (this.snap.auto) return;
            this.set({ suggestEnd: true });
            this.push({ id: this.id(), kind: 'sys', ui: { k: 'suggestEnd' } });
          } });
          break;
        case 'NOTIFY_PLAN':
          if (e.teaserKeys.length) beats.push({ wait: 0, run: () => { this.push({ id: this.id(), kind: 'sys', ui: { k: 'envelopeOpened' } }); this.sfx('paper_rustle'); } });
          break;
        case 'HAPTIC':
        case 'FLOAT_NUM':
          break;
      }
    }
    if (career && (pick === 'promotion' || pick === 'sad')) {
      const outfitTo = outfitFor({ job: st.status.job, age: st.calendar.age });
      beats.push({ wait: t.line, run: () => {
        this.set({ view: st, playerMood: pick === 'sad' ? 'sad' : 'happy' });
        this.openMoment(st, pick, { reason: career.reason, outfitFrom: career.outfitFrom, outfitTo, jobTitle: st.status.job?.title });
      }, hold: true });
    }
    if (st.phase === 'answered') beats.push({ wait: t.resume, run: () => undefined });   // clock resumes 600 ms after the coach line
    this.enqueue(beats);
  }

  private warnHealth(st: LifeState): void {
    if (this.healthWarned || st.phase === 'dead' || Math.round(st.stats.health / 100) >= HEALTH_DANGER) return;
    this.healthWarned = true;
    this.push({ id: this.id(), kind: 'coach', ui: { k: 'lowHealth' }, roast: false, lift: true });
  }

  private spawnFloats(deltas: Delta[]): void {
    if (!deltas.length) return;
    // A delta that rounds to 0 on the HUD would float "−0" (UX playtest #10): not shown.
    const items = deltas.filter((d) => FLOAT_STATS.has(d.stat) && (d.stat === 'money' ? d.delta !== 0 : Math.round(d.delta / 100) !== 0)).map((d) => ({ id: this.id(), stat: d.stat, delta: d.delta }));
    if (!items.length) return;
    this.set({ floats: [...this.snap.floats, ...items] });
    const ids = new Set(items.map((x) => x.id));
    this.later(1300, () => this.set({ floats: this.snap.floats.filter((f) => !ids.has(f.id)) }));
  }

  private slam(result: StampResult, variant: number, big = true): void {
    const feed = this.snap.feed;
    let k = feed.length - 1;
    while (k >= 0 && feed[k]!.kind !== 'card') k--;
    if (k >= 0) {
      const card = feed[k] as Extract<FeedItem, { kind: 'card' }>;
      const next = feed.slice();
      next[k] = { ...card, stamp: { result, variant } };
      this.set({ feed: next });
    }
    const wrong = result === 'iWasWrong';
    const id = this.id();
    this.set({
      bigStamp: big ? { id, result } : this.snap.bigStamp, shake: { key: this.snap.shake.key + 1, hard: wrong },
      flash: { key: id, color: wrong ? 'red' : 'lime' }, mood: wrong ? 'shock' : 'smirk',
    });
    if (wrong) haptic.heavy(); else haptic.medium();
    this.later(this.t().bigStamp, () => { if (this.snap.bigStamp?.id === id) this.set({ bigStamp: null }); });
  }

  private die(st: LifeState): void {
    this.clearAuto();
    ads.noteDeath();                                                          // D-007: the death flow has no ad surface at all
    const birthYear = Number(st.calendar.startDateISO.slice(0, 4)) - 18;
    const s = CATALOG[this.snap.locale];
    // Auto never carries into the next life: the player picks the next client's name themselves.
    this.set({
      stage: 'death', mood: 'sad', playerMood: 'dead', moment: null, offer: null, auto: false, typeMs: (this.snap.speed === 'fast' ? FAST : PLAY).typeMs, progress: 0, suggestEnd: false, session: null, bigStamp: null,
      death: {
        roast: buildRoast(st), name: st.name, birthYear, deathYear: birthYear + (st.death?.age ?? st.calendar.age),
        epitaph: this.lastMotto ? mottoLine(s, this.lastMotto, this.lastReport?.ritual?.motto ?? 0) : null, autoDays: this.autoDays, report: this.lastReport,
        look: this.looks.get(st.lifeSeed) ?? this.snap.look, outfit: outfitFor({ job: st.status.job, age: st.calendar.age }),
      },
    });
    haptic.heavy();
    this.saveNow();                                                          // the life is over: keep the legacy, drop the life
  }

  // ── ad layer (src/ads, docs/design/15) ────────────────────────────────────
  private backgroundAt = 0;
  private uncoverWaiters: (() => void)[] = [];
  private adGame(): ReturnType<typeof adGameContext> {
    const s = this.snap;
    return adGameContext(this.state, { stage: s.stage, busy: s.busy, auto: s.auto, lifeNo: s.lifeNo });
  }

  /**
   * Return slot (D-084): the only place an interstitial can come from — the player is back after a long break,
   * the "where were we" line is up, nothing has been tapped yet. It holds the beat queue (so no choice is on
   * screen and the clock stands), lets the ad layer pick at most ONE thing (consent step, ATT pre-prompt or the
   * announced interstitial), then releases. Usually it releases at once: nothing is due.
   */
  private returnSlot(awayMs: number): void {
    this.set({ adBreak: true });
    void (async () => {
      try {
        await ads.ready();
        if (this.covered) await new Promise<void>((r) => { this.uncoverWaiters.push(r); });
        const slot = ads.returnSlot(this.adGame(), awayMs);
        if (!slot) return;
        if (slot !== 'att') {
          // Announced, never sudden: the coach says it first (06 §2.4, Google "unexpected full-screen" rule).
          this.push({ id: this.id(), kind: 'coach', ui: { k: slot === 'interstitial' ? 'adIncoming' : 'adConsentIntro' } });
          await new Promise<void>((r) => { this.later(AD_CONFIG.interstitial.noticeMs, r); });
        }
        if (this.snap.stage === 'play') await ads.runReturnSlot(slot, this.adGame(), awayMs);
      } catch (e) { console.warn('[ads] return slot failed:', e); }
      finally { this.endAdBreak(); }
    })();
  }

  private endAdBreak(): void {
    this.set({ adBreak: false });
    if (this.held) { this.held = false; this.pump(); } else this.scheduleAuto();
  }

  /** Rewarded offer (D-085 b): on an ordinary payday, once the day's lines are done and no choice is open. */
  private maybeOffer(): void {
    if (!this.state || this.snap.offer || this.snap.session || this.snap.adBreak) return;
    const offer = ads.offer('sponsor', this.adGame());
    if (offer) this.mountOffer(offer);
  }

  private mountOffer(offer: Offer): void {
    this.push({ id: this.id(), kind: 'coach', ui: { k: offer.free ? 'adSponsorFree' : 'adSponsorOffer', a: [offer.amount] } });
    this.set({ offer });
  }

  /** Demo / test hook (registered only outside production): the payday trigger is skipped, every cap still applies. */
  private debugOffer(): unknown {
    const g = { ...this.adGame(), payday: true };
    if (g.monthlySalary <= 0) g.monthlySalary = 4000;
    const why = ads.offerDecision('sponsor', g);
    const offer = this.snap.offer ? null : ads.offer('sponsor', g);
    if (offer) this.mountOffer(offer);
    return offer ?? why;
  }

  /** [Watch ad → get X]: the reward exists only if the ad was watched to the end (or the no-ads entitlement skips it). */
  acceptOffer = (): void => {
    const offer = this.snap.offer, st = this.state;
    if (!offer || this.snap.adBreak || !st) return;
    haptic.selection();
    this.set({ adBreak: true });
    void ads.claim(offer, this.adGame()).then((r) => {
      this.set({ offer: null });
      const now = this.state;
      if (r.rewarded && now && now.lifeSeed === st.lifeSeed && !now.death) {      // earned → granted, always (06 §2.1 principle 4)
        this.state = grantMoney(now, offer.amount);
        this.set({ view: this.state });
        this.push({ id: this.id(), kind: 'coach', ui: { k: 'adSponsorGranted', a: [offer.amount] } });
        this.spawnFloats([{ stat: 'money', delta: offer.amount }]);
        haptic.success();
      } else if (!r.rewarded) this.push({ id: this.id(), kind: 'coach', ui: { k: r.reason === 'closed' ? 'adClosedEarly' : 'adNoFill' } });
    }).catch((e) => { console.warn('[ads] claim failed:', e); this.set({ offer: null }); })
      .finally(() => { this.endAdBreak(); this.persist(true); });
  };

  /** [No thanks]: the card closes, the coach says nothing (06 §3.2), nothing is lost. */
  declineOffer = (): void => {
    if (!this.snap.offer || this.snap.adBreak) return;
    haptic.selection();
    this.set({ offer: null });
    this.scheduleAuto();
  };

  // ── clock (D-066) ─────────────────────────────────────────────────────────
  private tick(): void {
    const s = this.snap, st = this.state;
    if (s.stage === 'play' && !this.covered && !s.adBreak && !s.session) ads.tickPlay(TICK);   // play clock since install (first 10 min are ad-free)
    if (s.stage !== 'play' || s.busy || !st || s.ageUp || s.moment || s.offer || s.adBreak || s.session || s.speed === 'pause' || this.covered) return;
    if (!PHASES_FLOW.has(st.phase)) return;
    const p = s.progress + TICK / this.t().dayFlow;
    if (p >= 1) { this.set({ progress: 1 }); this.nextDay(); } else this.set({ progress: p });
  }

  private nextDay(): void {
    const st = this.state;
    if (!st || this.snap.busy || !(PHASES_FLOW.has(st.phase) || st.phase === 'birthday')) return;
    this.clearAuto();
    const r = this.dispatch({ type: 'NEXT_DAY' });
    if (r) this.play(r.effects, r.state, st);
  }

  // ── auto mode ─────────────────────────────────────────────────────────────
  private clearAuto(): void { if (this.autoTimer) clearTimeout(this.autoTimer); this.autoTimer = null; }
  private scheduleAuto(): void {
    this.clearAuto();
    const s = this.snap;
    if (s.auto && s.offer) { this.declineOffer(); return; }                  // auto never answers an offer with "watch"
    if (!s.auto || s.busy || s.adBreak || s.speed === 'pause' || s.session || this.covered || s.booting) return;
    const t = this.t();
    // FTUE only: on the very first Client File auto may keep the name; after a death the player always picks.
    if (s.stage === 'file') { if (s.lifeNo === 1 && !this.meta.legacy.livesCompleted) this.autoTimer = setTimeout(() => this.keepName(), 1800); return; }
    if (s.stage !== 'play' || !this.state) return;
    if (this.state.phase === 'day') this.autoTimer = setTimeout(() => this.autoPick(), t.autoPick);
    else if (this.state.phase === 'birthday') this.autoTimer = setTimeout(() => this.oneMoreYear(), t.report);
  }
  private autoPick(): void {
    const card = this.state?.card;
    if (!card || this.state?.phase !== 'day') return;
    const open = card.choices.filter((c) => !c.locked);
    const c = open[Math.floor(Math.random() * open.length)];
    if (c) { this.autoDays++; this.answer(c.id, 'auto'); }
  }

  // ── public actions ────────────────────────────────────────────────────────
  private pickName(locale: Locale, prev: number): { name: string; city: string; i: number } {
    const pool = CATALOG[locale].names;
    let i = Math.floor(Math.random() * pool.length);
    if (i === prev) i = (i + 1) % pool.length;
    const [name, city] = pool[i]!;
    return { name, city, i };
  }

  shuffle = (): void => { haptic.selection(); this.sfx(UI_SFX.tap); this.set({ candidate: this.pickName(this.snap.locale, this.snap.candidate.i) }); };

  /** Client File: new random look (whole face). */
  shuffleLook = (): void => {
    if (this.snap.stage !== 'file') return;
    haptic.selection();
    this.sfx(UI_SFX.tap);
    this.set({ draftLook: generateLook(randomSeed()), lookChanged: null, lookNonce: this.snap.lookNonce + 1 });
  };

  /** Client File: ‹ › on one part. */
  cycleLook = (part: LookPart, dir: 1 | -1): void => {
    if (this.snap.stage !== 'file') return;
    haptic.selection();
    this.sfx(UI_SFX.tap);
    this.set({ draftLook: cyclePart(this.snap.draftLook, part, dir), lookChanged: part, lookNonce: this.snap.lookNonce + 1 });
  };

  /** Look of a life by engine life id (lifeSeed); null when the life was not started from this UI. */
  lookOf = (lifeSeed: string): Look | null => this.looks.get(lifeSeed) ?? null;

  setLocale = (locale: Locale): void => {
    if (locale === this.snap.locale) return;
    haptic.selection();
    this.sfx(UI_SFX.tap);
    const [name, city] = CATALOG[locale].names[this.snap.candidate.i]!;
    this.set({ locale, candidate: this.snap.stage === 'file' ? { name, city, i: this.snap.candidate.i } : this.snap.candidate });
    this.persist();
  };

  toggleFastLife = (): void => { haptic.selection(); this.sfx(UI_SFX.tap); this.set({ fastLife: !this.snap.fastLife }); this.persist(); };

  keepName = (): void => {
    if (this.snap.stage !== 'file' || this.waitingContent) return;
    if (!this.contentTried && !contentReadyFor(START_AGE)) {                  // web: core + first band still loading
      this.waitingContent = true;
      void prepareContent(START_AGE).finally(() => { this.waitingContent = false; this.contentTried = true; this.keepName(); });
      return;
    }
    this.clearAuto();
    haptic.selection();
    this.hushed = false;
    this.sfx(UI_SFX.startLife);
    const { name } = this.snap.candidate;
    const r = this.dispatch({ type: 'START_LIFE', seed: randomSeed(), name, locale: this.snap.locale, fastLife: this.snap.fastLife });
    if (!r) return;
    this.dispatch({ type: 'RESUME', localDay: localDay() });                 // Günün Günü seed only (D-050)
    if (this.snap.speed !== 'play') this.dispatch({ type: 'SET_SPEED', speed: this.snap.speed });
    this.autoDays = 0; this.lowJoyShown = false; this.healthWarned = false; this.lastMotto = null; this.lastReport = null;
    this.momentHist = emptyMomentHistory(); this.deferred = null;
    const look = this.snap.draftLook;
    this.looks.set(r.state.lifeSeed, look);
    this.set({ stage: 'play', view: this.state, progress: 0, unread: 9, lifeNo: this.meta.legacy.livesCompleted + 1, look, playerMood: 'neutral', moment: null });
    const t = this.t();
    this.enqueue([
      { wait: 0, run: () => this.push({ id: this.id(), kind: 'reply', raw: name, auto: false }) },
      { wait: t.coach, run: () => this.push({ id: this.id(), kind: 'coach', ui: { k: 'nameRoast', a: [name] }, roast: true }) },
      { wait: t.coach * 2, run: () => this.nextDay() },
    ]);
  };

  answer = (choiceId: string, via: 'tap' | 'auto' = 'tap'): void => {
    const st = this.state;
    if (this.snap.stage !== 'play' || this.snap.busy || !st || st.phase !== 'day' || !st.card) return;
    this.clearAuto();
    if (via === 'tap') { haptic.selection(); this.sfx(sfxForChoice(st.card.choices.find((c) => c.id === choiceId)?.swipe)); }
    const eventId = st.card.eventId;
    const r = this.dispatch({ type: 'ANSWER', eventId, choiceId, via });
    if (!r || r.effects.every((e) => e.kind === 'HAPTIC')) return;
    if (eventById(eventId)?.tags.some((tg) => FAMILY_TAGS.includes(tg))) this.set({ unread: 0 });
    this.play(r.effects, r.state, st);
  };

  oneMoreYear = (): void => { if (this.state?.phase === 'birthday') { haptic.medium(); this.sfx(UI_SFX.oneMoreYear); this.nextDay(); } };

  /** HUD "Unread" chip: Motto explains it in the feed (UX playtest #11), at most once every 20 s. */
  explainUnread = (): void => {
    if (this.snap.stage !== 'play' || Date.now() - this.unreadInfoAt < 20000) return;
    this.unreadInfoAt = Date.now();
    haptic.selection();
    this.sfx(UI_SFX.tap);
    this.push({ id: this.id(), kind: 'coach', ui: { k: 'unreadInfo' } });
  };

  /** Manual mode (⏸): the Next Day button. */
  nextDayManual = (): void => { haptic.selection(); this.sfx(UI_SFX.tap); this.nextDay(); };

  setSpeed = (speed: Speed): void => {
    if (speed === this.snap.speed) return;
    haptic.selection();
    this.sfx(UI_SFX.tap);
    if (this.state) this.dispatch({ type: 'SET_SPEED', speed });
    this.set({ speed });
    this.set({ typeMs: this.t().typeMs });
    this.scheduleAuto();
    this.persist();
  };

  toggleAuto = (): void => {
    haptic.selection();
    this.sfx(UI_SFX.tap);
    this.set({ auto: !this.snap.auto, suggestEnd: false });
    this.set({ typeMs: this.t().typeMs });
    this.scheduleAuto();
    this.persist();
  };

  endSession = (): void => {
    const st = this.state;
    if (this.snap.stage !== 'play' || !st || st.phase === 'dead') return;
    const r = this.dispatch({ type: 'SESSION_END', reason: 'enough' });
    if (!r) return;
    this.clearAuto();
    this.sfx(UI_SFX.endSession);
    this.set({ session: { years: st.calendar.age - 18, days: st.counters.shownDays }, suggestEnd: false });
    if (r.effects.some((e) => e.kind === 'NOTIFY_PLAN' && e.teaserKeys.length)) this.push({ id: this.id(), kind: 'sys', ui: { k: 'envelopeOpened' } });
    this.persist();
  };

  closeSession = (): void => { this.dispatch({ type: 'RESUME', localDay: localDay() }); this.set({ session: null }); this.scheduleAuto(); this.persist(); };

  /**
   * "Close" on the Enough-for-today sheet: the stop is honoured — saved at once, nothing runs. Android leaves the
   * app; iOS / web (no programmatic exit) keep a quiet "notebook closed" sheet until Continue.
   */
  closeForToday = (): void => {
    const s = this.snap.session;
    if (!s) return;
    haptic.selection();
    this.sfx(UI_SFX.tap);
    this.clearAuto();
    this.drainBeats();
    this.set({ session: { ...this.snap.session ?? s, closed: true } });
    this.persist(true);
    if (Platform.OS === 'android') { try { BackHandler.exitApp(); } catch { /* stays on the closed sheet */ } }
  };

  newClient = (): void => {
    this.flushBeats();
    this.clearAuto();
    for (const t of this.timers) clearTimeout(t);
    this.timers.clear();
    this.state = null;
    this.set({
      stage: 'file', view: null, death: null, feed: [], floats: [], busy: false, progress: 0, mood: 'neutral', bigStamp: null, flash: null,
      ageUp: null, suggestEnd: false, session: null, offer: null, auto: false, candidate: this.pickName(this.snap.locale, this.snap.candidate.i),
      lifeNo: this.meta.legacy.livesCompleted + 1,
      draftLook: generateLook(randomSeed()), lookChanged: null, lookNonce: this.snap.lookNonce + 1, look: null, playerMood: 'neutral', moment: null,
    });
    haptic.success();
    this.hushed = false;
    this.sfx(UI_SFX.newClient);
    this.saveNow();
    this.enqueue([{ wait: 200, run: () => this.push({ id: this.id(), kind: 'coach', ui: { k: 'intro1' }, roast: true }) }]);
  };
}

let singleton: GameController | null = null;

export function useGame(): { snap: Snapshot; game: GameController } {
  const game = useMemo(() => (singleton ??= new GameController()), []);
  const snap = useSyncExternalStore(game.subscribe, game.getSnapshot, game.getSnapshot);
  useEffect(() => { game.start(); return () => game.stop(); }, [game]);
  return { snap, game };
}
