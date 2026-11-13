/**
 * AnalyticsCore — the facade's engine (pure TS: clock, storage and providers are injected; runs in node tests).
 *
 * Guarantees (11 §1 "measurement never makes the game wait and never breaks it", D-054):
 *  - `track()` is synchronous, allocation-light and never throws; no caller ever awaits a sink.
 *  - Consent gate per purpose (consent.ts): `unknown` → the event waits in a bounded, persisted on-device queue;
 *    `granted` → the queue is flushed and events flow; `denied` → the queue is dropped and nothing is recorded.
 *    A provider's SDK is not even initialised before its purpose is granted.
 *  - Events fired before storage is read or before a provider finished `init()` are buffered, not lost.
 *  - Sessions: foreground time only; `game_session_end` is emitted every time the app goes to the background
 *    (the app may be killed there) with the cumulative numbers of the session and a rising `part`; a return
 *    within `sessionGapMs` continues the same session. Reports take the last part per `session_no`.
 */
import {
  UNKNOWN_CONSENT, NO_ADS_CONSENT, applyAnalyticsChoice, deriveConsent, emptyChoice,
  type AdsConsentView, type AnalyticsChoice, type ConsentSnapshot, type Platform, type Purpose,
} from './consent';
import {
  EVENTS, SCHEMA_VERSION, isoWeek, sanitizeEvent, sanitizeUserProps,
  type EventName, type Params, type ScreenName, type TrackArgs, type UserProps,
} from './events';
import type { AnalyticsProvider } from './providers/types';

export const ANALYTICS_KEY = 'motto.analytics.v1';
const PURPOSES: readonly Purpose[] = ['analytics', 'marketing'];

export interface Envelope { n: EventName; p: Params; t: number }
export type FtueStep = 'line_seen' | 'life_start' | 'decision' | 'stamp' | 'report_card';
export type SessionCounter = 'shown_days' | 'birthdays' | 'answers' | 'auto_answers' | 'speed_play' | 'speed_fast' | 'speed_auto';
export type SessionEndReason = 'background' | 'enough' | 'death' | 'close';

interface Stored {
  v: 1;
  choice: AnalyticsChoice;
  /** Local day / ISO week of the first launch (device only; only the week leaves, as a user property). */
  installDay: string | null;
  installWeek: string | null;
  ftue: Partial<Record<FtueStep | 'tutorial_begin' | 'tutorial_complete', 1>>;
  sessionNo: number;
  /** Foreground ms since the first launch, up to the last background. */
  fgMs: number;
  lastDeathAt: number;
  queue: Record<Purpose, Envelope[]>;
}
const emptyStored = (): Stored => ({ v: 1, choice: emptyChoice(), installDay: null, installWeek: null, ftue: {}, sessionNo: 0, fgMs: 0, lastDeathAt: 0,
  queue: { analytics: [], marketing: [] } });

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);

/** Stored blob → state. Queued events are re-validated against the current catalog (a renamed event is dropped). */
export function decodeStored(raw: string | null | undefined, queueLimit: number): Stored | null {
  if (!raw) return null;
  try {
    const x: unknown = JSON.parse(raw);
    if (!isObj(x) || x.v !== 1) return null;
    const s = emptyStored();
    if (isObj(x.choice)) {
      const c = x.choice;
      s.choice = { analytics: typeof c.analytics === 'boolean' ? c.analytics : null, decidedDay: typeof c.decidedDay === 'string' ? c.decidedDay : null,
        noticeVersion: typeof c.noticeVersion === 'number' ? c.noticeVersion : 0 };
    }
    if (typeof x.installDay === 'string') s.installDay = x.installDay;
    if (typeof x.installWeek === 'string') s.installWeek = x.installWeek;
    if (isObj(x.ftue)) for (const k of Object.keys(x.ftue)) if (x.ftue[k]) (s.ftue as Record<string, 1>)[k] = 1;
    if (typeof x.sessionNo === 'number' && x.sessionNo >= 0) s.sessionNo = Math.floor(x.sessionNo);
    if (typeof x.fgMs === 'number' && x.fgMs >= 0) s.fgMs = x.fgMs;
    if (typeof x.lastDeathAt === 'number') s.lastDeathAt = x.lastDeathAt;
    if (isObj(x.queue)) {
      for (const p of PURPOSES) {
        const q = x.queue[p];
        if (!Array.isArray(q)) continue;
        for (const e of q.slice(-queueLimit)) {
          if (!isObj(e) || typeof e.n !== 'string' || typeof e.t !== 'number') continue;
          const params = sanitizeEvent(e.n, e.p);
          if (params) s.queue[p].push({ n: e.n as EventName, p: { ...params, schema_v: SCHEMA_VERSION }, t: e.t });
        }
      }
    }
    return s;
  } catch { return null; }
}

