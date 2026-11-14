# T2 — Rakip ve Pazar Analizi: BitLife, Alter Ego, Reigns, Hayat Simülasyonu Pazarı ve Publisher Manzarası

**Proje:** Backend'siz, offline-first, Türkçe-öncelikli mobil hayat simülasyonu (18 yaşından ölüme). Ton: kara mizah + roast + gizli motivasyon.
**Doküman amacı:** Rakipleri parçalarına ayırmak, pazarın gerçek büyüklüğünü ve trendlerini görmek, bizim boşluğumuzu (white space) netleştirmek, publisher seçeneklerini ve Türkiye'ye özel gerçekleri masaya koymak.
**Tarih:** Kasım 2026. **Yazar:** Araştırma ajanı (T2).

---

## TL;DR (13 madde)

1. **BitLife tek başına kategoriyi tanımlıyor ve hâlâ para basıyor:** 2019'da ~26 M$ gelir, %59 EBIT marjı, 1,2 M DAU / 7,8 M MAU ve **13 kişilik ekip** [1][2]. 2025'te ABD'de haftalık gelir zirvesi ~497 K$, haftalık aktif 1–1,4 M [3]; üçüncü taraf tahminleri ~1 M$/ay, 130 M+ indirme ve 136 M$+ IAP ömür boyu [4][5]. Yani **metin tabanlı, grafiksiz bir oyun** 8 yıldır üst ligde: bizim format riskli değil, kanıtlı.
2. **BitLife'ın zayıf karnı belli:** agresif interstitial (tahmini ~90 K$/gün reklam geliri) [5], "reklamsız satın aldım yine reklam görüyorum" şikâyetleri, eskiden ücretsiz olan özelliklerin paywall'a çekilmesi, karanlık mod bile paralı, reklam sırasında donma [6][7]. **Mizah ise yüzeysel ve İngilizce-merkezli.** Bizim boşluğumuz tam burası: ton + adil monetizasyon + yerel dil.
3. **Alter Ego (Japonya, Caramel Column)** 5 M indirmeyi [8] neredeyse sıfır pazarlamayla, "kendini keşfet" vaadi ve idle-clicker iskeletiyle aldı; 4,9 ★ (13,7 K değerlendirme) [9]. Ders: **içe dönük/psikolojik vaat + minimal sanat + idle geri dönüş kancası** solo geliştirici için ölçeklenebilir.
4. **Reigns (Nerial/Devolver)** 2 M+ kopya sattı (~%50 iOS, %30 Android, %20 Steam) [10][11]; ama premium model ve lisans bağımlılığı sürdürülemedi: Devolver 2024'te Nerial'in %40'ını işten çıkardı, stüdyo **1 Ekim 2026'da kapandı** [12][13]. Ders: **swipe + absürt sonuç mekaniği harika, premium tek seferlik satış mobilde ölümcül.**
5. **Pazar:** Mobil oyun IAP geliri 2025'te 82 Mr$ (+%1), indirmeler ~50 Mr (−%7) [14]. Simülasyon türü 2024'te 6,1 Mr$ IAP ile #5 tür ve indirmelerin %20'si [15]. **Hybrid-casual tek büyüyen segment:** ~4,2 Mr$ IAP, +%20–37 [16]. Narrative/interactive story alt türü (Choices ~544 M$ ömür boyu [17]) kanıtlı bir "bölüm başı reklam + elmas" modeli sunuyor.
6. **Publisher'ların dili KPI:** Voodoo hybrid-casual için D1 %45, D7 %15 (puzzle %20), D30 %10 ve düşük CPI istiyor [18][19]; Tilting Point D7 %20+, D30 %8+ [20]. Sektör genel: paid UA Tier-1'de D7 ~%18'de çalışmaya başlıyor; hybrid-casual CPI 2025'te 0,95 $'a (Android, global) çıktı [21][22]. **Hedefimiz soft-launch'ta D1 ≥ %40, D7 ≥ %18, D30 ≥ %8, oturum/gün ≥ 3, günlük süre ≥ 20 dk.**
7. **Türk publisher'ların çoğu artık yayıncı değil, birinci parti dev:** Dream (1,7 Mr$ 2025), Peak (620 M$), Rollic (207 M$) [23]. Üçüncü parti oyun alan TR kapıları: **Rollic (form), Udo Games, Alictus/Clown Games, Fomo, Fugo, Good Job Games (dönemsel)** [24][25][26]. Hayat simülasyonu/narrative için TR'de **doğal bir publisher yok**; bu hem risk hem fırsat (ilk olmak).
8. **Global uyumlu publisher'lar:** Netflix narrative'e yatırım yapıyor ama üçüncü parti indie'leri kesiyor ve abonelik gerektiriyor [27]; Devolver premium mobil port'a dönüyor [28]; hybrid-casual yayıncıları (Supersonic, Homa, Kwalee, Crazy Labs, Azur) başvuru portalı + KPI testi ile çalışıyor [29][30][31]. **En gerçekçi yol: TR soft-launch → KPI kanıtı → hybrid-casual publisher ya da self-publish + ad network destekli büyüme.**
9. **Türkiye pazarı:** 2025'te ~1 Mr$ (+%25), 50 M aktif oyuncu, %46 kadın [32]; Adjust TR H1 2025 ortalama retention **D1 %19, D7 %5, D30 %1** [33] — yani TR'de bizim hedef KPI'larımız ortalamanın 2–3 katı olmak zorunda. ABD rewarded eCPM 13 $ civarı [34], TR için güvenilir kamu verisi yok; sektör tahmini 2–6 $ bandı (doğrulanmadı). **TR'de reklam geliri düşük, IAP dönüşümü düşük, ama organik viral potansiyeli (TikTok/Reels) yüksek.**
10. **"Kara mizah + motivasyon" kredibilitesi var:** Carrot (10 yıllık sarkastik persona, tahmini ~200 K$/ay) [35], Duolingo (52,7 M DAU, DAU/MAU %39,6; 5–10 M kullanıcı 365+ gün streak) [36][37], Finch (bootstrapped, ~1 M$/ay, "en iyi D30 retention" iddiası) [38][39], Dumb Ways to Die (TikTok trendiyle 100 M+ indirme) [40]. Hiçbiri "hayat simülasyonu" değil; **bu tonu sistemik bir hayat simülasyonuyla birleştiren oyun yok.**
11. **USP önerisi:** *"Seni ölene kadar trolleyen, öldükten sonra ayağa kaldıran anlatıcı."* Her ömür sonunda **Roast Raporu** (ölüm sonrası analiz: alay + içgörü + bir sonraki hayata taşınan "miras" + opsiyonel gerçek hayat mikro-görevi). Kimse bunu yapmıyor.
12. **Monetizasyon modeli:** BitLife'ın "tek seferlik Bitizenship" (reklamsız + premium içerik) + aylık tematik paketler modeli kanıtlı; biz buna **rewarded video ağırlık** (interstitial az) + **sezonluk "hayat paketleri"** + **tek seferlik "Ölümsüz Üyelik"** ile gideriz; abonelik ikinci faz.
13. **En büyük açık risk:** Türkçe mizah ihracı. İngilizce lokalizasyon "çeviri" değil "yeniden yazım" olmalı; metrik kanıtı TR'de toplayıp publisher'a "tone-agnostic KPI" sunmak gerekiyor.

---

## Varsayımlar ve veri notu

- **Veri erişimi:** Bu doküman web arama sonuçlarından (Sensor Tower blog özetleri, Stillfront basın bültenleri, SEC 10-K, AppMagic/Udonis/Adjust özetleri, haber siteleri) derlendi. Araştırma ortamında doğrudan sayfa çekme (fetch) engellendi; bu yüzden bazı sayılar üçüncü taraf özetlerinden alındı ve **"tahmin"** olarak işaretlendi. Aynı metrik için çelişen kaynaklar varsa ikisi de verildi.
- **"Sektör bilgisi (doğrulanmadı)"** etiketli maddeler: ürün gözlemi ya da 2024–25 sektör bilgisine dayanır; sprint öncesi doğrulanmalı.
- **Proje varsayımları:** Solo dev + AI ajanları; sanat bütçesi düşük (vektör/UI ağırlıklı, karakter illüstrasyonu minimal); backend yok, dolayısıyla LiveOps "içerik paketi + zaman tabanlı yerel tetikleyici" ile yapılır; ilk pazar Türkiye, ikinci dalga İngilizce (ABD/İngiltere/Kanada/Avustralya), üçüncü dalga Brezilya/Almanya.
- **Hedef cihazlar:** Android ağırlıklı TR, iOS ağırlıklı gelir (Tier-1).
- **Para birimi:** USD; TR fiyatları için PPP düzeltmesi ayrı dokümanda (T6/T7 ekonomi).

---

## 1) Doğrudan rakipler: derin teardown

### 1.1 BitLife (Candywriter, Miami → Stillfront)

