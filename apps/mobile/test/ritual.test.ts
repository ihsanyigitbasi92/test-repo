/**
 * Yearly ritual pools (engine ReportCardData.ritual) must match TUNING.ritual exactly, per locale and band;
 * the TR number-suffix helper; player name pools free of canon NPC names.
 */
import { describe, expect, it } from 'vitest';
import { TUNING, bandFor } from '@motto/engine';
import type { Locale } from '@motto/engine';
import { CATALOG, mottoLine } from '../src/i18n';
import { RAW_ID } from '../src/i18n/labels';
import { sfx } from '../src/i18n/trSuffix';

const LOCALES: Locale[] = ['tr', 'en'];
const RT = TUNING.ritual as unknown as Record<string, number>;
const BANDS = [...new Set(Array.from({ length: 100 }, (_, i) => bandFor(18 + i).name))];
/** Every key the engine can pick a motto pool for (pickRitual: dominant pattern | good | bad | none). */
const MOTTO_KEYS = [...Object.keys(CATALOG.tr.pattern), 'good', 'bad', 'none'];

describe('ritual pools = TUNING.ritual', () => {
  it('engine bands are the four the catalog knows', () => {
    expect(BANDS.sort()).toEqual(['overtime', 'season', 'secondHalf', 'warmup']);
  });
  for (const locale of LOCALES) {
    const s = CATALOG[locale];
    it(`birthday lines per band (${locale})`, () => {
      for (const b of BANDS) {
        expect(s.birthdayLines[b]?.length, b).toBe(RT.birthdayVariants);
        for (let i = 0; i < RT.birthdayVariants!; i++) {
          const line = s.birthdayLine(37, b, i);
          expect(line).toContain('37');
          expect(line).not.toMatch(RAW_ID);
        }
      }
      expect(new Set(BANDS.flatMap((b) => s.birthdayLines[b]!.map((f) => f(30)))).size).toBe(BANDS.length * RT.birthdayVariants!);
    });
    it(`motto pools (${locale})`, () => {
      for (const k of MOTTO_KEYS) {
        expect(s.motto[k]?.length, k).toBe(RT.mottoVariants);
        expect(new Set(s.motto[k]).size, k).toBe(RT.mottoVariants);
      }
      expect(mottoLine(s, 'patience', 2)).toBe(s.motto.patience![2]);
      expect(mottoLine(s, 'unknownKey', 0)).toBe(s.motto.none![0]);
    });
    it(`no-envelope / no-wager pools (${locale})`, () => {
      expect(s.noEnvelope.length).toBe(RT.noEnvelopeVariants);
      expect(new Set(s.noEnvelope).size).toBe(RT.noEnvelopeVariants);
      for (let i = 0; i < RT.noWagerVariants!; i++) expect(s.coachAccuracy(0, 0, i)).toBeTruthy();
      expect(new Set(Array.from({ length: RT.noWagerVariants! }, (_, i) => s.coachAccuracy(0, 0, i))).size).toBe(RT.noWagerVariants);
      expect(s.coachAccuracy(2, 5, 3)).toContain('2/5');
    });
  }
});

describe('Turkish number suffixes', () => {
  it('inflect by how the number is read', () => {
    expect(sfx(39, 'ydi')).toBe("39'du");
    expect(sfx(41, 'ydi')).toBe("41'di");
    expect(sfx(45, 'ydi')).toBe("45'ti");
    expect(sfx(40, 'ydi')).toBe("40'tı");
    expect(sfx(100, 'ydi')).toBe("100'dü");
    expect(sfx(6, 'ydi')).toBe("6'ydı");
    expect(CATALOG.tr.rightMomentLine(296, 39)).toContain("%39'du");
  });
});

describe('player name pools', () => {
  // Canon NPC first names in the content (roommate, partner, colleagues) — a player must not share one.
  const NPC = { tr: ['Barış', 'Selin', 'Kerem', 'Ece', 'Mert', 'Onur', 'Nevin'], en: ['Jordan', 'Sam', 'Morgan', 'Riley', 'Casey'] };
  for (const locale of LOCALES) {
    it(`no NPC first names (${locale})`, () => {
      const first = CATALOG[locale].names.map(([n]) => n.split(' ')[0]!);
      const speakers = Object.values(CATALOG[locale].speaker).map((x) => x.toLowerCase());
      for (const f of first) {
        expect(NPC[locale], f).not.toContain(f);
        expect(speakers, f).not.toContain(f.toLowerCase());
      }
    });
  }
  it('same length in both catalogs (index survives a language switch)', () => {
    expect(CATALOG.tr.names.length).toBe(CATALOG.en.names.length);
  });
});
