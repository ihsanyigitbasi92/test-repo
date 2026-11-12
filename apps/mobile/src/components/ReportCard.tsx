/**
 * Kısa Karne (07 §2.2.3): six grades slide in 90 ms apart, FILED stamp, coach accuracy, Motto of the Year typed
 * on lime, envelope teaser. Grades/accuracy/envelope come from the engine's REPORT_CARD data; the motto line is
 * the UI catalog's text for the engine's `mottoCell`.
 */
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, nativeDriver } from '../theme';
import { mottoLine, noEnvelopeLine, upper, useI18n } from '../i18n';
import type { FeedItemOf } from '../state/feed';
import { useAppear, useReducedMotion, useSlam, useTypewriter } from './anim';

const ORDER = ['health', 'money', 'relationships', 'brain', 'courage', 'spectacle'] as const;

function Grade({ name, grade, i }: { name: string; grade: number; i: number }) {
  const { s, locale } = useI18n();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(v, { toValue: 1, duration: 250, delay: 150 + i * 90, useNativeDriver: nativeDriver }).start(); }, [v, i]);
  const c = grade >= 3 ? colors.called : grade <= 1 ? colors.wrong : colors.ink;
  return (
    <Animated.View style={[st.grade, i % 2 === 0 && st.gradeOdd, { opacity: v, transform: [{ translateX: v.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) }] }]}>
      <Text style={st.gName}>{name}</Text>
      <Text style={[st.gVal, { color: c }]}>{upper(locale, s.grades[grade] ?? '')}</Text>
    </Animated.View>
  );
}

export function ReportCard({ item, typeMs }: { item: FeedItemOf<'report'>; typeMs: number }) {
  const { s } = useI18n();
  const anim = useAppear('pop', 320);
  const filed = useSlam(true, '-6deg', 2.6, useReducedMotion());
  const d = item.data;
  const r = d.ritual as Partial<NonNullable<typeof d.ritual>> | undefined;      // saves from before the ritual pools: undefined
  const motto = useTypewriter(mottoLine(s, item.motto, r?.motto ?? 0), typeMs * 3);
  const teaser = d.envelopeTeaser ? s.envTeaser[d.envelopeTeaser] ?? s.envTeaserDefault : null;
  return (
    <Animated.View style={[st.karne, anim]} testID="report-card">
      <View style={st.head}>
        <Text style={st.title}>{s.reportTitle} · {d.age - 1}→{d.age}{d.decadeReview ? <Text style={st.decade}>{'  '}{s.decade}</Text> : null}</Text>
      </View>
      <View style={st.grades}>
        {ORDER.map((k, i) => <Grade key={k} name={s.gradeNames[k]} grade={d.grades[k]} i={i} />)}
      </View>
      <View style={st.row}><Text style={st.rowTxt}>{s.coachAccuracy(d.coachAccuracyYear.hits, d.coachAccuracyYear.total, r?.noWager ?? 0)}</Text></View>
      <View style={st.motto}>
        <Text style={st.mottoLbl}>{s.mottoLbl}</Text>
        <Text style={st.mottoTxt}>“{motto}”</Text>
      </View>
      <View style={st.env}>
        <View style={st.envIc} />
        <Text style={st.envTxt}>{teaser ?? noEnvelopeLine(s, r?.noEnvelope ?? 0)}</Text>
      </View>
      <Animated.View pointerEvents="none" style={[st.filed, filed]}><Text style={st.filedTxt}>{s.stampFiled}</Text></Animated.View>
    </Animated.View>
  );
}

const st = StyleSheet.create({
  karne: { borderWidth: 2, borderColor: colors.ink, backgroundColor: colors.paper2, overflow: 'hidden', position: 'relative' },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 2, borderBottomColor: colors.ink },
  title: { fontFamily: fonts.stamp, letterSpacing: 1.4, fontSize: 14, color: colors.ink },
  decade: { fontFamily: fonts.stamp, fontSize: 10, color: colors.gold, letterSpacing: 1 },
  grades: { flexDirection: 'row', flexWrap: 'wrap' },
  grade: { width: '50%', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  gradeOdd: { borderRightWidth: 1, borderRightColor: colors.line },
  gName: { fontSize: 13, color: colors.ink },
  gVal: { fontFamily: fonts.stamp, fontSize: 12, letterSpacing: 0.6 },
  row: { paddingVertical: 8, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  rowTxt: { fontSize: 13, color: colors.ink2 },
  motto: { backgroundColor: colors.lime, paddingTop: 12, paddingBottom: 10, paddingHorizontal: 14 },
  mottoLbl: { fontSize: 10, fontWeight: '700', letterSpacing: 1.6, color: colors.limeInk, marginBottom: 3 },
  mottoTxt: { fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 20, lineHeight: 25, color: colors.limeInk },
  env: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 9, paddingHorizontal: 14, backgroundColor: colors.paper3 },
  envIc: { width: 24, height: 16, borderWidth: 2, borderColor: colors.ink, borderRadius: 2 },
  envTxt: { flex: 1, fontSize: 13, color: colors.ink },
  filed: { position: 'absolute', right: 10, top: 7, borderWidth: 3, borderColor: colors.ink, borderRadius: 4, paddingVertical: 1, paddingHorizontal: 7, backgroundColor: colors.paper2 },
  filedTxt: { fontFamily: fonts.stamp, fontSize: 13, letterSpacing: 1, color: colors.ink },
});
