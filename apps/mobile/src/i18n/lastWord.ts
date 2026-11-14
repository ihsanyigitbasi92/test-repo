/**
 * Koçun Son Sözü (sprint 3, content: docs/content/sprint3/lastword-variants.json — copied here; keep in sync).
 * Pick: the first `byFact` condition that holds for the life (rows in file order, most specific first; a variant of
 * that condition by seed), else a variant of the dominant positive pattern, else the no-pattern line (cat split).
 * Params: {k} count, {p} pattern label, {y} years, {age} age. Pure, tested in test/sprint3.test.ts.
 */
import type { Locale } from '@motto/engine';

export interface LifeFacts { age: number; marriedYears: number | null; hasChild: boolean; hasGrandchild: boolean; catYears: number | null; catAlive: boolean; momAlive: boolean; momOutlivedAge: number | null; alone: boolean; ownedHome: boolean }
type Line = { tr: string; en: string };
export const BY_PATTERN: Record<string, Line[]> = {
  "patience": [
    {
      "tr": "{k} kez sabır. Acele edenler önden gitti; sen manzarayı gördün.",
      "en": "Patience, {k} times. The hurried went ahead. You saw the view."
    },
    {
      "tr": "{k} kez bekledin. Bekleme salonlarının en iyi müşterisi.",
      "en": "You waited {k} times. Best customer of every waiting room."
    },
    {
      "tr": "Sabır: {k}. Flipchart'a yazmazdım. Sen yaşadın.",
      "en": "Patience: {k}. I wouldn't put it on a flip chart. You lived it."
    }
  ],
  "generosity": [
    {
      "tr": "{k} kez verdin. Hesap tutmadın; ben tuttum.",
      "en": "You gave {k} times. You didn't keep count. I did."
    },
    {
      "tr": "Cömertlik: {k}. Seminerde buna gider kalemi derdik. Sen başka bir şey dedin.",
      "en": "Generosity: {k}. At the seminars we called that an expense line. You called it something else."
    },
    {
      "tr": "{k} kez paylaştın. Masada hep bir sandalye fazla vardı.",
      "en": "You shared {k} times. There was always an extra chair at your table."
    }
  ],
  "selfCare": [
    {
      "tr": "{k} kez kendine baktın. Az değil. Ben de bakardım.",
      "en": "You looked after yourself {k} times. Not nothing. I would have too."
    },
    {
      "tr": "Kendine iyi bakmak: {k}. Dosyada en kısa satır, en uzun etki.",
      "en": "Self-care: {k}. Shortest line in the file, longest effect."
    },
    {
      "tr": "{k} kez dur dedin. Durmak da bir hareket.",
      "en": "You stopped {k} times. Stopping is a move too."
    }
  ]
};
export const BY_FACT: { when: string; tr: string; en: string }[] = [
  {
    "when": "marriedYears>=30",
    "tr": "{y} yıl aynı sofra. Kimseye söyleme ama iyiydi.",
    "en": "{y} years at the same table. Don't tell anyone, but it was good."
  },
  {
    "when": "marriedYears>=30",
    "tr": "{y} yıl evlilik. Tartışmaların çoğunu kaybettin. İyi ki.",
    "en": "{y} years married. You lost most of the arguments. Good."
  },
  {
    "when": "marriedYears>=10",
    "tr": "Eşin {y} yıl yanındaydı. Ben dosyadaydım. O daha yakındı.",
    "en": "Your spouse was there {y} years. I was in the file. They were closer."
  },
  {
    "when": "hasGrandchild",
    "tr": "Bir torun. Senin ninnini o şimdi yanlış söylüyor.",
    "en": "One grandchild. They sing your lullaby wrong now."
  },
  {
    "when": "hasGrandchild",
    "tr": "Torunun telsizden horlamanı dinledi. Seni öyle hatırlayacak.",
    "en": "Your grandkid heard you snore over the baby monitor. That's how they'll remember you."
  },
  {
    "when": "hasChild",
    "tr": "Bir çocuk büyüttün. Gerisi dipnot.",
    "en": "You raised a child. The rest is footnotes."
  },
  {
    "when": "hasChild",
    "tr": "Çocuğun seni aradığında hava durumunu sordu. Cevabı biliyordu.",
    "en": "When your kid called, they asked about the weather. They knew the answer."
  },
  {
    "when": "catYears>=15",
    "tr": "Pamuk {y} yıl seninleydi. Sayılır. Sayılır.",
    "en": "Biscuit stayed {y} years. That counts. That counts."
  },
  {
    "when": "catAlive",
    "tr": "Pamuk hâlâ kapının önünde. Kimse ona söylemesin.",
    "en": "Biscuit is still at the door. Nobody tell her."
  },
  {
    "when": "momOutlived",
    "tr": "Annen {age} yaşına kadar senin için aradı. Şimdi telefon sessiz. Yorum yok.",
    "en": "Your mom called until she was {age}. The phone is quiet now. No comment."
  },
  {
    "when": "momAlive",
    "tr": "Annen bunu duyunca 'ben demiştim' diyecek. Ne dediğini kimse hatırlamıyor.",
    "en": "When your mom hears, she'll say 'I told you.' Nobody remembers what she told."
  },
  {
    "when": "alone",
    "tr": "Yalnız yaşadın, kalabalık öldün: komşu, kapıcı, fırıncı. Sayım tamam.",
    "en": "You lived alone and left with a crowd: neighbor, super, baker. Headcount complete."
  },
  {
    "when": "ownedHome",
    "tr": "Bir kapın vardı, anahtarı sendeydi. Az insanda olur.",
    "en": "You had a door and the key to it. Not everyone does."
  },
  {
    "when": "age>=90",
    "tr": "{age}. Herkes yavaş konuşuyordu. Sen dinledin.",
    "en": "{age}. Everyone talked slowly. You listened."
  },
  {
    "when": "age<50",
    "tr": "Kısa dosya. İyi yazılmış.",
    "en": "Short file. Well written."
  }
];
export const NO_LAST_WORD = {
  "catAlive": {
    "tr": "Son söz: dosyada iyi bir şey aradım. Pamuk seni sevdi. Bu sayılır.",
    "en": "Last word: I looked for something good in the file. Biscuit liked you. That counts."
  },
  "default": {
    "tr": "Son söz: dosyada iyi bir şey aradım. Sabah kalktın, her sabah. Bu sayılır.",
    "en": "Last word: I looked for something good in the file. You got up every morning. That counts."
  }
};