export interface CoreDeps {
  providers: readonly AnalyticsProvider[];
  platform: Platform;
  kv: { read(key: string): Promise<string | null>; write(key: string, value: string): Promise<unknown> };
  now: () => number;
  /** Device-local 'YYYY-MM-DD'. */
  localDay: () => string;
  /** Per-purpose cap of the pre-consent queue and of each provider's pre-init buffer (oldest dropped). */
  queueLimit?: number;
  /** Away time after which a return to the foreground is a new session. */
  sessionGapMs?: number;
  /** Debounce of the state write (0: write on every change — tests). */
  saveDelayMs?: number;
  /**
   * true (default): nothing is initialised until the ad layer reports the age gate as `minor` / `adult`
   * (`setAdsConsent({ age })`). Tests that do not model the age gate pass false.
   */
  requireAgeGate?: boolean;
  /** Dev-only hook: an event was rejected by the sanitizer. */
  onReject?: (name: string, params: unknown) => void;
}

interface Slot { status: 'idle' | 'initing' | 'ready' | 'failed'; buf: Envelope[] }
interface Session { no: number; open: boolean; activeSince: number | null; bgAt: number; durMs: number; part: number; reason: SessionEndReason | null; c: Record<SessionCounter, number> }
const zeroCounters = (): Record<SessionCounter, number> => ({ shown_days: 0, birthdays: 0, answers: 0, auto_answers: 0, speed_play: 0, speed_fast: 0, speed_auto: 0 });

/** Events older than this at delivery carry `lag_s` (queued before consent / before the SDK was up). */
const LAG_MIN_MS = 60_000;

export class AnalyticsCore {
  private st: Stored = emptyStored();
  private loaded = false;
  private loading: Promise<void> | null = null;
  private preload: Envelope[] = [];
  private consentNow: ConsentSnapshot = UNKNOWN_CONSENT;
  private ads: AdsConsentView = NO_ADS_CONSENT;
  private readonly slots = new Map<AnalyticsProvider, Slot>();
  private props: Record<string, string> = {};
  private session: Session = { no: 0, open: false, activeSince: null, bgAt: 0, durMs: 0, part: 0, reason: null, c: zeroCounters() };
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners = new Set<() => void>();
  private readonly limit: number;
  private readonly gap: number;

  constructor(private readonly d: CoreDeps) {
    this.limit = d.queueLimit ?? 400;
    this.gap = d.sessionGapMs ?? 10 * 60_000;
    for (const p of d.providers) this.slots.set(p, { status: 'idle', buf: [] });
    if (d.requireAgeGate !== false) this.ads = { ...NO_ADS_CONSENT, age: 'loading' };
  }

  // ── store plumbing ────────────────────────────────────────────────────────
  subscribe = (l: () => void): (() => void) => { this.listeners.add(l); return () => { this.listeners.delete(l); }; };
  private emit(): void { for (const l of [...this.listeners]) { try { l(); } catch { /* a listener never breaks analytics */ } } }
  getConsent = (): ConsentSnapshot => this.consentNow;
  getChoice = (): AnalyticsChoice => this.st.choice;
  isLoaded(): boolean { return this.loaded; }
  /** Events waiting on the device for a consent answer (debug / tests). */
  pending(): Record<Purpose, number> { return { analytics: this.st.queue.analytics.length, marketing: this.st.queue.marketing.length }; }
  installWeek(): string | null { return this.st.installWeek; }

  private save(now = false): void {
    if (!this.loaded) return;
    const write = (): void => {
      this.saveTimer = null;
      try { void Promise.resolve(this.d.kv.write(ANALYTICS_KEY, JSON.stringify(this.st))).catch(() => undefined); } catch { /* storage is optional */ }
    };
    const delay = this.d.saveDelayMs ?? 2000;
    if (now || delay <= 0) { if (this.saveTimer) clearTimeout(this.saveTimer); write(); return; }
    this.saveTimer ??= setTimeout(write, delay);
  }

