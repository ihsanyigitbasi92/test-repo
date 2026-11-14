/**
 * Web renderer of the share card: draws ShareCardData on a 2D canvas at 1080×1920 / 1080×1080 with the geometry of
 * shareLayout.ts (the same one the RN preview uses) and returns a PNG blob. DOM-only APIs are touched inside the
 * functions, never at import time, so the module loads in node tests.
 */
import { SHARE_COLORS as C, shareLayout } from './shareLayout';
import type { ShareCardData, ShareFormat } from './shareCard';

const STAMP = '"Archivo Black", Impact, "Arial Black", sans-serif';
const COACH = '"Fraunces", Georgia, "Times New Roman", serif';
const BODY = '"IBM Plex Sans", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

type Ctx = CanvasRenderingContext2D;

/** Greedy word wrap; the last allowed line gets an ellipsis when text is left over. */
export function wrapLines(measure: (s: string) => number, text: string, maxW: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let cur = '';
  for (let i = 0; i < words.length; i++) {
    const w = words[i]!;
    const next = cur ? `${cur} ${w}` : w;
    if (measure(next) <= maxW || !cur) { cur = next; continue; }
    out.push(cur); cur = w;
    if (out.length === maxLines) { cur = ''; break; }
  }
  if (cur && out.length < maxLines) out.push(cur);
  const used = out.join(' ').split(/\s+/).filter(Boolean).length;
  if (used < words.length && out.length) {
    let last = out[out.length - 1]!;
    while (last && measure(`${last}…`) > maxW) last = last.slice(0, -1).trimEnd();
    out[out.length - 1] = `${last}…`;
  }
  return out;
}

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number | [number, number, number, number]): void {
  const [tl, tr, br, bl] = Array.isArray(r) ? r : [r, r, r, r];
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y); ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  ctx.lineTo(x + w, y + h - br); ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
  ctx.lineTo(x + bl, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
  ctx.lineTo(x, y + tl); ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

const upper = (d: ShareCardData, x: string) => x.toLocaleUpperCase(d.locale === 'tr' ? 'tr-TR' : 'en-US');

/** Draw the card. `avatar`: the grayscale face (an image of the SVG avatar) or null. */
export function drawShareCard(ctx: Ctx, d: ShareCardData, format: ShareFormat, avatar: CanvasImageSource | null): void {
  const L = shareLayout(format);
  const { W, H } = L;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);

  // Folder tab + sheet
  ctx.font = `${L.tabFont}px ${STAMP}`;
  (ctx as Ctx & { letterSpacing?: string }).letterSpacing = '4px';
  const tabW = ctx.measureText(d.title).width + 56 + d.title.length * 4, tabH = L.tabFont + 28;
  const tabX = L.pad + 24, tabY = L.pad;
  ctx.fillStyle = C.sheet; roundRect(ctx, tabX, tabY, tabW, tabH + 4, [18, 18, 0, 0]); ctx.fill();
  ctx.fillStyle = C.lime; ctx.fillText(d.title, tabX + 28, tabY + 14 + L.tabFont * 0.86);
  (ctx as Ctx & { letterSpacing?: string }).letterSpacing = '0px';
  const sx = L.pad, sy = tabY + tabH, sw = W - L.pad * 2, sh = H - L.pad - L.foot - L.footGap - sy;
  ctx.fillStyle = C.sheet; roundRect(ctx, sx, sy, sw, sh, 22); ctx.fill();
  ctx.strokeStyle = C.line; ctx.lineWidth = 3; ctx.stroke();

  const x0 = sx + L.sheetPad, inner = sw - L.sheetPad * 2;
  let y = sy + L.sheetPad;

  // Portrait
  const r = L.avatar / 2;
  ctx.save();
  ctx.beginPath(); ctx.arc(x0 + r, y + r, r, 0, Math.PI * 2); ctx.closePath();
  ctx.fillStyle = C.face; ctx.fill();
  ctx.clip();
  if (avatar) ctx.drawImage(avatar, x0 + 6, y + L.avatar * 0.1, L.avatar - 12, L.avatar - 12);
  ctx.restore();
  ctx.beginPath(); ctx.arc(x0 + r, y + r, r - 3, 0, Math.PI * 2); ctx.strokeStyle = C.faceEdge; ctx.lineWidth = 6; ctx.stroke();

  // Name block, vertically centred on the portrait
  const tx = x0 + L.avatar + 40, tw = inner - L.avatar - 40;
  ctx.font = `italic 700 ${L.nameFont}px ${COACH}`;
  const nameLines = wrapLines((s) => ctx.measureText(s).width, d.name, tw, 2);
  ctx.font = `italic 500 ${L.farewellFont}px ${COACH}`;
  const fareLines = wrapLines((s) => ctx.measureText(s).width, d.farewell, tw, 2);
  const blockH = nameLines.length * L.nameFont * 1.12 + 10 + L.yearsFont * 1.3 + 10 + fareLines.length * L.farewellFont * 1.25;
  let ty = y + Math.max(0, (L.avatar - blockH) / 2);
  ctx.fillStyle = C.ink; ctx.font = `italic 700 ${L.nameFont}px ${COACH}`;
  for (const l of nameLines) { ty += L.nameFont * 1.12; ctx.fillText(l, tx, ty - L.nameFont * 0.2); }
  ty += 10 + L.yearsFont * 1.3;
  ctx.fillStyle = C.ink2; ctx.font = `700 ${L.yearsFont}px ${BODY}`;
  ctx.fillText(`${d.years} · ${d.ageLine}`, tx, ty - L.yearsFont * 0.3);
  ty += 10;
  ctx.font = `italic 500 ${L.farewellFont}px ${COACH}`;
  for (const l of fareLines) { ty += L.farewellFont * 1.25; ctx.fillText(l, tx, ty - L.farewellFont * 0.25); }
  y += L.avatar + L.gap;

  // Highlight rows
  for (const row of d.rows.slice(0, L.maxRows)) {
    ctx.fillStyle = C.ink2; ctx.font = `700 ${L.labelFont}px ${BODY}`;
    (ctx as Ctx & { letterSpacing?: string }).letterSpacing = '3px';
    y += L.labelFont; ctx.fillText(upper(d, row.label), x0, y);
    (ctx as Ctx & { letterSpacing?: string }).letterSpacing = '0px';
    ctx.fillStyle = C.ink; ctx.font = `600 ${L.rowFont}px ${BODY}`;
    const lines = wrapLines((s) => ctx.measureText(s).width, row.text, inner, 2);
    y += 8;
    for (const l of lines) { y += L.rowFont * 1.25; ctx.fillText(l, x0, y - L.rowFont * 0.25); }
    y += L.rowGap;
    ctx.save(); ctx.setLineDash([12, 10]); ctx.strokeStyle = C.line; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + inner, y); ctx.stroke(); ctx.restore();
    y += L.rowGap;
  }

  // Coach's last word
  y += L.gap - L.rowGap;
  ctx.font = `italic 500 ${L.wordFont}px ${COACH}`;
  const wordLines = wrapLines((s) => ctx.measureText(s).width, `“${d.lastWord}”`, inner - 40 - (format === 'square' ? 0 : L.stampFont * 0), L.wordLines);
  const wordTop = y;
  ctx.fillStyle = C.gold; ctx.font = `700 ${L.labelFont}px ${BODY}`;
  (ctx as Ctx & { letterSpacing?: string }).letterSpacing = '3px';
  y += L.labelFont; ctx.fillText(upper(d, d.lastWordLabel), x0 + 40, y);
  (ctx as Ctx & { letterSpacing?: string }).letterSpacing = '0px';
  y += 10;
  ctx.fillStyle = C.ink; ctx.font = `italic 500 ${L.wordFont}px ${COACH}`;
  for (const l of wordLines) { y += L.wordFont * 1.3; ctx.fillText(l, x0 + 40, y - L.wordFont * 0.3); }
  ctx.fillStyle = C.gold; ctx.fillRect(x0, wordTop, 10, y - wordTop);

  // KAPANDI / CLOSED stamp
  ctx.save();
  ctx.font = `${L.stampFont}px ${STAMP}`;
  (ctx as Ctx & { letterSpacing?: string }).letterSpacing = '8px';
  const stW = ctx.measureText(d.closed).width + 60 + d.closed.length * 8, stH = L.stampFont * 1.25;
  const cx = sx + sw - L.stampRight - stW / 2, cy = sy + sh - L.stampBottom - stH / 2;
  ctx.translate(cx, cy); ctx.rotate((-9 * Math.PI) / 180);
  ctx.globalAlpha = 0.92;
  ctx.strokeStyle = C.red; ctx.lineWidth = 10; roundRect(ctx, -stW / 2, -stH / 2, stW, stH, 14); ctx.stroke();
  ctx.fillStyle = C.red; ctx.textAlign = 'center'; ctx.fillText(d.closed, 4, L.stampFont * 0.36);
  ctx.restore();
  (ctx as Ctx & { letterSpacing?: string }).letterSpacing = '0px';

  // Footer: MOTTO stamp · by D2P Technology · store link
  const fy = H - L.pad - L.foot;
  ctx.font = `${L.mottoFont}px ${STAMP}`;
  (ctx as Ctx & { letterSpacing?: string }).letterSpacing = '6px';
  const mW = ctx.measureText(d.stamp).width + 52 + 6 * d.stamp.length, mH = L.mottoFont * 1.4;
  const my = fy + (L.foot - mH) / 2;
  ctx.fillStyle = C.lime; roundRect(ctx, sx, my, mW, mH, 10); ctx.fill();
  ctx.fillStyle = C.limeInk; ctx.fillText(d.stamp, sx + 26, my + mH / 2 + L.mottoFont * 0.36);
  (ctx as Ctx & { letterSpacing?: string }).letterSpacing = '0px';
  ctx.textAlign = 'right';
  ctx.fillStyle = C.ink; ctx.font = `700 ${L.byFont}px ${BODY}`;
  ctx.fillText(d.by, sx + sw, fy + L.foot / 2 - 4);
  ctx.fillStyle = C.ink2; ctx.font = `${L.linkFont}px ${BODY}`;
  ctx.fillText(d.link, sx + sw, fy + L.foot / 2 + L.linkFont + 4);
  ctx.textAlign = 'left';
}

