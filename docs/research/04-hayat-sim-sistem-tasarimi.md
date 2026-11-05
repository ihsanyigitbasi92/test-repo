# T4 — Hayat Simülasyonu Sistem Tasarımı Referansı
### Storylet/olay motoru, istatistikler, kariyer, ilişkiler, ölüm, meta-progression

> Proje: Backend'siz, offline, Türkçe-öncelikli mobil hayat simülasyonu (18 yaşından ölüme). Ton: kara komedi + taşak geçen anlatıcı + gizli motivasyon. Bu belge **sistem tasarımının referans dokümanı**dır; GDD'nin "Systems" bölümü buradan beslenecek.
> Tarih: 2026-11-05 · Yazar: Sistem tasarımı araştırma ajanı (T4)

---

## TL;DR

1. **Tur = 1 yıl, ama yıl "beat"lere bölünür.** Her yıl 2–5 beat (olay) oynatan bir "director" ile 70 yıllık bir hayat ≈ 225 beat ≈ 55–75 dk oynanır. Ay/hafta turu 70 yıl için çok fazla tıklama demek; ay granülerliğini yalnızca belirli arklarda (askerlik, hamilelik, sınav) "alt-tur" olarak kullanıyoruz.
2. **Stat seti: 4 çekirdek + para + 3 komedi metresi + 2 gizli.** Çekirdek: Sağlık, Keyif, Kafa, Çekicilik (BitLife'ın kanıtlanmış dörtlüsü, Türkçeleştirilmiş). Komedi metreleri: **Ego**, **Cringe**, **Anne Baskısı** — ciddi değerlendirdik, üçü de hem mekanik hem mizah üretiyor, kalıyor. Gizli: Karma (şans çarpanı) ve Stres (sağlık erozyonu).
3. **Olay motoru = storylet (QBN) + salience skorlama + director pacing.** Failbetter'ın "kalite kapılı storylet" modeli, Elan Ruskin'in "en spesifik kural kazanır" skorlaması ve Left 4 Dead'in Build-Up/Peak/Relax döngüsü tek motorda birleşiyor. Yarn Spinner'ın varsayılan stratejisi (Random Best Least Recently Viewed) tekrar-önleme için iyi bir taban.
4. **İçerik hacmi: lansmanda 700 olay + 40 zincir, 6. ayda 1.500+.** Reigns ~900 kartla tam oyundu, King of Dragon Pass 614 sahneyle kült oldu, Fallen London 10 yılda 5.284 storylet'e ulaştı. Her olayın 2–3 metin varyantı algılanan içeriği 2× çarpar.
5. **Ölüm modeli: Gompertz hazard (her 8 yılda ikiye katlanır) × sağlık çarpanı.** TÜİK 2023–2025 doğuşta beklenen yaşam 78,5 (E 75,9 / K 81,1). Kalibre edilmiş model: sağlık 100'de medyan ölüm ~89, sağlık 0'da ~61. Dramatik "senaryo ölümleri" hazard'dan ayrı bir "scripted track"te.
6. **Ölüm nedenleri gerçek dağılımdan başlar, komedi için bükülür.** TÜİK 2024: dolaşım %36, tümör %16,3, solunum %15; trafik ölümlerinin %15,1'i 18–24 yaş. Oyun içi nedenler bu tabana "absürt kuyruk" (%5) ekler.
7. **Ekonomi: iç değerler "reel birim", ekrandaki rakamlar nominal TL × enflasyon çarpanı.** Enflasyon espri malzemesi olur ama dengeyi bozmaz. 2026 net asgari ücret 28.075,50 TL ve yıllık TÜFE ~%30 gerçek referans olarak kullanılıyor.
8. **Kariyer: 24 kariyer, 4–6 basamaklı merdiven, 1/3'ü absürt** (Kahve Falcısı, Kripto Gurusu, Düğün DJ'i, Müteahhit...). Terfi = stat + süre + "patron olayı" kombinasyonu.
9. **İlişkiler hafızalıdır.** Her NPC, etiketli "anı" listesi tutar; callback olayları bu anılara referans verir ("Düğünde eski sevgilin seni gördü — 2019'da ona 'sen benim her şeyimsin' demiştin, hatırlıyor").
10. **Legacy: "reenkarnasyon perk'leri" + anlatıcı hafızası.** Ölünce kazanılan "Tecrübe Puanı" ile kalıcı trait'ler açılır; anlatıcı geçmiş hayatlara gönderme yapar ("Üçüncü hayatında da 23'ünde kripto aldın. Saygı duyuyorum.").
11. **Deterministik RNG (sfc32) + seed = hash(lifeId, yıl).** Haftalık "Herkes aynı hayatı yaşıyor" modu tamamen offline çalışır; skor paylaşımı ekran görüntüsü/kod ile.
12. **Yazarlık formatı: inline Türkçe metinli YAML → build'de JSON + locale dosyaları.** Ink/Yarn/Twine motoru değil, kendi şemamız; Ink yalnızca uzun, dallanan "özel bölümler" için opsiyonel (inkjs sıfır bağımlılık, RN'de çalışır).
13. **İçerik pipeline: AI üretir, insan küratör eder, lint doğrular, 10.000 simüle hayat test eder.** Tone-lint (yasak hedefler, uzunluk, valans etiketi), şema doğrulama, erişilebilirlik (dead content) analizi ve tekrar oranı ölçümü CI'da.
14. **Offline playtest: RITE yöntemi + "kahkaha günlüğü" + opt-in yerel log dışa aktarma.** Telemetri yok; 5–8 kişilik sesli-düşünme oturumları, her oturumda düzelt.

