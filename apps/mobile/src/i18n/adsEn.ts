/**
 * Ad and consent copy — English, written for English (not translated line by line). Same rules as adsTr.ts:
 * a label says what happens ("Watch ad → get X"), declining is the same size and blame-free, and the only
 * countdown is the demo ad's own length (offers never carry a timer).
 */
import { groupDigits } from './format';
import type { AdsStrings } from './adsTr';

const n = (x: number) => groupDigits(x, ',');

export const adsEn: AdsStrings = {
  feed: {
    adIncoming: "Ad incoming. I don't want it either. It pays my salary.",
    adConsentIntro: "Paperwork. I don't have a legal department, so I kept it short. Read it, move on.",
    adSponsorOffer: (x: number) => `A jersey sponsor called. Watch one ad and they pay a bonus worth a quarter of six months' salary: +${n(x)}. Watch an ad, become one. Or don't; you're still my client.`,
    adSponsorFree: (x: number) => `A jersey sponsor called. You own the no-ads pass, so we skip the ad part. Bonus: +${n(x)}. Take it or leave it.`,
    adSponsorGranted: (x: number) => `Jersey: SPONSORED. +${n(x)} in your account. There's a logo on your chest now; nobody asked, it's staying.`,
    adClosedEarly: "You bailed halfway. Doesn't count; the advertiser isn't counting it either.",
    adNoFill: "No ad came through. Not your fault this time; I didn't count it against you.",
  },
  offer: {
    watch: (x: number) => `Watch ad → get +${n(x)}`,
    free: (x: number) => `Claim, no ad → +${n(x)}`,
    decline: 'No thanks',
    note: 'One ad, about 30 seconds. Skip it and you lose nothing.',
    noteFree: 'You own the no-ads pass: no ad is shown, same reward.',
  },
  mock: {
    demoTag: 'DEMO AD · NOT A REAL AD',
    breakTitle: 'AD BREAK',
    rewardedTitle: 'REWARDED AD',
    body: 'A real ad would go here. The demo has this box instead. The box is not selling anything.',
    skipIn: (sec: number) => `Skip in ${sec}s`,
    skip: 'Skip ad',
    rewardIn: (sec: number) => `Reward in ${sec}s`,
    closeNoReward: 'Close (no reward)',
    rewardReady: "Done. The reward's yours.",
    collect: 'Close and collect',
  },
  consent: {
    noticeTitle: 'About your personal data',
    noticeBody: "Motto runs on your device; no account, no name. When we show ads, the ad provider (Google AdMob) may process data such as your device's advertising ID and IP address, and that data is transferred abroad. Ads are not picked for you unless you separately allow it.",
    noticeLink: 'Privacy Notice',
    noticeOk: 'Got it',
    choiceTitle: 'Your permissions',
    adult: "I'm over 18",
    adultHint: 'Personalisation can only be allowed by an adult.',
    personalized: 'Personalised ads',
    personalizedHint: "If off, you still see ads; they just aren't picked for you.",
    foot: 'The game works fully without this. You can change it any time under "Privacy / ad preferences"; the row is on the shop screen and on the "Enough for today" sheet.',
    declineHint: '"Decline" means ads are not personalised. Nothing else changes.',
    save: 'Save',
    decline: 'Decline',
    on: 'ON',
    off: 'OFF',
    umpTitle: 'Ad consent',
    umpDemo: "DEMO · The real app shows Google's consent form here",
    umpBody: "In the European Economic Area, the UK and Switzerland, ad consent is asked through Google's certified form. Allow it and ads may be picked by interest; refuse and you get limited ads. Same game either way.",
    umpAllow: 'Consent',
    umpDeny: 'Do not consent',
    attTitle: 'iOS will ask a permission next',
    attBody: '"Allow" means ads are picked using your activity in other apps. "Ask App Not to Track" means the same game, less relevant ads. Either is fine.',
    attContinue: 'Continue',
  },
  privacy: {
    entry: 'Privacy / ad preferences',
    title: 'PRIVACY AND AD PREFERENCES',
    statusNonPersonal: 'Ads are currently not picked for you.',
    statusPersonal: 'Ads can currently be picked for you.',
    statusPending: "You haven't been asked yet; until then there are no ads either.",
    noAds: 'Your no-ads pass is active: no ad breaks, and rewards are granted without watching anything.',
    minor: 'Personalisation is off and locked on this device (age declaration).',
    umpButton: "Open Google's consent form",
    iosNote: 'The iOS tracking permission is changed in Settings › Privacy › Tracking.',
    rating: 'Ad content rating: "T" (teen) at most. If you see an ad that does not belong here, tell us and we will have it removed.',
    save: 'Save',
    cancel: 'Cancel',
  },
};
