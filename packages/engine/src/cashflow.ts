/**
 * Cash flow (02 §2.3.2–2.3.6, D-067): payday on the 1st, rent on the 5th, cat on the 10th, health cost on the 20th,
 * a daily living cost every calendar day, card-debt growth ×1.18/yr (table), the bankruptcy trigger and the 18–28
 * protection window (damage ×0.5 → ×1.0). Bailouts and İcra/İflas are day cards (02 §2.3.4/§2.3.6), never applied
 * silently inside a gap: this module only raises `bankruptcyPending`; `bankruptcy.ts` queues / applies the card.
 * Walks due dates month by month (O(months) per gap, D-100); all amounts integer Para.
 */
import { TUNING, steppedByAge } from './tuning';
import { absOfISO, civilFromDays, daysFromCivil } from './calendar';
import { debtGrowPpm } from './tables/index';
import { addFlag, clamp, mulDiv } from './util';
import type { FlowKind, GapKind, GapLine, LifeState } from './types';

const E = TUNING.economy;
const DUE_KINDS = ['payday', 'rent', 'cat', 'health'] as const;
type DueKind = (typeof DUE_KINDS)[number];
/** D-088: ≤ 3 flowLog lines — income, rent, and everything else folded into one `daily` total. */
const FLOW_OF: Record<GapKind, FlowKind> = { payday: 'payday', allowance: 'allowance', rent: 'rent', cat: 'daily', health: 'daily', daily: 'daily', debt: 'daily' };
const FLOW_ORDER: readonly FlowKind[] = ['payday', 'allowance', 'rent', 'daily'];
export const BANKRUPTCY_PENDING = 'bankruptcyPending';

/** Protection multiplier in per-mille for negative money/health deltas: 18 → 500 … 28+ → 1000 (02 §2.3.6). */
export function protectionMultPm(age: number): number {
  const p = E.protection;
  if (age >= p.toAge) return 1000;
  return clamp(p.minMultPm + mulDiv(1000 - p.minMultPm, age - p.fromAge, p.toAge - p.fromAge), p.minMultPm, 1000);
}

/** Lifestyle spend share of income (per-mille), read from the dominant pattern (02 §2.3.3). */
export function lifestylePm(st: Pick<LifeState, 'patterns'>): number {
  const p = st.patterns;
  if (p.impulseSpend > 0 && p.impulseSpend >= p.patience) return E.lifestylePm.impulseSpend;
  if (p.patience > p.impulseSpend) return E.lifestylePm.patience;
  return E.lifestylePm.base;
}

export const startAbs = (st: LifeState): number => absOfISO(st.calendar.startDateISO);

/**
 * Single entry point for every money change: tracks income/spend, peak and the debt mirror. Crossing the
 * bankruptcy line only raises the `bankruptcyPending` flag (the reset happens on the İcra day card).
 */
export function moneyDelta(st: LifeState, para: number, log?: Map<GapKind, number>, kind?: GapKind): void {
  st.money.balance += para;
  if (para > 0) st.yearStats.income += para; else st.yearStats.spend -= para;
  if (log && kind) log.set(kind, (log.get(kind) ?? 0) + para);
  if (st.money.balance < E.bankruptcyAtPara) addFlag(st, BANKRUPTCY_PENDING);
  if (st.money.balance > st.counters.peakMoney) st.counters.peakMoney = st.money.balance;
  st.money.debt = st.money.balance < 0 ? -st.money.balance : 0;
}

/** İcra/İflas reset (02 §2.3.4): debt → −6 Birim, Ego −15, Cringe +20, `iflas` flag. Called from the İcra card. */
export function applyBankruptcy(st: LifeState): void {
  const b = E.bankruptcy;
  st.money.balance = E.bankruptcyResetPara;
  st.money.debt = -E.bankruptcyResetPara;
  st.meters.ego = clamp(st.meters.ego + b.egoPoints * 100, 0, 10000);
  st.meters.cringe = clamp(st.meters.cringe + b.cringePoints * 100, 0, 10000);
  addFlag(st, 'iflas');
  const i = st.flags.indexOf(BANKRUPTCY_PENDING);
  if (i >= 0) st.flags.splice(i, 1);
  st.counters.bankruptcies++;
}

