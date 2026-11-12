/**
 * No raw ids on screen (playtest 2026-11-12, deneyim #9): every HUD status label, for every asset / job id the
 * content pack can produce and over whole simulated lives (full pack bundle), must be free of snake_case and
 * camelCase tokens in both languages.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { emptyMeta, step } from '@motto/engine';
import type { ContentBundle, GameEvent, LifeState, Locale, MetaState } from '@motto/engine';
import { BASE_BUNDLE } from '../src/content/bundle';
import { seededRng } from '../src/avatar/look';
import { CATALOG } from '../src/i18n';
import { RAW_ID, assetLabel, humanizeId, jobLabel, statusStrip } from '../src/i18n/labels';

const FIXTURES = join(__dirname, '../../../packages/content-schema/fixtures');
const PACKS = join(__dirname, '../assets/content');
const LOCALES: Locale[] = ['tr', 'en'];

/** Every `status.assets` add/remove id, `career.set` and `status.job.title` in the content fixtures. */
function contentIds(): { assets: Set<string>; jobs: Set<string> } {
  const assets = new Set<string>(), jobs = new Set<string>();
  const visit = (o: unknown): void => {
    if (Array.isArray(o)) { o.forEach(visit); return; }
    if (!o || typeof o !== 'object') return;
    const r = o as Record<string, unknown>;
    const st = r.status as { assets?: { add?: string[]; remove?: string[] }; job?: { title?: string } } | undefined;
    if (st && typeof st === 'object') {
      for (const a of [...(st.assets?.add ?? []), ...(st.assets?.remove ?? [])]) assets.add(a);
      if (st.job && typeof st.job.title === 'string') jobs.add(st.job.title);
    }
    const career = r.career as { set?: string } | undefined;
    if (career && typeof career.set === 'string') jobs.add(career.set);
    Object.values(r).forEach(visit);
  };
  const walk = (dir: string): void => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (f.endsWith('.json')) { try { visit(JSON.parse(readFileSync(p, 'utf8'))); } catch { /* not ours to lint */ } }
    }
  };
  walk(FIXTURES);
  return { assets, jobs };
}

/** Base fixtures + every built age-band pack (what a full life plays). */
function fullBundle(): ContentBundle {
  if (!existsSync(join(PACKS, 'manifest.json'))) return BASE_BUNDLE;
  const manifest = JSON.parse(readFileSync(join(PACKS, 'manifest.json'), 'utf8')) as { packs: { file: string }[] };
  const seen = new Set(BASE_BUNDLE.events.map((e) => e.id));
  const events = [...BASE_BUNDLE.events];
  const skipLines = [...BASE_BUNDLE.skipLines];
  for (const p of manifest.packs) {
    const d = JSON.parse(readFileSync(join(PACKS, p.file), 'utf8')) as { events: GameEvent[]; skipLines: ContentBundle['skipLines'] };
    for (const e of d.events) if (!seen.has(e.id)) { seen.add(e.id); events.push(e); }
    skipLines.push(...d.skipLines);
  }
  return { contentHash: 'test-full', events, skipLines };
}

const labels = (st: LifeState, locale: Locale): string[] => Object.values(statusStrip(CATALOG[locale], locale, st)).filter((x): x is string => !!x);

describe('humanizeId', () => {
  it('turns ids into words', () => {
    expect(humanizeId('tr', 'ikinci_el_telefon')).toBe('İkinci el telefon');
    expect(humanizeId('en', 'boilerTech')).toBe('Boiler tech');
    expect(humanizeId('en', 'npc:neighborKid')).toBe('Neighbor kid');
    expect(humanizeId('tr', 'kıdemli uzman')).toBe('Kıdemli uzman');
    expect(humanizeId('en', 'brand_new__thing')).toBe('Brand new thing');
  });
});

describe('no raw ids in HUD labels', () => {
  const { assets, jobs } = contentIds();

  it('finds the content ids', () => {
    expect(assets.size).toBeGreaterThan(50);
    expect(jobs.has('boilerTech')).toBe(true);
  });

  for (const locale of LOCALES) {
    it(`asset and job labels (${locale})`, () => {
      const s = CATALOG[locale];
      const bad = [...assets].map((a) => [a, assetLabel(s, locale, a)]).concat([...jobs].map((j) => [j, jobLabel(s, locale, j)]))
        .filter(([, l]) => RAW_ID.test(l!));
      expect(bad).toEqual([]);
    });

    it(`asset ids without a catalog label are reported (${locale})`, () => {
      // New content may add ids before the catalog; they render humanized (checked above), so this only reports.
      const missing = [...assets].filter((a) => !(a in CATALOG[locale].asset));
      // eslint-disable-next-line no-console
      if (missing.length) console.warn(`[labels] ${locale}: no catalog label yet (humanized): ${missing.join(', ')}`);
      expect(missing.length).toBeLessThan(assets.size / 4);
    });

    it(`status strip with every asset, partner, kid and an id job title (${locale})`, () => {
      const r = step(null as unknown as LifeState, emptyMeta(), { type: 'START_LIFE', seed: 'labels', name: 'Deniz', locale }, BASE_BUNDLE);
      const st = structuredClone(r.state);
      for (const title of [...jobs, 'someNewJob', 'yeni_meslek']) {
        st.status.job = { title, tier: 1, monthly: 1000, since: 0 };
        st.status.assets = ['kedi', ...assets, 'unknown_new_asset', 'brandNewThing'];
        st.status.partner = { npc: 'partner', since: 0 };
        st.flags = [...st.flags, 'evli'];
        for (const n of st.npcs) if (n.role === 'child') { n.exists = true; n.alive = true; }
        for (const l of labels(st, locale)) expect(l, `${title}: ${l}`).not.toMatch(RAW_ID);
      }
    });
  }

  it('over whole simulated lives (full content)', () => {
    const bundle = fullBundle();
    for (const seed of ['hud-a', 'hud-b', 'hud-c']) {
      const rnd = seededRng(`hud:${seed}`);
      let meta: MetaState = emptyMeta();
      let r = step(null as unknown as LifeState, meta, { type: 'START_LIFE', seed, name: 'Deniz', locale: 'tr' }, bundle);
      let st = r.state; meta = r.meta;
      for (let guard = 0; guard < 8000 && st.phase !== 'dead'; guard++) {
        if (st.phase === 'day' && st.card) {
          const open = st.card.choices.filter((c) => !c.locked);
          const c = open[Math.floor(rnd() * open.length)]!;
          r = step(st, meta, { type: 'ANSWER', eventId: st.card.eventId, choiceId: c.id, via: 'auto' }, bundle);
        } else r = step(st, meta, { type: 'NEXT_DAY' }, bundle);
        st = r.state; meta = r.meta;
        for (const locale of LOCALES) for (const l of labels(st, locale)) expect(l, `${seed} age ${st.calendar.age}`).not.toMatch(RAW_ID);
      }
    }
  }, 180_000);
});
