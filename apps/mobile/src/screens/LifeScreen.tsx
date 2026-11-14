/**
 * Hayat Akışı — the root screen (07 §2.2.1): TopBar · HUD · dated feed · decision zone, plus the juice layers
 * (flash, big stamp, age-up, avatar moments, session sheet) and the death → Roast Report takeover. Pure view over useGame().
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SplashScreen } from './SplashScreen';
import { Platform, StatusBar as RNStatusBar, StyleSheet, useWindowDimensions, View } from 'react-native';
import { colors } from '../theme';
import { I18nContext, makeI18n } from '../i18n';
import { useGame } from '../state/useGame';
import { TopBar } from '../components/TopBar';
import { Hud } from '../components/Hud';
import { Feed } from '../components/Feed';
import { PlayerLookContext } from '../components/Bubbles';
import { ChoiceButtons, GhostRow, PrimaryButton, zone } from '../components/ActionZone';
import { ClientFile } from '../components/ClientFile';
import { AgeUp, BigStamp, FlashLayer, SessionSheet, Shake } from '../components/Overlays';
import { DeathFlow } from '../components/DeathFlow';
import { AvatarMoment } from '../components/AvatarMoment';
import { SettingsSheet } from '../components/SettingsSheet';
import { ShopScreen } from './ShopScreen';
import { AdHost } from '../ads/AdHost';
import { AgeGate, useAgeGateDone } from '../ads/AgeGate';
import { LegalHost } from '../legal/LegalScreen';
import { ReminderAsk } from '../notifications/ReminderAsk';
import { ads } from '../ads/runtime';
import { PrivacyEntry, RewardedOfferButtons } from '../ads/OfferButtons';
import type { Speed } from '@motto/engine';
import { TutorialIntro } from '../components/TutorialIntro';
import { CoachMarkLayer } from '../components/CoachMark';
import { tutorial, useTutorial } from '../state/tutorialRuntime';
import { nextHint } from '../state/tutorial';

const STAT_KEYS = new Set(['health', 'joy', 'brain', 'charm']);
const FLOW_PHASES = new Set(['idle', 'answered']);

export function LifeScreen() {
  const { snap, game } = useGame();
  const i18n = useMemo(() => makeI18n(snap.locale), [snap.locale]);
  // Web: keep <html lang> in sync so any browser-side casing/hyphenation follows the current language.
  useEffect(() => { if (Platform.OS === 'web' && typeof document !== 'undefined') document.documentElement.lang = snap.locale; }, [snap.locale]);
  const { width } = useWindowDimensions();
  const framed = Platform.OS === 'web' && width > 460;
  const v = snap.view;
  const ready = !snap.busy;
  const phase = v?.phase;
  const s = i18n.s;
  const [splash, setSplash] = useState(true);
  const onSplashDone = useCallback(() => setSplash(false), []);
  // Neutral age gate (docs/design/15 §5.1): after the splash, before the first life; the clock waits for both.
  const ageDone = useAgeGateDone();
  // Tutorial intro (docs/design/18): after the splash and the age gate, before the first Client File, once per
  // install (replay from Settings). The game stays covered until it is closed; the clock is held while it or a hint is up.
  const tut = useTutorial();
  const introUp = !splash && ageDone && tut.loaded && tut.introOpen;
  useEffect(() => { if (!splash && ageDone && tut.loaded && !tut.introOpen) game.uncover(); }, [splash, ageDone, tut.loaded, tut.introOpen, game]);
  useEffect(() => { game.hold('tutorial', tut.introOpen || tut.active !== null); }, [tut.introOpen, tut.active, game]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const phoneRef = useRef<React.ComponentRef<typeof View>>(null);

  // Shop (06 §2.1/2: a commercial surface only on stopped time): opening it pauses the clock, closing restores the speed.
  const [shopOpen, setShopOpen] = useState(false);
  const speedBeforeShop = useRef<Speed | null>(null);
  const openShop = useCallback(() => { speedBeforeShop.current = snap.speed; game.setSpeed('pause'); setShopOpen(true); }, [game, snap.speed]);
  const closeShop = useCallback(() => { setShopOpen(false); if (speedBeforeShop.current) game.setSpeed(speedBeforeShop.current); speedBeforeShop.current = null; }, [game]);

  let decision: React.ReactNode = null;
  if (snap.stage === 'file' && ready) {
    decision = <ClientFile name={snap.candidate.name} city={snap.candidate.city} lifeNo={snap.lifeNo} fastLife={snap.fastLife}
      look={snap.draftLook} lookChanged={snap.lookChanged} lookNonce={snap.lookNonce}
      onShuffle={game.shuffle} onKeep={game.keepName} onFastLife={game.toggleFastLife} onShuffleLook={game.shuffleLook} onCycle={game.cycleLook} />;
  } else if (snap.stage === 'play' && ready && v) {
    if (phase === 'day' && v.card) decision = <ChoiceButtons card={v.card} onPick={(id) => game.answer(id)} />;
    else if (phase === 'birthday') decision = <PrimaryButton label={s.cta.oneMoreYear} onPress={game.oneMoreYear} pulse testID="one-more-year" />;
    else if (snap.offer) decision = snap.adBreak ? null : <RewardedOfferButtons offer={snap.offer} onAccept={game.acceptOffer} onDecline={game.declineOffer} />;   // opt-in rewarded offer (docs/design/15)
    else if (snap.speed === 'pause') decision = <PrimaryButton label={s.cta.nextDay} onPress={game.nextDayManual} testID="next-day" />;
  }

  // Coach-mark hints (docs/design/18 §4): each once, never two without a game beat, ≥ 30 s and ≥ 2 shown days apart;
  // hints the read intro taught are skipped; unseen hints of an Auto first life come in a later life (sprint 3).
  const hm = useRef({ epoch: 0, wasBusy: true, lastHintEpoch: -1, lastHintAt: null as number | null, lastHintDay: null as number | null, life: '', statsChanged: false, moneyChanged: false });
  useEffect(() => {
    const m = hm.current;
    if (m.wasBusy && !snap.busy) m.epoch++;
    m.wasBusy = snap.busy;
    const lifeKey = v ? `${snap.lifeNo}:${v.lifeSeed}` : '';
    if (lifeKey !== m.life) { m.life = lifeKey; m.statsChanged = false; m.moneyChanged = false; m.lastHintDay = null; }
    if (snap.floats.some((f) => STAT_KEYS.has(f.stat))) m.statsChanged = true;
    if (snap.floats.some((f) => f.stat === 'money') || snap.feed.some((f) => f.kind === 'flow')) m.moneyChanged = true;
    if (!tut.loaded || tut.active || tut.introOpen) return;
    const open = tutorial.hintsAllowed(snap.lifeNo === 1) && snap.stage === 'play' && !!v && ready && !snap.auto && !snap.booting && !splash && ageDone
      && !settingsOpen && !shopOpen && !snap.moment && !snap.ageUp && !snap.bigStamp && !snap.adBreak && !snap.offer && !snap.session && !snap.death;
    const id = nextHint({
      open, phase: v?.phase ?? null, choicesUp: phase === 'day' && !!v?.card, birthdayUp: phase === 'birthday',
      shownDays: v?.counters.shownDays ?? 0, flowing: !!v && FLOW_PHASES.has(v.phase) && snap.speed !== 'pause' && snap.progress > 0.05,
      statsChanged: m.statsChanged, moneyChanged: m.moneyChanged, epoch: m.epoch, lastHintEpoch: m.lastHintEpoch,
      now: Date.now(), lastHintAt: m.lastHintAt, lastHintDay: m.lastHintDay,
    }, tutorial.seen());
    if (id) tutorial.showHint(id);
  });
  const dismissHint = useCallback(() => {
    const m = hm.current;
    m.lastHintEpoch = m.epoch; m.lastHintAt = Date.now(); m.lastHintDay = game.getSnapshot().view?.counters.shownDays ?? null;
    tutorial.dismissHint();
  }, [game]);
  const howTo = useCallback(() => { setSettingsOpen(false); tutorial.openIntro(); }, []);
  const resetHints = useCallback(() => { hm.current.lastHintEpoch = hm.current.epoch; tutorial.resetHints(); }, []);
  const closeIntro = useCallback((how: 'done' | 'skip', page: number) => tutorial.closeIntro(how, page), []);

  // A decision just appeared: the question / report card above it must be fully on screen (UX playtest #7, #8, #13).
  const pinKey = snap.stage === 'play' && ready && v && (phase === 'day' || phase === 'birthday' || snap.offer) ? `${snap.offer ? 'offer' : phase}:${v.calendar.dayIndex}` : null;

  return (
    <I18nContext.Provider value={i18n}>
      <View style={st.stage}>
        <View ref={phoneRef} collapsable={false} style={[st.phone, framed && st.framed]}>
          {!splash && <AgeGate onLocale={game.setLocale} />}
          {introUp && <TutorialIntro replay={tut.replay} onClose={closeIntro} onLocale={game.setLocale} />}
          {splash && <SplashScreen onDone={onSplashDone} />}
          <Shake shake={snap.shake}>
            <TopBar speed={snap.speed} locale={snap.locale} showSpeed={snap.stage === 'play'} onSpeed={game.setSpeed} onLocale={game.setLocale}
              onShop={snap.stage !== 'death' && !splash ? openShop : undefined} />
            {snap.stage === 'play' && v && snap.look && (
              <Hud view={v} look={snap.look} mood={snap.playerMood} lifeNo={snap.lifeNo} floats={snap.floats} progress={snap.progress} speed={snap.speed} unread={snap.unread} onUnread={game.explainUnread} />
            )}
            <PlayerLookContext.Provider value={snap.look}><Feed items={snap.feed} typeMs={snap.typeMs} pinKey={pinKey} /></PlayerLookContext.Provider>
            <View style={zone.wrap}>
              {decision}
              {snap.stage === 'play' && (
                <GhostRow auto={snap.auto} onAuto={game.toggleAuto} onEnough={game.endSession} highlightEnough={snap.suggestEnd} onSettings={openSettings} />
              )}
              {snap.stage === 'file' && ready && (
                <GhostRow auto={snap.auto} onAuto={game.toggleAuto} onSettings={openSettings} />
              )}
            </View>
          </Shake>
          <FlashLayer flash={snap.flash} />
          <BigStamp stamp={snap.bigStamp} />
          <AgeUp ageUp={snap.ageUp} />
          {snap.moment && snap.look && <AvatarMoment key={snap.moment.id} moment={snap.moment} look={snap.look} onSkip={game.skipMoment} />}
          <SessionSheet session={snap.session} onContinue={game.closeSession} onClose={game.closeForToday} footer={<PrivacyEntry />}
            extra={<ReminderAsk sessionCount={ads.getLedger().sessionCount} />} />
          <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} onHowTo={howTo} onResetHints={resetHints} onLocale={game.setLocale} />
          <CoachMarkLayer hint={tut.active} root={phoneRef} onDismiss={dismissHint} />
          <ShopScreen open={shopOpen} onClose={closeShop} />
          <AdHost />
          {snap.stage === 'death' && snap.death && <DeathFlow death={snap.death} onNewClient={game.newClient} />}
          <LegalHost />
        </View>
      </View>
    </I18nContext.Provider>
  );
}

const st = StyleSheet.create({
  stage: { flex: 1, backgroundColor: colors.paper2, alignItems: 'center', justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 0 : Platform.OS === 'ios' ? 44 : 0 },
  phone: { flex: 1, width: '100%', maxWidth: 440, backgroundColor: colors.paper, overflow: 'hidden', position: 'relative' },
  framed: { maxHeight: 900, marginVertical: 12, borderWidth: 1, borderColor: colors.line, borderRadius: 24 },
});
