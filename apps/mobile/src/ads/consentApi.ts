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
import { ads } from './runtime';
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
  isMinor: boolean;
  region: Region;
}

const platform: AdPlatform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';
let memo: { key: unknown; snap: ConsentSnapshot } | null = null;

export function getConsent(): ConsentSnapshot {
  const c = ads.getConsent();
  if (memo?.key === c) return memo.snap;                       // stable reference for useSyncExternalStore
  const snap: ConsentSnapshot = { resolved: c.resolved, adsPersonalized: c.adsPersonalized, att: c.att, trackingAllowed: personalizedAllowed(c, platform),
    isMinor: c.isMinor, region: c.region };
  memo = { key: c, snap };
  return snap;
}

export function onConsentChange(cb: () => void): () => void { return ads.subscribe(cb); }

/** Shared ATT request. Does nothing (and returns the current status) unless the ad layer's own rules say it is due. */
export async function requestTracking(): Promise<ConsentSnapshot['att']> {
  await ads.ready();
  await ads.runAtt();
  return ads.getConsent().att;
}
