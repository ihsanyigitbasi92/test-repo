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
| Reigns | 1 kart (yıl sayacı hızlı akar) | ~50–200 kart/saltanat | 1 (sola/sağa) | 4 kaynak; Her Majesty 1.200 kart ("Reigns'ten %30 fazla" → ilk oyun ~900, çıkarım) |
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
| Long Live the Queen | 40'a yakın beceri, 4 mood çifti | Mood öğrenme çarpanı | "Kategori cap'i: diğer iki beceri 25'i geçmeden 50'yi aşamazsın" — uzmanlaşmayı sınırlayan akıllı kural |
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
| Ink (inkle) | .ink → JSON; inkjs sıfır bağımlılık, tarayıcı+node | Evet (saf JS; Hermes ile bilinen bir uyumsuzluk kaydı bulunamadı, Sprint 0'da doğrulanacak; derleme build-time) | ink_dart / flutter_ink (saf Dart port) | Ink-Localiser (satır ID'si tag olarak), ink-translate (XLIFF/TSV); seçeneklere tag konamıyor | Opsiyonel: uzun dallanan "özel bölümler" (askerlik, düğün günü) için |
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

---

## 3. Bizim oyunun sistem önerisi

### 3.1 Tur yapısı: "Yıl + beat" modeli

```
YIL TURU (oyuncu "Yaşlan" basar)
 ├─ 1. Yıl başı pulse: pasif güncellemeler (yaş+1, stat decay, maaş, kira, enflasyon, ilişki decay, hazard zarı)
 ├─ 2. Director: bu yıl için beat bütçesi (2–5) hesaplar, zorunlu followUp'ları yerleştirir
 ├─ 3. Beat'ler sırayla oynanır (her beat = 1 olay kartı + 2–4 seçenek + anlatıcı yorumu)
 ├─ 4. Yıl özeti kartı: "Bu yıl: +3 Kafa, −8 Keyif, annen 2 kez aradı, 1 kez utandın"
 └─ 5. Serbest aksiyon menüsü (yıl içinde istediğin zaman): İş / İlişkiler / Sağlık / Para / Saçmalık (enerji: 4/yıl)
```

- **Alt-tur (aylık) yalnızca arklarda:** askerlik (6–12 ay), hamilelik (9 ay), sınav dönemi (3 ay). Bu arklar "hızlandırılmış" ay kartlarıyla oynanır; oyuncuya "zaman yavaşladı" hissi verir, dramatik yoğunluk artar.
- **Süre hedefi:** 70 yıl × 3,2 beat × ~15 sn + 70 × yıl özeti 5 sn + aksiyonlar ≈ 55–70 dk/hayat. 18–25 arası beat bütçesi 4–5 (yoğun), 60+ 2–3 (hızlanan yaşlılık hissi — "yıllar su gibi aktı" esprisi).

### 3.2 Stat seti ve komedi metreleri

| Stat | Tür | Aralık | Mekanik rol | Mizah rolü |
|---|---|---|---|---|
| Sağlık | Çekirdek, görünür | 0–100 | Hazard çarpanı; 0'da ölüm | "Sağlığın 23. Bir Nokia kadar dayanıklısın ama şarjın bitti." |
| Keyif | Çekirdek, görünür | 0–100 | Sims-tarzı türev + doğrudan deltalar; düşükse sosyal olaylar azalır, "depresif" olaylar açılır | Motivasyon beat'lerinin ana hedefi |
| Kafa | Çekirdek, görünür | 0–100 | Eğitim/kariyer kilitleri; LLTQ cap: Keyif<30 iken 70'i aşamaz | "Kafan 90 ama kiranı ödeyemiyorsun. Klasik." |
| Çekicilik | Çekirdek, görünür | 0–100 | İlişki başlatma şansı; yaşla doğal düşüş (40+ −1/yıl) | Ego ile çarpışınca roast |
| Para | Çekirdek, görünür | ∞ (reel birim) | Ekonomi (3.3) | Enflasyon şakaları |
| **Ego** | Komedi metresi, görünür | 0–100 | Reigns-tarzı iki uçta ceza: <15 "görünmez" (fırsat olayları kapanır), >85 "narsist" (ilişki decay 2×, kariyer "patronla kavga" olayları). Seçim başarı şansı: risk alan seçeneklerde +, işbirliği seçeneklerinde − | Anlatıcının ana roast ekseni. "Ego 92: LinkedIn'de kendine 'vizyoner' yazdın." |
| **Cringe** | Komedi metresi, görünür | 0–100, yılda −10 decay | Birikir; 60+ olunca "utanç callback" olayları açılır (eski olay anıya referans); 90+ "şehir değiştir" olayı | Oyuncunun en çok ekran görüntüsü alacağı metre |
| **Anne Baskısı** | Komedi metresi, görünür (anne hayattayken) | 0–100 | 24+ yaş, bekâr, işsiz, taşınmamış → yılda +5..+12; evlilik/çocuk/ev −30; 80+ "görücü usulü" zinciri zorunlu beat | Türkiye'ye özgü, yurt dışı lokalizasyonda "Family Pressure" |
| Karma | Gizli | −50..+50 | Şans zarlarına küçük çarpan (±%10); kötü seçimler düşürür | Anlatıcı nadiren ifşa eder: "Evrenin seninle bir hesabı var." |
| Stres | Gizli (ipuçlarıyla) | 0–100 | Sağlık erozyonu (stres>70 → −2 sağlık/yıl), Keyif baskısı; iş/para/ilişki olaylarıyla artar, tatil/spor/terapi ile düşer | "Uyuyamıyorsun ama neden bilmiyorsun" olayları |

**Değerlendirme — Ego/Cringe/Anne Baskısı ciddi midir?** Evet, üçü de "stat" olmanın üç şartını sağlıyor: (1) oyuncu kararlarıyla değişir, (2) olay seçimini kapılar (precondition olarak kullanılır), (3) uçlarda sonuç üretir. Risk: UI'da 8 görünür metre çok. Çözüm: çekirdek 4 + Para bar olarak; Ego/Cringe/Anne Baskısı "rozet-metre" olarak (ikon + küçük sayı), yalnızca eşik geçince animasyonla öne çıkar.

### 3.3 Para ve ekonomi: nominal yüzey, reel çekirdek

- Motor tüm değerleri **reel birim (RB)** tutar: 1 RB = başlangıç yılı 1 TL. Ekranda `nominal = RB × priceIndex(yıl)`.
- `priceIndex` yıllık enflasyonla büyür: baz %12, her yıl rastgele {%4, %8, %15, %30, %65} ağırlıklı (gerçek referans: 2025 sonu TÜFE %30,89; Ekim 2026 yıllık %29,77). Maaşlar enflasyona "gecikmeli ve eksik" endekslenir (%70–100) → "asgari ücret zammı" olayı her yıl beat adayı.
- Başlangıç maaş çapaları: asgari ücret 2026 net 28.075,50 TL → oyun içi "giriş seviyesi" = 1,0 AÜ; kariyer basamakları AÜ katı olarak tanımlanır (Kombi tamircisi 1,2 AÜ → Usta 2,5 AÜ; Yazılımcı 2 AÜ → Senior 6 AÜ → "Yurt dışına kaçtı" 15 AÜ).
- Giderler: kira (0,4–0,8 AÜ, yıllık zam olayı), fatura, "düğün takısı" (Türkiye vergisi), kefalet borcu.
- Komedi: enflasyon rakamı ekranda büyür, iç denge değişmez; anlatıcı "Maaşın 3 katına çıktı, alım gücün yarıya indi, tebrikler" der. Bu "inflation joke vs balancing" ikilemini çözer: espri yüzeyde, denge çekirdekte.

### 3.4 Kariyer merdiveni (24 kariyer)

Terfi kuralı: `yıllar ≥ minYıl AND statKoşulu AND (performans ≥ eşik OR "patron olayı" başarısı)`. Her kariyerin 8–15 özel olayı, 1 "zirve" olayı, 1 "düşüş" olayı var. Maaş AÜ katı.

