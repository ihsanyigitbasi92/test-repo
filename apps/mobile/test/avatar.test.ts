import { describe, expect, it } from 'vitest';
import {
  agingFor, cyclePart, desatHex, EDITABLE_PARTS, generateLook, hairHex, HAIR_STYLES, LOOK_PARTS, normalizeLook, outfitFor, partCount, partValue,
  SKIN_TONES, FACE_SHAPES, HAIR_COLORS, EYES, BROWS, NOSES, FACIAL_HAIR, GLASSES,
} from '../src/avatar/look';
import { npcFace, npcLook, npcMood } from '../src/avatar/npcs';
import {
  emptyMomentHistory, lifeChange, momentAllowed, momentCandidates, outcomeMood, pickMoment, recordMoment, MOMENT_COOLDOWN_YEARS, MOMENT_GAP_DAYS,
} from '../src/avatar/moments';
import { pickLookRoast } from '../src/avatar/roast';
import { tr } from '../src/i18n/tr';
import { en } from '../src/i18n/en';

describe('look generator', () => {
  it('has the specified part counts', () => {
    expect(FACE_SHAPES).toHaveLength(4);
    expect(SKIN_TONES).toHaveLength(6);
    expect(HAIR_STYLES).toHaveLength(10);
    expect(HAIR_COLORS).toHaveLength(6);
    expect(EYES).toHaveLength(5);
    expect(BROWS).toHaveLength(4);
    expect(NOSES).toHaveLength(4);
    expect(FACIAL_HAIR).toHaveLength(4);
    expect(GLASSES).toHaveLength(3);
  });

  it('is deterministic per seed and varies across seeds', () => {
    expect(generateLook('L-abc')).toEqual(generateLook('L-abc'));
    const looks = new Set(Array.from({ length: 50 }, (_, i) => JSON.stringify(generateLook(`seed-${i}`))));
    expect(looks.size).toBeGreaterThan(45);
  });

  it('always yields in-range parts and covers every value over many seeds', () => {
    const seen: Record<string, Set<number>> = Object.fromEntries(LOOK_PARTS.map((p) => [p, new Set<number>()]));
    for (let i = 0; i < 3000; i++) {
      const l = generateLook(`s${i}`);
      for (const p of LOOK_PARTS) {
        expect(l[p]).toBeGreaterThanOrEqual(0);
        expect(l[p]).toBeLessThan(partCount(p));
        seen[p]!.add(l[p]);
      }
    }
    for (const p of LOOK_PARTS) expect(seen[p]!.size).toBe(partCount(p));
  });

  it('cycles parts with wrap-around and leaves the rest alone', () => {
    const l = generateLook('x');
    for (const p of EDITABLE_PARTS) {
      let c = l;
      for (let k = 0; k < partCount(p); k++) c = cyclePart(c, p, 1);
      expect(c).toEqual(l);
      const back = cyclePart(l, p, -1);
      expect(back[p]).toBe((l[p] - 1 + partCount(p)) % partCount(p));
      expect({ ...back, [p]: l[p] }).toEqual(l);
    }
  });

  it('normalizes bad data', () => {
    const l = normalizeLook({ hair: 99, skin: 2, eyes: -1 } as never, 'f');
    expect(l.skin).toBe(2);
    expect(l.hair).toBeLessThan(HAIR_STYLES.length);
    expect(l.eyes).toBeGreaterThanOrEqual(0);
  });
});

