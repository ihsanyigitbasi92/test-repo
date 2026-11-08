# SPRINTS — Motto üretim planı (Sprint 0 → Sprint 11 → pitch)

> **Değişiklik (v1.2 · 2026-11-08):** eleştiri turu uygulandı — K0 (e) backlog ile hizalandı, B13-03/B13-15 iki aşamalı kapanış (S0 EAS dev build log / S6 cihaz replay); cihaz bağımlı AC'ler `/web` + `/cihaz` diye bölündü; kapasite iki şeritli ve sprint başına kod ≤ 17 ag (S1→S2→S3→S4/S5 kaydırmalar); sahip zamanı bütçesi (§1.4) ve kürasyon günü (§3); S1 bant kapsaması 41+ dahil; AC-01-04 eşiği S3'e; EN punch-up S3'ten üç dalga, yazar sözleşmesi + FSEK devri S3 başı; mağaza kaydı + Faz 0 kreatifleri S5'e, Faz 0 harcaması S6 gün 1; R3 playtest S5 sonunda başlar; publisher checklist S7'ye; hukuk sırası düzeltildi (KVKK m.9/4 bildirimi tüm işleyiciler için S6, VERBİS S4, "iddia ≠ bahis" S5 sert kapı, CA/NZ marka S6); D-U-N-S ve Play organizasyon doğrulaması S0 ön koşulu; soft launch 11 §2.5.1'e uyduruldu (Faz 1 TR 4 hafta → G1 15 Mar, CA/NZ 16 Mar, S9–S11 Faz 2, pitch 27 Nis 2027).

> **Belge türü:** Sprint planı (Faz 3). Girdi: `docs/design/00-VIZYON-ve-KARARLAR.md` (§11–§14, D-001…D-127), `13-ELESTIRI-ve-REVIZYON-NOTLARI.md` (§4 "Sprint 0'dan önce çözülmesi şart" **bağlayıcı**), `10-teknik-mimari.md` §2–§3 + Ek A, ve 01–11 dokümanlarının §6 kabul kriterleri (AC-xx-nn). Her AC'nin hangi sprinte düştüğü ve eforu `docs/plan/BACKLOG.md`'dedir; bu belge sprintlerin *neden* ve *ne zaman*ını anlatır.
> **Durum:** v1.2 · 2026-11-08 · Yazar: Yapımcı (planlama ajanı) · Sahibi: proje sahibi.
> **Hiyerarşi:** 00 §14 > §13 > §12 > §11 > bu plan. Plan bir D-kararını değiştiremez; çelişki görürsen D-kaydı açılır, plan ona uyar.

---

## 0. Okuma kuralları ve sabitler

**Takım:** 1 sahip (ürün kararları, mağaza/EAS hesapları, avukat/marka vekili ilişkisi, cihaz testleri) + bu bulut ortamında çalışan AI kodlama ajanları (kod, içerik üretimi/kürasyon ön elemesi, harness, Playwright demo). Ortamda cihaz yok; **her demo = Expo web export + Playwright** (ekran görüntüsü artefaktı) + Claude artifact olarak yayımlanmış oynanabilir sürüm. EAS build'leri sahibin hesaplarında koşar; cihaz kapıları (TestFlight / Play internal) sahibin cihazında kapanır ve planda **"cihaz kapısı"** diye ayrı işaretlenir.

**Sahip kuralları (bağlayıcı, her sprint):** (1) sprint **oynanabilir demo** ile biter: web export → Claude artifact + Playwright ekran görüntüleri (TR + EN, 390×844 ve 430×932); (2) **"Bu sprintte eklenenler"** listesi (`docs/plan/CHANGELOG.md`, AC/D referanslı); (3) her anlamlı adım **git'e commit**, sprint sonu `main`'e merge; (4) **hukuken riskli hiçbir şey yok:** 00 §1.2 ASLA listesi, T9, 08 lint `block` = 0; şüphede yapılmaz, avukata sorulur (§4).

