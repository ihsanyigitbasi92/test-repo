/**
 * Event catalog — the allowlist (docs/design/11 §2.2.2, docs/design/17 §3). Pure TS, no imports.
 *
 * One table drives everything: the TypeScript types of `track(name, params)`, the runtime sanitizer (unknown
 * keys and wrong types are dropped, never sent), the limit tests and the event table of doc 17.
 *
 * Rules (11 §2.2.3 "never logged"):
 *  - a param is a number, a boolean, a member of a closed enum or an `id` (a content / product id matching
 *    ID_RE — lowercase machine ids only). There is NO free-text kind: nothing the player typed can be a value.
 *  - no player name, no city, no seed, no device / advertising id, no wall-clock time, no location.
 *  - names keep clear of Firebase's reserved event names (`first_open`, `session_start`, `ad_reward`, `error` …),
 *    which is why 11's `first_open` / `session_start` / `ad_reward` appear here as `app_first_launch` /
 *    `game_session_start` / `ad_reward_earned`.
 *  - `purchase`, `ad_impression`, `tutorial_begin`, `tutorial_complete` and `screen_view` use GA4's recommended
 *    names and params so the built-in revenue / funnel reports work.
 *
 * Changing the meaning of an event or a param → bump SCHEMA_VERSION (sent as `schema_v` on every event).
 */
export const SCHEMA_VERSION = 1;

/** Firebase / GA4 limits (11 §2.2.2), enforced by test/analytics.test.ts. */
export const LIMITS = {
  eventNames: 500, paramsPerEvent: 25, eventNameLen: 40, paramNameLen: 40, stringValueLen: 100,
  userProps: 25, userPropNameLen: 24, userPropValueLen: 36,
} as const;

/** Machine id: content event ids, choice ids, SKUs, placements, error codes. Never prose. */
export const ID_RE = /^[a-z0-9][a-z0-9_.:-]{0,63}$/;

export const AGE_BANDS = ['18_24', '25_34', '35_44', '45_54', '55_64', '65_plus'] as const;
export type AgeBand = (typeof AGE_BANDS)[number];
export function ageBand(age: number): AgeBand {
  return age < 25 ? '18_24' : age < 35 ? '25_34' : age < 45 ? '35_44' : age < 55 ? '45_54' : age < 65 ? '55_64' : '65_plus';
}

export const SCREENS = ['client_file', 'life', 'death', 'shop', 'settings', 'consent'] as const;
export type ScreenName = (typeof SCREENS)[number];

/** `int` / `num`: finite numbers · `bool` · `id`: ID_RE string · array: closed enum. */
export type ParamKind = 'int' | 'num' | 'bool' | 'id' | readonly string[];
/** Which consent purpose an event may flow to. `analytics`: Firebase. `marketing`: Meta (only mapped events). */
export interface EventSpec {
  group: 'lifecycle' | 'ftue' | 'core' | 'ads' | 'iap' | 'settings' | 'quality';
  p: Readonly<Record<string, ParamKind>>;
  /** Optional params (everything else in `p` is required). */
  opt?: readonly string[];
  /** KPI(s) of 11 §2.1.2 this event feeds (doc 17 table). */
  kpi: string;
}

const PLATFORMS = ['ios', 'android', 'web'] as const;
/** Ad placement ids come from src/ads (sponsor, physio, tactic, extra_practice, return …): an `id`, snake_cased by trackAd. */
const AD_FORMATS = ['rewarded', 'interstitial'] as const;
const SURFACES = ['store', 'settings', 'post_death_2', 'other'] as const;
export const SHARE_CHANNELS = ['native_sheet', 'web_share', 'download', 'clipboard', 'cancelled', 'failed'] as const;
export type ShareChannel = (typeof SHARE_CHANNELS)[number];

