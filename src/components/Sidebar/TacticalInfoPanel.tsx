import React from 'react';
import { Shield, Grid, Award, Cpu, Users } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const TacticalInfoPanel: React.FC = () => {
  const boardSize = useGameStore((state) => state.boardSize);
  const winLength = useGameStore((state) => state.winLength);
  const mode = useGameStore((state) => state.mode);
  const difficulty = useGameStore((state) => state.difficulty);
  const players = useGameStore((state) => state.players);
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);
  const gameStatus = useGameStore((state) => state.gameStatus);

  const activePlayer = players[currentPlayerIndex];

  return (
    <div className="glass-panel p-4 rounded-2xl border-cyan-500/20 shadow-xl space-y-4 text-slate-300">
      <h3 className="text-xs uppercase tracking-widest font-black text-cyan-400 border-b border-slate-800 pb-2 flex items-center gap-2">
        <Shield className="w-4 h-4 text-cyan-400" />
        Battle Specs
      </h3>

      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Active Turn */}
        <div className="col-span-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400 font-medium">Current Turn</span>
          {activePlayer && gameStatus === 'playing' ? (
            <div className="flex items-center gap-2 font-bold uppercase" style={{ color: activePlayer.color }}>
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: activePlayer.color }} />
              {activePlayer.name} ({activePlayer.symbol})
            </div>
          ) : (
            <span className="font-semibold text-slate-500">Standby</span>
          )}
        </div>

        {/* Board Size */}
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Grid className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-semibold">Grid</span>
          </div>
          <span className="text-sm font-extrabold text-slate-100">{boardSize} × {boardSize}</span>
        </div>

        {/* Win Condition */}
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-semibold">Win Length</span>
          </div>
          <span className="text-sm font-extrabold text-slate-100">{winLength} in a row</span>
        </div>

        {/* Game Mode */}
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px] font-semibold">Mode</span>
          </div>
          <span className="text-xs font-bold text-slate-200 uppercase">{mode === 'pvp' ? 'Player vs Player' : 'Player vs AI'}</span>
        </div>

        {/* AI Difficulty */}
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-magenta-400" />
            <span className="text-[11px] font-semibold">AI Level</span>
          </div>
          <span className="text-xs font-bold text-magenta-400 uppercase">
            {mode === 'pvai' ? difficulty : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};
