/**
 * Provider wiring — web (and vitest, which resolves this file, never `provider.native.ts`): always the demo
 * provider. The AdMob module is native-only and must not enter the web bundle.
 */
import type { AdConfig } from './config';
import type { Region } from './consent';
import { MockAdProvider } from './MockAdProvider';
import type { AdProvider } from './types';

export function createAdProvider(cfg: AdConfig, region: () => Region): AdProvider {
  return new MockAdProvider({ cfg, region });
}
