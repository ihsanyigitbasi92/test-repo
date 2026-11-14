/**
 * Web: make the PNG on a canvas (render.ts) and hand it over — the Web Share API with the file when the browser
 * can share files, else a PNG download; with no canvas at all, the card text goes to the clipboard.
 * Native counterpart: shareImage.native.ts (react-native-view-shot + expo-sharing).
 */
import type { ShareChannel } from '../analytics/events';
import { renderSharePng } from './render';
import { shareMessage } from './shareCard';
import type { ShareCardData, ShareFormat } from './shareCard';

export interface ShareRequest {
  data: ShareCardData;
  format: ShareFormat;
  /** Native: the mounted card view to capture. Unused on web. */
  view?: unknown;
  /** Web: the on-screen avatar <svg> (drawn into the PNG). */
  avatarSvg?: SVGElement | null;
}

export const shareFileName = (d: ShareCardData, f: ShareFormat): string =>
  `motto-${d.locale === 'tr' ? 'dosya' : 'file'}-${f === 'square' ? '1080x1080' : '1080x1920'}.png`;

/** The PNG the share would send (web preview uses it too). */
export function makeSharePng(req: ShareRequest): Promise<Blob | null> {
  if (typeof document === 'undefined') return Promise.resolve(null);
  return renderSharePng(req.data, req.format, req.avatarSvg ?? null);
}

export async function shareCardImage(req: ShareRequest, png?: Blob | null): Promise<ShareChannel> {
  const blob = png ?? (await makeSharePng(req).catch(() => null));
  const text = shareMessage(req.data);
  const nav = (typeof navigator !== 'undefined' ? navigator : null) as (Navigator & { canShare?: (d: ShareData) => boolean }) | null;
  if (blob && nav) {
    const file = new File([blob], shareFileName(req.data, req.format), { type: 'image/png' });
    if (typeof nav.share === 'function' && typeof nav.canShare === 'function' && nav.canShare({ files: [file] })) {
      try { await nav.share({ files: [file], title: 'MOTTO', text }); return 'web_share'; } catch (e) {
        if ((e as { name?: string })?.name === 'AbortError') return 'cancelled';
        /* not allowed here: fall through to the download */
      }
    }
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = file.name; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
      return 'download';
    } catch { /* fall through to the clipboard */ }
  }
  try { await nav?.clipboard.writeText(text); return 'clipboard'; } catch { return 'failed'; }
}
