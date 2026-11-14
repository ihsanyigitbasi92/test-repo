/**
 * iOS / Android: react-native-fbsdk-next, required lazily (after marketing consent) and only when its native
 * modules are in the binary. The package's JS reads `NativeModules.FB*` at import time, so it must never be
 * imported on a binary built without it.
 */
import { NativeModules } from 'react-native';
import type { MetaSdk } from './providers/MetaProvider';

/* eslint-disable @typescript-eslint/no-require-imports */
export const metaLinked = (): boolean => {
  try { return NativeModules.FBAppEventsLogger != null && NativeModules.FBSettings != null; } catch { return false; }
};

export async function loadMetaSdk(): Promise<MetaSdk | null> {
  if (!metaLinked()) return null;
  try {
    const fb = require('react-native-fbsdk-next') as typeof import('react-native-fbsdk-next');
    const { Settings, AppEventsLogger } = fb;
    return {
      initializeSDK: () => Settings.initializeSDK(),
      setAutoLogAppEventsEnabled: (on) => Settings.setAutoLogAppEventsEnabled(on),
      setAdvertiserIDCollectionEnabled: (on) => Settings.setAdvertiserIDCollectionEnabled(on),
      setAdvertiserTrackingEnabled: (on) => Settings.setAdvertiserTrackingEnabled(on),
      setDataProcessingOptions: (options, country, state) => {
        if (country === undefined || state === undefined) Settings.setDataProcessingOptions(options);
        else Settings.setDataProcessingOptions(options, country, state);
      },
      logEvent: (name, valueToSum, params) => {
        if (valueToSum === undefined) AppEventsLogger.logEvent(name, params);
        else AppEventsLogger.logEvent(name, valueToSum, params);
      },
      logPurchase: (amount, currency, params) => AppEventsLogger.logPurchase(amount, currency, params),
      flush: () => AppEventsLogger.flush(),
    };
  } catch (e) {
    console.warn('[analytics] meta sdk not usable:', e);
    return null;
  }
}
