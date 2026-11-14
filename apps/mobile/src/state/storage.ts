/**
 * Key-value persistence: @react-native-async-storage/async-storage (native module on iOS / Android,
 * window.localStorage on web). Every call is guarded: a missing native module (the package throws at import when
 * the binary was built without it), a blocked / full localStorage or private browsing must never break the game —
 * it just runs without saves.
 */
interface KV {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

let kv: KV | null | undefined;
function store(): KV | null {
  if (kv !== undefined) return kv;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('@react-native-async-storage/async-storage') as { default?: KV } & KV;
    kv = mod.default ?? mod;
  } catch (e) {
    console.warn('[save] storage unavailable:', e);
    kv = null;
  }
  return kv;
}

export async function readItem(key: string): Promise<string | null> {
  try { return (await store()?.getItem(key)) ?? null; } catch (e) { console.warn('[save] read failed:', e); return null; }
}

export async function writeItem(key: string, value: string): Promise<boolean> {
  try { const s = store(); if (!s) return false; await s.setItem(key, value); return true; } catch (e) { console.warn('[save] write failed:', e); return false; }
}

export async function removeItem(key: string): Promise<void> {
  try { await store()?.removeItem(key); } catch (e) { console.warn('[save] remove failed:', e); }
}
