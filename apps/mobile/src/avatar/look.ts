/**
 * Player / NPC look model — pure TypeScript (no React Native), so it is unit-tested with vitest.
 *
 * A `Look` is a set of part indices into the tables below. Every look is generated from a seed string with a
 * small integer PRNG (FNV-1a → mulberry32), so the same seed always draws the same face. All art is our own
 * procedural vector shapes (see Avatar.tsx): no third-party avatar sets, no emoji glyphs, no real-person likeness.
 *
 * What the engine owns (job, cat, age) is never stored here: the outfit and the aging are *derived* from the
 * engine's LifeState at render time (`outfitFor`, `agingFor`).
 */

export const FACE_SHAPES = ['oval', 'round', 'square', 'heart'] as const;
/** Six skin tones, light → deep. Never a roast target (see roast.ts). */
export const SKIN_TONES = ['#f6d7c3', '#e9bf9b', '#d19f78', '#ad7850', '#87583a', '#5c3a26'] as const;
/** Ten hair styles. `beanie` is a plain knit cap (neutral, non-religious headwear). */
export const HAIR_STYLES = ['bald', 'buzz', 'short', 'sidePart', 'curly', 'long', 'bob', 'bun', 'spiky', 'beanie'] as const;
export const HAIR_COLORS = [
  { id: 'black', hex: '#1f1a17' }, { id: 'darkBrown', hex: '#4a2f1f' }, { id: 'chestnut', hex: '#7c4a28' },
  { id: 'auburn', hex: '#a3452a' }, { id: 'blonde', hex: '#d9b45c' }, { id: 'teal', hex: '#2fb3a5' },
] as const;
export const EYES = ['dot', 'round', 'almond', 'sleepy', 'wide'] as const;
export const BROWS = ['straight', 'arched', 'thick', 'angled'] as const;
export const NOSES = ['button', 'line', 'pointed', 'round'] as const;
export const FACIAL_HAIR = ['none', 'stubble', 'mustache', 'beard'] as const;
export const GLASSES = ['none', 'round', 'square'] as const;
/** Clothing base colours (the outfit *style* comes from the engine state). */
export const TOP_COLORS = ['#3d6fd6', '#d6493d', '#3f9a5c', '#8a55c9', '#e0a92e', '#4a5160'] as const;

export interface Look {
  face: number; skin: number; hair: number; hairColor: number; eyes: number; brows: number; nose: number;
  facial: number; glasses: number; top: number;
}
export type LookPart = keyof Look;

const SIZES: Record<LookPart, number> = {
  face: FACE_SHAPES.length, skin: SKIN_TONES.length, hair: HAIR_STYLES.length, hairColor: HAIR_COLORS.length,
  eyes: EYES.length, brows: BROWS.length, nose: NOSES.length, facial: FACIAL_HAIR.length, glasses: GLASSES.length,
  top: TOP_COLORS.length,
};
export const LOOK_PARTS = Object.keys(SIZES) as LookPart[];
export const partCount = (p: LookPart): number => SIZES[p];

/** The parts the Client File exposes with ‹ › arrows (07 §2.3.2 character creation). */
export const EDITABLE_PARTS = ['hair', 'hairColor', 'skin', 'face', 'glasses', 'facial'] as const satisfies readonly LookPart[];

export type Mood = 'neutral' | 'happy' | 'smug' | 'shock' | 'sad' | 'dead';
/** Top styles; chosen from the engine's job / age (`outfitFor`). */
export type TopStyle = 'hoodie' | 'tee' | 'collar' | 'tie' | 'blazer' | 'apron' | 'vest' | 'headset' | 'cardigan';

// ── seeded PRNG ─────────────────────────────────────────────────────────────
export function hashSeed(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}

export function seededRng(seed: string): () => number {
  let a = hashSeed(seed) || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic look from a seed string. Facial hair and glasses are rarer than "none". */
export function generateLook(seed: string): Look {
  const r = seededRng(`look:${seed}`);
  const pick = (n: number) => Math.floor(r() * n);
  const face = pick(SIZES.face), skin = pick(SIZES.skin), hair = pick(SIZES.hair);
  // Natural colours are 6× likelier than the dyed teal.
  const hairColor = r() < 0.12 ? 5 : pick(5);
  const eyes = pick(SIZES.eyes), brows = pick(SIZES.brows), nose = pick(SIZES.nose);
  const facial = r() < 0.6 ? 0 : 1 + pick(3);
  const glasses = r() < 0.65 ? 0 : 1 + pick(2);
  const top = pick(SIZES.top);
  return { face, skin, hair, hairColor, eyes, brows, nose, facial, glasses, top };
}

/** Step one part forward / back (wraps). Returns a new object. */
export function cyclePart(look: Look, part: LookPart, dir: 1 | -1): Look {
  const n = SIZES[part];
  return { ...look, [part]: (((look[part] + dir) % n) + n) % n };
}

/** Clamp foreign / stale data into a valid look (e.g. a look kept from an older build). */
export function normalizeLook(look: Partial<Look>, fallbackSeed = 'fallback'): Look {
  const base = generateLook(fallbackSeed);
  const out = { ...base };
  for (const p of LOOK_PARTS) {
    const v = look[p];
    if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < SIZES[p]) out[p] = v;
  }
  return out;
}