export const EVENTS = {
  // ── lifecycle ──────────────────────────────────────────────────────────────
  app_first_launch: { group: 'lifecycle', kpi: 'D0 / install cohort (with Firebase first_open)', p: { platform: PLATFORMS } },
  /** `away_h`: time since the last session, bucketed (core.awayHours); absent on the first launch. */
  game_session_start: { group: 'lifecycle', kpi: 'sessions per DAU, D1/D7/D30, return-interval distribution', p: { source: ['cold', 'resume'], session_no: 'int', away_h: 'int' }, opt: ['away_h'] },
  /** What the return slot held (D-084: at most one thing per return) and, for `none`, why no interstitial came. */
  return_slot: { group: 'lifecycle', kpi: 'interstitial reach, consent friction on return', p: { result: ['consent', 'att', 'interstitial', 'none'], reason: 'id' }, opt: ['reason'] },
  /** The coach offered a stop (SESSION_END_SUGGESTED); acceptance = a following game_session_end{end_reason: enough}. */
  session_end_suggested: { group: 'lifecycle', kpi: 'stopping-cue acceptance', p: { shown_days: 'int' } },
  game_session_end: {
    group: 'lifecycle', kpi: 'session length, shown days / session, days / minute, speed mix',
    p: { dur_ms: 'int', shown_days: 'int', birthdays: 'int', answers: 'int', auto_answers: 'int', speed_play: 'int', speed_fast: 'int', speed_auto: 'int',
      session_no: 'int', part: 'int', end_reason: ['background', 'enough', 'death', 'close'] },
  },
  screen_view: { group: 'lifecycle', kpi: 'screen flow', p: { screen_name: SCREENS, screen_class: SCREENS } },
  // ── FTUE (once per install; `ms` = foreground ms since the first launch) ───
  tutorial_begin: { group: 'ftue', kpi: 'FTUE funnel step 1 (GA4 recommended event)', p: {} },
  ftue_line_seen: { group: 'ftue', kpi: 'TTFL proxy', p: { ms: 'int' } },
  ftue_life_start: { group: 'ftue', kpi: 'FTUE funnel', p: { ms: 'int' } },
  ftue_decision: { group: 'ftue', kpi: 'TTFD', p: { ms: 'int' } },
  ftue_stamp: { group: 'ftue', kpi: 'first stamp', p: { ms: 'int' } },
  ftue_report_card: { group: 'ftue', kpi: 'first report card, FTUE completion', p: { ms: 'int' } },
  tutorial_complete: { group: 'ftue', kpi: 'FTUE completion (GA4 recommended event)', p: {} },
  /** Onboarding steps of the tutorial (trackFtue('<own_step>')): `idx` = order in the onboarding script. */
  /** Onboarding intro (docs/design/18 §7). `replay`: opened again from Settings › How to play. */
  ftue_intro_open: { group: 'ftue', kpi: 'intro reach (opened / first launch)', p: { replay: 'bool', ms: 'int' } },
  ftue_intro_done: { group: 'ftue', kpi: 'intro completion, intro duration', p: { page: 'int', replay: 'bool', ms: 'int', dur_ms: 'int' } },
  ftue_intro_skip: { group: 'ftue', kpi: 'intro drop-off page', p: { page: 'int', replay: 'bool', ms: 'int', dur_ms: 'int' } },
  ftue_hint: { group: 'ftue', kpi: 'contextual hints shown', p: { id: ['choices', 'stats', 'speed', 'meters', 'report'], ms: 'int' } },
  ftue_step: { group: 'ftue', kpi: 'onboarding funnel (per step drop-off)', p: { step: 'id', idx: 'int', ms: 'int' } },
  // ── core loop ──────────────────────────────────────────────────────────────
  life_start: { group: 'core', kpi: 'lives per user', p: { life_no: 'int', fast_life: 'bool' } },
  day_shown: { group: 'core', kpi: 'content heatmap (sampled)', p: { event_id: 'id', domain: 'id', age_band: AGE_BANDS, kind: 'id', sample_pct: 'int' } },
  answer: { group: 'core', kpi: 'content heatmap, choice split, auto share', p: { event_id: 'id', choice_id: 'id', domain: 'id', age_band: AGE_BANDS, via: ['tap', 'auto'] } },
  wager_resolved: { group: 'core', kpi: 'coach accuracy (50–62 %)', p: { event_id: 'id', p_odds: 'int', result: ['hit', 'wrong'] }, opt: ['event_id'] },
  year_end: { group: 'core', kpi: 'report cards, "One More Year" denominator', p: { age: 'int', grades: 'id', shown_days_year: 'int' } },
  year_continue: { group: 'core', kpi: '"One More Year" numerator', p: { age: 'int', via: ['tap', 'auto'] } },
  milestone: { group: 'core', kpi: 'milestones reached', p: { kind: ['birthday', 'promotion', 'sad', 'legendary', 'wager_win'], age: 'int' } },
  death: { group: 'core', kpi: 'death age distribution (harness comparison)', p: { age: 'int', cause_class: 'id', channel: ['hazard', 'scripted'], life_no: 'int', shown_days: 'int', auto_days: 'int' } },
  rebirth: { group: 'core', kpi: 'death → new client within 2 min', p: { ms_since_death: 'int', life_no: 'int' } },
  /** `channel`: how the card left the app (native share sheet, Web Share with the PNG, PNG download, text to clipboard, cancelled, failed). */
  share: { group: 'core', kpi: 'shares per session, share channel mix', p: { card: ['death', 'report'], channel: SHARE_CHANNELS, format: ['story', 'square'] }, opt: ['channel', 'format'] },
  /** Variable-reward schedule as played: surprise / legendary days and the shown days since the previous one. */
  surprise_shown: { group: 'core', kpi: 'reward schedule (days_since p95 ≤ 14)', p: { tier: ['nice', 'great', 'legendary'], days_since: 'int', age_band: AGE_BANDS } },
  /** Cards that may drive churn: a loss (grief), the rent-crisis card, an omen (son perde). */
  story_card: { group: 'core', kpi: 'loss / rent / omen → same-session and next-day churn', p: { kind: ['loss', 'rent', 'omen'], event_id: 'id', age_band: AGE_BANDS } },
  // ── ads ────────────────────────────────────────────────────────────────────
  ad_offer_shown: { group: 'ads', kpi: 'rewarded opt-in denominator', p: { placement: 'id' } },
  ad_skip: { group: 'ads', kpi: 'no-fill rate, decline rate', p: { placement: 'id', reason: ['declined', 'no_fill', 'closed', 'error'] } },
  ad_shown: { group: 'ads', kpi: 'impressions / DAU by placement', p: { placement: 'id', format: AD_FORMATS } },
  ad_reward_earned: { group: 'ads', kpi: 'rewarded completion', p: { placement: 'id', free: 'bool' } },
  /** GA4 recommended shape. `value` in `currency` units (not micros). Only when the SDK reports paid revenue. */
  ad_impression: { group: 'ads', kpi: 'ARPDAU (ads)', p: { ad_platform: ['admob', 'mock'], ad_format: AD_FORMATS, ad_unit_name: 'id', ad_source: 'id', value: 'num', currency: 'id' }, opt: ['ad_source'] },
  // ── purchases ──────────────────────────────────────────────────────────────
  paywall_view: { group: 'iap', kpi: 'paywall → purchase conversion', p: { surface: SURFACES } },
  purchase_start: { group: 'iap', kpi: 'purchase funnel', p: { sku: 'id', surface: SURFACES } },
  /** GA4 recommended shape (`value` + `currency`; the Firebase provider adds `items`). No transaction id / receipt. */
  purchase: { group: 'iap', kpi: 'ARPDAU (IAP), payer conversion, LTV', p: { sku: 'id', value: 'num', currency: 'id', surface: SURFACES } },
  purchase_fail: { group: 'iap', kpi: 'purchase funnel drop-off',
    p: { sku: 'id', surface: SURFACES, reason: ['cancelled', 'pending', 'unavailable', 'network', 'not_allowed', 'product_unavailable', 'already_owned', 'store', 'unknown'] } },
  purchase_restore: { group: 'iap', kpi: 'restore health', p: { result: ['ok', 'none', 'failed'], count: 'int' } },
  // ── consent / notifications ────────────────────────────────────────────────
  /**
   * The single privacy card (docs/design/15 §5, 17 §5): which switches were shown and how they were left. Like every
   * event it leaves the device only after analytics is granted (a "no" is therefore never sent — documented in 17).
   */
  consent_answer: { group: 'settings', kpi: 'consent friction, opt-in rates (consented cohort only)',
    p: { step: ['privacy_card', 'ump', 'att'], trigger: ['first_report', 'return', 'settings'], choice: ['save', 'decline', 'ok'], ads: ['on', 'off', 'na'], analytics: ['on', 'off', 'na'] } },
  /** Reminder opt-in (docs/design/19). `os_denied`: yes in the game, no in the system dialog. */
  notif_optin: { group: 'settings', kpi: 'reminder opt-in rate', p: { answer: ['yes', 'no', 'os_denied'], surface: ['session_end', 'settings'] } },
  /** The app was opened by tapping a reminder; `idx` = its place in the series (0..6: daily ×3, then weekly). */
  notif_open: { group: 'settings', kpi: 'reminder → session conversion', p: { idx: 'int' } },
  // ── settings ───────────────────────────────────────────────────────────────
  /** Sound is deliberately NOT here: 11 §2.2.3 #6 — only the current value as the `sound` user property. */
  settings_change: { group: 'settings', kpi: 'language split, feature use', p: { setting: ['language', 'fast_life', 'auto', 'haptics', 'hints_reset', 'reminders'], value: 'id' } },
  // ── quality ────────────────────────────────────────────────────────────────
  app_error: { group: 'quality', kpi: 'error rate by scope', p: { scope: ['save', 'content', 'ads', 'shop', 'analytics', 'render', 'other'], code: 'id', fatal: 'bool' } },
} as const satisfies Record<string, EventSpec>;

