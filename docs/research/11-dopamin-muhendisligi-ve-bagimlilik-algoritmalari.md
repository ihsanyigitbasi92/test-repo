# T11 — Dopamin Mühendisliği
### "Bağımlılık yapan" oyun nasıl yapılır: nörobilim, ödül takvimleri, juice/game feel, somut algoritmalar ve sözde-kod (etik/yasal sınırla)

> Proje: Backend'siz, offline, Türkçe-öncelikli mobil hayat simülasyonu (18 yaşından ölüme). Ton: kara komedi + taşak geçen anlatıcı + gizli motivasyon. Bu belge, **T4 sistem tasarımı** (storylet motoru, yıl turu + beat'ler, director) üzerine oturan **ödül/pacing/retention katmanının** referans dokümanıdır. Her bölüm "Bu oyuna nasıl uygularız" ile biter; Bölüm 3'teki sözde-kodlar doğrudan `engine/` paketine taşınabilir.
> Tarih: 2026-11-05 · Yazar: Dopamin mühendisliği araştırma ajanı (T11)

---

## TL;DR

1. **Dopamin "zevk" değil "beklenti + tahmin hatası" sinyalidir.** Schultz'un prediction-error bulgusu ve Berridge'in *wanting ≠ liking* ayrımı aynı şeyi söyler: oyuncuyu tutan şey ödülün kendisi değil, ödülün *gelebileceği* hissidir. Bizim ürünümüz "ödül" değil, **"acaba ne olacak?" anı**dır.
2. **Belirsizlik %50'de zirve yapar** (Fiorillo, Tobler & Schultz 2003: dopamin nöronlarının sürekli aktivasyonu p=0,5'te maksimum, p=0 ve p=1'de sıfır). Çıkarım: kritik kararlarda başarı olasılığını **0,35–0,65 bandında** tutan bir "gerilim normalizasyonu" lazım; %95'lik kesin kazançlar ve %5'lik kesin kayıplar dopaminsizdir.
3. **Değişken oranlı pekiştirme + anti-açlık garantisi = "pity timer"lı sürpriz motoru.** Genshin'in 74/90 soft/hard pity'si gacha için ne ise, bizim "iyi sürpriz" motorumuz için aynı eğri geçerli: temel olasılık düşük, 8. beat'ten sonra rampa, 14. beat'te garanti. Para harcamayla hiçbir ilgisi yok; tamamen anlatı ödülü.
4. **Near-miss gerçek bir dopamin kaynağı, ama dozu var.** Clark 2009: "kıl payı kaçırma" kazanç devrelerini (striatum, insula) uyarır ve oynamaya devam isteğini artırır — *yalnızca oyuncu kontrol hissettiğinde*. Kassinove & Schare 2001: %30 near-miss oranı ısrarı maksimize eder, %45 ters teper. Bizde: başarısızlıkların en çok %30'u "az kaldı" olarak çerçevelenir, hepsi dürüsttür (gerçekten yakındı) ve asla ödemeye bağlanmaz.
5. **"Losses disguised as wins" (Dixon 2010) sadece slot için değil, UI için ders:** deri iletkenliği gerçek kazanç ile LDW'de aynı, sesle daha da yükseliyor. Biz kaybı kazanç gibi *göstermeyeceğiz* (bu aldatıcı), ama **her sonuca bir "kazanım" ekleyeceğiz** (kötü olay → yeni ribbon ilerlemesi, anlatıcı esprisi, legacy puanı). Kayıp bile "içerik kazanmak" olur.
6. **Royal Match'in Candy Crush'ı geçme sebebi "sürtünmeyi sıfırlamak"tı:** daha hızlı animasyon, retry'da hedef ekranı yok, oto-karıştırma, her 10 seviyede rahatlama. Bizim eşdeğerimiz: **"Yaşlan" basıldıktan sonra 300 ms içinde ilk metin, oturum başına ≥1 rahatlama beat'i, hiç "yükleniyor" yok.**
7. **Monopoly Go ($6 milyar/1.275 gün — Sensor Tower) formülü = her an 2–3 paralel ilerleme çubuğu + koleksiyon albümü + partner etkinliği.** Backend'siz versiyonu: her oturumda görünür 3 aktif hedef (ribbon ilerlemesi, haftalık seed hayatı, legacy eşiği).
8. **Wordle, sıfır backend'le viral olmanın kanıtı:** günde 1 kıtlık + spoiler'sız paylaşım gridi. Bizde "Günün Hayatı" (tarih-seed'li, herkese aynı rastgelelik) + emoji'li hayat özeti paylaşımı.
9. **Duolingo'nun resmi verisi: Streak Wager D7 retention'ı +%14 artırdı;** hafta sonu DAU %5–10 düşer; 2 freeze stoklama DAU'yu artırdı. Bizde: affedici streak (7 günde 1 "kaytarma hakkı" birikir, 2 stok), hafta sonu için "Pazar Bonusu", para ile streak satın alma YOK.
10. **Juice = zaman sayıları:** Swink'in ~100 ms tepki eşiği, Material'ın 100 ms (küçük bileşen)/300 ms (tam ekran) kuralı, Apple'ın "haptik'i görsel+sesle eşle, aşırı kullanma" ilkesi. Bölüm 3(i) her ödül tipi için ms, SFX, haptik ve kopya şablonu verir.
11. **Erken ölüm spirali kabul edilemez:** ilk 10 oyun yılı (18–28) "koruma altı" — para ve sağlık hasarı çarpanı 0,5'ten 1,0'a lineer yükselir, "anne borç verdi" kurtarma olayı sadece bu pencerede. Geç oyun gergin kalır.
12. **Ölçüm backend'siz de mümkün:** cihazda ring-buffer telemetri + dev build "tuning dashboard" + **10.000 sentetik hayat** çalıştıran headless simülasyon (ödül aralığı dağılımı, maksimum negatif seri, ölüm yaşı, para persentilleri). Hedef KPI'lar: ilk kahkaha < 90 sn, ilk iyi sürpriz < 2 dk, D1 ≥ %35, D7 ≥ %12, oturum 10–15 dk.
13. **Etik çizgi nettir ve kârlıdır:** AB CPC Ağı Ekim 2026'da 9 oyun şirketine (Candy Crush, Clash of Clans dahil) sanal para/dark pattern için harekete geçti; AB Komisyonu Şubat 2026'da TikTok'un sonsuz kaydırma/otomatik oynatma/push bildirimlerini DSA ihlali saydı; İngiltere DMCC Act sahte aciliyeti "her koşulda haksız" listesine aldı; Türkiye Reklam Kurulu 2022'den beri karanlık tasarımlara ceza kesiyor. Publisher'a sunulacak hikâye: "dopamin var, dolandırıcılık yok."
14. **Kabul listesi:** değişken anlatı ödülü, dürüst near-miss, affedici streak, koleksiyon, juice, pacing, legacy çarpanı. **Ret listesi:** paralı loot box, harcamaya bağlı near-miss, enerji duvarı, kayıp-kovalama monetizasyonu, zaman baskısıyla satış, sahte geri sayım.
15. **En yüksek kaldıraçlı 3 iş:** (1) Reward Schedule Engine + Pacing Director (Bölüm 3a, 3c), (2) Juice spec'inin ilk 6 ödül tipi için uygulanması (3i), (3) Simülasyon harness'ı (Bölüm 4) — bu üçü olmadan içerik ne kadar komik olursa olsun "bir yıl daha" hissi oluşmaz.

---

## Varsayımlar

- Teknoloji ve sistem modeli T4'ten alınmıştır: React Native/Expo + TypeScript; motor saf TS; tur = 1 yıl, yıl 2–5 beat'e bölünür; 70 yıllık hayat ≈ 225 beat ≈ 55–75 dk; mobil oturum 8–20 dk (≈ 30–50 beat).
- Statlar: Sağlık, Keyif, Kafa, Çekicilik, Para + komedi metreleri (Ego, Cringe, Anne Baskısı) + gizli Karma ve Stres. Bu belgede "Şans" (Luck) adında **yeni bir gizli stat** öneriliyor; Karma ile ilişkili ama ayrı.
- Monetizasyon modeli (T3) burada yalnızca etik sınır bağlamında geçer; varsayılan: reklam (opsiyonel, ödüllü) + tek seferlik "reklamsız" + kozmetik/içerik paketleri. **Hiçbir ödül mekaniği ödeme gerektirmez.**
- Backend yok: tüm telemetri cihazda kalır; "paylaşım" = ekran görüntüsü/emoji metni; haftalık mod tarih-seed'li.
- Rastgelelik deterministik (sfc32 + seed) olduğundan buradaki tüm olasılıklar simülasyonla doğrulanabilir.
- Oyuncu yaşı 18+ hedeflenir (ton gereği); yine de çocukların oynayabileceği varsayılarak "reşit olmayanlara yönelik dürtme" içeren hiçbir mekanik yoktur.

---

## 1. Oyun ödülünün nörobilimi — bulgu → metin oyununa kural

### 1.1 Dopamin bir "tahmin hatası" ve "isteme" sinyalidir

Schultz, Dayan ve Montague'nun 1997'de formüle ettiği modelde dopamin nöronları ödülün kendisine değil, **beklenen ile gelen arasındaki farka** ateşler: beklenmedik ödül → güçlü ateşleme; beklenen ödül → ateşleme ipucuya kayar; beklenen ödül gelmezse → ateşleme düşer [1][2]. Berridge ve Robinson bunu tamamlar: dopamin "liking" (hazzın kendisi) için değil, "wanting" (incentive salience — ödüle doğru çekilme) için gereklidir; sensitizasyon "wanting"i artırırken "liking"i artırmaz, bağımlılığın özü budur [3][4].

**Metin oyunu için anlamı:** "Yaşlan" butonu bir ipucudur (cue). Oyuncu bu butona bastığında dopamin zaten akar — ödül gelmeden önce. Tasarım hedefi, butona basma anının "acaba?" değerini korumak; yani (a) sonuçların bir kısmının gerçekten tahmin edilemez olması, (b) her yılın en az bir "beklenmeyen" içermesi, (c) beklentinin bazen de üstüne çıkılması ("beklenenden iyi" = pozitif tahmin hatası).

### 1.2 Belirsizlik %50'de zirve yapar

Fiorillo, Tobler ve Schultz (Science, 2003) maymunlarda ipucu ile ödül arasında **sürekli, rampa şeklinde** bir dopamin aktivitesi ölçtü; bu rampa ödül olasılığı p=0,5'te maksimum, p=0,25 ve 0,75'te daha zayıf, p=0 ve p=1'de yoktu [5][6]. Niv, Duff ve Dayan (2005) bunun ortalama alma artefaktı olabileceğini tartıştı; Fiorillo ve ark. tek-deneme verisiyle yanıtladı [6]. Tartışma sürse de pratik sonuç sağlam: **sonucu kesin olan şeyler heyecan üretmez.**

**Metin oyunu için anlamı:** Kritik karar beat'lerinde (terfi, evlilik teklifi, sınav, iş görüşmesi) görünür/hissedilen başarı olasılığı 0,35–0,65 bandına çekilmeli. Oyuncunun statları çok yüksekse zorluk artmalı (Bölüm 3d'deki rubber band yalnızca aşağı değil yukarı da çalışır); çok düşükse "garanti kayıp" yerine "düşük ama var" olasılık sunulmalı. Oyuncu olasılığı sayısal görmese de hissetmeli ("Patron sana bakıp 'bakarız' dedi. Bu %50 demek, biliyorsun.").

