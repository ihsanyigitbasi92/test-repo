# 08 — İçerik Kuralları, Hukuk ve Linter Spesifikasyonu

> **Belge türü:** Ayrıntılı tasarım dokümanı (00 §5 satır 08). Bu belge 00-VİZYON'daki D-kararlarını **uygular**, tartışmaz; 00 §1.2 ASLA listesi ve T9'un ASLA/DİKKATLİ listeleri burada satır satır kurala, kural da `content-lint` koduna döner.
> **Durum:** v1.0 · 2026-11-06 · Sahip: İçerik güvenliği + hukuk uyum tasarımcısı · Üst belgeler: 00 > T9 > T3/T10/T6 > A1–A4.
> **UYARI:** Bu belge **hukuki tavsiye değildir.** "Avukat" veya "MM" (mali müşavir) işaretli her madde, yetkili bir uzman onayı olmadan kapanmış sayılmaz. Mevzuat ve mağaza politikaları hızla değişir; tarihli kaynaklar T9'dadır.
> **Kendi kuralına uyar:** Bu doküman da `content-lint`'in `docs` kapsamından geçer. Bu yüzden yasak örnekler bilinçli olarak köşeli parantezle soyutlanmıştır ("[gerçek parti adı]"); hakaret ve cinsel terim listeleri doküman yerine özel dosyalardadır (§2.2.5, D-ÖNERİ-08-03).

---

## 0. Künye — uygulanan D-kararları, bağımlı dokümanlar, sürüm

### 0.1 00 §5'in 08 satırı ve adı geçen kararlar → somut tasarım öğesi

| Karar | Ne diyor (kısa) | Bu belgede nasıl uygulandı |
|---|---|---|
| **00 §1.2 ASLA listesi** | Tasarım + hukuk ASLA'ları CI linter'ında BLOK | §2.1'in 22 kategorisi; her madde bir `RL-`/`TN-` kural kimliğine bağlandı (§2.2.4). Listedeki her sözcük sınıfı §2.2.5 seed listelerinde. |
| **D-005** | "Rüşvet/bribe" sözcüğü ve çerçevesi UI, mağaza, pitch, kodda yasak | `RL-13` (muaf tutulamaz, tüm kapsamlar dahil `ui`, `store`, `creative`, `code` yorumları); isim üreteci ve Sözlük anahtarlarında da taranır. |
| **D-035** | İsim üreteci: yaygın ad + bileşik soyadı; blocklist = gerçek kişiler + küfür + ikonik kurgusal karakterler | §2.2.8 `isAllowedName()`; `NG-01..05`; tam-ad kombinasyon listesi + tek-token ikonik liste + üretilmiş gerçek-kişi listesi. |
| **D-037** | 16+ (Apple 16+, PEGI 16, ESRB T, IARC 16); Google "çocuklara yönelik değil"; AdMob T; metadata 4+; alkol/uyuşturucu seyrek ve sonuçlu; "+18 ağız" yok | §2.6 cevap anahtarları; §2.2.10 kotalar (QT-01..11) "seyrek"i sayıya çevirir (D-ÖNERİ-08-01); §2.2.5 `ST-` vitrin kuralları; nötr yaş ekranı (D-ÖNERİ-08-10). |
| **D-047** | CI lint release'i bloklar: eksik locale, placeholder, ICU, uzunluk oranı, buton bütçesi, yasaklı kelime, `needs-review`, `wager` oranı, `mood`, `document` çift `translate`, kurum genellemesi, askerlikte "sakatlık", koçta "bahis" | §2.2 kataloğunun tamamı; 09'un `SC-` kuralları burada referanslanır, `RL-15` (sakatlık), `RL-12` (bahis), `RL-16` (genelleme) burada tanımlanır; `RV-01/02` `needs-review`i release'te BLOK yapar. |
| **D-049** | Yasaklı ad/marka: Koç/Coach, Terminal, Son Durak, Toparlan, Normal., Memo, Sıradaki!; oyun içi replik serbest | `ST-02` yalnızca `store`/`creative`/`brand` kapsamında; oyun içi metinde taranmaz (bilinçli). |
| **D-050** | Gerçek-zaman satırları oyuncunun gerçek davranışını yorumlamaz; roast hedefi daima karakter veya koç; gerçek doğum günü v1'de yok | `RL-22` gerçek-hayat varsayımı desenleri; `TN-09` zorunlu `target` alanı (`player` değeri şemada **yok**, D-ÖNERİ-08-11). |
| **D-052** | Düşük Keyif: roast kapalı, "bugün tek şey", "Gerçek hayatta yardım" ekranı ayrı ve şakasız; intihar/kendine zarar hiçbir biçimde yok; WHO güvenli anlatım | §2.5 ekran spec'i + tetik protokolü (D-ÖNERİ-08-07); `RL-08` muaf tutulamaz; harness testi "protokol aktifken roast satırı = 0". |

**İkincil olarak uygulanan kararlar:** D-004 (Kader havuzu için `RL-23`, `RL-30`, `RL-16`; mağaza/ilk 60 sn görünmezliği `ST-06`), D-012 (03:12 satırı `RL-22` istisnası: hedef koç), D-024 (kalıp adları klinik terim listesiyle çakışmaz: `RL-26` kalıp taksonomisine de koşar), D-026 (lint "Acımasız" havuzunu da tarar; kademeye göre muafiyet yok), D-027 (`TN-01/02/06`), D-033/D-034 (`RL-17/18`), D-040/D-055 (§2.7 karanlık tasarım listesi), D-045 (lint girdisi olay başına tek JSON), D-046 (`SC-*` 09'dan devralınır), D-053 ("motivasyon" `ST-02`), D-054 (§2.4 KVKK belgeleri + UMP/ATT akışı), D-019 ("hayali/fictional" etiketi `ST-07`), D-044 (10.000 hayat harness'ına kota ve protokol testleri eklenir).

### 0.2 Bağımlı dokümanlar

- **Yukarı akış:** 00 (bağlayıcı), T9 (hukuk; madde atıfları buradan), T3 (ton ve kırmızı çizgi listesi §4.5), T10 (CI lint §3.6 ve pipeline), T6 TL;DR (mağaza/reklam uyumu), T4 (şema: `valence`, `target`, `tension`).
- **Aşağı akış (bu belgeyi tüketenler):** 01 ton kitabı (`TN-*` kurallarının yazar yüzü), 03 olay motoru (şema alanları `target`, `substance`, `effects`; harness kancaları), 06 monetizasyon (§2.7 listesi birebir UI kuralı), 07 UX (yaş ekranı, yardım ekranı, lisans ekranı, rıza akışı ekranları), 09 i18n pipeline (`content-lint` paketinin ev sahibi; `SC-*` oradan), 10 teknik mimari (CI entegrasyonu, SARIF), 11 KPI (§6 metrikleri).
- **Sahiplik sınırı:** `SC-*` (şema/i18n) kuralları **09**'un malıdır, burada yalnızca referanslanır. `RL-`, `TN-`, `QT-`, `NG-`, `ST-`, `RV-` kuralları **bu belgenin** malıdır.

### 0.3 Sürüm

v1.0 (2026-11-06): ilk tam sürüm. Değişiklik yalnızca yeni `D-ÖNERİ-08-xx` kaydı veya 00'da yeni D-kaydı ile.

---

## 1. Amaç ve kapsam — MVP / Soft launch / 1.0

**Amaç:** Oyunun iki dildeki her satırının, mağaza sayfasının, reklam kreatifinin ve hukuki belgesinin **"savunulabilir" değil "şikâyet edilemez"** olmasını mühendislikle garanti etmek (00 S5). Üç katman: (1) yazarın elindeki kural kitabı (§2.1), (2) CI'da koşan deterministik linter (§2.2), (3) insan inceleme + hukuk kapıları (§2.3–§2.8).

| Kapsam | MVP (dikey kesit, 10 hafta) | Soft launch (TR + CA/NZ) | 1.0 (global) |
|---|---|---|---|
| Kural kitabı §2.1 | 22 kategori tam; yazar brief'ine gömülü | aynı + Kader havuzu için ek okuma | aynı + Sezon Paketi içerik şablonu |
| Linter | `RL-*`, `TN-*`, `SC-*` (09), `RV-*`; blocklist seed TR/EN ≥ 150; genelleme dedektörü v1 (kural tabanlı) | + `QT-*` kotalar pool ve harness düzeyinde; `NG-*`; `ST-*` store-lint; SARIF çıktısı | + adversarial test seti 200 → 500 cümle; dedektör v2 (kural + küçük sınıflandırıcı, yalnızca `warn` üretir) |
| İnsan inceleme | 10 soruluk olay kontrol listesi; her olay 1 insan onayı | Tier A çift onay; avukat örneklemesi (%10 Tier A, %100 Kader, %100 yardım ekranı, %100 mağaza) | Release kontrol listesi her sürümde; çeyreklik avukat check-in (7578/BTK) |
| Hukuki belgeler §2.4 | Gizlilik + KVKK Aydınlatma + Açık Rıza + Koşullar + 16+ + kurgu feragatı + lisanslar; GitHub Pages TR/EN taslak | Avukat onaylı metinler; standart sözleşme bildirimi | Sürümlü yayın; değişiklik günlüğü |
| Yardım ekranı §2.5 | Ayarlar'da + düşük Keyif kartı; TR/US kaynak placeholder | + CA/NZ kaynakları; avukat doğrulaması | + GB/AU/IE; `findahelpline` yedeği |
| Yaş derecesi §2.6 | Cevap anahtarı taslak; nötr yaş ekranı | IARC + App Store Connect gerçek beyan; AdMob T | Her içerik paketinde yeniden kontrol (kotalar) |
| Karanlık tasarım §2.7 | Liste, 06/07'ye girdi | UI denetimi (checklist) | DSA/DFA takibi |
| Lansman listesi §2.8 | Sprint 0 marka taraması | KVKK paketi, vergi kurgusu | Mağaza beyanları, coğrafi kapatma |

**Kapsam dışı:** UGC/sohbet (yok), Saha Çalışması (D-006), abonelik (D-041), üçüncü dil, gerçek para kumar lisansı (yok).

---

## 2. Tasarım

### 2.1 İçerik kural kitabı — 22 kategori

Her kategori aynı dört satırla yazılır: **Kural** (ne yapılır/yapılmaz) · **Dayanak** (T9 madde atfı) · **İzinli** örnek (TR + EN, EN kendi başına komik) · **Yasak** örnek (soyutlanmış) · **Lint** (kural kimliği). Üç evrensel ilke her kategorinin üstündedir: (i) roast'un hedefi yalnızca `character | coach | situation | npc` (D-ÖNERİ-08-11), (ii) kurgusal ülke, kurgusal kurumlar, kurgusal kişiler; gerçek yalnızca şehir adı ve o da nötr bağlamda, (iii) satır bağlamından koparılıp ekran görüntüsü olarak şikâyet edilebilir mi testi.

