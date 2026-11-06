# 12 — Benzer ve Tutulan Oyunlar: Özellik Karşılaştırması ve Motto'ya Aktarım

Kaynak: `docs/research/02-rakip-ve-pazar-analizi.md` (teardown tablosu, yorum madenciliği), `01`, `07`, `11`. Karar: `00 §12 D-065`.

## 1. Hangi oyundan ne alıyoruz

| Oyun | Tutulan özellik | Neden tutuluyor | Motto'da hâli | Karar |
|---|---|---|---|---|
| **BitLife** | Mikro-tur + 4 stat çubuğu + olay pop-up | Sıfır sanatla 8 yıldır üst lig; ritim bağımlılık yapıyor | Gün kartı + 4 çubuk + Para/Anne Baskısı/Cringe; tur = gün (D-061) | **Adapte** |
| BitLife | Ribbon koleksiyonu | Yıllardır konuşulan tek meta; paylaşım üretiyor | **Teşhis** etiketleri (roast tonlu, 30 → 120), ekranda çarparak gelir | **Al** |
| BitLife | Haftalık challenge + aylık tema paketi | Geri dönüş takvimi | Antrenman Kampı (haftalık seed) + sezon paketi (offline takvim) | **Al** |
| BitLife | Interstitial ağırlık, kayan paywall | En çok 1 yıldız nedeni | Rewarded-first, interstitial yalnız ölüm özeti sonrası, Torpil gerçekten reklamsız | **Reddet (tersini yap)** |
| **Reigns** | Swipe karar + absürt sonuç | Dokunsal, hızlı, meme üretir | Cevap balonlarını sağa/sola kaydırarak da seçme (2 seçenekli günlerde), sonuç her zaman koç tarafından açıklanır ("neden öldüm?" şikâyetine cevap) | **Adapte** |
| Reigns | Ölüm = yeni kral, kart açılımı | "Bir daha" döngüsü | Ölüm = Roast Raporu + Kondisyon açılımı + 40 sn yeni hayat | **Al** |
| **Alter Ego** | Idle dönüş, "sen yokken" | Solo dev için ölçeklenebilir geri dönüş kancası | Welcome-back "Sakatlık Raporu" (gerçek gün → oyun günü) | **Al** |
| Alter Ego | Kişilik testi + çoklu son | "Kendini keşfet" vaadi | Kalıp Dedektörü → Roast Raporu'nda "sen busun" sayıları | **Adapte** |
| **Lifeline** | Chat-UI, karakter gerçek zamanda yazıyor | Karakter aidiyeti; bildirim doğal hikâye devamı | NPC diyalog balonları (D-062); bildirim = karakterden mesaj ("Annen: yemek yedin mi?") | **Al** |
| **Duolingo / Finch** | Cezasız streak, persona bildirim, pet | D7 +%14 (streak wager); suçluluk yerine şefkat | Mola ritüeli (duraklar, sıfırlanmaz), koç ağzında ≤1 bildirim/gün, Pamuk (kedi) duygusal bağ | **Al** |
| **Carrot Weather** | Persona + kişilik ayarı + başarımlar | 10 yıllık sarkastik persona modeli, abonelik | Motto + Nazik/Normal/Acımasız ayarı; Torpil ile 2. kişilik (Kader) | **Al** |
| **Monopoly Go** | Her an 2–3 görünür ilerleme çubuğu + albüm | Sektörün en yüksek LTV formülü | HUD'da Tek Hedef + aktif zarf + Teşhis ilerlemesi her an görünür | **Adapte (parasız)** |
| **Wordle** | Günde bir + paylaşım gridi, backend yok | Sıfır sunucuyla viral | "Günün Günü" (tarih seed'li olay, herkese aynı) + emoji'li Karne paylaşımı | **Al** |
| **Royal Match** | Sürtünme sıfır (yükleniyor yok, retry ekranı yok) | Candy Crush'ı geçme sebebi | Ertesi Gün → ilk metin ≤300 ms, hiç yükleme ekranı yok | **Al** |
| **Choices / Episode** | Anahtar/elmas bekleme duvarı | Gelir getiriyor ama nefret ediliyor; TR hukuk/karanlık tasarım riski | Yok. Enerji/bekleme satışı yasak (D-055) | **Reddet** |
| **Dumb Ways to Die** | Komik ölüm = viral marka | 100M+ indirme TikTok'la | Ölüm nedenleri komik ama özendirmeyen (T9); ölüm ilanı kartı paylaşılabilir | **Adapte (hukuk filtresiyle)** |
| **Hades** | Her ölümde yeni diyalog | Ölüm = içerik | Koç ve NPC'ler eski hayatları hatırlar (metaMemories) | **Al** |

## 2. Yorum madenciliğinden gelen "yapma" listesi (tasarım kuralı)
1. İki tıklamada bir reklam → **yasak**. 2. "Reklamsız aldım, reklam görüyorum" → Torpil tüm zorunlu reklamları kapatır. 3. "100. hayatta aynı 50 cümle" → her sık satır ≥5 varyant, görülmemişe ×3 öncelik. 4. "Neden öldüm?" → koç her ölümü sebep + ders ile açıklar. 5. Makine çevirisi Türkçe/İngilizce → iki dilde native yazım. 6. "Sonra ne?" boşluğu → Kondisyon + Tanıdık Yüzler + Kronik Teşhis. 7. Ebeveyn şikâyeti → 16+ içerik kotası, metadata 4+ vitrin.

## 3. Motto'nun kimsede olmayanları (pitch'in ilk slaydı)
- Karakter sahibi anlatıcı + **sana karşı iddia** + HAKSIZ ÇIKTIM damgası koleksiyonu.
- **Gün gün yaşanan, karakterlerin konuştuğu** hayat (BitLife yıl atlar, Lifeline tek karakter).
- Ölümde **Roast Raporu**: ömür boyu kalıpların sayıyla.
- Anne Baskısı metresi + **ANNE ARIYOR** baskını.
- İki dilde native mizah, Türkiye'den çıkan ilk global hayat simülasyonu.
