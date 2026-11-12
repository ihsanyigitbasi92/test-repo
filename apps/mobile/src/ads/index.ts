/** Ad layer public surface (docs/design/15-reklam-altyapisi.md). */
export { ads, ADS_DEBUG, registerAdDebug } from './runtime';
export { AD_CONFIG } from './config';
export { adGameContext, grantMoney, isGriefScene } from './gameContext';
export type { Offer } from './adService';
export { AdHost } from './AdHost';
export { PrivacyEntry, RewardedOfferButtons } from './OfferButtons';
export { getConsent, onConsentChange, requestTracking } from './consentApi';
export type { ConsentSnapshot } from './consentApi';
