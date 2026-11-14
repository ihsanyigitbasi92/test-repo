#!/usr/bin/env node
/**
 * Motto sound effects — synthesized in-house, from scratch (docs/design/16-ses-efektleri.md).
 *
 * LEGAL: no samples, no recordings, no third-party audio of any kind. Every file under assets/sfx/ is the output of
 * the arithmetic in this file (oscillators, seeded noise, envelopes, biquad filters), so D2P Technology owns it
 * outright. Nothing here imitates a known jingle or another product's signature sound.
 *
 * Deterministic: a fixed-seed PRNG and plain float64 math → the same bytes on every run (the test suite renders
 * twice and compares hashes, and compares against the committed files).
 *
 *   node scripts/gen-sfx.mjs            write assets/sfx/*.wav, assets/sfx/manifest.json, src/state/sfxAssets.gen.ts
 *   node scripts/gen-sfx.mjs --check    regenerate in memory, fail if the committed files differ
 *   node scripts/gen-sfx.mjs --report   numeric sanity table (duration, peak, RMS, DC, clipping, …)
 *
 * Format: RIFF/WAVE PCM, 16-bit, mono, 22 050 Hz. Each file: DC-blocked, 2 ms fade-in / 8 ms fade-out,
 * peak-normalized to −3 dBFS. Loudness between sounds is set at runtime (src/state/sfx.ts `gain`), not here.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const SR = 22050;
export const PEAK_DBFS = -3;
export const MAX_BYTES = 60 * 1024;
const TAU = Math.PI * 2;

// ── primitives ──────────────────────────────────────────────────────────────
/** mulberry32: tiny seeded PRNG (public-domain algorithm), the only source of "randomness". */
function prng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const n = (sec) => Math.round(sec * SR);
const buf = (sec) => new Float64Array(n(sec));

/** Percussive envelope: linear attack `a` s, then exponential decay with time constant `tau` s. */
const perc = (a, tau) => (t) => (t < a ? t / a : Math.exp(-(t - a) / tau));
/** Swell: smooth rise over `a` s, smooth fall over the last `r` s of `dur`. */
const swell = (a, r, dur) => (t) => {
  const up = t < a ? 0.5 - 0.5 * Math.cos((Math.PI * t) / a) : 1;
  const left = dur - t;
  const down = left < r ? 0.5 - 0.5 * Math.cos((Math.PI * Math.max(0, left)) / r) : 1;
  return up * down;
};
/** Arch over the whole duration; `skew` < 1 peaks early. */
const arch = (dur, pow = 1, skew = 1) => (t) => Math.pow(Math.sin(Math.PI * Math.pow(Math.min(1, t / dur), skew)), pow);

/**
 * Additive tone. `f`: Hz or (t) => Hz (phase is accumulated, so sweeps are click-free).
 * `harm`: [[multiple, amplitude], …] partials (non-integer multiples → bell / coin timbres).
 */
function tone(out, { at = 0, dur, f, env, gain = 1, harm = [[1, 1]], trem }) {
  const i0 = n(at), len = Math.min(n(dur), out.length - i0);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const hz = typeof f === 'function' ? f(t) : f;
    ph += (TAU * hz) / SR;
    let s = 0;
    for (const [m, a] of harm) if (hz * m < SR * 0.45) s += a * Math.sin(ph * m);
    let g = gain * env(t);
    if (trem) g *= 1 - trem.depth * (0.5 + 0.5 * Math.sin(TAU * trem.hz * t));
    out[i0 + i] += s * g;
  }
}

/** RBJ biquad coefficients (public "Audio EQ Cookbook" formulas). */
function biquad(type, f, q) {
  const w = (TAU * Math.min(f, SR * 0.45)) / SR, cs = Math.cos(w), al = Math.sin(w) / (2 * q);
  let b0, b1, b2;
  if (type === 'lp') { b0 = (1 - cs) / 2; b1 = 1 - cs; b2 = (1 - cs) / 2; }
  else if (type === 'hp') { b0 = (1 + cs) / 2; b1 = -(1 + cs); b2 = (1 + cs) / 2; }
  else { b0 = al; b1 = 0; b2 = -al; }                                           // band-pass, 0 dB peak
  const a0 = 1 + al;
  return [b0 / a0, b1 / a0, b2 / a0, (-2 * cs) / a0, (1 - al) / a0];
}

