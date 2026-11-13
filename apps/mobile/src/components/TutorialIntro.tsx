/**
 * "Nasıl oynanır / How it works" (docs/design/18 §3): five skippable pages after the splash and the age gate,
 * before the first Client File; replayable from Settings. Each page = one small illustration built from the real
 * UI pieces (speed control, day card, stat bars, report card, stamps) + a title + at most three short lines.
 * Skip on every page, Back / Next, page dots, horizontal swipe; every target ≥ 44 pt. The game clock is held while
 * this is on screen (LifeScreen → game.hold).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '@motto/engine';
import { Animated, Easing, PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, nativeDriver } from '../theme';
import { mottoLine, upper, useI18n } from '../i18n';
import { INTRO_PAGES } from '../state/tutorial';
import { CoachAvatar } from './CoachAvatar';
import { PrimaryButton } from './ActionZone';
import { dateLabel } from './Hud';
import { useReducedMotion } from './anim';

const PAGES = ['what', 'time', 'cards', 'stats', 'life'] as const;
type PageKey = (typeof PAGES)[number];
if (PAGES.length !== INTRO_PAGES) throw new Error('TutorialIntro: page count out of sync with INTRO_PAGES');

/** A looping 0 → 1 driver for the small demo animations (static at 0.6 with reduced motion). */
function useLoop(ms: number, reduced: boolean, kind: 'ramp' | 'swing' = 'ramp') {
  const v = useRef(new Animated.Value(reduced ? 0.6 : 0)).current;
  useEffect(() => {
    if (reduced) { v.setValue(0.6); return; }
    const anim = kind === 'ramp'
      ? Animated.loop(Animated.sequence([Animated.timing(v, { toValue: 1, duration: ms, easing: Easing.linear, useNativeDriver: false }), Animated.delay(400), Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: false })]))
      : Animated.loop(Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: ms / 2, easing: Easing.inOut(Easing.quad), useNativeDriver: nativeDriver }),
        Animated.timing(v, { toValue: 0, duration: ms / 2, easing: Easing.inOut(Easing.quad), useNativeDriver: nativeDriver }),
      ]));
    anim.start();
    return () => anim.stop();
  }, [v, ms, reduced, kind]);
  return v;
}

function Stamp({ text, color, tilt = '-8deg' }: { text: string; color: string; tilt?: string }) {
  return <View style={[st.stamp, { borderColor: color, transform: [{ rotate: tilt }] }]}><Text style={[st.stampTxt, { color }]}>{text}</Text></View>;
}

function IlloWhat() {
  const { s, locale } = useI18n();
  const [name] = s.names[0] ?? ['', ''];
  return (
    <View style={st.row}>
      <CoachAvatar mood="smirk" size={76} />
      <View style={[st.paper, st.flex1]}>
        <Text style={st.paperHead}>{s.fileTitle}</Text>
        <Text style={st.paperRow}><Text style={st.k}>{upper(locale, s.fileName)}  </Text>{name}</Text>
        <Text style={st.paperRow}><Text style={st.k}>{upper(locale, s.fileAge)}  </Text>18</Text>
        <View style={st.stampCorner}><Stamp text={s.cta.newClient} color={colors.lime} /></View>
      </View>
    </View>
  );
}