export type EventName = keyof typeof EVENTS;
export const EVENT_NAMES = Object.keys(EVENTS) as EventName[];

type ValueOf<K> = K extends 'int' | 'num' ? number : K extends 'bool' ? boolean : K extends 'id' ? string : K extends readonly (infer U)[] ? U : never;
type OptKeys<N extends EventName> = (typeof EVENTS)[N] extends { opt: readonly (infer O)[] } ? O & string : never;
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type Flat<T> = { [K in keyof T]: T[K] };
/** Typed params of event `N`. */
export type EventParams<N extends EventName> = Flat<
  { [K in Exclude<keyof (typeof EVENTS)[N]['p'], OptKeys<N>>]: ValueOf<Mutable<(typeof EVENTS)[N]['p']>[K]> } &
  { [K in Extract<keyof (typeof EVENTS)[N]['p'], OptKeys<N>>]?: ValueOf<Mutable<(typeof EVENTS)[N]['p']>[K]> }
>;
/** `track('tutorial_begin')` needs no second argument; events with required params do. */
export type TrackArgs<N extends EventName> = {} extends EventParams<N> ? [params?: EventParams<N>] : [params: EventParams<N>];

export type ParamValue = string | number | boolean;
export type Params = Record<string, ParamValue>;

/** Params the core adds to every event (count toward the 25-param limit). */
export const COMMON_PARAMS = ['schema_v', 'lag_s'] as const;

