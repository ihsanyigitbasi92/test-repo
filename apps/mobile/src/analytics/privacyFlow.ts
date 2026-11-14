/**
 * The single privacy card — when it comes and what it records (sprint 3, D-161; docs/design/15 §5, 17 §5).
 *
 *  - ONE card, one stable order: notice text → personalised-ads switch → (gated regions only) analytics switch →
 *    link to the in-app privacy notice → [Keep all off] [Save my choice], equal. Every switch starts OFF.
 *  - When: at the first report card's "One More Year" in session 1 (after the hook, before the player can leave),
 *    else at the next return slot. At most one thing per return: this card OR the ATT pre-prompt OR an interstitial.
 *  - D-161 (owner decision): anonymous usage analytics + crash reports run by default after the age gate, so the
 *    card asks about analytics only in EEA / UK / CH / unknown regions (state `unknown` there).
 *  - No ads in session 1 is unchanged: consent here only lets the SDK start; offers stay ≥ session 2, interstitials ≥ 3.
 */
import { getConsent as adsConsent } from '../ads/consentApi';
import { ads } from '../ads/runtime';
import { present } from '../ads/uiStore';
import { ageGateDone } from '../ads/ageGate';
import { trackConsentAnswer } from './hooks';
import { analytics } from './runtime';

export type PrivacyTrigger = 'first_report' | 'return';

/** What the card would ask right now (null: nothing is due, or the layers are not loaded yet). Sync, cheap. */
export function privacyDue(trigger: PrivacyTrigger): { ads: boolean; analytics: boolean } | null {
  try {
    const c = adsConsent();
    if (!ageGateDone(c.age) || !ads.isLoaded() || !analytics.isLoaded()) return null;
    if (trigger === 'return' && ads.getLedger().sessionCount < ads.config.consent.minSessionCount && !ads.getConsent().resolved) {
      // session 1 asks only at the first report card
      return null;
    }
    const adsDue = ads.consentAskDue(trigger === 'first_report');
    const a = analytics.getConsent();
    const analyticsDue = a.analytics === 'unknown' && !a.minor;
    return adsDue || analyticsDue ? { ads: adsDue, analytics: analyticsDue } : null;
  } catch { return null; }
}

/** Shows the card if something is due and records the answers. Resolves true when a card was shown. Never rejects. */
export async function runPrivacyFlow(trigger: PrivacyTrigger): Promise<boolean> {
  try {
    await Promise.all([ads.ready(), analytics.ready()]);
    const due = privacyDue(trigger);
    if (!due) return false;
    analytics.screen('consent');
    const minor = adsConsent().isMinor;
    if (due.ads) {
      const r = await ads.runConsent({ analytics: due.analytics });
      if (r.analytics !== null) analytics.setAnalyticsConsent(r.analytics);
      trackConsentAnswer({
        step: r.via === 'ump' && r.analytics === null ? 'ump' : 'privacy_card', trigger, choice: r.choice,
        ads: r.via === 'ump' || minor ? 'na' : r.personalized ? 'on' : 'off', analytics: r.analytics === null ? 'na' : r.analytics ? 'on' : 'off',
      });
      return true;
    }
    const r = await present({ k: 'privacyCard', ads: false, analytics: true, minor }, null);
    const on = !!r?.analytics && !minor;
    analytics.setAnalyticsConsent(on);
    trackConsentAnswer({ step: 'privacy_card', trigger, choice: minor ? 'ok' : r ? 'save' : 'decline', ads: 'na', analytics: on ? 'on' : 'off' });
    return true;
  } catch (e) {
    console.warn('[privacy] card failed:', e);
    return false;
  }
}
