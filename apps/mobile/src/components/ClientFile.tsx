/**
 * Müşteri Dosyası (07 §2.3.2, 0:08): portrait · name · 18 · city.
 * Character creation: big avatar preview, ⟳ whole-look shuffle, ‹ › per part (hair, hair colour, skin, face,
 * glasses, facial hair), a short coach roast reacting to the look, name shuffle, [This one], optional "Live fast".
 * The look is UI state (useGame keeps it per life); nothing here touches engine rules.
 */
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, nativeDriver } from '../theme';
import { upper, useI18n } from '../i18n';
import { useAppear, useReducedMotion } from './anim';
import { Avatar } from '../avatar/Avatar';
import { EDITABLE_PARTS, partCount, partValue } from '../avatar/look';
import type { Look, LookPart } from '../avatar/look';
import { pickLookRoast } from '../avatar/roast';
import { CoachAvatar } from './CoachAvatar';

interface Props {
  name: string; city: string; lifeNo: number; fastLife: boolean;
  look: Look; lookChanged: LookPart | null; lookNonce: number;
  onShuffle: () => void; onKeep: () => void; onFastLife: () => void;
  onShuffleLook: () => void; onCycle: (part: LookPart, dir: 1 | -1) => void;
}

function Portrait({ look, nonce }: { look: Look; nonce: number }) {
  const reduced = useReducedMotion();
  const v = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!nonce || reduced) return;
    v.setValue(0.9);
    Animated.spring(v, { toValue: 1, friction: 4, tension: 160, useNativeDriver: nativeDriver }).start();
  }, [nonce, reduced, v]);
  return (
    <Animated.View style={[st.portrait, { transform: [{ scale: v }] }]} testID="look-preview">
      <View style={{ marginTop: 15 }}><Avatar look={look} age={18} mood="neutral" outfit="hoodie" size={124} /></View>
    </Animated.View>
  );
}

function PartPicker({ part, label, value, pos, onCycle, prev, next }: { part: LookPart; label: string; value: string; pos: string; onCycle: Props['onCycle']; prev: string; next: string }) {
  const a11yValue = { text: `${value} (${pos})` };
  return (
    <View style={st.part}>
      <Pressable onPress={() => onCycle(part, -1)} hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }} accessibilityRole="button" accessibilityLabel={`${label} ${prev}`} accessibilityValue={a11yValue} testID={`look-${part}-prev`}
        style={({ pressed }) => [st.arrow, pressed && st.pressed]}>
        <Text style={st.arrowTxt}>‹</Text>
      </Pressable>
      <View style={st.partMid}>
        <Text style={st.partLbl} numberOfLines={1}>{label}</Text>
        <Text style={st.partVal} numberOfLines={1} testID={`look-${part}-value`}>{value}</Text>
      </View>
      <Pressable onPress={() => onCycle(part, 1)} hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }} accessibilityRole="button" accessibilityLabel={`${label} ${next}`} accessibilityValue={a11yValue} testID={`look-${part}-next`}
        style={({ pressed }) => [st.arrow, pressed && st.pressed]}>
        <Text style={st.arrowTxt}>›</Text>
      </Pressable>
    </View>
  );
}

