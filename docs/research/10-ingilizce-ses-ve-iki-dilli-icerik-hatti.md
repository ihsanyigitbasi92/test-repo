# T10 — İngilizce Anlatıcı Sesi ve İki Dilli (TR+EN) İçerik Hattı

**Kapsam:** Transcreation stratejisi, EN mizah referansları, çift dilli yazım/QA pipeline'ı, EN ASO, isim adayları, bütçe.
**Bağlayıcı karar:** Oyun ilk günden Türkçe + İngilizce çıkıyor; ikisi de birinci sınıf. İngilizce "çeviri" değil, kendi başına komik olmak zorunda.
**Tarih:** 2026-11-05 · **Durum:** Araştırma dokümanı, karar önerileri içerir.

---

## TL;DR

1. **İngilizce varyant kararı: US yazımı (color, apartment, resume) + "mid-Atlantic" mizah duyarlılığı.** Kelime dağarcığı Amerikan, komedi refleksi İngiliz (kuru, kendini küçümseyen, deadpan). ABD en büyük gelir pazarı ve en-US App Store/Play'de varsayılan fallback; İngiliz deadpan'i ise "roast eden ama gizlice seven" anlatıcıya en uygun ton.
2. **Anlatıcı formülü: GLaDOS'un pasif-agresifliği + Stanley Parable anlatıcısının "ben hikâyeyi yazıyorum" egosu + Carrot'ın "meatbag" sevecen hakareti + Good Place'in gizli iyimserliği.** Hedef; her etkinlik metninin son vuruşu "lift" (kaldırma) olsun: roast → deflasyon → küçük bir "hadi devam".
3. **Transcreation, çeviri değil:** Her şaka önce dilden bağımsız bir "joke intent spec" (setup / mekanizma / punch / lift) olarak yazılır, sonra iki dilde ayrı ayrı "native realization" üretilir. Nintendo Treehouse, 8-4 (Undertale JP) ve Disco Elysium ekipleri aynı prensiple çalıştı: orijinali düşün, sonra unut.
4. **İçeriğin ~%70'i evrensel (para, iş, aile, flört, yaşlanma, sağlık, bürokrasi), ~%30'u locale-spesifik.** Her etkinlik `universality: universal | localized | locale-only` etiketiyle yazılır; locale-only olanlar (askerlik, Bayram, KPSS) için diğer dilde "eşdeğer" değil "ikame" etkinlik yazılır.
5. **Para birimi:** Soyut bir oyun-içi birim (ikon + "Para" / "Cash") öneriyoruz; ₺ rakamları enflasyonla 6 ayda komik olmaktan çıkar, $ ise Türk oyuncuya yabancı. Sayı formatı `Intl.NumberFormat` ile locale'e göre.
6. **İsimler:** Locale başına ayrı isim havuzu (TR: TÜİK sık isimler + jenerasyona göre dağılım; EN: ABD SSA listeleri). Karakterin cinsiyeti veri olarak tutulur: EN'de zamir (he/she/they) için ICU `select`, TR'de ünlü uyumlu ek için küçük bir **in-house Turkish inflector**.
7. **Teknik yığın: i18next + react-i18next + i18next-icu (ICU MessageFormat) + expo-localization.** Lingui güzel ama RN/Expo'da Babel/extraction kurulumu daha ağır ve "source-text-as-ID" modeli iki dilin de birinci sınıf olduğu bir projede ters tepiyor (kaynak metin hangisi?). Adlandırılmış key'ler + TS tipli key'ler daha güvenli.
8. **Türkçe ek sorunu çözüldü:** `turkish-inflect` (TDK uyumlu, MIT) arşivlenmiş ve npm'de yok → ~150 satırlık kendi `trInflect()`'imizi yazıp 300 isimlik golden test ile kilitliyoruz. Şablonlar `{name_e}` (Ayşe'ye), `{name_in}` (Ali'nin) gibi önceden çekimlenmiş değişkenler alıyor.
9. **İçerik dosya yapısı:** Etkinlik başına tek JSON (`tr` + `en` blokları + `intent` + `review` meta) → build adımında locale başına i18next bundle'a derlenir. Yazım ve senkron takibi etkinlik bazında, runtime yükü locale bazında.
10. **CI lint'i şart:** eksik locale, placeholder uyumsuzluğu, ICU parse hatası, `other` dalı eksik `select`, EN/TR uzunluk oranı > 1.3, buton bütçesi aşımı, yasaklı kelime listesi (locale başına), `needs-review` bayrağı olan içerik release'i bloklar.
11. **AI destekli yazım + insan küratör:** Intent spec'ten LLM'e TR+EN çift üretimi, her dilde 5 maddelik "funny-check" rubriği (min 3/5 geçer), sonra EN için profesyonel komedi yazarına punch-up. Tahmini EN polish bütçesi: **4.000–10.000 USD, 3–5 hafta** (Tier A içerik için; uzun kuyruk AI+dev).
12. **Mağaza:** Apple'da ad 30 / alt başlık 30 / keyword 100 byte; "names of other apps aren't allowed" → **"bitlife" keyword'ü yasak**, sadece Apple Search Ads teklifinde kullanılabilir. Play'de başlık 30, kısa açıklama 80, uzun açıklama indekslenir; tr-TR desteklenir.
13. **İsim:** En güçlü aday **"Kismet"** (İngilizceye Türkçeden geçmiş kelime; iki dilde de anlamlı, ASCII, telaffuzu kolay). Çakışma: aynı adlı fal uygulaması ve bir zar oyunu var → "Kismet: Life Roast" / "Kismet: Hayat Oyunu" bileşik ad ile kullan, TÜRKPATENT + USPTO taraması zorunlu.
14. **Kırmızı çizgiler locale'e göre farklı:** TR'de Atatürk (5816), din (TCK 216), ordu/bayrak, güncel siyaset ve deprem; US'de ırk/etnisite, silah/okul, intihar, engellilik ve "mean-spirited" (Apple 1.1.1). İki dilde de ortak "asla" listesi + locale başına ek liste.
15. **En büyük risk:** EN'nin "çevrilmiş Türkçe" gibi kokması ve publisher'ın ilk 5 dakikada bunu fark etmesi. Çözüm: EN'yi ikinci değil, **paralel** yazmak ve publisher demosuna girecek 200 etkinliği profesyonel punch-up'tan geçirmek.

---

## Varsayımlar