/**
 * Filtered white noise. `f`: Hz or (u) => Hz with u = 0..1 over the burst (filter sweeps: slides, swipes).
 * `crackle`: { ms, depth } random stepped amplitude (paper fibres tearing / rustling).
 */
function noise(out, { at = 0, dur, env, gain = 1, seed, type = 'bp', f, q = 1, crackle }) {
  const rnd = prng(seed), i0 = n(at), len = Math.min(n(dur), out.length - i0);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0, c = biquad(type, typeof f === 'function' ? f(0) : f, q);
  let ck = 1, ckTarget = 1;
  const ckEvery = crackle ? Math.max(1, n(crackle.ms / 1000)) : 0;
  for (let i = 0; i < len; i++) {
    if (typeof f === 'function' && i % 16 === 0) c = biquad(type, f(i / len), q);
    const x = rnd() * 2 - 1;
    const y = c[0] * x + c[1] * x1 + c[2] * x2 - c[3] * y1 - c[4] * y2;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    if (ckEvery) {
      if (i % ckEvery === 0) ckTarget = 1 - crackle.depth * rnd();
      ck += (ckTarget - ck) * 0.02;
    }
    out[i0 + i] += y * gain * env(i / SR) * ck;
  }
}

// timbres
const PURE = [[1, 1]];
const SOFT = [[1, 1], [2, 0.2]];
const BELL = [[1, 1], [2, 0.3], [3, 0.1], [4.2, 0.08]];
const COIN = [[1, 1], [2.76, 0.5], [5.4, 0.25]];
const BRASS = [[1, 1], [2, 0.45], [3, 0.25], [4, 0.1]];
const BODY = [[1, 1], [2, 0.6], [3, 0.4], [4, 0.2]];
const PITCH = [1, 1.06, 0.943];                                                 // variant → pitch factor (±1 semitone)

// ── the sounds ──────────────────────────────────────────────────────────────
// Phone speakers roll off below ~250 Hz, so every "low" sound carries harmonics / a noise layer above that.

/** Pen-click on paper: a short band-passed tick over two tiny tones. */
function uiTap(v) {
  const p = PITCH[v], o = buf(0.055);
  noise(o, { dur: 0.03, env: perc(0.001, 0.007), gain: 0.6, seed: 101 + v, f: 2400 * p, q: 1.2 });
  tone(o, { dur: 0.05, f: 1250 * p, env: perc(0.001, 0.011), gain: 0.5 });
  tone(o, { dur: 0.05, f: 520 * p, env: perc(0.001, 0.016), gain: 0.35 });
  return o;
}

/** A sheet sliding onto the desk: hiss whose band rises, then the paper settles with a tick. */
function cardSlide(v) {
  const p = PITCH[v], o = buf(0.21);
  noise(o, { dur: 0.17, env: arch(0.17, 1.5, 0.6), gain: 0.8, seed: 201 + v, f: (u) => (1500 + 2000 * u) * p, q: 0.8 });
  noise(o, { dur: 0.17, env: arch(0.17, 1.5, 0.6), gain: 0.22, seed: 211 + v, type: 'hp', f: 4000, q: 0.7 });
  noise(o, { at: 0.165, dur: 0.03, env: perc(0.001, 0.006), gain: 0.35, seed: 221 + v, f: 1800 * p, q: 1 });
  return o;
}

/** Decision made: pen click, then a rising fifth. */
function choiceConfirm() {
  const o = buf(0.16);
  noise(o, { dur: 0.02, env: perc(0.0005, 0.004), gain: 0.4, seed: 301, f: 3000, q: 1 });
  tone(o, { dur: 0.1, f: 660, env: perc(0.002, 0.03), gain: 0.5, harm: SOFT });
  tone(o, { at: 0.045, dur: 0.115, f: 990, env: perc(0.002, 0.05), gain: 0.5, harm: SOFT });
  return o;
}