---

## Varsayımlar

- Teknoloji: React Native/Expo (TypeScript). Motor saf TS kütüphanesi olarak yazılır, UI'dan bağımsız test edilir. (Flutter olsaydı aynı şema `ink_dart` benzeri bir çevirmenle taşınırdı; şema motor-bağımsızdır.)
- Oyun başlangıcı 18 yaş; ölüm 35–100 aralığında; hedef medyan ~75.
- Bir "hayat" 45–90 dk; oturum 8–20 dk (mobil). Bir yıl bir oturumda 5–12 kez "yaşlan" basılır.
- İlk dil Türkçe, kültürel referanslar Türkiye (askerlik, kira zammı, anne baskısı, dolmuş). İngilizce lokalizasyon için metinler anahtarlı ve kültür-notlu yazılır.
- Backend yok: tüm içerik uygulama paketinde (JSON), ilerleme cihazda; haftalık mod tarih-seed'iyle üretilir.
- Monetizasyon (T3'ün konusu) bu belgede yalnızca sistemi etkilediği yerde geçer (ör. "premium kariyer paketi" olay etiketleri).

---

## 1. BitLife-benzeri sistemlerin anatomisi

### 1.1 Tur yapısı: yıl mı, ay mı, hafta mı?

| Oyun | Tur birimi | Hayat uzunluğu (tur) | Tur başına karar | Not |
|---|---|---|---|---|
| BitLife | 1 yıl ("Age" butonu) | ~80 | 0–3 pop-up + serbest menü aksiyonları | Yılda yalnızca bir seyahat olayı gibi kategori kotaları var |
| Alter Ego (1986) | Yaşam evresi (7 evre) | 7 evre × 20–40 düğüm | Haritadan düğüm seçimi | 1.200 sayfa mülakat malzemesi; psikolog tasarımı |
| Reigns | 1 kart (yıl sayacı hızlı akar) | ~50–200 kart/saltanat | 1 (sola/sağa) | 4 kaynak; ~900 kart ilk oyunda, 1.200 kart Her Majesty'de |
| Princess Maker 2 | 1 ay (3×10 günlük blok) | 8 yıl × 12 = 96 | 3 blok ataması | 15 iş, 10 ders; stres/stamina baskısı |
| Long Live the Queen | 1 hafta | 40 hafta | 2 ders + hafta sonu aktivitesi | Mood çiftleri öğrenme hızını belirler |
| The Sims | Gerçek zaman (dakika) | Sonsuz | Sürekli | 8 motive, −100..+100 |
| King of Dragon Pass | Mevsim (yılda 5 tur) | ~10 yıl = 50 tur | 1 sahne + yönetim | 614 OSL sahnesi + 462 haber + 84 heroquest |
| Real Lives | 1 yıl | ~80 | Birkaç | Gerçek demografik istatistikle doğum/olay/ölüm |

**Çıkarım:** Yıl turu, mobilde en iyi "bir yaşlan = bir mikro-ödül" ritmini verir; BitLife bunu kanıtladı. Ama "yıl başına tek pop-up" ritmi düzleşir. Princess Maker/LLTQ'nun planlama hissi (ay/hafta) derin ama 70 yıl × 12 ay = 840 tur mobilde "chore"a dönüşür. Çözüm: **yıl turu + yılı beat'lere bölen director** (Bölüm 5).

### 1.2 Stat setleri karşılaştırması

| Oyun | Görünür statlar | Gizli/türev | Tasarım dersi |
|---|---|---|---|
| BitLife | Happiness, Health, Smarts, Looks (0–100; başlangıç Happiness 50–100, Health 80–100, Smarts/Looks 0–100) + Para | Karma, Craziness, Willpower vb. | 4 bar yeterli; "Health yavaş yükselir, nadiren sert düşer" dengesi uzun ömür hissi verir |
| Alter Ego | Calm, Happy, Gentle, Confident, Trustworthy, Thoughtful (kişilik) + Physical/Social/Intellectual/Familial (yaşam alanı) | — | Statlar "seçimde başarı şansı"nı etkiler; kişilik statları roast için altın |
| Reigns | Kilise, Halk, Ordu, Hazine | — | "Ne 0 ne 100" dengesi; aşırı yükselme de ölüm. Bizim Ego metresi için birebir model |
| The Sims | 8 motive (hunger, comfort, hygiene, bladder, energy, fun, social, room) | Mood = ağırlıklı toplam | Düşük ihtiyaçlar mutluluğu baskılar; "fun/social" mutlu olunca daha çok artar (pozitif geri besleme) |
| Princess Maker 2 | ~20 stat (stamina, sinful, stress, refinement, ...) | — | Stres mekaniği: dinlenmezsen hastalık/ölüm |
| Long Live the Queen | 42 beceri, 4 mood çifti | Mood öğrenme çarpanı | "Kategori cap'i: diğer iki beceri 25'i geçmeden 50'yi aşamazsın" — uzmanlaşmayı sınırlayan akıllı kural |
| King of Dragon Pass | Klan kaynakları + 7 danışman | Tanrı gözü, "magic" | Danışman yorumları = anlatıcı sesi; her olayda 7 farklı bakış |

### 1.3 Eğitim → kariyer

BitLife modeli: lise → üniversite (bölüm) → lisansüstü; meslek listeleri eğitim gereksinimine göre filtrelenir; "Work harder" aksiyonu performans barını artırır, terfi yıllık rastgele + performans; maaş yıllık küçük zam. Zayıf nokta: terfi "aynı pop-up"la gelir, kariyerin karakteri yoktur. Princess Maker'da ise iş = stat değiştirici (bazıları negatif: sinful artar), yaşla açılan işler (15 iş, 6'sı başta açık). **Ders:** Her kariyerin kendine özgü olay havuzu olmalı; terfi bir "olay"dır, bir "pop-up" değil.