| # | Kariyer | Giriş koşulu | Basamaklar (AÜ katı) | Özel olay teması | Tür |
|---|---|---|---|---|---|
| 1 | Garson → Şef | — | Garson 1,0 → Şef Yrd 1,6 → Şef 3 → Restoran Sahibi 6 | Bahşiş, müşteri roast, "menüye kendi adını yazdı" | Normal |
| 2 | Kurye | — | 1,1 → Filo Şefi 2 → Lojistik Girişimci 5 | Trafik, yağmur, "yanlış adres" zinciri | Normal |
| 3 | Kombi Tamircisi | — | Çırak 1,2 → Usta 2,5 → "Kış Kralı" 5 | Kış olayları, "Ocak ayında Tanrı" | Absürt-ton |
| 4 | Dolmuş Şoförü | Ehliyet | 1,3 → Hat Sahibi 4 → Kooperatif Başkanı 8 | Para üstü, "arkadan bir kişilik yer var" | Absürt-ton |
| 5 | Memur | Kafa ≥ 45, KPSS olayı | 1,4 → Şef 2 → Müdür 3,5 → Genel Müdür 7 | Tayin, "çay saati", torpil olayı | Normal |
| 6 | Hemşire | Sağlık meslek lisesi/üni | 1,5 → Sorumlu 2,5 → Başhemşire 4 | Nöbet, hasta yakını, "doktor sanıldın" | Normal |
| 7 | Doktor | Kafa ≥ 75, Tıp (6 yıl) | Asistan 2 → Uzman 5 → Prof 9 → Özel Hastane 15 | Nöbet, "bedava muayene isteyen akraba" zinciri | Normal |
| 8 | Avukat | Kafa ≥ 65, Hukuk | Stajyer 1,2 → Avukat 3 → Ortak 8 | "Komşu kavgasına çağrıldın" | Normal |
| 9 | Yazılımcı | Kafa ≥ 60 (bootcamp veya üni) | Junior 2 → Mid 4 → Senior 6 → "Yurt dışına kaçtı" 15 | Layoff, kripto, "yapay zekâ işimi aldı mı?" | Normal |
| 10 | Öğretmen | Üni | Ücretli 1,0 → Kadrolu 1,8 → Müdür 3 | Veli, atama bekleme (anne baskısı +) | Normal |
| 11 | Akademisyen | Kafa ≥ 80, lisansüstü | Arş. Gör 1,6 → Dr 2,5 → Doç 4 → Prof 6 | "Hakem 2 yorumu", 11 yıl süren tez | Kara mizah |
| 12 | Emlakçı | Çekicilik ≥ 40 | 1,0 (+komisyon) → Ofis Sahibi 5 → "Müteahhitle ortak" 12 | Kira zammı sen söylüyorsun, karma −, ego + | Absürt-ton |
| 13 | Müteahhit | Para ≥ 50 AÜ veya Emlakçı 3. basamak | 6 → 20 → "Kule dikti" 60 → İflas 0 | Deprem yönetmeliği olayı (kara mizah, Karma −30) | Kara mizah |
| 14 | Influencer | Çekicilik ≥ 55 veya Cringe ≥ 70 | Mikro 0,5 → Makro 3 → "Reklam anlaşması" 10 → "İptal edildi" 0,2 | Algoritma, "cringe ama para var" | Absürt |
| 15 | TikTok Dansçısı | Çekicilik ≥ 45, yaş ≤ 30 | 0,3 → 2 → 6 | Cringe +15/yıl, Ego +10 | Absürt |
| 16 | Kripto Gurusu | Para ≥ 5 AÜ, Ego ≥ 60 | 0 → ±50 (volatil) | Her yıl zar: −%80 / +%300; Ego ile korelasyon | Absürt |
| 17 | Kahve Falcısı | Keyif ≥ 50 | 0,8 → "Ünlü Falcı" 4 → "TV Programı" 9 | "Yolculuk görünüyor" callback'leri; rastgele doğru tahmin | Absürt |
| 18 | Düğün DJ'i / Fotoğrafçısı | — | 0,9 → 2,5 → 5 | Sezonluk; "halay başı"; eski sevgili düğünü callback | Absürt-ton |
| 19 | Dizi Oyuncusu | Çekicilik ≥ 70 | Figüran 0,4 → Yan rol 3 → Başrol 15 → "Dizi iptal" | Çekicilik yaşla düşünce rol kesilir (gerçekçi kara mizah) | Normal |
| 20 | Esnaf (Çiğköfteci) | Para ≥ 8 AÜ | 1,5 → Şube 4 → Franchise 10 | Belediye zabıtası, "acı mı olsun" | Normal |
| 21 | Pilot | Kafa ≥ 70, Sağlık ≥ 80, pahalı eğitim | 4 → Kaptan 12 | Sağlık kontrolü, jet lag | Normal |
| 22 | Milletvekili | Ego ≥ 70, Para ≥ 30 AÜ veya Karma ≥ 20 | 8 → "Bakan" 15 → "Listeye giremedi" 0 | Siyasi parti ismi yok; genel "sistem" roast | Kara mizah |
| 23 | Profesyonel Dolandırıcı (suç yolu) | Karma ≤ −10 | 2 → 8 → Hapis | "Kapıdan satış", hapis arkı (3–7 yıl alt-tur) | Kara mizah |
| 24 | Emekli (otomatik, 60+) | — | Emekli maaşı 0,9 AÜ | Park, kahvehane, "torun bakıcılığı", bayram harçlığı | Normal |

### 3.5 Hafızalı ilişkiler

```ts
type Npc = {
  id: string; role: 'anne'|'baba'|'kardes'|'arkadas'|'sevgili'|'es'|'eski'|'cocuk'|'patron'|'komsu'|'evcil';
  name: string; gender; age; alive: boolean;
  affinity: number;          // -100..100, yıllık decay rolüne göre (eş −3, arkadaş −5, anne 0)
  traits: string[];          // 'kıskanç','cömert','dedikoducu','vegan','kripto_seven'
  memories: Memory[];        // { tag, year, eventId, sentiment, line? }
  flags: Set<string>;        // 'evlilik_teklif_reddetti','borc_verdi'
};
```

- **Anı (memory) yazımı:** olay sonucu `memory.add` ile tag yazar (`'sen_beni_unuttun'`, `'borc_aldi'`). Callback olayları precondition'da `relationships[].memoryHas` kullanır.
- **Callback şablonu:** metinde `{mem:anne:borc_aldi:year}` gibi referans → "2031'de annenden aldığın 5.000 lira hâlâ konuşuluyor."
- **Eski sevgili sistemi:** ayrılık → NPC 'eski' rolüne geçer, 3–15 yıl sonra "düğünde karşılaştın / LinkedIn'de gördün / annesi seni sordu" olay ailesi; Cringe anıları varsa roast katmanı.
- **Evcil hayvan:** affinity yerine "sadakat"; kedi senaryosu 'sana tahammül ediyor' sabit; ölümü motivasyon beat'i tetikler ("Kedini gömdün. Hâlâ ayaktasın. Bu bir şey.").

### 3.6 Sağlık ve ölüm modeli (kalibre edilmiş)

```
hazard(age, s) = a · exp(b · (age − 18)) · M_health(s) · M_lifestyle · M_karma
  b = ln2 / 8 ≈ 0,0866   (Gompertz: 8 yılda ikiye katlanma)
  a = 0,00043            (sağlık=50 için medyan ölüm ≈ 75; 18 yaş gerçek ölüm olasılığına yakın)
  M_health = exp(1,2 · (50 − health) / 50)   → health 100: 0,30× ; health 0: 3,3×
  M_lifestyle = Π (sigara 1,6, obez 1,4, spor 0,8, alkol 1,3, stres>70 1,25)
  M_karma = 1 − karma/500   (±%10)
```
Medyan ölüm yaşı: sağlık 100 → ~89, sağlık 50 → ~75, sağlık 0 → ~61 (kapalı form: H(T)=a/b·(e^{bT}−1)=ln2). Bu aralık brief'teki 65–90 hedefiyle örtüşür; "kötü yaşarsan 40'larında da gidersin" kuyruğu sigara+obez+stres çarpanlarıyla (≈3×) gelir.

**Ölüm nedeni tablosu (yaş grubu × ağırlık, TÜİK 2024 tabanlı, oyun için bükülmüş):**

| Yaş | Dolaşım | Tümör | Solunum | Kaza/trafik | Dışsal (iş kazası, düşme) | Absürt kuyruk | Senaryo (zincir) |
|---|---|---|---|---|---|---|---|
| 18–29 | 5 | 8 | 3 | **40** | 20 | 9 | 15 |
| 30–44 | 20 | 20 | 5 | 20 | 15 | 8 | 12 |
| 45–64 | 38 | 25 | 10 | 8 | 6 | 5 | 8 |
| 65+ | 45 | 18 | 18 | 4 | 7 | 4 | 4 |

Absürt kuyruk örnekleri: "düğünde havaya atılan kurşun", "balkondan saksı", "çok gülmekten", "kombi patladı (kombi tamircisiysen ironi ×2)". Sağlık olayları: yıllık "doktor zarı" (sağlık<40 ise hastalık olayı %35), tedavi seçimi = para vs sağlık; "check-up yaptırmadın" motivasyon-roast'ı.

### 3.7 Legacy meta-progression

- **Ölünce:** "Hayat Özeti" kartı (mezar taşı yazısı anlatıcıdan, paylaşılabilir görsel) + **Tecrübe Puanı (TP)** = f(yaş, kurdele, zirve basamağı, Cringe toplamı (evet, cringe de puan)).
- **Reenkarnasyon perk'leri (TP ile kalıcı):** "Annen seni 2 yıl geç aramaya başlar", "Başlangıç Kafa +10", "Bir kez ölümden dönme (defibrilatör)", "Kripto zarı bir kez tekrar at", "Anlatıcı seni 1 yıl roast'lamaz" (ironik perk).
- **Anlatıcı hafızası:** `metaLog` önceki hayatların özetini (ölüm nedeni, en yüksek kariyer, en büyük cringe) tutar; `preconditions.meta` ile "geçen hayatında da..." olayları açılır. Hades'in "ölüm döngüsünü anlatıya dönüştürme" dersi: her tekrar yeni bir yorum getirir, aynı laf tekrar etmez (bildirilen 300k+ kelimelik script bunun için var; bizde 150 meta-callback satırıyla başlanır).
- **"Çocuğun olarak devam":** BitLife'tan farklı olarak miras kuralı tek ve net: tüm varlık −%30 (veraset vergisi esprisi) çocuğa; çocuk 18'inde başlar, anne/baba rolünde "sen" (eski karakter) hayalet-NPC olarak anılarda yaşar ("Baban 2041'de kripto yüzünden batmıştı, sen almazsın değil mi?").

### 3.8 Başarımlar, challenge modları, haftalık seed

