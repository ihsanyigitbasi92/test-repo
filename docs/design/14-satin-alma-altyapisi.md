# 14 — Satın Alma Altyapısı: Mağaza Ekranı, Entitlement Deposu, IapProvider, "Reklamsız" Paketi

> **Belge türü:** Uygulama notu + sahip için kurulum kılavuzu. Üstünde `00-VIZYON-ve-KARARLAR.md` ve `06-monetizasyon-ve-magaza-uyumu.md` vardır; bu belge 06'yı **uygular**, 06'dan saptığı yerleri §8'de `D-ÖNERİ-14-xx` olarak listeler.
> **Sürüm:** v1.0 · 2026-11-12 · Kod: `apps/mobile/src/monetization/`, `apps/mobile/src/screens/ShopScreen.tsx`
> **Tek cümle:** Mağaza ekranı, kalıcı hak deposu ve mağaza soyutlaması çalışıyor ve testli; gerçek para akışı için eksik olan tek şey mağaza hesapları, ürün kayıtları ve iki anahtar — hepsi `app.json`'a yapıştırılır.
> **Hukuki uyarı:** Bu belge hukuki görüş değildir. §7'deki her madde avukat/mali müşavir onayı bekler; ekrandaki hukuki metinler **taslaktır**.

---

## 1. Ne var, ne yok

| Parça | Durum |
|---|---|
| Ürün kataloğu (`catalog.ts`) | Hazır. 4 SKU; abonelik tipi yok, rastgelelik tip düzeyinde `false`, "satılmayanlar" negatif testi var. |
| Kalıcı hak deposu (`entitlements.ts`) | Hazır, testli. AsyncStorage anahtarı `motto.entitlements.v1`; oyun kaydından ayrı (kayıt düşse satın alma düşmez). |
| Satın alma / geri yükleme / uzlaşma (`purchases.ts`) | Hazır, testli (mock mağaza + sahte RevenueCat SDK ile). |
| Mock mağaza (`MockIapProvider`) | Hazır. Web export'ta ve anahtarsız **geliştirme** build'inde çalışır; ekranda "Deneme mağazası" bandı çıkar. |
| Gerçek mağaza (`RevenueCatIapProvider`) | Kod hazır, **gerçek cihazda hiç çalıştırılmadı** (mağaza hesabı yok). Sahte SDK ile birim testli. |
| Mağaza ekranı (`ShopScreen`) | Hazır, TR + EN, 390×844'te Playwright ile doğrulandı. Girişi üst çubuktaki çanta düğmesi. |
| Reklam katmanıyla bağ | `hasNoAds()` ve `onEntitlementsChange()` dışa açık; reklam katmanı bunları okur. |
| Bilet (Antrenman Bileti) | Defter ve "bir kez kredi" mantığı hazır ve testli; **satışta değil**, reklam teklif kartına bağlanmadı. |
| HMAC'li önbellek (06 §2.6.2) | **Yok.** Önbellek düz JSON. Bkz. §2.5. |
| Sunucu tarafı makbuz doğrulama | **Yok ve olamaz:** backend yok. Native'de doğrulamayı RevenueCat'in sunucusu yapar. Bkz. §2.4. |
| 2. ölüm sonrası Torpil bilgi kartı (06 §2.2.2 c) | **Yok.** Mağaza yalnızca oyuncu açınca görünür. |

## 2. Mimari

```
ShopScreen ──► PurchaseController (purchases.ts) ──► IapProvider (iap.ts)
                      │                                 ├─ MockIapProvider        web / dev / test
                      ▼                                 ├─ RevenueCatIapProvider  iOS + Android (iapRevenueCat.ts)
              EntitlementStore (entitlements.ts)        └─ DisabledIapProvider    anahtarsız release build
                      │
                      ├─► hasNoAds() / onEntitlementsChange()  ──► reklam katmanı (src/ads)
                      └─► AsyncStorage "motto.entitlements.v1"
```

### 2.1 Dosyalar

