# Yerel Android APK derlemesi (yan yükleme / test) — Motto 1.0.0

> **Amaç:** EAS'a gitmeden, bir Linux makinesinde imzalı, kurulabilir bir **release APK** üretmek (test cihazına `adb install` ya da dosyayla yan yükleme).
> **Mağaza için değildir.** Play Store **AAB** ister ve upload key ile imzalanır → §7 (EAS).
> **Durum (2026-11-14):** Adımlar 1–4 bulut oturumunda çalıştırıldı (SDK kurulumu, içerik paketleri, `expo prebuild`). Adım 5'teki Gradle derlemesi o ortamda **tamamlanamadı**: Maven Central (`repo.maven.apache.org`, Cloudflare) ortamın paylaşılan çıkış IP'sine isteklerin ~%60–70'inde `429 Too Many Requests` ya da `404 + Retry-After: ~69000` döndü; Gradle bu sahte 404'leri "artefakt yok" diye önbelleğe aldı. Bu, projeyle ilgili bir hata değildir; normal bir geliştirici makinesinde ya da hız sınırı kalkınca aynı komutlar çalışır. Aşağıdaki sürümler kodda/üretilen projede okunarak belirlendi.

---

## 0. Gereken sürümler (nereden okundu)

| Bileşen | Sürüm | Kaynak |
|---|---|---|
| Node / pnpm | 22.23.4 / 10.28.0 | `apps/mobile/eas.json › build.base` |
| Expo SDK / React Native | 58 (`expo ~58.0.23`) / 0.88.1, **New Architecture** (`newArchEnabled=true`), Hermes | `apps/mobile/package.json`, üretilen `android/gradle.properties` |
| Gradle (wrapper) | 9.4.1 (wrapper kendisi indirir; sistemdeki Gradle gerekmez) | `android/gradle/wrapper/gradle-wrapper.properties` |
| Android Gradle Plugin | 9.2.1 | `node_modules/react-native/gradle/libs.versions.toml › agp` |
| Kotlin | 2.2.0 | aynı dosya |
| JDK | **17 veya 21** (21.0.12 ile denendi; Gradle 9 ve AGP 9 JDK 17+ ister — 17'ye düşmek gerekmez) | |
| `compileSdk` | 37 → SDK paketi `platforms;android-37.0` | `libs.versions.toml › compileSdk` |
| `targetSdk` / `minSdk` | 36 / 24 | aynı dosya |
| Build-tools | `build-tools;37.0.0` | `libs.versions.toml › buildTools` |
| NDK | `ndk;27.1.12297006` | `libs.versions.toml › ndkVersion` |
| CMake | `cmake;3.22.1` (New Arch autolinking C++ kodu için) | RN şablonu |
| Platform-tools | 37.0.1 (`adb`) | |
| Command-line tools | `commandlinetools-linux-16111833_latest.zip` (sdkmanager 23.0.0 / Android CLI 1.1) | dl.google.com |

Disk: Android SDK ≈ 2,5 GB, Gradle önbelleği + derleme çıktısı ≈ 6–10 GB. RAM: 8 GB+ önerilir.

## 1. Android SDK kurulumu (repo dışında, ör. `/opt/android-sdk`)

```bash
export ANDROID_HOME=/opt/android-sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/build-tools/37.0.0:$PATH"

mkdir -p $ANDROID_HOME/cmdline-tools && cd /tmp
curl -fLO https://dl.google.com/android/repository/commandlinetools-linux-16111833_latest.zip
unzip -q commandlinetools-linux-16111833_latest.zip -d $ANDROID_HOME/cmdline-tools
mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest

yes | sdkmanager --sdk_root=$ANDROID_HOME --licenses        # yeni sürümde "artık gerekmez" uyarısı verir; zararsız
sdkmanager --sdk_root=$ANDROID_HOME \
  "platform-tools" "build-tools;37.0.0" "platforms;android-37.0" \
  "ndk;27.1.12297006" "cmake;3.22.1"
```

Not: bu `sdkmanager` "deprecated, Android CLI kullanın" uyarısı basar; komut yine çalışır (`android sdk install …` eşdeğeridir). Liste çıktısında paket adları `build-tools/37.0.0` biçiminde görünür, kurulumda `;` ile yazılır.

## 2. Bağımlılıklar ve içerik paketleri

```bash
cd <repo>
pnpm install
cd apps/mobile
pnpm run content:packs     # packages/content-schema → apps/mobile/assets/content/ (manifest.json + core, 18-25, 26-35, 36-50, 51-65, 66plus)
```

İçerik paketleri JS paketine (`index.android.bundle`) **gömülür**: `src/content/packs.native.ts` her JSON'u `require()` eder; APK'da ayrı `.json` dosyası olarak görünmezler. `assets/content/` boşsa uygulama içeriksiz açılır. (`metro.config.js` her Metro çalışmasında paketleri yeniden üretir; `MOTTO_SKIP_CONTENT_PACKS=1` bunu atlar.)

## 3. Native proje (`android/`) üretimi

```bash
cd apps/mobile
CI=1 npx expo prebuild --platform android --clean --no-install
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
```

- `android/` ve `ios/` **commit edilmez** (`apps/mobile/.gitignore › /android`, `/ios` mevcut).
- Firebase eklentileri yalnızca `apps/mobile/firebase/google-services.json` **ve** `GoogleService-Info.plist` varsa açılır (`app.config.js`); test APK'sı için bu dosyalar **konmaz**. Meta eklentisi `PLACEHOLDER_` kimliklerle kapalı kalır.
- AdMob uygulama kimliği Google'ın **resmî test** kimliğidir (`ca-app-pub-3940256099942544~3347511713`).

## 4. Gradle ayarları (kullanıcı düzeyi — repo dışında)

`~/.gradle/gradle.properties` (proje `gradle.properties`'ini geçersiz kılar; `prebuild --clean` bunu silmez):

```properties
org.gradle.jvmargs=-Xmx6g -XX:MaxMetaspaceSize=1g -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
org.gradle.workers.max=4
org.gradle.parallel=true
org.gradle.caching=true
# Kurumsal/ajan HTTPS vekili arkasındaysanız (değilse silin):
# systemProp.https.proxyHost=127.0.0.1
# systemProp.https.proxyPort=44817
# systemProp.javax.net.ssl.trustStore=/etc/ssl/certs/java/cacerts
# Maven Central geçici hatalarında daha çok yeniden deneme:
systemProp.org.gradle.internal.repository.max.retries=12
systemProp.org.gradle.internal.repository.initial.backoff=2000
```

## 5. Release APK derlemesi

```bash
cd apps/mobile/android
export ANDROID_HOME=/opt/android-sdk ANDROID_SDK_ROOT=/opt/android-sdk
export EXPO_PUBLIC_BUILD_PROFILE=preview   # EAS "preview" profiliyle aynı ortam değişkeni
export MOTTO_SKIP_CONTENT_PACKS=1          # paketler 2. adımda zaten üretildi
export NODE_ENV=production
./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
# eski 32-bit telefonlar da gerekiyorsa: -PreactNativeArchitectures=arm64-v8a,armeabi-v7a  (native derleme süresi ~2 katı)
```

Çıktı: `apps/mobile/android/app/build/outputs/apk/release/app-release.apk`

- Release derlemesi JS'i Hermes bytecode olarak `assets/index.android.bundle` içine gömer (`bundleCommand = "export:embed"`); Metro sunucusu gerekmez.
- R8 küçültme açık (`android.enableMinifyInReleaseBuilds=true`).
- **İmza:** üretilen `android/app/build.gradle` release'i de `android/app/debug.keystore` (`androiddebugkey` / `android`) ile imzalar. Yan yükleme testi için yeterli; **Play Store'a yüklenemez** ve bu imzayla kurulan bir APK, ileride mağaza imzalı sürümle **üzerine güncellenemez** (önce kaldırmak gerekir).
- `expo-dev-client` bağımlılıkta olduğu için dev-launcher yalnızca debug varyantında etkindir; release APK doğrudan gömülü paketi açar.

Hız sınırı / "Could not find …jar" hatası: Maven Central geçici olarak 429 veya sahte 404 döndürürse Gradle bunu "yok" diye önbelleğe alır. Sınır kalkınca bir kez `./gradlew assembleRelease --refresh-dependencies -PreactNativeArchitectures=arm64-v8a` çalıştırın.

## 6. APK doğrulama

```bash
APK=apps/mobile/android/app/build/outputs/apk/release/app-release.apk
BT=$ANDROID_HOME/build-tools/37.0.0
$BT/aapt2 dump badging $APK | head -5            # package: name='com.d2ptechnology.motto' versionName='1.0.0' sdkVersion:'24' targetSdkVersion:'36'
$BT/aapt2 dump permissions $APK
$BT/apksigner verify --verbose --print-certs $APK # "CN=Android Debug" → debug imzası
unzip -l $APK | grep -E "index.android.bundle|lib/arm64-v8a/libhermes|assets/"
# İçerik paketleri JS paketine gömülüdür; Hermes string tablosunda olay kimlikleri ve manifest contentHash'i aranır:
H=$(node -p "require('./apps/mobile/assets/content/manifest.json').contentHash")
unzip -p $APK assets/index.android.bundle | strings | grep -c -e "$H" -e 'egitim_sinavlar_sertifika_sonucu_01'
ls -lh $APK

mkdir -p apps/mobile/dist-apk && cp $APK apps/mobile/dist-apk/motto-1.0.0-preview.apk   # dist-apk/ .gitignore'da
adb install -r apps/mobile/dist-apk/motto-1.0.0-preview.apk                               # USB hata ayıklaması açık cihaz
```

**Beklenen izinler** (`compliance.md` §2.3): `INTERNET`, `ACCESS_NETWORK_STATE`, `com.google.android.gms.permission.AD_ID`, `POST_NOTIFICATIONS`, `VIBRATE`, `com.android.vending.BILLING`. Ayrıca kütüphanelerden gelmesi olağan olanlar: `WAKE_LOCK`, `RECEIVE_BOOT_COMPLETED` / `SCHEDULE_EXACT_ALARM` (expo-notifications, yerel hatırlatıcı), `com.google.android.c2dm.permission.RECEIVE` (expo-notifications FCM altyapısı; push token kullanılmasa da manifestte durur), `ACCESS_ADSERVICES_*` (Google Mobile Ads, Privacy Sandbox), `<package>.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` (AndroidX). Prebuild manifestinde ek olarak **`MODIFY_AUDIO_SETTINGS`** var (expo-audio; çalma için, tehlikeli izin değil, kullanıcıya sorulmaz) — Data safety'yi etkilemez ama `compliance.md` §2.3 listesine eklenmeli ya da istenmiyorsa `app.json › android.blockedPermissions`'a yazılmalı ☐. **Olmaması gerekenler** (`blockedPermissions` ile kaldırılır, `tools:node="remove"`): `RECORD_AUDIO`, `CAMERA`, `ACCESS_FINE/COARSE_LOCATION`, `READ/WRITE_EXTERNAL_STORAGE`, `READ_MEDIA_*`, `SYSTEM_ALERT_WINDOW`, `FOREGROUND_SERVICE(_MEDIA_PLAYBACK)`.

Emülatör: KVM olmayan bulut makinesinde Android emülatörü çalıştırılamaz; çalışma zamanı testi gerçek cihazda (`adb install`) yapılır.

## 7. Mağaza AAB'si (sahip, EAS ile)

Yerel APK yalnızca test içindir. Play'e giden derleme EAS'ta üretilir ve EAS'in yönettiği **upload key** ile imzalanır (Play App Signing, `checklist.md` §6 m.5, §8):

```bash
cd apps/mobile
npm i -g eas-cli            # eas.json › cli.version >= 16
eas login
eas init                    # bir kez: projectId → app.json › extra.eas.projectId
eas credentials             # Android › upload keystore'u EAS oluştursun (yedeğini indirip saklayın)
# Firebase hazırsa (yoksa atlayın; build Firebase'siz de çalışır):
eas env:create --name GOOGLE_SERVICES_JSON --type file --value ./firebase/google-services.json --environment production

eas build --profile production --platform android   # .aab; versionCode EAS'ta autoIncrement
eas submit --profile production --platform android  # Play internal track'e taslak (secrets/play-service-account.json)
```

- EAS sunucusu `eas-build-post-install` betiğiyle içerik paketlerini kendisi üretir (`package.json`); `assets/content/` commit edilmez.
- Aynı profil sisteminde sideload APK'yı EAS'ta da üretebilirsiniz: `eas build --profile preview --platform android` (`buildType: apk`, EAS imzası).
- Yayından önce: `AD_UNITS.useTestIds: false` + gerçek AdMob kimlikleri, gerçek RevenueCat anahtarları (`checklist.md` §0).

## 2026-11-15 — İlk başarılı APK
- `motto-1.0.0-preview.apk`: 63 MB, com.d2ptechnology.motto 1.0.0 (versionCode 1), minSdk 24, targetSdk 36, yalnız arm64-v8a, debug anahtarıyla imzalı (yalnız test kurulumu; Play kabul etmez).
- İçinde: index.android.bundle (33 MB, içerik paketleri dahil), 41 ses dosyası.
- Bu ortamda gereken ek ayarlar: Maven Central yerine Google aynası (`~/.gradle/init.d/central-mirror.gradle`, `maven-central.storage-download.googleapis.com`), JDK 17 (`org.gradle.java.installations.paths`), proxy portu `~/.gradle/gradle.properties` içinde güncel olmalı.
- Düzeltme: iOS'a özel `NSUserTrackingUsageDescription` Android dil dosyalarına yazılıp release lint'ini düşürüyordu → `locales/*.json` artık `{ "ios": { ... } }`.
- İzinler (birleşmiş manifest): INTERNET, VIBRATE, MODIFY_AUDIO_SETTINGS (expo-audio), AD_ID ve ACCESS_ADSERVICES_* (AdMob), WAKE_LOCK, ACCESS_NETWORK_STATE, RECEIVE_BOOT_COMPLETED, POST_NOTIFICATIONS (bildirimler), BILLING (RevenueCat), install referrer, ve bildirim rozeti için üretici launcher izinleri (Samsung/Huawei/Oppo/HTC/Sony vb., ShortcutBadger). Rozet kullanmıyoruz (doc 19) → mağaza öncesi bu launcher izinleri `blockedPermissions` ile kaldırılabilir; compliance.md'ye eklenmeli.
