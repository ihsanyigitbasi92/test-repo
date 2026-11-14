# B — BitLife Klonları ve Halefleri: App Store / Google Play Teardown

**Küme:** B (BitLife-tarzı klonlar, halefler ve 2025–2026 yeni gelenler)
**Tarih:** 2026-11-07
**Proje bağlamı:** Motto (docs/design/00-VIZYON-ve-KARARLAR.md §0, §4, §12) — gün-gün akan, roast eden hayat koçu anlatıcılı, NPC diyaloglu, kalıcı hayat durumlu kara-mizah hayat simülasyonu; TR+EN; iOS+Android; backend yok; 16+; sıfır hukuki risk.

---

## 0. Yöntem ve kaynak notu (okumadan geçme)

- Bu oturumun ağ politikası `apps.apple.com`, `play.google.com` ve üçüncü taraf mağaza izleyicilerine (AppBrain, AppGrooves, Sensor Tower, Reddit) **doğrudan erişime izin vermedi**. Tüm veriler arama motoru indeksindeki mağaza sayfası anlık görüntülerinden, geliştirici sitelerinden, inceleme sitelerinden (Hardcore Droid, TapTap, TV Tropes, Softonic, lifesim.com, lifesimulator.io) ve haber kaynaklarından (Vanguard, Techpoint, Guardian NG) derlendi.
- Puan/yorum sayıları **anlık görüntü** değerleridir; aynı uygulama için farklı tarihli görüntüler çeliştiğinde ikisi de verildi. "Tarih" sütunu görüntünün yaklaşık tarihidir (çoğu Eylül–Kasım 2026).
- **İlk 60 saniye (onboarding)** bölümleri cihazda oynanarak değil, mağaza ekran görüntüsü açıklamaları, geliştirici metni ve kullanıcı yorumlarından çıkarımla yazıldı; "çıkarım" diye işaretlendi. Sprint 0'da 5 uygulama gerçek cihazda 10'ar dakika oynanıp bu bölüm doğrulanmalı.
- Fiyatlar: USD = ABD mağazası; TRY yalnızca indekste görünen yerlerde (BitLife ana + GO). TRY değerleri 2024–2025 görüntülerinden; Apple'ın 2025–2026 TR fiyat katmanı güncellemeleri sonrası farklı olabilir.
- İstenen başlıklardan "My Life Simulator", "Monarch Life", "Hollywood Life", "Journey of Life (mobil hayat simi)", "Rich Life: Simulator" **bu adlarla mağazalarda bulunamadı** (Journey of Life bir Steam survival oyunu; "Rich Life" aramaları Rich Inc. idle oyununa ve Poor to Rich'e çıkıyor). Yerlerine aynı rafta gerçekten sıralanan 2025–2026 oyunları alındı.
- "Life simulator" arama rafı için tek bir resmî top-15 listesi çekilemedi; aşağıdaki liste üç bağımsız kaynağın (lifesim.com Ekim 2026, lifesimulator.io 3 Kasım 2026, appfelstrudel "BitLife alternatifleri" 2026) kesişimi + yorum hacmi ile oluşturuldu.

---

## 1. Küme haritası — rafta ne var (Kasım 2026)

| # | Uygulama (mağaza adı) | Geliştirici | Puan / yorum (görüntü) | Zaman birimi | BitLife'ın ötesinde ne ekledi | Para modeli |
|---|---|---|---|---|---|---|
| 0 | BitLife - Life Simulator (referans) | Candywriter | Play 4,4★ (milyonlarca) | **Yıl** | — | Reklam + Bitizenship + God/Boss Mode + genişleme paketleri |
| 1 | AltLife - Life Simulator | Mark Benyei / QmzApps | ~4,5★ / 72–82 bin (Play+iOS, 2026) | Yıl | Canlı dövüş mini-oyunu, Utoob/Instafame yaratıcı kariyeri, hapishane çeteleri, mahkeme | Reklam + Premium $9,99 (kalıcı) + Ultimate paket |
| 2 | ALTER EGO | Caramel Column | Play 4,8★ / 1,44 M (2026) | **Gerçek zaman (idle)** | Kişilik testi anlatısı, çevrimdışı birikim, Es karakteri | Banner + rewarded + reklamsız $2,99 + son açma ≤ $9,99 |
| 3 | The Life Simulator | Mind Vacation Inc. | iOS 4,5★ / ~21 bin | Tur (yıl) | 15+ başlangıç senaryosu, perk sistemi, kumarhane, hisse/kripto | Unlock All Perks $2,99 |
| 4 | Life Choices: Life Simulator (+ LC2) | Unico Studio | Play 4,3★ / 69,6 bin; LC2 iOS 4,6★ / 435 | Yaş atlama (kart) | Melek/şeytan çerçevesi, kasaba inşası, 1000+ seçim | Reklam ağırlıklı + reklamsız IAP |
| 5 | Life Sim: Real Life Simulator (Play: Real Life Sim) | Richard Biddulph (Biddulph Games) | iOS 4,6★ / 4,6 bin (2026) | **Gün** (günlük kararlar) | Fabrika/iş zinciri, 24+ kilometre taşı + global liderlik tablosu, evcil hayvan | Reklam; reklamsız IAP yok (şikâyet) |
| 6 | Idle Guy: Life Simulator games | Heatherglade | iOS 4,8★ / 73 bin; Play 4,5★ | **Gerçek zaman (sayaç)** | Bekleme sayacı + rewarded reklamla hızlandırma | Reklam ağırlıklı + ucuz reklamsız paket |
| 7 | 100 Years - Life Simulator | Lawson | Play 4,3★ / 163 bin | Seviye (yaş dilimi) | 3D sahneler, seviye tabanlı yapı | Her seviye arası reklam + reklamsız $2,99 |
| 8 | ReLife - Life Simulator | ReimGame | Play 4,5★ / 1,84 bin; iOS 4,7★ / 962 | Yıl | Hayat ödülleri, balıkçılık, memecoin, hapis kaçakçılığı, TikTok pazarlaması | Reklam + RePass aylık abonelik (~$4) + IAP $3,99–5,49 |
| 9 | SimLife: Life Simulator Game | Eskil Skoldkvist | iOS 4,6★ / 82 | Yıl | God Mode ile yıl geri sarma, aile editörü, "mezar taşı özeti" | God Mode Forever $7,99 / 8,99 € |
| 10 | Infinite Life Simulation | Pickle.co / Buğrahan Şentürk | Play 2,5★ / ~180; iOS 4,0★ / 14 | Tur (AI üretimli) | **LLM anlatı**, NPC ile serbest sohbet, genetik, serbest metin eylem | Career Jetpack $0,99, Golden Career Pass $2,99 (+eski abonelik katmanları) |
| 11 | AltLife Sim - Choose your life | Bountiful Games | Play 4,5★ / ~1 bin; iOS 4,6★ / 137 | Yıl | "Seçenek yoksa yaz" serbest metin eylem (AI) | Reklam + IAP |
| 12 | LifePop - Life Simulator | 404 Games Limited | iOS 4,4★ / 29; Play 3,5–3,7★ / ~400 | Yıl | 60 beceri / 6 yetenek ağacı, 17 mini-oyun, casus ajansı, vampir yolu, fotoğraf albümü | Reklam + IAP |
| 13 | Life Simulator: Roleplay Sim | Ahmet Can Güven (TR) | iOS 4,3★ / 788 | Gün/yıl karışık (bkz. §3.13) | Flört profili tarayıcı, çok adımlı görevler, kurslar, "ölümde ipucu" | IAP |
| 14 | LifeSim: Life Simulator | RoboBot Studio (Bergamo) | Play 3,3★ / 98; iOS 4,0★ / 8 (Nisan 2026 çıkış) | Yıl | 8 göstergeli psikolojik stat modeli (Merak, Özerklik…) | Reklam + IAP |
| 15 | Life Story Simulator Games | Better Life Studios | iOS 4,4★ / 684 | Tur | Yatırım eğitimi vurgusu, 18+ kumar | Çok sayıda küçük IAP (uçak, araba, hızlandırıcı kart) |
| — | Uzun kuyruk | Life in Text (Square M, 4,4★/155, reklamsız), LifeSimulator (Kiwi, 4,1★/12 bin), Life Simulator (kgapps, 3,9★/9,6 bin), Age Sim (USPEX, 3,9★/7,3 bin), Idle Life Sim (Codigames, Play 3,9★/200 bin+), LIFEISH (tek ödeme, 2026), 1 in 8 Billion (HAYO, Ekim 2026), PassiveFlow (Umar Khaleeq), TC Simülasyonu (Tiamo, TR, Play 1M+), Life Simulator 2026 (İbrahim Cinan, TR), Manhua Life, InstLife (2019'da kaldırıldı) | | | | | |

**Rafın üç dalgası:**
1. **2018–2021 klonlar** (The Life Simulator, Life Choices, 100 Years, Idle Guy, kgapps, Kiwi): BitLife'ın yıl-tabanlı çekirdeğini alıp bir "kanca" ekledi (3D, idle sayaç, kasaba inşası, finans eğitimi). Reklam yoğunluğu en yüksek dalga.
2. **2021–2024 derinleşenler** (AltLife, ReLife, Life Sim: Real Life, Life Story): BitLife'ın eksik bıraktığı sistemleri (iş zinciri, hapishane, yaratıcı kariyer, canlı mini-oyun) derinleştirdi; "BitLife'tan daha derin ama bug'lı" yorumu bu dalganın imzası.
3. **2025–2026 yeni gelenler** (Infinite Life, AltLife Sim, SimLife, LifePop, LifeSim/RoboBot, LIFEISH, 1 in 8 Billion): iki eksen — **LLM anlatı/serbest metin** (Infinite Life, AltLife Sim) ve **sahiplik/kalite sinyali** (tek ödeme, reklamsız, "mezar taşı özeti", HTML kitap dışa aktarma). Hiçbiri henüz 100 bin yorum eşiğini geçmedi; raf hâlâ BitLife + AltLife + Alter Ego üçlüsünün.

---

## 2. Referans çizgisi: BitLife (kısa)

- **Mağaza:** "BitLife - Life Simulator"; Candywriter. Play 4,4★. iOS yorum sayısı bu oturumda doğrulanamadı.
- **Fiyatlar (üçüncü taraf rehber, ~Ekim 2026, ABD):** God Mode $9,99; Bitizenship $7,99; Bitizenship + God Mode $15,99; Boss Mode ayrı. **TR mağazası (eski görüntü):** Bitizenship ₺349,99 · God Mode ₺349,99 · Bitizenship+God Mode ₺599,99 · Boss Mode ₺799,99. **BitLife GO! (TR, ~2024):** Bitizenship ₺399,99 · Time Machine ₺49,99 · Combo Pack ₺699,99.
- **Live-ops kadansı (resmî "What's New", 2026):** 15 Tem 2026 UFM (Ultimate Fighter Mode) iyileştirmeleri; Ağu 2026 erişilebilirlik düzeltmesi; 10 Eyl 2026 Movie Director Expansion Pack; 18 Eyl yıldönümü etkinliği; 14 Eki 2026 temizlik yaması. **Bağımsız dil uygulamaları (BitLife Español) Ekim 2026'da kapatılıyor** — tek uygulama, çok dil modeline geçiş. Bu Motto'nun TR+EN tek-binary kararını doğrular.
- **Son yorum temaları:** "reklamlar sıklaştı", "reklam kaldırma satın alımı güncellemeden sonra sayılmıyor". Lider bile reklam güveni kaybediyor; bu Motto için fırsat (D-kararları: reklam yalnızca opt-in).

---

## 3. Uygulama bazlı teardown

Her uygulama için aynı iskelet: Künye · Para · Çekirdek döngü · Özellik envanteri · İlk 60 sn · Monetizasyon yerleşimi · Live-ops · UI/sanat · Övgü · Şikâyet · **KOPYA** (Al / Uyarla / Alma → Motto'ya karşılık).

### 3.1 AltLife - Life Simulator (QmzApps / Mark Benyei)

**Künye.** Mağaza adı "AltLife - Life Simulator"; iOS geliştirici "Mark Benyei", Play "Bényei Márk / QmzApps". ~72–82 bin yorum, ~4,5★ (2026). 17+. Rafta BitLife'a en yakın ikinci oyun (lifesim.com Ekim 2026: DogLife/CatLife'tan sonra AltLife).

**Para.** Ücretsiz + reklam. IAP: Premium Membership (Permanent) **$9,99** (PL: 49,99 zł; "v35'te tek seferlik satın alma oldu"), Ultimate AltLife Bundle **$19,99** (başka görüntüde $49,99; PL 79,99 zł). Premium reklam kaldırma + içerik; paketler kariyer/özellik açılımı.

**Çekirdek döngü.** Yıl = tur. "Yaşlan" butonu, olay kartları, menü sekmeleri (Kariyer, İlişkiler, Varlıklar, Aktiviteler). Oturum: 10–20 yıl + bir alt-sistemde (Utoob stüdyosu, hapishane, dövüş kampı) 2–3 dakikalık "mini-oyun" molası.

**Özellik envanteri (v50 "major overhaul", 2026).**
- Kariyer: standart meslek ağacı + **Fighter** (boks/kickboks/MMA; kampta antrenman, **canlı dövüş: her yumruğu sen atıyorsun**).
- **Utoob** (YouTube parodisi): video çek-kurgula-dışa aktar, thumbnail tasarla, yorumları oku, kanal büyüdükçe stüdyo kur. **Instafame**: takipçi, sponsorluk anlaşmaları.
- Suç/hukuk: soruşturmalar, mahkeme davaları, yeniden yazılmış suç mini-oyunları.
- **Hapishane:** mahkûmlar, çeteler ("crew" kur/katıl), çete kavgaları, hapishane işleri, kaçakçılık, şartlı tahliye, duvardan/tünelden firar.
- Ekonomi: kripto, gayrimenkul, "gerçekten işe yarayan eşyalar".
- Kozmetik: avatar özelleştirme (BitLife'ın düz ikonlarından daha zengin).
- Koleksiyon/achievement: var, ribbon benzeri; yorumlarda nadiren anılıyor.
- Nesil/legacy: çocuk olarak devam var.

**İlk 60 sn (çıkarım).** Rastgele doğum → karakter kartı → "Yaşlan". BitLife ile birebir; onboarding yok. Premium/paket reklamı ilk 2 dakikada gösteriliyor (yorumlar).

**Monetizasyon yerleşimi.** Interstitial yaşlanma aralarında (BitLife'tan seyrek), rewarded reklam ile para/aktivite; Premium = reklamsız + açılımlar; paketler ayrı. Şikâyet: "restore purchases" yeniden yükleme sonrası çalışmıyor.

**Live-ops.** Büyük sürüm numaralı "overhaul"lar (v35, v50) arası aylar; haftalık etkinlik yok.

**UI/sanat.** BitLife grameri (liste + büyük yaş butonu) ama daha koyu, daha fazla ikon ve avatar; yorum: "UI is much better".

**Övgü (alıntı).** "has some great features and can be even more in depth than BitLife" · "much less ads on the free version, and personally I think the UI is much better" · "avatar customization, items that actually matter, influencer career & crypto/real estate system are WAY better than Bit Life" · "kinda like bitlife but better!"

**Şikâyet (alıntı).** "romance is entirely random" · "the ads are ridiculous and the pay to use portions are not fairly priced" · "still in the developmental stages, with many missing (but upcoming), scuffed and occasionally glitchy features" · "action button that sometimes doesn't register".

**KOPYA.**
| Özellik | Karar | Motto'ya karşılık |
|---|---|---|
| Canlı dövüş mini-oyunu (her yumruk elle) | **Alma** | Motto'nun tek mini-oyunu göz teması (D-063); dövüş = kapsam patlaması |
| Utoob/Instafame yaratıcı kariyeri (thumbnail, yorum okuma) | **Uyarla** | "İçerik üreticisi" kariyeri 04 dokümanında zaten var; yalnızca **yorum okuma** beat'ini al: sahte yorumlar koçun roast malzemesi olur ("3 beğeni, biri annen") |
| Hapishane çeteleri/firar | **Alma** | 16+ ve T9 kırmızı çizgileri; suç yolu Motto'da "vergi kaçırma, kaçak elektrik" tonu, çete yok |
| "İşe yarayan eşyalar" (varlıkların olaylara etkisi) | **Al** | D-067 Varlıklar şeridi: kedi/telefon/araba olay havuzunu değiştirir |
| Kalıcı Premium (abonelik değil) | **Al** | §8 monetizasyon: tek seferlik "Sertifika" satın alımı; abonelik yok |
| "Romance entirely random" şikâyeti | **Ders** | İlişki olasılığı görünür ve stat'a bağlı olsun; koç oranı söyler ("%55'ti") |

### 3.2 ALTER EGO (Caramel Column Inc.)

**Künye.** Play 4,8★ / **1,44 milyon** yorum (2026 görüntüsü; 2021'de 144 bin), 10M+ indirme sınıfı; Teen. iOS'ta da yüksek. Japon stüdyo; spin-off ALTER EGO COMPLEX $4,99 ücretli.

**Para.** Ücretsiz; alt banner + rewarded reklam; **reklamsız $2,99**; Ego hızlandırma / son açma paketleri **≤ $9,99**. İnceleme: "these purchases are never forced on us, and they're not necessary to finish or enjoy the game".

**Çekirdek döngü (gerçek zaman).** Sonsuz koridorda beliren "Whisper" baloncuklarına dokun → **Ego** kazan (kaybolmadan hemen önce dokunursan daha çok). Ego ile **kitap** al; kitaplar **saniyede Ego üretir, uygulama kapalıyken de**. Ego eşiklerinde ana hikâye ilerler: Es ile sohbet + **kişilik testi** (gerçek psikoloji envanterlerinden esinli). Cevaplar Es'in ve "Ego Rex"in tavrını, 3 bölüm sonunda **çoklu sonu** belirler.

**Özellik envanteri.** Whisper tıklama; kitap koleksiyonu (sayfa okuyarak üretim hızı yükseltme); Es diyalogları; kişilik testleri + sonuç raporu (paylaşılabilir); 3 bölüm, birden çok son; sonradan satın alınan ek senaryolar; özgün soundtrack; başarım yok denecek kadar az.

**İlk 60 sn (çıkarım).** Siyah ekran, Es'in tek satırlık tanışması, ilk Whisper'a dokunma öğretimi; test ilk 2 dakikada geliyor. Onboarding = anlatı.

**Monetizasyon yerleşimi.** Alt banner sürekli (oyun estetiğini bozmadan koyu temada); rewarded reklam = Ego çarpanı; reklamsız IAP; son açma IAP'ı (hikâye bitince teklif).

**Live-ops.** Yıllarca yama + nadir yeni senaryo; etkinlik yok. Bu, 4,8★'ın "içerik yarışı" değil "ton + saygı" ile tutulduğunun kanıtı.

**UI/sanat.** Siyah-beyaz-kırmızı, tek karakter illüstrasyonu, yazı tipi odaklı; "polished design", "original soundtrack".

**Övgü.** "Part idle game, part visual novel, and part personality test, it's one of the most memorable games I've played in a long time." (Hardcore Droid) · "you can finish the game in under a week without spending a cent".

**Şikâyet.** "a glorified idle game with little more than cutscenes every so often" · "Only download if you're fine with coming back to it every few days to see how much currency ('EGO') you've accrued" · "there's no reward for completing all the books" · "choices took too long to matter".

**KOPYA.**
| Özellik | Karar | Motto'ya karşılık |
|---|---|---|
| "Sen yokken birikti" dönüş kancası | **Uyarla** (D-065'te zaten) | Welcome-back "Sakatlık Raporu" (40 sn): koç yokluğunda olanları özetler; para birikmez, **olay** birikir (zarf kuyruğu) |
| Kişilik testi sonucu = paylaşılabilir nesne | **Uyarla** | Teşhis etiketi + Yılın Mottosu zaten paylaşım nesnesi; Alter Ego'nun dersi: testin **ciddi bir çerçevesi** olsun ki parodi tutsun (Motto'da "sertifikasız" çerçevesi) |
| Tek karakterle derin ilişki (Es) | **Al** | Koç = Es; tek ses, tek yüz, ifadeler (smirk/shock/sad, D-063) |
| Banner reklam | **Alma** | D-kararı: ekranda sürekli reklam yok |
| Çevrimdışı Ego birikimi (idle ekonomi) | **Alma** | Motto'da zaman yalnızca uygulama açıkken akar (D-066); idle birikim "hayat gerçek olmalı" kuralını bozar |
| "Choices took too long to matter" | **Ders** | Motto'nun 34. saniyede damga basma kuralı tam bu şikâyete cevap |

### 3.3 The Life Simulator (Mind Vacation Inc.)

**Künye.** iOS 4,5★ / ~20,8–21 bin. Eski (2018) ama hâlâ rafta. **Para:** Unlock All Perks **$2,99**; perk'lerin bir kısmı başarımla açılıyor.

**Çekirdek döngü.** Tur = yıl; **15+ başlangıç senaryosu** ("high school dropout", "indebted college student"…) seçimi ile başlar; menüden iş/eğitim/ilişki/yatırım aksiyonları; "pandemi senaryoları" güncellemesi.

**Özellik envanteri.** Başlangıç senaryoları; **10+ perk** (kalıcı pasif bonus); kumarhane (Fortune Cookie dâhil); borsa: 11 hisse (Tesla, S&P500, parodi "Krusty Krab"), 4 kripto (Bitcoin, Dogecoin); askerlik; aile etkileşimleri (zorunlu); bildirimler.

**İlk 60 sn (çıkarım).** Senaryo seçimi ekranı → stat özeti → ilk yıl. Onboarding = senaryo kartı.

**Monetizasyon yerleşimi.** Tek IAP; reklam az. 2018 nesli "ucuz tek açılım" modeli.

**Live-ops.** Seyrek; büyük temalı güncellemeler (casino, pandemi).

**UI/sanat.** Düz liste/menü, açık tema, ikon yok; "finansal eğitim uygulaması" hissi.

**Övgü.** "contains subtle lessons about financial investment, relationship, career, time management, and life philosophies".

**Şikâyet.** "similar to bot life" · askerî terfiler gerçekçi değil · "forced family interactions" · bildirimler rahatsız edici · iş ile yan gelir dengesi bozuk.

**KOPYA.**
| Özellik | Karar | Motto'ya karşılık |
|---|---|---|
| Başlangıç senaryosu seçimi | **Uyarla** | Motto'da ilk hayat sabit (Deniz Ertelemez / Alex Tomorrow); **Kondisyon** açılımları (ölüm sonrası) senaryo işlevi görür — "borçlu üniversiteli" bir Kondisyon olabilir |
| Perk sistemi | **Uyarla** | Kondisyon = perk; para ile değil ölümle açılır |
| Gerçek şirket adlı borsa (Tesla, S&P500) | **Alma** | T9: gerçek marka yok; "Krusty Krab" tarzı parodi isimler de IP riski (Nickelodeon) |
| Zorunlu aile etkileşimi | **Uyarla** | "ANNE ARIYOR" baskını (D-063) var ama Anne Baskısı ≥ 75 koşuluna bağlı; sıklık director kontrolünde (~%40 yıl) |

### 3.4 Life Choices: Life Simulator + Life Choices 2 (Unico Studio)

**Künye.** Play 4,3★ / 69,6 bin, **5M+ indirme**; iOS 4,3★ / 34. LC2: iOS 4,6★ / 435; v1.5.0 (11 Nis 2026). Steam sürümü 1 Eki 2025. Hypercasual kökenli (Unico = Brain Test stüdyosu).

**Para.** Ücretsiz + **yoğun reklam** + reklamsız IAP (fiyat indekste yok).

**Çekirdek döngü.** Kart tabanlı: yaş atla → rastgele olay → 2–3 seçenek → beceri/ahlak değişimi. Cennet/cehennem çerçevesi ("stairway to heaven" vs "push into hell"); LC2'de her karakterin **3 görevi** var, tamamlanınca ödül → **kasaba** onarımı/dekorasyonu.

**Özellik envanteri.** 1000+ seçim; beceriler sonucu etkiler; **başarımlar havuzu → kasaba tamiri**, ev/mobilya özelleştirme; melek/şeytan karakterleri; LC2'de görev sistemi; Steam/web portu.

**İlk 60 sn (çıkarım).** Reklam-doğru oynanış: ilk kart ilk 5 sn'de; tutorial yok; ilk interstitial ~1–2 dk.

**Monetizasyon yerleşimi.** Interstitial "her 30 sn" (yorum); **iyi seçenek rewarded reklam arkasında** (yorum); reklamsız IAP (sonradan bozulduğu şikâyeti).

**Live-ops.** Sürüm kadansı ~2–3 ay; sezon yok.

**UI/sanat.** Parlak, çizgi film, 2D avatar + sahne; hypercasual estetiği; "misleading ads" genre'sinde "true-to-ad" övgüsü.

**Övgü.** "The game is so relaxing and fun." · "Improved game mechanics from the original."

**Şikâyet.** "The developer could keep players longer if they didn't show an ad every 30 seconds." · "Good choices were only available by watching multiple ads." · "The decisions are the same for every life, so it stops being fun." · reklamsız satın alımdan sonra reklamlar devam etti · donma.

**KOPYA.**
| Özellik | Karar | Motto'ya karşılık |
|---|---|---|
| Başarım → kasaba/ev dekorasyonu (meta-ilerleme görünür nesne) | **Uyarla** | Koçun Defteri + Tanıdık Yüzler zaten meta; görsel bir "koçun ofisi" (damgalar, sertifikalar duvarda) düşünülebilir — Sprint planında "ofis duvarı" olarak değerlendir |
| İyi seçeneğin reklam arkasında olması | **Alma** (kırmızı çizgi) | Hiçbir seçenek reklamla açılmaz; roast edilecek örnek |
| Kart/swipe hissi | **Al** (D-065 Reigns) | Kart kaydırma = cevap |
| "Aynı kararlar her hayatta" şikâyeti | **Ders** | T11 3h novelty: ilk 3 hayatta tekrar < %15 |

### 3.5 Life Sim: Real Life Simulator (Richard Biddulph / Biddulph Games) — **GÜN tabanlı**

**Künye.** iOS "Life Sim: Real Life Simulator — Career, Family & Business RPG"; 4,6★ / ~4,6 bin. Play adı "Real Life Sim: Story RPG Game" (son güncelleme **28 Eki 2026**). Tek kişilik indie. Ayrı bir "Life Sim Idle Clicker RPG" kardeş uygulaması var.

**Para.** Ücretsiz + reklam; **reklam kaldırma IAP yok** (yorumlar istiyor). Mikro-işlemler var ("cash grab" şikâyeti).

**Çekirdek döngü.** **Günlük karar:** her gün için enerji/aksiyon bütçesi; işe git, derse gir, sat-al, randevu; gün biter. Yorumda "daily-decision pacing" övülüyor. Bu küme içinde Motto'nun D-061 kararına en yakın örnek.

**Özellik envanteri.** Üniversite dereceleri → kariyerler ("Learn & Earn"); borsa ve gayrimenkul; **iş kurma: fabrikalar, mal al-sat zinciri** (uzmanlaşmış fabrikalar arası transfer elle); suç yolu ("A Life of Crime"); evcil hayvan edinme; **24+ kilometre taşı + global liderlik tablosu**; manuel kayıt (autosave yok).

**İlk 60 sn (çıkarım).** Karakter oluşturma formu → ana ekran (sekmeler) → ilk gün. Menü-ağır, öğretici yok; yorum: "many features barely connect to the core gameplay".

**Monetizasyon yerleşimi.** Interstitial erken ("unprompted ad after only a few taps"); para/eşya IAP.

**Live-ops.** Düzenli küçük güncellemeler ("bug fixes and general improvements"), 2026'da aktif.

**UI/sanat.** Form/menü; koyu tema; ikon az. "No vulgarity" (BitLife'a kıyasla temiz ton) övgüsü.

**Övgü.** "Great game, needs work" · günlük tempo · "lack of the vulgarity found in some similar games".

**Şikâyet.** "selling 100 units at a time is slow once a business gets large" · "unprompted ad after only a few taps … cash grab" · autosave yok · "many features barely connect to the core gameplay" · daha fazla iş yeri olayı isteği.

**KOPYA.**
| Özellik | Karar | Motto'ya karşılık |
|---|---|---|
| Gün = tur, enerji bütçesi | **Uyarla** | D-061/D-066: gün akar ama enerji bütçesi **yok**; olaysız günler tek satır. Biddulph'un dersi: her günü elle oynatmak menü yorgunluğu yaratıyor → Motto'nun "olaysız gün atlanır" kuralı doğru |
| Kilometre taşı + global liderlik | **Alma / Uyarla** | Backend yok → global tablo yok; **Antrenman Kampı hayali kohortu** zaten bu işi görüyor (dürüstçe etiketli) |
| Fabrika/mal zinciri | **Alma** | Motto'da iş = unvan + maaş akışı (D-067); tycoon derinliği hedef kitleye uymaz |
| Autosave eksikliği | **Ders** | Her beat sonrası otomatik kayıt (10 teknik doküman) |

### 3.6 Idle Guy: Life Simulator games (Heatherglade) — **gerçek zaman sayaç**

**Künye.** iOS 4,8★ / 73 bin; Play ~4,5★; Steam %73 olumlu (680). **Para:** reklam ağırlıklı; "no ads pack is super cheap".

**Çekirdek döngü.** Metin senaryoları (iş, hisse, ilişki) + **her eylem gerçek zamanlı sayaca bağlı**; sayaç ya beklenir ya rewarded reklamla atlanır. Fakirden tycoon'a.

**Özellik envanteri.** Üniversite, borsa, kurumsal merdiven, iş kurma, flört/aile, gayrimenkul; idle gelir.

**Monetizasyon yerleşimi.** Rewarded reklam = zaman; interstitial; ucuz reklamsız.

**Övgü/Şikâyet.** "the ads are too many but tolerable as I'm getting something out of it" / "ad harvesting 'game' that basically forces you to watch ads to win" · kısa ömür · güncellemede ilerleme sıfırlanması.

**KOPYA.** Gerçek zaman sayaç + reklamla atlama: **Alma** (D-065: Choices'ın bekleme duvarı reddedildi; aynı kural). Ders: 4,8★ iOS puanı reklam yoğunluğuna rağmen **"karşılığında bir şey alıyorum"** hissinden geliyor → Motto'da opt-in reklam yalnızca "Telafi" gibi gerçek değerli yerlerde.

### 3.7 100 Years - Life Simulator (Lawson)

**Künye.** Play 4,3★ / 163 bin; TapTap 6,7/10. **3D** sahneli, **seviye tabanlı** (her yaş dilimi bir seviye). Çevrimdışı. **Para:** her seviye arası interstitial; rewarded ile seçenek; reklamsız $2,99 (tek kaynak).

**Şikâyet.** "age only goes to 65" · "many 'choices' forcing you to restart the level" · reklam her seviyede.

**KOPYA.** 3D sahne: **Alma** (maliyet; D-063 juice standardı 2D ile sağlanıyor). "65'te biten hayat" şikâyeti → Motto'nun 60+ yaş sessizleşmesi doğru ama **hayat 65'te bitmesin** (Gompertz kuyruğu %5 absürt uzun ömür).

### 3.8 ReLife - Life Simulator (ReimGame)

**Künye.** Play 4,5★ / 1,84 bin; iOS 4,7★ / 962. 2025 çıkışlı, 2026'da hızlı güncelleme; TikTok hesabından aktif reklam ("doesn't hold your hand. No predictable outcomes. No 'safe' choices").

**Para.** Reklam + IAP $3,99–5,49 + **RePass aylık abonelik (~$4)**: god mode, üst çubuk sıralama, ek olaylar, reklamsız, özel başlangıç, bulut kayıt. Geliştirici: "core game is fully playable without any subscription".

**Çekirdek döngü.** Yıl = tur; kariyer/para/ilişki/**alışkanlık** sistemleri; "unexpected events". Hayat sonunda **özet ekranı** (başarımlar, servet, ilişkiler, "defining moments").

**Özellik envanteri (güncelleme notlarından).** Balıkçılık; hapiste kaçakçılık; kripto + **memecoin yaratma**; **Life Awards** (hayat ödülleri); evlilik/çocukta soyadı seçenekleri; challenges, achievements, leaderboards; suç kariyeri; çeviri düzeltmeleri (çok dilli).

**Monetizasyon yerleşimi.** Interstitial; abonelik teklifi menüde; IAP paketleri.

**Live-ops.** **Aylık+** içerik notları (balık, hapis, memecoin, ödüller) — kümede en hızlı kadans.

**Övgü.** "This game is better than bit life, but it still needs some things added."

**Şikâyet.** "certain things like godmode, top bar reordering, more events, etc that are only available with the RePass which is strictly as a monthly subscription" · ev/aile ağacı eksik.

**KOPYA.**
| Özellik | Karar | Motto'ya karşılık |
|---|---|---|
| Hayat sonu "defining moments" özeti | **Al** (Roast Raporu'na) | Roast Raporu'nda "haklı çıktığın 1 an" + 3 kalıp; ReLife'ın dersi: servet/ilişki sayıları da olsun |
| Life Awards (yıllık ödül töreni) | **Uyarla** | Yılın Mottosu zaten "ödül"; onyıl karnesine "Onyılın Ödülü" (absürt kategori: "En Çok Ertelenen Diş Randevusu") |
| Alışkanlık (habit) sistemi | **Al** | Kalıp Dedektörü = alışkanlık; görünmez `pattern` etiketi |
| "More events" aboneliğe kilitli | **Alma** | İçerik asla paywall arkasında değil |
| TikTok "seni elinden tutmaz" mesajı | **Al (pazarlama)** | Motto'nun "Sana karşı iddiaya girer" tagline'ı aynı damardan |

### 3.9 SimLife: Life Simulator Game (Eskil Skoldkvist)

**Künye.** iOS 4,6★ / 82 (2026); 18+. Küçük ama kalite sinyali yüksek; geliştirici her yoruma cevap veriyor.

**Para.** **God Mode Forever $7,99 / 8,99 €**; coin satışı **yok** ("your money is all earned in-game").

**Özellik envanteri.** God Mode: başlangıç stat'ları; **aile editörü** (kardeş sayısı, ebeveyn meslek/kişilik); **God Mode+ / Rewind: bir yılı geri sar** ("one bad roll never costs you the life you wanted"); cheat menüsü herkese açık; 10 yeni doğum ülkesi; "deaths got weirder, businesses got funnier"; **mezar taşı hayatını özetler**; salonda görünüm değiştirme (geliyor).

**Övgü.** Geliştirici yanıt veriyor; derinlik; "wanted to purchase more life coins" (satın alacak şey bulamıyor!).

**KOPYA.**
| Özellik | Karar | Motto'ya karşılık |
|---|---|---|
| Yılı geri sar (Rewind) | **Uyarla** | Motto'da geri sarma **koç izniyle, ücretli değil**: "Torpil" (ikinci koç kişiliği) tek hak; ya da hiç — kalıp dedektörü geri sarmayla bozulur. Karar: ölümde "Aynı kondisyonla" yeterli; rewind **Alma** |
| Mezar taşı özeti | **Al** | D-063 ölüm akışında mezar taşı var; metni Roast Raporu'nun tek cümlelik özeti olsun |
| Coin satmama + tek IAP | **Al** | §8 ile uyumlu |
| Aile editörü | **Alma** | İlk hayat elle yazılmış; aile = Tanıdık Yüzler, oyuncu seçmez |

### 3.10 Infinite Life Simulation (Pickle.co / Buğrahan Şentürk) — **LLM anlatı**

**Künye.** Play 2,5★ / ~180 (AppBrain 2,37); iOS 4,0★ / 14. Tek geliştirici (TR kökenli isim; iOS yayıncı "bugrahan senturk"). v6.1.x (Ağu–Kas 2026). **İnternet zorunlu** (AI her turu canlı üretir).

**Para.** Career Jetpack **$0,99** (18'de tüm kariyerler), Golden Career Pass **$2,99**; eski sürümlerde aylık/üç aylık/yıllık abonelik katmanları (AppBrain v4.11: $57,50–75/ay — muhtemelen hatalı görüntü). Geliştirici: "Passes do not lock jobs or content behind payment, they only let you skip stat requirements."

**Çekirdek döngü.** Tur = AI üretimli olay; oyuncu **serbest metin eylem** yazabilir; NPC'lerle **sohbet** (AI Friend/chatbot; "Friendship Score" değişimi görünür); evlenme; context window'da geçmiş kararlar.

**Özellik envanteri.** 200+ iş (şirket bazlı kariyer); evcil hayvan + aksesuar; borsa; **genetik** (çocuklar özellik paylaşır); ölüm ekranında hayat özeti; karakter özelleştirme; devlog'da "long-term memory" hedefi.

**Monetizasyon yerleşimi.** Az reklam ("fewer ads and fewer microtransactions than similar games"); paywall şikâyeti var.

**Live-ops.** Haftalık yamalar (6.0.8 → 6.1.2 arası ~2 ay); devlog blogu.

**Övgü.** "fun and a good way to pass time" · "developer responds to feedback" · "recent update made the game much faster".

**Şikâyet.** "AI forgetting details" · iş durumu ile finans sayfası uyuşmuyor · ilişki ekranında lag · "lack of children" (eski) · "frequent affair pop-ups" · "lost internet connection" döngüsü · paywall.

**KOPYA.**
| Özellik | Karar | Motto'ya karşılık |
|---|---|---|
| LLM anlatı / serbest metin | **Alma** (bağlayıcı) | Backend yok, çevrimdışı, maliyet sıfır; 2,5★ Play puanı "AI unutuyor" + "internet yok" şikâyetlerinin bedeli. Motto'nun elle yazılmış, tutarlı metni rekabet avantajı |
| NPC ile sohbet hissi | **Uyarla** | D-062 diyalog balonları + cevap balonu: serbest metin yok, 2–4 seçenek; "sohbet" hissi UI ile verilir |
| Genetik (çocuk özellik devralır) | **Uyarla** | Nesil geçişi varsa (05 dokümanı) kalıp mirası: "annen de erteliyordu" |
| Friendship Score görünür delta | **Al** | İlişki şeridinde "+3 Yağmur" uçan sayı (D-063) |

### 3.11 AltLife Sim - Choose your life (Bountiful Games) — serbest metin, 2026

**Künye.** Play Temmuz 2026; 4,5★ / ~997; iOS "AltLife Sim!" 4,6★ / 137. **Mekanik:** "if you do not see the choices you want on screen, type them in" — klasik seçenek + AI yorumlanan serbest eylem. **Şikâyet:** "romance is entirely random", "AI sometimes behaves oddly". **KOPYA:** serbest metin **Alma** (bkz. 3.10); isim karışıklığı dersi: Motto adı tekil, "Life/Sim" içermiyor — doğru.

### 3.12 LifePop - Life Simulator (404 Games Limited)

**Künye.** iOS 4,4★ / 29; Play 3,5–3,7★ / ~400. 13+. **Özellik:** 60 beceri / 6 yetenek ağacı; yüzlerce kariyer; **17 mini-oyun**; **fotoğraf albümü** (kilometre taşları); liderlik tabloları; bulut kayıt; NPC'ler eylemleri hatırlar; casus ajansı (ajan toplama, görev), hayvanat bahçesi işletme, yarış, vampir yolu. **Şikâyet:** donma, lag, "cramped interface", "felt rushed and many issues were left unfixed". **Övgü:** çeşitlilik, hızlı bug düzeltme.

**KOPYA.** Fotoğraf albümü → **Uyarla**: Motto'da "Koçun Defteri" sayfaları = albüm; her Yılın Mottosu bir sayfa. 17 mini-oyun → **Alma** (odak kaybı; yorumlar "rushed" diyor). Vampir/casus → **Alma** (ton dışı). NPC hafızası → **Al** (D-023 `metaMemories`).

### 3.13 Life Simulator: Roleplay Sim (Ahmet Can Güven — Türk geliştirici)

**Künye.** iOS 4,3★ / 788; 13+; iPad. v6.4 (29 Mar 2026): DE/ES/PT, UI yenileme, yeni kariyer/beceri/hayat yolları, yüzlerce olay, oyun içi wiki; v6.5.5 sonraki. Play kardeş: "Real Life Simulator Sim RPG" (Acg).

**Özellik.** Doğumdan ölüme; **flört profili tarayıcı** (Tinder benzeri kartlar); çok adımlı görevler; kurslar ("survival training", "digital marketing"); başarımlar; **her oyun sonunda "sonraki hayat için ipucu"**. Yorum özeti: "day-by-day aging" övülüyor (tek kaynak; cihazda doğrulanmalı).

**Şikâyet.** "doesn't feel complete"; geliştirici: ilişkiler/ekonomi/mekânlar sıkılaştırıldı.

**KOPYA.** "Ölümde ipucu" → **Uyarla**: Roast Raporu'nda Koçun Son Sözü zaten var; ipucu değil **iddia** olsun ("Gelecek hayatta da 23'te bırakacaksın. Bahse girerim."). Flört profili kartları → **Uyarla**: D-062 chat-UI içinde "profil kartı" olay tipi (yalnızca kurgusal NPC'ler). Çok dillilik → **Al** (TR+EN ilk günden). Türk geliştiricinin ABD mağazasında 788 yorumla tutunması: TR stüdyosunun EN-first yayın yapması mümkün sinyali.

### 3.14 LifeSim: Life Simulator (RoboBot Studio, İtalya) — 2026 yeni

**Künye.** 16 Nis 2026 çıkış; Play 3,3★ / 98; iOS 4,0★ / 8. **Özellik:** 0–100+ yaş; **8 psikolojik gösterge**: Health, Curiosity, Affection, Security, Reputation, Autonomy, Relationships, Progress; aile kurma (Mayıs 2026), evcil hayvan; PT/PL dil. **Şikâyet:** "ads appearing often", "game ending early", "English needed work", tekrar. **KOPYA:** 8 gösterge → **Alma** (Motto 4 stat + görünür Durum şeridi; 8 çubuk okunmuyor, 3,3★). Ders: iyi niyetli psikolojik model bile reklam + çeviri kalitesine yeniliyor.

### 3.15 Life Story Simulator Games (Better Life Studios)

**Künye.** iOS 4,4★ / 684; **18+** (sık/yoğun simüle kumar). **Para:** çok sayıda küçük IAP — business plane, business car, learning accelerator card, health pack, "sweet pack", futures trading skills (SEK fiyatlı). **Döngü:** fakirlikten zenginliğe tur tabanlı; yatırım eğitimi. **Övgü:** "teaches you real life stuff". **Şikâyet:** "early stages kind of boring", "could've given a better tutorial". **KOPYA:** IAP enflasyonu (10+ küçük paket) → **Alma**; 18+ kumar etiketi → **Alma** (Motto 16+; kumar olayı yalnızca anlatı, mini-oyun yok).

### 3.16 Uzun kuyruk — tek satırlık notlar

- **Life in Text (Square M):** 4,4★/155; **reklamsız, IAP'sız**; doğum yılı → özellikler; özel ev. Şikâyet: ilişki/kariyer max'ta statik, "friends never propose". KOPYA: "doğum yılı → kohort olayları" **Uyarla** (Motto gerçek takvimle 2026'da 18 yaşında başlar; yaş bandı + takvim yılı olay havuzunu seçer, oyuncu doğum yılı seçmez).
- **LifeSimulator (Kiwi Games):** 4,1★/12 bin, 500K+; Çin kökenli; şikâyet: "always start with 0 looks, no way to raise except plastic surgery", evcil hayvan hamilelik olayında donma. Ders: görünüş stat'ı 0'dan başlatma.
- **Life Simulator (kgapps):** 3,9★/9,6 bin; ülkeler, kurslar, dilenciden cumhurbaşkanına; "we are still developing" 2023'ten beri.
- **Age Sim: Adventure Living (USPEX):** 3,9★/7,3 bin, 1M+; 17+; IAP $0,49–99,99; "ad every 30 sec", "no real way to get stress down". Ders: düşürülemeyen stat = churn.
- **Idle Life Sim (Codigames):** iOS 4,6★/61 bin, Play 3,9★/200 bin+; Sims+clicker; "ads worse over time". Alma.
- **LIFEISH (Aymeric Lefebure, 2026):** **tek ödeme, çevrimdışı**; haftalık challenge, aylık sezon, 166 başarım, 15 gizli sır, aile yadigârı; henüz yorum yok. KOPYA: "15 gizli sır" → **Al** (T11 3k easter egg zaten var; sayısını mağaza metninde yaz).
- **1 in 8 Billion (HAYO, Ekim 2026):** kart kaydırma, 220 ülke, **hayatı resimli HTML kitap olarak dışa aktar**, 10 gem ile başlangıç özelleştirme, stat 0'da "kriz + toparlanma şansı". KOPYA: HTML/PDF "Hayat Dosyası" dışa aktarma → **Uyarla** (Roast Raporu paylaşım kartına "Tam Dosya" PDF'i; backend gerektirmez).
- **PassiveFlow (Umar Khaleeq, eski "Life Simulator - Business Game"):** 3,2★/~450; **günlük global emlak müzayedesi + günlük turnuva** (gerçek takvimli live-ops). Backend gerektirir → Alma; Antrenman Kampı hayali kohortu aynı ritmi backend'siz verir.
- **TC Simülasyonu / Bir TC Simülasyonu (Tiamo, TR):** Play 1M+ indirme; iOS 2,8–3,9★/21–28; 17+; IAP: **Reklamsız, Politika Paketi, Girişimcilik Paketi, Zaman Makinesi**. Yorum: "No economic inflation, no reference to turkish traditions at all." → Türkiye'de yerli hayat simine **talep var, kalite yok**; enflasyon/aile grubu/kombi ustası gibi yerli dokular Motto'nun TR locale avantajı. Siyaset paketi → Motto'da **yok** (T9).
- **Life Simulator 2026 (İbrahim Cinan, TR):** günlük görevler, "Build Your Next Generation"; 20 Mar 2026; yorum verisi yok.
- **Lagos Life (tarayıcı, 1 Eki 2026):** 4 günde 1M, 10 günde 7M oyuncu; 25 kariyer, 6 hayatta kalma çubuğu, **ev sahibine kira öde** döngüsü; gelir = oyun içi billboard reklamı (₦500k/hafta); kesinti özrü olarak herkese ₦100k. Mobil değil ama **yerel doku + kira baskısı** formülünün viral olabildiğinin 2026 kanıtı — Motto'nun "ayın 5'i kira çıkar" (D-067) kararını destekler.
- **DogLife / CatLife (Candywriter):** iOS 4,6★/63 bin ve 4,7★/14 bin; $4,99 reklam kaldırma "not worth"; "Top Dog" olmadan cins seçilemiyor. Ders: reklam kaldırma fiyatı değer hissiyle eşleşmeli.
- **InstLife:** 2019'da Play'den kaldırıldı (4,5★/35 bin, 7,1M kurulum) — bakımsız kalan klon ölür.
- **Manhua Life:** 4,0★/170; cultivation/fantezi ayarları; "almost great".

---

## 4. Zaman birimi analizi — kim gün/gerçek zaman kullanıyor, nasıl?

| Model | Örnekler | Nasıl işliyor | Oyuncu tepkisi | Motto için sonuç |
|---|---|---|---|---|
| **Yıl = tur (BitLife standardı)** | BitLife, AltLife, ReLife, SimLife, LifePop, LifeSim, Kiwi, kgapps, AltLife Sim | "Yaşlan" butonu; yılda 1–4 olay; menüden sınırsız aksiyon | Tanıdık, hızlı; şikâyet: "aynı kararlar", olaylar yüzeysel | Motto'nun kırdığı model (D-061); ama **"bir tur daha" kadansını** (60–120 sn/yıl) korumak zorunlu |
| **Gün = tur, enerji bütçeli** | Life Sim: Real Life Simulator (Biddulph), Life Simulator 2026 (günlük görevler), Life Simulator: Roleplay Sim (kısmen) | Her gün aksiyon puanı; işe git/ders al/sat; gün biter | "daily-decision pacing" övgüsü; ama menü yorgunluğu, "features barely connect to core" | **Uyarla:** gün görünür ama enerji bütçesi yok; olaysız günler tek satır (D-061). Biddulph'un tuzağı: günü doldurmak için menü → Motto'da gün **olayla** dolar, menüyle değil |
| **Seviye = yaş dilimi** | 100 Years, Life Choices | Her yaş bandı sahne; seçimler sahne içinde | "choices forcing restart", "ends at 65" | Alma; ama **Onyıl Karnesi** (30/40/50/60) benzer bir "perde" hissi verir |
| **Gerçek zaman sayaç (idle/wait)** | Idle Guy, Idle Life Sim, PassiveFlow (günlük müzayede) | Eylem = X dk bekle veya reklam izle; günlük etkinlik gerçek takvimde | iOS'ta yüksek puan ("karşılığında bir şey alıyorum") ama "ad harvesting" | **Alma** (D-065 bekleme duvarı reddi). Yalnızca gerçek takvim ritmi (Pazartesi Kampı, Mola) alınır |
| **Gerçek zaman birikim (idle anlatı)** | ALTER EGO | Kaynak uygulama kapalıyken birikir; hikâye eşiklerde | 4,8★/1,44M; "come back every few days" | **Uyarla:** birikim para değil **olay/zarf**; "sen yokken" özeti (Sakatlık Raporu) |
| **Kendiliğinden akan saat (tur yok)** | **Hiçbiri** (bu kümede) | — | — | Motto'nun D-066 kararı (⏸/▶/▶▶, 1 gün ≈ 6 sn) rafta **benzersiz**; risk: referans yok, harness'la ayarlanmalı; fırsat: ASO'da "zaman kendiliğinden akar" farklılaştırıcı |

**Gün-tabanlı oyunların ortak hatası:** günü "doldurmak" için oyuncuya iş yıkmak (menü, enerji). Motto'nun cevabı: gün **gösterilir**, oynanmaz; olay varsa durur, yoksa akar. Bu kümede kimse bunu yapmıyor.

---

## 5. Monetizasyon kalıpları ve fiyat noktaları

| Kalıp | Örnek | Fiyat (USD / TRY) | Yorumlardaki sonuç | Motto |
|---|---|---|---|---|
| Kalıcı "premium/üyelik" tek ödeme | AltLife Premium; BitLife Bitizenship | $9,99 / ₺349,99–399,99 | En az tartışılan model; "restore" bug'ları güveni bozuyor | **Al** — tek "Sertifika" açılımı; restore test edilecek |
| God Mode (stat düzenleme / geri sarma) | BitLife $9,99 (₺349,99); SimLife God Mode Forever $7,99/8,99 € | | "one bad roll never costs you the life" sevildi; kalıp tespitini bozar | **Alma** (Motto'da iddia/kalıp dürüstlüğü değer önermesi) |
| Paket açılımları (Boss/kariyer paketi) | BitLife Boss Mode ₺799,99; Movie Director paketi; TC Simülasyonu Politika/Girişimcilik paketi | | "pay to use portions are not fairly priced" | **Uyarla** — Torpil (ikinci koç kişiliği) tek kozmetik+içerik paketi; kariyer paywall'u yok |
| Reklam kaldırma | Alter Ego $2,99; 100 Years $2,99; CatLife $4,99 ("not worth") | | $2,99 kabul görüyor; $4,99 sorgulanıyor | Motto'da zorunlu reklam yok → kaldırılacak reklam yok; "Sertifika" değer vaadi içerikle |
| Aylık abonelik | ReLife RePass ~$4 (god mode + no ads + bulut + ekstra olaylar); Infinite Life (eski katmanlar) | | "strictly monthly subscription" şikâyeti, küçük stüdyoda bile | **Alma** |
| Mikro-IAP enflasyonu | Life Story (uçak, araba, kart, paket…); Age Sim $0,49–99,99 | | "cash grab" | **Alma** |
| Ucuz "jetpack" kısayolu | Infinite Life Career Jetpack $0,99 | | tartışmasız ama küçük gelir | Alma (stat atlama Motto'da yok) |
| Rewarded reklam = iyi seçenek | Life Choices | | "Good choices only by watching multiple ads" | **Alma — kırmızı çizgi** |
| Rewarded reklam = zaman atlama | Idle Guy, Idle Life Sim | | "ad harvesting" | Alma |
| Tek ödeme premium uygulama | LIFEISH; ALTER EGO COMPLEX $4,99 | | Henüz veri yok / COMPLEX karışık | Sprint 0'da A/B değil; F2P + Sertifika |
| Oyun içi reklam yüzeyi (billboard) | Lagos Life ₦500k/hafta | | Viral tarayıcı oyununda işledi | **Alma** (T9: gerçek marka yok) |

**Fiyat çıpası önerisi (Motto "Sertifika"):** $7,99–9,99 ABD / TR'de Apple katmanı ile ₺349,99 civarı — AltLife ve BitLife ile aynı raf. Türkiye'de ₺799,99 (Boss Mode) üst sınır olarak görülüyor; Motto bunun yarısında kalmalı.

---

## 6. Yorum temaları — kümenin sesi

**En çok övülen 6 şey (sıklık sırasıyla):**
1. "BitLife'tan daha derin" — yeni sistemler (AltLife, ReLife, LifePop).
2. Daha az reklam (AltLife, Infinite Life, Life in Text).
3. Geliştiricinin yoruma cevap vermesi (SimLife, Infinite Life, LifePop).
4. Günlük tempo / "elinden tutmaz" (Biddulph, ReLife).
5. Eğitici finans (The Life Simulator, Life Story).
6. Ton: "no vulgarity" (Biddulph) **ve** "memorable, personality test" (Alter Ego) — iki zıt uç; Motto kara mizahı 16+ ile ikisinin arasına değil, Alter Ego'nun "anlamlı" tarafına yaslanmalı.

**En çok şikâyet edilen 8 şey:**
1. Reklam sıklığı ("every 30 seconds") ve **reklam kaldırmanın bozulması**.
2. "Aynı kararlar her hayatta" (tekrar).
3. Bug/donma, autosave yok.
4. Rastgele ilişki ("romance is entirely random").
5. Abonelik/paywall arkasında içerik.
6. AI tutarsızlığı ve internet zorunluluğu (LLM oyunları).
7. Düşürülemeyen stat (stres), 0'dan başlayan görünüş.
8. Erken sıkıcı başlangıç, eksik tutorial.

Motto tasarımında bunların 1, 2, 5, 6 için bağlayıcı karar zaten var; 3 (autosave, harness), 4 (görünür oran), 7 (koruma penceresi 18–28) ve 8 (ilk 60 sn senaryosu) için mevcut kararlar yeterli ama test listesine eklenmeli.

---

## 7. KOPYA kararları — küme özeti

### AL (olduğu gibi, Motto'ya uyarlanmış adlarla)
| Özellik | Kaynak | Motto'da yeri |
|---|---|---|
| Varlıkların olay havuzunu değiştirmesi ("items that actually matter") | AltLife | D-067 Varlıklar şeridi |
| Tek karakterle derin ilişki, ifadeli avatar | ALTER EGO (Es) | Koç avatarı + 3 ifade |
| Hayat sonu "defining moments" + sayılar | ReLife, Infinite Life ölüm özeti | Roast Raporu |
| Mezar taşı tek cümle özeti | SimLife | Ölüm akışı (D-063) |
| Alışkanlık/habit takibi | ReLife | Kalıp Dedektörü |
| Görünür ilişki deltası (+3 Yağmur) | Infinite Life Friendship Score | D-063 uçan sayılar |
| NPC hafızası | LifePop, Infinite Life | D-023 `metaMemories` |
| Kalıcı tek ödeme, coin satmama | AltLife v35, SimLife | §8 "Sertifika" |
| Kart kaydırma = cevap | Life Choices, 1 in 8 Billion | D-065 Reigns adaptasyonu |
| "15 gizli sır" mağaza vaadi | LIFEISH | Easter egg sayısı mağaza metninde |
| Çok dilli tek binary | BitLife (Español kapanışı), Roleplay Sim | TR+EN |
| Yerel doku (kira, aile grubu, kombi) | Lagos Life, TC Simülasyonu'nun eksikliği | 03 içerik şeması |

### UYARLA
| Özellik | Kaynak | Motto versiyonu |
|---|---|---|
| "Sen yokken" dönüşü | ALTER EGO idle | Sakatlık Raporu: para değil **zarf** birikir |
| Kişilik testi → paylaşım | ALTER EGO | Teşhis + Yılın Mottosu; ciddi çerçeve parodiyi taşır |
| Başlangıç senaryoları / perk | The Life Simulator | Kondisyon (ölümle açılır, parayla değil) |
| Başarım → görsel meta nesne (kasaba) | Life Choices | "Koçun ofisi" duvarı — Sprint planına aday, zorunlu değil |
| Gün tabanlı tempo | Biddulph | Gün akar, enerji bütçesi yok, olaysız gün tek satır |
| Life Awards | ReLife | Onyıl Karnesi'nde absürt ödül kategorisi |
| Utoob yorum okuma beat'i | AltLife | İçerik üreticisi kariyerinde sahte yorum kartı |
| Ölümde "sonraki hayat ipucu" | Roleplay Sim | Koçun Son Sözü = iddia |
| Flört profili kartı | Roleplay Sim | Chat-UI içinde kurgusal NPC profil kartı |
| Hayatı HTML/PDF kitap olarak dışa aktar | 1 in 8 Billion | Roast Raporu "Tam Dosya" PDF (backend'siz) |
| Genetik / nesil mirası | Infinite Life | Kalıp mirası ("annen de erteliyordu") |
| Doğum yılı → kohort olayları | Life in Text | Gerçek takvim zaten var; yaş bandı olayları |

### ALMA (gerekçeli)
| Özellik | Kaynak | Neden |
|---|---|---|
| LLM anlatı / serbest metin | Infinite Life, AltLife Sim | Backend yok; "AI unutuyor" + internet şikâyeti; 2,5★ |
| Canlı dövüş, 17 mini-oyun, 3D sahne | AltLife, LifePop, 100 Years | Kapsam; tek mini-oyun kuralı |
| Hapishane çeteleri, casus, vampir, siyaset paketi | AltLife, LifePop, TC Sim | Ton + T9 |
| God Mode / yıl geri sarma | BitLife, SimLife | Kalıp dürüstlüğünü bozar |
| Abonelik, mikro-IAP enflasyonu, Boss Mode paywall | ReLife, Life Story, BitLife | §8 |
| Rewarded reklamla iyi seçenek / zaman atlama | Life Choices, Idle Guy | Kırmızı çizgi |
| Banner reklam | ALTER EGO | Ekran estetiği |
| Gerçek marka borsası | The Life Simulator | T9 |
| 8 çubuklu stat paneli | LifeSim (RoboBot) | Okunmuyor; 4 stat + Durum şeridi |
| Global liderlik tablosu, günlük müzayede | Biddulph, PassiveFlow | Backend gerektirir; hayali kohort yeter |
| Enerji/aksiyon bütçesi | Biddulph | Menü yorgunluğu |
| Aile editörü | SimLife | İlk hayat elle yazılı |

---

## 8. Motto için en önemli 5 çıkarım

1. **Rafta "zaman kendiliğinden akar" diyen kimse yok.** Gün tabanlılar enerji bütçesine, gerçek zamanlılar reklam sayacına, idle'lar çevrimdışı birikime bağlı. D-066 benzersiz; mağaza metninde ilk satır olmalı, ama referanssız olduğu için harness ile en çok ayarlanacak sistem.
2. **"BitLife'tan derin" yarışını kazanmak gerekmiyor;** AltLife bu yarışı kazandı ve hâlâ "bug'lı, reklamlı" diye yazılıyor. Alter Ego 1,44 milyon yorumu **tek karakter + anlam + saygılı para modeli** ile aldı. Motto'nun yolu Alter Ego'nun yolu: koç karakteri, Teşhis, dürüst fiyat.
3. **Reklam güveni kümede çökmüş durumda.** Lider bile "reklam kaldırma sayılmıyor" yorumu alıyor. Motto'nun opt-in'den başka reklamı olmaması ASO'da açıkça yazılmalı ("Zorunlu reklam yok. Koç bile buna şaşırdı.").
4. **LLM anlatı 2026'da henüz kazanmıyor** (Infinite Life 2,5★ Play). Elle yazılmış, tutarlı, iki dilli metin + NPC hafızası hâlâ farklılaştırıcı. Ancak "NPC ile konuşuyormuş hissi" talebi gerçek → D-062 chat-UI bu talebe backend'siz cevap.
5. **Türkiye'de yerli hayat simi talebi var, arz kötü** (TC Simülasyonu 1M+ indirme, 2,8–3,9★, "no inflation, no Turkish traditions"). Enflasyon, kira zammı, aile grubu, kombi ustası, dayı — Motto'nun TR locale içeriği doğrudan bu boşluğa oturur.

---

## 9. Kaynaklar (erişim: 2026-11-07, arama indeksi görüntüleri)

1. https://apps.apple.com/us/app/altlife-life-simulator/id1567044511 (+ ?see-all=reviews)
2. https://play.google.com/store/apps/details?id=com.QmzApps.LifeStory
3. https://apps.apple.com/pl/app/altlife-life-simulator/id1567044511
4. https://play.google.com/store/apps/details?id=com.bountifulgames.altlife
5. https://apps.apple.com/us/app/altlife-sim/id6756287369
6. https://play.google.com/store/apps/details?id=com.caracolu.alterego
7. https://www.hardcoredroid.com/alter-ego-review/
8. https://www.taptap.io/post/1663106
9. https://minireview.io/incremental/alter-ego
10. https://tvtropes.org/pmwiki/pmwiki.php/Videogame/AlterEgo2018
11. https://apps.apple.com/us/app/the-life-simulator/id1439862818
12. https://mwm.ai/apps/the-life-simulator/1439862818
13. https://apps.apple.com/us/app/life-choices-life-simulator/id1585419012
14. https://apps.apple.com/us/app/life-choices-2-life-simulator/id6444032529
15. https://play.google.com/store/apps/details?id=com.unicostudio.lifechoices
16. https://play.google.com/store/apps/details?id=com.unicostudio.lifechoices2
17. https://store.steampowered.com/app/3377290/Life_Choices/
18. https://apps.apple.com/us/app/life-sim-real-life-simulator/id1524045453
19. https://play.google.com/store/apps/details?id=com.biddulph.lifesim
20. https://mwm.ai/apps/life-sim-real-life-simulator/1524045453
21. https://apps.apple.com/us/app/idle-guy-life-simulator-games/id1612163874
22. https://play.google.com/store/apps/details?id=com.heatherglade.idleguy
23. https://apps.apple.com/us/app/100-years-life-simulator/id1524755868
24. https://play.google.com/store/apps/details?id=com.lawson.life
25. https://play.google.com/store/apps/details?id=com.reimer.relife
26. https://mwm.ai/apps/relife-life-simulator/6758156915
27. https://www.tiktok.com/@relife_simulator/video/7627524488636157216
28. https://apps.apple.com/us/app/simlife-life-simulator-game/id6762402054
29. https://apps.apple.com/fr/app/simlife-life-simulator-game/id6762402054
30. https://apps.apple.com/us/app/infinite-life-simulation/id6503607456
31. https://play.google.com/store/apps/details?id=co.pickle.infinite_life_sim
32. https://www.infinitelifesimulation.com/blog/infinite-life-simulation-devlog-1
33. https://www.appbrain.com/app/infinite-life-simulation/co.pickle.infinite_life_sim
34. https://apps.apple.com/us/app/lifepop-life-simulator/id6758164700
35. https://play.google.com/store/apps/details?id=com.games404limited.lifepop
36. https://www.404gameslimited.com/lifepop/
37. https://apps.apple.com/us/app/life-simulator-roleplay-sim/id1546543821
38. https://apps.apple.com/us/app/lifesim-life-simulator/id6760033677
39. https://play.google.com/store/apps/details?id=com.testa.lifesim
40. https://www.robobotstudio.com/bots.html
41. https://apps.apple.com/us/app/life-story-simulator-games/id1545866400
42. https://apps.apple.com/se/app/life-story-simulator-games/id1545866400
43. https://play.google.com/store/apps/details?id=com.lifesim.game (Life in Text)
44. https://play.google.com/store/apps/details?id=com.kiwigames.life.simulator
45. https://play.google.com/store/apps/details?id=kg.game.apps.lifesim
46. https://play.google.com/store/apps/details?id=com.MaxFunGames.RealLife (Age Sim)
47. https://apps.apple.com/us/app/idle-life-sim-simulator-game/id1501361660
48. https://apps.apple.com/pl/app/lifeish-life-simulator/id6800030907
49. https://play.google.com/store/apps/details?id=games.hayo.whilewelive (1 in 8 Billion)
50. https://play.google.com/store/apps/details?id=com.UmarKhaleeq.LifeSimulator (PassiveFlow)
51. https://apps.apple.com/us/app/bir-tc-sim%C3%BClasyonu/id1670750852
52. https://apkcombo.com/tc-sim%C3%BClasyonu/com.privateplayers.EmpatiBirTCSimulasyonu/
53. https://play.google.com/store/apps/details?id=com.ibrahimcinan.lifesimulator7
54. https://apps.apple.com/tr/app/bitlife-life-simulator/id1374403536
55. https://apps.apple.com/tr/app/bitlife-go-life-simulator/id6738096599
56. https://bitlifeapp.com/whats-new/patch-notes/
57. https://ezechax.club/bitlife-god-mode/
58. https://apps.apple.com/us/app/bitlife-dogs-doglife/id1589129140
59. https://apps.apple.com/us/app/bitlife-cats-catlife/id1598978868
60. https://lifesim.com/blog/games-like-bitlife
61. https://www.lifesimulator.io/collection/games-like-bitlife
62. https://appfelstrudel.com/a/1374403536/alternative-to-bitlife-life-simulator.html
63. https://www.gameskinny.com/culture/top-10-best-games-like-bitlife-to-get-your-life-simulator-fix/
64. https://www.vanguardngr.com/2026/10/10-things-to-know-about-the-viral-lagos-life-game/
65. https://techpoint.africa/news/lagos-life-1m-players/
66. https://guardian.ng/technology/inside-lagos-life-the-browser-game-building-a-virtual-nigerian-economy/
67. https://www.appbrain.com/app/instlife/com.instcoffee.instlife
68. https://play.google.com/store/apps/details?id=com.ManhuaLifeLifeSimulator.ManhuaLifeLifeSimulator
