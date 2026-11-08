import { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LifeScreen } from './src/screens/LifeScreen';

const FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,500;1,9..144,700&family=IBM+Plex+Sans:wght@400;500;600;700&family=Archivo+Black&display=swap';

/** Web only: load the mock's Google fonts; native (and offline web) falls back to system serif / heavy sans. */
function useWebFonts(): void {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined' || document.getElementById('motto-fonts')) return;
    const link = document.createElement('link');
    link.id = 'motto-fonts';
    link.rel = 'stylesheet';
    link.href = FONTS_HREF;
    document.head.appendChild(link);
    document.title = 'Motto';
    document.body.style.backgroundColor = '#181e18';
  }, []);
}

export default function App() {
  useWebFonts();
  return (
    <>
      <LifeScreen />
      <StatusBar style="light" />
    </>
  );
}
