/** App-wide tutorial store bound to device storage (tutorial.ts holds the logic). Loaded at import, like the age gate. */
import { useSyncExternalStore } from 'react';
import { TutorialStore } from './tutorial';
import type { TutorialState } from './tutorial';
import { SAVE_KEY } from './save';
import { readItem, writeItem } from './storage';

// TODO(analytics): no intro / hint events exist in src/analytics yet (the existing `tutorial_begin` /
// `tutorial_complete` marks belong to the first-life FTUE funnel). Wire `onEvent` to e.g. `ftue_intro_open`,
// `ftue_intro_done {page}`, `ftue_intro_skip {page}`, `ftue_hint {id}` once the analytics schema has them
// (docs/design/18 §7).
export const tutorial = new TutorialStore({ kv: { read: readItem, write: writeItem }, saveKey: SAVE_KEY });
void tutorial.load();

export const useTutorial = (): TutorialState => useSyncExternalStore(tutorial.subscribe, tutorial.getState, tutorial.getState);
