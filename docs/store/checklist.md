# Yayın kontrol listesi — Motto 1.0 (App Store + Google Play)

> Sahip için adım adım. Sıra önemlidir; her adımın yanında **nereye** yapıştırılacağı yazar.
> İlgili belgeler: `listing-tr.md`, `listing-en.md`, `compliance.md`, `screenshots/` · tasarım: 14 §5, 15 §6, 17 §6–§7, 11 §2.5.
> ⚖️ = avukat / mali müşavir onayı · ☐ = yapılacak · ☑ = yapıldı · İlk sürümde koda dokunan her öneri "önerilen değişiklik" olarak duruyordu; 2026-11-14 ikinci geçişte ikon, `app.json` mağaza anahtarları, privacy manifest, izinler, `eas.json`, EAS içerik paketi adımı, native fontlar ve 360 px karne hatası **uygulandı** (☑ ile işaretli; ayrıntı §5).

**Sabitler**

| Ne | Değer |
|---|---|
| Şirket | D2P Technology (Türkiye) |
| iOS bundle ID / Android package | `com.d2ptechnology.motto` (`app.json › ios.bundleIdentifier` / `android.package`; `app.config.js` aynı değeri yedek olarak üretir) |
| Sürüm | `1.0.0` (`app.json › expo.version`); build numarası EAS `autoIncrement` |
| Ad (iki mağaza) | TR **Motto: Sertifikasız Hayat Koçu** · EN **Motto: Uncertified Life Coach** |
| Birincil dil | App Store: **Türkçe** (birincil pazar TR) + İngilizce (ABD) yerelleştirmesi; Play: varsayılan **tr-TR**, ek **en-US** (en-GB / en-CA / en-NZ kopya) |
| Yaş | 16+ (Apple 16+, IARC/PEGI 16, ESRB T) |
| Satıştaki IAP (1.0) | **yalnızca `no_ads`** (`src/monetization/config.ts › ON_SALE`) |

---

## 0. Yayın engelleri (bunlar bitmeden "Gönder"e basılmaz)