- **Kurdeleler (30 lansman):** yaşam tarzı özeti: "Ev Kuşu", "Kronik Bekâr", "Kombi Kralı", "Cringe Efsanesi", "Annesinin Gururu", "Sistemi Yendi" (milletvekili + karma>0 — çok nadir).
- **Challenge modları (haftalık, deterministik):** 4 koşullu görev ("Influencer ol, 50 yaşından önce iptal edil, kediyle öl"), seed = `hash('week', ISOyearWeek)`; herkes aynı olay zarını alır; sonuç ekranı "Bu hafta oyuncuların %X'i..." yerine (backend yok) "Paylaş" kodu: skor + seed + doğrulama hash'i (ekran görüntüsü için).
- **"Herkes Aynı Hayat" modu:** haftalık seed ile aynı başlangıç + aynı zar; farklılık yalnızca seçimlerden → sosyal medyada "ben 43'te öldüm sen?" paylaşımı. Spelunky daily ve Slay the Spire Daily Climb'ın offline uyarlaması.

### Bu oyuna nasıl uygularız (Bölüm 3)
- Yıl+beat turu, 8 görünür/2 gizli stat, reel-çekirdekli ekonomi, 24 kariyer, hafızalı NPC, Gompertz hazard, legacy TP, haftalık seed. Hepsi tek TS motorunda, UI'dan bağımsız.

---

## 4. Olay şeması (JSON)

Yazarlık formatı: YAML (inline Türkçe), build'de JSON'a derlenir; tüm `text`/`label` alanları `loc` anahtarına çevrilip `locales/tr/events.json`'a çıkarılır (anahtar = `evt.<id>.<yol>`). Aşağıda derlenmiş JSON gösteriliyor; `tr` alanları okunabilirlik için inline bırakıldı.

```ts
// TypeScript sözleşmesi (motor bunu zod ile doğrular)
type Event = {
  id: string;                       // 'evt_kira_zammi_01'
  v: number;                        // şema/içerik versiyonu
  tags: string[];                   // 'para','ev','komedi','roast','motivasyon','kariyer:yazilimci'
  rarity: 'common'|'uncommon'|'rare'|'legendary';   // base weight 1 / 0.5 / 0.2 / 0.05
  weight?: number;                  // ek çarpan (varsayılan 1)
  valence: -2|-1|0|1|2;             // director pacing için duygusal yön
  tension: 0|1|2|3;                 // intensity katkısı
  cooldown?: { self?: number; tags?: Record<string, number> };   // yıl
  maxPerLife?: number;
  pre: {                            // preconditions — hepsi AND; 'anyOf' ile OR
    age?: { min?: number; max?: number };
    stats?: Record<StatName, { min?: number; max?: number }>;
    flags?: { all?: string[]; none?: string[]; any?: string[] };
    career?: { anyOf?: string[]; minRank?: number };
    rel?: Array<{ role: NpcRole; alive?: boolean; minAffinity?: number; maxAffinity?: number; memoryHas?: string[]; memoryNone?: string[] }>;
    meta?: { pastLivesMin?: number; pastDeathCause?: string[]; perks?: string[] };   // legacy
    expr?: string;                  // küçük güvenli ifade dili (jsep tabanlı), nadir kullanım
    season?: 'kis'|'yaz';           // alt-tur arkları için
  };
  salienceBonus?: number;           // elle ince ayar (varsayılan 0; koşul sayısı otomatik)
  humor: {
    jokeType: 'roast'|'absurd'|'dark'|'deadpan'|'callback'|'wholesome'|'motivational';
    target: 'player'|'society'|'narrator'|'npc';      // lint: 'npc' hedefi korumalı grup olamaz
    callbackHooks?: string[];       // bu olay ileride referans verilebilecek 'anı' etiketleri yazar
    motivationBeat?: boolean;       // director 'motivasyon kotası' için sayar
  };
  text: Array<{ tr: string; en?: string; when?: Pre }>;   // varyantlar; 'when' ile koşullu varyant
  narrator?: Array<{ tr: string; when?: Pre }>;           // olay sonrası anlatıcı yorumu
  choices: Array<{
    id: string;
    label: { tr: string; en?: string };
    requires?: Pre;                 // kilitli seçenek görünür ama gri (bilgi + motivasyon)
    hint?: { tr: string };          // "Kafa ≥ 60 gerekir" gibi UI ipucu
    outcomes: Array<{
      p: number;                    // olasılık; toplam 1 (0 ise 'luck' ile ölçeklenir)
      luckScaled?: boolean;         // Karma çarpanı uygulanır
      effects: {
        stats?: Partial<Record<StatName, number>>;
        money?: number;             // reel birim (AÜ katı yazılabilir: "0.5AU")
        flags?: { add?: string[]; remove?: string[] };
        rel?: Array<{ role: NpcRole; affinity?: number; memory?: string; create?: NpcSeed; kill?: boolean }>;
        career?: { set?: string; rankDelta?: number; fire?: boolean };
        followUp?: Array<{ eventId: string; delay: [number, number]; chance?: number }>;   // yıl aralığı
        death?: { cause: string };
        meta?: { tp?: number; unlock?: string };
      };
      text: { tr: string; en?: string };
      narrator?: { tr: string };
    }>;
  }>;
  loc: { ns: string; cultureNote?: string };   // çevirmen notu
};
```

### 4.1 On örnek olay (Türkçe)

