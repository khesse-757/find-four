import { useGameStore } from '../../store/gameStore';

export default function GameControls() {
  const { resetGame, setGameMode } = useGameStore();

  const handleNewGame = () => {
    resetGame();
  };

  const handleQuit = () => {
    setGameMode('menu');
  };

  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={handleNewGame}
        className="px-6 py-2 border border-amber-500 text-amber-500 font-mono text-sm uppercase hover:bg-amber-500 hover:text-black transition-colors"
      >
        New Game
      </button>
      <button
        onClick={handleQuit}
        className="px-6 py-2 border border-red-400 text-red-400 font-mono text-sm uppercase hover:bg-red-400 hover:text-black transition-colors"
      >
        Quit
      </button>
    </div>
  );
}