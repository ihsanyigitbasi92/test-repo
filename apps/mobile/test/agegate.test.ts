/** Neutral age gate (src/ads/ageGate.ts) and its effect on the ad layer. */
import { describe, expect, it } from 'vitest';
import { AD_CONFIG, type AdConfig } from '../src/ads/config';
import { AGE_GATE_KEY, AgeGateStore, ageGateDone, bandForYear, bandOf, decodeAge, recordFor, validBirthYear, youngestAge, type AgeBand } from '../src/ads/ageGate';
import { AdService } from '../src/ads/adService';
import { MockAdProvider } from '../src/ads/MockAdProvider';
import { applyCardChoice } from '../src/ads/consent';
import type { AdGameContext } from '../src/ads/placements';

const G = AD_CONFIG.ageGate;
const MIN = 60_000, HOUR = 60 * MIN;
const T0 = Date.UTC(2026, 10, 13, 9, 0, 0);

describe('band computation', () => {
  it('assumes the youngest possible age for a birth year', () => {
    expect(youngestAge(2008, 2026)).toBe(17);
    expect(bandForYear(G, 2008, 2026)).toBe('minor');      // could be 18 already, could be 17: treated as 17
    expect(bandForYear(G, 2007, 2026)).toBe('adult');      // at least 18 in every case
    expect(bandForYear(G, 2009, 2026)).toBe('minor');      // 16 or 17
    expect(bandForYear(G, 2010, 2026)).toBe('blocked');    // 15 or 16 → under 16 possible
    expect(bandForYear(G, 2016, 2026)).toBe('blocked');    // under 13: blocked too, nothing ad-supported
  });
  it('the 18th-birthday boundary: a stored minor turns adult in the first year that is surely past it', () => {
    const r = recordFor(G, 2008, T0, 2026);
    expect(r).toEqual({ v: 1, answeredAt: T0, band: 'minor', adultFromYear: 2027 });
    expect(JSON.stringify(r)).not.toContain('2008');       // the birth year itself is not stored
    expect(bandOf(G, r, 2026)).toBe('minor');
    expect(bandOf(G, r, 2027)).toBe('adult');               // born 2008 → in 2027 at least 18
    expect(bandOf(G, r, 2025)).toBe('minor');
  });
  it('a blocked answer opens on its own when the player reaches 16, then 18', () => {
    const r = recordFor(G, 2011, T0, 2026);                 // youngest 14
    expect(bandOf(G, r, 2026)).toBe('blocked');
    expect(bandOf(G, r, 2027)).toBe('blocked');             // youngest 15
    expect(bandOf(G, r, 2028)).toBe('minor');               // youngest 16
    expect(bandOf(G, r, 2029)).toBe('minor');
    expect(bandOf(G, r, 2030)).toBe('adult');               // youngest 18
  });
  it('an adult answer stores no year and never goes back', () => {
    const r = recordFor(G, 1990, T0, 2026);
    expect(r).toEqual({ v: 1, answeredAt: T0, band: 'adult' });
    expect(bandOf(G, r, 2000)).toBe('adult');
  });
  it('accepts only plausible four-digit years', () => {
    expect(validBirthYear(G, 2026, 2026)).toBe(true);
    expect(validBirthYear(G, 2027, 2026)).toBe(false);
    expect(validBirthYear(G, 1916, 2026)).toBe(true);
    expect(validBirthYear(G, 1915, 2026)).toBe(false);
    expect(validBirthYear(G, NaN, 2026)).toBe(false);
    expect(validBirthYear(G, 1990.5, 2026)).toBe(false);
  });
  it('rejects corrupt records', () => {
    expect(decodeAge('{nope')).toBeNull();
    expect(decodeAge('{"v":1,"answeredAt":1,"band":"minor"}')).toBeNull();
    expect(decodeAge('{"v":1,"answeredAt":1,"band":"child"}')).toBeNull();
    expect(decodeAge(null)).toBeNull();
  });
});

function store(mem = new Map<string, string>(), year = 2026) {
  const bands: AgeBand[] = [];
  const s = new AgeGateStore({ cfg: G, kv: { read: async (k) => mem.get(k) ?? null, write: async (k, v) => { mem.set(k, v); } },
    now: () => T0, year: () => year, onBand: (b) => bands.push(b) });
  return { s, mem, bands };
}

