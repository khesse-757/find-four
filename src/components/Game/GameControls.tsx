import { useGameStore } from '../../store/gameStore';

interface GameControlsProps {
  isOnlineMode?: boolean;
  disconnect?: () => void;
  requestRematch?: () => void;
  acceptRematch?: () => void;
  rematchRequested?: boolean;
}

export default function GameControls({ 
  isOnlineMode = false, 
  disconnect,
  requestRematch,
  acceptRematch,
  rematchRequested = false
}: GameControlsProps) {
  const { resetGame, setGameMode, winner } = useGameStore();

  const handleNewGame = () => {
    resetGame();
  };

  const handleQuit = () => {
    // In online mode, disconnect first
    if (isOnlineMode && disconnect) {
      disconnect();
    }
    setGameMode('menu');
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Rematch request notification */}
      {isOnlineMode && rematchRequested && (
        <div className="text-center">
          <div className="text-cyan-400 font-mono text-sm uppercase mb-2">
            Opponent wants rematch
          </div>
          <button
            onClick={acceptRematch}
            className="px-6 py-2 border border-green-500 text-green-500 font-mono text-sm uppercase hover:bg-green-500 hover:text-black transition-colors"
          >
            Accept
          </button>
        </div>
      )}
      
      {/* Main controls */}
      <div className="flex gap-4 justify-center">
        {/* New Game for local mode */}
        {!isOnlineMode && (
          <button
            onClick={handleNewGame}
            className="px-6 py-2 border border-amber-500 text-amber-500 font-mono text-sm uppercase hover:bg-amber-500 hover:text-black transition-colors"
          >
            New Game
          </button>
        )}
        
        {/* Play Again for online mode when game is over */}
        {isOnlineMode && winner !== null && !rematchRequested && (
          <button
            onClick={requestRematch}
            className="px-6 py-2 border border-amber-500 text-amber-500 font-mono text-sm uppercase hover:bg-amber-500 hover:text-black transition-colors"
          >
            Play Again
          </button>
        )}
        
        <button
          onClick={handleQuit}
          className="px-6 py-2 border border-red-400 text-red-400 font-mono text-sm uppercase hover:bg-red-400 hover:text-black transition-colors"
        >
          {isOnlineMode ? 'Disconnect' : 'Quit'}
        </button>
      </div>
    </div>
  );
}