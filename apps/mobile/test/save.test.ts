/** Save / continue blob (save.ts): round trip, and every way a save must be refused (start fresh instead). */
import { describe, expect, it } from 'vitest';
import { emptyMeta, step } from '@motto/engine';
import type { LifeState } from '@motto/engine';
import { BASE_BUNDLE } from '../src/content/bundle';
import { emptyMomentHistory } from '../src/avatar/moments';
import { generateLook } from '../src/avatar/look';
import { SAVE_FEED_ITEMS, decodeSave, encodeSave, engineShape, feedForSave, saveMatchesContent, savedAge } from '../src/state/save';
import type { SaveV1 } from '../src/state/save';
import type { FeedItem } from '../src/state/feed';

function makeSave(): SaveV1 {
  let r = step(null as unknown as LifeState, emptyMeta(), { type: 'START_LIFE', seed: 'save-1', name: 'Deniz', locale: 'en' }, BASE_BUNDLE);
  for (let i = 0; i < 40; i++) {
    const st = r.state;
    r = st.phase === 'day' && st.card
      ? step(st, r.meta, { type: 'ANSWER', eventId: st.card.eventId, choiceId: st.card.choices.find((c) => !c.locked)!.id }, BASE_BUNDLE)
      : step(st, r.meta, { type: 'NEXT_DAY' }, BASE_BUNDLE);
  }
  const feed: FeedItem[] = Array.from({ length: 60 }, (_, i) => (i % 7 === 3
    ? { id: i + 1, kind: 'typing', speaker: 'mom' }
    : { id: i + 1, kind: 'coach', ui: { k: 'intro1' } }));
  return {
    v: 1, savedAt: 1, engine: engineShape(), contentHash: BASE_BUNDLE.contentHash, locale: 'en', speed: 'fast', auto: false, fastLife: true,
    meta: r.meta,
    life: { state: r.state, look: generateLook('x'), lifeNo: 2, feed: feedForSave(feed),
      ui: { autoDays: 3, lowJoyShown: false, lastMotto: null, lastReport: null, unread: 12, momentHist: emptyMomentHistory(), session: null } },
  };
}

describe('save blob', () => {
  it('round-trips a running life exactly', () => {
    const save = makeSave();
    const back = decodeSave(encodeSave(save));
    expect(back).not.toBeNull();
    expect(back!.life!.state).toEqual(save.life!.state);
    expect(back!.meta).toEqual(save.meta);
    expect(back!.locale).toBe('en');
    expect(savedAge(back!)).toBe(save.life!.state.calendar.age);
    // the resumed state keeps stepping like the original
    const a = step(save.life!.state, save.meta, { type: 'NEXT_DAY' }, BASE_BUNDLE);
    const b = step(back!.life!.state, back!.meta, { type: 'NEXT_DAY' }, BASE_BUNDLE);
    expect(b.state).toEqual(a.state);
  });

  it('keeps the last feed items, without typing indicators', () => {
    const feed = makeSave().life!.feed;
    expect(feed.length).toBe(SAVE_FEED_ITEMS);
    expect(feed.some((f) => f.kind === 'typing')).toBe(false);
    expect(feed[feed.length - 1]!.id).toBe(59);                               // id 60 is a typing line: not saved
  });

  it('refuses corrupt, foreign or finished saves', () => {
    const good = makeSave();
    expect(decodeSave(null)).toBeNull();
    expect(decodeSave('')).toBeNull();
    expect(decodeSave('{not json')).toBeNull();
    expect(decodeSave('[]')).toBeNull();
    expect(decodeSave(encodeSave({ ...good, v: 2 as 1 }))).toBeNull();
    expect(decodeSave(encodeSave({ ...good, engine: 'other' }))).toBeNull();
    expect(decodeSave(encodeSave({ ...good, locale: 'de' as 'tr' }))).toBeNull();
    const dead = structuredClone(good);
    dead.life!.state.phase = 'dead';
    expect(decodeSave(encodeSave(dead))).toBeNull();
    const noState = structuredClone(good) as unknown as { life: { state: unknown } };
    noState.life.state = null;
    expect(decodeSave(JSON.stringify(noState))).toBeNull();
  });

  it('a save between lives keeps meta + prefs', () => {
    const between = { ...makeSave(), life: null };
    const back = decodeSave(encodeSave(between));
    expect(back?.life).toBeNull();
    expect(back?.fastLife).toBe(true);
    expect(savedAge(back!)).toBeNull();
  });

  it('checks the content hash', () => {
    const save = makeSave();
    expect(saveMatchesContent(save, BASE_BUNDLE.contentHash)).toBe(true);
    expect(saveMatchesContent(save, 'something-else')).toBe(false);
  });

  it('fits comfortably in storage', () => {
    expect(encodeSave(makeSave()).length).toBeLessThan(400_000);
  });
});