- Lansmanda ~1000 etkinlik (storylet), her biri ortalama 1 başlık + 1 gövde + 2–3 seçenek + 2–3 sonuç metni ≈ 7 metin bloğu ≈ 7.000 içerik satırı; artı ~600 UI stringi, ~150 push metni, mağaza metinleri.
- Teknik yığın önceki konularda kararlaştırıldığı gibi React Native + Expo (TypeScript), Hermes motoru, Expo web export ile Playwright testleri (fizibilite doğrulandı).
- Anlatıcı tek "ses"tir (ikinci tekil şahıs, oyuncuya konuşur); NPC diyalogları sınırlıdır.
- İngilizce içerik yazımı AI + geliştirici + bir freelance EN komedi yazarı (punch-up) ile yapılacaktır; tam zamanlı EN yazar yok.
- Mağaza localizasyonu için ASO aracı bütçesi minimal (ücretsiz tier'lar).
- Bu ortamda tidbits.com, lingui.dev, siliconera.com, docs.expo.dev ve support.google.com doğrudan okunamadı (ağ izni yok); bu kaynaklar arama özetleri üzerinden kullanıldı ve aşağıda böyle işaretlendi.

---

## 1) İngilizce Anlatıcı Sesi: Referans Analizi ve Ses Kılavuzu

### 1.1 Referansların mekanizması (ne çalıyoruz, ne çalmıyoruz)

| Referans | Mekanizma | Bizim için alınacak | Bırakılacak |
|---|---|---|---|
| **Douglas Adams** (Hitchhiker's) | Bathos: kozmik ölçek → bürokratik detay ("mostly harmless"); kesin rakamlarla saçmalık ("42") | Büyük olayları küçük, sıkıcı detaylarla deflasyona uğratma; sahte-kesin istatistik | Uzun cümle, çok parantez — mobilde okunmaz |
| **Terry Pratchett** (dipnotlar) | Dipnot = "anlatıcı araya girip fısıldıyor"; hyperdetermined mizah: aynı cümlede 2–3 araç birden [15][16] | "Anlatıcı dipnotu" UI öğesi: küçük italik ek satır (bkz. 1.4) | Pun yoğunluğu (TR'ye taşınmaz) |
| **Stanley Parable** anlatıcısı | Oyuncunun seçimine canlı tepki; "ben yazdım, sen bozdun" egosu; oyuncuya saygı var ama üstünlük taslıyor [9][10] | Seçime tepki veren sonuç metinleri; anlatıcının "senaryo" göndermeleri | 4. duvarı sürekli yıkmak — bir mekaniğe dönüşmeli, her satırda değil |
| **GLaDOS** | Pasif-agresif "test" dili; Wolpaw: gerçek hayatta tanıdığımız ama oyunda görmediğimiz pasif-agresyon; zamanla "begrudging respect" [11][12] | Klinik dil ile kişisel iğne; oyuncu ilerledikçe anlatıcının isteksiz saygısı (progressif ton) | Tehdit; biz GLaDOS değil, GLaDOS'un hayat koçu versiyonuyuz |
| **CARROT Weather / Fit** | "Meatbag", "Greetings, chubby human", "Prepare yourself to be judged" [3][5]; kişiselleşen hakaret; kilo verince övgü [4]; Snarky/Homicidal/Overkill mod seçimi [1] | Oyuncuya lakap ("meatbag" eşdeğeri), veriye göre kişiselleşen iğne, **ton seviyesi ayarı** | Kilo/beden hakareti (US'de risk) |
| **Duolingo push** | Suçluluk + mizah; "These reminders don't seem to be working. We'll stop sending them for now." [7][8]; Super Bowl "No buts… do a lesson now!" [6] | Kendi kendini iptal eden push, ters psikoloji, streak'e bağlı metin | Spam; Duolingo'nun bile "chill" demesi gerekti |
| **BoJack / Fleabag / The Good Place** | BoJack: acı altı mizah; Fleabag: izleyiciye bakış (suç ortaklığı); Good Place: Schur'a göre "sinizm tembel seçenek", iyimserlik emek ister [24] | Anlatıcı oyuncuyu suç ortağı yapar; en sonda iyimserlik "kazanılmış" hissettirilir | Melankoliye batmak |
| **Reigns** | Alliot: yazı mekanik tarafından "tasarlandı"; kısa soru, hızlı cevap, vahim sonuç [21][22] | Kart uzunluğu disiplini (≤ 2 cümle) | Ortaçağ kayıtsızlığı |
| **BitLife** | Deadpan, bildirim dili ("You were fired."), çıplak gerçek | Olayları duygusuz cümleyle bildirip yorumu anlatıcıya bırakmak | Yorumsuzluk (bizim farkımız yorum) |
| **Dumb Ways to Die** | Mescall: vaaz yok, tehdit yok; güvenlik mesajı "plot twist" olarak sonda [17][18] | Motivasyon mesajını şakanın **sonuna** gömmek | Şarkı |
| **Cards Against Humanity** | Boşluk doldurma gramer esnekliği; gerçek oyun verisiyle hangi kart kazandı testi [19][20] | "Herhangi bir isimle çalışan" şablon disiplini; telemetriyle hangi satır "kazandı" | Şok için şok |

**UK vs US:** Gervais'in formülü: İngilizler "başına iyi şey gelmeyecek" diye büyütülür, Amerikalılar "başkan olabilirsin" diye; İngiliz komedi "punching in" (kendini küçümseme), Amerikan komedi daha kendinden emin ve geniş [14]. Anlatıcımız oyuncuyu küçümsüyor ama **oyuncunun yanında** — bu İngiliz refleksi. Fakat kelime dağarcığı ve yazım US olmalı: en büyük gelir pazarı ABD, Apple'ın locale fallback'inde en-GB/en-AU kullanıcıları zaten en-GB'ye düşebiliyor ve tek bir "en" paketinde US yazımı global standart [67].

### 1.2 Karar: Hangi İngilizce?

**Seçim: en-US yazımı, "mid-Atlantic" ton, bölgesel argo yok.**

- Yazım: color, favorite, apartment, resume, mom, vacation, cell phone.
- Yasak bölgesel kelimeler: quid, knackered, mate, bloke, flat (daire anlamında), dude, bro, y'all, 401(k), NHS. Para/sağlık/okul kurumları soyutlanır ("the health system", "retirement savings").
- Tek App Store EN localizasyonu (en-US) + ileride en-GB sadece mağaza metni varyantı (Play'de "custom store listing", App Store'da en-GB locale) — oyun içi tek EN paketi.
- Ölçü birimleri: `expo-localization` `measurementSystem` ile metric/US seçilir; şablonlar mümkünse birimsiz ("you walked exactly as far as the fridge").

### 1.3 EN Anlatıcı: 10 YAP / 10 YAPMA

**YAP**
1. İkinci tekil şahıs, şimdiki zaman: "You did the thing. It went badly."
2. Spesifik ol: "a job" değil, "a job that pays in 'exposure'".
3. Bathos: büyük cümle, küçük son: "Today you became an adult. Legally. The rest is pending."
4. Her etkinlikte bir "lift" vuruşu — kısa, gizli, sentimental değil: "Still here, though. Noted."
5. Anlatıcı oyuncunun **seçimlerini** roast eder, kimliğini değil.
6. Kurumları hedef al: HR, landlords, "the economy", group chats, LinkedIn.
7. Deadpan bildirim + yorum: "You got promoted. Nobody clapped. Write that down."
8. Sayılarla oyna: "You have $3. That is three more than your plan."
9. Kısa cümle; mobilde 1 ekran = max 3 cümle gövde.
10. Progresif ton: oyuncu yaşadıkça anlatıcı isteksiz saygı geliştirir (GLaDOS eğrisi).

**YAPMA**
1. Irk, din, etnisite, cinsel yönelim, engellilik üzerinden şaka (Apple 1.1.1 "mean-spirited"; "professional humorists generally exempt" bize güvence değil) [55].
2. Beden hakareti (Carrot Fit "chubby human" US'de şikayet aldı) [3].
3. Pun/kelime oyunu temelli şaka — TR karşılığı yazılamaz, intent spec'i bozar.
4. Güncel olay, gerçek kişi, gerçek marka (Apple 5.2.1; Play "sensitive events") [55][58].
5. Bölgesel argo ve tarihli meme ("rizz", "sus") — 18 ayda ölür.
6. Uzun parantez ve iç içe cümle (Adams'ı taklit etme, mekanizmasını al).
7. Motivasyonu açıkça söyleme: "You can do it!" yasak; "lift" ima ile gelir.
8. İntihar/kendine zarar üzerine şaka; ölüm etkinlikleri absürt/kaza kaynaklı, asla kendine zarar.
9. Emoji — anlatıcı sesi metinle taşınır.
10. Aynı etkinlikte iki kez 4. duvar — bir etkinlikte en fazla bir meta gönderme.

### 1.4 Örnek EN satırlar (TR ton kitabıyla aynı durumlar)

**18 yaşına girmek**
- "Happy birthday. You're legally an adult now, which mostly means the consequences have your name on them."
- "Eighteen. Congratulations: you've unlocked rent, taxes, and the ability to be disappointed by yourself professionally."

**İş reddi**
- "They took three weeks to say no in one sentence. Efficiency isn't their thing. Neither, apparently, are you. Yet."
- "'We'll keep your resume on file.' The file is a trash can. The trash can is also full."

**Terfi**
- "You got promoted. Same desk, same lunch, slightly better email signature. Progress is measured in signatures now."
- "Promotion secured. Somewhere, a spreadsheet has a new cell with your name in it. Try to feel something."

**Ayrılık**
- "It's over. They said it's not you. Narratively, it was at least 40% you."
- "Breakup confirmed. You are now free, single, and in possession of half a Netflix password."

**Evlilik**
- "You said yes. Your relatives are already planning things you haven't been told about."
- "Married. Two people, one bathroom, infinite opinions about the thermostat. Good luck, honestly."

**Meteliksiz kalmak**
- "Balance: $3. You've been poorer, but never this *creatively*."
- "You're broke. The good news: nobody can take from you what you don't have. The bad news is everything else."

**Piyango**
- "You won. The universe made an administrative error in your favor. Spend it before it notices."
- "Jackpot. Statistically you should be dead from a vending machine before this happened. Enjoy the paperwork."

**Hastalık**
- "Diagnosis: a thing with a Latin name. Treatment: rest, water, and listening to your body for once."
- "You're sick. Your body filed a complaint. Read it. It has a point."

**Ölüm**
- "And that's the whole thing. You lived %d years, made %d bad decisions, and at least four good ones. That's above average. Again?"
- "Game over, meatbag. It was, against all odds, a life. Go again, do it worse, do it better. Your call."

**Günlük dönüş karşılaması**
- "Oh, you're back. I'd reset the counter but I was too busy judging you from a distance."
- "Day %d. The streak lives. So do you. Coincidence? Science says maybe."
- "Welcome back. Nothing happened while you were gone, because nothing happens without you. That's the deal."

**Push bildirimleri (10)**
1. "Your life is paused. Real life isn't. Pick one to deal with."
2. "You've ignored me for 2 days. Your rent did not."
3. "Quick reminder that you're 34 in there and still haven't called your mother. In the game. Also maybe outside."
4. "Streak at risk. I'd be sad, but I'm a notification."
5. "These reminders aren't working. I'll stop. Unless you come back. Then I'll pretend this never happened."
6. "Your character has a job interview tomorrow. Unlike you, they prepared."
7. "A relative has an opinion about you. Come hear it."
8. "Day 7. Somebody's consistent. It's you. Weird."
9. "Payday in-game. Still better than your group chat."
10. "I'm not saying come back. I'm saying your cat in there has been alone for three days."

**Roast-and-lift motivasyon (10)**
1. "You've failed four times this week. Most people stop at two. That's not a compliment. It's data. Keep going."
2. "You're not behind. You're just on a route nobody else was dumb enough to take. Interesting things live there."
3. "Rejection count: 12. Fun fact: that's also the number before 13, which is the one that works. Probably."
4. "Nobody's watching. Which means nobody saw that. Which means you can do it again, properly."
5. "You're exhausted. Correct. Tired is what effort looks like from the inside."
6. "Your plan fell apart. Good. It was a bad plan with great confidence. Now make a decent plan with none."
7. "Still broke, still here. One of those changes with time. Guess which."
8. "You are, objectively, a mess. Subjectively, a mess that showed up today. Showing up is undefeated."
9. "I roast you because I think you can take it. I'm rarely wrong. I'm never wrong, but 'rarely' sounds humble."
10. "Day one of your new habit. Historically your day ones are excellent. Let's see what a day two looks like."

### 1.5 "Anlatıcı dipnotu" UI öğesi (Pratchett'tan)

Etkinlik gövdesinin altında, küçük italik, opsiyonel bir `footnote` alanı: oyuncu dokununca açılır. Tek cümle, saf iğne, mekanik bilgi yok. Örn: *"Technically you also forgot your umbrella. Not relevant. Just noting it."* TR: *"Ayrıca şemsiyeni unuttun. Konuyla ilgisi yok. Not düşüyorum."* Opsiyonel olduğu için okuma yükü eklemeden "ses" ekler; lint'te dipnotlar isteğe bağlı sayılır.

### Bu oyuna nasıl uygularız
- `docs/voice/en-narrator.md` olarak bu bölümü ses kılavuzu yap; publisher pitch dosyasına 20 örnek satırı koy.
- Ton seviyesi ayarı (Carrot'ın Snarky/Overkill'i): `tone: mild | spicy` seçeneği; "spicy" satırlar ayrı key (`.spicy`) ve 17+ derecelendirmeyi etkilemeyecek sınırda.
- Her etkinliğin EN gövdesi ≤ 3 cümle, sonuç ≤ 2 cümle; lint bunu sayar.

---

## 2) Transcreation Metodolojisi

### 2.1 Endüstriden ne öğreniyoruz

- **LocJAM / IGDA LocSIG:** "Avoid literal translations, keep players in mind"; önce oyunu oyna, problem alanlarını not et; hedef dilde doğmuş gibi okunmalı, kültürel karikatür olmamalı [25][26]. Transcreation için "orijinali düşün, SONRA orijinali unut" [26][27].
- **Nintendo Treehouse (Bihldorff):** Bazı şakalar düşer; yerine aynı yerde aynı işlevi gören yeni şaka yazılır (Dream Team'de yulaf lapası şakası → "mush room" punu) [34]. Treehouse'un Animal Crossing'de takvimi batı tatillerine göre yeniden kurması [36] bizim "Bayram vs Thanksgiving" kararımızın emsali.
- **8-4 / Undertale JP:** Toby Fox şakaların Japonca'da **İngilizce'deki gibi "düşmesini"** istedi; canavar isimleri yeniden kuruldu (Woshua → wan + saibō) [29][30][31]. Çıkarım: karakter/lakap seviyesinde bile yeniden yaratım serbest, işlev sabit.
- **Disco Elysium:** ZA/UM gerçek-dünya terimi kullanmadığı için ekipler transcreation'a mecbur kaldı; Çin'de hassas terimler uydurma kelimelerle değiştirildi [32][33]. Çıkarım: bazı kurumları (siyasi parti, din) **uydurma/soyut** tutmak localizasyonu ve politika uyumunu kolaylaştırır.
- **Reigns:** Yazı mekanikle sınırlandı; 12 dile çevrilirken kart kısalığı korundu [21][23].

### 2.2 Yöntem: Joke Intent Spec → iki native realization

Her etkinlik önce **dilden bağımsız** bir spec ile yazılır:

```yaml
id: work.job_rejection.03
situation: job_rejection          # durum sınıfı (TR ton kitabıyla eş)
target: hiring_process            # hedef: kurum/süreç — asla oyuncunun kimliği
mechanism: bathos                 # bathos | reversal | literalism | escalation | callback | deadpan_report
setup: "company took weeks"
punch: "to say no in one sentence"
lift: "the player learned a tell: 'we'll be in touch' means no"
emotion_arc: [hope, deflation, shrug, tiny_resolve]
universality: universal           # universal | localized | locale-only
locale_notes:
  tr: "İK, 'olumlu/olumsuz dönüş' klişesi"
  en: "HR, 'keep your resume on file'"
constraints: [no_pun, no_real_brand, max_3_sentences]
```

Kural: `mechanism` **pun** olamaz. Pun yalnızca locale-only etkinliklerde ve o locale'e özel olarak serbest. Spec, iki dilin de "aynı şakayı" değil "aynı işi yapan şakayı" yazmasını sağlar.

### 2.3 Evrensel vs. yerel: sınıflandırma politikası

| Etiket | Anlam | Örnek | Üretim kuralı |
|---|---|---|---|
| `universal` | Aynı intent iki dilde de çalışır | iş reddi, kira zammı, ayrılık, doktor | Tek spec, iki realization |
| `localized` | Intent aynı, yüzey referansı değişir | akraba sorgusu → Thanksgiving; çay → coffee | Spec + swap tablosundan ikame |
| `locale-only` | Durum diğer kültürde yok | askerlik, KPSS, Bayram harçlığı | Diğer locale için **eş-işlevli ikame etkinlik** (aynı mekanik etkiler, farklı hikâye) |

Hedef oran: lansmanda universal %70, localized %20, locale-only %10. Locale-only etkinlikler çift yazılır ama "ikizleri" aynı `mechanic_effects` (para, stres, ilişki delta'ları) paylaşır → dengeleme tek kalır.

### 2.4 Kültürel ikame tablosu (TR → EN-US)

| # | TR referans | EN-US ikame | Not |
|---|---|---|---|
| 1 | Ev sahibi zammı | Rent hike / "landlord's annual surprise" | Evrensel |
| 2 | KPSS | Civil service exam → "the government job exam" | Ya da "bar exam" (prestij varyantı) |
| 3 | Askerlik | locale-only → EN ikamesi: jury duty (bürokratik zorunluluk) veya "mandatory corporate retreat" (absürt) | Mekanik: 6–12 ay zaman kaybı; EN'de "gap year you didn't choose" |
| 4 | Anne baskısı | Family pressure / "your mom's questions" | Evrensel |
| 5 | Çay | Coffee | "çay koy" ritüeli → "coffee run" |
| 6 | Dolar kuru | Inflation / cost of living / "the economy" | TR'de kur, US'de egg prices |
| 7 | Akraba sorgusu (bayramda) | Thanksgiving relatives | Yapı aynı: "ne zaman evleniyorsun" |
| 8 | Bayram harçlığı | Birthday money from grandma | Mekanik: küçük para +, utanç + |
| 9 | Bayram | Thanksgiving / Christmas (soyut "the holidays") | Dini isim kullanma, "the holidays" |
| 10 | Nazar | Jinx / "the universe noticing you" | Nazar boncuğu → "lucky charm" |
| 11 | Simit–çay kahvaltısı | Bagel and coffee | 1:1 |
| 12 | Dolmuş | Shared ride / the bus | "dolmuş şoförü" → "bus driver with opinions" |
| 13 | Trafik (İstanbul) | Traffic (LA) — şehir adı verme | "the city's traffic" |
| 14 | Memur olmak | Government job | "stable, boring, pension" |
| 15 | Kıdem tazminatı | Severance | Evrensel |
| 16 | Asgari ücret | Minimum wage | Rakam yok, ima var |
| 17 | Kredi kartı asgari ödeme | Credit card minimum payment | 1:1 |
| 18 | Banka kredisi / "kredi çekmek" | Taking out a loan | 1:1 |
| 19 | Öğrenci kredisi (KYK) | Student loans | US'de daha acı; EN'de şaka daha sert |
| 20 | Düğün takısı | Wedding registry / cash gifts | Mekanik: para + |
| 21 | Kına gecesi | Bachelorette party | Eş-işlev |
| 22 | Görücü usulü | Set up by a relative / blind date | Evrensel-ish |
| 23 | Mahalle bakkalı veresiye | Running a tab / "buy now pay later" | 1:1 |
| 24 | Kapıcı | Building super / doorman | NYC'de var, genel "building manager" |
| 25 | Site aidatı | HOA fees | 1:1 |
| 26 | Apartman toplantısı | HOA meeting | 1:1 |
| 27 | Komşu dedikodusu | Nosy neighbor | Evrensel |
| 28 | Rakı sofrası | Dinner with drinks (alkol adı soyut) | TR'de alkol tanıtımı sınırlı; soyut tut |
| 29 | Kahve falı | Horoscope / tarot | Mekanik: sahte öngörü |
| 30 | Diziler (TR dizisi 2.5 saat) | Binge-watching a series | Evrensel |
| 31 | Maç günü (derbi) | Game day | Takım adı yok |
| 32 | Okey / tavla | Poker night / board games | Kumar mekaniğinden kaçın (TR yasal) |
| 33 | Pazar alışverişi | Farmers market / grocery run | 1:1 |
| 34 | Sahur | Late-night snack run (locale-only) | Dini bağlam EN'de düşer |
| 35 | Sınav (YKS/üniversite sınavı) | SAT / college applications | Mekanik aynı |
| 36 | Dershane | Tutoring / test prep | 1:1 |
| 37 | Özel ders | Tutoring gig | 1:1 |
| 38 | Yurt odası | Dorm room | 1:1 |
| 39 | Staj (ücretsiz) | Unpaid internship | 1:1 |
| 40 | LinkedIn / "iş arıyorum" postu | LinkedIn post | Evrensel, markayı soyutla ("the professional network") |
| 41 | Enflasyon/ zam haberi | "Prices did a thing again" | Evrensel |
| 42 | Emekli maaşı | Pension / Social Security | Soyut: "retirement money" |
| 43 | Boğaz'da yürüyüş | Walk by the water | Yer adı yok |
| 44 | Tatil: Bodrum | Beach vacation | Yer adı yok |
| 45 | Arabesk / "hüzün" | Sad playlist | Evrensel |
| 46 | Çeyrek altın | Savings bond / "money in a sock" | Mekanik: likit olmayan birikim |
| 47 | Elektrik kesintisi | Power outage | 1:1 |
| 48 | Deprem | Natural disaster (soyut) — **TR'de asla şaka değil** | Her iki locale'de "sensitive events" |

**Kural:** 48 satırın tamamı `content/swap-table.yaml` olarak repoya girer; LLM prompt'una referans olarak verilir; yeni TR referansı eklendiğinde tabloya satır eklemeden lint geçmez.

### 2.5 İsimler, para, tarih, birimler

**İsimler.** Locale başına isim havuzu; TR havuzu TÜİK'in sık isimlerinden (0–17 yaşta Yusuf, Mustafa, Ömer / Zeynep, Elif, Ecrin; genel nüfusta Mehmet, Fatma, Ayşe, Emine; 2023–24 doğumlarda Alparslan, Asel) [73][74] jenerasyona göre ağırlıklandırılır: karakterin doğum yılına göre "anne-baba adı" ile "çocuk adı" farklı dönemden gelir (Mehmet'in oğlu Alparslan). EN havuzu ABD SSA on yıl listelerinden aynı mantıkla. Kritik: isim **gösterim** verisidir; etkinlik metni asla ismin anlamına şaka kurmaz (TR'de "Umut" şakası EN'de ölür).

**Para birimi — üç seçenek değerlendirmesi:**

| Seçenek | Artı | Eksi | Karar |
|---|---|---|---|
| A) Locale gerçek birim (₺ / $) + ayrı ekonomi | Gerçekçi | ₺ rakamları enflasyonla aylar içinde absürtleşir; iki ekonomi dengelemesi; metinlerde rakam senkronu | Hayır |
| B) Tek birim $ | BitLife emsali | TR oyuncuya yabancı; "maaş $3.000" TR'de gerçek dışı | Hayır |
| C) **Soyut birim** (ikon + "Para"/"Cash"), tek ekonomi, `Intl.NumberFormat` ile ayraç | Tek dengeleme; enflasyondan bağımsız; şaka malzemesi ("whatever currency this is") | Biraz daha az "gerçek" | **Evet** |

Rakam ölçeği: aylık maaş 2.000–8.000 birim aralığı — iki kültürde de "okunabilir" büyüklük. Metin içinde rakam **asla hardcode** edilmez; `{amount, number}` ile gelir.

**Tarih ve tatiller.** Oyun takvimi soyuttur ("yıl 3, bahar"); gerçek tarih yok. Tatil etkinlikleri `localized`: TR'de "bayram", EN'de "the holidays". Gerçek zamanlı takvim (Animal Crossing gibi) **yok** — offline ve senkron maliyeti.

**Birimler.** `measurementSystem` ile km/mi, kg/lb; ama şablonların %95'i birimsiz yazılır ("walked to the fridge and back").

### Bu oyuna nasıl uygularız
- Etkinlik şablonu `intent` alanı zorunlu; intent'siz etkinlik lint'te düşer.
- `universality` etiketi dağılımı sprint sonu raporunda ölçülür (hedef 70/20/10).
- Swap tablosu `content/swap-table.yaml` ve prompt'lara otomatik enjekte edilir.
- Para: soyut birim, ikon `assets/ui/coin.svg`, isim TR "Para", EN "Cash".

---

## 3) Teknik i18n Pipeline (React Native / Expo / TypeScript)

### 3.1 Kütüphane kararı

| Kriter | i18next + react-i18next + i18next-icu | Lingui | Custom |
|---|---|---|---|
| Key modeli | Adlandırılmış key (`events.work.x.body`) | Kaynak metin = ID (opt-in explicit ID) [37][38] | Serbest |
| Tipli key | `CustomTypeOptions` + `strictKeyChecks`; i18next-cli type gen [39][40] | Module augmentation ile opt-in [37] | Kendin yaz |
| ICU plural/select | `i18next-icu` (intl-messageformat tabanlı) [41] | Native ICU [37] | Kendin yaz |
| RN/Expo kurulum | Bol tutorial, runtime JSON | Babel macro + extraction/compile adımı gerekir [38] | — |
| İki dilin de birinci sınıf olması | Key tarafsız; TR de EN de "çeviri" değil, eş realization | "Kaynak metin" kavramı EN'yi ya da TR'yi kaynak yapmaya zorlar | — |
| Ekosistem | ~15× indirme (muszarski) [38]; pseudo-loc, lint eklentileri hazır [49] | Daha küçük | Yok |

**Karar: i18next + react-i18next + i18next-icu.** Not: i18next-icu ile `{{name}}` interpolasyonu çalışmaz, tek süslü parantez `{name}` kullanılır; i18next'in kendi `_one/_other` plural key'leri ve `context` özelliği devre dışı kalır — her şey ICU içinde yazılır [41].

**Hermes Intl notu:** Hermes `Intl.NumberFormat`, `DateTimeFormat`, `Collator`, `toLocaleUpperCase/LowerCase` desteği sunar (iki platformda); dokümanda `Intl.PluralRules` listelenmiyor [42]. intl-messageformat plural için `Intl.PluralRules` ister → `@formatjs/intl-getcanonicallocales`, `@formatjs/intl-locale`, `@formatjs/intl-pluralrules` + `/locale-data/tr` ve `/en` polyfill'leri uygulama girişinde yüklenir. Android 7–9'da NumberFormat kenar durumları var [42]; sadece `decimal` stili kullanıyoruz, `currency` stili yok (zaten soyut birim).

### 3.2 İçerik dosya yapısı

Yazım birimi = etkinlik; runtime birimi = locale. İkisini build adımı birbirine bağlar.

```
content/
  events/
    work/
      job_rejection_03.json      # tek etkinlik, tr+en, intent, review meta
  ui/
    tr.json  en.json             # UI stringleri (buton, menü) doğrudan locale başına
  push/
    tr.json  en.json
  names/
    tr.json  en.json             # isim havuzları (decade-weighted)
  swap-table.yaml
scripts/
  content-build.ts               # events/**.json → app/locales/{tr,en}/events.json + types
  content-lint.ts                # CI
app/locales/{tr,en}/{ui,events,push}.json   # üretilen, git'te değil
```

**Worked example** (`content/events/work/job_rejection_03.json`):

```json
{
  "id": "work.job_rejection.03",
  "version": 4,
  "tags": ["work", "rejection", "early_career"],
  "universality": "universal",
  "intent": {
    "target": "hiring_process",
    "mechanism": "bathos",
    "setup": "company took weeks",
    "punch": "to say no in one sentence",
    "lift": "player learns the tell: 'we'll be in touch' means no"
  },
  "vars": { "name": "string", "weeks": "number", "gender": "enum:f|m|x" },
  "effects": { "stress": 8, "money": 0, "confidence": -4 },
  "tr": {
    "rev": 4,
    "title": "Olumsuz dönüş",
    "body": "{weeks, plural, one {# hafta} other {# hafta}} bekledin. Cevap tek cümle: \"Olumsuz.\" İK'nın harf başına maliyeti ne, merak ediyorum.",
    "footnote": "'Olumlu olumsuz döneceğiz' demişlerdi. Olumsuz döndüler. Sözlerini tuttular.",
    "choices": {
      "reply_thanks": { "label": "Teşekkür mesajı at", "result": "Attın. Okundu bilgisi geldi, cevap gelmedi. Artık bir 'okundu'nun ne demek olduğunu biliyorsun. Bu bir yetenek." },
      "rant_online": { "label": "İnternette dertlen", "result": "Yazdın. 3 beğeni, biri annenden. Yine de yazmak iyi geldi; içeride tutsan daha pahalıya patlardı." }
    }
  },
  "en": {
    "rev": 4,
    "reviewedRev": 3,
    "status": "needs-review",
    "title": "Thanks, but no",
    "body": "You waited {weeks, plural, one {# week} other {# weeks}}. They said no in one sentence. Somewhere, HR is billing by the character.",
    "footnote": "'We'll be in touch.' They were. Briefly.",
    "choices": {
      "reply_thanks": { "label": "Send a thank-you", "result": "Sent. Read receipt, no reply. You now know what a read receipt means. That's a skill. A sad one, but a skill." },
      "rant_online": { "label": "Post about it", "result": "Posted. Three likes, one from your mom. Still, it's out of your head now, and that's cheaper than therapy. Marginally." }
    }
  }
}
```

Dikkat: `en.rev (4) ≠ en.reviewedRev (3)` → `status: needs-review` → CI release'i bloklar. TR tarafında isim eki gerekseydi `{name_e}` değişkeni kullanılırdı (bkz. 3.3).

### 3.3 Türkçe ünlü uyumu ve isim ekleri

Sorun: "Ayşe'ye mesaj attın" / "Ali'ye", "Ayşe'nin", "Ankara'dan". Kütüphane taraması: `turkish` (npm, 9 yıldır güncellenmemiş), `turkish-suffixes` (4 yıl), `trjs` (geniş gramer), `turkish-inflect` (TDK uyumlu, apostrof, tampon y/n, özel isimde yumuşama yok; ama arşivlenmiş ve npm'de yok, MIT) [43][44][45][46].

**Karar: kendi `trInflect(value, case, {proper: true})` fonksiyonumuzu yazıyoruz** (~150 satır), `turkish-inflect`'in kurallarını referans alarak:
- Son ünlüye göre 2'li (e/a) ve 4'lü (i/ı/u/ü) uyum; son harf ünlü ise tampon **y** (dative/accusative), iyelikli bileşiklerde **n**.
- Özel isimde apostrof, yumuşama yok ("Tokat'ı").
- Yabancı/okunuşu farklı isimler için `reading` sözlüğü (EN isim havuzunu TR'de kullanmıyoruz, ama "Netflix'e" gibi marka-benzeri soyutlamalar için).
- Golden test: 300 isim × 6 hal, elle doğrulanmış CSV; lint CSV'ye karşı koşar.

Şablon tarafında ekler **önceden çekimlenmiş değişken** olarak gelir: `tEvent(key, { name })` sarmalayıcısı `name_e` (yönelme), `name_i` (belirtme), `name_in` (ilgi), `name_de` (bulunma), `name_den` (ayrılma), `name_le` (ile) üretip `t()`'ye geçirir. ICU içinde özel formatter yazmaktan daha basit ve test edilebilir. Ek olarak **yazım politikası**: şablonların mümkün olduğunca ismi yalın halde kullanması ("Ayşe ile", "Ayşe için", "Ayşe aradı") — lint `\{name\}'[a-zçğıöşü]` desenini (elle yazılmış ek) hata sayar.

Türkçe büyük harf: buton metinlerinde `toLocaleUpperCase('tr-TR')` (GİRİŞ ≠ GIRIS); Hermes destekliyor [42]. CSS `textTransform: 'uppercase'` RN'de locale duyarlı değil → kullanma, string seviyesinde yap.

### 3.4 İngilizce: a/an, çoğul, zamir

- **a/an:** Değişken önünde belirsiz tanımlık kullanan şablon yasak (lint: `\b(a|an) \{`). Gerekirse `aOrAn(word)` yardımcı fonksiyonu ile `{jobWithArticle}` değişkeni üretilir (sesli harf sesi sezgisi + istisna listesi: "an hour", "a university").
- **Çoğul:** ICU `plural` (`one`/`other`), `#` ile sayı. TR'de sayıdan sonra çoğul eki yok → TR şablonu `{weeks, plural, other {# hafta}}` olarak basit kalır; lint `other` dalını zorunlu kılar (intl-messageformat `MISSING_OTHER_CLAUSE` fırlatır) [47].
- **Zamir:** `{gender, select, female {...} male {...} other {...}}` — her dalda **tam cümle** (fiil uyumu için "they are/she is") [47]. TR'de zamir cinsiyetsiz → TR bloğunda `select` gerekmez; lint, EN'de `gender` kullanan etkinlikte TR'nin `gender`'ı **kullanmamasını** tolere eder (placeholder uyumsuzluğu istisnası: `gender` opsiyonel değişken).

### 3.5 Tipli key'ler

`content-build.ts` TR bundle'ından (kaynak-locale olarak TR, çünkü etkinlik dosyalarının tamamında TR zorunlu) `app/locales/types.d.ts` üretir; `CustomTypeOptions.resources` ile `t('events.work.job_rejection_03.body')` derleme zamanında kontrol edilir; `strictKeyChecks: true` [39]. i18next-cli'ın `lint` ve `types` komutları hardcoded string ve eksik key için ikinci kontrol [40].

### 3.6 Lint kuralları (CI, `scripts/content-lint.ts`)

| # | Kural | Seviye |
|---|---|---|
| 1 | Her etkinlikte `tr` ve `en` blokları, aynı `choices` key seti | error |
| 2 | ICU parse (`@formatjs/icu-messageformat-parser`) iki dilde de hatasız | error |
| 3 | Placeholder (ICU argüman) kümesi eşit; istisna: `gender` opsiyonel | error |
| 4 | `plural`/`select` içinde `other` dalı var | error |
| 5 | `en.reviewedRev < en.rev` veya `status != approved` → release build'de | error (dev'de warn) |
| 6 | Uzunluk: `len(en)/len(tr)` 0.7–1.3 aralığı dışında | warn |
| 7 | UI buton bütçesi: TR ≤ 18, EN ≤ 16 karakter; başlık ≤ 28; push ≤ 110 | error |
| 8 | Gövde ≤ 3 cümle, sonuç ≤ 2 cümle, dipnot ≤ 1 cümle | warn |
| 9 | Yasaklı kelime/konu listesi (locale başına `content/redlines/{tr,en}.txt`) | error |
| 10 | Elle yazılmış Türkçe ek (`{name}'e`), EN'de `a {` | error |
| 11 | Gerçek marka/kişi adı listesi (Netflix, LinkedIn, siyasetçi adları) — soyutlama zorunlu | error |
| 12 | `intent` ve `universality` alanları dolu | error |
| 13 | Swap tablosunda olmayan TR-özgü anahtar kelime (askerlik, KPSS, bayram…) `localized/locale-only` etiketi olmadan | warn |

### 3.7 Pseudo-localization ve ekran görüntüsü testleri

- Dev build'de `EXPO_PUBLIC_PSEUDO=1` → `@antisoftwareclub/i18next-pseudo` postProcess: %35 uzatma, `⟦ ⟧` sarmalama, aksanlı harfler [49][50]. Sarmalanmamış metin = hardcoded string; kesilmiş `⟧` = taşma.
- Playwright: Expo web export üzerinde `projects: [{name:'tr', use:{locale:'tr-TR'}}, {name:'en', use:{locale:'en-US'}}, {name:'pseudo'}]`, `snapshotPathTemplate` locale içerir; baseline'lar proje başına ayrı [51][52]. 25 kritik ekran (onboarding, etkinlik kartı, seçim, ölüm ekranı, mağaza, ayarlar) × 3 proje = 75 snapshot; `--project=tr` ile tek locale baseline güncelleme.
- Cihaz testi: en küçük hedef ekran (iPhone SE genişliği 375pt) web viewport olarak sabitlenir.

### 3.8 Font kapsaması

Seçilen fontta şu glyph'ler cmap'te olmalı: U+0130 İ, U+0131 ı, U+015E/015F Ş/ş, U+011E/011F Ğ/ğ, U+00C7/00E7, U+00D6/00F6, U+00DC/00FC. Google Fonts "Plus" glyph seti Türkçeyi kapsar; eski Fredoka One'da Latin Extended eksikti, Lato'da da kullanıcı raporu var [53][54]. **Kural:** font repo'ya girerken `scripts/font-check.ts` (opentype.js/fontkit ile cmap kontrolü) koşar; eksik glyph = CI hatası. Ayrıca İ/ı için **tasarımsal** kontrol: bazı fontlarda "İ" noktası büyük harfte x-yüksekliğinin üstünde kırpılır → ekran görüntüsü testi "İSTATİSTİK" kelimesini içeren bir ekranı kapsar.

### 3.9 String uzunluk bütçeleri (UI)

| Öğe | TR max | EN max | Not |
|---|---|---|---|
| Birincil buton | 18 | 16 | Tek satır, 375pt |
| Seçenek kartı etiketi | 28 | 26 | 2 satıra izin |
| Etkinlik başlığı | 28 | 28 | |
| Etkinlik gövdesi | 220 | 240 | ~3 cümle |
| Sonuç metni | 160 | 170 | |
| Push başlık / gövde | 40 / 110 | 40 / 110 | iOS kesme ~ 4 satır |
| Mağaza alt başlık | 30 | 30 | Apple limiti |

### Bu oyuna nasıl uygularız
- Sprint 0'da: i18next + icu + polyfill kurulumu, `trInflect` + golden CSV, `content-build/lint`, pseudo-loc flag'i, 10 Playwright snapshot.
- Sprint 1'de: 50 etkinlikle pipeline'ı uçtan uca çalıştır, ilk `needs-review` döngüsünü dene.

---

## 4) AI Destekli İki Dilli Yazım + İnsan Küratörlük

### 4.1 Akış

1. **Intent üretimi** (geliştirici + AI): durum sınıfı başına 20–40 intent; swap tablosu ve ton kılavuzu prompt'a bağlı.
2. **Çift realization** (AI): Her intent için 3 TR + 3 EN aday; **aynı promptta değil**, ayrı promptlarda (çeviri refleksini kırmak için EN prompt'u TR metnini **görmez**, sadece intent'i görür).
3. **Funny-check** (AI jüri + geliştirici): her dilde rubrik (4.3), min 3/5; TR'de geliştirici son söz.
4. **Native punch-up** (EN komedi yazarı): Tier A içerik; satır başına yorum ile.
5. **Lint + review bayrağı** → approved.
6. **Telemetri** (offline-uyumlu, lokal sayaç; analytics SDK varsa opsiyonel): etkinlik başına "seçenek seçildi / atlandı / ekran süresi" → CAH Lab'ın "hangi kart kazandı" yaklaşımıyla düşük performanslı satırlar yeniden yazılır [19].

### 4.2 Prompt şablonları

**Intent'ten TR realization:**
```
Rol: Türkçe yazan, taşak geçen ama gizlice destekleyen hayat koçu anlatıcı.
Kurallar: 2. tekil şahıs; max 3 cümle; pun yok; gerçek marka/kişi yok; son vuruş "lift".
Yasak: din, etnisite, Atatürk, ordu, güncel siyaset, deprem, beden, intihar.
Intent: {intent_yaml}
Swap tablosu: {swap_rows_for_tags}
Çıktı: 3 aday, her biri {title, body, footnote?, choices[2]{label,result}} JSON.
```
**Intent'ten EN realization** (TR'yi görmez):
```
Role: a dry, deadpan, secretly-caring narrator. US spelling, no regional slang.
Voice refs: GLaDOS's passive-aggression, CARROT's affectionate insults, Good Place's earned optimism.
Rules: 2nd person; ≤3 sentences; no puns; abstract brands; end on a small lift.
Never: race, religion, disability, guns/school, suicide, body-shaming, real people.
Intent: {intent_yaml}
Output: 3 candidates as JSON {title, body, footnote?, choices[2]{label,result}}.
```
**Funny-check jüri promptu** her aday için rubrik puanı + 1 cümle gerekçe döndürür; 3 ayrı model çağrısının medyanı alınır (tek modelin "kendi şakasını beğenme" yanlılığını azaltır).

### 4.3 Funny-check rubriği (dil başına, 0–5)

| Ölçüt | Soru |
|---|---|
| Sürpriz | Son cümle ilk cümleden tahmin edilebilir mi? (edilebiliyorsa 0) |
| Spesifiklik | En az bir somut detay var mı (rakam, nesne, kurum)? |
| Hedef doğruluğu | Kurum/seçim mi roast ediliyor, kimlik mi? (kimlikse otomatik red) |
| Lift | Son vuruş "devam et" imasını açıkça söylemeden veriyor mu? |
| Dilin doğallığı | Native okur "çeviri kokuyor" der mi? (EN'de yazar, TR'de geliştirici) |

Geçme: toplam ≥ 15/25 ve hiçbir ölçüt 0 değil. "Lift" 0 ise içerik `motivating` pillar'ını ihlal eder → red.

### 4.4 Native-speaker review planı ve bütçe

**Piyasa:** Freelance narrative game writer ortalaması ~$20–26/saat (ZipRecruiter), narrative designer ~$48/saat; Suto'nun kademesi: giriş $20–40, orta $50–100, üst $150–300+/saat [68][69]. Fiverr'da komedi senaryosu gig'leri $50'den başlıyor, oyun diyalog gig'leri $50–200 paket [70][71]; punch-up için özel fiyat yok, mesajla teklif alınıyor.

**Plan: kademeli içerik.**

| Tier | İçerik | Kim | Hacim | Süre | Maliyet (USD) |
|---|---|---|---|---|---|
| A | Publisher demosu + ilk 2 saat: 200 etkinlik (~1.400 satır) + tüm UI (600) + push (150) + mağaza metni | Orta seviye EN komedi yazarı, $60–90/saat, ~50 satır/saat punch-up | ~2.150 satır | ~45 saat | 2.700–4.000 |
| A+ | Ses kalibrasyon atölyesi (ilk 50 satır birlikte) + 2 tur yeniden review (%20 değişim) | Aynı yazar | — | ~15 saat | 900–1.350 |
| B | 800 etkinlik uzun kuyruk | AI + geliştirici + rubrik; yazar sadece "kırmızı bayraklı" %10'u | ~5.600 satır | ~12 saat yazar | 700–1.100 |
| C | Lansman sonrası telemetriyle en düşük 100 etkinlik | Yazar | ~700 satır | ~14 saat | 850–1.250 |

**Toplam: ~5.000–7.700 USD; üst seviye yazarla 10.000 USD'ye kadar; takvim 3–5 hafta (A ve A+ ilk 2 hafta).** Ucuz yol (Fiverr paketleri) ~2.000–3.000 USD ama ses tutarlılığı riski; **tek yazar** ile çalışmak ses bütünlüğü için şart. Sözleşmede: tam telif devri, kredi (credits ekranı), NDA, "voice bible" teslimi.

### 4.5 Kırmızı çizgi matrisi (locale başına)

| Konu | TR | EN-US | Politika |
|---|---|---|---|
| Atatürk, kurucu değerler | **Yasal yasak** (5816: 1–3 yıl) [72] | — | Her iki dilde asla |
| Din / dini değerler | TCK 216 (dini değerleri aşağılama) + sosyal tepki | Apple 1.1.5 "inflammatory religious commentary" [55] | Asla; tatiller soyut ("the holidays", "bayram" sadece aile mekaniği) |
| Ordu, bayrak, askerlik | Hassas; askerlik **deneyimi** şaka olabilir, kurum olamaz | "Jury duty" ile ikame | TR'de "komutan" yok, "sıra arkadaşı" var |
| Siyaset, siyasetçiler | Yüksek hukuki risk (hakaret davaları) | Apple 1.1.1; Play "sensitive events" | Uydurma kurumlar (Disco Elysium Çin örneği) [32] |
| Deprem / afet | **Asla** (2023 travması) | Play "sensitive events" [58] | Soyut "kötü bir gün" bile dikkat |
| Alkol | 4250 sayılı kanun reklamı kısıtlar; oyun içi tüketim sınırda | 17+ derecelendirmede serbest | Soyut "drinks", marka yok, teşvik yok |
| Uyuşturucu | TCK 190 (özendirme) | US'de "weed" şakası sıradan | **Asimetrik:** EN'de hafif şaka olabilir, TR'de etkinlik yok; `locale-only` |
| Kumar | TR'de yasa dışı; "şans oyunu" devlet | Apple/Play: simüle kumar IAP'siz serbest | Piyango var, kumarhane yok; IAP'ye bağlı asla |
| Beden / kilo | TR'de sosyal olarak daha tolere | US'de "mean-spirited" + şikayet (Carrot Fit) [3] | **Asimetrik:** EN'de yok; TR'de yumuşak, sadece anlatıcının kendi "meatbag" lakabı |
| Irk, etnisite, göçmenlik | Hassas | Apple 1.1.1 açık yasak | Asla |
| Silah, okul | — | Okul + silah birlikte asla | Asla |
| İntihar / kendine zarar | Asla | Asla (Apple 1.1 + hassas) | Ölüm sadece kaza/hastalık/yaş; "Dumb Ways to Die" absürtlüğü |
| Küfür | "Spicy" modda hafif argo, küfür yok | "damn/hell" seviyesi; f-word yok | Yaş derecelendirmesini 12+/Teen'de tutmak için |

### 4.6 Senkron ve versiyonlama

- Etkinlik `version` artar → her locale bloğunun `rev`'i artar; `reviewedRev` yazar onayıyla güncellenir. `rev ≠ reviewedRev` → `needs-review`.
- Intent değişirse **iki** locale de `needs-review` olur; sadece TR yüzey metni değişirse EN `needs-check` (hafif) olur — yazar 2 dakikada "aynı işi yapıyor mu" diye bakar.
- PR şablonu: "Hangi locale'ler değişti? Intent değişti mi?" kutuları; CODEOWNERS ile `content/**` değişikliklerine lint zorunlu.
- Haftalık `content-report`: approved / needs-review / needs-check sayıları, universality dağılımı, ortalama uzunluk oranı.

### Bu oyuna nasıl uygularız
- Yazar işe alımı: Upwork'te "comedy writer + game dialogue" filtresi, 30 satırlık ücretli test (100 USD), bizim rubrikle puanla; 3 adaydan 1'ini seç.
- Prompt şablonları `prompts/` dizininde versiyonlu; her sprint sonunda rubrik geçme oranı raporlanır.

---

## 5) İki Dilde Mağaza Varlığı

### 5.1 Alan limitleri ve kurallar

- **App Store:** ad 30, alt başlık 30, keyword 100 **byte** (Türkçe ş/ğ 2 byte → TR keyword alanı fiilen daha kısa!), promosyon metni 170; "Names of other apps or companies aren't allowed" (keyword) [56]; 2.3.7: trademark/popüler uygulama adıyla metadata doldurma yasak [55]. Uzun açıklama indekslenmez [62].
- **Google Play:** başlık 30, kısa açıklama 80, uzun açıklama 4.000 ve **indekslenir** [62]; tr-TR desteklenir [59]; ülke bazlı farklılaştırma için custom store listing (50'ye kadar) [60][61].
- **"BitLife" riski:** Keyword'de yasak (başka uygulama adı), alt başlıkta yasak ("reference other apps"). Apple Search Ads'te marka terimine teklif vermek mümkün (Apple "branded terms as Search Ads keywords" şikayetlerini incelemiyor) ama bu metadata'ya yazma izni değildir [57]. Play'de uzun açıklamada "fans of life simulators" gibi jenerik ifade; **"BitLife alternative" asla**.

### 5.2 Keyword taslakları

**EN (100 byte bütçesi):** `life,simulator,sim,text,choices,story,sarcastic,funny,dark,comedy,offline,decisions,adult,roast` (alt başlıkta "life" ve "simulator" zaten varsa keyword'den çıkar — Apple ad/alt başlığı zaten indeksler). Play uzun açıklama: "life simulator", "life sim game", "text-based life game", "choose your life", "dark comedy", "sarcastic narrator", "offline game", "no wifi".
**TR:** `hayat,yaşam,simülasyon,simülatör,oyunu,komik,mizah,seçim,hikaye,metin,çevrimdışı,internetsiz` — byte limiti nedeniyle "simülasyon" (11 byte) yerine "simulasyon" (ASCII, arama toleransı test edilmeli) değerlendirilir.

### 5.3 Alt başlık / kısa açıklama adayları

- EN: "Live. Fail. Get roasted. Retry." (31 → kısalt: "Live, fail, get roasted. Retry") / "A life sim with a mouth"
- TR: "Yaşa, batır, laf ye, tekrar" / "Ağzı bozuk hayat simülasyonu"

### 5.4 İsim adayları ve çakışma kontrolü

Kriterler: ASCII güvenli, iki dilde telaffuz, iki dilde anlam ya da "boş ama hoş", mağazada 30 karaktere alt başlıkla sığma, bilinen çakışma.

| # | Ad | TR anlam | EN okunuş | ASCII | Bulunan çakışma (web araması, hukuki arama değil) | Verdikt |
|---|---|---|---|---|---|---|
| 1 | **Kismet** | Kısmet | İngilizcede sözlük kelimesi (fate) | ✓ | App Store'da "Kismet" fal uygulaması [75]; Lakeside'ın Kismet zar oyunu (bilinen marka) | **Güçlü, bileşik adla:** "Kismet: Life Roast" / "Kısmet: Hayat Oyunu" — TÜRKPATENT + USPTO sınıf 9/41 taraması şart |
| 2 | Nazar | Nazar | Yabancı ama kısa | ✓ | Recontact'ın 2024 Steam oyunu "Nazar" (TR stüdyo) [76] | ✗ Aynı sektör, aynı ülke |
| 3 | Hadi | Hadi! | "Hoddy"? | ✓ | İstanbul'da "Hadi" mobil oyun şirketi [77] | ✗ |
| 4 | Yaşa | Yaşa! / Hurray | "Yasha" | ✗ (ş) | Bulunmadı | Zayıf: ASCII "Yasa" = "kanun" |
| 5 | Ömür | Ömür | Okunmaz | ✗ | Bulunmadı | TR için güzel, EN için ölü |
| 6 | Keşke | If only | Okunmaz | ✗ | Bulunmadı | TR güçlü, EN yok |
| 7 | Lifey | — | Lifey | ✓ | "Lifey" video uygulaması [78] | ✗ |
| 8 | Roast Life / Life Roast | "Roast" Z kuşağında bilinir | Açık | ✓ | Tam ad bulunmadı; çok sayıda "Roast App" var | Orta: betimleyici, ayırt edicilik zayıf, alt başlık olarak kullan |
| 9 | Meh Life | "Meh" internet dili | Açık | ✓ | Bulunmadı | Orta: ton doğru, "life" ASO'ya yardım eder; "meh" ucuz hissettirebilir |
| 10 | Felek | Felek (kader çarkı) | "Fellek" | ✓ | Bulunmadı | TR'de "feleğin çemberi" güçlü; EN'de boş ama telaffuz edilebilir — **ikinci aday** |
| 11 | Bir Ömür / "One Life" | Bir ömür | — | ✓ | "One Life" jenerik, çok kullanılan | Zayıf ayırt edicilik |
| 12 | C'est la Vie | "Selavi" herkes bilir | Herkes bilir | ✗ (') | Jenerik ifade, muhtemelen çok uygulama | ASO zor (apostrof) |

**Öneri:** Marka kelimesi **Kismet** (yedek: **Felek**), locale'e göre alt başlık: "Kismet – Life Roast Sim" / "Kismet – Ağzı Bozuk Hayat Oyunu". TR'de "Kısmet" yazımı mı "Kismet" mi? Tek marka için ASCII "Kismet" + TR mağaza metninde "(kısmet)" göndermesi. Hukuki tarama T9 (hukuki uyum) konusuna devredilir.

### 5.5 Sürüm notları sesi

Sürüm notları anlatıcı sesiyle, iki dilde ayrı yazılır (çevrilmez), ama **somut değişiklik listesi** aynı kalır:
- EN: "v1.2 — Added 80 new ways for your life to go sideways. Fixed a bug where the landlord was *too* nice. Reports of the narrator being 'mean' have been noted and ignored."
- TR: "v1.2 — Hayatının ters gitmesi için 80 yeni yol ekledik. Ev sahibinin fazla iyi olduğu hatayı düzelttik. 'Anlatıcı çok laf sokuyor' şikayetleri okundu, dikkate alınmadı."
Apple'ın "metadata'da uygunsuz içerik" kuralı gereği sürüm notlarında küfür ve kişi hedefi yok.

### 5.6 Ekran görüntüleri

Locale başına ayrı set (TR cihaz dili, TR isimler, TR referanslar; EN'de EN). Phiture vakaları localize edilmiş asset'lerin %9–11 dönüşüm artışı getirdiğini raporluyor (Taobao banner +%11, Deezer video +%9,8) [64][65] — rakamlar bire bir bizim kategoriye uymaz ama yön net. İlk ekran görüntüsünde **bir roast satırı** büyük puntoyla: oyunun USP'si metin.

### Bu oyuna nasıl uygularız
- `store/` dizininde `tr/` ve `en/` metinleri, keyword byte sayacı script'i (`scripts/store-lint.ts`: Apple 100 byte, 30/30; Play 30/80).
- Sprint 2'de isim kararı, TÜRKPATENT/USPTO ön taraması; App Store Connect'te ad rezervasyonu.
- Mağaza ekran görüntüleri Playwright'ın aynı web export'undan locale başına üretilir (tek kaynak).

---

## 6) Teslimatlar Özeti

- **EN anlatıcı ses kılavuzu:** Bölüm 1.2–1.5 (varyant, 10/10 listesi, 40+ örnek, dipnot öğesi).
- **Kültürel ikame tablosu:** Bölüm 2.4 (48 satır).
- **İçerik JSON yapısı + iki dilli worked example:** Bölüm 3.2.
- **i18n teknik spec:** Bölüm 3.1–3.9.
- **Bütçe/zaman:** Bölüm 4.4.
- **Riskler:** aşağıda.

### 6.1 İki dilli QA kontrol listesi

**Her etkinlik (PR'da):**
- [ ] `intent`, `universality`, `effects` dolu; mekanizma pun değil
- [ ] TR ve EN bloklarında aynı `choices` key'leri
- [ ] ICU parse OK, placeholder kümeleri eşit (gender hariç), `other` dalı var
- [ ] EN rubrik ≥ 15/25, TR rubrik ≥ 15/25, hiçbir ölçüt 0 değil
- [ ] Kırmızı çizgi listesi (iki locale) temiz; gerçek marka/kişi yok
- [ ] Uzunluk oranı 0.7–1.3; gövde ≤ 3 cümle
- [ ] TR'de isim eki yalnızca `{name_*}` ile; EN'de `a {` yok
- [ ] `reviewedRev == rev` (release için)

**Her sürüm:**
- [ ] Pseudo-loc build'de sarmalanmamış metin yok (hardcoded)
- [ ] 75 Playwright snapshot'ı (tr/en/pseudo) geçti; "İSTATİSTİK" ekranı dahil
- [ ] Font cmap kontrolü geçti
- [ ] Cihazda TR ve EN'de: onboarding, ilk 10 etkinlik, ölüm ekranı, ayarlar, IAP ekranı elle okundu
- [ ] Push metinleri gerçek cihazda kesilmeden görünüyor (iOS/Android)
- [ ] Mağaza metinleri byte/karakter limitlerinde; "bitlife" ve rakip adları yok
- [ ] Sürüm notları iki dilde, kişi hedefi/küfür yok
- [ ] Dil değiştirme (ayarlar) anında uygulanıyor; sistem dili tr/en dışındaysa EN'e düşüyor

### 6.2 Riskler

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| EN "çevrilmiş" kokuyor; publisher demosunda fark ediliyor | Yüksek | Kritik | Paralel yazım (EN TR'yi görmez), Tier A punch-up, publisher demosunu yazar onaylı 200 etkinlikle sınırla |
| Tek freelance yazara bağımlılık (ses tutarlılığı, erişilebilirlik) | Orta | Yüksek | Voice bible teslimi, 50 satırlık kalibrasyon seti, yedek yazar ücretli test ile hazır |
| Apple 1.1.1 "mean-spirited" reddi | Düşük-Orta | Yüksek | Kimlik yerine seçim/kurum roast'u; `spicy` mod varsayılan kapalı; review notlarında "satirical life-coach narrator" açıklaması |
| TR hukuki içerik riski (5816, TCK 216/299/301) | Düşük | Kritik | Kırmızı çizgi lint'i + T9 hukuki inceleme; uydurma kurumlar |
| Türkçe ek hataları ("Ayşe'ya") itibar kaybı | Orta | Orta | Golden CSV 300 isim; yalın hal politikası; beta'da TR oyunculardan "ek hatası bildir" düğmesi |
| Hermes Intl/PluralRules eksikleri eski Android'de çökme | Orta | Orta | formatjs polyfill'leri koşulsuz yükle; `parseErrorHandler` ile ham metne düş |
| ₺/$ tartışması (soyut birim "gerçek değil" hissi) | Düşük | Düşük | Beta'da A/B: soyut vs ₺; anlatıcı şakasıyla meşrulaştır |
| Keyword alanında Türkçe byte kaybı | Kesin | Düşük | ASCII varyantları test; "simulasyon" arama eşleşmesi doğrulanır |
| İçerik senkronu bozulur (TR güncellenir, EN eski kalır) | Yüksek | Orta | `needs-review` release blokajı, haftalık rapor |
| Meme/argo eskimesi | Orta | Düşük | Lint'te "tarihli kelime" listesi; sürüm başına tarama |
| Font İ/ı render sorunu | Düşük | Orta | cmap kontrolü + snapshot |

---

## Bu Oyun İçin Öneriler (öncelikli, puanlı)

Puan = etki (1–5) × kolaylık (1–5).

| Öncelik | Öneri | Etki | Kolaylık | Puan |
|---|---|---|---|---|
| P0 | EN'yi TR'den ayrı, intent'ten paralel yazmak (EN prompt'u TR'yi görmez) | 5 | 5 | 25 |
| P0 | i18next + i18next-icu + formatjs polyfill; etkinlik-başına JSON → locale bundle build | 5 | 4 | 20 |
| P0 | `content-lint.ts` 13 kural, `needs-review` release blokajı | 5 | 4 | 20 |
| P0 | `trInflect` + 300 isimlik golden test; `{name_*}` sözleşmesi | 4 | 5 | 20 |
| P0 | Kırmızı çizgi matrisi iki locale (lint + yazar brief'i) | 5 | 4 | 20 |
| P1 | Tier A için EN komedi yazarı punch-up (≈45–60 saat, 3–5k USD) | 5 | 3 | 15 |
| P1 | Soyut para birimi + ikon; rakamlar ICU `number` | 3 | 5 | 15 |
| P1 | Pseudo-loc + Playwright tr/en/pseudo snapshot'ları | 4 | 4 | 16 |
| P1 | Marka adı "Kismet" (yedek "Felek") + bileşik alt başlık; TÜRKPATENT/USPTO taraması | 4 | 3 | 12 |
| P1 | Mağaza: EN/TR keyword setleri, "bitlife" yok; Apple Search Ads'te marka teklif testi (küçük bütçe) | 3 | 4 | 12 |
| P2 | Anlatıcı dipnotu UI öğesi | 3 | 4 | 12 |
| P2 | Ton seviyesi (mild/spicy) ayarı, spicy varsayılan kapalı | 3 | 3 | 9 |
| P2 | Telemetri ile "kazanan satır" analizi ve Tier C yeniden yazım | 4 | 2 | 8 |
| P2 | en-GB mağaza varyantı (sadece listing) | 2 | 3 | 6 |

---

## Açık Sorular

1. Publisher adayları EN'yi hangi lehçede bekliyor? (US merkezli publisher ise en-US kararı kesinleşir; UK publisher'da yazar seçimi İngiliz olabilir, yazım yine US.)
2. Yaş derecelendirmesi hedefi 12+/Teen mi, 17+/Mature mı? Küfür ve "spicy" mod politikası buna bağlı (T9 ile ortak karar).
3. "Kismet" adı için TÜRKPATENT ve USPTO sınıf 9/41 taraması; Lakeside'ın Kismet (zar oyunu) markasının sınıf kapsamı.
4. Soyut para birimi beta'da TR oyuncuda "gerçek değil" tepkisi yaratır mı? (A/B gerekli.)
5. Hermes'in güncel sürümünde `Intl.PluralRules` durumu — dokümanda listelenmiyor; cihazda doğrulanmalı, polyfill her hâlükârda planlı.
6. EN komedi yazarı sözleşmesi: saatlik mi satır başı mı? (Önerimiz saatlik + haftalık tavan.)
7. Locale-only etkinliklerin ikizleri (askerlik ↔ jury duty) aynı `effects`'i paylaşınca denge hissi iki pazarda aynı mı?
8. Apple Search Ads'te "bitlife" marka terimine teklif ekonomik mi (CPT) — küçük bütçeli test gerekiyor.
9. Erişemediğimiz kaynaklar (TidBITS Carrot yazısı, Lingui karşılaştırma sayfası, Siliconera Treehouse röportajı, Expo localization dokümanı, Google Play yardım sayfaları) doğrudan okunarak doğrulanmalı.

---

## Kaynaklar

1. TidBITS — CARROT Weather Predicts Cloudy with a Chance of Snark: https://tidbits.com/2018/01/22/carrot-weather-predicts-cloudy-with-a-chance-of-snark/
2. TechCrunch — Carrot Weather delivers your forecast with a side of snark: https://techcrunch.com/2015/03/20/carrot-weather-delivers-your-daily-forecast-with-a-side-of-snark/
3. ABC News — "Greetings, Chubby Human": Weight-Loss App Shames Users: https://abcnews.go.com/blogs/health/2014/02/05/greetings-chubby-human-weight-loss-app-shames-users
4. Healthista — CARROT Fit talking app weight tracker: https://www.healthista.com/carrot-fit-talking-app-weight-tracker/
5. Business Insider — CARROT insults you until you lose weight: https://businessinsider.in/a-new-app-called-carrot-insults-you-relentlessly-until-you-lose-weight/amp_articleshow/45826000.cms
6. Deconstructor of Fun — Duolingo Push Notifications playbook: https://duolingo.deconstructoroffun.com/mechanics/notifications
7. Medium — Duolingo needs to chill ("These reminders don't seem to be working"): https://debugger.medium.com/duolingo-needs-to-chill-8f1832745ca0
8. Taplytics — Duolingo push about reminders not working: https://taplytics.com/blog/duolingo-sends-push-notifications-to-let-users-know-they-know-theyre-not-engaging-with-their-reminders
9. Wikipedia — The Stanley Parable: https://en.wikipedia.org/wiki/The_Stanley_Parable
10. Diegesis — Backe & Thon on Stanley Parable / Beginner's Guide: https://www.diegesis.uni-wuppertal.de/index.php/diegesis/article/view/357
11. Wikipedia — GLaDOS: https://en.wikipedia.org/wiki/GLaDOS
12. Funambulism — Interview: Erik Wolpaw and Chet Faliszek: https://funambulism.com/2011/03/28/interview-erik-wolpaw-and-chet-faliszek-valve/
13. Venus Patrol — Portal team postmortem: https://venuspatrol.com/2008/11/portal-team-postmortem/
14. TIME — Ricky Gervais: The Difference Between American and British Humour: https://time.com/3720218/difference-between-american-british-humour
15. Tampere University — Hyperdetermined humor in Pratchett (dissertation): https://researchportal.tuni.fi/en/publications/the-witcraft-of-seeing-things-differently-hyperdetermined-humor-u/
16. Book Riot — Happy Birthday Sir Terry Pratchett: https://bookriot.com/happy-birthday-sir-terry-pratchett/
17. The Drum — McCann creative reflects on Dumb Ways to Die: https://www.thedrum.com/news/2013/06/11/mccann-creative-reflects-dumb-ways-die-it-tipped-win-big-cannes
18. Know Your Meme — Dumb Ways to Die: https://knowyourmeme.com/memes/dumb-ways-to-die
19. Cards Against Humanity Lab — FAQ: https://lab.cardsagainsthumanity.com/faq
20. Fanbase Press — Interview with Eli Halpern (CAH): https://fanbasepress.com/press/interviews/gaming/item/1336-fanboy-comics-interviews-eli-halpern-co-creator-of-cards-against-humanity/
21. AppUnwrapper — Interview with Reigns developer François Alliot: https://www.appunwrapper.com/2016/08/17/interview-with-reigns-developer-francois-alliot/
22. GamesRadar — How Reigns convinced two million people to swipe right: https://gamesradar.com/how-reigns-convinced-two-million-people-to-swipe-right-to-rule-their-kingdom-and-captured-the-game-of-thrones-license
23. SteamDB — Reigns (languages): https://steamdb.info/app/474750
24. Peabody — Michael Schur on ethics, civics, optimism: https://peabodyawards.com/stories/the-good-place-creator-michael-schur-on-ethics-civics-optimism-and-the-lessons-of-lost/
25. Anthony Teixeira — Introduction to game localization: the LocJAM3 case study: https://www.at-it-translator.com/introduction-to-game-localization-through-a-case-study-the-locjam3/
26. LocJAM Japan — Kyoto Study Group presentation: https://www.slideshare.net/slideshow/locjam-japan-presentation-kyoto-study-group-december-2016/70236566
27. SlideShare — Humor, Creativity and Transcreation in Video Game Localization: https://slideshare.net/pmstrad/humor-creativity-and-transcreation-in-video-game-localization
28. Terra Localizations — 5 aspects when localizing humor in games: https://terralocalizations.com/2024/07/03/5-aspects-to-consider-when-localizing-humor-in-video-games/
29. Game Translation Bits — How Undertale's monster names were translated in Japanese: https://gametranslationbits.wordpress.com/2024/01/26/how-undertales-monster-names-were-translated-in-japanese/
30. Tumblr — Notes from the Undertale Legends of Localization book: https://n0maku.tumblr.com/post/711027084014829568/undertale-translation-notes
31. Wikipedia — 8-4 (localization company): https://en.wikipedia.org/wiki/8-4
32. Game World Observer — Localizing Disco Elysium for China: https://gameworldobserver.com/2020/04/02/localizing-disco-elysium-china
33. Wordfoxes — Disco Elysium localization case study: https://www.wordfoxes.com/insights/disco-elysium-localization-case-study
34. Siliconera — How Nintendo made Mario & Luigi: Dream Team funny (Treehouse): https://www.siliconera.com/how-nintendo-made-mario-luigi-dream-team-funny-and-other-tales-from-treehouse/
35. GamesBeat — Q&A with Nintendo localization manager Nate Bihldorff: https://gamesbeat.com/qaa-nintendo-senior-localization-manager-nate-bihldorff/
36. Polygon — Animal Crossing localization book excerpt: https://www.polygon.com/animal-crossing/484661/animal-crossing-localization-book-excerpt
37. Lingui — Lingui vs i18next: https://lingui.dev/misc/i18next
38. muszarski.com — Lingui vs i18next in 2026 for React and React Native: https://muszarski.com/en/blog/lingui-vs-i18next/
39. i18next — TypeScript: https://www.i18next.com/overview/typescript
40. i18next — Plugins and utils (i18next-cli): https://www.i18next.com/overview/plugins-and-utils
41. GitHub — i18next/i18next-icu: https://github.com/i18next/i18next-icu
42. GitHub — Hermes Intl APIs: https://github.com/facebook/hermes/blob/main/doc/IntlAPIs.md
43. GitHub — aozmekik/turkish-inflect: https://github.com/aozmekik/turkish-inflect
44. GitHub — yasinkuyu/Turkish.js: https://github.com/yasinkuyu/Turkish.js/tree/master
45. npm — turkish-suffixes: https://www.npmjs.com/package/turkish-suffixes
46. GitHub — h4kbas/trjs: https://github.com/h4kbas/trjs
47. General Translation — What is ICU message format (select/plural guidance): https://generaltranslation.com/en-US/kb/icu-message-format
48. Yarn — pseudo-translate-icu: https://classic.yarnpkg.com/en/package/pseudo-translate-icu
49. npm — @antisoftwareclub/i18next-pseudo: https://www.npmjs.com/package/@antisoftwareclub/i18next-pseudo
50. DEV — Pseudo-localization for automated i18n testing: https://dev.to/anton_antonov/pseudo-localization-for-automated-i18n-testing-31
51. HelpMeTest — E2E i18n testing with Playwright: https://helpmetest.com/blog/playwright-i18n-e2e-testing/
52. camoa — Playwright visual regression config walkthrough: https://camoa.github.io/dev-guides/testing/visual-regression/playwright/pw-vr-config-walkthrough/
53. GitHub — google/fonts issue #2411 (Fredoka One Latin Extended): https://github.com/google/fonts/issues/2411
54. Fontsource — Fredoka: https://fontsource.org/fonts/fredoka/about
55. Apple — App Review Guidelines (1.1, 2.3.7, 5.2.1): https://developer.apple.com/app-store/review/guidelines/
56. Apple — App Store Connect: Platform version information (keywords): https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/
57. RocketshipHQ — Apple Search Ads competitor keywords: https://www.rocketshiphq.com/bid-competitor-keywords-apple-search-ads/
58. Google Play — Inappropriate Content policy: https://support.google.com/googleplay/android-developer/answer/9878810
59. Google Play — Supported languages: https://support.google.com/googleplay/android-developer/table/4419860?hl=en
60. Google Play Console — Custom store listings: https://play.google.com/intl/en-GB_ALL/console/about/customstorelistings
61. Google Play — Add translations / localized listings: https://support.google.com/googleplay/android-developer/answer/9844778
62. AppDrift — App Store character limits reference: https://appdrift.co/blog/app-store-character-limits-complete-reference
63. ASOTools — "second life" / bitlife keyword case: https://asotools.io/app-store-keywords/second-life
64. Phiture — Taobao localized ASO A/B testing case: https://www.casestudies.com/company/phiture/case-study/taobao-boosts-conversion-11-with-phitures-7-day-aso-testing
65. Phiture — Deezer localized app preview case: https://www.casestudies.com/company/phiture/case-study/deezer-customer-case-study
66. AppTweak — Beginner's guide to app localization on Google Play: https://www.apptweak.com/en/aso-blog/beginner-s-guide-to-app-localization-on-google-play
67. Apple Developer Forums — Bundle preferred languages / en-GB fallback: https://developer.apple.com/forums/thread/824280
68. ZipRecruiter — Freelance narrative game writer jobs/rates: https://www.ziprecruiter.com/Jobs/Freelance-Narrative-Game-Writer
69. Amy Suto — How to hire a game writer: https://www.amysuto.com/desk-of-amy-suto/how-to-hire-a-game-writer
70. Fiverr — comedy script gig (örnek fiyatlandırma): https://fiverr.com/essamramy/write-a-comedy-script-for-you
71. Fiverr — game dialogue gig (örnek fiyatlandırma): https://fiverr.com/codyskrine/write-dialogue-for-your-game-or-story
72. Wikipedia — Law on Crimes Committed Against Atatürk (5816): https://en.wikipedia.org/wiki/Law_on_Crimes_Committed_Against_Atat%C3%BCrk
73. Yeni Şafak — TÜİK 2024 en popüler isimler: https://www.yenisafak.com/tuik-acikladi-2024-yilinin-en-populer-isimleri-neler-h-4696961
74. TRT Haber — Türkiye'de en yaygın isimler infografik: https://www.trthaber.com/infografik/turkiyede-2025in-en-yaygin-isimleri-belli-oldu-898.html
75. App Store — Kismet (fal uygulaması): https://apps.apple.com/app/id1459550704
76. Gaming Deputy — Nazar (Recontact Games) Steam çıkışı: https://www.gamingdeputy.com/gr/nazar-ist-ab-sofort-fuer-pc-ueber-steam-erhaeltlich/
77. VCBacked — Hadi (mobile games company): https://www.vcbacked.co/company/hadi
78. App Store — Lifey: https://apps.apple.com/us/app/lifey-interview-everyone/id1427725117
79. Game Developer — Exploring what it takes to make a funny game (Zoe Quinn GDC): https://www.gamedeveloper.com/design/exploring-what-it-takes-to-make-a-funny-game
80. Game Developer — How West of Loathing became a game made out of jokes: https://gamedeveloper.com/design/video-how-i-west-of-loathing-i-became-a-game-made-out-of-jokes