function holds(when: string, f: LifeFacts): { ok: boolean; y?: number; age?: number } {
  const m = /^(\w+)(>=|<)(\d+)$/.exec(when);
  if (m) {
    const [, key, op, nStr] = m; const n = Number(nStr);
    const v = key === 'age' ? f.age : key === 'marriedYears' ? f.marriedYears : key === 'catYears' ? f.catYears : null;
    if (v === null || v === undefined) return { ok: false };
    return { ok: op === '>=' ? v >= n : v < n, y: v, age: f.age };
  }
  switch (when) {
    case 'hasChild': return { ok: f.hasChild };
    case 'hasGrandchild': return { ok: f.hasGrandchild };
    case 'catAlive': return { ok: f.catAlive };
    case 'momAlive': return { ok: f.momAlive };
    case 'momOutlived': return { ok: f.momOutlivedAge !== null, age: f.momOutlivedAge ?? undefined };
    case 'alone': return { ok: f.alone };
    case 'ownedHome': return { ok: f.ownedHome };
    default: return { ok: false };
  }
}

const fill = (t: string, p: Record<string, string | number | undefined>): string => t.replace(/\{(\w+)\}/g, (_, k: string) => String(p[k] ?? ''));

/** The coach's last word for a finished life. `seed`: any stable number (life seed hash) to vary the pick. */
export function lastWordText(locale: Locale, f: LifeFacts | null, lw: { pattern: string; count: number } | null, patternLabel: string, seed: number): string {
  if (f) {
    for (const row of BY_FACT) {
      const h = holds(row.when, f);
      if (!h.ok) continue;
      const group = BY_FACT.filter((r) => r.when === row.when);
      const pick = group[Math.abs(seed) % group.length]!;
      return fill(pick[locale], { y: h.y, age: h.age ?? f.age, k: lw?.count, p: patternLabel });
    }
  }
  const pool = lw ? BY_PATTERN[lw.pattern] : undefined;
  if (lw && pool?.length) return fill(pool[Math.abs(seed) % pool.length]![locale], { k: lw.count, p: patternLabel });
  return (f?.catAlive ? NO_LAST_WORD.catAlive : NO_LAST_WORD.default)[locale];
}
