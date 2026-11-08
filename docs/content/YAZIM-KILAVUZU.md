# YAZIM KILAVUZU — 10.000 olay için toplu yazım brifingi

> **Kimin için:** Her parti (batch) yazarı — insan ya da ajan. Bu belgeyi okumadan tek olay yazılmaz.
> **Dayanak:** 00 §15 D-155 (en az 10.000 benzersiz, gerçek hayata benzeyen olay), D-156 (paketleme), 00 §14 D-093/D-094 (şaka bütçesi, mekanizma çeşitliliği), 01 (ses), 04 (NPC'ler, kariyerler, Tek Hedef), 08 §2.1 (22 kural kategorisi), şema: `packages/content-schema/src/`.
> **Kaynak tablo:** `docs/content/taxonomy.json` — 132 yaşam alanı (domain), kota toplamı **tam 10.000**.
> **Sürüm:** v1 · 2026-11-08

---

## 1. Ne yazıyoruz, nasıl yazıyoruz

Motto bir gün-gün hayat simülasyonudur: 18 yaşından ölüme kadar her gösterilen günde **tek bir olay** olur. Oyuncu bu olayların toplamına bakıp "bu benim hayatım olabilirdi" demelidir. Hedefimiz 10.000 olay; ama sayıdan önemlisi **her olayın ayrı, tanınabilir bir gerçek hayat durumu** olmasıdır. Aynı şakanın on kılığı değil, on ayrı gün.

**Üretim hattı (D-155):**

1. **Tohum turu.** Her domain için önce kotası kadar *tek satırlık durum tohumu* yazılır (`seeds/<domain>.txt`). Tohum = "kim, nerede, ne oldu" (≤ 15 kelime). Taksonomideki 5 `examples` satırı yalnızca yön gösterir; onları **kopyalamayın**, tohum listesine aynen almayın.
2. **Tohum ayıklama.** Tohumlar yakın-kopya taramasından geçer (bkz. §6). Aynı durumun ikinci versiyonu silinir.
3. **Parti yazımı.** Tohumlar **40'lık partiler** hâlinde tam olaya dönüştürülür. Bir parti tek domaindendir.
4. **Doğrulama.** Her parti: şema (`pnpm --filter @motto/content-schema validate <klasör>`) → kırmızı çizgi taraması (§7) → yakın-kopya taraması → öz-kontrol listesi (§9).
5. **Sayım raporu.** Dalga sonunda domain başına yazılan / kota, tip ve valans karışımı, yaş bandı dağılımı raporlanır.

**Dosya yeri:** `content/events/<group>/<domain>/<id>.json` (bir olay = bir dosya). Atlama satırları (`lines.skip.json` biçimi) bu 10.000'e **dahil değildir**; ayrı bir hatta yazılır.

---

## 2. Taksonomiyi okumak

Her domain nesnesinde şu alanlar var; partiyi yazmadan önce domain satırını baştan sona okuyun:

| Alan | Ne yapmalısın |
|---|---|
| `quota` | Domainin toplam olay sayısı. Aşma; eksik bırakma. |
| `ageMin`/`ageMax` | `pre.age` bu aralığın dışına çıkamaz. |
| `ageBandQuota` | Kotanın yaş bantlarına dağılımı (warmup 18–25, season 26–40, secondHalf 41–60, overtime 61+). Her olayın `pre.age` aralığı tek bir banda düşmeli ya da `ageBand` alanıyla bandı açıkça seçmeli. Genç bantlar bilinçli olarak ağır: tüm havuzda 18–25 ≈ %27, 26–40 ≈ %33. |
| `speakers` | Diyalogda kullanılabilecek konuşmacılar. Şemada geçerli olanlar yalnızca bunlardır: `mom, roommate, boss, ex, neighbor, uncle, cat, cabbie, partner, child, sibling` ve `npc:courier, npc:boilerTech, npc:landlord, npc:hr, npc:doctor, npc:clerk, npc:stranger, npc:barber, npc:coworker, npc:neighborKid, npc:waiter, npc:banker`. |
| `proposedSpeakers` | (`aunt`, `inLaw`, `grandparent`, `friend`, `grandchild`, `cousin`) Şemaya henüz eklenmemiş roller. Şema genişleyene kadar bu kişiler **diyalog balonu almaz**; anlatı metninde ve sonuç cümlesinde geçer ("Teyzen gruba yazdı: …"). |
| `typeMix` | standard / document / call / legendary oranı. 40'lık partide sayıya çevirin (ör. 0,23 document → 9 evrak). Havuz genelinde evrak ≤ %15 (L03-03); şu anki plan %10,4. |
| `valenceMix` | pos / neu / neg oranı (`valence` 1–2 / 0 / −1–−2). |
| `wagerShare` | Partide `wager.eligible: true` taşıyabilecek olay oranı (yalnızca check'li standard olaylar). |
| `needs` | Kullanılan yaşam durumu önkoşulları. Sözlük: `job, unemployed, student, grad, career:<id>, home:momsHouse, home:notMomsHouse, renting, roommate, single, partner, married, kids, cat, pet, car, license, debt, savings, retired, goal_active, mom_alive, uncle_alive, sibling`. Şemaya çevirisi: `pre.career`, `pre.housing`, `pre.flags`, `pre.npc`, `pre.money`, `pre.goal`. |
| `effectsUsed` | Domainin dokunabileceği durum değişiklikleri. Bunun dışına çıkıyorsan domain yanlış demektir. |
| `redLines` | Domain'e özgü yasaklar. §7'deki genel listeye **eklenir**, onu gevşetmez. |
| `universality` | `localizedShell`/`localeOnly` domainlerinde her olay `review.cultureNote` taşır. |

**Baba yoktur.** Taksonomide "baba" domaini bilinçli olarak yok: Anne tek ebeveyndir, açıklama yapılmaz (D-ÖNERİ-04-08). Hiçbir olay babayı anmaz, sormaz, öldürmez.

---

## 3. Şemanın özü

Tek doğru kaynak `packages/content-schema/src/event.ts` + `refine.ts`. En sık hata yapılan kurallar:

- **Birimler tamsayı.** Stat/meter/hidden deltası puan (|Δ| ≤ 25); `money` Para cinsinden (1 Birim = 1.000 Para; normal olay ±10.000, efsane ≤ +25.000); olasılık ve `intensity` baz puan (0–10.000).
- **Seçenek ↔ sonuç 1:1.** Her `choices[].id` için `outcomes[id]` var. Check'siz seçenekte tek dal, `p` yok. Check'li seçenekte dallar toplamı 10.000; **ilk dalın `p`'si `check.base`'e eşittir** (gösterilen oran = zar eşiği; dürüstlük kuralı).
- `check.base` 500–9.500 arası. `nearMiss` yalnızca başarısız dalda ve `check.goal` varsa.
- **İki seçenekli günde** her seçenek `swipe: left|right` taşır. Seçenek sayısı 2–4.
- Bir olayda aynı `pattern` iki kez kullanılmaz (12 kalıp: procrastination, avoidance, impulseSpend, peoplePleasing, risk, selfCare, overwork, leanOnFamily, shortcut, pride, generosity, patience).
- **valence ≤ −1** ise en az bir dalda umut kapısı: `joy ≥ 0` ya da `diagnosis`/`glossary` (L03-12).
- **Efsane:** `rarity: legendary`, `valence ≥ 0`, `wow: true`, ölüm yok, `maxPerLife: 1`.
- **Evrak:** `type: document` + `document` bloğu; letterhead TR'de "(kurgusal)", EN'de "(fictional)" içerir; Tercüme (`translate.from → to`) zorunlu; wager yok.
- **Çağrı:** `type: call` + `call.speaker ∈ {mom, uncle, boss, ex}`; `takeover: true` **yalnızca** `mom`; anne çağrısında en az bir dal `momPressure`'ı düşürür; wager yok.
- `shared: true` olaylar yalnızca yaşla kısıtlanır ve `universal` olur.
- Diyalog balonu ≤ 110 karakter; seçenek etiketi ≤ 40 karakter; `speaker` asla `you` değildir.
- `intent` her olayda dolu: `setup, mechanism, mechanismId, punch, lift, target`; D-094 için `antithesis` ve `closer`.
- `review.status` yazarda daima `draft`; `legal: ok` yalnızca §7 listesini geçtiysen, emin değilsen `review`.

### 3.1 Tam, açıklamalı örnek (şemadan geçti)

```json
{
  "v": 1,
  "type": "event",
  "id": "apartman_komsuluk_asansor_oylamasi_01",
  "tags": ["ev", "komsu", "apartman_komsuluk"],
  "rarity": "common",
  "universality": "universal",
  "valence": 0,
  "intensity": 4500,
  "punchOwner": "dialog",
  "cooldownDays": { "self": 400, "tags": { "apartman_komsuluk": 20 } },
  "pre": { "age": { "min": 20 }, "housing": ["flat", "wide", "mortgage", "owned"] },
  "dialog": [
    { "speaker": "neighbor", "avatar": "neutral", "tr": "Asansör yenilenecek. Oylama var. Herkes elini kaldırsın.", "en": "The elevator's being replaced. We're voting. Hands up, everyone." },
    { "speaker": "npc:neighborKid", "avatar": "smug", "tr": "Ben de oy verebilir miyim? Asansörü en çok ben kullanıyorum.", "en": "Can I vote? I ride it more than anyone." },
    { "speaker": "neighbor", "avatar": "annoyed", "tr": "Zemin kat oy vermez. Zemin kat merdiven bile kullanmaz.", "en": "Ground floor doesn't vote. Ground floor doesn't even use stairs.", "delayMs": 500 }
  ],
  "choices": [
    { "id": "evet", "tr": "Evet de, öde", "en": "Vote yes, pay up", "pattern": "generosity" },
    { "id": "itiraz", "tr": "Fiyata itiraz et", "en": "Challenge the quote", "pattern": "pride", "check": { "base": 4500, "stat": "brain" } },
    { "id": "cekimser", "tr": "Çekimser kal", "en": "Abstain", "pattern": "avoidance" }
  ],
  "outcomes": {
    "evet": {
      "effects": { "money": -1500, "npc": [{ "role": "neighbor", "affinity": 3 }], "flags": { "add": ["asansor_odendi"] } },
      "tr": "Oy birliği. Payın 1.500 Para. Şükran Teyze seni \"aklı başında\" listesine aldı.",
      "en": "Unanimous. Your share: 1,500. Mrs. Dale moved you to her \"sensible\" list.",
      "coach": [{ "tr": "Bir asansör, kırk kat bağış. Sen dördüncü kattasın.", "en": "One elevator, forty floors of donors. You're on four.", "roast": true }]
    },
    "itiraz": [
      {
        "p": 4500,
        "effects": { "money": -900, "stats": { "brain": 2 }, "meters": { "ego": 3 } },
        "tr": "İkinci teklifi buldun. Pay 900 Para'ya düştü. Toplantı 40 dakika uzadı.",
        "en": "You found a second quote. Share down to 900. The meeting ran forty minutes over.",
        "coach": [{ "tr": "600 Para kazandın, 40 dakika verdin. Takas adil.", "en": "Saved 600, spent forty minutes. Fair trade.", "roast": false }]
      },
      {
        "p": 5500,
        "effects": { "money": -1500, "meters": { "cringe": 3 }, "npc": [{ "role": "neighbor", "affinity": -2 }] },
        "tr": "Teklif aynı çıktı. Pay değişmedi. Toplantı tutanağına adın \"itirazcı\" diye geçti.",
        "en": "Same quote. Same share. The minutes now list you as \"the objector.\"",
        "coach": [{ "tr": "Tutanakta adın var. Defterde de.", "en": "You're in the minutes. And the notebook.", "roast": true }]
      }
    ],
    "cekimser": {
      "effects": { "money": -1500, "stats": { "joy": 1 } },
      "tr": "Çekimser kaldın. Karar çıktı. Fatura çekimser kalmadı: 1.500 Para.",
      "en": "You abstained. The motion passed. The bill did not abstain: 1,500.",
      "coach": [{ "tr": "Sayıldı. Sessiz oy da oydur.", "en": "Counted. A quiet vote is still a vote.", "roast": false }]
    }
  },
  "wager": {
    "eligible": true,
    "check": "itiraz",
    "slip": { "tr": "İDDİA: İtiraz pahalıya iner. — M.", "en": "WAGER: Objecting won't lower the bill. — M." }
  },
  "intent": {
    "setup": "apartman toplantısında asansör oylaması",
    "mechanism": "çocuk oy istiyor; zemin kat dışlanıyor",
    "mechanismId": "escalation",
    "punch": "zemin kat merdiven bile kullanmaz",
    "lift": "yok",
    "target": "situation",
    "antithesis": false,
    "closer": "sayildi"
  },
  "review": { "status": "draft", "legal": "ok" }
}
```

**Neden böyle:**

- `id`: `<domain>_<slug>_<nn>` → `apartman_komsuluk` + `asansor_oylamasi` + `01`.
- `tags`: ilk etiket grup (`ev`), son etiket domain id'si (director cooldown'u buradan okur). `cooldownDays.tags` aynı domainden art arda olay gelmesini önler.
- `pre.housing`: taksonomide `needs` boş olsa da durum mantığı ister: annenin evinde yaşayan biri asansör payı ödemez. **Sonuçlar kalıcıdır**: `asansor_odendi` bayrağı ileride "asansör yine bozuldu" olayının önkoşuludur.
- `punchOwner: "dialog"`: günün tek ana vuruşu Şükran Teyze'nin "zemin kat" cümlesinde. Bu yüzden sonuç metinleri **haber bülteni** düzlüğünde (olgu + durum değişimi, ≤ 2 cümle) ve koç satırlarının ikisi `roast: false`.
- Seçenekler üç farklı kalıp: generosity / pride / avoidance. Hiçbiri "doğru cevap" değil; üçü de para kaybettirir, farklı biçimde.
- `itiraz` check'li: `base 4500` = başarı dalının `p`'si. Wager bu seçeneğe bağlı; koç oyuncuya karşı iddiaya giriyor.
- Para gerçekçi ve soyut: kira ölçeğinde bir aidat payı, birim adı yok.
- Koç satırları üç ayrı mekanizma: sayım ("kırk kat bağış"), kuru muhasebe ("600 kazandın, 40 dakika verdin"), tanıklık ("Sayıldı"). Hiçbiri "X değil; Y" kalıbında değil, hiçbiri "Not aldım" ile bitmiyor.

---

## 4. Ses kuralları (TR + EN)

### 4.1 Koç (Motto)

- **Yargılamaz, sayar.** Hedef karar ve durum; asla kimlik, beden, değer, oyuncunun gerçek hayatı. Sıfat yerine sayı ya da somut nesne.
- **Emir yok:** "yap / yapmalısın / zorundasın / kendini topla / toparlan"; EN "you should / must / you got this / believe in yourself". Övgü sıfatı yok (zekisin, harikasın; smart, amazing). Hitap sözcüğü yok (canım, kanka, bro, buddy). Ünlem yok. Emoji yok. Koç soru sormaz (yılda ≤ 3).
- **Balon bütçesi:** Normal ≤ 22 kelime, ≤ 3 cümle; kurulum ≤ 14 kelime → vuruş ≤ 6 kelime ayrı cümle. 60+ yaşta beat başına ≤ 1 balon; koç yaşla sessizleşir.
- **Lift ≤ 6 kelime:** bir sayı, durum ya da oyun nesnesi anar (defter, sayaç, hedef, zarf). Poster testi: flipchart'a yazılabiliyorsa lift değildir. Yalnızca aktif Tek Hedef'e ya da açık zarfa bağlı sonuçlarda; gerçek hayat eylemi önermez ("su iç" dahil).
- **Kumar sözlüğü yok:** koç ağzında "bahis/bet/kumar/şanslıydın/lucky"; serbest olan "iddia/wager, oran/odds". "Rüşvet" hiçbir biçimde, hiçbir ağızda.

### 4.2 Mekanizma çeşitliliği kotası (D-094) — EN ÖNEMLİ BÖLÜM

Eleştiri turunda havuzun %30'u tek mekanizmaydı ve satırların %15'i "Not aldım." ile bitiyordu. Bu kez sayıyoruz:

1. **"X değil; Y" antitez kapanışı** partide ≤ 4/40 ve olay başına ≤ 1. Kullandıysan `intent.antithesis: true`.
2. **Noktalı virgül** satır başına ≤ 1.
3. **"Not aldım / Noted" ve "Defterde …" kapanışları** partide toplam ≤ 2. "Defter" kelimesi koçun nesnesidir, her satırın imzası değil.
4. **`intent.closer`** alanına kapanış kalıbını tek kelimeyle yaz (`sayildi`, `deftere`, `antitez`, `sayim`, `yok`…). Aynı closer partide ≤ 3.
5. **`mechanismId` dağılımı:** 10 mekanizma (bathos, reversal, literalism, escalation, callback, deadpan_report, translation, count, understatement, pun). 40'lık partide **hiçbir mekanizma > 8**, en az **6 farklı** mekanizma, aynı mekanizma art arda ≤ 2. `pun` EN'de mekanizma olarak kullanılmaz; `translation` yalnızca evrak/Tercüme günlerinde.
6. **Aynı somut sayı** (47, 412, 03:12, 212…) havuzda ≤ 2. Bu sayılar zaten kullanıldı; yeni sayı uydur. Rakam şart değil: kurum, nesne, saat, eşya da spesifiktir.
7. **"2.400 seminer"** göndermesi yılda ≤ 2 (`seminar_mock`); senin partinde 0 olsun, director serpiştirir.
8. **Running gag'ler** (Şükran'ın oğlu, Dayı'nın 2009'u, Barış'ın KESİN'i, Yağmur'un "Tamam."ı) yalnızca `counter_gag` merdiveninde; "Tamam." şakası yalnız Yağmur, `once: life`.

### 4.3 Şaka yoğunluğu (D-093) — her satır vuruş değildir

- **Günde tek ana vuruş:** `punchOwner` dialog / outcome / coach'tan biri; diğer iki katman düz.
- **Sonuç metni haber bülteni register'ında:** olgu + durum değişimi, ≤ 2 cümle. Sonuç metnine şaka koyduysan `punchOwner: "outcome"`; o zaman koç satırı `roast: false` ve sade.
- Partide roast'lı koç satırı ≈ %35–45, düz (plain) ≥ %25, lift ≈ %15–20. `kucuk_anlar_relax`, `gundelik_rutin`, `ruhsal_yuk_dusuk_keyif`, `veda_kayip` domainlerinde roast neredeyse sıfırdır.
- **Sessizlik protokolü** (ayrılık, NPC ölümü, ağır teşhis, kovulma ∧ Keyif < 30, Keyif ≤ 20): balon 1 şakasız ≤ 8 kelime; balon 2'nin hedefi evren/bürokrasi/takvim/trafik; balon 3 ≤ 6 kelime sıcak ya da sessizlik. Roast kapalı, wager yok.

### 4.4 NPC'ler: koç olmayan ses

- NPC'ler **koç gibi konuşmaz.** Ders çıkarmaz, sayı saymaz, nüktedan kapanış yapmaz. Anne sorar ve cevap beklemez; Dayı "benim zamanımda" ile girer; Barış büyük harfle KESİN der; Nevin Hanım kurumsal sıcaklıkla iş yükler; Şükran Teyze gözlem yapar ve kıyaslar; taksici her şeye bir teorisi olan adamdır; Pamuk konuşmaz (yalnızca "Miyav." ve parantez içi davranış).
- Balon ≤ 2 cümle; aynı NPC günde ≤ 4 balon. NPC koçu bilmez, koça hitap etmez.
- NPC kimlik yorumlamaz: "iş buldun mu?" serbest, "sen tembelsin" yasak.
- Durumsal NPC'lerin hafızası yoktur ("kurye seni hatırlıyor" yok) ve ses notları 04 §2.6'dadır.

### 4.5 İki dil: çeviri değil, iki ayrı yazım

- TR ve EN **ayrı ayrı yazılır** (transcreation). EN satırı Türkçesiz ayakta durmalı. EN register: Amerikan imlası, İngiliz kuruluğu, bölgesel argo yok; 1–99 arası sayılar anlatıda harfle ("forty-seven"), stat/sayaç/oran rakamla.
- Kültüre özgü durum (bayram, askerlik, dolmuş, fal) `localizedShell` (EN ikamesi ile) ya da `localeOnly` olur ve `review.cultureNote` taşır.
- Cinsiyet yazılmaz: oyuncunun ve partnerin cinsiyeti yoktur. "Kız/erkek arkadaş" BLOK, "sevgili/partner" serbest; EN'de Barış/Jordan ve Yağmur/Sam için `they`.

---

## 5. Gerçekçilik kuralları

1. **Sonuçlar kalıcıdır.** Bir olay ya bir sayıyı (para, stat, meter), ya bir ilişkiyi (`npc.affinity`/`memory`), ya bir durumu (`status`, `housing`, `career`), ya da ileriye bir iz (`flags`, `followUp`, `envelope`) değiştirir. "Hiçbir şey olmadı" olayı yazma; onun yeri atlama satırıdır.
2. **Bayraklar konuşur.** Koyduğun her bayrağın adını parti notuna yaz; aynı domainde onu okuyan en az bir devam olayı planla (`pre.flags`). Asılı kalan bayrak = kayıp gerçekçilik.
3. **Para makul ve soyut.** Ölçek: kira ayda ≈ 1.000–3.000 Para, gündelik harcama 10–300, büyük alım (araba, düğün) 3.000–10.000 aralığında birden çok olaya yayılır. Para birimi adı/simgesi, enflasyon, asgari ücret, faiz oranı, kur yazılmaz. "Bütün aylığın gitti" gibi hiperbol yerine sayı.
4. **Zaman makul.** Bir olay bir gündür; daha uzun süreçler (`followUp` 7–60 gün, zarf) ile bölünür. Hamilelik 270 gün, ehliyet 45 gün, bölüm 1.460 gün: 04 §2.2 tablosuna uy.
5. **Yaş ve durum tutarlılığı.** 19 yaşında emeklilik, işsizken patron, kirada değilken ev sahibi olmaz: `pre` ile kapat. NPC'nin var olma kuralları 04 §2.5.0'dadır (ör. taksici yalnızca "yol günleri"nde).
6. **Etki büyüklüğü olayın büyüklüğüyle orantılı.** Market sırası Keyif −1; ayrılık −20. Her olayda en fazla 3–4 etki alanı.
7. **Hayat dengesi:** her olumsuzun yanında bir çıkış kapısı; düşük Keyif günlerinde arkadaş/yürüyüş/destek seçenekleri.

---

## 6. Benzersizlik kuralları

- **Bir olay = bir gerçek hayat durumu.** Aynı durumu farklı kelimelerle iki kez yazma. Test: tohumu 6 kelimeye indir; havuzda aynı 6 kelime varsa yazma.
- **Mevcut havuzdan kaçın:** `packages/content-schema/fixtures/demo/` içindeki 42 olay (kedi saat beş, alarm erteleme, market sırası, taksici kestirme, sırt tutuldu, telefon ekranı, spor salonu, ev sahibi zammı, berber, eski ceket, unutulan hesap, aile grubu 212, komşu matkap, toplantı maili, yeniden yapılanma, banka mektubu, komşunun oğlu evlenmiş…) ve 01/04/08'deki örnek satırlar **alınmış durumlardır**. Bunların varyantı yazılmaz; devamı (`followUp`) yazılabilir.
- **Aynı domain içinde** iki olayın `intent.setup`'ı aynı nesne + aynı çatışma olamaz. Aynı nesne farklı çatışma serbesttir (asansör oylaması ≠ asansörde mahsur kalmak).
- **Domainler arası:** sınırda kalan durum hangi domainde daha gerçekse oraya yazılır; diğer domain yazarına parti notunda bildirilir.
- **Otomatik tarama:** her parti sonunda TR diyalog + sonuç metninde 3-gram Jaccard ≥ 0,45 olan çiftler ve `intent.setup` benzerliği işaretlenir; işaretli olayın biri yeniden yazılır.

---

## 7. Hukuk ve kırmızı çizgi kontrol listesi (08 §2.1 + 00 §1.2)

Bir olay aşağıdakilerden **birini** içeriyorsa yazılmaz ya da `legal: review` ile işaretlenir:

- [ ] **K1** Gerçek kişi: siyasetçi, ünlü, iş insanı, influencer; isim, lakap, tanınabilir parodi.
- [ ] **K2** Gerçek marka/kurum adı veya logosu (banka, market, uygulama, havayolu, takım, dizi, otomobil, coin).
- [ ] **K3** Din, mezhep, inanç nesnesi (nazar boncuğu dahil); "melek, Azrail, yukarıdakiler, kıyamet, reenkarnasyon, karma, ahiret".
- [ ] **K4** Etnik köken, ırk, göçmenlik, cinsel yönelim ve korunan gruplar şaka hedefi.
- [ ] **K5–K6** Siyaset, parti, lider, devlet büyüğü; Atatürk ve ulusal semboller.
- [ ] **K7** Askerlikte "gitme/kaç/firar/çürük/sakatlan/yırt"; kurumu aşağılama. EN'de askerlik yok.
- [ ] **K8** Alkol/tütün markası, özendirme, sonuçsuz kullanım; uyuşturucu kullanan karakter. Alkol yalnızca `substance:alcohol` etiketiyle ve kalıcı bir eksiyle.
- [ ] **K9** Oynanabilir kumar, rulet, slot; gerçek piyango/bahis markası.
- [ ] **K10** Cinsel içerik ("kapı kapalı"); 18 altı ile romantik etkileşim.
- [ ] **K11** Şiddet başlatan seçenek, silah edinme, organize suç, kahramanlaştırılmış suç. Şiddetsiz suçta yakalanma ≥ %35 ve kalıcı sonuç.
- [ ] **K12** İntihar/kendine zarar: eylem, ima, şaka, deyim ("kendimi öldürürüm", "I'd rather die"), yöntem. **Muafiyet yok.**
- [ ] **K13** Klinik etiket hakaret ya da teşhis olarak (deli, manyak, depresif, psycho); gerçek hastalık/ilaç adı.
- [ ] **K14** Kilo, boy, ten, yüz, engel üzerinden punchline.
- [ ] **K15** Aile üyesini küçültme; aile içi şiddet ya da cinsel ima.
- [ ] **K16** Şehir/bölge genellemesi; ülke adı ("Türkiye/Türk", "America").
- [ ] **K17** Para birimi adı/simgesi, makro rakam (enflasyon, asgari ücret, faiz oranı, kur).
- [ ] **K18** Polis/yargı/memur kurum genellemesi; "rüşvet" sözcüğü.
- [ ] **K19** Deprem, sel, salgın, savaş, terör, gerçek kaza veya dava.
- [ ] **K20** Oyuncunun gerçek hayatı, cihazı, saati, konumu hakkında varsayım.
- [ ] **K21** Sansürsüz küfür, slur, "lan".
- [ ] **Çocuk kuralı:** çocuk NPC ölmez, hastalanmaz, roast hedefi değildir; notu/bedeni/cinsiyeti yorumlanmaz.
- [ ] **Kedi kuralı:** Pamuk boşanmada bile oyuncuda kalır; ölümü sessizlik protokolündedir.

---

## 8. Kimlik (id) adlandırma

- Biçim: `<domain>_<slug>_<nn>` — tümü küçük harf ASCII, alt çizgi; regex `^[a-z][a-z0-9_]*$`.
- `<domain>` taksonomideki id'nin aynısı (`kariyer_courier`, `ev_sahibi`, `cagri_anne`).
- `<slug>` durumun 1–3 kelimelik Türkçe ASCII özeti (`asansor_oylamasi`, `depozito_cividelik`). Türkçe karakterleri sadeleştir: ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u.
- `<nn>` iki haneli sıra; aynı slug'ın zincir düğümleri için (`_01`, `_02`…). Zincir olaylarında `chain.id` = `<domain>_<slug>`.
- Dosya adı = `<id>.json`. `followUp.eventId`, `chainNext`, `envelope.resolverEventId` yalnızca var olan ya da aynı partide yazılan id'ye işaret eder.
- Demo fixture önekleri (`evt_`, `doc_`, `call_`, `leg_`) yeni içerikte kullanılmaz; tip bilgisi `type` alanındadır.

---

## 9. Öz-kontrol listesi (her olay, teslimden önce)

**Şema ve yapı**
- [ ] `validate` hatasız geçti; id biçimi doğru; dosya doğru klasörde.
- [ ] `pre.age` domain aralığında ve bir yaş bandına oturuyor.
- [ ] Konuşmacılar domain `speakers` listesinden; `proposedSpeakers` balon almadı.
- [ ] Check'li seçenekte ilk dal `p` = `check.base`; dallar toplamı 10.000.
- [ ] Negatif valansta umut kapısı var.

**Gerçekçilik**
- [ ] Bu durum gerçek bir insanın başına gerçekten gelir.
- [ ] En az bir kalıcı iz (bayrak, ilişki, durum, para) bırakıyor; bayraklar parti notunda.
- [ ] Para ve süre makul; para birimi yok.

**Ses**
- [ ] Tek ana vuruş; `punchOwner` doğru; sonuç metni ≤ 2 cümle bülten dili.
- [ ] Koçta emir, övgü sıfatı, hitap, ünlem, emoji, kumar sözlüğü yok.
- [ ] Lift (varsa) ≤ 6 kelime ve oyun nesnesi anıyor.
- [ ] "X değil; Y" ve "Not aldım" kotası partide aşılmadı; `intent.closer` yazıldı.
- [ ] NPC'ler koç gibi konuşmuyor; her NPC kendi sesinde.
- [ ] EN satırı Türkçesiz okunuyor; cinsiyet yazılmadı.

**Benzersizlik ve hukuk**
- [ ] Demo havuzunda ve partide yakın-kopyası yok; somut sayı tekrarlanmadı.
- [ ] §7 listesinin tamamı temiz; şüphe varsa `legal: review`.

**Parti düzeyi (40 olay)**
- [ ] `typeMix`, `valenceMix`, `wagerShare` oranlarına ±%10 içinde uyuldu.
- [ ] ≥ 6 farklı `mechanismId`, hiçbiri > 8; aynı closer ≤ 3.
- [ ] Yaş bantları `ageBandQuota`'ya orantılı.
- [ ] Parti notu: kullanılan bayraklar, planlanan devam olayları, başka domaine devredilen tohumlar.

## Ek kural (Dalga 1 QA bulgusu, 2026-11-08)
- **Sayım üçlüsü kotası:** koç satırlarının "Sayı X, sayı Y, sayı Z." kalıbıyla açılması partide en fazla 6/40. Dalga 1'de havuzun %24'ü bu kalıba kaydı; yeni partilerde bu kalıp yerine geri dönüş (callback), kişileştirme, ters çevirme, sade tanıklık, tek kelime kapanış, soru, NPC'ye pas verme gibi mekanizmalar kullanılır.
- **"Takas" kelimesi** koç ağzında partide en fazla 1 kez.
- Koç her olayda konuşmak zorunda değil: partinin en az %25'inde koç satırı tek ve kısa olsun, şakayı NPC ya da sonuç metni taşısın.
- (Dalga 2 QA) **"X. Y de." / "So did …" kapanışı** partide en fazla 3. "denetim", "kayda geçti" koç ağzında partide en fazla 1.
- `punchOwner: dialog` olan olayda koç satırı roast olmaz; ya sade tanıklık ya da hiç.
