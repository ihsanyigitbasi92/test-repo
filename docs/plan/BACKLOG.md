# BACKLOG — Motto (düz, öncelik sıralı)

> **Belge türü:** Ürün backlog'u (Faz 3). Eşlik ettiği plan: `docs/plan/SPRINTS.md` (neden/ne zaman orada; ne/ne kadar burada).
> **Durum:** v1.0 · 2026-11-08 · Kaynak: 01–11 dokümanlarının §6 kabul kriterleri (AC-xx-nn, 328 adet; AC-01-26 D-096'dan) + 13 §4 "Sprint 0'dan önce çözülmesi şart" (18 madde, bağlayıcı) + sahip kuralı gereği sprint demo maddeleri (9).
> **Sıralama:** önce sprint; sprint içinde önce 13 §4 maddeleri (13'teki bağımlılık sırası), sonra AC'ler doküman sırasıyla, en sonda sprint demosu. Sıra = öncelik; sprint içi çekişmede üstteki kazanır. Demo maddesi hiçbir koşulda kesilmez.
> **Efor:** AC başına; S ≈ 0,1 ajan-gün · M ≈ 0,3 ag · L ≈ 1+ ag (SPRINTS §0) — aynı iş paketinde paylaşılan altyapı ayrıca sayılmaz. 13 §4 maddelerinde (B13-nn) S ≈ 0,25 · M ≈ 0,5 · L ≈ 1 ag yalnızca doküman/karar kapanışı; kodu kendi AC satırlarında sayılır. İlk tahmin sezgiseldir (doğrulama türü + hacim); sprint planlama PR'ında düzeltilir.
> **Bağımlılık:** `B13-nn` = 13 §4 maddesi (S0'da kapanmadan bağımlı iş başlamaz); `EAS build (sahip)` = sahibin hesabında build + cihaz kapısı (TestFlight / Play internal).
> **Kural:** "Bitti" tanımı SPRINTS §5'tedir. Sprintler arası taşıma yalnızca bu tabloda sprint sütunu değiştirilerek ve `docs/plan/CHANGELOG.md`'ye gerekçe yazılarak yapılır. Bir AC birden fazla sprintte dokunuluyorsa (ör. harness eşiklerinin S5'te kilitlenmesi) burada **ilk teslim** sprinti yazılır; yeniden doğrulamalar SPRINTS'teki sprint kapsamında listelenir.

## Özet

| Sprint | Madde | S | M | L | Backlog toplamı (ag) |
|---|---|---|---|---|---|
| S0 | 51 | 19 | 25 | 7 | 19,2 |
| S1 | 92 | 29 | 62 | 1 | 22,5 |
| S2 | 65 | 30 | 30 | 5 | 17,0 |
| S3 | 42 | 11 | 28 | 3 | 12,5 |
| S4 | 48 | 23 | 25 | 0 | 9,8 |
| S5 | 21 | 12 | 7 | 2 | 5,3 |
| S6 | 27 | 15 | 8 | 4 | 7,9 |
| S7 | 5 | 3 | 0 | 2 | 2,3 |
| S8 | 4 | 4 | 0 | 0 | 0,4 |
| **Toplam** | **355** | | | | |

Not: Backlog toplamı sprint kapasitesiyle (≈ 20 ag, planlanan ≤ 17) mutabakat içindir; SPRINTS §2'deki paket eforu (entegrasyon, UI cilası, içerik üretimi, doküman PR'ları dahil) bağlayıcıdır. S1–S2'nin madde sayısı yüksektir çünkü çekirdek AC'lerin çoğu motor ve harness testleriyle tek paket içinde kapanır. Kapasite aşımında önce sıranın altındaki maddeler bir sonraki sprinte kayar; 13 §4 maddeleri ve demo kaymaz.

## Tablo

| # | ID | Başlık | Doküman / AC referansı | Sprint | Efor | Bağımlılık |
|---|---|---|---|---|---|---|
| 1 | B13-01 | Zaman/boşluk modeli tek kural (02/03/07/10/mock) — kanıt: 02 §2.1, 03 §2.1, 07 §2.2.1/AC-07-39, 10 §2.3.9 aynı cümleyi taşıyor; mock v3 `tick()` … | 13 §4 #1; D-088 | S0 | M | — |
| 2 | B13-02 | D-066/D-067 motor dokümanlarına işlendi — kanıt: 03 §0.1 + 10 §0.2 satırları; 10 `LifeState`/`Action` tipleri | 13 §4 #2; D-099 | S0 | M | B13-01 |
| 3 | B13-03 | Motor determinizmi: transandantal yasağı + tablolar — kanıt: ESLint kuralı repo'da; `tables/hazard.ts`, `tables/gapQuantile.ts`; üç platform sha256 … | 13 §4 #3; D-098 | S0 | M | B13-02 |
| 4 | B13-04 | Tek zod şeması + fixture doğrulama — kanıt: `packages/content-schema/schema.ts`; `test/fixtures/docs/*.json` CI'da `parse` | 13 §4 #4; D-099 | S0 | M | B13-02 |
| 5 | B13-05 | `tuning.json` + RNG gün tabanlı + tek director — kanıt: 10 §3.2 yalnızca imza; H-10 tablosu tuning'den üretiliyor | 13 §4 #5; D-100, D-101 | S0 | M | B13-03, B13-04 |
| 6 | B13-06 | Rıza/yaş modeli tek kaynak (`ConsentState` + `isMinor`, aktarım anahtarı yok, kapı ilk ekran, aydınlatma ilk … — kanıt: 10 §5.2 tipi; `consent/cards.json`; ST-08 şema kontrolü; avukata giden tek … | 13 §4 #6; D-102, D-103, D-104 | S0 | M | B13-04 |
| 7 | B13-07 | Google SCC / m.9/4 teyidi (TR'de reklam SDK'sı açılmadan) — kanıt: Avukat yazılı görüşü; yoksa TR soft launch reklam SDK'sı kapalı başlar | 13 §4 #7; D-103 | S0 | M | B13-06 |
| 8 | B13-08 | 16+ muhtırası (226/7, m.25, Better Ads, Apple anketi 10 cevap) — kanıt: 08 §2.6 anket tablosu dolu; avukat imzası ya da TR 18+ beyan kararı | 13 §4 #8; D-107 | S0 | M | B13-06 |
| 9 | B13-09 | Reklam modeli yeniden hesap (interstitial dönüş yerleşimi, R1 çıkar, R2 taşındı, R3 açık metin; H-06-1 … — kanıt: 06 §2.9 tablosu yeni varsayımlarla; `ad_opportunity/DAU` KPI; 10 `canShow` playTime | 13 §4 #9; D-084, D-085, D-086 | S0 | L | B13-06 |
| 10 | B13-10 | KPI seti ve kapılar (oturum/gün, dk/gün; retention üç bant; K-02 iki kademeli; G3 organik) — kanıt: 11 §2.1/§2.5 tabloları; data room "benchmark gerekçesi" sayfası | 13 §4 #10; D-083, D-113, D-086 | S0 | L | B13-09 |
| 11 | B13-11 | İçerik hacmi tek kaynak + bant havuzu hedefleri — kanıt: 00 §14 tablosu = 03 §1 = 09 §6.4; sprint planında içerik/kod saat bölüşümü | 13 §4 #11; D-112 | S0 | M | B13-04 |
| 12 | B13-12 | D-064 şaka bütçesi + mekanizma kotaları lint'te — kanıt: 03 şemasında `punchOwner`, `intent.mechanism/closer`; 08'de closer n-gram ve kişi-sıfatı … | 13 §4 #12; D-093, D-094 | S0 | L | B13-04 |
| 13 | B13-13 | Bildirim sözleşmesi (tek vaat, zarf tetikli merdiven, P1 streak kalktı) — kanıt: 05 §2.4 tablosu; `notif.*` lint; 07 §2.3.4 metni aynı | 13 §4 #13; D-091 | S0 | M | B13-04 |
| 14 | B13-14 | Yokluk ekonomisi donar + 90 gün tavanı — kanıt: 02 §2.1.7 `advanceTime`; AC-02-41 invariant'ları | 13 §4 #14; D-089 | S0 | M | B13-01 |
| 15 | B13-15 | Teknik düzeltme paketi (RC configure +5 sn, Keychain THIS_DEVICE_ONLY, içerik bundle dışı, PBL 9.1.0/pod … — kanıt: 10 Ek A güncel; `pod install` yeşil; AC-10-19 | 13 §4 #15; D-117 | S0 | L | B13-03 |
| 16 | B13-16 | Marka + telif takvimi (TÜRKPATENT başvurusu, ASC ad rezervasyonu, alan adı, FSEK m.52 devir, SOURCES.md) — kanıt: Başvuru numaraları; imzalı devir; `assets/SOURCES.md` | 13 §4 #16; D-111 | S0 | M | — |
| 17 | B13-17 | Maket v3 dokümana hizalı (Teşhis adları, ANNE ARIYOR görseli, zaman modeli, auto politika, lint kapsamı) — kanıt: `docs/mock/motto-demo.html` lint'ten geçiyor; FTUE kronometre ≤ 60 sn | 13 §4 #17; D-121, D-108 | S0 | M | B13-01, B13-12 |
| 18 | B13-18 | Mağaza vaatleri düzeltildi ("Oyunun ortasında reklam yok", ekran görüntüsü 4, "wagers") — kanıt: `store/{tr,en}/*.md` `aso-lint` yeşil | 13 §4 #18; D-106 | S0 | M | B13-16 |
| 19 | AC-01-01 | Her koç satırı `CoachLine` şemasına uyar; `persona`, `slot`, `type`, `level`, `moods`, `rarity`, `intent`, `review` zorunlu alanları doludur. | 01 §6 · AC-01-01 | S0 | S | B13-12, B13-04 |
| 20 | AC-01-26 | Koç satırı bankası = 08 lint'ini %100 geçen tek kaynak; 13 §5'in 15 yeniden yazımı bankada (D-096) | 01 §6 · AC-01-26 | S0 | S | B13-12 |
| 21 | AC-02-41 | `advanceTime({ days })` hayatı dondurmaz (`applyGap` tam uygulanır: drift, akış, borç, Anne Baskısı); aradaki doğum günleri kartsız pulse, zar sonucu … | 02 §6 · AC-02-41 | S0 | M | B13-01, B13-14 |
| 22 | AC-03-18 | Determinizm: aynı `lifeSeed` + aksiyon dizisi iOS, Android ve Node'da bit-bit aynı `LifeState`; gün ortası save/load aynı sonucu verir. | 03 §6 · AC-03-18 | S0 | L | B13-04, B13-05, B13-03 |
| 23 | AC-03-22 | Şema lint'i L03-01..14 CI'da çalışır; BLOK seviyesi merge'i engeller; `document` payı ≤ %15. | 03 §6 · AC-03-22 | S0 | S | B13-04, B13-05 |
| 24 | AC-03-24 | 10.000 hayat harness'ı Node'da < 60 sn; `dead-content.json` MVP'de uyarı, 1.0'da boş. | 03 §6 · AC-03-24 | S0 | M | B13-04, B13-05 |
| 25 | AC-04-14 | Durumsal NPC'ler (`npc:*`) anı yazmaz, affinity taşımaz; `npc:waiter` ve `npc:banker` `SpeakerId`'ye eklenir | 04 §6 · AC-04-14 | S0 | S | B13-02 |
| 26 | AC-06-04 | `catalog.spec.ts`: hiçbir ürün `NEVER_SOLD` etiketi taşımaz; `kind: 'subscription'` derlenmez; `randomness: false` tip düzeyinde. | 06 §6 · AC-06-04 | S0 | S | B13-06, B13-09 |
| 27 | AC-07-39 | `GameClock` görünür; `.clock b` tarihi, `.clock span` saati ("HH:MM"), `.dp i` genişliği 0 → %100 bir gün boyunca artar; ▶'de 24 oyun saati 6.000 ± … | 07 §6 · AC-07-39 | S0 | M | B13-01, B13-17 |
| 28 | AC-07-44 | `MomCallOverlay`: Anne Baskısı ≥ 75 → ertesi takvim günü `.call` tam ekran; `h2` "ANNE ARIYOR"/"MOM CALLING"; 3 buton `.dec/.mute/.acc` eşit boyut … | 07 §6 · AC-07-44 | S0 | M | B13-01, B13-17 |
| 29 | AC-08-01 | `packages/content-lint` saf TS, ağ/LLM bağımlılığı yok; aynı girdi için `lint-report.json` byte düzeyinde aynı; 5.000 birim × 2 locale ≤ 20 sn CI'da. | 08 §6 · AC-08-01 | S0 | S | B13-12 |
| 30 | AC-08-17 | `RL-13` kod kapsamı: `bribe*`/`rüşvet*` identifier/yorum/string `.ts/.json/.md`'de 0; `RL-24/25` sözcükleri `store/` ve `creatives/`'ta 0; rakip … | 08 §6 · AC-08-17 | S0 | S | B13-12 |
| 31 | AC-09-01 | `packages/content/schema` 03 `GameEvent`'e `review.locales`, `review.intentRev`, `l10n` alanlarını zod ile ekler; `localeOnly` olayda `L` yalnızca … | 09 §6 · AC-09-01 | S0 | S | B13-04, B13-11 |
| 32 | AC-09-02 | `content:build` §2.2.4 anahtar şemasıyla `dist/locales/{tr,en}/*.json` ve `keys.d.ts` üretir; TR/EN anahtar kümeleri birebir | 09 §6 · AC-09-02 | S0 | S | B13-04, B13-11 |
| 33 | AC-09-03 | `tr-only/` olayı `en` bundle'ında yoktur, ikizi vardır (ve tersi) | 09 §6 · AC-09-03 | S0 | S | B13-04, B13-11 |
| 34 | AC-09-05 | `trInflect` §2.4.4'teki 44 vakayı ve golden CSV'nin 2.100 hücresini geçer; CSV değişmeden kural değişikliği CI'da düşer | 09 §6 · AC-09-05 | S0 | L | B13-04, B13-11 |
| 35 | AC-10-01 | `packages/engine` hiçbir `react`, `react-native`, `expo*` import'u içermez; `Date.now`, `Math.random`, `setTimeout` kullanmaz. | 10 §6 · AC-10-01 | S0 | S | B13-03, B13-15 |
| 36 | AC-10-02 | `step()` imzası `(state, meta, action, content) → {state, meta, effects}` olarak sabittir; `NEXT_DAY` ve `ANSWER` birincil aksiyonlardır … | 10 §6 · AC-10-02 | S0 | S | B13-03, B13-15 |
| 37 | AC-10-03 | Aynı `contentHash` + `lifeSeed` + aksiyon dizisi iki platformda ve Node'da bit-bit aynı `LifeState` üretir. | 10 §6 · AC-10-03 | S0 | L | B13-03, B13-15, EAS build (sahip) |
| 38 | AC-10-04 | `NEXT_DAY` cevaplanmamış günde durumu değiştirmez; doğum gününde `phase:'yearEnd'` + Karne verisi üretir; o gün olay seçilmez. | 10 §6 · AC-10-04 | S0 | S | B13-03, B13-15 |
| 39 | AC-10-05 | Her yıl `shownDaysThisYear` yaş bandı aralığında (18–25: 12–18, 26–40: 8–12, 41–60: 5–8, 60+: 3–5; Stres > 70 ile +1); hiçbir boşluk > 90 gün; FTUE … | 10 §6 · AC-10-05 | S0 | M | B13-03, B13-15 |
| 40 | AC-10-06 | `DayCard` yalnızca `textKey` + `params` taşır; motor çıktısında Türkçe/İngilizce metin yoktur. | 10 §6 · AC-10-06 | S0 | S | B13-03, B13-15 |
| 41 | AC-10-07 | Normal ses ayarında her `ANSWER` sonucu `card.coach` içinde `roast:true` ≥ 1 balon içerir; 60+ yaşta `card.coach.length ≤ 1`. | 10 §6 · AC-10-07 | S0 | M | B13-03, B13-15 |
| 42 | AC-10-08 | Her eski kayıt şeması için fixture repoda; `v1 → v2` migration zinciri zod'dan geçer ve `step(NEXT_DAY)` çalışır; eski fixture silinemez. | 10 §6 · AC-10-08 | S0 | S | B13-03, B13-15, B13-04 |
| 43 | AC-10-09 | Kayıt zarfı sha256 bozulunca bir önceki nesle düşülür; üçü de bozuksa `meta_backup`'tan `legacy` korunur; her durumda ilgili `sys.*` koç satırı key'i … | 10 §6 · AC-10-09 | S0 | S | B13-03, B13-15 |
| 44 | AC-10-14 | `step()` Node'da ortalama ≤ 20 µs; 10.000 hayat harness'ı ≤ 60 sn/locale. | 10 §6 · AC-10-14 | S0 | M | B13-03, B13-15, B13-05 |
| 45 | AC-10-15 | Harness eşikleri H-10-01..15 PR'da (1.000) ve gecelikte (10.000) geçer; ihlal PR'ı bloklar. | 10 §6 · AC-10-15 | S0 | M | B13-03, B13-15 |
| 46 | AC-10-16 | İçerik manifest'i Ed25519 imzasız/yanlış imzalı ise yok sayılır; `kill` alanları yalnızca daraltır (şema testinde "ekleme" alanı yoktur); indirilen … | 10 §6 · AC-10-16 | S0 | M | B13-03, B13-15, B13-04 |
| 47 | AC-10-17 | İçerik paketi yıl ortasında değişmez: `state.contentHash ≠ aktif` iken mevcut hayat eski paketle sürer, yeni hayat yeni paketle başlar. | 10 §6 · AC-10-17 | S0 | S | B13-03, B13-15 |
| 48 | AC-10-24 | Reklam/IAP/Sentry/Firebase paketleri yalnızca `src/providers/` içinden import edilir; UI hiçbir port'u doğrudan çağırmaz. | 10 §6 · AC-10-24 | S0 | S | B13-03, B13-15 |
| 49 | AC-10-27 | Satın alma ekranında önceden seçili seçenek yok; fiyat yalnızca `priceString`; Restore görünür; abonelik/enerji/loot box bileşeni repoda yok. | 10 §6 · AC-10-27 | S0 | M | B13-03, B13-15 |
| 50 | AC-10-28 | Web export + Playwright: 48 spec (12 × TR/EN × 2 viewport) yeşil, pseudo-locale'de taşma yok; her etkileşimli öğede `testID` + `accessibilityLabel`. | 10 §6 · AC-10-28 | S0 | M | B13-03, B13-15 |
| 51 | DEMO-S0 | Sprint demosu: web export → Claude artifact + Playwright TR/EN ekran görüntüleri + "Bu sprintte eklenenler" | Sahip kuralı; SPRINTS §2.1, §5 | S0 | S | S0 kapsamı |
| 52 | AC-01-03 | Sık slot'larda ≥ 5, orta ≥ 3, nadir ≥ 2 varyant; eksik = lint BLOK. | 01 §6 · AC-01-03 | S1 | S | B13-12 |
| 53 | AC-01-04 | 10.000 hayat harness'ında "aynı satır 3+ kez" < %2, cooldown ihlali 0. | 01 §6 · AC-01-04 | S1 | M | B13-12, B13-05 |
| 54 | AC-01-05 | İki bağımsız lift beat'i art arda hiç gelmez; Nazik'te her roast balonu gömülü lift taşır. | 01 §6 · AC-01-05 | S1 | S | B13-12 |
| 55 | AC-01-06 | `isLift` satırların son cümlesi ≤ 6 kelime; gerçek hayat eylemi içeren lift yok. | 01 §6 · AC-01-06 | S1 | S | B13-12 |
| 56 | AC-01-07 | Yasaklı sınıflar (kontrol dili, yetenek övgüsü, hitap, kumar, rüşvet, emoji, ünlem, para birimi/makro, ahiret, genelleme, intihar, beden, bölgesel … | 01 §6 · AC-01-07 | S1 | S | B13-12 |
| 57 | AC-01-08 | 60+ bandında beat başına ≤ 1 balon; bathos/4. duvar/logic_chain/archetype_compare 60+'ta 0. | 01 §6 · AC-01-08 | S1 | S | B13-12 |
| 58 | AC-01-09 | Sessizlik protokolü her tetikte plain → kuru → sıcak sırasını izler; pencerede roast 0; `death_1` ≤ 8 kelime ve neden içermez. | 01 §6 · AC-01-09 | S1 | S | B13-12 |
| 59 | AC-01-11 | Her iddia satırı gerçek oranı gösterir; harness isabeti %50–62; koç satırları motor durumuna yazmaz (saf okuma). | 01 §6 · AC-01-11 | S1 | M | B13-12, B13-05 |
| 60 | AC-02-01 | Gösterilen gün bütçesi yaş bandına göre `dayBudget()` tablosunu uygular (12–18 / 8–12 / 5–8 / 3–5, tavan bant maks. + 2); 10.000 hayatta bant … | 02 §6 · AC-02-01 | S1 | M | B13-01, B13-14 |
| 61 | AC-02-02 | Serbest modda 18–ölüm toplam gösterilen gün p10–p90 450–600 (Hızlı Yaşa 36+: 350–420); gösterilen gün süresi (▶) p50 10–14 sn, p90 ≤ 20 sn; ömür … | 02 §6 · AC-02-02 | S1 | M | B13-01, B13-14, EAS build (sahip) |
| 62 | AC-02-03 | Medyan ölüm yaşı 72–78 (tüm personalar, 10.000 hayat) | 02 §6 · AC-02-03 | S1 | M | B13-01, B13-14 |
| 63 | AC-02-04 | p05 ≥ 42, p10 ≥ 50, p90 ≤ 92, p95 ≤ 96; hiçbir hayat 100'ü geçmez | 02 §6 · AC-02-04 | S1 | M | B13-01, B13-14 |
| 64 | AC-02-05 | 28'den önce ölüm ≤ %2; 25'ten önce senaryo ölümü 0 (motor `death` → yaralanma dönüşümü) | 02 §6 · AC-02-05 | S1 | M | B13-01, B13-14 |
| 65 | AC-02-06 | `safe` persona medyanı ≥ 82, `chaotic` ≥ 64 (sağlık ajansı görünür) | 02 §6 · AC-02-06 | S1 | M | B13-01, B13-14 |
| 66 | AC-02-07 | 28 yaşında Para < 0 oranı ≤ %5; bailout hayat başına ≤ 1 ve yalnızca 18–27 | 02 §6 · AC-02-07 | S1 | M | B13-01, B13-14 |
| 67 | AC-02-08 | Yıllık gelir > 60 Birim olan hayat 0 (legendary olay hariç); volatil gelir iki ardışık yıl aynı yöne gitmez | 02 §6 · AC-02-08 | S1 | M | B13-01, B13-14 |
| 68 | AC-02-09 | Negatif bakiye ekranda "Borç N / Debt N" olarak, eksi işareti ve para birimi simgesi olmadan; iflas olayı −24'te tetiklenir ve −6'ya çeker | 02 §6 · AC-02-09 | S1 | S | B13-01, B13-14 |
| 69 | AC-02-10 | Hazard ölümlerinde absürt kuyruk payı %4–6; her neden `lineKey` onaylı listede; yasaklı neden listesi lint'te 0 eşleşme (iki locale) | 02 §6 · AC-02-10 | S1 | M | B13-01, B13-14 |
| 70 | AC-02-12 | `deathFlow` boyunca `AdService`/`offer:*` çağrısı 0; tip düzeyinde `DeathFlowContext` reklam API'si içermez | 02 §6 · AC-02-12 | S1 | S | B13-01, B13-14, B13-09 |
| 71 | AC-02-14 | Her ölümde `unlocks.length ≥ 1` (Yedek Kulübesi pity dahil) | 02 §6 · AC-02-14 | S1 | M | B13-01, B13-14 |
| 72 | AC-02-19 | Şans'ın `p` üzerindeki etkisi ±%10 ile sınırlı; İddia fişinde ve "Oranı göster"de yazılan oran `pEtkin`'e eşit | 02 §6 · AC-02-19 | S1 | S | B13-01, B13-14 |
| 73 | AC-02-21 | Aynı `seed+contentHash` → aynı ölüm yaşı/nedeni/para serisi/gün dizisi/atlama özeti; gün ortasında, boşluk öncesi/sonrası ve doğum günü pulse'ı … | 02 §6 · AC-02-21 | S1 | S | B13-01, B13-14 |
| 74 | AC-02-22 | 02 alanı metinlerinde (iki locale) para birimi simgesi/adı, "enflasyon/inflation", "asgari/minimum wage", oran olarak faiz 0 eşleşme | 02 §6 · AC-02-22 | S1 | S | B13-01, B13-14 |
| 75 | AC-02-24 | Drift tek başına Sağlık'ı 5'in altına indirmez; Keyif ≥ 5; Keyif < 30 iken Kafa ≤ 70 | 02 §6 · AC-02-24 | S1 | M | B13-01, B13-14 |
| 76 | AC-02-25 | `applyDamage` 18'de ×0,5, 23'te ×0,75, 28'de ×1,0; pozitif efektlere dokunmaz | 02 §6 · AC-02-25 | S1 | S | B13-01, B13-14 |
| 77 | AC-02-26 | Doğum günü pulse sırası sabit (yaş → yearsWorked → eşik kuyruğu doğrulama → bailout/spiral → hastalık zarı → healthCritical → Fizyoterapi kuyruğu → … | 02 §6 · AC-02-26 | S1 | M | B13-01, B13-14 |
| 78 | AC-02-29 | Hazard zarı yalnızca doğum gününde: hayat boyunca `rng('hazard')` tüketimi = (ölüm yaşı − 18) + `advanceTime` içindeki doğum günleri; boşlukta ve gün … | 02 §6 · AC-02-29 | S1 | M | B13-01, B13-14 |
| 79 | AC-02-30 | Maaş ayın 1'i, kira ayın 5'i, kedi ayın 10'u, sağlık gideri ayın 20'si: her takvim yılında her biri tam 12 kez (sağlık gideri 45+); boşluğa düşen … | 02 §6 · AC-02-30 | S1 | M | B13-01, B13-14 |
| 80 | AC-02-31 | `evt_kira_gunu` yalnızca kira gününde `bakiye < rent` iken, ayda ≤ 1, sonraki gösterilen günde ve en fazla 1 gün ötelenerek gelir; Stres +8 aynı … | 02 §6 · AC-02-31 | S1 | M | B13-01, B13-14 |
| 81 | AC-02-32 | Günlük küçük gider her takvim günü düşer ((temel geçim + yaşam tarzı)/30); doğum günü arası toplamı yıllık tabloyla ±%1; gösterilen günde tek tek … | 02 §6 · AC-02-32 | S1 | M | B13-01, B13-14 |
| 82 | AC-02-33 | Doğum günü arası `Σ applyGap` drift/decay toplamı yıllık sabite eşit (artık yıl 366/365 toleransı); üstel sabitler (`0,70^(gap/365)` … | 02 §6 · AC-02-33 | S1 | M | B13-01, B13-14 |
| 83 | AC-02-34 | Boşlukta eşik olayı, ölüm, hazard, iddia, sürpriz tetiklenmez; boşlukta geçilen Ego/Cringe/Anne eşiği sonraki gösterilen günde tam 1 kez olay olur … | 02 §6 · AC-02-34 | S1 | M | B13-01, B13-14 |
| 84 | AC-02-35 | Atlama özeti: ≤ 14 kelime, ≤ 1 rakamla yazılı sayı (gerçek sayaçtan), roast 0, kimlik 0, gerçek tarihli olay 0; `rng('director')` ile deterministik … | 02 §6 · AC-02-35 | S1 | M | B13-01, B13-14, B13-03 |
| 85 | AC-02-37 | `NEXT_DAY` → ilk metin ≤ 300 ms; gün adımı ≤ 8 ms, doğum günü pulse'ı ≤ 16 ms, 365 günlük `applyGap` ≤ 4 ms min-spec Android'de; akış zamanlayıcısı … | 02 §6 · AC-02-37 | S1 | M | B13-01, B13-14, EAS build (sahip) |
| 86 | AC-02-38 | Karne yalnızca doğum günü kartında; "Bir Yıl Daha" düğmesi yalnızca orada; başka hiçbir günde "Ertesi Gün"/"Bir Yıl Daha" düğmesi render edilmez … | 02 §6 · AC-02-38 | S1 | M | B13-01, B13-14 |
| 87 | AC-02-39 | *(v1.1, D-067)* Her `CHOOSE` sonrası `status`/stat/flag/npc-memory/money alanlarından ≥ 1'i değişir (%100); işe giriş → ilk maaş günü akış başlar … | 02 §6 · AC-02-39 | S1 | M | B13-01, B13-14 |
| 88 | AC-02-40 | Keyif çekimi `Keyif += (1 − 0,70^(gap/365))·(hedef − Keyif)`; `keyifHedef` her boşlukta güncel Para ile hesaplanır (maaş günü sonrası ↑, kira günü … | 02 §6 · AC-02-40 | S1 | M | B13-01, B13-14, B13-05 |
| 89 | AC-03-01 | Her gösterilen günde tam bir olay oynanır; olaysız gösterilen gün sıfırdır. | 03 §6 · AC-03-01 | S1 | M | B13-04, B13-05 |
| 90 | AC-03-02 | Yıllık gösterilen gün sayısı yaş bandı aralığında (12–18 / 8–12 / 5–8 / 3–5, +tavan 2 düzeltme); 10k hayatta %100. | 03 §6 · AC-03-02 | S1 | M | B13-04, B13-05 |
| 91 | AC-03-03 | Doğum günü her yıl gösterilir, olayı `sys_report_card`'dır ve yılın son günüdür; ölü karakter karne almaz. | 03 §6 · AC-03-03 | S1 | M | B13-04, B13-05 |
| 92 | AC-03-04 | `gap ≥ 2` her atlamada tek satır özet üretilir; ≤ 14 kelime; sayı varsa sayaçtan gelir. | 03 §6 · AC-03-04 | S1 | M | B13-04, B13-05 |
| 93 | AC-03-05 | Medyan ömür 450–600 gösterilen gün ve 12 sn/gün ile 90–120 dk. | 03 §6 · AC-03-05 | S1 | M | B13-04, B13-05 |
| 94 | AC-03-07 | Ardışık negatif valans serisi ≤ 2; forced olay en fazla 1 gün ötelenir. | 03 §6 · AC-03-07 | S1 | M | B13-04, B13-05 |
| 95 | AC-03-09 | İddia yalnızca `playerChose ∧ !skill ∧ type∉{document,call} ∧ 0,35 ≤ pEff ≤ 0,65`; 10 günde ≤ 2, ardışık ≥ 3 gün, yılda ≤ 2 (Nazik 1). | 03 §6 · AC-03-09 | S1 | M | B13-04, B13-05 |
| 96 | AC-03-10 | Koç tahmini daima `fail`; ömür isabeti harness'ta %50–62; "Oranı göster" `pEff`'i gösterir. | 03 §6 · AC-03-10 | S1 | M | B13-04, B13-05 |
| 97 | AC-03-11 | İddia modülü kapalı ikiz hayat stat yolunda bit-bit eşittir. | 03 §6 · AC-03-11 | S1 | L | B13-04, B13-05, B13-03 |
| 98 | AC-03-12 | Near-miss yalnızca ` | 03 §6 · AC-03-12 | S1 | M | B13-04, B13-05 |
| 99 | AC-03-13 | Pity: p95 sürpriz aralığı ≤ 14 gün, medyan 6–9, oturum tavanı 6, min aralık 3. | 03 §6 · AC-03-13 | S1 | M | B13-04, B13-05 |
| 100 | AC-03-14 | Efsane gün: hayat başına 2–6, en geç 140 günde, oturumda ≤ 1, ilk 10 günde 0, valans ≥ 0. | 03 §6 · AC-03-14 | S1 | M | B13-04, B13-05 |
| 101 | AC-03-15 | Açık zarf sayısı her doğum günü ve oturum sonunda [1, 2]; zarf ≤ 6 gösterilen günde çözülür; oturum sonunda açılan zarfın çözücüsü sonraki oturumun … | 03 §6 · AC-03-15 | S1 | M | B13-04, B13-05 |
| 102 | AC-03-19 | `salience` işlenmiş örneği (§2.4) birim testte aynı skorları üretir (±0,01). | 03 §6 · AC-03-19 | S1 | S | B13-04, B13-05 |
| 103 | AC-03-20 | Kalıp sayaçları yalnızca `CHOOSE` ile artar; stat/olay seçimine etkisi yoktur; Roast girdisi `top3` paylarının toplamı ≤ 1. | 03 §6 · AC-03-20 | S1 | M | B13-04, B13-05 |
| 104 | AC-04-01 | `LifeStatus` tipi doc 10 `LifeState.player`'a eklenir; Durum şeridi 4 hücresi her gösterilen günde doğru değeri okur (iş/ev/ilişki/varlık) | 04 §6 · AC-04-01 | S1 | M | B13-02 |
| 105 | AC-04-02 | `valence ≠ 0` olan her olayın outcome'larından ≥ 1'i kalıcı iz taşır; lint BLOK | 04 §6 · AC-04-02 | S1 | S | B13-02 |
| 106 | AC-04-03 | Nakit akışı takvimi: ayın 1'i maaş, 5'i kira+taksit+çocuk, 10'u kedi/araç/telefon, 20'si eğitim; boşlukta toplu uygulanır ve özet satırı sayıyı söyler | 04 §6 · AC-04-03 | S1 | S | B13-02 |
| 107 | AC-04-26 | Tek Hedef kütüphanesi 20/30/40; `tracker` 0/1/2 damgaya eşlenir; ceza yok; `suggest()` 3 farklı + ≥ 1 küçük + son 3 yıl hariç | 04 §6 · AC-04-26 | S1 | S | B13-02 |
| 108 | AC-04-27 | Hedef iddiası: p = harness tamamlanma oranı; band dışıysa fiş yok ama "Oranı göster"de görünür; `stamp` hedefine iddia açılmaz | 04 §6 · AC-04-27 | S1 | M | B13-02, B13-05 |
| 109 | AC-07-01 | Soğuk açılışta logo/splash ekranı yok; ilk görünen öge siyah zemin + "yazıyor…", ≤ 1 sn sonra ilk koç balonu. | 07 §6 · AC-07-01 | S1 | M | B13-01, B13-17 |
| 110 | AC-07-02 | İlk balon metni TR'de "18 oldun. Tebrikler. Buradan sonrası resmî olarak senin suçun.", EN'de "Eighteen. Congratulations. From here on, everything is … | 07 §6 · AC-07-02 | S1 | M | B13-01, B13-17 |
| 111 | AC-07-03 | FTUE'de herhangi bir ekranda "Yükleniyor"/"Loading" metni veya spinner yok. | 07 §6 · AC-07-03 | S1 | M | B13-01, B13-17 |
| 112 | AC-07-04 | İlk ChoiceButton, uygulama yükünden ≤ 15 sn (bekleme olmadan ilerleyen bot) sonra etkileşime açık (sert sınır: ilk karar fırsatı ≤ 20 sn, ilk karar ≤ … | 07 §6 · AC-07-04 | S1 | M | B13-01, B13-17 |
| 113 | AC-07-05 | Gün geçişinden (GameClock 24:00 ya da Manuel'de "Ertesi Gün" dokunuşu) yeni günün `.dateline`'ı ve ilk metninin (`.npc` veya `.card`) DOM'a girişine … | 07 §6 · AC-07-05 | S1 | M | B13-01, B13-17, EAS build (sahip) |
| 114 | AC-07-06 | Doğum günü geçişi: `AgeUpOverlay` kaldırıldıktan sonra Kısa Karne iskeletine (`.karne`) ≤ 400 ms; AgeUp'ın kendisi 1.100 ± 100 ms (reduced-motion 600 … | 07 §6 · AC-07-06 | S1 | S | B13-01, B13-17 |
| 115 | AC-07-07 | FTUE Gün 2'de (≤ 34 sn) `.slip` (WagerSlip) `.card` içinde görünür ve Dayı'nın ≥ 1 `.npc` balonu karttan sonra, seçeneklerden önce gelir; fişe … | 07 §6 · AC-07-07 | S1 | M | B13-01, B13-17 |
| 116 | AC-07-08 | HAKSIZ ÇIKTIM damgası `impact.heavy` + 400 ms mürekkep; diğer damgalar `impact.medium` + 80 ms basış (D-059/D-010). | 07 §6 · AC-07-08 | S1 | S | B13-01, B13-17 |
| 117 | AC-07-09 | Zarf hiçbir durumda haptik tetiklemez; kâğıt hışırtısı SFX çalar (D-011). | 07 §6 · AC-07-09 | S1 | S | B13-01, B13-17 |
| 118 | AC-07-10 | İlk Kısa Karne ≤ 60 sn'de (bot akışında) görünür ve ondan önce sırayla `.skip` ("340 gün"/"340 days" içerir), doğum günü `.dateline` ("DOĞUM … | 07 §6 · AC-07-10 | S1 | M | B13-01, B13-17 |
| 119 | AC-07-19 | Roast Raporu adımları D-025 sırasında; otomatik toplam ≤ 40 sn; her adım dokunuşla geçilir; sessizlik 2 sn atlanamaz; ölüm nedeni yalnızca 2. adımda … | 07 §6 · AC-07-19 | S1 | M | B13-01, B13-17 |
| 120 | AC-07-20 | Yeni Müşteri dokunuşundan yeni hayatın ilk balonuna ≤ 300 ms; "Aynı kondisyonla" chip'i tek dokunuşla aynı akışı başlatır. | 07 §6 · AC-07-20 | S1 | M | B13-01, B13-17 |
| 121 | AC-07-33 | FTUE'de bot akışı: ilk kahkaha satırı ≤ 4 sn (sert sınır 20), ilk karar fırsatı ≤ 22 sn (ilk karar sert sınır 30), fiş ≤ 34 sn, damga ≤ 41 sn, atlama … | 07 §6 · AC-07-33 | S1 | M | B13-01, B13-17 |
| 122 | AC-07-34 | Web export'ta her feed ögesinin kök düğümü maketle aynı sınıf adını taşır: `.dateline`, `.skip`, `.mundane`, `.card`, `.slip`, `.stamp`, `.npc` … | 07 §6 · AC-07-34 | S1 | M | B13-01, B13-17 |
| 123 | AC-07-35 | Her gösterilen günde tam olarak bir `.dateline` vardır; metni `/^(GÜN\ | 07 §6 · AC-07-35 | S1 | M | B13-01, B13-17 |
| 124 | AC-07-37 | Gün içi sıra: `.card` → `.npc`* → (karar) → `.me` → `.result` → `.coach`{1,2}; `.coach` diyalogdan sonra gelir; `.coach` kök düğümünde … | 07 §6 · AC-07-37 | S1 | M | B13-01, B13-17 |
| 125 | AC-07-38 | Yatay taşma yok: 320, 360, 390, 430 px viewport'larda ve XL metin (`zoom` 1,3) ile `document.scrollingElement.scrollWidth ≤ clientWidth` ve feed'deki … | 07 §6 · AC-07-38 | S1 | M | B13-01, B13-17 |
| 126 | AC-07-40 | D-066: ▶/▶▶ modunda karar bölgesinde "Ertesi Gün"/"Next Day" yoktur; ⏸ seçilince ya da `?flow=manual` ile 60 dp `.btn.primary` "ERTESİ GÜN"/"NEXT … | 07 §6 · AC-07-40 | S1 | M | B13-01, B13-17 |
| 127 | AC-07-41 | `StatusStrip` (`.life`) 4 alanı (İş · Ev · İlişki · Kedi/Varlıklar) gösterir; işe girince `İş` alanı değişir ve 500 ms `.chg` sınıfı alır; ayın … | 07 §6 · AC-07-41 | S1 | M | B13-01, B13-17 |
| 128 | AC-07-42 | `.skip` yalnızca gap > 3 günde, günde ≤ 1, ≤ 14 kelime, ≤ 1 sayı, içinde "kaybettin/lost/reset" yok; haptik ve SFX çağrısı yok. | 07 §6 · AC-07-42 | S1 | M | B13-01, B13-17 |
| 129 | AC-07-43 | `AgeUpOverlay`: `.ageup .lbl` "YAŞLANIYORSUN"/"AGING", `.num` eski yaş → 650 ± 60 ms sonra yeni yaş, toplam 1.100 ± 100 ms; `#phone.shake` sayı … | 07 §6 · AC-07-43 | S1 | M | B13-01, B13-17 |
| 130 | AC-08-02 | Katalogdaki her `RL-/TN-/QT-/NG-/ST-/RV-/DL-` kuralı için TR ve EN pozitif + negatif fixture vardır; pozitif fixture `block/warn` üretir, negatif … | 08 §6 · AC-08-02 | S1 | S | B13-12 |
| 131 | AC-08-03 | Normalizasyon: `toLocaleLowerCase('tr')`, aksan katlama, ek toleransı, gizleme kırma (nokta/boşluk/leet) ve ICU placeholder maskeleme; "Ataturk" … | 08 §6 · AC-08-03 | S1 | S | B13-12 |
| 132 | AC-08-04 | Seed listeleri: TR ≥ 212, EN ≥ 219 terim/desen; özel listeler `slurs.tr ≥ 60`, `slurs.en ≥ 120`, `sexual ≥ 40/locale`, `realpersons ≥ 5.000/locale` … | 08 §6 · AC-08-04 | S1 | M | B13-12 |
| 133 | AC-08-19 | `--docs` modu: `docs//*.md` içinde `RL-01/02/04/05/08/13` 0 `block`; yasak örnekler `[köşeli parantez]` içinde (soyutlama kontrolü); bu belge dahil … | 08 §6 · AC-08-19 | S1 | S | B13-12 |
| 134 | AC-09-06 | `{name}'e` tipi elle ek ve EN `a {` deseni `SC-08/17` BLOK | 09 §6 · AC-09-06 | S1 | S | B13-04, B13-11 |
| 135 | AC-09-07 | i18next-icu ile `plural` (TR other-only, EN one/other), `select` (EN; her dalda tam cümle) ve `number percent` iki locale'de doğru basılır ("%42" / … | 09 §6 · AC-09-07 | S1 | S | B13-04, B13-11 |
| 136 | AC-09-08 | `other` dalı eksik ICU mesajı `SC-03` BLOK; parse hatası runtime'da crash değil ham metin + breadcrumb | 09 §6 · AC-09-08 | S1 | S | B13-04, B13-11 |
| 137 | AC-09-09 | İsim üreteci build'de 08 blocklist + 8 NPC adı + FTUE adları ile süzülür; runtime havuzunda yasaklı ad sıfır; `names.lock` SHA CI'da | 09 §6 · AC-09-09 | S1 | S | B13-04, B13-11 |
| 138 | AC-09-10 | Para metinlerinde `SC-16` listesi sıfır; `{amount, number}` TR "12.000", EN "12,000" | 09 §6 · AC-09-10 | S1 | S | B13-04, B13-11 |
| 139 | AC-09-11 | Funny-check rubriği `review.locales.*.funny` alanına yazılır; toplam < 15 ya da ölçüt 0 olan olay `status:'curated'` olamaz | 09 §6 · AC-09-11 | S1 | S | B13-04, B13-11 |
| 140 | AC-10-12 | Ertesi Gün → ilk metin ≤ 300 ms (p95 cihaz; web ≤ 150 ms uyarı). | 10 §6 · AC-10-12 | S1 | M | B13-03, B13-15, EAS build (sahip) |
| 141 | AC-10-18 | `ad-opportunity` efekti `phase ∈ {dead, roast}` iken hiç üretilmez; interstitial yalnızca `SESSION_END` ve `sessionCount ≥ 3`; `AdSlot` ölüm … | 10 §6 · AC-10-18 | S1 | M | B13-03, B13-15, B13-09 |
| 142 | AC-11-07 | `tools/report-aggregate` 8 playtest dosyasından TTFD, TTFL vekili, oturum medyanı, gösterilen gün/oturum, Bir Yıl Daha, ölüm → yeni hayat (2 dk) … | 11 §6 · AC-11-07 | S1 | M | B13-10, B13-06 |
| 143 | DEMO-S1 | Sprint demosu: web export → Claude artifact + Playwright TR/EN ekran görüntüleri + "Bu sprintte eklenenler" | Sahip kuralı; SPRINTS §2.2, §5 | S1 | S | S1 kapsamı |
| 144 | AC-01-12 | Küçük yalan: hayat başına ≤ 1 (MVP); %100 aynı hayatta itiraf; yalan satırında rakam yok; Defter'de İtiraf girdisi oluşur. | 01 §6 · AC-01-12 | S2 | S | B13-12 |
| 145 | AC-01-13 | Her callback `memoryRefs` ile `metaLog`'a bağlıdır; oyuncu Defter'den doğrulayabilir (link açılır). | 01 §6 · AC-01-13 | S2 | S | B13-12 |
| 146 | AC-01-14 | Yorgun ruh hâli yalnızca 23:00–06:00 cihaz saatinde; satır öznesi koç; 03:12 ömürde 1; saat oynatma yorumsuz. | 01 §6 · AC-01-14 | S2 | M | B13-12, EAS build (sahip) |
| 147 | AC-01-15 | Tanışıklık tamamlanan hayatla +1, tavan 5; yalnızca `familiarityMin` filtresini etkiler, hiçbir stat/olasılığı değiştirmez. | 01 §6 · AC-01-15 | S2 | S | B13-12 |
| 148 | AC-01-16 | Defter girdileri üçüncü kişi, ≤ 12 kelime; Not ≤ 12/hayat; EN'de zamir yok; KAPANDI girdisi her ölümde. | 01 §6 · AC-01-16 | S2 | S | B13-12 |
| 149 | AC-01-17 | Ses ayarı değişince havuz anında değişir; sessizlik, düşük Keyif, iddia sıklığı ve oranlar üç kademede aynıdır. | 01 §6 · AC-01-17 | S2 | M | B13-12 |
| 150 | AC-02-11 | Ölüm nedeni metni yalnızca Roast Raporu adım 2'de render edilir; paylaşım kartı `cause` alanını içermez | 02 §6 · AC-02-11 | S2 | S | B13-01, B13-14 |
| 151 | AC-02-13 | Ölümden yeni hayatın ilk metnine otomatik akış ≤ 35 sn (Normal) ve ≤ 40 sn (her ağız), min-spec Android'de ölçülür | 02 §6 · AC-02-13 | S2 | M | B13-01, B13-14, EAS build (sahip) |
| 152 | AC-02-15 | `highestCringeEvent` yalnızca ≥ 8 delta'lı bir Cringe olayı varsa yazılır; yoksa `undefined`, yeni hayatta hiçbir ceza yok | 02 §6 · AC-02-15 | S2 | S | B13-01, B13-14 |
| 153 | AC-02-16 | `offer:physio` yalnızca `healthCritical && age ≥ 28 && !physioUsed` iken, ömürde ≤ 1, `deathFlow`'da hiç; kabulde Sağlık +15 ve o yıl hazard zarı … | 02 §6 · AC-02-16 | S2 | M | B13-01, B13-14 |
| 154 | AC-02-17 | *(v1.1 metin)* Keyif < 25 → `lowJoy`; lowJoy açıkken gün kartı koç çıktısında ve atlama özetinde roast 0 (D-064'ün tek istisnası); her 3 gösterilen … | 02 §6 · AC-02-17 | S2 | M | B13-01, B13-14 |
| 155 | AC-02-18 | Ego/Cringe/Anne eşik geçiş olayları her geçişte tam 1 kez; anne öldükten sonra `momPressure` `null` kalır ve HUD'da gizlenir | 02 §6 · AC-02-18 | S2 | S | B13-01, B13-14 |
| 156 | AC-02-20 | Stres > 70 → Sağlık −2/yıl, > 85 → −4/yıl `applyGap` ile `gap/365` oranında uygulanır (doğum günü arası toplam −2 / −4, ±%1); Stres sayı olarak … | 02 §6 · AC-02-20 | S2 | M | B13-01, B13-14 |
| 157 | AC-02-23 | `DecadeReview` şeması kimlik alanı kabul etmez (tsc + zod); `kondisyonPoints` doc 05 deposuna yazılır | 02 §6 · AC-02-23 | S2 | S | B13-01, B13-14, B13-04 |
| 158 | AC-02-27 | `LifeRecord` ve `deathFlowStep` ekran çiziminden önce tek transaction'da yazılır; kill-restart testi aynı adımdan devam eder (iOS sim + Android emu) | 02 §6 · AC-02-27 | S2 | M | B13-01, B13-14 |
| 159 | AC-02-28 | Roast Raporu sayı satırları `fontScale` 2,0'da kesilmez; ICU gruplama iki platformda locale'e uygun ("1.204" / "1,204") | 02 §6 · AC-02-28 | S2 | L | B13-01, B13-14 |
| 160 | AC-02-42 | Tarih render'ı ICU `date` ile iki locale golden ("Salı, 3 Mart 2026" / "Tuesday, March 3, 2026"), iki platformda, locale verisi eksik cihazda gömülü … | 02 §6 · AC-02-42 | S2 | L | B13-01, B13-14, EAS build (sahip) |
| 161 | AC-03-08 | Keyif < 25 iken `roast:true` koç satırı render edilmez; `lift`/`plain` kalır. | 03 §6 · AC-03-08 | S2 | S | B13-04, B13-05 |
| 162 | AC-03-16 | ANNE ARIYOR: `momPressure` ≥ 75 kenar tetiği, ertesi takvim günü, cooldown 40 gün, hayat başına ≤ 6, her çağrıda ≥ 1 düşürücü seçenek. | 03 §6 · AC-03-16 | S2 | M | B13-04, B13-05 |
| 163 | AC-03-17 | Günün Günü: aynı `localDay`+locale+contentHash için 100 cihaz simülasyonunda aynı olay ve aynı seçenek → aynı sonuç; günde ≤ 1; tarih … | 03 §6 · AC-03-17 | S2 | M | B13-04, B13-05, EAS build (sahip) |
| 164 | AC-04-04 | 9 eğitim yolu `calendarDay` süreleriyle; bırakma cezasız, `dropout:{id}` bayrağı + `mom.okulu_birakti` anısı yazılır | 04 §6 · AC-04-04 | S2 | S | B13-02 |
| 165 | AC-04-05 | 24 kariyer veri dosyası: her biri 4–6 basamak, kademe eşlemesi, `minDays`, ≥ 8 kanca id'si (MVP'de 6 kariyer tam, 18 iskelet ≥ 2 kanca) | 04 §6 · AC-04-05 | S2 | S | B13-02 |
| 166 | AC-04-06 | `promotionEligible()` bekleme + stat kapısı + performans/`bossWin`; 2 ardışık başarısızlıkta performans +0,1 pity | 04 §6 · AC-04-06 | S2 | M | B13-02 |
| 167 | AC-04-07 | `{mem:R:T:*}` içeren metin, `pre.npc[R].memoryHas` içinde `T` olmadan derlenmez | 04 §6 · AC-04-07 | S2 | S | B13-02 |
| 168 | AC-04-08 | `memories` NPC başına ≤ 24; pinned etiketler (08 listesi) düşmez; ölü NPC'ye yazım sessizce düşer + lint uyarısı | 04 §6 · AC-04-08 | S2 | M | B13-02 |
| 169 | AC-04-09 | `unlockMeta()` yalnızca `metaLogRef`'li kayıt üretir; NPC başına hayatta ≤ 2; yeni hayatta ilk balon değiştirilir, bütçe artmaz; Fazla Bagaj kanalı … | 04 §6 · AC-04-09 | S2 | S | B13-02 |
| 170 | AC-04-10 | Meta balonuna uzun basınca Defter kaydı (hayat no + yıl + olay) açılır; kayıt yoksa balon meta değildir | 04 §6 · AC-04-10 | S2 | M | B13-02 |
| 171 | AC-04-11 | 8 Tanıdık Yüz'ün adları locale başına sabit; isim üreteci bu adları ve oyuncu adı "Yağmur/Sam/Barış/Jordan"ı üretmez | 04 §6 · AC-04-11 | S2 | S | B13-02 |
| 172 | AC-04-12 | §2.11 ses yüklemleri 08 lint'inde; negatif test seti (Anne 9 kelime, Barış küçük harf, Yağmur 4 kelime, Pamuk 2 kelime, Dayı "faiz", Taksici "abi" … | 04 §6 · AC-04-12 | S2 | S | B13-02 |
| 173 | AC-04-13 | NPC ölümü: 01 sessizlik protokolü tetiklenir, o NPC'nin tüm olayları havuzdan düşer, `momPressure` anne ölümünde `null` | 04 §6 · AC-04-13 | S2 | S | B13-02 |
| 174 | AC-04-15 | Flört zinciri f1/f2/f3 her partner için aynı; f1 göz teması mini oyunu iddia dışı; f2 iddia adayı; Yağmur her hayatta ilk f1 | 04 §6 · AC-04-15 | S2 | M | B13-02 |
| 175 | AC-04-16 | Partner/eş/çocuk adları cinsiyetsiz havuzdan; EN `he/she` ve TR `kız/erkek arkadaş` lint BLOK; hamile olan yazılmaz | 04 §6 · AC-04-16 | S2 | S | B13-02 |
| 176 | AC-04-17 | Evlilik: `relationship.kind='married'`, Anne Baskısı −30, düğün takısı Para, kira payı ×0,6; boşanma: Para −2..−6, kedi oyuncuda, sessizlik | 04 §6 · AC-04-17 | S2 | S | B13-02 |
| 177 | AC-04-18 | Çocuk NPC tipi `alive` alanı taşımaz; çocuk olaylarında `intent.target='npc'` BLOK; `children ≤ 3` | 04 §6 · AC-04-18 | S2 | S | B13-02 |
| 178 | AC-04-19 | `family.unread` monoton; HUD'da her zaman görünür; ikon rozeti ve bildirim metninde sayaç yok; anne ölünce artış devam | 04 §6 · AC-04-19 | S2 | S | B13-02, B13-13 |
| 179 | AC-04-20 | Aile Grubu kartı: 3. seçenek daima "Görüldü, cevap yok"; etkisi +2 Anne Baskısı, `leftOnReadCount` +1, 7 gün patlama; Teşhis sayacı 05'e | 04 §6 · AC-04-20 | S2 | S | B13-02 |
| 180 | AC-04-21 | Barınma geçişleri doc 02 kademeleriyle birebir; ev sahibi zinciri mood 0→1→2→0; zam mutlak Para, yüzde metinde yok | 04 §6 · AC-04-21 | S2 | S | B13-02 |
| 181 | AC-04-22 | Satın alma olayı iddia adayı; near-miss `pendingBonus` gelecek yıl +0,1 uygulanır (gerçekten) | 04 §6 · AC-04-22 | S2 | M | B13-02 |
| 182 | AC-04-23 | Araç/evcil hayvan/arsa `AssetId` listesi; marka/model/plaka sözcükleri lint BLOK; satış değeri mutlak düşer | 04 §6 · AC-04-23 | S2 | S | B13-02, B13-16 |
| 183 | AC-04-24 | Kefalet: Barış olayı → zarf 730–2.190 gün → 3–8 Birim; `kefil_oldun` pinned; ödeme ya da affinity −20 | 04 §6 · AC-04-24 | S2 | M | B13-02 |
| 184 | AC-04-25 | Kedi: K-01 ile gün 1, yoksa "kapıda kedi" (Keyif ≤ 60, ≤ 1/hayat); gider ayın 10'u; ölüm 12–18 yıl tek gün, sessizlik; ikinci kedi Tanıdık Yüz değil | 04 §6 · AC-04-25 | S2 | M | B13-02 |
| 185 | AC-04-28 | "Hayat Koçu" kariyeri: `careerRival` etiketi 01 havuzunu açar; basamak başına ≤ 1 rakip satırı; "İnancını yitirdi" basamağında roast kapalı; itiraf … | 04 §6 · AC-04-28 | S2 | S | B13-02 |
| 186 | AC-04-29 | Emekli = durum (60–65, aileye göre), `employment=undefined`, `retired` bayrağı; gelir doc 02 | 04 §6 · AC-04-29 | S2 | S | B13-02 |
| 187 | AC-04-30 | Platform: `READ_CONTACTS/CALL_PHONE` manifest'te yok; `NSContactsUsageDescription` yok; ANNE ARIYOR yalnızca uygulama içi, sistem arama UI'ına … | 04 §6 · AC-04-30 | S2 | S | B13-02 |
| 188 | AC-05-21 | Fazla Bagaj: `highestCringeEvent` yeni hayata etiket olarak biner, Müşteri Dosyası'nda görünür, 2–8. yılda 1 callback olayı tetiklenir … | 05 §6 · AC-05-21 | S2 | M | B13-13, B13-14 |
| 189 | AC-05-22 | 30 Teşhis (3 otomatik, 5 gizli) tanımlı; ilk hayatta 3 otomatik verilir; nadirlik bantları harness'ta doğrulanır; kilitli kart ipucu + çubuk … | 05 §6 · AC-05-22 | S2 | M | B13-13, B13-14, B13-05 |
| 190 | AC-05-23 | Teşhis adı yasak sözlüğü (klinik/kimlik/sıfat) lint'te; örnek negatif test ("Kronik Depresif") bloklanır | 05 §6 · AC-05-23 | S2 | S | B13-13, B13-14 |
| 191 | AC-05-24 | Teşhis veriliş juice'u D-063/D-059 sürelerinde; reduced-motion'da fade; oturumda 4. Teşhis'ten itibaren toast | 05 §6 · AC-05-24 | S2 | M | B13-13, B13-14 |
| 192 | AC-05-25 | Sözlük: Tercüme ile giriş, tekrar girişte sayaç; sekme ilerlemesi gerçek havuzdan; Mottolar ızgarası 36 hücre | 05 §6 · AC-05-25 | S2 | S | B13-13, B13-14 |
| 193 | AC-05-26 | Onyıl Karnesi lift puanı `fitness.points`'e gerçekten yazılır ve tik-up görünür; şemada kimlik alanı yok | 05 §6 · AC-05-26 | S2 | S | B13-13, B13-14, B13-04 |
| 194 | AC-07-17 | Reduced motion açıkken tüm spring'ler fade'e düşer, konfeti statik, süreler (300/400 ms tavanları) değişmez; damga yine iner. | 07 §6 · AC-07-17 | S2 | M | B13-01, B13-17 |
| 195 | AC-07-31 | Haptik bütçesi: 10.000 hayat harness'ında herhangi bir 60 sn penceresinde ≤ 20 haptik; Heavy yalnızca `stamp.wrong` ve `death.ekg` (mezar taşı); ANNE … | 07 §6 · AC-07-31 | S2 | M | B13-01, B13-17, B13-05 |
| 196 | AC-07-36 | NPC balonu `.npc` solda (boundingBox.x ≤ 24 px), avatar `.av` 34 ± 2 px daire + 1 baş harf, ad etiketi `.bub small` büyük harf; oyuncu balonu `.me` … | 07 §6 · AC-07-36 | S2 | M | B13-01, B13-17 |
| 197 | AC-07-45 | `EyeContactMiniGame`: `.mini .needle` 1.050 ± 50 ms'de uçtan uca; yeşil bölge %42–58; karar bölgesinde tek `.btn.danger` "ŞİMDİ!"/"NOW!"; dokununca … | 07 §6 · AC-07-45 | S2 | L | B13-01, B13-17, B13-13 |
| 198 | AC-07-46 | `DiagnosisSticker`: `.sticker` lime zemin, `small` "TEŞHİS"/"DIAGNOSIS", rotate(−3deg); gelişinde `#phone.shake-hard` + `.flash.go` (lime) + … | 07 §6 · AC-07-46 | S2 | L | B13-01, B13-17, B13-13 |
| 199 | AC-07-47 | `LegendaryFrame`: `.card.legend` `border-color` = gold token, `.label` "EFSANE OLAY"/"LEGENDARY EVENT"; gelişinde `.confetti i` = 60 (reduced-motion … | 07 §6 · AC-07-47 | S2 | M | B13-01, B13-17, B13-09 |
| 200 | AC-07-48 | `BigStampOverlay`: `.bigstamp span` yalnızca HAKSIZ ÇIKTIM / İSABET (ve Roast adım 5) için; 1.700 ± 100 ms sonra DOM'dan kalkar; `pointer-events … | 07 §6 · AC-07-48 | S2 | L | B13-01, B13-17 |
| 201 | AC-07-49 | Sarsıntı seviyeleri: `#phone.shake` 420 ± 30 ms (wrong değil: called, Teşhis değil, efsane, AgeUp), `#phone.shake-hard` 600 ± 30 ms (wrong, Teşhis … | 07 §6 · AC-07-49 | S2 | M | B13-01, B13-17 |
| 202 | AC-07-50 | Flaş renkleri: `.flash.go` `background-color` wrong/bigBad'de flashRed, called/Teşhis'te flashLime, efsane'de flashGold; 500 ± 50 ms'de opacity 0 … | 07 §6 · AC-07-50 | S2 | M | B13-01, B13-17 |
| 203 | AC-07-51 | Uçan sayılar ve daktilo: her `.result` deltası için bir `.float.up/.down` (metin `/^[+−]\d/`), 1.200 ms içinde kaldırılır, `.float` ∩ viewport ≠ ∅ … | 07 §6 · AC-07-51 | S2 | M | B13-01, B13-17 |
| 204 | AC-07-52 | Ölüm dizisi: `.death` ≥ 2.000 ms (atlanamaz), `.ecg path` çizilir (`stroke-dashoffset` 1200 → 0), `.grave` yükselir ve `.grave .n` = karakter adı … | 07 §6 · AC-07-52 | S2 | M | B13-01, B13-17, B13-09 |
| 205 | AC-08-10 | NPC kapsamı: `DL-01..10` aktif; `speaker` enum dışı, ses imzası ihlali (Anne > 8 kelime/`?` yok, Yağmur > 3 kelime, Pamuk > 1 token), NPC balonunda … | 08 §6 · AC-08-10 | S2 | M | B13-12 |
| 206 | AC-08-12 | lowKeyif/`despair` protokolünde harness'ta `isRoast` gösterimi 0, çıkış seçeneği her gösterilen günde ≥ 1, L-122 hayat başına ≤ 1, juice tetikleri … | 08 §6 · AC-08-12 | S2 | M | B13-12, B13-05 |
| 207 | AC-08-18 | `RL-31`: hassas takvim günleri listesindeki tarihlerde "Günün Günü" seed olayı nötr havuzdan; hiçbir koç/NPC satırı takvim tarihini (gün + ay) … | 08 §6 · AC-08-18 | S2 | M | B13-12 |
| 208 | DEMO-S2 | Sprint demosu: web export → Claude artifact + Playwright TR/EN ekran görüntüleri + "Bu sprintte eklenenler" | Sahip kuralı; SPRINTS §2.3, §5 | S2 | S | S2 kapsamı |
| 209 | AC-01-02 | MVP havuzu ≥ 700 koç satırı + 80 iddia + 108 motto + 40 bildirim + 20 welcome-back, locale başına; her ikisi de `approved`. | 01 §6 · AC-01-02 | S3 | L | B13-12, B13-13 |
| 210 | AC-01-10 | "Gerçek hayatta yardım" satırı tetikte hayat başına 1 kez, 2 balon, şakasız; ekran linki Ayarlar'da kalıcı. | 01 §6 · AC-01-10 | S3 | S | B13-12 |
| 211 | AC-01-19 | Bildirim gövdesi ≤ 110 karakter, saat yok, emoji yok, karakter durumu geçen her satırda "oyunda/in-game" işareti; lapsed merdiveni D30'da biter. | 01 §6 · AC-01-19 | S3 | S | B13-12 |
| 212 | AC-02-36 | Oturum simülasyonu: 20 gösterilen günlük pencerede 1–3 doğum günü; oturum sonu işareti gün kartı ortasında değil; `sessionDayIndex` save/load'da … | 02 §6 · AC-02-36 | S3 | M | B13-01, B13-14 |
| 213 | AC-03-06 | Oturum simülasyonunda (20 ± 5 gün) yoğunluk eğrisi: son %15'te medyan intensity ≤ 0,5 ve en az bir zarf `opened` olur. | 03 §6 · AC-03-06 | S3 | M | B13-04, B13-05 |
| 214 | AC-05-01 | Streak yalnızca günün ilk kararında artar; uygulama açılışı, welcome-back kartı ve Hızlı Yaşa'da otomatik çözülen beat'ler artırmaz | 05 §6 · AC-05-01 | S3 | M | B13-13, B13-14 |
| 215 | AC-05-02 | `days` hiçbir durum geçişinde azalmaz; ekranda hiçbir zaman "0" ya da "kaybettin" görünmez | 05 §6 · AC-05-02 | S3 | M | B13-13, B13-14 |
| 216 | AC-05-03 | Kaçırılan gün 00:00'da otomatik İzin'le köprülenir (2 slot, 7 günde 1 yenilenir); İzin hiçbir mağaza/reklam yüzeyinde yoktur | 05 §6 · AC-05-03 | S3 | S | B13-13, B13-14, B13-09, B13-18 |
| 217 | AC-05-04 | Telafi: 48 sa içinde 2 ardışık Mola `run`'ı geri getirir; 30 günde 1; ücretsiz | 05 §6 · AC-05-04 | S3 | S | B13-13, B13-14 |
| 218 | AC-05-05 | Hafta sonu muafiyeti varsayılan açık, Ayarlar'dan kapanır; kapalıyken Cmt/Paz normal gün | 05 §6 · AC-05-05 | S3 | M | B13-13, B13-14 |
| 219 | AC-05-06 | 8 kilometre taşı doğru günde tetiklenir, her biri 1 kozmetik + 1 koç satırı verir; 66'da Lally kartı render ≤ 400 ms | 05 §6 · AC-05-06 | S3 | M | B13-13, B13-14 |
| 220 | AC-05-07 | Koç Görevleri aynı gün/cihaz/içerik sürümünde deterministik; 1'i absürt; 14 gün tekrar yok; ödül yalnızca Kondisyon puanı | 05 §6 · AC-05-07 | S3 | M | B13-13, B13-14, B13-03, EAS build (sahip) |
| 221 | AC-05-08 | Görev havuzunda gerçek dünya fiili içeren satır lint'i geçemez (örnek negatif test: "bir bardak su iç") | 05 §6 · AC-05-08 | S3 | S | B13-13, B13-14 |
| 222 | AC-05-09 | Kamp seed'i `hash(isoWeek+locale+contentHash)`; Pazartesi 00:00 yerel açılır; aynı hafta iki cihazda aynı başlangıç ve aynı 40 bot | 05 §6 · AC-05-09 | S3 | L | B13-13, B13-14, EAS build (sahip) |
| 223 | AC-05-10 | 40 hayali kohort cihazda headless üretilir; orta Android'de ilk 10 bot ≤ 1,5 sn, toplam ≤ 3 sn; UI "N/40 hazır" gerçek sayıyı gösterir | 05 §6 · AC-05-10 | S3 | M | B13-13, B13-14, EAS build (sahip) |
| 224 | AC-05-11 | Kamp sıralaması, satır adları ve kıyas kartı "hayali/fictional" etiketini taşır; eksikse lint release'i bloklar | 05 §6 · AC-05-11 | S3 | S | B13-13, B13-14 |
| 225 | AC-05-12 | Bildirim planı: günde ≤ 1, kayan 7 günde ≤ 5, 22:30–09:00 ve `quietDays` ihlali 0, planlı ≤ 12, ufuk ≤ 30 gün; her RESUME/SUSPEND'de cancelAll + … | 05 §6 · AC-05-12 | S3 | M | B13-13, B13-14, EAS build (sahip) |
| 226 | AC-05-13 | Streak-at-risk bildirimi yalnızca `freezes=0 ∧ bugün Mola yok ∧ muafiyet yok` koşulunda planlanır | 05 §6 · AC-05-13 | S3 | S | B13-13, B13-14 |
| 227 | AC-05-14 | Soft-ask yalnızca `ask-consent` efektiyle (ilk "Bugünlük yeter" ∧ ≥ 8 dk ∧ ilk karne); Android'de ek olarak `sessionCount ≥ 2`; sistem reddi sonrası … | 05 §6 · AC-05-14 | S3 | M | B13-13, B13-14, B13-06 |
| 228 | AC-05-15 | Her bildirim başlığı NPC adı ya da "Motto"; gövde ≤ 110 karakter, emoji yok, yasak sözlük yok; her karakter mesajı `pre` koşulunu sağlamadan … | 05 §6 · AC-05-15 | S3 | S | B13-13, B13-14 |
| 229 | AC-05-16 | `lifeEnded` → tüm planlı bildirimler iptal; yeni hayatın ilk oturumundan önce bildirim yok | 05 §6 · AC-05-16 | S3 | M | B13-13, B13-14, EAS build (sahip) |
| 230 | AC-05-17 | Sakatlık Raporu: gün bazlı tablo; 3–6 kart; Atla her kartta görünür; rapor ≤ 40 sn (otomatik akış yok, kart sayısıyla sınır); +1 İzin (tavan 2); 7 … | 05 §6 · AC-05-17 | S3 | M | B13-13, B13-14 |
| 231 | AC-05-18 | 14+ gün yoklukta son kart "büyük bekleyen karar"; rafa konur, çözülmez; ilk gün kartı o karardır | 05 §6 · AC-05-18 | S3 | M | B13-13, B13-14 |
| 232 | AC-05-19 | Her ölümde `unlocks.length ≥ 1`; eşik geçilmediyse Yedek Kulübesi kozmetiği deterministik sırayla; koç satırı "yedek kulübesi" sözcüğünü içerir | 05 §6 · AC-05-19 | S3 | M | B13-13, B13-14, B13-03 |
| 233 | AC-05-20 | Kondisyon güç testi: her perk için harness farkı gürültü bandında; başarısız perk CI'da reddedilir | 05 §6 · AC-05-20 | S3 | M | B13-13, B13-14, B13-05 |
| 234 | AC-05-27 | HYT/KMP kodları kişisel veri içermez (yalnızca seed + sürüm + crc), içe aktarma aynı olay çekilişini üretir; sürüm uyumsuzluğunda uyarı | 05 §6 · AC-05-27 | S3 | S | B13-13, B13-14 |
| 235 | AC-05-28 | Playwright web export'ta port'lar no-op iken Mola, Kamp, Sakatlık Raporu, ölüm→açılım akışları hatasız koşar (iki platform parite tabanı) | 05 §6 · AC-05-28 | S3 | L | B13-13, B13-14 |
| 236 | AC-07-11 | Sekme çubuğu açılışta yalnızca Hayat aktif; Defter ilk fişle, Karne ilk karneyle, Sözlük ilk Tercüme ile (ya da 3. evrakta), Kamp 2. oturumda açılır … | 07 §6 · AC-07-11 | S3 | M | B13-01, B13-17 |
| 237 | AC-07-12 | Bildirim soft-ask'ı ilk oturumun ilk 60 sn'sinde ve oturum < 8 dk ise asla görünmez; görünürse iki buton eşit boyutta ve hiçbiri önceden vurgulu … | 07 §6 · AC-07-12 | S3 | M | B13-01, B13-17 |
| 238 | AC-07-13 | Ses ayarı kartı ilk "Bugünlük yeter"den sonra bir kez görünür; Normal varsayılan ama görsel vurgu yok; Ayarlar'da üç kademe her zaman … | 07 §6 · AC-07-13 | S3 | M | B13-01, B13-17 |
| 239 | AC-07-14 | Dil TR↔EN anlık değişir; yeniden başlatma yok; HUD/sekme/CTA/`.dateline` tarih biçimi ("Salı, 3 Mart 2026" ↔ "Tuesday, March 3, 2026") yeni dilde … | 07 §6 · AC-07-14 | S3 | M | B13-01, B13-17 |
| 240 | AC-07-15 | Tüm sabit UI butonları TR ≤ 18 / EN ≤ 16 karakter; olay seçenekleri 328 dp'de ≤ 2 satır; hiçbir metin kırpılmaz (`text-overflow: ellipsis` yok). | 07 §6 · AC-07-15 | S3 | M | B13-01, B13-17 |
| 241 | AC-07-16 | Token çiftleri WCAG: text/bg ≥ 4,5; danger ve stamp yalnızca büyük metin/ikonda ≥ 3; axe-core "color-contrast" ihlali 0. | 07 §6 · AC-07-16 | S3 | M | B13-01, B13-17 |
| 242 | AC-07-21 | Paylaşım kartı 1080×1920 ve 1080×1080 render edilir; içinde "YILIN MOTTOSU"/"MOTTO OF THE YEAR" etiketi, 6 not, motto, seed kodu `HYT-[A-Z0-9]{4}` … | 07 §6 · AC-07-21 | S3 | M | B13-01, B13-17, B13-18, EAS build (sahip) |
| 243 | AC-07-22 | Kamp ekranındaki her kohort satırı ve kıyas kartı "hayali/fictional" etiketini içerir; geri sayım `source: 'calendar'` ve gerçek Pazartesi 00:00 … | 07 §6 · AC-07-22 | S3 | M | B13-01, B13-17 |
| 244 | AC-07-23 | Mola yüzeyinde kırmızı renk yok; "kaybettin/bozuldu/sıfırlandı/lost/broken/reset" sözcükleri yok; satın alma düğmesi yok; duraklatılmış durum gri. | 07 §6 · AC-07-23 | S3 | M | B13-01, B13-17 |
| 245 | AC-07-28 | Çevrimdışı modda (uçak modu) FTUE'den ölüme kadar hiçbir hata metni/boş durum farkı yok; reklam butonları görünmez. | 07 §6 · AC-07-28 | S3 | M | B13-01, B13-17, B13-09 |
| 246 | AC-09-17 | Ayarlar › Dil değişimi ≤ 300 ms'de tüm ekranı yeniler; oyuncu adı sabit, 8 NPC adı eşlenir; Kamp kartı yeniden hesaplanır; `sys.locale_changed` tek … | 09 §6 · AC-09-17 | S3 | M | B13-04, B13-11, EAS build (sahip) |
| 247 | AC-10-19 | Bildirim ritüeli her RESUME/SUSPEND'de: `cancelAll` → tavanlar (≤ 1/gün, ≤ 5/hafta, 22:30–09:00 yok) → ≤ 12 planlı; Android `notBeforeLocal ≤ 21:15`. … | 10 §6 · AC-10-19 | S3 | M | B13-03, B13-15, EAS build (sahip) |
| 248 | AC-10-26 | ATT ön-ekranı ve bildirim soft-ask'ı ilk 60 sn'de ve `sessionCount < 2` iken render edilmez. | 10 §6 · AC-10-26 | S3 | M | B13-03, B13-15, B13-13 |
| 249 | AC-11-18 | Satır puanı: koç balonuna uzun basış iki ikon gösterir, metin/emoji/koç cevabı yok; `line_rating` loglanır; hiçbir satır seçimi oyuncu puanına göre … | 11 §6 · AC-11-18 | S3 | S | B13-10, B13-06 |
| 250 | DEMO-S3 | Sprint demosu: web export → Claude artifact + Playwright TR/EN ekran görüntüleri + "Bu sprintte eklenenler" | Sahip kuralı; SPRINTS §2.4, §5 | S3 | S | S3 kapsamı |
| 251 | AC-01-25 | `showcase` havuzu ≥ 30 satır/locale; mağaza ekran görüntüleri ve metadata yalnızca bu havuzdan. | 01 §6 · AC-01-25 | S4 | S | B13-12, B13-18 |
| 252 | AC-03-25 | `phase ∈ {dead, roast}` ve near-miss günlerinde `ad-opportunity` efekti üretilmez. | 03 §6 · AC-03-25 | S4 | M | B13-04, B13-05, B13-09 |
| 253 | AC-06-05 | H-06-3: Torpil açık/kapalı 10.000 hayat sonuç dağılımları istatistiksel olarak aynı. | 06 §6 · AC-06-05 | S4 | M | B13-06, B13-09 |
| 254 | AC-06-06 | Torpil kartı yalnızca o build'de açılan `features[]`'i listeler; MVP build'inde "Kader"/"iki kişilik" satırı yok; `showcase` havuzu dışı vitrin metni … | 06 §6 · AC-06-06 | S4 | S | B13-06, B13-09 |
| 255 | AC-06-07 | Karanlık desen checklist'i (§6.4) 14/14 "yok"; [Şimdi değil]/[Kalsın]/[Reddet] butonları birincil butonla aynı boyut ve kontrast; mağazada geri … | 06 §6 · AC-06-07 | S4 | M | B13-06, B13-09, B13-18 |
| 256 | AC-06-08 | Interstitial yalnızca `sessionEnd`/`halfTime`'da; `sessionCount ≤ 2` → 0; oturumda ≤ 1; ≥ 5 dk ara; ölüm akışında ve ölümden sonraki ilk oturum … | 06 §6 · AC-06-08 | S4 | M | B13-06, B13-09 |
| 257 | AC-06-09 | Rewarded tavanları: günde ≤ 6, 120 sn cooldown, Ek Antrenman yılda 1, Taktik günde 2, Forma 2 yıl ara, Fizyoterapi ömürde 1; saat manipülasyonu … | 06 §6 · AC-06-09 | S4 | S | B13-06, B13-09 |
| 258 | AC-06-10 | Ödül yalnızca `EARNED_REWARD`'da verilir; `closed`/`no_fill`/`error`'da verilmez; no-fill'de tavan harcanmaz; ödül persist edildikten sonra uygulama … | 06 §6 · AC-06-10 | S4 | M | B13-06, B13-09 |
| 259 | AC-06-11 | `playClockSinceInstall < 10 dk` iken hiçbir `RewardedOffer`/`AdSlot` monte edilmez; 10 §2.4.9'daki `sessionClock` bu alanla değiştirilmiştir. | 06 §6 · AC-06-11 | S4 | M | B13-06, B13-09 |
| 260 | AC-06-12 | Ayarlar › "Son reklamı bildir" son 5 reklamın `responseInfo` kimliğini e-posta şablonuna koyar; Apple inceleme notunda özellik belirtilir. | 06 §6 · AC-06-12 | S4 | M | B13-06, B13-09, EAS build (sahip) |
| 261 | AC-06-13 | Rıza akışı: TR'de aydınlatma ve açık rıza ayrı kartlar, anahtarlar kapalı, [Reddet] eşit; rıza öncesi reklam/analitik SDK import edilmez … | 06 §6 · AC-06-13 | S4 | M | B13-06, B13-09, EAS build (sahip) |
| 262 | AC-06-14 | EEA debug coğrafyasında UMP formu ATT'den önce gelir; `canRequestAds` false iken `initialize` çağrılmaz; iOS'ta ATT ön-ekranı düz dil, sistem … | 06 §6 · AC-06-14 | S4 | M | B13-06, B13-09, EAS build (sahip) |
| 263 | AC-06-15 | AdMob `maxAdContentRating='T'`, `childDirected=false`, `underAgeOfConsent=false` release config'inde; `ST-09` CI'da; A/B yalnızca uzak-konfigle … | 06 §6 · AC-06-15 | S4 | M | B13-06, B13-09 |
| 264 | AC-06-16 | Bilet: aynı `transactionId`/`purchaseToken` ile 2. grant yok (H-06-7); bilet Fizyoterapi teklifinde görünmez; bilet tavanı açmaz. | 06 §6 · AC-06-16 | S4 | M | B13-06, B13-09 |
| 265 | AC-06-17 | Android `PENDING` satın almada entitlement verilmez, toast gösterilir, onaylanınca otomatik açılır; iOS "Ask to Buy" aynı akış. | 06 §6 · AC-06-17 | S4 | S | B13-06, B13-09 |
| 266 | AC-06-18 | İade: RC iade sinyali → entitlement kapanır, tek koç satırı bir kez, arşiv defterleri silinmez (gizlenir), bilet bakiyesi negatif olmaz. | 06 §6 · AC-06-18 | S4 | S | B13-06, B13-09 |
| 267 | AC-06-20 | Fiyat hiçbir TS/JSON kaynakta yazılı değil; tüm ekranlar `priceString`; iki mağazada ₺ fiyat eşit (manuel kontrol listesi). | 06 §6 · AC-06-20 | S4 | S | B13-06, B13-09, B13-18 |
| 268 | AC-06-21 | Lint: mağaza/teklif/rıza/bildirim metinlerinde "rüşvet/bribe", "bahis/bet", "indirim/discount/%", "son/last X", "sınırlı süre/limited time", "en … | 06 §6 · AC-06-21 | S4 | S | B13-06, B13-09, B13-13, B13-18 |
| 269 | AC-06-22 | Monetizasyon event'leri allowlist'te; props'ta serbest metin/kimlik yok; analitik rızası yokken yalnızca yerel rapora yazılır. | 06 §6 · AC-06-22 | S4 | S | B13-06, B13-09 |
| 270 | AC-06-23 | 2. ölüm Torpil teklifi: yalnızca yeni hayatın ilk kartından sonra, ömür boyu bir kez; ölüm/Roast/Yeni Müşteri ekranlarında mağaza girişi … | 06 §6 · AC-06-23 | S4 | M | B13-06, B13-09, B13-18 |
| 271 | AC-06-24 | Devre Arası ve "Bugünlük yeter" akışında interstitial öncesi koç duyuru satırı ≥ 1,2 sn görünür; reklam bir karar kartının üstüne asla binmez (zaman … | 06 §6 · AC-06-24 | S4 | M | B13-06, B13-09 |
| 272 | AC-07-18 | Ölüm → Yeni Müşteri akışında `AdSlot`, `RewardedOffer`, Mağaza girişi ve geri sayım yok; interstitial yalnızca "Bugünlük yeter"/Devre Arası'nda ve 3. … | 07 §6 · AC-07-18 | S4 | M | B13-01, B13-17, B13-09 |
| 273 | AC-07-29 | Mağaza: fiyat yalnızca mağaza API'sinden, "Geri Yükle" görünür, önceden seçili seçenek ve geri sayım yok; satın alma akışında roast satırı yok. | 07 §6 · AC-07-29 | S4 | M | B13-01, B13-17, B13-18 |
| 274 | AC-07-32 | "Gerçek hayatta yardım" ekranı Daha menüsünden her zaman erişilir; koç balonu, acid-lime, Fraunces, haptik ve SFX içermez; düşük Keyif … | 07 §6 · AC-07-32 | S4 | M | B13-01, B13-17 |
| 275 | AC-08-05 | `exemptable:false` kurallar hiçbir `lintExemptions` girdisini kabul etmez; `exemptable:true` kuralda `author === reviewer`, süresi dolmuş veya PR … | 08 §6 · AC-08-05 | S4 | S | B13-12 |
| 276 | AC-08-06 | `--release`: `review.status !== 'approved'`, `reviewedRev < rev`, Tier A'da `secondReviewer` boş, `persona:kader\ | 08 §6 · AC-08-06 | S4 | S | B13-12 |
| 277 | AC-08-07 | `release-signoff.json` iki farklı rolde imza, rapor SHA'sı ve `openWarnings` eşleşmesi olmadan `--release` çıkış kodu 1 (RV-06). | 08 §6 · AC-08-07 | S4 | S | B13-12 |
| 278 | AC-08-08 | Kotalar `QT-01..10` pool düzeyinde `--release`'te `block`, PR'da `warn`; `substance:*` etiketsiz alkol sözlüğü `RL-10` ile, etiketli ama kalıcı … | 08 §6 · AC-08-08 | S4 | S | B13-12 |
| 279 | AC-08-11 | "Gerçek hayatta yardım" ekranı: içerik §2.5 ile birebir, çevrimdışı, bölge sıralaması konum izni istemez, her hat `tel:`/`sms:` + web yedeği, ekranda … | 08 §6 · AC-08-11 | S4 | M | B13-12 |
| 280 | AC-08-13 | Yaş derecesi: §2.6 cevap anahtarıyla doldurulan anketler Apple 16+ ve IARC PEGI 16/ESRB T üretir; AdMob `T`, `childDirected=false` … | 08 §6 · AC-08-13 | S4 | M | B13-12, B13-06, B13-09 |
| 281 | AC-08-14 | Mağaza/kreatif: `showcase:true` dışı satır metadata'da 0; `death\ | 08 §6 · AC-08-14 | S4 | S | B13-12 |
| 282 | AC-08-15 | Hukuki belgeler: Gizlilik, Aydınlatma, Açık Rıza (ayrı), Koşullar, 16+ metni, kurgu feragatı, Lisanslar TR+EN sürümlü ve yayında; rıza kartı … | 08 §6 · AC-08-15 | S4 | M | B13-12, B13-06 |
| 283 | AC-08-16 | Nötr yaş ekranı: doğum yılı saklanmaz, < 16 kapanış metni TR/EN sabit, koç ağzında değil; Declared Age Range / Age Signals sinyali varsa aynı kapı … | 08 §6 · AC-08-16 | S4 | M | B13-12, EAS build (sahip) |
| 284 | AC-08-20 | Karanlık tasarım: §2.7'nin 10 kalıbı için UI snapshot/Playwright testi veya şema-yokluğu kanıtı; "Hayır" düğmesi boyut/kontrast eşitliği ölçülür … | 08 §6 · AC-08-20 | S4 | M | B13-12, B13-04 |
| 285 | AC-08-21 | İnsan inceleme: her olay PR'ında 10 soruluk kontrol listesi şablonu doldurulmuş; Tier A çift onay; avukat örneklemesi oranları (%10 Tier A, %100 … | 08 §6 · AC-08-21 | S4 | M | B13-12, B13-18 |
| 286 | AC-08-22 | Çıktı biçimleri: `lint-report.json` şema-geçerli (`schemas/lint-report.schema.json`), SARIF 2.1.0 GitHub'a yüklenir ve PR satır içi görünür, konsol … | 08 §6 · AC-08-22 | S4 | S | B13-12, B13-04 |
| 287 | AC-10-11 | Soğuk başlangıç → ilk kart etkileşimli < 2 s (p75, Galaxy A15 / iPhone 12); hiçbir ağ çağrısı ilk karttan önce yapılmaz. | 10 §6 · AC-10-11 | S4 | S | B13-03, B13-15 |
| 288 | AC-10-20 | UMP → (iOS) ATT → `initialize()` sırası; rıza yoksa `noopAds`; `maxAdContentRating:'T'`, `tagForUnderAgeOfConsent:false` … | 10 §6 · AC-10-20 | S4 | S | B13-03, B13-15, B13-06 |
| 289 | AC-10-22 | §5.1 SDK veri akışı tablosu = Google Data Safety formu = Apple Privacy Nutrition beyanı (üç liste bire bir); SDK ekleme/yükseltme PR'ı tabloyu … | 10 §6 · AC-10-22 | S4 | S | B13-03, B13-15 |
| 290 | AC-10-25 | Sentry `beforeSend` olay metinlerini, isimleri ve serbest metni siler; `sendDefaultPii:false`; EU DSN. | 10 §6 · AC-10-25 | S4 | S | B13-03, B13-15 |
| 291 | AC-11-01 | Analytics hiçbir sink olmadan ve rıza reddedilmişken oyun tüm akışlarıyla (FTUE, ölüm, satın alma, paylaşım) çalışır; `track()` hataları UI'da … | 11 §6 · AC-11-01 | S4 | M | B13-10, B13-06, EAS build (sahip) |
| 292 | AC-11-02 | `AnalyticsEvent` allowlist'i 42 olaydan oluşur; union dışı olay adı derleme hatasıdır; hiçbir prop serbest metin taşımaz. | 11 §6 · AC-11-02 | S4 | S | B13-10, B13-06 |
| 293 | AC-11-03 | Rıza reddinde GA4/MMP/publisher SDK'sına sıfır ağ çağrısı (ağ proxy'siyle doğrulanır); reddetme olayı dışarı gitmez. | 11 §6 · AC-11-03 | S4 | S | B13-10, B13-06 |
| 294 | AC-11-04 | TR'de "Analitik paylaşımı" anahtarı KVKK açık rıza kartında ayrı, kapalı başlar; [Kaydet]/[Reddet] eşit boyut; Ayarlar'dan her an değişir. | 11 §6 · AC-11-04 | S4 | S | B13-10, B13-06 |
| 295 | AC-11-06 | Koçun Raporu ekranı §3.1 satırlarıyla, dışa aktarım `motto.report/1` şemasında, cihaz kimliği/isim/şehir adı/serbest metin içermez; "Raporu sil" … | 11 §6 · AC-11-06 | S4 | M | B13-10, B13-06, B13-04, EAS build (sahip) |
| 296 | AC-11-16 | Gün metrikleri (`shownDaysPerSession`, `daysPerMinute`, `speedMix`, `SD7`) GA4 ve yerel toplayıcıda aynı formülle hesaplanır; harness üretimiyle … | 11 §6 · AC-11-16 | S4 | M | B13-10, B13-06, B13-05 |
| 297 | AC-11-25 | Apple App Privacy ve Play Data safety formları `data-inventory.md`'den doldurulur; yeni SDK eklenen PR'da envanter güncellenmeden merge yok. | 11 §6 · AC-11-25 | S4 | S | B13-10, B13-06 |
| 298 | DEMO-S4 | Sprint demosu: web export → Claude artifact + Playwright TR/EN ekran görüntüleri + "Bu sprintte eklenenler" | Sahip kuralı; SPRINTS §2.5, §5 | S4 | S | S4 kapsamı |
| 299 | AC-01-18 | Kader havuzu (soft launch) aynı şemayı kullanır; "yukarı/upstairs", ahiret sözlüğü, genelleme, "rüşvet" 0 eşleşme; mağaza/ilk 60 sn'de Kader satırı … | 01 §6 · AC-01-18 | S5 | S | B13-12, B13-04, B13-18 |
| 300 | AC-01-22 | EN satırları Tier A punch-up'tan geçmiş, `reviewedRev == rev`; 5 anadil okuyucu testinde "çeviri kokusu" ≤ 1/20. | 01 §6 · AC-01-22 | S5 | L | B13-12 |
| 301 | AC-01-23 | Funny-check iki dilde ayrı ≥ 15/25; "Lift" ölçütü 0 olan satır havuza girmez. | 01 §6 · AC-01-23 | S5 | S | B13-12 |
| 302 | AC-03-21 | Zincir düğümleri `delayDays` vadesinde (± boşluk kırpması) gelir; aynı gün iki zincir başlamaz; 40 zincirin hepsi 10k hayatta ≥ 1 kez tamamlanır. | 03 §6 · AC-03-21 | S5 | M | B13-04, B13-05 |
| 303 | AC-03-23 | Tekrar: 1.0 havuzunda ilk 3 hayatta aynı metin varyantı < %15; soft launch < %25; MVP'de koç satırı 3+ kez < %2. | 03 §6 · AC-03-23 | S5 | M | B13-04, B13-05 |
| 304 | AC-08-09 | Genelleme dedektörü adversarial sette recall ≥ %95, precision ≥ %80 (MVP 200 cümle; 1.0 500); "Memur bey formu üçüncü kez kaybetti" ve "The clerk … | 08 §6 · AC-08-09 | S5 | M | B13-12 |
| 305 | AC-09-04 | `SC-24` ikiz-parite: alan listesindeki herhangi bir fark BLOK; sayısal ±1 tolerans | 09 §6 · AC-09-04 | S5 | S | B13-04, B13-11 |
| 306 | AC-09-12 | `intent` değişince `intentRev+1` ve iki locale `needs-review`; yalnızca TR metni değişince EN `needs-check`; `SC-10` release modunda BLOK, pr modunda … | 09 §6 · AC-09-12 | S5 | S | B13-04, B13-11 |
| 307 | AC-09-13 | Tier A olayda `en.punched:false` release BLOK | 09 §6 · AC-09-13 | S5 | S | B13-04, B13-11 |
| 308 | AC-09-14 | H-09-01 ve H-09-02 eşikleri 10.000 hayatta tutar | 09 §6 · AC-09-14 | S5 | M | B13-04, B13-11 |
| 309 | AC-09-15 | Pseudo-locale `xx` dev build'inde 25 ekranda sarmalanmamış metin 0; release bundle'ında `xx` yok | 09 §6 · AC-09-15 | S5 | M | B13-04, B13-11 |
| 310 | AC-09-16 | İçerik paketi manifest'i `locales:['tr','en']` içermeden imzalanamaz; `kill.lineKeys` locale ön ekli; locale'in tamamını öldüren kill reddedilir | 09 §6 · AC-09-16 | S5 | S | B13-04, B13-11 |
| 311 | AC-09-19 | Font cmap kontrolü §2.4.9 listesini doğrular; "İSTATİSTİK" ve "HAKSIZ ÇIKTIM" snapshot'ı tr projesinde | 09 §6 · AC-09-19 | S5 | M | B13-04, B13-11 |
| 312 | AC-09-20 | 25 kritik ekran × 3 proje (tr/en/xx) × 390×844 snapshot'ı CI'da; locale'e özel baseline | 09 §6 · AC-09-20 | S5 | M | B13-04, B13-11 |
| 313 | AC-09-21 | Swap tablosu `content/swap-table.yaml` 52 satırla repoda; `localizedShell` olayda `l10n.swaps[].row` tabloda yoksa BLOK; `SC-28` TR'ye özgü anahtar … | 09 §6 · AC-09-21 | S5 | S | B13-04, B13-11 |
| 314 | AC-09-23 | CSV import/export `coach`/`motto`/`push` havuzlarında kayıpsız gidiş-dönüş (round-trip eşitlik); EN export'ta `tr` sütunu boş | 09 §6 · AC-09-23 | S5 | S | B13-04, B13-11, B13-13 |
| 315 | AC-09-24 | Provenance: her `status ≥ curated` olayın `review.promptRev` dolu ve `content/provenance/<id>.jsonl` mevcut | 09 §6 · AC-09-24 | S5 | S | B13-04, B13-11 |
| 316 | AC-09-25 | Haftalık `content-report` artefaktı: state sayıları, universality dağılımı, uzunluk oranı medyanı, Tier A punched oranı | 09 §6 · AC-09-25 | S5 | S | B13-04, B13-11 |
| 317 | AC-09-26 | EN 5 anadil playtest (demo 200 olay) "çeviri kokuyor" ≤ 1/5; TTFL ≤ 10 sn 5/8 oyuncuda her locale | 09 §6 · AC-09-26 | S5 | S | B13-04, B13-11 |
| 318 | AC-11-19 | Build-for-review checklist'inin 10 maddesi yeşil değilse publisher linki gönderilmez; EN demo Tier A punch-up tamamlanmadan gösterilmez. | 11 §6 · AC-11-19 | S5 | L | B13-10, B13-06 |
| 319 | DEMO-S5 | Sprint demosu: web export → Claude artifact + Playwright TR/EN ekran görüntüleri + "Bu sprintte eklenenler" | Sahip kuralı; SPRINTS §2.6, §5 | S5 | S | S5 kapsamı |
| 320 | AC-01-20 | iOS ve Android'de aynı seed aynı satır dizisini üretir; hiçbir satırda platform kapısı yoktur. | 01 §6 · AC-01-20 | S6 | M | B13-12, EAS build (sahip) |
| 321 | AC-01-21 | Koç metni iki platformda paketlenmiş fontla, XL yazı ölçeğinde 375 pt genişlikte ≤ 6 satır; damga büyük harfi `tr-TR` ile doğru. | 01 §6 · AC-01-21 | S6 | L | B13-12, EAS build (sahip) |
| 322 | AC-01-24 | Persona drift testi her sprint: 100 rastgele satır, 3 okuyucu, ≤ 3 işaret; işaretli satırlar yeniden yazılır. | 01 §6 · AC-01-24 | S6 | S | B13-12 |
| 323 | AC-06-01 | `torpil` satın alımı iki platformda sandbox'ta tamamlanır; entitlement ≤ 2 sn içinde `features[]`'e yansır; interstitial `canShow` aynı oturumda … | 06 §6 · AC-06-01 | S6 | L | B13-06, B13-09, EAS build (sahip) |
| 324 | AC-06-02 | "Satın alımları geri yükle" butonu Mağaza ve Ayarlar'da her zaman görünür; yeniden kurulumda ve ikinci cihazda (aynı mağaza hesabı) Torpil geri … | 06 §6 · AC-06-02 | S6 | L | B13-06, B13-09, B13-18, EAS build (sahip) |
| 325 | AC-06-03 | Offline açılışta (uçak modu) HMAC'li önbellek geçerliyse Torpil anında aktif; `deviceKey` silinirse önbellek yok sayılır ve reklam döner, hata mesajı … | 06 §6 · AC-06-03 | S6 | M | B13-06, B13-09, EAS build (sahip) |
| 326 | AC-06-19 | CI: `billingclient ≥ 8.0.0` (hedef 9.x) kontrolü kırmızı/yeşil; GMA sürümü ve etiketleri okunur. | 06 §6 · AC-06-19 | S6 | S | B13-06, B13-09 |
| 327 | AC-07-24 | XL metin + sistem en büyük ölçekte ChoiceButton 3 satıra kadar büyür, kırpma yok, karar bölgesi ekranın altında kalır, feed hâlâ ≥ 1 balon gösterir. | 07 §6 · AC-07-24 | S6 | M | B13-01, B13-17, EAS build (sahip) |
| 328 | AC-07-25 | Her etkileşimli bileşen `accessibilityRole` + label; ChoiceButton hint yok; Stamp label "Damga: …"; axe "button-name"/"label" ihlali 0. | 07 §6 · AC-07-25 | S6 | S | B13-01, B13-17 |
| 329 | AC-07-26 | iPhone 15 Pro (Dynamic Island) ve Pixel 8 (gesture bar) üzerinde HUD (`GameClock` dahil) ve karar bölgesi (ChoiceButton / Ertesi Gün) sistem … | 07 §6 · AC-07-26 | S6 | S | B13-01, B13-17 |
| 330 | AC-07-27 | Android: kök ekranda geri = arka plan (dialog yok); sheet açıkken = kapat; Roast'ta = sonraki adım; tahmini geri animasyonu aktif … | 07 §6 · AC-07-27 | S6 | S | B13-01, B13-17 |
| 331 | AC-07-30 | Android build: tüm native `.so` dosyaları 16 KB sayfa hizalı; AAB ≤ 35 MB; iOS ≤ 45 MB. | 07 §6 · AC-07-30 | S6 | S | B13-01, B13-17 |
| 332 | AC-09-18 | `supportedLocales` ile iOS Ayarlar'da uygulama dili TR/EN görünür; Android 13 uygulama dili listesinde TR/EN | 09 §6 · AC-09-18 | S6 | M | B13-04, B13-11, EAS build (sahip) |
| 333 | AC-09-22 | `store/{tr,en-US}` metinleri 30/30/100 byte/80/4.000 limitlerinde; `SC-31` yasaklı sözcük sıfır; sürüm notu iki dilde şablona uyar | 09 §6 · AC-09-22 | S6 | S | B13-04, B13-11 |
| 334 | AC-10-10 | `persist{now}` SUSPEND'de ≤ 50 ms; `persist{debounce}` 300 ms içinde tek transaction; WAL açık. | 10 §6 · AC-10-10 | S6 | M | B13-03, B13-15, EAS build (sahip) |
| 335 | AC-10-13 | Doğum günü geçişi ≤ 400 ms; ölüm → Yeni Müşteri ≤ 40 sn otomatik, ≤ 6 sn dokunarak. | 10 §6 · AC-10-13 | S6 | M | B13-03, B13-15, EAS build (sahip) |
| 336 | AC-10-21 | iOS build'inde `PrivacyInfo.xcprivacy` gerekçeleri (`CA92.1`, `C617.1`, `E174.1`; soft launch'ta `35F9.1`) ve üçüncü parti manifest'ler mevcut; EAS … | 10 §6 · AC-10-21 | S6 | S | B13-03, B13-15 |
| 337 | AC-10-23 | Android `.aab`: `zipalign -c -P 16 -v 4` tüm `.so` için geçer; indirme ≤ 35 MB; iOS ≤ 50 MB; JS bundle gzip ≤ 1,8 MB. | 10 §6 · AC-10-23 | S6 | M | B13-03, B13-15 |
| 338 | AC-11-05 | iOS'ta ATT ön-ekranı sistem diyaloğundan önce gelir, ilk 60 sn'de ve ilk oturumda görünmez; Android'de ATT adımı yoktur. | 11 §6 · AC-11-05 | S6 | L | B13-10, B13-06, EAS build (sahip) |
| 339 | AC-11-08 | MVP R3 playtest çıkışı: TTFL ≤ 10 sn (5/8), TTFD ≤ 25 sn medyan, ilk oturum ≥ 8 dk medyan, Bir Yıl Daha ≥ %70, ölüm → yeni hayat ≥ %60, aynı satır 3+ … | 11 §6 · AC-11-08 | S6 | M | B13-10, B13-06 |
| 340 | AC-11-09 | Kahkaha günlüğü kodları (L1–L3, C, N, R, S) her oturumda `lineId/eventId + ms` ile kaydedilir; ses/görüntü kaydı yoktur; testçiler kod adıyla … | 11 §6 · AC-11-09 | S6 | S | B13-10, B13-06 |
| 341 | AC-11-10 | Faz 0'da 5 kreatif, 2 pazar; her hücre ≥ 150 tıklama; CTR/IPM/CPI/mağaza dönüşümü tablosu; kreatifte gösterilen her mekanik build'de birebir vardır. | 11 §6 · AC-11-10 | S6 | S | B13-10, B13-06, B13-18 |
| 342 | AC-11-11 | TR fazında atribüsyon mağaza tarafı (Apple kampanya linki / Play UTM) ile yapılır; TR build'inde MMP SDK'sı yoktur. | 11 §6 · AC-11-11 | S6 | S | B13-10, B13-06, B13-18 |
| 343 | AC-11-21 | Data room §2.6.4 yapısında, erişim loglu, kişisel veri içermez; dashboard erişimi salt okunur ve süreli; ham olay verisi yoktur. | 11 §6 · AC-11-21 | S6 | S | B13-10, B13-06 |
| 344 | AC-11-22 | "İstemiyoruz/istiyoruz" sayfası §2.6.6'daki 9 kırmızı çizgi ve çapalarla; TR'de yetkili avukat ön incelemesi tarihli. | 11 §6 · AC-11-22 | S6 | S | B13-10, B13-06 |
| 345 | AC-11-23 | ASO metadata §2.8.1 ile birebir; başlık/alt başlık ≤ 30, anahtar kelime ≤ 100; `aso-lint` yeşil; Apple ekran görüntüleri 4+ (mezar taşı, alkol, küfür … | 11 §6 · AC-11-23 | S6 | S | B13-10, B13-06, B13-18 |
| 346 | DEMO-S6 | Sprint demosu: web export → Claude artifact + Playwright TR/EN ekran görüntüleri + "Bu sprintte eklenenler" | Sahip kuralı; SPRINTS §2.7, §5 | S6 | S | S6 kapsamı |
| 347 | AC-11-12 | Soft launch ülke kümeleri iki mağazada aynı gün açılır (TR; sonra CA+NZ); platform başına kohort ≥ 900 yükleme olmadan D1/D7/D30 "okunmaz". | 11 §6 · AC-11-12 | S7 | L | B13-10, B13-06, B13-18 |
| 348 | AC-11-13 | G1 teknik kapı: crash-free ≥ %99,3, Torpil satın alma/restore/iade iki platformda prod'da yeşil, FTUE tamamlama ≥ %75, `no_fill` ≤ %8, rıza metinleri … | 11 §6 · AC-11-13 | S7 | L | B13-10, B13-06 |
| 349 | AC-11-14 | TR Android rewarded eCPM 14 günde ölçülür ve 06 §2.9.2 varsayımlarını ezer; < 1,5 $ ise K-03 uygulanır ve karar `kpi.md`'de yazılıdır. | 11 §6 · AC-11-14 | S7 | S | B13-10, B13-06, B13-09 |
| 350 | AC-11-17 | Canlı koç isabeti (`wager_resolved`) %48–64 bandında; dışında kalırsa 03'e "ayar" bileti açılır, iddia mekaniği değişmez. | 11 §6 · AC-11-17 | S7 | S | B13-10, B13-06 |
| 351 | DEMO-S7 | Sprint demosu: web export → Claude artifact + Playwright TR/EN ekran görüntüleri + "Bu sprintte eklenenler" | Sahip kuralı; SPRINTS §2.8, §5 | S7 | S | S7 kapsamı |
| 352 | AC-11-15 | G2/G3 kapı kararları yalnızca §2.5.3 tablosu ve K-01..K-09 kurallarıyla verilir; "iterasyon" kararı hangi sistemi (zarf/bildirim/director/FTUE) … | 11 §6 · AC-11-15 | S8 | S | B13-10, B13-06, B13-13 |
| 353 | AC-11-20 | Deck 15 slayt, §2.6.3 sırası; Karne → Roast → Kalıp; "motivasyon/wellness/alışkanlık/terapi", rakip adı ve "rüşvet" sıfır; her sayı … | 11 §6 · AC-11-20 | S8 | S | B13-10, B13-06 |
| 354 | AC-11-24 | Gelir senaryoları 06 §2.9.3 ile aynı sayılardır; deck'te net rakamlar ve mağaza × bölge kesinti matrisi; tüm ₺ değerleri "tahmin" etiketli. | 11 §6 · AC-11-24 | S8 | S | B13-10, B13-06, B13-18 |
| 355 | DEMO-S8 | Sprint demosu: web export → Claude artifact + Playwright TR/EN ekran görüntüleri + "Bu sprintte eklenenler" | Sahip kuralı; SPRINTS §2.9, §5 | S8 | S | S8 kapsamı |

## Kapsam kontrolü

- 01–11 §6'daki her AC bu tabloda tam bir kez yer alır (328 AC). S0'da `scripts/plan-check.ts` (B13-11 kapsamında) `docs/design/0*.md` + `docs/design/1[01]*.md` içindeki AC kümesini bu dosyadaki kümeyle ve SPRINTS.md §2'deki atamalarla karşılaştırır; fark = CI BLOK.
- 13 §4'ün 18 maddesi B13-01..B13-18 olarak S0'dadır; K0 kapısı bunların "kapanış kanıtı" ile kapanır (`docs/plan/S0-KANIT.md`).
- Hukuk/marka paralel şeridinin avukat, TÜRKPATENT ve KVKK öğeleri ajan eforu değil sahip işidir; SPRINTS §4'te sprint sprint izlenir. İçerik hacmi hedefleri SPRINTS §3'tedir.
