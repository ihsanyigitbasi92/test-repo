// node capture.js <lang> <w> <h> <outdir> [maxSec]
// Plays one life in the demo (manual choices, ▶▶, fast life) and saves raw @3x candidate screenshots per scene.
const { chromium, serve, newGame, sleep } = require('./lib');
const fs = require('fs');
const [lang, W, H, out, maxSec = '900'] = process.argv.slice(2);
const w = +W, h = +H; fs.mkdirSync(out, { recursive: true });
const port = 8140 + Math.floor(Math.random() * 500);
const MILE = lang === 'tr' ? /düğün|nişan|evlen|evlilik|bebek|doğum|yüzük|hamile|nikah|teklif et/i : /wedding|engag|propos|baby|married|marry|ring|pregnan|newborn/i;
(async () => {
  const srv = await serve(port); const b = await chromium.launch();
  const counts = {}; const t0 = Date.now();
  const shot = async (pg, scene, max = 3) => {
    counts[scene] = (counts[scene] || 0) + 1; if (counts[scene] > max) return;
    const age = await pg.$eval('[data-testid=hud-age]', (e) => e.innerText).catch(() => 'x');
    const f = `${out}/${scene}-${counts[scene]}-a${age.replace(/\D/g, '') || 'x'}.png`;
    await pg.screenshot({ path: f }); console.log(((Date.now() - t0) / 1000 | 0) + 's', f);
  };
  // 1) tutorial (fresh profile, only the age gate answered)
  {
    const { ctx, pg } = await newGame(b, { w, h, lang, tutorialDone: false, port });
    await pg.waitForSelector('[data-testid=tutorial]', { timeout: 20000 }).catch(() => null);
    if (lang === 'en') { await pg.click('[data-testid=tutorial-lang-en]', { timeout: 3000 }).catch(() => console.log('no tutorial-lang-en')); }
    await sleep(2500);
    await shot(pg, 'tutorial1', 1);
    await pg.click('[data-testid=tutorial-next]').catch(() => {}); await sleep(1500); await shot(pg, 'tutorial2', 1);
    await pg.click('[data-testid=tutorial-next]').catch(() => {}); await sleep(1500); await shot(pg, 'tutorial3', 1);
    await ctx.close();
  }
  // 2) one life
  const { pg } = await newGame(b, { w, h, lang, tutorialDone: true, port });
  await pg.waitForSelector('[data-testid=keep]', { timeout: 20000 });
  if (lang === 'en') { await pg.click('[data-testid=lang-en]', { timeout: 3000 }).catch(() => console.log('no lang-en')); }
  await sleep(3500); await shot(pg, 'file', 1);
  await pg.click('[data-testid=shuffle]').catch(() => {}); await sleep(2500); await shot(pg, 'file', 2);
  await pg.click('[data-testid=fast-life]'); await sleep(300);
  await pg.click('[data-testid=keep]'); await sleep(800);
  await pg.click('[data-testid=speed-fast]', { timeout: 2000 }).catch(() => {});
  let shopDone = false; let lastAge = 18; const hudAges = new Set();
  const c = (sel) => pg.click(sel, { timeout: 2000 }).catch(() => {});
  while ((Date.now() - t0) / 1000 < +maxSec) {
    const ids = await pg.$$eval('[data-testid]', (els) => [...new Set(els.map((e) => e.getAttribute('data-testid')))]).catch(() => []);
    const age = +(await pg.$eval('[data-testid=hud-age]', (e) => e.innerText).catch(() => '0')).replace(/\D/g, '') || lastAge; lastAge = age;
    if (ids.includes('coach-mark')) await c('[data-testid=coach-mark]');
    if (ids.includes('privacy-card')) { await shot(pg, 'privacy', 1); await c('[data-testid=consent-decline]'); continue; }
    if (ids.includes('reminder-ask')) await c('[data-testid=reminder-no]');
    if (ids.includes('rewarded-offer')) { await sleep(700); await shot(pg, 'rewarded', 2); await c('[data-testid=offer-decline]'); }
    if (ids.includes('moment-wagerWin')) { await sleep(500); await shot(pg, 'stamp', 4); await sleep(1500); }
    if (ids.includes('one-more-year')) { await sleep(600); if ([19, 22, 25, 30, 35, 40, 50].includes(age)) await shot(pg, 'report', 8); await c('[data-testid=one-more-year]'); }
    if (ids.includes('roast-report') || ids.includes('death')) { await sleep(1500); await shot(pg, 'death', 6); await sleep(2500); }
    if (ids.includes('new-client')) { await sleep(1500); await shot(pg, 'newclient', 1); console.log('END life'); break; }
    if (!shopDone && age >= 26 && ids.includes('choices')) {
      shopDone = true; await c('[data-testid=shop-open]'); await sleep(1500); await shot(pg, 'shop', 1);
      await pg.evaluate(() => { const s = document.querySelector('[data-testid=shop]'); const sc = s && [...s.querySelectorAll('div')].find((d) => d.scrollHeight > d.clientHeight + 20); if (sc) sc.scrollTop = 99999; });
      await sleep(600); await shot(pg, 'shopbottom', 1); await c('[data-testid=shop-close]'); await sleep(800);
    }
    const choices = await pg.$$('[data-testid^=choice-]');
    if (choices.length) {
      await sleep(900);
      const txt = await pg.$eval('[data-testid=day-card]', (e) => e.innerText).catch(() => '');
      if (ids.includes('wager-slip')) await shot(pg, 'decision', 4);
      if (MILE.test(txt)) await shot(pg, 'milestone', 8);
      for (const a of [27, 33, 38, 45, 55]) if (age >= a && !hudAges.has(a)) { hudAges.add(a); await shot(pg, 'hud', 6); }
      // Prefer the first (usually the "yes / go" option) on milestone cards, otherwise random.
      const pick = MILE.test(txt) ? 0 : Math.floor(Math.random() * choices.length);
      await choices[pick].click({ timeout: 2000 }).catch(() => {});
      await sleep(400);
    }
    await sleep(250);
  }
  console.log('done', JSON.stringify(counts), 'errs', pg.errs.slice(0, 3));
  await b.close(); srv.close();
})();