- ☑ **Gerçek uygulama ikonu.** MOTTO lastik damga kimliği: koyu kâğıt `#101410` üzerinde asit-lime "M" damgası (küçük boyutta okunsun diye tek harf; tam "MOTTO" damgası açılış ekranında). `apps/mobile/scripts/gen-icons.mjs` (Playwright, deterministik; `pnpm run gen:icons`) üretir: `assets/icon.png` 1024² RGB saydamlıksız · Android adaptive ön plan (66 dp güvenli daire içinde) + monokrom (Android 13 temalı ikon) + arka plan rengi `#101410` · `favicon.png` · `splash-icon.png` · mağaza `screenshots/icon-512.png` (Play) ve `icon-1024.png` (App Store). Kontrol: `node scripts/gen-icons.mjs --preview <png>` 20–180 px önizleme. Marka tescili sonrası son onay sahibin ⚖️.
- ☐ Gizlilik politikası, Kullanım Koşulları, KVKK Aydınlatma Metni — yayımlanmış URL'ler (TR + EN) ⚖️
- ☐ Destek e-postası ve destek URL'si (Apple zorunlu); geliştirici web sitesi (Play + app-ads.txt için)
- ☐ Marka: App Store Connect'te ad rezervasyonu + TÜRKPATENT 9/41 başvurusu (00 D-111) ⚖️
- ☐ `AD_UNITS.useTestIds: false` ve gerçek AdMob kimlikleri (yayın build'inde test kimliği = reklam geliri sıfır; gerçek kimlik + test cihazı yok = hesap riski)
- ☐ Mağaza ekranındaki "Satın almadan önce" metni avukattan geçti (14 §7) ⚖️

---

## 1. Hesaplar ve sözleşmeler

1. ☐ **D-U-N-S numarası** (D2P Technology adına; Apple kuruluş hesabı için şart, 1–2 hafta sürebilir).
2. ☐ **Apple Developer Program — Organization** (yıllık ücret). İki yönetici (Account Holder + Admin).
3. ☐ **Google Play Console — Organization hesabı** (tek seferlik ücret; kuruluş doğrulaması, D-U-N-S ister). Kuruluş hesabında "12 testçi × 14 gün kapalı test" şartı **yoktur** (11 §4); yine de kapalı test önerilir.
4. ☐ App Store Connect › Business: **Paid Applications Agreement** imza + banka + vergi (W-8BEN-E) — imzasız IAP sandbox'ta bile gelmez.
5. ☐ Apple **Small Business Program** başvurusu (%15). Play'de ilk 1 M$ için %15 otomatik (servis ücreti kademesi kaydı) ⚖️ mali müşavir.
6. ☐ Play Console › Payments profile (banka, vergi).
7. ☐ **Expo hesabı** (organizasyon: `d2ptechnology`), `npm i -g eas-cli`, `eas login`.
8. ☐ AdMob, Firebase (Google hesabı, şirket), RevenueCat, (opsiyonel) Meta Business hesapları — hepsi şirket e-postasıyla, iki yönetici.

## 2. Alan adı ve web sayfaları

1. ☐ Alan adı (ör. `motto` + şirket alan adı). GitHub Pages yeterli (08 §2.4).
2. ☐ Sayfalar: `/privacy` (TR+EN; SDK listesi compliance.md §0 ile birebir, silme talebi bölümü dahil), `/terms`, `/kvkk` (aydınlatma), `/support` (e-posta + SSS).
3. ☐ **`/app-ads.txt`** kökte: `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0` (AdMob yayıncı kimliğinizle). Mağaza kaydındaki "developer website" aynı alan adı olmalı.
4. ☐ `apps/mobile/app.json › expo.extra.monetization.legal.termsUrl / privacyUrl` → `PLACEHOLDER_` yerine gerçek URL (önerilen değişiklik; koda dokunan ajan/geliştirici yapar).

## 3. App Store Connect — uygulama kaydı

1. ☐ Certificates, IDs & Profiles › Identifiers › **App ID** `com.d2ptechnology.motto`; capabilities: **In-App Purchase**, **Push Notifications gerekmez** (yalnızca yerel bildirim; Expo eklentisi yine de entitlement ekleyebilir — prebuild sonrası kontrol ☐).
2. ☐ My Apps › **+ New App**: Platform iOS · Name `Motto: Sertifikasız Hayat Koçu` · Primary language **Turkish** · Bundle ID yukarıdaki · SKU `motto-ios-001` · User access Full.
3. ☐ **App Information**: Subtitle (`listing-tr.md` §2), Category **Games › Simulation** + **Role Playing**, secondary **Entertainment**; Content Rights → compliance.md §6; Age Rating → compliance.md §3.1 (sonuç 16+ olmalı).
4. ☐ English (U.S.) yerelleştirmesi ekle → `listing-en.md`. (İsteğe bağlı: English (U.K.), (Canada), (Australia) aynı metin.)
5. ☐ **Pricing and Availability**: Free · ülkeler soft-launch fazına göre (§11) · "Make available on Apple Silicon Mac / Vision Pro": **kapalı** (test edilmedi).
6. ☐ **App Privacy** → compliance.md §1 (Privacy Policy URL dahil).
7. ☐ Sürüm 1.0 sayfası: Promotional Text, Description, Keywords, Support URL, Marketing URL (ops.), What's New (1.0'da gösterilmez ama doldurun), **Screenshots**:
   - 6.9" ekran: `docs/store/screenshots/ios-6.9/{tr,en}/*.png` (1320×2868)
   - 6.5" ekran: `docs/store/screenshots/ios-6.5/{tr,en}/*.png` (1284×2778) — Apple 6.9" olunca 6.5"i zorunlu tutmaz; yine de yüklenebilir
   - ☑ **iPad:** `app.json › ios.supportsTablet: false` (yalnızca iPhone, `TARGETED_DEVICE_FAMILY = 1`) → iPad 13" ekran görüntüsü gerekmez. iPad düzeni test edilirse `true` + 2064×2752 görüntü.
8. ☐ **App Review Information**: iletişim kişisi, telefon, e-posta; **Sign-in required: No**; Notes → §9 metni.
9. ☑ **Export Compliance**: compliance.md §4 (muaf). `app.json › expo.ios.config.usesNonExemptEncryption: false` → Info.plist `ITSAppUsesNonExemptEncryption = NO`; TestFlight soruyu sormaz.
10. ☐ Version Release: **Manually release** (soft launch günü iki mağaza aynı gün) + Phased Release (7 gün) güncellemeler için.

## 4. Google Play Console — uygulama kaydı

