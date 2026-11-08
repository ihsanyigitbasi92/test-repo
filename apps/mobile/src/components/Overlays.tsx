/** Full-screen juice layers (07 §2.5): FlashLayer, BigStampOverlay, AgeUpOverlay, session-end sheet. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, nativeDriver } from '../theme';
import { useI18n } from '../i18n';
import type { StampResult } from '../state/feed';
import { PrimaryButton } from './ActionZone';
import { CalendarLeaf } from './AvatarMoment';

export function FlashLayer({ flash }: { flash: { key: number; color: 'red' | 'lime' | 'gold' } | null }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!flash) return;
    v.setValue(1);
    Animated.timing(v, { toValue: 0, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: nativeDriver }).start();
  }, [flash, v]);
  if (!flash) return null;
  const bg = flash.color === 'red' ? colors.redFlash : flash.color === 'gold' ? colors.goldFlash : colors.limeFlash;
  return <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: bg, opacity: v, zIndex: 15 }]} />;
}

/** Ink splatter burst for the stamp slam (mock `splatter()`): 14 dots fly out and fade in ~0.5 s. */
function Splatter({ color, seed }: { color: string; seed: number }) {
  const v = useRef(new Animated.Value(0)).current;
  const dots = useMemo(() => {
    let x = seed * 9301 + 49297;
    const rnd = () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
    return Array.from({ length: 14 }, (_, i) => {
      const ang = (i / 14) * Math.PI * 2 + rnd() * 0.5;
      const dist = 70 + rnd() * 90;
      return { dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist * 0.75, size: 5 + Math.round(rnd() * 7) };
    });
  }, [seed]);
  useEffect(() => {
    v.setValue(0);
    Animated.timing(v, { toValue: 1, duration: 520, delay: 160, easing: Easing.out(Easing.quad), useNativeDriver: nativeDriver }).start();
  }, [seed, v]);
  return (
    <View pointerEvents="none" style={st.splatHost}>
      {dots.map((d, i) => (
        <Animated.View key={i} testID="splat" style={{ position: 'absolute', width: d.size, height: d.size, borderRadius: d.size / 2, backgroundColor: color,
          opacity: v.interpolate({ inputRange: [0, 0.05, 1], outputRange: [0, 1, 0] }),
          transform: [
            { translateX: v.interpolate({ inputRange: [0, 1], outputRange: [0, d.dx] }) },
            { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, d.dy] }) },
            { scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 0.3] }) },
          ] }} />
      ))}
    </View>
  );
}

export function BigStamp({ stamp }: { stamp: { id: number; result: StampResult } | null }) {
  const { s } = useI18n();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!stamp) return;
    v.setValue(0);
    Animated.timing(v, { toValue: 1, duration: 550, easing: Easing.out(Easing.back(2.4)), useNativeDriver: nativeDriver }).start();
  }, [stamp, v]);
  if (!stamp) return null;
  const c = stamp.result === 'iWasWrong' ? colors.wrong : colors.called;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, st.center, { zIndex: 18 }]}>
      <Splatter color={c} seed={stamp.id} />
      <Animated.View style={[st.big, { borderColor: c, opacity: v.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1, 1] }),
        transform: [{ rotate: '-14deg' }, { scale: v.interpolate({ inputRange: [0, 1], outputRange: [4, 1] }) }] }]} testID="big-stamp">
        <Text style={[st.bigTxt, { color: c }]}>{stamp.result === 'iWasWrong' ? s.stampWrong : s.stampCalled}</Text>
      </Animated.View>
    </View>
  );
}

export function AgeUp({ ageUp }: { ageUp: { from: number; to: number } | null }) {
  const { s } = useI18n();
  const [shown, setShown] = useState(ageUp?.from ?? 0);
  const bump = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!ageUp) return;
    setShown(ageUp.from);
    const t = setTimeout(() => {
      setShown(ageUp.to);
      bump.setValue(1.25);
      Animated.spring(bump, { toValue: 1, friction: 4, useNativeDriver: nativeDriver }).start();
    }, 420);
    return () => clearTimeout(t);
  }, [ageUp, bump]);
  if (!ageUp) return null;
  return (
    <View style={[StyleSheet.absoluteFill, st.ageup]} testID="age-up">
      <Text style={st.ageLbl}>{s.agingLbl}</Text>
      <Animated.Text style={[st.ageNum, { transform: [{ scale: bump }] }]}>{shown}</Animated.Text>
      <View style={st.pages} testID="calendar">{[0, 1, 2, 3].map((i) => <CalendarLeaf key={i} turned={shown === ageUp.to} />)}</View>
    </View>
  );
}

export function SessionSheet({ session, onContinue }: { session: { years: number; days: number } | null; onContinue: () => void }) {
  const { s } = useI18n();
  if (!session) return null;
  return (
    <View style={[StyleSheet.absoluteFill, st.scrim]} testID="session-sheet">
      <View style={st.sheet}>
        <Text style={st.sheetTitle}>{s.sessionTitle}</Text>
        <Text style={st.sheetTxt}>{s.sessionText(session.years, session.days)}</Text>
        <PrimaryButton label={s.cta.cont} onPress={onContinue} testID="session-continue" />
      </View>
    </View>
  );
}

/** Root wrapper that shakes on stamps (mock `.shake` / `.shake-hard`). */
export function Shake({ shake, children }: { shake: { key: number; hard: boolean }; children: React.ReactNode }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!shake.key) return;
    const a = shake.hard ? 12 : 7;
    const seq = [-a / 3, a / 1.5, -a, a, -a, a / 1.5, -a / 3, 0].map((x) => Animated.timing(v, { toValue: x, duration: shake.hard ? 70 : 50, useNativeDriver: nativeDriver }));
    Animated.sequence(seq).start();
  }, [shake, v]);
  return <Animated.View style={{ flex: 1, transform: [{ translateX: v }] }}>{children}</Animated.View>;
}


const st = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  splatHost: { position: 'absolute', left: '50%', top: '50%', width: 0, height: 0 },
  big: { borderWidth: 6, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18, maxWidth: '90%', backgroundColor: 'rgba(0,0,0,0.25)' },
  bigTxt: { fontFamily: fonts.stamp, fontSize: 40, letterSpacing: 2, textAlign: 'center' },
  ageup: { backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center', gap: 6, zIndex: 19 },
  ageLbl: { fontSize: 11, letterSpacing: 3.3, color: colors.ink2, fontWeight: '700' },
  ageNum: { fontFamily: fonts.stamp, fontSize: 120, lineHeight: 130, color: colors.lime },
  pages: { flexDirection: 'row', gap: 5 },
  scrim: { backgroundColor: colors.scrim, alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 20 },
  sheet: { backgroundColor: colors.paper, borderRadius: 12, borderWidth: 1, borderColor: colors.line, padding: 16, gap: 12, width: '100%', maxWidth: 360 },
  sheetTitle: { fontFamily: fonts.stamp, letterSpacing: 1.4, fontSize: 14, color: colors.lime },
  sheetTxt: { fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 17, lineHeight: 23, color: colors.ink },
});
