# App Store Teardown — Küme A: BitLife Ailesi (BitLife · DogLife · CatLife · InstLife)

**Tarih:** 2026-11-07 · **Amaç:** Motto (docs/design/00-VIZYON-ve-KARARLAR.md §0, §4, §12) için "neyi alalım, neyi uyarlayalım, neyi almayalım" kararı. · **Yöntem:** Web araması (extended), mağaza sayfası özetleri (apps.apple.com US/TR, play.google.com), BitLife Fandom wiki, bitlifeapp.com "What's New", Zendesk destek sayfaları, Stillfront raporları, oyun rehber siteleri (ProGameGuides, Level Winner, Pocket Gamer, Destructoid, Prima, GameSkinny), Metacritic/GameFAQs/Common Sense Media/AppleVis kullanıcı yorumları, @BitLifeApp X gönderileri. Bu oturumda apps.apple.com, play.google.com, fandom.com ve bitlifeapp.com doğrudan **fetch edilemedi** (ağ izni yok); bütün veriler arama motoru özetlerinden alındı, bu yüzden tarihli snapshot'lar birbirinden farklı sayılar verebiliyor. Çelişen yerleri işaretledim.

**Kaynak sayısı:** 47 ayrı URL (aşağıda "Kaynaklar" bölümünde).

---

## 0. Yönetici özeti (tek bakış)

