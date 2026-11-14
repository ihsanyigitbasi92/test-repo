import { describe, it, expect } from 'vitest';
import { applyAction, applyCashflow, createLife, eligible, emptyMeta, isEmployed, renderText, resolveText, TUNING } from '../src/index';
import type { Action, Bubble, Effect, GameEvent, LifeState, Locale } from '../src/index';
import { BUNDLE } from './helpers/content';
import { runLife } from './helpers/sim';

describe('text keys → bundle strings (10 §3.3)', () => {
  it('every key a full life emits resolves to a non-empty string in tr and en, with all placeholders filled', () => {
    const keys = new Map<string, Bubble['params']>();
    const take = (b: Bubble) => keys.set(b.textKey, b.params);
    const fromFx = (fx: Effect[]) => {
      for (const e of fx) {
        if (e.kind === 'SHOW_DIALOG') e.bubbles.forEach(take);
        if (e.kind === 'SHOW_DAY') {
          e.card.bubbles.forEach(take);
          for (const c of e.card.choices) keys.set(c.textKey, undefined);
          if (e.card.skip) keys.set(e.card.skip.key, e.card.skip.params);
          if (e.card.wager) keys.set(e.card.wager.slipKey, undefined);
        }
      }
    };
    for (const p of ['first', 'chaotic', 'last'] as const) runLife(`TXT-${p}`, BUNDLE, p, { onStep: (_s, _a, fx) => fromFx(fx) });
    expect(keys.size).toBeGreaterThan(300);
    const kinds = new Set([...keys.keys()].map((k) => k.replace(/^evt\.[a-z0-9_]+\./, 'evt.').replace(/\.\d+/g, '.#').split('.').slice(0, 3).join('.')));
    for (const k of ['evt.dialog.#', 'evt.c', 'evt.o', 'skip.generic']) expect([...kinds].some((x) => x.startsWith(k))).toBe(true);
    for (const [key, params] of keys) for (const loc of ['tr', 'en'] as Locale[]) {
      const raw = resolveText(BUNDLE, key, loc);
      expect(raw, `${key} (${loc})`).toBeTruthy();
      expect(renderText(BUNDLE, key, loc, params)!, `${key} (${loc})`).not.toMatch(/\{[a-zA-Z]+\}/);
    }
  }, 30_000);

  it('resolves dialog alt, text variants, nearMiss and coach lines; unknown keys are null', () => {
    const ev = structuredClone(BUNDLE.events.find((e) => e.id === 'evt_is_gorusmesi_ik')!) as GameEvent;
    ev.dialog![0]!.alt = [{ tr: 'Alt TR', en: 'Alt EN' }];
    ev.text = [{ id: 'v1', tr: 'Anlatı', en: 'Narration' }];
    const b = { ...BUNDLE, events: [ev] };
    expect(resolveText(b, 'evt.evt_is_gorusmesi_ik.dialog.0.alt.0', 'en')).toBe('Alt EN');
    expect(resolveText(b, 'evt.evt_is_gorusmesi_ik.text.v1', 'tr')).toBe('Anlatı');
    expect(resolveText(b, 'evt.evt_is_gorusmesi_ik.o.durust.1.nearMiss', 'en')).toMatch(/round two/);
    expect(resolveText(b, 'evt.evt_is_gorusmesi_ik.o.durust.1.coach.0', 'tr')).toMatch(/Sayaç: \{n\}/);
    expect(resolveText(b, 'evt.evt_is_gorusmesi_ik.wager.slip', 'tr')).toMatch(/İDDİA/);
    expect(resolveText(b, 'evt.evt_is_gorusmesi_ik.o.ghost.0.text', 'tr')).toBeNull();
    expect(resolveText(b, 'nope', 'tr')).toBeNull();
  });

  it('text-only events render a narrator bubble; the least-seen variant rotates', () => {
    const ev = structuredClone(BUNDLE.events.find((e) => e.id === 'evt_syn_day_1')!) as GameEvent;
    ev.text = [{ id: 'a', tr: 'A {name}', en: 'A {name}' }, { id: 'b', tr: 'B', en: 'B' }];
    const b = { ...BUNDLE, contentHash: 'txt', events: [ev] };
    const meta = emptyMeta();
    let st = applyAction(null as unknown as LifeState, meta, { type: 'START_LIFE', seed: 'TXT', name: 'Ada' }, b).state;
    const seen: string[] = [];
    for (let i = 0; i < 6; i++) {
      st = applyAction(st, meta, { type: 'NEXT_DAY' }, b).state;
      if (st.phase !== 'day') continue;
      const nar = st.card!.bubbles.find((x) => x.speaker === 'narrator')!;
      expect(nar).toBeDefined();
      if (nar.textKey.endsWith('.a')) expect(nar.params?.name).toBe('Ada');
      seen.push(nar.textKey);
      st = applyAction(st, meta, { type: 'ANSWER', eventId: st.card!.eventId, choiceId: 'a' }, b).state;
    }
    expect(new Set(seen).size).toBe(2);
  });

  it('coach bubbles carry {n} / {ego}: the rejection counter counts up', () => {
    const counts: number[] = [];
    runLife('PARAMS', BUNDLE, 'first', {
      maxSteps: 3000,
      onStep: (_s, a, fx) => {
        if (a.type !== 'ANSWER') return;
        for (const e of fx) if (e.kind === 'SHOW_DIALOG' && e.layer === 'coach')
          for (const b of e.bubbles) { expect(b.params?.n).toBeGreaterThanOrEqual(1); expect(typeof b.params?.ego).toBe('number'); counts.push(b.params!.n as number); }
      },
    });
    expect(Math.max(...counts)).toBeGreaterThan(1);
  });
});

