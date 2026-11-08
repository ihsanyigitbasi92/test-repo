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
 */
import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { buildRoast, emptyMeta, step } from '@motto/engine';
import type { Action, Effect, LifeState, Locale, MetaState, ReportCardData, RoastReport, Speed, StepResult } from '@motto/engine';
import { BUNDLE, eventById } from '../content/bundle';
import { CATALOG } from '../i18n';
import { haptic } from './haptics';
import type { CardVariant, Delta, FeedItem, StampResult } from './feed';
import { cyclePart, generateLook, outfitFor } from '../avatar/look';
import type { Look, LookPart, Mood as FaceMood } from '../avatar/look';
import { emptyMomentHistory, lifeChange, momentCandidates, outcomeMood, pickMoment, recordMoment } from '../avatar/moments';
import type { MomentHistory, MomentKind, MomentReason, MomentView } from '../avatar/moments';

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
  session: { years: number; days: number } | null;
  suggestEnd: boolean;
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
}

/** `hold`: after `run`, the beat queue waits until the moment it opened is dismissed (timer or tap). */
interface Beat { wait: number; run: () => void; hold?: boolean }
interface Timing { typing: number; line: number; bubble: number; outcome: number; stamp: number; coach: number; resume: number; dayFlow: number; autoPick: number; report: number; ageUp: number; typeMs: number; delayScale: number; bigStamp: number; moment: number }

