import { useGameStore } from '../../store/gameStore';
import Column from './Column';
import { ROWS, COLS } from '../../constants';

export default function Board() {
  const { 
    board, 
    dropPiece, 
    winner, 
    isThinking 
  } = useGameStore();

  // Get winning cells for highlighting
  const getWinningCells = () => {
    // For now, return empty array - we'll implement this when we have win detection
    // This would come from a checkWin result stored in the game store
    return [];
  };

  const winningCells = getWinningCells();
  const isDisabled = winner !== null || isThinking;

  const handleDrop = (columnIndex: number) => {
    dropPiece(columnIndex);
  };

  // Convert board data to column format (each column is a vertical array)
  const getColumnCells = (columnIndex: number) => {
    const columnCells: (0 | 1 | 2)[] = [];
    for (let row = 0; row < ROWS; row++) {
      columnCells.push(board[row]![columnIndex]!);
    }
    return columnCells;
  };

  return (
    <div className="inline-block bg-black border-2 border-amber-600 p-2">
      {/* Board Title */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-mono text-amber-500 uppercase tracking-wider">
          CONNECT GRID
        </h2>
      </div>
      
      {/* Game Board */}
      <div className="flex border-t border-l border-amber-600">
        {Array.from({ length: COLS }, (_, columnIndex) => (
          <Column
            key={columnIndex}
            columnIndex={columnIndex}
            cells={getColumnCells(columnIndex)}
            onDrop={handleDrop}
            disabled={isDisabled}
            winningCells={winningCells}
          />
        ))}
      </div>
    </div>
  );
}