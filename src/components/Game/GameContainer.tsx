import { useGameStore } from '../../store/gameStore';
import { useConnectionStore } from '../../store/connectionStore';
import { usePeerConnection } from '../../hooks/usePeerConnection';
import Board from '../Board/Board';
import GameStatus from './GameStatus';
import GameControls from './GameControls';

export default function GameContainer() {
  const { gameMode } = useGameStore();
  const { isHost } = useConnectionStore();
  const peerConnection = usePeerConnection();

  // In online mode, determine local player number
  const isOnlineMode = gameMode === 'online';
  const localPlayer = isOnlineMode ? (isHost ? 1 : 2) : undefined;

  // Debug logging for online mode
  if (isOnlineMode) {
    console.log('GameContainer online mode:', { 
      gameMode, 
      isHost, 
      localPlayer,
      connectionStatus: useConnectionStore.getState().connectionStatus 
    });
  }

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
        <GameStatus 
          isOnlineMode={isOnlineMode}
          localPlayer={localPlayer}
        />

        {/* Game Board */}
        <div className="flex justify-center">
          <Board 
            isOnlineMode={isOnlineMode}
            localPlayer={localPlayer}
            sendMove={peerConnection.sendMove}
          />
        </div>

        {/* Game Controls */}
        <GameControls 
          isOnlineMode={isOnlineMode}
          disconnect={peerConnection.disconnect}
        />
      </div>
    </div>
  );
}