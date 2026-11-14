/** Web / vitest: no Meta SDK (native-only; never bundled for web). */
import type { MetaSdk } from './providers/MetaProvider';

export const metaLinked = (): boolean => false;
export async function loadMetaSdk(): Promise<MetaSdk | null> { return null; }
