import { useGameStore } from '../../store/gameStore';

export default function GameStatus() {
  const { currentPlayer, winner, isThinking, gameMode } = useGameStore();

  const getStatusMessage = () => {
    if (winner !== null) {
      if (winner === 'draw') {
        return 'DRAW';
      }
      return winner === 1 ? 'HACKER WINS' : 'DEFENDER WINS';
    }

    if (isThinking) {
      return 'THINKING...';
    }

    // Show current turn
    if (gameMode === 'ai' && currentPlayer === 2) {
      return 'AI TURN';
    }
    
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
    <div className="text-center p-4">
      <div className={`text-xl font-mono font-bold tracking-wider ${getStatusColor()}`}>
        {getStatusMessage()}
      </div>
    </div>
  );
}