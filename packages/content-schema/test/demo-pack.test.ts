import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ContentBundle, GameEventSchema, SkipLine } from '../src/index';

/**
 * Demo content pack (fixtures/demo): extra TR + EN day events so the playable app has a life's worth of variety.
 * Kept in a subfolder so the engine's golden-hash bundle (top-level fixtures only) stays bit-identical.
 * The app bundles top-level + demo; this test validates exactly that union.
 */
const root = join(import.meta.dirname, '..', 'fixtures');
const demo = join(root, 'demo');
const eventFiles = (dir: string) => readdirSync(dir).filter((f) => f.endsWith('.json') && !f.endsWith('.skip.json'));
const load = (dir: string, f: string) => JSON.parse(readFileSync(join(dir, f), 'utf8'));

const demoFiles = eventFiles(demo);
const all = [...eventFiles(root).map((f) => load(root, f)), ...demoFiles.map((f) => load(demo, f))];
const skipLines = [...load(root, 'lines.skip.json'), ...load(demo, 'lines.skip.json')];

/** Strings a player can read (dialog, choices, outcomes, coach, near-miss, slips, documents). */
function texts(e: Record<string, any>): string[] {
  const out: string[] = [];
  const both = (x: { tr?: string; en?: string } | undefined) => { if (x?.tr) out.push(x.tr); if (x?.en) out.push(x.en); };
  e.dialog?.forEach(both);
  e.choices.forEach(both);
  for (const o of Object.values(e.outcomes) as any[]) for (const b of Array.isArray(o) ? o : [o]) { both(b); both(b.nearMiss); b.coach.forEach(both); }
  both(e.wager?.slip);
  if (e.document) { both(e.document.letterhead); both(e.document.body); }
  return out;
}

// 08 K1–K21 spot checks (the full linter lives in a later sprint): currency, gambling verb, religion, politics, brands.
// Whole-word match with Unicode letters (JS `\b` treats ı/ş/ç as non-word, so "çıkarma" would hit "karma").
const word = (alts: string, flags = 'iu') => new RegExp(`(?<!\\p{L})(${alts})(?!\\p{L})`, flags);
const RED_LINES = [
  word('TL', 'u'), word('lira|dolar|dollars?|euro|bucks'), /₺|\$|€/u, word('bahis\\p{L}*|bet|bets|betting'),
  word('dua|namaz|cami|kilise|church|mosque|prayer|melek|angel|karma'),
  word('siyas\\p{L}*|election|politic\\p{L}*'), word('enflasyon|inflation|asgari ücret|minimum wage'),
  word('instagram|whatsapp|tinder|uber|google|apple|starbucks|netflix'),
];

describe('demo content pack', () => {
  it('ships ≥ 25 demo events, one per file named by id', () => {
    expect(demoFiles.length).toBeGreaterThanOrEqual(25);
    for (const f of demoFiles) expect(load(demo, f).id).toBe(f.replace(/\.json$/, ''));
  });
  for (const f of demoFiles) it(`parses ${f}`, () => {
    const r = GameEventSchema.safeParse(load(demo, f));
    expect(r.success, r.success ? '' : JSON.stringify(r.error.issues, null, 1)).toBe(true);
  });
  it('demo skip lines parse', () => {
    expect(SkipLine.array().safeParse(load(demo, 'lines.skip.json')).success).toBe(true);
  });
  it('fixtures + demo form a valid bundle (unique ids, followUp/envelope/chain references resolve)', () => {
    const r = ContentBundle.safeParse({ contentHash: 'app', events: all, skipLines });
    // Known, pre-existing top-level issue: evt_nevin_hizalanma_01 names evt_is_gorusmesi_ik as an envelope resolver
    // whose pre lacks envelopeOpen:true. Fixing it changes the engine golden hash, so it is left to the content owner.
    const known = /^evt_is_gorusmesi_ik: envelope resolver pre must contain envelopeOpen:true/;
    const issues = r.success ? [] : r.error.issues.map((i) => i.message).filter((m) => !known.test(m));
    expect(issues).toEqual([]);
  });
  it('every chain node referenced by a fixture exists (kesin c2*, terfi a2)', () => {
    const nodes = new Set(all.filter((e) => e.chain).map((e) => `${e.chain.id}:${e.chain.node}`));
    for (const n of ['kesin:c2', 'kesin:c2_geldi', 'kesin:c2_gelmedi', 'terfi:a2']) expect(nodes.has(n), n).toBe(true);
  });
  it('provides the engine system days the tuning names (rent card, a bailout, an envelope resolver)', () => {
    const ids = new Set(all.map((e) => e.id));
    for (const id of ['evt_kira_gunu', 'evt_anne_borc_verdi', 'evt_is_gorusmesi_ik']) expect(ids.has(id), id).toBe(true);
  });
  it('has wager days, good-surprise pools, a legendary day, a mom call and status-changing jobs', () => {
    const demoEv = demoFiles.map((f) => load(demo, f));
    expect(demoEv.filter((e) => e.wager?.eligible).length).toBeGreaterThanOrEqual(10);
    expect(demoEv.some((e) => e.tags.includes('surprise.nice'))).toBe(true);
    expect(demoEv.some((e) => e.tags.includes('surprise.great'))).toBe(true);
    expect(demoEv.some((e) => e.rarity === 'legendary')).toBe(true);
    expect(demoEv.some((e) => e.type === 'call')).toBe(true);
    const setsJob = (e: any) => Object.values(e.outcomes).flat().some((b: any) => b.effects?.status?.job);
    expect(demoEv.filter(setsJob).length).toBeGreaterThanOrEqual(3);
  });
  it('stays inside the 08 red lines (spot check: currency, betting, religion, politics, brands)', () => {
    for (const f of demoFiles) for (const s of texts(load(demo, f))) for (const re of RED_LINES) expect(re.test(s), `${f}: "${s}" ~ ${re}`).toBe(false);
  });
});
