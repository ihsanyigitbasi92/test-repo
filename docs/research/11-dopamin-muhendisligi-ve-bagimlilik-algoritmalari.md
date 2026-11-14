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

---

## 4. Ölçüm: backend'siz tuning

### 4.1 Lokal telemetri (cihazda kalır)

Her beat için tek satırlık olay: `{ t, lifeId, age, beatId, valence, intensity, surpriseTier, nearMiss, ribbon, moneyDelta, healthDelta, msSincePrev, sessionId }`. Cihazda 50.000 satırlık ring-buffer (SQLite/MMKV, ~5 MB). Oyuncu **ayarlardan** "Oyun verimi dışa aktar" ile JSON paylaşabilir (playtest için; KVKK/GDPR: kişisel veri yok, cihaz kimliği yok, isteğe bağlı). Analytics SDK (ör. Firebase) opsiyoneldir; sadece toplu sayaçlar (D1/D7, oturum süresi) gönderilir, beat düzeyi değil. Oyun SDK'sız tamamen çalışır.

### 4.2 Dev build "tuning dashboard"

Dev build'de gizli ekran (7 kez versiyon numarasına dokun). Paneller: (1) **Sürpriz aralığı histogramı** (beat ve dakika), pity tetiklenme oranı; (2) **Valans dizisi** şeridi (son 60 beat; kırmızı seri uzunluğu); (3) **LOL aralığı** gerçek vs hedef; (4) **Para/sağlık eğrileri** yaşa göre, koruma penceresi işaretli; (5) **Ribbon unlock oranları** vs hedef tier aralığı; (6) **Novelty**: tekrar oranı, görülmemiş havuz yüzdesi; (7) **Streak/bildirim**: alışkanlık saati + güven, planlanan bildirimler, yoksayma sayacı; (8) **Churn skoru** canlı. Tüm sabitler (`C.*`) bu ekrandan slider ile canlı değiştirilebilir ve `tuning.json` olarak dışa aktarılır.

### 4.3 Simülasyon harness: 10.000 sentetik hayat

```ts
// packages/engine/sim/run.ts — headless, CI'da çalışır (hedef: 10k hayat < 60 sn, Node)
for (const persona of ['safe', 'risky', 'chaotic', 'speedrunner', 'completionist']) {
  for (let i = 0; i < 2000; i++) {
    const life = simulateLife({ seed: hash(persona, i), policy: personaPolicy[persona], tuning: C });
    collect(life.metrics);     // surpriseGaps[], maxNegStreak, lolGaps[], deathAge, moneyByAge[], healthByAge[], ribbons[], repeats, nearMissRate, bailouts
  }
}
assert(p95(surpriseGaps) <= 14 && median(surpriseGaps) in [6, 9]);
assert(max(maxNegStreak) <= 2);
assert(median(lolGaps) in [9, 15] && p95(lolGaps) <= 20);
assert(median(deathAge) in [72, 80] && p05(deathAge) >= 45);          // T4: medyan ~75
assert(pct(lives, l => l.money[28] < 0) <= 0.05);                     // ilk 10 yıl spiral yok
assert(ribbonRate('legendary') in [0.003, 0.01]);
assert(repeatRate(life3) < 0.15 && repeatRate(life10) < 0.40);
assert(nearMissRate <= 0.30);
```

Persona politikaları basit kurallardır (ör. `risky`: en yüksek varyanslı seçeneği seç; `speedrunner`: her zaman ilk seçenek). Her tuning değişikliği PR'ında harness çalışır; assert'ler kırmızıysa merge yok. Ek çıktı: `sim-report.html` (dağılım grafikleri) — dashboard ile aynı panel seti.

### 4.4 Playtest protokolü ("eğlence" için)

GDC'deki küçük ekip pratikleri [76] + komedi tasarımı notları [68][77] + T4'teki RITE yaklaşımı:

1. **Katılımcı:** oturum başına 5–8 kişi, hedef kitle (18–35, TR), yarısı BitLife oynamış.
2. **Ölçülen zamanlar (kronometre, gözlemci):** uygulama açılışı → ilk beat (hedef < 10 sn), **ilk kahkaha/burun sesi** (hedef < 90 sn; yüksek sesle okunan metinlerin gülme anı loglanır), ilk "iyi sürpriz" (hedef < 2 dk), ilk ribbon (hedef < 5 dk), ilk "bir yıl daha" (oyuncu bırakmaya niyetlenip devam ederse işaretle).
3. **Sesli düşünme** + oturum sonu 5 soru: "Yarın açar mısın? Neden?", "En komik an?", "Haksızlık hissettiğin an?", "Ne zaman bırakmak istedin?", "Birine ne gönderirdin?" (paylaşım testi).
4. **Kahkaha günlüğü:** her LOL etiketli beat için gerçekleşen gülme oranı; %40'ın altında kalan beat etiketi kaybeder ve yeniden yazılır.
5. **RITE:** her oturumdan sonra bariz sorunlar düzeltilir, bir sonraki oturum yeni build ile.
6. **Haftalık uzak test:** TestFlight/Internal Testing, 20–30 kişi, dışa aktarılmış lokal telemetri + 3 soruluk form; D1/D7 bu gruptan elle hesaplanır.

### 4.5 Hedef KPI'lar