  /** Reads the stored state (choice, FTUE marks, queue), then routes what was tracked meanwhile. Never rejects. */
  ready(): Promise<void> {
    this.loading ??= (async () => {
      try {
        const s = decodeStored(await this.d.kv.read(ANALYTICS_KEY), this.limit);
        if (s) this.st = s;
      } catch { /* starts empty */ }
      this.loaded = true;
      try {
        const first = !this.st.installDay;
        if (first) {
          this.st.installDay = this.d.localDay();
          this.st.installWeek = isoWeek(new Date(this.d.now()));
        }
        if (this.session.open && this.session.no === 0) this.session.no = ++this.st.sessionNo;     // session opened before the load
        this.applyConsent(deriveConsent(this.st.choice, this.ads, this.d.platform));
        if (first) this.route(this.envelope('app_first_launch', { platform: this.d.platform }, this.preload[0]?.t));
        for (const e of this.preload.splice(0)) this.route(e.n === 'game_session_start' ? { ...e, p: { ...e.p, session_no: this.session.no } } : e);
        if (this.st.installWeek) this.setUserProps({ install_week: this.st.installWeek });
        this.save(true);
      } catch { /* never throws */ }
      this.emit();
    })();
    return this.loading;
  }

  // ── tracking ──────────────────────────────────────────────────────────────
  private envelope(name: EventName, params: Params, t?: number): Envelope {
    return { n: name, p: { ...params, schema_v: SCHEMA_VERSION }, t: t ?? this.d.now() };
  }

  /** Type-checked against the catalog; additionally sanitized at runtime. Fire-and-forget. */
  track<N extends EventName>(name: N, ...args: TrackArgs<N>): void {
    try {
      const params = sanitizeEvent(name, args[0]);
      if (!params) { this.d.onReject?.(name, args[0]); return; }
      const env = this.envelope(name, params);
      if (!this.loaded) { this.preload.push(env); if (this.preload.length > this.limit) this.preload.shift(); return; }
      this.route(env);
    } catch { /* analytics never breaks the game */ }
  }

  screen(name: ScreenName): void { this.track('screen_view', { screen_name: name, screen_class: name }); }

  private route(env: Envelope): void {
    for (const purpose of PURPOSES) {
      const state = this.consentNow[purpose];
      if (state === 'denied') continue;
      let wanted = false;
      for (const p of this.d.providers) {
        if (p.purpose !== purpose || (p.accepts && !p.accepts(env.n))) continue;
        wanted = true;
        if (state === 'granted') this.deliver(p, env);
      }
      if (wanted && state === 'unknown') {
        const q = this.st.queue[purpose];
        q.push(env);
        if (q.length > this.limit) q.splice(0, q.length - this.limit);
        this.save();
      }
    }
  }

  private deliver(p: AnalyticsProvider, env: Envelope): void {
    const slot = this.slots.get(p)!;
    if (slot.status === 'ready') { this.send(p, env); return; }
    if (slot.status === 'failed') return;
    slot.buf.push(env);
    if (slot.buf.length > this.limit) slot.buf.shift();
    this.ensureInit(p);
  }

  private send(p: AnalyticsProvider, env: Envelope): void {
    try {
      const lag = this.d.now() - env.t;
      p.logEvent(env.n, lag >= LAG_MIN_MS ? { ...env.p, lag_s: Math.round(lag / 1000) } : env.p);
    } catch { /* a sink error is never the game's problem */ }
  }

  private ensureInit(p: AnalyticsProvider): void {
    const slot = this.slots.get(p)!;
    if (slot.status !== 'idle') return;
    slot.status = 'initing';
    let started: Promise<void>;
    try { started = Promise.resolve(p.init(this.consentNow)); } catch (e) { started = Promise.reject(e); }
    started.then(() => {
      slot.status = 'ready';
      if (this.consentNow[p.purpose] !== 'granted') {                        // revoked while the SDK was starting
        slot.buf = [];
        this.safe(() => p.setConsent(this.consentNow));
        return;
      }
      this.safe(() => p.setConsent(this.consentNow));
      if (Object.keys(this.props).length) this.safe(() => p.setUserProps(this.props));
      for (const e of slot.buf.splice(0)) this.send(p, e);
    }).catch(() => { slot.status = 'failed'; slot.buf = []; });
  }

