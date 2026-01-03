import { useGameStore } from '../../store/gameStore';
import Button from '../UI/Button';
import type { AIDifficulty } from '../../types';

export default function DifficultySelect() {
  const { setGameMode, setAiDifficulty, setSelectingDifficulty } = useGameStore();

  const handleDifficultySelect = (difficulty: AIDifficulty) => {
    setAiDifficulty(difficulty);
    setSelectingDifficulty(false);
    setGameMode('ai');
  };

  const handleBack = () => {
    setSelectingDifficulty(false);
  };

  const difficulties = [
    {
      level: 'easy' as const,
      label: 'EASY',
      description: 'For beginners'
    },
    {
      level: 'medium' as const,
      label: 'MEDIUM', 
      description: 'Balanced challenge'
    },
    {
      level: 'hard' as const,
      label: 'HARD',
      description: 'No mercy'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-amber-500 p-8">
      <div className="text-center space-y-8">
        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl font-mono font-bold tracking-wider">
            SELECT DIFFICULTY
          </h1>
          <p className="text-lg font-mono text-amber-600">
            CHOOSE YOUR OPPONENT'S INTELLIGENCE LEVEL
          </p>
        </div>

        {/* Difficulty Buttons */}
        <div className="space-y-6 pt-8 w-64">
          {difficulties.map((difficulty) => (
            <div key={difficulty.level} className="space-y-2">
              <Button onClick={() => handleDifficultySelect(difficulty.level)}>
                {difficulty.label}
              </Button>
              <p className="text-sm font-mono text-amber-600">
                {difficulty.description}
              </p>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="pt-8">
          <Button 
            onClick={handleBack}
            variant="secondary"
          >
            BACK TO MENU
          </Button>
        </div>
      </div>
    </div>
  );
}