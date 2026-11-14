/**
 * Day-level content around events: skip-summary lines (03 §2.3.3 / §3.12) and the bundle the engine loads.
 */
import { z } from 'zod';
import { GameEvent } from './refine';
import type { GameEvent as GameEventT } from './event';
import type { Pre } from './pre';

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

const hasEnvelopeOpen = (pre: Pre | undefined): boolean =>
  !!pre && (pre.envelopeOpen === true || (pre.all ?? []).some(hasEnvelopeOpen));

/**
 * Bundle-level reference checks (L03-10, L03-11, chains): every followUp, envelope resolver, chainNext and
 * chain.next node must exist — the engine would otherwise skip the target silently and lose the arc.
 */
function refineRefs(events: readonly GameEventT[], ctx: z.RefinementCtx): void {
  const byId = new Map(events.map((e) => [e.id, e]));
  const nodes = new Set(events.filter((e) => e.chain).map((e) => `${e.chain!.id}\u0000${e.chain!.node}`));
  const add = (path: (string | number)[], message: string) => ctx.addIssue({ code: 'custom', path, message });
  events.forEach((e, i) => {
    e.chain?.next?.forEach((n, k) => {
      if (!nodes.has(`${e.chain!.id}\u0000${n.node}`)) add(['events', i, 'chain', 'next', k, 'node'], `${e.id}: chain ${e.chain!.id} has no node "${n.node}"`);
    });
    for (const [cid, out] of Object.entries(e.outcomes)) {
      (Array.isArray(out) ? out : [out]).forEach((b, bi) => {
        const fx = b.effects;
        if (!fx) return;
        const at = ['events', i, 'outcomes', cid, bi, 'effects'];
        fx.followUp?.forEach((f, k) => { if (!byId.has(f.eventId)) add([...at, 'followUp', k, 'eventId'], `${e.id}: followUp target ${f.eventId} does not exist (L03-10)`); });
        if (fx.envelope) {
          const r = byId.get(fx.envelope.resolverEventId);
          if (!r) add([...at, 'envelope', 'resolverEventId'], `${e.id}: envelope resolver ${fx.envelope.resolverEventId} does not exist (L03-11)`);
          else if (!hasEnvelopeOpen(r.pre)) add([...at, 'envelope', 'resolverEventId'], `${r.id}: envelope resolver pre must contain envelopeOpen:true (L03-11)`);
        }
        if (fx.chainNext !== undefined && (!e.chain || !nodes.has(`${e.chain.id}\u0000${fx.chainNext}`)))
          add([...at, 'chainNext'], `${e.id}: chainNext "${fx.chainNext}" has no node in ${e.chain ? `chain ${e.chain.id}` : 'a chain (event has no chain)'}`);
      });
    }
  });
}

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
  refineRefs(b.events, ctx);
  const docs = b.events.filter((e) => e.type === 'document').length;
  if (docs * 100 > b.events.length * 15 && b.events.length >= 20) ctx.addIssue({ code: 'custom', path: ['events'], message: 'document share must be ≤ 15% (L03-03)' });
});

export type SkipLine = z.infer<typeof SkipLine>;
export type ContentBundle = z.infer<typeof ContentBundle>;
