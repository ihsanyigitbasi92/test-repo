/**
 * Sound effects, the audible twin of haptics.ts (docs/design/16-ses-efektleri.md): `sfx('stamp_thud')` at the same
 * semantic moments the haptics fire. One manager for the app: preloads, mixes, rate-limits, remembers mute / volume
 * (own storage key), goes quiet in the background, and is a silent no-op wherever audio is unavailable.
 */
import { useSyncExternalStore } from 'react';
import { AppState } from 'react-native';
import { createAudioBackend } from './audioBackend';
import { SFX_ASSETS } from './sfxAssets.gen';
import { SoundManager } from './soundCore';
import type { AudioBackend, PlayOpts, SoundPrefs } from './soundCore';
import type { SfxName } from './sfx';
import { readItem, writeItem } from './storage';

let backend: AudioBackend | null = null;
try { backend = createAudioBackend(SFX_ASSETS); } catch (e) { console.warn('[sound] audio unavailable:', e); }

export const sound = new SoundManager({ backend, kv: { read: readItem, write: writeItem } });
void sound.init();

// Background / inactive (incoming call, app switcher, hidden tab): nothing sounds, nothing queues.
try {
  sound.setActive(AppState.currentState !== 'background');
  AppState.addEventListener('change', (st) => sound.setActive(st === 'active'));
} catch { /* no lifecycle events: stays active */ }

/** Fire-and-forget; never throws. */
export const sfx = (name: SfxName, opts?: PlayOpts): void => { sound.play(name, opts); };

/** Mute / volume for the settings sheet. */
export function useSoundPrefs(): SoundPrefs {
  return useSyncExternalStore(sound.subscribe, sound.getPrefs, sound.getPrefs);
}
