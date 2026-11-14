#!/usr/bin/env node
/**
 * App icon set — the MOTTO rubber stamp (src/screens/SplashScreen.tsx; theme.ts: lime #c9ff3a on dark paper #101410).
 *
 * One SVG design, rendered by headless Chromium (Playwright) at exact pixel sizes. Deterministic: no randomness
 * outside a seeded PRNG, the stamp face (Archivo Black, OFL) is embedded from @expo-google-fonts/archivo-black,
 * nothing is fetched from the network.
 *
 *   assets/icon.png                     1024²  RGB, no alpha (iOS + Expo default)   "M" stamp, full bleed paper
 *   assets/android-icon-foreground.png  1024²  RGBA, transparent; stamp inside the 66 dp safe circle (≈ 61 %)
 *   assets/android-icon-monochrome.png  1024²  RGBA, white on transparent (Android 13 themed icons; alpha only)
 *   (adaptive background = app.json › android.adaptiveIcon.backgroundColor #101410, no image)
 *   assets/favicon.png                    48²  RGB (web)
 *   assets/splash-icon.png              1024²  RGBA, transparent: full "MOTTO" stamp (the JS splash's first frame)
 *   ../../docs/store/screenshots/icon-512.png   512²  RGB  (Google Play hi-res icon)
 *   ../../docs/store/screenshots/icon-1024.png 1024²  RGB  (App Store marketing icon)
 *
 * Why "M" and not "MOTTO" on the icon: the five-letter stamp is unreadable below ~60 px (home screen 60 pt @2x is
 * fine, Settings 29 pt / notification 20 pt are not). The single letter survives down to 16 px; the full word stays
 * on the splash, the store listing and the feature graphic.
 *
 * Usage (apps/mobile):  node scripts/gen-icons.mjs [--preview <out.png>]
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync, inflateSync } from 'node:zlib';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const APP = join(dirname(fileURLToPath(import.meta.url)), '..');
const STORE = resolve(APP, '../../docs/store/screenshots');
const C = { paper: '#101410', paper2: '#181e18', lime: '#c9ff3a' };

const fontB64 = readFileSync(require.resolve('@expo-google-fonts/archivo-black/400Regular/ArchivoBlack_400Regular.ttf')).toString('base64');

// ── deterministic ink wear ───────────────────────────────────────────────────
function mulberry32(seed) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/** Small knocked-out specks (rubber stamp that did not fully ink). Coordinates in the 1024 design box. */
function specks(seed, n, box) {
  const r = mulberry32(seed);
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = box.x + r() * box.w, y = box.y + r() * box.h, rad = 1.5 + r() ** 3 * 7;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad.toFixed(1)}"/>`;
  }
  return out;
}

/**
 * The "M" stamp in a 1024 design box. `size` = stamp side, `wear` = speck count (0 for flat), `rough` = edge
 * displacement in design px. Returned as an SVG <g> (fill/stroke = `ink`).
 */
function mStamp({ size, ink, wear, rough, rot = -6, id }) {
  const s = size, half = s / 2, x = 512 - half, y = 512 - half;
  const bw = s * 0.085, rr = s * 0.12, inner = s * 0.03, gap = s * 0.06;
  const ix = x + bw / 2 + gap + inner / 2, iw = s - bw - gap * 2 - inner;
  const filter = rough ? `filter="url(#rough-${id})"` : '';
  const mask = wear ? `mask="url(#wear-${id})"` : '';
  return `
  <defs>
    <filter id="rough-${id}" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="${rough}" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <mask id="wear-${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024">
      <rect width="1024" height="1024" fill="#fff"/>
      <g fill="#000">${wear ? specks(1907, wear, { x, y, w: s, h: s }) : ''}</g>
    </mask>
  </defs>
  <g transform="rotate(${rot} 512 512)" ${mask}><g ${filter}>
    <rect x="${x + bw / 2}" y="${y + bw / 2}" width="${s - bw}" height="${s - bw}" rx="${rr}" fill="none" stroke="${ink}" stroke-width="${bw}"/>
    <rect x="${ix}" y="${ix - x + y}" width="${iw}" height="${iw}" rx="${rr * 0.55}" fill="none" stroke="${ink}" stroke-width="${inner}"/>
    <text x="512" y="${512 + s * 0.215}" text-anchor="middle" font-family="Stamp" font-size="${s * 0.62}" fill="${ink}">M</text>
  </g></g>`;
}

/** Full "MOTTO" stamp (splash), mirrors SplashScreen: 4 px border, radius 10, letter-spacing 4, rotated −4°. */
function mottoStamp({ ink, wear, id }) {
  const w = 860, h = 250, x = 512 - w / 2, y = 512 - h / 2;
  return `
  <defs>
    <filter id="rough-${id}" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <mask id="wear-${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024">
      <rect width="1024" height="1024" fill="#fff"/><g fill="#000">${specks(2701, wear, { x, y, w, h })}</g>
    </mask>
  </defs>
  <g transform="rotate(-4 512 512)" mask="url(#wear-${id})"><g filter="url(#rough-${id})">
    <rect x="${x + 12}" y="${y + 12}" width="${w - 24}" height="${h - 24}" rx="30" fill="none" stroke="${ink}" stroke-width="24"/>
    <text x="512" y="${512 + 62}" text-anchor="middle" font-family="Stamp" font-size="176" letter-spacing="12" fill="${ink}">MOTTO</text>
  </g></g>`;
}

