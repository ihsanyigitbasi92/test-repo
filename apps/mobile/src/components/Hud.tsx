/**
 * HUD (07 §2.2.1): PlayerAvatar (the client's own face, mood from the last outcome; Pamuk peeks in while the cat
 * is in the engine's assets) · age · life/name; StatBar (4 stats + floats); MetaRow (money · unread · mom
 * pressure · cringe); GameClock + DayProgress (D-066, D-109 "Gün N · Perşembe · Mart · 14:00"); StatusStrip
 * (D-067: job · home · love · cat). Everything shown is read from the engine's LifeState.
 */
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import type { LifeState, Speed } from '@motto/engine';
import { colors, fonts, nativeDriver } from '../theme';
import { upper, useI18n } from '../i18n';
import type { Strings } from '../i18n';
import type { FloatItem } from '../state/useGame';
import { Avatar, CatSprite } from '../avatar/Avatar';
import { outfitFor } from '../avatar/look';
import type { Look, Mood } from '../avatar/look';
import { FloatNum } from './FloatNum';
import { useReducedMotion } from './anim';

interface Props { view: LifeState; look: Look; mood: Mood; lifeNo: number; floats: FloatItem[]; progress: number; speed: Speed; unread: number }

const STATS = ['health', 'joy', 'brain', 'charm'] as const;
const pts = (bp: number) => Math.round(bp / 100);