describe('aging + outfit (derived from engine state)', () => {
  it('grays from ~45, wrinkles from 40, sag from 65', () => {
    expect(agingFor(30)).toEqual({ gray: 0, wrinkles: 0, bags: false, sag: 0 });
    expect(agingFor(44).gray).toBe(0);
    expect(agingFor(40).wrinkles).toBe(1);
    expect(agingFor(40).bags).toBe(true);
    expect(agingFor(50).gray).toBeGreaterThan(0);
    expect(agingFor(57).wrinkles).toBe(2);
    expect(agingFor(64).sag).toBe(0);
    expect(agingFor(70).sag).toBeGreaterThan(0);
    expect(agingFor(70).wrinkles).toBe(3);
    expect(agingFor(90)).toMatchObject({ gray: 1, sag: 1 });
    const l = { ...generateLook('g'), hairColor: 0 };
    expect(hairHex(l, 30)).toBe(HAIR_COLORS[0].hex);
    expect(hairHex(l, 60)).not.toBe(HAIR_COLORS[0].hex);
    expect(hairHex(l, 95)).toBe('#e8e6df');
  });

  it('maps careers to outfits', () => {
    expect(outfitFor({ job: null, age: 20 })).toBe('hoodie');
    expect(outfitFor({ job: null, age: 70 })).toBe('cardigan');
    expect(outfitFor({ job: { title: 'kafe', tier: 1 }, age: 22 })).toBe('apron');
    expect(outfitFor({ job: { title: 'kurye', tier: 1 }, age: 22 })).toBe('vest');
    expect(outfitFor({ job: { title: 'cagri', tier: 1 }, age: 22 })).toBe('headset');
    expect(outfitFor({ job: { title: 'ofis', tier: 1 }, age: 22 })).toBe('collar');
    expect(outfitFor({ job: { title: 'ofis', tier: 2 }, age: 30 })).toBe('tie');
    expect(outfitFor({ job: { title: 'emekli', tier: 2 }, age: 66 })).toBe('cardigan');
  });

  it('desaturates to gray', () => {
    const g = desatHex('#ff0000', 1);
    expect(g.slice(1, 3)).toBe(g.slice(3, 5));
    expect(desatHex('#123456', 0)).toBe('#123456');
  });
});

describe('NPC faces', () => {
  it('are stable per NPC id and keep signature traits', () => {
    expect(npcLook('mom')).toEqual(npcLook('mom'));
    expect(partValue(npcLook('uncle'), 'facial')).toBe('mustache');
    expect(partValue(npcLook('boss'), 'glasses')).toBe('square');
    expect(partValue(npcLook('mom'), 'facial')).toBe('none');
    expect(npcFace('neighbor', 18).age).toBeGreaterThanOrEqual(62);
    expect(npcFace('mom', 30).age).toBe(57);
    expect(npcFace('cat', 30).isCat).toBe(true);
    expect(npcFace('npc:courier', 20).outfit).toBe('vest');
    for (const id of ['mom', 'uncle', 'roommate', 'boss', 'partner', 'neighbor', 'npc:whatever']) expect(partValue(npcLook(id), 'hairColor')).not.toBe('teal');
  });
  it('maps content avatar expressions', () => {
    expect(npcMood('worried')).toBe('sad');
    expect(npcMood('smug')).toBe('smug');
    expect(npcMood(undefined)).toBe('neutral');
  });
});

describe('family resemblance', () => {
  it('kin follow the player skin (±1) and natural hair colour; non-kin stay seeded by id', () => {
    const fair = { ...generateLook('p1'), skin: 0, hairColor: 4 };
    const deep = { ...generateLook('p1'), skin: 5, hairColor: 5 };
    for (const id of ['mom', 'uncle', 'sibling', 'child']) {
      expect(npcLook(id, fair).skin).toBeLessThanOrEqual(1);
      expect(partValue(npcLook(id, fair), 'hairColor')).toBe('blonde');
      expect(npcLook(id, deep).skin).toBeGreaterThanOrEqual(4);
      expect(partValue(npcLook(id, deep), 'hairColor')).toBe('darkBrown');   // teal dye → dark brown
      expect(partValue(npcLook(id, deep), 'facial')).toBe(partValue(npcLook(id), 'facial'));   // pinned traits kept
    }
    expect(npcLook('boss', fair)).toEqual(npcLook('boss', deep));
    expect(npcFace('mom', 30, fair).look.skin).toBeLessThanOrEqual(1);
  });
});

