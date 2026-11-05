# T5 — Teknoloji Yığını ve Mimari (Backend'siz Mobil Hayat Simülasyonu)

**Durum:** Araştırma tamamlandı — 2026-11-05
**Kapsam:** Expo/React Native vs Flutter vs Unity vs Godot 4 vs Capacitor karşılaştırması, sürüm doğrulaması (npm, 5 Kasım 2026), ADR, monorepo + engine mimarisi, test/CI stratejisi, performans/UX teknolojisi, 2026 platform gereksinimleri, bağımlılık listesi, ilk 2 hafta checklist'i ve risk kaydı.

---

## TL;DR

1. **Karar: Expo SDK 58 (React Native 0.88.1, React 19.3, TypeScript 6.0.x) + pnpm monorepo.** Metin ağırlıklı, animasyonu hafif, offline-first bir hayat simülasyonu için en hızlı, en "AI-ajan dostu" ve bu ortamda **cihazsız test edilebilen** tek yığın bu. (Bkz. ADR-001.)
2. Bu ortamda **`expo export --platform web` + Playwright ekran görüntüsü döngüsü fiilen çalıştı** (Çalışma Günlüğü, 2026-11-05). Flutter/Unity/Godot için SDK yok; Capacitor çalışır ama "WebView hissi" ve haptik/scroll kalitesi geride.
3. **Oyun motoru (`packages/engine`) saf TypeScript, sıfır React Native bağımlılığı:** deterministik seed'li RNG (`pure-rand`), immutable state, reducer'lar, `step(state, action) → {state, effects}`; efektler (haptik, ses, bildirim, analytics) bildirimsel olarak dışarı verilir. Vitest + fast-check ile property-based test.
4. **Legacy Architecture bitti:** RN 0.82+ ve Expo SDK 55+ yalnızca New Architecture. Reanimated 4.7.1 (RN 0.86–0.88), `react-native-worklets` 0.13.x, MMKV 4.3.2 (Nitro Modules ≥0.35) buna göre seçildi.
5. **Deprecation bayrakları:** `expo-av` SDK 55'te tamamen kaldırıldı → `expo-audio` 58.0.11. `react-native-iap` v15+ Expo desteğini bıraktı → Expo için `expo-iap` 6.4.3 veya RevenueCat (`react-native-purchases` 11.0.1). `@legendapp/state` v3 hâlâ beta (beta.48, Tem 2026) → `zustand` 5.0.16.
6. **TypeScript 7.0.2 (Go tabanlı derleyici) çıktı ama `typescript-eslint` 8.72 peer aralığı `<6.1.0`; Expo şablonu `~6.0.3` pin'liyor.** Uygulama ve monorepo TS 6.0.x'te kalacak; TS 7 yalnızca CI'da deneysel `tsc --noEmit` hızlandırması olarak değerlendirilecek.
7. **Reklam:** `react-native-google-mobile-ads` 17.4.0 (AdMob + UMP + GAM mediation adaptörleri; RN ≥0.86 ve New Arch zorunlu). v17 Eylül 2026'da büyük bir yeniden yazım → 16.5.0 geri dönüş pini hazır tut. AppLovin MAX RN 9.6.0 publisher isterse `AdProvider` arayüzünün arkasına takılır.
8. **IAP backend'siz:** StoreKit 2 / Play Billing 9.1 ile `expo-iap` cihaz üstü doğrulama yapar ama sunucu doğrulaması bizde yok. RevenueCat "backend'siz backend" olarak doğrulama + entitlement + metrik verir; publisher'lar tanır. Öneri: RevenueCat (P1), `expo-iap` yedek.
9. **Yerel bildirim:** `expo-notifications` 58.1.8; `enableRemoteNotifications: false` (58.1.0) ile APNs entitlement'ı atlanır. Android 13+ `POST_NOTIFICATIONS` runtime izni bağlam içinde, 2. seanstan önce asla istenmez.
10. **Kayıt sistemi:** `expo-sqlite` 58.0.15 (SQLite 3.53.3; iOS satır okuma ~3.3x hızlandı) + Drizzle ORM 0.45.4; sıcak KV için MMKV 4.3.2. JSON payload + `schemaVersion` + SHA-256 bütünlük hash'i + 3 slotlu döner yedek.
11. **Platform 2026:** iOS: Xcode 26 / iOS 26 SDK zorunlu (28 Nis 2026); Expo SDK 58 iOS 27 hazır; min deployment target iOS 16.4. Android: Play için targetSdk 36 (31 Ağu 2026 itibarıyla); RN 0.88 şablonu minSdk 24 / compileSdk 37 (Expo SDK 58 varsayılanları `npx expo config --type introspect` ile teyit edilecek); **16 KB sayfa boyutu desteği 1 Şub 2027'den sonra güncelleme için şart.**
12. **Yaş derecelendirmesi:** Apple'ın yeni 4+/9+/13+/16+/18+ sistemi. "Sık küfür/kaba mizah" 13+, "sık alkol/sigara/uyuşturucu referansı" 18+. Hedef: **16+** (alkol/uyuşturucu referansları "seyrek" tutulacak, simüle kumar yok). Google Play'de hedef kitle 13+ seçilerek Families politikası dışında kalınır.
13. **Live-ops backend'siz:** Kod için EAS Update (ücretsiz plan 1.000 aylık güncellenen kullanıcı), içerik paketleri için GitHub Pages/CDN üzerinde imzalı statik JSON. Firebase Remote Config ikinci faz.
14. **Test döngüsü:** engine → vitest; UI → jest-expo + RNTL; görsel → Playwright (web export); lokalizasyon taşma → snapshot; CI → GitHub Actions (lint, typecheck, test, web export, Playwright) + tag'de EAS Build.
15. **En büyük 3 teknik risk:** (a) New Arch/Nitro/Expo çeyreklik SDK döngüsünde native modül kırılması, (b) ads SDK v17'nin tazeliği, (c) bu ortamda gerçek cihaz olmaması (iOS yalnızca TestFlight üzerinden). Hepsinin azaltıcı planı risk kaydında.

---

## Varsayımlar

- Oyun; metin, basit kart/liste UI'ı, az sayıda mikro-animasyon (sayı sayaçları, kart kayması, konfeti, anlatıcı "daktilo" efekti) içerir. 3D/fizik yok. Canvas tabanlı "oyun döngüsü" yok; olay tabanlı, turn-based (yıl/ay geçişleri).
- Tek geliştirici + AI kodlama ajanları; geliştiricinin kendi makinesinde Mac olup olmadığı bilinmiyor → **iOS derlemeleri EAS Build (bulut) ile** varsayılıyor.
- Bu bulut ortamında `npx expo install` proxy tarafından engellendi (api.expo.dev); sürümler `node_modules/expo/bundledNativeModules.json` üzerinden pin'lenip `npm/pnpm install` ile kuruluyor (Çalışma Günlüğü). GitHub Actions'ta bu kısıt yok.
- Web araştırma bütçesi bu oturumda doldu ve birçok alan adı (expo.dev, docs.expo.dev, reactnative.dev, support.google.com, developers.google.com, revenuecat.com, unity.com, godotengine.org, kenney.nl, freesound.org) ağ politikası nedeniyle doğrudan okunamadı. Bu nedenle **sürümler npm registry'den birincil olarak doğrulandı (5 Kas 2026)**, platform kuralları developer.apple.com / developer.android.com / GitHub kaynaklarından okundu, geri kalanlar arama özetlerinden alındı ve "doğrulanmalı" olarak işaretlendi.
- İlk sürüm TR + EN (kullanıcı kararı: iki dil de birinci sınıf). Mimari 3. dil eklemeyi ucuz tutacak.
- Monetizasyon detayları T6'da; burada yalnızca SDK/mimari etkileri.

---

## 1. Aday yığınların karşılaştırması

### 1.1 Puan tablosu (1 = zayıf, 5 = mükemmel; bu projeye göre ağırlıklı)

