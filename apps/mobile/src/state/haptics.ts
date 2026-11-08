/** Haptic vocabulary (07 §2.4.6) over expo-haptics; a silent no-op on web and wherever the module is missing. */
import { Platform } from 'react-native';
import * as H from 'expo-haptics';

const run = (f: () => Promise<void>): void => {
  if (Platform.OS === 'web') return;
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
