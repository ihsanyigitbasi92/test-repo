#!/usr/bin/env node
/**
 * D-156: publishes the content packs next to the web export — assets/content/*.json → dist/content/ — so the web
 * loader (src/content/packs.ts) can fetch `content/<pack>.json` relative to index.html.
 * Usage (after `expo export --platform web`): node scripts/copy-content.mjs [distDir]
 */
import { cpSync, existsSync, readdirSync, rmSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(app, 'assets', 'content');
const dist = resolve(app, process.argv[2] ?? 'dist');
if (!existsSync(join(src, 'manifest.json'))) {
  console.error(`✗ ${src}/manifest.json missing — run \`pnpm --filter @motto/content-schema build:packs\` first`);
  process.exit(1);
}
if (!existsSync(join(dist, 'index.html'))) { console.error(`✗ ${dist}/index.html missing — run the web export first`); process.exit(1); }
const out = join(dist, 'content');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const files = readdirSync(src).filter((f) => f.endsWith('.json'));
for (const f of files) cpSync(join(src, f), join(out, f));
console.log(`copy-content: ${files.length} files → ${out}`);