| Kriter (ağırlık) | Expo / RN (TS) | Flutter (Dart) | Unity (C#) | Godot 4.7 (GDScript/C#) | Capacitor + Web (Svelte/React) |
|---|---|---|---|---|---|
| Geliştirme hızı — metin/liste UI (x3) | 5 | 4 | 2 | 3 | 5 |
| AI-ajan dostluğu (Claude TS yazar) (x3) | 5 | 3 | 3 | 2 | 5 |
| **Bu ortamda cihazsız test** (Node 22, Chromium+Playwright var; Flutter/Unity/Android SDK/Xcode yok) (x3) | 5 (web export doğrulandı) | 1 (SDK yok) | 1 | 1 | 5 |
| Liste/metin performansı (x2) | 4 (FlashList 2, Hermes) | 5 (Impeller) | 3 | 3 | 3 (WebView) |
| Animasyon kütüphaneleri (x1) | 5 (Reanimated 4 CSS API, Moti, Lottie, Skia) | 5 | 5 | 4 | 3 |
| Mağaza/publisher kabulü (x2) | 4 | 4 | 5 | 3 | 3 |
| Uygulama boyutu (x1) | 3 | 3 | 2 | 4 | 4 |
| IAP / Ads / Mediation ekosistemi (x2) | 4 (AdMob+UMP, MAX, RevenueCat, expo-iap) | 5 (resmi google_mobile_ads, in_app_purchase) | 5 | 2 (topluluk pluginleri) | 3 |
| Yerel bildirim / haptik / ses (x1) | 5 | 4 | 3 | 3 | 3 |
| Yerel depolama + ORM (x1) | 5 (expo-sqlite+Drizzle, MMKV) | 4 (drift, hive/isar) | 3 | 3 | 4 |
| OTA / backend'siz live-ops (x2) | 5 (EAS Update) | 3 (Shorebird, ücretli) | 1 | 1 | 4 (Capgo) |
| Monorepo'da saf TS engine paylaşımı (x2) | 5 | 1 (Dart'a yazılmalı) | 1 | 1 | 5 |
| **Ağırlıklı toplam (max 115)** | **107** | 73 | 60 | 53 | 95 |

### 1.2 Adayların özeti

**Expo / React Native.** SDK 58 (29 Eyl 2026) RN 0.88.1 + React 19.3 ile geliyor; iOS 27 ve Xcode 27 için hazır, "2x daha hızlı temiz Android build", Android ana ekran widget'ları, variable font desteği ve "kodlama ajanı için tasarlanmış CLI" duyuruldu [2][3]. `expo-sqlite` 58.0.3 "SQLite sorguları ve migration'ları için ajan skill'i" bile yayınlıyor [36] — Expo ekibi AI ajan iş akışını resmen hedefliyor. RN 0.88 "kırıcı değişiklik yok" diyor; W3C EventTarget tabanlı olay dağıtımı, `fontVariationSettings`, iOS SceneDelegate [4][5]. Legacy Architecture RN 0.82'den (Ekim 2025) ve Expo SDK 55'ten (Şubat 2026) beri yok [7][8]. Expo web export (react-native-web 0.21.4) bu ortamda çalıştı; Playwright ile 390x844 ekran görüntüsü alındı [51]. Zayıf yanı: native modül ekosistemi New Arch + Nitro geçişinde hâlâ çalkantılı; her SDK'da 1-2 kütüphane kırılıyor.

**Flutter.** Performans ve resmi plugin kalitesi (google_mobile_ads, in_app_purchase) çok iyi; Impeller ile shader jank sorunu çözülmüş [45]. Ama (a) bu ortamda Flutter SDK yok, tarayıcıda test etmek için SDK indirilip web build'i alınmalı (ağ kısıtı), (b) oyun motoru Dart'ta yazılmak zorunda; TS engine'i paylaşamayız, (c) OTA için Shorebird gibi üçüncü parti gerekir. Solo + AI ajan senaryosunda TS'in veri hacmi avantajı belirleyici.

**Unity.** Publisher'ların en tanıdık motoru; mediation/attribution SDK'ları tam. Unity Personal 200 bin $ gelir eşiğine kadar ücretsiz, Unity 6'da splash opsiyonel; Pro 2.310 $/koltuk/yıl (12 Oca 2026'dan itibaren) [44] (üçüncü parti kaynak; doğrulanmalı). Ancak metin ağırlıklı UI (UGUI/UI Toolkit) ile Türkçe uzun metin, dinamik liste ve erişilebilirlik üretimi yavaş; temel boyut büyük; bu ortamda editor yok, WebGL ile tarayıcı testi mümkün ama ağır. "BitLife tarzı" metin oyunu için motor zorunluluğu yok.

**Godot 4.7.** 4.7.2 (18 Ağu 2026) stabil; Godot Mobile güncellemesine göre kırılma oranları 4.5.2/4.6 ile düşürülmüş, Android'de editör içi cihaz aynalama gelmiş; iOS export hâlâ Mac + Xcode ister [43]. IAP/ads tarafı topluluk pluginlerine bağlı ve bu projenin kalbi (reklam + IAP + bildirim) için en zayıf aday. GDScript için AI ajan veri hacmi TS'e göre çok düşük.

**Capacitor 8 + web.** Capacitor 8 (Ara 2025) SPM varsayılanı, 8.5 (31 Tem 2026) UIScene zorunluluğu; min iOS 15 / Android 7 (API 24); Node 22, Xcode 26 [42]. Tarayıcı testi doğal, AI ajan dostluğu tam. Ama scroll fiziği, haptik ve "native his" WebView'da geride kalır; AdMob/IAP topluluk + RevenueCat pluginleriyle mümkün. Publisher demo'sunda "web sitesi gibi hissettiriyor" riski gerçek.

### 1.3 Bu oyuna nasıl uygularız
- Expo/RN seçilir; Capacitor "acil çıkış planı" olarak akılda tutulur: engine ve içerik paketleri saf TS/JSON olduğu için UI katmanı değişse bile %60-70 kod taşınır.
- Flutter'ın avantaj sağladığı tek alan (resmi Google plugin'leri) `AdProvider`/`IapProvider` arayüzleriyle soyutlanarak riski azaltılır.
- Unity'nin publisher avantajı için pitch'te motor değil metrikler konuşulur (T6): D1/D7, seans süresi, ARPDAU. Metin oyunlarında publisher motor sormaz, kohort tablosu sorar.

---

## 2. Sürüm doğrulaması ve deprecation bayrakları (npm, 5 Kasım 2026)

### 2.1 Çekirdek

| Paket | Güncel | Tarih/Not | Kaynak |
|---|---|---|---|
| expo | 58.0.23 (`latest`), SDK 58.0.0: 29 Eyl 2026 | SDK kadansı: 52 (Kas 2024), 53 (Nis 2025), 54 (Eyl 2025), 55 (25 Şub 2026), 56 (20 May 2026), 57 (30 Haz 2026), 58 (29 Eyl 2026) → ~3 ayda bir | npm `time` [1] |
| react-native | 0.88.1 (27 Eki 2026) | 0.82 (8 Eki 2025) ile Legacy Arch kaldırıldı; 0.88 "no breaking changes" | npm, [4][5] |
| react / react-dom | 19.3.0 (Expo pin) | — | [34] |
| typescript | 7.0.2 `latest` (8 Tem 2026); Expo şablonu `~6.0.3` | **typescript-eslint 8.72.1 peer: `>=4.8.4 <6.1.0`** → TS 7 lint zincirini kırar | npm peerDeps |
| react-native-web | 0.21.4 (8 Eki 2026) | React 19 desteği 0.20.0'dan beri | [39] |
| expo-router | 58.0.30 | — | npm |
| hermes | RN 0.88 "Hermes V1" (260318099.x) ve legacy Hermes ikisini de paketliyor; SDK 55'te "Hermes v1 opt-in" | Varsayılanı değiştirme; ölçmeden geçme | [5][6][40] |

### 2.2 Animasyon ve liste

| Paket | Güncel | Not |
|---|---|---|
| react-native-reanimated | 4.7.1 (2 Eki 2026) | RN 0.86–0.88; Worklets 0.13.x; New Arch zorunlu; CSS animations/transitions API; yeni layout animation motoru varsayılan [30][31] |
| react-native-worklets | 0.13.1 | Babel plugin: `react-native-worklets/plugin` |
| moti | 0.30.0 | Reanimated üstü; küçük UI mikro-animasyonları için uygun |
| lottie-react-native | 7.5.0 | RN ≥0.84; ≤5 Lottie dosyası bütçesi |
| @shopify/react-native-skia | 2.14.0 | Reanimated ≥4 ve worklets ister; paylaşım kartı render'ı için opsiyonel |
| @shopify/flash-list | 2.3.3 (Expo pin 2.3.2) | v2 New Arch için yeniden yazıldı; `estimatedItemSize` gerekmiyor |
| react-native-gesture-handler | 3.5.0 (Expo pin ~3.3.0) | Expo pinine uy |

### 2.3 Depolama, state, içerik

