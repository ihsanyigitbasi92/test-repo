// node decision.js <lang> <w> <h> <outPrefix> — first 3 wager cards of a fresh life, fully rendered.
const { chromium, serve, newGame, sleep } = require('./lib');
const [lang, W, H, out] = process.argv.slice(2);
(async () => {
  const srv = await serve(9601); const b = await chromium.launch();
  const { pg } = await newGame(b, { w: +W, h: +H, lang, port: 9601 });
  await pg.waitForSelector('[data-testid=keep]', { timeout: 20000 });
  if (lang === 'en') await pg.click('[data-testid=lang-en]');
  await sleep(1500); await pg.click('[data-testid=keep]'); await sleep(800);
  let n = 0; const t0 = Date.now();
  while (n < 3 && Date.now() - t0 < 200000) {
    if (await pg.$('[data-testid=coach-mark]')) await pg.click('[data-testid=coach-mark]').catch(() => {});
    const ch = await pg.$$('[data-testid^=choice-]');
    if (ch.length) {
      await sleep(1800);
      if (await pg.$('[data-testid=wager-slip]')) { n++; await pg.screenshot({ path: `${out}-${n}.png` }); console.log('shot', n); }
      const c = await pg.$$('[data-testid^=choice-]'); if (c.length) await c[c.length - 1].click().catch(() => {});
      await sleep(1500);
    }
    await sleep(300);
  }
  await b.close(); srv.close();
})();
