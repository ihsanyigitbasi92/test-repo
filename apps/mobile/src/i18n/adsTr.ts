/**
 * Reklam ve rıza metinleri — Türkçe (docs/design/15; koç satırları 06 §3.2–3.3 ve §2.7.3'ten).
 * Kurallar: etiket ne olacağını söyler ("Reklam izle → X al"), reddetme düğmesi aynı boyda ve suçlamasız,
 * geri sayım yalnız demo reklamın kendi süresidir (teklifte süre baskısı yok). adsEn.ts her anahtarı karşılar.
 */
import { groupDigits } from './format';

const n = (x: number) => groupDigits(x, '.');

export const adsTr = {
  /** Akışa düşen koç satırları (state/feed.ts `uiText`). */
  feed: {
    adIncoming: 'Reklam var. Ben de istemiyorum. Maaşım buradan.',
    adConsentIntro: 'Evrak var. Hukuk departmanım yok; bu yüzden kısa tuttum. Okuyup geç.',
    adSponsorOffer: (x: number) => `Forma sponsoru teklifi var. Bir reklam izlersen altı aylık maaşının dörtte biri kadar prim: +${n(x)}. Reklam izle, reklam ol. İzlemezsen de aynı müşterimsin.`,
    adSponsorFree: (x: number) => `Forma sponsoru teklifi var. Reklamsız hakkın olduğu için reklam kısmını atlıyoruz. Prim: +${n(x)}. İster al, ister kalsın.`,
    adSponsorGranted: (x: number) => `Forma: SPONSOR. +${n(x)} hesapta. Göğsünde bir logo var artık; kimse sormadı ama duruyor.`,
    adClosedEarly: 'Yarıda bıraktın. Sayılmaz; reklamcı da saymıyor.',
    adNoFill: 'Reklam gelmedi. Bu seferlik kusur sende değil; sayacına da yazmadım.',
  },
  offer: {
    watch: (x: number) => `Reklam izle → +${n(x)} al`,
    free: (x: number) => `Reklamsız al → +${n(x)}`,
    decline: 'Kalsın',
    note: 'Bir reklam, yaklaşık 30 saniye. İzlemezsen hiçbir şey kaybetmezsin.',
    noteFree: 'Reklamsız hakkın var: reklam gösterilmez, ödül aynı.',
  },
  mock: {
    demoTag: 'DEMO REKLAM · GERÇEK DEĞİL',
    breakTitle: 'REKLAM ARASI',
    rewardedTitle: 'ÖDÜLLÜ REKLAM',
    body: 'Burada bir reklam olacaktı. Demo sürümünde yerinde bu kutu duruyor. Kutu hiçbir şey satmıyor.',
    skipIn: (sec: number) => `Geçmeye kalan: ${sec} sn`,
    skip: 'Reklamı geç',
    rewardIn: (sec: number) => `Ödüle kalan: ${sec} sn`,
    closeNoReward: 'Kapat (ödül yok)',
    rewardReady: 'Tamam. Ödül senin.',
    collect: 'Kapat ve ödülü al',
  },
  consent: {
    noticeTitle: 'Kişisel verilerin hakkında bilgilendirme',
    noticeBody: 'Motto cihazında çalışır; hesap açmaz, isim istemez. Reklam gösterdiğimizde reklam sağlayıcısı (Google AdMob) cihazının reklam kimliği ve IP adresi gibi verileri işleyebilir; bu veriler yurt dışına aktarılır. Sen ayrıca izin vermedikçe reklamlar sana göre seçilmez.',
    noticeLink: 'Aydınlatma Metni',
    noticeOk: 'Anladım',
    choiceTitle: 'İzinlerin',
    adult: '18 yaşından büyüğüm',
    adultHint: 'Kişiselleştirme izni yalnız yetişkinlerden alınır.',
    personalized: 'Kişiselleştirilmiş reklam',
    personalizedHint: 'Kapalıysa yine reklam görürsün; sana göre seçilmez.',
    foot: 'Bu izin olmadan da oyun tamamen çalışır. Tercihini "Gizlilik / reklam tercihleri" satırından her zaman değiştirebilirsin; satır mağaza ekranında ve "Bugünlük yeter" sayfasında.',
    declineHint: '"Reddet" dersen reklamlar kişiselleştirilmez. Başka hiçbir şey değişmez.',
    save: 'Kaydet',
    decline: 'Reddet',
    on: 'AÇIK',
    off: 'KAPALI',
    umpTitle: 'Reklam izni',
    umpDemo: 'DEMO · Gerçek uygulamada burada Google\'ın izin formu açılır',
    umpBody: 'Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre\'de reklam izni Google\'ın onaylı formuyla sorulur. İzin verirsen reklamlar ilgi alanına göre seçilebilir; vermezsen sınırlı reklam görürsün. Oyun iki durumda da aynı.',
    umpAllow: 'İzin ver',
    umpDeny: 'İzin verme',
    attTitle: 'Bir sonraki ekranda iOS bir izin soracak',
    attBody: '"İzin Ver" dersen reklamlar diğer uygulamalardaki etkinliğine göre seçilir. "Uygulamadan İzleme Yapmamasını İste" dersen oyun aynı, reklamlar daha az isabetli. İki seçenek de tamam.',
    attContinue: 'Devam',
  },
  privacy: {
    entry: 'Gizlilik / reklam tercihleri',
    title: 'GİZLİLİK VE REKLAM TERCİHLERİ',
    statusNonPersonal: 'Reklamlar şu an sana göre seçilmiyor.',
    statusPersonal: 'Reklamlar şu an sana göre seçilebiliyor.',
    statusPending: 'Henüz izin sorulmadı; o zamana kadar reklam da yok.',
    noAds: 'Reklamsız hakkın açık: araya reklam girmez. Ödüllü reklam teklifleri yerinde durur; izlemek tamamen sana kalmış.',
    noAdsFree: 'Reklamsız hakkın açık: araya reklam girmez, ödüller reklam izlemeden verilir.',
    minor: 'Bu cihazda kişiselleştirme kapalı ve kilitli (yaş beyanı).',
    umpButton: 'Google izin formunu aç',
    iosNote: 'iOS izleme izni telefonun Ayarlar › Gizlilik › İzleme bölümünden değişir.',
    rating: 'Reklam içerik derecesi: en çok "T" (genç). Uygunsuz bir reklam görürsen bize yaz; kaldırtırız.',
    save: 'Kaydet',
    cancel: 'Vazgeç',
  },
};

export type AdsStrings = typeof adsTr;
