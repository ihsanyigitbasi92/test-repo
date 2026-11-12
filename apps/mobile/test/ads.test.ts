/**
 * Ad layer (docs/design/15): placement caps / cooldowns, FTUE and grief quiet zones, the no-ads entitlement,
 * consent defaults. Pure logic + the service on the mock provider; nothing here touches React Native.
 */
import { describe, expect, it } from 'vitest';
import { AD_CONFIG, adUnitId, type AdConfig } from '../src/ads/config';
import {
  addPlay, canOfferRewarded, canShowInterstitial, emptyLedger, fulfilment, noteDeath, noteGrief, recordGrant, recordInterstitial, recordOffer,
  recordRewardedShown, rollDay, sponsorAmount, startSession,
  type AdEnv, type AdGameContext, type AdLedger, type InterstitialSlot,
} from '../src/ads/placements';
import {
  applyCardChoice, applyMinor, applyUmp, attDue, consentDue, consentSteps, countryOfLocaleTag, emptyConsent, personalizedAllowed, regionOfCountry,
  requestPrefs, sdkAllowed,
} from '../src/ads/consent';
import { AdService, ADS_KEY, decodeAds } from '../src/ads/adService';
import { MockAdProvider } from '../src/ads/MockAdProvider';
import { isGriefScene } from '../src/ads/gameContext';

const MIN = 60_000, HOUR = 60 * MIN;
const T0 = Date.UTC(2026, 10, 12, 9, 0, 0);
const cfg: AdConfig = structuredClone(AD_CONFIG);
const clone = (): AdConfig => structuredClone(AD_CONFIG);

/** A ledger past every FTUE gate: 3rd session, 30 min played. */
function seasoned(over: Partial<AdLedger> = {}): AdLedger {
  return { ...emptyLedger(T0 - 5 * 24 * HOUR, '2026-11-12'), sessionCount: 3, playMs: 30 * MIN, lastActiveAt: T0, ...over };
}
const env = (over: Partial<AdEnv> = {}): AdEnv => ({ now: T0, localDay: '2026-11-12', noAds: false, adsAllowed: true, ...over });
const game = (over: Partial<AdGameContext> = {}): AdGameContext => ({
  stage: 'play', phase: 'answered', busy: false, auto: false, lifeNo: 2, lifeId: 'L1', age: 30, shownDays: 100, joyBp: 6000, negStreak: 0,
  nearMiss: false, pendingDeath: false, inDebt: false, monthlySalary: 4000, payday: true, ...over,
});
const RETURN: InterstitialSlot = { kind: 'return', awayMs: 7 * HOUR };
const why = (d: { ok: boolean; reason?: string }) => (d.ok ? 'ok' : d.reason);