#### K1 · Gerçek kişiler
- **Kural:** Yaşayan veya ölmüş hiçbir gerçek kişi: isim, lakap, tanınabilir parodi, avatar benzerliği, "meme" referansı. Arketip serbest ("bir ünlü şef", "26 yaşında bir girişimci").
- **Dayanak:** TCK 125, TMK 24–25, FSEK 86, TCK 299, 5816; Apple 1.1.1 (hiciv muafiyeti bizi kapsamaz); T9 ASLA-1.
- **İzinli:** TR *"26 yaşında bir girişimci şirket sattı. Sen kira ödedin. Ama onun uykusu yok, seninki var."* · EN *"Some twenty-six-year-old sold a company this year. You paid rent. He doesn't sleep. You do. I'm calling it a draw."*
- **Yasak:** *"[gerçek iş insanı] gibi olacağım dedin."* · *"You said you'd be the next [real founder]."*
- **Lint:** `RL-01` (üretilmiş gerçek-kişi listesi + unvan deseni), `NG-03`.

#### K2 · Markalar ve kurumlar
- **Kural:** Gerçek marka/kurum adı, logo, slogan, renk kombinasyonu, "karıştırılabilir" türev yok (BİMM, A-102). Jenerik tip veya kurgusal ad: "zincir market", "operatör", "Pelikan Bankası", "Yetişkinlik İşleri Dairesi". İstisna: D-048'in locale-only ikame olayı için **KPSS** sözcüğü yalnızca `geo-neutral` etiketli olayda (sınav adı; yorum yok).
- **Dayanak:** SMK 6769 m.6/5, m.7; TTK 55; TMK 24 (tüzel kişi); Apple 1.1.2, 2.3.7; T9 §4.1.
- **İzinli:** TR *"Banka 'değerli müşterimiz' dedi. Tercüme: borcun var."* · EN *"The bank called you a 'valued customer.' Translation: you owe them money, and they know where you live."*
- **Yasak:** *"[gerçek banka] seni aradı, kartın bloke."* · *"Your [real streaming service] password got changed. Fast."*
- **Lint:** `RL-06` (marka listesi, iki locale), `ST-02`.

#### K3 · Din, mezhep, inanç nesneleri
- **Kural:** Sıfır espri, sıfır ima. Dinî bayram yalnızca aile lojistiği (ziyaret, sorgu, harçlık) ve adıyla anılmaz ("bayram" / "the holidays"). Cenaze: bürokrasi, kalabalık, helva/casserole; ölenin değeri asla. Ahiret sözlüğü ("melek, Azrail, yukarıdakiler, kıyamet, reenkarnasyon, karma, ahiret") her havuzda BLOK; Kader havuzunda "yukarı/upstairs/above" + Müdürlük bağlamı BLOK (D-004). Gündelik dinî kökenli ünlemler ("inşallah/maşallah", "oh my God") koç satırında BLOK, NPC satırında WARN + incelemeci muafiyeti (D-ÖNERİ-08-04).
- **Dayanak:** TCK 216/3; Apple 1.1.5; Google Hate Speech (hiciv muafiyeti yok); T9 ASLA-3, DİKKATLİ-Din.
- **İzinli:** TR *"Bayram. 14 akraba, 3 soru: iş, evlilik, kilo. Sırayla değil; aynı anda."* · EN *"The holidays. Fourteen relatives, three questions: job, marriage, weight. Not in order. All at once."*
- **Yasak:** her türlü dua/ibadet/kutsal metin/mezhep göndermesi; *"[inanç nesnesi] taktın, şans +5."*
- **Lint:** `RL-04`, `RL-23`, `RL-30`.

#### K4 · Etnik köken, ırk, göçmenlik, cinsel yönelim ve diğer korunan gruplar
- **Kural:** Hiçbir satırda hedef değil, ima bile yok. LGBT karakterler var olabilir (saygılı, politik olmayan, eşit storylet erişimi); şaka hedefi olamaz. Göçmen/mülteci statüsü hiçbir NPC'nin tanımlayıcısı değil.
- **Dayanak:** TCK 216/1-2 (Pınar Fidan davası, Cumhuriyet/Charlie Hebdo davası); Apple 1.1.1; Google Hate Speech; T9 ASLA-4, -6.
- **İzinli:** TR *"Ev arkadaşın Barış bulaşıkları 'yarın' yıkıyor. 'Yarın' 2029'dan beri gelmedi."* · EN *"Your roommate Jordan does the dishes 'tomorrow.' Tomorrow hasn't shown up since 2029. I checked."*
- **Yasak:** *"[grup]lar hep böyledir."* · *"Typical [group]."*
- **Lint:** `RL-05`, `RL-28`, `TN-09` (npc hedefi korunan grup → BLOK).

#### K5 · Siyaset ve devlet kurumları
- **Kural:** Kurgusal ülke; "Cumhuriyet" sözcüğü ülke adı olarak dahi geçmez. Siyasi mizah tavanı "muhtar/mayor of a small town". Parti, seçim, lider, ideoloji, "sağ/sol" sözcükleri yok. Kurumlar (hükümet, meclis, yargı, ordu, emniyet) hiçbir zaman genel hüküm konusu değil; tekil kurgusal memur komik olabilir. "Bu ülkede" yerine "bu şehirde / bu hayatta".
- **Dayanak:** TCK 299, 301 (301/3 eleştiri istisnası bize güven vermez: süreç şirketi bitirir), 216; Apple 1.1.1, 1.1.2; T9 ASLA-2, DİKKATLİ-Siyaset.
- **İzinli:** TR *"Memur bey formunu üçüncü kez kaybetti. Kişisel değil; herkesinkini kaybediyor. Eşitlik."* · EN *"The clerk lost your form. Third time. It's not personal; he loses everyone's. Equal-opportunity misplacement."*
- **Yasak:** *"Bu ülkede adalet yok."* · *"All politicians are [sıfat]."*
- **Lint:** `RL-03`, `RL-16`.

#### K6 · Atatürk ve ulusal semboller
- **Kural:** Mutlak sıfır: espri, "saygı duruşu gag'ı", görsel, 10 Kasım, Anıtkabir, banknot portresi, bayrak, İstiklal Marşı, "şehit/gazi" sözcükleri. Bu kategorinin "izinli" biçimi yoktur; resmî tatil yalnızca "tatil günü" olarak, adsız. EN'de simetri için ulusal bayrak/marş/"the troops" da BLOK (Apple 1.1.2 "mean-spirited", ABD pazarında hassasiyet).
- **Dayanak:** 5816 (re'sen kovuşturma), 2893 m.7, TCK 300, TCMB 5083; T9 ASLA-2, -12.
- **İzinli:** TR *"Resmî tatil. Herkes tatilde; kiran değil."* · EN *"Public holiday. Everyone's off. Your rent isn't."*
- **Yasak:** bu kategoride her şey.
- **Lint:** `RL-02` (muaf tutulamaz), `RL-17`.

#### K7 · Askerlik (TCK 318 farkındalığı)
- **Kural:** TR'de dönem storylet'i; yalnızca gündelik komedi: komutan sesi, nöbet, çamaşır, sıra arkadaşı, telefon saati, yemek. Yasal yollar (bedelli, tecil) nötr dille seçenek. "Gitme / kaç / firar / çürük / sakatlan / yırt" seçeneği, imâsı, şakası yok. "Sakatlık" sözcüğü (koçun antrenman idiomu) askerlik etiketli olayda **engelli** (D-047). Kurum (TSK) hiçbir biçimde aşağılanmaz; hedef deneyim, kurum değil. EN'de askerlik olayı **yoktur**; ikame olay "student loans" (D-048); EN'de firar/draft sözlüğü yine BLOK.
- **Dayanak:** TCK 318 (6 ay–2 yıl), TCK 301; T9 ASLA-13, DİKKATLİ-Askerlik.
- **İzinli:** TR *"Nöbet: 02:00–04:00. Düşündüklerin: 1) hayat 2) eski sevgilin 3) çay. Sıralama senin."* · EN (ikame) *"Loan statement arrived. Your interest has a better work ethic than you do."*
- **Yasak:** *"Çürük raporu al, kurtul."* · *"Fake a limp. Skip it."*
- **Lint:** `RL-14`, `RL-15`, `RL-16`.

#### K8 · Alkol, tütün, uyuşturucu
- **Kural:** Marka yok, görsel ürün ikonu yok (bardak emojisi dahil), "nasıl" yok, glamour yok. **Alkol:** olay olarak var; kısa sosyal artı, kalıcı sağlık/para/ilişki eksisi; sarhoş araç kullanımı daima kaza/ceza; "binge" asla olumlu; 18 altı NPC'de hiç yok. **Tütün/vape:** nötr/negatif, bırakma arc'ı var. **Uyuşturucu:** yalnızca referans/maruz kalma; **karakter asla kullanmaz** (D-ÖNERİ-08-14); madde adı yok ("bir şeyler" / "something"); tuzak = oradaydın → baskın/gözaltı/arkadaş hastanede. Alkol sözlüğü yalnızca `substance:alcohol` etiketli olayda görünebilir (etiketsiz görünürse BLOK); etiketli olayın etki vektöründe en az bir kalıcı negatif zorunlu. Kotalar §2.2.10.
- **Dayanak:** TCK 190/2 (5–10 yıl), 4250 m.6, 4207 m.3; Apple 1.4.3, yaş kademesi "seyrek 13+ / sık 18+"; Google Tobacco & Alcohol; PEGI Drugs 16/18; D-037.
- **İzinli:** TR *"İş çıkışı 'bir tek'. Dört oldu. Keyif +6, Sağlık −4, sabah −12. Matematik seninle değil."* · EN *"'Just one' after work. It was four. Joy +6, Health −4, the morning −12. The math is not on your side."*
- **Yasak:** *"[marka] içtin, karizma +10."* · *"Took something at the party. Best night ever."*
- **Lint:** `RL-09`, `RL-10`, `QT-01..03`, `QT-08`.

#### K9 · Kumar
- **Kural:** Simüle kumar mini oyunu yok, oynanabilir şans mekaniği yok, paralı rastgele kutu yok. Piyango/kumarhane yalnızca anlatı olayı; beklenen değer daima negatif veya tuzak. Koç satırında "bahis/bet" **yok**, "iddia/wager" ve "oran/odds" serbest. Gerçek marka (İddaa, Milli Piyango, DraftKings) yok.
- **Dayanak:** TCK 228, 7258; Apple simüle kumar 13+/18+, ACB R18+, GRAC 19+; Ticari Reklam Yönetmeliği 2026 (bahis reklamı yasak); D-005, D-009.
- **İzinli:** TR *"Piyango bileti aldın. Oran: 1/14 milyon. Umut: ölçülemez. Para −1."* · EN *"You bought a lottery ticket. Odds: one in fourteen million. Hope: unmeasurable. Cash: minus one."*
- **Yasak:** koç ağzında *"Bahse girerim…"* (→ *"İddia:"*); herhangi bir oynanabilir rulet/slot.
- **Lint:** `RL-11`, `RL-12`, `QT-04`, `QT-09`.

#### K10 · Cinsellik ve ilişkiler
- **Kural:** Flört, evlilik, aldatma, boşanma kara komedi malzemesi; sahne "kapı kapalı"/fade-to-black; organ/eylem betimlemesi yok; rıza dışı cinsellik espri değil, ağır olay ve fail cezalanır. Tüm romantik NPC'ler ≥ 18 (şema kapısı; oyuncu zaten 18'de başlar).
- **Dayanak:** TCK 226 (226/3, 226/5 mutlak); Apple 1.1.4; Google Sexual Content; D-037.
- **İzinli:** TR *"Eve birlikte gittiniz. Defteri kapatıyorum; bazı sayfalar benim değil."* · EN *"You went home together. Closing the notebook. Some pages aren't mine to keep."*
- **Yasak:** açık betimleme; 18 altı NPC ile herhangi romantik etkileşim.
- **Lint:** `RL-19`, `RL-21`, `QT-06`.

