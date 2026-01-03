import type { CellValue, Position } from '../../types';
import Cell from './Cell';

interface ColumnProps {
  columnIndex: number;
  cells: CellValue[];
  onDrop: (column: number) => void;
  disabled?: boolean;
  winningCells: Position[];
}

export default function Column({ 
  columnIndex, 
  cells, 
  onDrop, 
  disabled = false,
  winningCells 
}: ColumnProps) {
  const handleClick = () => {
    console.log('Column: Click detected on column', columnIndex, 'disabled:', disabled);
    if (!disabled) {
      console.log('Column: Calling onDrop for column', columnIndex);
      onDrop(columnIndex);
    } else {
      console.log('Column: Click ignored - column disabled');
    }
  };

  const isWinningCell = (rowIndex: number): boolean => {
    return winningCells.some(pos => pos.row === rowIndex && pos.col === columnIndex);
  };

  const columnClasses = `
    flex flex-col cursor-pointer transition-colors duration-200
    ${disabled ? 'cursor-not-allowed opacity-75' : 'hover:bg-amber-900 hover:bg-opacity-20'}
    border-r border-amber-600 last:border-r-0
  `;

  return (
    <div 
      className={columnClasses}
      onClick={handleClick}
    >
      {cells.map((cellValue, rowIndex) => (
        <Cell
          key={`${columnIndex}-${rowIndex}`}
          value={cellValue}
          isWinning={isWinningCell(rowIndex)}
        />
      ))}
    </div>
  );
}