/**
 * Consent model — pure (no React Native imports; unit-tested in node). D-104 (d): one `ConsentState`.
 *
 * Rule of thumb, everywhere: ads are NON-personalised until the player explicitly allows personalisation
 * (KVKK açık rıza / GDPR consent / our own card elsewhere), and on iOS additionally until ATT is authorised.
 * Nothing here is legal advice; the open questions for the lawyer are listed in docs/design/15 §8.
 */
import type { AdConfig } from './config';
import type { AdRequestPrefs, ConsentInfo, TrackingStatus } from './types';

export type Region = 'TR' | 'EEA' | 'US' | 'OTHER' | 'UNKNOWN';
export type AdPlatform = 'ios' | 'android' | 'web';

export interface ConsentState {
  v: 1;
  /** The player went through the consent step (whatever they answered). */
  resolved: boolean;
  resolvedAt: number;
  /** `cards`: our notice + explicit-consent cards · `ump`: Google's certified CMP form. */
  source: 'none' | 'cards' | 'ump';
  noticeVersion: number;
  region: Region;
  /** Explicit opt-in to personalised ads. Default false. */
  adsPersonalized: boolean;
  /** "I am over 18" ticked on our card (required before the personalisation switch can be turned on). */
  adultConfirmed: boolean;
  /** Known minor (16–17) from a neutral age gate (D-102). The gate itself is not part of this build; default false. */
  isMinor: boolean;
  /** iOS ATT. `skipped`: never asked because personalisation was declined or the player is a minor. */
  att: TrackingStatus | 'skipped';
}

export const emptyConsent = (): ConsentState => ({
  v: 1, resolved: false, resolvedAt: 0, source: 'none', noticeVersion: 0, region: 'UNKNOWN',
  adsPersonalized: false, adultConfirmed: false, isMinor: false, att: 'undetermined',
});

/** EU 27 + EEA (IS, LI, NO) + UK + CH — where Google's UMP form is required. */
const EEA = new Set(['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO',
  'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'UK', 'CH']);

export function regionOfCountry(cc: string | null | undefined): Region {
  const c = (cc ?? '').trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(c)) return 'UNKNOWN';
  if (c === 'TR') return 'TR';
  if (EEA.has(c)) return 'EEA';
  if (c === 'US') return 'US';
  return 'OTHER';
}

/** 'tr-TR' / 'en_US' / 'tr' → country code or null. */
export function countryOfLocaleTag(tag: string | null | undefined): string | null {
  const m = /^[a-zA-Z]{2,3}[-_](?:[a-zA-Z]{4}[-_])?([a-zA-Z]{2})\b/.exec(tag ?? '');
  return m ? m[1]!.toUpperCase() : null;
}

/** Personalised requests need: resolved consent + explicit opt-in + not a minor + (iOS) ATT authorised. */
export function personalizedAllowed(c: ConsentState, platform: AdPlatform): boolean {
  if (!c.resolved || !c.adsPersonalized || c.isMinor) return false;
  if (platform === 'ios' && c.att !== 'authorized') return false;
  return true;
}

export function requestPrefs(cfg: AdConfig, c: ConsentState, platform: AdPlatform): AdRequestPrefs {
  return {
    nonPersonalizedOnly: !personalizedAllowed(c, platform),
    tagForUnderAgeOfConsent: c.isMinor,
    tagForChildDirectedTreatment: cfg.request.tagForChildDirectedTreatment,
    maxAdContentRating: cfg.request.maxAdContentRating,
  };
}

/** Which consent UI a region gets (the consent matrix of docs/design/15 §5). */
export type ConsentStep = 'ump' | 'notice' | 'choice';
export function consentSteps(region: Region): ConsentStep[] {
  // EEA/UK/CH: Google's certified CMP. Elsewhere UMP is still queried (US state messages) but our own cards decide.
  return region === 'EEA' ? ['ump'] : ['notice', 'choice'];
}

/** The consent step is due: not resolved yet, or the notice text changed (D-105: no other re-ask, ever). */
export function consentDue(cfg: AdConfig, c: ConsentState, sessionCount: number): boolean {
  if (sessionCount < cfg.consent.minSessionCount) return false;
  return !c.resolved || c.noticeVersion < cfg.consent.noticeVersion;
}

/** The ATT pre-prompt is due (iOS only, once, never for minors, never after personalisation was declined). */
export function attDue(cfg: AdConfig, c: ConsentState, platform: AdPlatform, sessionCount: number): boolean {
  if (platform !== 'ios' || !c.resolved || c.isMinor || !c.adsPersonalized) return false;
  return c.att === 'undetermined' && sessionCount >= cfg.consent.attMinSessionCount;
}

/** The ad SDK may be started: consent step done, region not killed and (EEA) UMP says ads can be requested. */
export function sdkAllowed(cfg: AdConfig, c: ConsentState, ump: ConsentInfo | null): boolean {
  if (!cfg.enabled || cfg.kill.all || cfg.kill.regions.includes(c.region)) return false;
  if (!c.resolved) return false;
  if (c.source === 'ump') return !!ump?.canRequestAds;
  return true;
}

/** Result of our own two cards. Declining or leaving the switch off both mean: non-personalised. */
export function applyCardChoice(cfg: AdConfig, c: ConsentState, choice: { personalized: boolean; adult: boolean }, region: Region, now: number): ConsentState {
  const adult = choice.adult && !c.isMinor;
  const personalized = choice.personalized && adult;
  return { ...c, resolved: true, resolvedAt: now, source: 'cards', noticeVersion: cfg.consent.noticeVersion, region,
    adsPersonalized: personalized, adultConfirmed: adult, att: personalized ? (c.att === 'skipped' ? 'undetermined' : c.att) : 'skipped' };
}

export function applyUmp(cfg: AdConfig, c: ConsentState, info: ConsentInfo, region: Region, now: number): ConsentState {
  const personalized = info.status === 'obtained' && info.personalized && !c.isMinor;
  return { ...c, resolved: true, resolvedAt: now, source: 'ump', noticeVersion: cfg.consent.noticeVersion, region,
    adsPersonalized: personalized, att: personalized ? (c.att === 'skipped' ? 'undetermined' : c.att) : 'skipped' };
}

/** Known minor: personalisation off and locked, ATT never asked (D-102). */
export function applyMinor(c: ConsentState, isMinor: boolean): ConsentState {
  return isMinor ? { ...c, isMinor: true, adsPersonalized: false, adultConfirmed: false, att: 'skipped' } : { ...c, isMinor: false };
}