/** Paper flicked aside: the band falls (left) or rises (right). */
function swipe(dir) {
  const o = buf(0.2);
  const f = dir < 0 ? (u) => 3200 - 2200 * u : (u) => 1000 + 2200 * u;
  noise(o, { dur: 0.19, env: arch(0.19, 1.2), gain: 0.9, seed: 401 + (dir < 0 ? 0 : 1), f, q: 1.5 });
  noise(o, { dur: 0.19, env: arch(0.19, 1.2), gain: 0.12, seed: 411, type: 'hp', f: 5000, q: 0.7 });
  return o;
}

/** Rubber stamp on a desk: falling body tone + a muffled slap + a tiny rebound. `weight` 0 small · 1 normal · 2 heavy. */
function stamp(weight) {
  const W = [
    { dur: 0.15, f0: 260, f1: 150, drop: 0.02, tau: 0.03, nf: [2500, 1400], ntau: 0.01, ngain: 0.9 },
    { dur: 0.27, f0: 180, f1: 95, drop: 0.03, tau: 0.05, nf: [1800, 600], ntau: 0.018, ngain: 1.2 },
    { dur: 0.46, f0: 160, f1: 75, drop: 0.04, tau: 0.09, nf: [2200, 500], ntau: 0.03, ngain: 1.3 },
  ][weight];
  const o = buf(W.dur);
  tone(o, { dur: W.dur, f: (t) => W.f0 * Math.exp(-t / W.drop) + W.f1, env: perc(0.002, W.tau), gain: 1, harm: BODY });
  noise(o, { dur: Math.min(W.dur, 0.2), env: perc(0.001, W.ntau), gain: W.ngain, seed: 501 + weight, type: 'lp',
    f: (u) => W.nf[0] + (W.nf[1] - W.nf[0]) * u, q: 0.8 });
  noise(o, { dur: 0.02, env: perc(0.0005, 0.004), gain: 0.3, seed: 511 + weight, f: 3500, q: 2 });
  if (weight >= 1) tone(o, { at: 0.07, dur: 0.12, f: 140, env: perc(0.003, 0.03), gain: 0.15, harm: BODY });
  // Heavy only: the ink spreading (07 #8) — a faint low hiss under the tail.
  if (weight === 2) noise(o, { at: 0.08, dur: 0.37, env: arch(0.37, 1, 0.5), gain: 0.14, seed: 521, f: 700, q: 0.7 });
  return o;
}

/** Two coins: inharmonic metal pings a fourth apart. */
function moneyGain(v) {
  const p = PITCH[v], o = buf(0.38);
  for (const [at, f, g, tau] of [[0, 1900, 0.5, 0.07], [0.085, 2530, 0.55, 0.11]]) {
    tone(o, { at, dur: 0.38 - at, f: f * p, env: perc(0.001, tau), gain: g, harm: COIN });
    noise(o, { at, dur: 0.03, env: perc(0.0005, 0.01), gain: 0.2, seed: 601 + v + Math.round(at * 1000), type: 'hp', f: 5000, q: 0.7 });
  }
  return o;
}

/** Money leaving: two soft falling notes, no metal, no sparkle (07: losses are plain). */
function moneyLoss() {
  const o = buf(0.3);
  tone(o, { dur: 0.2, f: 392, env: perc(0.004, 0.06), gain: 0.6, harm: SOFT });
  tone(o, { at: 0.09, dur: 0.21, f: 294, env: perc(0.004, 0.07), gain: 0.6, harm: SOFT });
  noise(o, { dur: 0.1, env: perc(0.002, 0.03), gain: 0.2, seed: 701, type: 'lp', f: 900, q: 0.7 });
  return o;
}

/** Stat tick: two tiny blips, rising (up) or falling (down). */
function statTick(up, v) {
  const p = PITCH[v], o = buf(0.1);
  const [a, b] = up ? [880, 1175] : [700, 520];
  tone(o, { dur: 0.06, f: a * p, env: perc(0.002, 0.018), gain: 0.5 });
  tone(o, { at: 0.035, dur: 0.065, f: b * p, env: perc(0.002, 0.02), gain: 0.5 });
  return o;
}

