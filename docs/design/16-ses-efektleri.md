# 16 — Ses Efektleri

> **Durum:** uygulandı (2026-11-12). **Kapsam:** `apps/mobile` — ses seti, sentez betiği, çalma yöneticisi, olay→ses eşlemesi, ayarlar.
> **Okur ve uygular:** 07 §2.4.6 (haptik sözlüğü), 07 §2.5 / §2.5.1 (juice tablosu, SFX sütunu), 07 §2.2.9 (Ayarlar → Geri bildirim), 00 D-011 / D-059 / D-063.
> **07'den bilinçli sapma:** 07 §2.5 SFX kaynağı olarak CC0 paketlerini (Kenney, freesound) aday gösteriyordu. Karar değişti: **üçüncü taraf ses dosyası yok**; her ses bizim betiğimizle sentezlenir (bkz. §5). 07 §2.5.1'deki "SFX (sentez → wav)" sütunu zaten bu yöndeydi; bu belge onu tek kural yapar. Örnekleme hızı 48 kHz yerine 22,05 kHz (dosya ≤ 60 KB sınırı için).

## 1. Özet

- **31 ses, 41 dosya** (en sık çalan 7 sesin 2–3 perde varyantı var), toplam ≈ 662 KB; hepsi `apps/mobile/assets/sfx/*.wav`, 16 bit mono PCM, 22 050 Hz, tepe −3 dBFS.
- Hepsi `apps/mobile/scripts/gen-sfx.mjs` ile **sıfırdan sentezlenir** (osilatör, tohumlu gürültü, zarf, biquad filtre, perde kayması). Betik deterministiktir: aynı betik → bayt bayt aynı dosyalar (test bunu doğrular).
- Çalma: `src/state/sound.ts` (`sfx('stamp_thud')`), haptikle **aynı anlamsal anlarda** tetiklenir (`useGame.ts`'te her `haptic.*` çağrısının yanında).
- Varsayılan **açık**, ana ses düzeyi 0,6 ("Orta"). Ayar: karar bölgesindeki **≡** → Ayarlar (Ses efektleri aç/kapa, Kısık/Orta/Yüksek, Titreşim aç/kapa).
- **Müzik yok** (bkz. §8).

Kimlik: kâğıt, damga, büro. Sesler kısa, kuru ve alçakgönüllü; "oyun jingle'ı" değil, masa başı sesi. Kayıp sade, kazanım biraz daha parlak (07 §2.5 kural 2); negatif olayda ses **daha az** (kural 5).

## 2. Ses listesi

Süre / boyut ilk varyantındır. "Düzey" çalışma anındaki karışım kazancıdır (`src/state/sfx.ts` → `gain`; dosyaların hepsi aynı tepeye normalize edilir, yumuşaklık burada verilir). Öncelik: 0 ortam · 1 geri bildirim · 2 an.

| Ses | Var. | Süre | Boyut | Düzey | Önc. | Amaç | Sentez tarifi |
|---|---|---|---|---|---|---|---|
| `ui_tap` | 3 | 55 ms | 2,5 KB | 0,45 | 1 | Her arayüz dokunuşu (hız, dil, karıştır, anahtarlar) | Bant geçiren gürültü tıkı (2,4 kHz, 7 ms) + 1 250 Hz ve 520 Hz kısa sinüsler: kâğıda tükenmez kalem |
| `card_slide` | 3 | 210 ms | 9,3 KB | 0,40 | 0 | Gün kartı gelir | Bandı 1,5 → 3,5 kHz yükselen gürültü (kemer zarf) + 4 kHz üstü hışırtı + sonda "oturma" tıkı |
| `choice_confirm` | 1 | 160 ms | 7,1 KB | 0,45 | 1 | Seçenek onayı | Kalem tıkı + yükselen beşli: 660 Hz → 990 Hz, yumuşak sinüs |
| `swipe_left` / `swipe_right` | 1 | 200 ms | 8,9 KB | 0,45 | 1 | `swipe: left/right` etiketli seçenek | Gürültü süpürmesi; bant sola 3,2 → 1 kHz iner, sağa 1 → 3,2 kHz çıkar |
| `stamp_thud` | 1 | 270 ms | 12 KB | 1,00 | 2 | Açılış logosu damgası; İSABET damgası | Perdesi düşen gövde tonu (275 → 95 Hz, 4 armonik) + alçak geçiren "şap" gürültüsü + 3,5 kHz tık + küçük geri tepme |
| `stamp_heavy` | 1 | 460 ms | 20 KB | 1,00 | 2 | HAKSIZ ÇIKTIM damgası | Aynı tarif, daha alçak ve uzun (235 → 75 Hz) + kuyrukta 700 Hz civarı "mürekkep yayılması" hışırtısı |
| `stamp_small` | 1 | 150 ms | 6,7 KB | 0,70 | 1 | Karne "DOSYALANDI" kaşesi; evrakta Tercüme; ses düzeyi önizlemesi | Aynı tarifin hafifi (410 → 150 Hz, 30 ms) |
| `money_gain` | 2 | 380 ms | 17 KB | 0,50 | 1 | Sonuçta para + | Dörtlü aralıkla iki "bozukluk": harmonik olmayan kısmiler (1 · 2,76 · 5,4) 1 900 ve 2 530 Hz, kısa metalik tık |
| `money_loss` | 1 | 300 ms | 13 KB | 0,45 | 1 | Sonuçta para − | İnen iki yumuşak nota (392 → 294 Hz) + boğuk gürültü; metal ve parıltı yok |
| `stat_up` / `stat_down` | 2 | 100 ms | 4,5 KB | 0,30 | 0 | Stat net yönü (sonuç başına **tek** tık) | İki minik bip: yukarı 880 → 1 175 Hz, aşağı 700 → 520 Hz |
| `payday` | 1 | 760 ms | 34 KB | 0,42 | 1 | Akış satırında maaş / harçlık | Yazar kasa: iki mekanik "tak" (gürültü), çan (2 093 Hz, kısmiler 2,4 · 4,1), üç bozukluk, çekmece hışırtısı |
| `bill` | 1 | 360 ms | 16 KB | 0,40 | 1 | Akış satırında kira | Yırtılan kâğıt şeridi (çıtırtılı, bandı yükselen gürültü) + tek boğuk nota (196 Hz) |
| `phone_ring` | 1 | 980 ms | 43 KB | 0,50 | 2 | Arama olayı kartı (ANNE ARIYOR vb.) | İki kısa çan trili: 1 320 + 1 650 Hz, 22 Hz "tokmak" titremesi; iki vuruş, sonra sessiz. Jenerik; gerçek bir zil melodisi değil |
| `page_turn` | 1 | 260 ms | 12 KB | 0,50 | 1 | Hayat başlar, "Bir Yıl Daha", "Yeni Müşteri" | Bandı yükselen gürültü + 60 Hz çırpıntı + iniş tıkı |
| `birthday` | 1 | 820 ms | 36 KB | 0,55 | 2 | YAŞLANIYORSUN / doğum günü | Takvim yaprağı (gürültü) + üç yumuşak çan notası: Re5, La5, Re6 (açık beşli + oktav) |
| `report_reveal` | 1 | 380 ms | 17 KB | 0,70 | 2 | Kısa Karne masaya düşer | Bandı inen gürültü (2,5 → 0,9 kHz) + yumuşak "güm" (260 → 110 Hz) |
| `surprise_good` | 1 | 620 ms | 27 KB | 0,50 | 2 | İyi sürpriz kartı | Yükselen beş camsı ping (1,6 – 4,2 kHz) + çok hafif tiz parıltı |
| `bad_news` | 1 | 440 ms | 19 KB | 0,90 | 2 | Ağır kötü haber kartı (valence −2); üzücü avatar anı (ayrılık, işten çıkış) | Yavaş ataklı boğuk "güm" (250 → 98 Hz) + alçak gürültü; damga tıkı yok, metal yok |
| `milestone` | 1 | 980 ms | 43 KB | 0,65 | 2 | İyi giden hayat dönüm noktası (sevgili, teklif, düğün, bebek, mezuniyet); terfi / yeni iş anı | Kendi dört vuruşluk figürümüz: Sol4 – Do5 – Mi5, ardından tutulan Do majör akoru; pirinçe yakın yumuşak kısmiler |
| `legendary` | 1 | 1 150 ms | 51 KB | 0,65 | 2 | EFSANE OLAY | Beş çan notası (Re5, Fa♯5, La5, Re6, Fa♯6), sonuncusu çınlar; altın tozu parıltısı |
| `omen` | 1 | 1 120 ms | 49 KB | 0,55 | 2 | "Son perde" alamet kartı | Yavaşça vuran iki alçak ton (110 ve 113,5 Hz, armonikli), 0,4 sn'de kabarır, 0,55 sn'de söner |
| `death` | 1 | 1 350 ms | 60 KB | 0,75 | 2 | Ölüm anı | **Tek** alçak, yumuşak çan vuruşu (Sol3 196 Hz + alt oktav), sönmeye bırakılır. Melodi, efekt, şaka yok |
| `grief` | 1 | 850 ms | 38 KB | 0,30 | 2 | Kayıp / veda sahnesi | Tek, sessiz, saf ton (Mi4 330 Hz, 80 ms atak). Sahnenin geri kalanı susar (§4.4) |
| `purchase_success` | 1 | 560 ms | 25 KB | 0,65 | 2 | Satın alma başarılı | Küçük kaşe (makbuz) + iki parlak nota (Mi5 → Si5) + tek bozukluk |
| `error_locked` | 1 | 200 ms | 8,9 KB | 0,55 | 1 | Kilitli seçenek / reddedilen eylem | İki boğuk "tok" (220 Hz, armonikli + kısa gürültü) |
| `day_advance` | 3 | 70 ms | 3,1 KB | **0,16** | 0 | Yeni gün | En hafif ses: takvim yaprağı tıkı (1,8 kHz bant gürültüsü, 11 ms) + çok kısık 440 Hz |
| `wager_pin` | 1 | 140 ms | 6,2 KB | 0,70 | 1 | İddia fişi karta iğnelenir | Kısa hışırtı, sonra iğne: tiz tık + 1,8 kHz + 300 Hz "tok" |
| `paper_rustle` | 1 | 320 ms | 14 KB | 0,45 | 0 | Evrak kartı; zarf; "Bugünlük yeter"; Roast Raporu sayfası | Çıtırtılı iki bant gürültüsü (3 kHz ve 1,4 kHz), kemer zarf |
| `bubble` | 2 | 65 ms | 2,9 KB | 0,28 | 0 | NPC balonu | Yukarı kayan yumuşak "pıt" (520 → 780 Hz) |

Ortak mastering (betikte `master()`): 20 Hz DC engelleyici → 2 ms açılış / 8 ms kapanış kosinüs fade → tepe −3 dBFS → 16 bit. Telefon hoparlörü ≈ 250 Hz altını veremediği için "alçak" seslerin hepsi armonik ya da gürültü katmanı taşır (test: enerjinin > %30'u 250 Hz üstünde).

Bilerek **sessiz** bırakılanlar: daktilo (koç satırı her 3 karakterde tık — 07 #27; yüzlerce tekrar, yorucu), uçan sayılar ayrı ayrı (sonuç başına tek tık), ekran sarsıntısı / flaş (görsel kanal), atlama özeti (07 §2.2.1: "SFX yok"), oturum sonu önerisi, otomatik seçilen cevap (oyuncu dokunmadı), düdük (07 "yalnızca Mola ve ölümde": ölümde çan tercih edildi, Mola henüz yok).

## 3. Olay → ses eşlemesi

Kaynak: `src/state/sfx.ts` (`EFFECT_SFX`, `sfxForCard`, `sfxForFlow`, `sfxForOutcome`, `sfxForStamp`, `sfxForChoice`, `MOMENT_SFX`, `UI_SFX`). Motor efekt türlerinin tamamı tabloda; boş satır karardır, eksik değil.

### 3.1 Motor efektleri (`Effect.kind`, `useGame.play`)

| Efekt | Koşul | Ses | Haptik (mevcut) | Görsel karşılığı |
|---|---|---|---|---|
| `SHOW_DAY` | yeni gün (doğum günü ve ölüm günü hariç) | `day_advance` | — | tarih satırı |
| | akış satırında maaş / harçlık | `payday` | — | "Maaş" satırı |
| | akış satırında kira (maaştan 260 ms sonra) | `bill` | — | "Kira" satırı |
| | kart: kayıp / veda etiketi (`loss:*`, `veda_kayip`, `kayip`, `cenaze`, `cenaze_taziye`, `taziye`) | `grief` (+ sahne susar) | selection | kart |
| | kart: `omen` etiketi | `omen` | selection | kart |
| | kart: arama (`call`) | `phone_ring` | selection | kırmızı çerçeveli kart |
| | kart: efsane | `legendary` | selection | altın çerçeve, an |
| | kart: sürpriz | `surprise_good` | selection | lime çerçeve |
| | kart: valence −2 | `bad_news` | selection | kart |
| | kart: evrak | `paper_rustle` | selection | kesik çizgili evrak |
| | kart: diğer | `card_slide` | selection | kart pop |
| | kartta iddia fişi (220 ms sonra) | `wager_pin` | — | fiş iğnelenir |
| `SHOW_DIALOG` `dialog` | NPC balonu | `bubble` | — | balon |
| `SHOW_DIALOG` `reply` | oyuncu dokundu | `choice_confirm` / `swipe_left` / `swipe_right` | selection | cevap balonu |
| | otomatik seçim | — | — | cevap balonu ("otomatik") |
| `SHOW_DIALOG` `outcome` | para > 0 / < 0 | `money_gain` / `money_loss` | light | uçan sayı (lime / kırmızı) |
| | statların net yönü + / − (140 ms sonra) | `stat_up` / `stat_down` | light | uçan sayılar, yüz ifadesi |
| | dönüm noktası olayı ve sonuç olumlu | `milestone` (tık yerine) | light | sonuç satırı |
| `SHOW_DIALOG` `coach` | koç satırı | — | — | daktilo metin |
| `FLOAT_NUM` | — | — (sonuç satırıyla tek seferde) | — | uçan sayı |
| `STAMP` | `calledIt` | `stamp_thud` | medium | damga + lime flaş + sarsıntı |
| | `iWasWrong` | `stamp_heavy` | **heavy** | damga + kırmızı flaş + sert sarsıntı |
| `REPORT_CARD` | yaş atlama ekranı / doğum günü anı | `birthday` | — | YAŞLANIYORSUN |
| | karne feed'e düşer | `report_reveal`, 300 ms sonra `stamp_small` | medium | karne + DOSYALANDI kaşesi |
| `DEATH` | ölüm anı açılır | `death` | heavy (mezar taşı) | gri yüz, EKG, mezar taşı |
| `NOTIFY_PLAN` | zarf açıldı satırı | `paper_rustle` | — (D-011) | sistem satırı |
| `HAPTIC` (`error`) | kilitli seçenek / reddedilen eylem | `error_locked` | error | × işaretli soluk buton |
| `SESSION_END_SUGGESTED` | — | — | — | sistem satırı, vurgulu buton |

### 3.2 Avatar anları ve arayüz

| An / eylem | Ses | Haptik |
|---|---|---|
| An: doğum günü (yaşlanma) | `birthday` | — |
| An: yeni iş / terfi / emeklilik | `milestone` | — |
| An: ayrılık / işten çıkış | `bad_news` | — |
| An: efsane | `legendary` | — |
| An: iddia zaferi | — (`stamp_heavy` zaten çalar) | heavy |
| An: ölüm | `death` | — |
| Açılış: MOTTO logosu damgası | `stamp_thud` (web'de yalnızca ilk dokunuştan sonra duyulur) | — |
| Müşteri Dosyası: karıştır, ‹ ›, hızlı yaşa; dil; hız; otomatik; okunmamış; Ertesi Gün; Kapat; ayar anahtarları | `ui_tap` | selection |
| "Bu olsun" (hayat başlar), "Bir Yıl Daha", "Yeni Müşteri" | `page_turn` | selection / medium / success |
| "Bugünlük yeter" | `paper_rustle` | — |
| Evrakta "Tercüme" | `stamp_small` | — |
| Roast Raporu sayfası açılır | `paper_rustle` | — |
| Ses düzeyi seçimi (önizleme) | `stamp_small` | — |
| Satın alma başarılı | `purchase_success` — **kanca hazır, bağlanmadı**: mağaza akışı (`src/monetization/`) başarı anında `sfx(UI_SFX.purchase)` çağırmalı | success (öneri) |

## 4. Karışım ve çalma kuralları

Yönetici: `src/state/soundCore.ts` (saf mantık, test edilir) + `src/state/sound.ts` (tekil örnek, platform bağlantısı).

1. **Düzey** = ana ses (0,35 / 0,6 / 0,9) × sesin `gain`'i × çağrı çarpanı; üst sınır 1. Gün tıkı setin en kısık sesidir (0,16).
2. **Aynı ses hız sınırı** (`gapMs`): aynı ad bu süreden önce yeniden başlamaz. Bir karede 8 stat tıkı istenirse 1 çalar. Maaş / kira satırı neredeyse her gösterilen günde vardır (takvim haftaları atlar); yazar kasa ve yırtılan fiş en çok 20 sn'de bir çalar, satır her zaman görünür.
3. **Ortam bütçesi:** öncelik 0 sesler (kart, balon, gün, stat tıkı, hışırtı) 400 ms'de en çok 3. Geri bildirim (1) ve anlar (2) bütçeye takılmaz.
4. **Yas sahneleri — neredeyse sessizlik:** kayıp / veda kartı geldiğinde yalnızca `grief` çalar; o günün geri kalan her sesi (onay, tık, para, damga) susar, ertesi gün normale döner. Ölüm çanı bu susturmadan muaftır. Düdük, fanfar, bozukluk bu sahnelerde hiçbir koşulda çalmaz.
5. **▶▶ + Otomatik (turbo):** yalnızca öncelik 2 sesler (damga, karne, doğum günü, dönüm noktası, ölüm…) çalar; gün başına tıklar atlanır.
6. **Varyant:** çok varyantlı seslerde aynı dosya art arda iki kez çalmaz (±1 yarım ses perde farkı).
7. **Arka plan:** uygulama arka plana / etkin olmayan duruma geçince çalan her şey kesilir, yeni ses başlamaz (native: oturum pasifleştirilir; web: `AudioContext.suspend()`). Arka plan kaydı için sıradaki vuruşlar boşaltılırken ses çalmaz.
8. **Sessiz mod:** iOS'ta ses oturumu `ambient` + `mixWithOthers` (`playsInSilentMode: false`) → **zil/sessiz anahtarı bizi susturur** ve **kullanıcının kendi müziği kesilmez**. Android'de ses odağı istenmez; zil sessiz / titreşimdeyken çalınmaz. Web'de iOS Safari WebAudio'yu zaten sessiz anahtarına bağlar.
9. **Web otomatik oynatma politikası:** `AudioContext` yalnızca ilk kullanıcı hareketinde (dokunma / tık / tuş) yaratılır; 41 dosya o andan sonra indirilip çözülür. Öncesinde her çağrı sessiz no-op'tur. Geç gelen dosya 250 ms içinde yetişirse çalar, yetişmezse atlanır.
10. **Açılış:** kayıtlı "sessiz" ayarı okunmadan hiçbir ses çalmaz; açılış damgası en çok 400 ms bekletilir.
11. **Asla çökmez:** ses modülü yoksa (eski dev client, desteklemeyen tarayıcı, test ortamı) yönetici sessiz no-op olur; her arka uç çağrısı korumalıdır.
12. **Kalıcılık:** ses `motto.sound.v1` = `{ muted, volume }`, titreşim `motto.haptics.v1`; oyun kaydından (`SAVE_KEY`) bağımsız, yeni hayatta ve kayıt sıfırlamada korunur.

Teknik: native tarafta `expo-audio` (~58.0.12; `createAudioPlayer`, dosya başına bir oynatıcı, en çok 20'lik LRU havuz, sık kullanılan 12'si açılışta), web'de `expo-audio` yüklenmez — 100 satırlık WebAudio arka ucu (`src/state/audioBackend.ts`; native: `audioBackend.native.ts`). `app.json` eklentisi mikrofon iznini, `RECORD_AUDIO`'yu ve arka plan oynatma servisini **kapatır** (yalnızca efekt çalıyoruz).

## 5. Lisans beyanı

- Bu oyundaki **bütün ses efektleri şirket içinde, `apps/mobile/scripts/gen-sfx.mjs` betiğiyle sentezlenmiştir.** Hiçbir üçüncü taraf ses dosyası, örnek (sample), kayıt, ses kütüphanesi ya da hazır ses paketi kullanılmamıştır; CC0 dahil dış kaynak yoktur.
- Betikteki her şey aritmetiktir: sinüs toplamları, tohumlu sözde-rastgele gürültü (mulberry32 — kamu malı algoritma), üstel / kosinüs zarflar, RBJ "Audio EQ Cookbook" biquad formülleri (genel bilinen formüller; kod bizim).
- Sesler bilinen bir jingle'ı, markayı ya da başka bir oyunun imza sesini **taklit etmez**: telefon zili jenerik iki tonlu trildir, dönüm noktası figürü ve efsane dizisi sıradan arpejlerdir, doğum günü sesi "Happy Birthday" ezgisi değildir.
- Dosyalar betikten bayt bayt yeniden üretilebilir: `pnpm --filter motto-mobile run gen:sfx`; doğrulama `run check:sfx` ve `test/sound.test.ts` (iki çalıştırma → aynı SHA-256; depodaki dosyalar = betik çıktısı). `assets/sfx/manifest.json` her dosyanın boyutunu, süresini ve özetini tutar.
- Kural: `assets/sfx/` altına elle dosya **eklenmez**. Yeni ses = betiğe yeni fonksiyon. `check:sfx` betiğin üretmediği her `.wav` için hata verir.

## 6. Erişilebilirlik

- **Ses hiçbir bilginin tek taşıyıcısı değildir** (07 §2.5 kural 3): §3 tablolarındaki her sesin bir görsel karşılığı (kart, damga, uçan sayı, flaş, satır) ve çoğunun haptiği vardır. Ses kapalıyken oyun eksiksiz oynanır.
- Ses ve titreşim ayrı ayrı kapatılır; ikisi de kalıcıdır. Anahtarlar `switch` rolü + durum (`aria-checked`) taşır, dokunma hedefi ≥ 44 pt.
- Varsayılan düzey ölçülüdür; en sık ses en kısıktır; ani yüksek ses yok (hepsi 2 ms fade ile açılır, tepe −3 dBFS).
- Sistem sessiz modu ve kullanıcının kendi sesi (müzik, podcast, ekran okuyucu) önceliklidir: oturum karışır, kesmez, kısmaz.
- İşitme hassasiyeti: tiz parıltılar (sürpriz, efsane) kısa ve düşük düzeyli; uzun süren ton yalnızca alamet (1,1 sn) ve ölüm (1,35 sn).
- Yas sahneleri sessizdir (§4.4): duygusal ağırlığı olan anda oyun gürültü yapmaz.

## 7. Doğrulama

- `test/sound.test.ts`: eşleme her motor efekt türünü kapsıyor (motor 3 hayat oynatılıp çıkan türler toplanır); kullanılmayan / tanımsız ses yok; hız sınırı; ortam bütçesi; sessiz ayarının kalıcılığı; arka plan; arka uçsuz no-op; hata fırlatan arka uç / depolama; betik determinizmi; WAV başlığı, boyut sınırı, tepe, kırpılma, DC, kenar tıkı.
- `node scripts/gen-sfx.mjs --report`: dosya başına süre, bayt, tepe, RMS, DC, kırpılan örnek, 250 Hz üstü enerji payı.
- Playwright (web export): ilk dokunuştan önce 0 ses isteği ve 0 `AudioContext`; dokunuştan sonra 41 dosya HTTP 200; sessiz ayarı yeniden yüklemede korunur; sekme gizlenince bağlam askıya alınır.
- **İnsan kulağı ve gerçek cihaz gerektirenler:** tını ve düzey dengesi (sayılar klip / DC / süreyi doğrular, "hoş mu"yu değil), telefon hoparlöründe alçak seslerin duyulurluğu, iOS sessiz anahtarı ve müzikle karışma, Android'de zil modu, `expo-audio` gecikmesi (dokunuş → ses), 30 dakikalık oturumda yorgunluk.

## 8. Sonraki işler

- **Arka plan müziği yok** (07 D-ÖNERİ-07-07 ile uyumlu). İleride istenirse seçenekler: (a) aynı betik yaklaşımıyla şirket içi üretim (hak tamamen bizde), (b) telif devri sözleşmeli sipariş beste, (c) lisanslı kütüphane. **Lisans uyarısı:** (c)'de mağaza, reklam ve fragman kullanımı, süre ve bölge kapsamı yazılı olmalı; "royalty-free" ≠ "her kullanım serbest"; üretken yapay zekâ müziğinde eğitim verisi ve mülkiyet belirsizliği hukuk onayı olmadan kabul edilmez. Müzik eklenirse ayrı anahtar ve ayrı ses oturumu kuralı gerekir (kullanıcının müziği çalarken bizimki başlamamalı).
- Mağaza akışına `purchase_success`, reklam ödülüne uygun bir ses (şimdilik yok) bağlanması.
- Cihaz dinleme turundan sonra `gain` / `gapMs` ayarı (tek dosya: `src/state/sfx.ts`); gerekirse tarif düzeltmesi (betik) ve yeniden üretim.
- "Hareketi azalt" / düşük performans modunda ses politikası (07 §2.2.9) — şimdilik sesler değişmiyor.
- 07 §2.5'te adı geçen ama henüz ekranı olmayan olaylar: Teşhis etiketi, seri (streak), Kondisyon, göz teması mini oyunu, Mola düdüğü.
- Ayarlar sayfası büyüdüğünde (dil, tema, metin boyutu — 07 §2.2.9) bu iki anahtar oraya taşınır.
