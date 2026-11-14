# 17 — Analitik, Firebase ve Meta: Ölçüm Altyapısı, Rıza ve Publisher Veri Paketi

> Sürüm 1 · 2026-11-13 · Kod: `apps/mobile/src/analytics/` · Bağlayıcı üst belge: **11** (KPI ağacı, olay şeması, asla-loglanmaz listesi, rıza kapısı). Kardeş belgeler: **06** (monetizasyon olayları), **10** (`AnalyticsPort`), **15** (reklam ve rıza katmanı — tek rıza yüzeyi ve tek ATT istemi orada).
>
> **Hukuki not:** Bu belge hukuki görüş değildir. KVKK açık rıza / meşru menfaat ayrımı, yurt dışına aktarım ve metinlerin kesin hâli avukat onayına bağlıdır (§11).

---

## 1. Özet

- **Tek giriş noktası:** `analytics.track(ad, parametreler)` — olay adı ve parametre tipleri katalogdan (`events.ts`) derleme zamanında denetlenir; çalışma anında da temizlenir (katalog dışı anahtar/değer **gönderilmez**).
- **İki dış sağlayıcı, iki ayrı rıza amacı:**
  - **Firebase** (Analytics + Crashlytics + Remote Config) → amaç `analytics` → oyuncunun **"Analitik paylaşımı"** anahtarı.
  - **Meta App Events** (`react-native-fbsdk-next`) → amaç `marketing` → reklam katmanının **"Kişiselleştirilmiş reklam"** açık rızası + iOS'ta ATT izni (`trackingAllowed`).
- **Rıza yokken** olaylar cihazda sınırlı bir kuyrukta bekler; **red** gelirse kuyruk silinir; **onay** gelirse sırayla gönderilir. Rıza verilmeden hiçbir SDK başlatılmaz, hatta native paket `require` bile edilmez.
- **Yaş kapısı** (reklam katmanı, `src/ads/ageGate.ts`): yanıtlanmadan hiçbir şey başlamaz; `minor` (16–17) ve `blocked` (16 altı → 13 altı dahil) için iki amaç da kalıcı olarak kapalıdır, kuyruk silinir.
- **Web export ve vitest** hiçbir native modül olmadan çalışır; web'de "demo sink'ler" Firebase ve Meta'nın **alacağı** her şeyi aynı rıza kapısının arkasında bir halka tampona yazar (`window.__mottoAnalytics`).
- **Sahibine kalan iş:** Firebase projesini açıp iki yapılandırma dosyasını `apps/mobile/firebase/` klasörüne bırakmak; Meta uygulamasını açıp App ID + Client Token'ı `app.json`'a yazmak (§6, §7). Başka kod değişikliği gerekmez.

---

## 2. Mimari

```
oyun (useGame, ShopScreen, DeathFlow)          reklam katmanı (src/ads)
   │  gameAnalytics.* / trackPurchase* / trackAd* / trackFtue     │ getConsent() / onConsentChange()  (tek rıza yüzeyi, tek ATT)
   ▼                                                              ▼
hooks.ts ──► AnalyticsCore (core.ts) ◄──── bridge.ts (rıza + yaş kapısı + kullanıcı özellikleri)
                 │  sanitizeEvent (events.ts)        consent.ts: analytics / marketing → unknown | granted | denied
                 │  kuyruk (amaç başına ≤ 400, AsyncStorage'da kalıcı)
                 ├── amaç "analytics" ─► FirebaseProvider ─► @react-native-firebase/{analytics,crashlytics}
                 │                        (web/demo: DebugProvider "firebase(demo)")
                 └── amaç "marketing" ─► MetaProvider ─► react-native-fbsdk-next (yalnızca eşlenen 6 olay)
                                          (web/demo: kayıt yapan sahte Meta SDK'sı)
Remote Config (remoteConfig.ts): kod içi varsayılanlar + tipli getter rc('anahtar'); native'de rıza sonrası fetch.
```

| Dosya | Görev |
|---|---|
| `events.ts` | Olay kataloğu (tek kaynak), parametre türleri, kullanıcı özellikleri, sınırlar, temizleyici, `SCHEMA_VERSION` |
| `consent.ts` | Saf rıza modeli; Consent Mode v2 eşlemesi |
| `core.ts` | Facade motoru: kuyruk, rıza kapısı, sağlayıcı başlatma, oturumlar, FTUE işaretleri; asla throw etmez |
| `gameHooks.ts` / `hooks.ts` | İnce, tipli çağrı noktaları (`gameAnalytics`, `trackFtue`, `trackPurchaseResult`, `trackAdRevenue` …) |
| `providers/*` | `NoopProvider` (test), `DebugProvider` (web/dev), `FirebaseProvider`, `MetaProvider`, `metaMap.ts` |
| `firebaseSdk(.native).ts`, `metaSdk(.native).ts` | Platform dosyaları: web/vitest'te SDK yok; native'de modül binary'de varsa tembel `require` |
| `provider(.native).ts`, `runtime.ts` | Sağlayıcıların kurulumu, `analytics` tekil nesnesi, AppState oturum takibi, demo kancası |
| `bridge.ts` | Reklam katmanının rıza/yaş anlık görüntüsünü, sahiplik ve ses tercihini çekirdeğe aktarır |
| `ConsentUI.tsx`, `promptStore.ts` | "Analitik paylaşımı" anahtarı (Ayarlar), "verilerimi sıfırla", tek seferlik soru kartı |
| `remoteConfig.ts`, `config.ts` | Remote Config; `app.json › expo.extra.analytics` okuma |

**Performans:** `track()` senkron; bir nesne kopyası + birkaç tip kontrolü. Oyun döngüsünde (her gösterilen gün) yalnızca sayaç artışı ve %10 örneklenmiş `day_shown` vardır. Durum yazımı 2 sn'de bir birleştirilir. Hiçbir çağıran bir sink'i beklemez.

**Hata davranışı:** Her açık yöntem `try/catch` içinde; depolama yok/bozuk, SDK yok, SDK her çağrıda hata atıyor → oyun etkilenmez (testlerle doğrulandı).

---

## 3. Olay tablosu (şema sürümü 1)

Her olaya çekirdek `schema_v` (=1) ekler; kuyrukta ≥ 60 sn beklemiş olaya `lag_s` eklenir (gerçek zaman damgası değil, gecikme). Parametre türleri: sayı, bool, kapalı enum veya **makine kimliği** (`^[a-z0-9][a-z0-9_.:-]{0,63}$`). Serbest metin türü **yoktur**.

