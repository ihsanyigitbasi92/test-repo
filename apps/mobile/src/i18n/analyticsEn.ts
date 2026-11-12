/** Analytics consent — plain language, no coach voice. Mirrors analyticsTr.ts. Not legally reviewed: docs/design/17 §11. */
import type { AnalyticsStrings } from './analyticsTr';

export const analyticsEn: AnalyticsStrings = {
  section: 'Privacy',
  label: 'Share analytics',
  hint: 'Game events go as numbers, with no name, to a provider abroad (Google Firebase); crash reports too. Your name, your city and anything you type never leave. Off, the game is identical.',
  on: 'ON',
  off: 'OFF',
  minor: 'This setting is off because of your age.',
  reset: 'Reset my analytics data',
  resetHint: 'Records waiting on this device are deleted and your analytics ID is renewed.',
  resetDone: 'Reset.',
  promptTitle: 'Share analytics',
  promptBody: 'May we share numbers about which screens you use and which cards you see? The data carries no name and is transferred to a provider abroad (Google Firebase); crash reports are included. Your name, your city and anything you type never leave.',
  promptFoot: 'The game is exactly the same if you say no. You can change this anytime in Settings.',
  promptLink: 'Privacy Notice',
  allow: 'Share',
  deny: "Don't share",
};
