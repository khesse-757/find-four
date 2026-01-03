import { useGameStore } from '../../store/gameStore';
import Board from '../Board/Board';
import GameStatus from './GameStatus';
import GameControls from './GameControls';

export default function GameContainer() {
  const { gameMode } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-amber-500 p-8">
      <div className="space-y-8">
        {/* Game Title */}
        <div className="text-center">
          <h1 className="text-2xl font-mono font-bold tracking-wider">
            FIND FOUR - {gameMode.toUpperCase()}
          </h1>
        </div>

        {/* Game Status */}
        <GameStatus />

        {/* Game Board */}
        <div className="flex justify-center">
          <Board />
        </div>

        {/* Game Controls */}
        <GameControls />
      </div>
    </div>
  );
}