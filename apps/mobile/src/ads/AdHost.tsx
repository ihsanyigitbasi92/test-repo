/**
 * The ad layer's full-screen views, mounted once (LifeScreen): the demo ad placeholder (web / tests / Expo Go),
 * the consent cards (KVKK notice + separate explicit consent, demo UMP form, ATT pre-prompt) and the privacy sheet.
 *
 * Dark-pattern rules kept here (06 §6.4): paired buttons are the same component with the same style — no bigger
 * "yes"; switches start OFF; the demo ad's close control is a real, labelled button (never a tiny or fake ✕), and
 * while the skip timer runs there is a plain countdown text, not a disabled look-alike button.
 */
import { useEffect, useState, useSyncExternalStore } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { upper, useI18n } from '../i18n';
import { LEGAL_URLS, isPlaceholder } from '../monetization/config';
import { AD_CONFIG } from './config';
import { getView, hostMounted, resolveView, subscribeView, type AdView, type ChoiceResult, type Presented, type ViewResult } from './uiStore';

type ViewOf<K extends AdView['k']> = Extract<AdView, { k: K }>;
type Done<K extends AdView['k']> = (v: ViewResult[K]) => void;

/** One button style for every choice on these sheets; `flex` makes pairs exactly equal. */
function Btn({ label, onPress, testID, flex }: { label: string; onPress: () => void; testID: string; flex?: boolean }) {
  const { locale } = useI18n();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" testID={testID} style={({ pressed }) => [st.btn, flex && st.flex1, pressed && st.pressed]}>
      <Text style={st.btnTxt}>{upper(locale, label)}</Text>
    </Pressable>
  );
}

function Switch({ label, hint, value, onChange, disabled, testID }: { label: string; hint: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean; testID: string }) {
  const { s } = useI18n();
  return (
    <Pressable onPress={() => !disabled && onChange(!value)} accessibilityRole="switch" accessibilityState={{ checked: value, disabled: !!disabled }} testID={testID}
      style={[st.switchRow, disabled && st.dim]}>
      <View style={st.flex1}>
        <Text style={st.switchLbl}>{label}</Text>
        <Text style={st.hint}>{hint}</Text>
      </View>
      <View style={[st.pill, value && st.pillOn]}><Text style={[st.pillTxt, value && st.pillTxtOn]}>{value ? s.ads.consent.on : s.ads.consent.off}</Text></View>
    </Pressable>
  );
}

/** Seconds left of `ms` since mount (ticks 4×/s). */
function useCountdown(ms: number): number {
  const [left, setLeft] = useState(ms);
  useEffect(() => {
    const t0 = Date.now();
    const t = setInterval(() => setLeft(Math.max(0, ms - (Date.now() - t0))), 250);
    return () => clearInterval(t);
  }, [ms]);
  return Math.ceil(left / 1000);
}

function MockAd({ view, done }: { view: ViewOf<'mockInterstitial'> | ViewOf<'mockRewarded'>; done: (watched: boolean) => void }) {
  const { s } = useI18n();
  const t = s.ads.mock;
  const rewarded = view.k === 'mockRewarded';
  const total = rewarded ? view.ms : view.skipMs;
  const left = useCountdown(total);
  return (
    <View style={[StyleSheet.absoluteFill, st.ad]} testID={rewarded ? 'mock-ad-rewarded' : 'mock-ad-interstitial'}>
      <View style={st.adTop}>
        <Text style={st.adTitle}>{rewarded ? t.rewardedTitle : t.breakTitle}</Text>
        <Text style={st.adTag} testID="mock-ad-demo-tag">{t.demoTag}</Text>
      </View>
      <View style={st.creative}>
        <Text style={st.creativeMark}>AD</Text>
        <Text style={st.creativeTxt}>{t.body}</Text>
      </View>
      <View style={st.adBottom}>
        {left > 0
          ? <Text style={st.count} testID="mock-ad-countdown">{rewarded ? t.rewardIn(left) : t.skipIn(left)}</Text>
          : rewarded ? <Text style={st.count}>{t.rewardReady}</Text> : null}
        {rewarded
          ? (left > 0
            ? <Btn label={t.closeNoReward} onPress={() => done(false)} testID="mock-ad-close" />
            : <Btn label={t.collect} onPress={() => done(true)} testID="mock-ad-collect" />)
          : left === 0 ? <Btn label={t.skip} onPress={() => done(true)} testID="mock-ad-skip" /> : null}
      </View>
    </View>
  );
}