#### K11 · Şiddet ve suç — izinli storyline seti
- **Kural (D-ÖNERİ-08-09):** Oyuncunun **seçebildiği** suçlar yalnızca şiddetsiz: küçük hırsızlık (gençlik), vergi "yaratıcılığı", sahte hastalık izni, kaçak dizi, trafik cezası kaçırma, çalıntı malı bilmeden alma, dolandırıcılığa kurban gitme. Her suç seçeneğinde `pCaught ≥ 0,35` ve beklenen değer negatif; sonuç kalıcı (sabıka etiketi, iş kaybı, aile kopması). **Şiddet** yalnızca karakterin başına gelen olay (kurban/tanık); asla başlatılan seçenek. Silah edinme seçeneği yok. Organize suç/mafya kariyeri 24 kariyerde yok; gerçek örgüt/kişi yok; "kahramanlaştırma" yok. Şiddet detayı karikatür düzeyinde ("dayak yedin, Sağlık −20").
- **Dayanak:** TCK 215, 3713 m.7/2; Apple 1.1.2, 1.1.3, 1.4; Google Violence; T9 ASLA-11, -15, DİKKATLİ-Suç.
- **İzinli:** TR *"Vergi beyannamesinde 'yaratıcı' oldun. Yaratıcılık iki yıl sonra denetimde takdir edildi. Para −40."* · EN *"You got 'creative' on your taxes. The creativity was appreciated two years later, at the audit. Cash −40."*
- **Yasak:** *"Mahalleyi haraca bağladın. Saygı +20."* · *"You joined the [real cartel]. Promotion came fast."*
- **Lint:** `RL-20`, `QT-05`; motor düzeyinde `effects` kontrolü (03).

#### K12 · İntihar ve kendine zarar
- **Kural:** Hiçbir biçimde: eylem, seçenek, şaka, deyim ("kendimi öldürürüm", "I'd rather die"), yöntem, araç, doz, intiharı çözüm gibi sunan dil, yeme bozukluğu özendirmesi. Ölüm nedenleri listesinde intihar yok. Düşük Keyif'te protokol (§2.5) devreye girer; WHO/Samaritans güvenli anlatım.
- **Dayanak:** TCK 84/3 (3–8 yıl); Google Violence (self-harm/suicide/eating disorders); Apple 1.1, 1.4; D-052; T9 ASLA-8.
- **İzinli (her ses ayarında aynı):** TR *"Zor bir yıl. Bugün tek şey: bir karar. Küçük olsun. Ben buradayım."* · EN *"Rough year. Today, one thing: one decision. Make it small. I'm not going anywhere."*
- **Yasak:** `RL-08` desen listesinin tamamı.
- **Lint:** `RL-08` (muaf tutulamaz, tüm kapsamlar).

#### K13 · Engellilik, hastalık, ruh sağlığı
- **Kural:** Karakterin başına gelebilir; koç hastalıkla değil kararlarla dalga geçer; tedavi/uyum yolları daima var. Klinik etiketler ("deli, manyak, psikopat, şizofren, otistik, depresif") ne hakaret ne teşhis olarak kullanılmaz; koç "depresyon" sözcüğünü teşhis gibi söylemez, belirtileri absürt-şefkatli anlatır. Kalıp Dedektörü'nün 12 adı klinik terimle örtüşmez (D-024) — `RL-26` taksonomi dosyasına da koşar.
- **Dayanak:** Apple 1.1.1 (engellilik, mean-spirited); Google Hate Speech (disability); T9 ASLA-5, DİKKATLİ-Engellilik; T3 §4.5 #10.
- **İzinli:** TR *"Doktor 'stres' dedi. Doktorlar bilmediklerine stres der; sen patronuna 'yoğunluk' diyorsun. Aynı hamle."* · EN *"The doctor said 'stress.' Doctors say stress when they don't know. You say 'bandwidth' to your boss. Same move."*
- **Yasak:** *"Deli misin sen?"* (kişi etiketi) · *"That's psycho behavior."*
- **Lint:** `RL-26`.

#### K14 · Beden mizahı
- **Kural:** Çekicilik stat'ının şakaları seçimlere (saç kesimi, kıyafet, profil fotoğrafı) ve oyunun saçmalığına yönelir; kilo, boy, ten, yüz hatları, engel asla.
- **Dayanak:** Apple 1.1.1; Google Bullying & Harassment; T3 §4.5 #9.
- **İzinli:** TR *"Ayrılık sonrası saç kestirdin. Klasik. Saç geri gelir, o gelmez. Sen de gidiyorsun; ileri."* · EN *"Post-breakup haircut. Classic. The hair grows back; they don't. Neither do you. Forward."*
- **Yasak:** vücut ölçüsü/özelliği içeren her punchline.
- **Lint:** `RL-27`.

#### K15 · Aile şakaları
- **Kural:** Yerel mizahın kalbi; hedef **durum** (soru bombardımanı, okunmamış sayacı, komşunun oğlu), **kişi değil**. Anne sevilir; ebeveyn şiddeti veya aile içi cinsel ima asla şaka değil (şiddet varsa ağır olay). Aile üyesinin ölümü "sessizlik kuralı"na tabi.
- **Dayanak:** T9 DİKKATLİ-Aile; Apple 1.1; T3 §5a sessizlik kuralı.
- **İzinli:** TR *"212 okunmamış. 211'i teyzenden, 1'i annenden: 'Mesajları okuyor musun?' Ben okudum. Biri okusun."* · EN *"212 unread. 211 from your aunt. One from your mom: 'Are you reading these?' I read them. Somebody had to."*
- **Yasak:** aile üyesini küçülten ("annen cahil") ya da şiddeti komikleştiren satır.
- **Lint:** `TN-09` (hedef `npc`: aile), `RL-20`.

#### K16 · Şehirler ve bölgeler
- **Kural:** Gerçek TR/ABD şehirleri yalnızca nötr bağlamda (kira, trafik, hava, manzara) ve `geo-neutral` etiketiyle. "X'liler/people from X" genellemesi yok; bölgesel etiketler (Karadenizli, Doğulu, redneck, hillbilly) yok. Ülke kurgusal: "Türkiye/Türk/Turkish" ve "America/American" oyun metninde geçmez (D-ÖNERİ-08-05); dil adı ("Türkçe/English") yalnızca Ayarlar UI'ında.
- **Dayanak:** TCK 216/2 (bölge farkı); Apple 1.1.1 (national origin); T9 ASLA-4, DİKKATLİ-Etnik/bölge.
- **İzinli:** TR *"Kadıköy. Kira: maaşının %61'i. Manzara: komşunun klima motoru."* · EN *"Cleveland. Rent: 61 percent of your pay. View: the neighbor's AC unit."*
- **Yasak:** *"[şehir]liler cimridir."* · *"People from [state] are…"*
- **Lint:** `RL-28`, `RL-02`.

#### K17 · Para, banka ve banknot
- **Kural:** Para içeride reel birim, ekranda soyut "Para/Cash"; para birimi adı/simgesi (₺, TL, lira, $, dolar, euro, pound, "bucks") yok; banknot/madeni para görseli yok (TCMB kuralları); gerçek banka yok; makro rakam (enflasyon, asgari ücret, faiz oranı, döviz kuru) yok; ekonomi mizahı yalnızca kişisel ölçekte.
- **Dayanak:** D-033, D-034; 5083 m.4; T9 DİKKATLİ (ekonomi = siyaset).
- **İzinli:** TR *"Bakiye: 0. Yuvarlamadım; sıfır yuvarlanmaz."* · EN *"Balance: zero. I didn't round. Zero doesn't round."*
- **Yasak:** *"Enflasyon %70, maaşın eridi."* · *"Inflation hit nine percent; so did your rent."*
- **Lint:** `RL-17`, `RL-18`.

#### K18 · Polis ve yargı
- **Kural:** Tekil kurgusal polis/memur/hâkim komik olabilir ("formu üç kez kaybetti"); kurum asla. "Rüşvet" sözcüğü ve çerçevesi hiçbir biçimde (D-005); yolsuzluk genellemesi yok. Suçun sonucu "mahkeme/hapis" nötr olaydır; yargı kararı alay konusu değil, karakterin kararı alay konusu.
- **Dayanak:** TCK 301, 125/3; D-005; T9 DİKKATLİ-Polis/yargı.
- **İzinli:** TR *"Trafik polisi durdurdu. Ehliyet: var. Ruhsat: var. Bahane: yok. Ceza: var."* · EN *"Traffic stop. License: yes. Registration: yes. Excuse: none. Ticket: yes."*
- **Yasak:** *"Polisler hep…"* · *"Cops are all…"*; *"memura [yasak sözcük] verdin"*.
- **Lint:** `RL-16`, `RL-13`.

#### K19 · Güncel felaket ve gerçek olaylar
- **Kural:** Deprem, sel, salgın/pandemi, savaş, terör saldırısı, gerçek dava, gerçek kaza — sıfır gönderme. Kurgusal, tarihsiz "salgın" olayı dahi v1'de yok (bilinçli sadeleştirme).
- **Dayanak:** Apple 1.1.7; Google Sensitive Events; T9 ASLA-11.
- **İzinli:** yok (kategori boş kalır). · **Yasak:** `RL-07` listesi.
- **Lint:** `RL-07`.

#### K20 · Oyuncunun gerçek hayatı
- **Kural:** Koç oyuncunun gerçek işi, ilişkisi, konumu, saati, cihazı hakkında varsayım yapmaz; roast hedefi karakter veya koçun kendisi. Gerçek-saat satırı (03:12) ömürde 1 ve hedefi koç (D-012). Gerçek hayata gönderme yalnızca evrensel ve nazik, bildirimlerde ikinci dalgada (T3 kalibrasyon). Gerçek doğum günü opt-in'i v1'de yok.
- **Dayanak:** Apple 1.1 ("creepy/mean-spirited"); KVKK veri minimizasyonu; D-050; T3 §4.5 #13.
- **İzinli (push):** TR *"Annen aradı. (Oyundaki annen. Gerçek anneni de ara.)"* · EN *"Your mom called. (The game one. Call the real one too.)"*
- **Yasak:** *"İşsizsin herhalde."* · *"You're clearly single."*
- **Lint:** `RL-22`, `TN-09`.