| | BitLife | DogLife | CatLife | InstLife |
|---|---|---|---|---|
| Geliştirici | Candywriter, LLC (Miami; 2020'den beri Stillfront Group) | Candywriter | Candywriter | Instcoffee Games → hakları Candywriter aldı |
| Çıkış | 2018 (iOS Eylül 2018; Android 2019) | Ekim 2021 | Aralık 2021 | Şubat 2018 (Android); Play'den 2 Eylül 2019'da kaldırıldı |
| iOS puanı | **4,8 / 1,8 M** oy (US, 2026) | 4,6 / 62 K | 4,7 / 14 K | — (yayından kalktı) |
| Android puanı | 4,4 / ~1,3 M yorum; 62 M+ kurulum (AppBrain) | 4,6 / ~44 K (38 K AppBrain) | 4,6 / ~15 K | 4,5 / 35 K oy; 7,1 M kurulum (AppBrain, kapanış öncesi) |
| Yaş | US App Store 17+/18+; Common Sense 14+; Bark "18+" | 12+ | 16+ | — |
| Model | F2P + interstitial/rewarded reklam + ~15 kalem tek seferlik IAP | F2P + reklam + "Top Dog" 4,99 $ | F2P + reklam + "Top Cat" 4,99 $ | F2P + reklam (reklam kaldırma IAP) |
| Tur birimi | **1 yıl** (ayarla 6 ay) | 1 yıl (köpek yılı) | 1 yıl | 1 yıl |

**Dört cümlelik ders:** (1) BitLife'ın yarım milyarlık kategorisinin kalbi "Age" butonu + rastgele olay + menü-tabanlı sandbox; mizah, kaza ve ölüm, kendi kendini yazan hikâye. (2) Para sistemi "tek seferlik satın alma vitrini"dir: Bitizenship (reklamsız + perk), God Mode (düzenleme), Boss Mode (tüm meslek paketleri), ayrı Expansion Pack'ler (≈4–8 $) ve 0,99 $ Time Machine; abonelik yok. (3) Canlı operasyon = **her Cumartesi 15:00 EST haftalık Challenge** (3–5 görev, kozmetik ödül) + 2–4 haftada bir içerik güncellemesi; 2025'te denenen "Seasons/BitPass" battle pass **başarısız olup kaldırıldı** (resmî "END OF SEASONS" notu). (4) En büyük şikâyetler: reklam sıklığı (ödeme sonrası bile), "her şey ayrı paket", tekrar hissi, "çok kolay". Motto'nun fırsatı: BitLife'ın menü-sandbox'ını değil, **olay akışını + anlatıcıyı + kalıcı durumu** alıp günlük takvime oturtmak; reklamı ve paket enflasyonunu tersine çevirmek.

---

## 1. BitLife — Life Simulator (Candywriter, LLC)

### 1.1 Mağaza künyesi

- **Başlık:** "BitLife - Life Simulator" · **Alt başlık (ASO):** "Life Simulator" / mağaza metni "the original text-based life simulator". iOS id 1374403536; Android `com.candywriter.bitlife`.
- **Puan:** US App Store **4,8★ / 1,8 M** oy (2026 snapshot); bitlifeapp.com kendi sitesinde "4,7 / ~4 M yorum" diyor. Google Play **4,4★ / ~1,32 M** yorum; AppBrain 4,38 / 1.193.180 oy, 62 M toplam kurulum.
- **Sürüm:** 3.26.x (Ekim–Kasım 2026); AppstoreSpy son güncelleme 22 Ekim 2026.
- **Ölçek:** Stillfront 2020 satın alma dosyası: 2019 geliri ≈ 26 M $ ve %59 EBIT marjı, 1,2 M DAU / 7,8 M MAU, 42 M indirme. Üçüncü taraf tahminleri: 130 M+ indirme, 136 M $ IAP; Gamigion "her 70 saniyede interstitial, ≈ 90 K $/gün reklam" (tahmin). Stillfront 2025 yıl sonu raporu "key franchises" düşüşünü "Home Design Makeover ve **BitLife**'ın düşük performansı" ile açıklıyor → oyun olgun/gerileme fazında.
- **Ayrı uygulamalar:** "BitLife Español" (ayrı app, **Ekim 2026'da kapatıldı**, kayıtlar eski uygulamada kalıyor), "BitLife GO!" (id 6738096599; 16+, aynı içerik farklı fiyat; TR'de Bitizenship ₺399,99, Boss Mode ₺999,99).

### 1.2 Fiyat ve IAP listesi (US App Store 2026 snapshot · TR App Store 2026 snapshot)

| Kalem | USD | TRY | Not |
|---|---|---|---|
| Time Machine Use | 0,99 $ | ₺49,99 | Kullanım başına; ölümden sonra bile X yıl geri sar. "Unlimited Time Machine" da satıldı (eski wiki). |
| Bitizenship | 7,99 $ (listede ikinci giriş 9,99 $) | ₺349,99 → ₺399,99 | Tek seferlik; abonelik değil. Eski rehberler 4,99 $ yazıyor → fiyat yıllar içinde ~%60–100 arttı. |
| God Mode | 9,99 $ (eski: 2,99 → 8,99) | ₺349,99 → ₺399,99 | |
| Bitizenship + God Mode | 15,99 $ (eski 12,99) | ₺599,99 → ₺799,99 | Nisan 2026'dan beri varsayılan seçili paket. |
| Boss Mode | 20,99 $ (eski 11,99 → 15,99) | ₺899,99 | "Tüm mevcut ve gelecek Job Pack'ler" (Zendesk). |
| Remove Ads | 2,99 $ (eski 7,99) | TR listesinde görünmüyor | Reklamı kaldırır, perk vermez. |
| Expansion Pack'ler (Landlord, Investor, C.U.L.T., Black Market, Casino, Zoo, Secret Agent, Racing, Outdoor Lifestyle, Movie Director) | 7,99 $ (eski 4,99) | ₺299,99–₺399,99 | Boss Mode'a **dahil değil** (Investor/Landlord resmî X yanıtı). |
| Job Pack'ler (Actor, Astronaut, Athlete, Business, Mafia, Musician, Politician, Street Hustler, Model, Dealer…) | 1,99 → 4,99 → 6,99 $ (kaynağa göre) | — | Boss Mode'a dahil. Ekim 2024 itibariyle 10 paket. |
| Ultimate Fighter Mode | ≈ 9,99 $ ("10 $ marketplace pack") | — | Haziran 2026. |
| Challenge Vault | 4,99 $ | — | Eski haftalık challenge'ları yeniden oynatır. |
| Seasons / BitPass | (2025) | — | **Kaldırıldı** (bkz. 1.8). |

**Gözlem:** Toplam "her şeyi al" sepeti US'de ≈ 100 $+. Yorumlarda bu doğrudan görünüyor: *"there's 40 other payments needed to access any and every game feature."* TR'de ₺899,99'luk Boss Mode, Steam'deki tam oyunlardan pahalı; TR fiyatlandırması USD paritesine yakın tutulmuş (yerel indirim yok).

### 1.3 Core loop ve oturum

- **Tur birimi:** "Age" butonu = +1 yıl (ayarlardan +6 ay). Her basışta: günlük/yıllık **journal** satırı ("I joined a secret profanity club for kids in my neighborhood."), 0–3 rastgele olay pop-up'ı (4 seçenekli), stat çubukları (Happiness, Health, Smarts, Looks; gizli: Karma, Craziness, Willpower, Discipline, Athleticism, Fertility) değişir. Sonra oyuncu menülerde istediği kadar gezer (serbest sandbox), sonra tekrar Age.
- **Oturum görünümü:** Bir hayat (0 → ~80–120 yaş) 15–40 dk; "bir yıl daha" dürtüsü çok güçlü çünkü yıl ≈ 10–20 sn. Oturumlar reklam kesmeleriyle bölünür (bkz. 1.7).
- **Hayat bitince:** Mezar taşı/obituary ekranı (ribbon, ad, yaş, net değer, ülke/şehir, kariyer, eğitim, çocuk/torun sayısı, ölüm nedeni, cenazeye katılanlar) → **Journal / Bulldoze / Share / Continue**. "Continue" = çocuğundan devam (Generations; Bitizen değilse 2 nesil sınırı) veya yeni rastgele hayat.
- **Dopamin kancaları:** Olay pop-up'ı (değişken ödül), stat çubuğu animasyonu, ribbon (hayat sonu etiketi), achievement (63 → 100+), haftalık challenge, yeni meslek/paket vitrinleri.

### 1.4 Onboarding (ilk 60 sn)

1. Logo → ana menü: **New Life** (Random / Custom). Custom: ad, soyad, cinsiyet, ülke, şehir (ve God Mode'la görünüm/stat; doğum yılı sorusu bazı sürümlerde).
2. "Doğum" ekranı: anne-baba adları ve meslekleri, doğum tarihi, burç, "nasıl doğdun" satırı (ör. "conceived in the back of a car"), kardeşler, ev hayvanı. **İlk kahkaha burada** (doğum cümlesi).
3. Stat çubukları doğar (mutluluk/sağlık genelde yüksek). Hemen Age'e basılır; 0–5 yaş olayları kısa (çocuk olayları: oyuncak paylaşmak, köpek ısırığı…).
4. Tutorial yok; menüler kendini açıklar; ilk reklam birkaç yaş sonra gelir; God Mode/Bitizen satış ekranı Custom Life'ta ve ilk ölümde görünür.
5. 5–6 yaşta **okul** sekmesi açılır (Grades/Popularity).

**Motto'ya ders:** BitLife'ın ilk 60 saniyesi "kimlik + doğum şakası + hızlı yaş alma"dır; Motto'nun §4.2 senaryosu (18 yaş, koç, Müşteri Dosyası) aynı hızı hedefliyor ama **18'den** başlar: 0–17 yaşın "boş yıllar" sorununu baştan çözüyor (BitLife'ta çocukluk hızlı geçilir, oyuncular sıkıcı bulur).

### 1.5 TAM özellik envanteri (sekme sekme)

**Üst/orta ekran:** İsim, yaş, ülke bayrağı, meslek, para (net değer); Dark Mode (Bitizen). Alt bar: **Occupation · Assets · [AGE] · Relationships · Activities** (ortada yeşil "Age" butonu). Sol üst hamburger: New Life, Cemetery (geçmiş karakterler), Achievements, Ribbons, Challenges, Marketplace, Settings, My Stuff.

**Occupation (Meslek):**
- Full-Time Jobs listesi (ülkeye göre; "Brain Surgeon" gibi bazıları ancak mezuniyet sonrası çıkar), Part-Time Jobs (16+), **Freelance Gigs** (babysitter, dog walker, handyman; saatlik, çoklu), Special Careers (Job Pack'ler: Actor, Astronaut, Athlete, Business, Mafia, Musician, Politician, Street Hustler, Model, Dealer; 2025'te 5 ücretsiz yeni kariyer merdiveni eklendi: DJ, music composer, influencer vb.), **Military** (18–62; subay için üniversite), Education (Primary/Secondary, Community College ücretsiz, University 4 yıl: burs/ebeveyn/kredi/nakit; Graduate/Law/Medical/Business school; majors).
- İş içi: job interview (seçenekli), performance çubuğu, work harder, promotion iste, raise iste, coworker etkileşimleri (compliment/insult/flirt/prank), supervisor, quit/retire, strike/union (bazı sürümler), military deployment mini oyunu (mayın tarlası).
- **Astronaut:** STEM + pilot lisansı → Space Academy 2 yıl (fitness/flight/technical) → görevler (Research Experiment, Spacewalk, Lunar, Mars) → rütbe (Major/Captain → General); ölüm riski; artifact toplama.
- **Mafia:** Önce suç geçmişi (2–3 suç/yıl) → 18'de Special Careers → aileler (Irish Mob, Latin Mafia, Mafia, Russian, Triad, Yakuza) → associate → soldier → capo → underboss → godfather; aileye para "katkı", extortion, whack, rat olma riski.
- **Street Hustler:** 4 "hustle" (Busker, Panhandler, Scam Artist, Street Performer); Scam Artist'te 12+ dolandırıcılık, beginner→intermediate→advanced; sokak seçimi (polis yoğunluğu); Street Smarts ≥ 80 → advanced; yakalanma → Street Smarts düşer.
- **Business:** Ürün tasarla (fixed cost/marketing/price/production slider'ları), tedarikçi kalite-fiyat, AI rakipler, Expand (yeni şube), çalışanlar.
- **Royalty** (ücretsiz, monarşili ülkelerde doğumla/evlilikle): Activities > Royalty: abdicate, celebrity meetups, **execute**, honorifics, law review, cause chaos, royal duties; Respect çubuğu.
- **Movie Director (Eyl 2026 expansion):** 11 tür, seçmeler, ödüller/festivaller.
- **Ultimate Fighter Mode (Haz 2026):** Street fights vs League fights, Street Creds para birimi, 200+ hamle (Skill Shop), stamina, counters, koç, sakatlık, rakip/rivalry, Fight Club bildirimleri; Temmuz 2026 yaması: yenilgide Cred kaybı kaldırıldı, lig menüsüne zorluk çubukları, uyuşturucu testi "wiliness" stat'ına bağlandı.

**Assets (Varlıklar):**
- Real Estate (ev/daire/villa/ada; kira ver → Landlord pack), Cars (ehliyet şart), Planes, Boats, Jewelry (yıllık değer kaybı), Instruments, Pets, Heirlooms (satın alınmaz; çatı arası el feneri mini oyunu), **Finances** (bank/loans; Investor pack: hisse, mutual fund, **crypto**, gayrimenkul yatırımı), Horse Races, Lottery, Businesses (Business pack), Zoo (100+ hayvan; expansion), Luxury (private island, lüks araçlar).

**Relationships (İlişkiler):**
- Kategoriler: Parents, Siblings, Lovers/Spouse, Exes, Children, Grandchildren, Friends, Enemies, Classmates, Coworkers, Pets, Royal family, Mafia family.
- Etkileşimler: Spend time, Compliment, Insult, Gift, Movie theater, Conversation, Concert, Party, Watch YouTube, Argue, Fight (dövüş mini oyunu), Flirt, Hook up, Propose, Honeymoon, Prenup, Divorce, Affair/cheat, Booty call (Exes), Threesome, Ask for money, Abandon, Disown, Put in nursing home, Hire hitman (Bitizen), Lawsuit, Custody.
- İlişki çubuğu + "crazy"/"smarts"/"looks" NPC statları; NPC'ler iş değiştirir, hastalanır, ölür; miras/will.
- Okul: Grades, Popularity, Clubs (captain olmak), Cliques (popülerlik şartı), teacher etkileşimi (suck up / act out), cheating, bullying ("Mess with").

**Activities (Etkinlikler):** Adoption, Accessories (challenge ödülleri), Black Market (pack), Casino (blackjack; pack), Crime (Bank robbery 16+, Burglary 11+ Pac-Man mini oyunu, Grand theft auto 15+, Murder 15+, Pickpocket, Porch piracy, Shoplifting, Train robbery, Extortion, Arson 2025), Cult (C.U.L.T. pack), Diet, Doctor (hastalık tedavisi; witch doctor/alternative medicine düşük başarı), Driving/Boating/Pilot/Fishing/Hunting License, Emigration (dev hayvanla engellenir), Fame (sosyal medya, kitap, reklam, talk show), Fertility (IVF, sperm bankası), Gambling, Identity (isim/cinsiyet değişimi, ücretli), Lawsuit, Lottery, Mind & Body (gym, meditation, library, **reading books, diet, gardening, martial arts, walks**), Movie Theater, Nightlife (bar, club), Plastic Surgery, Rehab, Salon & Spa, Secret Agent (pack), Social Media (takipçi, paylaşım, troll), Vacation, Will/Testament, Senior Centers (2025), Outdoors (camp, fish, hike, snorkel, spelunk, ATV, dirt bike; Outdoor Lifestyle pack), Royalty, Prison (içeride: appeal, escape mini oyunu, riot mini oyunu (Snake), gang (Bitizen), prison job, work out, look for trouble).

**Sağlık/Hastalık:** Kategoriler: viral/bakteriyel (flu, pneumonia, staph, food poisoning — öldürmez), STD'ler (HIV tek ölümcül), duygusal (depresyon, şizofreni), fiziksel (ulcer, cirrhosis), ölümcül (kanserler 1–3 yıl, yellow fever, bubonic plague, Alzheimer, whooping cough), "odd" ailments; bağımlılıklar (alkol/uyuşturucu/kumar → rehab); overdose, kalp krizi/felç (aşırı çalışma, "hayalet"), kaza, cinayet, idam, uzay görevi. Düşük Health → komplikasyonla ölüm olasılığı artar.

**Suç/Hapis:** Suç başarısı = Smarts + şans; cezalar (ilk banka soygunu ≈ 11 yıl); hapiste yıl/yıl; **Felony Escape mini oyunu:** ızgara labirent, gardiyan oyuncunun her hamlesinde 2 hamle yapar, önce yatay yaklaşır → gardiyanı duvara sıkıştır; küçük suç = küçük hapishane; 23 layout (Pocket Gamer); başarısız kaçış = ek yıl; **"watch an ad for a guard's uniform"** ile 1 kez/hayat mini oyunu atla (rewarded ad). Houdini ribbon = 10 kaçış.

**Evcil hayvan:** Shelter (ücretsiz oyuncu, max 4 hayvan, iade edersen bir daha alamazsın), breeder/pet store/exotic dealer (Bitizen; exotic dealer yılda 1 tür), horse/llama 18+; aylık masraf; büyük/deli hayvan küçüğü öldürebilir; saldırgan egzotik → bir daha adopt yok, dev egzotik → göç yok.

**Ribbon'lar (~40):** Academic, Addict, Cat Lady, Deadly, Famous, Fertile, Generous, Geriatric (100–120 yaş), Gold Digger, Hero, Houdini, Jailbird, Lazy, Loaded, Lustful, Mediocre, Model Citizen, Movie Buff, Rich, Scandalous, Stupid, Successful, Thief, Unlucky, Veteran, Wasteful, Wicked, Teammate (Candywriter'da çalış), vb. **Tek hayat = tek ribbon** (en baskın kalıp) ve mezar taşında görünür.

**Achievements (63 → 100+):** Yaş (80/90/100/110/120), servet (Millionaire → Stinking Rich → Bitionaire 1 Mr$), fame, crime, love, business, black market, cult; "BitLife Legend" = hepsi.

**Challenges (haftalık):** Her **Cumartesi 15:00 EST** yeni challenge; 3–5 görev (ör. "Master of the Elements": Nepal'de erkek doğ, jet ski al, uçak uçur, construction worker ol, firefighter ol, best friend'inle evlen); ödül: rastgele kozmetik (şapka/kıyafet/tema; "Superstar" → altın tema); "Fancypants" achievement = aksesuar tak; Challenge Vault (4,99 $) ile eski challenge'lar; görevler çoğu zaman **paketli içeriğe** bağlanır (Hollywood Hustler: Hustler + Actor pack gerekir → cross-sell).

**Legacy/Nesil:** Continue as child (Generations, Mart 2019); Bitizen değilse 2 nesil; Cemetery; family tree görünümü (eksik olabiliyor); Heirlooms nesilden nesile.

**Paylaşım:** Ölüm ekranında "Share" (mezar taşı görüntüsü) ve Journal; sosyal paylaşım TikTok/YouTube'da organik (challenge walkthrough'ları, "profanity club" tarzı journal satırları).

**Özelleştirme:** God Mode (ad, görünüm, statlar, gizli statlar, ebeveyn/kardeş/çocuk/classmate/coworker düzenleme; ilişki statı düzenlenemez; görünüm 21–44 yaş arası görünür), Accessories (challenge ödülleri), Dark Mode (Bitizen), Identity (isim/cinsiyet; ücretli oyun içi para).

### 1.6 UI / sanat tarzı

Metin + emoji + düz renkli kart UI. Koyu arka plan, mavi/yeşil butonlar, yuvarlatılmış modal pencereler, stat çubukları (yeşil/sarı/kırmızı), karakter avatarı yok (sadece yüz emojisi/ikon; Bitizen görünüm seçenekleri). Her ekran bir liste; olaylar modal. Ses minimal. Tipografi sistem fontu. Erişilebilirlik: VoiceOver kısmen; AppleVis: *"the modal windows are improperly coded in BitLife makes the UI seem extremely clunky and hard to navigate."* Sürekli ikon değişimi: mevsimlik app icon (Cadılar Bayramı, Pride).

### 1.7 Monetizasyon yerleşimleri (reklam türleri)

- **Interstitial:** Age sonrası ve menü geçişlerinde; Gamigion ölçümü ≈ her 70 sn; yorumlar "her 2 dk", "her 5 dk unskippable".
- **Rewarded video:** Olay seçeneklerinde "watch an ad to unlock this choice" (ücretsiz oyuncuda 3. seçenek kilitli), guard uniform (hapis), para/boost, "Mafia pack free with ad", relative interactions (Bitizen değilse bazı etkileşimler reklamlı), movie theater.
- **Satış ekranları:** Custom Life → God Mode; ölüm → Time Machine 0,99 $; Special Careers → Job Pack vitrin; Marketplace sekmesi; mevsimlik bundle'lar ("Villain Era", "Blinged-Out Birthday", "Billionaire's Bundle", "Crime Pays Bundle").
- **Dikkat:** Birden fazla yorum "Remove Ads/Bitizen aldım, güncellemede reklam geri geldi" diyor → güven kırılması.

### 1.8 Canlı operasyon ve güncelleme kadansı (2024–2026)

- **Kadans:** Fan wiki "2 hafta–1 ayda bir büyük güncelleme"; haftalık challenge 2020'den beri aralıksız; mevsimlik etkinlik (Halloween Scavenger Hunt, plastic vampire teeth, Pride, Birthday).
- **2024:** v3.13.x (Ağu) Luxury Lifestyle; v3.14.2 (6 Haz) **Zoo Expansion** (100+ hayvan); Business/Political pack iddiaları (doğrulanamadı); Ekim 2024 itibariyle 10 Job Pack.
- **2025:** v3.19 **Outdoor Lifestyle Pack**; Temmuz 2025 **5 ücretsiz kariyer merdiveni** (resmî X); v3.20.6 (19 Eyl) "Villain Era" + "Blinged-Out Birthday" bundle; v3.22.2 **Seasons** (günlük görevler, Community Goals, BitPass, Special Lives, "Bits" para birimi; Arson ve Senior Centers Season'la açıldı); 30 Eki 2025 resmî not: "Pride Season son sezon, özellik kaldırılıyor; BitPass alanlara My Stuff'ta hediye" + X'te "herkese 100 K Bits".
- **2026:** 11 Haz **Ultimate Fighter Mode**; Temmuz UFM dengeleme + Vault'a yeni challenge'lar; Ağu erişilebilirlik düzeltmeleri; 14 Ağu "END OF SEASONS" yazısı; 31 Ağu/10 Eyl **Movie Director Expansion Pack** (Legacy Bitizen'lere açılma sorunu düzeltildi); Ekim "Español kapanıyor", v3.26.0 (25 Eki), v3.26.1 (5 Kas: Astronaut ile ünlü olma, Marketplace'e "Hollywood Star" item).
- **Model değişimi gözlemi:** Job Pack (Boss Mode'a dahil) → Expansion Pack (ayrı ücret) kaymasına oyuncu tepkisi: *"paid for boss mode to get all future job packs… relabeled as an expansion pack so people would pay more."*

### 1.9 Yorumlar — övgü (alıntı)

1. *"a lot of options for what to do and various outcomes"* (App Store)
2. *"you can play for several hours and you won't even notice how they fly by"* (Metacritic)
3. *"with constant updates, it has become so much better with so much more variety"* (Metacritic)
4. *"Best Simulator out there"* (App Store)
5. *"quite addictive and fun to play"* (App Store, 2020)
6. *"definitely worth the $4, since the paid version removes ads and lets you continue a family tree"* (App Store)
7. *"the game has a few more cash-grabs, but it is free and that makes up for it"* (Metacritic)
8. Oyuncu 5+ yıldır telefonunda tutuyor ve "geliştiricilerin güncellemelerini" övüyor (App Store, 2024)
9. *"fun though and doesn't talk about anything more than most 14 year olds already know about"* (Common Sense ebeveyn)
10. Common Sense özeti: *"fun and engaging for teens"*

### 1.10 Yorumlar — şikâyet (alıntı)

11. *"the amount of ads make it unenjoyable"* (Google Play, 2025)
12. *"there's 40 other payments needed to access any and every game feature"* (App Store)
13. *"ads show up on nearly every action"* (App Store, Kas 2023)
14. *"getting ads every two minutes"* · 15. *"unskippable ads popping up every five minutes"*
16. *"there are a lot of ads, even when you turn your wifi off"* (Metacritic)
17. *"For me at least, when I watch an ad to get a choice or path, it will give me another immediately after giving me the reward. I age, go to do something else more in depth and boom another ad."* (Google Play)
18. *"You want to buy someone a gift? 40 second ad."* (Google Play)
19. *"I paid the one-time payment so I wouldn't have to deal with ads in the game, then suddenly with the new update, it's not counting it anymore."* (Google Play)
20. Bitizen'e ≈ 5,50 € ödedikten sonra reklamlar geri geldi — *"waste of money"* (App Store)
21. *"after reinstalling, their purchases said they were restored, but none of them were"* (App Store)
22. *"unplayable due to the excessive amount of ads"* (App Store)
23. *"the ads made my rating 2 stars down"* (App Store, 2025)
24. *"the game gets kinda repetitive once you account for the paid DLC"* (Metacritic)
25. *"grows quite repetitive and tiresome rather quickly"* … *"painfully easy to 'beat'"* (GameFAQs, Oca 2026)
26. *"it's seemingly unlimited, making it very easy to manage stuff and really diminishes the strategic nature of this game"* (GameFAQs, 2026)
27. *"You can pay a dollar to undo death or go back years for one life"* (Metacritic)
28. *"everything costs money"* (App Store, 2024) · 29. *"the DLC packs are the only downside"* (App Store)
30. *"the modal windows are improperly coded… extremely clunky and hard to navigate"* (AppleVis, VoiceOver)
31. "premium pass leveling bug" (App Store, Seasons dönemi)
32. *"not what I want as part of my 15 year old's reality at all"* (Common Sense ebeveyn)
33. Boss Mode → Expansion Pack yeniden etiketleme şikâyeti (X yanıtı, Eyl 2026)
34. Oyuncu "oynanabilir Filistin" istiyor (App Store) → ülke listesi/temsil talepleri sık.

### 1.11 KOPYA kararları — BitLife (özellik → Al / Uyarla / Alma → Motto eşlemesi)

| Özellik | Karar | Motto eşlemesi / gerekçe |
|---|---|---|
| "Age" tek büyük buton + yıl ≈ 10–20 sn | **Uyarla** | D-061/D-066: zaman **gün** birimiyle kendi kendine akar; "bir yıl daha" dürtüsü, doğum günü = Yıl Sonu Karnesi'ne taşınır. BitLife'ın en güçlü kancası (tek dokunuş → sürpriz) Motto'da "karar ver → zaman akar → sürpriz" olarak kalır. |
| Doğum/kimlik ekranındaki ilk şaka | **Al** | §4.2'deki "Deniz Ertelemez. Soyadın bir vaat." zaten bu kalıp. |
| Rastgele olay pop-up'ı (4 seçenek) | **Uyarla** | Motto'da olay = tarihli gün kartı + NPC diyalog balonları (D-062); seçenek sayısı 2–4; her seçeneğe görünmez `pattern` etiketi. BitLife'ın "sonuç tek satır" formatı yerine kalıcı durum değişimi (D-067). |
| Journal (yıllık günlük satırları) | **Al** | Koçun Defteri zaten var; BitLife'ın journal'ı salt metin; Motto'da iddia/damga/karne ile zenginleşir. Ölümde "Journal'ı oku" = Roast Raporu'nun uzun hâli. |
| Stat çubukları (4 görünür + gizli) | **Uyarla** | Motto 4 stat (Sağlık/Keyif/Kafa/Çekicilik) + Karne notları. Gizli statlar (Karma, Willpower) yerine **kalıp sayaçları**. |
| Ribbon (hayat sonu tek etiket) | **Al** (zaten D-065) | = Teşhis. Mezar taşında görünmesi + koleksiyon ekranı birebir alınır. |
| Achievements (100+) | **Uyarla** | Motto'da "HAKSIZ ÇIKTIM" damga koleksiyonu + Teşhis koleksiyonu; sayı 40–60 ile sınırlı tut, "Legend = hepsi" meta-başarımı al. |
| Haftalık Challenge (Cumartesi 15:00, 3–5 görev, kozmetik ödül) | **Uyarla** | = Antrenman Kampı (Pazartesi 00:00, hash'li, 40 hayali kohort). BitLife'tan alınacak: **sabit gün/saat ritüeli**, görevlerin bir "tema cümlesi" taşıması, ödülün kozmetik + koleksiyon olması. Alınmayacak: görevlerin ücretli paketlere bağlanması (cross-sell). |
| Challenge Vault (ücretli eski challenge) | **Alma** | Ücretli geçmiş içerik = kötü his; Motto'da geçmiş kamplar ücretsiz "arşiv" olarak kalır. |
| Mezar taşı + Share | **Al** | Roast Raporu paylaşım kartı; BitLife'ın "net değer/çocuk sayısı/ölüm nedeni" istatistik satırlarını "kalıp sayıları" ile birleştir. |
| Cemetery (geçmiş karakterler) | **Al** | "KAPANDI defterler" ekranı. |
| Generations (çocuktan devam) | **Uyarla** | Motto'da nesil değil **Tanıdık Yüzler + Fazla Bagaj**; ama "eski hayatın mirası yeni hayata nesne olarak geçer" (Heirlooms) fikri alınır: bir önceki hayattan 1 eşya/NPC hatırası. 2 nesil paywall'ı **alınmaz**. |
| Relationships menüsü (10+ etkileşim/NPC) | **Uyarla** | Motto'da NPC'ler olay akışında konuşur; menüden "spend time/gift" spam'i yok. Ama **ilişki durumu çubuğu** ve "NPC'nin kendi hayatı var (iş değiştirir, hastalanır, ölür)" alınır (D-067 Durum şeridi: İlişki alanı). |
| Occupation listesi + interview + promotion | **Uyarla** | Motto'da iş = unvan + maaş akışı; terfi/işten çıkarma olay kartı olarak; iş listesi 10–15 meslek, "100 meslek" sandbox'ı yok. Freelance gig fikri (küçük ek gelir, günlük satır) **alınır**. |
| Assets (ev/araba/mücevher/hayvan) | **Uyarla** | Durum şeridi "Varlıklar"; sayı sınırlı (telefon, bisiklet/araba, ev, kedi). Mücevher/uçak/yat/ada **alınmaz** (sandbox şişkinliği). |
| Evcil hayvan (aylık gider, ölüm, iade cezası) | **Al** | Pamuk/Biscuit zaten Tanıdık Yüz; "aylık yer" (D-067) ve hayvan ölümü olay kartı. |
| Okul sistemi (Grades/Popularity/Clubs) | **Alma** | Motto 18'de başlıyor; üniversite "bir bölüme gir" hedefi olarak kalır, günlük okul mikro-yönetimi yok. |
| Crime menüsü + Prison + Escape mini oyunu | **Uyarla (dar)** | Motto 16+ ve "sıfır hukuki risk": küçük suç/absürt bürokrasi olayları olur (vergi, kaçak yolculuk cezası), cinayet/mafya **alınmaz**. **Mini oyun fikri** (gardiyan 2 hamle kuralı gibi tek kurallı, 20 sn) → göz teması mini oyunu (D-063) benzeri 2–3 mikro oyun. |
| Hastalık sistemi (kategori + komplikasyon × düşük Health) | **Uyarla** | 02 dokümanı Gompertz hazard; hastalık adları gerçek ama sayısı az; "flu öldürmez, kanser 1–3 yıl" tasarım sadeliği alınır. Witch doctor/plastik cerrahi **alınmaz**. |
| Fame/Social Media | **Uyarla** | "Sosyal medya takipçisi" tek bir Varlık satırı + olaylar; ayrı sekme yok. |
| God Mode (düzenleme IAP) | **Alma** | Motto'da kimlik "Karıştır/Bu olsun" ücretsiz; stat düzenleme oyunun iddia mekaniğini bozar. (Kozmetik: koç kişiliği/tema satılabilir, bkz. §8 monetizasyon.) |
| Time Machine (0,99 $ ölümü geri al) | **Alma** | Ölüm → 40 sn'de yeni hayat Motto'nun imzası; "ölümü satın al" en çok şikâyet edilen kalem (*"pay a dollar to undo death"*). Yalnızca **ücretsiz "Sakatlık İzni"** (streak) var. |
| Bitizenship (reklamsız + perk) | **Uyarla** | Tek seferlik "Koç Lisansı": reklam yok + Torpil (ikinci koç kişiliği) + Dark/tema. **Perk'leri oynanışa kilitleme** (2 nesil, 4 hayvan, gang) **alınmaz**; satın alma sonrası reklam geri gelmesi = asla. |
| Boss Mode / Job Pack / Expansion vitrini | **Alma** | 15 kalemlik vitrin = "40 other payments" şikâyeti. Motto en fazla 3 kalem: Reklamsız/Lisans, Koç Kişiliği paketi, Destek bahşişi. |
| Rewarded ad ile 3. seçenek kilidi | **Alma** | Olay seçeneğini reklama kilitlemek karar bütünlüğünü bozar (yorum 17). Rewarded yalnızca "Telafi"/kozmetik için ve asla kararın içinde değil. |
| Interstitial her Age'de | **Alma** | Motto: oturumda tek interstitial (Devre Arası, 25. dk), ölüm anında **asla** (00 dokümanı kararı). |
| Seasons/BitPass (battle pass) | **Alma** | BitLife'ın kendisi kaldırdı: *"heard player frustration… feature is being removed."* Kanıt: olay-tabanlı tek oyunculu sim'de battle pass tutmuyor. Antrenman Kampı ücretsiz kalır. |
| Royalty / Execute / Mafia fantezileri | **Alma** | 16+ ve T9 kırmızı çizgiler; ayrıca gerçek monarşiler = gerçek kişi riski. |
| Ücretsiz "5 kariyer merdiveni" tarzı ücretsiz içerik damlası | **Al** | Aylık ücretsiz olay paketi duyurusu (mağaza "What's New" + X). |
| Mevsimlik app icon + tema | **Al** | Ucuz, görünür canlılık sinyali. |
| Ülke/şehir seçimi (bayrak, yerel meslek) | **Uyarla** | TR/EN iki locale; şehir = Kadıköy/Cleveland gibi renk; 100 ülke yok. |
| Ölümü anlamlı kılan istatistik (cenazeye katılan sayısı) | **Al** | Roast Raporu'na "cenazene kaç kişi geldi" satırı. Çok güçlü, ucuz, paylaşılabilir. |

---

## 2. DogLife — BitLife Dogs (Candywriter)

### 2.1 Künye
- **Başlık:** "BitLife Dogs - DogLife" (eski: "DogLife: BitLife Dogs"); iOS id 1589129140; Android `com.candywriter.doglife`; 12+.
- **Puan:** iOS **4,6★ / 62 K**; Google Play 4,6★ / ~44 K (AppBrain 4,55 / 38 K). Çıkış Ekim 2021; son sürüm 1.8.5/1.8.6 (Tem 2026 "bug fixes") → **içerik güncellemesi fiilen durmuş**.
- **Fiyat:** F2P + reklam; **Top Dog 4,99 $** (Dog/Cat lover, breed/görünüm/stat özelleştirme, insanları ve hayvanları düzenle, kayıp hayvanı bul, Dark Mode, reklamsız) = Bitizen + God Mode'un tek pakette ucuz hâli; Time Machine 0,99 $; Remove Ads ayrı.

### 2.2 Core loop ve envanter
- Köpek doğar (ev köpeği / barınak "mutt" / pet store safkan / sokak köpeği — 4 habitat), **Age** = +1 yıl; statlar Happiness, Health, **Cuteness, Respect** (+ Strength 1.4'te).
- **Scent Database:** Kokladığın her canlı veritabanına girer (koleksiyon mekaniği).
- **Dominance Hierarchy:** Her mekânın (sokak/pet store/barınak/ev) sıralaması Respect'e göre; Alpha/Omega Male/Female unvanları; saldırı (Bite/Chomp/Scratch/Maul), hiss/bark/snarl, işeme = baskınlık; barınakta kavga → **ötanazi**, evde kavga → sokağa atılma/barınak.
- Sahip etkileşimleri (itaat, "submissive pose", oyun, kaçma), çiftleşme → yavrular ("not all attempts successful"), **Kennel: yavruları arkadaşlarına gönder** (sosyal özellik), achievements + ribbons, "HUNDREDS of scenarios", dozens of breeds.
- Onboarding: BitLife'la aynı: habitat seçimi → doğum satırı → Age.
- Monetizasyon: interstitial + rewarded + Top Dog vitrini (breed seçimi paywall).

### 2.3 Yorumlar
- Övgü: *"The best way to describe this game is Bit life but from the perspective of a dog."* · *"a unique way to see life from a dog's perspective"* · "I love this game" (Sep 2025, breed önerileriyle).
- Şikâyet: *"underwhelming simulation title… isn't very engaging, with repetitive gameplay"* (Hardcore Droid) · *"there's not a lot to do in this game for the animals"* · *"have to pay to choose your dog breed with real money or like a membership"* · *"the shelter and pet store don't have much of a difference"* · *"doesn't have the feeling of building up a story the way BitLife does"* · "submissive pose" içeriğinden rahatsızlık · *"unlike bitlife, doglife is completely unusable with VoiceOver"* (2021).

### 2.4 KOPYA
| Özellik | Karar | Motto |
|---|---|---|
| Scent Database (koklama koleksiyonu) | **Uyarla** | "Tanışıklık 0–5" + Tanıdık Yüzler kartoteği: karşılaştığın NPC'ler koleksiyon olur. |
| Mekân başına hiyerarşi (Respect) | **Alma** | Motto'da sosyal statü = Karne "İlişkiler" notu; ayrı rütbe sistemi şişkinlik. |
| Habitat seçimi (ev/barınak/sokak) | **Uyarla** | Başlangıç "Müşteri Dosyası" varyantı: anne evi / yurt / kiralık oda — kalıcı durum farkı yaratır (D-067). |
| Kennel: yavruyu arkadaşa gönder | **Uyarla (düşük öncelik)** | "Kondisyon"u arkadaşa hediye kodu (KMP-XXXX mantığı); backend yok → deep link ile. |
| Top Dog tek paket (reklamsız + özelleştirme) | **Al (fiyat kalıbı)** | Tek kalem 4,99 $ eşiği = "Koç Lisansı"nın fiyat çıpası. |
| Spin-off'ta içeriğin durması | **Ders** | Aynı motoru yeni kabukla satmak 2–3 yılda ölüyor; Motto tek ürün + locale derinliği. |

---

## 3. CatLife — BitLife Cats (Candywriter)

### 3.1 Künye
- "BitLife Cats - CatLife"; iOS id 1598978868; Android `com.candywriter.catlife`; **16+** (US); çıkış Aralık 2021; son sürüm 1.8.5 (2 Ara 2024).
- Puan: iOS **4,7★ / 14 K** (UK 4,6 / 1,9 K); Google Play 4,6★ / ~15 K.
- Fiyat: F2P + reklam; **Top Cat 4,99 $ / £4,99** (MD mağazası 5,99 $); Time Machine 0,99 $.

### 3.2 Envanter
Kitten → alley cat / companion cat / wild; statlar DogLife'la aynı (+ hunting); avlanma, kaçış, kavga (zor), sahip ilişkileri, achievements + ribbons; "Top Cat = CatLife'ın God Mode'u". Fiilen DogLife reskin'i.

### 3.3 Yorumlar
- Övgü: "fun and cute", "engaging".
- Şikâyet: *"the game itself is not bad, but it is too similar to doglife"* · *"Too many ads, everything is way too expensive"* · "fighting is very hard" · büyük kediler (aslan vb.) isteği · *"bought top cat, but then accidentally deleted the app"* (restore sorunu) · "lack of options compared with BitLife".

### 3.4 KOPYA
- **Ders (Alma):** Reskin spin-off = "too similar" yorumu + 15 K oyla tavan. Motto'nun "Torpil" ikinci koç kişiliği bu tuzağa düşmemeli: yeni kabuk değil, **aynı hayatta farklı ses** (olay içeriği aynı, yorum katmanı farklı).
- **Al:** Hayvan yaşam döngüsünün BitLife'tan kısa olması (15–20 yıl) → oyuncular "kısa hayat = daha çok yeniden başlama" seviyor; Motto'nun 55–75 dk ömrü için "Kedi Hayatı" tarzı **kısa mod** (10 dk, hayvanın gözünden) ileride etkinlik olarak düşünülebilir — ama ilk sürümde değil.

---

## 4. InstLife (Instcoffee Games → Candywriter)

### 4.1 Künye
- Android, Google Play'de Şubat 2018 – 2 Eylül 2019; iOS sürümü de vardı (apkpure iOS listesi `com.instcoffee.instlife`). AppBrain: **7,1 M kurulum, 4,5★ / 35.218 oy**; geliştirici "Candywriter Holdings" olarak güncellenmiş → fan wiki: *"Candywriter has purchased the rights to InstLife and incorporated it within BitLife."* Softonic "Instcoffee Games / Ketchapp" yazıyor (doğrulanamadı).
- HubPages 2017 rehberi: "text-based adult Sims"; Newsweek 2018: InstLife *"an older game… more robust than BitLife"* (BitLife çıkışında). AppleVis forumu: *"Everyone is trying to argue that bitlife is a copy of instlife or the other way around… they're not really the same."*

### 4.2 Envanter
- Baby → Age-up; 12 yaş altı seçenek yok; her yaşta rastgele olay (doğal afet, savaş, hastalık, terfi); olaya yanıt: **ignore / accept / assault / argue**; art lessons / sports lessons; tablo satma, albüm çıkarma; zengin doğma şansı; tatil etkinliği; "her oturum 5 dk" (minimalist). Reklam + Remove Ads.

### 4.3 KOPYA
- **Al:** "Olaya 4 sabit tepki tarzı (ignore/accept/assault/argue)" fikri → Motto'da seçeneklerin görünmez `pattern` etiketi zaten bu; kullanıcıya **tutarlı tepki arketipleri** (Ertele / Kabullen / Kavga / Pazarlık) olarak sunmak, kalıp dedektörünü okunur kılar.
- **Ders:** Rakip, daha "robust" olsa da **kişilik, mizah ve ritim** olmayınca kaybetti; BitLife'ın farkı metin tonuydu. Motto'nun yatırımı da (D-064 roast dozu) buraya.

---

## 5. Çapraz sentez — Motto için "En iyi 12 kopya"

1. **Tek dokunuş → sürpriz ritmi** (BitLife Age): Motto'da "karar → zaman akar → olay" (D-066) aynı hızı korumalı; yıl ≤ 120 sn.
2. **Doğum/kimlik satırı şakası** → §4.2 zaten var; "nasıl doğdun" satırının Motto karşılığı "nasıl 18 oldun" (tek cümle, roast).
3. **Ribbon = Teşhis**, mezar taşında + koleksiyonda (D-065).
4. **Mezar taşı istatistikleri** (cenazeye katılan sayısı, net değer, çocuk) → Roast Raporu sayı satırları.
5. **Haftalık sabit ritüel** (Cumartesi 15:00) → Pazartesi 00:00 Kamp; tema cümlesi + 3–5 görev + kozmetik.
6. **Journal** → Koçun Defteri'nin okunabilir ömür kaydı; ölümde "Defteri oku".
7. **NPC'lerin kendi hayatı var** (iş değiştirir, hastalanır, ölür) → D-062/D-067.
8. **Evcil hayvan aylık gideri + ölümü** → Pamuk/Biscuit.
9. **Freelance gig** = günlük satırda küçük ek gelir ("3 saat kurye, 40 lira").
10. **Tek kurallı 20 sn mini oyun** (gardiyan 2 hamle) → 2–3 mikro oyun, D-063 göz teması modeli.
11. **Ücretsiz içerik damlası duyurusu** ("5 yeni kariyer merdiveni") → aylık ücretsiz olay paketi.
12. **Tek paket 4,99 $ çıpası** (Top Dog/Top Cat) → Koç Lisansı.

**Kesinlikle alınmayacaklar:** Age başına interstitial; seçeneğe rewarded kilit; ölümü satan Time Machine; 15 kalemlik paket vitrini; Boss Mode→Expansion yeniden etiketleme; 2 nesil/4 hayvan paywall'ı; battle pass (Seasons); mafya/idam/royalty; "satın aldım reklam geri geldi" olasılığı (lisans doğrulaması offline ve kalıcı).

---

## 6. Açık sorular / doğrulanamayanlar
- Bitizenship'in güncel US fiyatı 7,99 mı 9,99 $ mı (listede ikisi de var; TR ₺349,99→₺399,99 geçişi 2026'da zam olduğunu düşündürüyor).
- Movie Director pack fiyatı; Ultimate Fighter Mode'un tam fiyatı.
- 2024'ün tam sürüm listesi (3.14–3.17) resmî kaynaktan doğrulanamadı (mod siteleri çelişkili).
- Seasons'ın tam mekaniği (günlük görev + Community Goal + BitPass + Bits) yalnızca özetlerden; iptal nedeni resmî: "player frustration".
- Reklam sıklığı: ölçülmüş tek kaynak Gamigion (~70 sn); yorumlar 2–5 dk.

---

## Kaynaklar (47)
App Store US BitLife (id1374403536) · App Store TR BitLife · App Store TR BitLife GO! · App Store US DogLife (id1589129140) · App Store US/GB/MD CatLife (id1598978868) · App Store BitLife Español (id1607840241) · Google Play BitLife · Google Play DogLife · Google Play CatLife · AppBrain BitLife · AppBrain DogLife · AppBrain CatLife · AppBrain InstLife · AppstoreSpy BitLife · justuseapp BitLife reviews · appgamer BitLife reviews · Metacritic BitLife user reviews · GameFAQs "BitDead" review (Oca 2026) · Common Sense Media BitLife (parent/kid reviews) · smartsocial.com BitLife · Bark BitLife review · AppleVis BitLife thread · AppleVis DogLife listing · bitlife-life-simulator.fandom.com (Bitizenship, God Mode, Time Machine, Death, Death/Final Results, Generations, Diseases, Pets, Shelter, Careers/Occupation, Category:Activities, Category:Expansion Packs, Minigames, Challenges, Achievements, Education, Astronaut, Mafia, DogLife, forum "My decision for BitLife in 2026", forum "Are the expansion packs worth it") · bitlife-life-simulator-fanon.fandom.com/Updates · instlife.fandom.com (Events, 1.1.8) · bitlifeapp.com (whats-new, patch-notes, ultimate-fighter-mode, movie-director, help, about) · bitlife.zendesk.com (Boss Mode, Time Machine) · @BitLifeApp X gönderileri (Boss Mode yanıtı 2023; 5 kariyer merdiveni Tem 2025; Pride Season telafisi; Legacy Bitizen/Movie Director; "2026" teaser) · candywriter.com/about · Goodgame Studios basın bülteni (kurucular) · Stillfront satın alma duyurusu / Game Developer / PocketGamer.biz · Stillfront Q3 2025 ve yıl sonu 2025 raporları · Gamigion interstitial analizi · Adlock BitLife ads · ProGameGuides (Bitizen, Boss Mode, challenges, ribbons, pets, Street Hustler, UFM, achievements, Outdoor pack) · Level Winner (God Mode 1.33, Criminal 1.29, School 1.23, Royal, Astronaut, Street Hustler, Business, DogLife) · Pocket Gamer prison layouts · Destructoid (prison, ribbons, challenges) · GameSkinny (packs, prison) · Escapist (packs) · Prima Games (astronaut, mafia, business, ribbons) · Twinfinite/Droid Gamers ribbons · Gamezebo (achievements 63, pets, 1.15) · Hardcore Droid DogLife review · Charlie INTEL / Mobile Gaming Hub DogLife guides · Newsweek "What is BitLife" (2018) · HubPages InstLife guide · Tiny Fates (InstLife/text life sims) · TV Tropes BitLife · worldpopulationreview BitLife royalty countries · Lemon8 UI açıklaması · Medium "Review: Bitlife simulation".