  private safe(f: () => void | Promise<void>): void {
    try { const r = f(); if (r && typeof r.catch === 'function') void r.catch(() => undefined); } catch { /* swallowed */ }
  }

  private live(p: AnalyticsProvider): boolean { return this.slots.get(p)!.status === 'ready' && this.consentNow[p.purpose] === 'granted'; }

  // ── consent ───────────────────────────────────────────────────────────────
  private applyConsent(next: ConsentSnapshot): void {
    const prev = this.consentNow;
    const changed = prev.analytics !== next.analytics || prev.marketing !== next.marketing || prev.advertiserTracking !== next.advertiserTracking || prev.minor !== next.minor;
    this.consentNow = next;
    if (!this.loaded) return;
    for (const p of this.d.providers) {
      const slot = this.slots.get(p)!;
      const granted = next[p.purpose] === 'granted';
      if (slot.status === 'ready' && changed) this.safe(() => p.setConsent(next));        // includes the revoke
      else if (granted && slot.status === 'failed') slot.status = 'idle';                  // a new grant may retry
      if (!granted) slot.buf = [];
      else if (slot.status === 'idle') this.ensureInit(p);
    }
    for (const purpose of PURPOSES) {
      const q = this.st.queue[purpose];
      if (next[purpose] === 'unknown' || !q.length) continue;
      const waiting = q.splice(0);
      if (next[purpose] === 'denied') continue;                                           // denied: the queue is dropped
      for (const env of waiting) for (const p of this.d.providers) if (p.purpose === purpose && (!p.accepts || p.accepts(env.n))) this.deliver(p, env);
    }
    if (changed) { this.save(true); this.emit(); }
  }

  private recompute(): void { this.applyConsent(deriveConsent(this.st.choice, this.ads, this.d.platform)); }

  /** The player's answer to "Analitik paylaşımı" (consent card or Settings). */
  setAnalyticsConsent(on: boolean): void {
    try {
      this.st.choice = applyAnalyticsChoice(on, this.consentNow.minor || this.ads.isMinor, this.d.localDay());
      this.recompute();
      this.save(true);
      this.emit();
    } catch { /* never throws */ }
  }

  /** The ad layer's consent state changed (personalised-ads switch, ATT answer, minor flag). */
  setAdsConsent(view: AdsConsentView): void {
    try {
      this.ads = { resolved: !!view.resolved, adsPersonalized: !!view.adsPersonalized, isMinor: !!view.isMinor, att: view.att,
        ...(typeof view.trackingAllowed === 'boolean' ? { trackingAllowed: view.trackingAllowed } : {}), ...(view.age ?? this.ads.age ? { age: view.age ?? this.ads.age } : {}) };
      this.recompute();
    } catch { /* never throws */ }
  }

  /**
   * "Verilerimi sil": drops everything queued on the device and asks every started SDK to reset its instance id.
   * Consent itself is left as it is (the player changes it with the switch). Never rejects.
   */
  async resetData(): Promise<void> {
    try {
      this.st.queue = { analytics: [], marketing: [] };
      this.preload = [];
      for (const p of this.d.providers) {
        const slot = this.slots.get(p)!;
        slot.buf = [];
        if (slot.status === 'ready') { try { await p.reset(); } catch { /* best effort */ } }
      }
      this.save(true);
      this.emit();
    } catch { /* never throws */ }
  }

  // ── user properties / errors ──────────────────────────────────────────────
  setUserProps(props: UserProps): void {
    try {
      const clean = sanitizeUserProps(props);
      const diff: Record<string, string> = {};
      for (const k of Object.keys(clean)) if (this.props[k] !== clean[k]) diff[k] = clean[k]!;
      if (!Object.keys(diff).length) return;
      this.props = { ...this.props, ...diff };
      for (const p of this.d.providers) if (this.live(p)) this.safe(() => p.setUserProps(diff));
    } catch { /* never throws */ }
  }

  /** Non-fatal error: a counted `app_error` (no message text) + the crash reporter when analytics is granted. */
  recordError(scope: (typeof EVENTS)['app_error']['p']['scope'][number], code: string, error?: unknown, fatal = false): void {
    try {
      this.track('app_error', { scope, code, fatal });
      if (!(error instanceof Error)) return;
      for (const p of this.d.providers) if (p.recordError && this.live(p)) p.recordError(error, `${scope}:${code}`);
    } catch { /* never throws */ }
  }

