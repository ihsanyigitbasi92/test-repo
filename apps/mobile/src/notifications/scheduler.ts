/**
 * Reminder scheduler — web / node (tests, export:web): a no-op. The native build uses scheduler.native.ts
 * (expo-notifications); nothing here imports the native module, so the web export and vitest never load it.
 */
import type { Reminder } from './plan';

export interface ReminderScheduler {
  /** Local notifications exist on this platform. */
  available: boolean;
  /** System permission (asks once if not decided yet). */
  requestPermission(): Promise<boolean>;
  schedule(items: readonly Reminder[]): Promise<void>;
  cancelAll(): Promise<void>;
  /** `idx` of the reminder the app was opened from (once), or null. */
  openedFrom(): Promise<number | null>;
}

export const scheduler: ReminderScheduler = {
  available: false,
  requestPermission: async () => false,
  schedule: async () => undefined,
  cancelAll: async () => undefined,
  openedFrom: async () => null,
};
