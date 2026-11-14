/** Top-bar entry to the shop (06 §2.2.2: the shop is always reachable from the menu, never pushed). 44 pt target. */
import { Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme';
import { useI18n } from '../i18n';

export function ShopButton({ onPress }: { onPress: () => void }) {
  const { s } = useI18n();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={s.shop.open} testID="shop-open" hitSlop={4}
      style={({ pressed }) => [st.btn, pressed && st.pressed]}>
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M5 8h14l-1 12H6L5 8Z" stroke={colors.ink} strokeWidth={1.8} strokeLinejoin="round" />
        <Path d="M9 8V7a3 3 0 0 1 6 0v1" stroke={colors.ink} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    </Pressable>
  );
}

const st = StyleSheet.create({
  btn: { borderWidth: 1, borderColor: colors.line, borderRadius: 999, minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.7 },
});
