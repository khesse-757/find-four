import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';

interface GameStatusProps {
  isOnlineMode?: boolean;
  localPlayer?: number | undefined;
}

export default function GameStatus({
  isOnlineMode = false,
  localPlayer
}: GameStatusProps) {
  const { currentPlayer, winner, isThinking, gameMode, wrongTurnAttempt } = useGameStore();
  const [showWrongTurn, setShowWrongTurn] = useState(false);
  const lastWrongTurnRef = useRef(0);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle wrong turn feedback using async timers to avoid lint warning
  useEffect(() => {
    if (wrongTurnAttempt > 0 && wrongTurnAttempt !== lastWrongTurnRef.current) {
      lastWrongTurnRef.current = wrongTurnAttempt;

      // Clear any existing timers
      if (showTimerRef.current !== null) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current !== null) clearTimeout(hideTimerRef.current);

      // Show message immediately (via microtask to avoid sync setState in effect)
      showTimerRef.current = setTimeout(() => setShowWrongTurn(true), 0);

      // Hide after 1.5 seconds
      hideTimerRef.current = setTimeout(() => setShowWrongTurn(false), 1500);
    }

    return () => {
      if (showTimerRef.current !== null) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current !== null) clearTimeout(hideTimerRef.current);
    };
  }, [wrongTurnAttempt]);

  const isMyTurn = isOnlineMode ? currentPlayer === localPlayer : true;

  const getWinMessage = () => {
    if (winner === 'draw') {
      return { main: 'DEADLOCK', sub: 'Neither side prevails' };
    }

    const hackerWon = winner === 1;

    if (isOnlineMode && localPlayer !== undefined) {
      const localPlayerWon = winner === localPlayer;
      if (localPlayerWon) {
        return hackerWon
          ? { main: 'BREACH SUCCESSFUL', sub: 'System compromised' }
          : { main: 'SYSTEM SECURED', sub: 'Threat neutralized' };
      } else {
        return hackerWon
          ? { main: 'BREACH DETECTED', sub: 'Defenses failed' }
          : { main: 'ACCESS DENIED', sub: 'Attack repelled' };
      }
    }

    // Local/AI mode
    return hackerWon
      ? { main: 'BREACH SUCCESSFUL', sub: 'System compromised' }
      : { main: 'SYSTEM SECURED', sub: 'Threat neutralized' };
  };

  const getTurnMessage = () => {
    if (showWrongTurn && isOnlineMode) {
      return 'NOT YOUR TURN';
    }

    if (isThinking) {
      return 'PROCESSING...';
    }

    if (isOnlineMode) {
      return isMyTurn ? 'YOUR TURN' : "OPPONENT'S TURN";
    }

    if (gameMode === 'ai' && currentPlayer === 2) {
      return 'AI PROCESSING';
    }

    return currentPlayer === 1 ? "HACKER'S TURN" : "DEFENDER'S TURN";
  };

  const getStatusColor = () => {
    if (winner !== null) {
      if (winner === 'draw') {
        return 'text-gray-400';
      }
      // In online mode, show green for win, red for loss
      if (isOnlineMode && localPlayer !== undefined) {
        const localPlayerWon = winner === localPlayer;
        return localPlayerWon ? 'text-green-400' : 'text-red-400';
      }
      return winner === 1 ? 'text-amber-500' : 'text-cyan-500';
    }

    if (showWrongTurn) {
      return 'text-red-400';
    }

    if (isThinking) {
      return 'text-yellow-400 animate-pulse';
    }

    return currentPlayer === 1 ? 'text-amber-500' : 'text-cyan-500';
  };

  // Render win/lose/draw state
  if (winner !== null) {
    const { main, sub } = getWinMessage();
    return (
      <div className="text-center p-4 space-y-2">
        {isOnlineMode && localPlayer !== undefined && (
          <div className={`text-sm font-mono uppercase tracking-wider ${localPlayer === 1 ? 'text-amber-400' : 'text-cyan-400'}`}>
            You were {localPlayer === 1 ? 'HACKER' : 'DEFENDER'}
          </div>
        )}
        <div className={`text-xl font-mono font-bold tracking-wider ${getStatusColor()}`}>
          {main}
        </div>
        <div className="text-sm font-mono text-amber-600 uppercase tracking-wide">
          {sub}
        </div>
      </div>
    );
  }

  // Render turn state
  return (
    <div className="text-center p-4 space-y-2">
      {isOnlineMode && localPlayer !== undefined && (
        <div className={`text-sm font-mono uppercase tracking-wider ${localPlayer === 1 ? 'text-amber-400' : 'text-cyan-400'}`}>
          You are {localPlayer === 1 ? 'HACKER' : 'DEFENDER'}
        </div>
      )}
      <div className={`text-xl font-mono font-bold tracking-wider ${getStatusColor()}`}>
        {getTurnMessage()}
        {/* Blinking cursor for active turn */}
        {isMyTurn && !showWrongTurn && !isThinking && winner === null && (
          <span className="animate-pulse">_</span>
        )}
      </div>
    </div>
  );
}