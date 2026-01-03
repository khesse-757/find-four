import type { AIDifficulty } from './types';

export const ROWS = 6;
export const COLS = 7;
export const WIN_LENGTH = 4;

export const AI_DEPTHS: Record<AIDifficulty, number> = {
  easy: 2,
  medium: 4,
  hard: 6
};

export const AI_RANDOMNESS: Record<AIDifficulty, number> = {
  easy: 0.3,
  medium: 0.1,
  hard: 0.0
};

export const PLAYERS = {
  HACKER: 1 as const,
  DEFENDER: 2 as const
};

export const EMPTY_CELL = 0;

export const DIRECTIONS = [
  [0, 1],   // horizontal
  [1, 0],   // vertical
  [1, 1],   // diagonal down-right
  [1, -1]   // diagonal down-left
] as const;