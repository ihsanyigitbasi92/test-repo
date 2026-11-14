// node milestone.js <lang> <w> <h> <out> [eventId]
// Demo profile for the Life Path scene: play (auto, fast life) to age 23, then edit the saved life so the next forced
// card is a real wedding event from the content pack (flag `nisanli` = engaged; due item like the engine's own
// milestone queue), reload, and screenshot the card when its choices are on screen.
const { chromium, serve, newGame, sleep } = require('./lib');
const [lang, W, H, out, eventId = 'nisan_teklif_dugun_taksici_sahit_01'] = process.argv.slice(2);
const port = 9000 + Math.floor(Math.random() * 500);
(async () => {
  const srv = await serve(port); const b = await chromium.launch();
  const { pg } = await newGame(b, { w: +W, h: +H, lang, port });
  await pg.waitForSelector('[data-testid=keep]', { timeout: 20000 });
  if (lang === 'en') await pg.click('[data-testid=lang-en]');
  await sleep(1500);
  await pg.click('[data-testid=fast-life]'); await pg.click('[data-testid=keep]'); await sleep(800);
  await pg.click('[data-testid=speed-fast]').catch(() => {});
  await pg.click('[data-testid=auto-toggle]').catch(() => {});
  const t0 = Date.now();
  while (Date.now() - t0 < 300000) {
    const ids = await pg.$$eval('[data-testid]', (els) => [...new Set(els.map((e) => e.getAttribute('data-testid')))]).catch(() => []);
    if (ids.includes('coach-mark')) await pg.click('[data-testid=coach-mark]', { timeout: 1500 }).catch(() => {});
    if (ids.includes('privacy-card')) await pg.click('[data-testid=consent-decline]', { timeout: 1500 }).catch(() => {});
    if (ids.includes('one-more-year')) await pg.click('[data-testid=one-more-year]', { timeout: 1500 }).catch(() => {});
    const age = +(await pg.$eval('[data-testid=hud-age]', (e) => e.innerText).catch(() => '0')).replace(/\D/g, '');
    if (age >= 23) break;
    await sleep(300);
  }
  await pg.click('[data-testid=auto-toggle]').catch(() => {});
  await pg.click('[data-testid=speed-pause]').catch(() => {});
  await sleep(3000);
  const ctx = pg.context();
  await ctx.addInitScript((id) => {
    try {
      if (!localStorage.getItem('motto.patch')) return;
      localStorage.removeItem('motto.patch');
      const s = JSON.parse(localStorage.getItem('motto.save.v1')); const st = s.life.state;
      if (!st.flags.includes('nisanli')) st.flags.push('nisanli');
      st.flags = st.flags.filter((f) => f !== 'evli');
      st.dueQueue.push({ day: st.calendar.calendarDay, eventId: id, priority: 6, valence: 2, deferredOnce: false, source: 'milestone:dugun' });
      s.speed = 'play'; s.auto = false;
      localStorage.setItem('motto.save.v1', JSON.stringify(s));
      window.__patched = 'age ' + st.calendar.age;
    } catch (e) { window.__patched = 'err ' + e.message; }
  }, eventId);
  const page2 = await ctx.newPage();
  await pg.close(); await sleep(500);
  await page2.evaluate(() => 0).catch(() => {});
  await page2.goto(pg.url ? 'about:blank' : 'about:blank');
  await page2.evaluate(() => localStorage.length).catch(() => {});
  const url = `http://localhost:${port}/`;
  await page2.goto(url); await page2.evaluate(() => { localStorage.setItem('motto.patch', '1'); });
  await page2.reload(); await sleep(5000);
  console.log('patched:', await page2.evaluate(() => window.__patched));
  const pg2 = page2; pg2.errs = [];
  for (let k = 0; k < 120; k++) {
    if (await pg2.$('[data-testid=coach-mark]')) await pg2.click('[data-testid=coach-mark]').catch(() => {});
    for (const sel of ['session-continue', 'one-more-year', 'consent-decline', 'reminder-no', 'offer-decline']) { const el = await pg2.$('[data-testid=' + sel + ']'); if (el) await el.click({ timeout: 1500 }).catch(() => {}); }
    if (k === 6) await pg2.screenshot({ path: out + '.debug.png' });
    const txt = await pg2.innerText('body').catch(() => '');
    if (/Şahidim trafiğe|My witness is stuck/.test(txt)) {
      await sleep(2500); await pg2.screenshot({ path: out }); console.log('shot', out);
      const c0 = await pg2.$('[data-testid^=choice-]'); if (c0) { await c0.click().catch(() => {}); await sleep(3000); await pg2.screenshot({ path: out.replace('.png', '-after.png') }); }
      break;
    }
    const ch = await pg2.$$('[data-testid^=choice-]'); if (ch.length) { await ch[0].click().catch(() => {}); }
    await sleep(500);
  }
  console.log('errs', pg2.errs.slice(0, 3));
  await b.close(); srv.close();
})();