/** Stable name of a part's current value (`hair` → 'curly'), used by the roast picker and tests. */
export function partValue(look: Look, part: LookPart): string {
  switch (part) {
    case 'face': return FACE_SHAPES[look.face]!;
    case 'skin': return `tone${look.skin + 1}`;
    case 'hair': return HAIR_STYLES[look.hair]!;
    case 'hairColor': return HAIR_COLORS[look.hairColor]!.id;
    case 'eyes': return EYES[look.eyes]!;
    case 'brows': return BROWS[look.brows]!;
    case 'nose': return NOSES[look.nose]!;
    case 'facial': return FACIAL_HAIR[look.facial]!;
    case 'glasses': return GLASSES[look.glasses]!;
    case 'top': return `color${look.top + 1}`;
  }
}

// ── engine-derived: outfit + aging ──────────────────────────────────────────
/** Minimal slice of the engine's LifeState the outfit depends on (kept structural so tests need no engine). */
export interface OutfitInput { job: { title: string; tier: number } | null; age: number }

/** Career → clothes (D-067 status): jobless → hoodie, café → apron, courier → hi-vis vest, call centre → headset,
 *  office → collar (tier ≥ 2 → tie), retired / 65+ → cardigan. Unknown titles fall back on the tier. */
export function outfitFor({ job, age }: OutfitInput): TopStyle {
  if (!job) return age >= 65 ? 'cardigan' : 'hoodie';
  switch (job.title) {
    case 'emekli': return 'cardigan';
    case 'kafe': return 'apron';
    case 'kurye': return 'vest';
    case 'cagri': return 'headset';
    case 'ofis': return job.tier >= 2 ? 'tie' : 'collar';
    default: return job.tier >= 3 ? 'tie' : job.tier >= 2 ? 'blazer' : 'collar';
  }
}

export interface Aging {
  /** 0..1 share of gray in the hair (starts at ~45, full white by ~78). */
  gray: number;
  /** 0 none · 1 forehead line (40+) · 2 + crow's feet (55+) · 3 + smile lines (65+). */
  wrinkles: 0 | 1 | 2 | 3;
  /** Eye bags from 40. */
  bags: boolean;
  /** 0..1 face sag + posture drop from 65. */
  sag: number;
}

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

export function agingFor(age: number): Aging {
  const gray = clamp01((age - 45) / 33);
  const wrinkles = age >= 65 ? 3 : age >= 55 ? 2 : age >= 40 ? 1 : 0;
  return { gray, wrinkles, bags: age >= 40, sag: clamp01((age - 65) / 15) };
}

// ── colour helpers (integer-free is fine here: this is UI, not the engine) ───
function toRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function toHex([r, g, b]: [number, number, number]): string {
  const c = (x: number) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}
export function mixHex(a: string, b: string, t: number): string {
  const x = toRgb(a), y = toRgb(b);
  return toHex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]);
}
/** f < 1 darkens, f > 1 lightens (towards white). */
export function shadeHex(hex: string, f: number): string {
  if (f <= 1) { const [r, g, b] = toRgb(hex); return toHex([r * f, g * f, b * f]); }
  return mixHex(hex, '#ffffff', f - 1);
}
/** Desaturate towards luminance gray (t = 1 → fully gray). */
export function desatHex(hex: string, t: number): string {
  if (t <= 0) return hex;
  const [r, g, b] = toRgb(hex);
  const l = 0.3 * r + 0.59 * g + 0.11 * b;
  return toHex([r + (l - r) * t, g + (l - g) * t, b + (l - b) * t]);
}

const GRAY_MID = '#9c9a94', GRAY_WHITE = '#e8e6df';
/** Hair colour after aging: base → salt-and-pepper → white. */
export function hairHex(look: Look, age: number): string {
  const base = HAIR_COLORS[look.hairColor]!.hex;
  const g = agingFor(age).gray;
  if (g <= 0) return base;
  return g < 0.6 ? mixHex(base, GRAY_MID, g / 0.6) : mixHex(GRAY_MID, GRAY_WHITE, (g - 0.6) / 0.4);
}
