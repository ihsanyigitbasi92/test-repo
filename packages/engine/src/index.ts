/**
 * @motto/engine — pure TypeScript life engine (10 §2.3). Zero React Native deps; integer-only (D-098).
 * Entry point: `step(state, meta, action, content)`.
 */
export const ENGINE_VERSION = '0.1.0';

export * from './rng';
export * from './types';
export { TUNING, bandFor, steppedByAge } from './tuning';
export type { Tuning, BandDef } from './tuning';
export { step, applyAction, hashState } from './step';
export { createLife, emptyMeta, freshYearStats } from './life';
export { drawYearBudget, drawGap, pickDay, skipSummary, dailyRng } from './director';
export { salience, eligible, requiredSpeakers, targetIntensityPm } from './salience';
export { evalPre } from './pre';
export { openEnvelope, applyEffects } from './apply';
export { bailoutCheck } from './bailout';
export { buildEventCard, textParams } from './card';
export { effectivePBp, screenWager } from './wager';
export { applyCashflow, applyBankruptcy, protectionMultPm, BANKRUPTCY_PENDING } from './cashflow';
export type { CashflowResult } from './cashflow';
export { hazardPpm } from './hazard';
export { buildReportCard, buildRoast, gradeForDelta, gradeForMoney, gradeForCourage, gradeForSpectacle } from './report';
export type { RoastReport } from './report';
export { indexContent, resolveText, renderText, fillParams, SYSTEM_TEXT } from './content';
export * as tables from './tables/index';
