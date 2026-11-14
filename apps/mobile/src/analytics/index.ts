/** Analytics layer public surface (docs/design/17-analitik-ve-firebase.md). */
export { analytics, startAnalytics } from './runtime';
export { gameAnalytics, trackFtue, trackTutorialEvent, trackHintsReset, userState, trackPaywallView, trackPurchaseStart, trackPurchaseResult, trackRestore, trackAdOffer, trackAdSkip, trackAdShown, trackAdReward, trackAdRevenue } from './hooks';
export { connectAnalytics } from './bridge';
export { rc, remoteConfig } from './remoteConfig';
export type { RcKey } from './remoteConfig';
export { EVENTS, SCHEMA_VERSION } from './events';
export type { EventName, EventParams, UserProps } from './events';
export type { FtueFunnelStep } from './gameHooks';
export { AnalyticsDataRights, promptAnalyticsIfDue } from './ConsentUI';
export { privacyDue, runPrivacyFlow } from './privacyFlow';
