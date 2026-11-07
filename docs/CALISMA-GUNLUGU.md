# Çalışma Günlüğü (Proje: Kara Komedi Hayat Simülasyonu)

Bu dosya, projede yapılan her adımın kronolojik kaydıdır. Her girişte: ne yapıldı, neden, çıktı nerede.

## 2026-11-05

### Kurulum ve karar
- Repo boştu (sadece README). `docs/research`, `docs/design`, `docs/plan` klasörleri açıldı.
- Ortam: Node 22, Python 3.13, Chromium+Playwright var; Flutter/Unity/Android SDK/Xcode yok. Bu yüzden "tarayıcıda çalışabilen" bir teknoloji (Expo + react-native-web) teknik olarak büyük avantaj; nihai karar T5 araştırmasının ADR'ında verilecek.
- 4 CPU olduğu için her workflow en fazla 2 ajanı paralel çalıştırıyor; araştırma 4 ayrı workflow'a bölündü (T1-T3, T4-T6, T7-T8, T9).

### Faz 1: Araştırma (devam ediyor)
Her konu için: 1 araştırmacı ajan (web araştırması + Türkçe doküman yazar) → 1 şüpheci doğrulayıcı ajan (8-12 iddiayı web'den doğrular, hataları dosyada düzeltir, eksikleri tamamlar, 1-10 kalite puanı verir).

| Konu | Dosya | Durum |
|---|---|---|
| T1 Engagement/retention mekanikleri + etik sınırlar | docs/research/01-engagement-retention-mekanikleri.md | çalışıyor |
| T2 Rakip ve pazar analizi + publisher listesi | docs/research/02-rakip-ve-pazar-analizi.md | çalışıyor |
| T3 Mizah ve anlatıcı sesi (ton kitabı taslağı, 40+ örnek replik) | docs/research/03-mizah-ve-anlati-sesi.md | çalışıyor |
| T4 Hayat-sim sistem tasarımı (storylet motoru, olay şeması) | docs/research/04-hayat-sim-sistem-tasarimi.md | çalışıyor |
| T5 Teknoloji ve mimari (ADR) | docs/research/05-teknoloji-ve-mimari.md | çalışıyor |
| T6 Monetizasyon ve publisher pitch | docs/research/06-monetizasyon-ve-publisher-pitch.md | çalışıyor |
| T7 Geri dönüş döngüsü ve backend'siz live-ops | docs/research/07-geri-donus-ve-liveops.md | çalışıyor |
| T8 UX/UI, FTUE (ilk 60 sn), sanat yönü | docs/research/08-ux-ui-ftue-ve-sanat-yonu.md | çalışıyor |
| T9 Hukuki uyum ve kırmızı çizgiler (TR hukuku + mağaza politikaları) | docs/research/09-hukuki-uyum-ve-kirmizi-cizgiler.md | çalışıyor |

### Kullanıcı talimatları (bağlayıcı)
- Yasal risk oluşturacak hiçbir içerik olmayacak. Şirket Türkiye'de kurulu → TR hukuku + global mağaza politikaları birlikte uygulanacak. (T9 bu yüzden eklendi.)
- Yapılan her şey kullanıcıya raporlanacak (bu günlük + sohbet özetleri).
- Hedef: piyasadaki en iyi oyun; kullanıcı kısa sürede keyif almalı ve bağlanmalı → "ilk 60 saniye" (time-to-first-laugh < 20 sn, ilk karar < 30 sn) tüm tasarım aşamalarında zorunlu kriter.

### Teknik fizibilite probu (scratchpad, repoya girmedi)
- `create-expo-app` çalıştı: Expo SDK 58, React Native 0.88.1, React 19.3, TypeScript 6.
- `npx expo install` komutu proxy tarafından engellendi (api.expo.dev → Forbidden). Çözüm: sürümleri `node_modules/expo/bundledNativeModules.json` dosyasından okuyup `npm install` ile kurmak.
- Web export + Playwright ekran görüntüsü testi BAŞARILI: `expo export --platform web` çalıştı, statik çıktı yerel sunucudan Chromium'da açıldı, konsol hatası yok, 390x844 ekran görüntüsü alındı. Sonuç: Oyunu bu ortamda tarayıcıda otomatik test edip ekran görüntüsüyle doğrulayabiliriz (cihaz gerekmeden).

### Yeni bağlayıcı kararlar (kullanıcı)
- Oyun ilk günden iki dilli: Türkçe + İngilizce, ikisi de birinci sınıf. İngilizce "çeviri" değil "transcreation" olacak (kendi başına komik). Bunun için T10 araştırması eklendi: `docs/research/10-ingilizce-ses-ve-iki-dilli-icerik-hatti.md`.
- Çalışma standardı: "en iyi oyun şirketinin CEO'su + piyasanın en iyi ekibi" kalitesi. Her faz için düşman eleştiri (publisher gözü, oyuncu gözü, komedi yazarı gözü, mühendis gözü) zorunlu; "yeterince iyi" kabul edilmeyecek.
- Git: `claude/hayat-sim-analiz-ve-plan` dalı açıldı ve push edildi; her anlamlı adım commit edilecek.
- Kullanıcı: "Oyunun her detayı çok detaylı düşünülsün; dopamin salgılatan, bağımlılık yapan oyun nasıl yapılır araştırılsın." → T11 araştırması eklendi: `docs/research/11-dopamin-muhendisligi-ve-bagimlilik-algoritmalari.md` (nörobilim + vaka analizleri + sözde-kod algoritmalar + etik/yasal sınır). Faz 2 çıktısı tek GDD yerine sistem başına ayrı dokümanlardan oluşan bir "tasarım paketi" olacak.
- Kullanıcı yetkisi: GitHub tarafında soru sormadan süreç yürütülecek (commit, push, PR açma, merge). Uygulama: her faz sonunda `claude/hayat-sim-analiz-ve-plan` dalından `main`'e PR açılıp merge edilecek; günlük ve dokümanlar her zaman güncel tutulacak.

## 2026-11-06

### Araştırma durumu
- Hesabın 5 saatlik kullanım limiti doldu (01:40 UTC'de sıfırlandı); kullanıcı "resetlenince otomatik devam et" dedi. Limit dolmadan önce 10/11 araştırma dokümanı tamamlanmıştı (T1, T2, T3, T4, T5, T7, T8, T9, T10, T11; her biri 7.000–11.000 kelime, kaynaklı). Eksik: T6 monetizasyon → yeniden başlatıldı (workflow w0qfu6dcl).
- Şüpheci doğrulama turları (verify) limit yüzünden hiç çalışamadı. Karar: kullanım bütçesini önce tasarıma harcamak; doğrulama, tasarım paketinin eleştiri aşamasında "çapraz doküman tutarlılık + olgu kontrolü" olarak yapılacak. Araştırma dokümanlarındaki sayılar o aşamaya kadar "doğrulanmamış" kabul edilmeli.
- Not: Araştırma dokümanlarının çoğu "(doğrulanmadı)" işaretli iddialar içeriyor; GDD'ye alınan her sayı eleştiri aşamasında kontrol edilecek.

### Faz 2a başladı (workflow wxzfs04m1)
- 4 bağımsız konsept (A1 anlatıcı-merkezli, A2 yetişkin-olmak hicvi, A3 roguelike hayat, A4 roast koç) → `docs/design/concepts/`
- 3 jüri (publisher/pazar, oyuncu+komedi yazarı, üretim+hukuk) puanlar, aşı listesi ve "öldür" listesi çıkarır
- Sentez → `docs/design/00-VIZYON-ve-KARARLAR.md` (oyun adı, anlatıcı, sütunlar, core loop, ilk 60 sn, kapsam, 40+ bağlayıcı karar)
- Sonraki adım (Faz 2b): 11 ayrıntılı sistem dokümanı, ardından 5 düşman eleştirmen (publisher, manipülasyondan nefret eden oyuncu, komedi yazarı TR/EN, mühendis, avukat) ve revizyon.

### Faz 2a sonucu
- 4 konsept + 3 jüri tamamlandı; sentez ajanı `docs/design/00-VIZYON-ve-KARARLAR.md` dosyasını yazdı, ancak kullanım limiti (10:10 UTC'de sıfırlandı) yapılandırılmış çıktı adımında kesti. Dosya diskte tam; commit edildi.
- Kullanıcı hatırlatması (bağlayıcı): oyun hem iOS hem Android'de çalışacak. Expo/React Native bu ikisini tek kod tabanından kapsıyor; her sistem dokümanı iOS/Android farklarını (bildirim izinleri, IAP/StoreKit vs Play Billing, haptik, geri tuşu, safe area, 16 KB sayfa boyutu, yaş derecelendirme anketleri) ayrı bir "Platform notları" bölümünde ele alacak.

### Faz 2a kararları (özet)
- Oyun adı: **Motto** — bileşik marka "Motto: Sertifikasız Hayat Koçu" / "Motto: Uncertified Life Coach". Yedekler: Tempo, Kismet (Kismet'te aynı sınıfta aktif bir zar oyunu ve TR'de yerli bir fal uygulaması bulundu → geri çekildi). TÜRKPATENT/USPTO/EUIPO taraması Sprint 0'da.
- Anlatıcı: Motto, 2.400 seminer vermiş, motivasyona inancını yitirmiş, seni son müşterisi olarak almış sertifikasız hayat koçu. İmza mekanikler: Koçun Defteri, sana karşı iddia + "HAKSIZ ÇIKTIM / I WAS WRONG" damgası, Yıl Sonu Karnesi + "Yılın Mottosu" paylaşım kartı, ölümde Roast Raporu (Kalıp Dedektörü sayılarıyla), 40 sn içinde yeni hayat, Tanıdık Yüzler (8 kalıcı NPC), haftalık Antrenman Kampı. "Kader Müdürlüğü memuru" fikri Torpil ile açılan ikinci koç kişiliği olarak yaşıyor; "rüşvet" çerçevesi hiçbir yerde yok (hukuk).
- Jüri 2–1 bölündü (A1 anlatıcı-merkezli vs A4 roast koç); yaratıcı yönetmen kararı: A4 çerçevesi + A1 DNA'sı, gerekçeleri 00 §0.6'da.
- 60 bağlayıcı karar (D-001…D-060) kaydedildi; doküman hiyerarşisi: 00 > T9 (hukuk) > araştırma > konseptler.

### Faz 2b başladı (3 paralel workflow)
- wq1zct75h: 03 olay motoru/şema/director/dopamin, 01 anlatıcı ve ton kitabı, 04 kariyer/ilişkiler/varlıklar, 11 KPI/soft launch/publisher
- 2. workflow: 07 UX/UI/FTUE/juice, 02 zaman/stat/ekonomi/sağlık/ölüm, 05 retention/geri dönüş/miras/koleksiyon
- 3. workflow: 10 teknik mimari (iOS+Android), 08 içerik kuralları/hukuk/linter, 09 i18n/içerik hattı, 06 monetizasyon/mağaza uyumu
- Her dokümanda zorunlu "Platform notları (iOS / Android)" ve "Hukuk ve politika kontrolü" bölümleri; her doküman en az 15 test edilebilir kabul kriteri (AC-xx-nn) üretir → sprint planına girdi.

### Etkileşimli maket (kullanıcı isteği: "oyunu mockla, demo göster")
- `docs/mock/motto-demo.html`: tek dosyalık, telefon çerçeveli, TR/EN geçişli tasarım maketi. 00 §4.2'deki ilk 60 saniye senaryosunu birebir uygular (18 oldun → Müşteri Dosyası → İlk Gün → İlk Para + İddia fişi + HAKSIZ ÇIKTIM/İSABET damgası → Tek Hedef → Yaşlan → Karne + Yılın Mottosu + zarf satırı → Bir Yıl Daha). Sonrasında 15 örnek olay, 3 zarf olayı, koç bahisleri (gerçek oran gösterilir), Aile Grubu sayacı, Anne Baskısı metresi, "Bugünlük yeter" oturum özeti + paylaşım kartı, "Hızlı yaşa", Gompertz benzeri ölüm, Roast Raporu (kalıp sayıları, "beni N kez haksız çıkardın"), Kondisyon açılımı, yeni hayatta önceki kalıba callback.
- Headless Chromium ile duman testi: ilk yıl akışı tıklanarak geçildi, konsol hatası yok, yatay taşma yok. Claude artifact olarak yayınlandı (link sohbette).
- Bu bir tasarım maketi; gerçek uygulama Expo/React Native ile Sprint 0–1'de kurulacak. Metin ve sayılar örnektir.

### Maket v2 → v3 (sahip geri bildirimi: "heyecan yok, roast yok, görsel yok" + "gün gün ilerlesin, karakterler konuşsun")
- v2: roast dozu yükseltildi (koç her sonuçta laf sokar), daktilo metin, damga çarpması + mürekkep sıçraması + ekran sarsıntısı + tam ekran damga, kırmızı/lime/altın flaşlar, uçan stat sayıları, "YAŞLANIYORSUN" geçişi, EFSANE OLAY (altın çerçeve + konfeti), ANNE ARIYOR tam ekran çağrı baskını, patronla göz teması mini oyunu, TEŞHİS etiketi çarpması, ölümde EKG → düz çizgi → mezar taşı → sayaçlı Roast Raporu, koç avatarı ifadeleri, sentez SFX.
- v3: zaman birimi GÜN (takvim satırı "Gün N · Salı, 3 Mart 2026"), her günde bir olay, olaysız günler tek satırla atlanır, doğum gününde karne; 14 NPC (Anne, Barış, Nevin Hanım, Yağmur, Pamuk, Dayı, Şükran Teyze, kurye, kombi ustası, ev sahibi, İK, doktor, garson, komşunun torunu) sohbet balonlarıyla konuşuyor; oyuncunun seçimi cevap balonu olarak akışa yazılıyor.
- Headless Chromium testi: 6 gün tıklanarak geçildi, 10 NPC balonu, 6 cevap balonu, konsol hatası yok, taşma yok. Artifact aynı URL'de güncellendi.
- Kararlar 00 §12'ye (D-061…D-065) işlendi; benchmark özellik dokümanı `docs/design/12-...md` yazıldı. Eksik tasarım dokümanları (03, 04, 05, 06, 09, 11) haftalık limit sıfırlanınca yeniden başlatıldı (w21y2xcx2), hepsi yeni gün-tabanlı kararı okuyor.

### Süreç kuralı (kullanıcı): her sprint sonunda demo
- Her sprintin "bitti" tanımına **oynanabilir demo** eklendi: Sprint 0'dan itibaren gerçek Expo uygulamasının web export'u (react-native-web) Claude artifact olarak yayınlanır + Playwright ekran görüntüleri/akış videosu benzeri kare dizisi günlüğe eklenir; kullanıcıya link ve "bu sprintte eklenenler" listesiyle sunulur. Sprint planında her sprint için "Demo kapsamı" satırı zorunlu.

### Sahip geri bildirimi: zaman akmalı, hayat gerçekten değişmeli
- D-066: "Ertesi Gün" düğmesi kaldırıldı; üstte canlı saat/tarih ve hız kontrolü (⏸ ▶ ▶▶ + otomatik). Zaman yalnızca karar beklerken durur.
- D-067: kalıcı hayat durumu (İş/maaş, Ev/kira, İlişki, Varlıklar) + para akışı (maaş günü, kira günü, günlük gider) + olayların durumu değiştirmesi + gündelik satırlar. Maket v4 buna göre yazılıyor.
- Maket v4 yayınlandı: üstte canlı saat/tarih + gün ilerleme çubuğu, hız kontrolü (II ▶ ▶▶) ve "Otomatik" mod; "Ertesi Gün" düğmesi yok, zaman yalnızca karar beklerken duruyor. Durum şeridi: İş/maaş, Ev/kira, İlişki, Kedi; ayın 1'i maaş, 5'i kira, 10'u mama; günlük gider; para bitince "anne borç verdi". Olaylar durumu kalıcı değiştiriyor (işe girince maaş akıyor, işten atılınca kesiliyor, zam kirayı kalıcı artırıyor, flört ilişki durumu yaratıyor, kedi aylık yiyor). Olaysız günlerde gündelik satırlar. Headless test: 2 dakikada ~140 gün aktı, 12 karar, iş + ilişki + maaş akışı doğrulandı, hata yok.

### App Store teardown (kullanıcı: "life simulator uygulamalarını detaylı araştır, kopya çek")
- Workflow wewhacrxv: 4 küme (A BitLife ailesi, B BitLife klonları/yeni çıkanlar, C anlatı-seçim oyunları + TR mağazası, D yorum madenciliği/ASO/fiyat matrisi) → `docs/research/12-app-store-teardown/` + sentez `docs/research/12-app-store-hayat-sim-ozellik-havuzu.md` (özellik havuzu, "kopya listesi ilk 30", fiyat matrisi) + 00 §13'e D-068+ kararları.

## 2026-11-07
- Konteyner yeniden başladı; diskteki her şey korundu ve commit edildi. Teardown sentezi ve 09/11 dokümanları yeniden başlatıldı.
- App Store teardown tamamlandı: 4 küme (`docs/research/12-app-store-teardown/`) + sentez `docs/research/12-app-store-hayat-sim-ozellik-havuzu.md` (139 özellik, kopya listesi ilk 30, fiyat matrisi). Vizyon dokümanına §13 ile D-068…D-082 eklendi. Fiyat kararı: Torpil 6,99 $ / 199,99 ₺ doğrulandı (koşul: restore release-blocker, ayrı "reklam kaldır" SKU'su yok, vitrin ≤3 kalem).
