import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import ConfirmDisconnectOverlay from '../UI/ConfirmDisconnectOverlay';

interface GameControlsProps {
  isOnlineMode?: boolean;
  disconnect?: () => void;
  requestRematch?: () => void;
  acceptRematch?: () => void;
  declineRematch?: () => void;
  rematchRequested?: boolean;
  rematchReceived?: boolean;
  rematchDeclined?: boolean;
  clearRematchState?: () => void;
}

export default function GameControls({
  isOnlineMode = false,
  disconnect,
  requestRematch,
  acceptRematch,
  declineRematch,
  rematchRequested = false,
  rematchReceived = false,
  rematchDeclined = false,
  clearRematchState
}: GameControlsProps) {
  const { resetGame, setGameMode, winner } = useGameStore();
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);

  // Auto-clear the declined message after 3 seconds
  useEffect(() => {
    if (rematchDeclined && clearRematchState) {
      const timer = setTimeout(() => {
        clearRematchState();
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [rematchDeclined, clearRematchState]);

  const handleNewGame = () => {
    resetGame();
  };

  const handleQuit = () => {
    // In online mode, show confirmation dialog first
    if (isOnlineMode) {
      setShowConfirmDisconnect(true);
      return;
    }
    setGameMode('menu');
  };

  const handleConfirmDisconnect = () => {
    setShowConfirmDisconnect(false);
    if (disconnect) {
      disconnect();
    }
    setGameMode('menu');
  };

  const handleCancelDisconnect = () => {
    setShowConfirmDisconnect(false);
  };

  // Determine if Play Again button should show
  const showPlayAgain = isOnlineMode &&
    winner !== null &&
    !rematchRequested &&
    !rematchReceived &&
    !rematchDeclined;

  return (
    <>
      <div className="flex flex-col gap-4 items-center">
        {/* Waiting for opponent to respond to my rematch request */}
        {isOnlineMode && rematchRequested && !rematchDeclined && (
          <div className="text-center">
            <div className="text-amber-500 font-mono text-sm uppercase animate-pulse">
              WAITING FOR OPPONENT...
            </div>
          </div>
        )}

        {/* Rematch declined notification */}
        {isOnlineMode && rematchDeclined && (
          <div className="text-center">
            <div className="text-red-400 font-mono text-sm uppercase">
              REMATCH DECLINED
            </div>
          </div>
        )}

        {/* Opponent wants rematch notification */}
        {isOnlineMode && rematchReceived && (
          <div className="text-center">
            <div className="text-cyan-400 font-mono text-sm uppercase mb-2">
              OPPONENT WANTS REMATCH
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={acceptRematch}
                className="px-6 py-2 border border-green-500 text-green-500 font-mono text-sm uppercase hover:bg-green-500 hover:text-black transition-colors"
              >
                Accept
              </button>
              <button
                onClick={declineRematch}
                className="px-6 py-2 border border-red-400 text-red-400 font-mono text-sm uppercase hover:bg-red-400 hover:text-black transition-colors"
              >
                Decline
              </button>
            </div>
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
          {showPlayAgain && (
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

      {/* Disconnect Confirmation Overlay */}
      {showConfirmDisconnect && (
        <ConfirmDisconnectOverlay
          onConfirm={handleConfirmDisconnect}
          onCancel={handleCancelDisconnect}
        />
      )}
    </>
  );
}