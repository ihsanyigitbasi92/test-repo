/**
 * Player-facing labels for engine ids (playtest 2026-11-12, deneyim #9: "ikinci_el_telefon", "boilerTech" leaked
 * into the HUD and the NEW JOB card). Every id goes through the UI catalog; an id the catalog does not know yet
 * (new content) is humanized — `_` → space, camelCase split, first letter capitalised — so no snake_case /
 * camelCase token ever reaches the screen. Also builds the HUD status strip text (pure, unit-tested in node).
 */
import type { LifeState, Locale } from '@motto/engine';
import type { Strings } from './tr';
import { upper } from './format';

/** A raw id / token shape the UI must never render. */
export const RAW_ID = /[a-z]+_[a-z]+|[a-z][A-Z]/;

const capFirst = (locale: Locale, x: string): string => (x ? upper(locale, x.charAt(0)) + x.slice(1) : x);

/** "ikinci_el_telefon" → "İkinci el telefon", "boilerTech" → "Boiler tech", "kıdemli uzman" → "Kıdemli uzman". */
export function humanizeId(locale: Locale, id: string): string {
  const txt = id
    .replace(/^[a-z]+:/, '')                                                      // "npc:boilerTech" → "boilerTech"
    .replace(/[_]+/g, ' ')
    .replace(/([a-zçğıöşü0-9])([A-ZÇĞİÖŞÜ])/g, (_, a: string, b: string) => `${a} ${b.toLowerCase()}`)
    .replace(/\s+/g, ' ')
    .trim();
  return capFirst(locale, txt);
}

export function assetLabel(s: Strings, locale: Locale, id: string): string {
  return capFirst(locale, s.asset[id] ?? humanizeId(locale, id));
}

export function jobLabel(s: Strings, locale: Locale, title: string): string {
  return s.jobTitle[title] ?? humanizeId(locale, title);
}

/** The engine's display name of an NPC by role, when it has one (older engines: none → null). */
export function npcName(view: LifeState, role: string): string | null {
  return nameOf(view.npcs.find((x) => x.role === role));
}
const nameOf = (n: object | undefined): string | null => {
  const v = (n as { name?: unknown } | undefined)?.name;
  return typeof v === 'string' && v.trim() ? v.trim() : null;
};

/** Assets shown in the HUD "Stuff" cell: the most recent ones (the engine appends), the rest as "+N". */
export const HUD_ASSETS = 3;

export interface StatusStrip { job: string; home: string; love: string; cat: string; assets: string | null }

/** D-067 status strip text: job · home · love (partner / spouse / child names when the engine has them) · cat · assets. */
export function statusStrip(s: Strings, locale: Locale, view: LifeState): StatusStrip {
  const job = view.status.job;
  const home = view.status.home;
  const homeTxt = home.kind === 'momsHouse' ? s.home.momsHouse : home.kind === 'owned' ? s.home.owned : s.home[home.kind](home.rent);
  const partner = view.status.partner;
  const yrs = partner ? Math.max(0, Math.floor((view.calendar.calendarDay - partner.since) / 365)) : 0;
  const stage = view.flags.includes('evli') ? 'married' : view.flags.includes('nisanli') ? 'engaged' : 'dating';
  const pName = partner ? nameOf(partner) ?? npcName(view, partner.npc) : null;
  const kids = view.npcs.filter((n) => n.role.startsWith('child') && n.exists && n.alive);
  const kidNames = kids.map(nameOf).filter((x): x is string => !!x);
  const kidTxt = !kids.length ? '' : ` · ${kidNames.length ? s.kidNamed(kidNames.join(', ')) : s.kid}`;
  const love = (partner ? s.partner(yrs, stage, pName ?? null) : view.flags.includes('bosandi') ? s.divorced : s.single) + kidTxt;
  const catAlive = view.npcs.find((n) => n.role === 'cat')?.alive !== false;
  const cat = view.status.assets.includes('kedi') && catAlive ? s.catName : s.none;          // the cat's name is localized (Pamuk / Biscuit)
  const own = view.status.assets.filter((a) => a !== 'kedi');
  const shown = own.slice(-HUD_ASSETS).reverse().map((a) => assetLabel(s, locale, a));
  const more = own.length - shown.length;
  const assets = shown.length ? shown.join(' · ') + (more > 0 ? ` +${more}` : '') : null;
  return {
    job: job ? `${jobLabel(s, locale, job.title)} · ${s.num(job.monthly)}${s.perMonth}` : s.jobless,
    home: homeTxt, love, cat, assets,
  };
}
