/**
 * Player-facing labels for engine ids (playtest 2026-11-12, deneyim #9: "ikinci_el_telefon", "boilerTech" leaked
 * into the HUD and the NEW JOB card). Every id goes through the UI catalog; an id the catalog does not know yet
 * (new content) is humanized — `_` → space, camelCase split, first letter capitalised — so no snake_case /
 * camelCase token ever reaches the screen. Also builds the HUD status strip text (pure, unit-tested in node).
 */
import type { LifeState, Locale } from '@motto/engine';
import type { Strings } from './tr';
import { upper } from './format';
import { JOB_TITLES_EN, enJobFallback } from './jobTitlesEn';

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

/**
 * Job label. With a `tier` (engine `Job.tier`, 1 = entry) the career rank is added from tier 2 on, so a promotion
 * always shows a new title ("TERFİ · Ofis Elemanı · Uzman") even when the job id stays the same (deneyim P1-3).
 * If the engine gives its own display title (`rankTitle` / `titleKey` / `displayTitle`), that wins.
 */
export function jobLabel(s: Strings, locale: Locale, title: string, tier?: number | null, job?: object | null): string {
  const own = engineTitle(job);
  if (own) return s.jobTitle[own] ?? (locale === 'en' ? JOB_TITLES_EN[own] ?? enJobFallback(own) : humanizeId(locale, own));
  // EN never shows a free-text Turkish title (content writes titles in Turkish): table, then a word-map fallback.
  const base = s.jobTitle[title] ?? (locale === 'en' ? JOB_TITLES_EN[title] ?? (/\s|[çğıöşüÇĞİÖŞÜ]/.test(title) ? enJobFallback(title) : humanizeId(locale, title)) : humanizeId(locale, title));
  if (title === 'emekli' || !tier || tier < 2) return base;
  const rank = s.jobRank[Math.min(tier, s.jobRank.length - 1)];
  return rank ? `${base} · ${rank}` : base;
}
const engineTitle = (job: object | null | undefined): string | null => {
  const j = job as { rankTitle?: unknown; titleKey?: unknown; displayTitle?: unknown } | null | undefined;
  for (const v of [j?.rankTitle, j?.displayTitle, j?.titleKey]) if (typeof v === 'string' && v.trim()) return v.trim();
  return null;
};

export type PartnerStage = 'dating' | 'engaged' | 'married';
/**
 * Relationship stage of the current partner: the engine's own field when it has one (`status.partner.stage`),
 * else the life flags (`evli` / `nisanli`). Used for the HUD and for the speaker label of the partner's bubbles
 * (deneyim P0-3: a 45-year marriage must not speak as "SEVGİLİ").
 */
export function partnerStage(view: Pick<LifeState, 'status' | 'flags'>): PartnerStage | null {
  const p = view.status.partner as ({ stage?: unknown } & object) | null;
  if (!p) return null;
  const st = p.stage;
  if (st === 'married' || st === 'evli') return 'married';
  if (st === 'engaged' || st === 'nisanli') return 'engaged';
  if (st === 'dating' || st === 'sevgili') return 'dating';
  return view.flags.includes('evli') ? 'married' : view.flags.includes('nisanli') ? 'engaged' : 'dating';
}

/** Speaker label of a bubble / card header; the partner is EŞ / NİŞANLI (SPOUSE / FIANCÉ(E)) by stage. */
export function speakerLabel(s: Strings, locale: Locale, speaker: string, stage?: PartnerStage | null): string {
  if (speaker === 'partner' && (stage === 'married' || stage === 'engaged')) return s.speakerStage[stage];
  return s.speaker[speaker] ?? upper(locale, humanizeId(locale, speaker));
}

/**
 * The cat is alive right now: the engine's NPC (when it tracks one) is alive and the cat is still among the
 * assets. Used so "cat food included" and cat filler lines stop after the cat's death (deneyim P0-2).
 */
export function catAlive(view: Pick<LifeState, 'npcs' | 'status'>): boolean {
  const npc = view.npcs.find((n) => n.role === 'cat');
  if (npc && (!npc.alive || !npc.exists)) return false;
  return view.status.assets.includes('kedi') || !!npc?.alive;
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
  const stage = partnerStage(view) ?? 'dating';
  const pName = partner ? nameOf(partner) ?? npcName(view, partner.npc) : null;
  const kids = view.npcs.filter((n) => n.role.startsWith('child') && n.exists && n.alive);
  const kidNames = kids.map(nameOf).filter((x): x is string => !!x);
  const kidTxt = !kids.length ? '' : ` · ${kidNames.length ? s.kidNamed(kidNames.join(', ')) : s.kid}`;
  const love = (partner ? s.partner(yrs, stage, pName ?? null) : view.flags.includes('bosandi') ? s.divorced : s.single) + kidTxt;
  // The cat's name is localized (Pamuk / Biscuit). NPCs can die (engine npcLife): a dead cat is remembered, not listed alive.
  const catNpc = view.npcs.find((n) => n.role === 'cat');
  const cat = catNpc?.alive === false ? s.catGone : view.status.assets.includes('kedi') ? s.catName : s.none;
  const own = view.status.assets.filter((a) => a !== 'kedi');
  const shown = own.slice(-HUD_ASSETS).reverse().map((a) => assetLabel(s, locale, a));
  const more = own.length - shown.length;
  const assets = shown.length ? shown.join(' · ') + (more > 0 ? ` +${more}` : '') : null;
  return {
    job: job ? `${jobLabel(s, locale, job.title, job.tier, job)} · ${s.num(job.monthly)}${s.perMonth}` : s.jobless,
    home: homeTxt, love, cat, assets,
  };
}