| Paket | Güncel | Not |
|---|---|---|
| expo-sqlite | 58.0.15 | SQLite 3.53.3, SQLCipher 4.17; 58.0.10: iOS satır okuma ~3.3x, insert ~2.8x hızlı; 58.0.0: libSQL kaldırıldı; `kv-store` ve `localStorage/install` export'ları var; web için wasm (`configureWeb({wasmURL})`) [36] |
| drizzle-orm / drizzle-kit | 0.45.4 / 0.31.11 | peer `expo-sqlite >=14` |
| react-native-mmkv | 4.3.2 (22 Haz 2026) | Nitro Modules ≥0.35 (güncel 0.37.2); web desteği; AES-256 şifreleme [29] |
| @react-native-async-storage/async-storage | 3.1.1 (Expo pin 2.2.0) | Yalnızca 3. parti SDK'ların zorunlu kıldığı durumda |
| zustand | 5.0.16 | Seçim |
| @legendapp/state | 2.1.15 `latest`; 3.0.0-beta.48 (12 Tem 2026) | v3 bir yıldan uzun süredir beta → kullanma |
| @reduxjs/toolkit | 2.14.0 | Solo proje için fazla tören |
| zod | 4.6.7 | İçerik şemaları |
| pure-rand | 8.4.2 (10 Tem 2026) | xoroshiro128+/mersenne; fast-check'in RNG'si; seedrandom 3.0.5 son yayın 2019 (çalışır ama bakımsız) |
| i18next / react-i18next | 26.7.2 / 17.1.13 | react-i18next peer: i18next ≥26.2, TS ^5/^6/^7 |
| expo-localization | 58.0.5 | Cihaz dili/bölge |
| expo-font | 58.0.11 | Variable font (RN 0.88 `fontVariationSettings`) |

### 2.4 Monetizasyon ve servisler

| Paket | Güncel | Not / Bayrak |
|---|---|---|
| react-native-google-mobile-ads | 17.4.0 (21 Eki 2026) | peer RN ≥0.86, New Arch zorunlu; v17.0.0 (18 Eyl 2026) "API yenilemesi, multiformat, ad pools"; 17.1 Android GMA Next-Gen backend; GAM mediation adaptör paketleri (AppLovin, Meta, InMobi, Mintegral, Moloco, Pangle, Unity, Vungle, Yandex); 17.4 `AdsConsent.getGppString` [26][27]. **Bayrak:** README'de Android tarafında bazı özellikler "To-Do" görünüyor → 16.5.0 (18 Ağu 2026) yedek pin |
| react-native-applovin-max | 9.6.0 (3 Haz 2026) | Native SDK 13.6.3; release notlarında Expo/New Arch açıkça yazmıyor → dev build'de doğrula [28] |
| expo-iap | 6.4.3 (4 Kas 2026) | Expo Modules tabanlı, OpenIAP; StoreKit 2 + Play Billing 9.1.0; Expo Go'da çalışmaz, dev build şart [12][13] |
| react-native-iap | 17.3.4 | **v15'ten itibaren Expo desteği yok**, Nitro tabanlı, bare RN için [11] |
| react-native-purchases (RevenueCat) | 11.0.1 (5 Kas 2026) | RN ≥0.80 (SPM entegrasyonu için ≥0.88), Kotlin ≥2.1; Expo Go'da "Preview API Mode" mock [47] |
| expo-notifications | 58.1.8 | 58.1.0: `enableRemoteNotifications:false`; 58.0: Android `delivery:'alarmClock'`; 58.1.1: exact alarm izni API'leri; **58.0 davranış değişikliği:** ön plandayken bildirimler varsayılan gösterilir [35] |
| expo-haptics | 58.0.7 | — |
| expo-audio | 58.0.11 | `expo-av` SDK 55'te kaldırıldı [7][8][10]; preload + bellek içi cache (55.0.6/55.0.7); `playsInSilentMode` Android (56); iOS oturumu bir kez aktive edilip açık kalıyor (58) [37] |
| expo-av | 16.0.8 | **Kullanılmayacak** (son yayın Oca 2026 canary) |
| expo-updates | 58.0.21 | EAS Update; SDK 55+ Hermes bytecode diff ile daha küçük OTA [7] |
| expo-tracking-transparency | 58.0.2 | ATT prompt |
| @sentry/react-native | 8.34.0 (Expo pin ~8.28.0) | Expo config plugin |
| posthog-react-native | 4.85.3 | Opsiyonel analytics |
| @react-native-firebase/{app,analytics,remote-config} | 27.1.0 | İkinci faz |
| react-native-view-shot + expo-sharing | 6.2.1 + 58.0.22 | Paylaşım kartı |
| expo-store-review | 58.0.2 | Mağaza puanı isteği |
| expo-secure-store / expo-crypto | 58.0.2 / 58.0.7 | Hash + salt |

### 2.5 Test ve kalite

| Paket | Güncel | Not |
|---|---|---|
| vitest | 5.1.0 (5.0.0: 3 Eyl 2026) | Node ^22.12 — ortamda 22.23.4 var |
| fast-check | 4.10.2 | Property-based |
| jest / jest-expo | 30.5.2 / 58.0.14 | RN bileşen testleri |
| @testing-library/react-native | 14.1.0 | RN ≥0.78, React ≥19 |
| eslint / eslint-config-expo / typescript-eslint | 10.14.0 / 58.0.4 / 8.72.1 | TS 6.0.x ile |
| prettier | 3.9.10 | — |
| pnpm / turbo | 12.16.1 / 2.11.10 | — |
| @playwright/test | 1.63.0 (ortamda kurulu) | Web export görsel testi |

