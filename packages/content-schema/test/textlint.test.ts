import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import {
  blankQuoted, buildNameMatcher, compileTypos, enTrNameHits, fixSuffix, harvestTrNames, isPersona, lastSpokenWord,
  rawIdHits, trSuffixHits, typoHits,
} from '../scripts/textlint-rules';

const pkg = join(import.meta.dirname, '..');

describe('textlint rules', () => {
  it('raw-id: flags snake_case / camelCase ids, passes quoted file names and files with extensions', () => {
    expect(rawIdHits('Kedi: Pamuk · aile_yuzugu').map((h) => h.match)).toEqual(['aile_yuzugu']);
    expect(rawIdHits('Job: boilerTech').map((h) => h.match)).toEqual(['boilerTech']);
    expect(rawIdHits("Klasörde 'son_son' ve \"final_final\" var.")).toEqual([]);
    expect(rawIdHits('Ek: degerlendirme_FINAL_son2.pdf')).toEqual([]);
    expect(rawIdHits('Sayaç: {n}. iPhone yok.')).toEqual([]);
    expect(blankQuoted("Barış'ın 'x_y' dosyası")).toBe("Barış'ın       dosyası");
  });

  it('tr-suffix: reads the number aloud and checks harmony, d/t and buffer letters', () => {
    expect(lastSpokenWord('39')).toBe('dokuz');
    expect(lastSpokenWord('2.400')).toBe('yüz');
    expect(lastSpokenWord('100.000')).toBe('bin');
    expect(lastSpokenWord('1.000.000')).toBe('milyon');
    expect(lastSpokenWord('11:53')).toBe('üç');
    expect(lastSpokenWord('09:00')).toBe('dokuz');
    expect(lastSpokenWord('3,5')).toBe('beş');
    expect(fixSuffix('dokuz', 'ti')).toBe('du');      // %39'du
    expect(fixSuffix('kırk', 'ti')).toBe('tı');       // %40'tı
    expect(fixSuffix('bir', 'ti')).toBe('di');
    expect(fixSuffix('üç', 'de')).toBe('te');
    expect(fixSuffix('üç', 'ydı')).toBe('tü');
    expect(fixSuffix('iki', 'e')).toBe('ye');
    expect(fixSuffix('iki', 'in')).toBe('nin');
    expect(fixSuffix('beş', 'ten')).toBeNull();
    expect(fixSuffix('dokuz', 'daki')).toBeNull();
    expect(trSuffixHits("Oran %39'ti. Oran %41'ti. Oran %45'ti.").map((h) => h.match)).toEqual(["%39'ti", "%41'ti"]);
    expect(trSuffixHits("3'de geldi, 3'te gitti, 2.400'ü verdi, 22.50'de bitti.").map((h) => h.match)).toEqual(["3'de"]);
  });

  it('en-tr-name: Turkish names/words in EN, case-sensitive names, allow-list', () => {
    const names = new Set(['Pamuk', 'Nermin', 'Deniz', ...harvestTrNames('Saadet Teyze geldi. Sabri Amca da.')]);
    const m = buildNameMatcher(names, ['Teyze']);
    expect(enTrNameHits("Nermin came prepared. Pamuk's bowl.", m).map((h) => h.match)).toEqual(['Nermin', 'Pamuk']);
    expect(enTrNameHits('ECE & DENIZ — RSVP CARD (fictional)', m).map((h) => h.match)).toEqual(['DENIZ']);
    expect(enTrNameHits('Mr. Sabri and Saadet Teyze', m).map((h) => h.match).sort()).toEqual(['Saadet', 'Sabri', 'Teyze']);
    expect(enTrNameHits('Nermin, on purpose.', m, new Set(['Nermin']))).toEqual([]);
    expect(enTrNameHits('Biscuit and Mrs. Dale, by the sea (deniz).', m)).toEqual([]);
  });

  it('typo: listed misspellings, quoted ones are deliberate', () => {
    const t = compileTypos([['değişildi', 'değişti', 'tr'], ['recieve', 'receive', 'en']]);
    expect(typoHits('numaralar değişildi.', 'tr', t)).toHaveLength(1);
    expect(typoHits("There's a typo: 'recieve.'", 'en', t)).toHaveLength(0);
    expect(typoHits('I recieve mail', 'en', t)).toHaveLength(1);
  });

  it('persona markers', () => {
    expect(isPersona('Seminerde buna sinerji derdik.', '')).toBe(true);
    expect(isPersona('', "I'd pick the money. Your call.")).toBe(true);
    expect(isPersona('Kol çalışıyor.', 'The arm works.')).toBe(false);
  });

  it('the shipped fixtures pass textlint', () => {
    const r = spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings', '--import', './scripts/ts-register.mjs', 'scripts/textlint.ts'], { cwd: pkg, encoding: 'utf8' });
    expect(r.status, r.stderr).toBe(0);
    expect(r.stdout).toMatch(/0 hata/);
  }, 180_000);
});
