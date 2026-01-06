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

  interface WinMessageResult {
    sub: string;
    isOnline: boolean;
    // Online mode
    main?: string;
    isWin?: boolean | undefined;
    // Local/AI mode
    playerName?: string;
    playerColor?: string;
  }

  const getWinMessage = (): WinMessageResult => {
    if (winner === 'draw') {
      return { main: 'DEADLOCK', sub: 'Neither side prevails', isOnline: true };
    }

    const hackerWon = winner === 1;

    if (isOnlineMode && localPlayer !== undefined) {
      const localPlayerWon = winner === localPlayer;
      if (localPlayerWon) {
        return hackerWon
          ? { main: 'YOU WIN', sub: 'Breach successful', isOnline: true, isWin: true }
          : { main: 'YOU WIN', sub: 'System secured', isOnline: true, isWin: true };
      } else {
        return hackerWon
          ? { main: 'YOU LOSE', sub: 'Breach detected', isOnline: true, isWin: false }
          : { main: 'YOU LOSE', sub: 'Access denied', isOnline: true, isWin: false };
      }
    }

    // Local/AI mode - show who won with split colors
    return hackerWon
      ? { playerName: 'HACKER', playerColor: 'text-amber-400', sub: 'Breach successful', isOnline: false }
      : { playerName: 'DEFENDER', playerColor: 'text-cyan-400', sub: 'System secured', isOnline: false };
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
    const winMessage = getWinMessage();
    const { sub, isOnline } = winMessage;

    // Online mode or draw: single colored message
    if (isOnline) {
      const { main, isWin } = winMessage;
      const mainColor = isWin === true ? 'text-green-400' : isWin === false ? 'text-red-400' : 'text-gray-400';
      return (
        <div className="text-center p-4 space-y-2">
          {isOnlineMode && localPlayer !== undefined && (
            <div className={`text-sm font-mono uppercase tracking-wider ${localPlayer === 1 ? 'text-amber-400' : 'text-cyan-400'}`}>
              You were {localPlayer === 1 ? 'HACKER' : 'DEFENDER'}
            </div>
          )}
          <div className={`text-xl font-mono font-bold tracking-wider ${mainColor}`}>
            {main}
          </div>
          <div className="text-sm font-mono text-amber-600 uppercase tracking-wide">
            {sub}
          </div>
        </div>
      );
    }

    // Local/AI mode: split colored message (HACKER/DEFENDER in their color, WINS in green)
    const { playerName, playerColor } = winMessage;
    return (
      <div className="text-center p-4 space-y-2">
        <div className="text-xl font-mono font-bold tracking-wider">
          <span className={playerColor}>{playerName}</span>
          {' '}
          <span className="text-green-400">WINS</span>
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