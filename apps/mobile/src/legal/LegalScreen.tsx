/**
 * In-app legal screen (drafts): Aydınlatma Metni / Privacy Notice, Privacy Policy, Terms. Rendered above every
 * other layer (consent cards included) by <LegalHost/>. The notice page carries the KVKK md. 11 path: "delete my
 * data / reset my analytics ID" (D-161) and the ad-preferences entry. "Lisanslar / Licenses" (bundled OFL fonts) uses the
 * same screen without the draft tag.
 */
import { useSyncExternalStore } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useI18n } from '../i18n';
import { AnalyticsDataRights } from '../analytics/ConsentUI';
import { PrivacyEntry } from '../ads/OfferButtons';
import { ALL_LEGAL_TEXTS, DRAFT_TAG, parseLegal } from './index';
import { closeLegal, getLegal, subscribeLegal, type LegalDoc } from './store';

export function LegalScreen({ doc, onClose }: { doc: LegalDoc; onClose: () => void }) {
  const { s, locale } = useI18n();
  const blocks = parseLegal(ALL_LEGAL_TEXTS[doc][locale]);
  const draft = doc !== 'licenses';
  return (
    <View style={[StyleSheet.absoluteFill, st.root]} testID={`legal-${doc}`} accessibilityViewIsModal>
      <View style={st.head}>
        {draft ? <Text style={st.tag} testID="legal-draft">{DRAFT_TAG[locale]}</Text> : <View style={st.flex1} />}
        <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel={s.cta.close} testID="legal-close" style={({ pressed }) => [st.close, pressed && st.pressed]}>
          <Text style={st.closeTxt}>{s.cta.close}</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={st.body}>
        {blocks.map((b, i) => (
          <Text key={i} style={b.k === 'title' ? st.title : b.k === 'h' ? st.h : st.p} accessibilityRole={b.k === 'title' || b.k === 'h' ? 'header' : undefined}>
            {b.k === 'li' ? `•  ${b.text}` : b.text}
          </Text>
        ))}
        {doc === 'notice' && (
          <>
            <AnalyticsDataRights />
            <PrivacyEntry onOpen={onClose} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

/** Mounted once (LifeScreen), last: shows the legal text that is open, if any. */
export function LegalHost() {
  const doc = useSyncExternalStore(subscribeLegal, getLegal, getLegal);
  return doc ? <LegalScreen doc={doc} onClose={closeLegal} /> : null;
}

const st = StyleSheet.create({
  root: { backgroundColor: colors.paper, zIndex: 80 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.line },
  tag: { flex: 1, alignSelf: 'center', fontSize: 12, fontWeight: '700', letterSpacing: 0.8, color: colors.noteInk, backgroundColor: colors.note, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, overflow: 'hidden' },
  close: { minHeight: 44, minWidth: 72, borderRadius: 8, borderWidth: 1.5, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  closeTxt: { fontSize: 14, fontWeight: '700', color: colors.ink },
  pressed: { transform: [{ scale: 0.98 }] },
  flex1: { flex: 1 },
  body: { padding: 16, gap: 8, paddingBottom: 40 },
  title: { fontFamily: fonts.stamp, fontSize: 20, letterSpacing: 1, color: colors.lime, marginBottom: 4 },
  h: { fontFamily: fonts.stamp, fontSize: 14, letterSpacing: 1, color: colors.ink, marginTop: 10 },
  p: { fontSize: 14.5, lineHeight: 21, color: colors.ink, fontFamily: fonts.body },
});
