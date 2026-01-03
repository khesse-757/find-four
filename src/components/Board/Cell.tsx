import type { CellValue } from '../../types';

interface CellProps {
  value: CellValue;
  isWinning?: boolean;
}

export default function Cell({ value, isWinning = false }: CellProps) {
  const getCellContent = () => {
    if (value === 0) {
      return null; // Empty cell
    }
    
    if (value === 1) {
      // Hacker piece - bright amber/orange
      return (
        <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-amber-400">
        </div>
      );
    }
    
    // Defender piece - cyan/teal
    return (
      <div className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-cyan-400">
      </div>
    );
  };

  return (
    <div 
      className={`
        w-12 h-12 border border-amber-600 flex items-center justify-center
        ${isWinning ? 'bg-amber-900 animate-pulse' : 'bg-black'}
        transition-colors duration-300
      `}
    >
      {getCellContent()}
    </div>
  );
}