### 1.4 İlişkiler

BitLife: aile/arkadaş/sevgili/eş/eski/evcil hayvan listeleri, her biri "ilişki barı" (0–100) + yıllık decay; etkileşim menüsü (konuş, hediye, kavga, ...). Alter Ego: ilişkiler evre bazlı sahnelerle anlatılır, ölçek yok ama hafıza var ("daha önce dürüst davranmadın" sonuçlar). Reigns: karakterler kart olarak geri döner, bazı etkiler saltanatlar arası taşınır. **Ders:** Bar + decay ucuz ve okunur; ama "anı" (memory) olmadan ilişki mizah üretmez. Callback için anı listesi şart (3.5).

### 1.5 Varlıklar ve borç

BitLife: gayrimenkul/araç satın alma, kira, kredi; miras tek çocuğa/yaşa bağlı (18+ olmayan çocuk miras alamıyor, mülkler müzayedeye gidiyor) — forum tartışmalarında kafa karıştırıcı bulunmuş. **Ders:** Varlık sistemi basit kalsın: ev (kira/sahip), araç, kredi borcu, "kefil olduğun borç" (Türkiye klasiği). Enflasyon ekranda görünür, iç dengede reel.

### 1.6 Sağlık, suç, rastgele olaylar

BitLife'ta doktor ziyareti = hastalık tespiti + tedavi şansı; "Mind & Body" menüsü (spor, meditasyon, diyet) stat yükseltici; suç menüsü (hırsızlık, soygun, cinayet) ayrı bir mini-oyun ve hapis arkı. **Ders:** Suç/hapis zinciri kara komedi için verimli ama App Store 17+ sınıfı tetikler; biz "beyaz yaka suç + küçük esnaf dolandırıcılığı" tonunda tutup şiddeti anlatıcı yorumuna bırakıyoruz.

### 1.7 Ölüm: gerçek tablolar ve eğlence için ayar

