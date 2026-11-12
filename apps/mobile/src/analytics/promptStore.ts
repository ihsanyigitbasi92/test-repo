/**
 * The analytics consent question as a tiny external store (same pattern as src/ads/uiStore): logic awaits
 * `askAnalyticsConsent()`, <AnalyticsHost/> renders the card. Pure TS. With no host mounted it resolves null
 * (nothing was asked, nothing is recorded as an answer).
 */
let open: { id: number; resolve: (v: boolean | null) => void } | null = null;
let seq = 1;
let hosts = 0;
const listeners = new Set<() => void>();
const emit = (): void => { for (const l of [...listeners]) l(); };

export const subscribePrompt = (l: () => void): (() => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export const getPrompt = (): number | null => open?.id ?? null;
export function promptHostMounted(on: boolean): void { hosts = Math.max(0, hosts + (on ? 1 : -1)); }

/** true: share · false: don't share · null: not asked (no host / already open). */
export function askAnalyticsConsent(): Promise<boolean | null> {
  if (hosts <= 0 || open) return Promise.resolve(null);
  return new Promise((resolve) => { open = { id: seq++, resolve }; emit(); });
}
export function answerPrompt(id: number, value: boolean): void {
  if (!open || open.id !== id) return;
  const o = open;
  open = null;
  emit();
  o.resolve(value);
}

/**
 * When the question is due (11 §2.2.4, D-104): never in the first session; in the same stopped-time slot as the
 * ad consent step, right after it — or from the second session on when no ad consent step will come (no-ads
 * owners, ads disabled). Never for a known minor (switch locked off), never twice.
 */
export function analyticsPromptDue(p: { analytics: 'unknown' | 'granted' | 'denied'; adsResolved: boolean; sessionCount: number; minSessionCount?: number }): boolean {
  if (p.analytics !== 'unknown') return false;
  return p.adsResolved || p.sessionCount >= (p.minSessionCount ?? 2);
}
