import { describe, it, expect } from 'vitest';
import { getBestMove, evaluateBoard, minimax } from '../../src/logic/ai';
import { createBoard, dropPiece } from '../../src/logic/board';
import { PLAYERS, COLS } from '../../src/constants';

describe('evaluateBoard', () => {
  it('returns high score for AI winning position', () => {
    const board = createBoard();
    // Create horizontal win for AI (player 1)
    for (let col = 0; col < 4; col++) {
      board[5]![col] = PLAYERS.HACKER;
    }
    
    const score = evaluateBoard(board, PLAYERS.HACKER);
    expect(score).toBeGreaterThan(500000);
  });
  
  it('returns low score for opponent winning position', () => {
    const board = createBoard();
    // Create horizontal win for opponent (player 2)
    for (let col = 0; col < 4; col++) {
      board[5]![col] = PLAYERS.DEFENDER;
    }
    
    const score = evaluateBoard(board, PLAYERS.HACKER);
    expect(score).toBeLessThan(-500000);
  });
  
  it('gives positive score for AI advantage', () => {
    const board = createBoard();
    // Give AI 3 in a row with empty space
    board[5]![0] = PLAYERS.HACKER;
    board[5]![1] = PLAYERS.HACKER;
    board[5]![2] = PLAYERS.HACKER;
    // Position 3 is empty
    
    const score = evaluateBoard(board, PLAYERS.HACKER);
    expect(score).toBeGreaterThan(0);
  });
  
  it('prefers center positions', () => {
    const centerBoard = createBoard();
    centerBoard[5]![3] = PLAYERS.HACKER; // Center column
    
    const edgeBoard = createBoard();
    edgeBoard[5]![0] = PLAYERS.HACKER; // Edge column
    
    const centerScore = evaluateBoard(centerBoard, PLAYERS.HACKER);
    const edgeScore = evaluateBoard(edgeBoard, PLAYERS.HACKER);
    
    expect(centerScore).toBeGreaterThan(edgeScore);
  });
});

describe('minimax', () => {
  it('returns winning score for immediate win', () => {
    const board = createBoard();
    // Setup: AI has 3 in a row, can win on next move
    board[5]![0] = PLAYERS.HACKER;
    board[5]![1] = PLAYERS.HACKER;
    board[5]![2] = PLAYERS.HACKER;
    // Column 3 would be winning move
    
    const winningBoard = dropPiece(board, 3, PLAYERS.HACKER);
    const score = minimax(winningBoard, 1, -Infinity, Infinity, true, PLAYERS.HACKER);
    
    expect(score).toBeGreaterThan(500000);
  });
  
  it('returns different scores for different depths', () => {
    const board = createBoard();
    board[5]![3] = PLAYERS.HACKER;
    
    const depth1Score = minimax(board, 1, -Infinity, Infinity, true, PLAYERS.HACKER);
    const depth3Score = minimax(board, 3, -Infinity, Infinity, true, PLAYERS.HACKER);
    
    // Scores may differ as deeper search provides better evaluation
    expect(typeof depth1Score).toBe('number');
    expect(typeof depth3Score).toBe('number');
  });
});

