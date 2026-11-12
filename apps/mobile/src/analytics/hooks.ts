/**
 * The hooks bound to the app-wide `analytics` singleton. Safe to import from the ad layer and the shop
 * (this module imports neither). See gameHooks.ts for what each one records.
 */
import { createHooks } from './gameHooks';
import { rc } from './remoteConfig';
import { analytics } from './runtime';

const hooks = createHooks(analytics, { daySamplePct: () => rc('day_shown_sample_pct') });

export const gameAnalytics = hooks.game;
export const { userState, trackPaywallView, trackPurchaseStart, trackPurchaseResult, trackRestore, trackAdOffer, trackAdSkip, trackAdShown, trackAdReward, trackAdRevenue } = hooks;