### 2.6 Bu oyuna nasıl uygularız
- Tüm Expo modülleri ve RN kütüphaneleri **Expo'nun `bundledNativeModules.json` pinleriyle** kurulur (bu ortamda `npx expo install` çalışmadığı için elle; CI'da `npx expo install --check` ile doğrulama).
- `typescript` kökte `~6.0.3`; `typescript-eslint` TS 7'yi destekleyene kadar yükseltme yok. `@typescript/native-preview` yalnızca lokal `tsgo --noEmit` hız deneyi.
- "Kullanma" listesi: `expo-av`, `react-native-iap` (Expo'da), `@legendapp/state` v3 beta, `seedrandom` (yerine `pure-rand`), `react-native-tracking-transparency` (yerine `expo-tracking-transparency`).

---

## 3. ADR-001 — Expo (React Native) + TypeScript monorepo

**Bağlam.** Solo geliştirici, AI ajanlarla yoğun çalışıyor; geliştirme ortamında yalnızca Node 22 + Chromium/Playwright var. Oyun metin ağırlıklı, turn-based, offline-first; reklam/IAP/bildirim entegrasyonu ve OTA içerik güncellemesi şart; backend yok. Hedef: publisher'a sunulabilir kalite, 12 ay içinde.

**Seçenekler.** (1) Expo/RN; (2) Flutter; (3) Unity; (4) Godot 4; (5) Capacitor + web.

**Karar.** Expo SDK 58 / RN 0.88.1 / TS 6.0.x, pnpm workspaces monorepo; saf TS oyun motoru; Expo Router ile 4-5 route; Reanimated 4 + Moti; FlashList 2; expo-sqlite + Drizzle + MMKV; zustand; i18next; expo-notifications (yalnızca yerel); expo-audio; expo-haptics; EAS Build/Update; AdMob (react-native-google-mobile-ads) + UMP; RevenueCat; Sentry; PostHog (opsiyonel, arayüz arkasında).

**Sonuçlar.**
- (+) Engine ve içerik tarayıcıda (web export) Playwright ile otomatik görsel teste açılır; ajanlar cihazsız doğrulama döngüsü kurar.
- (+) TS tek dil: engine, içerik doğrulama, build script'leri, testler.
- (+) EAS Update ile içerik/kod yamaları mağaza incelemesi beklemeden (mağaza kurallarına uygun kalarak) dağıtılır.
- (−) Native modüller için dev build şart (Expo Go yetmez); iOS build'leri bulutta (EAS) → kota/maliyet yönetimi.
- (−) Her Expo SDK'da (3 ayda bir) 1-2 gün yükseltme borcu; "en fazla 1 SDK geride kal" politikası.
- (−) Web export ≠ cihaz: haptik, ses oturumu, bildirim, reklam/IAP web'de no-op; gerçek cihaz testi haftalık TestFlight/internal track ile.

---

## 4. Monorepo ve engine mimarisi

### 4.1 Dizin yapısı

```
hayat-sim/
├─ pnpm-workspace.yaml          # packages/*, apps/*, tools/*
├─ .npmrc                       # node-linker=hoisted  (Metro/Nitro symlink sorunlarını azaltır)
├─ package.json                 # root scripts: lint, typecheck, test, e2e, content:build
├─ tsconfig.base.json           # strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes
├─ packages/
│  ├─ engine/                   # saf TS, sıfır RN bağımlılığı (vitest + fast-check)
│  │  ├─ src/{rng,state,reducers,select,save,effects,types}.ts
│  │  └─ test/{props,fixtures-v1..vN}
│  ├─ content/                  # olay JSON'ları + zod şemaları + build (TR/EN)
│  │  ├─ events/*.json, arcs/*.json, narrator/*.json
│  │  ├─ schema/*.ts            # zod
│  │  └─ build.ts               # doğrula → dist/content.v{N}.json + hash
│  └─ shared/                   # tipler, sabitler (opsiyonel)
├─ apps/
│  └─ mobile/                   # Expo app (Expo Router, src/app)
│     ├─ app.config.ts          # plugins, expo-build-properties
│     ├─ src/{app,ui,providers,services,store}
│     └─ e2e/                   # Playwright (web export'a karşı)
├─ tools/
│  ├─ content-lint/             # uzunluk/çeviri/etiket kontrolleri
│  └─ screenshots/              # Playwright koşucu + 390x844 / 430x932 baseline
└─ .github/workflows/{ci.yml,release.yml}
```

`apps/web-preview` ayrı bir app olarak gerekmez; `apps/mobile` içinden `expo export --platform web` zaten statik çıktı üretir (doğrulandı [51]).

### 4.2 Engine çekirdeği (deterministik, immutable, test edilebilir)

```ts
// packages/engine/src/types.ts
export type GameState = Readonly<{
  schemaVersion: number;          // save migration için
  seed: string; rngState: RngState;
  age: number; monthIndex: number;
  stats: Readonly<Record<StatId, number>>;      // 0..100 clamp
  flags: ReadonlySet<string>;                   // 'has_job', 'dumped_by_ayse'
  relationships: ReadonlyArray<Relationship>;
  history: ReadonlyArray<LogEntry>;             // UI feed; max N, gerisi SQLite'ta
  cooldowns: Readonly<Record<EventId, number>>;
  meta: { createdAt: number; playTimeMs: number; lastSeenWall: number; tamperFlags: number };
}>;

export type Action =
  | { type: 'CHOOSE'; eventId: EventId; choiceId: string }
  | { type: 'ADVANCE' }                           // bir ay/yıl ilerle
  | { type: 'RESUME'; nowWall: number; nowMono: number };

export type Effect =
  | { kind: 'haptic'; pattern: 'tick' | 'success' | 'ouch' | 'drama' }
  | { kind: 'sfx'; id: SfxId }
  | { kind: 'notify'; template: string; inHours: number }
  | { kind: 'analytics'; name: string; props?: Record<string, string | number> };

export function step(state: GameState, action: Action, content: ContentBundle): { state: GameState; effects: Effect[] };
```

- **RNG:** `pure-rand` xoroshiro128+; RNG durumu state'in içinde taşınır → aynı seed + aynı aksiyon dizisi = aynı hayat. Replay, bug raporu ve "arkadaşının hayatını yeniden oyna" özelliği bedavaya gelir.
- **Reducer'lar saf:** zaman, IO, Date.now yok; "şimdi" aksiyonun içinde gelir (`RESUME.nowWall`). Bu, engine'i Node'da milisaniyede binlerce hayat simüle edecek kadar hızlı ve test edilebilir yapar (balans aracı: 10.000 hayat simüle et, ölüm yaşı dağılımını çiz).
- **Olay seçimi:** `select(state, content, rng)` → uygun storylet'ler (koşullar, etiketler, cooldown, "pity" sayaçları: N turdur komik olay görmediyse ağırlık x3) → ağırlıklı örnekleme. Detay tasarımı T4'te; engine arayüzü burada sabitlenir.
- **Efektler bildirimsel:** engine "haptic ouch çal" der, uygulama katmanı `expo-haptics` çağırır. Web'de haptik yok → no-op; test ortamında efekt listesi assert edilir.

### 4.3 Kayıt formatı, sürümleme ve bütünlük

- **Depolama:** `expo-sqlite` tablosu `saves(slot TEXT PK, schema_version INT, payload TEXT, hash TEXT, updated_at INT)` + `history(id, slot, age, text, tags)` (paylaşım kartı/istatistik sorguları için) + `kv` yerine MMKV (ayarlar, oturum imleci, consent durumu).
- **Yazma deseni:** her `step` sonrası debounce (300 ms) ile tek transaction; `autosave_a/b/c` döner slot; uygulama arka plana giderken (`AppState` → background) anında flush. SQLite yazmaları atomiktir; ayrıca `PRAGMA journal_mode=WAL`.
- **Bütünlük:** `hash = sha256(payload + APP_SALT)` (`expo-crypto`). Amaç güvenlik değil **bozulma tespiti**: hash tutmazsa bir önceki slota düş ve anlatıcı dalga geçsin ("Kayıt dosyan bozulmuş. Hayatın gibi. Yedeği yüklüyorum.").
- **Migration:** `migrations: Array<{from:n,to:n+1,migrate:(raw)=>raw}>` sırayla; her eski sürüm için fixture dosyası `test/fixtures/save-v{N}.json` repoda kalır; test: her fixture → güncel sürüme yükselir ve zod şemasından geçer.
- **Yedekleme:** iOS Documents dizini iCloud yedeğine girer; Android `allowBackup` (Auto Backup, uygulama verisi 25 MB'a kadar) açık bırakılır → "telefon değiştirdim, hayatım gitti" şikâyeti azalır. Gerçek cloud save backend'siz yok; açık soru olarak not edildi.

### 4.4 İçerik paketi

- Her olay JSON'u zod şemasından geçer (`id`, `tags`, `conditions`, `weight`, `choices[].effects`, `text.tr`, `text.en`, `narratorVoice`).
- `content:build` çıktıyı tek `content.v{N}.json` + hash olarak üretir; uygulama başlangıçta gömülü paketi yükler, varsa indirilen daha yeni paketi (bkz. 6.6) kullanır.
- Content-lint: metin uzunluğu (TR/EN), eksik çeviri, etiket tutarlılığı, "yasaklı kelime" listesi (T9 kırmızı çizgiler).

### 4.5 Bu oyuna nasıl uygularız
- Sprint 0'da önce `packages/engine` + `packages/content` iskeleti ve 20 örnek olay; UI'dan önce engine Node'da 1.000 hayat simüle edebilmeli (balans raporu).
- `step()` imzası ADR'de dondurulur; UI yalnızca `state` okur ve `Action` gönderir (zustand store engine'i sarar).
- Anlatıcı sesi (T3) için metin şablonları içerikte; engine metin üretmez, `textKey` döner → lokalizasyon ve A/B testi ucuzlar.

---

## 5. Test stratejisi ve CI

### 5.1 Katmanlar

| Katman | Araç | Ne test eder | Nerede koşar |
|---|---|---|---|
| Engine birim + property | vitest 5 + fast-check 4 | "Geçerli aksiyon dizisi NaN/negatif stat üretmez", "save→load→save kimlik", "aynı seed aynı hayat", "her yaşta en az 1 uygun olay var" | Bu ortam + CI |
| İçerik | vitest + zod + content-lint | Şema, çeviri eksikleri, uzunluk sınırları (TR ≤ 280 kr, EN ≤ 240 kr seçenek metni; sayılar T8'den gelir) | Bu ortam + CI |
| UI bileşen | jest-expo 58 + RNTL 14 | Olay kartı, seçenek butonları, stat çubukları; erişilebilirlik rol/etiketleri | Bu ortam + CI |
| Görsel/akış | Playwright 1.63 → `expo export --platform web` | FTUE ilk 60 sn akışı, 390x844 ve 430x932 ekran görüntüsü baseline'ları, metin taşması | Bu ortam + CI (doğrulandı) |
| Lokalizasyon uzunluk | Playwright snapshot (TR/EN toggle) + pseudo-locale (`[!!! Ţéxţ !!!]`) | Buton/karta sığma | CI |
| Cihaz | Dev build + manuel; ileride Maestro | Haptik, ses, bildirim, reklam/IAP sandbox | Geliştirici telefonu / TestFlight |

Web export için kural: UI katmanı yalnızca `providers/*` arayüzleri üzerinden native'e dokunur; web'de `NoopAds`, `NoopIap`, `WebNotifications` (console.log), `WebHaptics` (no-op). `testID` ve `accessibilityLabel` her etkileşimli öğede zorunlu (react-native-web'de bazı bileşenlerin testID'yi DOM'a geçirmediği biliniyor [46] → ARIA role/label ile seçici).

### 5.2 CI (GitHub Actions)

```yaml
# .github/workflows/ci.yml (özet)
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v5 { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm -r typecheck && pnpm -r lint && pnpm -r test
      - run: pnpm --filter content build
      - run: pnpm --filter mobile exec expo export --platform web
      - run: pnpm --filter mobile exec playwright install --with-deps chromium
      - run: pnpm --filter mobile e2e          # serve dist + playwright test
      - uses: actions/upload-artifact@v4 { name: screenshots, path: apps/mobile/e2e/__screenshots__ }
      - run: pnpm --filter mobile exec npx expo-doctor
# .github/workflows/release.yml: tag v* → eas build --platform all --profile production --non-interactive (EXPO_TOKEN)
```

EAS Workflows (Expo'nun kendi CI'ı) alternatif; GitHub Actions ücretsiz dakikası ve Playwright artefaktları için yeterli. Tag'li build'ler EAS kotası tüketir (bkz. risk).

### 5.3 Kod kalitesi
- `tsconfig`: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`.
- ESLint 10 (flat config) + `eslint-config-expo` + `typescript-eslint` (type-aware kurallar engine'de açık) + Prettier 3.9.
- Zod 4 şemaları içerik için tek doğruluk kaynağı; TS tipleri `z.infer` ile türetilir.
- Ajan disiplini: her PR'da "engine değişti → property test eklendi mi?" kontrol listesi; `CLAUDE.md`'de ADR'lere link.

### 5.4 Bu oyuna nasıl uygularız
- Sprint 0 "Definition of Done": CI yeşil + Playwright'ta FTUE ekran görüntüsü artefaktı + 1.000 hayat simülasyon raporu.
- Her olay PR'ı content-lint'ten geçmeden merge olmaz; mizah onayı (T3) ayrı bir insan adımı.

---

## 6. Performans ve UX teknolojisi

### 6.1 60 fps olay akışı
- Hayat akışı "sohbet" gibi aşağıya doğru büyüyen bir liste: FlashList 2 (`maintainVisibleContentPosition`, inverted olmayan ama alta kaydıran yaklaşım); satır bileşenleri `memo`, inline closure yok, sabit tipografi; görsel yok (emoji/ikon yeterli).
- Uzun geçmiş (yüzlerce yıl × olay) bellekte tutulmaz: son 150 satır state'te, gerisi SQLite'tan sayfalı.
- Reanimated 4 CSS transitions ile kart giriş animasyonu (ucuz); Lottie yalnızca "ölüm", "evlilik", "piyango" gibi ≤5 büyük anda.

### 6.2 Daktilo (typewriter) efekti
- Harf başına `setState` yapma (metin ağırlıklı oyunda en sık 60 fps katili). Yaklaşım: 2-3 kelimelik parçalar halinde `requestAnimationFrame` zamanlı reveal; 120 karakter üstü metinlerde hız x2; dokununca tamamını göster. Alternatif: Reanimated shared value + `useAnimatedProps` ile `TextInput`'a yazma (tek native prop güncellemesi). Skia Paragraph yalnızca paylaşım kartında.
- Anlatıcının "duraksaması" (comic timing) için içerikte `…` işaretleri → 250 ms bekleme (T3 ton kitabıyla uyumlu).

### 6.3 Haptik kalıpları
- `expo-haptics` preset'leri: seçim = `selectionAsync` / `impact(Light)`; başarı = `notification(Success)`; "hayat sana tokat attı" = `impact(Heavy)` + 80 ms + `impact(Medium)`; dram = üçlü hafif vuruş. iOS Core Haptics özel dalga formları Expo'da yok → preset kombinasyonlarıyla yetin. Ayarlardan kapatılabilir; ilk 60 sn'de haptik "ilk gülüşle" eşleştirilir.

### 6.4 Ses hattı
- Kaynaklar: **Kenney.nl** (CC0, ticari kullanım, atıf gerekmez — ikincil kaynaklarla doğrulandı [48]), **Freesound** (ses bazında CC0 / CC-BY / CC-BY-NC — yalnızca CC0 filtresi; CC-BY kullanılırsa `CREDITS.md`), OpenGameArt (lisans filtresi). NC lisanslı hiçbir şey girmez.
- Pipeline: `ffmpeg -af loudnorm` ile -16 LUFS normalize → 44.1 kHz mono → `.m4a` (AAC) iOS/Android; web için `.mp3`/`.ogg`; toplam SFX bütçesi ≤ 3 MB, 25-40 kısa efekt.
- `expo-audio`: başlangıçta `setAudioModeAsync({ playsInSilentMode: false })` (oyun sessiz moda saygı duyar), SFX için 4-6 player'lık havuz, preload cache (55.0.6+). Müzik v1'de yok (boyut + lisans + "sessiz oynanan" oyun kategorisi).

### 6.5 Boyut ve soğuk başlangıç bütçesi
- Bütçe: Android indirme ≤ 35 MB / kurulu ≤ 80 MB; iOS indirme ≤ 50 MB. Araçlar: `expo-build-properties` ile `enableMinifyInReleaseBuilds` + `enableShrinkResourcesInReleaseBuilds` (RN 0.88 şablonunda varsayılan kapalı [33]); Hermes bytecode; tek variable font ailesi (RN 0.88 `fontVariationSettings`); Firebase SDK'sı v1'de yok; Skia yalnızca gerekiyorsa.
- Soğuk başlangıç hedefi: orta segment Android'de (Galaxy A3x/A5x) uygulama açılış → ilk etkileşimli kart < 2 s. Ölçüm: `performance.now()` işaretleri (`app_start`, `first_card_interactive`) → analytics; splash'te içerik paketi parse'ı lazy (gömülü JSON `require` + ilk 1 olayı senkron hazırla).
- Android 16 KB sayfa boyutu: RN 0.88 şablonu NDK 27.1 kullanıyor; Expo/RN kütüphanelerinin `.so` dosyaları 16 KB hizalı mı, `zipalign -c -P 16 -v 4` ile CI'da (EAS artefaktında) kontrol — 1 Şubat 2027'den sonra güncelleme şartı [16].

### 6.6 Offline kayıt güvenilirliği, arka plan/ön plan, zaman ve saat hilesi
- `AppState` dinleyicisi: `background` → anında flush + ses durdur + "geri gel" bildirimi planla (20-24 s sonra; metin T7'den); `active` → bildirimi iptal et, `RESUME` aksiyonu gönder.
- **Saat hilesi (backend yok, kabul ediyoruz ama ucuz önlem alıyoruz):** `lastSeenWall` (Date.now) ve işlem içi monoton saat (`performance.now()`, Hermes'te süreç başlangıcından itibaren monoton) saklanır. Kurallar: (1) `now < lastSeenWall` → geri sarma: geçen süre 0, `tamperFlags++`, anlatıcı laf sokar; (2) süreç hayattayken `Δwall − Δmono > 5 dk` → ileri sarma şüphesi: offline kazanım tavana (8 saat) kilitlenir; (3) ekonomi tasarımı saat atlamayı değersiz kılar (günlük ödül "takvim günü + en az 20 saat aralık"; sınırsız bekleme sayaçları yok). Android `SystemClock.elapsedRealtime` (boot'tan beri, uyku dahil, monoton) daha sağlam [18] ama Expo'da hazır modül yok; gerekirse 30 satırlık Expo Module ile eklenir (v2).
- Statik içerik güncellemeleri (6.6'nın devamı live-ops bölümünde): uygulama ağ varsa `https://<github-pages>/content/manifest.json` çeker (versiyon + sha256), paketi indirir, hash doğrular, bir sonraki açılışta kullanır. EAS Update ise kod yamaları için. Böylece içerik güncellemesi Expo MAU kotasına yazılmaz.

### 6.7 Bu oyuna nasıl uygularız
- Sprint 1'de performans "kapı" testi: 2.000 satırlık sahte hayat akışında FlashList 60 fps (Android dev build, `perf monitor`), daktilo efekti açıkken JS thread < %60.
- Ses ve haptik "ilk gülüş" anına (T8: < 20 sn) bağlanır; ikisi de ayarlardan kapatılabilir ve mağaza inceleme notlarında belirtilir.

---

## 7. Platform gereksinimleri 2026

### 7.1 iOS / App Store
- **28 Nisan 2026'dan itibaren** App Store Connect'e yüklenen iOS uygulamaları **Xcode 26 ve iOS 26 SDK** ile derlenmiş olmalı [19]. Expo SDK 58 iOS 27 / Xcode 27 hedefliyor [2]; EAS Build imajları buna uygun.
- **Minimum deployment target:** Expo SDK 58 `expo-modules-core` podspec `:ios => '16.4'` [32]; RN 0.88 çekirdeği 15.1 [33] ama Expo 16.4'ü zorunlu kılar (SDK 56'da yükseltildi [35][36]). Apple'ın kendi minimumu (iOS 13, 9 Eyl 2026) bizi etkilemez.
- **Privacy manifest (`PrivacyInfo.xcprivacy`):** 1 Mayıs 2024'ten beri "required reason API" kullanımları için onaylı gerekçe şart; üçüncü parti SDK'lar (AdMob, Sentry, RevenueCat) kendi manifest'lerini getirir; Expo config plugin'leri uygulama manifest'ini üretir [19][22]. Kontrol: `NSPrivacyTracking` reklam kişiselleştirme için `true`, `NSPrivacyTrackingDomains` AdMob'un bildirdiği alanlar.
- **ATT:** Kişiselleştirilmiş reklam / IDFA için `expo-tracking-transparency` ile izin; UMP formundan **sonra**, ilk reklamdan **önce**; reddedilirse kişiselleştirilmemiş reklam (`requestNonPersonalizedAdsOnly`). ATT metni mizahi olabilir ama Apple'ın "neden" cümlesi net olmalı [23].
- **Yaş derecelendirmesi:** Temmuz 2025'te 13+/16+/18+ eklendi, 31 Ocak 2026'ya kadar yeni sorular yanıtlanmalıydı [20]. Tanım tablosuna göre [21]: "sık küfür veya kaba mizah" → 13+; "seyrek alkol/sigara/uyuşturucu referansı" → 13+, **"sık"** → 18+; "sık olgun/müstehcen temalar" → 16+; "seyrek simüle kumar" → 13+, "sık" → 18+; gerçekçi şiddet seyrek → 13+, sık → 18+. Kasım 2026'da "flört/sanal arkadaş" ve "gerçek konum paylaşımı" tanımlayıcıları ekleniyor; flört uygulamaları 18+ oluyor (12 Oca 2027'ye kadar beyan) [50] — **oyunumuzun "ilişki" olayları flört uygulaması değildir; soruya "hayır" denebilmesi için gerçek kişilerle eşleştirme/sohbet özelliği asla olmayacak.**

### 7.2 Android / Google Play
- **Target API:** 31 Ağustos 2026'dan itibaren yeni uygulama ve güncellemeler **API 36 (Android 16)**; mevcut uygulamalar yeni kullanıcılara görünmek için API 35; uzatma 1 Kasım 2026'ya kadar (geçti) [14][15]. RN 0.88 şablonu: `minSdk 24, compileSdk 37, targetSdk 36, NDK 27.1, Kotlin 2.2` [33]; Expo SDK 58'in Android varsayılanları bu oturumda birincil kaynaktan okunamadı (bare şablon `rootProject.ext`'ten okuyor) → `expo-build-properties` ile açıkça `minSdkVersion 24 / compileSdkVersion 37 / targetSdkVersion 36` pin'lenir.
- **16 KB sayfa boyutu:** API 35+ hedefleyen tüm uygulamalar 64-bit cihazlarda 16 KB desteklemeli; **1 Şubat 2027'den sonra desteklemeyen güncellemeler yayınlanamaz** [16]. AGP ≥ 8.5.1 ve NDK r28+ varsayılan hizalı; RN 0.88 NDK 27.1 kullandığı için EAS artefaktında `zipalign -c -P 16` kontrolü zorunlu.
- **Bildirim izni:** Android 13+ `POST_NOTIFICATIONS` runtime izni; yeni kurulumda bildirimler kapalı; izni kullanıcı aksiyonu bağlamında iste, reddedilirse `areNotificationsEnabled()` ile sessiz kal [17]. Expo: `Notifications.requestPermissionsAsync()`.
- **Edge-to-edge:** Expo SDK 58 şablonunda `edgeToEdgeEnabled=true` [gradle.properties]; `react-native-safe-area-context` 5.11 ile inset'ler.
- **Data Safety formu:** AdMob (reklam kimliği, yaklaşık konum IP üzerinden, cihaz tanımlayıcıları), Sentry (çökme günlükleri, cihaz bilgisi), RevenueCat (satın alma geçmişi), PostHog (uygulama etkileşimleri) beyan edilir; her SDK'nın yayınladığı "data safety" rehberi kaynak gösterilir. support.google.com bu oturumda okunamadı → T9 ile birlikte son kontrol.
- **Hedef kitle:** Play Console "Target audience and content" beyanında **13+ (ya da 16+)**; 13 yaş altı seçilmez → Families politikası ve COPPA kapsamına girilmez; "unknowingly collected" riskini azaltmak için yaş kapısı yerine mağaza derecelendirmesi + UMP/ATT.