/** Payday: cash-register mechanics (two clacks), a bell, three coins, the drawer. */
function payday() {
  const o = buf(0.76);
  noise(o, { dur: 0.04, env: perc(0.001, 0.012), gain: 0.6, seed: 801, f: 1500, q: 1 });
  noise(o, { at: 0.06, dur: 0.04, env: perc(0.001, 0.01), gain: 0.5, seed: 802, f: 2500, q: 1 });
  tone(o, { at: 0.09, dur: 0.6, f: 2093, env: perc(0.001, 0.22), gain: 0.6, harm: [[1, 1], [2.4, 0.4], [4.1, 0.2]] });
  for (const [at, f] of [[0.22, 2637], [0.3, 2349], [0.37, 3136]]) tone(o, { at, dur: 0.3, f, env: perc(0.001, 0.06), gain: 0.35, harm: COIN });
  noise(o, { at: 0.44, dur: 0.22, env: arch(0.22, 1), gain: 0.5, seed: 803, f: (u) => 700 - 250 * u, q: 1.2 });
  return o;
}

/** Rent / bill: a strip of paper torn off, then one dull note. */
function bill() {
  const o = buf(0.36);
  noise(o, { dur: 0.22, env: arch(0.22, 0.7), gain: 0.7, seed: 901, f: (u) => 1200 + 2600 * u, q: 0.9, crackle: { ms: 3, depth: 0.9 } });
  tone(o, { at: 0.2, dur: 0.16, f: 196, env: perc(0.004, 0.06), gain: 0.5, harm: [[1, 1], [2, 0.5], [3, 0.25]] });
  return o;
}

/** Phone: two short bell trills (two sines beaten by a 22 Hz "clapper"); generic, no ringtone melody. */
function phoneRing() {
  const o = buf(0.98);
  for (const at of [0, 0.52]) {
    tone(o, { at, dur: 0.4, f: 1320, env: swell(0.012, 0.07, 0.4), gain: 0.5, harm: SOFT, trem: { hz: 22, depth: 0.85 } });
    tone(o, { at, dur: 0.4, f: 1650, env: swell(0.012, 0.07, 0.4), gain: 0.4, harm: SOFT, trem: { hz: 22, depth: 0.85 } });
  }
  return o;
}

/** A page turning: rising hiss with a flutter and a soft landing. */
function pageTurn() {
  const o = buf(0.26);
  const flutter = (t) => arch(0.22, 1)(t) * (0.7 + 0.3 * Math.sin(TAU * 60 * t));
  noise(o, { dur: 0.22, env: flutter, gain: 0.8, seed: 1001, f: (u) => 1500 + 2700 * u, q: 0.7 });
  noise(o, { at: 0.215, dur: 0.03, env: perc(0.001, 0.007), gain: 0.3, seed: 1002, f: 1600, q: 1 });
  return o;
}

/** Birthday / year turn: calendar leaf flips, then three soft bell notes (an open fifth and its octave). */
function birthday() {
  const o = buf(0.82);
  noise(o, { dur: 0.12, env: arch(0.12, 1), gain: 0.5, seed: 1101, f: (u) => 2000 + 2500 * u, q: 0.8 });
  for (const [at, f] of [[0.13, 587.33], [0.25, 880], [0.37, 1174.66]]) tone(o, { at, dur: 0.82 - at, f, env: perc(0.002, 0.16), gain: 0.45, harm: BELL });
  return o;
}

/** Report card lands on the desk: falling hiss, soft thump. */
function reportReveal() {
  const o = buf(0.38);
  noise(o, { dur: 0.2, env: arch(0.2, 1.2, 0.8), gain: 0.7, seed: 1201, f: (u) => 2500 - 1600 * u, q: 0.8 });
  tone(o, { at: 0.2, dur: 0.18, f: (t) => 150 * Math.exp(-t / 0.03) + 110, env: perc(0.002, 0.04), gain: 0.6, harm: [[1, 1], [2, 0.4], [3, 0.2]] });
  noise(o, { at: 0.2, dur: 0.06, env: perc(0.001, 0.012), gain: 0.4, seed: 1202, type: 'lp', f: 1200, q: 0.7 });
  return o;
}

