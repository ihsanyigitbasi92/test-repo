# T6 — Monetizasyon ve Publisher Pitch: Backend'siz IAP/Reklam Tasarımı, KPI Hedefleri, Soft Launch ve Pitch Deck

**Proje:** Backend'siz, offline-first, TR + EN (ilk günden) mobil hayat simülasyonu (18 yaşından ölüme). Ton: kara mizah + roast + gizli motivasyon. Anlatıcı çalışma adı: **Felek** (T3). Şirket Türkiye'de kurulu; **sıfır hukuki risk** ilkesi (T9) bağlayıcı.
**Konu ID:** T6 · **Tarih:** 2026-11-06 · **Durum:** Araştırma v1
**Kaynak notu:** Bu oturumda `developer.apple.com` ve `developer.android.com` doğrudan okunabildi; `apps.apple.com`, `support.google.com`, `revenuecat.com`, `appodeal.com`, `mobidictum.com`, `gameanalytics.com` ağ kısıtı nedeniyle doğrudan açılamadı. Bu kaynaklardan gelen sayılar arama özetleri ve ikincil kaynaklar üzerinden alındı ve metinde **[ikincil]** etiketiyle işaretlendi. Lansman öncesi "Açık sorular" bölümündeki her sayı birincil kaynaktan teyit edilmeli. **Şüpheci inceleme (2026-11-06):** bu dokümandaki 24 ana iddia ikinci bir ajan tarafından web araması + `developer.apple.com`/`developer.android.com` birincil sayfalarıyla kontrol edildi; düzeltmeler metin içinde **(düzeltildi: …)** / **(doğrulandı: …)** etiketiyle, özet tablo ise sondaki "Doğrulama ve Ek Bulgular" bölümünde.

---

## TL;DR

