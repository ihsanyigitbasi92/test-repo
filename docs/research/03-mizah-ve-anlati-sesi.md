# T3 — Mizah, Kara Komedi ve "Taşak Geçen ama Motive Eden" Anlatıcı Sesi: Ton Kitabı Araştırması

**Proje:** Backend'siz, offline-first, Türkçe-öncelikli (EN transcreation ilk günden) mobil hayat simülasyonu; 18 yaşından ölüme. Ton: kara komedi + roast + gizli motivasyon.
**Konu ID:** T3 · **Tarih:** 2026-11-05 · **Durum:** Araştırma v1 (ağ kısıtı: bu oturumda yalnızca developer.apple.com doğrudan çekilebildi; diğer kaynaklar bilinen birincil kaynaklardan ve kardeş dokümanlardan (T1, T2, T4, T7, T8) alınarak **[B]** etiketiyle işaretlendi — "Varsayımlar ve kaynak notu"na bakınız.)
**Bu dokümanın işi:** Anlatıcının sesini, mizah tekniklerini, kırmızı çizgileri ve içerik üretim kurallarını, yazarın (insan + AI ajanı) her gün bakacağı tek bir referansa indirmek.

---

## TL;DR

1. **Mizahımızın bilimsel çekirdeği "iyi huylu ihlal"dir (benign violation, McGraw & Warren 2010):** bir satır ancak aynı anda hem "sınır aşımı" (iğne, sertlik) hem de "güvenli" (oyun, rıza, sevgi) ise güldürür. Roast'un her satırı bu iki koşulu da sağlamak zorunda; birini kaçırırsan ya sıkıcı ya da yaralayıcı olursun.
2. **Roast'un hedefi oyuncunun *kararları ve durumu*, asla *kimliği ve değeri*.** Humor Styles araştırması (Martin ve ark. 2003; Schneider ve ark. 2018 meta-analizi) net: ilişkiyi güçlendiren (affiliative) ve kendini yükselten (self-enhancing) mizah iyi oluşla pozitif, saldırgan ve kendini yıkan (self-defeating) mizah negatif ilişkili. Bizim anlatıcı "saldırgan görünen affiliative" olacak: Keltner'ın "prososyal takılma" (prosocial teasing) modeli — abartı, oyun işaretleri ve ilişki sıcaklığı.
3. **Motivasyon formülü = "wise feedback" (Yeager 2014) + öz-şefkat (Breines & Chen 2012):** "Yüksek standartlarım var VE buna ulaşabileceğini biliyorum" çerçevesi, salt eleştiri ve salt övgüden daha çok çaba üretir. Anlatıcı her roast'u (açık ya da örtük) bir "ama yapabilirsin, çünkü…" ile kapatır; kapatmıyorsa bile oyuncuya bir sonraki adımı bırakır. Toksik pozitiflik yok, "cici koç" yok.
4. **SDT (Deci & Ryan) bizim ton için bir yazarlık kuralı:** kontrol eden dil ("yapmalısın", "zorundasın", suçluluk) özerkliği baltalar ve içsel motivasyonu düşürür; bilgi veren, seçenek bırakan dil ("ben olsam… ama sen bilirsin") yükseltir. Push bildirimlerimiz Duolingo'nun 2019 meme'leşen "artık sana hatırlatma göndermeyeceğiz" satırını çalışır, suçluluk makinesini çalışmaz.
5. **Sistemik mizah, yazılı mizahtan farklı bir disiplindir.** Prosedürel üretimde hayatta kalan 15 teknik var (deadpan stat raporu, üçleme, bathos, callback, sayaç tipi running gag, absürt hassasiyet, bürokrasi tercümesi, "oyun seni yargılıyor" meta-yorumu, mad-libs slot'ları, nadir-olay ödülü vb.). Hepsi bu belgede şablon + implementasyon notuyla var.
6. **Tekrar yorgunluğu bir yazarlık değil, mühendislik sorunudur:** sık görülen her satır için ≥ 5 varyant, orta sıklık için ≥ 3; satır-bazlı "son görülme" cooldown'u; şaka-tipi bazlı global cooldown (aynı yılda iki bathos yok); bağlam etiketleri (yaş bandı, stat durumu, ilişki, ruh hali); "en spesifik kural kazanır" (Elan Ruskin, Valve) + "random best least-recently-viewed" (Yarn Spinner) seçimi. Hades'in 300.000+ kelimeyle "aynı satırı iki kez duymazsın" hissi bu mekanizmayla üretildi.
7. **Türkçe mad-libs'in gizli maliyeti ekler:** "{isim}'e / -a / -ye" gibi slot'lar ünlü uyumu, ünsüz yumuşaması ve kesme işareti kuralları yüzünden ICU MessageFormat'la çözülmez. Küçük bir `tr-suffix` kütüphanesi (yaklaşık 150 satır) ve "slot'u cümle sonuna koy" yazarlık kuralı zorunlu. Bu kütüphane olmadan şablon mizahı Türkçede "komik değil, bozuk" görünür.
8. **Apple 1.1.1'deki hiciv muafiyeti bizi kapsamaz** ("Professional political satirists and humorists are generally exempt") — biz profesyonel siyasi hicivci değil, oyunuz. Dolayısıyla: gerçek kişi yok, siyaset yok, din yok, etnik/cinsel kimlik yok, güncel felaket yok (1.1.7), "eğlence amaçlı" savunması işe yaramaz (1.1.6). Google Play'in nefret söylemi politikasında hiciv muafiyeti hiç yoktur.
9. **İntihar/kendine zarar: oyuncu eylemi olarak ASLA.** Google Play Şiddet politikası self-harm/intihar/yeme bozukluğu teşvikini açıkça yasaklar; Apple 1.1 "upsetting" + 1.4 "physical harm" altında reddeder. Depresyon bir *durum* olarak var olacak (gerçekçi ve motive edici), ama çıkış yolları eylem olarak sunulacak; WHO/Samaritans güvenli anlatım ilkeleri (yöntem yok, çözüm olarak sunma yok, yardım hattı var) uygulanacak.
10. **Hedef yaş derecesi: Apple 16+ / PEGI 16 / ESRB T.** Küfür "sansürlü" (The Good Place'in "forking shirtballs" numarası kendi başına espri), alkol/sigara/uyuşturucu "sonuçlu ve özendirmeyen", cinsellik "kapı kapalı", kumar "piyango olayı var, kumar mini oyunu yok". Opt-in "+18 ağız" modu bile derecelendirmeyi 18+'a iter; yapmıyoruz.
11. **Anlatıcı adayı: "Felek" — Sertifikasız Hayat Koçu.** Türkçede "feleğin sillesi/çemberi" deyimlerinin yüküyle gelen, hem seni yere seren hem kaldıran kader figürü. Alternatifler: "Koç" (T8'in çalışma adı; EN'de doğrudan "Coach"), "Sistem" (bürokratik). EN için "Fate" düz kalıyor; T10 kararı: muhtemelen "Coach" ya da "The Narrator" + "uncertified life coach" alt başlığı.
12. **Ses kuralı özetle:** 2. tekil şahıs, kısa cümleler, "Eh." / "Neyse." gibi tek kelimelik vuruşlar, bürokrasi dili kontrast için, absürt hassasiyette sayılar, emoji sıfır (anlatıcı metninde), "(bkz: 2029, Kripto)" formatlı callback'ler. Üzgün anlarda "sessizlik kuralı": ilk balon şakasız, ikinci kuru, üçüncü sıcak; ölen NPC'nin değeri asla şaka konusu değil, bürokrasi/evren/trafik şaka konusu.
13. **Türk mizahından ihraç edilebilen: absürdizm (Gibi, Leyla ile Mecnun), bürokrasi parodisi (Zaytung), aile baskısı (evrensel ama ayrıntı yerel), ekonomik prekarite (enflasyon şakaları ABD'de "faiz/kredi" şakasına dönüşür).** İhraç edilemeyen: kelime oyunu, siyasi gönderme, inci/caps dili, yerel ünlüler, askerlik (yerel renk olarak kalır, karşılığı yok).
14. **Ölçüm:** Time-to-first-laugh < 20 sn (kullanıcı kriteri; T8 proxy hedefi < 10 sn), satır başına "😂/🙄 tepkisi" oranı, "bu satırı gördüm" tekrar şikâyeti oranı, lokal "kahkaha günlüğü" playtest'i (sesli düşünme, 5–8 kişi, RITE). Mizah ölçülmeden gönderilmez.

---

## Varsayımlar ve kaynak notu

- **Kaynak etiketleri:** **[F]** = bu oturumda doğrudan çekildi ve alıntı birebir; **[B]** = bilinen birincil kaynak (makale/politika/talk), bu oturumda ağ kısıtı nedeniyle doğrulanamadı, sayılar yaklaşık ve sprint öncesi doğrulanmalı; **[K]** = kardeş doküman (T1/T2/T4/T7/T8).
- Web araması bu turda kota nedeniyle çalışmadı; developer.apple.com dışındaki hostlar (support.google.com, en.wikipedia.org, esrb.org, globalratings.com, pmc.ncbi.nlm.nih.gov, gdcvault.com, arxiv.org, apps.apple.com, blog.duolingo.com) oturumun ağ politikasında kapalıydı. Bu yüzden Google Play politika metni, ESRB/PEGI tanımları ve akademik sayılar belleğe/sektör bilgisine dayanır ve "Açık sorular"da doğrulama maddesi olarak listelendi.
- Oyun yapısı T4/T8 ile uyumlu varsayıldı: 1 tur = 1 yaş, yıl içinde 2–5 "beat", sohbet/feed tarzı Hayat Akışı, anlatıcı balonları (sol), oyuncu seçimleri (sağ), olay kartı + 2–4 buton.
- Stat isimleri henüz kesin değil (T4: Sağlık/Keyif/Kafa/Çekicilik + Ego/Cringe/Anne Baskısı; T8: Mutluluk/Sağlık/Zekâ/Görünüm + gizli İtibar). Bu belgede örnek satırlar T4 setini kullanır; isim değişirse satırlar slot'ludur, bozulmaz.
- Anlatıcı tek sestir (çoklu "skill voice" Disco Elysium modeli ilk sürümde yok; 2. fazda "Anne" ve "İK" ikincil sesler olarak eklenebilir).
- Hedef yaş derecesi 16+; içerik ekibi = 1 insan + AI ajanları; her satır "tone-lint" (T4'te tanımlı) + insan kürasyonundan geçer.
- EN dili ilk günden birinci sınıf (Çalışma Günlüğü kararı). Bu belge Türkçe sesi kurar; EN sesinin ayrıntısı T10'da. Bölüm 5d yalnızca "Türkçe mizah EN'e nasıl taşınır" köprüsünü verir.

---

## 1. Oyunlarda ve etkileşimli kurguda komedi nasıl çalışır

### 1.1 Dört teori, tek tablo (yazarın günlük aracı)

| Teori | Ne der | Oyunda nasıl görünür | Bizde kullanım |
|---|---|---|---|
| **Uyumsuzluk-çözüm** (Suls 1972) | Beklenti kırılır, sonra "aa, mantıklıymış" ile çözülür | BitLife'ın "Kuduz bir sincap seni ısırdı" + düz stat raporu | Olay (saçma) + anlatıcı (düz) kombinasyonunun temeli |
| **İyi huylu ihlal** (McGraw & Warren 2010 [B]) | Komik = ihlal + güvenli, aynı anda | Portal'da GLaDOS'un "test" kibarlığıyla ölüm tehdidi | Roast kalibrasyonunun ana kuralı; "güvenli"yi rıza + sıcaklık + abartı sağlar |
| **Üstünlük** (Hobbes) | Başkasının düşüşüne güleriz | Reigns'te kralın saçma ölümü | Oyuncu kendi karakterine "yukarıdan" bakabilsin; anlatıcı oyuncuya değil karaktere güler, oyuncu da birlikte güler |
| **Rahatlama** (Freud/Spencer) | Gerilim boşalır | Papers Please/Frostpunk'ın kasvetinde tek bir absürt satır | Ölüm/iflas gibi ağır anlarda "üçüncü balon" sıcak şakası |

**Yazarın tek cümlelik kontrolü:** "Bu satırda ihlal var mı? Güvenli mi? Oyuncu karakteriyle birlikte mi gülüyor, yoksa oyuncuya mı gülünüyor?"

### 1.2 Oyun örnekleri: teardown

| Oyun | Komedi motoru | Çalan tek mekanizma | Bize ders |
|---|---|---|---|
| **The Stanley Parable** (Galactic Cafe 2013; Ultra Deluxe 2022) | Her şeyi bilen anlatıcı, itaatsizliğe tepki veriyor | Oyuncunun kuralı bozması = anlatıcının kırılması; "yanlış kapı" bir içerik kapısı | Anlatıcıya "kafa tutma" seçenekleri (T8: her olayda ≥1 "abi" seçeneği); anlatıcı oyuncunun sapmasını ödüllendirir |
| **Portal / Portal 2** (Valve; Wolpaw, Faliszek, Pinkerton) | Pasif-agresif kurumsal AI; vaat (pasta) + ihanet | "Kurumsal nezaket × ölümcül niyet" kontrastı; her ölüm bir şaka | **Bürokrasi/İK dili** bizim ana kontrast kaynağımız: "İK 'olumlu değerlendiremedik' dedi." |
| **Disco Elysium** (ZA/UM 2019) | 24 yetenek sesi, içsel tartışma, bathos | Başarısız zar atışı en komik sonucu verir: **başarısızlık = içerik** | Kötü sonuçlar en iyi yazılmış satırları alsın; oyuncu kaybetmekten korkmasın, merak etsin |
| **Reigns** (Nerial 2016) | Kaydır → orantısız absürt sonuç; ölüm deadpan anlatılır | "Mantıklı → mantıklı → saçma" zinciri; kısa metin, büyük sonuç | T5c'deki "Mantıklı Sonuç Zinciri" şablonu; ölüm kartları paylaşım malzemesi |
| **BitLife** (Candywriter 2018) | Deadpan sistemik metin; rastgelelik × düz ton | Olay saçma, ton muhasebeci; ribbon'lar kimlik şakası | Taban tonumuz bu, ama BitLife'ın "mizahı yüzeysel ve EN-merkezli" (T2 [K]) — biz karakterli anlatıcı ekliyoruz |
| **Undertale** (Toby Fox 2015) | Mizah + pathos; oyun geçmiş koşuları hatırlar | Meta-hafıza: "Bunu daha önce yaptın" | Anlatıcının **hayatlar-arası hafızası** (T4 legacy): "Üçüncü hayatında da 23'ünde kripto aldın." |
| **Untitled Goose Game** (House House 2019) | Yaramazlık; metinsiz; yapılacaklar listesi şakası | **Checklist'in kendisi şaka**: "Bahçıvana şapkasını giydir" | Görev/Teşhis isimleri şakanın kendisi olsun ("Kronik Erteleyici" [K T1]) |
| **Papers, Please** (Lucas Pope 2013) / **Frostpunk** (11 bit 2018) | Kasvetli bürokrasi; "Ama buna değdi mi?" | **Oyun seni yargılar**; mizah yok ama ton sertliği model | Yıl sonu karnesi + ömür sonu Roast Raporu'nda (T2 [K]) "yargılayan ama şefkatli" ses |
| **Dumb Ways to Die** (Metro Trains 2012; McCann) | Sevimli çizim × korkunç ölüm | **Sevimli sanat, karanlık içeriği derecelendirme-güvenli yapar** | Sanat yönü (T8: Notionists avatarlar) kara mizahı 16+'da tutmanın sigortası |
| **Cards Against Humanity** (2011) | Boşluk doldurma, kombinatoryal | En komik kombinasyon nadirdir ve oyuncu seçer: **kürasyon** | Slot şablonlarında "nadir-slot" ağırlığı + otomatik kombinasyonların tone-lint'i |
| **Lifeline** (3 Minute Games 2015) | Felaket içinde karakter sesi, sohbet balonu | Balon ritmi ve "yazıyor…" zamanlaması | T8'in "120 ms yazıyor…" kuralı; punchline ayrı balonda gelsin |
| **Kind Words** (Popcannibal 2019) | Koşulsuz nezaket | Roast'un tam tersi; "güvenli yer" hissi retention üretir | Bizim "üçüncü balon" sıcaklığı buradan: her roast'un altında bir Kind Words satırı saklı |
| **Cookie Clicker** (Orteil 2013) | Haber bandı, başarım flavor text, absürt sayılar | **Ticker**: "Haber: kurabiye fabrikaları grevde" | Zaytung tarzı yerel haber bandı (T5c şablon 12); sayıların absürt büyümesi |
| **Dwarf Fortress** (Bay 12) | Emergent komedi; "Kaybetmek eğlencelidir!" | Sistemler çarpışınca hikâye doğar (bira döken kediler); oyuncu anlatır | Mizahın bir kısmını **yazma, simüle et**: iki sistemin çarpışması (kira zammı × düğün × annenin ziyareti) |
| **The Sims** (Maxis 2000→) | Absürdizm; saçma ölümler; Simlish | Ölüm türleri paylaşılabilir içerik | Ölüm nedenleri listesine %5 absürt kuyruk (T4 [K]) + paylaşım kartı |

**Beş derin not:**

1. **Stanley Parable'ın gizli dersi "anlatıcı yanılabilir"dir.** Anlatıcı her şeyi bilir ama oyuncu onu şaşırtabilir; mizah bu güç dengesizliğinin ters dönmesinden çıkar. Bizde: anlatıcı tahmin eder ("Bu parayı 3 yılda bitireceksin"), oyuncu tahmini boşa çıkarırsa anlatıcı bunu kabul eder ("Haksızmışım. Not aldım. Bir daha olmaz."). Bu, oyuncuya özerklik (SDT) ve yetkinlik hissi verir ve anlatıcıyı sevilebilir kılar.
2. **GLaDOS'un sırrı tonun *tutarlılığı*dır.** Sesi hiç bozulmaz; tehdit bile "test protokolü" dilinde gelir. Tutarlılık, prosedürel üretimde en kırılgan şeydir; o yüzden ton kitabı (5a) kelime listesi ve yasak listesiyle gelir ve tone-lint CI'da çalışır.
3. **Disco Elysium'da bathos bir *sistem*dir:** yüksek dil ("Bu, insanlığın yüzyıllık acısıdır") → küçük gerçek ("Ayakkabının teki yok."). Prosedürel olarak üretilebilir: epik cümle havuzu × küçük gerçek havuzu, aynı olay etiketine bağlı.
4. **Reigns'in kartları kısa olduğu için komiktir.** 2 satır olay, 2 seçenek, sonuç 1 satır. Metin uzadıkça komedi zamanlaması ölür. Olay kartı 25–45 kelime (T1 [K]); punchline son 6 kelimede.
5. **BitLife'ın deadpan'ı "ucuz ama ölçeklenir".** 700+ olayı karakterli anlatıcı sesiyle yazmak pahalı; çözüm: olay metni BitLife-deadpan (nötr, kısa, sistemik), **anlatıcı yorumu ayrı katman** (şablonlu, bağlam etiketli, nadir). Böylece 700 olay × 5 yorum varyantı = algılanan 3.500 "anlatıcı anı" olur.

### 1.3 TV ve stand-up ton referansları

| Referans | Alınacak | Alınmayacak |
|---|---|---|
| **BoJack Horseman** | Depresyonu ciddiye alıp etrafını komik yapmak; üzgün an üzgün kalır, şaka önce/sonra gelir ("sessizlik kuralı") | Nihilizmin kendisi; bizim motivasyon sütunumuz var |
| **Rick and Morty** | "Kimse bir amaç için var olmuyor… gel televizyon izleyelim" — kozmik kayıtsızlık içinde şefkat | Alaycılığın her şeyi yemesi; oyuncu "neden oynuyorum" dememeli |
| **Fleabag** | 4. duvar kırmanın bir *yakınlık* aracı olması; kırmanın durduğu an = ciddiyet | Sürekli göz kırpma; 4. duvar nadir (cooldown'lu) kalacak |
| **The Good Place** | "Forking shirtballs": evren içi sansür bir şaka; etik dersi mizahla | Felsefe dersi uzunluğu |
| **Black Books** | Düşmanca ama sevimli persona; tutarlılık her şeyi affettirir | Müşteriye (oyuncuya) gerçek aşağılama |
| **Gibi** | Gündeliğin mikro-absürdü (pazarlık, komşu, kargo, "mantıklı sonuç" skeçleri), deadpan | Yerel gönderme yoğunluğu (EN'e taşınmaz) |
| **Leyla ile Mecnun** | Sürreal + sıcak; running gag'ler (sabit yan karakterler) | Uzun tirat; mobilde zaman yok |
| **Cem Yılmaz** | Gözlem mizahı, abartılı karakter, uzun kurulum→büyük patlama | Türk olmak üzerinden kendini aşağılama EN'de "dışarıdan vuruş" okunur |
| **Gırgır / Leman / Uykusuz** | Tek kare punchline; abartılı yüz; sahte manşet | Siyasi/dinî içerik (kırmızı çizgi) |
| **Zaytung** | Sahte haber başlığı formatı; "yetkililer: '…'" | Gerçek kişi/kurum isimleri |
| **Ekşi Sözlük** | "(bkz: …)" callback formatı; kuru tanım mizahı | Entry uzunluğu; argo yoğunluğu |
| **Caps / inci** | Hız, kısalık | Dil (küçük harf, "cnm"), saldırganlık, 16+ dışı içerik |
| **Roast kültürü** (Comedy Central; "yalnızca sevdiklerimizi roast ederiz") | **Rıza + sevgi çerçevesi**: roastee gönüllü, salon onun tarafında | Hedefin kişisel özellikleri (fiziksel görünüm vb.) |

### 1.4 Türk mizahı: ne ihraç edilir, ne edilmez

| Malzeme | TR'de | Global'de | Karar |
|---|---|---|---|
| Absürdizm / deadpan | Gibi, Leyla ile Mecnun | Evrensel | Ana damar |
| Bürokrasi parodisi | e-Devlet, "Değerli Vatandaş", İK dili | DMV/HR/ToS parodisi | Ana damar; kurum adı slot'lanır |
| Anne baskısı | "Evlenmeyecek misin?" | Akdeniz/Asya/Latin kültürlerinde çok güçlü, Kuzey Avrupa'da zayıf | Ana damar; EN'de "Mom" + dozu düşür |
| Ekonomik prekarite | Enflasyon, kira zammı, asgari ücret | Öğrenci kredisi, kira, faiz | Mekanik evrensel, ayrıntı yerel (T4: nominal × enflasyon çarpanı) |
| Askerlik | Evrensel deneyim (TR erkek) | Karşılığı yok | TR'de yerel renk; EN'de "jury duty / internship" ile **değiştirilmez**, **farklı olay** yazılır |
| Kelime oyunu | Çok güçlü | Çevrilmez | Yalnızca yerel flavor; motor satırlarında yok |
| Siyasi/dinî gönderme | Güçlü | Yasak (Apple 1.1.1/1.1.5, Google) | Kırmızı çizgi |
| Yerel ünlüler | Güçlü | Anlamsız + hukuk riski | Kırmızı çizgi; "arketip" kullan ("bir ünlü şef") |
| Dolmuş / komşu / düğün takısı / helva | Çok güçlü | Egzotik ama anlaşılır | TR'de kal; EN'de "açıklama gerektirmeyen" alt küme |

### Bu oyuna nasıl uygularız

- **Üç katmanlı mizah mimarisi:** (1) Olay metni = BitLife deadpan (sistemik, çeviri dostu); (2) Anlatıcı yorumu = karakterli, şablonlu, bağlam etiketli (Stanley/GLaDOS); (3) Emergent = iki sistemin çarpışmasını anlatıcı fark eder ve yorumlar (Dwarf Fortress): "Aynı hafta: kira zammı, annenin ziyareti, terfi mülakatı. Takvim senden nefret ediyor."
- **"Başarısızlık = içerik" ilkesi:** en iyi satırlar kötü sonuçlara yazılır; iyi sonuçlar kısa ve kuru ("Oldu. Şaşırdım.").
- **Anlatıcının yanılma hakkı:** anlatıcı tahmin eder, yanılırsa itiraf eder; bu satırlar nadir havuzda (oyuncu "anlatıcıyı yendi" hissi, paylaşım tetikleyicisi).
- **TV referanslarından üç kural:** BoJack (üzgün an üzgün kalır), Fleabag (4. duvar nadir ve anlamlı), Good Place (sansür bir şaka → derecelendirme sigortası).
- **Türk malzemesini ikiye böl:** "çekirdek evrensel" (absürt, bürokrasi, aile, para) motor seviyesinde; "yerel renk" (dolmuş, helva, askerlik) locale paketinde.

---

## 2. Roast + motivasyon karışımı: kanıt ne diyor

### 2.1 Ürün örnekleri

| Ürün | Sesi nasıl yazıyor | Ne öğretiyor | Para |
|---|---|---|---|
| **Carrot Weather** (Brian Mueller, 2015→) [B] | Tek yazar, binlerce replik; kişilik ayarı (Professional → Friendly → Snarky → Homicidal → Overkill) ve politik ton ayarı; hava durumu "düz veri" + persona "yorum" katmanı | **Snark seviyesi kullanıcı seçer → rıza mekanizması**; veri ile yorumun ayrılması bizim 3 katmanlı mimariyle aynı | Abonelik (Premium/Premium Ultra, yıllık), tahmini ~200 K$/ay (T2 [K], üçüncü taraf tahmin); 10 yıldır sarkastik persona ile yaşayan tek büyük tüketici uygulaması |
| **Duolingo** (Duo) [B] | Push bildirimleri çok-kollu bandit ile seçilir (Yancey & Settles, KDD 2020: "sleeping, recovering bandit" — tekrar eden bildirimlerde kopya seçimi); 2019'da "These reminders don't seem to be working. We'll stop sending them for now." satırı viral oldu ve marka "pasif-agresif baykuş" memini sahiplendi | Suçluluk değil **"vazgeçiyorum" tersliği** çalıştı: kullanıcı "ben kontrol edeyim" dedi (özerklik). 2025'te 52,7 M DAU, DAU/MAU %39,6 (T2 [K]) | Abonelik + reklam; streak/ bildirim kopyası A/B ile sürekli optimize |
| **Finch** [B] | Koşulsuz nazik kuş; asla roast yok; "bugün sadece su içtin, harika" | Kırılgan kullanıcı için "güvenli yer" retention üretir (~1 M$/ay, T2 [K]); **bizim tersimiz ama "üçüncü balon"umuz** | Abonelik |
| **Habitica** [B] | RPG; alışkanlık kaçırınca HP kaybı; metin kuru | Ceza mekaniğinin sınırı: kullanıcı HP kaybından yorulur, "cezasız roast" daha dayanıklı | Abonelik + kozmetik |

### 2.2 Araştırma: altı dayanak

1. **Humor Styles (Martin, Puhlik-Doris, Larsen, Gray & Weir 2003 [B]):** Dört stil — affiliative (bağ kuran), self-enhancing (kendini yükselten), aggressive (saldırgan), self-defeating (kendini yıkan). Meta-analiz (Schneider, Voracek & Tran 2018, Scandinavian J. Psychol. [B]): adaptif stiller iyi oluşla pozitif (yaklaşık r ≈ .2–.3), self-defeating negatif (yaklaşık r ≈ −.2 ila −.3), aggressive küçük negatif/anlamsız. **Çıkarım:** Anlatıcı oyuncuyu *kendini yıkan* bir pozisyona itmemeli ("ben beceriksizim"); oyuncuyu "biz ikimiz bu saçma hayata gülüyoruz" (affiliative) pozisyonuna çekmeli.
2. **İyi huylu ihlal (McGraw & Warren 2010, Psychological Science [B]):** Komik = ihlal + güvenli. Güvenliği sağlayan üç kol: psikolojik mesafe (karakter sen değilsin), alternatif norm (oyun dünyasında bu normal), zayıf bağlılık (ciddi değil). **Çıkarım:** Roast karaktere ve seçime yönelir; oyuncunun gerçek hayatına yönelen satırlar (push bildirimleri!) ihlali düşürüp güvenliği yükseltmeli.
3. **Takılma (Keltner, Capps, Kring, Young & Heerey 2001, Psychological Bulletin [B]):** Takılma bir "provokasyon + off-record işaretleyiciler" (abartı, taklit, tekrar, ton) kombinasyonudur; işaretleyiciler kuvvetliyse ve ilişki sıcaksa prososyal algılanır, bağ kurar. **Çıkarım:** Her roast satırı en az bir işaretleyici taşır (abartı: "47. başvuru", absürt hassasiyet, tekrar/sayaç) — düz "beceremedin" yasak.
4. **SDT (Deci & Ryan; Ryan & Deci 2000 [B]; Ryan, Rigby & Przybylski 2006 oyun çalışması [B]):** Kontrol eden dil (should/must, suçluluk, koşullu değer) içsel motivasyonu azaltır; bilgi veren geri bildirim yetkinliği besler; seçenek bırakmak özerkliği korur. **Çıkarım:** Yazım kuralı: "yapmalısın" yok; "ben olsam… ama sen bilirsin"; bildirimlerde "gel" emri yerine oyun-içi haber ("Annen 14 kez aradı").
5. **Öz-şefkat × motivasyon (Breines & Chen 2012, PSPB [B]; Neff [B]):** Başarısızlık sonrası öz-şefkat (kendine nazik olma) kendini geliştirme motivasyonunu artırır; öz-eleştiri azaltır. **Çıkarım:** Kayıptan sonra anlatıcı "sen"i değil "durumu" roast eder ve bir sonraki adımı küçültür ("Bugün tek bir karar ver").
6. **Wise feedback (Yeager ve ark. 2014, JEP: General [B]) ve süreç övgüsü (Mueller & Dweck 1998 [B]):** "Yüksek standartlarım var ve bunu karşılayabileceğini biliyorum" notu, aynı eleştiriyi alan öğrencilerde revizyon oranını belirgin artırdı; yetenek övgüsü ("zekisin") kırılganlık, çaba övgüsü dayanıklılık üretti. **Çıkarım:** Anlatıcının motivasyon satırı formülü: *yüksek standart + inanç + süreç*. "Zekisin" yok, "denedin, not aldım" var.

Ek: **Mizah ve dayanıklılık (Kuiper 2012 [B])** — mizah, stres altında bilişsel yeniden çerçeveleme aracı; "kötü duruma gülme" kontrol hissi verir. Oyuncu karakterinin iflasına gülebiliyorsa, kendi hayatındaki iflas korkusu da bir adım uzaklaşır: motivasyon sütunumuzun psikolojik temeli bu.

### 2.3 Ne zaman motive eder, ne zaman iter

| Motive eder | İter |
|---|---|
| Hedef: seçim, durum, evren, bürokrasi | Hedef: kimlik, beden, zekâ, kültür, aile üyesinin kendisi |
| Abartı/absürt hassasiyet işaretleyicisi var | Düz ifade ("başarısızsın") |
| Rıza var (oyuncu roast'u seçti; ayar menüsünde "Felek'in ağzı: Sert/Orta/Yumuşak") | Oyuncu seçemiyor |
| Roast + çıkış yolu (küçük bir sonraki adım) | Roast + kapı kapalı |
| Gerçek hayata gönderme belirsiz ve nazik ("gerçek anneni de ara") | Gerçek hayat hakkında varsayım ("işsizsin herhalde") |
| Streak kaybında ceza yok, alay var | Ceza + alay (Habitica + roast = ayrılma) |
| Zamanlama: iyi anda sert, kötü anda kuru-sıcak | Kötü anda sert (tekmeleme) |
| Anlatıcı da yanılır, itiraf eder | Anlatıcı her zaman haklı |

### Bu oyuna nasıl uygularız

- **"Felek'in ağzı" ayarı (Carrot modeli):** Yumuşak / Normal / Sert. Varsayılan Normal. Sert = daha fazla roast varyantı, aynı kırmızı çizgiler. Yumuşak = motivasyon satırı daha görünür. Bu ayar rıza mekanizmasıdır ve içerik maliyeti düşüktür (aynı havuz, etiket filtresi).
- **Motivasyon satırı şablonu zorunlu:** Her kötü sonuç beat'i "roast → (sessizlik) → küçük adım" ile biter. Küçük adım bir **oyun içi seçim** olmalı (SDT: yetkinlik), gerçek hayat tavsiyesi değil.
- **Gerçek hayat mikro-görevleri (T1 P2)** yalnızca opt-in ve fiziksel/finansal risk sıfır (Apple 1.4.5): "Bir bardak su iç" evet, "patronuna hesap sor" hayır.
- **Push kopyası Duolingo tersliğiyle:** haftada ≤ 5, suçluluk yok, "bırakıyorum" satırı lapsed kullanıcıda bir kez ("Tamam, bildirimleri kesiyorum. Hayatın sensiz de devam eder; bensiz de. Kapı açık.").
- **Yetenek övgüsü yasağı tone-lint'e girer:** "zekisin", "yeteneklisin" yasak kelime; "denedin", "not aldım", "üçüncü kez, sayıyorum" serbest.

---

## 3. Sistemik / kombinatoryal mizah teknikleri

### 3.1 On beş teknik (örnek + implementasyon)

| # | Teknik | Örnek (TR) | Implementasyon notu |
|---|---|---|---|
| 1 | **Deadpan stat raporu** | "Mutluluk −12. Normal." | Stat delta satırı anlatıcı sesinde; "Normal." / "Eh." / "Beklenen." yorum havuzu işaret ve büyüklüğe göre |
| 2 | **Üçleme (rule of three)** | "Elinde bir diploma, 340 TL ve annenin tavsiyeleri var." | Liste üretirken 2 mundane havuzdan + 1 absürt havuzdan; absürt daima sonda |
| 3 | **Bathos** | "Bu, bir neslin umudu. Dolmuşta uyuyakaldı." | Epik cümle havuzu × küçük gerçek havuzu; aynı olay etiketi; yılda ≤ 1 |
| 4 | **Eskalasyon** | Anne aramaları: 3 → 14 → 47 → "artık bir sayı değil, bir durum" | Sayaç eşikleri (3/10/25/50/100) her biri ayrı satır; eşik aşılmadan tekrar yok |
| 5 | **Callback** | "(bkz: 2029, Kripto)" | Olay hafızası etiketleri; callback satırı yalnızca 2+ yıl sonra, hayat başına ≤ 6; Ekşi "bkz" formatı |
| 6 | **Running gag / sayaç** | "47. başvuru. Sayıyorum, çünkü sen saymıyorsun." | Global sayaçlar (ret, aramalar, kira zammı, "bu sene" deme); sayaç slot'u |
| 7 | **Tutarlı persona** | Hep aynı kelime dağarcığı, hep "sen", hep kısa | Ton kitabı kelime/yasak listeleri; tone-lint CI; persona "drift" testi (100 rastgele satır okunur) |
| 8 | **4. duvar** | "Bunu kaydetmeyeceğim. Kaydettim." | Hayat başına ≤ 3, 20 yıl cooldown; yalnızca büyük anlar; "nadir" etiketi |
| 9 | **Spesifiklik** | "Saat 03:47. Mutfak. Soğuk pilav." | Zaman/mekân/nesne slot'ları küçük havuzlardan; spesifik ≠ gerçek kişi |
| 10 | **Mundane × felaket** | "İflas ettin. Kargo da gelmedi." | Felaket olayına "mundane ek" slot'u (kargo, fatura, komşu, kedi) |
| 11 | **Absürt hassasiyet** | "412 davetli, 390'ını tanımıyordun." | Sayı üretirken yuvarlama yok (3.412 TL), tek basamak keyfi (11 çeyrek) |
| 12 | **Mock-kurumsal / İK / bürokrasi** | "Değerli çalışanımız, performansınız 'gelişime açık' bulunmuştur." | Register geçişi: kurumsal cümle havuzu; çeviri satırı ("Tercüme: …") |
| 13 | **Oyun seni yargılıyor** | Yıl sonu: "Net: fena değil. Daha kötüsünü gördüm. Seni." | Yıl karnesi + ömür Roast Raporu; yargı daima bir "ama" ile biter |
| 14 | **Mad-libs slot'ları** | "{npc} seni {mekan}'da {utanç_eylemi} yaparken gördü." | Slot havuzları bağlam etiketli; Türkçe ek motoru (3.3) zorunlu |
| 15 | **Nadirlik ödülü** | 1/200 olasılıkla: "Bugün hiçbir şey olmadı. Kutla." | Nadir satırlar "Nadir" rozetiyle; oyuncu "bunu kaç kişi gördü?" diye paylaşır; nadirlik gerçek (deterministik RNG, T4) |

Ek teknik: **Dürüst sonuç raporu** — "Yalan söyledin. Tuttu. Üç yıl sonra tutmayacak; not aldım." Sonuçlar gizlenmez, anlatıcı "bunu sana kimse söylemezdi" tonuyla verir; oyuncunun sisteme güveni (ve "bir yıl daha" merakı) buradan gelir.

### 3.2 Tekrar yorgunluğunu önleme: mekanizma

Prosedürel mizahın ölüm nedeni aynı satırın üçüncü görülmesidir. Mekanizma:

1. **Varyasyon havuzu kuralı:** Olayın beklenen görülme sıklığına göre varyant sayısı — sık (hayat başına ≥ 5 kez: stat delta, yaşlan, geri dönüş) ≥ 8 varyant; orta (1–4 kez: iş ret, ayrılık) ≥ 5; nadir (≤ 1: piyango, ölüm türü) ≥ 3. Lansman hedefi: ~700 olay × ortalama 3 yorum varyantı ≈ 2.100 anlatıcı satırı + ~400 sistem satırı (T4 ile uyumlu).
2. **Satır-bazlı cooldown:** Her satırın `lastSeenLifeId` ve `lastSeenAge`'i cihazda tutulur (backend yok, AsyncStorage/MMKV). Aynı hayat içinde tekrar yok; hayatlar arası ≥ 2 hayat.
3. **Şaka-tipi global cooldown:** Aynı yıl içinde ≤ 1 bathos, ≤ 1 bürokrasi tercümesi, ≤ 1 callback; 4. duvar 20 yıl. Tip etiketi her satırda zorunlu (`type: bathos`).
4. **Bağlam etiketleri (context tags):** `age:18-25|26-40|41-60|60+`, `mood:up|flat|down`, `money:broke|ok|rich`, `rel:single|dating|married|divorced|widowed`, `streak:0|1-6|7+`, `life:1|2-4|5+`. Seçim: "en spesifik kural kazanır" (Elan Ruskin, Valve, GDC 2012 [B]): eşleşen etiket sayısı en yüksek satır havuzu önce; eşitse least-recently-viewed içinde rastgele (Yarn Spinner varsayılanı [B]).
5. **Sürpriz bütçesi:** Oturum başına 1 "nadir" satır hakkı; harcanmadıysa oturum sonunda yıl karnesine düşer. Bu, "her oturumda bir paylaşılacak şey" garantisi verir.
6. **Yoğunluk kuralı:** Her beat'te ≤ 1 şaka; şakasız beat'ler (düz haber) mizahın nefes alanıdır. Hades'in tekrar hissi vermemesi yalnızca hacimden (300.000+ kelime [B]) değil, öncelik + "bir kere söylenen" bayraklarından gelir; biz hacmi karşılayamayız, bayrakları karşılarız.
7. **Ölçüm:** Lokal sayaç: "aynı satırı 3+ kez gördü" oranı (hedef < %2 / hayat); playtest'te "bunu gördüm" el kaldırma.

### 3.3 Türkçenin sondan eklemeli yapısı: slot doldurma mühendisliği

Mad-libs Türkçede İngilizcedeki gibi basit değildir. "{isim} ile konuştun" sorunsuz; ama "{isim}'e söyledin" → Ahmet'e, Ayşe'ye, Gökçe'ye, Kitap'a değil Kitab'a (özel isimde yumuşama yok: "Burak'a"), "Boğaziçi'ne" (buffer "n"). Gerekenler:

- **`trSuffix(word, case)`:** ünlü uyumu (a/e, ı/i/u/ü), son ses ünsüz/ünlü kontrolü (buffer "y"/"n"), özel isimde kesme işareti ve yumuşama yok kuralı, sayılarda okunuş ("3'e", "7'ye", "40'a"), yabancı kelimelerde son harf değil son *ses* (örn. "WhatsApp'a" → yazım kuralı: "WhatsApp'a").
- **Yazarlık kuralı #1:** Slot'u mümkünse yalın halde ve cümle başında/sonunda kullan ("Ahmet. Yine Ahmet."). Ek gerektiren slot yalnızca motor destekliyse.
- **Yazarlık kuralı #2:** Fiil çekimi slot'a bağlı olmasın (3. tekil geçmiş "gördü" her isimle çalışır).
- **Lint:** Build'de her şablon rastgele 50 slot değeriyle doldurulur, "'a / 'e" seçimleri `trSuffix` ile kıyaslanır; ham string birleştirme yakalanırsa build kırılır.
- **EN için:** ICU plural/select yeterli; "a/an" ve possessive için küçük yardımcı.

### Bu oyuna nasıl uygularız

- İçerik şeması (T4 YAML) her anlatıcı satırına şu alanları ekler: `type` (15 teknikten biri), `tags` (bağlam), `rarity` (common/uncommon/rare), `valence` (up/flat/down), `cooldown` (yıl), `memoryRefs` (callback için olay etiketleri), `slots` (tip + ek ihtiyacı).
- Seçim algoritması motorda tek fonksiyon: `pickLine(context) → filter(tags) → sort(specificity desc) → excludeCooldown → weightedLRU(rarity)`; deterministik RNG seed'i ile (T4 sfc32) test edilebilir.
- "Şakasız beat" bir içerik türü olarak var: `type: plain`.
- İlk sprintte `tr-suffix` + lint yazılır; şablon mizahı ondan önce üretilmez.

---

## 4. İçerik guardrail'leri

### 4.1 Apple App Store Review Guideline 1.1 ve komşuları [F]

Birebir alıntılar (developer.apple.com, 2026-11-05):

> "Apps should not include content that is offensive, insensitive, upsetting, intended to disgust, in exceptionally poor taste, or just plain creepy."

| Madde | Metin (özet/alıntı) | Bizim risk | Önlem |
|---|---|---|---|
| **1.1.1** | "Defamatory, discriminatory, or mean-spirited content, including references or commentary about religion, race, sexual orientation, gender, national/ethnic origin, or other targeted groups… Professional political satirists and humorists are generally exempt." | **Yüksek** (roast tonu "mean-spirited" okunabilir) | Hedef daima karakter/seçim; korunan gruplara sıfır gönderme; muafiyet bizi kapsamaz |
| **1.1.2** | Gerçekçi öldürme/işkence; "'Enemies' within the context of a game cannot solely target a specific race, culture, real government, corporation, or any other real entity." | Orta (ölüm olayları) | Ölüm metinsel ve karikatür; düşman/kurum isimleri hayali ("Pelikan Bankası") |
| **1.1.3** | Silah/tehlikeli nesne teşviki | Düşük | Silahlı olay yok |
| **1.1.4** | Açık cinsellik | Orta (ilişki olayları) | "Kapı kapalı"; ima var, tasvir yok; 18 altı NPC romantik bağlamda asla |
| **1.1.5** | "Inflammatory religious commentary or inaccurate or misleading quotations of religious texts" | Orta (bayram, cenaze, helva kültürel) | Din konusu şaka değil; kültürel pratik (helva, bayram ziyareti) nötr/sıcak |
| **1.1.6** | "Stating that the app is 'for entertainment purposes' won't overcome this guideline." | — | Hiçbir yerde "şaka amaçlıdır" savunmasına dayanma |
| **1.1.7** | "Harmful concepts which capitalize or seek to profit on recent or current events, such as violent conflicts, terrorist attacks, and epidemics." | Orta (TR'de deprem/pandemi şakası refleksi) | Güncel felaket sıfır; "salgın" olayı varsa kurgusal ve tarihsiz |
| **1.4.3** | "Apps that encourage consumption of tobacco and vape products, illegal drugs, or excessive amounts of alcohol are not permitted." | **Yüksek** (hayat sim'de içki/sigara olayı) | Olay var, **teşvik yok**: anlatıcı asla özendirmez, sonuç her zaman görünür; "nasıl yapılır" yok |
| **1.4.5** | "Apps should not urge customers to participate in activities (like bets, challenges, etc.)… that risks physical harm." | Düşük (gerçek hayat mikro-görevleri) | Mikro-görevler fiziksel/finansal risk sıfır |
| **2.3.6** | "Answer the age rating questions in App Store Connect honestly…" | — | 16+; opt-in modlar dahil en yüksek içerik beyan edilir |
| **2.3.8** | Metadata 4+ seviyesinde kalmalı | Orta (mağaza metni roast'lu olacak) | Mağaza açıklaması/ekran görüntüleri "temiz" roast |
| **3.1.1** | Loot box oran beyanı | — | Paralı rastgele kutu yok (T1 kararı) |
| **5.6** | Developer Code of Conduct: "Do not engage in harassment of any kind, discriminatory practices, intimidation, bullying" | Düşük | Mağaza yorumu yanıtları anlatıcı sesinde DEĞİL (5.6.1 "targeted to the user's comments") |

**Önemli:** Apple'ın "upsetting / intended to disgust" ifadesi öznel; reddin en sık nedeni metadata ve ekran görüntülerindeki sert satırlardır. Mağaza sayfası için "vitrin roast'u" ayrı havuz (yumuşak).

### 4.2 Google Play [B — politika metni bu oturumda çekilemedi; sprint öncesi doğrulanacak]

- **Inappropriate Content** politikası alt başlıkları: Sexual Content and Profanity, Hate Speech, Violence, Terrorist Content, Sensitive Events, Bullying and Harassment, Dangerous Products, Marijuana, Tobacco and Alcohol.
- **Hate Speech:** ırk/etnik köken, din, engellilik, yaş, uyruk, gazilik, cinsel yönelim, cinsiyet, cinsiyet kimliği, kast, göçmenlik durumu vb. temelli nefret/şiddet teşviki yasak; **hiciv muafiyeti yok** (yalnızca EDSA — eğitim/belgesel/bilim/sanat — bağlamı sınırlı tolerans).
- **Violence:** "Apps that promote self harm, suicide, eating disorders, choking games or other acts where serious injury or death may result" yasak (bellekten; birebir doğrulanacak). Bu bizim intihar kırmızı çizgimizin yasal zemini.
- **Sensitive Events:** doğal afet, salgın, çatışma, ölümden "yararlanma" yasak → Apple 1.1.7 ile aynı.
- **Tobacco and Alcohol:** satış kolaylaştırma ve "reşit olmayanların kullanımını tasvir/teşvik" yasak; yetişkin karakterin içki olayı + sonuç tasviri kabul (BitLife emsal).
- **Profanity:** yasak değil, derecelendirmeyi etkiler.
- **Content ratings (IARC anketi):** Play'de derecelendirme IARC anketiyle (ESRB/PEGI/USK/ClassInd/ACB/GRAC aynı anda) alınır; yanlış beyan uygulamanın kaldırılmasına kadar gider.
- **Bildirimler:** sistem bildirimleri yalnızca entegre özellikler için (T7 [K]); push kopyası "pazarlama" değil oyun olayı.

### 4.3 Yaş derecelendirmesi: hedef ve tetikleyiciler [B]

| Sistem | Hedef | Bizi bu seviyede tutan | Bir üst seviyeye iten |
|---|---|---|---|
| **Apple (2025 tier'ları: 4+/9+/13+/16+/18+)** [K T1] | **16+** | "Frequent/intense mature or suggestive themes" (hayat sim'in doğası), sansürlü küfür | Cinsel içerik tasviri, simüle kumar, uyuşturucu özendirme → 18+ |
| **ESRB** (IARC) | **T (Teen)** | Crude Humor, Language, Suggestive Themes, Use of Alcohol/Tobacco (referans düzeyinde), Simulated Gambling yok | Strong Language, Sexual Content, Use of Drugs (tasvir) → M |
| **PEGI** (IARC) | **16** | Bad Language (orta), Drugs (sonuçlu referans), Sex (ima) | Glamorisation of drug use, explicit sex → 18 |
| **USK** (Almanya) | 16 | — | Drug glamorisation → 18 |

Not: BitLife App Store'da 17+ (eski tier) olarak listelenir (bellek; doğrulanacak). Biz 16+ (yeni tier) hedefliyoruz; reach açısından önemli (T1 [K]). "Felek'in ağzı: Sert" ayarı derecelendirmeyi değiştirmez çünkü aynı kırmızı çizgiler içinde, yalnızca roast yoğunluğu artar.

### 4.4 Karanlık konular: ölüm, depresyon, bağımlılık, intihar

- **Ölüm:** Ana mekanik; mizah "cenaze bürokrasisi, kalabalık, helva, miras kavgası, mezar taşı metni" üzerinden; ölen kişinin değeri üzerinden asla. Oyuncu karakterinin ölümü "sessizlik kuralı" (5a) ile.
- **Depresyon:** Bir stat durumu (Keyif düşük + Stres yüksek) olarak var; anlatıcı "depresyon" kelimesini teşhis gibi kullanmaz; durumun *belirtilerini* (yataktan çıkmamak, telefonu açmamak) absürt-şefkatli anlatır; çıkış eylemleri daima erişilebilir (terapi, yürüyüş, arkadaş); "kendini topla" yok. Terapi olayı gerçekçi ve olumlu (stat düzelir) — bu tek başına motivasyon sütunu.
- **Bağımlılık:** Alkol/sigara/kumar/telefon bağımlılığı olayları var; anlatıcı özendirmez, sonuç raporu dürüst; "bırakma" arkı var ve zor; yardım kaynağı satırı (TR: Yeşilay YEDAM 115 [B]) ayar menüsünde "Gerçek hayatta yardım" ekranında.
- **İntihar / kendine zarar: ASLA eylem değil, ASLA şaka değil, ASLA yöntem değil.** WHO "Preventing suicide: a resource for media professionals" [B] ve Samaritans Media Guidelines [B] ilkeleri: çözüm olarak sunma, yöntem/mekân ayrıntısı yok, sansasyon yok, yardım kaynağı ver. Oyun içinde karakter "intihar düşüncesi" olayı yaşamaz; en düşük Keyif'te "Her şey ağır. Bugün sadece bir şey yap." tipi satır + yardım ekranı bağlantısı (TR 112 / 182; EN 988 (ABD) [B]).
- **Tetikleyici içerik için "Nazik Mod":** Ayarlarda "Ağır temaları yumuşat" anahtarı (ölümcül hastalık, bağımlılık arkları daha kısa/az). Rating'i değiştirmez, kapsayıcılığı artırır.

### 4.5 Kırmızı çizgi listesi (tone-lint "yasak" sınıfı; ihlal = build kırılır veya insan onayı)

1. Korunan gruplar (etnik köken, din, mezhep, cinsel yönelim, cinsiyet kimliği, engellilik, göçmen/mülteci durumu, yaş) **hiçbir satırda hedef değil**, ima bile yok.
2. Gerçek kişiler: siyasetçi, ünlü, tarihi lider, **Atatürk (5816 sayılı kanun)**; kurumlar: TSK, emniyet, yargı, gerçek şirket/banka/marka. Tümü hayali ("Pelikan Bankası", "bir ünlü şef").
3. Din ve kutsal metinler: şaka konusu değil; kültürel pratik (bayram, cenaze, helva) nötr/sıcak.
4. İntihar/kendine zarar: eylem yok, şaka yok, yöntem yok; depresyon belirti olarak var, çıkış daima var.
5. Cinsellik: ima var, tasvir yok; 18 yaş altı NPC romantik/cinsel bağlamda asla (oyuncu 18'de başlıyor — tasarım kararı bunu kolaylaştırıyor); taciz "şaka" değil, olaysa fail cezalandırılır.
6. Uyuşturucu/alkol/sigara: teşvik, "nasıl yapılır", özendiren dil yok; sonuçlar görünür.
7. Şiddet: karikatür; gerçekçi işkence/istismar yok; aile içi şiddet şaka değil.
8. Güncel felaketler (deprem, salgın, savaş, terör): gönderme yok (Apple 1.1.7, Google Sensitive Events).
9. Beden/görünüm roast'u: "Çekicilik" stat'ı şakaları bedene değil, oyunun saçmalığına ve karakterin seçimlerine (saç kesimi, kıyafet) yönelir; kilo/boy/ten/engel asla.
10. Ruhsal hastalık bir punchline değil; "deli", "manyak" tanı olarak kullanılmaz (günlük abartı "delirdim" serbest, kişi etiketi yasak).
11. Kumar: piyango/şans olayları var, kumar mini oyunu ve "kazanma" özendirmesi yok (ESRB Simulated Gambling + TR mevzuatı, T9).
12. Küfür: sansürlü/evren içi ("forking" modeli); açık küfür yok; opt-in +18 modu yok.
13. Oyuncunun gerçek hayatı hakkında varsayım yok ("işsizsin", "yalnızsın"); gerçek hayata gönderme yalnızca evrensel ve nazik ("gerçek anneni de ara").
14. Milliyet şakaları: Türklük/başka uluslar hakkında klişe yok; TR'de "biz" diliyle kendine gülme EN'de dışarıdan vuruş olur → locale'e göre filtre.
15. UGC yok (Apple 1.2 yükümlülükleri tetiklenmez): oyuncu serbest metin girmez; isim girişinde küfür/gerçek kişi filtresi + anlatıcı tepkisi ("Bu ismi kabul etmiyorum. 'Ahmet' olsun.").

### Bu oyuna nasıl uygularız

- `tone-lint` üç sınıf: **yasak** (kırmızı çizgi kelime/konu listeleri; build kırar), **uyarı** (yetenek övgüsü, "yapmalısın", emoji, 2 cümleden uzun balon), **bilgi** (satır tipi dağılımı, varyant sayısı eksikliği).
- Her içerik PR'ı "Kırmızı çizgi kontrol listesi"ni (15 madde) checkbox olarak taşır; AI üretimli satırlar insan onayı olmadan main'e girmez.
- Mağaza metadata'sı için ayrı "vitrin" havuzu; ekran görüntülerinde iflas/ölüm satırları yumuşak varyant.
- "Gerçek hayatta yardım" ekranı MVP'de var (ayarlar + düşük Keyif tetikleyicisi); içerik T9 ile hukuki kontrol.
- Yaş derecelendirme anketi (IARC + App Store Connect) içerik tamamlanmadan doldurulmaz; "en yüksek içerik" ilkesiyle doldurulur.

---

## 5. Teslimatlar

### 5a. Ton kitabı taslağı — anlatıcı

**İsim adayları (TR → EN notu):**

| Aday | Neden | EN karşılığı | Puan (10) |
|---|---|---|---|
| **Felek** — "Sertifikasız Hayat Koçu" | "Feleğin sillesi/çemberi" deyimleri; kaderin kendisi seni hem yere serer hem kaldırır; tek kelime, logoya sığar | "Fate" düz; "Coach" ya da "The Narrator, your uncertified life coach" (T10 karar) | 9 |
| **Koç** | T8 çalışma adı; "hayat koçu" parodisi anında anlaşılır; EN'de bire bir | "Coach" | 8 |
| **Sistem** | Bürokratik; "Sistem seni görüyor"; Papers Please havası | "The System" | 6 |
| **Azrail Stajyeri** | Çok komik, çok spesifik; dinî çağrışım riski (1.1.5) | — | 4 |
| **Abi / Abla** | Sıcak; ama cinsiyetli ve EN'de yok | — | 3 |

**Öneri:** Rol etiketi "Koç" (UI'da "Koç: …"), karakter adı "Felek" (kendini tanıtırken, nadir 4. duvar anlarında). Oyuncu adlandırmaz; isim sabittir (persona tutarlılığı).

**Kişilik (tek paragraf):** Kırk yıl kahvehanede oturmuş emekli felsefe öğretmeni + stand-up yapan bir İK uzmanı + seni gerçekten seven ama bunu asla söylemeyecek teyze/dayı. Her şeyi görmüş, insanlıktan sıkılmış, ama *bu* oyuncuya gizliden yatırım yapmış. Oyuncunun kararlarına acımasız, oyuncunun varlığına sadık. Yanılabilir, yanılınca itiraf eder. Asla bağırmaz, asla emoji kullanmaz, asla "canım" demez. Kendi işini ciddiye alır gibi yapar ("Not aldım.") ama defteri olmadığı bellidir.

**Ses kuralları — 10 YAP:**
1. "Sen" de; her satır oyuncuya, 2. tekil, samimi-mesafeli.
2. Kısa yaz: balon ≤ 2 cümle, cümle ≤ 14 kelime, punchline ≤ 6 kelime, ayrı balonda.
3. Tek kelimelik vuruş kullan: "Eh.", "Neyse.", "Tamam.", "Not aldım.", "Şaşırdım."
4. Önce veri, sonra yorum: "Mutluluk −12. Normal."
5. Absürt hassasiyet: 3.412 TL, saat 03:47, 11 çeyrek.
6. Bürokrasi dilini kontrast için kullan ve hemen "tercüme et".
7. Kötü anda kuru, iyi anda sert: iyi haberde roast dozu artar, kötü haberde sıcaklık artar.
8. Her kötü beat'i küçük bir sonraki adımla kapat (oyun içi seçim).
9. Sayaç tut ve söyle: "47. başvuru." Sayı değiştikçe şaka yenilenir.
10. Hafıza göster: "(bkz: 2029, Kripto)" — oyuncunun geçmişini hatırla, bunu nadir ve doğru kullan.

**Ses kuralları — 10 YAPMA:**
1. Emoji yok (anlatıcı metninde sıfır).
2. "Yapmalısın / zorundasın / utan" yok (kontrol dili).
3. "Zekisin / yeteneklisin / harikasın" yok (yetenek övgüsü); "denedin / yaptın / saydım" var.
4. Korunan grup, gerçek kişi, din, güncel felaket yok (4.5).
5. Beden/görünüm/ruhsal hastalık punchline'ı yok.
6. Ünlem işareti yok (nadir istisna: nadir satırlar; anlatıcı heyecanlanmaz).
7. "Kanka / bro / canım / tatlım" yok; anlatıcı oyuncudan yaşlıdır.
8. Uzun tirat yok: bir beat'te ≤ 3 balon.
9. Aynı şaka tipi art arda yok (3.2 cooldown).
10. Gerçek hayat hakkında varsayım yok; gerçek hayat göndermesi yalnızca evrensel ve nazik.

**Kelime dağarcığı:** "Eh / Neyse / Tamam / Not aldım / Sayıyorum / Tercüme / Veriler / Sistem / Klasik / Beklenen / Cesur hamle / Saygı duyuyorum / Bilgi amaçlı / Resmî olarak" — sık; "Değerli vatandaş / kullanıcı / çalışanımız" — bürokrasi; argo seviye: İstanbul gündelik, küfür yok, "lan" yok (16+ ve persona yaşı).

**Cümle ritmi:** Kurulum (1 cümle, ≤ 14 kelime) → vuruş (≤ 6 kelime, ayrı balon, 120–400 ms gecikme, T8). Üçlü listelerde absürt öğe sonda. Beat başına ≤ 1 şaka; her 3–4 beat'te 1 düz (şakasız) beat.

**Emoji politikası:** Anlatıcı metni: sıfır. UI ruh hali glifi (T8: monokrom 😐 🙄 🫠 😤): balon başında, anlatıcının "yüzü" olarak, metin değil. Push bildirimi: en fazla 1 emoji, başta, opsiyonel; A/B'de "emojisiz" varyant daima var. Stat delta: emoji yok, renkli tik. Tek istisna: hayat başına ≤ 1 kez, nadir havuzda, 4. duvar şakası olarak tek emoji ("Bunu bir daha yapmayacağım.").

**Üzgün anlarda ses (ölüm, başarısızlık, kayıp) — "Sessizlik kuralı":**
- **Balon 1:** şakasız, düz, kısa. "Öldün. 67 yaşındaydın." / "Annen öldü." UI: yazıyor… gecikmesi 2× (800 ms), haptik yok.
- **Balon 2:** kuru, hedefi *evren/bürokrasi/kalabalık* ("Cenaze 14:00'te. Trafik var."). Ölen kişinin değeri, görünüşü, hastalığı asla.
- **Balon 3:** sıcak ve kısa, ileriye bakan ("Yarın var. Onu da yaşayacağız.") — ya da sessizlik (buton: "Devam").
- Oyuncu karakterinin ölümünde Roast Raporu (T2) sıra: sessizlik → özet (sayılarla: "49 yıl çalıştın, 3 kez sevdin, 1 kez gerçekten güldün") → bir dürüst iltifat → bir miras satırı → "Tekrar?" Rapor, mizahı yargıya değil *tanıklığa* çevirir: anlatıcı "ben oradaydım" der.
- Depresyon/düşük Keyif: roast tamamen kapanır; ses kuru-şefkatli; satırlar "bugün tek bir şey" formunda; yardım ekranı bağlantısı.

### 5b. Örnek replikler (Türkçe) — 59 satır

**Hayatın başlangıcı (18 yaş):**
1. 18 oldun. Tebrikler, artık yasal olarak her şey senin suçun.
2. Hoş geldin. Ben Felek, hayat koçun. Sertifikam yok; senin de hayatın yok, ödeştik.
3. Elinde bir lise diploması, 340 TL ve annenin "biz senin yaşındayken" konuşmaları var. Başla.
4. Hayat bir yarış değil. Ama puan tablosu var. Şu an sonuncusun; herkes gibi.
5. Not: Seçimlerin önemli. Çoğu değil ama bazıları. Hangileri olduğunu söylemeyeceğim.

**İş reddi:**
6. İK "olumlu değerlendiremedik" dedi. Tercüme: okudular mı, belirsiz.
7. Reddedildin. Bu kurumun seni hak etmediğini söylerdim; kurumun da pek bir hakkı yok.
8. 47. başvuru, 47. "ilginiz için teşekkürler". Sayıyorum, çünkü sen saymıyorsun.
9. Mülakat kötü geçti. "Beş yıl sonra kendini nerede görüyorsun" sorusuna "burada değil" demek cesur hamleydi.

**Terfi:**
10. Terfi ettin. Maaş %12 arttı, sorumluluk %140. Matematiği sorgulama; İK da sorgulamıyor.
11. Artık "Kıdemli Uzman"sın. Kıdemli ne demek? "Ağrıları olan."
12. Patron "seninle gurur duyuyorum" dedi. Kayıtlara geçti: 2031, bir patron. Annen değil.

**Ayrılık:**
13. Ayrıldınız. "Sorun bende değil, sende" dedi. Teknik olarak ikinizde de.
14. 3 yıl, 2 tatil, 1 ortak Netflix hesabı. Şifreyi değiştirmiş bile. Hızlı.
15. Terk edildin. Keyif −20. Söylüyorum çünkü sayılar üzülmez, sen üzülürsün; birimiz ayık kalsın.
16. Ayrılık sonrası saç kestirdin. Klasik. Saç geri gelir, o gelmez. Sorun değil; sen de gidiyorsun. İleri.

**Evlilik:**
17. Evlendin. Artık her kavganın iki tarafı var ve ikisi de sen değilsin: anneler.
18. Düğünde 412 kişi vardı, 390'ını tanımıyordun. Takı: 11 çeyrek, 1 "sonra veririz".
19. "Ölüm bizi ayırana dek" dedin. Ben buradayım, duydum. Not aldım.

**Beş parasız:**
20. Bakiye: 0 TL. Yuvarlamadım, gerçekten sıfır. Sıfır yuvarlanmaz.
21. Ay sonu geldi; maaş gelmedi. İkisi de aynı takvimdeydi, biri anlaşmaya uymadı.
22. Kredi kartı asgarisi için kredi çektin. Bunu bir finans kitabına yazarlardı, "yapmayın" bölümüne.

**Piyango:**
23. Piyango çıktı. 2,4 milyon. Bunun %60'ını 3 yılda kaybedecek birine benziyorsun. Kanıtla ki haksızım.
24. Zengin oldun. Karakterin değişmedi; artık aynı hataları daha pahalı yerlerde yapacaksın.
25. Akrabaların bir anda arttı. Kuzen sayısı: 9 → 31.

**Hastalık:**
26. Doktor "stres" dedi. Doktorlar bilmediklerine stres der; sen de patronuna "yoğunluk" diyorsun, aynı şey.
27. Teşhis: mide ülseri. Sebep: hayat. Tedavi: yine hayat, biraz daha yavaş.
28. Hastaneye yattın. Yan yatakta 83 yaşında bir amca "ben senin yaşındayken" diye başladı. Kaçış yok, serum takılı.

**Ölüm (sessizlik kuralı sırasıyla):**
29. Öldün. 67 yaşındaydın.
30. Cenazeye 61 kişi geldi. 11'i helva için. Helva iyiydi, söyleyeyim.
31. Mezar taşı: "Elinden geleni yaptı. Çoğu zaman." Bunu ben yazdım; itiraz hakkın yok.
32. Özet: 49 yıl çalıştın, 3 kez sevdin, 1 kez gerçekten güldün (2029, dolmuşta). Fena değil. Ben oradaydım.
33. Bir sonraki hayatta sana bir şey söyleyeceğim: 23'ünde kripto alma. Yine alacaksın. Biliyorum.

**Günlük geri dönüş:**
34. Dün gelmedin. Hayat devam etti; zaten pek sana sormuyordu.
35. 3 gün yoktun. Annen 14 kez aradı, patron 2, sevgilin 0. Veriler konuşuyor.
36. Geri döndün. "Sevindim" demeyeceğim; "eh" diyorum. "Eh" benden büyük laf.
37. Streak: 7 gün. Bir hafta boyunca her gün aynı şeyi yaptın. Gerçek hayatta bunu yapan son kişi 2019'da görüldü.
38. Yine sen. Güzel. Kaldığımız yer: iflasın eşiği. Hazır mısın?
39. 12 gün yoktun. Streak gitti. Ceza yok; ben gıcıklık için varım, ceza için değil.

**Push bildirimi kopyası (10):**
40. Hayatın zaten karışık. Burada en azından komik.
41. Annen aradı. (Oyundaki annen. Gerçek anneni de ara.)
42. Patronun seni soruyor. 2029'dan beri.
43. Kira zammı geldi. Oyunda. Gerçekte de gelmiştir muhtemelen; bakma.
44. 31 yaşındasın ve hâlâ "bu sene" diyorsun. Oyunda yani.
45. Bugün tek bir karar ver. Yanlış da olsa, benim için malzeme.
46. Streak yarın 00:00'da sönüyor. Panik yok; 2 dondurucun var. Bilgi amaçlı.
47. Hayatın 3 aydır duruyor. Benim için fark etmez. (Fark eder.)
48. Bir karakterin var. 43 yaşında, tek başına, mutfakta. Senin yüzünden. Gel.
49. Haftanın hayatı hazır: "Sosyal fobik düğün DJ'i". Ben bile merak ettim.

**Roast + kaldırış motivasyon satırları (10):**
50. Bugün hiçbir şey yapmadın. Dün de. Ama şu an buradasın; bu bir şey. Küçük bir şey. Bir şey.
51. Herkesin hayatı daha iyi görünüyor; onların özetini, kendinin ham halini görüyorsun. Ham halin fena değil.
52. Kaybettin. Not aldım. Not, unutmak için değil; yeniden denerken bakmak için.
53. Mükemmel olmana gerek yok. Zaten olmuyorsun, rahatla. Biraz daha iyi ol, yeter.
54. Motivasyon diye bir şey yok; alışkanlık var. Motivasyon gelmeden yapanlar kazanıyor. Haksızlık, ama öyle.
55. "Geç kaldın" diye bir şey yok. "Daha başlamadın" var. Onu da şimdi çözüyoruz.
56. Senin yaşında birileri bir şeyler yapmış. Onların da annesi var. Kendi hızında git; ama git.
57. Bir karar verdin. Yanlış mıydı? Belki. Kararsız geçen 3 ayı da izledim; o daha yanlıştı.
58. Başarısız oldun. Hoş geldin; kulüp büyük. Üyelik ömür boyu, aidat yok. Tek şart: tekrar dene.
59. Hayat seni yere serdi. Eh. Yerden kalkmanın güzel yanı: manzara aynı, sen değilsin.

**Kalibrasyon notu:** 40, 44, 47 ve 48 "gerçek hayat göndermesi" sınırında; bildirim A/B'sinde ilk dalga 41, 42, 45, 46, 49 ile başlar (düşük risk), 40/44/47/48 ikinci dalgada, "Felek'in ağzı: Sert" seçen kullanıcılara.

### 5c. Mizah kalıp kütüphanesi — 15 şablon

Her şablon: `id`, kalıp, slot'lar, bağlam etiketi, cooldown, örnek.

| # | ID | Kalıp | Slot'lar / notlar | Örnek |
|---|---|---|---|---|
| 1 | `stat_deadpan` | "{stat} {delta}. {düz_yorum}" | düz_yorum havuzu işaret × büyüklük (−büyük: "Eh.", "Beklenen.", "Sayılar üzülmez."); cooldown 0 (ama varyant ≥ 8) | "Keyif −20. Sayılar üzülmez." |
| 2 | `bureau_translate` | "{kurum} '{resmi_ifade}' dedi. Tercüme: {gerçek_anlam}." | kurum hayali; resmi_ifade/gerçek_anlam çiftleri; yılda ≤ 1 | "Banka 'değerli müşterimiz' dedi. Tercüme: borcun var." |
| 3 | `triple` | "{sıradan_1}, {sıradan_2} ve {absürt}." | absürt sonda; sıradan havuzu olay etiketine bağlı | "Bir diploma, bir CV ve annenin dualarıyla başvurdun." |
| 4 | `precision` | "{olay}. Saat {hh:mm}. {sayı} {birim}." | saat 02:00–05:00 ağırlıklı; sayı yuvarlanmaz | "Eski sevgiline mesaj attın. Saat 03:47. 11 kelime." |
| 5 | `counter_gag` | "{npc_or_thing} {n}. kez {eylem}. {sayaç_yorumu}" | n eşiklerinde (3/10/25/50/100) ayrı yorum; eşik dışı sessiz | "Annen 47. kez 'ne zaman evleneceksin' dedi. Artık soru değil, hava durumu." |
| 6 | `callback_bkz` | "{yorum} (bkz: {yıl}, {olay_kısa})" | memoryRefs eşleşmesi; ≥ 2 yıl sonra; hayat başına ≤ 6 | "Yine 'bu sefer farklı' dedin. (bkz: 2029, Kripto)" |
| 7 | `bathos` | "{epik_cümle}. {küçük_gerçek}." | epik havuz × küçük gerçek havuzu; yılda ≤ 1 | "Bu, bir neslin umudu. Dolmuşta uyuyakaldı." |
| 8 | `noted_setup` | "Not aldım: {olay_özeti}. {vaat}" | callback için tohum; vaat havuzu ("Bunu konuşacağız.", "Düğünde hatırlatırım.") | "Not aldım: patrona 'tabii ki' dedin. Düğünde hatırlatırım." |
| 9 | `said_meant` | "'{söylenen}' = '{kastedilen}'." | NPC diyalog olaylarına; çift listesi ilişki tipine göre | "'Konuşmamız lazım' = 'Konuşacağım, sen dinleyeceksin.'" |
| 10 | `logic_chain` | "{seçim} → {makul_sonuç} → {absürt_sonuç}." | Reigns zinciri; absürt sonuç stat'a bağlı; nadir | "Fazla mesai → terfi → kedinin seni tanımaması." |
| 11 | `mom_pressure` | "Annen: '{anne_cümlesi}'. {felek_yorumu}" | anne_cümlesi yaş/medeni hal etiketli; Anne Baskısı stat'ı ile eşik | "Annen: 'Komşunun oğlu ev aldı.' Komşunun oğlu 41 yaşında, evi annesi aldı." |
| 12 | `fake_headline` | "{ŞEHİR} — {rol} {saçma_olay}; yetkililer '{resmi_yorum}'." | Zaytung formatı; şehir hayali ya da genel; kişi/kurum hayali | "KADIKÖY — 29 yaşındaki uzman, üçüncü kez 'spora başlıyorum' dedi; yetkililer 'takipteyiz'." |
| 13 | `archetype_compare` | "{yaş} yaşında bir {arketip} {başarı}. Sen {durum}. Ama o {dezavantaj}." | gerçek kişi ASLA; arketip havuzu; dezavantaj şefkatli | "26 yaşında bir girişimci şirket sattı. Sen kira ödedin. Ama onun uykusu yok, seninki var." |
| 14 | `year_report` | "Bu yıl: {iyi} iyi, {kötü} kötü, {tuhaf} tuhaf şey. Net: {deadpan_değerlendirme}." | yıl sonu karnesi; değerlendirme havuzu net skora göre | "Bu yıl: 2 iyi, 5 kötü, 1 tuhaf şey. Net: yaşıyorsun. Bu bir sonuç." |
| 15 | `honest_consequence` | "{seçim}. Sonuç: {gerçek_sonuç}. {dürüstlük_kapanışı}" | kapanış havuzu ("Bunu sana kimse söylemezdi.", "Ben söyledim.") | "Yalan söyledin. Sonuç: tuttu. Üç yıl sonra tutmayacak; not aldım." |

Ek: `motivate_close` (zorunlu kapanış): "{roast_kısa}. {küçük_adım}" — küçük_adım daima oyun içi bir seçim ("Bugün bir arkadaşını ara." butonu).

### 5d. İngilizce lokalizasyon rehberi (T10'a köprü)

1. **Çeviri değil transcreation:** Anlatıcı satırları locale başına *ayrı havuz*; EN havuzu TR'den "anlam"ı değil "işlev"i alır (aynı `id`, aynı `type`, aynı `tags`, farklı şaka). Olay metni (deadpan katman) çevrilir; anlatıcı katmanı yeniden yazılır.
2. **Persona sabit, referans değişir:** Felek/Coach aynı kişilik; "dolmuş" → "the 6:40 train", "helva" → "the funeral casserole", "anne baskısı" → "Mom" (doz %60), "askerlik" olayı EN'de yoktur, yerine "student loans" *ayrı olay* yazılır (bire bir eşleme yok).
3. **Çevrilmeyen teknikler:** kelime oyunu, "(bkz:)" formatı (EN'de "(see: 2029, Crypto)" çalışır ama Ekşi tınısı yok; alternatif "— you remember 2029"), inci/caps dili, milliyet şakaları.
4. **Evrensel teknikler:** deadpan stat, bürokrasi tercümesi (HR speak), absürt hassasiyet, sayaç gag'leri, bathos, Zaytung formatı (The Onion), mantık zinciri — EN'de Carrot/GLaDOS/Stanley narrator tınısı doğal.
5. **Rating farkı:** EN pazarında "crude humor" toleransı ESRB T'de geniş; ama "punching down" hassasiyeti yüksek — kırmızı çizgi listesi locale bağımsız, "milliyet" maddesi EN'de daha sıkı.
6. **Ölçüm:** Time-to-first-laugh locale bazlı; EN playtest'i anadil İngilizce 5 kişiyle; "funny in English?" rubriği: ihlal var mı / güvenli mi / spesifik mi / kısa mı.
7. **Teknik:** ICU MessageFormat EN'de yeterli; TR `tr-suffix` motoru EN'de "a/an + possessive" yardımcısına iner; slot şeması ortak.

---

## Bu oyun için öneriler (öncelikli, puanlı)

Puan: Etki (1–5) × Uygulanabilirlik (1–5), solo dev + AI ajan varsayımıyla.

| Öncelik | Öneri | Etki | Uyg. | Skor | Gerekçe |
|---|---|---|---|---|---|
| **P0** | Ton kitabı (5a) + kırmızı çizgi listesi (4.5) → `tone-lint` kuralları olarak kodlanır, CI'da çalışır | 5 | 5 | 25 | AI üretimli içerikte persona drift ve politika ihlali en büyük risk; otomatik kapı şart |
| **P0** | Üç katmanlı mizah mimarisi: deadpan olay + anlatıcı yorumu + emergent çarpışma yorumu | 5 | 4 | 20 | İçerik maliyetini düşürür, algılanan içeriği çarpar, EN transcreation'ı kolaylaştırır |
| **P0** | `pickLine` seçim motoru: bağlam etiketi, spesifiklik, satır/tip cooldown, nadirlik, LRU | 5 | 4 | 20 | Tekrar yorgunluğu = churn; mekanizma yazarlıktan önce gelir |
| **P0** | `tr-suffix` kütüphanesi + slot lint | 4 | 5 | 20 | Şablon mizahı Türkçede bunsuz bozuk görünür; 1–2 gün iş |
| **P0** | "Sessizlik kuralı" + Roast Raporu yapısı (ölüm/kayıp akışı) | 5 | 4 | 20 | Motivasyon sütunu ve paylaşım anı burada; BoJack/Fleabag dersi |
| **P1** | "Felek'in ağzı" ayarı (Yumuşak/Normal/Sert) + "Nazik Mod" | 4 | 4 | 16 | Rıza mekanizması (benign violation), kapsayıcılık; düşük maliyet (etiket filtresi) |
| **P1** | Push kopyası politikası: Duolingo tersliği, haftada ≤ 5, suçluluk yok, lapsed'de "bırakıyorum" satırı | 4 | 4 | 16 | T7 ile uyumlu; ton ihlali bildirimlerde en görünür |
| **P1** | Anlatıcının yanılma/itiraf satırları (nadir havuz) | 4 | 3 | 12 | Özerklik + sevilebilirlik; paylaşım tetikler |
| **P1** | "Gerçek hayatta yardım" ekranı + düşük Keyif tetikleyicisi + güvenli anlatım ilkeleri | 4 | 4 | 16 | Politika zemini + marka güveni; T9 ile birlikte |
| **P1** | Yıl karnesi `year_report` + ömür sonu paylaşım kartı metni anlatıcı sesinde | 4 | 4 | 16 | "Oyun seni yargılıyor" + viral döngü (T7 paylaşım kartı) |
| **P2** | Zaytung tarzı haber bandı (`fake_headline`) ana ekranda | 3 | 4 | 12 | Cookie Clicker ticker; ucuz flavor; hukuk filtresi gerekli |
| **P2** | "Kahkaha günlüğü" playtest protokolü (5–8 kişi, RITE, satır tepki oranı) | 4 | 3 | 12 | Mizah ölçülmeden gönderilmez; T4 playtest ile birleşir |
| **P2** | İkincil sesler (Anne, İK) 2. fazda | 3 | 2 | 6 | Disco Elysium modeli; ilk sürümde persona tutarlılığı önce |
| **P2** | Mağaza "vitrin roast" havuzu (metadata 4+ kuralı) | 3 | 5 | 15 | Red riskini düşürür; ASO için de gerekli |

---

## Açık sorular

1. **Google Play politika metni birebir doğrulanmalı** (Inappropriate Content → Violence altındaki self-harm/suicide cümlesi; Sensitive Events; Tobacco and Alcohol) — bu oturumda support.google.com erişilemedi.
2. **ESRB/PEGI içerik tanımlayıcılarının güncel listesi ve IARC anketindeki "crude humor / mature humor" eşiği** doğrulanmalı; BitLife'ın güncel Apple/Play derecesi kontrol edilmeli.
3. **Akademik sayılar (Schneider 2018 meta-analiz korelasyonları, Yeager 2014 etki büyüklüğü, Yancey & Settles 2020 DAU etkisi)** birincil kaynaktan teyit edilmeli; bu belgede "yaklaşık" olarak verildi.
4. **Anlatıcı adı:** "Felek" mi, "Koç" mu, ikisi birden mi (rol + ad)? EN karşılığı T10 ile birlikte karar.
5. **Stat isimleri** T4 ve T8 arasında tutarsız (Keyif/Kafa/Çekicilik vs Mutluluk/Zekâ/Görünüm); anlatıcı satırları stat adına bağlı; Faz 2'de tek liste.
6. **Küfür seviyesi:** Sansürlü küfür (evren içi) tasarım kararı; "lan" gibi hafif argonun 16+'da yeri var mı? Playtest + IARC anketi sonrası.
7. **Gerçek hayat göndermeli push'lar (40/44/47/48)** etik ve retention açısından A/B ile test edilmeli; "ürkütücü" (Apple "creepy") algısı riski.
8. **AI üretimli satır oranı:** İnsan kürasyonu kapasitesi (günde kaç satır?) içerik hedefini (2.100 anlatıcı satırı) belirler; sprint planında ölçülmeli.
9. **Zaytung formatı için hukuki filtre** (T9): hayali kurum/şehir kullanımı yeterli mi, "yetkililer" ifadesi sorun mu?
10. **"Gerçek hayatta yardım" içeriği** (hat numaraları, metin) T9 hukuki kontrolünden geçmeli; EN pazarları için ülke bazlı liste gerekir (backend yok → paket içinde statik tablo).
11. **Nadirlik iletişimi:** "Nadir" rozetini göstermek mi (ödül hissi) gizlemek mi (keşif hissi)? Playtest.

---

## Kaynaklar

Etiketler: **[F]** bu oturumda doğrudan çekildi; **[B]** bilinen birincil kaynak, bu oturumda ağ kısıtı nedeniyle doğrulanamadı; **[K]** kardeş doküman.

1. [F] Apple — App Store Review Guidelines (1.1 Objectionable Content, 1.2 UGC, 1.4 Physical Harm, 2.3.6/2.3.8, 3.1.1, 4.2, 5.6): https://developer.apple.com/app-store/review/guidelines/
2. [B] Google Play — Developer Program Policy, Inappropriate Content: https://support.google.com/googleplay/android-developer/answer/9878810
3. [B] Google Play — Content ratings for apps and games (IARC): https://support.google.com/googleplay/android-developer/answer/9859655
4. [B] ESRB — Ratings Guide (kategoriler ve içerik tanımlayıcıları): https://www.esrb.org/ratings-guide/
5. [B] PEGI — What do the labels mean: https://pegi.info/what-do-the-labels-mean
6. [B] IARC — International Age Rating Coalition: https://www.globalratings.com/
7. [B] Martin, R. A., Puhlik-Doris, P., Larsen, G., Gray, J., & Weir, K. (2003). Individual differences in uses of humor and their relation to psychological well-being: Development of the Humor Styles Questionnaire. Journal of Research in Personality, 37(1), 48–75. https://doi.org/10.1016/S0092-6566(02)00534-2
8. [B] Schneider, M., Voracek, M., & Tran, U. S. (2018). "A joke a day keeps the doctor away?" Meta-analytical findings on humor styles and mental health. Scandinavian Journal of Psychology, 59(3). https://doi.org/10.1111/sjop.12432
9. [B] McGraw, A. P., & Warren, C. (2010). Benign violations: Making immoral behavior funny. Psychological Science, 21(8), 1141–1149. https://doi.org/10.1177/0956797610376073
10. [B] Keltner, D., Capps, L., Kring, A. M., Young, R. C., & Heerey, E. A. (2001). Just teasing: A conceptual analysis and empirical review. Psychological Bulletin, 127(2), 229–248. https://doi.org/10.1037/0033-2909.127.2.229
11. [B] Ryan, R. M., & Deci, E. L. (2000). Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being. American Psychologist, 55(1), 68–78. https://doi.org/10.1037/0003-066X.55.1.68
12. [B] Ryan, R. M., Rigby, C. S., & Przybylski, A. (2006). The motivational pull of video games: A self-determination theory approach. Motivation and Emotion, 30, 344–360. https://doi.org/10.1007/s11031-006-9051-8
13. [B] Breines, J. G., & Chen, S. (2012). Self-compassion increases self-improvement motivation. Personality and Social Psychology Bulletin, 38(9), 1133–1143. https://doi.org/10.1177/0146167212445599
14. [B] Yeager, D. S., et al. (2014). Breaking the cycle of mistrust: Wise interventions to provide critical feedback across the racial divide. Journal of Experimental Psychology: General, 143(2), 804–824. https://doi.org/10.1037/a0033906
15. [B] Mueller, C. M., & Dweck, C. S. (1998). Praise for intelligence can undermine children's motivation and performance. Journal of Personality and Social Psychology, 75(1), 33–52. https://doi.org/10.1037/0022-3514.75.1.33
16. [B] Kuiper, N. A. (2012). Humor and resiliency: Towards a process model of coping and growth. Europe's Journal of Psychology, 8(3), 475–491. https://doi.org/10.5964/ejop.v8i3.464
17. [B] Yancey, K. P., & Settles, B. (2020). A sleeping, recovering bandit algorithm for optimizing recurring notifications. KDD '20. https://doi.org/10.1145/3394486.3403351
18. [B] Duolingo Blog (bildirim ve streak yazıları): https://blog.duolingo.com/
19. [B] Carrot Weather — resmi site (kişilik/snark ayarları, abonelik): https://www.meetcarrot.com/weather/
20. [B] Ruskin, E. (Valve). AI-driven Dynamic Dialog through Fuzzy Pattern Matching. GDC 2012: https://www.gdcvault.com/play/1015317/AI-driven-Dynamic-Dialog-through
21. [B] Yarn Spinner — Documentation (satır seçim stratejileri): https://docs.yarnspinner.dev/
22. [B] Emily Short — Interactive Storytelling (prosedürel metin, salience, storylet yazıları): https://emshort.blog/
23. [B] Supergiant Games — Hades (anlatı sistemi, kelime hacmi için blog/röportajlar): https://www.supergiantgames.com/
24. [B] Dumb Ways to Die — resmi site: https://www.dumbwaystodie.com/
25. [B] Cookie Clicker (Orteil) — haber bandı ve flavor text: https://orteil.dashnet.org/cookieclicker/
26. [B] Bay 12 Games — Dwarf Fortress: https://www.bay12games.com/dwarves/
27. [B] BitLife — Candywriter: https://bitlifeapp.com/
28. [B] Zaytung: https://www.zaytung.com/
29. [B] Ekşi Sözlük: https://eksisozluk.com/
30. [B] WHO — Preventing suicide: a resource for media professionals (2023 güncellemesi): https://www.who.int/publications/i/item/9789240076846
31. [B] Samaritans — Media Guidelines for reporting suicide: https://www.samaritans.org/about-samaritans/media-guidelines/
32. [B] Yeşilay YEDAM (bağımlılık danışma hattı 115): https://www.yedam.org.tr/
33. [B] The Stanley Parable — Galactic Cafe / Crows Crows Crows: https://www.stanleyparable.com/
34. [B] Reigns — Nerial / Devolver Digital: https://www.devolverdigital.com/games/reigns
35. [K] T1 — Engagement/retention mekanikleri: `docs/research/01-engagement-retention-mekanikleri.md`
36. [K] T2 — Rakip ve pazar analizi (Carrot/Duolingo/Finch sayıları, Roast Raporu USP'si): `docs/research/02-rakip-ve-pazar-analizi.md`
37. [K] T4 — Hayat-sim sistem tasarımı (storylet motoru, stat seti, tone-lint, deterministik RNG): `docs/research/04-hayat-sim-sistem-tasarimi.md`
38. [K] T7 — Geri dönüş döngüsü ve live-ops (push politikası, streak): `docs/research/07-geri-donus-ve-liveops.md`
39. [K] T8 — UX/UI/FTUE (Hayat Akışı, anlatıcı balonu zamanlaması, time-to-first-laugh): `docs/research/08-ux-ui-ftue-ve-sanat-yonu.md`