| Dosya | İş |
|---|---|
| `monetization/catalog.ts` | SKU'lar, tür, verdiği özellikler (`Feature`), faz, demo fiyatı, `NEVER_SOLD`. Saf TS. |
| `monetization/config.ts` | `app.json → expo.extra.monetization` okur; `SHIPPED_FEATURES`, `ON_SALE`, `DEMO_ON_SALE`, `BUILD_PHASE`. |
| `monetization/entitlements.ts` | Kalıcı depo + bilet defteri + `useEntitlements()` + reklam katmanı sözleşmesi. |
| `monetization/iap.ts` | `IapProvider` arayüzü, `MockIapProvider`, `DisabledIapProvider`. |
| `monetization/iapRevenueCat.ts` | RevenueCat sağlayıcısı. SDK **enjekte edilir**; dosyada yalnızca tip import'u var. |
| `monetization/provider.ts` / `provider.native.ts` | Platform dosyaları: web/vitest mock'u, native RevenueCat'i seçer. Native modül yalnızca `provider.native.ts` içinde, `require` + `try/catch` ile yüklenir. |
| `monetization/purchases.ts` | `buy` / `restore` / `sync` kuralları; `shop()` tekil nesnesi, `useShop()`. |
| `screens/ShopScreen.tsx`, `components/ShopButton.tsx` | Arayüz. |
| `i18n/shopTr.ts`, `i18n/shopEn.ts` | Metinler (EN ayrı yazıldı). |
| `test/monetization.test.ts` | 34 test. |

### 2.2 Kurallar (kodda ve testte)

1. **Önce diske, sonra `finish`.** Hak diske yazılmadan mağaza işlemi kapatılmaz (06 §2.6.3).
2. **Yalnızca `ok` hak verir.** `pending` (Ask to Buy, Play PENDING), `cancelled`, `failed` hiçbir şey vermez; diskte iz bırakmaz. Bekleyen ödeme mağaza onaylayınca bir sonraki `sync()`'te gelir.
3. **Reklamsız iki yoldan:** `no_ads` **veya** `torpil` sahibi için `hasNoAds() === true`. Torpil sahibine Reklamsız kartı "Torpil ile sende" der; ikinci kez para alınmaz (`buy` mağazaya gitmeden döner).
4. **Tüketilebilir bir kez kredilenir.** Anahtar mağaza işlem kimliğidir; aynı işlem yeniden gelirse yalnızca kapatılır. Bu kurulumdan **önce** alınmış bir bilet işlemi (yeniden kurulum, başka cihaz) kredilenmez — "biletler bu cihazda saklanır".
5. **İade = sessiz kapanış.** Mağaza **erişilebilir ve taze** bir cevapta hakkı artık listelemiyorsa hak kapanır. Çevrimdışıyken ya da bayat cevapta **hiçbir hak kapanmaz**; önbellek süresiz geçerlidir (06 §2.6.1 kural 3).
6. **Tek seferde tek mağaza işlemi.** Satın alma sürerken ikinci satın alma/geri yükleme başlamaz.
7. **Release build'de mock yok.** Anahtarlar `PLACEHOLDER` iken native release build `DisabledIapProvider` kullanır: hiçbir şey satılmaz, hiçbir hak verilmez. Mock yalnızca web'de ve `__DEV__` build'de.

### 2.3 Neden RevenueCat (`react-native-purchases` 11.0.2)

D-043 zaten "RevenueCat birincil, `expo-iap` yedek" diyor; bu belge o kararı uyguladı ve yeniden tarttı:

| | `react-native-purchases` 11.x | `expo-iap` 6.4.x | `react-native-iap` 17.x |
|---|---|---|---|
| Makbuz doğrulama | RevenueCat sunucusunda (bizim backend'imiz olmadan) | Yalnızca cihazda (StoreKit 2 JWS / Play imzası) | Yalnızca cihazda |
| İade/iptal bilgisi | `CustomerInfo` ile gelir | Kendimiz sorgularız; Play'de Voided Purchases API backend ister | aynı |
| `finish` / `acknowledge` / `consume` | SDK yapar | Biz yaparız (3 gün içinde acknowledge yoksa Play otomatik iade eder) | Biz yaparız |
| Expo 58 dev build | Autolinking; **config plugin gerekmez** (pakette `app.plugin.js` yok) | Config plugin var | `react-native-nitro-modules` eş bağımlılığı ister |
| Maliyet / bağımlılık | Aylık 2.500 $ izlenen gelirin üstünde %1; üçüncü taraf veri işleyen | Ücretsiz; üçüncü taraf yok | Ücretsiz |

**Seçim: RevenueCat.** Backend'i olmayan bir oyunda sunucu tarafı doğrulamayı ve iade sinyalini bedavaya yakın veren tek seçenek. Bedeli: bir veri işleyen daha (anonim uygulama kullanıcı kimliği + satın alma kayıtları ABD'ye gider — §7 madde 6) ve gelir payı. `IapProvider` arayüzü dar tutuldu; `expo-iap` yedeği aynı arayüzün arkasına ayrı bir dosya olarak eklenebilir (yazılmadı).

