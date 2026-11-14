/**
 * Test content bundle: the six 03 §3 fixture days (validated by the single zod schema) plus a deterministic
 * synthetic pool so the director has enough breadth for life-length simulations (MVP content is not written yet).
 * Every synthetic event is parsed with the same schema — the harness never runs on content the lint would reject.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { GameEventSchema, SkipLine } from '@motto/content-schema';
import type { ContentBundle, GameEvent } from '../../src/index';

const FIX = join(import.meta.dirname, '..', '..', '..', 'content-schema', 'fixtures');

type Raw = Record<string, unknown>;
const coach = (roast = true) => [{ tr: 'Not aldım.', en: 'Noted.', roast }];
const out = (effects: Raw, extra: Raw = {}) => ({ effects, tr: 'Oldu.', en: 'It happened.', coach: coach(), ...extra });
const choice = (id: string, pattern: string, extra: Raw = {}) => ({ id, tr: `Seçenek ${id}`, en: `Option ${id}`, pattern, ...extra });
const base = (id: string, extra: Raw): Raw => ({
  id, v: 1, type: 'event', tags: ['gundelik'], rarity: 'common', valence: 0, intensity: 5000, universality: 'universal', pre: {},
  intent: { setup: 's', mechanism: 'm', punch: 'p', lift: 'l', target: 'decision' }, review: { status: 'draft', legal: 'ok' }, ...extra,
});

function synthetic(): Raw[] {
  const ev: Raw[] = [];
  const pats = ['procrastination', 'avoidance', 'impulseSpend', 'peoplePleasing', 'selfCare', 'overwork', 'leanOnFamily', 'shortcut', 'pride', 'generosity', 'patience'];
  for (let i = 0; i < 36; i++) {                                         // everyday pool, mixed valence/intensity
    const valence = ([-1, 0, 0, 1] as const)[i % 4];
    const [a, b, c] = [pats[i % pats.length]!, pats[(i + 3) % pats.length]!, pats[(i + 7) % pats.length]!];
    ev.push(base(`evt_syn_day_${i}`, {
      tags: ['gundelik', `syn${i % 6}`, ...(i % 9 === 0 ? ['lol'] : []), ...(i % 10 === 3 ? ['relax'] : [])],
      valence, intensity: 1500 + ((i * 1300) % 8000), isLOL: i % 9 === 0, relax: i % 10 === 3,
      cooldownDays: { self: 60 + (i % 5) * 30 }, rarity: i % 7 === 0 ? 'uncommon' : 'common',
      choices: [choice('a', a), choice('b', b), choice('c', c)],
      outcomes: {
        a: out({ stats: { joy: 3 - (i % 5), health: i % 3 === 0 ? -2 : 1 }, money: -200 - (i % 4) * 150 }),
        b: out({ stats: { joy: 1, brain: 1 }, meters: { cringe: i % 4 === 0 ? 9 : 2 }, money: 100 }),
        c: out({ stats: { joy: 0, charm: 1 }, meters: { momPressure: i % 3 === 0 ? -6 : 4 }, hidden: { stress: 3 } }),
      },
    }));
  }
  for (let i = 0; i < 10; i++) {                                         // wager days: check 0.45, near-miss fail branch
    ev.push(base(`evt_syn_wager_${i}`, {
      tags: ['kariyer', `w${i % 3}`], intensity: 6000, cooldownDays: { self: 90 },
      choices: [choice('dene', 'risk', { check: { base: 4500, goal: `g${i % 4}`, stat: i % 2 ? 'brain' : 'charm' } }), choice('birak', 'patience'), choice('erte', 'procrastination')],
      outcomes: {
        dene: [{ p: 4500, ...out({ stats: { joy: 4 }, money: 800 }) },
          { p: 5500, ...out({ stats: { joy: -2 }, meters: { ego: -3 } }), nearMiss: { tr: 'Az kaldı.', en: 'So close.' } }],
        birak: out({ stats: { joy: 1 } }), erte: out({ hidden: { stress: 2 } }),
      },
      wager: { eligible: true },
    }));
  }
  for (let i = 0; i < 14; i++) {                                         // good surprises (pity pools)
    const tier = i < 10 ? 'nice' : 'great';
    ev.push(base(`evt_syn_surprise_${i}`, {
      tags: [`surprise.${tier}`, 'wholesome'], valence: 1, intensity: 4000, cooldownDays: { self: 200 },
      choices: [choice('al', 'generosity', { swipe: 'right' }), choice('pas', 'patience', { swipe: 'left' })],
      outcomes: { al: out({ stats: { joy: tier === 'great' ? 8 : 4 }, money: tier === 'great' ? 2000 : 500 }), pas: out({ stats: { joy: 2 } }) },
    }));
  }
  for (let i = 0; i < 4; i++) ev.push(base(`leg_syn_${i}`, {                // legendary days
    tags: ['efsane'], rarity: 'legendary', valence: 2, wow: true, intensity: 9000,
    choices: [choice('evet', 'risk', { swipe: 'right' }), choice('hayir', 'patience', { swipe: 'left' })],
    outcomes: { evet: out({ stats: { joy: 10 }, money: 5000 }), hayir: out({ stats: { joy: 5 } }) },
  }));
  for (let t = 1; t <= 3; t++) ev.push(base(`evt_syn_job_${t}`, {          // jobs (status strip, D-067)
    tags: ['kariyer', 'is'], intensity: 6000, pre: { career: { employed: false }, age: { min: 18 + (t - 1) * 4 } }, cooldownDays: { self: 60 },
    choices: [choice('kabul', 'overwork'), choice('red', 'pride'), choice('pazarlik', 'shortcut')],
    outcomes: {
      kabul: out({ status: { job: { title: `syn_t${t}`, tier: t, monthly: [0, 1000, 1600, 2500][t]! } }, meters: { momPressure: -10 } }),
      red: out({ meters: { ego: 3 } }), pazarlik: out({ status: { job: { title: `syn_t${t}`, tier: t, monthly: [0, 1100, 1700, 2600][t]! } }, meters: { cringe: 3 } }),
    },
  }));
  ev.push(base('evt_syn_promo', {
    tags: ['kariyer'], intensity: 6000, pre: { career: { employed: true } }, cooldownDays: { self: 400 },
    choices: [choice('iste', 'risk'), choice('bekle', 'patience'), choice('kac', 'avoidance')],
    outcomes: { iste: out({ career: { rungDelta: 1 }, meters: { ego: 6 } }), bekle: out({ stats: { joy: 1 } }), kac: out({ hidden: { stress: 4 } }) },
  }));
  ev.push(base('evt_syn_fired', {
    tags: ['kariyer'], valence: -1, intensity: 7000, pre: { career: { employed: true }, age: { max: 64 } }, cooldownDays: { self: 900 },
    choices: [choice('kabul', 'patience'), choice('kavga', 'pride'), choice('yalvar', 'peoplePleasing')],
    outcomes: { kabul: out({ status: { job: null }, stats: { joy: 0 } }), kavga: out({ status: { job: null }, meters: { ego: 5, cringe: 8 } }), yalvar: out({ stats: { joy: -3 }, meters: { cringe: 4 } }) },
  }));
  ev.push(base('evt_syn_move_out', {
    tags: ['ev'], intensity: 5000, pre: { housing: ['momsHouse'], money: { min: 2000 }, age: { min: 20 } }, cooldownDays: { self: 300 },
    choices: [choice('oda', 'risk'), choice('ev', 'impulseSpend'), choice('kal', 'leanOnFamily')],
    outcomes: { oda: out({ housing: 'room', meters: { momPressure: -10 } }), ev: out({ status: { home: { kind: 'flat', rent: 500 } }, meters: { momPressure: -25 } }), kal: out({ meters: { momPressure: 5 } }) },
  }));
  ev.push(base('evt_kira_gunu', {
    tags: ['ev', 'kira'], valence: -1, intensity: 6000, cooldownDays: { self: 25 },
    choices: [choice('yarisi', 'patience'), choice('anne', 'leanOnFamily'), choice('gormezden', 'avoidance')],
    outcomes: { yarisi: out({ stats: { joy: 0 } }), anne: out({ money: 400, meters: { momPressure: 10 }, bailoutCheck: true }), gormezden: out({ hidden: { stress: 6 }, meters: { cringe: 6 } }) },
  }));
  ev.push(base('evt_anne_borc_verdi', {                                   // 02 §2.3.6 bailout (one of three)
    tags: ['para', 'aile', 'bailout'], rarity: 'uncommon', intensity: 6000, maxPerLife: 1,
    pre: { age: { max: 27 }, money: { max: -1 }, flags: { none: ['bailoutUsed'] }, npc: { mom: { alive: true } } },
    choices: [choice('al', 'leanOnFamily'), choice('plan', 'patience'), choice('alma', 'pride')],
    outcomes: {
      al: out({ money: 3000, meters: { momPressure: 15 }, flags: { add: ['bailoutUsed'] } }),
      plan: out({ money: 3000, meters: { momPressure: 6 }, flags: { add: ['bailoutUsed', 'anne_odeme_plani'] } }),
      alma: out({ meters: { ego: 4, momPressure: -4 }, hidden: { stress: 6 }, flags: { add: ['bailoutUsed'] } }),
    },
  }));
  ev.push(base('doc_icra', {                                              // 02 §2.3.4 İcra/İflas document day
    type: 'document', tags: ['para', 'evrak', 'icra'], valence: -1, intensity: 8000, pre: { flags: { all: ['bankruptcyPending'] } },
    document: {
      letterhead: { tr: 'İCRA MÜDÜRLÜĞÜ (kurgusal)', en: 'COLLECTIONS OFFICE (fictional)' }, body: { tr: 'Ödeme emri.', en: 'Payment order.' },
      translate: { tr: { from: 'ödeme emri', to: 'borcun var' }, en: { from: 'payment order', to: 'you owe' } }, glossaryKey: 'icra',
    },
    choices: [choice('oku', 'patience'), choice('imzala', 'avoidance'), choice('itiraz', 'pride')],
    outcomes: { oku: out({ stats: { joy: 0 }, glossary: 'icra' }), imzala: out({ hidden: { stress: 4 } }), itiraz: out({ meters: { ego: 3 } }) },
  }));
  for (let i = 0; i < 3; i++) ev.push(base(`call_syn_anne_${i}`, {        // mom-call variants (D-108 ≥ 6 in MVP)
    type: 'call', tags: ['aile', 'anne', 'call'], valence: -1, intensity: 7000, maxPerLife: 3, call: { speaker: 'mom', takeover: true },
    pre: { meters: { momPressure: { min: 75 } }, npc: { mom: { alive: true } } },
    choices: [choice('ac', 'peoplePleasing'), choice('mesaj', 'patience'), choice('acma', 'avoidance')],
    outcomes: { ac: out({ meters: { momPressure: -25 }, stats: { joy: 1 } }), mesaj: out({ meters: { momPressure: -10 } }), acma: out({ meters: { momPressure: 10 } }) },
  }));
  ev.push(base('evt_syn_env_open', {
    tags: ['is', 'zarf'], intensity: 5000, cooldownDays: { self: 200 },
    choices: [choice('bekle', 'patience'), choice('sor', 'risk'), choice('unut', 'avoidance')],
    outcomes: {
      bekle: out({ envelope: { teaserKey: 'env.syn.office', dueDays: [7, 45], weight: 2, resolverEventId: 'evt_syn_env_resolve' } }),
      sor: out({ meters: { ego: 2 } }), unut: out({ hidden: { stress: 1 } }),
    },
  }));
  ev.push(base('evt_syn_env_resolve', {                                  // L03-11: resolver pre carries envelopeOpen:true
    tags: ['is', 'zarf'], intensity: 6000, cooldownDays: { self: 30 }, pre: { envelopeOpen: true },
    choices: [choice('dinle', 'patience'), choice('itiraz', 'pride'), choice('gul', 'shortcut')],
    outcomes: { dinle: out({ stats: { joy: 1 } }), itiraz: out({ meters: { ego: 3 } }), gul: out({ meters: { cringe: 3 } }) },
  }));
  ev.push(base('evt_syn_chain_a1', {
    tags: ['zincir'], intensity: 5000, cooldownDays: { self: 3000 }, chain: { id: 'syn_a', node: 'a1', next: [{ node: 'a2', delayDays: [20, 60] }] },
    choices: [choice('basla', 'risk'), choice('dur', 'patience'), choice('sonra', 'procrastination')],
    outcomes: { basla: out({ stats: { joy: 2 } }), dur: out({ stats: { joy: 0 } }), sonra: out({ hidden: { stress: 1 } }) },
  }));
  ev.push(base('evt_syn_chain_a2', {
    tags: ['zincir'], intensity: 6000, pre: { chain: { id: 'syn_a', nodeDone: ['a1'] } }, chain: { id: 'syn_a', node: 'a2' },
    choices: [choice('bitir', 'patience'), choice('birak', 'avoidance'), choice('abart', 'pride')],
    outcomes: { bitir: out({ stats: { joy: 3 } }), birak: out({ stats: { joy: -1 } }), abart: out({ meters: { cringe: 5 } }) },
  }));
  for (let i = 0; i < 4; i++) ev.push(base(`evt_syn_health_${i}`, {
    tags: ['saglik', 'selfCare'], intensity: 3000, relax: true, cooldownDays: { self: 120 }, pre: { age: { min: 25 + i * 10 } },
    choices: [choice('spor', 'selfCare'), choice('erte', 'procrastination'), choice('doktor', 'patience')],
    outcomes: { spor: out({ stats: { health: 3, joy: 1 }, hidden: { stress: -4 } }), erte: out({ stats: { health: -2 } }), doktor: out({ stats: { health: 2 }, money: -300 }) },
  }));
  return ev;
}

function load(): ContentBundle {
  const fixtures = readdirSync(FIX).filter((f) => f.endsWith('.json') && !f.endsWith('.skip.json'))
    .map((f) => JSON.parse(readFileSync(join(FIX, f), 'utf8')) as Raw);
  const events = [...fixtures, ...synthetic()].map((e) => GameEventSchema.parse(e) as GameEvent);
  const skipLines = SkipLine.array().parse(JSON.parse(readFileSync(join(FIX, 'lines.skip.json'), 'utf8')));
  return { contentHash: 'test-bundle-v1', events, skipLines };
}

export const BUNDLE: ContentBundle = load();
/** Synthetic stand-ins for system days the MVP content will provide (rent, bailout, İcra). */
export const SYNTHETIC_SYSTEM = ['evt_kira_gunu', 'evt_anne_borc_verdi', 'doc_icra'];
/** Only the six 03 §3 fixture days (tiny pool → exercises the quiet-day fallback). */
export const FIXTURE_ONLY: ContentBundle = { ...BUNDLE, contentHash: 'fixtures-only', events: BUNDLE.events.filter((e) => !e.id.includes('_syn') && !SYNTHETIC_SYSTEM.includes(e.id)) };
