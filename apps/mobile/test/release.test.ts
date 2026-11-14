/**
 * Store release blockers (docs/store/checklist.md §0, §5; compliance.md R1, R2): icon set, iOS/Android config keys,
 * bundled OFL fonts + their in-app licence page, EAS profiles. Static checks on app.json / eas.json / assets.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ALL_LEGAL_TEXTS, LICENSES, parseLegal } from '../src/legal';

const APP = join(__dirname, '..');
const appJson = JSON.parse(readFileSync(join(APP, 'app.json'), 'utf8')).expo;
const pkg = JSON.parse(readFileSync(join(APP, 'package.json'), 'utf8'));

/** Width, height, colour type of a PNG (IHDR). */
function png(p: string): { w: number; h: number; alpha: boolean } {
  const b = readFileSync(join(APP, p));
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), alpha: b[25] === 6 || b[25] === 4 };
}

describe('icon set (compliance R1)', () => {
  it('iOS icon is 1024² without an alpha channel; Android layers are 1024² with alpha; adaptive bg = paper', () => {
    expect(png(appJson.icon)).toEqual({ w: 1024, h: 1024, alpha: false });
    expect(png(appJson.android.adaptiveIcon.foregroundImage)).toEqual({ w: 1024, h: 1024, alpha: true });
    expect(png(appJson.android.adaptiveIcon.monochromeImage)).toEqual({ w: 1024, h: 1024, alpha: true });
    expect(appJson.android.adaptiveIcon.backgroundColor).toBe('#101410');
    expect(appJson.android.adaptiveIcon.backgroundImage).toBeUndefined();
    expect(png(appJson.web.favicon)).toMatchObject({ w: 48, h: 48 });
  });
});

describe('store config keys', () => {
  it('iPhone only, export compliance exempt, privacy manifest with required-reason APIs', () => {
    expect(appJson.ios.supportsTablet).toBe(false);
    expect(appJson.ios.config.usesNonExemptEncryption).toBe(false);
    const apis = Object.fromEntries(appJson.ios.privacyManifests.NSPrivacyAccessedAPITypes.map((a: { NSPrivacyAccessedAPIType: string; NSPrivacyAccessedAPITypeReasons: string[] }) => [a.NSPrivacyAccessedAPIType, a.NSPrivacyAccessedAPITypeReasons]));
    expect(apis).toMatchObject({
      NSPrivacyAccessedAPICategoryUserDefaults: ['CA92.1'], NSPrivacyAccessedAPICategoryFileTimestamp: ['C617.1'],
      NSPrivacyAccessedAPICategorySystemBootTime: ['35F9.1'], NSPrivacyAccessedAPICategoryDiskSpace: ['E174.1'],
    });
    const collected = appJson.ios.privacyManifests.NSPrivacyCollectedDataTypes.map((d: { NSPrivacyCollectedDataType: string }) => d.NSPrivacyCollectedDataType);
    expect(collected).not.toContain('NSPrivacyCollectedDataTypePreciseLocation');       // compliance.md §1.2
    expect(collected).toContain('NSPrivacyCollectedDataTypeCrashData');
  });
  it('Android: no microphone, storage, overlay, camera or location permission', () => {
    for (const p of ['RECORD_AUDIO', 'SYSTEM_ALERT_WINDOW', 'READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE', 'CAMERA', 'ACCESS_FINE_LOCATION']) {
      expect(appJson.android.blockedPermissions).toContain(`android.permission.${p}`);
    }
  });
  it('EAS: three build profiles + submit; content packs are built on the EAS worker', () => {
    const eas = JSON.parse(readFileSync(join(APP, 'eas.json'), 'utf8'));
    expect(Object.keys(eas.build)).toEqual(expect.arrayContaining(['development', 'preview', 'production']));
    expect(eas.build.production.android.buildType).toBe('app-bundle');
    expect(eas.submit.production).toBeDefined();
    expect(pkg.scripts['eas-build-post-install']).toMatch(/content:packs|build:packs/);
  });
});

describe('bundled fonts (compliance R2) and their licences', () => {
  const plugin = appJson.plugins.find((p: unknown) => Array.isArray(p) && p[0] === 'expo-font')?.[1];
  it('expo-font embeds Fraunces, IBM Plex Sans and Archivo Black on both platforms; every file exists', () => {
    expect(plugin).toBeDefined();
    const files = [...plugin.ios.fonts, ...plugin.android.fonts.flatMap((f: { fontDefinitions: { path: string }[] }) => f.fontDefinitions.map((d) => d.path))];
    for (const f of files) expect(existsSync(join(APP, f)), f).toBe(true);
    expect(plugin.android.fonts.map((f: { fontFamily: string }) => f.fontFamily).sort()).toEqual(['Archivo Black', 'Fraunces', 'IBM Plex Sans']);
  });
  it('the licence page names every font, carries the full OFL 1.1 and is reachable from the legal screen', () => {
    for (const loc of ['tr', 'en'] as const) {
      const t = LICENSES[loc];
      expect(parseLegal(t)[0]!.k).toBe('title');
      for (const f of ['Fraunces Project Authors', 'IBM Corp.', 'Archivo Black Project Authors', 'SIL OPEN FONT LICENSE Version 1.1', 'DISCLAIMER']) expect(t).toContain(f);
    }
    expect(ALL_LEGAL_TEXTS.licenses).toBe(LICENSES);
  });
});
