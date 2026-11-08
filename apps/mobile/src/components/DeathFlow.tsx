/**
 * Death → Roast Report → New Client (07 §2.2.7, ≤ 40 s): ECG (unskippable 2 s) → gravestone (name, years,
 * epitaph = last Motto of the Year; no cause) → dry cause line → counted numbers → lifetime patterns →
 * the moment you were right (I WAS WRONG re-stamped) → coach's last word → [NEW CLIENT].
 * Every number is the engine's `buildRoast(state)`; nothing is invented. Tap anywhere to advance.
 */
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import type { ScrollViewInstance } from 'react-native';
import { colors, fonts, nativeDriver } from '../theme';
import { upper, useI18n } from '../i18n';
import type { DeathView } from '../state/useGame';
import { useCountUp, useSlam } from './anim';
import { PrimaryButton } from './ActionZone';

const ECG_W = 300, ECG_H = 90;
const ECG_PTS: [number, number][] = [[0, 45], [50, 45], [60, 18], [70, 74], [80, 45], [120, 45], [130, 18], [140, 74], [150, 45], [190, 45], [200, 18], [210, 74], [220, 45], [300, 45]];
const STEP_MS = [2000, 1600, 2200, 2600, 2600, 2400, 2400];
const LAST = STEP_MS.length;

function Ecg() {
  const w = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(w, { toValue: ECG_W, duration: 1900, easing: Easing.linear, useNativeDriver: false }).start(); }, [w]);
  return (
    <Animated.View style={{ width: w, height: ECG_H, overflow: 'hidden', alignSelf: 'flex-start' }}>
      <View style={{ width: ECG_W, height: ECG_H }}>
        {ECG_PTS.slice(1).map(([x2, y2], i) => {
          const [x1, y1] = ECG_PTS[i]!;
          const len = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1);
          return <View key={i} style={{ position: 'absolute', left: (x1 + x2) / 2 - len / 2, top: (y1 + y2) / 2 - 1.5, width: len, height: 3,
            backgroundColor: colors.called, borderRadius: 2, transform: [{ rotate: `${ang}rad` }] }} />;
        })}
      </View>
    </Animated.View>
  );
}

function Grave({ d }: { d: DeathView }) {
  const { s } = useI18n();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(v, { toValue: 1, duration: 1000, easing: Easing.out(Easing.back(1.4)), useNativeDriver: nativeDriver }).start(); }, [v]);
  return (
    <Animated.View style={[st.grave, { opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [120, 0] }) }] }]} testID="grave">
      <Text style={st.graveName}>{d.name}</Text>
      <Text style={st.graveYears}>{d.birthYear}–{d.deathYear}</Text>
      <Text style={st.graveEp}>“{d.epitaph ?? s.epitaphDefault}”</Text>
    </Animated.View>
  );
}

function Num({ value, label, run }: { value: number; label: string; run: boolean }) {
  const v = useCountUp(value, run);
  return <View style={st.num}><Text style={st.numVal}>{v}</Text><Text style={st.numLbl}>{label}</Text></View>;
}

function WrongStamp() {
  const { s } = useI18n();
  const anim = useSlam(true, '-8deg', 3);
  return <Animated.View style={[st.wStamp, anim]}><Text style={st.wStampTxt}>{s.stampWrong}</Text></Animated.View>;
}

const GRADE_ORDER = ['health', 'money', 'relationships', 'brain', 'courage', 'spectacle'] as const;

