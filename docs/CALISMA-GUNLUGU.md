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