/** Good surprise: five quick glassy pings climbing, with a breath of shimmer. */
function surpriseGood() {
  const o = buf(0.62);
  [1568, 2093, 2637, 3136, 4186].forEach((f, i) => tone(o, { at: [0, 0.06, 0.12, 0.18, 0.25][i], dur: 0.36, f, env: perc(0.001, 0.09), gain: 0.35, harm: SOFT }));
  noise(o, { dur: 0.55, env: arch(0.55, 1), gain: 0.05, seed: 1301, type: 'hp', f: 6000, q: 0.7 });
  return o;
}

/** Bad news: a dull, slow-attack thud. No stamp click, no metal. */
function badNews() {
  const o = buf(0.44);
  tone(o, { dur: 0.44, f: (t) => 150 * Math.exp(-t / 0.08) + 98, env: perc(0.006, 0.11), gain: 1, harm: [[1, 1], [2, 0.8], [3, 0.5], [4, 0.2]] });
  noise(o, { dur: 0.2, env: perc(0.004, 0.05), gain: 0.5, seed: 1401, type: 'lp', f: 900, q: 0.7 });
  return o;
}

/** Milestone: three rising notes into a held major chord — our own four-beat figure, soft brass-like partials. */
function milestone() {
  const o = buf(0.98);
  for (const [at, f] of [[0, 392], [0.11, 523.25], [0.22, 659.25]]) tone(o, { at, dur: 0.3, f, env: perc(0.012, 0.1), gain: 0.42, harm: BRASS });
  for (const f of [523.25, 659.25, 783.99]) tone(o, { at: 0.36, dur: 0.62, f, env: perc(0.012, 0.26), gain: 0.34, harm: BRASS });
  return o;
}

/** Legendary day: five bell notes up a major pentatonic shape, the last one rings; gold-dust shimmer. */
function legendary() {
  const o = buf(1.15);
  [587.33, 739.99, 880, 1174.66, 1479.98].forEach((f, i) => {
    const at = [0, 0.08, 0.16, 0.24, 0.34][i];
    tone(o, { at, dur: 1.15 - at, f, env: perc(0.002, i === 4 ? 0.36 : 0.14), gain: i === 4 ? 0.5 : 0.4, harm: BELL });
  });
  noise(o, { at: 0.3, dur: 0.85, env: arch(0.85, 1, 0.6), gain: 0.06, seed: 1501, type: 'hp', f: 5000, q: 0.7 });
  return o;
}

/** Omen: two low detuned tones beating slowly, swelling in and out. Felt more than heard. */
function omen() {
  const o = buf(1.12);
  const H = [[1, 0.6], [2, 1], [3, 0.6], [4, 0.3]];
  tone(o, { dur: 1.12, f: 110, env: swell(0.4, 0.55, 1.12), gain: 0.5, harm: H });
  tone(o, { dur: 1.12, f: 113.5, env: swell(0.4, 0.55, 1.12), gain: 0.5, harm: H });
  noise(o, { dur: 1.12, env: swell(0.4, 0.55, 1.12), gain: 0.05, seed: 1601, type: 'lp', f: 400, q: 0.7 });
  return o;
}

/** Death: one soft low toll, left to ring out. No melody, no effect, no joke. */
function death() {
  const o = buf(1.35);
  tone(o, { dur: 1.35, f: 196, env: perc(0.015, 0.42), gain: 1, harm: [[1, 1], [2, 0.7], [2.4, 0.15], [3, 0.35], [4.1, 0.1]] });
  tone(o, { dur: 1.35, f: 98, env: perc(0.02, 0.5), gain: 0.3 });
  return o;
}

/** Grief: a single quiet tone. Everything else stays silent in those scenes. */
function grief() {
  const o = buf(0.85);
  tone(o, { dur: 0.85, f: 329.63, env: perc(0.08, 0.26), gain: 1, harm: [[1, 1], [2, 0.08]] });
  return o;
}

/** Purchase done: a small stamp (receipt), two bright notes, one coin. */
function purchaseSuccess() {
  const o = buf(0.56);
  const s = stamp(0);
  for (let i = 0; i < s.length; i++) o[i] += s[i] * 0.45;
  tone(o, { at: 0.07, dur: 0.4, f: 659.25, env: perc(0.002, 0.12), gain: 0.45, harm: BELL });
  tone(o, { at: 0.17, dur: 0.39, f: 987.77, env: perc(0.002, 0.15), gain: 0.45, harm: BELL });
  tone(o, { at: 0.27, dur: 0.25, f: 2637, env: perc(0.001, 0.06), gain: 0.2, harm: COIN });
  return o;
}

