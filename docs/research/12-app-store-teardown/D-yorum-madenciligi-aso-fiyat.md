# App Store Teardown — Küme D: Çapraz Analiz (ASO · Fiyat Matrisi · Yorum Madenciliği · Özellik Sıklığı · Boşluklar · Kopya Listesi)

**Tarih:** 2026-11-07 · **Amaç:** Motto (docs/design/00-VIZYON-ve-KARARLAR.md §0, §4, §12) için küme A (BitLife ailesi) ve küme B (klonlar) teardown'larının **üstünde** çalışan çapraz analiz: hangi anahtar kelimeler, hangi fiyat noktaları, hangi şikâyet/övgü kümeleri, hangi özellikler kaç uygulamada var, oyuncular neyi isteyip alamıyor ve bunların Motto'ya sıralı "kopya listesi" karşılığı.

**Yöntem ve sınırlar (okumadan geçme):**
- Web araması (extended modu) ile mağaza sayfası indeks görüntüleri (apps.apple.com US/TR/BR/EE, play.google.com), AppBrain, AppGrooves, Metacritic, GameSkinny, lifesim.com, askapp.top, justuseapp, ASOTools, AppTweak/LaunchAssetKit/Stora ASO rehberleri, itch.io forumları. apps.apple.com bu ortamda **doğrudan fetch edilemedi** (ağ izni yok); mağaza verileri arama motorunun sayfa özetlerinden geldi, bu yüzden aynı uygulama için iki farklı fiyat/puan görüntüsü olabilir — ikisini de yazdım.
- Reddit doğrudan indekslenemedi (r/BitLifeApp aramaları boş döndü); "boşluk" bölümü mağaza yorumları, itch.io, Metacritic, GameFAQs ve AppleVis forumlarına dayanıyor; Reddit teyidi Sprint 0'da yapılmalı.
- Bu turun arama bütçesi yorum madenciliğinin ortasında tükendi; eksik kalan sorgular (The Life Simulator ve Biddulph yorum alıntıları, AltLife/Alter Ego TR fiyatı, BitLife Kasım 2026 güncelleme notları, TC Simülasyonu yorumları) **küme A ve B dosyalarından** (aynı gün yapılmış, kaynaklı) alındı; alıntı dipnotunda hangi dosyadan geldiği yazıyor.
- TRY fiyatları: yalnızca BitLife ve BitLife GO! için TR mağazası görüntüsü var. Diğer uygulamalar için TRY sütunu **Apple'ın gözlenen TR katman eşlemesinden türetilmiş tahmin** ("≈" ile): $0,99→₺49,99 · $4,99→₺249,99 · $7,99→₺349,99 · $9,99→₺399,99 · $14,99→₺699,99 · $19,99→₺899,99 · $20,99→₺999,99 (hepsi BitLife/GO listelerinde doğrudan gözlendi). Google Play TR fiyatları geliştiriciye göre değişir, tahmin edilmedi.

**Kaynak sayısı:** 44 ayrı URL (sonda "Kaynaklar").

---

## 0. Yönetici özeti (tek bakış)

1. **ASO:** "life simulator" ABD'de BitLife'ın sahiplendiği baş terim; top-10'un 9'u başlığında "Life Simulator" ibaresini taşıyor, 7'si "X - Life Simulator" biçiminde. TR mağazasında aynı uygulamalar yerelleştirilmiş başlıkla görünüyor ("Hayat Simülasyonu", "Yaşam Simülatörü", "Hayat Oyunu") ve rekabet çok düşük (ZipLife, Ana Karakter, Bir TC Simülasyonu — hepsi <1 bin oy). Apple 2026'da ekran görüntüsü yazılarını da indeksliyor; bu, Motto'nun "Hayat koçu / life coach" ve "gün gün / day by day" ikincil terimlerini ucuza kapmasını sağlar.
2. **Fiyat:** Raf iki kutupta: BitLife'ın 100 $+ "her şeyi al" sepeti (TR'de ₺999,99 Boss Mode) ile küçük stüdyoların $2,99–9,99 tek ödemesi. Oyuncuların kabul ettiği çıpa **$7,99–9,99 kalıcı premium** (AltLife, BitLife Bitizenship, SimLife God Mode); $2,99 reklam kaldırma tartışmasız; abonelik ve para birimi paketleri ($5,99–16,99 LifePoints) en çok şikâyet edilen kalemler.
3. **Yorumlar:** 1 yıldızın %60'ı tek konu: **reklam** (sıklık, "satın aldım geri geldi", temel etkileşime reklam). 5 yıldızın ana motifi **"addictive / one more / hours fly by"** ve **"constant updates"**. Küme genelinde en keskin fark: Alter Ego'nun 5 yıldızları duyguyu ("rethink my life"), BitLife'ınkiler çeşitliliği ("a lot of options") övüyor; Motto'nun hedefi ikisinin kesişimi.
4. **Özellik sıklığı:** Top-10'da meslek/ilişki/suç 9–10/10 (hijyen), evcil hayvan ve mini-oyun 6/10, God Mode 5/10, haftalık challenge 3/10, **NPC diyalog (chat UI) 1/10, gerçek zaman akışı 2/10 (idle), anlatıcı persona 1/10, paylaşım kartı 3/10**. Motto'nun D-061/062/066 kararları tam olarak düşük sıklıklı sütunlara düşüyor.
5. **Boşluklar:** Oyuncular (a) kardeş/geniş aile ve iş arkadaşıyla etkileşim, (b) kişisel hayatı etkileyen rastgele olaylar (ekonomiyi değil), (c) "aynı kararlar her hayatta" tekrarına çare, (d) reklamsız dürüst model, (e) yerel doku (TR: enflasyon, gelenek), (f) daha çok ülke/temsil istiyor. Hiçbir uygulama (a)+(b)+(c)'yi birlikte vermiyor.
6. **Kopya listesi:** 25 madde; ilk 5: Kalıcı tek premium "Sertifika" ($7,99 / ₺349,99) · Mezar taşı/ölüm özeti paylaşım kartı · Haftalık seed'li challenge · "Sen yokken" dönüş özeti · Varlıkların olay havuzunu değiştirmesi.

---

## 1. ASO — anahtar kelimeler, arama sonuçları, başlık/alt başlık/ekran görüntüsü kalıpları

### 1.1 Anahtar kelime manzarası

