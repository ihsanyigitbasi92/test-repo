/**
 * Sound effects (docs/design/16-ses-efektleri.md): the event → sound mapping, the manager's rules (rate limit, mute
 * persistence, background, no backend) and the generated files (deterministic, valid WAV, within the size cap).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { emptyMeta, step } from '@motto/engine';
import type { Effect, LifeState } from '@motto/engine';
import { BASE_BUNDLE } from '../src/content/bundle';
import { EFFECT_SFX, MOMENT_SFX, SFX, SFX_CORE, SFX_NAMES, UI_SFX, isGrief, isMilestone, sfxFiles, sfxForCard, sfxForChoice, sfxForFlow, sfxForOutcome, sfxForStamp } from '../src/state/sfx';
import type { SfxName } from '../src/state/sfx';
import { AMBIENT_BUDGET, DEFAULT_PREFS, SOUND_PREFS_KEY, SoundManager, decodePrefs } from '../src/state/soundCore';
import type { AudioBackend, SoundKV } from '../src/state/soundCore';
import { MAX_BYTES, PEAK_DBFS, SOUNDS, SR, analyze, renderAll, sha256 } from '../scripts/gen-sfx.mjs';

const APP = join(dirname(fileURLToPath(import.meta.url)), '..');
const SFX_DIR = join(APP, 'assets', 'sfx');

function fakeBackend() {
  const played: { key: string; volume: number }[] = [];
  const calls = { stopAll: 0, active: [] as boolean[], preload: [] as string[] };
  const backend: AudioBackend = {
    preload: (keys) => { calls.preload.push(...keys); },
    play: (key, volume) => { played.push({ key, volume }); },
    stopAll: () => { calls.stopAll++; },
    setActive: (a) => { calls.active.push(a); },
  };
  return { backend, played, calls };
}
function memKV(init: Record<string, string> = {}): SoundKV & { data: Map<string, string> } {
  const data = new Map(Object.entries(init));
  return { data, read: async (k) => data.get(k) ?? null, write: async (k, v) => { data.set(k, v); return true; } };
}
async function ready(o: { kv?: SoundKV; backend?: AudioBackend | null; random?: () => number } = {}) {
  const clock = { t: 10_000 };
  const fb = fakeBackend();
  const m = new SoundManager({ backend: o.backend === undefined ? fb.backend : o.backend, kv: o.kv ?? memKV(), now: () => clock.t, random: o.random ?? (() => 0) });
  await m.init();
  return { m, clock, ...fb };
}

describe('sound mapping', () => {
  const ALL_KINDS: Effect['kind'][] = ['SHOW_DAY', 'SHOW_DIALOG', 'STAMP', 'FLOAT_NUM', 'REPORT_CARD', 'DEATH', 'NOTIFY_PLAN', 'HAPTIC', 'SESSION_END_SUGGESTED'];

  it('covers every effect kind the engine emits', () => {
    const seen = new Set<string>();
    for (const seed of ['sfx-1', 'sfx-2', 'sfx-3']) {
      let r = step(null as unknown as LifeState, emptyMeta(), { type: 'START_LIFE', seed, name: 'Deniz', locale: 'tr', fastLife: true }, BASE_BUNDLE);
      for (let i = 0; i < 1500 && r.state.phase !== 'dead'; i++) {
        const st = r.state;
        if (i % 97 === 5) step(st, r.meta, { type: 'SESSION_END', reason: 'enough' }, BASE_BUNDLE).effects.forEach((e) => seen.add(e.kind));
        if (st.phase === 'day' && st.card) {
          const locked = st.card.choices.find((c) => c.locked);
          if (locked) step(st, r.meta, { type: 'ANSWER', eventId: st.card.eventId, choiceId: locked.id }, BASE_BUNDLE).effects.forEach((e) => seen.add(e.kind));
          r = step(st, r.meta, { type: 'ANSWER', eventId: st.card.eventId, choiceId: st.card.choices.find((c) => !c.locked)!.id }, BASE_BUNDLE);
        } else r = step(st, r.meta, { type: 'NEXT_DAY' }, BASE_BUNDLE);
        r.effects.forEach((e) => seen.add(e.kind));
      }
    }
    expect(seen.size).toBeGreaterThanOrEqual(5);
    for (const k of seen) expect(Object.keys(EFFECT_SFX), `effect kind ${k} has no mapping row`).toContain(k);
    expect(Object.keys(EFFECT_SFX).sort()).toEqual([...ALL_KINDS].sort());
  });

  it('only names sounds that exist, and leaves no sound unused', () => {
    const used = new Set<string>([...Object.values(EFFECT_SFX).flat(), ...Object.values(MOMENT_SFX).filter((x): x is SfxName => !!x), ...Object.values(UI_SFX)]);
    for (const n of used) expect(SFX_NAMES, n).toContain(n);
    for (const n of SFX_NAMES) expect([...used], `${n} is never played`).toContain(n);
    for (const n of SFX_CORE) expect(SFX_NAMES).toContain(n);
  });

  it('the voiced effect kinds are the ones useGame replays', () => {
    const src = readFileSync(join(APP, 'src', 'state', 'useGame.ts'), 'utf8');
    for (const [kind, names] of Object.entries(EFFECT_SFX)) {
      if (!names.length) continue;
      expect(src, kind).toMatch(new RegExp(`'${kind}'`));
      for (const n of names) expect(SFX[n].gain).toBeGreaterThan(0);
    }
  });

  it('day cards: the most specific cue wins, and stays inside the SHOW_DAY row', () => {
    const base = { variant: 'event', tags: ['is'], valence: 0, surpriseTier: null } as const;
    expect(sfxForCard(base)).toBe('card_slide');
    expect(sfxForCard({ ...base, variant: 'doc' })).toBe('paper_rustle');
    expect(sfxForCard({ ...base, variant: 'call' })).toBe('phone_ring');
    expect(sfxForCard({ ...base, variant: 'legend' })).toBe('legendary');
    expect(sfxForCard({ ...base, variant: 'surprise', surpriseTier: 'great' })).toBe('surprise_good');
    expect(sfxForCard({ ...base, valence: -2 })).toBe('bad_news');
    expect(sfxForCard({ ...base, tags: ['omen'] })).toBe('omen');
    // Grief beats everything, even a phone call or a legendary frame: near-silence.
    expect(sfxForCard({ ...base, variant: 'call', tags: ['loss:mom', 'veda_kayip'] })).toBe('grief');
    expect(sfxForCard({ ...base, variant: 'legend', tags: ['kayip'] })).toBe('grief');
    expect(isGrief(['kayip_esya'])).toBe(false);
    for (const variant of ['event', 'doc', 'legend', 'call', 'surprise', 'daily', 'forced'] as const) {
      for (const tags of [['is'], ['omen'], ['veda_kayip']]) for (const valence of [-2, 0, 2]) {
        expect(EFFECT_SFX.SHOW_DAY).toContain(sfxForCard({ variant, tags, valence, surpriseTier: null }));
      }
    }
  });

  it('every real loss / omen / milestone event in the content resolves to its cue', () => {
    let grief = 0;
    for (const e of BASE_BUNDLE.events) {
      const cue = sfxForCard({ variant: 'event', tags: e.tags, valence: e.valence, surpriseTier: null });
      if (e.tags.some((t) => t.startsWith('loss:'))) { expect(cue, e.id).toBe('grief'); grief++; }
      else if (e.tags.includes('omen')) expect(cue, e.id).toBe('omen');
      if (e.tags.some((t) => t.startsWith('milestone:'))) expect(isMilestone(e.tags), e.id).toBe(true);
    }
    expect(grief).toBeGreaterThanOrEqual(0);
  });

  it('outcomes: money first, then one tick for the net stat direction', () => {
    expect(sfxForOutcome([])).toEqual([]);
    expect(sfxForOutcome([{ stat: 'money', delta: 500 }])).toEqual(['money_gain']);
    expect(sfxForOutcome([{ stat: 'money', delta: -500 }, { stat: 'joy', delta: 300 }])).toEqual(['money_loss', 'stat_up']);
    expect(sfxForOutcome([{ stat: 'health', delta: 200 }, { stat: 'joy', delta: 300 }, { stat: 'brain', delta: 100 }, { stat: 'charm', delta: 50 }])).toEqual(['stat_up']);
    expect(sfxForOutcome([{ stat: 'joy', delta: -300 }, { stat: 'health', delta: -100 }])).toEqual(['stat_down']);
    // Mom pressure / cringe going UP is bad news; ego never ticks.
    expect(sfxForOutcome([{ stat: 'momPressure', delta: 400 }])).toEqual(['stat_down']);
    expect(sfxForOutcome([{ stat: 'cringe', delta: -400 }])).toEqual(['stat_up']);
    expect(sfxForOutcome([{ stat: 'ego', delta: 400 }])).toEqual([]);
    expect(sfxForOutcome([{ stat: 'joy', delta: 300 }, { stat: 'health', delta: -300 }])).toEqual([]);
    // A milestone that went well: fanfare instead of the tick; one that went badly: no fanfare.
    expect(sfxForOutcome([{ stat: 'joy', delta: 900 }], { milestone: true })).toEqual(['milestone']);
    expect(sfxForOutcome([{ stat: 'joy', delta: -900 }], { milestone: true })).toEqual(['stat_down']);
    for (const n of sfxForOutcome([{ stat: 'money', delta: 1 }, { stat: 'joy', delta: 1 }], { milestone: true })) expect(EFFECT_SFX.SHOW_DIALOG).toContain(n);
  });

  it('flow lines, stamps and choices', () => {
    expect(sfxForFlow([{ kind: 'daily', para: -40 }])).toEqual([]);
    expect(sfxForFlow([{ kind: 'payday', para: 900 }, { kind: 'rent', para: -500 }, { kind: 'daily', para: -40 }])).toEqual(['payday', 'bill']);
    expect(sfxForFlow([{ kind: 'allowance', para: 100 }])).toEqual(['payday']);
    expect(sfxForStamp('calledIt')).toBe('stamp_thud');
    expect(sfxForStamp('iWasWrong')).toBe('stamp_heavy');
    expect([sfxForChoice(), sfxForChoice('left'), sfxForChoice('right')]).toEqual(['choice_confirm', 'swipe_left', 'swipe_right']);
    expect(MOMENT_SFX.death).toBe('death');
  });

  it('the most repeated sounds are the softest and have pitch variants', () => {
    const softest = Math.min(...SFX_NAMES.map((n) => SFX[n].gain));
    expect(SFX.day_advance.gain).toBe(softest);
    for (const n of ['day_advance', 'ui_tap', 'card_slide', 'stat_up', 'stat_down', 'bubble'] as const) expect(SFX[n].variants).toBeGreaterThanOrEqual(2);
    expect(SFX.grief.gain).toBeLessThanOrEqual(0.3);
  });
});

describe('sound manager', () => {
  it('rate-limits identical sounds: many stat ticks in one frame → one', async () => {
    const { m, clock, played } = await ready();
    const results = Array.from({ length: 8 }, () => m.play('stat_up'));
    expect(results.filter(Boolean)).toHaveLength(1);
    expect(played).toHaveLength(1);
    clock.t += SFX.stat_up.gapMs - 1;
    expect(m.play('stat_up')).toBe(false);
    clock.t += 1;
    expect(m.play('stat_up')).toBe(true);
    // A different sound is not held back by it.
    expect(m.play('stamp_thud')).toBe(true);
    expect(played.map((p) => p.key.replace(/_\d$/, ''))).toEqual(['stat_up', 'stat_up', 'stamp_thud']);
  });

  it('ambient sounds share a budget; feedback and moments always pass', async () => {
    const { m, played } = await ready();
    const ambient: SfxName[] = ['card_slide', 'bubble', 'stat_up', 'stat_down', 'day_advance', 'paper_rustle'];
    expect(ambient.map((n) => m.play(n)).filter(Boolean)).toHaveLength(AMBIENT_BUDGET);
    expect(m.play('stamp_heavy')).toBe(true);
    expect(m.play('choice_confirm')).toBe(true);
    expect(played).toHaveLength(AMBIENT_BUDGET + 2);
  });

  it('minPri (▶▶ auto) keeps only the moments', async () => {
    const { m } = await ready();
    expect(m.play('day_advance', { minPri: 2 })).toBe(false);
    expect(m.play('ui_tap', { minPri: 2 })).toBe(false);
    expect(m.play('death', { minPri: 2 })).toBe(true);
  });

  it('mixes master volume × sound gain, and never repeats a variant twice in a row', async () => {
    const { m, clock, played } = await ready({ random: () => 0 });
    m.play('stamp_thud');
    expect(played[0]).toEqual({ key: 'stamp_thud', volume: DEFAULT_PREFS.volume * SFX.stamp_thud.gain });
    m.setVolume(1);
    for (let i = 0; i < 6; i++) { clock.t += 1000; m.play('ui_tap'); }
    const taps = played.slice(1).map((p) => p.key);
    expect(taps.every((k) => /^ui_tap_[123]$/.test(k))).toBe(true);
    for (let i = 1; i < taps.length; i++) expect(taps[i]).not.toBe(taps[i - 1]);
    expect(played[1]!.volume).toBeCloseTo(SFX.ui_tap.gain);
    clock.t += 1000;
    m.play('day_advance', { volume: 9 });
    expect(played.at(-1)!.volume).toBeLessThanOrEqual(1);
  });

  it('mute persists (own storage key) and silences at once', async () => {
    const kv = memKV();
    const a = await ready({ kv });
    expect(a.m.muted).toBe(false);
    expect(a.m.volume).toBe(DEFAULT_PREFS.volume);
    let notified = 0;
    a.m.subscribe(() => { notified++; });
    a.m.toggleMuted();
    expect(notified).toBe(1);
    expect(a.calls.stopAll).toBe(1);
    expect(a.m.play('stamp_thud')).toBe(false);
    expect(a.played).toHaveLength(0);
    expect(JSON.parse(kv.data.get(SOUND_PREFS_KEY)!)).toEqual({ muted: true, volume: DEFAULT_PREFS.volume });

    const b = await ready({ kv });                                  // "reload"
    expect(b.m.muted).toBe(true);
    expect(b.m.play('stamp_thud')).toBe(false);
    b.m.setMuted(false);
    b.m.setVolume(0.9);
    const c = await ready({ kv });
    expect(c.m.muted).toBe(false);
    expect(c.m.volume).toBe(0.9);
    expect(c.m.play('stamp_thud')).toBe(true);
  });

  it('bad or missing saved prefs fall back to the defaults (sound on, modest volume)', () => {
    expect(decodePrefs(null)).toEqual(DEFAULT_PREFS);
    expect(decodePrefs('{not json')).toEqual(DEFAULT_PREFS);
    expect(decodePrefs('null')).toEqual(DEFAULT_PREFS);
    expect(decodePrefs('{"muted":"yes","volume":"loud"}')).toEqual(DEFAULT_PREFS);
    expect(decodePrefs('{"muted":true,"volume":7}')).toEqual({ muted: true, volume: 1 });
    expect(DEFAULT_PREFS.muted).toBe(false);
    expect(DEFAULT_PREFS.volume).toBeLessThanOrEqual(0.7);
  });

  it('plays asked before the saved setting is known wait for it — and are dropped when muted', async () => {
    const run = async (saved: Record<string, string>) => {
      const fb = fakeBackend();
      const m = new SoundManager({ backend: fb.backend, kv: memKV(saved), now: () => 0 });
      expect(m.play('stamp_thud')).toBe(false);                      // launch stamp, prefs not read yet
      expect(fb.played).toHaveLength(0);
      await m.init();
      return fb.played.length;
    };
    expect(await run({})).toBe(1);
    expect(await run({ [SOUND_PREFS_KEY]: '{"muted":true,"volume":0.6}' })).toBe(0);
  });

  it('is silent in the background and stops what was playing', async () => {
    const { m, played, calls } = await ready();
    m.setActive(false);
    expect(calls.stopAll).toBe(1);
    expect(calls.active).toEqual([false]);
    expect(m.play('stamp_thud')).toBe(false);
    m.setActive(true);
    expect(m.play('stamp_thud')).toBe(true);
    expect(played).toHaveLength(1);
  });

  it('preloads every file, the frequent ones first', async () => {
    const { calls } = await ready();
    expect(calls.preload.slice(0, sfxFiles('ui_tap').length)).toEqual(sfxFiles('ui_tap'));
    expect(new Set(calls.preload)).toEqual(new Set(SFX_NAMES.flatMap(sfxFiles)));
  });

  it('is a no-op without an audio backend, and survives a backend or storage that throws', async () => {
    const none = new SoundManager();
    await none.init();
    expect(none.play('stamp_thud')).toBe(false);
    expect(() => { none.toggleMuted(); none.setVolume(0.3); none.setActive(false); none.setActive(true); none.stopAll(); }).not.toThrow();
    expect(none.muted).toBe(true);

    const boom = () => { throw new Error('no audio device'); };
    const broken = new SoundManager({
      backend: { preload: boom, play: boom, stopAll: boom, setActive: boom },
      kv: { read: () => Promise.reject(new Error('no storage')), write: () => { throw new Error('no storage'); } },
    });
    await expect(broken.init()).resolves.toBeUndefined();
    expect(() => { broken.play('stamp_thud'); broken.toggleMuted(); broken.setActive(false); broken.stopAll(); }).not.toThrow();
    expect(broken.play('not_a_sound' as SfxName)).toBe(false);
  });
});

describe('generated sound files', () => {
  const a = renderAll();

  it('gen-sfx is deterministic: two runs → identical hashes', () => {
    const b = renderAll();
    expect(b.map((f) => [f.file, sha256(f.bytes)])).toEqual(a.map((f) => [f.file, sha256(f.bytes)]));
    expect(new Set(a.map((f) => sha256(f.bytes))).size).toBe(a.length);       // variants really differ
  });

  it('the committed files are exactly what the script produces', () => {
    const onDisk = readdirSync(SFX_DIR).filter((f) => f.endsWith('.wav')).sort();
    expect(onDisk).toEqual(a.map((f) => f.file).sort());
    for (const f of a) expect(sha256(readFileSync(join(SFX_DIR, f.file))), f.file).toBe(sha256(f.bytes));
    const manifest = JSON.parse(readFileSync(join(SFX_DIR, 'manifest.json'), 'utf8')) as { files: Record<string, { sha256: string; bytes: number }> };
    for (const f of a) expect(manifest.files[f.file]).toMatchObject({ sha256: sha256(f.bytes), bytes: f.bytes.length });
  });

  it('script, runtime table and the bundled asset table name the same files', () => {
    expect(SOUNDS.map(([name, variants]) => [name, variants])).toEqual(SFX_NAMES.map((n) => [n, SFX[n].variants]));
    const assets = readFileSync(join(APP, 'src', 'state', 'sfxAssets.gen.ts'), 'utf8');
    const keys = [...assets.matchAll(/^\s+'([a-z0-9_]+)': require\('\.\.\/\.\.\/assets\/sfx\/([a-z0-9_]+)\.wav'\),$/gm)].map((m) => { expect(m[1]).toBe(m[2]); return m[1]!; });
    expect(keys.sort()).toEqual(SFX_NAMES.flatMap(sfxFiles).sort());
  });

  it('every file is a valid 16-bit mono PCM WAV under the size cap', () => {
    for (const f of a) {
      const b = readFileSync(join(SFX_DIR, f.file));
      expect(b.length, f.file).toBeLessThanOrEqual(MAX_BYTES);
      expect(b.toString('ascii', 0, 4)).toBe('RIFF');
      expect(b.readUInt32LE(4)).toBe(b.length - 8);
      expect(b.toString('ascii', 8, 16)).toBe('WAVEfmt ');
      expect(b.readUInt32LE(16)).toBe(16);
      expect([b.readUInt16LE(20), b.readUInt16LE(22), b.readUInt32LE(24), b.readUInt16LE(34)]).toEqual([1, 1, SR, 16]);   // PCM, mono, rate, bits
      expect([b.readUInt32LE(28), b.readUInt16LE(32)]).toEqual([SR * 2, 2]);
      expect(b.toString('ascii', 36, 40)).toBe('data');
      expect(b.readUInt32LE(40)).toBe(b.length - 44);
      expect([22050, 44100]).toContain(SR);
    }
  });

  it('levels are sane: −3 dBFS peak, no clipping, no DC offset, click-free edges, short', () => {
    for (const f of a) {
      const s = analyze(f.pcm);
      expect(s.peakDb, f.file).toBeGreaterThan(PEAK_DBFS - 0.05);
      expect(s.peakDb, f.file).toBeLessThan(PEAK_DBFS + 0.05);
      expect(s.clipped, f.file).toBe(0);
      expect(Math.abs(s.dc), f.file).toBeLessThan(0.002);
      expect(s.edge, f.file).toBeLessThan(0.002);
      expect(s.rmsDb, f.file).toBeLessThan(-10);
      expect(s.ms, f.file).toBeLessThanOrEqual(1400);
      // Audible on a phone speaker: a real share of the energy sits above 250 Hz.
      expect(s.hiShare, f.file).toBeGreaterThan(0.3);
    }
    // The day tick is the shortest thing in the set.
    expect(Math.max(...a.filter((f) => f.name === 'day_advance').map((f) => analyze(f.pcm).ms))).toBeLessThanOrEqual(80);
  });
});
