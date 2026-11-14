/**
 * Provider wiring — iOS / Android. RevenueCat when its public SDK key is configured in app.json; otherwise the mock
 * store in development builds (so the shop can be exercised in a dev client) and NO store at all in release builds.
 * `react-native-purchases` is required lazily and guarded: a binary built without the native module (Expo Go)
 * degrades to "store unavailable" instead of crashing.
 */
import { Platform } from 'react-native';
import { SKUS, type Sku } from './catalog';
import { REVENUECAT_KEYS, isPlaceholder, storeIdOf } from './config';
import { DisabledIapProvider, MockIapProvider, type IapProvider } from './iap';
import { RevenueCatIapProvider, type PurchasesSdk } from './iapRevenueCat';

export function createIapProvider(): IapProvider {
  const platform = Platform.OS === 'ios' ? 'ios' : 'android';
  const apiKey = REVENUECAT_KEYS[platform];
  if (isPlaceholder(apiKey)) return __DEV__ ? new MockIapProvider() : new DisabledIapProvider();
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('react-native-purchases') as { default?: PurchasesSdk };
    const sdk = mod.default ?? (mod as unknown as PurchasesSdk);
    return new RevenueCatIapProvider(sdk, { apiKey, skus: SKUS, storeIdOf: (sku: Sku) => storeIdOf(sku, platform) });
  } catch (e) {
    console.warn('[iap] react-native-purchases unavailable:', e);
    return new DisabledIapProvider();
  }
}
