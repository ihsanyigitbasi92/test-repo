/**
 * Provider wiring — iOS / Android.
 *   Firebase  when the binary contains React Native Firebase (built with the owner's google-services files)
 *   Meta      when the binary contains the Meta SDK and app.json carries a real app id + client token
 *   Debug     development builds only: console echo of what the analytics purpose receives
 * A binary without the native modules (Expo Go, a build made before the config files were dropped in) simply has
 * no external sink: the game is identical. The SDK packages themselves are required lazily, after consent.
 */
import { Platform } from 'react-native';
import { ANALYTICS_CONFIG } from './config';
import { firebaseLinked, loadFirebaseSdk } from './firebaseSdk';
import { loadMetaSdk, metaLinked } from './metaSdk';
import { DebugBuffer, DebugProvider } from './providers/DebugProvider';
import { FirebaseProvider } from './providers/FirebaseProvider';
import { MetaProvider } from './providers/MetaProvider';
import type { AnalyticsProvider } from './providers/types';

export const ANALYTICS_DEBUG: boolean = __DEV__;
export const debugBuffer = new DebugBuffer(500, __DEV__ ? (e) => { if (e.kind === 'event') console.log(`[analytics] ${e.sink} ${e.name}`, e.params); } : null);

export function createProviders(): AnalyticsProvider[] {
  const out: AnalyticsProvider[] = [];
  if (firebaseLinked()) out.push(new FirebaseProvider({ load: loadFirebaseSdk, skip: ANALYTICS_CONFIG.admobLinked ? ['ad_impression'] : [] }));
  else console.warn('[analytics] Firebase native module missing: no analytics sink in this binary');
  if (ANALYTICS_CONFIG.metaConfigured && metaLinked()) out.push(new MetaProvider({ load: loadMetaSdk, platform: Platform.OS === 'ios' ? 'ios' : 'android' }));
  if (__DEV__) out.push(new DebugProvider(debugBuffer, 'analytics', 'debug'));
  return out;
}
