import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { GameCell } from '../Cell/GameCell';
import { WinningStrikeLine } from './WinningStrikeLine';
import { isSameCoord } from '../../utils/coordinates';

export const GameBoard: React.FC = () => {
  const board = useGameStore((state) => state.board);
  const boardSize = useGameStore((state) => state.boardSize);
  const players = useGameStore((state) => state.players);
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);
  const suggestedMove = useGameStore((state) => state.suggestedMove);
  const winningCells = useGameStore((state) => state.winningCells);
  const winner = useGameStore((state) => state.winner);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const mode = useGameStore((state) => state.mode);
  const makeMove = useGameStore((state) => state.makeMove);

  const activePlayer = players[currentPlayerIndex];

  // Disable moves if game ended or if in PvAI mode and current turn is AI (Player 2)
  const isAIDoingMove = mode === 'pvai' && currentPlayerIndex === 1 && gameStatus === 'playing';
  const isBoardDisabled = gameStatus !== 'playing' || isAIDoingMove;

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-lg mx-auto p-3 sm:p-4">
      <div
        className="relative w-full aspect-square grid gap-2 sm:gap-3 p-3 sm:p-4 glass-panel rounded-2xl border-cyan-500/20 shadow-2xl transition-all duration-300"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`,
        }}
      >
        {board.map((row, r) =>
          row.map((cellValue, c) => {
            const coord = { row: r, col: c };
            const isSuggested = suggestedMove !== null && isSameCoord(suggestedMove, coord);
            const isWinningCell = winningCells.some((wc) => isSameCoord(wc, coord));

            return (
              <GameCell
                key={`${r}-${c}`}
                coord={coord}
                value={cellValue}
                players={players}
                activePlayer={activePlayer}
                isSuggested={isSuggested}
                isWinningCell={isWinningCell}
                disabled={isBoardDisabled}
                onClick={makeMove}
              />
            );
          })
        )}

        {/* Animated winning strike line */}
        {gameStatus === 'won' && winner && (
          <WinningStrikeLine winningCells={winningCells} boardSize={boardSize} color={winner.color} />
        )}
      </div>
    </div>
  );
};
