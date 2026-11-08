/**
 * "Arada bir efektli an" — full-screen avatar moments (07 §2.5 juice, fxHost layer). One component, six kinds:
 *  - birthday   old face → new age with a page flip, "YAŞLANIYORSUN"
 *  - promotion  outfit swap behind a flash + confetti (new job / promotion / retired)
 *  - sad        desaturate + rain streaks (breakup / out of work)
 *  - legendary  gold glow + spin-in
 *  - wagerWin   the player's smug face + the coach's I WAS WRONG stamp
 *  - death      the face fades to grayscale 'dead' before the ECG
 * RN Animated with the native driver where the platform has it (opacity / transform only). Reduced motion: an
 * instant cross-fade, no spin / confetti / rain / flip (durations stay the same, AC-07-17). Tap anywhere skips.
 * The controller pauses the clock and the beat queue while a moment is up and closes it after `moment.ms`.
 */
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, nativeDriver } from '../theme';
import { upper, useI18n } from '../i18n';
import { Avatar, CatSprite } from '../avatar/Avatar';
import { seededRng } from '../avatar/look';
import type { Look, Mood, TopStyle } from '../avatar/look';
import type { MomentView } from '../avatar/moments';
import { useReducedMotion, useSlam } from './anim';
import { CoachAvatar } from './CoachAvatar';

const FACE = 176;

interface Props { moment: MomentView; look: Look; onSkip: () => void }

function Face({ look, age, mood, outfit, desaturate }: { look: Look; age: number; mood: Mood; outfit: TopStyle; desaturate?: number }) {
  return (
    <View style={st.disc}>
      <View style={{ marginTop: FACE * 0.13 }}><Avatar look={look} age={age} mood={mood} outfit={outfit} size={FACE - 6} desaturate={desaturate} /></View>
    </View>
  );
}

/** 0 → 1 over `ms` (reduced: a 150 ms fade at the swap point, same total time). */
function useProgress(id: number, ms: number, reduced: boolean, easing = Easing.inOut(Easing.cubic)) {
  const v = useRef(new Animated.Value(0)).current;
  const ease = useRef(easing).current;   // fixed per mount: a new easing fn each render must not restart the run
  useEffect(() => {
    v.setValue(0);
    const a = reduced
      ? Animated.sequence([Animated.delay(Math.max(0, ms * 0.4)), Animated.timing(v, { toValue: 1, duration: 150, useNativeDriver: nativeDriver })])
      : Animated.timing(v, { toValue: 1, duration: ms, easing: ease, useNativeDriver: nativeDriver });
    a.start();
    return () => a.stop();
  }, [id, ms, reduced, v, ease]);
  return v;
}

