/** A draft legal text per language. Markup: `# ` title, `## ` heading, `- ` bullet, blank line = paragraph break. */
export interface LegalText { tr: string; en: string }
/** Shown on top of every legal screen and checked by test/legal.test.ts. */
export const DRAFT_TAG = { tr: 'TASLAK — avukat onayı bekliyor', en: 'DRAFT — awaiting lawyer review' } as const;
