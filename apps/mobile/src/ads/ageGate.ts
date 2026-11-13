/**
 * Neutral age gate (D-104 a, 07 §2.3.5, D-102) — pure logic + a small store with injected storage (tested in node).
 *
 * The screen asks for the YEAR of birth only (no "are you 18?" button, nothing pre-filled, no hint of a threshold).
 * With a year alone the exact age is unknown, so the YOUNGEST possible age is assumed (birthday not yet passed):
 *   age = currentYear − birthYear − 1
 *   age < minAge (16)        → `blocked`: the game does not open (07 §2.3.5); no ads, no SDK, nothing to tap back
 *   minAge ≤ age < 18        → `minor`:   the game opens; ads non-personalised + under-age tag, no ATT (D-102)
 *   age ≥ 18                 → `adult`
 * Stored under its own key, as little as still works:
 *   adult  → { band: 'adult', answeredAt }                       no year at all
 *   others → { band: 'minor', answeredAt, adultFromYear }        the ONE calendar year in which the band certainly
 *            becomes adult (birthYear + 19). The band is recomputed from it on every launch, so a minor turns adult
 *            and a blocked player is let in without ever being asked again — and without a way to re-answer.
 * The answer cannot be changed in the app (neutral-gate practice); it goes away only with the app's data.
 */
export type AgeBand = 'blocked' | 'minor' | 'adult';
export interface AgeGateConfig { minAge: number; adultAge: number; maxAge: number }
export interface AgeRecord { v: 1; answeredAt: number; band: 'adult' | 'minor'; adultFromYear?: number }

export const AGE_GATE_KEY = 'motto.agegate.v1';

/** Youngest possible age of someone born in `birthYear`, during `nowYear`. */
export const youngestAge = (birthYear: number, nowYear: number): number => nowYear - birthYear - 1;

/** A plausible year: four digits, not in the future, not older than `maxAge`. */
export function validBirthYear(cfg: AgeGateConfig, year: number, nowYear: number): boolean {
  return Number.isInteger(year) && year <= nowYear && year >= nowYear - cfg.maxAge;
}

export function bandForYear(cfg: AgeGateConfig, birthYear: number, nowYear: number): AgeBand {
  const age = youngestAge(birthYear, nowYear);
  return age < cfg.minAge ? 'blocked' : age < cfg.adultAge ? 'minor' : 'adult';
}

export function recordFor(cfg: AgeGateConfig, birthYear: number, now: number, nowYear: number): AgeRecord {
  return bandForYear(cfg, birthYear, nowYear) === 'adult'
    ? { v: 1, answeredAt: now, band: 'adult' }
    : { v: 1, answeredAt: now, band: 'minor', adultFromYear: birthYear + cfg.adultAge + 1 };
}

/** Band of a stored answer today. An adult answer never goes back (a clock set back cannot make a minor). */
export function bandOf(cfg: AgeGateConfig, r: AgeRecord, nowYear: number): AgeBand {
  if (r.band === 'adult' || r.adultFromYear === undefined) return 'adult';
  if (nowYear >= r.adultFromYear) return 'adult';
  return nowYear >= r.adultFromYear - (cfg.adultAge - cfg.minAge) ? 'minor' : 'blocked';
}

export function decodeAge(raw: string | null | undefined): AgeRecord | null {
  if (!raw) return null;
  try {
    const x = JSON.parse(raw) as Partial<AgeRecord> | null;
    if (!x || typeof x !== 'object' || x.v !== 1 || typeof x.answeredAt !== 'number') return null;
    if (x.band === 'adult') return { v: 1, answeredAt: x.answeredAt, band: 'adult' };
    if (x.band === 'minor' && Number.isInteger(x.adultFromYear)) return { v: 1, answeredAt: x.answeredAt, band: 'minor', adultFromYear: x.adultFromYear };
    return null;
  } catch { return null; }
}

/** `loading`: the answer is being read · `ask`: no answer yet, the gate is shown. */
export type AgeState = 'loading' | 'ask' | AgeBand;

export interface AgeGateDeps {
  cfg: AgeGateConfig;
  kv: { read(key: string): Promise<string | null>; write(key: string, value: string): Promise<unknown> };
  now: () => number;
  /** Device-local calendar year. */
  year: () => number;
  /** Called whenever the band is (re)established: launch with a stored answer, and right after an answer. */
  onBand: (band: AgeBand) => void;
}

export class AgeGateStore {
  private state: AgeState = 'loading';
  private loading: Promise<void> | null = null;
  private listeners = new Set<() => void>();
  constructor(private readonly d: AgeGateDeps) {}

  subscribe = (l: () => void): (() => void) => { this.listeners.add(l); return () => { this.listeners.delete(l); }; };
  getState = (): AgeState => this.state;
  private set(s: AgeState): void {
    this.state = s;
    if (s !== 'loading' && s !== 'ask') this.d.onBand(s);
    for (const l of this.listeners) l();
  }

  /** Reads the stored answer. No answer (new install, or a player from before the gate) → `ask`. Never rejects. */
  load(): Promise<void> {
    this.loading ??= (async () => {
      let r: AgeRecord | null = null;
      try { r = decodeAge(await this.d.kv.read(AGE_GATE_KEY)); } catch { r = null; }
      this.set(r ? bandOf(this.d.cfg, r, this.d.year()) : 'ask');
    })();
    return this.loading;
  }

  valid(year: number): boolean { return validBirthYear(this.d.cfg, year, this.d.year()); }

  /** The one answer. Ignored unless the gate is asking (it cannot be answered twice). */
  submit(birthYear: number): boolean {
    if (this.state !== 'ask' || !this.valid(birthYear)) return false;
    const rec = recordFor(this.d.cfg, birthYear, this.d.now(), this.d.year());
    void Promise.resolve(this.d.kv.write(AGE_GATE_KEY, JSON.stringify(rec))).catch(() => undefined);
    this.set(bandOf(this.d.cfg, rec, this.d.year()));
    return true;
  }
}

/** The gate is answered (adult or minor). `blocked` is NOT done: the game never starts behind it. */
export const ageGateDone = (s: AgeState): boolean => s === 'adult' || s === 'minor';