describe('Action contract (10 §3.1)', () => {
  const start = () => {
    const meta = emptyMeta();
    const st = applyAction(null as unknown as LifeState, meta, { type: 'START_LIFE', seed: 'ACT', name: 'x' }, BUNDLE).state;
    return { meta, st };
  };
  it('NEXT_DAY on an unanswered card and a stale ANSWER are haptic-error no-ops', () => {
    const { meta, st } = start();
    applyAction(st, meta, { type: 'NEXT_DAY' }, BUNDLE);
    const day = st.calendar.dayIndex, id = st.card!.eventId;
    expect(applyAction(st, meta, { type: 'NEXT_DAY' }, BUNDLE).effects).toEqual([{ kind: 'HAPTIC', pattern: 'error' }]);
    expect(st.calendar.dayIndex).toBe(day);
    const choice = st.card!.choices.find((c) => !c.locked)!.id;
    expect(applyAction(st, meta, { type: 'ANSWER', eventId: 'evt_other', choiceId: choice }, BUNDLE).effects).toEqual([{ kind: 'HAPTIC', pattern: 'error' }]);
    expect(st.phase).toBe('day');
    expect(applyAction(st, meta, { type: 'ANSWER', eventId: id, choiceId: choice }, BUNDLE).effects.length).toBeGreaterThan(1);
    expect(applyAction(st, meta, { type: 'ANSWER', eventId: id, choiceId: choice }, BUNDLE).effects).toEqual([{ kind: 'HAPTIC', pattern: 'error' }]);   // double tap
  });
  it('SESSION_END is END_SESSION; expectedSessionDays = median of the last 5 sessions; t ≥ 0.85 suggests an end', () => {
    const { meta, st } = start();
    let suggested = 0;
    for (const len of [10, 30, 12, 14, 40, 16]) {
      for (let i = 0; i < len; i++) {
        const fx = applyAction(st, meta, { type: 'NEXT_DAY' }, BUNDLE).effects;
        suggested += fx.filter((e) => e.kind === 'SESSION_END_SUGGESTED').length;
        if (st.phase === 'day') applyAction(st, meta, { type: 'ANSWER', eventId: st.card!.eventId, choiceId: st.card!.choices.find((c) => !c.locked)!.id }, BUNDLE);
      }
      applyAction(st, meta, { type: len % 2 ? 'END_SESSION' : 'SESSION_END', ...(len % 2 ? {} : { reason: 'enough' }) } as Action, BUNDLE);
    }
    expect(st.director.recentSessions).toEqual([30, 12, 14, 40, 16]);
    expect(st.director.expectedSessionDays).toBe(16);
    expect(suggested).toBeGreaterThanOrEqual(4);
  });
});

