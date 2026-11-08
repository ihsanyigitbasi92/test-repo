/**
 * Chat layer of the feed (D-062): NpcBubble (procedural face seeded by the NPC id, left), PlayerBubble (lime, right), ResultLine
 * (outcome + delta tags), CoachLine (Fraunces italic, typewriter; roast red / lift green edge), Sys / Mundane lines.
 * The coach never speaks inside an NPC bubble.
 */
import { createContext, useContext } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, speakerColor, speakerFallback } from '../theme';
import { upper, useI18n } from '../i18n';
import { uiText } from '../state/feed';
import type { FeedItemOf } from '../state/feed';
import { useAppear, useTypewriter } from './anim';
import { Avatar, CatSprite } from '../avatar/Avatar';
import { npcFace, npcMood } from '../avatar/npcs';
import { CoachAvatar } from './CoachAvatar';
import type { Look } from '../avatar/look';

/** The current player's look, so family NPCs resemble them (provided by LifeScreen). */
export const PlayerLookContext = createContext<Look | null>(null);

/** NPC face disc: same generator as the player, seeded by the speaker id; Pamuk is the cat sprite. */
export function NpcFace({ speaker, avatar, age, size = 34 }: { speaker: string; avatar?: string; age?: number; size?: number }) {
  const bg = speakerColor[speaker] ?? speakerFallback;
  const player = useContext(PlayerLookContext);
  const f = npcFace(speaker, age ?? 18, player);
  const inner = size - 4;
  return (
    <View style={[st.av, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]} testID="npc-face">
      {f.isCat
        ? <CatSprite size={inner} mood={npcMood(avatar)} />
        : <View style={{ marginTop: inner * 0.12 }}><Avatar look={f.look} age={f.age} mood={npcMood(avatar)} outfit={f.outfit} size={inner} /></View>}
    </View>
  );
}

export function NpcBubble({ item }: { item: FeedItemOf<'npc'> }) {
  const { s, text } = useI18n();
  const anim = useAppear('slide');
  const name = s.speaker[item.speaker] ?? item.speaker.replace(/^npc:/, '').toUpperCase();
  return (
    <Animated.View style={[st.npc, anim]} testID="npc-bubble">
      <NpcFace speaker={item.speaker} avatar={item.avatar} age={item.age} />
      <View style={st.bub}>
        <Text style={st.bubName}>{name}</Text>
        <Text style={st.bubTxt}>{text(item.key, item.params)}</Text>
      </View>
    </Animated.View>
  );
}

export function PlayerBubble({ item }: { item: FeedItemOf<'reply'> }) {
  const { s, text, locale } = useI18n();
  const anim = useAppear('pop', 220);
  return (
    <Animated.View style={[st.me, anim]} testID="reply-bubble">
      <Text style={st.meLbl}>{item.auto ? upper(locale, s.youAuto) : s.you}</Text>
      <Text style={st.meTxt}>{item.raw ?? (item.key ? text(item.key) : '')}</Text>
    </Animated.View>
  );
}

export function ResultLine({ item }: { item: FeedItemOf<'outcome'> }) {
  const { s, text } = useI18n();
  const anim = useAppear('fade', 300);
  const label = (stat: string) => (stat === 'money' ? s.meter.money : stat in s.stat ? s.stat[stat as keyof typeof s.stat] : s.meter[stat as keyof typeof s.meter]);
  return (
    <Animated.View style={[st.result, anim]} testID="outcome">
      <Text style={st.resultTxt}>{text(item.key, item.params)}</Text>
      {item.deltas.length > 0 && (
        <View style={st.deltas}>
          {item.deltas.map((d, i) => {
            const v = d.stat === 'money' ? d.delta : Math.round(d.delta / 100);
            if (!v) return null;
            const good = d.stat === 'momPressure' || d.stat === 'cringe' ? v < 0 : v > 0;
            return (
              <Text key={i} style={[st.delta, { color: good ? colors.called : colors.wrong }]}>
                {label(d.stat)} {v > 0 ? '+' : '−'}{d.stat === 'money' ? s.num(v) : Math.abs(v)}
              </Text>
            );
          })}
        </View>
      )}
    </Animated.View>
  );
}

