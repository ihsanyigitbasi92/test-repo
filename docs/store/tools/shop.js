// Shop screenshot as the release build renders it on each platform: the web build's demo-only banner is removed and
// the web store name ("deneme mağazası" / "the demo store") is replaced by the platform name the native build uses
// (src/i18n/shop{Tr,En}.ts › store.ios / store.android). Price = demo fallback price (catalog.ts).
const { chromium, serve, newGame, sleep } = require('./lib');
const runs = [
  ['tr', 440, 956, 'ios', 'raw/tr-69/shop-final.png'], ['en', 440, 956, 'ios', 'raw/en-69/shop-final.png'],
  ['tr', 360, 800, 'android', 'raw/tr-play/shop-final.png'], ['en', 360, 800, 'android', 'raw/en-play/shop-final.png'],
];
const NAME = { tr: { ios: 'App Store', android: 'Google Play', web: 'deneme mağazası' }, en: { ios: 'the App Store', android: 'Google Play', web: 'the demo store' } };
(async () => {
  const srv = await serve(8901); const b = await chromium.launch();
  for (const [lang, w, h, plat, out] of runs) {
    const { ctx, pg } = await newGame(b, { w, h, lang, port: 8901 });
    await pg.waitForSelector('[data-testid=keep]', { timeout: 20000 });
    if (lang === 'en') await pg.click('[data-testid=lang-en]');
    await sleep(1500);
    await pg.click('[data-testid=shop-open]'); await sleep(1800);
    const n = await pg.evaluate(({ from, to }) => {
      const d = document.querySelector('[data-testid=shop-demo]'); if (d) d.style.display = 'none';
      let k = 0; const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const re = new RegExp(from, 'g');
      while (tw.nextNode()) { const t = tw.currentNode; if (re.test(t.nodeValue)) { t.nodeValue = t.nodeValue.replace(re, to); k++; } re.lastIndex = 0; }
      return k;
    }, { from: NAME[lang].web, to: NAME[lang][plat] });
    await sleep(300);
    await pg.screenshot({ path: out }); console.log(out, 'replaced', n);
    await ctx.close();
  }
  await b.close(); srv.close();
})();