**Efor birimi:** **ajan-gün (ag)** = bir ajanın 1 iş günü odaklı çıktısı (kod + test + commit). Kapasite (v1.2, iki şerit): **kod şeridi** 10 iş günü × 2 paralel ajan ≈ 20 ag ham, ≥ %15 tampon, planlanan **≤ 17 ag** (BACKLOG AC/B13/demo satırları); **içerik/hukuk/operasyon şeridi** 1 içerik ajanı ≈ 10 ag ham, planlanan ≤ 8 ag (BACKLOG `CNT/LEG/OPS` satırları; S5'te kod ajanları içerik şeridine kayar, toplam ≤ 25 ag). Sahip zamanı ayrı bütçelenir (§1.4); ajan çıktısı sahibin inceleme gününü aşamaz. BACKLOG eforları AC başınadır ve aynı iş paketinde paylaşılan altyapıyı ayrıca saymaz: S ≈ 0,1 ag (tek test/kural/metin), M ≈ 0,3 ag (bileşen + test), L ≈ 1+ ag (hacimli içerik, iki platform, uçtan uca). Sprint eforu aşağıda paket bazında verilir ve **BACKLOG Özet tablosuyla birebir aynıdır** (v1.2; çelişkide BACKLOG esastır).

**Sayılar tek kaynaktan (00 §14.1):** oturum medyanı ≥ 7 dk · oturum/gün ≥ 3 · dk/gün ≥ 20 · gün/oturum 15–25 · retention kill 30/12/4 · kabul 35/15/6 · iyi 40/18/8 · içerik MVP 80 / soft launch 300 (150/100/50) / 1.0 900 olay · koç satırı 700 → 1.300 → 2.100 · gösterilen gün 450–600, 12 sn/gün · AgeUp ≤ 1.100 ms + Karne ≤ 400 ms. Bu plandaki her sayı bu tabloya ya da bir AC'ye bağlıdır.

---

## 1. Hedefler ve kilometre taşları

### 1.1 Takvim (iki haftalık sprintler; başlangıç Salı 10 Kasım 2026)

| Sprint | Tarih | Tema | Kilometre taşı / kapı | Demo (zorunlu) |
|---|---|---|---|---|
| **S0** | 10 Kas – 23 Kas 2026 | İskelet + zorunlu kararlar (13 §4 1–18) | **K0:** 13 §4'ün 18 maddesi kanıtıyla kapalı (B13-03/15 aşama 1: EAS dev build log); CI yeşil (check + sim + e2e); 1.000 hayat raporu; TÜRKPATENT başvurusu yapılmış; D-U-N-S başvurusu + organizasyon hesapları | Web export: FTUE ilk 3 gün + Playwright ekran görüntüsü; maket v3 dokümana hizalı |
| **S1** | 24 Kas – 7 Ara 2026 | Motor çekirdeği + 80 olay günü + ilk oynanabilir demo | **K1:** 18 → ölüm oynanabilir (tek hayat; 41+ bandı 12 evrensel olayla, tekrar kabullü), FTUE ≤ 60 sn Playwright'ta ölçülü, 80 olay günü/locale `approved`, 10k harness H-10 eşiklerinde | Tam hayat demo (TR/EN), ilk Karne, ilk damga, ölüm → Yeni Müşteri |
| **S2** | 8 Ara – 21 Ara 2026 | Karakterler / diyalog / durum ekonomisi | **K2:** 8 Tanıdık Yüz + 10 durumsal NPC konuşuyor; Durum şeridi + nakit akışı takvimi; ANNE ARIYOR (D-108); Roast Raporu tam | "Hayat değişiyor" demosu: işe giriş → maaş akışı → kira zammı → Yağmur/Sam zinciri |
| **S3** | 22 Ara 2026 – 4 Oca 2027 | Retention / bildirim / karne / paylaşım | **K3:** Mola ritüeli, bildirim sözleşmesi (D-091), Sakatlık Raporu (D-089), paylaşım kartları 9:16 + 1:1, Antrenman Kampı, Kondisyon/Teşhis/Sözlük koleksiyonları | Çok oturumlu demo: 2. oturum dönüşü, zarf bildirimi (mock), Karne paylaşım kartı PNG |
| **S4** | 5 Oca – 18 Oca 2027 | Monetizasyon / rıza / hukuk ekranları | **K4:** ConsentGate tek model (D-102/103/104), Torpil + Restore (sandbox), rewarded R2/R3 (D-085), dönüş interstitial'ı (D-084), hukuki belgeler TR+EN yayında, karanlık desen checklist 14/14 | Rıza akışı (TR/EEA/diğer mock), Torpil satın alma mock, "Gerçek hayatta yardım" ekranı |
| **S5** | 19 Oca – 1 Şub 2027 | İçerik 300 olay günü (+200 `curated` stretch) + EN punch-up son dalga + harness ayarı + mağaza kaydı + Faz 0 kreatifleri | **K5:** 300 olay/locale `approved` (bant tabanları), Tier A EN `punched` %100, tuning.json kilidi (qx kalibrasyonu), tekrar < %20 (ilk 3 hayat 18–25); mağaza kaydı + CA/NZ ön kayıt sayfaları incelemeden geçmiş; "iddia ≠ bahis" görüşü | 2. ve 3. hayat demosu: Tanıdık Yüzler hatırlıyor, Kronik, Hızlı Yaşa (oyuncu açar) |
| **S6** | 2 Şub – 15 Şub 2027 | Soft launch hazırlığı (TestFlight / Play internal, analytics, mağaza) | **K6 = G0:** cihaz smoke 14/14 iki platformda (sahip 3 cihaz günü), Faz 0 marketability sonucu (harcama gün 1), mağaza paketi `aso-lint` yeşil, `release.yml` gerçek build (internal), data inventory = Privacy/Data safety, KVKK m.9/4 bildirimi (≤ 5 Şub) | Build-for-review demosu (cihaz kayıtları) + mağaza ekran görüntüleri |
| **S7** | 16 Şub – 1 Mar 2027 | Soft launch TR — Faz 1 hafta 1–2 (teknik açılış) | **K7 (Faz 1 ara okuma):** G1 teknik maddeleri ilk 14 günde ölçülüyor (crash-free, Torpil prod, FTUE tamamlama, `no_fill`); TR'de reklam SDK'sı yalnızca SCC teyidiyle açık; publisher checklist 10/10 | Prod build'in web eşleniği + haftalık `kpi.md` #1–#2 |
| **S8** | 2 Mar – 15 Mar 2027 | TR Faz 1 hafta 3–4 + G1 + CA/NZ hazırlığı + deck taslağı | **K8 = G1 (Faz 1 sonu, 15 Mar):** AC-11-13 beş maddesi; TR eCPM 14 gün (ya da B planı yedek ölçütü); FTUE/ton iterasyonu (K-01) uygulanmış; CA/NZ metadata + ön kayıt → yayın hazır; deck/data room **taslağı** (her KPI "tahmin") | KPI dashboard demosu (yerel toplayıcı + GA4 explore görüntüleri) + G1 karar sayfası |
| **S9** | 16 Mar – 29 Mar 2027 | Faz 2: CA+NZ açılışı + kohort 1 | **K9:** CA+NZ aynı gün iki mağazada; kohort ≥ 900/platform UA planı çalışıyor; içerik paketi `c3` | Faz 2 açılış demosu (EN prod web eşleniği) + `kpi.md` |
| **S10** | 30 Mar – 12 Nis 2027 | Faz 2: D7 okuması (kohort 1) + iterasyon | **K10:** D7 kohort 1 "okunur" (minSample); K-01..K-09 kararları; "iterasyon" kararı sistem adıyla (AC-11-15) | KPI dashboard demosu (D1/D7) |
| **S11** | 13 Nis – 26 Nis 2027 | Faz 2: kohort 2 + pitch paketi final | **K11:** deck 15 slayt + data room ölçüm verisiyle (AC-11-20/21/22/24); publisher görüşme takvimi (D-087) | Deck (PDF) + data room dizini + publisher demo build'in web eşleniği |
| **Pitch** | 27 Nis 2027 → | Publisher görüşmeleri Faz 2 verisiyle (D-087: self-publish ana yol); Faz 2'nin 7–8. haftası (D30 kohort 1, ~11 May) görüşmelerle paralel | G2/G3 kararları 11 §2.5.3 K-01..K-09 ile; D7 okunur, D30 ~11 May | — |

Not: S3 yılbaşı haftasına denk gelir; kapsamı kod + harness ağırlıklı, avukat/mağaza bağımlılığı yok (EN yazar sözleşmesi S3 gün 1'de imzalanır). **Takvim 11 §2.5.1 sürelerine uyar (v1.2):** Faz 0 = 3 hafta (S5'te kreatif üretimi, S6'da 10 gün test + 4 gün vitrin iterasyonu); Faz 1 TR = **4 hafta** (16 Şub – 15 Mar; G1 = Faz 1 sonu); Faz 2 CA+NZ = 6–8 hafta (16 Mar – ~11 May; G1'den sonra); pitch Faz 2'nin 6. haftası sonunda (27 Nis), G2/G3 kararı 8. hafta. Plan bu süreleri kısaltamaz; kısaltma ancak bir D-kaydı ve 11'in güncellenmesiyle olur. Pitch paketi 26 Nis'te hazır; görüşmeler KPI "okunur" olunca (AC-11-12).

### 1.2 Kritik yol

```
S0 (13 §4 1–6: zaman modeli, D-066/067, determinizm, şema, tuning/RNG, rıza modeli)
 → S1 motor + FTUE + 80 olay  → S2 NPC/durum/ölüm akışı → S3 retention/paylaşım
 → S4 rıza/monetizasyon (SCC + 16+ muhtırası kapıları)  → S5 içerik 300 + punch-up (G1 ön koşulu, D-114)
 → S5 mağaza kaydı + Faz 0 kreatifleri + "iddia ≠ bahis" görüşü (S6 metadata/kreatif kapısı)
 → S6 cihaz smoke + Faz 0 harcaması + mağaza paketi → S7–S8 TR Faz 1 (4 hafta) → G1 (15 Mar)
 → S9 CA/NZ → S10 D7 → S11 deck final → pitch (27 Nis)
Ön koşul zinciri (S0 gün 1): D-U-N-S → Apple/Play organizasyon hesabı → ASC ad rezervasyonu (Motto + Tempo) → EAS dev build (gün 8–9)
```

En kırılgan üç halka: **içerik hızı ve küratör kapasitesi** (D-112: S1–S2'de ölçülen hız S2 sonunda S5 hedefini resmen günceller; küratör = sahip, ≤ 25 olay/gün TR, §1.4), **avukat kapıları** (SCC/m.9-4, 16+ muhtırası, "iddia ≠ bahis"; S0–S1'de istenir, S4/S5/S6'da son tarih, B planı yazılı) ve **D-U-N-S / organizasyon hesabı** (1–2 hafta; gecikirse ASC ad rezervasyonu ve EAS dev build kayar → B13-03/15 aşama 1 S1 gün 3'e taşınır, K0 bu iki satır dışında kapanır).

### 1.3 Sprint ritüeli

Gün 1 sprint planı PR'ı (her issue bir AC/D referansı taşır) · her gün commit, CI `check` + `sim` yeşil kalır (kırmızıda yeni özellik başlamaz) · gün 5 ara demo ve kapsam kesme kararı · gün 9 gecelik harness 10.000 × 2 locale × 3 ses + Playwright 48 spec + içerik raporu · gün 10 demo yayını (artifact + ekran görüntüleri), "Bu sprintte eklenenler", retro, `main`'e merge · her sprint AC-01-24 persona drift (100 satır) ve D-097 kör anadil testi (50 satır; S0'da yalnızca TR, EN okuyucu listesi OPS-04 ile S1'den itibaren TR ve EN) · ajan PR'ları paket bazında birleştirilir: sahibe günde ≤ 2 inceleme PR'ı.

### 1.4 Sahip zamanı bütçesi (v1.2)

Sahip tek kişidir; ajan kapasitesi sahibin inceleme ve kürasyon gününü aşamaz. Gün = sahip iş günü (sprint 10 gün). Kaynak: BACKLOG `sahip N g` sütunu + inceleme satırı OPS-10.

| Sprint | PR inceleme / merge / demo onayı | Kürasyon (TR son söz, ≤ 25 olay/gün) | Cihaz / EAS | Hukuk / hesap / mağaza / UA | Toplam |
|---|---|---|---|---|---|
| S0 | 2 | 0,5 (+ golden CSV 0,5) | 1 (EAS dev build, gün 8–9) | 2 (D-U-N-S, ASC, brief'ler, TÜRKPATENT, FSEK) | **6** |
| S1 | 2 | 4 | — | 0,7 (okuyucu listesi, "iddia ≠ bahis" talebi) | **6,7** |
| S2 | 2 | 4 (+ golden CSV 1) | — | 0,5 (EN yazar işe alım) | **6,5** |
| S3 | 2 | 4 | — | 0,5 (EN yazar sözleşmesi + FSEK devri, gün 1) | **6,5** (yılbaşı: kürasyon 22–24 Ara ve 28 Ara – 4 Oca) |
| S4 | 2 | 2 | — | 0,3 (VERBİS) | **4,3** |
| S5 | 1,5 | 5,5 | — | 3,1 (mağaza kaydı, Faz 0 kreatif kaydı, playtest işe alım, iddia ≠ bahis, Kader) | **10,1** — en yoğun sprint; taşmada önce 200 `curated` stretch düşer |
| S6 | 2 | 0,5 | **3** (sprint başında bloklu) | 2,6 (Faz 0, mağaza paketi, KVKK bildirimi, CA/NZ/EUIPO/USPTO marka) | **8,1** |
| S7 | 2 | 1,5 | — | 3 (yayın, UA TR, 1★) | **6,5** |
| S8 | 2 | — | — | 4 (G1 paketi, CA/NZ hazırlık, deck taslağı) | **6** |
| S9–S11 | 2 / sprint | 1,5 (S9, S11) | — | 2–3 (UA, LEG-14, görüşmeler) | **4–6,8** |

---

## 2. Sprint planları

Her sprintte aynı başlıklar: Hedef · Kapsam (madde madde; AC ve D referanslı) · Demo kapsamı · Çıkış kriterleri / KPI kapıları · Riskler · Bağımlılıklar · Tahmini efor.

### 2.1 Sprint 0 — İskelet + zorunlu kararlar (10–23 Kas 2026)

**Hedef.** 13 §4'teki 18 maddeyi *kanıtıyla* kapatmak ("aşağıdakiler kapanmadan motor/içerik/rıza kodu yazılmaz") ve 10 Ek A'nın 10 günlük checklist'ini bitirmek. Repo bugün: pnpm monorepo, `packages/engine` (sfc32 RNG + vitest/fast-check), Expo SDK 58 uygulaması, CI yml, `docs/mock/motto-demo.html`. Sprint 0 bu iskeleti "motor yazılabilir" hâle getirir.

**Kapsam.**
1. **Zaman/boşluk modeli tek kural** (13 §4 #1, D-088): 02 §2.1, 03 §2.1, 07 §2.2.1/AC-07-39, 10 §2.3.9 aynı cümleyi taşır; `applyGap` + `SkipSummary` ≤ 1,5 sn, olay günü `eventHour`'a ≤ 1,5 sn, gösterilen gün başına etkileşimsiz süre ≤ 3 sn. Doküman düzeltme PR'ı + maket v3 `tick()` hizası.
2. **D-066/D-067 motor dokümanlarına** (13 §4 #2, D-099): 03 §0.1 + 10 §0.2 satırları; `LifeState`'e `Status`/`Money`/`sessionDayIndex`/`expectedSessionDays`; `ADVANCE_TIME{days}`; `ANSWER.via: 'tap'|'swipe'|'tactic'|'auto'`; `RESUME.reducedMotion`. Tip dosyaları repoda (AC-10-02).
3. **Motor determinizmi** (13 §4 #3, D-098): ESLint `no-restricted-properties` (Math.exp/pow/log/sqrt/tanh/sin/cos) + `no-restricted-imports`/`no-restricted-globals` (AC-10-01); `tables/hazard.ts` (yaş × Sağlık-bucket `uint32`), `tables/gapQuantile.ts` (256 kuantil), `tanh` 64 girdili tablo; üç platform sha256 testi **iki aşamalı** (v1.2): aşama 1 = Node sha256 + sahibin S0 gün 8–9'da koştuğu EAS dev build (iOS simulator + Android APK) replay log'u (AC-10-03/web, AC-03-18/web, OPS-03); aşama 2 = cihaz replay S6 (AC-10-03/cihaz, AC-03-18/cihaz).
4. **Tek zod şeması** (13 §4 #4, D-099): `packages/content-schema/schema.ts` — 03 §2.2.1 + D-ÖNERİ-02-15 + 04-01 + 09-02/03 + D-071 `SpeakerId` (18+ rol) + `punchOwner`, `intent.mechanism/closer`, `ReviewBlock` (09 esas); `PatternId` İngilizce camelCase; `evt.` namespace; docs'taki tüm JSON örnekleri `test/fixtures/docs/*.json` olarak CI'da `schema.parse` (AC-09-01, AC-01-01, AC-04-14 `SpeakerId` ekleri).
5. **`tuning.json` + gün tabanlı RNG + tek director** (13 §4 #5, D-100, D-101): `seedFor(lifeSeed, dayIndex, ch)`, `RngChannel` + `daily`; `planNextDay` imzası 10 §3.2'de, gövde 03 §2.3.11; H-10 tablosu `tuning.json`'dan üretilir (AC-10-15 altyapısı; AC-10-05 bant sabitleri).
6. **Rıza/yaş modeli tek kaynak** (13 §4 #6, D-102/103/104): 10 §5.2 `ConsentState {adsPersonalized, analytics, isMinor}`; `consent/cards.json`; ST-08 şema kontrolü iskeleti; avukata giden **tek rıza/aydınlatma brief'i** (sahip gönderir).
7. **Google SCC / m.9-4 teyidi talebi** (13 §4 #7, D-103) ve **16+ muhtırası talebi** (13 §4 #8, D-107): avukat brief'leri S0 1. hafta çıkar; cevap S0 bitimi hedef, gelmezse S4 B planı (TR reklam SDK'sı kapalı; TR storefront 18+ beyan).
8. **Reklam modeli yeniden hesap** (13 §4 #9, D-084/085/086): 06 §2.9 yeni varsayımlarla; `ad_opportunity/DAU` KPI; 10 `canShow` playTime kuralı.
9. **KPI seti ve kapılar** (13 §4 #10, D-083/113/086): 11 §2.1/§2.5 tabloları; benchmark gerekçesi sayfası taslağı.
10. **İçerik hacmi tek kaynak** (13 §4 #11, D-112): 00 §14 = 03 §1 = 09 §6.4; içerik/kod saat bölüşümü bu planın §3'ünde.
11. **D-064 şaka bütçesi + mekanizma kotaları lint'te** (13 §4 #12, D-093/094): 03 şemasında `punchOwner`, `intent.mechanism/closer`; 08'de closer 3-gram ve kişi-sıfatı kuralları (ilk 12 kural: Ek A #12); banka AC-01-26 ("banka = lint'i %100 geçen tek kaynak") için 13 §5'in 15 altın satırı + ek düzeltmeler bankaya girer.
12. **Bildirim sözleşmesi** (13 §4 #13, D-091): 05 §2.4 tablosu; `notif.*` lint; 07 §2.3.4 metni aynı.
13. **Yokluk ekonomisi donar** (13 §4 #14, D-089): 02 §2.1.7 `advanceTime`; AC-02-41 yeni invariant'lar.
14. **Teknik düzeltme paketi** (13 §4 #15, D-117): RC `configure` +5 sn; Keychain `THIS_DEVICE_ONLY`; içerik bundle dışında; PBL 9.1.0/pod kontrolü (`pod install` kanıtı iki aşamalı: S0 EAS dev build log'u OPS-03 / S6 cihaz, AC-10-19/cihaz); `motto-clock` iskeleti; COOP/COEP; `EXACT_ALARM` grep.
15. **Marka + telif takvimi** (13 §4 #16, D-111): §4 hukuk şeridine bak — D-U-N-S → organizasyon hesapları (OPS-01) → ASC ad rezervasyonu **hesabın açıldığı ilk gün** (Motto + yedek Tempo, OPS-02) + alan adı; TÜRKPATENT 9+41 başvurusu S0 bitimi; FSEK m.52 devir metni; `assets/SOURCES.md`.
16. **Maket v3 dokümana hizalı** (13 §4 #17, D-121/108): Teşhis adları, ANNE ARIYOR **yalnızca görseli** (AC-07-44'ün kendisi Anne Baskısı motoruyla S2'de), zaman modeli, auto `cautious`, "üç Para", intro düzeltmeleri; `docs/mock/**/*.html` string literal'leri lint kapsamında; FTUE kronometre ≤ 60 sn.
17. **Mağaza vaatleri** (13 §4 #18, D-106): `store/{tr,en}/*.md` ("Oyunun ortasında reklam yok", "İçindekiler yazılı, sürpriz yok", ekran görüntüsü 4 yeniden, "wagers"); `aso-lint` iskeleti (H-11-08).
18. **10 Ek A checklist'i (28 adım)** aynen uygulanır: monorepo kök dosyaları + `CLAUDE.md`; `packages/engine` tipler/rng/save-hash, reducer iskeletleri (`AGE`/`CHOOSE` alias — AC-10-02, AC-10-04), `director/day.ts` + `select/*`, 10 property testi (AC-10-03/web, AC-10-04, AC-10-08, AC-10-09, AC-10-17; AC-10-05 bant sabitleri S1'de `dayBudget` ile); `packages/content` 40 örnek olay + `build.ts` (AC-09-02, AC-09-03); `packages/i18n-tr` golden iskeleti — ilk 500 hücre (AC-09-05/500; 2.100 hücre S2'de AC-09-05/2100); `tools/content-lint` ilk 12 kural (AC-08-01); `tools/sim` 1.000 hayat raporu (AC-10-15; `applyGap` perf hedefi AC-10-14 S1'de); `apps/mobile` rotalar + `lifeStore` + `ports/*` + `providers/noop` (AC-10-24) + UI iskeletleri (testID + a11y) + `persistence/` 3 nesil + `meta_backup`; web export + 6 Playwright spec (AC-10-28 ilk teslim: 6 spec; 12 spec S1'de); `release.yml` kuru çalıştırma; `content-release.yml` imzalama (AC-10-16); `pins:check` 0 sapma; `catalog.spec.ts` (AC-06-04); repo kuralı (AC-10-27/statik: abonelik/loot box bileşeni yok; satın alma ekranı AC-10-27/ekran S4); `RL-13` kod taraması (AC-08-17); şema lint L03-01..14 (AC-03-22), determinizm + save/load (AC-03-18/web), banka = lint'i %100 geçen tek kaynak (AC-01-26). 10k harness < 60 sn (AC-03-24) S1'e kaydı (v1.2 kapasite).
19. **Hukuk ve hesap ön koşulları (v1.2)** — D-U-N-S başvurusu gün 1 (OPS-01), Play organizasyon hesap türü doğrulaması + "12 testçi" muafiyetinin konsolda teyidi (11 §7.1 #5), avukat brief #1–#3 (LEG-01..03; brief #2 AdMob + Sentry + RevenueCat + GA4'ü kapsar), TÜRKPATENT (LEG-04), FSEK devir metni (LEG-05), 40 örnek olay (CNT-00).

**Demo kapsamı (zorunlu).** Web export'ta: siyah zemin + "yazıyor…" → ilk balon (D-015) → Müşteri Dosyası → İlk Gün kartı → cevap balonu → sonuç → koç balonu; 2. günde `SkipSummary`; `?lang=tr|en`. Playwright ekran görüntüleri TR/EN × 390×844. Ayrıca maket v3 (dokümana hizalı; ANNE ARIYOR görseli dahil) artifact olarak yeniden yayımlanır ve FTUE kronometresi ≤ 60 sn kanıtı eklenir. Koç balonu bu demoda S0 örnek satırlarından sabit seçimdir; `pickLine` ve roast balonu kuralı (AC-10-07) S1'de.

**Çıkış kriterleri / kapı K0.** (a) 13 §4'teki 18 satırın her biri için "kapanış kanıtı" sütunundaki artefakt repoda ya da `docs/plan/S0-KANIT.md`'de link — B13-03 ve B13-15 **iki aşamalı** kapanır: "Node + EAS dev build log kanıtı (S0) / cihaz replay (S6)"; aşama 1 S0'da zorunlu; (b) CI `check` + `sim` + `e2e` yeşil; (c) 1.000 hayat raporu H-10 eşiklerinde (PR eşikleri); (d) `pins:check` 0 sapma; (e) AC-10-01, 02, 03 (yalnızca Node + dev build log), 04, 06, 08, 09, 15, 16, 17, 24, 27 (statik kısım), 28 (6 spec) yeşil (Ek A #27; v1.2: AC-10-05/07/14 S1'de, AC-10-12 S1 web, AC-10-25 S4, AC-10-26 S3 — K0'da yoktur; plan-check K0 listesinde S0 dışı AC görürse BLOK); (f) TÜRKPATENT başvuru numarası + D-U-N-S başvurusu + (hesap açıldıysa) ASC ad rezervasyonu Motto + Tempo + alan adı; (g) avukat brief'leri gönderildi (cevap S4 kapısı). **Motor kodu S1'de ancak (a) tamamsa yazılmaya devam eder.**

**Riskler.** D-U-N-S / organizasyon hesabı 1–2 hafta sürer → EAS dev build ve ASC rezervasyonu S1 gün 3'e kayabilir; K0 bu iki satır dışında kapanır, kayma CHANGELOG'a yazılır. Avukat cevapları gecikir (B planı yazılı, S4/S5/S6'da). `expo install` ağ kısıtı (prosedür 10 §2.2.2; pin dosyası). CocoaPods/RC pod sorunu (RC 10.x pini hazır). Şema birleştirme beşten fazla dokümanı dokunur → doküman PR'ı tek seferde, sahip onayı gün 4.

**Bağımlılıklar.** Sahip: **D-U-N-S numarası** (gün 1 başvuru; Apple ve Google organizasyon hesabı bunu ister), Apple Developer + Play Console **organizasyon** hesapları (Play hesap türü doğrulaması; "12 testçi" muafiyeti teyidi), EAS hesabı, avukat ve marka vekili ataması, alan adı satın alma; gün 8–9 EAS dev build. Ajan: yok (repo hazır).

**Tahmini efor.** BACKLOG ile mutabık (v1.2): kod şeridi 14,8 ag + içerik/hukuk/ops 2,0 ag = **16,8 ag** (≤ 17) + sahip 6 gün (§1.4). Kaydırılanlar: AC-07-44 → S2; AC-10-05/07, AC-03-24, AC-10-14, AC-07-39 → S1; AC-02-41 kodu → S3; AC-09-05 2.100 hücre → S2.

### 2.2 Sprint 1 — Motor çekirdeği + 80 olay günü + ilk oynanabilir demo (24 Kas – 7 Ara 2026)

**Hedef.** 18'den ölüme **tek hayat** oynanabilir: gün bütçesi (D-061/D-088), nakit akışı iskeleti (D-067), iddia servisi + damga (D-009/D-010/D-120), doğum günü Karne + Yılın Mottosu + Tek Hedef (D-021/022/023), zarf (D-011), Gompertz hazard + Roast Raporu iskeleti (D-025), FTUE saniye saniye (D-090). 80 olay günü/locale `approved`.

**Kapsam.**
1. **Gün bütçesi ve takvim** — `DayDirector.planDay`, bant tabloları, doğum günü sabit nokta, FTUE yılı `flags.ftue_year` muafiyeti (D-100): AC-02-01, AC-02-02/web (harness; min-spec ölçümü S6 /cihaz), AC-03-01, AC-03-02, AC-03-03, AC-03-04, AC-03-05, AC-10-05 (v1.2: S0'dan), AC-10-07 (v1.2: S0'dan; her ANSWER'da roast balonu `pickLine` ile).
2. **Akan zaman (D-066/D-088)** — `FlowTimer` UI'da, `GameClock` Reanimated shared value (D-117 #8), hız kontrolü ⏸/▶/▶▶ (son seçim MMKV'de kalıcı, D-092), `eventHour`'a sarma, devam gecikmesi 2.500 ms veya dokunma: AC-07-39 (v1.2: kod S0'dan), AC-07-40, AC-07-05/web, AC-10-12/web, AC-02-37/web (cihaz p95 kısımları S6 /cihaz).
3. **Nakit akışı ve `applyGap` O(1)** — ayın 1/5/10/20 vadeleri, günlük küçük gider, borç büyümesi tablo, Keyif çekimi tablo: AC-02-30, AC-02-32, AC-02-33, AC-02-34, AC-02-40, AC-04-03, AC-10-14 ("applyGap(365) ≤ 20 µs"; v1.2: S0'dan), AC-03-24 (10k harness < 60 sn; v1.2: S0'dan). Kira günü olayı AC-02-31 → S2.
4. **Atlama özeti** — `GapSummary.flowLog` ≤ 3 satır, `skip.*` anahtarları, UI zar atmaz: AC-02-35, AC-07-42, AC-03-04.
5. **Stat/metre/koruma penceresi** — `applyDamage` çarpanları, invariant'lar, eşik olayları motor tarafı: AC-02-24, AC-02-25, AC-02-26 (pulse sırası), AC-02-29; aynı seed → aynı seri + save/load (AC-02-21), para birimi/enflasyon sözcükleri 0 (AC-02-22). "Borç N" gösterimi ve iflas (AC-02-09) → S2.
6. **İddia servisi** — 0,35–0,65 bandı, `playerChose`, 10 günde ≤ 2, yılda ≤ 2; **tahmin yönü serbest** (D-120: pEff > 0,50 → `succeed` açılabilir, yılda ≥ 1 lehine): AC-03-09, AC-03-10 (D-120 metniyle: "çoğunlukla karşı"), AC-02-19. İkiz hayat testi (AC-03-11), iddia satırında oran (AC-01-11) ve hedef iddiası (AC-04-27) → S2 (v1.2 kapasite).
7. **Zarf ve negatif seri** — AC-03-15, AC-03-07, AC-03-19. Kalıp Dedektörü (AC-03-20), pity/near-miss/efsane gün (AC-03-12/13/14) → S2 (v1.2 kapasite).
8. **Doğum günü: Karne + Yılın Mottosu + Tek Hedef** — 6 not, 36 hücre × 3 varyant (pozitif 12 hücre D-096 kuralıyla), hedef damgası, `suggest()` 3 farklı + ≥ 1 küçük: AC-04-26, AC-02-38, AC-07-06 (AgeUp ≤ 1.100 ms + Karne ≤ 400 ms), AC-07-10. `AgeUpOverlay` tam animasyonu (AC-07-43) → S2; S1'de sade geçiş.
9. **Ölüm ve Roast Raporu iskeleti** — hazard tabloları, ölüm dağılımı, `deathFlow` reklamsız tip düzeyinde: AC-02-03, AC-02-04, AC-02-05, AC-02-06, AC-02-07, AC-02-12, AC-07-19 (sıra). Gelir tavanı (AC-02-08) ve absürt kuyruk (AC-02-10) → S2; unlocks/Yedek Kulübesi (AC-02-14) ve Yeni Müşteri ≤ 300 ms + "Aynı kondisyonla" (AC-07-20) → S3; `ad-opportunity` property (AC-10-18) → S4. S1'de ölüm → Yeni Müşteri düz akış.
10. **FTUE saniye saniye (D-090)** — ilk iddia gerçek zarla ("Mart'a kadar dayanır mı?" check 0,45), "%55" metni yok; bot akışı zaman damgaları: AC-07-01, AC-07-02, AC-07-03, AC-07-04, AC-07-07, AC-07-08, AC-07-09, AC-07-33, AC-07-34, AC-07-35. `tools/report-aggregate` (AC-11-07) → S5 (R3 playtest hazırlığı); S1 zaman damgaları Playwright raporundan.
11. **Koç satırı seçimi** — `pickLine` specificity → LRU → varyant; `minRoast` D-093 (3 günde ≥ 1 roast, 4 günde ≥ 1 plain; `punchOwner`); lift poster testi; sessizlik protokolü: AC-01-03, AC-01-05, AC-01-06, AC-01-07, AC-01-08, AC-01-09, AC-10-06 (S0 teslimi, burada yeniden), AC-10-07. AC-01-04: S1'de yalnızca **cooldown ihlali 0** kontrol edilir; "aynı satır 3+ < %2" eşiği 700 satırlık MVP bankasıyla S3'te bağlanır.
12. **İçerik hattı ilk tam tur** — 80 olay günü/locale (FTUE dahil) `approved`, bant **18–25 ≥ 50, 26–40 ≥ 18, 41+ ≥ 12** (41+ için geniş bant aralıklı evrensel olaylar; CNT-01); koç satırı bankası ≥ 300/locale (CNT-02; MVP 700'e S3'te ulaşır); lint kuralları 08'den 30'a; funny-check rubriği D-097 (≥ 18/25 + bir ölçüt 5 + Tazelik): AC-09-06, AC-09-07, AC-09-08, AC-09-09, AC-09-10, AC-09-11, AC-08-02, AC-08-03. Golden CSV 2.100 hücre (AC-09-05/2100), seed listeleri (AC-08-04) ve `--docs` modu (AC-08-19) → S2. "İddia ≠ bahis" avukat görüşü talebi (LEG-06); EN + TR anadil okuyucu listesi (OPS-04).
13. **Durum izi (motor)** — AC-02-39 (dar iz tanımı D-119; her `CHOOSE` sonrası ≥ 1 alan değişir). `LifeStatus` tipi + Durum şeridi 4 hücre (AC-04-01, AC-04-02) ve `StatusStrip` statik + dinamik (AC-07-41) S2'de tek paket.
14. **Playwright 12 spec** TR/EN × 2 viewport (AC-10-28 tam; S0'da 6 spec), feed sınıf adları (AC-07-34), gün içi sıra (AC-07-37). Yatay taşma 4 viewport (AC-07-38) → S2.

**Demo kapsamı (zorunlu).** Tek hayat: 18 → ölüm, serbest mod, TR ve EN; Playwright FTUE zaman damgaları raporu (ilk balon, karar fırsatı ≤ 22 sn, fiş ≤ 34, damga ≤ 41, Kısa Karne ≤ 60); ölüm → Roast Raporu → Yeni Müşteri; `sim-report.html` (10.000 hayat) artifact olarak. "Bu sprintte eklenenler" 80 olay günü listesini içerir.

**Çıkış kriterleri / kapı K1.** Harness 10k: medyan ölüm 72–78, gösterilen gün 450–600, isabet %50–62 (lehine iddia payı %20–35), neg seri ≤ 2, zarf [1,2], roast'sız gün (lowJoy hariç) 0, plain oranı ≥ %25/hayat (D-093), kalıcı iz ≥ %40 gün (D-119), koç satırı cooldown ihlali 0 (p95 sürpriz ≤ 14 → K2, AC-03-13). **"Ölüme kadar oynanabilir" harness tanımı (v1.2):** olaysız gösterilen gün 0 (AC-03-01) her bantta korunur; 41+ bandında 12 evrensel olayla **tekrar kabullü** (tekrar eşiği AC-03-21/23 S5'te bağlanır, S1 harness'ı 41+ tekrarını raporlar ama bloklamaz). Playwright FTUE ≤ 60 sn Kısa Karne. 80 olay/locale `approved` ve bant tabanları (50/18/12), lint `block` 0. İçerik hızı ölçümü başlar (D-112): sprint sonunda "olay/ajan-gün" ve "approved/curated oranı" günlüğe yazılır.

**Riskler.** Gün bütçesi + nakit akışı eşikleri birbirini kırar (tek `tuning.json`; qx kalibrasyonu S5). FTUE gerçek zar demoda ~%45 İSABET gösterir; demo videosu `?seed=` ile sabitlenir. Küratör (sahip) 4 günde 2 locale × 80 olayı TR son sözüyle işler (≤ 25/gün; EN'de yalnızca şema/kural); gün 5'te kapsam kesilirse önce bant tabanları korunur (50/18/12).

**Bağımlılıklar.** S0 K0 tam (B13-03/15 aşama 1 dahil; D-U-N-S gecikmişse EAS dev build gün 3). Sahip: FTUE metinlerinin son okuması (TR), kürasyon 4 gün, EN + TR anadil okuyucu listesi (OPS-04), "iddia ≠ bahis" görüş talebi (LEG-06).

**Tahmini efor.** BACKLOG ile mutabık (v1.2): kod şeridi **17,0 ag** (motor 7, UI/FTUE 5, lint/i18n 2, harness/CI 3) + içerik/hukuk/ops 3,7 ag (içerik ajanı) + sahip 6,7 gün (kürasyon 4, inceleme 2). S2'ye kaydırılan ~5 ag: AC-03-11/12/13/14/20, AC-07-41/43, AC-04-01/02/27, AC-01-11, AC-02-08/09/10/31, AC-07-38, AC-08-04/19.

### 2.3 Sprint 2 — Karakterler, diyalog, durum ekonomisi (8–21 Ara 2026)

**Hedef.** D-062 ve D-067 hissedilir: 8 Tanıdık Yüz + 10 durumsal NPC konuşur (anti-koç kuralı D-095), hayat kalıcı durumdur (iş/ev/ilişki/varlık; kariyer basamakları; barınma; flört zinciri; kedi), NPC'lerin kendi hayatı var (D-072), ANNE ARIYOR D-108 standardıyla, Roast Raporu tam (skor dökümü D-074, paylaşım kartı iskeleti D-068), Eski Müşteriler listesi (D-077/D-115).

**Kapsam.**
1. **NPC sesleri ve lint** — `DL-01..10`, 8 Tanıdık Yüz + 10 durumsal rol yüklemleri (Anne ≤ 8 kelime + `?`, Yağmur ≤ 3, Pamuk 1; NPC'de antitez yasak; "Sen bilirsin/sayıyorum" koç-özel UYARI): AC-04-12, AC-08-10, AC-04-14, AC-07-36, AC-07-37; sabit Tanıdık Yüz adları ve isim üreteci dışlaması (AC-04-11); lint seed listeleri (AC-08-04) ve `--docs` modu (AC-08-19) (v1.2: S1'den).
2. **Hafıza** — `memories ≤ 24`, pinned, `{mem:R:T:*}` derleme kontrolü, `unlockMeta()` yalnızca `metaLogRef`, uzun bas → Defter kaydı: AC-04-07, AC-04-08, AC-04-09, AC-04-10, AC-01-13.
3. **Kariyer ve eğitim** — 24 kariyer veri dosyası (MVP 6 tam / 18 iskelet), terfi pity, kovulma, 9 eğitim yolu, emekli durumu, "Hayat Koçu" kariyeri `careerRival`: AC-04-04, AC-04-05, AC-04-06, AC-04-28, AC-04-29.
4. **Barınma, varlıklar, kefalet, kedi** — 02 kademeleri, ev sahibi zinciri mood 0→1→2→0, `AssetId` (marka/plaka lint), D-070 varlık → olay havuzu kapıları, D-080 freelance satırı: AC-04-21, AC-04-22, AC-04-23, AC-04-24, AC-04-25; kira günü olayı (AC-02-31), gelir tavanı (AC-02-08), "Borç N" + iflas (AC-02-09) (v1.2: S1'den).
5. **İlişkiler** — flört zinciri f1/f2/f3 (göz teması mini oyunu AC-07-45), Yağmur/Sam her hayatta f1, evlilik/boşanma, partner/çocuk cinsiyetsiz havuz, çocuk tipi (1.0 için tip güvenliği): AC-04-15, AC-04-16, AC-04-17, AC-04-18.
6. **Aile Grubu ve ANNE ARIYOR** — `family.unread` monoton (D-121 yumuşatma: "Hepsini oku" 0 → bir hafta sonra 212), "Görüldü, cevap yok", MomCallOverlay AC-07-44 standardı, hayat başına ≤ 3 çağrı, ≥ 6 varyant, 3 ret → Şükran Teyze (D-108): AC-04-19, AC-04-20, AC-03-16 (D-108 sayılarıyla: ≤ 3/hayat), AC-07-44 (v1.2: S0'dan; bağımlılık AC-04-19/20, AC-03-16). Manifest kontrolü (AC-04-30) → S6 cihaz paketi.
7. **Eşik olayları ve NPC ölümü** — Ego/Cringe/Anne geçişleri, `momPressure=null`, sessizlik protokolü: AC-02-18, AC-04-13, AC-02-17 (lowJoy), AC-03-08, AC-08-12, AC-02-20 (Stres görünmez).
8. **Ölüm akışı tam** — Roast Raporu 8 blok, ölüm nedeni yalnızca adım 2, paylaşım kartında `cause` yok, skor dökümü (D-074), EKG → mezar taşı (AC-07-52), ölüm → ilk kelime ≤ 35/40 sn (web ölçümü; cihaz S6), Fizyoterapi tetik koşulları (motor; teklif kartı S4), Fazla Bagaj, absürt kuyruk (AC-02-10, S1'den): AC-02-11, AC-02-13/web, AC-02-15, AC-02-16, AC-02-27, AC-07-52, AC-05-21, AC-02-10. Roast `fontScale` 2,0 / ICU iki platform (AC-02-28) → S4.
9. **Durum şeridi (tam; v1.2: S1'den)** — `LifeStatus` tipi + 4 hücre, `effects.status` zorunluluğu lint'te; işe girince `İş` hücresi `.chg`, ayın 1 maaş `.mundane` + `.float.up`, ayın 5 kira: AC-04-01, AC-04-02, AC-07-41 (statik + dinamik), AC-07-51 (uçan sayılar + daktilo); yatay taşma 4 viewport (AC-07-38).
10. **Şov efektleri D-063 (reduced-motion yollu) + director ritmi (v1.2: S1'den)** — sarsıntı/flaş seviyeleri, haptik bütçesi, `AgeUpOverlay`: AC-07-49, AC-07-50, AC-07-31, AC-07-17, AC-07-43; pity/near-miss/efsane gün (AC-03-12, AC-03-13, AC-03-14), Kalıp Dedektörü (AC-03-20), iddia ikiz hayat + oran + hedef iddiası (AC-03-11, AC-01-11, AC-04-27). Teşhis etiketi, EFSANE çerçevesi, BigStamp (AC-07-46/47/48) → S5 (v1.2 kapasite).
11. **Golden CSV tamamlama** — `trInflect` 2.100 hücre (AC-09-05/2100; TR doğrulaması sahip 1 g). Günün Günü (AC-03-17/web, AC-08-18, AC-02-42/web) → S4 (v1.2 kapasite).
12. **Koçun küçük yalanı** — `lie_vs_slip`, itiraf, `intent.target:'coach'` ≥ %15: AC-01-12. Tanışıklık, Defter, Yorgun ruh hâli 03:12, ses ayarı (AC-01-14/web, AC-01-15, AC-01-16, AC-01-17) → S3 (v1.2 kapasite).
13. **Koleksiyonlar** → S3 (v1.2 kapasite; K3 kapsamıyla aynı): AC-05-22..26, AC-02-23. S2'de yalnızca Teşhis/Sözlük içerik satırları (CNT-04).
14. **İçerik** — 140 olay günü/locale `approved`, bant **18–25 ≥ 80, 26–40 ≥ 35, 41+ ≥ 25 (≥ 10'u 60+)** (CNT-03; durumsal NPC desteleri 10 × 10–12 kartın ilk yarısı); koç bankası ≥ 500 (CNT-04); NPC satırları 13 §5 #11/#12 çıtasıyla; `counter_gag` merdiveni (D-094). EN punch-up yazarı işe alımı (OPS-05; sözleşme S3 gün 1).

**Demo kapsamı (zorunlu).** "Hayat değişiyor": işe giriş → ilk maaş günü akışı → ev sahibi zinciri (Tercüme kartı) → kira zammı kalıcı → Yağmur/Sam f1 (göz teması) → ANNE ARIYOR (3 buton eşit, ahize yok) → bir NPC yaşlanır/ölür → ölüm → Roast Raporu + skor dökümü → Eski Müşteriler listesi. TR/EN ekran görüntüleri; Playwright ANNE ARIYOR ve ölüm senaryoları.

**Çıkış kriterleri / kapı K2.** p95 sürpriz ≤ 14 (AC-03-13, K1'den); **D-112 hız ölçümü S2 sonunda S3–S5 içerik hedeflerini resmen günceller** (`docs/plan/CHANGELOG.md` + §3 tablosu). Harness 04 §6.2 #1–#11, #13–#16 bantlarında (durum izi ihlali 0; kariyer ≥ 1 %97+; Yağmur f1 %100; kedi net valans 0 ± 0,05; anne ölümü medyan 50–56); H-10-11 dialog'lu gün ≥ %60; `momCallsPerLife ≤ 3`; lint DL kuralları negatif setle BLOK; ölüm → ilk kelime web p95 ≤ 35 sn; 140 olay/locale `approved`.

**Riskler.** NPC sesleri tek yazar gibi çıkar (D-095 lint + 13 §5 örnekleri + kör okuma gün 9). 24 kariyer × 2 locale ağır → MVP 6 tam / 18 iskelet. Yılbaşı öncesi sahip erişimi düşük → gün 5 ara demo zorunlu.

**Bağımlılıklar.** S1 K1. Sahip: Tanıdık Yüzler adları/sesleri son onayı (TR), kürasyon 4 gün + golden CSV doğrulaması 1 gün, EN yazar işe alımı (OPS-05).

**Tahmini efor.** BACKLOG ile mutabık (v1.2): kod şeridi **17,0 ag** + içerik/hukuk/ops 3,6 ag + sahip 6,5 gün. S3'e: koleksiyonlar + koçun karakteri; S4'e: Günün Günü + AC-02-28; S5'e: AC-07-46/47/48; S6'ya: AC-04-30.

### 2.4 Sprint 3 — Retention, bildirim, karne, paylaşım (22 Ara 2026 – 4 Oca 2027)

**Hedef.** Çok oturumlu hayat: Mola ritüeli (D-029; cezasız streak, Sakatlık İzni, Telafi), bildirim sözleşmesi D-091 (tek vaat, yalnızca zarf/karakter tetikli, ilk 7 günde ≤ 3, P1 streak-at-risk yok), Sakatlık Raporu D-089 (yoklukta ekonomi donar, tavan 90 gün), Antrenman Kampı (D-019; 18→40 "sezon sonu" ~15 dk, D-115), Kondisyon (D-042), paylaşım kartları (D-068; 9:16 + 1:1), sekme açılışları, ses ayarı sorusu, dil değişimi, Dosya Kodu (D-076), HUD sadeleştirme (D-118: MetaRow 4 çip; görevler Mola sheet'inde, günde 1 absürt görev, ödül yalnızca koç satırı).

**Kapsam.**
1. **Mola ritüeli / streak** — yalnızca günün ilk kararı, `days` azalmaz, otomatik İzin 2 slot/7 günde 1, Telafi 48 sa/30 günde 1 ücretsiz, hafta sonu muafiyeti, 8 kilometre taşı (66 = Lally), MolaPill iki hâl (geri sayım yok, D-091), kırmızı yok: AC-05-01, AC-05-02, AC-05-03, AC-05-04, AC-05-05, AC-05-06, AC-07-23.
2. **Koç görevleri D-118** — günde 1 absürt görev, deterministik `daily` kanalı, ödül yalnızca koç satırı (Kondisyon puanı yok — AC-05-07'nin "ödül yalnızca Kondisyon puanı" ibaresi D-118 ile "ödül yalnızca koç satırı" olarak uygulanır), gerçek dünya fiili lint: AC-05-07/web (D-118 metniyle; cihaz kısmı S6), AC-05-08.
3. **Bildirim** — motor `notification-plan` efekti; planner tavanları (günde ≤ 1, kayan 7 günde ≤ 5, 22:30–09:00 yok, planlı ≤ 12, ufuk ≤ 30 gün, Android `notBeforeLocal ≤ 21:15`); reconcile `getPending → diff` (D-117 #11); **streak-at-risk planlanmaz** (AC-05-13 ve H-10-09 D-091 ile "0" olarak uygulanır); soft-ask tek vaat metni, "Şimdi değil" → bir daha sorulmaz, Android `POST_NOTIFICATIONS` 2. oturumdan önce asla; `lifeEnded` → iptal; başlıkta NPC adı "oyundaki/in-game"; lapsed L21 son: AC-05-12/web, AC-05-13 (D-091: yok), AC-05-14, AC-05-15, AC-05-16/web, AC-01-19, AC-10-19/web, AC-07-12, AC-10-26 (soft-ask kısmı). Bildirim cihaz kısımları (/cihaz) S6.
4. **Yokluk ve Sakatlık Raporu** — `advanceTime` D-089 (ekonomi donar, `pendingDeathRisk` yok, tavan 90 gün, invariant'lar), rapor 3–6 kart ≤ 40 sn atlanabilir, 14+ günde "büyük bekleyen karar" rafta: AC-02-41 (D-089 metniyle; v1.2: kod S0'dan), AC-05-17, AC-05-18, AC-02-36 (oturum simülasyonu `sessionDayIndex` save/load), AC-03-06.
5. **Antrenman Kampı** — `hash(isoWeek+locale+contentHash)`, Pazartesi 00:00 yerel, 40 hayali bot headless (perf), "hayali/fictional" etiketi %100, KMP kodu, 2 tema (MVP): AC-05-09/web, AC-05-10/web, AC-05-11, AC-07-22, AC-01-10'un Kamp satırı etiketi (H-10).
6. **Kondisyon ve açılımlar** — her ölümde ≥ 1 (Yedek Kulübesi pity), güç testi harness'ta, "Aynı kondisyonla": AC-05-19, AC-05-20, AC-02-14, AC-07-20 (v1.2: ilk teslim S1'den buraya).
6a. **Koleksiyonlar ve koçun karakteri (v1.2: S2'den)** — Teşhis 30 (3 otomatik, 5 gizli; adlar sayı/durum temelli D-121), Sözlük (Tercüme kartı `document` ≤ %15), Onyıl Karnesi 30/40 (kimlik alanı yok): AC-05-22, AC-05-23, AC-05-24, AC-05-25, AC-05-26, AC-02-23; Tanışıklık, Defter girdileri, Yorgun ruh hâli 03:12, ses ayarı anlık: AC-01-14/web, AC-01-15, AC-01-16, AC-01-17.
7. **Paylaşım kartları** — Karne (YILIN MOTTOSU, 6 not, seed `HYT-…`, wordmark; gerçek tarih/şehir/para sembolü/mağaza linki yok), Roast kalıp, Lally, Kamp kıyas, ölüm özeti (D-068); web'de canvas indirme; Dosya Kodu D-076: AC-07-21/web, AC-05-27, AC-05-28 (bağımlılık AC-07-21/web).
8. **Sekmeler, ayarlar, dil** — sekme açılış kuralları; ses ayarı kartı ilk "Bugünlük yeter"den sonra bir kez; Ayarlar: Şov Tam/Az/Kapalı, Daktilo, hız kalıcılığı; dil anlık, geçmiş balonlar değişmez: AC-07-11, AC-07-13, AC-07-14, AC-09-17/web, AC-07-15, AC-07-16.
9. **Hayatlar arası hafıza ekranda** — meta satırı ilk balonda, "Geçen hayatta bunu seçmiştin" rozeti (D-078), Kronik, Eski Müşteriler (son 3 tam + arşiv salt okunur; **hiçbir defter silinmez** D-115): AC-01-13 (UI), AC-05-21.
10. **Satır puanı** — koç balonuna uzun basış iki ikon; seçim `line_rating` okumaz: AC-11-18.
11. **Kill-restart / kayıt dayanıklılığı** — `sessionStore` MMKV `{dayIndex, flowRemainingMs, speed}` `SUSPEND`'de; `RESUME` eşleşirse devam; 3 nesil + `meta_backup` senaryoları UI'da `sys.*` satırlarıyla: AC-10-09 (UI), AC-02-27 (web kill-restart), AC-07-28 (çevrimdışı akış web `offline:true`).
12. **İçerik** — 200 olay günü/locale `approved` (bant 18–25 ≥ 105, 26–40 ≥ 55, 41+ ≥ 40; CNT-05); koç bankası **700/locale (MVP, AC-01-02 metin bölümü)** + 80 iddia + 108 motto + 40 bildirim + 20 welcome-back; 41+ mekanizma satırları (D-125 için ilk 10); bildirim/push rubriği D-096(g). **AC-01-04 eşiği** ("aynı satır 3+" < %2) 700 satırla burada bağlanır.
13. **EN punch-up dalga 1 (v1.2)** — S3 gün 1: EN yazar sözleşmesi + **FSEK m.52 devri ilk katkıdan önce** (LEG-08); ~70 Tier A olay + ilgili karne/motto/iddia satırları `en.punched` (CNT-06). Yazar S3 gün 1'de yoksa Tier A 200 → 120 B planı **S3 sonunda** tetiklenir (S5 beklenmez).

**Demo kapsamı (zorunlu).** İki "oturum" (saat mock'u ile): 1. oturum → "Bugünlük yeter" (reklamsız, buton hiyerarşisi sabit) → ses ayarı kartı → soft-ask (tek vaat metni) → 2. oturum dönüşü "kaldığın yer" → zarf çözücüsü 1.–2. günde → Sakatlık Raporu (30 gün yokluk mock'u: bakiye değişmedi) → Mola sheet (günün görevi, Telafi bilgisi) → Kamp tablosu (hayali kohort) → Karne paylaşım kartı PNG indirme (9:16 ve 1:1). Bildirim planı `window.__mottoEffects` ile görünür.

**Çıkış kriterleri / kapı K3.** 05 §6.2 property testleri (streak 10.000 gün dizisi; planner 90 gün: > 1/gün 0, > 5/7 gün 0, sessiz saat ihlali 0, **at-risk 0**; AbsenceEngine deterministik, raporda ölüm 0, D-089 bakiye invariant'ı); Kamp kohortu medyan 45–65; Kondisyon güç testi gürültü bandında; Playwright paylaşım kartı regex'leri; 700 koç satırı `approved`, AC-01-04 (aynı satır 3+ < %2, cooldown ihlali 0) ve lint `block` 0; 200 olay/locale ve bant tabanları; EN punch-up dalga 1 (~70 Tier A) `punched` ya da B planı kararı yazılı.

**Riskler.** Yılbaşı haftası: sahip 6,5 gün bütçeli (§1.4; kürasyon 22–24 Ara ve 28 Ara – 4 Oca), gün 5 ve 10'da erişilebilir olmalı; kürasyon gecikirse önce bant tabanı korunur. Bildirim cihaz davranışı web'de test edilemez → jest port testleri + S6 cihaz smoke. `motto-clock` native doğrulaması S6.

**Bağımlılıklar.** S2 K2 (D-112 hız güncellemesi dahil). Sahip: EN yazar sözleşmesi + FSEK devri S3 gün 1 (LEG-08). Avukat: bildirim metinleri örneklemesi (hafif, S4'e kayabilir).

**Tahmini efor.** BACKLOG ile mutabık (v1.2): kod şeridi **15,5 ag** (retention motoru 5, bildirim/kayıt 3, paylaşım/UI 3, koleksiyon/koç 3, harness 1,5) + içerik/hukuk/ops 3,6 ag + EN yazar 20 sa/hafta + sahip 6,5 gün.

### 2.5 Sprint 4 — Monetizasyon, rıza, hukuk ekranları (5–18 Oca 2027)

**Hedef.** Para ve rıza katmanı, **rıza öncesi SDK yasağı** ile: ConsentGate tek modeli (D-104: nötr yaş kapısı ilk ekran, aydınlatma tek satır ilk açılış, açık rıza kartları ilk reklam fırsatından hemen önce ya da 2. oturum ilk Mola kararından sonra, ATT 3. oturum), `isMinor` yolu (D-102), yurt dışı aktarım anahtarı **yok** (D-103), Torpil + Restore (D-038/D-082(a)/D-116), rewarded R2 (maaş günü `MundaneLine`, +%25/6 ay) ve R3 (açık metin, oturumda ≤ 1) — **R1 Ek Antrenman MVP'de yok** (D-085), dönüş interstitial'ı (D-084), MA A/B yok (D-105), "Gerçek hayatta yardım" ekranı (D-052), hukuki belgeler TR+EN, karanlık desen checklist'i 15 kutu (06 §6.4 + D-115 #15).

**Kapsam.**
1. **Nötr yaş kapısı + aydınlatma** — ilk görünen öge (siyah zemin, tek tekerlek, boş varsayılan, ≤ 2 sn), doğum yılı saklanmaz, `isMinor` boolean; aydınlatma tek satır + bağlantı; Sentry `enabled: aydınlatmaGösterildi`; expo-updates `checkAutomatically:'NEVER'` + ilk etkileşim sonrası manuel: AC-08-16/web, AC-07-04'ün "kapıdan sonra" FTUE sayaçları düzeltmesi (bot akışı kapıyı ≤ 2 sn'de geçer), AC-10-25, AC-10-11'in "ilk karttan önce ağ çağrısı yok" kuralı (web proxy logu).
2. **ConsentState tek kaynak** — `{adsPersonalized, analytics, isMinor}`; `consent/cards.json`; ST-08 şema kontrolü (kart anahtarları alanlarla birebir); TR'de aydınlatma ve açık rıza ayrı kartlar, anahtarlar kapalı, [Reddet] eşit; reddeden oyuncu tam oynar; rıza yeniden sorma yalnızca Ayarlar ya da metin sürümü artınca (D-105), `consent.reaskCount` harness: AC-06-13/web, AC-11-04, AC-08-15 (rıza kartı kısmı), AC-08-20, AC-06-07.
3. **AdProvider** — UMP → (iOS) ATT ön-ekranı (3. oturum) → `initialize()`; `isMinor` → `tagForUnderAgeOfConsent:true` + `requestNonPersonalizedAdsOnly:true`, ATT atlanır; `maxAdContentRating:'T'` tek değer, uzak-konfigde `adRating` yok; `canShow`: Torpil → interstitial false; `phase ∈ {dead,roast}` false; `playTimeMs < 10 dk` false; dönüş yerleşimi ≥ 6 saat ara + 3. oturum + günde ≤ 2 + 5 sn kapatılabilir: AC-10-20 (bağımlılık AC-08-16/web), AC-06-14/web, AC-06-15 (D-105: A/B yok), AC-06-08 (D-084 metniyle: dönüş yerleşimi, `sessionEnd` reklamsız; bağımlılık AC-06-13/web), AC-06-11 (bağımlılık AC-06-13/web), AC-06-24 (D-084 ile: duyuru satırı dönüş kartından sonra), AC-07-18, AC-10-18 (v1.2: property + RNTL tek paket, S1'den), ölüm/roast/near-miss günlerinde `ad-opportunity` yok (AC-03-25).
4. **Rewarded yerleşimleri** — R2 Forma Sponsoru maaş günü satırında, `report_card` fazında `RewardedOffer` yok (AC); R3 Taktik açık metin, yalnızca `check`'siz olaylarda, oturumda ≤ 1, `tactic:true` olay payı ≥ %40 şema hedefi; Fizyoterapi ömürde 1, ölüm akışında asla; valence ≤ −1 sonucunun altında teklif kartı yok (negatif test); ödül yalnızca `EARNED_REWARD`, `pendingGrants` çökme sonrası tek kez; tavanlar saat manipülasyonuna dayanıklı; `no_fill` → ödül yine (D-ÖNERİ-10-13): AC-06-09 (D-085 kümesiyle: R1 yok), AC-06-10, AC-02-16 (teklif kartı), AC-06-16 (bilet `tickets_5` rezerve, satışta değil — D-115; grant mantığı testi).
5. **IAP** — RevenueCat `configure(anonUUID)` soğuk başlangıç +5 sn; Torpil non-consumable; Restore her zaman görünür; HMAC önbellek + `AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY`; iade → ≤ 1 açılış içinde kapanış, arşiv gizlenir silinmez; Android `PENDING`/iOS Ask to Buy; fiyat yalnızca `priceString`; Torpil kartı yalnızca build'de açık `features[]` (MVP'de Kader satırı yok); Torpil teklifi **yeni hayatın ilk Kısa Karnesi sonrası**, ömürde bir kez (D-115): AC-06-04 (yeniden), AC-06-06, AC-06-17, AC-06-18, AC-06-20, AC-06-23 (D-115 zamanlaması), AC-07-29, AC-10-27/ekran (Restore görünür, yalnızca `priceString`; bağımlılık AC-06-06), AC-06-05 (Torpil açık/kapalı harness), AC-06-12/web ("Son reklamı bildir"). Cihazda sandbox (AC-06-01/02/03) → S6 cihaz kapısı.
6. **Analytics** — `AnalyticsEvent` allowlist 42, `never-log`, consent-gate 18 senaryo, yerel Koçun Raporu + dışa aktarım + "Raporu sil", `tools/report-aggregate`; MVP build'inde Firebase paketi yok: AC-11-01/web, AC-11-02, AC-11-03 (web proxy ile), AC-11-06/web, AC-06-22, AC-11-16 (formül paritesi hazırlığı).
7. **"Gerçek hayatta yardım" ekranı** — §2.5 içerik, çevrimdışı, konum izni yok, `tel:/sms:` + web yedeği, reklam/mağaza derleme zamanında yok, analitik olayı yok; koç balonu/lime/Fraunces/haptik yok; lowJoy tetikleyicisi bir kez: AC-08-11, AC-07-32, AC-01-10.
8. **Hukuki belgeler ve lint** — Gizlilik, Aydınlatma, Açık Rıza (ayrı), Koşullar, 16+ metni, kurgu feragatı, Lisanslar TR+EN; link kırıklığı release `block`; `legal/data-inventory.json` = Data safety = Privacy Label; SDK PR'ında envanter zorunlu; ST-10/11; yaş anketi cevap anahtarı (D-107): AC-08-15, AC-10-22, AC-11-25, AC-06-21, AC-08-13, AC-08-05, AC-08-06, AC-08-07, AC-08-08, AC-08-21, AC-08-22.
8a. **Günün Günü ve tarih/sayı golden'ları (v1.2: S2'den)** — deterministik `day:localDay:locale:contentHash`; hassas gün listesi RL-31 (D-109 ile üst barda yıl yok): AC-03-17/web, AC-08-18, AC-02-42/web (ICU tarih golden; takvimde gerçek tarihli olay 0); Roast `fontScale` 2,0 + ICU gruplama (AC-02-28). VERBİS muafiyet kontrolü (LEG-09, S7'den). `release.yml` kuru çalıştırma → S6 gerçek build sır listesi (OPS-06).
9. **İçerik** — 240 olay günü/locale (bant 18–25 ≥ 125, 26–40 ≥ 70, 41+ ≥ 45; CNT-07); EN punch-up dalga 2 ~70 Tier A (CNT-08); Kader havuzu **başlamaz** (soft launch + Torpil; avukat okuması S5), `showcase` havuzu ≥ 30 satır/locale (AC-01-25) ve mağaza metinleri `store/{tr,en}` ST-* lint (AC-08-14).

**Demo kapsamı (zorunlu).** Web export'ta mock sağlayıcılarla: nötr yaş kapısı → aydınlatma satırı → FTUE → 10 dk oyun saati mock → ilk reklam fırsatı öncesi rıza kartları (TR sürümü; EEA debug coğrafyası sürümü) → `isMinor=true` yolu (kişiselleştirme anahtarı yok) → maaş günü Forma Sponsoru teklifi (`no_fill`'de ödül yine) → ≥ 6 saat ara mock → dönüş interstitial'ı (5 sn'de kapat) → Torpil kartı (mock satın alma) → Restore → iade mock'u → "Gerçek hayatta yardım" ekranı → Ayarlar › Gizlilik seçenekleri. Karanlık desen checklist'i ekran görüntüleriyle 15/15.

**Çıkış kriterleri / kapı K4.** `import-graph` statik testi: rıza öncesi reklam/analitik/Sentry import'u yok; 18 rıza senaryosunda red'de dış sink çağrısı 0; ST-08 şema kontrolü yeşil; karanlık desen 15/15; AC-06 negatif test (valence ≤ −1 altında teklif yok) yeşil; hukuki belgeler yayında ve avukat incelemesinde; **SCC teyidi ve 16+ muhtırası** durumu yazılı (geldiyse uygulanır; gelmediyse B planı bayrakları: `ads.tr.enabled=false`, `tr.storefrontRating=18+` konfigde hazır).

**Riskler.** Avukat gecikmesi → TR reklam SDK'sı kapalı (D-103) ve/veya TR 18+ beyan (D-107); AdMob 17.x → 16.5 pini; RC pod → 10.x pini. Hepsi S0'da hazırlanmış B planları.

**Bağımlılıklar.** S3 K3; avukat (rıza/aydınlatma metinleri, SCC, 16+); sahip (AdMob/RevenueCat hesapları, test kimlikleri, ürün id `torpil` iki mağazada; TR 199,99 ₺ kademesi teyidi D-123(f)).

**Tahmini efor.** BACKLOG ile mutabık (v1.2): kod şeridi **12,8 ag** (rıza/yaş kapısı 3, reklam 3, IAP 2, analytics 1,5, hukuk ekranları/lint 2, Günün Günü/golden 1,3) + içerik/hukuk/ops 2,9 ag + EN yazar + sahip 4,3 gün (hesaplar, avukat, metin onayı, kürasyon 2).

### 2.6 Sprint 5 — İçerik 300 olay günü (+200 stretch), EN punch-up son dalga, harness ayarı, mağaza kaydı, Faz 0 kreatifleri (19 Oca – 1 Şub 2027)

**Hedef.** İçerik soft launch hacmine (D-112: **300 olay/locale**, bant 18–25 ≥ 150 / 26–40 ≥ 100 / 41+ ≥ 50) ulaşır — **zorunlu hedef 300 `approved` + bant tabanları**; D-092'nin 1.0 eşiğine (≥ 500 olay) yönelik +200 `curated` yalnızca **stretch**tir (soft launch ihtiyacının dışında; D-112 S2 hız ölçümü sonrası güncellenen hedef geçerlidir). Tier A EN punch-up %100 `punched` (G1 ön koşulu, D-114) — S3/S4'te iki dalga yapılmış olduğundan S5'te yalnızca kalan ~60 Tier A + kör testler. Mağaza kaydı ve CA/NZ ön kayıt sayfaları sprint sonunda incelemeden geçer; Faz 0 kreatifleri üretilir (harcama S6 gün 1). `tuning.json` kilitlenir (qx kalibrasyonu TÜİK satırıyla, D-123(c)); tekrar hedefleri (D-126); Kader havuzu (Torpil, soft launch) avukat okumasıyla; 41–60/60+ mekanizma satırları (D-125).

**Kapsam.**
1. **İçerik hacmi** — 300 `approved` + bant tabanları **zorunlu** (CNT-09; 40 zincir düğümü 03 §1 soft launch tablosu); +200 `curated` stretch; Tier B'de 09'daki **%20 insan örneklemi** yolu, ajan ön elemesi `curated-candidate` durumuna yazar, küratör yalnızca seçer (≤ 25 olay/gün; sahip 5,5 gün ≈ 140 olay/locale TR son söz); koç satırı 1.000 → 1.300 (soft launch); iddia 160; motto 216; Teşhis 45; Sözlük 60; Tanıdık Yüzler 8 × 4; meta-callback 100; Kamp teması 8; bildirim 60 + welcome-back 30: AC-01-02 (soft launch sayılarıyla), AC-09-25 (haftalık `content-report`).
2. **EN punch-up dalga 3 ve anadil testleri** — Tier A'nın kalanı (publisher demosuna girecek 200 olaydan dalga 1–2 sonrası ~60 + kalan karne/motto/iddia/Roast satırları) `en.punched:true` (CNT-11); `reviewedRev == rev`; 5 anadil EN okuyucu "çeviri kokusu" ≤ 1/20; TR için de 5 okuyucu (D-096(c)); 50 satırlık kör test ≤ 2/50: AC-01-22, AC-01-23 (D-097 eşiğiyle ≥ 18/25), AC-09-13, AC-09-12. EN 5 anadil playtest (AC-09-26) → S8 (CA/NZ öncesi).
3. **Pipeline kapıları** — provenance (`review.promptRev`, `content/provenance/<id>.jsonl`), rakip metin benzerlik testi (D-111; eşik üstü → needs-review), swap tablosu 52 satır, `localizedShell`/`localeOnly` ikiz-parite H-09-01/02, CSV round-trip, pseudo-locale 25 ekran, font cmap: AC-09-24, AC-09-21, AC-09-04, AC-09-14, AC-09-23, AC-09-15, AC-09-19, AC-09-20, AC-09-16 (manifest `locales` zorunlu).
4. **Harness ayarı** — qx kalibrasyonu (medyan ölüm 72–78; p05 ≥ 42; `safe` ≥ 82, `chaotic` ≥ 64), gösterilen gün 450–600 (medyan 460–520), 12 sn/gün çapası, `dead-content.json` (MVP uyarı), görülme dağılımı grafiği (data room), tekrar: "ilk 3 hayatta 18–25'te aynı olay 2. kez" < %20, 40 zincir 10k hayatta ≥ 1 kez tamamlanır: AC-02-02 (kilit), AC-02-03..06 (yeniden), AC-03-21, AC-03-23 (tekrar eşikleri), AC-03-05, AC-10-15 (gecelik 10k × 2 × 3 ses), H-15 mekanizma Shannon çeşitliliği (D-094), plain oranı ≥ %25, `intent.target:'coach'` ≥ %15 (D-120).
5. **Yaş bantları ve Hızlı Yaşa** — 41–60 "yanlış hatırlayan tanık" + eski iddiaları yeniden açma, 60+ seminer anıları (bant başına ≥ 20 benzersiz mekanizma satırı), Hızlı Yaşa varsayılan kapalı + 36. doğum günü tek soruluk teklif + Ayarlar (D-092): AC-01-08 (yeniden), AC-02-02 (Hızlı Yaşa 350–420), 02 §2.1.3 metni.
6. **Kader havuzu (Torpil, soft launch)** — aynı şema, 5 öz mekanizma, Motto ile aynı `intent` yasak (lint), "yukarı/upstairs", ahiret sözlüğü, genelleme, "rüşvet" 0; mağaza/ilk 60 sn'de görünmez; EN **Fate**, **Counter 7**; H-12 kapsama ≥ %60 (yalnızca açılan slotlarda); **avukat okuması** (00 açık soru 3): AC-01-18, AC-08-14 (Kader vitrinde 0).
7. **Lint tamamlama** — katalog 71 kural, kural başına TR+EN pozitif/negatif fixture %100, genelleme dedektörü 200 cümle recall ≥ %95 / precision ≥ %80, kota QT-01..10, `substance_ref` tavanı (≤ %3 havuz, oturumda ≤ 1): AC-08-02 (tam), AC-08-09, AC-08-08.
8. **Demo build tanımı (D-126)** — publisher demo build'inde 2. ömür Hızlı Yaşa (oyuncu açar) ile kısa ve farklı yaş bandında; `?seed=` ile tekrarlanabilir.
9. **Şov efektleri (v1.2: S2'den)** — Teşhis etiketi, EFSANE çerçevesi, BigStamp: AC-07-46, AC-07-47, AC-07-48 (reduced-motion yolu S2'de AC-07-17 ile hazır). `tools/report-aggregate` (AC-11-07, S1'den) R3 playtest için.
10. **Mağaza kaydı (v1.2: S6'dan)** — ASC/Play uygulama kaydı, gizlilik politikası URL'si (S4 belgeleri), Privacy Label / Data safety (`data-inventory`), Apple/IARC yaş anketi (08 §2.6; "simulated gambling" cevabı "iddia ≠ bahis" görüşüne bağlı), CA/NZ ön kayıt sayfaları (11 §2.4: Faz 0 hedef sayfası) — sprint sonunda incelemeden geçmiş (OPS-07).
11. **Faz 0 kreatif üretimi (v1.2)** — 5 kreatif (11 §2.5.1 Faz 0'ın ilk haftası): web build ekran kaydı + sahip cihaz kaydı; manifest `realGameplay:true`, `aiTestimonial:false`, `influencerAdLabel:true`; UA hesapları kurulur (OPS-08). "Wagers" / "Bets against you" ifadeleri yalnızca "iddia ≠ bahis" görüşü olumluysa; değilse "Koç tahmin eder, yanılınca damga basar" sürümü.
12. **R3 playtest başlangıcı (v1.2)** — katılımcılar S5'te toplanır (iki locale × 5–8; 18+, tester sözleşmesi; OPS-09), playtest S5 son 3 gününde web + TestFlight internal ile başlar, S6'da tamamlanır.
13. **Hukuk (sert kapılar)** — "iddia ≠ bahis" avukat görüşü **son tarih S5** (LEG-07): S6 mağaza metadata'sı, Faz 0 kreatifleri ve IARC/Apple yaş anketi bu görüş olmadan gönderilmez; Kader havuzu okuması (LEG-10).

**Demo kapsamı (zorunlu).** Üç ardışık hayat (web, saat mock'u): 1. hayat tam; 2. hayat Tanıdık Yüzler hatırlıyor ("Rehberde bir isim var."), Fazla Bagaj callback, Hızlı Yaşa teklifi 36'da; 3. hayat Kronik Teşhisi + "Geçen hayatta bunu seçmiştin" rozeti; Torpil açıkken Kader kişiliği (yalnızca demo bayrağıyla, mağaza yüzeyinde değil). `sim-report.html` + `dead-content.json` + görülme dağılımı grafiği artifact'ta. EN demosu yalnızca Tier A `punched` %100 ise gösterilir (AC-11-19).

**Çıkış kriterleri / kapı K5.** 300 olay/locale `approved` ve bant tabanları (150/100/50); 500 `curated` yalnızca stretch (kapıyı etkilemez); Tier A `punched` %100; mağaza kaydı + CA/NZ ön kayıt sayfaları incelemeden geçmiş; Faz 0 kreatifleri hazır ve kreatif lint yeşil; "iddia ≠ bahis" görüşü yazılı (yoksa metadata/kreatif B planı sürümü seçilmiş); R3 playtest başlamış; funny-check geçme oranı ilk deneme ≥ %60 TR / ≥ %50 EN; anadil testleri kapıda; gecelik harness tüm H eşikleri (sıkı) yeşil, qx kalibrasyonu kilitli (`tuning.json` sürüm etiketi); lint kural kapsaması %100; Kader havuzu avukat notu.

**Riskler.** İçerik hızı yetmezse önce bant tabanı (150/100/50) korunur, stretch 200 `curated` düşer; 2. küratör bütçesi **yok** (D-112). Sahip bu sprintte ~10 gün bütçeli (§1.4) — en yoğun sprint. EN yazar S3'te alınmamışsa B planı (Tier A 200 → 120) S3 sonunda zaten tetiklenmiştir; S5'te yalnızca kalan dalga yapılır. Apple/Google mağaza incelemesi 1–3 gün → kayıt gün 6'da gönderilir. 60+ malzeme azlığını H-05 sessizlik oranı gizleyebilir; harness izler.

**Bağımlılıklar.** S4 K4 (hukuki belgeler yayında → gizlilik URL'si); EN punch-up yazarı (sözleşme + FSEK devri S3'te imzalı); 5+5 anadil okuyucu (OPS-04); avukat ("iddia ≠ bahis" son tarih, Kader); D-U-N-S + organizasyon hesapları (S0).

**Tahmini efor.** BACKLOG ile mutabık (v1.2): kod şeridi 6,8 ag (pipeline/lint 3, harness 2, şov efektleri 1,8) + içerik/hukuk/ops 9,4 ag (içerik 7,5, mağaza kaydı/Faz 0/playtest 1,8) = **16,2 ag** (kod ajanları içerik şeridine kayar) + sahip 10,1 gün + EN yazar 20 sa/hafta.

### 2.7 Sprint 6 — Soft launch hazırlığı: TestFlight / Play internal, Faz 0 yürütme, mağaza paketi (2–15 Şub 2027)

**Hedef.** Cihaz kapıları kapanır (sahibin **3 cihaz günü**, sprint başında bloklu; TestFlight/Play internal), Faz 0 marketability **yürütülür** (kreatifler ve ön kayıt sayfaları S5'te hazır; harcama **gün 1**; CA'da K1 ve K3 × 300 $; eşik ≥ 150 tık ve ≥ 50 kurulum, D-114; 10 gün test + 4 gün vitrin iterasyonu), mağaza paketi (ASO D-106/D-111, 4+ vitrin, `aso-lint`), `release.yml` gerçek build (`eas submit` internal), privacy manifest, KVKK m.9/4 bildirimi (≤ 5 Şub). **G0 kapısı.** Publisher build-for-review checklist'i S7'ye kaydı (G1 öncesi zorunlu değil).

**Kapsam.**
1. **Cihaz smoke 14 madde (10 §6.1)** iki platformda (haptik/ses, bildirim/Doze/64 tavanı, UMP/ATT, rewarded iki pin, sandbox satın alma/restore/iade, arka plan → ön plan, 16 KB `zipalign`, Reduce Motion, VoiceOver/TalkBack tam ömür D-082(c)): AC-06-01, AC-06-02, AC-06-03, AC-10-10, AC-10-11, AC-10-13, AC-01-20, AC-01-21, AC-07-26, AC-07-27, AC-07-24, AC-07-25, AC-09-18, AC-11-05, AC-04-30 (manifest; S2'den). **Tüm `/cihaz` satırları (v1.2, OPS-11):** AC-02-02, AC-02-13, AC-02-37, AC-02-42, AC-03-17, AC-03-18, AC-07-05, AC-07-21, AC-10-03, AC-10-12, AC-10-19, AC-01-14, AC-05-07, AC-05-09, AC-05-10, AC-05-12, AC-05-16, AC-09-17, AC-06-12, AC-06-13, AC-06-14, AC-08-16, AC-11-01, AC-11-06 — min-spec Android (tercihen Galaxy A1x) + iPhone, kayıt `CIHAZ-KAYITLARI.md`. B13-03 / B13-15 aşama 2 burada kapanır.
2. **Build ve mağaza teknik** — `release.yml`: EAS production build, `bundletool` boyut (AAB ≤ 35 MB, iOS ≤ 50 MB), `zipalign -P 16`, privacy manifest grep (`CA92.1`, `C617.1`, `E174.1`, `35F9.1`), `billing-ktx ≥ 9` kontrolü, `content-release.yml` Cloudflare Pages prod: AC-10-21, AC-10-23, AC-07-30, AC-06-19, AC-10-16 (e2e sahte manifest) (OPS-13).
3. **Mağaza paketi** — kayıt S5'te incelemeden geçti; burada başlık/alt başlık ≤ 30, anahtar kelime ≤ 100, 5 ekran görüntüsü = 5 imza cümle (4+ havuzu; ekran görüntüsü 4 D-106), açıklama vaatleri D-106, 3 Custom Product Page'de "life simulator" ilk görsel, `store/{tr,en-US}` limitleri, sürüm notu şablonu: AC-11-23, AC-09-22, AC-08-14, AC-01-25. "Wagers" yalnızca "iddia ≠ bahis" görüşüyle (LEG-07).
4. **Faz 0 marketability yürütme** — harcama gün 1; CA'da 2 kreatif (K1 damga çarpması 0. saniye; K3 ANNE ARIYOR birincil) × 300 $ + TR hücreleri; hedef sayfa CA/NZ ön kayıt (11 §2.4); sessiz sürümler (altyazı yakılı); IPM asıl metrik; kreatifteki her mekanik build'de birebir: AC-11-10 (D-114 sayılarıyla), AC-11-04 (CA/NZ bilgi kartı düz dil), AC-08-14 (kreatif lint) (OPS-12).
5. **Analytics canlıya hazırlık** — GA4 derleme bayrağı (yalnızca rızayla; TR build'inde MMP SDK'sı yok), gün metrikleri formül paritesi, `kpi.md` şablonu, haftalık rapor otomasyonu: AC-11-11, AC-11-16, AC-11-09 (kahkaha günlüğü şablonu).
6. **MVP R3 playtest tamamlanır** (S5 sonunda başladı; iki locale ayrı, 5–8 kişi): TTFL ≤ 10 sn (5/8), TTFD ≤ 25 sn, ilk oturum ≥ 8 dk, Bir Yıl Daha ≥ %70, ölüm → yeni hayat ≥ %60, aynı satır 3+ < %2, "nasihat" 0, cringe ≤ 1/oturum: AC-11-08, AC-01-24.
7. **Hukuk** — KVKK m.9/4 standart sözleşmeler + Kurum'a 5 iş günü bildirimi **AdMob, Sentry, RevenueCat, GA4** için, en geç 5 Şub (LEG-11); CA + NZ marka koruması (LEG-12); EUIPO/USPTO (LEG-13).
8. **İçerik** — 300 `approved` kilidi (içerik paketi `c1` imzalı, D-081 aylık paket takvimi başlar; CNT-12); `kill-switch` tatbikatı (OPS-14).

**Demo kapsamı (zorunlu).** Build-for-review demosu: web export (prod konfig, mock sağlayıcılar) + sahibin cihazından TestFlight/Play internal ekran kayıtları (haptik, bildirim, rewarded test reklamı, Restore); mağaza ekran görüntüleri 5 × TR/EN; Faz 0 kreatif K1/K3 ve ilk IPM/CTR okuması; `kpi.md` şablonu doldurulmuş playtest raporu.

**Çıkış kriterleri / kapı K6 = G0.** Cihaz smoke 14/14 iki platformda ve tüm `/cihaz` satırları yeşil; crash-free (internal) ≥ %99,5; Faz 0 hücreleri eşikte okunur ve IPM/CTR raporu (okunmazsa karar mağaza dönüşümüyle, not düşülür); `aso-lint` yeşil; Privacy Label = Data safety = `data-inventory`; KVKK m.9/4 bildirim kanıtı (TR reklam SDK'sı açılacaksa); R3 playtest çıkışları (AC-11-08) iki locale'de karşılanmış ya da iterasyon kararı isimlendirilmiş (hangi sistem); EUIPO/USPTO başvurusu en geç soft launch günü için hazır (D-111).

**Riskler.** Cihaz kapıları sahibin zamanına bağlı → 3 cihaz günü sprint başında bloklu (gün 1–3); bir `/cihaz` satırı kırmızıysa düzeltme gün 4–8, yeniden smoke gün 9. TestFlight external review → internal track. Faz 0 harcaması gün 1'de başlamazsa (mağaza incelemesi gecikmesi) okuma S7'nin ilk günlerine taşar; G0 yine de "okunmaz" etiketiyle kapanır.

**Bağımlılıklar.** S5 K5 (mağaza kaydı, kreatifler, "iddia ≠ bahis" görüşü); sahip cihazları (iPhone + orta segment Android, tercihen Galaxy A1x), App Store Connect/Play Console erişimi, UA hesabı (Apple Search Ads / Google Ads), avukat (16+ muhtırası son hâli; KVKK bildirimi).

**Tahmini efor.** BACKLOG ile mutabık (v1.2): kod şeridi 10,2 ag (cihaz düzeltmeleri 4, release/CI 3, mağaza 1,5, analytics 1,5) + içerik/hukuk/ops 4,1 ag + sahip 8,1 gün (cihaz 3, Faz 0/UA, konsollar, hukuk).

### 2.8 Sprint 7 — Soft launch TR, Faz 1 hafta 1–2 (teknik açılış) (16 Şub – 1 Mar 2027)

**Hedef.** TR'de iki mağazada aynı gün açılış (AC-11-12); 11 §2.5.1 Faz 1'in (**4 hafta**, 16 Şub – 15 Mar) ilk yarısı: G1 teknik maddelerinin ölçümü (AC-11-13), TR reklam SDK'sı yalnızca SCC/m.9-4 yazılı teyidi ve KVKK bildirimi varsa açık (D-103), aksi hâlde reklamsız açılış; TR Android rewarded eCPM 14 günlük ölçüm başlar (AC-11-14, S8'de okunur); haftalık `kpi.md`; kill-switch/içerik paketi canlı; kriz protokolü; publisher build-for-review checklist'i (S6'dan).

**Kapsam.**
1. **Açılış** — TR storefront'lar (Apple kademesi anket çıktısı; 16+ muhtırası yoksa 18+ beyan), Play production (kapalı test → production), atribüsyon mağaza tarafı (Apple kampanya linki / Play UTM; MMP yok): AC-11-11, AC-11-12 (TR kısmı), AC-08-13 (yayın konsol kaydı).
2. **G1 teknik maddelerinin ölçümü** — crash-free ≥ %99,3, Torpil satın alma/restore/iade prod'da iki platformda, FTUE tamamlama ≥ %75, `no_fill` ≤ %8, rıza metinleri avukat onaylı: AC-11-13 (karar Faz 1 sonunda, S8).
3. **Ölçüm** — `wager_resolved` canlı isabet %48–64 (dışında "ayar" bileti, mekanik değişmez), gün metrikleri bantları, `consent_state` → D1/D2 korelasyonu haftalık, `session_end.endReason` payı, `ad_opportunity/DAU`, organik kurulum payı ve k-faktör (D-086): AC-11-17, AC-11-16; eCPM 14 gün ölçümü başlar (AC-11-14 → S8).
4. **Canlı operasyon** — içerik paketi `c2` (D-081: +40 olay/locale; CNT-13), kill-switch SLA (yayın ≤ 1 saat CI; cihaz ≤ sonraki ön plana geliş), Sentry triage günlük, 1★ protokolü (kayıt kaybı / "ödedim geri geldi" → aynı gün fix), EAS Update yalnızca JS (yeni izin/yerleşim OTA ile asla), haftalık ads-smoke iki pinle (OPS-16).
5. **Publisher build-for-review checklist (10 madde)** ve data room iskeleti (v1.2: S6'dan): AC-11-19, OPS-15.

**Demo kapsamı (zorunlu).** Prod build'in web eşleniği (aynı commit) + mağaza sayfası ekran görüntüleri (canlı) + `kpi.md` #1–#2 (TR, 7 + 14 gün; n < minSample satırları "okunmaz" etiketli) + kill-switch tatbikatı kaydı (olay kapatma → cihazda kapanış).

**Çıkış kriterleri / kapı K7 (Faz 1 ara okuma; G1 değil).** AC-11-13'ün beş maddesi ölçülüyor ve trend yazılı; TR'de reklam SDK durumu yazılı (açık/kapalı ve dayanağı); publisher checklist 10/10; 1★ "kayıt kaybı / ödedim geri geldi" şikâyeti 0 (D-082 ruhu). **G1 kararı Faz 1 sonunda (15 Mar, S8).**

**Riskler.** Mağaza reddi (Apple 5.2.5 sistem taklidi — ANNE ARIYOR D-108 standardı; 2.3.8 metadata 4+ — vitrin havuzu; 3.1.1 restore — her zaman görünür). Kriz: tek olaya şikâyet → kill-switch `eventIds` (imzalı manifest) + `needs-review`.

**Bağımlılıklar.** S6 G0; avukat (SCC yazılı görüşü, rıza metinleri onayı, 16+ muhtırası); KVKK bildirimi (S6); sahip (mağaza yayın düğmeleri, UA kampanyaları TR).

**Tahmini efor.** BACKLOG ile mutabık (v1.2): kod şeridi 3,2 ag + operasyon/içerik 5,0 ag = 8,2 ag; kalan ~9 ag **hotfix tamponu** (canlı ilk iki hafta) + sahip 6,5 gün.

### 2.9 Sprint 8 — TR Faz 1 hafta 3–4, G1 kapısı, CA/NZ hazırlığı, deck taslağı (2–15 Mar 2027)

**Hedef.** Faz 1 TR'nin ikinci yarısı (11 §2.5.1: Faz 1 = 4 hafta): eCPM 14 gün okuması (AC-11-14), FTUE/ton iterasyonu (K-01; 2 hafta), **G1 = Faz 1 sonu (15 Mar)**; CA/NZ açılışına hazırlık (`en-US` metadata, ön kayıt → yayın); EN 5 anadil playtest final (AC-09-26); deck + data room **taslağı** — o tarihte kohort ≥ 900 ve D7 verisi yok, bu yüzden deck'teki **her KPI sayısı "tahmin" etiketlidir** (AC-11-20 ihlali olmaz; final S11).

**Kapsam.**
1. **eCPM ve K-03** — TR Android rewarded eCPM 14 günde ölçülür ve 06 §2.9.2 varsayımlarını ezer; < 1,5 $ ise K-03 (AC-11-14). **B planı yedek ölçütü (TR reklam SDK'sı kapalıysa):** TR eCPM "okunmaz" etiketlenir, 06 §2.9.2 varsayımı korunur ve G1 eCPM'siz verilir (K-03 G1'de uygulanmaz); K-03'ün ölçüm kaynağı CA Android kohortunun ilk 14 günü olur (S9–S10) ve karar `kpi.md`'ye yazılır.
2. **FTUE/ton iterasyonu (K-01)** — Faz 1 verisiyle (FTUE tamamlama, TTFD, ilk oturum) tek sistem değiştirilir ve isimlendirilir; OTA yalnızca JS (OPS-17).
3. **G1 kapısı (15 Mar)** — AC-11-13'ün beş maddesi; Tier A `punched` %100 (CA/NZ ön koşulu, D-114); EUIPO/USPTO başvurusu yapılmış; CA/NZ marka taraması/koruması (S6).
4. **CA/NZ hazırlığı** — `en-US` metadata, CA'da UMP yok ama bilgi kartı düz dil (AC-11-04), iOS SKAN CPI ayrı kalem; ön kayıt sayfaları yayına çevrilir; EN playtest final: 5 anadil "çeviri kokuyor" ≤ 1/5, TTFL ≤ 10 sn 5/8 her locale (AC-09-26).
5. **Deck + data room taslağı** — deck 15 slayt §2.6.3 sırası, her sayı "tahmin/hedef" etiketli (ölçüm yok); data room §2.6.4 yapısında, erişim loglu (AC-11-21); "istemiyoruz/istiyoruz" sayfası avukat ön incelemesi tarihli (AC-11-22); publisher listesi D-087 (OPS-18).

**Demo kapsamı (zorunlu).** KPI dashboard demosu: yerel toplayıcı (`tools/report-aggregate`) + GA4 explore ekran görüntüleri (salt okunur, süreli erişim; TR 4 hafta); G1 karar sayfası; FTUE iterasyonu öncesi/sonrası Playwright zaman damgaları; deck taslağı (PDF, "tahmin" etiketli).

**Çıkış kriterleri / kapı K8 = G1.** AC-11-13 beş maddesi yeşil; eCPM okuması ya da B planı yedek ölçütü yazılı; K-01 iterasyonu uygulanmış ve isimlendirilmiş; CA/NZ metadata `aso-lint` yeşil; AC-09-26 yeşil; deck taslağında "ölçüm" etiketli sayı 0. G1 kırmızıysa CA/NZ açılışı ertelenir ve düzeltme sprinti S9 yerine geçer.

**Riskler.** G1 kırmızı → Faz 2 kayar (pitch tarihi de kayar; plan kısaltma yapmaz). TR reklamsız açılış → eCPM ölçülemez (yedek ölçüt yukarıda).

**Bağımlılıklar.** S7; avukat (MMP sözleşmesi varsa; "istemiyoruz/istiyoruz" ön incelemesi); 5 anadil EN okuyucu; UA bütçesi CA/NZ.

**Tahmini efor.** BACKLOG ile mutabık (v1.2): kod 0,5 ag + operasyon 6,0 ag = 6,5 ag; kalan kapasite FTUE iterasyonu ve hotfix tamponu + sahip 6 gün.

### 2.10 Sprint 9–11 — Faz 2 CA+NZ, KPI okuma, pitch paketi (16 Mar – 26 Nis 2027)

**Hedef.** 11 §2.5.1 Faz 2 (6–8 hafta, **G1'den sonra**): EN pazarı (Kanada + Yeni Zelanda; NZ dolmazsa AU/PH kararı — 11 §7.1 #1) iki mağazada aynı gün; kohort ≥ 900/platform hedefi UA bütçesi 12–15 bin $ (D-114; en fazla 2 iterasyon, runway koşulu); D7 okuması; deck 15 slayt ölçüm verisiyle; **G2/G3 kapı protokolü** 11 §2.5.3 K-01..K-09 ile. Her sprint oynanabilir demo + "Bu sprintte eklenenler" ile biter (DEMO-S9..S11).

**S9 (16–29 Mar) — açılış + kohort 1.** CA+NZ aynı gün (AC-11-12 CA/NZ kısmı, OPS-19); kohort hesabı "rıza veren" üzerinden (900 / rıza oranı); içerik paketi `c3` + EN "koyu ama temiz" uç olay listesi (D-127; CNT-14); MMP seçilirse işleyici sözleşmesi + rıza kartı kapsamı (LEG-14). Demo: EN prod web eşleniği + `kpi.md`.

**S10 (30 Mar – 12 Nis) — D7 okuması + iterasyon.** Retention üç bant (kill 30/12/4 · kabul 35/15/6 · iyi 40/18/8); K-02 iki kademeli (D7 < %12 → Tier A hybrid kapanır; self-publish D7 < %8 ∧ dk/gün < 12 birlikte); G3 "organik pay ≥ %40 veya k ≥ 0,15"; "iterasyon" kararı hangi sistemi değiştireceğini isimlendirir (zarf/bildirim/director/FTUE): AC-11-15; canlı koç isabeti (AC-11-17) EN'de; tekrar KPI "ilk 2 hayatta varyant tekrarı < %20" haftalık (D-126); OPS-20. Demo: KPI dashboard (D1/D7).

**S11 (13–26 Nis) — kohort 2 + pitch paketi final.** Deck 15 slayt §2.6.3 sırası (slayt 4 "ilk 7 günde ne olur"; slayt 6 yalnızca Stillfront rakamları; slayt 7 organik/paid; slayt 15 bütçe + runway); her sayı "ölçüm/tahmin/hedef" etiketli; gelir senaryoları 06 §2.9.3 ile aynı (ARPDAU 0,025/0,045 $, LTV90 ≈ 0,22/0,39 $, LTV180 + payback, ARPPU 6,5 $; ₺ "tahmin"); publisher payı iki satır; `aso-lint` `pitch` kapsamı: AC-11-20, AC-11-24, H-11-08; data room tam (AC-11-21/22 güncel); konumlandırma D-127 sayıyla; publisher demo build D-126 (build-for-review 10/10; EN demo yalnızca Tier A tamam, AC-11-19); içerik paketi `c4` (CNT-15); OPS-21. Demo: deck (PDF) + data room dizini + publisher demo build'in web eşleniği.

**Çıkış kriterleri / kapı K9–K11.** CA/NZ açık; kohort planı yazılı; D7 kohort 1 okunur; K-01..K-09 kararları haftalık `kpi.md`'de; deck + data room AC-11-20/21/22/24 yeşil; G2 kapısı tarihi (kohort ≥ 900/platform + D30 kohort 1 ~11 May) belirlenmiş. **Pitch:** 27 Nis 2027'den itibaren görüşme takvimi; satış değil "görüşme" (D-087); BATNA self-publish + ad-network büyüme programı başvuruları aynı hafta.

**Riskler.** NZ kohortu dolmaz → AU/PH yedeği (CPI/eCPM dengesi) S9'da karar. D7 kill bandı (< %12) → Tier A hybrid yolu kapanır, plan self-publish'e döner; bu başarısızlık değil, D-087'nin ana yoludur. Publisher SDK zorunluluğu → `AnalyticsPort`/`AdProvider` adaptörü; KVKK aktarım kapsamı avukata (11 §7.1 #7).

**Bağımlılıklar.** S8 G1; UA bütçesi; avukat (MMP sözleşmesi varsa, "istemiyoruz/istiyoruz" güncel inceleme).

**Tahmini efor.** BACKLOG ile mutabık (v1.2): S9 4,6 · S10 4,2 · S11 4,8 ag (operasyon/ölçüm ağırlıklı; kalan kapasite iterasyon ve hotfix) + sahip 4–6,8 gün/sprint.

---

## 3. İçerik üretim hattı — paralel şerit (TR + EN, locale başına)

**İlke (09 §6.4 + D-112):** AI üretir → küratör (sahip + ajan ön eleme) → `content-lint` → funny-check (D-097: ≥ 18/25 VE bir ölçüt 5; Lift yalnızca `isLift`; Tazelik ölçütü; "tek tag") → EN punch-up (Tier A) → harness 1.000 (PR) / 10.000 (gecelik) → RITE kahkaha günlüğü (3–4 kişi/locale/sprint). TR ve EN **ayrı yazılır**, aynı `intent`; EN yazarı TR'yi görmez. **Hız kuralı:** ilk 4 haftanın (S1–S2) ölçülen hızı S3–S5 hedeflerini belirler ve **S2 sonunda (K2) hedef resmen güncellenir**; 2. küratör bütçesi yok; hedef düşerse önce bant tabanı (150/100/50) korunur. **Küratör kapasitesi (v1.2):** küratör = sahip, ≤ 25 olay/gün TR son söz (09 §2.3.3); EN'de küratör yalnızca şema/kural düzeltir. Tier B içerikte 09'daki AI jüri + **%20 insan örneklemi** yolu kullanılır; ajan ön elemesi adayı `curated-candidate` durumuna yazar, sahip yalnızca seçer/onaylar. **EN punch-up (v1.2):** S3'ten başlar, sprint başına ~70 Tier A olay + ilgili satırlar (yazar 20 sa/hafta ≈ 2.000 satır/sprint); S3 dalga 1, S4 dalga 2, S5 kalan + kör testler.

**İçerik/kod saat bölüşümü (D-112'nin istediği satır):** S0 %15 içerik / %85 kod · S1 %35 / %65 · S2 %30 / %70 · S3 %25 / %75 · S4 %15 / %85 · S5 **%60 / %40** · S6 %15 / %85 · S7–S8 %20 / %80 (aylık paket). Ajan-gün karşılığı §2'deki efor satırlarında.

| Sprint | Olay günü (kümülatif, `approved`/locale) | Bant dağılımı hedefi | Koç satırı | Diğer satırlar | Sahip kürasyon günü | Kapı |
|---|---|---|---|---|---|---|
| S0 | 40 örnek olay (20 universal + 10 tr-only + 10 en-only; FTUE 3 gün elle) — `curated` (CNT-00) | 18–25 | 13 §5'in 15 altın satırı + ek düzeltmeler bankada; ≥ 5 plain/slot iskeleti | `skip.*` 4 anahtar; `sys.*` 13 satır (10 §3.6) | 0,5 (+ golden CSV 0,5) | Şema `parse` %100; lint ilk 12 kural |
| S1 | **80** (FTUE dahil; D-112 MVP; CNT-01) | **18–25 ≥ 50, 26–40 ≥ 18, 41+ ≥ 12** (41+ geniş bantlı evrensel olaylar; K1 harness'ı 41+'ta tekrar kabullü) | 300 (CNT-02) | iddia 40 (lehine iddia dahil), motto 108 (36 × 3; pozitif 12 hücre D-096), karne notu 60 | **4** | `approved` 80 + bant tabanları; koç satırı cooldown ihlali 0 (AC-01-04 eşiği S3'te); plain ≥ %25 |
| S2 | **140** (CNT-03) | 18–25 ≥ 80, 26–40 ≥ 35, 41+ ≥ 25 (≥ 10'u 60+) | 500 (CNT-04) | NPC satırları 8 × 3 Tanıdık Yüz hafıza + 10 durumsal deste ilk yarısı; Teşhis 30; Sözlük 40; Roast blok 8 × 4; ANNE ARIYOR ≥ 6 varyant | **4** (+ golden CSV 1) | DL lint negatif set BLOK; H-10-11 ≥ %60; **D-112 hız ölçümü → S3–S5 hedef güncellemesi** |
| S3 | **200** (CNT-05) | 18–25 ≥ 105, 26–40 ≥ 55, 41+ ≥ 40 | **700 (MVP)** | iddia 80, bildirim 40, welcome-back 20, Koç görevi 60 (günde 1), Kamp teması 2, kalıp satırı 60 + Kronik 12, meta-callback 40; **EN punch-up dalga 1 ~70 Tier A** (CNT-06) | **4** | AC-01-02 MVP sayıları; **AC-01-04 aynı satır 3+ < %2**; `notif.*` lint |
| S4 | **240** (CNT-07) | 18–25 ≥ 125, 26–40 ≥ 70, 41+ ≥ 45 | 850 | `showcase` ≥ 30/locale; `store/{tr,en}`; rıza/aydınlatma/yardım ekranı metinleri (avukat); **EN punch-up dalga 2 ~70 Tier A** (CNT-08) | **2** | ST-* lint 0 block; `help-screen`/`store` avukat örneklemesi %100 |
| S5 | **300** `approved` zorunlu (CNT-09); +200 `curated` **stretch** | **18–25 ≥ 150, 26–40 ≥ 100, 41+ ≥ 50** (D-112); 41–60 ve 60+ ≥ 20 mekanizma satırı (D-125) | **1.300** (soft launch; CNT-10) | iddia 160, motto 216, Teşhis 45, Sözlük 60, Tanıdık Yüzler 8 × 4, meta-callback 100, Kamp 8 tema, bildirim 60 + wb 30, zincir 40; **Kader havuzu** (Torpil); **EN punch-up dalga 3** (kalan ~60 Tier A + kör testler; CNT-11) | **5,5** (Tier B %20 örneklem) | Tier A `punched` %100; kör anadil ≤ 2/50; tekrar < %20 |
| S6 | 300 kilit (paket `c1` imzalı; CNT-12) | — | 1.300 | mağaza/kreatif metinleri son; `dead-content` temizliği | 0,5 | `aso-lint` yeşil; kill-switch tatbikatı |
| S7 | +40 (paket `c2`, D-081 aylık ücretsiz; CNT-13) | zayıf bant doldurulur (harness görülme dağılımı) | +50 | haftalık `content-report` | 1,5 | `needs-review` kuyruğu ≤ 40 |
| S8 | — (FTUE/ton iterasyonu metinleri) | — | — | FTUE iterasyonu satırları (K-01) | — | Playwright FTUE ≤ 60 sn yeniden |
| S9 | +40 (paket `c3`; EN "koyu ama temiz" uç olay listesi D-127; CNT-14) | EN segmenti | +50 | — | 1,5 | tekrar KPI haftalık |
| S11 | +40 (paket `c4`; CNT-15) | görülme dağılımına göre | +50 | — | 1,5 | tekrar KPI haftalık |

**Sprint içi içerik şablonu:** 09 §6.4'ün 10 günlük tablosu aynen uygulanır (gün 1 intent → gün 2 realization/jüri → gün 3–4 kürasyon → gün 5 lint + harness 1.000 + PR → gün 6–8 kürasyon + EN punch-up → gün 9 ikinci göz → gün 10 harness 10.000 × 2 + Playwright tr/en/xx + `content-report` + RITE).

**İçerik kırmızı çizgileri:** 00 §1.2 ASLA listesi ve 08 lint kataloğu her sprintte aynen; ek olarak D-093 (kişi-sıfatı UYARI, ölüde yalnızca koşul), D-109/RL-31 (takvimde gerçek tarihli olay 0), D-110 ("hayali/fictional" %100), D-091 (bildirim başlığında "oyundaki/in-game"), `substance_ref` ≤ %3 havuz.

---

## 4. Hukuk / marka — paralel şerit

Sahip yürütür; ajanlar brief, metin taslağı ve kanıt dosyalarını hazırlar. Hiçbir madde "avukata sorulacak" diye bekletilmez: her birinin **B planı** kodda bayraktır.

| Zaman | Öğe | Kaynak | Çıktı / kanıt | B planı |
|---|---|---|---|---|
| S0 gün 1 | **D-U-N-S numarası** → Apple Developer + Play Console **organizasyon** hesapları; Play hesap türü doğrulaması + "12 testçi × 14 gün" muafiyetinin konsolda teyidi (OPS-01) | 11 §7.1 #5 | Başvuru kaydı; konsol ekran görüntüsü | D-U-N-S gecikirse EAS dev build ve ASC rezervasyonu S1 gün 3'e; K0 diğer maddelerle kapanır |
| S0 (hesabın açıldığı ilk gün) | App Store Connect ad rezervasyonu (180 gün) **Motto + yedek Tempo** · `motto*.app/.com.tr` alan adı · Play Console paket adı (OPS-02) | D-111 | Rezervasyon ekran görüntüsü; whois | Yedek ad **Tempo** için aynı adım paralel |
| S0 1. hafta | Avukat brief #1: **tek rıza/aydınlatma brief'i** (ConsentState `{adsPersonalized, analytics, isMinor}`, aktarım anahtarı yok, nötr yaş kapısı, aydınlatma anı) (LEG-01) | 13 §4 #6, D-102/103/104 | `legal/briefs/01-riza-aydinlatma.md` | S4'te metinler "taslak" etiketiyle, release `block` kalkmaz |
| S0 1. hafta | Avukat brief #2: **Google SCC / KVKK m.9/4** TR için durum — **AdMob, Sentry, RevenueCat ve GA4** (tüm yurt dışı aktarım işleyicileri; Ads Data Processing Terms + Kurum'a bildirim) (LEG-02) | 13 §4 #7, D-103 | Yazılı görüş (hedef S0 bitimi; son tarih S4) | TR soft launch'ta reklam SDK'sı **kapalı** başlar; Sentry/RC/GA4 için bildirim yapılmadan TR build'inde bu SDK'lar kapalı |
| S0 1. hafta | Avukat brief #3: **16+ muhtırası** (TCK 226/7, Ticari Reklam Yön. m.25, Play Better Ads, Apple anket 10 cevap eşlemesi; 16–17 için rıza modeli: hiç alınmaması vs veli) (LEG-03) | 13 §4 #8, D-107, D-102 | İmzalı muhtıra (hedef S0 bitimi; son tarih S6) | TR storefront **18+ beyanla** açılır; IARC/PEGI 16 hedefi korunur; Apple kademesi anket çıktısı |
| S0 2. hafta | **TÜRKPATENT 9 + 41** başvurusu (kelime ve logo ayrı) + marka vekili karıştırılma analizi ("Motto Immortal", "Motto - Daily Quotes") (LEG-04) | D-002, D-111 | Başvuru numaraları; vekil görüşü | Olumsuzsa **Tempo**'ya düşme kararı soft launch öncesi (S6); yedek ad için paralel ASO |
| S0 2. hafta | **FSEK m.52 yazılı devir** metni (kurucu → şirket; şablon tüm katkıcılar için) + `assets/SOURCES.md` (yaratıcı + sözleşme referansı; AI üretimliyse insan düzenleme kaydı, ST-12) (LEG-05) | D-111, 08 §2.8 | İmzalı devir; `assets/SOURCES.md` CI'da | SOURCES.md eksik varlık → release `block` |
| S0 2. hafta | App Store search ads impression share testi (motto / life coach / life sim) | D-111 | Rapor `docs/plan/aso-sprint0.md` | Alt başlık başlığa ("Motto: Day-by-Day Life Sim") |
| S1 | Maket ve FTUE metinleri lint kapsamında; **"iddia ≠ bahis" avukat görüşü talebi** (store "wagers", TR "iddiaya girer" İddaa komşuluğu) (LEG-06) | D-106, D-086 | Talep kaydı | — |
| S2 | ANNE ARIYOR görseli Apple 5.2.5 / Play sistem taklidi açısından 07 AC-07-44 standardı ile iç inceleme; EN yazar işe alımı (OPS-05) | D-108 | Ekran görüntüsü | — |
| **S3 gün 1** | **EN punch-up yazarı sözleşmesi + FSEK m.52 devri — ilk katkıdan önce** (LEG-08; S5'ten öne alındı) | D-111, D-114 | İmzalı sözleşme + devir | Yazar yoksa Tier A 200 → 120 B planı S3 sonunda |
| S3 | Bildirim metinleri avukat örneklemesi (başlıkta "oyundaki/in-game"; "kaldı/son" yok; Apple 4.5.4 pazarlama push'u yok) | D-091 | Örnekleme notu | Lint zaten BLOK; not gecikirse kod beklemez |
| S4 | **Hukuki belgeler TR+EN:** Gizlilik, Aydınlatma, Açık Rıza (ayrı), Koşullar, 16+ metni, kurgu feragatı, Lisanslar (CC0/CC-BY atıfları) · `legal/data-inventory.json` (= Apple Privacy Label = Play Data safety) · Reklam Kurulu karanlık tasarım checklist'i 15 kutu · "Gerçek hayatta yardım" ekranı hat doğrulaması (≤ 6 ay) | AC-08-15, AC-10-22, AC-11-25, 06 §6.4, D-052 | Yayında; avukat onayı (G1 şartı AC-11-13); gizlilik URL'si S5 mağaza kaydına girer | Onay gelmeden soft launch yok (sert kapı) |
| S4 | **VERBİS muafiyet kontrolü** (08 §2.x #7) ve kayıt yükümlülükleri listesi (LEG-09; S7'den öne alındı) | D-103 | Avukat listesi | Muafiyet yoksa kayıt S5'te |
| **S5 (son tarih)** | **"İddia ≠ bahis" avukat görüşü — sert kapı** (LEG-07): S6 mağaza metadata'sı ("wagers"), Faz 0 kreatifleri ("Bets against you"), IARC/Apple yaş anketi "simulated gambling" cevabı bu görüş olmadan gönderilmez | D-106, D-086 | Görüş data room /06-uyum | Metadata/kreatiflerde "Koç tahmin eder, yanılınca damga basar"; ankette en temkinli cevap |
| S5 | **Kader havuzu** (Torpil) ayrı hukuki okuma (LEG-10) | 00 açık soru 3, D-004 | Avukat notu | Kader soft launch'ta kapalı kalır (Torpil "iki kişilik" satırı MVP kartında zaten yok, AC-06-06) |
| S5 | Yaş derecesi anketleri (Apple/IARC) 08 §2.6 cevap anahtarıyla + mağaza kaydı (OPS-07; S6'dan öne alındı); rakip metin benzerlik testi pipeline'da | D-107, AC-08-13, D-111 | Konsol ekran görüntüleri; `similarity-report` | — |
| **S6 (en geç 5 Şub)** | **KVKK m.9/4 standart sözleşmeler + Kurum'a 5 iş günü bildirimi — AdMob, Sentry, RevenueCat, GA4** (LEG-11; S7'den öne alındı) | D-103 | Bildirim kanıtı | İlgili SDK TR build'inde kapalı; reklamsız TR |
| S6 | **CA + NZ marka koruması** (Madrid üzerinden CIPO/IPONZ ya da en az tarama raporu) (LEG-12) | D-111 | Başvuru/tarama raporu | Tarama olumsuzsa Tempo kararı G1 öncesi |
| S6 | "İstemiyoruz/istiyoruz" sayfası avukat ön incelemesi başlar (AC-11-22 S8'de tarihli) | AC-11-22 | Belge | — |
| S6 (en geç 16 Şub) | **EUIPO / USPTO** başvurusu (en geç TR soft launch günü) · Tempo'ya düşme kararı (olumsuzsa) (LEG-13) | D-111 | Başvuru numaraları | — |
| S9 | MMP seçilirse işleyici sözleşmesi + rıza kartı kapsamı; publisher SDK talebinde KVKK aktarım kapsamı; "iddia ≠ bahis" görüşü data room'da (LEG-14) | 11 §7.1 #2/#7, D-086 | Avukat notu | MMP yok (mağaza atribüsyonu yeter) |
| Sürekli | Lint `--docs` modu tüm `docs/**` (AC-08-19); `pitch` kapsamı allowlist (D-124); şikâyet/takedown/mağaza reddi hedefi **0** | D-124, 08 §6.2 | CI | Kill-switch yayın ≤ 1 saat |

---

## 5. "Tanım: Bitti" (Definition of Done)

**Bir backlog maddesi "bitti" sayılır ancak:** (1) AC'nin "Doğrulama" sütunundaki test repoda ve CI'da yeşil; cihaz gerektirenlerde sahibin smoke kaydı (tarih + platform + build) `docs/plan/CIHAZ-KAYITLARI.md`'de. (2) Motor: saf (AC-10-01), determinizm property'si, sabitler yalnızca `tuning.json`, harness 1.000 PR eşikleri. (3) İçerik: lint `block` 0, `review.status` doğru, TR/EN ayrı yazım, D-097 eşiği, provenance ve `SOURCES.md` güncel. (4) UI: `testID` + a11y label, reduced-motion yolu, 4 viewport taşma yok, buton bütçesi, kontrast ≥ 4,5. (5) Hukuk/politika yüzeyi: ilgili ST/RL kuralı yeşil, `data-inventory` güncel, karanlık desen kutusu "yok", gerekirse avukat notu. (6) PR'da D-referansı, commit'te AC id; `main`'e merge; CHANGELOG satırı.

**Bir sprint "bitti" sayılır ancak:**
- [ ] Web export (`expo export --platform web`) Claude artifact olarak yayımlandı; link `docs/plan/DEMOLAR.md`'de tarih + commit SHA ile.
- [ ] Playwright ekran görüntüleri TR + EN × 390×844 + 430×932 artefakt olarak eklendi; FTUE zaman damgaları raporu (ilk Karne ≤ 60 sn) her sprintte yeniden ölçüldü.
- [ ] "Bu sprintte eklenenler" listesi yazıldı (madde başına AC/D referansı).
- [ ] CI `check` + `sim` + `e2e` yeşil; gecelik 10.000 × 2 locale × 3 ses raporu eklendi; `dead-content.json` incelendi.
- [ ] İçerik şeridi hedefi (§3) tutturuldu ya da sapma + yeni hedef günlüğe yazıldı (D-112 hız kuralı).
- [ ] Hukuk şeridi (§4) o sprintin satırı "yapıldı / bekliyor (B planı aktif)" olarak işaretlendi.
- [ ] Lint `block` 0; `pins:check` 0 sapma; bundle boyutu eşikte (gzip ≤ 1,8 MB; içerik ≤ 6 MB).
- [ ] Persona drift (100 satır ≤ 3) ve kör anadil testi (50 satır ≤ 2) yapıldı (S0'da yalnızca TR; EN, okuyucu listesi OPS-04 ile S1'den itibaren).
- [ ] Sahip zamanı bütçesi (§1.4) gerçekleşeni yazıldı; aşım varsa sonraki sprintin kapsamı küçültüldü.
- [ ] Çıkış kriterleri/kapı tablosu doldurulup `docs/plan/KAPILAR.md`'ye eklendi; kapı geçilmediyse sonraki sprintin ilk işi yazıldı.
- [ ] Tüm iş `main`'de; `docs/CALISMA-GUNLUGU.md` güncel.

**Release (soft launch) "bitti" sayılır ancak (ek):** D-082'nin üç release-blocker'ı — (a) Torpil restore (aynı mağaza hesabı: yeniden kurulum + cihaz değişimi + iade sonrası sessiz kapanış, D-116), (b) her gün sonrası autosave + kill-test, (c) VoiceOver/TalkBack ile tam ömür + reduced-motion'da juice kapalı — iki platformda kayıtlı; AC-11-13 beş maddesi; `release-signoff.json` iki rol imzası (RV-06); hukuki belgeler yayında ve avukat onaylı.

---

## 6. Kapsam dışı ve açık sorular

**Yok (D-kararıyla):** Saha Çalışması (D-006), abonelik (D-041), Ek Antrenman R1 (D-085), Otomatik mod (D-092; 1.0'da ≥ 500 olayla), MA A/B (D-105), aktarım anahtarı (D-103), Devre Arası (D-083), streak-at-risk bildirimi (D-091), çapraz mağaza Torpil (D-116), Aile Grubu sohbet ekranı (D-014), A3 meta yığını (D-057), "Çocukla devam" (D-056), üçüncü dil, uzak bildirim, backend.

**Açık sorular → sprint:** 00 §10 #1 marka (S0 başvuru, S6 karar; CA/NZ koruması S6) · #2 16+/18+ (S0 brief, S6 son) · #3 Kader okuması (S5) · #4 EN yazar (S2 işe alım, **S3 gün 1 sözleşme + FSEK devri**, S3–S5 üç dalga teslim) · #5 RevenueCat %1/Experiments (S4; yedek Play price experiments + ASC PPO, D-123) · #6 AdMob pini (S6) · #7 NZ/AU/PH (S9) · #9 Kamp ruh hâli (S5 → 1.0) · 11 §7.1 #5 Play "12 testçi" teyidi (S0, OPS-01; D-U-N-S'e bağlı) · #6 Torpil fiyat testi (S10).
