/**
 * Reklam katmanının TEK ayar dosyası (docs/design/15-reklam-altyapisi.md). Her sayı burada; placements.ts saf
 * fonksiyonları bu nesneyi parametre olarak alır (testler kendi kopyasını verir).
 *
 * Kaynak kararlar: D-007 (ölümde reklam yok), D-084 (interstitial yalnız dönüş yerleşimi), D-085 (rewarded yeniden),
 * D-102..D-105 (rıza / reşit olmayan / T derecesi), D-106 ("oyunun ortasında reklam yok"), D-115 (kayıp sonrası 5 dk).
 * Banner YOK: bu dosyada banner birimi tanımlanmaz, sağlayıcı arayüzünde banner metodu yoktur.
 */
const MIN = 60_000;
const HOUR = 60 * MIN;

export type PlacementId = 'sponsor' | 'physio' | 'tactic' | 'extraPractice';

export interface RewardedPlacementConfig {
  /** false → teklif hiç monte edilmez (tasarımda var, bu derlemede kapalı). */
  enabled: boolean;
  /** Yerel takvim gününde en çok kaç ödül (null = yalnız global tavan). */
  perLocalDay: number | null;
  /** Bir hayatta (lifeId) en çok kaç ödül. */
  perLife: number | null;
  /** İki ödül arasında en az kaç karakter yılı. */
  minCharYearsGap: number | null;
  /** Bu yaştan sonra teklif yok. */
  maxAge: number | null;
  /** Çalışıyor ve maaşı > 0 olmalı. */
  requiresJob: boolean;
  /** Borçluyken / eksi bakiyede teklif yok (oyunun yarattığı sıkıntı reklamla dindirilmez). */
  blockInDebt: boolean;
  /** Tetik: o gün maaş günü olmalı (D-085 b). */
  requiresPayday: boolean;
}

