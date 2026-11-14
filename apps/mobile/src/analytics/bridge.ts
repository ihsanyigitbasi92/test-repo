/**
 * Bridges to the sibling layers (imported once, from useGame): the ad layer's consent state feeds the marketing
 * purpose and the minor flag; entitlements and sound prefs feed user properties. Kept apart from ./runtime so
 * the ad layer and the shop can import ./hooks without a cycle.
 */
import { getConsent, onConsentChange } from '../ads/consentApi';
import { ads } from '../ads/runtime';
import { entitlements, onEntitlementsChange } from '../monetization/entitlements';
import { sound } from '../state/sound';
import { userState } from './hooks';
import { analytics } from './runtime';

let connected = false;
export function connectAnalytics(): void {
  if (connected) return;
  connected = true;
  try {
    const pushConsent = (): void => analytics.setAdsConsent(getConsent());
    onConsentChange(pushConsent);
    void ads.ready().then(pushConsent).catch(() => undefined);

    // `payer` only ever rises here (a consumable purchase sets it too, in trackPurchaseResult).
    const pushOwned = (): void => userState({ ...(entitlements.ownedIds().length > 0 ? { payer: true } : {}), noAds: entitlements.hasNoAds() });
    onEntitlementsChange(pushOwned);
    void entitlements.load().then(pushOwned).catch(() => undefined);

    const pushSound = (): void => userState({ soundOn: !sound.getPrefs().muted });
    sound.subscribe(pushSound);
    pushSound();
  } catch (e) { console.warn('[analytics] bridge failed:', e); }
}
