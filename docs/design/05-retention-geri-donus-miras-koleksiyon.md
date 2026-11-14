# 05 — Retention, Geri Dönüş, Miras ve Koleksiyon Sistemleri

> **Belge türü:** Ayrıntılı sistem tasarımı (Motto tasarım paketi, doküman 05/11). Üstünde `00-VIZYON-ve-KARARLAR.md` (D-001..D-065; §12 > §11) ve T9 (hukuk) vardır; bu belge D-kararlarını **uygular**, tartışmaz. 00'ın kapsamadığı yerde karar verir ve bunu **D-ÖNERİ-05-xx** olarak işaretler (§7.3).
> **Sahip olduğu sistemler:** Mola ritüeli / streak · Koç Görevleri · Antrenman Kampı + hayali kohort · bildirim spec'i · welcome-back ("Sakatlık Raporu") · Kondisyon (miras) perk'leri ve Yedek Kulübesi pity · Fazla Bagaj · Tanışıklık'ın kullanım yüzeyi · Teşhis koleksiyonu (30 → 60 → 120) · Sözlük koleksiyonu + Mottolar albümü · Onyıl Karnesi ekranı · paylaşım kartları (Kamp, Lally, Teşhis, Sözlük, Onyıl) ve HYT/KMP seed kodları.
> **Durum:** v1.0 · 2026-11-06 · Yazar: Retention/Meta sistem tasarımcısı · Girdi: 00 (tümü, §12 dahil), T7 (tam), T1 (tam), T11 ve T9 (TL;DR), A1–A4 konseptleri (Mola, Kamp, Kondisyon, Fazla Bagaj, Teşhis örnekleri), 01/02/07/10 dokümanlarının arayüz satırları.

---

## 0. Künye — uygulanan D-kararları, bağımlı dokümanlar, sürüm

### 0.1 00 §5'teki satırımız

| # | Dosya | Sahip olduğu sistemler | 00'daki ana karar |
|---|---|---|---|
| 05 | `docs/design/05-retention-geri-donus-miras-koleksiyon.md` | Mola ritüeli/streak, Koç Görevleri, Antrenman Kampı + hayali kohort, bildirim spec'i, welcome-back, Kondisyon (miras) perk'leri, Fazla Bagaj, Teşhis koleksiyonu (60 → 120), Sözlük koleksiyonu, Onyıl Karnesi | D-018, D-019, D-029–D-031, D-042, D-051, D-056, D-058 |

### 0.2 Uygulanan D-kararları (her biri → bu belgedeki somut tasarım öğesi)

| D | Karar (kısa) | Bu belgede nasıl uygulandı |
|---|---|---|
| **D-018** | Fazla Bagaj: önceki hayatın en yüksek Cringe olayı etiket olarak biner, 1 callback açar; atılamaz/satılamaz/cezasız; 3 hayat aynı → Kronik | §2.7: `Baggage` tipi, `pre.meta.baggage` kapısı, Müşteri Dosyası'nda "Fazla Bagaj: 1" satırı, callback olay sözleşmesi, 3-hayat kuralı Kronik hesaplayıcısına bağlandı |
| **D-019** | Antrenman Kampı `hash(YYYY-WW + locale + contentHash)`; 40 hayali kohort her kartta "hayali/fictional" etiketiyle; KMP-XXXX; Pazartesi 00:00 yerel | §2.3: seed formülü, 16 tema rotasyonu, kohort üretimi (headless motor, bot politikaları), skor formülü, kıyas kartı şablonu, etiket zorunluluğu lint'e |
| **D-029** | Streak = Mola ritüeli; karar bazlı; duraklar/sıfırlanmaz; 2 Sakatlık İzni (7 günde 1); 48 sa Telafi ücretsiz; hafta sonu opsiyonel; 3/7/14/21/30/66/100/365; 66 = Lally günü; asla satılmaz | §2.1: `StreakService` durum makinesi, iki sayaç (`days` toplam / `run` kesintisiz rekor), İzin otomatik, Telafi yalnızca `run`'ı korur, kilometre taşı kozmetikleri, Lally kartı |
| **D-030** | Bildirim ≤ 1/gün, ≤ 5/hafta, 22:30–09:00 sessiz, yalnızca yerel; kopya zarftan/koçtan; 3 yoksayma → 7 gün sessiz; lapsed'de Duolingo tersliği; "Beni rahat bırak"; soft-ask ilk "Bugünlük yeter" (≥ 8 dk); Android izni 2. oturumdan önce asla | §2.4: `NotificationPlanner.replan()` ritüeli, öncelik sırası, tavan filtresi, merdiven D0..D30 + lapsed, 40 satırlık kopya havuzu (karakter mesajı + koç), soft-ask akışı, platform kuralları §4 |
| **D-031** | Welcome-back = Sakatlık Raporu: gerçek yokluk → oyun zamanı, 40 sn, atlanabilir, büyük karar rafta, geri dönülemez kayıp yok, ödül sabit | §2.5: `AbsenceEngine.resolve()` çevrim tablosu (gün bazlı, D-061), 3–6 kart, 7 gün ödül tavanı, 14+ gün "büyük bekleyen karar", Atla her zaman görünür |
| **D-042** | Kondisyon çeşitlilik verir, güç vermez; şehir, karne teması, Hedefsiz bonus olay, Sessiz Sezon, başlangıç kariyer seçenekleri, kedi; log sıkıştırmalı eğri | §2.6: 10 perk'lik liste (MVP 3), puan formülü `6·ln(1 + yıl/12)`, eşik tablosu, "güç testi" (hiçbir perk stat/Para/hazard/oran değiştirmez) |
| **D-051** | Onyıl Karnesi yalnızca karar kalemleri; kimlik kalemi yok; zorunlu lift gerçek Kondisyon puanı; koç listeyi okur, savunmaz | §2.9: ekran sözleşmesi (doc 02 şemasını okur), "Onyılın Mottoları" şeridi, lift → `fitness.points`, paylaşım kartı |
| **D-056** | Ölüm = içerik: her ölüm ≥ 1 açılım + Teşhis + Defter sayfası + Fazla Bagaj | §2.6.4 Yedek Kulübesi pity, §2.8 ölümde Teşhis değerlendirmesi, §2.7 bagaj yazımı; hepsi `lifeEnded` efektinin tek işleyicisinde |
| **D-058** | Gizli Tanışıklık 0–5 yalnızca daha sıcak nadir satırları açar; güç vermez | §2.6.5: doc 01 §2.6 tanımını **okur**; bu belge yalnızca welcome-back ve kilometre taşı satırlarında hangi seviyenin hangi varyantı açtığını belirler |
| **D-061** (§12) | Zaman birimi GÜN; her gösterilen günde bir olay; doğum günü = karne | Mola = günün ilk gün kartı; welcome-back çevrimi **gün** cinsinden (§2.5.1); Kamp hayatı gün sıkıştırmasıyla; Koç Görevleri "bugün/bu yıl" dilinde |
| **D-062** (§12) | Karakterler konuşur; NPC balonları; koç ayrı katman | Bildirimler **karakter mesajı** biçiminde (başlık = NPC adı, gövde = balon); koç satırları ayrı havuz; Sakatlık Raporu kartları NPC balonu taşıyabilir |
| **D-063** (§12) | Teşhis etiketi çarpması, tam ekran damga, SFX | §2.8.6: Teşhis veriliş anı juice sözleşmesi (doc 07 sürelerine uyar; reduced-motion'da kapanır) |
| **D-064** (§12) | Roast dozu yükseldi; kimliğe değil karara vurur | Mola/kilometre taşı/Kamp satırlarında roast kotası Normal'de ≥ 1; Teşhis adları yine yargısız (ad ≠ roast; roast satırda) |
| D-010 / D-022 | 12 kozmetik damga varyantı; Yılın Mottosu 36 hücre | Kilometre taşı ödüllerinin bir kısmı damga varyantı; Mottolar albümü 36 hücrelik ızgara (§2.9.2) |
| D-011 | Zarf = pending-outcome nesnesi; bildirim zarftan türer | Bildirim öncelik 2 = "bekleyen zarf" karakter mesajı |
| D-014 | Okunmamış sayacı; "Görüldü, cevap yok"; Teşhis "Okundu Bırakan" | Teşhis #05 tetikleyicisi `seenNoReply ≥ 10`; bildirim N-09 |
| D-016 | Ölüm → yeni hayat ≤ 40 sn; ≥ 1 Kondisyon açılımı; "Aynı kondisyonla" | §2.6.4 pity; "Aynı kondisyonla" perk seçimini kopyalar |
| D-050 | Gerçek-zaman satırları oyuncunun gerçek davranışını yorumlamaz | Bildirim ve welcome-back satırlarında özne daima karakter/NPC/koç; "sen yokken" = "karakter sen yokken"; lint §5 |
| D-055 | Enerji yok, giriş ödülü yok, sahte sayaç yok, paralı streak yok | Koç Görevleri oynayınca açılır (giriş ödülü değil); Kamp geri sayımı takvimdir; hiçbir §2 öğesi satılmaz |
| D-060 | Hiyerarşi; D-kararları tartışılmaz | Çelişkiler §7.4'te kayıt altına alındı, çözüm 00 lehine |

### 0.3 Bağımlı dokümanlar (arayüz sözleşmeleri)

| Doküman | Bu belgeden ne alır | Bu belgeye ne verir |
|---|---|---|
| **01** Anlatıcı | Kilometre taşı / Kamp / welcome-back satır **bağlam etiketleri** (`ctx: 'mola.milestone.66'` vb.), bildirim kopyasının register'ı | Koç satır havuzu (P-01..P-30 bildirimleri §3.4), Tanışıklık seviyeleri (§2.6), sessizlik kuralı, ses ayarı varyant kuralı |
| **02** Zaman/stat | `advanceTime({ days })` aksiyonu (welcome-back), `fitness.points` yazımı (Onyıl lift), `lifeEnded` → bildirim iptali | `LifeRecord` (metaLog girdisi), `highestCringeEvent` (Fazla Bagaj), `DecadeReview` şeması, `pendingDeathRisk` kuralı |
| **03** Olay motoru | `pre.meta.baggage`, `pre.meta.campTheme`, `pre.meta.kondisyon[]` kapıları; Koç Görevi `questTag` etiketi seçeneklerde; Kamp tema kısıtı (seçenek kilidi / fiyat çarpanı) | `patterns` sayaçları (Teşhis tetikleri), `EnvelopeQueue` (bildirim kopyası), olay `rarity`, `wager` isabet sayıları |
| **04** Kariyer/NPC | Welcome-back kartlarında NPC balonu isteği (`npcLine(role, ctx)`), bildirim NPC ses kuralları, Fazla Bagaj callback olayının NPC'si | NPC ses kitabı (Anne kısa-soru işaretli, Barış BÜYÜK HARF, Nevin Hanım İK dili, Yağmur üç kelime, Pamuk tek kelime), `metaMemories`, Okunmamış sayacı |
| **06** Monetizasyon | "Satılmaz" listesi: streak, İzin, Telafi, Kondisyon, Teşhis, Kamp skoru | Torpil'in karne temaları (Kondisyon temasıyla çakışmaz: ayrı set), Sezon Paketi'nin +12 Kamp teması |
| **07** UX/UI | Mola ekranı, Kamp sekmesi, Teşhis duvarı, Sözlük/Mottolar, Onyıl Karnesi ekran **içerik sözleşmeleri**; 5 paylaşım kartının metin alanları | `ShareCard` şablon motoru (9:16 + 1:1), juice süreleri, Sakatlık Raporu ekran iskeleti (§3.5), Kamp kıyas kartı düzeni (§3.6) |
| **08** Lint | Yeni kurallar: "hayali/fictional" etiketi zorunlu, bildirimde gerçek-hayat yorumu BLOK, Teşhis adı yasak sözlüğü, Koç Görevi'nde gerçek dünya fiili BLOK | Yasaklı kelime listeleri, kurum-genellemesi dedektörü |
| **09** i18n | Teşhis adları, Koç Görevleri, bildirimler, Kamp tema adları **locale başına ayrı** havuz | ICU/`trInflect()`, buton bütçesi |
| **10** Teknik | `engine/streak`, `engine/legacy`, `services/notifications`, `clock/trusted`, `effects: notification-plan / notification-cancel-all / ask-consent` | Tipler (`Streak`, `Legacy`, `Collections`), `RESUME{nowWall, nowMono, localDay, isoWeek}`, güvenilir saat kuralları §2.4.13 |
| **11** KPI | §6.1 KPI satırları ve `AnalyticsPort` olay adları | KPI ağacı, soft launch kapıları |

### 0.4 Sürüm

v1.0 (2026-11-06). Değişiklik yalnızca bu dosyada ve yeni D-kaydıyla; §7.3'teki D-ÖNERİ'ler 00'a alınınca buradaki numaralar korunur, "D-ÖNERİ" etiketi düşer.

---

## 1. Amaç ve kapsam — MVP (vertical slice) / Soft launch / 1.0 kapsam farkları

**Amaç.** Bu belgenin işi, oyuncunun oyunu kapattığı andan tekrar açtığı ana kadar olan boşluğu ve bir hayatın bittiği andan sonrakinin başladığı ana kadar olan boşluğu doldurmaktır. İlkinin adı **geri dönüş** (Mola, bildirim, Sakatlık Raporu, Kamp), ikincisinin adı **miras** (Kondisyon, Fazla Bagaj, Tanışıklık, Teşhis, Sözlük, Onyıl Karnesi). İkisinin de tek ölçüsü vardır: oyuncu geri geldiğinde "beni bekleyen bir şey vardı" demeli, "beni cezalandıran bir şey vardı" değil. T1'in hiyerarşisi bağlayıcıdır: SDT (özerklik, yeterlik, ilişki) temel; kayıptan kaçınma yalnızca "duraklatılan" streak'te ve "içeriğe dönen" ölümde; sahte aciliyet, enerji, giriş ödülü, paralı streak hiçbir sürümde yok (D-055).

**Beş tasarım ilkesi (bu belgeye özgü, 00 §1.1 sütunlarının türevi):**

1. **Sayaç duraklar, utandırmaz.** Hiçbir streak sayısı sıfırlanmaz; hiçbir ekran kırmızı çarpı ile "kaybettin" demez (S2, S5).
2. **Dönüş hikâyedir, tazminat değil.** Yokluk olay üretir; ödül 7 günde tavana vurur ve yokluk süresiyle büyümez (D-031; saat hilesini değersizleştirir).
3. **Kıyas hayalidir ve öyle yazar.** Kampta 40 kişi vardır, hepsi kurgusaldır, her kartta "hayali/fictional" yazar; sahte sosyal kanıt yok (D-019, Google Play Deceptive Behavior).
4. **Miras çeşitlilik verir, güç vermez.** Hiçbir perk stat, Para, hazard, iddia oranı ya da olay şansını değiştirmez; "güç testi" §2.6.3 (D-042).
5. **Koleksiyon sayar, yargılamaz.** Teşhis adları antrenman tonludur, kimlik ya da klinik sözcük içermez; roast Teşhis'in satırında değil, koçun balonundadır (D-024, D-064).

**Kapsam farkları:**

| Sistem | MVP dikey kesit (10 hafta) | Soft launch (TR + CA/NZ) | 1.0 (global) | Lansman sonrası |
|---|---|---|---|---|
| Mola / streak | Tam: karar bazlı sayaç, duraklama, 2 İzin, 48 sa Telafi, hafta sonu muafiyeti (varsayılan açık), 8 kilometre taşı, 4 kozmetik | + Sezon Arası (tatil modu), aylık takvim görünümü, Lally kartı 1:1 | + 12 damga varyantının 6'sı kilometre taşından | — |
| Koç Görevleri | 3/gün deterministik, 60 görev/locale, 1'i absürt | 90 görev | 120 görev; Kamp haftasında 1 görev kamp temalı | 160 |
| Antrenman Kampı | 2 tema (Erteleme, Cesaret), 40 hayali kohort, kıyas kartı, KMP kodu | 8 tema, Pazartesi bildirimi, haftalık en iyi skor | 16 tema (12 kalıp + 4 sezonluk), Kamp Teşhisleri | Sezon Paketi +12 tema |
| Bildirim | Yalnızca yerel; replan ritüeli; tavanlar; soft-ask; D0–D7 merdiveni + zarf mesajı; 40 satır | Merdiven D0–D30 + lapsed tam; karakter mesajı kategorileri; histogram saati; 60 satır | 80 satır; sezonluk kopyalar; TrustedClock monoton modül | 100 |
| Welcome-back | Tam tablo (gün bazlı), 3–6 kart, Atla, +1 İzin, büyük bekleyen karar | Tanışıklık ≥ 3 sıcak varyantlar; "Neler yeni" kartı (30+ gün) | 40 welcome-back satırı | 50 |
| Kondisyon | 3 perk (Kedi, Yeni Şehir, Hedefsiz bonus); puan + pity | 6 perk | 10 perk; "Aynı kondisyonla" | +2/sezon |
| Fazla Bagaj | Tam (1 callback olayı × 3 varyant) | 6 varyant | 10 varyant; Kronik birleşmesi | — |
| Teşhis | 30 (3 otomatik, 5 gizli, 12 kalıp tabanlı) | 45 | 60; Kamp Teşhisleri | 120 (6. ay) |
| Sözlük + Mottolar | Sözlük 40 giriş, 5 sekme; Mottolar ızgarası 36 hücre | Sözlük 60; sayfa paylaşım kartı | Sözlük 120 | 180 |
| Onyıl Karnesi | **Yok** (doc 02 şeması hazır; ekran soft launch'ta) | 30/40 | 30/40/50/60; kart | — |
| Paylaşım kartları (bu belgenin) | Lally günü (1:1), Kamp kıyas (1:1) | + Teşhis kartı, Sözlük sayfası | + Onyıl Karnesi kartı | — |
| Seed kodları | HYT-XXXX-XXXX üretimi + içe aktarma (deep link) | KMP kodu içe aktarma (kampı sonradan oyna, karta girmez) | — | — |

**MVP'de bilinçli dışarıda:** Onyıl Karnesi ekranı, Sezon Arası modu, histogram tabanlı bildirim saati (MVP'de sabit 20:30 / streak-at-risk 21:00), provisional iOS bildirimi (hiçbir sürümde; §4), jenerasyon/"Çocukla devam" (00 §7, ayrı karar), gerçek hayat mikro-görevi (D-006; hiçbir sürümde bu belgede).

---

## 2. Tasarım

### 2.1 Mola ritüeli ve streak (D-029)

#### 2.1.1 Ne sayılır

Streak **günün ilk kararını** sayar; açılışı, oturumu, yılı değil. D-061 ile gün kartı oyunun doğal birimi olduğundan Mola = **günün ilk gün kartı**: uygulama açılır, Hayat Akışı'nda sıradaki tarihli gün gelir, oyuncu seçer, düdük ikonu dolar, koç bir satır söyler. Ritüelin maliyeti ≤ 90 sn (Fogg "tiny behavior"); devamı normal oturumdur, Mola ekranı diye ayrı bir ekran **yoktur** — Mola, Hayat Akışı'nın ilk kartının üstüne iğnelenen küçük bir "MOLA" etiketidir (doc 07 §2.2 Hayat ekranı, karar bölgesi).

Sayılmayanlar: Kamp hayatındaki kararlar **sayılır** (karar karardır); welcome-back kartları sayılmaz (karar yok); "Hızlı Yaşa" içinde otomatik çözülen beat'ler sayılmaz; iddia "Oranı göster" dokunuşu sayılmaz.

#### 2.1.2 İki sayaç, tek vaat

| Sayaç | Adı (ekran) | Ne yapar | Nerede görünür |
|---|---|---|---|
| `days` | **Antrenman günü / Practice days** | Her Mola'da +1; **asla azalmaz, asla sıfırlanmaz**; duraklatıldığında sabit kalır | Hayat Akışı üst şeridinde küçük (düdük + sayı); koçun ağzında büyük |
| `run` | **Kesintisiz / Unbroken** | Art arda Mola günleri (İzin ve hafta sonu muafiyeti günü "köprü" sayılır); kaçırılan gün Telafi edilmezse `run` 0'dan başlar ama `bestRun` rekoru kalır | Yalnızca Defter sekmesindeki aylık takvimde ve Lally kartında; HUD'da **yok** (T1 §2.1: streak HUD'da küçük) |

Vaat tek cümledir ve koç ilk duraklamada söyler: TR *"Sayaç sıfırlanmaz. Durur. Ben de dururum; gitmem."* · EN *"The count doesn't reset. It pauses. So do I. I don't leave."* Kilometre taşları `days` üzerinden verilir (sıfırlanmayan sayaç → her oyuncu eninde sonunda 66'ya ulaşır; Lally günü bir hak, bir imtiyaz değil). `run` yalnızca rekor ve takvim estetiğidir; kayıptan kaçınma burada "yumuşak" tutulur (T1 §1.5, Silverman & Barasch: kırık streak'i vurgulama).

#### 2.1.3 Gün sınırı ve güvenilir saat

- Gün = **yerel takvim günü** (`RESUME.localDay`, doc 10 §2.4.13). Gece 00:00'da döner; "04:00 kuralı" yok (Kamp'ın Pazartesi 00:00 kuralıyla aynı saat, tek zihinsel model).
- `days` monoton saatte son Mola'dan **≥ 20 saat** geçmeden artmaz (T7 §4.4; saat ileri alma streak'i uzatamaz).
- `tamperFlags > 0` olan günlerde Mola sayılır ama kart "doğrulanmamış" işareti taşır (küçük yıldız; yalnızca Lally/kilometre taşı kartlarında). Ceza yok; koç satırı defteri hedefler: TR *"Takvim ileri gitmiş. Defterim gitmemiş. İkisini de sayıyorum, birini küçük yazıyorum."* · EN *"The calendar jumped ahead. The notebook didn't. I'm counting both; one in smaller handwriting."*
- Saat dilimi değişimi (seyahat): `localDay` yeni dilimden gelir; aynı takvim günü iki kez görülürse ikinci Mola sayılmaz (idempotent anahtar `localDay`).

