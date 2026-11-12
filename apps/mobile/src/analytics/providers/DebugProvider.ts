/**
 * Demo / web / dev provider: a ring buffer (+ console line in dev) that stands in for an external sink.
 * It obeys the same consent gate as a real SDK — it is only initialised, and only receives events, once its
 * purpose is granted — so `window.__mottoAnalytics.buffer()` shows exactly what would have left the device.
 */
import type { ConsentSnapshot, Purpose } from '../consent';
import type { EventName, Params } from '../events';
import type { AnalyticsProvider } from './types';

export interface DebugEntry { i: number; t: number; sink: string; kind: 'init' | 'consent' | 'event' | 'user' | 'reset' | 'error'; name?: string; params?: Record<string, unknown> }

export class DebugBuffer {
  private rows: DebugEntry[] = [];
  private seq = 0;
  constructor(private readonly size = 500, private readonly echo: ((e: DebugEntry) => void) | null = null) {}
  push(e: Omit<DebugEntry, 'i' | 't'>): void {
    const row = { i: this.seq++, t: Date.now(), ...e };
    this.rows.push(row);
    if (this.rows.length > this.size) this.rows.splice(0, this.rows.length - this.size);
    try { this.echo?.(row); } catch { /* console missing */ }
  }
  all(): DebugEntry[] { return this.rows.slice(); }
  clear(): void { this.rows = []; }
}

export class DebugProvider implements AnalyticsProvider {
  constructor(readonly buffer: DebugBuffer, readonly purpose: Purpose = 'analytics', readonly name = 'debug') {}
  async init(consent: ConsentSnapshot): Promise<void> { this.buffer.push({ sink: this.name, kind: 'init', params: { ...consent } }); }
  setConsent(consent: ConsentSnapshot): void { this.buffer.push({ sink: this.name, kind: 'consent', params: { ...consent } }); }
  logEvent(name: EventName, params: Params): void { this.buffer.push({ sink: this.name, kind: 'event', name, params }); }
  setUserProps(props: Readonly<Record<string, string>>): void { this.buffer.push({ sink: this.name, kind: 'user', params: { ...props } }); }
  reset(): void { this.buffer.push({ sink: this.name, kind: 'reset' }); }
  recordError(error: Error, scope: string): void { this.buffer.push({ sink: this.name, kind: 'error', name: scope, params: { error: error.name } }); }
}