// ── user properties ──────────────────────────────────────────────────────────
export const USER_PROPS = {
  locale: ['tr', 'en'],
  lives_bucket: ['1', '2_3', '4_9', '10_plus'],
  payer: ['0', '1'],
  no_ads: ['0', '1'],
  sound: ['on', 'off'],
  app_version: 'id',
  content_hash: 'id',
  install_week: 'id',
  ab_variant: 'id',
} as const satisfies Record<string, 'id' | readonly string[]>;
export type UserPropName = keyof typeof USER_PROPS;
export type UserProps = { [K in UserPropName]?: (typeof USER_PROPS)[K] extends readonly (infer U)[] ? U : string };

export function livesBucket(lifeNo: number): NonNullable<UserProps['lives_bucket']> {
  return lifeNo <= 1 ? '1' : lifeNo <= 3 ? '2_3' : lifeNo <= 9 ? '4_9' : '10_plus';
}

/** ISO week of a date as `2026w46` — the coarsest install-cohort label (no install timestamp is sent). */
export function isoWeek(d: Date): string {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = Date.UTC(t.getUTCFullYear(), 0, 1);
  return `${t.getUTCFullYear()}w${String(Math.ceil(((t.getTime() - y0) / 86_400_000 + 1) / 7)).padStart(2, '0')}`;
}

// ── sanitizer ────────────────────────────────────────────────────────────────
function clean(kind: ParamKind, v: unknown): ParamValue | undefined {
  if (kind === 'int') return typeof v === 'number' && Number.isFinite(v) ? Math.round(v) : undefined;
  if (kind === 'num') return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
  if (kind === 'bool') return typeof v === 'boolean' ? v : undefined;
  if (typeof v !== 'string') return undefined;
  if (kind === 'id') return ID_RE.test(v) ? v : undefined;                   // already-lowercase machine ids only; nothing is "cleaned into" an id
  return kind.includes(v) ? v : undefined;
}

/**
 * Runtime gate behind the types: returns only catalog params with valid values, or null when the event is not in
 * the catalog or a required param is missing / invalid. A value that is not a number, boolean, enum member or
 * machine id (e.g. a player name that slipped in through `as any`) can never pass.
 */
export function sanitizeEvent(name: string, params: unknown): Params | null {
  const spec = (EVENTS as Record<string, EventSpec>)[name];
  if (!spec) return null;
  const src = (typeof params === 'object' && params !== null ? params : {}) as Record<string, unknown>;
  const out: Params = {};
  for (const key of Object.keys(spec.p)) {
    const v = clean(spec.p[key]!, src[key]);
    if (v === undefined) { if (!spec.opt?.includes(key)) return null; continue; }
    out[key] = v;
  }
  return out;
}

export function sanitizeUserProps(props: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (typeof props !== 'object' || props === null) return out;
  for (const [k, v] of Object.entries(props as Record<string, unknown>)) {
    const kind = (USER_PROPS as Record<string, 'id' | readonly string[]>)[k];
    if (!kind || typeof v !== 'string') continue;
    if (kind === 'id' ? ID_RE.test(v) && v.length <= LIMITS.userPropValueLen : kind.includes(v)) out[k] = v;
  }
  return out;
}

/** Death cause key (`<band>.<class>` for the hazard die, a content id for scripted deaths) → its class. */
export function causeClass(cause: string | null | undefined): string {
  const c = String(cause ?? '').split('.').pop() ?? '';
  return /^[a-z][a-z0-9_]{0,39}$/.test(c) ? c : 'unknown';       // anything that is not already a machine id is not sent at all
}

/** Any content tag / id → a safe machine id (`other` when it is not one). */
export function toId(x: string | null | undefined, fallback = 'other'): string {
  const s = String(x ?? '');
  return ID_RE.test(s) ? s : fallback;
}