#### 2.1.4 Affetme mekanikleri

| Mekanik | Kural | Satılır mı | Kaynak |
|---|---|---|---|
| **Sakatlık İzni / Injury Leave** | 2 slot; kaçırılan gün sonunda (00:00) **otomatik** devreye girer, `run` köprülenir, `days` sabit; 7 günde 1 slot yenilenir (tavan 2); welcome-back +1 (tavan 2) | **Hayır** (D-029) | T7 §4.2, Duolingo freeze |
| **Hafta sonu muafiyeti** | Cmt + Paz opsiyonel: oynarsan `days` +1, oynamazsan İzin harcanmaz, `run` köprülenir; Ayarlar'da kapatılabilir; **varsayılan açık** (D-ÖNERİ-05-01) | — | Duolingo Weekend Amulet +%4 dönüş |
| **Telafi Antrenmanı / Make-up Practice** | Kaçırılan gün + İzin yoksa `run` kırılır; 48 saat içinde **iki ardışık gün** Mola yapılırsa `run` geri gelir ve takvimde boşluk kapanır; ücretsiz; 30 günde 1 (D-ÖNERİ-05-02) | **Hayır** | T7 §4.2 onarım penceresi |
| **Sezon Arası / Off-season** | 1–14 gün önceden ilan; `run` askıda, İzin harcanmaz, bildirim yok; yılda 2 kez; soft launch | — | T7 tatil modu |
| **Bilimsel af** | İlk `run` kırılmasında koç Lally'yi anlatır (tek kez): TR *"Bir gün kaçırdın. 2010'da 96 kişi üzerinde yapılmış bir çalışma var; bir gün fark etmiyor. Ben de fark etmiyorum."* · EN *"You missed a day. There's a 2010 study, ninety-six people: one day doesn't matter. Neither do I, apparently. Keep going."* | — | Lally et al. 2010 |

Streak'in motivasyon gücü kayıptan değil **varlıktan** gelir: `days` birikmiş bir varlıktır ve asla eksilmez; kilometre taşları goal-gradient'tir (T7 §4.2). Hiçbir ekranda "streak'ini kaybettin" cümlesi yoktur; lint `streak.*` satırlarında "kaybet/lost/kırıldı/broke" sözcüklerini BLOK'lar (§5).

#### 2.1.5 Durum makinesi

```mermaid
stateDiagram-v2
    [*] --> Idle: install
    Idle --> Active: ilk Mola (days=1, run=1)
    Active --> Active: Mola (yeni localDay, ≥20 sa mono) → days+1, run+1
    Active --> AtRisk: 21:00 yerel, bugün Mola yok, freezes=0
    Active --> DayEnd: 00:00 yerel, bugün Mola yok
    AtRisk --> Active: Mola
    AtRisk --> DayEnd: 00:00
    DayEnd --> Bridged: hafta sonu muafiyeti ∨ freezes>0 (freezes−1)
    DayEnd --> Broken: aksi hâlde (run→0, bestRun kaydı, makeupUntil = +48 sa)
    Bridged --> Active: Mola
    Bridged --> DayEnd: 00:00, Mola yok
    Broken --> Makeup1: Mola (48 sa içinde)
    Makeup1 --> Active: ertesi gün Mola → run geri (makeup kullanıldı)
    Makeup1 --> Paused: ertesi gün Mola yok
    Broken --> Paused: 48 sa doldu
    Paused --> Active: Mola (days devam, run=1)
    Active --> OffSeason: Sezon Arası ilan (1–14 gün)
    OffSeason --> Active: süre doldu ∨ Mola
    Paused --> Lapsed: 3+ gün (bildirim merdiveni §2.4.6)
    Lapsed --> WelcomeBack: app açıldı
    WelcomeBack --> Active: Mola
```

`days` hiçbir geçişte azalmaz (property-based test, §6.2). Kritik ayrıntı: **Paused** durumunda bile `days` ekranda "47 · duraklatıldı" olarak durur; "0" asla görünmez.

#### 2.1.6 Kilometre taşları ve kozmetik ödüller

Ödül daima kozmetiktir ve koçun bir satırıyla gelir; stat/Para/Kondisyon puanı **yok** (streak → güç köprüsü kurulmaz; T1 §5.3).

| Gün | Ad (TR / EN) | Kozmetik | Koç (TR) | Koç (EN) |
|---|---|---|---|---|
| 3 | Resmiyet / It's Official | Düdük ikonu renk 1 (lime) | Üç gün. Resmî oldu. Üç tesadüf değil; bir seri. Küçük bir seri. | Three days. It's official. Not three coincidences; a streak. A small one. |
| 7 | Hımm / Hm | Mola etiketi çerçevesi | Bir hafta. Hımm. Bunu not aldım; sayfanın köşesine, küçük. | One week. Hm. Noted. Corner of the page, small letters. |
| 14 | İki Hafta / Fortnight | Damga varyantı #3 (mürekkep: lacivert) | On dört gün. Ergen ilişkileri kadar uzun. Tebrikler, ciddi bir şeyin içindesin. | Fourteen days. Longer than most teenage relationships. Congratulations, this is serious now. |
| 21 | Mit Kırıcı / Myth Buster | Defter kapağı: "Antrenman Defteri" | Yirmi bir gün. "21 günde alışkanlık" bir mittir. Mite rağmen geldin; mitten iyi. | Twenty-one days. "Habits take 21 days" is a myth. You showed up anyway. Better than the myth. |
| 30 | Bir Ay / The Month | Damga varyantı #5 | Otuz. Karakterin bir yaş, sen bir ay büyüdün. Biriniz bir şey başardı; defterde yazıyor, kim. | Thirty. Your character aged a year; you aged a month. One of you accomplished something. The notebook says who. |
| **66** | **Lally günü / Lally Day** | **Lally kartı (1:1) + Teşhis #26** | Bilim 66 gün diyor. Sen 66 gün dedin. İlk kez aynı şeyi söylediniz. | Science says 66 days. You did 66 days. First time you two agreed on anything. |
| 100 | Yüz / The Hundred | Düdük rengi 2 (altın) + damga varyantı #8 | Yüz. Burada bir alkış olmalı. Ben alkışlamam; kalemimi bıraktım, bu kadar. | A hundred. There should be applause here. I don't clap. I put the pen down. That's the version. |
| 365 | Sezon / The Season | Defter kapağı "Tam Sezon" + damga #12 | Bir yıl. 2.400 seminerde kimse bir yıl yapmadı. Sen yaptın; seminer değildi, o yüzden. | A year. In 2,400 seminars, nobody did a year. You did. It wasn't a seminar; that's why. |

Lally kartı 1:1 (doc 07 `ShareCard`): antet "66. GÜN / DAY 66", karakter adı (ya da baş harfler), "66 antrenman günü · en uzun kesintisiz: 23", koçun satırı Fraunces italik, HYT kodu, wordmark. Gerçek tarih yok.

#### 2.1.7 Devre Arası ve streak-at-risk dürüstlüğü

- **Devre Arası** (oturum ≥ 25 dk, tek kez, kapatılabilir): koç satırı 00 §4.1'de; bu belge yalnızca zamanlayıcının `nowMono` ile ölçüldüğünü ve arka plana geçişte sıfırlanmadığını belirler.
- **Streak-at-risk bildirimi** yalnızca üçü aynı anda doğruysa planlanır: bugün Mola yok ∧ `freezes = 0` ∧ hafta sonu muafiyeti bugünü kapsamıyor. İzin varken risk **yoktur**, bu yüzden bildirim de yoktur; ertesi sabah bilgilendirme satırı (P-17) gelir. Sahte aciliyet sıfır (Reklam Kurulu, DMCC).

```ts
// packages/engine/src/streak/ritual.ts (saf; doc 10 Streak tipini genişletir)
export type Streak = Readonly<{
  days: number;                 // toplam antrenman günü; asla azalmaz
  run: number; bestRun: number; // kesintisiz seri ve rekor
  status: 'idle'|'active'|'bridged'|'broken'|'paused'|'offSeason';
  lastDecisionDay: string;      // 'YYYY-MM-DD' yerel
  lastDecisionMono: number;     // ms
  freezes: 0|1|2; freezeRefillDay: string;
  makeupUntil?: string; makeupUsedDay?: string;     // 48 sa; 30 günde 1
  weekendExempt: boolean;       // varsayılan true
  offSeasonUntil?: string;
  milestonesHit: ReadonlyArray<3|7|14|21|30|66|100|365>;
  unverifiedDays: ReadonlyArray<string>;            // tamperFlags ile sayılan günler
}>;

export function onDecision(s: Streak, localDay: string, nowMono: number, tamper: boolean): { s: Streak; effects: Effect[] } {
  if (s.lastDecisionDay === localDay) return { s, effects: [] };               // gün başına 1
  if (nowMono - s.lastDecisionMono < 20 * 3_600_000 && s.status !== 'idle') return { s, effects: [] };
  const gap = dayDiff(s.lastDecisionDay, localDay);                              // 1 = dün oynandı
  const bridged = s.status === 'bridged' || s.status === 'offSeason' || gap === 1;
  const makeupOk = s.status === 'broken' && s.makeupUntil && localDay <= s.makeupUntil;
  const run = bridged ? s.run + 1 : makeupOk ? s.run + 1 : 1;                   // makeup: ertesi gün de gelirse run korunur (onDayEnd kontrol eder)
  const days = s.days + 1;
  const hit = MILESTONES.filter(m => m === days && !s.milestonesHit.includes(m));
  const effects: Effect[] = [{ kind: 'whistle' }, ...hit.map(m => ({ kind: 'milestone', day: m }))];
  return { s: { ...s, days, run, bestRun: Math.max(s.bestRun, run), status: 'active', lastDecisionDay: localDay, lastDecisionMono: nowMono,
                 milestonesHit: [...s.milestonesHit, ...hit], unverifiedDays: tamper ? [...s.unverifiedDays, localDay] : s.unverifiedDays }, effects };
}
```

### 2.2 Koç Görevleri (günlük, deterministik)

#### 2.2.1 Kural

