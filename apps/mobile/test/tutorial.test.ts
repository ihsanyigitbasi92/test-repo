/**
 * Tutorial / first-time help (docs/design/18): the intro is shown once on a fresh install and never to players who
 * already had a save, can be replayed from Settings; each coach-mark hint shows once (persisted), only when its
 * trigger is due and never two without a game beat in between; the game clock stands while the intro or a hint
 * is up. Pure logic (src/state/tutorial.ts) with an in-memory key-value store.
 */
import { describe, expect, it } from 'vitest';
import { CATALOG } from '../src/i18n';
import {
  HINT_IDS, INTRO_PAGES, METERS_FALLBACK_DAY, TUTORIAL_KEY, TutorialStore, clockMayRun, decodeTutorial, isExistingPlayer, nextHint,
  type ClockGate, type HintCtx, type HintId, type TutorialDeps,
} from '../src/state/tutorial';

const SAVE_KEY = 'motto.save.v1';

function memKV(init: Record<string, string> = {}) {
  const data = new Map(Object.entries(init));
  return { data, read: async (k: string) => data.get(k) ?? null, write: async (k: string, v: string) => { data.set(k, v); return true; } };
}
const flush = () => new Promise((r) => setTimeout(r, 0));
async function store(kv = memKV(), events: Parameters<NonNullable<TutorialDeps['onEvent']>>[0][] = []) {
  const t = new TutorialStore({ kv, saveKey: SAVE_KEY, onEvent: (e) => events.push(e) });
  await t.load();
  return { t, kv, events };
}
const stored = (kv: ReturnType<typeof memKV>) => decodeTutorial(kv.data.get(TUTORIAL_KEY));

/** A save written by the game (save.ts shape, only the fields the migration looks at). */
const saveWith = (life: unknown, livesCompleted: number) => JSON.stringify({ v: 1, meta: { schemaVersion: 1, legacy: { livesCompleted } }, life });

const ctx = (over: Partial<HintCtx> = {}): HintCtx => ({
  open: true, phase: 'idle', choicesUp: false, birthdayUp: false, shownDays: 1, flowing: false, statsChanged: false, moneyChanged: false,
  epoch: 1, lastHintEpoch: -1, ...over,
});

describe('intro: once per fresh install', () => {
  it('a fresh install opens the intro; finishing it is stored and it does not come back', async () => {
    const { t, kv, events } = await store();
    expect(t.getState()).toMatchObject({ loaded: true, introDone: false, introOpen: true, replay: false });
    expect(t.needsIntro()).toBe(true);
    expect(t.holdsClock()).toBe(true);                                     // the game waits under the intro
    expect(events).toEqual([{ kind: 'intro_open', replay: false }]);
    t.closeIntro('done');
    expect(t.getState()).toMatchObject({ introDone: true, introOpen: false });
    expect(t.holdsClock()).toBe(false);
    await flush();
    expect(stored(kv)).toMatchObject({ introDone: true, via: 'done' });

    const again = await store(kv);
    expect(again.t.getState()).toMatchObject({ introDone: true, introOpen: false });
    expect(again.events).toEqual([]);
  });

  it('skip counts as done (no dark pattern: it never comes back by itself) and remembers the page', async () => {
    const { t, kv, events } = await store();
    t.closeIntro('skip', 1);
    await flush();
    expect(stored(kv)).toMatchObject({ introDone: true, via: 'skip' });
    expect(events.at(-1)).toEqual({ kind: 'intro_skip', replay: false, page: 1 });
    expect((await store(kv)).t.getState().introOpen).toBe(false);
  });

  it('closing the app mid-intro (nothing stored) shows it again on the next launch', async () => {
    const kv = memKV();
    await store(kv);
    await flush();
    expect(kv.data.has(TUTORIAL_KEY)).toBe(false);
    expect((await store(kv)).t.getState().introOpen).toBe(true);
  });

  it('has as many pages as the intro renders, with TR and EN text for each', () => {
    for (const loc of ['tr', 'en'] as const) {
      const pages = CATALOG[loc].tutorial.pages;
      expect(Object.keys(pages)).toHaveLength(INTRO_PAGES);
      for (const p of Object.values(pages)) expect(p.title.length).toBeGreaterThan(5);
    }
  });
});

