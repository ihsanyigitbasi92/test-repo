/**
 * Provider wiring — iOS / Android. AdMob when the binary contains the native module (a dev build / release made
 * with `expo prebuild`); the demo provider in Expo Go or any binary built without it. The check uses the
 * non-enforcing TurboModule lookup, so the AdMob JS package itself is not even required here: it is loaded
 * lazily inside AdMobProvider, after the consent gate (D-054: no ad SDK before consent).
 */
import { TurboModuleRegistry } from 'react-native';
import type { AdConfig } from './config';
import type { Region } from './consent';
import { AdMobProvider } from './AdMobProvider';
import { MockAdProvider } from './MockAdProvider';
import type { AdProvider } from './types';

export function createAdProvider(cfg: AdConfig, region: () => Region): AdProvider {
  let linked = false;
  try { linked = TurboModuleRegistry.get('RNGoogleMobileAdsModule') != null; } catch { linked = false; }
  if (!linked) { console.warn('[ads] AdMob native module missing: using the demo provider'); return new MockAdProvider({ cfg, region }); }
  return new AdMobProvider(cfg);
}
