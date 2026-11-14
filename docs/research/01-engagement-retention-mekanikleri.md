# T1 — Engagement, Retention ve "Bağımlılık" Mekanikleri: Psikoloji + Oyun Tasarımı

**Proje:** Mobil, backend'siz, kara mizahlı hayat simülasyonu (çalışma adı: *Hayat Koçu*) · **Konu ID:** T1 · **Tarih:** 2026-11-05 · **Durum:** Araştırma v1 (tek tur web araştırması; bazı birincil kaynaklara ağ kısıtı nedeniyle doğrudan erişilemedi, bunlar "Açık sorular"da işaretlendi)

---

## TL;DR

1. **Retention'ın etik motoru SDT'dir, değişken ödül değil.** Ryan–Rigby–Przybylski (2006) 4 çalışmada autonomy/competence/relatedness'ın oyun keyfini ve "tekrar oynama" niyetini bağımsız olarak yordadığını gösterdi. Skinner tipi değişken ödüller "ilk 7 günü" taşır; SDT "7. aydan sonrasını" taşır. İkisini de kullanacağız ama hiyerarşi bu.
2. **Pazar gerçeği acımasız:** GameAnalytics 2025 (11.600 oyun) medyan D1 ≈ %22, medyan D7 ≈ %3,4–3,9; projelerin %75'inin D28'i %3'ün altında. Adjust 2026 (2025 verisi): tüm oyunlarda D1 %27, D7 %13, D30 %5. Publisher'ın "ilgi eşiği" bizim türde kabaca **D1 ≥ %35–40, D7 ≥ %15, D30 ≥ %6–8**'dir; bunun altı "soft launch'ta göster, sonra konuşalım" demektir.
3. **Session hedefi iddialı ama ulaşılabilir:** GameAnalytics 2026'da en iyi %25'lik dilim günde 22–24 dk, 5,2 dk/session, 5,3–5,7 session/gün. Metin tabanlı bir hayat simülasyonu "bir yıl = bir tur" yapısıyla medyanın (3,1–3,5 dk) 2–3 katına doğal olarak çıkar; hedefimiz **ilk 7 günde ortalama 12+ dk/gün, 3+ session/gün**.
4. **Streak kullanacağız, ama affedici versiyonunu.** Silverman & Barasch (JCR 2023) kırık streak'in "momentum" hissini bozup davranışı azalttığını 7 çalışmada gösterdi; Duolingo'nun 2017 "streak wager" deneyi D7'de +%14 verdi; 2026 "Streak Revival" kampanyasıyla 15,4M kullanıcı eski streak'ini geri aldı. Bizde: streak kırılınca narrator dalga geçer, ceza yok, "pardon kartı" var.
5. **Energy sistemi YOK.** Energy mekanikleri temayla çatışır (Mobile Free To Play), bekleme satmak etik sınırda ve bizim en güçlü kozumuz olan "bir yıl daha" döngüsünü keser. Pacing'i içerikle (yıl özeti, cliffhanger, bölüm kapanışı) yapacağız; Fallen London'ın "20 action / 10 dakikada 1" mum sistemi tam olarak yapmayacağımız şey.
6. **"Bir yıl daha" = Sid Meier'in "bir tur daha"sı.** Civilization'ın çekimi kısa/orta/uzun vadeli hedeflerin her an eşzamanlı açık olmasından gelir. Her yaşta en az 1 kısa (bu yıl), 1 orta (3–5 yıl) ve 1 uzun (ömür) hedef ekranda görünür olacak.
7. **Meta-progression hayat sayısına bağlı:** Hades'in "her ölüm yeni diyalog + kalıcı ilerleme" şablonu bizde "her ölüm yeni mezar taşı + Aile Albümü + kalıcı 'Miras Puanı'" olur. Ölüm, kayıp değil, içerik açılışıdır.
8. **Koleksiyon = BitLife ribbon'larının roast versiyonu.** ~30 ribbon BitLife'ta yıllardır konuşulan tek şey; biz "Rozet" yerine "Teşhis" (ör. "Kronik Erteleyici", "Annesinin Kuzusu") vereceğiz: koleksiyon + kimlik + paylaşım aynı anda.
9. **Backend'siz sosyal:** Paylaşım kartı (yerel render edilen görsel), "senin 12 eski hayatın" yerel leaderboard'u ve **dürüstçe etiketlenmiş** simüle "komşu hayatlar" (seed'li NPC yaşamları). Sahte "şu an 3.412 kişi oynuyor" sayacı ASLA.
10. **Offline LTE mümkün:** Haftalık `hash(YYYY-WW)` seed'i ile uygulama paketindeki içerik havuzundan deterministik "Haftanın Teması" seçilir; cihaz saati sapmasına toleranslı, cezasız. Sahte geri sayım yok, çünkü geri sayım gerçek (takvim).
11. **Politika çizgisi net:** Paralı rastgele kutu YOK (Belçika 2018 yasağı, Hollanda Danıştay 2022 kararı, Apple 3.1.1 / Google Play Payments odds zorunluluğu). Sahte aciliyet YOK (UK DMCC Act 6 Nisan 2025, "substantiate the urgency"; FTC Epic Games 245M$). Tüm IAP'ler sabit içerikli.
12. **Yaş derecesi 16+ hedefi.** Apple'ın Temmuz 2025 tier'larında "frequent/intense mature or suggestive themes" 16+, "profanity or crude humor" 13+ bandına düşüyor; cinsel içerik/kumar simülasyonu 18+'a iter. Kara mizahı 16+'da tutmak reach için kritik; küfür "sansürlü" bile sayılır.
13. **Metin hızı tasarım parametresidir:** Yetişkin sessiz okuma hızı ≈ 238 wpm (kurgu dışı), 260 wpm (kurgu) (Brysbaert 2019). Bir olay kartı 25–45 kelime (≈ 6–10 sn), bir yıl ≈ 3–5 kart, bir "tur" ≈ 40–70 sn. Bu sayılar session mimarisinin temelidir.
14. **En yüksek ROI mekanikler (öncelik sırası):** (P0) bir-yıl-daha döngüsü + yıl sonu cliffhanger, (P0) Teşhis koleksiyonu, (P0) affedici streak + günlük "Koç Görevi", (P1) Miras meta-progression + jenerasyon oyunu, (P1) offline haftalık tema, (P1) Welcome-back roast, (P2) challenge modları, (P2) opsiyonel "gerçek hayat mikro-görevi".
15. **Ölçmeden karar yok:** Backend yok ama analytics SDK (Firebase/GameAnalytics) opsiyonel; soft launch'ta D1/D7, session/gün, "yıl/session", "ölüm→yeniden doğuş" oranı ve streak-freeze kullanımı izlenecek.

---

## Varsayımlar

- Oyun tek kişilik, metin+kart ağırlıklı UI (BitLife'ın menü yoğunluğu + Reigns'in kart ritmi arası). 1 "tur" = 1 yaş.
- Oyuncu 18'de başlar; ortalama bir hayat 50–80 tur sürer; ortalama bir hayat tamamlama 25–60 dk (tek oturumda bitmesi zorunlu değil).
- Para modeli: ücretsiz + rewarded reklam + sabit içerikli IAP (tema paketleri, "Premium Koç", reklam kaldırma). Abonelik ilk sürümde yok.
- Analytics SDK sadece opt-in/anonim; oyun tamamen offline oynanır.
- İlk pazar Türkiye (TR dil), 6–9 ay içinde EN.
- Yaş derecesi hedefi: Apple 16+, Google/IARC PEGI 16 / ESRB T–M arası (kesinleştirilecek).

---

## 1. Psikolojik Temeller

### 1.1 Değişken oranlı pekiştirme (Skinner)

Skinner'ın operant koşullanma çalışmalarında **değişken oranlı (variable-ratio) pekiştirme** — ödülün kaç tepkiden sonra geleceğinin öngörülememesi — en yüksek ve sönmeye en dirençli davranış oranını üretir. Slot makinelerinin, loot box'ların ve "bir kart daha çek" döngülerinin altındaki mekanizma budur. (Klasik kaynak; bu turda web doğrulaması yapılamadı, ders kitabı düzeyinde bilgi.)

Bizim için kritik ayrım: değişken ödülün **paraya bağlanması** regülatör riskidir (bkz. §5), ama **anlatıya bağlanması** sadece iyi yazarlıktır. "Bu yıl ne olacak?" sorusunun cevabının öngörülemez olması, oyuncunun "yaşlan" butonuna basma oranını artırır; bunun hiçbir politikayla sorunu yoktur.

**→ Bizde:** Her yaş turunda olay çekimi ağırlıklı rastgele bir havuzdan yapılır; havuzda %70 "sıradan", %25 "ilginç", %4 "nadir", %1 "efsanevi" (ör. "Sokakta bulduğun kedi meğer bir Instagram fenomeniymiş") etiketli storylet'ler bulunur. Nadirlik oyuncuya **sonradan** gösterilir ("Bu olayı oyuncuların %1,3'ü görür" — simülasyon olasılığından hesaplanır, sahte sosyal sayaç değildir).

### 1.2 Hook Model (Nir Eyal, *Hooked*, 2014)

Dört aşama: **Trigger → Action → Variable Reward → Investment**. Eyal'ın modeli Fogg'un davranış modelinden (motivasyon × yetenek × tetikleyici) beslenir; "investment" aşaması, kullanıcının ürüne kattığı emeğin bir sonraki tetikleyiciyi yüklemesidir.

**→ Bizde:**
- *Dış tetikleyici:* Günlük tek bildirim, narrator sesiyle ("Dün 34 yaşında bıraktın. Ortalama ömür 78. Hesabı sen yap."). Push opt-in'i Airship 2025 medyanlarına göre iPhone'da ≈ %49, Android'de ≈ %53; bildirim izni **oyun içinde bir komik anda** istenir (ilk açılışta asla).
- *İç tetikleyici:* Can sıkıntısı + "hayatım nasıl gidiyor acaba" düşüncesi. Narrator'ın oyuncunun gerçek hayatına da laf sokması bu iç tetikleyiciyi besler.
- *Action:* Tek dokunuş — "Yaşlan". Sürtünme sıfır.
- *Variable reward:* Olay havuzu (§1.1) + narrator'ın değişken roast cümleleri (aynı olaya 5–8 farklı yorum).
- *Investment:* Karakter isimlendirme, Teşhis koleksiyonu, Aile Albümü, Miras Puanı. Her yatırım bir sonraki hayata taşınır.

### 1.3 Octalysis (Yu-kai Chou)

Chou 8 çekirdek dürtü tanımlar: (1) Epic Meaning & Calling, (2) Development & Accomplishment, (3) Empowerment of Creativity & Feedback, (4) Ownership & Possession, (5) Social Influence & Relatedness, (6) Scarcity & Impatience, (7) Unpredictability & Curiosity, (8) Loss & Avoidance. 6–8 "Black Hat" dürtülerdir: aciliyet, takıntı ve bağımlılık yaratırlar; Chou bunların kısa vadeli etkili, uzun vadede yıpratıcı olduğunu söyler.

**→ Bizde (dürtü → mekanik):**

| Dürtü | Mekanik | Hat |
|---|---|---|
| 1 Epic Meaning | "Soyağacını kurtar" jenerasyon hedefi; narrator'ın gizli motivasyon katmanı | White |
| 2 Accomplishment | Teşhis koleksiyonu, Miras Puanı, yaş rekorları | White |
| 3 Creativity | Serbest karakter kurgusu, "ne yaparsın?" açık uçlu kart kombinasyonları | White |
| 4 Ownership | Aile Albümü, mezarlık, isimlendirilmiş evcil hayvanlar | White |
| 5 Social | Paylaşım kartı, simüle komşu hayatlar (dürüst etiketli) | White/Grey |
| 6 Scarcity | Haftalık tema (gerçek takvim), **sahte kıtlık yok** | Grey (kontrollü) |
| 7 Curiosity | Nadir olaylar, cliffhanger, "kilitli Teşhis" ipuçları | White/Grey |
| 8 Loss | Streak — ama affedici; ölüm — ama içerik açar | Grey (yumuşatılmış) |

Kural: **Black Hat dürtüleri sadece White Hat bir çıkışla eşleştir.** Streak kırılırsa (8) → Miras Puanı'nı kaybetmezsin (4) ve narrator seni roast eder (mizah, 3).

### 1.4 Self-Determination Theory — uzun vadeli retention'ın etik motoru

Ryan, Rigby & Przybylski (2006, *Motivation and Emotion* 30(4): 347–363) dört çalışmada (1, 2, 4 oyunluk laboratuvar + MMO topluluğu anketi) **autonomy, competence ve relatedness**'ın oyun keyfini, tercihini ve gelecekteki oynama niyetini bağımsız olarak yordadığını gösterdi; competence ve autonomy ayrıca kontrol sezgiselliği ve "presence" ile ilişkiliydi. Bu çalışma PENS ölçeğinin kaynağıdır.

Neden "etik motor": Değişken ödül oyuncuyu geri getirir; SDT oyuncunun **geri gelmekten memnun olmasını** sağlar. Publisher'ların D30+ ve LTV için baktığı şey ikincisidir.

**→ Bizde:**
- *Autonomy:* Her yıl en az 2 anlamlı karar (Reigns'in 4 kaynak dengesi gibi 4 gösterge: Sağlık, Para, Akıl Sağlığı, Sosyal). Alliot'un dediği gibi "kararlara 4 güç boyutunda sonuç yükleyince basit bir swipe anlam kazandı".
- *Competence:* Görünür büyüme: beceri çubukları, "geçen hayatına göre +%18 daha az rezil oldun" karşılaştırması, Miras Puanı.
- *Relatedness:* NPC ilişkileri hafızalı (annen 40 yaşında hâlâ "aramıyorsun" der); narrator **ilişki** kurar, sadece anlatmaz. Backend yok ama relatedness NPC'lerle ve oyuncunun kendi geçmiş hayatlarıyla sağlanır.

### 1.5 Kayıptan kaçınma ve streak psikolojisi

Kahneman & Tversky'nin prospect theory'si (1979) kayıpların eşdeğer kazançlardan daha ağır tartıldığını ortaya koyar (klasik kaynak). Oyunlarda bu, "kaybetmek üzere olduğun şey" olarak kullanılır: streak, geçici bonus, kaybolacak teklif.

**Streak literatürü:** Silverman & Barasch, "On or Off Track: How (Broken) Streaks Affect Consumer Decisions" (*JCR* 49(6), 2023, 1095–1117) — 7 çalışma: kesintisiz kayıtlı streak'ler sonraki aynı davranışı artırır, kırık streak'ler "momentum" hissini bozar ve kişi kararı alışkanlıktan değil yeniden tartarak verir. Yazarların pratik önerisi: kırık streak'i vurgulama, onarma imkânı ver.

**Duolingo sayıları (dikkatli okunmalı):** 2017 "Streak Wager" deneyi D7 retention'da +%14 (bazı kaynaklar D14 diyor); "7 günlük streak'e ulaşanlar kursu bitirmeye 3,6× daha yakın" iddiası yaygın ama **korelasyonel ve birincil kaynağı bulunamadı**; 2026 "Streak Revival" kampanyasında 15,4M kullanıcı eski streak'ini geri aldı; Streak Freeze önceden "satın alınan" bir sigorta olarak çalışır ve kaçırılan günü doldurur (Duolingo Help Center + blog). "Streak Freeze churn'ü %21 azalttı" iddiası kaynaksız, kullanmayın.

**Habit formation:** Lally et al. (2010, *Eur. J. Soc. Psych.*): 96 katılımcı, otomatikleşme platosuna ulaşmanın **medyanı 66 gün** (aralık 18–254); **tek bir kaçırılan gün otomatikleşmeyi anlamlı bozmadı**. Bu bulgu "affedici streak"in bilimsel gerekçesidir: alışkanlık için ara sıra kaçırmak önemsizdir, önemli olan 2+ ardışık gün kaçırmamaktır.

**→ Bizde:** "Koç Streak'i": art arda gün oynama sayacı. Kırılma durumunda (a) otomatik 1 "Pardon Kartı"/hafta (önceden satın alma gerekmez, Duolingo'dan daha affedici), (b) narrator roast'u ("3 gün gelmedin. Karakterin 3 yıl komada bekledi. Düşünsene."), (c) streak **asla sıfırlanmaz**, "duraklar": ekranda "47 gün (duraklatıldı)" yazar, geri gelince kaldığı yerden devam eder. Bu, DMCC/FTC açısından da en temiz model: kayıp tehdidi yok, sadece kayıt var.

### 1.6 Endowed progress ve goal-gradient

Nunes & Drèze (2006): araba yıkama sadakat kartı saha deneyi — 8 damga gerekli kart vs. 10 damgalı ama 2'si "hediye" verilmiş kart (ikisi de 8 yıkama ister). Hediye damgalı grupta tamamlama **%34 vs %19**, yıkamalar arası süre daha kısa. Not: "bağışlanan ilerleme" keyfi/sahte hissedilirse etki çöker (çalışma 3). Kivetz, Urminsky & Zheng (2006) goal-gradient: hedefe yaklaştıkça çaba artar.

**→ Bizde:**
- Teşhis koleksiyonu ilk hayatta 3 Teşhis'i **otomatik** verir ("Doğdun: Teşhis #1 'Nefes Alıyor'"). Anlatısal gerekçesi var, keyfi değil.
- Her Teşhis'in ilerleme çubuğu kısmi gösterilir ("Kronik Erteleyici: 7/10 — 3 yıl daha erteleme yeter").
- Yıl hedefleri "%80 tamam" eşiğinde narrator'dan ekstra dürtme alır (goal-gradient).

### 1.7 Zeigarnik etkisi ve cliffhanger

Zeigarnik (1927): tamamlanmamış görevler bellekte daha canlı kalır (klasik kaynak). Dizi cliffhanger'ları bunun endüstriyel uygulamasıdır.

**→ Bizde:** Session'ın doğal bitiş noktaları (yıl sonu, ölüm) **asla** kapalı bir cümleyle bitmez. Yıl özeti kartının son satırı bir sonraki yılın tohumudur: "Bu arada, kapıda biri var. Yarın söylerim." Oyuncu uygulamayı kapattığında ekranda açık bir soru kalır; push bildirimi aynı soruya referans verir. Her yaş için yazarlara "cliff satırı" alanı zorunlu.

### 1.8 Near-miss etkisi

Clark et al. (2009, *Neuron*): 15 gönüllü fMRI ile slot oynadı; **kıl payı kaybetme**, kazanmayla aynı ödül devrelerini (ventral striatum, anterior insula) aktive etti; katılımcılar near-miss'i düz kayıptan daha nahoş bulmalarına rağmen oynama isteği arttı — ama sadece oyuncunun kontrolü hissettiği durumlarda. Insula aktivitesi kumar eğilimiyle ilişkiliydi.

Bu bulgu bizim için **dikkat** işaretidir: paraya bağlı near-miss (gacha "neredeyse 5 yıldız") etik ve regülatif sorundur. Anlatıda near-miss ise dram demektir.

**→ Bizde:** Sadece anlatısal near-miss: "Piyango bileti 1 rakamla kaçtı. Narrator: 'Evren seninle dalga geçiyor, ben değil.'" Para harcanan hiçbir yerde near-miss kullanılmaz; rewarded reklam ödülleri sabittir.

### 1.9 Sunk cost ve yatırım (customization, koleksiyon)

Hook Model'in "investment" aşaması + Octalysis "Ownership". Oyuncunun oyuna koyduğu emek (isim, hikâye, koleksiyon) bırakma maliyetini artırır; etik versiyonu, oyuncunun **gerçekten değer verdiği** bir şey biriktirmesidir (sahte ilerleme değil).

**→ Bizde:** Aile Albümü (her ölen karakterin mezar taşı + 1 satırlık epitaf, oyuncu düzenleyebilir), Teşhis duvarı, "Hayat Kitabı" (otomatik üretilen ve paylaşılabilir hayat özeti). Hepsi cihazda, export edilebilir (JSON + görsel): oyuncunun verisi oyuncunundur, bu da "ownership"i güçlendirir.

### 1.10 Yenilik, sürpriz ve merak boşluğu

Loewenstein (1994) merakı "bildiğin ile bilmek istediğin arasındaki boşluk" olarak tanımlar (klasik kaynak; bu turda doğrulanamadı). Oyun tasarımında: kilitli ama **görünür** içerik.

**→ Bizde:** Teşhis duvarında kilitli kartların sadece ipucu metni görünür ("??? — 'Bunu almak için bir politikacıya güvenmen gerekiyor'"). Olay günlüğünde "görmediğin 214 olay var" sayacı (gerçek içerik havuzu büyüklüğünden hesaplanır). Haftalık tema "bu hafta açılan 12 yeni olay" ile merak boşluğu yeniler.

### 1.11 Flow ve zorluk eğrisi

Csikszentmihalyi'nin flow'u (1990) beceri–zorluk dengesinde ortaya çıkan derin odaklanmadır; Jenova Chen'in "Flow in Games" (2007) tezi bunu oyuncunun kendi zorluğunu seçtiği "flow kanalı"na çevirir (klasik kaynaklar; bu turda doğrulanamadı).

Hayat simülasyonunda "zorluk" = kaynak baskısı ve karar yoğunluğu. BitLife'ın zayıf noktası budur: 30 yaşından sonra zorluk düzleşir, oyun "yaşlan spam"ine dönüşür.

**→ Bizde:** Yaş bantlarına göre dinamik baskı: 18–25 "kaos" (çok olay, düşük bedel), 26–40 "yükler" (az olay, yüksek bedel), 41–60 "hesaplaşma" (geçmiş kararların geri dönüşü), 60+ "miras" (jenerasyon kurulumu). Gösterge dengesizliği arttıkça olay sıklığı artar (adaptif zorluk, kural tabanlı; ML yok).

### 1.12 Sosyal kanıt ve relatedness — backend'siz

Backend yokken sosyal katman üç şekilde kurulur:
1. **Paylaşım kartı:** Cihazda render edilen görsel (mezar taşı, Teşhis, "hayat özeti") — OS share sheet ile. Reigns 2M+ oyuncuya "Tinder-krasi" meme'iyle ulaştı; kart tasarımı viral birim olmalı.
2. **Yerel leaderboard:** Oyuncunun kendi geçmiş hayatları ("En uzun yaşadığın: 91, en zengin: hayat #4"). Dürüst, motive edici, sıfır sunucu.
3. **Simüle komşu hayatlar:** Aynı simülasyon motoru seed'le 5–10 "komşu" üretir; oyuncuya **"simüle edilmiş hayatlar"** olarak açıkça etiketlenir. Karşılaştırma ("Komşun Ahmet aynı yaşta ev aldı, sen hâlâ kirada") mizah ve motivasyon üretir. "Gerçek oyuncular" diye sunmak Google Play Deceptive Behavior / UCPD ihlali olur; **etiket zorunlu**.

### 1.13 Kimlik ve kendini ifade

Oyuncu "kim olduğunu" oyunda görmek ister. Teşhis sistemi tam olarak budur: "Sen bir 'Toksik Pozitif'sin" rozeti, hem roast hem kimlik. Paylaşım kartları kimlik taşıyıcısıdır.

### Bu oyuna nasıl uygularız (Bölüm 1 özeti)

- **Hiyerarşi:** SDT (anlamlı karar + görünür büyüme + hafızalı ilişkiler) temel; değişken ödül anlatı havuzunda; kayıptan kaçınma sadece "duraklatılan" streak ve ölüm→içerik dönüşümünde.
- **Her mekanik için "Black Hat → White Hat çıkışı" kuralı** tasarım dokümanına yazılır.
- Narrator, psikolojik mekaniklerin **görünür yüzü**dür: tetikleyici, ödül yorumu, roast ve motivasyon aynı karakterden gelir. Bu, oyunu "sistem" değil "ilişki" yapar — relatedness'ın backend'siz halidir.

---

## 2. Mekanik Envanteri — Metin Tabanlı Hayat Simülasyonuna Haritalama

| Mekanik | Ne işe yarar | Bizdeki hali | Not |
|---|---|---|---|
| Streak | D1–D7 alışkanlık | "Koç Streak'i", duraklayan, haftalık Pardon Kartı | §1.5 |
| Daily login ödülü | D1–D3 | **Yok** (boş tıklama üretir; AppAgent'ın uyarısı). Yerine günlük "Koç Görevi" | aşağıda |
| Daily quest | Session uzunluğu + D7 | 3 günlük görev: 1 kolay (1 yıl yaşa), 1 orta (bir Teşhis'e ilerle), 1 "zıpır" (ör. "bu hayatta bir politikacıya tokat at") | deterministik seed |
| Appointment | Geri gelme | **Yumuşak**: "yarın hasat" yerine "yarın haftalık tema değişiyor" (takvim gerçek) | §2.6 |
| Energy | Pacing + monetizasyon | **Yok** | §2.4 |
| One more turn | Session uzunluğu | "Bir yıl daha": 3 vadeli hedef + değişken olay + cliffhanger | §2.5 |
| Session-end cliffhanger | Geri gelme | Yıl özeti son satırı + push referansı | §1.7 |
| Meta-progression | D30+ | Miras Puanı → kalıcı açılımlar (yeni başlangıç şehirleri, narrator modları) | §2.7 |
| Prestige/NG+ | Uzun vade | Jenerasyon: ölünce çocukla devam, miras taşır | §2.13 |
| Koleksiyon/ribbon | Completionist | Teşhis duvarı (60 → 120 Teşhis) | §2.8 |
| Unlock ağacı | Yön hissi | Kariyer ağaçları + "Hayat Yolları" (görünür, kilitli) | §2.9 |
| LTE | Yenilik | Offline haftalık tema, `hash(YYYY-WW)` seed | §2.10 |
| Anlatıda değişken ödül | Merak | Nadirlik katmanlı storylet havuzu | §1.1 |
| Kişiselleştirme | Investment | İsim, şehir, "narrator seni nasıl çağırsın?" | §2.11 |
| Welcome back | Lapsed geri dönüş | Welcome-back roast + "koma özeti" | §2.12 |
| Idle/offline özet | Geri dönüş hissi | "Sen yokken dünya döndü" kartı (simüle, deterministik) | §2.12 |
| Challenge modu | Çeşitlilik | Haftalık "Kısıtlı Hayat" (ör. 5 lira ile başla) | §2.14 |
| New Game+ | Replay | Jenerasyon + "Zor Narrator" modu | §2.13 |

### 2.1 Streak — ayrıntı
Zaten §1.5. Ek: Streak ekranda **küçük** olmalı (Duolingo'da büyük olması aşırı baskı şikâyetlerine yol açıyor — "550+ günlük streak'imi bırakmam için 6 sebep" tipi makaleler). Bizim tonumuzda streak'i narrator takip eder, HUD değil.

### 2.2 Daily login ödülü neden yok
Kore mobil oyun çalışması (arXiv 2504.10714) login ödüllerinin oyunların %95'inde olduğunu, yani farklılaştırıcı olmadığını gösteriyor; ölçülmüş retention uplift'i bulunamadı. AppAgent'ın uyarısı: "aç-al-kapat" davranışı yüzey metriklerini şişirir, engagement üretmez. Biz login yerine **oynama** ödüllendiririz: günün ilk yılını yaşadığında "Koç Görevi" açılır.

### 2.3 Günlük Koç Görevleri
Deterministik: `seed = hash(userId_local + YYYY-MM-DD)`. 3 görev, 1'i her zaman mizahi/absürt. Tamamlanınca Miras Puanı (+ küçük). Görevler **mevcut hayata** bağlı ("Bu yıl annenle konuş") — oyuncuyu hikâyeye iter, menüye değil.

### 2.4 Energy sistemleri — neden kullanmıyoruz
- Temayla çatışır: "hayat yaşamak için enerji bekle" absürt (Mobile Free To Play, "Eliminating Energy").
- Bekleme satmak: DMCC/UCPD altında doğrudan yasak değil ama "pay-to-skip-wait" platformlarda ve basında "dark pattern" listelerinde; publisher'lar 2024–2026'da hybrid-casual'da energy'siz pacing'e kaydı.
- Fallen London (narrative emsal) 20 action / 10 dakikada 1 yenilenme ile çalışıyor ve incelemelerde "klasik F2P energy" olarak eleştiriliyor; Episode/Choices "ticket/key" sistemleri de aynı şikâyeti alıyor.
- En önemlisi: energy bizim en büyük varlığımız olan "bir yıl daha" döngüsünü keser.
**Alternatif pacing:** bölüm kapanışları (yaş bantları), yıl özeti kartı, "bu kadar yeter, git uyu" diyen narrator (opsiyonel, oyuncu kapatabilir — bu aynı zamanda etik bir sinyaldir).

### 2.5 "Bir yıl daha" döngüsü (Civilization dersi)
Sid Meier'in GDC notları: "bir tur daha" çekimi **kısa, orta ve uzun vadeli hedeflerin aynı anda çözülmemiş olmasından** gelir; "ilginç karar" = tradeoff içerir ve mevcut duruma bağlıdır. Bizde her yaş ekranında 3 "açık uç" HUD'da görünür:
- Kısa (bu yıl): "Sınav var / Borç vadesi / Flört yanıt bekliyor"
- Orta (3–5 yıl): "Ev peşinatı %64"
- Uzun (ömür): "Teşhis: 'Pişmanlıksız' — 23 yıl daha böyle git"
Yıl geçişi animasyonu ≤ 400 ms; "Yaşlan" butonu her zaman baş parmak bölgesinde.

### 2.6 Appointment mekanikleri
Klasik FarmVille "ekin çürür" modeli kayıptan kaçınmayı zorlar; biz **takvim gerçekliği** kullanırız: haftalık tema pazartesi 00:00 yerel saatte değişir, bu gerçek bir randevudur. "Bu haftanın 12 olayından 7'sini gördün" ilerlemesi oyuncuyu hafta bitmeden getirir. Sahte sayaç yok; tarih cihaz saatinden.

### 2.7 Meta-progression (Hades / Slay the Spire / Vampire Survivors dersleri)
- **Hades:** her ölüm yeni diyalog + kalıcı ilerleme (Mirror of Night) + "Fated List" görev listesi; 22.000+ satır diyalog ölümü içerik tüketimine çevirir (GDC 2021, Kasavin & Korb). Bizde: ölüm = mezar taşı + narrator'ın "ölüm sonrası değerlendirmesi" + yeni açılan narrator replikleri.
- **Slay the Spire:** meta-ilerleme bilinçli olarak sınırlı; güç değil **çeşitlilik** açılır (kartlar/relic'ler). Bizde Miras Puanı güç satın almaz; **yeni başlangıç koşulları, şehirler, narrator kişilikleri, Teşhis kategorileri** açar. Bu "meta as variety not power" ilkesi dengeyi korur ve pay-to-win algısını baştan keser.
- **Vampire Survivors:** unlock listesi görünür, her run 1–2 unlock. Bizde her hayat en az 1 Teşhis veya 1 Miras açılımı garanti (pity timer — paraya bağlı olmadığı için regülasyon dışı).

### 2.8 Koleksiyon — BitLife ribbon'larından Teşhis'e
BitLife'ın ~30 ribbon'u (Lazy, Cat Lady, Geriatric, Rich, Highroller, Teammate...) rehber sitelerinde yıllardır içerik üretiyor: koleksiyon = organik SEO + topluluk. Dersler: (a) eşikler net olmalı (rehberler eşiklerde çelişiyor, biz oyun içinde göstereceğiz), (b) gizli rozetler ("Teammate") topluluk konuşması üretir, (c) ~30 az; launch'ta 60, yıl 1 sonunda 120 Teşhis. Teşhis adları roast tonunda ("Sabah İnsanı Değil", "LinkedIn Filozofu", "Annesinin Avukatı").

### 2.9 Unlock ağaçları
Kariyer ve "Hayat Yolu" ağaçları görünür ama kilitli; Loewenstein boşluğu. Her düğümde 1 satır mizahi tanım. Ağaç ilerlemesi hayatlar arası **kısmen** kalıcı (jenerasyon mirası).

### 2.10 Limited-time event — offline, deterministik
Tasarım:
```
week_key   = ISO yıl-hafta (yerel saat)
theme_idx  = SHA256(week_key + salt) mod THEME_POOL_SIZE
theme      = bundle'daki tema havuzundan [theme_idx]
```
- Tema havuzu uygulama paketinde (launch: 16 tema → 4 ay tekrar yok; her güncellemede +4).
- Oyuncu saati ileri alırsa: tolerans ±36 saat; aşırı sapmada tema değişir ama **ceza yok** (bu oyuncu zaten kendini kandırıyor; narrator bunu fark eder ve roast eder: "Takvimi ileri almışsın. Hayatta da işe yarasa keşke.").
- Push hatırlatma yerel zamanlanmış bildirim (sunucu gerekmez).
- Apple/Google açısından: gerçek takvim = "substantiate the urgency" (CMA) şartı doğal olarak sağlanır.

### 2.11 Kişiselleştirme ve isimlendirme
İsim, şehir, narrator'ın hitap şekli ("kanka / efendim / evlat"). Narrator'ın ad kullanımı investment'ı artırır. Doğum günü isteğe bağlı (gerçek doğum gününde özel olay — opt-in, cihazda).

### 2.12 Welcome back ve offline özet
Lapsed oyuncu (≥ 3 gün) açılışta "Koma Raporu" görür: "Sen yokken: kedin seni unuttu (−2 Sosyal), komşun ev aldı, narrator 3 kere dedikodunu yaptı." Deterministik (son görülme tarihi + seed). **Ceza yok**, sadece mizah ve bir "geri dönüş hediyesi" (1 Pardon Kartı). Airship 2023: ilk 90 günde en az 1 push alanların retention'ı ≈ 1/3 daha yüksek (tüm app'ler, korelasyonel) — welcome-back push'u 3. ve 7. günde planlanır, sonra susar (bildirim yorgunluğu opt-out'a yol açar).

### 2.13 New Game+ ve jenerasyon oyunu
Ölünce: (a) yeni hayat, (b) **çocuğunla devam** (miras: para %X, Teşhis bonusları, aile dedikoduları). Jenerasyon modu uzun vadeli hedef ("5 kuşak") ve "Epic Meaning" üretir; Aile Albümü soyağacı görseli paylaşım kartı olur.

### 2.14 Challenge modları
Haftalık temayla birleşik: "Bu hafta: 5 lira ve bir kediyle başla." Deterministik, offline. Tamamlayana özel Teşhis.

### Bu oyuna nasıl uygularız (Bölüm 2 özeti)
Launch kapsamı: streak (duraklayan), Koç Görevleri, bir-yıl-daha HUD'u, cliffhanger satırları, Teşhis (60), Miras Puanı, haftalık tema (16), welcome-back. Ertelenen: jenerasyon (v1.1), challenge (v1.1), unlock ağacı görselleştirme (v1.2). Energy ve login ödülü: hiçbir sürümde.

---

## 3. Benchmark'lar (2024–2026)

> Uyarı: GameAnalytics ve Sensor Tower raporlarının tam metnine bu oturumda ağ kısıtı nedeniyle erişilemedi; rakamlar raporların kendi özet sayfalarından ve ikincil derlemelerden alındı, kaynak numaralarıyla işaretlendi. Simülasyon/narrative türü için birincil kaynaklı genre kırılımı **bulunamadı** (GameAnalytics 2026 raporu genre kırılımı yayınlamıyor).

### 3.1 Retention

| Kaynak | Kapsam | D1 | D7 | D28/D30 | Not |
|---|---|---|---|---|---|
| Adjust 2026 (2025 verisi) [8] | Tüm oyunlar, global | %27 | %13 | D14 %8, D30 %5 | 2024'te de D1 %27, D7 %13 |
| GameAnalytics 2025 (11.600 oyun) [1][9] | Tüm oyunlar, medyan | ≈ %22 | %3,4–3,9 | %75'i D28 < %3 | Klasik retention, D28 |
| GameAnalytics 2025 — top %25 [1][9] | | %26,5–27,7 (iOS %31–33, Android %25–27) | %7–8 | — | |
| GameAnalytics 2026 (16.262 oyun) [26] | Medyan / top %25 / top %1 | ≈ %22 (ikincil, çelişkili) | < %4 | D30 %0,69–0,79 / %1,6–1,8 / %13–15 | Genre kırılımı yok |
| AppsFlyer (Q3 2024, tüm app'ler) [10] | iOS / Android | %23,9 / %20,3 | %8,3 / %5,6 | %3,7 / %2,1 | Oyun değil, tüm app'ler |
| Pushwoosh hypercasual (yıl belirsiz) [10] | iOS / Android | %24,5 / %23,7 | %12,1 / %9,0 | %7,3 / %4,3 | Referans |
| Mid-core (Sensor Tower, ikincil) [1] | | %44–45 | %20–21 | %11–12 | Üst sınır referansı |
| AppMagic Casual 2025 [12] | Trend | kısa vade sabit | | D14→D30 −3,5 ile −5,4 puan | Uzun vade kötüleşiyor |

**Yorum:** Adjust'ın "ortalama" rakamları (%27/13/5) ile GameAnalytics'in "medyan" rakamları (%22/3,7/<1) arasındaki uçurum dağılımın çarpıklığından gelir: az sayıda büyük oyun ortalamayı yukarı çeker. Publisher'lar **medyana değil top %25'e** bakar.

### 3.2 Session ve zaman

| Kaynak | Metrik | Değer |
|---|---|---|
| Adjust 2026 [8] | Ortalama oyun session'ı (global) | ≈ 30 dk (2024: 30,75; APAC 33,14; strateji 37,51) |
| Adjust 2026 [8] | D0 session/kullanıcı | 1,65 (hyper/hybrid-casual 1,82) |
| GameAnalytics 2025 [25] | Medyan session (P50) | 3,1–3,5 dk |
| GameAnalytics 2024/25 [3] | Top %25 session | 8–9 dk |
| GameAnalytics 2024 [8] | Medyan session/gün | 4 |
| GameAnalytics 2026 — top %25 [26] | Günlük oyun süresi / session / session sayısı | 22–24 dk / 5,2 dk / 5,3–5,7 |
| GameAnalytics 2026 — top %10 / %1 [26] | Günlük süre | 40–42 dk / > 94 dk |
| Sensor Tower 2026 [19] | Tür bazında zaman | Simülatörler 1., puzzle 2., strateji 3. |
| Sensor Tower 2025/2026 [7][19] | Simülasyon indirme payı | Global indirmelerin %20'si (2024) |

Adjust'ın "30 dk session"ı attribution SDK'sının session tanımından (arka plan dahil) kaynaklanır; GameAnalytics'in 3–5 dk'sı daha gerçekçidir. **Bizim için anlamlı hedefler GameAnalytics ölçeğindedir.**

### 3.3 Monetizasyon referansı (publisher sohbeti için)
Liftoff 2025 Casual Gaming Apps Report: D30 ROAS casual oyunlarda iOS %47, Android %15; iOS'ta en yüksek sports %80, kids %68, strategy %60 (Şubat 2024–Şubat 2025, Liftoff+Singular) [3]. Unity rewarded-ad formatları D7'de +4 puan, D30'da +2 puan retention (AppAgent aktarımı, ikincil) [21].

### 3.4 Publisher'lar bu sayıları nasıl okur
- **Soft launch kapısı:** D1 ≥ %35–40, D7 ≥ %15, D30 ≥ %6–8 (casual/sim hibrit için; narrative oyunlarda D1 daha yüksek, D30 daha düşük kabul edilir). Bunlar yayınlanmış bir standart değil, 2024–2026 raporlarındaki top %25 eşiklerinin üstüne konan pratik marjdır.
- **Session:** ≥ 10 dk/gün ve ≥ 3 session/gün "alışkanlık var" sinyalidir.
- **Zaman serisi:** D1→D7 düşüşü %50'den az ise onboarding iyi; D7→D30 düşüşü %50'den az ise meta var.
- Publisher ilk görüşmede CPI'yı da sorar; retention × ARPDAU/CPI "payback" hesabına girer. Bizim tonumuz (kara mizah, TR) organik/viral CPI avantajı vaat eder; paylaşım kartı bu yüzden P0.

### Bu oyuna nasıl uygularız (Bölüm 3)
- **Hedef tablosu (soft launch, TR, 1.000+ install):** D1 %40, D3 %25, D7 %16, D30 %7; 12 dk/gün; 3,2 session/gün; "yıl/session" ≥ 15; ölüm→yeniden doğuş oranı ≥ %70 (ölen oyuncuların aynı session'da yeni hayat başlatması).
- Ölçüm: opsiyonel analytics SDK (anonim). Backend yok ama Firebase/GameAnalytics SDK "oyun için gerekli değil" şartına uyar.
- Genre kırılımı eksik olduğu için **kendi emsal setimizi** kuracağız: BitLife, Reigns, Chapters, Alter Ego, Life Simulator türevlerinin store sıralama/indirme trendleri (AppMagic ücretsiz katmanı) ile dolaylı okuma.

---

## 4. Metin Tabanlı Oyunlarda Session Süresi ve Zaman Teknikleri

### 4.1 Okuma hızı tasarım parametresidir
Brysbaert (2019, *J. Memory & Language*; 190 çalışma, 18.573 katılımcı): yetişkin sessiz okuma hızı **238 wpm** (kurgu dışı), **260 wpm** (kurgu), sesli okuma 183 wpm; dağılım geniş (≈ 100–400). Latin alfabeli diller için; Türkçe'nin eklemeli yapısı (daha uzun kelime, daha az kelime) ölçümü değiştirir — **kelime değil karakter/hece bütçesi** kullanacağız.

**Bütçe:** 1 olay kartı = 150–260 karakter (≈ 6–10 sn okuma). Narrator roast'u = 60–120 karakter. Yıl özeti = 3–5 satır. Her metin alanına editörde karakter sayacı + "okuma süresi" tahmini.

### 4.2 Metin parçalama (chunking)
- Tek kartta tek olay, tek karar. Reigns'in "soru–cevap ritmi" (Alliot: "kartların formatı yazıya akış ve ritim dayatıyor").
- Uzun olaylar 2–3 karta zincirlenir ("devam" dokunuşu Zeigarnik'i besler).
- Başlık (≤ 40 karakter) + gövde + 2–3 seçenek (≤ 24 karakter/seçenek). Reigns 2 seçenekle (sola/sağa) çalışıyor; bizde 2 varsayılan, bazen 3; 4+ asla.

### 4.3 Seçim yoğunluğu
Her yıl ortalama **2 karar** (min 1, maks 3). Her yıl karar olmazsa "yaşlan spam"i; her yıl 4+ karar olursa yorgunluk. Yaş bantlarına göre değişir (§1.11). Kararsız yıllar "montaj" kartıyla hızlı geçer ("3 yıl geçti. Hiçbir şey olmadı. Senin hayatın işte.").

### 4.4 Fast-forward ve "atla"
BitLife'ın "yaşlan" tuşu zaten fast-forward'dur. Bizde ek: "5 yıl atla" düğmesi (montaj kartı + risk: atlanan yıllarda rastgele 1 önemli olay otomatik çözülür — narrator sonradan yüzüne vurur). Fast-forward hem oyuncu otonomisi hem de "sonuçlu" olduğu için ilginç karar.

### 4.5 Zincirler (storylet chains)
Kreminski & Wardrip-Fruin (ICIDS 2018): storylet = ön koşul + içerik + etki; Fallen London'da "quality-based narrative". Bizde çok yıllı zincirler (ör. "Kedi Üçlemesi": 19'da bul, 24'te fenomen olsun, 31'de miras bıraksın) oyuncuya **orta vadeli** açık uç verir — "bir yıl daha"nın yakıtı.

### 4.6 Mini-oyunlar
Sınırlı ve hızlı: 5–10 saniyelik dokunma mini-oyunları (ör. "iş görüşmesinde gözünü kırpma") sadece büyük anlarda. Ritmi bozmayacak; metin oyunlarında mini-oyun "pacing değişimi" içindir, ana döngü değil.

### 4.7 Session mimarisi (hedef)
```
Açılış (≤ 3 sn) → Koma Raporu / Koç Görevi (10 sn)
→ 8–15 yıl × (olay 6–10 sn + karar 3–5 sn + roast 3 sn) ≈ 3–5 dk
→ Bölüm kapanışı (yaş bandı özeti, Teşhis ilerlemesi) 15 sn
→ cliffhanger satırı → oyuncu ya "bir yıl daha" ya kapatır
```
Bir "doğal durak" her 4–6 dk'da bir gelir; oyuncu 2–3 durak geçerse 12–15 dk'lık session oluşur. Ölüm ekranı session'ın en güçlü anıdır: mezar taşı + "Hayat Kitabı" + paylaş + **"Yeniden doğ" tek dokunuş**.

### Bu oyuna nasıl uygularız (Bölüm 4)
- Metin editörüne karakter/okuma-süresi bütçesi ve "cliff satırı zorunlu" kuralı.
- Yaş bantlarına göre karar yoğunluğu tablosu (18–25: 2,5/yıl; 26–40: 1,5/yıl; 41–60: 2/yıl; 60+: 1/yıl).
- Mini-oyun sayısı launch'ta ≤ 3.
- "Yıl/session" ve "durak sonrası devam oranı" ana session KPI'ları.

---

## 5. Etik ve Politika

### 5.1 Platform kuralları

**Apple App Store Review Guidelines**
- **3.1.1 (Aralık 2017'den beri):** "Loot box" veya satın alınan rastgele sanal öğe sunan uygulamalar her öğe türünün **alınma olasılığını satın alma öncesinde** açıklamak zorunda [13][14]. (Oyun içi para ile alınan kutuların kapsamı forumlarda tartışmalı.)
- **5.6 Developer Code of Conduct (Haziran 2021 genişletmesi):** tekrarlayan manipülatif/yanıltıcı davranış geliştirici programından çıkarılmaya yol açar [15].
- **Yaş dereceleri:** 24 Temmuz 2025'te 13+/16+/18+ tier'ları eklendi (12+/17+ kaldırıldı); mevcut uygulamalar otomatik yeniden derecelendirildi; anket tamamlama son tarihi 31 Ocak 2026 (tamamlamayan güncelleme gönderemiyor). 16 Kasım 2026'dan itibaren yeni içerik tanımlayıcıları; "dating and relationships" kategorisi otomatik 18+; mevcut uygulamalar için son tarih 12 Ocak 2027 [5][16]. Apple'ın Şubat 2025 "Helping Protect Kids Online" belgesine göre **frequent/intense mature or suggestive themes → 16+**, **profanity or crude humor → 13+** (sık/yoğun küfürde kaynaklar 13+ ile 16+ arasında çelişiyor); sansürlü küfür de sayılıyor; bölgesel farklar var (Brezilya daha sert) [16].

**Google Play**
- **Payments policy:** rastgele sanal öğe (loot box) sunan uygulamalar olasılıkları satın alma öncesinde, **yakın ve zamanlı** biçimde göstermek zorunda (30 Mayıs 2019'dan beri; Kore'de ek yasal zorunluluk) [17].
- **Deceptive Behavior (güncelleme 28 Mayıs 2025):** kullanıcıyı aldatan veya dürüst olmayan davranışı etkinleştiren uygulamalar yasak; "misleading claims" — şaka olarak etiketlense bile işlevi yanlış tanıtmak yasak; sistem bildirimine benzeyen reklamlar yasak [18].
- IARC anketi: "crude humor", "mature humor", "sexual content", "simulated gambling" soruları PEGI/ESRB/USK'yi belirler (bu turda birincil doğrulama yapılamadı).

### 5.2 Regülasyon

| Yargı | Kural | Bizim için anlamı |
|---|---|---|
| **AB — DSA Art. 25** [20] | Online platformlar arayüzü kullanıcıyı aldatacak/manipüle edecek veya "özgür ve bilinçli karar" yetisini bozacak şekilde tasarlayamaz; UCPD/GDPR kapsamındakiler hariç. Komisyon'un Art. 25(3) rehberi henüz yok; **Digital Fairness Act** hazırlanıyor (BEUC: premium para birimi ve paralı loot box yasağı talebi) | Bir oyun "platform" değil ama UCPD zaten geçerli; DFA gelirse paralı rastgelelik ve sahte kıtlık doğrudan hedefte |
| **UK — DMCC Act 2024, 6 Nisan 2025'ten itibaren** [22] | Yasaklı uygulamalar: **drip pricing**, **sahte kıtlık/aciliyet** (geri sayım kullanan "aciliyeti kanıtlamalı"), yanıltıcı online choice architecture; CMA207/CMA209 rehberleri; CMA doğrudan ceza kesebiliyor | Sahte geri sayım, "son şans", gizli ücret yok. Gerçek takvim tabanlı tema OK |
| **ABD — FTC** [6][23] | Epic Games: 245M$ "dark pattern" (kafa karıştırıcı buton yerleşimiyle istenmeyen alışveriş) + 275M$ COPPA = 520M$; Aralık 2024'te 72M$ iade dağıtıldı. 2022 "Bringing Dark Patterns to Light" raporu. 2024 ICPEN taraması: 642 site/app'in **%76'sı en az 1 dark pattern**, %67'si birden fazla | "Tek dokunuşla satın alma" UI'ı yok; satın alma akışı 2 adım + onay; iptal/iade bilgisi görünür |
| **Hollanda** [24] | Danıştay (9 Mart 2022): FIFA paketleri "şans oyunu" değil → KSA cezası iptal; ama tartışma sürüyor | Yasal gri alan — gri alana girmeyeceğiz |
| **Belçika** [24] | Kumar Komisyonu (Nisan 2018): paralı loot box = kumar; EA Ocak 2019'da FIFA Points satışını durdurdu | Paralı rastgelelik = Belçika'da yayın riski |

### 5.3 Çizgi: ne kullanıyoruz, ne kullanmıyoruz

**Kullanıyoruz (ve neden sorun değil):**
- Streak (duraklayan, cezasız) — kayıt, tehdit değil.
- Günlük görev, haftalık gerçek-takvim teması — aciliyet gerçek ve kanıtlanabilir.
- Anlatısal değişken ödül, nadir olaylar, near-miss **sadece hikâyede** — para yok.
- Koleksiyon/Teşhis, Miras meta-ilerlemesi — güç değil çeşitlilik.
- Rewarded reklam (opt-in, sabit ödül), sabit içerikli IAP (tema paketi, Premium Koç, reklamsız).
- Simüle komşu hayatlar — **"simülasyon" etiketiyle**.
- Welcome-back roast — hediye var, ceza yok.
- Narrator'ın "yeter, git uyu" uyarısı — kapatılabilir, ama varsayılan açık (iyi niyet sinyali; Apple 16+ incelemesinde artı).

**Kullanmıyoruz:**
- Energy/bekleme satışı.
- Paralı rastgele kutu, paralı gacha, premium para birimiyle rastgelelik.
- Sahte geri sayım, sahte "X kişi şu an bakıyor", sahte "son 3 adet".
- Streak kaybı tehdidi + streak kurtarmayı **para** ile satma (Pardon Kartı ücretsizdir; IAP ile ekstra Pardon Kartı satışı **yapmayacağız** — DMCC altında "kayıp korkusuyla satış" tartışmasına girmemek için).
- Tek dokunuş satın alma, karışık buton yerleşimi (Epic davası).
- Gerçek kumar simülasyonu (18+ tetikler, Google "simulated gambling" sorusu) — "piyango" olayları sadece anlatı, oyuncu "oynamaz".
- Çocuk hedefleme / COPPA kapsamı: 16+ hedefleniyor; Families programına girilmeyecek.

### 5.4 Kara mizah ve yaş derecesi
Ton 16+'da tutulmalı: cinsel içerik imalı ve nadir (sık/grafik → 18+), uyuşturucu "referans" düzeyinde (kullanım teşviki → 18+), şiddet komik/abstrakt, küfür **kontrollü** (narrator küfür etmez, ima eder — "sansürlü küfür de sayılır"). Intihar/kendine zarar temaları: Apple ve Google'da hassas; narrator'ın motive edici katmanı için **kırmızı çizgi**: bu temalar sadece yardım kaynağına yönlendirerek ve asla şaka konusu olmadan işlenir. Bu, "roast ama motive et" pillar'ının da gereğidir.

### Bu oyuna nasıl uygularız (Bölüm 5)
- Tasarım dokümanına "Yasak Mekanikler" ek'i (yukarıdaki liste) ve her yeni özellik için 5 soruluk checklist: (1) para ile rastgelelik var mı, (2) aciliyet kanıtlanabilir mi, (3) kayıp tehdidi var mı, (4) tek dokunuşla ödeme var mı, (5) 16+ sınırını zorluyor mu.
- Store anketlerini (Apple yeni tier, IARC) launch'tan 6 hafta önce taslak doldurup içerik ekibiyle "16+'da kalıyor muyuz" denetimi.
- AB/UK/TR tüketici hukuku: fiyat tam gösterim, IAP içeriği satın alma öncesi listelenir.

---

## 6. Retention Mechanics Matrix (öncelikli)

Beklenen etki: ↑ küçük, ↑↑ orta, ↑↑↑ büyük (kanıta ve tür benzerliğine dayalı tahmin). Maliyet: S (≤ 1 sprint-gün), M (2–5), L (> 5). Öncelik: P0 launch, P1 v1.1, P2 sonrası.

| # | Mekanik | Psikolojik sürücü | Oyunda görünümü | D1 | D7 | D30 | Session | Risk | Maliyet | Öncelik |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | "Bir yıl daha" HUD'u (3 vadeli açık uç) | Zeigarnik, goal-gradient, interesting decisions | Kısa/orta/uzun hedef satırları her yaş ekranında | ↑↑ | ↑↑ | ↑ | ↑↑↑ | Düşük; HUD kalabalığı | M | **P0** |
| 2 | Yıl sonu cliffhanger satırı + push referansı | Zeigarnik, curiosity gap | Yıl özetinin son satırı açık soru; bildirim aynı soruyu tekrarlar | ↑↑ | ↑↑ | ↑ | ↑ | Düşük; yazarlık yükü | M | **P0** |
| 3 | Teşhis koleksiyonu (60→120) | Accomplishment, ownership, identity, endowed progress | Roast tonlu rozetler, kısmi ilerleme, 3 otomatik başlangıç | ↑ | ↑↑ | ↑↑↑ | ↑↑ | Düşük; eşik şeffaflığı | L | **P0** |
| 4 | Duraklayan streak + haftalık Pardon Kartı | Loss aversion (yumuşak), habit (Lally), momentum (Silverman) | Narrator takip eder; "47 gün (duraklatıldı)"; ücretsiz onarım | ↑↑ | ↑↑↑ | ↑↑ | ↑ | Orta; baskı algısı → küçük UI | S | **P0** |
| 5 | Günlük Koç Görevleri (3, deterministik) | Competence, daily quest | Oynayınca açılır, hikâyeye bağlı, 1'i absürt | ↑↑ | ↑↑ | ↑ | ↑↑ | Düşük | M | **P0** |
| 6 | Ölüm ekranı = içerik (mezar taşı, Hayat Kitabı, tek dokunuş yeniden doğ) | Hades döngüsü, ownership, sosyal paylaşım | Ölüm anı en güçlü paylaşım ve re-entry noktası | ↑↑ | ↑↑ | ↑↑ | ↑↑↑ | Düşük | M | **P0** |
| 7 | Paylaşım kartları (yerel render) | Social influence, identity | Mezar taşı, Teşhis, soyağacı görselleri | ↑ | ↑ | ↑ | — | Düşük; marka/ton tutarlılığı | M | **P0** |
| 8 | Nadirlik katmanlı storylet havuzu | Variable ratio, curiosity | %70/25/4/1 dağılım; nadirlik sonradan gösterilir | ↑↑ | ↑↑ | ↑↑ | ↑↑ | Düşük; içerik hacmi | L | **P0** (içerik) |
| 9 | Miras Puanı meta-ilerlemesi (çeşitlilik, güç değil) | Accomplishment, SDT competence | Yeni şehirler, narrator modları, başlangıç koşulları | ↑ | ↑↑ | ↑↑↑ | ↑ | Orta; ekonomi dengesi | L | **P1** |
| 10 | Offline haftalık tema (hash(YYYY-WW)) | Scarcity (gerçek), novelty, appointment | 12 yeni olay/hafta, 16 tema launch | ↑ | ↑↑ | ↑↑↑ | ↑ | Düşük; saat manipülasyonu (cezasız) | M | **P1** |
| 11 | Welcome-back "Koma Raporu" + 2 push (D3, D7) | Re-engagement, humor | Deterministik "sen yokken" özeti + Pardon Kartı | — | ↑↑ | ↑↑ | ↑ | Orta; bildirim yorgunluğu | S | **P1** |
| 12 | Simüle komşu hayatlar (etiketli) | Social comparison, relatedness | 5–10 seed'li NPC yaşamı; karşılaştırma roast'u | ↑ | ↑ | ↑↑ | ↑ | **Orta-yüksek**: etiket şart, aksi aldatıcı | M | **P1** |
| 13 | Jenerasyon oyunu (çocukla devam) | Epic meaning, NG+, ownership | Soyağacı, miras transferi | — | ↑ | ↑↑↑ | ↑↑ | Orta; denge | L | **P1** |
| 14 | Yaş bandı adaptif zorluk | Flow | Olay sıklığı gösterge dengesizliğine göre | ↑ | ↑↑ | ↑↑ | ↑↑ | Orta; ayar | M | **P1** |
| 15 | "5 yıl atla" (sonuçlu fast-forward) | Autonomy, interesting decision | Montaj kartı + otomatik çözülen 1 olay | ↑ | ↑ | — | ↑ | Düşük | S | **P1** |
| 16 | Challenge modları (haftalık kısıtlı hayat) | Competence, novelty | "5 lira ve bir kediyle başla" | — | ↑ | ↑↑ | ↑↑ | Düşük | M | **P2** |
| 17 | Mini-oyunlar (≤ 3) | Pacing değişimi | 5–10 sn dokunma anları | ↑ | — | — | ↑ | Orta; ritim bozma | M | **P2** |
| 18 | Opsiyonel gerçek-hayat mikro-görevi | SDT (gerçek competence), motivasyon pillar'ı | "Bugün bir arkadaşını ara" — opt-in, kanıt istemez | — | ↑ | ↑↑ | — | Orta; sağlık/koçluk sınıfına kaymamalı | S | **P2** |
| 19 | Yerel leaderboard (kendi hayatların) | Competence, ownership | Rekor tablosu | — | ↑ | ↑ | ↑ | Düşük | S | **P2** |
| ✗ | Energy sistemi | Scarcity (Black Hat) | — | — | — | — | — | Yüksek (tema, etik, döngü kırma) | — | **Yapılmayacak** |
| ✗ | Login ödülü | — | — | — | — | — | — | Boş metrik | — | **Yapılmayacak** |
| ✗ | Paralı rastgele kutu | Variable ratio (para) | — | — | — | — | — | Hukuki (BE, NL, DFA) | — | **Yapılmayacak** |
| ✗ | Sahte aciliyet/sayaç | Scarcity (sahte) | — | — | — | — | — | DMCC, FTC, Google DB | — | **Yapılmayacak** |

---

## Bu Oyun İçin Öneriler (öncelikli, puanlı)

Puan = Etki (1–5) × Kanıt gücü (1–3) ÷ Maliyet (1–3), yuvarlanmış.

| Sıra | Öneri | Etki | Kanıt | Maliyet | Puan | Sprint |
|---|---|---|---|---|---|---|
| 1 | Core loop'u "bir yıl daha" etrafında kur: 3 vadeli HUD + ≤ 400 ms yıl geçişi + zorunlu cliff satırı | 5 | 3 | 2 | 7,5 | S1 |
| 2 | Ölüm ekranını oyunun "ana menüsü" yap: mezar taşı, Hayat Kitabı, paylaş, tek dokunuş yeniden doğ | 5 | 2 | 2 | 5,0 | S1 |
| 3 | Teşhis sistemi: 60 roast-rozet, kısmi ilerleme, 3 otomatik, 5 gizli | 5 | 3 | 3 | 5,0 | S2–S3 |
| 4 | Duraklayan streak + ücretsiz Pardon Kartı; streak HUD'da küçük, narrator'da büyük | 4 | 3 | 1 | 12,0 | S2 |
| 5 | Günlük Koç Görevleri (deterministik, hikâyeye bağlı, 1 absürt) | 4 | 2 | 2 | 4,0 | S2 |
| 6 | İçerik havuzu nadirlik katmanı + "görmediğin X olay" sayacı | 4 | 3 | 3 | 4,0 | S1–S4 (sürekli) |
| 7 | Paylaşım kartı şablonları (3 tip) — viral CPI düşürücü | 4 | 2 | 2 | 4,0 | S3 |
| 8 | Offline haftalık tema altyapısı + 16 tema | 4 | 2 | 2 | 4,0 | S4 |
| 9 | Welcome-back Koma Raporu + yerel zamanlanmış push (D3, D7, sonra sus) | 3 | 2 | 1 | 6,0 | S3 |
| 10 | Miras Puanı: "çeşitlilik açar, güç açmaz" ekonomisi | 4 | 2 | 3 | 2,7 | S5 |
| 11 | Simüle komşular — "simülasyon" etiketi UI'da sabit | 3 | 2 | 2 | 3,0 | S5 |
| 12 | Jenerasyon modu | 4 | 2 | 3 | 2,7 | S6 |
| 13 | Etik checklist (5 soru) + Yasak Mekanikler ek'i + store anketi ön denetimi | 3 | 3 | 1 | 9,0 | S0 |
| 14 | Analytics event şeması: yıl/session, durak-sonrası-devam, ölüm→yeniden doğuş, pardon kullanımı, tema ilerlemesi | 3 | 3 | 1 | 9,0 | S0 |

**Sprint 0 için somut çıktı:** (a) Yasak Mekanikler ek'i, (b) etik checklist, (c) analytics event listesi, (d) metin bütçesi kuralları (karakter/okuma süresi, cliff satırı), (e) yaş bandı karar yoğunluğu tablosu. Bunlar maliyetsiz ve her sonraki sprinti şekillendiriyor.

---

## Açık Sorular

1. **Tür bazlı birincil benchmark eksik.** GameAnalytics 2025'in simülasyon/adventure genre heatmap'lerine ve Q1 2024 PDF'in simülasyon satırına bu oturumda erişilemedi (ağ allowlist). Doğrulayıcı ajan: `gameanalytics.com` ve `gamedevreports.substack.com` erişimi açılırsa simülasyon D1/D7/D28 medyan+top %25 değerlerini alıp §3.1'e eklesin.
2. **GameAnalytics 2026 medyan D1 çelişkisi:** ikincil kaynaklar %22 ve %14 veriyor; birincil rapor kontrol edilmeli.
3. **Duolingo "3,6×" ve "Streak Freeze churn −%21" iddiaları** birincil kaynaksız; dokümanda sadece "korelasyonel, doğrulanmamış" olarak geçiyor. Kullanmayın.
4. **BitLife iş rakamları** (indirme, gelir, Candywriter) bu oturumda aranamadı (arama bütçesi doldu). T-benchmark konusu için gerekli.
5. **Apple sık/yoğun küfür → 13+ mu 16+ mı?** Kaynaklar çelişiyor; App Store Connect anketini taslak doldurarak netleştirilmeli.
6. **IARC "crude/mature humor" eşlemesi** doğrulanmadı (arama bütçesi). Google Play için PEGI 16 / ESRB T hedefi varsayım.
7. **Türkçe okuma hızı** için Brysbaert'in Latin-alfabe ortalaması kullanıldı; TR'ye özgü wpm/karakter-dakika verisi bulunmalı veya soft launch'ta kart-başı okuma süresi ölçülmeli.
8. **Klasik psikoloji atıfları** (Skinner, Kahneman–Tversky 1979, Zeigarnik 1927, Loewenstein 1994, Csikszentmihalyi 1990, Chen 2007) bu turda web ile doğrulanmadı; ders kitabı bilgisi olarak yer alıyor. Doğrulayıcı DOI ekleyebilir.
9. **Vampire Survivors / Slay the Spire** için birincil GDC/postmortem kaynağı bulunamadı; §2.7'deki ilkeler Hades (GDC 2021) ve ikincil yorumlara dayanıyor.
10. **"Gerçek hayat mikro-görevi" (P2)** uygulamayı Apple'ın sağlık/koçluk kategorisine veya 5.1.1 veri kurallarına yaklaştırır mı? Hukuk/politika konusu (T7?) altında incelenmeli.
11. **Simüle komşu hayatlar** için etiket metni ve UI yerleşimi UCPD "ortalama tüketici" testine göre tasarlanmalı; kullanıcı testi gerekli.
12. **Pardon Kartı'nın IAP ile satılmaması** kararı gelir tarafında maliyet; publisher bunu tartışabilir. Alternatif: "Premium Koç" aboneliği/paketinde sınırsız Pardon — ama bu yine "kayıp korkusuyla satış" tartışmasına girer. Karar GDD'de verilmeli.

---

## Kaynaklar

1. GameAnalytics — 2025 Mobile Gaming Benchmarks: https://www.gameanalytics.com/reports/2025-mobile-gaming-benchmarks
2. GameAnalytics — 2026 Mobile & PC Gaming Benchmarks: https://www.gameanalytics.com/reports/2026-mobile-pc-gaming-benchmarks
3. Liftoff — 2025 Casual Gaming Apps Report: https://liftoff.ai/2025-casual-gaming-apps-report/ ve özet: https://liftoff.ai/blog/highlights-2025-casual-gaming-apps-report/
4. Duolingo Help Center — What is a streak?: https://www.duolingo.com/help/what-is-a-streak
5. Apple Developer News — Updated age ratings in App Store Connect: https://developer.apple.com/news/?id=ks775ehf
6. FTC — Finalized order: Epic Games $245M (Mart 2023): https://www.ftc.gov/news-events/news/press-releases/2023/03/ftc-finalizes-order-requiring-fortnite-maker-epic-games-pay-245-million-tricking-users-making
7. Sensor Tower — State of Mobile Gaming 2025 (basın bülteni): https://sensortower.com/press/press-release-sensor-tower-mobile-gaming-rebounds-in-2024-as-player-engagement-and-spending-reach-new-highs
8. Adjust — Mobile app trends 2026 edition (PDF): https://a.storyblok.com/f/47007/x/8e101e06f9/mobile-app-trends-2026.pdf ; 2025 edition: https://a.storyblok.com/f/47007/x/9a13feb8eb/mobile-app-trends-2025.pdf ; Gaming App Insights 2026 özeti: https://gamedevreports.substack.com/p/adjust-gaming-app-insights-report
9. GameDev Reports — GameAnalytics 2025 özeti: https://gamedevreports.substack.com/p/gameanalytics-mobile-gaming-benchmarks
10. Innovecs — Mobile Game Retention Benchmarks 2026 (AppsFlyer/Adjust derlemesi): https://www.innovecsgames.com/blog/mobile-game-retention-benchmarks/ ; Pushwoosh: https://www.pushwoosh.com/blog/increase-user-retention-rate/
11. Yu-kai Chou — Streak Design (Duolingo analizi): https://yukaichou.com/gamification-study/master-the-art-of-streak-design-for-short-term-engagement-and-long-term-success/ ; Deconstructor of Fun — Duolingo Streaks: https://duolingo.deconstructoroffun.com/mechanics/streaks
12. AppMagic — Casual Games Report 2025: https://appmagic.rocks/research/casual-report-2025
13. Fenwick — Apple now requires disclosure of loot box odds: https://www.fenwick.com/insights/publications/apple-now-requires-disclosure-of-loot-box-odds
14. Apple Developer Forums — 3.1.1 In-App Purchase, loot boxes: https://developer.apple.com/forums/thread/94213
15. TechCrunch — Apple's new App Store guidelines aim to crack down on fraud and scams (5.6): https://techcrunch.com/2021/06/07/apples-new-app-store-guidelines-aim-to-crack-down-on-fraud-and-scams
16. Apple — Helping Protect Kids Online (Şubat 2025, PDF): https://developer.apple.com/support/downloads/Helping-Protect-Kids-Online-2025.pdf ; PPC Land — 18+ dating/companion: https://ppc.land/apple-forces-18-rating-on-dating-and-virtual-companion-apps-by-january-12/ ; Capgo rehberi: https://capgo.app/blog/app-store-age-ratings-guide/
17. Google Play Console Help — Payments policy (loot box odds): https://support.google.com/googleplay/android-developer/answer/9858738?hl=en ; Game Developer haberi: https://www.gamedeveloper.com/business/games-on-the-google-play-store-now-required-to-disclose-loot-box-odds
18. Google Play Console Help — Deceptive Behavior: https://support.google.com/googleplay/android-developer/answer/9888077
19. Sensor Tower — State of Gaming 2026 (PDF): https://investgame.net/wp-content/uploads/2026/02/2026-02-26-sensor_tower__state_of_gaming_2026__en_wp.pdf ; özet: https://gamedevreports.substack.com/p/sensor-tower-state-of-gaming-2026 ; State of Mobile 2026: https://sensortower.com/blog/state-of-mobile-2026
20. Osborne Clarke — Digital Fairness Act Unpacked: Dark Patterns (DSA Art. 25): https://www.osborneclarke.com/insights/digital-fairness-act-unpacked-dark-patterns ; ACM — Dark Patterns and the EU DSA: https://dl.acm.org/doi/full/10.1145/3772318.3791479 ; BEUC — Towards the Digital Fairness Act: https://www.beuc.eu/sites/default/files/publications/BEUC-X-2025-110_Towards_the_Digital_Fairness_Act.pdf
21. AppAgent — Mobile Game Retention Benchmarks (Unity rewarded ads etkisi): https://appagent.com/blog/mobile-game-retention-benchmarks/ ; daily habit loops: https://appagent.com/blog/build-daily-habit-loops-to-make-mobile-players-login/
22. Baker Botts — New CMA consumer protection comes into force (DMCC, Nisan 2025): https://www.bakerbotts.com/thought-leadership/publications/2025/april/new-cma-consumer-protection-comes-into-force ; CMS — Drip pricing: https://cms.law/en/gbr/legal-updates/no-hidden-charges-clamping-down-on-drip-pricing ; Ashurst — Mind the nudge: https://www.ashurstperkinscoie.com/en/insights/mind-the-nudge-the-dmccs-crackdown-on-manipulative-online-design/
23. FTC — Bringing Dark Patterns to Light (Venable özeti): https://www.venable.com/insights/blogs/2022/09/the-ftc-brings-more-light-to-dark-patterns-in-new ; ICPEN 2024 taraması (Hunton): https://huntonak.com/privacy-and-information-security-law/ftc-and-consumer-protection-networks-review-use-of-dark-patterns ; FTC iade duyurusu (Aralık 2024): https://www.ftc.gov/news-events/news/press-releases/2024/12/ftc-sends-refund-payments-consumers-impacted-epic-games-unlawful-billing-practices
24. CMS — Dutch court rules FIFA loot boxes not a game of chance (2022): https://cms.law/en/nld/legal-updates/Dutch-court-rules-FIFA-loot-boxes-not-a-game-of-chance-revokes-EA-penalty ; VGC — EA stops selling FIFA loot boxes in Belgium: https://www.videogameschronicle.com/news/ea-stops-selling-fifa-loot-boxes-in-belgium-jan-29-2019/ ; PSU — Belgium loot boxes: https://www.psu.com/news/why-belgium-was-the-first-country-to-classify-loot-boxes-as-gambling/
25. GameAnalytics 2025 raporu (gameindustrylibrary kopyası, session P50 3,1–3,5 dk): https://files.gameindustrylibrary.com/documents/mobile-gaming-benchmarks-2025.pdf
26. GameDev Reports — GameAnalytics 2026 özeti (top %25 22–24 dk/gün, 5,2 dk/session, 5,3–5,7 session/gün): https://gamedevreports.substack.com/p/gameanalytics-mobile-and-pc-game ; Galaxy4Games derlemesi: https://galaxy4games.com/en/knowledgebase/blog/mobile-game-retention-benchmarks-2026-d1-d7-d30-data-for-publishers
27. Ryan, Rigby & Przybylski (2006) — The Motivational Pull of Video Games: A SDT Approach, *Motivation and Emotion* 30(4): https://www.rochester.edu/warner/lida/wp-content/uploads/2022/11/02bfe513dd59366750000000.pdf ; PENS: https://selfdeterminationtheory.org/player-experience-of-needs-satisfaction-pens/
28. Silverman & Barasch (2023) — On or Off Track: How (Broken) Streaks Affect Consumer Decisions, *JCR* 49(6), DOI 10.1093/jcr/ucac029: https://udspace.udel.edu/handle/19716/34160
29. Lally et al. (2010) — habit formation (BPS özeti): https://bps.org.uk/research-digest/how-form-habit ; Surrey Üniv. röportajı: https://www.surrey.ac.uk/news/does-it-really-take-66-days-form-habit-we-asked-expert-dr-pippa-lally
30. Nunes & Drèze (2006) — Endowed Progress Effect (Game Developer özeti): https://gamedeveloper.com/game-platforms/the-psychology-of-games-the-endowed-progress-effect-and-game-quests ; Renascence: https://www.renascence.io/behavioral-biases/endowed-progress-effect
31. Clark et al. (2009) — near-miss fMRI, *Neuron* (Science News): https://www.sciencenews.org/article/gamblers-brains-almost-counts ; EurekAlert: https://www.eurekalert.org/news-releases/653015
32. Brysbaert (2019) — How many words do we read per minute?, *J. Memory & Language* 109: https://www.gwern.net/doc/psychology/linguistics/2019-brysbaert.pdf ; BPS özeti: https://www.bps.org.uk/research-digest/most-comprehensive-review-date-finds-average-persons-reading-speed-slower
33. Nir Eyal — Hook Model (Google Play Dev özeti): https://medium.com/googleplaydev/optimize-app-retention-with-the-hooked-model-a0781f8e5d29 ; Amplitude: https://amplitude.com/blog/the-hook-model.md
34. Yu-kai Chou — Octalysis Framework: https://yukaichou.com/gamification-examples/octalysis-gamification-framework/
35. Sid Meier — Interesting Decisions / one more turn (GDC notları): https://medium.com/ada-chen-rekhi/gdc10-notes-sid-meier-on-why-everything-you-know-is-wrong-53d7bc889419 ; Game Developer: https://www.gamedeveloper.com/game-platforms/just-one-more-turn---game-development-tips-and-tricks-from-the-creator-of-civilization-sid-meier-
36. GDC Vault — Breathing Life into Greek Myth: The Dialogue of Hades (2021): https://gdcvault.com/play/1026975/Breathing-Life-into-Greek-Myth ; GDC Podcast ep. 16 (Kasavin, roguelike & narrative): https://gdconf.com/news/roguelikes-and-narrative-design-hades-creative-director-greg-kasavin-gdc-podcast-ep-16
37. Alliot (Nerial) — Game Design Deep Dive: Creating an adaptive narrative in Reigns: https://gamedeveloper.com/design/game-design-deep-dive-creating-an-adaptive-narrative-in-i-reigns-i- ; GDC Vault — The Casual (but Regal) Swipe: https://gdcvault.com/play/1024278/The-Casual-(but-Regal)-Swipe ; GamesRadar — 2M oyuncu: https://gamesradar.com/how-reigns-convinced-two-million-people-to-swipe-right-to-rule-their-kingdom-and-captured-the-game-of-thrones-license
38. Kreminski & Wardrip-Fruin (2018) — Sketching a Map of the Storylets Design Space: https://mkremins.github.io/publications/Storylets_SketchingAMap.pdf ; Emily Short — storylets: https://emshort.blog/tag/storylets/ ; Fallen London wiki — Storylets/Actions: https://fallenlondon.wiki/wiki/Storylets
39. Mobile Free To Play — Eliminating Energy: https://mobilefreetoplay.com/eliminating-energy/
40. BitLife ribbon listeleri: https://www.droidgamers.com/guides/bitlife-ribbons-guide-a-list-of-all-30-ribbons-and-how-to-get-them/ ; https://gamerant.com/bitlife-ribbons-list-how-to-get-all-ribbons/
41. arXiv 2504.10714 — Playing to Pay: Monetization & Retention in Korean Mobile Gaming (login ödülü %95): https://arxiv.org/pdf/2504.10714
42. MobiLoud — Push notification statistics 2026 (Airship opt-in medyanları, +1/3 retention): https://www.mobiloud.com/blog/push-notification-statistics/ ; Pushwoosh opt-in: https://www.pushwoosh.com/blog/increase-push-notifications-opt-in/
43. Sensor Tower — Top 5 Interactive Story Games US Q1 2025: https://sensortower.com/blog/2025-q1-unified-top-5-interactive%20story%20games-revenue-us-6019ed6a241bc16eb869f511
44. Duolingo Blog — How we protect learner streaks from site issues: https://blog.duolingo.com/protecting-streaks-from-site-issues/
45. Android Authority — 6 reasons to give up a 550+ day Duolingo streak (streak baskısı): https://www.androidauthority.com/reasons-give-up-duolingo-streak-3543009/
