/**
 * Decision zone (07 §2.2.1 states): Client File · choices (time paused) · One More Year (report) · Next Day (⏸ manual)
 * · always: ghost [Auto] [Enough for today]. Choice locks and the wager mark come from the engine's DayCard.
 */
import { useEffect, useMemo, useRef } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import type { DayCard } from '@motto/engine';
import { colors, fonts, nativeDriver } from '../theme';
import { upper, useI18n } from '../i18n';
import { useAppear } from './anim';
import { useHintTarget } from './CoachMark';

/** Horizontal drag (px) that picks the arrowed choice on that side (UX playtest #20: the arrows promised a swipe). */
export const SWIPE_PICK_PX = 72;

export function ChoiceButtons({ card, onPick }: { card: DayCard; onPick: (id: string) => void }) {
  const { s, text } = useI18n();
  const anim = useAppear('rise', 220);
  const target = useHintTarget('choices');
  // Swipe: a choice marked ← / → is also picked by dragging the panel to that side (taps keep working as before).
  const left = card.choices.find((c) => c.swipe === 'left' && !c.locked);
  const right = card.choices.find((c) => c.swipe === 'right' && !c.locked);
  const dx = useRef(new Animated.Value(0)).current;
  const pickRef = useRef(onPick);
  pickRef.current = onPick;
  const pan = useMemo(() => (left || right ? PanResponder.create({
    onMoveShouldSetPanResponderCapture: (_e, g) => Math.abs(g.dx) > 14 && Math.abs(g.dx) > Math.abs(g.dy) * 2,
    onPanResponderMove: (_e, g) => dx.setValue(Math.max(-90, Math.min(90, g.dx * 0.6))),
    onPanResponderTerminationRequest: () => false,
    onPanResponderRelease: (_e, g) => {
      const c = g.dx <= -SWIPE_PICK_PX ? left : g.dx >= SWIPE_PICK_PX ? right : undefined;
      Animated.spring(dx, { toValue: 0, friction: 7, useNativeDriver: nativeDriver }).start();
      if (c) pickRef.current(c.id);
    },
    onPanResponderTerminate: () => { Animated.spring(dx, { toValue: 0, friction: 7, useNativeDriver: nativeDriver }).start(); },
  }) : null), [left, right, dx]);
  return (
    <View ref={target} collapsable={false} {...(pan ? pan.panHandlers : {})} testID="choices-zone">
      <Animated.View style={pan ? { transform: [{ translateX: dx }] } : undefined}>
        <Animated.View style={[st.col, anim]} testID="choices">
          {card.choices.map((c) => {
            const wagered = card.wager?.choiceId === c.id;
            return (
              <Pressable key={c.id} disabled={c.locked} onPress={() => onPick(c.id)} accessibilityRole="button" testID={`choice-${c.id}`}
                style={({ pressed }) => [st.btn, wagered && st.btnWager, c.locked && st.btnLocked, pressed && st.pressed]}>
                <Text style={[st.btnTxt, c.locked && { color: colors.ink2 }]}>
                  {c.swipe === 'left' ? '← ' : ''}{text(c.textKey)}{c.swipe === 'right' ? ' →' : ''}
                </Text>
                {wagered && <Text style={st.hint}>{s.wager}</Text>}
                {c.locked && <Text style={st.hint}>×</Text>}
              </Pressable>
            );
          })}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export function PrimaryButton({ label, onPress, pulse, testID }: { label: string; onPress: () => void; pulse?: boolean; testID?: string }) {
  const { locale } = useI18n();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!pulse) return;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(v, { toValue: 1, duration: 550, useNativeDriver: nativeDriver }),
      Animated.timing(v, { toValue: 0, duration: 550, useNativeDriver: nativeDriver }),
    ]), { iterations: 3 });
    loop.start();
    return () => loop.stop();
  }, [pulse, v]);
  return (
    <Animated.View style={{ transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] }) }] }}>
      <Pressable onPress={onPress} accessibilityRole="button" testID={testID} style={({ pressed }) => [st.primary, pressed && st.pressed]}>
        <Text style={st.primaryTxt}>{upper(locale, label)}</Text>
      </Pressable>
    </Animated.View>
  );
}

export function GhostRow({ auto, onAuto, onEnough, highlightEnough = false, onSettings }: { auto: boolean; onAuto: () => void; onEnough?: () => void; highlightEnough?: boolean; onSettings?: () => void }) {
  const { s } = useI18n();
  return (
    <View style={st.row}>
      <Pressable onPress={onAuto} accessibilityRole="switch" accessibilityState={{ checked: auto }} testID="auto-toggle"
        style={({ pressed }) => [st.ghost, auto && st.ghostOn, pressed && st.pressed]}>
        <Text style={[st.ghostTxt, auto && { color: colors.limeInk }]}>{auto ? s.cta.autoOn : s.cta.auto}</Text>
      </Pressable>
      {onEnough && (
        <Pressable onPress={onEnough} accessibilityRole="button" testID="enough"
          style={({ pressed }) => [st.ghost, highlightEnough && st.ghostHi, pressed && st.pressed]}>
          <Text style={st.ghostTxt}>{s.cta.enough}</Text>
        </Pressable>
      )}
      {onSettings && (
        <Pressable onPress={onSettings} accessibilityRole="button" accessibilityLabel={s.settings.open} testID="settings-open"
          style={({ pressed }) => [st.ghost, st.ghostIcon, pressed && st.pressed]}>
          <Text style={st.ghostGlyph}>≡</Text>
        </Pressable>
      )}
    </View>
  );
}

export const zone = StyleSheet.create({
  wrap: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12, borderTopWidth: 1, borderTopColor: colors.line, gap: 8, backgroundColor: colors.paper },
});

const st = StyleSheet.create({
  col: { gap: 8 },
  btn: { minHeight: 48, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.paper2, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  btnWager: { borderColor: colors.note },
  btnLocked: { opacity: 0.5 },
  btnTxt: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.ink, fontFamily: fonts.body },
  hint: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6, color: colors.note },
  pressed: { transform: [{ scale: 0.98 }] },
  primary: { minHeight: 58, backgroundColor: colors.lime, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 },
  primaryTxt: { fontFamily: fonts.stamp, fontSize: 16, letterSpacing: 1.8, color: colors.limeInk },
  row: { flexDirection: 'row', gap: 8 },
  ghost: { flex: 1, minHeight: 40, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.line, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  ghostIcon: { flexGrow: 0, flexShrink: 0, flexBasis: 44, width: 44, paddingHorizontal: 0 },
  ghostGlyph: { fontSize: 20, lineHeight: 22, fontWeight: '700', color: colors.ink2 },
  ghostOn: { backgroundColor: colors.lime, borderColor: colors.lime, borderStyle: 'solid' },
  ghostHi: { borderColor: colors.note },
  ghostTxt: { fontSize: 13, fontWeight: '500', color: colors.ink2 },
});