### 7.3 Reklam onayı (UMP / GDPR / KVKK)
- Google, AEA/BK/İsviçre'de reklam göstermek için Ocak 2024'ten beri IAB TCF uyumlu, Google sertifikalı bir CMP istiyor; UMP SDK ücretsiz ve sertifikalı [24][25]. Akış: `AdsConsent.gatherConsent()` (requestInfoUpdate + loadAndShowConsentFormIfRequired) → `canRequestAds` true ise `mobileAds().initialize()` → reklam yükle. Ayarlarda "Gizlilik seçenekleri" girişi (`showPrivacyOptionsForm`) zorunlu. Debug geography ile AEA simülasyonu.
- Türkiye için KVKK aydınlatma metni + reklam kişiselleştirme onayı ayarlar ekranında; detay T9.
- TCF v2.3 geçişi (Şubat 2026) react-native-google-mobile-ads 17.x ile birlikte gelen UMP sürümünde kapsanıyor (arama özeti; birincil kaynak okunamadı → doğrulanmalı).

### 7.4 Bu oyuna nasıl uygularız
- `app.config.ts`: `ios.deploymentTarget` dokunulmaz (16.4), `android.minSdkVersion 24 / targetSdkVersion 36 / compileSdkVersion 37`, `edgeToEdgeEnabled true`, `expo-notifications` plugin `enableRemoteNotifications:false`, `expo-tracking-transparency` `userTrackingPermission` metni, `react-native-google-mobile-ads` `androidAppId/iosAppId` + `userTrackingUsageDescription` + `skAdNetworkItems`.
- Yayın öncesi checklist'e: yaş derecelendirme anketi "16+" hedefiyle doldurulur; içerik ekibi (T3) alkol/uyuşturucu referanslarını "seyrek" sınırında tutar; Data Safety formu SDK listesiyle eşleşir; privacy manifest EAS build log'unda doğrulanır.

