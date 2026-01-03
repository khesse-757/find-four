import { useGameStore } from '../../store/gameStore';
import Button from '../UI/Button';
import packageJson from '../../../package.json';

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-amber-500 p-8 relative">
      {/* Version Number */}
      <div className="absolute bottom-4 right-4 text-xs font-mono text-amber-600">
        v{packageJson.version}
      </div>
      
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
│ │ │`}<span className="text-amber-400">●</span>{`│`}<span className="text-cyan-400">○</span>{`│ │ │ │
├─┼─┼─┼─┼─┼─┼─┤
│ │`}<span className="text-cyan-400">○</span>{`│`}<span className="text-amber-400">●</span>{`│`}<span className="text-cyan-400">○</span>{`│ │ │ │
├─┼─┼─┼─┼─┼─┼─┤
│`}<span className="text-amber-400">●</span>{`│`}<span className="text-cyan-400">○</span>{`│`}<span className="text-amber-400">●</span>{`│`}<span className="text-amber-400">●</span>{`│`}<span className="text-cyan-400">○</span>{`│ │ │
├─┼─┼─┼─┼─┼─┼─┤
│`}<span className="text-cyan-400">○</span>{`│`}<span className="text-amber-400">●</span>{`│`}<span className="text-cyan-400">○</span>{`│`}<span className="text-cyan-400">○</span>{`│`}<span className="text-amber-400">●</span>{`│`}<span className="text-amber-400">●</span>{`│ │
├─┼─┼─┼─┼─┼─┼─┤
│`}<span className="text-amber-400">●</span>{`│`}<span className="text-cyan-400">○</span>{`│`}<span className="text-amber-400">●</span>{`│`}<span className="text-amber-400">●</span>{`│`}<span className="text-cyan-400">○</span>{`│`}<span className="text-cyan-400">○</span>{`│`}<span className="text-amber-400">●</span>{`│
└─┴─┴─┴─┴─┴─┴─┘`}
          </pre>
          <p className="text-xs font-mono text-amber-600 mt-2">
            <span className="text-amber-400">● HACKER</span> vs <span className="text-cyan-400">○ DEFENDER</span>
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