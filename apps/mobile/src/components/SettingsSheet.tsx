/**
 * Settings sheet (07 §2.2.9 "Geri bildirim"; docs/design/16-ses-efektleri.md): how to play (replay the intro, reset
 * the hints — docs/design/18), sound effects on/off + level, vibration on/off, language, reminders (docs/design/19)
 * and privacy (ad preferences + legal drafts). No analytics switch (D-161: on by default; rights on the notice page). Opened from the ≡ button of the
 * decision zone; every switch persists under its own storage key.
 */
import { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useI18n } from '../i18n';
import { haptic, hapticsPrefs, useHapticsEnabled } from '../state/haptics';
import { sfx, sound, useSoundPrefs } from '../state/sound';
import { PrimaryButton } from './ActionZone';
import { trackHintsReset } from '../analytics/hooks';
import { PrivacyEntry } from '../ads/OfferButtons';
import { openLegal, type LegalDoc } from '../legal/store';
import { reminders, useReminders } from '../notifications/runtime';
import type { Locale } from '@motto/engine';

/** Master volume steps (soundCore DEFAULT_PREFS.volume = the middle one). */
export const VOLUME_STEPS = [0.35, 0.6, 0.9] as const;

function Switch({ on, onToggle, label, testID }: { on: boolean; onToggle: () => void; label: string; testID: string }) {
  const { s } = useI18n();
  return (
    <Pressable onPress={onToggle} accessibilityRole="switch" accessibilityLabel={label} accessibilityState={{ checked: on }} aria-checked={on} testID={testID}
      style={({ pressed }) => [st.sw, on && st.swOn, pressed && st.pressed]}>
      <Text style={[st.swTxt, on && st.swTxtOn]}>{on ? s.settings.on : s.settings.off}</Text>
    </Pressable>
  );
}

function SmallBtn({ label, onPress, testID, done = false }: { label: string; onPress: () => void; testID: string; done?: boolean }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} testID={testID} style={({ pressed }) => [st.sw, done && st.swDone, pressed && st.pressed]}>
      <Text style={[st.swTxt, !done && st.swTxtInk]}>{label}</Text>
    </Pressable>
  );
}