/** Rasterise an <svg> element (the on-screen avatar) to an image the canvas can draw. */
export async function svgToImage(svg: SVGElement | null): Promise<HTMLImageElement | null> {
  if (!svg || typeof XMLSerializer === 'undefined') return null;
  const clone = svg.cloneNode(true) as SVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', '600'); clone.setAttribute('height', '600');   // rasterise sharp at the card's size
  const xml = new XMLSerializer().serializeToString(clone);
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/** Render the card to a PNG blob (web). Waits for the game fonts when the browser exposes document.fonts. */
export async function renderSharePng(d: ShareCardData, format: ShareFormat, avatarSvg: SVGElement | null): Promise<Blob | null> {
  const L = shareLayout(format);
  try {
    const fontsApi = (document as Document & { fonts?: { load: (f: string) => Promise<unknown> } }).fonts;
    if (fontsApi) await Promise.race([
      Promise.all([fontsApi.load(`40px ${STAMP}`), fontsApi.load(`italic 700 40px ${COACH}`), fontsApi.load(`italic 500 40px ${COACH}`), fontsApi.load(`700 40px ${BODY}`)]),
      new Promise((r) => setTimeout(r, 1500)),
    ]);
  } catch { /* fonts unavailable: canvas falls back to the system faces in the stacks */ }
  const canvas = document.createElement('canvas');
  canvas.width = L.W; canvas.height = L.H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  drawShareCard(ctx, d, format, await svgToImage(avatarSvg));
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
}
