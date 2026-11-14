/** Motto's face (07 CoachAvatar): neutral / smirk / shock / sad, drawn with Views (no SVG dependency). */
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import type { Mood } from '../state/useGame';

export function CoachAvatar({ mood, size = 52 }: { mood: Mood; size?: number }) {
  const k = size / 52;
  const mouth = mood === 'shock' ? st.mShock : mood === 'sad' ? st.mSad : mood === 'smirk' ? st.mSmirk : st.mFlat;
  return (
    <View style={[st.ring, { width: size, height: size, borderRadius: size / 2 }]} accessibilityLabel="Motto">
      <View style={{ width: 46, height: 46, transform: [{ scale: k }] }}>
        <View style={st.face} />
        <View style={st.hair} />
        <View style={[st.brow, { left: 11, top: 15, transform: [{ rotate: mood === 'smirk' ? '-14deg' : mood === 'sad' ? '12deg' : '-6deg' }, { translateY: mood === 'shock' ? -3 : 0 }] }]} />
        <View style={[st.brow, { left: 26, top: 15, transform: [{ rotate: mood === 'sad' ? '-12deg' : '6deg' }, { translateY: mood === 'shock' ? -3 : 0 }] }]} />
        <View style={[st.eye, { left: 14 }]} />
        <View style={[st.eye, { left: 28 }]} />
        <View style={mouth} />
        <View style={st.whistle} />
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  ring: { backgroundColor: colors.paper3, borderWidth: 2, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  face: { position: 'absolute', left: 2, top: 2, width: 42, height: 42, borderRadius: 21, backgroundColor: '#d9c7a8' },
  hair: { position: 'absolute', left: 6, top: 1, width: 34, height: 12, borderTopLeftRadius: 17, borderTopRightRadius: 17, backgroundColor: '#2b2b2b' },
  brow: { position: 'absolute', width: 9, height: 2.5, borderRadius: 2, backgroundColor: '#2b2b2b' },
  eye: { position: 'absolute', top: 20, width: 5, height: 5, borderRadius: 3, backgroundColor: '#1b1b1b' },
  mFlat: { position: 'absolute', left: 15, top: 31, width: 17, height: 2.5, borderRadius: 2, backgroundColor: '#6b2a2a' },
  mSmirk: { position: 'absolute', left: 16, top: 30, width: 17, height: 2.5, borderRadius: 2, backgroundColor: '#6b2a2a', transform: [{ rotate: '-12deg' }] },
  mShock: { position: 'absolute', left: 19, top: 28, width: 9, height: 11, borderRadius: 5, backgroundColor: '#6b2a2a' },
  mSad: { position: 'absolute', left: 15, top: 31, width: 17, height: 8, borderTopLeftRadius: 9, borderTopRightRadius: 9, borderTopWidth: 2.5, borderLeftWidth: 2.5, borderRightWidth: 2.5, borderColor: '#6b2a2a' },
  whistle: { position: 'absolute', left: 34, top: 33, width: 10, height: 5, borderRadius: 2, backgroundColor: colors.lime, transform: [{ rotate: '-20deg' }] },
});
