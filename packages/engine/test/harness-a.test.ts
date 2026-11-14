import { describe, it } from 'vitest';
import { harness } from './helpers/harness';

// 1,000-life mini harness is split in two files so vitest runs the halves on separate workers (< 20 s wall).
describe('mini harness (lives 0–499)', () => { it('meets relaxed 03 §6.2 thresholds', () => harness(0, 500), 60_000); });