```json
[
{
  "id": "evt_kira_zammi_01", "v": 1,
  "tags": ["para","ev","gundelik","roast"], "rarity": "common", "valence": -1, "tension": 1,
  "cooldown": { "self": 2, "tags": { "ev": 1 } },
  "pre": { "age": { "min": 19 }, "flags": { "all": ["kiraci"] } },
  "humor": { "jokeType": "roast", "target": "society", "callbackHooks": ["kira_zammi"] },
  "text": [
    { "tr": "Ev sahibin aradı. 'Enflasyon var, biliyorsun.' Kirana %{zam} zam geldi. Senin maaşına gelmedi." },
    { "tr": "Ev sahibin 'evladım gibisin' diyerek kiraya %{zam} zam yaptı. Demek ki evlatlarına da böyle yapıyor.", "when": { "stats": { "anneBaskisi": { "min": 40 } } } }
  ],
  "choices": [
    { "id": "kabul", "label": { "tr": "Kabul et, iç çek" },
      "outcomes": [ { "p": 1, "effects": { "money": "-0.3AU", "stats": { "keyif": -4, "stres": 6 } }, "text": { "tr": "Ödedin. İç çekişin komşuya kadar gitti." }, "narrator": { "tr": "Bir yıl daha hayatta kalmanın bedeli: gururun ve bir maaş." } } ] },
    { "id": "pazarlik", "label": { "tr": "Pazarlık et" }, "requires": { "stats": { "ego": { "min": 30 } } }, "hint": { "tr": "Ego ≥ 30" },
      "outcomes": [
        { "p": 0.45, "luckScaled": true, "effects": { "money": "-0.15AU", "stats": { "ego": 5, "keyif": 3 } }, "text": { "tr": "Zammı yarıya indirdin. Ev sahibi sana 'kurnaz' dedi, iltifat sayıyoruz." } },
        { "p": 0.55, "effects": { "money": "-0.3AU", "stats": { "ego": -6, "cringe": 8 }, "rel": [ { "role": "komsu", "memory": "pazarlik_rezaleti" } ] }, "text": { "tr": "'O zaman çık' dedi. Çıkmadın. Konuşma apartman grubuna düştü." } }
      ] },
    { "id": "tasin", "label": { "tr": "Annenin yanına taşın" }, "requires": { "rel": [ { "role": "anne", "alive": true } ] },
      "outcomes": [ { "p": 1, "effects": { "money": "+0.4AU", "stats": { "anneBaskisi": 25, "ego": -10, "keyif": -2 }, "flags": { "remove": ["kiraci"], "add": ["anne_evinde"] }, "followUp": [ { "eventId": "evt_anne_evi_sabah_01", "delay": [1, 1] } ] }, "text": { "tr": "Odan aynen duruyor. Posterler dahil. 2009'dan kalma posterler." }, "narrator": { "tr": "Geri adım değil bu, stratejik geri çekilme. Napolyon da yapmıştı. Sonra ne oldu, bakma." } } ] }
  ],
  "loc": { "ns": "evt.kira_zammi_01", "cultureNote": "Türkiye'de yıllık kira zammı toplumsal gerilim konusu; EN için 'rent hike' doğrudan çalışır." }
},
{
  "id": "evt_kedi_evlat_edindi_01", "v": 1,
  "tags": ["absurt","evcil","gundelik","wholesome"], "rarity": "uncommon", "valence": 1, "tension": 0,
  "maxPerLife": 1,
  "pre": { "age": { "min": 18, "max": 70 }, "flags": { "none": ["evcil_kedi"] }, "stats": { "keyif": { "max": 60 } } },
  "humor": { "jokeType": "absurd", "target": "player", "callbackHooks": ["kedi_geldi"], "motivationBeat": true },
  "text": [ { "tr": "Kapının önünde bir kedi oturuyor. Seni süzüyor. Karar verdi: artık onun insanısın. Sana soran olmadı." } ],
  "choices": [
    { "id": "kabul", "label": { "tr": "Tamam, patron sensin" },
      "outcomes": [ { "p": 1, "effects": { "stats": { "keyif": 8, "stres": -5 }, "flags": { "add": ["evcil_kedi"] }, "rel": [ { "role": "evcil", "create": { "species": "kedi", "name": "random:kedi" }, "memory": "kapida_bulundu" } ] }, "text": { "tr": "Adını {npc.evcil.name} koydun. O da sana bir ad koydu muhtemelen, öğrenemeyeceksin." }, "narrator": { "tr": "Hayatında ilk kez sana ihtiyacı olmayan bir canlı seni seçti. Not al." } } ] },
    { "id": "red", "label": { "tr": "Kapıyı kapat" },
      "outcomes": [ { "p": 1, "effects": { "stats": { "karma": -5, "cringe": 3 }, "followUp": [ { "eventId": "evt_kedi_geri_geldi_01", "delay": [1, 2], "chance": 0.7 } ] }, "text": { "tr": "Kapattın. Cam kenarından bakıyor. Hâlâ bakıyor." } } ] }
  ],
  "loc": { "ns": "evt.kedi_evlat_edindi_01" }
},
{
  "id": "evt_trafik_kazasi_01", "v": 1,
  "tags": ["saglik","kaza","dark","trafik"], "rarity": "rare", "valence": -2, "tension": 3,
  "cooldown": { "self": 8, "tags": { "kaza": 4 } },
  "pre": { "age": { "min": 18, "max": 75 }, "flags": { "any": ["ehliyet","dolmus_soforu","kurye"] } },
  "humor": { "jokeType": "dark", "target": "society", "callbackHooks": ["kaza_gecirdi"] },
  "text": [
    { "tr": "Yeşil yandı, sen geçtin, karşıdan gelen geçmedi diye düşündün. O da senin geçmeyeceğini düşünmüş. Türkiye'de yılda 6.000+ kişi bu cümleyi kuramıyor." },
    { "tr": "Kurye olarak 11. paketi yetiştirmeye çalışırken bir minibüsle 'tanıştın'.", "when": { "career": { "anyOf": ["kurye"] } } }
  ],
  "choices": [
    { "id": "hastane", "label": { "tr": "Hastaneye git" },
      "outcomes": [
        { "p": 0.70, "luckScaled": true, "effects": { "stats": { "saglik": -15, "stres": 10 }, "money": "-0.2AU", "flags": { "add": ["kaza_izi"] } }, "text": { "tr": "Kırık, dikiş, 3 hafta rapor. Yaşıyorsun." }, "narrator": { "tr": "İstatistiklerin doğru tarafında kaldın. Şimdilik." } },
        { "p": 0.25, "effects": { "stats": { "saglik": -35, "cekicilik": -5, "stres": 20 }, "money": "-0.8AU", "flags": { "add": ["kaza_izi","kronik_agri"] }, "followUp": [ { "eventId": "evt_fizik_tedavi_01", "delay": [0, 1] } ] }, "text": { "tr": "Ameliyat. Platin. Havaalanı dedektörleri artık seni seviyor." } },
        { "p": 0.05, "effects": { "death": { "cause": "trafik_kazasi" } }, "text": { "tr": "Son gördüğün şey bir minibüsün 'Allah korusun' yazısıydı. Korumadı." } }
      ] },
    { "id": "gecistir", "label": { "tr": "'Bir şeyim yok' de, eve git" },
      "outcomes": [ { "p": 1, "effects": { "stats": { "saglik": -22, "ego": 4 }, "flags": { "add": ["kaza_izi","tedavisiz_kaza"] }, "followUp": [ { "eventId": "evt_gecikmis_agri_01", "delay": [2, 6], "chance": 0.5 } ] }, "text": { "tr": "Eve gittin. Boynun bir hafta dönmedi. Sol tarafa bakarken vücudunla döndün." }, "narrator": { "tr": "Doktora gitmemek bir hobi değil. Ama sen hobi yaptın." } } ] }
  ],
  "loc": { "ns": "evt.trafik_kazasi_01", "cultureNote": "'Allah korusun' minibüs yazısı; EN'de 'Jesus is my co-pilot' sticker karşılığı." }
},
{
  "id": "evt_ilk_bitirdin_01", "v": 1,
  "tags": ["motivasyon","wholesome","gundelik"], "rarity": "uncommon", "valence": 2, "tension": 0,
  "maxPerLife": 2, "cooldown": { "self": 10 },
  "pre": { "stats": { "keyif": { "max": 45 } }, "flags": { "none": ["son_yil_motivasyon"] } },
  "humor": { "jokeType": "motivational", "target": "player", "motivationBeat": true },
  "text": [ { "tr": "Bu yıl bir şeye başladın ve — dikkat — bitirdin. Ne olduğu önemli değil. Bir kitap, bir kurs, bir puzzle. Bitti." } ],
  "narrator": [ { "tr": "Seninle 3 yıldır dalga geçiyorum, biliyorum. Ama bunu gördüm. Devam et. Yarın yine dalga geçeceğim, bugün değil." } ],
  "choices": [
    { "id": "devam", "label": { "tr": "Bir tane daha başla" },
      "outcomes": [ { "p": 1, "effects": { "stats": { "keyif": 10, "kafa": 3, "stres": -8 }, "flags": { "add": ["son_yil_motivasyon","bitirici"] }, "meta": { "tp": 5 } }, "text": { "tr": "Başladın. Bitirip bitirmeyeceğin yeni bir hikâye." } } ] },
    { "id": "kutla", "label": { "tr": "Kutla, sonra yat" },
      "outcomes": [ { "p": 1, "effects": { "stats": { "keyif": 6 }, "flags": { "add": ["son_yil_motivasyon"] } }, "text": { "tr": "Kutladın. Yattın. İkisi de hak." } } ] }
  ],
  "loc": { "ns": "evt.ilk_bitirdin_01" }
},
{
  "id": "evt_askerlik_celp_01", "v": 1,
  "tags": ["askerlik","zincir","aile","kariyer"], "rarity": "common", "weight": 3, "valence": -1, "tension": 2,
  "maxPerLife": 1,
  "pre": { "age": { "min": 20, "max": 28 }, "flags": { "all": ["erkek"], "none": ["askerlik_yapti","askerlik_bedelli","askerlik_tecil_son"] } },
  "humor": { "jokeType": "deadpan", "target": "society", "callbackHooks": ["askerlik"] },
  "text": [ { "tr": "e-Devlet'ten bildirim: 'Askerlik durumunuz güncellendi.' Hiçbir bildirim bu kadar kısa olup bu kadar uzun bir yıl başlatmamıştır." } ],
  "choices": [
    { "id": "git", "label": { "tr": "Git, bitsin" },
      "outcomes": [ { "p": 1, "effects": { "flags": { "add": ["askerlik_yapti","arc:askerlik:basladi"] }, "career": { "fire": false }, "stats": { "saglik": 5, "kafa": -2, "stres": 12, "anneBaskisi": -10 }, "followUp": [ { "eventId": "evt_askerlik_ay3_01", "delay": [0, 0] }, { "eventId": "evt_askerlik_terhis_01", "delay": [1, 1] } ] }, "text": { "tr": "Saçlar gitti. Telefon gitti. 'Komutanım' kelimesini günde 40 kez söylemeyi öğrendin." }, "narrator": { "tr": "Annen ilk kez bir hafta seni aramadı. Arayamadı. Ama rekor rekordur." } } ] },
    { "id": "bedelli", "label": { "tr": "Bedelli öde" }, "requires": { "expr": "money >= 3.5*AU" }, "hint": { "tr": "~3,5 maaş gerekir" },
      "outcomes": [ { "p": 1, "effects": { "money": "-3.5AU", "flags": { "add": ["askerlik_bedelli"] }, "stats": { "ego": 3, "anneBaskisi": -10 } }, "text": { "tr": "Bir ay. Para gitti. Babanın 'biz 18 ay yaptık' bakışı ömür boyu." } } ] },
    { "id": "tecil", "label": { "tr": "Tecil ettir (yüksek lisans!)" }, "requires": { "flags": { "any": ["universite_mezunu","ogrenci"] } },
      "outcomes": [ { "p": 1, "effects": { "flags": { "add": ["askerlik_tecil"] }, "stats": { "kafa": 2, "stres": 4 }, "followUp": [ { "eventId": "evt_askerlik_celp_01", "delay": [2, 3] } ] }, "text": { "tr": "'Akademik kariyer düşünüyorum' dedin. Kimse inanmadı. Sistem inandı." }, "narrator": { "tr": "Bu olayı 2–3 yıl sonra tekrar göreceksin. Ben de buradayım." } } ] }
  ],
  "loc": { "ns": "evt.askerlik_celp_01", "cultureNote": "Zorunlu askerlik; EN lokalizasyonunda 'mandatory service' kurgusu veya ülke seçimine göre atlama." }
},
{
  "id": "evt_askerlik_terhis_01", "v": 1,
  "tags": ["askerlik","zincir","motivasyon"], "rarity": "common", "valence": 1, "tension": 1,
  "pre": { "flags": { "all": ["arc:askerlik:basladi"], "none": ["askerlik_terhis"] } },
  "humor": { "jokeType": "callback", "target": "player", "motivationBeat": true },
  "text": [ { "tr": "Terhis. Sivil kıyafet garip duruyor. Annen 3 kilo almış gibi görünmeni istiyor, sen 3 kilo vermişsin." } ],
  "choices": [
    { "id": "eve", "label": { "tr": "Eve dön, bir hafta uyu" },
      "outcomes": [ { "p": 1, "effects": { "flags": { "add": ["askerlik_terhis"], "remove": ["arc:askerlik:basladi"] }, "stats": { "keyif": 12, "stres": -15, "ego": 4 }, "rel": [ { "role": "anne", "affinity": 10, "memory": "askerden_dondu" } ], "meta": { "tp": 3 } }, "text": { "tr": "Uyudun. Uyandın. Hayat aynı yerde bekliyordu, sadece sen biraz değişmiştin." }, "narrator": { "tr": "Bir yıl kaybettin diyorlar. Ben derim ki: bir yıl boyunca bir şeyi bırakmadın. Bu da sayılır." } } ] }
  ],
  "loc": { "ns": "evt.askerlik_terhis_01" }
},
{
  "id": "evt_patron_zam_bekliyor_01", "v": 1,
  "tags": ["kariyer","para","roast"], "rarity": "common", "valence": 0, "tension": 1,
  "cooldown": { "self": 3, "tags": { "kariyer": 1 } },
  "pre": { "career": { "anyOf": ["yazilimci","memur","garson","emlakci","hemsire","ogretmen","avukat"], "minRank": 1 }, "flags": { "all": ["calisiyor"] }, "age": { "min": 22 } },
  "humor": { "jokeType": "roast", "target": "player", "callbackHooks": ["zam_istedi"] },
  "text": [
    { "tr": "Patronun 'kapım her zaman açık' dedi. Kapı açık. İçeride kimse yok. Zam istemek sana kaldı." },
    { "tr": "Yıllık değerlendirme: 'Beklentileri karşılıyor.' Beklentiler düşüktü. Sen de düşüktün. Denklik.", "when": { "stats": { "ego": { "max": 30 } } } }
  ],
  "choices": [
    { "id": "iste", "label": { "tr": "Zam iste" },
      "outcomes": [
        { "p": 0.4, "luckScaled": true, "effects": { "money": "+0.5AU", "stats": { "ego": 6, "keyif": 5 }, "rel": [ { "role": "patron", "memory": "zam_aldi" } ] }, "text": { "tr": "%15 aldın. Enflasyon %30. Teknik olarak yine fakirleştin ama daha az." } },
        { "p": 0.45, "effects": { "stats": { "ego": -3, "stres": 5 }, "rel": [ { "role": "patron", "memory": "zam_reddedildi" } ], "followUp": [ { "eventId": "evt_is_teklifi_rakip_01", "delay": [1, 2], "chance": 0.4 } ] }, "text": { "tr": "'Bu dönem zor' dedi. Yeni araba aldığı dönem." } },
        { "p": 0.15, "effects": { "career": { "rankDelta": 1 }, "money": "+0.8AU", "stats": { "ego": 10 } }, "text": { "tr": "Terfi aldın. Unvanın değişti. İş aynı. Ama unvan!" }, "narrator": { "tr": "LinkedIn'e yazarken 'heyecanlıyım' demeyi unutma." } }
      ] },
    { "id": "sus", "label": { "tr": "Sus, beklemeye devam et" },
      "outcomes": [ { "p": 1, "effects": { "stats": { "ego": -4, "stres": 3 }, "flags": { "add": ["zam_istemedi"] } }, "text": { "tr": "Sustun. Patron da sustu. Çok huzurlu bir sessizlik, bankadaki bakiyen hariç." }, "narrator": { "tr": "Seneye aynı olayı görürsen şaşırma. Ben de aynı lafı söyleyeceğim." } } ] }
  ],
  "loc": { "ns": "evt.patron_zam_bekliyor_01" }
},
{
  "id": "evt_dugunde_eski_sevgili_01", "v": 1,
  "tags": ["iliski","eski","callback","cringe"], "rarity": "uncommon", "valence": -1, "tension": 2,
  "cooldown": { "self": 6 },
  "pre": { "age": { "min": 24 }, "rel": [ { "role": "eski", "alive": true } ] },
  "salienceBonus": 1,
  "humor": { "jokeType": "callback", "target": "player", "callbackHooks": ["dugun_karsilasma"] },
  "text": [
    { "tr": "Bir akraba düğününde masa 7'desin. Masa 8'de {npc.eski.name}. {mem:eski:ayrildi:year}'de 'bir daha asla' demiştin. Asla 7 yıl sürdü." },
    { "tr": "Düğün. Halay. Karşında {npc.eski.name}. Elinde mendil, gözünde o bakış. Cringe'in {stats.cringe}; bu gece artacak.", "when": { "stats": { "cringe": { "min": 50 } } } }
  ],
  "choices": [
    { "id": "selam", "label": { "tr": "Olgun davran, selam ver" },
      "outcomes": [ { "p": 0.7, "effects": { "stats": { "ego": 3, "keyif": 2 }, "rel": [ { "role": "eski", "affinity": 8, "memory": "dugunde_olgun" } ] }, "text": { "tr": "'Nasılsın?' 'İyiyim.' İkiniz de yalan söylediniz, ikiniz de biliyorsunuz. Medeniyet bu." } },
                    { "p": 0.3, "effects": { "stats": { "cringe": 12 }, "rel": [ { "role": "eski", "memory": "dugunde_rezil" } ] }, "text": { "tr": "'Nasılsın?' demek istedin, 'seni özledim' çıktı. Masa 8 duydu. Masa 9 da." } } ] },
    { "id": "halay", "label": { "tr": "Halaya gir, görmezden gel" },
      "outcomes": [ { "p": 1, "effects": { "stats": { "saglik": 1, "cringe": 5, "keyif": 4 } }, "text": { "tr": "Halayın başına geçtin. Mendil senin. Görmezden gelmenin en gürültülü hali." } } ] },
    { "id": "kac", "label": { "tr": "Tuvalete git, 40 dakika çıkma" },
      "outcomes": [ { "p": 1, "effects": { "stats": { "cringe": 8, "ego": -5 } }, "text": { "tr": "40 dakika. Telefonun %4'e indi. Düğün bitmedi." }, "narrator": { "tr": "Stratejik geri çekilme, bölüm 2. Napolyon bu kez tuvalette." } } ] }
  ],
  "loc": { "ns": "evt.dugunde_eski_sevgili_01", "cultureNote": "Halay/mendil; EN'de 'the dance floor' ile sadeleştir." }
},
{
  "id": "evt_doktor_spor_yap_01", "v": 1,
  "tags": ["saglik","doktor","roast","motivasyon"], "rarity": "common", "valence": 0, "tension": 1,
  "cooldown": { "self": 4 },
  "pre": { "age": { "min": 30 }, "stats": { "saglik": { "max": 55 } }, "flags": { "none": ["sporcu"] } },
  "humor": { "jokeType": "roast", "target": "player", "motivationBeat": true },
  "text": [ { "tr": "Doktor tahlillere baktı, sana baktı, tekrar tahlillere baktı. 'Spor yapıyor musunuz?' Soru değil bu, teşhis." } ],
  "choices": [
    { "id": "basla", "label": { "tr": "Gerçekten başla (bu sefer)" },
      "outcomes": [
        { "p": 0.5, "effects": { "stats": { "saglik": 10, "keyif": 5, "stres": -6 }, "flags": { "add": ["sporcu"] }, "meta": { "tp": 4 } }, "text": { "tr": "6 ay sonra hâlâ gidiyorsun. Kimse inanmıyor. Sen bile." }, "narrator": { "tr": "Sağlığın {stats.saglik}. Geçen yıl söylediklerimi geri alıyorum. Bir kısmını." } },
        { "p": 0.5, "effects": { "stats": { "saglik": 2, "cringe": 4 }, "money": "-0.1AU" }, "text": { "tr": "Yıllık üyelik aldın. 3 kez gittin. Üyelik başına 4 maaş." } }
      ] },
    { "id": "yuru", "label": { "tr": "'Yürüyorum zaten' de" },
      "outcomes": [ { "p": 1, "effects": { "stats": { "saglik": -3, "ego": 2 }, "followUp": [ { "eventId": "evt_doktor_spor_yap_01", "delay": [3, 5] } ] }, "text": { "tr": "Buzdolabına kadar yürüyorsun. Doktor not aldı: 'Hasta inkârda.'" } } ] }
  ],
  "loc": { "ns": "evt.doktor_spor_yap_01" }
},
{
  "id": "evt_gecen_hayat_kripto_01", "v": 1,
  "tags": ["meta","legacy","kripto","callback"], "rarity": "rare", "valence": 0, "tension": 1,
  "maxPerLife": 1,
  "pre": { "age": { "min": 21, "max": 30 }, "meta": { "pastLivesMin": 1 }, "flags": { "none": ["kripto_aldi"] }, "expr": "meta.pastLives.some(l => l.flags.includes('kripto_batti'))" },
  "salienceBonus": 2,
  "humor": { "jokeType": "callback", "target": "player", "motivationBeat": false },
  "text": [ { "tr": "Arkadaşın 'yeni coin var, kesin 10x' dedi. Bir dakika. Bu cümleyi daha önce duydun. {meta.lastLife.name} olarak, {meta.lastLife.kriptoYil}'de. Sonu güzel bitmemişti." } ],
  "narrator": [ { "tr": "Evet, önceki hayatlarını hatırlıyorum. İş tanımımda var. Sen hatırlıyor musun, asıl soru o." } ],
  "choices": [
    { "id": "al", "label": { "tr": "Bu sefer farklı (al)" },
      "outcomes": [
        { "p": 0.2, "effects": { "money": "+6AU", "stats": { "ego": 20 }, "flags": { "add": ["kripto_aldi","kripto_kazandi"] } }, "text": { "tr": "10x oldu. Evren bazen ironiyi sevmez. Nadir." } },
        { "p": 0.8, "effects": { "money": "-2AU", "stats": { "ego": -8, "cringe": 10 }, "flags": { "add": ["kripto_aldi","kripto_batti"] }, "meta": { "tp": 2 } }, "text": { "tr": "Battı. Tarih tekerrür etti. Sen tekerleksin." }, "narrator": { "tr": "Bir sonraki hayatta bu olayı üçüncü kez göreceksin. Bu konuda çok heyecanlıyım." } }
      ] },
    { "id": "alma", "label": { "tr": "Ders aldım, almıyorum" },
      "outcomes": [ { "p": 1, "effects": { "stats": { "kafa": 4, "keyif": 3 }, "flags": { "add": ["kripto_ders_aldi"] }, "meta": { "tp": 6, "unlock": "perk_tarih_bilinci" } }, "text": { "tr": "Almadın. Coin 3 ay sonra sıfırlandı. Arkadaşın hâlâ 'uzun vade' diyor." }, "narrator": { "tr": "İki hayat sürdü ama öğrendin. Bu oyunda da, dışarıda da işe yarar bir şey." } } ] }
  ],
  "loc": { "ns": "evt.gecen_hayat_kripto_01" }
}
]
```