describe('existing players', () => {
  it('a save with a life in progress: no intro, no hints, record migrated', async () => {
    const kv = memKV({ [SAVE_KEY]: saveWith({ state: {}, feed: [], ui: {}, lifeNo: 1 }, 0) });
    const { t, events } = await store(kv);
    expect(t.getState()).toMatchObject({ introDone: true, introOpen: false });
    expect([...t.getState().hints].sort()).toEqual([...HINT_IDS].sort());
    expect(events).toEqual([]);
    await flush();
    expect(stored(kv)).toMatchObject({ introDone: true, via: 'legacy' });
  });

  it('a save between lives (one finished life) also counts; a save that only saw the Client File does not', async () => {
    expect((await store(memKV({ [SAVE_KEY]: saveWith(null, 2) }))).t.getState().introOpen).toBe(false);
    expect((await store(memKV({ [SAVE_KEY]: saveWith(null, 0) }))).t.getState().introOpen).toBe(true);
    expect(isExistingPlayer('{not json')).toBe(false);
    expect(isExistingPlayer(null)).toBe(false);
  });

  it('the stored tutorial record wins over the save (a new player who finished the intro keeps their hints)', async () => {
    const kv = memKV({ [TUTORIAL_KEY]: JSON.stringify({ v: 1, introDone: true, via: 'done', hints: ['choices'] }), [SAVE_KEY]: saveWith({ state: {} }, 0) });
    const { t } = await store(kv);
    expect(t.getState().hints).toEqual(['choices']);
  });

  it('existing players still get the Settings entry: the intro replays on demand', async () => {
    const { t } = await store(memKV({ [SAVE_KEY]: saveWith(null, 3) }));
    t.openIntro();
    expect(t.getState()).toMatchObject({ introOpen: true, replay: true });
  });
});

describe('replay from Settings', () => {
  it('opens the intro over a running game, holds the clock, and closing does not rewrite how it first ended', async () => {
    const { t, kv, events } = await store();
    t.closeIntro('skip', 0);
    t.openIntro();
    expect(t.getState()).toMatchObject({ introOpen: true, replay: true });
    expect(t.holdsClock()).toBe(true);
    t.closeIntro('done');
    expect(t.getState()).toMatchObject({ introOpen: false, replay: false, introDone: true });
    expect(events.map((e) => `${e.kind}:${e.replay}`)).toEqual(['intro_open:false', 'intro_skip:false', 'intro_open:true', 'intro_done:true']);
    await flush();
    expect(stored(kv)?.via).toBe('skip');
  });

  it('a hint on screen is cleared when the intro opens; no hint can open over the intro', async () => {
    const { t } = await store();
    t.closeIntro('done');
    t.showHint('choices');
    t.openIntro();
    expect(t.getState().active).toBeNull();
    expect(t.showHint('stats')).toBe(false);
  });
});

describe('hints: each shown once, persisted', () => {
  it('showHint marks it seen at once, and stores it', async () => {
    const { t, kv } = await store();
    t.closeIntro('done');
    expect(t.showHint('choices')).toBe(true);
    expect(t.getState().active).toBe('choices');
    expect(t.showHint('stats')).toBe(false);                                // one at a time
    t.dismissHint();
    expect(t.showHint('choices')).toBe(false);                              // never twice
    await flush();
    expect(stored(kv)?.hints).toEqual(['choices']);
    const again = await store(kv);
    expect(again.t.getState().hints).toEqual(['choices']);
    expect(nextHint(ctx({ phase: 'day', choicesUp: true }), again.t.getState().hints)).toBeNull();
  });

  it('reset: every hint can come back once, also after the first life; the flag clears when all were seen again', async () => {
    const { t, kv } = await store();
    t.closeIntro('done');
    for (const id of HINT_IDS) { t.showHint(id); t.dismissHint(); }
    expect(t.hintsAllowed(false)).toBe(false);
    t.resetHints();
    expect(t.getState().hints).toEqual([]);
    expect(t.hintsAllowed(false)).toBe(true);
    await flush();
    expect(stored(kv)?.replayHints).toBe(true);
    for (const id of HINT_IDS) { t.showHint(id); t.dismissHint(); }
    expect(t.hintsAllowed(false)).toBe(false);
    expect(t.hintsAllowed(true)).toBe(true);
  });

  it('decode drops unknown ids and duplicates, rejects garbage', () => {
    expect(decodeTutorial(JSON.stringify({ v: 1, introDone: true, hints: ['choices', 'nope', 'choices'] }))?.hints).toEqual(['choices']);
    expect(decodeTutorial('{')).toBeNull();
    expect(decodeTutorial(JSON.stringify({ v: 2, introDone: true, hints: [] }))).toBeNull();
  });

  it('every hint has a TR and an EN line within the voice rules (short, no "!", no em dash)', () => {
    for (const loc of ['tr', 'en'] as const) {
      const t = CATALOG[loc].tutorial;
      for (const id of HINT_IDS) {
        const line = t.hints[id as HintId];
        expect(line.length, `${loc}.${id}`).toBeGreaterThan(10);
        expect(line.split(/\s+/).length, `${loc}.${id}`).toBeLessThanOrEqual(22);
        expect(line).not.toMatch(/[!—]/);
      }
      const pageText = JSON.stringify(t.pages);
      expect(pageText).not.toMatch(/[!—]/);
    }
  });
});

