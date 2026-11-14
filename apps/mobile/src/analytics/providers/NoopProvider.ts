import type { Purpose } from '../consent';
import type { AnalyticsProvider } from './types';

/** Swallows everything (tests, builds with analytics compiled out). */
export class NoopProvider implements AnalyticsProvider {
  readonly name = 'noop';
  constructor(readonly purpose: Purpose = 'analytics') {}
  async init(): Promise<void> { /* nothing to start */ }
  setConsent(): void { /* nothing */ }
  logEvent(): void { /* nothing */ }
  setUserProps(): void { /* nothing */ }
  reset(): void { /* nothing */ }
}