function IlloTime({ reduced }: { reduced: boolean }) {
  const { s, locale } = useI18n();
  const p = useLoop(2400, reduced);
  return (
    <View style={st.gap10}>
      <View style={st.clockRow}>
        <Text style={st.clockDate} numberOfLines={1}>{dateLabel(s, locale, 1, '2026-03-03')}</Text>
        <View style={st.dp}><Animated.View style={[st.dpFill, { width: p.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} /></View>
      </View>
      <View style={st.speedRow}>
        {(['pause', 'play', 'fast'] as const).map((k) => (
          <View key={k} style={st.speedCol}>
            <View style={[st.speedBtn, k === 'play' && st.speedOn]}><Text style={[st.speedTxt, k === 'play' && st.speedTxtOn]}>{k === 'pause' ? 'II' : k === 'play' ? '▶' : '▶▶'}</Text></View>
            <Text style={st.caption}>{s.speedA11y[k]}</Text>
          </View>
        ))}
      </View>
      <View style={st.ghostPill}><Text style={st.ghostPillTxt}>II → {upper(locale, s.cta.nextDay)}</Text></View>
    </View>
  );
}

function IlloCards({ reduced }: { reduced: boolean }) {
  const { s, locale } = useI18n();
  const d = s.tutorial.demo;
  const sw = useLoop(2200, reduced, 'swing');
  const x = reduced ? 0 : sw.interpolate({ inputRange: [0, 1], outputRange: [-14, 14] });
  return (
    <View style={st.gap8}>
      <View style={st.card}>
        <Text style={st.cardLbl}>{s.label.event} · {upper(locale, s.speaker.mom ?? '')}</Text>
        <Text style={st.cardBody}>{d.narration}</Text>
        <View style={st.slip}><Text style={st.slipTxt}>{d.slip}</Text><Text style={st.slipOdds}>{s.odds(40)}</Text></View>
      </View>
      <Animated.View style={[st.gap6, { transform: [{ translateX: x }] }]}>
        <View style={st.choice}><Text style={st.choiceTxt}>← {d.left}</Text></View>
        <View style={st.choice}><Text style={st.choiceTxt}>{d.right} →</Text></View>
      </Animated.View>
      <Text style={st.swipeHint}>‹  {d.swipe}  ›</Text>
    </View>
  );
}

function IlloStats() {
  const { s } = useI18n();
  const vals = { health: 70, joy: 55, brain: 60, charm: 50 } as const;
  return (
    <View style={st.gap10}>
      <View style={st.chipRow}>
        <View style={st.chip}><Text style={[st.chipTxt, st.b]}>{s.money(1200)}</Text></View>
        <View style={st.chip}><Text style={st.chipTxt}>{s.unread}: <Text style={st.b}>9</Text> ⓘ</Text></View>
        <View style={st.chip}><Text style={st.chipTxt}>{s.meter.momPressure} <Text style={st.b}>40</Text></Text></View>
        <View style={st.chip}><Text style={st.chipTxt}>{s.meter.cringe} <Text style={st.b}>12</Text></Text></View>
      </View>
      <View style={st.statRow}>
        {(Object.keys(vals) as (keyof typeof vals)[]).map((k) => (
          <View key={k} style={st.flex1}>
            <View style={st.statHead}><Text style={st.statLbl} numberOfLines={1}>{s.stat[k]}</Text><Text style={st.statVal}>{vals[k]}</Text></View>
            <View style={st.bar}><View style={[st.barFill, { width: `${vals[k]}%` }]} /></View>
          </View>
        ))}
      </View>
    </View>
  );
}

function IlloLife() {
  const { s, locale } = useI18n();
  const g = [['health', 3], ['money', 1], ['relationships', 2], ['brain', 3]] as const;
  return (
    <View style={st.gap8}>
      <View style={st.karne}>
        <Text style={st.karneHead}>{s.reportTitle} · 18→19</Text>
        <View style={st.grades}>
          {g.map(([k, v]) => (
            <View key={k} style={st.grade}><Text style={st.gName}>{s.gradeNames[k]}</Text><Text style={[st.gVal, { color: v >= 3 ? colors.called : v <= 1 ? colors.wrong : colors.ink }]}>{upper(locale, s.grades[v] ?? '')}</Text></View>
          ))}
        </View>
        <View style={st.mottoStrip}><Text style={st.mottoLbl}>{s.mottoLbl}</Text><Text style={st.mottoTxt}>“{mottoLine(s, 'none', 0)}”</Text></View>
        <View style={st.filed}><Stamp text={s.stampFiled} color={colors.ink} tilt="-6deg" /></View>
      </View>
      <View style={st.endRow}>
        <Stamp text={s.closed} color={colors.wrong} />
        <Text style={st.arrow}>→</Text>
        <View style={st.newClient}><Text style={st.newClientTxt}>{s.cta.newClient}</Text></View>
      </View>
    </View>
  );
}

export function TutorialIntro({ replay, onClose, onLocale }: { replay: boolean; onClose: (how: 'done' | 'skip', page: number) => void; onLocale?: (l: Locale) => void }) {
  const { s, locale } = useI18n();
  const t = s.tutorial;
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  const fade = useRef(new Animated.Value(1)).current;
  const last = i === PAGES.length - 1;
  const key: PageKey = PAGES[i]!;
  const go = (n: number) => {
    if (n < 0 || n >= PAGES.length || n === i) return;
    setI(n);
    if (!reduced) { fade.setValue(0.2); Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: nativeDriver }).start(); }
  };
  const goRef = useRef(go);
  goRef.current = go;
  const idx = useRef(i);
  idx.current = i;
  const pan = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dx) > 18 && Math.abs(g.dx) > Math.abs(g.dy) * 2,
    onPanResponderRelease: (_e, g) => { if (g.dx < -60) goRef.current(idx.current + 1); else if (g.dx > 60) goRef.current(idx.current - 1); },
  }), []);
  const page = t.pages[key];
  const lines: string[] = 'lines' in page ? page.lines : [];

  return (
    <View style={[StyleSheet.absoluteFill, st.root]} testID="tutorial" accessibilityViewIsModal aria-modal>
      <View style={st.top}>
        <Text style={st.topLbl} testID="tutorial-step">{upper(locale, t.label)} · {i + 1}/{PAGES.length}</Text>
        {onLocale && (['tr', 'en'] as Locale[]).map((l) => (
          <Pressable key={l} onPress={() => onLocale(l)} accessibilityRole="button" accessibilityState={{ selected: locale === l }} accessibilityLabel={l === 'tr' ? 'Türkçe' : 'English'}
            testID={`tutorial-lang-${l}`} style={[st.lang, locale === l && st.langOn]}>
            <Text style={[st.langTxt, locale === l && st.langTxtOn]}>{l.toUpperCase()}</Text>
          </Pressable>
        ))}
        <Pressable onPress={() => onClose('skip', i)} accessibilityRole="button" accessibilityLabel={t.skip} testID="tutorial-skip" hitSlop={6}
          style={({ pressed }) => [st.skip, pressed && st.pressed]}>
          <Text style={st.skipTxt}>{t.skip} ›</Text>
        </Pressable>
      </View>
      <ScrollView style={st.flex1} contentContainerStyle={st.body} {...pan.panHandlers}>
        <Animated.View style={[st.gap14, { opacity: fade }]} testID={`tutorial-page-${key}`}>
          <View style={st.illo} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            {key === 'what' && <IlloWhat />}
            {key === 'time' && <IlloTime reduced={reduced} />}
            {key === 'cards' && <IlloCards reduced={reduced} />}
            {key === 'stats' && <IlloStats />}
            {key === 'life' && <IlloLife />}
          </View>
          <Text style={st.title} accessibilityRole="header">{page.title}</Text>
          {lines.map((l, k) => <Text key={k} style={st.line}>{l}</Text>)}
          {key === 'stats' && (
            <View style={st.gap6}>
              {(['health', 'joy', 'brain', 'charm'] as const).map((k) => (
                <Text key={k} style={st.line}><Text style={st.legendK}>{s.stat[k]}: </Text>{t.pages.stats.legend[k]}</Text>
              ))}
              <Text style={st.line}>{t.pages.stats.meters}</Text>
            </View>
          )}
          {key === 'cards' && <Text style={st.foot}>{t.pages.cards.foot}</Text>}
        </Animated.View>
      </ScrollView>
      <View style={st.bottom}>
        <View style={st.dots} accessibilityRole="progressbar" accessibilityLabel={t.pageA11y(i + 1, PAGES.length)}
          accessibilityValue={{ min: 1, max: PAGES.length, now: i + 1 }} testID="tutorial-dots">
          {PAGES.map((p, k) => (
            <Pressable key={p} onPress={() => go(k)} accessibilityRole="button" accessibilityLabel={t.pageA11y(k + 1, PAGES.length)} style={st.dotHit} testID={`tutorial-dot-${k}`}>
              <View style={[st.dot, k === i && st.dotOn]} />
            </Pressable>
          ))}
        </View>
        <View style={st.btnRow}>
          {i > 0 && (
            <Pressable onPress={() => go(i - 1)} accessibilityRole="button" accessibilityLabel={t.back} testID="tutorial-back" style={({ pressed }) => [st.backBtn, pressed && st.pressed]}>
              <Text style={st.backTxt}>‹ {t.back}</Text>
            </Pressable>
          )}
          <View style={st.flex1}>
            {last
              ? <PrimaryButton label={replay ? t.backToGame : t.start} onPress={() => onClose('done', i)} testID="tutorial-start" />
              : <PrimaryButton label={t.next} onPress={() => go(i + 1)} testID="tutorial-next" />}
          </View>
        </View>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  root: { backgroundColor: colors.paper, zIndex: 60 },
  flex1: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  gap6: { gap: 6 },
  gap8: { gap: 8 },
  gap10: { gap: 10 },
  gap14: { gap: 14 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingTop: 8, minHeight: 52 },
  topLbl: { fontFamily: fonts.stamp, fontSize: 12, letterSpacing: 1.6, color: colors.lime, flex: 1 },
  lang: { borderWidth: 1, borderColor: colors.line, borderRadius: 999, minHeight: 44, minWidth: 44, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' },
  langOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  langTxt: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  langTxtOn: { color: colors.limeInk },
  skip: { minHeight: 44, minWidth: 64, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 1, borderColor: colors.line },
  skipTxt: { fontSize: 14, fontWeight: '600', color: colors.ink2 },
  body: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 16, flexGrow: 1 },
  illo: { minHeight: 196, justifyContent: 'center', backgroundColor: colors.paper2, borderRadius: 12, borderWidth: 1, borderColor: colors.line, padding: 14 },
  title: { fontFamily: fonts.stamp, fontSize: 22, lineHeight: 28, color: colors.ink, letterSpacing: 0.4 },
  line: { fontSize: 16, lineHeight: 23, color: colors.ink, fontFamily: fonts.body },
  legendK: { fontWeight: '700', color: colors.lime },
  foot: { fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 15, lineHeight: 21, color: colors.ink2 },
  bottom: { paddingHorizontal: 16, paddingBottom: 14, paddingTop: 6, gap: 6, borderTopWidth: 1, borderTopColor: colors.line },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  dotHit: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.line },
  dotOn: { width: 22, backgroundColor: colors.lime },
  btnRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  backBtn: { minHeight: 58, minWidth: 96, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 15, fontWeight: '600', color: colors.ink2 },
  pressed: { transform: [{ scale: 0.98 }] },
  // ── illustrations (paper / stamp style, same tokens as the real HUD and feed) ──
  stamp: { borderWidth: 3, borderRadius: 4, paddingVertical: 2, paddingHorizontal: 8, alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.25)' },
  stampTxt: { fontFamily: fonts.stamp, fontSize: 14, letterSpacing: 1 },
  paper: { backgroundColor: colors.paper3, borderRadius: 6, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line, padding: 12, gap: 6, minHeight: 110 },
  paperHead: { fontFamily: fonts.stamp, fontSize: 12, letterSpacing: 1.2, color: colors.ink2 },
  paperRow: { fontSize: 15, color: colors.ink, fontWeight: '600' },
  k: { fontSize: 11, fontWeight: '700', letterSpacing: 1, color: colors.ink2 },
  stampCorner: { position: 'absolute', right: -6, bottom: -10 },
  clockRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  clockDate: { fontFamily: fonts.stamp, fontSize: 12, letterSpacing: 0.5, color: colors.ink, flexShrink: 1 },
  dp: { flex: 1, minWidth: 40, height: 5, backgroundColor: colors.line, borderRadius: 3, overflow: 'hidden' },
  dpFill: { height: 5, backgroundColor: colors.lime },
  speedRow: { flexDirection: 'row', justifyContent: 'center', gap: 14 },
  speedCol: { alignItems: 'center', gap: 4 },
  speedBtn: { borderWidth: 1, borderColor: colors.line, borderRadius: 6, minWidth: 52, height: 44, alignItems: 'center', justifyContent: 'center' },
  speedOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  speedTxt: { color: colors.ink2, fontSize: 15, fontWeight: '700' },
  speedTxtOn: { color: colors.paper },
  caption: { fontSize: 12, color: colors.ink2 },
  ghostPill: { alignSelf: 'center', borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.line, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
  ghostPillTxt: { fontSize: 12, fontWeight: '700', letterSpacing: 1, color: colors.ink2 },
  card: { backgroundColor: colors.paper3, borderWidth: 1, borderColor: colors.line, borderRadius: 6, padding: 10, gap: 6 },
  cardLbl: { fontSize: 10, fontWeight: '700', letterSpacing: 1.4, color: colors.ink },
  cardBody: { fontSize: 14, lineHeight: 19, color: colors.ink },
  slip: { backgroundColor: colors.note, paddingVertical: 5, paddingHorizontal: 8, transform: [{ rotate: '-1.5deg' }] },
  slipTxt: { fontSize: 12, fontWeight: '700', color: colors.noteInk },
  slipOdds: { fontSize: 11, color: colors.noteInk },
  choice: { minHeight: 36, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.paper2, borderRadius: 8, paddingHorizontal: 12, justifyContent: 'center' },
  choiceTxt: { fontSize: 14, fontWeight: '600', color: colors.ink },
  swipeHint: { alignSelf: 'center', fontSize: 12, fontWeight: '700', letterSpacing: 1.2, color: colors.lime },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  chip: { borderWidth: 1, borderColor: colors.line, borderRadius: 6, paddingVertical: 3, paddingHorizontal: 6 },
  chipTxt: { fontSize: 13, color: colors.ink2 },
  b: { color: colors.ink, fontWeight: '700' },
  statRow: { flexDirection: 'row', gap: 8 },
  statHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 4 },
  statLbl: { flexShrink: 1, fontSize: 12, fontWeight: '700', color: colors.ink2 },
  statVal: { fontSize: 15, fontWeight: '700', color: colors.ink },
  bar: { height: 5, backgroundColor: colors.line, borderRadius: 3, marginTop: 3, overflow: 'hidden' },
  barFill: { height: 5, backgroundColor: colors.lime },
  karne: { borderWidth: 2, borderColor: colors.ink, backgroundColor: colors.paper3, overflow: 'hidden' },
  karneHead: { fontFamily: fonts.stamp, letterSpacing: 1.4, fontSize: 13, color: colors.ink, paddingVertical: 6, paddingHorizontal: 10, borderBottomWidth: 2, borderBottomColor: colors.ink },
  grades: { flexDirection: 'row', flexWrap: 'wrap' },
  grade: { width: '50%', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  gName: { fontSize: 12, color: colors.ink },
  gVal: { fontFamily: fonts.stamp, fontSize: 11, letterSpacing: 0.6 },
  mottoStrip: { backgroundColor: colors.lime, paddingVertical: 6, paddingHorizontal: 10 },
  mottoLbl: { fontSize: 9, fontWeight: '700', letterSpacing: 1.4, color: colors.limeInk },
  mottoTxt: { fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 16, color: colors.limeInk },
  filed: { position: 'absolute', right: 8, top: 4 },
  endRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  arrow: { fontSize: 20, color: colors.ink2 },
  newClient: { backgroundColor: colors.lime, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
  newClientTxt: { fontFamily: fonts.stamp, fontSize: 13, letterSpacing: 1.2, color: colors.limeInk },
});