| Terim | ABD mağazası (gözlem) | TR mağazası (gözlem) | Not |
|---|---|---|---|
| **life simulator** | Baş terim. Arama özetinde ilk 10: BitLife, AltLife, SimLife, LifePop, Lifespan, Life Simulator: Roleplay Sim, Life Choices, LiSi, Life Simulator - Business Game, Another Life. BitLife "Chart #13 Roleplaying". | Aynı aramada TR başlıklar: "ZipLife: Hayat Simülasyonu", "Life Simulator: Hayat Oyunu" (Roleplay Sim'in TR adı), "Bitlife GO! - Yaşam simülatörü", "Seçimler: Hayat Simülasyonu" (Life Choices'ın TR adı), "Bir TC Simülasyonu", "Ana Karakter: Yaşam Sim". | ABD'de başlıkta "Life Simulator" olmayan tek büyük oyun Alter Ego ("self-discovery clicker game" diye konumlanıyor). |
| **life sim** | Kısaltma; "LifeSim", "SimLife", "Life Sim: Real Life Simulator", "Ana Karakter: Yaşam Sim" başlıklarında kullanılıyor. | — | Apple'da "sim" ayrı token; "simulator" ile birlikte yazmak iki terimi de kapsıyor. |
| **text life sim / text-based** | BitLife açıklaması: "the original text-based life simulator". Küçük oyunlar (Life in Text) başlığa taşıyor. | — | Motto bu terimi açıklamaya koymalı; başlığa değil. |
| **bitlife** | ASOTools (Play verisi, tarihsiz): hacim 52, zorluk 39; "streamer's life simulator" 43/18, 250+ sonuç. Marka terimi; BitLife GO!, DogLife, CatLife, Español/DE türevleri kendi aralarında paylaşıyor. | "BitLife GO!" TR'de 16+ ve Türkçe dil desteğiyle listelenmiş; yorumlar "Türkçe çevirinin yetersiz" diyor. | Rakip marka adını metadata'ya koymak Apple'da reddedilir; açıklamada "games like…" cümlesi de riskli. **Motto: hiçbir yerde BitLife yazmaz.** |
| **hayat simülasyonu / yaşam simülatörü** | — | ZipLife (Kaan Güler, 13+, 79,6 MB), Ana Karakter (Işıksoft; "tamamen çevrimdışı", "Reklamları Kaldır" tek seferlik), Bir TC Simülasyonu (Tiamo; **2,8★ / 26 oy**), TC Simülasyonu 2 (App Store "yakında", Play'de yayında). | TR'de arz zayıf ve puanlar düşük; "hayat simülasyonu" + "hayat koçu" ikilisi Motto için açık alan. |
| **hayat koçu / life coach** | Arama özetinde oyun yok; kategori "sağlık/fitness" ve "üretkenlik" uygulamalarının. | Aynı. | Oyun sınıfında rakipsiz; kelime Motto'nun bileşik adında (0.1) zaten var → ücretsiz farklılaşma terimi. |

### 1.2 Top-10 başlık / alt başlık kalıpları (ABD)

| # | Mağaza başlığı | Alt başlık / tanım satırı (özet görüntüsü) | Puan / oy (görüntü tarihi 2026) | Kalıp |
|---|---|---|---|---|
| 1 | BitLife - Life Simulator | "Life Simulator"; açıklama: "the original text-based life simulator… roleplay your life, your way" | 4,8 / 1,8 M | Marka + tire + kategori |
| 2 | AltLife - Life Simulator | "Your Choices, Your Life" (fragman sloganı) | 4,7 / 1,2 K (iOS); Play 4,5 / 82,1 K | Marka + tire + kategori |
| 3 | ALTER EGO | "self-discovery clicker game" | 4,9 / ~14 K (iOS); Play 4,8 / 1,44 M | Marka tek başına; kategori dışı konum |
| 4 | The Life Simulator (Mind Vacation) | "Realistic Life Simulation Game" | 4,5 / ~21 K | Jenerik ad = anahtar kelime |
| 5 | Life Choices: Life Simulator (Unico) | "interactive life game… family friendly" | Play 4,3 / 69,6 K | Marka : kategori |
| 6 | Life Sim: Real Life Simulator (Biddulph) | "Career, Family & Business RPG" | 4,6 / 4,6 K | Kısaltma : uzun kategori |
| 7 | Idle Guy: Life Simulator games | — | 4,8 / 73 K | Marka : kategori + "games" |
| 8 | 100 Years - Life Simulator | — | Play 4,3 / 163 K | Sayı + tire + kategori |
| 9 | Life Simulator: Roleplay Sim (A. C. Güven) | TR adı "Life Simulator: Hayat Oyunu" | 4,3 / 788 | Kategori : alt tür |
| 10 | SimLife: Life Simulator Game | "school, relationships, careers, and crime" | 4,6 / 82 | Marka : kategori + "game" |

Gözlemler:
- **9/10 başlıkta "Life Simulator"** geçiyor. Başlıkta "Life Simulator" olmayan tek oyun (Alter Ego) kümenin en yüksek puanlısı ve Play'de en çok yorum alanı; yani terim **keşif** için şart, **kalite sinyali** için değil.
- Alt başlıklar iki tipte: (a) duygusal slogan ("Your Choices, Your Life"), (b) özellik listesi ("Career, Family & Business RPG"). Apple'ın alt başlığı 30 karakter; (b) tipi anahtar kelime kazandırıyor.
- Ekran görüntüsü yazıları: BitLife'ınkiler doğrudan görülemedi (apps.apple.com erişimi yok). Sektör rehberleri 2026 için ortak formül: 3–8 kelime, fiil-başlangıçlı ("Choose…", "Build…", "Age up…"), fayda odaklı; **Apple'ın ekran görüntüsü yazılarını arama indeksine aldığı** (Stora, Mayıs 2026; LaunchAssetKit) raporlanıyor → ekran görüntüsü yazıları artık "dördüncü anahtar kelime alanı".
- TR mağazasında **başlık yerelleştirmesi norm**: Unico "Seçimler", Güven "Hayat Oyunu", Candywriter "Yaşam simülatörü". Motto'nun TR bileşik adı (*Motto: Sertifikasız Hayat Koçu*) bu normla uyumlu; ama "simülasyon" kelimesi başlıkta yok → **alt başlığa** alınmalı.

### 1.3 Motto için ASO kararı

| Alan | EN (30 kr sınırı) | TR (30 kr sınırı) | Gerekçe |
|---|---|---|---|
| Başlık | **Motto: Uncertified Life Coach** (28) | **Motto: Sertifikasız Hayat Koçu** (29) | §0.1 kararı; "life coach / hayat koçu" oyun sınıfında rakipsiz. |
| Alt başlık | **Day-by-day life simulator** (25) | **Gün gün hayat simülasyonu** (26) | "life simulator" baş terimi alt başlıktan alınır; "day-by-day" D-061'in tek kelimelik vaadi. |
| Anahtar kelime alanı (100 kr) | life sim,text,story,choices,dark comedy,roast,career,relationships,death,report card,streak,offline | hayat simülatörü,yaşam,seçim,kara mizah,kariyer,ilişki,ölüm,karne,çevrimdışı,hikaye | Rakip marka adı yok (Apple 2.3.7). "offline/çevrimdışı" Ana Karakter'in TR'de övülen vaadi. |
| Ekran görüntüsü yazıları (indekslenir) | "Your coach bets against you." · "Every day, one event." · "Characters talk back." · "Die. Get roasted. Start over in 40 s." · "No forced ads. Even the coach is surprised." | "Koçun sana karşı iddiaya girer." · "Her gün bir olay." · "Karakterler cevap verir." · "Öl. Roast'lan. 40 saniyede yeni hayat." · "Zorunlu reklam yok. Koç bile şaşırdı." | 5 görüntü = 5 imza mekanik; her biri 3–8 kelime; "no forced ads" küme B §8'in 3. çıkarımı. |
| Açıklama ilk satırı | "The life sim where time flows on its own and your coach keeps the receipts." | "Zamanın kendi kendine aktığı, koçunun her kararını deftere yazdığı hayat simülasyonu." | "text-based" ikinci cümlede. |

**Karar:** Al — top-10'un "Marka: kategori" kalıbı; Uyarla — kategori kelimesi başlıkta değil alt başlıkta; Alma — "BitLife" veya "games like" ifadeleri.

---

## 2. Fiyat matrisi — top-10 hayat siminde her IAP noktası (USD · TRY)

### 2.1 Tam matris

| Uygulama | Kalem | USD | TRY (gözlenen / ≈ tahmin) | Tür | Kaynak / not |
|---|---|---|---|---|---|
| **BitLife** | Time Machine Use | 0,99 | ₺39,99 (eski) → ₺49,99 | Tüketilebilir | TR listesi iki görüntü |
| BitLife | Remove Ads | 2,99 (eski 7,99) | ≈ ₺149,99 | Tek seferlik | Küme A |
| BitLife | Bitizenship | 7,99 (listede 2. giriş 9,99) | ₺349,99 → ₺399,99 | Kalıcı premium | Aynı sayfada iki giriş; reklamsız + perk |
| BitLife | God Mode | 9,99 (eski 8,99) | ₺349,99 → ₺399,99 | Kalıcı | Stat düzenleme |
| BitLife | Bitizenship + God Mode | 15,99 (eski 12,99 / 13,99) | ₺599,99 → ₺799,99 | Paket | Nisan 2026'dan beri varsayılan seçili |
| BitLife | Boss Mode | 20,99 (eski 11,99 → 15,99 → 19,99) | ₺799,99 → ₺899,99 | Paket (tüm Job Pack'ler) | Expansion Pack'ler dahil değil |
| BitLife | Expansion Pack (×10: Landlord, Investor, C.U.L.T., Black Market, Casino, Zoo, Secret Agent, Racing, Outdoor, Movie Director) | 7,99 (eski 4,99) | ₺249,99–₺399,99 | Kalıcı içerik | TR görüntüsünde ₺249,99 |
| BitLife | Job Pack (×10) | 1,99 → 4,99 → 6,99 | — | Kalıcı içerik | Boss Mode'a dahil |
| BitLife | Ultimate Fighter Mode | ≈ 9,99 | — | Kalıcı | Haziran 2026 |
| BitLife | Challenge Vault | 4,99 | — | Kalıcı | Eski haftalık challenge'lar |
| BitLife | Seasons / BitPass | — | — | Battle pass | **Kaldırıldı** (Ağu 2026) |
| **BitLife GO!** (TR görüntüsü) | Bitizenship · Godmode · Bossmode · Athlete · Time Machine · Combo Pack | — | ₺399,99 · ₺399,99 · ₺999,99 · ₺249,99 · ₺49,99 · ₺699,99 | — | Aynı içerik, farklı fiyat; TR'de ana BitLife'tan pahalı |
| **AltLife** | Premium Membership (Permanent) | 9,99 (BR: R$ 59,90) | ≈ ₺399,99 | Kalıcı premium | v35'ten beri tek seferlik |
| AltLife | Premium Membership Limited | (EU: €2,99) | ≈ ₺149,99 | Süreli | Yalnızca EU görüntüsünde |
| AltLife | Ultimate AltLife Bundle | **49,99** (EU €19,99; BR R$ 119,90) | ≈ ₺2.499,99 | Paket | Bölgeye göre 2,5× fark — en tutarsız fiyat |
| AltLife | 750 Life Points · 2.000 Life Points | 4,99 · 9,99 | ≈ ₺249,99 · ₺399,99 | Para birimi | Yorum: restore sorunu |
| **ALTER EGO** | Reklam kaldırma | 2,99 | ≈ ₺149,99 | Tek seferlik | Küme B |
| ALTER EGO | The Ego and the Id (ID) · (AE) | 4,99 · 6,99 | ≈ ₺249,99 · ₺349,99 | Son/bölüm açma | "never forced on us" |
| ALTER EGO COMPLEX | Uygulama fiyatı | 4,99 (ücretli app) | ≈ ₺249,99 | Premium app | "shorter than I thought for the price point" |
| **The Life Simulator** (Mind Vacation) | Revive | 0,99 | ≈ ₺49,99 | Tüketilebilir | Ölümü geri al |
| The Life Simulator | Unlock Sandbox mode · Unlock All Perks | 2,99 · 2,99 | ≈ ₺149,99 | Kalıcı | |
| The Life Simulator | Youth Elixir | 4,99 | ≈ ₺249,99 | Tüketilebilir | |
| The Life Simulator | Unlock All Content | 9,99 | ≈ ₺399,99 | Kalıcı premium | |
| **Life Choices** (Unico) | Remove Ads | ≈ 2,99–3,99 ("$3 on sale") | ≈ ₺149,99–199,99 | Tek seferlik | "$3 spent for nothing at all" |
| **Life Sim: Real Life Simulator** (Biddulph) | — | — | — | Yalnız reklam | Reklamsız IAP **yok** (şikâyet) |
| **Idle Guy** | Reklamsız paket | ucuz (≈ 2,99) | ≈ ₺149,99 | Tek seferlik | Küme B |
| **100 Years** | Reklam kaldırma | 2,99 | ≈ ₺149,99 | Tek seferlik | |
| **ReLife** | RePass | ≈ 3,99–4,00 / ay | — | **Abonelik** | God mode + reklamsız + bulut + olaylar; "strictly monthly" şikâyeti |
| ReLife | Tekil IAP | 3,99–5,49 | — | Kalıcı | |
| **SimLife** | God Mode Forever | 7,99 (EU €8,99) | ≈ ₺349,99 | Kalıcı | Tek kalem |
| **Life Simulator: Roleplay Sim** (Güven) | Fistful of Gems · Fountain of Gems | 1,99 · 6,99 | ≈ ₺99,99 · ₺349,99 | Para birimi | |
| Roleplay Sim | Remove Ads · Premium Bundle | 3,99 · 4,99 | ≈ ₺199,99 · ₺249,99 | Tek seferlik | |
| **Another Life** | 250 · 500 · 1.000 LifePoints | 5,99 · 9,99 · 16,99 | ≈ ₺299,99 · ₺399,99 · ₺799,99 | Para birimi | 4,0★ iOS / 3,3★ Play |
| Another Life | Remove Ads Forever | 4,99 | ≈ ₺249,99 | Tek seferlik | |
| **Life Simulator - Business Game** (Khaleeq) | Remove All Ads | **14,99** | ≈ ₺699,99 | Tek seferlik | Rafın en pahalı reklam kaldırması |
| Business Game | Perma Income Mini / Mega / Ultra | 2,99 / 9,99 / 29,00 | ≈ ₺149,99 / ₺399,99 / ₺1.399,99 | Kalıcı gelir boost | "pay to progress" |
| **Infinite Life Simulation** | Career Jetpack · Golden Career Pass | 0,99 · 2,99 | ≈ ₺49,99 · ₺149,99 | Kısayol | Eski abonelik katmanları kaldırıldı |
| **TC Simülasyonu** (TR) | Politika / Girişimcilik paketleri | — | (Play TR; görüntü yok) | İçerik paketi | Küme B |

### 2.2 Fiyat noktası sıklığı (kaç uygulamada hangi nokta var)

| Nokta (USD) | Uygulama sayısı | Tipik kalem | Oyuncu tepkisi |
|---|---|---|---|
| 0,99 | 4 | Ölümü geri al / tek kullanım / jetpack | "pay a dollar to undo death" — ucuz ama ilkesel itiraz |
| 1,99–2,99 | 9 | Reklam kaldırma, küçük açılım | **En az tartışılan**; "$2,99 remove ads" kabul görüyor |
| 3,99–4,99 | 8 | Reklam kaldırma (pahalı uç), bölüm açma, küçük premium | $4,99 reklam kaldırma sorgulanıyor (CatLife "not worth") |
| 5,99–6,99 | 4 | Para birimi küçük paket, Job Pack | "cash grab" kelimesi burada başlıyor |
| 7,99–9,99 | 7 | **Kalıcı premium** (Bitizenship, AltLife Premium, SimLife God Mode, Unlock All Content, God Mode) | **Kabul edilen çıpa**; şikâyet fiyat değil "restore çalışmadı" |
| 14,99–16,99 | 4 | Paket (Bitizen+God), 1.000 LifePoints, Remove All Ads (Business Game) | "pay to use portions are not fairly priced" |
| 19,99–20,99 | 1 | Boss Mode | "relabeled as an expansion pack so people would pay more" |
| 29,00–49,99 | 2 | Ultimate Bundle, Perma Income Ultra | Sessiz (az alıcı); bölgesel tutarsızlık |
| Abonelik | 2 (ReLife, eski Infinite Life) | God mode + reklamsız | "strictly as a monthly subscription" — küçük stüdyoda bile tepki |

### 2.3 TR fiyat gözlemi

- Candywriter TR'de **USD paritesine yakın** fiyatlıyor (₺349,99 ≈ $7,99 katmanı; ₺999,99 ≈ $20,99). Yerel indirim yok; BitLife GO! ana uygulamadan bile pahalı (Bossmode ₺999,99 vs ₺899,99).
- TR'li yerli oyunlar (Ana Karakter, ZipLife, TC Simülasyonu) "Reklamları Kaldır" tek kalemle gidiyor; fiyat görüntüsü yok ama konum "ucuz tek ödeme".
- **Motto kararı (küme B §5 ile tutarlı):** "Sertifika" kalıcı premium **$7,99 / ₺349,99** (Apple katmanı). Reklam kaldırma kalemi **yok** (zorunlu reklam olmadığı için kaldırılacak şey yok — mağaza metninde açıkça yazılır). İkinci kalem **Torpil** (ikinci koç kişiliği + kozmetik) **$4,99 / ₺249,99**. Para birimi, abonelik, ölümü geri alma, kariyer paywall'u: **yok**. Toplam sepet ≤ $12,98 → rafın "her şeyi al" sepetinin (BitLife $100+) onda biri; bu sayı pazarlama cümlesi olur.

---

## 3. Yorum madenciliği — 1 yıldız ve 5 yıldız temaları (küme geneli, 60+ alıntı)

Alıntılar mağaza yorumları (App Store US/UK/ZA, Google Play), Metacritic, GameFAQs, AppleVis, Common Sense, GameSkinny ve askapp/AppGrooves özetlerinden. Uygulama adı parantezde; "A" / "B" işaretli olanlar küme A/B dosyalarından (aynı gün, kaynaklı) alındı.

### 3.1 1 yıldız / düşük puan temaları (sıklığa göre)

**T1 — Reklam sıklığı ve yerleşimi (kümenin açık ara 1 numarası; BitLife, Life Choices, Idle Guy, Biddulph, CatLife, 100 Years)**
1. *"the amount of ads make it unenjoyable"* (BitLife, Play 2025) [A]
2. *"ads show up on nearly every action"* (BitLife, App Store) [A]
3. *"getting ads every two minutes"* · *"unskippable ads popping up every five minutes"* (BitLife) [A]
4. *"There are ads around every corner."* (BitLife, Play ~2026)
5. *"For me at least, when I watch an ad to get a choice or path, it will give me another immediately after giving me the reward. I age, go to do something else more in depth and boom another ad."* (BitLife, Play)
6. *"You want to buy someone a gift? 40 second ad."* (BitLife, Play) [A]
7. *"This is not a good move and would get me to stop supporting bitlife should you put more ads and continue ads on basic interactions through the app."* (BitLife, Play; "Spend Time With All" reklamı)
8. askapp özeti: *"Many players argue there have been updates requiring ads for activities that never had them previously."* (BitLife)
9. *"The developer could keep players longer if they didn't show an ad every 30 seconds."* (Life Choices) [B]
10. *"all the good choices were only possible to choose by watching multiple Ads"* (Life Choices, App Store)
11. *"unprompted ad after only a few taps … cash grab"* (Life Sim: Real Life) [B]
12. *"ad harvesting 'game' that basically forces you to watch ads to win"* (Idle Guy) [B]
13. *"Too many ads, everything is way too expensive"* (CatLife) [A]
14. *"there are a lot of ads, even when you turn your wifi off"* (BitLife, Metacritic) [A]

**T2 — "Ödedim, reklam geri geldi" / restore güven kırılması (BitLife, Life Choices, AltLife, CatLife)**
15. *"I paid the one-time payment so I wouldn't have to deal with ads in the game, then suddenly with the new update, it's not counting it anymore."* (BitLife, Play)
16. *"after reinstalling, their purchases said they were restored, but none of them were"* (BitLife, App Store) [A]
17. Bitizen'e ≈ 5,50 € ödedikten sonra reklamlar geri geldi — *"waste of money"* (BitLife) [A]
18. *"$3 spent for nothing at all"* (Life Choices; reklamsız satın alma sonrası reklam) · *"Apple is refusing my refund"* (Life Choices)
19. Reklamsız satın alma sonrası reklam: *"it's literally posted on my transactions"* (Life Choices, Play)
20. AltLife Android: yeniden kurulumdan sonra restore çalışmadı, kalemleri **yeniden satın almak** zorunda kaldı (AppBrain yorumu)
21. *"bought top cat, but then accidentally deleted the app"* (CatLife; restore) [A]

**T3 — Paywall / fiyat / model değişikliği (BitLife, AltLife, ReLife, Business Game)**
22. *"there's 40 other payments needed to access any and every game feature"* (BitLife, App Store) [A]
23. *"everything costs money"* (BitLife, 2024) · *"the DLC packs are the only downside"* [A]
24. *"paid for boss mode to get all future job packs… relabeled as an expansion pack so people would pay more"* (BitLife, X yanıtı Eyl 2026) [A]
25. *"You can pay a dollar to undo death or go back years for one life"* (BitLife, Metacritic) [A]
26. *"the ads are ridiculous and the pay to use portions are not fairly priced"* (AltLife) [B]
27. *"certain things like godmode, top bar reordering, more events, etc that are only available with the RePass which is strictly as a monthly subscription"* (ReLife) [B]
28. *"I was looking for alternatives to bitlife bc there are sooo many ads and everything costs too much"* (AltLife Play yorumu; BitLife'tan kaçış gerekçesi)
29. *"a lot shorter than I thought it would be for the price point"* (ALTER EGO COMPLEX, $4,99)

**T4 — Tekrar / sığlık / "aynı kararlar" (BitLife, Life Choices, DogLife, Alter Ego, Roleplay Sim)**
30. *"the game gets kinda repetitive once you account for the paid DLC"* (BitLife, Metacritic) [A]
31. *"grows quite repetitive and tiresome rather quickly"* … *"painfully easy to 'beat'"* (BitLife, GameFAQs Oca 2026) [A]
32. *"it's seemingly unlimited, making it very easy to manage stuff and really diminishes the strategic nature of this game"* (BitLife, GameFAQs 2026; para/stat sınırsızlığı) [A]
33. *"The decisions are the same for every life, so it stops being fun."* (Life Choices) [B]
34. *"underwhelming simulation title… isn't very engaging, with repetitive gameplay"* (DogLife, Hardcore Droid) [A]
35. *"a glorified idle game with little more than cutscenes every so often"* · *"choices took too long to matter"* (ALTER EGO) [B]
36. *"many features barely connect to the core gameplay"* (Life Sim: Real Life) [B]
37. Roleplay Sim: oyun "incomplete", iş ve eğitim seçenekleri sınırlı (App Store)
38. *"very quickly lost its appeal"* (BitLife; itch.io'da Verdant yorumu yapan 2018'den beri oyuncu)

**T5 — Bug / kayıt kaybı / donma (AltLife, Life Choices, Another Life, LifeSim)**
39. AltLife: oyun karakteri **iki kez yıllarca geriye** sıfırladı, "saving feels random" (Play)
40. *"the life I try to switch to is overwritten by the life I'm switching from"* (Another Life, App Store)
41. Life Choices: "freezing, crashes, and unresponsive choices" (AppGrooves 1–3★ özeti)
42. *"action button that sometimes doesn't register"* (AltLife) [B]
43. *"felt rushed and many issues were left unfixed"* (LifeSim/RoboBot) [B]
44. *"the modal windows are improperly coded… extremely clunky and hard to navigate"* (BitLife, AppleVis VoiceOver) [A]

**T6 — Yerelleştirme ve temsil (BitLife GO TR, Life Choices, TC Simülasyonu)**
45. "Türkçe çevirinin yetersiz" (BitLife GO!, TR App Store yorum özeti)
46. Life Choices: "false advertising about language options", *"the English broken"* (AppGrooves özeti)
47. *"No economic inflation, no reference to turkish traditions at all."* (TC Simülasyonu) [B]
48. Oyuncu "oynanabilir Filistin" istiyor (BitLife) — ülke/temsil talepleri sık [A]

**T7 — Ebeveyn/ton (BitLife)**
49. *"not what I want as part of my 15 year old's reality at all"* (Common Sense ebeveyn) [A]

### 3.2 5 yıldız temaları (sıklığa göre)

**P1 — "Addictive / hours fly / one more" (BitLife, AltLife, Idle Guy)**
50. *"you can play for several hours and you won't even notice how they fly by"* (BitLife, Metacritic) [A]
51. *"quite addictive and fun to play"* (BitLife) · *"interesting and addictive"* · "play it every day" (AppGamer)
52. 5+ yıldır telefonunda: *"a good game to play at any time"* (BitLife, App Store 2024)
53. *"the ads are too many but tolerable as I'm getting something out of it"* (Idle Guy) [B] — reklam kabulünün koşulu

**P2 — Çeşitlilik ve sürekli güncelleme (BitLife, AltLife)**
54. *"a lot of options for what to do and various outcomes"* (BitLife) [A]
55. *"with constant updates, it has become so much better with so much more variety"* (BitLife, Metacritic) [A]
56. *"Best Simulator out there"* (BitLife) [A]
57. *"the game has a few more cash-grabs, but it is free and that makes up for it"* (BitLife, Metacritic) [A]

**P3 — "BitLife'tan daha derin / daha az reklam" (AltLife, ReLife, Infinite Life)**
58. *"This game is better than bitlife imo."* (AltLife, Play)
59. *"This is an incredible upgrade to Bitlife. It's much more challenging and makes you work up to the jobs a lot more. The relationships are much more fleshed out."* (AltLife, Play)
60. *"Much more to do than BitLife, much less ads on the free version, and personally I think the UI is much better"* (AltLife, App Store)
61. *"avatar customization, items that actually matter, influencer career & crypto/real estate system are WAY better than Bit Life"* (AltLife) [B]
62. GameSkinny: *"Compared to the other BitLife clones, AltLife is much less aggressive with ads."*
63. *"This game is better than bit life, but it still needs some things added."* (ReLife) [B]
64. *"fewer ads and fewer microtransactions than similar games"* (Infinite Life) [B]

**P4 — Duygu, anlam, karakter (ALTER EGO ailesi)**
65. *"10/10 by far the best mobile game on the market"* (ALTER EGO, App Store)
66. *"beautiful music that both relaxes and slightly uneases you at times"* (ALTER EGO)
67. *"I never thought that a mobile game would make me rethink my life choice."* (ALTER EGO COMPLEX)
68. *"Part idle game, part visual novel, and part personality test, it's one of the most memorable games I've played in a long time."* (ALTER EGO) [B]
69. *"these purchases are never forced on us, and they're not necessary to finish or enjoy the game"* (ALTER EGO) [B]
70. *"you can finish the game in under a week without spending a cent"* (ALTER EGO) [B]

**P5 — Dürüst para modeli / "earned in-game" (SimLife, LifePop, ALTER EGO)**
71. *"your money is all earned in-game"* · *"one bad roll never costs you the life you wanted"* (SimLife) [B]
72. *"Passes do not lock jobs or content behind payment, they only let you skip stat requirements."* (Infinite Life geliştirici notu, övgüyle alıntılanmış) [B]
73. *"definitely worth the $4, since the paid version removes ads and lets you continue a family tree"* (BitLife, eski fiyat) [A]

**P6 — Tempo ve ton (Biddulph, Life Choices, Alter Ego)**
74. *"doesn't hold your hand. No predictable outcomes. No 'safe' choices"* (ReLife) [B]
75. *"not overly complicated and makes you work smart to achieve a good income"* (Life Sim: Real Life, App Store)
76. *"lack of the vulgarity found in some similar games"* (Life Sim: Real Life) [B]
77. "cute and fun" · "top 5 of simulator games" · "liked that it had no ads" (Life Choices, Play)
78. *"The game is so relaxing and fun."* (Life Choices 2) [B]
79. *"deaths got weirder, businesses got funnier"* (SimLife güncelleme övgüsü) [B]

### 3.3 Kümeleme sonucu ve Motto'ya bağlanan kurallar

| Tema | 1★ payı (tahmini, alıntı sıklığına göre) | Motto'da bağlayıcı karar | Durum |
|---|---|---|---|
| T1 Reklam sıklığı | ~%35 | Zorunlu reklam yok; opt-in yalnızca Telafi gibi gerçek değer anlarında (küme B §7) | Karar var |
| T2 Ödedim-geri-geldi / restore | ~%20 | Tek kalıcı IAP; restore akışı Sprint 0 test listesine **zorunlu** (iOS + Android, yeniden kurulum, cihaz değişimi) | **Teste eklenecek** |
| T3 Paywall / model değişimi | ~%15 | Kariyer/içerik paywall'u yok; fiyat listesi sabit, "pack → expansion" tipi yeniden etiketleme yasak (mağaza metninde vaat) | Karar var |
| T4 Tekrar | ~%15 | Director (neg seri ≤ 2, novelty), Tanıdık Yüzler hafızası, Fazla Bagaj callback, 3 hayat aynı #1 → Kronik | Karar var; içerik hacmi §7'ye bağlı |
| T5 Bug/kayıt | ~%10 | Her beat'te autosave; harness testleri | **Teste eklenecek** |
| T6 Yerelleştirme | ~%5 | TR+EN eşit, transcreation; "Türkçe çeviri yetersiz" kümenin açık yarası | Karar var |
| P1 "one more" | — | Yıl medyanı 90 sn; "Bir Yıl Daha" tek buton | Karar var |
| P2 Sürekli güncelleme | — | Haftalık Antrenman Kampı offline seed; aylık içerik paketi takvimi | Takvim Sprint planına |
| P4 Duygu/karakter | — | Koç karakteri + Tanıdık Yüzler; Roast Raporu'nda "haklı çıktığın 1 an" | Karar var |
| P5 Dürüst model | — | "Zorunlu reklam yok. Koç bile buna şaşırdı." mağaza satırı | Karar var |

---

## 4. Özellik sıklığı tablosu — top-10'da hangi özellik kaç uygulamada

Top-10: BitLife, AltLife, ALTER EGO, The Life Simulator, Life Choices, Life Sim: Real Life, Idle Guy, 100 Years, ReLife, LifePop. (+ işaretli sütun: SimLife ve Roleplay Sim de dahil edildiğinde.) ✓ = doğrulandı (mağaza/wiki/yorum), ○ = kısmi, — = yok, ? = görüntüde doğrulanamadı.

| Özellik | BitLife | AltLife | ALTER EGO | Life Sim (MV) | Life Choices | Biddulph | Idle Guy | 100 Years | ReLife | LifePop | **Top-10 sayısı** | Motto |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Meslek/kariyer merdiveni | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **9/10** | ✓ (D-067 Durum: İş) |
| İlişkiler (flört/evlilik/aile) | ✓ | ✓ | ○ (tek karakter Es) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **9/10 + 1○** | ✓ (akışta konuşur) |
| Suç / hapis | ✓ | ✓ | — | ○ (kumar) | ○ (şeytan yolu) | ? | ? | ? | ✓ | ✓ (casus) | **5/10 ✓ + 2○** | ○ (küçük suç, T9 filtresi) |
| Evcil hayvan | ✓ | ✓ | — | ? | ? | ✓ | ? | ? | ? | ? | **3/10 doğrulanan** | ✓ (Pamuk/Biscuit, Varlık) |
| Miras / nesil / "continue as child" | ✓ (Generations) | ○ | — | — | — | — | — | — | ? | ? | **1/10 ✓** | ○ (kalıp mirası; "annen de erteliyordu") |
| Haftalık challenge / sezon takvimi | ✓ | ? | — | — | — | ○ (kilometre taşı) | — | — | ○ (Life Awards) | ? | **1/10 ✓ + 2○** | ✓ (Antrenman Kampı, offline seed) |
| God Mode / geri sarma / sandbox | ✓ | ○ (premium) | — | ✓ (Sandbox) | — | — | — | — | ✓ (RePass) | ? | **3/10 ✓ + 1○** (+SimLife) | — (Alma) |
| NPC diyalog / chat UI | — (menü) | — | ✓ (Es konuşur) | — | — | — | — | — | — | ○ (Poppit AI) | **1/10 ✓** | ✓ (D-062 imza) |
| Gerçek zaman / idle akış | — | — | ✓ (idle) | — | — | — | ✓ (sayaç) | — | — | — | **2/10** | ✓ ama farklı (D-066: kendi akar, bekleme yok) |
| Gün tabanlı tur | — | — | — | — | — | ✓ | ○ | — | — | — | **1/10** | ✓ (D-061) |
| Anlatıcı persona (karakterli ses) | — (journal tonu) | — | ✓ (Es) | — | ○ (melek/şeytan) | — | — | — | — | — | **1/10 ✓** | ✓ (Motto) |
| Avatar / görünüm özelleştirme | ○ (Bitizen görünüm) | ✓ | — | ? | ○ (kart art) | — | ✓ (3D) | ✓ (3D) | ? | ✓ (fotoğraf albümü) | **4/10 ✓** | — (NPC avatarı var; oyuncu avatarı yok) |
| Mini-oyun | ✓ (prison escape, UFM) | ✓ (dövüş) | — | ○ (kumarhane) | — | — | — | ✓ (seviye) | ✓ (balık) | ✓ (17) | **5/10 ✓** | ○ (tek mini-oyun: göz teması) |
| Paylaşım kartı / dışa aktarma | ✓ (mezar taşı) | ? | ✓ (kişilik sonucu) | — | — | ○ (liderlik) | — | — | — | ? | **2/10 ✓** | ✓ (Karne, Roast Raporu, Motto kartı) |
| Başarım / ribbon koleksiyonu | ✓ (100+ / ribbon) | ✓ | ○ (kitaplar) | ? | ✓ (kasaba) | ✓ (24+) | ? | ? | ✓ | ✓ | **6/10 ✓** | ✓ (Teşhis, HAKSIZ ÇIKTIM) |
| Kalıcı tek premium IAP | ✓ | ✓ | ○ (son açma) | ✓ | — | — | — | — | — (abonelik) | ? | **3/10 ✓** | ✓ (Sertifika) |
| Reklamsız satın alma | ✓ | ○ (premium içinde) | ✓ | ? | ✓ | — | ✓ | ✓ | ○ | ? | **5/10 ✓** | — (kaldırılacak reklam yok) |
| Sanal para birimi satışı | — (Bits kaldırıldı) | ✓ (Life Points) | — | — | — | — | — | — | — | ? | **1/10** (+Another Life, Roleplay Sim) | — |
| Abonelik | — (BitPass kaldırıldı) | ○ (Limited) | — | — | — | — | — | — | ✓ | — | **1/10** | — |
| Çok dilli (TR dahil) | ○ (GO! TR) | — | ✓ (JP/EN/…) | ? | ✓ (TR adı) | — | ? | ? | ? | ? | **2/10 TR** | ✓ TR+EN |

**Okuma:**
- **Hijyen sütunları** (9–10/10): meslek, ilişki. Motto'da var; farklılaşma burada değil.
- **Orta sıklık** (5–6/10): suç, mini-oyun, başarım koleksiyonu, reklamsız IAP. Motto'da başarım koleksiyonu (Teşhis) tam, suç ve mini-oyun bilinçli olarak küçük.
- **Boş sütunlar** (≤ 2/10): NPC diyalog, gerçek zaman akışı, gün tabanlı tur, anlatıcı persona, paylaşım kartı, nesil/miras. **Motto'nun D-061, D-062, D-066 kararları ve koç personası tam bu sütunlara düşüyor** — rafta kimse dördünü birlikte vermiyor. Alter Ego (persona + idle + paylaşım) en yakın komşu ve kümenin en yüksek puanlısı; bu bir tesadüf değil.
- **Sanal para ve abonelik** rafta azınlık ve her görüldüğü yerde şikâyet üretiyor; BitLife'ın kendisi ikisini de (Bits, BitPass) 2026'da kaldırdı.

---

## 5. Boşluklar — oyuncuların istediği, kimsenin vermediği

Kaynak: mağaza yorumları, itch.io (Verdant yorumu, 2018'den beri BitLife oyuncusu), Metacritic/GameFAQs, AppleVis, TR yorumları. Reddit teyidi yok (bkz. yöntem notu).

| # | İstek (oyuncu dili) | Kanıt | Rafta en yakın cevap | Neden boş | Motto cevabı |
|---|---|---|---|---|---|
| G1 | **Kardeş, büyükanne, kuzen, dayı — geniş aileyle etkileşim** | itch.io: "interacting with siblings, extended family (grandparents, cousins, aunts and uncles)"; AltLife: "no co-workers", "can't ask out classmates" | BitLife menüde kardeş/ebeveyn var ama etkileşim "spend time / gift / insult" listesi | Menü tabanlı ilişki = liste yorgunluğu; diyalog yok | 8 Tanıdık Yüz (Anne, Dayı, Şükran Teyze, Yağmur…) **akışta konuşur** (D-062); Aile Grubu kartı yılların %40'ında; dayı "2009'da yaşıyor" satırı ilk 30 sn'de |
| G2 | **Kişisel hayatı etkileyen rastgele olaylar, ekonomiyi değil** | itch.io: "more random events that effect your personal life rather than just the economy"; Biddulph: "features barely connect to the core" | BitLife olay pop-up'ları var ama çoğu stat deltası; Alter Ego olayları anlamlı ama az | Olay yazımı pahalı; klonlar sistem ekliyor, olay değil | D-061 "her gösterilen günde tam bir olay"; olaylar Durum şeridini (iş, ev, ilişki, varlık) kalıcı değiştirir (D-067) |
| G3 | **"Aynı kararlar her hayatta" tekrarına çare** | Life Choices: "decisions are the same for every life"; BitLife: "repetitive… painfully easy to beat"; "very quickly lost its appeal" | ReLife "no safe choices"; SimLife "deaths got weirder" güncellemeleri | Rastgelelik ≠ yenilik; hafıza yok | Tanıdık Yüzler `metaMemories`, Fazla Bagaj callback, Kronik Teşhis, director novelty; **ilk hayat elle yazılmış, sonrakiler hatırlar** |
| G4 | **Reklamsız ve dürüst model; "ödediğim sayılsın"** | T1+T2 = 1★'ların yarısından fazlası; AltLife övgüsü "much less ads" | AltLife, Alter Ego, Life in Text (reklamsız) | Reklam geliri; küçük stüdyoda bile "restore" bug'ı | Zorunlu reklam yok; tek premium; restore test zorunlu; mağaza satırı |
| G5 | **Yerel doku (TR: enflasyon, kira zammı, gelenek, aile grubu)** | TC Simülasyonu: "No economic inflation, no reference to turkish traditions at all."; BitLife GO "Türkçe çeviri yetersiz" | TC Simülasyonu (1M+ indirme, 2,8–3,9★) | Çeviri ≠ transcreation; yerli oyunlar düşük kalite | TR locale eşit içerik: ayın 1'i maaş / 5'i kira, kombi ustası, aile grubu bildirimi (D-067) |
| G6 | **Daha çok ülke / temsil** | BitLife "playable Palestine"; itch.io "more countries to live" | BitLife ülke listesi (bayrak) | Siyasi risk | Alma — Motto'da ülke seçimi yok; şehir (Kadıköy/Cleveland) var; T9 gerçek siyaset yasağı |
| G7 | **Erişilebilirlik (VoiceOver)** | AppleVis: "modal windows are improperly coded… clunky" | Hiçbiri öne çıkmıyor | Öncelik dışı | Chat-UI doğası gereği lineer liste → VoiceOver dostu; Sprint 0 kabul kriteri |
| G8 | **Ölümün anlamlı olması, "ölümü satın alma" yerine** | "pay a dollar to undo death" itirazı; SimLife "one bad roll never costs you the life" övgüsü (ters uç) | BitLife Time Machine $0,99; SimLife God Mode | Gelir | Ölüm = Roast Raporu + Kondisyon açılımı; ≤ 40 sn yeni hayat; geri alma satışı yok |
| G9 | **Tempo: "hold your hand" yok, ama bekleme duvarı da yok** | ReLife övgüsü; Idle Guy/Alter Ego "come back every few days" şikâyeti | Gün tabanlı Biddulph enerji bütçesine bağlı; idle'lar sayaç | Oturum tasarımı | D-066: zaman kendi akar, bekleme satışı yok, "sen yokken" özeti zarf biriktirir |
| G10 | **Oyuna uzun ömür veren, bitmeyen sonuç sayfası (paylaşılabilir)** | BitLife mezar taşı paylaşımı organik TikTok; Alter Ego kişilik sonucu | 2/10 | Backend korkusu | Karne/Yılın Mottosu/Roast Raporu üçlüsü; Wordle modeli backend'siz |

**Hiçbir uygulama G1+G2+G3'ü birlikte vermiyor** (konuşan aile + kişisel olaylar + hatırlayan dünya). Bu üçlü Motto'nun pitch'inin ilk slaydı olmalı; ASO ekran görüntüsü 3 ("Characters talk back / Karakterler cevap verir") doğrudan G1'e konuşur.

---

## 6. Motto kopya listesi — 25 madde, sıralı (Al / Uyarla / Alma · Efor S/M/L · Beklenen etki)

Sıralama = (beklenen etki × kanıt gücü) / efor. Etki: ↑↑↑ retention/dönüşüm/paylaşım üzerinde doğrudan, ↑↑ dolaylı, ↑ hijyen. "Kaynak" = özelliği en iyi uygulayan uygulama.

| # | Özellik | Kaynak | Karar | Efor | Etki | Motto'da hâli / gerekçe |
|---|---|---|---|---|---|---|
| 1 | **Kalıcı tek premium, $7,99 / ₺349,99** | BitLife Bitizenship, AltLife Premium, SimLife | **Al** | S | ↑↑↑ (gelir) | "Sertifika": reklamsız vaat yerine içerik+Torpil; fiyat çıpası rafın kabul ettiği nokta; restore testi zorunlu |
| 2 | **Ölüm özeti paylaşım kartı** (mezar taşı / tek cümle) | BitLife tombstone, SimLife "mezar taşı özeti", Alter Ego sonuç | **Al** | S | ↑↑↑ (viral) | Roast Raporu'nun son ekranı = görsel kart; Wordle gibi emoji satırı; backend yok |
| 3 | **Haftalık challenge, sabit gün/saat** | BitLife (Cumartesi 15:00 EST) | **Al** | M | ↑↑↑ (D7/D30) | Antrenman Kampı: Pazartesi 00:00 yerel, offline seed, 40 hayali kohort; ödül kozmetik (BitLife'ın en çok konuşulan geri dönüş takvimi) |
| 4 | **"Sen yokken" dönüş özeti** | ALTER EGO idle dönüş | **Uyarla** | S | ↑↑ | Sakatlık Raporu: para değil **zarf** birikir; "come back to see currency" şikâyetini biriktirme hissiyle ikame eder |
| 5 | **Varlıkların olay havuzunu değiştirmesi** ("items that actually matter") | AltLife | **Al** | M | ↑↑ | D-067 Varlıklar şeridi: kedi aylık yer, araba kaza olayı açar, telefon aile grubunu getirir |
| 6 | **Mağaza metninde dürüst model satırı** | AltLife övgüsü, Alter Ego "never forced on us" | **Al** | S | ↑↑ (dönüşüm) | "Zorunlu reklam yok. Koç bile buna şaşırdı." — ekran görüntüsü 5 ve açıklama 2. cümle |
| 7 | **NPC'lerin kendi hayatı var** (iş değiştirir, hastalanır, ölür) | BitLife Relationships | **Al** | M | ↑↑ | Tanıdık Yüzler yaşlanır; Şükran Teyze ölür, koç "ben oradaydım" der |
| 8 | **Başarım/ribbon koleksiyonu, roast tonlu** | BitLife ribbons (100+), Life Choices kasaba | **Al** | M | ↑↑ | Teşhis etiketleri 30 → 120; HAKSIZ ÇIKTIM koleksiyonu; meta nesne olarak "Koçun ofisi duvarı" (opsiyonel) |
| 9 | **Doğum/kimlik ekranında ilk şaka** | BitLife doğum satırı | **Al** | S | ↑↑ (FTUE) | §4.2: "Deniz Ertelemez. Soyadın bir vaat." (4. sn) |
| 10 | **Tek büyük ilerleme butonu + kısa tur** | BitLife "Age" (10–20 sn) | **Uyarla** | M | ↑↑↑ | D-066: buton yok, zaman akar; "Bir Yıl Daha" karne sonrasına taşınır; yıl medyanı 90 sn (BitLife'tan uzun ama bir olayla dolu) |
| 11 | **Kart kaydırma = cevap** (2 seçenekli günlerde) | Life Choices, Reigns, 1 in 8 Billion | **Uyarla** | S | ↑ | D-065; chat-UI içinde balonu sağa/sola kaydırma |
| 12 | **Hayat sonu "defining moments" + sayılar** | ReLife, Infinite Life, SimLife | **Al** | S | ↑↑ | Roast Raporu: 3 kalıp sayıyla + haklı çıktığın 1 an |
| 13 | **Alışkanlık/habit takibi → kişilik sonucu** | ReLife habits, Alter Ego kişilik testi | **Uyarla** | M | ↑↑ | Kalıp Dedektörü: görünmez `pattern` etiketleri; 3 hayat aynı #1 → Kronik; "sen busun" paylaşımı |
| 14 | **Ölümde "sonraki hayata ipucu"** | Roleplay Sim | **Uyarla** | S | ↑ | Koçun Son Sözü = yeni hayata iddia ("Gelecek hayatta da 23'te bırakacaksın. Bahse girerim.") |
| 15 | **Başlangıç senaryoları / perk** | The Life Simulator (15+ senaryo) | **Uyarla** | M | ↑↑ | Kondisyon: ölümle açılır, parayla değil; "Yedek Kulübesi" pity |
| 16 | **Gün tabanlı tempo, olaysız gün tek satır** | Biddulph | **Uyarla** | L | ↑↑↑ | D-061; enerji bütçesi yok; "11 gün geçti. Hiçbir şey olmadı; bu da bir olay." |
| 17 | **Flört profili kartı** (chat-UI içinde) | Roleplay Sim | **Uyarla** | S | ↑ | Kurgusal NPC profil kartı; gerçek uygulama/marka yok (T9) |
| 18 | **Hayatı dosya olarak dışa aktar** | 1 in 8 Billion (HTML kitap) | **Uyarla** | M | ↑ | Roast Raporu "Tam Dosya" PDF, backend'siz; Sertifika'ya bağlanabilir |
| 19 | **Çok dilli tek binary, yerelleştirilmiş başlık** | BitLife (Español kapanışı dersi), Unico "Seçimler" | **Al** | S | ↑↑ (TR keşif) | TR+EN tek app; TR başlık "Motto: Sertifikasız Hayat Koçu" + alt başlık "Gün gün hayat simülasyonu" |
| 20 | **Utoob yorum okuma beat'i** (sahte yorum kartı) | AltLife | **Uyarla** | S | ↑ | İçerik üreticisi kariyerinde "yorumlar" kartı; roast malzemesi |
| 21 | **Aylık tema paketi takvimi** (Villain Era, Blinged-Out Birthday) | BitLife bundle'ları | **Uyarla** | M | ↑↑ | İçerik takvimi (offline, tarih seed'li); kozmetik/olay paketi, kariyer paywall'u yok |
| 22 | **God Mode / Time Machine / yıl geri sarma** | BitLife, SimLife, Life Simulator Revive | **Alma** | — | — | İddia/kalıp dürüstlüğü değer önermesi; "pay a dollar to undo death" 1★ nedeni; yalnızca ücretsiz Sakatlık İzni (streak) |
| 23 | **Sanal para birimi / abonelik / battle pass** | AltLife Life Points, Another Life, ReLife RePass, BitLife BitPass | **Alma** | — | — | BitLife'ın kendisi Bits ve BitPass'i kaldırdı; "strictly monthly" şikâyeti küçük stüdyoda bile |
| 24 | **Rewarded reklamla iyi seçenek / zaman atlama** | Life Choices, Idle Guy | **Alma** | — | — | "Good choices only by watching multiple ads" kırmızı çizgi; D-055 bekleme satışı yasak |
| 25 | **Ülke seçimi, 3D sahne, 17 mini-oyun, LLM serbest metin** | BitLife ülkeler, 100 Years, LifePop, Infinite Life | **Alma** | — | — | T9 siyaset riski; kapsam; backend yok; Infinite Life 2,5★ Play kanıtı; tek mini-oyun kuralı (göz teması) |

**Efor toplamı (Al + Uyarla):** S×10, M×9, L×1. İlk 10 maddenin 7'si S/M ve hepsi mevcut kararlara oturuyor → Sprint 1–2'de bitirilebilir; L olan tek madde (#16 gün tabanlı tempo) zaten çekirdek karar.

---

## 7. Sprint 0 için açık doğrulama listesi (bu dokümanın tamamlayamadıkları)

1. **Reddit teyidi:** r/BitLifeApp ve r/AndroidGaming'de "I wish BitLife" / "games like BitLife" başlıkları — G1–G3 boşluklarının ikinci kaynakla doğrulanması.
2. **TR fiyatları:** AltLife, Alter Ego, The Life Simulator, Life Choices TR App Store sayfaları (bu ortamda apps.apple.com erişimi yoktu); "≈" ile işaretli TRY değerlerinin değiştirilmesi.
3. **BitLife ekran görüntüsü yazıları:** Apple'ın indeksleme değişikliği sonrası top-5'in ekran görüntüsü metinlerinin birebir dökümü (ASO aracı: AppTweak/MobileAction deneme sürümü).
4. **Apple Search Ads popülerlik puanı:** "life simulator", "life sim", "hayat simülasyonu", "hayat koçu" için gerçek skorlar (ASOTools'un Play verisi vekil).
5. **BitLife Kasım 2026 güncelleme notları** ve Seasons sonrası monetizasyon sayfasının güncel hâli.
6. **TC Simülasyonu / Ana Karakter / ZipLife yorum madenciliği (TR):** yerel dil şikâyet kümeleri; §5 G5'in TR tarafı için 20+ alıntı.

---

## 8. Kaynaklar (erişim: 2026-11-07, arama indeksi görüntüleri; apps.apple.com doğrudan fetch edilemedi)

Mağaza sayfaları: App Store US BitLife (id1374403536) · App Store TR BitLife · App Store TR BitLife GO! (id6738096599) · App Store US AltLife (id1567044511) · App Store BR/EE AltLife · Google Play AltLife (com.QmzApps.LifeStory) · App Store US ALTER EGO (id1447605099) · App Store US ALTER EGO COMPLEX (id1525336979) · App Store US The Life Simulator (id1439862818) · Google Play Life Simulator (com.mindvacation.lifesimulator) · App Store US Life Simulator: Roleplay Sim (id1546543821) · App Store TR "Life Simulator: Hayat Oyunu" · App Store US Life Choices (id1585419012) · App Store TR "Seçimler: Hayat Simülasyonu" · Google Play Life Choices (com.unicostudio.lifechoices) · App Store US Life Sim: Real Life Simulator (id1524045453) · App Store US Another Life (id1501803368) · Google Play Another Life · App Store US Life Simulator - Business Game (id1642838704) · App Store US SimLife (id6762402054) · App Store US LifePop (id6758164700) · App Store US Lifespan (id6758562482) · App Store US LiSi (id6782946848) · App Store TR ZipLife (id1670470668) · App Store Bir TC Simülasyonu (id1670750852) · App Store TR Ana Karakter: Yaşam Sim (id6797632918) · tcsimulasyonu.com · Google Play BitLife (com.candywriter.bitlife).

Yorum ve veri toplayıcılar: AppBrain InstLife · AppBrain AltLife · AppBrain Another Life · AppBrain Life Choices · AppGrooves Life Choices (negatif) · AppGrooves The Life Simulator · Metacritic BitLife user reviews · Metacritic Another Life · askapp.top BitLife (2025) · justuseapp BitLife reviews · AppGamer BitLife reviews · GameSkinny "Top 10 games like BitLife" · lifesim.com "Games like BitLife (2026)" · Droidrant · Apptopia Business Game.

ASO: ASOTools "second life" / "streamer" keyword case'leri · AppTweak screenshot best practices · Stora "Screenshot captions are now ASO keywords" (2026-05) · LaunchAssetKit caption formülleri · Semrush/MobileAction AI Keyword Inspector.

Topluluk: itch.io Verdant yorumu (BitLife oyuncusu istekleri) · itch.io text-based life sim etiketi · X/Twitter BitLife güncelleme duyuruları · ezechax.club God Mode rehberi.

Küme A ve B dosyaları (aynı gün): docs/research/12-app-store-teardown/A-bitlife-ailesi.md (47 kaynak) · B-bitlife-klonlari.md.