Çeşitlilik kontrolü: gündelik (kira, zam), absürt (kedi), kara (trafik), motivasyon (bitirdin, spor), zincir (askerlik ×2), callback (düğün), legacy (kripto). Türkiye'ye özgü 5, evrensel 5; her olayda ≥1 Türkçe-kültürel not var.

---

## 5. Seçim algoritması (pseudocode)

### 5.1 Deterministik RNG ve save/load

```ts
// sfc32: 128-bit state, PractRand geçer, JS'de hızlı. Seed → 4×uint32 (cyrb128 hash ile).
type RngState = [number, number, number, number];
const rng = sfc32(...cyrb128(`${lifeSeed}:${year}:${channel}`));  // channel: 'beats' | 'outcome' | 'hazard' | 'names'
```
- **Kural 1:** Motor `Math.random` kullanmaz; her rastgelelik `ctx.rng(channel)` üzerinden. Kanallar ayrı akış → UI'da bir animasyon zarı atmak oyun sonuçlarını kaydırmaz.
- **Kural 2:** Save = `{ lifeSeed, year, rngStates{channel}, state }`. Yükleme sonrası aynı yıl aynı beat'leri üretir (replay/bug raporu için altın).
- **Kural 3:** Haftalık mod: `lifeSeed = cyrb128('week:' + isoYearWeek)`; Slay the Spire/Spelunky mantığı; seed herkese açık, adalet gizlilikten değil determinizmden gelir.
- **Kural 4:** İçerik versiyonu seed'e dahil (`contentHash`), böylece içerik güncellemesi eski haftalık skorları "geçersiz" olarak işaretler (UI'da "v3 içerik" rozeti).

