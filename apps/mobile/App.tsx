import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { channelRng, ENGINE_VERSION } from '@motto/engine';

export default function App() {
  const rng = channelRng('demo-life', 1, 'events');
  const sample = rng.int(1, 100);
  return (
    <View style={styles.container} testID="root">
      <Text style={styles.brand}>MOTTO</Text>
      <Text style={styles.sub}>Sertifikasız Hayat Koçu · engine {ENGINE_VERSION}</Text>
      <Text style={styles.line}>Deterministik zar: {sample}</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101410', alignItems: 'center', justifyContent: 'center', gap: 8 },
  brand: { color: '#c9ff3a', fontSize: 28, fontWeight: '900', letterSpacing: 4 },
  sub: { color: '#a8ab9c', fontSize: 13 },
  line: { color: '#f1eee2', fontSize: 16 },
});
