/**
 * iOS / Android: React Native Firebase (modular API), required lazily — after the consent gate, and only when
 * the binary really contains the native modules (a dev / release build made with the config plugins and the
 * owner's google-services files; Expo Go and plugin-less builds fall back to "no Firebase").
 */
import { TurboModuleRegistry } from 'react-native';
import type { FirebaseSdk } from './providers/FirebaseProvider';
import type { RemoteConfigSource } from './remoteConfig';

/* eslint-disable @typescript-eslint/no-require-imports */
const has = (name: string): boolean => { try { return TurboModuleRegistry.get(name) != null; } catch { return false; } };

/** The native Firebase core + Analytics modules are in this binary. */
export const firebaseLinked = (): boolean => has('NativeRNFBTurboApp') && has('NativeRNFBTurboAnalytics');

export async function loadFirebaseSdk(): Promise<FirebaseSdk | null> {
  if (!firebaseLinked()) return null;
  try {
    const A = require('@react-native-firebase/analytics') as typeof import('@react-native-firebase/analytics');
    const analytics = A.getAnalytics();
    let C: typeof import('@react-native-firebase/crashlytics') | null = null;
    let crash: ReturnType<typeof import('@react-native-firebase/crashlytics').getCrashlytics> | null = null;
    try { C = require('@react-native-firebase/crashlytics') as typeof import('@react-native-firebase/crashlytics'); crash = C.getCrashlytics(); } catch { C = null; crash = null; }
    return {
      setConsent: async (c) => { await A.setConsent(analytics, c); },
      setAnalyticsCollectionEnabled: async (on) => { await A.setAnalyticsCollectionEnabled(analytics, on); },
      setCrashlyticsCollectionEnabled: async (on) => { if (C && crash) await C.setCrashlyticsCollectionEnabled(crash, on); },
      logEvent: async (name, params) => { await A.logEvent(analytics, name, params); },
      setUserProperties: async (props) => { await A.setUserProperties(analytics, props); },
      resetAnalyticsData: async () => { await A.resetAnalyticsData(analytics); },
      deleteUnsentCrashReports: async () => { if (C && crash) await C.deleteUnsentReports(crash); },
      recordError: (error, name) => { if (C && crash) C.recordError(crash, error, name); },
    };
  } catch (e) {
    console.warn('[analytics] firebase not usable:', e);
    return null;
  }
}

export async function loadRemoteConfigSource(): Promise<RemoteConfigSource | null> {
  if (!has('NativeRNFBTurboApp') || !has('NativeRNFBTurboConfig')) return null;
  try {
    const R = require('@react-native-firebase/remote-config') as typeof import('@react-native-firebase/remote-config');
    const rc = R.getRemoteConfig();
    return {
      async fetchAndActivate(defaults, minFetchSec) {
        rc.settings = { ...rc.settings, minimumFetchIntervalMillis: minFetchSec * 1000, fetchTimeoutMillis: 10_000 };
        rc.defaultConfig = defaults;
        await R.fetchAndActivate(rc);
        const out: Record<string, string> = {};
        const all = R.getAll(rc);
        for (const k of Object.keys(all)) if (all[k]!.getSource() === 'remote') out[k] = all[k]!.asString();
        return out;
      },
    };
  } catch (e) {
    console.warn('[analytics] remote config not usable:', e);
    return null;
  }
}
