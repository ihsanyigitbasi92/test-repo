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
export { drawYearBudget, drawGap, pickDay, skipSummary } from './director';
export { salience, eligible, targetIntensityPm } from './salience';
export { effectivePBp, screenWager } from './wager';
export { applyCashflow, protectionMultPm } from './cashflow';
export { hazardPpm } from './hazard';
export { buildReportCard, buildRoast, gradeForDelta, gradeForMoney, gradeForCourage, gradeForSpectacle } from './report';
export type { RoastReport } from './report';
export { indexContent } from './content';
export * as tables from './tables/index';
