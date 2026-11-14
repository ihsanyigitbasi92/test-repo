# Mağaza görselleri — Motto 1.0

Hepsi **gerçek oyun ekranları**: `docs/demo/sprint-02` web derlemesi (2026-11-14, `apps/mobile` ile aynı içerik hash'i `7409113e54594045`), Playwright + Chromium ile çekildi; çerçeve (üst başlık bandı) HTML şablonundan tam piksel ölçüsünde render edildi. Toplam ≈ 26 MB, PNG, RGB, saydamlık yok.

## Klasörler ve ölçüler

| Klasör | Piksel | Ham ekran (viewport @ ölçek) | Nereye |
|---|---|---|---|
| `ios-6.9/{tr,en}/` | 1320×2868 | 440×956 @3 | App Store Connect › 6.9" Display (zorunlu ana set) |
| `ios-6.5/{tr,en}/` | 1284×2778 | 440×956 @3 (aynı ham ekran, çerçeve 6.5" ölçüsünde; 428×926 ile en-boy farkı %0,4) | 6.5" Display (isteğe bağlı) |
| `play-phone/{tr,en}/` | 1080×1920 | 360×800 @3 | Play Console › Phone screenshots |
| `play-feature-graphic-{tr,en}.png` | 1024×500 | — | Play › Feature graphic |
| `icon-512.png` / `icon-1024.png` | 512² / 1024² | — | **Geçici** ikon önerisi (Play 512, App Store 1024). Uygulamadaki `assets/icon.png` hâlâ Expo şablonu: compliance.md R1 |

- **Play için 1080×2400 kullanılmadı:** Play en uzun kenarın en kısanın 2 katını geçmesine izin vermez (2400/1080 = 2,22). 1080×1920 (9:16) güvenli.
- **iPad yok:** `app.json › ios.supportsTablet: true` iken App Store iPad 13" görüntüsü ister → checklist.md §3.7 (`supportsTablet: false` önerisi ya da iPad testi).

## Sahneler (her dilde 8; sıra = mağazadaki sıra)

| # | TR dosya | EN dosya | Ekranda ne var |
|---|---|---|---|
| 01 | `01-nasil-oynanir` | `01-how-to-play` | Eğitim sayfası 1/3 (zaman akar, kart durdurur, iddia fişi) |
| 02 | `02-iddia` | `02-wager` | Karar kartı + sarı İDDİA fişi ve gerçek oran |
| 03 | `03-damga` | `03-stamp` | HAKSIZ ÇIKTIM / I WAS WRONG damga anı |
| 04 | `04-hayat` | `04-life` | Yıllar sonra HUD (yaş 33–45, statlar, para, anne baskısı) + günlük akış |
| 05 | `05-karne` | `05-report-card` | Doğum günü karnesi + Yılın Mottosu |
| 06 | `06-hayat-yolu` | `06-life-path` | Hayat Yolu: düğün kartı ("taksici şahit") + koç satırı |
| 07 | `07-musteri-dosyasi` | `07-client-file` | Yeni Müşteri Dosyası (avatar, ad, koçun açılış satırları) |
| 08 | `08-magaza` | `08-shop` | Mağaza: tek ürün "Reklamsız", geri yükleme, "Satın almadan önce" |

Başlıklar `listing-*.md` §9 ile aynı; yasak sözcük taramasından geçti.

## Dürüstlük notları (inceleyici sorarsa)

1. **Ölüm ekranı bilinçli olarak yok.** Talepte "death/client file" sahnesi vardı; ölüm ekranı mezar taşı görseli ve "uzun bir hastalık" metni taşıdığı için 4+ vitrin kuralına (Apple 2.3.8, 08 K22, D-106) aykırı. Yerine **Müşteri Dosyası** (yeni hayat) kondu.
2. **06 düğün sahnesi hazırlanmış bir profil durumudur:** 23 yaşında bir kayda, motorun kendi Hayat Yolu kuyruğunun yaptığı gibi içerik paketindeki gerçek düğün olayı (`nisan_teklif_dugun_taksici_sahit_01`) ve "nişanlı" bayrağı eklendi (`tools/milestone.js`). Olay, metin ve koç satırı oyundaki hâliyle; yalnızca ona ulaşma süresi kısaltıldı (rastgele bir hayatta düğüne ulaşmak dakikalar sürüyor).
3. **08 mağaza:** web derlemesinin "Deneme mağazası" uyarı şeridi gizlendi ve web'e özgü mağaza adı ("deneme mağazası" / "the demo store"), native derlemenin aynı yerde gösterdiği adla ("App Store" / "Google Play", `src/i18n/shop{Tr,En}.ts › store`) değiştirildi. Fiyat demo fiyatıdır (**49,99 ₺ / $1.99**, `catalog.ts › fallbackPrice`); mağazaya başka fiyat girilirse 08 yeniden üretilmeli.
4. **Yazı tipleri:** web Fraunces / IBM Plex Sans / Archivo Black yükler; bugünkü native derleme sistem fontlarını kullanır (compliance.md R2). Fontlar native'e paketlenmezse görüntüler TestFlight build'inden yeniden çekilmeli.
5. Negatif bakiye (TR 06: −16.120) oyun içi kurgusal "Para"dır; 4+ kuralında para kaybı serbest.
6. Bilinen küçük arayüz hatası (oyunun kendisinde): 360 genişlikte "ONYIL KARNESİ" etiketi İŞLENDİ damgasının altına giriyor; Play setinde bu yüzden 25 yaş karnesi kullanıldı.

## Yeniden üretim (`docs/store/tools/`)

```bash
cd docs/store/tools                                # ham çekimler tools/raw/ altına yazılır (commit'lemeyin, ~150 MB)
node capture.js tr 440 956 raw/tr-69 1200          # bir hayat: eğitim, dosya, kararlar, damgalar, karneler, HUD (≈ 20 dk)
node capture.js en 440 956 raw/en-69 1200
node capture.js tr 360 800 raw/tr-play 1200
node capture.js en 360 800 raw/en-play 1200
node shop.js                                       # 4 mağaza ekranı (platform adlarıyla)
node milestone.js tr 440 956 raw/tr-69/wedding.png # ×4 (dil × boyut) → wedding-after.png kullanılır
node decision.js en 360 800 raw/en-play/dec        # gerekirse temiz bir iddia kartı
python3 build.py && node compose.js plan-all.json  # 48 çerçeve → ../screenshots/
python3 brand.py && node compose.js plan-brand.json
```

Hangi ham ekranın hangi çerçeveye girdiği: `tools/picks.json`. Oyun rastgele tohumla başladığı için yeniden çekimde içerik metinleri farklı olur; seçim kuralları `build.py › pick` içinde.
