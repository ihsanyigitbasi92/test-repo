/**
 * HUD (07 §2.2.1): PlayerAvatar (the client's own face, mood from the last outcome; Pamuk peeks in while the cat
 * is in the engine's assets) · age · life/name; StatBar (4 stats + floats); MetaRow (money · unread · mom
 * pressure · cringe); GameClock + DayProgress (D-066, D-109 "Gün N · Perşembe · Mart · 14:00"); StatusStrip
 * (D-067: job · home · love · cat). Everything shown is read from the engine's LifeState.
 */
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { LifeState, Speed } from '@motto/engine';
import { colors, fonts, nativeDriver } from '../theme';
import { upper, useI18n } from '../i18n';
import type { Strings } from '../i18n';
import { statusStrip } from '../i18n/labels';
import type { FloatItem } from '../state/useGame';
import { Avatar, CatSprite } from '../avatar/Avatar';
import { outfitFor } from '../avatar/look';
import type { Look, Mood } from '../avatar/look';
import { FloatNum } from './FloatNum';
import { HEALTH_DANGER } from './hudConst';
import { useReducedMotion } from './anim';
import { useHintTarget } from './CoachMark';

interface Props { view: LifeState; look: Look; mood: Mood; lifeNo: number; floats: FloatItem[]; progress: number; speed: Speed; unread: number; onUnread: () => void }

const STATS = ['health', 'joy', 'brain', 'charm'] as const;
const pts = (bp: number) => Math.round(bp / 100);

