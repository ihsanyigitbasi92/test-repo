import { describe, it } from 'vitest';
import { harness } from './helpers/harness';

describe('mini harness (lives 500–999)', () => { it('meets relaxed 03 §6.2 thresholds', () => harness(500, 1000), 60_000); });