function Confetti({ seed }: { seed: number }) {
  const v = useRef(new Animated.Value(0)).current;
  const bits = useMemo(() => {
    const r = seededRng(`confetti:${seed}`);
    const palette = [colors.lime, colors.gold, colors.called, colors.wrong, colors.note, '#9ad1ff'];
    return Array.from({ length: 36 }, () => ({
      left: `${Math.round(r() * 100)}%` as const, delay: r() * 0.35, drift: (r() - 0.5) * 80, spin: 180 + r() * 540,
      w: 5 + Math.round(r() * 5), h: 8 + Math.round(r() * 6), color: palette[Math.floor(r() * palette.length)]!,
    }));
  }, [seed]);
  useEffect(() => {
    v.setValue(0);
    const a = Animated.timing(v, { toValue: 1, duration: 2000, easing: Easing.out(Easing.quad), useNativeDriver: nativeDriver });
    a.start();
    return () => a.stop();
  }, [seed, v]);
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {bits.map((b, i) => (
        <Animated.View key={i} testID="confetti" style={{ position: 'absolute', top: -20, left: b.left, width: b.w, height: b.h, backgroundColor: b.color, borderRadius: 1,
          opacity: v.interpolate({ inputRange: [0, b.delay, Math.min(1, b.delay + 0.05), 0.85, 1], outputRange: [0, 0, 1, 1, 0] }),
          transform: [
            { translateY: v.interpolate({ inputRange: [0, b.delay, 1], outputRange: [0, 0, 760] }) },
            { translateX: v.interpolate({ inputRange: [0, 1], outputRange: [0, b.drift] }) },
            { rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${Math.round(b.spin)}deg`] }) },
          ] }} />
      ))}
    </View>
  );
}

function Rain({ seed, still }: { seed: number; still: boolean }) {
  const drops = useMemo(() => {
    const r = seededRng(`rain:${seed}`);
    return Array.from({ length: 22 }, () => ({ left: `${Math.round(r() * 100)}%` as const, top: Math.round(r() * 600), len: 18 + Math.round(r() * 26), ms: 650 + Math.round(r() * 450), delay: Math.round(r() * 600) }));
  }, [seed]);
  const vals = useRef(drops.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    if (still) return;
    const loops = drops.map((d, i) => Animated.loop(Animated.sequence([
      Animated.delay(d.delay), Animated.timing(vals[i]!, { toValue: 1, duration: d.ms, easing: Easing.linear, useNativeDriver: nativeDriver }),
    ])));
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [drops, still, vals]);
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {drops.map((d, i) => (
        <Animated.View key={i} testID="rain" style={{ position: 'absolute', left: d.left, top: still ? d.top : -60, width: 2, height: d.len, borderRadius: 1, backgroundColor: 'rgba(168,190,210,0.55)',
          transform: still ? [{ rotate: '12deg' }] : [{ rotate: '12deg' }, { translateY: vals[i]!.interpolate({ inputRange: [0, 1], outputRange: [0, 820] }) }] }} />
      ))}
    </View>
  );
}

function GoldGlow({ still }: { still: boolean }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (still) return;
    const a = Animated.loop(Animated.sequence([
      Animated.timing(v, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: nativeDriver }),
      Animated.timing(v, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: nativeDriver }),
    ]));
    a.start();
    return () => a.stop();
  }, [still, v]);
  if (still) return <View pointerEvents="none" style={[st.glow, { opacity: 0.6, transform: [{ scale: 1.08 }] }]} />;
  return (
    <Animated.View pointerEvents="none" testID="gold-glow" style={[st.glow, {
      opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.85] }),
      transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1.04, 1.22] }) }],
    }]} />
  );
}

function WrongStamp() {
  const { s } = useI18n();
  const anim = useSlam(true, '-12deg', 3.2);
  return <Animated.View style={[st.stamp, anim]} testID="moment-stamp"><Text style={st.stampTxt}>{s.stampWrong}</Text></Animated.View>;
}

export function AvatarMoment({ moment: m, look, onSkip }: Props) {
  const { s, locale } = useI18n();
  const reduced = useReducedMotion();
  const ms = Math.max(600, m.ms - 300);
  const v = useProgress(m.id, ms, reduced);
  // a quick entrance shared by every kind
  const enter = useProgress(m.id, reduced ? 1 : 260, reduced, Easing.out(Easing.back(1.4)));

  const swap = (a: number) => ({ old: v.interpolate({ inputRange: [0, a, Math.min(1, a + 0.001), 1], outputRange: [1, 1, 0, 0] }), next: v.interpolate({ inputRange: [0, a, Math.min(1, a + 0.001), 1], outputRange: [0, 0, 1, 1] }) });
  const fade = (from: number, to: number) => ({ old: v.interpolate({ inputRange: [0, from, to, 1], outputRange: [1, 1, 0, 0] }), next: v.interpolate({ inputRange: [0, from, to, 1], outputRange: [0, 0, 1, 1] }) });

  let label = '';
  let sub: string | null = null;
  let stage: React.ReactNode = null;
  let fx: React.ReactNode = null;
  let bg = 'rgba(10,13,10,0.96)';

  switch (m.kind) {
    case 'birthday': {
      label = s.agingLbl;
      const { old, next } = reduced ? fade(0.4, 0.42) : swap(0.5);
      const flip = reduced ? [] : [{ perspective: 800 }, { rotateY: v.interpolate({ inputRange: [0, 0.5, 0.5001, 1], outputRange: ['0deg', '90deg', '-90deg', '0deg'] }) }];
      stage = (
        <>
          <Animated.View style={{ transform: flip }}>
            <Animated.View style={{ opacity: old }}><Face look={look} age={m.fromAge} mood="neutral" outfit={m.outfitFrom} /></Animated.View>
            <Animated.View style={[StyleSheet.absoluteFill, { opacity: next }]}><Face look={look} age={m.age} mood="neutral" outfit={m.outfitTo} /></Animated.View>
          </Animated.View>
          <View style={st.ages}>
            <Animated.Text style={[st.ageNum, { opacity: old }]}>{m.fromAge}</Animated.Text>
            <Animated.Text style={[st.ageNum, st.ageNext, { opacity: next }]}>{m.age}</Animated.Text>
          </View>
          <View style={st.pages}>{[0, 1, 2, 3].map((i) => (
            <Animated.View key={i} style={[st.page, !reduced && { transform: [{ perspective: 400 }, { rotateY: v.interpolate({ inputRange: [0, 0.15 + i * 0.15, 0.3 + i * 0.15, 1], outputRange: ['0deg', '0deg', '-180deg', '-180deg'] }) }] }]} />
          ))}</View>
        </>
      );
      break;
    }
    case 'promotion': {
      label = s.moment[m.reason === 'retired' ? 'retired' : m.reason === 'promotion' ? 'promotion' : 'newJob'];
      sub = m.jobTitle ? s.jobTitle[m.jobTitle] ?? m.jobTitle : null;
      const { old, next } = reduced ? fade(0.4, 0.42) : swap(0.42);
      const flash = v.interpolate({ inputRange: [0, 0.36, 0.42, 0.62, 1], outputRange: [0, 0, 0.95, 0, 0] });
      stage = (
        <View>
          <Animated.View style={{ opacity: old }}><Face look={look} age={m.age} mood="neutral" outfit={m.outfitFrom} /></Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: next }]}><Face look={look} age={m.age} mood="happy" outfit={m.outfitTo} /></Animated.View>
          {!reduced && <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, st.flashDisc, { opacity: flash }]} />}
        </View>
      );
      fx = reduced ? <View style={st.badge}><Text style={st.badgeTxt}>✦</Text></View> : <Confetti seed={m.id} />;
      break;
    }
    case 'sad': {
      label = s.moment[m.reason === 'fired' ? 'fired' : 'breakup'];
      bg = 'rgba(10,14,20,0.96)';
      const { old, next } = reduced ? fade(0.4, 0.42) : fade(0.15, 0.6);
      stage = (
        <View>
          <Animated.View style={{ opacity: old }}><Face look={look} age={m.age} mood="sad" outfit={m.outfitFrom} /></Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: next }]}><Face look={look} age={m.age} mood="sad" outfit={m.outfitTo} desaturate={0.75} /></Animated.View>
        </View>
      );
      fx = <Rain seed={m.id} still={reduced} />;
      break;
    }
    case 'legendary': {
      label = s.moment.legendary;
      const spin = reduced ? [] : [
        { rotate: v.interpolate({ inputRange: [0, 0.45, 1], outputRange: ['-360deg', '0deg', '0deg'] }) },
        { scale: v.interpolate({ inputRange: [0, 0.45, 0.55, 1], outputRange: [0.2, 1.08, 1, 1] }) },
      ];
      stage = (
        <View style={st.center}>
          <GoldGlow still={reduced} />
          <Animated.View style={{ transform: spin }}><Face look={look} age={m.age} mood="shock" outfit={m.outfitTo} /></Animated.View>
        </View>
      );
      break;
    }
    case 'wagerWin': {
      label = '';
      stage = (
        <View>
          <Face look={look} age={m.age} mood="smug" outfit={m.outfitTo} />
          <View style={st.coachBadge}><CoachAvatar mood="shock" size={56} /></View>
        </View>
      );
      fx = <View pointerEvents="none" style={[StyleSheet.absoluteFill, st.center]}><WrongStamp /></View>;
      break;
    }
    case 'death': {
      label = s.moment.death;
      bg = colors.death;
      const { old, next } = reduced ? fade(0.4, 0.42) : fade(0.1, 0.75);
      stage = (
        <View>
          <Animated.View style={{ opacity: old }}><Face look={look} age={m.age} mood="neutral" outfit={m.outfitTo} /></Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: next }]}><Face look={look} age={m.age} mood="dead" outfit={m.outfitTo} /></Animated.View>
        </View>
      );
      break;
    }
  }

  const enterStyle = { opacity: enter, transform: [{ scale: enter.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }] };
  return (
    <Pressable style={[StyleSheet.absoluteFill, st.host, { backgroundColor: bg }]} onPress={onSkip} accessibilityRole="button"
      accessibilityLabel={`${label || s.stampWrong}. ${s.moment.skip}`} testID={`moment-${m.kind}`}>
      {fx}
      <Animated.View style={[st.center, enterStyle]}>
        {!!label && <Text style={[st.label, m.kind === 'legendary' && { color: colors.gold }, m.kind === 'death' && { color: colors.ink2 }]}>{upper(locale, label)}</Text>}
        {stage}
        {!!sub && <Text style={st.sub}>{sub}</Text>}
        {m.cat && m.kind !== 'death' && m.kind !== 'wagerWin' && <View style={st.cat}><CatSprite size={44} mood={m.kind === 'promotion' ? 'happy' : 'neutral'} /></View>}
      </Animated.View>
      <Text style={st.skip}>{upper(locale, s.moment.skip)}</Text>
    </Pressable>
  );
}

const st = StyleSheet.create({
  host: { zIndex: 21, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  center: { alignItems: 'center', justifyContent: 'center', gap: 10 },
  disc: { width: FACE, height: FACE, borderRadius: FACE / 2, backgroundColor: colors.paper3, borderWidth: 3, borderColor: colors.line, alignItems: 'center', overflow: 'hidden' },
  label: { fontFamily: fonts.stamp, fontSize: 22, letterSpacing: 3, color: colors.lime, textAlign: 'center', marginBottom: 6 },
  sub: { fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 18, color: colors.ink, textAlign: 'center' },
  ages: { height: 60, width: 160, alignItems: 'center', justifyContent: 'center' },
  ageNum: { fontFamily: fonts.stamp, fontSize: 52, lineHeight: 60, color: colors.ink2, position: 'absolute' },
  ageNext: { color: colors.lime },
  pages: { flexDirection: 'row', gap: 4 },
  page: { width: 14, height: 20, backgroundColor: colors.paper3, borderWidth: 1, borderColor: colors.line },
  flashDisc: { backgroundColor: '#fffbe6', borderRadius: FACE / 2 },
  glow: { position: 'absolute', width: FACE + 40, height: FACE + 40, borderRadius: (FACE + 40) / 2, backgroundColor: 'rgba(255,207,74,0.35)', borderWidth: 4, borderColor: colors.gold },
  coachBadge: { position: 'absolute', right: -18, bottom: -6 },
  stamp: { borderWidth: 5, borderColor: colors.wrong, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 14, backgroundColor: 'rgba(0,0,0,0.3)', marginTop: 150 },
  stampTxt: { fontFamily: fonts.stamp, fontSize: 30, letterSpacing: 2, color: colors.wrong, textAlign: 'center' },
  badge: { position: 'absolute', top: 70, right: 40, width: 46, height: 46, borderRadius: 23, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-10deg' }] },
  badgeTxt: { fontSize: 22, color: colors.noteInk },
  cat: { position: 'absolute', right: -34, bottom: 30 },
  skip: { position: 'absolute', bottom: 28, fontSize: 10, letterSpacing: 1.4, color: colors.ink2 },
});