Paket `package.json`'a eklendi. `app.json`'a **plugin eklenmedi** (gerekmiyor). Expo Go'da native modül bulunmaz; kod bunu yakalar ve mağazayı "ulaşılamıyor" gösterir. Gerçek satın alma yalnızca dev build / EAS build'de denenebilir.

### 2.4 "Makbuz doğrulama" hakkında dürüst beyan

- Kendi sunucumuz yok; **kendi başımıza hiçbir makbuzu doğrulayamayız.**
- Native'de doğrulamayı RevenueCat'in sunucusu yapar; cihazdaki depo onun cevabının **önbelleğidir**.
- Önbellek düz JSON'dur. Root'lu/jailbreak'li bir cihazda elle düzenlenerek `no_ads` açılabilir. Kayıp, o kişinin zaten ödemeyeceği bir üründür (06 §2.6.6 ile aynı kabul). Bir sonraki çevrimiçi uzlaşmada mağaza "yok" derse hak kapanır.
- Web export'taki mock mağaza gerçek bir şey satmaz; web sürümü demo içindir, halka açık ürün olarak yayımlanacaksa mock kapatılmalıdır.

### 2.5 06'dan bilinçli eksikler

- **HMAC + SecureStore önbelleği (06 §2.6.2) yazılmadı.** `expo-secure-store` ve `expo-crypto` bağımlılığı ister; backend'siz ortamda yalnızca "biraz daha zor" yapar. Yayın öncesi sertleştirme işi olarak duruyor.
- **Uzlaşma sıklık sınırı (24 saatte ≤ 4) ve `AppState → active` tetiği yok.** `sync()` açılışta ve mağaza güncellemesinde çalışır.
- **"Bekleyen ödeme" satırı** Ayarlar'da yok; yalnızca satın alma anındaki bildirim var.

## 3. SKU tablosu

