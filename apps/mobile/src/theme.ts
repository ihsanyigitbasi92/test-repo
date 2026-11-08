/**
 * Design tokens — "night notebook" palette of docs/mock/motto-demo.html (07 §2.4): dark paper, acid-lime accent,
 * Fraunces italic coach lines, Archivo Black stamps. Web loads the Google fonts (see App.tsx); native falls back
 * to system serif / heavy sans (no font files are bundled).
 */
import { Platform } from 'react-native';

export const colors = {
  paper: '#101410', paper2: '#181e18', paper3: '#222a22', ink: '#f1eee2', ink2: '#a8ab9c', line: '#3a4438',
  lime: '#c9ff3a', limeInk: '#1a2200', note: '#ffe86b', noteInk: '#3d3000',
  wrong: '#ff4d63', called: '#5dff9a', gold: '#ffcf4a',
  redFlash: 'rgba(255,40,60,0.45)', limeFlash: 'rgba(201,255,58,0.35)', goldFlash: 'rgba(255,207,74,0.45)',
  scrim: 'rgba(6,8,6,0.86)', death: '#070907', grave: '#3b3f3a', graveEdge: '#5a5f58',
} as const;

export const fonts = {
  coach: Platform.select({ web: '"Fraunces", Georgia, "Times New Roman", serif', ios: 'Georgia', default: 'serif' }),
  body: Platform.select({ web: '"IBM Plex Sans", "Segoe UI", Roboto, Helvetica, Arial, sans-serif', default: undefined }),
  stamp: Platform.select({ web: '"Archivo Black", Impact, "Arial Black", sans-serif', ios: 'AvenirNext-Heavy', default: 'sans-serif-black' }),
} as const;

/** Native drivers are unavailable on web (react-native-web runs Animated in JS). */
export const nativeDriver = Platform.OS !== 'web';

/** Avatar disc colours per speaker (NPC bubbles show initials on a coloured disc, mock `.npc .av`). */
export const speakerColor: Record<string, string> = {
  mom: '#ffb3c1', uncle: '#ffd38a', roommate: '#9ad1ff', boss: '#d0b3ff', neighbor: '#b5f0c0', cat: '#f5f5f5',
  cabbie: '#ffe86b', ex: '#ff9e9e', partner: '#ff8fb1',
};
export const speakerFallback = '#c9c3b0';
