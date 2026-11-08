/**
 * NPC faces: the same generator as the player, seeded by the NPC id (engine speaker id: `mom`, `roommate`,
 * `npc:courier` …). A few traits are pinned per recurring character so they stay recognisable across lives
 * (Anne's bun, Dayı's moustache, Nevin Hanım's glasses …); the rest — skin, eyes, nose, colours — is seeded.
 * Pamuk (`cat`) is drawn by CatSprite, not by the face generator.
 */
import { generateLook, HAIR_STYLES, FACIAL_HAIR, GLASSES } from './look';
import type { Look, Mood, TopStyle } from './look';

type Hair = (typeof HAIR_STYLES)[number];
type Facial = (typeof FACIAL_HAIR)[number];
type Glasses = (typeof GLASSES)[number];

interface NpcSpec {
  hair?: Hair[]; facial?: Facial; glasses?: Glasses; outfit: TopStyle;
  /** Age relative to the player (clamped to [minAge, 95]). */
  ageOffset: number; minAge?: number;
}

/** Recurring cast (07 / 01 karakterler): Anne, Dayı, Barış, Nevin Hanım, Yağmur, Şükran Teyze … */
const SPECS: Record<string, NpcSpec> = {
  mom: { hair: ['bun', 'bob', 'short'], facial: 'none', outfit: 'cardigan', ageOffset: 27 },
  uncle: { hair: ['bald', 'buzz'], facial: 'mustache', outfit: 'collar', ageOffset: 31 },
  roommate: { hair: ['curly', 'spiky', 'beanie'], facial: 'stubble', glasses: 'none', outfit: 'hoodie', ageOffset: 1 },
  boss: { hair: ['bob', 'bun'], facial: 'none', glasses: 'square', outfit: 'blazer', ageOffset: 22, minAge: 40 },
  partner: { hair: ['long', 'bob', 'curly'], facial: 'none', outfit: 'tee', ageOffset: 0 },
  ex: { hair: ['sidePart', 'short', 'spiky'], outfit: 'tee', ageOffset: 1 },
  neighbor: { hair: ['short', 'bun'], facial: 'none', glasses: 'round', outfit: 'cardigan', ageOffset: 44, minAge: 62 },
  cabbie: { hair: ['buzz', 'short'], facial: 'mustache', outfit: 'collar', ageOffset: 28 },
  child: { facial: 'none', glasses: 'none', outfit: 'tee', ageOffset: -25, minAge: 6 },
  sibling: { facial: 'none', outfit: 'hoodie', ageOffset: -3, minAge: 14 },
  'npc:courier': { outfit: 'vest', ageOffset: 4 },
  'npc:boilerTech': { hair: ['bald', 'buzz'], facial: 'mustache', outfit: 'vest', ageOffset: 30 },
  'npc:landlord': { glasses: 'square', outfit: 'cardigan', ageOffset: 38, minAge: 55 },
  'npc:hr': { facial: 'none', outfit: 'blazer', ageOffset: 10 },
  'npc:doctor': { glasses: 'round', outfit: 'collar', ageOffset: 20 },
  'npc:clerk': { glasses: 'square', outfit: 'collar', ageOffset: 26 },
  'npc:stranger': { outfit: 'tee', ageOffset: 8 },
  'npc:barber': { facial: 'beard', outfit: 'apron', ageOffset: 18 },
  'npc:coworker': { outfit: 'headset', ageOffset: 3 },
  'npc:neighborKid': { facial: 'none', glasses: 'none', outfit: 'tee', ageOffset: -10, minAge: 9 },
  'npc:waiter': { outfit: 'apron', ageOffset: 2 },
  'npc:banker': { outfit: 'tie', ageOffset: 14 },
};

const FALLBACK: NpcSpec = { outfit: 'tee', ageOffset: 6 };

export interface NpcFace { look: Look; age: number; outfit: TopStyle; isCat: boolean }

const cache = new Map<string, Look>();

export function npcLook(id: string): Look {
  const hit = cache.get(id);
  if (hit) return hit;
  const spec = SPECS[id] ?? FALLBACK;
  const look = generateLook(`npc:${id}`);
  if (spec.hair) look.hair = HAIR_STYLES.indexOf(spec.hair[look.eyes % spec.hair.length]!);
  if (spec.facial) look.facial = FACIAL_HAIR.indexOf(spec.facial);
  if (spec.glasses) look.glasses = GLASSES.indexOf(spec.glasses);
  // Teal dye stays a player-only choice; the cast keeps natural colours.
  if (look.hairColor === 5) look.hairColor = look.face % 5;
  cache.set(id, look);
  return look;
}

export function npcFace(id: string, playerAge: number): NpcFace {
  const spec = SPECS[id] ?? FALLBACK;
  const age = Math.max(spec.minAge ?? 18, Math.min(95, playerAge + spec.ageOffset));
  return { look: npcLook(id), age, outfit: spec.outfit, isCat: id === 'cat' };
}

/** Content bubbles carry an `avatar` expression (neutral / happy / smug / worried / tired) → face mood. */
export function npcMood(avatar: string | undefined): Mood {
  switch (avatar) {
    case 'happy': return 'happy';
    case 'smug': return 'smug';
    case 'worried': return 'sad';
    case 'shock': case 'shocked': return 'shock';
    default: return 'neutral';
  }
}
