/**
 * Neutral age screen (ageGate.ts): the first thing after the splash, once. One numeric field for the year of birth —
 * empty by default, no yes/no shortcut, no word about what any answer leads to. An under-16 answer ends on a plain
 * closed-file line with nothing to tap (no way back to re-answer). Covers the whole phone; the game waits under it.
 */
import { useState, useSyncExternalStore } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts } from '../theme';
import { upper, useI18n } from '../i18n';
import type { Locale } from '@motto/engine';
import { ageGate } from './runtime';
import { ageGateDone, type AgeState } from './ageGate';

export const useAgeState = (): AgeState => useSyncExternalStore(ageGate.subscribe, ageGate.getState, ageGate.getState);

/** TR / EN chips: the gate comes before the top bar is reachable, so it carries its own language switch. */
function Lang({ onLocale }: { onLocale?: (l: Locale) => void }) {
  const { locale } = useI18n();
  if (!onLocale) return null;
  return (
    <View style={st.lang}>
      {(['tr', 'en'] as Locale[]).map((l) => (
        <Pressable key={l} onPress={() => onLocale(l)} accessibilityRole="button" accessibilityState={{ selected: locale === l }}
          accessibilityLabel={l === 'tr' ? 'Türkçe' : 'English'} testID={`age-lang-${l}`} style={[st.chip, locale === l && st.chipOn]}>
          <Text style={[st.chipTxt, locale === l && st.chipTxtOn]}>{l.toUpperCase()}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function AgeGate({ onLocale }: { onLocale?: (l: Locale) => void }) {
  const { s, locale } = useI18n();
  const t = s.ads.age;
  const state = useAgeState();
  const [text, setText] = useState('');
  const [tried, setTried] = useState(false);
  if (state === 'adult' || state === 'minor') return null;
  if (state === 'loading') return <View style={[StyleSheet.absoluteFill, st.root]} testID="age-gate-loading" />;
  if (state === 'blocked') {
    return (
      <View style={[StyleSheet.absoluteFill, st.root]} testID="age-blocked" accessibilityRole="alert">
        <Lang onLocale={onLocale} />
        <Text style={st.title}>{t.blockedTitle}</Text>
        <Text style={st.body}>{t.blocked}</Text>
      </View>
    );
  }
  const year = /^\d{4}$/.test(text) ? Number(text) : NaN;
  const ok = ageGate.valid(year);
  const submit = () => { if (ok) ageGate.submit(year); else setTried(true); };
  return (
    <View style={[StyleSheet.absoluteFill, st.root]} testID="age-gate">
      <Lang onLocale={onLocale} />
      <Text style={st.title} accessibilityRole="header">{t.title}</Text>
      <Text style={st.body}>{t.body}</Text>
      <TextInput value={text} onChangeText={(v) => { setText(v.replace(/\D/g, '').slice(0, 4)); setTried(false); }} onSubmitEditing={submit}
        keyboardType="number-pad" inputMode="numeric" maxLength={4} placeholder={t.placeholder} placeholderTextColor={colors.grave}
        accessibilityLabel={t.inputA11y} testID="age-year" style={st.input} returnKeyType="done" autoComplete="off" />
      <Text style={st.err} accessibilityLiveRegion="polite" testID="age-invalid">{tried && !ok ? t.invalid : ' '}</Text>
      <Pressable onPress={submit} accessibilityRole="button" accessibilityLabel={t.cont} testID="age-continue" style={({ pressed }) => [st.btn, pressed && st.pressed]}>
        <Text style={st.btnTxt}>{upper(locale, t.cont)}</Text>
      </Pressable>
    </View>
  );
}

const st = StyleSheet.create({
  root: { backgroundColor: colors.death, zIndex: 70, paddingHorizontal: 24, justifyContent: 'center', gap: 14 },
  title: { fontFamily: fonts.stamp, fontSize: 20, letterSpacing: 2, color: colors.ink },
  body: { fontSize: 16, lineHeight: 23, color: colors.ink, fontFamily: fonts.body },
  input: { minHeight: 64, borderWidth: 2, borderColor: colors.ink2, borderRadius: 8, backgroundColor: colors.paper2, color: colors.ink,
    fontFamily: fonts.stamp, fontSize: 30, letterSpacing: 8, textAlign: 'center', paddingHorizontal: 12 },
  err: { fontSize: 13, color: colors.note, minHeight: 18 },
  btn: { minHeight: 58, borderRadius: 8, borderWidth: 2, borderColor: colors.ink2, backgroundColor: colors.paper2, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 },
  btnTxt: { fontFamily: fonts.stamp, fontSize: 16, letterSpacing: 1.8, color: colors.ink },
  pressed: { transform: [{ scale: 0.98 }] },
  lang: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', gap: 6 },
  chip: { borderWidth: 1, borderColor: colors.line, borderRadius: 999, minHeight: 44, minWidth: 44, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  chipOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  chipTxt: { color: colors.ink, fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  chipTxtOn: { color: colors.limeInk },
});

/**
 * Sequencing signal for whatever comes after the gate (tutorial, analytics consent): true once the player has
 * answered and may play. Stays false while loading, while asking, and forever for an under-16 answer.
 */
export const useAgeGateDone = (): boolean => ageGateDone(useAgeState());
export const isAgeGateDone = (): boolean => ageGateDone(ageGate.getState());
/** Calls `cb` once, as soon as the gate is done (immediately if it already is). Returns an unsubscribe. */
export function onAgeGateDone(cb: () => void): () => void {
  if (isAgeGateDone()) { cb(); return () => undefined; }
  const off = ageGate.subscribe(() => { if (isAgeGateDone()) { off(); cb(); } });
  return off;
}
