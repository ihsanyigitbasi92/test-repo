import { describe, it, expect } from 'vitest';
import { TUNING, bandFor, targetIntensityPm, emptyMeta, createLife, salience, applyAction } from '../src/index';
import type { LifeState } from '../src/index';
import { BUNDLE, FIXTURE_ONLY } from './helpers/content';
import { runLife } from './helpers/sim';

describe('DayDirector (D-061, D-101, 03 §2.3)', () => {
  it('shown days per year stay inside the age band for every year of 30 lives (AC-03-02)', () => {
    for (let i = 0; i < 30; i++) {
      const r = runLife(`BUD-${i}`, BUNDLE, i % 2 ? 'first' : 'chaotic');
      for (const rep of r.reports) {
        const b = bandFor(rep.age - 1);
        expect(rep.shownDaysThisYear).toBeGreaterThanOrEqual(b.min);
        expect(rep.shownDaysThisYear).toBeLessThanOrEqual(b.max + TUNING.dayBudget.capAboveMax);
      }
    }
  });

  it('fastLife uses the band minimum', () => {
    const meta = emptyMeta();
    let st = applyAction(null as unknown as LifeState, meta, { type: 'START_LIFE', seed: 'FAST', name: 'x', fastLife: true }, BUNDLE).state;
    expect(st.director.yearBudget).toBeGreaterThanOrEqual(bandFor(18).min);
    expect(st.director.yearBudget).toBeLessThanOrEqual(bandFor(18).min + 1);
  });

  it('gaps respect the band cap, birthdays are the last day of the year and always the report card (AC-03-03)', () => {
    runLife('GAP-1', BUNDLE, 'chaotic', {
      onStep: (st, a, fx) => {
        if (a.type !== 'NEXT_DAY' || !st.card) return;
        expect(st.calendar.skippedSinceLast).toBeGreaterThanOrEqual(1);
        expect(st.calendar.skippedSinceLast).toBeLessThanOrEqual(bandFor(st.calendar.age).maxGap + 366);
        if (fx.some((e) => e.kind === 'REPORT_CARD')) {
          expect(st.card.eventId).toBe('sys_report_card');
          expect(st.director.shownThisYear).toBe(0);
        }
        if (st.card.skip) { expect(st.card.skip.days).toBe(st.calendar.skippedSinceLast); expect(st.card.skip.days).toBeGreaterThanOrEqual(2); }
      },
    });
  });

  it('one event per shown day; tiny pools fall back to a quiet day instead of crashing', () => {
    const r = runLife('TINY', FIXTURE_ONLY, 'first', { maxSteps: 300 });
    expect(r.state.counters.shownDays).toBeGreaterThan(100);
    expect(r.state.counters.quietDays).toBe(0);                     // cooldown-ignoring fallback still finds an event
    const gated = { ...FIXTURE_ONLY, events: FIXTURE_ONLY.events.filter((e) => e.id === 'evt_kombi_ustasi_kis') };
    const q = runLife('QUIET', gated, 'first', { maxSteps: 50 });   // only event needs a rented home → nothing playable
    expect(q.state.counters.quietDays).toBe(q.state.counters.shownDays - q.reports.length);
  });

  it('session intensity curve matches 03 §2.3.4 (per-mille)', () => {
    expect(targetIntensityPm(0)).toBe(250);
    expect(targetIntensityPm(450)).toBe(730);                       // worked example: t = 0.45 → 0.73
    expect(targetIntensityPm(800)).toBe(950);
    expect(targetIntensityPm(900)).toBe(450);
  });

  it('valence guard zeroes negative candidates after two negative days; specificity raises the score', () => {
    const st = createLife('SAL', 'x', BUNDLE.contentHash);
    const meta = emptyMeta();
    const kombi = BUNDLE.events.find((e) => e.id === 'evt_kombi_ustasi_kis')!;
    const kurye = BUNDLE.events.find((e) => e.id === 'evt_kurye_yanlis_adres')!;
    expect(salience(kombi, st, meta)).toBeGreaterThan(0);
    st.reward.negStreak = 2;
    expect(salience(kombi, st, meta)).toBe(0);
    expect(salience(kurye, st, meta)).toBeGreaterThan(0);
  });

  it('mom calls: ≤ 3 per life, ≥ 40 shown days apart, never in the first 10 days (D-108, AC-03-16)', () => {
    for (let i = 0; i < 20; i++) {
      const days: number[] = [];
      runLife(`MOM-${i}`, BUNDLE, 'last', { onStep: (st, a) => { if (a.type === 'NEXT_DAY' && st.card?.momCall) days.push(st.calendar.dayIndex); } });
      expect(days.length).toBeLessThanOrEqual(TUNING.momCall.maxPerLife);
      for (let k = 1; k < days.length; k++) expect(days[k]! - days[k - 1]!).toBeGreaterThanOrEqual(TUNING.momCall.cooldownDays);
      if (days.length) expect(days[0]!).toBeGreaterThanOrEqual(TUNING.momCall.ftueDays);
    }
  });

  it('END_SESSION keeps 1–2 envelopes open and plans a teaser notification (AC-03-15)', () => {
    let checked = 0;
    runLife('ENV-1', BUNDLE, 'chaotic', {
      maxSteps: 800, sessionDays: 15,
      onStep: (st, a, fx) => {
        if (a.type !== 'END_SESSION') return;
        const open = st.envelopes.filter((e) => !e.resolved).length;
        expect(open).toBeGreaterThanOrEqual(1);
        expect(open).toBeLessThanOrEqual(TUNING.envelope.maxOpen);
        const plan = fx.find((e) => e.kind === 'NOTIFY_PLAN');
        expect(plan && plan.kind === 'NOTIFY_PLAN' && plan.teaserKeys.length).toBe(1);
        checked++;
      },
    });
    expect(checked).toBeGreaterThan(10);
  });
});
