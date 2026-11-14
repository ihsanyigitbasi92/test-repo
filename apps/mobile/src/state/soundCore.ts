/**
 * Sound manager core: what may play, how loud, how often — independent of any audio API, so it runs (and is tested)
 * in plain Node. sound.ts wires it to the platform backend (expo-audio on native, WebAudio on web), to storage and
 * to the app lifecycle. Contract: nothing here ever throws; with no backend every call is a silent no-op.
 */
import { SFX, SFX_CORE, SFX_NAMES, sfxFiles } from './sfx';
import type { SfxName } from './sfx';

/** One platform audio engine. `key` = file name without extension. Implementations must swallow their own errors. */
export interface AudioBackend {
  /** Start loading these files (idempotent; may be called again with more). */
  preload(keys: readonly string[]): void;
  /** Play one file once at `volume` 0..1 (overlapping other sounds; a still-loading file may be skipped). */
  play(key: string, volume: number): void;
  /** Cut everything that is sounding. */
  stopAll(): void;
  /** App foreground (true) / background (false). */
  setActive(active: boolean): void;
}

export interface SoundKV { read(key: string): Promise<string | null>; write(key: string, value: string): Promise<unknown> }
export interface SoundPrefs { muted: boolean; volume: number }
export interface PlayOpts {
  /** Extra gain for this one play (0..1.5), on top of the sound's mix level and the master volume. */
  volume?: number;
  /** Only play sounds of at least this priority (▶▶ auto: moments only). */
  minPri?: 0 | 1 | 2;
}

export const SOUND_PREFS_KEY = 'motto.sound.v1';
/** Default ON, at a modest level. */
export const DEFAULT_PREFS: SoundPrefs = { muted: false, volume: 0.6 };
/** Ambient (pri 0) sounds share a budget: at most this many starts per window; feedback and moments always pass. */
export const AMBIENT_BUDGET = 3;
export const AMBIENT_WINDOW_MS = 400;
/** Plays requested before the saved mute setting is known wait at most this long (launch stamp), then are dropped. */
const PENDING_MS = 400;

const clamp01 = (v: number) => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : DEFAULT_PREFS.volume);

export function decodePrefs(raw: string | null): SoundPrefs {
  if (!raw) return { ...DEFAULT_PREFS };
  try {
    const j = JSON.parse(raw) as Partial<SoundPrefs> | null;
    if (!j || typeof j !== 'object') return { ...DEFAULT_PREFS };
    return { muted: j.muted === true, volume: typeof j.volume === 'number' ? clamp01(j.volume) : DEFAULT_PREFS.volume };
  } catch { return { ...DEFAULT_PREFS }; }
}

export class SoundManager {
  private prefs: SoundPrefs = { ...DEFAULT_PREFS };
  private ready = false;
  private touched = false;
  private active = true;
  private lastAt = new Map<SfxName, number>();
  private lastVariant = new Map<SfxName, number>();
  private ambient: number[] = [];
  private pending: { name: SfxName; opts: PlayOpts; at: number }[] = [];
  private listeners = new Set<() => void>();
  private readonly backend: AudioBackend | null;
  private readonly kv: SoundKV | null;
  private readonly now: () => number;
  private readonly random: () => number;

  constructor(o: { backend?: AudioBackend | null; kv?: SoundKV | null; now?: () => number; random?: () => number } = {}) {
    this.backend = o.backend ?? null;
    this.kv = o.kv ?? null;
    this.now = o.now ?? (() => Date.now());
    this.random = o.random ?? Math.random;
  }

  /** Read the saved prefs, then preload (frequent sounds first). Safe to call more than once; never rejects. */
  async init(): Promise<void> {
    if (this.ready) return;
    let saved: SoundPrefs;
    try { saved = decodePrefs(this.kv ? await this.kv.read(SOUND_PREFS_KEY) : null); } catch { saved = { ...DEFAULT_PREFS }; }
    if (this.ready) return;
    if (!this.touched) this.prefs = saved;                      // a toggle made while the read was in flight wins
    this.ready = true;
    this.guard(() => {
      this.backend?.preload(SFX_CORE.flatMap(sfxFiles));
      this.backend?.preload(SFX_NAMES.flatMap(sfxFiles));
    });
    const waiting = this.pending;
    this.pending = [];
    const t = this.now();
    for (const p of waiting) if (t - p.at <= PENDING_MS) this.play(p.name, p.opts);
    this.emit();
  }

  /** Returns true when the sound was handed to the backend. */
  play(name: SfxName, opts: PlayOpts = {}): boolean {
    try {
      const spec = SFX[name];
      if (!spec || !this.backend) return false;
      const t = this.now();
      if (!this.ready) { if (this.pending.length < 4) this.pending.push({ name, opts, at: t }); return false; }
      if (this.prefs.muted || !this.active || this.prefs.volume <= 0) return false;
      if (spec.pri < (opts.minPri ?? 0)) return false;
      const last = this.lastAt.get(name);
      if (last !== undefined && t - last < spec.gapMs) return false;
      if (spec.pri === 0) {
        this.ambient = this.ambient.filter((x) => t - x < AMBIENT_WINDOW_MS);
        if (this.ambient.length >= AMBIENT_BUDGET) return false;
        this.ambient.push(t);
      }
      this.lastAt.set(name, t);
      const volume = Math.min(1, Math.max(0, this.prefs.volume * spec.gain * (opts.volume ?? 1)));
      this.backend.play(this.pickFile(name, spec.variants), volume);
      return true;
    } catch { return false; }
  }

  /** Next variant: random, but never the one just played. */
  private pickFile(name: SfxName, variants: number): string {
    if (variants <= 1) return name;
    const prev = this.lastVariant.get(name);
    let v = Math.min(variants - 1, Math.floor(this.random() * variants));
    if (v === prev) v = (v + 1) % variants;
    this.lastVariant.set(name, v);
    return `${name}_${v + 1}`;
  }

  get muted(): boolean { return this.prefs.muted; }
  get volume(): number { return this.prefs.volume; }
  getPrefs = (): SoundPrefs => this.prefs;

  setMuted(muted: boolean): void {
    if (muted === this.prefs.muted) return;
    this.prefs = { ...this.prefs, muted };
    if (muted) this.guard(() => this.backend?.stopAll());
    this.save();
  }
  toggleMuted = (): void => { this.setMuted(!this.prefs.muted); };
  setVolume(volume: number): void { this.prefs = { ...this.prefs, volume: clamp01(volume) }; this.save(); }

  /** App went to the background (false) / came back (true): nothing sounds while away. */
  setActive(active: boolean): void {
    if (active === this.active) return;
    this.active = active;
    this.pending = [];
    this.guard(() => { if (!active) this.backend?.stopAll(); this.backend?.setActive(active); });
  }

  /** Cut everything now (e.g. the app is being closed for today). */
  stopAll(): void { this.guard(() => this.backend?.stopAll()); }

  subscribe = (l: () => void): (() => void) => { this.listeners.add(l); return () => { this.listeners.delete(l); }; };

  private save(): void {
    this.touched = true;
    this.emit();
    try { this.kv?.write(SOUND_PREFS_KEY, JSON.stringify(this.prefs)).catch(() => undefined); } catch { /* storage unavailable: session-only */ }
  }
  private emit(): void { for (const l of this.listeners) { try { l(); } catch { /* a listener must not break audio */ } } }
  private guard(f: () => void): void { try { f(); } catch { /* audio unavailable */ } }
}