1. ☐ **Create app**: App name `Motto: Sertifikasız Hayat Koçu` · Default language **Türkçe – tr-TR** · App/Game: **Game** · Free · beyanlar (Developer Program Policies, US export laws).
2. ☐ **App content** (Policy › App content) → compliance.md §2.3: Privacy policy URL, Ads (**Yes**), App access (yaş kapısı notu), Content rating (IARC, compliance.md §3.2), Target audience (**16–17, 18+**), Data safety (compliance.md §2.2), Advertising ID (**Yes**), Government/Financial/Health: No.
3. ☐ **Store settings**: Category **Game › Simulation**, tags (`listing-*.md` §8), contact e-mail, website, (ops.) phone.
4. ☐ **Main store listing** tr-TR: ad, kısa açıklama, tam açıklama, ikon 512×512 (`screenshots/icon-512.png`, `gen-icons.mjs` çıktısı), **feature graphic 1024×500** (`screenshots/play-feature-graphic-{tr,en}.png`), telefon ekran görüntüleri `screenshots/play-phone/tr/*.png` (1080×1920). **Translations › Add** en-US → EN dosyaları.
5. ☐ **Play App Signing**: varsayılan (Google tutar). EAS'in ürettiği upload key ile ilk AAB yüklenince etkin. SHA-1 → Meta key hash (17 §7 m.4) ve Firebase (ops.).
6. ☐ **Countries/regions**: soft-launch fazına göre (§11); Kore ve Çin **kapalı**.

## 5. Kod tarafına önerilen küçük değişiklikler (☑ = 2026-11-14'te uygulandı)

| | Dosya | Değişiklik | Neden |
|---|---|---|---|
| ☑ | `apps/mobile/app.json › expo.ios` | `"bundleIdentifier": "com.d2ptechnology.motto"`, `"config": { "usesNonExemptEncryption": false }`, `"supportsTablet": false` (iPad test edilene kadar). `buildNumber` yazılmadı: `eas.json › appVersionSource: remote` + `autoIncrement` yönetir | Açıklık; ihracat sorusu; iPad ekran görüntüsü zorunluluğu |
| ☑ | `apps/mobile/app.json › expo.android` | `"package": "com.d2ptechnology.motto"`, `adaptiveIcon.backgroundColor` → `#101410` + yeni ön plan / monokrom katmanları (arka plan görseli kaldırıldı). **İzinler:** `blockedPermissions` ile RECORD_AUDIO, SYSTEM_ALERT_WINDOW, READ/WRITE_EXTERNAL_STORAGE, READ_MEDIA_*, CAMERA, konum, FOREGROUND_SERVICE(_MEDIA_PLAYBACK) `tools:node="remove"`. Kalan: INTERNET, VIBRATE, MODIFY_AUDIO_SETTINGS (expo-audio), AD_ID; kütüphane manifestlerinden ACCESS_NETWORK_STATE, WAKE_LOCK (AdMob/Firebase), POST_NOTIFICATIONS, RECEIVE_BOOT_COMPLETED (expo-notifications). `versionCode` remote | Expo varsayılanı mavi arka plan; Data safety ile tutarlı izin listesi |
| ☑ | `apps/mobile/app.json › expo.ios.privacyManifests` | `NSPrivacyAccessedAPITypes`: UserDefaults `CA92.1`, FileTimestamp `C617.1`, SystemBootTime `35F9.1`, DiskSpace `E174.1`; `NSPrivacyCollectedDataTypes` compliance.md §1.2 ile birebir (Device ID, Product Interaction, Advertising Data, Purchase History [linked], Crash, Performance, Other Diagnostic, Coarse Location). `NSPrivacyTracking`/domain'ler SDK manifestlerinden gelir. Prebuild'de `ios/Motto/PrivacyInfo.xcprivacy` üretildiği doğrulandı; ☐ ilk arşivde Xcode Privacy Report ile son kontrol | Apple required-reason API |
| ☐ | `apps/mobile/app.json › plugins › react-native-google-mobile-ads` | Gerçek `androidAppId` / `iosAppId`; `skAdNetworkItems` Google'ın güncel tam listesi | 15 §6 m.2, m.8 |
| ☐ | `apps/mobile/src/ads/config.ts › AD_UNITS` | `prod` kimlikleri + `useTestIds: false` (yalnızca production profilinde; bkz. §7 `EXPO_PUBLIC_ADS_PROD` önerisi) | Test kimlikleri yayında gelir getirmez |
| ☑ | `apps/mobile/package.json › scripts` | `"eas-build-post-install": "pnpm run content:packs"` (temiz durumdan denendi: `assets/content/` silindi → betik 6 paket + manifest üretti) | `assets/content/` `.gitignore`'da; EAS sunucusunda içerik paketleri üretilmezse uygulama içeriksiz açılır |
| ☑ | `apps/mobile/src/theme.ts` + `expo-font` | Fraunces (500/700 italik), IBM Plex Sans (400–700), Archivo Black — `@expo-google-fonts/*@0.4.1` + `expo-font ~58.0.11` config eklentisi (iOS `UIAppFonts`, Android XML font aileleri; aynı aile adları → `fontWeight` doğru kesimi seçer). OFL bildirimleri: uygulamada Ayarlar › Lisanslar, `docs/store/licenses.md` | Ekran görüntüleri web fontlarıyla; native artık aynı (compliance R2). Expo Go'da sistem fontu görünür; dev/EAS build gerekir |
| ☑ | `apps/mobile/src/components/ReportCard.tsx` | Karne başlığı İŞLENDİ damgası kadar sağdan boşluk bırakır; "ONYIL KARNESİ" ayrı satırda | 360 px'te etiket damganın altına giriyordu (screenshots/README not 6) |

