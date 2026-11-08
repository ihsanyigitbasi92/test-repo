/** Small Animated-API helpers shared by feed items and overlays (no reanimated; works on iOS/Android/web). */
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing } from 'react-native';
import { nativeDriver } from '../theme';

export type AppearKind = 'slide' | 'pop' | 'fade' | 'rise' | 'pin';

/** One-shot entrance animation (mock: slideIn / pop / pin). Returns an Animated style. */
export function useAppear(kind: AppearKind, duration = 260) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, {
      toValue: 1, duration, useNativeDriver: nativeDriver,
      easing: kind === 'pop' || kind === 'pin' ? Easing.out(Easing.back(1.6)) : Easing.out(Easing.cubic),
    }).start();
  }, [v, kind, duration]);
  switch (kind) {
    case 'slide': return { opacity: v, transform: [{ translateX: v.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] }) }] };
    case 'pop': return { opacity: v, transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }] };
    case 'rise': return { opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] };
    case 'pin': return {
      opacity: v,
      transform: [
        { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) },
        { rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['-8deg', '-1.5deg'] }) },
      ],
    };
    default: return { opacity: v };
  }
}

/** Stamp slam: scale 3.2 → 0.9 → 1 with the stamp's fixed tilt (mock `stampIn`). */
export function useSlam(active: boolean, tilt = '-12deg', from = 3.2, reduced = false) {
  const v = useRef(new Animated.Value(active ? 0 : 1)).current;
  useEffect(() => {
    if (!active) return;
    v.setValue(0);
    Animated.timing(v, reduced
      ? { toValue: 1, duration: 150, easing: Easing.linear, useNativeDriver: nativeDriver }
      : { toValue: 1, duration: 380, easing: Easing.out(Easing.back(2.2)), useNativeDriver: nativeDriver }).start();
  }, [active, reduced, v]);
  // Reduced motion (07 §747): no press / slam — the stamp keeps its rotation and only fades in over 150 ms.
  if (reduced) return { opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0, 0.95] }), transform: [{ rotate: tilt }, { scale: 1 }] };
  return {
    opacity: v.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 1, 0.95] }),
    transform: [{ rotate: tilt }, { scale: v.interpolate({ inputRange: [0, 1], outputRange: [from, 1] }) }],
  };
}

/** Typewriter reveal for coach lines; a text change after mount (language switch) shows the full line at once. */
export function useTypewriter(text: string, msPerChar: number): string {
  const first = useRef(text);
  const [n, setN] = useState(msPerChar > 0 ? 0 : text.length);
  useEffect(() => {
    if (text !== first.current || msPerChar <= 0) { setN(text.length); return; }
    let i = 0;
    const step = Math.max(1, Math.round(16 / msPerChar));
    const id = setInterval(() => {
      i = Math.min(text.length, i + step);
      setN(i);
      if (i >= text.length) clearInterval(id);
    }, Math.max(14, msPerChar));
    return () => clearInterval(id);
  }, [text, msPerChar]);
  return text.slice(0, n);
}

/** Integer count-up (Roast numbers: 18 steps × 60 ms). */
export function useCountUp(target: number, run: boolean, steps = 18, ms = 60): number {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let k = 0;
    const id = setInterval(() => {
      k++;
      setV(Math.round((target * k) / steps));
      if (k >= steps) clearInterval(id);
    }, ms);
    return () => clearInterval(id);
  }, [target, run, steps, ms]);
  return run ? v : 0;
}

/** System "reduce motion" (iOS / Android setting, web `prefers-reduced-motion`). Starts false; updates live. */
/** Web: read the media query synchronously so the very first frames already honour it (no async flash of motion). */
function initialReducedMotion(): boolean {
  try {
    const mm = (globalThis as { matchMedia?: (q: string) => { matches: boolean } }).matchMedia;
    return typeof mm === 'function' ? !!mm('(prefers-reduced-motion: reduce)').matches : false;
  } catch { return false; }
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(initialReducedMotion);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((v) => { if (alive) setReduced(v); }).catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener?.('reduceMotionChanged', (v: boolean) => setReduced(v));
    return () => { alive = false; sub?.remove?.(); };
  }, []);
  return reduced;
}