export function dayOfWeek(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/**
 * D-109 (revised after the 2026-11-12 UX playtest #4): "GÜN 412 · 14 MART · PERŞEMBE" — the counter is the engine's
 * calendarDay (days since the 18th birthday), so it jumps by exactly the gap the skip summary names ("21 gün…"),
 * and the date is the engine's dateISO (day + month, weekday derived from it). No year.
 */
export function dateLabel(s: Strings, locale: string, dayNo: number, iso: string): string {
  const month = Number(iso.slice(5, 7)) - 1;
  const day = Number(iso.slice(8, 10));
  const txt = `${s.dayWord} ${dayNo} · ${day} ${s.months[month]} · ${s.weekdays[dayOfWeek(iso)]}`;
  return upper(locale, txt);
}

function clockTime(view: LifeState, progress: number): string {
  const startH = view.phase === 'idle' ? 9 : view.calendar.hour;
  const flowing = view.phase === 'answered' || view.phase === 'idle';
  const mins = Math.min(23 * 60 + 59, Math.floor(startH * 60 + (flowing ? progress * (24 * 60 - startH * 60) : 0)));
  const h = Math.floor(mins / 60), m = mins % 60;
  return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
}

function floatLabel(s: Strings, f: FloatItem): string {
  if (f.stat === 'money') return `${f.delta > 0 ? '+' : '−'}${s.num(f.delta)}`;
  const p = Math.round(f.delta / 100);
  return `${p > 0 ? '+' : '−'}${Math.abs(p)}`;
}

/** Stat bar; `danger` (health below HEALTH_DANGER, UX #6): red and pulsing (static red with reduced motion). */
function Bar({ pct, danger = false }: { pct: number; danger?: boolean }) {
  const w = useRef(new Animated.Value(pct)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  useEffect(() => { Animated.spring(w, { toValue: pct, useNativeDriver: false, friction: 6 }).start(); }, [pct, w]);
  useEffect(() => {
    if (!danger || reduced) { pulse.setValue(1); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 0.35, duration: 520, useNativeDriver: false }),
      Animated.timing(pulse, { toValue: 1, duration: 520, useNativeDriver: false }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [danger, reduced, pulse]);
  return (
    <View style={st.bar} testID={danger ? 'bar-danger' : undefined}>
      <Animated.View style={[st.barFill, danger && st.barDanger, { opacity: pulse, width: w.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
    </View>
  );
}

/** HUD face: 52 dp disc, outfit from the engine job, aging from the engine age; the cat badge follows `assets`. */
export function PlayerAvatar({ view, look, mood, size = 52 }: { view: LifeState; look: Look; mood: Mood; size?: number }) {
  const { s } = useI18n();
  const hasCat = view.status.assets.includes('kedi') && view.npcs.find((n) => n.role === 'cat')?.alive !== false;
  const bump = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    if (mood === 'neutral' || reduced) return;
    bump.setValue(1.12);
    Animated.spring(bump, { toValue: 1, friction: 4, useNativeDriver: nativeDriver }).start();
  }, [mood, bump, reduced]);
  return (
    <View style={{ width: size, height: size }} accessibilityLabel={s.look.a11y(view.name)} testID="player-avatar">
      <Animated.View style={[st.ring, { width: size, height: size, borderRadius: size / 2, transform: [{ scale: bump }] }]}>
        <View style={{ marginTop: size * 0.14 }}>
          <Avatar look={look} age={view.calendar.age} mood={mood} outfit={outfitFor({ job: view.status.job, age: view.calendar.age })} size={size - 4} />
        </View>
      </Animated.View>
      {hasCat && <View style={st.cat} testID="hud-cat"><CatSprite size={22} /></View>}
    </View>
  );
}

export function Hud({ view, look, mood, lifeNo, floats, progress, speed, unread, onUnread }: Props) {
  const { s, locale } = useI18n();
  // UX playtest 2026-11-12 #7: the HUD took ~29% of a 390×844 screen. The life strip (job · home · love · cat ·
  // stuff) and the name now sit in a secondary row that is collapsed by default; tap the face or the ▾ to open it.
  const [open, setOpen] = useState(false);
  const floatsFor = (k: string) => floats.filter((f) => f.stat === k);
  const strip = statusStrip(s, locale, view);
  const mom = pts(view.meters.momPressure);
  const momAlive = view.npcs.find((n) => n.role === 'mom')?.alive !== false;
  const toggle = () => setOpen((x) => !x);
  const statsTarget = useHintTarget('stats');
  const metersTarget = useHintTarget('meters');

  return (
    <View style={st.hud} testID="hud">
      <View style={st.top}>
        <Pressable onPress={toggle} accessibilityRole="button" accessibilityState={{ expanded: open }} accessibilityLabel={s.hudMore} hitSlop={4}>
          <PlayerAvatar view={view} look={look} mood={mood} size={46} />
        </Pressable>
        <View style={st.ageBox}>
          <Text style={st.age} testID="hud-age">{view.calendar.age}</Text>
          <Text style={st.ageLbl}>{upper(locale, s.ageUnit)}</Text>
        </View>
        <View ref={metersTarget} collapsable={false} style={st.meta} testID="hud-meters">
          <View style={[st.chip, view.money.balance < 0 && st.hot]} testID="hud-money">
            <Text style={[st.chipTxt, st.b, view.money.balance < 0 && st.hotTxt]}>{s.money(view.money.balance)}</Text>
            {floatsFor('money').map((f) => <FloatNum key={f.id} label={floatLabel(s, f)} up={f.delta > 0} rise={6} style={st.chipFloat} />)}
          </View>
          <Pressable onPress={onUnread} accessibilityRole="button" accessibilityHint={s.unreadHint} hitSlop={6} style={({ pressed }) => [st.chip, st.chipTap, pressed && st.pressed]} testID="hud-unread">
            <Text style={st.chipTxt}>{s.unread}: <Text style={st.b}>{unread}</Text> ⓘ</Text>
          </Pressable>
          <View style={[st.chip, mom >= 75 && st.hot]} testID="hud-mom">
            <Text style={[st.chipTxt, mom >= 75 && st.hotTxt]}>{s.meter.momPressure} <Text style={[st.b, mom >= 75 && st.hotTxt]}>{momAlive ? mom : '—'}</Text></Text>
            {floatsFor('momPressure').map((f) => <FloatNum key={f.id} label={floatLabel(s, f)} up={f.delta < 0} rise={6} style={st.chipFloat} />)}
          </View>
          <View style={st.chip}>
            <Text style={st.chipTxt}>{s.meter.cringe} <Text style={st.b}>{pts(view.meters.cringe)}</Text></Text>
            {floatsFor('cringe').map((f) => <FloatNum key={f.id} label={floatLabel(s, f)} up={f.delta < 0} rise={6} style={st.chipFloat} />)}
          </View>
        </View>
      </View>

      <View ref={statsTarget} collapsable={false} style={st.stats} testID="hud-stats">
        {STATS.map((k) => {
          const v = pts(view.stats[k]);
          const danger = k === 'health' && v < HEALTH_DANGER;
          return (
            <View key={k} style={st.stat} testID={`stat-${k}`}>
              <View style={st.statHead}>
                <Text style={[st.statLbl, danger && st.hotTxt]} numberOfLines={1}>{s.stat[k]}</Text>
                <Text style={[st.statVal, danger && st.hotTxt]}>{v}</Text>
              </View>
              <Bar pct={v} danger={danger} />
              {floatsFor(k).map((f) => <FloatNum key={f.id} label={floatLabel(s, f)} up={f.delta > 0} />)}
            </View>
          );
        })}
      </View>

      <View style={st.clock} testID="hud-clock">
        <Text style={st.clockDate} numberOfLines={1}>{dateLabel(s, locale, view.calendar.calendarDay, view.calendar.dateISO)}</Text>
        <Text style={st.clockTime}>{clockTime(view, progress)}</Text>
        <View style={st.dp}><View style={[st.dpFill, { width: `${Math.round(progress * 100)}%`, backgroundColor: speed === 'fast' ? colors.gold : colors.lime }]} /></View>
        <Pressable onPress={toggle} accessibilityRole="button" accessibilityState={{ expanded: open }} accessibilityLabel={s.hudMore}
          hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }} style={st.more} testID="hud-toggle">
          <Text style={st.moreTxt}>{open ? '▴' : '▾'}</Text>
        </Pressable>
      </View>

      {open && (
        <View style={st.life} testID="hud-life">
          <Text style={st.lifeWide} numberOfLines={1}>{s.lifeN(lifeNo)} · <Text style={st.lifeB}>{view.name}</Text></Text>
          <Text style={st.lifeCell} numberOfLines={1} testID="hud-job">{s.status.job}: <Text style={st.lifeB}>{strip.job}</Text></Text>
          <Text style={st.lifeCell} numberOfLines={1} testID="hud-home">{s.status.home}: <Text style={st.lifeB}>{strip.home}</Text></Text>
          <Text style={st.lifeCell} numberOfLines={1} testID="hud-love">{s.status.love}: <Text style={st.lifeB}>{strip.love}</Text></Text>
          <Text style={st.lifeCell} numberOfLines={1} testID="hud-cat-name">{s.status.cat}: <Text style={st.lifeB}>{strip.cat}</Text></Text>
          {strip.assets && <Text style={st.lifeWide} numberOfLines={1} testID="hud-assets">{s.status.assets}: <Text style={st.lifeB}>{strip.assets}</Text></Text>}
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  hud: { paddingHorizontal: 14, paddingTop: 2, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: colors.line, gap: 6 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ring: { backgroundColor: colors.paper3, borderWidth: 2, borderColor: colors.line, alignItems: 'center', overflow: 'hidden' },
  cat: { position: 'absolute', right: -8, bottom: -4 },
  ageBox: { alignItems: 'center', minWidth: 34 },
  age: { fontFamily: fonts.stamp, fontSize: 28, lineHeight: 30, color: colors.ink },
  ageLbl: { fontSize: 11, fontWeight: '700', letterSpacing: 1, color: colors.ink2 },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, position: 'relative' },
  statHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 4 },
  statLbl: { flexShrink: 1, fontSize: 12, fontWeight: '700', color: colors.ink2 },
  statVal: { fontSize: 15, fontWeight: '700', color: colors.ink },
  bar: { height: 5, backgroundColor: colors.line, borderRadius: 3, marginTop: 3, overflow: 'hidden' },
  barFill: { height: 5, backgroundColor: colors.lime },
  barDanger: { backgroundColor: colors.wrong },
  meta: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  chip: { borderWidth: 1, borderColor: colors.line, borderRadius: 6, paddingVertical: 3, paddingHorizontal: 6, position: 'relative', justifyContent: 'center' },
  chipTap: { minHeight: 32 },
  chipTxt: { fontSize: 13, color: colors.ink2 },
  // Floats sit above the chip (opaque), never over its label (UX #10).
  chipFloat: { top: -16, right: 0, fontSize: 13, backgroundColor: colors.paper2 },
  b: { color: colors.ink, fontWeight: '700' },
  hot: { borderColor: colors.wrong },
  hotTxt: { color: colors.wrong },
  pressed: { opacity: 0.7 },
  clock: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  clockDate: { fontFamily: fonts.stamp, fontSize: 12, letterSpacing: 0.5, color: colors.ink, flexShrink: 1 },
  clockTime: { fontSize: 12, color: colors.ink2, fontVariant: ['tabular-nums'] },
  dp: { flex: 1, height: 4, backgroundColor: colors.line, borderRadius: 2, overflow: 'hidden', minWidth: 30 },
  dpFill: { height: 4 },
  more: { minWidth: 44, minHeight: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: 6 },
  moreTxt: { fontSize: 14, color: colors.ink, fontWeight: '700' },
  life: { flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: 1, borderStyle: 'dashed', borderTopColor: colors.line, paddingTop: 6, rowGap: 3 },
  lifeCell: { width: '50%', fontSize: 12.5, color: colors.ink2, paddingRight: 6 },
  lifeWide: { width: '100%', fontSize: 12.5, color: colors.ink2, paddingRight: 6 },
  lifeB: { color: colors.ink, fontWeight: '600' },
});