#### K21 · Küfür ve argo
- **Kural:** Koç satırında sıfır küfür, sıfır "lan" (persona yaşı). Olay/NPC metninde yalnızca evren-içi sansürlü biçim (`[sansür]` / `[redacted]`) ve ≤ 3/100 satır; sansürsüz küfür ve hakaret sözcüğü (slur) hiçbir yerde; "+18 ağız" modu yok (D-037).
- **Dayanak:** 00 §1.2 ("küfür sansürsüz" ASLA); Apple kaba mizah sık 13+ (bu eksende 13+ kabul); IARC Language; T3 §4.5 #12.
- **İzinli:** TR *"Patron 'bir dakika' dedi. Dakika 47 oldu. İçinden [sansür] dedin; defter sansürler."* · EN *"Boss said 'one minute.' It's been forty-seven. You said [redacted] under your breath. The notebook redacts."*
- **Yasak:** ham küfür; herhangi bir slur.
- **Lint:** `TN-11`, `QT-07`, özel liste `slurs.private`.

#### K22 · Mağaza metadata'sı ve reklam kreatifi
- **Kural:** İkon, ekran görüntüsü, açıklama, önizleme **4+ vitrin havuzundan** (`showcase: true` satırlar; ölüm, alkol, hastalık, küfür, para kaybı dışında kayıp yok). Yasak sözcükler: motivasyon/wellness/alışkanlık/terapi (D-053), rakip adları (BitLife vb., Apple 2.3.7), D-049 adları. Kreatifte yalnızca gerçek oynanış; AI üretimli "gerçek kullanıcı" tanıklığı yok; influencer paylaşımında "reklam" ibaresi. Kader kişiliği mağazada ve ilk 60 sn'de görünmez (D-004).
- **Dayanak:** Apple 2.3.6, 2.3.7, 2.3.8; Google Store Listing & Promotion; Ticari Reklam Yönetmeliği m.7, m.8, 1.7.2026 değişikliği; T9 ASLA-17.
- **İzinli (vitrin):** TR *"Karne: Para Geçer, Cesaret Pekiyi. Parasız ama gözü kara."* · EN *"Report card: Money D, Courage A. Broke but fearless."*
- **Yasak (vitrinde):** *"Öldün. 74 yaşındaydın."* (oyun içinde serbest, mağazada yasak).
- **Lint:** `ST-01..07`.

---

### 2.2 Linter spesifikasyonu (`packages/content-lint`, saf TypeScript)

#### 2.2.1 Mimari ve yerleşim