/** Locked / not allowed: two dull knocks. */
function errorLocked() {
  const o = buf(0.2);
  for (const at of [0, 0.078]) {
    tone(o, { at, dur: 0.1, f: 220, env: perc(0.002, 0.022), gain: 0.7, harm: [[1, 1], [2, 0.7], [3, 0.4]] });
    noise(o, { at, dur: 0.03, env: perc(0.001, 0.008), gain: 0.4, seed: 1701 + Math.round(at * 1000), type: 'lp', f: 1000, q: 0.7 });
  }
  return o;
}

/** A day passes: the faintest calendar-leaf tick. Played hundreds of times per session — keep it tiny. */
function dayAdvance(v) {
  const p = PITCH[v], o = buf(0.07);
  noise(o, { dur: 0.05, env: perc(0.002, 0.011), gain: 0.7, seed: 1801 + v, f: 1800 * p, q: 0.9 });
  tone(o, { dur: 0.06, f: 440 * p, env: perc(0.003, 0.014), gain: 0.2 });
  return o;
}

/** Wager slip pinned to the card: a rustle, then the pin. */
function wagerPin() {
  const o = buf(0.14);
  noise(o, { dur: 0.06, env: arch(0.06, 1), gain: 0.3, seed: 1901, f: 2500, q: 0.8 });
  noise(o, { at: 0.06, dur: 0.02, env: perc(0.0005, 0.004), gain: 0.7, seed: 1902, type: 'hp', f: 3000, q: 0.7 });
  tone(o, { at: 0.06, dur: 0.06, f: 1800, env: perc(0.001, 0.01), gain: 0.3 });
  tone(o, { at: 0.06, dur: 0.08, f: 300, env: perc(0.001, 0.015), gain: 0.3, harm: SOFT });
  return o;
}

/** Envelope / document: paper rustling. */
function paperRustle() {
  const o = buf(0.32);
  noise(o, { dur: 0.3, env: arch(0.3, 0.8), gain: 0.8, seed: 2001, f: 3000, q: 0.6, crackle: { ms: 8, depth: 0.85 } });
  noise(o, { dur: 0.3, env: arch(0.3, 0.8, 1.4), gain: 0.3, seed: 2002, f: 1400, q: 0.8, crackle: { ms: 11, depth: 0.85 } });
  return o;
}

/** Chat bubble: a soft upward pop. */
function bubble(v) {
  const p = PITCH[v], o = buf(0.065);
  tone(o, { dur: 0.065, f: (t) => 520 * p * (1 + 0.5 * Math.min(1, t / 0.03)), env: perc(0.003, 0.014), gain: 0.7, harm: SOFT });
  return o;
}

/** name → number of variants + renderer. File names: `<name>.wav`, or `<name>_<1..n>.wav` with variants. */
export const SOUNDS = [
  ['ui_tap', 3, uiTap],
  ['card_slide', 3, cardSlide],
  ['choice_confirm', 1, choiceConfirm],
  ['swipe_left', 1, () => swipe(-1)],
  ['swipe_right', 1, () => swipe(1)],
  ['stamp_thud', 1, () => stamp(1)],
  ['stamp_heavy', 1, () => stamp(2)],
  ['stamp_small', 1, () => stamp(0)],
  ['money_gain', 2, moneyGain],
  ['money_loss', 1, moneyLoss],
  ['stat_up', 2, (v) => statTick(true, v)],
  ['stat_down', 2, (v) => statTick(false, v)],
  ['payday', 1, payday],
  ['bill', 1, bill],
  ['phone_ring', 1, phoneRing],
  ['page_turn', 1, pageTurn],
  ['birthday', 1, birthday],
  ['report_reveal', 1, reportReveal],
  ['surprise_good', 1, surpriseGood],
  ['bad_news', 1, badNews],
  ['milestone', 1, milestone],
  ['legendary', 1, legendary],
  ['omen', 1, omen],
  ['death', 1, death],
  ['grief', 1, grief],
  ['purchase_success', 1, purchaseSuccess],
  ['error_locked', 1, errorLocked],
  ['day_advance', 3, dayAdvance],
  ['wager_pin', 1, wagerPin],
  ['paper_rustle', 1, paperRustle],
  ['bubble', 2, bubble],
];