export function SettingsSheet({ open, onClose, onHowTo, onResetHints, onLocale }: { open: boolean; onClose: () => void; onHowTo?: () => void; onResetHints?: () => void; onLocale?: (l: Locale) => void }) {
  const { s, locale } = useI18n();
  const rem = useReminders();
  const prefs = useSoundPrefs();
  const hapticsOn = useHapticsEnabled();
  const [hintsReset, setHintsReset] = useState(false);
  useEffect(() => { if (!open) setHintsReset(false); }, [open]);
  if (!open) return null;
  const t = s.tutorial;
  const soundOn = !prefs.muted;
  const level = VOLUME_STEPS.reduce((best, v, i) => (Math.abs(v - prefs.volume) < Math.abs(VOLUME_STEPS[best]! - prefs.volume) ? i : best), 0);
  return (
    <View style={[StyleSheet.absoluteFill, st.scrim]} testID="settings-sheet">
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={s.cta.close} />
      <ScrollView style={st.sheetScroll} contentContainerStyle={st.sheet}>
        <Text style={st.title}>{s.settings.title}</Text>
        {onHowTo && (
          <View style={st.row} testID="howto-row">
            <View style={st.flex1}>
              <Text style={st.label}>{t.settingsTitle}</Text>
              <Text style={st.hint}>{t.settingsHint}</Text>
            </View>
            <SmallBtn label={t.settingsOpen} onPress={() => { haptic.selection(); sfx('ui_tap'); onHowTo(); }} testID="howto-open" />
          </View>
        )}
        {onResetHints && (
          <View style={st.row}>
            <View style={st.flex1}>
              <Text style={st.label}>{t.resetHints}</Text>
              <Text style={st.hint}>{t.resetHintsHint}</Text>
            </View>
            <SmallBtn label={hintsReset ? t.resetDone : t.resetDo} done={hintsReset} testID="hints-reset"
              onPress={() => { if (hintsReset) return; haptic.selection(); sfx('ui_tap'); onResetHints(); trackHintsReset(); setHintsReset(true); }} />
          </View>
        )}
        <View style={st.row}>
          <View style={st.flex1}>
            <Text style={st.label}>{s.settings.sound}</Text>
            <Text style={st.hint}>{s.settings.soundHint}</Text>
          </View>
          <Switch on={soundOn} label={s.settings.sound} testID="sound-toggle"
            onToggle={() => { sound.toggleMuted(); haptic.selection(); sfx('ui_tap'); }} />
        </View>
        {soundOn && (
          <View style={st.row}>
            <Text style={[st.label, st.flex1]}>{s.settings.volume}</Text>
            <View style={st.seg} accessibilityRole="radiogroup">
              {VOLUME_STEPS.map((v, i) => (
                <Pressable key={v} onPress={() => { sound.setVolume(v); sfx('stamp_small'); }} accessibilityRole="radio" accessibilityState={{ selected: level === i }}
                  testID={`volume-${i}`} style={[st.segBtn, level === i && st.segOn]}>
                  <Text style={[st.segTxt, level === i && st.segTxtOn]}>{s.settings.volumeLevels[i]}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
        {Platform.OS !== 'web' && (
          <View style={st.row}>
            <View style={st.flex1}>
              <Text style={st.label}>{s.settings.haptics}</Text>
              <Text style={st.hint}>{s.settings.hapticsHint}</Text>
            </View>
            <Switch on={hapticsOn} label={s.settings.haptics} testID="haptics-toggle"
              onToggle={() => { hapticsPrefs.set(!hapticsOn); haptic.selection(); sfx('ui_tap'); }} />
          </View>
        )}
        {onLocale && (
          <View style={st.row} testID="language-row">
            <View style={st.flex1}>
              <Text style={st.label}>{s.settings.language}</Text>
              <Text style={st.hint}>{s.settings.languageHint}</Text>
            </View>
            <View style={st.seg} accessibilityRole="radiogroup">
              {(['tr', 'en'] as Locale[]).map((l) => (
                <Pressable key={l} onPress={() => onLocale(l)} accessibilityRole="radio" accessibilityState={{ selected: locale === l }} accessibilityLabel={l === 'tr' ? 'Türkçe' : 'English'}
                  testID={`settings-lang-${l}`} style={[st.segBtn, locale === l && st.segOn]}>
                  <Text style={[st.segTxt, locale === l && st.segTxtOn]}>{l.toUpperCase()}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
        {reminders.available && (
          <View style={st.row}>
            <View style={st.flex1}>
              <Text style={st.label}>{s.settings.reminders}</Text>
              <Text style={st.hint}>{s.settings.remindersHint}</Text>
            </View>
            <Switch on={rem.optIn === 'yes'} label={s.settings.reminders} testID="reminders-toggle"
              onToggle={() => { haptic.selection(); void reminders.answer(rem.optIn !== 'yes', 'settings'); }} />
          </View>
        )}
        {/* Privacy (UX P2-3): ad preferences + the in-app legal drafts (data rights live on the notice page, D-161). */}
        <View style={st.block} testID="privacy-settings">
          <Text style={st.section}>{s.settings.privacy}</Text>
          <PrivacyEntry />
          {(['notice', 'privacy', 'terms'] as LegalDoc[]).map((d) => (
            <Pressable key={d} onPress={() => openLegal(d)} accessibilityRole="link" testID={`settings-legal-${d}`} style={({ pressed }) => [st.link, pressed && st.pressed]}>
              <Text style={st.linkTxt}>{s.settings.legal[d]} ›</Text>
            </Pressable>
          ))}
        </View>
        <PrimaryButton label={s.cta.close} onPress={onClose} testID="settings-close" />
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  scrim: { backgroundColor: colors.scrim, alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 21 },
  sheetScroll: { width: '100%', maxWidth: 360, flexGrow: 0, maxHeight: '100%', backgroundColor: colors.paper, borderRadius: 12, borderWidth: 1, borderColor: colors.line },
  sheet: { padding: 16, gap: 14 },
  title: { fontFamily: fonts.stamp, letterSpacing: 1.4, fontSize: 14, color: colors.lime },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flex1: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600', color: colors.ink, fontFamily: fonts.body },
  hint: { marginTop: 2, fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 13, lineHeight: 17, color: colors.ink2 },
  sw: { minWidth: 76, minHeight: 44, borderRadius: 8, borderWidth: 1.5, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  swOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  swTxt: { fontFamily: fonts.stamp, fontSize: 13, letterSpacing: 1.2, color: colors.ink2 },
  swTxtOn: { color: colors.limeInk },
  swTxtInk: { color: colors.ink },
  swDone: { borderStyle: 'dashed' },
  seg: { flexDirection: 'row', gap: 4 },
  segBtn: { minHeight: 44, minWidth: 56, borderRadius: 8, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  segOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  segTxt: { fontSize: 12, fontWeight: '700', color: colors.ink2 },
  segTxtOn: { color: colors.paper },
  pressed: { transform: [{ scale: 0.98 }] },
  block: { gap: 4, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 12 },
  section: { fontFamily: fonts.stamp, letterSpacing: 1.2, fontSize: 12, color: colors.ink2 },
  link: { minHeight: 44, justifyContent: 'center' },
  linkTxt: { fontSize: 14, fontWeight: '600', color: colors.ink, textDecorationLine: 'underline' },
});
