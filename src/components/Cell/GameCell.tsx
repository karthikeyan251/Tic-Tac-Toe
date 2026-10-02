import React from 'react';
import { motion } from 'framer-motion';
import type { Coordinate, Player } from '../../game/gameTypes';

interface GameCellProps {
  coord: Coordinate;
  value: number;
  players: Player[];
  activePlayer: Player;
  isSuggested: boolean;
  isWinningCell: boolean;
  disabled: boolean;
  onClick: (coord: Coordinate) => void;
}

export const GameCell: React.FC<GameCellProps> = ({
  coord,
  value,
  players,
  activePlayer,
  isSuggested,
  isWinningCell,
  disabled,
  onClick,
}) => {
  const cellPlayer = players.find((p) => p.id === value);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled && value === 0) {
        onClick(coord);
      }
    }
  };

  return (
    <button
      type="button"
      tabIndex={disabled || value !== 0 ? -1 : 0}
      aria-label={`Row ${coord.row + 1}, Column ${coord.col + 1}, ${
        cellPlayer ? `Occupied by ${cellPlayer.name}` : 'Empty'
      }`}
      onClick={() => {
        if (!disabled && value === 0) {
          onClick(coord);
        }
      }}
      onKeyDown={handleKeyDown}
      disabled={disabled || value !== 0}
      className={`relative flex items-center justify-center rounded-xl transition-all duration-200 aspect-square min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
        value === 0
          ? 'glass-panel hover:bg-slate-800/60 hover:border-cyan-500/50 cursor-pointer active:scale-95'
          : 'bg-slate-900/80 border border-slate-700/60 cursor-default'
      } ${isSuggested ? 'coach-hint-cell ring-2 ring-cyan-400/90 bg-cyan-950/20' : ''} ${
        isWinningCell ? 'ring-4 ring-emerald-400 scale-105 bg-slate-800' : ''
      }`}
    >
      {value === 0 && !disabled && (
        <span
          className="absolute inset-0 rounded-xl opacity-0 hover:opacity-10 transition-opacity duration-200 pointer-events-none"
          style={{ backgroundColor: activePlayer.color }}
        />
      )}

      {isSuggested && value === 0 && (
        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
      )}

      {cellPlayer && (
        <motion.span
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className="font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tighter select-none"
          style={{
            color: cellPlayer.color,
            textShadow: `0 0 12px ${cellPlayer.color}80, 0 0 24px ${cellPlayer.color}40`,
          }}
        >
          {cellPlayer.symbol}
        </motion.span>
      )}
    </button>
  );
};