- **Paket:** `packages/content-lint` (pnpm monorepo, D-043); bağımlılığı yok (ICU parse için `@formatjs/icu-messageformat-parser`, 09'un seçimi). Motor gibi deterministik: aynı girdi → aynı çıktı; ağ yok; LLM yok (LLM yalnızca §2.2.7 v2'de ve yalnızca `warn` üretir).
- **Girdi:** `content/events/**/*.json` (olay başına tek JSON, D-045), `content/coach/**/*.json` (koç satırları), `content/motto/`, `content/glossary/`, `content/push/`, `content/names/{tr,en}.json`, `store/{tr,en}/*.md`, `creatives/manifest.json`, `docs/**/*.md` (`docs` kapsamı; yalnızca `RL-01/02/04/05/08/13` ve soyutlama kontrolü).
- **Çalışma modları:** `pnpm lint:content` (PR; `--changed-only`), `pnpm lint:content --release` (`needs-review` ve `reviewedRev<rev` BLOK'a döner; kotalar pool düzeyinde zorunlu), `pnpm lint:content --harness` (10.000 hayat çıktısı üzerinde `QT-*` ve `TN-07/10` sekans kuralları), pre-commit (yalnızca `RL-*` hızlı yol, < 2 sn).
- **Boru hattı:** `load → normalize → unitRules → poolRules (QT, NG) → harnessRules (opsiyonel) → exemptions → report (json | sarif | console)`.
- **Hız bütçesi:** 5.000 birim × 2 locale ≤ 20 sn CI'da (regex ön-derleme, Aho-Corasick benzeri çoklu-desen eşleme için basit trie).

#### 2.2.2 Tipler

```ts
export type Locale = 'tr' | 'en';
export type Severity = 'block' | 'warn' | 'info';
export type Scope = 'coach' | 'event' | 'npc' | 'choice' | 'ui' | 'push' | 'store' | 'creative' | 'name' | 'glossary' | 'docs' | 'code';
export type RoastTarget = 'character' | 'coach' | 'situation' | 'npc';   // 'player' ve 'society' yok (D-ÖNERİ-08-11)

export interface LintRule {
  id: string;                       // 'RL-08'
  severity: Severity;
  scopes: Scope[] | 'all';
  locales: Locale[] | 'all';
  exemptable: boolean;              // false → hiçbir muafiyet kabul edilmez
  legalBasis: string[];             // ['TCK 84/3', 'Google Violence', 'D-052']
  description: { tr: string; en: string };
  run(unit: ContentUnit, ctx: LintContext): LintFinding[];
}

export interface LintFinding {
  ruleId: string; severity: Severity;
  unitId: string; locale?: Locale; path: string;      // 'en.body' | 'tr.choices[2].label'
  excerpt: string; reason: string; suggestion?: string;
  exemptedBy?: Exemption;           // dolu ise rapor 'info' olur, çıkış kodunu etkilemez
}

export interface Exemption {
  ruleId: string; reason: string;
  author: string; reviewer: string;  // GitHub handle; author !== reviewer zorunlu
  approvedAt: string;                // ISO tarih
  expiresAt: string;                 // ≤ approvedAt + 180 gün
  scope: 'unit' | `locale:${Locale}` | `path:${string}`;
}

export interface ReviewMeta {
  status: 'draft' | 'needs-review' | 'needs-check' | 'approved';
  rev: number; reviewedRev: number;
  tier: 'A' | 'B';                   // A = publisher demosu + tüm karne/motto/iddia/Roast satırları
  reviewer?: string; secondReviewer?: string; lawyerSampled?: boolean;
}

export interface ContentUnit {
  id: string;
  kind: 'event' | 'coachLine' | 'motto' | 'glossary' | 'push' | 'store' | 'creative' | 'name' | 'diagnosis' | 'pattern';
  scope: Scope;
  tags: string[];                    // 'substance:alcohol' | 'askerlik' | 'geo-neutral' | 'crime' | 'death' | 'lowKeyif' ...
  target?: RoastTarget;              // koç satırlarında zorunlu
  type?: string; valence?: -2|-1|0|1|2; mood?: 'normal'|'tired'|'camp'; rarity?: 'common'|'uncommon'|'rare';
  lift?: Record<Locale, string | null>;
  locales: Partial<Record<Locale, LocalizedText>>;
  effects?: EffectVector;            // olaylarda: { health, joy, brain, charm, cash, ego, cringe, momPressure, luck, stress, flags[] }
  wager?: { pMin: 0.35; pMax: 0.65; oddsPlaceholder: true };
  document?: { translateKey: string };
  universality?: 'universal' | 'localized' | 'locale-only';
  showcase?: boolean;                // vitrin havuzu
  review: ReviewMeta;
  lintExemptions?: Exemption[];
}

export interface LocalizedText { title?: string; body?: string; choices?: { label: string; pattern?: string }[]; result?: string; footnote?: string; }

export interface LintContext {
  lists: Record<Locale, Blocklists>; // §2.2.5
  pool: ContentUnit[];               // kota kuralları için
  mode: 'pr' | 'release' | 'harness';
  harness?: HarnessSummary;          // 03'ün 10.000 hayat çıktısı
}
```

#### 2.2.3 Normalizasyon (eşleme öncesi, her iki locale)

1. **Türkçe büyük/küçük harf:** `toLocaleLowerCase('tr')` (İ→i, I→ı); EN `toLowerCase()`.
2. **Aksan katlama (ikinci geçiş):** ş→s, ç→c, ğ→g, ı→i, ö→o, ü→u; böylece ASCII yazılmış "Ataturk" da yakalanır. Eşleme iki biçimde de denenir; aksan katlanmış eşleşme yalnızca `RL-01/02/04/08` için `block`, diğerlerinde `warn` (yanlış pozitif kontrolü).
3. **Ek toleransı (TR):** `\bterim(?:'?[a-zçğıöşü]{0,7})?\b` — "Atatürk'ün", "partiye", "polisler" yakalanır. EN'de `\bterm(?:s|es|ed|ing|'s)?\b`.
4. **Gizleme kırma:** harfler arası nokta/boşluk/çizgi (`A.K.P`, `A K P`), tekrarlayan harf sıkıştırma (`esrarrr`), leet (`0→o`, `1→i`, `3→e`, `4→a`, `5→s`, `@→a`) — yalnızca `RL-*` için.
5. **Placeholder maskeleme:** ICU argümanları `{…}` eşleme öncesi `⟨arg⟩` ile değiştirilir; placeholder adları ayrı taranır (`{god}` gibi bir ad da `RL-04`'e takılır).
6. **Bağlam penceresi:** satır içi kuralların çoğu cümle düzeyinde; genelleme dedektörü (§2.2.7) ±8 token penceresi.

#### 2.2.4 Kural kataloğu

**Seviye sözlüğü:** `block` = PR merge edilemez, release build kırılır. `warn` = merge edilebilir, haftalık inceleme kuyruğuna düşer; `--release`'te açık `warn` sayısı > 0 ise release **kırılmaz** ama rapor zorunlu imza ister (RV-06). `info` = rapor.

| ID | Sev. | Kapsam | Muaf? | Kural | Dayanak |
|---|---|---|---|---|---|
| **RL-01** | block | all | hayır | Gerçek kişi: üretilmiş liste (≥ 5.000 ad; TR siyasetçi/ünlü/iş insanı/sporcu/influencer, EN küresel ünlüler) + unvan deseni (`(Cumhurbaşkanı|Başbakan|Bakan|Vali|Sayın|President|Senator|Governor) + Büyük harfli token`) | TCK 125/299, 5816, TMK 24, Apple 1.1.1 |
| **RL-02** | block | all | hayır | Atatürk/ulusal sembol/devlet-ülke adı sözlüğü (TR + EN simetri) | 5816, 2893, TCK 300 |
| **RL-03** | block | all | hayır | Parti, seçim, ideoloji, darbe tarihleri, gerçek makam | TCK 299/301/216 |
| **RL-04** | block/warn | all | NPC'de evet | Din sözlüğü; gündelik ünlemler NPC'de `warn` (D-ÖNERİ-08-04) | TCK 216/3, Apple 1.1.5 |
| **RL-05** | block | all | hayır | Etnik/ırk/göçmen/cinsel yönelim terimleri **punchline bağlamında** (aynı cümlede olumsuz yüklem veya genelleme) ; nötr varlık (NPC kimliği) `warn` | TCK 216, Apple 1.1.1, Google Hate Speech |
| **RL-06** | block | event, coach, npc, push, store | evet (jenerik sözcük çakışması: "apple" meyve) | Marka/kurum listesi (TR+EN) ve karıştırılabilir türev (Levenshtein ≤ 1 + aynı ilk harf, uzunluk ≥ 4) | SMK 6769, TTK 55, Apple 2.3.7 |
| **RL-07** | block | all | hayır | Güncel felaket/olay sözlüğü | Apple 1.1.7, Google Sensitive Events |
| **RL-08** | block | all | hayır | İntihar/kendine zarar/yeme bozukluğu desenleri (deyimler dahil) | TCK 84/3, Google Violence, D-052 |
| **RL-09** | block | all | hayır | Uyuşturucu madde adları ve argosu; "uyuşturucu/drugs" sözcüğünün kendisi de (olay "bir şeyler" der) | TCK 190/2, Apple 1.4.3 |
| **RL-10** | block | all | hayır | Alkol/tütün markaları; jenerik alkol/tütün sözlüğü `substance:*` etiketi olmayan birimde → block (etiket uyumsuzluğu) | 4250 m.6, 4207 m.3, Google T&A |
| **RL-11** | block | all | hayır | Kumar markaları ve oynanabilir kumar sözlüğü (slot, rulet, casino…) `gambling:narrative` etiketi dışında | TCK 228, Apple simulated gambling |
| **RL-12** | block | coach, push, store | hayır | "bahis/bet/betting" koç ağzında (iddia/wager/odds serbest); `İddaa` marka her yerde | D-005/D-009, A4 §12 #2 |
| **RL-13** | block | all + code | hayır | "rüşvet/bribe/kickback" her biçimi (kod yorumları ve identifier'lar dahil: `bribe*`) | D-005, Apple 1.1.1 |
| **RL-14** | block | all | hayır | Askerlik: "gitme/kaç/firar/çürük/sakatlan/yırt" + askerlik bağlamı; EN draft/AWOL sözlüğü | TCK 318 |
| **RL-15** | block | event, coach | hayır | `askerlik` etiketli birimde "sakat*" kökü (koç idiomu çakışması) | D-047 |
| **RL-16** | block/warn | all | evet (yalnızca `warn`) | Kurum genellemesi dedektörü (§2.2.7): skor ≥ 5 block, 3–4 warn | TCK 301/216, T9 §5c-4/12 |
| **RL-17** | block | all | hayır | Para birimi adı/simgesi, banknot, gerçek banka; "lira/₺/TL/$/dolar/euro/bucks" | D-033, 5083 |
| **RL-18** | block | all | hayır | Makro ekonomi: "enflasyon/asgari ücret/faiz oranı/döviz/Merkez Bankası" ve `%\d+` ile birlikte ekonomi sözcüğü | D-034 |
| **RL-19** | block | all | hayır | Açık cinsel betimleme (özel liste) | TCK 226, Apple 1.1.4 |
| **RL-20** | block | all | hayır | İşkence/organ/gerçekçi şiddet detayı; aile içi şiddetin şaka bağlamı | Apple 1.1.2, Google Violence |
| **RL-21** | block | event | hayır | Şema: `romance|dating|sex` etiketli olayda NPC `age < 18` veya yaş alanı boş | TCK 226/3, D-037 |
| **RL-22** | block | coach, push | D-012 satırı için sabit istisna | Oyuncunun gerçek hayatı: "işsizsin/yalnızsın/konumun/telefonun/gerçek hayatta sen/doğum günün"; gerçek-saat satırında `target !== 'coach'` | Apple 1.1, D-050 |
| **RL-23** | block | all | hayır | Ahiret sözlüğü (melek, Azrail, kıyamet, ahiret, karma, reenkarnasyon, cennet/cehennem, heaven/hell/afterlife) | 00 §1.2, D-004 |
| **RL-24** | block | store, creative | hayır | Metadata yasak sözcükleri: motivasyon/wellness/alışkanlık/terapi/meditasyon + EN karşılıkları | D-053, Apple 1.4.5 kayması |
| **RL-25** | block | store, creative | hayır | Rakip adları (BitLife, InstLife, AltLife, Bitizen, Candywriter) ve "X'ten iyi" karşılaştırması | Apple 2.3.7, Yönetmelik m.8 |
| **RL-26** | block | all | hayır | Ruhsal/zihinsel/fiziksel durum etiketleri kişiye yöneltilmiş (`sen + etiket`, `etiket + misin`), teşhis olarak koç ağzında "depresyon"; kalıp taksonomisi klinik terim içeremez | Apple 1.1.1, D-024 |
| **RL-27** | block | all | hayır | Beden sözlüğü (kilo/boy/ten/yüz) + 2. tekil veya NPC hedef | Apple 1.1.1 |
| **RL-28** | block | all | hayır | Demonym genellemesi: `\b\p{Lu}\w+(lı|li|lu|lü)lar\b` / `people from X` + yüklem; bölge etiketleri; "Türkiye/Türk/America/American" oyun metninde | TCK 216/2, D-ÖNERİ-08-05 |
| **RL-29** | block | coach, push | hayır | Gerçek dünya eylemine itme: "gerçekten yap / şimdi git … / challenge / dare" (Saha Çalışması yok, D-006) | Apple 1.4.5 |
| **RL-30** | block | coach (persona `kader`) | hayır | "yukarı(da)/yukarıdakiler/upstairs/above/the man upstairs" + Müdürlük bağlamı | D-004 |
| **TN-01** | block | coach, push | hayır | Kontrol dili: yapmalısın/zorundasın/mecbursun/kendini topla/toparlan/utan; you should/must/have to/need to/get a grip/pull yourself together/shame on you | D-027, T3 SDT |
| **TN-02** | block | coach, push | hayır | Yetenek övgüsü: zekisin/akıllısın/yeteneklisin/harikasın/kendine inan; you're smart/talented/amazing/a genius/believe in yourself/you got this | D-027 |
| **TN-03** | block | coach | hayır | Emoji (`\p{Extended_Pictographic}`) koç metninde | 00 §1.2 |
| **TN-04** | warn | coach | evet (`rarity:rare`) | Ünlem işareti | T3 YAPMA-6 |
| **TN-05** | block | coach | hayır | Balon > 2 cümle; cümle > 14 kelime; punch > 6 kelime (son cümle); beat'te > 3 balon (03 sekans) | T3 YAP-2 |
| **TN-06** | block | coach (`valence ≤ -1`) | hayır | `lift` alanı: dolu ise ≤ 6 kelime ve oyun içi seçim önerir (gerçek hayat fiili yok: "ara/git/yap" + gerçek nesne → block); Nazik kademede zorunlu, Normal'de 3 beat'te ≥ 1 (harness) | D-027, 00 §3.6 |
| **TN-07** | block | harness | hayır | "koçum/champ" yılda > 1; "dayı/uncle sıcaklığı" etiketi yılda > 1 | 00 §3.1 |
| **TN-08** | block | coach | hayır | "kanka/bro/dude/canım/tatlım/aşkım/sweetie/honey/bestie" | T3 YAPMA-7 |
| **TN-09** | block | coach | hayır | `target` alanı zorunlu ve enum içinde; `npc` hedefinde NPC etiketi korunan grup içeriyorsa block | D-ÖNERİ-08-11, T4 şema |
| **TN-10** | block | harness | hayır | İki `type:motivational` beat art arda; aynı yılda iki `bathos` | 00 §1.2, T3 §3.2 |
| **TN-11** | block | coach / event | hayır / kota | Küfür: koçta sıfır (sansürlü dahil), "lan" dahil; olay/NPC'de yalnızca `[sansür]/[redacted]` biçimi; slur özel listesi her yerde block | 00 §1.2, D-ÖNERİ-08-08 |
| **SC-01..13** | 09'un tanımı | event, coach | 09'a göre | Eksik locale, ICU parse, placeholder eşitliği (`gender` hariç), `other` dalı, uzunluk oranı 0,7–1,3, buton bütçesi TR 18 / EN 16, elle yazılmış ek, `intent`+`universality`, `valence/mood/type` enum, `wager` oran placeholder'ı, `document` çift `translate` + Sözlük anahtarı, `pattern` enum (12), swap tablosu | D-046, D-047 |
| **QT-01..11** | block (release) / warn (pr) | pool, harness | hayır | §2.2.10 kotaları | D-037 |
| **NG-01..05** | block | name | hayır | §2.2.8 isim üreteci | D-035 |
| **ST-01** | block | store | hayır | Ekran görüntüsü/önizleme metni yalnızca `showcase:true` birimlerden (manifest eşleşmesi) | Apple 2.3.8 |
| **ST-02** | block | store, creative, brand | hayır | D-049 adları ve `RL-24/25` sözcükleri; "ücretsiz!/bedava/#1/en iyi" iddiaları veri yoksa | D-049, D-053, Yönetmelik m.7 |
| **ST-03** | block | store | hayır | Apple ad 30 / alt başlık 30 / keyword 100 byte; Play 30/80 | T10 §5 |
| **ST-04** | block | showcase | hayır | `showcase:true` birimde `death|alcohol|tobacco|illness|crime|profanity|lowKeyif` etiketi veya sözlüğü | Apple 2.3.8, D-037 |
| **ST-05** | block (manuel kutu) | creative | hayır | Kreatif manifestinde `realGameplay:true`, `aiTestimonial:false`, `influencerAdLabel:true` zorunlu | Yönetmelik m.7 + 2026 değişikliği |
| **ST-06** | block | store, creative, ftue | hayır | Kader kişiliği satırı/görseli mağazada, kreatifte veya ilk 60 sn akışında | D-004 |
| **ST-07** | block | ui, store | hayır | Kamp kıyas kartı ve kohort metinlerinde "hayali/fictional" etiketi eksik; "şu an X kişi" sahte sayaç deseni | D-019, D-055 |
| **RV-01** | block (release) | all | hayır | `review.status !== 'approved'` | D-047 |
| **RV-02** | block (release) | all | hayır | `reviewedRev < rev`; intent değişti ise iki locale `needs-review` | T10 §6 |
| **RV-03** | block | all | — | Muafiyet geçerliliği: kural `exemptable`, `author ≠ reviewer`, `expiresAt` geçmemiş, PR onaylayan = `reviewer` | D-ÖNERİ-08-02 |
| **RV-04** | block (release) | Tier A | hayır | `tier:'A'` birimde `secondReviewer` boş | D-ÖNERİ-08-12 |
| **RV-05** | block (release) | etiket | hayır | `persona:kader`, `lowKeyif`, `help-screen`, `store` birimlerinde `lawyerSampled:true` değil | 00 §10 açık soru 3 |
| **RV-06** | block (release) | rapor | — | Açık `warn` > 0 ve `release-signoff.json` imzasız | §2.2.12 |

#### 2.2.5 Blocklist dosyaları ve seed listeleri

**Dosya düzeni:** `content/redlines/<locale>/<kategori>.txt`; satır biçimi `terim | sev | scopes | not` ; regex satırı `re: <desen> | sev | scopes | not`. Örnek: `İddaa | block | all | marka; "iddia" serbest (büyük İ + çift a)`. **Özel dosyalar** (`content/redlines/private/`): `slurs.{tr,en}.txt`, `sexual.{tr,en}.txt`, `realpersons.{tr,en}.generated.txt`. Bunlar repoda şifreli değil ama `docs/` dışında ve README'siz tutulur; CI dosyanın SHA-256'sını `redlines.lock`'a karşı doğrular (D-ÖNERİ-08-03). Gerçek-kişi listesi Sprint 0'da Wikidata SPARQL ile üretilir (TR: `P27=Q43` + `P106 ∈ {siyasetçi, oyuncu, şarkıcı, iş insanı, sporcu, gazeteci, influencer}` + tüm milletvekilleri/bakanlar/belediye başkanları 1983→; EN: `sitelinks ≥ 40` küresel ünlüler), ad+soyad ve bilinen lakaplarla; aylık yenilenir. Doküman bu listeyi **yazmaz**; yalnızca unvan desenlerini verir.

**Seed sayıları (bu belgede yazılı):** TR 212 terim/desen, EN 219 terim/desen (özel listeler ve üretilmiş liste hariç). Listeler aşağıda kategori başına; `~` işareti ek toleranslı kök demektir.

**TR seed listesi**

| Kategori (dosya) | Sev. | Terimler |
|---|---|---|
| `national.txt` (RL-02) | block | Atatürk~, Mustafa Kemal, Ata (büyük harf, tekil), Ulu Önder, Gazi Paşa, 10 Kasım, Anıtkabir, Cumhurbaşkan~, Başbakan~, Saray (büyük harf), Külliye, Beştepe, Çankaya, Reis (büyük harf), TBMM, Meclis, Bakan~, Bakanlık, Vali~, Kaymakam~, Hükümet, Devlet (büyük harf; "devlet memuru" → warn), Cumhuriyet (ülke adı), Türkiye, Türk~, Türkçe (UI dışı), bayrak~, ay yıldız, İstiklal Marşı, şehit~, gazi~, TSK, Genelkurmay, Jandarma, Emniyet, MİT, Yargıtay, Danıştay, Anayasa Mahkemesi, AYM, savcı~ (warn), hâkim~ (warn; tekil kurgusal serbest) — **42** |
| `politics.txt` (RL-03) | block | AKP, AK Parti, CHP, MHP, İYİ Parti, HDP, DEM Parti, Zafer Partisi, Yeniden Refah, Saadet Partisi, DEVA, Gelecek Partisi, TİP, seçim~, sandık (siyasi bağlam), oy ver~, parti (siyasi bağlam; "doğum günü partisi" istisna: `parti` + `doğum|düğün|ev` → serbest), iktidar, muhalefet, sağcı, solcu, sağ/sol (siyasi yüklemle), Kemalist, Atatürkçü, İslamcı, laik~, laiklik, milliyetçi, ülkücü, komünist, faşist, darbe, 15 Temmuz, 28 Şubat, 12 Eylül, Gezi, 6-7 Eylül — **36** |
| `religion.txt` (RL-04, RL-23) | block (NPC ünlemleri warn) | Allah~, Tanrı~, Rab, peygamber~, Hz., Muhammed, İsa, Musa, Kur'an, Kuran, İncil, Tevrat, ayet, sure (dinî), hadis, cami~, kilise~, havra, sinagog, namaz, abdest, oruç, Ramazan, Kurban Bayramı, iftar, sahur, teravih, ezan, imam, müezzin, hoca (dinî bağlam; "hoca" öğretmen anlamı: `okul|ders|sınav` ile serbest), papaz, haham, Alevi, Sünni, Şii, Hristiyan, Yahudi, Müslüman, ateist, deist, cennet, cehennem, günah~, sevap, helal, haram, melek~, Azrail, kıyamet, ahiret, mahşer, reenkarnasyon, karma, yukarıdakiler, nazar, nazar boncuğu, muska, cin (varlık), büyü, şeytan, iblis, dua~, amin, inşallah (warn/NPC), maşallah (warn/NPC), vallahi (warn/NPC), hacı, hac, umre, zekât, fitre, alın yazısı (warn), kısmet (warn), nasip (warn) — **66** |
| `protected.txt` (RL-05, RL-28) | block (punchline bağlamı) | Kürt~, Ermeni~, Rum~, Arap~, Suriyeli~, Afgan~, mülteci~, göçmen~, sığınmacı~, Roman~, Çingene~, Laz~, Çerkez~, Gürcü~, Boşnak~, Zaza~, Karadenizli~, Doğulu~, Güneydoğulu~, Egeli~, eşcinsel (warn), gey (warn), lezbiyen (warn), trans (warn), LGBT (warn), biseksüel (warn), `re: \b\p{Lu}\w+(lı|li|lu|lü)lar\b` (demonym) — **27** |
| `ability_body.txt` (RL-26, RL-27) | block (kişiye yöneltilmiş) | engelli~, özürlü~, sakat (kişi: `sakat (adam|kadın|çocuk|insan)|sakatsın`), topal~, kör~ (kişi), sağır~ (kişi), kekeme~, cüce~, şişko~, şişman~, obez~, kilolu~, çirkin~, kel (warn), deli~ (etiket; "delirdim" abartısı serbest), manyak~, psikopat~, şizofren~, otistik~, down sendrom~, gerizekalı, geri zekâlı, aptal~ (2. tekil), salak~ (2. tekil), embesil, spastik~, depresif (etiket), bipolar, anoreksik~ — **29** |
| `substances.txt` (RL-09, RL-10) | block | esrar~, ot (madde bağlamı: `ot (iç|çek|sar)`), joint, bonzai, kokain~, eroin~, ekstazi, MDMA, LSD, asit (madde), metamfetamin, met (madde), uyuşturucu~, torbacı~, hap (warn; `baş ağrısı|doktor` ile serbest), rakı~ (tag-gated), bira~ (tag-gated), şarap~ (tag-gated), votka, viski, tekila, likör, kadeh~ (tag-gated), sarhoş~ (tag-gated), Efes, Tuborg, Bomonti, Yeni Rakı, Tekirdağ Rakısı, Kavaklıdere, Doluca, Carlsberg, Heineken, Absolut, Smirnoff, Jack Daniel's, Johnnie Walker, Chivas, Jägermeister, Corona (içecek), Guinness, Bacardi, sigara~ (tag-gated), vape (tag-gated), elektronik sigara, nargile (tag-gated), tütün (tag-gated), Marlboro, Camel, Winston, Parliament, Kent (sigara bağlamı), Lark, Lucky Strike, Davidoff, Samsun (sigara bağlamı), Maltepe (sigara bağlamı), Tekel, Juul, IQOS, Vuse, Elf Bar, Puff — **62** |
| `gambling.txt` (RL-11, RL-12) | block | bahis~ (coach), İddaa, Nesine, Misli, Bilyoner, Tuttur, Oley, casino, kumarhane (tag-gated), slot, rulet, poker, blackjack, kupon (bahis bağlamı), canlı bahis, Milli Piyango, Sayısal Loto, Şans Topu — **18** |
| `bribe.txt` (RL-13) | block | rüşvet~, rüşvetçi~, şike~, "el altından" (para bağlamı), `re: bribe\w*` (kod) — **5** |
| `military.txt` (RL-14, RL-15) | block | askere gitme, askerden kaç~, firar~, çürük raporu, çürüğe çık~, sakatlan~, `sakat~` (askerlik etiketi), askerlikten yırt~, tecil hilesi — **9** |
| `disaster.txt` (RL-07) | block | deprem~, sel (afet bağlamı), salgın~, pandemi~, Covid, korona~, karantina~, savaş~, terör~, terörist~, bomba~, patlama (saldırı bağlamı), saldırı (terör bağlamı), Gazze, Ukrayna, Suriye, İsrail, Filistin, Rusya, 6 Şubat, 17 Ağustos, Soma — **22** |
| `selfharm.txt` (RL-08) | block | intihar~, canına kıy~, kendini öldür~, kendini as~, bileğini kes~, kendine zarar, aşırı doz, hapları iç~, yeme bozukluğu, anoreksi~, bulimi~, "ölmek istiyorum", "yaşamak istemiyorum", "hiçbir anlamı yok" (warn), "kendimi öldürürüm" (deyim dahi) — **15** |
| `money.txt` (RL-17, RL-18) | block | TL, ₺, lira~, dolar~, $, euro, €, sterlin, enflasyon~, asgari ücret, faiz oranı, zam oranı, döviz~, kur (ekonomi bağlamı), Merkez Bankası, TCMB, BDDK, SPK, borsa (warn), BIST, banknot~ — **21** |
| `tone.txt` (TN-01, TN-02, TN-08) | block | yapmalısın, yapman lazım, zorundasın, mecbursun, kendini topla, toparlan~, kendine gel, utan~, zekisin, akıllısın, yeteneklisin, harikasın, süpersin, kendine inan, inan kendine, sen yaparsın, kanka, bro, canım, tatlım, aşkım, hayatım (hitap), kuzum — **23** |
| `store.txt` (RL-24, RL-25, ST-02) | block (store/creative) | motivasyon~, motivasyonel, wellness, alışkanlık~, terapi~, terapist, psikolog, meditasyon, sağlık uygulaması, BitLife, InstLife, AltLife, Bitizen, Koç (ad), Terminal (ad), Son Durak, Toparlan, Memo (ad), Sıradaki! — **19** |
| `reallife.txt` (RL-22, RL-29) | block (coach/push) | işsizsin, yalnızsın, bekârsın, "gerçek hayatta sen", "senin hayatın da", telefonun, "bulunduğun yer", konumun, "saat şu an" (hedef koç değilse), doğum günün, "gerçekten yap", "şimdi git" — **12** |
| `brands.txt` (RL-06) | block | BİM, A101, Şok (market), Migros, CarrefourSA, Trendyol, Hepsiburada, Getir, Yemeksepeti, Turkcell, Vodafone, Türk Telekom, THY, Pegasus, AJet, Ziraat, Halkbank, VakıfBank, Garanti, Akbank, İş Bankası, Yapı Kredi, QNB, Denizbank, Papara, Enpara, Sahibinden, Letgo, Dolap, Arçelik, Beko, Vestel, Koç Holding, Sabancı, Ülker, Eti, Torku, Sütaş, Pınar (marka), LC Waikiki, DeFacto, Koton, Mavi (marka), Beymen, Boyner, Teknosa, MediaMarkt, Netflix, BluTV, Exxen, Tabii, TRT, ATV, Kanal D, Show TV, Star TV, Ekşi Sözlük, Zaytung, Instagram, TikTok, WhatsApp, LinkedIn, Twitter, X (platform), YouTube, Spotify, e-Devlet, SGK, İŞKUR, ÖSYM, YÖK, MEB, TÜİK, PTT, İETT, Marmaray, İstanbulkart, BiTaksi, Martı, Uber — **80** (KPSS yalnızca `geo-neutral` etiketiyle serbest) |

**EN seed listesi**

| Kategori (dosya) | Sev. | Terimler |
|---|---|---|
| `national.txt` (RL-02, RL-03) | block | President, POTUS, White House, Congress, Senate, Senator~, Governor~, Supreme Court, Pentagon, FBI, CIA, ICE, IRS (→ "the tax office"), Republican~, Democrat~, GOP, MAGA, liberal (siyasi), conservative (siyasi), left-wing, right-wing, woke, Labour, Tory~, Brexit, Parliament, the Queen, King Charles, Royal Family, election~, ballot, impeach~, Capitol, January 6, Union Jack, Stars and Stripes, national anthem, Pledge of Allegiance, the troops, veterans (grup), the military (genelleme), America~, American~, Trump, Biden, Obama, Clinton, Bush (kişi), Harris, Musk, Bezos, Zuckerberg, Gates (kişi), Putin, Zelensky, Netanyahu, Erdogan — **55** (`Mayor` warn; kurgusal küçük kasaba serbest) |
| `religion.txt` (RL-04, RL-23) | block (idiomlar NPC'de warn) | God (ünlem dahil), Jesus, Christ, Allah, Muhammad, Prophet, Bible, Quran, Koran, Torah, church, mosque, synagogue, temple (dinî), pray~, prayer, amen, hallelujah, sin~, sinner, blessed, holy, pastor, priest, rabbi, imam, nun, Muslim, Christian, Jewish, Jew, Catholic, Protestant, Evangelical, Mormon, Hindu, Buddhist, atheist, heaven, hell (yer), afterlife, angel~, Grim Reaper, karma, reincarnation, judgment day, apocalypse, rapture, Christmas (warn → "the holidays"), Easter, Ramadan, Hanukkah, Diwali, baptism, bar mitzvah, halal, kosher, crucifix, hijab, burqa, yarmulke, turban, upstairs (persona kader), "the man upstairs", "thoughts and prayers", "God bless", "oh my God" (warn/NPC), OMG (warn/NPC), goddamn, "Jesus Christ" (ünlem) — **68** |
| `protected.txt` (RL-05, RL-28) | block (punchline bağlamı) | Black (ırk), white (ırk bağlamı), Asian, Hispanic, Latino~, Mexican~, Indian~, Chinese, Arab~, immigrant~, illegal alien, refugee~, migrant~, gypsy, redneck~, hillbilly, trailer trash, white trash, ghetto, hood (yer), thug~, "those people", gay (warn), lesbian (warn), trans (warn), queer (warn), LGBT (warn), nonbinary (warn), `re: people from [A-Z]\w+ (are|always|never)` — **29** |
| `ability_body.txt` (RL-26, RL-27) | block (kişiye yöneltilmiş) | disabled (etiket), retard~, cripple~, midget, dwarf (kişi), blind (kişi), deaf (kişi), autistic, bipolar, schizo~, psycho~, crazy (etiket; "this is crazy" serbest), insane (etiket), lunatic, nuts (kişi), fat~ (kişi), obese, ugly, anorexic, loser (2. tekil), lazy (2. tekil, gerçek hayat) — **21** |
| `substances.txt` (RL-09, RL-10) | block | weed, pot (madde), marijuana, cannabis, joint, blunt, bong, edible~ (madde), dab, coke (madde), cocaine, crack (madde), heroin, meth, molly, ecstasy, MDMA, acid (madde), LSD, shrooms, mushrooms (warn), Xanax, Adderall, oxy, fentanyl, Percocet, Vicodin, ketamine, "a line", "a hit", "a bump", dealer (madde), plug (argo), drugs, drunk (tag-gated), wasted (tag-gated), hammered (tag-gated), shots (tag-gated), beer (tag-gated), wine (tag-gated), vodka, whiskey, tequila, gin, rum, Budweiser, Bud Light, Coors, Miller, Heineken, Corona (içecek), Guinness, Jack Daniel's, Jim Beam, Jameson, Johnnie Walker, Absolut, Grey Goose, Smirnoff, Bacardi, Captain Morgan, Jägermeister, Fireball, White Claw, Marlboro, Camel, Newport, Lucky Strike, Pall Mall, Juul, Vuse, Elf Bar, Puff Bar, Zyn, vape (tag-gated), cigarette~ (tag-gated) — **77** |
| `gambling.txt` (RL-11, RL-12) | block | bet (coach; "wager/odds" serbest), betting, bookie, parlay, sportsbook, DraftKings, FanDuel, Bet365, BetMGM, casino (tag-gated), slots, slot machine, roulette, poker, blackjack, craps, Vegas (warn), Powerball, Mega Millions, jackpot (warn), "double or nothing" — **21** |
| `bribe.txt` (RL-13) | block | bribe~, bribery, kickback~, payoff (rüşvet bağlamı), "under the table", "grease * palm", "pay off the ref", match-fixing — **8** |
| `military.txt` (RL-14) | block | desert~ (asker), deserter, AWOL, "dodge the draft", draft dodger, "fake an injury" (askerî), "go AWOL" — **7** |
| `disaster.txt` (RL-07) | block | earthquake~, hurricane~, wildfire~, tsunami, pandemic, COVID~, coronavirus, lockdown, quarantine, 9/11, terrorist~, terrorism, bombing, mass shooting, school shooting, war (gerçek), Gaza, Ukraine, Israel, Palestine, Russia, Katrina, Sandy Hook, Columbine, Uvalde, Parkland — **26** |
| `selfharm.txt` (RL-08) | block | suicide, suicidal, `re: kill (myself|yourself|himself|herself|themselves)`, "end it all", "end my life", self-harm, `re: cut(ting)? (myself|yourself)`, overdose, OD, `re: hang (myself|yourself)`, "jump off", "not worth living", "better off dead", anorexia, bulimia, purge (yeme), thinspo, pro-ana, "want to die", "wish I was dead", "I'd rather die" (deyim dahi) — **20** |
| `money.txt` (RL-17, RL-18) | block | dollar~, $, bucks, USD, euro~, pound~ (para), inflation, interest rate, the Fed, Federal Reserve, minimum wage, stock market (warn), S&P, Dow, Nasdaq, Bitcoin (warn; "crypto" serbest), Wall Street, recession, GDP, tariff~ — **20** |
| `tone.txt` (TN-01, TN-02, TN-08) | block | "you should", "you must", "you have to", "you need to", "you ought to", "get a grip", "pull yourself together", "snap out of it", "shame on you", "you're smart", "you're so smart", "you're talented", "you're amazing", "you're a genius", "believe in yourself", "you got this", "you've got this", "you can do it", bro, dude, bestie, sweetie, honey, buddy (warn), champ (harness ≤ 1/yıl) — **25** |
| `store.txt` (RL-24, RL-25, ST-02) | block (store/creative) | motivation~, motivational, wellness, habit~, therapy, therapist, "mental health", self-care, mindfulness, meditation, BitLife, InstLife, AltLife, Bitizen, Candywriter, Coach (ad), Terminal (ad), Last Stop, Get a Grip, Next! (ad), "#1", "best" (veri yoksa) — **22** |
| `reallife.txt` (RL-22, RL-29) | block (coach/push) | "you're unemployed", "you're single", "you're alone", "in real life you", "your real", "your phone", "your location", "where you are right now", "it's late where you are", "your birthday", "actually do it", "go do it right now", challenge (gerçek dünya), dare — **14** |
| `brands.txt` (RL-06) | block | Netflix, Spotify, Instagram, TikTok, Facebook, Twitter, WhatsApp, LinkedIn, Tinder, Bumble, Hinge, Uber, Lyft, DoorDash, Amazon, Apple (şirket), iPhone, Google, Samsung, Tesla, Starbucks, McDonald's, Walmart, Target (mağaza), Costco, IKEA, Zara, H&M, Nike, Adidas, Chase, Wells Fargo, Bank of America, Visa, Mastercard, PayPal, Venmo, Zelle, Robinhood, Coinbase, Delta, United (havayolu), American Airlines, Marriott, Hilton, Airbnb, Disney, Marvel, Pokémon, Nintendo, PlayStation, Xbox, Fortnite, Roblox, Minecraft, Zoom, Slack, Microsoft, Teams, Excel (→ "spreadsheet"), Outlook, Gmail, Yahoo — **63** |

**Private listeler (sayı hedefi):** `slurs.tr` ≥ 60, `slurs.en` ≥ 120 (açık kaynak hakaret sözlükleri + ekip eklemeleri), `sexual.{tr,en}` ≥ 40'ar, `realpersons.{tr,en}.generated` ≥ 5.000'er.

#### 2.2.6 Regex desenleri (ek olarak)

| # | Desen (TR / EN) | Kural | Not |
|---|---|---|---|
| R1 | `(?i)\b(cumhurbaşkan|başbakan|bakan|vali|sayın)\p{Zs}+\p{Lu}\p{L}+` / `\b(President|Senator|Governor|Secretary)\s+[A-Z][a-z]+` | RL-01 | unvan + özel ad |
| R2 | `\b[A-ZÇĞİÖŞÜ][a-zçğıöşü]+(lı|li|lu|lü)lar\b` | RL-28 | demonym; `geo-neutral` etiketli + yüklemsiz ise warn |
| R3 | `(?i)\b(bütün|tüm|hepsi|her|hiçbir)\b.{0,24}\b(memur|polis|asker|hâkim|savcı|doktor|öğretmen|siyasetçi|avukat|gazeteci)\w*` | RL-16 ön-filtre | §2.2.7'ye besler |
| R4 | `(?i)\b(all|every|no)\s+(cops|police|politicians|soldiers|judges|lawyers|doctors|teachers|bureaucrats|government)\b` | RL-16 ön-filtre | — |
| R5 | `(?i)\bbu ülke(de|nin|ye)?\b` / `\bthis country\b` | RL-16 | her zaman block; "bu şehirde/this town" önerilir |
| R6 | `(?i)\b(bahis|bahse)\b` / `\bbet(s|ting)?\b` | RL-12 | yalnızca `scope: coach|push|store`; "wager/odds/iddia" serbest |
| R7 | `İddaa` (case-sensitive) | RL-11 | "iddia" ile karışmaz |
| R8 | `[₺$€£]|\b(TL|USD|EUR|GBP)\b|\b\d+([.,]\d+)?\s*(lira|dolar|euro|dollars?|bucks|pounds?)\b` | RL-17 | sayı + birim |
| R9 | `%\s?\d{1,3}.{0,20}\b(enflasyon|faiz|zam|kur|asgari)` / `\b\d{1,3}\s?(percent|%).{0,20}\b(inflation|interest|minimum wage)` | RL-18 | makro yüzde |
| R10 | `\p{Extended_Pictographic}` | TN-03 | koç metni |
| R11 | `!` | TN-04 | koç; `rarity:rare` muaf |
| R12 | `(?i)\b(yap|git|ara|başla|bırak)\b.{0,12}\b(gerçek|hemen şimdi|bugün gerçekten)` | RL-29 | gerçek dünya eylemi |
| R13 | `\{name\}'[a-zçğıöşü]` / `\b(a|an)\s+\{` | SC-07 (09) | elle ek / artikel |
| R14 | `(?i)\b(sakat\w*)\b` yalnızca `tags ∋ askerlik` | RL-15 | — |
| R15 | `(?i)\b(yukarı(da|dakiler)?|upstairs|above)\b` yalnızca `persona:kader` | RL-30 | — |
| R16 | `(?i)\bşu an(da)?\s+\d+\s+(kişi|oyuncu)` / `\b\d+\s+(people|players)\s+(playing|online)\s+now` | ST-07 | sahte sayaç |
| R17 | `(?i)\b(son\s+\d+|son şans|sadece bugün|kaçırma)\b` / `\b(last chance|only \d+ left|today only|don't miss)\b` | ST-02 / §2.7 | sahte aciliyet; gerçek takvim olayı `calendar:true` ile muaf (RV-03) |
| R18 | `(?i)\b(doğum günün|your birthday)\b` | RL-22 | v1'de gerçek doğum günü yok |
| R19 | `(?i)\b(depresyon|depression)\b` yalnızca `scope: coach` | RL-26 | koç teşhis koymaz |
| R20 | `(?i)\b(bribe|rusvet|rüşvet)\w*` tüm dosya türlerinde (`.ts`, `.json`, `.md`) | RL-13 | kod kapsamı |