| SKU (`productId`) | Tür | Verdiği | Demo fiyatı (₺ / $) | Faz | Bu build'de |
|---|---|---|---|---|---|
| `no_ads` — **Reklamsız** | non-consumable | Geçiş (interstitial) reklamları kapalı. Ödüllü teklifler: reklam katmanının moduna göre (§4). | 89,99 / 2,99 **(öneri, §8)** | MVP | **Satışta** |
| `torpil` — **Torpil** | non-consumable | `no_ads`'in verdiği her şey + sınırsız defter arşivi, 3 kayıt yeri, 6 karne teması, 4 mürekkep, defter dışa aktarımı, Kader, ek kişilik (06 §2.2.1) | 199,99 / 6,99 | MVP | Gerçek mağazada **kapalı**, demo mağazada açık (aşağıya bak) |
| `tickets_5` — Antrenman Bileti ×5 | consumable | 5 bilet (reklam yerine; tavan açmaz; Fizyoterapi'de geçmez) | 29,99 / 0,99 | Soft launch | Kapalı |
| `season_2701` — Sezon Paketi 27-1 | non-consumable | 12 kamp, 40 olay, 1 kişilik, 2 karne teması | 119,99 / 3,99 | 1.0 | Kapalı |

`persona_<ad>` (06'da "1.0 sonrası") somut kimliği olmadığı için kataloğa konmadı.

**Fiyat nereden gelir?** Gerçek mağazada ekrandaki fiyat **yalnızca** mağazanın döndürdüğü `priceString`'dir; mağaza fiyat döndürmezse kart "Fiyat mağazadan gelmedi" der ve satın alma düğmesi çıkmaz. Tablodaki rakamlar yalnızca mock mağazayı besler ve App Store Connect / Play Console'a elle girilecek liste fiyatlarıdır.

**Torpil neden gerçek mağazada kapalı?** 06 §2.2.2 "kart yalnızca o build'de gerçekten açılan ögeleri sayar" der. Bu build'de Torpil'e özgü hiçbir özellik (arşiv, kayıt yeri, tema…) yok; açık olsaydı Reklamsız'la aynı şeyi daha pahalıya satardı. `config.ts → ON_SALE.torpil = false`. Torpil'e özgü ilk özellik çıktığında: özelliği `SHIPPED_FEATURES`'a ekle, `ON_SALE.torpil = true` yap (test bu ikisinin birlikte değişmesini zorlar).

## 4. Mağaza ekranı ve uyum

| Gereklilik | Ekranda |
|---|---|
| Fiyat, para birimi ve vergi | Mağazanın `priceString`'i aynen. Para birimi TRY ise "KDV dahil", değilse "vergiler mağazanın gösterdiği gibi" (ABD'de satış vergisi fiyata dahil **değildir**; 06 §3.1'deki EN "tax included" her ülkede doğru olmaz — §8). |
| Ön bilgilendirme | "Satın almadan önce" bloğu: sağlayıcı (D2P Technology), ödemeyi kimin aldığı, toplam bedelin onay ekranındaki tutar olduğu, anında teslim ve cayma hakkı istisnası, iade yolu, hesaba bağlılık. **Metin taslak — §7.** |
| Geri yükleme (Apple 3.1.1) | "Satın alımları geri yükle" her zaman görünür, katlanmamış; Android'de de aynı yerde. |
| Sahiplik | Kartta "SENDE" damgası; satın alma düğmesi kalkar. |
| Çekirdek oyun kilitli değil | Hiçbir ürünün `Feature` listesinde stat/para/sağlık yok (katalog testi); ekranda açık cümle (ödüllü teklif moduna göre iki sürümü var, aşağıya bak). Mağaza kapalı/ulaşılamazken oyun aynen oynanır. |
| Rastgelelik / kumar | Yok; tip düzeyinde `randomness: false`. Sanal para yok. |
| Küçükler | "18 yaşından küçüksen velinin izni gerekir" + veliler için mağaza kısıtlaması notu. Yaş doğrulaması **yapılmaz**. |
| Karanlık desen yok (06 §6.4) | Geri sayım, stok, üstü çizili fiyat, "en popüler", önceden seçili ürün, utandıran ret yok; iptalde koç susar. Metin testi baskı sözcüklerini ve koddaki fiyatı reddeder. |
| Duran zaman (06 §2.1/2) | Mağaza açılınca oyun hızı "duraklat"a alınır, kapanınca eski hıza döner. Ölüm akışında mağaza düğmesi yoktur. |
| Dokunma hedefi | Tüm düğmeler ≥ 44 pt (ölçüldü: kapat 72×44, satın al 332×52, geri yükle 362×52, linkler ≥ 44 yüksek). |
| Koşullar / Gizlilik linkleri | Var ama URL'ler **yer tutucu**; yer tutucuyken dokunmak hiçbir şey açmaz. Yayın engelidir (§5 D). |

**Reklam katmanı sözleşmesi ve bir çelişki:** `hasNoAds()` "zorla gösterilen reklamlar kapalı" demektir. Ödüllü tekliflerde sahibin ne göreceğine reklam katmanı karar verir (`src/ads/config.ts → rewarded.noAdsMode`); mağaza kartı o ayarı okur ve hangi mod açıksa onu yazar, böylece kart build'in yapmadığı bir şeyi söylemez. Şu an reklam katmanı `grantWithoutAd` seçmiş: sahip, ödüllü teklifin ödülünü **reklam izlemeden** alır (aynı teklif, aynı tavan). Bu, 06 §2.2.2 / D-038'in "rewarded Torpil'de de yerinde kalır; satın alma stat/para vermez" hükmünden sapar: ödüllerin bir kısmı paradır (Forma Sponsoru). Kart bu modda "Yeni güç satmaz: ödüller ve sınırlar herkesle aynı" der; "stat, para vermez" **demez**. Hangi modun kalacağı ürün kararıdır (§8 D-ÖNERİ-14-07) ve Apple/Reklam Kurulu açısından "pay-to-skip" olarak avukata da sorulmalıdır.

## 5. Sahibin yapacakları (kurulum listesi)

Sıra önemlidir. "Yapıştır" denen her şey `apps/mobile/app.json → expo.extra.monetization` altındadır.

**A. Hesaplar, vergi, banka**
1. Apple Developer Program (şirket hesabı, D-U-N-S) ve Google Play Console (kuruluş hesabı).
2. App Store Connect › Business: **Paid Apps Agreement** imzala; banka ve vergi formlarını doldur. İmzalanmadan IAP ürünleri sandbox'ta bile dönmez.
3. Play Console › Payments profile: ödeme profili, banka, vergi bilgisi.
4. Apple **Small Business Program** başvurusu; Google %15 kademesi kaydı (06 §2.8).
5. Mali müşavirle: KDV, dijital hizmet vergisi, mağaza kesintisinin faturalanması, yurt dışı satışın niteliği (§7 madde 7).

**B. Uygulama kimliği**
6. `app.json`'a `ios.bundleIdentifier` ve `android.package` ekle (şu an yok). Ürün kimlikleri bu kimliğe bağlanır.

**C. Ürünler**
7. App Store Connect › In-App Purchases: `no_ads` için **Non-Consumable** ürün oluştur. Önerilen kimlik `com.d2ptechnology.motto.no_ads`. Görünen ad TR "Reklamsız" / EN "No Ads"; açıklamada "geçiş reklamı yok" yaz ("reklamsız" tek başına ödüllü reklamları da kapsıyor gibi okunur — 06 §3.6). Türkiye fiyatını **elle** gir; inceleme için ekran görüntüsü ekle. **Family Sharing kapalı** (06 §4).
8. Play Console › Monetize › In-app products: `no_ads` (tek seferlik ürün), aynı ₺ fiyatı, etkinleştir.
9. Torpil, bilet ve sezon ürünlerini **şimdi oluşturma**; satışa açılacakları sürümde oluştur (mağazada var ama uygulamada yok ürün inceleme sorusu doğurur).

**D. RevenueCat**
10. Proje aç; iOS ve Android uygulamalarını ekle (App Store Connect In-App Purchase anahtarı `.p8`; Play için servis hesabı JSON'u).
11. Ürünleri içe aktar. **Entitlement** oluştur, kimliği SKU ile **aynı** olsun: `no_ads` (sonra `torpil`, `season_2701`); ilgili mağaza ürünlerini bağla. Kod hem bu entitlement'ları hem tek seferlik işlem listesini okur.
12. Android'de `no_ads` ürününün RevenueCat'te **tüketilemez** olarak işaretlendiğini doğrula; aksi hâlde tüketilip yeniden satın alınabilir olabilir. **(RevenueCat belgelerinden teyit edilmeli; denenmedi.)**
13. Restore davranışı: "Transfer to new App User ID" (06 §2.6.3).
14. Yapıştır: `revenueCat.iosApiKey` (`appl_…`), `revenueCat.androidApiKey` (`goog_…`). Bunlar **public SDK key**'dir; gizli API anahtarı uygulamaya asla girmez.
15. Yapıştır: `productIds.ios.no_ads`, `productIds.android.no_ads` (mağazada oluşturduğun kimlikler; `PLACEHOLDER_` önekini sil).
16. Yapıştır: `legal.termsUrl`, `legal.privacyUrl` (yayımlanmış sayfalar). Gizlilik metninde RevenueCat ve reklam SDK'ları sayılmalı.

**E. Mağaza beyanları**
17. App Privacy / Data safety: "Purchases" (satın alma geçmişi) ve RevenueCat'in topladığı tanımlayıcılar.
18. Yaş derecelendirme anketlerinde "uygulama içi satın alma: var"; Play'de "rastgele öğe satın alma: yok".
19. Gradle çıktısında Play Billing Library sürümü ≥ 8 mi (06 §2.6.5) — CI kapısı henüz kurulmadı.

## 6. Test planı

### 6.1 Otomatik (bugün koşuyor)

`apps/mobile`: `pnpm test` → `test/monetization.test.ts`, 34 test: kalıcılık ve yeniden başlatma; `no_ads` ile `torpil`'in ikisinin de reklamı kapatması; iptal / hata / bekleyen satın almanın hak bırakmaması; bekleyen ödemenin onaydan sonra gelmesi; geri yükleme (yeni cihaz, boş hesap, çevrimdışı); "zaten sende"de ikinci tahsilat olmaması; iade ile kapanma ve bayat cevabın kapatamaması; biletin bir kez kredilenmesi (çökme senaryoları, eski işlem, çift kimlik); katalog negatif testleri; metinlerde fiyat ve baskı sözcüğü olmaması; RevenueCat hata kodu eşlemesi (sahte SDK).

Web: Playwright ile 390×844'te mağaza aç → iptal (iz yok) → hata (bildirim, hak yok) → onay ("SENDE") → sayfayı yenile (hak duruyor) → önbelleği sil, yeniden aç (mağaza hesabından geri geldi) → EN.

### 6.2 Elle — mağaza hesapları açılınca (hiçbiri yapılmadı)

| # | Senaryo | iOS (Sandbox / TestFlight) | Android (lisans test kullanıcısı, internal track) |
|---|---|---|---|
| 1 | Fiyat TR mağaza hesabında ₺ ve KDV dahil, ABD hesabında $ geliyor | ☐ | ☐ |
| 2 | Satın al → "SENDE"; uygulamayı öldür-aç → duruyor; reklam katmanı interstitial göstermiyor | ☐ | ☐ |
| 3 | Mağaza sayfasında iptal → bildirim yok, hak yok | ☐ | ☐ |
| 4 | Uçak modunda satın al → hata bildirimi; hak yok | ☐ | ☐ |
| 5 | Sil-yeniden kur → "Geri yükle" → hak geliyor | ☐ | ☐ |
| 6 | Başka mağaza hesabıyla "Geri yükle" → "bulunamadı" | ☐ | ☐ |
| 7 | Bekleyen ödeme: Ask to Buy / Play "yavaş test kartı" → önce hak yok, onaydan sonra geliyor | ☐ | ☐ |
| 8 | İade (Sandbox'ta iade / Play Console'dan iade) → sonraki açılışta hak kapanıyor | ☐ | ☐ |
| 9 | Zaten sahipken yeniden satın alma → ikinci tahsilat yok | ☐ | ☐ |
| 10 | Satın almalar kısıtlıyken (Ekran Süresi / ebeveyn denetimi) → "kapalı görünüyor" bildirimi | ☐ | ☐ |
| 11 | Çevrimdışı açılış → önceki hak duruyor | ☐ | ☐ |
| 12 | (Bilet satışa açılınca) satın al → +5; uzlaşma sonrası hâlâ +5; Android'de tüketildi mi | ☐ | ☐ |

Özellikle 8 ve 12 kodun **varsayımlarını** sınar: RevenueCat'in iade edilmiş tek seferlik işlemi `CustomerInfo`'dan düşürdüğü ve satın alma sonucundaki işlem kimliği ile `nonSubscriptionTransactions`'taki kimliğin ilişkisi belgelerden değil, cihazda doğrulanmalı. Kod ikinci varsayım için iki kimliği de "kredilendi" diye saklar; birincisi yanlışsa iade sonrası hak açık kalır (para kaybı yok, yalnızca iade edenin reklamsız kalması).

## 7. Avukata / mali müşavire sorulacaklar (hiçbiri kesin değil)

1. **Cayma hakkı istisnası.** Ekran "anında teslim edilen dijital içerikte cayma hakkı kullanılamaz (Mesafeli Sözleşmeler Yönetmeliği m. 15)" diyor. Bu istisnanın geçerli olması için tüketicinin **ayrıca onayı** ve cayma hakkını kaybedeceği konusunda **açık bilgilendirme** aranıyor mu; satın alma düğmesinin altındaki bir bilgi satırı yeter mi, yoksa ayrı bir onay kutusu mu gerekir? (Ayrı kutu, Apple'ın tek dokunuşla satın alma akışıyla ve 06'nın "çift onay yok" kuralıyla gerilim yaratır.) Madde ve bent numarası doğru mu?
2. **Satıcı kim?** App Store / Google Play üzerinden yapılan satışta tüketiciye karşı "satıcı/sağlayıcı" D2P Technology mi, mağaza mı; ön bilgilendirme yükümlülüğü kimde? Ekrandaki "Sağlayıcı: D2P Technology; ödemeyi mağaza alır" ifadesi doğru mu? MERSİS no, adres, KEP, iletişim bilgisi uygulama içinde gösterilmek zorunda mı?
3. **Ön bilgilendirme formu ve kalıcı veri saklayıcısı.** Mesafeli sözleşmelerde ön bilgilendirmenin ve sözleşmenin tüketiciye kalıcı veri saklayıcısıyla verilmesi yükümlülüğü, mağazanın gönderdiği makbuz e-postasıyla karşılanmış sayılır mı?
4. **Küçükler.** 16+ derecelendirilmiş bir oyunda 18 yaşından küçüklerin satın alması için ekrandaki "velinin izni gerekir" notu yeterli mi; 7578 sayılı Kanun / BTK düzenlemesi uygulama içi satın alma için ek yükümlülük getiriyor mu (00 §10 açık soru 2 ile birlikte)?
5. **"Reklamsız" adı.** Ürün yalnızca geçiş reklamlarını kapatıyor; ödüllü reklamlar isteğe bağlı kalıyor. Ad, Reklam Kurulu açısından yanıltıcı sayılır mı? Kart ilk satırda sınırı yazıyor; yeterli mi, yoksa ad "Geçiş Reklamsız" gibi mi olmalı?
6. **KVKK — RevenueCat.** Anonim uygulama kullanıcı kimliği ve satın alma kayıtlarının ABD'deki bir veri işleyene aktarımı: aydınlatma metnine ekleme, m. 9 kapsamında dayanak (standart sözleşme + Kurum'a bildirim?), veri işleyen sözleşmesi. Rıza akışı (06 §2.7) satın alma SDK'sını da kapsamalı mı; SDK şu an mağaza **ilk açıldığında** başlatılıyor.
7. **Vergi.** Mağaza üzerinden satışta KDV'yi kim beyan eder (Apple/Google'ın Türkiye'deki uygulaması), dijital hizmet vergisi, mağaza komisyonunun belgelendirilmesi, yurt dışı satışların niteliği.
8. **Fiyat etiketi.** "KDV dahil" ibaresi yalnızca TRY fiyatta gösteriliyor; Fiyat Etiketi Yönetmeliği uygulama içi dijital ürün için başka bir gösterim (birim fiyat, tarih vb.) istiyor mu?
9. **İade yönlendirmesi.** İadeyi tümüyle mağazaya yönlendirmek tüketici mevzuatı açısından yeterli mi; D2P'nin doğrudan başvuru kanalı göstermesi gerekir mi?
10. **Torpil + Reklamsız çakışması.** Reklamsız sahibi Torpil alırsa aynı özelliğe iki kez ödemiş olur; kart bunu satın almadan önce açıkça söylüyor. Bu bilgilendirme yeterli mi, yoksa fark fiyatı (mağazalarda teknik olarak ayrı SKU gerektirir) mı beklenir?

## 8. 06'dan sapmalar ve öneriler

| No | Öneri | Gerekçe |
|---|---|---|
| **D-ÖNERİ-14-01** | `no_ads` ("Reklamsız") ayrı, ucuz bir non-consumable olarak eklenir; Torpil onu içerir. Fiyat **89,99 ₺ / 2,99 $ öneridir**, karar sahibindir. | 06 kataloğunda yok; ürün sahibi talebi. Riskler: Torpil'in dönüşümünü bölebilir; iki ürünün çakışması (§7/10). |
| **D-ÖNERİ-14-02** | Torpil, kendine özgü ilk özellik çıkana dek gerçek mağazada satılmaz. | 06 §2.2.2 "sürüm kapılı pazarlama"; Apple 2.3.1. |
| **D-ÖNERİ-14-03** | "KDV dahil / tax included" ibaresi para birimine bağlanır (TRY → "KDV dahil"; diğer → "vergiler mağazanın gösterdiği gibi"). | 06 §3.1 EN "tax included" ABD'de yanlış olur. |
| **D-ÖNERİ-14-04** | Katalog ve depo `packages/engine/monetization` yerine `apps/mobile/src/monetization`'da. | Görev kapsamı motor paketine dokunmamaktı; dosyalar saf TS, sonradan taşınabilir. |
| **D-ÖNERİ-14-05** | Mağaza girişi üst çubukta çanta düğmesi (06: "Ayarlar › Torpil" ve "Daha" menüsü). | "Daha" menüsü yok; Ayarlar sayfası ses ayarlarına ait. Üst çubukta marka alt yazısı oyun sırasında iki satıra iner. |
| **D-ÖNERİ-14-06** | Mağaza açılınca oyun duraklatılır. | 06 §2.1/2 "ticari yüzey yalnızca duran zamanda". Yan etki: mağaza açıkken uygulama kapatılırsa kayıtta hız "duraklat" kalır. |
| **D-ÖNERİ-14-07** | **Karar gerekli:** Reklamsız/Torpil sahibi ödüllü teklifte reklam izler mi (`showAd`, 06'nın hükmü) yoksa ödülü reklamsız mı alır (`grantWithoutAd`, reklam katmanının şu anki seçimi)? | İkincisi satın almayı dolaylı olarak oyun-içi ödüle bağlar (D-038 "güç vermez" ile gerilim); birincisi "aldım, yine reklam" şikâyeti riskini taşır. Mağaza metni iki modu da doğru yazar. |
