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
