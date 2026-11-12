/**
 * Opening cover (D-158): MOTTO logo stamp + tagline, "by D2P Technology" underneath.
 * ~2.6 s, tap anywhere to skip. Runs on iOS, Android and web (Animated, no extra native modules).
 */
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, nativeDriver } from '../theme';
import { useI18n } from '../i18n';
import { sfx } from '../state/sound';
import { UI_SFX } from '../state/sfx';

export const COMPANY = 'D2P Technology';
const HOLD_MS = 1500;

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const { s } = useI18n();
  const logo = useRef(new Animated.Value(0)).current;
  const sub = useRef(new Animated.Value(0)).current;
  const by = useRef(new Animated.Value(0)).current;
  const out = useRef(new Animated.Value(1)).current;
  const done = useRef(false);
  const finish = () => {
    if (done.current) return;
    done.current = true;
    Animated.timing(out, { toValue: 0, duration: 280, useNativeDriver: nativeDriver }).start(() => onDone());
  };

  useEffect(() => {
    const anim = Animated.sequence([
      Animated.spring(logo, { toValue: 1, friction: 5, tension: 90, useNativeDriver: nativeDriver }),
      Animated.timing(sub, { toValue: 1, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: nativeDriver }),
      Animated.timing(by, { toValue: 1, duration: 320, easing: Easing.out(Easing.quad), useNativeDriver: nativeDriver }),
      Animated.delay(HOLD_MS),
    ]);
    anim.start(({ finished }) => { if (finished) finish(); });
    // The logo is a rubber stamp: it lands ~140 ms into the spring (web: only heard after a first tap — autoplay policy).
    const thud = setTimeout(() => sfx(UI_SFX.splashStamp), 140);
    return () => { clearTimeout(thud); anim.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scale = logo.interpolate({ inputRange: [0, 1], outputRange: [2.4, 1] });
  const rotate = logo.interpolate({ inputRange: [0, 1], outputRange: ['-14deg', '-4deg'] });
  const rise = (v: Animated.Value) => v.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });

  return (
    <Animated.View style={[st.root, { opacity: out }]} testID="splash">
      <Pressable style={st.fill} onPress={finish} accessibilityRole="button" accessibilityLabel="Motto">
        <View style={st.center}>
          <Animated.View style={[st.stamp, { opacity: logo, transform: [{ scale }, { rotate }] }]}>
            <Text style={st.logo}>MOTTO</Text>
          </Animated.View>
          <Animated.Text style={[st.sub, { opacity: sub, transform: [{ translateY: rise(sub) }] }]}>{s.brandSub}</Animated.Text>
        </View>
        <Animated.View style={[st.byWrap, { opacity: by, transform: [{ translateY: rise(by) }] }]}>
          <Text style={st.byLbl}>by</Text>
          <Text style={st.company} testID="splash-company">{COMPANY}</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const st = StyleSheet.create({
  root: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.paper, zIndex: 100 },
  fill: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingTop: 80, paddingBottom: 56 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  stamp: { borderWidth: 4, borderColor: colors.lime, borderRadius: 10, paddingHorizontal: 22, paddingVertical: 6 },
  logo: { fontFamily: fonts.stamp, fontSize: 64, letterSpacing: 4, color: colors.lime },
  sub: { marginTop: 22, fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 18, color: colors.ink },
  byWrap: { alignItems: 'center' },
  byLbl: { fontFamily: fonts.body, fontSize: 12, letterSpacing: 2, color: colors.ink2, textTransform: 'uppercase' },
  company: { marginTop: 4, fontFamily: fonts.stamp, fontSize: 16, letterSpacing: 3, color: colors.ink },
});