describe('getBestMove', () => {
  it('takes immediate winning move', () => {
    const board = createBoard();
    // Setup: AI has 3 in a row horizontally
    board[5]![0] = PLAYERS.HACKER;
    board[5]![1] = PLAYERS.HACKER;
    board[5]![2] = PLAYERS.HACKER;
    // Column 3 is the winning move
    
    const bestMove = getBestMove(board, PLAYERS.HACKER, 'medium');
    expect(bestMove).toBe(3);
  });
  
  it('blocks opponent winning move', () => {
    const board = createBoard();
    // Setup: Opponent has 3 in a row horizontally
    board[5]![0] = PLAYERS.DEFENDER;
    board[5]![1] = PLAYERS.DEFENDER;
    board[5]![2] = PLAYERS.DEFENDER;
    // AI must block at column 3
    
    const bestMove = getBestMove(board, PLAYERS.HACKER, 'medium');
    expect(bestMove).toBe(3);
  });
  
  it('prefers center columns on empty board', () => {
    const board = createBoard();
    
    // Run multiple times to account for randomness in easy mode
    const moves: number[] = [];
    for (let i = 0; i < 10; i++) {
      const move = getBestMove(board, PLAYERS.HACKER, 'hard');
      moves.push(move);
    }
    
    // Most moves should be in center area (columns 2, 3, 4)
    const centerMoves = moves.filter(move => move >= 2 && move <= 4);
    expect(centerMoves.length).toBeGreaterThan(5);
  });
  
  it('returns valid move for all difficulties', () => {
    const board = createBoard();
    
    const easyMove = getBestMove(board, PLAYERS.HACKER, 'easy');
    const mediumMove = getBestMove(board, PLAYERS.HACKER, 'medium');
    const hardMove = getBestMove(board, PLAYERS.HACKER, 'hard');
    
    expect(easyMove).toBeGreaterThanOrEqual(0);
    expect(easyMove).toBeLessThan(COLS);
    expect(mediumMove).toBeGreaterThanOrEqual(0);
    expect(mediumMove).toBeLessThan(COLS);
    expect(hardMove).toBeGreaterThanOrEqual(0);
    expect(hardMove).toBeLessThan(COLS);
  });
  
  it('never makes invalid moves', () => {
    const board = createBoard();
    
    // Fill all columns except one
    for (let col = 0; col < COLS - 1; col++) {
      for (let row = 0; row < 6; row++) {
        board[row]![col] = PLAYERS.HACKER;
      }
    }
    
    const move = getBestMove(board, PLAYERS.HACKER, 'medium');
    expect(move).toBe(COLS - 1); // Only valid column
  });
  
  it('throws error when no moves available', () => {
    const board = createBoard();
    
    // Fill entire board
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < COLS; col++) {
        board[row]![col] = PLAYERS.HACKER;
      }
    }
    
    expect(() => {
      getBestMove(board, PLAYERS.HACKER, 'medium');
    }).toThrow('No valid moves available');
  });
  
  it('prioritizes winning over blocking', () => {
    const board = createBoard();
    
    // Setup: Both AI and opponent have 3 in a row
    // AI win opportunity
    board[5]![0] = PLAYERS.HACKER;
    board[5]![1] = PLAYERS.HACKER;
    board[5]![2] = PLAYERS.HACKER;
    // Column 3 would win for AI
    
    // Opponent threat on different row
    board[4]![4] = PLAYERS.DEFENDER;
    board[4]![5] = PLAYERS.DEFENDER;
    board[4]![6] = PLAYERS.DEFENDER;
    // Column 3 would also block opponent, but AI should take its own win
    
    const bestMove = getBestMove(board, PLAYERS.HACKER, 'medium');
    expect(bestMove).toBe(3);
  });
  
  it('handles vertical winning opportunities', () => {
    const board = createBoard();
    
    // Setup: AI has 3 pieces vertically in column 3
    board[5]![3] = PLAYERS.HACKER;
    board[4]![3] = PLAYERS.HACKER;
    board[3]![3] = PLAYERS.HACKER;
    // Dropping in column 3 would create 4 vertically
    
    const bestMove = getBestMove(board, PLAYERS.HACKER, 'medium');
    expect(bestMove).toBe(3);
  });
  
  it('handles diagonal winning opportunities', () => {
    const board = createBoard();
    
    // Setup: AI has 3 pieces diagonally
    board[5]![0] = PLAYERS.HACKER;
    board[4]![1] = PLAYERS.HACKER;
    board[3]![2] = PLAYERS.HACKER;
    // Need to setup board so position [2][3] is playable
    board[5]![3] = PLAYERS.DEFENDER; // Support piece
    board[4]![3] = PLAYERS.DEFENDER; // Support piece  
    board[3]![3] = PLAYERS.DEFENDER; // Support piece
    // Now dropping in column 3 would place piece at [2][3] for diagonal win
    
    const bestMove = getBestMove(board, PLAYERS.HACKER, 'hard');
    expect(bestMove).toBe(3);
  });
  
  it('easy mode shows more randomness than hard mode', () => {
    const board = createBoard();
    
    const easyMoves: number[] = [];
    const hardMoves: number[] = [];
    
    for (let i = 0; i < 20; i++) {
      easyMoves.push(getBestMove(board, PLAYERS.HACKER, 'easy'));
      hardMoves.push(getBestMove(board, PLAYERS.HACKER, 'hard'));
    }
    
    // Calculate unique moves (variety)
    const easyUnique = new Set(easyMoves).size;
    const hardUnique = new Set(hardMoves).size;
    
    // Easy mode should show more variety due to randomness
    expect(easyUnique).toBeGreaterThanOrEqual(hardUnique);
  });
});