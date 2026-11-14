/**
 * Web audio backend (default platform file; native: audioBackend.native.ts): a tiny WebAudio player.
 * - Browser autoplay policy: the AudioContext is created / resumed only inside the first user gesture, and the
 *   files are fetched + decoded only after it. Before that every play is a silent no-op.
 * - iOS Safari: WebAudio follows the ringer switch, so silent mode stays silent; other tabs' / apps' audio is
 *   never interrupted (no media session, no <audio> element).
 * - Never throws: no AudioContext (old browser, SSR, tests) → `null`, and the manager runs without sound.
 */
import { Asset } from 'expo-asset';
import type { AudioBackend } from './soundCore';

/** A play asked while its file is still loading is only honoured if the file arrives within this window. */
const LATE_MS = 250;
const GESTURES = ['pointerdown', 'touchend', 'click', 'keydown'] as const;

export function createAudioBackend(sources: Readonly<Record<string, unknown>>): AudioBackend | null {
  if (typeof window === 'undefined' || typeof fetch !== 'function') return null;
  const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
  const AC = w.AudioContext ?? w.webkitAudioContext;
  if (!AC) return null;

  let ctx: AudioContext | null = null;
  let active = true;
  const wanted: string[] = [];
  const buffers = new Map<string, AudioBuffer>();
  const loading = new Map<string, Promise<void>>();
  const live = new Set<AudioBufferSourceNode>();
  const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

  const uriOf = (key: string): string | null => {
    const src = sources[key];
    try {
      if (typeof src === 'string') return src;
      if (typeof src === 'number') return Asset.fromModule(src).uri;
      if (src && typeof src === 'object' && 'uri' in src) return String((src as { uri: unknown }).uri);
    } catch { /* unresolvable asset */ }
    return null;
  };

  const decode = (c: AudioContext, data: ArrayBuffer): Promise<AudioBuffer> => new Promise((resolve, reject) => {
    const p = c.decodeAudioData(data, resolve, reject) as Promise<AudioBuffer> | undefined;   // old Safari: callbacks only
    if (p && typeof p.then === 'function') p.then(resolve, reject);
  });

  const load = (key: string): Promise<void> | null => {
    const c = ctx;
    if (!c || buffers.has(key)) return null;
    const pending = loading.get(key);
    if (pending) return pending;
    const uri = uriOf(key);
    if (!uri) return null;
    const p = fetch(uri)
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.arrayBuffer(); })
      .then((data) => decode(c, data))
      .then((b) => { buffers.set(key, b); })
      .catch(() => undefined)
      .then(() => { loading.delete(key); });
    loading.set(key, p);
    return p;
  };

  const start = (key: string, volume: number): void => {
    const c = ctx, b = buffers.get(key);
    if (!c || !b || !active || c.state !== 'running') return;
    try {
      const src = c.createBufferSource(), gain = c.createGain();
      src.buffer = b;
      gain.gain.value = volume;
      src.connect(gain);
      gain.connect(c.destination);
      live.add(src);
      src.onended = () => { live.delete(src); try { gain.disconnect(); } catch { /* already gone */ } };
      src.start();
    } catch { /* context closed */ }
  };

  const unlock = (): void => {
    try {
      ctx ??= new AC();
      if (ctx.state === 'suspended' && active) void ctx.resume().catch(() => undefined);
      for (const k of wanted) void load(k);
      if (ctx.state === 'running') for (const g of GESTURES) window.removeEventListener(g, unlock, true);
    } catch { /* audio blocked: stay silent */ }
  };
  try { for (const g of GESTURES) window.addEventListener(g, unlock, true); } catch { return null; }

  return {
    preload(keys) { for (const k of keys) if (!wanted.includes(k)) { wanted.push(k); if (ctx) void load(k); } },
    play(key, volume) {
      if (!ctx || !active) return;                                  // no gesture yet (autoplay policy) or backgrounded
      if (buffers.has(key)) { start(key, volume); return; }
      const asked = now();
      void load(key)?.then(() => { if (now() - asked <= LATE_MS) start(key, volume); });
    },
    stopAll() { for (const s of [...live]) { try { s.stop(); } catch { /* not started */ } } live.clear(); },
    setActive(on) {
      active = on;
      if (!ctx) return;
      try { void (on ? ctx.resume() : ctx.suspend()).catch(() => undefined); } catch { /* closed */ }
    },
  };
}
