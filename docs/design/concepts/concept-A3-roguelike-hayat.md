# Konsept A3 — Roguelike Hayat: **"Bu Sefer"** (EN: *This Time*)

> **Açı:** Ölüm ana menüdür. Her hayat bir "sefer"dir; her sefer kalıcı bir meta katmanı besler (Miras Puanı, El Bagajı, Yolcu Defteri, Tekrar Eden Yolcular, Teşhis, Haftanın Seferi, Güzergahlar, Aile Bileti). "Bir sefer daha" en az "bir yıl daha" kadar güçlü olacak şekilde kurgulanmış run/meta ekonomisi.
> **Durum:** Konsept v1 · 2026-11-06 · Taban: T1 (meta-progression, koleksiyon, LTE), T4 (director, hazard, legacy, seed), T11 (ödül motoru, 3(g) skor eğrileri, novelty, pending queue), T3 (ses), T7/T8/T9/T10 (çerçeve). Bağlayıcı kararlara dokunulmadı.
> **Çalışma adı:** *Bu Sefer* · **Anlatıcı:** Muavin (TR) / The Conductor (EN), Devran Turizm / Devran Transit (kurgusal şirket) · **Ana ekran:** Terminal.

---

## 1. Oyun adı önerileri ve tagline

| # | Ad (TR / EN) | Neden | Risk | Verdikt |
|---|---|---|---|---|
| 1 | **Bu Sefer / This Time** | "Sefer" hem yolculuk hem deneme ("bu sefer farklı" roguelike'ın yeminidir); EN'de aynı çift anlam. İki dilde de iki hece, telaffuzu kolay, ASCII | Sözlük kelimesi → marka zayıf; TÜRKPATENT 9/41 + USPTO taraması şart; "This Time" adlı küçük app'ler olabilir | **Birinci aday** (alt başlıkla: *Bu Sefer: Hayat Simülasyonu* / *This Time: A Life Roguelike*) |
| 2 | **Gidiş Dönüş / Round Trip** | Ölüp geri gelme fikrini bir bilet türüyle anlatıyor; mağaza sayfasında meta katman anında anlaşılır | Seyahat uygulamalarıyla ASO karışması | İkinci aday |
| 3 | **Mola / Layover** | Hayatlar arası Terminal ekranının adı; EN "layover" (aktarma beklemesi) tam bizim ölüm ekranı | TR'de "mola" yumuşak, hayatı anlatmıyor | Hub ekranının adı olarak kullan |
| 4 | **Son Durak / Last Stop** | Ölüm = son durak; kara mizah tonu net | Mağaza metadata'sında "ölüm" çağrışımı (Apple 2.3.8 "4+ vitrin" kuralı) riskli; jenerik | Ölüm ekranı başlığı |
| 5 | **Terminal** (tek marka, iki dilde aynı) | Otogar + "terminal hastalık" çift anlamı EN'de bedava kara mizah; TR'de otogar anlamı bilinir | EN'de tıbbi çağrışım bazı kullanıcıyı iter; jenerik kelime | Yedek marka |

**Tagline (mağaza, 4+ güvenli):** TR *"Hayat tek yön değil."* · EN *"Life isn't a one-way ticket."*
**Tagline (oyun içi / reklam kreatifi):** TR *"Bu sefer farklı. Dedin. Yine."* · EN *"This time it's different. You said. Again."*

## 2. Elevator pitch

**TR:** *Bu Sefer*, 18'den ölüme bir hayat simülasyonu; ama ölüm oyunun sonu değil, ana menüsü. Her hayattan Miras Puanı, bir el bagajı ve seni hatırlayan bir muavin kalır; haftanın seferinde herkes aynı otobüse biner, aynı çukurlardan geçer ve farklı yerde iner.

**EN:** *This Time* is a life sim from eighteen to the grave where death isn't the end of the game; it's the main menu. Every life leaves behind legacy points, a carry-on bag and a conductor who remembers you; in the weekly trip everyone boards the same bus, hits the same potholes and gets off somewhere different.

## 3. Oyuncu fantezisi ve hedef kitle

**Fantezi:** "Bir daha yaşasam..." cümlesini oynamak. BitLife'ta ölünce sıfırlanırsın; burada ölünce *birikirsin*. Oyuncu Terminal'e döner, bagajını toplar ve bu sefer kripto almaz. Ya da alır; muavin sayar. Kazanmak zengin ölmek değil, Yolcu Defteri'nde "aynı hatayı yapmadı" satırını görmek.

| Kim | Neden gelir | Neden döner | Neyin ekran görüntüsünü alır |
|---|---|---|---|
| 18–29 TR, Reels/TikTok, roast ve absürt skeç kültürü | "Oyun geçmiş hayatımı hatırlıyor" videoları | Ölünce 40 sn içinde yeni sefer; her seferde garanti 1 açılım | **Bilet Koçanı** (ölüm kartı), muavinin "defterde yazıyor" satırı |
| 25–40, roguelike/deckbuilder oyuncusu (Slay the Spire, Hades, Balatro) | "Hayat sim + run/meta ekonomisi" vaadi; build (el bagajı) kurma | Miras Puanı eşikleri, Güzergahlar, Gece Yolculuğu zorluğu | Bagaj kombinasyonu + Yıl Sonu Karnesi |
| EN 18–34, Stanley Parable/Carrot/Hades seven | "The conductor remembers your last three lives" | Haftanın Seferi (Pazartesi, herkes aynı seed) | "Seat 14C: died at 58, 2 marriages, Diagnosis: Chronic Postponer. You?" |

Hedef KPI'lar (T1/T2 + bu açının ekleri): ilk kahkaha < 20 sn, ilk karar < 30 sn, **ilk ölüm < 15 dk**, ölüm → yeni sefer dönüşümü ≥ %65 (2 dk içinde), ilk hafta ≥ 3 sefer/oyuncu, D1 ≥ %40, D7 ≥ %18, D30 ≥ %8.

## 4. Anlatıcı: Muavin / The Conductor

### 4.1 Neden muavin (ve neden memur değil)

Roguelike'ın hub'ı "hayatlar arası" yerdir; o yerin ev sahibi lazım. Adaylar: Noter (vasiyet metaforu güçlü, 70 yıl boyunca kuru), Arşivci (hafıza güçlü, dünyası yok), **Muavin**. Muavin kazandı çünkü metaforun her parçası bir mekanik üretiyor: hayat = sefer, ölüm = son durak, hayatlar arası = Terminal, kalıcı perk = **el bagajı**, geçmiş utanç = **fazla bagaj**, haftalık seed = **herkes aynı otobüste**, hafıza = **yolcu defteri**. Özel şirket çalışanı olduğu için kamu görevlisi şakası riski ve "kader" kavramının dinî yükü yok.

### 4.2 Künye

| Alan | TR | EN |
|---|---|---|
| İsim | **Muavin** (adı yok; "Adım önemli değil, Muavin de.") | **The Conductor** ("Name's not important. Conductor'll do.") |
| Kurum | Devran Turizm (kurgusal), hat: Terminal ↔ Son Durak | Devran Transit, the Night Line |
| İşi | Bilet keser, kolonya tutar, kek dağıtır, **Yolcu Defteri** tutar. Karar vermez, direksiyona dokunmaz | Punches tickets, pours coffee, keeps the **Passenger Log**. Doesn't drive |
| Yaş/cinsiyet | Oyuncudan yaşlı, belirsiz; 1. tekil şahıs → zamir sorunu yok | Same |
| İstediği | Bir yolcunun bir kez "aynı hatayı yapmadan" inmesi; defterin o sayfasını çerçeveletmek | Same |
| Kini | Şoför (hiç görünmez, hep acelesi var), mola yerindeki tost fiyatları, kripto | The driver (never seen), rest-stop coffee prices, crypto |
| Gizli sırrı | Seni cam kenarına oturtur. Söylemez | Gives you the window seat. Never mentions it |

**Kişilik, tek paragraf:** Aynı hatta hiç kimsenin hatırlamadığı kadar uzun süredir çalışan, her yolcuyu ilk bakışta tanıyan, hiçbir şeye şaşırmayan ama *bu* yolcunun defterini hâlâ kalemle tutan adam. Kararlarına acımasız, varlığına sadık. Yanılırsa deftere "haksız çıktım" yazar ve sayfayı gösterir. Asla bağırmaz, asla emoji kullanmaz, asla "canım" demez. Kek ikram eder; kek bir şakadır ve bir rahatlama beat'idir.

**Ses kuralları:** T3 §5a'nın 10 YAP / 10 YAPMA listesi aynen geçerli. Konsepte özgü ekler: (a) kelime dağarcığı: "sefer, defter, bagaj, son durak, mola, kolonya, koltuk, defterde yazıyor"; (b) geçmiş hayata gönderme yalnızca `metaLog`'da gerçekten olan şeye dayanır (hafıza uydurulmaz; oyuncu Yolcu Defteri'nden doğrulayabilir); (c) 60+ yaşta beat başına ≤ 1 balon; (d) ölümde sessizlik kuralı (T3): balon 1 düz, balon 2 kuru, balon 3 sıcak.

### 4.3 Örnek replikler — 10 TR, aynı 10 durum EN (transcreation)

| # | Durum | TR | EN |
|---|---|---|---|
| 1 | Açılış | Kolonya? Al. Bu seferde bedava olan tek şey bu. | Coffee? Take it. It's the only free thing on this trip. |
| 2 | Hayatlar arası hafıza | Üçüncü seferin. Hatırlamıyorsun, ben hatırlıyorum. İkisinde de 23'ünde kripto aldın. Defterde yazıyor. | Third trip. You don't remember; I do. Both times you bought crypto at twenty-three. It's in the book. |
| 3 | Ölüm, 2. balon | Son durak. 61. Cenazeye 44 kişi geldi, 9'u otobüsü kaçırdı. | Last stop. Sixty-one. Forty-four people at the funeral; nine of them came for the parking. |
| 4 | Bagaj ekranı | El bagajı: bir termos, bir referans mektubu. Geçen seferden kalan utanç bedava; bagaja sayılmaz. | Carry-on: one thermos, one reference letter. The embarrassment from last trip flies free. |
| 5 | Haftanın Seferi | Bu hafta herkes aynı otobüste. Aynı yol, aynı çukurlar. Fark direksiyonda değil, kararlarında. | This week everyone rides the same bus. Same road, same potholes. The difference isn't the driver; it's your choices. |
| 6 | Dürüst near-miss | Peşinata 3.400 lira kaldı. Üç bin dört yüz. Yuvarlamıyorum; yuvarlasam ev olurdu. Gelecek yıl aynı kapı, daha açık. | You were 3,400 short on the down payment. Three thousand four hundred. I don't round; if I rounded, you'd own a house. Same door next year, a little more open. |
| 7 | Geri dönüş (9 gün) | Dokuz gün yoktun. Otobüs bekledi. Şoför kızgın. Ben değilim; defteri doldurdum. | Nine days. The bus waited. Driver's upset. I'm not; I caught up on the paperwork. |
| 8 | İflas → kaldırış | İflas. Bagaj aynı, cep boş. Yolculuk devam ediyor; bilet tek yön ama uzun. | Bankrupt. Same luggage, empty pockets. The trip goes on; it's one-way, but it's long. |
| 9 | Yıl Sonu Karnesi | Bu yıl: 1 iyi, 4 kötü, 1 tuhaf şey. Net: yaşıyorsun. Bazı yolcular bunu bile beceremiyor. | This year: one good thing, four bad, one weird. Net: you're alive. Some passengers can't even manage that. |
| 10 | Mola (oturum sonu) | Mola. Yirmi dakika deriz, kimse inanmaz. Git, su iç. Otobüs kaçmaz; ben buradayım. | Rest stop. We say twenty minutes; nobody believes us. Go drink some water. The bus won't leave; I'm here. |

Bonus (efsanevi sürpriz, nadir havuz): TR *"Bunu deftere yazıyorum. Kalemle. Kalemi kimseye vermem."* · EN *"That's going in the book. In pen. I don't lend the pen."*

## 5. İlk 60 saniye

İlke: onboarding yok; oyun muavinin ilk cümlesiyle başlar (T8). Roguelike farkı: **ilk hayat bir "Tanışma Seferi"dir** — ekspres (yılda 1–2 beat, koruma penceresi açık, 5. beat'e kadar garanti "great" sürpriz, en az 1 Teşhis garanti), 12–15 dakikada ölümle biter ve Terminal'i açar. Oyuncu ilk oturumda meta katmanı görür; D1 bunun üstüne kurulur.

| Saniye | Ekran | TR | EN |
|---|---|---|---|
| 0–3 | Siyah; otobüs kapısı sesi; tipografik bilet: "DEVRAN TURİZM · Sefer No: 1" | — | "DEVRAN TRANSIT · Trip No. 1" |
| 3–8 | Muavin balonu + 2 buton | **Kolonya?** [Uzat elini] [Yok, sağ ol] | **Coffee?** [Hold out your cup] [No, thanks] |
| 8–11 | Cevap (ilk kahkaha hedefi) | Alırsa: *Limon. Hayatındaki ilk doğru karar. Sonuncusu da olabilir.* Reddederse: *Reddettin. İlk kararın buydu. Not aldım.* | Takes: *Black. First good call of your life. Could be the last.* Declines: *Declined. That was your first decision. Noted.* |
| 11–20 | Tek ekran: rastgele saçma isim üreteci (3 karıştırma) + cinsiyet; buton "Bu olsun" | Muavin isme yorum: *Nilgün. Bir yolcumun adıydı. İnmesi gereken yerde inmedi.* | *Dakota. That's a state. You'll be one too.* |
| 20–26 | Bilet basılır (animasyon 400 ms) | *18 yaşındasın. Bilet tek yön. Bagajın yok; ilk seferde kimsenin olmaz.* | *You're eighteen. One-way ticket. No carry-on; nobody has one on their first trip.* |
| 26–40 | **İlk olay kartı** (ilk karar < 30 sn) | *Lise bitti. Annen "ne olacak bu çocuk" dedi. Yüksek sesle. Sana değil, komşuya.* [Sınava çalış] [İş bul] [Bir yıl "kendimi bulacağım"] | *High school's over. Mom said "what's going to become of this kid." Out loud. To the neighbor, not to you.* [Study for the exam] [Find a job] [Take a year to "find yourself"] |
| 40–48 | Sonuç; stat çubuğu "doğar" (T8 progressive disclosure); deadpan delta | *Keyif −4. Normal. Annen seni komşuya "düşünüyor" diye tanıttı.* | *Joy −4. Normal. Mom introduced you to the neighbor as "thinking about it."* |
| 48–55 | HUD'da 3 açık uç belirir (T1 §2.5): kısa / orta / uzun | Kısa: *Sınav 9 ay sonra* · Orta: *Evden çıkmak: %0* · Uzun: *Son durak: ? (Muavin biliyor, söylemiyor)* | Short: *Exam in 9 months* · Mid: *Moving out: 0%* · Long: *Last stop: ? (The Conductor knows. Isn't telling.)* |
| 55–60 | "Yaşlan" butonu (72 dp) + muavin | *19'a geçiyoruz. Kemer yok, tutun.* | *Nineteen's next. No seatbelts; hold on.* |

Devamı: ~90 sn'de ilk Yıl Sonu Karnesi + "Gelecek yıl:" teaser; ~4 dk'da ilk Teşhis; 12–15 dk'da ölüm → sessizlik kuralı → **Bilet Koçanı** → Miras Puanı tik-up → "Muavinden ilk kek": bedava ilk bagaj eşyası → **Terminal** açılır → "Bin" butonu.

## 6. Core loop

| Katman | Süre | Ne olur | "Bir daha" kancası |
|---|---|---|---|
| **Beat** | ~30 sn | 1 olay kartı (25–45 kelime) + 2–4 seçenek + muavin yorumu; stat delta | Sonuç belirsizliği 0,35–0,65 bandında (T11 3d gerilim normalizasyonu) |
| **Yıl** | 2–5 dk | Yıl başı pulse → 2–5 beat → **Yıl Sonu Karnesi** → "Gelecek yıl: {teaser}" → Yaşlan | Bekleyen sonuç kuyruğu 1–2 açık iplik (T11 3l) |
| **Oturum** | 12–15 dk | 3–6 yıl; her 10 beat'te "kolonya" rahatlama beat'i; director oturum sonunu sezince **Mola** anonsu + cliffhanger | Mola anonsu suçsuz kapanış; bildirim kopyası aynı teaser'dan türer |
| **Gün / hafta** | günlük 10–15 dk, Pazartesi yenileme | **Günün Seferi** (18→40 ekspres, tek sayılan deneme), 3 **Yol Görevi** (seed'li, biri absürt), **Haftanın Seferi** (herkes aynı otobüs) | Takvim gerçek; "Düzenli Yolcu" streak'i kararla sayılır, 2 Açık Bilet (freeze) |
| **Ömür** | 55–70 dk serbest; 12–20 dk ekspres | Hazard (Gompertz) + senaryo ölümleri; ölüm → Roast Raporu → Bilet Koçanı | Ölüm anı 40 sn'de yeni sefere bağlanır |
| **Ömürler arası** | 30–90 sn | **Terminal:** Miras Puanı, el bagajı toplama, Yolcu Defteri sayfası, Güzergah seçimi, Aile Bileti; "Aynı bagajla bin" tek dokunuş | Her ölümde garanti ≥ 1 açılım; "sonraki açılıma 38 MP" çubuğu; defterde kapanmamış sayfa |

## 7. İmza özellikler

**1. Terminal: ölüm ekranı = ana menü.** Uygulama devam eden hayat yoksa Terminal'e açılır: üstte split-flap kalkış panosu (Haftanın Seferi · Günün Seferi · Serbest Sefer · Güzergahlar · Aile Bileti), ortada koltuğun ve bagajın, altta tek büyük buton **"Bin"**. Ölümden yeni hayatın ilk kelimesine ≤ 40 sn (atlanabilir ölüm animasyonu 2 sn, Koçan 8 sn, MP tik-up 3 sn, bagaj 10–20 sn, "Bin" → 300 ms içinde ilk metin). "Aynı bagajla bin" tek dokunuşla Terminal'i 5 saniyeye indirir (Royal Match sürtünme dersi, T11).

**2. El Bagajı (Carry-on) ve Fazla Bagaj.** Kalıcı perk'ler bagaj eşyasıdır; yer sınırlı (1 → 2 → 3 → 4). Eşyalar güç değil **çeşitlilik ve küçük kanca** verir (T1 §2.7 "meta as variety"). İstemsiz bir eşya daha var: **Fazla Bagaj** — geçen hayatın en yüksek Cringe olayı etiket olarak yeni hayata biner ve 1 callback olayı açar ("Yüzün tanıdık geliyor. Bir düğünde... yok, olamaz."). Fazla bagaj atılamaz, satın alınamaz, cezası yok; yalnızca içeriktir. Aynı etiket 3 hayat üst üste binerse "Alışkanlık" Teşhisi.

**3. Yolcu Defteri + Tekrar Eden Yolcular.** Anlatıcı hafızası okunabilir bir defterdir: her geçmiş hayat bir bilet koçanı (yaş, ölüm nedeni, zirve kariyer, en büyük cringe, Teşhisler, muavinin tek satırı). Muavin yalnızca defterde yazan şeye gönderme yapar; oyuncu doğrulayabilir. 8 **Tekrar Eden Yolcu** (Anne, Ev Arkadaşı Barış, Patron Nevin Hanım, Eski Sevgili Deniz, Komşu Şükran Teyze, Dayı, Kedi Pamuk, Taksici) hayatlar arası `metaMemories` taşır: Deniz'i 2. hayatta terk ettiysen 3. hayatta ilk karşılaşma repliği değişir (Hades modeli). Lansmanda 150 meta-callback satırı + 8 × 6 NPC hafıza satırı.

**4. Haftanın Seferi: herkes aynı otobüste.** `lifeSeed = cyrb128('week:' + isoYearWeek + ':' + locale + ':' + contentHash)`; aynı başlangıç şehri, aynı statlar, haftaya özel 1 bagaj eşyası, aynı zar. Pazartesi 00:00 yerel saatte yenilenir (fresh start etkisi, T7). Backend yok; "sosyal" katman **dürüstçe etiketlenmiş** 40 hayali yolcudur: aynı seed'le cihazda simüle edilen 40 NPC hayatı, koltuk numarasıyla yerel tabloda ("14C: hayali Ayşe, 71'e kadar yaşadı. Sen 58. Hayali olmasına rağmen."). Paylaşım: **Bilet Koçanı** kartı (9:16 + 1:1) + seed kodu `SFR-7K3Q-9ZP`.

**5. Güzergahlar ve Aile Bileti.** Challenge modları birer hat: *Ekspres* (yılda 1–2 beat, 15–20 dk), *Gece Yolculuğu* (koruma penceresi yok, hazard ×1,3, MP ×1,5), *Beş Lira ve Bir Kedi* (0,05 AÜ ile başla), *Sessiz Sefer* (muavin yalnızca yıl sonunda konuşur; ironik perk, Teşhis "Kulaklıklı"). *Aile Bileti*: ölürken yaşayan çocuk varsa onunla devam; miras tek kural: varlık −%30 ("veraset" esprisi), 1 bagaj eşyası bedava devrolur, eski karakter hayalet-NPC olarak anılarda yaşar; 5 kuşak = Soy Ağacı paylaşım kartı.

## 8. Sistemler özeti (yalnızca açının değiştirdiği yerler; gerisi T4)

**Stat seti, director, kariyerler, ilişkiler, ekonomi, Gompertz hazard:** T4 §3 aynen. Tek fark: gizli "Karma" statının adı motorda ve içerikte **Şans** (dinî çağrışım sıfır; UI'da zaten görünmez).

**Miras Puanı (MP) ekonomisi — T11 3(g) formülleriyle:**

| Öğe | Formül / değer | Not |
|---|---|---|
| Hayat skoru | `Σ yearScore × (1 + 0,3·ln(1 + yıl/20))` | T11; uzun yaşam ödül, lineer değil |
| MP | `floor(25·log2(1 + lifeScore/2000))` | Tanışma Seferi ≈ 16 MP; tipik serbest sefer 40–58 MP |
| Kilometre (prestige) | Tüm hayatlarda yaşanan yıl toplamı; eşikler 100/250/500/1.000 km | Çarpan `1 + 0,08·√P` yalnızca **başlangıç seçeneklerine** (dükkânda sunulan eşya sayısı, şehir seçenekleri) |
| Bagaj yeri | 2. yer 60 MP, 3. yer 180 MP, 4. yer 400 MP | 2. yer ortalama 2. ölümde açılır (goal gradient) |
| Eşya fiyatı | 20–120 MP | Hiçbir eşya parayla satılmaz |
| Güzergah | 80–250 MP; Aile Bileti 3. hayatta bedava (şart: yaşayan çocuk) | Güzergahlar director sabitlerini değiştirir, içerik havuzunu filtreler |
| Garanti | Her ölümde ≥ 1 açılım; MP yetmiyorsa **Kayıp Eşya** bürosu rastgele bir eşya verir (bedava, deterministik seed) | Para değmediği için loot-box rejimi dışında |
| Ekspres çarpanı | MP ×0,8 | Hız cezalandırılmaz, yalnızca ödül dengelenir |

**El Bagajı eşyaları (lansman, 12):**

| Eşya (TR / EN) | Etki | Muavin satırı (TR) |
|---|---|---|
| Annenin Termosu / Mom's Thermos | 28 yaş sonrası 1 kez "anne borç verdi" kurtarması (normalde yalnızca koruma penceresinde) | "Termos. İçinde çorba değil, kefalet var." |
| Referans Mektubu / Reference Letter | Seçilen kariyere 2. basamaktan başla | "Mektup. Yazan kişi seni tanımıyor; sistem de tanımıyor, ödeşti." |
| Ehliyet / Driver's License | Ehliyet olayı atlanır; Kurye/Dolmuş erken açılır | "Ehliyet. Direksiyon hâlâ bende, bilgin olsun." |
| Kedi Pamuk / Biscuit the Cat | Başlangıçta kedi NPC: Keyif +3/yıl, "kedi seni tanımıyor" callback'leri | "Kedi sana tahammül ediyor. Bu bir ilişki." |
| Eski Telefon / Old Phone | Geçmiş hayattan Deniz bir kez mesaj atar (hayatlar arası NPC) | "Rehberde bir isim var. Sen eklememiştin." |
| Kolonya Şişesi / Bottle of Cologne | İlk 6 beat'te garanti "great" sürpriz | "Limon. Erken açıyoruz bu sefer." |
| Kulaklık / Headphones | Roast satırları %50 azalır (ironik perk) | "Takmışsın. Konuşmaya devam ediyorum, duymuyorsun. Alıştım." |
| Pusula / Compass | 10 yıl boyunca seçeneklerde başarı yüzdesi görünür | "Yüzdeler. Bilmek yapmaya yetmez; denedik." |
| Dayının Kartviziti / Uncle's Business Card | 1–5. yılda garanti 1 iş teklifi | "Torpil değil. Tanıdık. Aradaki fark: biri utanmaz." |
| Nazar Boncuğu / Lucky Charm | Gizli Şans +10 (±%10 tavan içinde) | "Boncuk. İşe yarıyor mu? Yarıyor sanan daha iyi oynuyor." |
| Tencere / The Pot | Ev yemeği olayları: Sağlık +2/yıl; Esnaf yolu erken | "Tencere. En ucuz terapi." |
| Eski Defter / Old Notebook | Hayat içinde Yolcu Defteri okunabilir; callback olasılığı ×2 | "Kendi defterin. Benimki kadar dürüst değil." |

**Ölüm:** T4 hazard ve neden tablosu aynen; **Devran otobüsü hiçbir ölümün nedeni değildir** (metafor kazaya girmez). Ölüm ekranı sırası: sessizlik (2 sn) → özet sayılar → Teşhisler → Bilet Koçanı → MP → Terminal.

**Haftalık/günlük seed:** T4 §5.1 kuralı + `locale` bileşeni (TR ve EN havuzları farklı; "herkes" = aynı dildeki herkes) + haftaya özel eşya ve kısıt (T7 "Temalı Hafta").

## 9. Retention ve dopamin planı

| Mekanik (T1/T11) | Bu konseptteki yüzü | Sayılar |
|---|---|---|
| Pity'li iyi sürpriz motoru (3a) | Muavin "Bak sen." / "Bunu deftere yazıyorum." | base 0,08, soft 8, hard 14; Tanışma Seferi'nde 5. beat'e kadar garanti great |
| Pacing director (3c) | Her 10 beat'te **kolonya** rahatlama beat'i; oturum sonu **Mola** anonsu + cliffhanger | MAX_NEG_STREAK 2, LOL 12±3, RELAX 10 |
| Bekleyen sonuç kuyruğu (3l) | Yıl sonu teaser + **hayat ötesi iplik**: defterde kapanmamış sayfa ("Deniz bir sonraki seferde seni hatırlayacak") | 1–2 açık iplik/yıl, 1 açık iplik/hayat |
| Koleksiyon (3e) | **Teşhis** damgaları Yolcu Kartı'nda, anında verilir; 4 tier sim-kalibreli | 30 lansman → 60 (3. ay) → 120 (1. yıl) |
| Number go up (3g) | MP + Kilometre; çarpan içerik açar, güç vermez | log/√ eğrileri, eşik ×1,18 |
| Novelty (3h) | Hayatlar arası `seenCount`; Güzergahlar havuzu filtreler, aynı 700 olay yeni hissettirir | ilk 3 hayatta tekrar < %15 |
| Streak (3f) | **Düzenli Yolcu**: kararla sayılır; 2 **Açık Bilet** (freeze), 48 sa onarım oyunla | kilometre taşları 7/30/100 |
| Churn heuristiği (3j) | "Otobüs bekledi" welcome-back; ödül sabit, büyümez | tier eşikleri 0,25/0,5/0,8 |
| Meta-progression (T1 §2.7) | Her ölümde ≥ 1 açılım (Vampire Survivors kuralı); Kayıp Eşya pity | 100 % |
| Welcome-back + LTE (T1 §2.10–2.12) | Haftanın Seferi Pazartesi; takvim gerçek | 16 hafta içerik, +4/güncelleme |

"Bir sefer daha"nın mühendisliği: ölüm ekranı kayıp değil **kazanım** gösterir (MP, Teşhis, açılım, defter sayfası, sonraki eşiğe kalan). Terminal'de üç ilerleme çubuğu aynı anda görünür (sonraki bagaj yeri, haftanın seferi en iyi skoru, Teşhis koleksiyonu) — Monopoly Go'nun paralel ilerleme dersi, backend'siz.

## 10. Monetizasyon kancaları (etik, muavin sesinde)

| Kanca | Ne | Fiyat/limit | Muavin satırı TR / EN | Neden etik |
|---|---|---|---|---|
| **Torpil** (tek seferlik) | Interstitial yok; Yolcu Defteri sınırsız sayfa (ücretsizde son 12 sefer); HD/animasyonlu Bilet Koçanı; 2 kozmetik bilet teması; Açık Bilet tavanı 3 | ~$6,99 (TR PPP ayrı) | "Torpil. Tanıdığımsın artık. Koltuk aynı, reklam yok." / "Connections. You know a guy now. Same seat, no ads." | Güç/MP/bagaj yeri satmaz; sabit içerik |
| **Muavine çay ısmarla** (rewarded video) | Terminal'de: bu sefer için 1 geçici bagaj yeri · Ölümde: bu seferin MP'si +%25 | günde ≤ 3; asla streak onarımı, asla ölümden dönüş | "Çay. İkram sayılır, rüşvet değil; hukuken fark var, sorma." / "Tea. Counts as hospitality, not a bribe. Legally distinct. Don't ask." | Sabit, açık değer; aciliyet yok; özel kurgusal çalışan |
| **Interstitial** | Yalnızca Mola anonsunda, hayatın 3. yılından sonra, ≥ 8 dk arayla; ölüm/Roast Raporu'nda asla | — | "Mola. Reklam var. Ben de izlemiyorum." / "Rest stop. There's an ad. I don't watch them either." | BitLife'ın en çok şikâyet edilen noktasının tersi |
| **Sefer Paketleri** (sabit içerik) | Yeni güzergah + 120 olay + 10 Teşhis + 2 eşya | $2,99–4,99; sezonluk | "Sahil hattı açıldı. Deniz var, kira da var." / "Coastal line's open. There's a sea. There's also rent." | İçerik sabit, rastgelelik satılmaz |

**Satılmayanlar:** Miras Puanı, bagaj yeri, Teşhis, haftalık skor, ölümden dönme, streak. Haftanın Seferi'nde adalet seed'den gelir; paralı avantaj seed'i kirletirdi.

## 11. İki dil (TR/EN) yaklaşımı

- **Persona sabit, araç değişir:** TR muavin (otobüs, kolonya, kek, mola), EN night-line conductor (kahve, bilet zımbası, rest stop). UI motifi ikisinde de **bilet ve kalkış panosu**; sanat yönü ayrışmaz.
- **Terimler transcreation tablosundan:** Sefer/Trip, El Bagajı/Carry-on, Fazla Bagaj/Excess Baggage ("emotional baggage" çift anlamı iki dilde de bedava), Yolcu Defteri/Passenger Log, Teşhis/Diagnosis, Miras Puanı/Legacy Points, Açık Bilet/Open Ticket, Son Durak/Last Stop, Torpil/Connections.
- **Haftanın Seferi locale'e bağlı:** seed'e `locale` girer; TR ve EN oyuncular farklı havuzlardan aynı yapıda hayat yaşar. Locale-only olaylar (askerlik ↔ student loans) T10 kuralıyla **ikame**, çeviri değil.
- **Tekrar Eden Yolcular locale başına isim havuzu:** Deniz ↔ Sam (cinsiyetsiz), Şükran Teyze ↔ Mrs. Dale, Pamuk ↔ Biscuit. Hafıza etiketleri ortak, replikler ayrı yazılır.
- **Teşhis adları iki dilde ayrı yazılır** ("Kronik Erteleyici" ↔ "Chronic Postponer"; "Annesinin Avukatı" ↔ "Mom's Attorney").
- Pipeline T10: intent spec → iki dilde native realization → funny-check 3/5 → EN punch-up (publisher demosuna girecek 200 olay + 150 meta-callback).

## 12. Hukuki / politika güvenliği (T9 kırmızı çizgileri)

Bilerek kaçınılan 5 cazip fikir:

| # | Cazip fikir | Neden hayır | Yerine |
|---|---|---|---|
| 1 | Gerçek otobüs firması parodisi, otobüs kazası ölümü ("absürt kuyruk" için çok uygun) | Gerçek marka (T9 #11) + Türkiye'de otobüs kazaları gerçek acı (Apple 1.1.7 / Sensitive Events) | Kurgusal "Devran Turizm"; Devran otobüsü hiçbir ölümün nedeni değil |
| 2 | "Reenkarnasyon", "ahiret", "karma" dili — meta katmanı anlatmak için en kolay kelimeler | Din/inanç göndermesi (TCK 216, Apple 1.1.5) | "Yeni sefer", "son durak", "Şans" (gizli stat) — tamamı ulaşım dili |
| 3 | Rewarded ad'i "rüşvet" olarak adlandırma (sahibin seed'i) | Rüşvet kamu görevlisi suçu çağrışımı; muavin özel çalışan olsa da UI'da "rüşvet" kelimesi gereksiz risk | "Çay ısmarla / ikram"; şaka tek satırda ve kendini yalanlar |
| 4 | "Bu hafta 12.400 yolcu bindi" sayacı — haftalık seferi canlı göstermek için | Sahte sosyal kanıt = karanlık tasarım (Reklam Kurulu, DMCC) | 40 **hayali** yolcu, her kartta "hayali" etiketiyle |
| 5 | Gece Yolculuğu'nda "intihar/kendine zarar" ölüm nedeni; Müteahhit kariyerinde "deprem yönetmeliği" olayı | TCK 84/3 + Google Play self-harm; güncel felaket (Apple 1.1.7) | Gece Yolculuğu yalnızca hazard çarpanı; Müteahhit olayı "ruhsat kuyruğu" ile değiştirilir |

Ek güvenlik: alkol/sigara yalnızca sonuçla ve asla bagaj eşyası değil; simüle kumar yok (Kripto Gurusu zarı anlatı olayı, mini oyun değil); isim girişinde gerçek kişi/küfür filtresi; "Gerçek hayatta yardım" ekranı Terminal ayarlarında; mağaza metadata'sı "vitrin havuzu"ndan; IARC 16+ "en yüksek içerik" ilkesiyle.

## 13. MVP kapsamı (vertical slice) ve içerik hacmi

**Dikey kesit (8–10 hafta, solo dev + AI ajanlar):** engine (`runYear`, director, hazard, T11 3a/3c/3l/3g) · Terminal (pano, bagaj, "Bin") · Tanışma + Serbest + Ekspres sefer · El Bagajı (2 yer, 12 eşya) · Yolcu Defteri + koçan kartı paylaşımı · 8 Tekrar Eden Yolcu · Haftanın Seferi + 40 hayali yolcu · Günün Seferi · streak + bildirim · 30 Teşhis · TR + EN · tone-lint + 10.000 hayat sim harness.

| İçerik | MVP | Lansman | Not |
|---|---|---|---|
| Olay (storylet) | 350 (60'ı meta/hayatlar arası) | 700 + 40 zincir | T4 hedefi; her olay 2–3 metin varyantı |
| Anlatıcı yorumu | 1.000 satır | 2.100 | T3 varyant kuralı (sık ≥ 8, orta ≥ 5) |
| Meta-callback (defter) | 150 | 300 | `preconditions.meta` ile |
| Tekrar Eden Yolcu hafıza satırı | 8 × 3 = 24 | 8 × 6 = 48 | iki dilde ayrı |
| Teşhis | 30 | 60 → 120 (1. yıl) | tier'lar sim ile |
| Bagaj eşyası | 12 | 20 | |
| Güzergah | 3 (Tanışma, Serbest, Ekspres) | 7 (+Gece, Beş Lira, Sessiz, Aile) | |
| Kelime (iki dil toplam) | ~90.000 | ~200.000 | EN punch-up bütçesi T10: 4–10 K USD |

## 14. En büyük 3 risk ve azaltma

| Risk | Belirti | Azaltma |
|---|---|---|
| **Meta katman casual hayat-sim oyuncusunu ürkütür** (BitLife kitlesi menü istemez) | İlk ölümden sonra Terminal'de kalma süresi > 60 sn, "Bin" oranı < %50 | Terminal tek ekran, tek büyük buton; "Aynı bagajla bin" tek dokunuş; bagaj yeri 2 ancak 2. ölümde görünür (progressive disclosure); ilk 3 hayatta Güzergahlar kilitli |
| **"Bir sefer daha" "bir yıl daha"yı yer** (MP için hızlı ölmek cazip gelir, hayatlar kısalır, içerik yanar) | Serbest seferde medyan ölüm yaşı < 60; 1 haftada > 8 hayat | MP eğrisi yaşanan yıla log çarpanı verir; Ekspres ×0,8; Teşhislerin %70'i 40+ yaşta açılır; sim harness kabul kriteri "medyan ölüm 72–80, lives/week 2–4" |
| **Hayatlar arası içerik yetmez, hafıza "aynı 10 cümle"ye döner** | 5. hayatta meta-callback tekrar oranı > %40 | Novelty (3h) hayatlar arası; 150 → 300 meta satırı; Güzergahlar havuzu filtreler; `metaLog` 12 alanlı (ölüm nedeni, kariyer, cringe, NPC'ler...) → kombinatoryal satır üretimi; "defterde yazıyor" satırları slot'lu |

## 15. Publisher neden evet der / neden hayır der

**Evet:**
- **Boş raf:** hayat simülasyonu + roguelike meta ekonomisi hiçbir rakipte yok; BitLife'ın ribbon'u var, run/meta döngüsü yok.
- **D30 kaldıracı yapısal:** publisher'ların narrative türde en çok korktuğu metrik (D30 ≥ %8) Miras Puanı eşikleri, Haftanın Seferi takvimi ve Aile Bileti ile tasarımın içinde; aynı 700 olay bagaj/güzergah/hafıza ile çarpılır → içerik maliyeti başına retention yüksek.
- **Sunucusuz live-ops ve viral birim:** deterministik haftalık sefer + Bilet Koçanı kartı + seed kodu; sıfır backend maliyeti, "dopamin var, dolandırıcılık yok" hikâyesi (T11 §5.3) regülasyon riskini düşürür.

**Hayır:**
- **Karmaşıklık algısı:** hybrid-casual publisher "Terminal, bagaj, güzergah" duyunca "mid-core" der; CPI kreatifi ilk 30 saniyeyi sade göstermeli.
- **Monetizasyon tavanı:** MP, bagaj yeri ve ölümden dönüş satılmıyor; ARPDAU, BitLife'ın God Mode/Time Machine tipi "güç satışı" yapan rakiplerin altında kalabilir. Cevap: Torpil + paket + rewarded; abonelik 2. faz.
- **Mizah ihracı:** EN'nin "çevrilmiş Türkçe" kokması riski publisher demosunda 5 dakikada anlaşılır; 200 olay + 150 meta satırı profesyonel punch-up'tan geçmeden demo yapılmaz.
