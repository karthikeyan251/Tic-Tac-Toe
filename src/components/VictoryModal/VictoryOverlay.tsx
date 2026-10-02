import React, { useState, useEffect } from 'react';
import { Play, Home, Equal, Sparkles, Trophy, Hash } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { ConfettiCanvas } from '../Visuals/ConfettiCanvas';

export const VictoryOverlay: React.FC = () => {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const winner = useGameStore((state) => state.winner);
  const winningCells = useGameStore((state) => state.winningCells);
  const boardSize = useGameStore((state) => state.boardSize);
  const winLength = useGameStore((state) => state.winLength);
  const moveHistory = useGameStore((state) => state.moveHistory);
  const gameDurationSeconds = useGameStore((state) => state.gameDurationSeconds);

  const playAgain = useGameStore((state) => state.playAgain);
  const goToMainMenu = useGameStore((state) => state.goToMainMenu);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'draw') {
      // 500ms visual delay so SVG strike line animation finishes first
      const timer = setTimeout(() => {
        setVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [gameStatus]);

  if (!visible || (gameStatus !== 'won' && gameStatus !== 'draw')) {
    return null;
  }

  const isWin = gameStatus === 'won';
  const playerThemeColor = winner?.color || '#ffb020';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <ConfettiCanvas active={isWin} color={playerThemeColor} />

      <div
        className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-250 bg-slate-950/95"
        style={{
          borderColor: isWin ? playerThemeColor : 'rgba(255, 176, 32, 0.4)',
          boxShadow: isWin ? `0 0 45px ${playerThemeColor}50` : '0 0 35px rgba(255, 176, 32, 0.25)',
        }}
      >
        {/* Banner Header */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-slate-900 border border-slate-800">
          <Sparkles className="w-3.5 h-3.5" style={{ color: playerThemeColor }} />
          {isWin ? 'VICTORY!' : 'DRAW'}
        </div>

        {/* Large Glowing Player Symbol */}
        <div className="flex justify-center my-2">
          {isWin && winner ? (
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl font-black shadow-2xl animate-bounce"
              style={{
                backgroundColor: `${winner.color}20`,
                color: winner.color,
                border: `3px solid ${winner.color}`,
                boxShadow: `0 0 35px ${winner.color}80`,
              }}
            >
              {winner.symbol}
            </div>
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-amber-500/60 flex items-center justify-center text-amber-400 text-4xl shadow-xl">
              <Equal className="w-10 h-10" />
            </div>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2
            className="text-3xl font-black uppercase tracking-wider text-slate-100"
            style={{
              color: isWin ? winner?.color : '#ffb020',
              textShadow: isWin ? `0 0 16px ${winner?.color}60` : 'none',
            }}
          >
            {isWin && winner ? `${winner.name.toUpperCase()} WINS` : 'DRAW'}
          </h2>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            {isWin
              ? `${boardSize} × ${boardSize} BOARD • ${winLength} IN A ROW`
              : 'No winning line was completed.'}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-3 rounded-2xl border border-slate-800/80 text-xs">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-cyan-400" /> Board & Condition
            </span>
            <span className="font-black text-slate-200 mt-0.5">{boardSize} × {boardSize} ({winLength} in a row)</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Hash className="w-3 h-3 text-magenta-400" /> Moves & Duration
            </span>
            <span className="font-black text-slate-200 mt-0.5">{moveHistory.length} moves • {gameDurationSeconds}s</span>
          </div>
        </div>

        {/* Winning Line Detection Info */}
        {isWin && winningCells.length > 0 && (
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-300 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" /> Winning Line Detected
            </div>
            <div className="text-xs font-semibold text-cyan-300 truncate">
              {winningCells.map((c) => `[${c.row + 1}, ${c.col + 1}]`).join(' → ')}
            </div>
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {/* PLAY AGAIN Button */}
          <button
            type="button"
            onClick={playAgain}
            className="w-full py-3.5 px-4 rounded-2xl font-black text-sm uppercase tracking-wider text-slate-950 shadow-xl flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
            style={{
              backgroundColor: isWin ? playerThemeColor : '#ffb020',
              boxShadow: `0 0 24px ${isWin ? playerThemeColor : '#ffb020'}60`,
            }}
          >
            <Play className="w-4 h-4 fill-current" /> PLAY AGAIN
          </button>

          {/* MAIN MENU Button */}
          <button
            type="button"
            onClick={goToMainMenu}
            className="w-full py-3.5 px-4 rounded-2xl font-black text-sm uppercase tracking-wider glass-panel hover:bg-slate-800/80 text-slate-200 border-slate-700 flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4 text-slate-400" /> MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};
