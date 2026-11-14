/**
 * Decision-zone pieces of the ad layer: the rewarded offer (two equal buttons — watch / no thanks — with an honest
 * label of what is given) and the persistent "Privacy / ad preferences" entry.
 */
import { useSyncExternalStore } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { upper, useI18n } from '../i18n';
import type { Offer } from './adService';
import { ads } from './runtime';

/** [Reklam izle → +X al] [Kalsın]: same box, same type, same contrast; nothing is preselected, nothing times out. */
export function RewardedOfferButtons({ offer, onAccept, onDecline }: { offer: Offer; onAccept: () => void; onDecline: () => void }) {
  const { s, locale } = useI18n();
  const t = s.ads.offer;
  return (
    <View style={st.col} testID="rewarded-offer">
      <View style={st.row}>
        <Pressable onPress={onDecline} accessibilityRole="button" testID="offer-decline" style={({ pressed }) => [st.btn, pressed && st.pressed]}>
          <Text style={st.btnTxt}>{upper(locale, t.decline)}</Text>
        </Pressable>
        <Pressable onPress={onAccept} accessibilityRole="button" testID="offer-accept" style={({ pressed }) => [st.btn, pressed && st.pressed]}>
          <Text style={st.btnTxt}>{upper(locale, offer.free ? t.free(offer.amount) : t.watch(offer.amount))}</Text>
        </Pressable>
      </View>
      <Text style={st.note}>{offer.free ? t.noteFree : t.note}</Text>
    </View>
  );
}

/** Persistent entry to the consent settings (shop screen, "Enough for today" sheet). 44 pt target. */
export function PrivacyEntry({ onOpen }: { onOpen?: () => void } = {}) {
  const { s } = useI18n();
  useSyncExternalStore(ads.subscribe, () => ads.getConsent(), () => ads.getConsent());
  return (
    <Pressable onPress={() => { onOpen?.(); void ads.ready().then(() => ads.openPrivacy()); }} accessibilityRole="button" testID="privacy-entry" style={({ pressed }) => [st.entry, pressed && st.pressed]}>
      <Text style={st.entryTxt}>{s.ads.privacy.entry} ›</Text>
    </Pressable>
  );
}

const st = StyleSheet.create({
  col: { gap: 6 },
  row: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, minHeight: 58, borderRadius: 8, borderWidth: 2, borderColor: colors.ink2, backgroundColor: colors.paper2, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 8 },
  btnTxt: { fontFamily: fonts.stamp, fontSize: 13, letterSpacing: 1, color: colors.ink, textAlign: 'center' },
  note: { fontSize: 12, color: colors.ink2, textAlign: 'center' },
  pressed: { transform: [{ scale: 0.98 }] },
  entry: { minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  entryTxt: { fontSize: 13, fontWeight: '600', color: colors.ink2, textDecorationLine: 'underline' },
});
