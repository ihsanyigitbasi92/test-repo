/**
 * Reminder opt-in on the "Enough for today" sheet (docs/design/19): once, from the end of the 2nd session on, two
 * equal buttons with different words, nothing preselected. After the answer a single quiet line stays.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useI18n } from '../i18n';
import { reminders, useReminders } from './runtime';

export function ReminderAsk({ sessionCount }: { sessionCount: number }) {
  const { s } = useI18n();
  const st0 = useReminders();
  const [answered, setAnswered] = useState<boolean | null>(null);
  const t = s.reminderAsk;
  if (answered !== null) return <Text style={st.note} testID="reminder-answered">{answered ? t.on : t.off}</Text>;
  if (!reminders.askDue(sessionCount) || st0.optIn !== 'unasked') return null;
  const answer = (yes: boolean) => { void reminders.answer(yes, 'session_end').then((ok) => setAnswered(ok)); };
  return (
    <View style={st.box} testID="reminder-ask">
      <Text style={st.txt}>{t.text}</Text>
      <View style={st.row}>
        <Pressable onPress={() => answer(false)} accessibilityRole="button" testID="reminder-no" style={({ pressed }) => [st.btn, pressed && st.pressed]}>
          <Text style={st.btnTxt}>{t.no}</Text>
        </Pressable>
        <Pressable onPress={() => answer(true)} accessibilityRole="button" testID="reminder-yes" style={({ pressed }) => [st.btn, pressed && st.pressed]}>
          <Text style={st.btnTxt}>{t.yes}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  box: { gap: 8, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10 },
  txt: { fontSize: 14, lineHeight: 20, color: colors.ink, fontFamily: fonts.body },
  note: { fontFamily: fonts.coach, fontStyle: 'italic', fontSize: 14, color: colors.ink2 },
  row: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, minHeight: 48, borderRadius: 8, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.paper2, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  btnTxt: { fontSize: 14, fontWeight: '700', color: colors.ink },
  pressed: { transform: [{ scale: 0.98 }] },
});
