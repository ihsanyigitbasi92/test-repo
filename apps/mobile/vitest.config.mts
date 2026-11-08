import { defineConfig } from 'vitest/config';
// Pure-TS UI logic only (avatar look / moments / roast); React Native components are covered by the web export.
export default defineConfig({ test: { include: ['test/**/*.test.ts'], environment: 'node' } });
