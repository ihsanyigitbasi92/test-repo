/**
 * Death flow share block: format chips (9:16 / 1:1), the card preview and "↗ Paylaş".
 * Native: the preview IS the card view that react-native-view-shot captures. Web: the PNG is drawn on a canvas as
 * soon as the block mounts (so the share call keeps the tap's user activation) and the preview shows that PNG.
 * Every outcome gets a visible line (UX B-5) and one `share` analytics event with its channel.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { ViewInstance } from 'react-native';
import { Avatar } from '../avatar/Avatar';
import { gameAnalytics } from '../analytics/hooks';
import type { ShareChannel } from '../analytics/events';
import { useI18n } from '../i18n';
import { lastWordText } from '../i18n/lastWord';
import { colors, fonts } from '../theme';
import type { DeathView } from '../state/useGame';
import { ShareCardView } from './ShareCardView';
import { buildShareCard, SHARE_SIZE } from './shareCard';
import type { ShareFormat } from './shareCard';
import { makeSharePng, shareCardImage } from './shareImage';

const AVATAR_SRC_ID = 'motto-share-avatar';
const DONE: Record<ShareChannel, 'shared' | 'downloaded' | 'copied' | 'cancelled' | 'failed'> = {
  native_sheet: 'shared', web_share: 'shared', download: 'downloaded', clipboard: 'copied', cancelled: 'cancelled', failed: 'failed',
};

export function ShareSection({ d }: { d: DeathView }) {
  const { s, locale } = useI18n();
  const { width: winW } = useWindowDimensions();
  const [format, setFormat] = useState<ShareFormat>('story');
  const [done, setDone] = useState<ShareChannel | null>(null);
  const [busy, setBusy] = useState(false);
  const [png, setPng] = useState<{ blob: Blob; url: string; format: ShareFormat; locale: string } | null>(null);
  const view = useRef<ViewInstance>(null);
  const r = d.roast;
  const data = useMemo(() => buildShareCard(locale, s, {
    name: d.name, birthYear: d.birthYear, deathYear: d.deathYear, age: r.ageAtDeath, cause: d.cause, highlights: d.highlights, job: d.job,
    family: { married: d.facts?.marriedYears != null, marriedYears: d.facts?.marriedYears ?? null, hasChild: !!d.facts?.hasChild, hasGrandchild: !!d.facts?.hasGrandchild, partner: d.partner },
    lastWord: lastWordText(locale, d.facts ?? null, r.lastWord, r.lastWord ? s.pattern[r.lastWord.pattern] ?? r.lastWord.pattern : '', d.seed ?? 0),
  }), [d, locale, s, r]);
  const web = Platform.OS === 'web';
  const size = SHARE_SIZE[format];
  const previewW = Math.min(format === 'story' ? 300 : 340, Math.max(220, winW - 80));
  const previewH = Math.round((previewW * size.h) / size.w);

  // Web: draw the PNG ahead of the tap (fonts + avatar), re-drawn when the format or the language changes.
  useEffect(() => {
    if (!web || typeof document === 'undefined') return;
    let live = true, url: string | null = null;
    const svg = document.getElementById(AVATAR_SRC_ID)?.querySelector('svg') ?? null;
    void makeSharePng({ data, format, avatarSvg: svg }).then((blob) => {
      if (!live || !blob) return;
      url = URL.createObjectURL(blob);
      setPng({ blob, url, format, locale });
    }).catch(() => null);
    return () => { live = false; if (url) setTimeout(() => URL.revokeObjectURL(url!), 1000); };
  }, [web, data, format, locale]);

  const ready = !web || (png?.format === format && png.locale === locale);
  const onShare = () => {
    if (busy) return;
    setBusy(true);
    const svg = web && typeof document !== 'undefined' ? document.getElementById(AVATAR_SRC_ID)?.querySelector('svg') ?? null : null;
    void shareCardImage({ data, format, view: view.current, avatarSvg: svg }, ready ? png?.blob : undefined)
      .catch((): ShareChannel => 'failed')
      .then((channel) => { setDone(channel); gameAnalytics.share('death', channel, format); })
      .finally(() => setBusy(false));
  };

  return (
    <View style={st.wrap} testID="share-section">
      <View style={st.chips} accessibilityRole="radiogroup" accessibilityLabel={s.shareCard.formatLabel}>
        {(['story', 'square'] as const).map((f) => (
          <Pressable key={f} onPress={() => { setFormat(f); setDone(null); }} accessibilityRole="radio" accessibilityState={{ selected: format === f }}
            testID={`share-format-${f}`} style={[st.chip, format === f && st.chipOn]}>
            <Text style={[st.chipTxt, format === f && st.chipTxtOn]}>{s.shareCard[f]}</Text>
          </Pressable>
        ))}
      </View>
      {web ? (
        <View style={[st.preview, { width: previewW, height: previewH }]}>
          {ready && png ? <Image source={{ uri: png.url }} style={{ width: previewW, height: previewH }} accessibilityLabel={data.title} testID="share-preview" />
            : <Text style={st.wait}>{s.shareCard.preparing}</Text>}
          {/* the face the canvas draws: the same procedural avatar, rendered once, off-screen */}
          <View nativeID={AVATAR_SRC_ID} style={st.avatarSrc} pointerEvents="none" aria-hidden>
            {d.look && <Avatar look={d.look} age={r.ageAtDeath} mood="neutral" outfit={d.outfit} size={300} desaturate={1} />}
          </View>
        </View>
      ) : (
        <View style={[st.preview, { width: previewW, height: previewH }]}>
          <ShareCardView ref={view} data={data} format={format} width={previewW} look={d.look} outfit={d.outfit} age={r.ageAtDeath} />
        </View>
      )}
      <Pressable onPress={onShare} disabled={busy} accessibilityRole="button" testID="share" style={({ pressed }) => [st.btn, (pressed || busy) && { opacity: 0.7 }]}>
        <Text style={st.btnTxt}>↗ {s.cta.share}</Text>
      </Pressable>
      {done && <Text style={st.done} accessibilityLiveRegion="polite" testID="share-done">{s.shareDone[DONE[done]]}</Text>}
    </View>
  );
}

const st = StyleSheet.create({
  wrap: { gap: 10, marginBottom: 8, alignItems: 'center' },
  chips: { flexDirection: 'row', gap: 8, alignSelf: 'stretch', justifyContent: 'center' },
  chip: { minHeight: 44, justifyContent: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 14 },
  chipOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  chipTxt: { fontSize: 13, fontWeight: '700', color: colors.ink2 },
  chipTxtOn: { color: colors.limeInk },
  preview: { borderRadius: 8, overflow: 'hidden', backgroundColor: '#101410', alignItems: 'center', justifyContent: 'center' },
  wait: { fontSize: 13, color: colors.ink2, fontFamily: fonts.body },
  avatarSrc: { position: 'absolute', left: 0, top: 0, width: 1, height: 1, overflow: 'hidden', opacity: 0 },
  btn: { minHeight: 48, minWidth: 160, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: colors.lime, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 18 },
  btnTxt: { fontSize: 15, fontWeight: '700', color: colors.ink },
  done: { fontSize: 13, color: colors.ink2, fontFamily: fonts.body },
});
