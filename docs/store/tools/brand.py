# Renders the provisional icon (512, 1024) and the Play feature graphics (1024x500, TR/EN) via compose.js.
# Needs raw/{tr,en}-69/decision-1-*.png from capture.js. Usage: python3 brand.py && node compose.js plan-brand.json
import base64, glob, json, os
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(os.path.dirname(HERE), 'screenshots')
FONTS = '<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fraunces:ital,opsz,wght@1,9..144,500;1,9..144,600&family=IBM+Plex+Sans:wght@500;600&display=block" rel="stylesheet">'

def icon(s):
    u = s / 1024
    return f'''<!doctype html><meta charset="utf-8">{FONTS}<style>*{{margin:0;padding:0}}html,body{{width:{s}px;height:{s}px;overflow:hidden}}
body{{background:radial-gradient(circle at 30% 20%,#1d261d,#101410 70%);display:flex;align-items:center;justify-content:center}}
.st{{width:{620*u}px;height:{620*u}px;border:{34*u}px solid #c9ff3a;border-radius:{60*u}px;transform:rotate(-8deg);display:flex;align-items:center;justify-content:center;position:relative;box-shadow:inset 0 0 0 {14*u}px #101410, inset 0 0 0 {26*u}px #c9ff3a}}
.m{{font-family:'Archivo Black';font-size:{430*u}px;line-height:1;color:#c9ff3a;margin-top:{20*u}px}}
.pin{{position:absolute;right:{-46*u}px;top:{-46*u}px;width:{92*u}px;height:{92*u}px;border-radius:50%;background:#ff4d63;box-shadow:0 {8*u}px {16*u}px rgba(0,0,0,.5)}}
</style><div class="st"><div class="m">M</div><div class="pin"></div></div>'''

def feature(lang, raw):
    img = 'data:image/png;base64,' + base64.b64encode(open(raw, 'rb').read()).decode()
    t = dict(tr=('Sertifikasız Hayat Koçu', 'Koçun sana karşı iddiaya girer.', 'HAKSIZ ÇIKTIM', 'Gün gün hayat simülasyonu'),
             en=('Uncertified Life Coach', 'Your coach wagers against you.', 'I WAS WRONG', 'Day-by-day life simulator'))[lang]
    return f'''<!doctype html><meta charset="utf-8">{FONTS}<style>*{{margin:0;padding:0;box-sizing:border-box}}html,body{{width:1024px;height:500px;overflow:hidden}}
body{{background:radial-gradient(ellipse at 15% 10%,rgba(201,255,58,.13),transparent 55%),repeating-linear-gradient(0deg,rgba(255,255,255,.02) 0 2px,transparent 2px 46px),#101410;position:relative;font-family:'IBM Plex Sans'}}
.l{{position:absolute;left:56px;top:70px;width:560px}}
.brand{{font-family:'Archivo Black';font-size:104px;letter-spacing:6px;color:#c9ff3a;line-height:1}}
.sub{{font-family:'Archivo Black';font-size:27px;letter-spacing:3px;color:#f1eee2;margin-top:10px;text-transform:uppercase}}
.tag{{font-family:'Fraunces';font-style:italic;font-weight:500;font-size:38px;color:#f1eee2;margin-top:44px;line-height:1.15}}
.kick{{font-size:20px;color:#a8ab9c;margin-top:16px;letter-spacing:.5px}}
.stamp{{position:absolute;left:380px;top:330px;transform:rotate(-9deg);border:6px solid #ff4d63;border-radius:10px;padding:8px 18px;font-family:'Archivo Black';font-size:34px;letter-spacing:3px;color:#ff4d63;background:rgba(16,20,16,.6)}}
.ph{{position:absolute;right:56px;top:40px;width:300px;height:600px;border-radius:34px;overflow:hidden;border:3px solid #3a4438;box-shadow:0 0 0 10px #181e18,0 30px 60px rgba(0,0,0,.6);transform:rotate(4deg)}}
.ph img{{width:100%;display:block;margin-top:-150px}}
</style><div class="l"><div class="brand">MOTTO</div><div class="sub">{t[0]}</div><div class="tag">{t[1]}</div><div class="kick">{t[3]}</div></div>
<div class="ph"><img src="{img}"></div><div class="stamp">{t[2]}</div>'''

raw = lambda l: sorted(glob.glob(os.path.join(HERE, 'raw', f'{l}-69', 'decision-1-*.png')))[0]
plan = [{"kind": "raw", "w": 512, "h": 512, "html": icon(512), "out": f"{OUT}/icon-512.png"},
        {"kind": "raw", "w": 1024, "h": 1024, "html": icon(1024), "out": f"{OUT}/icon-1024.png"},
        {"kind": "raw", "w": 1024, "h": 500, "html": feature('tr', raw('tr')), "out": f"{OUT}/play-feature-graphic-tr.png"},
        {"kind": "raw", "w": 1024, "h": 500, "html": feature('en', raw('en')), "out": f"{OUT}/play-feature-graphic-en.png"}]
json.dump(plan, open(os.path.join(HERE, 'plan-brand.json'), 'w'))
