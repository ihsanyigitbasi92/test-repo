/**
 * Catalog event → Meta App Event (pure). Only events with a Meta STANDARD counterpart are mirrored — campaign
 * optimisation (app installs, purchase / value, tutorial completion, achievements) needs nothing else, and
 * everything not listed here simply never reaches Meta.
 *
 * Install and app activation (`fb_mobile_activate_app`) are not in this table: the Meta SDK logs them itself once
 * MetaProvider switches auto-logging on after consent.
 */
import type { EventName, Params } from '../events';

export type MetaCall =
  | { kind: 'purchase'; amount: number; currency: string; params: Record<string, string | number> }
  | { kind: 'event'; name: string; valueToSum?: number; params: Record<string, string | number> };

/** Meta standard event names (react-native-fbsdk-next `AppEventsLogger.AppEvents`). */
export const META_EVENTS = {
  purchase: 'fb_mobile_purchase',
  initiatedCheckout: 'fb_mobile_initiated_checkout',
  adImpression: 'AdImpression',
  tutorialCompletion: 'fb_mobile_tutorial_completion',
  achievementUnlocked: 'fb_mobile_achievement_unlocked',
  levelAchieved: 'fb_mobile_level_achieved',
} as const;

type Mapper = (p: Params) => MetaCall;
const MAP: Partial<Record<EventName, Mapper>> = {
  // logPurchase() emits fb_mobile_purchase with value + currency (the event Meta optimises value campaigns on).
  purchase: (p) => ({ kind: 'purchase', amount: Number(p.value), currency: String(p.currency).toUpperCase(),
    params: { fb_content_id: String(p.sku), fb_content_type: 'product', fb_num_items: 1 } }),
  purchase_start: (p) => ({ kind: 'event', name: META_EVENTS.initiatedCheckout, params: { fb_content_id: String(p.sku), fb_content_type: 'product', fb_num_items: 1 } }),
  ad_impression: (p) => ({ kind: 'event', name: META_EVENTS.adImpression, valueToSum: Number(p.value),
    params: { fb_currency: String(p.currency).toUpperCase(), ad_type: String(p.ad_format), placement: String(p.ad_unit_name) } }),
  tutorial_complete: () => ({ kind: 'event', name: META_EVENTS.tutorialCompletion, params: { fb_success: '1' } }),
  milestone: (p) => ({ kind: 'event', name: META_EVENTS.achievementUnlocked, params: { fb_description: String(p.kind) } }),
  // A lived year is this game's "level": age 19, 20, … (retention-quality signal for app-event optimisation).
  year_end: (p) => ({ kind: 'event', name: META_EVENTS.levelAchieved, params: { fb_level: String(p.age) } }),
};

export const META_MAPPED = Object.keys(MAP) as EventName[];
export const isMetaMapped = (name: EventName): boolean => name in MAP;
export function toMeta(name: EventName, params: Params): MetaCall | null {
  const f = MAP[name];
  return f ? f(params) : null;
}
