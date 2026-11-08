#!/usr/bin/env node
/** D-098 guard: the engine runtime (src/) must not call transcendental Math functions or Math.random. */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const banned = /Math\.(exp|pow|log|log2|log10|sqrt|cbrt|tanh|sinh|cosh|sin|cos|tan|asin|acos|atan|atan2|random)\b/g;
let bad = 0;
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (p.endsWith('.ts')) { const m = readFileSync(p, 'utf8').match(banned); if (m) { bad++; console.error(`✗ ${p}: ${[...new Set(m)].join(', ')}`); } } } };
walk(root);
console.log(bad ? `${bad} file(s) violate D-098` : '✓ no transcendental math in engine/src');
process.exit(bad ? 1 : 0);
