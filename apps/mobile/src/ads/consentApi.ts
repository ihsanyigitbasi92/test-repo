/**
 * Stable consent surface for the rest of the app (analytics, attribution SDKs). ONE consent step and ONE iOS ATT
 * prompt exist in the app, both owned by the ad layer: other modules read the result here and never prompt
 * themselves (a second ATT request is impossible anyway — iOS shows the dialog once).
 *
 *   getConsent()            sync snapshot; everything false / 'undetermined' until the player has answered
 *   onConsentChange(cb)     fires after every change (consent step, ATT answer, privacy sheet, minor flag)
 *   requestTracking()       runs the shared ATT pre-prompt + system dialog if (and only if) it is due; returns the status
 */
import { Platform } from 'react-native';
import { personalizedAllowed, type AdPlatform, type Region } from './consent';
import type { AgeState } from './ageGate';
import { ads, ageGate } from './runtime';
import type { TrackingStatus } from './types';

export interface ConsentSnapshot {
  /** The player went through the consent step. Before that: no ad SDK, and nothing else should track either. */
  resolved: boolean;
  /** Explicit opt-in to personalised ads (KVKK açık rıza / UMP). Default false. */
  adsPersonalized: boolean;
  /** iOS App Tracking Transparency. `skipped`: never asked (no opt-in, or a minor). Android / web: 'unavailable' is not used — see `trackingAllowed`. */
  att: TrackingStatus | 'skipped';
  /** The one flag to gate any cross-app tracking / advertising-ID use on: opt-in + not a minor + (iOS) ATT authorised. */
  trackingAllowed: boolean;
  /** Under 18 by the neutral age gate (also true for `blocked`). Minors: no ad-id based measurement, no Meta SDK, no ATT. */
  isMinor: boolean;
  /** Age gate state. Until it is `adult` or `minor` NOTHING may be initialised (analytics, attribution, ads). */
  age: AgeState;
  region: Region;
}

const platform: AdPlatform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';
let memo: { key: unknown; age: AgeState; snap: ConsentSnapshot } | null = null;

export function getConsent(): ConsentSnapshot {
  const c = ads.getConsent();
  const age = ageGate.getState();
  if (memo?.key === c && memo.age === age) return memo.snap;                       // stable reference for useSyncExternalStore
  const snap: ConsentSnapshot = { resolved: c.resolved, adsPersonalized: c.adsPersonalized, att: c.att, trackingAllowed: personalizedAllowed(c, platform),
    isMinor: c.isMinor || age === 'blocked' || age === 'minor', age, region: c.region };
  memo = { key: c, age, snap };
  return snap;
}

export function onConsentChange(cb: () => void): () => void {
  const a = ads.subscribe(cb), b = ageGate.subscribe(cb);
  return () => { a(); b(); };
}

/** Shared ATT request. Does nothing (and returns the current status) unless the ad layer's own rules say it is due. */
export async function requestTracking(): Promise<ConsentSnapshot['att']> {
  await ads.ready();
  await ads.runAtt();
  return ads.getConsent().att;
}
