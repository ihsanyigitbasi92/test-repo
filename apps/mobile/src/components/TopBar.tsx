/** Brand + speed control (II / ▶ / ▶▶, D-066) + runtime language switch (TR / EN). */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Locale, Speed } from '@motto/engine';
import { colors, fonts } from '../theme';
import { upper, useI18n } from '../i18n';

interface Props {
  speed: Speed; locale: Locale; showSpeed: boolean;
  onSpeed: (s: Speed) => void; onLocale: (l: Locale) => void;
}

const SPEEDS: { s: Speed; glyph: string }[] = [{ s: 'pause', glyph: 'II' }, { s: 'play', glyph: '▶' }, { s: 'fast', glyph: '▶▶' }];

export function TopBar({ speed, locale, showSpeed, onSpeed, onLocale }: Props) {
  const { s } = useI18n();
  return (
    <View style={st.bar}>
      <View style={st.brandBox}>
        <Text style={st.brand}>MOTTO</Text>
        <Text style={st.sub} numberOfLines={1}>{upper(locale, s.brandSub)}</Text>
      </View>
      <View style={st.chips}>
        {showSpeed && (
          <View style={st.speed} accessibilityRole="radiogroup">
            {SPEEDS.map(({ s: sp, glyph }) => (
              <Pressable key={sp} onPress={() => onSpeed(sp)} accessibilityRole="radio" accessibilityLabel={s.speedA11y[sp]}
                accessibilityState={{ selected: speed === sp }} testID={`speed-${sp}`} style={[st.speedBtn, speed === sp && st.speedOn]}>
                <Text style={[st.speedTxt, speed === sp && st.speedTxtOn]}>{glyph}</Text>
              </Pressable>
            ))}
          </View>
        )}
        {(['tr', 'en'] as Locale[]).map((l) => (
          <Pressable key={l} onPress={() => onLocale(l)} accessibilityRole="button" accessibilityState={{ selected: locale === l }}
            testID={`lang-${l}`} style={[st.chip, locale === l && st.chipOn]}>
            <Text style={[st.chipTxt, locale === l && st.chipTxtOn]}>{l.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6, gap: 8 },
  brandBox: { flexShrink: 1 },
  brand: { fontFamily: fonts.stamp, color: colors.lime, fontSize: 14, letterSpacing: 2.2 },
  sub: { color: colors.ink2, fontSize: 9, fontWeight: '600', letterSpacing: 0.4 },
  chips: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  speed: { flexDirection: 'row', gap: 4, marginRight: 2 },
  speedBtn: { borderWidth: 1, borderColor: colors.line, borderRadius: 6, minWidth: 32, height: 28, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  speedOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  speedTxt: { color: colors.ink2, fontSize: 12, fontWeight: '700' },
  speedTxtOn: { color: colors.paper },
  chip: { borderWidth: 1, borderColor: colors.line, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 8 },
  chipOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  chipTxt: { color: colors.ink, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  chipTxtOn: { color: colors.limeInk },
});
