import React from 'react';
import type { Coordinate } from '../../game/gameTypes';

interface WinningStrikeLineProps {
  winningCells: Coordinate[];
  boardSize: number;
  color: string;
}

export const WinningStrikeLine: React.FC<WinningStrikeLineProps> = ({ winningCells, boardSize, color }) => {
  if (winningCells.length < 2) return null;

  const first = winningCells[0];
  const last = winningCells[winningCells.length - 1];

  const step = 100 / boardSize;

  const x1 = (first.col + 0.5) * step;
  const y1 = (first.row + 0.5) * step;

  const x2 = (last.col + 0.5) * step;
  const y2 = (last.row + 0.5) * step;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="glow-strike" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <line
        x1={`${x1}%`}
        y1={`${y1}%`}
        x2={`${x2}%`}
        y2={`${y2}%`}
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        filter="url(#glow-strike)"
        className="animate-strike-dash"
        style={{
          strokeDasharray: '200',
          strokeDashoffset: '0',
          transition: 'stroke-dashoffset 0.4s ease-out',
        }}
      />
    </svg>
  );
};