export const AD_CONFIG = {
  /** Ana şalter. false → hiçbir reklam yüzeyi yok, oyun tam çalışır. */
  enabled: true,
  /** Uzaktan/elle kapatma: yalnız daraltır (D-105). `regions`: bu bölgelerde reklam SDK'sı hiç açılmaz (D-103 kapısı). */
  kill: { all: false, interstitial: false, rewarded: false, placements: [] as string[], regions: [] as string[] },

  /** FTUE: ilk oturumda ve kurulumdan beri ilk 10 dk oyun süresinde HİÇBİR reklam yüzeyi (D-039, D-ÖNERİ-06-04). */
  ftue: { minSessionCount: 2, minPlayMs: 10 * MIN, /** ilk hayatta bu yaştan önce teklif yok (elle yazılmış ilk yıl) */ firstLifeMinAge: 19 },

  /** Sessiz bölgeler: yas / kayıp / düşük Keyif / negatif seri (06 §2.1 ilke 3, D-052, D-115, davranış raporu d.2). */
  quiet: {
    /** Yas sahnesinden sonra bu kadar gösterilen gün hiçbir ticari yüzey yok. */
    griefShownDays: 3,
    /** Yas sahnesi ya da ölümden sonra gerçek zamanla bu kadar süre hiçbir ticari yüzey yok. */
    afterLossMs: 5 * MIN,
    /** Keyif bu değerin altındaysa (bp) hiçbir ticari yüzey yok. */
    lowJoyBp: 1500,
    /** Art arda negatif sonuç bu sayıya ulaştıysa rewarded teklifi yok. */
    negStreak: 2,
  },

  /** Oturum: uygulama bu kadar süre kapalı/arka planda kaldıysa yeni oturum sayılır. */
  session: { gapMs: 30 * MIN },

  /** Interstitial — D-084: yalnız dönüş yerleşimi; "Bugünlük yeter", ölüm, karne, karar anı reklamsız. */
  interstitial: {
    minSessionCount: 3,
    /** Uygulamadan en az bu kadar uzak kalındıysa (dönüş). */
    minAwayMs: 6 * HOUR,
    perLocalDay: 2,
    perSession: 1,
    /** İki interstitial arası gerçek zaman (kapat-aç ile ikinci reklam yok). */
    minGapMs: 5 * MIN,
    /** Reklamdan önce koç duyuru satırının ekranda kaldığı süre (Google "beklenmedik tam ekran" kuralı). */
    noticeMs: 1500,
  },

  /** Rewarded — D-039 tavanları + D-085. */
  rewarded: {
    perLocalDay: 6,
    cooldownMs: 120_000,
    /** Bir oturumda monte edilen teklif sayısı (reddedilen teklif aynı oturumda geri gelmez). */
    offersPerSession: 1,
    /**
     * Reklamsız hakkı (hasNoAds) olan oyuncu: 'grantWithoutAd' → aynı teklif, aynı tavan, reklam gösterilmeden ödül.
     * 'showAd' → 06 §2.2.2'nin ilk hâli ("isterse izler"). Karar ve gerekçe: 15 §3.4.
     */
    noAdsMode: 'grantWithoutAd' as 'grantWithoutAd' | 'showAd',
    /** Reklam yüklenmesi için en çok bekleme (06 §2.3.3). */
    loadTimeoutMs: 4000,
    placements: {
      /** R2 Forma Sponsoru (D-085 b): sıradan maaş gününde; ödül = 6 aylık maaşın %25'i, peşin prim. */
      sponsor: { enabled: true, perLocalDay: 1, perLife: null, minCharYearsGap: 2, maxAge: 59, requiresJob: true, blockInDebt: true, requiresPayday: true },
      /** R4 Fizyoterapi: motor desteği (hazard zarı atlama) yok → kapalı; tavanları tasarımdaki gibi. */
      physio: { enabled: false, perLocalDay: null, perLife: 1, minCharYearsGap: null, maxAge: null, requiresJob: false, blockInDebt: false, requiresPayday: false },
      /** R3 Taktik Değişikliği: içerikte `tactic:true` seçenek yok → kapalı. */
      tactic: { enabled: false, perLocalDay: 2, perLife: null, minCharYearsGap: null, maxAge: null, requiresJob: false, blockInDebt: false, requiresPayday: false },
      /** R1 Ek Antrenman: D-085 (a) ile MVP'den çıktı (kayıp kovalama) → kapalı. */
      extraPractice: { enabled: false, perLocalDay: null, perLife: null, minCharYearsGap: 1, maxAge: null, requiresJob: false, blockInDebt: false, requiresPayday: false },
    } satisfies Record<PlacementId, RewardedPlacementConfig>,
    /** Forma Sponsoru ödülü: aylık maaş × months × pct / 100. */
    sponsorReward: { pct: 25, months: 6 },
  },

  /** Rıza akışı (D-104, D-105). */
  consent: {
    /** Aydınlatma metni sürümü; artarsa (yılda ≤ 1) kartlar bir kez daha gösterilir. */
    noticeVersion: 1,
    /** Kartlar en erken bu oturumda (ilk oturumda izin sorusu yok, D-015). */
    minSessionCount: 2,
    /** iOS ATT ön-ekranı en erken bu oturumda ve yalnız kişiselleştirme izni verildiyse. */
    attMinSessionCount: 3,
    /** TODO(sahip): yayın öncesi gerçek adres. */
    privacyUrl: 'https://example.com/motto/gizlilik',
  },

  /** SDK istek ayarı (D-037/D-105/D-107): tek değer T; çocuklara yönelik değil. */
  request: {
    maxAdContentRating: 'T' as const,
    tagForChildDirectedTreatment: false,
    /**
     * AdMob'da SDK'dan kategori engellenemez; bu liste AdMob konsolu › Engelleme kontrolleri için kontrol
     * listesidir (15 §6) ve demo/test çıktılarında gösterilir.
     */
    blockedCategories: ['gambling_betting', 'alcohol', 'dating', 'politics', 'sexual_reproductive_health', 'get_rich_quick', 'cryptocurrency'] as const,
  },

  /** Demo (web / test) reklamı. */
  mock: { interstitialSkipMs: 5000, rewardedMs: 5000 },
};

export type AdConfig = typeof AD_CONFIG;

/**
 * Reklam birimi kimlikleri. Şu an Google'ın RESMÎ TEST kimlikleri (gerçek gelir üretmez, hesap riski yoktur).
 * Uygulama kimlikleri app.json › plugins › react-native-google-mobile-ads içinde (yine test kimlikleri).
 * TODO(sahip): AdMob'da birimler açılınca `prod` alanlarını doldur; `useTestIds` yalnız yayın derlemesinde false olur.
 */
export const AD_UNITS = {
  useTestIds: true,
  test: {
    android: { rewarded: 'ca-app-pub-3940256099942544/5224354917', interstitial: 'ca-app-pub-3940256099942544/1033173712' },
    ios: { rewarded: 'ca-app-pub-3940256099942544/1712485313', interstitial: 'ca-app-pub-3940256099942544/4411468910' },
  },
  prod: {
    android: { rewarded: '', interstitial: '' },
    ios: { rewarded: '', interstitial: '' },
  },
} as const;

export function adUnitId(platform: 'ios' | 'android', format: 'rewarded' | 'interstitial'): string {
  const prod = AD_UNITS.prod[platform][format];
  return AD_UNITS.useTestIds || !prod ? AD_UNITS.test[platform][format] : prod;
}