const TICK = 100;
const MAX_FEED = 90;
/** HUD cells that show a floating number (ego etc. only appear inline in the outcome line). */
const FLOAT_STATS = new Set<string>(['health', 'joy', 'brain', 'charm', 'money', 'momPressure', 'cringe']);
/** Unread counter: +1..3 per shown day depending on the skipped gap (pressure feedback, not a raw day count). */
const unreadGain = (gap: number) => Math.min(3, 1 + Math.floor(gap / 10));
/** ▶ 1 day ≈ 6 s all-in, ▶▶ ≈ 2 s (D-066); auto + ▶▶ runs a whole life in a few minutes. */
const PLAY: Timing = { typing: 380, line: 260, bubble: 420, outcome: 380, stamp: 420, coach: 520, resume: 600, dayFlow: 2600, autoPick: 1500, report: 3200, ageUp: 1100, typeMs: 14, delayScale: 1, bigStamp: 1700, moment: 2600 };
const FAST: Timing = { typing: 140, line: 90, bubble: 150, outcome: 160, stamp: 260, coach: 220, resume: 250, dayFlow: 900, autoPick: 450, report: 1200, ageUp: 700, typeMs: 4, delayScale: 0.3, bigStamp: 1100, moment: 1800 };
const TURBO: Timing = { typing: 0, line: 20, bubble: 35, outcome: 40, stamp: 120, coach: 50, resume: 60, dayFlow: 140, autoPick: 120, report: 2800, ageUp: 380, typeMs: 0, delayScale: 0, bigStamp: 650, moment: 1100 };

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
  private autoDays = 0;
  private lowJoyShown = false;
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

  constructor() {
    const locale: Locale = 'tr';
    this.snap = {
      stage: 'file', locale, speed: 'play', auto: false, fastLife: false, view: null, lifeNo: 1, feed: [], floats: [], busy: false,
      progress: 0, candidate: this.pickName(locale, -1), mood: 'neutral', bigStamp: null, shake: { key: 0, hard: false }, flash: null,
      ageUp: null, death: null, session: null, suggestEnd: false, unread: 9, typeMs: PLAY.typeMs,
      draftLook: generateLook(randomSeed()), lookChanged: null, lookNonce: 0, look: null, playerMood: 'neutral', moment: null,
    };
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
    if (this.started) { this.scheduleAuto(); return; }
    this.started = true;
    this.enqueue([
      { wait: 300, run: () => this.push({ id: this.id(), kind: 'coach', ui: { k: 'intro1' }, roast: true }) },
      { wait: 1400, run: () => this.push({ id: this.id(), kind: 'coach', ui: { k: 'intro2' } }) },
    ]);
  }

  stop(): void {
    if (this.tickTimer) clearInterval(this.tickTimer);
    this.tickTimer = null;
    this.clearAuto();
  }

  // ── engine dispatch ───────────────────────────────────────────────────────
  private dispatch(action: Action): StepResult | null {
    if (!this.state && action.type !== 'START_LIFE') return null;
    const r = step(this.state as LifeState, this.meta, action, BUNDLE);
    this.state = r.state;
    this.meta = r.meta;
    if (r.effects.length === 1 && r.effects[0]!.kind === 'HAPTIC') haptic.error();
    return r;
  }

  // ── beats ─────────────────────────────────────────────────────────────────
  private enqueue(beats: Beat[]): void {
    this.queue.push(...beats);
    if (!this.snap.busy) this.set({ busy: true });
    if (!this.beatTimer && !this.held) this.pump();
  }
  private pump(): void {
    const b = this.queue.shift();
    if (!b) { this.beatTimer = null; this.set({ busy: false }); this.scheduleAuto(); return; }
    this.beatTimer = setTimeout(() => {
      b.run();
      if (b.hold && this.snap.moment) { this.beatTimer = null; this.held = true; return; }
      this.pump();
    }, b.wait);
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
          beats.push({ wait: 0, run: () => {
            const gap = st.calendar.skippedSinceLast;
            const unread = c.dayIndex <= 1 ? this.snap.unread : Math.min(99, this.snap.unread + unreadGain(gap));
            this.set({ view: st, mood: 'neutral', playerMood: c.legendary ? 'shock' : 'neutral', progress: 0, unread });
            this.push({ id: this.id(), kind: 'date', dayIndex: c.dayIndex, dateISO: c.dateISO, birthday });
          } });
          // Legendary day: the one moment allowed over a pending choice — as the intro, before the card.
          if (pick === 'legendary') beats.push({ wait: t.line, run: () => this.openMoment(st, 'legendary'), hold: true });
          if (c.skip && c.dayIndex > 1) { const sk = c.skip; beats.push({ wait: t.line, run: () => this.push({ id: this.id(), kind: 'skip', key: sk.key, params: sk.params }) }); }
          const momsHouse = st.status.home.kind === 'momsHouse';
          if (c.flowLog.length) beats.push({ wait: t.line, run: () => this.push({ id: this.id(), kind: 'flow', lines: c.flowLog, momsHouse }) });
          if (birthday) {
            beats.push({ wait: t.line, run: () => this.push({ id: this.id(), kind: 'coach', ui: { k: 'birthdayLine', a: [st.calendar.age] }, roast: true }) });
          } else if (c.eventId === 'sys_quiet') {
            beats.push({ wait: t.line, run: () => this.push({ id: this.id(), kind: 'mundane', ui: { k: 'quiet' } }) });
          } else if (c.eventId !== 'sys_death') {
            const nar = c.bubbles.find((b) => b.speaker === 'narrator');
            beats.push({ wait: t.line, run: () => {
              haptic.selection();
              this.push({ id: this.id(), kind: 'card', eventId: c.eventId, variant: cardVariant(c), age: st.calendar.age,
                narration: nar ? { key: nar.textKey, params: nar.params } : null, wager: c.wager, stamp: null });
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
            beats.push({ wait: t.outcome, run: () => {
              this.set(face ? { view: st, playerMood: face } : { view: st });
              this.push({ id: this.id(), kind: 'outcome', key: b.textKey, params: b.params, deltas });
              this.spawnFloats(deltas);
              if (deltas.length) haptic.light();
              if (!this.lowJoyShown && st.stats.joy < 1500) {
                this.lowJoyShown = true;
                this.push({ id: this.id(), kind: 'sys', ui: { k: 'lowJoy' } });
              }
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
          } else beats.push({ wait: t.line, run: () => this.set({ ageUp: { from: data.age - 1, to: data.age } }) });
          beats.push({ wait: pick === 'birthday' ? 0 : t.ageUp, run: () => {
            this.lastMotto = mottoKey(data);
            this.lastReport = data;
            this.set({ ageUp: null });
            this.push({ id: this.id(), kind: 'report', data, motto: this.lastMotto });
            haptic.medium();
          } });
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
          if (e.teaserKeys.length) beats.push({ wait: 0, run: () => this.push({ id: this.id(), kind: 'sys', ui: { k: 'envelopeOpened' } }) });
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

  private spawnFloats(deltas: Delta[]): void {
    if (!deltas.length) return;
    const items = deltas.filter((d) => FLOAT_STATS.has(d.stat)).map((d) => ({ id: this.id(), stat: d.stat, delta: d.delta }));
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
    const birthYear = Number(st.calendar.startDateISO.slice(0, 4)) - 18;
    const s = CATALOG[this.snap.locale];
    // Auto never carries into the next life: the player picks the next client's name themselves.
    this.set({
      stage: 'death', mood: 'sad', playerMood: 'dead', moment: null, auto: false, typeMs: (this.snap.speed === 'fast' ? FAST : PLAY).typeMs, progress: 0, suggestEnd: false, session: null, bigStamp: null,
      death: {
        roast: buildRoast(st), name: st.name, birthYear, deathYear: birthYear + (st.death?.age ?? st.calendar.age),
        epitaph: this.lastMotto ? s.motto[this.lastMotto] ?? null : null, autoDays: this.autoDays, report: this.lastReport,
        look: this.looks.get(st.lifeSeed) ?? this.snap.look, outfit: outfitFor({ job: st.status.job, age: st.calendar.age }),
      },
    });
    haptic.heavy();
  }

  // ── clock (D-066) ─────────────────────────────────────────────────────────
  private tick(): void {
    const s = this.snap, st = this.state;
    if (s.stage !== 'play' || s.busy || !st || s.ageUp || s.moment || s.session || s.speed === 'pause') return;
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
    if (!s.auto || s.busy || s.speed === 'pause' || s.session) return;
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

  shuffle = (): void => { haptic.selection(); this.set({ candidate: this.pickName(this.snap.locale, this.snap.candidate.i) }); };

  /** Client File: new random look (whole face). */
  shuffleLook = (): void => {
    if (this.snap.stage !== 'file') return;
    haptic.selection();
    this.set({ draftLook: generateLook(randomSeed()), lookChanged: null, lookNonce: this.snap.lookNonce + 1 });
  };

  /** Client File: ‹ › on one part. */
  cycleLook = (part: LookPart, dir: 1 | -1): void => {
    if (this.snap.stage !== 'file') return;
    haptic.selection();
    this.set({ draftLook: cyclePart(this.snap.draftLook, part, dir), lookChanged: part, lookNonce: this.snap.lookNonce + 1 });
  };

  /** Look of a life by engine life id (lifeSeed); null when the life was not started from this UI. */
  lookOf = (lifeSeed: string): Look | null => this.looks.get(lifeSeed) ?? null;

  setLocale = (locale: Locale): void => {
    if (locale === this.snap.locale) return;
    haptic.selection();
    const [name, city] = CATALOG[locale].names[this.snap.candidate.i]!;
    this.set({ locale, candidate: this.snap.stage === 'file' ? { name, city, i: this.snap.candidate.i } : this.snap.candidate });
  };

  toggleFastLife = (): void => { haptic.selection(); this.set({ fastLife: !this.snap.fastLife }); };

  keepName = (): void => {
    if (this.snap.stage !== 'file') return;
    this.clearAuto();
    haptic.selection();
    const { name } = this.snap.candidate;
    const r = this.dispatch({ type: 'START_LIFE', seed: randomSeed(), name, locale: this.snap.locale, fastLife: this.snap.fastLife });
    if (!r) return;
    this.dispatch({ type: 'RESUME', localDay: localDay() });                 // Günün Günü seed only (D-050)
    if (this.snap.speed !== 'play') this.dispatch({ type: 'SET_SPEED', speed: this.snap.speed });
    this.autoDays = 0; this.lowJoyShown = false; this.lastMotto = null; this.lastReport = null;
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
    if (via === 'tap') haptic.selection();
    const eventId = st.card.eventId;
    const r = this.dispatch({ type: 'ANSWER', eventId, choiceId, via });
    if (!r || r.effects.every((e) => e.kind === 'HAPTIC')) return;
    if (eventById(eventId)?.tags.some((tg) => FAMILY_TAGS.includes(tg))) this.set({ unread: 0 });
    this.play(r.effects, r.state, st);
  };

  oneMoreYear = (): void => { if (this.state?.phase === 'birthday') { haptic.medium(); this.nextDay(); } };

  /** Manual mode (⏸): the Next Day button. */
  nextDayManual = (): void => { haptic.selection(); this.nextDay(); };

  setSpeed = (speed: Speed): void => {
    if (speed === this.snap.speed) return;
    haptic.selection();
    if (this.state) this.dispatch({ type: 'SET_SPEED', speed });
    this.set({ speed });
    this.set({ typeMs: this.t().typeMs });
    this.scheduleAuto();
  };

  toggleAuto = (): void => {
    haptic.selection();
    this.set({ auto: !this.snap.auto, suggestEnd: false });
    this.set({ typeMs: this.t().typeMs });
    this.scheduleAuto();
  };

  endSession = (): void => {
    const st = this.state;
    if (this.snap.stage !== 'play' || !st || st.phase === 'dead') return;
    const r = this.dispatch({ type: 'SESSION_END', reason: 'enough' });
    if (!r) return;
    this.clearAuto();
    this.set({ session: { years: st.calendar.age - 18, days: st.counters.shownDays }, suggestEnd: false });
    if (r.effects.some((e) => e.kind === 'NOTIFY_PLAN' && e.teaserKeys.length)) this.push({ id: this.id(), kind: 'sys', ui: { k: 'envelopeOpened' } });
  };

  closeSession = (): void => { this.dispatch({ type: 'RESUME', localDay: localDay() }); this.set({ session: null }); this.scheduleAuto(); };

  newClient = (): void => {
    this.flushBeats();
    this.clearAuto();
    for (const t of this.timers) clearTimeout(t);
    this.timers.clear();
    this.state = null;
    this.set({
      stage: 'file', view: null, death: null, feed: [], floats: [], busy: false, progress: 0, mood: 'neutral', bigStamp: null, flash: null,
      ageUp: null, suggestEnd: false, session: null, auto: false, candidate: this.pickName(this.snap.locale, this.snap.candidate.i),
      lifeNo: this.meta.legacy.livesCompleted + 1,
      draftLook: generateLook(randomSeed()), lookChanged: null, lookNonce: this.snap.lookNonce + 1, look: null, playerMood: 'neutral', moment: null,
    });
    haptic.success();
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
