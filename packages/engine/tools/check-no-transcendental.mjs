#!/usr/bin/env node
/**
 * D-098 guard: the engine runtime (src/) must not use transcendental / platform-dependent float math:
 * Math.exp, expm1, pow, log (all variants), sqrt, cbrt, hypot, fround, trig, hyperbolic, Math.random, or the `**` operator.
 * Comments and string literals are stripped first so documentation may mention them. Run by `test/lint.test.ts`.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const banned = /Math\.(exp|expm1|pow|log|log1p|log2|log10|sqrt|cbrt|hypot|fround|tanh|sinh|cosh|asinh|acosh|atanh|sin|cos|tan|asin|acos|atan|atan2|random)\b|\*\*/g;
/** Drop block/line comments and quoted strings (template literals keep their `${}` code). */
const strip = (src) => src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/(^|[^:\\])\/\/.*$/gm, '$1')
  .replace(/'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"/g, '""');
let bad = 0;
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.ts')) {
      const m = strip(readFileSync(p, 'utf8')).match(banned);
      if (m) { bad++; console.error(`✗ ${p}: ${[...new Set(m)].join(', ')}`); }
    }
  }
};
walk(root);
console.log(bad ? `${bad} file(s) violate D-098` : '✓ no transcendental math in engine/src');
process.exit(bad ? 1 : 0);
