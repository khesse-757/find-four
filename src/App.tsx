import { useGameStore } from './store/gameStore';
import MainMenu from './components/Menu/MainMenu';
import DifficultySelect from './components/Menu/DifficultySelect';

export default function App() {
  const { gameMode, selectingDifficulty } = useGameStore();

  // Show difficulty selection when user clicked VS COMPUTER
  if (selectingDifficulty) {
    return <DifficultySelect />;
  }

  // Show main menu for menu mode
  if (gameMode === 'menu') {
    return <MainMenu />;
  }

  // Placeholder for other game modes
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-amber-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-mono font-bold">
          GAME COMING SOON
        </h1>
        <p className="text-lg font-mono text-amber-600">
          Mode: {gameMode.toUpperCase()}
        </p>
        <button 
          onClick={() => useGameStore.getState().setGameMode('menu')}
          className="mt-8 px-6 py-3 border-2 border-amber-500 text-amber-500 font-mono uppercase hover:bg-amber-500 hover:text-black transition-colors"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}