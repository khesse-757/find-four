import type { Board, Player, AIDifficulty } from '../types';
import { dropPiece, checkWin, getValidColumns } from './board';
import { ROWS, COLS, AI_DEPTHS, AI_RANDOMNESS, PLAYERS } from '../constants';

const SCORES = {
  WIN: 1000000,
  LOSE: -1000000,
  DRAW: 0,
  CENTER_BONUS: 3,
  POSITION_WEIGHT: [0, 1, 2, 4, 2, 1, 0]
} as const;

export function evaluateBoard(board: Board, aiPlayer: Player): number {
  const result = checkWin(board);
  
  if (result.winner === aiPlayer) return SCORES.WIN;
  if (result.winner !== null && result.winner !== 'draw') return SCORES.LOSE;
  if (result.winner === 'draw') return SCORES.DRAW;
  
  let score = 0;
  
  // Evaluate all possible windows of 4
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      // Horizontal
      if (col <= COLS - 4) {
        score += evaluateWindow(
          [board[row]![col]!, board[row]![col + 1]!, board[row]![col + 2]!, board[row]![col + 3]!],
          aiPlayer
        );
      }
      // Vertical
      if (row <= ROWS - 4) {
        score += evaluateWindow(
          [board[row]![col]!, board[row + 1]![col]!, board[row + 2]![col]!, board[row + 3]![col]!],
          aiPlayer
        );
      }
      // Diagonal (down-right)
      if (row <= ROWS - 4 && col <= COLS - 4) {
        score += evaluateWindow(
          [board[row]![col]!, board[row + 1]![col + 1]!, board[row + 2]![col + 2]!, board[row + 3]![col + 3]!],
          aiPlayer
        );
      }
      // Diagonal (down-left)
      if (row <= ROWS - 4 && col >= 3) {
        score += evaluateWindow(
          [board[row]![col]!, board[row + 1]![col - 1]!, board[row + 2]![col - 2]!, board[row + 3]![col - 3]!],
          aiPlayer
        );
      }
    }
  }
  
  // Add positional bonuses
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row]![col] === aiPlayer) {
        score += SCORES.POSITION_WEIGHT[col]!;
      } else if (board[row]![col] !== 0) {
        score -= SCORES.POSITION_WEIGHT[col]!;
      }
    }
  }
  
  return score;
}

function evaluateWindow(window: (0 | Player)[], aiPlayer: Player): number {
  const opponent = aiPlayer === PLAYERS.HACKER ? PLAYERS.DEFENDER : PLAYERS.HACKER;
  
  const aiCount = window.filter(cell => cell === aiPlayer).length;
  const opponentCount = window.filter(cell => cell === opponent).length;
  const emptyCount = window.filter(cell => cell === 0).length;
  
  if (aiCount === 4) return SCORES.WIN;
  if (opponentCount === 4) return SCORES.LOSE;
  if (aiCount > 0 && opponentCount > 0) return 0; // Blocked window
  
  if (aiCount === 3 && emptyCount === 1) return 50;
  if (aiCount === 2 && emptyCount === 2) return 10;
  if (aiCount === 1 && emptyCount === 3) return 1;
  
  if (opponentCount === 3 && emptyCount === 1) return -80;
  if (opponentCount === 2 && emptyCount === 2) return -10;
  if (opponentCount === 1 && emptyCount === 3) return -1;
  
  return 0;
}

export function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player
): number {
  const result = checkWin(board);
  
  if (result.winner === aiPlayer) return SCORES.WIN;
  if (result.winner !== null && result.winner !== 'draw') return SCORES.LOSE;
  if (result.winner === 'draw' || depth === 0) return evaluateBoard(board, aiPlayer);
  
  const validColumns = getValidColumns(board);
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const col of validColumns) {
      const newBoard = dropPiece(board, col, aiPlayer);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, false, aiPlayer);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    const opponent = aiPlayer === PLAYERS.HACKER ? PLAYERS.DEFENDER : PLAYERS.HACKER;
    for (const col of validColumns) {
      const newBoard = dropPiece(board, col, opponent);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, true, aiPlayer);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function getBestMove(board: Board, aiPlayer: Player, difficulty: AIDifficulty): number {
  const validColumns = getValidColumns(board);
  if (validColumns.length === 0) throw new Error('No valid moves available');
  
  // Check for immediate winning moves first
  for (const col of validColumns) {
    const newBoard = dropPiece(board, col, aiPlayer);
    if (checkWin(newBoard).winner === aiPlayer) {
      return col;
    }
  }
  
  // Check for opponent's immediate winning moves and block them
  const opponent = aiPlayer === PLAYERS.HACKER ? PLAYERS.DEFENDER : PLAYERS.HACKER;
  for (const col of validColumns) {
    const opponentBoard = dropPiece(board, col, opponent);
    if (checkWin(opponentBoard).winner === opponent) {
      return col; // Block opponent's winning move
    }
  }
  
  const depth = AI_DEPTHS[difficulty];
  const randomness = AI_RANDOMNESS[difficulty];
  
  // Add some randomness for easier difficulties
  if (Math.random() < randomness) {
    // Prefer center columns even when playing randomly
    const centerCols = validColumns.filter(col => col >= 2 && col <= 4);
    if (centerCols.length > 0) {
      return centerCols[Math.floor(Math.random() * centerCols.length)]!;
    }
    return validColumns[Math.floor(Math.random() * validColumns.length)]!;
  }
  
  let bestScore = -Infinity;
  let bestColumn = validColumns[0]!;
  
  for (const col of validColumns) {
    const newBoard = dropPiece(board, col, aiPlayer);
    const score = minimax(newBoard, depth - 1, -Infinity, Infinity, false, aiPlayer);
    
    if (score > bestScore) {
      bestScore = score;
      bestColumn = col;
    }
  }
  
  return bestColumn;
}