Her yerel gün için **3 görev**: 1 kolay (bir gün/yıl yaşamak ölçeğinde), 1 orta (bir Teşhis'e, Sözlük'e ya da Tek Hedef'e ilerleme), 1 **absürt** (hikâyeye bağlı saçma bir seçim; koçun gözde kategorisi). Görevler **oynayınca açılır**: ilk Mola'dan sonra listelenir, giriş ödülü değildir (D-055). Tamamlanan görev **Kondisyon puanı** verir (+1 / görev, 3'ü de biterse +1 bonus; §2.6.2) — çeşitlilik ekonomisine küçük, düzenli girdi; stat/Para asla.

Seed: `questSeed = fnv1a(installId + '|' + localDay + '|' + contentHash + '|' + locale)`; `installId` cihazda üretilen rastgele UUID'dir, reklam kimliği değil (KVKK, §5). Deterministik olduğundan uygulamayı kapatıp açmak görevleri değiştirmez; aynı gün aynı cihazda aynı üç görev.

Seçim algoritması (saf):

```
havuz = quests.filter(q => q.locale === locale && q.pre(state))        // hayata uygun (kedi yoksa kedi görevi yok)
kolay  = pickLRV(rng, havuz.filter(tier='easy'),   seenCount)          // least-recently-viewed ağırlıklı
orta   = pickLRV(rng, havuz.filter(tier='medium'), seenCount)
absürt = pickLRV(rng, havuz.filter(tier='absurd'), seenCount)
kural: aynı görev 14 gün içinde tekrar gelmez; Kamp haftasında 'orta' slotu %50 olasılıkla kamp temalı görevle değişir (1.0)
```

Tamamlama tespiti olay motorundan gelir: seçeneklerde görünmez `questTag[]` etiketi (`'talkMom'`, `'readTranslate'`, `'pickRisk'`…) ve motor `step` sonrası `QuestService.observe(effects)`; motorun `patterns` sayaçları ve `flags`'ı da okunur. Görev ekranı Hayat Akışı'nın üst şeridinde üç küçük onay kutusudur; tamamlanınca koç **tek** satır söyler (günde ≤ 3 görev satırı; aynı gün aynı satır yok).

#### 2.2.2 Şema

```ts
export interface CoachQuest {
  id: string; tier: 'easy'|'medium'|'absurd';
  locale: 'tr'|'en';
  pre?: (s: LifeState) => boolean;              // ör. s.flags.includes('hasCat')
  done: (s: LifeState, day: QuestDayLog) => boolean;  // gün içi gözlem
  text: string;                                 // ≤ 70 karakter (buton değil, satır)
  coachDone: string[];                          // ≥ 3 varyant, ≤ 110 karakter
  intent: string;                               // joke intent spec (doc 09)
}
```

Yasak sınıf (lint, §5): gerçek dünya fiilleri ("su iç", "birini ara", "yürü"), gerçek takvim/saat, oyuncunun cihazına/konumuna/gerçek hayatına gönderme. Koçun müşterisi **karakterdir** (A4 "oyun mu alışkanlık uygulaması mı" testi; D-006).

#### 2.2.3 20 örnek (TR / EN ayrı yazıldı; kolay K, orta O, absürt A)

| # | T | TR görev | TR koç (tamam) | EN görev | EN koç (done) |
|---|---|---|---|---|---|
| 1 | K | Bugün bir karar ver. Herhangi biri. | Bir karar. Yanlış da olsa malzeme. | Make one decision today. Any decision. | One decision. Even wrong, it's material. |
| 2 | K | Bir doğum gününe ulaş. | Karne geldi. Sen de geldin. İkisi de nadir. | Reach one birthday. | Report card showed up. So did you. Both rare. |
| 3 | K | Bir zarf aç. | Zarf açıldı. İçindekini sen seçmedin; cevabı sen seçeceksin. | Open one envelope. | Envelope's open. You didn't pick what's inside. You pick what's next. |
| 4 | K | Bir Tercüme oku. | Sözlük +1. Kurumsal dil bir kelime daha küçüldü. | Read one Translation. | Glossary +1. Corporate got one word shorter. |
| 5 | K | Aile Grubu'ndan bir mesajı oku. | Okunmamış: 846. Büyük hamle değil; hamle. | Read one message from the family group. | Unread: 846. Not a big move. A move. |
| 6 | K | Pamuk'la ilgili bir karar ver. *(kedi varsa)* | Kedi fark etmedi. Kediler fark etmez. Ben ettim. | Make one decision about Biscuit. *(if cat)* | The cat didn't notice. Cats don't. I did. |
| 7 | O | Bugün "Sabır" etiketli bir seçenek seç. | Sabır: +1. Defterde bu sütun boştu; artık değil. | Pick one option tagged Patience today. | Patience: +1. That column was empty. Was. |
| 8 | O | Tek Hedef'ine bir adım at. | Hedefe bir adım. Üç kişiden ikisi bunu yapmaz; 2.400 seminerin özeti. | Take one step toward your One Goal. | One step toward the goal. Two in three people never do. That's 2,400 seminars, summarized. |
| 9 | O | Bir risk seçeneği seç ve oranı gör. | Oran gördün, yine seçtin. Cesaret sütununa yazdım. | Pick a risk option and look at the odds. | You saw the odds and picked it anyway. Filed under Courage. |
| 10 | O | Annenle bir kez konuşmayı seç. | Anne Baskısı −5. Annen bunu bilmiyor; ben biliyorum. | Choose to talk to your mom once. | Mom Pressure −5. Your mom doesn't know that number. I do. |
| 11 | O | Bir Teşhis'e ilerle (herhangi biri). | Bir Teşhis'e yaklaştın. Hangisi, söylemem; sürprizi bozmam. | Progress any Diagnosis. | You're closer to a Diagnosis. Which one, I'm not saying. |
| 12 | O | Bir iddiayı kazan ya da kaybet; fark etmez, çöz. | İddia kapandı. Damga bastım; hangisi, defterde. | Settle one wager; win or lose, doesn't matter. | Wager closed. I stamped it. Which stamp is in the notebook. |
| 13 | O | Bir yıl "Hedefsiz yaşa" seç. | Hedefsiz bir yıl. Saygı duyuyorum. Not da aldım. | Pick "No goal, respect" for one year. | A year without a goal. Respect. Also noted. |
| 14 | O | Barış'ın bir "kesin" fikrini reddet. | Barış'a hayır dedin. Kesin bir şey bulmuştu. Yine bulur. | Turn down one of Jordan's "definitely" ideas. | You told Jordan no. He'd definitely found something. He will again. |
| 15 | A | Dayına "hayata atıldım" de. Atılmamış olsan da. | Dayın inandı. Dayılar inanır. Ben sayarım. | Tell your uncle you've "gotten started." Whether or not you have. | Your uncle believed you. Uncles do. I count. |
| 16 | A | Kediye yeni bir isim koy. Adı zaten var. Yine koy. | Kedi iki isimli oldu. Hiçbirine gelmiyor. Tutarlı. | Rename the cat. The cat has a name. Do it anyway. | The cat now has two names. Answers to neither. Consistent. |
| 17 | A | Bir evrakı Tercüme etmeden imzala. | Okumadan imzaladın. Antrenmanda buna "güven" deriz. Hayatta "sonuç". | Sign one document without Translating it. | Signed unread. In training we call that trust. In life, consequences. |
| 18 | A | Aile Grubu'na "Görüldü, cevap yok" de. Bugün. | Görüldü. Cevap yok. Teşhis'e bir adım; annen de bir adım attı, kapına doğru. | Leave the family group on read. Today. | Seen. No reply. One step toward a Diagnosis. Your mom also took a step. Toward your door. |
| 19 | A | Patronunun bir cümlesini Tercüme et, sonra yine de "tamam" de. | Tercüme okudun, "tamam" dedin. Bilerek. Bu bir seviye. | Translate one line from your boss, then say "sure" anyway. | You read the translation and said "sure." On purpose. That's a level. |
| 20 | A | Bugün hiçbir şey biriktirme. Hiç. | Sıfır birikim. Yuvarlamadım; sıfır yuvarlanmaz. Görev tamam. | Save nothing today. Nothing at all. | Zero saved. I didn't round that. Zero doesn't round. Task complete. |

Her görev satırı lint'ten geçer: gerçek dünya fiili yok, "yap/yapmalısın" yok (görev metni emir kipi taşır ama **oyun içi** eylemdir ve koç satırında değil görev kartındadır; D-027 koç balonu içindir — görev kartı sistem metnidir, bu ayrım doc 08'e kural olarak geçer: D-ÖNERİ-05-03).


### 2.3 Antrenman Kampı (haftalık, seed'li hayat, hayali kohort) — D-019

#### 2.3.1 Takvim ve seed

- Yeni kamp **Pazartesi 00:00 yerel** açılır, Pazar 23:59'da kapanır (geri sayım = gerçek takvim; sahte aciliyet yok).
- `campSeed = fnv1a(isoYearWeek + '|' + locale + '|' + contentHash)`; `isoYearWeek` uygulamadan `RESUME.isoWeek` ile gelir (yerel). `locale` seed'e girer: "herkes" = aynı dildeki herkes (00 §9). `contentHash` seed'e girer: OTA ile havuz büyüyünce eski haftaların kartları değişmez.
- Saat dilimi/saat hilesi: `tamperFlags` varsa Kamp haftası ilerlemez (doc 10 §2.4.13); aynı `isoWeek` bir kez tamamlanmışsa yeniden açılmaz; geriye alınan saat yeni kamp açmaz. Ceza yok; sadece "sürprizi kaybedersin".

#### 2.3.2 Tema rotasyonu (16 tema)

Havuz 12 **kalıp kampı** (her biri Kalıp Dedektörü'nün bir kalıbını "tek kas" olarak çalıştırır) + 4 **sezonluk** kamp. Rotasyon: ISO yılına seed'lenmiş bir permütasyon (`permute(12, fnv1a(isoYear))`) kalıp kamplarını sıralar; haftanın teması `perm[(isoWeek − 1) mod 12]`. Sezonluk 4 kamp sabit haftalara biner ve o hafta kalıp kampının yerini alır (Ocak 2. hafta, Temmuz 2. hafta, Eylül 2. hafta, Aralık 2. hafta). Sonuç: aynı tema 12 hafta içinde tekrar etmez; dinî/millî takvime bağlı tema **yok** (T9: din/etnik köken sıfır; D-048 ikamesi kampa taşınmaz).

| # | Tema TR / EN | Kas (kalıp) | Kısıt (olay motoruna `campRule`) | Koç açılış TR | EN |
|---|---|---|---|---|---|
| 1 | Erteleme Kampı / Procrastination Camp | Erteleme | "sonra/yarın" etiketli seçenekler kilitli; koç her kilidi sayar | Bu hafta "yarın" yok. Kelime olarak da yok; sildim. | No "tomorrow" this week. Not even the word. I deleted it. |
| 2 | Cesaret Kampı / Courage Camp | Risk | Yılda ≥ 1 risk seçimi yoksa o yılın karnesine "ISINMA" damgası | Her yıl bir risk. Küçük olabilir. Sıfır olamaz. | One risk a year. Small is fine. Zero isn't. |
| 3 | Tasarruf Kampı / Savings Camp | Dürtüsel Harcama | Dürtüsel harcama seçenekleri 2× pahalı görünür (ve öyledir) | Her şey iki katı. Fiyat etiketi değil, sonuç etiketi. | Everything costs double this week. Not the price tag. The consequence tag. |
| 4 | Hayır Kampı / The No Camp | Herkesi Memnun Etme | Her yıl ≥ 1 "hayır" seçeneği zorunlu, yoksa Cringe +5 | Bu hafta bir kelime çalışıyoruz: hayır. İki harf. Zor harfler. | One word this week: no. Two letters. Hard ones. |
| 5 | Yüzleşme Kampı / Face-It Camp | Kaçınma | "Görüldü, cevap yok" ve "sonra bakarım" kilitli | Kaçacak yer yok. Haritayı ben çizdim; çıkış koymadım. | Nowhere to hide. I drew the map. Left out the exits. |
| 6 | Bakım Kampı / Maintenance Camp | Kendine Bakım | Yılda ≥ 1 kendine bakım seçimi yoksa Sağlık drift ×1,5 | Buzdolabına yürümek sayılmıyor. Sordun diye söylüyorum. | Walking to the fridge doesn't count. You were going to ask. |
| 7 | Mesai Kampı / Overtime Camp | Aşırı Çalışma | Aşırı çalışma seçenekleri Keyif −2 ek | Mesai var. Sayıyorum; sen saymıyorsun, o yüzden ben. | Overtime's on. I'm counting it. You're not, so somebody has to. |
| 8 | Kendi Ayakları Kampı / Own Two Feet Camp | Aileye Yaslanma | Aile yardımı seçenekleri kilitli ("anne borç verdi" dahil) | Bu hafta annen arıyor ama para göndermiyor. Ben ayarladım. | Mom still calls this week. She just doesn't send money. I arranged that. |
| 9 | Uzun Yol Kampı / Long Way Camp | Kısa Yol | Kısa yol seçenekleri kilitli | Kestirme yok. Yol uzun; ayakkabı senin. | No shortcuts. The road's long. The shoes are yours. |
| 10 | Alçakgönüllülük Kampı / Humble Camp | Gurur | Gurur seçenekleri Ego +0 (ödül yok) | Bu hafta kimse alkışlamıyor. Ben de. Çalış. | Nobody claps this week. Me included. Train. |
| 11 | Cömertlik Kampı / Generosity Camp | Cömertlik | Her yıl ≥ 1 cömertlik seçimi; sayılır, ödül yok | Vermek sayılıyor. Alkış yok, sayı var. | Giving counts. No applause. Numbers. |
| 12 | Sabır Kampı / Patience Camp | Sabır | "Hemen" etiketli seçenekler 1 yıl gecikir | Her "hemen" bir yıl bekler. Hayat da öyle yapar; ben sadece dürüstüm. | Every "right now" waits a year. Life does that too. I just say it out loud. |
| 13 | Yeni Sezon / New Season (Ocak) | Erteleme + Sabır | Yılın ilk kararı Tek Hedef olmak zorunda | Yeni yıl, aynı sen. Yeni karne. Bir hedef. | New year, same you. New report card. One goal. |
| 14 | Tatil Sezonu / Off-Season (Temmuz) | Kendine Bakım + Dürtüsel Harcama | Tatil olayları ×2 salience; harcama 2× | Tatil. Dinlenmek para ister; dinlenmemek sağlık. Seç. | Vacation. Rest costs money. Not resting costs health. Pick. |
| 15 | Transfer Dönemi / Transfer Window (Eylül) | Risk + Kaçınma | İş değiştirme olayları zorunlu beat | Transfer penceresi açık. Kulübün seni istemiyor; sen de onu. Konuşalım. | Transfer window's open. Your club doesn't want you. Feeling's mutual. Let's talk. |
| 16 | Kapanış Sezonu / Closing Season (Aralık) | Gurur + Cömertlik | Her yıl 1 "hesaplaşma" kartı (eski NPC döner) | Sezon kapanıyor. Herkes geri geliyor; sen de burada kal. | Season's closing. Everyone comes back. Stay put. |

MVP: #1 ve #2. Soft launch: #1–#8. 1.0: 16. Sezon Paketi (doc 06): +12 tema, aynı şema.

#### 2.3.3 Kamp hayatı

Kamp, ayrı bir `LifeState`'tir (`mode: 'camp'`, `campId: isoYearWeek`): başlangıç adı/şehri/statları seed'den sabit, herkes aynı doğar. **Tam hayattır** (18 → ölüm), ama Kamp sıkıştırması açıktır: gösterilen gün/yıl D-061 bantlarının yarısı (18–25: 6–9 gün/yıl, 26–40: 4–6, 41–60: 3–4, 60+: 2) → hedef **35–50 dk**. Zarf, arc, Onyıl Karnesi oynanır; dolgu atlanır. Hafta içinde **sınırsız deneme**; en iyi skor karta girer; 2. ve sonraki denemeler "pratik" etiketi taşır (Spelunky). Kamp hayatı Koçun Defteri'ne **girmez** (KAPANDI defteri yok; Kamp sayfası ayrı), Tanıdık Yüzler hafızası taşımaz, Kondisyon puanı verir (tamamlama +2, ilk 10'da +1), Teşhis ilerletir (Kamp Teşhisleri yalnızca burada açılır). Ana hayat Kamp sırasında rafta bekler; sekmeler arası geçiş serbest.

#### 2.3.4 Skor

```
gradeIdx(not) = {Zayıf:0, Geçer:1, Orta:2, İyi:3, Pekiyi:4}         // EN F..A aynı indeks
avgGrade      = ortalama(gradeIdx) tüm karneler × 6 not            // 0..4
muscle        = clamp(patternShare(kampKası) / targetShare(tema), 0, 1)   // tema kasının seçim payı / hedef pay (tema başına tuning.json)
campScore     = round(100 × (0,6 × avgGrade/4 + 0,4 × muscle))     // 0..100
tie-break     = ölüm yaşı (yüksek önce), sonra Kondisyon puanı
```

`targetShare` tema başına harness'la kalibre edilir (ör. Erteleme Kampı'nda kilit sayılır: `muscle = 1 − lockedAttempts/attempts`). Skor **Para'ya bağlı değildir** (zengin ölmek Kamp'ı kazandırmaz; S2).

#### 2.3.5 Hayali kohort (40 kişi)

Kohort, aynı motorun **headless** çalıştırılmasıyla cihazda üretilir: `botSeed_i = fnv1a(campSeed + '|bot|' + i)`, `i ∈ 1..40`; her bot bir **politika** alır (`cautious`, `impulsive`, `balanced`, `goalChaser`, `familyLeaner`, `random`; 40 = 6 politika × 6–7 + 2 `random`). Politika, seçenekleri `pattern` etiketine göre ağırlıklandırır; bot kararları motorun `step`'inden geçer, dolayısıyla skorlar gerçek dağılımdır (sahte sayı yok). Üretim Pazartesi ilk açılışta arka planda, önce 10 bot (≤ 1,5 sn orta Android; harness 10.000 hayatı dakikalarda koşuyor, 40 hayat saniyeler), kalan 30 oturum içinde; sonuç `camps/<isoWeek>.json`'a yazılır.

Adlar locale isim havuzundan (doc 09; blocklist dahil), **daima** "hayali"/"fictional" ön ekiyle: "hayali Ayşe", "fictional Dana". Etiket zorunluluğu üç yerde: sıralama listesi başlığı ("40 hayali kişi / 40 fictional people"), her satırın adı, kıyas kartının alt satırı ("Kohort hayalidir. / Cohort is fictional."). Lint: `camp.*` kaynaklı her UI string'i etiketi içermiyorsa BLOK. Kohort "gerçek oyuncu" diye **hiçbir yerde** sunulmaz (Google Play Deceptive Behavior; UCPD "ortalama tüketici"; D-019).

Sıralama ekranı: sen + 40 bot, skor + ölüm yaşı + karne ortalaması; her botun yanında politika değil **tek cümle** (koç ağzı: "hayali Ayşe: her yıl 'sonra' dedi, 71 yaşadı"). Koç haftada ≤ 1 kıyas satırı (Normal): TR *"Hayali Ayşe senden önde. Hayali olması durumu değiştirmiyor."* · EN *"Fictional Dana is ahead of you. Being fictional hasn't slowed her down."*

#### 2.3.6 Kıyas kartı ve KMP kodu

Kart 1:1 (doc 07 §3.6 düzeni): tema + hafta, "Sen: Karne ort. Orta, 58 yaş · 14/41", en yakın hayali rakip, **"Kohort hayalidir."**, `KMP-XXXX`. KMP kodu = base32(`campSeed` ilk 20 bit) → 4 karakter; aynı hafta aynı dilde herkes aynı kodu görür (kod kimlik değil, hafta kimliğidir). Kodu giren arkadaş: aynı kampı (hafta bitmişse "arşiv kamp" olarak, karta girmez, sıralama yok) oynar → "Aynı hayat, farklı karne" ekran görüntüsü yan yana.

#### 2.3.7 Kamp ruh hâli

Soft launch'ta koçun 3. ruh hâli `camp` (00 açık soru #9'un cevabı bu belgede: **soft launch**; D-ÖNERİ-05-04): resmî, gergin, kısa; roast kotası Normal'le aynı; "koçum/champ" Kamp'ta hiç.

### 2.4 Bildirim spesifikasyonu (yalnızca yerel) — D-030, D-062

#### 2.4.1 İlkeler

1. **Uzak bildirim yoktur.** `expo-notifications` `enableRemoteNotifications: false`; iOS APNs entitlement'ı yok (doc 10 §2.4.5). Mağaza incelemecisine cümle: "Uygulama yalnızca yerel bildirim planlar."
2. **Her bildirim oyun dünyasından bir haberdir**, pazarlama değildir: ya bir **karakter mesajı** (D-062: başlık = NPC adı, gövde = balon; sohbet uygulaması görünümü) ya da **koçun bir satırı** (01 §3.4 P-01..P-30). IAP/indirim/sezon paketi bildirimi **yok** (ayrı toggle bile yok; en temiz hâl).
3. **Özne daima karakter/NPC/koç**; oyuncunun gerçek hayatı, saati, konumu, yokluğu yorumlanmaz (D-050). "Sen yokken" ifadesi yalnızca "karakter sen yokken" olarak ve oyun verisiyle kurulur.
4. **Aciliyet gerçektir**: streak-at-risk yalnızca gerçek riskte (§2.1.7); "son şans / son fırsat / kaçırma" sözcükleri BLOK.
5. Metin **OS yüzeyinde** görünür: küfür yok, hakaret yok, 4+ tolerans; ses ayarı Acımasız olsa bile bildirim havuzu **Normal** varyanttır (D-ÖNERİ-05-05: bildirim yüzeyi mağaza vitrini sayılır).

#### 2.4.2 Tavanlar (koda gömülü, `NotificationPolicy`)

