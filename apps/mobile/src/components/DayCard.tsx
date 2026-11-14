/**
 * DayCard (07): type label + age, optional narration, DocumentCard body with [Translate], WagerSlip pinned below
 * (odds = the engine's dice threshold, honesty rule) and the StampOverlay that slams on resolution.
 */
import { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { upper, useI18n } from '../i18n';
import { eventById } from '../content/bundle';
import { speakerLabel } from '../i18n/labels';
import type { FeedItemOf } from '../state/feed';
import { useAppear, useReducedMotion, useSlam } from './anim';
import { sfx } from '../state/sound';
import { UI_SFX } from '../state/sfx';

function Stamp({ result }: { result: 'calledIt' | 'iWasWrong' }) {
  const { s } = useI18n();
  const anim = useSlam(true, '-12deg', 3.2, useReducedMotion());
  const c = result === 'iWasWrong' ? colors.wrong : colors.called;
  return (
    <Animated.View pointerEvents="none" style={[st.stamp, { borderColor: c }, anim]} testID={`stamp-${result}`}>
      <Text style={[st.stampTxt, { color: c }]}>{result === 'iWasWrong' ? s.stampWrong : s.stampCalled}</Text>
    </Animated.View>
  );
}

function WagerSlip({ slipKey, pOddsBp }: { slipKey: string; pOddsBp: number }) {
  const { s, text } = useI18n();
  const anim = useAppear('pin', 380);
  return (
    <Animated.View style={[st.slip, anim]} testID="wager-slip">
      <View style={st.pin} />
      <Text style={st.slipTxt}>{text(slipKey)}</Text>
      <Text style={st.odds}>{s.odds(Math.round(pOddsBp / 100))}</Text>
    </Animated.View>
  );
}

export function DayCard({ item }: { item: FeedItemOf<'card'> }) {
  const { s, text, locale } = useI18n();
  const anim = useAppear(item.variant === 'legend' ? 'pop' : 'pop', 300);
  const [translated, setTranslated] = useState(false);
  const ev = eventById(item.eventId);
  const doc = item.variant === 'doc' ? ev?.document : undefined;
  // Header tag: type · who it is about (first speaker of the dialog), so a dialog-only card is not an empty frame.
  const who = ev?.dialog?.find((d) => d.speaker !== 'narrator')?.speaker;
  const whoName = who && s.speaker[who] ? speakerLabel(s, locale, who, item.pStage) : undefined;
  const label = whoName && item.variant !== 'call' ? `${s.label[item.variant]} · ${upper(locale, whoName)}` : s.label[item.variant];
  const slim = !item.narration && !doc && !item.wager;
  return (
    <Animated.View style={[st.card, item.variant === 'doc' && st.doc, item.variant === 'legend' && st.legend, item.variant === 'call' && st.call,
      item.variant === 'surprise' && st.surprise, slim && st.slim, anim]} testID="day-card">
      <View style={st.labelRow}>
        <Text style={[st.label, item.variant === 'legend' && { color: colors.gold }, item.variant === 'call' && { color: colors.wrong }]}>{label}</Text>
        <Text style={st.labelRight}>{upper(locale, s.ageTag(item.age))}</Text>
      </View>
      {item.narration && <Text style={st.body}>{text(item.narration.key, item.narration.params)}</Text>}
      {doc && (
        <View style={st.docBox}>
          <Text style={st.letterhead}>{doc.letterhead[locale]}</Text>
          <Text style={st.body}>{doc.body[locale]}</Text>
          {translated ? (
            <Text style={st.tr}><Text style={st.trLbl}>{s.translate}: </Text>{s.translated(doc.translate[locale].from, doc.translate[locale].to)}</Text>
          ) : (
            <Pressable onPress={() => { setTranslated(true); sfx(UI_SFX.translate); }} style={st.trBtn} accessibilityRole="button"><Text style={st.trBtnTxt}>{s.translate} ›</Text></Pressable>
          )}
        </View>
      )}
      {item.wager && <WagerSlip slipKey={item.wager.slipKey} pOddsBp={item.wager.pOddsBp} />}
      {item.stamp && <Stamp result={item.stamp.result} />}
    </Animated.View>
  );
}

const st = StyleSheet.create({
  card: { backgroundColor: colors.paper2, borderWidth: 1, borderColor: colors.line, borderRadius: 6, paddingVertical: 10, paddingHorizontal: 14, position: 'relative', gap: 6 },
  slim: { paddingVertical: 6, borderStyle: 'dashed' },
  doc: { backgroundColor: colors.paper3, borderStyle: 'dashed' },
  legend: { borderWidth: 2, borderColor: colors.gold, shadowColor: colors.gold, shadowOpacity: 0.6, shadowRadius: 18, shadowOffset: { width: 0, height: 0 } },
  call: { borderWidth: 2, borderColor: colors.wrong },
  surprise: { borderColor: colors.called },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  label: { fontSize: 11.5, fontWeight: '700', letterSpacing: 1.2, color: colors.ink, flexShrink: 1 },
  labelRight: { fontSize: 11.5, fontWeight: '700', letterSpacing: 1.2, color: colors.ink2 },
  body: { fontSize: 15.5, color: colors.ink, fontFamily: fonts.body, lineHeight: 22 },
  docBox: { gap: 6 },
  letterhead: { fontFamily: fonts.stamp, fontSize: 12, letterSpacing: 1, color: colors.ink2 },
  tr: { fontSize: 13, color: colors.ink2, borderTopWidth: 1, borderStyle: 'dashed', borderTopColor: colors.line, paddingTop: 8 },
  trLbl: { color: colors.lime, fontWeight: '700' },
  trBtn: { alignSelf: 'flex-end', paddingVertical: 4, paddingHorizontal: 8, borderWidth: 1, borderColor: colors.line, borderRadius: 6 },
  trBtnTxt: { fontSize: 12, fontWeight: '700', color: colors.lime },
  slip: { marginTop: 6, marginHorizontal: -4, backgroundColor: colors.note, paddingVertical: 8, paddingHorizontal: 10, shadowColor: '#000', shadowOpacity: 0.35, shadowOffset: { width: 3, height: 4 }, shadowRadius: 0, elevation: 4 },
  pin: { position: 'absolute', top: -5, left: 14, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.wrong },
  slipTxt: { fontSize: 13, fontWeight: '700', color: colors.noteInk },
  odds: { fontSize: 12, fontWeight: '500', color: colors.noteInk, marginTop: 3 },
  stamp: { position: 'absolute', right: 8, top: -8, borderWidth: 3, borderRadius: 4, paddingVertical: 3, paddingHorizontal: 8, backgroundColor: 'rgba(0,0,0,0.25)', zIndex: 3 },
  stampTxt: { fontFamily: fonts.stamp, fontSize: 17, letterSpacing: 1 },
});
