/**
 * Analitik metinleri — düz dil, koç sesi yok. analyticsEn.ts her anahtarı aynalar (tip kontrolü).
 * D-161 (sahip kararı): analitik varsayılan açık (AEA / BK / İsviçre / bilinmeyen bölge hariç; orada gizlilik
 * kartında anahtar). Metinler hukuk incelemesinden geçmedi: docs/design/17 §11.
 */
export const analyticsTr = {
  section: 'ANALİTİK VE ÇÖKME RAPORLARI',
  /** Gizlilik kartındaki anahtar (yalnız AEA / BK / İsviçre / bilinmeyen bölgede). */
  label: 'Analitik paylaşımı',
  hint: 'Oyun olayları sayı olarak, isimsiz biçimde yurt dışındaki sağlayıcıya (Google Firebase) gider; çökme raporları da. İsmin, şehrin, yazdığın hiçbir şey gitmez. Kapalıyken oyun aynıdır.',
  minor: 'Yaşın nedeniyle analitik bu bölgede kapalıdır.',
  statusOn: 'Şu an açık: isimsiz kullanım sayıları ve çökme raporları Google Firebase\'e gidiyor. Reklam kimliği kullanılmıyor.',
  statusOff: 'Şu an kapalı: bu cihazdan analitik ya da çökme raporu gitmiyor.',
  statusPending: 'Henüz başlamadı: cihazda bekliyor, sorulmadan gönderilmez.',
  reset: 'Verilerimi sil / analitik kimliğimi sıfırla',
  resetHint: 'Cihazda bekleyen kayıtlar silinir, analitik kimliğin yenilenir. Sunucuya ulaşmış veriler için destek adresine yaz (taslak: adres yayından önce eklenecek).',
  resetDone: 'Silindi; kimlik yenilendi.',
};
export type AnalyticsStrings = typeof analyticsTr;
