/**
 * Hayat Akışı — the root screen (07 §2.2.1): TopBar · HUD · dated feed · decision zone, plus the juice layers
 * (flash, big stamp, age-up, avatar moments, session sheet) and the death → Roast Report takeover. Pure view over useGame().
 */
import { useEffect, useMemo } from 'react';
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

  let decision: React.ReactNode = null;
  if (snap.stage === 'file' && ready) {
    decision = <ClientFile name={snap.candidate.name} city={snap.candidate.city} lifeNo={snap.lifeNo} fastLife={snap.fastLife}
      look={snap.draftLook} lookChanged={snap.lookChanged} lookNonce={snap.lookNonce}
      onShuffle={game.shuffle} onKeep={game.keepName} onFastLife={game.toggleFastLife} onShuffleLook={game.shuffleLook} onCycle={game.cycleLook} />;
  } else if (snap.stage === 'play' && ready && v) {
    if (phase === 'day' && v.card) decision = <ChoiceButtons card={v.card} onPick={(id) => game.answer(id)} />;
    else if (phase === 'birthday') decision = <PrimaryButton label={s.cta.oneMoreYear} onPress={game.oneMoreYear} pulse testID="one-more-year" />;
    else if (snap.speed === 'pause') decision = <PrimaryButton label={s.cta.nextDay} onPress={game.nextDayManual} testID="next-day" />;
  }

  return (
    <I18nContext.Provider value={i18n}>
      <View style={st.stage}>
        <View style={[st.phone, framed && st.framed]}>
          <Shake shake={snap.shake}>
            <TopBar speed={snap.speed} locale={snap.locale} showSpeed={snap.stage === 'play'} onSpeed={game.setSpeed} onLocale={game.setLocale} />
            {snap.stage === 'play' && v && snap.look && (
              <Hud view={v} look={snap.look} mood={snap.playerMood} lifeNo={snap.lifeNo} floats={snap.floats} progress={snap.progress} speed={snap.speed} unread={snap.unread} />
            )}
            <PlayerLookContext.Provider value={snap.look}><Feed items={snap.feed} typeMs={snap.typeMs} /></PlayerLookContext.Provider>
            <View style={zone.wrap}>
              {decision}
              {snap.stage === 'play' && (
                <GhostRow auto={snap.auto} onAuto={game.toggleAuto} onEnough={game.endSession} highlightEnough={snap.suggestEnd} />
              )}
              {snap.stage === 'file' && ready && (
                <GhostRow auto={snap.auto} onAuto={game.toggleAuto} />
              )}
            </View>
          </Shake>
          <FlashLayer flash={snap.flash} />
          <BigStamp stamp={snap.bigStamp} />
          <AgeUp ageUp={snap.ageUp} />
          {snap.moment && snap.look && <AvatarMoment key={snap.moment.id} moment={snap.moment} look={snap.look} onSkip={game.skipMoment} />}
          <SessionSheet session={snap.session} onContinue={game.closeSession} />
          {snap.stage === 'death' && snap.death && <DeathFlow death={snap.death} onNewClient={game.newClient} />}
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