function Sheet({ title, children, testID, tag }: { title: string; children: React.ReactNode; testID: string; tag?: string }) {
  return (
    <View style={[StyleSheet.absoluteFill, st.scrim]} testID={testID}>
      <View style={st.sheet}>
        <ScrollView contentContainerStyle={st.sheetBody}>
          {tag ? <Text style={st.adTag}>{tag}</Text> : null}
          <Text style={st.title}>{title}</Text>
          {children}
        </ScrollView>
      </View>
    </View>
  );
}

function Notice({ done }: { done: Done<'notice'> }) {
  const { s } = useI18n();
  const t = s.ads.consent;
  const url = LEGAL_URLS.privacy && !isPlaceholder(LEGAL_URLS.privacy) ? LEGAL_URLS.privacy : AD_CONFIG.consent.privacyUrl;
  return (
    <Sheet title={t.noticeTitle} testID="consent-notice">
      <Text style={st.body}>{t.noticeBody}</Text>
      <Pressable onPress={() => { void Linking.openURL(url).catch(() => undefined); }} accessibilityRole="link" testID="consent-notice-link" style={st.linkBox}>
        <Text style={st.link}>{t.noticeLink} ›</Text>
      </Pressable>
      <Btn label={t.noticeOk} onPress={() => done(null)} testID="consent-notice-ok" />
    </Sheet>
  );
}

/** The two switches of the explicit-consent card; both start as given (OFF on first ask). */
function ChoiceFields({ minor, value, onChange }: { minor: boolean; value: ChoiceResult; onChange: (v: ChoiceResult) => void }) {
  const { s } = useI18n();
  const t = s.ads.consent;
  if (minor) return <Text style={st.body}>{s.ads.privacy.minor}</Text>;
  return (
    <>
      <Switch label={t.adult} hint={t.adultHint} value={value.adult} testID="consent-adult"
        onChange={(adult) => onChange({ adult, personalized: adult && value.personalized })} />
      <Switch label={t.personalized} hint={t.personalizedHint} value={value.personalized} disabled={!value.adult} testID="consent-personalized"
        onChange={(personalized) => onChange({ ...value, personalized })} />
    </>
  );
}

function Choice({ view, done }: { view: ViewOf<'choice'>; done: Done<'choice'> }) {
  const { s } = useI18n();
  const t = s.ads.consent;
  const [value, setValue] = useState<ChoiceResult>(view.initial);
  return (
    <Sheet title={t.choiceTitle} testID="consent-choice">
      <ChoiceFields minor={view.minor} value={value} onChange={setValue} />
      <Text style={st.hint}>{t.foot}</Text>
      <Text style={st.hint}>{t.declineHint}</Text>
      <View style={st.row}>
        <Btn flex label={t.decline} onPress={() => done(null)} testID="consent-decline" />
        <Btn flex label={t.save} onPress={() => done(value)} testID="consent-save" />
      </View>
    </Sheet>
  );
}

function Ump({ done }: { done: Done<'ump'> }) {
  const { s } = useI18n();
  const t = s.ads.consent;
  return (
    <Sheet title={t.umpTitle} tag={t.umpDemo} testID="consent-ump">
      <Text style={st.body}>{t.umpBody}</Text>
      <View style={st.row}>
        <Btn flex label={t.umpDeny} onPress={() => done(false)} testID="consent-ump-deny" />
        <Btn flex label={t.umpAllow} onPress={() => done(true)} testID="consent-ump-allow" />
      </View>
    </Sheet>
  );
}

function Att({ done }: { done: Done<'att'> }) {
  const { s } = useI18n();
  const t = s.ads.consent;
  return (
    <Sheet title={t.attTitle} testID="consent-att">
      <Text style={st.body}>{t.attBody}</Text>
      <Btn label={t.attContinue} onPress={() => done(null)} testID="consent-att-continue" />
    </Sheet>
  );
}

function Privacy({ view, done }: { view: ViewOf<'privacy'>; done: Done<'privacy'> }) {
  const { s } = useI18n();
  const t = s.ads.privacy;
  const p = view.status;
  const [value, setValue] = useState<ChoiceResult>({ adult: p.adult, personalized: p.adult && p.personalized });
  return (
    <Sheet title={t.title} testID="privacy-sheet">
      <Text style={st.body} testID="privacy-status">{!p.resolved ? t.statusPending : p.personalized ? t.statusPersonal : t.statusNonPersonal}</Text>
      {p.noAds ? <Text style={st.body}>{p.noAdsFree ? t.noAdsFree : t.noAds}</Text> : null}
      {p.ump
        ? <Btn label={t.umpButton} onPress={() => done({ k: 'ump' })} testID="privacy-ump" />
        : <ChoiceFields minor={p.minor} value={value} onChange={setValue} />}
      {p.ios ? <Text style={st.hint}>{t.iosNote}</Text> : null}
      <Text style={st.hint}>{t.rating}</Text>
      <View style={st.row}>
        <Btn flex label={t.cancel} onPress={() => done({ k: 'cancel' })} testID="privacy-cancel" />
        {!p.ump && !p.minor ? <Btn flex label={t.save} onPress={() => done({ k: 'save', choice: value })} testID="privacy-save" /> : null}
      </View>
    </Sheet>
  );
}

