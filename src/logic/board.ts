import type { Board, Player, Position, WinCheckResult } from '../types';
import { ROWS, COLS, WIN_LENGTH, EMPTY_CELL, DIRECTIONS } from '../constants';

export function createBoard(): Board {
  return Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY_CELL));
}

export function dropPiece(board: Board, column: number, player: Player): Board {
  const newBoard = board.map(row => [...row]);
  
  for (let row = ROWS - 1; row >= 0; row--) {
    if (newBoard[row]![column] === EMPTY_CELL) {
      newBoard[row]![column] = player;
      break;
    }
  }
  
  return newBoard;
}

export function checkWin(board: Board): WinCheckResult {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = board[row]![col]!;
      if (cell === EMPTY_CELL) continue;
      
      for (const [deltaRow, deltaCol] of DIRECTIONS) {
        const winningCells = checkDirection(board, row, col, deltaRow, deltaCol, cell);
        if (winningCells.length >= WIN_LENGTH) {
          return { winner: cell, winningCells };
        }
      }
    }
  }
  
  if (isBoardFull(board)) {
    return { winner: 'draw' };
  }
  
  return { winner: null };
}

function checkDirection(
  board: Board, 
  startRow: number, 
  startCol: number, 
  deltaRow: number, 
  deltaCol: number, 
  player: Player
): Position[] {
  const positions: Position[] = [];
  let row = startRow;
  let col = startCol;
  
  while (
    row >= 0 && 
    row < ROWS && 
    col >= 0 && 
    col < COLS && 
    board[row]![col] === player
  ) {
    positions.push({ row, col });
    row += deltaRow;
    col += deltaCol;
  }
  
  return positions;
}

export function isBoardFull(board: Board): boolean {
  return board[0]!.every(cell => cell !== EMPTY_CELL);
}

export function getValidColumns(board: Board): number[] {
  const validColumns: number[] = [];
  
  for (let col = 0; col < COLS; col++) {
    if (board[0]![col] === EMPTY_CELL) {
      validColumns.push(col);
    }
  }
  
  return validColumns;
}

export function getLowestEmptyRow(board: Board, column: number): number | null {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row]![column] === EMPTY_CELL) {
      return row;
    }
  }
  return null;
}