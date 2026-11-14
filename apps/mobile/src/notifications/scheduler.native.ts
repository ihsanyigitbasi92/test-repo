/**
 * Reminder scheduler — iOS / Android (expo-notifications ~58.1, the SDK 58 bundled version). Local notifications
 * only: no push token, no server. No badge, no sound; nothing is shown while the app is in the foreground.
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Reminder } from './plan';
import type { ReminderScheduler } from './scheduler';

const CHANNEL = 'reminders';
let setUp = false;
let handledResponse: string | null = null;

async function setup(): Promise<void> {
  if (setUp) return;
  setUp = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: false, shouldShowList: false, shouldPlaySound: false, shouldSetBadge: false }),
  });
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, { name: 'Motto', importance: Notifications.AndroidImportance.DEFAULT, showBadge: false, sound: null });
  }
}

export const scheduler: ReminderScheduler = {
  available: true,
  async requestPermission() {
    try {
      await setup();
      const cur = await Notifications.getPermissionsAsync();
      if (cur.granted) return true;
      if (!cur.canAskAgain) return false;
      const r = await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowBadge: false, allowSound: false } });
      return r.granted;
    } catch { return false; }
  },
  async schedule(items) {
    try {
      await setup();
      for (const it of items) {
        await Notifications.scheduleNotificationAsync({
          content: { title: it.title, body: it.body, data: { motto: 'reminder', idx: it.idx }, sound: false },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: it.at, ...(Platform.OS === 'android' ? { channelId: CHANNEL } : {}) },
        });
      }
    } catch (e) { console.warn('[reminders] schedule failed:', e); }
  },
  async cancelAll() {
    try { await Notifications.cancelAllScheduledNotificationsAsync(); await Notifications.dismissAllNotificationsAsync(); } catch { /* nothing scheduled */ }
  },
  async openedFrom() {
    try {
      const r = await Notifications.getLastNotificationResponseAsync();
      const id = r?.notification.request.identifier ?? null;
      const data = r?.notification.request.content.data as { motto?: unknown; idx?: unknown } | undefined;
      if (!id || id === handledResponse || data?.motto !== 'reminder') return null;
      handledResponse = id;
      return typeof data.idx === 'number' ? data.idx : 0;
    } catch { return null; }
  },
};
