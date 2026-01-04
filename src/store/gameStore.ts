import { create } from 'zustand';
import type { GameState, GameActions, GameMode, AIDifficulty } from '../types';
import { createBoard, dropPiece as dropPieceLogic, checkWin } from '../logic/board';
import { getBestMove } from '../logic/ai';
import { isValidMove } from '../logic/validation';
import { PLAYERS } from '../constants';

interface GameStore extends GameState, GameActions {}

const initialState: GameState = {
  board: createBoard(),
  currentPlayer: PLAYERS.HACKER,
  winner: null,
  gameMode: 'menu',
  aiDifficulty: 'medium',
  isThinking: false,
  selectingDifficulty: false,
  wrongTurnAttempt: 0
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  dropPiece: (column: number) => {
    const state = get();
    
    // Don't allow moves if game is over or AI is thinking
    if (state.winner !== null || state.isThinking) return;
    
    // Validate move
    if (!isValidMove(state.board, column)) return;
    
    // Drop piece
    const newBoard = dropPieceLogic(state.board, column, state.currentPlayer);
    
    // Check for win
    const result = checkWin(newBoard);
    
    // Switch player if game continues
    const nextPlayer = result.winner === null 
      ? (state.currentPlayer === PLAYERS.HACKER ? PLAYERS.DEFENDER : PLAYERS.HACKER)
      : state.currentPlayer;
    
    set({
      board: newBoard,
      currentPlayer: nextPlayer,
      winner: result.winner
    });
    
    // If AI mode and game continues and it's AI's turn
    if (state.gameMode === 'ai' && 
        result.winner === null && 
        nextPlayer === PLAYERS.DEFENDER) {
      // Make AI move after short delay
      setTimeout(() => {
        get().makeAiMove();
      }, 500);
    }
  },

  resetGame: () => {
    set({
      board: createBoard(),
      currentPlayer: PLAYERS.HACKER,
      winner: null,
      isThinking: false
    });
  },

  setGameMode: (mode: GameMode) => {
    set({ gameMode: mode });
    
    // Reset game when changing modes
    if (mode !== 'menu') {
      get().resetGame();
    }
  },

  setAiDifficulty: (difficulty: AIDifficulty) => {
    set({ aiDifficulty: difficulty });
  },

  setSelectingDifficulty: (selecting: boolean) => {
    set({ selectingDifficulty: selecting });
  },

  makeAiMove: async () => {
    const state = get();
    
    // Only proceed if it's AI mode, AI's turn, and game isn't over
    if (state.gameMode !== 'ai' || 
        state.currentPlayer !== PLAYERS.DEFENDER || 
        state.winner !== null ||
        state.isThinking) {
      return;
    }
    
    // Set thinking state
    set({ isThinking: true });
    
    try {
      // Calculate AI move
      const aiMove = getBestMove(state.board, PLAYERS.DEFENDER, state.aiDifficulty);
      
      // Add slight delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Drop AI piece
      const newBoard = dropPieceLogic(state.board, aiMove, PLAYERS.DEFENDER);
      
      // Check for win
      const result = checkWin(newBoard);
      
      // Switch back to human player if game continues
      const nextPlayer = result.winner === null ? PLAYERS.HACKER : PLAYERS.DEFENDER;
      
      set({
        board: newBoard,
        currentPlayer: nextPlayer,
        winner: result.winner,
        isThinking: false
      });
    } catch (error) {
      console.error('AI move failed:', error);
      set({ isThinking: false });
    }
  },

  triggerWrongTurn: () => {
    // Use timestamp to trigger re-render even if called multiple times quickly
    set({ wrongTurnAttempt: Date.now() });
  }
}));