> Firebase'in ayrılmış adları (`first_open`, `session_start`, `ad_reward`, `error` …) kullanılamaz; 11'deki `first_open`/`session_start`/`ad_reward` burada `app_first_launch`/`game_session_start`/`ad_reward_earned` olarak geçer. Firebase kendi `first_open`, `session_start`, `user_engagement` olaylarını zaten otomatik üretir (retention kohortları bunlarla çalışır).

| Grup | Olay | Parametreler | Beslediği KPI | Meta'ya |
|---|---|---|---|---|
| Yaşam döngüsü | `app_first_launch` | `platform` | D0 / kurulum kohortu | — |
| | `game_session_start` | `source: cold\|resume`, `session_no`, `away_h`? (uzak kalma, saat kovası 0/1/3/6/12/24/48/72/168/336/720; ilk açılışta yok) | oturum/DAU, D1/D7/D30, dönüş aralığı | — |
| | `return_slot` | `result: consent\|att\|interstitial\|none`, `reason`? (none ise interstitial neden yok: `placements.ts` red sebebi ya da `not_loaded`) | interstitial erişimi, dönüşte evrak sürtünmesi | — |
| | `session_end_suggested` | `shown_days` | durma önerisinin kabulü (ardından `end_reason: enough`) | — |
| Çekirdek (sprint 3) | `surprise_shown` | `tier: nice\|great\|legendary`, `days_since` (önceki sürprizden beri gösterilen gün), `age_band` | ödül çizelgesi (p95 ≤ 14 hedefi) | — |
| | `story_card` | `kind: loss\|rent\|omen`, `event_id`, `age_band` | kayıp / kira krizi / son perde kartı → aynı oturum ve ertesi gün terk | — |
| Rıza / bildirim | `consent_answer` | `step: privacy_card\|ump\|att`, `trigger: first_report\|return\|settings`, `choice: save\|decline\|ok`, `ads`, `analytics: on\|off\|na` | rıza sürtünmesi, izin oranı (yalnız analitiği açık kohort görür) | — |
| | `notif_optin` · `notif_open` | `answer: yes\|no\|os_denied`, `surface` · `idx` | hatırlatma izni ve dönüşe etkisi (19) | — |
| | `game_session_end` | `dur_ms`, `shown_days`, `birthdays`, `answers`, `auto_answers`, `speed_play`, `speed_fast`, `speed_auto`, `session_no`, `part`, `end_reason: background\|enough\|death\|close` | oturum süresi, gün/oturum, gün/dk, hız karışımı | — |
| | `screen_view` (GA4) | `screen_name`, `screen_class` (enum) | ekran akışı | — |
| FTUE | `tutorial_begin` (GA4) | — | FTUE hunisi giriş | — |
| | `ftue_line_seen` · `ftue_life_start` · `ftue_decision` · `ftue_stamp` · `ftue_report_card` | `ms` (kurulumdan beri ön plan süresi) | TTFL vekili, TTFD, ilk damga, ilk karne | — |
| | `tutorial_complete` (GA4) | — | FTUE tamamlama | `fb_mobile_tutorial_completion` |
| | `ftue_intro_open` | `replay`, `ms` | eğitim erişimi (18 §7) | — |
| | `ftue_intro_done` · `ftue_intro_skip` | `page` (0–4), `replay`, `ms`, `dur_ms` (eğitim açık kaldığı süre) | eğitim tamamlama, terk sayfası, eğitim süresi | — |
| | `ftue_hint` | `id: choices\|stats\|speed\|meters\|report`, `ms` | bağlamsal ipuçları | — |
| | `ftue_step` | `step` (kimlik), `idx`, `ms` | ek onboarding adımları (`trackFtue`) | — |
| Çekirdek | `life_start` | `life_no`, `fast_life` | hayat/kullanıcı | — |
| | `day_shown` (örneklenmiş, varsayılan %10) | `event_id`, `domain`, `age_band`, `kind`, `sample_pct` | içerik ısı haritası | — |
| | `answer` | `event_id`, `choice_id`, `domain`, `age_band`, `via: tap\|auto` | seçim dağılımı, oto payı | — |
| | `wager_resolved` | `event_id?`, `p_odds` (0–100), `result: hit\|wrong` | koç isabeti %50–62 | — |
| | `year_end` | `age`, `grades` (6 harf), `shown_days_year` | karne sayısı | `fb_mobile_level_achieved` (`fb_level`=yaş) |
| | `year_continue` | `age`, `via` | "Bir Yıl Daha" | — |
| | `milestone` | `kind: birthday\|promotion\|sad\|legendary\|wager_win`, `age` | kilometre taşları | `fb_mobile_achievement_unlocked` |
| | `death` | `age`, `cause_class`, `channel`, `life_no`, `shown_days`, `auto_days` | ölüm yaşı dağılımı (harness kıyası) | — |
| | `rebirth` | `ms_since_death`, `life_no` | ölüm → yeni müşteri (2 dk) | — |
| | `share` | `card: death\|report`, `channel: native_sheet\|web_share\|download\|clipboard\|cancelled\|failed` (ops.), `format: story\|square` (ops.) | paylaşım/oturum, kanal dağılımı | — |
| Reklam | `ad_offer_shown` | `placement` | rewarded opt-in paydası | — |
| | `ad_skip` | `placement`, `reason: declined\|no_fill\|closed\|error` | no-fill, red oranı | — |
| | `ad_shown` | `placement`, `format: rewarded\|interstitial` | gösterim/DAU (yerleşim bazında) | — |
| | `ad_reward_earned` | `placement`, `free` | rewarded tamamlama | — |
| | `ad_impression` (GA4) | `ad_platform`, `ad_format`, `ad_unit_name`, `ad_source?`, `value`, `currency` | ARPDAU (reklam) | `AdImpression` (value + `fb_currency`) |
| IAP | `paywall_view` | `surface` | paywall dönüşümü | — |
| | `purchase_start` | `sku`, `surface` | satın alma hunisi | `fb_mobile_initiated_checkout` |
| | `purchase` (GA4) | `sku`, `value`, `currency` (+ Firebase'e `items[]`) | ARPDAU (IAP), ödeyen dönüşümü, LTV | `fb_mobile_purchase` (`logPurchase(value, CURRENCY)`) |
| | `purchase_fail` | `sku`, `surface`, `reason` | huni kaybı | — |
| | `purchase_restore` | `result`, `count` | geri yükleme sağlığı | — |
| Ayarlar | `settings_change` | `setting: language\|fast_life\|auto\|haptics\|hints_reset`, `value` | dil dağılımı, ipucu sıfırlama | — |
| Kalite | `app_error` | `scope`, `code`, `fatal` | hata oranı | — |

Toplam **38 olay adı** (GA4 sınırı 500), olay başına en çok 11 + 2 ortak parametre (sınır 25). Vitest bu sınırları doğrular.

**Kullanıcı özellikleri (9/25):** `locale`, `lives_bucket` (1 · 2_3 · 4_9 · 10_plus), `payer` (0/1), `no_ads` (0/1), `sound` (on/off — değişim **anı** olay değildir, 11 §2.2.3 #6), `app_version`, `content_hash`, `install_week` (ör. `2026w46`), `ab_variant` (Remote Config).

**Asla gönderilmeyenler:** oyuncunun yazdığı/seçtiği isim, şehir, hayat seed'i, serbest metin, gerçek saat, konum, IP, cihaz/reklam kimliği (bizim şemada), makbuz/işlem kimliği/token, doğum yılı, "Gerçek hayatta yardım" ekranı. `userId` hiçbir zaman set edilmez. SDK'ların kendi topladıkları (Firebase app-instance id, Meta'nın kurulum/aktivasyon sinyali) §9'daki beyanlarda yer alır.

**Şema değişikliği kuralı:** Bir olayın veya parametrenin anlamı değişirse `SCHEMA_VERSION` artırılır, eski ad yeniden kullanılmaz. Kuyrukta bekleyen eski olaylar yüklemede yeniden doğrulanır; artık katalogda olmayanlar atılır.

---

## 4. Oturum ve FTUE tanımları

- **Oturum:** yalnızca ön plan süresi. Arka plana her geçişte `game_session_end` o ana kadarki **kümülatif** değerlerle (`part` artarak) gönderilir — uygulama arka planda öldürülebilir. 10 dakikadan kısa ayrılıştan dönüş aynı oturumdur. Raporlarda `session_no` başına **son `part`** alınır.
- **FTUE:** her adım kurulum başına bir kez; `ms` = ilk açılıştan beri toplam ön plan süresi. `tutorial_begin` ilk hayat başlangıcında, `tutorial_complete` ilk karnede (11 §2.1.2 "FTUE tamamlama = ilk karne").
- **Eğitim (18):** `src/state/tutorialRuntime.ts` `TutorialStore`'un `onEvent` geri çağrısını `trackTutorialEvent`'e bağlar (`ftue_intro_*`, `ftue_hint`); Ayarlar › İpuçlarını sıfırla → `trackHintsReset()`. Huni: `app_first_launch` → `ftue_intro_open` → `ftue_intro_done` ∪ `ftue_intro_skip` → `ftue_life_start` → `ftue_decision` → `ftue_hint{choices}` → `ftue_stamp` → `ftue_report_card`.
- **`trackFtue(step, idx?)` — öğretici/onboarding için sabit API:** `'tutorial_begin' | 'tutorial_complete'` → GA4 olayları; huni adları (`line_seen`, `life_start`, `decision`, `stamp`, `report_card`) → `ftue_<adım>`; diğer her makine kimliği (`^[a-z][a-z0-9_]{0,31}$`) → `ftue_step{step, idx, ms}`. Hepsi kurulum başına bir kez, idempotent.

---

## 5. Rıza (KVKK / GDPR) ve Consent Mode v2

### 5.0 D-161 — Analitik varsayılan açık (sahip kararı, 2026-11-13)
Davranış raporu (2026-11-13 §2.7, Y5): izin yalnız 2. oturumda sorulunca **dönmeyen oyuncunun hiçbir olayı gitmiyor**, D1 yapısal olarak şişiyor ve FTUE'de bırakanlar görünmüyordu. Sahip kararı:
- **Firebase Analytics + Crashlytics, yaş kapısından sonra yetişkin ve 16–17 için kendiliğinden başlar.** Reklam kimliği yok, reklam sinyali yok: Consent Mode `analytics_storage=granted`, `ad_storage / ad_user_data / ad_personalization=denied` (reklam rızası aksini söylemedikçe). Cihaz kuyruğu hemen boşalır; kurulum ve 1. oturum olayları gider (D1 paydası artık doğru).
- **Ayarlar'da analitik anahtarı yok; ayrı analitik kartı yok.** Tek gizlilik kartı yalnız kişiselleştirilmiş reklamı sorar (+ eskisi gibi ATT ön-ekranı).
- **İstisnalar (hukuki taban, kaldırılmaz):** (a) AEA / Birleşik Krallık / İsviçre — ve bölgesi bilinmeyen cihaz, çünkü bunlardan biri olabilir — analitik rızaya bağlı kalır: tek gizlilik kartında "Analitik paylaşımı" anahtarı (kapalı başlar). (b) 16 altı (`blocked`): hiçbir şey. (c) Meta / pazarlama ölçümü ve reklam kimliğine dayalı her şey eskisi gibi: kişiselleştirilmiş reklam izni + iOS ATT. (d) KVKK md. 11 yolu: **"Verilerimi sil / analitik kimliğimi sıfırla"** Aydınlatma Metni ekranında (Ayarlar › Gizlilik ve metinler › Aydınlatma Metni).
- Eski bir sürümde açıkça "Paylaşma" demiş oyuncunun cevabı korunur (kayıtlı `false` → `denied`).
- Kod: `src/analytics/consent.ts › analyticsDefaultOn / analyticsState / deriveConsent` (bölge `src/ads/consentApi.ts › region`: rıza adımından önce cihaz ülkesi), testler `test/sprint3.test.ts › D-161`.

### 5.1 Akış (sprint 3)
1. **Yaş kapısı** `minor` ya da `adult` olana kadar: hiçbir SDK başlamaz, olaylar cihazda bekler. Kapı geçilince: TR / ABD / diğer → analitik başlar, kuyruk gönderilir. AEA / BK / CH / bilinmeyen → bekler.
2. **Tek gizlilik kartı — 1. oturumda, ilk karnenin "Bir Yıl Daha"sında** (kanca görüldükten sonra, oyuncu ayrılmadan önce; `AD_CONFIG.consent.firstReportAsk`). Kaçarsa bir sonraki dönüş yerleşiminde. İçerik ve sıra hep aynı: aydınlatma metni → "Kişiselleştirilmiş reklam" (kapalı) → [yalnız AEA/BK/CH/bilinmeyen] "Analitik paylaşımı" (kapalı) → "Aydınlatma Metni (taslak) ›" (uygulama içi) → [Hepsi kapalı kalsın] [Seçimimi kaydet] eşit. 16–17: kilitli satır + tek [Anladım]. AEA'da önce Google UMP formu, ardından (analitik gerekiyorsa) yalnız analitik anahtarlı kart.
3. **İlk oturumda reklam yok kuralı değişmez:** rıza yalnız SDK'nın başlamasına izin verir; ödüllü teklif ≥ 2. oturum, interstitial ≥ 3. oturum.
4. iOS'ta ATT istemi **yalnızca** reklam katmanının (`requestTracking()`), en erken 3. oturum, ayrı bir dönüşte.
5. Değiştirme: Ayarlar › Gizlilik ve metinler › "Gizlilik / reklam tercihleri" (reklam) ve Aydınlatma Metni ekranındaki "Verilerimi sil / analitik kimliğimi sıfırla".

### 5.2 Rıza matrisi

> **D-161:** TR / ABD / diğer bölgelerde yaş kapısından sonra (yetişkin ve 16–17) "Analitik **açık**" satırı geçerlidir, soru sorulmaz; 16–17'de yalnız reklam/Meta satırları kapalı kalır. "Analitik anahtarı yanıtsız / kapalı" satırları yalnız AEA / BK / CH / bölgesi bilinmeyen cihaz ve eski bir sürümde verilmiş "hayır" için geçerlidir. Meta / reklam kimliği satırları değişmedi.

| Durum | Firebase Analytics | Crashlytics | Remote Config fetch | Meta App Events | Cihaz kuyruğu |
|---|---|---|---|---|---|
| Yaş kapısı yanıtsız | başlatılmaz | kapalı | yok | başlatılmaz | bekler |
| Yaş `blocked` (16 altı) | asla | asla | yok | asla | **silinir** |
| Yaş `minor` (16–17) | kapalı, anahtar kilitli | kapalı | yok | asla | silinir |
| Analitik anahtarı yanıtsız | başlatılmaz | kapalı | yok | (aşağıya bak) | bekler |
| Analitik **açık** | açık, `analytics_storage=granted` | açık | var (12 sa'te bir) | (aşağıya bak) | gönderilir |
| Analitik **kapalı** | kapalı + `setAnalyticsCollectionEnabled(false)` | kapalı + gönderilmemiş raporlar silinir | yok | (aşağıya bak) | silinir |
| Kişiselleştirilmiş reklam rızası yok / reddedildi | `ad_storage`, `ad_user_data`, `ad_personalization` = denied | — | — | başlatılmaz / kapatılır | silinir |
| Rıza var, iOS ATT yanıtsız | ad_* denied | — | — | başlatılmaz | bekler |
| Rıza var + (iOS) ATT izinli (`trackingAllowed`) | ad_* granted | — | — | açık: `setAdvertiserTrackingEnabled(true)`, `AdvertiserIDCollection` + `AutoLogAppEvents` açık, LDU (Meta coğrafi belirler) | gönderilir |

Native varsayılanlar (rıza kodu hiç çalışmasa bile): `apps/mobile/firebase.json` → `analytics_auto_collection_enabled:false`, dört Consent Mode varsayılanı `false`, `crashlytics_auto_collection_enabled:false`, otomatik ekran raporlama kapalı. Meta eklentisi → `isAutoInitEnabled:false`, `autoLogAppEventsEnabled:false`, `advertiserIDCollectionEnabled:false` (Android'de `com.facebook.sdk.AutoLogAppEventsEnabled=false` vb. manifest meta-data'sı eklenti tarafından yazılır).

### 5.3 Rızanın geri alınması
Anahtar kapatılınca: Consent Mode denied → toplama kapalı → Crashlytics kapalı → gönderilmemiş çökme raporları silinir; Meta'da otomatik loglama, reklam kimliği toplama ve ATE kapatılır, LDU set edilir; kuyruklar boşaltılır. Sonraki olaylar çekirdekte düşer.

### 5.4 "Verilerimi sil"
Ayarlar › "Analitik verilerimi sıfırla": cihazdaki kuyruk silinir; Firebase `resetAnalyticsData()` (yeni app-instance id) ve gönderilmemiş çökme raporlarının silinmesi; Meta tamponu boşaltılır. **Sunucuya ulaşmış veri** için: Firebase/GA4 **User Deletion API** (app-instance id ile) ve Meta'nın veri silme talebi — backend olmadığından oyuncunun talebi destek e-postasıyla alınır; süreç gizlilik politikasında yazılmalıdır (avukat sorusu #6).

### 5.5 Veri saklama önerisi
GA4 › Data retention: **2 ay** (en kısa; toplu raporlar etkilenmez, yalnızca Explorations). Ham geçmiş BigQuery'de kalır → BigQuery tablo süresi **14 ay** önerisi (publisher due-diligence penceresi), sonra otomatik silme. "Reset on new activity" kapalı. Google sinyalleri (Google Signals) **kapalı**. Crashlytics: varsayılan 90 gün.

---

## 6. Firebase kurulum listesi (proje sahibi)

1. **console.firebase.google.com** → "Add project" → ad: `motto-prod` (ayrıca isteğe bağlı `motto-dev`). Google Analytics'i **etkinleştir**; hesap: şirket (D2P Technology) hesabı; analitik konumu: **Türkiye**; veri paylaşım ayarlarının hepsini **kapalı** bırak.
2. **Android uygulaması ekle:** package name `com.d2ptechnology.motto` (kaynağı `app.json › expo.extra.analytics.applicationId`; `app.config.js` bunu `android.package`'a yazar). `google-services.json` indir → **`apps/mobile/firebase/google-services.json`**.
3. **iOS uygulaması ekle:** bundle ID `com.d2ptechnology.motto`, App Store ID (varsa). `GoogleService-Info.plist` indir → **`apps/mobile/firebase/GoogleService-Info.plist`**.
4. İki dosya da yerindeyken `app.config.js` şunları kendisi ekler: `ios/android.googleServicesFile`, `@react-native-firebase/app` (iOS: `disableSPM:true`), `@react-native-firebase/crashlytics`, `expo-build-properties` (`ios.useFrameworks:"static"`). Bunlardan biri eksikse eklentiler eklenmez ve build Firebase'siz, sorunsuz çalışır (uyarı basılır).
   - EAS Build: dosyaları depoya koymak istemezseniz EAS "file" ortam değişkenleri `GOOGLE_SERVICES_JSON` ve `GOOGLE_SERVICE_INFO_PLIST` olarak yükleyin; `app.config.js` bunları okur.
   - `.gitignore` bu iki gerçek dosyayı dışarıda tutar (gizli değiller ama proje kimliğini taşırlar; isterseniz `.gitignore`'daki iki satırı silip commit'leyin). `*.example.*` dosyaları yalnızca biçim örneğidir, "EXAMPLE" değerleri içerir, build'e girmez.
5. **Crashlytics:** Console › Crashlytics › "Enable". İlk çökme raporu ancak rıza verilmiş bir cihazdan gelir; test için dev build'de anahtarı açıp `crash()` kullanın.
6. **Remote Config:** Console › Remote Config › parametreleri `remoteConfig.ts › RC_DEFAULTS` ile aynı adlarla oluşturun (`ads_enabled`, `ads_interstitial_enabled`, `ads_rewarded_daily_cap`, `ads_interstitial_min_gap_min`, `shop_enabled`, `day_shown_sample_pct`, `ab_variant`). Geçersiz/uç değerler istemcide kırpılır (ör. interstitial aralığı 360 dk altına inemez); fiyatlar Remote Config'den **değiştirilemez** (mağaza belirler).
7. **AdMob bağlantısı:** AdMob › Settings › Linked services › Firebase → bu projeyi bağla. Bağlıyken Google Mobile Ads SDK `ad_impression`'ı gelirle **kendisi** loglar; bu yüzden `app.json › extra.analytics.firebase.admobLinked:true` iken manuel `ad_impression` Firebase'e gönderilmez (çift sayım olmaz), yalnızca Meta'ya gider.
8. **BigQuery dışa aktarımı (ilk günden açın):** Project settings › Integrations › BigQuery › Link → Analytics: **Daily** (+ isteğe bağlı Streaming), Crashlytics: açık; veri seti konumu `EU` (veya `europe-west3`). Spark planında günlük dışa aktarım ücretsiz kotalıdır (BigQuery sandbox, 10 GB depolama / 1 TB sorgu/ay); streaming Blaze ister. Ham olay geçmişi ancak bağlantı açıldığı günden itibaren vardır — sonradan açmak geçmişi geri getirmez.
9. **GA4 ayarları:** Data retention 2 ay (§5.5); Google Signals kapalı; "Conversions/Key events" olarak `purchase`, `tutorial_complete`, `ad_impression` işaretleyin; özel tanımlar (custom definitions): `placement`, `surface`, `sku`, `age_band`, `domain`, `event_id`, `end_reason`, `session_no` (event-scoped), metrikler `dur_ms`, `shown_days`, `ms`.
10. **DebugView:** Android `adb shell setprop debug.firebase.analytics.app com.d2ptechnology.motto`; iOS Xcode scheme argümanı `-FIRDebugEnabled`. Cihazda analitik anahtarını açın; olaylar Console › DebugView'da saniyeler içinde görünür.
11. Firebase hizmet şartları ve **Data Processing Terms**'i (Console › Project settings › Privacy) kabul edin; KVKK için "veri işleyen" sıfatıyla sözleşme kaydı (§11).

**Seçilen paketler ve neden:**

| Paket | Sürüm | Neden |
|---|---|---|
| `@react-native-firebase/app`, `/analytics`, `/crashlytics`, `/remote-config` | **26.4.2** | Expo config eklentisi var (`expo >= 47` peer). 27.x iOS'ta yalnızca SPM + `use_frameworks! :linkage => :dynamic` kabul ediyor; Google Mobile Ads ve Meta SDK CocoaPods ile geldiği için bu, GoogleAppMeasurement'ın iki kopyası ve dinamik framework riskini getirir. 26.x'te belgelenmiş yol `$RNFirebaseDisableSPM = true` + `use_frameworks! :static` — üç SDK da CocoaPods'tan, tek kopya. 26.4.2 (2026-11-10) 26 hattının bakım sürümü. 27'ye geçiş, AdMob/Meta SPM'e geçince ayrı iş. |
| `/perf` | **eklenmedi** | Oyun backend'siz; ağ izleme anlamsız, ekran izleri için Crashlytics + `game_session_end` yeterli. Ek SDK = ek beyan + ek boyut. Gerekirse aynı sağlayıcı kalıbıyla eklenir. |
| `expo-build-properties` | ~58.0.12 | iOS statik framework ayarı (Firebase açıkken). |
| `react-native-fbsdk-next` | 13.4.3 | Meta'nın önerdiği RN köprüsü, Expo config eklentisi var (`expo >= 47`, `react-native >= 0.63.3`), FBSDK 18.x. Eski mimari `NativeModules` kullanır; RN 0.88'de birlikte çalışma (interop) katmanı üzerinden çalışması beklenir — **cihazda doğrulanmadı** (§10). |

RN 0.88 / Expo 58 doğrulaması bu ortamda: `expo config --type introspect` örnek dosyalarla Firebase eklentilerini hatasız uyguladı; native derleme (prebuild + Xcode/Gradle) bu ortamda yapılamadı.

---

## 7. Meta kurulum listesi (proje sahibi)

1. **Meta Business hesabı** (business.facebook.com) — şirket adına, iki yöneticili.
2. **developers.facebook.com › Create App** → tür "Other" → "Business" → Business hesabına bağla. Uygulama adı "Motto".
3. **App ID** ve **Client Token** (App settings › Advanced › Security) → `apps/mobile/app.json › expo.extra.analytics.meta.appId / clientToken` içindeki `PLACEHOLDER_` değerlerinin yerine. `app.config.js` ikisi de gerçek olunca `react-native-fbsdk-next` eklentisini tüm otomatik toplama **kapalı** olarak ekler (`isAutoInitEnabled`, `autoLogAppEventsEnabled`, `advertiserIDCollectionEnabled` = false; ATT metni reklam katmanınınki kalır).
4. **Platform ekle:** iOS bundle ID `com.d2ptechnology.motto`; Android package `com.d2ptechnology.motto`, "Class Name" `com.d2ptechnology.motto.MainActivity`, **key hash'ler**: debug ve **Play App Signing** imza sertifikasının SHA-1'inden üretilen base64 hash (`keytool -exportcert … | openssl sha1 -binary | openssl base64`; Play Console › App integrity'deki SHA-1'den de türetilebilir).
5. **SKAdNetwork:** Meta'nın kimlikleri (`v9wttpbfk9.skadnetwork`, `n38lu8286q.skadnetwork`) eklenti tarafından Info.plist'e eklenir; AdMob listesi reklam katmanının eklentisinde. **Aggregated Event Measurement (AEM):** iOS 14.5+ ATT reddeden kullanıcılar için Meta olayları toplu ölçer; Events Manager'da uygulamanın AEM için "olay öncelikleri" (en fazla 8) sırasıyla: `fb_mobile_purchase`, `fb_mobile_tutorial_completion`, `fb_mobile_level_achieved`, `fb_mobile_achievement_unlocked`, `AdImpression`. Bizde ATT reddi = Meta hiç başlamaz; dolayısıyla iOS'ta yalnızca ATT izni verenler ölçülür (bilinçli).
6. **Events Manager › Data sources › uygulama** → "Test events" ile dev build'den doğrulama: rıza ver (kişiselleştirilmiş reklam + iOS'ta ATT) → kurulum/aktivasyon ve `fb_mobile_tutorial_completion` görünmeli.
7. **Reklam hesabını bağlama:** Business Settings › Ad accounts → uygulamayı reklam hesabına bağla; App Install ve App Event Optimization (purchase / value) kampanyaları için "App Events" seçilebilir olmalı.
8. **Data Use Checkup** (yıllık) ve **Privacy Policy URL** (App settings › Basic) doldur; "Data deletion instructions URL" zorunlu → gizlilik politikasındaki silme bölümü.
9. **Limited Data Use:** istemci her açılışta LDU'yu "Meta coğrafi belirlesin" (`['LDU'], 0, 0`) olarak gönderir — ABD eyalet gizlilik yasaları için güvenli varsayılan; TR/AB için etkisi yoktur. Kaldırmak hukuki karardır.
10. **Meta Audience Network (gelecek):** reklam geliri için AdMob **mediation** kaynağı olarak eklenebilir (AdMob › Mediation › Meta Audience Network adaptörü). Bu reklam katmanının (doc 15) işi — bu belge yalnızca not düşer. Not: Audience Network de aynı kişiselleştirilmiş-reklam rızasına bağlıdır.

**MMP sorusu (Adjust / AppsFlyer / Singular):** Publisher'lar genellikle kendi MMP'lerini şart koşar. Facade sağlayıcı-takılabilir: bir MMP `AnalyticsProvider` arayüzünü uygulayan yeni bir dosya + `provider.native.ts`'te bir satırdır; amaç olarak `marketing` seçilir, aynı rıza kapısı geçerlidir. TR teknik fazında MMP yok (11 AC-11-11).

---

## 8. Panolar ve publisher veri paketi

### 8.1 Firebase / GA4'te kurulacak raporlar
- **Retention:** GA4 › Retention + Explore › Cohort exploration: kohort = `first_open` günü, dönüş = `session_start` (otomatik), D1/D7/D30; platform ve `locale` kırılımı. Not: retention yalnızca **rıza verenleri** kapsar (§10).
- **FTUE hunisi (Funnel exploration, açık huni):** `app_first_launch` → `ftue_intro_open` → `ftue_intro_done`/`ftue_intro_skip` → `ftue_line_seen` → `tutorial_begin`/`ftue_life_start` → `ftue_decision` → `ftue_stamp` → `ftue_report_card` → `tutorial_complete`; adım süreleri için `ms` medyanı. Onboarding adımları: `ftue_step` `idx` sırasıyla.
- **Oturum:** `game_session_end` → `session_no` başına max `part` → `dur_ms` medyanı, `shown_days` medyanı, `shown_days/(dur_ms/60000)`; oturum/DAU = farklı (`user_pseudo_id`,`session_no`) / DAU.
- **Gelir:** GA4 Monetization overview (`purchase` value + AdMob bağlantısıyla `ad_impression` value) → ARPDAU = (IAP + reklam) / DAU; reklam/IAP ayrı satır.
- **Reklam/DAU:** `ad_shown` sayısı / DAU, `placement` ve `format` kırılımı; opt-in = `ad_shown{rewarded}` kullanıcıları / `ad_offer_shown` kullanıcıları; no-fill = `ad_skip{no_fill}` / `ad_offer_shown`.
- **İçerik ısı haritası:** `answer` (+ `day_shown` / `sample_pct` ile ölçeklenmiş) → `domain` × `age_band` matrisi; `event_id` başına seçim dağılımı (`choice_id`), oto oranı.

### 8.2 BigQuery örnek sorgular (dataset `analytics_<property_id>`)
```sql
-- D1/D7/D30 (kohort = first_open günü)
WITH f AS (SELECT user_pseudo_id, MIN(PARSE_DATE('%Y%m%d', event_date)) d0
           FROM `PROJ.analytics_X.events_*` WHERE event_name='first_open' GROUP BY 1),
a AS (SELECT DISTINCT user_pseudo_id, PARSE_DATE('%Y%m%d', event_date) d FROM `PROJ.analytics_X.events_*` WHERE event_name='session_start')
SELECT d0, COUNT(DISTINCT f.user_pseudo_id) installs,
  COUNT(DISTINCT IF(DATE_DIFF(d,d0,DAY)=1, a.user_pseudo_id, NULL))/COUNT(DISTINCT f.user_pseudo_id) d1,
  COUNT(DISTINCT IF(DATE_DIFF(d,d0,DAY)=7, a.user_pseudo_id, NULL))/COUNT(DISTINCT f.user_pseudo_id) d7,
  COUNT(DISTINCT IF(DATE_DIFF(d,d0,DAY)=30,a.user_pseudo_id, NULL))/COUNT(DISTINCT f.user_pseudo_id) d30
FROM f LEFT JOIN a USING(user_pseudo_id) GROUP BY d0 ORDER BY d0;

-- Oturum süresi (session_no başına son part)
SELECT APPROX_QUANTILES(dur, 2)[OFFSET(1)]/60000 median_min FROM (
  SELECT user_pseudo_id, (SELECT value.int_value FROM UNNEST(event_params) WHERE key='session_no') s,
         MAX((SELECT value.int_value FROM UNNEST(event_params) WHERE key='dur_ms')) dur
  FROM `PROJ.analytics_X.events_*` WHERE event_name='game_session_end' GROUP BY 1,2);
```

### 8.3 Publisher veri paketi — ne istenir, nereden gelir

| Publisher'ın istediği | Kaynak (olay / parametre / özellik) | Not |
|---|---|---|
| D1/D7/D30 retention kohortları (platform, ülke) | otomatik `first_open` + `session_start`; ülke GA4 coğrafyası (kaba, IP'den Google türetir) | n < 900 kohort "okunmaz" (11) |
| Oturum süresi, oturum/DAU | `game_session_end.dur_ms`, `session_no`, `part`; `game_session_start` | yalnızca ön plan |
| Gün/oturum, gün/dk (oyuna özgü tempo) | `game_session_end.shown_days`, `speed_*` | 11 §2.1.3 |
| FTUE hunisi | `ftue_*`, `tutorial_begin/complete`, `ftue_step` | `ms` |
| ARPDAU (reklam / IAP ayrı) | `ad_impression.value` (AdMob bağlantısı), `purchase.value+currency` | brüt; mağaza kesintisi ve vergi publisher'a ayrıca (06 §2.8) |
| Gösterim/DAU yerleşim bazında | `ad_shown.placement/format` | |
| Rewarded opt-in, no-fill | `ad_offer_shown`, `ad_skip.reason`, `ad_shown` | |
| Ödeyen dönüşümü | `purchase` kullanıcıları / kurulum; `payer` kullanıcı özelliği | |
| LTV eğrisi girdileri | kohort × gün bazında kümülatif `purchase.value` + `ad_impression.value` | BigQuery'den |
| İçerik etkileşimi | `answer`, `day_shown`, `year_continue`, `death.age` | |
| Çökme oranı | Crashlytics crash-free users/sessions | |
| CPI testi hazırlığı | Meta App Events (kurulum, `fb_mobile_purchase`, `fb_mobile_tutorial_completion`), SKAdNetwork kimlikleri, Firebase kohortları | MMP publisher'dan |

**Erişim (kişisel veri paylaşmadan):** (1) Tercihen **toplu** paket: BigQuery'de yukarıdaki sorgulardan üretilen **görünümler** (view) ayrı bir `publisher_share` veri setine yazılır — `user_pseudo_id` ve cihaz alanları içermez; publisher'ın Google hesabına yalnızca bu veri setinde **BigQuery Data Viewer** rolü verilir (süreli, IAM koşullu). (2) Firebase Console'da canlı bakış gerekirse publisher'a proje düzeyinde **Analytics Viewer** (Firebase "Viewer" değil — o Crashlytics/Remote Config'i de açar) rolü, süreli. (3) Ham olay tablosu (`events_*`) **asla** paylaşılmaz (11 §5 "bilinçli dışarıda bırakılan ihlal #5"). Her erişim tarihli kayıt altına alınır (data room, 11 §2.6.4).

---

## 9. Gizlilik politikası ve mağaza formları

### 9.1 Gizlilik politikasına girmesi gerekenler
Veri sorumlusu (D2P Technology, Türkiye), işlenen veri türleri (aşağıdaki tablo), amaçlar (oyun iyileştirme/analitik; çökme teşhisi; reklam ölçümü ve kampanya atribüsyonu), hukuki sebep (açık rıza — avukat teyidi), alıcılar (Google LLC/Firebase, Meta Platforms, Google AdMob), **yurt dışına aktarım** (ABD; KVKK md. 9 mekanizması — avukat), saklama süreleri (GA4 2 ay + BigQuery 14 ay; Crashlytics 90 gün; Meta kendi politikası), haklar (KVKK md. 11; GDPR 15–22), rızanın geri alınması (Ayarlar), silme talebi yolu (destek e-postası + app-instance id), 16 yaş altına yönelik olmadığı, yaş kapısının işleyişi.

### 9.2 Toplanan veri türleri (form doldurma tablosu)

| Veri | Kim toplar | Rıza | App Store "App Privacy" | Google Play "Data safety" |
|---|---|---|---|---|
| Oyun içi etkileşim (olaylar, ekranlar) | Firebase Analytics | Analitik | Usage Data › Product Interaction — Analytics, App Functionality; **not linked**, not tracking | App activity › App interactions — Analytics; collected, shared: no (işleyen), optional |
| Uygulama örnek kimliği (app-instance id), IDFV (iOS) | Firebase Analytics | Analitik | Identifiers › Device ID — Analytics, not linked | Device or other IDs — Analytics, optional |
| Kaba konum (ülke/şehir, IP'den) | Firebase Analytics (Google türetir) | Analitik | Location › Coarse Location — Analytics | Location › Approximate location — Analytics |
| Çökme kayıtları, tanılama | Crashlytics | Analitik | Diagnostics › Crash Data, Performance Data | App info and performance › Crash logs, Diagnostics |
| Satın alma geçmişi (ürün, tutar, para birimi) | Firebase (`purchase`), Meta (`fb_mobile_purchase`), RevenueCat | Analitik / Pazarlama | Purchases › Purchase History — Analytics; + Meta: Third-Party Advertising, **tracking** | Financial info › Purchase history — Analytics, Advertising or marketing |
| Reklam kimliği (IDFA / GAID) | AdMob (reklam katmanı), Meta (yalnızca ATT/izin sonrası) | Pazarlama + ATT | Identifiers › Device ID — Third-Party Advertising, **Used to Track You** (yalnızca izinle) | Device or other IDs — Advertising or marketing, shared |
| Reklam etkileşimi | AdMob, Meta (`AdImpression`) | Pazarlama | Usage Data › Advertising Data — Third-Party Advertising | App activity — Advertising or marketing |
| Uygulama kurulumu/aktivasyonu | Meta SDK | Pazarlama + ATT | Usage Data / Identifiers — Third-Party Advertising, tracking | App activity — Advertising or marketing, shared |

Kesinlikle **toplanmaz:** ad, e-posta, telefon, kişi listesi, kesin konum, sağlık, mesajlar, kullanıcı içeriği. "Data is encrypted in transit": evet (SDK'lar TLS). "Users can request deletion": evet (§5.4). Play formunda Firebase/Meta için "veri işleyen (service provider)" istisnası uygulanıp uygulanmayacağı — Meta için **uygulanmaz** (reklam amaçlı paylaşım) — avukat/sahip teyidi.

---

## 10. Ne gerçek, ne sahte; neyi doğrulayamadık

| Konu | Durum |
|---|---|
| Katalog, temizleyici, rıza modeli, kuyruk, oturumlar, FTUE, Remote Config ayrıştırma, Firebase/Meta sağlayıcı mantığı | **Gerçek kod**, vitest ile (sahte SDK'larla) doğrulandı |
| Web/demo sink'ler | **Sahte** (DebugProvider + kayıt yapan Meta SDK'sı); dışarı **hiçbir ağ isteği** gitmez (Playwright'ta 0 dış istek) |
| Native Firebase/Meta bağlama (`*.native.ts`) | Gerçek API'ye karşı tip kontrolünden geçti; **cihazda çalıştırılmadı** |
| Config eklentileri | Firebase: örnek dosyalarla `expo config --type introspect` hatasız. Meta: eklenti props'u üretimi doğrulandı; prebuild/derleme yapılmadı |
| AdMob `onPaidEvent` → `trackAdRevenue` | Kanca hazır; reklam katmanında çağrılmıyor (§12) |
| Retention ve KPI'lar yalnızca rıza verenleri kapsar | Rıza oranı düşükse örneklem yanlıdır; publisher'a "rıza veren kohort" olarak etiketlenir. Rıza oranı yalnızca cihazda (Koçun Raporu, 11 §2.2.5) |

Gerçek proje/cihaz olmadan doğrulanamayanlar: iOS'ta RNFB 26 + `disableSPM` + statik framework + Google Mobile Ads + FBSDK 18 birlikte derleme; RN 0.88 yeni mimaride `react-native-fbsdk-next`'in interop katmanıyla çalışması; DebugView'da olayların görünmesi ve parametre adlarının kabulü; Consent Mode v2 sinyallerinin GA4 tarafında doğru yansıması; AdMob–Firebase bağlantısıyla `ad_impression` gelirinin gelmesi; Meta Events Manager'da kurulum/purchase olayları ve AEM; BigQuery dışa aktarımı; Crashlytics sembolleştirme (dSYM/mapping yüklemesi EAS'ta).

---

## 11. Avukata sorular

**D-161 ile eklenen / önceliği artan sorular:**
- **A. Varsayılan açık analitiğin hukuki sebebi (KVKK md. 5):** isimsiz/takma adlı oyun analitiği ve çökme raporları için "meşru menfaat" (md. 5/2-f) yeterli mi, yoksa açık rıza mı gerekir? Açık rıza gerekiyorsa D-161 Türkiye için geri alınmalı. Aydınlatma metni (md. 10) bu hâliyle yeterli mi?
- **B. Yurt dışı aktarım (KVKK md. 9, 2024 değişikliği):** varsayılan açık analitikte aktarım mekanizması: standart sözleşme + Kurul'a 5 iş günü içinde bildirim mi? Google'ın sözleşmesi bunu karşılar mı? Açık rıza seçeneği varsayılan açıkla bağdaşmaz.
- **C. Mağaza beyanları:** App Store "App Privacy" (Usage Data / Diagnostics → "Not linked to you" mi "Linked"?) ve Google Play "Data safety" (toplanıyor, isteğe bağlı değil, şifreli aktarım, silme yolu) formları D-161'e göre nasıl doldurulmalı?
- **D. 16–17 yaş:** varsayılan açık analitik reşit olmayan için de kabul edilebilir mi (reklam kimliği ve pazarlama kapalı)?
- **E. Bölgesi bilinmeyen cihaz:** AEA olabileceği için rızaya bağlı tutuldu; bu temkin gerekli mi, yeterli mi?

**Önceki sorular:**

1. **Hukuki sebep (KVKK md. 5):** (D-161 öncesi soru; yukarıda A.) Tasarım artık sahip kararıyla varsayılan açık; avukat aksini söylerse `analyticsDefaultOn` TR için kapatılır.
2. **Yurt dışına aktarım (KVKK md. 9, 2024 değişikliği):** Google (Firebase/GA4, BigQuery) ve Meta'ya aktarım için hangi mekanizma: standart sözleşme (Kurul'a 5 iş günü içinde bildirim) mi, açık rıza mı (arızi aktarım)? Google ve Meta'nın sunduğu sözleşmeler Kurul'un standart sözleşmesi yerine geçer mi?
3. **Pazarlama ölçümü (Meta App Events, kurulum atribüsyonu):** "Kişiselleştirilmiş reklam" açık rızası bu amacı da kapsar mı, yoksa ayrı bir "reklam ölçümü / atribüsyon" anahtarı mı gerekir? Kart metni buna göre değişmeli mi?
4. **Remote Config fetch'i:** Firebase Installation ID gönderen bu istek rızasız (oyunun işleyişi için) yapılabilir mi? Şu an rızaya bağlı.
5. **Crashlytics:** Çökme raporları "hizmetin sunulması için zorunlu" sayılıp rızasız toplanabilir mi? Şu an analitik rızasına bağlı.
6. **Silme talepleri:** Backend yokken GA4 User Deletion API ve Meta silme talebi için oyuncudan app-instance id almak yeterli/orantılı mı? Başvuru süresi (30 gün) nasıl karşılanacak?
7. **16–17 yaş:** Analitiği de kapatmak (D-102) zorunlu mu, yoksa yalnızca reklam/ölçüm mü? Yaş kapısı yanıtının (yalnızca bant) saklanması yeterli mi?
8. **Publisher'a veri devri:** Toplu BigQuery görünümleri kişisel veri sayılır mı (düşük n'li kohortlar)? Publisher veri sorumlusu mu, veri işleyen mi olur; sözleşmede ne yazmalı?
9. **VERBİS:** Bu işleme faaliyetleri şirketin VERBİS kaydına (eşik altıysa muafiyet) etkisi.
10. **GDPR (EEA oyuncular):** UMP'nin TCF amaçları analitik anahtarının yerine geçebilir mi, yoksa ayrı anahtar kalmalı mı? AB temsilcisi (md. 27) gerekir mi?

---

## 12. Kardeş kodda kalan bağlantılar

| Yer | Gerekli çağrı | Durum |
|---|---|---|
| `src/ads/AdMobProvider.ts` — reklam yüklenince `onPaidEvent`/`AdEventType.PAID` | `trackAdRevenue({ placement, format, valueMicros, currency, source, platform:'admob' })` | **Eksik** (reklam ajanı). Olmadan Meta'ya `AdImpression` gitmez; Firebase AdMob bağlantısından gelir. |
| `src/ads/adService.ts` — `showInterstitial` dönüşü | Şu an `useGame.returnSlot` ledger farkından `trackAdShown('return','interstitial')` çıkarıyor; ileride servis içinden çağrılabilir | Çalışıyor (dolaylı) |
| `src/ads` rıza kartı | Analitik anahtarı şu an ayrı kartta, reklam kartlarından hemen sonra. 11 §3.2 aynı kartta üçüncü anahtar istiyor: `AnalyticsSwitch` bileşeni (`src/analytics/ConsentUI.tsx`) reklam katmanının `Choice` kartına konabilir | İsteğe bağlı (reklam ajanı) |
| `src/monetization/purchases.ts` | Şu an `ShopScreen` sarmalıyor (`trackPurchaseStart/Result`, `trackRestore`). Başka bir satın alma yüzeyi (ör. 2. ölüm teklifi) eklenirse `trackPaywallView('post_death_2')` + aynı iki çağrı | Mağaza ekranı bağlı |
| Öğretici/onboarding | `tutorialRuntime.ts` → `onEvent: trackTutorialEvent`; Ayarlar › ipucu sıfırla → `trackHintsReset()`; ek adımlar için `trackFtue(...)` | **Bağlandı** |
| Meta Audience Network | AdMob mediation adaptörü (doc 15'e not) | Gelecek |
