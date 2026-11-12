/**
 * Mağaza (06 §2.5.1, doc 14 §4): one column of product cards, "Restore purchases" always visible, the pre-purchase
 * information block and the legal links. Opened by the player from the top bar only — it never opens by itself.
 *
 * Dark-pattern checklist (06 §6.4) holds by construction: no countdown, no stock, no crossed-out price, no
 * "most popular", nothing preselected, Close is always there (44 pt, never delayed), declining
 * gets no reaction. The price is the store's own `priceString`; without one a product cannot be bought.
 */
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useI18n } from '../i18n';
import { covers, productOf, type Sku } from '../monetization/catalog';
import { LEGAL_URLS, SELLER, SHIPPED_FEATURES, isPlaceholder } from '../monetization/config';
import { useEntitlements } from '../monetization/entitlements';
import { MockIapProvider, type MockDecision, type StoreProduct } from '../monetization/iap';
import { shop, useShop } from '../monetization/purchases';
import { AD_CONFIG } from '../ads/config';
import { PrivacyEntry } from '../ads/OfferButtons';
import { sfx } from '../state/sound';
import { UI_SFX } from '../state/sfx';

type Notice = { tone: 'ok' | 'info' | 'warn'; text: string } | null;
interface Ask { product: StoreProduct; resolve: (d: MockDecision) => void }

const STORE = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';
const openUrl = (url: string): void => { if (!isPlaceholder(url)) void Linking.openURL(url).catch(() => { /* no browser: nothing to do */ }); };

