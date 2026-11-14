# Mağaza uyum paketi — Motto 1.0

> **Durum:** taslak, 2026-11-14. **Hukuki görüş değildir.** ⚖️ işaretli her satır avukat (KVKK / tüketici / marka) ya da mali müşavir onayı ister; ☐ işaretli satırlar sahibin konsolda doğrulayacağı noktalardır.
> **Kaynaklar:** 00 D-037, D-053, D-106, D-161 · 06 §2.7, §5 · 08 §2.4, §2.6, K8, K9, K21, K22 · 14 §3–§7 · 15 §1–§8 · 16 · 17 §5, §9, §11 · 19 · `apps/mobile/app.json`, `app.config.js`, `firebase.json`, `src/monetization/*`, `src/ads/config.ts`, `packages/engine/src/wager.ts`.
> **İlke:** iki form (Apple App Privacy, Google Data safety) **aynı tablodan** doldurulur. Bir SDK eklenir ya da çıkarılırsa bu belge güncellenmeden sürüm yayınlanmaz (11 §4).

---

## 0. Uygulamadaki SDK'lar ve ne zaman başladıkları (formların dayanağı)

| SDK | Sürüm | Ne zaman başlar | Varsayılan | Kaynak |
|---|---|---|---|---|
| Firebase Analytics | RNFB 26.4.2 | Yaş kapısı `adult` veya `minor` olunca; TR / ABD / diğer bölgelerde **kendiliğinden** (D-161). AEA / BK / CH / bölgesi bilinmeyen cihazda yalnızca "Analitik paylaşımı" anahtarı açılırsa | Açık (AEA dışı) · reklam sinyalleri `denied` · Google Signals kapalı · otomatik ekran raporu kapalı | 17 §5.0–5.2, `firebase.json` |
| Firebase Crashlytics | 26.4.2 | Analitikle aynı | Analitikle aynı | 17 §5.2 |
| Firebase Remote Config | 26.4.2 | Analitik açıkken, 12 saatte bir fetch | Analitikle aynı | 17 §5.2 |
| Google Mobile Ads (AdMob) + UMP | 17.4.0 | Tek gizlilik kartından (1. oturum, ilk karnenin "Bir Yıl Daha"sı) **sonra**; ilk reklam ≥ 2. oturum | Kişiselleştirilmemiş (`requestNonPersonalizedAdsOnly`) ta ki açık izin (+ iOS'ta ATT) gelene kadar · `maxAdContentRating: T` · `tagForChildDirectedTreatment: false` · 16–17'de `tagForUnderAgeOfConsent: true` | 15 §5 |
| Meta App Events (`react-native-fbsdk-next`) | 13.4.3 | **Yalnızca** "Kişiselleştirilmiş reklam" izni + (iOS) ATT izni varsa; 16–17'de asla | Kapalı (auto-init, auto-log, advertiser ID kapalı) · App ID girilmeden build'e hiç girmez | 17 §5.2, §7; `app.config.js` |
| RevenueCat (`react-native-purchases`) | 11.0.2 | Mağaza ekranı **ilk açıldığında** | Anonim app user ID (`$RCAnonymousID…`), hesap yok | 14 §2.3, §7 m.6 |
| expo-notifications | ~58.1.8 | Oyuncu oyunda "Evet, yaz" dedikten sonra (≥ 2. oturum sonu) | Yalnızca **yerel** bildirim; push token yok, sunucu yok | 19 |
| expo-audio | — | Ses efektleri | Mikrofon izni **kapalı** (`microphonePermission: false`) | `app.json` |

**Hiç olmayanlar:** hesap / giriş, ad, e-posta, telefon, kişi listesi, fotoğraf, kamera, mikrofon, **kesin veya kaba konum izni**, sağlık verisi, mesajlaşma, kullanıcı içeriği (UGC), sohbet, web görünümü/sınırsız web erişimi, backend sunucusu. Oyun kaydı yalnızca cihazdadır.

---

## 1. Apple App Privacy ("nutrition label")

### 1.1 Üst sorular

| Soru | Cevap | Not |
|---|---|---|
| Do you or your third-party partners collect data from this app? | **Yes** | Firebase, AdMob, RevenueCat, (izinle) Meta |
| Privacy Policy URL | Yayınlanmış gizlilik politikası (TR + EN) | ☐ `app.json › extra.monetization.legal.privacyUrl` aynı adres |
| User Privacy Choices URL (isteğe bağlı) | Gizlilik politikasındaki "Verilerimi sil / tercihler" bölümü | Önerilir |

### 1.2 Veri türü tablosu

"Linked" = kullanıcının kimliğine bağlı mı (hesap yok; fakat Apple, cihaz kimliği üzerinden ilişkilendirilen veriyi de "linked" sayabilir). "Tracking" = başka şirketlerin uygulama/sitelerindeki veriyle birleştirilip reklam için kullanılması ya da veri komisyoncusuyla paylaşılması.

| Apple veri türü | Toplanıyor mu | Kim | Amaç(lar) | Linked to user? | Tracking? | İsteğe bağlı mı |
|---|---|---|---|---|---|---|
| **Identifiers › Device ID** (IDFV, Firebase app-instance ID, RevenueCat anonim ID) | Evet | Firebase, RevenueCat | Analytics, App Functionality | **Hayır** önerilir — ⚖️ bkz. not A | Hayır | Analitik AEA dışında varsayılan açık → "isteğe bağlı" denmez |
| **Identifiers › Device ID** (IDFA) | Yalnızca ATT izniyle | AdMob, Meta | Third-Party Advertising, Developer's Advertising or Marketing, Analytics | Hayır | **Evet** (yalnızca ATT izni verende) | Evet (ATT + kart) |
| **Usage Data › Product Interaction** (olaylar: gün, karar, karne, mağaza açıldı…) | Evet | Firebase; pazarlama alt kümesi Meta | Analytics, App Functionality (Remote Config) ; Meta için Developer's Advertising or Marketing | Hayır | Meta kısmı **Evet** (ATT izniyle) | AEA'da evet, diğerlerinde varsayılan açık |
| **Usage Data › Advertising Data** (gösterim, tıklama, ödüllü reklam sonucu) | Evet | AdMob, Firebase (`ad_impression` AdMob bağlantısıyla), Meta | Third-Party Advertising, Analytics | Hayır | Kişiselleştirilmiş izin + ATT varsa **Evet**, yoksa Hayır | Reklam gösterimi zorunlu değil ama oyunda reklam var; "toplanır" işaretlenir |
| **Purchases › Purchase History** (ürün, tutar, para birimi, işlem kimliği) | Evet | RevenueCat, Firebase (`purchase`), Meta (`fb_mobile_purchase`) | App Functionality (geri yükleme/hak), Analytics; Meta: Developer's Advertising or Marketing | **Evet** önerilir (RevenueCat anonim ID'ye bağlı tutar) — ⚖️ not A | Meta kısmı **Evet** (ATT izniyle) | Yalnızca satın alan için |
| **Diagnostics › Crash Data** | Evet | Crashlytics | App Functionality, Analytics | Hayır | Hayır | Analitikle aynı |
| **Diagnostics › Performance Data** | Evet (Crashlytics oturum/ANR bilgisi; Firebase Performance **yok**) | Crashlytics | App Functionality | Hayır | Hayır | Analitikle aynı |
| **Diagnostics › Other Diagnostic Data** | Evet (cihaz modeli, OS sürümü — SDK'ların kendi topladığı) | Firebase, AdMob | Analytics, App Functionality | Hayır | Hayır | — |
| **Location › Coarse Location** | **Evet** — izin istemeyiz ama Google IP'den ülke/şehir türetir; AdMob IP'yi işler | Firebase, AdMob | Analytics, Third-Party Advertising | Hayır | Kişiselleştirilmiş + ATT varsa Evet | — | 
| Location › Precise | **Hayır** | — | — | — | — | — |
| Contact Info, Health & Fitness, Financial Info (kart vb.), Contacts, User Content, Browsing/Search History, Sensitive Info | **Hayır** | — | — | — | — | Ödeme bilgisini Apple alır; biz görmeyiz |

**Not A — "Linked to you" ⚖️☐:** 17 §9.2 Firebase verilerini "not linked" olarak önerir; hesap yoktur, yalnızca rastgele cihaz/örnek kimlikleri vardır. Apple'ın tanımı cihaz kimliği üzerinden ilişkilendirmeyi de "linked" sayabildiği için **temkinli seçenek**: Purchase History'yi "Linked" işaretlemek (RevenueCat kayıtları anonim ID ile kalıcı tutulur), diğerlerini "Not linked". Apple ret gerekçesi olarak genellikle eksik beyanı görür, fazla beyanı değil; şüphede "Linked" seçmek daha güvenlidir. Son karar avukat + sahip.

**"Data Used to Track You" bölümüne girecekler (yalnızca ATT izni veren kullanıcılar için gerçekleşir, fakat beyan edilir):** Device ID (IDFA), Advertising Data, Product Interaction (Meta), Purchase History (Meta), Coarse Location (AdMob kişiselleştirilmiş). Meta App ID girilmeyecekse (TR teknik fazı) Meta satırları formdan çıkarılır ☐.

### 1.3 ATT (App Tracking Transparency)

- İstem **yalnızca** reklam katmanından, en erken 3. oturumda, yalnızca oyuncu "Kişiselleştirilmiş reklam"a izin verdiyse, önce düz dilli ön-ekran (15 §5).
- `NSUserTrackingUsageDescription` (app.json + `locales/*.json`, bu metinler build'de):
  - **EN:** "To pick ads based on your activity in other apps. If you refuse, the game stays exactly the same."
  - **TR:** "Reklamları diğer uygulamalardaki etkinliğine göre seçmek için. İzin vermezsen oyun aynı kalır."
- Apple 5.1.2 açısından: metin amacı söylüyor, ödül/ceza vaadi yok, sistem diyaloğunu taklit eden ön-ekran yok. ⚖️ 15 §8 m.7.
- ☐ App Review notunda ATT'nin neden ilk açılışta çıkmadığı yazılır (checklist.md §9).

### 1.4 Privacy manifest (PrivacyInfo.xcprivacy)

- Firebase, Google Mobile Ads, RevenueCat ve Meta SDK'ları kendi manifestlerini taşır. Uygulamanın kendisi (AsyncStorage → `NSUserDefaults`, dosya zaman damgası, sistem açılış süresi API'leri) için Expo `app.json › ios.privacyManifests` gerekir; şu an **yok** ☐ (checklist.md §5). Gerekçe kodları: `NSPrivacyAccessedAPICategoryUserDefaults: CA92.1`, `FileTimestamp: C617.1`, `SystemBootTime: 35F9.1`, `DiskSpace: E174.1` — `expo prebuild` sonrası Xcode "Privacy Report" ile doğrulanmalı.
- `NSPrivacyTracking: true` ve `NSPrivacyTrackingDomains` Meta/AdMob manifestlerinden gelir; uygulama manifestine elle domain yazmayın.

---

## 2. Google Play Data safety

### 2.1 Üst sorular

| Soru | Cevap |
|---|---|
| Does your app collect or share any of the required user data types? | **Yes** |
| Is all of the user data collected by your app encrypted in transit? | **Yes** (SDK'ların tamamı HTTPS/TLS) |
| Do you provide a way for users to request that their data is deleted? | **Yes** — uygulama içi "Verilerimi sil / analitik kimliğimi sıfırla" + destek e-postası (17 §5.4). Play ayrıca bir **silme talebi URL'si** ister: gizlilik politikasındaki silme bölümü ☐ |
| Account creation | **Hesap yok** ("My app does not allow users to create an account") — bu yüzden hesap silme URL'si zorunluluğu doğmaz |
| Independent security review | Hayır (isteğe bağlı rozet) |
| UPI / Families | Uygulanmaz |

### 2.2 Veri türü tablosu

"Shared" = üçüncü tarafa aktarım. Google, **hizmet sağlayıcı** (sizin adınıza işleyen) aktarımları "shared" saymaz; Firebase ve RevenueCat bu istisnaya girer. **AdMob ve Meta reklam amaçlı kendi işlemeleri nedeniyle "shared" işaretlenir** (17 §9.2). ⚖️☐

| Play kategori › tür | Collected | Shared | Ephemeral? | Required / Optional | Amaç(lar) |
|---|---|---|---|---|---|
| **Device or other IDs** (Firebase app-instance ID, RevenueCat anonim ID, Android ID türevleri SDK içi, **AAID/GAID**) | Evet | **Evet** (AdMob, Meta: reklam kimliği) | Hayır | AAID: AdMob kişiselleştirilmemiş modda da işler → **Required** işaretlemek temkinli; Meta kısmı Optional | App functionality, Analytics, Advertising or marketing, Fraud prevention, security & compliance |
| **App activity › App interactions** | Evet | Meta alt kümesi: **Evet** (izinle) | Hayır | AEA'da Optional; diğerlerinde varsayılan açık → **Required** (analitik kapatılamıyor; ⚖️ 17 §11-C) | Analytics, App functionality; Meta: Advertising or marketing |
| **App activity › Other actions** (reklam etkileşimi) | Evet | **Evet** (AdMob, Meta) | Hayır | Required (reklam gösterimi) | Advertising or marketing, Analytics |
| **App info and performance › Crash logs** | Evet | Hayır | Hayır | AEA'da Optional, diğer Required | Analytics, App functionality |
| **App info and performance › Diagnostics** | Evet | Hayır | Hayır | aynı | Analytics, App functionality |
| **Financial info › Purchase history** | Evet (yalnızca satın alanlar) | Meta alt kümesi: **Evet** (izinle) | Hayır | Optional (satın almak isteğe bağlı) | App functionality, Analytics; Meta: Advertising or marketing |
| **Location › Approximate location** | Evet (IP'den türetilen; izin istenmez) | **Evet** (AdMob) | Hayır | Required | Analytics, Advertising or marketing |
| Location › Precise, Personal info, Messages, Photos & videos, Audio, Files, Calendar, Contacts, Web browsing, Health & fitness, Financial info (kart vb.) | **Hayır** | — | — | — | — |

### 2.3 Diğer Play Console beyanları

| Beyan | Cevap |
|---|---|
| **Ads** | "Yes, my app contains ads" (vitrinde "Contains ads" etiketi) |
| **App access** | Tüm işlevler giriş gerektirmeden erişilebilir. Not: ilk açılışta nötr yaş kapısı var; inceleyici herhangi bir yetişkin doğum yılı (ör. 1990) girer → "Evet" |
| **Advertising ID** (Android 13+ `AD_ID` izni) | "Yes, uses advertising ID" → amaç: Advertising or marketing, Analytics; izin `react-native-google-mobile-ads` eklentisinden gelir |
| **Target audience and content** | Yaş grupları: **18+ ve 16–17** (13–15 ve altı **seçilmez**). "Appeals to children" sorusu: **Hayır**. Families programı: **katılmıyor** ⚖️ 15 §8 m.0(d) |
| **News app** | Hayır |
| **Health apps** | Hayır (oyun içi "Sağlık" bir oyun stat'ıdır, sağlık özelliği değildir) |
| **Financial features** | Hayır |
| **Government apps** | Hayır |
| **Data safety ↔ gizlilik politikası** | Aynı SDK listesi ve aynı amaçlar; Play, politikada her SDK'nın adını görmek ister |
| **Permissions** | `INTERNET`, `ACCESS_NETWORK_STATE`, `AD_ID`, `POST_NOTIFICATIONS` (yalnızca oyuncu "Evet" dedikten sonra istenir), `VIBRATE`, `com.android.vending.BILLING`. ☐ Prebuild sonrası `AndroidManifest.xml`'de `RECORD_AUDIO` **olmadığını** doğrulayın (expo-audio `recordAudioAndroid: false`) |

---

## 3. Yaş derecelendirme

### 3.1 Apple — yeni yaş derecelendirme sistemi (2025; kademeler 4+ / 9+ / 13+ / 16+ / 18+)

Anket "en yoğun içerikle" doldurulur (00 §2.3). Sıklık sözlüğü: None / Infrequent / Frequent.

| Bölüm › Soru | Cevap | Gerekçe (repo kanıtı) |
|---|---|---|
| **In-App Controls › Parental Controls** | No | Ebeveyn denetimi özelliği yok |
| **In-App Controls › Age Assurance** | **Yes** ⚖️☐ | Uygulama içi nötr yaş kapısı (doğum yılı; < 16 oyunu açmaz, 16–17 reklam kişiselleştirme/Meta kapalı). Bu bir **beyan** (self-declaration), doğrulama değildir; Apple'ın "age assurance" tanımının beyanı kapsayıp kapsamadığını konsol yardım metninden teyit edin. Kapsamıyorsa "No" |
| **Capabilities › Unrestricted Web Access** | No | WebView / tarayıcı yok; hukuki metinler uygulama içi |
| **Capabilities › User-Generated Content** | No | Oyuncu yalnızca kurgusal ad karıştırır; serbest metin paylaşımı yok |
| **Capabilities › Messaging and Chat** | No | NPC "mesajları" önceden yazılmış metindir |
| **Capabilities › Advertising** | **Yes** | AdMob interstitial + rewarded |
| **Mature Themes › Profanity or Crude Humor** | **Frequent** | Kaba mizah sık; küfür yalnızca evren-içi `[sansür]` biçiminde (08 K21) — taramada içerikte `[sansür]` sayısı 0, ama koç ağzı sık kaba mizah |
| **Mature Themes › Horror/Fear Themes** | None | — |
| **Mature Themes › Alcohol, Tobacco, or Drug Use or References** | **Infrequent** | Sözcük taraması: 10.166 olayın ~18'inde alkol, ~30'unda tütün etiketi, ~5'inde uyuşturucu referansı (< %1). Karakter uyuşturucu **kullanmaz** (08 K8). **Frequent işaretlenmemeli** (18+'e iter; D-037) |
| **Mature Themes › Mature or Suggestive Themes** | **Frequent** | Ölüm, yas, hastalık, iş kaybı, aldatma kara komedi olarak; 16+ ekseni (08 §2.6) |
| **Medical or Treatment-Related Information** | None | Doktor NPC teşhis koymaz (`DL-06`); "Sağlık" bir oyun stat'ı |
| **Health or Wellness Topics** (2025 sorusu) | **No** ⚖️☐ | Oyun sağlık/wellness bilgisi vermez; mağaza metni bu sözcükleri bilinçli olarak kullanmaz (D-053). "Gerçek hayatta yardım" ekranı (08 §2.5) bir yönlendirmedir, içerik değildir — avukatla teyit |
| **Simulated Gambling** | **None** | Bkz. §3.3: koçun "iddiası" bir tahmin fişidir; oyuncu hiçbir şey yatırmaz, oynanabilir şans oyunu yoktur. Piyango yalnızca 3 olayda anlatı cümlesidir (oynanmaz) |
| **Contests** | None | — |
| **Loot boxes / random paid items** | None | `randomness: false` her üründe (tip düzeyi); rastgele kutu negatif katalogda |
| **Sexuality or Nudity** | None (ima var, tasvir yok) — Apple sorusunda "Infrequent Mature or Suggestive" zaten kapsar | ~13 olayda "slept with" ima; kapı kapalı (08 K10) |
| **Graphic Sexual Content and Nudity** | None | — |
| **Cartoon or Fantasy Violence** | Infrequent | "Dayak yedin, Sağlık −20" türü metin; görsel şiddet yok |
| **Realistic Violence** | None | — |
| **Prolonged Graphic or Sadistic Realistic Violence** | None | — |
| **Guns or Other Weapons** | None | — |

**Beklenen sonuç: 16+.** Belirleyici satırlar "Mature or Suggestive Themes: Frequent" (16+) ve "Profanity/Crude Humor: Frequent" (13+). Anket 18+ üretirse sebep büyük olasılıkla alkol satırının "Frequent" işaretlenmesidir → içerik kotası (08 QT-01..03) ihlali sayılır, cevap değil içerik düzeltilir. **Elle 18+'e yükseltme yapılmaz** (D-037); 7578 sayılı Kanun / BTK yönetmeliği 18+ isterse ayrı karar ⚖️ (00 §10, 08 §2.8 m.19).

### 3.2 Google Play — IARC anketi

| IARC sorusu | Cevap |
|---|---|
| Kategori | Game |
| Violence | Evet, **hafif / karikatür**, metin tabanlı; kan, ayrıntı, gerçekçi tasvir yok |
| Fear | Hayır |
| Sexuality | **İma** (ilişki, "birlikte uyudular"), çıplaklık ve tasvir yok |
| Language | **Orta / kaba mizah**; küfür yalnızca sansürlü biçimde (`[sansür]` / `[redacted]`), slur yok |
| Controlled substances | **Referans** (alkol, tütün); özendirme yok, sonuçları negatif; karakter uyuşturucu kullanmaz |
| Crude humor | Evet |
| Gambling | **Hayır** — gerçek para kumarı yok, **simüle kumar yok**, oynanabilir şans mekaniği yok. "Koç tahmin eder, oyuncu hiçbir şey yatırmaz" (§3.3) |
| Discrimination / hate | Hayır |
| User interaction: users can interact/communicate | Hayır |
| Shares user's location | Hayır |
| Digital purchases | **Evet** (uygulama içi satın alma) |
| Random items purchase (loot box) | **Hayır** |
| Unrestricted internet | Hayır |

**Beklenen sonuçlar (08 §2.6):** PEGI **16** (kaba dil + olgun tema; alkol referansı PEGI'de 16'yı tetikleyebilir), ESRB **T (Teen)** — descriptors: Crude Humor, Mild Language, Mild Violence, Suggestive Themes, Use of Alcohol and Tobacco references; USK **16**; ClassInd **16**; ACB **M**; Rusya 16+. IARC çıktısı farklı gelirse içerik değil cevap tutarlılığı kontrol edilir; ESRB "Simulated Gambling" descriptor'ı **çıkmamalı**.

**Coğrafi:** Kore (GRAC) ve Çin ilk lansmanda kapalı (08 §2.8 m.16).

### 3.3 "İddia" mekaniği — inceleyiciye ve formlara kesin tarif

Kaynak: `packages/engine/src/wager.ts`, 00 §6 imza özellik 1, 08 K9.

1. Bazı karar kartlarında (yılda en çok 2, iki iddia arasında ≥ 3 gün) koç kartın köşesine bir fiş iğneler: **"İDDİA: Kayda yetişemezsin. — M."** / **"WAGER: You won't make registration."**
2. Koç **her zaman başarısızlık** tahmin eder ve fişte **gerçek olasılığı** yazar ("Gerçek oran: %40. Zar benim değil."). Yalnızca olasılığı %35–%65 arasındaki kararlarda açılır.
3. **Oyuncu hiçbir şey yatırmaz:** ne gerçek para, ne oyun parası, ne puan, ne süre. Satın alınabilir bir şey yoktur; reklamla ilişkisi yoktur; oran satılmaz (`NEVER_SOLD` içinde `wagerOdds`).
4. Oyuncu kartın seçeneklerinden birini **her zamanki gibi** seçer. İddia servisi yalnızca gözlemcidir: sonucu çekmez, statları değiştirmez ("twin-life invariant": iddia açık ve kapalı iki hayat aynı sonuçları üretir).
5. Sonuçta fişe **HAKSIZ ÇIKTIM / I WAS WRONG** (oyuncu başardı) ya da **İSABET / CALLED IT** damgası basılır; bu bir kozmetik koleksiyon ve karnede "Koçun isabeti: 1/2" satırıdır.
6. Dil kuralı: koç satırlarında ve mağaza metninde "bahis/bet" yasak (lint `RL-12`); "iddia/wager, oran/odds" serbest.

→ Apple "Simulated Gambling: None", IARC "Gambling: No". ⚖️ Risk notu §5.

---

## 4. İhracat uyumu (Export Compliance)

| Soru (App Store Connect) | Cevap |
|---|---|
| Does your app use encryption? | **Yes** — yalnızca işletim sisteminin ve SDK'ların standart HTTPS/TLS'i |
| Does your app qualify for any of the exemptions provided in Category 5, Part 2? | **Yes** — yalnızca standart kriptografi, işletim sistemi tarafından sağlanan; özel/tescilli algoritma yok |
| Sonuç | **Muaf**; yıllık self-classification raporu ve CCATS gerekmez (yalnızca standart HTTPS) ⚖️☐ (ABD EAR; Fransa dağıtımı için ayrı beyan gerekmez çünkü özel şifreleme yok) |

Her build'de soruyu atlamak için `app.json › expo.ios.config.usesNonExemptEncryption: false` (Info.plist `ITSAppUsesNonExemptEncryption = NO`) eklenmeli — **şu an yok** ☐ (apps/ altına bu ajan dokunmadı; checklist.md §5).

---

## 5. Politika riskleri (bulunanlar)

| # | Risk | Ciddiyet | Öneri |
|---|---|---|---|
| R1 | **Uygulama ikonu Expo'nun varsayılan şablon ikonu** (`apps/mobile/assets/icon.png`: mavi "A" ızgara). Android adaptive icon arka planı da Expo varsayılanı `#E6F4FE`. Apple 2.3.8 / 4.1 ve Play "yanıltıcı/şablon" metadata ile ret ya da marka karışıklığı | **Yayın engeli** | Gerçek ikon (11 §2.8.1: "düdük + defter, acid-lime, yüz yok") tasarlanmalı. `docs/store/screenshots/icon-512.png` **geçici** bir öneridir (tipografik "M" damgası), marka tescili yapılmadan son ikon sayılmamalı |
| R2 | **Ekran görüntüleri web demosundan** alındı; web Google Fonts (Fraunces, IBM Plex Sans, Archivo Black) yükler, **native build bu fontları paketlemez** (iOS: Georgia / AvenirNext-Heavy, Android: serif / sans-serif-black; `src/theme.ts`). Apple 2.3.3 / Play: görseller uygulamayı doğru göstermeli | Orta | (a) Üç OFL fontu native'e de paketleyin (expo-font) — en temiz çözüm; ya da (b) TestFlight build'inden cihazda yeniden çekim. İçerik, düzen ve renkler aynı; yalnızca yazı tipi farklı |
| R3 | **"İddia / wager"** sözcüğü kumar sınıflandırmasını tetikleyebilir (özellikle Play otomatik incelemesi, ESRB "Simulated Gambling" descriptor'ı) | Düşük–orta | §3.3'teki tarif inceleme notuna konur; anahtar kelimelerde EN'de "wager" yok, TR'de "iddia" var (izleyin) |
| R4 | **"Reklamsız / No Ads" adı** yalnızca geçiş reklamlarını kapatır; ödüllü teklif kalır (`noAdsMode: 'showAd'`). Reklam Kurulu / Apple 3.1.1 açısından "yanıltıcı ad" riski (14 §7 m.5, 15 §8 m.9) | Orta ⚖️ | Ürün açıklaması mağazada "Geçiş reklamlarını kapatır; isteğe bağlı ödüllü teklifler kalır." diye yazılır (checklist §6). Avukat "Geçiş Reklamsız" derse ad değişir |
| R5 | **Analitik varsayılan açık (D-161)** — KVKK md. 5 hukuki sebebi ve md. 9 yurt dışı aktarım netleşmedi; Data safety'de "Required" demek gerekir | Orta ⚖️ | 17 §11 A–C; avukat aksini derse `analyticsDefaultOn` TR için kapanır ve formlar "Optional" olur |
| R6 | **Yaş kapısı 16, mağaza derecesi 16+** ama AdMob içerik derecesi T ve IARC ESRB T (13+) → küçük tutarsızlık; 7578 sayılı Kanun / BTK 18+ isteyebilir | Düşük ⚖️ | 08 §2.8 m.19 |
| R7 | **Gizlilik politikası, koşullar, destek e-postası, app-ads.txt alan adı** henüz yok (`PLACEHOLDER_*`) | **Yayın engeli** | checklist §1 |
| R8 | **Ekran görüntülerinde demo fiyatı** (49,99 ₺ / $1.99 — `fallbackPrice`) görünüyor; son fiyat farklıysa yanıltıcı olur | Düşük | Mağazaya girilen fiyat bu değilse 08 numaralı görüntü yeniden üretilir (`docs/store/screenshots/README` §yeniden üretim) |
| R9 | **Marka**: "Motto" jenerik; mağazada "Motto - Daily Quotes", "Motto Immortal" var. Ad rezervasyonu ve TÜRKPATENT/EUIPO/USPTO başvurusu yapılmadan kamuya açık listeleme | Orta ⚖️ | 00 D-111; marka vekili |
| R10 | **Bildirimler** (yerel, koç ağzında) pazarlama sayılmaz varsayımı (Apple 4.5.4) | Düşük ⚖️ | 19 §5 |
| R11 | **Varlık kaynak kaydı** (`assets/SOURCES.md`, D-111 / 08 m.17) repoda yok | Düşük | Ses: kendi sentez betiği (aşağıda). Avatar/ikon kaynakları yazılmalı |

---

## 6. İçerik hakları (Apple "Content Rights" sorusu)

**Soru:** "Does your app contain, show, or access third-party content?" → **Hayır** önerilir ⚖️☐ (reklamlar hariç; Apple bu soruda reklamları ayrıca sormaz). Gerekçe:

| Varlık | Kaynak | Lisans / hak |
|---|---|---|
| Metin (10.166 olay, koç satırları, TR + EN) | Şirket içi yazım (insan + araç destekli; 09 pipeline) | D2P Technology; **FSEK m.52 yazılı devir** kurucu ve katkıcılardan alınmalı ⚖️ (D-111) |
| Ses efektleri (31 ses, 41 dosya) | `apps/mobile/scripts/gen-sfx.mjs` ile **sıfırdan sentez** (osilatör, gürültü, zarf); deterministik | Üçüncü taraf ses dosyası **yok** (16 §0). Müzik yok |
| Yazı tipleri — **web/demo** | Google Fonts: **Fraunces**, **IBM Plex Sans**, **Archivo Black** | Üçü de **SIL Open Font License 1.1** — ticari kullanım, gömme serbest; ad değişikliği olmadan yeniden dağıtım serbest. Native'e paketlenirse OFL metni "Lisanslar" ekranına eklenmeli |
| Yazı tipleri — **native (bugünkü build)** | Sistem fontları (iOS Georgia, AvenirNext-Heavy; Android serif, sans-serif-black) | İşletim sistemi lisansı; uygulama dosya dağıtmaz |
| Avatarlar, NPC yüzleri | Kod içinde çizilen vektör/stil (`src/avatar`) | Şirket içi ☐ kaynak kaydı |
| İkon, splash | Şu an Expo şablonu (R1) | Değiştirilmeli |
| Açık kaynak kütüphaneler | npm (MIT / Apache-2.0 / BSD) | Ayarlar › Lisanslar ekranı (08 §2.4) ☐ otomatik üretim |
| Gerçek kişi/marka | Yok (08 K1–K2 lint) | — |

---

## 7. Families / çocuklar

- **Families politikası uygulanmaz:** hedef kitle 16+ (Play'de 16–17 ve 18+ seçilir), "Designed for Families"a katılım yok, uygulama çocuklara cazip olacak şekilde pazarlanmaz (ikon/ekran görüntüsü 4+ ama sevimli maskot yok; 08 D-ÖNERİ-08-15).
- Apple: **Kids Category değil.** COPPA kapsamı dışında tasarlanmıştır: < 16 cevabında oyun açılmaz, hiçbir SDK başlamaz (15 §5.1).
- AdMob: `tagForChildDirectedTreatment: false`, 16–17 için `tagForUnderAgeOfConsent: true`, `maxAdContentRating: T`; AdMob konsolunda kumar/bahis, alkol, flört, siyaset kategorileri kapalı ☐.
- ⚖️ Play "Target audience" 16–17'yi içerdiği için Families yükümlülüğü doğar mı (15 §8 m.0d).

---

## 8. Türkiye'ye özgü

| Konu | Durum | Not |
|---|---|---|
| **Mesafeli Sözleşmeler Yönetmeliği — ön bilgilendirme** | Uygulama içi mağaza ekranında **"Satın almadan önce"** bloğu: sağlayıcı (D2P Technology), ödemeyi mağazanın alması, toplam bedel, anında teslim ve **cayma hakkı istisnası (m.15)**, iade yolu, hesaba bağlılık (14 §4) | ⚖️ 14 §7 m.1–3: ayrı onay gerekir mi, MERSİS/adres/KEP gösterilmeli mi, kalıcı veri saklayıcısı. Metin şu an **taslak** |
| **Fiyat ve KDV** | Ekranda mağazanın fiyat dizesi; TRY ise "KDV dahil" | ⚖️ 14 §7 m.8; App Store / Play TR fiyatları elle girilir |
| **KVKK Aydınlatma Metni** | Uygulama içi (Ayarlar › Gizlilik ve metinler › Aydınlatma Metni; tek gizlilik kartında "Aydınlatma Metni (taslak) ›" bağlantısı) + yayımlanacak web sayfası | ☐ Web URL'si gizlilik politikasından bağlanmalı; mağaza açıklamasında gizlilik linki var. "Okudum-onaylıyorum" tek kutu **yok** (Kurul 2026/347) |
| **Açık rıza** | Kişiselleştirilmiş reklam anahtarı kapalı başlar; [Hepsi kapalı kalsın] / [Seçimimi kaydet] eşit | ⚖️ 15 §8 |
| **Yurt dışına aktarım (KVKK md. 9)** | Google, Meta, RevenueCat (ABD) | ⚖️ Standart sözleşme + 5 iş günü Kurul bildirimi; netleşene kadar `AD_CONFIG.kill.regions = ['TR']` seçeneği var (15 §6 m.11) |
| **VERBİS** | — | Mali müşavir/avukat: muafiyet kontrolü (08 §2.8 m.7) |
| **Ticari Reklam Yönetmeliği** | Mağaza metninde sahte aciliyet, sahte sayaç, "en popüler", gerçek dışı vaat yok; ücretsiz ifadesi "reklam ve isteğe bağlı satın alma içerir" ile birlikte | Script yasak sözcük taraması temiz |
| **Vergi** | Apple/Google TR'de KDV'yi kendileri beyan eder (marketplace) varsayımı | Mali müşavir (14 §7 m.7) |
| **7578 sayılı Kanun / BTK yaş düzenlemesi** | 16+ beyan | ⚖️ çeyreklik takip |

---

## 9. Avukata gidecek liste (bu belgeden toplanan)

1. Apple "Linked to you" seçimi (Not A) ve Play'de analitik için "Required" beyanı (D-161 ile).
2. Apple "Age Assurance" sorusuna beyan tabanlı yaş kapısıyla "Yes" denmesi.
3. "Health or Wellness Topics: No" (Gerçek hayatta yardım ekranı ile).
4. "Reklamsız / No Ads" ürün adı (R4).
5. Cayma hakkı istisnası metni, satıcı sıfatı, MERSİS/KEP gösterimi (14 §7).
6. KVKK md. 5 / md. 9 (17 §11 A–B, 15 §8 m.1–2), RevenueCat aktarımı (14 §7 m.6).
7. 16–17 yaş: analitik varsayılan açık kabul edilebilir mi; Families yükümlülüğü.
8. FSEK m.52 devirleri ve marka başvurusu (R9).
9. İhracat uyumu muafiyeti (rutin; teyit).
