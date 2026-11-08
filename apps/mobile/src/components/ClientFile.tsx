/** Müşteri Dosyası (07 §2.3.2, 0:08): name · 18 · city, [Shuffle] [This one], optional "Live fast" (engine fastLife). */
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { upper, useI18n } from '../i18n';
import { useAppear } from './anim';

interface Props { name: string; city: string; lifeNo: number; fastLife: boolean; onShuffle: () => void; onKeep: () => void; onFastLife: () => void }

export function ClientFile({ name, city, lifeNo, fastLife, onShuffle, onKeep, onFastLife }: Props) {
  const { s, locale } = useI18n();
  const anim = useAppear('pop', 300);
  return (
    <Animated.View style={[st.file, anim]} testID="client-file">
      <View style={st.head}><Text style={st.title}>{s.fileTitle}</Text><Text style={st.no} testID="client-life">{s.lifeN(lifeNo)}</Text></View>
      <View style={st.row}><Text style={st.k}>{upper(locale, s.fileName)}</Text><Text style={st.vName} testID="client-name">{name}</Text></View>
      <View style={st.row}><Text style={st.k}>{upper(locale, s.fileAge)}</Text><Text style={st.v}>18</Text></View>
      <View style={st.row}><Text style={st.k}>{upper(locale, s.fileCity)}</Text><Text style={st.v}>{city}</Text></View>
      <Text style={st.hint}>{s.fileHint}</Text>
      <View style={st.btns}>
        <Pressable onPress={onShuffle} style={({ pressed }) => [st.btn, pressed && st.pressed]} accessibilityRole="button" testID="shuffle">
          <Text style={st.btnTxt}>⟳ {s.cta.shuffle}</Text>
        </Pressable>
        <Pressable onPress={onKeep} style={({ pressed }) => [st.btn, st.keep, pressed && st.pressed]} accessibilityRole="button" testID="keep">
          <Text style={[st.btnTxt, st.keepTxt]}>{upper(locale, s.cta.keep)}</Text>
        </Pressable>
      </View>
      <Pressable onPress={onFastLife} accessibilityRole="switch" accessibilityState={{ checked: fastLife }} style={[st.chip, fastLife && st.chipOn]} testID="fast-life">
        <Text style={[st.chipTxt, fastLife && { color: colors.limeInk }]}>{fastLife ? '✓ ' : ''}{s.cta.fastLife}</Text>
      </Pressable>
    </Animated.View>
  );
}

const st = StyleSheet.create({
  file: { backgroundColor: colors.paper2, borderWidth: 1, borderColor: colors.line, borderRadius: 8, padding: 14, gap: 8 },
  head: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderStyle: 'dashed', borderBottomColor: colors.line, paddingBottom: 6 },
  title: { fontFamily: fonts.stamp, letterSpacing: 1.6, fontSize: 13, color: colors.lime },
  no: { fontSize: 11, color: colors.ink2, fontVariant: ['tabular-nums'] },
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  k: { width: 56, fontSize: 10, fontWeight: '700', letterSpacing: 1.2, color: colors.ink2 },
  vName: { flex: 1, fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 22, color: colors.ink },
  v: { flex: 1, fontSize: 15, color: colors.ink, fontWeight: '600' },
  hint: { fontSize: 12, color: colors.ink2 },
  btns: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, minHeight: 48, borderWidth: 1.5, borderColor: colors.line, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper },
  keep: { backgroundColor: colors.lime, borderColor: colors.lime },
  btnTxt: { fontSize: 15, fontWeight: '600', color: colors.ink },
  keepTxt: { fontFamily: fonts.stamp, letterSpacing: 1.4, color: colors.limeInk, fontWeight: '400' },
  pressed: { transform: [{ scale: 0.98 }] },
  chip: { alignSelf: 'flex-start', borderWidth: 1, borderColor: colors.line, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10 },
  chipOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  chipTxt: { fontSize: 11, fontWeight: '700', color: colors.ink2 },
});
