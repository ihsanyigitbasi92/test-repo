/**
 * Analytics UI after D-161 (owner decision, 2026-11-13): anonymous usage analytics + crash reports are ON by default
 * after the age gate (no advertising id, no ad signals), so there is NO analytics switch in Settings and no separate
 * question card. What stays:
 *  - EEA / UK / CH / unknown region: the analytics switch on the single privacy card (src/ads/AdHost, privacyFlow.ts).
 *  - KVKK md. 11 / GDPR rights path: "Delete my analytics data / reset my analytics ID" lives on the in-app privacy
 *    notice screen (src/legal/LegalScreen.tsx), rendered by <AnalyticsDataRights/> below.
 */
import { useState, useSyncExternalStore } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../i18n';
import { colors, fonts } from '../theme';
import { runPrivacyFlow } from './privacyFlow';
import { analytics } from './runtime';

function useAnalyticsConsent() {
  return useSyncExternalStore(analytics.subscribe, analytics.getConsent, analytics.getConsent);
}

/** Legal screen block: what is collected right now + "delete my data / reset my ID" (+ withdraw where it was asked). */
export function AnalyticsDataRights() {
  const { s } = useI18n();
  const t = s.analytics;
  const c = useAnalyticsConsent();
  const [done, setDone] = useState(false);
  return (
    <View style={st.block} testID="analytics-rights">
      <Text style={st.section}>{t.section}</Text>
      <Text style={st.hint} testID="analytics-status">{c.analytics === 'granted' ? t.statusOn : c.analytics === 'denied' ? t.statusOff : t.statusPending}</Text>
      <Pressable onPress={() => { void analytics.resetData().then(() => setDone(true)); }} accessibilityRole="button" testID="analytics-reset" style={({ pressed }) => [st.ghost, pressed && st.pressed]}>
        <Text style={st.ghostTxt}>{done ? t.resetDone : t.reset}</Text>
      </Pressable>
      <Text style={st.hint}>{t.resetHint}</Text>
    </View>
  );
}

/** Kept for callers of the old API: the analytics question is now part of the single privacy card. */
export async function promptAnalyticsIfDue(): Promise<void> { await runPrivacyFlow('return'); }

const st = StyleSheet.create({
  pressed: { transform: [{ scale: 0.98 }] },
  block: { gap: 8, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 12 },
  section: { fontFamily: fonts.stamp, letterSpacing: 1.2, fontSize: 12, color: colors.ink2 },
  hint: { fontSize: 12.5, lineHeight: 18, color: colors.ink2, fontFamily: fonts.body },
  ghost: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  ghostTxt: { fontSize: 14, fontWeight: '600', color: colors.ink, textDecorationLine: 'underline' },
});