**Tarihçe.** Candywriter, Miami merkezli; şirket kendi sayfasında 2006 kuruluş, BitLife sitesinde 2014 kuruluş yazıyor [41][42]. BitLife Eylül 2018'de iOS'ta, Şubat 2019'da Android'de çıktı; 2019'da iOS'ta en çok indirilen 5 oyundan biri oldu; şirket "sıfır reklam bütçesiyle #1'e çıktık" diyor (kendi beyanı) [1][41]. Stillfront, Nisan 2020'de Candywriter'ı satın aldı: peşin ~74 M$ + earn-out ile toplam 195 M$'a kadar [1][2]. Satın alma anında: **FY2019 gelir ~26 M$, EBIT marjı ~%59, 1,2 M DAU, 7,8 M MAU, 13 tam zamanlı çalışan, BitLife bookings'in ~%85'i** [2]. 2021'de BitLife iki çeyrek üst üste organik +%30 büyüdü [43]. Stillfront'un Goodgame Studios'u Almanca versiyon için ayrı bir ortaklık kurdu (lokalizasyonun "ayrı ürün" gibi ele alındığının göstergesi) [44]. Grup düzeyinde Stillfront 2025'te 5.710 MSEK ile organik −%10 geriledi [45]; BitLife özelinde kamuya açık 2022–25 kırılımı yok.

**Güncel performans (tahminler).** Sensor Tower ABD Q2 2025: haftalık gelir zirvesi ~497 K$ (Haziran ortası), haftalık indirme zirvesi 94 K, haftalık aktif 1–1,4 M [3]. İngiltere Q3 2024: haftalık gelir ~63 K$, aktif ~190–206 K [46]. Apprank: ~1,0 M$/ay, ~12 M$/yıl, ~300 K indirme/ay (Ağu 2026) [4]. Gamigion: **130 M+ indirme, 136 M$+ ömür boyu IAP; interstitial'ler tek başına ~90 K$/gün** (tahmin) [5]. Puanlar: App Store 4,8 ★ (1,8 M), Google Play 4,4 ★ (1,29 M) [7].

**Çekirdek döngü (ürün gözlemi).** Doğ → her "Yaş +1" dokunuşunda bir yıl geçer → rastgele olaylar/yes-no kararları → okul/iş/ilişki/suç/sağlık menülerinde aktif seçimler → 4 bar (Mutluluk, Sağlık, Zekâ, Görünüş) → ölüm → **ribbon** (ömür etiketi: "Akademisyen", "Deli", "Zengin"…) → yeni hayat / soy devam. Bir ömür 10–25 dk; tek dokunuşla yıl atlama sayesinde "bir yıl daha" döngüsü çok kısa ve bağımlılık yapıcı.

**Retention/LiveOps (ürün gözlemi, sektör bilgisi).** Haftalık **Challenge** (4–5 koşullu görev, kozmetik ödül), aylık tematik **içerik paketleri** (meslek/suç/ünlü paketleri; 2,99–4,99 $), ribbon koleksiyonu, soy (legacy) sistemi, "Time Machine" ile ölümden geri dönme (IAP). Backend ihtiyacı neredeyse yok: challenge'lar yerel takvimle tetiklenir.

