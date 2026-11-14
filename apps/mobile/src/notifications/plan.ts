/**
 * Opt-in local reminders (docs/design/19-bildirimler.md) — pure logic, unit-tested in node.
 *
 * Rules (davranış 2026-11-13 §5.2, ethics §6.3):
 *  - Opt-in only, asked once, no earlier than the end of the 2nd session ("Enough for today" sheet), and from Settings.
 *  - At most one per day, near the player's usual play time (median start hour of the last sessions).
 *  - The series after leaving: day +1, +2, +3, then weekly (+10, +17, +24, +31) = 3 ignored → weekly, 7 → silence.
 *    Opening the app cancels everything that is still pending; leaving again schedules a fresh series.
 *  - Text: an in-world coach line. No numbers, no streak / loss / "you're missing" words, no badge, no counter.
 */
import type { Locale } from '@motto/engine';

export const REMINDER_KEY = 'motto.reminders.v1';
/** Days after leaving: daily ×3, then weekly ×4; nothing after the 7th. */
export const SERIES_DAYS = [1, 2, 3, 10, 17, 24, 31] as const;
/** Session starts kept for the usual-hour median. */
export const HOURS_KEPT = 7;
/** Minute of the hour reminders land on (off the :00 rush). */
export const REMINDER_MINUTE = 10;
/** Without history: early evening. */
export const DEFAULT_HOUR = 19;
/** Reminders are never scheduled between these hours (night): the usual hour is clamped into the day. */
export const QUIET = { from: 22, to: 9 } as const;

export interface ReminderState {
  v: 1;
  optIn: 'unasked' | 'yes' | 'no';
  /** Wall-clock ms of the answer (0: never). */
  answeredAt: number;
  /** Local start hours (0–23) of the last sessions, newest last. */
  hours: number[];
}
export const emptyReminders = (): ReminderState => ({ v: 1, optIn: 'unasked', answeredAt: 0, hours: [] });

export function decodeReminders(raw: string | null | undefined): ReminderState | null {
  if (!raw) return null;
  try {
    const x = JSON.parse(raw) as Partial<ReminderState> | null;
    if (!x || x.v !== 1 || (x.optIn !== 'unasked' && x.optIn !== 'yes' && x.optIn !== 'no')) return null;
    const hours = Array.isArray(x.hours) ? x.hours.filter((h): h is number => Number.isInteger(h) && h >= 0 && h < 24).slice(-HOURS_KEPT) : [];
    return { v: 1, optIn: x.optIn, answeredAt: typeof x.answeredAt === 'number' ? x.answeredAt : 0, hours };
  } catch { return null; }
}

export const recordHour = (st: ReminderState, hour: number): ReminderState => ({ ...st, hours: [...st.hours, hour].slice(-HOURS_KEPT) });

/** Median of the recorded start hours, clamped out of the night; DEFAULT_HOUR without history. */
export function usualHour(hours: readonly number[]): number {
  if (!hours.length) return DEFAULT_HOUR;
  const sorted = [...hours].sort((a, b) => a - b);
  const h = sorted[Math.floor((sorted.length - 1) / 2)]!;
  if (h >= QUIET.from) return QUIET.from - 1;
  if (h < QUIET.to) return QUIET.to;
  return h;
}

/** The ask is due: never answered, and the player is ending their 2nd (or later) session. */
export const shouldAsk = (st: ReminderState, sessionCount: number, minSession = 2): boolean => st.optIn === 'unasked' && sessionCount >= minSession;

/** Fire times (ms) of the series that starts when the player leaves at `now`, at local `hour`:REMINDER_MINUTE. */
export function seriesTimes(now: number, hour: number): number[] {
  return SERIES_DAYS.map((d) => {
    const t = new Date(now);
    t.setDate(t.getDate() + d);
    t.setHours(hour, REMINDER_MINUTE, 0, 0);
    return t.getTime();
  });
}

export const LINES: Record<Locale, { any: readonly string[]; cat: readonly string[] }> = {
  tr: {
    any: [
      'Defter masada açık duruyor. Kalem de.',
      'Annen aradı. Bir şey yok, sadece sordu.',
      'Posta kutusunda bir zarf var. Ben açmadım.',
      'Komşu yine fazla yemek yapmış. Kapıda bir tabak bekliyor.',
      'Takvimden bir yaprak kopmuş gibi. Bakmaya ne dersin?',
      'Seminer notlarımı düzenledim. Dinlemeyecek biri lazım.',
      'Çay demlendi. Gerisi senin seçimin.',
    ],
    cat: ['Pamuk masadaki bardağa yine bakıyor.', 'Pamuk kapının önünde oturuyor. Bekliyor gibi; kedi işte.'],
  },
  en: {
    any: [
      'The notebook is open on the table. So is the pen.',
      'Your mom called. Nothing urgent, she just asked.',
      "There's an envelope in the mailbox. I didn't open it.",
      'The neighbor cooked too much again. A plate is waiting at the door.',
      'A calendar page seems to have turned. Want to look?',
      'I sorted my seminar notes. I need someone to ignore them.',
      'The kettle just boiled. The rest is your call.',
    ],
    cat: ['Biscuit is staring at the glass on the table again.', "Biscuit is sitting by the door. Waiting, maybe; it's a cat."],
  },
};
export const TITLE = 'Motto';

/** Words / shapes a reminder must never contain (tested): numbers, streaks, loss, urgency, FOMO. */
export const FORBIDDEN = /\d|seri|streak|kaçır|miss|kaybet|lose|lost|son şans|last chance|hemen|now|acele|hurry|ödül|reward|!/i;

export interface Reminder { at: number; title: string; body: string; idx: number }

/** The whole series for one leave. `seed` rotates the lines so two leaves do not start with the same one. */
export function buildSeries(p: { now: number; hours: readonly number[]; locale: Locale; catAlive: boolean; seed: number }): Reminder[] {
  const pool = [...LINES[p.locale].any, ...(p.catAlive ? LINES[p.locale].cat : [])];
  return seriesTimes(p.now, usualHour(p.hours)).map((at, idx) => ({ at, idx, title: TITLE, body: pool[(p.seed + idx) % pool.length]! }));
}
