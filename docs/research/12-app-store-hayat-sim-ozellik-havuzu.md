# 12 — App Store Hayat-Sim Özellik Havuzu: Teardown Sentezi ve Motto Kopya Kararları

> **Belge türü:** Araştırma sentezi (T12). **Tarih:** 2026-11-07. **Sahip:** Baş Tasarımcı. **Girdi:** `docs/research/12-app-store-teardown/` A (BitLife ailesi), B (klonlar), C (anlatı/seçim oyunları), D (ASO, fiyat, yorum madenciliği) — toplam 240+ kaynak URL, arama indeksi görüntüleri; `docs/design/12-benzer-oyunlar-ozellik-karsilastirmasi.md` (D-065); `00-VIZYON-ve-KARARLAR.md` §0, §4, §8, §12.
> **Hiyerarşi:** 00 §12 > 00 §11 > bu doküman. "Motto kararı" sütunu tasarım dokümanlarına (01–11) iş emridir; bağlayıcı hâle gelen 15 madde `00 §13` D-068–D-082'dir, kalan öneriler §6'da D-ÖNERİ olarak bekler.
> **Ad notu:** Küme B/D kalıcı premium'u "Sertifika" çalışma adıyla ve 7,99 $ ile anar. Bağlayıcı ad **Torpil**, fiyat **6,99 $ / 199,99 ₺** (D-038). Burada yalnızca Torpil kullanılır; tartışma §4'te.
> **Veri uyarısı:** Puanlar mağaza anlık görüntüsüdür (±%10); çelişen görüntülerde ikisi de yazıldı. Hiçbir rakam yayın materyaline buradan kopyalanmaz (Sprint 0 doğrulama: D §7, D-ÖNERİ-12-13).

---

## 1. Özet tablo — 28 uygulama tek bakışta

Zaman: **Y** yıl/tur · **G** gün · **GZ** gerçek zaman bekleme · **I** idle birikim · **K** kart/olay · **B** bölüm · **OA** otomatik akış. Diyalog = karakterin kendi sesiyle balon/mesaj olarak konuşması (menü etkileşimi sayılmaz).

