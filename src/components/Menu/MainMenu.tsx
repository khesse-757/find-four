import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useConnectionStore } from '../../store/connectionStore';
import Button from '../UI/Button';
import packageJson from '../../../package.json';

export default function MainMenu() {
  const { setGameMode, setSelectingDifficulty } = useGameStore();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleResetData = () => {
    // Clear all localStorage
    localStorage.clear();
    // Reset Zustand stores to initial state
    useGameStore.setState({
      board: useGameStore.getState().board.map(row => row.map(() => 0)),
      currentPlayer: 1,
      winner: null,
      gameMode: 'menu',
      aiDifficulty: 'medium',
      isThinking: false,
      selectingDifficulty: false,
      wrongTurnAttempt: 0
    });
    useConnectionStore.getState().disconnect();
    setShowResetDialog(false);
    // Reload page for clean state
    window.location.reload();
  };

  const handleVsComputer = () => {
    setSelectingDifficulty(true);
  };

  const handleVsLocal = () => {
    setGameMode('local');
  };

  const handleVsOnline = () => {
    setGameMode('online');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-amber-500 p-8 relative">
      {/* Version Number - Click to access reset */}
      <button
        onClick={() => setShowResetDialog(true)}
        className="absolute bottom-4 right-4 text-xs font-mono text-amber-600 hover:text-amber-400 transition-colors"
        title="Reset game data"
      >
        v{packageJson.version}
      </button>

      {/* Reset Data Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-black border-2 border-amber-500 p-8 max-w-sm w-full mx-4 text-center">
            <div className="border border-amber-600 p-6">
              <div className="space-y-6">
                <div className="text-amber-500 font-mono text-xl uppercase tracking-wider">
                  RESET DATA?
                </div>
                <div className="text-amber-600 font-mono text-sm">
                  This will clear all saved game data and reload the page.
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleResetData}
                    className="px-6 py-3 border border-red-400 text-red-400 font-mono text-sm uppercase hover:bg-red-400 hover:text-black transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowResetDialog(false)}
                    className="px-6 py-3 border border-amber-500 text-amber-500 font-mono text-sm uppercase hover:bg-amber-500 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center space-y-8">
        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-mono font-bold tracking-wider">
            FIND FOUR
          </h1>
          <p className="text-xl font-mono text-amber-600">
            HACKER vs DEFENDER // CONNECT TO WIN
          </p>
        </div>

        {/* ASCII Art Game Board */}
        <div className="py-6">
          <pre className="text-amber-500 font-mono text-sm leading-tight">
{`┌─┬─┬─┬─┬─┬─┬─┐
│ │ │ │ │ │ │ │
├─┼─┼─┼─┼─┼─┼─┤
│ │ │`}<span className="text-amber-400">█</span>{`│`}<span className="text-cyan-400">░</span>{`│ │ │ │
├─┼─┼─┼─┼─┼─┼─┤
│ │`}<span className="text-cyan-400">░</span>{`│`}<span className="text-amber-400">█</span>{`│`}<span className="text-cyan-400">░</span>{`│ │ │ │
├─┼─┼─┼─┼─┼─┼─┤
│`}<span className="text-amber-400">█</span>{`│`}<span className="text-cyan-400">░</span>{`│`}<span className="text-amber-400">█</span>{`│`}<span className="text-amber-400">█</span>{`│`}<span className="text-cyan-400">░</span>{`│ │ │
├─┼─┼─┼─┼─┼─┼─┤
│`}<span className="text-cyan-400">░</span>{`│`}<span className="text-amber-400">█</span>{`│`}<span className="text-cyan-400">░</span>{`│`}<span className="text-cyan-400">░</span>{`│`}<span className="text-amber-400">█</span>{`│`}<span className="text-amber-400">█</span>{`│ │
├─┼─┼─┼─┼─┼─┼─┤
│`}<span className="text-amber-400">█</span>{`│`}<span className="text-cyan-400">░</span>{`│`}<span className="text-amber-400">█</span>{`│`}<span className="text-amber-400">█</span>{`│`}<span className="text-cyan-400">░</span>{`│`}<span className="text-cyan-400">░</span>{`│`}<span className="text-amber-400">█</span>{`│
└─┴─┴─┴─┴─┴─┴─┘`}
          </pre>
          <p className="text-xs font-mono text-amber-600 mt-2">
            <span className="text-amber-400">█ HACKER</span> vs <span className="text-cyan-400">░ DEFENDER</span>
          </p>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col items-center space-y-4 pt-8">
          <div className="w-64 space-y-4">
            <Button onClick={handleVsComputer}>
              VS COMPUTER
            </Button>
            
            <Button onClick={handleVsLocal}>
              VS LOCAL
            </Button>
            
            <Button onClick={handleVsOnline}>
              VS ONLINE
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8">
          <p className="text-sm font-mono text-amber-600">
            [BREACH THE SYSTEM // PATCH THE VULNERABILITIES]
          </p>
        </div>
      </div>
    </div>
  );
}