// ── mastering + WAV ─────────────────────────────────────────────────────────
/** DC block (one-pole high-pass, 20 Hz), fades, peak-normalize, quantize to int16. */
export function master(x) {
  const y = new Float64Array(x.length);
  const R = 1 - (TAU * 20) / SR;
  let px = 0, py = 0;
  for (let i = 0; i < x.length; i++) { py = x[i] - px + R * py; px = x[i]; y[i] = py; }
  const fi = n(0.002), fo = n(0.008);
  for (let i = 0; i < fi && i < y.length; i++) y[i] *= 0.5 - 0.5 * Math.cos((Math.PI * i) / fi);
  for (let i = 0; i < fo && i < y.length; i++) y[y.length - 1 - i] *= 0.5 - 0.5 * Math.cos((Math.PI * i) / fo);
  let peak = 0;
  for (let i = 0; i < y.length; i++) peak = Math.max(peak, Math.abs(y[i]));
  const k = peak > 0 ? Math.pow(10, PEAK_DBFS / 20) / peak : 0;
  const pcm = new Int16Array(y.length);
  for (let i = 0; i < y.length; i++) pcm[i] = Math.max(-32767, Math.min(32767, Math.round(y[i] * k * 32767)));
  return pcm;
}

export function wav(pcm) {
  const b = Buffer.alloc(44 + pcm.length * 2);
  b.write('RIFF', 0, 'ascii'); b.writeUInt32LE(36 + pcm.length * 2, 4); b.write('WAVE', 8, 'ascii');
  b.write('fmt ', 12, 'ascii'); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36, 'ascii'); b.writeUInt32LE(pcm.length * 2, 40);
  for (let i = 0; i < pcm.length; i++) b.writeInt16LE(pcm[i], 44 + i * 2);
  return b;
}

/** Every file, in a stable order: [{ name, variant, file, bytes: Buffer, pcm }]. Pure — touches no disk. */
export function renderAll() {
  const out = [];
  for (const [name, variants, render] of SOUNDS) {
    for (let v = 0; v < variants; v++) {
      const pcm = master(render(v));
      out.push({ name, variant: v, file: variants > 1 ? `${name}_${v + 1}.wav` : `${name}.wav`, bytes: wav(pcm), pcm });
    }
  }
  return out;
}

export const sha256 = (b) => createHash('sha256').update(b).digest('hex');

/** Numbers a human ear would otherwise have to judge (see --report). `pcm`: Int16Array. */
export function analyze(pcm) {
  let peak = 0, sum = 0, sq = 0, clipped = 0;
  for (let i = 0; i < pcm.length; i++) {
    const s = pcm[i] / 32767, a = Math.abs(s);
    if (a > peak) peak = a;
    if (Math.abs(pcm[i]) >= 32767) clipped++;
    sum += s; sq += s * s;
  }
  // Share of energy above 250 Hz (what a phone speaker can reproduce): 2nd-order high-pass, then energy ratio.
  const c = biquad('hp', 250, 0.707);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0, hi = 0;
  for (let i = 0; i < pcm.length; i++) {
    const x = pcm[i] / 32767, y = c[0] * x + c[1] * x1 + c[2] * x2 - c[3] * y1 - c[4] * y2;
    x2 = x1; x1 = x; y2 = y1; y1 = y; hi += y * y;
  }
  const db = (v) => (v > 0 ? 20 * Math.log10(v) : -Infinity);
  return {
    ms: Math.round((pcm.length / SR) * 1000), peakDb: db(peak), rmsDb: db(Math.sqrt(sq / pcm.length)), dc: sum / pcm.length, clipped,
    hiShare: sq > 0 ? hi / sq : 0, edge: Math.max(Math.abs(pcm[0]), Math.abs(pcm[pcm.length - 1])) / 32767,
  };
}