### 5.2 Yıl director'ü

```
function runYear(state, content):
  rngB = rng('beats')
  budget = beatBudget(state)             // 18–25: 4–5, 26–59: 3–4, 60+: 2–3; stres>70 → +1 (hayat "yoğun")
  beats = []

  // 1) Zorunlu: vadesi gelen followUp'lar (chance zarı ile), arc düğümleri
  for f in state.scheduled where f.year <= state.year:
      if rngB() < (f.chance ?? 1): beats.push(f.eventId)
  budget -= beats.length

  // 2) Aday havuzu
  cands = content.events.filter(e => eligible(e, state))   // pre, cooldown, maxPerLife, kilit paketler
  // 3) Skor
  for e in cands:
      specificity = countConditions(e.pre) + (e.salienceBonus ?? 0)      // Ruskin: spesifik kazanır
      novelty     = state.seen[e.id] ? 1 : 3                             // görülmemiş 3×
      recencyTag  = Π_{t in e.tags} (yearsSince(t) < cooldown(t) ? 0 : min(1, yearsSince(t)/4))
      pacing      = pacingMultiplier(e, state.director)                  // 5.3
      motivQuota  = (e.humor.motivationBeat && state.director.motivDebt > 0) ? 2 : 1
      rarityW     = {common:1, uncommon:0.5, rare:0.2, legendary:0.05}[e.rarity] * (e.weight ?? 1)
      e.score = rarityW * (1 + 0.35*specificity) * novelty * recencyTag * pacing * motivQuota

  // 4) Çeşitlilik kısıtlı ağırlıklı örnekleme (yerine koymadan)
  while beats.length < budget and cands nonEmpty:
      e = weightedPick(cands, rngB)
      if violatesStreak(e, beats, state.director.lastValences): cands.remove(e); continue   // 3 negatif üst üste yasak
      if sameTagFamily(e, beats): e.score *= 0.3                                             // aynı yıl 2 'kira' olayı olmasın
      beats.push(e); cands.remove(e); cands.removeAll(sharesExclusiveGroup(e))

  // 5) Sırala: tension düşük→yüksek→düşük (mini yay); motivasyon beat'i yılın sonuna
  order(beats)
  for b in beats: playBeat(b, state, rng('outcome'))   // seçim → outcome zarı → effects → director.update(b)

  // 6) Yıl sonu: hazard zarı (3.6), yıl özeti, scheduled güncelle, cooldown sayaçları
  if rng('hazard')() < hazard(state): die(pickCause(state, rng('hazard')))
```

### 5.3 Pacing / intensity (L4D + RimWorld melezi)

