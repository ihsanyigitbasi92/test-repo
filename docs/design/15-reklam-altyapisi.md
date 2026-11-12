# 15 — Reklam Altyapısı: sağlayıcı, yerleşimler, rıza, kurulum listesi

> **Belge türü:** Uygulama notu (kod: `apps/mobile/src/ads/`, testler: `apps/mobile/test/ads.test.ts`). Üstünde `00-VIZYON-ve-KARARLAR.md` (§14 > §13 > §12 > §11) ve `06-monetizasyon-ve-magaza-uyumu.md` vardır. Bu belge onları **uygular**; 06 ile 00 §14 çeliştiği yerde §14 geçerlidir (D-084, D-085, D-102–D-106). Burada alınan yeni kararlar §3'te `D-ÖNERİ-15-xx` olarak listelenir.
>
> **Bu belge hukuki görüş değildir.** KVKK, GDPR, ATT ve mağaza politikalarıyla ilgili her cümle "tasarım niyeti"dir; avukata sorulacaklar §8'dedir.

---

## 1. Özet

- İki format var: **ödüllü (rewarded)** ve **geçiş (interstitial)**. **Banner yok**; sağlayıcı arayüzünde banner metodu, ayar dosyasında banner birimi bulunmaz (testle sabit).
- Interstitial yalnızca **dönüş yerleşiminde** çıkar: oyuncu en az 6 saat aradan sonra geri gelmiş, "Kaldığımız yerden" satırı görünmüş, koç reklamı 1,5 sn önce duyurmuştur. "Bugünlük yeter", ölüm → Roast → Yeni Müşteri, karne ve karar anları reklamsızdır.
- Rewarded yalnızca **isteğe bağlı tekliftir**: bu derlemede tek açık yerleşim **Forma Sponsoru** (sıradan maaş gününde). Etiket ne verildiğini yazar: "Reklam izle → +6.000 al"; "Kalsın" aynı boyda.
- Rıza: reklam SDK'sı rıza adımından önce **başlatılmaz, yüklenmez**. Açık izin verilmedikçe her istek **kişiselleştirilmemiş**tir.
- Web, test ve Expo Go'da gerçek reklam yoktur; "DEMO REKLAM · GERÇEK DEĞİL" etiketli yer tutucu gösterilir.

## 2. Mimari

```
src/ads/
  config.ts            Tek ayar nesnesi (AD_CONFIG) + reklam birimi kimlikleri (Google test kimlikleri)
  types.ts             AdProvider arayüzü (init, preload, isReady, showRewarded, showInterstitial, consent)
  placements.ts        SAF kurallar: canShowInterstitial, canOfferRewarded, defter (AdLedger) geçişleri
  consent.ts           SAF rıza modeli: bölge, ConsentState, requestPrefs, attDue, sdkAllowed
  adService.ts         Defter + rıza + sağlayıcıyı birleştiren servis (bağımlılıklar enjekte; node'da test edilir)
  MockAdProvider.ts    Demo sağlayıcı (web / test / Expo Go)
  AdMobProvider.ts     react-native-google-mobile-ads (yalnız native; paket ilk kullanımda require edilir)
  provider.ts          web + vitest → her zaman Mock
  provider.native.ts   native → modül bağlıysa AdMob, değilse Mock
  runtime.ts           `ads` tekili (depolama, platform, hak deposu) + demo/test kancaları
  consentApi.ts        Uygulamanın geri kalanı için sabit API: getConsent / onConsentChange / requestTracking
  gameContext.ts       Motor durumu → kural bağlamı; yas sahnesi tespiti; ödülün duruma işlenmesi
  uiStore.ts, AdHost.tsx, OfferButtons.tsx   Demo reklam, rıza kartları, gizlilik sayfası, teklif düğmeleri
```

