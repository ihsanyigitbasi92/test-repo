import json, glob, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), 'screenshots')
CAP = {
 'tr': [
  ('01-nasil-oynanir', 'Zaman <em>akar.</em>', 'Kart gelince durur.'),
  ('02-iddia', 'Koçun sana karşı <em>iddiaya</em> girer.', 'Oran fişte yazar. Zar onun değil.'),
  ('03-damga', 'Yanılırsa damgayı <em>kendi</em> basar.', 'HAKSIZ ÇIKTIM. Nadir olur.'),
  ('04-hayat', 'Gün gün <em>bir hayat.</em>', 'İş, ev, kedi, anne baskısı.'),
  ('05-karne', 'Her yıl bir <em>karne.</em>', 'Ve paylaşılabilir bir Yılın Mottosu.'),
  ('06-hayat-yolu', 'Aşk, nişan, <em>düğün,</em> bebek.', 'Ya da hiçbiri. Kapı senin.'),
  ('07-musteri-dosyasi', 'Yeni müşteri, <em>yeni dosya.</em>', 'Koç not almaya hazır.'),
  ('08-magaza', 'Oyunun ortasında <em>reklam yok.</em>', 'Tek ürün: Reklamsız. Seçenekler satılık değil.'),
 ],
 'en': [
  ('01-how-to-play', 'Time <em>flows.</em>', 'Cards wait for you.'),
  ('02-wager', 'Your coach <em>wagers</em> against you.', "Real odds on the slip. Not the coach's dice."),
  ('03-stamp', 'Wrong? The coach <em>stamps it.</em>', 'I WAS WRONG. Rare, but it happens.'),
  ('04-life', 'A whole life, <em>day by day.</em>', 'Job, home, cat, mom pressure.'),
  ('05-report-card', 'A <em>report card</em> every year.', 'Plus a shareable Motto of the Year.'),
  ('06-life-path', 'Love, rings, <em>wedding,</em> baby.', 'Or none of it. Your door.'),
  ('07-client-file', 'New client, <em>new file.</em>', "The coach's pen is ready."),
  ('08-shop', 'No <em>mid-game</em> ads.', "One product: No Ads. Choices aren't for sale."),
 ]}

OVR = {('en-play', 1): 'dec-1.png', ('en-play', 3): 'hud-2-a33.png', ('en-play', 4): 'report-5-a25.png', ('tr-play', 4): 'report-5-a25.png'}
def pick(d, scene):
    if (d, scene) in OVR: return os.path.join(HERE, 'raw', d, OVR[(d, scene)])
    g = lambda pat: sorted(glob.glob(os.path.join(HERE, 'raw', d, pat)))
    if scene == 0: return g('tutorial1-1-*.png')[0]
    if scene == 1: return g('decision-1-*.png')[0]
    if scene == 2: return g('stamp-1-*.png')[0]
    if scene == 3:
        hs = g('hud-*.png'); ages = [(int(re.search(r'-a(\d+)', h).group(1)), h) for h in hs]
        ok = [a for a in ages if a[0] <= 45] or ages
        return max(ok)[1]
    if scene == 4: return (g('report-7-*.png') or g('report-5-*.png'))[0]
    if scene == 5: return g('wedding-after.png')[0]
    if scene == 6: return g('file-1-*.png')[0]
    if scene == 7: return g('shop-final.png')[0]

SETS = [('ios-6.9', 1320, 2868, '69', {}), ('ios-6.5', 1284, 2778, '69', {}),
        ('play-phone', 1080, 1920, 'play', {'shotScale': 0.70, 'headSize': 92, 'subSize': 50})]
plan = []; picks = {}
for name, w, h, src, extra in SETS:
    for lang in ('tr', 'en'):
        for i, (slug, head, sub) in enumerate(CAP[lang]):
            raw = pick(f'{lang}-{src}', i); picks[f'{name}/{lang}/{slug}'] = os.path.relpath(raw, HERE)
            p = dict(out=f'{OUT}/{name}/{lang}/{i+1:02d}-{slug[3:]}.png', w=w, h=h, raw=raw, lang=lang, idx=i + 1, total=8, head=head, sub=sub)
            p.update(extra); plan.append(p)
json.dump(plan, open(os.path.join(HERE, 'plan-all.json'), 'w'), ensure_ascii=False)
json.dump(picks, open(os.path.join(HERE, 'picks.json'), 'w'), indent=1)
print(len(plan), 'frames')
