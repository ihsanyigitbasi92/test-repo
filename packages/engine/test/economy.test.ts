import { describe, it, expect } from 'vitest';
import {
  createLife, applyCashflow, protectionMultPm, hazardPpm, gradeForDelta, gradeForMoney, gradeForSpectacle, buildRoast, tables, TUNING,
} from '../src/index';
import { BUNDLE } from './helpers/content';
import { runLife } from './helpers/sim';

describe('cash flow (02 §2.3, D-067)', () => {
  it('one year: 12 paydays, 12 rents, 12 cat meals, daily cost every day', () => {
    const st = createLife('CASH', 'x', 'h');
    st.status.job = { title: 't', tier: 1, monthly: 1000, since: 0 };
    st.status.home = { kind: 'flat', rent: 500, since: 0 };
    st.money.balance = 100_000;                                     // D-159: tier-1 pay no longer covers a flat; keep this test debt-free
    const before = st.money.balance;
    const r = applyCashflow(st, 0, 365);
    const get = (k: keyof typeof r.detail) => r.detail[k] ?? 0;
    expect(get('payday')).toBe(12_000);
    expect(get('rent')).toBe(-6_000);
    expect(get('cat')).toBe(-600);
    const lifestyle = Math.floor((1000 * TUNING.economy.lifestyle.byTierPm[0]! * 365 + 15000) / 30000);   // yearStats snapshot (no job at creation)
    expect(get('daily')).toBe(-(TUNING.economy.housing.flat.daily * 365 + lifestyle));
    expect(st.money.balance - before).toBe(r.lines.reduce((s, l) => s + l.para, 0));
    expect(r.lines.map((l) => l.kind)).toEqual(['payday', 'rent', 'daily']);              // D-088: ≤ 3 lines, cat folded
    expect(r.lines[2]!.para).toBe(get('daily') + get('cat'));
    expect(st.yearStats.paydays).toBe(12);
  });

  it('rent shortfall raises stress and is reported', () => {
    const st = createLife('RENT', 'x', 'h');
    st.status.home = { kind: 'flat', rent: 500, since: 0 };
    st.money.balance = 0;
    const stress = st.hidden.stress;
    const r = applyCashflow(st, 0, 40);
    expect(r.rentShortfall).toBe(true);
    expect(st.hidden.stress).toBeGreaterThan(stress);
  });

  it('protection window scales damage ×0.5 at 18 → ×1.0 at 28', () => {
    expect(protectionMultPm(18)).toBe(500);
    expect(protectionMultPm(23)).toBe(750);
    expect(protectionMultPm(28)).toBe(1000);
    expect(protectionMultPm(60)).toBe(1000);
  });
});

describe('hazard tables (D-098)', () => {
  it('Gompertz table: 300 ppm at 18/health 50, doubles every 8 years, health lowers it', () => {
    expect(tables.hazardBasePpm(18, 5000)).toBe(300);
    const a = tables.hazardBasePpm(50, 5000), b = tables.hazardBasePpm(58, 5000);
    expect(Math.abs(b - 2 * a)).toBeLessThanOrEqual(2);
    expect(tables.hazardBasePpm(50, 9000)).toBeLessThan(a);
  });
  it('no hazard inside the protection window; certain death at 100', () => {
    const st = createLife('HZ', 'x', 'h');
    st.calendar.age = 27; expect(hazardPpm(st)).toBe(0);
    st.calendar.age = 100; expect(hazardPpm(st)).toBe(1_000_000);
  });
  it('gap quantile table is monotone with median ≈ 1.0', () => {
    for (let i = 1; i < 256; i++) expect(tables.GAP_QUANTILE_PM[i]!).toBeGreaterThanOrEqual(tables.GAP_QUANTILE_PM[i - 1]!);
    expect(Math.abs(tables.gapMultiplierPm(128) - 1000)).toBeLessThanOrEqual(10);
  });
});

describe('report card + roast (02 §2.2.6, §2.5.2, D-121)', () => {
  it('grade functions', () => {
    expect([gradeForDelta(10), gradeForDelta(3), gradeForDelta(-2), gradeForDelta(-9), gradeForDelta(-10)]).toEqual([4, 3, 2, 1, 0]);
    expect(gradeForMoney(500, 1000)).toBe(4);
    expect(gradeForMoney(-600, 1000)).toBe(0);
    expect([gradeForSpectacle(0), gradeForSpectacle(1), gradeForSpectacle(3)]).toEqual([3, 1, 0]);
  });
  it('roast numbers come from counters; top-3 shares sum ≤ 1000 ‰', () => {
    const r = runLife('ROAST', BUNDLE, 'chaotic');
    const roast = buildRoast(r.state);
    expect(roast.ageAtDeath).toBe(r.state.death!.age);
    expect(roast.numbers.shownDays).toBe(r.state.counters.shownDays);
    expect(roast.numbers.wagersTotal).toBe(r.state.wagerLog.total);
    expect(roast.patterns.length).toBeLessThanOrEqual(3);
    expect(roast.patterns.reduce((s, p) => s + p.sharePm, 0)).toBeLessThanOrEqual(1000);
    expect(r.meta.legacy.livesCompleted).toBe(1);
    expect(r.reports.every((c) => Object.values(c.grades).every((g) => g >= 0 && g <= 4))).toBe(true);
  });
});
