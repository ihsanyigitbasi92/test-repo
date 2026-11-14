# 08 — İçerik Kuralları, Hukuk ve Linter Spesifikasyonu

> **Belge türü:** Ayrıntılı tasarım dokümanı (00 §5 satır 08). Bu belge 00-VİZYON'daki D-kararlarını **uygular**, tartışmaz; 00 §1.2 ASLA listesi ve T9'un ASLA/DİKKATLİ listeleri burada satır satır kurala, kural da `content-lint` koduna döner.
> **Durum:** v1.1 · 2026-11-06 · Sahip: İçerik güvenliği + hukuk uyum tasarımcısı · Üst belgeler: 00 > T9 > T3/T10/T6 > A1–A4.
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
| **D-061** | Zaman birimi GÜN; her gösterilen günde bir olay; atlanan günler tek satır özet; kart tarihli | `scope: 'skip'` (gün özeti satırları da lint'ten geçer, §3.3); `RL-31` hassas takvim günleri (D-ÖNERİ-08-19): o günlerde nötr havuz, koç/NPC tarih yorumlamaz. |
| **D-062** | NPC diyalog balonları, oyuncu cevap balonları ("Sen: …"), NPC ses kuralları; koç ayrı katman | §2.2.13 `DL-01..10` (NPC'nin asla söylemediği + ses imzası şema kontrolü); `speaker` enum; `RL-*` kataloğu `npc` kapsamında aynen; `TN-12` cevap balonu hedefi (D-ÖNERİ-08-17). |
| **D-063** | Juice/şov standardı: damga çarpması, EFSANE OLAY, ANNE ARIYOR baskını, Teşhis etiketi çarpması, ölümde EKG | Teşhis etiketleri `kind: 'diagnosis'` Tier A ve `RL-26/27`; ANNE ARIYOR içeriği `DL-03`; lowKeyif protokolünde juice tetikleri kapalı (§2.5); ölüm akışında reklam yok (§2.7). |
| **D-064** | Roast dozu ↑: Normal'de olay sonucu başına ≥ 1 roast; seçenek etiketleri sert ama karara; T9 çizgileri aynen | `QT-12` harness kotası (≥ 1 roast/olay, lowKeyif ve sessizlik hariç); `TN-12` seçenek/cevap balonu hedefi `character\|situation`; Acımasız havuzu aynı kurallardan geçer (D-ÖNERİ-08-18). |

**İkincil olarak uygulanan kararlar:** D-004 (Kader havuzu için `RL-23`, `RL-30`, `RL-16`; mağaza/ilk 60 sn görünmezliği `ST-06`), D-012 (03:12 satırı `RL-22` istisnası: hedef koç), D-024 (kalıp adları klinik terim listesiyle çakışmaz: `RL-26` kalıp taksonomisine de koşar), D-026 (lint "Acımasız" havuzunu da tarar; kademeye göre muafiyet yok), D-027 (`TN-01/02/06`), D-033/D-034 (`RL-17/18`), D-040/D-055 (§2.7 karanlık tasarım listesi), D-045 (lint girdisi olay başına tek JSON), D-046 (`SC-*` 09'dan devralınır), D-053 ("motivasyon" `ST-02`), D-054 (§2.4 KVKK belgeleri + UMP/ATT akışı), D-019 ("hayali/fictional" etiketi `ST-07`), D-044 (10.000 hayat harness'ına kota ve protokol testleri eklenir).

### 0.2 Bağımlı dokümanlar

- **Yukarı akış:** 00 (bağlayıcı), T9 (hukuk; madde atıfları buradan), T3 (ton ve kırmızı çizgi listesi §4.5), T10 (CI lint §3.6 ve pipeline), T6 TL;DR (mağaza/reklam uyumu), T4 (şema: `valence`, `target`, `tension`).
- **Aşağı akış (bu belgeyi tüketenler):** 01 ton kitabı (`TN-*` kurallarının yazar yüzü), 03 olay motoru (şema alanları `target`, `substance`, `effects`; harness kancaları), 06 monetizasyon (§2.7 listesi birebir UI kuralı), 07 UX (yaş ekranı, yardım ekranı, lisans ekranı, rıza akışı ekranları), 09 i18n pipeline (`content-lint` paketinin ev sahibi; `SC-*` oradan), 10 teknik mimari (CI entegrasyonu, SARIF), 11 KPI (§6 metrikleri).
- **Sahiplik sınırı:** `SC-*` (şema/i18n) kuralları **09**'un malıdır, burada yalnızca referanslanır. `RL-`, `TN-`, `QT-`, `NG-`, `ST-`, `RV-` kuralları **bu belgenin** malıdır.

### 0.3 Sürüm

v1.0 (2026-11-06): ilk sürüm (§0–§2.2.8).
v1.1 (2026-11-06): §2.2.9–§2.2.13 (modlar, kotalar `QT-01..12`, muafiyet, release imzası, NPC diyalog kuralları `DL-*` / D-062), §2.3–§2.8, §3–§7 eklendi; 00 §12 (D-061..D-065) uygulandı; `RL-31`, `TN-12`, `ST-08..10` kataloğa girdi. Değişiklik yalnızca yeni `D-ÖNERİ-08-xx` kaydı veya 00'da yeni D-kaydı ile.

---

## 1. Amaç ve kapsam — MVP / Soft launch / 1.0

**Amaç:** Oyunun iki dildeki her satırının, mağaza sayfasının, reklam kreatifinin ve hukuki belgesinin **"savunulabilir" değil "şikâyet edilemez"** olmasını mühendislikle garanti etmek (00 S5). Üç katman: (1) yazarın elindeki kural kitabı (§2.1), (2) CI'da koşan deterministik linter (§2.2), (3) insan inceleme + hukuk kapıları (§2.3–§2.8).

| Kapsam | MVP (dikey kesit, 10 hafta) | Soft launch (TR + CA/NZ) | 1.0 (global) |
|---|---|---|---|
| Kural kitabı §2.1 | 22 kategori tam; yazar brief'ine gömülü | aynı + Kader havuzu için ek okuma | aynı + Sezon Paketi içerik şablonu |
| Linter | `RL-*`, `TN-*`, `SC-*` (09), `RV-*`; blocklist seed TR/EN ≥ 150; genelleme dedektörü v1 (kural tabanlı) | + `QT-*` kotalar pool ve harness düzeyinde; `NG-*`; `ST-*` store-lint; SARIF çıktısı | + adversarial test seti 200 → 500 cümle; dedektör v2 (kural + küçük sınıflandırıcı, yalnızca `warn` üretir) |
| NPC diyalog kuralları §2.2.13 (D-062) | `DL-01..10` + `speaker` enum; 8 Tanıdık Yüz + 5 durumsal rol | + 12 durumsal rol; ses imzası şema kontrolü | + Kader havuzu NPC'leri (Müdürlük personeli) |
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
- **Girdi:** `content/events/**/*.json` (olay başına tek JSON, D-045; içindeki `dialog[]` balonları `scope: 'npc'`, `choices[]` etiketleri `scope: 'choice'`), `content/skips/{tr,en}.json` (gün atlama özetleri, `scope: 'skip'`, D-061), `content/coach/**/*.json` (koç satırları), `content/motto/`, `content/glossary/`, `content/push/`, `content/names/{tr,en}.json`, `store/{tr,en}/*.md`, `creatives/manifest.json`, `docs/**/*.md` (`docs` kapsamı; yalnızca `RL-01/02/04/05/08/13` ve soyutlama kontrolü).
- **Çalışma modları:** `pnpm lint:content` (PR; `--changed-only`), `pnpm lint:content --release` (`needs-review` ve `reviewedRev<rev` BLOK'a döner; kotalar pool düzeyinde zorunlu), `pnpm lint:content --harness` (10.000 hayat çıktısı üzerinde `QT-*` ve `TN-07/10` sekans kuralları), pre-commit (yalnızca `RL-*` hızlı yol, < 2 sn).
- **Boru hattı:** `load → normalize → unitRules → poolRules (QT, NG) → harnessRules (opsiyonel) → exemptions → report (json | sarif | console)`.
- **Hız bütçesi:** 5.000 birim × 2 locale ≤ 20 sn CI'da (regex ön-derleme, Aho-Corasick benzeri çoklu-desen eşleme için basit trie).

#### 2.2.2 Tipler

```ts
export type Locale = 'tr' | 'en';
export type Severity = 'block' | 'warn' | 'info';
export type Scope = 'coach' | 'event' | 'npc' | 'choice' | 'ui' | 'push' | 'store' | 'creative' | 'name' | 'glossary' | 'docs' | 'code' | 'skip' | 'legal' | 'config';
// 'npc' = olay JSON'undaki dialog[] balonları (D-062); 'choice' = oyuncu cevap balonları; 'skip' = gün atlama özetleri (D-061)
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
| **RL-01** | block | all | hayır | Gerçek kişi: üretilmiş liste (≥ 5.000 ad; TR siyasetçi/ünlü/iş insanı/sporcu/influencer, EN küresel ünlüler) + unvan deseni (`(Cumhurbaşkanı\|Başbakan\|Bakan\|Vali\|Sayın\|President\|Senator\|Governor) + Büyük harfli token`) | TCK 125/299, 5816, TMK 24, Apple 1.1.1 |
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
| **RL-21** | block | event | hayır | Şema: `romance\|dating\|sex` etiketli olayda NPC `age < 18` veya yaş alanı boş | TCK 226/3, D-037 |
| **RL-22** | block | coach, push, npc | D-012 satırı için sabit istisna | Oyuncunun gerçek hayatı: "işsizsin/yalnızsın/konumun/telefonun/gerçek hayatta sen/doğum günün"; gerçek-saat satırında `target !== 'coach'` | Apple 1.1, D-050 |
| **RL-23** | block | all | hayır | Ahiret sözlüğü (melek, Azrail, kıyamet, ahiret, karma, reenkarnasyon, cennet/cehennem, heaven/hell/afterlife) | 00 §1.2, D-004 |
| **RL-24** | block | store, creative | hayır | Metadata yasak sözcükleri: motivasyon/wellness/alışkanlık/terapi/meditasyon + EN karşılıkları | D-053, Apple 1.4.5 kayması |
| **RL-25** | block | store, creative | hayır | Rakip adları (BitLife, InstLife, AltLife, Bitizen, Candywriter) ve "X'ten iyi" karşılaştırması | Apple 2.3.7, Yönetmelik m.8 |
| **RL-26** | block | all | hayır | Ruhsal/zihinsel/fiziksel durum etiketleri kişiye yöneltilmiş (`sen + etiket`, `etiket + misin`), teşhis olarak koç ağzında "depresyon"; kalıp taksonomisi klinik terim içeremez | Apple 1.1.1, D-024 |
| **RL-27** | block | all | hayır | Beden sözlüğü (kilo/boy/ten/yüz) + 2. tekil veya NPC hedef | Apple 1.1.1 |
| **RL-28** | block | all | hayır | Demonym genellemesi: `\b\p{Lu}\w+(lı\|li\|lu\|lü)lar\b` / `people from X` + yüklem; bölge etiketleri; "Türkiye/Türk/America/American" oyun metninde | TCK 216/2, D-ÖNERİ-08-05 |
| **RL-29** | block | coach, push | hayır | Gerçek dünya eylemine itme: "gerçekten yap / şimdi git … / challenge / dare" (Saha Çalışması yok, D-006) | Apple 1.4.5 |
| **RL-30** | block | coach (persona `kader`) | hayır | "yukarı(da)/yukarıdakiler/upstairs/above/the man upstairs" + Müdürlük bağlamı | D-004 |
| **RL-31** | block | event, coach, npc, skip | hayır | Hassas takvim günleri (TR: 6 Şubat, 17 Ağustos, 10 Kasım, 15 Temmuz, 19 Mayıs, 23 Nisan, 29 Ekim, 30 Ağustos; EN: 11 Eylül, 4 Temmuz, 25 Aralık…): o tarihe düşen seed olay nötr havuzdan; metinde ay+gün tarih göndermesi yok | D-061, D-065, K6/K19, D-ÖNERİ-08-19 |
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
| **TN-12** | block | choice | hayır | Cevap balonu / seçenek etiketi roast hedefi `character\|situation`; kimlik/beden/köken sözlüğü ile 2. tekil → block (D-064 "sert ama karara") | D-064, D-ÖNERİ-08-18 |
| **SC-01..13** | 09'un tanımı | event, coach | 09'a göre | Eksik locale, ICU parse, placeholder eşitliği (`gender` hariç), `other` dalı, uzunluk oranı 0,7–1,3, buton bütçesi TR 18 / EN 16, elle yazılmış ek, `intent`+`universality`, `valence/mood/type` enum, `wager` oran placeholder'ı, `document` çift `translate` + Sözlük anahtarı, `pattern` enum (12), swap tablosu | D-046, D-047 |
| **QT-01..12** | block (release) / warn (pr) | pool, harness | hayır | §2.2.10 kotaları (QT-11 lowKeyif roast = 0; QT-12 Normal'de olay başına ≥ 1 roast, D-064) | D-037, D-052, D-064 |
| **NG-01..05** | block | name | hayır | §2.2.8 isim üreteci | D-035 |
| **DL-01..10** | block (DL-10 warn) | npc, choice | DL-10 evet | §2.2.13 NPC diyalog kuralları: gerçek kişi/marka/din/siyaset NPC'de de yok; şive yazımı yok; Anne sevilir; 4. duvar/koçla konuşma yok; NPC balonunda küfür (sansürlü dahi) yok; Doktor/İK/kurye teşhis-marka yok; `speaker` enum; ses imzası bütçeleri | D-062, D-ÖNERİ-08-17 |
| **ST-01** | block | store | hayır | Ekran görüntüsü/önizleme metni yalnızca `showcase:true` birimlerden (manifest eşleşmesi) | Apple 2.3.8 |
| **ST-02** | block | store, creative, brand | hayır | D-049 adları ve `RL-24/25` sözcükleri; "ücretsiz!/bedava/#1/en iyi" iddiaları veri yoksa | D-049, D-053, Yönetmelik m.7 |
| **ST-03** | block | store | hayır | Apple ad 30 / alt başlık 30 / keyword 100 byte; Play 30/80 | T10 §5 |
| **ST-04** | block | showcase | hayır | `showcase:true` birimde `death\|alcohol\|tobacco\|illness\|crime\|profanity\|lowKeyif` etiketi veya sözlüğü | Apple 2.3.8, D-037 |
| **ST-05** | block (manuel kutu) | creative | hayır | Kreatif manifestinde `realGameplay:true`, `aiTestimonial:false`, `influencerAdLabel:true` zorunlu | Yönetmelik m.7 + 2026 değişikliği |
| **ST-06** | block | store, creative, ftue | hayır | Kader kişiliği satırı/görseli mağazada, kreatifte veya ilk 60 sn akışında | D-004 |
| **ST-07** | block | ui, store | hayır | Kamp kıyas kartı ve kohort metinlerinde "hayali/fictional" etiketi eksik; "şu an X kişi" sahte sayaç deseni | D-019, D-055 |
| **ST-08** | block | ui | hayır | KVKK aydınlatma + açık rıza aynı ekranda tek buton; rıza toggle'ı varsayılan açık; "Reddet" düğmesi "Kabul"den küçük | Kurul 2026/347, D-054 |
| **ST-09** | block (release) | config | hayır | AdMob/mediation `maxAdContentRating ≠ T`, `tagForChildDirectedTreatment ≠ false`, `tagForUnderAgeOfConsent ≠ false` (`app.json`/manifest okunur) | D-037, T9 §6 |
| **ST-10** | block (release) | store, legal | hayır | Gizlilik/Aydınlatma/Rıza/Koşullar/Lisanslar linkleri HEAD 200 değil veya sürüm/tarih damgası eksik | Apple 5.1.1, Play User Data |
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
| `politics.txt` (RL-03) | block | AKP, AK Parti, CHP, MHP, İYİ Parti, HDP, DEM Parti, Zafer Partisi, Yeniden Refah, Saadet Partisi, DEVA, Gelecek Partisi, TİP, seçim~, sandık (siyasi bağlam), oy ver~, parti (siyasi bağlam; "doğum günü partisi" istisna: `parti` + `doğum\|düğün\|ev` → serbest), iktidar, muhalefet, sağcı, solcu, sağ/sol (siyasi yüklemle), Kemalist, Atatürkçü, İslamcı, laik~, laiklik, milliyetçi, ülkücü, komünist, faşist, darbe, 15 Temmuz, 28 Şubat, 12 Eylül, Gezi, 6-7 Eylül — **36** |
| `religion.txt` (RL-04, RL-23) | block (NPC ünlemleri warn) | Allah~, Tanrı~, Rab, peygamber~, Hz., Muhammed, İsa, Musa, Kur'an, Kuran, İncil, Tevrat, ayet, sure (dinî), hadis, cami~, kilise~, havra, sinagog, namaz, abdest, oruç, Ramazan, Kurban Bayramı, iftar, sahur, teravih, ezan, imam, müezzin, hoca (dinî bağlam; "hoca" öğretmen anlamı: `okul\|ders\|sınav` ile serbest), papaz, haham, Alevi, Sünni, Şii, Hristiyan, Yahudi, Müslüman, ateist, deist, cennet, cehennem, günah~, sevap, helal, haram, melek~, Azrail, kıyamet, ahiret, mahşer, reenkarnasyon, karma, yukarıdakiler, nazar, nazar boncuğu, muska, cin (varlık), büyü, şeytan, iblis, dua~, amin, inşallah (warn/NPC), maşallah (warn/NPC), vallahi (warn/NPC), hacı, hac, umre, zekât, fitre, alın yazısı (warn), kısmet (warn), nasip (warn) — **66** |
| `protected.txt` (RL-05, RL-28) | block (punchline bağlamı) | Kürt~, Ermeni~, Rum~, Arap~, Suriyeli~, Afgan~, mülteci~, göçmen~, sığınmacı~, Roman~, Çingene~, Laz~, Çerkez~, Gürcü~, Boşnak~, Zaza~, Karadenizli~, Doğulu~, Güneydoğulu~, Egeli~, eşcinsel (warn), gey (warn), lezbiyen (warn), trans (warn), LGBT (warn), biseksüel (warn), `re: \b\p{Lu}\w+(lı\|li\|lu\|lü)lar\b` (demonym) — **27** |
| `ability_body.txt` (RL-26, RL-27) | block (kişiye yöneltilmiş) | engelli~, özürlü~, sakat (kişi: `sakat (adam\|kadın\|çocuk\|insan)\|sakatsın`), topal~, kör~ (kişi), sağır~ (kişi), kekeme~, cüce~, şişko~, şişman~, obez~, kilolu~, çirkin~, kel (warn), deli~ (etiket; "delirdim" abartısı serbest), manyak~, psikopat~, şizofren~, otistik~, down sendrom~, gerizekalı, geri zekâlı, aptal~ (2. tekil), salak~ (2. tekil), embesil, spastik~, depresif (etiket), bipolar, anoreksik~ — **29** |
| `substances.txt` (RL-09, RL-10) | block | esrar~, ot (madde bağlamı: `ot (iç\|çek\|sar)`), joint, bonzai, kokain~, eroin~, ekstazi, MDMA, LSD, asit (madde), metamfetamin, met (madde), uyuşturucu~, torbacı~, hap (warn; `baş ağrısı\|doktor` ile serbest), rakı~ (tag-gated), bira~ (tag-gated), şarap~ (tag-gated), votka, viski, tekila, likör, kadeh~ (tag-gated), sarhoş~ (tag-gated), Efes, Tuborg, Bomonti, Yeni Rakı, Tekirdağ Rakısı, Kavaklıdere, Doluca, Carlsberg, Heineken, Absolut, Smirnoff, Jack Daniel's, Johnnie Walker, Chivas, Jägermeister, Corona (içecek), Guinness, Bacardi, sigara~ (tag-gated), vape (tag-gated), elektronik sigara, nargile (tag-gated), tütün (tag-gated), Marlboro, Camel, Winston, Parliament, Kent (sigara bağlamı), Lark, Lucky Strike, Davidoff, Samsun (sigara bağlamı), Maltepe (sigara bağlamı), Tekel, Juul, IQOS, Vuse, Elf Bar, Puff — **62** |
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
| `protected.txt` (RL-05, RL-28) | block (punchline bağlamı) | Black (ırk), white (ırk bağlamı), Asian, Hispanic, Latino~, Mexican~, Indian~, Chinese, Arab~, immigrant~, illegal alien, refugee~, migrant~, gypsy, redneck~, hillbilly, trailer trash, white trash, ghetto, hood (yer), thug~, "those people", gay (warn), lesbian (warn), trans (warn), queer (warn), LGBT (warn), nonbinary (warn), `re: people from [A-Z]\w+ (are\|always\|never)` — **29** |
| `ability_body.txt` (RL-26, RL-27) | block (kişiye yöneltilmiş) | disabled (etiket), retard~, cripple~, midget, dwarf (kişi), blind (kişi), deaf (kişi), autistic, bipolar, schizo~, psycho~, crazy (etiket; "this is crazy" serbest), insane (etiket), lunatic, nuts (kişi), fat~ (kişi), obese, ugly, anorexic, loser (2. tekil), lazy (2. tekil, gerçek hayat) — **21** |
| `substances.txt` (RL-09, RL-10) | block | weed, pot (madde), marijuana, cannabis, joint, blunt, bong, edible~ (madde), dab, coke (madde), cocaine, crack (madde), heroin, meth, molly, ecstasy, MDMA, acid (madde), LSD, shrooms, mushrooms (warn), Xanax, Adderall, oxy, fentanyl, Percocet, Vicodin, ketamine, "a line", "a hit", "a bump", dealer (madde), plug (argo), drugs, drunk (tag-gated), wasted (tag-gated), hammered (tag-gated), shots (tag-gated), beer (tag-gated), wine (tag-gated), vodka, whiskey, tequila, gin, rum, Budweiser, Bud Light, Coors, Miller, Heineken, Corona (içecek), Guinness, Jack Daniel's, Jim Beam, Jameson, Johnnie Walker, Absolut, Grey Goose, Smirnoff, Bacardi, Captain Morgan, Jägermeister, Fireball, White Claw, Marlboro, Camel, Newport, Lucky Strike, Pall Mall, Juul, Vuse, Elf Bar, Puff Bar, Zyn, vape (tag-gated), cigarette~ (tag-gated) — **77** |
| `gambling.txt` (RL-11, RL-12) | block | bet (coach; "wager/odds" serbest), betting, bookie, parlay, sportsbook, DraftKings, FanDuel, Bet365, BetMGM, casino (tag-gated), slots, slot machine, roulette, poker, blackjack, craps, Vegas (warn), Powerball, Mega Millions, jackpot (warn), "double or nothing" — **21** |
| `bribe.txt` (RL-13) | block | bribe~, bribery, kickback~, payoff (rüşvet bağlamı), "under the table", "grease * palm", "pay off the ref", match-fixing — **8** |
| `military.txt` (RL-14) | block | desert~ (asker), deserter, AWOL, "dodge the draft", draft dodger, "fake an injury" (askerî), "go AWOL" — **7** |
| `disaster.txt` (RL-07) | block | earthquake~, hurricane~, wildfire~, tsunami, pandemic, COVID~, coronavirus, lockdown, quarantine, 9/11, terrorist~, terrorism, bombing, mass shooting, school shooting, war (gerçek), Gaza, Ukraine, Israel, Palestine, Russia, Katrina, Sandy Hook, Columbine, Uvalde, Parkland — **26** |
| `selfharm.txt` (RL-08) | block | suicide, suicidal, `re: kill (myself\|yourself\|himself\|herself\|themselves)`, "end it all", "end my life", self-harm, `re: cut(ting)? (myself\|yourself)`, overdose, OD, `re: hang (myself\|yourself)`, "jump off", "not worth living", "better off dead", anorexia, bulimia, purge (yeme), thinspo, pro-ana, "want to die", "wish I was dead", "I'd rather die" (deyim dahi) — **20** |
| `money.txt` (RL-17, RL-18) | block | dollar~, $, bucks, USD, euro~, pound~ (para), inflation, interest rate, the Fed, Federal Reserve, minimum wage, stock market (warn), S&P, Dow, Nasdaq, Bitcoin (warn; "crypto" serbest), Wall Street, recession, GDP, tariff~ — **20** |
| `tone.txt` (TN-01, TN-02, TN-08) | block | "you should", "you must", "you have to", "you need to", "you ought to", "get a grip", "pull yourself together", "snap out of it", "shame on you", "you're smart", "you're so smart", "you're talented", "you're amazing", "you're a genius", "believe in yourself", "you got this", "you've got this", "you can do it", bro, dude, bestie, sweetie, honey, buddy (warn), champ (harness ≤ 1/yıl) — **25** |
| `store.txt` (RL-24, RL-25, ST-02) | block (store/creative) | motivation~, motivational, wellness, habit~, therapy, therapist, "mental health", self-care, mindfulness, meditation, BitLife, InstLife, AltLife, Bitizen, Candywriter, Coach (ad), Terminal (ad), Last Stop, Get a Grip, Next! (ad), "#1", "best" (veri yoksa) — **22** |
| `reallife.txt` (RL-22, RL-29) | block (coach/push) | "you're unemployed", "you're single", "you're alone", "in real life you", "your real", "your phone", "your location", "where you are right now", "it's late where you are", "your birthday", "actually do it", "go do it right now", challenge (gerçek dünya), dare — **14** |
| `brands.txt` (RL-06) | block | Netflix, Spotify, Instagram, TikTok, Facebook, Twitter, WhatsApp, LinkedIn, Tinder, Bumble, Hinge, Uber, Lyft, DoorDash, Amazon, Apple (şirket), iPhone, Google, Samsung, Tesla, Starbucks, McDonald's, Walmart, Target (mağaza), Costco, IKEA, Zara, H&M, Nike, Adidas, Chase, Wells Fargo, Bank of America, Visa, Mastercard, PayPal, Venmo, Zelle, Robinhood, Coinbase, Delta, United (havayolu), American Airlines, Marriott, Hilton, Airbnb, Disney, Marvel, Pokémon, Nintendo, PlayStation, Xbox, Fortnite, Roblox, Minecraft, Zoom, Slack, Microsoft, Teams, Excel (→ "spreadsheet"), Outlook, Gmail, Yahoo — **63** |

**Private listeler (sayı hedefi):** `slurs.tr` ≥ 60, `slurs.en` ≥ 120 (açık kaynak hakaret sözlükleri + ekip eklemeleri), `sexual.{tr,en}` ≥ 40'ar, `realpersons.{tr,en}.generated` ≥ 5.000'er.

#### 2.2.6 Regex desenleri (ek olarak)

| # | Desen (TR / EN) | Kural | Not |
|---|---|---|---|
| R1 | `(?i)\b(cumhurbaşkan\|başbakan\|bakan\|vali\|sayın)\p{Zs}+\p{Lu}\p{L}+` / `\b(President\|Senator\|Governor\|Secretary)\s+[A-Z][a-z]+` | RL-01 | unvan + özel ad |
| R2 | `\b[A-ZÇĞİÖŞÜ][a-zçğıöşü]+(lı\|li\|lu\|lü)lar\b` | RL-28 | demonym; `geo-neutral` etiketli + yüklemsiz ise warn |
| R3 | `(?i)\b(bütün\|tüm\|hepsi\|her\|hiçbir)\b.{0,24}\b(memur\|polis\|asker\|hâkim\|savcı\|doktor\|öğretmen\|siyasetçi\|avukat\|gazeteci)\w*` | RL-16 ön-filtre | §2.2.7'ye besler |
| R4 | `(?i)\b(all\|every\|no)\s+(cops\|police\|politicians\|soldiers\|judges\|lawyers\|doctors\|teachers\|bureaucrats\|government)\b` | RL-16 ön-filtre | — |
| R5 | `(?i)\bbu ülke(de\|nin\|ye)?\b` / `\bthis country\b` | RL-16 | her zaman block; "bu şehirde/this town" önerilir |
| R6 | `(?i)\b(bahis\|bahse)\b` / `\bbet(s\|ting)?\b` | RL-12 | yalnızca `scope: coach\|push\|store`; "wager/odds/iddia" serbest |
| R7 | `İddaa` (case-sensitive) | RL-11 | "iddia" ile karışmaz |
| R8 | `[₺$€£]\|\b(TL\|USD\|EUR\|GBP)\b\|\b\d+([.,]\d+)?\s*(lira\|dolar\|euro\|dollars?\|bucks\|pounds?)\b` | RL-17 | sayı + birim |
| R9 | `%\s?\d{1,3}.{0,20}\b(enflasyon\|faiz\|zam\|kur\|asgari)` / `\b\d{1,3}\s?(percent\|%).{0,20}\b(inflation\|interest\|minimum wage)` | RL-18 | makro yüzde |
| R10 | `\p{Extended_Pictographic}` | TN-03 | koç metni |
| R11 | `!` | TN-04 | koç; `rarity:rare` muaf |
| R12 | `(?i)\b(yap\|git\|ara\|başla\|bırak)\b.{0,12}\b(gerçek\|hemen şimdi\|bugün gerçekten)` | RL-29 | gerçek dünya eylemi |
| R13 | `\{name\}'[a-zçğıöşü]` / `\b(a\|an)\s+\{` | SC-07 (09) | elle ek / artikel |
| R14 | `(?i)\b(sakat\w*)\b` yalnızca `tags ∋ askerlik` | RL-15 | — |
| R15 | `(?i)\b(yukarı(da\|dakiler)?\|upstairs\|above)\b` yalnızca `persona:kader` | RL-30 | — |
| R16 | `(?i)\bşu an(da)?\s+\d+\s+(kişi\|oyuncu)` / `\b\d+\s+(people\|players)\s+(playing\|online)\s+now` | ST-07 | sahte sayaç |
| R17 | `(?i)\b(son\s+\d+\|son şans\|sadece bugün\|kaçırma)\b` / `\b(last chance\|only \d+ left\|today only\|don't miss)\b` | ST-02 / §2.7 | sahte aciliyet; gerçek takvim olayı `calendar:true` ile muaf (RV-03) |
| R18 | `(?i)\b(doğum günün\|your birthday)\b` | RL-22 | v1'de gerçek doğum günü yok |
| R19 | `(?i)\b(depresyon\|depression)\b` yalnızca `scope: coach` | RL-26 | koç teşhis koymaz |
| R20 | `(?i)\b(bribe\|rusvet\|rüşvet)\w*` tüm dosya türlerinde (`.ts`, `.json`, `.md`) | RL-13 | kod kapsamı |

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
| Hedef alanı `target: situation\|npc` ve NPC adı cümlede | −2 | — | — |

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

#### 2.2.9 Çalışma modları, çıkış kodları ve rapor hedefleri

| Mod | Komut | Kapsam | Çıkış kodu |
|---|---|---|---|
| Pre-commit | `pnpm lint:content --fast` | Yalnızca değişen dosyalar, yalnızca `RL-*` + `TN-11` (küfür) + `RL-13` kod kapsamı; < 2 sn | `1` herhangi bir `block` |
| PR | `pnpm lint:content --changed-only` | Değişen birimler + bunların kota etkisi (`QT-*` `warn` düzeyinde) | `1` `block`; `0` `warn` (rapor PR yorumu olur) |
| Release | `pnpm lint:content --release` | Tüm havuz; `RV-*` aktif; `QT-*` `block`; SARIF + `lint-summary.json` üretir | `1` `block` **veya** imzasız `warn` (RV-06) |
| Harness | `pnpm lint:content --harness ./out/harness-10k.json` | 03'ün 10.000 hayat çıktısı; `QT-*`, `TN-07/10`, `QT-12` sekans kuralları, lowKeyif roast = 0 testi | `1` herhangi bir ihlal |
| Docs | `pnpm lint:content --docs` | `docs/**/*.md`; yalnızca `RL-01/02/04/05/08/13` + soyutlama kontrolü (yasak örnek `[köşeli parantez]` içinde değilse `block`) | `1` `block` |

Rapor hedefleri: `console` (renkli, TR/EN açıklama locale'e göre), `json` (`lint-report.json`, şema §6.1), `sarif` (GitHub Code Scanning'e yüklenir; her kural `rules[]`'da `legalBasis` ile). Deterministik sıralama: `unitId → path → ruleId`; aynı girdi aynı byte çıktı (snapshot testi).

#### 2.2.10 Kotalar (`QT-*`) — "seyrek"in sayıya çevrilmesi (D-037, D-ÖNERİ-08-01)

Kotalar iki düzeyde koşar: **pool** (havuzdaki birim sayısı/oranı; `--release`'te `block`) ve **harness** (10.000 hayatta gösterim oranı; D-044). Pool kotası havuz büyüklüğünden bağımsız **oran**dır; harness kotası **hayat başına** gösterimdir. Apple'ın "seyrek/sık" sınırı sayısal değildir (T9 açık soru 5); bu kotalar bizim beyanımızın savunulabilir iç tanımıdır ve her içerik paketinde yeniden ölçülür.

| ID | Kota | Pool eşiği | Harness eşiği (hayat başına medyan / p95) | Dayanak |
|---|---|---|---|---|
| **QT-01** | `substance:alcohol` etiketli olay | ≤ %4 olay havuzu | ≤ 3 / ≤ 6 gösterim | Apple 1.4.3 "seyrek 13+"; PEGI 16 |
| **QT-02** | `substance:tobacco` etiketli olay | ≤ %2 | ≤ 2 / ≤ 4 | 4207; PEGI |
| **QT-03** | `substance:drugs` (yalnızca maruz kalma; D-ÖNERİ-08-14) | ≤ %1 ve mutlak ≤ 8 olay/locale | ≤ 1 / ≤ 2 | TCK 190/2; Apple 1.4.3 |
| **QT-04** | `gambling:narrative` olay | ≤ %1,5 | ≤ 2 / ≤ 3 | TCK 228; Apple simüle kumar yok beyanı |
| **QT-05** | `crime` seçenekli olay (K11 listesi) | ≤ %5; her birinde `pCaught ≥ 0,35` ve `EV < 0` | ≤ 4 / ≤ 8 | Apple 1.1.3; T9 DİKKATLİ-Suç |
| **QT-06** | `romance\|dating\|sex` olay | ≤ %12; `fadeToBlack:true` %100 | — | TCK 226; Apple 1.1.4 |
| **QT-07** | `[sansür]/[redacted]` içeren olay/NPC satırı | ≤ 3/100 satır | ≤ 6 / ≤ 10 gösterim | 00 §1.2; IARC Language |
| **QT-08** | `substance:*` olayın `effects` vektöründe kalıcı negatif | %100 | %100 | Google T&A "statü artar iması yok" |
| **QT-09** | `gambling:narrative` olayın beklenen değeri | %100 `EV < 0` veya tuzak | %100 | T9 §5c-6 |
| **QT-10** | `death` etiketli satır/olay (ölüm nedeni metni ≤ 12 kelime, yöntem sözcüğü yok) | Ölüm nedeni listesi 02'nin onaylı listesiyle birebir; intihar sınıfı 0 | — | 02 §2.4.3; TCK 84/3 |
| **QT-11** | `lowKeyif` protokolü aktifken `isRoast` satır gösterimi | — | **0** (%100 hayat) | D-052 |
| **QT-12** | Normal ayarda olay sonucu başına `isRoast` satır (D-064) | — | ≥ 1 (%98 olay; istisna: sessizlik penceresi ve lowKeyif) | D-064 |

Kota aşımı `--release`'te `block`tur ve **muaf tutulamaz**; çözüm havuzdan birim çıkarmak ya da `substance` etiketini kaldırıp metni nötrleştirmektir (etiketsiz alkol sözlüğü `RL-10` ile yakalanır; iki kapı birbirini kilitler).

#### 2.2.11 Muafiyet mekanizması (`RV-03`, D-ÖNERİ-08-02)

- Yalnızca `exemptable: true` kurallar (katalogda "Muaf? evet"): `RL-04` (NPC ünlemi), `RL-05` (nötr kimlik), `RL-06` (jenerik sözcük çakışması), `RL-16` (`warn` düzeyi), `TN-04`, `R17` (`calendar:true`).
- Muafiyet birime gömülüdür (`lintExemptions[]`), ayrı dosyada değil; `git blame` ile izlenir. `author !== reviewer`; `reviewer` PR'ı onaylayan GitHub hesabı olmalı (CI `GITHUB_EVENT` ile doğrular). `expiresAt ≤ approvedAt + 180 gün`; süresi dolan muafiyet `block`a döner (içerik "sessizce" yasal durumunu kaybetmesin diye).
- Muafiyet metni `reason` alanında Türkçe ya da İngilizce **tam cümle** ve dayanak atfı içerir ("NPC Şükran Teyze'nin 'inşallah'ı; D-ÖNERİ-08-04; punchline değil, dua değil").
- Rapor: muaf tutulan bulgu `info` olarak kalır, SARIF'te `suppressions[]` ile görünür; haftalık muafiyet özeti (sayı, kural, süre) `lint-summary.json`'da.

#### 2.2.12 Release imzası (`release-signoff.json`, `RV-06`, D-ÖNERİ-08-06)

```json
{
  "release": "1.0.0-rc.3",
  "lintReportSha256": "…",
  "openWarnings": 7,
  "signedBy": [{ "handle": "…", "role": "content-owner" }, { "handle": "…", "role": "legal-contact" }],
  "signedAt": "2027-02-11T09:40:00Z",
  "note": "7 warn: 5 RL-16 (3–4 puan, tekil NPC), 2 TN-04 (rare). Hepsi okundu."
}
```

Kural: `openWarnings` raporla birebir eşleşmezse veya `lintReportSha256` güncel değilse `block`. İki imza zorunlu; roller farklı kişiler. Bu dosya release tag'iyle birlikte repoda kalır (değişiklik ispatı, T9 §5d).

#### 2.2.13 NPC diyalog satırı kuralları (`DL-*`, D-062)

D-062 ile olay kartı **NPC balonları** taşır: avatar + ad + balon; oyuncu seçenekleri "Sen: …" cevap balonu olarak akışa yazılır; koç yorumu diyalogdan **sonra** ve ayrı katmanda. Bu, lint için yeni bir `scope: 'npc'` yüzeyi ve yeni bir risk sınıfıdır: koç bir karakterdir ve kuralları bellidir; NPC'ler çok seslidir ve "karakter öyle konuşur" bahanesi en kolay sızıntı yoludur. Aşağıdaki kurallar **her NPC için, her ses ayarında** geçerlidir; `RL-*` kataloğunun tamamı `npc` kapsamında aynen koşar (tek fark `RL-04` ünlem `warn`'ı).

**NPC'nin asla söylemediği (DL-01..06, hepsi `block`, muaf tutulamaz):**

| ID | Kural | Örnek yasak (soyut) | Not |
|---|---|---|---|
| **DL-01** | Gerçek kişi, marka, kurum, parti, din, inanç nesnesi, güncel felaket — NPC ağzında da `RL-01..07`, `RL-23` | Taksici: *"[gerçek siyasetçi] olsa…"* · Kurye: *"[gerçek kargo firması]'da çalışıyorum."* | "Karakter öyle der" muafiyeti **yok**; Taksici klişesi (siyaset, ekonomi, "bu ülke") bilinçli olarak kesildi: Taksici yalnızca güzergâh, taksimetre, kısa yol ve yolcu hikâyesi konuşur |
| **DL-02** | Korunan grup/bölge/etnik köken göndermesi; **şive ve ağız yazımı** (eye-dialect) yok: "geliyom", "ula", "ya herif", "gardaş", "innit", "y'all" biçimleri NPC'yi bölgeyle etiketler | Dayı: *"Biz [bölge] insanı…"* · Mrs. Dale: *"Those [group] neighbors…"* | NPC kimliği hiçbir zaman etnik köken, göçmenlik, inanç veya bölgeyle tanımlanmaz; kimlik = rol + alışkanlık (Barış: büyük harf; Yağmur: üç kelime) |
| **DL-03** | Anne'ye hakaret yok, Anne'nin ağzından kimliğe hakaret yok: Anne şakalarının hedefi **durum** (soru bombardımanı, okunmamış sayacı, komşunun oğlu); Anne asla "aptal, beceriksiz, şişman, çirkin" demez, karakter de Anne'ye demez (cevap balonu seçenekleri dahil) | *"Annen: 'Kilo almışsın.'"* (beden, RL-27) · Sen: *"Sus anne."* (TN-08 benzeri `DL-03` listesi) | ANNE ARIYOR baskını (D-063) juice'tur, hakaret değil; Anne kaygılıdır, acımasız değil. "Komşunun oğlu" kıyası serbest; komşunun oğlunun beden/etnik özelliği yok |
| **DL-04** | NPC oyuncunun **gerçek** hayatına, saatine, cihazına seslenmez; 4. duvarı kırmaz; koçla konuşmaz (ayrı katman, D-062) | Barış: *"SEN DE GERÇEKTEN UYUMUYORSUN"* · Nevin Hanım: *"Koç Bey'e söyleyin…"* | `RL-22` `npc` kapsamına genişletilir; NPC adı + "koç/Motto/coach" aynı balonda → `block` |
| **DL-05** | NPC'de sansürsüz küfür, slur, cinsel betimleme yok; `[sansür]/[redacted]` yalnızca olay metninde, NPC balonunda **hiç** (balon ekran görüntüsüdür) | Dayı: *"[sansür] işler."* | `TN-11` NPC balonunda `[sansür]` dahil 0; Barış'ın büyük harfi küfür yerine geçer |
| **DL-06** | Doktor NPC teşhis adı, ilaç adı, doz söylemez ("değerler", "bir şey çıktı", "kontrol"); İK NPC gerçek şirket/araç adı söylemez; Kombi ustası/kurye marka söylemez | Doktor: *"[klinik teşhis] başlangıcı."* · İK: *"[gerçek İK yazılımı]'a girin."* | 02 §2.4.7 "tanı yok"; Google Health politikası; `RL-06`, `RL-26` |

**NPC ses kuralları (DL-07..10, `block` unless noted):**

| ID | Kural |
|---|---|
| **DL-07** | Her NPC balonu `speaker` enum'undan (8 Tanıdık Yüz + 12 durumsal rol) ve locale'e göre ad tablosundan gelir (Barış↔Jordan, Nevin Hanım↔Ms. Carver, Yağmur↔Sam, Şükran Teyze↔Mrs. Dale, Pamuk↔Biscuit, Dayı↔your uncle, Taksici↔the driver, Anne↔Mom); serbest `speakerName` yok (`NG-*` listeleri uygulanamaz hale gelir) |
| **DL-08** | Balon bütçesi: ≤ 2 cümle, ≤ 18 kelime (TR) / ≤ 16 (EN); olay başına ≤ 4 NPC balonu; aynı olayda ≤ 2 konuşmacı. Ses imzaları şema düzeyinde doğrulanır: Anne ≤ 8 kelime ve `?` içerir; Barış `UPPER` oranı ≥ %60; Yağmur ≤ 3 kelime; Pamuk tek token (`Miyav` / `Mrow` havuzundan); Nevin Hanım 2. çoğul + İK sözlüğü (`warn` eksikse) |
| **DL-09** | Cevap balonları ("Sen: …") `scope: 'choice'`; roast hedefi karakterin kendisi veya durum (`TN-12`); cevap balonu NPC'ye hakaret edebilir ama kimliğine değil ("Barış, bulaşık 2029'dan beri senin." serbest; "Barış, sen [kimlik]…" `block`) |
| **DL-10** | NPC dinî/ahiret sözlüğü kullanmaz; gündelik ünlem ("inşallah/maşallah", "oh my God") NPC'de `warn` + incelemeci muafiyeti (D-ÖNERİ-08-04); Şükran Teyze'nin "Allah" içeren hiçbir kalıbı yok (ünlem dahi); EN'de "God" ünlemi yalnızca `OMG` biçiminde ve `warn` |

**NPC'lerin ne yapabildiği (pozitif liste, yazar brief'i için):** Anne kaygılanır, soru sorar, yemek sorar, komşunun oğlunu anar, "aramıyorsun" der. Barış kesin konuşur, yanılır, bulaşığı ertelemez-erteler, kripto önerir. Nevin Hanım "değerli çalışan" der, "yeniden yapılanma" der, pazartesi toplantı koyar. Yağmur üç kelimeyle her şeyi söyler ("Konuşmamız lazım." / "We should talk."). Şükran Teyze helva/casserole getirir, "evlenmedin mi" sorar. Dayı "hayata atıl" der, 2009'da yaşar, para verir. Pamuk tek kelime. Taksici kısa yol bilir, taksimetre açmaz, hikâye anlatır (kendi hikâyesi, dünya hikâyesi değil). Durumsal NPC'ler (kurye, kombi ustası, ev sahibi, İK, doktor, memur) tek işlevli ve bürokrasi komiğidir.

---

### 2.3 İnsan inceleme — olay kontrol listesi, Tier A/B, avukat örneklemesi

**10 soruluk olay kontrol listesi** (her olay için PR şablonuna gömülü; her soru "Evet" olmalı; "Hayır" = `needs-review`):

1. Bu olayın ekran görüntüsü, bağlamsız, bir şikâyet dilekçesine eklenebilir mi? → **Hayır** olmalı.
2. Roast'un hedefi karakterin **kararı** mı, karakterin kimliği/bedeni/kökeni değil mi?
3. Satırda bir gerçek kişi, marka, kurum, parti, din, bölge, güncel olay **arketipe** indirgenmiş mi?
4. Madde/kumar/suç varsa: etkisi kalıcı negatif mi, "nasıl" yok mu, marka yok mu, 18 altı NPC yok mu?
5. NPC balonları `DL-01..10`'a uyuyor mu; Anne sevilerek yazılmış mı; Taksici siyaset konuşmuyor mu?
6. EN satırı TR'yi görmeden yazıldı mı ve kendi başına komik mi (funny-check ≥ 15/25)?
7. Düşük Keyif, ölüm, ayrılık gibi sessizlik tetiği varsa roast kapalı mı, lift şakasız mı?
8. Para/makro/tarih: para soyut, enflasyon yok, gerçek takvim göndermesi yok (`RL-31`) mu?
9. Lint raporu temiz mi; `warn` varsa muafiyet gerekçesi yazıldı mı?
10. Bu satırı mağaza incelemecisine, Reklam Kurulu'na ve publisher'ın avukatına **aynı cümleyle** anlatabilir misin?

**Tier kuralları (D-ÖNERİ-08-12):** Tier A = publisher demosu olayları + tüm karne/motto/iddia/Roast Raporu/Teşhis etiketi satırları + `showcase` + Kader havuzu + yardım ekranı + mağaza; iki bağımsız onay (`reviewer`, `secondReviewer`), en az biri anadil. Tier B = geri kalan; tek onay. **Avukat örneklemesi (`RV-05`, soft launch'tan itibaren):** %10 Tier A rastgele (seed = release tag), %100 Kader, %100 yardım ekranı, %100 mağaza/kreatif, %100 `crime`/`substance:drugs`. Avukat çıktısı `lawyerSampled:true` + not; "Avukat" işaretli her madde onay olmadan kapanmaz (belge üstü uyarı).

**Haftalık kuyruk:** açık `warn`'lar, `needs-review`, süresi dolan muafiyetler; kuyruk > 40 birim olursa yeni içerik PR'ı `block` (borç tavanı, D-ÖNERİ-08-13).

### 2.4 Hukuki belgeler, KVKK ve rıza akışı (D-054; T9 §2.1, §5d)

| Belge | Dayanak | Dil | Nerede | Lint |
|---|---|---|---|---|
| Gizlilik Politikası | Apple 5.1.1, Play User Data, KVKK/GDPR | TR+EN | GitHub Pages (`legal.<alan>`), mağaza metadata linki, Ayarlar > Hukuk | `docs` kapsamı; sürüm + tarih zorunlu |
| KVKK Aydınlatma Metni (m.10, Tebliğ 2018/10) | 6698 | TR (EN bilgi amaçlı) | Ayrı sayfa + ilk açılışta ayrı kart | "okudum-onaylıyorum" tek kutu **yok** (Kurul 2026/347) |
| Açık Rıza Metni (ayrı) | 6698 m.5, Kurul 2026/347 | TR+EN | Uygulama içi ayrı toggle, varsayılan **kapalı** | Rıza ve aydınlatma aynı ekranda tek buton → `ST-08` `block` |
| Kullanım Koşulları / EULA | Sanal para süresiz, iade mağaza üzerinden, 16+ | TR+EN | GitHub Pages + Ayarlar | Avukat |
| 16+ uyarısı ve nötr yaş ekranı metni | D-037, Families, 7578 | TR+EN | İlk açılış | Yaş ekranı koç ağzında **değil**, düz UI (D-ÖNERİ-08-10) |
| "Tamamen kurgudur" feragatı | TMK 24 / TCK 125 bağlamı | TR+EN | Splash sonrası tek satır + Ayarlar | Metin sabit, koç ağzında değil |
| Açık kaynak lisansları + teşekkürler | OFL/CC/MIT/Apache | — | Ayarlar > Lisanslar (otomatik üretim) | CI lisans izin listesi (10) |
| Destek / KVKK başvuru kanalı | Apple 5.6.2, KVKK m.11/13 | TR+EN | Gizlilik sayfası + mağaza + Ayarlar | — |

**İlk açılış akışı (tek sıra, geri alınabilir, koç sessiz):** nötr yaş ekranı (doğum yılı seçici, veri saklanmaz; < 16 → *"Bu oyun 16 yaş ve üzeri içindir." / "This game is for ages 16 and up."* ve kapanış) → Aydınlatma kartı (yalnızca "Anladım/Got it") → Açık Rıza kartı (kişiselleştirilmiş reklam + yurt dışı aktarım; iki toggle, kapalı başlar; "Reddet" eşit boyutta) → iOS'ta ATT (Apple ön-ekranı düz dil) / EEA-UK-CH'de UMP → koçun ilk balonu. Reddedenlere kişiselleştirilmemiş reklam; oyun hiçbir rızaya bağlı değildir. Rıza değişikliği Ayarlar'da her zaman, tek dokunuşla. Standart sözleşme bildirimi (5 iş günü) ve SDK sağlayıcı sözleşmeleri §2.8 listesinde, **Avukat**.

### 2.5 "Gerçek hayatta yardım" ekranı — içerik, tetik protokolü, kurallar (D-052, D-ÖNERİ-08-07)

07 §2.2.8 ekranın görsel spec'ini (koç-sessiz, Inter, haptik/ses yok) verir; **içerik ve hukuk bu belgenindir.**

**İçerik (TR / EN, sabit, koç ağzında değil):**

- Başlık: *Gerçek hayatta yardım* / *Help in real life*
- Gövde: *"Motto bir oyundur ve koçu kurgusaldır. Zor bir dönemdeysen gerçek biriyle konuşmak işe yarar. Aşağıdaki hatlar ücretsiz ve gizlidir."* / *"Motto is a game and the coach is fictional. If you're going through a hard time, talking to a real person helps. The lines below are free and confidential."*
- Hat tablosu (bölgeye göre sıralı, tamamı listelenir; `expo-localization` bölge kodu, konum izni yok):

| Bölge | Satır | Not |
|---|---|---|
| TR | *Acil: 112* · *Destek hatları: findahelpline.com/tr* | Ulusal intihar hattı doğrulanamadı (T9; 182 Umut Işığı kapalı); **avukat + Sprint 0'da yeniden doğrulama**; "intihar" sözcüğü TR'de başlıkta/gövdede yok |
| US | *988 Suicide & Crisis Lifeline — call or text 988* | Özel ad olarak kalır |
| GB / IE | *Samaritans — 116 123* | 1.0 |
| CA | *Talk Suicide Canada — 9-8-8* | Soft launch (CA) |
| NZ | *Need to talk? — call or text 1737* | Soft launch (NZ) |
| AU | *Lifeline — 13 11 14* | 1.0 |
| Diğer | *findahelpline.com* | Yedek, her zaman görünür |

- Alt satır: *"Bu sayfa her zaman Daha menüsünde."* / *"This page is always in the More menu."*

**Tetik protokolü (03 motor + 01 koç + 07 UI; bu belge kuralı koyar):**

1. `lowJoy` (02: Keyif < 25, histerezis 35) **veya** `despair` etiketli olay **veya** Keyif ≤ 10 iki ardışık yıl → protokol **aktif**: director `roast` = 0; koç havuzu "bugün tek şey" moduna (L-121); Teşhis etiketi çarpması, konfeti, EFSANE OLAY, ANNE ARIYOR baskını **kapalı** (D-063 juice bu pencerede yok); her gösterilen günde en az bir "çıkış" seçeneği (yürüyüş, arkadaş, "biriyle konuş") görünür.
2. İlk aktifleşmede hayat başına **1 kez** koç devri (L-122, 2 balon, şakasız, hat numarası söylemez) + feed'de koç dışı sistem kartı (07 §2.2 metni) + Daha menüsünde kısa vurgu.
3. Oyuncu ekranı ziyaret ederse `helpScreenVisitedThisSession → suppressRoastOnce`; ziyaret **ölçülmez** (analitik olayı yok; KVKK veri minimizasyonu, D-ÖNERİ-08-07).
4. Ekranda ve protokol penceresinde reklam, mağaza, Torpil, bildirim teklifi **derleme zamanında** yok (`AdSlot` monte edilmez; 06/07).
5. Kapanış: Keyif ≥ 35 ve ≥ 3 gösterilen gün → roast kademeli açılır (01 sessizlik çıkışı: plain → kuru → sıcak).

**Kurallar:** metin değişikliği Tier A + avukat (`RV-05`); intihar/kendine zarar sözlüğü (`RL-08`) bu ekranda da `block` (yalnızca kurum özel adı istisna, `path:help.us.title` muafiyeti sabit); ekran içeriği çevrimdışı, paketlenmiş, sürüm numaralı; hat numaraları 6 ayda bir doğrulanır (takvim görevi, §2.8 #21); bölge belirlemede ağ yok.

### 2.6 Yaş derecesi cevap anahtarları (D-037)

**Apple App Store Connect (2025 anketi, iOS 26 kademeleri):**

| Soru | Cevap | Gerekçe / kota |
|---|---|---|
| Kaba mizah / küfür | **Sık** (sansürlü) | 13+ ekseni; `TN-11`/`QT-07` sansürlü ≤ 3/100 |
| Olgun / müstehcen tema | **Sık** | 16+ ekseni (ölüm, aldatma, iş kaybı kara komedi) |
| Alkol, tütün, uyuşturucu kullanımı/referansı | **Seyrek** | `QT-01..03` kotaları; **sık** işaretlenirse 18+ (D-037 ile çelişir → kota tasarım sözleşmesidir) |
| Cinsel içerik / çıplaklık | **Yok** (ima var, tasvir yok) | `RL-19`, fade-to-black |
| Gerçekçi şiddet / karikatür şiddet | Gerçekçi **Yok**; karikatür **Seyrek** | "dayak yedin, Sağlık −20" |
| Korku / dehşet | Yok | — |
| Simüle kumar | **Yok** | Piyango anlatı olayıdır, oynanabilir değil (`RL-11`) |
| Loot box / rastgele ücretli ürün | Yok | D-055 |
| Tıbbi / tedavi bilgisi | Yok | Doktor NPC teşhis koymaz (`DL-06`) |
| Sınırsız web erişimi, UGC, sohbet | Yok | — |
| Sonuç | **16+** (manuel yükseltme gerekmez; anket 16+ üretmeli, aksi hâlde kota ihlali var demektir) | T9'un 18+ önerisi vs D-037: §7 açık soru 1 |

**Google Play / IARC anketi:** şiddet "hafif, karikatür"; korku yok; cinsellik "ima"; dil "orta, sansürlü"; kontrollü maddeler "referans, özendirme yok"; kumar "yok (simüle dahil)"; nefret/ayrımcılık yok; UGC/konum paylaşımı/dijital satın alma: IAP var, konum yok, UGC yok → beklenen **PEGI 16 / ESRB T / USK 16 / ClassInd 16 / ACB M**. Target audience: **"çocuklara yönelik değil"**, Families programı **dışı**; "Designed for Families" kutusu işaretlenmez; mağaza görselleri "istemeden çocuklara cazip" olmayacak (sevimli maskot ikon yok; Pamuk/kedi ikon **değildir**, D-ÖNERİ-08-15). Kore (GRAC) ve Çin ilk lansmanda kapalı (§2.8).

**AdMob:** `maxAdContentRating = T`; `tagForChildDirectedTreatment = false`; `tagForUnderAgeOfConsent = false`; rewarded opt-in; ölüm akışında reklam yok (D-007); kişiselleştirme rızaya bağlı (§2.4). Mediation ağları aynı etiketlerle (manifest `ST-09` kontrolü).

**7578 / BTK:** derecelendirme beyanı IARC + Apple 16+; BTK yönetmeliği izlenir; yönetmelik ulusal sınıf isterse içerik değişmeden beyan güncellenir (avukat, §7).

### 2.7 Karanlık tasarım yasak listesi (D-040, D-055; T9 §2.3, §6; 06/07 için birebir UI kuralı)

| # | Yasak kalıp | Lint / denetim |
|---|---|---|
| 1 | Önceden işaretli ücretli seçenek, varsayılan açık rıza/abonelik | UI snapshot testi; `ST-08` |
| 2 | Sahte geri sayım, sahte stok, "şu an X kişi", "son şans/sadece bugün" (gerçek takvim olayı `calendar:true` hariç) | `R16`, `R17`, `ST-07` |
| 3 | Enerji/bekleme duvarı, "bekle ya da öde" | Şemada yok; 12 §1 "Reddet" |
| 4 | Streak sıfırlama/utandırma, streak satışı, Telafi/Sakatlık İzni satışı | 05 kuralı; `TN-01` utandırma dili |
| 5 | Ölüm ekranında reklam, ölümden dönüş satışı, near-miss'e bağlı reklam, kayıp-kovalama teklifi | `AdSlot` derleme zamanında yok (07 AC-07-18); harness "near-miss → teklif" sekansı = 0 |
| 6 | Kapatma düğmesi gizleme, yanıltıcı yerleşim, "Hayır" düğmesinin küçük/soluk olması | 07 tasarım kuralı ("Hayır" eşit boyut); Playwright ölçüm |
| 7 | Fiyat KDV hariç gösterimi, "ücretsiz deneme" adıyla ödeme bilgisi kaydı | Mağaza API fiyatı; abonelik yok (D-041) |
| 8 | Suçluluk dili ("gitme", "emin misin, kaybedeceksin") iptal/kapatma akışında | `TN-01` `ui` kapsamı; confirm-shaming sözlüğü `tone.txt`'e eklenir |
| 9 | Sahte sosyal kanıt (gerçek olmayan yorum/tanıklık, hayali kohortun gerçek gibi sunulması) | `ST-05`, `ST-07` ("hayali/fictional" etiketi zorunlu) |
| 10 | Rastgele ücretli kutu, oranı gizli herhangi rastgelelik satışı | Şemada yok; D-055 |

### 2.8 Lansman öncesi kontrol listesi (bu belgenin sahiplendiği satırlar; T9 §5f'nin 08 kesiti)

| # | Madde | Faz | Sorumlu | Avukat/MM? |
|---|---|---|---|---|
| 1 | Sprint 0 marka taraması (Motto/Tempo; TÜRKPATENT 9+41, EUIPO, USPTO) ve `ST-02` listesi güncel | MVP | Kurucu | Marka vekili |
| 2 | Blocklist seed'leri (§2.2.5) repoda, `redlines.lock` SHA'ları CI'da | MVP | Geliştirici | Hayır |
| 3 | Gerçek-kişi listesi Wikidata'dan üretildi (≥ 5.000/locale), aylık yenileme görevi | MVP | Geliştirici | Hayır |
| 4 | Adversarial genelleme seti 200 cümle; recall/precision kapısı | MVP | İçerik | Hayır |
| 5 | KVKK paketi: envanter, aydınlatma, ayrı açık rıza, gizlilik, başvuru kanalı | Soft | Kurucu | **Avukat** |
| 6 | SDK sağlayıcı standart sözleşmeleri + 5 iş günü bildirimi | Soft | Kurucu | **Avukat** |
| 7 | VERBİS muafiyet kontrolü | Soft | MM | **MM** |
| 8 | EULA / Kullanım Koşulları (sanal para süresiz, iade mağaza, 16+) | Soft | Kurucu | Avukat |
| 9 | IARC anketi + App Store Connect anketi §2.6 anahtarlarıyla; sonuç 16+/PEGI 16 doğrulandı | Soft | Geliştirici | Hayır |
| 10 | AdMob etiketleri (`T`, child-directed false), UMP/ATT akışı, rıza varsayılan kapalı | Soft | Geliştirici | Hayır |
| 11 | Data safety formu + Privacy Nutrition Label + privacy manifest | Soft | Geliştirici | Hayır |
| 12 | Mağaza metadata 4+ (`ST-01..07`), her iki mağazada aynı vitrin satırları | Soft | Kurucu | Hayır |
| 13 | Kreatif manifest (`realGameplay`, `aiTestimonial:false`, `influencerAdLabel`) | Soft | Kurucu | Hayır |
| 14 | Yardım ekranı hatları doğrulandı (TR/US/CA/NZ), avukat okudu | Soft | İçerik | **Avukat** |
| 15 | Kader havuzu avukat okuması (%100) | Soft | İçerik | **Avukat** |
| 16 | Coğrafi kapatma: Çin, Kore | Soft | Geliştirici | Hayır |
| 17 | Varlık lisans denetimi + Lisanslar ekranı | MVP | Geliştirici | Hayır |
| 18 | Vergi kurgusu (hizmet ihracı, DHV, e-arşiv) | Soft | MM | **MM** |
| 19 | 7578/BTK yönetmelik takvimi; çeyreklik avukat check-in | 1.0 | Kurucu | **Avukat** |
| 20 | Publisher sözleşmesinde içerik sorumluluğu/indemnity maddesi lint raporuna atıf yapar | 1.0 | Kurucu | **Avukat** |
| 21 | Yardım hatları 6 aylık yeniden doğrulama görevi takvimde | 1.0 | İçerik | Hayır |
| 22 | `release-signoff.json` iki imzayla tag'de | Her sürüm | İçerik + hukuk irtibatı | Hayır |

---

## 3. Örnek içerik — TR + EN

Kural: her satırda **izinli** biçim gerçek, gönderilebilir metindir; **yasak** biçim köşeli parantezle soyutlanmıştır (bu belge de `--docs` lint'inden geçer). Her çiftte lint kimliği ve "neden izinli" notu vardır. EN satırları TR'nin çevirisi değil, aynı niyetin kendi başına komik hâlidir.

### 3.1 Kategori başına izinli / yasak çiftleri (24 çift)

| # | Kategori | İzinli TR | İzinli EN | Yasak (soyut) | Lint | Neden izinli |
|---|---|---|---|---|---|---|
| 1 | K1 Gerçek kişi | "Bir ünlü şef yine bir restoran açtı. Sen yine noodle yaptın. İkiniz de mutfaktasınız; fark şöhret." | "Some celebrity chef opened another restaurant. You made instant noodles. You're both in a kitchen. The difference is lighting." | "[gerçek şef] gibi olacağım dedin." | RL-01 | Arketip, ad yok, kıyas karakterin kararı |
| 2 | K1 Gerçek kişi (unvan) | "Bir girişimci podcast'te 'disiplin' dedi. Sen podcast'i 1,5x hızda dinledin. Disiplin." | "A founder on a podcast said 'discipline.' You listened at 1.5x. That's the discipline." | "[Sayın + gerçek ad] dedi ki…" | RL-01, R1 | Unvan + özel ad deseni yok |
| 3 | K2 Marka | "Zincir market 'indirim' dedi. Sepet: 11 ürün, 0'ı listede. Para −9." | "The discount chain said 'sale.' Cart: eleven items, zero from the list. Cash −9." | "[gerçek market]'te indirim vardı." | RL-06 | Jenerik tip |
| 4 | K2 Kurum | "Pelikan Bankası 'değerli müşterimiz' dedi. Tercüme: borcun var." | "Pelican Bank calls you a 'valued customer.' Translation: you owe them, and they're polite about it." | "[gerçek banka] seni aradı." | RL-06, RL-17 | Kurgusal kurum; banka adı listede değil |
| 5 | K3 Din | "Bayram. 14 akraba, 3 soru. Harçlık: 1. Sorgu: sınırsız." | "The holidays. Fourteen relatives, three questions. Gift envelopes: one. Interrogations: unlimited." | "[dinî bayram adı] geldi, [ibadet] yaptın." | RL-04 | Yalnızca aile lojistiği, bayram adsız |
| 6 | K3 Cenaze | "Cenaze. Helva dağıtıldı, trafik vardı, teyzen seni gördü. Üç olay, bir gün." | "The funeral. Casseroles, traffic, and your aunt saw you. Three events, one afternoon." | "[ölen] artık [ahiret sözcüğü]." | RL-23 | Bürokrasi + kalabalık; ölenin değeri ve ahiret yok |
| 7 | K4 Korunan grup | "Ev arkadaşın Barış bulaşığı 'yarın' yıkıyor. Yarın 2029'dan beri gelmedi." | "Your roommate Jordan does the dishes 'tomorrow.' Tomorrow hasn't shown up since 2029." | "[grup]lar hep böyle." | RL-05, RL-28 | Hedef alışkanlık, kimlik değil |
| 8 | K5 Siyaset | "Memur bey formunu üçüncü kez kaybetti. Kişisel değil; herkesinkini kaybediyor." | "The clerk lost your form. Third time. It's not personal; he loses everyone's." | "Bu ülkede [kurum] çalışmaz." | RL-16, R5 | Tekil kurgusal memur; "bu şehirde" |
| 9 | K6 Ulusal sembol | "Resmî tatil. Herkes tatilde; kiran değil." | "Public holiday. Everyone's off. Your rent isn't." | "[ulusal gün adı]'nda…" | RL-02 | Tatil adsız |
| 10 | K7 Askerlik (TR) / ikame (EN) | "Nöbet 02:00–04:00. Düşündüklerin: hayat, eski sevgilin, çay. Sıralama senin." | "Loan statement arrived. Your interest has a better work ethic than you do." | "[çürük raporu / kaçma] seçeneği" | RL-14, RL-15 | Gündelik komedi; EN'de ikame olay |
| 11 | K8 Alkol | "İş çıkışı 'bir tek'. Dört oldu. Keyif +6, Sağlık −4, sabah −12." | "'Just one' after work. It was four. Joy +6, Health −4, the morning −12." | "[marka] içtin, karizma +10." | RL-10, QT-01, QT-08 | `substance:alcohol` etiketi, kalıcı negatif |
| 12 | K8 Uyuşturucu (maruz kalma) | "Partide 'bir şeyler' dolaşıyordu. Sen dolaşmadın; arkadaşın hastanede. Gece −1 arkadaş." | "Something was going around at the party. You didn't. Your friend's in the ER. Night: minus one friend." | "[madde adı] aldın, en iyi gece." | RL-09, QT-03 | Madde adsız; karakter kullanmaz; sonuç |
| 13 | K9 Kumar | "Piyango bileti. Oran 1/14 milyon. Umut ölçülemez. Para −1." | "Lottery ticket. Odds: one in fourteen million. Hope: unmeasurable. Cash: minus one." | Koç: "[bahis sözcüğü]e girerim…" | RL-11, RL-12, QT-09 | Anlatı olayı, EV negatif; koç "iddia" der |
| 14 | K10 Cinsellik | "Eve birlikte gittiniz. Defteri kapatıyorum; bazı sayfalar benim değil." | "You went home together. Closing the notebook. Some pages aren't mine to keep." | "[açık betimleme]" | RL-19, RL-21 | Kapı kapalı; NPC ≥ 18 şemada |
| 15 | K11 Suç | "Vergide 'yaratıcı' oldun. Yaratıcılık iki yıl sonra denetimde takdir edildi. Para −40." | "You got 'creative' on your taxes. The creativity was appreciated two years later, at the audit. Cash −40." | "Mahalleyi [haraç] bağladın. Saygı +20." | RL-20, QT-05 | Şiddetsiz suç, yakalanma, EV < 0 |
| 16 | K12 Düşük Keyif | "Zor bir yıl. Bugün tek şey: bir karar. Küçük olsun. Ben buradayım." | "Rough year. Today, one thing: one decision. Make it small. I'm not going anywhere." | "[kendine zarar deyimi] diyorsun herhalde." | RL-08, QT-11 | Her ayarda aynı; roast 0 |
| 17 | K13 Ruh sağlığı | "Doktor 'stres' dedi. Doktorlar bilmediklerine stres der; sen patronuna 'yoğunluk' diyorsun. Aynı hamle." | "The doctor said 'stress.' Doctors say stress when they don't know. You say 'bandwidth' to your boss. Same move." | "[klinik etiket] misin sen?" | RL-26, DL-06 | Teşhis yok, kişi etiketi yok |
| 18 | K14 Beden | "Ayrılık sonrası saç kestirdin. Saç geri gelir, o gelmez. Sen de gidiyorsun; ileri." | "Post-breakup haircut. The hair grows back; they don't. Neither do you. Forward." | "[kilo/boy] ile ilgili punchline" | RL-27 | Hedef seçim (saç), beden değil |
| 19 | K15 Aile | "212 okunmamış. 211'i teyzenden, 1'i annenden: 'Mesajları okuyor musun?' Ben okudum. Biri okusun." | "212 unread. 211 from your aunt. One from your mom: 'Are you reading these?' I read them. Somebody had to." | "Annen [aşağılama]." | DL-03, TN-09 | Hedef durum; Anne sevilir |
| 20 | K16 Şehir | "Kadıköy. Kira: maaşının %61'i. Manzara: komşunun klima motoru." | "Cleveland. Rent: 61 percent of your pay. View: the neighbor's AC unit." | "[şehir]liler [sıfat]dır." | RL-28, R2 | `geo-neutral`; kira/manzara nötr bağlam |
| 21 | K17 Para | "Bakiye: 0. Yuvarlamadım; sıfır yuvarlanmaz." | "Balance: zero. I didn't round. Zero doesn't round." | "[enflasyon %] maaşını eritti." | RL-17, RL-18, R8, R9 | Soyut Para, makro yok |
| 22 | K18 Polis | "Trafik polisi durdurdu. Ehliyet var, ruhsat var, bahane yok. Ceza var." | "Traffic stop. License: yes. Registration: yes. Excuse: none. Ticket: yes." | "Memura [rüşvet sözcüğü] verdin." | RL-13, RL-16 | Tekil memur; kurum değil; rüşvet çerçevesi yok |
| 23 | K20 Gerçek hayat (push) | "Annen aradı. (Oyundaki annen. Gerçek anneni de ara.)" | "Your mom called. (The game one. Call the real one too.)" | "İşsizsin herhalde, saat 3'te oynuyorsun." | RL-22, R18 | Evrensel, nazik; varsayım yok |
| 24 | K21 Küfür | "Patron 'bir dakika' dedi. Dakika 47 oldu. İçinden [sansür] dedin; defter sansürler." | "Boss said 'one minute.' It's been forty-seven. You said [redacted] under your breath. The notebook redacts." | "[ham küfür]" | TN-11, QT-07 | Evren-içi sansür, olay metninde; koçta 0 |

### 3.2 NPC diyalog örnekleri (D-062; `DL-*`)

| NPC | İzinli TR | İzinli EN | Yasak (soyut) | Lint |
|---|---|---|---|---|
| Anne | "Yemek yedin mi? Komşunun oğlu evlendi. Aramıyorsun?" | "Did you eat? The neighbor's son got married. You don't call?" | "Annen: '[beden yorumu].'" | DL-03, RL-27 |
| Barış / Jordan | "KESİN. BU COİN UÇACAK. BULAŞIK YARIN." | "THIS IS THE ONE. IT'S GOING UP. DISHES TOMORROW." | "KESİN, [gerçek borsa/coin adı]…" | DL-01, RL-06 |
| Nevin Hanım / Ms. Carver | "Değerli çalışanımız, pazartesi 09:00'da kısa bir yeniden yapılanma görüşmesi." | "Valued team member, a brief restructuring conversation Monday at nine." | "[gerçek şirket] politikası gereği…" | DL-06, RL-06 |
| Yağmur / Sam | "Konuşmamız lazım." | "We should talk." | "Konuşmamız lazım, [gerçek saat/konum]." | DL-04, DL-08 |
| Şükran Teyze / Mrs. Dale | "Helva getirdim. Evlenmedin mi hâlâ?" | "Brought a casserole. Still not married?" | "[dinî ünlem], evlenmedin mi?" | DL-10 (warn/muafiyet) |
| Dayı / your uncle | "Hayata atıl. Al şunu. 2009'da böyle yapardık." | "Get out there. Take this. That's how we did it in '09." | "Biz [bölge] erkeği…" | DL-02, RL-28 |
| Pamuk / Biscuit | "Miyav." | "Mrow." | "Miyav. (Sen de uyumuyorsun.)" | DL-04 |
| Taksici / the driver | "Kısa yoldan gidiyoruz. Taksimetre açık. Hikâye anlatayım mı?" | "Taking the shortcut. Meter's running. Want a story?" | "Bu ülkede [siyasi/ekonomik yargı]…" | DL-01, R5 |
| Doktor | "Değerlerde bir şey var. Kontrol. Yürüyüş." | "Something in your numbers. Follow-up. Walking." | "[teşhis adı] başlangıcı, [ilaç adı] yazıyorum." | DL-06, RL-26 |
| Kurye | "Kapıda değilsin. Kapıdayım. Biri kapıda olsun." | "You're not at the door. I'm at the door. Someone has to be." | "[gerçek kargo]'dan arıyorum." | DL-01, RL-06 |

### 3.3 Gün atlama özetleri ve takvim satırları (D-061; `scope: 'skip'`)

| İzinli TR | İzinli EN | Yasak (soyut) | Lint |
|---|---|---|---|
| "11 gün geçti. Hiçbir şey olmadı; bu da bir olay." | "Eleven days passed. Nothing happened. That counts." | "11 gün geçti; [gerçek felaket] oldu." | RL-07 |
| "23 gün. Kira ödendi, dizi bitti, Barış 'kesin' dedi dört kez." | "Twenty-three days. Rent paid, the show ended, Jordan said 'for sure' four times." | "23 gün; [makro ekonomi rakamı] değişti." | RL-18 |
| Kart başlığı: "Gün 41 · Perşembe" | "Day 41 · Thursday" | "Gün 41 · [hassas takvim günü], bugün [yorum]" | RL-31 |

### 3.4 Vitrin (`showcase:true`) ve mağaza satırları (K22)

- TR *"Karne: Para Geçer, Cesaret Pekiyi. Parasız ama gözü kara."* · EN *"Report card: Money D, Courage A. Broke but fearless."* (`ST-01`, `ST-04` temiz)
- TR *"Koç sana karşı iddiaya girdi. Haksız çıktı. Damga koleksiyonun: 3."* · EN *"The coach bet against you. The coach was wrong. Stamps collected: three."* (`RL-12`: "iddia/bet against" — EN'de "bet against you" tagline D-049/00 §0.3 ile mağaza dışı **kreatif** satırıdır; mağaza açıklamasında "wager" kullanılır, D-ÖNERİ-08-16)
- **Yasak vitrinde:** *"Öldün. 74 yaşındaydın."* (ölüm, `ST-04`), herhangi bir Kader satırı (`ST-06`), "motivasyon/wellness" (`RL-24`), "BitLife gibi" (`RL-25`).

### 3.5 Lint bulgusu örneği (konsol, TR locale)

```
✖ RL-16 block  ev-0412  tr.body
   "Bütün ev sahipleri aynı: zam, bahane, zam."
   genelleme skoru 6: quantifier+institution+negative
   Öneri: tekil kurgusal karaktere indir → "Nevin Hanım'ın ev sahibi kuzeni: zam, bahane, zam."
   Dayanak: TCK 216 · T9 §5c-12
⚠ RL-04 warn   ev-0412  tr.dialog[1].text  (speaker: sukran)
   "İnşallah bu sefer tutar."
   NPC gündelik ünlemi; muafiyet için reviewer gerekçesi (D-ÖNERİ-08-04)
✔ 1.912 birim · 2 locale · 7,4 sn · block 1 · warn 1 · info 0
```

---

## 4. Platform notları (iOS / Android)

Linter platformdan bağımsızdır (saf TS, Node 22, CI'da Linux); platform farkı **beyanlarda, metadata'da ve rıza/yardım yüzeylerinde**dir.

| Konu | iOS (16.4+) | Android (minSdk 24) | Bu belgenin kuralı |
|---|---|---|---|
| **Yaş derecesi** | App Store Connect 2025 anketi, iOS 26 kademeleri: hedef **16+**; "sık olgun tema" + "sık kaba mizah (sansürlü)" + "seyrek alkol/uyuşturucu referansı" | IARC anketi → **PEGI 16 / ESRB T / USK 16 / ClassInd 16 / ACB M**; "çocuklara yönelik değil" | §2.6 cevap anahtarı; kotalar (`QT-01..03`) "seyrek" beyanının teknik dayanağı; anketler her içerik paketinde yeniden doldurulur (AC-08-13) |
| **Metadata 4+ (Apple 2.3.8 / Play Store Listing)** | İkon, ekran görüntüleri, önizleme, açıklama 4+ seviyesinde; "mean-spirited" riskine karşı inceleme notu | Aynı görseller; "istemeden çocuklara cazip" öğeler yok (sevimli maskot ikon yok) | `ST-01..07`; her iki mağazada **aynı** vitrin satırları; inceleme notu sabit: *"Satirical life-coach narrator; roasts the character's choices, never identity; every line passes an automated red-line lint (Turkish law + store policy)."* |
| **Metadata alan sınırları** | Ad 30 / alt başlık 30 / anahtar kelime 100 byte / promo 170 / açıklama 4.000 | Ad 30 / kısa açıklama 80 / tam açıklama 4.000 | `ST-03`; "BitLife" ve rakipler yok (`RL-25`); "motivasyon/wellness" yok (`RL-24`); Apple'da anahtar kelimede marka yok (2.3.7); Play'de başlıkta "#1/en iyi" yok (`ST-02`) |
| **Families / çocuk hedefi** | Kids Category'de **değil**; Apple Declared Age Range API sinyali gelirse 16+ beyanıyla tutarlı davranış (< 16 → kapanış ekranı) | Families programı **dışı**; "Designed for Families" işaretsiz; Play Age Signals API (2026) < 16 → kapanış | Nötr yaş ekranı her iki platformda aynı ve veri saklamaz (D-ÖNERİ-08-10); yaş sinyali API'leri yalnızca kapıyı destekler, koç bunu **bilmez** (D-050) |
| **Reklam derecesi** | AdMob `maxAdContentRating = T`; ATT ön-ekranı düz dil; ATT reddi → kişiselleştirilmemiş | AdMob `T`; UMP yalnızca EEA/UK/CH; TR'de KVKK rıza kartı UMP yerine | `ST-09`: SDK manifest/`app.json` etiketleri CI'da okunur; `child-directed: false`, `underAgeOfConsent: false` |
| **Hukuki belge barındırma** | Gizlilik linki App Store Connect'te zorunlu (5.1.1); uygulama içi link | Data safety + gizlilik linki Play Console'da zorunlu | GitHub Pages TR/EN, sürümlü; `legal/` klasörü repoda, `docs` lint'inden geçer; link kırıksa `ST-10` `block` (CI HEAD isteği, yalnızca release) |
| **Privacy Nutrition Label / Data safety** | SDK'ların topladığı reklam kimliği, cihaz bilgisi beyan edilir; privacy manifest (SDK'lar) | Data safety formu; "paylaşım" = SDK reklam profili | Beyan formu `legal/data-inventory.json`'dan üretilir (tek kaynak); form ile envanter farkı → release `block` |
| **Yardım ekranı** | `Linking.openURL('tel:988')` iOS'ta arama onayı ister; SMS "text 988" linki `sms:` | `tel:` intent; bazı OEM'lerde arama uygulaması yoksa fallback web linki | Her hat için `tel:` + web yedeği; bölge sıralaması `expo-localization` bölge kodu, konum izni **yok**; ekran çevrimdışı çalışır (AC-08-11) |
| **Küfür/sansür görünümü** | `[sansür]` metin olarak render edilir (görsel değil); VoiceOver "sansür" okur | TalkBack aynı | `[sansür]`/`[redacted]` **ikonla değil metinle**; ekran okuyucu etiketi locale'e göre |
| **Geo-kapatma** | App Store Connect: Çin ve Kore storefront'ları kapalı (ilk lansman) | Play Console ülke listesi: aynı | §2.8 #16; Avustralya açık (simüle kumar yok) |
| **İnceleme kaynakları** | App Review notlarına demo yolu + lint raporu linki + "fictional country" açıklaması | Play Console "App content" beyanları + aynı not | İnceleme notu metni §4 kuralı; `docs/store/review-notes.{tr,en}.md` lint'ten geçer |
| **Fontlar/emoji** | Koç metninde emoji yok (`TN-03`); sistem emoji yalnızca Karne paylaşım kartında (12 §1 Wordle) ve yalnızca UI tarafı | Aynı; Android emoji seti farklı render | Paylaşım kartı emoji seti sabit 6 glif, `ui` kapsamı; Apple emoji **varlık olarak paketlenmez** (lisans, T9 §4.3) |

İki platformda **değişmeyenler:** kural kataloğu, blocklist'ler, kotalar, yaş beyanının içerik dayanağı, yardım ekranı içeriği, rıza akışının sırası ve varsayılanları. Bir içeriğin tek platformda görünmesi **yasaktır** (`ContentUnit`'te platform alanı yoktur; 01 §4 ile aynı ilke).

---

## 5. Hukuk ve politika kontrolü

### 5.1 Linter'ın kendisi T9'un içinde nasıl kalıyor

Bir hukuk aracı da hukuki risk üretebilir. Bu belgenin ve `content-lint` paketinin kendi uyumu:

| Risk | Mekanizma |
|---|---|
| **Blocklist'in kendisi hakaret/sızıntı kaynağı** (slur listesi, cinsel terimler, gerçek kişi listesi repoda okunabilir; ekran görüntüsü alınır, "şirket şu sözcükleri yazdı" olur) | Özel listeler `content/redlines/private/`'da, `docs/` dışında, README'siz; dokümanlar yalnızca unvan **desenlerini** yazar; gerçek-kişi listesi üretilir, elle yazılmaz ve repoda yalnızca SHA'sı tartışılır (D-ÖNERİ-08-03). Bu belge yasak örnekleri soyutlar ve `--docs` lint'inden geçer. |
| **Gerçek kişi listesi = kişisel veri işleme (KVKK)** | Liste kamuya açık Wikidata kayıtlarından ad + meslek alanıyla sınırlı; başka alan yok; yalnızca eşleme amacıyla, CI'da; uygulamaya **gömülmez** (NG-05 runtime kopyası yalnızca ikonik kurgusal adlar + küfür; gerçek-kişi listesi cihaza gitmez). Aydınlatma metnine girmez (son kullanıcı verisi değil). Avukat teyidi §7. |
| **Linter'ın "siyasi" bir liste tutması** (parti adları, siyasetçiler) | Liste tarafsız ve **tam** (tüm partiler, tüm görevdeki/eski makamlar); hiçbir isim yorumla birlikte tutulmaz; dosya adı `politics.txt`, açıklama "oyun metninde geçmez". Doküman hiçbir siyasi görüş içermez; TCK 299/301 riski dokümanda değil, yokluğunda olurdu. |
| **Yanlış pozitif = içerik sansürü itirazı yok, ama yanlış negatif = şikâyet** | Recall önce: `block` kuralları kural tabanlı, açıklanabilir, LLM'siz; LLM/sınıflandırıcı yalnızca `warn` (v2). Deterministik çıktı = publisher'a "her satır bu kuraldan geçti" ispatı (SARIF + imza). |
| **Lint'in muafiyetle delinmesi** | `exemptable:false` kurallar (RL-01/02/03/07/08/13/23, QT-*) hiçbir muafiyet kabul etmez; muafiyet 180 gün, iki kişi, PR onaylayanla eşleşme; süresi dolan muafiyet `block`. |
| **"Lint geçti" = hukuki güvence yanılgısı** | Belge başı uyarı; `RV-05` avukat örneklemesi; §2.3 soru 10 ("aynı cümleyle anlatabilir misin"); SARIF `rules[].help` alanı "bu kural hukuki tavsiye değildir" notu taşır. |
| **Yardım ekranı yanlış numara = itibar + zarar** | Hatlar sürümlü, 6 ayda bir doğrulama görevi, avukat okuması, TR'de doğrulanamayan hat **yazılmaz** (findahelpline yönlendirmesi). |
| **Kod kapsamı (`RL-13`) geliştirici dilini sansürler mi** | Yalnızca `bribe*`/`rüşvet*` ve rakip adları kod yorumlarında; başka sözlük kodda taranmaz. |

### 5.2 Bilinçli olarak tasarımdan çıkarılan 5 en cazip ihlal (bu belgenin alanı)

1. **"Karakter öyle konuşur" NPC muafiyeti (Taksici siyaset konuşur, Dayı bölge anlatır, Barış küfreder).** D-062 ile en komik malzeme burada; TR taksici klişesi siyasetsiz olmaz denir. Çıkarıldı: `DL-01/02/05` muaf tutulamaz; Taksici'nin komedisi güzergâh ve hikâyeye taşındı; Barış'ın küfrü BÜYÜK HARF oldu. Gerekçe: NPC balonu ekran görüntüsüdür ve TCK 216/301 "karakter dedi" savunması tanımaz.
2. **Gerçek takvimle oynayan günlük olay ("Günün Günü" 10 Kasım'da sessizlik gag'ı, 6 Şubat'ta "kötü gün").** D-061 takvimi + Wordle seed'i bunu davet eder. Çıkarıldı: `RL-31` hassas gün listesi, o günlerde nötr havuz, koç tarih yorumlamaz; takvim yalnızca haftanın günü + gün sayısı gösterir (D-ÖNERİ-08-19).
3. **Alkol/uyuşturucu kotasını "sık"a bırakıp 18+ beyan etmek (T9'un önerisi).** İçerik yazarı için en rahat yol. Çıkarıldı: D-037 16+ bağlayıcı; `QT-01..03` sayısal; kota aşımı muaf tutulamaz; 18+ ancak yeni D-kaydıyla.
4. **Anne'yi roast malzemesi yapmak ("annen cahil", kilo yorumu, ANNE ARIYOR'da hakaret).** Aile komedisinin en kolay damarı. Çıkarıldı: `DL-03`; Anne'nin hedefi durum; ANNE ARIYOR juice'tur, Anne kaygılıdır. Gerekçe: Apple 1.1 "mean-spirited", TR'de aile değerleri şikâyeti, T9 DİKKATLİ-Aile.
5. **Yardım ekranında koç sesi ("Terapi pahalı, ben bedavayım") ve ziyaret analitiği.** Tonu korur, "ne kadar işe yaradı" ölçer. Çıkarıldı: ekran koç-sessiz; ziyaret ölçülmez; reklam/mağaza derleme zamanında yok. Gerekçe: D-052, Google self-harm, KVKK veri minimizasyonu, Apple "creepy".

Ek olarak çıkarılanlar: LLM'in `block` üretmesi (açıklanamaz sansür + yanlış negatif riski) · "+18 ağız" modu · serbest metin ad girişi (NG-05) · şive yazımı (eye-dialect) · gerçek banka/marka parodisi "karıştırılamaz" savunmasıyla (SMK 6769 m.6/5) · gerçek-kişi listesinin uygulamaya gömülmesi.

### 5.3 Uyum haritası (kısa)

Gerçek kişi/marka/din/etnisite/siyaset: `RL-01..06`, `DL-01/02`, muaf tutulamaz · Atatürk/ulusal: `RL-02` simetrik TR/EN · askerlik: `RL-14/15`, EN'de olay yok · madde: `RL-09/10` + `QT-01..03/08` · kumar: `RL-11/12`, simüle kumar yok beyanı · intihar: `RL-08` tüm kapsamlar, yardım ekranı §2.5, Google self-harm · cinsellik: `RL-19/21` kapı kapalı, NPC ≥ 18 · şiddet/suç: `RL-20`, `QT-05`, şiddetsiz seçenekler · kurum genellemesi: `RL-16` + `R5` · rüşvet: `RL-13` kod dahil · para/makro: `RL-17/18` · gerçek hayat: `RL-22`, `DL-04` · küfür: `TN-11`, `QT-07`, NPC balonunda sıfır · metadata: `ST-01..10`, 4+ vitrin, Families dışı · reklam: AdMob T, rıza varsayılan kapalı, ölümde reklam yok · KVKK: ayrı aydınlatma/rıza kartları, veri envanteri tek kaynak, yardım ekranı ölçümsüz · 7578: 16+ beyan + BTK takibi · karanlık tasarım: §2.7 on kalıp.

---

## 6. Ölçüm ve kabul kriterleri

### 6.1 Lint CI çıktı formatı

**`lint-report.json`** (deterministik, her modda):

```json
{
  "version": "1.0",
  "mode": "release",
  "generatedAt": "2027-02-11T09:38:12Z",
  "input": { "units": 1912, "locales": ["tr", "en"], "contentHash": "sha256:…", "redlinesLock": "sha256:…" },
  "summary": { "block": 0, "warn": 7, "info": 23, "exempted": 11, "durationMs": 7400 },
  "coverage": {
    "unitsScanned": 1912, "unitsTotal": 1912,
    "rulesActive": 71, "rulesTotal": 71,
    "scopes": { "coach": 1402, "event": 388, "npc": 1160, "choice": 1204, "push": 40, "store": 2, "creative": 6, "name": 2, "docs": 14, "skip": 24 },
    "reviewApproved": 1912, "tierASecondReview": 311, "lawyerSampled": 96
  },
  "quotas": [{ "id": "QT-01", "value": 0.031, "limit": 0.04, "status": "ok" }],
  "findings": [{
    "ruleId": "RL-16", "severity": "warn", "unitId": "ev-0412", "locale": "tr", "path": "tr.body",
    "excerpt": "…", "reason": "olası genelleme (3)", "suggestion": "…",
    "legalBasis": ["TCK 216", "T9 §5c-12"], "exemptedBy": null
  }]
}
```

**SARIF 2.1.0:** `tool.driver.name = "motto-content-lint"`, her kural `rules[]`'da `id`, `shortDescription.{tr,en}`, `help.text` (dayanak + "hukuki tavsiye değildir"), `properties.legalBasis[]`; bulgular `results[]` (`level: error|warning|note`), `locations[].physicalLocation.artifactLocation.uri` = JSON dosyası, `region` = JSON Pointer satırı; muafiyetler `suppressions[]` (`kind: inSource`, `justification` = reason). GitHub Code Scanning'e yüklenir; PR'da satır içi görünür.

**Konsol:** §3.5 biçimi; renk; TR/EN açıklama `LINT_LOCALE` ile. **PR yorumu:** özet tablo (block/warn/info/exempted + kota tablosu + "en çok tetiklenen 5 kural").

### 6.2 Kapsama ve kalite metrikleri (11'in KPI ağacına girer)

| Metrik | Hedef | Kaynak |
|---|---|---|
| Birim kapsaması (`unitsScanned / unitsTotal`) | %100 (eksik locale dahil; eksik locale `SC-01` ile zaten `block`) | `lint-report.json` |
| Kural kapsaması (katalogdaki her kural en az bir test birimiyle tetiklenir) | %100; `content-lint/test/fixtures/<ruleId>.{tr,en}.json` zorunlu | Paket testi |
| Release dalında `block` | 0 | CI |
| Açık `warn` (release) | ≤ 10 ve hepsi imzalı | RV-06 |
| Muafiyet sayısı / aktif birim | ≤ %1; ortalama kalan süre ≥ 30 gün | Haftalık özet |
| Genelleme dedektörü recall / precision | ≥ %95 / ≥ %80 (200 cümle; 1.0'da 500) | Adversarial set |
| Yanlış pozitif oranı (incelemeci "yanlış" işaretlediği `block`) | ≤ %5 / sprint | PR etiketi `lint-false-positive` |
| Lint süresi (5.000 birim × 2 locale) | ≤ 20 sn CI; pre-commit < 2 sn | CI ölçümü |
| Determinizm | aynı girdi → aynı rapor byte'ı (%100) | Snapshot testi |
| Harness: `lowKeyif` penceresinde roast | 0 (%100 hayat) | H-QT-11 |
| Harness: Normal'de olay başına roast ≥ 1 (D-064) | ≥ %98 olay | H-QT-12 |
| Kota durumu (`QT-01..10`) | tümü `ok`; her içerik paketinde yeniden | Release raporu |
| Mağaza/kreatif lint | `ST-*` 0 `block`; her iki mağaza aynı vitrin | Release raporu |
| Yardım ekranı hat doğrulaması | ≤ 6 ay eski; 0 kırık link | Takvim görevi + CI HEAD (release) |
| Şikâyet / takedown / mağaza reddi | 0 (soft launch kapısı) | 11 |
| Avukat örneklemesi bulgu oranı | ≤ 2/100 birim; bulgu → kural güncellemesi | Çeyreklik |

### 6.3 Kabul kriterleri (numaralı, test edilebilir)

| AC | Kriter | Doğrulama |
|---|---|---|
| **AC-08-01** | `packages/content-lint` saf TS, ağ/LLM bağımlılığı yok; aynı girdi için `lint-report.json` byte düzeyinde aynı; 5.000 birim × 2 locale ≤ 20 sn CI'da. | Paket testi + snapshot + CI süre ölçümü |
| **AC-08-02** | Katalogdaki her `RL-/TN-/QT-/NG-/ST-/RV-/DL-` kuralı için TR ve EN pozitif + negatif fixture vardır; pozitif fixture `block/warn` üretir, negatif üretmez (%100). | `content-lint/test/fixtures` + coverage raporu |
| **AC-08-03** | Normalizasyon: `toLocaleLowerCase('tr')`, aksan katlama, ek toleransı, gizleme kırma (nokta/boşluk/leet) ve ICU placeholder maskeleme; "Ataturk", "A.K.P", "esrarrr", `{god}` fixture'ları yakalanır. | Birim testi |
| **AC-08-04** | Seed listeleri: TR ≥ 212, EN ≥ 219 terim/desen; özel listeler `slurs.tr ≥ 60`, `slurs.en ≥ 120`, `sexual ≥ 40/locale`, `realpersons ≥ 5.000/locale`; `redlines.lock` SHA'ları CI'da doğrulanır, uyumsuzluk `block`. | CI script |
| **AC-08-05** | `exemptable:false` kurallar hiçbir `lintExemptions` girdisini kabul etmez; `exemptable:true` kuralda `author === reviewer`, süresi dolmuş veya PR onaylayanla eşleşmeyen muafiyet `RV-03` `block`. | Birim testi + CI `GITHUB_EVENT` testi |
| **AC-08-06** | `--release`: `review.status !== 'approved'`, `reviewedRev < rev`, Tier A'da `secondReviewer` boş, `persona:kader\|lowKeyif\|help-screen\|store` birimlerinde `lawyerSampled:false` → `block` (RV-01/02/04/05). | Fixture seti |
| **AC-08-07** | `release-signoff.json` iki farklı rolde imza, rapor SHA'sı ve `openWarnings` eşleşmesi olmadan `--release` çıkış kodu 1 (RV-06). | CI testi |
| **AC-08-08** | Kotalar `QT-01..10` pool düzeyinde `--release`'te `block`, PR'da `warn`; `substance:*` etiketsiz alkol sözlüğü `RL-10` ile, etiketli ama kalıcı negatifsiz olay `QT-08` ile yakalanır (çapraz kilit). | Fixture + release denemesi |
| **AC-08-09** | Genelleme dedektörü adversarial sette recall ≥ %95, precision ≥ %80 (MVP 200 cümle; 1.0 500); "Memur bey formu üçüncü kez kaybetti" ve "The clerk lost everyone's form" `block` üretmez; "bu ülkede/this country" skor bağımsız `block`. | `test/generalization.{tr,en}.jsonl` |
| **AC-08-10** | NPC kapsamı: `DL-01..10` aktif; `speaker` enum dışı, ses imzası ihlali (Anne > 8 kelime/`?` yok, Yağmur > 3 kelime, Pamuk > 1 token), NPC balonunda `[sansür]`, NPC + "koç/Motto" aynı balonda, şive yazımı sözlüğü → `block`; Taksici/Dayı/Şükran Teyze fixture'larında siyaset/bölge/dinî ünlem yakalanır (ünlem `warn`). | Fixture seti |
| **AC-08-11** | "Gerçek hayatta yardım" ekranı: içerik §2.5 ile birebir, çevrimdışı, bölge sıralaması konum izni istemez, her hat `tel:`/`sms:` + web yedeği, ekranda ve protokol penceresinde `AdSlot/RewardedOffer/Store` derleme zamanında yok, ziyaret analitik olayı üretmez; `RL-08` ekran metninde 0 (kurum adı muafiyeti sabit). | Playwright + kod incelemesi + ağ kaydı |
| **AC-08-12** | lowKeyif/`despair` protokolünde harness'ta `isRoast` gösterimi 0, çıkış seçeneği her gösterilen günde ≥ 1, L-122 hayat başına ≤ 1, juice tetikleri (konfeti, EFSANE OLAY, ANNE ARIYOR, Teşhis çarpması) 0. | H-QT-11 + 03 harness |
| **AC-08-13** | Yaş derecesi: §2.6 cevap anahtarıyla doldurulan anketler Apple 16+ ve IARC PEGI 16/ESRB T üretir; AdMob `T`, `childDirected=false`, `underAgeOfConsent=false` `ST-09` ile CI'da doğrulanır; her içerik paketi release'inde kota raporu anket cevaplarını değiştirmez (değiştirirse release `block`). | Mağaza konsolu ekran görüntüsü + CI |
| **AC-08-14** | Mağaza/kreatif: `showcase:true` dışı satır metadata'da 0; `death\|alcohol\|tobacco\|illness\|crime\|profanity\|lowKeyif` vitrinde 0; D-049 adları, `RL-24/25` sözcükleri, "#1/en iyi" 0; Kader satırı mağaza/kreatif/ilk 60 sn'de 0; kreatif manifestinde `realGameplay:true`, `aiTestimonial:false`, `influencerAdLabel:true`; iki mağazada aynı vitrin satırları. | `ST-01..07` + FTUE testi + manifest kontrolü |
| **AC-08-15** | Hukuki belgeler: Gizlilik, Aydınlatma, Açık Rıza (ayrı), Koşullar, 16+ metni, kurgu feragatı, Lisanslar TR+EN sürümlü ve yayında; rıza kartı aydınlatmadan **ayrı**, toggle'lar kapalı başlar, "Reddet" eşit boyut; link kırıklığı release `block` (`ST-10`); data safety/Privacy Label `legal/data-inventory.json` ile eşleşir. | Playwright + CI HEAD + form karşılaştırma |
| **AC-08-16** | Nötr yaş ekranı: doğum yılı saklanmaz, < 16 kapanış metni TR/EN sabit, koç ağzında değil; Declared Age Range / Age Signals sinyali varsa aynı kapı; koç yaş bilgisini okumaz. | Kod incelemesi + cihaz testi |
| **AC-08-17** | `RL-13` kod kapsamı: `bribe*`/`rüşvet*` identifier/yorum/string `.ts/.json/.md`'de 0; `RL-24/25` sözcükleri `store/` ve `creatives/`'ta 0; rakip adları kod yorumlarında 0. | Repo tarama CI |
| **AC-08-18** | `RL-31`: hassas takvim günleri listesindeki tarihlerde "Günün Günü" seed olayı nötr havuzdan; hiçbir koç/NPC satırı takvim tarihini (gün + ay) yorumlamaz; kart başlığında yalnızca gün sayısı + haftanın günü. | Harness tarih senaryosu + lint |
| **AC-08-19** | `--docs` modu: `docs/**/*.md` içinde `RL-01/02/04/05/08/13` 0 `block`; yasak örnekler `[köşeli parantez]` içinde (soyutlama kontrolü); bu belge dahil tüm tasarım dokümanları geçer. | CI |
| **AC-08-20** | Karanlık tasarım: §2.7'nin 10 kalıbı için UI snapshot/Playwright testi veya şema-yokluğu kanıtı; "Hayır" düğmesi boyut/kontrast eşitliği ölçülür; sahte aciliyet/sayaç deseni `ui` kapsamında 0. | 07 test paketi + lint |
| **AC-08-21** | İnsan inceleme: her olay PR'ında 10 soruluk kontrol listesi şablonu doldurulmuş; Tier A çift onay; avukat örneklemesi oranları (%10 Tier A, %100 Kader/yardım/mağaza/crime/drugs) `lint-report.coverage` ile raporlanır; haftalık kuyruk > 40 → yeni içerik PR'ı `block`. | PR şablonu + CI |
| **AC-08-22** | Çıktı biçimleri: `lint-report.json` şema-geçerli (`schemas/lint-report.schema.json`), SARIF 2.1.0 GitHub'a yüklenir ve PR satır içi görünür, konsol TR/EN; PR yorumu özet tablo + kota tablosu. | CI + şema doğrulama |

---

## 7. Açık sorular, riskler ve D-ÖNERİ listesi

### 7.1 Açık sorular

1. **16+ vs T9'un 18+ önerisi (00 açık soru 2):** Apple "seyrek alkol/uyuşturucu" eşiğinin sayısal rehberi yok; `QT-01..03` bizim iç tanımımız. Avukat + ilk App Review sonucu; 16+ reddedilirse içerik değişmeden 18+ beyanı için yeni D-kaydı gerekir (D-037 değişikliği). **Avukat.**
2. **7578/BTK yönetmeliği:** IARC/mağaza derecesi tanınacak mı; geliştiriciye doğrudan bildirim yükümlülüğü var mı; ulusal sınıf gerekirse içerik aynı kalır, beyan değişir. **Avukat**, çeyreklik.
3. **TR'de aktif ulusal kriz hattı:** doğrulanamadı; findahelpline yönlendirmesi geçici. Sprint 0'da yeniden doğrulama; bulunursa `help.tr.line` güncellenir (Tier A + avukat).
4. **Gerçek-kişi listesinin KVKK statüsü:** kamuya açık Wikidata verisi, CI'da eşleme amaçlı; aydınlatma metnine girer mi, saklama süresi? **Avukat.**
5. **SDK sağlayıcı standart sözleşmeleri (AdMob, RevenueCat, Firebase):** Türkiye için hazır KVKK standart sözleşmesi var mı; yoksa hangi hukuki sebep? **Avukat**, lansmandan 6 hafta önce.
6. **Kreatif tagline "Bets against you" (00 §0.3):** `RL-12` koç ağzında "bet" yasağıyla çelişiyor gibi görünür; bu belge taglines'ı `creative` kapsamında **marka metni** sayar, koç satırı değil (D-ÖNERİ-08-16). Teyit: 00 sahibi.
7. **Sınıflandırıcı v2 (1.0):** küçük model `warn` üretecek; modelin kendisi repoda mı, lisansı, TR performansı; `block` asla üretmeyeceği garanti mimaride (kural tabanlı katman ayrı). 10 ile.
8. **Apple Declared Age Range / Play Age Signals** sinyalleri < 16 dönerse kapanış mı, yalnızca uyarı mı; sinyalin güvenilirliği ve KVKK tarafı. 07 + avukat.
9. **Şive yazımı yasağı (DL-02) komediyi fazla mı törpülüyor?** Playtest'te NPC "aynı sesle konuşuyor" işareti çıkarsa ses imzaları (büyük harf, üç kelime, soru işareti) güçlendirilir; şive geri gelmez.
10. **Teşhis etiketleri (30 → 120, D-063)** `kind: 'diagnosis'` olarak Tier A; klinik terimle örtüşmeme kuralı (`RL-26` taksonomi) 120 etikette yazar alanını daraltıyor; 05 ile ortak sözlük.

### 7.2 Riskler

| Risk | Belirti | Azaltma |
|---|---|---|
| Yanlış negatif: lint geçmiş bir satır şikâyet alır | Mağaza şikâyeti, sosyal medya ekran görüntüsü | Kural tabanlı `block` + insan 10 soru + avukat örneklemesi; şikâyet → 24 saatte EAS Update ile içerik yaması (10) + kural ekleme (postmortem zorunlu) |
| Yanlış pozitif yorgunluğu: yazarlar lint'i "aşmaya" çalışır | Muafiyet talebi artışı, soyut dil kayması | Precision hedefi ≥ %80; `lint-false-positive` etiketi sprint ritüeli; muafiyet oranı ≤ %1 alarmı |
| NPC katmanı (D-062) içerik hacmini 2× artırır, inceleme darboğazı | Kuyruk > 40, `needs-review` birikimi | Tier B tek onay; `DL-08` şema kontrolü yazarın elinde (IDE eklentisi, 10); kuyruk tavanı |
| D-064 roast dozu ↑ → Apple 1.1.1 "mean-spirited" | App Review reddi | Hedef daima karar (`TN-09/12`); `showcase` vitrin ayrı; inceleme notu; Acımasız havuzu da lint'ten geçer |
| Gerçek takvim (D-061) hassas gün çakışması | Oyuncu "10 Kasım'da şaka yaptı" paylaşımı | `RL-31`, nötr havuz, tarih yorumsuz; kart başlığında ay/gün yok |
| Blocklist sızıntısı (özel listeler ekran görüntüsü) | "Şirket şu listeyi tutuyor" haberi | `private/` düzeni, README'siz, erişim kısıtlı repo; dokümanda soyutlama |
| Yardım hattı numarası değişir | Kırık link, yanlış numara | 6 aylık görev; release'te HEAD kontrolü; findahelpline yedeği her zaman |
| Kota "seyrek"i App Review farklı okur | 16+ reddi, 18+ zorlaması | Açık soru 1; kotalar daraltılabilir (QT-01 %4 → %2) içerik silmeden (`substance` etiketi kaldırılıp nötrleştirme) |
| Linter hızı içerik büyüdükçe bozulur (1.0: 5.000+ birim) | CI > 20 sn | Trie/Aho-Corasick; `--changed-only` PR'da; release tam tarama |
| Avukat kapasitesi (çeyreklik check-in, örnekleme) | Release gecikmesi | Örnekleme oranları sabit, seed'li; avukat çıktısı `lawyerSampled` alanında, tekrar okuma yok |

### 7.3 D-ÖNERİ listesi (00'ın kapsamadığı kararlar; onaylanırsa 00 §11'e D-kaydı olur)

| ID | Karar | Gerekçe |
|---|---|---|
| **D-ÖNERİ-08-01** | "Seyrek" kotaları sayıya bağlanır: alkol ≤ %4 havuz / ≤ 3 gösterim medyan; tütün ≤ %2; uyuşturucu ≤ %1 ve ≤ 8 olay/locale; kumar anlatısı ≤ %1,5; suç ≤ %5; sansürlü küfür ≤ 3/100; kota aşımı release `block`, muaf tutulamaz. | D-037 "seyrek" der, sayı vermez; Apple anketinin savunulabilir iç dayanağı. |
| **D-ÖNERİ-08-02** | Muafiyet birime gömülü, `author ≠ reviewer`, PR onaylayan = reviewer, ≤ 180 gün, yalnızca `exemptable:true` kurallarda; süresi dolan muafiyet `block`a döner. | D-047 lint'i "bloklar" der, delme mekanizmasını tanımlamaz. |
| **D-ÖNERİ-08-03** | Hakaret/cinsel/gerçek-kişi listeleri `content/redlines/private/`'da, `docs/` dışında, README'siz; CI SHA doğrular; dokümanlar yasak örnekleri köşeli parantezle soyutlar ve `--docs` lint'inden geçer. | Linter'ın kendisi hakaret kaynağı olmasın. |
| **D-ÖNERİ-08-04** | Gündelik dinî kökenli ünlemler ("inşallah/maşallah/vallahi", "oh my God/OMG") koç satırında `block`, NPC satırında `warn` + incelemeci muafiyeti; Şükran Teyze dahil "Allah" sözcüğü hiçbir biçimde yok. | Yerli NPC sesi için gerekli, dua/ibadet göndermesi değil; K3 sıfır toleransı korunur. |
| **D-ÖNERİ-08-05** | "Türkiye/Türk/Turkish" ve "America/American" oyun metninde geçmez; dil adı yalnızca Ayarlar UI'ında; şehir adları yalnızca `geo-neutral` etiketle ve nötr bağlamda. | 00 "kurgusal ülke" der; sözcük düzeyinde kural gerekiyordu. |
| **D-ÖNERİ-08-06** | `release-signoff.json`: iki farklı rolde imza (içerik sahibi + hukuk irtibatı), rapor SHA'sı, açık `warn` sayısı; tag ile repoda kalır. | Açık `warn`'ların "okundu" kanıtı; publisher indemnity için ispat. |
| **D-ÖNERİ-08-07** | Yardım ekranı protokolü: tetik `lowJoy ∨ despair ∨ Keyif ≤ 10 × 2 yıl`; roast ve juice tetikleri kapalı; her gösterilen günde ≥ 1 çıkış seçeneği; L-122 hayat başına 1; ekran ziyareti **ölçülmez**; reklam/mağaza derleme zamanında yok; hat içeriği bölgeye göre statik, 6 ayda bir doğrulanır. | D-052 ekranı adlandırır, protokolü ve ölçüm yasağını tanımlamaz. |
| **D-ÖNERİ-08-08** | Küfür yalnızca olay metninde evren-içi sansürlü (`[sansür]/[redacted]`), ≤ 3/100; koçta ve NPC balonunda sıfır; slur özel listesi her yerde `block`; "+18 ağız" yok. | 00 "sansürsüz küfür ASLA" der; sansürlü biçimin yeri belirsizdi. |
| **D-ÖNERİ-08-09** | Oyuncunun seçebildiği suçlar yalnızca şiddetsiz liste (K11); `pCaught ≥ 0,35`, `EV < 0`, kalıcı sonuç; şiddet yalnızca başa gelen olay; silah edinme seçeneği yok; organize suç kariyeri yok. | T9 DİKKATLİ-Suç'u seçenek düzeyinde kurala çevirir. |
| **D-ÖNERİ-08-10** | Nötr yaş ekranı: doğum yılı seçici, veri saklanmaz, koç ağzında değil, < 16 kapanış; Declared Age Range / Age Signals sinyali aynı kapıyı tetikler; koç yaş bilgisini okumaz. | Families/7578 uyumu + D-050. |
| **D-ÖNERİ-08-11** | `RoastTarget = character \| coach \| situation \| npc`; `player` ve `society` değerleri şemada **yok**; koç satırı ve cevap balonu (`choice`) için zorunlu; `npc` hedefi korunan grup etiketi taşıyorsa `block`. | D-050'yi şema düzeyinde imkânsızlaştırır. |
| **D-ÖNERİ-08-12** | Tier A tanımı (demo + karne/motto/iddia/Roast/Teşhis + showcase + Kader + yardım + mağaza) ve çift onay; avukat örneklemesi %10 Tier A / %100 Kader, yardım, mağaza, crime, drugs. | 00 "avukat örneklemesi" der, oranları vermez. |
| **D-ÖNERİ-08-13** | İnceleme borcu tavanı: haftalık kuyruk (açık `warn` + `needs-review` + süresi dolan muafiyet) > 40 birim → yeni içerik PR'ı `block`. | Lint'in "sonra bakarız" ile aşınmasını önler. |
| **D-ÖNERİ-08-14** | Uyuşturucu yalnızca maruz kalma/referans; karakter hiçbir seçenekte kullanmaz; madde adı yok; tuzak sonuçları (baskın, gözaltı, arkadaş hastanede). | TCK 190/2 + Apple 1.4.3; K8'i seçenek düzeyinde kapatır. |
| **D-ÖNERİ-08-15** | Mağaza ikon/ekran görüntülerinde Pamuk/Biscuit ve sevimli maskot kullanılmaz; ikon tipografik (damga/defter). | Google "istemeden çocuklara cazip" + Families dışı tutarlılık. |
| **D-ÖNERİ-08-16** | 00 §0.3 kreatif tagline'ları ("Bets against you / Sana karşı iddiaya girer") `creative` kapsamında marka metnidir; `RL-12` koç/push/store kapsamında kalır; mağaza açıklamasında "wager" kullanılır. | Tagline ile koç kuralı çelişkisini çözer. |
| **D-ÖNERİ-08-17** | NPC diyalog kuralları `DL-01..10` (D-062): gerçek kişi/marka/din/siyaset NPC'de de yasak, şive yazımı yok, Anne sevilir ve hakaret etmez, NPC 4. duvar/koçla konuşmaz, NPC balonunda sansürlü dahi küfür yok, Doktor/İK/kurye marka-teşhis söylemez; `speaker` enum; ses imzası şema kontrolü; Taksici siyaset konuşmaz. | D-062 NPC seslerini açar, kırmızı çizgilerini tanımlamaz. |
| **D-ÖNERİ-08-18** | D-064 roast dozu lint'e bağlanır: harness `QT-12` Normal'de olay başına ≥ 1 roast (lowKeyif/sessizlik hariç); `TN-12` cevap balonu/seçenek etiketi roast hedefi `character\|situation`; Acımasız havuzu aynı kurallardan geçer. | Doz artışı ile T9 çizgilerinin aynı anda tutulması. |
| **D-ÖNERİ-08-19** | `RL-31` hassas takvim günleri (TR: 6 Şubat, 17 Ağustos, 10 Kasım, 15 Temmuz, 19 Mayıs, 23 Nisan, 29 Ekim, 30 Ağustos; EN: 11 Eylül, 4 Temmuz, 25 Aralık ve ulusal anma günleri): o tarihe düşen "Günün Günü" seed olayı nötr havuzdan; koç/NPC takvim tarihini yorumlamaz; kart başlığı yalnızca "Gün N · haftanın günü". | D-061 takvimi + D-065 Wordle seed'i gerçek tarihle çakışır; K6/K19 koruması. |
| **D-ÖNERİ-08-20** | Yeni `ST-08` (rıza/aydınlatma tek ekran-tek buton), `ST-09` (AdMob/mediation etiketleri CI'da), `ST-10` (hukuki link HEAD kontrolü release'te) kuralları kataloğa eklenir. | §2.4/§2.6/§4'ün otomatik doğrulanabilir hâli. |

### 7.4 Diğer dokümanlarla çelişki kayıtları (bu belge 00'ı uyguladı)

- T9 "18+ beyanı" → D-037 **16+**; kotalar "seyrek"i sağlar; açık soru 1.
- T9 §5e "anlatıcı tek satır: 'terapiye gidiyor, sen de gidebilirsin'" → D-052 şakasız devir (L-122) + koç-sessiz ekran; koç hat söylemez.
- T9 §5c-3 "hedef sınıflandırması LLM" → bu belgede `block` yalnızca kural tabanlı; LLM yalnızca v2 `warn`.
- T9 §5c-14 "aptal/gerizekalı karaktere → insan incelemesi" → `ability_body.txt` 2. tekil `block`; karaktere "aptalca karar" serbest, "aptal" etiketi değil.
- 01 §5.1 lint numaraları (#1–#46) → bu belgenin `RL-/TN-` kimlikleriyle eşlenir; 01 bir sonraki revizyonda kimlikleri günceller (eşleme tablosu `content-lint/docs/legacy-ids.md`).
- 07 §2.2.8 yardım ekranı metni → §2.5 içeriği kanonik; 07 görsel spec'i korur; hat listesine CA/NZ/AU eklendi.
- 02 §2.4.7 `lowJoy` eşiği (Keyif < 25 / 35) ile 01 D-ÖNERİ-06 (Keyif ≤ 10 iki yıl) → bu belge ikisini **birleşik tetik** sayar (§2.5 protokol 1); 02/01 uyumlanır.
- 00 §0.3 kreatif tagline "Bets against you" ↔ `RL-12` → D-ÖNERİ-08-16.
- 12 §1 "emoji'li Karne paylaşımı" ↔ 00 §1.2 "emoji anlatıcı metninde ASLA" → emoji yalnızca paylaşım kartı UI katmanında (6 sabit glif), koç/NPC metninde yok.

*Sonraki adım: 09 (`content-lint` paketinin ev sahibi; `SC-*` + bu belgenin kataloğu tek `rules/` dizininde), 10 (CI entegrasyonu, SARIF yükleme, `redlines.lock`, `data-inventory.json` üretimi), 03 (`dialog[]` şeması + `speaker` enum + `QT-12` harness kancası), 04 (NPC ses kitabı `DL-*`'yi yazar yüzüne çevirir), 11 (§6.2 metrikleri KPI ağacına).*