**Gerçek veri (Türkiye):**
- TÜİK Hayat Tabloları 2023–2025: doğuşta beklenen yaşam 78,5 yıl (erkek 75,9; kadın 81,1); 65 yaşında kalan beklenen ömür 18,4 yıl; sağlıklı yaşam süresi 58 yıl.
- TÜİK Ölüm Nedeni 2024: 489.361 ölüm; dolaşım sistemi %36, tümörler %16,3 (bunun %29,1'i akciğer/bronş), solunum %15,0.
- Trafik 2024: 6.352 ölüm; 18–24 yaş grubu trafik ölümlerinin %15,1'i.
- AB-27 2024 doğuşta beklenen yaşam 81,5 — Türkiye 3 yıl geride; "Avrupa'da olsan 3 yıl daha yaşardın" esprisi için hazır veri.

**Gompertz–Makeham yasası:** 30 yaş sonrası yıllık ölüm olasılığı yaklaşık her 8 yılda ikiye katlanır. Tek parametreli, kodlaması 3 satır, gerçeğe şaşırtıcı derecede yakın. Oyun kalibrasyonu 3.6'da.

**Eğlence için bükme ilkeleri:**
1. Gerçek yaş eğrisi tabandır (inandırıcılık + "gerçekten 40'ında ölebilir miyim?" gerilimi).
2. Sağlık statı hazard çarpanıdır (oyuncu ajansı).
3. Ölüm nedeni, yaş grubu + flag'lerle ağırlıklı tablodan çekilir; %5 "absürt kuyruk" (balkondan düşen saksı, düğünde havaya ateş).
4. "Senaryo ölümleri" (zincir sonu, seçim sonucu) hazard'dan bağımsız ayrı kanal — L4D'nin scripted event'leri pacing'den ayırması gibi.

### 1.8 Miras/nesiller, kurdeleler, challenge modları

- BitLife "continue as child": ölünce yaşayan bir çocukla devam; para/araç/ev mirası (vasiyet ile tek çocuğa yönlendirilebilir). Oyuncular miras kurallarını kafa karıştırıcı buluyor → bizde kural tek ve açık olmalı.
- Kurdeleler (ribbons): 24 → 30 → 40 arası büyüyen set; "hayatı nasıl yaşadın"ın özeti (Lazy, Thief, Family Guy...). Challenge'lar haftalık, 4–5 koşullu görev listesi.
- Real Lives: gerçek dünya istatistikleriyle doğum/olay — "istatistik göster" özelliği (Slovakya'da gıda zehirlenmesi sıklığı) bize "Gerçek hayatta bu %0,3 ihtimalle olur, sana oldu, tebrikler" espri formatını veriyor.

### 1.9 Alter Ego, Reigns, Sims, Princess Maker, LLTQ, KoDP — neyi alıyoruz

| Kaynak | Alınan mekanik | Bizim uyarlamamız |
|---|---|---|
| Alter Ego | Kişilik statlarının seçim sonucunu etkilemesi; yaşam evreleri | Ego/Cringe'in seçim başarı şansına etkisi; 4 yaşam evresi havuzu |
| Reigns | "İki uçta da ölüm" dengesi; kartların saltanat-aşırı etkileri | Ego 0'da "görünmez adam" sonu, 100'de "kendi heykelini diktirdi, iflas etti"; legacy flag'leri |
| The Sims | Mood = ağırlıklı toplam; pozitif geri besleme | Keyif = f(sağlık, para, ilişki, stres); yüksek Keyif'te sosyal olay ağırlığı artar |
| Princess Maker | Stres birikimi → hastalık; yaşla açılan işler | Gizli Stres statı; kariyer kilitleri yaş+eğitim |
| LLTQ | Kategori cap kuralı; mood öğrenme çarpanı | Kafa 70'i geçmek için Keyif ≥ 30 şartı ("depresif dahi" engeli) |
| KoDP | Danışman sesleri; sahne etiketleri (@tag) ile rastgele gruplar | Tek anlatıcı + 3 "iç ses" (Anne, Ego, Vicdan) yorumları; tag tabanlı havuz |
| Fallen London | Kalite kapılı storylet; "quality" = sayısal dünya hali | Flag + stat + relation preconditions; "Cringe" bir quality olarak hikâye kapısı |

### Bu oyuna nasıl uygularız (Bölüm 1)
- Tur = yıl; yıl içinde director 2–5 beat çalıştırır; serbest aksiyon menüsü (iş, ilişki, sağlık, para, "saçmalık") yılda sınırsız ama "enerji" ile 3–5 anlamlı aksiyonla sınırlı.
- 4 çekirdek stat BitLife modelinden, isimleri Türkçe ve tonlu: **Sağlık, Keyif, Kafa, Çekicilik.**
- Kariyer olay havuzları, hafızalı ilişkiler, Gompertz ölüm, ayrı "senaryo ölümü" kanalı.
- Kurdele ve haftalık challenge'lar lansmanda (retention için; T5 ile uyumlu).

---

## 2. Prosedürel anlatı teorisi uygulaması

### 2.1 Storylet ve kalite tabanlı anlatı (QBN)

Emily Short'un tanımı: storylet = **önkoşul + içerik + dünya haline etki** olan, kendi başına bütün, yeniden birleştirilebilir anlatı parçası. Failbetter'ın "quality-based narrative"i: tüm dünya hali sayısal "quality"ler (Fallen London'da 3.582 quality, 5.284 storylet; 4,5 milyon kelime), storylet'ler quality eşikleriyle açılır/kapanır. Short'un uyarısı: havuz büyüyünce "oynanabilir storylet listesi" oyuncuyu boğar → bizde liste yok, **director seçer**, oyuncu sadece seçeneklerini görür (Reigns gibi).

Short 2019'da ilerlemeyi üç mekanizmaya ayırır: (a) stat aralığına göre sunulan, (b) önceki içerikten sıralanan (zincir), (c) tüm havuzdan rastgele çekilen. Üçü de bizde var: (a) preconditions, (b) followUp/chain, (c) weighted random.

### 2.2 Salience: "en spesifik kural kazanır"

Elan Ruskin'in GDC 2012 (Valve) sistemi: dünya hali yüzlerce "fact"; binlerce dialog satırı her biri "criteria" listesiyle; sorgu geldiğinde **en çok kriteri eşleşen (en spesifik) kural seçilir**, eşitlikte rastgele; seçilen kural "apply" ile hafızaya fact yazabilir (NPC "hatırlar"); yazarlara programcı gerekmeden yeni durum ekleme özgürlüğü. Yarn Spinner 3 aynı fikri "saliency strategy" olarak paketler: Best, Best Least Recently Viewed, **Random Best Least Recently Viewed (varsayılan)**, Random — hepsi önce koşulu sağlamayanları eler, sonra "karmaşıklık" (koşul sayısı) ile sıralar, en az gösterilmişi tercih eder.

**Bizim için anlamı:** Jenerik "kira zammı" olayı 1 kriterli, "kira zammı + kriptoda battın + annen seni evine çağırıyor" olayı 3 kriterli; ikincisi uygunsa önce o gelir. Bu, "oyun beni tanıyor" hissinin matematiksel karşılığıdır ve içerik yazarına "spesifik yaz, kazanırsın" teşviki verir.

### 2.3 Pacing: director, intensity ve drama manager

- **Left 4 Dead AI Director:** oyuncu "stres"ini ölçer; Build Up → Peak → Relax döngüsü; zayıf oyuncuya daha az düşman/daha çok ilk yardım. Kritik ders: scripted olaylar pacing'e bağlanınca oyuncu çoğu zaman "zaten çok gergin" olduğu için hiç tetiklenmiyordu → Valve scripted olayları ayrı track'e aldı.
- **Façade drama manager:** 27 beat; her beat'in önkoşul+etkisi; manager "istenen gerilim eğrisi"ne (Aristoteles yayı) en yakın beat'i seçer.
- **RimWorld Cassandra:** sabit "4,6 gün açık / 6 gün kapalı" tehdit döngüsü; açık fazda 1–2 büyük tehdit; tehdit tipi ağırlıklı (Raid 7,4, Infestation 2,7 ...); ağırlıklar "yakın zamanda oldu mu" ile dinamik düşer.

**Sentez:** Yıl başına beat bütçesi (2–5) + intensity metresi + "üst üste 3 negatif yasak" + yakın zamanda kullanılan tag'e ağırlık cezası. Hepsi 5. bölümde pseudocode olarak.

### 2.4 Cooldown, ağırlık, zincir

- **Cooldown:** olay başına (yıl) ve tag başına (yıl). CK3'teki gibi olay kendi tetiklenmez; "on_action" (yıl başı, yaş geçişi, terfi, evlilik) havuzları olayları ağırlıkla çeker; olayın "trigger"ı yalnızca filtredir.
- **Ağırlık = base × rarity × salience × novelty × pacing × director tercihi.**
- **Zincir:** followUp {eventId, delayYears (min/max), condition}; zincirler "arc" nesnesi olarak gruplanır, arc'ın kendi durumu vardır (started/stage/abandoned). KoDP'de 614 sahnenin 70'i "followup" — %10–15 zincir düğümü oranı makul taban.

### 2.5 İçerik hacmi matematiği

Varsayım: hayat başına D ≈ 225 beat; havuz N; seçim düzgün rastgele olsa görülen farklı olay sayısı ≈ N·(1 − e^(−D/N)).

| Havuz N | Tek hayatta görülen farklı | Tekrar oranı (tek hayat) | 10 hayat sonra görülen | 10 hayatta tekrar |
|---|---|---|---|---|
| 400 | 172 | %24 | 396 | %82 |
| 700 | 192 | %15 | 672 | %70 |
| 1.000 | 201 | %11 | 895 | %60 |
| 1.500 | 209 | %7 | 1.167 | %48 |
| 3.000 | 217 | %4 | 1.584 | %30 |

Üç gerçek düzeltme: (1) yaş/flag filtreleri havuzu evrelere böler, her evrede efektif N küçülür → gerçek tekrar yukarıdakinden kötüdür; (2) novelty bonusu (görülmemişe 3× ağırlık) ve cooldown tek-hayat tekrarını neredeyse sıfıra indirir; (3) metin varyantları (3/olay) ve "callback" dolgusu tekrarı "farklı" hissettirir. Benchmark: Reigns'in ilk oyunu ~900 kartla "tam oyun" sayıldı; Nerial "ilk 50 kartta bir şey görmeye başladık" diyor → **50 olaylık vertical slice**, 700'lük lansman, 1.500 içeriğe 6 ayda.

### 2.6 Yazarlık araçları ve formatlar

| Araç | Format | RN/Expo'da | Flutter'da | Lokalizasyon | Bizim için karar |
|---|---|---|---|---|---|
| Ink (inkle) | .ink → JSON; inkjs sıfır bağımlılık, tarayıcı+node | Evet (saf JS, Hermes'te sorun bildirilmemiş; derleme build-time) | ink_dart / flutter_ink (saf Dart port) | Ink-Localiser (satır ID'si tag olarak), ink-translate (XLIFF/TSV); seçeneklere tag konamıyor | Opsiyonel: uzun dallanan "özel bölümler" (askerlik, düğün günü) için |
| Yarn Spinner | .yarn; Unity-odaklı | yarn-spinner-runner-ts (3.x, React hook), yarn-bound (2.x, az bakımlı) | Resmi yok | Satır ID'leri yerleşik | Hayır (ekosistem Unity) |
| Twine | HTML; Twison ile JSON | JSON ile evet | Evet | Yok, elle | Hayır (prototip görselleştirme için belki) |
| **Kendi şemamız (YAML→JSON)** | Bölüm 4 | Evet | Evet | Build'de anahtar çıkarımı | **Ana format.** Storylet + salience + pacing mantığı zaten bizim motorda; metin motoru değil olay motoru gerekiyor |

### 2.7 Lokalizasyon-bilinçli içerik tasarımı

- Her metin bir anahtar; anahtar = `evt.<id>.<yol>` otomatik üretilir (Ink-Localiser deseni), yazar inline Türkçe yazar.
- Değişken ekleme ICU MessageFormat ile (`{name}`, çoğul, cinsiyet); Türkçe ek uyumu için `{name:dative}` gibi özel biçimlendirici (Ali'ye / Ayşe'ye) — motorda "ünlü uyumu" yardımcı fonksiyonu.
- Kültürel referanslar `cultureNote` alanı ile işaretlenir; İngilizce çeviride "askerlik" → "mandatory service" ya da sahne değişimi.
- Birleştirme (concatenation) yasak: cümleler bütün yazılır; Ink'in bilinen sorunu (parça birleştirme) başımıza gelmesin.

### Bu oyuna nasıl uygularız (Bölüm 2)
- Motor: storylet havuzu + salience + director. Ink/Yarn runtime'ı zorunlu değil.
- Yazarlar (ve AI) "spesifik yaz" teşvikiyle çalışır; salience koşul sayısından otomatik hesaplanır.
- Cooldown + tag-cooldown + novelty + "3 negatif üst üste yasak" → 5. bölüm.
- 50 → 700 → 1.500 olay planı; her olay ≥2 metin varyantı.