|App|Puan (snapshot)|İndirme / gelir işareti|Zaman|Diyalog|Monetizasyon|Öne çıkan 3 özellik|
|---|---|---|---|---|---|---|
|BitLife|iOS 4,8★/1,8 M · Play 4,4★/1,3 M|130 M+ indirme; 2019 ≈ 26 M $; Stillfront 2025 "gerileme"|Y|Yok|Interstitial ~70 sn + ~15 IAP; sepet 100 $+|Age butonu + olay pop-up · Ribbon/mezar taşı · Cumartesi challenge|
|DogLife / CatLife|iOS 4,6★/62 K · 4,7★/14 K|~1 M sınıfı; içerik durdu|Y|Yok|Reklam + Top Dog/Cat 4,99 $|Scent Database · Mekân hiyerarşisi · Reskin tavanı|
|InstLife (2019'da kapandı)|Play 4,5★/35 K|7,1 M kurulum|Y|Yok|Reklam + Remove Ads|4 sabit tepki tarzı · 5 dk oturum · Kişiliksiz → kaybetti|
|AltLife|iOS 4,7★/1,2 K · Play 4,5★/82 K|Rafta 2. klon|Y|Yok|Reklam + Premium 9,99 $ + Bundle 19,99–49,99 $ + Life Points|Canlı dövüş · Utoob/Instafame · "İşe yarayan eşyalar"|
|ALTER EGO|iOS 4,9★/13,7 K · Play 4,8★/1,44 M|10 M+; kümenin en yükseği|I + B|**Var** (Es)|Banner + rewarded + reklamsız 2,99 $ + son 4,99–6,99 $|Tek karakter · Kişilik testi kartı · "Sen yokken" birikim|
|The Life Simulator|iOS 4,5★/21 K|2018 nesli|Y|Yok|Unlock All 9,99 $ · Perks 2,99 $ · Revive 0,99 $|15+ başlangıç senaryosu · Perk · Gerçek şirketli borsa|
|Life Choices / Seçimler (Unico, TR)|Play 4,3★/69,6 K · iOS TR 4,3★/2,3 B|5 M+|K|Yok|Interstitial 30 sn + rewarded seçenek + Remove Ads ≈ 3 $|Melek/şeytan · Başarım → kasaba · "Her 2 seçimde 1 reklam"|
|Life Sim: Real Life (Biddulph)|iOS 4,6★/4,6 K|Solo indie|**G** (enerji)|Yok|Reklam; reklamsız IAP yok|Günlük karar temposu · Fabrika zinciri · Liderlik tablosu|
|Idle Guy|iOS 4,8★/73 K|Reklam ağırlıklı|GZ|Yok|Reklam + ucuz reklamsız|Sayaç + reklamla atlama · "Karşılığında bir şey alıyorum"|
|100 Years|Play 4,3★/163 K|Hypercasual|Seviye|Yok|Seviye arası interstitial + 2,99 $|3D sahne · Yaş dilimi = seviye · 65'te biter|
|ReLife|iOS 4,7★/962 · Play 4,5★/1,8 K|2025; en hızlı kadans|Y|Yok|Reklam + RePass ~4 $/ay + IAP|Life Awards · Alışkanlık sistemi · "Defining moments"|
|SimLife|iOS 4,6★/82|Geliştirici her yoruma yanıt|Y|Yok|God Mode Forever 7,99 $; coin yok|Mezar taşı özeti · Yıl geri sar · Aile editörü|
|Infinite Life Simulation|Play 2,5★/180 · iOS 4,0★/14|LLM; internet zorunlu|Y (AI)|Var (AI)|Jetpack 0,99 $ · Pass 2,99 $|LLM anlatı · NPC sohbet · Genetik|
|LifePop|iOS 4,4★/29 · Play 3,6★/400|"Rushed"|Y|Kısmi|Reklam + IAP|60 beceri · 17 mini-oyun · Fotoğraf albümü|
|Roleplay Sim / Hayat Oyunu (Güven, TR)|iOS US 4,3★/788 · TR 4,5★/1.456|TR stüdyo EN-first|Y|Yok|Gems + Remove Ads 3,99 $ + Bundle 4,99 $|Flört profili tarayıcı · Ölümde ipucu · Online Hayat|
|Life Story Simulator|iOS 4,4★/684|18+ kumar|Y|Yok|10+ mikro IAP|Yatırım eğitimi · Oda dekoru · IAP enflasyonu|
|Life in Text|Play 4,4★/159|Reklamsız, IAP'sız|Y|Yok|Yok|Doğum yılı → özellikler · Terfi mini-oyunu · "Maxlanınca donma"|
|LIFEISH / 1 in 8 Billion (2026)|Veri yok|Yeni|Y / K|Yok|Tek ödeme / gem|"15 gizli sır" · HTML kitap dışa aktar · 220 ülke|
|Bir TC Simülasyonu (Tiamo, TR)|Play 4,1★/11,8 K · iOS 2,8–3,9★|Play 1 M+|K|Yok|Reklamsız + Politika/Girişimcilik paketi + Zaman Makinesi|Dolar kuru · Şehirde doğma · "No inflation, no Turkish traditions"|
|ZipLife (TR)|iOS 4,6★/594|iPhone-only|Y|Yok|**Abonelik** 2,99 $/hafta · 19,99 $/yıl|"Daha az haksız erken ölüm" · Ekran okuyucu yok|
|Lagos Life (tarayıcı)|—|10 günde 7 M oyuncu|G|Yok|Billboard reklamı|Kira öde döngüsü · 6 çubuk · Yerel doku viral|
|Reigns serisi|iOS 4,8★/7,6 K · Steam Çok Olumlu|Premium seri|K (= yıl)|Yok|2,99–3,99 $; IAP yok|Swipe = cevap · Stat noktası önizleme · Deste büyümesi + şecere|
|Spent (web)|—|4 M+ oynanış|**G** (30 gün)|Yok|Ücretsiz|1.000 $ + 30 gün · Her gün tek karar · "%X oyuncu bunu seçti"|
|Choice of Life / Choice of Games|Steam 89–93 % · iOS 4,6★|Premium / kitap IAP|K / B|Yok|0,99–5,99 $|Checkpoint + "geçen sefer" izi · Görünür stat check · İkili statlar|
|Lifeline|iOS 4,7★/4,5 K · Play 4,6★/68,7 K|Premium klasik|**GZ**|**Var** (Taylor)|2,99 $; IAP yok|Chat-UI + bildirim · Gerçek zaman bekleme · Fast mode|
|Episode / Choices|~4,4★/7,1 M|Milyar dolar sınıfı|B + 3 sa pass|Var|Gems + Passes + VIP abonelik|Kilitli premium seçenek · Pass zamanlayıcı · Haftalık bölüm|
|Seedship|iOS 4,8★ · AppBrain 4,78/15 K|Hobi|K|Yok|Ücretsiz|Tek ekran sonuç · Skor dökümü · Push-your-luck|
|Tiny Fates / Life is a Game|Yeni / iOS 4,1★|Veri az|Y / **OA**|Yok|Abonelik / paket IAP|Fate Code · Günlük tek atış · Otomatik akan zaman + Choice|

**Dört satırlık okuma.** (1) 28 uygulamanın yalnızca üçünde karakter kendi sesiyle konuşuyor (Alter Ego, Lifeline, Episode) ve ikisi kümenin en yüksek puanlıları. (2) Zaman kendiliğinden akan tek mobil örnek Life is a Game (4,1★, donma şikâyetli): D-066 rafta referanssız. (3) En az şikâyet alan para noktası 7,99–9,99 $ kalıcı premium; en çok şikâyet alan üçlü interstitial sıklığı, "ödedim geri geldi", abonelik. (4) TR'de talep kanıtlı (TC Simülasyonu 1 M+), arz kalitesiz; Türkçe yazım ve yerel doku boş alan.

---

## 2. ÖZELLİK HAVUZU — sistem bazında

**Karar:** AL (olduğu gibi, Motto adıyla) · UYARLA (çekirdek fikir + koç/kara-komedi twist) · ALMA (gerekçeli ret) · DERS (özellik değil kural). **Efor:** S ≤ 2 gün · M ≤ 1 sprint · L > 1 sprint · "var" = mevcut kararla kapsanıyor. **Dok.** = sahip tasarım dokümanı. **Hukuk:** T9 notu; "—" risk yok.

### 2.1 Zaman

|ID|Özellik|App'ler|Oyuncu tepkisi|Karar|Motto'da nasıl|Dok.|Efor|Hukuk|
|---|---|---|---|---|---|---|---|---|
|F-001|"Age" tek büyük buton, yıl = tur, 10–20 sn|BitLife, AltLife, ReLife, SimLife|*"hours fly by"* / *"same decisions every life"*|UYARLA|Buton yok, zaman akar (D-066); "bir yıl daha" dürtüsü doğum günü Karnesi'ne; yıl ≤ 120 sn|02, 07|var|—|
|F-002|Gün = tur, enerji/aksiyon bütçesi|Biddulph, Life Simulator 2026|*"daily-decision pacing"* / *"features barely connect"*|UYARLA|Gün gösterilir, oynanmaz; enerji yok (D-061); "11 gün geçti. Hiçbir şey olmadı; bu da bir olay."|02, 03|var|—|
|F-003|Gerçek zaman bekleme / eylem sayacı|Lifeline, Idle Guy|*"waiting gimmick quickly grows old"* · *"ad harvesting"*|ALMA|Saat akar ama ▶▶ ile hızlanır; kapalıyken akmaz|02|—|—|
|F-004|Idle birikim "sen yokken"|ALTER EGO|4,8★/1,44 M; *"come back every few days"*|UYARLA|Para değil **zarf** birikir; Sakatlık Raporu 40 sn: "Annen iki kez aradı. Açmadım; koçum, sekreter değilim."|05|var|—|
|F-005|Otomatik akan zaman + Choice butonu|Life is a Game|Sevilen; donma/ilerleme kaybı|AL|D-066'nın tek emsali; ek ders: her gün sonu autosave|02, 10|M|—|
|F-006|30 günlük takvim, her gün tek karar, para erir|Spent|4 M+ oynanış; *"you do feel spent"*|AL|D-061/D-067'nin ispatı; ömür boyu, yaşla sıkıştırma|02|var|—|
|F-007|Seviye = yaş dilimi; "65'te biter"|100 Years, Life Choices|*"choices forcing you to restart"* · *"only goes to 65"*|ALMA|Onyıl Karnesi perde hissi verir; Gompertz kuyruğu %5 uzun ömür|02, 05|—|—|
|F-008|Pass/key/enerji zamanlayıcı|Episode, Choices|*"wait three hours to get more passes?"*|ALMA|"Bugünlük yeter" oyuncunun kararı; bekleme satışı yasak|06|—|—|
|F-009|Timed choice (geri sayım)|Choices|Baskı; parayla birleşince nefret|UYARLA|Yalnızca ANNE ARIYOR ve göz temasında 5 sn; standart kartta asla|07|S|—|
|F-010|Doğum yılı → kohort olayları|Life in Text|Nostalji övgüsü|UYARLA|Oyuncu yıl seçmez; gerçek takvim + yaş bandı olay havuzunu seçer|03|S|Gerçek tarihsel kişi/olay yok|
|F-011|Sabit gün/saat ritüeli (Cumartesi 15:00 EST)|BitLife|2020'den beri aralıksız; en çok konuşulan takvim|AL|Pazartesi 00:00 yerel Kamp: "Pazartesi. Herkesin nefret ettiği gün; benim mesaim."|05|var|—|

### 2.2 Karakter / NPC

|ID|Özellik|App'ler|Oyuncu tepkisi|Karar|Motto'da nasıl|Dok.|Efor|Hukuk|
|---|---|---|---|---|---|---|---|---|
|F-012|Chat-UI: avatar + balon + "yazıyor…" + cevap balonu|Lifeline, Episode|*"the sense of texting a real person"*|AL|D-062; cevap seçeneği balon, gönderince "Sen:" olarak akışa yazılır|07|var|—|
|F-013|Bildirimle gelen karakter|Lifeline|*"responds every few hours"* şikâyeti|UYARLA|≤ 1/gün, izinle, koç ağzından: "Annen 3 kez aradı. Ben açmadım."|05|S|—|
|F-014|Tek karakterle derin ilişki, ifadeli avatar|ALTER EGO (Es)|*"most memorable games"*|AL|Koç = Es; 3 ifade (D-063); 2.400 seminer yükü|01, 07|var|—|
|F-015|NPC'lerin kendi hayatı var (iş değiştirir, hastalanır, ölür)|BitLife|AltLife: *"relationships much more fleshed out"*|AL|Tanıdık Yüzler yaşlanır; Şükran Teyze ölür, koç "Ben oradaydım" der|04|M|—|
|F-016|NPC hafızası|LifePop, Infinite Life|*"AI forgetting details"* (LLM'in yarası)|AL|D-023 `metaMemories`; elle yazılmış hafıza = rekabet avantajı|04|var|—|
|F-017|Deste büyümesi: karar → karakter → onun kartları|Reigns|*"pushing the story forward in unpredictable ways"*|AL|Durumsal NPC desteleri: ilk taksiyle Taksici destesi (12 kart) açılır; Defter'de "Tanıştın: 5/18"|03, 04|M|—|
|F-018|4 sabit tepki tarzı (ignore/accept/assault/argue)|InstLife|"Robust ama kişiliksiz"|UYARLA|`pattern` etiketini görünür arketip yap: Ertele / Kabullen / Kavga / Pazarlık ikonu|03|S|—|
|F-019|İlişki menüsü: 20+ etkileşim (gift, insult, spend time)|BitLife, AltLife|*"buy someone a gift? 40 second ad"* · *"romance entirely random"*|UYARLA|Menü yok; NPC akışta konuşur; ilişki şeridi "kiminle, kaç yıldır"; oran iddia fişinde görünür|04|M|—|
|F-020|Serbest metin NPC sohbeti (LLM)|Infinite Life, AltLife Sim|*"AI behaves oddly"* · *"lost internet"* · Play 2,5★|ALMA|Backend yok; sohbet hissi 2–4 balon + NPC ses kuralları|03|—|—|
|F-021|Görünür ilişki deltası ("+3")|Infinite Life|Övgü|AL|Uçan sayı "+3 Yağmur"; koç: "Üç. Bu hızla 2050'de arkadaş olursunuz."|07|S|—|
|F-022|Flört profili tarayıcı|Roleplay Sim|Yenilik övgüsü|UYARLA|Chat-UI içinde kurgusal profil kartı; kaydırma = cevap; profil metni roast malzemesi|04, 07|S|Gerçek flört uygulaması adı/logosu yok|
|F-023|Melek/şeytan ikili anlatıcı|Life Choices|Nadiren anılıyor|ALMA|Tek ses; Kader yalnızca Torpil'de, aynı hayatta farklı ses|01|—|—|
|F-024|Tanışma koleksiyonu (Scent Database)|DogLife|*"unique way to see life"*|UYARLA|Tanışıklık 0–5 + Tanıdık Yüzler kartoteği|05|S|—|
|F-025|Geniş aile ve iş arkadaşı etkileşimi|BitLife menü; itch.io isteği; AltLife *"no co-workers"*|Kimse diyalogla vermiyor|UYARLA|Aile Grubu kartı + Dayı + Şükran Teyze konuşur; "iş arkadaşı" ve "kardeş" durumsal desteleri (1.0)|04|M|Gerçek şirket/İK süreci adı yok|

### 2.3 Kariyer / eğitim

|ID|Özellik|App'ler|Oyuncu tepkisi|Karar|Motto'da nasıl|Dok.|Efor|Hukuk|
|---|---|---|---|---|---|---|---|---|
|F-026|Meslek listesi + interview + promotion (9/10 hijyen)|BitLife, AltLife, Biddulph|*"makes you work up to the jobs"*|UYARLA|24 kariyer (1/3 absürt); iş = unvan + maaş akışı; terfi/işten çıkarma zarf|04|var|Gerçek şirket adı yok|
|F-027|Freelance gig (saatlik ek iş)|BitLife|Küçük ama sevilen|AL|Günlük satırda ek gelir: "3 saat kurye, 40 Para. Dizlerin hatırlayacak."|02, 04|S|Platform adı jenerik|
|F-028|Özel kariyer paketleri (Astronaut, Mafia, Movie Director)|BitLife Job/Expansion Pack|*"40 other payments"*|ALMA|Kariyer paywall'u yok; absürt kariyerler ücretsiz ("Hayat Koçu" dâhil)|04, 06|—|—|
|F-029|Yaratıcı kariyer: video, thumbnail, yorum okuma|AltLife Utoob/Instafame|*"influencer career… WAY better"*|UYARLA|Yalnızca **yorum okuma beat'i**: sahte yorum kartı ("3 beğeni, biri annen")|04|S|Platform ve parodi marka adı yok|
|F-030|İş kurma / tycoon zinciri|BitLife Business, Biddulph|*"selling 100 units at a time is slow"*|ALMA|Girişim = 3 kartlık olay zinciri, tablo yok|04|—|—|
|F-031|Royalty / execute|BitLife|Niş|ALMA|Gerçek monarşi = gerçek kişi; ton|08|—|T9|
|F-032|Askerlik|BitLife, The Life Simulator|"Terfiler gerçekçi değil"|UYARLA|Locale-only ikame: TR askerlik ↔ EN student loans; birlik adı jenerik; "sakatlık" sözcüğü engelli|03, 09|S|Gerçek birlik/kurum yok|
|F-033|Kurslar ("survival training", "digital marketing")|Roleplay Sim|Çeşitlilik|UYARLA|"Sertifika kursu" absürt eğitim; koç kendi sertifikasızlığıyla dalga geçer|04|S|Gerçek kurum yok|
|F-034|Terfi mini-oyunu|Life in Text|*"text options are bare"*|ALMA|Terfi = "patron kararı" zarfı|04|—|—|
|F-035|Okul sistemi (Grades/Popularity/Cliques)|BitLife|Çocukluk "sıkıcı"|ALMA|18'de başlıyoruz; üniversite = Tek Hedef|04|—|—|
|F-036|Sosyal medya takipçi/fame sekmesi|BitLife, AltLife|Çeşitlilik|UYARLA|Tek Varlık satırı ("Takipçi: 312") + olaylar|04|S|Platform adı yok|

### 2.4 İlişki / aile / evcil hayvan

|ID|Özellik|App'ler|Oyuncu tepkisi|Karar|Motto'da nasıl|Dok.|Efor|Hukuk|
|---|---|---|---|---|---|---|---|---|
|F-037|Evlilik + çocuk|BitLife; Hayat Oyunu şikâyeti|*"evlilik/çocuk yok"* (TR)|AL|İlişki şeridi; çocuk = Aile Grubu'na üye + yeni NPC sesi ("Baba?")|04|M|—|
|F-038|Nesil devamı (2 nesil paywall)|BitLife Generations|*"lets you continue a family tree"* / paywall şikâyeti|UYARLA|Nesil yok; **kalıp mirası**: "Annen de erteliyordu. Genetik değil, örnek." + Fazla Bagaj|05|S|—|
|F-039|Hook up / affair / threesome|BitLife (17+)|*"not what I want for my 15 year old"*|ALMA|16+ ve 4+ vitrin; aldatma yalnızca anlatı sonucu|08|—|—|
|F-040|Boşanma / velayet davası|BitLife|Şişkinlik|UYARLA|Boşanma = durum değişimi kartı; dava yok, "avukat evrakı" Tercüme kartı|04|S|Gerçek mahkeme/kanun yok|
|F-041|Ebeveynden borç isteme|BitLife, Spent|Güvenlik ağı sevilen|AL|Yalnızca 18–28; Anne Baskısı +; "Borç değil, faizsiz suçluluk."|02|var|—|
|F-042|Evcil hayvan: aylık gider, ölüm, iade cezası|BitLife, DogLife, Biddulph|Kiwi: "hamilelik olayında donma"|AL|Pamuk aylık yer (D-067); ölüm kartı + "Kedi Yası" Teşhisi; iade yok|02, 04|S|—|
|F-043|Evlilikte soyadı seçenekleri|ReLife|Güncelleme övgüsü|UYARLA|Bileşik soyadı şakası: "Ertelemez-Kirayetişemeyen" / "Tomorrow-Overdraft"|04, 09|S|İsim blocklist (08)|
|F-044|Yavruyu arkadaşa gönder / arkadaştan borç iste|DogLife, Spent|Nadir; Facebook entegrasyonu ölü|UYARLA (düşük)|Kondisyon hediye kodu (deep link); tek yönlü paylaşım kartı|05, 07|S|—|

### 2.5 Para / varlık / ekonomi

|ID|Özellik|App'ler|Oyuncu tepkisi|Karar|Motto'da nasıl|Dok.|Efor|Hukuk|
|---|---|---|---|---|---|---|---|---|
|F-045|Varlık sekmesi: ev/araba/mücevher/uçak/yat|BitLife, AltLife|*"seemingly unlimited… diminishes the strategic nature"*|UYARLA|4 kalem: telefon, araç, ev, kedi (D-067)|04|var|—|
|F-046|"İşe yarayan eşyalar" (varlık olay havuzunu değiştirir)|AltLife|*"items that actually matter… WAY better"*|AL|Araba → kaza/sigorta olayları; telefon kırık → aile grubu 3 gün sessiz; kedi → 05:00 satırı|03, 04|M|—|
|F-047|Gerçek şirketli borsa/kripto (Tesla, S&P, "Krusty Krab")|The Life Simulator, BitLife Investor|*"subtle lessons about investment"*|ALMA (marka) · UYARLA (olay)|Yalnızca jenerik olay ("bir coin"); parodi marka da yok|02, 08|S|T9: gerçek marka ve parodi IP yok|
|F-048|Memecoin yaratma|ReLife|Övgü|UYARLA|Tek absürt zincir "KediCoin" (kurgusal), 3 kart, iddia garantili|03|S|Gerçek coin adı yok|
|F-049|Kira öde döngüsü, ev sahibi|Lagos Life, Spent|10 günde 7 M oyuncu|AL|Ayın 5'i kira; ev sahibi durumsal NPC; zam zarfı|02|var|—|
|F-050|Makro ekonomi: kur, enflasyon, zam|TC Simülasyonu (talep), Lagos Life|*"No economic inflation, no reference to turkish traditions"*|UYARLA|Makro olay ekseni **rakamsız**: "Ev sahibi zam oranını söyledi; sayıyı yazmıyorum, mide bulandırır." EN: rent hike|02, 03|M|Gerçek kur/enflasyon rakamı, kurum, parti yok|
|F-051|Kumarhane / 18+ kumar|BitLife Casino, Life Story|18+ etiket; ebeveyn şikâyeti|ALMA (mini-oyun)|Kumar yalnızca tek kartlık anlatı olayı; piyango yılda ≤ 1|08|—|Özendirme yok; kurum adı yok|
|F-052|Sınırsız para/stat, "too easy"|BitLife|*"painfully easy to 'beat'"*|DERS|Akış modeli: kalıcı giderler; zenginlik yeni sorun ("100 Para = vergi zarfı")|02|—|—|
|F-053|Aile yadigârı (Heirloom)|BitLife, LIFEISH|Sevilen küçük meta|UYARLA|Önceki hayattan 1 eşya/hatıra yeni Müşteri Dosyası'na iğnelenir|05|S|—|
|F-054|Perk / başlangıç senaryosu / habitat|The Life Simulator (15+), DogLife|Övgü|UYARLA|Kondisyon: ölümle açılır, parayla değil ("Borçlu üniversiteli", "Yurt")|05|var|—|
|F-055|Sanal para birimi satışı|AltLife, Another Life; BitLife Bits (kaldırıldı)|Restore şikâyeti; lider kaldırdı|ALMA|Para birimi yok|06|—|—|

### 2.6 Sağlık / ölüm

|ID|Özellik|App'ler|Oyuncu tepkisi|Karar|Motto'da nasıl|Dok.|Efor|Hukuk|
|---|---|---|---|---|---|---|---|---|
|F-056|Hastalık kategorileri × düşük Health komplikasyonu|BitLife|Sadelik beğeniliyor|UYARLA|Az hastalık, Gompertz × sağlık; "grip öldürmez"|02|var|İlaç/hastane adı yok|
|F-057|Bağımlılık + rehab|BitLife, AltLife|Ebeveyn şikâyeti|UYARLA (dar)|Yalnızca telefon/kahve/dizi kalıbı; madde adı yok; intihar yok|08|S|T9 ASLA|
|F-058|Time Machine / Revive / Rewind|BitLife 0,99 $, SimLife, Lifeline|*"pay a dollar to undo death"* (1★) ↔ *"one bad roll never costs you the life"* (5★)|ALMA|Ölüm kalıcı; Ek Antrenman rewarded yılda 1 tekrar (ölümde geçersiz) iki ucun ortası|02, 06|—|—|
|F-059|"Haksız erken ölüm" nefreti|ZipLife yaması, BitLife|*"fewer unfair early deaths"*|AL|Koruma penceresi 18–28; erken ölüm %5 absürt kuyruk, daima iddia damgalı|02|var|—|
|F-060|Mezar taşı + cenazeye katılan sayısı|BitLife|Organik TikTok|AL|"Cenazene 4 kişi geldi. Biri yanlış cenazeydi."|02, 07|S|—|
|F-061|Mezar taşı tek cümle özeti|SimLife|Övgü|AL|Mezar taşı = Roast Raporu'nun tek cümlesi|07|S|—|
|F-062|Ölümde "sonraki hayat ipucu"|Roleplay Sim|Övgü|UYARLA|İpucu değil **iddia**: "Gelecek hayatta da 23'te bırakacaksın."|01|S|—|
|F-063|Ölüm = gag, komik ölüm kartı|Reigns, Choice of Life, Seedship|*"fun ways to die"*; ilk ölüm 2 dk'da|AL|Komik ama özendirmeyen ölüm nedenleri; ölüm ilanı kartı paylaşılır|02, 08|S|İntihar/özendirme yok|
|F-064|0 ve 100'de ölüm (aşırılık)|Reigns|Öğretici|UYARLA|Ölüm değil Teşhis: "100 Keyif = Sorumsuz", "100 Para = Vergi Dairesi Zarfı"|02, 05|S|—|
|F-065|Düşürülemeyen stat / 0 görünüş|Age Sim, Kiwi|*"no real way to get stress down"* = churn|DERS|Her stat için ≥ 1 ucuz kaldıraç; Çekicilik 50'den başlar|02|—|—|
|F-066|"Defining moments" + servet/ilişki sayıları|ReLife, Infinite Life|Övgü|AL|Roast Raporu: 3 kalıp + haklı çıktığın an + servet/ilişki satırı|02|S|—|

### 2.7 Suç / bürokrasi

|ID|Özellik|App'ler|Oyuncu tepkisi|Karar|Motto'da nasıl|Dok.|Efor|Hukuk|
|---|---|---|---|---|---|---|---|---|
|F-067|Suç menüsü (soygun, cinayet; 5/10)|BitLife, AltLife, ReLife|Çeşitlilik / ebeveyn şikâyeti|ALMA (geniş) · UYARLA (dar)|Kaçak yolcu cezası, vergi evrakı, komşu şikâyeti; cinayet yok|03, 08|S|Özendirme yok|
|F-068|Hapis + Escape mini-oyunu (gardiyan 2 hamle)|BitLife|Sevilen; *"ad for a guard's uniform"*|UYARLA (mekanik)|Hapis yok; **tek kurallı 20 sn mikro-oyun** kalıbı → en çok 2 aday (D-ÖNERİ-12-04)|07|M|—|
|F-069|Mafya, hapishane çeteleri, casus, vampir|BitLife, AltLife, LifePop|Niş; *"rushed"*|ALMA|Ton + T9|08|—|T9|
|F-070|Mahkeme / dava|AltLife, BitLife|Derinlik övgüsü|UYARLA|Tercüme kartı: "Tebligat" → "Biri sana kızgın ve bunu resmîleştirdi."|03|S|Gerçek mahkeme/kanun yok|

### 2.8 Koleksiyon / meta

|ID|Özellik|App'ler|Oyuncu tepkisi|Karar|Motto'da nasıl|Dok.|Efor|Hukuk|
|---|---|---|---|---|---|---|---|---|
|F-071|Ribbon: hayat sonu tek etiket|BitLife (~40)|Yıllardır konuşulan tek meta|AL|Teşhis (D-065); 30 → 60 → 120|05|var|—|
|F-072|Achievements 100+, "Legend = hepsi"|BitLife, LIFEISH (166)|Tamamlayıcı kancası|UYARLA|40–60; "Efsane Müşteri" meta-başarımı; 12 damga|05|S|—|
|F-073|Cemetery / hükümdar şeceresi|BitLife, Reigns|"Bir daha" döngüsü|AL|**Eski Müşteriler**: ad, yaş, ölüm nedeni, Yılın Mottosu, koç isabeti|05, 07|S|—|
|F-074|Journal / fotoğraf albümü|BitLife, LifePop|Journal satırları TikTok'ta|AL / UYARLA|Koçun Defteri ömür kaydı; Yılın Mottosu sayfaları = albüm|01, 05|S|—|
|F-075|Başarım → kasaba/ev dekoru|Life Choices, Life Story|Övgü|UYARLA|"Koçun ofisi" duvarı (sahte sertifikalar, kedi fotoğrafı) — opsiyonel|05, 07|M|—|
|F-076|Kart koleksiyonu "%görüldü" + "15 gizli sır" vaadi|Reigns, LIFEISH|Tamamlama dürtüsü|AL|Olay koleksiyonu yüzdesi; mağaza metninde "Koçun 12 sırrı var. Hiçbirini söylemez."|05, 11|S|—|
|F-077|Hedef listesi ile içerik açma|Reigns: Her Majesty|*"repeating the same few tasks"* riski|UYARLA|Gizli "Kapanmamış Dosyalar" ("Anneye 3 yıl üst üste hayır de")|05|S|—|
|F-078|Life Awards|ReLife|Övgü|UYARLA|Onyıl Karnesi'ne "Onyılın Ödülü": "En Çok Ertelenen Diş Randevusu"|05|S|—|
|F-079|Kişilik testi + sonuç raporu|ALTER EGO|*"rethink my life"* / *"choices took too long to matter"*|UYARLA|Kalıp Dedektörü; ciddi çerçeve parodiyi taşır; damga 34. sn|03, 05|var|Gerçek envanter adı yok|
|F-080|İkili kaydırgaç statlar|Choice of Games|Şeffaflık övgüsü|AL|Karne "Davranış": Erteleme↔Aceleci, Cimri↔Savurgan, Anneci↔Asi|02, 05|S|—|
|F-081|Checkpoint + "geçen sefer bunu seçmiştin" izi|Choice of Life|Övgü; *"guessing the correct choice"* şikâyeti|UYARLA|Geri sarma yok; **ömürler arası** rozet: "Geçen hayatta kripto demiştin. Yine mi?"|03, 07|S|—|
|F-082|Skor dökümü satır satır|Seedship|Oyuncular matematiği çözmeye çalışıyor → replay|AL|Roast Raporu döküm ekranı: "Para 12 × 1, Dostlar 3 × 10, Kalıp cezası −40, Kedi +5"|02, 07|S|—|
|F-083|Alışkanlık sistemi|ReLife|Övgü|AL|Kalıp Dedektörü = alışkanlık, 12 kalıp yargısız|03|var|—|
|F-084|Kilometre taşı + global liderlik|Biddulph, LifePop|Backend|ALMA|Hayali kohort ("hayali" etiketli)|05|—|Yanıltıcı sıralama yok|

### 2.9 Challenge / live-ops

|ID|Özellik|App'ler|Oyuncu tepkisi|Karar|Motto'da nasıl|Dok.|Efor|Hukuk|
|---|---|---|---|---|---|---|---|---|
|F-085|Haftalık challenge: tema + 3–5 görev + kozmetik|BitLife|Görevler paketlere bağlı (cross-sell) şikâyeti|UYARLA|Antrenman Kampı: tema ve kozmetik alınır, paket bağı alınmaz|05|var|—|
|F-086|Challenge Vault (ücretli eski challenge)|BitLife 4,99 $|Kötü his|ALMA|Geçmiş kamplar ücretsiz arşiv|05|—|—|
|F-087|Seasons / battle pass / community goals|BitLife 2025|Resmî: *"heard player frustration… being removed"*|ALMA|Tek oyunculu simde battle pass tutmuyor|06|—|—|
|F-088|Mevsimlik app icon + tema|BitLife|Ucuz canlılık sinyali|AL|4 mevsim + 2 bayram ikonu; dini sembol yok|07|S|T9|
|F-089|Aylık tema bundle takvimi|BitLife|Vitrin enflasyonu|UYARLA|Sezon Paketi (~3 ayda 1, içindekiler yazılı) + ücretsiz aylık olay paketi|06|M|"Sınırlı süre" yok|
|F-090|Ücretsiz içerik damlası duyurusu|BitLife (5 kariyer, 2025)|*"constant updates… more variety"*|AL|Aylık ücretsiz olay paketi; yama notu koç ağzında ("14 hata düzelttim. 3'ü benim.")|11|S|—|
|F-091|Günlük tek atış challenge|Tiny Fates, BitLife|Standart|AL|3 Koç Görevi|05|var|—|
|F-092|Günlük global müzayede / turnuva|PassiveFlow|3,2★; backend|ALMA|Gerçek takvim ritmi backend'siz alınır|05|—|—|
|F-093|Haftalık bölüm yayını|Choices, Episode|Enerjiyle birleşince nefret|UYARLA|Ayda 1 "Yeni Dosya" (NPC paketi, ücretsiz)|05, 11|S|—|
|F-094|Geliştiricinin her yoruma yanıtı; şeffaf devlog|SimLife, Infinite Life, ReLife|Övgü #3 (küme B)|AL|Mağaza yanıtları **insan** sesiyle, 48 sa; TR+EN|11|S|Yorumda gerçek kişiye hakaret yok|

### 2.10 Sosyal / paylaşım

|ID|Özellik|App'ler|Oyuncu tepkisi|Karar|Motto'da nasıl|Dok.|Efor|Hukuk|
|---|---|---|---|---|---|---|---|---|
|F-095|Ölüm ekranında "Share" (mezar taşı)|BitLife, SimLife|Organik TikTok; ekşi: Instagram'dan keşif|AL|Roast Raporu kartı 9:16 + 1:1; Wordle emoji satırı; backend yok|07|S|Gerçek kişi adı yok|
|F-096|Kişilik sonucu paylaşım kartı|ALTER EGO|Instagram'da yayıldı|UYARLA|Teşhis/Kronik kartı + Onyıl Karnesi|07|S|—|
|F-097|Fate Code: hayatı kodla paylaş|Tiny Fates|Fikir güçlü, veri yok|UYARLA|**Dosya Kodu rövanşı**: aynı kondisyon + olay sırası, arkadaş kendi kararlarını verir; iki karne yan yana|05, 10|M|—|
|F-098|"Oyuncuların %X'i bunu seçti"|Spent|Sosyal kanıt|UYARLA|Hayali kohort koç satırı: "Müşterilerimin %62'si kirayı seçti. %62'si hâlâ borçlu." + "Kaynak: ben."|03, 01|S|"Hayali" açıkça yazılır|
|F-099|Hayatı HTML/PDF kitap olarak dışa aktar|1 in 8 Billion|Yeni|UYARLA|"Tam Dosya" PDF, Torpil defter dışa aktarımına bağlı; yerel render|07, 10|M|—|
|F-100|Paylaşılabilir epitaph|Tiny Fates, BitLife|Standart|AL|"Koçun Son Sözü" tek satır görseli|07|S|—|
|F-101|Çok oyunculu "Online Hayat"; UGC yazım aracı|Hayat Oyunu, Episode|TR'de ilgi; moderasyon yükü|ALMA|Backend yok; Dosya Kodu rövanşı yeter|10, 08|—|KVKK/moderasyon|
|F-102|"Seni elinden tutmaz" pazarlama tonu|ReLife TikTok|Övgü|AL (pazarlama)|"Sana karşı iddiaya girer" aynı damar|11|S|—|

### 2.11 Kişiselleştirme

|ID|Özellik|App'ler|Oyuncu tepkisi|Karar|Motto'da nasıl|Dok.|Efor|Hukuk|
|---|---|---|---|---|---|---|---|---|
|F-103|Custom Life: ad, cinsiyet, ülke, şehir|BitLife, AltLife|*"playable Palestine"* tipi talepler|UYARLA|Müşteri Dosyası [Karıştır] [Bu olsun]; ülke yok, şehir var|07|var|Siyasi coğrafya yok|
|F-104|God Mode / aile editörü|BitLife 9,99 $, SimLife, DogLife Top Dog|*"pay to choose your dog breed"*|ALMA|Stat düzenleme iddiayı bozar; ilk hayat elle yazılı|06, 04|—|—|
|F-105|Avatar / kıyafet özelleştirme|AltLife, Episode|*"avatar customization… WAY better"*|ALMA|Oyuncu avatarı yok; koç avatarı sabit|07|—|—|
|F-106|Dark Mode (premium'a kilitli)|BitLife Bitizen|ekşi: koyu tema övgüsü|AL (ücretsiz)|Koyu tema varsayılan|07|S|—|
|F-107|Kozmetik ödül (şapka, tema)|BitLife challenge|*"Fancypants"*|UYARLA|Damga mürekkebi, karne teması, Defter kapağı|05, 06|S|—|
|F-108|Persona ton ayarı|Carrot Weather|10 yıllık model|AL|Nazik/Normal/Acımasız|01|var|—|

### 2.12 Mini-oyun

|ID|Özellik|App'ler|Oyuncu tepkisi|Karar|Motto'da nasıl|Dok.|Efor|Hukuk|
|---|---|---|---|---|---|---|---|---|
|F-109|Tek kurallı 20 sn mikro-oyun (Pac-Man hırsızlık, Snake isyan)|BitLife|Sevilen|UYARLA (kalıp)|Göz teması + 2 aday ("Kombi ustası pazarlığı", "Okundu bırakma"); mekanik alınır, içerik değil|07|M|—|
|F-110|Canlı dövüş / 17 mini-oyun / ritim / yazma testi|AltLife, LifePop, Reigns Beyond, Spent|*"rhythm component is weak"*, *"rushed"*|ALMA|Tek mini-oyun kuralı|07|—|—|
|F-111|Reklam izle → mini-oyunu atla|BitLife|Kabul görüyor|ALMA|Atlama satılmaz; beceriksizlik sonucu da komik|06|—|—|

### 2.13 Monetizasyon

|ID|Özellik|App'ler|Oyuncu tepkisi|Karar|Motto'da nasıl|Dok.|Efor|Hukuk|
|---|---|---|---|---|---|---|---|---|
|F-112|Interstitial her tur (~70 sn / 30 sn)|BitLife, Life Choices, 100 Years|1★'ların ~%35'i: *"ads on nearly every action"*|ALMA|Oturumda ≤ 1, gönüllü oturum sonu; ölümde asla; ilk 2 oturumda yok|06|—|Better Ads|
|F-113|Rewarded ile iyi/3. seçenek kilidi|BitLife, Life Choices|*"good choices only by watching multiple Ads"*|ALMA (kilit) · DERS|Taktik Değişikliği **ek absürt yol**, en iyi ücretsiz seçeneği geçmez, kilitli görünmez (D-ÖNERİ-12-02)|06, 03|—|Reklam Kurulu|
|F-114|Kalıcı tek premium 7,99–9,99 $|BitLife Bitizenship, AltLife Premium, SimLife|En az tartışılan; şikâyet yalnız restore|UYARLA|Torpil 6,99 $ / 199,99 ₺; oynanışa kilitli perk (2 nesil, 4 hayvan) alınmaz|06|var|Apple 3.1.1|
|F-115|Ayrı "Remove Ads" 2,99 $ / Top Dog 4,99 $|9 app; DogLife|2,99 tartışmasız; 4,99 yalnız reklam için *"not worth"*|ALMA (ayrı SKU)|Zorunlu reklam yok → kaldırılacak reklam yok; Torpil'in alt sınırı 4,99|06|—|—|
|F-116|Boss Mode / Expansion vitrini (15 kalem, 100 $+)|BitLife|*"40 other payments"*; *"relabeled so people would pay more"*|ALMA|≤ 3 kalem; fiyat listesi sabit vaadi|06|—|Gizli maliyet yok|
|F-117|Abonelik|ReLife, ZipLife, Tiny Fates, Choices VIP|*"strictly monthly"*; *"unintentionally sign up"*|ALMA|Abonelik yok (D-ÖNERİ-12-01 "2. faz" notunu kapatır)|06|—|DMCC yükü sıfır|
|F-118|Premium seçenek (elmasla, kilitli görünür)|Episode, Choices|*"even the opportunity to experience chance is taken away"*|ALMA (kırmızı çizgi)|"Seçenekler satılık değil." mağaza satırı|06, 11|—|Reklam Kurulu|
|F-119|Banner / mikro-IAP enflasyonu / stat atlama kısayolu|ALTER EGO, Life Story, Infinite Life|*"cash grab"*|ALMA|—|06|—|—|
|F-120|Mağaza metninde dürüst model satırı|AltLife, Alter Ego *"never forced on us"*, SimLife *"earned in-game"*|5★ teması P5|AL|"Zorunlu reklam yok. Koç bile buna şaşırdı." · "Seçenekler satılık değil." · "Fiyat listesi sabit."|06, 11|S|Doğru olmalı: harness kanıtı|
|F-121|Restore çalışmaması|BitLife, Life Choices, AltLife, CatLife|1★'ların ~%20'si|DERS|Sprint 0 zorunlu test: yeniden kurulum, cihaz değişimi, iki mağaza|06, 10|S|Apple 3.1.1|
|F-122|Fiyat zamları; TR'de USD paritesi|BitLife (4,99→9,99 $; ₺999,99)|TR 1★|ALMA|Yerel kademe (199,99 ₺ baz); artış yalnızca yeni D-kaydıyla|06|—|Sahte indirim yok|
|F-123|Ücretli premium app / kitap başına IAP|Reigns, Lifeline, CoG|*"worth it"* ↔ *"short for the price"*|ALMA|F2P + Torpil; premium TR'de keşfi öldürür|06|—|—|
|F-124|Rewarded = gerçek değer hissi|Idle Guy (4,8★)|*"tolerable as I'm getting something out of it"*|DERS|Rewarded yalnızca Ek Antrenman / Forma / Fizyoterapi; ödül daima verilir|06|—|—|

### 2.14 UX / UI / ASO / erişilebilirlik

|ID|Özellik|App'ler|Oyuncu tepkisi|Karar|Motto'da nasıl|Dok.|Efor|Hukuk|
|---|---|---|---|---|---|---|---|---|
|F-125|Alt bar 5 sekme; olay modal|BitLife|AppleVis: *"modal windows improperly coded"*|UYARLA|Tek Hayat Akışı (modal yok) + Defter/Karne/Sözlük/Kamp|07|var|—|
|F-126|Stat çubukları 4 görünür + gizli|BitLife|Okunur|AL|4 stat; gizli yerine kalıp sayaçları|02, 07|var|—|
|F-127|Swipe = cevap|Reigns, Life Choices, 1 in 8 Billion|*"super addictive"*|AL|2 seçenekte kaydırma (eşik %35); 3+ butonlar|07|S|—|
|F-128|Kaydırmada etkilenecek stat noktaları önceden görünür|Reigns|Tutorial'sız öğretiyor|AL|HUD'da nokta (yön değil varlık); koç: "Evet, kafana dokunacak. Nasıl, söylemem."|07|S|—|
|F-129|Tutorial yok; doğum satırı ilk şaka|Reigns, BitLife|İlk kahkaha burada|AL|§4.2: "Deniz Ertelemez. Soyadın bir vaat."|01, 07|var|—|
|F-130|8 göstergeli panel; "cramped interface"|RoboBot, LifePop|3,3★; okunmuyor|ALMA|4 stat + Durum şeridi; kart 25–45 kelime|07|—|—|
|F-131|VoiceOver / TalkBack|AppleVis, ZipLife yorumu|*"completely unusable with VoiceOver"*|AL|Chat-UI lineer liste; Sprint 0 kabul kriteri; reduced-motion|07, 10|M|—|
|F-132|Autosave yok / ilerleme kaybı|Biddulph, AltLife, Life is a Game|1★'ların ~%10'u|AL (kural)|Her beat sonrası autosave; harness|10|S|—|
|F-133|Oyun içi wiki|Roleplay Sim|Övgü|UYARLA|Yardım = koçun SSS'si ("Neden öldüm?" → sebep + ders)|07|S|—|
|F-134|Ekran görüntüsü yazıları indekslenir (2026)|ASO rehberleri|—|AL|5 ekran = 5 imza cümle|06, 11|S|Rakip marka adı yok|
|F-135|"Marka: kategori" başlığı; TR'de yerelleştirilmiş başlık|9/10 top-10; Unico "Seçimler"|Keşif için şart, kalite sinyali değil|UYARLA|"Motto: Sertifikasız Hayat Koçu"; "life simulator" **alt başlıkta** ("Gün gün hayat simülasyonu")|06, 11|S|"BitLife" / "games like" yok|
|F-136|Tek binary çok dil|BitLife Español kapandı; GO! *"tekrar satın al"*|Satın alma taşınmadı|AL|TR+EN tek app, tek entitlement|09, 10|var|—|
|F-137|Makine çevirisi hissi|BitLife GO! TR, Hayat Hikayesi (başlık TR, oyun EN)|*"eksik ve yanlış ama anlaşılır"*; "tuzak"|ALMA (anti)|Transcreation; mağaza görselleri TR; "anlaşılır ama yanlış" kabul edilmez|09|—|Yanıltıcı dil beyanı yok|
|F-138|Gerçek takvim tarihi kartta|Spent, Lifeline|Takvim bağı|AL|"Gün 1 · Salı, 3 Mart 2026" + üstte canlı saat|07|var|—|
|F-139|Siyah-beyaz-kırmızı, yazı odaklı sanat|ALTER EGO|*"polished design"*, *"beautiful music"*|UYARLA|"Resmî Evrak + antrenman defteri", acid-lime; özgün kısa müzik|07|var|Telifli müzik yok|

**Havuz özeti:** 139 özellik/kalıp. Dağılım (tablo sayımı): AL 46 · UYARLA 52 · ALMA 37 · DERS 4. AL+UYARLA'nın 29'u "var" (D-061–D-067 ve §11 kapsıyor); efor atanmış 72 satır yeni iş emri (S 57, M 15, L 0). Hukuk sütununda 44 satır T9 notu taşır; hiçbiri yeni kırmızı çizgi gerektirmez — hepsi mevcut ASLA listesinin (gerçek marka/kişi/kurum/parti/din, kumar/madde özendirme, intihar) uygulamasıdır.

---

## 3. KOPYA LİSTESİ — ilk 30 (öncelik = etki × kanıt gücü / efor)

Etki: ↑↑↑ doğrudan retention/dönüşüm/paylaşım · ↑↑ dolaylı · ↑ hijyen. Durum: **YENİ** = D-068–D-082; **VAR** = mevcut karar, teardown doğruluyor; **ÖNERİ** = §6.

|#|Özellik (havuz ID)|Kaynak|Karar|Efor|Etki|Durum|Sahip|
|---|---|---|---|---|---|---|---|
|1|Ölüm özeti paylaşım kartı: mezar taşı + cenaze sayısı + Koçun Son Sözü + emoji satırı (F-060, 061, 095, 100)|BitLife, SimLife, Tiny Fates|AL|S|↑↑↑|YENİ D-068|07, 02|
|2|Kaydırmada etkilenecek stat noktaları (F-128)|Reigns|AL|S|↑↑|YENİ D-069|07|
|3|Varlıklar olay havuzunu değiştirir (F-046)|AltLife|AL|M|↑↑|YENİ D-070|03, 04|
|4|Durumsal NPC desteleri, ilk temasla açılır (F-017)|Reigns|AL|M|↑↑|YENİ D-071|03, 04|
|5|NPC'lerin kendi hayatı; Tanıdık Yüzler yaşlanır/ölür (F-015)|BitLife|AL|M|↑↑|YENİ D-072|04|
|6|Mağaza vaadi satırları + ASO paketi (F-120, 134, 135)|AltLife, Alter Ego, Unico|AL|S|↑↑ dönüşüm|YENİ D-073|06, 11|
|7|Roast Raporu skor dökümü (F-082)|Seedship|AL|S|↑↑|YENİ D-074|02, 07|
|8|"Müşterilerimin %X'i" hayali kohort satırı (F-098)|Spent|UYARLA|S|↑↑|YENİ D-075|03, 01|
|9|"Sen yokken" zarf birikimi (F-004)|ALTER EGO|UYARLA|S|↑↑|VAR D-065|05|
|10|Haftalık ritüel Antrenman Kampı, tema + kozmetik (F-011, 085)|BitLife|UYARLA|M|↑↑↑|VAR §4|05|
|11|Dosya Kodu rövanşı (F-097)|Tiny Fates|UYARLA|M|↑↑ paylaşım|YENİ D-076|05, 10|
|12|Eski Müşteriler listesi (F-073)|Reigns, BitLife|AL|S|↑|YENİ D-077|05, 07|
|13|"Geçen hayatta bunu seçmiştin" rozeti (F-081)|Choice of Life|UYARLA|S|↑↑|YENİ D-078|03, 07|
|14|Makro olay ekseni rakamsız (F-050)|TC Simülasyonu, Lagos Life|UYARLA|M|↑↑ TR|YENİ D-079|02, 03|
|15|Freelance gig günlük satırı (F-027)|BitLife|AL|S|↑|YENİ D-080|02, 04|
|16|Evcil hayvan aylık gider + ölüm kartı (F-042)|BitLife, DogLife|AL|S|↑↑|VAR D-067|02, 04|
|17|Tepki arketipleri görünür (F-018)|InstLife|UYARLA|S|↑|ÖNERİ-12-05|03|
|18|Karne "Davranış" 3 ikili eksen (F-080)|Choice of Games|AL|S|↑|ÖNERİ-12-06|02, 05|
|19|Aşırılık Teşhisi (F-064)|Reigns|UYARLA|S|↑|ÖNERİ-12-07|02, 05|
|20|Koçun Son Sözü = yeni hayata iddia (F-062)|Roleplay Sim|UYARLA|S|↑|ÖNERİ-12-08|01|
|21|Aylık ücretsiz içerik + mevsimlik ikon + yama notu koç ağzında (F-088, 090)|BitLife, Infinite Life|AL|S|↑↑ P2|YENİ D-081|11, 07|
|22|Sezon Paketi içerik takvimi, içindekiler yazılı (F-089)|BitLife bundle'ları|UYARLA|M|↑↑|YENİ D-081|06|
|23|Restore + autosave + VoiceOver Sprint 0 kriterleri (F-121, 131, 132)|T2/T5/G7 şikâyetleri|AL|M|↑↑ 1★ önleme|YENİ D-082|10, 07, 06|
|24|"Koçun ofisi" duvarı (F-075)|Life Choices|UYARLA|M|↑|ÖNERİ-12-09|05, 07|
|25|"Tam Dosya" PDF (F-099)|1 in 8 Billion|UYARLA|M|↑ Torpil değeri|ÖNERİ-12-10|07, 10|
|26|Flört profili kartı (F-022)|Roleplay Sim|UYARLA|S|↑|ÖNERİ-12-11|04, 07|
|27|İçerik üreticisi "yorumlar" kartı (F-029)|AltLife|UYARLA|S|↑|ÖNERİ-12-11|04|
|28|Onyılın Ödülü (F-078)|ReLife|UYARLA|S|↑|ÖNERİ-12-12|05|
|29|Kapanmamış Dosyalar (F-077)|Reigns: Her Majesty|UYARLA|S|↑|ÖNERİ-12-12|05|
|30|"Koçun 12 sırrı" + olay koleksiyonu yüzdesi (F-076)|LIFEISH, Reigns|AL|S|↑|ÖNERİ-12-12|05, 11|

**YENİ 15 kararın eforu:** S × 8, M × 7, L × 0; Sprint 1–3'e sığar, çekirdek motoru (D-061/066/067) değiştirmez. İlk 8'in tamamı paylaşım, şeffaflık ve dünya hafızası — kümede boş sütunlar (D §4: NPC diyalog 1/10, paylaşım kartı 2/10, hafıza 1/10).

---

## 4. Fiyat matrisi özeti ve Torpil kararına etkisi

### 4.1 Rafın fiyat noktaları

|Nokta (USD)|App sayısı|Tipik kalem|Oyuncu tepkisi|Motto karşılığı|
|---|---|---|---|---|
|0,99|4|Ölümü geri al, jetpack|*"pay a dollar to undo death"*|Yok|
|1,99–2,99|9|Reklam kaldırma, küçük açılım|**En az tartışılan**|Antrenman Bileti (29,99 ₺)|
|3,99–4,99|8|Reklam kaldırma pahalı uç, Top Dog, bölüm|4,99 yalnız reklam için *"not worth"*|Sezon Paketi (2,99–4,99 $; 119,99 ₺)|
|5,99–6,99|4|Para paketi, Job Pack (tüketilebilir)|"cash grab" sözcüğü burada — paketler için|**Torpil 6,99 $** (kalıcı)|
|7,99–9,99|7|Kalıcı premium (Bitizenship, AltLife, SimLife, Unlock All)|**Kabul edilen çıpa**; şikâyet restore|Torpil'in üst referansı|
|14,99–20,99|5|Bitizen+God 15,99; Boss Mode 20,99; Remove All Ads 14,99|*"not fairly priced"*; yeniden etiketleme öfkesi|Yok|
|29–49,99|2|Ultimate Bundle, Perma Income|Sessiz; bölgesel tutarsızlık 2,5×|Yok|
|Abonelik|4|God mode + reklamsız + bulut|*"strictly monthly"* küçük stüdyoda bile|Yok|

**TR gözlemi:** Candywriter USD paritesinde (₺349,99 ≈ 7,99 $; Boss Mode ₺899,99–999,99) ve TR yorumları bunu şikâyet ediyor; GO! ana uygulamadan pahalı. Yerli uygulamalar "Reklamları Kaldır" tek kalemle ucuz uçta. Apple TR eşlemesi: 4,99 $→₺249,99 · 6,99 $→≈₺349,99 · 9,99 $→₺399,99.

### 4.2 Torpil 6,99 $ / 199,99 ₺ doğru mu? — **Evet, iki koşulla.**

1. **USD (6,99 $):** Raf iki kanıt veriyor: 7,99–9,99 $ kalıcı premium kabul edilen çıpa; 4,99 $ yalnız reklam kaldıran paket "not worth". Torpil ikisinin arasında — reklam kaldırmadan **fazlası** (iki koç kişiliği, karne temaları, defter dışa aktarımı, sınırsız arşiv, 3 kayıt yeri) ama Bitizenship'in oynanışa kilitli perk'lerinden (2 nesil, 4 hayvan) **azı**. "7 doların altı" küçük stüdyo rafıyla (Alter Ego son açma 4,99–6,99 $) aynı cümlede okunur; 7,99 $'a çıkmak "hayatın değişmez, menü değişir" vaadiyle Bitizenship'e eşitlenmek olur. **6,99 $ kalır.** Soft launch'ta Torpil D30 dönüşümü ≥ %1,5 kapısı (06) geçilirse 7,99 $ testi yalnızca yeni kullanıcıda ve yeni D-kaydıyla; mevcut fiyatı artırmak BitLife'ın %60–100 zam öfkesini (F-122) tekrar eder.
2. **TRY (199,99 ₺):** Apple otomatik dönüşümü ≈ ₺349,99 verirdi; raf USD paritesinin TR'de doğrudan 1★ ürettiğini gösteriyor. Küme C §9.4 yerel kademe için ₺149–199 bandını önerir; 199,99 ₺ bandın üst ucu ve AltLife/BitLife'ın yarısı. **Doğru; baz fiyattır, indirim değil** (üstü çizili fiyat yok — Reklam Kurulu). Play'de aynı ₺, aynı gün.
3. **Koşul A — restore:** Rafta kalıcı premium'un tek şikâyeti "ödedim, sayılmadı". Torpil'in satışını fiyat değil restore belirleyecek: yeniden kurulum, cihaz değişimi, iade sonrası sessiz kapanış — Sprint 0 kabul kriteri (D-082).
4. **Koşul B — kalem sayısı sabit, ayrı "Remove Ads" yok:** Zorunlu reklam olmadığından reklam kaldırma SKU'su açılmaz; açılırsa Torpil "reklamsız + 2 dolar" diye okunur ve 4,99 "not worth" kapanına düşer. Vitrin ≤ 3 kalem; Bilet (29,99 ₺) ve Sezon Paketi (119,99 ₺) rafın "1,99–2,99 tartışmasız" ve "3,99–4,99 içerik" bantlarıyla uyumlu.
5. **Sepet cümlesi:** "Her şeyi al" ≈ 12 $ / ≈ 320 ₺ — BitLife sepetinin (100 $+ / ₺3.000+) onda biri; publisher pitch'ine ve "Fiyat listesi sabit" satırına girer (D-073).
6. **Ad çatışması kapatıldı:** B/D'nin "Sertifika 7,99 $ + Torpil 4,99 $" iki kalemli önerisi reddedilir; tek kalıcı kalem Torpil (D-038). "Sertifika" koçun sertifikasızlığıyla çakışır; olay adı olarak serbest.

---

## 5. Oyuncuların istediği ama kimsenin vermediği 10 şey

|#|İstek (oyuncu dili)|Kanıt|Rafta en yakın|Motto cevabı|
|---|---|---|---|---|
|1|**Konuşan aile:** kardeş, dayı, iş arkadaşıyla gerçek etkileşim|itch.io: *"interacting with siblings, extended family"*; AltLife *"no co-workers"*|BitLife menü listesi|8 Tanıdık Yüz + durumsal desteler akışta konuşur (D-062, D-071)|
|2|**Kişisel hayatı değiştiren olaylar**, ekonomiyi değil|*"events that effect your personal life rather than just the economy"*|Alter Ego (az ama anlamlı)|Her gösterilen günde tam olay; olay Durum şeridini kalıcı değiştirir (D-061, D-067)|
|3|**"Aynı kararlar her hayatta" tekrarına çare**|Life Choices; BitLife *"very quickly lost its appeal"*; Reigns *"common cards repetitive"*|ReLife "no safe choices"|`metaMemories`, Fazla Bagaj, Kronik, "geçen hayatta bunu seçmiştin" rozeti (D-078)|
|4|**Reklamsız, dürüst model; ödediğim sayılsın**|T1+T2 = 1★'ların yarısından fazlası; TR *"her iki seçenekte bir reklam"*|AltLife, Life in Text|Zorunlu reklam yok; tek premium; restore testi; mağaza vaatleri (D-073, D-082)|
|5|**Yerel doku:** enflasyon, kira zammı, aile grubu|TC Simülasyonu *"No economic inflation, no reference to turkish traditions"*|TC Simülasyonu (1 M+, 2,8–3,9★)|TR birincil yazım; makro olay ekseni rakamsız (D-079); kombi ustası, dayı|
|6|**"Neden öldüm?"** — ölümün anlamı, satın alma yerine|*"pay a dollar to undo death"* ↔ ZipLife *"unfair early deaths"*|SimLife rewind (ters uç)|Roast Raporu + skor dökümü (D-074) + koruma penceresi; koç sebep + ders verir|
|7|**Karakterin mesaj atması, bekletmeden**|Lifeline övgü/şikâyet ikilisi|Lifeline, Alter Ego|Chat-UI + ▶▶ + ≤ 1 bildirim/gün koç ağzından; bekleme satışı yok|
|8|**Seçeneklerin satılık olmaması; şans bile olsa**|Choices *"opportunity to experience chance is taken away"*|Alter Ego *"never forced on us"*|"Seçenekler satılık değil."; Taktik Değişikliği ek absürt yol (D-ÖNERİ-12-02)|
|9|**Paylaşılabilir, bitmeyen sonuç sayfası**|BitLife mezar taşı TikTok; Alter Ego kartı Instagram|2/10 app|Karne + Yılın Mottosu + Roast kartı + Dosya Kodu rövanşı (D-068, D-076); backend'siz|
|10|**Ekran okuyucuyla oynanabilen hayat simi**|AppleVis *"unusable with VoiceOver"*; ZipLife TR yorumu|Hiçbiri|Chat-UI lineer liste; Sprint 0 kabul kriteri (D-082); mağaza metninde yazılır|

**Hiçbir uygulama 1 + 2 + 3'ü birlikte vermiyor** (konuşan aile + kişisel olaylar + hatırlayan dünya); pitch'in ilk slaydı ve ASO ekran görüntüsü 3 ("Karakterler cevap verir") bu üçlüye konuşur.

---

## 6. D-ÖNERİ listesi (00 §13'e girmeyen, sahip onayı bekleyen)

|#|Öneri|Gerekçe (teardown kanıtı)|Dok.|Efor|
|---|---|---|---|---|
|D-ÖNERİ-12-01|**Abonelik "2. faz" notu kaldırılsın; Motto'da abonelik yoktur.**|00 §8 aboneliği 2. faza bırakıyor; raf 4 örnekte de *"strictly monthly"* tepkisi; BitLife BitPass'i kaldırdı; DMCC/Apple 3.1.2 yükü sıfır.|06|—|
|D-ÖNERİ-12-02|**Taktik Değişikliği kuralı:** rewarded 3. seçenek daima mevcut 2–4 seçeneğe ek ve absürt; beklenen değeri en iyi ücretsiz seçeneği geçmez; kilitli hâlde gösterilmez. Harness AC: Taktik'li hayatların medyan sonucu ≤ Taktik'siz.|Life Choices *"good choices only by watching ads"* 1★ #1 alt nedeni; Episode kilitli seçenek nefreti; "Seçenekler satılık değil" vaadi aksi hâlde yanlış.|06, 03|S|
|D-ÖNERİ-12-03|**Fiyat sabitliği vaadi:** fiyatlar yalnızca yeni D-kaydıyla değişir; mağaza metninde "Fiyat listesi sabit; paket yeniden adlandırma yok".|Bitizenship 4,99→9,99 $; Job Pack→Expansion *"so people would pay more"*.|06|S|
|D-ÖNERİ-12-04|**Mikro-oyun bütçesi 1 + 2:** göz teması + en fazla 2 aday, tek kurallı ≤ 20 sn, reklamla atlanmaz, beceriksizlik de komik.|BitLife escape sevilen; LifePop 17 mini-oyun *"rushed"*; Reigns Beyond ritim *"weak"*.|07, 03|M|
|D-ÖNERİ-12-05|**Tepki arketipleri görünür:** seçenekte küçük ikon (Ertele / Kabullen / Kavga / Pazarlık).|InstLife 4 tepki; CoG görünür stat check; Roast sayıları önceden "görülmüş" olur.|03, 07|S|
|D-ÖNERİ-12-06|**Karne "Davranış" 3 ikili eksenden türesin** (Tam Karne'de satır, HUD'da yok).|CoG ikili kaydırgaç; Alter Ego kişilik kartı paylaşımı.|02, 05|S|
|D-ÖNERİ-12-07|**Aşırılık Teşhisleri:** stat 100'e dayanınca ölüm değil Teşhis + olay.|Reigns 0/100 öğretici; GameFAQs *"seemingly unlimited"*.|02, 05|S|
|D-ÖNERİ-12-08|**Koçun Son Sözü = yeni hayata iddia fişi;** ilk yılda çözülür.|Roleplay Sim "ölümde ipucu"; iddia mekaniği ömürler arası köprü kazanır.|01, 03|S|
|D-ÖNERİ-12-09|**"Koçun ofisi" duvarı** (opsiyonel meta ekran).|Life Choices başarım→kasaba; Monopoly Go görünür ilerleme; Sprint 3+.|05, 07|M|
|D-ÖNERİ-12-10|**"Tam Dosya" PDF** Torpil defter dışa aktarımına eklenir.|1 in 8 Billion HTML kitap; Torpil'e kalıcı değer.|07, 10|M|
|D-ÖNERİ-12-11|**İki olay kartı tipi:** kurgusal flört profil kartı; içerik üreticisi "yorumlar" kartı.|Roleplay Sim profil tarayıcı; AltLife Utoob. Hukuk: gerçek platform adı yok.|03, 04, 07|S|
|D-ÖNERİ-12-12|**Koleksiyon ekleri:** Onyılın Ödülü, gizli Kapanmamış Dosyalar (≤ 10), olay koleksiyonu yüzdesi, "Koçun 12 sırrı".|ReLife Life Awards; Reigns HM objectives; LIFEISH "15 gizli sır".|05, 11|S|
|D-ÖNERİ-12-13|**Sprint 0 doğrulama:** 5 uygulama cihazda 10'ar dk; TR fiyatları; Reddit "I wish BitLife" teyidi; Apple Search Ads skorları ("hayat koçu", "life coach").|A/B/C/D yöntem notları: mağaza doğrudan çekilemedi, onboarding çıkarım, Reddit indekslenemedi.|11|S|

---

## 7. Kaynak dosyalar

- `docs/research/12-app-store-teardown/A-bitlife-ailesi.md` — BitLife, DogLife, CatLife, InstLife; 47 kaynak.
- `docs/research/12-app-store-teardown/B-bitlife-klonlari.md` — 15 klon + uzun kuyruk; zaman birimi ve monetizasyon kalıpları; 68 kaynak.
- `docs/research/12-app-store-teardown/C-anlati-ve-secim-oyunlari.md` — Reigns, Spent, Choice of Life/Games, Lifeline, Episode/Choices, Seedship, indie'ler, TR App Store; 83 kaynak.
- `docs/research/12-app-store-teardown/D-yorum-madenciligi-aso-fiyat.md` — ASO, fiyat matrisi, 79 alıntı, özellik sıklığı, boşluklar; 44 kaynak.
- `docs/design/12-benzer-oyunlar-ozellik-karsilastirmasi.md` — D-065 benchmark kararları.
- `docs/design/00-VIZYON-ve-KARARLAR.md` §13 — bu dokümandan türeyen D-068–D-082.