export function ShopScreen({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { s, locale } = useI18n();
  const t = s.shop;
  // What owners' rewarded offers do is the ads layer's call; the card states exactly that mode.
  const rw = t.rewarded[AD_CONFIG.rewarded.noAdsMode];
  const view = useShop();
  const ent = useEntitlements();
  const [notice, setNotice] = useState<Notice>(null);
  const [ask, setAsk] = useState<Ask | null>(null);

  // Connect on first open (and refresh demo prices for the current language); the store is never touched before.
  useEffect(() => {
    if (!open) return;
    setNotice(null);
    const c = shop();
    void c.init().then(() => c.loadProducts(locale === 'tr' ? 'TRY' : 'USD'));
  }, [open, locale]);

  // Demo store: the fake payment sheet stands in for the store's own confirmation.
  useEffect(() => {
    const p = shop().provider;
    if (!open || !(p instanceof MockIapProvider)) return;
    p.setConfirm((product) => new Promise<MockDecision>((resolve) => setAsk({ product, resolve })));
    return () => { p.setConfirm(null); };
  }, [open]);

  const close = useCallback(() => {
    setAsk((a) => { a?.resolve('cancel'); return null; });
    onClose();
  }, [onClose]);

  // Android back = Close (07 back-key table).
  useEffect(() => {
    if (!open || Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { close(); return true; });
    return () => sub.remove();
  }, [open, close]);

  const answer = (d: MockDecision): void => { ask?.resolve(d); setAsk(null); };

  const buy = async (sku: Sku): Promise<void> => {
    setNotice(null);
    const r = await shop().buy(sku);
    if (r.status === 'ok') { sfx(UI_SFX.purchase); setNotice({ tone: 'ok', text: t.notice.bought[sku] }); }
    else if (r.status === 'restored') setNotice({ tone: 'ok', text: t.notice.alreadyOwned });
    else if (r.status === 'pending') setNotice({ tone: 'info', text: t.notice.pending });
    else if (r.status === 'failed') setNotice({ tone: 'warn', text: r.code === 'not_allowed' ? t.notice.notAllowed : t.notice.failed });
    // cancelled: the coach stays silent (06 §2.5.2)
  };

  const restore = async (): Promise<void> => {
    setNotice(null);
    const r = await shop().restore();
    if (r.status === 'failed') setNotice({ tone: 'warn', text: t.notice.restoreFailed });
    else if (r.status === 'none') setNotice({ tone: 'info', text: t.notice.restoreNone });
    else setNotice({ tone: 'ok', text: r.restored.length ? t.notice.restored(r.restored.map((id) => t.name[id]).join(', ')) : t.notice.restoredSame });
  };

  if (!open) return null;
  const busy = view.busy !== null;
  const listed = view.listed;
  const owned = (sku: Sku): 'owned' | 'included' | 'none' => (ent.loaded ? shop().ownership(sku) : 'none');
  const storeName = t.store[STORE] ?? t.store.web!;

  return (
    <View style={[StyleSheet.absoluteFill, st.root]} testID="shop" accessibilityViewIsModal>
      <View style={st.head}>
        <Text style={st.title} accessibilityRole="header">{t.title}</Text>
        <Pressable onPress={close} accessibilityRole="button" accessibilityLabel={t.close} testID="shop-close" style={({ pressed }) => [st.closeBtn, pressed && st.pressed]}>
          <Text style={st.closeTxt}>{t.close}</Text>
        </Pressable>
      </View>
      <ScrollView style={st.scroll} contentContainerStyle={st.body}>
        <Text style={st.coach}>{t.intro}</Text>
        {view.provider === 'mock' && <Text style={st.demo} testID="shop-demo">{t.demo}</Text>}
        {view.ready && !view.available && <Text style={st.warn} testID="shop-unavailable">{t.unavailable}</Text>}
        {notice && (
          <View style={[st.notice, notice.tone === 'ok' && st.noticeOk, notice.tone === 'warn' && st.noticeWarn]} testID="shop-notice" accessibilityLiveRegion="polite">
            <Text style={st.noticeTxt}>{notice.text}</Text>
          </View>
        )}
        {ent.tickets > 0 && <Text style={st.tickets} testID="shop-tickets">{t.ticketsHave(ent.tickets)}</Text>}
        {!view.ready && <ActivityIndicator color={colors.lime} style={st.spinner} />}
        {view.ready && !listed.length && <Text style={st.legal}>{t.empty}</Text>}

        {view.ready && listed.map((sku) => {
          const product = productOf(sku)!;
          const sp = view.products[sku];
          const state = owned(sku);
          const shipped = product.grants.filter((f) => SHIPPED_FEATURES.includes(f));
          const bigger = listed.find((o) => covers(o, sku) && owned(o) === 'none');
          const smallerOwned = listed.find((o) => covers(sku, o) && owned(o) === 'owned');
          const includedVia = state === 'included' ? ent.owned.find((id) => covers(id, sku)) : undefined;
          return (
            <View key={sku} style={[st.card, state !== 'none' && st.cardOwned]} testID={`shop-card-${sku}`}>
              <View style={st.cardHead}>
                <Text style={st.name}>{t.name[sku]}</Text>
                {state !== 'none' && (
                  <View style={st.stamp} testID={`shop-owned-${sku}`}>
                    <Text style={st.stampTxt}>{state === 'owned' || !includedVia ? t.owned : t.included(t.name[includedVia])}</Text>
                  </View>
                )}
              </View>
              {!!t.tagline[sku] && <Text style={st.tagline}>{t.tagline[sku]}</Text>}
              <Text style={st.line}>{t.line[sku]}</Text>
              <Text style={st.gets}>{t.gets}</Text>
              {product.kind === 'consumable'
                ? <Text style={st.feat}>• {t.ticketsGet(product.tickets ?? 0)}</Text>
                : shipped.map((f) => <Text key={f} style={st.feat}>• {t.feature[f] ?? f}</Text>)}
              {shipped.includes('ads.interstitial.off') && <Text style={st.feat}>• {rw.feature}</Text>}
              {product.kind === 'non_consumable' && shipped.length < product.grants.length && <Text style={st.hint}>{t.partial}</Text>}
              {state === 'none' && bigger && <Text style={st.hint}>{t.coveredHint(t.name[bigger])}</Text>}
              {state === 'none' && smallerOwned && <Text style={st.hint}>{t.overlapHint(t.name[smallerOwned], t.name[sku])}</Text>}
              <Text style={st.legal}>
                {product.kind === 'consumable' ? t.termsConsumable : t.terms}
                {sp ? ` · ${sp.currencyCode === 'TRY' ? t.taxIncluded : t.taxByStore}` : ''}
                {` · ${rw.noPower}`}
              </Text>
              {state === 'none' && (sp ? (
                <Pressable onPress={() => { void buy(sku); }} disabled={busy} accessibilityRole="button" accessibilityLabel={t.buyA11y(t.name[sku], sp.priceString)}
                  accessibilityState={{ disabled: busy, busy: view.busy === sku }} testID={`shop-buy-${sku}`}
                  style={({ pressed }) => [st.buy, busy && st.dim, pressed && st.pressed]}>
                  {view.busy === sku
                    ? <View style={st.rowC}><ActivityIndicator color={colors.limeInk} /><Text style={st.buyTxt}>{t.buying}</Text></View>
                    : <Text style={st.buyTxt} testID={`shop-price-${sku}`}>{t.buy(sp.priceString)}</Text>}
                </Pressable>
              ) : (
                <View style={st.noPrice}>
                  <Text style={st.hint} testID={`shop-noprice-${sku}`}>{t.noPrice}</Text>
                  <Pressable onPress={() => { void shop().loadProducts(locale === 'tr' ? 'TRY' : 'USD'); }} accessibilityRole="button" style={({ pressed }) => [st.ghost, pressed && st.pressed]}>
                    <Text style={st.ghostTxt}>{t.retry}</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          );
        })}

        <Pressable onPress={() => { void restore(); }} disabled={busy} accessibilityRole="button" accessibilityState={{ disabled: busy, busy: view.busy === 'restore' }}
          testID="shop-restore" style={({ pressed }) => [st.ghost, busy && st.dim, pressed && st.pressed]}>
          {view.busy === 'restore'
            ? <View style={st.rowC}><ActivityIndicator color={colors.ink} /><Text style={st.ghostTxt}>{t.restoring}</Text></View>
            : <Text style={st.ghostTxt}>{t.restore}</Text>}
        </Pressable>
        <Text style={st.legal}>{t.restoreHint}</Text>

        <View style={st.info} testID="shop-info">
          <Text style={st.infoTitle}>{t.info.title}</Text>
          <Text style={st.infoTxt}>{t.info.seller(SELLER, storeName)}</Text>
          <Text style={st.infoTxt}>{t.info.delivery}</Text>
          <Text style={st.infoTxt}>{t.info.refund(storeName)}</Text>
          <Text style={st.infoTxt}>{t.info.account}</Text>
          <Text style={st.infoTxt}>{rw.free}</Text>
          <Text style={st.infoTxt}>{t.info.minors}</Text>
        </View>
        <View style={st.links}>
          {([['terms', LEGAL_URLS.terms], ['privacy', LEGAL_URLS.privacy], ['refund', STORE === 'android' ? LEGAL_URLS.refundAndroid : LEGAL_URLS.refundIos]] as const).map(([k, url]) => (
            <Pressable key={k} onPress={() => openUrl(url)} accessibilityRole="link" testID={`shop-link-${k}`} style={({ pressed }) => [st.link, pressed && st.pressed]}>
              <Text style={st.linkTxt}>{t.links[k]}</Text>
            </Pressable>
          ))}
        </View>
        {/* Ad layer: persistent consent settings entry (docs/design/15 §5). */}
        <PrivacyEntry />
      </ScrollView>

      {ask && (
        <View style={[StyleSheet.absoluteFill, st.scrim]} testID="mock-pay">
          <View style={st.sheet}>
            <Text style={st.title}>{t.mock.title}</Text>
            <Text style={st.line}>{t.mock.text(t.name[ask.product.sku], ask.product.priceString)}</Text>
            <View style={st.sheetRow}>
              <Pressable onPress={() => answer('cancel')} accessibilityRole="button" testID="mock-pay-cancel" style={({ pressed }) => [st.ghost, st.flex1, pressed && st.pressed]}>
                <Text style={st.ghostTxt}>{t.mock.cancel}</Text>
              </Pressable>
              <Pressable onPress={() => answer('approve')} accessibilityRole="button" testID="mock-pay-approve" style={({ pressed }) => [st.buy, st.flex1, pressed && st.pressed]}>
                <Text style={st.buyTxt}>{t.mock.approve}</Text>
              </Pressable>
            </View>
            <View style={st.sheetRow}>
              <Pressable onPress={() => answer('fail')} accessibilityRole="button" testID="mock-pay-fail" style={[st.link, st.flex1]}><Text style={st.linkTxt}>{t.mock.fail}</Text></Pressable>
              <Pressable onPress={() => answer('pending')} accessibilityRole="button" testID="mock-pay-pending" style={[st.link, st.flex1]}><Text style={st.linkTxt}>{t.mock.pending}</Text></Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  root: { backgroundColor: colors.paper, zIndex: 30 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 8, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.line },
  title: { fontFamily: fonts.stamp, color: colors.lime, fontSize: 16, letterSpacing: 2 },
  closeBtn: { minHeight: 44, minWidth: 72, borderWidth: 1, borderColor: colors.line, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 },
  closeTxt: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  scroll: { flex: 1 },
  body: { padding: 14, gap: 12, paddingBottom: 28 },
  coach: { fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 17, lineHeight: 23, color: colors.ink },
  demo: { color: colors.noteInk, backgroundColor: colors.note, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 10, fontSize: 12, fontWeight: '600', lineHeight: 16 },
  warn: { color: colors.gold, fontSize: 13, lineHeight: 18 },
  notice: { borderWidth: 1, borderColor: colors.line, borderRadius: 8, padding: 10, backgroundColor: colors.paper2 },
  noticeOk: { borderColor: colors.called },
  noticeWarn: { borderColor: colors.gold },
  noticeTxt: { fontFamily: fonts.coach, fontStyle: 'italic', color: colors.ink, fontSize: 15, lineHeight: 21 },
  tickets: { color: colors.ink2, fontSize: 13, fontWeight: '600' },
  spinner: { marginVertical: 24 },
  card: { borderWidth: 1, borderColor: colors.line, borderRadius: 12, backgroundColor: colors.paper2, padding: 14, gap: 6 },
  cardOwned: { borderColor: colors.called },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  name: { fontFamily: fonts.stamp, color: colors.ink, fontSize: 20, letterSpacing: 0.6, flexShrink: 1 },
  stamp: { borderWidth: 2, borderColor: colors.called, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2, transform: [{ rotate: '-4deg' }] },
  stampTxt: { fontFamily: fonts.stamp, color: colors.called, fontSize: 11, letterSpacing: 1.2 },
  tagline: { color: colors.ink2, fontSize: 13, lineHeight: 18 },
  line: { fontFamily: fonts.coach, fontStyle: 'italic', color: colors.ink, fontSize: 15, lineHeight: 21 },
  gets: { color: colors.ink2, fontSize: 10, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', marginTop: 4 },
  feat: { color: colors.ink, fontSize: 14, lineHeight: 20 },
  hint: { color: colors.ink2, fontSize: 13, lineHeight: 18 },
  legal: { color: colors.ink2, fontSize: 12, lineHeight: 17 },
  buy: { minHeight: 52, borderRadius: 8, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14, marginTop: 6 },
  buyTxt: { fontFamily: fonts.stamp, color: colors.limeInk, fontSize: 16, letterSpacing: 0.8 },
  noPrice: { gap: 8, marginTop: 6 },
  ghost: { minHeight: 52, borderRadius: 8, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.paper2, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 },
  ghostTxt: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  rowC: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dim: { opacity: 0.5 },
  pressed: { transform: [{ scale: 0.98 }] },
  info: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 12, gap: 8 },
  infoTitle: { color: colors.ink2, fontSize: 10, fontWeight: '700', letterSpacing: 1.6 },
  infoTxt: { color: colors.ink2, fontSize: 12, lineHeight: 18 },
  links: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 16 },
  link: { minHeight: 44, justifyContent: 'center' },
  linkTxt: { color: colors.ink, fontSize: 13, fontWeight: '600', textDecorationLine: 'underline' },
  scrim: { backgroundColor: colors.scrim, alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 31 },
  sheet: { backgroundColor: colors.paper, borderRadius: 12, borderWidth: 1, borderColor: colors.line, padding: 16, gap: 12, width: '100%', maxWidth: 360 },
  sheetRow: { flexDirection: 'row', gap: 8 },
  flex1: { flex: 1 },
});
