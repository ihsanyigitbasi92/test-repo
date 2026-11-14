import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/** Content production CLIs (scripts/validate|redline|dupes|count) — run as the package scripts do. */
const pkg = join(import.meta.dirname, '..');
const run = (script: string, ...args: string[]) =>
  spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings', '--import', './scripts/ts-register.mjs', `scripts/${script}.ts`, ...args], { cwd: pkg, encoding: 'utf8' });
const base = JSON.parse(readFileSync(join(pkg, 'fixtures', 'demo', 'evt_komsu_matkap.json'), 'utf8'));

let dir: string;
beforeAll(() => { dir = mkdtempSync(join(tmpdir(), 'cs-tools-')); });
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe('content production tools', () => {
  it('the shipped fixtures pass validate (recursive), redline and dupes', () => {
    const v = run('validate', 'fixtures', '-q');
    expect(v.status, v.stderr).toBe(0);
    expect(v.stdout).toMatch(/ events, 0 error/);
    expect(run('redline').status).toBe(0);
    expect(run('dupes').status).toBe(0);
  }, 180_000);   // the whole production pool (D-155: growing to 10.000 events) — well past the 5 s default

  it('validate walks nested domain folders', () => {
    const d = join(dir, 'pack', 'egitim_universite');
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, 'evt_nested.json'), JSON.stringify({ ...base, id: 'evt_nested' }));
    const r = run('validate', join(dir, 'pack'));
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/1 events, 0 error/);
  });

  it('redline blocks brands, religion, politicians, self-harm and ungated gambling — without everyday false positives', () => {
    const ev = structuredClone(base);
    ev.dialog[0].tr = "Netflix'te dizi, camide dua.";
    ev.dialog[0].en = 'Trump said he would bet on it.';
    ev.dialog[1].tr = 'Valizini aldı, çamı gördü, seçim yaptı, esrarengiz bir hadise.';
    ev.dialog[1].en = 'He looked at the visa and sighed.';
    const f = join(dir, 'bad.json');
    writeFileSync(f, JSON.stringify(ev));
    const r = run('redline', f);
    expect(r.status).toBe(1);
    for (const t of ['netflix', 'camide', 'dua', 'Trump', 'bet']) expect(r.stderr).toContain(`«${t}»`);
    expect(r.stderr).not.toMatch(/dialog\[1\]/);
  });

  it('dupes flags a lightly reworded copy', () => {
    const ev = structuredClone(base);
    ev.id = 'evt_copy';
    ev.dialog[2].tr = 'Duvar beton çıktı, ben de betonum aslında.';
    const a = join(dir, 'dup');
    mkdirSync(a);
    writeFileSync(join(a, 'evt_komsu_matkap.json'), JSON.stringify(base));
    writeFileSync(join(a, 'evt_copy.json'), JSON.stringify(ev));
    const r = run('dupes', a);
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/evt_copy.*evt_komsu_matkap|evt_komsu_matkap.*evt_copy/);
  });

  it('count reports per-domain totals against the taxonomy quotas', () => {
    const r = run('count', '--no-write');
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/Paket \(alan\) toplamı: \d+ \/ 10000/);
  });
});
