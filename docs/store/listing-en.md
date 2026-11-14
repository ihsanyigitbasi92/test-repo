# Mağaza listesi — İngilizce (en-US; en-GB / en-CA / en-NZ bundan kopyalanır)

> Sürüm 1.0 için App Store Connect ve Google Play Console'a **olduğu gibi yapıştırılacak** metinler. İngilizce metin Türkçeden çevrilmedi, ayrı yazıldı (00 §9).
> Karakter sayıları `docs/store/check-limits.mjs` ile ölçüldü; son çıktı en altta.
> Her alan `==== FIELD ====` satırları arasındadır; yapıştırırken o satırları almayın.

## Kurallar

- Yasak sözcükler (00 §1.2, 11 §2.8.2): motivation, wellness, habit, therapy, self-help, mindfulness, rakip/başka uygulama adları, "games like", "most popular", "limited time", "bribe".
- **"bet" / "bets" mağaza metninde yok** (D-106, 08 D-ÖNERİ-08-16): kumar anahtar kelimesi sayılır. Mağazada "wagers against you", "calls it", "stamps itself wrong" kullanılır; "bets against you" yalnızca kapalı reklam kreatifinde kalır.
- 4+ vitrin: ad, alt başlık, promosyon metni ve ekran görüntülerinde ölüm/alkol/hastalık yok. Açıklamada ölüm yalnızca 2. paragrafta.
- Oyuncu iddiada hiçbir şey yatırmaz (para, oyun parası, puan yok); metin bunu açıkça söyler.

---

## 1. App name (≤ 30)

==== NAME ====
Motto: Uncertified Life Coach
==== /NAME ====

## 2. Subtitle (iOS, ≤ 30)

==== SUBTITLE ====
Day-by-day life simulator
==== /SUBTITLE ====

## 3. Promotional text (iOS, ≤ 170)

==== PROMO ====
Your coach wagers against you on the big calls. Win, and the coach stamps I WAS WRONG on your file, by hand. You stake nothing. Only the coach's pride is on the line.
==== /PROMO ====

## 4. Short description (Google Play, ≤ 80)

==== SHORT ====
Day-by-day life sim. Your coach wagers against you and stamps itself wrong.
==== /SHORT ====

## 5. Full description (both stores, ≤ 4000)

==== DESCRIPTION ====
The life sim where time flows on its own and your coach keeps the receipts. Text-based, day by day, from eighteen onward. No mid-game ads; even the coach is surprised.

Your narrator, Motto, gave 2,400 seminars in hotel ballrooms, wrote one book (unpublished) and holds one certificate (the institute closed). Motto stopped telling people they can do it, and now believes in reps and honest numbers. You are the last client. No advice, just notes. When your life ends, the file closes, the Roast Report arrives, and a new client file opens.

THE COACH'S WAGER
On a big decision, the coach pins a yellow slip to the corner of the card: "WAGER: You won't make registration." The real odds are printed on the slip. Win, and your file gets an I WAS WRONG stamp; lose, and it says CALLED IT. You stake nothing, and the coach can't touch the outcome. The dice aren't the coach's.

TIME FLOWS. CARDS WAIT.
Days pass on their own. When a decision card arrives, time waits for you. Pause or speed up whenever you like. Switch to Auto and the coach makes the choices, while making it clear this is not a recommendation.

A REPORT CARD EVERY YEAR
Every birthday brings a report card: your grades, the coach's hit rate for the year, and a shareable Motto of the Year.

PEOPLE TALK BACK
Your mom posts in the family group chat, HR says "we'll get back to you", your roommate forgets the rent, and the cat stares at the glass on the table. Everyone talks in their own voice.

THE LIFE PATH
First job, promotion, resignation, love, engagement, wedding, baby. Or none of it. Opportunity knocks; whether you open the door is your call.

10,000+ EVENTS
Written separately in English and Turkish; neither is a translation of the other. Plays offline, no account needed.

