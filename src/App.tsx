import { useGameStore } from './store/gameStore';
import { useConnectionStore } from './store/connectionStore';
import MainMenu from './components/Menu/MainMenu';
import DifficultySelect from './components/Menu/DifficultySelect';
import OnlineSetup from './components/Menu/OnlineSetup';
import GameContainer from './components/Game/GameContainer';

export default function App() {
  const { gameMode, selectingDifficulty } = useGameStore();
  const { connectionStatus, disconnectReason } = useConnectionStore();

  // Show difficulty selection when user clicked VS COMPUTER
  if (selectingDifficulty) {
    return <DifficultySelect />;
  }

  // Show main menu for menu mode
  if (gameMode === 'menu') {
    return <MainMenu />;
  }

  // Show online setup for online mode when not connected
  // BUT keep showing GameContainer if there's a disconnect reason to display
  const hasDisconnectToShow = disconnectReason !== 'none' && disconnectReason !== 'self';
  if (gameMode === 'online' && connectionStatus !== 'connected' && !hasDisconnectToShow) {
    return <OnlineSetup />;
  }

  // Show game container for active game modes
  return <GameContainer />;
}