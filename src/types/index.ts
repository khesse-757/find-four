export type Player = 1 | 2;

export type CellValue = 0 | Player;

export type Board = CellValue[][];

export type GameMode = 'menu' | 'ai' | 'local' | 'online';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export type GameResult = Player | 'draw' | null;

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: GameResult;
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  isThinking: boolean;
  selectingDifficulty: boolean;
}

export interface ConnectionState {
  peerId: string | null;
  remotePeerId: string | null;
  connectionStatus: ConnectionStatus;
  isHost: boolean;
  error: string | null;
}

export interface GameActions {
  dropPiece: (_column: number) => void;
  resetGame: () => void;
  setGameMode: (_mode: GameMode) => void;
  setAiDifficulty: (_difficulty: AIDifficulty) => void;
  makeAiMove: () => Promise<void>;
  setSelectingDifficulty: (_selecting: boolean) => void;
}

export interface ConnectionActions {
  createGame: () => Promise<string>;
  joinGame: (_roomCode: string) => Promise<void>;
  sendMove: (_move: Move) => void;
  disconnect: () => void;
  setError: (_error: string | null) => void;
}

export interface Move {
  column: number;
}

export interface Position {
  row: number;
  col: number;
}

export interface WinCheckResult {
  winner: GameResult;
  winningCells?: Position[];
}