/** DateLine pill (D-109; birthday variant lime), SkipSummary (Fraunces italic) and the flowLog money lines (D-088). */
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { upper, useI18n } from '../i18n';
import type { FeedItemOf } from '../state/feed';
import { useAppear } from './anim';
import { dateLabel } from './Hud';

export function DateLine({ item }: { item: FeedItemOf<'date'> }) {
  const { s, locale } = useI18n();
  const anim = useAppear('rise', 250);
  const base = dateLabel(s, locale, item.calendarDay ?? item.dayIndex, item.dateISO);
  const label = item.birthday ? `${base.split(' · ').slice(0, 1).join('')} · ${upper(locale, s.birthdayTag)}` : base;
  return (
    <Animated.View style={[st.date, item.birthday && st.dateBday, anim]} testID={item.birthday ? 'dateline-birthday' : 'dateline'}>
      <Text style={[st.dateTxt, item.birthday && { color: colors.limeInk }]}>{label}</Text>
    </Animated.View>
  );
}

/** NPC typing beat (mock `.typing` •••) shown just before a bubble lands. */
export function TypingLine({ item }: { item: FeedItemOf<'typing'> }) {
  const { s } = useI18n();
  const anim = useAppear('fade', 150);
  const name = s.speaker[item.speaker] ?? '';
  return <Animated.Text style={[st.typing, anim]} testID="typing">•••{name ? `  ${name} ${s.typing}` : ''}</Animated.Text>;
}

export function SkipSummary({ item }: { item: FeedItemOf<'skip'> }) {
  const { text } = useI18n();
  const anim = useAppear('fade', 350);
  return <Animated.Text style={[st.skip, anim]}>{text(item.key, item.params)}</Animated.Text>;
}

export function FlowLines({ item }: { item: FeedItemOf<'flow'> }) {
  const { s } = useI18n();
  const anim = useAppear('fade');
  return (
    <Animated.View style={[st.flow, anim]}>
      {item.lines.map((l, i) => (
        <View key={i} style={st.flowRow}>
          <Text style={[st.flowDot, { color: l.para >= 0 ? colors.called : colors.wrong }]}>{l.para >= 0 ? '▲' : '▼'}</Text>
          <Text style={st.flowTxt}>{l.kind === 'rent' && item.momsHouse ? s.flow.rentMom(l.para) : s.flow[l.kind](l.para)}</Text>
        </View>
      ))}
    </Animated.View>
  );
}

const st = StyleSheet.create({
  date: { alignSelf: 'center', borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 12, marginTop: 6 },
  dateBday: { backgroundColor: colors.lime, borderColor: colors.lime, borderStyle: 'solid' },
  dateTxt: { fontFamily: fonts.stamp, fontSize: 12, letterSpacing: 1.2, color: colors.ink },
  skip: { alignSelf: 'center', textAlign: 'center', maxWidth: '88%', fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 13, color: colors.ink2 },
  typing: { alignSelf: 'flex-start', fontSize: 12, letterSpacing: 1.5, color: colors.ink2, paddingVertical: 2, paddingHorizontal: 14 },
  flow: { gap: 2, paddingHorizontal: 6 },
  flowRow: { flexDirection: 'row', gap: 6 },
  flowTxt: { flex: 1, fontSize: 12, color: colors.ink2 },
  flowDot: { fontSize: 9, marginTop: 3 },
});