describe('Günün Günü (03 §2.3.7)', () => {
  it('session day 2 plays the date-seeded shared event; same date + same choice → same branch for everyone', () => {
    const play = (seed: string, localDay: string) => {
      const meta = emptyMeta();
      let st = applyAction(null as unknown as LifeState, meta, { type: 'START_LIFE', seed, name: 'x' }, BUNDLE).state;
      st = applyAction(st, meta, { type: 'RESUME', localDay, nowWall: 0 }, BUNDLE).state;
      for (let i = 0; i < 2; i++) {
        st = applyAction(st, meta, { type: 'NEXT_DAY' }, BUNDLE).state;
        if (i === 1) break;
        if (st.phase === 'day') st = applyAction(st, meta, { type: 'ANSWER', eventId: st.card!.eventId, choiceId: st.card!.choices[0]!.id }, BUNDLE).state;
      }
      const card = st.card!;
      const choiceId = card.choices[0]!.id;
      st = applyAction(st, meta, { type: 'ANSWER', eventId: card.eventId, choiceId }, BUNDLE).state;
      return { card, branch: st.card!.answered!.branch, played: st.director.daily!.played };
    };
    const a = play('DAILY-A', '2026-11-08'), b = play('DAILY-B', '2026-11-08');
    expect(a.card.daily).toEqual({ localDay: '2026-11-08' });
    expect(a.card.eventId).toBe(b.card.eventId);
    expect(BUNDLE.events.find((e) => e.id === a.card.eventId)!.shared).toBe(true);
    expect(a.branch).toBe(b.branch);
    expect(a.played).toBe(true);
  });
});

describe('speaker gate (D-062, 03 §2.2.3) and economy details', () => {
  it('an event voiced by mom is ineligible once mom is dead; boss lines need a job', () => {
    const st = createLife('SPK', 'x', BUNDLE.contentHash), meta = emptyMeta();
    const call = BUNDLE.events.find((e) => e.id === 'call_anne_hafta_sonu')!;
    const momVoiced = { ...call, pre: {} } as GameEvent;
    expect(eligible(momVoiced, st, meta)).toBe(true);
    st.npcs.find((n) => n.role === 'mom')!.alive = false;
    expect(eligible(momVoiced, st, meta)).toBe(false);
    const nevin = BUNDLE.events.find((e) => e.id === 'evt_nevin_hizalanma_01')!;
    expect(eligible({ ...nevin, pre: {} } as GameEvent, st, meta)).toBe(false);          // boss does not exist yet
    st.npcs.find((n) => n.role === 'boss')!.exists = true;
    expect(eligible({ ...nevin, pre: {} } as GameEvent, st, meta)).toBe(true);
  });

  it('pension (sprint 3): certain at retirement.maxAge; full pm after fullYears worked, else short; flag + pension line', () => {
    const R = TUNING.economy.retirement;
    for (const [years, pm] of [[R.fullYears + 1, R.pensionPm.full], [10, R.pensionPm.short]] as const) {
      const meta = emptyMeta();
      const st = applyAction(null as unknown as LifeState, meta, { type: 'START_LIFE', seed: `PEN${years}`, name: 'x' }, BUNDLE).state;
      st.calendar.age = R.maxAge - 1;
      st.counters.yearsWorked = years - 1;
      st.status.job = { title: 'ofis', tier: 3, monthly: 2000, since: 0 };
      st.director.shownThisYear = st.director.yearBudget;                  // next gap runs to the birthday
      st.hidden.luck = 5000;
      applyAction(st, meta, { type: 'NEXT_DAY' }, BUNDLE);
      if (st.death) continue;                                              // hazard roll may still end it
      expect(st.status.job!.title).toBe('emekli');
      expect(st.status.job!.monthly).toBe((2000 * pm) / 1000);
      expect(st.flags).toContain(R.flag);
      expect(isEmployed(st)).toBe(false);
      const r = applyCashflow(st, st.calendar.calendarDay, st.calendar.calendarDay + 40);
      expect(r.lines.some((l) => l.kind === 'pension')).toBe(true);
      expect(r.lines.some((l) => l.kind === 'payday')).toBe(false);
    }
  });
});
