import { describe, it, expect } from 'vitest';
import { BUNDLE } from './helpers/content';

describe('content bundle used by the engine tests', () => {
  it('contains the six 03 §3 fixture days, all parsed by the single zod schema (D-099)', () => {
    const ids = BUNDLE.events.map((e) => e.id);
    for (const id of ['call_anne_hafta_sonu', 'evt_baris_kesin_plan_01', 'evt_nevin_hizalanma_01', 'evt_kurye_yanlis_adres', 'evt_kombi_ustasi_kis', 'evt_is_gorusmesi_ik'])
      expect(ids).toContain(id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(BUNDLE.skipLines.length).toBeGreaterThanOrEqual(5);
  });
});