| Kural | Değer |
|---|---|
| Günlük maksimum | 1 |
| Haftalık maksimum | 5 (kayan 7 gün) |
| Sessiz saat | 22:30–09:00 yerel (Ayarlar'da değiştirilebilir; sessiz saat büyütülebilir, küçültülemez — en erken 08:00, en geç 22:30) |
| İki bildirim arası | ≥ 20 saat |
| Yoksayma | Art arda 3 bildirim açılmadan geçerse 7 gün sessizlik; sonra kadans lapsed merdiveniyle devam |
| "Beni rahat bırak / Leave me alone" | Tek dokunuş (bildirim aksiyonu + Ayarlar): 7 gün / 30 gün / süresiz; koç: TR *"Tamam. Bildirimleri kesiyorum. Kapı açık, ışık yanıyor."* · EN *"Okay. Notifications off. Door's open, light's on."* |
| Planlı bildirim sayısı | ≤ 12 (iOS 64 tavanının çok altında; Android hibernation kaybı küçük) |
| Planlama ufku | ≤ 30 gün (Android 3 ay hibernation; D30 son) |
| Sessiz günler | `quietDays[locale]`: TR'de 10 Kasım'da bildirim planlanmaz (gerekçe içerikte yazmaz, gönderme yok); EN listesi boş (D-ÖNERİ-05-06) |
| Ölüm sonrası | `lifeEnded` → `notification-cancel-all`; ilk bildirim en erken yeni hayatın ilk oturumundan sonra (doc 02 §2.5.1) |

#### 2.4.3 Replan ritüeli ve öncelik

`NotificationPlanner.replan()` her `RESUME` ve `SUSPEND`'de (doc 10 §2.4.13) ve `lifeEnded`, `quietMode`, `streakStateChanged` olaylarında koşar:

```
replan(state, now):
  cancelAllScheduled()
  if (!permission.granted || quiet.active) return
  cands = []
  cands += streakAtRisk(state, now)        // P1: bugün Mola yok ∧ freezes=0 ∧ muafiyet yok → bugün 21:00
  cands += pendingEnvelope(state)          // P2: en ağır açık zarf → karakter mesajı (yarın, histogram saati)
  cands += pendingDecision(state)          // P2: karar ekranında çıkıldıysa (+6 sa, sessiz saat dışına kaydır)
  cands += newUserLadder(state, now)       // P3: install'dan itibaren D0..D30 (§2.4.5), yalnızca streak kırılmadıysa
  cands += campMonday(now)                 // P4: Pazartesi 09:05 (Kamp açık) ; Cuma 18:00 "kamp yarın biter" (yalnızca kamp başlandıysa)
  cands += milestoneEve(state)             // P5: days=65 → "66 yarın"
  cands += seasonal(now)                   // P6: sezonluk kamp haftası açılışı
  cands += lapsedLadder(state, now)        // P7: son Mola'dan L1,L3,L7,L14,L21,L30 (§2.4.6); Active durumda üretilmez
  cands = cands.filter(notInQuietHours ∘ notOnQuietDay ∘ withinHorizon(30d))
  plan  = greedyByPriority(cands, { perDay: 1, per7d: 5, minGapH: 20 })   // aynı gün çakışmada düşük öncelik düşer
  plan  = plan.slice(0, 12)
  schedule(plan)                            // her biri data: { pushId, deepLink, templateKey }
```

Aynı güne iki aday düşerse yüksek öncelik kalır; **streak-at-risk ladder'ı düşürür**, zarf mesajı ladder'ı düşürür. Saat: MVP sabit 20:30 (TR akşam dilimi; EN pazarlarında 19:30), streak-at-risk 21:00 (T7 açık soru #2: Android bestEffort gecikmesi 22:30'a kaymasın); soft launch'ta son 14 oturumun başlangıç histogramından en yoğun 2 saatlik pencerenin başı (hafta sonu ayrı histogram).

#### 2.4.4 Karakter mesajı biçimi

Başlık = NPC adı (locale), gövde ≤ 110 karakter, emoji yok, `threadIdentifier = npcRoleId` (iOS gruplama), Android kanal `defter`. NPC ses kuralları doc 04'ten: Anne kısa + soru işareti + kaygılı; Barış BÜYÜK HARF + "kesin"; Nevin Hanım İK dili; Yağmur üç kelime; Şükran Teyze "komşu" lojistiği; Dayı "hayata atıl"; Pamuk tek kelime; Taksici trafik. Her karakter mesajı **oyun verisine bağlıdır** (`pre`): Yağmur mesajı yalnızca Yağmur arc'ı açıksa; Pamuk yalnızca kedi varsa; Nevin Hanım yalnızca o iş yerindeyse. Uydurma haber yok; her mesajın deep link'i tam o zarfa/kart'a iner.

Aksiyon kategorileri: `ZARF` ("Aç / Open" · "Yarın / Tomorrow"), `MOLA` ("Bir karar / One decision" · "Bugün değil / Not today"), `LAPSED` ("Özeti gör / See the report" · "Beni rahat bırak 30 gün / Leave me alone, 30 days"). "Yarın" seçimi o adayı +1 gün kaydırır (tavanlar yine uygulanır).

#### 2.4.5 Yeni kullanıcı merdiveni (D0..D30)

Merdiven yalnızca **Active** streak'te üretilir; herhangi bir gün karakter mesajı (zarf) varsa o günün merdiven adımı düşer. Haftada 5 tavanı nedeniyle D0–D7'de en fazla 5 bildirim.

| Gün | Tetik | Tip | TR | EN |
|---|---|---|---|---|
| D0 | Karakter yaratıldı, oturum ≥ 8 dk, izin verildi; o akşam | Koç | Deniz 18. Bugün bir karar verdi. Yarın da verirse buna antrenman derim. | Alex is eighteen and made one decision today. One more tomorrow and I'll call it practice. |
| D1 | — | Karakter: Anne | Yemek yedin mi? *(Deniz'e soruyor. Sana değil. — M.)* | Did you eat? *(She's asking Alex. Not you. — M.)* |
| D2 | Zarf açık | Karakter: zarf sahibi | *(§3 N-serisi; ör. Nevin Hanım: "Yarın 09:00. Odamda. Konu: sen.")* | *(Ms. Carver: "Tomorrow, 9 a.m. My office. Subject: you.")* |
| D3 | days=3 | Koç | Üç gün. Resmî. Bilim 66 diyor; 63 kaldı, panik yok. | Three days. Official. Science says sixty-six. Sixty-three to go. No panic. |
| D5 | — | Karakter: Barış | KESİN BİR ŞEY BULDUM. YARIN ANLATIRIM. BUGÜN DE ANLATABİLİRİM. | I DEFINITELY FOUND SOMETHING. TELL YOU TOMORROW. OR NOW. |
| D7 | days=7 | Koç | Bir hafta. Hımm. Köşeye not aldım; küçük. Gel bak, ne yazdım. | A week. Hm. Corner note, small letters. Come see what it says. |
| D10 | — | Karakter: Pamuk *(kedi varsa)* / Dayı | Miyav. *(Tercüme: mama. — M.)* | Mrow. *(Translation: food. — M.)* |
| D14 | days=14 | Koç | İki hafta. Karne yaklaşıyor; motto'yu ben yazarım, sen yaşa. | Two weeks. Report card's close. I write the motto; you live it. |
| D21 | days=21 | Koç | Yirmi bir gün. Mit kırıldı. Defter kapağı değişti; gel gör. | Twenty-one days. Myth's broken. The notebook got a new cover. Come look. |
| D30 | days=30 | Koç | Otuz. Bir ay sen, bir yıl karakter. Kim ne başardı, defterde. | Thirty. A month for you, a year for the character. Who did what is in the notebook. |

#### 2.4.6 Lapsed merdiveni (son Mola'dan itibaren; azalan kadans; Duolingo tersliği)

| Gün | Tip | TR | EN |
|---|---|---|---|
| L1 (İzin devrede) | Koç, sabah | Sakatlık İzni devrede. Sayaç bekliyor, ben de. Panik yok. | Injury leave kicked in. The streak's waiting. So am I. No panic. |
| L3 | Karakter: Anne | Üç gündür ses yok. İyi misin? *(Deniz'e. Oyunda 3 hafta geçti. — M.)* | Three days, no word. Are you okay? *(To Alex. Three in-game weeks passed. — M.)* |
| L7 | Koç | Bir hafta. Defteri kapatmadım; açık bırakmak alışkanlık. Rafta bir zarf var. | A week. I haven't closed the notebook. Leaving it open is a habit. There's an envelope on the shelf. |
| L14 | Karakter: zarf sahibi | *(büyük bekleyen karar; ör. Yağmur: "Konuşmamız lazım.")* | *(Sam: "We should talk.")* |
| L21 | Koç (Duolingo tersliği) | Tamam, susuyorum. Hayatın bensiz de devam eder; benimki de sensiz. Kapı açık. | These reminders aren't working. I'll stop. Your life goes on without me; mine without you. Door's open. |
| L30 | Koç, `passive` | Son bildirim. Defter kapanmadı; KAPANDI damgasını yalnızca ölüme basarım. | Last notification. The notebook isn't closed. I only stamp CLOSED for a death. |

L30'dan sonra hiçbir şey planlanmaz (Android hibernation, iOS 64; T7). Geri dönen oyuncuya ertesi gün P-23 ("Dün döndün…") bir kez.

#### 2.4.7 Soft-ask ve izin akışı

- Tetik: motor `ask-consent{notifications}` efekti — **ilk "Bugünlük yeter"** ∧ oturum ≥ 8 dk ∧ **ilk karne görüldü** (D-030'un koşuluna D-061 ritmiyle eklenen üçüncü koşul: ilk doğum günü ≈ 12–18 gün kartı ≈ 8–12 dk, genelde aynı anda sağlanır; D-ÖNERİ-05-07). İlk 60 saniyede asla.
- Android ek kilidi: `sessionCount ≥ 2` değilse soft-ask da gösterilmez (evet denip sistem diyaloğu gösterilememesin diye). iOS'ta 1. oturumda olabilir.
- Soft-ask kartı koç ağzında, vaat yazılı: TR *"Deniz'in hayatı sen yokken de akar. Önemli bir şey olunca haber vereyim mi? Günde en fazla bir, gece yok. Söz; deftere yazdım."* [Haber ver] [Şimdi değil] · EN *"Alex's life keeps going while you're out. Want a heads-up when something matters? One a day at most, never at night. In the notebook, in pen."* [Keep me posted] [Not now]
- "Haber ver" → sistem izni (iOS `requestPermissionsAsync({ ios: { allowAlert, allowBadge: false, allowSound } })`; Android `POST_NOTIFICATIONS`, kanal önceden yaratılmış). "Şimdi değil" → D3'te bir kez daha (yalnızca soft-ask; sistem diyaloğu hâlâ gösterilmedi), sonra Ayarlar satırı. Sistem diyaloğunda **ret** → bir daha sorulmaz; Ayarlar'da "Bildirimler" sistem ayarına link. Provisional (iOS sessiz teslim) **kullanılmaz** (D-ÖNERİ-05-08: "bir kez sorarız" vaadini bozar, kilit ekranında görünmez, oyun için değersiz).
- 7 günlük rozet soft-ask'ı (T7 3. nokta) **yok**: iki soru yeter.

#### 2.4.8 Ölçüm kancaları

`addNotificationResponseReceivedListener` → `push_open{pushId, templateKey, delayMin}`; `getPresentedNotificationsAsync` teslim doğrulaması (soft launch); `session_start.source='push'`; uninstall proxy: push günü + 72 sa açılış yok.

### 2.5 Welcome-back: "Sakatlık Raporu" — D-031, D-061

#### 2.5.1 Yokluk → oyun zamanı (gün bazlı)

`AbsenceEngine.resolve(lastSeenWall, nowWall, state)`; deterministik (`seed = fnv1a(lifeId + lastSeenDay)`), aynı yokluk aynı raporu üretir (ekranı kapatıp açmak değiştirmez). Çıktı `advanceTime({ days })` aksiyonuna çevrilir; motor geçen takvim günlerini **gösterilen gün üretmeden** akıtır (D-061 "olaysız günler atlanır" kuralının aynısı), yıl pulse'ı varsa beat'siz koşar, hazard zarı `pendingDeathRisk` olarak rafa konur (doc 02 D-ÖNERİ-02-12: raporda ölüm **asla**).

| Gerçek yokluk | Geçen oyun günü | Rapor kartı | İçerik | Doğum günü geçerse |
|---|---|---|---|---|
| < 6 saat | 0 | 0 | Rapor yok; koç tek satır: TR *"Hemen döndün. Özlemişsin; ben de. Söylemem."* · EN *"Back already. You missed it. So did I. I won't say so."* | — |
| 6–24 saat | 1 | 0 | Yalnızca Hayat Akışı'nda tek satır özet ("1 gün geçti. Komşu selam verdi; bu da bir olay.") | — |
| 1–3 gün | 7–21 | 1–2 (1 küçük olay + 1 NPC balonu) | "Annen 3 kez aradı" sayacı; Okunmamış +N | Karne rafa (son kart) |
| 4–13 gün | 30–90 | 3 (1 orta olay: iş/para/ilişki hareketi) | Zarf kuyruğuna 1 yeni zarf; Anne Baskısı gerçek artış | Karne rafa |
| 14–29 gün | 180–270 | 4–5 (1 **büyük bekleyen karar**) | Büyük karar: iş teklifi, Yağmur'un mesajı, ev sahibi, sağlık evrakı — **çözülmez, rafa konur**, ilk gün kartı o karardır | Karne rafa; 2. doğum günü olmaz (tavan) |
| 30+ gün | **365 (tavan)** | 5–6 (1 büyük bekleyen + "Neler yeni") | Aynı; + OTA `whatsNew[]` kartı; Tanışıklık ≥ 3 ise sıcak varyant | 1 karne rafa (tavan: tek doğum günü; D-ÖNERİ-05-09) |

Kritik kurallar: (1) **Geri döndürülemez kayıp yok** — kovulma, ayrılık, hastalık "bekleyen karar" olarak gelir, oyuncu döndüğünde seçer. (2) **Ödül tavanı 7 gün**: 7+ gün yokluk daha çok hikâye üretir, daha çok ödül üretmez (ileri sarmanın kazancı sıfır). (3) Rapor **40 sn**: 3–6 kart × ≤ 7 sn, her kart olay + 1 NPC balonu + koç satırı; "Atla" sağ üstte **her zaman** görünür ve her kartta çalışır; atlanan rapor Koçun Defteri'nde "Sakatlık Raporu · 3 ay" satırı olarak kalır (içerik kaybolmaz). (4) Rapor streak'e dokunmaz: `days` duraklatılmış hâliyle durur, İzin +1 (tavan 2), Telafi penceresi hâlâ açıksa hatırlatılır. (5) 30+ günde ses ayarı yeniden **sorulmaz** (ayar kalıcıdır); D-026.

Ödül sabit: +1 Sakatlık İzni, **o kadar**. "Dönüş arc'ı" (T7: 3 günlük görev hattı) Koç Görevleri'ne `returning=true` bayrağıyla biner: 3 gün boyunca kolay slot "dönüş" görevidir ("Bir karar ver", "Bekleyen kararı çöz", "Bir doğum gününe ulaş"); tamamlayana kozmetik **"Sakatlıktan Döndü / Back From Injury"** Teşhisi (gizli, §2.8).

#### 2.5.2 Akış

```mermaid
stateDiagram-v2
    [*] --> Resume
    Resume --> NoReport: yokluk < 6 sa
    Resume --> OneLiner: 6–24 sa
    Resume --> Report: ≥ 1 gün
    Report --> Card1: olay + NPC balonu + koç
    Card1 --> CardN: dokunma (≤ 7 sn otomatik yok; oyuncu ilerletir)
    CardN --> Shelf: büyük bekleyen karar (14+ gün) ∨ karne rafa
    Shelf --> Flow: [Devam] → ilk gün kartı = bekleyen karar / karne
    Report --> Flow: [Atla] (her kartta)
    NoReport --> Flow
    OneLiner --> Flow
    Flow --> [*]
```

Ekran iskeleti doc 07 §3.5'tedir; bu belge kart sayısı, sıra ve içerik kaynağını belirler: Kart 1 = en yüksek `delta` olan olay (NPC balonu zorunlu), Kart 2 = sayaçlar ("Annen 14 kez aradı, patron 1. Sıralama doğru."), Kart 3+ = diğer olaylar, son kart = rafa konan büyük karar/karne. Her yokluk için en az 1 **olumlu** olay (sürpriz motoru pity'si burada da geçerli; "sen yokken her şey kötü gitti" yasak: suçluluk yok).


### 2.6 Kondisyon (miras) — D-042, D-016, D-056

#### 2.6.1 İlke: çeşitlilik, güç değil

Kondisyon, hayatlar arası tek ilerleme ekonomisidir (A3'ün MP/bagaj/güzergâh yığını D-057 ile yok). Her perk **yeni bir başlangıç koşulu, yeni bir içerik kapısı ya da bir kozmetik** açar; hiçbiri stat aralığını, Para'yı, hazard'ı, iddia oranını, pity sayaçlarını ya da olay olasılığını değiştirmez (doc 02 §2.5.3: "Kondisyon perk'leri bu aralıkları değiştirmez"). **Güç testi** (her yeni perk için, CI'da harness ile): 10.000 hayat perk'li vs perk'siz → medyan ölüm yaşı, Para persentilleri, koç isabeti, karne ortalaması **istatistiksel olarak aynı** (|Δ| ≤ harness gürültüsü); farklıysa perk reddedilir. Perk'ler Torpil'le de, parayla da, reklamla da alınamaz (00 §8 "Satılmayanlar").

#### 2.6.2 Puan ve eğri (log sıkıştırmalı)

```
lifePoints(yearsLived)  = round(6 × ln(1 + yearsLived / 12))      // 18→40: 6 · 18→74: 10 · 18→95: 12
decadePoints            = Σ DecadeReview.offList.kondisyonPoints   // doc 02: +1 / 8 "listede olmayan" seçim, tavan 5/onyıl (gerçekten yazılır; D-051)
questPoints             = +1 / görev, +1 / 3'ü tamam              // günlük tavan 4
campPoints              = +2 tamamlama, +1 ilk 10 (haftada 1 kez)
fitness.points          = kümülatif (asla düşmez)
```

Eğri kasıtlı yavaş ve logaritmiktir: uzun hayat ödüllendirilir ama "hızlı öl, puan topla" döngüsü kârlı değildir (A3 riski; 18→30'da ölmek 4 puan, 18→74 10 puan: 2,5× puan için 6× süre). Harness kabulü: ölüm yaşı ile `lifePoints` korelasyonu pozitif, `lives/week` medyanı 2–4.

#### 2.6.3 Perk listesi (1.0: 10; MVP: ilk 3)

| # | Perk TR / EN | Eşik (kümülatif puan) | Ne açar | Güç testi notu | Koç açılış TR | EN |
|---|---|---|---|---|---|---|
| K-01 | Kedi / The Cat | 6 | Yeni müşteri Pamuk/Biscuit ile başlar (`flags: hasCat`); kedi olayları havuza girer | Kedi olayları net valansı 0 (harness) | Açıldı: Kedi. Gelecek müşteri kediyle başlıyor. Kedi fikrini sormadım. | Unlocked: The Cat. Next client starts with a cat. I didn't ask the cat. |
| K-02 | Yeni Şehir / New City | 12 | Müşteri Dosyası'nda +3 başlangıç şehri (locale havuzu: TR İzmir/Eskişehir/Trabzon; EN Austin/Portland/Pittsburgh — kurgusal mahalle adları, gerçek kurum yok) | Şehir yalnızca kabuk/ikame olay seçer; ekonomi aynı | Üç şehir daha. Hepsinde kira var. Manzara değişir, bakiye değişmez. | Three more cities. All of them charge rent. The view changes; the balance doesn't. |
| K-03 | Serbest Antrenman / Free Practice | 18 | "Hedefsiz yaşa" seçilen yıllarda özel 3 olay havuzu (yalnızca hedefsizken) | Olaylar valans-nötr | Hedefsiz yaşayana özel olaylar. Planlamayan da bir şey yaşar; şimdi daha ilginç şeyler. | Events only for the goalless. People without plans still have lives; now more interesting ones. |
| K-04 | Karne Teması: Antrenman Defteri / Report Theme: Practice Log | 24 | Kozmetik karne teması (Torpil temalarından ayrı set) | — | Karnen yeni kâğıda basılıyor. Notlar aynı; kâğıt değil. | New paper for the report card. Same grades, better paper. |
| K-05 | Sessiz Sezon / Silent Season | 30 | İronik perk: koç yalnızca doğum gününde ve ölümde konuşur; Teşhis "Kulaklıklı" | Roast'un yokluğu mekanik değil | Sessiz Sezon. Konuşmayacağım. Not alacağım. Sayfalar dolacak; sen görmeyeceksin, sonra göreceksin. | Silent Season. I won't talk. I'll write. The pages fill up; you'll read them later. |
| K-06 | Transfer Listesi / Transfer List | 36 | Müşteri Dosyası'nda başlangıç kariyer ailesi seçimi (+2 aile açılış kartı; doc 04) | Kariyerler zaten dengeli; sadece sıra değişir | Kariyer seçebiliyorsun artık. Önce de seçebiliyordun; şimdi bir ekran var. | You can pick a career now. You could before, too. Now there's a screen for it. |
| K-07 | Dayı 1999 / Uncle, 1999 Edition | 44 | İlk Para olayının alternatif varyantı (dayı başka tavsiye, aynı miktar) | Aynı Birim, farklı metin | Dayın güncellendi. Hâlâ geçmişte yaşıyor; farklı bir geçmiş. | Your uncle got an update. Still lives in the past. A different past. |
| K-08 | Geç Transfer / Late Transfer | 52 | 25 yaşında başlama: ilk 7 yıl seed'den otomatik özetle gelir (karneler dolu, Tek Hedef geçmişi var) | Özet yıllar harness dağılımından; avantaj yok | Yirmi beşten başlıyorsun. İlk yedi yılı ben yazdım; sen yaşamış sayılıyorsun. Aynı şey. | You start at twenty-five. I wrote the first seven years. You're counted as having lived them. Same thing. |
| K-09 | İkinci Kalem / Second Pen | 60 | Tek Hedef'te 4. öneri slotu (daha fazla seçenek; hedefler cezasız, etki yalnızca seçim çeşitliliği) | Salience ×1,5 kuralı aynı | Bir kalem daha aldım. Dört öneri. Yine birini seçeceksin. | I bought a second pen. Four suggestions. You still pick one. |
| K-10 | Absürt Kuyruk / The Weird Tail | 70 | +12 absürt olay havuza (ölüm nedeni **değil**; D-ÖNERİ-02-10 listesi aynen) | Absürt olaylar valans-nötr etiketli | Absürt dosya açıldı. Hayat zaten saçmaydı; şimdi belgeli. | The weird file's open. Life was already absurd; now it's documented. |

Düdük renkleri, defter kapakları ve damga varyantları Kondisyon'dan değil kilometre taşlarından (§2.1.6) ve **Yedek Kulübesi** pity'sinden gelir.

#### 2.6.4 "Yedek Kulübesi" pity: her ölümde ≥ 1 açılım (D-016)

Ölümde `legacy.unlock(state)`: `fitness.points` yeni eşiği geçtiyse sıradaki perk açılır (birden fazla eşik geçildiyse hepsi, Roast Raporu'nda ilk gösterilir, diğerleri Defter'de). Eşik geçilmediyse **Yedek Kulübesi** listesinden sıradaki kozmetik verilir (deterministik sıra, rastgele değil): damga varyantı → düdük rengi → defter kapağı → Kamp forması → Roast Raporu çerçevesi (12 öğe; biterse koç bir **satır** açar: `once: 'ever'` havuzundan yeni bir koç anekdotu, Tanışıklık havuzunun dışından). Böylece her ölüm bir şey açar ve "Yedek Kulübesi" sözcüğü oyuncuya dürüstçe söylenir: TR *"Eşik geçilmedi. Yedek kulübesinden bir şey veriyorum: damga, lacivert mürekkep. Sahaya çıkmadın ama forman var."* · EN *"No threshold crossed. Something from the bench: a stamp, navy ink. You didn't make the field, but you've got the jersey."*

```ts
export function unlockOnDeath(leg: Legacy, rec: LifeRecord): { leg: Legacy; unlocks: UnlockId[] } {
  const pts = leg.fitness.points + lifePoints(rec.ageAtDeath - 18) + rec.decadeReviews.reduce((a, d) => a + d.offList.kondisyonPoints, 0);
  const newly = PERKS.filter(p => p.threshold <= pts && !leg.fitness.unlocked.includes(p.id)).map(p => p.id);
  const unlocks: UnlockId[] = newly.length ? newly : [nextBenchCosmetic(leg)];   // ≥ 1 garanti; bench boşsa 'line:*'
  return { leg: { ...leg, fitness: { points: pts, unlocked: [...leg.fitness.unlocked, ...unlocks] } }, unlocks };
}
```

"**Aynı kondisyonla / Same conditioning**": önceki hayatın aktif perk seçimini (şehir, kedi, kariyer ailesi, Sessiz Sezon açık/kapalı, Geç Transfer) kopyalar; Müşteri Dosyası kartı yine gelir (ad/şehir çekilir; kimlik tek ekran).

#### 2.6.5 Tanışıklık'ın bu belgedeki yüzeyi (D-058)

Tanımı doc 01 §2.6'dadır (hayat başına +1, tavan 5). Bu belge yalnızca **hangi seviyenin hangi yüzeyi** açtığını bağlar: seviye 1 → yeni defter açılış satırı (ölüm akışı 8. adımdan sonra); seviye 3 → Sakatlık Raporu sıcak varyantları ve kilometre taşı 100/365'te "koçum/champ"; seviye 4 → Onyıl Karnesi 60'ta koçun isteği satırı; seviye 5 → Lally kartına "kendi mottomu bulamadım" ek satırı. Güç yok, satır var.

### 2.7 Fazla Bagaj — D-018

- Ölümde `LifeRecord.highestCringeEvent` (doc 02) → `Legacy.baggage = { eventId, lifeId, cringe }`. Yeni hayatın Müşteri Dosyası kartında küçük bir satır: "Fazla Bagaj: 1 / Excess Baggage: 1" (dokununca koç: TR *"Geçen hayattan bir şey. Ne olduğunu söylemem; yüzün tanıdık geldiğinde anlarsın."* · EN *"Something from last life. I won't say what. You'll know when a face looks familiar."*).
- `pre.meta.baggage === eventId` kapılı **callback olayı** (doc 03/04 havuzu; MVP 3 varyant, 1.0 10): yeni hayatta 2–8. yıl arasında bir kez, Fazla Bagaj'ın bağlamını taşıyan bir NPC balonuyla: TR *"Yüzün tanıdık geliyor. Bir düğünde… yok, olamaz."* · EN *"You look familiar. A wedding… no. Couldn't be."* Seçenekler: kabul et (Cringe +5, Keyif +3, Teşhis "Fazla Bagajlı" ilerler), inkâr et (Cringe +0, Ego −3), yeniden yap (Cringe +15, koç defterde "Not: yine yaptı"). Hiçbir seçenek ceza sarmalı değildir; Fazla Bagaj **içeriktir**.
- Atılamaz, satılamaz, Torpil'le kaldırılamaz, Ayarlar'da gizlenemez (yalnızca ad baş harfleriyle paylaşım kartına girer).
- **Üç hayat aynı etiket** (aynı `eventId` ailesi) → Kronik hesaplayıcısına `baggageChronic` bayrağı: Kronik Teşhisi'nin Defter sayfasına ek satır ("Bagaj da aynı. Üç hayattır."). Kronik'in kendisi kalıp sırasıyla (3 hayat aynı #1 kalıp) tanımlıdır; bagaj onu **tetiklemez**, zenginleştirir (00 §4.1 "Kronik ile birleşir").

### 2.8 Teşhis koleksiyonu — T1 #8, D-014, D-024, D-063, D-064

#### 2.8.1 Kurallar

1. **Adlandırma:** antrenman/sezon sözlüğü; ≤ 3 kelime (TR) / ≤ 3 (EN); locale başına **ayrı** yazılır (çeviri değil); yargı sıfatı yok ("tembel", "başarısız", "toksik" BLOK); klinik/psikiyatrik sözcük yok (D-024: "depresif, anksiyeteli, OKB, bağımlı, narsist" BLOK — Ego eşiğinin motor adı "Narsist" UI'da görünmez); kimlik sözcüğü yok (cinsiyet, köken, din, bölge, yaş grubu); gerçek kişi/marka/karakter adı yok; "kronik" yalnızca Kronik Teşhisi'nde.
2. **Teşhis karaktere basılır**, oyuncuya değil: tetikleyiciler oyun verisidir (kalıp sayaçları, bayraklar, hayat sayısı). Oturum süresi, saat, cihaz, gerçek davranış **asla** tetik değildir. İki istisna pozitif ve ritüel kaynaklıdır (Lally günü, Sakatlıktan Döndü) ve roast satırı taşımaz.
3. **Roast satırda, adda değil.** Her Teşhis'in `coachLine[]` (≥ 3 varyant) vardır; Normal'de ≥ 1 roast, lift ≤ 6 kelime (D-027, D-064). Nazik'te kısa varyant.
4. **Kısmi ilerleme görünür** (endowed progress / Loewenstein): kilitli kartta eşik yerine ipucu ve çubuk ("7/10 — üç yıl daha erteleme yeter"); gizli (5) kartlarda yalnızca "???" ve bir cümlelik bilmece.
5. **Nadirlik harness'tan**: Yaygın ≥ %40 hayat, Seyrek %12–40, Nadir %3–12, Efsane < %3 (10.000 hayat, serbest mod). Ekranda "Oyuncuların %X'i" **yok** (sahte sosyal sayaç); yalnızca "Nadir" etiketi ve harness'tan gelen "10.000 simüle hayatın %2,1'i" cümlesi **simülasyon** ibaresiyle (T1 §1.1).
6. **3 otomatik** (ilk hayat; anlatısal gerekçeli; T1 §1.6), **5 gizli**.
7. Teşhis **anında** verilir (olay sonucunda), ölümde toplu değil; ölümde yalnızca ölüm tetikli olanlar. Hayatlar arası kalıcı (`Collections.diagnoses`), her hayatta yeniden kazanılabilir (sayaç: "×3").

#### 2.8.2 Veriliş anı (D-063 juice sözleşmesi)

Olay sonucu → stat uçuşları → **Teşhis etiketi** sağdan çarpar (120 ms spring), zemin 1 kare flaş (lime), `sfx_stamp` + Medium haptik, etiket 1,2 sn durur, Defter'e küçülerek uçar; koç satırı sonra. Tam ekran damga yalnızca Nadir/Efsane'de (doc 07 süreleri; reduced-motion'da fade). Oturumda ≥ 3 Teşhis geldiyse 4.'den itibaren yalnızca toast (yorgunluk).

#### 2.8.3 MVP 30 Teşhis

Kısaltmalar: Y yaygın, S seyrek, N nadir, E efsane; **O** otomatik, **G** gizli. Tetikler hayat içi sayaçlardır (aksi belirtilmedikçe).

| # | TR | EN | Tetik | Nad. | İpucu (kilitli kart) TR / EN |
|---|---|---|---|---|---|
| 1 **O** | İlk Antrenman | First Rep | İlk karar (FTUE 0:22) | Y | — (otomatik) |
| 2 **O** | Dosya Açıldı | File Opened | İlk karne | Y | — |
| 3 **O** | İlk Kapanış | First Close | İlk ölüm (ilk Roast Raporu) | Y | — |
| 4 | Yarıncı | Tomorrow Person | Erteleme ≥ 100 | Y | "Bir kelime: yarın." / "One word: tomorrow." |
| 5 | Okundu Bırakan | Left on Read | "Görüldü, cevap yok" ≥ 10 | Y | "Grup bekliyor." / "The group chat is waiting." |
| 6 | Cüzdan Açık | Open Wallet | Dürtüsel Harcama ≥ 60 | Y | "Kasada bir şey var, cüzdanda yok." / "Something in the cart, nothing in the wallet." |
| 7 | Herkesin Dostu | Everyone's Favorite | Herkesi Memnun Etme ≥ 80 | S | "Herkes memnun. Biri hariç." / "Everyone's happy. Except one." |
| 8 | Frensiz | No Brakes | Risk ≥ 50 | S | "Oran gördün, seçtin." / "You saw the odds. Picked it anyway." |
| 9 | Bakımlı | Well-Serviced | Kendine Bakım ≥ 40 | S | "Buzdolabı sayılmaz." / "The fridge doesn't count." |
| 10 | Mesai Hastası | Overtime Regular | Aşırı Çalışma ≥ 60 | Y | "Ofis ışığı." / "The office light." |
| 11 | Anne Hattı | Mom's Hotline | Aileye Yaslanma ≥ 30 | Y | "Numara ezbere." / "You know the number by heart." |
| 12 | Kestirmeci | Shortcut Artist | Kısa Yol ≥ 40 | S | "Yol kısa, hikâye uzun." / "Short road, long story." |
| 13 | Dik Duran | Stands Tall | Gurur ≥ 40 | S | "Özür yok." / "No apologies." |
| 14 | Bol Elli | Open-Handed | Cömertlik ≥ 40 | S | "Kimse saymaz. Biri sayar." / "Nobody counts it. Somebody does." |
| 15 | Uzun Soluklu | Long Game | Sabır ≥ 40 | S | "Hemen değil." / "Not right now." |
| 16 | Köşe Kapmaca | Duck and Cover | Kaçınma ≥ 60 | Y | "Kapı çaldı, açılmadı." / "Someone knocked. Nobody answered." |
| 17 | Koçu Yanıltan | Coach Was Wrong | Bir hayatta 5 HAKSIZ ÇIKTIM | S | "Damga: 3/5." / "Stamp count: 3 of 5." |
| 18 | İstatistik | Statistically Speaking | Bir hayatta 10 İSABET | S | "Koç haklı çıkıyor. Sık." / "The coach keeps calling it." |
| 19 | Tek Hedef, Tamam | One Goal, Done | Bir hayatta 3 hedef TAMAM | S | "TAMAM: 1/3." / "DONE: 1 of 3." |
| 20 | Hedefsiz, Saygı | Goalless, Respect | 5 yıl "Hedefsiz yaşa" | S | "Plansız yıllar: 2/5." / "Planless years: 2 of 5." |
| 21 | Okunmamış: 999 | Unread: 999 | Okunmamış ≥ 999 | N | "Sayaç 847'de." / "Counter's at 847." |
| 22 | Uzatmalar | Overtime | Ölüm yaşı ≥ 85 | N | "Sezon uzadı." / "The season ran long." |
| 23 **G** | Isınma Turunda Kaldı | Warm-Up Legend | Ölüm yaşı < 30 | E | ??? "Sezon başlamadan." / "Before the season started." |
| 24 | Kedi Sahibi | Cat Person | Pamuk ile ≥ 10 yıl | S | "Miyav: 6/10." / "Meow: 6 of 10." |
| 25 | Devre Arası Şampiyonu | Half-Time Hero | 40 Karnesi'nde hedefler ≥ 5 TAMAM | N | "Kırkta hesap var." / "There's a tally at forty." |
| 26 | Lally | Day 66 | Antrenman günü 66 (ritüel; roast yok) | S | "Bilim bir sayı söylüyor." / "Science has a number." |
| 27 | Kamp Mezunu | Camp Graduate | 1 Kamp tamamlandı | S | "Pazartesi açılır." / "Opens Monday." |
| 28 **G** | Sakatlıktan Döndü | Back From Injury | ≥ 30 gün yokluk sonrası 3 dönüş görevi tamam (ritüel; roast yok) | N | ??? "Sahaya dönüş." / "Back on the field." |
| 29 | Kronik | Chronic | 3 hayatta aynı #1 kalıp (00 §6.3) | N | "Üç defter, aynı sayfa: 2/3." / "Three notebooks, same page: 2 of 3." |
| 30 **G** | Fazla Bagajlı | Excess Baggage | Callback olayında "yeniden yap" | N | ??? "Bavul ağır." / "Heavy suitcase." |
| 31 **G** | Rakip | The Competition | "Hayat Koçu" kariyeri seçildi (doc 04 absürt liste; Motto fark eder) | N | ??? "Benim işim." / "That's my job." |
| 32 **G** | Aynı Font | Same Font | 3 yıl üst üste aynı Yılın Mottosu hücresi | N | ??? "Üç yıl, bir cümle." / "Three years, one sentence." |

MVP havuzu 30 = #1–#30; #31–#32 soft launch'ın ilk ikisi (listede, kodda bayraklı). Soft launch 45: + 8 Kamp Teşhisi (tema başına 1, "Erteleme Kampı Mezunu / Procrastination Camp Grad" biçiminde) + 7 olay tetikli. 1.0 60: + 8 Kamp + 7 NPC ilişki tetikli ("Yağmur'un Rehberinde / In Sam's Contacts"). 6. ay 120: Sezon Paketleri +10/paket, Sözlük tetikli, Onyıl tetikli.

#### 2.8.4 Veri

```ts
export interface Diagnosis {
  id: string; names: { tr: string; en: string };                // ayrı yazılır
  trigger: DiagnosisTrigger;                                     // { kind:'pattern', pattern:'procrastination', gte:100 } | { kind:'flag' ... } | { kind:'meta', ... }
  rarity: 'common'|'uncommon'|'rare'|'legendary';               // harness'tan; tuning.json'da override yok
  auto?: true; hidden?: true; ritual?: true;                    // ritual: roast satırı yok
  hint: { tr: string; en: string };                              // kilitli kart
  progress?: (s: LifeState, leg: Legacy) => { cur: number; max: number };   // kısmi çubuk; hidden'da yok
  coachLines: { tr: string[]; en: string[] };                    // ≥ 3 varyant; lint: roast ≥ 1 (Normal), lift ≤ 6
}
```

### 2.9 Sözlük koleksiyonu, Mottolar albümü ve Onyıl Karnesi — D-013, D-022, D-051

#### 2.9.1 Sözlük (Tercüme kartlarından)

- Kaynak: `document` tipi olaylardaki [Tercüme] dokunuşu (doc 03; havuzun ≤ %15'i). Her Tercüme `glossaryKey` ile Sözlük'e girer; aynı anahtar ikinci kez girmez (sayaç "×2").
- Sekmeler: Kurumsal / Ev Sahibi / Aile / Flört / Sağlık (00 §6.5); MVP 40, soft 60, 1.0 120, 6. ay 180. İlerleme sekme başına "12/24"; kilitli girişler yalnızca "— ? —" (merak boşluğu; "görmediğin 23 tercüme var" sayacı gerçek havuzdan).
- Sayfa = 1:1 paylaşım kartı: antet "SÖZLÜK / GLOSSARY", 3 giriş ("Son e-postama istinaden… → Kızgınım ve kanıtım var."), seed yok (hayata bağlı değil), wordmark. Kurum adı daima jenerik (Pelikan Bankası tipi kurgusal antet; gerçek marka BLOK).
- Tercüme **opsiyoneldir**; okumayan akışı yavaşlatmaz; Koç Görevi #4 iter, zorlamaz.

#### 2.9.2 Mottolar albümü (Yılın Mottosu koleksiyonu)

Yılın Mottosu 36 hücrelik bir matristir: **12 baskın kalıp × 3 net valans** (−/0/+), hücre başına ≥ 3 varyant (D-022). Albüm = Sözlük sekmesinin 6. sayfası "Mottolar / Mottos": 12 × 3 ızgara; görülen hücre dolu (motto metniyle), görülmeyen boş kâğıt. Bir hücrede ≥ 3 varyant görülmüşse küçük "tam" damgası. Bu, oyuncuya kendi örüntüsünü **gösterir**: Erteleme sütunu dolu, Cömertlik sütunu boş — yorum yok, sayım var (S2). Albüm sayfası 1:1 kart: 3 seçilmiş motto + "36'da 14 hücre" + HYT kodu **yok** (hayatlar arası).

#### 2.9.3 Onyıl Karnesi ekranı (30/40/50/60)

Girdi şeması doc 02 §2.6 (`DecadeReview`), puan kuralı orada; bu belge **ekranı ve bağlantıları** tanımlar:

1. Antetli evrak kartı "30 KARNESİ / AGE-30 REVIEW"; 5 satır yalnızca karar kalemleri (ev, iş, hedefler, para, kondisyon); kimlik kalemi **yok** (tip düzeyinde yok, lint'te BLOK).
2. Ayrı çizgi: **"Listede olmayan ama yaptığın şeyler: N. Puan: N."** — lift zorunlu; `kondisyonPoints` o anda `fitness.points`'e yazılır ve ekranda tik-up görünür (gerçek, D-051).
3. **Onyılın Mottoları** şeridi: o on yılın karnelerinden 10 motto (ya da kaç yıl yaşandıysa) yatay kaydırmalı; dokununca ilgili karne. Mottolar albümüne bağlanır.
4. Koç ≤ 1 balon; listeyi okur, savunmaz (00 §3.5 #19). Tanışıklık 4 ise 60 Karnesi'nde isteğini söyler.
5. Paylaşım kartı 9:16: antet, 5 satır, lift satırı, 3 motto, HYT; Fazla Bagaj ve Teşhis **yok** (kart dışarıda bağlamsız okunur).
6. Zamanlama: doğum günü kartından **önce** gelir (karne o yılın, Onyıl on yılın), toplam ≤ 12 sn, atlanabilir; Hızlı Yaşa'da otomatik 4 sn.

### 2.10 Paylaşım kartları ve seed kodları — S4

Bu belgenin kartları (şablon motoru doc 07 §2.6; ortak kurallar oradadır: yerel render, kişisel veri yok, gerçek tarih yok, sahte sayaç yok):

| Kart | Oran | Tetik | Zorunlu satır | Kod |
|---|---|---|---|---|
| Lally günü | 1:1 | days = 66 | "66 antrenman günü" + en uzun kesintisiz | HYT |
| Kamp kıyas | 1:1 | Kamp tamamlandı / hafta kapandı | **"Kohort hayalidir. / Cohort is fictional."** | KMP |
| Teşhis | 1:1 | Nadir/Efsane Teşhis verildi (ya da duvardan elle) | Teşhis adı + nadirlik + "10.000 simüle hayatın %X'i (simülasyon)" | HYT |
| Sözlük sayfası | 1:1 | Elle | 3 giriş | — |
| Onyıl Karnesi | 9:16 | Onyıl ekranı | 5 satır + lift | HYT |

**HYT kodu** (`HYT-XXXX-XXXX`): `base32( lifeSeed(32 bit) ‖ contentVersion(12 bit) ‖ crc(8 bit) )`, 10 karakter + tire; kişisel veri yok (seed = hash). İçe aktarma: Müşteri Dosyası kartında "Kod gir / Enter code" → aynı doğum koşulları, aynı olay çekilişleri (`rng` kanalları seed'den), kararlar farklı → "Aynı hayat, farklı sen / Same life, different you" (iki karne yan yana, elle ekran görüntüsü). `contentVersion` eşleşmiyorsa uyarı: TR *"Bu hayat eski bir sürümden. Oynanır; bazı günler farklı gelebilir."* · EN *"This life is from an older version. It'll play; some days may differ."* Deep link `motto://life/HYT-…` (`expo-linking`); universal link statik sayfa Sprint 0 alan adıyla (backend yok). **KMP kodu** §2.3.6.

Tek büyüme metriği çifti: `share_export`, `seed_import` (hedef §6.1).


---

## 3. Örnek içerik — concrete samples TR + EN

### 3.1 Mola ve streak koç satırları (ctx etiketli; Normal ağız; ≥ 1 roast, lift ≤ 6 kelime)

| ctx | TR | EN |
|---|---|---|
| `mola.first` | Günün ilk kararı. Yanlış da olsa benim için malzeme. Sayaç: 1. | First decision of the day. Even wrong, it's material. Count: one. |
| `mola.done` | Bak, yapabiliyormuşsun. Not aldım; küçük harfle. | Look at that. Reps. Noted, small letters. |
| `mola.done.v2` | Düdük doldu. Çalmayacağım; hiç çalmadım. Ama doldu. | Whistle's full. I won't blow it. I never have. But it's full. |
| `streak.paused` | 3 gün yoktun. Antrenman kaçırdın. Ceza yok; gıcıklık için varım, ceza için değil. Sayaç: 47 gün, duraklatıldı. | Three days, no practice. No penalty; I'm here to annoy you, not to fine you. Streak: 47, paused. Like a gym membership, but honest. |
| `streak.bridged.freeze` | Dün gelmedin. Sakatlık İzni devreye girdi; iki vardı, bir kaldı. Sayılar böyle. | You skipped yesterday. Injury leave covered it; had two, one left. That's how numbers work. |
| `streak.bridged.weekend` | Hafta sonu. Antrenman yok, ceza yok. Pazartesi görüşürüz; takvim öyle diyor, ben değil. | Weekend. No practice, no penalty. See you Monday; the calendar says so, not me. |
| `streak.broken.first` | Kesintisiz seri: 23'te durdu. Rekor olarak kaldı. Toplam sayaç duruyor: 47. İki gün üst üste gelirsen boşluğu kapatırım; kalemle. | Unbroken run: stopped at 23. Stays as a record. The total's still 47. Two days in a row and I'll close the gap. In pen. |
| `streak.makeup.done` | Telafi tamam. Takvimde boşluk yok. Olmuştu; artık yok. Ben öyle diyorum. | Make-up done. No gap on the calendar. There was one; now there isn't. My call. |
| `streak.offseason` | Sezon arası. Dokuz gün. Sayaç uyuyor, ben uyumam ama beklerim. | Off-season. Nine days. The count sleeps. I don't, but I wait. |
| `streak.tamper` | Takvim ileri gitmiş. Defterim gitmemiş. İkisini de sayıyorum, birini küçük yazıyorum. | The calendar jumped ahead. The notebook didn't. I'm counting both; one in smaller handwriting. |

### 3.2 Bildirimler — 30 karakter mesajı + 10 koç satırı (OS yüzeyi; ≤ 110 karakter; emoji yok; her biri `pre` ile oyun verisine bağlı)

Biçim: **Başlık** → gövde. Koç parantezi `(… — M.)` yalnızca gövdenin sonunda ve ≤ 40 karakter.

| # | Başlık | Pre | TR | EN |
|---|---|---|---|---|
| N-01 | Anne / Mom | her zaman | Yemek yedin mi? (Deniz'e soruyor. — M.) | Did you eat? (She means Alex. — M.) |
| N-02 | Anne / Mom | Anne Baskısı ≥ 50 | Komşunun oğlu nişanlanmış. Söylemiş olayım. | The neighbor's son got engaged. Just saying. |
| N-03 | Anne / Mom | işsiz | Bir yerlere başvurdun mu? Sormuyorum, merak ettim. | Did you apply anywhere? Not asking. Wondering. |
| N-04 | Anne / Mom | Okunmamış ≥ 200 | Mesajları okuyor musun? | Are you reading these? |
| N-05 | Anne / Mom | lapsed L3 | Üç gündür ses yok. İyi misin? (Oyunda üç hafta. — M.) | Three days, nothing. Are you okay? (Three in-game weeks. — M.) |
| N-06 | Barış / Jordan | ev arkadaşı | KESİN BİR ŞEY BULDUM. GEL. | I DEFINITELY FOUND SOMETHING. COME HOME. |
| N-07 | Barış / Jordan | Para < 0 | KİRA. BİLİYORUM. BEN DE BİLMİYORUM. | RENT. I KNOW. I ALSO DON'T KNOW. |
| N-08 | Barış / Jordan | kedi var | KEDİ BİR ŞEY YAPTI. İYİ DEĞİL. | THE CAT DID A THING. NOT A GOOD THING. |
| N-09 | Barış / Jordan | zarf: kripto | BU SEFER KESİN. GRAFİĞİ GÖRMEN LAZIM. | THIS TIME IT'S REAL. YOU NEED TO SEE THE CHART. |
| N-10 | Nevin Hanım / Ms. Carver | çalışıyor | Yarın 09:00, odamda. Konu: sen. | Tomorrow, 9 a.m., my office. Subject: you. |
| N-11 | Nevin Hanım / Ms. Carver | zarf: terfi | Gelişim alanlarınızı konuşalım. (Tercüme zarfta. — M.) | Let's discuss your growth areas. (Translation's in the envelope. — M.) |
| N-12 | Nevin Hanım / Ms. Carver | zarf: işten çıkarma riski | Yeniden yapılanma var. Herkes için. (Herkes değil. — M.) | There's a restructuring. For everyone. (Not everyone. — M.) |
| N-13 | Nevin Hanım / Ms. Carver | Aşırı Çalışma ≥ 30 | Hafta sonu e-postama bakmanıza gerek yok. (Bakacaksın. — M.) | No need to check email this weekend. (You will. — M.) |
| N-14 | Yağmur / Sam | arc açık | Konuşmamız lazım. | We should talk. |
| N-15 | Yağmur / Sam | ayrılık sonrası 1 yıl | Eşyan kaldı. | Your stuff's here. |
| N-16 | Yağmur / Sam | metaMemory: terk edildi | Hâlâ numaram var. | Still have your number. |
| N-17 | Şükran Teyze / Mrs. Dale | komşu | Kapının önünde koli var. Ben bakıyorum. | There's a package at your door. I'm watching it. |
| N-18 | Şükran Teyze / Mrs. Dale | site aidatı (TR) / HOA (EN) | Aidat toplantısı yarın. Gelmeyen haklı sayılmıyor. | HOA meeting tomorrow. Absent means you agree. |
| N-19 | Dayı / Your uncle | Para < 2 Birim | Hayata atıldın mı? Atılmadıysan bir şey göndereyim. | Have you gotten started? If not, I can send something. |
| N-20 | Dayı / Your uncle | yıl sonu | Düğün var. Takı takacaksın. Ne kadar, sorma. | There's a wedding. Bring a gift. Don't ask how much. |
| N-21 | Pamuk / Biscuit | kedi var | Miyav. (Mama. — M.) | Mrow. (Food. — M.) |
| N-22 | Pamuk / Biscuit | kedi, 3+ gün yokluk | Miyav. (Üç gündür. Ben baktım. — M.) | Mrow. (Three days. I fed him. — M.) |
| N-23 | Taksici / The cab driver | havaalanı arc'ı | Yoldayım. Trafik var. Hep var. | On my way. Traffic. There's always traffic. |
| N-24 | Ev Sahibi / Landlord | kiracı | Evladım gibisin ama… (Zam. Sözlükte. — M.) | You've been like family, but… (Rent. It's in the glossary. — M.) |
| N-25 | İK / HR | başvuru bekliyor | Başvurunuz değerlendirme aşamasındadır. (Hâlâ. — M.) | Your application is under review. (Still. — M.) |
| N-26 | İK / HR | zarf: iş teklifi | Sizinle bir fırsatı paylaşmak isteriz. Oran %48. | We'd love to share an opportunity. Odds: 48 percent. |
| N-27 | Doktor / Doctor | check-up ertelendi ≥ 2 | Randevunuz yeniden planlanabilir. Üçüncü kez. | Your appointment can be rescheduled. For the third time. |
| N-28 | Kombi Ustası / The furnace guy | kış, ev arc'ı | Parça gelmedi. Haftaya. (Geçen hafta da haftaya demişti. — M.) | Part's not in. Next week. (He said next week last week. — M.) |
| N-29 | Kurye / Courier | koli olayı | Teslim edilemedi: adreste yoktunuz. Evdeydin. | Delivery failed: recipient absent. You were home. |
| N-30 | Banka / The bank (kurgusal antet) | Para < 0 | Değerli müşterimiz, hesabınız incelenmektedir. (Paran yok. Biliyoruz. — M.) | Dear valued customer, your account is under review. (You're broke. We know. — M.) |
| C-01 | Motto | zarf | Defterde açılmamış bir zarf var. Açmadım. Hâlâ. | There's an unopened envelope in the notebook. I haven't opened it. Still. |
| C-02 | Motto | mola | Bugün tek bir karar. Yanlış da olsa malzeme. | One decision today. Even a wrong one is material. |
| C-03 | Motto | at-risk 21:00 | Bir saat kaldı. Sayaç 47. Tek karar yeter. Bir. | An hour left. Count's at 47. One decision. One. |
| C-04 | Motto | days=65 | 66. gün yarın. Lally günü. Bir araştırma var; anlatırım. | Day 66 is tomorrow. Lally day. There's a study. I'll explain. Briefly. |
| C-05 | Motto | Pazartesi | Pazartesi. Kamp açıldı: bu hafta tek kas, Sabır. Hayali 40 kişiyle yarışıyorsun. | Monday. Camp's open: one muscle this week, Patience. You're up against forty fictional people. |
| C-06 | Motto | Cuma, kamp başlandı | Kamp Pazar biter. Hayali Ayşe önde. Hayali olması durumu değiştirmiyor. | Camp ends Sunday. Fictional Dana's ahead. Being fictional hasn't slowed her down. |
| C-07 | Motto | lapsed L7 | Bir hafta. Defteri kapatmadım; açık bırakmak alışkanlık. | A week. I haven't closed the notebook. Leaving it open is a habit. |
| C-08 | Motto | lapsed L21 | Tamam, susuyorum. Hayatın bensiz de devam eder; benimki de sensiz. Kapı açık. | These reminders aren't working. I'll stop. Your life goes on without me; mine without you. Door's open. |
| C-09 | Motto | lapsed L30 | Son bildirim. Defter kapanmadı; KAPANDI damgasını yalnızca ölüme basarım. | Last notification. The notebook isn't closed. I only stamp CLOSED for a death. |
| C-10 | Motto | Onyıl yarın | Karakterin 30 oluyor. Onyıl Karnesi. Listeyi ben yazmadım. | Your character turns thirty. Decade review. I didn't write the list. |

### 3.3 Sakatlık Raporu — tam örnek (gerçek 19 gün yokluk → 210 oyun günü; Normal ağız)

**TR** — Kart 0 (başlık): **SAKATLIK RAPORU** · "19 gün yoktun. Karakter döndü. 7 ay geçti." · [Atla] sağ üstte.
Kart 1: *Nevin Hanım:* "Yeniden yapılanma oldu. Masanız duruyor." — Koç: "Masa duruyor. Sandalye konusunu açmadı; ben de açmadım."
Kart 2: Sayılar — "Annen 14 kez aradı, patron 1, Yağmur 0. Sıralama doğru. Okunmamış: 847 → 902."
Kart 3: *Şükran Teyze:* "Kedin benimle kaldı. Alıştı. Ben de." — Koç: "Pamuk sana dönecek. Sanırım. Kediler oy kullanmaz."
Kart 4: *Barış:* "KİRA ZAMMI GELDİ. BEN BİR ŞEY BULDUM. KESİN." — Koç: "Zam gerçek. Barış'ın bulduğu şey zarfta; açmadım."
Kart 5 (rafa): **BEKLEYEN KARAR** — *Yağmur:* "Konuşmamız lazım." — Koç: "Yedi aydır bekliyor. Sen de yedi ay bekledin; ödeşmiş sayılırsınız. İlk gün bu."
Alt satır: "Sakatlık İzni +1 · Sayaç: 47, duraklatıldı · [Devam]"

**EN** — Card 0: **INJURY REPORT** · "Nineteen days out. Your character's back. Seven months passed." · [Skip].
Card 1: *Ms. Carver:* "There was a restructuring. Your desk is still here." — Coach: "The desk is still here. She didn't mention the chair. Neither did I."
Card 2: Numbers — "Mom called fourteen times, your boss once, Sam zero. Correct order. Unread: 847 → 902."
Card 3: *Mrs. Dale:* "Your cat stayed with me. He's used to it. So am I." — Coach: "Biscuit will come back to you. Probably. Cats don't vote."
Card 4: *Jordan:* "RENT WENT UP. I FOUND SOMETHING. DEFINITELY." — Coach: "The rent part is real. What Jordan found is in an envelope. Unopened."
Card 5 (shelf): **PENDING DECISION** — *Sam:* "We should talk." — Coach: "Been waiting seven months. So have you. Call it even. That's day one."
Footer: "Injury Leave +1 · Count: 47, paused · [Continue]"

### 3.4 Kamp — hafta sonucu ve kıyas satırları

TR: **ERTELEME KAMPI · W47** — "Sen: 71 puan · Karne ort. Orta · 63 yaş · 'yarın' kilidi 9 kez denendi · 12/41" — "hayali Ayşe: 78 · İyi · 71 yaş" — Koç: "On ikincisin. Kırk kişiden on biri senden iyi; hepsi hayali. Hayali olmak kolaylaştırmıyor; sordum." — **Kohort hayalidir.** — KMP-7K3Q
EN: **PROCRASTINATION CAMP · W47** — "You: 71 pts · avg. grade C · age 63 · tried the 'tomorrow' lock 9 times · 12/41" — "fictional Dana: 78 · B · age 71" — Coach: "Twelfth. Eleven of forty did better; all of them fictional. Being fictional doesn't make it easier. I asked." — **Cohort is fictional.** — KMP-7K3Q

### 3.5 Teşhis koç satırları (veriliş anı; 6 örnek)

| Teşhis | TR | EN |
|---|---|---|
| Yarıncı / Tomorrow Person | Yüz kez "yarın". Yarın bir tarih değil, bir yer; orada yaşıyorsun. Bugün bir karar. | A hundred "tomorrows." Tomorrow isn't a date; it's an address. You live there. Today, one decision. |
| Okundu Bırakan / Left on Read | On kez görüldü, sıfır cevap. Annen saymıyor. Ben sayıyorum; iş bu. | Seen ten times, replied zero. Your mom isn't counting. I am. It's the job. |
| Koçu Yanıltan / Coach Was Wrong | Beş damga. Mürekkep bitti; yeni aldım. Masraf senden sayılır. | Five stamps. Ran out of ink; bought more. I'm expensing it to you. |
| Hedefsiz, Saygı / Goalless, Respect | Beş yıl hedefsiz. Saygı duyuyorum; not da aldım. İkisi aynı anda olur. | Five years, no goal. Respect. Also noted. Both can be true. |
| Lally / Day 66 *(ritüel, roast yok)* | 66. Bilim bir sayı söyledi, sen de aynı sayıyı söyledin. Kart hazır. | Sixty-six. Science said a number; you said the same one. Card's ready. |
| Kronik / Chronic | Üç defter, aynı ilk sayfa. Kalıp değişmedi. Ben değiştim; daha az konuşuyorum. | Three notebooks, same first page. The pattern didn't change. I did. I talk less now. |

---

## 4. Platform notları (iOS / Android)

| Konu | iOS | Android | Nasıl ele alıyoruz |
|---|---|---|---|
| Bekleyen yerel bildirim tavanı | **64** (UNUserNotificationCenter; 65+ sessizce düşer) | ~500 (pratikte), ama Doze/hibernation silebilir | Planlı ≤ 12, ufuk ≤ 30 gün, her RESUME/SUSPEND'de `cancelAll + replan` |
| İzin | `requestPermissionsAsync` bir kez; `canAskAgain=false` sonrası sistem ayarı; provisional **kullanılmıyor** (D-ÖNERİ-05-08) | Android 13+ `POST_NOTIFICATIONS` runtime; **≥ 1 kanal oluşturulmadan diyalog görünmez**; 2. oturumdan önce asla (D-030) | Kanallar boot'ta: `defter` (default), `mola` (default), `sessiz` (low; lapsed L30 `passive` eşleniği); soft-ask Android'de `sessionCount ≥ 2` kilidi |
| Teslim zamanı | Dakika hassasiyeti; `interruptionLevel: 'active'` (timeSensitive/critical **asla**: entitlement + politika) | `delivery: 'bestEffort'` (`setExactAndAllowWhileIdle`); exact alarm izni **istenmez** (Play yalnızca alarm/takvim uygulamalarına); Doze'da gecikme olası; Android 15 cooldown | Kopya saat söylemez ("bu akşam"); at-risk 21:00 (22:30'a kaymasın); iki bildirim ≥ 20 sa aralıklı (15 dk Doze kuralının çok üstünde) |
| Hibernation / unused apps | — | Android 11+ izin sıfırlama, 12+ hibernation (≈ 3 ay): bekleyen alarmlar ve izinler silinebilir; reboot/force-stop da siler | Lapsed merdiveni D30'da biter; dönen oyuncuda izin yeniden okunur (`getPermissionsAsync`), sessizce; ret varsa sorulmaz |
| Zengin içerik | `attachments` (karakter portresi yok — avatar v1'de yok, D-ÖNERİ-07-06), `threadIdentifier` NPC gruplaması, `categoryIdentifier` aksiyonları | `largeIcon`/`color` sınırlı; aksiyon butonları var; grup `groupKey` | Görsel ek yok (iki platformda eşit yüzey); aksiyonlar üç kategori (§2.4.4) |
| Uygulama adı yüzeyi | Başlık altında "Motto" sistem tarafından gösterilir | Kanal adı/ikon görünür | NPC adı başlıkta; "Motto" uygulama adı ayrıca yazılmaz (çift ad yok) |
| Güvenilir saat | `ProcessInfo.systemUptime` → required-reason API (`35F9.1`) privacy manifest | `SystemClock.elapsedRealtime()`; izin yok | MVP `performance.now()` (süreç içi); soft launch `modules/motto-clock` (doc 10 Δ5) |
| Saat dilimi / DST | `localDay` cihaz yerel takviminden; DST'de gün 23/25 saat | `ACTION_TIMEZONE_CHANGED` sonrası RESUME'da yeniden hesap | `dayDiff` yerel takvim gününe göre (UTC ile değil); 20 sa monoton kuralı DST'yi tolere eder |
| Paylaşım | `expo-sharing` sistem sheet'i; `expo-media-library` "add only" izni yalnızca [Kaydet]'te | Share Intent; Android 10+ MediaStore ile kaydetme izinsiz, 13+ `READ_MEDIA_IMAGES` yalnızca okuma için (istenmez) | Render ≤ 400 ms; kaydetme izni dokununca; hiçbir izin açılışta |
| Deep link | Universal link için `apple-app-site-association` statik dosya (alan adı Sprint 0) | App Links `assetlinks.json` statik; Android 12+ doğrulanmış link gerekir yoksa chooser | `motto://` özel şema her iki platformda hemen; doğrulanmış linkler alan adıyla |
| Arka plan hesaplama (kohort) | Arka plan süresi ~5 sn; kohort üretimi **ön planda**, ilk 10 bot anında, kalanı oturum içinde `InteractionManager` sonrası | Aynı; düşük segment cihazda JS thread'i bloke etmemek için 5 botluk dilimler | Toplam ≤ 3 sn orta Android; bitmeden sıralama "hesaplanıyor" değil, **"10/40 hazır"** (gerçek sayı) |
| Mağaza | Apple 4.5.4: push oyun için şart değil, pazarlama push'u yok; 2.5.18/2.3.8 kart ve bildirim içerik vitrini 4+ | Play: bildirim yalnızca entegre özellik için, sistem uyarısı taklidi yok; Deceptive Behavior → "hayali" etiketi | Bildirim havuzu Normal varyant; "hayali/fictional" lint; IAP push yok |
| Erişilebilirlik | VoiceOver: Teşhis çarpması `accessibilityAnnouncement`; reduced-motion'da fade | TalkBack aynı; `reduceMotion` ayarı okunur | Tüm juice D-063 sürelerinde, reduced-motion'da kapanır |

İki platformda **aynı davranış** garantisi: `NotificationPlanner`, `StreakService`, `AbsenceEngine`, `CampService`, `Legacy` tamamen saf TS'dir (doc 10); platform farkı yalnızca `NotificationPort`/`ClockPort`/`SharePort` adaptörlerindedir ve Playwright web export'ta bu port'lar no-op iken tüm akışlar aynı koşar.

---

## 5. Hukuk ve politika kontrolü

### 5.1 Kırmızı çizgi eşlemesi (T9 ve 00 §1.2 → bu belgedeki mekanizma)

| Çizgi | Bu belgede nasıl kalıyoruz |
|---|---|
| Streak sıfırlama/utandırma, streak/İzin/Telafi satışı (00 §1.2; DMCC "kayıp korkusuyla satış"; Reklam Kurulu karanlık tasarım) | `days` asla azalmaz; "kaybettin/lost" lint BLOK; İzin otomatik ve ücretsiz; Telafi ücretsiz; hiçbir streak öğesi IAP/reklam/Torpil'de değil; at-risk bildirimi yalnızca gerçek riskte |
| Sahte sosyal kanıt, sahte sayaç (Google Deceptive Behavior, UCPD, 00 §1.2) | Kohort "hayali/fictional" etiketi üç yerde zorunlu, lint'te; Teşhis nadirliği "simüle hayat" ibaresiyle; "şu an X kişi" hiçbir yerde |
| Sahte aciliyet / geri sayım (DMCC, Reklam Kurulu 2024) | Kamp geri sayımı gerçek takvim; "son şans/kaçırma" BLOK; bildirim tavanları koda gömülü |
| Oyuncunun gerçek hayatına yönelik roast/yorum (D-050; Apple "creepy"; KVKK) | Bildirim öznesi NPC/koç/karakter; yokluk "karakter sen yokken"; gerçek saat yalnızca `tired` etiketi (doc 01); konum/takvim/sağlık/adım verisi **hiç okunmaz** |
| Gerçek dünya görevi / wellness kayması (D-006; Apple 1.4.5) | Koç Görevleri yalnızca oyun içi fiiller; gerçek dünya fiili lint BLOK; metadata'da "alışkanlık/wellness" yok |
| Kimlik/klinik etiket (TCK 125 komşuluğu; D-024; Apple 1.1) | Teşhis adı yasak sözlüğü (§2.8.1); Onyıl Karnesi kimlik kalemi yok (tip düzeyinde) |
| Din/etnisite/siyaset/gerçek kişi/marka (T9 #1–2, #11) | Kamp temaları takvime değil kalıba bağlı; sezonluklar mevsimsel ve kurgusal; NPC/kurum antetleri jenerik ("Banka", "İK"); isim havuzu blocklist'li; 10 Kasım'da yalnızca sessizlik, gönderme yok |
| Askerlik "sakatlık" (TCK 318) | "Sakatlık İzni/Raporu" sözcüğü yalnızca streak/welcome-back bağlamında; askerlik olaylarında lint BLOK (D-047) |
| KVKK / veri | `installId` cihazda rastgele, reklam kimliği değil, cihazı terk etmez; seed kodları kişisel veri içermez; paylaşım kartında custom ad baş harf; analytics opsiyonel ve anonim (D-054); bildirim verisi cihazda |
| 16+ ve mağaza vitrini (D-037, Apple 2.3.8) | Bildirim ve kart metinleri Normal varyant + 4+ sözlük; küfür yok |

### 5.2 Bilinçli olarak tasarımdan çıkarılan en cazip 5 ihlal

1. **"Streak'in tehlikede! 2 ₺'ye kurtar"** — Duolingo'nun en kârlı mekaniği; D-029 + DMCC + Reklam Kurulu. Yerine: otomatik İzin, ücretsiz Telafi, sıfırlanmayan sayaç.
2. **Kohortu "bu hafta seninle aynı hayatı yaşayan 3.412 oyuncu" diye sunmak** — sosyal kanıt dopamini; Google Deceptive Behavior/UCPD. Yerine: 40 bot, "hayali" üç yerde.
3. **"Son 24 saat: Sezon Paketi %40 indirim" bildirimi** — açılış oranı yüksek; Apple 4.5.4 + DMCC sahte aciliyet. Yerine: IAP bildirimi kategorisi hiç yok.
4. **Welcome-back'te "sen yokken 17 gün geçti, işsiz misin?" tarzı gerçek-hayat esprisi** — A1'in cazip graftı; D-050 + Apple "mean-spirited" + KVKK çıkarım riski. Yerine: tüm sayılar oyun verisinden, özne karakter.
5. **Koç Görevi'nde "bugün gerçekten annenizi arayın"** — motivasyon vaadi, SDT'nin gerçek yeterlik hissi; Apple 1.4.5/wellness kayması + D-006. Yerine: yalnızca oyun içi; "Gerçek hayatta yardım" ekranı ayrı ve şakasız.

(+ gölge adaylar: Teşhis adlarında "Kronik Depresif" tipi klinik şaka — D-024; gerçek doğum gününe bağlı bildirim — D-050; provisional iOS bildirimle izin ekranını atlatmak — "bir kez sorarız" vaadi.)

---

## 6. Ölçüm ve kabul kriterleri

### 6.1 KPI'lar (00 §2.2 ile hizalı; doc 11 ölçer; backend'siz, opsiyonel analytics)

| Alan | KPI | Olay / hesap | Hedef (soft launch) |
|---|---|---|---|
| Retention | D1 / D7 / D30 | cohort | ≥ %40 / ≥ %18 / ≥ %8 (kapı: 35/15/6) |
| Streak | DAU'nun `days ≥ 3` payı | `streak_day` | ≥ %45 |
| Streak | `run` kırılması sonrası 7 gün dönüş | `streak_broken → session ≤ 7d` | ≥ %50 |
| Streak | Telafi kullanımı → 7 gün sonra aktif | `makeup_done` | ≥ %60 |
| Streak | 66. güne ulaşan (90 gün kohortu) | `milestone{66}` | ≥ %8 |
| Görev | Günlük görev tamamlama (≥ 1 / 3) | `quest_done` / DAU | ≥ %55 / ≥ %25 |
| Kamp | WAU'nun Kamp başlatma payı / tamamlama | `camp_start`, `camp_done` | ≥ %40 / ≥ %20 |
| Kamp | Kıyas kartı paylaşımı / kamp tamamlama | `share_export{camp}` | ≥ %10 |
| Bildirim | Soft-ask kabul / sistem izni (iOS/Android) | `softask_yes`, `perm_granted` | ≥ %60 / iOS ≥ %50, Android ≥ %60 |
| Bildirim | Open rate (genel / karakter mesajı) | `push_open` / planlanan | ≥ %8 / ≥ %12 |
| Bildirim | Push kaynaklı oturum payı | `session_start.source=push` | %20–30 (üstü bağımlılık sinyali) |
| Bildirim | "Beni rahat bırak" | `quiet_mode_on` | < %5 |
| Bildirim | Push günü + 72 sa sessizlik (uninstall proxy) | — | < %15 |
| Welcome-back | Tamamlama (atlanmadan) | `wb_shown → wb_completed` | ≥ %75 |
| Welcome-back | Rapor sonrası ilk Mola | `wb → decision ≤ 5 dk` | ≥ %85 |
| Miras | Ölüm → yeni hayat (2 dk) | `death → new_client` | ≥ %65 |
| Miras | "Aynı kondisyonla" payı | `same_conditioning` | %25–50 (üstü perk çeşitliliği yetersiz) |
| Koleksiyon | Hayat başına Teşhis | `diagnosis_granted` | medyan 4–7 (ilk hayat ≥ 3 otomatik + ≥ 1) |
| Koleksiyon | Sözlük ilerlemesi (30 gün) | `glossary_add` | medyan ≥ 15/40 |
| Viral | `share_export` / oturum · `seed_import` / install | — | ≥ %3 · ≥ %2 |

### 6.2 Harness ve simülasyon testleri (CI; `packages/engine` saf TS; vitest + fast-check)

1. **Streak property testleri** (fast-check, 10.000 rastgele gün dizisi × saat dilimi × DST × tamper): `days` monoton artan; `run ≤ days`; `bestRun ≥ run`; İzin 7 günde en fazla 1 yenilenir; Telafi 30 günde 1; aynı `localDay` iki kez sayılmaz; 20 sa kuralı.
2. **Planner testleri**: rastgele durum × 90 gün → hiçbir gün > 1, hiçbir kayan 7 gün > 5, sessiz saat/sessiz gün ihlali 0, plan ≤ 12, ufuk ≤ 30 gün, at-risk yalnızca `freezes=0`; `lifeEnded` sonrası plan boş; quiet mode sonrası plan boş.
3. **AbsenceEngine**: deterministiklik (aynı girdi aynı rapor), ödül tavanı (7 gün = 30 gün), 365 gün tavanı, raporda ölüm 0, büyük karar yalnızca 14+ günde, her raporda ≥ 1 pozitif olay.
4. **Kamp kohortu**: 40 botun skor dağılımı (10.000 haftalık seed): medyan 45–65, p10 ≥ 20, p90 ≤ 90; oyuncu "balanced" politikasıyla medyan sıra 15–25 (ne çok kolay ne imkânsız); `locale`/`contentHash` değişince seed değişir, aynı haftada aynı seed.
5. **Kondisyon güç testi**: 10.000 hayat her perk açık vs kapalı → medyan ölüm yaşı, Para p50/p90, koç isabeti, karne ortalaması farkı ≤ gürültü (bootstrap %95 aralığı); `lifePoints` ile ölüm yaşı korelasyonu > 0; `lives/week` simülasyonu 2–4.
6. **Teşhis nadirliği**: 10.000 serbest hayatta her Teşhis'in oranı tanımlı banda düşer; otomatik 3'ü %100; gizli 5'i < %12; hayat başına medyan 4–7; hiçbir hayat 0 Teşhis.
7. **Lint**: `camp.*` string'lerinde "hayali/fictional" zorunlu; `notif.*`'te yasak sözlük (son şans, kaçırma, işsiz, gerçek konum/saat); `quest.*`'te gerçek dünya fiili listesi; Teşhis adı yasak sözlüğü; Onyıl şemasında kimlik alanı yok (tip testi).

### 6.3 Kabul kriterleri (AC-05-nn; sprint planına doğrudan girer)

| ID | Kriter | Doğrulama |
|---|---|---|
| **AC-05-01** | Streak yalnızca günün ilk **kararında** artar; uygulama açılışı, welcome-back kartı ve Hızlı Yaşa'da otomatik çözülen beat'ler artırmaz | birim + e2e |
| **AC-05-02** | `days` hiçbir durum geçişinde azalmaz; ekranda hiçbir zaman "0" ya da "kaybettin" görünmez | property test + lint |
| **AC-05-03** | Kaçırılan gün 00:00'da otomatik İzin'le köprülenir (2 slot, 7 günde 1 yenilenir); İzin hiçbir mağaza/reklam yüzeyinde yoktur | birim + doc 06 çapraz test (IapProvider ürün listesi) |
| **AC-05-04** | Telafi: 48 sa içinde 2 ardışık Mola `run`'ı geri getirir; 30 günde 1; ücretsiz | birim |
| **AC-05-05** | Hafta sonu muafiyeti varsayılan açık, Ayarlar'dan kapanır; kapalıyken Cmt/Paz normal gün | birim + e2e |
| **AC-05-06** | 8 kilometre taşı doğru günde tetiklenir, her biri 1 kozmetik + 1 koç satırı verir; 66'da Lally kartı render ≤ 400 ms | e2e + snapshot |
| **AC-05-07** | Koç Görevleri aynı gün/cihaz/içerik sürümünde deterministik; 1'i absürt; 14 gün tekrar yok; ödül yalnızca Kondisyon puanı | birim |
| **AC-05-08** | Görev havuzunda gerçek dünya fiili içeren satır lint'i geçemez (örnek negatif test: "bir bardak su iç") | lint testi |
| **AC-05-09** | Kamp seed'i `hash(isoWeek+locale+contentHash)`; Pazartesi 00:00 yerel açılır; aynı hafta iki cihazda aynı başlangıç ve aynı 40 bot | birim (iki seed karşılaştırması) |
| **AC-05-10** | 40 hayali kohort cihazda headless üretilir; orta Android'de ilk 10 bot ≤ 1,5 sn, toplam ≤ 3 sn; UI "N/40 hazır" gerçek sayıyı gösterir | perf test (Pixel 6a sınıfı) |
| **AC-05-11** | Kamp sıralaması, satır adları ve kıyas kartı "hayali/fictional" etiketini taşır; eksikse lint release'i bloklar | lint + snapshot |
| **AC-05-12** | Bildirim planı: günde ≤ 1, kayan 7 günde ≤ 5, 22:30–09:00 ve `quietDays` ihlali 0, planlı ≤ 12, ufuk ≤ 30 gün; her RESUME/SUSPEND'de cancelAll + replan | property test + cihaz testi (`getAllScheduledNotificationsAsync` sayımı) |
| **AC-05-13** | Streak-at-risk bildirimi yalnızca `freezes=0 ∧ bugün Mola yok ∧ muafiyet yok` koşulunda planlanır | birim |
| **AC-05-14** | Soft-ask yalnızca `ask-consent` efektiyle (ilk "Bugünlük yeter" ∧ ≥ 8 dk ∧ ilk karne); Android'de ek olarak `sessionCount ≥ 2`; sistem reddi sonrası yeniden sorulmaz | e2e (iOS sim + Android emu) |
| **AC-05-15** | Her bildirim başlığı NPC adı ya da "Motto"; gövde ≤ 110 karakter, emoji yok, yasak sözlük yok; her karakter mesajı `pre` koşulunu sağlamadan planlanmaz | lint + birim |
| **AC-05-16** | `lifeEnded` → tüm planlı bildirimler iptal; yeni hayatın ilk oturumundan önce bildirim yok | birim + cihaz |
| **AC-05-17** | Sakatlık Raporu: gün bazlı tablo; 3–6 kart; Atla her kartta görünür; rapor ≤ 40 sn (otomatik akış yok, kart sayısıyla sınır); +1 İzin (tavan 2); 7 gün ödül tavanı; 365 gün zaman tavanı; raporda ölüm 0 | birim + e2e |
| **AC-05-18** | 14+ gün yoklukta son kart "büyük bekleyen karar"; rafa konur, çözülmez; ilk gün kartı o karardır | e2e |
| **AC-05-19** | Her ölümde `unlocks.length ≥ 1`; eşik geçilmediyse Yedek Kulübesi kozmetiği deterministik sırayla; koç satırı "yedek kulübesi" sözcüğünü içerir | harness (10.000 ölüm) |
| **AC-05-20** | Kondisyon güç testi: her perk için harness farkı gürültü bandında; başarısız perk CI'da reddedilir | CI harness |
| **AC-05-21** | Fazla Bagaj: `highestCringeEvent` yeni hayata etiket olarak biner, Müşteri Dosyası'nda görünür, 2–8. yılda 1 callback olayı tetiklenir; kaldırma/satın alma yolu yoktur; 3 hayat aynı → Kronik sayfasına ek satır | birim + e2e |
| **AC-05-22** | 30 Teşhis (3 otomatik, 5 gizli) tanımlı; ilk hayatta 3 otomatik verilir; nadirlik bantları harness'ta doğrulanır; kilitli kart ipucu + çubuk gösterir, gizli kart yalnızca "???" | harness + snapshot |
| **AC-05-23** | Teşhis adı yasak sözlüğü (klinik/kimlik/sıfat) lint'te; örnek negatif test ("Kronik Depresif") bloklanır | lint testi |
| **AC-05-24** | Teşhis veriliş juice'u D-063/D-059 sürelerinde; reduced-motion'da fade; oturumda 4. Teşhis'ten itibaren toast | e2e + a11y |
| **AC-05-25** | Sözlük: Tercüme ile giriş, tekrar girişte sayaç; sekme ilerlemesi gerçek havuzdan; Mottolar ızgarası 36 hücre | birim + snapshot |
| **AC-05-26** | Onyıl Karnesi lift puanı `fitness.points`'e gerçekten yazılır ve tik-up görünür; şemada kimlik alanı yok | birim + tip testi |
| **AC-05-27** | HYT/KMP kodları kişisel veri içermez (yalnızca seed + sürüm + crc), içe aktarma aynı olay çekilişini üretir; sürüm uyumsuzluğunda uyarı | birim |
| **AC-05-28** | Playwright web export'ta port'lar no-op iken Mola, Kamp, Sakatlık Raporu, ölüm→açılım akışları hatasız koşar (iki platform parite tabanı) | Playwright |

---

## 7. Açık sorular, riskler ve D-ÖNERİ listesi

### 7.1 Açık sorular (sahip: lansman öncesi kapanır)

1. Android `bestEffort` teslim gecikmesi soft launch'ta ölçülür; 21:00 at-risk bildirimi 22:30'a kayıyorsa 20:30'a çekilir.
2. Oyun kategorisi opt-in tabanı (~%21/%28, ikincil) doğrulanır; iOS < %40 kalırsa soft-ask kopyası A/B (bandit yok, iki varyant elle).
3. Kamp hayatının 35–50 dk hedefi D-061 sıkıştırmasıyla harness'ta doğrulanır; uzun kalırsa Kamp 18→50 ile biter (ölüm yerine "sezon sonu"; ayrı D-ÖNERİ gerekir).
4. 40 botun orta Android'de ≤ 3 sn hedefi profillenir; aşarsa 24 bot (etiket "24 hayali kişi") — sayı tuning'dir, ilke değil.
5. "Aynı kondisyonla" payı %50'yi aşarsa perk çeşitliliği yetersizdir; 1.0 öncesi K-07/K-08 öne alınır.
6. 7578 sayılı Kanun/BTK yönetmeliği bildirim içeriğine (yaş derecesi uyarısı vb.) kural getirirse §2.4.1 #5 güncellenir (avukat).
7. Teşhis "Isınma Turunda Kaldı" (erken ölüm) gizli ve Efsane; playtest'te "ölümle dalga" okuması çıkarsa adı "Kısa Sezon / Short Season" olur.

### 7.2 Riskler

| # | Risk | Belirti | Azaltma |
|---|---|---|---|
| 1 | Streak 20 saniyelik "check-in uygulaması"na dönüşür | Bite oturumlarında "Ertesi Gün" oranı düşük | Mola kartı zarfa/arc'a bağlanır (director: günün ilk kartı ≥ %50 aktif iplikten); KPI: Mola sonrası devam ≥ %70 |
| 2 | Bildirim yorgunluğu / "creepy" algısı | `quiet_mode_on` > %5, uninstall proxy > %15 | Tavanlar sabit; özne NPC; D-050 lint; L21 tersliği |
| 3 | Kohort "sahte oyuncu" diye okunur | Yorumlarda "bot" şikâyeti | Üç yerde etiket; koç kendisi "hayali" der; UCPD testi playtest'te |
| 4 | Kondisyon "hiçbir şey vermiyor" hissi | "Aynı kondisyonla" > %50, Roast Raporu 7. adım atlama > %60 | Her perk somut ve ilk hayatta görünür (K-01 kedi 6 puan = ilk ölüm); Yedek Kulübesi satırı dürüst ve komik |
| 5 | Teşhis adları yargılayıcı okunur | Playtest "oyun bana X dedi" | Yasak sözlük + insan onayı; ad ≠ roast; Nazik'te kısa satır |
| 6 | Welcome-back büyük kararı "beni cezalandırdı" hissi | 14+ gün dönüşte `wb_completed` < %60 | Karar rafta, kayıp yok; 5 kişilik 2 haftalık ara testi (T7 açık soru #5) |
| 7 | iOS/Android bildirim davranış farkı (Doze, hibernation) | Android open rate iOS'un yarısının altında | Planlı ≤ 12, replan ritüeli, kopyada saat yok; soft launch teslim ölçümü |

### 7.3 D-ÖNERİ listesi (00'ın kapsamadığı kararlar; onaylanırsa 00 §11/§12'ye yeni D-kaydı)

| ID | Karar | Gerekçe |
|---|---|---|
| **D-ÖNERİ-05-01** | Hafta sonu muafiyeti **varsayılan açık**; Ayarlar'da kapatılabilir | D-029 "opsiyonel" der, varsayılanı söylemez; Duolingo Weekend Amulet +%4 dönüş / −%5 kayıp; suçluluksuz hafta sonu DAU düşüşünü (T11 #9) karşılar |
| **D-ÖNERİ-05-02** | Telafi 30 günde 1; iki sayaç modeli: `days` (toplam, asla azalmaz, kilometre taşlarının kaynağı) + `run` (kesintisiz rekor, yalnızca Defter/Lally kartında) | D-029 "48 sa Telafi" sıklığını söylemez; T7/A4 "ayda 1"; iki sayaç "sıfırlanmaz" vaadini ve Telafi'nin anlamını aynı anda korur |
| **D-ÖNERİ-05-03** | Koç Görevi kartı **sistem metnidir**: emir kipi serbest (oyun içi fiil), D-027 koç balonuna uygulanır; gerçek dünya fiili lint BLOK | D-027 koç sesini korur; görev kartı koç değil; "oyun mu alışkanlık uygulaması mı" testi lint'e iner |
| **D-ÖNERİ-05-04** | Koçun 3. ruh hâli `camp` **soft launch'ta** (00 açık soru #9) | Kamp soft launch'ta 8 temaya çıkıyor; ruh hâli tek bağlam etiketi, içerik maliyeti düşük |
| **D-ÖNERİ-05-05** | Bildirim ve paylaşım kartı metinleri ses ayarından bağımsız **Normal** varyant + 4+ sözlük | OS/vitrin yüzeyi (Apple 2.3.8, T7 açık soru #7); Acımasız'ın rızası uygulama içindir |
| **D-ÖNERİ-05-06** | `quietDays[locale]`: TR'de 10 Kasım'da bildirim planlanmaz ve Kamp kıyas satırı gönderilmez; içerikte hiçbir gönderme yok; EN listesi boş | İtibar/şikâyet riski sıfırlanır; T9 #1 (Atatürk hiçbir biçimde geçmez) ile uyumlu: sessizlik gönderme değildir |
| **D-ÖNERİ-05-07** | Soft-ask koşuluna "ilk karne görüldü" eklenir (D-030 koşullarına ek, gevşetme değil) | T7 "değer anı" = ilk karne/zarf; D-061 ritminde ilk karne ≈ 8–12 dk, D-030 ile örtüşür |
| **D-ÖNERİ-05-08** | iOS provisional bildirim **kullanılmaz**; soft-ask en fazla 2 kez (ilk + D3), 7 günlük rozet sorusu yok | "Bir kez sorarız" vaadi; provisional kilit ekranında görünmez, ses yok; reddedene saygı (D-030 "yeniden sorma yok") |
| **D-ÖNERİ-05-09** | Welcome-back zaman tavanı **365 oyun günü** (T7'nin 2 yılı yerine), ödül tavanı 7 gün; en fazla 1 doğum günü rafa | D-061'de karne doğum günü ritüelidir; iki karne atlamak "yıl bir tören" hissini zedeler; T7 tabloyu gün birimine çevirir |
| **D-ÖNERİ-05-10** | Kamp = tam hayat, gün sıkıştırması ½ (35–50 dk), hafta içinde sınırsız deneme, en iyi skor; Defter'e girmez, Tanıdık Yüzler taşımaz; skor `0,6·karne + 0,4·kas`, Para'ya bağlı değil | T7 haftalık model; S2 "zengin ölmek kazandırmaz"; defter/hafıza ana hayata ait kalır |
| **D-ÖNERİ-05-11** | Hayali kohort = 40 headless bot, 6 politika, cihazda üretilir, `camps/<isoWeek>.json`'a yazılır; adlar "hayali/fictional" ön ekiyle | D-019 "hayali" ister, üretim yolunu söylemez; gerçek dağılım, sahte sayı yok, sunucu yok |
| **D-ÖNERİ-05-12** | Kondisyon puanı `6·ln(1+yıl/12)` + Onyıl lift + görev (günde ≤ 4) + Kamp (+2/+1); 10 perk eşikleri 6…70; Yedek Kulübesi 12 kozmetik, deterministik sıra | D-042 "log sıkıştırmalı" der, sabitleri vermez; "hızlı öl" döngüsü kârsız; her ölüm ≥ 1 (D-016) |
| **D-ÖNERİ-05-13** | Teşhis nadirlik bantları harness'tan (Y ≥ %40, S %12–40, N %3–12, E < %3); ekranda yalnızca etiket + "simüle hayat" cümlesi; `tuning.json` override yok | Sahte sosyal sayaç yok; eşik şeffaflığı (T1 §2.8) |
| **D-ÖNERİ-05-14** | Mottolar albümü (36 hücre) Sözlük sekmesinin 6. sayfası; Onyıl Karnesi "Onyılın Mottoları" şeridi taşır | 00 §5 "Sözlük koleksiyonu + Onyıl" bu belgede; albüm örüntüyü yorumsuz gösterir (S2) |
| **D-ÖNERİ-05-15** | Streak kilometre taşı ödülleri yalnızca kozmetik (düdük rengi, defter kapağı, 12 damga varyantından 6'sı); Kondisyon puanı **vermez** | Streak → güç köprüsü kurulmaz; T1 §5.3 |

### 7.4 Diğer dokümanlarla çelişki kayıtları (bu belge 00'ı uyguladı)

- **Doc 02 §2.1.4** welcome-back çevrimini T7'nin ay/yıl tablosuyla ve 2 yıl tavanıyla anar (`advanceTime({ months })`); 00 §12 D-061 gün birimini getirdiğinden bu belge tabloyu **gün** cinsinden kurdu ve `advanceTime({ days })` + 365 gün tavanını önerdi (D-ÖNERİ-05-09). Doc 02'nin D-061 revizyonunda kanca güncellenmeli.
- **Görev brief'i** soft-ask'ı "ilk karne sonrası" diyor; 00 D-030 "ilk Bugünlük yeter, ≥ 8 dk" der. Çözüm: iki koşulun kesişimi (D-ÖNERİ-05-07); 00 kazanır, brief'in anı ek koşul olarak eklendi.
- **Doc 01 §3.4** 30 bildirim satırını koç ağzında yazdı (P-01..P-30); 00 §12 D-062 karakter mesajlarını getirdi. Bu belge P-serisini koç havuzu olarak korur, N-serisini (30 NPC mesajı) ekler; çelişki değil, genişleme.
- **Doc 10 `Streak` tipi** tek sayaç (`days`) tanımlar; bu belge `run/bestRun`, `offSeasonUntil`, `unverifiedDays` alanlarını ekler (geriye uyumlu; `schemaVersion` artmaz, alanlar opsiyonel başlar).
- **T7 §2.2 sezonluk takvim** (Ramazan/Kurban/23 Nisan/29 Ekim/10 Kasım temalı içerik) bu belgeye **alınmadı**: T9 din/millî gün çizgisi ve 00 §1.2; yalnızca sessiz gün kuralı (D-ÖNERİ-05-06) kaldı. Sezonluk Kamp temaları mevsimsel ve kurgusaldır.
- **T1 §2.13 jenerasyon / Aile Bileti** ve **T7 §5.3 mini oyunlar** bu belgenin kapsamı dışında (00 §7 lansman sonrası; D-057).

*Son not: bu belgenin sabitleri (`tuning.json`: eşikler, tavanlar, saatler, kohort boyutu) dev dashboard'dan canlı değişir; D-ÖNERİ'ler 00'a alınmadan sabitlerin **anlamı** değişmez. Sayaç durur, sıfırlanmaz; kohort hayalidir, öyle yazar; miras çeşitlilik verir, güç vermez.*
