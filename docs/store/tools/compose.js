// node compose.js <plan.json>
// plan: [{ out, w, h, raw, lang, idx, total, head, sub, anchor }]  -> renders a marketing frame at exact pixel size.
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const C = { paper: '#101410', paper2: '#181e18', paper3: '#222a22', ink: '#f1eee2', ink2: '#a8ab9c', line: '#3a4438', lime: '#c9ff3a', limeInk: '#1a2200', note: '#ffe86b', wrong: '#ff4d63' };
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fraunces:ital,opsz,wght@1,9..144,500&family=IBM+Plex+Sans:wght@500;600&display=block" rel="stylesheet">';

function frameHtml(p) {
  const { w, h } = p; const u = w / 1320;                    // unit scale relative to the 6.9" frame
  const shotW = Math.round(w * (p.shotScale || 0.84));
  const img = 'data:image/png;base64,' + fs.readFileSync(p.raw).toString('base64');
  const file = p.lang === 'tr' ? 'DOSYA' : 'FILE';
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${w}px;height:${h}px;overflow:hidden;background:${C.paper}}
  body{position:relative;font-family:'IBM Plex Sans',sans-serif;
    background:
      radial-gradient(ellipse at 20% 0%, rgba(201,255,58,.10), transparent 55%),
      repeating-linear-gradient(0deg, rgba(255,255,255,.018) 0 ${2 * u}px, transparent ${2 * u}px ${74 * u}px),
      ${C.paper};}
  .hd{position:relative;padding:${70 * u}px ${80 * u}px 0}
  .top{display:flex;justify-content:space-between;align-items:center;height:${70 * u}px}
  .label{font-family:'Archivo Black';font-size:${30 * u}px;letter-spacing:${6 * u}px;color:${C.lime}}
  .label b{color:${C.ink2};font-weight:400}
  .stamp{transform:rotate(-7deg);border:${5 * u}px solid ${C.lime};border-radius:${10 * u}px;padding:${6 * u}px ${20 * u}px;
    font-family:'Archivo Black';font-size:${30 * u}px;letter-spacing:${4 * u}px;color:${C.lime};opacity:.92}
  h1{margin-top:${34 * u}px;font-family:'Archivo Black';font-weight:400;color:${C.ink};font-size:${(p.headSize || 96) * u}px;line-height:1.05;letter-spacing:${-0.5 * u}px}
  h1 em{font-style:normal;color:${C.lime}}
  p.sub{margin-top:${26 * u}px;font-family:'Fraunces';font-style:italic;font-weight:500;color:${C.ink2};font-size:${(p.subSize || 54) * u}px;line-height:1.2}
  .rule{margin:${44 * u}px 0 0;border-top:${3 * u}px dashed ${C.line}}
  .shot{margin:${44 * u}px auto 0;width:${shotW}px;border-radius:${56 * u}px;overflow:hidden;
    border:${4 * u}px solid ${C.line};box-shadow:0 ${30 * u}px ${80 * u}px rgba(0,0,0,.55), 0 0 0 ${14 * u}px ${C.paper2}}
  .shot img{display:block;width:100%}
  </style></head><body>
  <div class="hd"><div class="top"><div class="label">MOTTO <b>· ${file} ${String(p.idx).padStart(2, '0')}/${String(p.total).padStart(2, '0')}</b></div>
  <div class="stamp">${p.lang === 'tr' ? 'İŞLENDİ' : 'FILED'}</div></div>
  <h1>${p.head}</h1>
  <p class="sub">${p.sub}</p>
  <div class="rule"></div></div>
  <div class="shot"><img src="${img}"></div>
  </body></html>`;
}

(async () => {
  const plan = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const b = await chromium.launch();
  for (const p of plan) {
    const pg = await b.newPage({ viewport: { width: p.w, height: p.h }, deviceScaleFactor: 1 });
    const html = p.kind === 'raw' ? p.html : frameHtml(p);
    const tmp = path.join(__dirname, 'tmp-frame.html'); fs.writeFileSync(tmp, html);
    await pg.goto('file://' + tmp); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
    fs.mkdirSync(path.dirname(p.out), { recursive: true });
    await pg.screenshot({ path: p.out, clip: { x: 0, y: 0, width: p.w, height: p.h } });
    await pg.close(); console.log('wrote', p.out);
  }
  await b.close();
})();
module.exports = { frameHtml };
