/** In-app legal texts (drafts). Links point here until real URLs exist (docs/design/14 §5, 15 §5, 17 §9). */
import type { LegalDoc } from './store';
import type { LegalText } from './types';
import { NOTICE } from './notice';
import { PRIVACY } from './privacy';
import { TERMS } from './terms';
import { LICENSES } from './licenses';

/** The legal drafts (all carry DRAFT_TAG). */
export type LegalDraft = Exclude<LegalDoc, 'licenses'>;
export const LEGAL_TEXTS: Record<LegalDraft, LegalText> = { notice: NOTICE, privacy: PRIVACY, terms: TERMS };
/** Every text the legal screen can show: the drafts + the font licences (no draft tag). */
export const ALL_LEGAL_TEXTS: Record<LegalDoc, LegalText> = { ...LEGAL_TEXTS, licenses: LICENSES };
export { LICENSES, OFL_1_1 } from './licenses';
export { DRAFT_TAG } from './types';
export type { LegalText } from './types';

export type LegalBlock = { k: 'title' | 'h' | 'p' | 'li'; text: string };
/** Tiny markdown-ish parser: `# ` title, `## ` heading, `- ` bullet, other lines = paragraph. */
export function parseLegal(src: string): LegalBlock[] {
  const out: LegalBlock[] = [];
  for (const raw of src.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('## ')) out.push({ k: 'h', text: line.slice(3) });
    else if (line.startsWith('# ')) out.push({ k: 'title', text: line.slice(2) });
    else if (line.startsWith('- ')) out.push({ k: 'li', text: line.slice(2) });
    else out.push({ k: 'p', text: line });
  }
  return out;
}
