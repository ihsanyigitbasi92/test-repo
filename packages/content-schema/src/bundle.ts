/**
 * Day-level content around events: skip-summary lines (03 §2.3.3 / §3.12) and the bundle the engine loads.
 */
import { z } from 'zod';
import { GameEvent } from './refine';

const wordCount = (s: string) => s.trim().split(/\s+/).length;

/** One skip-summary line: ≤ 14 words, ≤ 1 number placeholder, no roast, no identity (D-ÖNERİ-03-08). */
export const SkipLine = z.object({
  id: z.string().regex(/^skip_[a-z0-9_]+$/),
  bucket: z.tuple([z.number().int().min(2), z.number().int().min(2)]),
  ctx: z.array(z.string()).min(1),
  number: z.enum(['momCallsSinceLast', 'days', 'spentPara', 'none']).optional(),
  tr: z.string().min(1), en: z.string().min(1),
}).strict().superRefine((l, ctx) => {
  if (wordCount(l.tr) > 14 || wordCount(l.en) > 14) ctx.addIssue({ code: 'custom', path: ['tr'], message: 'skip line ≤ 14 words' });
  if (l.bucket[0] > l.bucket[1]) ctx.addIssue({ code: 'custom', path: ['bucket'], message: 'bucket lo ≤ hi' });
  const digits = (s: string) => (s.replace(/\{n\}|\{days\}/g, '').match(/\d+/g) ?? []).length;
  if (digits(l.tr) > 1 || digits(l.en) > 1) ctx.addIssue({ code: 'custom', path: ['tr'], message: 'at most one literal number' });
});

export const ContentBundle = z.object({
  contentHash: z.string().min(1),
  events: z.array(GameEvent).min(1),
  skipLines: z.array(SkipLine),
}).strict().superRefine((b, ctx) => {
  const ids = new Set<string>();
  for (const [i, e] of b.events.entries()) {
    if (ids.has(e.id)) ctx.addIssue({ code: 'custom', path: ['events', i, 'id'], message: `duplicate event id ${e.id}` });
    ids.add(e.id);
  }
  const docs = b.events.filter((e) => e.type === 'document').length;
  if (docs * 100 > b.events.length * 15 && b.events.length >= 20) ctx.addIssue({ code: 'custom', path: ['events'], message: 'document share must be ≤ 15% (L03-03)' });
});

export type SkipLine = z.infer<typeof SkipLine>;
export type ContentBundle = z.infer<typeof ContentBundle>;