#### 2.2.7 "Kurum genellemesi" dedektörü (`RL-16`)

**Amaç:** "bütün memurlar tembeldir", "polisler hep rüşvetçi", "bu ülkede adalet yok", "all politicians lie" biçimindeki, tekil kurgusal karakter yerine **kurumu veya kitleyi** yargılayan cümleleri yakalamak (TCK 301/216; T9 §5c-4, -12). v1 kural tabanlıdır; v2 (1.0) küçük bir sınıflandırıcı ekler ama yalnızca `warn` üretebilir — `block` her zaman kural tabanlı ve açıklanabilir kalır.

**Heuristik puanlama (cümle başına):**

| Sinyal | Puan | TR sözlüğü | EN sözlüğü |
|---|---|---|---|
| Niceleyici | +2 | bütün, tüm, hepsi, her, hiçbir, hiç bir, herkes, kimse (olumsuz yüklemle) | all, every, each, no, none, nobody, everyone, always, never, typical |
| Kurum/kitle ismi (çoğul veya genel) | +2 | memur(lar), polis(ler), asker(ler), hâkim(ler), savcı(lar), doktor(lar), öğretmen(ler), siyasetçi(ler), avukat(lar), gazeteci(ler), patron(lar), kadın(lar), erkek(ler), genç(ler), yaşlı(lar), devlet, hükümet, yargı, ordu, emniyet, belediye, bu ülke, bu millet, millet | cops, police, politicians, soldiers, judges, lawyers, doctors, teachers, bureaucrats, bosses, women, men, boomers, millennials, Gen Z, the government, the system (warn), the state, the courts, this country, this nation |
| Olumsuz yüklem/sıfat | +2 | rüşvetçi, tembel, hırsız, yalancı, aptal, beceriksiz, çürümüş, satılmış, hain, ahlaksız, cahil, işe yaramaz, dolandırıcı, kokuşmuş, hep aynı | corrupt, lazy, crooked, liars, lie, stupid, useless, rotten, sold out, incompetent, idiots, scum, the same, broken |
| Genel-geçer kip (geniş zaman/kopula, özne çoğul) | +1 | `-dır/-dir`, `-ler/-lar` özne + geniş zaman | `are`, `is` + generic plural subject |
| Tekil kurgusal belirleyici (**negatif**) | −3 | bir, şu, bu (tekil isimle), "memur bey", "patronun", özel ad, "senin" | a, an, this one, your boss, the clerk, a judge, named NPC |
| Hedef alanı `target: situation|npc` ve NPC adı cümlede | −2 | — | — |