| Konu | Karar |
|---|---|
| SDK | `react-native-google-mobile-ads` **17.4.0** (06 / D-043 ile aynı). Peer: `react-native >= 0.86`, `expo >= 47`; projede RN 0.88.1 / Expo 58. Google Mobile Ads iOS 13.10, Android 25.5, UMP iOS 3.1 / Android 4.0 ile gelir; UMP (`AdsConsent`) aynı pakettedir. |
| ATT | `expo-tracking-transparency ~58.0.2` (Expo 58'in `bundledNativeModules` sürümü). |
| Expo Go | Çalışmaz (native modül). **Development build** (`expo prebuild` / EAS) gerekir. Modül yoksa `provider.native.ts` demo sağlayıcıya düşer, uygulama çökmez. |
| Web / test | `provider.ts` çözülür; AdMob paketi web paketine girmez (dışa aktarılan JS'te yalnızca `app.json` içindeki eklenti adı geçer). |
| Rıza öncesi | `AdMobProvider.lib()` paketi ilk `init` / `consent.gather` çağrısında `require` eder; ikisi de rıza kapısından sonra çağrılır. |
| Kalıcılık | `motto.ads.v1` anahtarı (AsyncStorage / localStorage): defter + rıza. Oyun kaydından ayrıdır; kayıt düşse de tavanlar ve rıza kalır. |
| Oyunla temas | `useGame.ts`: dönüş yerleşimi, maaş günü teklifi, oyun süresi sayacı, yas/ölüm bildirimi. `LifeScreen.tsx`: `<AdHost/>`, teklif düğmeleri. `Overlays.tsx`: "Bugünlük yeter" sayfasına gizlilik satırı. `ShopScreen.tsx`: gizlilik satırı. `DeathFlow.tsx` ve `ReportCard.tsx`'e **bilerek dokunulmadı** (D-007, D-085). |

**Ödülün işlenmesi.** Motorda ödül aksiyonu yok. Forma Sponsoru primi, `gameContext.ts › grantMoney` ile motor durumunun kopyası üzerinde bakiyeye eklenir (arayüzün motor durumuna yazdığı tek yer). Motor tarafına `GRANT_REWARD` aksiyonu eklenince buraya taşınmalıdır; o zamana kadar prim `yearStats.income`'a yansımaz.

## 3. Kararlar

| # | Karar | Gerekçe |
|---|---|---|
| **D-ÖNERİ-15-01** | **Interstitial: yalnızca dönüş yerleşimi (D-084 aynen).** Davranış uzmanının iki önerisinden (yalnız 25. dk Devre Arası / bir sonraki oturumun ilk gününden önce) **ikincisi** uygulanır. | D-084 bağlayıcıdır ve uzmanın "alternatif"iyle aynı yere çıkar. Devre Arası bu derlemede yok; olsa bile oturumun ortasında reklam, mağaza vaadi "Oyunun ortasında reklam yok" (D-106) ile çelişir. "Bugünlük yeter" reklamsız kalır: sağlıklı durma cezalandırılmaz. |
| **D-ÖNERİ-15-02** | **Forma Sponsoru açık, ama yapısal korumayla.** Borçlu ya da eksi bakiyedeki oyuncuya, işsize, 60+ yaşa, yas / düşük Keyif / art arda 2 negatif sonuç / near-miss gününde teklif **monte edilmez**. | Uzmanın itirazı: ekonomi bozukken teklif "oyunun yarattığı acıyı reklamla dindirme" olur. Ekonomi o rapordan sonra düzeltildi (00 son bölüm), fakat güvence ayara değil kurala bağlandı: teklif yalnız ödeme gücü olan oyuncuya gider, yani hiçbir zaman borçtan çıkış yolu olamaz. `kill.placements: ['sponsor']` ile tek satırda kapanır. |
| **D-ÖNERİ-15-03** | **Ödül biçimi:** D-085 (b) "+%25 / 6 ay" akışı yerine aynı tutarın **peşin primi** (aylık maaş × 6 × %25). | Motorda maaş çarpanı yok; peşin prim motoru değiştirmeden aynı değeri verir ve etikete tek sayı olarak yazılabilir. |
| **D-ÖNERİ-15-04** | **Reklamsız hakkı (`hasNoAds`) ve rewarded — koordinatör kararı:** varsayılan `noAdsMode: 'showAd'`. Reklamsız yalnız interstitial'ı kaldırır; rewarded teklifi aynı yerde, aynı tavanla durur, **isteyen reklamı izler**. Satın alma para ya da stat vermez (06 §2.2.2, D-038, AC-06-05). | `'grantWithoutAd'` (reklamsız ödül) kodda ve testte duruyor ama varsayılan değil; açılırsa mağaza metni (`shop.rewarded[noAdsMode]`) ve gizlilik sayfası kendiliğinden doğru cümleyi gösterir. |
| **D-ÖNERİ-15-05** | **Teklifin anı:** maaş günü olan günün satırları bittikten sonra, açık bir seçim yokken; teklif cevaplanana kadar zaman durur (bir karar kartı gibi). Oturumda en çok 1 teklif; Otomatik modda hiç. | D-066 "ticari yüzey yalnız duran zamanda" + D-085 (b) "maaş günü satırı". Akan zamanda kaybolan bir satır süre baskısı olurdu; seçim kartının yanına koymak kararı gölgelerdi. |
| **D-ÖNERİ-15-06** | **Tek katı varsayılan:** bölge ne olursa olsun, açık izin yoksa istekler kişiselleştirilmemiş. Kendi kartlarımız UMP'nin form göstermediği her yerde (TR, ABD, diğer, bilinmeyen) aynıdır. | Bölge tespiti yalnız cihaz yerel ayarına dayanır (konum izni, IP sorgusu yok) ve yanılabilir; yanılgının sonucu "daha az kişiselleştirme" olmalı. |
| **D-ÖNERİ-15-07** | **Yaş:** nötr yaş kapısı (D-104 a) bu derlemede yok. Kişiselleştirme anahtarı ancak "18 yaşından büyüğüm" kutusu işaretlenince açılır; `ads.setMinor(true)` çağrılırsa (yaş kapısı gelince) kişiselleştirme kilitlenir, `tagForUnderAgeOfConsent` açılır, ATT sorulmaz (D-102). | Yaş kapısı ayrı iş; reklam katmanı onun çıktısını almaya hazır. |
| **D-ÖNERİ-15-08** | Kapalı yerleşimler: **Ek Antrenman** (D-085 a: MVP dışı), **Taktik Değişikliği** (içerikte `tactic:true` yok), **Fizyoterapi** (motorda hazard zarı atlama yok; ayrıca uzman: önce son evre anlatısı). Tavanları ayar dosyasında ve testte hazır. | Olmayan mekaniğe reklam bağlanmaz. |

## 4. Yerleşimler ve tavanlar

Tüm sayılar `src/ads/config.ts › AD_CONFIG` içindedir.

### 4.1 Interstitial

| Kural | Değer | Ayar |
|---|---|---|
| Yerleşim | Yalnız dönüş: soğuk açılışta kayıttan devam ya da ≥ 30 dk arka plandan dönüş; "Kaldığımız yerden" → koç duyurusu → reklam | kod: `returnSlot` |
| Uzak kalma | ≥ 6 saat | `interstitial.minAwayMs` |
| Oturum | 3. oturumdan itibaren | `interstitial.minSessionCount` |
| Oyun süresi | Kurulumdan beri ≥ 10 dk | `ftue.minPlayMs` |
| Oturumda | ≤ 1 | `interstitial.perSession` |
| Yerel günde | ≤ 2 | `interstitial.perLocalDay` |
| Ara | ≥ 5 dk (kapat-aç aynı oturum sayılır: oturum aralığı 30 dk) | `interstitial.minGapMs`, `session.gapMs` |
| Duyuru | Koç satırı 1,5 sn önce | `interstitial.noticeMs` |
| Asla | Ölüm akışı, Müşteri Dosyası, karne (doğum günü), ertelenmiş ölüm ("son perde"), yas sahnesinden sonraki 3 gösterilen gün, herhangi bir kayıptan sonraki 5 dk, Keyif < 15, rıza adımı bitmeden, Reklamsız hakkı varken, dönüş yerleşimi dışındaki her çağrı | `quiet.*`, kod |

Dönüşte bekleyen bir karar kartı varsa: reklam, seçenekler ekrana gelmeden ve oyuncu hiçbir şeye dokunmadan önce gösterilir (beat kuyruğu tutulur). Seçimden sonra, gün geçişinde ya da kart açıkken reklam çağrısı yoktur; başka çağrı yeri kodda bulunmaz.

### 4.2 Rewarded

| Yerleşim | Durum | Tetik | Ödül | Tavan |
|---|---|---|---|---|
| **Forma Sponsoru** | **Açık** | Maaş günü olan gün kapandığında; çalışıyor, borçsuz, ≤ 59 yaş | Aylık maaş × 6 × %25, peşin | Yerel günde 1; iki ödül arası ≥ 2 karakter yılı; oturumda 1 teklif |
| Fizyoterapi | Kapalı | — | — | Ömürde 1 |
| Taktik Değişikliği | Kapalı | — | — | Yerel günde 2 |
| Ek Antrenman | Kapalı (D-085 a) | — | — | Karakter yılında 1 |

Genel: yerel günde ≤ 6 gösterim · iki gösterim arası ≥ 120 sn · ilk oturumda ve ilk 10 dk'da yok · ilk hayatın ilk yılında (18) yok · Otomatik modda yok · açık seçim, karne, ölüm akışında yok · yas / kayıp / düşük Keyif / negatif seri ≥ 2 / near-miss'te yok.

Defter: teklif monte edilince oturum sayacı artar; reklam **gerçekten gösterilince** günlük sayaç ve bekleme süresi işler; ödül **verilince** yerleşimin kendi tavanı işler. Reklam gelmezse hiçbir sayaç harcanmaz ve koç bunu söyler. Yarıda kapatılırsa ödül yoktur, yerleşim tavanı harcanmaz. Yüklü reklam yoksa teklif hiç monte edilmez ("reklam yok"a çıkan düğme olmaz). Cihaz saati geri alınırsa günlük sayaçlar sıfırlanmaz.

### 4.3 Karanlık desen kontrolü

Çift düğmeler aynı bileşen ve aynı stildir (teklif: Kalsın / Reklam izle; rıza: Reddet / Kaydet; UMP demosu) · anahtarlar kapalı başlar · teklifte geri sayım ve süre sınırı yok · demo reklamda sahte ya da küçük ✕ yok: süre dolana kadar düz metin sayaç, ödüllüde her an görünen "Kapat (ödül yok)" · reddetmeye koç tepki vermez · rıza yalnız bir kez sorulur, yeniden sorma yalnız aydınlatma sürümü artarsa (D-105) · reddeden oyuncu aynı oyunu oynar.

## 5. Rıza ve gizlilik

**Sıra:** rıza adımı → SDK başlatma → reklam. Rıza adımı en erken 2. oturumun dönüş yerleşiminde gelir (ilk oturumda izin sorusu yok, D-015); ATT en erken 3. oturumda, ayrı bir dönüşte. Bir dönüşte en çok bir şey gösterilir: rıza **ya da** ATT **ya da** interstitial.

| Bölge | iOS | Android |
|---|---|---|
| **Türkiye** | (1) Aydınlatma kartı [Anladım] → (2) ayrı Açık Rıza kartı: "18 yaşından büyüğüm" ve "Kişiselleştirilmiş reklam" anahtarları **kapalı**; [Reddet] [Kaydet] eşit → (3) yalnız kişiselleştirmeye izin verildiyse, 3. oturumda ATT ön-ekranı + sistem diyaloğu. İzin yok ya da ATT reddi → kişiselleştirilmemiş. | (1) ve (2) aynı. ATT yok. İzin yok → kişiselleştirilmemiş. |
| **AEA / Birleşik Krallık / İsviçre** | Google UMP formu (sertifikalı CMP, TCF) → `canRequestAds` olmadan SDK başlamaz → kişiselleştirme yalnız formda izin verildiyse → sonra ATT (aynı koşul). | UMP formu aynı. ATT yok. |
| **ABD** | UMP sorgulanır (AdMob'da ABD eyalet mesajı açıldıysa onu gösterir) → UMP form göstermezse TR ile aynı iki kart → ATT aynı koşulla. | Aynı, ATT yok. |
| **Diğer / bilinmeyen** | TR ile aynı iki kart → ATT aynı koşulla. | TR ile aynı iki kart. |

- **Her hücrede varsayılan:** rıza adımından önce SDK yok; adımdan sonra `requestNonPersonalizedAdsOnly: true`, ta ki açık izin (ve iOS'ta ATT) gelene kadar.
- **Değiştirme:** "Gizlilik / reklam tercihleri" satırı mağaza ekranının altında ve "Bugünlük yeter" sayfasında her zaman durur. AEA'da Google'ın gizlilik seçenekleri formunu (`showPrivacyOptionsForm`) açar; iOS izleme izni için telefon ayarlarına yönlendiren not gösterir.
- **Yurt dışı aktarım:** ayrı anahtar yok (D-103); aydınlatma kartında bilgi olarak yazılı.
- **Çocuk / yaş:** uygulama çocuklara yönelik değil (`tagForChildDirectedTreatment: false`), reklam içerik derecesi her istekte **T** (`maxAdContentRating`), MA yok (D-105). Bilinen reşit olmayan: `tagForUnderAgeOfConsent: true`, kişiselleştirme kilitli, ATT yok (D-102).
- **Kategori engelleme:** AdMob'da kumar/bahis, alkol, flört, siyaset gibi hassas kategoriler **SDK'dan değil AdMob konsolundan** kapatılır (§6, madde 6). `AD_CONFIG.request.blockedCategories` yalnız kontrol listesidir; kod bunu uyguladığını iddia etmez.
- **ATT metni** (`NSUserTrackingUsageDescription`): `app.json` eklentilerinde İngilizce taban, `locales/tr.json` ve `locales/en.json` ile yerelleştirilmiş.
- **Web demosu:** UMP formu ve ATT taklit edilir (`?adsRegion=EEA` ile AEA akışı görülür); tarayıcıda gerçek rıza toplanmaz, veri gönderilmez.

**Diğer modüller için sabit API** (`src/ads/consentApi.ts`, `src/ads` üzerinden de dışa açık): `getConsent()` → `{ resolved, adsPersonalized, att, trackingAllowed, isMinor, region }`, `onConsentChange(cb)`, `requestTracking()`. Uygulamada **tek** rıza adımı ve **tek** ATT istemi vardır; analitik / Meta SDK kendi istemini açmaz, `trackingAllowed` bayrağını okur.

## 6. Sahip için kurulum listesi (AdMob)

1. AdMob hesabı (şirket adına), ödeme profili ve vergi bilgisi; Türkiye'de kurulu şirket için fatura/stopaj akışını mali müşavirle netleştir.
2. İki uygulama kaydı (iOS, Android); mağaza kayıtlarına bağla. **Uygulama kimlikleri** (`ca-app-pub-…~…`) → `app.json › plugins › react-native-google-mobile-ads › androidAppId / iosAppId` (şu an Google'ın test kimlikleri).
3. Dört **reklam birimi**: iOS rewarded, iOS interstitial, Android rewarded, Android interstitial → `src/ads/config.ts › AD_UNITS.prod`; yayın derlemesinde `useTestIds: false`. Rewarded-interstitial, banner, app-open birimi **açma**.
4. **app-ads.txt:** geliştirici web sitesinin kökünde yayınla (`google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`); mağaza kaydındaki geliştirici sitesi alan adıyla aynı olmalı; AdMob'da doğrulandığını gör.
5. **Gizlilik ve mesajlaşma:** GDPR mesajı (AEA/UK/CH) oluştur ve yayınla; reklam ortakları listesini seç; isteniyorsa ABD eyalet mesajı. Mesaj yayınlanmadan UMP formu gelmez ve AEA'da reklam başlamaz.
6. **Engelleme kontrolleri:** hassas kategoriler (kumar ve bahis, alkol, flört, siyaset, ayrıca §`blockedCategories` listesi) kapalı; uygulama düzeyinde azami içerik derecesi T.
7. **Test cihazları:** geliştirme cihazlarını AdMob'a ve UMP test cihazlarına ekle; gerçek birimlerle kendi reklamına tıklama (hesap kapanma riski).
8. **iOS:** `SKAdNetworkItems` listesini Google'ın güncel listesinden tamamla (şu an yalnız Google'ın kendi kimliği var); App Privacy beyanı; ATT metinleri.
9. **Android:** Data safety beyanı (reklam kimliği, yaklaşık konum/IP); `AD_ID` izni eklentiyle gelir.
10. Mağaza beyanları: "Reklam içerir"; yaş derecesi anketi (D-107).
11. D-103 kapısı: Google'ın TR için standart sözleşme durumu avukatla netleşene kadar `AD_CONFIG.kill.regions = ['TR']` (TR'de SDK hiç başlamaz, oyun tam çalışır).

## 7. Mediation ve gelir beklentisi

- **Mediation yok.** İleride seçenek: AdMob mediation ya da AppLovin MAX (06: yalnız publisher şartıysa). `AdProvider` arayüzü bunun için yeterlidir; yeni sağlayıcı = bir sınıf + `provider.native.ts`'te bir satır. Eklenirse her ağın SDK'sı ayrı rıza/veri beyanı, kapatma süresi denetimi ve uygulama boyutu getirir.
- **eCPM:** bu belgede rakam verilmez. 06 §2.9.2'deki değerler ve 00 §14'teki gösterim/DAU sayıları **tahmindir**; Türkiye için ölçülmüş veri yoktur. Kişiselleştirilmemiş varsayılan, T derece sınırı, kategori engelleri ve düşük reklam yükü (interstitial yalnız dönüşte, rewarded tek yerleşim) geliri sektör ortalamalarının altına çeker. Gerçek sayı ancak canlı birimlerle en az 14 günlük AdMob ülke raporundan okunur.

## 8. Avukata sorulacaklar

1. KVKK: reklam SDK'sının kişiselleştirilmemiş modda işlediği veriler (IP, cihaz bilgisi, reklam kimliği) için hukuki sebep nedir; açık rıza olmadan kişiselleştirilmemiş reklam göstermek yeterli mi, yoksa reddeden kullanıcıya hiç reklam gösterilmemeli mi?
2. KVKK m.9: Google'a yurt dışı aktarım için standart sözleşme / Kurul bildirimi durumu (D-103). Netleşene kadar TR'de SDK kapalı mı kalmalı?
3. Aydınlatma metni ve açık rıza kartlarının metni, sırası ve "18 yaşından büyüğüm" beyanı yeterli mi? Beyan yerine nötr yaş kapısı zorunlu mu?
4. 16–17 yaş: açık rıza hiç alınmamalı mı (mevcut varsayım), veli rızası mı gerekir (D-102)? Ticari Reklam Yönetmeliği m.25 açısından kişiselleştirilmemiş reklam yeterli mi?
5. Rıza adımının 2. oturuma bırakılması (o ana kadar reklam SDK'sı yok) aydınlatma yükümlülüğünün zamanlaması açısından sorunsuz mu?
6. AEA dışındaki ülkelerde (ABD eyaletleri, UK, Brezilya vb.) kendi iki kartımız yeterli mi; hangi ülkeler için UMP mesajı açılmalı?
7. iOS ATT ön-ekran metni Apple 5.1.2 ve KVKK açısından uygun mu; ATT reddi halinde `requestNonPersonalizedAdsOnly` yeterli mi?
8. Reklam içerik derecesi T ile 16+ beyanı ve 7578 sayılı düzenleme arasında boşluk var mı?
9. "Reklamsız" ürününü alan oyuncunun isteğe bağlı ödüllü reklam görmeye devam etmesi, ürün adı ve mağaza metniyle birlikte aldatıcı reklam sayılır mı?
10. Demo (web) sürümünün herkese açık yayınlanması halinde çerez/depolama bildirimi gerekir mi?

## 9. Sahte olan, gerçek olan, test planı

| | Durum |
|---|---|
| Yerleşim kuralları, tavanlar, defter, rıza modeli, oturum/süre sayacı | **Gerçek**, birim testli |
| Oyuna bağlanma (dönüş yerleşimi, teklif, ödül, gizlilik satırı) | **Gerçek**, web dışa aktarımında Playwright ile oynandı |
| Reklamın kendisi (web / test / Expo Go) | **Sahte**: etiketli yer tutucu, 5 sn |
| UMP formu ve ATT (web) | **Sahte**: demo kartı; ATT web'de yok |
| `AdMobProvider` (gerçek SDK çağrıları) | Yazıldı, tip denetiminden geçiyor, **cihazda çalıştırılmadı** |
| `app.json` eklentileri | `expo config --type introspect` ile Info.plist / AndroidManifest çıktısı görüldü; **native derleme yapılmadı** |
| Reklam birimleri ve uygulama kimlikleri | Google'ın resmî **test** kimlikleri |
| "Son reklamı bildir" (06 AC-06-12), `pendingGrants` çökme telafisi (AC-06-10 ikinci yarı), uzaktan kill-switch | **Yok** |

**Otomatik:** `pnpm test` (`test/ads.test.ts`): tavanlar ve bekleme süreleri, FTUE, yas/ölüm/karne/karar yasakları, 5.000 rastgele dönüş denemesinde tavan ihlali olmaması, Reklamsız hakkı, rızasız kişiselleştirilmemiş varsayılan, AEA/UMP, ATT koşulları, reşit olmayan etiketi.

**Web demosu:** `?adsDebug=1` → `window.__mottoAds`; `?adsDebug=relaxed` bekleme kapılarını kaldırır (ilk oturum, 10 dk, 6 saat, bekleme süreleri), tavanlar, rıza adımı ve yas/ölüm/karar kuralları aynen kalır; `?adsRegion=EEA|TR|US|OTHER`. Kancalar `EXPO_PUBLIC_MOTTO_ENV=production` ile derlenen web'de ve native yayın derlemesinde yoktur.

**Cihazda yapılacak (hesap ve development build gerekir):**
1. iOS + Android development build açılıyor, test reklamları yükleniyor (rewarded + interstitial).
2. UMP hata ayıklama coğrafyası AEA: form ATT'den önce; `canRequestAds` yokken `initialize` çağrılmıyor.
3. TR yerel ayarı: iki kart, anahtarlar kapalı; reddet → istekler kişiselleştirilmemiş (AdMob istek günlüğü / Ad Inspector).
4. iOS: ATT ön-ekranı → sistem diyaloğu bir kez; reddedince tekrar sorulmuyor; TR/EN metin doğru.
5. Rewarded: sonuna kadar izle → prim; yarıda kapat → prim yok, koç satırı; uçak modu → teklif monte edilmiyor.
6. Interstitial: 3. oturum + 6 saat (cihaz saatiyle değil gerçek bekleme ya da geçici ayarla); ses, geri tuşu, arka plana atma, reklama tıklayıp dönme.
7. Reklamsız satın al → aynı oturumda interstitial yok; rewarded teklifi duruyor.
8. Uygulamayı reklam sırasında öldür → açılışta oyun kaldığı yerden, sayaçlar tutarlı.
9. Düşük bellek / yavaş ağ: reklam 4 sn'de yüklenmezse "reklam gelmedi" yolu.