---

## 8. Tam bağımlılık listesi (önerilen pinler)

Expo pinleri (`bundledNativeModules.json`, SDK 58) önceliklidir; diğerleri npm `latest` (5 Kas 2026).

**apps/mobile — runtime**
`expo ~58.0.23`, `react 19.3.0`, `react-dom 19.3.0`, `react-native 0.88.1`, `react-native-web ~0.21.4`, `expo-router ~58.0.30`, `expo-constants ~58.0.15`, `expo-linking ~58.0.16`, `expo-status-bar ~58.0.4`, `expo-system-ui ~58.0.7`, `expo-splash-screen ~58.0.13`, `expo-font ~58.0.11`, `expo-localization ~58.0.5`, `expo-haptics ~58.0.7`, `expo-audio ~58.0.11`, `expo-notifications ~58.1.8`, `expo-sqlite ~58.0.15`, `expo-crypto ~58.0.7`, `expo-secure-store ~58.0.2`, `expo-sharing ~58.0.22`, `expo-file-system ~58.0.13`, `expo-updates ~58.0.21`, `expo-tracking-transparency ~58.0.2`, `expo-store-review ~58.0.2`, `expo-application ~58.1.2`, `expo-device ~58.0.5`, `expo-keep-awake ~58.0.3`, `expo-build-properties ~58.0.12`, `expo-dev-client ~58.0.18`, `react-native-reanimated 4.7.1`, `react-native-worklets 0.13.0`, `react-native-gesture-handler ~3.3.0`, `react-native-screens ~4.30.1`, `react-native-safe-area-context ~5.11.1`, `@shopify/flash-list 2.3.2`, `moti ^0.30.0`, `lottie-react-native ~7.5.0`, `react-native-svg 15.16.0`, `react-native-mmkv ^4.3.2`, `react-native-nitro-modules ^0.37.2`, `drizzle-orm ^0.45.4`, `zustand ^5.0.16`, `i18next ^26.7.2`, `react-i18next ^17.1.13`, `zod ^4.6.7`, `pure-rand ^8.4.2`, `react-native-google-mobile-ads ^17.4.0` (yedek: `16.5.0`), `react-native-purchases ^11.0.1` (alternatif: `expo-iap ^6.4.3`), `@sentry/react-native ~8.28.0`, `react-native-view-shot ^6.2.1`, `posthog-react-native ^4.85.3` (opsiyonel, faz 2).

**dev / test / tooling**
`typescript ~6.0.3`, `@types/react ~19.3.0`, `jest ^30.5.2`, `jest-expo ~58.0.14`, `@testing-library/react-native ^14.1.0`, `vitest ^5.1.0`, `fast-check ^4.10.2`, `@playwright/test ^1.63.0`, `eslint ^10.14.0`, `eslint-config-expo ~58.0.4`, `typescript-eslint ^8.72.1`, `prettier ^3.9.10`, `drizzle-kit ^0.31.11`, `turbo ^2.11.10`, `pnpm 12.16.1` (packageManager alanı), `eas-cli` (global, npm `latest`).

**Faz 2 adayları (şimdi kurulmaz):** `@react-native-firebase/app|analytics|remote-config 27.1.0`, `react-native-applovin-max 9.6.0`, `@shopify/react-native-skia 2.14.0`, `expo-background-task 58.0.12`, `expo-insights 58.0.11`.

---

## 9. İlk 2 hafta teknik kurulum checklist'i