### 1.3 Değişken oranlı pekiştirme ve compulsion loop

Ferster ve Skinner'ın (1957) takvim çalışmalarından beri bilinir: değişken oranlı (VR) pekiştirme sabit oranlıdan daha yüksek tepki hızı ve söndürmeye daha fazla direnç üretir [7]. Hopson'ın 2001 "Behavioral Game Design" makalesi bunu oyun tasarımına taşıdı; "compulsion loop" (beklenti → aktivite → ödül → yatırım) kavramı buradan türedi [8][9]. Eyal'in Hook modeli (tetikleyici → eylem → değişken ödül → yatırım) aynı döngünün ürün dilidir [10]. Önemli bir uyarı: Princeton teknik raporu VR takvimlerin oyunlarda her zaman tercih edilmediğini bulmuştur — oyuncular "adaletsiz" hissettiğinde VR ters teper [9].

**Metin oyunu için anlamı:** Gacha yok, ama storylet seçimi zaten rastgele; buna bir **katman** ekliyoruz: "iyi sürpriz" (beklenmedik miras, viral olma, eski sevgiliden mesaj, absürt talih) olayları VR takvimle ama **anti-açlık garantisiyle** gelir (3a). "Yatırım" adımı: oyuncu her yıl bir şey biriktirir (ribbon ilerlemesi, NPC anısı, legacy puanı) ve bu yatırım bir sonraki tetikleyiciyi yükler.

### 1.4 Near-miss etkisi

Clark ve ark. (Neuron, 2009): slot benzeri görevde near-miss sonuçları, parasal kazançla aynı striatal ve insula devrelerini uyardı; katılımcılar near-miss'i nahoş bulsa da oynama isteği arttı — **ama sadece oyuncu seçimi kendisi yaptığında** (kontrol illüzyonu) [11][12]. Kassinove ve Schare (2001): near-miss oranı %30 iken ısrar en yüksek, %15 ve %45'te daha düşük (ters U) [13]. Harrigan'ın çalışmaları ticari slotların near-miss'i şanstan çok daha sık ürettiğini, Ontario standartlarının bunu "şansın 12 katı"yla sınırladığını not eder [14].

**Metin oyunu için anlamı:** Near-miss'in dopamin gücü anlatıda bedavaya kullanılabilir: "Terfi listesinde ikinci sıradaydın; birinci, müdürün yeğeniydi." Kurallar: (1) near-miss yalnızca gerçekten yakın başarısızlıklarda (zar marjı < %15) üretilir — *yalan near-miss yok*; (2) oranı başarısızlıkların en fazla %30'u; (3) near-miss'in ardından aynı hedefte gizli +bonus — yani "az kaldı" sözü tutulur; (4) oyuncunun karar verdiği beat'lerde kullanılır (kontrol koşulu), pasif olaylarda değil; (5) asla ödeme/reklam ile "tamamlama" seçeneği yok (Bölüm 5).

### 1.5 Kayıptan kaçınma ve loss chasing

Tversky ve Kahneman'ın prospect teorisinde kayıplar kazançlardan yaklaşık 2 kat ağır hissedilir (λ≈2,25) [15]; Tom ve ark. (Science, 2007) bireysel kayıp aversiyonunun ventral striatum ve prefrontal aktiviteyle öngörülebildiğini gösterdi [16]. Kumar literatüründe kayıp kovalama ile kayıp aversiyonu ilişkisi karışıktır; problemli kumarbazlarda kayıp aversiyonu kontrol grubundan farklı olmayabiliyor (Takeuchi 2015) [17].

**Metin oyunu için anlamı:** İki yönlü kullanılır. **Olumlu:** streak, ribbon ilerlemesi, NPC ilişkileri "kaybedilebilir" şeylerdir; kaybetme ihtimali geri dönüş motivasyonudur (Duolingo etkisi). **Yasak:** kaybı telafi etmek için harcamaya itmek (kayıp kovalama monetizasyonu), "streak'ini kurtarmak için 49 TL". Ayrıca λ≈2 demek, bir kötü olayın iki iyi olaya bedel olduğu demektir; Pacing Director'ın "üst üste 2'den fazla negatif yok" kuralı buradan gelir.

### 1.6 Kazanç gibi gösterilen kayıplar (LDW) ve ses

Dixon ve ark. (Addiction, 2010): çok hatlı slotlarda bahsinden az kazanan ("loss disguised as win") oyuncularda deri iletkenliği tepkisi gerçek kazançla aynı, normal kayıptan belirgin yüksek [18]. 2013 takip çalışmasında ses açıkken SCR daha yüksek, kazanç sayısını abartma %24'e karşı %15 [19]. Sonuç: **ödül "sinyali" (ses, ışık) bedenin ödül tepkisini tek başına üretebiliyor.**

**Metin oyunu için anlamı:** Bu bulgu iki şeyi söyler. (1) Juice gerçekten işe yarar; dopamin "ses+ışık"a tepki verir. (2) Kaybı kazanç gibi sunmak aldatıcıdır ve regülatörlerin tam da peşinde olduğu şeydir. Bizim dürüst versiyonumuz: **her sonucun gerçek bir kazanımı olsun**, ve o kazanım juice'lansın. Kötü olay → "Rezil Oldun" ribbon'unda +1, anlatıcıdan bir espri, legacy +2. Kayıp gizlenmiyor; kaybın yanındaki gerçek kazanım kutlanıyor.

### 1.7 Flow ve optimal zorluk

