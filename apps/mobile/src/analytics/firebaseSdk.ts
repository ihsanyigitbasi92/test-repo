/**
 * Web / vitest: there is no Firebase SDK (the native modules must not enter the web bundle; Metro and vitest
 * resolve this file, never `firebaseSdk.native.ts`).
 */
import type { FirebaseSdk } from './providers/FirebaseProvider';
import type { RemoteConfigSource } from './remoteConfig';

export const firebaseLinked = (): boolean => false;
export async function loadFirebaseSdk(): Promise<FirebaseSdk | null> { return null; }
export async function loadRemoteConfigSource(): Promise<RemoteConfigSource | null> { return null; }
