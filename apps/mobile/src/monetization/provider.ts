/**
 * Provider wiring — web / node (the web export and vitest resolve THIS file; native resolves provider.native.ts).
 * The web build is a demo: it always runs the mock store and never loads a native store module.
 */
import { MockIapProvider, type IapProvider } from './iap';

export function createIapProvider(): IapProvider {
  return new MockIapProvider();
}
