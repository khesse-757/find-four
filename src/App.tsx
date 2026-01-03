import { useGameStore } from './store/gameStore';
import MainMenu from './components/Menu/MainMenu';
import DifficultySelect from './components/Menu/DifficultySelect';
import GameContainer from './components/Game/GameContainer';

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

  // Show game container for active game modes
  return <GameContainer />;
}