const page = (px, bg, body) => `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Stamp;src:url(data:font/ttf;base64,${fontB64}) format('truetype')}
*{margin:0;padding:0}html,body{width:${px}px;height:${px}px;overflow:hidden;background:${bg}}svg{display:block}
</style><svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 1024 1024">${body}</svg>`;

const paperBg = `<defs><radialGradient id="pg" cx="0.32" cy="0.22" r="0.85"><stop offset="0" stop-color="#1e271e"/><stop offset="0.7" stop-color="${C.paper}"/></radialGradient></defs><rect width="1024" height="1024" fill="url(#pg)"/>`;

const ASSETS = [
  // iOS / default icon: full bleed, the system adds the corner mask. Stamp large; wear subtle so 29 px stays crisp.
  { out: join(APP, 'assets/icon.png'), px: 1024, opaque: true, html: (px) => page(px, C.paper, paperBg + mStamp({ size: 700, ink: C.lime, wear: 140, rough: 7, id: 'i' })) },
  { out: join(STORE, 'icon-1024.png'), px: 1024, opaque: true, html: (px) => page(px, C.paper, paperBg + mStamp({ size: 700, ink: C.lime, wear: 140, rough: 7, id: 'i' })) },
  { out: join(STORE, 'icon-512.png'), px: 512, opaque: true, html: (px) => page(px, C.paper, paperBg + mStamp({ size: 700, ink: C.lime, wear: 140, rough: 7, id: 'i' })) },
  { out: join(APP, 'assets/favicon.png'), px: 48, opaque: true, html: (px) => page(px, C.paper, `<rect width="1024" height="1024" fill="${C.paper}"/>` + mStamp({ size: 860, ink: C.lime, wear: 0, rough: 0, rot: -4, id: 'f' })) },
  // Android adaptive: 108 dp layer, 72 dp visible, 66 dp safe circle → stamp (rotated, rounded) stays within r ≈ 300.
  { out: join(APP, 'assets/android-icon-foreground.png'), px: 1024, opaque: false, html: (px) => page(px, 'transparent', mStamp({ size: 440, ink: C.lime, wear: 90, rough: 5, id: 'a' })) },
  { out: join(APP, 'assets/android-icon-monochrome.png'), px: 1024, opaque: false, html: (px) => page(px, 'transparent', mStamp({ size: 440, ink: '#ffffff', wear: 0, rough: 0, id: 'm' })) },
  { out: join(APP, 'assets/splash-icon.png'), px: 1024, opaque: false, html: (px) => page(px, 'transparent', mottoStamp({ ink: C.lime, wear: 120, id: 's' })) },
];

