# Mağaza listesi — Türkçe (tr-TR)

> Sürüm 1.0 için App Store Connect ve Google Play Console'a **olduğu gibi yapıştırılacak** metinler.
> Karakter sayıları `docs/store/check-limits.mjs` ile ölçüldü (Unicode karakter = Apple ve Google'ın saydığı birim); son çıktı en altta.
> Kaynak kararlar: 00 D-002, D-049, D-053, D-073, D-106 · 08 K22 (4+ vitrin, yasak sözcükler) · 11 §2.8 (ASO) · 14/15 (reklam ve satın almanın gerçek davranışı).
> Her alan `==== ALAN ====` satırları arasındadır; yapıştırırken o satırları almayın.

## Kurallar (bu metinlerin neden böyle olduğu)

- **Yasak sözcükler** (00 §1.2, 11 §2.8.2): motivasyon, wellness, alışkanlık, terapi, kişisel gelişim, self-help, mindfulness; rakip/başka uygulama adları; "bahis"; "en popüler", "sınırlı süre", "şu an X kişi". Hiçbiri aşağıda yok (script kontrol eder).
- **4+ vitrin** (Apple 2.3.8, 08 K22): başlık, alt başlık, promosyon metni ve ekran görüntülerinde ölüm, alkol, hastalık, küfür yok. Açıklamada ölüm yalnızca 2. paragrafta ve sözcük olarak geçer (D-106).
- **İddia**: oyuncu hiçbir şey yatırmaz. Koç bir karar kartına "İDDİA: …" fişi iğneler, gerçek olasılığı yazar, sonuç gelince fişe damga basılır. Para, oyun parası, puan ya da satın alma yoktur (`packages/engine/src/wager.ts`: servis yalnızca gözlemcidir, sonuca ve statlara dokunmaz). Metinde bu yüzden "iddia / fiş / oran" var, "bahis" yok.
- **Reklam ve satın alma dürüst anlatılır**: v1.0'da satışta olan **tek** ürün "Reklamsız"dır (`no_ads`) ve yalnızca geçiş reklamlarını kapatır; isteğe bağlı ödüllü teklif yerinde kalır (`src/ads/config.ts › noAdsMode: 'showAd'`). Torpil, bilet ve Sezon Paketi bu sürümde satışta değil, metinde de yok.

---

## 1. Uygulama adı (App Store ≤ 30 · Google Play ≤ 30)

==== AD ====
Motto: Sertifikasız Hayat Koçu
==== /AD ====

Not: Talepteki "Motto — Sertifikasız Hayat Koçu" (uzun tire, boşluklu) 32 karakter olur ve iki mağazanın da sınırını aşar; 00 D-002'deki iki nokta biçimi 30'a sığar. Play'de ad alanı da 30 karakterdir.

## 2. Alt başlık (yalnızca iOS, ≤ 30)

==== ALT BAŞLIK ====
Gün gün hayat simülasyonu
==== /ALT BAŞLIK ====

## 3. Promosyon metni (yalnızca iOS, ≤ 170; indekslenmez, incelemesiz güncellenebilir)

==== PROMOSYON ====
Koçun kritik kararlarda sana karşı iddiaya girer. Kazanırsan dosyana HAKSIZ ÇIKTIM damgasını kendi eliyle basar. Hiçbir şey yatırmazsın; kaybeden onun gururu.
==== /PROMOSYON ====

## 4. Kısa açıklama (yalnızca Google Play, ≤ 80)

==== KISA AÇIKLAMA ====
Gün gün hayat simülasyonu. Koç sana karşı iddiaya girer, yanılınca damga basar.
==== /KISA AÇIKLAMA ====

## 5. Tam açıklama (App Store ve Google Play, ≤ 4000)

==== AÇIKLAMA ====
Zamanın kendi kendine aktığı, koçunun her kararını deftere yazdığı hayat simülasyonu. Metin tabanlı, gün gün, 18 yaşından itibaren. Oyunun ortasında reklam yok; koç bile buna şaşırdı.

Anlatıcın Motto, otel balo salonlarında 2.400 seminer vermiş, kitabı basılmamış, sertifikasını veren kurum kapanmış bir hayat koçu. Artık kimseye "yapabilirsin" demiyor; tekrara ve dürüst sayılara inanıyor. Seni son müşterisi olarak seçti. Nasihat vermez, not alır. Hayatın bittiğinde dosyan kapanır, Roast Raporu gelir ve yeni bir müşteri dosyası açılır.

KOÇUN İDDİASI
Kritik bir kararda koç kartın köşesine sarı bir fiş iğneler: "İDDİA: Kayda yetişemezsin." Gerçek oran fişte yazar. Kazanırsan dosyana HAKSIZ ÇIKTIM damgası iner; kaybedersen İSABET. Sen hiçbir şey yatırmazsın, koç da sonucu etkileyemez. Zar onun değil.

ZAMAN AKAR, KART GELİNCE DURUR
Günler kendiliğinden geçer. Bir karar kartı geldiğinde zaman seni bekler. Durdurmak da hızlandırmak da senin elinde. Dilersen Otomatik'e alırsın; seçimleri koç yapar ama bunu önermez.

HER YIL BİR KARNE
Her doğum gününde karne: notların, koçun o yılki isabet oranı ve paylaşılabilir bir Yılın Mottosu. Örnek: "Gözü kara bir yıl. Göz doktoru randevusu da kara."

KARAKTERLER CEVAP VERİR
Annen aile grubundan yazar, İK "size döneceğiz" der, ev arkadaşın kirayı unutur, kedi masadaki bardağa bakar. Her biri kendi ağzıyla konuşur.

HAYAT YOLU
İlk iş, terfi, istifa, aşk, nişan, düğün, bebek. Ya da hiçbiri. Kapı çalınır; açıp açmamak senin kararın.

10.000'DEN FAZLA OLAY
Türkçe ve İngilizce ayrı ayrı yazıldı; biri ötekinin çevirisi değil. Çevrimdışı oynanır, hesap açman gerekmez.

DÜRÜST KISIM
- Oyun ücretsiz indirilir. Reklam ve isteğe bağlı uygulama içi satın alma içerir.
- Geçiş reklamı yalnızca uzun bir aradan sonra oyuna döndüğünde, kaldığın yerden önce gelir. Karar anında, karnede, hayatın son ekranlarında ve "Bugünlük yeter" dediğinde reklam yok.
- Ödüllü reklam bir tekliftir: "Reklam izle" ile "Kalsın" aynı boyda durur. Reddedersen koç bir şey demez.
- Satışta tek ürün var: "Reklamsız". Geçiş reklamlarını kapatır. İsteğe bağlı ödüllü teklifler yerinde kalır; izlemek sana kalmış. Para, stat, sağlık ya da seçenek satmaz.
- Seçenekler satılık değil. İçindekiler yazılı, sürpriz yok. Rastgele kutu, abonelik, enerji sistemi, bekleme sayacı yok.
- 16 yaş ve üzeri içindir. Kara mizah, olgun temalar ve alkol göndermeleri içerir. Her şey kurgudur; kişi, kurum ve olaylar uydurmadır.

Gizlilik Politikası ve Kullanım Koşulları: [GİZLİLİK_URL] · [KOŞULLAR_URL]
Destek: [DESTEK_EPOSTA]
D2P Technology
==== /AÇIKLAMA ====

> Yayından önce `[GİZLİLİK_URL]`, `[KOŞULLAR_URL]`, `[DESTEK_EPOSTA]` gerçek değerlerle değiştirilmeli (14 §5 D-16). İstenmezse son üç satır silinebilir; App Store bu bağlantıları ayrı alanlarda zaten ister. Apple açıklamada URL'yi tıklanabilir yapmaz.

## 6. Anahtar kelimeler (yalnızca iOS, ≤ 100, virgülle, boşluksuz)

==== ANAHTAR KELİMELER ====
simülatör,yaşam,seçim,kara mizah,kariyer,ilişki,aşk,karne,çevrimdışı,hikaye,metin,iddia,damga,roast
==== /ANAHTAR KELİMELER ====

- Ad ve alt başlıktaki sözcükler (Motto, sertifikasız, hayat, koçu, gün, simülasyonu) tekrar edilmedi: Apple onları zaten indeksler.
- Rakip/başka uygulama adı, marka, "motivasyon" yok. "ölüm" 11 §2.8.1'deki taslakta vardı; 4+ vitrin ilkesine yakın durmak için çıkarıldı (anahtar kelime alanı görünmez ama aranınca eşleşir).
- "iddia" bilinçli bir seçim: oyunun imza mekaniği. Apple ve Play'de kumar sınıflandırmasıyla karışma riski düşük ama sıfır değil (bkz. compliance.md §5). Olumsuz geri bildirim gelirse "fiş" ile değiştirin.

## 7. Yenilikler — sürüm 1.0

==== YENİLİKLER ====
İlk sürüm. Koç defteri açtı, kalemi denedi, ilk müşterisini bekliyor. Sen.
==== /YENİLİKLER ====

## 8. Kategori önerisi

| Mağaza | Birincil | İkincil | Not |
|---|---|---|---|
| App Store | **Oyunlar › Simülasyon** | Oyunlar › Rol Yapma (alt kategori 2) · İkincil kategori: **Eğlence** | "Sağlık ve Fitness", "Yaşam Tarzı", "Eğitim" **asla** (D-053 konumlandırma, 00 risk 3). |
| Google Play | **Oyun › Simülasyon** | Etiketler (en çok 5): Hayat simülasyonu, Hikâye/Anlatı, Gündelik (Casual), Tek oyunculu, Çevrimdışı | Etiket adları konsoldaki listeden seçilir; listede tam karşılığı yoksa en yakını. |

## 9. Ekran görüntüsü başlıkları (çerçevelerde kullanılan, 4+ vitrin)

| # | Sahne | Başlık (büyük) | Alt satır (küçük) |
|---|---|---|---|
| 01 | Nasıl oynanır | Zaman akar. | Kart gelince durur. |
| 02 | Karar kartı + iddia fişi | Koçun sana karşı iddiaya girer. | Oran fişte yazar. Zar onun değil. |
| 03 | Damga + koç satırı | Yanılırsa damgayı kendi basar. | HAKSIZ ÇIKTIM. Nadir olur. |
| 04 | HUD, yıllar sonra | Gün gün bir hayat. | İş, ev, kedi, anne baskısı. |
| 05 | Karne | Her yıl bir karne. | Ve paylaşılabilir bir Yılın Mottosu. |
| 06 | Hayat Yolu anı | Aşk, nişan, düğün, bebek. | Ya da hiçbiri. Kapı senin. |
| 07 | Müşteri Dosyası | Yeni müşteri, yeni dosya. | Koç not almaya hazır. |
| 08 | Mağaza | Oyunun ortasında reklam yok. | Tek ürün: Reklamsız. Seçenekler satılık değil. |

Apple 2026 itibarıyla ekran görüntüsü metinlerini arama için okuyabiliyor (00 D-073); başlıklar yasak sözcük kontrolünden geçti.

---

## Karakter sayıları (script çıktısı)

<!-- COUNTS:tr -->
| Alan | Karakter | Sınır | Durum | Not |
|---|---|---|---|---|
| App name (iOS+Play) | 30 | 30 | OK |  |
| Subtitle (iOS) | 25 | 30 | OK |  |
| Promotional text (iOS) | 158 | 170 | OK |  |
| Short description (Play) | 79 | 80 | OK |  |
| Full description (both) | 2551 | 4000 | OK |  |
| Keywords (iOS) | 99 | 100 | OK | 14 terms |
| What's new (both) | 74 | 4000 | OK |  |

(`node docs/store/check-limits.mjs --write` ile üretildi; yasak sözcük taraması temiz.)
