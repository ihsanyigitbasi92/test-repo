const { chromium } = require('playwright');
const http = require('http'); const fs = require('fs'); const path = require('path');
const root = path.resolve(__dirname, '../../demo/sprint-02');
const types = { '.js': 'application/javascript', '.html': 'text/html', '.json': 'application/json', '.png': 'image/png', '.wav': 'audio/wav', '.ttf': 'font/ttf', '.css': 'text/css' };
function serve(port) {
  return new Promise((res) => {
    const srv = http.createServer((q, r) => {
      let p = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (p.endsWith('/')) p += 'index.html';
      fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); r.end(d); });
    }).listen(port, () => res(srv));
  });
}
async function newGame(b, { w, h, dpr = 3, lang = 'tr', tutorialDone = true, port }) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, locale: lang === 'tr' ? 'tr-TR' : 'en-US', hasTouch: false });
  const pg = await ctx.newPage();
  pg.errs = []; pg.on('pageerror', (e) => pg.errs.push(e.message));
  await pg.addInitScript(({ td }) => {
    try {
      if (!localStorage.getItem('motto.agegate.v1')) localStorage.setItem('motto.agegate.v1', JSON.stringify({ v: 1, answeredAt: Date.now(), band: 'adult' }));
      if (td && !localStorage.getItem('motto.tutorial.v1')) localStorage.setItem('motto.tutorial.v1', JSON.stringify({ v: 1, introDone: true, via: 'skip', hints: ['report', 'choices', 'stats', 'speed', 'meters'] }));
    } catch {}
  }, { td: tutorialDone });
  await pg.goto(`http://localhost:${port}/`);
  return { ctx, pg };
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
module.exports = { chromium, serve, newGame, sleep };