function dueDays(fromAbs: number, toAbs: number): { abs: number; kind: DueKind }[] {
  const out: { abs: number; kind: DueKind }[] = [];
  if (toAbs <= fromAbs) return out;
  const a = civilFromDays(fromAbs + 1), b = civilFromDays(toAbs);
  let y = a.y, m = a.m;
  while (y < b.y || (y === b.y && m <= b.m)) {
    for (const kind of DUE_KINDS) {
      const abs = daysFromCivil({ y, m, d: E.due[kind] });
      if (abs > fromAbs && abs <= toAbs) out.push({ abs, kind });
    }
    if (m === 12) { y++; m = 1; } else m++;
  }
  return out.sort((p, q) => p.abs - q.abs || DUE_KINDS.indexOf(p.kind) - DUE_KINDS.indexOf(q.kind));
}

function housingDaily(st: LifeState): number {
  return E.housing[st.status.home.kind].daily;
}

function applyDaily(st: LifeState, days: number, log: Map<GapKind, number>): void {
  if (days <= 0) return;
  const income = st.status.job?.monthly ?? 0;
  const spend = housingDaily(st) * days + mulDiv(income * st.yearStats.lifestylePm, days, 30000);
  if (spend > 0) moneyDelta(st, -spend, log, 'daily');
  if (st.money.balance < 0) {
    const grown = -mulDiv(-st.money.balance, debtGrowPpm(days), 1_000_000);
    if (grown !== st.money.balance) moneyDelta(st, grown - st.money.balance, log, 'debt');
  }
}

/** `lines` is the ≤ 3-line flowLog; `detail` keeps the per-kind breakdown (tests, Roast numbers). */
export interface CashflowResult { lines: GapLine[]; detail: Partial<Record<GapKind, number>>; rentShortfall: boolean }

/**
 * Apply every money movement in the calendar interval (fromDay, toDay] (life-relative days).
 * Used by applyGap for skipped days and for the shown day itself.
 */
export function applyCashflow(st: LifeState, fromDay: number, toDay: number): CashflowResult {
  const base = startAbs(st);
  const log = new Map<GapKind, number>();
  let prev = base + fromDay;
  let rentShortfall = false;
  for (const due of dueDays(base + fromDay, base + toDay)) {
    applyDaily(st, due.abs - prev, log);
    prev = due.abs;
    switch (due.kind) {
      case 'payday':
        if (st.status.job) { moneyDelta(st, st.status.job.monthly, log, 'payday'); st.yearStats.paydays++; }
        else if (st.status.home.kind === 'momsHouse') moneyDelta(st, E.allowanceMomsHouse, log, 'allowance');
        break;
      case 'rent': {
        const rent = st.status.home.rent;
        if (st.money.balance < rent) {
          rentShortfall = true;
          st.yearStats.rentShortfalls++;
          st.hidden.stress = clamp(st.hidden.stress + E.rentStressPoints * 100, 0, 10000);
        }
        moneyDelta(st, -rent, log, 'rent');
        break;
      }
      case 'cat':
        if (st.status.assets.includes('kedi')) moneyDelta(st, -E.catMonthlyPara, log, 'cat');
        break;
      case 'health': {
        const c = steppedByAge(E.healthCostPara, st.calendar.age);
        if (c > 0) moneyDelta(st, -c, log, 'health');
        break;
      }
    }
  }
  applyDaily(st, base + toDay - prev, log);
  const detail: Partial<Record<GapKind, number>> = {};
  const folded = new Map<FlowKind, number>();
  for (const [k, v] of log) { detail[k] = v; folded.set(FLOW_OF[k], (folded.get(FLOW_OF[k]) ?? 0) + v); }
  if (folded.has('payday') && folded.has('allowance')) { folded.set('payday', folded.get('payday')! + folded.get('allowance')!); folded.delete('allowance'); }
  const lines: GapLine[] = [];
  for (const k of FLOW_ORDER) { const v = folded.get(k); if (v) lines.push({ kind: k, para: v }); }
  return { lines, detail, rentShortfall };
}
