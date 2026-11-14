/**
 * One geometry for the share card, in pixels of the 1080-wide output: the RN view (ShareCardView) scales it to its
 * width, the web canvas renderer (render.ts) draws it 1:1. Pure TS.
 */
import type { ShareFormat } from './shareCard';

/** "Night notebook" palette of the game (theme.ts), fixed here so the PNG never depends on runtime theme state. */
export const SHARE_COLORS = {
  bg: '#101410', sheet: '#181e18', line: '#3a4438', ink: '#f1eee2', ink2: '#a8ab9c', lime: '#c9ff3a', limeInk: '#1a2200',
  gold: '#ffcf4a', red: '#ff4d63', face: '#6f746c', faceEdge: '#5a5f58',
} as const;

export interface ShareLayout {
  W: number; H: number; pad: number; sheetPad: number; tabFont: number; avatar: number; nameFont: number; yearsFont: number;
  farewellFont: number; gap: number; rowGap: number; labelFont: number; rowFont: number; maxRows: number; wordFont: number;
  wordLines: number; stampFont: number; stampRight: number; stampBottom: number; foot: number; footGap: number;
  mottoFont: number; byFont: number; linkFont: number;
}

const STORY: ShareLayout = {
  W: 1080, H: 1920, pad: 64, sheetPad: 64, tabFont: 40, avatar: 300, nameFont: 76, yearsFont: 38, farewellFont: 40,
  gap: 64, rowGap: 26, labelFont: 26, rowFont: 44, maxRows: 4, wordFont: 46, wordLines: 4,
  stampFont: 96, stampRight: 54, stampBottom: 60, foot: 110, footGap: 34, mottoFont: 56, byFont: 34, linkFont: 28,
};
const SQUARE: ShareLayout = {
  W: 1080, H: 1080, pad: 44, sheetPad: 44, tabFont: 32, avatar: 200, nameFont: 58, yearsFont: 30, farewellFont: 32,
  gap: 30, rowGap: 14, labelFont: 21, rowFont: 34, maxRows: 3, wordFont: 34, wordLines: 2,
  stampFont: 70, stampRight: 36, stampBottom: 36, foot: 84, footGap: 22, mottoFont: 42, byFont: 26, linkFont: 22,
};

export const shareLayout = (f: ShareFormat): ShareLayout => (f === 'square' ? SQUARE : STORY);