1. **Model kararı: "Rewarded-first + tek seferlik Torpil + küçük tüketilebilirler + sezonluk içerik paketi; interstitial yalnızca ölüm ekranında; abonelik 2. faz."** BitLife'ın kanıtladığı şey (tek seferlik Bitizenship 7,99 $ ABD, God Mode 9,99 $, Boss Mode 20,99 $, Time Machine 0,99 $, Bitizenship+God Mode paketi 15,99 $ — **doğrulandı:** ABD App Store IAP listesi [3], 2026-11 arama özeti [1][2]) premium-unlock modelinin metin oyununda çalıştığı; BitLife'ın en çok şikâyet aldığı şey ise agresif interstitial (T2). Boşluk tam burada.
2. **"Torpil" ismi ciddiye alınmalı ve kazanmalı:** Felek'in "sana torpil yapıyorum" cümlesiyle (T11) doğal bağ kuruyor, tek kelime, Türkçede hem komik hem "ayrıcalık" anlamı taşıyor. İçerik: tüm reklamlar kapalı (rewarded'lar opsiyonel kalır), Felek'in Kalemi (stat editörü) hariç tüm ekstra içerik, 2 anlatıcı personası, mezar taşı süsleri. **Fiyat: 6,99 $ / 199,99 ₺** (TR'de satın alma gücü indirimi bilinçli).
3. **"Kaderi rüşvetle ikna et" rewarded yerleşimi tasarımın merkezinde:** olay sonucunu yeniden çevirme, yılda 1, ölümde geçersiz. Yanında: **"Felek'e yalvar"** (ölümde ikinci şans, ömürde 1), **"Patronun gözüne gir"** (o yıl maaş ×2), **"Arka kapı"** (olaya 3. seçenek), **"Günün falı"** (günlük buff). Günlük tavan 6 rewarded, yerleşim başı cooldown, ilk 10 dakikada hiç reklam yok.
4. **Benchmark gerçeği:** ABD rewarded eCPM ~13–20 $ (iOS 19,6 $ / Android 16,5 $ **Yango Ads** Q4 2024 oyun verisi — **düzeltildi:** kaynak MAF değil, MAF ve diğer bloglar Yango'yu alıntılıyor [8][9]; Appodeal Q4 2024 ABD rewarded iOS ~17,3 $ / Android ~13,2 $ **[ikincil]** [108]), interstitial ~10–14 $; İngiltere rewarded ~10,7 $ **[ikincil]** [9][10]. Türkiye için güvenilir kamu verisi **yok**; T2'nin 2–4 $ (Android) / 3–6 $ (iOS) tahmini korunuyor, TopOn H1 2025'te Android rewarded global ortalaması 6,70 $'a (3 yılın en düşüğü) indi [14] (**doğrulandı:** rapor özeti; aynı raporda casual Android rewarded yalnızca ~3,02 $ — bizim TR Android tahminimiz için daha gerçekçi taban [109]). **Aynı DAU TR'de ABD'nin %15–25'i kadar reklam geliri üretir.**
5. **IAP dönüşümü oyun kategorisinde en düşük:** RevenueCat 2026: oyunlarda indirme→ödeme medyanı iOS %1,3 / Google Play %0,4; deneme→ücretli %4,4 (iş uygulamalarının yarısı) [68][69]. Abonelik bizim için 2. faz: ancak "sürekli değer" (Apple 3.1.2(a)) ve yeterli DAU varsa.
6. **Backend'siz makbuz doğrulama mümkün ama "kabul edilmiş risk":** StoreKit 2 işlemleri cihazda imza-doğrulamalı (JWS) teslim eder, Apple "sunucu gerektirmeden tamamen cihazda" diyor [19][20]; Google ise açıkça "satın almayı sunucunda doğrula, istemciye güvenme" diyor, cihaz içi imza kontrolü "daha az güvenli" seçenek [22][23]. **Karar: RevenueCat (backend-as-a-service; 2.500 $ MTR'ye kadar ücretsiz, sonra %1 [ikincil] [16])** doğrulama + entitlement + metrik için; `expo-iap` yedek. Oyun RevenueCat olmadan da **oynanabilir** kalır (yerel entitlement önbelleği).
7. **Play Billing Library 7 son tarihi geçti (31 Ağu 2026, uzatma 1 Kas 2026) → yeni build'lerde PBL ≥ 8 zorunlu; PBL 8'in kendi son tarihi 31 Ağu 2027 (uzatma 1 Kas 2027), PBL 9 ise 31 Ağu 2028 [24][25]** (**düzeltildi:** Google'ın deprecation tablosu birincil kaynak [110]; 2 yıllık döngü nedeniyle doğrudan **PBL 9** hedeflenir). `react-native-purchases` 11.x ve `expo-iap` 6.4.x (T5) buna uygun; CI'da `billing-ktx` sürümünü kontrol eden bir test şart.
8. **Publisher dili sayılarla konuşur:** Voodoo hybrid-casual için D1 ≥ %45, D7 ≥ %15 (puzzle %20), D30 ≥ %10 [29]; Tilting Point D7 %20+, D30 %8+; bir hybrid publisher'ın (CAS.AI) giriş eşiği CPI < 0,90 $, D1 %25+, D0'da 8+ reklam gösterimi/kullanıcı [35]. Sektör medyanı ise D1 ~%22, D7 <%4, D30 <%1 (GameAnalytics 2026, 16.000+ oyun — **doğrulandı** ikincil özetlerle [5][111]; D1/D7 tutarlı, D30 için "%1 altı"ndan daha kesin bir sayı doğrulanamadı). **Hedefimiz: soft launch'ta D1 ≥ %40, D7 ≥ %18, D30 ≥ %8, ≥ 20 dk/gün** (T2 ile aynı).
9. **Supersonic ve benzerleri "test → iterasyon → anlaşma" boru hattı işletir:** test edilen oyuna 300 $, iterasyona alınan oyuna 5.000 $'a kadar ödeme (**düzeltildi:** bunlar **SuperSpring 2024 yarışması** şartları — 15 Nis–27 May 2024 başvuruları, publishing sözleşmesi şartlı ve **tamamen recoupable**; kalıcı program şartı değil [31]); güncel "testing terms" tutar vermez, "ticari şartlar taraflarca ayrıca kararlaştırılır" der [33]; tüm kararlar "sole discretion" [32]. **Doğrulandı:** Unity, Supersonic'i **Tripledot**'a ~40 M $ nakde sattı, kapanış 4 Ağu 2026; Supersonic Tel Aviv'de ayrı marka olarak sürüyor [34][112]. Hybrid-casual publisher'lar bizim türe doğal uyumlu değil; **pitch'imiz "BitLife'ın TR+EN roast versiyonu, yüksek playtime, düşük CPI (TikTok virali)" olmalı.**
10. **Anlaşma şartları (Voyer Law örneklemleri):** 2025 baskısı (100+ sözleşme, 2017–2025): avanslı anlaşmalarda geliştirici payı ortalama %58,2, **medyan %50**; 2026 baskısı (130+ sözleşme, 2017–2026): avanslı ortalama %57,9, avanssız ortalama %67,9, avanssızda görülen en düşük pay %50 [47][113][114] (**düzeltildi:** iki farklı baskı karıştırılmıştı; "avanssız medyan %70" hiçbir kaynakta yok, kaldırıldı); mobilde UA harcaması çoğu zaman önce geri alınır (recoup), sonra 50/50 [46]. **Kırmızı çizgiler:** IP devri, mağaza hesabının publisher'da olması, UA'nın yalnızca geliştirici payından recoup'u, audit hakkı yokluğu, sözlü vaatler [48][49][50][51].
11. **Mağaza uyumu:** Apple 3.1.1 (unlock = IAP, restore zorunlu, kredi süresi dolmaz, loot box oran açıklaması), 2.5.18 (reklam açıkça reklam, kapatma butonu büyük, uygunsuz reklam bildirme özelliği zorunlu), 2.3.8 (metadata 4+), 5.1.2 (ATT) [53]. Google: "Better Ads Experiences" — beklenmedik tam ekran interstitial yasak, bölüm/segment başında yasak, 15 sn'de kapatılamayan yasak, **rewarded muaf**; rewarded interstitial'da "hayır" seçeneği olan giriş ekranı şart [55][56][57][58].
12. **Yaş derecesi monetizasyonu etkiler:** Apple kademeleri: sık kaba mizah 13+, sık olgun tema 16+, sık alkol/uyuşturucu referansı 18+, sık simüle kumar 18+ [54]. PEGI'de "Drugs" tanımlayıcısı (alkol/tütün dahil) her zaman 16 veya 18 [95]. AdMob `maxAdContentRating` ayarı (G/PG/T/MA) talep havuzunu daraltır/genişletir ve konsol etki tahmini verir [59]. **Karar: Apple 16+, Google Play "çocuklara yönelik değil", AdMob T (gerekirse MA testi).** T9'un "18+ beyanı" önerisiyle çelişki "Açık sorular"da.
13. **Analitik backend'siz:** Firebase/GA4 ücretsiz; uygulama akışında 500 farklı event adı, event başına 25 parametre, 25 kullanıcı özelliği, kullanıcı başına günde 100 bin event sınırı [62]. PostHog 1 M event/ay ücretsiz, Amplitude 2 M event/ay (**doğrulandı:** Amplitude fiyat sayfası özeti; "10 M'den düşürüldü" iddiası yalnızca arşivlenmiş fiyat sayfalarını izleyen bir takipçinin ~27 Nis 2026 tarihli, orta güvenli kaydına dayanıyor) **[ikincil]** [63][64][115]. ATT opt-in oyunlarda %39 (Adjust Q1 2026), ön-izin ekranıyla +10–15 puan [65][66]. **Yerel "Felek'in Raporu" ekranı** publisher'a bile veri taşıyabilen offline yedek.
14. **Gelir modeli (3 senaryo, 1 $ = 45 ₺ varsayımı; düzeltildi — bileşen toplamları yeniden hesaplandı):** "Mahalle" (TR, 3 K DAU, ARPDAU **~0,0095 $**) ≈ **~855 $/ay ≈ 38 bin ₺** (eski metinde 0,012 $ / 1.100 $ yazıyordu; bileşenler 0,0045+0,0018+0,0032 = 0,0095); "Şehir" (TR+EN soft launch, 15 K DAU, ~0,038 $) ≈ **17 bin $/ay ≈ 770 bin ₺** (doğru); "Dünya" (publisher UA, 60 K DAU, bileşen toplamı **~0,069 $**) ≈ **~123 bin $/ay brüt ≈ 5,5 M ₺** (eski metindeki 0,09 $ / 162 bin $ bileşenlerle tutmuyordu; 0,09 $ "BitLife seviyesi" ancak IAP ARPDAU ~0,04 $'a çıkarsa görülür), UA recoup + %50 paylaşımla geliştiriciye ilk yıl ~%30–40'ı. **TR tek başına geçim sağlamaz; EN pazarı ve/veya publisher şart.**
15. **En acı içgörü:** D1 %40 / D7 %18 / D30 %8 eğrisiyle 90 günde ~8–9 aktif gün ⇒ LTV90 ≈ 8,7 × ARPDAU. Tier-1'de ARPDAU 0,07–0,09 $ → LTV90 ≈ **0,60–0,78 $** (düzeltildi: model bileşenleriyle 0,60 $); casual Android CPI 1,00–2,50 $ [42][43]. **Reklam-ağırlıklı metin oyunu Tier-1'de paid UA'yı tek başına döndüremez.** Publisher'ı ikna eden şey viral/organik çarpan + playtime + Torpil dönüşümü olacak. BitLife de #1'e sıfır pazarlamayla çıktı [90] (not: "sıfır pazarlama" Candywriter'ın kendi beyanı; bağımsız teyit yok).

---

## Varsayımlar

- **Kur:** 1 $ ≈ 45 ₺ (Kasım 2026 varsayımı; her çeyrek güncellenir). Apple'ın ₺999,99 kademesi 19,99 $'a denk gelmekte (ChatGPT Plus örneği, Haziran 2026 **[ikincil]** [82][83]); bu KDV dahil ~50 ₺/$ demektir. Uygulama içi fiyatları Apple'ın otomatik dönüşümüne bırakmayacağız; her storefront için **manuel** fiyat gireceğiz.
- **Vergi:** Türkiye'de KDV %20 (Apple hakedişi vergi hariç fiyattan hesaplar [81]); Dijital Hizmet Vergisi 1 Ocak 2026'da %7,5 → %5'e düştü ve Apple hakedişleri buna göre güncelledi (**doğrulandı:** çok sayıda TR haber kaynağı; aynı Cumhurbaşkanı kararı 2027'den itibaren **%2,5** öngörüyor — model 2027'de güncellenmeli) [79][80][116]. Mağaza komisyonu: Apple Small Business Program %15 (<1 M $/yıl, başvuru gerekir) [84]; Google Play 2026'da ücret yapısını değiştirdi: **AEA/İngiltere/ABD'de 30 Haz 2026'dan itibaren** IAP hizmet ücreti yeni kurulumlarda %20, abonelikte %10, Play faturalaması kullanılırsa **ayrıca %5 faturalama ücreti**; "ilk 1 M $ için %10" iddiası yalnızca ikincil ve çelişkili bloglarda **[ikincil]** [85][86][117]. **Düzeltildi/netleştirildi:** TR dahil diğer bölgelerde küresel yayılıma kadar **eski yapı** (kayıt gerektiren %15 kademesi ilk 1 M $/yıl için, üstü %30) geçerli [118]. **Modelde her iki mağaza için %15 karma kesinti** varsayıldı; EN pazarında Google Play kesintisi fiilen %20+%5 olabileceği için **Dünya senaryosunda IAP kesintisi %15–25 duyarlılığı** ile okunmalı.
- **Yaş derecesi:** Apple 16+, Google Play IARC sonucu PEGI 16 / ESRB T hedefi (T1, T3, T5 ile uyumlu). T9'un 18+ önerisi "Açık sorular"da.
- **Teknoloji:** Expo SDK 58, `react-native-google-mobile-ads` 17.x (AdMob + UMP), RevenueCat `react-native-purchases` 11.x birincil, `expo-iap` 6.4.x yedek (T5). Reklam mediation: AdMob tek başına başlar; publisher isterse AppLovin MAX `AdProvider` arayüzünün arkasına takılır.
- **İçerik hacmi:** Soft launch build'inde en az 2 tam ömür (20–30 dk) tekrar değeri olan içerik; "yıl" turu 40–70 sn (T1).
- **Ekip:** Solo geliştirici + AI ajanları; aylık nakit gider (EAS, RevenueCat, Apple/Google hesapları, hukuk, araçlar) ~150–400 $ + UA bütçesi.

---

## 1) Hayat/metin simülasyonlarında backend'siz çalışan monetizasyon modelleri

### 1.1 Rakiplerin fiili modeli

| Oyun | Model | Fiyat noktaları (ABD) | Kaynak |
|---|---|---|---|
| BitLife | Tek seferlik **Bitizenship** (reklamsız + kilitli özellikler: evcil hayvan, patron etkileşimi, karanlık mod, sınırsız nesil, gelecek içerik ücretsiz) + **God Mode** (stat editörü) + **Boss Mode** + **Time Machine** (tüketilebilir) + yoğun interstitial | Bitizenship 7,99 $ (bazı anlık görüntülerde 9,99 $), God Mode 9,99 $ (eski 7,99–8,99 $), Boss Mode 20,99 $, Time Machine 0,99 $, Bitizenship+God Mode 15,99 $ (**doğrulandı:** ABD App Store IAP listesi [3]; AU vitrininde Boss Mode 29,99 AUD / Time Machine 1,99 AUD — ülkeye göre değişir) | [1][2][3][4] |
| Alter Ego (Caramel Column) | Reklam kaldırma + EGO para birimi + kozmetik EGO paketleri + hikâye DLC; gelirin **%45 video reklam, %30 banner, %25 IAP** (**doğrulanamadı:** tek kaynak bir Reddit aynası; birincil röportaj bulunamadı — bu oranı pitch'te kullanmayın); mağaza yorumlarına göre tek banner alt kenarda, video reklamlar yalnızca opt-in | — | [91][92] |
| Choices (Pixelberry) | Bölüm başında reklam, iki para birimi (anahtar = zaman kapısı, elmas = premium seçenek), rewarded ile günde birkaç elmas; "en agresif mekanik oturum kısıtlaması" | — | [93] |
| Reigns (Nerial/Devolver) | Premium tek seferlik satış; sonradan Apple Arcade/Play Pass; stüdyo 1 Ekim 2026'da kapandı | 2,99 $ | [87][88] |

Çıkarım: **Metin oyununda kanıtlı model = reklam (çoğunlukla zorunlu) + tek seferlik reklamsızlık/premium unlock + küçük tüketilebilir.** Premium tek seferlik satış (Reigns) mobilde sürdürülemedi. Alter Ego'nun banner payı dikkat çekici ama bizim 16+ hedefimiz ve "okuma odaklı" UI'mizde banner, okunabilirliği bozar (T8); yalnızca ölüm sonrası/menü ekranlarında düşünülür.

### 1.2 Benchmark'lar (2024–2026)

**ARPDAU ve dönüşüm.** Satıcı bloglarının üzerinde anlaştığı bantlar: ads-only casual 0,01–0,05 $; hybrid-casual karma 0,15–0,50 $; casual simülasyon için kaynaklar 0,05–0,15 $ (ads-only) ile 0,50–3,00 $ (IAP ağır) arasında çelişiyor; ödeyen oranı DAU'nun %2–5'i (geniş iddia), simülasyon için %1,5–2,5 **[ikincil]** [5][6][7][8][103]. Hybrid-casual'da IAP payı kaynaklara göre %20–60 arası [101][102]. **Hiçbir birincil kaynak "narrative/hayat sim" ARPDAU'su yayımlamıyor.** En iyi vekil BitLife'ın kendisi: T2'deki ~1 M $/ay IAP + ~90 K $/gün interstitial tahmini ve ~1,2 M DAU ile **ARPDAU ≈ 0,10 $ (çoğunluk ABD)**. Bizim "Dünya" senaryomuz bu tavana yaslanır.

**Abonelik.** RevenueCat 2026: oyunlarda deneme→ücretli medyan %4,4; indirme→ücretli iOS %1,3 / Google Play %0,4 (tüm kategorilerde en düşük); dönüşümlerin %60'ı ilk hafta, ~1/3'ü 0. gün [68][69]. Sert paywall'lar freemium'dan çok daha yüksek dönüşüyor (D35 medyan %10,7 vs %2,1) ama bizim oyun freemium olmak zorunda (reklam + playtime modeli). **Sonuç: abonelik, ancak aylık gerçek içerik temposu kanıtlandıktan sonra (2. faz) ve "Felek Kulübü" gibi bir tematik çerçeveyle.**

**eCPM.**

| Pazar / format | Rewarded | Interstitial | Not |
|---|---|---|---|
| ABD iOS | ~17–20 $ | ~9,6–14,3 $ | 19,6 $ = Yango Ads Q4 2024 oyun verisi (**düzeltildi:** MAF değil, MAF alıntılıyor); Appodeal Q4 2024 ABD rewarded iOS ~17,3 $; kaynaklar 13–30 $ bandı veriyor **[ikincil]** [8][9][10][11][15][108] |
| ABD Android | ~13–16,5 $ | ~10,1–14,1 $ | 16,5 $ Yango; Appodeal Q4 2024 ~13,2 $ **[ikincil]** [108] |
| İngiltere | ~10,7 $ | ~7,3 $ | tek kaynak, güvenilirlik düşük [9] |
| Global Android (TopOn H1 2025) | 6,70 $ (3 yılın en düşüğü; **doğrulandı** rapor özetiyle) — **casual Android yalnızca ~3,02 $** (H1 2023: 3,60 $) | casual Android interstitial yıllık −%11 | [14][109] |
| Türkiye | **veri yok**; T2 tahmini 2–4 $ (Android), 3–6 $ (iOS) | 1–3 $ | Appodeal 2023 raporunda 18 ülke arasında TR vardı; 2025 raporu/Benchmarks aracı ülke kırılımı sunuyor ama bu oturumda açılamadı [12][13] |

Rewarded tamamlama oranı %90+ (AppLovin 2025'e atfedilen, ikincil), DAU başına 2 civarı rewarded izleme örnek hesaplarda görülüyor [106]. Bizim planlama değeri: **1,5–2,5 rewarded/DAU**.

**Interstitial sıklığı ve retention.** Satıcı kaynakları (kontrollü çalışma değil) oturumda 3+ interstitial'ın D7'yi %20–30 düşürdüğünü, ilk 60 sn içinde gösterilen interstitial'ın D7'de ölçülebilir düşüş yarattığını, ilk 1–3 oturumda en fazla 1 interstitial önerdiğini yazıyor [70][71][72]. BitLife ~70 sn'de bir interstitial gösteriyor ve yine 34 dk/gün tutuyor (T7) — ama en çok şikâyet aldığı konu bu (T2). **Biz BitLife'ın tersini yapıp bunu pitch'te "adil reklam" farkı olarak satacağız.**

### 1.3 Model bileşenleri ve değerlendirmesi

| Bileşen | Bizde | Karar | Gerekçe |
|---|---|---|---|
| Tek seferlik premium unlock | **Torpil** | **P0** | BitLife kanıtı; backend gerekmez; "reklamsızlık gerçekten reklamsız" (T2 şikâyeti) |
| God/Boss mode editörü | **Felek'in Kalemi** (stat/olay editörü) | **P1** | Ayrı ürün; Torpil'e dahil değil (BitLife de ayırıyor); "hile" isteyen segmente |
| Tüketilebilirler | **İkinci Şans** (ölümden dönüş), **Rüşvet Zarfı** (reroll jetonu) | **P1** | Rewarded ile de kazanılabilir; satın alma = sabırsızlık vergisi; sabit içerik, rastgele yok |
| Kozmetik/persona | **Anlatıcı personaları** ("Teyze", "Bürokrat", "Motivasyon Konuşmacısı"), mezar taşı temaları | **P1** | Ses metin tabanlı (TTS yok) → maliyet düşük; T3'ün varyant altyapısı üzerine |
| Reklam kaldırma | Torpil'in parçası; ayrıca satılmaz | **P0** | İki ürün kafa karıştırır; Torpil tek "büyük" karar |
| Rewarded video | 5 yerleşim (bkz. Bölüm 6) | **P0** | TR'de en yüksek eCPM format; Google politikasında muaf |
| Interstitial | Yalnızca ölüm/ömür sonu ekranı | **P0 (kısıtlı)** | Doğal mola, politika uyumlu, retention'ı korur |
| Banner | Yok (ilk sürüm) | **P2** | Okuma UI'si; 16+ içerikte banner uygunsuz reklam riski |
| Abonelik | **Felek Kulübü** (aylık) | **P2** | Dönüşüm düşük, "sürekli değer" yükü var |
| Offline sezon izi | **Felek Takvimi** (ücretsiz + premium iz) | **P1** | Takvim seed'i gerçek, geri sayım gerçek (T1 kuralı); tek ürün ID'si/sezon |

**Bu oyuna nasıl uygularız:** Monetizasyon mimarisi "Torpil'i satan reklam" ilkesine oturur: rewarded yerleşimler Felek'in kişiliğinin parçasıdır, interstitial ise ölümün ağırlığını bozmayan tek anda (ölüm özeti sonrası, mezar taşından önce) çıkar. Torpil alan oyuncu için **hiçbir zorunlu reklam kalmaz**, rewarded'lar "istersen" olarak yerinde durur (BitLife'ın "aldım yine reklam görüyorum" şikâyetini tasarımla kapatırız). Abonelik ve banner ilk sürümde yok.

---

## 2) Backend'siz makbuz doğrulama

### 2.1 iOS — StoreKit 2

- StoreKit 2 her işlemi **JWS (JSON Web Signature)** ile imzalı teslim eder; doğrulama framework içinde yapılır (`VerificationResult.verified/.unverified`), Apple "uygulama satın almaları ve durum değişikliklerini **sunucu gerektirmeden tamamen cihazda** yönetebilir" diyor [19][20]. `Transaction.currentEntitlements` sahip olunan non-consumable'ları ve aktif abonelikleri döndürür; iade edilen işlemde `revocationDate` dolar ve entitlement listesinden düşer; `Transaction.updates` dinlenmelidir [21].
- Sınır: cihazdaki imzalı işlem bir **anlık görüntü**dür; iade/iptal, cihaz App Store ile senkronize olana kadar görünmez. Bizim için kabul edilebilir (iade edilen Torpil birkaç saat/gün daha açık kalabilir).
- Apple 3.1.1: "restorable IAP için restore mekanizması" zorunlu [53]. StoreKit 2'de `AppStore.sync()` + `currentEntitlements` bunu karşılar.

### 2.2 Android — Google Play Billing

- Google'ın resmi güvenlik rehberi nettir: `purchaseToken`'ı **kendi backend'ine gönder**, Play Developer API ile doğrula, token'ı birincil anahtar olarak sakla, PENDING durumda entitlement verme, 3 gün içinde acknowledge etmezsen otomatik iade [22][23]. Cihaz içi imza kontrolü (Play Console'daki RSA public key ile `originalJson`/`signature`) var ama "sunucu seçeneği yoksa daha az güvenli doğrulama" diye nitelenir **[ikincil]** [23].
- Tüketilebilirlerde `consumeAsync` acknowledge yerine geçer; aynı token'ın iki kez işlenmemesi için **cihazda** token defteri tutulur (backend yoksa tek seçenek).
- **PBL sürüm takvimi (düzeltildi, birincil kaynak Google deprecation tablosu [110]):** PBL **7** için yeni uygulama/güncelleme son tarihi 31 Ağustos 2026, uzatma 1 Kasım 2026 (geçti) → bugün PBL ≥ 8 zorunlu; PBL **8** son tarihi 31 Ağustos 2027 / uzatma 1 Kasım 2027; PBL **9** son tarihi 31 Ağustos 2028. PBL 9.0.0 19 Mayıs 2026'da, 9.1.0 18 Haziran 2026'da çıktı [24][25]. **Karar: doğrudan PBL 9 hedefle;** CI testi "billing-ktx ≥ 9" kontrol etsin. `react-native-purchases` 11.x ve `expo-iap` 6.4.x (T5) PBL ≥ 8 kullanır; CI'da `./gradlew :app:dependencies | grep billing` kontrolü eklenir.
- Play Integrity API, token şifre çözümü için Google sunucusuna **kendi sunucundan** çağrı gerektirir; backend'siz anlamsız. **Kullanmayız.**

### 2.3 Kabul edilen dolandırıcılık riski

- Tehdit modeli: (a) mod APK'lar (BitLife için düzinelerce "Bitizenship unlocked" sitesi var — arama sonuçlarının çoğu bunlardı), (b) sahte makbuz/freedom tipi araçlar, (c) iade sonrası içeriğin açık kalması.
- Değerlendirme: **Korunacak sunucu ekonomisi yok.** Kaybımız yalnızca "o oyuncunun ödemeyeceği Torpil"dir; mod APK kullanan kitle zaten ödemeyen kitledir. Agresif DRM (lisans kontrolü, root tespiti) ödeyen kullanıcıyı cezalandırır ve BitLife'ın "reklamda donma" tipi şikâyetlerine benzer sürtünme yaratır. **Karar: hafif koruma, sıfır sürtünme.**
- Hafif koruma: Android'de RSA imza kontrolü + token defteri; iOS'ta StoreKit 2 doğrulaması; entitlement'ı MMKV'de **HMAC'li** sakla (cihaz anahtarıyla); açılışta `currentEntitlements`/`queryPurchasesAsync` ile uzlaştır; iade görülürse içeriği sessizce kapat (Felek: "Torpilin iptal olmuş. Bürokrasi.").

### 2.4 RevenueCat: "backend" mi?

- Teknik olarak evet, üçüncü taraf bir backend. Proje kuralı "üçüncü taraf SDK serbest, ama oynamak için zorunlu olmamalı" ile uyumlu: RevenueCat çökse/erişilemese oyun oynanır, Torpil yerel önbellekten okunur.
- Ne veriyor: her iki platformda makbuz doğrulama, entitlement, iade/iptal webhooks, abonelik metrikleri, Paywalls/Experiments (fiyat testi), publisher'ların tanıdığı dashboard. Fiyat: 2.500 $ MTR'ye kadar ücretsiz, sonrası **tüm MTR'nin %1'i** (2.600 $ → 26 $) **[ikincil, Ekim 2026 tarihli iki bağımsız özetle tutarlı]** [16][119]. **Dikkat:** üçüncü taraf incelemeler **Experiments (A/B fiyat testi)**'in ücretli katmanda olduğunu söylüyor; ücretsiz planda Paywalls var, Experiments belirsiz → fiyat testini mağaza tarafı araçlar veya kendi uzak konfigürasyonumuzla da yapabilir olmalıyız [120]. Bizim "Şehir" senaryosunda ~17 K $/ay'ın IAP kısmı ~5 K $ → ~50 $/ay.
- Sınır: **Offline Entitlements** yalnızca abonelikleri kapsar; tek seferlik satın almalar (consumable/non-consumable) offline modda desteklenmez, Android'de INAPP türleri tamamen bloklanır [17]. **Bu yüzden yerel entitlement önbelleği bizim sorumluluğumuzda.** RevenueCat'in kendi Google Play rehberi de "istemciye asla güvenme" der [18].
- `expo-iap`/OpenIAP: önerilen akış "backend'inde (ya da IAPKit'te) doğrula → entitlement ver → `finishTransaction`"; iOS'ta `jwsRepresentationIos` sağlanır; restore = `getAvailablePurchases()`; Android'de 3 günde `finishTransaction` çağrılmazsa otomatik iade (geliştiriciler göç sonrası iade artışı bildirdi) [26][27][28].

**Bu oyuna nasıl uygularız:** `packages/engine` içinde `EntitlementStore` (saf TS): kaynaklar = RevenueCat → StoreKit2/Play yerel sorgu → MMKV önbelleği; çözümleme kuralı "herhangi biri doğruladıysa aç, hepsi iptal diyorsa kapat, hiçbiri erişilemezse önbelleği kullan". Satın alma akışı: `purchase → (RC doğrulama | yerel imza) → grant → finish/acknowledge ≤ 60 sn`. Tüketilebilirlerde token defteri + idempotent grant. Restore butonu Ayarlar'da ve Torpil ekranında görünür (Apple 3.1.1). Test matrisi: sandbox iade, PENDING (Google), ağ kesik satın alma, yeniden kurulum sonrası restore.

---

## 3) Mobil publisher'lar 2025–2026'da ne istiyor?

### 3.1 KPI eşikleri

| Kaynak | D1 | D7 | D30 | Diğer |
|---|---|---|---|---|
| Voodoo (hybrid-casual, 2023 röportaj; **doğrulandı** [29]; daha eski kuralı %55 D1 / %22 D7 / 0,25 $ CPI idi, sonra %45 / %13 / 0,20 $'a indirdi [121]) | ≥ %45 | ≥ %15 (puzzle %20) | ≥ %10 | CPI dikkate alınır; 2023 partner rehberi 0,30 $ CPI/%12 D7 ya da 1,60 $ CPI/%22 D7 + 30 dk playtime örnekleri verir [29][30] |
| Tilting Point (ikincil) | — | %20+ | %8+ | Oyun "neredeyse bitmiş", ARPU verisi [6] |
| CAS.AI publishing (giriş eşiği; **doğrulandı** — sayfa "tercihen" (preferably) diyor, sert eşik değil; blogları %20–22 D1'i de kabul ediyor) | %25+ | — | — | CPI < 0,90 $, D0'da 8+ reklam gösterimi/kullanıcı [35] |
| Genel "global launch" kapısı (ikincil) | > %35 mid-core / > %40 casual | > %15 | — | [6] |
| Sektör medyanı (GameAnalytics 2026, 16 K+ oyun, ikincil) | ~%22 | < %4 | < %1 (**düzeltildi:** %0,7–0,8 doğrulanamadı; 2025 baskısı D28 bölgesel medyanları %0,75–1,49, projelerin %75'i D28 < %3) | [5][111] |
| Adjust TR H1 2025 (T2) | %19 | %5 | %1 | TR'de hedefimiz ortalamanın 2–3 katı |

Okuma: D1 %40 / D7 %18 / D30 %8, hybrid-casual publisher'ın "ilgilenirim" eşiğidir, "imzalarım" eşiği değil. İmzayı getiren ikinci bacak **CPI ve ad gösterimi/DAU**'dur: hybrid-casual'da D0'da 8+ gösterim istenmesi bizim "ölüm ekranı dışında interstitial yok" ilkemizle çatışır. Çözüm, rewarded yoğunluğu + playtime: 20 dk/gün ve 2,5 rewarded/DAU ile toplam gösterim/DAU ~4 olur; bunu "daha az ama %100 izlenen reklam" diye konumlandırırız.

### 3.2 Soft launch süreci

- **Sıra:** marketability (CPI/CTR) testi → teknik soft launch → KPI soft launch → publisher pitch [44]. "Publisher-ready paket" = gerçek soft launch kohortu, kreatif testinden CPI, ARPDAU sinyali, crash < %1, 90 günlük live-ops planı, deck [104]. Publisher'lar maliyeti geliştiriciye kaydırdı; ilk testi sen yaparsın [39].
- **Marketability testi:** 600–1.200 $ medya ile ~1 haftada gerçek CPI [43]; Kwalee'nin CPI testi: Facebook reklamı → mağaza sayfası → indirme; kısa gameplay videoları + en az 3 ekran görüntüsü; CPI test prototipi 1–3 bölümle birkaç saat–1 haftada hazır [36][37]. Coda/GameAnalytics: test için mağazada çalışan uygulama + Facebook SDK şart [38]. SayGames erken aşamada CPI'ya bakmadığını söylüyor [40]; her publisher farklı.
- **Pazarlar:** Kanada, Avustralya, Filipinler en yaygın üçlü; Nordik/Hollanda "Tier-1 davranışı + yönetilebilir CPI"; 2026 önerisi "1 temiz İngilizce Tier-1 (CA/AU/NZ) + 1 maliyet-etkin pazar" [41][42][45]. CPI bantları (2026, ikincil, çelişkili): UK/CA/AU Android casual 1,00–2,50 $; Güneydoğu Asya 0,20–0,60 $; Filipinler < 0,50 $; Nordik 1,50–3,00 $ [42][43]. Küresel oyun medyan CPI 0,56 $ (Adjust 2026) [66].
- **Süre ve hacim:** 8–12 hafta; kohort başına ≥ ~900 install olmadan retention okunmaz; crash < %1 [6][41].
- **Türkiye'ye özel:** TR'de hyper-casual CPI iOS ~0,10 $ / Android ~0,05 $ (Tenjin, ~2024, eski) [78]; TikTok TR CPM 2,50–6,00 $ (ajans verisi) **[ikincil]** [75]. Adjust'ın Türkiye 2026 raporu CPI yerine "D7 oturum/install" metriğini öneriyor [77]. TR, **teknik soft launch + ton testi** için ideal, **KPI kanıtı** için zayıf (düşük retention normu, düşük eCPM).

### 3.3 Pitch deck (12–15 slayt)

1. **Kanca** (tek cümle + 20 sn video): "Seni ölene kadar trolleyen, öldükten sonra ayağa kaldıran anlatıcı."
2. **Pazar ve boşluk:** BitLife rakamları (T2), simülasyon türü, narrative alt tür, TR + EN iki dilli lansman.
3. **Ürün:** bir yıl = bir tur, ölüm = içerik, Roast Raporu, Teşhis koleksiyonu (T1).
4. **Neden şimdi:** TR pazarı 1,01 Mr $ (+%25), 50 M oyuncu [73][74]; TikTok virali; AI içerik hattı.
5. **Traction:** D1/D7/D30 eğrileri (kohort ≥ 900), playtime/gün, oturum/gün, "yıl/oturum".
6. **Marketability:** CPI testleri (ülke/platform), CTR/IPM, en iyi 3 kreatif.
7. **Monetizasyon:** yerleşim haritası, rewarded/DAU, Torpil dönüşümü, erken ARPDAU.
8. **İçerik hızı:** storylet/hafta, varyant sayısı, QA süreci; AI + insan editör (T9 telif notu).
9. **Live-ops (backend'siz):** Felek Takvimi, haftalık tema, local push kadansı (T7).
10. **Lokalizasyon:** EN transcreation süreci ve kalite kanıtı (T10).
11. **Uyum ve savunulabilirlik:** yaş derecesi, KVKK/GDPR, politika listesi (T9) — publisher için "sürpriz yok" sinyali.
12. **Ekip:** solo + AI ajan altyapısı + danışmanlar; süreklilik planı.
13. **İstek ve anlaşma şekli:** UA bütçesi, MG, hizmetler; istemediklerimiz (IP, mağaza hesabı).
14. **12 aylık yol haritası.**
15. **Ek:** analytics ekran görüntüleri, retention tabloları, inceleme örnekleri.

### 3.4 "Build for review" içeriği

- Polisajlı FTUE (ilk kahkaha < 20 sn, T3), 20–30 dk içerik (≥ 2 tam ömür), tüm analytics event'leri ateşleniyor, reklamlar test ID'leri ile çalışıyor, crash-free ≥ %99, TestFlight + Play internal track, inceleyici için "yaşa atla" cheat paneli, 30 sn gameplay videosu, 1 sayfalık özet, press kit, mağaza sayfası taslağı (2.3.8'e uygun 4+ görseller).

### 3.5 Tipik anlaşma şartları ve kırmızı bayraklar

- **Gelir paylaşımı (düzeltildi — iki baskı ayrıştırıldı):** Voyer Law **2025** raporu (100+ sözleşme): avanslı anlaşmalarda geliştirici payı ortalama %58,2, medyan %50; medyan avans 300 K $. Voyer Law **2026** raporu (130+ sözleşme, 2017–2026, 17 Mar 2026): avanslı ortalama %57,9 (aralık %2,5–%90), avanssız ortalama %67,9 (en düşük %50); medyan avans 270 K $, ortalama ~603 K $ [47][113][114]. "Avanssız medyan %70" hiçbir kaynakta yok, kaldırıldı. Mobilde yaygın yapı: UA recoup edilene kadar gelirin ~%80'i publisher'da, sonra 50/50 [46]. Bir satıcı "mobilde 70/30–90/10 publisher lehine" diyor (tek, çıkar sahibi kaynak) [52].
- **MG (minimum garanti):** iade edilmez ama gelecek gelirden mahsup edilir [47].
- **Supersonic örneği (düzeltildi):** (indie odaklı "LiveGames" servisiyle de biliniyor [105]) 300 $ test ödemesi ve iterasyonda aya 5.000 $'a kadar ödeme **SuperSpring 2024 yarışmasının** şartlarıydı (15 Nis–27 May 2024; publishing sözleşmesi şartlı; **tamamen recoupable**; aynı sayfa "pazarlanabilir prototipi test et ve çık" için 20.000 $'a kadar alternatif veriyor) [31]; SuperHybrid 2024 ödülleri ise non-recoupable idi [32]. Güncel "testing terms" sayfası tutar vermiyor, "ticari şartlar taraflarca kararlaştırılır" diyor [33]. Sahibi Ağustos 2026'dan beri **Tripledot** (~40 M $) [34][112].
- **Kırmızı bayraklar:** tam IP devri (türevler dahil), "50/50 IP" (iki taraf da tam kullanım hakkı alır — tuzak), mağaza hesabının publisher'da olması, UA'nın yalnızca geliştirici payından recoup'u ("1 M $ gelir olmadan tek kuruş yok" senaryosu), dolaylı maliyetlerin (iç personel, QA, lokalizasyon) recoup'a dahil edilmesi, audit hakkı yokluğu, sözlü vaat, geçmiş lansmanlarda şeffaflık eksikliği, imza baskısı [48][49][50][51].
- **Türkiye manzarası:** TR'nin büyük stüdyoları birinci parti geliştirici (Dream, Peak, Rollic; Rollic'in hybrid-casual başarı oranı %30 → %50, 2024 **[ikincil]** [75]); üçüncü parti kapıları Rollic (form), Udo, Fomo, Good Job (T2). Hayat simülasyonu/narrative için TR'de doğal publisher yok; **bu oturumda hiçbir TR publisher'ın kamuya açık gelir paylaşımı şartı bulunamadı** (Açık soru).

### 3.6 Vaka çalışmaları

- **Reigns / Devolver:** François Alliot birkaç başarısız projeden sonra sektörden ayrılmayı düşünürken oynanabilir demoyu Devolver'ın Nigel Lowrie'sine gösterdi; Devolver 2021'de Nerial'i satın aldı; Alliot "her proje publisher'ın planına uymak zorundaydı" dedi; stüdyo 2026'da kapandı [87][88]. Ders: **oynanabilir demo + bir kişiyi ikna** işe yarar; satın alınmak özerkliği bitirir.
- **BitLife / Candywriter:** Miami'de 2 kurucu (Kevin O'Neil, Nadir Khan), 2018 lansmanında **sıfır pazarlamayla** ABD/İngiltere/Kanada'da #1 (Candywriter'ın kendi beyanı, bağımsız teyit yok); Stillfront **23 Nisan 2020'de** (düzeltildi: 2019 değil; 2019 pro forma rakamlarıyla açıklandı) %100'ünü 74,4 M $ peşin (37,5 M $ hisse + 36,9 M $ nakit) + 2020–22 EBIT'e bağlı en fazla 120,6 M $ kazanç primiyle **toplam en fazla 195 M $**'a satın aldı; Candywriter 2019 geliri ~26 M $ (**doğrulandı** [89][122]); 42 M indirme (o tarihte) [90]. Ders: metin oyununda organik çarpan gerçek; publisher yerine **satın alma** çıkış da seçenek.
- **Alter Ego / Caramel Column:** 5 M indirme (T2), gelir %45 video + %30 banner + %25 IAP; banner her tur sonu ekranında; yapımcı bilinçli olarak oyuna "son" koydu [91]. Ders: psikolojik vaat + reklam-ağır model solo için yeterli olabiliyor; "oyunun sonu var" tasarımı retention'a rağmen savunuldu.
- **Balatro / Playstack:** solo geliştirici + publisher; bir saatte kârlı, 8 saatte 1 M $ brüt, Ocak 2025'te 5 M kopya **[ikincil]** [100]. Ders: publisher'lar solo geliştiriciyle çalışır; kriter oynanabilir ve "ölçülebilir derecede iyi" build.
- **Boşluk:** Türkiye'den narrative/metin oyunuyla publisher imzalamış solo geliştirici vakası bulunamadı. Mobidictum/Gaming in Turkey raporları pazar büyüklüğü veriyor, anlaşma şartı vermiyor [73][74][76].

**Bu oyuna nasıl uygularız:** Hedef publisher listesi iki katmanlı: (A) hybrid-casual boru hatları (Supersonic/Tripledot, Homa, Kwalee, CrazyLabs, SayGames) — "yüksek playtime + rewarded + düşük CPI" diliyle; (B) narrative/premium-mobil yayıncılar ve Netflix/Apple Arcade/Play Pass tipi platformlar — "ton + IP + iki dil" diliyle; (C) TR kapıları (Rollic formu, Udo, Fomo) — "TR'de ilk" diliyle. Her görüşmeye **veri odası** (Firebase/RC dashboard erişimi, retention CSV'leri, kreatif testleri) ile gidilir. İstenmeyenler listesi sözleşme öncesi bir sayfada: IP bizde, mağaza hesabı bizde, UA recoup toplam net gelirden, audit hakkı, 12 aylık performans çıkış maddesi.

---

## 4) Mağaza uyumu (IAP, reklam, simüle kumar, yaş derecesi)

### 4.1 Apple App Store Review Guidelines (metin birincil kaynaktan [53])

- **3.1.1:** Özellik/içerik kilidi açmak için **yalnızca IAP**; satın alınan kredi/para birimi **süresi dolmaz**; restorable IAP için **restore mekanizması**; loot box benzeri rastgele satışlarda **oran açıklaması**; non-subscription uygulamalar "XX-day Trial" adlı 0 kademeli non-consumable ile zaman sınırlı deneme sunabilir. Bizde rastgele satış yok → oran yükümlülüğü doğmaz.
- **3.1.2(a):** Abonelik "sürekli değer" sağlamalı, en az 7 gün, tüm cihazlarda çalışmalı; (c) abone olmadan önce ne alınacağı net; 3.1.2 "trick users into purchasing" → program dışı bırakma riski.
- **2.5.18:** Reklamlar uygulamanın yaş derecesine uygun; interstitial/kesen reklamlar **açıkça reklam** olarak işaretli, kandırmaz, **kolay görülür ve büyük kapatma butonu**; uygulama **uygunsuz reklamı bildirme** özelliği içermeli (çoğu indie bunu unutuyor).
- **2.3.6 / 2.3.8:** Yaş derecesi sorularına dürüst yanıt; metadata (ikon, ekran görüntüleri, IAP ikonları) **4+** seviyesinde.
- **5.1.1 / 5.1.2:** Gizlilik politikası linki hem App Store Connect'te hem uygulamada; veri toplama için rıza; takip için **ATT** zorunlu; ücretli işlev veri izni şartına bağlanamaz.
- **1.1.1:** Hiciv muafiyeti "profesyonel siyasi hicivciler" için; biz değiliz (T3). Reklam ağı tarafında "simulated gambling" terimi kılavuzda yer almıyor; kumar yalnızca 5.1.1(ix) regüle alan listesinde.

### 4.2 Apple yaş derecesi kademeleri (birincil [54]; **doğrulandı 2026-11-06:** tablo App Store Connect "Age ratings" sayfasının küresel değerleriyle bire bir eşleşiyor)

| İçerik | Seyrek | Sık |
|---|---|---|
| Küfür / kaba mizah | 9+ | **13+** |
| Olgun/müstehcen tema | 9+ | **16+** |
| Alkol/tütün/uyuşturucu kullanımı veya referansı | 13+ | **18+** |
| Gerçekçi şiddet | 13+ | 18+ |
| Simüle kumar | 13+ | 18+ |
| Loot box | 9+ (Avustralya 16+) | — |
| Korku/karanlık tema | 9+ | 13+ |

Bizim profil: kaba mizah **sık** (13+), olgun tema **sık** (16+), alkol/uyuşturucu **seyrek ve sonuçlu** (13+), simüle kumar **yok** → **16+**. Alkol/uyuşturucu "sık" işaretlenirse tek başına 18+'a iter; içerik kota kuralı: ömür başına madde referanslı storylet oranı < %5, hiçbiri "kullanım" göstermez (T9 ile uyumlu).

### 4.3 Google Play

- **Ads policy / Better Ads Experiences (2022'den beri yürürlükte, 2025'te değişiklik bulunamadı):** beklenmedik tam ekran interstitial yasak (kullanıcı başka bir şey yapmayı seçtiğinde), **bölüm/segment başında** yasak, splash öncesi video interstitial yasak, **15 sn'de kapatılamayan** tam ekran yasak; **kullanıcının açıkça opt-in olduğu rewarded reklamlar muaf** [55][56] (**doğrulandı;** ek nüans: güncel Developer Program Policy metni "normal kullanımı kesen reklamlar — rewarded/opt-in dahil — 5 sn sonra kapatılabilir olmalı" cümlesini de içeriyor; AdMob SDK'nın standart rewarded kapatma davranışı bunu karşılar, kendi özel oynatıcı yazmayız [123]). Google temsilcileri "interstitial'ları bölüm sonuna taşıyın" diyor (ikincil) [56].
- **Rewarded ad kuralları (AdMob):** rewarded interstitial formatında "hayır/kabul etmiyorum" seçeneği içeren giriş ekranı ve yeterli opt-out süresi; ödül mesajı net [57][58]. Standart rewarded'da bizim buton metni "Kaderi rüşvetle ikna et (30 sn reklam)" + "Boş ver" ikilisi bu kuralı aşkınlıkla karşılar.
- **Families:** "Çocuklara yönelik değil" beyanı ile Families politikası uygulanmaz; yine de hedef kitle beyanının doğruluğunu Google denetler; karışık kitle seçersen nötr yaş ekranı + self-certified ad SDK zorunluluğu gelir [60]. Biz **13+/16+ "not designed for children"** seçeriz (T5 kararı).
- **IARC anketi:** tek anket → PEGI/ESRB/USK/ClassInd/Generic çıktıları + etkileşimli öğeler (IAP, reklam) [96]. ESRB Teen: kaba mizah, müstehcen tema, simüle kumar, seyrek güçlü dil; "Alcohol Reference/Drug Reference" tanımlayıcıları referans düzeyinde [94]. PEGI "Drugs" tanımlayıcısı (illegal madde, alkol, tütün **kullanımı veya referansı**) **her zaman 16 veya 18**; 2020 sonrası uyuşturucu **kullanımı** tasviri 18'e itiyor (Xbox PEGI sayfası, ikincil) [95]. **Kural: referans var, kullanım tasviri yok → PEGI 16 / ESRB T.**
- **Yaş derecesinin reklam gelirine etkisi:** Google Play'in reklam politikası reklamların uygulamanın derecesine uygun olmasını ister; AdMob'da `maxAdContentRating` (G/PG/T/MA) talep havuzunu belirler; T seçimi T+PG+G reklamlarla doldurulur, MA en geniş havuz; konsol değişikliğin gelir etkisini **tahmin eder** [59][107]. Nicel kamu verisi yok. **Plan:** T ile başla, soft launch'ta MA'yı 2 hafta A/B test et (16+/Mature uygulamada MA'ya izin var), eCPM farkı > %10 ise MA'da kal.
- **UA etkisi:** 17+/18+ derecesi bazı reklam ağlarında (ör. Apple Search Ads) yalnızca yetişkin olduğu doğrulanmış kullanıcılara gösterim demek; 16+ bu kısıtı hafifletir. Nicel veri bulunamadı (Açık soru).

### 4.4 Türkiye'ye özel reklam/ticaret uyumu

- Reklam Kurulu 2025–26'da "karanlık ticari tasarım"ı haksız ticari uygulama sayarak önceden seçili ücretli seçenek, denemede kart zorunluluğu, iptali zorlaştırma gibi tasarımlara idari para cezası ve durdurma uyguladı; 2026'nın ilk 9 ayında 1.173 dosyada yaptırım [97][98]. Oyunlara özgü karar bulunamadı ama kapsam IAP/aboneliği içerir (T9).
- 7578 sayılı Kanun ile yaş derecelendirme zorunluluğu 1 Kasım 2026'da yürürlüğe girdi; BTK yönetmeliği bekleniyor (T9). IARC/Apple derecesi bu yükümlülüğe nasıl sayılacak → avukat sorusu.

**Bu oyuna nasıl uygularız:** "Uyum checklist'i" sprint tanımına girer: (1) her reklam yerleşiminin tetikleyicisi "oyuncu eylemi bitti, yeni eylem başlamadı" anında; (2) interstitial yalnızca ölüm özeti sonrasında, 5 sn içinde kapatılabilir, X butonu ≥ 44 pt; (3) Ayarlar'da "Bu reklamı bildir" (son 5 reklamın ağ ID'si ile); (4) IARC ve Apple anketleri **aynı içerik kota tablosundan** doldurulur (madde referansı seyrek, kumar yok, cinsellik "kapı kapalı"); (5) Torpil ekranında fiyat, kapsam, restore ve "tek seferlik, abonelik değil" ibaresi; (6) hiçbir fiyat ekranında geri sayım, "son 3 kişi", önceden seçili paket yok; (7) metadata 4+; (8) EEA/UK/CH'de UMP rızası olmadan kişiselleştirilmiş reklam yok [61]; KVKK aydınlatma + ayrı açık rıza (T9).

---

## 5) Backend'siz analitik

### 5.1 Araç seçimi

| Araç | Ücretsiz katman | Artı | Eksi |
|---|---|---|---|
| Firebase / GA4 | Ücretsiz; uygulama akışında **500 farklı event adı** (kullanıcı başına; kullanıcı tabanı genelinde daha fazlası görülebilir), event başına **25 parametre**, **25 kullanıcı özelliği** (**doğrulandı** [62][124]), kullanıcı/gün 100 K event, 2.000 oturum; limit aşımı sessizce düşer [62] | Publisher'ların tanıdığı; Remote Config/Crashlytics aynı SDK; BigQuery export | Rapor arayüzü oyun KPI'ları için zayıf; retention kohortları GA4'te sınırlı |
| GameAnalytics | Ücretsiz (T1) | Oyun odaklı retention/ARPDAU panelleri; hybrid-casual publisher'ların alışık olduğu | Ek SDK |
| PostHog | 1 M event/ay, EU hosting [63] | Funnel, session replay, flags tek yerde | Oyun kohortları için elle tanım |
| Amplitude | 2 M event/ay (Nisan 2026'da 10 M'den düşürüldü) **[ikincil]** [64] | Güçlü retention analizi | Limit küçülme eğilimi |

**Karar:** Firebase (varsayılan, rıza sonrası) + GameAnalytics (publisher uyumu, soft launch döneminde). PostHog EU verisi için alternatif; Amplitude yok.

### 5.2 Event taksonomisi (ilk günden, 500 limiti içinde ~35 event)

| Event | Parametreler | Ne için |
|---|---|---|
| `session_start` (otomatik) | — | DAU, oturum/gün |
| `ftue_step` | `step`, `ms_since_launch` | FTUE hunisi, ilk kahkaha süresi (`first_reaction`) |
| `year_advanced` | `age`, `life_id`, `ms_in_year`, `cards_seen` | "yıl/oturum", tempo |
| `event_shown` / `event_choice` | `storylet_id`, `variant`, `choice_idx`, `age` | içerik performansı, roast tepkisi |
| `death` | `age`, `cause`, `life_no`, `legacy_points` | ölüm→yeniden doğuş oranı |
| `rebirth` | `ms_since_death`, `inherited` | meta-progression |
| `diagnosis_unlocked` | `id` | koleksiyon ilerlemesi |
| `streak_state` | `len`, `freeze_used` | affedici streak |
| `ad_opportunity` / `ad_shown` / `ad_reward` / `ad_skip` | `placement`, `network`, `ecpm_cents` (AdMob paid event), `age` | yerleşim bazlı opt-in, ARPDAU reklam |
| `paywall_view` / `purchase` / `restore` | `product_id`, `price_micros`, `currency`, `placement` | dönüşüm, ARPPU (RevenueCat ile çapraz) |
| `share_card` | `type` | viral çarpan |
| `notification_permission` / `att_prompt` | `result` | izin oranları |
| `consent_state` | `analytics`, `ads_personalized` | KVKK/GDPR raporu |

Firebase'in önerilen oyun event'leri (`level_start/end`, `post_score`, `unlock_achievement`, `spend/earn_virtual_currency`, `ad_impression`) eşlenir: yıl = level, ölüm = level_end, Teşhis = achievement.

### 5.3 Publisher retention'ı nasıl okur?

- Firebase'de "kullanıcı retention" kohortları + GameAnalytics D1/D7/D30; ciddi publisher'lar kendi SDK'sını (Supersonic platformu, Voodoo) ya da bir MMP (Adjust/AppsFlyer) ister. Soft launch bütçesine **MMP ücretsiz katmanı** (AppsFlyer Zero/Adjust başlangıç) eklenir; CPI testinde zaten gerekir.
- Kohort büyüklüğü ≥ 900, yalnızca organik olmayan trafikte okuma, iOS/Android ayrı.

### 5.4 Gizlilik

- **ATT:** oyunlarda opt-in %39 (Adjust Q1 2026, 2025'te %38); ön-izin ekranı +10–15 puan [65][66]. İlk oturumda **değer anından sonra** (ilk ölüm özeti) istenir; reddedilirse SKAdNetwork/kişiselleştirilmemiş reklam.
- **GDPR/UMP:** EEA/UK/CH'de Google sertifikalı CMP (UMP yeterli) olmadan kişiselleştirilmiş reklam yok; rızasız gösterim Tier-1 Avrupa'da %40–80 daha az kazandırıyor (satıcı iddiaları, çelişkili) [61][67].
- **KVKK:** aydınlatma ve açık rıza metinleri ayrı; reklam/analitik SDK = yurt dışına aktarım (T9). Rıza yoksa oyun **tamamen çalışır**, yalnızca analytics kapalı.

### 5.5 Tamamen offline yedek: "Felek'in Raporu"

- Cihazda ring-buffer telemetri (T11) → Ayarlar'da "Felek'in Raporu": toplam yıl, ömür sayısı, en uzun streak, en çok görülen Teşhis, izlenen rüşvet sayısı, satın almalar. Oyuncu bunu **paylaşım kartı** ya da JSON olarak dışa aktarabilir (opt-in, PII yok).
- Kullanım: (a) analytics rızası vermeyen oyuncular için QA/destek, (b) kapalı beta'da 50–100 test oyuncusundan toplanan JSON'lar → yerel betikle retention ve playtime tabloları (publisher'a "kapalı beta özeti" olarak sunulabilir; ölçek küçük, dürüstçe etiketlenir).

**Bu oyuna nasıl uygularız:** `engine` efekt kanalından `analytics` efekti çıkar (T5), `AnalyticsSink` arayüzü arkasında Firebase/GameAnalytics/yerel sink'ler; rıza durumu sink'leri açar/kapar. Event adları ve parametreler `packages/engine/analytics/schema.ts`'te tek kaynaktan türetilir (500/25 limitleri test ile korunur). Soft launch dashboard'u: D1/D7/D30, oturum/gün, dk/gün, yıl/oturum, ölüm→yeniden doğuş, rewarded opt-in (yerleşim bazlı), rewarded/DAU, ARPDAU (reklam+IAP), Torpil dönüşümü (D7/D30), crash-free.

---

## 6) Teslimat: Bizim oyun için monetizasyon tasarım dokümanı

### 6.1 IAP kataloğu (fiyatlar: ABD / Türkiye; TR'de satın alma gücü indirimi bilinçli, manuel storefront fiyatı)

| Ürün | Tür | ABD | TR | Kapsam | Felek'in ağzından (TR) |
|---|---|---|---|---|---|
| **Torpil** | non-consumable | **6,99 $** | **199,99 ₺** | Tüm zorunlu reklamlar kapalı (rewarded opsiyonel kalır); Felek'in Kalemi hariç tüm ekstra içerik; 2 persona; mezar taşı temaları; gelecek içerik paketleri dahil | "Herkesin bir tanıdığı var. Senin de artık ben varım. Reklam yok, kuyruk yok, 'bir dakika bekleyin' yok." |
| **Felek'in Kalemi** | non-consumable | 4,99 $ | 149,99 ₺ | Stat/özellik editörü, yeni hayata başlarken "kader yaz", mevcut hayatta yılda 1 düzeltme | "Kaderini kendin yaz. Ama imla hatalarından ben sorumlu değilim." |
| **Torpil Plus** (paket) | non-consumable | 11,99 $ | 349,99 ₺ | Torpil + Kalem + 1 ek persona | "Torpilin torpili." |
| **İkinci Şans ×3** | consumable | 1,99 $ | 59,99 ₺ | Ölüm anında geri dönüş (ömürde en fazla 2; biri rewarded ile) | "Ölüm bir öneri. Üç kere itiraz hakkın var." |
| **Rüşvet Zarfı ×5** | consumable | 1,99 $ | 59,99 ₺ | Olay sonucunu yeniden çevir (yılda 1; rewarded alternatifi var) | "Kadere zarf uzat. Hepimiz yapıyoruz." |
| **Persona: Teyze / Bürokrat / Motivasyon Konuşmacısı** | non-consumable | 2,99 $ | 89,99 ₺ | Alternatif anlatıcı sesi (metin varyant seti) | "Beni beğenmedin mi? Teyzen var. Daha fenası." |
| **Hayat Paketi (tematik)** | non-consumable | 2,99 $ | 89,99 ₺ | 60–80 storylet'lik tematik paket (ör. "Taşra", "Plaza", "Gurbet"); Torpil'e dahil | "Yeni mahalle, yeni dert." |
| **Felek Takvimi Premium İz** | non-consumable (sezon başına ayrı ID) | 2,99 $ | 89,99 ₺ | O takvim sezonunun premium ödül izi (kozmetik + persona satırları + Teşhis çerçeveleri) | "Yılın geri kalanı için VIP kuyruk." |
| **Felek Kulübü** (2. faz) | aylık abonelik | 2,99 $/ay | 89,99 ₺/ay | Tüm personalar + her ay 1 Hayat Paketi + premium iz; Torpil sahibine indirimli | — |

Kurallar: hiçbir üründe rastgelelik yok (Apple 3.1.1 oran yükümlülüğü doğmaz; Belçika/Hollanda riski yok — T1). Hiçbir ekranda sahte aciliyet, önceden seçili paket, kart kaydı gerektiren deneme yok (Reklam Kurulu). Tüketilebilirlerin süresi dolmaz. Torpil fiyatı A/B testi (5,99 / 6,99 / 7,99 $) RevenueCat Experiments ile; TR'de 149,99 / 199,99 / 249,99 ₺.

**"Torpil" değerlendirmesi:** (+) tek kelime, kültürel yük, Felek'le uyum, "ayrıcalık" vaadini dürüst anlatıyor (reklam yok = kuyruk yok). (−) T4'te memur kariyerinde bir "torpil olayı" var; isim çakışması olay adının "kayırma" olarak değişmesiyle çözülür. (−) EN'de birebir çevrilemez; T10 adayları: **"Plot Armor"** (favori — oyun kültüründe anlaşılır, mizahi), "The Inside Track", "Connections". (−) TR'de "torpil" negatif çağrışım taşır; Felek'in sesi bunu zaten mizaha çevirir ("ahlaki sorunlarını çözmek benim işim değil, reklamları kaldırmak işim"). **Karar: Torpil kalır; T2'nin "Ölümsüz Üyelik"i kullanılmaz (ölümsüzlük vaadi oyun döngüsüyle çelişir).**

### 6.2 Rewarded yerleşimleri, tetikleyiciler, tavanlar

| # | Yerleşim (Felek'in ağzından) | Tetikleyici | Ödül | Tavan / cooldown | Not |
|---|---|---|---|---|---|
| R1 | **"Kaderi rüşvetle ikna et"** | Olay sonucu "kötü" etiketli ve oyuncu sonuç ekranında | Aynı olayın sonucunu yeniden çevir (deterministik seed +1; sonuç daha kötü de olabilir — Felek bunu söyler) | Hayat yılı başına 1; ölüm olaylarında geçersiz; ilk ömürde 20. yaştan önce kapalı | Seed ideası onaylandı. Sonuç garantisi vermez → aldatıcı değil, Felek "rüşvet alır, söz vermez" |
| R2 | **"Felek'e yalvar"** | Ölüm ekranı, Roast Raporu'ndan önce | Ölümü 1 yıl ertele + küçük sağlık iadesi | Ömürde 1 (İkinci Şans tüketilebilirle 2'ye çıkar); 60 yaş altı ölümlerde | Alternatif IAP var; rewarded ilk ömürde kapalı (ölümün ağırlığı öğrenilsin) |
| R3 | **"Patronun gözüne gir"** | Yıl başında, çalışıyor ve "terfi/zam" olayı yoksa | O yıl gelir ×2 | 3 yılda 1 | Ekonomi dengesi için (T4) üst sınır var |
| R4 | **"Arka kapı"** | 2 seçenekli olayda | 3. (genelde absürt, Torpil'li) seçenek açılır | Oturumda 3; aynı olayda 1 | İçerik ekibi her 2 seçenekli storylet için 1 "arka kapı" satırı yazar |
| R5 | **"Günün falı"** | Günde ilk açılışta, FTUE sonrası | 24 saatlik küçük buff (şans +%5 görünür) | Günde 1 | Takvim gerçek; buff görünür; "günlük görev" değil, opsiyonel |
| R6 | **"Mezar taşını yaldızla"** | Roast Raporu sonunda | Paylaşım kartı için kozmetik çerçeve | Ömürde 1 | Viral kart kalitesini artırır (T1 paylaşım) |

**Global tavanlar:** günde en fazla **6** rewarded; iki rewarded arası ≥ **120 sn**; ilk oturumun ilk **10 dakikasında** hiç reklam yüzeyi gösterilmez (ne rewarded ne interstitial); Torpil sahibi için tüm rewarded'lar yerinde kalır (ödüller aynıdır). Ödül, reklam **başarıyla tamamlandığında** verilir; yükleme başarısızsa Felek "Ağ yok. Rüşvet de ağ ister." der ve ödülü **vermez** (politika + ekonomi).

### 6.3 Interstitial politikası

- **Tek yerleşim:** ölüm özeti kapandıktan sonra, mezar taşı ekranı öncesi ("Reklam arası. Hayatın da öyle bitti zaten.").
- **Kurallar:** ilk 2 oturumda ve ilk ölümde **yok**; aynı oturumda en fazla **3**; iki interstitial arası ≥ **5 dk**; 5 sn sonra kapatılabilir; asla bir seçimden hemen sonra; asla yıl başında (Google "segment başı" yasağı).
- **Torpil** tüm interstitial'ları kaldırır. Ölüm sonrası interstitial TR'de düşük eCPM nedeniyle **opsiyonel olarak rewarded'a dönüştürülebilir** ("Mezar taşını yaldızla" ile birleştirip interstitial'ı tamamen kaldırma A/B'si).
- Rewarded interstitial formatı (AdMob beta) kullanılırsa "Hayır" butonlu giriş ekranı zorunlu [58].

### 6.4 Felek Takvimi (offline sezon izi)

- Sezon = takvim çeyreği; `hash(YYYY-Qn)` seed'iyle tema ve ödül izi paket içinden seçilir (T1 haftalık tema altyapısının üstünde). İlerleme = yaşanan yıl + Teşhis; zaman baskısı mesajı yalnızca gerçek takvim ("Sezon 31 Aralık'ta biter" — gerçek).
- Ücretsiz iz herkese; premium iz non-consumable (sezon başına ürün). Biten sezonun premium izi satıştan kalkar, kazanılanlar kalır (Apple 3.1.1 "süresi dolmaz" kredi değil, içerik; kazanılmış kozmetikler kalıcı).
- Backend yok: ödül izleri uygulama paketinde; yeni sezon içeriği EAS Update/imzalı JSON ile (T5).

### 6.5 KPI hedef tablosu

| Metrik | MVP (kapalı beta, 50–100) | Soft launch TR (Android önce) | Soft launch EN (CA/PH/Nordik) | Pitch eşiği |
|---|---|---|---|---|
| Crash-free oturum | ≥ %99 | ≥ %99,3 | ≥ %99,5 | < %1 crash |
| İlk kahkaha (TTFL) | < 20 sn | < 20 sn | < 20 sn | — |
| FTUE tamamlama | ≥ %80 | ≥ %75 | ≥ %75 | — |
| D1 / D7 / D30 | (ölçülür) | ≥ %40 / %18 / %8 | ≥ %40 / %18 / %8 | ≥ %40 / %18–20 / %8–10 (karşılaştırma: [6][99]) |
| Oturum/gün · dk/gün | ≥ 3 · ≥ 15 | ≥ 3 · ≥ 20 | ≥ 3 · ≥ 20 | ≥ 3 · ≥ 20 |
| Yıl/oturum | ≥ 10 | ≥ 12 | ≥ 12 | — |
| Ölüm → yeniden doğuş (aynı oturum) | ≥ %60 | ≥ %60 | ≥ %60 | — |
| Rewarded opt-in (DAU'nun %) | — | ≥ %35 | ≥ %40 | ≥ %40 |
| Rewarded gösterim/DAU | — | ≥ 1,5 | ≥ 2,0 | ≥ 2,0 |
| Toplam reklam gösterimi/DAU | — | ≥ 2,5 | ≥ 3,5 | 3,5–4 |
| ARPDAU (reklam+IAP) | — | ≥ 0,012 $ | ≥ 0,06 $ | ≥ 0,08 $ (Tier-1) |
| Torpil dönüşümü (D30, install bazlı) | — | ≥ %0,8 | ≥ %1,5 | ≥ %2 |
| CPI (Android) | — | ≤ 0,30 $ | ≤ 1,20 $ (CA) / ≤ 0,40 $ (PH) | LTV90/CPI ≥ 0,8, LTV180 ≥ 1,2 projeksiyon |
| ATT opt-in (iOS) | — | ≥ %40 | ≥ %40 | — |

### 6.6 Publisher pitch checklist'i

- [ ] Oynanabilir build: TestFlight + Play internal; ≥ 2 ömür içerik; cheat paneli; test reklamları
- [ ] Soft launch verisi: ≥ 900 install/kohort, D1/D7/D30 CSV, playtime, yıl/oturum, rewarded/DAU, ARPDAU
- [ ] Marketability: ≥ 3 kreatif, CPI/CTR/IPM, 2 ülke, 600–1.200 $ harcama kanıtı
- [ ] Monetizasyon dokümanı (bu bölüm) + RevenueCat/Firebase dashboard erişimi (salt okunur)
- [ ] 15 slayt deck (3.3) + 1 sayfa özet + 30 sn video
- [ ] Uyum paketi: yaş anketi yanıtları, gizlilik/KVKK/EULA linkleri, lisans ekranı (T9)
- [ ] İçerik hızı kanıtı: 4 haftalık storylet üretim/QA log'u
- [ ] "İstemiyoruz" sayfası: IP, mağaza hesabı, dev payından recoup, audit yok, süresiz münhasırlık
- [ ] Hukuk: TR'de yetkili avukatla sözleşme şablonu ön incelemesi (T9 kuralı)

### 6.7 Soft launch planı

| Faz | Süre | Pazar | Hedef | Bütçe |
|---|---|---|---|---|
| 0 — Marketability | 1–2 hafta | TR + CA (TikTok/Meta) | 3–5 kreatif, CPI/CTR okuması, ton testi | 600–1.200 $ |
| 1 — Teknik soft launch | 4 hafta | **TR, Android** (sonra iOS) | crash < %1, IAP/restore/iade akışları, FTUE hunisi, rewarded opt-in | 500–1.000 $ (TR CPI düşük) + organik TikTok |
| 2 — KPI soft launch | 6–8 hafta | **CA** (Tier-1 okuma) + **PH** (hacim) + opsiyonel **NO/NL** | D1/D7/D30 ≥ hedef, ARPDAU Tier-1, Torpil dönüşümü; ≥ 900 install/kohort/platform | 5.000–8.000 $ |
| 3 — Pitch turu | 4–6 hafta | — | 10–15 publisher'a veri odasıyla başvuru; paralel self-publish hazırlığı | 0 (zaman) |
| **Toplam** | **15–20 hafta** | | | **~7.000–11.000 $ (≈ 315–495 bin ₺)** |

Kill/iterate kriterleri: Faz 1 sonunda D1 < %30 veya FTUE tamamlama < %60 → FTUE/ton iterasyonu, Faz 2'ye geçme. Faz 2 sonunda D7 < %12 → publisher yerine self-publish + organik yol; D7 ≥ %18 ve CPI ≤ 1,2 $ → pitch.

### 6.8 Gelir modeli (3 senaryo; 1 $ = 45 ₺; mağaza kesintisi IAP'de %15; reklam geliri ağdan net)

| | **Mahalle** (TR, self-publish) | **Şehir** (TR+EN soft launch, self-publish) | **Dünya** (publisher UA, %80 Tier-1 DAU) |
|---|---|---|---|
| DAU | 3.000 | 15.000 | 60.000 |
| Rewarded/DAU × eCPM | 1,8 × 2,5 $ → 0,0045 $ | 2,2 × ~9 $ (TR/Tier-1 karma) → 0,0198 $ | 2,5 × ~14 $ → 0,035 $ |
| Interstitial/DAU × eCPM | 1,2 × 1,5 $ → 0,0018 $ | 1,3 × ~6 $ → 0,0078 $ | 1,5 × ~9 $ → 0,0135 $ |
| IAP ARPDAU (günlük ödeyen × ARPPU) | %0,08 × 4 $ → 0,0032 $ | %0,15 × 7 $ → 0,0105 $ | %0,25 × 8 $ → 0,020 $ |
| **ARPDAU (bileşen toplamı — düzeltildi)** | **~0,0095 $** (eski metin: 0,012 $) | **~0,038 $** | **~0,069 $** (eski metin: 0,09 $; 0,09 $ "BitLife seviyesi" için IAP ARPDAU ~0,04 $ gerekir, ör. %0,4 günlük ödeyen × 10 $) |
| Aylık brüt | **~855 $ ≈ 38 bin ₺** | **~17.100 $ ≈ 770 bin ₺** | **~123.000 $ ≈ 5,5 M ₺** (0,09 $ senaryosunda ~162.000 $ ≈ 7,3 M ₺) |
| Mağaza kesintisi (IAP %15; EN pazarında Google Play %20+%5 olabilir → duyarlılık) | −43 $ | −710 $ | −5.400 $ (%25'te −9.000 $) |
| RevenueCat (%1 MTR, >2.500 $) | 0 | ~−50 $ | ~−360 $ (düzeltildi; eski metin 540 $) |
| Publisher payı | — | — | UA recoup + 50/50 → geliştiriciye ilk yıl ~%30–40 |
| **Geliştiriciye aylık net (yaklaşık)** | **~810 $ ≈ 36 bin ₺** | **~16.300 $ ≈ 735 bin ₺** | **~35–47 bin $ ≈ 1,6–2,1 M ₺** (0,09 $ senaryosunda ~50–65 bin $) |
| LTV90 (≈ 8,7 aktif gün × ARPDAU) | ~0,08 $ | ~0,33 $ | ~0,60 $ (0,09 $'da 0,78 $) |
| Sürdürülebilir CPI (LTV90'da geri ödeme) | ~0,08 $ | ~0,33 $ | ~0,60 $ |

Okuma: (1) **TR tek başına aylık giderleri karşılar, geçim sağlamaz.** (2) Şehir senaryosu solo geliştirici için anlamlı gelir ama paid UA ile değil, organik/viral ile büyür. (3) Dünya senaryosu BitLife'ın ARPDAU'suna yaslanır; Tier-1 casual CPI'ları (1,00–2,50 $) LTV90'ın üstünde → publisher yalnızca LTV180+ ve organik çarpanla ikna olur. (4) Torpil dönüşümünü %2'ye, rewarded/DAU'yu 2,5'e çıkarmak ARPDAU'yu %30–40 artırır; bunlar tasarımın kaldıraçları. (5) Vergi: TR hakedişinde KDV %20 fiyattan ayrışır; DST %5; kurumlar vergisi modele dahil değil (mali müşavir).

**Bu oyuna nasıl uygularız:** Monetizasyon işleri sprint backlog'una şu sırayla girer: (P0) Torpil + restore + yerel entitlement; (P0) R1/R2 rewarded yerleşimleri + tavan motoru; (P0) ölüm-sonrası interstitial + tavanlar; (P0) analytics şeması + rıza; (P1) RevenueCat entegrasyonu + fiyat testi; (P1) tüketilebilirler + token defteri; (P1) personalar; (P1) Felek Takvimi; (P2) Hayat Paketleri; (P2) abonelik.

---

## Bu oyun için öneriler (öncelikli, puanlı)

Puanlama: Etki (1–5) × Uygulanabilirlik (1–5) ÷ Risk (1–3), yüksek puan iyi.

| # | Öneri | Etki | Uyg. | Risk | Puan | Öncelik |
|---|---|---|---|---|---|---|
| 1 | **Torpil** tek büyük non-consumable; reklamsızlık gerçekten reklamsız; 6,99 $ / 199,99 ₺; restore görünür | 5 | 5 | 1 | 25,0 | **P0** |
| 2 | **Rewarded-first:** R1 "Kaderi rüşvetle ikna et" + R2 "Felek'e yalvar" ilk sürümde; günlük 6 tavan, 120 sn cooldown, ilk 10 dk reklamsız | 5 | 5 | 1 | 25,0 | **P0** |
| 3 | **Interstitial yalnızca ölüm sonrası**, ilk 2 oturum/ilk ölüm hariç, ≤ 3/oturum, ≥ 5 dk ara | 4 | 5 | 1 | 20,0 | **P0** |
| 4 | **RevenueCat + yerel entitlement önbelleği**; `expo-iap` yedek; PBL ≥ 8 CI kontrolü | 4 | 4 | 1 | 16,0 | **P0** |
| 5 | **Analytics şeması ilk günden** (Firebase + GameAnalytics), rıza kapılı; "Felek'in Raporu" offline yedek | 4 | 5 | 1 | 20,0 | **P0** |
| 6 | **Uyum checklist'i sprint tanımına** (2.5.18 reklam bildirme, 4+ metadata, UMP, KVKK ayrı rıza, IARC/Apple tutarlı yanıt) | 5 | 4 | 1 | 20,0 | **P0** |
| 7 | **Soft launch planı:** TR teknik → CA+PH KPI → pitch; 7–11 K $; kill kriterleri yazılı | 4 | 4 | 2 | 8,0 | **P1** |
| 8 | **Marketability testini ilk 2 haftada yap** (TikTok/Meta, 600–1.200 $) — ton CPI'yı düşürüyor mu, erken öğren | 4 | 5 | 1 | 20,0 | **P0** |
| 9 | Tüketilebilirler (İkinci Şans, Rüşvet Zarfı) + idempotent token defteri | 3 | 4 | 1 | 12,0 | **P1** |
| 10 | Anlatıcı personaları (3 adet) — T3 varyant altyapısı üzerine, 2,99 $ | 3 | 3 | 1 | 9,0 | **P1** |
| 11 | Felek Takvimi offline sezon izi (ücretsiz + premium) | 3 | 3 | 1 | 9,0 | **P1** |
| 12 | AdMob `maxAdContentRating` T→MA A/B testi soft launch'ta | 2 | 5 | 1 | 10,0 | **P1** |
| 13 | Publisher "istemiyoruz" sayfası + avukat ön incelemesi | 4 | 4 | 1 | 16,0 | **P1** |
| 14 | Felek Kulübü aboneliği | 2 | 3 | 2 | 3,0 | **P2** |
| 15 | Banner (yalnızca menü/ölüm sonrası) | 1 | 4 | 2 | 2,0 | **P2** |

---

## Açık sorular

1. **Yaş derecesi çelişkisi:** T9 "18+ beyanı" önerir, T1/T3/T5/T6 "16+" hedefler. 18+ beyanı UA erişimini ve bazı ağlarda gösterimi kısıtlar; 16+ ise 7578 sayılı Kanun/BTK yönetmeliği altında yeterli mi? **Avukat + ürün kararı gerekli** (lansmandan önce).
2. **Türkiye eCPM gerçeği:** TR rewarded/interstitial eCPM için hiçbir birincil kamu verisi bulunamadı; Appodeal Benchmarks aracı/2025 PDF'i ve TopOn H1 2025 PDF'i doğrudan okunmalı; ilk 2 hafta AdMob verisiyle model güncellenmeli.
3. **Google Play ücret yapısı (2026):** hizmet ücreti + %5 faturalama ücreti ve "ilk 1 M $ için %10" iddiaları çelişkili; Play Console'daki güncel şartlar okunup model düzeltilmeli.
4. **Apple TR fiyat kademeleri:** 0,99 $ kademesinin güncel ₺ karşılığı doğrulanmadı; App Store Connect fiyat tablosu ile manuel storefront fiyatları girilmeli.
5. **RevenueCat ücretsiz katman ve Experiments kapsamı:** 2.500 $ MTR / %1 ikincil kaynaklardan; resmi fiyat sayfası teyit edilmeli; Paywalls/Experiments'in ücretsiz planda olup olmadığı belirsiz.
6. **TR publisher şartları:** Rollic/Udo/Fomo/Good Job'un üçüncü parti gelir paylaşımı kamuya açık değil; doğrudan görüşme notları toplanmalı.
7. ~~**Supersonic'in yeni sahibi**~~ **Çözüldü:** Tripledot, ~40 M $, kapanış 4 Ağu 2026 [112]. Açık kalan: 2026–27 program şartları (SuperHybrid/SuperSpring tipi yarışmalar Tripledot altında sürüyor mu? Test/iterasyon ödemeleri var mı, recoupable mı?) — doğrudan görüşme notu gerekir.
8. **Google Play'de Mature 17+ vs Teen'in reklam talebi/UA'ya etkisi:** nicel veri yok; soft launch A/B'si ile ölçülecek.
9. **Rüşvet (R1) ve sonuçsallık:** reroll, oyunun "kararların sonucu var" tezini zayıflatır mı? Playtest'te "rüşvet sonrası pişmanlık" olayları ile denge; yılda 1 tavanı yeterli mi?
10. **İade politikası ve offline içerik:** iade edilen Torpil cihazda saatlerce açık kalabilir; kabul edilen risk, ama Google "voided purchases" API'si backend ister — kabul mü, RevenueCat webhook'u mu?
11. **PEGI 2020 değişikliği:** uyuşturucu "kullanımı" tasviri 18'e itiyor iddiası (ikincil); IARC anketini doldururken "referans" ile "kullanım" ayrımı içerik kota tablosuyla garanti altına alınmalı.
12. **Felek Takvimi ve "süresi dolmaz" kuralı:** premium izin sezon sonunda satıştan kalkması Apple 3.1.1 "kredi süresi dolmaz" ile çakışıyor mu? (İçerik ≠ kredi; yine de App Review notuna açıklama.)

---

## Kaynaklar

1. Pro Game Guides — BitLife Bitizen: Perks, Price & Is It Worth It — https://progameguides.com/bitlife/bitlife-bitizen/
2. Gamepur — BitLife God Mode: Cost, Abilities — https://www.gamepur.com/guides/bitlife-god-mode-cost-abilities-is-it-worth-it
3. Apple App Store — BitLife: Life Simulator (ABD) — https://apps.apple.com/us/app/bitlife-life-simulator/id1374403536
4. BitLife Wiki — God Mode — https://bitlife-life-simulator.fandom.com/wiki/God_Mode
5. Playio — Revenue = DAU × ARPDAU (GameAnalytics 2026 özetli) — https://blog.playio.co/arpdau-benchmarks-mobile-games
6. Game Growth Advisor — Mobile Game KPIs 2026: 20 Benchmarks — https://gamegrowthadvisor.com/blog/2026-03-17-mobile-game-kpis-benchmarks-2026/
7. Rewarding Hub — Monetization Benchmarks by Genre 2026 — https://business.rewardinghub.com/blog/monetization-benchmarks-by-genre/
8. MAF — App conversion rates, IPM and IAP benchmarks (2026) — https://maf.ad/en/blog/mobile-game-conversion-rates/
9. Playio — 2026 Mobile Game eCPM Benchmarks by Format, Region, OS — https://blog.playio.co/mobile-game-ecpm-benchmarks-2026
10. Undrads — How Much Do Mobile Games Make Per Ad? — https://www.undrads.com/blogs/how-much-do-mobile-games-make-per-ad
11. RevenueLab — AdMob eCPM Benchmarks 2026 — https://www.revenuelab.fyi/blog/admob-ecpm-benchmarks-2026
12. Appodeal — The Latest eCPM Report 2025 (PDF) — https://appodeal.com/wp-content/uploads/2025/03/Appodeal-The-Latest-eCPM-Report-2025.pdf
13. Appodeal — Mobile eCPM Report Is Now Appodeal Benchmarks — https://appodeal.com/blog/mobile-ecpm-report-app-ad-monetization-worldwide-performance/
14. TopOn — Global Mobile Games Monetization Report H1 2025 (PDF) — https://mores.toponad.com/reports/TopOn%20Global%20Mobile%20Games%20Monetization%20Report%20_%202025%20H1.pdf
15. Udonis — eCPMs for Rewarded Video, Interstitial & Banner — https://www.blog.udonis.co/mobile-marketing/mobile-apps/ecpms
16. CostBench — RevenueCat Pricing 2026: Free up to $2.5K MTR, then 1% — https://costbench.com/software/subscription-billing/revenuecat/
17. RevenueCat — Introducing Offline Entitlements — https://www.revenuecat.com/blog/company/introducing-offline-entitlements
18. RevenueCat — Google Play Billing: Security and Fraud Prevention — https://www.revenuecat.com/guides/google-play-billing/security-and-fraud-prevention
19. Apple Tech Talks — Support customers with StoreKit 2 and App Store Server API — https://developer.apple.com/videos/play/tech-talks/10887/
20. Apple WWDC21 — Meet StoreKit 2 — https://developer.apple.com/videos/play/wwdc2021/10114/
21. Apple Developer Documentation — Transaction.currentEntitlements — https://developer.apple.com/documentation/storekit/transaction/currententitlements
22. Android Developers — Play Billing: Security best practices — https://developer.android.com/google/play/billing/security
23. Android Developers — Integrate the Google Play Billing Library — https://developer.android.com/google/play/billing/integrate
24. Android Developers — Play Billing Library release notes — https://developer.android.com/google/play/billing/release-notes
25. RevenueCat — Play Billing 8 migration — https://www.revenuecat.com/blog/engineering/play-billing-8-migration/
26. OpenIAP — Expo Setup (expo-iap) — https://www.openiap.dev/docs/setup/expo
27. GitHub hyochan/expo-iap — Discussion #142: server side receipt validation? — https://github.com/hyochan/expo-iap/discussions/142
28. GitHub hyochan/expo-iap — Discussion #125: refunds on Google Play after migration — https://github.com/hyochan/expo-iap/discussions/125
29. Game World Observer — How Voodoo makes $100M hybrid-casual games: 15% D7 — https://gameworldobserver.com/2023/07/25/voodoo-hybrid-games-d7-retention-games-and-names-podcast
30. Voodoo — A Snackable Guide to Partnering with Voodoo — https://voodoo.io/news/a-snackable-guide-to-partnering-with-voodoo
31. Supersonic — SuperSpring Terms — https://supersonic.com/superspring-terms/
32. Supersonic — SuperHybrid Terms — https://supersonic.com/superhybrid-terms/
33. Supersonic — Testing Terms — https://supersonic.com/testing-terms/
34. Game Developer — Unity looking to sell publishing label Supersonic — https://www.gamedeveloper.com/business/unity-sunsetting-ads-network-and-divesting-publishing-label-supersonic
35. CAS.AI — Mobile Game Publisher (giriş eşikleri) — https://cas.ai/publishing/
36. Kwalee — How to Market-Test Your Hypercasual Game — https://medium.com/kwalee-blog/how-to-market-test-your-hypercasual-game-dca495633615
37. Kwalee — 5 Tips for Making Attractive Game Prototypes — https://kwalee.com/blog/gamedev/5-tips-making-attractive-game-prototypes-game-publishers
38. GameAnalytics (Coda) — CPI or CTR? How to Measure Marketability — https://www.gameanalytics.com/blog/cpi-ctr-measure-your-games-marketability-coda
39. Geeklab — What are mobile game publishers looking for? — https://geeklab.app/posts/what-are-mobile-game-publishers-looking-for/
40. SayGames — Why Hybrid Games Need a Different Publishing Model — https://blog.say.games/posts/why-saygames-believes-hybrid-games-need-a-different-publishing-model
41. Game Growth Advisor — Mobile Game Soft Launch 2026: Markets, Budget & Kill Criteria — https://gamegrowthadvisor.com/blog/2025-12-16-mobile-soft-launch-complete-guide/
42. Game Growth Advisor — Soft Launch Market Selection 2026 — https://gamegrowthadvisor.com/blog/2026-06-25-soft-launch-market-selection-2026-guide/
43. Game Growth Advisor — Mobile Game CPI Benchmarks 2026: Why Numbers Diverge — https://gamegrowthadvisor.com/blog/2026-03-17-user-acquisition-cpi-benchmarks-2026/
44. Game Growth Advisor — Mobile Game Go-to-Market 2026: UA and Soft Launch — https://gamegrowthadvisor.com/blog/2026-04-09-mobile-game-go-to-market-strategy/
45. Game Developer — Ultimate Guide to Soft Launch your Mobile Game — https://www.gamedeveloper.com/business/ultimate-guide-to-soft-launch-your-mobile-game
46. Mobile Dev Memo — The economics of mobile game publishing — https://mobiledevmemo.com/the-economics-of-mobile-game-publishing/
47. Legal Moves — Video Game Royalties [2026 Guide] — https://legalmoveslawfirm.com/video-game-royalties/
48. Legal Moves — Video Game Publishing Agreements: Developers Beware [2026] — https://legalmoveslawfirm.com/state-game-publishing-agreements/
49. Akupara Games — Publisher Red Flags in Contracts and Negotiations — https://www.akuparagames.com/2026/02/17/publisher-red-flags-what-to-look-for-in-contracts-and-negotiations/
50. Game Growth Advisor — Game Publisher Recoup Clause: The Math — https://gamegrowthadvisor.com/blog/2026-08-18-indie-game-publisher-recoup-clause-negotiation-guide-2026/
51. Game Growth Advisor — Game Publisher Deal Red Flags: 12 Clauses — https://gamegrowthadvisor.com/blog/2026-10-14-game-publisher-deal-red-flags-contract-guide/
52. Playio — Self-Publishing or Signing With a Publisher (2026) — https://blog.playio.co/game-publishing-deal-vs-self-publishing
53. Apple — App Store Review Guidelines — https://developer.apple.com/app-store/review/guidelines/
54. Apple — App Store Connect Help: Age ratings — https://developer.apple.com/help/app-store-connect/reference/age-ratings
55. Google Play Console Help — Ads policy — https://support.google.com/googleplay/android-developer/answer/9857753
56. Google Play Console Help — Better Ads Experiences — https://support.google.com/googleplay/android-developer/answer/12271244
57. Google AdMob Help — Policies for ad units that offer rewards — https://support.google.com/admob/answer/7313578
58. Google for Developers — AdMob Rewarded interstitial ads (Android) — https://developers.google.com/admob/android/rewarded-interstitial
59. Google AdMob Help — Set the maximum ad content rating — https://support.google.com/admob/answer/7562142
60. Google Play Console Help — Manage target audience and app content settings — https://support.google.com/googleplay/android-developer/answer/9867159
61. Google for Developers — AdMob: Disclose to EEA users (GDPR/UMP) — https://developers.google.com/admob/android/privacy/gdpr
62. Google Analytics Help — [GA4] Event collection limits — https://support.google.com/analytics/answer/9267744
63. UserOrbit — PostHog Pricing 2026: Free Tier, Real Costs — https://userorbit.com/blog/posthog-pricing-guide
64. Growth Method — PostHog vs Amplitude (2026): Pricing, Free Tiers — https://growthmethod.com/posthog-vs-amplitude/
65. Business of Apps — App Tracking Transparency Opt-In Rates (2026) — https://www.businessofapps.com/data/att-opt-in-rates/
66. Adjust — The Gaming App Insights Report: 2026 Edition (PDF) — https://a.storyblok.com/f/47007/x/20551740ee/gaming-app-insights-report-2026.pdf
67. AdReact — GDPR and App Advertising: Consent Rates and Ad Revenue — https://adreact.com/blog/gdpr-impact-app-advertising-consent-revenue/
68. RevenueCat — State of Subscription Apps 2026: Gaming — https://www.revenuecat.com/state-of-subscription-apps-2026-gaming
69. RevenueCat — State of Subscription Apps 2026 — https://www.revenuecat.com/state-of-subscription-apps
70. Playio — The Real Price of an Interstitial — https://blog.playio.co/interstitial-ads-mobile-games
71. AdReact — Interstitial Ad Best Practices for Mobile Games — https://adreact.com/blog/interstitial-ad-best-practices-mobile-games/
72. MWM — Interstitial Ads: 2026 Best Practices — https://mwm.ai/glossary/interstitial
73. Gaming in Turkey — Türkiye Oyun Sektörü Raporu 2025 — https://www.gaminginturkey.com/tr/turkiye-oyun-sektoru-raporu-2025-yayinlandi/
74. BloombergHT — Türkiye'de oyun sektörü 1 milyar doları aştı — https://www.bloomberght.com/turkiye-de-oyun-sektoru-1-milyar-dolari-asti-3769463
75. Udonis — Turkish Mobile Gaming Market: Stats & Trends 2026 — https://www.blog.udonis.co/mobile-game-market/turkiye
76. Mobidictum — Scaling Games in Türkiye Landscape 2026 — https://mobidictum.com/scaling-games-in-turkiye-part-1/
77. Switas — Adjust Türkiye 2026 App Benchmarks: Six Takeaways — https://www.switas.com/articles/adjust-turkiye-2026-mobile-app-benchmarks-growth-takeaways
78. Tenjin — Ad Monetization in Mobile Games 2026 — https://tenjin.com/blog/ad-mon-gaming-2026/
79. GZT — Apple App Store Türkiye fiyatları: 30 Ocak 2026 vergi güncellemesi — https://www.gzt.com/teknoloji/apple-app-store-turkiye-fiyatlari-dustu-mu-30-ocak-2026-vergi-guncellemesi-4006165
80. PricePush — Apple's 2026 App Store Pricing & Tax Changes Guide — https://pricepush.app/blog/apple-2026-pricing-tax-changes-in-app-purchases
81. Apple Developer News — Upcoming price changes on the App Store in Türkiye — https://developer.apple.com/news/?id=4li349ao
82. OpenTheRank — ChatGPT pricing in Turkey (App Store kademeleri) — https://opentherank.com/tr/ai-pricing/chatgpt/turkey/
83. Technopat — ChatGPT Plus Türkiye fiyatı (Haziran 2026) — https://www.technopat.net/2026/06/14/chatgpt-plus-turkiye-fiyati-zamlandi-mi/
84. Appbot — Apple's App Store Small Business Program: 15% Explained — https://appbot.co/blog/app-developers-apple-google-small-business-programs/
85. DEV Community — Google Play Fees 2026: What Game Developers Now Pay — https://dev.to/aplusgamesstudio/google-play-fees-2026-what-game-developers-now-pay-2iad
86. PPC Land — Google Play developers face 25 percent fee under new structure — https://ppc.land/google-play-developers-face-25-percent-fee-under-new-structure/
87. Wikipedia — Reigns (video game) — https://en.wikipedia.org/wiki/Reigns_(video_game)
88. Game Informer — Reigns Developer Nerial Shuts Down After 13 Years — https://gameinformer.com/2026/10/01/reigns-developer-nerial-shuts-down-after-13-years
89. Stillfront — Stillfront Group acquires Candywriter, LLC — https://www.stillfront.com/en/stillfront-group-acquires-candywriter-llc-and-discloses-updated-pro-forma-figures-for-2019/
90. Candywriter — About — https://candywriter.com/about/
91. r/TheTempleOfEs — Alter Ego yapımcı röportajı çevirisi (gelir dağılımı) — https://r.darklab.sh/r/TheTempleOfEs
92. Apple App Store — ALTER EGO (IAP listesi) — https://apps.apple.com/au/app/alter-ego/id1447605099
93. Udonis — Choices: Stories You Play Monetization Strategy — https://www.blog.udonis.co/mobile-marketing/mobile-games/choices-stories-you-play-monetization
94. Xbox — Game Rating Information: ESRB — https://www.xbox.com/en-US/games/gameratings
95. PEGI — What do the labels mean? — https://pegi.info/what-do-the-labels-mean
96. IARC — About — https://globalratings.com/about/
97. Sözcü — Tüketiciye tuzak kurana rekor ceza: sahte yorum, karanlık tasarım, zorla abonelik — https://www.sozcu.com.tr/tuketiciye-tuzak-kurana-rekor-ceza-sahte-yorum-karanlik-tasarim-zorla-abonelik-p175311
98. NTV — Karanlık tasarımlara ceza yağdı — https://www.ntv.com.tr/ntvpara/karanlik-tasarimlara-ceza-yagdi,o5Kl6q7_yESkQpPxKZFxXA
99. Pixyliv — Mobile Game Soft Launch Benchmarks — https://pixyliv.com/benchmarks
100. DualShockers — 10 Most Successful Solo Game Devs (Balatro/Playstack) — https://www.dualshockers.com/most-successful-solo-game-devs/
101. Gamigion — 2025 Hybridcasual Market Overview with Real Data — https://www.gamigion.com/2025-hybridcasual-market-overview-with-real-data/
102. Verve — Ad revenue optimization by game genre — https://verve.com/blog/ad-revenue-optimization-by-game-genre/
103. MWM — Mobile Game Monetization: The 2026 Playbook — https://mwm.ai/glossary/mobile-game-monetization
104. Galaxy4Games — Game Launch Strategy in 2026 — https://galaxy4games.com/en/knowledgebase/blog/game-launch-strategy-in-2026-from-aso-and-ad-creatives-to-launch-ready-kpis-ua-scaling-and-publishers
105. GamesBeat — Supersonic launches LiveGames publishing service for indies — https://gamesbeat.com/ironsources-supersonic-launches-livegames-publishing-service/
106. Coinis — Rewarded Video Ads: How They Work & 2026 eCPMs — https://coinis.com/glossary/rewarded-video
107. Google (The Keyword) — Use ad content filtering to improve your users' ad experience — https://blog.google/products/admob/use-ad-content-filtering-to-help-p9rh/
108. Appodeal — Quarterly Mobile eCPM Report Q4 2024 (PDF) — https://appodeal.com/wp-content/uploads/2025/03/Quarterly_Mobile_eCPM_Report_-_Q4_2024.pdf
109. Game Growth Advisor — Mobile Game KPIs 2026 (TopOn H1 2025 casual Android rewarded 3,02 $ alıntısı) — https://gamegrowthadvisor.com/blog/2026-03-17-mobile-game-kpis-benchmarks-2026/
110. Android Developers — Google Play Billing Library version deprecation (sürüm/son tarih tablosu) — https://developer.android.com/google/play/billing/deprecation-faq
111. GameAnalytics — 2026 Mobile & PC Gaming Benchmarks — https://www.gameanalytics.com/reports/2026-mobile-pc-gaming-benchmarks
112. Game Developer — Unity sells Supersonic publishing business to Tripledot for $40M — https://www.gamedeveloper.com/business/unity-sells-supersonic-publishing-biz-to-tripledot-for-40m
113. GameDev Reports — Voyer Law: Publishing Agreements in 2025 — https://gamedevreports.substack.com/p/voyer-law-publishing-agreements-in
114. Game Growth Advisor — Game Publisher Recoup Clause (Voyer Law 2026 özeti: medyan avans 270 K $) — https://gamegrowthadvisor.com/blog/2026-08-18-indie-game-publisher-recoup-clause-negotiation-guide-2026/
115. agentdeals — Amplitude free tier 2026: limits & what changed (arşiv fiyat sayfası takibi) — https://agentdeals.dev/vendor/amplitude
116. CNBC-e — Apple, App Store gelirlerinde Türkiye için vergi güncellemesine gitti — https://www.cnbce.com/teknoloji/apple-app-store-gelirlerinde-turkiye-icin-vergi-guncellemesine-gitti-h24067
117. Android Developers Blog — A new era for choice and openness (Mart 2026 ücret yapısı) — https://android-developers.googleblog.com/2026/03/a-new-era-for-choice-and-openness.html
118. Google Play Console Help — Service fees (15 % kademesi, "remaining markets") — https://support.google.com/googleplay/android-developer/answer/112622
119. RevenueDot — RevenueCat pricing in 2026, explained (Ekim 2026) — https://revenuedot.app/blog/revenuecat-pricing-explained
120. BuildMVPFast — RevenueCat vs Superwall vs Adapty for indie devs 2026 — https://www.buildmvpfast.com/blog/revenuecat-vs-superwall-vs-adapty-in-app-subscription-indie-2026
121. GameAnalytics — How Voodoo diversified and lowered game product KPIs — https://www.gameanalytics.com/blog/how-voodoo-diversified-and-lowered-game-product-kpis
122. Game Developer — Stillfront Group acquires casual game maker Candywriter for $74.4 million — https://www.gamedeveloper.com/business/stillfront-group-acquires-casual-game-maker-candywriter-for-74-4-million
123. Google Play Console Help — Developer Program Policy (Ads: Better Ads Experiences bölümü) — https://support.google.com/googleplay/android-developer/answer/18258653
124. Firebase — FIRAnalytics reference (500 event adı sınırı) — https://firebase.google.com/docs/reference/ios/firebaseanalytics/interface_f_i_r_analytics
125. PricePush — App Store pricing by country (19,99 $ → ₺999,99 otomatik dönüşüm örneği) — https://pricepush.app/blog/app-store-pricing-by-country
126. MAF — Rewarded ads unpacked: performance insights for 2026 — https://maf.ad/en/blog/rewarded-ads-stats/
127. Playio — Mobile game ad revenue calculator (gösterim/DAU için tarafsız benchmark yok notu) — https://blog.playio.co/mobile-game-ad-revenue-calculator
128. Rami Ismail — Upfronts, Guarantees, Recoups — https://ltpf.ramiismail.com/upfronts-guarantees-recoups/
129. Google AdMob Help — Policies for ad units that offer rewards (rewarded interstitial giriş ekranı) — https://support.google.com/admob/answer/7313578
130. Adjust — Gaming App Insights 2026 (küresel oyun CPI 0,56 $, +%30) — PPC Land özeti — https://ppc.land/adjusts-2026-mobile-app-report-finance-sessions-up-21-gaming-cpi-jumps-30/

---

## Doğrulama ve Ek Bulgular (Şüpheci İnceleme)

**Yöntem (2026-11-06):** Dokümandaki en sonuç doğurucu 24 iddia ikinci bir ajan tarafından kontrol edildi. Bu oturumda da yalnızca `developer.apple.com` ve `developer.android.com` doğrudan okunabildi; `apps.apple.com`, `support.google.com`, `revenuecat.com`, `appodeal.com`, `toponad.com`, `legalmoveslawfirm.com`, `supersonic.com`, `investgame.net` ağ kısıtı nedeniyle açılamadı. Bu kaynaklar için **birden fazla bağımsız arama özeti tutarlıysa "doğrulandı (ikincil)"**, tek kaynak varsa "zayıf", hiç kaynak yoksa "doğrulanamadı" denildi. Dokümanın kendi hesapları (gelir modeli) ayrıca elle yeniden toplandı.

### D.1 Kontrol edilen iddialar

| # | İddia | Sonuç | Kaynak |
|---|---|---|---|
| 1 | BitLife ABD: Bitizenship 7,99 $, God Mode 9,99 $, Boss Mode 20,99 $, Time Machine 0,99 $, paket 15,99 $ | **Doğrulandı** (ABD App Store IAP listesi; ülkeye göre değişir) | [3] |
| 2 | ABD rewarded eCPM iOS 19,63 $ / Android 16,49 $ "Q4 2024 MAF verisi" | **Kısmen yanlış:** sayılar doğru ama kaynak **Yango Ads**; MAF alıntılıyor. Appodeal Q4 2024 daha düşük (iOS ~17,3 $ / Android ~13,2 $) | [8][9][108] |
| 3 | TopOn H1 2025 global Android rewarded 6,70 $, 3 yılın en düşüğü | **Doğrulandı** (rapor özeti); casual Android segmenti yalnızca 3,02 $ | [14][109] |
| 4 | RevenueCat 2026 oyun: indirme→ödeme iOS %1,3 / GP %0,4; deneme→ücretli %4,4 | **Doğrulandı** (aynı raporun başka bir pasajı %1,0 diyor — küçük tutarsızlık) | [68][69] |
| 5 | RevenueCat ücretsiz ≤ 2.500 $ MTR, sonra tüm MTR'nin %1'i | **Doğrulandı (ikincil, Ekim 2026)**; Experiments'in ücretsiz planda olduğu **doğrulanamadı** (incelemeler ücretli katman diyor) | [16][119][120] |
| 6 | "PBL 8 zorunluluğu geçti (31 Ağu 2026 / 1 Kas 2026)" | **Yanıltıcı → düzeltildi:** bu tarihler PBL **7**'nin son tarihi (sonuç: PBL ≥ 8 zorunlu, doğru); PBL 8'in kendi son tarihi 31 Ağu 2027 / 1 Kas 2027; PBL 9: 31 Ağu 2028 | [110] birincil |
| 7 | Voodoo D1 ≥ %45 / D7 ≥ %15 (puzzle %20) / D30 ≥ %10 | **Doğrulandı** (2023 röportajı; 3 yaşında; önceki kuralı daha sertti) | [29][121] |
| 8 | Supersonic: test 300 $, iterasyon 5.000 $'a kadar | **Bağlam yanlış → düzeltildi:** SuperSpring **2024 yarışması** şartı, tamamen recoupable, kalıcı program değil | [31][33] |
| 9 | Geliştirici payı avanslı %58,2 / medyan %50; avanssız %67,9 / medyan %70 | **Karışık → düzeltildi:** %58,2/%50 = Voyer 2025; %67,9 = Voyer 2026 (avanslı 2026: %57,9); "avanssız medyan %70" **hiçbir kaynakta yok** | [47][113][114] |
| 10 | GameAnalytics 2026: medyan D1 ~%22, D7 <%4, D30 %0,7–0,8, 16.000+ oyun | D1/D7/örneklem **doğrulandı**; D30 %0,7–0,8 **doğrulanamadı** → "<%1" | [5][111] |
| 11 | CAS.AI: CPI < 0,90 $, D1 %25+, D0 8+ gösterim | **Doğrulandı**, ancak sayfa "tercihen" diyor; sert eşik değil | [35] |
| 12 | Marketability testi 600–1.200 $, ~1 hafta | **Zayıf:** tek satıcı blogu; Kwalee/Coda kaynakları süreci doğruluyor, tutarı değil | [43][36][38] |
| 13 | Apple kademeleri: sık kaba mizah 13+, sık olgun tema 16+, sık alkol/uyuşturucu 18+, sık simüle kumar 18+ | **Doğrulandı (birincil)**; tablo 4.2 bire bir eşleşiyor | [54] |
| 14 | GA4 uygulama akışı: 500 event adı / 25 parametre / 25 kullanıcı özelliği | **Doğrulandı** (500 "kullanıcı başına") | [62][124] |
| 15 | ATT opt-in oyunlar %39 (Adjust Q1 2026), 2025'te %38 | **Doğrulandı** | [66] |
| 16 | Türkiye oyun pazarı 2025: 1,01 Mr $, +%24,7 | **Doğrulandı** (+%24,69 $ bazında; ₺ bazında +%51,5) | [73][74] |
| 17 | Alter Ego geliri %45 video / %30 banner / %25 IAP | **Doğrulanamadı:** tek kaynak Reddit aynası; birincil röportaj yok | [91] |
| 18 | Candywriter: 74 M $, 195 M $'a kadar, "Stillfront 2019'da" | Tutar **doğrulandı** (74,4 M $ + 120,6 M $ prim = 195 M $); tarih **yanlış → düzeltildi: 23 Nisan 2020** | [89][122] |
| 19 | DHV %7,5 → %5 (Ocak 2026), Apple hakedişlere yansıttı | **Doğrulandı**; ek: 2027'de %2,5 planlı | [79][116] |
| 20 | Google Play 2026 ücret yapısı "çelişkili" | **Netleştirildi:** AEA/UK/ABD 30 Haz 2026: IAP %20 (yeni kurulum), abonelik %10, +%5 faturalama; diğer bölgeler (TR) eski %15/%30 yapısında; "%10 ilk 1 M $" ikincil/çelişkili | [85][86][117][118] |
| 21 | Nerial 1 Ekim 2026'da kapandı | **Doğrulandı** (Devolver ile ortak açıklama; 2 yıllık zarar; Nisan 2025'te %40 işten çıkarma) | [88] |
| 22 | Unity → Tripledot (Supersonic) "doğrulanmadı" | **Artık doğrulandı:** ~40 M $ nakit, kapanış 4 Ağu 2026 | [34][112] |
| 23 | Amplitude 2 M event/ay, "Nisan 2026'da 10 M'den düşürüldü" | 2 M **doğrulandı**; düşürülme tarihi tek, orta güvenli arşiv takibi | [64][115] |
| 24 | Gelir modeli: Mahalle ARPDAU 0,012 $; Dünya 0,09 $ | **Aritmetik hata → düzeltildi:** bileşen toplamları 0,0095 $ ve 0,0685 $; Dünya brüt 162 K $ → ~123 K $; RevenueCat 540 $ → 360 $ | 6.8 |
| 25 | Apple 2.5.18 "uygunsuz reklamı bildirme özelliği zorunlu", 3.1.1 restore/kredi/oran/"XX-day Trial", 3.1.2(a) ≥ 7 gün, 1.1.1 hiciv muafiyeti | **Doğrulandı (birincil, metin birebir)** | [53] |
| 26 | Google Better Ads: 15 sn kuralı, rewarded muaf; rewarded interstitial'da "hayır" butonlu giriş ekranı | **Doğrulandı**; ek nüans: "kesen rewarded/opt-in reklam 5 sn sonra kapatılabilir olmalı" cümlesi | [55][56][123][129] |

**Sayım:** 26 iddia kontrol edildi; 7'si yanlış/yanıltıcı/aritmetik hatalı (düzeltildi), 4'ü doğrulanamadı veya zayıf (etiketlendi), 15'i doğrulandı.

### D.2 Yapılan düzeltmeler (özet)

1. **PBL takvimi** (TL;DR 7, §2.2): "PBL 8 son tarihi" → "PBL 7 son tarihi; PBL 8 → 31 Ağu 2027; hedef PBL 9".
2. **Supersonic ödemeleri** (TL;DR 9, §3.5, Açık soru 7): yarışma şartı + recoupable; Tripledot satışı doğrulandı.
3. **Gelir paylaşımı istatistikleri** (TL;DR 10, §3.5): Voyer 2025/2026 baskıları ayrıştırıldı; uydurma "medyan %70" kaldırıldı.
4. **Gelir modeli** (TL;DR 14–15, §6.8): Mahalle 1.100 $ → ~855 $/ay; Dünya 162 K $ → ~123 K $/ay (0,09 $ senaryosu ayrıca gösterildi); LTV90 0,78 $ → 0,60 $; RevenueCat 540 $ → 360 $.
5. **eCPM kaynağı** (TL;DR 4, §1.2): Yango Ads ↔ MAF düzeltmesi; Appodeal Q4 2024 bandı eklendi; TopOn casual Android 3,02 $ eklendi.
6. **Candywriter satın alma tarihi** (§3.6): 2019 → 23 Nisan 2020; ödeme yapısı eklendi.
7. **Google Play ücret yapısı** (Varsayımlar): bölgesel ayrım netleştirildi; Dünya senaryosuna IAP kesinti duyarlılığı (%15–25) eklendi.
8. **Alter Ego gelir dağılımı** (§1.1): "doğrulanamadı — pitch'te kullanma" etiketi.
9. **GameAnalytics D30**, **CAS.AI "tercihen"**, **Voodoo tarihsel bağlam**, **Amplitude tarihçesi**, **DHV 2027** notları.

### D.3 Boşluklar ve ek bulgular

#### D.3.1 Mağaza komisyonu bölgeye göre ayrışıyor — model tek oranla çalışamaz

**Bulgu.** Google Play'in Mart 2026 duyurusu: AEA/İngiltere/ABD'de 30 Haziran 2026'dan itibaren IAP hizmet ücreti yeni kurulumlarda %20, abonelikte %10, Play faturalaması kullanılırsa ayrıca %5 faturalama ücreti (toplam %25 / %15); dış ödeme bağlantısı programına girenler 1 Ekim 2026'dan itibaren işlem raporlayıp ücret ödüyor [117]. Google'ın "Service fees" yardım sayfası kalan pazarlarda (TR dahil) **eski yapının** — kayıt gerektiren ilk 1 M $/yıl için %15, üstü %30 — küresel yayılıma kadar sürdüğünü söylüyor [118]. Apple tarafında Small Business Program (%15, <1 M $/yıl, başvuru) her storefront için geçerli [84]. "İlk 1 M $ için %10" iddiası yalnızca ikincil ve birbiriyle çelişen bloglarda [85][86].

**Bu oyuna nasıl uygularız.** (1) Google Play Console'da **%15 kademesine kayıt** ve Apple SBP başvurusu lansmandan önce yapılır (ikisi de otomatik değil). (2) Gelir modeline **mağaza × bölge** matrisi eklenir: TR/diğer: %15; ABD/UK/AEA Google Play: %20+%5 (yeni kurulum), abonelik %10+%5; Apple her yerde %15. (3) Dünya senaryosunda IAP kesintisi %15 yerine %20–25 alınırsa geliştiriciye net aylık ~2–4 bin $ düşer; pitch'te "net" rakamlar bu matrisle gösterilir, publisher'ın "brüt-net karışıklığı" itirazı peşinen kapatılır. (4) Felek Kulübü aboneliği 2. faza kalırken, ABD/AEA'da abonelik kesintisinin (%10+%5) tek seferlik IAP'den (%20+%5) **10 puan düşük** olduğu not edilir — abonelik kararını yeniden tartmak için yeni bir argüman.

#### D.3.2 Play Billing takvimi 2 yıllık döngüdür — "PBL 8'e geç" yanlış hedef

**Bulgu.** Google'ın birincil tablosu [110]: PBL 7 → 31 Ağu 2026 / 1 Kas 2026 (geçti); PBL 8 → 31 Ağu 2027 / 1 Kas 2027; PBL 9 → 31 Ağu 2028 / 1 Kas 2028. PBL 9.0.0 19 May 2026, 9.1.0 18 Haz 2026'da çıktı. Eski sürümde kalan **mağazadaki uygulama çalışmaya devam eder**; kısıt yeni uygulama ve güncellemeler içindir. Google uzatma formunu Play Console "Policy status" sayfasında açıyor.

**Bu oyuna nasıl uygularız.** CI'da `./gradlew :app:dependencies | grep com.android.billingclient` çıktısını **≥ 9.x** ile karşılaştıran test; `react-native-purchases` / `expo-iap` güncellemelerinde changelog'da "billing" araması zorunlu PR kontrol listesi maddesi; her yılın **Haziran** ayında (yeni major çıktıktan sonra) "PBL yükseltme" sprint görevi takvime sabitlenir, böylece 31 Ağustos'a 2 ay pay kalır.

#### D.3.3 Türkiye eCPM için kamu verisi yok — kill kriteri yazılmalı

**Bulgu.** Appodeal'ın ilk eCPM raporu (2022 verisi) 18 ülke arasında Türkiye'yi kapsıyordu ama değerler arama özetlerine yansımıyor; Appodeal Benchmarks aracı ülke bazlı ortalama sunuyor (erişilemedi) [12][13]. Appodeal 2025 raporu yalnızca bölge düzeyinde ("Kuzey Amerika & Avrupa'da iOS, APAC & LATAM'da Android önde") konuşuyor; TopOn H1 2025 **casual Android rewarded 3,02 $ (küresel)** — TR için makul bir üst sınır göstergesi [109]. Türkçe geliştirici anlatıları ve "ülke bazlı AdMob eCPM" listeleri (ör. 0,35 $) metodolojisiz, güvenilmez. Rewarded gösterim/DAU ve opt-in oranı için **tarafsız benchmark yok**; satıcı rehberleri uygun oyuncular arasında %40–70 opt-in, TopOn casual'da rewarded gösterimlerin %21'inin gelirin %39'unu getirdiğini söylüyor [126][127].

**Bu oyuna nasıl uygularız.** (1) TR teknik soft launch'ının ilk 14 gününde AdMob ülke/format raporu modelin tek gerçek girdisi olur; Mahalle senaryosu ölçülen eCPM ile yeniden hesaplanır. (2) **Yazılı kill/iterate kuralı:** TR Android rewarded eCPM ölçümü **< 1,5 $** ise Mahalle senaryosu "gider karşılama" eşiğinin altında kalır → EN soft launch öne çekilir, TR yalnızca ton/QA pazarı olarak tutulur. (3) `ad_opportunity` / `ad_shown` olayları yerleşim bazında loglanır; "rewarded opt-in (uygun oyuncu %)" KPI tablosuna eklenir (hedef ≥ %40, satıcı bandının alt sınırı). (4) Appodeal Benchmarks aracı bir kez ücretsiz hesapla açılıp TR rewarded/interstitial değerleri bu dokümana işlenir (Açık soru 2 kapatılır).

#### D.3.4 Anlaşma pazarlığı için çapa sayılar (Voyer Law 2025/2026 + sektör kuralları)

**Bulgu.** Voyer Law 2026 (130+ sözleşme, 2017–2026): avanslı anlaşmalarda geliştirici payı ortalama %57,9 (aralık %2,5–%90), avanssızda %67,9 (en düşük %50); **medyan avans 270 K $, ortalama ~603 K $**. 2025 baskısı: avanslı ortalama %58,2, medyan %50; medyan avans 300 K $ [113][114]. Rami Ismail'in sektör notu: recoup öncesi bölüşüm publisher lehine, **recoup sonrası yaygın yapı 50/50 ± 10** [128]. Tilting Point'in "D7 %20+, D30 %8+, ARPU verisi, neredeyse bitmiş oyun" eşiği yalnızca ikincil bir benchmark blogunda; birincil sayfa bulunamadı [6]. Rollic/Udo/Fomo için kamuya açık hiçbir şart yok (doğrulandı: yok).

**Bu oyuna nasıl uygularız.** "İstemiyoruz" sayfasına **"İstiyoruz" çapaları** eklenir: avanssız anlaşmada geliştirici payı **≥ %65** (2026 ortalaması), avanslıda **≥ %50** (medyan) + recoup sonrası ≥ 50/50; UA recoup'u toplam net gelirden; MG varsa mahsup edilir ama iade edilmez (standart). Mobil hybrid-casual publisher'larında (Supersonic/Tripledot, Homa, Kwalee) "test ödemesi" varsa **recoupable mı?** sorusu ilk görüşmede sorulur; 2024 yarışma şartları recoupable idi. Hedef publisher listesinden Tilting Point tipi "neredeyse bitmiş + ARPU kanıtı" isteyenler **Faz 2 sonrasına** alınır.

#### D.3.5 Apple Türkiye fiyatlandırması: otomatik dönüşüm ~50 ₺/$ — Torpil'in ₺199,99'u bilinçli %40+ PPP indirimi

**Bulgu.** Geliştirici kaynakları Apple'ın otomatik dönüşümünde 19,99 $ baz fiyatın TR'de **₺999,99** olduğunu gösteriyor (KDV dahil, ≈ 50 ₺/$) [125][82]; Apple 10 $'a kadar 0,10 $ artışlı fiyat noktaları kullanıyor; manuel ayarlanan storefront'larda otomatik kur güncellemesi uygulanmıyor [125]. 0,99 $ ve 6,99 $'ın güncel ₺ karşılığı için kamuya açık tablo bulunamadı; App Store Connect "Pricing and Availability" tek kaynak. DHV 2027'de %2,5'e inerse Apple TR hakedişleri bir kez daha yukarı güncellenir [116].

**Bu oyuna nasıl uygularız.** (1) Torpil 6,99 $ → otomatik dönüşümde ≈ ₺349,99 olurdu; bizim ₺199,99 (≈ 4,00–4,45 $) **~%43 satın alma gücü indirimi** demek — bu, Reklam Kurulu'na karşı da savunulabilir bir "yerel fiyatlama" (indirim değil, baz fiyat), fiyat ekranında "indirim" dili kullanılmaz. (2) Tüm TR fiyatları **manuel** girilir ve kur güncellemeleri yılda 2 kez elle yapılır; otomatik kur ile ürünlerin bir kısmının ₺ fiyatı sessizce değişmesi (aynı ekranda tutarsız fiyatlar) engellenir. (3) Google Play'de aynı ₺ fiyatlar elle girilir; iki mağazada ₺ fiyatı farklıysa Reklam Kurulu şikâyeti riski ("aynı ürün farklı fiyat") avukatla teyit edilir (T9). (4) Fiyat A/B testi (5,99/6,99/7,99 $) RevenueCat Experiments ücretli katmanda kalırsa, **storefront bazlı** test (ör. CA 6,99 $ vs AU 5,99 $ eşdeğeri) ve kendi uzak konfigürasyonumuzla "hangi paywall metni" testi yapılır; fiyat testini mağazanın kendi fiyat deneyi araçlarıyla yapma seçeneği Açık soru 5'e eklenir.

#### D.3.6 IARC anketi için içerik kota tablosundan türetilmiş taslak cevaplar (brief'in istediği, dokümanda eksikti)

**Not:** Aşağıdaki cevaplar oyunun T9 içerik kurallarından türetilmiş **taslaktır**; anket metni Play Console'da görüldüğü anda birebir yeniden okunur (anket soruları/formülasyonu zamanla değişiyor) ve Apple anketiyle **aynı tablodan** doldurulur (bkz. §4 "Bu oyuna nasıl uygularız" madde 4).

| IARC alanı | Taslak cevap | Gerekçe / kota |
|---|---|---|
| Şiddet | Yok ya da yalnızca **metinsel, gerçekçi olmayan, sonuçlu** (kaza, hastalık, kavga sonucu stat düşüşü); kan/gore yok; insanlara yönelik ayrıntılı şiddet tasviri yok | Ölüm "olay" olarak var, görsel/ayrıntılı şiddet yok (T1/T3) |
| Dil | Kaba mizah **sık**, küfür **sansürlü/ima** | Apple 13+ ile tutarlı |
| Kontrollü maddeler | Alkol/tütün/uyuşturucu **referansı var, kullanım tasviri/özendirme yok**; ömür başına < %5 storylet; marka yok | Apple 13+ (seyrek referans), PEGI 16 (Drugs tanımlayıcısı), TCK 190/4250/4207 (T9) |
| Cinsellik | **İma düzeyi** ("kapı kapalı"), çıplaklık yok | Apple 16+ "sık olgun tema" ile tutarlı |
| Kumar | Simüle kumar **yok**; şans anlatı olayı; paralı rastgele kutu yok | Apple/PEGI/Belçika-Hollanda riski sıfır (T1) |
| Korku | Kara mizah, "karanlık tema" **sık** | Apple 13+ |
| Ayrımcılık / nefret | Yok | T9 kırmızı çizgi |
| Etkileşimli öğeler | **Dijital satın alma var**; kullanıcılar arası etkileşim **yok**; konum paylaşımı **yok**; kısıtsız internet **yok**; paylaşım kartı cihaz dışı paylaşım = kullanıcı tarafından tetiklenen dışa aktarma | Backend yok, sosyal özellik yok (T1) |

**Beklenen çıktı:** PEGI 16 / ESRB T / USK 12–16 / Generic 16+ (Apple 16+ ile uyumlu). **Bu oyuna nasıl uygularız:** Bu tablo `docs/compliance/rating-answers.md` olarak kodlanır; her içerik PR'ında "kota tablosunu değiştiriyor mu?" kontrol listesi maddesi; derece değişikliği gerektiren içerik (ör. kullanım tasviri) **merge edilmez**. T9'un 18+ önerisiyle çelişki (Açık soru 1) bu tabloyla avukata götürülür: 16+ ile 7578/BTK yükümlülüğü karşılanıyorsa 16+ kalır; karşılanmıyorsa tablo 18+ için yeniden işaretlenir ve UA etkisi ölçülür.

### D.4 Kalite notu

Doküman yapısal olarak brief'in tüm başlıklarını kapsıyor ve kararları açık; zayıf noktaları (i) birincil kaynaklara erişimsizliğin yarattığı **ikincil kaynak yoğunluğu**, (ii) gelir modelinde düzeltilen **aritmetik hatalar**, (iii) birkaç sayının **farklı rapor baskılarının karıştırılmasıyla** üretilmiş olması, (iv) Türkiye eCPM ve TR publisher şartları gibi **doğrulanamayan ama kararları etkileyen** boşluklar. Lansman öncesi Açık sorular 2, 3, 4, 5 birincil kaynakla (Appodeal Benchmarks, Play Console ücret sayfası, App Store Connect fiyat tablosu, RevenueCat fiyat sayfası) kapatılmadan bu dokümandaki ₺/$ rakamları publisher'a **"tahmin"** etiketiyle sunulmalı.