**Karar:** skor ≥ 5 → `block`; 3–4 → `warn` (incelemeci muafiyeti verebilir, 180 gün); R5 ("bu ülke(de)" / "this country") skor bağımsız `block`.

```ts
export function institutionGeneralization(sentence: string, locale: Locale, unit: ContentUnit): LintFinding | null {
  const t = tokenize(normalize(sentence, locale));            // §2.2.3
  const lex = LEX[locale];
  let score = 0; const hits: string[] = [];
  if (hasAny(t, lex.quantifier))      { score += 2; hits.push('quantifier'); }
  if (hasAny(t, lex.institution))     { score += 2; hits.push('institution'); }
  if (hasAny(t, lex.negativePredicate)){ score += 2; hits.push('negative'); }
  if (genericMood(t, locale))         { score += 1; hits.push('generic'); }
  if (hasAny(t, lex.singularMarker) || mentionsNamedNpc(t, unit)) score -= 3;
  if (unit.target === 'npc' || unit.target === 'situation') score -= 2;
  if (lex.alwaysBlock.some(re => re.test(sentence))) score = 99;   // "bu ülkede" / "this country"
  if (score >= 5) return finding('RL-16', 'block', unit, sentence, `genelleme skoru ${score}: ${hits.join('+')}`, 'Tekil kurgusal karaktere indir: "memur bey formu kaybetti"');
  if (score >= 3) return finding('RL-16', 'warn',  unit, sentence, `olası genelleme (${score})`);
  return null;
}
```