GameAnalytics 2025/2026 benchmark'larında tüm oyunlar medyanı D1 ≈ %22, D7 < %4, D30 ≈ %0,7–0,8; üst çeyrek D1 ≈ %26–33 [75]. Simülasyon türü için üçüncü taraf blog D1 ≈ %30 veriyor (doğrulanmadı). Hedeflerimiz:

| KPI | Lansman hedefi | Publisher pitch hedefi | Nasıl ölçülür |
|---|---|---|---|
| D1 / D7 / D30 | %35 / %12 / %5 | %40 / %18 / %8 | Opsiyonel SDK veya uzak test grubu |
| Oturum süresi (medyan) | 10–15 dk | 15 dk | Lokal |
| Oturum/gün | 2 | 2,5 | Lokal |
| İlk kahkaha | < 90 sn | < 60 sn | Playtest |
| İlk iyi sürpriz | < 2 dk | < 90 sn | Lokal (beat index) |
| "Bir yıl daha" oranı (yıl sonu ekranında devam) | > %80 | > %85 | Lokal |
| Hayat tamamlama (ölüme ulaşma) | > %55 ilk hayat | > %65 | Lokal |
| Streak 7 gün ulaşan | > %15 yükleyen | > %20 | Lokal |
| Paylaşım (mezar kartı) | > %5 hayat sonu | > %10 | Lokal (share intent) |

**Bu oyuna nasıl uygularız:** Sim harness Sprint 0'da (motor iskeletiyle birlikte) kurulur; dashboard Sprint 1; playtest protokolü ilk oynanabilir build'den itibaren haftalık. KPI'lar publisher görüşmesinde "soft launch planı" olarak sunulur.

---

## 5. Etik ve yasal çizgi

### 5.1 Kabul / ret tablosu

