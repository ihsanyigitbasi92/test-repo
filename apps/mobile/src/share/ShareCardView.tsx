/**
 * <ShareCardView> — the "Müşteri Dosyası — KAPANDI" share card as a React Native view (the in-app preview and, on
 * iOS / Android, what react-native-view-shot captures at 1080×1920 / 1080×1080). Every size is given for a
 * 1080-px-wide card (shareLayout.ts) and scaled to `width`, so preview and capture share one geometry.
 * The web build draws the same layout on a canvas (render.web.ts) and previews the PNG it made.
 */
import { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ViewInstance } from 'react-native';
import { Avatar } from '../avatar/Avatar';
import type { Look, TopStyle } from '../avatar/look';
import { fonts } from '../theme';
import { SHARE_COLORS as C, shareLayout } from './shareLayout';
import type { ShareCardData, ShareFormat } from './shareCard';

export interface ShareCardViewProps {
  data: ShareCardData;
  format: ShareFormat;
  width: number;
  look: Look | null;
  outfit?: TopStyle;
  age: number;
}

export const ShareCardView = forwardRef<ViewInstance, ShareCardViewProps>(function ShareCardView({ data, format, width, look, outfit, age }, ref) {
  const L = shareLayout(format);
  const k = width / L.W;
  const px = (x: number) => x * k;
  const rows = data.rows.slice(0, L.maxRows);
  return (
    <View ref={ref} collapsable={false} testID="share-card" style={{ width, height: px(L.H), backgroundColor: C.bg, padding: px(L.pad) }}>
      <View style={[st.tab, { paddingHorizontal: px(28), paddingVertical: px(14), borderTopLeftRadius: px(18), borderTopRightRadius: px(18), marginLeft: px(24) }]}>
        <Text style={[st.tabTxt, { fontSize: px(L.tabFont), letterSpacing: px(4) }]}>{data.title}</Text>
      </View>
      <View style={[st.sheet, { flex: 1, borderRadius: px(22), padding: px(L.sheetPad), borderWidth: Math.max(1, px(3)) }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: px(40) }}>
          <View style={[st.face, { width: px(L.avatar), height: px(L.avatar), borderRadius: px(L.avatar / 2), borderWidth: Math.max(1, px(6)) }]}>
            {look && <View style={{ marginTop: px(L.avatar * 0.1) }}><Avatar look={look} age={age} mood="neutral" outfit={outfit} size={px(L.avatar - 12)} desaturate={1} /></View>}
          </View>
          <View style={{ flex: 1, gap: px(10) }}>
            <Text style={[st.name, { fontSize: px(L.nameFont), lineHeight: px(L.nameFont * 1.12) }]} numberOfLines={2}>{data.name}</Text>
            <Text style={[st.years, { fontSize: px(L.yearsFont) }]}>{data.years} · {data.ageLine}</Text>
            <Text style={[st.farewell, { fontSize: px(L.farewellFont) }]} numberOfLines={2}>{data.farewell}</Text>
          </View>
        </View>
        <View style={{ marginTop: px(L.gap), gap: px(L.rowGap) }}>
          {rows.map((r) => (
            <View key={r.key} style={[st.row, { paddingBottom: px(L.rowGap), borderBottomWidth: Math.max(1, px(3)) }]}>
              <Text style={[st.rowLbl, { fontSize: px(L.labelFont), letterSpacing: px(3) }]}>{r.label.toLocaleUpperCase(data.locale === 'tr' ? 'tr-TR' : 'en-US')}</Text>
              <Text style={[st.rowTxt, { fontSize: px(L.rowFont), lineHeight: px(L.rowFont * 1.25) }]} numberOfLines={2}>{r.text}</Text>
            </View>
          ))}
        </View>
        <View style={[st.word, { marginTop: px(L.gap), paddingLeft: px(30), borderLeftWidth: px(10), gap: px(10) }]}>
          <Text style={[st.wordLbl, { fontSize: px(L.labelFont), letterSpacing: px(3) }]}>{data.lastWordLabel.toLocaleUpperCase(data.locale === 'tr' ? 'tr-TR' : 'en-US')}</Text>
          <Text style={[st.wordTxt, { fontSize: px(L.wordFont), lineHeight: px(L.wordFont * 1.3) }]} numberOfLines={L.wordLines}>“{data.lastWord}”</Text>
        </View>
        <View style={[st.closed, { right: px(L.stampRight), bottom: px(L.stampBottom), borderWidth: px(10), borderRadius: px(14), paddingHorizontal: px(30), paddingVertical: px(6) }]}>
          <Text style={[st.closedTxt, { fontSize: px(L.stampFont), letterSpacing: px(8) }]}>{data.closed}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: px(L.footGap), height: px(L.foot) }}>
        <View style={[st.motto, { paddingHorizontal: px(26), paddingVertical: px(8), borderRadius: px(10) }]}>
          <Text style={[st.mottoTxt, { fontSize: px(L.mottoFont), letterSpacing: px(6) }]}>{data.stamp}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: px(6) }}>
          <Text style={[st.by, { fontSize: px(L.byFont) }]}>{data.by}</Text>
          <Text style={[st.link, { fontSize: px(L.linkFont) }]}>{data.link}</Text>
        </View>
      </View>
    </View>
  );
});

const st = StyleSheet.create({
  tab: { alignSelf: 'flex-start', backgroundColor: C.sheet, borderColor: C.line },
  tabTxt: { fontFamily: fonts.stamp, color: C.lime },
  sheet: { backgroundColor: C.sheet, borderColor: C.line, overflow: 'hidden' },
  face: { backgroundColor: C.face, borderColor: C.faceEdge, overflow: 'hidden', alignItems: 'center' },
  name: { fontFamily: fonts.coach, fontStyle: 'italic', color: C.ink, fontWeight: '700' },
  years: { color: C.ink2, fontWeight: '700', fontVariant: ['tabular-nums'] },
  farewell: { fontFamily: fonts.coach, fontStyle: 'italic', color: C.ink2 },
  row: { borderStyle: 'dashed', borderBottomColor: C.line },
  rowLbl: { color: C.ink2, fontWeight: '700' },
  rowTxt: { color: C.ink, fontWeight: '600' },
  word: { borderLeftColor: C.gold },
  wordLbl: { color: C.gold, fontWeight: '700' },
  wordTxt: { fontFamily: fonts.coach, fontStyle: 'italic', color: C.ink },
  closed: { position: 'absolute', borderColor: C.red, transform: [{ rotate: '-9deg' }], opacity: 0.92 },
  closedTxt: { fontFamily: fonts.stamp, color: C.red },
  motto: { backgroundColor: C.lime },
  mottoTxt: { fontFamily: fonts.stamp, color: C.limeInk },
  by: { color: C.ink, fontWeight: '700' },
  link: { color: C.ink2 },
});