// ── PNG: drop the alpha channel (App Store rejects icons with an alpha channel, even fully opaque) ─────────────
function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) { c = (crc ^ buf[n]) & 0xff; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crc = (crc >>> 8) ^ c; }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function rgbaToRgbPng(png) {
  let off = 8, w = 0, h = 0, depth = 0, ctype = 0; const idat = [];
  while (off < png.length) {
    const len = png.readUInt32BE(off), type = png.toString('ascii', off + 4, off + 8), data = png.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); depth = data[8]; ctype = data[9]; if (data[12]) throw new Error('interlaced PNG'); }
    if (type === 'IDAT') idat.push(data);
    off += 12 + len;
  }
  if (depth !== 8 || (ctype !== 6 && ctype !== 2)) throw new Error(`unexpected PNG ${depth}/${ctype}`);
  const bpp = ctype === 6 ? 4 : 3, stride = w * bpp, raw = inflateSync(Buffer.concat(idat));
  const out = Buffer.alloc(h * (w * 3 + 1)); let prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], line = Buffer.from(raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)));
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? line[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
      const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
      const pred = f === 1 ? a : f === 2 ? b : f === 3 ? (a + b) >> 1 : f === 4 ? (pa <= pb && pa <= pc ? a : pb <= pc ? b : c) : 0;
      line[i] = (line[i] + pred) & 0xff;
    }
    prev = line;
    const o = y * (w * 3 + 1); out[o] = 0;
    for (let x = 0; x < w; x++) { out[o + 1 + x * 3] = line[x * bpp]; out[o + 2 + x * 3] = line[x * bpp + 1]; out[o + 3 + x * 3] = line[x * bpp + 2]; }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([png.subarray(0, 8), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(out, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

// ── preview sheet: every output, plus the icon at real small sizes and Android masks ──────────────────────────
function previewHtml() {
  const uri = (p) => 'data:image/png;base64,' + readFileSync(p).toString('base64');
  const icon = uri(join(APP, 'assets/icon.png')), fg = uri(join(APP, 'assets/android-icon-foreground.png'));
  const mono = uri(join(APP, 'assets/android-icon-monochrome.png')), splash = uri(join(APP, 'assets/splash-icon.png'));
  const fav = uri(join(APP, 'assets/favicon.png'));
  const sizes = [180, 120, 87, 60, 58, 48, 40, 29, 20];
  const ios = sizes.map((s) => `<figure><img src="${icon}" style="width:${s}px;height:${s}px;border-radius:${s * 0.2237}px"><figcaption>${s}</figcaption></figure>`).join('');
  const adaptive = (shape, s) => `<figure><div style="width:${s}px;height:${s}px;border-radius:${shape};background:${C.paper};overflow:hidden;position:relative"><img src="${fg}" style="position:absolute;width:${s * 1.5}px;height:${s * 1.5}px;left:${-s * 0.25}px;top:${-s * 0.25}px"></div><figcaption>${s}</figcaption></figure>`;
  const themed = (s) => `<figure><div style="width:${s}px;height:${s}px;border-radius:50%;background:#dfe6c8;overflow:hidden;position:relative"><div style="position:absolute;width:${s * 1.5}px;height:${s * 1.5}px;left:${-s * 0.25}px;top:${-s * 0.25}px;background:#38461a;-webkit-mask:url(${mono}) center/contain no-repeat"></div></div><figcaption>${s}</figcaption></figure>`;
  return `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:24px;background:#2b2f2b;color:#ddd;font:13px system-ui;width:1152px}
h2{font-size:14px;margin:18px 0 8px;color:#fff}.row{display:flex;gap:18px;align-items:flex-end;flex-wrap:wrap}figure{margin:0;text-align:center}figcaption{margin-top:4px;color:#999}
.home{background:linear-gradient(160deg,#5b6f8a,#a77a5a);padding:16px;border-radius:12px}.light{background:#f2f2f2;padding:16px;border-radius:12px;color:#333}
.safe{position:relative;width:256px;height:256px;background:repeating-conic-gradient(#444 0 25%,#555 0 50%) 0 0/16px 16px}.safe img{width:256px;height:256px}
.safe:after{content:'';position:absolute;left:${128 - 128 * 0.611}px;top:${128 - 128 * 0.611}px;width:${256 * 0.611}px;height:${256 * 0.611}px;border:1px dashed #f0f;border-radius:50%}
.safe:before{content:'';position:absolute;left:${128 - 128 * 0.667}px;top:${128 - 128 * 0.667}px;width:${256 * 0.667}px;height:${256 * 0.667}px;border:1px dashed #0ff}</style>
<h2>iOS icon.png (system squircle) — real pixel sizes</h2><div class="row home">${ios}</div>
<div class="row light" style="margin-top:8px">${ios}</div>
<h2>Android adaptive (bg #101410 + foreground) — circle / squircle / rounded square</h2><div class="row home">${[108, 72, 48].map((s) => adaptive('50%', s)).join('')}${[72, 48].map((s) => adaptive('30%', s)).join('')}${[72, 48].map((s) => adaptive('16%', s)).join('')}</div>
<h2>Android 13 themed (monochrome) · favicon 48 · safe zones (cyan 72 dp visible, magenta 66 dp safe circle)</h2>
<div class="row"><div class="row light">${[72, 48].map(themed).join('')}</div><figure><img src="${fav}" style="width:48px;height:48px"><figcaption>favicon 48</figcaption></figure>
<figure><div class="safe"><img src="${fg}"></div><figcaption>foreground</figcaption></figure><figure><div class="safe"><img src="${mono}"></div><figcaption>monochrome</figcaption></figure>
<figure><div style="width:256px;height:256px;background:${C.paper}"><img src="${splash}" style="width:256px"></div><figcaption>splash-icon on #101410</figcaption></figure>
<figure><img src="${icon}" style="width:256px"><figcaption>icon.png 1024 (scaled)</figcaption></figure></div>`;
}

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  for (const a of ASSETS) {
    await pg.setViewportSize({ width: a.px, height: a.px });
    await pg.setContent(a.html(a.px), { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts.ready);
    let png = await pg.screenshot({ type: 'png', omitBackground: !a.opaque, clip: { x: 0, y: 0, width: a.px, height: a.px } });
    if (a.opaque) png = rgbaToRgbPng(png);
    mkdirSync(dirname(a.out), { recursive: true });
    writeFileSync(a.out, png);
    console.log(`✓ ${a.out.replace(resolve(APP, '../..') + '/', '')}  ${a.px}×${a.px} ${a.opaque ? 'RGB' : 'RGBA'}`);
  }
  const pi = process.argv.indexOf('--preview');
  if (pi > 0 && process.argv[pi + 1]) {
    await pg.setViewportSize({ width: 1200, height: 800 });
    await pg.setContent(previewHtml(), { waitUntil: 'load' });
    await pg.screenshot({ path: resolve(process.argv[pi + 1]), fullPage: true });
    console.log(`✓ preview → ${process.argv[pi + 1]}`);
  }
} finally {
  await browser.close();
}