```
director = { intensity: 0..1, phase: 'build'|'peak'|'relax', lastValences: ring(3), motivDebt: 0, sinceMotiv: 0 }

update(beat):
  intensity += 0.12 * beat.tension * (beat.valence < 0 ? 1.3 : 0.7); intensity *= 0.85 (yıl sonu decay)
  lastValences.push(beat.valence)
  sinceMotiv = beat.humor.motivationBeat ? 0 : sinceMotiv + 1
  motivDebt  = (sinceMotiv >= 6 || keyif < 30) ? 1 : 0           // 6 beat'te bir motivasyon beat'i garanti
  phase = intensity > 0.7 ? 'relax' : intensity > 0.4 ? 'peak' : 'build'

pacingMultiplier(e):
  if phase == 'relax': return e.tension <= 1 ? 1.5 : 0.2          // nefes aldır: gündelik + absürt
  if phase == 'peak' : return e.tension >= 2 ? 1.4 : 0.8
  if phase == 'build': return 1 + 0.2*e.tension
  // Cassandra-tarzı garanti: 4 yıl boyunca tension≥2 olmadıysa, bir sonraki yıl rare/dark havuzu 2×
```
- **Üst üste negatif yasağı:** `lastValences` son 3; iki ardışık negatif varsa valence<0 adaylar o beat için elenir (L4D'nin "zayıf oyuncuya ilk yardım" eşdeğeri).
- **Scripted track ayrı:** zincir/arc beat'leri pacing çarpanından etkilenmez (Valve dersi), ama yılın 2 beat'ini aşamaz.
- **Mizah karışımı kotası:** yıl içinde aynı jokeType üst üste ≤2; `roast` oranı hayat genelinde %35–45, `motivational` %10–15 (hedef ton için lint, 6. bölüm).

### 5.4 Kaçınılması gereken tuzaklar
- "Rastgele" hissi için **yumuşatılmış rastgelelik**: legendary olaylar için pity sayacı (20 yılda en az 1).
- Salience aşırı spesifik olayı her uygun anda seçmesin: `specificity` katkısı doğrusal ve 0,35'le sınırlı; novelty ve cooldown baskın.
- Aynı yıl zincir başlatan 2 olay yasak (`exclusiveGroup`).

### Bu oyuna nasıl uygularız (Bölüm 5)
- Motor paketi `@game/engine` saf TS: `runYear`, `director`, `rng`, `hazard`, `selectCause`. Jest ile 10.000 simüle hayat testi (6.3).

---

## 6. İçerik pipeline: 1.000+ olayı verimli yazmak

### 6.1 Üretim akışı
```
Fikir (Sheets: tema, jokeType, yaş, tag, 1 satır premise)
  → AI taslak (prompt şablonu: şema + ton kılavuzu + 3 "altın örnek" + yasaklar) ×3 varyant
  → İnsan küratör (sen): seç/yeniden yaz/kes — hedef: 15–25 olay/saat
  → YAML dosyası (klasör = tema; dosya = olay) → `pnpm content:build` → JSON + locale
  → Lint + şema + simülasyon CI → merge
```
Araştırmadaki ders: LLM üretiminde "önemli düzenleme olmadan kullanılabilir" oranı bir çalışmada ~%20; ton ve devamlılık uzun oturumlarda kayar; yapısal aşamalar + insan kapıları + sürekli kontrol şart. Bu yüzden AI **yalnızca taslak**, kalite kapısı insan + lint.

### 6.2 Lint kuralları (ton ve veri)
| Kural | Tür | Eşik/Detay |
|---|---|---|
| `humor.target != 'npc'` ise hedef korumalı grup olamaz (etnisite, din, engel, cinsel yönelim, mülteci) | Ton (hard fail) | Yasak-terim sözlüğü + manuel inceleme etiketi |
| Metin uzunluğu | UX | `text` ≤ 280 karakter, `label` ≤ 32, `narrator` ≤ 160 |
| Her olayda en az 1 "gülme adayı" | Ton | `jokeType` dolu; `roast` ise metinde "sen/senin" (2. tekil) zorunlu |
| Negatif olayda umut kapısı | Motivasyon | `valence ≤ -1` olaylarda en az 1 seçenek `keyif ≥ 0` veya `meta.tp > 0` üretmeli |
| Stat delta sınırları | Denge | Tek outcome |delta| ≤ 25; `money` ≤ 10 AÜ (legendary hariç) |
| Olasılık toplamı | Veri | Σp = 1 ± 0,001 |
| Yetim referanslar | Veri | `followUp.eventId`, `memoryHas`, `flags` sözlükte tanımlı olmalı |
| Lokalizasyon | Veri | `{...}` placeholder'ları sözlükte; cümle birleştirme yok; `cultureNote` Türkiye'ye özgü tag'li olaylarda zorunlu |
| Tekrarlayan espri | Ton | 3-gram benzerliği > 0,6 olan iki olay → uyarı ("Napolyon" esprisi 2'den fazla olmasın) |

### 6.3 Doğrulama testleri (CI)
1. **Şema:** zod; yazar hatası build'de patlar.
2. **Erişilebilirlik (dead content):** 10.000 simüle hayat (rastgele + 4 arketip politika: "sağlıkçı", "paracı", "kaos", "anne kuzusu"); hiç tetiklenmeyen olay → rapor. DendryScope (AIIDE 2023) QBN'lerde "uzun menzilli etki" sorununa sembolik analizle bakıyor; bizde simülasyon yeterli, sembolik analiz v2.
3. **Tekrar oranı:** hayat başına tekrar ≤ %3, 10 hayatta ≤ %35 hedefi; aşılırsa havuz büyüt/ağırlık düzelt.
4. **Valans akışı:** 3 negatif üst üste 0 olmalı; motivasyon beat aralığı ≤ 8.
5. **Denge:** medyan ölüm 72–78, 10. yüzdelik ≥ 45, 90. yüzdelik ≤ 95; kariyer zirvesine ulaşma oranı %5–15; para "sonsuz" exploit'i (yıllık gelir > 50 AÜ) yok.
6. **Determinizm:** aynı seed → aynı olay log'u (snapshot test); save/load ortasında kesinti → aynı sonuç.
7. **Lokalizasyon:** EN anahtar kapsamı; placeholder eşleşmesi; Türkçe ek fonksiyonu birim testleri (Ali'ye/Ayşe'ye/Ahmet'e).

### 6.4 Anlatı bug'ları için QA
- "Ölmüş anne arıyor", "evli değilken boşanma" tipi tutarsızlıklar: precondition'ı yazan değil, **state-invariant** testi yakalar (`anne.alive == false ⇒ hiçbir anne olayı`).
- Her olay için otomatik "bağlam kartı": hangi durumlarda tetiklendiğinin 5 örneği (simülasyondan) → küratör okuyup "bu metin bu bağlamda saçma" der.
- Callback metinleri `{mem:...}` eksikse fallback varyant zorunlu.

### 6.5 Telemetrisiz playtest (offline oyun)
- **RITE (Rapid Iterative Testing & Evaluation):** 5–8 kişi, sesli düşünme, sorun görülünce test durur, düzelt, devam. Age of Empires II'de 10 katılımcıdan sonra sonraki 6'da değişiklik gerekmedi. Bizim için haftalık 3–4 kişi, 20 dk oturum.
- **Kahkaha günlüğü:** gözlemci her kahkaha/gülümseme/"ekran görüntüsü aldı" anını olay ID'siyle kaydeder → olay başına "gülme oranı" tablosu; <%10 olanlar yeniden yazılır.
- **Yerel log dışa aktarma (opt-in):** oyun olay log'unu JSON olarak "Paylaş" ile verir (backend yok, kullanıcı gönderir). Beta testçiler log'u Discord'a atar; script'le tekrar oranı/ölüm dağılımı çıkarılır.
- **Kâğıt prototip:** ilk 50 olay kart olarak basılır; zar + kâğıt stat; Reigns'in "50 kartta bir şey gördük" eşiği burada test edilir.
- **"Bir hafta sonra" testi:** aynı testçi 7 gün sonra tekrar oynar; hangi olayları hatırlıyor? Hatırlanan olaylar = callback için en değerli anılar.

### Bu oyuna nasıl uygularız (Bölüm 6)
- Sprint 0'da `content:build`, lint, sim-test iskeleti; Sprint 1'de 50 olay + kâğıt prototip; her sprint +120–150 olay (AI taslak + 6–8 saat küratörlük/hafta).

---

## 7. Bu oyun için öneriler (önceliklendirilmiş, puanlı)

Puan: Etki (1–5) × Uygulanabilirlik (1–5); P0 = ilk 2 sprint, P1 = lansman öncesi, P2 = lansman sonrası.

| # | Öneri | Etki | Uyg. | Puan | Öncelik |
|---|---|---|---|---|---|
| 1 | Yıl turu + director (2–5 beat/yıl), valans akışı korumalı | 5 | 5 | 25 | P0 |
| 2 | Olay şeması (Bölüm 4) + zod + YAML→JSON build + locale çıkarımı | 5 | 5 | 25 | P0 |
| 3 | Deterministik RNG kanalları + snapshot determinizm testi | 4 | 5 | 20 | P0 |
| 4 | Salience + novelty + cooldown skorlaması (5.2) | 5 | 4 | 20 | P0 |
| 5 | 4 çekirdek + Ego/Cringe/Anne Baskısı metreleri (UI'da rozet-metre) | 5 | 4 | 20 | P0 |
| 6 | Gompertz hazard + yaş×neden tablosu + ayrı senaryo ölümü kanalı | 4 | 5 | 20 | P0 |
| 7 | 50 olaylık vertical slice + kâğıt prototip + RITE | 5 | 4 | 20 | P0 |
| 8 | Hafızalı NPC + callback placeholder dili `{mem:...}` | 5 | 3 | 15 | P1 |
| 9 | 24 kariyer, her biri 8–15 özel olay (lansmanda 12 kariyer tam, 12 iskelet) | 4 | 3 | 12 | P1 |
| 10 | Reel-çekirdek ekonomi + nominal enflasyon yüzeyi | 3 | 4 | 12 | P1 |
| 11 | Legacy TP + 8 perk + 150 meta-callback satırı | 4 | 3 | 12 | P1 |
| 12 | Haftalık "Herkes Aynı Hayat" seed modu + paylaşım kodu | 4 | 3 | 12 | P1 |
| 13 | 30 kurdele + 4 koşullu haftalık challenge | 3 | 4 | 12 | P1 |
| 14 | 10.000 hayat simülasyon CI (dead content, tekrar, denge) | 4 | 3 | 12 | P1 |
| 15 | Alt-tur arkları (askerlik, hamilelik, hapis) | 3 | 3 | 9 | P1 |
| 16 | "Çocuk olarak devam" + hayalet-ebeveyn anıları | 3 | 2 | 6 | P2 |
| 17 | Ink ile uzun özel bölümler (düğün günü, mahkeme) | 2 | 3 | 6 | P2 |
| 18 | DendryScope-tarzı sembolik erişilebilirlik analizi | 2 | 2 | 4 | P2 |

---

## 8. Açık sorular

1. **Beat başına süre gerçekte kaç saniye?** 15 sn varsayımı; vertical slice'ta ölçülecek (okuma hızı Türkçe metinde 280 karakter ≈ 10–12 sn + karar).
2. **Ego metresi iki uçta ceza modeli oyuncuya "adil" gelir mi?** Reigns'te oyuncular bunu sever ama Reigns 2 dakikalık saltanatlarla affedicidir; 60 dakikalık bir hayatta Ego 100'den ölmek sinir bozucu olabilir → belki "Ego 100 = ölüm" değil "Ego 100 = 3 yıl boyunca her olay roast" olmalı.
3. **Anne Baskısı anne öldüğünde ne olur?** "Hayalet Anne Baskısı" (yarı hız, anlatıcı sesiyle) komik mi, kırıcı mı? Playtest.
4. **Erkek/kadın karakter için askerlik gibi cinsiyete bağlı arklar İngilizce sürümde nasıl dengelenir?** EN'de "mandatory service" kurgusal mı, atlanır mı?
5. **Kaç olay "gerçekten" yeter?** Tablo 2.5 düzgün rastgele varsayımı; novelty ağırlıklı seçimle gerçek tekrar ölçümü ancak simülasyonla çıkar (Sprint 1 çıktısı).
6. **Suç yolu App Store yaş derecelendirmesini 17+'ya iter mi?** "Dolandırıcı" kariyer metinleri 12+ sınırında tutulabilir mi? T6 (platform politikaları) ile birlikte karar.
7. **Metin varyantı mı, yeni olay mı daha ucuz "yenilik"?** Hipotez: varyant 1/4 maliyetle %60 yenilik hissi; kahkaha günlüğüyle test.
8. **Anlatıcı "geçmiş hayatları hatırlıyor" oyuncuya ürkütücü gelir mi?** Hades örneği olumlu ama ton farklı; ilk meta-callback'ler yumuşak başlamalı.
9. **TÜİK'in tam yaş-özel ölüm olasılıkları (qx) tablosu** indirilip Gompertz parametreleri yeniden kalibre edilmeli; bu belgedeki a/b değerleri doğuşta 78,5 çapasıyla türetildi.

---

## 9. Kaynaklar

1. Emily Short — "Storylets: You Want Them" (2019): https://emshort.blog/2019/11/29/storylets-you-want-them/
2. Emily Short — "Beyond Branching: Quality-Based and Salience-Based Narrative Structures" (2016): https://emshort.blog/2016/04/12/beyond-branching-quality-based-and-salience-based-narrative-structures/
3. Emily Short — GDC 2012 Talk on Dynamic Dialogue (Ruskin özeti): https://emshort.blog/2012/03/16/gdc-2012-talk-on-dynamic-dialogue/
4. Elan Ruskin — "AI-driven Dynamic Dialog through Fuzzy Pattern Matching", GDC 2012 slaytları (Valve): https://cdn.fastly.steamstatic.com/apps/valve/2012/GDC2012_Ruskin_Elan_DynamicDialog.pdf
5. GDC Vault — Ruskin oturumu: https://gdcvault.com/play/1015317/AI-driven-Dynamic-Dialog-through
6. Mímir (Ruskin modelinin Rust uygulaması, "en çok gereksinim eşleşen kural"): https://github.com/subtalegames/mimir
7. Yarn Spinner — Storylets and Saliency: A Primer: https://docs.yarnspinner.dev/write-yarn-scripts/advanced-scripting/storylets-and-saliency-a-primer
8. Yarn Spinner — Saliency strategies (v3): https://docs.yarnspinner.dev/next/3-new-in-v3/language-features/saliency
9. Yarn Spinner blog — Saliency Systems and State Mutation: https://www.yarnspinner.dev/blog/saliency-and-state-mutation/
10. Fallen London Wiki — Statistics (5.284 storylet, 3.582 quality): https://fallenlondon.wiki/wiki/Fallen_London_Wiki:Statistics
11. Failbetter forum — "Fallen London has almost 4.5 million words": https://community.failbettergames.com/t/fallen-london-has-almost-4-5-milion-words/22727
12. Failbetter — Fallen London resmi sayfa: https://www.failbettergames.com/games/fallen-london
13. SimpleQBN — Quality-Based Narrative (2010) özeti: https://videlais.github.io/simple-qbn/qbn.html
14. King of Dragon Pass blog — "How many scenes?" (1624 toplam, 614 sahne): https://kingofdragonpass.blogspot.com/2012/09/how-many-scenes.html
15. A Sharp — Opal Scripting Language: https://a-sharp.com/kodp/osl.html
16. Six Ages blog — Scene Tags: https://blog.sixages.com/index.php/2016/05/28/scene-tags/
17. Game Developer — "Game Design Deep Dive: Creating an adaptive narrative in Reigns": https://gamedeveloper.com/design/game-design-deep-dive-creating-an-adaptive-narrative-in-i-reigns-i-
18. PC Gamer — "How Reigns and its sequel make their 'Tinderocracy' work" (1.200 kart, +%30): https://www.pcgamer.com/how-reigns-and-its-forthcoming-sequel-make-their-tinderocracy-work
19. Emily Short — Reigns incelemesi: https://emshort.blog/2016/08/20/reigns/
20. Game Developer — "The discomfort zone: the hidden potential of Valve's AI Director": https://www.gamedeveloper.com/design/the-discomfort-zone-the-hidden-potential-of-valve-s-ai-director
21. Shacknews — "How Evolve learned from Left 4 Dead's AI director": https://shacknews.com/article/82787/how-evolve-assures-action-peaks-and-valleys
22. modl.ai — L4D AI Director analizi: https://modl.ai/?p=1984
23. Mateas & Stern — Façade drama manager (TIDSE 2003): https://users.soe.ucsc.edu/~michaelm/tenurereview/publications/mateas-tidse2003.pdf
24. RimWorld Wiki — Cassandra Classic (4,6/6 gün döngüsü, tehdit ağırlıkları): https://rimworldwiki.com/wiki/Cassandra
25. RimWorld Wiki — AI Storytellers: https://rimworldwiki.com/wiki/Storyteller_settings
26. Paradox — CK3 Dev Diary #30: Event Scripting (on_action, weighted pool): https://admin-forum.paradoxplaza.com/forum/developer-diary/crusader-kings-3-dev-diary-30-event-scripting.1397140
27. BitLife Wiki — Stats: https://bitlife-life-simulator.fandom.com/wiki/Stats
28. BitLife Wiki — Events: https://bitlife-life-simulator.fandom.com/wiki/Events
29. Gamezebo — BitLife 1.14: continue as your child: https://www.gamezebo.com/walkthroughs/bitlife-version-1-14-faq-how-to-continue-as-your-child-how-to-repeat-a-bitlife-and-how-to-become-a-model/
30. ProGameGuides — BitLife ribbons list: https://progameguides.com/bitlife/ribbons-list-guide/
31. Sensor Tower — Top Simulator Games US Q2 2025 (BitLife haftalık gelir/indirme): https://sensortower.com/blog/2025-q2-unified-top-5-simulator%20games-revenue-us-60416e41241bc16eb8905c2f
32. Wikipedia — Alter Ego (1986): https://en.wikipedia.org/wiki/Alter_Ego_(1986_video_game)
33. The Digital Antiquarian — Alter Ego: https://www.filfre.net/?p=1609
34. The Sims Wiki — Motive: https://sims.fandom.com/wiki/Motive
35. CRPG Addict — Princess Maker 2 (1993): https://crpgaddict.blogspot.com/2024/05/game-514-princess-maker-2-1993.html
36. ArrPeeGeeZ — Princess Maker 2 jobs/school guide: https://www.arrpeegeez.com/2023/12/princess-maker-2-walkthrough-jobs-and.html
37. Emily Short — Long Live the Queen incelemesi: https://emshort.blog/2015/07/21/long-live-the-queen-hanako-games/
38. TV Tropes — Long Live the Queen (mood/cap kuralları): https://www.tvtropes.org/pmwiki/pmwiki.php/VisualNovel/LongLiveTheQueen
39. Wikipedia — Real Lives: https://en.wikipedia.org/wiki/Real_Lives_(video_game)
40. AA — Türkiye'de beklenen yaşam süresi 78,5 yıl (TÜİK Hayat Tabloları 2023–2025): https://www.aa.com.tr/tr/gundem/turkiyede-beklenen-yasam-suresi-78-5-yil/4012205
41. Rapor Bülteni — TÜİK Hayat Tabloları 2022–2024: https://raporbulteni.substack.com/p/127-tuik-hayat-tablolar-2022-2024
42. Alomaliye — TÜİK Ölüm ve Ölüm Nedeni İstatistikleri 2024: https://www.alomaliye.com/2025/06/19/olum-ve-olum-nedeni-istatistikleri-2024/
43. Cumhuriyet — TÜİK 2024 trafik kazası ölümleri (6.352; 18–24 yaş %15,1): https://www.cumhuriyet.com.tr/turkiye/tuik-acikladi-2024te-trafik-kazalarinda-6-binden-fazla-kisi-oldu-2336104
44. Wikipedia — Gompertz–Makeham law of mortality: https://en.wikipedia.org/wiki/Gompertz%E2%80%93Makeham_law_of_mortality
45. Alomaliye — Asgari Ücret 2026 (net 28.075,50 TL): https://www.alomaliye.com/asgari-ucret/
46. Cumhuriyet — 2026 asgari ücret: https://www.cumhuriyet.com.tr/ekonomi/2026-yili-asgari-ucreti-belli-oldu-2464011
47. inkle — inkjs (sıfır bağımlılık JS runtime): https://www.github.com/inkle/inkjs
48. pub.dev — ink_dart / flutter_ink: https://pub.dev/packages/flutter_ink
49. wildwinter — Ink-Localiser: https://github.com/wildwinter/Ink-Localiser
50. lemurivolta — ink-translate: https://github.com/lemurivolta/ink-translate
51. inkle/ink issue #514 (lokalizasyon ve birleştirme sorunu): https://github.com/inkle/ink/issues/514
52. yarn-spinner-runner-ts (Yarn 3.x TS runtime, React hook): https://app.unpkg.com/yarn-spinner-runner-ts@0.1.5-c/files/README.md
53. yarn-bound (Yarn 2.x JS): https://npmjs.com/package/yarn-bound
54. lazerwalker — Twison (Twine → JSON): https://github.com/lazerwalker/twison
55. bryc — JS PRNG'ler (sfc32, mulberry32, xoshiro128**): https://github.com/bryc/code/blob/master/jshash/PRNGs.md
56. DEV — "One seed, same puzzle for everyone" (tarih-seed'li günlük challenge, offline): https://dev.to/gowtham_r_2002/one-seed-same-puzzle-for-everyone-seeded-rng-for-a-fair-daily-challenge-1h7d
57. Spelunky Wiki — Daily Challenge Mode: https://spelunky.fandom.com/wiki/Daily_Challenge_Mode_(HD)
58. Game Developer — "The 24-hour ticket: examining daily runs": https://www.gamedeveloper.com/design/the-24-hour-ticket-examining-daily-runs-
59. GDC — "Breathing Life into Greek Myth: The Dialogue of Hades" (GDC 2021): https://gdcvault.com/play/1026975/Breathing-Life-into-Greek-Myth
60. Game Developer — "How Supergiant weaves narrative rewards into Hades' cycle of perpetual death": https://gamedeveloper.com/design/how-supergiant-weaves-narrative-rewards-into-i-hades-i-cycle-of-perpetual-death
61. GamesRadar — Hades 2: 400.000+ kelime, 30.000 satır: https://www.gamesradar.com/games/hades/hades-2-has-an-epic-script-of-over-400-000-words-and-30-000-voice-lines-around-50-percent-more-than-the-original-roguelike
62. DendryScope — Narrative Designer Support via Symbolic Analysis (AIIDE 2023): https://ojs.aaai.org/index.php/AIIDE/article/view/27527
63. Testing Interactive Fiction (IF craft corpus): https://pvliesdonk.github.io/if-craft-corpus/corpus-docs/craft-foundations/testing_interactive_fiction
64. Wikipedia — RITE Method: https://en.wikipedia.org/wiki/RITE_Method
65. arXiv — "Evaluating Quality of Gaming Narratives Co-created with AI" (2025): https://arxiv.org/pdf/2509.04239
66. arXiv — "Towards Self-Evolving Narrative Systems" (LLM, offline pre-generation + human gate): https://arxiv.org/html/2611.01954
67. arXiv — "From World-Gen to Quest-Line: Dependency-Driven Prompt Pipeline" (yapısal JSON aşamaları): https://arxiv.org/html/2604.25482v1
68. Gamine AI — Free narrative tools for indie games 2026 (sabit kolon şeması önerisi): https://gamineai.com/blog/top-12-free-narrative-and-dialogue-tools-for-indie-games-2026-edition
69. Wikipedia — Left 4 Dead (AI Director): https://en.wikipedia.org/wiki/Left_4_Dead
70. Wikipedia — Reigns: https://en.wikipedia.org/wiki/Reigns_(video_game)

*Not: emshort.blog, gamedeveloper.com ve steamstatic.com bu oturumun ağ izin listesinde olmadığı için sayfalar tam okunamadı; bu kaynaklara ait özetler arama sonuçları ve ikincil kaynaklar üzerinden doğrulandı.*