**Monetizasyon (ürün gözlemi + kaynak).** Tek seferlik **Bitizenship** (reklamsız + kilitli özellikler), **God Mode** (stat düzenleme), **Boss Mode** (iş sahibi olma, ABD'de 20,99 $) [7], paketler, Time Machine; artı yoğun interstitial [5]. Kullanıcı şikâyetleri: "Bitizenship aldım yine reklam görüyorum", "karanlık mod paralı", "eskiden ücretsizdi", "reklamda app donuyor" [6][7].

**Neden çalıştı.** (a) Sıfır sanat bütçesiyle "her oyuncunun kafasında farklı film" etkisi; (b) ekstrem sonuçlar (hapis, kumar, kaçamak) → paylaşılabilir ekran görüntüleri; (c) 2018–19'da TikTok/YouTube "challenge" içerik dalgası; (d) yılda bir dokunuş = mükemmel mobil mikro-oturum; (e) sürekli paket ekleyerek "bitmeyen" hissi.

**Oyuncuların nefret ettiği.** Reklam yoğunluğu, kayan paywall, tekrar eden olay metinleri (yüzlerce saat sonra aynı cümleler), sığ mizah, "bir süre sonra hep aynı hayat", lokalizasyon kalitesizliği (çeviri gibi hissettiren metin).

**Karşılanmamış ihtiyaç.** Karakterli bir **anlatıcı**, oyuncuya geri dönen **anlam** (ne öğrendim?), adil monetizasyon, yerel kültürle yazılmış olaylar.

### 1.2 ALTER EGO (Caramel Column, Japonya)

- **Sayılar:** 1 M indirme (Mart 2020), 2 M (Mayıs 2021, Switch duyurusu), **5 M (Kasım 2025)** [8][47][48]. Spin-off ALTER EGO COMPLEX (Haziran 2020). App Store 4,9 ★ (~13,7 K) [9].
- **Döngü:** "Fısıltılara dokun → EGO topla → EGO ile hikâyeyi ilerlet → kişilik testleri çöz → Es karakteriyle diyalog → çoklu son" [9]. Idle/clicker iskeleti: EGO sen yokken de birikir, geri dönüş kancası otomatik.
- **Monetizasyon:** Reklam + "reklam kaldır" IAP + EGO paketleri + kozmetik "Fetishism" öğeleri (9,99–12,99 $) [9]. Hafif, saygılı; puanları yüksek tutan tam da bu.
- **Sanat:** Tek illüstratör düzeyinde, siyah-beyaz, edebi alıntılar (Kafka, Dostoyevski). Sanat bütçesi düşük, estetik tutarlılık yüksek.
- **Neden çalıştı:** "Kendini keşfet" vaadi + Japon minimalizmi + psikoloji testlerinin paylaşılabilirliği (sonuç kartı → Twitter).
- **Nefret edilen:** Kısa içerik (bir hafta sonunda biter), tekrar oynanabilirlik düşük, idle'ın sığlığı.
- **Bize ders:** *Kişilik testi/sonuç kartı* paylaşım makinesi. Bizim "Roast Raporu" aynı işlevi görür ama komik olur.

### 1.3 Reigns serisi (Nerial / Devolver)

- **Sayılar:** 600 K satış (erken dönem, "premium mobilin poster çocuğu") [49]; 2 M+ kopya (Ağustos 2019'a kadar), ~%50 iOS, %30 Android, %20 Steam [10][11]. Gelir tahminleri çelişkili: 6,2 M$ vs 20 M$+ [11]. Steam-only ~741 K kopya (steamdata.ai) [50]. Seri: Her Majesty (2017), Game of Thrones (2018, HBO lisansı), Beyond (Apple Arcade), Three Kingdoms (Netflix). Devolver 2021'de Nerial'i satın aldı; 2024 raporunda son çıkışlardaki "sorunlar" nedeniyle %40 işten çıkarma; **1 Ekim 2026 ortak açıklamayla stüdyo kapandı (~8 kişi)** [12][13].
- **Döngü:** Sol/sağ swipe → 4 kaynak (Kilise, Halk, Ordu, Hazine) → herhangi biri 0 veya 100 olunca ölüm → yeni kral → yıl sayacı skor. Bir "saltanat" 3–10 dk. Absürt, kuru İngiliz mizahı; ölüm nedenleri komik.
- **Monetizasyon:** Premium 2,99 $ (sonra platform abonelikleri). Mobilde premium: **tavan düşük, LiveOps yok, kuyruk geliri yok.** Nerial'in kapanışı bunun en net kanıtı.
- **Nefret edilen:** Rastgelelik hissi, kart havuzunun erken tükenmesi, "ne yaptığımı anlamıyorum" (karar → sonuç bağının belirsizliği).
- **Bize ders:** Swipe karar UI'ı (hız + dokunsal tatmin) alınır; ama her kararın sonucunu **anlatıcı sesli** açıklayarak "anlamsız rastgelelik" şikâyetini kapatırız; model F2P + hybrid.

### 1.4 InstLife ve BitLife klonları

- **InstLife:** Metin tabanlı, grafiksiz, 17+; Google Play'de 18 ay kaldı, Eylül 2019'da kaldırıldı; **7,1 M kurulum, 4,5 ★ (35 K)**; oyuncular "BitLife'ın atası" diyor; oturumlar ~5 dk [51][52]. Yani BitLife'tan önce de talep vardı; içerik güncellemesi ve monetizasyon olmadan söndü.
- **Life Simulator / LifeSim / "Life Choices" vb. klonlar (sektör gözlemi):** Çoğu Android-ağırlıklı, reklamla boğulmuş, düşük üretim kalitesi; BitLife'ın arama trafiğinden besleniyorlar. Hiçbirinin belirgin tonu/karakteri yok. **Türkçe kaliteli bir hayat simülasyonu yok** (TR App Store'da BitLife'ın Türkçe çevirisi var, yerel içerik yok).

### 1.5 Mikro-anlatı deneyleri: Lapse, Seedship, Spent

- **Seedship (John Ayliff):** Twine ile yapılmış ücretsiz metin stratejisi; prosedürel gezegenler; mobil mağazada 4,8 ★ (~16 K) tahmini; 2025'te hâlâ HN'de konuşuluyor; devamı Beyond the Chiron Gate [53][54]. Ders: **sıfır sanat + prosedürel sistem + kısa koşu (10 dk) = kalıcı kült takipçi**, ama para yok.
- **Lapse: A Forgotten Future (Cornago Stefano) — sektör bilgisi, doğrulanmadı:** Reigns'in post-apokaliptik klonu; reklam destekli; dikkat çekici bulgu: Reigns formülünün "lisanssız" ve küçük ekiple kopyalanabildiğini kanıtladı.
- **Spent (McKinney / Urban Ministries of Durham, 2011) — sektör bilgisi, doğrulanmadı:** Tarayıcı tabanlı yoksulluk simülasyonu; "ay sonunu getirebilir misin?" sorusu; milyonlarca oynanış. Ders: **gerçek hayat parası/kira/sağlık kararları zaten dramatik**; biz buna mizah ekleyeceğiz.

### 1.6 Choices (Pixelberry) ve Episode (Pocket Gems): narrative monetizasyonu

- Choices: ömür boyu ~544 M$ ve 100 M+ indirme (PocketGamer 2024) vs Udonis'in daha dar ölçümü 32,7 M indirme / 175 M$ [17][55]. Sensor Tower ABD iOS Q2 2024 haftalık gelir 113–232 K$ [56]. Nexon 2017'de aldı; 2024'te Series Entertainment'a geçtiği tek kaynakta yazıyor (doğrulanmalı) [17].
- **Model:** Bölüm başında 30 sn reklam; iki para birimi (**anahtar** = zaman kapısı, **elmas** = premium seçenekler); rewarded video ile günde birkaç elmas; markalı sponsorluklar [17][55].
- **Nefret edilen:** "Elmas yoksa iyi seçenek yok" (pay-to-feel), bekleme süreleri, FOMO.
- **Bize ders:** Zaman kapısı (anahtar) bizde **yok** — backend'siz, adil olmalı. Ama "premium seçenek" fikri **mizahi** biçimde kullanılabilir: "Bu seçenek için 3 elmas… ya da yoksulluğunu kabullen" (oyuncu reklam izleyerek de açabilmeli; policy-safe).

### 1.7 The Sims Mobile ve Kim Kardashian: Hollywood (lifestyle devleri)

- **The Sims Mobile:** 2018 çıkış, 3 stüdyo, 50+ güncelleme; EA Ekim 2025'te kapanışı duyurdu, **20 Ocak 2026** sunucular kapandı, IAP hemen durduruldu; Project Rene'ye kaynak kaydırma [57][58]. Resmî gelir yok. Ders: **sunucu bağımlı lifestyle oyunlar maliyet yükü altında ölüyor; bizim offline-first yaklaşımımız "sonsuz raf ömrü" avantajı** (publisher'a satış argümanı).
- **Kim K: Hollywood:** 24 Haziran 2014 çıkış; ilk 2 yılda 145 M indirme, 160 M$ [59]; ömür boyu 600 M$+ tahmini (doğrulanmadı) [60]; COVID'de aylık IAP ~6 M$'a fırladı (Nisan 2020), EA'nın Glu'yu almasından (Nisan 2021) sonra sürekli düşüş; lisans sona erince **8 Nisan 2024'te kapandı** [60][61]. Ders: (a) "statü/yükseliş fantezisi" + enerji sistemi + VIP etkinlikleri 10 yıl taşıdı; (b) **lisansa bağımlı IP = son kullanma tarihi**; bizim persona kendi IP'miz.

### 1.8 Dumb Ways to Die (Metro Trains → PlaySide)

- Ortalama ~20 K indirme/gün giden 10 yıllık oyun, **2023 başında TikTok trendiyle listelerin tepesine çıkıp 100 M+ ömür boyu indirmeyi geçti**; katalog toplamı 360 M+ [40][62]. PlaySide FY25: gelir 48,7 M A$ (−%25), orijinal IP −%45 (16,7 M A$) — büyük DWTD lisans projesi olmayınca düştü; Dumb Ways to Build PC'de ~1 M$ brüt [63].
- Ders: **"komik ölüm" evrensel bir paylaşım para birimi.** Ölümler bizim oyunda da kısa, animasyonlu, paylaşılabilir kartlar olmalı (sticker/ekran görüntüsü). Marka geliri ise dalgalı: tek başına IP'ye yaslanma.

### 1.9 Mizahlı text/idle: A Dark Room, Candy Box, AdVenture Capitalist

- **A Dark Room (Amir Rajan):** 2 yılda **697 K$ brüt**, 2,26 M indirme (1,02 M'si bir haftalık ücretsiz kampanyada), Kas 2014–Eki 2015 arası 202 K ücretli kopya; sonrası ~7,5 K$/ay kuyruk [64][65][66]. Solo dev, sıfır sanat, premium. Ders: **metin tabanlı mobil oyun App Store #1 olabilir; ama premium kuyruk kısa.**
- **AdVenture Capitalist (Hyper Hippo):** 50 M indirme; Ekim 2018'e kadar 20 M$+ gelir, Eyl 2018'de ~407 K$/ay [67][68]. Ders: **idle + sürekli sayısal ilerleme + 2 dakikalık check-in** ile yıllarca gelir; "kapitalizm parodisi" tonu geniş kitleye ulaştı.
- **Candy Box (aniwey, 2013) — sektör bilgisi:** ASCII tarayıcı idle; sürprizli açılımlar viral oldu. Ders: **"ne olacak acaba?" merakı** tek başına retention mekaniği.

### 1.10 Persona'lı motivasyon uygulamaları (bizim ton akrabalarımız)

| Uygulama | Persona/ton | Kanıt | Retention kancası | Bize ders |
|---|---|---|---|---|
| **CARROT Weather/Fit** (Brian Mueller, solo) | İnsanlıktan nefret eden sarkastik yapay zekâ; mizah seviyesi ayarlanabilir | 10+ yıl, Apple editör ödülleri, tahmini ~200 K$/ay (aggregator, doğrulanmadı) [35][69] | Her açılışta yeni laf, gizli konumlar/başarımlar, "Premium Club" abonelik | **Fayda + persona** formülü abonelik taşıyor; mizah "ayar" olarak sunulunca kimse rahatsız olmuyor |
| **Duolingo** | Suçluluk hissi veren baykuş (Duo), meme'leşmiş bildirimler | FY2025 10-K: **52,7 M DAU (+%30), DAU/MAU %39,6** [36]; 5 M+ (başka kaynak 10 M+) kullanıcı 365+ gün streak [37][70] | Streak + streak freeze, lig, widget, bildirim persona'sı | **Streak'i kaybetme korkusu + sevimli-tehditkâr maskot**; biz "anlatıcı dırdırı" ile aynı etkiyi yaparız ama alaycı |
| **Finch** (self-care kuş) | Şefkatli, yargılamayan | Bootstrapped; Sensor Tower ~380 K$/ay (Haz 2025) → ~1 M$/ay (Haz 2026), ~12 M$ ömür boyu; 5 M indirme, 44 kişi [38][39][71] | Günlük check-in'le kuş büyür, **streak cezası yok** ("kind streak"), yolculuk | **Şefkat de retention getiriyor**; bizim roast'ın altındaki "seni önemsiyorum" katmanı Finch'ten |
| **Habitica** | RPG görev listesi | "4 M+ kullanıcı" (doğrulanmamış), Android ~190 K MAU tahmini [72] | Parti baskısı, boss savaşı, HP kaybı | Sosyal baskı backend ister; bizde **yerel "hayalet rakip"/anlatıcı baskısı** ile ikame |

**Bu oyuna nasıl uygularız (Bölüm 1):**
- BitLife'tan: "Yaş +1" tek-dokunuş turn yapısı, 4 bar, ribbon koleksiyonu, haftalık challenge, aylık içerik paketi kadansı → **aynen alınır, backend'siz yerel takvimle.**
- Reigns'ten: swipe karar UI'ı ve komik ölüm nedenleri → **ama her sonucu anlatıcı yorumlar** ("Sol kaydırdın. Tebrikler, kiranı ödeyemedin.").
- Alter Ego'dan: idle birikim (bizde "arka planda hayat akar: sen yokken 3 ay geçti, anlatıcı özet geçer") ve paylaşılabilir **sonuç kartı**.
- Choices'tan: bölüm/sezon hissi ve rewarded video ile açılan "premium seçenek"; **zaman kapısı yok.**
- Carrot/Duolingo/Finch'ten: persona ayarı (hafif-acımasız), bildirim persona'sı, **cezasız streak** ("Dün gelmedin. Hayat seni bekledi. Şaka. Beklemedi. Ama buradayım.").
- Dumb Ways/Kim K'dan: paylaşılabilir ölüm kartları; lisanssız kendi IP.

---

## 2) Karşılaştırma tablosu, şikâyet temaları ve boşluklar

### 2.1 Karşılaştırma

| Oyun | Çekirdek döngü | Oturum | Retention mekanikleri | Monetizasyon | İçerik hacmi | Sanat bütçesi | Ekip | Neden çalıştı | Nefret edilen |
|---|---|---|---|---|---|---|---|---|---|
| BitLife | Yıl atla → olay → karar → stat | 10–25 dk/ömür, 3–6 oturum/gün (gözlem) | Haftalık challenge, aylık paket, ribbon, soy, Time Machine | Interstitial ağır + Bitizenship + Boss/God Mode + paketler | Binlerce olay, 100+ meslek, onlarca paket | Çok düşük (UI + emoji) | 13 (2019) [2] | Mikro-turn + ekstrem sonuç + sıfır sanat | Reklam, kayan paywall, tekrar, sığ mizah [6][7] |
| Alter Ego | Tap → EGO → hikâye/test | 5–10 dk, idle dönüş | Idle birikim, kişilik testleri, çoklu son | Reklam + reklam kaldır + EGO + kozmetik [9] | 1 haftalık kampanya | Düşük (tek illüstratör) | ~2–5 (tahmin) | "Kendini keşfet" + estetik | Kısa, tekrar yok |
| Reigns | Swipe → 4 kaynak dengesi | 3–10 dk/saltanat | Kart açılımı, hedefler, ölüm = yeni kral | Premium 2,99 $ | 700–1000 kart (gözlem) | Orta-düşük (stil güçlü) | 2 kurucu + küçük ekip; kapandı 2026 [12] | Dokunsal karar + absürt mizah | Rastgelelik, karar-sonuç belirsizliği |
| InstLife | BitLife ile aynı, daha ham | ~5 dk | Yok | Reklam | Orta | Sıfır | 1–2 | İlk olmak | Güncelleme yok, kaldırıldı [51] |
| Seedship | Prosedürel koloni metni | 10 dk/koşu | "Bir daha" merakı | Ücretsiz | Küçük ama prosedürel | Sıfır | 1 | Sistem derinliği | Para yok |
| Choices/Episode | Bölüm oku → seçim → elmas | 10–20 dk/bölüm | Anahtar zaman kapısı, yeni bölüm takvimi, FOMO | Bölüm başı reklam + elmas + anahtar [17] | Yüzlerce kitap | Yüksek (karakter sanatı, kıyafet) | 100+ | Romantik fantezi + sürekli içerik | Pay-to-feel, bekleme |
| Sims Mobile | Ev/Sim yönet, etkinlik | 15–30 dk | Enerji, günlük görev, sezon | IAP + reklam | Devasa | Çok yüksek | Yüzlerce | Marka | Sunucu kapandı 2026 [57] |
| Kim K Hollywood | Statü tırman, etkinlik | 10–20 dk | Enerji, VIP etkinlik, haftalık | IAP (elmas/enerji) | Büyük | Yüksek | 50+ | Ünlü fantezisi, LiveOps | Lisans bitti, kapandı [60] |
| Dumb Ways to Die | Mini-oyun refleks | 2–5 dk | Karakter koleksiyonu, skor | Reklam + IAP | Orta | Orta (karakter IP) | 20–40 | Komik ölüm viral [40] | Sığ |
| A Dark Room | Metin idle/keşif | 5–15 dk | Açılım merakı | Premium 1,99–2,99 $ | Sabit | Sıfır | 1–2 | Gizem + minimalizm | Bir kere biter [64] |
| AdVenture Capitalist | Idle para | 1–3 dk sık | Çevrimdışı kazanç, prestige | IAP + rewarded | Sürekli | Düşük | 10–20 | Sayı büyüsü | Sonunda boş |
| Carrot Weather | Hava + laf | 30 sn | Persona yeniliği, başarımlar | Abonelik | Sürekli yazı | Orta (ikonlar) | 1 (+freelance) | Persona | Fiyat |
| Duolingo | Ders + streak | 5–15 dk | Streak, lig, bildirim | Abonelik + reklam | Devasa | Yüksek | 900+ | Oyunlaştırma disiplini | Streak baskısı, "reklam cehennemi" (ücretsiz) |
| Finch | Günlük check-in | 2–5 dk | Pet büyür, cezasız streak | Abonelik | Orta | Orta | 44 [71] | Şefkat + pet | Abonelik fiyatı |

### 2.2 Review madenciliğinden tema kümeleri (BitLife ve klonları, TR + EN mağaza; nitel)

1. **Reklam yorgunluğu** ("her iki tıklamada reklam") — en sık 1 yıldız nedeni [5][6].
2. **Vaat edilen reklamsızlık ihlali** — ödeme sonrası reklam/paywall → güven kaybı [6].
3. **Tekrar eden metin** — "100. hayatta aynı 50 cümle" → içerik yorgunluğu.
4. **Anlamsız rastgelelik** — "neden öldüm?" (Reigns'te de) → neden-sonuç şeffaflığı isteği.
5. **Lokalizasyon** — makine çevirisi gibi Türkçe; mizah çevrilemiyor.
6. **"Sonra ne?" boşluğu** — ömür biter, anlam/kalıcı ilerleme az.
7. **Karanlık/cinsel/şiddet içeriği** ergen oyuncu ebeveyn şikâyetleri (17+ etiket) [7].

### 2.3 Karşılanmamış ihtiyaçlar (boşluklar)

- **Karakter sahibi anlatıcı** (hiçbir hayat simülasyonunda yok).
- **Türkçe yazılmış, yerel kültür referanslı olaylar** (askerlik, KPSS, kira zammı, "ev alır mıyım" hesabı, bayram ziyareti, dolar kuru).
- **Ömür sonrası anlam katmanı** (öğrenilen şey, miras, bir sonraki hayata taşınan avantaj).
- **Adil reklam**: rewarded-ağırlıklı, interstitial seyrek, satın alınan reklamsızlık gerçekten reklamsız.
- **Backend'siz ama "canlı" hissi**: yerel takvim tetikleyicili sezonlar.

**Bu oyuna nasıl uygularız (Bölüm 2):**
- Review temalarının her biri için **tasarım kuralı**: (1) interstitial yalnızca ömür sonunda ve en fazla 1/5 dk; (2) reklamsız IAP = tüm reklamlar (rewarded dahil opsiyonel kalır); (3) olay havuzu **storylet** + değişken şablonlarla (en az 1.500 benzersiz satır lansmanda, aylık +200); (4) her ölüm/düşüşte anlatıcı **sebep + ders** açıklar; (5) Türkçe yazarın elinden, EN "yeniden yazım"; (6) ömür sonu Roast Raporu + Miras puanı; (7) 16+ kalıp ağır şiddeti anlatıcı sansürüyle komediye çevirmek (policy ve ebeveyn riski azalır).

---

## 3) Pazar büyüklüğü ve trendler (2023–2026)

### 3.1 Makro

- Sensor Tower State of Gaming 2026: mobil oyun **IAP geliri 82 Mr$ (+%1)**, indirmeler **~50 Mr (−%7)** 2025'te [14]. Pazar olgun: büyüme indirmeden değil, oyuncu başı değerden geliyor.
- AppMagic ise indirmelerde büyüme ölçüyor (+%6,6 2024, +%4,6 2025) — metodoloji farkı; iki kaynağı karıştırmayın [16].
- Simülasyon türü (2024): **6,1 Mr$ IAP, #5 tür; Puzzle ile birlikte indirmelerin %20'şer payı**; Strateji %4 indirmeyle gelirin %21,4'ü [15]. Yani simülasyon "indirme makinesi", strateji "para makinesi". Bizim tür indirme kazanır, gelir için **hybrid-casual monetizasyon disiplini** gerekir.
- Hayat simülasyonu alt-türü için güvenilir bir Sensor Tower/AppMagic kırılımı kamuya açık değil; Dataintelo'nun 1,91 Mr$ (2025, mobil %44) tahmini düşük kaliteli ve geniş tanımlı [73] — yatırımcı dokümanına koymayın.

### 3.2 Trendler

1. **Hybrid-casual tek büyüyen segment:** ~4,2 Mr$ IAP 2025, +%20 (Game World Observer okuması) / +%37 (Sensor Tower) [16]. Hybrid-casual liderleri D1'de hypercasual'ı geçti, D7'de fark açılıyor; top-25 casual D7 ortalaması Aralık 2025'te %14,9 [16]. Hypercasual 2025'te indirme kaybetmedi ama modeli "meta + IAP" oldu; AppMagic H1 2025 hypercasual gelir +%111 (meta derinleşmesi) [74][75].
2. **"Retention over CPI":** Adjust 2025: hypercasual CPI 0,40 $, hybrid-casual **0,95 $** (Android, global; neredeyse ikiye katlandı) [21]. Global D1 ~%27 [22]. Publisher'lar artık ucuz CPI değil **D7/D30 + LTV eğrisi** istiyor (bkz. Bölüm 5).
3. **Narrative/interactive story:** Choices ~544 M$ ömür boyu [17]; Sensor Tower tür raporları Interactive Story'yi ayrı izliyor [56]. Netflix dört sütunundan biri "narrative" [27]. Talep var; arz çoğunlukla romantik drama. **Komedi + erkek/kadın karışık kitleye hitap eden narrative boş.**
4. **AI-üretimli anlatı:** 2023–26 arasında LLM tabanlı anlatı oyunu sayısı artıyor (AI Dungeon, Hidden Door, 1001 Nights) [76]; ama Microsoft Research'e atıfla "insan müdahalesi olmadan AI hikâyeleri kısıtlı kalıplara çöküyor" [77]. Gelir verisi yok. **Bizim yaklaşımımız:** AI'yı **üretim aracı** (yazar asistanı, varyant üretimi, QA) olarak kullan, **runtime'da LLM yok** (backend'siz ve deterministik kalır; mizah kalitesi editörlü).
5. **Platform/ülke:** Hayat simülasyonu geliri Tier-1 İngilizce pazarlardan (ABD, İngiltere, Kanada, Avustralya) geliyor; BitLife'ın ABD haftalık geliri (~497 K$) İngiltere'nin (~63 K$) ~8 katı [3][46]. Türkiye indirme için güçlü, gelir için zayıf (Bölüm 6). Brezilya/Meksika/Endonezya: indirme devi, reklam geliri düşük. Almanya: Stillfront'un ayrı lokalizasyon ortaklığı kurması, Almanca pazarın değerli ve "çeviriyle" alınamayan bir pazar olduğunu gösteriyor [44].

**Bu oyuna nasıl uygularız (Bölüm 3):**
- Oyunu **"hybrid-casual narrative sim"** olarak konumlandır: hypercasual'ın tek-dokunuş girişi (ilk 30 sn'de ilk roast + ilk karar), casual'ın meta'sı (koleksiyon, miras, sezon), narrative'in hikâye kancası.
- Publisher sunumunda **tür verisi**: Simulation 6,1 Mr$ / %20 indirme + Interactive Story kanıtı + hybrid-casual büyümesi [15][16][17].
- Ülke sırası: **TR (soft-launch, organik/TikTok) → EN pazarlar (gelir) → DE/BR (lokal yazım, 2. yıl).**
- AI'yı içerik fabrikası yap: her storylet için 5–10 anlatıcı varyantı AI ile üret, insan editör seç; "tekrar eden metin" şikâyetini kökten kes.

---

## 4) Boşluk analizi ve konumlandırma

### 4.1 Harita

| Eksen | Sığ mizah / ciddi | Karakterli mizah |
|---|---|---|
| **Sistemik hayat simülasyonu** | BitLife, InstLife, klonlar, Sims Mobile | **BOŞ → BİZ** |
| **Mikro-karar / swipe** | Lapse, Spent | Reigns (ama premium, lisanslı, kapandı) |
| **Fayda/motivasyon uygulaması** | Habitica, Finch (şefkatli) | Carrot, Duolingo (persona var, oyun yok) |
| **Mizah markası** | — | Dumb Ways to Die (oyun derinliği yok) |

**Sonuç:** "Sistemik hayat sim + karakterli anlatıcı + motivasyon katmanı" kesişimi boş. Kara mizah + motivasyon birlikteliğinin kredibilitesi: Carrot (sarkazm + fayda, 10 yıl), Duolingo (tehditkâr maskot + öğrenme, 52,7 M DAU), Dumb Ways (ölümle güvenlik mesajı, 100 M+), Untitled Goose Game (3 ayda 1 M kopya, "kötü olmak komik") [78], Stanley Parable (anlatıcı-oyuncu alayı) [79], Papers Please (kasvetli ama absürt; satış verisi bu araştırmada doğrulanamadı). **Kalıp:** mizah girişi düşürür (CPI/organik), anlam/fayda retention'ı taşır.

### 4.2 Üç aday konumlandırma

1. **"Roast-first" (anlatıcı IP):** *"Hayatın seni trollediği, senin de ona gülümsediğin tek hayat simülasyonu."* — Hedef: 18–30, Reels/TikTok tüketicisi, Türk mizahına aşina. Güç: paylaşılabilir anlatıcı repliği = organik UA. Risk: ton yorgunluğu; "sürekli hakaret" kitleyi daraltır → mizah seviyesi ayarı şart.
2. **"BitLife'ın derinliği, Reigns'in hızı, Carrot'ın dili":** *"5 dakikada bir ömür, bir ömürde bir ders."* — Hedef: BitLife oyuncusu (arama trafiği, ASO). Güç: anlaşılır benchmark, publisher'a kolay anlatım. Risk: "klon" algısı; ayrışma anlatıcıya kalır.
3. **"Sarkastik hayat koçu":** *"Ölene kadar sana laf sokar, öldükten sonra seni ayağa kaldırır."* — Hedef: 22–35, self-improvement içeriği tüketen, motivasyon uygulaması denemiş-bırakmış. Güç: Finch/Duolingo benzeri abonelik yolu, yüksek D30. Risk: "oyun mu uygulama mı" bulanıklığı mağaza kategorisi/ASO'yu zorlar.

**Öneri:** Lansmanda **#1 + #2 karışımı** (mağaza metni #2, sosyal içerik #1), 6. aydan sonra **#3** abonelik katmanıyla.

### 4.3 USP

> **"Anlatıcı seni tanıyor."** Her hayat sonunda **Roast Raporu**: (a) en aptal 3 kararın, (b) aslında doğru yaptığın 1 şey, (c) bir sonraki hayata taşınan **Miras** (kalıcı küçük avantaj), (d) opsiyonel **gerçek hayat mikro-görevi** ("Bugün bir kişiye teşekkür et. Oyunda değil. Gerçekte."). Rapor paylaşılabilir kart olarak çıkar.

Rakiplerin hiçbirinde (BitLife ribbon = etiket, Alter Ego test = kişilik, Reigns = skor) **oyuncunun kararlarını yorumlayan ve ona geri veren** bir katman yok.

**Bu oyuna nasıl uygularız (Bölüm 4):**
- Anlatıcıya **isim, ses, görsel imza** (tek bir ikon/avatar, 20 ifade) → sanat bütçesi düşük, IP değeri yüksek.
- **Mizah seviyesi** ayarı (Nazik / Normal / Acımasız) — Carrot modeli; default "Normal", onboarding'de seçtir.
- ASO: TR'de "hayat simülasyonu", "bitlife türkçe", "hayat oyunu"; EN'de "life simulator", "bitlife alternative" (klon algısına rağmen trafik için gerekli).

---

## 5) Publisher manzarası

### 5.1 Türkiye

| Şirket | Ne yapıyor | Üçüncü parti oyun alır mı? | Kamuya açık KPI / süreç | Bizim için uyum |
|---|---|---|---|---|
| **Rollic** (Zynga/Take-Two) | Hypercasual → hybrid-casual yayıncı; 2025 gelir ~207 M$ [23]; SPK'ya halka arz başvurusu [24] | **Evet** — "Share Your Game" formu (ad, mağaza linki, motor, açıklama) [25] | KPI yayınlamıyor; sektör bilgisi: CPI ve D1 testi, hybrid'de D7 ağırlık (doğrulanmadı) | Orta: narrative/sim portföyünde yok ama TR'nin en büyük kapısı |
| **Udo Games** | Hybrid/casual yayıncı; 2013 kuruluş; TaleWorlds yatırımı (2022); Boas.io, Spear.io [26] | **Evet** — test, lansman, monetizasyon, ölçekleme hizmeti | Yayınlanmış KPI yok | Orta-yüksek: küçük ekiplerle çalışıyor |
| **Alictus / Clown Games** (Ankara) | Hypercasual/casual dev + yayıncı markası Clown Games [26] | **Evet** (Clown Games) | Yok | Orta |
| **Good Job Games** | Zen Match, Match Villains, Wonder Blast; eskiden dış stüdyo hypercasual yayınladı [24] | Dönemsel (sektör bilgisi) | Yok | Düşük-orta |
| **Fomo Games** | Hypercasual yayıncı (sektör bilgisi, doğrulanmadı) | Evet (hypercasual) | Yok | Düşük (tür uyumsuz) |
| **Fugo Games** | Words of Wonders; casual word/puzzle; dönemsel yayıncılık (sektör bilgisi) | Sınırlı | Yok | Düşük |
| **Grand Games** | 1 yıldan kısa sürede TR top-5 yayıncı, 2025'te 11 M$+ [80] | Birinci parti | — | Düşük |
| **Dream Games / Peak / Gram** | Royal Match 1,7 Mr$; Peak 620 M$ (Zynga); Gram (Zynga) [23] | **Hayır** (birinci parti) | — | Yok (benchmark/ilham) |
| **Agave, Bigger, Spyke** | Casual/puzzle birinci parti devler (sektör bilgisi) | Hayır | — | Yok |
| **Ludus** | Bu araştırmada doğrulanamadı | ? | ? | ? |
| **Mobidictum** | Haber, konferans, B2B ağ; yayıncı değil | — | Publisher eşleştirme etkinlikleri | **Yüksek: networking kanalı** |

**Sonuç:** TR ekosistemi puzzle/hypercasual eksenli; hayat simülasyonu için "doğal" yayıncı yok. Bu, (a) TR publisher'a "portföy çeşitlendirme" argümanı, (b) global hybrid-casual yayıncıya "TR'de kanıtlanmış KPI" argümanı anlamına gelir.

### 5.2 Global

| Yayıncı | Portföy | Kamuya açık KPI/süreç | Uyum |
|---|---|---|---|
| **Voodoo** | Hypercasual → hybrid-casual (Mob Control, Block Jam) | **D1 %45, D7 %15 (puzzle %20), D30 %10**; CPI dikkate alınır; önceki eşik D1 %45/D7 %13/CPI 0,20 $; örnek: 0,30 $ CPI + %12 D7 ile lansman [18][19]; "snackable guide" ortaklık rehberi [81] | Orta: tür dışı ama hybrid KPI'ları tutarsa açık |
| **Supersonic (Unity)** | Hypercasual/hybrid | "Submit your game" formu (mağazada canlı mı / video) [29]; KPI eşikleri blogda, sektör bilgisi: D1 %40+, D7 %15+, oyun süresi 8+ dk (doğrulanmadı) | Orta |
| **Homa** | Hybrid-casual; Homa Lab portalı + **kontrol listeleri** [30] | Yayınlanmış eşik yok | Orta |
| **Kwalee** | Hypercasual/hybrid + PC/konsol; Publishing Portal [31] | Yok | Orta |
| **Crazy Labs (TabTale)** | Hypercasual, simülasyon, ASMR; iOS/GP/FB/TikTok/Google Ads testleri; CLIK paneli [82] | "5 adım" rehberi | Orta-yüksek (simülasyon sever) |
| **Lion Studios (AppLovin)** | Casual/hyper; AppLovin ad stack avantajı | Form (sektör bilgisi) | Orta |
| **Azur Games** | Hybrid/midcore, geniş portföy | Form (sektör bilgisi) | Orta |
| **Tilting Point** | Casual/midcore; portal [20] | Vendor blog: **D7 %20+, D30 %8+, ARPU verisi** [83] | Orta |
| **Netflix Games** | Narrative, party, kids, mainstream; **üçüncü parti indie'leri kesiyor**, abonelik gerekli, reklam/IAP yok [27] | — | Düşük (F2P modelimizle uyumsuz) |
| **Devolver** | Premium; Nerial kapandı; mobilde premium port'lar [12][28] | — | Düşük (F2P) |
| **Noodlecake / Playdigious / Raw Fury / tinyBuild** | Premium indie port'lar (sektör bilgisi) | — | Düşük (F2P); Playdigious yalnız premium |
| **Self-publish** | Candywriter ($0 reklam, 13 kişi, 26 M$) [1][2]; A Dark Room 697 K$ [64]; Alter Ego 5 M indirme [8]; Finch bootstrapped ~1 M$/ay [38] | Apple/Google küçük işletme: %15 komisyon (<1 M$/yıl) | **Yüksek** (plan B, hatta plan A) |

**Publisher'ların değerlendirme kriterleri (sektör anketi):** demo, GDD, monetizasyon modeli, IP'nin uzun vadeli potansiyeli, viral potansiyel [84]. Bazı yayıncılar iOS-öncelikli; Android-only sunum dezavantaj [85].

### 5.3 Publisher'a gidecek "KPI dosyası" (hedef eşikler)

| Metrik | Minimum (görüşme açılır) | İyi (deal) | Not |
|---|---|---|---|
| D1 | %38 | %45+ | Voodoo %45 [18] |
| D7 | %15 | %20+ | Tilting Point %20 [83]; top-25 casual %14,9 [16] |
| D30 | %7 | %10+ | Voodoo %10 [18] |
| Oturum/gün | 3 | 4+ | BitLife-tipi mikro-turn |
| Günlük süre | 15 dk | 25 dk+ | |
| CPI (TR Android) | 0,15 $ | <0,10 $ | TR ucuz; iOS US 0,8–1,5 $ beklenir |
| Rewarded izleme/DAU | 1,5 | 3+ | |
| Ad ARPDAU (TR) | 0,02 $ | 0,04 $ | eCPM düşük (Bölüm 6) |
| IAP dönüşüm | %1 | %2+ | Tek seferlik "Ölümsüz Üyelik" |

**Bu oyuna nasıl uygularız (Bölüm 5):**
1. **Sıra:** TR soft-launch (Android+iOS, 4–6 hafta, 2–5 K kullanıcı, 500–1.500 $ test UA) → KPI dosyası → paralel başvuru: Rollic formu, Udo, Crazy Labs, Homa Lab, Supersonic, Voodoo; Mobidictum etkinliğinde yüz yüze.
2. **Self-publish hazır tut:** AdMob/AppLovin MAX mediation + RevenueCat benzeri IAP (opsiyonel) ile gelir altyapısı publisher'dan bağımsız olsun. Candywriter ve Finch kanıtı: **publisher şart değil**; publisher = UA sermayesi + ASO/creative ekibi.
3. Sunum argümanları: offline-first (sunucu maliyeti sıfır → Sims Mobile'ın tersi), içerik fabrikası (AI-destekli storylet üretimi), TR organik kanıtı, EN "rewrite" planı.
4. Deal kırmızı çizgileri: IP bizde kalır (Nerial dersi), minimum UA taahhüdü, 12–18 ay sonra geri alım opsiyonu.

---

## 6) Türkiye pazarı özellikleri

**Büyüklük ve davranış.**
- Türkiye Oyun Pazarı Raporu 2025: pazar **~1 Mr$ (+%25), 50 M aktif oyuncu, %54 erkek / %46 kadın** [32]. Alternatif ölçümler: 1,54 Mr$, 54,1 M oyuncu, 45,3 M mobil, 902 M$ mobil [86] vs. 427,5 M$ mobil (Statista tanımı) [87]; Udonis 2,2 Mr$ (yarısı mobil) [88]. Tanımlar farklı; **"~1–1,5 Mr$, yarısı mobil"** deyin.
- Türkiye gelişen pazarlar arasında **mobil oyun harcamasında +%28 ile lider** (2026 raporu) [89]. Yani ödeme kültürü büyüyor ama taban düşük.
- Adjust TR H1 2025 **ortalama retention D1 %19, D7 %5, D14 %3, D30 %1**; 2024'te kurulum +%12, oturum +%8 [33]. Bu ortalamalar hypercasual ağırlıklı; bizim hedef D1 %40 / D7 %18, TR ortalamasının 2–3 katı; TR'de bunu tutturursak Tier-1'de daha iyi olur (metin oyunları Tier-1'de daha iyi retention alır — BitLife ABD/UK verisi).
- Gelir karması: düşük kaliteli bir derleme IAP %55 / reklam %15 (tüm oyun) diyor [90]; güvenilir TR'ye özel payer conversion verisi **yok**. Sektör bilgisi: TR F2P mobilde payer oranı Tier-1'in yarısı-üçte biri, ARPPU düşük; **fiyatlar PPP'ye göre %60–75 indirimli olmalı** (App Store TR fiyat kademeleri zaten düşük).

**eCPM.**
- ABD rewarded video: **12,91 $ Android / 13,18 $ iOS** (Udonis) [34]; Tier-1 rewarded 15–30 $ (Playwire) [91]. Udonis top-20 Android aralığı 3,31–12,91 $ [34]; Türkiye bu listenin altında. AdMob derlemesi TR 0,35 $ (format belirsiz, güvenilmez) [92]. Appodeal 2023 raporu TR'yi 18 ülkeden biri olarak analiz etti ama satır erişilemedi [93].
- **Sektör tahmini (doğrulanmadı):** TR rewarded video eCPM Android 2–4 $, iOS 3–6 $; interstitial 1–3 $; banner <0,3 $. **ABD ile fark 3–6x.** Sonuç: aynı DAU'nun TR'de reklam geliri ABD'nin ~%20–30'u.

**Oyuncu profili (sektör bilgisi + rapor).** Genç (18–34 ağırlık), Android baskın (yaklaşık %75–80 kurulum, sektör bilgisi), yüksek günlük oyun süresi, WhatsApp/Instagram/TikTok üzerinden ekran görüntüsü paylaşımı güçlü, mizah ve "laf sokma" kültürü yüksek (caps/meme ekonomisi). Ebeveyn hassasiyeti: 18+ içerik şikâyetleri hızlı gelir.

**Bu oyuna nasıl uygularız (Bölüm 6):**
1. **TR = test ve organik lab, gelir değil.** Soft-launch'ta reklam gelirini KPI yapmayın; **retention, oturum, paylaşım oranı, rewarded izleme/DAU** ölçün.
2. **Rewarded-first**: TR'de interstitial eCPM çok düşük, kullanıcıyı kaçırma maliyeti yüksek → interstitial yalnız ömür sonu; rewarded "ikinci şans / Time Machine / premium seçenek" olarak.
3. **IAP fiyatlama:** TR'de 49–149 ₺ bandı tek seferlik "Ölümsüz Üyelik"; EN'de 4,99–6,99 $. Abonelik TR'de ikinci faz.
4. **Viral tasarım:** Her ölüm/roast kartı 9:16 formatında, Türkçe caps estetiğinde, tek dokunuşla Instagram Story'ye. Dumb Ways/BitLife TikTok kanıtı [40].
5. **Yerel içerik paketleri:** "Üniversite", "Askerlik", "Ev sahibi olmak", "Bayram sofrası", "Gurbet", "Girişimci (ya da öyle sanıyorsun)". EN sürümde eşdeğerleri yeniden yazılır (student loan, 401k, landlord).
6. **Android-first performans ve düşük cihaz** optimizasyonu (TR'de orta segment Android çoğunluk); iOS build gün 1'de hazır (publisher'lar iOS ister) [85].

---

## 7) Bu oyun için öneriler (öncelikli, puanlı)

Puan = Etki (1–5) × Güven (1–5) / Efor (1–5). Yüksek daha iyi.

| # | Öneri | Etki | Güven | Efor | Puan | Öncelik |
|---|---|---|---|---|---|---|
| 1 | BitLife-tipi "Yaş +1" mikro-turn + 4 bar + ribbon çekirdeği (kanıtlı format) | 5 | 5 | 3 | 8,3 | **P0** |
| 2 | Anlatıcı persona + mizah seviyesi ayarı (Carrot modeli) | 5 | 4 | 2 | 10,0 | **P0** |
| 3 | Ömür sonu **Roast Raporu + Miras** (USP) + paylaşılabilir kart | 5 | 4 | 3 | 6,7 | **P0** |
| 4 | Rewarded-first reklam, interstitial yalnız ömür sonu; reklamsız IAP gerçekten reklamsız | 4 | 5 | 2 | 10,0 | **P0** |
| 5 | Storylet içerik fabrikası: AI varyant üretimi + insan editör; lansmanda ≥1.500 satır, aylık +200 | 5 | 4 | 4 | 5,0 | **P0** |
| 6 | Haftalık challenge + aylık tematik paket kadansı, yerel takvimle (backend'siz) | 4 | 5 | 2 | 10,0 | **P1** |
| 7 | Swipe karar UI'ı (Reigns) + anlatıcı sonuç açıklaması | 3 | 4 | 2 | 6,0 | **P1** |
| 8 | TR soft-launch KPI dosyası (D1/D7/D30, oturum, rewarded/DAU) → Rollic/Udo/Crazy Labs/Homa/Supersonic/Voodoo başvuruları | 5 | 4 | 2 | 10,0 | **P1** |
| 9 | Cezasız streak + persona bildirimleri (Finch + Duolingo karışımı) | 4 | 4 | 2 | 8,0 | **P1** |
| 10 | Idle "sen yokken hayat aktı" özeti (Alter Ego) | 3 | 3 | 2 | 4,5 | **P1** |
| 11 | EN lokalizasyonu "rewrite" olarak, komedi yazarıyla; DE/BR 2. yıl | 4 | 4 | 4 | 4,0 | **P2** |
| 12 | Gerçek hayat mikro-görevleri (opsiyonel, abonelik katmanı tohumu) | 3 | 3 | 3 | 3,0 | **P2** |
| 13 | 16+ derecelendirme için şiddet/cinsellik anlatıcı sansürü ile komediye çevirme | 3 | 4 | 1 | 12,0 | **P1** (ucuz, riski düşürür) |

---

## 8) Açık sorular

1. **BitLife 2022–2025 gerçek gelir kırılımı** (Stillfront segment raporları): ürün düşüşte mi, yatay mı? Fiyatlama ve paket kadansını buna göre ayarlayacağız.
2. **Türkiye rewarded eCPM'in güvenilir satırı** (Appodeal/CAS.AI/AppLovin ülke tabloları) — ad ARPDAU hedefimizi kesinleştirir.
3. **Türkiye payer conversion ve ARPPU** (Sensor Tower/AppMagic TR) — IAP ağırlığına karar.
4. **Supersonic/Homa/Kwalee/Crazy Labs'ın 2025–26 güncel KPI eşikleri** (bloglar erişilemedi).
5. **Alter Ego'nun gelir/ekip büyüklüğü** (Japonca kaynak gerekiyor) — solo-dev ölçek benchmark'ı.
6. **Episode (Pocket Gems) güncel geliri** ve Choices'ın sahiplik değişimi (Series Entertainment?) — narrative monetizasyonun sağlığı.
7. **Papers Please / Stanley Parable Ultra Deluxe satışları** (ton kredibilitesi için istenen kanıt; bu turda doğrulanamadı).
8. **Türkçe mizahın ihracı:** EN rewrite için komedi yazarı bütçesi; A/B ile hangi mizah seviyesi D7'yi düşürüyor?
9. **Mağaza politikası sınırı:** "Roast" tonu Apple 1.1 (nefret/aşağılama) ve Google "taciz" politikalarına ne kadar yaklaşır? (T5 politika dokümanıyla birlikte test; bildirim metinleri de dahil.)
10. **Publisher şart mı?** Finch/Candywriter kanıtı self-publish lehine; karar TR soft-launch CPI/retention verisinden sonra.

---

## 9) Kaynaklar

1. Stillfront Group acquires BitLife developer Candywriter (Medium özeti) — https://medium.com/@SEgames/stillfront-group-acquires-bitlife-developer-candywriter-92eb08532a5d
2. Stillfront: acquires Candywriter, LLC and discloses updated pro forma figures for 2019 — https://www.stillfront.com/en/stillfront-group-acquires-candywriter-llc-and-discloses-updated-pro-forma-figures-for-2019/
3. Sensor Tower: Top Simulator Games Performance in the US, Q2 2025 — https://sensortower.com/blog/2025-q2-unified-top-5-simulator%20games-revenue-us-60416e41241bc16eb8905c2f
4. Apprank: BitLife revenue & earnings (Aug 2026) — https://apprank.io/bitlife-life-simulator-3536
5. Gamigion: BitLife's Aggressive Interstitial Monetization Strategy — https://www.gamigion.com/bitlifes-aggressive-interstitial-monetization-strategy/
6. ComplaintsBoard: BitLife — https://www.complaintsboard.com/bitlife-life-simulator-b150146
7. App Store listing (BitLife, 17+, fiyatlar ve puanlar) — https://apps.apple.com/app/bitlife-life-simulator/id1374403536 ; Google Play — https://play.google.com/store/apps/eventdetails/4831791308351315470
8. Caramel Column (X): 5 million downloads — https://x.com/GamesCaramel/status/1988916071064027436
9. ALTER EGO App Store listing (IAP'ler, puan) — https://apps.apple.com/ca/app/alter-ego/id1447605099 ; https://apppricinglab.com/app/apple/1447605099
10. Reigns (Wikipedia) — https://en.wikipedia.org/wiki/Reigns_(video_game)
11. GamesRadar: How Reigns convinced two million people… — https://www.gamesradar.com/how-reigns-convinced-two-million-people-to-swipe-right-to-rule-their-kingdom-and-captured-the-game-of-thrones-license/
12. MobileGamer.biz: Reigns developer Nerial closes after 13 years — https://mobilegamer.biz/reigns-and-card-shark-developer-nerial-closes-after-13-years/
13. PCGamesInsider: Devolver lays off 40% of Nerial workforce — https://www.pcgamesinsider.biz/news/75123/devolver-lays-off-40-of-nerial-workforce/
14. Sensor Tower State of Gaming 2026 (basın bülteni) — https://sensortower.com/press/press-release-sensor-tower-state-of-gaming-gaming-drove-52-billion-downloads-82b-iap-revenue-on-mobile-and-12b-premium-revenue-on-steam
15. Sensor Tower State of Mobile Gaming 2025 (PDF) — https://investgame.net/wp-content/uploads/2025/11/sensor_tower__state_of_mobile_gaming_2025__en.pdf
16. GameDevReports: Sensor Tower — State of the Mobile Market in 2026 — https://gamedevreports.substack.com/p/sensor-tower-the-state-of-the-mobile
17. Choices: Stories You Play (Wikipedia; PocketGamer 2024 atfı) — https://en.wikipedia.org/wiki/Choices:_Stories_You_Play
18. Game World Observer: How Voodoo makes $100M hybrid-casual games: 15% D7 retention — https://gameworldobserver.com/2023/07/25/voodoo-hybrid-games-d7-retention-games-and-names-podcast
19. GameAnalytics: How Voodoo Diversified and Lowered Game Product KPIs — https://www.gameanalytics.com/blog/how-voodoo-diversified-and-lowered-game-product-kpis
20. MCV: Tilting Point's hunt for indies — https://mcvuk.com/development-news/tilting-points-hunt-for-indies/
21. GameDevReports: Adjust Mobile Games Insights Report 2025 — https://gamedevreports.substack.com/p/adjust-mobile-games-insights-report
22. AppFollow: Mobile Game KPIs 2026 — https://appfollow.io/blog/mobile-game-kpis
23. Udonis: Turkish Mobile Gaming Market Stats & Trends 2026 (AppMagic verisi) — https://www.blog.udonis.co/mobile-game-market/turkiye
24. PocketGamer.biz: The Top 30 Türkiye Game Makers of 2026 — https://www.pocketgamer.biz/the-top-30-turkiye-game-makers-of-2026/
25. Rollic: Share Your Game — https://rollicgames.com/share-your-game
26. Udo Games (Tracxn) — https://tracxn.com/d/companies/udo-games/__uLvROYsouoZ1ZHDo_ByDsxGv6xmOwK-1jTgptWocKYw ; Alictus (LinkedIn) — https://www.linkedin.com/company/alictus/
27. GamesHub: Netflix announces new 'four pillar' games strategy — https://www.gameshub.com/?p=2690254 ; MobileGamer.biz: Netflix adds WWE 2K, ditches indie titles — https://mobilegamer.biz/netflix-adds-wwe-2k-games-quietly-ditches-multiple-indie-and-double-a-titles/
28. ScreenHub: Netflix removes Hades, Golden Idol (Devolver mobil premium planı) — https://www.screenhub.com.au/news/news/netflix-removes-hades-golden-idol-2670832
29. Supersonic: Play Our Games / submit — https://supersonic.com/games/
30. Homa Lab: Submissions and creatives — https://www.homagames.com/homa-lab/submissions-and-creatives
31. Kwalee publishing — https://www.kwalee.com/publishing/pc-console
32. Daily Sabah: Turkish gaming industry surpassed $1B volume in 2025 — https://www.dailysabah.com/business/tech/turkish-gaming-industry-surpassed-1b-volume-in-2025-survey ; Türkiye Game Market Report 2025 (PDF) — https://investgame.net/wp-content/uploads/2026/02/2026-02-17-trkiye_game_market_report_2025-compressed_wp.pdf
33. AllCorrect: The Gaming Market in Turkey 2026 (Adjust TR retention) — https://allcorrectgames.com/insights/the-gaming-market-in-turkey-2026/
34. Udonis: eCPMs for Rewarded Video, Interstitial & Banner — https://www.blog.udonis.co/mobile-marketing/mobile-apps/ecpms
35. ScreensDesign: CARROT Weather showcase (tahmini gelir) — https://screensdesign.com/showcase/carrot-weather-alerts-radar
36. Duolingo FY2025 Form 10-K — https://www.sec.gov/Archives/edgar/data/1562088/000162828026012494/duol-20251231.htm
37. SQ Magazine: Duolingo statistics — https://sqmagazine.co.uk/duolingo-statistics/
38. Review Rounds: Finch business model (Sensor Tower tahminleri) — https://review-rounds.com/finch-business-model-bootstrapped-self-care-pet-app/
39. Arfur Rock (X): Finch ~$4M/mo, best-in-class D30 (doğrulanmamış) — https://x.com/ArfurRock/status/1924499333929373958
40. PocketGamer.biz: TikTok trend drives Dumb Ways to Die past 100M downloads — https://www.pocketgamer.biz/tiktok-trend-drives-dumb-ways-to-die-past-100-million-lifetime-downloads-8491047
41. Candywriter About — https://candywriter.com/about/
42. About BitLife — https://bitlifeapp.com/about
43. Stillfront Year-End Report 2021 — https://www.stillfront.com/en/wp-content/uploads/sites/2/2022/02/stillfront-stillfront-groups-full-year-results-2021-220216.pdf
44. Goodgame Studios partners with Candywriter (German BitLife) — https://goodgamestudios.com/company/press/releases/goodgame-studios-partners-with-candywriter-to-launch-hit-mobile-game-bitlife-for-german-audiences/
45. Stillfront Annual Report 2025 — https://www.stillfront.com/en/wp-content/uploads/sites/2/2021/10/stillfront-annual-report-2025-260422.pdf
46. Sensor Tower: Top 5 Simulator Games UK Q3 2024 — https://sensortower.com/blog/2024-q3-unified-top-5-simulator%20games-revenue-gb-60416e41241bc16eb8905c2f
47. Caramel Column (X): 1M downloads — https://x.com/GamesCaramel/status/1239488729992986625
48. Final Weapon: Alter Ego surpasses 2 million downloads — https://finalweapon.net/2021/05/02/self-discovery-clicker-game-alter-ego-surpasses-2-million-downloads-on-mobile-switch-version-coming-this-year/
49. MCV: Reigns becomes premium mobile poster child with 600,000 sales — https://mcvuk.com/business-news/mobile/reigns-becomes-latest-premium-mobile-poster-child-with-over-600000-sales/
50. SteamData: Reigns — https://steamdata.ai/game/474750/reigns
51. AppBrain: InstLife — https://www.appbrain.com/app/instlife/com.instcoffee.instlife
52. HubPages: InstLife guide — https://discover.hubpages.com/games-hobbies/InstLife-App-Guide-Review-The-Text-based-Game-of-Life
53. John Ayliff itch.io — https://johnayliff.itch.io/
54. Hacker News: Seedship thread (2025) — https://news.ycombinator.com/item?id=45142704
55. Udonis: Choices monetization — https://www.blog.udonis.co/mobile-marketing/mobile-games/choices-stories-you-play-monetization
56. Sensor Tower: Interactive Story Games iOS US Q2 2024 — https://sensortower.com/blog/2024-q2-ios-top-5-interactive%20story%20games-revenue-sk-6019ed6a241bc16eb869f511
57. PocketGamer.biz: EA to shut down The Sims Mobile after seven years — https://www.pocketgamer.biz/ea-to-shut-down-the-sims-mobile-after-seven-years
58. Checkpoint Gaming: The Sims Mobile will shut down in 2026 — https://checkpointgaming.net/news/2025/10/the-sims-mobile-will-shut-down-in-2026/
59. CNN: Kim Kardashian Hollywood game shutting down — https://edition.cnn.com/2024/01/04/tech/kim-kardashian-hollywood-game-shutting-down
60. MobileGamer.biz: The rise and fall of Kim Kardashian: Hollywood — https://mobilegamer.biz/the-rise-and-fall-of-kim-kardashian-hollywood/
61. Yahoo/Insider: Kim Kardashian's mobile game shutting down — https://www.yahoo.com/tech/kim-kardashians-mobile-game-shutting-132106155.html
62. PocketGamer.biz: Dumb Ways to Die surpasses 360 million downloads — https://www.pocketgamer.biz/dumb-ways-to-die-surpasses-360-million-downloads
63. PlaySide FY25 Results Investor Presentation — https://investorpa.com/announcement/178700/ ; SmallCaps: Dumb Ways to Build launch — https://smallcaps.com.au/article/playside-studios-beats-internal-forecasts-with-dumb-ways-to-build-launch
64. Game Developer: A two year look at the sales of A Dark Room — https://www.gamedeveloper.com/business/a-two-year-look-at-the-sales-of-chart-topping-ios-title-i-a-dark-room-i-
65. PocketGamer: A Dark Room co-creator shares sales numbers — https://www.pocketgamer.com/a-dark-room/the-co-creator-of-top-selling-ios-game-a-dark-room-shares-its-sales-numbers-and/
66. Indie Hackers: A Dark Room iOS revenue — https://www.indiehackers.com/product/a-dark-room/revenue
67. PocketGamer: AdVenture Capitalist on its 6th year — https://www.pocketgamer.com/articles/087706/adventure-capitalist-on-its-6th-year-a-walk-down-memory-lane/
68. Sensor Tower: AdVenture Capitalist revenue surpasses $20M — https://sensortower.com/blog/adventure-capitalist-revenue
69. Apple Developer story: Meet the developer (CARROT) — https://apps.apple.com/us/story/id1470366384 ; TechRadar CARROT interview — https://www.techradar.com/news/with-another-heatwave-coming-we-asked-carrot-and-its-maker-for-advice
70. Pulse: More than 10 million Duolingo users have a 365-day streak — https://www.pulse.bot/entertainment/news/more-than-10-million-duolingo-users-have-a-365-day-streak-44e18de9-0044-4dd4-80ec-c9769773809d
71. note.com: Decoding the Design Philosophy of Finch (Tracxn: 5M downloads, ~$12M, 44 employees) — https://note.com/pubvoice/n/n9f2a0fe8d290?hl=en
72. AppGoblin: Habitica — https://appgoblin.info/apps/com.habitrpg.android.habitica
73. Dataintelo: Life Simulation Game Market (düşük güvenilirlik) — https://dataintelo.com/report/life-simulation-game-market
74. AppMagic: Casual Games Report H1 2025 — https://appmagic.rocks/research/casual-report-h1-2025?hl=en
75. PocketGamer.biz: What happened to hypercasual? — https://www.pocketgamer.biz/what-happened-to-hypercasual-the-markets-evolution-over-the-past-year/
76. arXiv: AI Native Games: A Survey and Roadmap — https://arxiv.org/pdf/2607.00527
77. Jenova (vendor; Microsoft Research atfı) — https://www.jenova.ai/en/resources/ai-storytelling-game
78. VGC: Untitled Goose Game hits 1 million sales — https://www.videogameschronicle.com/news/untitled-goose-game-hits-1-million-sales-following-ps4-and-xbox-releases
79. Game Informer: The Stanley Parable sold 100,000 copies since launch — https://gameinformer.com/b/news/archive/2013/10/20/the-stanley-parable-has-sold-more-than-100-000-copies-since-launch
80. Mobidictum: Grand Games rises to Top 5 among Turkish publishers — https://mobidictum.com/grand-games-rises-to-top-5-among-turkish-mobile-game-publishers-in-less-than-a-year/
81. Voodoo: A Snackable Guide to Partnering with Voodoo — https://voodoo.io/news/a-snackable-guide-to-partnering-with-voodoo
82. Crazy Labs: 5 Steps to Get Your Game Published — https://www.crazylabs.com/?p=15772 ; AppSamurai publisher list — https://appsamurai.com/blog/mobile-game-publishers-list/
83. Galaxy4Games: hybrid-casual publisher criteria (vendor blog) — https://galaxy4games.com/en/knowledgebase/blog/top-companies-offering-hybrid-casual-game-development-services-in-2026
84. MCV: What publishers want from developers — https://www.mcvuk.com/development/what-publishers-want-from-developers
85. TouchArcade forum: How to get a publisher for your mobile game — https://toucharcade.com/community/threads/how-to-get-a-publisher-publishing-deal-for-your-mobile-game.291344/
86. IMARC: Turkey Gaming Market — https://www.imarcgroup.com/turkey-gaming-market
87. Statista: Turkey video game market revenue by segment — https://statista.com/forecasts/1447214/turkey-video-game-market-revenue-by-segment
88. Udonis: Turkish Mobile Gaming Market (2,2 Mr$ tahmini) — https://www.blog.udonis.co/mobile-game-market/turkiye
89. SQ Magazine: Mobile Games Statistics 2026 (Türkiye +%28 harcama) — https://sqmagazine.co.uk/mobile-games-statistics/
90. Zipdo: Turkey Gaming Industry Statistics (düşük güvenilirlik) — https://zipdo.co/turkey-gaming-industry-statistics/
91. Playwire: AdMob eCPM benchmarks — https://www.playwire.com/blog/admob-ecpm-benchmarks-what-publishers-should-expect
92. SR Zone: AdMob eCPM rates by country (düşük güvenilirlik) — https://www.thesrzone.com/2024/01/admob-ecpm-rates-by-country.html
93. Business of Apps: 2023 Mobile eCPM report (Appodeal, 18 ülke) — https://www.businessofapps.com/insights/how-inflation-affects-ad-revenues-all-the-mobile-ecpm-insights-to-boost-your-ad-strategy-in-2023/ ; Appodeal eCPM Report 2025 — https://appodeal.com/wp-content/uploads/2025/03/Appodeal-The-Latest-eCPM-Report-2025.pdf
94. Naavik: Why Turkish Game Development Matters in 2026 — https://naavik.co/digest/why-turkish-game-development-matters-in-2026/
95. Mobidictum: Biggest Turkish game companies by headcount 2025 — https://mobidictum.com/biggest-turkish-game-companies-headcount-2025/
96. Apple App Store Review Guidelines — https://developer.apple.com/app-store/review/guidelines/ ; Google Play Developer Policy Center — https://play.google.com/about/developer-content-policy/