describe('hint triggers', () => {
  it('first card: the choices hint', () => {
    expect(nextHint(ctx({ phase: 'day', choicesUp: true }), [])).toBe('choices');
    expect(nextHint(ctx({ phase: 'day', choicesUp: false }), [])).toBeNull();
  });

  it('first stat change: after the answer, not over an open card', () => {
    expect(nextHint(ctx({ phase: 'answered', statsChanged: true }), ['choices'])).toBe('stats');
    expect(nextHint(ctx({ phase: 'day', choicesUp: true, statsChanged: true }), ['choices'])).toBeNull();
  });

  it('speed: once the clock really runs, from the second shown day', () => {
    expect(nextHint(ctx({ flowing: true, shownDays: 1 }), ['choices', 'stats'])).toBeNull();
    expect(nextHint(ctx({ flowing: true, shownDays: 2 }), ['choices', 'stats'])).toBe('speed');
  });

  it('money / counters: first money change from day 3, or by day 6 anyway', () => {
    const seen: HintId[] = ['choices', 'stats', 'speed'];
    expect(nextHint(ctx({ moneyChanged: true, shownDays: 2 }), seen)).toBeNull();
    expect(nextHint(ctx({ moneyChanged: true, shownDays: 3 }), seen)).toBe('meters');
    expect(nextHint(ctx({ shownDays: METERS_FALLBACK_DAY }), seen)).toBe('meters');
  });

  it('first birthday: the report hint wins over anything else due', () => {
    expect(nextHint(ctx({ phase: 'birthday', birthdayUp: true, statsChanged: true, shownDays: 9 }), [])).toBe('report');
  });

  it('nothing while something else is over the screen, Auto is on, or a beat is still playing (open = false)', () => {
    expect(nextHint(ctx({ open: false, phase: 'day', choicesUp: true }), [])).toBeNull();
  });

  it('never two hints in a row: the next one waits for a new game beat', () => {
    const c = ctx({ phase: 'answered', statsChanged: true, epoch: 4, lastHintEpoch: 4 });
    expect(nextHint(c, ['choices'])).toBeNull();
    expect(nextHint({ ...c, epoch: 5 }, ['choices'])).toBe('stats');
  });

  it('all seen: nothing more', () => {
    expect(nextHint(ctx({ phase: 'birthday', birthdayUp: true, flowing: true, shownDays: 9, statsChanged: true, moneyChanged: true }), [...HINT_IDS])).toBeNull();
  });
});

describe('time is paused while a hint (or the intro) is visible', () => {
  const running: ClockGate = { stage: 'play', busy: false, hasLife: true, flowPhase: true, speed: 'play', covered: false, overlay: false, held: false };

  it('the clock gate: held → no day progress', () => {
    expect(clockMayRun(running)).toBe(true);
    expect(clockMayRun({ ...running, held: true })).toBe(false);
    expect(clockMayRun({ ...running, speed: 'fast', held: true })).toBe(false);
    // the other stops are unchanged
    expect(clockMayRun({ ...running, speed: 'pause' })).toBe(false);
    expect(clockMayRun({ ...running, covered: true })).toBe(false);
    expect(clockMayRun({ ...running, overlay: true })).toBe(false);
    expect(clockMayRun({ ...running, busy: true })).toBe(false);
    expect(clockMayRun({ ...running, flowPhase: false })).toBe(false);
  });

  it('the store holds the clock exactly while a hint is on screen', async () => {
    const { t } = await store();
    t.closeIntro('done');
    let progress = 0;
    const tick = () => { if (clockMayRun({ ...running, held: t.holdsClock() })) progress += 0.1; };
    tick();
    expect(progress).toBeCloseTo(0.1);
    t.showHint('speed');
    for (let k = 0; k < 20; k++) tick();
    expect(progress).toBeCloseTo(0.1);                                      // stood still the whole time
    t.dismissHint();
    tick();
    expect(progress).toBeCloseTo(0.2);
  });
});