export function ClientFile({ name, city, lifeNo, fastLife, look, lookChanged, lookNonce, onShuffle, onKeep, onFastLife, onShuffleLook, onCycle }: Props) {
  const { s, locale } = useI18n();
  const anim = useAppear('pop', 300);
  const roastKey = pickLookRoast(look, lookChanged, (k) => k in s.lookRoast, s.lookRoastGeneric.length, lookNonce);
  const roast = roastKey.startsWith('generic:') ? s.lookRoastGeneric[Number(roastKey.slice(8))] ?? '' : s.lookRoast[roastKey] ?? '';
  return (
    <Animated.View style={[st.file, anim]} testID="client-file">
      <View style={st.head}><Text style={st.title}>{s.fileTitle}</Text><Text style={st.no} testID="client-life">{s.lifeN(lifeNo)}</Text></View>

      <View style={st.lookRow}>
        <View style={st.lookLeft}>
          <Portrait look={look} nonce={lookNonce} />
          <Pressable onPress={onShuffleLook} accessibilityRole="button" testID="shuffle-look" style={({ pressed }) => [st.lookBtn, pressed && st.pressed]}>
            <Text style={st.lookBtnTxt}>⟳ {s.look.shuffle}</Text>
          </Pressable>
        </View>
        <View style={st.parts}>
          {EDITABLE_PARTS.map((p) => {
            const n = partCount(p), i = look[p] + 1;
            const value = p === 'skin' ? s.look.tone(i, n) : s.look.values[`${p}.${partValue(look, p)}`] ?? partValue(look, p);
            return <PartPicker key={p} part={p} label={s.look.parts[p] ?? p} value={value} pos={`${i}/${n}`} onCycle={onCycle} prev={s.look.prev} next={s.look.next} />;
          })}
        </View>
      </View>

      <View style={st.roast} testID="look-roast">
        <CoachAvatar mood="smirk" size={22} />
        <Text style={st.roastTxt}>{roast}</Text>
      </View>

      <View style={st.row}><Text style={st.k}>{upper(locale, s.fileName)}</Text><Text style={st.vName} testID="client-name">{name}</Text></View>
      <View style={st.row}>
        <Text style={st.k}>{upper(locale, s.fileAge)}</Text><Text style={[st.v, { flex: 0, width: 32 }]}>18</Text>
        <Text style={[st.k, { width: 'auto' }]}>{upper(locale, s.fileCity)}</Text><Text style={st.v}>{city}</Text>
      </View>
      <Text style={st.hint}>{s.fileHint}</Text>
      <View style={st.btns}>
        <Pressable onPress={onShuffle} style={({ pressed }) => [st.btn, pressed && st.pressed]} accessibilityRole="button" accessibilityLabel={s.look.nameShuffle} testID="shuffle">
          <Text style={st.btnTxt}>⟳ {s.cta.shuffle}</Text>
        </Pressable>
        <Pressable onPress={onKeep} style={({ pressed }) => [st.btn, st.keep, pressed && st.pressed]} accessibilityRole="button" testID="keep">
          <Text style={[st.btnTxt, st.keepTxt]}>{upper(locale, s.cta.keep)}</Text>
        </Pressable>
      </View>
      <Pressable onPress={onFastLife} accessibilityRole="switch" accessibilityState={{ checked: fastLife }} hitSlop={10} style={[st.chip, fastLife && st.chipOn]} testID="fast-life">
        <Text style={[st.chipTxt, fastLife && { color: colors.limeInk }]}>{fastLife ? '✓ ' : ''}{s.cta.fastLife}</Text>
      </Pressable>
    </Animated.View>
  );
}

const st = StyleSheet.create({
  file: { backgroundColor: colors.paper2, borderWidth: 1, borderColor: colors.line, borderRadius: 8, padding: 12, gap: 8 },
  head: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderStyle: 'dashed', borderBottomColor: colors.line, paddingBottom: 6 },
  title: { fontFamily: fonts.stamp, letterSpacing: 1.6, fontSize: 13, color: colors.lime },
  no: { fontSize: 11, color: colors.ink2, fontVariant: ['tabular-nums'] },
  lookRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  lookLeft: { alignItems: 'center', gap: 6 },
  portrait: { width: 128, height: 128, borderRadius: 64, backgroundColor: colors.paper3, borderWidth: 2, borderColor: colors.lime, alignItems: 'center', overflow: 'hidden' },
  lookBtn: { borderWidth: 1, borderColor: colors.line, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10, minHeight: 30, justifyContent: 'center' },
  lookBtnTxt: { fontSize: 11.5, fontWeight: '700', color: colors.ink },
  parts: { flex: 1, gap: 5 },
  part: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: 8, backgroundColor: colors.paper, minHeight: 30 },
  arrow: { width: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  arrowTxt: { fontSize: 20, lineHeight: 22, color: colors.lime, fontWeight: '700' },
  partMid: { flex: 1, alignItems: 'center', paddingVertical: 2 },
  partLbl: { textAlign: 'center', fontSize: 9.5, fontWeight: '700', letterSpacing: 0.8, color: colors.ink2 },
  partVal: { textAlign: 'center', fontSize: 12, fontWeight: '700', color: colors.ink },
  roast: { flexDirection: 'row', alignItems: 'center', gap: 8, borderLeftWidth: 3, borderLeftColor: colors.wrong, paddingLeft: 8, paddingVertical: 2 },
  roastTxt: { flex: 1, fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 15, lineHeight: 20, color: colors.ink },
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
  pressed: { transform: [{ scale: 0.97 }] },
  chip: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 14 },
  chipOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  chipTxt: { fontSize: 13, fontWeight: '700', color: colors.ink2 },
});
