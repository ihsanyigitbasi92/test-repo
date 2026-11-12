/**
 * Settings sheet (07 §2.2.9 "Geri bildirim"; docs/design/16-ses-efektleri.md): sound effects on/off + level,
 * vibration on/off. Opened from the ≡ button of the decision zone; both switches persist under their own storage keys.
 */
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useI18n } from '../i18n';
import { haptic, hapticsPrefs, useHapticsEnabled } from '../state/haptics';
import { sfx, sound, useSoundPrefs } from '../state/sound';
import { PrimaryButton } from './ActionZone';

/** Master volume steps (soundCore DEFAULT_PREFS.volume = the middle one). */
export const VOLUME_STEPS = [0.35, 0.6, 0.9] as const;

function Switch({ on, onToggle, label, testID }: { on: boolean; onToggle: () => void; label: string; testID: string }) {
  const { s } = useI18n();
  return (
    <Pressable onPress={onToggle} accessibilityRole="switch" accessibilityLabel={label} accessibilityState={{ checked: on }} testID={testID}
      style={({ pressed }) => [st.sw, on && st.swOn, pressed && st.pressed]}>
      <Text style={[st.swTxt, on && st.swTxtOn]}>{on ? s.settings.on : s.settings.off}</Text>
    </Pressable>
  );
}

export function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { s } = useI18n();
  const prefs = useSoundPrefs();
  const hapticsOn = useHapticsEnabled();
  if (!open) return null;
  const soundOn = !prefs.muted;
  const level = VOLUME_STEPS.reduce((best, v, i) => (Math.abs(v - prefs.volume) < Math.abs(VOLUME_STEPS[best]! - prefs.volume) ? i : best), 0);
  return (
    <View style={[StyleSheet.absoluteFill, st.scrim]} testID="settings-sheet">
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={s.cta.close} />
      <View style={st.sheet}>
        <Text style={st.title}>{s.settings.title}</Text>
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
        <PrimaryButton label={s.cta.close} onPress={onClose} testID="settings-close" />
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  scrim: { backgroundColor: colors.scrim, alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 21 },
  sheet: { backgroundColor: colors.paper, borderRadius: 12, borderWidth: 1, borderColor: colors.line, padding: 16, gap: 14, width: '100%', maxWidth: 360 },
  title: { fontFamily: fonts.stamp, letterSpacing: 1.4, fontSize: 14, color: colors.lime },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flex1: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600', color: colors.ink, fontFamily: fonts.body },
  hint: { marginTop: 2, fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 13, lineHeight: 17, color: colors.ink2 },
  sw: { minWidth: 76, minHeight: 44, borderRadius: 8, borderWidth: 1.5, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  swOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  swTxt: { fontFamily: fonts.stamp, fontSize: 13, letterSpacing: 1.2, color: colors.ink2 },
  swTxtOn: { color: colors.limeInk },
  seg: { flexDirection: 'row', gap: 4 },
  segBtn: { minHeight: 44, minWidth: 56, borderRadius: 8, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  segOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  segTxt: { fontSize: 12, fontWeight: '700', color: colors.ink2 },
  segTxtOn: { color: colors.paper },
  pressed: { transform: [{ scale: 0.98 }] },
});
