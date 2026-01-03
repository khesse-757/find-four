import { useGameStore } from './store/gameStore';
import { useConnectionStore } from './store/connectionStore';
import MainMenu from './components/Menu/MainMenu';
import DifficultySelect from './components/Menu/DifficultySelect';
import OnlineSetup from './components/Menu/OnlineSetup';
import GameContainer from './components/Game/GameContainer';

export default function App() {
  const { gameMode, selectingDifficulty } = useGameStore();
  const { connectionStatus } = useConnectionStore();

  // Show difficulty selection when user clicked VS COMPUTER
  if (selectingDifficulty) {
    return <DifficultySelect />;
  }

  // Show main menu for menu mode
  if (gameMode === 'menu') {
    return <MainMenu />;
  }

  // Show online setup for online mode when not connected
  if (gameMode === 'online' && connectionStatus !== 'connected') {
    return <OnlineSetup />;
  }

  // Show game container for active game modes
  return <GameContainer />;
}