export function dayOfWeek(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** D-109: "GÜN 412 · PERŞEMBE · MART" — no day-of-month, no year. */
export function dateLabel(s: Strings, locale: string, dayIndex: number, iso: string): string {
  const month = Number(iso.slice(5, 7)) - 1;
  const txt = `${s.dayWord} ${dayIndex} · ${s.weekdays[dayOfWeek(iso)]} · ${s.months[month]}`;
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

function Bar({ pct }: { pct: number }) {
  const w = useRef(new Animated.Value(pct)).current;
  useEffect(() => { Animated.spring(w, { toValue: pct, useNativeDriver: false, friction: 6 }).start(); }, [pct, w]);
  return (
    <View style={st.bar}>
      <Animated.View style={[st.barFill, { width: w.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
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

export function Hud({ view, look, mood, lifeNo, floats, progress, speed, unread }: Props) {
  const { s, locale } = useI18n();
  const floatsFor = (k: string) => floats.filter((f) => f.stat === k);
  const job = view.status.job;
  const home = view.status.home;
  const homeTxt = home.kind === 'momsHouse' ? s.home.momsHouse : home.kind === 'owned' ? s.home.owned : s.home[home.kind](home.rent);
  const partner = view.status.partner;
  const loveTxt = partner ? s.partner(Math.floor((view.calendar.calendarDay - partner.since) / 365)) : s.single;
  const extras = view.status.assets.filter((a) => a !== 'kedi').map((a) => s.asset[a] ?? a);
  const catTxt = [view.status.assets.includes('kedi') ? s.catName : s.none, ...extras].join(' · ');
  const mom = pts(view.meters.momPressure);
  const momAlive = view.npcs.find((n) => n.role === 'mom')?.alive !== false;

  return (
    <View style={st.hud} testID="hud">
      <View style={st.top}>
        <PlayerAvatar view={view} look={look} mood={mood} />
        <View>
          <Text style={st.age} testID="hud-age">{view.calendar.age}</Text>
          <Text style={st.ageLbl}>{upper(locale, s.ageUnit)}</Text>
        </View>
        <View style={st.who}>
          <Text style={st.lifeLbl}>{s.lifeN(lifeNo)}</Text>
          <Text style={st.name} numberOfLines={1}>{view.name}</Text>
        </View>
      </View>

      <View style={st.stats}>
        {STATS.map((k) => (
          <View key={k} style={st.stat} testID={`stat-${k}`}>
            <Text style={st.statLbl} numberOfLines={1}>{upper(locale, s.stat[k])}</Text>
            <Text style={st.statVal}>{pts(view.stats[k])}</Text>
            <Bar pct={pts(view.stats[k])} />
            {floatsFor(k).map((f) => <FloatNum key={f.id} label={floatLabel(s, f)} up={f.delta > 0} />)}
          </View>
        ))}
      </View>

      <View style={st.meta}>
        <View style={st.chip} testID="hud-money">
          <Text style={st.chipTxt}><Text style={st.b}>{s.money(view.money.balance)}</Text></Text>
          {floatsFor('money').map((f) => <FloatNum key={f.id} label={floatLabel(s, f)} up={f.delta > 0} rise={6} style={st.chipFloat} />)}
        </View>
        <View style={st.chip}><Text style={st.chipTxt}>{s.unread}: <Text style={st.b}>{unread}</Text></Text></View>
        <View style={[st.chip, mom >= 75 && st.hot]} testID="hud-mom">
          <Text style={[st.chipTxt, mom >= 75 && st.hotTxt]}>{s.meter.momPressure} <Text style={[st.b, mom >= 75 && st.hotTxt]}>{momAlive ? mom : '—'}</Text></Text>
          {floatsFor('momPressure').map((f) => <FloatNum key={f.id} label={floatLabel(s, f)} up={f.delta < 0} rise={6} style={st.chipFloat} />)}
        </View>
        <View style={st.chip}>
          <Text style={st.chipTxt}>{s.meter.cringe} <Text style={st.b}>{pts(view.meters.cringe)}</Text></Text>
          {floatsFor('cringe').map((f) => <FloatNum key={f.id} label={floatLabel(s, f)} up={f.delta < 0} rise={6} style={st.chipFloat} />)}
        </View>
      </View>

      <View style={st.clock} testID="hud-clock">
        <Text style={st.clockDate} numberOfLines={1}>{dateLabel(s, locale, view.calendar.dayIndex, view.calendar.dateISO)}</Text>
        <Text style={st.clockTime}>{clockTime(view, progress)}</Text>
        <View style={st.dp}><View style={[st.dpFill, { width: `${Math.round(progress * 100)}%`, backgroundColor: speed === 'fast' ? colors.gold : colors.lime }]} /></View>
      </View>

      <View style={st.life} testID="hud-life">
        <Text style={st.lifeCell} numberOfLines={1}>{s.status.job}: <Text style={st.lifeB}>{job ? `${s.jobTitle[job.title] ?? job.title} · ${s.num(job.monthly)}${s.perMonth}` : s.jobless}</Text></Text>
        <Text style={st.lifeCell} numberOfLines={1}>{s.status.home}: <Text style={st.lifeB}>{homeTxt}</Text></Text>
        <Text style={st.lifeCell} numberOfLines={1}>{s.status.love}: <Text style={st.lifeB}>{loveTxt}</Text></Text>
        <Text style={st.lifeCell} numberOfLines={1}>{s.status.cat}: <Text style={st.lifeB}>{catTxt}</Text></Text>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  hud: { paddingHorizontal: 14, paddingTop: 4, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.line, gap: 7 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ring: { backgroundColor: colors.paper3, borderWidth: 2, borderColor: colors.line, alignItems: 'center', overflow: 'hidden' },
  cat: { position: 'absolute', right: -8, bottom: -4 },
  age: { fontFamily: fonts.stamp, fontSize: 30, lineHeight: 32, color: colors.ink },
  ageLbl: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: colors.ink2 },
  who: { flex: 1, alignItems: 'flex-end' },
  lifeLbl: { fontSize: 11, color: colors.ink2 },
  name: { fontSize: 12, fontWeight: '700', color: colors.ink },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, position: 'relative' },
  statLbl: { fontSize: 9.5, fontWeight: '700', letterSpacing: 0.6, color: colors.ink2 },
  statVal: { fontSize: 14, fontWeight: '700', color: colors.ink },
  bar: { height: 5, backgroundColor: colors.line, borderRadius: 3, marginTop: 3, overflow: 'hidden' },
  barFill: { height: 5, backgroundColor: colors.lime },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  chip: { borderWidth: 1, borderColor: colors.line, borderRadius: 6, paddingVertical: 2, paddingHorizontal: 6, position: 'relative' },
  chipTxt: { fontSize: 11, color: colors.ink2 },
  chipFloat: { top: 1, right: 2, fontSize: 12, backgroundColor: colors.paper2 },
  b: { color: colors.ink, fontWeight: '700' },
  hot: { borderColor: colors.wrong },
  hotTxt: { color: colors.wrong },
  clock: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  clockDate: { fontFamily: fonts.stamp, fontSize: 12, letterSpacing: 0.5, color: colors.ink, flexShrink: 1 },
  clockTime: { fontSize: 12, color: colors.ink2, fontVariant: ['tabular-nums'] },
  dp: { flex: 1, height: 4, backgroundColor: colors.line, borderRadius: 2, overflow: 'hidden', minWidth: 40 },
  dpFill: { height: 4 },
  life: { flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: 1, borderStyle: 'dashed', borderTopColor: colors.line, paddingTop: 6, rowGap: 3 },
  lifeCell: { width: '50%', fontSize: 11, color: colors.ink2, paddingRight: 6 },
  lifeB: { color: colors.ink, fontWeight: '600' },
});
