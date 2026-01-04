import { useGameStore } from '../../store/gameStore';
import { useConnectionStore } from '../../store/connectionStore';
import { usePeerConnection } from '../../hooks/usePeerConnection';
import Board from '../Board/Board';
import GameStatus from './GameStatus';
import GameControls from './GameControls';
import DisconnectOverlay from '../UI/DisconnectOverlay';

export default function GameContainer() {
  const { gameMode, setGameMode } = useGameStore();
  const { isHost, connectionStatus, disconnectReason } = useConnectionStore();
  const peerConnection = usePeerConnection();

  // In online mode, determine local player number
  const isOnlineMode = gameMode === 'online';
  const localPlayer = isOnlineMode ? (isHost ? 1 : 2) : undefined;

  // Wrap sendMove to add logging
  const wrappedSendMove = (column: number) => {
    console.log('GameContainer: About to call connectionStore sendMove with column:', column);
    console.log('GameContainer: isOnlineMode:', isOnlineMode);
    console.log('GameContainer: localPlayer:', localPlayer);
    
    try {
      // Use connectionStore sendMove instead of hook sendMove
      useConnectionStore.getState().sendMove({ column });
      console.log('GameContainer: connectionStore sendMove called successfully');
    } catch (error) {
      console.error('GameContainer: Error calling connectionStore sendMove:', error);
    }
  };

  // Check if we should show disconnect overlay
  const shouldShowDisconnectOverlay = 
    isOnlineMode && 
    connectionStatus === 'disconnected' && 
    disconnectReason !== 'none' && 
    disconnectReason !== 'self';

  const handleReturnToMenu = () => {
    // Clear disconnect reason and return to menu
    useConnectionStore.getState().setDisconnectReason('none');
    setGameMode('menu');
  };

  // Debug logging for online mode and disconnect overlay
  console.log('=== GameContainer Debug ===', {
    gameMode,
    isOnlineMode,
    connectionStatus,
    disconnectReason,
    shouldShowDisconnectOverlay,
    isHost,
    localPlayer,
    overlayConditions: {
      isOnlineMode,
      isDisconnected: connectionStatus === 'disconnected',
      reasonNotNone: disconnectReason !== 'none',
      reasonNotSelf: disconnectReason !== 'self'
    }
  });

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
            {...(isOnlineMode && { sendMove: wrappedSendMove })}
          />
        </div>

        {/* Game Controls */}
        <GameControls 
          isOnlineMode={isOnlineMode}
          disconnect={peerConnection.disconnect}
          requestRematch={peerConnection.requestRematch}
          acceptRematch={peerConnection.acceptRematch}
          rematchRequested={peerConnection.rematchRequested}
        />
      </div>

      {/* Disconnect Overlay */}
      {shouldShowDisconnectOverlay && (
        <DisconnectOverlay 
          disconnectReason={disconnectReason}
          onReturnToMenu={handleReturnToMenu}
        />
      )}
    </div>
  );
}