Csikszentmihalyi'nin flow'u beceri–zorluk dengesinde yaşanır [20]; Chen'in "Flow in Games" tezi (2006) ve CACM makalesi (2007) oyuncuya **kendi zorluğunu bilinçsizce seçtirmeyi** (player-centric DDA) savunur; pasif DDA yerine seçenek gömme [21][22].

**Metin oyunu için anlamı:** Hayat sim'inde "zorluk" = para baskısı + sağlık erozyonu + sosyal kriz sıklığı. Chen'in modeli bize şunu verir: oyuncu riskli seçeneği (startup kur, kumarhaneye gir, anneye karşı gel) seçerek zorluğu kendi yükseltir; director bunu okur ve riskli oyuncuya daha yüksek varyanslı olaylar verir. Güvenli oynayanı cezalandırmayız, ama "sıkıcı hayat" anlatıcı esprisiyle dürteriz ("Beş yıldır aynı maaş. Netflix bile seni 'hâlâ izliyor musun' diye kontrol ediyor.").

### 1.8 Merak ve bilgi boşluğu

Loewenstein (Psychological Bulletin, 1994): merak, bilgi boşluğunun algılanmasından doğan bir yoksunluk hissidir; hiç bilmediğimiz şeye merak duymayız, **"neredeyse biliyorum"** noktasında merak zirve yapar [23].