/** Share card (mock `.share`, 1:1): last report card grades, motto, name · age. Rendered on device; the system share sheet gets the text. */
function ShareCard({ d }: { d: DeathView }) {
  const { s, locale } = useI18n();
  const age = d.roast.ageAtDeath;
  const motto = d.epitaph ?? s.epitaphDefault;
  const msg = `${d.name} · ${age} — “${motto}” · MOTTO`;
  const onShare = () => { Share.share({ message: msg }).catch(() => undefined); };
  return (
    <View style={st.shareWrap} testID="share-card">
      <View style={st.share}>
        <View>
          <Text style={st.shareK}>{upper(locale, s.reportTitle)} · {d.report ? d.report.age : age}</Text>
          {d.report && (
            <View style={st.shareG}>
              {GRADE_ORDER.map((k) => (
                <View key={k} style={st.shareCell}>
                  <Text style={st.shareCellLbl}>{s.gradeNames[k]}</Text>
                  <Text style={st.shareCellVal}>{upper(locale, s.grades[d.report!.grades[k]] ?? '')}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <Text style={st.shareQ}>“{motto}”</Text>
        <View style={st.shareF}><Text style={st.shareFTxt}>{d.name} · {age}</Text><Text style={st.shareFTxt}>MOTTO · {d.birthYear}–{d.deathYear}</Text></View>
      </View>
      <Pressable onPress={onShare} accessibilityRole="button" testID="share" style={({ pressed }) => [st.shareBtn, pressed && { opacity: 0.7 }]}>
        <Text style={st.shareBtnTxt}>↗ {s.cta.share}</Text>
      </Pressable>
    </View>
  );
}

export function DeathFlow({ death, onNewClient }: { death: DeathView; onNewClient: () => void }) {
  const { s, locale } = useI18n();
  const [step, setStep] = useState(0);
  const scroll = useRef<ScrollViewInstance>(null);
  const r = death.roast;
  useEffect(() => {
    if (step >= LAST) return;
    const t = setTimeout(() => setStep((x) => x + 1), STEP_MS[step]);
    return () => clearTimeout(t);
  }, [step]);
  const advance = () => { if (step > 0 && step < LAST) setStep(step + 1); };
  const cls = r.cause.lineKey.split('.').pop() ?? 'unknown';
  const maxCount = Math.max(1, ...r.patterns.map((p) => p.count));

  return (
    <View style={[StyleSheet.absoluteFill, st.death]} testID="death">
      <Pressable style={{ flex: 1 }} onPress={advance} accessibilityLabel={s.tapToSkip}>
        <ScrollView ref={scroll} contentContainerStyle={st.content} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}>
          {step === 0 && <View style={st.ecgBox}><Ecg /></View>}
          {step >= 1 && <Grave d={death} />}
          {step >= 2 && (
            <View style={st.sheet} testID="roast-report">
              <Text style={st.title}>{s.roastTitle}</Text>
              <Text style={st.sub}>{upper(locale, s.roastAge(r.ageAtDeath))}</Text>
              <Text style={st.big}>{s.deathCause[cls] ?? s.deathCause.unknown}</Text>
              {step >= 3 && (
                <>
                  <View style={st.nums}>
                    <Num value={r.numbers.yearsWorked} label={s.nums.yearsWorked} run />
                    <Num value={r.numbers.wagersPlayerWon} label={s.nums.wagersPlayerWon} run />
                    <Num value={r.numbers.shownDays} label={s.nums.shownDays} run />
                  </View>
                  <Text style={st.small}>{s.peak(r.numbers.peakMoney, r.numbers.rentEvents, r.numbers.momCalls)}</Text>
                </>
              )}
              {step >= 4 && r.patterns.length > 0 && (
                <View style={st.block}>
                  <Text style={st.lbl}>{upper(locale, s.patTitle)}</Text>
                  {r.patterns.map((p) => (
                    <View key={p.id} style={st.pat}>
                      <View style={st.patRow}><Text style={st.patName}>{s.pattern[p.id]}</Text><Text style={st.patCount}>{p.count} {s.times}</Text></View>
                      <View style={[st.patBar, { width: `${Math.round((p.count / maxCount) * 100)}%` }]} />
                    </View>
                  ))}
                </View>
              )}
              {step >= 5 && (
                <View style={st.block}>
                  <View style={st.momentHead}>
                    <Text style={[st.lbl, { flexShrink: 1 }]}>{upper(locale, s.rightMoment)}</Text>
                    {r.rightMoment && <WrongStamp />}
                  </View>
                  <Text style={st.momentTxt} testID="right-moment">
                    {r.rightMoment ? s.rightMomentLine(r.rightMoment.dayIndex, Math.round(r.rightMoment.pOddsBp / 100)) : s.noRightMoment}
                  </Text>
                </View>
              )}
              {step >= 6 && (
                <View style={st.unlock}>
                  <Text style={st.unlockLbl}>{upper(locale, s.lastWord)}</Text>
                  <Text style={st.unlockTxt}>{r.lastWord ? s.lastWordLine(r.lastWord.count, s.pattern[r.lastWord.pattern] ?? r.lastWord.pattern) : s.noLastWord}</Text>
                  {death.autoDays > 0 && <Text style={st.small}>{s.autoNote(death.autoDays)}</Text>}
                </View>
              )}
              {step >= LAST && (
                <View style={st.block}>
                  <ShareCard d={death} />
                  <Text style={st.closed}>{s.closed}</Text>
                  <PrimaryButton label={s.cta.newClient} onPress={onNewClient} pulse testID="new-client" />
                </View>
              )}
            </View>
          )}
          {step > 0 && step < LAST && <Text style={st.tap}>{upper(locale, s.tapToSkip)}</Text>}
        </ScrollView>
      </Pressable>
    </View>
  );
}

const st = StyleSheet.create({
  death: { backgroundColor: colors.death, zIndex: 22 },
  content: { padding: 20, gap: 18, alignItems: 'center', flexGrow: 1, justifyContent: 'center' },
  ecgBox: { width: ECG_W, height: ECG_H },
  grave: { width: 160, minHeight: 170, backgroundColor: colors.grave, borderTopLeftRadius: 75, borderTopRightRadius: 75, borderBottomLeftRadius: 6, borderBottomRightRadius: 6,
    borderWidth: 3, borderColor: colors.graveEdge, alignItems: 'center', justifyContent: 'center', padding: 14, gap: 4 },
  graveName: { fontFamily: fonts.stamp, fontSize: 13, letterSpacing: 0.6, color: '#e8e6dc', textAlign: 'center' },
  graveYears: { fontSize: 11, color: '#b9bdb4', fontVariant: ['tabular-nums'] },
  graveEp: { fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 12, color: '#d7dbd0', textAlign: 'center', marginTop: 6 },
  sheet: { width: '100%', maxWidth: 380, backgroundColor: colors.paper, borderRadius: 12, borderWidth: 1, borderColor: colors.line, padding: 16, gap: 12 },
  title: { fontFamily: fonts.stamp, letterSpacing: 1.4, fontSize: 14, color: colors.lime },
  sub: { fontSize: 11, letterSpacing: 1.2, color: colors.ink2, fontWeight: '700' },
  big: { fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 20, lineHeight: 26, color: colors.ink },
  nums: { flexDirection: 'row', gap: 8 },
  num: { flex: 1, borderWidth: 1, borderColor: colors.line, paddingVertical: 8, paddingHorizontal: 4, alignItems: 'center' },
  numVal: { fontFamily: fonts.stamp, fontSize: 22, color: colors.lime },
  numLbl: { fontSize: 10.5, color: colors.ink2, textAlign: 'center' },
  small: { fontSize: 12, color: colors.ink2 },
  block: { gap: 6 },
  lbl: { fontSize: 10, letterSpacing: 1.4, fontWeight: '700', color: colors.ink2 },
  pat: { borderBottomWidth: 1, borderStyle: 'dashed', borderBottomColor: colors.line, paddingVertical: 6, gap: 4 },
  patRow: { flexDirection: 'row', justifyContent: 'space-between' },
  patName: { fontSize: 14, color: colors.ink },
  patCount: { fontFamily: fonts.stamp, fontSize: 13, color: colors.wrong },
  patBar: { height: 4, backgroundColor: colors.wrong, borderRadius: 2 },
  momentHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, minHeight: 34 },
  momentTxt: { fontSize: 14, lineHeight: 20, color: colors.ink },
  wStamp: { borderWidth: 3, borderColor: colors.wrong, borderRadius: 4, paddingVertical: 3, paddingHorizontal: 8 },
  wStampTxt: { fontFamily: fonts.stamp, fontSize: 14, letterSpacing: 1, color: colors.wrong },
  unlock: { backgroundColor: colors.paper3, padding: 10, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: colors.gold, gap: 4 },
  unlockLbl: { fontSize: 10, letterSpacing: 1.4, fontWeight: '700', color: colors.gold },
  unlockTxt: { fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 16, lineHeight: 21, color: colors.ink },
  closed: { alignSelf: 'center', fontFamily: fonts.stamp, fontSize: 18, letterSpacing: 2, color: colors.ink2, borderWidth: 3, borderColor: colors.ink2, borderRadius: 4,
    paddingVertical: 2, paddingHorizontal: 10, transform: [{ rotate: '-4deg' }], marginBottom: 6 },
  shareWrap: { gap: 8, marginBottom: 8 },
  share: { aspectRatio: 1, width: '100%', backgroundColor: colors.ink, borderRadius: 8, padding: 16, justifyContent: 'space-between' },
  shareK: { fontFamily: fonts.stamp, letterSpacing: 1.6, fontSize: 12, color: colors.limeInk },
  shareG: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, rowGap: 6 },
  shareCell: { width: '33.33%' },
  shareCellLbl: { fontSize: 11, color: colors.paper3 },
  shareCellVal: { fontFamily: fonts.stamp, fontSize: 13, color: colors.paper },
  shareQ: { fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 20, lineHeight: 25, color: colors.paper },
  shareF: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  shareFTxt: { fontSize: 10, letterSpacing: 1.2, color: colors.paper3, fontWeight: '700' },
  shareBtn: { alignSelf: 'flex-start', borderWidth: 1.5, borderColor: colors.line, borderStyle: 'dashed', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 },
  shareBtnTxt: { fontSize: 13, fontWeight: '600', color: colors.ink },
  tap: { fontSize: 10, letterSpacing: 1.4, color: colors.ink2 },
});