**Hafta 1 — iskelet ve engine**
1. Repo: pnpm workspaces, `.npmrc` (`node-linker=hoisted`), `tsconfig.base.json` strict, ESLint 10 flat config, Prettier, Husky yok (CI yeterli; ajanlar hook'lara takılmasın).
2. `packages/engine`: tipler, `pure-rand` sarmalayıcı, `step()` iskeleti, 5 reducer (yaşlan, stat uygula, olay seç, seçim uygula, öl), vitest + ilk 10 property testi.
3. `packages/content`: zod şemaları, 20 örnek olay (TR/EN), `build.ts`, content-lint; `pnpm content:build` çıktısı hash'li.
4. `tools/sim`: 1.000 hayat simülasyonu CLI → ölüm yaşı dağılımı, en sık 10 olay, "0 uygun olay" uyarıları.
5. `apps/mobile`: `create-expo-app` (SDK 58) → monorepo'ya taşı, Expo Router `src/app`, 4 route (başla, hayat, kart, ayarlar), zustand store engine'i sarıyor.
6. `expo export --platform web` + Playwright: FTUE ekran görüntüsü testi CI'da (bu ortamda doğrulandı).
7. GitHub Actions `ci.yml` yeşil; `expo-doctor` temiz.

**Hafta 2 — native yüzeyler ve kayıt**
8. `expo-sqlite` + Drizzle şeması + migration 1; MMKV ayarlar; autosave + döner yedek + hash; "bozuk kayıt" senaryosu testi.
9. `expo-haptics`, `expo-audio` havuzu, 10 CC0 SFX (Kenney) normalize edilmiş; web no-op provider'lar.
10. `expo-notifications` yerel: izin akışı (Android 13+), "geri gel" planlama/iptal; `enableRemoteNotifications:false`.
11. `AppState` + `RESUME` aksiyonu + saat hilesi kuralları + testleri.
12. EAS hesabı: `eas init`, `eas build --profile development --platform android` (ilk dev build); iOS için Apple Developer hesabı + `eas credentials`; TestFlight akışı.
13. `react-native-google-mobile-ads` dev build'de test reklam kimlikleriyle: UMP debug geography EEA → form → `canRequestAds` → rewarded test reklamı; ATT prompt iOS.
14. RevenueCat projesi (sandbox ürünleri: 1 reklam kaldırma, 1 kozmetik paket) veya `expo-iap` sandbox; `IapProvider` arayüzü.
15. Sentry config plugin + EAS source map yükleme; i18next TR/EN + pseudo-locale; `release.yml` tag → EAS production build (kuru çalıştırma).
16. ADR-001 ve bu checklist `docs/plan`'a; `CLAUDE.md`'de ajanlar için "engine saf kalır / testID zorunlu / Expo pinlerine uy" kuralları.

---

## 10. Risk kaydı (ilk 10 teknik risk)

| # | Risk | Olasılık / Etki | Azaltma |
|---|---|---|---|
| 1 | Expo SDK çeyreklik yükseltmelerinde (New Arch, Nitro, Worklets) native modül kırılması (örn. Reanimated 4.7 RN 0.83-0.85'i bıraktı) | Yüksek / Orta | Expo pinlerine uy; en fazla 1 SDK geride; yükseltme yalnızca sprint sınırında ayrı branch; `expo-doctor` CI'da |
| 2 | `react-native-google-mobile-ads` v17 yeniden yazımı (Eyl 2026) ve Android "Next-Gen" backend'inde regresyon | Orta / Yüksek (gelir) | `AdProvider` arayüzü; 16.5.0 yedek pin; dev build'de haftalık reklam smoke testi; MAX alternatifi hazır |
| 3 | Bu ortamda cihaz yok → iOS'a özgü hatalar (ses oturumu, haptik, SceneDelegate) geç fark edilir | Yüksek / Orta | Haftalık TestFlight; web/Android dev build ile erken; iOS'a özgü kodu provider'larda izole et |
| 4 | EAS kota/maliyet: ücretsiz plan build sınırı (doğrulanmalı) ve EAS Update 1.000 MAU tavanı [38] | Orta / Orta | Tag'li build'ler; içerik güncellemeleri statik CDN üzerinden; soft launch öncesi Starter plana geç |
| 5 | Kayıt bozulması / veri kaybı ("50 yıllık hayatım gitti") | Düşük / Çok yüksek | WAL, döner 3 slot, hash doğrulama, migration fixture testleri, OS yedeklemesi açık |
| 6 | Boyut ve soğuk başlangıç şişmesi (Firebase, Skia, Lottie, fontlar) | Orta / Orta | Bütçeler (6.5), R8/shrink açık, CI'da web bundle boyutu eşiği, faz 2 SDK'ları ertele |
| 7 | Mağaza reddi: UMP/ATT sırası, privacy manifest, yaş derecelendirme tutarsızlığı, Data Safety | Orta / Yüksek | 7.4 checklist; inceleme notlarında reklam akışı videosu; T9 ile ortak son kontrol |
| 8 | Lokalizasyon taşması (TR/EN uzunluk farkı, variable font fallback) | Yüksek / Düşük | content-lint uzunluk sınırları, pseudo-locale Playwright snapshot, 2 ekran boyutu |
| 9 | Metin ağırlıklı UI'da düşük segment Android'de jank (daktilo efekti, uzun liste) | Orta / Orta | 6.1-6.2 kuralları; Sprint 1 performans kapısı; `perf monitor` ile ölçüm |
| 10 | TS 7 / toolchain uyumsuzluğu (typescript-eslint <6.1, Expo şablonu ~6.0.3) ve ajanların "latest" kurma refleksi | Orta / Düşük | Kökte `typescript ~6.0.3` pin + `pnpm.overrides`; `CLAUDE.md` kuralı; CI'da `expo install --check` |

Ek (kabul edilen): saat hilesi ile offline kazanım — ekonomi tasarımıyla değersizleştirilir; cloud save yokluğu — açık soru.

---

## Bu oyun için öneriler (öncelikli, puanlı)

Puan = Etki (1-5) × Uygulama kolaylığı (1-5).

| Öncelik | Öneri | Etki | Kolaylık | Puan |
|---|---|---|---|---|
| P0 | ADR-001'i kabul et: Expo SDK 58 + TS 6.0.x + pnpm monorepo; engine saf TS | 5 | 5 | 25 |
| P0 | `expo export web` + Playwright görsel test döngüsünü Sprint 0'da CI'a koy (ajanların tek gerçek doğrulama aracı) | 5 | 5 | 25 |
| P0 | Deterministik engine + 1.000 hayat simülasyon aracı (balans ve mizah yoğunluğu ölçümü) | 5 | 4 | 20 |
| P0 | Kayıt: SQLite+Drizzle+MMKV, hash + döner yedek + migration fixture'ları | 5 | 4 | 20 |
| P1 | Reklam: AdMob 17.4 + UMP akışı, `AdProvider` arayüzü, 16.5 yedek pin; rewarded öncelikli | 5 | 3 | 15 |
| P1 | IAP: RevenueCat (backend'siz doğrulama + publisher'ın tanıdığı metrikler); `expo-iap` yedek | 4 | 4 | 16 |
| P1 | Yerel bildirim yalnızca; `enableRemoteNotifications:false`; izin bağlam içinde | 4 | 5 | 20 |
| P1 | İçerik paketleri için imzalı statik JSON (GitHub Pages) + EAS Update yalnızca kod | 4 | 4 | 16 |
| P1 | Yaş derecelendirmesini 16+'ya göre içerik kurallarına bağla (alkol/uyuşturucu "seyrek", kumar yok) | 4 | 4 | 16 |
| P2 | Sentry + PostHog (arayüz arkasında), publisher SDK'sı için takılabilir `Analytics` | 3 | 4 | 12 |
| P2 | Android ana ekran widget'ı (SDK 58 duyurusu; doğrulanmalı) ile "karakterin durumu" — retention deneyi | 3 | 2 | 6 |
| P2 | `SystemClock.elapsedRealtime` için 30 satırlık Expo Module (saat hilesi v2) | 2 | 3 | 6 |

---

## Açık sorular

1. EAS ücretsiz plan build kotası ve kuyruk süreleri (expo.dev/pricing okunamadı) — soft launch öncesi plan seçimi.
2. RevenueCat 2026 fiyatlandırması (ücretsiz MTR eşiği ve yüzde) doğrulanamadı; `expo-iap` ile cihaz üstü StoreKit 2 JWS doğrulamasının publisher için yeterliliği.
3. `react-native-google-mobile-ads` 17.x Android "Next-Gen" backend'inin UMP/mediation kapsamı ve README'deki "To-Do" maddelerinin güncel durumu (dev build'de test edilecek).
4. AppLovin MAX RN 9.6.0'ın New Architecture ve Expo config plugin durumu (support.axon.ai okunamadı).
5. Expo SDK 58 "agent CLI" ve `expo-sqlite` ajan skill'inin somut komutları — ajan iş akışına nasıl bağlanır?
6. Hermes V1'in SDK 58'de varsayılan olup olmadığı; soğuk başlangıç farkı ölçülmeli.
7. Backend'siz cloud save: iOS iCloud key-value/CloudKit (Expo modülü?) ve Android Auto Backup'ın oyunun 25 MB altı kaydı için yeterliliği.
8. Apple'ın Kasım 2026 "flört/sanal arkadaş" tanımlayıcısının, ilişki olayları olan tek oyunculu hayat simülasyonuna uygulanıp uygulanmayacağı (anket metni 16 Kas 2026'da görülecek).
9. Google Play Data Safety formunun 2026 güncellemeleri (support.google.com okunamadı) — T9 ile birlikte.
10. Türkiye'de UMP formu gösterilmeli mi (KVKK için ayrı onay akışı?) — T9.

---

## Kaynaklar

1. npm registry — `npm view <pkg> version|time|peerDependencies|dist-tags` sorguları, 2026-11-05 (expo, react-native, expo-*, react-native-*, zustand, i18next, vitest, fast-check, typescript, eslint, typescript-eslint, pure-rand, seedrandom, drizzle-orm, @legendapp/state vb.). https://www.npmjs.com/package/expo · https://www.npmjs.com/package/react-native · https://www.npmjs.com/package/expo-iap · https://www.npmjs.com/package/react-native-purchases · https://www.npmjs.com/package/react-native-google-mobile-ads
2. Expo SDK 58 changelog — https://expo.dev/changelog/sdk-58
3. Expo SDK 58 beta — https://expo.dev/changelog/sdk-58-beta
4. React Native 0.88 blog — https://reactnative.dev/blog/2026/10/19/react-native-0.88
5. React Native v0.88.0 release notes — https://github.com/facebook/react-native/releases/tag/v0.88.0
6. React Native v0.86.0 release notes — https://github.com/facebook/react-native/releases/tag/v0.86.0
7. Expo SDK 55 changelog (Legacy Arch kaldırıldı, expo-av kaldırıldı, Hermes V1 opt-in) — https://expo.dev/changelog/sdk-55
8. Expo: How to upgrade to SDK 55 — https://expo.dev/blog/upgrading-to-sdk-55
9. Expo SDK 54 changelog (son Legacy Arch SDK'sı) — https://expo.dev/changelog/sdk-54
10. Software Mansion: moving from expo-av to expo-video/expo-audio — https://swmansion.com/blog/the-future-of-video-in-react-native-moving-from-expo-av-to-expo-video-6f4f78e51196/
11. react-native-iap tartışması: expo-iap vs react-native-iap — https://github.com/hyochan/react-native-iap/discussions/3105
12. OpenIAP Expo setup — https://www.openiap.dev/docs/setup/expo
13. expo-iap README (OpenIAP, StoreKit 2, Play Billing 9.1.0) — https://github.com/hyodotdev/openiap/tree/main/libraries/expo-iap
14. Android Developers: Meet Google Play's target API level requirement — https://developer.android.com/google/play/requirements/target-sdk
15. Play Console Help: Target API level requirements — https://support.google.com/googleplay/android-developer/answer/11926878
16. Android Developers: Support 16 KB page sizes (1 Şub 2027 şartı) — https://developer.android.com/guide/practices/page-sizes
17. Android Developers: Notification runtime permission (Android 13+) — https://developer.android.com/develop/ui/views/notifications/notification-permission
18. Android `SystemClock` referansı (elapsedRealtime monoton) — https://developer.android.com/reference/android/os/SystemClock
19. Apple Developer: Upcoming requirements (Xcode 26 / iOS 26 SDK, 28 Nis 2026; privacy manifest) — https://developer.apple.com/news/upcoming-requirements/
20. Apple Developer News: Updated age ratings in App Store Connect — https://developer.apple.com/news/?id=ks775ehf
21. App Store Connect: Age ratings values and definitions — https://developer.apple.com/help/app-store-connect/reference/age-ratings-values-and-definitions
22. Apple: Privacy manifest files — https://developer.apple.com/documentation/bundleresources/privacy-manifest-files
23. Apple: App Tracking Transparency — https://developer.apple.com/documentation/apptrackingtransparency
24. Google AdMob Help: Consent management requirements for EEA/UK/CH — https://support.google.com/admob/answer/13554116
25. Google AdMob: Disclose to EEA users (UMP) — https://developers.google.com/admob/android/privacy/gdpr
26. react-native-google-mobile-ads README (Expo, UMP, New Arch) — https://github.com/invertase/react-native-google-mobile-ads
27. react-native-google-mobile-ads releases (v17.x) — https://github.com/invertase/react-native-google-mobile-ads/releases
28. AppLovin MAX React Native releases — https://github.com/AppLovin/AppLovin-MAX-React-Native/releases
29. react-native-mmkv releases (4.2.0 Nitro ≥0.35; 4.3.2) — https://github.com/margelo/react-native-mmkv/releases
30. react-native-reanimated releases (4.7.0 RN 0.86–0.88) — https://github.com/software-mansion/react-native-reanimated/releases
31. Reanimated 4 stable release — https://blog.swmansion.com/reanimated-4-stable-release-the-future-of-react-native-animations-ba68210c3713
32. ExpoModulesCore.podspec (sdk-58, iOS 16.4) — https://raw.githubusercontent.com/expo/expo/sdk-58/packages/expo-modules-core/ExpoModulesCore.podspec
33. RN 0.88 şablonu android/build.gradle (minSdk 24, compile 37, target 36) — https://raw.githubusercontent.com/react-native-community/template/0.88-stable/template/android/build.gradle ; RN iOS min 15.1 — https://raw.githubusercontent.com/facebook/react-native/0.88-stable/packages/react-native/scripts/cocoapods/helpers.rb
34. Expo SDK 58 bundledNativeModules.json — https://raw.githubusercontent.com/expo/expo/sdk-58/packages/expo/bundledNativeModules.json ; Expo şablon pinleri — https://www.npmjs.com/package/expo-template-default
35. expo-notifications CHANGELOG (sdk-58) — https://raw.githubusercontent.com/expo/expo/sdk-58/packages/expo-notifications/CHANGELOG.md
36. expo-sqlite CHANGELOG (sdk-58) — https://raw.githubusercontent.com/expo/expo/sdk-58/packages/expo-sqlite/CHANGELOG.md
37. expo-audio CHANGELOG (sdk-58) — https://raw.githubusercontent.com/expo/expo/sdk-58/packages/expo-audio/CHANGELOG.md
38. Expo pricing (EAS Update ücretsiz 1.000 MAU; arama özeti) — https://expo.dev/pricing
39. react-native-web releases — https://github.com/necolas/react-native-web/releases
40. Hermes README (Hermes V1 / static Hermes) — https://github.com/facebook/hermes
41. InfoQ: TypeScript 7.0 released with native Go compiler — https://www.infoq.com/news/2026/08/typescript-7-released/
42. Ionic: Announcing Capacitor 8 — https://ionic.io/blog/announcing-capacitor-8 ; Capacitor 8.5 — https://ionic.io/blog/capacitor-8-5-released ; Support policy — https://capacitorjs.com/docs/main/reference/support-policy
43. Godot Mobile update — April 2026 — https://godotengine.org/article/godot-mobile-update-apr-2026/ ; Godot releases — https://github.com/godotengine/godot/releases
44. CG Channel: Unity subscription price changes (Pro 2.310 $, Personal 200 bin $ eşiği) — https://www.cgchannel.com/2025/11/price-of-paid-unity-subscriptions-to-rise-but-free-subs-extended/
45. Shorebird: Flutter vs React Native in 2026 — https://shorebird.dev/blog/flutter-vs-react-native/
46. Playwright + Expo web ekran görüntüsü karşılaştırma örneği — https://github.com/DylanVann/react-native-fast-image/pull/1378 ; RN Web'de testID/ARIA seçici notu — https://mcpmarket.com/tools/skills/playwright-expo-selectors
47. react-native-purchases README (RN ≥0.80, Expo dev build, Preview API Mode) — https://www.npmjs.com/package/react-native-purchases
48. Ücretsiz SFX kaynakları ve lisansları (Kenney CC0, Freesound CC0/CC-BY/CC-BY-NC) — https://app.cinevva.com/guides/free-sound-effects-music ; https://opengameart.org/node/21999
49. 9to5Mac: Apple adds social media questions to age rating questionnaire — https://9to5mac.com/2026/07/09/apple-adds-social-media-questions-to-app-store-connect-age-rating-questionnaire/
50. ppc.land: Apple forces 18+ on dating and virtual companion apps by January 12 — https://ppc.land/apple-forces-18-rating-on-dating-and-virtual-companion-apps-by-january-12/
51. Proje Çalışma Günlüğü — teknik fizibilite probu (create-expo-app SDK 58, `expo export --platform web`, Playwright 390x844 ekran görüntüsü başarılı) — /home/user/test-repo/docs/CALISMA-GUNLUGU.md
52. Google Play target API 36 — React Native geçiş rehberi (ikincil) — https://dev.to/dainyjose/google-play-requires-android-16-api-level-36-by-august-31-2026-react-native-migration-guide-1d51
53. Apple: Xcode 26 zorunluluğu — Capawesome notu (ikincil) — https://capawesome.io/blog/xcode-26-requirement-for-capacitor-apps/
