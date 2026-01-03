import { useGameStore } from '../../store/gameStore';

interface GameControlsProps {
  isOnlineMode?: boolean;
  disconnect?: () => void;
}

export default function GameControls({ 
  isOnlineMode = false, 
  disconnect 
}: GameControlsProps) {
  const { resetGame, setGameMode } = useGameStore();

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
    <div className="flex gap-4 justify-center">
      {!isOnlineMode && (
        <button
          onClick={handleNewGame}
          className="px-6 py-2 border border-amber-500 text-amber-500 font-mono text-sm uppercase hover:bg-amber-500 hover:text-black transition-colors"
        >
          New Game
        </button>
      )}
      <button
        onClick={handleQuit}
        className="px-6 py-2 border border-red-400 text-red-400 font-mono text-sm uppercase hover:bg-red-400 hover:text-black transition-colors"
      >
        {isOnlineMode ? 'Disconnect' : 'Quit'}
      </button>
    </div>
  );
}