**Metin oyunu için anlamı:** Cliffhanger ve "pending outcome" kuyruğunun (3l) teorik temeli. Yıl sonunda "Gelecek yıl: patronun seni odasına çağıracak" gibi *kısmi* bilgi vermek, hiç vermemekten de tam vermekten de daha güçlüdür. Ribbon ilerlemesi de aynı: "%80 — neyi kaçırdığını biliyorsun" merak üretir; "%10" üretmez (3e'deki gizleme eşiği).

### 1.9 Alışkanlık döngüleri

Wood ve ark.: günlük davranışların yaklaşık %43'ü aynı bağlamda tekrar eden alışkanlıklardır; alışkanlık irade değil, **bağlam ipucu + kolay tekrar + ödül** ister [24]. Duhigg'in cue–routine–reward'ı aynı modelin popüler halidir [25].

**Metin oyunu için anlamı:** Alışkanlık, bildirim göndermekle değil, oyuncunun kendi zaman bağlamına (sabah serviste, gece yatmadan) yerleşmekle kurulur. Bu yüzden bildirim algoritması (3f) oyuncunun **ölçülen** alışkanlık saatini hedefler; ritüel içerik ("Günün Hayatı") her gün aynı saatte açılır; açılış → ilk beat 2 dokunuştan uzun olmaz.

### 1.10 Goal gradient ve endowed progress

Nunes ve Drèze (JCR, 2006): 8 damga gereken oto yıkama kartında 2 damga hediyeli verilenler kartı belirgin daha hızlı tamamladı; "ilerleme verildi" hissi ısrarı artırıyor [26]. Kivetz, Urminsky ve Zheng (2006) hedefe yaklaştıkça çabanın arttığını (goal gradient) gösterdi [27].

**Metin oyunu için anlamı:** Her yeni hayat bazı ribbon'lara "doğuştan ilerleme" ile başlar (ör. "Globetrotter 1/20 — doğduğun şehirden çıkmak sayılır"); progress hint eşikleri (3e) goal gradient'i tetikler.

### 1.11 Etik literatürü

Zagal, Björk ve Lewis (FDG 2013) "dark game design patterns"i tanımladı: zamansal (grinding, playing by appointment), parasal (pay to skip, pre-delivered content), sosyal (social pyramid schemes) [28]. Deterding, Stenros ve Montola (DiGRA 2020) kavramın etik analiz için verimli olmadığını savundu — bağlam ve rıza önemli [29]. King ve Delfabbro (Addiction 2018; IJMHA 2019): "predatory monetization" = uzun vadeli maliyeti oyuncu finansal/psikolojik olarak bağlanana kadar gizleyen sistemler; loot box'lar beceri gerektirmediği ve rastgele olduğu için slotla işlevsel olarak benzer; 13 maddelik sosyal sorumluluk planı [30][31].

**Metin oyunu için anlamı:** Literatürün ortak paydası: sorun "değişken ödül" değil, **ödülün paraya ya da gizli maliyete bağlanması ve oyuncudan bilgi saklanması**. Bizim sınırımız bu: tüm takvimler ücretsiz oyunda çalışır, hiçbiri harcamayla hızlanmaz, oyun içi "şans" statı oyuncuya ima edilir ama kullanılarak satılmaz.

### Bulgu → kural tablosu

| Bulgu | Kaynak | Metin hayat-sim'i için kural |
|---|---|---|
| Dopamin = beklenti + tahmin hatası | Schultz 1997; Berridge 2007 | "Yaşlan" anının belirsizliğini koru; her yılda ≥1 beklenmeyen |
| p=0,5'te belirsizlik zirvesi | Fiorillo 2003 | Kritik karar olasılıklarını 0,35–0,65'e normalize et |
| VR takvim + söndürme direnci | Ferster & Skinner 1957; Hopson 2001 | İyi sürpriz VR takvimle, ama pity garantisi ile |
| Near-miss kazanç devresini uyarır, kontrol şart | Clark 2009 | Near-miss sadece oyuncu kararı olan beat'lerde, dürüst, ≤%30 |
| Near-miss %30'da ısrar maks | Kassinove & Schare 2001 | NEAR_MISS_RATE_MAX = 0,30 |
| Kayıp ≈ 2× kazanç | Tversky & Kahneman 1992 | Negatif beat sonrası ≥2 pozitif/nötr; üst üste >2 negatif yok |
| LDW ses + ışıkla ödül tepkisi üretir | Dixon 2010/2013 | Juice gerçek kazanımlara; kayıp gizlenmez |
| Flow = beceri/zorluk; oyuncu seçimi | Chen 2006 | Risk iştahını oku, varyansı ona göre ayarla |
| Bilgi boşluğu merakı | Loewenstein 1994 | Kısmi teaser; %30–80 arası ilerleme göster |
| Alışkanlık = bağlam + kolaylık | Wood 2002 | Alışkanlık saatine bildirim; 2 dokunuşta beat |
| Endowed progress | Nunes & Drèze 2006 | Yeni hayata hediye ilerleme |
| Dark pattern = gizli maliyet + rıza yokluğu | Zagal 2013; King & Delfabbro 2018 | Hiçbir takvim paraya bağlı değil |

**Bu oyuna nasıl uygularız:** Nörobilimden çıkan tek cümle: *oyuncunun kafasında her an bir "acaba" olsun, ama "acaba"nın cevabı adil ve dürüst gelsin.* Bunu üç sistem taşır: Reward Schedule Engine (ne zaman iyi sürpriz), Pacing Director (hangi sırayla), Pending Outcome Queue (yıl sonunda ne askıda). Üçü de Bölüm 3'te.

---

## 2. Vaka çalışmaları: en "bağımlılık yapan" oyunlar ve feed'ler

| Oyun / ürün | Mekanizma (bilinen sayılarla) | Psikolojik sürücü | Bize aktarılır mı? |
|---|---|---|---|
| **Candy Crush Saga** | 5 can, 30 dk'da 1 can yenilenir; "testere dişi" zorluk: duvar seviyeyi 5–6 kolay/orta seviye izler; +5 hamle satışı zorluk eğrisiyle el ele [32][33] | Kıtlık (can), VR (board rastgeleliği), sunk cost | **Kısmen.** Testere dişi → Pacing Director'da "zor yıl → 2 rahat yıl". Can/enerji duvarı → **HAYIR** (etik ret listesi). |
| **Royal Match (Dream Games)** | En hızlı swap animasyonu, cascade sürerken eşleşme, büyük parçalar, 5 temel parça (çoğu seviye 4), retry'da hedef ekranı atlanır, hamle kalmayınca oto-karıştırma, her 10 seviyede bonus/rahatlama; zaman pencereli sınırsız can; 2023'ten beri küresel ilk 10 [34][35][36] | Sürtünme sıfır → flow; sık "rewarded" anlar | **EVET, tamamen.** Juice/latency hedefleri ve "her 10 beat'te rahatlama" kuralı doğrudan alınır. |
| **Monopoly Go (Scopely)** | 1.275 günde $6 milyar IAP (Sensor Tower); 2024'te $1,58 milyar (AppMagic); zar = enerji; 2–3 aylık sticker albümleri (21–22 set × 9 sticker + prestige setler); albüm başına 3 partner etkinliği; "Sticker Boom" +%50 pencereleri; aynı anda birden fazla etkinlik [37][38][39][40] | Paralel ilerleme çubukları, koleksiyon tamamlama, sosyal hediye, FOMO | **Kısmen.** "Her an 3 görünür hedef" ve albüm fikri alınır. Zar enerjisi, paralı sticker paketleri → HAYIR. |
| **Coin Master** | 5 ücretsiz spin / ~50 dk, 50 kapasite; raid engellenemez, saldırı kalkanla engellenir (kalkan sayısı sınırlı → retention kancası); kart setleri → spin/pet ödülü; 2019'da $100M+ [41][42] | VR (spin), sosyal rekabet/intikam, koleksiyon | **Zayıf.** Spin loop = slot; biz almayız. "Kart seti tamamlama" fikri ribbon'larda zaten var. |
| **Clash Royale** | Sandık zamanlayıcısı (min 3 saat), 4 slot; dolu sandık → oynamaya devam ya da bırakma noktası; kupa yolu ödülleri [43][44] | "Bir maç daha", gecikmeli ödül, kayıp korkusu (kupa) | **Fikir olarak evet:** "bekleyen sonuç" (3l) = sandık; ama zamanlayıcı *gerçek zamanlı* değil *oyun yılı* bazlıdır, para ile hızlanmaz. |
| **Genshin Impact (gacha)** | 5★ temel %0,6; soft pity ~74. çekiliş; hard pity 90 (silah 80, soft 65); 50/50 ve garanti devri [45][46] | VR + pity ile "adil" hissi, sunk cost | **Algoritma olarak EVET, para olarak HAYIR.** Pity eğrisi iyi sürpriz motorumuzun şablonu. |
| **Fortnite Battle Pass** | Sezonluk 100 kademe, sezon sonunda ödüller kaybolur; ilk kademeler hızlı | Endowed progress, FOMO, sunk cost | **Kısmen.** "Sezon" = haftalık tema/seed ve ribbon seti; kaybolma yok, arşive geçer (FOMO'nun yumuşak hali). |
| **Pokémon GO** | Günün ilk yakalaması 500 XP/600 Stardust; 7 günlük seri 2.500 XP/3.000 Stardust; gün yerel saatle sıfırlanır [47] | Günlük ritüel, hafta hedefi | **EVET.** 1/7 günlük–haftalık çift katmanlı streak modeli. |
| **Wordle** | Günde 1 bulmaca (Wardle: kıtlık bilinçli seçim); herkes aynı kelime → eşzamanlı ritüel; emoji grid spoiler'sız paylaşım → Aralık 2021 viral [48][49] | Kıtlık, sosyal karşılaştırma, kimlik | **EVET, en önemli sıfır-backend ders.** "Günün Hayatı" + emoji özet. |
| **Duolingo** | Streak; freeze stoklama (2 adet, 2024); Streak Wager A/B: D1/D7/D14 artışı, D7 +%14 (resmi blog); hafta sonu DAU −%5–10 → Weekend Amulet; 100 günde Streak Society + 3 freeze (fan wiki) [50][51] | Kayıp aversiyonu + affedicilik | **EVET.** Affedici streak + haftasonu koruması; Wager'ın parasız versiyonu (legacy puanı ile "iddia"). |
| **TikTok feed** | Sonsuz kaydırma, otomatik oynatma, push, kişiselleştirilmiş öneri; AB Komisyonu 6 Şubat 2026 ön bulgu: DSA ihlali (bağımlılık yapan tasarım) [52][53] | VR (her video bir çekiliş), anında geri bildirim, sıfır karar maliyeti | **Ders olarak evet, mekanik olarak hayır.** "Sıfır sürtünmeli sonraki beat" alınır; sonsuz kaydırma yok, oturum doğal bitiş noktaları (yıl sonu) korunur. |
| **Slot makineleri** | Near-miss şansın çok üstünde; LDW; kazanç sesi; "machine zone" (Schüll) [14][18][54] | VR, near-miss, duyusal ödül | **Yalnızca dürüst near-miss ve juice dersleri.** |
| **Vampire Survivors / Balatro / Slay the Spire** | Build sinerjisi keşfi, üstel sayı büyümesi, run bazlı meta kilit açma; Balatro'nun skor animasyonu "anında dopamin"; Portsmouth: VS "bir tur daha" tasarımı kumar psikolojisinden besleniyor [55][56][57] | "Number go up", keşif, kombinasyon merakı | **EVET.** Trait sinerjileri ("Kripto Gurusu + Anne Baskısı = Anne kripto aldı"), run = hayat, meta = legacy. |
| **Cookie Clicker / idle** | Üstel sayılar, offline kazanç, prestige sıfırlaması [58] | Number go up, "yokken bile büyüdü" | **Kısmen.** Offline kazanç yok (hayat sim'de anlamsız), ama legacy çarpanı ve prestige eğrisi (3g) buradan. |
| **BitLife** | "Yaşlan" = mikro-ödül; rastgele olay dopamini; ribbon'lar (30–40 adet) ölümde verilir, hayat başına 1; ribbon'lar çakışır → kasıtlı oynama [59][60] | VR olay, koleksiyon, kimlik ("Hangi hayatı yaşadım?") | **EVET, taban.** Ribbon modelini genişletiyoruz: hayat başına birden fazla, ilerleme göstergeli, "absürt başarımlar". |

### Üç vakadan derin notlar

**Royal Match, "hissiyat" ile kazandı.** Deconstructor of Fun ve Naavik analizleri aynı şeyi söylüyor: Dream Games meta karmaşıklığına değil basitliğe gitti, yazılı anlatıyı ve dekorasyon zorlamasını kaldırdı, animasyonları kısa ve kontrollü tuttu, cascade sürerken bile eşleşmeye izin verdi [34][35]. Bizim "swap hızı" eşdeğerimiz: beat metninin "Yaşlan"dan sonra ≤300 ms'de ekranda olması, seçim butonlarının bir sonraki beat'e geçerken animasyonu beklememesi (tıklama animasyonu kesebilir). "Retry'da hedef ekranı yok" eşdeğeri: ölümden sonra yeni hayata 2 dokunuşla başlamak.

**Monopoly Go, "aynı anda birden fazla ilerleme" ile kazandı.** Albüm (uzun), partner etkinliği (orta), turnuva (kısa) — üç zaman ölçeği her an görünür [38][40]. Bizim offline üçlümüz: **hayat içi hedefler** (bu hayatta açılabilecek 2–3 ribbon, ilerleme çubuklu), **haftalık "Günün Hayatı" sezonu** (7 gün, tarih-seed'li), **legacy eşiği** (bir sonraki prestige çarpanına kalan puan). Hepsi cihazda hesaplanır.

**Wordle, "paylaşılabilir kimlik" ile kazandı.** Oyuncu sonucu değil, *kendini* paylaşıyordu [48]. Bizde: hayat sonu "mezar taşı kartı" — emoji'li 5 satırlık özet ("🍼→🎓→💸→🏝️→⚰️ 67 yaşında, 3 evlilik, 1 kripto, anne hâlâ kızgın") + ribbon ikonları. Spoiler yok, çünkü herkesin hayatı farklı; ama haftalık seed modunda "aynı kaderle sen ne yaptın" karşılaştırması var.

**Bu oyuna nasıl uygularız:** Vakalardan çıkan "aktarılabilir" liste: (1) sürtünmesiz beat geçişi (Royal Match), (2) 3 paralel görünür hedef (Monopoly Go), (3) günde-bir ritüel + paylaşılabilir özet (Wordle), (4) affedici streak (Duolingo), (5) pity eğrili sürpriz (Genshin), (6) sinerji keşfi ve run-meta (Balatro/VS), (7) ribbon koleksiyonu (BitLife). "Aktarılmaz" liste: enerji/can duvarı, paralı spin/loot box, gerçek zamanlı paralı zamanlayıcı, sonsuz kaydırma, kaybı kazanç gibi gösterme.

---

## 3. Algoritmalar — bizim oyun için tasarım ve sözde-kod

Tüm kodlar TypeScript-benzeri sözde-koddur; `rng` deterministik (sfc32, T4) ve her çağrı `rng.next()` ∈ [0,1) döner. Sabitler Bölüm 7'deki tablodan gelir (`C.*`). Beat = director'ın oynattığı tek olay; yıl 2–5 beat.

### 3(a) Reward Schedule Engine — pity eğrili "iyi sürpriz" enjeksiyonu

Amaç: oyuncu hiçbir zaman "hiç iyi bir şey olmuyor" demesin, ama iyi şeyler tahmin edilemesin. Model Genshin'in soft/hard pity'si [45]: temel olasılık düşük, `SOFT_PITY` beat'inden sonra lineer rampa, `HARD_PITY`'de garanti. Ek olarak dakika bazlı garanti (uzun süre tek beat'te oyalanan oyuncu için) ve enflasyon freni (çok sık sürpriz, sürprizin değerini düşürür).

```ts
type SurpriseTier = 'nice' | 'great' | 'legendary';

interface RewardState {
  beatsSinceSurprise: number;      // son iyi sürprizden beri beat
  msSinceSurprise: number;         // son iyi sürprizden beri gerçek süre
  surprisesThisSession: number;
  luck: number;                    // gizli stat, 0..1, ortalamaya döner
  legendaryBeatsSince: number;     // 'legendary' için ayrı pity
}

const C = {
  SURPRISE_BASE_P: 0.08,           // beat başına temel olasılık
  SURPRISE_SOFT_PITY: 8,           // rampa başlangıcı (beat)
  SURPRISE_HARD_PITY: 14,          // garanti (beat) ≈ 4–5 dk oyun
  SURPRISE_RAMP_STEP: 0.12,        // soft pity sonrası beat başına artış
  SURPRISE_TIME_GUARANTEE_MS: 6 * 60_000, // 6 dk hiç sürpriz yoksa zorla
  SURPRISE_MIN_GAP: 3,             // iki sürpriz arası min beat (enflasyon freni)
  SURPRISE_SESSION_CAP: 6,         // oturum başına üst sınır (≈30–50 beat)
  LEGENDARY_BASE_P: 0.006,         // Genshin 5★ ile aynı taban
  LEGENDARY_SOFT_PITY: 60, LEGENDARY_HARD_PITY: 90, LEGENDARY_RAMP_STEP: 0.06,
  LUCK_MEAN: 0.5, LUCK_REVERSION: 0.15, LUCK_NOISE: 0.08,
};

function surpriseProbability(s: RewardState): number {
  if (s.beatsSinceSurprise < C.SURPRISE_MIN_GAP) return 0;
  if (s.surprisesThisSession >= C.SURPRISE_SESSION_CAP) return 0;
  if (s.beatsSinceSurprise >= C.SURPRISE_HARD_PITY) return 1;
  if (s.msSinceSurprise >= C.SURPRISE_TIME_GUARANTEE_MS) return 1;
  const ramp = Math.max(0, s.beatsSinceSurprise - C.SURPRISE_SOFT_PITY) * C.SURPRISE_RAMP_STEP;
  return Math.min(1, C.SURPRISE_BASE_P + ramp);
}

// Şans, sıklığı değil BÜYÜKLÜĞÜ etkiler: adalet hissi için sıklık herkese eşit.
function rollSurprise(s: RewardState, rng: RNG): SurpriseTier | null {
  if (rng.next() >= surpriseProbability(s)) { s.beatsSinceSurprise++; s.legendaryBeatsSince++; return null; }
  let tier: SurpriseTier = 'nice';
  const pLegend = s.legendaryBeatsSince >= C.LEGENDARY_HARD_PITY ? 1
    : C.LEGENDARY_BASE_P + Math.max(0, s.legendaryBeatsSince - C.LEGENDARY_SOFT_PITY) * C.LEGENDARY_RAMP_STEP;
  if (rng.next() < pLegend) { tier = 'legendary'; s.legendaryBeatsSince = 0; }
  else if (rng.next() < 0.25 + 0.3 * (s.luck - 0.5)) tier = 'great';   // luck ±0.15 etkisi
  s.beatsSinceSurprise = 0; s.msSinceSurprise = 0; s.surprisesThisSession++;
  return tier;
}

// Her yıl sonu: şans ortalamaya döner + küçük gürültü + karma etkisi (T4'teki gizli stat)
function updateLuck(s: RewardState, karma: number, rng: RNG) {
  const target = C.LUCK_MEAN + 0.2 * (karma - 0.5);
  s.luck += C.LUCK_REVERSION * (target - s.luck) + (rng.next() - 0.5) * 2 * C.LUCK_NOISE;
  s.luck = clamp(s.luck, 0.1, 0.9);
}
```

Beklenen davranış (hesap): `p=0,08` ile 8 beat boyunca sürpriz görmeme olasılığı 0,92⁸≈0,51; rampa ile 12. beat'te kümülatif ≈ %93, 14'te %100. Ortalama aralık ≈ 7–8 beat (≈ 2–3 dk). Simülasyon (Bölüm 4) bu dağılımı doğrular. "Legendary" ortalama ~70 beat'te bir (hayat başına ~3), hard pity ile en geç 90.

Sürpriz içeriği storylet havuzundan `tag: surprise.{tier}` ile seçilir (3h'deki novelty ağırlıklarıyla). Sürpriz **para olmak zorunda değil**: viral olma, eski dost, absürt talih, anlatıcının "bu sefer sana torpil yapıyorum" demesi.

### 3(b) Narrative Near-Miss Generator

```ts
interface CheckResult { success: boolean; margin: number; /* -1..1, (roll - threshold) */ goalId: string; playerChose: boolean }

const C_NM = { WINDOW: 0.15, MAX_RATE: 0.30, PER_SESSION_CAP: 2, PER_GOAL_COOLDOWN_YEARS: 2, FOLLOWUP_BONUS: 0.10 };

function frameOutcome(r: CheckResult, st: NearMissState, rng: RNG): 'win' | 'nearMiss' | 'loss' {
  if (r.success) return 'win';
  const eligible =
    r.playerChose &&                                   // Clark 2009: kontrol koşulu
    Math.abs(r.margin) <= C_NM.WINDOW &&               // dürüstlük: gerçekten yakındı
    st.sessionCount < C_NM.PER_SESSION_CAP &&
    (st.lastYearByGoal[r.goalId] ?? -99) + C_NM.PER_GOAL_COOLDOWN_YEARS <= st.year;
  if (!eligible) return 'loss';
  // Kassinove & Schare: başarısızlıkların ≤%30'u near-miss olarak çerçevelenir
  const observedRate = st.nearMissCount / Math.max(1, st.failCount);
  if (observedRate >= C_NM.MAX_RATE) return 'loss';
  st.nearMissCount++; st.sessionCount++; st.lastYearByGoal[r.goalId] = st.year;
  st.pendingBonus[r.goalId] = C_NM.FOLLOWUP_BONUS;    // "az kaldı" sözü tutulur
  return 'nearMiss';
}
```

Kopya şablonu (near-miss): `"{goal} için {margin_text}. {narrator_roast}. {hint}"` → "Terfi için listede ikinciydin. Birinci, müdürün yeğeni. Gelecek yıl aynı kapıyı çalarsan şansın daha yüksek; bunu ben söylüyorum, müdür değil." `hint` cümlesi **doğrudur**: `pendingBonus` gerçekten uygulanır. Oyuncu asla "near-miss'i tamamla: izle/öde" seçeneği görmez.

### 3(c) Pacing / Drama Director — oturum yoğunluk eğrisi

T4'teki director (Left 4 Dead modeli) olay *seçer*; bu katman olayların **valans ve yoğunluk sırasını** düzenler. Oturum uzunluğu bilinmez; `expectedSessionBeats` oyuncunun son 5 oturumunun medyanından tahmin edilir (ilk oturumda 35).

```ts
type Valence = -2 | -1 | 0 | 1 | 2;           // storylet meta etiketi
interface Beat { id: string; valence: Valence; intensity: number /*0..1*/; isLOL?: boolean; tags: string[] }

const C_PD = {
  MAX_NEG_STREAK: 2, LOL_INTERVAL: 12, LOL_JITTER: 3,
  RELAX_EVERY: 10,                     // Royal Match: her 10 seviyede rahatlama
  CURVE: (t: number) =>                // t = beatIndex / expectedSessionBeats ∈ [0,1]
    t < 0.15 ? 0.25 + t * 2                 // calm → rising (0.25→0.55)
    : t < 0.75 ? 0.55 + (t - 0.15) * 0.6    // rising (0.55→0.91)
    : t < 0.85 ? 0.95                       // peak
    : 0.45,                                 // release (ve cliffhanger)
};

function scoreCandidate(b: Beat, ctx: DirectorCtx): number {
  let s = ctx.baseSalience(b);                                    // T4: spesifiklik + novelty
  const target = C_PD.CURVE(ctx.beatIndex / ctx.expectedSessionBeats);
  s -= 2.0 * Math.abs(b.intensity - target);                      // eğriye uzaklık cezası
  if (ctx.negStreak >= C_PD.MAX_NEG_STREAK && b.valence < 0) s -= 100;   // sert kural
  if (ctx.negStreak === 1 && b.valence < 0) s -= 0.8;             // ikinci negatif pahalı
  if (ctx.beatsSinceLOL >= C_PD.LOL_INTERVAL - C_PD.LOL_JITTER && b.isLOL) s += 1.5;
  if (ctx.beatsSinceLOL >= C_PD.LOL_INTERVAL + C_PD.LOL_JITTER && !b.isLOL && ctx.lolAvailable) s -= 0.5;
  if (ctx.beatIndex % C_PD.RELAX_EVERY === 0 && b.intensity > 0.4) s -= 1.0;   // rahatlama beat'i
  if (ctx.isLikelySessionEnd() && b.tags.includes('cliffhanger')) s += 2.0;    // bkz. 3(l)
  return s;
}
```

`isLikelySessionEnd()` = `beatIndex ≥ 0.85 × expectedSessionBeats` **veya** oyuncu son 3 beat'te yavaşladı (ortalama beat süresi ×1,8) **veya** cihaz saat dilimine göre oyuncunun alışılmış bitiş saatine 5 dk kaldı. LOL olayları (`isLOL`) yazar tarafından etiketlenir ve playtest "kahkaha günlüğü" ile doğrulanır (Bölüm 4). Hayat başına LOL havuzu tükenmemeli: 225 beat / 12 ≈ 19 LOL/hayat; havuz ≥ 120 LOL storylet (lansman), novelty ile tekrar azaltılır.

### 3(d) Dinamik zorluk / rubber band — para ve sağlık

İlk 10 oyun yılı (18–28) "koruma penceresi": hasar çarpanı 0,5→1,0 lineer artar; kurtarma olayları sadece bu pencerede. Geç oyunda koruma yok, ama "ölüm spirali" (para<0 ∧ sağlık<20) üst üste 3 yıl sürerse **anlatısal** çıkış (absürt kurtuluş) tetiklenir — bu bir pity'dir, hile değil.

```ts
function protection(age: number): number {         // 1 → tam koruma, 0 → yok
  return clamp(1 - (age - 18) / 10, 0, 1);
}
function applyDamage(kind: 'money' | 'health', raw: number, st: LifeState, rng: RNG): number {
  const p = protection(st.age);
  const mult = 1 - 0.5 * p;                         // 18 yaşında ×0.5, 28'de ×1.0
  let dmg = raw * mult;
  // yukarı yönlü rubber band: çok rahat oyuncuya varyans ekle (Fiorillo: kesinlik sıkıcı)
  if (kind === 'money' && st.money > 20 * st.monthlyCost) dmg *= 1 + 0.5 * rng.next();
  return dmg;
}
function bailoutCheck(st: LifeState, rng: RNG): StoryletId | null {
  if (st.money < 0 && protection(st.age) > 0 && !st.flags.bailoutUsed) {
    st.flags.bailoutUsed = true;                     // hayat başına 1
    return pick(['anne_borc_verdi', 'dayi_is_buldu', 'ev_arkadasi_kira_odedi'], rng);
  }
  if (st.spiralYears >= 3 && st.age >= 28) {         // geç oyun anlatısal pity
    st.spiralYears = 0;
    return pick(['absurt_miras', 'eski_patron_pisman', 'kripto_geri_geldi'], rng);
  }
  return null;
}
```

Hedef gerilim: Fiorillo'ya göre kritik kontrollerin hissedilen başarı olasılığı 0,35–0,65 bandında olmalı. Bunun için `effectiveThreshold = baseThreshold + k × (playerStat − populationMedianStat)`; `k=0,5` ile stat avantajının yarısı "zorluk artışı" olarak geri alınır. Oyuncu hâlâ avantajlıdır (adalet) ama sonuç hâlâ belirsizdir (dopamin).

### 3(e) Koleksiyon / nadirlik sistemi — ribbon'lar ve absürt başarımlar

Gacha yok; "nadirlik" = koşulun 10.000 simüle hayatta ne sıklıkta sağlandığı. Tier'lar simülasyonla kalibre edilir, elle değil.

| Tier | Hedef karşılaşma oranı (hayat başına) | Örnek |
|---|---|---|
| Sıradan (gri) | %40–70 | "Kira Zammı Kurbanı", "Mezun" |
| Nadir (mavi) | %10–25 | "Üç Evlilik", "Dünya Turu" |
| Epik (mor) | %2–6 | "Kripto Milyoneri (gerçekten)", "Anneyi Memnun Etti" |
| Efsanevi (altın) | %0,3–1 | "100 Yaşında Öldü", "Anlatıcıyı Sustardı" |

Goal-gradient ve bilgi boşluğu için ilerleme gösterimi üç eşikli:

```ts
function progressHint(r: RibbonDef, p: number /*0..1*/): HintMode {
  if (p < 0.30) return 'hidden';                 // Loewenstein: hiç bilmeyen merak etmez → gizli, ama "??? ribbon" sayacı görünür
  if (p < 0.80) return 'bar';                    // "Dünya Turu 9/20"
  return 'almostThere';                          // "Az kaldı: 2 ülke" + hafif juice
}
// Endowed progress: yeni hayatta her ribbon için başlangıç ilerlemesi (Nunes & Drèze)
function seedProgress(r: RibbonDef): number { return r.requires.length >= 5 ? 1 : 0; }   // "doğduğun şehir sayılır"
```

Ribbon ölümde değil **anında** verilir (BitLife'tan fark): anlık dopamin + "bir ribbon daha var mı" merakı. Hayat sonu kartında hepsi listelenir. "Absürt başarımlar" ayrı bir koleksiyondur (ör. "Aynı yıl hem terfi hem terk edildi"), gizli, keşfedildiğinde "sen bunu nasıl yaptın?" anlatıcı tepkisiyle.

### 3(f) Streak / günlük ritüel + affedicilik + bildirim zamanlama

Ritüel = günde en az 1 "Yaşlan" (herhangi bir hayatta) **veya** Günün Hayatı'nda 1 beat. Model: Pokémon GO'nun 1/7 ikili katmanı [47] + Duolingo'nun freeze stoklaması [50][51].

```ts
const C_ST = { FREEZE_EARN_EVERY_DAYS: 7, FREEZE_CAP: 2, REPAIR_WINDOW_H: 48, REPAIR_COST_BEATS: 3, WEEKEND_SHIELD: true };

function onDayTick(st: StreakState, today: LocalDate) {
  const gap = daysBetween(st.lastPlayed, today);
  if (gap <= 1) return;
  let missed = gap - 1;
  if (C_ST.WEEKEND_SHIELD) missed -= countWeekendDays(st.lastPlayed, today);   // Duolingo: hafta sonu DAU −%5–10
  while (missed > 0 && st.freezes > 0) { st.freezes--; missed--; st.log.push('freeze_used'); }
  if (missed > 0) { st.brokenAt = today; st.repairDeadline = addHours(today, C_ST.REPAIR_WINDOW_H); }
}
function onPlayed(st: StreakState, today: LocalDate, beatsPlayed: number) {
  if (st.brokenAt && today <= st.repairDeadline && beatsPlayed >= C_ST.REPAIR_COST_BEATS) {
    st.brokenAt = null;                              // onarım: para değil, OYUN ile
  } else if (st.brokenAt) { st.current = 0; st.brokenAt = null; }
  st.current++; st.best = Math.max(st.best, st.current);
  if (st.current % C_ST.FREEZE_EARN_EVERY_DAYS === 0) st.freezes = Math.min(C_ST.FREEZE_CAP, st.freezes + 1);
  if (st.current === 7 || st.current === 30 || st.current === 100) grantMilestone(st.current);   // 7: ribbon, 30: anlatıcı seslendirme, 100: "Streak Society" eşdeğeri + 3 freeze
}
```

**Bildirim zamanlama (lokal, backend'siz):** oyuncunun alışkanlık saati son 14 oturumun başlangıç saatlerinin **dairesel ortalaması** (gece yarısı sorununu çözer), yakın oturumlar ağırlıklı.

```ts
function habitualHour(sessions: SessionLog[]): { hour: number; confidence: number } {
  const recent = sessions.slice(-14);
  let x = 0, y = 0, w = 0;
  recent.forEach((s, i) => { const wi = 0.8 ** (recent.length - 1 - i); const a = s.startLocalHour / 24 * 2 * Math.PI;
    x += wi * Math.cos(a); y += wi * Math.sin(a); w += wi; });
  const R = Math.hypot(x, y) / w;                                    // 1 → çok düzenli, 0 → dağınık
  const hour = ((Math.atan2(y, x) / (2 * Math.PI)) * 24 + 24) % 24;
  return { hour, confidence: R };
}
function scheduleNotifications(st: PlayerState, risk: ChurnRisk) {
  cancelAllScheduled();                                              // iOS: en fazla 64 bekleyen istek [62]
  if (!st.notificationsOptIn || st.ignoredInRow >= 3) return;        // 3 yoksayma → 7 gün sessizlik
  const h = habitualHour(st.sessions);
  const fireHour = h.confidence > 0.5 ? h.hour - 0.5 : 19.5;          // düzenliyse alışkanlıktan 30 dk önce; değilse 19:30
  for (let d = 1; d <= 7; d++) {                                     // yalnızca 7 gün ileri (limit + copy güncelliği)
    const copy = pickCopy(st, risk, d);                               // 3(j) churn kopyası + 3(l) bekleyen sonuç
    scheduleLocal(atLocal(d, fireHour), copy, { channel: 'ritual', quietHours: [23, 8] });
  }
}
```

Kopya her zaman **oyun içi gerçeğe** dayanır: "Patron yarın karar verecek. Sen de verirsin herhalde." (pending outcome varsa) / "Streak 12. gün. Anne bile bu kadar düzenli aramıyor." Sahte aciliyet ("son 2 saat!") yok; günde en fazla 1; Apple 4.5.4 gereği promosyon içermez [61].

### 3(g) "Number go up" meta — ömür skoru, legacy, prestige

```ts
// Yıl skoru: log para (zenginliğin azalan getirisi) + statlar + olay puanları + komedi bonusu
function yearScore(y: YearSummary): number {
  const moneyTerm = 10 * Math.log10(1 + Math.max(0, y.netWorthReal) / 1000);   // 1k→10, 1M→40, 1B→70
  const statTerm = 0.1 * (y.health + y.joy + y.brain + y.charm);                 // 0..40
  const eventTerm = y.ribbonsEarned * 15 + y.lolBeats * 2 + y.surprises * 3;
  const chaosBonus = 5 * Math.min(3, y.absurdEvents);                             // kaos ödüllendirilir
  return moneyTerm + statTerm + eventTerm + chaosBonus;
}
// Hayat skoru: yılların toplamı × yaşam süresi çarpanı (uzun yaşamak ödül, ama lineer değil)
lifeScore = Σ yearScore(y) × (1 + 0.3 × Math.log(1 + yearsLived / 20));
// Legacy puanı: log sıkıştırma → erken hayatlar hızlı, sonrakiler yavaş ama hep > 0
legacyPoints = Math.floor(25 × Math.log2(1 + lifeScore / 2000));   // lifeScore 2000 → 25 LP, 8000 → 58, 30000 → 100
// Prestige çarpanı: kare kök → 10. prestige'de ×1.25, 25'te ×1.4, 100'de ×1.8 (asla kırılmaz)
prestigeMult = 1 + 0.08 × Math.sqrt(prestigeLevel);
// Prestige eşiği: üstel ama yumuşak → "bir sonrakine 120 LP" hep ulaşılabilir görünsün
nextPrestigeCost = 100 × 1.18 ** prestigeLevel;
```

Neden böyle: Cookie Clicker'ın üstel sayıları hayat sim'de "anlamsız milyarlar"a döner; log sıkıştırma ile skor **okunabilir** (0–10.000 bandı) kalır ve her hayat anlamlı artış verir. Prestige çarpanı statlara değil **başlangıç seçeneklerine** uygulanır (yeni trait, yeni şehir, yeni absürt kariyer) — güç enflasyonu yerine içerik enflasyonu.

### 3(h) Novelty yönetimi — görülmemişe öncelik, tekrar cezası, sürpriz bütçesi

```ts
const C_NV = { UNSEEN_BOOST: 1.6, SEEN_DECAY: 0.55, RECENCY_WINDOW_LIVES: 2, RECENCY_PENALTY: 0.3, VARIANT_ROTATE: true,
               SURPRISE_BUDGET_PER_SESSION: 3 /* 'wow' etiketli (legendary/LOL/twist) */ };

function noveltyWeight(sl: Storylet, mem: PlayerMemory): number {
  const seen = mem.seenCount[sl.id] ?? 0;
  if (seen === 0) return C_NV.UNSEEN_BOOST;
  let w = C_NV.SEEN_DECAY ** seen;                                     // 1.→0.55→0.30→0.17
  if (mem.currentLife - (mem.lastSeenLife[sl.id] ?? -99) <= C_NV.RECENCY_WINDOW_LIVES) w *= C_NV.RECENCY_PENALTY;
  return Math.max(w, 0.02);                                            // asla tam sıfır (havuz tükenmesin)
}
function pickVariant(sl: Storylet, mem: PlayerMemory): TextVariant {   // T4: her olayın 2–3 metin varyantı
  return sl.variants.sort((a, b) => (mem.seenCount[a.id] ?? 0) - (mem.seenCount[b.id] ?? 0))[0];   // en az görülen
}
function withinSurpriseBudget(sl: Storylet, s: SessionState): boolean {
  return !sl.tags.includes('wow') || s.wowCount < C_NV.SURPRISE_BUDGET_PER_SESSION;
}
```

Yarn Spinner'ın "Random Best Least Recently Viewed" stratejisi (T4) temel; buradaki ek, hayatlar arası hafıza ve "wow" bütçesi. 10.000 hayat simülasyonunda hedef: **ilk 3 hayatta tekrar oranı < %15, 10. hayatta < %40** (lansman 700 olay × 2,5 varyant ile ulaşılabilir, Bölüm 4).

### 3(i) Juice spec — her ödül tipi için ses + haptik + animasyon + kopya

Zaman referansları: Swink'in ~100 ms algılanan tepki sınırı [63]; Material'ın küçük bileşen 100 ms / tam ekran 300 ms kuralı [64]; Apple HIG'in "haptik'i görsel ve sesle eşle, aşırı kullanma, `prepare()` ile gecikmeyi azalt" ilkesi [65]; Vlambeer/Nijman'ın "küçük eklemelerin birikmesi" (The Art of Screenshake) ve Jonasson & Purho'nun "Juice it or lose it" ilkeleri [66][67].

| Ödül tipi | Görsel | Süre | Ses | Haptik (iOS / Android eşdeğeri) | Kopya şablonu |
|---|---|---|---|---|---|
| Beat metni geldi | Fade-in + 4 px yukarı kayma | 120 ms | yok (sessiz tur) | yok | — |
| Seçenek dokunuldu | Buton scale 0,96→1, sonraki beat'e geçerken kesilebilir | 80 ms | kısa "tık" | `selection` | — |
| Para +N | Sayaç tick-up (ease-out), +N yeşil etiket uçar | 400 ms (N<1k), 650 ms (N≥1k) | coin kaskadı 3–7 tık | `impact.light` | "+{N} TL. Harcayacaksın, biliyorum." |
| Para −N | Sayaç tick-down, kırmızı etiket, hafif aşağı kayma | 300 ms | tek "dımm" bas | `impact.light` | "−{N} TL. {neden}. Not aldım." |
| Stat +/− | Bar animasyonu + ikon pulse | 250 ms | yumuşak "ping"/"pong" | yok (sık olay) | ikon + sayı |
| İyi sürpriz (nice) | Kart 1 kez "pop" (scale 1→1,06→1), konfeti yok | 350 ms | 2 notalı yükselen | `notification.success` | "Bak sen. {olay}." |
| İyi sürpriz (great) | Kart pop + arka plan renk dalgası + hafif ekran sallanma (2 px, 120 ms) | 600 ms | 3 notalı fanfar (kısa) | `impact.medium` ×2 (90 ms ara) | "Bu normalde olmaz. {olay}. Tadını çıkar." |
| Efsanevi | Ekran flaşı 60 ms beyaz → "legendary" altın çerçeve çizilir → 4 px sallanma 200 ms → konfeti | 1.200 ms toplam, atlanabilir | fanfar + alkış kuyruğu | `impact.heavy` + 200 ms sonra `notification.success` | "{olay}. Anlatıcı olarak ben bile şaşırdım." |
| Near-miss | Bar hedefe 0,9'a kadar dolar, 150 ms durur, 0,85'e geri çekilir | 700 ms | yükselen ses + kesik "çıt" | `impact.rigid` tek | "{hedef} için {marj}. {roast}. {dürüst ipucu}." |
| Ribbon açıldı | Rozet sağdan girer, 1 kez parlar; "X/Y koleksiyon" etiketi | 800 ms | madalya "ding" | `notification.success` | "Ribbon: {ad}. {absürt tanım}." |
| "Az kaldı" (≥%80) | İlerleme çubuğu nabız (2 döngü) | 2×400 ms | yok | yok | "Az kaldı: {kalan}." |
| Streak milestone | Alev ikon büyür, sayı ters döner | 500 ms | hafif "whoosh" | `notification.success` | "{N} gün. {roast}." |
| LOL beat (yazar etiketli) | Metin **gecikmeli** gelir: setup → 350 ms bekleme → punchline satırı | +350 ms | yok | yok | — (comic timing: Quinn'in "zamanlama, teslim" notu [68]) |
| Yıl bitti / cliffhanger | Takvim sayfası çevrilir, "Gelecek yıl:" teaser 2 satır | 450 ms | sayfa | `impact.light` | "Gelecek yıl: {pending_outcome_teaser}" |
| Ölüm | Siyah kesit, mezar taşı yazısı harf harf (typewriter 25 ms/harf, atlanabilir) | ≤2.000 ms | tek çan | `notification.warning` | "{ad}, {yaş}. {ribbonlar}. {anlatıcı vedası}" |

Kurallar: (1) Hiçbir animasyon girişi bloke etmez; dokunma animasyonu keser. (2) Haptik oturumda en fazla ~1/10 beat (Apple: aşırı kullanım hissizleştirir). (3) Ses kapalıysa haptik + görsel ikilisi aynı bilgiyi taşır. (4) Efsanevi ve ölüm animasyonları "Atla" ile 1 dokunuşta geçilir. (5) Negatif olaylarda juice **daha az** — kaybı dramatize etmek LDW'nin tersi bir aldatma olur; kayıp sade, kazanım parlak.

### 3(j) Offline churn risk heuristiği → bildirim kopyası ve hoş geldin ödülü

```ts
interface ChurnRisk { score: number /*0..1*/; tier: 'healthy' | 'cooling' | 'atRisk' | 'lapsed' }

function churnRisk(sessions: SessionLog[], now: Date): ChurnRisk {
  const gaps = gapsBetween(sessions.slice(-6));                         // son 5 aralık (saat)
  const gapGrowth = gaps.length >= 3 ? gaps.at(-1)! / median(gaps.slice(0, -1)) : 1;   // >1.5 → uzuyor
  const lens = sessions.slice(-6).map(s => s.beats);
  const lenTrend = lens.length >= 3 ? mean(lens.slice(-2)) / Math.max(1, mean(lens.slice(0, -2))) : 1;  // <0.6 → kısalıyor
  const hoursSince = (now.getTime() - sessions.at(-1)!.end.getTime()) / 3.6e6;
  const base = clamp((hoursSince - 24) / 144, 0, 1);                    // 1 gün→0, 7 gün→1
  const score = clamp(0.5 * base + 0.3 * clamp((gapGrowth - 1) / 2, 0, 1) + 0.2 * clamp((1 - lenTrend), 0, 1), 0, 1);
  const tier = score < 0.25 ? 'healthy' : score < 0.5 ? 'cooling' : score < 0.8 ? 'atRisk' : 'lapsed';
  return { score, tier };
}
```

| Tier | Bildirim kopyası tonu | Hoş geldin ödülü (sabit, **artmaz**) |
|---|---|---|
| healthy | Pending outcome teaser, roast | yok |
| cooling | "Patron hâlâ bekliyor. Ben de." | küçük: 1 freeze (cap içinde) |
| atRisk | Özlemli-alaycı: "Hayatın askıda. Gerçek hayatın da öyle mi?" | orta: "Dönüş Yılı" — bir sonraki yılda garantili 'great' sürpriz |
| lapsed (≥7 gün) | Tek bildirim, sonra sessizlik (3 yoksayma kuralı) | "Yeni hayat paketi": 1 hediye ribbon ilerlemesi + anlatıcı "geri döndün" özel beat'i |

Kritik etik not: ödül tier'ı **sabittir ve ayrılmayı ödüllendirecek şekilde büyümez** (aksi hâlde oyuncuya "7 gün gitmezsen daha çok alırsın" öğretilir; bu hem kötü tasarım hem manipülasyon).

### 3(k) UI'da değişken sürpriz — nadir anlatıcı araları ve easter egg'ler

```ts
const C_AS = { ASIDE_P_PER_BEAT: 0.04, ASIDE_ONCE_PER_LIFE: true, DATE_EGGS: true };
function maybeAside(ctx: BeatCtx, rng: RNG): Aside | null {
  const pool = asides.filter(a => a.cond(ctx) && !(C_AS.ASIDE_ONCE_PER_LIFE && ctx.life.seenAsides.has(a.id)));
  if (pool.length === 0 || rng.next() >= C_AS.ASIDE_P_PER_BEAT) return null;
  return weightedPick(pool, a => a.rarity === 'legendary' ? 0.1 : a.rarity === 'rare' ? 0.3 : 1, rng);
}
```

Örnek koşullar: oyuncu 3 beat'e 2 sn'den hızlı bastıysa ("Okumuyorsun değil mi? Ben de yazmıyorum o zaman."), cihaz saati 03:00 ("Saat üç. Hayat simülasyonu oynuyorsun. Simüle edilen sen misin?"), oyuncunun gerçek doğum günü (opt-in profilden), Cuma akşamı, 1 Ocak, aynı seçeneği 5 kez seçmek, para tam 0 TL. Easter egg'ler **tek seferlik** olduğundan "keşif" dopamini (Loewenstein) verir ve topluluk paylaşımı üretir ("saat 3'te oynayınca anlatıcı ne dedi biliyor musunuz").

### 3(l) "Bir yıl daha" — bekleyen sonuç kuyruğu (pending-outcome queue)

Clash Royale'in sandığı ve Loewenstein'ın bilgi boşluğu burada birleşir: **yıl sonunda her zaman 1–2 çözülmemiş iplik olsun.**

```ts
interface PendingOutcome { id: string; resolvesInYears: 1 | 2 | 3; teaser: string; weight: number; sourceBeat: string }
const C_PO = { MIN_OPEN: 1, MAX_OPEN: 2, TEASER_SHOWN: 1 };

function onYearEnd(st: LifeState, rng: RNG) {
  st.pending.forEach(p => p.resolvesInYears--);
  const due = st.pending.filter(p => p.resolvesInYears <= 0);
  due.forEach(p => st.director.enqueueForced(p.id));                   // gelecek yılın ilk beat'lerinde çözülür
  st.pending = st.pending.filter(p => p.resolvesInYears > 0);
  while (st.pending.length < C_PO.MIN_OPEN) {                           // iplik yoksa aç
    const seed = st.director.pickThreadOpener(st, rng);                 // 'patron_karar', 'test_sonucu', 'eski_sevgili_mesaj', 'gizemli_zarf'
    st.pending.push({ ...seed, resolvesInYears: pick([1, 1, 2], rng) as 1|2 });
  }
  if (st.pending.length > C_PO.MAX_OPEN) st.pending.sort((a, b) => b.weight - a.weight).length = C_PO.MAX_OPEN;
  st.ui.yearEndTeaser = st.pending.slice(0, C_PO.TEASER_SHOWN).map(p => p.teaser);   // "Gelecek yıl: ..."
}
```

Yıl sonu ekranı: özet (3 satır) → "Gelecek yıl: {teaser}" → tek büyük buton "Yaşlan". Teaser **kısmi**dir (Loewenstein): "Patronun seni odasına çağıracak" (ne için, belirsiz). Oturum sonu tespit edildiğinde (3c) director en yüksek ağırlıklı ipliği **açar ama çözmez** — cliffhanger. Bildirim kopyası aynı teaser'ı kullanır (3f), yani bildirim oyunun gerçeğinden türer, uydurma değildir.

**Bu oyuna nasıl uygularız (Bölüm 3 özeti):** Uygulama sırası: (1) 3a + 3c + 3l motorun çekirdeğine (storylet seçimi zaten var; bunlar skorlama katmanı), (2) 3i'nin ilk 6 satırı (metin, seçenek, para ±, nice/great sürpriz, yıl sonu) UI'a, (3) 3e ribbon + 3g skor (meta), (4) 3f streak + bildirim, (5) 3b near-miss, 3d rubber band, 3h novelty (içerik hacmi büyüyünce), (6) 3j churn, 3k aside'lar (cila). Her adım Bölüm 4 harness'ında test edilir.

