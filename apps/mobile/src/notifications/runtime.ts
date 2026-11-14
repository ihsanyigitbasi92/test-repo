/**
 * Reminders runtime (docs/design/19): the opt-in state (own storage key), the system permission, and the series
 * scheduled when the player leaves / cancelled when the app opens. Web / tests: the scheduler is a no-op and the
 * Settings row is hidden.
 */
import { useSyncExternalStore } from 'react';
import type { Locale } from '@motto/engine';
import { readItem, writeItem } from '../state/storage';
import { trackNotifOpen, trackNotifOptIn } from '../analytics/hooks';
import { REMINDER_KEY, buildSeries, decodeReminders, emptyReminders, recordHour, shouldAsk, type ReminderState } from './plan';
import { scheduler } from './scheduler';

let st: ReminderState = emptyReminders();
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();
const emit = (): void => { for (const l of [...listeners]) l(); };
const save = (): void => { void writeItem(REMINDER_KEY, JSON.stringify(st)); };

export const reminders = {
  available: scheduler.available,
  subscribe: (l: () => void): (() => void) => { listeners.add(l); return () => { listeners.delete(l); }; },
  get: (): ReminderState => st,
  load(): Promise<void> {
    loading ??= (async () => {
      try { st = decodeReminders(await readItem(REMINDER_KEY)) ?? emptyReminders(); } catch { st = emptyReminders(); }
      emit();
    })();
    return loading;
  },
  /** The app is open (launch / back to the foreground): pending reminders go, the start hour is recorded. */
  async onOpen(): Promise<void> {
    await this.load();
    st = recordHour(st, new Date().getHours());
    save();
    emit();
    if (!scheduler.available) return;
    const idx = await scheduler.openedFrom();
    if (idx !== null) trackNotifOpen(idx);
    await scheduler.cancelAll();
  },
  /** The player leaves (background / Close): a fresh series, only with the opt-in. */
  async onLeave(ctx: { locale: Locale; catAlive: boolean }): Promise<void> {
    if (!scheduler.available || st.optIn !== 'yes') return;
    await scheduler.cancelAll();
    const now = Date.now();
    await scheduler.schedule(buildSeries({ now, hours: st.hours, locale: ctx.locale, catAlive: ctx.catAlive, seed: Math.floor(now / 86_400_000) }));
  },
  askDue: (sessionCount: number): boolean => scheduler.available && shouldAsk(st, sessionCount),
  /** In-game answer (session-end card or the Settings switch). A yes also asks the system once. */
  async answer(yes: boolean, surface: 'session_end' | 'settings'): Promise<boolean> {
    let ok = yes;
    if (yes) ok = await scheduler.requestPermission();
    st = { ...st, optIn: ok ? 'yes' : 'no', answeredAt: Date.now() };
    save();
    emit();
    trackNotifOptIn(yes ? (ok ? 'yes' : 'os_denied') : 'no', surface);
    if (!ok) await scheduler.cancelAll();
    return ok;
  },
};

export const useReminders = (): ReminderState => useSyncExternalStore(reminders.subscribe, reminders.get, reminders.get);
