/**
 * Which in-app legal text is open (pure TS external store; <LegalHost/> in LifeScreen renders it above everything,
 * consent cards included). Legal links never leave the app while the texts are drafts (UX B-2: no example.com).
 */
export type LegalDoc = 'notice' | 'privacy' | 'terms';
let open: LegalDoc | null = null;
const listeners = new Set<() => void>();
export const subscribeLegal = (l: () => void): (() => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export const getLegal = (): LegalDoc | null => open;
export function openLegal(doc: LegalDoc): void { open = doc; for (const l of [...listeners]) l(); }
export function closeLegal(): void { open = null; for (const l of [...listeners]) l(); }
