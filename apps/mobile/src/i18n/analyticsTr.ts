/**
 * Analitik rızası — düz dil, koç sesi yok (11 §3.2, 06 §2.7.3). analyticsEn.ts her anahtarı aynalar (tip kontrolü).
 * Metinler hukuk incelemesinden geçmedi: docs/design/17 §11.
 */
export const analyticsTr = {
  section: 'Gizlilik',
  label: 'Analitik paylaşımı',
  hint: 'Oyun olayları sayı olarak, isimsiz biçimde yurt dışındaki sağlayıcıya (Google Firebase) gider; çökme raporları da. İsmin, şehrin, yazdığın hiçbir şey gitmez. Kapalıyken oyun aynıdır.',
  on: 'AÇIK',
  off: 'KAPALI',
  minor: 'Yaşın nedeniyle bu ayar kapalıdır.',
  reset: 'Analitik verilerimi sıfırla',
  resetHint: 'Cihazda bekleyen kayıtlar silinir, analitik kimliğin yenilenir.',
  resetDone: 'Sıfırlandı.',
  promptTitle: 'Analitik paylaşımı',
  promptBody: 'Hangi ekranda ne kadar kaldığını ve hangi kartları gördüğünü sayılarla paylaşmamıza izin verir misin? Veriler isimsizdir ve yurt dışındaki sağlayıcıya (Google Firebase) aktarılır; çökme raporları da buna dahildir. İsmin, şehrin, yazdığın hiçbir şey gitmez.',
  promptFoot: 'İzin vermesen de oyun tamamen aynıdır. Ayarlar\'dan her zaman değiştirebilirsin.',
  promptLink: 'Aydınlatma Metni',
  allow: 'Paylaş',
  deny: 'Paylaşma',
};
export type AnalyticsStrings = typeof analyticsTr;
