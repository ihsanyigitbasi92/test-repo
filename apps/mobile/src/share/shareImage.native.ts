/**
 * iOS / Android: capture the mounted card view with react-native-view-shot at 1080×1920 / 1080×1080 and open the
 * system share sheet with the PNG (expo-sharing). If either module is unavailable (e.g. Expo Go without the native
 * module), fall back to the text share sheet.
 */
import { Share } from 'react-native';
import type { ShareChannel } from '../analytics/events';
import { SHARE_SIZE, shareMessage } from './shareCard';
import type { ShareCardData, ShareFormat } from './shareCard';

export interface ShareRequest {
  data: ShareCardData;
  format: ShareFormat;
  view?: unknown;
  avatarSvg?: unknown;
}

export const shareFileName = (d: ShareCardData, f: ShareFormat): string =>
  `motto-${d.locale === 'tr' ? 'dosya' : 'file'}-${f === 'square' ? '1080x1080' : '1080x1920'}.png`;

/** Web-only preview PNG; native previews the live view itself. */
export function makeSharePng(_req: ShareRequest): Promise<null> { return Promise.resolve(null); }

export async function shareCardImage(req: ShareRequest, _png?: unknown): Promise<ShareChannel> {
  const size = SHARE_SIZE[req.format];
  try {
    const [{ captureRef }, Sharing] = await Promise.all([import('react-native-view-shot'), import('expo-sharing')]);
    if (req.view && (await Sharing.isAvailableAsync())) {
      const uri = await captureRef(req.view as Parameters<typeof captureRef>[0], { format: 'png', quality: 1, result: 'tmpfile', width: size.w, height: size.h });
      await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png', dialogTitle: req.data.title });
      return 'native_sheet';
    }
  } catch { /* capture / sharing unavailable: share the text instead */ }
  try {
    const r = await Share.share({ message: shareMessage(req.data) });
    return r.action === Share.dismissedAction ? 'cancelled' : 'native_sheet';
  } catch { return 'failed'; }
}