**Adversarial test seti:** `content-lint/test/generalization.{tr,en}.jsonl` — 200 el yazımı cümle (100 pozitif, 100 negatif; negatifler arasında "Memur bey formu üçüncü kez kaybetti", "Patronun 'bir dakika' dedi", "The clerk lost everyone's form"). Kabul: recall ≥ %95, precision ≥ %80 (AC-08-09). 1.0'da 500'e çıkar.

#### 2.2.8 İsim üreteci blocklist'i (`NG-*`, D-035)

**Üretim modeli:** `first ∈ commonFirst[locale]` (TR: TÜİK sık adlar, cinsiyetsizler öncelikli; EN: SSA listeleri) × `last ∈ compoundLast[locale]` (TR "Ertelemez, Kirayetişemeyen, Sonrabakar"; EN "Tomorrow, Overdraft, Snoozebutton"). Bileşik soyadı gerçek soyadı olmadığı için gerçek-kişi çakışması yapısal olarak düşer; yine de dört kontrol koşar.

```ts
export function isAllowedName(n: { first: string; last: string }, locale: Locale, L: Blocklists): NameVerdict {
  const full = fold(`${n.first} ${n.last}`), f = fold(n.first), l = fold(n.last);
  if (L.iconicFull.has(full))               return deny('NG-01', 'ikonik kurgusal tam ad');       // "Polat Alemdar", "Walter White"
  if (L.iconicSingle.has(f) || L.iconicSingle.has(l)) return deny('NG-02', 'tek başına ikonik'); // "Şaban", "Hermione", "Gandalf"
  if (L.realPersons.has(full))              return deny('NG-03', 'gerçek kişi');                   // üretilmiş liste
  if (L.slurs.hasToken(f) || L.slurs.hasToken(l) || L.profanity.hasSubstring(full)) return deny('NG-04', 'hakaret/küfür');
  if (L.brands.has(f) || L.brands.has(l))  return deny('NG-06', 'marka');                          // "Mavi", "Pınar" soyadı olarak serbest değil
  return allow();
}
```

- **İkonik tam ad seed'i (TR, 24):** Polat Alemdar, Memati Baş, Behzat Ç., Ezel Bayraktar, Recep İvedik, Hababam Sınıfı adları (Güdük Necmi, İnek Şaban, Damat Ferit), Avni (Hababam müdür yardımcısı), Leyla ile Mecnun ikilisi (tek token: Mecnun), Yavuz Topal, Tosun Paşa, Kemal Sunal rol adları (Şaban, Şabaniye), Kezban, Hürrem Sultan, Muhteşem Süleyman, Çakır (Kurtlar Vadisi), Aslan Bey, Yaman Koper, Fatmagül, Behlül, Bihter, Kuzey Tekinoğlu, Gülseren, Nihat Hatipoğlu (gerçek → realpersons'a). **Tek-token ikonik (TR):** Şaban, Mecnun, Hürrem, Memati, Polat, Çakır, Ezel, Behlül, Bihter, Kezban, Tosun.
- **İkonik tam ad seed'i (EN, 36):** Homer Simpson, Bart Simpson, Peter Griffin, Walter White, Jesse Pinkman, Tony Soprano, Don Draper, Michael Scott, Dwight Schrute, Ted Lasso, Coach Carter, Rocky Balboa, Forrest Gump, Harry Potter, Hermione Granger, Ron Weasley, Luke Skywalker, Darth Vader, Jack Sparrow, James Bond, Indiana Jones, Hannibal Lecter, Freddy Krueger, Tyler Durden, Patrick Bateman, Jon Snow, Tyrion Lannister, Daenerys Targaryen, Joey Tribbiani, Chandler Bing, Ross Geller, Rachel Green, Monica Geller, Sheldon Cooper, Leslie Knope, Ron Swanson. **Tek-token ikonik (EN):** Hermione, Daenerys, Khaleesi, Gandalf, Frodo, Voldemort, Dumbledore, Chewbacca, Yoda, Lasso, Rambo, Shrek, Simba, Elsa (Frozen çağrışımı warn → tek başına serbest değil).
- **Çalışma zamanı (NG-05):** v1'de serbest metin ad girişi **yok** (FTUE: [Karıştır] [Bu olsun]); 07 bir "yeniden adlandır" alanı eklerse aynı listelerin sıkıştırılmış kopyası pakete gömülür ve koç tek satırla reddeder: TR *"Bu ismi kabul etmiyorum. Dosyaya 'Deniz' yazdım."* · EN *"Not taking that name. I wrote down 'Alex.'"*
- **Tanıdık Yüzler sabit adları** (Barış/Jordan, Nevin Hanım/Ms. Carver, Yağmur/Sam, Şükran Teyze/Mrs. Dale, Pamuk/Biscuit) listeye karşı Sprint 0'da bir kez doğrulanır ve `names.lock`'a yazılır.
