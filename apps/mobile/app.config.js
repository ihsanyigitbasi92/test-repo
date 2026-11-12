/**
 * Dynamic Expo config on top of app.json (docs/design/17-analitik-ve-firebase.md §6–§7).
 *
 * app.json stays the single place for static values. This file only switches the NATIVE analytics SDKs on once
 * their credentials really exist, because their config plugins fail `expo prebuild` otherwise:
 *
 *   Firebase (Analytics + Crashlytics + Remote Config)
 *     on  ⇔ both files exist:  ./firebase/google-services.json  and  ./firebase/GoogleService-Info.plist
 *           (paths: app.json › expo.extra.analytics.firebase; EAS: env GOOGLE_SERVICES_JSON / GOOGLE_SERVICE_INFO_PLIST)
 *   Meta (react-native-fbsdk-next)
 *     on  ⇔ app.json › expo.extra.analytics.meta.appId and .clientToken no longer start with "PLACEHOLDER"
 *
 * Without them the app builds and runs exactly the same; the analytics layer finds no native module and stays
 * silent (src/analytics/firebaseSdk.native.ts, metaSdk.native.ts). The web export never loads either SDK.
 */
const fs = require('fs');
const path = require('path');

const isPlaceholder = (v) => !v || String(v).startsWith('PLACEHOLDER');
const exists = (p) => { try { return !!p && fs.existsSync(path.resolve(__dirname, p)); } catch { return false; } };
const nameOf = (p) => (Array.isArray(p) ? p[0] : p);

/** Adds a plugin, or shallow-merges `props` (one level into `ios` / `android`) into an entry that is already there. */
function upsert(plugins, name, props) {
  const i = plugins.findIndex((p) => nameOf(p) === name);
  if (i < 0) { plugins.push(props ? [name, props] : name); return; }
  if (!props) return;
  const old = Array.isArray(plugins[i]) ? plugins[i][1] ?? {} : {};
  const merged = { ...old };
  for (const k of Object.keys(props)) {
    const a = old[k], b = props[k];
    merged[k] = a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)
      ? { ...a, ...b, ...(Array.isArray(a.forceStaticLinking) && Array.isArray(b.forceStaticLinking) ? { forceStaticLinking: [...new Set([...a.forceStaticLinking, ...b.forceStaticLinking])] } : {}) }
      : a ?? b;                                                    // a value already set in app.json wins
  }
  plugins[i] = [name, merged];
}

module.exports = ({ config }) => {
  const analytics = (config.extra && config.extra.analytics) || {};
  const fb = analytics.firebase || {};
  const meta = analytics.meta || {};
  const plugins = [...(config.plugins || [])];
  const ios = { ...(config.ios || {}) };
  const android = { ...(config.android || {}) };

  // Store identifiers: app.json has none yet. The Firebase / Meta apps must be registered with exactly these.
  ios.bundleIdentifier = ios.bundleIdentifier || analytics.applicationId || 'com.d2ptechnology.motto';
  android.package = android.package || analytics.applicationId || 'com.d2ptechnology.motto';

  // ── Firebase ───────────────────────────────────────────────────────────────
  const androidFile = process.env.GOOGLE_SERVICES_JSON || fb.androidGoogleServicesFile || './firebase/google-services.json';
  const iosFile = process.env.GOOGLE_SERVICE_INFO_PLIST || fb.iosGoogleServicesFile || './firebase/GoogleService-Info.plist';
  const hasAndroid = exists(androidFile), hasIos = exists(iosFile);
  const firebaseOn = hasAndroid && hasIos;
  if (firebaseOn) {
    android.googleServicesFile = androidFile;
    ios.googleServicesFile = iosFile;
    // CocoaPods + static frameworks: one copy of GoogleAppMeasurement shared with the Google Mobile Ads pod.
    upsert(plugins, '@react-native-firebase/app', { ios: { disableSPM: true } });
    upsert(plugins, '@react-native-firebase/crashlytics');
    upsert(plugins, 'expo-build-properties', {
      ios: { useFrameworks: 'static', forceStaticLinking: ['RNFBApp', 'RNFBAnalytics', 'RNFBCrashlytics', 'RNFBRemoteConfig'] },
    });
  } else if (hasAndroid !== hasIos) {
    console.warn(`[app.config] Firebase is OFF: ${hasAndroid ? iosFile : androidFile} is missing (both config files are required — docs/design/17 §6).`);
  }

  // ── Meta ───────────────────────────────────────────────────────────────────
  const metaOn = !isPlaceholder(meta.appId) && !isPlaceholder(meta.clientToken);
  if (metaOn) {
    upsert(plugins, 'react-native-fbsdk-next', {
      appID: String(meta.appId),
      clientToken: String(meta.clientToken),
      displayName: meta.displayName || config.name,
      scheme: `fb${meta.appId}`,
      // Everything OFF until the player consents (src/analytics/providers/MetaProvider.ts switches them on).
      isAutoInitEnabled: false,
      autoLogAppEventsEnabled: false,
      advertiserIDCollectionEnabled: false,
      // The ATT purpose string belongs to the ad layer's plugin entry (one prompt, one text).
      iosUserTrackingPermission: false,
    });
  }

  return { ...config, ios, android, plugins, extra: { ...(config.extra || {}), analyticsBuild: { firebase: firebaseOn, meta: metaOn } } };
};
