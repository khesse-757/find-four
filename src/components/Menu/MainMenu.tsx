import { useGameStore } from '../../store/gameStore';
import Button from '../UI/Button';

export default function MainMenu() {
  const { setGameMode, setSelectingDifficulty } = useGameStore();

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-amber-500 p-8">
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

        {/* Menu Buttons */}
        <div className="space-y-4 pt-8 w-64">
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