/**
 * textlint — CLI: `pnpm --filter @motto/content-schema textlint [dir-or-file...] [--warn] [--report <file>] [--rule <id>]`
 * Text lints over every `tr` / `en` string of every event under fixtures/** (rules: scripts/textlint-rules.ts):
 *   raw-id · tr-suffix · en-tr-name · typo  — severities in SEVERITY below (error → exit 1, warn → reported).
 *   persona (info) — share of coach lines with a Motto persona marker, and over-used persona phrasings.
 * Lists: scripts/lint/{tr-names,tr-words,en-keep,typos}.txt.
 */
import { writeFileSync } from 'node:fs';
import { FIXTURES, loadRawEvents, localeStrings, parseArgs, rel } from './lib';
import {
  buildNameMatcher, enTrNameHits, harvestTrNames, isPersona, loadLists, rawIdHits, trSuffixHits, typoHits,
  type RuleId, type TextHit,
} from './textlint-rules';

/** Rules start as warnings; a rule becomes an error once the pool is clean for it (see git history). */
export const SEVERITY: Record<RuleId, 'error' | 'warn'> = {
  'raw-id': 'warn',
  'tr-suffix': 'warn',
  'en-tr-name': 'warn',
  'typo': 'warn',
};

/** A persona phrasing (first 4 folded words of the TR line) may repeat at most this often in the pool. */
const PERSONA_REPEAT_MAX = 4;

function main(argv: string[]): number {
  const { pos, opt } = parseArgs(argv, ['report', 'rule']);
  const only = typeof opt.rule === 'string' ? opt.rule : undefined;
  const events = loadRawEvents(pos.length ? pos : [FIXTURES]);
  const lists = loadLists();

  const trNames = new Set(lists.names);
  for (const { raw } of events) for (const s of localeStrings(raw)) if (s.locale === 'tr') for (const n of harvestTrNames(s.text)) trNames.add(n);
  const matcher = buildNameMatcher(trNames, lists.words);

  const hits: (TextHit & { file: string; path: string; locale: string; text: string })[] = [];
  let strings = 0, coach = 0, persona = 0;
  const phrasing = new Map<string, number>();
  for (const { file, raw } of events) {
    const keep = lists.keep.get(String(raw?.id)) ?? new Set<string>();
    const localeOnly = raw?.universality === 'localeOnly';
    for (const s of localeStrings(raw)) {
      strings++;
      const found: TextHit[] = [...rawIdHits(s.text)];
      if (s.locale === 'tr') found.push(...trSuffixHits(s.text));
      if (s.locale === 'en' && !localeOnly) found.push(...enTrNameHits(s.text, matcher, keep));
      found.push(...typoHits(s.text, s.locale, lists.typos));
      for (const h of found) if (!only || h.rule === only) hits.push({ ...h, file, path: s.path, locale: s.locale, text: s.text });
    }
    for (const o of Object.values(raw?.outcomes ?? {}) as any[]) for (const b of Array.isArray(o) ? o : [o]) for (const c of b?.coach ?? []) {
      coach++;
      if (isPersona(String(c.tr ?? ''), String(c.en ?? ''))) {
        persona++;
        const key = String(c.tr).toLocaleLowerCase('tr-TR').replace(/[^\p{L}\s]/gu, '').split(/\s+/).slice(0, 4).join(' ');
        phrasing.set(key, (phrasing.get(key) ?? 0) + 1);
      }
    }
  }

  const errors = hits.filter((h) => SEVERITY[h.rule] === 'error');
  const warns = hits.filter((h) => SEVERITY[h.rule] === 'warn');
  const out: string[] = [];
  const fmt = (h: (typeof hits)[number]): string => `  ${SEVERITY[h.rule] === 'error' ? '✗' : '!'} ${rel(h.file)} ${h.path} [${h.rule}] «${h.match}» ${h.message}\n      ${h.locale}: ${h.text}`;
  if (errors.length) { out.push(`METİN HATASI — ${errors.length}:`); out.push(...errors.map(fmt)); }
  if (warns.length && (opt.warn || only)) { out.push(`Uyarı — ${warns.length}:`); out.push(...warns.map(fmt)); }
  const overused = [...phrasing].filter(([, n]) => n > PERSONA_REPEAT_MAX).sort((a, b) => b[1] - a[1]);
  if (overused.length && opt.warn) { out.push(`Persona kalıbı > ${PERSONA_REPEAT_MAX} kez (bilgi):`); out.push(...overused.slice(0, 20).map(([k, n]) => `  · ${n}× "${k}…"`)); }
  const byRule = new Map<string, number>();
  for (const h of hits) byRule.set(h.rule, (byRule.get(h.rule) ?? 0) + 1);
  out.push(`${events.length} olay, ${strings} metin → ${errors.length} hata, ${warns.length} uyarı` +
    (byRule.size ? ` (${[...byRule].map(([k, v]) => `${k}: ${v}`).join(', ')})` : '') +
    ` · persona: ${persona}/${coach} koç satırı (%${coach ? ((persona * 100) / coach).toFixed(1) : '0'})` +
    (overused.length ? `, ${overused.length} kalıp > ${PERSONA_REPEAT_MAX}×` : ''));
  const report = out.join('\n');
  (errors.length ? console.error : console.log)(report);
  if (typeof opt.report === 'string') { writeFileSync(opt.report, report + '\n'); console.log(`→ ${opt.report}`); }
  return errors.length ? 1 : 0;
}

process.exit(main(process.argv.slice(2)));
