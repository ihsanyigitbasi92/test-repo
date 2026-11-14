/**
 * Read-only views of the status strip for the app and the engine (denge sprinti 3, P0 consistency):
 * partner stage (speaker label SEVGİLİ / NİŞANLI / EŞ), job rank (title ladder), retirement, the housing flow kind
 * and whether the player's cat is alive (the app's "Mama dahil"). Pure functions of LifeState, no RNG.
 */
import { TUNING } from './tuning';
import type { FlowKind, Job, LifeState } from './types';

export type PartnerStage = 'sevgili' | 'nisanli' | 'evli';

/** Current relationship stage, or null without a partner. `evli` wins over `nisanli`. */
export function partnerStage(st: Pick<LifeState, 'status' | 'flags'>): PartnerStage | null {
  if (!st.status.partner) return null;
  if (st.flags.includes('evli')) return 'evli';
  if (st.flags.includes('nisanli')) return 'nisanli';
  return 'sevgili';
}

export const RETIRED_TITLE = 'emekli';
export const isRetired = (job: Job | null | undefined): boolean => job?.title === RETIRED_TITLE;
/** Working (a job that is not the pension). */
export const isEmployed = (st: Pick<LifeState, 'status'>): boolean => !!st.status.job && !isRetired(st.status.job);

/**
 * Title-ladder key of a job tier (tuning economy.careerLadder.ranks): '' for none / retired, else
 * stajyer · uzman · kidemli · sef · mudur · direktor. The app renders it before the job title ("Kıdemli Muhasebeci").
 */
export function jobRank(job: Job | null | undefined): string {
  if (!job || isRetired(job)) return '';
  const r = TUNING.economy.careerLadder.ranks;
  return r[Math.max(0, Math.min(r.length - 1, job.tier))] ?? '';
}

/** The player's cat is alive (a new cat counts). The app shows "Mama dahil" / cat filler only then. */
export function catAlive(st: Pick<LifeState, 'npcs' | 'status'>): boolean {
  const n = st.npcs.find((x) => x.role === 'cat');
  return !!n && n.exists && n.alive && st.status.assets.includes('kedi');
}

const RENTED: readonly string[] = TUNING.economy.flowKind.rented;
/** Flow kind of the monthly housing payment for the current home (sprint 3 P0-1). */
export function housingFlowKind(st: Pick<LifeState, 'status' | 'npcs'>): FlowKind {
  const k = st.status.home.kind;
  if (k === 'mortgage') return 'mortgage';
  if (k === 'momsHouse') return st.npcs.some((n) => n.role === 'mom' && n.alive) ? 'rent' : 'upkeep';
  return RENTED.includes(k) ? 'rent' : 'upkeep';
}
