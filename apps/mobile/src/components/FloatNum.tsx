/**
 * FloatingNumber (mock `.float`): fades over 1.1 s; lime up, red down. Anchored to its own HUD cell and kept
 * short (`rise` px) so it never drifts into a neighbouring stat label.
 */
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';
import { colors, fonts, nativeDriver } from '../theme';

export function FloatNum({ label, up, rise = 14, style }: { label: string; up: boolean; rise?: number; style?: StyleProp<TextStyle> }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 1100, easing: Easing.out(Easing.quad), useNativeDriver: nativeDriver }).start();
  }, [v]);
  return (
    <Animated.Text pointerEvents="none" style={[st.f, style, { color: up ? colors.called : colors.wrong, opacity: v.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] }),
      transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -rise] }) }] }]}>
      {label}
    </Animated.Text>
  );
}

const st = StyleSheet.create({
  f: { position: 'absolute', right: 0, top: 12, fontFamily: fonts.stamp, fontSize: 15, zIndex: 5, backgroundColor: colors.paper, paddingHorizontal: 3, borderRadius: 4, overflow: 'hidden' },
});
