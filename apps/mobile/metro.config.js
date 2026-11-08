// Monorepo-aware Metro config (pnpm workspaces)
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const config = getDefaultConfig(projectRoot);
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.unstable_enableSymlinks = true;
// D-156: content packs. Every Metro run (`expo start`, `expo export`, also when invoked as plain `npx expo …`) rebuilds
// them from packages/content-schema/fixtures/pack/** so they never go stale, then mirrors them into public/content/:
// Expo copies public/ into the web export (dist/content/<pack>.json, fetched by src/content/packs.ts) and serves it
// in `expo start --web`. Native builds require() assets/content/ (src/content/packs.native.ts).
// MOTTO_SKIP_CONTENT_PACKS=1 skips the rebuild (the existing assets/content/ is still mirrored).
const fs = require('fs');
const { execFileSync } = require('child_process');
const contentDir = path.resolve(projectRoot, 'assets', 'content');
const publicContentDir = path.resolve(projectRoot, 'public', 'content');
if (!process.env.MOTTO_SKIP_CONTENT_PACKS && !globalThis.__mottoPacksBuilt) {
  globalThis.__mottoPacksBuilt = true;
  const schemaDir = path.resolve(workspaceRoot, 'packages', 'content-schema');
  execFileSync(process.execPath, [
    '--experimental-strip-types', '--no-warnings', '--import', './scripts/ts-register.mjs', 'scripts/build-packs.ts',
    '--out', contentDir, '-q',
  ], { cwd: schemaDir, stdio: ['ignore', 'ignore', 'inherit'] });
}
if (fs.existsSync(path.join(contentDir, 'manifest.json'))) {
  fs.rmSync(publicContentDir, { recursive: true, force: true });
  fs.mkdirSync(publicContentDir, { recursive: true });
  for (const f of fs.readdirSync(contentDir)) if (f.endsWith('.json')) fs.copyFileSync(path.join(contentDir, f), path.join(publicContentDir, f));
}
module.exports = config;
