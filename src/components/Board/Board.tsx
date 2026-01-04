import { useGameStore } from '../../store/gameStore';
import Column from './Column';
import { ROWS, COLS } from '../../constants';

interface BoardProps {
  isOnlineMode?: boolean;
  localPlayer?: number | undefined;
  sendMove?: (column: number) => void;
}

export default function Board({ 
  isOnlineMode = false, 
  localPlayer, 
  sendMove 
}: BoardProps) {
  const { 
    board, 
    dropPiece, 
    winner, 
    isThinking,
    currentPlayer 
  } = useGameStore();

  // Get winning cells for highlighting
  const getWinningCells = () => {
    // For now, return empty array - we'll implement this when we have win detection
    // This would come from a checkWin result stored in the game store
    return [];
  };

  const winningCells = getWinningCells();
  
  // In online mode, only allow moves when it's the local player's turn
  const isLocalPlayerTurn = isOnlineMode ? currentPlayer === localPlayer : true;
  const isDisabled = winner !== null || isThinking || (isOnlineMode && !isLocalPlayerTurn);

  const handleDrop = (columnIndex: number) => {
    // Don't allow moves if game is over or AI is thinking
    if (winner !== null || isThinking) {
      return;
    }

    // In online mode, check if it's local player's turn
    if (isOnlineMode && !isLocalPlayerTurn) {
      // Trigger wrong turn feedback
      useGameStore.getState().triggerWrongTurn();
      return;
    }

    dropPiece(columnIndex);

    // Send move to opponent in online mode
    if (isOnlineMode && sendMove) {
      sendMove(columnIndex);
    }
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