function Body({ p }: { p: Presented }) {
  const v = p.view;
  switch (v.k) {
    case 'mockInterstitial': return <MockAd view={v} done={() => resolveView<'mockInterstitial'>(p.id, null)} />;
    case 'mockRewarded': return <MockAd view={v} done={(w) => resolveView<'mockRewarded'>(p.id, w)} />;
    case 'notice': return <Notice done={(r) => resolveView<'notice'>(p.id, r)} />;
    case 'choice': return <Choice view={v} done={(r) => resolveView<'choice'>(p.id, r)} />;
    case 'ump': return <Ump done={(r) => resolveView<'ump'>(p.id, r)} />;
    case 'att': return <Att done={(r) => resolveView<'att'>(p.id, r)} />;
    case 'privacy': return <Privacy view={v} done={(r) => resolveView<'privacy'>(p.id, r)} />;
  }
}

export function AdHost() {
  const p = useSyncExternalStore(subscribeView, getView, getView);
  useEffect(() => { hostMounted(true); return () => hostMounted(false); }, []);
  return p ? <Body key={p.id} p={p} /> : null;
}

const st = StyleSheet.create({
  flex1: { flex: 1 },
  pressed: { transform: [{ scale: 0.98 }] },
  dim: { opacity: 0.45 },
  // demo ad
  ad: { backgroundColor: colors.death, zIndex: 60, padding: 20, justifyContent: 'space-between' },
  adTop: { gap: 6, paddingTop: 8 },
  adTitle: { fontFamily: fonts.stamp, fontSize: 22, letterSpacing: 2, color: colors.ink },
  adTag: { alignSelf: 'flex-start', fontSize: 11, fontWeight: '700', letterSpacing: 1.2, color: colors.noteInk, backgroundColor: colors.note, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 4, overflow: 'hidden' },
  creative: { borderWidth: 2, borderStyle: 'dashed', borderColor: colors.graveEdge, borderRadius: 12, paddingVertical: 36, paddingHorizontal: 20, alignItems: 'center', gap: 14, backgroundColor: colors.paper2 },
  creativeMark: { fontFamily: fonts.stamp, fontSize: 64, letterSpacing: 4, color: colors.grave },
  creativeTxt: { fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 18, lineHeight: 25, color: colors.ink, textAlign: 'center' },
  adBottom: { gap: 10, minHeight: 96, justifyContent: 'flex-end' },
  count: { fontSize: 14, fontWeight: '600', color: colors.ink2, textAlign: 'center' },
  // sheets
  scrim: { backgroundColor: colors.scrim, alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 55 },
  sheet: { backgroundColor: colors.paper, borderRadius: 12, borderWidth: 1, borderColor: colors.line, width: '100%', maxWidth: 380, maxHeight: '92%' },
  sheetBody: { padding: 16, gap: 12 },
  title: { fontFamily: fonts.stamp, letterSpacing: 1.2, fontSize: 15, color: colors.lime },
  body: { fontSize: 15, lineHeight: 22, color: colors.ink, fontFamily: fonts.body },
  hint: { fontSize: 12.5, lineHeight: 18, color: colors.ink2, fontFamily: fonts.body },
  linkBox: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  link: { fontSize: 14, fontWeight: '600', color: colors.ink, textDecorationLine: 'underline' },
  row: { flexDirection: 'row', gap: 8 },
  btn: { minHeight: 54, borderRadius: 8, borderWidth: 2, borderColor: colors.ink2, backgroundColor: colors.paper2, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 8 },
  btnTxt: { fontFamily: fonts.stamp, fontSize: 14, letterSpacing: 1.2, color: colors.ink, textAlign: 'center' },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, borderWidth: 1, borderColor: colors.line, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  switchLbl: { fontSize: 15, fontWeight: '600', color: colors.ink, fontFamily: fonts.body },
  pill: { minWidth: 66, borderWidth: 1.5, borderColor: colors.line, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 10, alignItems: 'center' },
  pillOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  pillTxt: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, color: colors.ink2 },
  pillTxtOn: { color: colors.limeInk },
});