## 6. Uygulama içi satın alma ürünleri

Kimlikler `apps/mobile/src/monetization/catalog.ts` (SKU) ve `app.json › extra.monetization.productIds` (mağaza kimliği). **1.0'da yalnızca `no_ads` oluşturulur** (14 §5 C-9: uygulamada satılmayan ürün mağazada durursa inceleme sorusu doğar).

| SKU (kod) | App Store Product ID | Play Product ID | Tür | Liste fiyatı (öneri, son karar sahibin) | 1.0? |
|---|---|---|---|---|---|
| `no_ads` | `com.d2ptechnology.motto.no_ads` | `no_ads` | Non-Consumable / tek seferlik | 49,99 ₺ · 1,99 $ | **Evet** |
| `torpil` | `com.d2ptechnology.motto.torpil` | `torpil` | Non-Consumable | 199,99 ₺ · 6,99 $ | Hayır (Torpil'e özgü özellik çıkınca) |
| `tickets_5` | `com.d2ptechnology.motto.tickets_5` | `tickets_5` | Consumable | 29,99 ₺ · 0,99 $ | Hayır (soft launch sonrası) |
| `season_2701` | `com.d2ptechnology.motto.season_2701` | `season_2701` | Non-Consumable | 119,99 ₺ · 3,99 $ | Hayır (1.0 sonrası) |

**`no_ads` — App Store Connect › Monetization › In-App Purchases › +**
1. ☐ Type **Non-Consumable**, Reference Name `No Ads`, Product ID `com.d2ptechnology.motto.no_ads`.
2. ☐ Availability: tüm soft-launch ülkeleri. Price: TR elle **49,99 ₺** (ya da sahibin kararı); ABD 1,99 $ tabanından diğerleri otomatik.
3. ☐ Localizations — Display Name / Description:
   - TR: **Reklamsız** / "Geçiş reklamlarını kapatır. İsteğe bağlı ödüllü teklifler kalır." (≤ 55)
   - EN: **No Ads** / "Turns off interstitial ads. Optional rewarded offers stay." (≤ 55)
   - ("Reklamsız" tek başına ödüllü reklamları da kapsıyor gibi okunur; açıklama sınırı söyler — compliance R4 ⚖️)
4. ☐ **Family Sharing: Off** (06 §4).
5. ☐ Review Information: ekran görüntüsü — inceleme için **çerçevesiz**, cihazda çekilmiş görüntü önerilir (TestFlight build'inde mağaza ekranı); geçici olarak `docs/store/screenshots/ios-6.9/en/08-shop.png` kullanılabilir. Not: "Shop: bag icon top right. Non-consumable; removes interstitials only."
6. ☐ İlk IAP **ilk uygulama sürümüyle birlikte** incelemeye gönderilir (sürüm sayfasında "In-App Purchases" bölümünden seçin).

**`no_ads` — Play Console › Monetize › Products › In-app products › Create**
1. ☐ Product ID `no_ads` (Play kimliği değiştirilemez), Name/Description yukarıdaki gibi, fiyat 49,99 ₺ (diğer ülkeler dönüştürme + yuvarlama), **Activate**.
2. ☐ Play'de ürün oluşturmak için önce bir AAB'nin (BILLING izinli) herhangi bir kanala yüklenmiş olması gerekir → önce §8 dahili test.
3. ☐ License testing: Setup › License testing → test hesapları.

**RevenueCat** (14 §5 D)
1. ☐ Proje `Motto`; iOS app (App Store Connect **In-App Purchase Key** `.p8` + Issuer ID), Android app (Google Cloud **service account JSON**, Play Console'da "Financial data" izinli).
2. ☐ Products: `no_ads` (iki mağaza) içe aktar; **Entitlement `no_ads`** oluştur, iki ürünü bağla. Android ürününün **non-consumable** işaretli olduğunu doğrula.
3. ☐ Project settings › Restore behavior: **Transfer to new App User ID**.
4. ☐ Public SDK key'leri `app.json › extra.monetization.revenueCat.iosApiKey` (`appl_…`) / `androidApiKey` (`goog_…`); `productIds.ios.no_ads` = `com.d2ptechnology.motto.no_ads`, `productIds.android.no_ads` = `no_ads` (`PLACEHOLDER_` öneklerini sil).

## 7. AdMob, Firebase, Meta — yapılandırma dosyaları

**AdMob** (15 §6)
1. ☐ İki uygulama (iOS, Android), mağaza kayıtlarına bağla (mağazada yayınlandıktan sonra "link" edilebilir; önce "not listed" açılır).
2. ☐ Dört birim: iOS rewarded, iOS interstitial, Android rewarded, Android interstitial. **Banner / app-open / rewarded-interstitial açmayın.**
3. ☐ App ID'ler → `app.json` eklentisi; birimler → `src/ads/config.ts › AD_UNITS.prod`.
4. ☐ Privacy & messaging: **GDPR mesajı** (AEA/UK/CH) yayınla; (ops.) ABD eyalet mesajı; **IDFA açıklama mesajı açmayın** (kendi ön-ekranımız var).
5. ☐ Blocking controls: hassas kategoriler — Gambling & betting, Alcohol, Dating, Politics, Religion vb. **kapalı**; Max ad content rating **T**.
6. ☐ Test cihazları; Firebase'e bağla (Settings › Linked services).

**Firebase** (17 §6) — `motto-prod` projesi; Android + iOS uygulaması `com.d2ptechnology.motto` → dosyaları **`apps/mobile/firebase/google-services.json`** ve **`apps/mobile/firebase/GoogleService-Info.plist`** olarak bırak (ya da EAS file env: `GOOGLE_SERVICES_JSON`, `GOOGLE_SERVICE_INFO_PLIST`). Crashlytics Enable; Remote Config parametreleri; GA4 retention 2 ay, Google Signals kapalı; BigQuery günlük export ilk günden.

**Meta** (17 §7) — TR teknik fazında **atlanabilir** (UA yalnızca CA/NZ'de anlamlı). Açılırsa: App ID + Client Token → `app.json › extra.analytics.meta`; iOS/Android platformları; Play App Signing SHA-1'den key hash; Data deletion URL.

## 8. EAS Build — `eas.json`

☑ `apps/mobile/eas.json` oluşturuldu (içerik aşağıda; `node`/`pnpm` yereldeki sürümlerle eşlendi: 22.23.4 / 10.28.0; `submit.production.ios` değerleri `PLACEHOLDER_` — App Store Connect kaydından sonra doldurun ☐). `/secrets/` `apps/mobile/.gitignore`'a eklendi. İçerik paketleri EAS'ta `eas-build-post-install` ile üretilir (§5).

```json
{
  "cli": { "version": ">= 16.0.0", "appVersionSource": "remote" },
  "build": {
    "base": {
      "node": "22.23.4",
      "pnpm": "10.28.0",
      "env": { "EXPO_PUBLIC_BUILD_PROFILE": "base" }
    },
    "development": {
      "extends": "base",
      "developmentClient": true,
      "distribution": "internal",
      "ios": { "simulator": false },
      "android": { "buildType": "apk" },
      "env": { "EXPO_PUBLIC_BUILD_PROFILE": "development" }
    },
    "preview": {
      "extends": "base",
      "distribution": "internal",
      "channel": "preview",
      "android": { "buildType": "apk" },
      "env": { "EXPO_PUBLIC_BUILD_PROFILE": "preview" }
    },
    "production": {
      "extends": "base",
      "channel": "production",
      "autoIncrement": true,
      "android": { "buildType": "app-bundle" },
      "env": { "EXPO_PUBLIC_BUILD_PROFILE": "production" }
    }
  },
  "submit": {
    "production": {
      "ios": { "ascAppId": "PLACEHOLDER_ASC_APP_ID", "appleTeamId": "PLACEHOLDER_APPLE_TEAM_ID" },
      "android": { "serviceAccountKeyPath": "./secrets/play-service-account.json", "track": "internal", "releaseStatus": "draft" }
    }
  }
}
```

Notlar: `development` profili `expo-dev-client` ister (package.json'da yok → `npx expo install expo-dev-client`) ☐; istenmezse `development` yerine `preview` kullanın. `channel` alanları `expo-updates` kurulunca anlam kazanır (şu an yok; `eas update` için `npx expo install expo-updates`) ☐. `EXPO_PUBLIC_BUILD_PROFILE` şu an kodda okunmuyor; `AD_UNITS.useTestIds`'i profile bağlamak için önerilir (production dışında test reklamı). `/secrets/` `.gitignore`'da ☑.

**Komutlar** (`apps/mobile` içinde):

```bash
eas init                                   # projectId'yi app.json › extra.eas.projectId'ye yazar
eas credentials                            # iOS dağıtım sertifikası + provisioning, Android upload keystore (EAS yönetir)
eas env:create --name GOOGLE_SERVICES_JSON --type file --value ./firebase/google-services.json --environment production
eas env:create --name GOOGLE_SERVICE_INFO_PLIST --type file --value ./firebase/GoogleService-Info.plist --environment production

eas build --profile development --platform all     # cihazda geliştirme (dev client gerekir)
eas build --profile preview --platform all         # dahili dağıtım: iOS ad-hoc (UDID kayıtlı cihazlar), Android APK
eas build --profile production --platform all      # mağaza: iOS .ipa, Android .aab

eas submit --profile production --platform ios     # TestFlight'a yükler
eas submit --profile production --platform android # Play internal track'e taslak olarak yükler
eas update --channel production --message "…"      # yalnızca JS/içerik düzeltmeleri; native değişiklik = yeni build
```

Build öncesi yerelde: `pnpm install` → `pnpm --filter motto-mobile test` → `pnpm typecheck` → `npx expo config --type introspect` (Firebase/Meta eklentileri doğru açıldı mı) → `npx expo-doctor`.

## 9. Test kanalları

**TestFlight**
1. ☐ İlk production build → App Store Connect › TestFlight; export compliance otomatik geçmeli (§5).
2. ☐ Internal testers (ekip, 100'e kadar, incelemesiz).
3. ☐ External group "Playtest" (public link; ilk build Beta App Review'dan geçer — §10 notunu "Beta App Review" notuna da yapıştırın).
4. ☐ Sandbox Apple ID ile 14 §6.2'deki 12 senaryo (satın al, iptal, iade, geri yükle, Ask to Buy…).
5. ☐ ATT, UMP (VPN/test cihazıyla AEA), bildirim izni, yaş kapısı < 16 / 16–17 / 18+ yolları.

**Google Play**
1. ☐ **Internal testing** (≤ 100 e-posta) → ilk AAB; IAP ürünü bundan sonra oluşturulabilir.
2. ☐ License testers ile satın alma (test kartları: "always approves", "slow card" = bekleyen ödeme).
3. ☐ **Closed testing** (≥ 20 kişi önerilir) → **pre-launch report** (robot testi; yaş kapısında takılabilir: "App access" notu + test hesabı gerekmez) ve Android vitals.
4. ☐ Production'a **staged rollout** (%10 → %50 → %100).

## 10. App Review notu (App Store Connect › App Review Information › Notes; Play'de "App access" açıklaması için kısaltın)

```
Thank you for reviewing Motto.

NO ACCOUNT. The game has no login. All progress is stored on the device.

1) NEUTRAL AGE GATE (first launch)
The first screen asks only for a birth year (no hint about thresholds). Enter any year that makes you an adult (e.g. 1990), then tap "Yes" on the confirmation "1990, is that right?". Under 16 the game does not open and no SDK starts; 16–17 plays with personalized ads, tracking and marketing analytics permanently off. The app is rated 16+ and is not directed at children.

2) THE COACH'S "WAGER" (İDDİA) IS NOT GAMBLING
On some decision cards the narrator pins a yellow slip such as "WAGER: You won't make registration. Real odds: 40%." The player stakes nothing: no money, no in-game currency, no points, nothing purchasable. The player just picks a card option as usual; the coach's prediction never changes the outcome. When the choice resolves, the slip gets a cosmetic stamp ("I WAS WRONG" or "CALLED IT"). There is no playable chance-based mini-game, no loot box, no random paid item.

3) ADS AND THE TRACKING PROMPT
There are no ads in the first session. A single privacy card appears at the end of the first in-game year ("One More Year"); personalized ads are OFF by default. Rewarded ads are optional offers (equal-size "Watch ad" / "No thanks"), from the 2nd session. Interstitials appear only when returning after 6+ hours, from the 3rd session. The ATT prompt is shown only if the player turned personalized ads ON, and no earlier than the 3rd session, so you may not see it during review. Ads are never shown during a decision, on the report card or on the end-of-life screens.

4) IN-APP PURCHASE: "No Ads" (com.d2ptechnology.motto.no_ads, non-consumable)
Open the shop with the bag icon in the top-right corner. "No Ads" turns off interstitial ads only; optional rewarded offers remain, and the card states this. It grants no stats, money or advantage. "Restore purchases" is always visible on the same screen. A pre-purchase information block (Turkish distance-sales law) is shown under the product.

5) TO SEE MORE QUICKLY
Tap ▶▶ (top bar) to speed up time; "Auto" lets the narrator choose. The settings menu (≡, bottom right) contains language (TR/EN), sound, privacy choices, legal texts and the "delete my analytics data" option.

Contact: <name>, <phone>, <email>
```

## 11. Soft launch (11 §2.5, 00 D-053)

| Faz | Ülkeler | Platform | Süre | Amaç | Kapı |
|---|---|---|---|---|---|
| 1 — teknik | **Türkiye** | iOS + Android **aynı gün** | ~2–3 hafta | Çökme, IAP, rıza akışı, ton | Teknik kapı (crash-free ≥ %99,5, ANR < %0,47, satın alma/geri yükleme hatasız); KPI kapısı yok |
| 2 — KPI | **Kanada + Yeni Zelanda** (EN) | iOS ve Android ayrı kohort | 8 hafta | Retention kanıtı | D1 ≥ %35, D7 ≥ %15, D30 ≥ %6, oturum ≥ 12 dk; n ≥ 900 / platform |
| Yedek | Filipinler | — | — | Yalnızca CA/NZ kohortu dolmazsa | — |
| Kapalı | Çin, Kore (ve 16+ beyanını sorun eden ülkeler) | — | — | GRAC / lisans | — |

- iki konsolda ülke listesi **aynı gün** değişir; Apple "Pricing and Availability", Play "Countries/regions".
- Faz 2'de App Store yerelleştirmesi en-US yeterli; en-CA / en-GB metni kopya.
- Ön kayıt (pre-order / pre-registration) ödülsüz (11 §4).

## 12. Gönderim günü

1. ☐ `node docs/store/check-limits.mjs` → "All fields within limits".
2. ☐ Fiyat 49,99 ₺ değilse mağaza ekran görüntüsünü yeniden üret (`docs/store/screenshots/README.md`).
3. ☐ Sürüm notları, ekran görüntüleri, ikon iki dilde yüklü; Play "Store listing" ve App Store sürüm sayfasında önizleme.
4. ☐ Data safety / App Privacy formları compliance.md ile birebir; SDK listesi build ile aynı (`npx expo config --type introspect`'te Meta yoksa Meta satırları formdan çıkar).
5. ☐ iOS: build seç → IAP `no_ads` ekle → Submit for Review (Manual release). Android: Production → Countries → Staged rollout %10 → Send for review.
6. ☐ Onaydan sonra iki mağazada **aynı saatte** yayınla; AdMob uygulamalarını mağaza kayıtlarına bağla; app-ads.txt doğrulamasını gör.
