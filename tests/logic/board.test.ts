import { describe, it, expect } from 'vitest';
import { 
  createBoard, 
  dropPiece, 
  checkWin, 
  isBoardFull, 
  getValidColumns,
  getLowestEmptyRow
} from '../../src/logic/board';
import { isValidMove, isColumnFull } from '../../src/logic/validation';
import { ROWS, COLS, PLAYERS } from '../../src/constants';
import type { Board } from '../../src/types';

describe('createBoard', () => {
  it('creates empty board with correct dimensions', () => {
    const board = createBoard();
    expect(board).toHaveLength(ROWS);
    expect(board[0]).toHaveLength(COLS);
    
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        expect(board[row]![col]).toBe(0);
      }
    }
  });
});

describe('dropPiece', () => {
  it('drops piece to bottom of empty column', () => {
    const board = createBoard();
    const result = dropPiece(board, 0, PLAYERS.HACKER);
    
    expect(result[ROWS - 1]![0]).toBe(PLAYERS.HACKER);
    expect(result[ROWS - 2]![0]).toBe(0);
  });
  
  it('stacks pieces correctly', () => {
    let board = createBoard();
    board = dropPiece(board, 0, PLAYERS.HACKER);
    board = dropPiece(board, 0, PLAYERS.DEFENDER);
    
    expect(board[ROWS - 1]![0]).toBe(PLAYERS.HACKER);
    expect(board[ROWS - 2]![0]).toBe(PLAYERS.DEFENDER);
    expect(board[ROWS - 3]![0]).toBe(0);
  });
  
  it('does not modify original board', () => {
    const board = createBoard();
    const originalCell = board[ROWS - 1]![0];
    dropPiece(board, 0, PLAYERS.HACKER);
    
    expect(board[ROWS - 1]![0]).toBe(originalCell);
  });
  
  it('fills column completely', () => {
    let board = createBoard();
    
    for (let i = 0; i < ROWS; i++) {
      board = dropPiece(board, 0, PLAYERS.HACKER);
    }
    
    for (let row = 0; row < ROWS; row++) {
      expect(board[row]![0]).toBe(PLAYERS.HACKER);
    }
  });
});

describe('checkWin', () => {
  it('detects no winner on empty board', () => {
    const board = createBoard();
    const result = checkWin(board);
    
    expect(result.winner).toBe(null);
    expect(result.winningCells).toBeUndefined();
  });
  
  it('detects horizontal win', () => {
    const board = createBoard();
    const row = ROWS - 1;
    
    for (let col = 0; col < 4; col++) {
      board[row]![col] = PLAYERS.HACKER;
    }
    
    const result = checkWin(board);
    expect(result.winner).toBe(PLAYERS.HACKER);
    expect(result.winningCells).toHaveLength(4);
    expect(result.winningCells![0]).toEqual({ row, col: 0 });
    expect(result.winningCells![3]).toEqual({ row, col: 3 });
  });
  
  it('detects vertical win', () => {
    const board = createBoard();
    const col = 0;
    
    for (let row = ROWS - 4; row < ROWS; row++) {
      board[row]![col] = PLAYERS.DEFENDER;
    }
    
    const result = checkWin(board);
    expect(result.winner).toBe(PLAYERS.DEFENDER);
    expect(result.winningCells).toHaveLength(4);
    expect(result.winningCells![0]).toEqual({ row: ROWS - 4, col });
    expect(result.winningCells![3]).toEqual({ row: ROWS - 1, col });
  });
  
  it('detects diagonal win (down-right)', () => {
    const board = createBoard();
    
    for (let i = 0; i < 4; i++) {
      board[ROWS - 1 - i]![i] = PLAYERS.HACKER;
    }
    
    const result = checkWin(board);
    expect(result.winner).toBe(PLAYERS.HACKER);
    expect(result.winningCells).toHaveLength(4);
  });
  
  it('detects diagonal win (down-left)', () => {
    const board = createBoard();
    
    for (let i = 0; i < 4; i++) {
      board[ROWS - 1 - i]![3 - i] = PLAYERS.DEFENDER;
    }
    
    const result = checkWin(board);
    expect(result.winner).toBe(PLAYERS.DEFENDER);
    expect(result.winningCells).toHaveLength(4);
  });
  
  it('detects draw when board is full with no winner', () => {
    // Simple approach: just create a specific known pattern without 4-in-a-row
    const board: Board = [
      [1, 2, 1, 2, 1, 2, 1],
      [2, 1, 2, 1, 2, 1, 2], 
      [2, 1, 2, 1, 2, 1, 2],
      [1, 2, 1, 2, 1, 2, 1],
      [1, 2, 1, 2, 1, 2, 1],
      [2, 1, 2, 1, 2, 1, 2]
    ];
    
    const result = checkWin(board);
    expect(result.winner).toBe('draw');
  });
  
  it('prioritizes win over draw', () => {
    const board = createBoard();
    
    // Fill entire board except last row
    for (let row = 0; row < ROWS - 1; row++) {
      for (let col = 0; col < COLS; col++) {
        board[row]![col] = (row + col) % 2 === 0 ? PLAYERS.HACKER : PLAYERS.DEFENDER;
      }
    }
    
    // Add winning horizontal line in last row
    for (let col = 0; col < 4; col++) {
      board[ROWS - 1]![col] = PLAYERS.HACKER;
    }
    
    // Fill remaining cells
    for (let col = 4; col < COLS; col++) {
      board[ROWS - 1]![col] = PLAYERS.DEFENDER;
    }
    
    const result = checkWin(board);
    expect(result.winner).toBe(PLAYERS.HACKER);
  });
});

