import type { Board } from '../types';
import { ROWS, COLS, EMPTY_CELL } from '../constants';

export function isValidMove(board: Board, column: number): boolean {
  if (column < 0 || column >= COLS) {
    return false;
  }
  
  return !isColumnFull(board, column);
}

export function isColumnFull(board: Board, column: number): boolean {
  if (column < 0 || column >= COLS) {
    return true;
  }
  
  return board[0]![column] !== EMPTY_CELL;
}

export function isValidPosition(row: number, col: number): boolean {
  return row >= 0 && row < ROWS && col >= 0 && col < COLS;
}