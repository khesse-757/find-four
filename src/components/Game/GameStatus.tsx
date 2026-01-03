import { useGameStore } from '../../store/gameStore';

interface GameStatusProps {
  isOnlineMode?: boolean;
  localPlayer?: number | undefined;
}

export default function GameStatus({ 
  isOnlineMode = false, 
  localPlayer 
}: GameStatusProps) {
  const { currentPlayer, winner, isThinking, gameMode } = useGameStore();

  const getStatusMessage = () => {
    if (winner !== null) {
      if (winner === 'draw') {
        return 'DRAW';
      }
      
      if (isOnlineMode) {
        // Show win message relative to local player
        const localPlayerWon = winner === localPlayer;
        return localPlayerWon ? 'YOU WIN!' : 'OPPONENT WINS!';
      }
      
      return winner === 1 ? 'HACKER WINS' : 'DEFENDER WINS';
    }

    if (isThinking) {
      return 'THINKING...';
    }

    // Online mode: show relative to local player
    if (isOnlineMode) {
      const isMyTurn = currentPlayer === localPlayer;
      return isMyTurn ? 'YOUR TURN' : "OPPONENT'S TURN";
    }

    // AI mode
    if (gameMode === 'ai' && currentPlayer === 2) {
      return 'AI TURN';
    }
    
    // Local mode
    return currentPlayer === 1 ? "HACKER'S TURN" : "DEFENDER'S TURN";
  };

  const getStatusColor = () => {
    if (winner !== null) {
      if (winner === 'draw') {
        return 'text-gray-400';
      }
      return winner === 1 ? 'text-amber-500' : 'text-cyan-500';
    }

    if (isThinking) {
      return 'text-yellow-400 animate-pulse';
    }

    return currentPlayer === 1 ? 'text-amber-500' : 'text-cyan-500';
  };

  return (
    <div className="text-center p-4 space-y-2">
      {/* Player Identity for Online Mode */}
      {isOnlineMode && localPlayer !== undefined && (
        <div className={`text-sm font-mono uppercase tracking-wider ${localPlayer === 1 ? 'text-amber-400' : 'text-cyan-400'}`}>
          You are {localPlayer === 1 ? 'HACKER' : 'DEFENDER'}
        </div>
      )}
      
      {/* Main Status */}
      <div className={`text-xl font-mono font-bold tracking-wider ${getStatusColor()}`}>
        {getStatusMessage()}
      </div>
    </div>
  );
}