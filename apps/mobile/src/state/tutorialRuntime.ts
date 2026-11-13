/** App-wide tutorial store bound to device storage (tutorial.ts holds the logic). Loaded at import, like the age gate. */
import { useSyncExternalStore } from 'react';
import { TutorialStore } from './tutorial';
import type { TutorialState } from './tutorial';
import { SAVE_KEY } from './save';
import { readItem, writeItem } from './storage';

import { trackTutorialEvent } from '../analytics/hooks';

// Analytics (docs/design/17 §3, 18 §7): intro open / done / skip and hints → ftue_intro_* / ftue_hint (consent-gated there).
export const tutorial = new TutorialStore({ kv: { read: readItem, write: writeItem }, saveKey: SAVE_KEY, onEvent: trackTutorialEvent });
void tutorial.load();

export const useTutorial = (): TutorialState => useSyncExternalStore(tutorial.subscribe, tutorial.getState, tutorial.getState);