export function CoachLine({ item, typeMs }: { item: FeedItemOf<'coach'>; typeMs: number }) {
  const { s, text } = useI18n();
  const anim = useAppear('slide');
  const full = item.ui ? uiText(s, item.ui) : text(item.key ?? '', item.params);
  const shown = useTypewriter(full, typeMs);
  const edge = item.lift ? colors.called : item.roast ? colors.wrong : colors.lime;
  return (
    <Animated.View style={[st.coach, { borderLeftColor: edge }, anim]} testID="coach-line">
      <View style={st.coachHead}>
        <CoachAvatar mood={item.roast ? 'smirk' : 'neutral'} size={20} />
        <Text style={st.coachTag}>{s.coach}</Text>
      </View>
      <Text style={st.coachTxt}>{shown}{shown.length < full.length ? '▍' : ''}</Text>
    </Animated.View>
  );
}

export function SysLine({ item }: { item: FeedItemOf<'sys'> }) {
  const { s, locale } = useI18n();
  const anim = useAppear('fade');
  return <Animated.Text style={[st.sys, anim]}>{upper(locale, uiText(s, item.ui))}</Animated.Text>;
}

export function MundaneLine({ item }: { item: FeedItemOf<'mundane'> }) {
  const { s } = useI18n();
  const anim = useAppear('fade');
  return <Animated.Text style={[st.mundane, anim]}>· {uiText(s, item.ui)}</Animated.Text>;
}

const st = StyleSheet.create({
  npc: { flexDirection: 'row', gap: 8, alignItems: 'flex-end', maxWidth: '92%', alignSelf: 'flex-start' },
  av: { alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.line, overflow: 'hidden' },
  bub: { backgroundColor: colors.paper3, borderWidth: 1, borderColor: colors.line, borderTopLeftRadius: 14, borderTopRightRadius: 14, borderBottomRightRadius: 14, borderBottomLeftRadius: 4, paddingVertical: 8, paddingHorizontal: 12, flexShrink: 1 },
  bubName: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, color: colors.ink2, marginBottom: 2 },
  bubTxt: { fontSize: 15, color: colors.ink, fontFamily: fonts.body, lineHeight: 21 },
  me: { alignSelf: 'flex-end', maxWidth: '85%', backgroundColor: colors.lime, borderTopLeftRadius: 14, borderTopRightRadius: 14, borderBottomLeftRadius: 14, borderBottomRightRadius: 4, paddingVertical: 8, paddingHorizontal: 12 },
  meLbl: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, color: colors.limeInk, opacity: 0.7, marginBottom: 1 },
  meTxt: { fontSize: 15, fontWeight: '600', color: colors.limeInk, fontFamily: fonts.body },
  result: { paddingHorizontal: 4, gap: 4 },
  resultTxt: { fontSize: 14, color: colors.ink2, fontFamily: fonts.body, lineHeight: 20 },
  deltas: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 10, rowGap: 2 },
  delta: { fontFamily: fonts.stamp, fontSize: 13 },
  coach: { maxWidth: '94%', alignSelf: 'flex-start', borderLeftWidth: 3, paddingVertical: 6, paddingLeft: 14, paddingRight: 10 },
  coachHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  coachTag: { fontSize: 10, fontWeight: '700', letterSpacing: 1.4, color: colors.ink2 },
  coachTxt: { fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 17.5, lineHeight: 23, color: colors.ink },
  sys: { alignSelf: 'center', textAlign: 'center', fontSize: 11, letterSpacing: 1.2, color: colors.ink2, paddingVertical: 6, paddingHorizontal: 12 },
  mundane: { alignSelf: 'flex-start', fontSize: 12.5, color: colors.ink2, paddingHorizontal: 14 },
});
