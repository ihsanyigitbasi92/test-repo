# 19 — Bildirimler (isteğe bağlı yerel hatırlatma)

> Durum: kod hazır (`apps/mobile/src/notifications/`), web'de bilinçli olarak yok. Kaynak: davranış raporu 2026-11-13 §4 Y4, §5 madde 2, §6 sarı nokta 3. Karar: D-162 (00-VIZYON-ve-KARARLAR.md).

## 1. Neden
Davranış uzmanı, oyunda D1 sonrası dönüş için **dış bir tetik** olmadığını tespit etti (Fogg B=MAP). Zarf ve anne araması bu rolü taşıyamıyor. Tahmini etki (ölçüm değil, uzman görüşü): D1 +2–4, D7 +2–3 puan. Kendi A/B'mizle doğrulanmalı.

## 2. Kurallar (kodda sabit, testte zorlanıyor)

| Kural | Değer | Kod |
|---|---|---|
| İzin | **Yalnız açık seçimle.** Sistem izni ancak oyuncu oyunda "Evet, yaz" dedikten sonra istenir. | `runtime.ts › answer` |
| Ne zaman sorulur | En erken **2. oturumun sonunda**: "Bugünlük yeter" sayfasında, bir kez. Ayrıca Ayarlar › Hatırlatma. | `plan.ts › shouldAsk`, `ReminderAsk.tsx` |
| Düğmeler | "Hayır, gerek yok" / "Evet, yaz": aynı boy, aynı stil, hiçbiri seçili değil. | `ReminderAsk.tsx` |
| Sıklık | En çok **günde 1**. Ayrılıştan sonra +1, +2, +3. gün; sonra haftalık +10, +17, +24, +31. gün. **3 yanıtsız → haftalık, 7 yanıtsız → susar.** | `plan.ts › SERIES_DAYS` |
| Saat | Oyuncunun **son 7 oturum başlangıç saatinin medyanı**, :10'da. Gece yok: 22:00 sonrası 21'e, 09:00 öncesi 09'a çekilir. Geçmiş yoksa 19:10. | `usualHour`, `seriesTimes` |
| İptal | Uygulama her açıldığında **bekleyen tüm hatırlatmalar iptal** edilir; çıkışta yeni seri kurulur. | `onOpen`, `onLeave` |
| Metin | Oyun dünyasından tek koç satırı (TR/EN ayrı yazıldı). **Sayı yok, seri/streak yok, kayıp/"kaçırıyorsun" dili yok, aciliyet yok, ödül vaadi yok, ünlem yok.** Kedi satırları yalnız kedi yaşıyorsa. | `LINES`, `FORBIDDEN` (test) |
| Rozet / ses | İkon rozeti yok, ses yok; uygulama öndeyken gösterilmez. Okunmamış sayacı asla bildirime ya da rozete taşınmaz. | `scheduler.native.ts` |
| Yaş | Yaş kapısından önce hiçbir şey; 16 altı oyun hiç açılmaz. | (oyun akışı) |
| Web | Yok (no-op). Ayarlar satırı da gizli. `export:web` ve testler yerel modülü yüklemez (`scheduler.ts` / `scheduler.native.ts` ayrımı). | `scheduler.ts` |

Örnek satırlar: "Defter masada açık duruyor. Kalem de." · "Posta kutusunda bir zarf var. Ben açmadım." · "Pamuk masadaki bardağa yine bakıyor." / "The notebook is open on the table. So is the pen." · "Biscuit is staring at the glass on the table again."

## 3. Teknik
- Paket: `expo-notifications ~58.1.8` (Expo SDK 58'in `bundledNativeModules.json` sürümü; `npx expo install` ile aynı çözüm, kilit dosyasında 58.1.9). `app.json` eklentisi: `["expo-notifications", { "defaultChannel": "reminders" }]`.
- Yalnız **yerel, tarihli** bildirim (`SchedulableTriggerInputTypes.DATE`); push token yok, sunucu yok.
- Android: `reminders` kanalı, `IMPORTANCE_DEFAULT`, rozet kapalı. Android 13+ `POST_NOTIFICATIONS` izni eklentiyle gelir; sistem diyaloğu yalnız oyundaki "Evet"ten sonra.
- iOS: `allowAlert` yalnız (rozet ve ses istenmez).
- Depolama: ayrı anahtar `motto.reminders.v1` → `{ optIn: unasked|yes|no, answeredAt, hours[≤7] }`. Oyun kaydına girmez.

## 4. Ölçüm (17 §3)
`notif_optin{answer: yes|no|os_denied, surface: session_end|settings}`, `notif_open{idx}` (seride kaçıncı hatırlatmadan açıldı), `settings_change{setting: reminders}`. Başarı ölçütü: hatırlatma açan kohortta D7 farkı; kapatma oranı > %20 ise metin/sıklık gözden geçirilir.

## 5. Açık konular
- Gerçek cihazda doğrulanmadı (EAS build gerekir): izin diyaloğu, kanal, saat dilimi değişimi, yeniden başlatma sonrası planlı bildirimlerin korunması.
- Mağaza beyanı: bildirim içeriği pazarlama sayılmaz (oyun içi anlatı), yine de App Store 4.5.4 ve Play politikası avukat/yayıncıyla teyit edilmeli.
- A/B: seri (3 günlük + haftalık) ile yalnız 1 gün sonrası arasında kıyas.
