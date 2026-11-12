/**
 * Analytics consent UI: the "Analitik paylaşımı" switch (Settings; also exported for the ad layer's consent card
 * so both switches can sit on ONE card), the "reset my analytics data" action and the one-time question card.
 *
 * Dark-pattern rules (06 §6.4, same as the ad layer): the switch starts OFF; [Paylaşma] and [Paylaş] are the same
 * component with the same style; nothing is preselected, nothing times out; refusing changes nothing in the game.
 */
import { useEffect, useState, useSyncExternalStore } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { getConsent as adsConsent } from '../ads/consentApi';
import { ads } from '../ads/runtime';
import { upper, useI18n } from '../i18n';
import { LEGAL_URLS } from '../monetization/config';
import { colors, fonts } from '../theme';
import { analyticsPromptDue, answerPrompt, askAnalyticsConsent, getPrompt, promptHostMounted, subscribePrompt } from './promptStore';
import { analytics } from './runtime';

function useAnalyticsConsent() {
  return useSyncExternalStore(analytics.subscribe, analytics.getConsent, analytics.getConsent);
}

/** One row: label + plain-language hint + ON/OFF pill. Locked off for a known minor (D-102). */
export function AnalyticsSwitch({ testID = 'analytics-toggle' }: { testID?: string }) {
  const { s } = useI18n();
  const t = s.analytics;
  const c = useAnalyticsConsent();
  const on = c.analytics === 'granted';
  return (
    <Pressable onPress={() => { if (!c.minor) analytics.setAnalyticsConsent(!on); }} accessibilityRole="switch" accessibilityLabel={t.label}
      accessibilityState={{ checked: on, disabled: c.minor }} aria-checked={on} testID={testID} style={[st.row, c.minor && st.dim]}>
      <View style={st.flex1}>
        <Text style={st.label}>{t.label}</Text>
        <Text style={st.hint}>{c.minor ? t.minor : t.hint}</Text>
      </View>
      <View style={[st.pill, on && st.pillOn]}><Text style={[st.pillTxt, on && st.pillTxtOn]}>{on ? t.on : t.off}</Text></View>
    </Pressable>
  );
}

/** Settings sheet block: the switch + "verilerimi sıfırla" (resetAnalyticsData + local queue wipe). */
export function AnalyticsSettings() {
  const { s } = useI18n();
  const t = s.analytics;
  const [done, setDone] = useState(false);
  return (
    <View style={st.block} testID="analytics-settings">
      <Text style={st.section}>{upper(useI18n().locale, t.section)}</Text>
      <AnalyticsSwitch />
      <Pressable onPress={() => { void analytics.resetData().then(() => setDone(true)); }} accessibilityRole="button" testID="analytics-reset" style={({ pressed }) => [st.ghost, pressed && st.pressed]}>
        <Text style={st.ghostTxt}>{done ? t.resetDone : t.reset}</Text>
      </Pressable>
      <Text style={st.hint}>{t.resetHint}</Text>
    </View>
  );
}

/**
 * Asks the analytics question if it is due (see `analyticsPromptDue`) and records the answer. Called by the game
 * inside its return slot, while time is stopped and right after the ad layer's consent step. Never rejects.
 */
export async function promptAnalyticsIfDue(): Promise<void> {
  try {
    await analytics.ready();
    const c = analytics.getConsent();
    if (!analyticsPromptDue({ analytics: c.analytics, adsResolved: adsConsent().resolved, sessionCount: ads.getLedger().sessionCount, minSessionCount: ads.config.consent.minSessionCount })) return;
    analytics.screen('consent');
    const answer = await askAnalyticsConsent();
    if (answer !== null) analytics.setAnalyticsConsent(answer);
  } catch (e) { console.warn('[analytics] consent prompt failed:', e); }
}

/** Mounted once (LifeScreen): renders the question card while one is open. */
export function AnalyticsHost() {
  const id = useSyncExternalStore(subscribePrompt, getPrompt, getPrompt);
  const { s, locale } = useI18n();
  useEffect(() => { promptHostMounted(true); return () => promptHostMounted(false); }, []);
  if (id === null) return null;
  const t = s.analytics;
  const url = LEGAL_URLS.privacy;
  return (
    <View style={[StyleSheet.absoluteFill, st.scrim]} testID="analytics-consent">
      <View style={st.sheet}>
        <Text style={st.title}>{upper(locale, t.promptTitle)}</Text>
        <Text style={st.body}>{t.promptBody}</Text>
        {url ? (
          <Pressable onPress={() => { void Linking.openURL(url).catch(() => undefined); }} accessibilityRole="link" testID="analytics-consent-link" style={st.linkBox}>
            <Text style={st.link}>{t.promptLink} ›</Text>
          </Pressable>
        ) : null}
        <Text style={st.hint}>{t.promptFoot}</Text>
        <View style={st.btnRow}>
          <Pressable onPress={() => answerPrompt(id, false)} accessibilityRole="button" testID="analytics-consent-deny" style={({ pressed }) => [st.btn, pressed && st.pressed]}>
            <Text style={st.btnTxt}>{upper(locale, t.deny)}</Text>
          </Pressable>
          <Pressable onPress={() => answerPrompt(id, true)} accessibilityRole="button" testID="analytics-consent-allow" style={({ pressed }) => [st.btn, pressed && st.pressed]}>
            <Text style={st.btnTxt}>{upper(locale, t.allow)}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  flex1: { flex: 1 },
  dim: { opacity: 0.45 },
  pressed: { transform: [{ scale: 0.98 }] },
  block: { gap: 8, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 12 },
  section: { fontFamily: fonts.stamp, letterSpacing: 1.2, fontSize: 12, color: colors.ink2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 },
  label: { fontSize: 15, fontWeight: '600', color: colors.ink, fontFamily: fonts.body },
  hint: { fontSize: 12.5, lineHeight: 18, color: colors.ink2, fontFamily: fonts.body },
  pill: { minWidth: 76, minHeight: 44, borderRadius: 8, borderWidth: 1.5, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  pillOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  pillTxt: { fontFamily: fonts.stamp, fontSize: 13, letterSpacing: 1.2, color: colors.ink2 },
  pillTxtOn: { color: colors.limeInk },
  ghost: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  ghostTxt: { fontSize: 14, fontWeight: '600', color: colors.ink, textDecorationLine: 'underline' },
  scrim: { backgroundColor: colors.scrim, alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 56 },
  sheet: { backgroundColor: colors.paper, borderRadius: 12, borderWidth: 1, borderColor: colors.line, width: '100%', maxWidth: 380, padding: 16, gap: 12 },
  title: { fontFamily: fonts.stamp, letterSpacing: 1.2, fontSize: 15, color: colors.lime },
  body: { fontSize: 15, lineHeight: 22, color: colors.ink, fontFamily: fonts.body },
  linkBox: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  link: { fontSize: 14, fontWeight: '600', color: colors.ink, textDecorationLine: 'underline' },
  btnRow: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, minHeight: 54, borderRadius: 8, borderWidth: 2, borderColor: colors.ink2, backgroundColor: colors.paper2, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 8 },
  btnTxt: { fontFamily: fonts.stamp, fontSize: 14, letterSpacing: 1.2, color: colors.ink, textAlign: 'center' },
});
