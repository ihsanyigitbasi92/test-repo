/** Haptic vocabulary (07 §2.4.6) over expo-haptics; a silent no-op on web and wherever the module is missing. */
import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import * as H from 'expo-haptics';
import { readItem, writeItem } from './storage';

/** Settings → Vibration (07 §2.2.9), default on. Own storage key: survives new lives and save resets. */
export const HAPTICS_PREFS_KEY = 'motto.haptics.v1';
let enabled = true;
let touched = false;
const listeners = new Set<() => void>();
const emit = () => { for (const l of listeners) l(); };
void readItem(HAPTICS_PREFS_KEY).then((v) => { if (!touched && v === 'off') { enabled = false; emit(); } });

export const hapticsPrefs = {
  get: (): boolean => enabled,
  set(on: boolean): void {
    if (on === enabled) return;
    enabled = on; touched = true;
    emit();
    void writeItem(HAPTICS_PREFS_KEY, on ? 'on' : 'off');
  },
  subscribe: (l: () => void): (() => void) => { listeners.add(l); return () => { listeners.delete(l); }; },
};
export const useHapticsEnabled = (): boolean => useSyncExternalStore(hapticsPrefs.subscribe, hapticsPrefs.get, hapticsPrefs.get);

const run = (f: () => Promise<void>): void => {
  if (Platform.OS === 'web' || !enabled) return;
  try { f().catch(() => undefined); } catch { /* module unavailable */ }
};

export const haptic = {
  selection: () => run(() => H.selectionAsync()),
  light: () => run(() => H.impactAsync(H.ImpactFeedbackStyle.Light)),
  medium: () => run(() => H.impactAsync(H.ImpactFeedbackStyle.Medium)),
  heavy: () => run(() => H.impactAsync(H.ImpactFeedbackStyle.Heavy)),
  error: () => run(() => H.notificationAsync(H.NotificationFeedbackType.Error)),
  success: () => run(() => H.notificationAsync(H.NotificationFeedbackType.Success)),
};