describe('config', () => {
  it('has no banner anywhere and ships Google test ad units', () => {
    expect(JSON.stringify(AD_CONFIG).toLowerCase()).not.toContain('banner');
    for (const p of ['ios', 'android'] as const) for (const f of ['rewarded', 'interstitial'] as const) expect(adUnitId(p, f)).toMatch(/^ca-app-pub-3940256099942544\//);
  });
  it('pins the content rating to T and never tags the app as child-directed', () => {
    expect(AD_CONFIG.request.maxAdContentRating).toBe('T');
    expect(AD_CONFIG.request.tagForChildDirectedTreatment).toBe(false);
    for (const c of ['gambling_betting', 'alcohol', 'dating', 'politics']) expect(AD_CONFIG.request.blockedCategories).toContain(c);
  });
  it('keeps the placements the design switched off switched off (D-085)', () => {
    const p = AD_CONFIG.rewarded.placements;
    expect([p.sponsor.enabled, p.extraPractice.enabled, p.tactic.enabled, p.physio.enabled]).toEqual([true, false, false, false]);
  });
});

describe('interstitial — return slot only (D-084)', () => {
  it('shows on a return after a long break once every gate is passed', () => {
    expect(why(canShowInterstitial(cfg, seasoned(), env(), game(), RETURN))).toBe('ok');
  });
  it('never comes from anywhere but the return slot (so never over a card, a choice or "Enough for today")', () => {
    expect(why(canShowInterstitial(cfg, seasoned(), env(), game(), null))).toBe('notReturnSlot');
    expect(why(canShowInterstitial(cfg, seasoned(), env(), game({ phase: 'day' }), null))).toBe('notReturnSlot');
  });
  it('never in the first sessions / first 10 minutes (FTUE)', () => {
    expect(why(canShowInterstitial(cfg, seasoned({ sessionCount: 1 }), env(), game(), RETURN))).toBe('ftueSession');
    expect(why(canShowInterstitial(cfg, seasoned({ sessionCount: 2 }), env(), game(), RETURN))).toBe('ftueSession');
    expect(why(canShowInterstitial(cfg, seasoned({ playMs: 9 * MIN }), env(), game(), RETURN))).toBe('ftuePlayTime');
  });
  it('needs a real break (6 h away)', () => {
    expect(why(canShowInterstitial(cfg, seasoned(), env(), game(), { kind: 'return', awayMs: 5 * HOUR }))).toBe('away');
  });
  it('never in the death flow, on the Client File, on the birthday report or with a deferred death pending', () => {
    expect(why(canShowInterstitial(cfg, seasoned(), env(), game({ stage: 'death' }), RETURN))).toBe('death');
    expect(why(canShowInterstitial(cfg, seasoned(), env(), game({ stage: 'file', lifeId: null }), RETURN))).toBe('stage');
    expect(why(canShowInterstitial(cfg, seasoned(), env(), game({ phase: 'dead' }), RETURN))).toBe('death');
    expect(why(canShowInterstitial(cfg, seasoned(), env(), game({ phase: 'birthday' }), RETURN))).toBe('birthday');
    expect(why(canShowInterstitial(cfg, seasoned(), env(), game({ pendingDeath: true }), RETURN))).toBe('death');
  });
  it('never around a grief scene: 3 shown days after it, and 5 real minutes after any loss', () => {
    const l = noteGrief(seasoned(), 'L1', 99, T0 - HOUR);
    expect(why(canShowInterstitial(cfg, l, env(), game({ shownDays: 100 }), RETURN))).toBe('grief');
    expect(why(canShowInterstitial(cfg, l, env(), game({ shownDays: 101 }), RETURN))).toBe('grief');
    expect(why(canShowInterstitial(cfg, l, env(), game({ shownDays: 102 }), RETURN))).toBe('ok');
    expect(why(canShowInterstitial(cfg, l, env(), game({ shownDays: 100, lifeId: 'L2' }), RETURN))).toBe('ok');      // another life
    const fresh = noteDeath(seasoned(), T0 - 2 * MIN);
    expect(why(canShowInterstitial(cfg, fresh, env(), game(), RETURN))).toBe('lossQuiet');
  });
  it('never while joy is low (D-052)', () => {
    expect(why(canShowInterstitial(cfg, seasoned(), env(), game({ joyBp: 1400 }), RETURN))).toBe('lowJoy');
  });
  it('needs the consent step to be done', () => {
    expect(why(canShowInterstitial(cfg, seasoned(), env({ adsAllowed: false }), game(), RETURN))).toBe('consent');
  });
  it('caps: 1 per session, 2 per local day, 5 minutes apart', () => {
    let l = recordInterstitial(seasoned(), env());
    expect(why(canShowInterstitial(cfg, l, env({ now: T0 + HOUR }), game(), RETURN))).toBe('sessionCap');
    l = startSession(cfg, l, T0 + 7 * HOUR, '2026-11-12');                                 // new session, same day
    expect(l.sessionCount).toBe(4);
    expect(why(canShowInterstitial(cfg, l, env({ now: T0 + 7 * HOUR }), game(), RETURN))).toBe('ok');
    l = recordInterstitial(l, env({ now: T0 + 7 * HOUR }));
    l = startSession(cfg, l, T0 + 14 * HOUR, '2026-11-12');
    expect(why(canShowInterstitial(cfg, l, env({ now: T0 + 14 * HOUR }), game(), RETURN))).toBe('dailyCap');
    l = startSession(cfg, l, T0 + 24 * HOUR, '2026-11-13');                                // next local day
    expect(why(canShowInterstitial(cfg, l, env({ now: T0 + 24 * HOUR, localDay: '2026-11-13' }), game(), RETURN))).toBe('ok');
    // minGap: a second session inside the gap (config with a short session gap)
    const quick = clone(); quick.interstitial.perSession = 9;
    const g = recordInterstitial(seasoned(), env());
    expect(why(canShowInterstitial(quick, g, env({ now: T0 + 4 * MIN }), game(), RETURN))).toBe('gap');
    expect(why(canShowInterstitial(quick, g, env({ now: T0 + 6 * MIN }), game(), RETURN))).toBe('ok');
  });
  it('close-and-reopen is the same session; a clock set back never resets the day', () => {
    const l = recordInterstitial(seasoned(), env());
    expect(startSession(cfg, l, T0 + 10 * MIN, '2026-11-12').sessionCount).toBe(3);
    expect(startSession(cfg, l, T0 + 31 * MIN, '2026-11-12').sessionCount).toBe(4);
    expect(rollDay(l, '2026-11-11')).toBe(l);
    expect(rollDay(l, '2026-11-13').interstitialToday).toBe(0);
  });
  it('the no-ads entitlement and the kill switch suppress it', () => {
    expect(why(canShowInterstitial(cfg, seasoned(), env({ noAds: true }), game(), RETURN))).toBe('noAds');
    const k = clone(); k.kill.interstitial = true;
    expect(why(canShowInterstitial(k, seasoned(), env(), game(), RETURN))).toBe('kill');
    const off = clone(); off.enabled = false;
    expect(why(canShowInterstitial(off, seasoned(), env(), game(), RETURN))).toBe('disabled');
  });
  it('harness: 5.000 random return attempts never break a cap', () => {
    let seed = 42;
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    let l = emptyLedger(T0, '2026-11-12'), now = T0;
    const shownAt: { now: number; day: string; session: number }[] = [];
    for (let i = 0; i < 5000; i++) {
      now += Math.floor(rnd() * 3 * HOUR);
      const d = new Date(now), day = d.toISOString().slice(0, 10);
      l = addPlay(startSession(cfg, l, now, day), Math.floor(rnd() * 8 * MIN), now);
      const g = game({ phase: rnd() < 0.2 ? 'birthday' : rnd() < 0.5 ? 'day' : 'answered', stage: rnd() < 0.1 ? 'death' : 'play' });
      const e = env({ now, localDay: day });
      const slot: InterstitialSlot | null = rnd() < 0.8 ? { kind: 'return', awayMs: Math.floor(rnd() * 12 * HOUR) } : null;
      if (canShowInterstitial(cfg, l, e, g, slot).ok) {
        expect(g.stage).toBe('play'); expect(g.phase).not.toBe('birthday'); expect(slot!.awayMs).toBeGreaterThanOrEqual(6 * HOUR);
        expect(l.sessionCount).toBeGreaterThanOrEqual(3); expect(l.playMs).toBeGreaterThanOrEqual(10 * MIN);
        shownAt.push({ now, day, session: l.sessionCount });
        l = recordInterstitial(l, e);
      }
    }
    expect(shownAt.length).toBeGreaterThan(10);
    const perDay = new Map<string, number>(), perSession = new Map<number, number>();
    for (const s of shownAt) { perDay.set(s.day, (perDay.get(s.day) ?? 0) + 1); perSession.set(s.session, (perSession.get(s.session) ?? 0) + 1); }
    expect(Math.max(...perDay.values())).toBeLessThanOrEqual(2);
    expect(Math.max(...perSession.values())).toBe(1);
    for (let i = 1; i < shownAt.length; i++) expect(shownAt[i]!.now - shownAt[i - 1]!.now).toBeGreaterThanOrEqual(5 * MIN);
  });
});

describe('rewarded — Forma Sponsoru offer (D-039 caps, D-085 shape)', () => {
  const offer = (l: AdLedger, e: AdEnv = env(), g: AdGameContext = game()) => why(canOfferRewarded(cfg, l, e, g, 'sponsor'));
  it('is offered on an ordinary payday to a solvent, employed player', () => {
    expect(offer(seasoned())).toBe('ok');
    expect(sponsorAmount(cfg, 4000)).toBe(6000);            // 25 % of six months' salary
    expect(sponsorAmount(cfg, 0)).toBe(0);
  });
  it('never in the first session, the first 10 minutes or the first (hand-written) year of the first life', () => {
    expect(offer(seasoned({ sessionCount: 1 }))).toBe('ftueSession');
    expect(offer(seasoned({ playMs: 5 * MIN }))).toBe('ftuePlayTime');
    expect(offer(seasoned(), env(), game({ lifeNo: 1, age: 18 }))).toBe('ftueYear');
    expect(offer(seasoned(), env(), game({ lifeNo: 1, age: 19 }))).toBe('ok');
  });
  it('never next to an open choice, on the birthday report, while lines are playing, in the death flow or in auto mode', () => {
    expect(offer(seasoned(), env(), game({ phase: 'day' }))).toBe('decision');
    expect(offer(seasoned(), env(), game({ phase: 'birthday' }))).toBe('birthday');
    expect(offer(seasoned(), env(), game({ busy: true }))).toBe('busy');
    expect(offer(seasoned(), env(), game({ stage: 'death' }))).toBe('death');
    expect(offer(seasoned(), env(), game({ phase: 'dead' }))).toBe('death');
    expect(offer(seasoned(), env(), game({ auto: true }))).toBe('auto');
  });
  it('never around grief, after a loss, on low joy, on a negative streak or a near-miss day', () => {
    expect(offer(noteGrief(seasoned(), 'L1', 99, T0 - HOUR), env(), game({ shownDays: 100 }))).toBe('grief');
    expect(offer(noteGrief(seasoned(), 'L1', 90, T0 - MIN), env(), game({ shownDays: 100 }))).toBe('lossQuiet');
    expect(offer(seasoned(), env(), game({ pendingDeath: true }))).toBe('death');
    expect(offer(seasoned(), env(), game({ joyBp: 1000 }))).toBe('lowJoy');
    expect(offer(seasoned(), env(), game({ negStreak: 2 }))).toBe('negStreak');
    expect(offer(seasoned(), env(), game({ nearMiss: true }))).toBe('nearMiss');
  });
  it('is never pain relief: no offer in debt, without a job, after 59 or off payday', () => {
    expect(offer(seasoned(), env(), game({ inDebt: true }))).toBe('debt');
    expect(offer(seasoned(), env(), game({ monthlySalary: 0 }))).toBe('noJob');
    expect(offer(seasoned(), env(), game({ age: 60 }))).toBe('age');
    expect(offer(seasoned(), env(), game({ payday: false }))).toBe('noTrigger');
  });
  it('caps: one offer per session, 2 character years between grants, 1 per local day', () => {
    expect(offer(recordOffer(seasoned()))).toBe('sessionCap');
    const granted = recordGrant(recordRewardedShown(seasoned(), env()), env(), 'sponsor', { lifeId: 'L1', age: 30 });
    const later = env({ now: T0 + 3 * MIN });
    expect(offer(granted, later)).toBe('placementDailyCap');
    const nextDay = env({ now: T0 + 24 * HOUR, localDay: '2026-11-13' });
    expect(offer(granted, nextDay, game({ age: 31 }))).toBe('yearGap');
    expect(offer(granted, nextDay, game({ age: 32 }))).toBe('ok');
    expect(offer(granted, nextDay, game({ age: 30, lifeId: 'L2' }))).toBe('ok');           // a new life starts clean
  });
  it('global caps: 6 rewarded per local day, 120 s between two shows', () => {
    let l = seasoned();
    for (let i = 0; i < 6; i++) l = recordRewardedShown(l, env({ now: T0 + i * 3 * MIN }));
    expect(offer(l, env({ now: T0 + HOUR }))).toBe('dailyCap');
    expect(offer(l, env({ now: T0 + 24 * HOUR, localDay: '2026-11-13' }))).toBe('ok');
    const one = recordRewardedShown(seasoned(), env());
    expect(offer(one, env({ now: T0 + 119_000 }))).toBe('cooldown');
    expect(offer(one, env({ now: T0 + 121_000 }))).toBe('ok');
  });
  it('placements the design switched off are never offered; the kill switch closes the rest', () => {
    for (const p of ['extraPractice', 'tactic', 'physio'] as const) expect(why(canOfferRewarded(cfg, seasoned(), env(), game(), p))).toBe('disabled');
    const k = clone(); k.kill.placements = ['sponsor'];
    expect(why(canOfferRewarded(k, seasoned(), env(), game(), 'sponsor'))).toBe('kill');
  });
  it('per-life and per-day placement caps hold for the disabled placements too (when switched on)', () => {
    const on = clone(); on.rewarded.placements.physio.enabled = true; on.rewarded.placements.tactic.enabled = true;
    const e = env({ now: T0 + HOUR });
    const physio = recordGrant(seasoned(), env(), 'physio', { lifeId: 'L1', age: 40 });
    expect(why(canOfferRewarded(on, physio, e, game(), 'physio'))).toBe('lifeCap');
    expect(why(canOfferRewarded(on, physio, e, game({ lifeId: 'L2' }), 'physio'))).toBe('ok');
    let tactic = recordGrant(seasoned(), env(), 'tactic', { lifeId: 'L1', age: 40 });
    expect(why(canOfferRewarded(on, tactic, e, game(), 'tactic'))).toBe('ok');
    tactic = recordGrant(tactic, env(), 'tactic', { lifeId: 'L1', age: 40 });
    expect(why(canOfferRewarded(on, tactic, e, game(), 'tactic'))).toBe('placementDailyCap');
  });
  it('no-ads owners keep the same opt-in offer and still watch the ad (default, 06 §2.2.2 / D-038)', () => {
    expect(AD_CONFIG.rewarded.noAdsMode).toBe('showAd');
    expect(offer(seasoned(), env({ noAds: true }))).toBe('ok');
    expect(fulfilment(cfg, { noAds: true })).toBe('ad');
    expect(fulfilment(cfg, { noAds: false })).toBe('ad');
    expect(offer(seasoned(), env({ adsAllowed: false }))).toBe('consent');
    expect(offer(seasoned(), env({ adsAllowed: false, noAds: true }))).toBe('consent');
  });
  it('optional mode `grantWithoutAd`: the reward is granted without an ad, so no ad consent is needed', () => {
    const free = clone(); free.rewarded.noAdsMode = 'grantWithoutAd';
    expect(fulfilment(free, { noAds: true })).toBe('free');
    expect(fulfilment(free, { noAds: false })).toBe('ad');
    expect(why(canOfferRewarded(free, seasoned(), env({ adsAllowed: false, noAds: true }), game(), 'sponsor'))).toBe('ok');
    expect(why(canOfferRewarded(free, seasoned(), env({ adsAllowed: false }), game(), 'sponsor'))).toBe('consent');
  });
});

describe('consent', () => {
  it('maps countries to consent regions', () => {
    expect([regionOfCountry('TR'), regionOfCountry('de'), regionOfCountry('GB'), regionOfCountry('CH'), regionOfCountry('US'), regionOfCountry('JP'), regionOfCountry(null), regionOfCountry('x')])
      .toEqual(['TR', 'EEA', 'EEA', 'EEA', 'US', 'OTHER', 'UNKNOWN', 'UNKNOWN']);
    expect([countryOfLocaleTag('tr-TR'), countryOfLocaleTag('en_US'), countryOfLocaleTag('zh-Hans-CN'), countryOfLocaleTag('tr')]).toEqual(['TR', 'US', 'CN', null]);
    expect(consentSteps('EEA')).toEqual(['ump']);
    for (const r of ['TR', 'US', 'OTHER', 'UNKNOWN'] as const) expect(consentSteps(r)).toEqual(['notice', 'choice']);
  });
  it('defaults to NON-personalised ads without consent, on every platform', () => {
    for (const p of ['ios', 'android', 'web'] as const) {
      const prefs = requestPrefs(cfg, emptyConsent(), p);
      expect(prefs).toEqual({ nonPersonalizedOnly: true, tagForUnderAgeOfConsent: false, tagForChildDirectedTreatment: false, maxAdContentRating: 'T' });
    }
    expect(sdkAllowed(cfg, emptyConsent(), null)).toBe(false);          // and no SDK at all before the consent step
  });
  it('declining (or saving with the switch off) keeps ads non-personalised and still lets them run', () => {
    const declined = applyCardChoice(cfg, emptyConsent(), { personalized: false, adult: false }, 'TR', T0);
    expect(declined.resolved).toBe(true);
    expect(requestPrefs(cfg, declined, 'android').nonPersonalizedOnly).toBe(true);
    expect(sdkAllowed(cfg, declined, null)).toBe(true);
    expect(declined.att).toBe('skipped');                               // no ATT prompt after a "no"
  });
  it('personalisation needs the adult tick, and on iOS also ATT', () => {
    const noAdult = applyCardChoice(cfg, emptyConsent(), { personalized: true, adult: false }, 'TR', T0);
    expect(noAdult.adsPersonalized).toBe(false);
    const yes = applyCardChoice(cfg, emptyConsent(), { personalized: true, adult: true }, 'TR', T0);
    expect(personalizedAllowed(yes, 'android')).toBe(true);
    expect(personalizedAllowed(yes, 'ios')).toBe(false);
    expect(personalizedAllowed({ ...yes, att: 'authorized' }, 'ios')).toBe(true);
    expect(personalizedAllowed({ ...yes, att: 'denied' }, 'ios')).toBe(false);
  });
  it('ATT pre-prompt: iOS only, from the 3rd session, only after an opt-in, once', () => {
    const yes = applyCardChoice(cfg, emptyConsent(), { personalized: true, adult: true }, 'TR', T0);
    expect(attDue(cfg, yes, 'ios', 2)).toBe(false);
    expect(attDue(cfg, yes, 'ios', 3)).toBe(true);
    expect(attDue(cfg, yes, 'android', 3)).toBe(false);
    expect(attDue(cfg, { ...yes, att: 'denied' }, 'ios', 9)).toBe(false);
    const no = applyCardChoice(cfg, emptyConsent(), { personalized: false, adult: true }, 'TR', T0);
    expect(attDue(cfg, no, 'ios', 9)).toBe(false);
  });
  it('a known minor: personalisation locked off, under-age tag on, no ATT', () => {
    const minor = applyMinor(applyCardChoice(cfg, emptyConsent(), { personalized: true, adult: true }, 'TR', T0), true);
    expect(requestPrefs(cfg, minor, 'android')).toMatchObject({ nonPersonalizedOnly: true, tagForUnderAgeOfConsent: true });
    expect(attDue(cfg, minor, 'ios', 9)).toBe(false);
    expect(applyCardChoice(cfg, minor, { personalized: true, adult: true }, 'TR', T0).adsPersonalized).toBe(false);
  });
  it('EEA: the UMP answer decides; ads only when UMP says they can be requested', () => {
    const ok = applyUmp(cfg, emptyConsent(), { status: 'obtained', canRequestAds: true, privacyOptionsRequired: true, personalized: false }, 'EEA', T0);
    expect(requestPrefs(cfg, ok, 'android').nonPersonalizedOnly).toBe(true);
    expect(sdkAllowed(cfg, ok, { status: 'obtained', canRequestAds: true, privacyOptionsRequired: true, personalized: false })).toBe(true);
    expect(sdkAllowed(cfg, ok, { status: 'required', canRequestAds: false, privacyOptionsRequired: true, personalized: false })).toBe(false);
    expect(sdkAllowed(cfg, ok, null)).toBe(false);
  });
  it('is asked from the 2nd session, once; again only when the notice version changes (D-105)', () => {
    expect(consentDue(cfg, emptyConsent(), 1)).toBe(false);
    expect(consentDue(cfg, emptyConsent(), 2)).toBe(true);
    const done = applyCardChoice(cfg, emptyConsent(), { personalized: false, adult: false }, 'TR', T0);
    expect(consentDue(cfg, done, 50)).toBe(false);
    const v2 = clone(); v2.consent.noticeVersion = 2;
    expect(consentDue(v2, done, 50)).toBe(true);
  });
  it('a region on the kill list never starts the SDK (D-103 gate)', () => {
    const k = clone(); k.kill.regions = ['TR'];
    const done = applyCardChoice(k, emptyConsent(), { personalized: false, adult: false }, 'TR', T0);
    expect(sdkAllowed(k, done, null)).toBe(false);
  });
});

describe('grief scenes', () => {
  it('are recognised by the engine grief tags and loss cards', () => {
    expect(isGriefScene(['aile', 'cenaze_taziye'])).toBe(true);
    expect(isGriefScene(['loss:mom'])).toBe(true);
    expect(isGriefScene(['yas'])).toBe(true);
    expect(isGriefScene(['aile', 'anne'])).toBe(false);
    expect(isGriefScene(undefined)).toBe(false);
  });
});

// ── the service on the mock provider ─────────────────────────────────────────
function harness(o: { noAds?: boolean; country?: string | null; platform?: 'ios' | 'android' | 'web'; fill?: boolean; headlessRewarded?: boolean; cfg?: AdConfig } = {}) {
  const c = o.cfg ?? clone();
  const mem = new Map<string, string>();
  const clock = { now: T0, noAds: !!o.noAds, fill: o.fill ?? true };
  const provider = new MockAdProvider({ cfg: c, region: () => svc.region(), fill: () => clock.fill, headlessRewarded: o.headlessRewarded });
  const svc: AdService = new AdService({
    cfg: c, provider, platform: o.platform ?? 'android',
    kv: { read: async (k) => mem.get(k) ?? null, write: async (k, v) => { mem.set(k, v); } },
    now: () => clock.now, localDay: () => new Date(clock.now).toISOString().slice(0, 10),
    noAds: () => clock.noAds, country: () => (o.country === undefined ? 'TR' : o.country),
  });
  return { svc, provider, clock, mem, cfg: c };
}
/** Sessions 1..n, each after a 7 h break with 6 minutes of play. */
async function sessions(h: ReturnType<typeof harness>, n: number): Promise<void> {
  await h.svc.ready();
  h.svc.tickPlay(6 * MIN);
  for (let i = 1; i < n; i++) { h.clock.now += 7 * HOUR; h.svc.foreground(); h.svc.tickPlay(6 * MIN); }
}

describe('AdService (mock provider)', () => {
  it('first session: no SDK, no consent card, no interstitial, no offer', async () => {
    const h = harness();
    await sessions(h, 1);
    expect(h.svc.getLedger().sessionCount).toBe(1);
    expect(h.svc.returnSlot(game(), 7 * HOUR)).toBeNull();
    expect(h.svc.offer('sponsor', game())).toBeNull();
    expect(h.provider.initialized).toBe(false);
  });
  it('second session: the consent step comes first; nothing is initialised or shown before it', async () => {
    const h = harness();
    await sessions(h, 2);
    expect(h.svc.returnSlot(game(), 7 * HOUR)).toBe('consent');
    expect(h.provider.initialized).toBe(false);
    expect(await h.svc.showInterstitial(game(), RETURN)).toBe(false);
    await h.svc.runReturnSlot('consent', game(), 7 * HOUR);            // headless: the card is declined
    expect(h.svc.getConsent()).toMatchObject({ resolved: true, source: 'cards', adsPersonalized: false, region: 'TR' });
    expect(h.provider.initialized).toBe(true);
    expect(h.provider.prefs).toMatchObject({ nonPersonalizedOnly: true, maxAdContentRating: 'T', tagForChildDirectedTreatment: false });
    expect(h.svc.returnSlot(game(), 7 * HOUR)).toBeNull();             // session 2: still no interstitial
  });
  it('third session: one interstitial at the return slot, non-personalised, then the session cap', async () => {
    const h = harness();
    await sessions(h, 2);
    await h.svc.runConsent();
    h.clock.now += 7 * HOUR; h.svc.foreground(); h.svc.tickPlay(MIN);
    expect(h.svc.returnSlot(game(), 7 * HOUR)).toBe('interstitial');
    expect(h.svc.returnSlot(game({ phase: 'birthday' }), 7 * HOUR)).toBeNull();
    expect(h.svc.returnSlot(game({ stage: 'death' }), 7 * HOUR)).toBeNull();
    await h.svc.runReturnSlot('interstitial', game(), 7 * HOUR);
    expect(h.provider.requests).toEqual([{ format: 'interstitial', placement: 'return', prefs: expect.objectContaining({ nonPersonalizedOnly: true }) }]);
    expect(h.svc.returnSlot(game(), 7 * HOUR)).toBeNull();
    expect(decodeAds(h.mem.get(ADS_KEY))?.ledger.interstitialToday).toBe(1);   // persisted
  });
  it('rewarded: watched to the end → reward and caps move; request is non-personalised by default', async () => {
    const h = harness();
    await sessions(h, 2);
    await h.svc.runConsent();
    const offer = h.svc.offer('sponsor', game());
    expect(offer).toEqual({ placement: 'sponsor', amount: 6000, free: false });
    expect(h.svc.offer('sponsor', game())).toBeNull();                 // one offer per session
    const r = await h.svc.claim(offer!, game());
    expect(r).toEqual({ rewarded: true });
    expect(h.provider.requests.at(-1)).toMatchObject({ format: 'rewarded', placement: 'sponsor', prefs: { nonPersonalizedOnly: true } });
    expect(h.svc.getLedger()).toMatchObject({ rewardedToday: 1, placements: { sponsor: { today: 1, inLife: 1, lastAge: 30 } } });
  });
  it('rewarded: closed early → no reward, placement cap untouched; no-fill → no reward, nothing spent', async () => {
    const closed = harness({ headlessRewarded: false });
    await sessions(closed, 2); await closed.svc.runConsent();
    const o1 = closed.svc.offer('sponsor', game())!;
    expect(await closed.svc.claim(o1, game())).toEqual({ rewarded: false, reason: 'closed' });
    expect(closed.svc.getLedger().placements.sponsor).toBeUndefined();
    expect(closed.svc.getLedger().rewardedToday).toBe(1);

    const dry = harness();
    await sessions(dry, 2); await dry.svc.runConsent();
    const o2 = dry.svc.offer('sponsor', game())!;
    dry.clock.fill = false;                                            // the ad disappears between offer and tap
    expect(await dry.svc.claim(o2, game())).toEqual({ rewarded: false, reason: 'noFill' });
    expect(dry.svc.getLedger()).toMatchObject({ rewardedToday: 0, lastRewardedAt: 0 });
    expect(dry.svc.offer('sponsor', game())).toBeNull();               // and no offer without an ad behind it
  });
  it('no-ads entitlement (default mode): interstitials never show; the rewarded offer stays opt-in and shows the ad', async () => {
    const h = harness({ noAds: true });
    await sessions(h, 4);
    expect(h.svc.returnSlot(game(), 7 * HOUR)).toBe('consent');        // rewarded ads still need the consent step
    await h.svc.runConsent();
    expect(h.svc.returnSlot(game(), 7 * HOUR)).toBeNull();
    expect(await h.svc.showInterstitial(game(), RETURN)).toBe(false);
    expect(h.svc.interstitialDecision(game(), RETURN)).toEqual({ ok: false, reason: 'noAds' });
    const offer = h.svc.offer('sponsor', game());
    expect(offer).toEqual({ placement: 'sponsor', amount: 6000, free: false });
    expect(h.provider.requests).toEqual([]);                           // nothing until the player taps "watch"
    expect(await h.svc.claim(offer!, game())).toEqual({ rewarded: true });
    expect(h.provider.requests.map((r) => r.format)).toEqual(['rewarded']);   // never an interstitial
    expect(h.svc.privacyStatus()).toMatchObject({ noAds: true, noAdsFree: false });
  });
  it('no-ads entitlement (optional `grantWithoutAd` mode): the reward is granted without showing an ad, same caps', async () => {
    const free = clone(); free.rewarded.noAdsMode = 'grantWithoutAd';
    const h = harness({ noAds: true, cfg: free });
    await sessions(h, 4);
    expect(h.svc.returnSlot(game(), 7 * HOUR)).toBeNull();             // not even the ad consent card
    expect(await h.svc.showInterstitial(game(), RETURN)).toBe(false);
    expect(h.svc.interstitialDecision(game(), RETURN)).toEqual({ ok: false, reason: 'noAds' });
    const offer = h.svc.offer('sponsor', game());
    expect(offer).toEqual({ placement: 'sponsor', amount: 6000, free: true });
    expect(await h.svc.claim(offer!, game())).toEqual({ rewarded: true });
    expect(h.provider.requests).toEqual([]);                           // nothing was shown
    expect(h.provider.initialized).toBe(false);                        // the SDK never even started
    expect(h.svc.getLedger()).toMatchObject({ rewardedToday: 1, placements: { sponsor: { inLife: 1 } } });   // same caps as everyone
  });
  it('buying no-ads mid-session stops the interstitial at once', async () => {
    const h = harness();
    await sessions(h, 2); await h.svc.runConsent();
    h.clock.now += 7 * HOUR; h.svc.foreground();
    expect(h.svc.returnSlot(game(), 7 * HOUR)).toBe('interstitial');
    h.clock.noAds = true;
    expect(h.svc.returnSlot(game(), 7 * HOUR)).toBeNull();
    expect(await h.svc.showInterstitial(game(), RETURN)).toBe(false);
  });
  it('EEA: the (mock) UMP form decides; refusing keeps ads non-personalised', async () => {
    const h = harness({ country: 'DE' });
    await sessions(h, 2);
    expect(h.svc.returnSlot(game(), 7 * HOUR)).toBe('consent');
    await h.svc.runConsent();                                          // headless UMP: not consented
    expect(h.svc.getConsent()).toMatchObject({ resolved: true, source: 'ump', region: 'EEA', adsPersonalized: false });
    expect(h.svc.prefs().nonPersonalizedOnly).toBe(true);
    expect(h.svc.privacyStatus().ump).toBe(true);
  });
  it('iOS: ATT is asked once, from the 3rd session, only after an opt-in', async () => {
    const h = harness({ platform: 'ios' });
    await sessions(h, 3);
    await h.svc.runConsent();                                          // declined → att skipped
    expect(h.svc.returnSlot(game(), 7 * HOUR)).not.toBe('att');
    const c = h.svc.getConsent();
    (h.svc as unknown as { consentState: typeof c }).consentState = applyCardChoice(h.cfg, c, { personalized: true, adult: true }, 'TR', T0);
    expect(h.svc.returnSlot(game(), 7 * HOUR)).toBe('att');
    await h.svc.runAtt();                                              // mock: tracking unavailable → treated as denied
    expect(h.svc.getConsent().att).toBe('denied');
    expect(h.svc.prefs().nonPersonalizedOnly).toBe(true);
    expect(h.svc.returnSlot(game(), 7 * HOUR)).not.toBe('att');
  });
  it('a known minor gets the under-age tag on every request', async () => {
    const h = harness();
    await sessions(h, 2); await h.svc.runConsent();
    h.svc.setMinor(true);
    expect(h.provider.prefs).toMatchObject({ nonPersonalizedOnly: true, tagForUnderAgeOfConsent: true });
  });
  it('survives a corrupt store', async () => {
    const h = harness();
    h.mem.set(ADS_KEY, '{nope');
    await h.svc.ready();
    expect(h.svc.getLedger().sessionCount).toBe(1);
    expect(decodeAds('{"v":2}')).toBeNull();
  });
});
