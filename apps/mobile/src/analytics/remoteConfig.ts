/**
 * Remote Config — tuning without a backend (Firebase Remote Config on native; in-code defaults everywhere else).
 *
 * Rules: every key has a safe default IN CODE (the game runs identically with no network, no Firebase project
 * and on web); remote values are type-checked and clamped before use, so a bad console entry cannot break the
 * game; nothing here can change a store price (prices come from the store) or what an entitlement grants.
 * Pure TS except for the injected source.
 */
export interface RcSpec<T> { def: T; min?: number; max?: number; oneOf?: readonly string[] }

export const RC_DEFAULTS = {
  /** Global ad kill switch (maps to AD_CONFIG.kill.all when false). */
  ads_enabled: { def: true },
  /** Interstitial kill switch on its own (rewarded offers stay). */
  ads_interstitial_enabled: { def: true },
  /** Rewarded views per local day; 0 switches the placement family off. */
  ads_rewarded_daily_cap: { def: 4, min: 0, max: 8 },
  /** Minimum minutes between two interstitials (06 §2.4: never lower than 6 h → clamp). */
  ads_interstitial_min_gap_min: { def: 360, min: 360, max: 2880 },
  /** Shop entry visible. */
  shop_enabled: { def: true },
  /** Percentage of shown days that emit `day_shown` (content heatmap sampling). */
  day_shown_sample_pct: { def: 10, min: 0, max: 100 },
  /** A/B arm label copied into the `ab_variant` user property ('' = none). One lowercase letter. */
  ab_variant: { def: '', oneOf: ['', 'a', 'b'] },
} as const satisfies Record<string, RcSpec<boolean | number | string>>;

export type RcKey = keyof typeof RC_DEFAULTS;
type Widen<T> = T extends boolean ? boolean : T extends number ? number : T extends string ? string : never;
export type RcValue<K extends RcKey> = Widen<(typeof RC_DEFAULTS)[K]['def']>;

/** What the native binding returns: only the keys that really came from the server, as strings. */
export interface RemoteConfigSource {
  fetchAndActivate(defaults: Record<string, string | number | boolean>, minFetchSec: number): Promise<Record<string, string>>;
}

/** Parses one remote string against its spec; anything invalid → undefined (the default stays). */
export function parseRc(key: RcKey, raw: string): boolean | number | string | undefined {
  const spec: RcSpec<boolean | number | string> = RC_DEFAULTS[key];
  if (typeof spec.def === 'boolean') return raw === 'true' || raw === '1' ? true : raw === 'false' || raw === '0' ? false : undefined;
  if (typeof spec.def === 'number') {
    const n = Number(raw);
    if (raw.trim() === '' || !Number.isFinite(n)) return undefined;
    return Math.min(spec.max ?? n, Math.max(spec.min ?? n, n));
  }
  return spec.oneOf && !spec.oneOf.includes(raw) ? undefined : raw.slice(0, 36);
}

export class RemoteConfig {
  private values: Partial<Record<RcKey, boolean | number | string>> = {};
  private listeners = new Set<() => void>();
  private fetching: Promise<boolean> | null = null;

  /** Typed getter: the remote value when a valid one was fetched, otherwise the in-code default. */
  get<K extends RcKey>(key: K): RcValue<K> {
    const v = this.values[key];
    return (v === undefined ? RC_DEFAULTS[key].def : v) as RcValue<K>;
  }

  all(): { [K in RcKey]: RcValue<K> } {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(RC_DEFAULTS) as RcKey[]) out[k] = this.get(k);
    return out as { [K in RcKey]: RcValue<K> };
  }

  subscribe = (l: () => void): (() => void) => { this.listeners.add(l); return () => { this.listeners.delete(l); }; };

  /** Applies raw remote strings (also the test / demo entry). Unknown keys and invalid values are ignored. */
  apply(raw: Readonly<Record<string, string>>): void {
    const next: Partial<Record<RcKey, boolean | number | string>> = {};
    for (const k of Object.keys(RC_DEFAULTS) as RcKey[]) {
      const r = raw[k];
      if (typeof r !== 'string') continue;
      const v = parseRc(k, r);
      if (v !== undefined) next[k] = v;
    }
    this.values = next;
    for (const l of [...this.listeners]) { try { l(); } catch { /* listener errors never reach the caller */ } }
  }

  /** Fetch + activate. Never rejects; false when there is no source / no network (defaults stay). */
  refresh(load: () => Promise<RemoteConfigSource | null>, minFetchSec: number): Promise<boolean> {
    this.fetching ??= (async () => {
      try {
        const src = await load();
        if (!src) return false;
        const defaults: Record<string, string | number | boolean> = {};
        for (const k of Object.keys(RC_DEFAULTS) as RcKey[]) defaults[k] = RC_DEFAULTS[k].def;
        this.apply(await src.fetchAndActivate(defaults, minFetchSec));
        return true;
      } catch { return false; } finally { this.fetching = null; }
    })();
    return this.fetching;
  }
}

export const remoteConfig = new RemoteConfig();
/** `rc('ads_enabled')` — typed, always defined. */
export const rc = <K extends RcKey>(key: K): RcValue<K> => remoteConfig.get(key);
