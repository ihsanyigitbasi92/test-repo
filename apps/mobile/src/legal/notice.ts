/**
 * Aydınlatma Metni / Privacy Notice (KVKK md. 10) — DRAFT. Built from the data lists of docs/design/14 (purchases),
 * 15 (ads, age gate) and 17 (analytics, D-161 default-on). Not legal advice; every sentence awaits the lawyer.
 */
import type { LegalText } from './types';

export const NOTICE: LegalText = {
  tr: `# Aydınlatma Metni

Bu metin taslaktır ve avukat onayı beklemektedir. Kesin hukuki nitelendirme içermez.

## Veri sorumlusu
D2P Technology. İletişim adresi yayından önce eklenecek.

## Cihazında kalanlar
- Oyun kaydı, ayarlar, eğitim durumu: yalnız bu cihazda.
- Yaş kapısı cevabı: yalnız bir yaş bandı (yetişkin ya da 16–17); yetişkinde doğum yılı saklanmaz. Cihazdan çıkmaz.
- İsim ve şehir oyundaki kurgu adlardır; hiçbir yere gönderilmez.

## Varsayılan olarak toplananlar: isimsiz kullanım analitiği ve çökme raporları
- Ne: oyun olaylarının adı ve sayıları (ör. kaç gün oynandı, hangi kart görüldü, hangi seçim yapıldı), uygulama sürümü, cihaz modeli ve işletim sistemi, kaba ülke bilgisi, uygulama örneği kimliği; çökme anında teknik hata kaydı.
- Ne değil: reklam kimliği, isim, şehir, yazdığın hiçbir metin, konum.
- Amaç: oyunu düzeltmek ve dengelemek, çökmeleri gidermek, kaç kişinin geri döndüğünü ölçmek.
- İşleyen: Google (Firebase Analytics, Crashlytics) veri işleyen sıfatıyla.
- Yurt dışı aktarım: veriler Google'ın yurt dışındaki sunucularında işlenir.
- Saklama (öneri): analitik ayrıntı 2 ay, ham kayıtlar en çok 14 ay, çökme raporları 90 gün.
- Varsayılan açıktır. Avrupa Ekonomik Alanı, Birleşik Krallık, İsviçre ve bölgesi bilinmeyen cihazlarda yalnız izin verilirse başlar. 16 yaş altında hiç başlamaz.

## Reklamlar (Google AdMob)
- Reklam gösterildiğinde AdMob reklam kimliği ve IP adresi gibi verileri işleyebilir; veriler yurt dışına aktarılır.
- Kişiselleştirilmiş reklam yalnız açık izninle (iOS'ta ayrıca izleme izniyle). 16–17 yaşta kilitli kapalıdır.
- Reklam kampanyası ölçümü (Meta) yalnız kişiselleştirilmiş reklam izni ve iOS izleme izniyle çalışır.

## Satın alma
- Ödemeyi App Store ya da Google Play alır. Satın alma kaydı için isimsiz bir kullanıcı kimliği ve işlem numarası mağaza ve RevenueCat ile paylaşılır. Kart bilgisi bize gelmez.

## Hakların (KVKK md. 11)
- Verilerinin işlenip işlenmediğini öğrenme, düzeltme, silme, itiraz ve diğer haklar.
- Cihazdaki analitik kayıtlarını silmek ve analitik kimliğini sıfırlamak için aşağıdaki düğmeyi kullanabilirsin.
- Sunucuya ulaşmış veriler için destek adresine yaz (adres yayından önce eklenecek).
- Hukuki dayanak (meşru menfaat ya da açık rıza) avukatla netleştirilecek.`,
  en: `# Privacy Notice

This text is a draft awaiting lawyer review. It makes no definitive legal statement.

## Who is responsible
D2P Technology. A contact address will be added before release.

## What stays on your device
- Game save, settings, tutorial progress: on this device only.
- The age question: only an age band (adult or 16–17); for adults no birth year is kept. It never leaves the device.
- Names and cities in the game are fiction and are never sent anywhere.

## Collected by default: anonymous usage analytics and crash reports
- What: names and counts of game events (e.g. days played, cards seen, choices made), app version, device model and OS, coarse country, an app-instance ID; a technical error record when the app crashes.
- What not: advertising ID, your name, your city, anything you type, location.
- Why: to fix and balance the game, to fix crashes, to measure how many players come back.
- Processor: Google (Firebase Analytics, Crashlytics).
- Transfer abroad: the data is processed on Google's servers outside Turkey.
- Retention (proposal): detailed analytics 2 months, raw records at most 14 months, crash reports 90 days.
- On by default. In the European Economic Area, the UK, Switzerland and on devices whose region is unknown it starts only if you allow it. Under 16 it never starts.

## Ads (Google AdMob)
- When an ad is shown, AdMob may process data such as your advertising ID and IP address; the data is transferred abroad.
- Personalised ads only with your explicit permission (on iOS also with tracking permission). Locked off for ages 16–17.
- Ad campaign measurement (Meta) runs only with personalised-ad permission and, on iOS, tracking permission.

## Purchases
- App Store or Google Play takes the payment. An anonymous user ID and the transaction number are shared with the store and RevenueCat to record the purchase. We never see card details.

## Your rights
- To learn whether your data is processed, to have it corrected or deleted, to object, and the other rights the law gives you.
- Use the button below to delete analytics records on this device and reset your analytics ID.
- For data already on the server, write to support (the address will be added before release).
- The legal basis (legitimate interest or explicit consent) is to be settled with the lawyer.`,
};
