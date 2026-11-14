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
import { housingFlowKind, isRetired } from './status';
import type { FlowKind, GapKind, GapLine, LifeState } from './types';

const E = TUNING.economy;
const DUE_KINDS = ['payday', 'rent', 'cat', 'health'] as const;
type DueKind = (typeof DUE_KINDS)[number];
/** D-088: ≤ 3 flowLog lines — income, the housing payment, and everything else folded into one `daily` total. */
const FLOW_OF: Record<GapKind, FlowKind> = {
  payday: 'payday', pension: 'pension', allowance: 'allowance', rent: 'rent', upkeep: 'upkeep', mortgage: 'mortgage',
  cat: 'daily', child: 'daily', health: 'daily', daily: 'daily', comfort: 'daily', debt: 'daily',
};
const FLOW_ORDER: readonly FlowKind[] = ['payday', 'pension', 'allowance', 'rent', 'upkeep', 'mortgage', 'daily'];
export const BANKRUPTCY_PENDING = 'bankruptcyPending';

/** Protection multiplier in per-mille for negative money/health deltas: 18 → 500 … 28+ → 1000 (02 §2.3.6). */
export function protectionMultPm(age: number): number {
  const p = E.protection;
  if (age >= p.toAge) return 1000;
  return clamp(p.minMultPm + mulDiv(1000 - p.minMultPm, age - p.fromAge, p.toAge - p.fromAge), p.minMultPm, 1000);
}

/**
 * Lifestyle spend share of income (per-mille, 02 §2.3.3): sprint 3 lifestyle creep — the share grows with the job
 * tier (economy.lifestyle.byTierPm), shifted by the dominant spending pattern.
 */
export function lifestylePm(st: Pick<LifeState, 'patterns'> & Partial<Pick<LifeState, 'status'>>): number {
  const L = E.lifestyle, p = st.patterns;
  const job = st.status?.job;
  if (job && isRetired(job)) return L.retiredPm;                  // a pension household spends a flat share
  const tier = job ? job.tier : 0;
  let pm = L.byTierPm[Math.max(0, Math.min(L.byTierPm.length - 1, tier))]!;
  if (p.impulseSpend > 0 && p.impulseSpend >= p.patience) pm += L.impulseSpendPm;
  else if (p.patience > p.impulseSpend) pm += L.patiencePm;
  return Math.max(0, pm);
}

/** Monthly income the cost model scales with: salary or pension (0 without either). */
const monthlyIncome = (st: LifeState): number => st.status.job?.monthly ?? 0;

/** Child cost per month (economy.child): a living child younger than untilAge. */
function childMonthly(st: LifeState): number {
  const C = E.child;
  const kid = st.npcs.find((n) => n.role === 'child');
  if (!kid || !kid.exists || !kid.alive || kid.bornDay === undefined) return 0;
  if (Math.floor((st.calendar.calendarDay - kid.bornDay) / 365) >= C.untilAge) return 0;
  return Math.max(C.minPara, mulDiv(monthlyIncome(st), C.pm, 1000));
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
  if (st.money.balance < E.bankruptcyAtPara && bankruptcyAllowed(st)) addFlag(st, BANKRUPTCY_PENDING);
  if (st.money.balance > st.counters.peakMoney) st.counters.peakMoney = st.money.balance;
  st.money.debt = st.money.balance < 0 ? -st.money.balance : 0;
}

/**
 * Old-age sprint: may an İcra happen now? At most one per bankruptcy.minGapDays (the last one is remembered in
 * cooldowns.self under the İcra event id, whether or not its card was shown) and none after bankruptcy.maxAge.
 */
export function bankruptcyAllowed(st: LifeState): boolean {
  const b = E.bankruptcy;
  if (st.calendar.age > b.maxAge) return false;
  const last = st.cooldowns.self[b.eventId];
  return last === undefined || st.calendar.calendarDay - last >= b.minGapDays;
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
  st.cooldowns.self[b.eventId] = st.calendar.calendarDay;        // bankruptcyAllowed: one İcra per minGapDays
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
  const income = monthlyIncome(st);
  const spend = housingDaily(st) * days + mulDiv(income * st.yearStats.lifestylePm, days, 30000);
  if (spend > 0) moneyDelta(st, -spend, log, 'daily');
  const kid = childMonthly(st);
  if (kid > 0) moneyDelta(st, -mulDiv(kid, days, 30), log, 'child');
  const cs = E.comfortSpend;                                      // sprint 3 sink: savings beyond a year's income get spent
  const free = cs.freeMonths * Math.max(income, cs.floorMonthlyPara);
  if (st.money.balance > free) {
    const c = mulDiv(st.money.balance - free, cs.yearPm * days, 365_000);
    if (c > 0) moneyDelta(st, -c, log, 'comfort');
  }
  if (st.money.balance < 0 && st.calendar.age < E.elderCare.freezeDebtFromAge) {   // old-age sprint: restructured, no compounding
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
        if (st.status.job && isRetired(st.status.job)) moneyDelta(st, st.status.job.monthly, log, 'pension');
        else if (st.status.job) {
          moneyDelta(st, st.status.job.monthly, log, 'payday'); st.yearStats.paydays++;
          if (st.status.job.monthly > (st.counters.peakMonthly ?? 0)) st.counters.peakMonthly = st.status.job.monthly;   // pension reference
        }
        else if (st.status.home.kind === 'momsHouse' && st.npcs.some((n) => n.role === 'mom' && n.alive)) moneyDelta(st, E.allowanceMomsHouse, log, 'allowance');
        break;
      case 'rent': {
        const rent = st.status.home.rent;
        const kind = housingFlowKind(st);                       // sprint 3 P0-1: no landlord for an owned home
        if (st.money.balance < rent && kind !== 'mortgage') {
          if ((E.rentCard.kinds as string[]).includes(st.status.home.kind)) { rentShortfall = true; st.yearStats.rentShortfalls++; }
          st.hidden.stress = clamp(st.hidden.stress + E.rentStressPoints * 100, 0, 10000);
        }
        const pay = kind === 'mortgage' ? Math.min(rent, Math.max(E.mortgage.minPara, mulDiv(monthlyIncome(st), E.mortgage.maxIncomePm, 1000))) : rent;
        if (pay > 0) moneyDelta(st, -pay, log, kind);           // sprint 3: the bank sized the installment to the income
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
  for (const k of FLOW_ORDER) {
    const v = folded.get(k);
    if (!v) continue;
    const line: GapLine = { kind: k, para: v };
    if (k === 'daily' && detail.cat) line.cat = detail.cat;
    if (k === 'daily' && detail.child) line.child = detail.child;
    lines.push(line);
  }
  return { lines, detail, rentShortfall };
}