THE HONEST PART
- Free to download. Contains ads and optional in-app purchases.
- Interstitial ads appear only when you come back after a long break, before you pick up where you left off. Never during a decision, on a report card, on the final screens of a life, or when you tap "Enough for today".
- Rewarded ads are an offer: "Watch ad" and "No thanks" are the same size. Decline, and the coach says nothing.
- There is one product for sale: "No Ads". It turns off interstitial ads. Optional rewarded offers stay where they are; watching is up to you. It sells no money, stats, health or choices.
- Choices are not for sale. Contents are listed; no surprises. No loot boxes, no subscriptions, no energy system, no wait timers.
- For ages 16 and up. Contains dark comedy, mature themes and references to alcohol. Everything is fiction; people, institutions and events are made up.

Privacy Policy and Terms of Use: [PRIVACY_URL] · [TERMS_URL]
Support: [SUPPORT_EMAIL]
D2P Technology
==== /DESCRIPTION ====

> `[PRIVACY_URL]`, `[TERMS_URL]`, `[SUPPORT_EMAIL]` yayından önce doldurulmalı. İngilizce tutarlarda vergi notu: ABD'de satış vergisi fiyata dahil değildir; açıklama fiyat yazmadığı için sorun yok (14 §4).

## 6. Keywords (iOS, ≤ 100, comma-separated, no spaces)

==== KEYWORDS ====
sim,text,story,choices,dark comedy,roast,career,relationships,report card,offline,narrative,funny
==== /KEYWORDS ====

- Ad ve alt başlıktaki sözcükler (motto, uncertified, life, coach, day, simulator) tekrarlanmadı. Apple "life" + "sim" birleşimini alanlar arası eşleştirir.
- 11 §2.8.1 taslağındaki **"streak"** çıkarıldı: v1.0'da seri/streak özelliği yok, aranınca yanıltıcı olur. **"death"** 4+ vitrin ilkesi için çıkarıldı. "wager" kumar eşleşmesi riskinden dolayı anahtar kelimeye konmadı.

## 7. What's New — 1.0

==== WHATS_NEW ====
First release. The coach opened the notebook, tested the pen, and is waiting for the first client. You.
==== /WHATS_NEW ====

## 8. Category

| Store | Primary | Secondary | Note |
|---|---|---|---|
| App Store | **Games › Simulation** | Games › Role Playing (2nd subcategory) · secondary category **Entertainment** | Never Health & Fitness / Lifestyle / Education (D-053). |
| Google Play | **Game › Simulation** | Tags (max 5): Life simulation, Story/Narrative, Casual, Single player, Offline | Pick the nearest match from the console's tag list. |

## 9. Screenshot captions (used in the frames, 4+ showcase)

| # | Scene | Headline | Sub-line |
|---|---|---|---|
| 01 | How to play | Time flows. | Cards wait for you. |
| 02 | Decision card + wager slip | Your coach wagers against you. | Real odds on the slip. Not the coach's dice. |
| 03 | Stamp + coach line | Wrong? The coach stamps it. | I WAS WRONG. Rare, but it happens. |
| 04 | HUD, years later | A whole life, day by day. | Job, home, cat, mom pressure. |
| 05 | Report card | A report card every year. | Plus a shareable Motto of the Year. |
| 06 | Life Path moment | Love, rings, wedding, baby. | Or none of it. Your door. |
| 07 | Client File | New client, new file. | The coach's pen is ready. |
| 08 | Shop | No mid-game ads. | One product: No Ads. Choices aren't for sale. |

---

## Character counts (script output)

<!-- COUNTS:en -->
| Alan | Karakter | Sınır | Durum | Not |
|---|---|---|---|---|
| App name (iOS+Play) | 29 | 30 | OK |  |
| Subtitle (iOS) | 25 | 30 | OK |  |
| Promotional text (iOS) | 166 | 170 | OK |  |
| Short description (Play) | 75 | 80 | OK |  |
| Full description (both) | 2736 | 4000 | OK |  |
| Keywords (iOS) | 97 | 100 | OK | 12 terms |
| What's new (both) | 103 | 4000 | OK |  |

(`node docs/store/check-limits.mjs --write` ile üretildi; yasak sözcük taraması temiz.)
