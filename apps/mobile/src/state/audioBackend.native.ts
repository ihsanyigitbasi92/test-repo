/**
 * Native audio backend (iOS / Android) over expo-audio.
 * - Audio session: `playsInSilentMode: false` + `interruptionMode: 'mixWithOthers'` → iOS category `ambient`
 *   (+ mixWithOthers): the ring/silent switch mutes us and the player's own music keeps playing; Android: no audio
 *   focus is requested and playback is suppressed in silent / vibrate ringer mode. Nothing plays in the background.
 * - One small player per file, created on demand, the frequent ones up front; least-recently-used players are released.
 * - A binary built without the module (old dev client) → `null`: the game runs without sound instead of crashing.
 */
import type { AudioBackend } from './soundCore';

interface Player { volume: number; playing: boolean; play(): void; pause(): void; seekTo(seconds: number): Promise<void>; remove(): void }
interface ExpoAudio {
  createAudioPlayer(source: unknown): Player;
  setAudioModeAsync(mode: Record<string, unknown>): Promise<void>;
  setIsAudioActiveAsync(active: boolean): Promise<void>;
}

/** Players kept alive (07 §2.5: a pool of ~18). */
const MAX_PLAYERS = 20;
/** Players created ahead of time by preload(); the rest are created by their first play. */
const MAX_PRELOADED = 12;

export function createAudioBackend(sources: Readonly<Record<string, unknown>>): AudioBackend | null {
  let mod: ExpoAudio;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mod = require('expo-audio') as ExpoAudio;
    void mod.setAudioModeAsync({
      playsInSilentMode: false, interruptionMode: 'mixWithOthers', shouldPlayInBackground: false, allowsRecording: false, shouldRouteThroughEarpiece: false,
    }).catch(() => undefined);
  } catch (e) {
    console.warn('[sound] audio unavailable:', e);
    return null;
  }

  const players = new Map<string, { p: Player; used: boolean }>();      // insertion order = least recently used first
  let active = true;

  const get = (key: string): { p: Player; used: boolean } | null => {
    const hit = players.get(key);
    if (hit) { players.delete(key); players.set(key, hit); return hit; }
    const src = sources[key];
    if (src == null) return null;
    try {
      if (players.size >= MAX_PLAYERS) {
        for (const [k, old] of players) {
          if (old.p.playing) continue;
          try { old.p.remove(); } catch { /* already released */ }
          players.delete(k);
          break;
        }
      }
      const made = { p: mod.createAudioPlayer(src), used: false };
      players.set(key, made);
      return made;
    } catch { return null; }
  };

  return {
    preload(keys) { for (const k of keys) { if (players.size >= MAX_PRELOADED) return; get(k); } },
    play(key, volume) {
      if (!active) return;
      const e = get(key);
      if (!e) return;
      try {
        e.p.volume = volume;
        if (!e.used) { e.used = true; e.p.play(); return; }
        // A finished player sits at its end: rewind, then play.
        void e.p.seekTo(0).catch(() => undefined).then(() => { try { if (active) e.p.play(); } catch { /* released */ } });
      } catch { /* player released */ }
    },
    stopAll() { for (const { p } of players.values()) { try { if (p.playing) p.pause(); } catch { /* released */ } } },
    setActive(on) {
      active = on;
      try { void mod.setIsAudioActiveAsync(on).catch(() => undefined); } catch { /* module gone */ }
    },
  };
}
