import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

describe('D-098 determinism lint runs with the tests', () => {
  it('engine/src has no transcendental Math, `**`, or Math.random', () => {
    const r = spawnSync(process.execPath, [join(import.meta.dirname, '..', 'tools', 'check-no-transcendental.mjs')], { encoding: 'utf8' });
    expect(r.stderr).toBe('');
    expect(r.status).toBe(0);
  });
});