function assetsModule(files) {
  const lines = files.map((f) => `  '${f.file.replace(/\.wav$/, '')}': require('../../assets/sfx/${f.file}'),`);
  return `/**
 * GENERATED by scripts/gen-sfx.mjs — do not edit. Static require() table so Metro bundles every effect
 * (native: asset id for expo-audio; web: resolved to a URL by the WebAudio backend).
 */
/* eslint-disable @typescript-eslint/no-require-imports */
export const SFX_ASSETS: Readonly<Record<string, unknown>> = {
${lines.join('\n')}
};
`;
}

function main() {
  const app = join(dirname(fileURLToPath(import.meta.url)), '..');
  const dir = join(app, 'assets', 'sfx');
  const gen = join(app, 'src', 'state', 'sfxAssets.gen.ts');
  const files = renderAll();
  const manifest = {
    note: 'Generated by scripts/gen-sfx.mjs. All sounds are synthesized in-house; no third-party audio.',
    sampleRate: SR, bits: 16, channels: 1, peakDbfs: PEAK_DBFS,
    sounds: Object.fromEntries(SOUNDS.map(([name, variants]) => [name, { variants, files: files.filter((f) => f.name === name).map((f) => f.file) }])),
    files: Object.fromEntries(files.map((f) => [f.file, { bytes: f.bytes.length, ms: Math.round((f.pcm.length / SR) * 1000), sha256: sha256(f.bytes) }])),
  };
  const manifestText = JSON.stringify(manifest, null, 2) + '\n';
  const mode = process.argv[2];

  if (mode === '--report') {
    console.log('file                    ms   bytes  peak dBFS  RMS dBFS       DC  clip  >250Hz  edge');
    let total = 0;
    for (const f of files) {
      const a = analyze(f.pcm);
      total += f.bytes.length;
      console.log(`${f.file.padEnd(22)} ${String(a.ms).padStart(4)} ${String(f.bytes.length).padStart(7)} ${a.peakDb.toFixed(2).padStart(10)} ${a.rmsDb.toFixed(1).padStart(9)} ${a.dc.toFixed(5).padStart(8)} ${String(a.clipped).padStart(5)} ${(a.hiShare * 100).toFixed(0).padStart(6)}% ${a.edge.toFixed(4)}`);
    }
    console.log(`${files.length} files, ${total} bytes total`);
    return;
  }
  if (mode === '--check') {
    let bad = 0;
    for (const f of files) {
      const p = join(dir, f.file);
      if (!existsSync(p) || !readFileSync(p).equals(f.bytes)) { console.error(`✗ ${f.file} differs from the script output`); bad++; }
    }
    const extra = existsSync(dir) ? readdirSync(dir).filter((x) => x.endsWith('.wav') && !files.some((f) => f.file === x)) : [];
    for (const x of extra) { console.error(`✗ ${x} is not produced by the script`); bad++; }
    if (!existsSync(join(dir, 'manifest.json')) || readFileSync(join(dir, 'manifest.json'), 'utf8') !== manifestText) { console.error('✗ manifest.json is stale'); bad++; }
    if (!existsSync(gen) || readFileSync(gen, 'utf8') !== assetsModule(files)) { console.error('✗ src/state/sfxAssets.gen.ts is stale'); bad++; }
    if (bad) { console.error('Run `pnpm run gen:sfx`.'); process.exit(1); }
    console.log(`check-sfx: ${files.length} files match the script`);
    return;
  }
  mkdirSync(dir, { recursive: true });
  for (const x of readdirSync(dir)) if (x.endsWith('.wav')) rmSync(join(dir, x));
  for (const f of files) {
    if (f.bytes.length > MAX_BYTES) throw new Error(`${f.file}: ${f.bytes.length} bytes > ${MAX_BYTES}`);
    writeFileSync(join(dir, f.file), f.bytes);
  }
  writeFileSync(join(dir, 'manifest.json'), manifestText);
  writeFileSync(gen, assetsModule(files));
  console.log(`gen-sfx: ${files.length} files → ${dir} (${files.reduce((s, f) => s + f.bytes.length, 0)} bytes)`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
