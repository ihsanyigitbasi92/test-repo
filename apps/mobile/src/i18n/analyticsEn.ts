/** Analytics strings — plain language, no coach voice. Mirrors analyticsTr.ts. Not legally reviewed: docs/design/17 §11. */
import type { AnalyticsStrings } from './analyticsTr';

export const analyticsEn: AnalyticsStrings = {
  section: 'ANALYTICS AND CRASH REPORTS',
  label: 'Share analytics',
  hint: 'Game events go as numbers, with no name, to a provider abroad (Google Firebase); crash reports too. Your name, your city and anything you type never leave. Off, the game is identical.',
  minor: 'Analytics is off in this region because of your age.',
  statusOn: 'On right now: anonymous usage counts and crash reports go to Google Firebase. No advertising ID is used.',
  statusOff: 'Off right now: no analytics or crash reports leave this device.',
  statusPending: "Not started: waiting on the device; nothing is sent until you've been asked.",
  reset: 'Delete my data / reset my analytics ID',
  resetHint: 'Records waiting on this device are deleted and your analytics ID is renewed. For data already on the server, write to support (draft: the address is added before release).',
  resetDone: 'Deleted; ID renewed.',
};