describe('moments', () => {
  it('global gap + per-kind cooldowns, death and legendary exempt', () => {
    const h = recordMoment(emptyMomentHistory(), 'promotion', { shownDays: 5, age: 20 });
    expect(momentAllowed('birthday', { shownDays: 10, age: 21 }, h)).toBe(false);
    expect(momentAllowed('birthday', { shownDays: 5 + MOMENT_GAP_DAYS, age: 23 }, h)).toBe(true);
    expect(momentAllowed('death', { shownDays: 6, age: 20 }, h)).toBe(true);
    expect(momentAllowed('legendary', { shownDays: 6, age: 20 }, h)).toBe(true);
    // same kind again: blocked by its own cooldown even after the global gap
    expect(momentAllowed('promotion', { shownDays: 5 + MOMENT_GAP_DAYS, age: 21 }, h)).toBe(false);
    expect(momentAllowed('promotion', { shownDays: 5 + MOMENT_GAP_DAYS, age: 20 + MOMENT_COOLDOWN_YEARS.promotion }, h)).toBe(true);
    const fresh = emptyMomentHistory();
    expect(pickMoment(['wagerWin', 'birthday'], { shownDays: 100, age: 30 }, fresh)).toBe('birthday');
    expect(pickMoment(['wagerWin', 'death'], { shownDays: 6, age: 20 }, h)).toBe('death');
    expect(pickMoment(['wagerWin'], { shownDays: 6, age: 20 }, h)).toBeNull();
  });
  it('per-life caps on the life-event kinds', () => {
    const h = emptyMomentHistory();
    let day = 0, age = 18;
    for (let i = 0; i < 6; i++) { day += 100; age += 15; if (momentAllowed('wagerWin', { shownDays: day, age }, h)) recordMoment(h, 'wagerWin', { shownDays: day, age }); }
    expect(h.count.wagerWin).toBe(2);
  });
  it('only milestone birthdays become a candidate', () => {
    const sig = { death: false, legendary: false, career: null, wagerWin: false };
    expect(momentCandidates({ ...sig, birthdayAge: 31 })).toEqual([]);
    expect(momentCandidates({ ...sig, birthdayAge: 40 })).toEqual(['birthday']);
  });
  it('detects career / love transitions', () => {
    const base = { job: null, partner: null };
    expect(lifeChange(null, base)).toBeNull();
    expect(lifeChange(base, { job: { title: 'kafe', tier: 1 }, partner: null })).toEqual({ kind: 'promotion', reason: 'newJob' });
    expect(lifeChange({ job: { title: 'ofis', tier: 1 }, partner: null }, { job: { title: 'ofis', tier: 2 }, partner: null })).toEqual({ kind: 'promotion', reason: 'promotion' });
    expect(lifeChange({ job: { title: 'ofis', tier: 2 }, partner: null }, { job: { title: 'emekli', tier: 2 }, partner: null })).toEqual({ kind: 'promotion', reason: 'retired' });
    expect(lifeChange({ job: { title: 'ofis', tier: 1 }, partner: null }, base)).toEqual({ kind: 'sad', reason: 'fired' });
    expect(lifeChange({ job: null, partner: { npc: 'partner', since: 3 } }, base)).toEqual({ kind: 'sad', reason: 'breakup' });
    expect(lifeChange(base, base)).toBeNull();
  });
  it('turns outcome deltas into a face', () => {
    expect(outcomeMood([{ stat: 'joy', delta: 300 }, { stat: 'money', delta: 2000 }])).toBe('happy');
    expect(outcomeMood([{ stat: 'momPressure', delta: 800 }])).toBe('sad');
    expect(outcomeMood([{ stat: 'cringe', delta: -500 }])).toBe('happy');
    expect(outcomeMood([{ stat: 'ego', delta: 500 }])).toBeNull();
    expect(outcomeMood([])).toBeNull();
  });
});

describe('look roast', () => {
  const known = (k: string) => k in tr.lookRoast;
  it('reacts to the changed part, never to skin or face shape', () => {
    const l = { ...generateLook('r'), hairColor: 5 };
    expect(pickLookRoast(l, 'hairColor', known, tr.lookRoastGeneric.length)).toBe('hairColor.teal');
    expect(tr.lookRoast['hairColor.teal']).toBe('Bu saçla mülakata mı? Cesur.');
    expect(pickLookRoast(l, 'skin', known, tr.lookRoastGeneric.length)).toMatch(/^generic:/);
    expect(pickLookRoast(l, 'face', known, tr.lookRoastGeneric.length)).toMatch(/^generic:/);
    expect(pickLookRoast(l, null, known, tr.lookRoastGeneric.length)).toBe('hairColor.teal');
  });
  it('has TR and EN lines for the same keys', () => {
    expect(Object.keys(en.lookRoast).sort()).toEqual(Object.keys(tr.lookRoast).sort());
    expect(en.lookRoastGeneric).toHaveLength(tr.lookRoastGeneric.length);
    for (const k of Object.keys(tr.lookRoast)) expect(k).not.toMatch(/^(skin|face)\./);
  });
});