describe('isBoardFull', () => {
  it('returns false for empty board', () => {
    const board = createBoard();
    expect(isBoardFull(board)).toBe(false);
  });
  
  it('returns false for partially filled board', () => {
    const board = createBoard();
    board[ROWS - 1]![0] = PLAYERS.HACKER;
    expect(isBoardFull(board)).toBe(false);
  });
  
  it('returns true when top row is completely filled', () => {
    const board = createBoard();
    
    for (let col = 0; col < COLS; col++) {
      board[0]![col] = PLAYERS.HACKER;
    }
    
    expect(isBoardFull(board)).toBe(true);
  });
});

describe('getValidColumns', () => {
  it('returns all columns for empty board', () => {
    const board = createBoard();
    const validColumns = getValidColumns(board);
    
    expect(validColumns).toHaveLength(COLS);
    expect(validColumns).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });
  
  it('excludes full columns', () => {
    const board = createBoard();
    
    // Fill column 0
    for (let row = 0; row < ROWS; row++) {
      board[row]![0] = PLAYERS.HACKER;
    }
    
    // Fill column 3
    for (let row = 0; row < ROWS; row++) {
      board[row]![3] = PLAYERS.DEFENDER;
    }
    
    const validColumns = getValidColumns(board);
    expect(validColumns).toEqual([1, 2, 4, 5, 6]);
  });
  
  it('returns empty array when board is full', () => {
    const board = createBoard();
    
    for (let col = 0; col < COLS; col++) {
      board[0]![col] = PLAYERS.HACKER;
    }
    
    const validColumns = getValidColumns(board);
    expect(validColumns).toEqual([]);
  });
});

describe('getLowestEmptyRow', () => {
  it('returns bottom row for empty column', () => {
    const board = createBoard();
    expect(getLowestEmptyRow(board, 0)).toBe(ROWS - 1);
  });
  
  it('returns correct row for partially filled column', () => {
    const board = createBoard();
    board[ROWS - 1]![0] = PLAYERS.HACKER;
    board[ROWS - 2]![0] = PLAYERS.DEFENDER;
    
    expect(getLowestEmptyRow(board, 0)).toBe(ROWS - 3);
  });
  
  it('returns null for full column', () => {
    const board = createBoard();
    
    for (let row = 0; row < ROWS; row++) {
      board[row]![0] = PLAYERS.HACKER;
    }
    
    expect(getLowestEmptyRow(board, 0)).toBe(null);
  });
});

describe('isValidMove', () => {
  it('returns true for valid column in empty board', () => {
    const board = createBoard();
    
    for (let col = 0; col < COLS; col++) {
      expect(isValidMove(board, col)).toBe(true);
    }
  });
  
  it('returns false for negative column', () => {
    const board = createBoard();
    expect(isValidMove(board, -1)).toBe(false);
  });
  
  it('returns false for column beyond board width', () => {
    const board = createBoard();
    expect(isValidMove(board, COLS)).toBe(false);
  });
  
  it('returns false for full column', () => {
    const board = createBoard();
    
    for (let row = 0; row < ROWS; row++) {
      board[row]![0] = PLAYERS.HACKER;
    }
    
    expect(isValidMove(board, 0)).toBe(false);
  });
});

describe('isColumnFull', () => {
  it('returns false for empty column', () => {
    const board = createBoard();
    expect(isColumnFull(board, 0)).toBe(false);
  });
  
  it('returns false for partially filled column', () => {
    const board = createBoard();
    board[ROWS - 1]![0] = PLAYERS.HACKER;
    expect(isColumnFull(board, 0)).toBe(false);
  });
  
  it('returns true for completely filled column', () => {
    const board = createBoard();
    
    for (let row = 0; row < ROWS; row++) {
      board[row]![0] = PLAYERS.HACKER;
    }
    
    expect(isColumnFull(board, 0)).toBe(true);
  });
  
  it('returns true for invalid column indices', () => {
    const board = createBoard();
    expect(isColumnFull(board, -1)).toBe(true);
    expect(isColumnFull(board, COLS)).toBe(true);
  });
});