  // ── FTUE / lifecycle marks ────────────────────────────────────────────────
  /** Foreground ms since the first launch. */
  playMs(): number {
    const s = this.session;
    return Math.round(this.st.fgMs + (s.activeSince !== null ? this.d.now() - s.activeSince : 0));
  }

  /** Once per install. */
  ftue(step: FtueStep): void {
    try {
      if (this.st.ftue[step]) return;
      this.st.ftue[step] = 1;
      const ms = this.playMs();
      if (step === 'life_start') this.tutorial('begin');
      this.track(`ftue_${step}`, { ms });
      if (step === 'report_card') this.tutorial('complete');
      this.save();
    } catch { /* never throws */ }
  }
  ftueDone(step: FtueStep | 'tutorial_begin' | 'tutorial_complete'): boolean { return !!this.st.ftue[step]; }

  /** GA4 tutorial_begin / tutorial_complete, once per install (also fired by the life_start / report_card steps). */
  tutorial(which: 'begin' | 'complete'): void {
    try {
      const k = which === 'begin' ? 'tutorial_begin' : 'tutorial_complete';
      if (this.st.ftue[k]) return;
      this.st.ftue[k] = 1;
      this.track(k);
      this.save();
    } catch { /* never throws */ }
  }

  /**
   * An onboarding step outside the fixed funnel (`ftue_step{step, idx, ms}`), once per install per step id.
   * `step` must be a machine id (ID_RE, ≤ 32 chars) — e.g. 'speed_hint', 'wager_explained'.
   */
  ftueCustom(step: string, idx: number): void {
    try {
      if (!/^[a-z][a-z0-9_]{0,31}$/.test(step)) return;
      const k = `x:${step}`;
      const marks = this.st.ftue as Record<string, 1>;
      if (marks[k]) return;
      marks[k] = 1;
      this.track('ftue_step', { step, idx, ms: this.playMs() });
      this.save();
    } catch { /* never throws */ }
  }

  markDeath(): void { this.st.lastDeathAt = this.d.now(); this.save(); }
  /** Ms since the last death, once (0 when there was none). */
  takeMsSinceDeath(): number {
    const at = this.st.lastDeathAt;
    if (!at) return 0;
    this.st.lastDeathAt = 0;
    this.save();
    return Math.max(0, this.d.now() - at);
  }

  // ── sessions ──────────────────────────────────────────────────────────────
  /** App launched or returned to the foreground. */
  foreground(): void {
    try {
      const s = this.session, now = this.d.now();
      if (s.open && s.activeSince !== null) return;
      if (s.open && now - s.bgAt < this.gap) { s.activeSince = now; s.reason = null; return; }   // short break: same session
      const cold = !s.open;
      this.session = { no: this.loaded ? ++this.st.sessionNo : 0, open: true, activeSince: now, bgAt: 0, durMs: 0, part: 0, reason: null, c: zeroCounters() };
      this.track('game_session_start', { source: cold ? 'cold' : 'resume', session_no: this.session.no });
      this.save();
    } catch { /* never throws */ }
  }

  /** App went to the background (or the page is being hidden): the session's numbers so far are emitted. */
  background(): void {
    try {
      const s = this.session, now = this.d.now();
      if (!s.open || s.activeSince === null) return;
      const seg = Math.max(0, now - s.activeSince);
      s.durMs += seg; s.activeSince = null; s.bgAt = now; s.part++;
      this.st.fgMs += seg;
      this.track('game_session_end', { dur_ms: Math.round(s.durMs), ...s.c, session_no: s.no, part: s.part, end_reason: s.reason ?? 'background' });
      this.save(true);
    } catch { /* never throws */ }
  }

  /** Cheap per-day / per-answer counters of the running session (no allocation). */
  count(key: SessionCounter, by = 1): void { this.session.c[key] += by; }
  /** Why the session is about to end (the "Enough for today" sheet, a death). Cleared when play continues. */
  sessionReason(reason: SessionEndReason | null): void { this.session.reason = reason; }
  sessionDurMs(): number { const s = this.session; return Math.round(s.durMs + (s.activeSince !== null ? this.d.now() - s.activeSince : 0)); }
  sessionNo(): number { return this.session.no; }
}