| Mekanik | Durum | Gerekçe ve kaynak |
|---|---|---|
| Değişken anlatı ödülü (pity'li sürpriz motoru) | **KABUL** | Para ile ilişkisiz; şans statı sıklığı değil büyüklüğü etkiler; King & Delfabbro'nun "gizli maliyet" kriterine girmez [30] |
| Dürüst near-miss (≤%30, gerçek marj, takip bonusu) | **KABUL (şartlı)** | Clark/Kassinove bulgularını kullanır; aldatma yok; asla satın alma/reklam ile tamamlanmaz |
| Affedici streak, hafta sonu kalkanı, oyunla onarım | **KABUL** | Duolingo pratiği; para ile streak satın alma yok |
| Koleksiyon/ribbon, "az kaldı" ipucu | **KABUL** | Goal-gradient; satın alınabilir ribbon yok |
| Juice (ses/haptik/animasyon), atlanabilir | **KABUL** | Kayıplar sade, kazanımlar parlak; LDW benzeri "kaybı kazanç gibi gösterme" yok |
| Pacing, cliffhanger, bekleyen sonuç | **KABUL** | Anlatı tekniği; oyuncu her yıl sonunda bırakabilir, doğal durak korunur |
| Legacy/prestige çarpanı | **KABUL** | İçerik açar, güç satmaz |
| Yerel bildirim (alışkanlık saati, günde ≤1, 3 yoksayma → sessizlik) | **KABUL** | Apple 4.5.4: promosyon yok, opt-in, opt-out [61]; EC'nin TikTok bulgusunda push bildirimleri "bağımlılık yapan tasarım" kalemi — bizde düşük frekans ve içerik-bağlı [52] |
| Hoş geldin ödülü (sabit, artmayan) | **KABUL** | Ayrılmayı ödüllendirmez |
| Ödüllü reklam (opsiyonel, "izle → ekstra storylet varyantı") | **KABUL (dikkat)** | Hiçbir ödül mekaniği reklama bağlı değil; reklam yalnızca kozmetik/ekstra; Apple 2.5.18 kapat butonu [61] |
| Paralı loot box / rastgele paket | **RET** | Apple 3.1.1 ve Google Play oran açıklama zorunluluğu [61][69]; King & Delfabbro; AB CPC/DFA gündemi [70][72] — risk/fayda oranı kötü |
| Harcamaya bağlı near-miss ("az kaldı, 5 hamle al") | **RET** | Candy Crush'ın modeli; CPC'nin "dark pattern" tanımı [70]; dürüstlük ilkesiyle çelişir |
| Enerji/can duvarı, paralı zamanlayıcı | **RET** | Zagal "playing by appointment"/"pay to skip" [28]; Royal Match bile sınırsız can pencereleriyle gevşetti |
| Kayıp kovalama monetizasyonu ("streak'ini kurtar: 49 TL") | **RET** | Loss aversion istismarı; TR Reklam Kurulu'nun "karar verme yetisini bozan tasarım" tanımı [74] |
| Sahte aciliyet / geri sayım | **RET** | UK DMCC Act: her koşulda haksız (banned practice), CMA207 "aciliyet kanıtlanabilir olmalı" [73]; Google Play/Apple yanıltıcı metadata |
| Sonsuz kaydırma / otomatik devam | **RET** | EC TikTok ön bulgusu [52]; yıl sonu doğal durak korunur |
| Çocuklara yönelik dürtme | **RET** | CPC "direct exhortations to children" [70]; BEUC önerisi [72] |

### 5.2 Mevzuat hizası (özet; ayrıntı T9'da)

- **Apple App Store Review Guidelines:** 3.1.1 loot box oran açıklama (bizde loot box yok → madde tetiklenmez); 4.5.4 push bildirim promosyon yasağı/opt-in; 3.1.2 abonelik dürüstlüğü ve "bait-and-switch" yasağı; 2.5.18 reklam kapatma [61].
- **Google Play:** rastgele sanal eşya satışı oran açıklama (2019) [69]; "Monetization and Ads" politikası; aldatıcı davranış politikası.
- **AB:** CPC Ağı'nın Mart 2025 "sanal para 7 ilkesi" (gerçek para fiyatı göster, ihtiyaç kadar satın alma, 14 gün cayma, çocuklara dürtme yok) ve Ekim 2026'da 9 şirkete koordineli eylem [70][71]; DSA kapsamında TikTok ön bulgusu bağımlılık yapan tasarımı "sistemik risk" sayıyor [52][53]; Digital Fairness Act taslağının dark pattern + bağımlılık yapan tasarım kurallarını kodlaması bekleniyor [72]. Oyunumuz AB'de yayınlanacaksa bu çizgi ticari zorunluluk.
- **İngiltere:** DMCC Act 2024 CMA'ya doğrudan ceza yetkisi; sahte zaman kısıtı banned practice; Kasım 2025'te geri sayım soruşturmaları [73].
- **Türkiye:** Ticari Reklam ve Haksız Ticari Uygulamalar Yönetmeliği'ne 1 Şubat 2022 eklemesi; Reklam Kurulu 8 Ağustos 2023 toplantısında "karanlık ticari tasarımlar" ana gündem, 1.226 dosya, 51,9 milyon TL ceza, erişim engelleri [74]. KVKK: lokal telemetri kişisel veri içermez, dışa aktarma kullanıcı eylemiyle.

### 5.3 "Vicdanlı dopamin" manifestosu (publisher pitch paragrafı)

> Oyunumuz, oyuncunun beynindeki ödül sistemini **bilerek** hedefler: belirsizlik, sürpriz, kıl payı kaçırma, koleksiyon, seri ve "bir yıl daha" merakı — hepsi literatürden alınmış, sayılarla ayarlanmış, 10.000 simüle hayatla test edilmiş mekaniklerdir. Ama tek bir kural her şeyin üstündedir: **hiçbir ödül, hiçbir gerilim, hiçbir "az kaldı" para ile çözülmez.** Loot box yok, enerji duvarı yok, sahte geri sayım yok, kaybı kazanç gibi gösteren efekt yok. Oyuncu kaybettiğinde bile anlatıcı onunla dalga geçer ve ona gerçek bir şey verir: bir ribbon ilerlemesi, bir espri, bir "gelecek yıl". Streak'i kaçırırsa oyun oynayarak onarır, para vererek değil. Bildirim günde bir kez, oyuncunun kendi alışkanlık saatinde, oyunun gerçek bir ipliğini hatırlatır; üç kez yok sayılırsa susar. Bu yaklaşım AB CPC ilkeleri, DSA'nın bağımlılık yapan tasarım bulguları, İngiltere DMCC Act ve Türkiye Reklam Kurulu içtihadıyla uyumludur — yani **regülasyon riski sıfıra yakın, retention tasarımı ise sektörün en iyilerinden ödünç alınmış** bir ürün. Dopamin var; dolandırıcılık yok. Oyuncu bizi "beni kandırdı" diye değil, "beni güldürdü ve geri çağırdı" diye hatırlasın.

**Bu oyuna nasıl uygularız:** Bu tablo GDD'ye "Etik Sınır" eki olarak girer; her yeni mekanik PR'ı tabloya karşı işaretlenir ("hangi satır?"). Ret listesindeki bir şey "A/B test edelim" diye bile gelmez.

---

## 6. Dopamine Mechanics Matrix

| Mekanik | Nöro/psiko sürücü | Örnek oyun | Bizim uygulama | Beklenen etki (D1 / D7 / oturum) | Etik bayrağı |
|---|---|---|---|---|---|
| Pity'li iyi sürpriz motoru | Tahmin hatası, VR, belirsizlik (p≈0,5) | Genshin pity (90/74), BitLife rastgele olay | 3(a): base 0,08, soft 8, hard 14, legendary 90 | D1 ↑↑ (ilk oturumda 3–5 sürpriz), oturum ↑ | Yeşil |
| Dürüst near-miss | Clark 2009 striatum/insula; Kassinove %30 | Slot (kötü örnek), Candy Crush "1 kaldı" | 3(b): marj ≤0,15, ≤%30, takip +0,10 | Oturum ↑ ("bir daha dene"), D7 ↑ (hedef kalıcı) | Sarı (dürüstlük şart) |
| Pacing director | Loss aversion λ≈2, flow, Left 4 Dead eğrisi | Royal Match 10'da 1 rahatlama; L4D | 3(c): max 2 negatif, LOL/12, rahatlama/10, peak %75–85 | Oturum ↑↑, hayat tamamlama ↑ | Yeşil |
| Rubber band (ilk 10 yıl) | Flow (zorluk–beceri), sunk cost koruması | Mario Kart; Candy Crush testere | 3(d): koruma 1→0, bailout 1/hayat | D1 ↑ (erken ölüm spirali yok), D7 ↑ | Yeşil |
| Ribbon koleksiyonu + "az kaldı" | Goal gradient, endowed progress, bilgi boşluğu | BitLife ribbon, Monopoly Go albüm | 3(e): 4 tier, eşik %30/%80, anında ödül | D7 ↑↑, D30 ↑ (uzun hedefler) | Yeşil |
| Affedici streak + alışkanlık saati bildirimi | Loss aversion, habit (Wood), ritüel | Duolingo (+%14 D7 Wager), Pokémon GO 7 gün | 3(f): freeze/7 gün, cap 2, 48 sa onarım, günde ≤1 bildirim | D1 ↑, D7 ↑↑, D30 ↑↑ | Sarı (frekans/opt-in) |
| Legacy/prestige "number go up" | Number go up, yatırım (Hook) | Cookie Clicker prestige, Balatro meta | 3(g): log skor, √ çarpan, içerik açar | D30 ↑↑, hayat sayısı ↑ | Yeşil |
| Novelty yönetimi | Habituation'a karşı tahmin hatası | Yarn Spinner RBLRV | 3(h): unseen ×1,6, decay 0,55, wow bütçesi 3 | D7/D30 ↑ (tekrar hissi geç gelir) | Yeşil |
| Juice spec | LDW/ses bulgusu (Dixon), game feel | Royal Match, Balatro skor | 3(i): ms/SFX/haptik tablosu | D1 ↑ (ilk izlenim), oturum ↑ | Yeşil (kayıpta sade) |
| Churn heuristiği + hoş geldin | Habit yeniden kurma | Duolingo "we miss you" | 3(j): skor 0–1, sabit ödül | D7/D30 ↑ | Sarı (ödül artmamalı) |
| Anlatıcı aside / easter egg | Merak, keşif, sosyal paylaşım | Stanley Parable, Wordle paylaşımı | 3(k): p=0,04, hayatta 1 kez | Paylaşım ↑, D7 ↑ | Yeşil |
| Bekleyen sonuç kuyruğu + cliffhanger | Bilgi boşluğu, Zeigarnik | Clash Royale sandık, dizi finali | 3(l): 1–2 açık iplik, teaser 1 | Oturum ↑↑ ("bir yıl daha" >%80) | Yeşil |
| Günün Hayatı + mezar kartı paylaşımı | Kıtlık, sosyal karşılaştırma, kimlik | Wordle | Tarih-seed, emoji özet | D1/D7 ↑, organik edinim | Yeşil |

---

## 7. Tuning sabitleri (başlangıç değerleri) ve simülasyon planı

| Sabit | Değer | Not |
|---|---|---|
| SURPRISE_BASE_P / SOFT / HARD / RAMP | 0,08 / 8 / 14 / 0,12 | medyan aralık 7–8 beat |
| SURPRISE_TIME_GUARANTEE_MS | 360.000 | 6 dk |
| SURPRISE_MIN_GAP / SESSION_CAP | 3 / 6 | enflasyon freni |
| LEGENDARY_BASE_P / SOFT / HARD / RAMP | 0,006 / 60 / 90 / 0,06 | ~3/hayat |
| LUCK_MEAN / REVERSION / NOISE | 0,5 / 0,15 / 0,08 | büyüklük etkisi ±0,15 |
| NEAR_MISS WINDOW / MAX_RATE / SESSION_CAP / COOLDOWN / BONUS | 0,15 / 0,30 / 2 / 2 yıl / 0,10 | Kassinove & Schare |
| MAX_NEG_STREAK / LOL_INTERVAL ± JITTER / RELAX_EVERY | 2 / 12 ± 3 / 10 | |
| CURVE peak aralığı | t ∈ [0,75; 0,85] → 0,95 | release 0,45 |
| PROTECTION yaş penceresi / min çarpan | 18–28 / 0,5 | bailout 1/hayat |
| GERİLİM NORMALİZASYONU k | 0,5 | hissedilen p → 0,35–0,65 |
| RIBBON tier oranları | 40–70 / 10–25 / 2–6 / 0,3–1 % | sim ile kalibre |
| HINT eşikleri | gizli <0,30; bar; almostThere ≥0,80 | |
| FREEZE_EARN / CAP / REPAIR_WINDOW / REPAIR_COST | 7 gün / 2 / 48 sa / 3 beat | |
| NOTIF: önce / varsayılan saat / sessiz saat / yoksayma limiti | −30 dk / 19:30 / 23–08 / 3 | iOS 64 limit → 7 gün planla |
| SCORE: money log katsayısı / LP formülü / prestige çarpanı / eşik büyümesi | 10·log10 / 25·log2(1+S/2000) / 1+0,08√P / ×1,18 | |
| NOVELTY unseen / decay / recency / wow bütçesi | 1,6 / 0,55 / 0,3 (2 hayat) / 3 | |
| ASIDE_P | 0,04 | hayatta 1 kez |
| PENDING min/max/teaser | 1 / 2 / 1 | |
| CHURN ağırlıkları | 0,5 süre + 0,3 gap büyümesi + 0,2 uzunluk trendi | tier eşikleri 0,25/0,5/0,8 |

**Simülasyon planı (sprint sırasına göre):**
1. **S0:** `simulateLife()` iskeleti + 5 persona + metrik toplayıcı; sadece sürpriz motoru ve valans kuralı aktif. Çıktı: aralık histogramları. Kabul: p95 ≤ 14, max negatif seri ≤ 2.
2. **S1:** Pacing curve + LOL + pending queue eklenir; "oturum" kavramı sim'e girer (oturum = 35 ± 10 beat, persona bazlı). Kabul: LOL medyanı 9–15, her oturum sonunda ≥1 açık iplik.
3. **S2:** Para/sağlık rubber band + T4 Gompertz ölüm modeli birlikte; 10k hayat. Kabul: 28 yaşında para<0 oranı ≤ %5, medyan ölüm 72–80.
4. **S3:** Ribbon tanımları (ilk 40) sim'den oran alır; tier etiketleri otomatik atanır; novelty tekrar oranı 3./10. hayat ölçülür.
5. **S4:** Streak/bildirim/churn için "gün simülasyonu" (oyuncu davranış modeli: günlük oynama olasılığı Markov zinciri) — bildirimin yoksayılma oranı ve freeze tüketimi.
6. **Sürekli:** her tuning PR'ında harness CI'da; `sim-report.html` artefakt olarak saklanır; playtest telemetrisi (4.1) aynı metrik şemasıyla karşılaştırılır (sim vs gerçek sapması > %30 ise persona modelleri güncellenir).

---

## Bu oyun için öneriler (öncelikli, puanlı)

Puan = Etki (1–5) × Uygulanabilirlik (1–5) / Risk (1–3).

| # | Öneri | Etki | Uygul. | Risk | Puan | Öncelik |
|---|---|---|---|---|---|---|
| 1 | Reward Schedule Engine (3a) + Pacing Director valans/LOL kuralları (3c) motor çekirdeğine | 5 | 4 | 1 | 20 | P0 |
| 2 | Bekleyen sonuç kuyruğu + yıl sonu teaser ekranı (3l) | 5 | 5 | 1 | 25 | P0 |
| 3 | Juice spec'in ilk 6 satırı (metin, seçenek, para ±, nice/great, yıl sonu) + atlanabilirlik (3i) | 4 | 4 | 1 | 16 | P0 |
| 4 | Simülasyon harness'ı S0'da kurmak, CI'da assert (4.3) | 4 | 5 | 1 | 20 | P0 |
| 5 | Ribbon sistemi: anında ödül, 3 eşikli ipucu, sim-kalibreli tier (3e) | 5 | 3 | 1 | 15 | P1 |
| 6 | Affedici streak + alışkanlık saati bildirimi + 3 yoksayma kuralı (3f) | 4 | 4 | 2 | 8 | P1 |
| 7 | İlk 10 yıl koruma + bailout + gerilim normalizasyonu (3d) | 4 | 4 | 1 | 16 | P1 |
| 8 | Legacy/prestige log-√ eğrileri; içerik açan çarpan (3g) | 3 | 4 | 1 | 12 | P1 |
| 9 | Günün Hayatı (tarih-seed) + emoji mezar kartı paylaşımı | 4 | 4 | 1 | 16 | P1 |
| 10 | Dürüst near-miss generator (3b) — içerik 300+ olaya ulaşınca | 3 | 3 | 2 | 4,5 | P2 |
| 11 | Novelty ağırlıkları + wow bütçesi (3h) — 2. içerik dalgasıyla | 3 | 4 | 1 | 12 | P2 |
| 12 | Churn heuristiği + sabit hoş geldin ödülü (3j) | 3 | 4 | 2 | 6 | P2 |
| 13 | Anlatıcı aside/easter egg havuzu (3k), 40 adet lansman | 3 | 5 | 1 | 15 | P2 |
| 14 | Dev tuning dashboard (4.2) | 3 | 4 | 1 | 12 | P2 |
| 15 | Etik sınır tablosunu GDD eki + PR şablonu "hangi satır?" sorusu (5.1) | 4 | 5 | 1 | 20 | P0 (sıfır maliyet) |

---

## Açık sorular

1. **Beat süresi gerçekte ne?** Tüm pity/LOL sabitleri "beat ≈ 10–20 sn" varsayımına dayanıyor; ilk playtest'te medyan beat süresi ölçülmeden dakika bazlı garantiler kalibre edilemez.
2. **Şans statı oyuncuya gösterilsin mi?** Gizli tutmak adalet tartışması doğurabilir ("oyun bana karşı"); göstermek ise "şansımı artırayım" talebi (ve monetizasyon baskısı) yaratır. Öneri: gizli, ama anlatıcı ima eder.
3. **Near-miss Türkçe tonu:** "Az kaldı" kalıbı roast tonuyla çelişebilir mi? Playtest'te "haksızlık hissi" sorusu bunu ölçecek.
4. **Bildirim izni ne zaman istenir?** İlk ribbon'dan hemen sonra (pozitif an) mı, ilk pending outcome'da mı? A/B için 2 build.
5. **Hafta sonu kalkanı TR için doğru mu?** Duolingo verisi küresel; TR'de oyun hafta sonu artıyor olabilir. Lokal telemetriyle 2 hafta sonra karar.
6. **Ödüllü reklam ile "ekstra varyant" sınırı:** Reklam izleyince ek storylet varyantı vermek "içerik duvarı" olarak algılanır mı? CPC dark pattern tanımına girmez ama oyuncu algısı test edilmeli.
7. **Simülasyon persona modelleri gerçek oyuncuyu ne kadar temsil ediyor?** Sim–gerçek sapması %30 eşiği keyfi; ilk uzak testten sonra revize.
8. **DFA takvimi:** Digital Fairness Act yasalaşırsa "bağımlılık yapan tasarım" tanımı streak/bildirimi kapsayabilir; T9 ile izlenecek.
9. **Erişim kısıtı:** Bu araştırmada deconstructoroffun.com, blog.duolingo.com, gup.ub.gu.se ve docs.expo.dev doğrudan okunamadı (oturum ağ izinleri); bu kaynaklar ikincil özetlerden aktarıldı ve doğrulayıcı ajan tarafından birincil metinle karşılaştırılmalı.

---

## Kaynaklar

1. Schultz, Dayan & Montague (1997), "A Neural Substrate of Prediction and Reward", Science 275:1593 — https://www.science.org/doi/10.1126/science.275.5306.1593
2. Schultz (2016), "Dopamine reward prediction error coding", Dialogues Clin Neurosci — https://pmc.ncbi.nlm.nih.gov/articles/PMC4826767/
3. Berridge & Robinson (1998), "What is the role of dopamine in reward…", Brain Res Rev — https://lecerveau.mcgill.ca/flash/capsules/articles_pdf/dopamine.pdf
4. Berridge (2007), "The debate over dopamine's role in reward: the case for incentive salience", Psychopharmacology — https://link.springer.com/article/10.1007/s00213-006-0578-x
5. Fiorillo, Tobler & Schultz (2003), "Discrete Coding of Reward Probability and Uncertainty by Dopamine Neurons", Science 299:1898 — https://www.science.org/doi/10.1126/science.1077349
6. Fiorillo, Tobler & Schultz (2005), yanıt (Niv, Duff & Dayan tartışması), Behav Brain Funct — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1182345/ ; derleme: https://pmc.ncbi.nlm.nih.gov/articles/PMC4293327
7. Ferster & Skinner (1957), Schedules of Reinforcement; özet: https://en.wikipedia.org/wiki/Reinforcement#Schedules_of_reinforcement
8. Hopson (2001), "Behavioral Game Design", Gamasutra/Game Developer — https://www.gamedeveloper.com/design/behavioral-game-design
9. Compulsion loop — https://en.wikipedia.org/wiki/Compulsion_loop ; Princeton tech report (VR takvim oyunlarda) — https://www.cs.princeton.edu/techreports/2012/931.pdf
10. Eyal (2014), Hooked — https://www.nirandfar.com/hooked/
11. Clark, Lawrence, Astley-Jones & Gray (2009), "Gambling Near-Misses Enhance Motivation to Gamble and Recruit Win-Related Brain Circuitry", Neuron 61:481 — https://pmc.ncbi.nlm.nih.gov/articles/PMC2658737/
12. Cambridge/EurekAlert özeti (2009) — https://www.eurekalert.org/news-releases/653015
13. Kassinove & Schare (2001), "Effects of the 'near miss' and the 'big win' on persistence at slot machine gambling", Psychol Addict Behav 15:155 — https://psycnet.apa.org/doi/10.1037/0893-164X.15.2.155
14. Stange, Brown, Harrigan & Dixon — near-miss ve regülasyon — https://cdspress.ca/wp-content/uploads/2022/09/Madison-Stange-Dan-G.-Brown-Kevin-Harrigan-Michael-Dixon.pdf ; Harrigan derlemesi — https://core.ac.uk/download/42584618.pdf
15. Tversky & Kahneman (1992), "Advances in Prospect Theory", J Risk Uncertainty — https://link.springer.com/article/10.1007/BF00122574
16. Tom, Fox, Trepel & Poldrack (2007), "The Neural Basis of Loss Aversion in Decision-Making Under Risk", Science 315:515 — https://ui.adsabs.harvard.edu/abs/2007Sci...315..515T/abstract
17. Takeuchi et al. (2015), J Gambling Studies — https://link.springer.com/article/10.1007/s10899-015-9587-1
18. Dixon, Harrigan, Sandhu, Collins & Fugelsang (2010), "Losses disguised as wins in modern multi-line video slot machines", Addiction 105:1819 — https://uwaterloo.ca/reasoning-decision-making-lab/sites/default/files/uploads/files/DixFugetal_10c.pdf
19. Dixon et al. (2013), ses ve LDW — Waterloo haberi — https://uwaterloo.ca/news/news/music-gamblers-ears
20. Csikszentmihalyi (1990), Flow — https://en.wikipedia.org/wiki/Flow_(psychology)
21. Chen (2006), "Flow in Games", USC tezi — https://jenovachen.info/abstract
22. Chen (2007), "Flow in Games (and Everything Else)", CACM — https://dl.acm.org/doi/10.1145/1232743.1232769
23. Loewenstein (1994), "The Psychology of Curiosity", Psychological Bulletin 116:75 — https://www.cmu.edu/dietrich/sds/docs/loewenstein/PsychofCuriosity.pdf
24. Wood, Quinn & Kashy (2002), "Habits in everyday life", JPSP 83:1281; APA söyleşisi — https://www.apa.org/research/action/speaking-of-psychology/behavioral-habits
25. Duhigg (2012), The Power of Habit — https://charlesduhigg.com/the-power-of-habit/
26. Nunes & Drèze (2006), "The Endowed Progress Effect", J Consumer Research 32:504 — https://ideas.repec.org/a/oup/jconrs/v32y2006i4p504-512.html
27. Kivetz, Urminsky & Zheng (2006), "The Goal-Gradient Hypothesis Resurrected", J Marketing Research — https://doi.org/10.1509/jmkr.43.1.39
28. Zagal, Björk & Lewis (2013), "Dark Patterns in the Design of Games", FDG — https://research.chalmers.se/en/publication/177148
29. Deterding, Stenros & Montola (2020), "Against 'Dark Game Design Patterns'", DiGRA — https://eprints.whiterose.ac.uk/156460/1/DiGRA_2020_paper_189.pdf
30. King & Delfabbro (2018), "Predatory monetization schemes in video games (e.g. 'loot boxes') and internet gaming disorder", Addiction 113:1967 — https://researchnow.flinders.edu.au/en/publications/predatory-monetization-schemes-in-video-games-eg-loot-boxes-and-i/
31. King & Delfabbro (2019), "Video Game Monetization (e.g., 'Loot Boxes'): a Blueprint for Practical Social Responsibility Measures", IJMHA — https://link.springer.com/article/10.1007/s11469-019-00164-4
32. Game Developer, "Candy Crush Saga: A Sweet Journey into Monetization" — https://www.gamedeveloper.com/design/candy-crush-saga-a-sweet-journey-into-monetization
33. Riptide Lab, Candy Crush Saga incelemesi — https://riptidelab.com/candy-crush-saga-review/
34. Deconstructor of Fun (2021), "Royal Match: The New King from Turkey" — https://www.deconstructoroffun.com/blog/2021/3/21/royal-match-the-new-king-from-turkey
35. Naavik, "Royal Match: Dream Games' Regal Performance" — https://naavik.co/deep-dives/royal-match/
36. Royal Match — https://en.wikipedia.org/wiki/Royal_Match ; seviye tasarımı analizi — https://pratama-naufal.medium.com/what-makes-royal-match-so-good-level-design-1d82ca2e3b11
37. Sensor Tower, "MONOPOLY GO! revenue milestone ($6B)" — https://sensortower.com/blog/monopoly-go-app-revenue-milestone
38. Scopely basın duyurusu (2025) — https://www.scopely.com/en/news/sensor-tower-scopelys-monopoly-go-hit-6-billion-revenue-milestone-in-2025-in-record-time
39. mobilegamer.biz data digest (AppMagic 2024 tahmini) — https://mobilegamer.biz/data-digest-monopoly-go-saygames-talemonster-ua-hits-25bn-love-and-deepspace-arknights-efootball-more
40. Monopoly Go albüm/partner etkinlik yapısı — https://www.thegamer.com/monopoly-go-sticker-albums-faq-complete-guide/ ; https://www.iggm.com/news/monopoly-go-next-partner-event-prediction-how-to-prepare-dice-tokens-partner
41. Deconstructor of Fun (2019), "How Coin Master Disrupted Social Casino" — https://www.deconstructoroffun.com/blog/2019/3/4/is-coin-master-the-new-face-of-social-casino
42. Mistplay, Coin Master rehberi — https://www.mistplay.com/blog/how-to-play-coin-master
43. RoyaleAPI, "Chest time" — https://royaleapi.com/blog/chest-time
44. Supercell, "Enter the Trophy Road" — https://clashroyale.com/blog/release-notes/new-update-feature-enter-the-trophy-road.html
45. VideoGamer, Genshin Impact pity sistemi — https://www.videogamer.com/guides/genshin-impact-pity-system/
46. Sportskeeda, pity/soft pity/50-50 — https://sportskeeda.com/esports/genshin-impact-pity-soft-pity-50-50-banner-history-explained
47. Niantic yardım merkezi, Pokémon GO günlük bonuslar — https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/105-daily-bonuses/
48. Northeastern (2022), "What makes Wordle so G-R-E-A-T?" — https://news.northeastern.edu/2022/01/21/what-makes-wordle-so-g-r-e-a-t/
49. Wordle — https://en.wikipedia.org/wiki/Wordle
50. Duolingo Blog, "How Streaks keep Duolingo learners committed" (Streak Wager, Weekend Amulet) — https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/
51. Duolingo streak freeze (fan wiki) — https://duolingo.fandom.com/wiki/Shop/Streak_freeze ; Trophy vaka çalışması — https://trophy.so/blog/duolingo-gamification-case-study
52. Avrupa Komisyonu (6 Şubat 2026), TikTok bağımlılık yapan tasarım ön bulgusu (DSA) — https://digital-strategy.ec.europa.eu/en/news/commission-preliminarily-finds-tiktoks-addictive-design-breach-digital-services-act
53. BEUC basın açıklaması (2026) — https://www.beuc.eu/press-release/commissions-preliminary-findings-against-tiktok-under-dsa-good-step-towards-strong
54. Schüll (2012), Addiction by Design — https://press.princeton.edu/books/paperback/9780691160887/addiction-by-design
55. Portsmouth Üniversitesi, "Vampire Survivors: how developers used gambling psychology…" — https://researchportal.port.ac.uk/en/publications/vampire-survivors-how-developers-used-gambling-psychology-to-crea/
56. Kotaku, Balatro skor animasyonu — https://kotaku.com/best-video-game-moment-2024-astro-bot-marvel-dragon-age-1851733392/15
57. Sidequesting, "Why is Vampire Survivors so compelling" — https://sidequesting.com/2022/10/why-is-vampire-survivors-so-compelling
58. Cookie Clicker — https://en.wikipedia.org/wiki/Cookie_Clicker
59. Pro Game Guides, BitLife ribbon listesi — https://progameguides.com/bitlife/ribbons-list-guide/
60. GameAnalytics, "Budget games top the charts by focusing on story" (BitLife) — https://www.gameanalytics.com/blog/budget-games-top-the-charts-by-focusing-on-story
61. Apple App Store Review Guidelines (3.1.1, 3.1.2, 2.5.18, 4.5.4) — https://developer.apple.com/app-store/review/guidelines/
62. Apple Developer Forums, UNNotificationRequest 64 limiti — https://developer.apple.com/forums/thread/765490
63. Swink (2008), Game Feel; özet — https://en.wikipedia.org/wiki/Game_feel
64. Material Design, motion duration (100 ms/300 ms) — https://medium.com/google-design/33089196e6c2 ; https://m1.material.io/motion/duration-easing.html
65. Apple HIG, "Playing haptics" — https://developer.apple.com/design/human-interface-guidelines/playing-haptics
66. Nijman (Vlambeer), "The Art of Screenshake" — https://gamedeveloper.com/design/vlambeer-co-founder-shares-advice-on-building-better-action-games
67. Jonasson & Purho, "Juice it or lose it" (liste) — https://kenney.nl/learn/must-see-videos-for-indie-developers
68. Zoe Quinn, GDC 2015, komedi ve oyunlar — https://www.thumbsticks.com/gdc-2015-zoe-quinn-on-comedy-in-videogames/
69. Google Play loot box oran açıklama politikası (Fenwick özeti) — https://fenwick.com/insights/publications/google-play-now-requires-disclosure-of-loot-box-odds ; Play "Monetization and Ads" — https://support.google.com/googleplay/android-developer/answer/9857753
70. Avrupa Komisyonu, CPC koordineli eylemler (sosyal medya, online oyunlar) — https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/enforcement-consumer-protection/coordinated-actions/social-media-online-games-and-search-engines_en
71. TLT, "CPC Network takes enforcement action on in-game virtual currencies" — https://www.tlt.com/insights-and-events/insight/fair-play-for-gamers-cpc-network-takes-enforcement-action-on-in-game-virtual-currencies ; Lewis Silkin (Ekim 2026) — https://www.lewissilkin.com/insights/2026/10/15/eu-consumer-protection-network-launches-action-involving-nine-video-games-compani-102o5do
72. BEUC (Aralık 2025), "Towards the Digital Fairness Act" — https://www.beuc.eu/sites/default/files/publications/BEUC-X-2025-110_Towards_the_Digital_Fairness_Act.pdf
73. Ashurst, "Mind the nudge: the DMCC's crackdown on manipulative online design" — https://www.ashurst.com/en/insights/mind-the-nudge-the-dmccs-crackdown-on-manipulative-online-design/ ; CMA207 — https://www.gov.uk/government/publications/unfair-commercial-practices-cma207
74. T.C. Ticaret Bakanlığı, "Reklam Kurulu Tarafından Karanlık Ticari Tasarımlar İncelemeye Alındı" — https://ticaret.gov.tr/haberler/reklam-kurulu-tarafindan-karanlik-ticari-tasarimlar-incelemeye-alindi ; AA — https://www.aa.com.tr/tr/ekonomi/karanlik-ticari-tasarimlar-reklam-kurulunun-radarina-girdi/2964843
75. GameAnalytics, 2025 Mobile Gaming Benchmarks — https://www.gameanalytics.com/reports/2025-mobile-gaming-benchmarks ; 2026 — https://www.gameanalytics.com/reports/2026-mobile-pc-gaming-benchmarks
76. GDC Vault, "Finding the Fun: Playtesting Your Game" — https://gdcvault.com/play/1019689/Finding-the-Fun-Playtesting-Your ; "Playtesting Process for Ultra Small Teams" — https://gdcvault.com/play/1035679/Playtesting-Process-for-Ultra-Small
77. GDC Vault, "Comedy Games: An Underexplored…" — https://gdcvault.com/play/1021867/Comedy-Games-An-Underexplored
78. Android Developers, alarm/exact alarm izinleri (Android 12+) — https://developer.android.com/develop/background-work/services/alarms/schedule
79. Monopoly Go etkinlik takvimi (çoklu etkinlik örneği) — https://monopolygo.wiki/
80. Brown Public Health Review, "What Makes TikTok so Addictive?" — https://sites.brown.edu/publichealthjournal/2021/12/13/tiktok/
