export type Player = 1 | 2;

export type CellValue = 0 | Player;

export type Board = CellValue[][];

export type GameMode = 'ai' | 'local' | 'online';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export type GameResult = Player | 'draw' | null;

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: GameResult;
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
}

export interface ConnectionState {
  peerId: string | null;
  remotePeerId: string | null;
  connectionStatus: ConnectionStatus;
  isHost: boolean;
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