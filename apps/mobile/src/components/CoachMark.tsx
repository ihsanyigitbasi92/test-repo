/**
 * Coach-mark hints (docs/design/18 §4): the screen dims except one real UI piece (lime frame), and a single line
 * from Motto sits next to it. Tap anywhere to dismiss; the game clock is held while it is up (LifeScreen →
 * `game.hold`). Targets register themselves with `useHintTarget(id)`; the layer measures them in window
 * coordinates relative to the phone frame, so it works on iOS, Android and web alike. If a target cannot be
 * measured the line is shown centred, without a frame.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { colors, fonts, nativeDriver } from '../theme';
import { upper, useI18n } from '../i18n';
import type { HintId } from '../state/tutorial';
import { CoachAvatar } from './CoachAvatar';
import { useReducedMotion } from './anim';

type Measurable = { measureInWindow?: (cb: (x: number, y: number, w: number, h: number) => void) => void };
const targets = new Map<HintId, Measurable>();

/** Ref callback for a hint target. The latest mounted node wins (e.g. the newest report card in the feed). */
export function useHintTarget(id: HintId): (node: unknown) => void {
  const mine = useRef<Measurable | null>(null);
  return useCallback((node: unknown) => {
    if (node) { mine.current = node as Measurable; targets.set(id, node as Measurable); }
    else if (mine.current && targets.get(id) === mine.current) { targets.delete(id); mine.current = null; }
  }, [id]);
}

interface Rect { x: number; y: number; w: number; h: number }
const PAD = 6;
const GAP = 12;

function measure(node: Measurable | undefined | null): Promise<Rect | null> {
  return new Promise((resolve) => {
    if (!node?.measureInWindow) { resolve(null); return; }
    try { node.measureInWindow((x, y, w, h) => resolve(Number.isFinite(x) && w > 0 && h > 0 ? { x, y, w, h } : null)); } catch { resolve(null); }
  });
}

export function CoachMarkLayer({ hint, root, onDismiss }: { hint: HintId | null; root: { readonly current: unknown }; onDismiss: () => void }) {
  const { s, locale } = useI18n();
  const [rect, setRect] = useState<Rect | null>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [bubbleH, setBubbleH] = useState(0);
  const [ready, setReady] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();

  useEffect(() => {
    setReady(false); setRect(null); setBubbleH(0);
    if (!hint) return;
    let alive = true;
    // Let the feed settle (scroll-to-end, panel layout) before measuring.
    const t = setTimeout(async () => {
      const [r, t2] = await Promise.all([measure(root.current as unknown as Measurable), measure(targets.get(hint))]);
      if (!alive) return;
      if (r) setSize({ w: r.w, h: r.h });
      if (r && t2) {
        // Clip to the phone frame (a tall report card may run above the visible feed).
        const x = Math.max(0, t2.x - r.x), y = Math.max(0, t2.y - r.y);
        const x2 = Math.min(r.w, t2.x - r.x + t2.w), y2 = Math.min(r.h, t2.y - r.y + t2.h);
        setRect(x2 > x && y2 > y ? { x, y, w: x2 - x, h: y2 - y } : null);
      }
      setReady(true);
      fade.setValue(0);
      Animated.timing(fade, { toValue: 1, duration: reduced ? 0 : 200, useNativeDriver: nativeDriver }).start();
    }, 80);
    const line = s.tutorial.hints[hint];
    AccessibilityInfo.announceForAccessibility?.(line);
    return () => { alive = false; clearTimeout(t); };
  }, [hint, root, fade, reduced, s]);

  if (!hint) return null;
  const line = s.tutorial.hints[hint];
  const W = size?.w ?? 390, H = size?.h ?? 844;
  const r = rect ? { x: Math.max(0, rect.x - PAD), y: Math.max(0, rect.y - PAD), w: Math.min(W, rect.w + PAD * 2), h: Math.min(H, rect.h + PAD * 2) } : null;
  // Bubble below the target if it fits, else above, else pinned to the bottom of the frame.
  let bubbleTop: number | null = null;
  if (r && bubbleH) {
    if (r.y + r.h + GAP + bubbleH <= H - 8) bubbleTop = r.y + r.h + GAP;
    else if (r.y - GAP - bubbleH >= 8) bubbleTop = r.y - GAP - bubbleH;
    else bubbleTop = Math.max(8, H - bubbleH - 8);
  }
  const onBubble = (e: LayoutChangeEvent) => setBubbleH(e.nativeEvent.layout.height);
  const dim = colors.scrim;

  return (
    <Pressable style={[StyleSheet.absoluteFill, st.root]} onPress={onDismiss} testID="coach-mark" accessibilityRole="button"
      accessibilityLabel={`${line} ${s.tutorial.hintDismiss}`} accessibilityViewIsModal aria-modal>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: ready ? fade : 0 }]}>
        {r ? (
          <>
            <View style={[st.dim, { backgroundColor: dim, left: 0, right: 0, top: 0, height: r.y }]} />
            <View style={[st.dim, { backgroundColor: dim, left: 0, right: 0, top: r.y + r.h, bottom: 0 }]} />
            <View style={[st.dim, { backgroundColor: dim, left: 0, width: r.x, top: r.y, height: r.h }]} />
            <View style={[st.dim, { backgroundColor: dim, left: r.x + r.w, right: 0, top: r.y, height: r.h }]} />
            <View style={[st.frame, { left: r.x, top: r.y, width: r.w, height: r.h }]} testID={`coach-mark-target-${hint}`} />
          </>
        ) : <View style={[StyleSheet.absoluteFill, { backgroundColor: dim }]} />}
        <View onLayout={onBubble} testID={`coach-mark-${hint}`}
          style={[st.bubble, bubbleTop === null ? st.bubbleCenter : { top: bubbleTop }, !bubbleH && st.measuring]}>
          <View style={st.head}>
            <CoachAvatar mood="smirk" size={30} />
            <Text style={st.tag}>{upper(locale, s.tutorial.hintTag)}</Text>
          </View>
          <Text style={st.line}>{line}</Text>
          <Text style={st.dismiss}>{s.tutorial.hintDismiss}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const st = StyleSheet.create({
  root: { zIndex: 40 },
  dim: { position: 'absolute' },
  frame: { position: 'absolute', borderWidth: 2, borderColor: colors.lime, borderRadius: 10 },
  bubble: { position: 'absolute', left: 16, right: 16, backgroundColor: colors.paper2, borderRadius: 10, borderWidth: 1, borderColor: colors.line,
    borderLeftWidth: 4, borderLeftColor: colors.lime, paddingVertical: 12, paddingHorizontal: 14, gap: 6 },
  bubbleCenter: { top: '38%' },
  measuring: { opacity: 0 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tag: { fontFamily: fonts.stamp, fontSize: 12, letterSpacing: 1.4, color: colors.lime },
  line: { fontSize: 16, lineHeight: 22, color: colors.ink, fontFamily: fonts.body },
  dismiss: { fontSize: 12, color: colors.ink2, fontFamily: fonts.coach, fontStyle: 'italic' },
});