describe('gate store', () => {
  it('asks once on a fresh install (and for players from before the gate), then never again', async () => {
    const a = store();
    await a.s.load();
    expect(a.s.getState()).toBe('ask');
    expect(ageGateDone(a.s.getState())).toBe(false);
    expect(a.s.submit(1990)).toBe(true);
    expect(a.s.getState()).toBe('adult');
    expect(ageGateDone(a.s.getState())).toBe(true);
    expect(a.s.submit(2012)).toBe(false);                   // no second answer
    expect(a.s.getState()).toBe('adult');
    await Promise.resolve();
    const b = store(a.mem);                                  // reload
    await b.s.load();
    expect(b.s.getState()).toBe('adult');
    expect(b.bands).toEqual(['adult']);
  });
  it('a minor answer persists across reload and flips to adult in time without asking', async () => {
    const a = store();
    await a.s.load();
    a.s.submit(2009);
    expect(a.bands).toEqual(['minor']);
    await Promise.resolve();
    const b = store(a.mem);
    await b.s.load();
    expect(b.s.getState()).toBe('minor');
    const later = store(a.mem, 2028);
    await later.s.load();
    expect(later.s.getState()).toBe('adult');
  });
  it('under 16 (and under 13): blocked, not done, cannot be re-answered', async () => {
    const a = store();
    await a.s.load();
    expect(a.s.submit(2015)).toBe(true);
    expect(a.s.getState()).toBe('blocked');
    expect(ageGateDone('blocked')).toBe(false);
    expect(a.s.submit(1980)).toBe(false);
    await Promise.resolve();
    const b = store(a.mem);
    await b.s.load();
    expect(b.s.getState()).toBe('blocked');
    expect(a.mem.get(AGE_GATE_KEY)).not.toContain('2015');
  });
  it('an invalid year is refused and the gate keeps asking', async () => {
    const a = store();
    await a.s.load();
    expect(a.s.submit(3000)).toBe(false);
    expect(a.s.getState()).toBe('ask');
    expect(a.mem.has(AGE_GATE_KEY)).toBe(false);
  });
});

// ── effect on the ad layer ─────────────────────────────────────────────────────
const game = (): AdGameContext => ({ stage: 'play', phase: 'answered', busy: false, auto: false, lifeNo: 2, lifeId: 'L1', age: 30, shownDays: 100,
  joyBp: 6000, negStreak: 0, nearMiss: false, pendingDeath: false, inDebt: false, monthlySalary: 4000, payday: true });
function service(platform: 'ios' | 'android' = 'ios') {
  const cfg: AdConfig = structuredClone(AD_CONFIG);
  const mem = new Map<string, string>();
  const clock = { now: T0 };
  const provider = new MockAdProvider({ cfg, region: () => 'TR' });
  const svc = new AdService({ cfg, provider, platform, kv: { read: async (k) => mem.get(k) ?? null, write: async (k, v) => { mem.set(k, v); } },
    now: () => clock.now, localDay: () => new Date(clock.now).toISOString().slice(0, 10), noAds: () => false, country: () => 'TR' });
  const sessions = async (n: number) => { await svc.ready(); svc.tickPlay(6 * MIN); for (let i = 1; i < n; i++) { clock.now += 7 * HOUR; svc.foreground(); svc.tickPlay(6 * MIN); } };
  return { svc, provider, sessions };
}

describe('age gate → ad layer', () => {
  it('before the gate is answered: no consent card, no ad, no offer, no SDK', async () => {
    const h = service();
    await h.sessions(4);
    expect(h.svc.ageKnown()).toBe(false);
    expect(h.svc.returnSlot(game(), 7 * HOUR)).toBeNull();
    expect(h.svc.offer('sponsor', game())).toBeNull();
    expect(h.provider.initialized).toBe(false);
  });
  it('minor: under-age tag on, personalisation locked off even if asked for, no ATT, privacy sheet has no switch', async () => {
    const h = service('ios');
    h.svc.setMinor(true);                                    // the gate answers before the ledger is read
    await h.sessions(2);
    expect(h.svc.returnSlot(game(), 7 * HOUR)).toBe('consent');
    await h.svc.runConsent();
    expect(h.svc.getConsent()).toMatchObject({ isMinor: true, adsPersonalized: false, att: 'skipped' });
    expect(h.provider.prefs).toMatchObject({ nonPersonalizedOnly: true, tagForUnderAgeOfConsent: true, maxAdContentRating: 'T' });
    // even a forged "yes" cannot personalise
    const forged = applyCardChoice(AD_CONFIG, h.svc.getConsent(), { personalized: true, adult: true }, 'TR', T0);
    expect(forged.adsPersonalized).toBe(false);
    expect(h.svc.privacyStatus()).toMatchObject({ minor: true, personalized: false });
    for (let i = 0; i < 3; i++) h.svc.foreground();
    expect(h.svc.returnSlot(game(), 7 * HOUR)).not.toBe('att');
  });
  it('minor: the interstitial / rewarded rules stay the ordinary ones (non-personalised ads, same caps)', async () => {
    const h = service('android');
    h.svc.setMinor(true);
    await h.sessions(2);
    await h.svc.runConsent();
    expect(h.svc.offer('sponsor', game())).toMatchObject({ placement: 'sponsor', free: false });
  });
  it('adult: personalisation possible after an explicit yes (no separate "over 18" question)', async () => {
    const h = service('android');
    h.svc.setMinor(false);
    await h.sessions(2);
    expect(h.svc.privacyStatus()).toMatchObject({ minor: false, adult: true });
  });
});
