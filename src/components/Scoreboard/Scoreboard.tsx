import React from 'react';
import { Trophy, Target, ShieldAlert, Equal } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const Scoreboard: React.FC = () => {
  const players = useGameStore((state) => state.players);
  const stats = useGameStore((state) => state.stats);

  return (
    <div className="glass-panel p-4 rounded-2xl border-cyan-500/20 shadow-xl space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-xs uppercase tracking-widest font-black text-cyan-400 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          Tactical Scoreboard
        </h3>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
          Total Games: {stats.gamesPlayed}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
        {players.map((player) => {
          const pStats = stats.playerStats[player.id] || { wins: 0, losses: 0, draws: 0 };
          const totalPlayed = pStats.wins + pStats.losses + pStats.draws;
          const winRate = totalPlayed > 0 ? ((pStats.wins / totalPlayed) * 100).toFixed(1) : '0.0';

          return (
            <div
              key={player.id}
              className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 shadow-md hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-lg shadow-inner shrink-0"
                  style={{
                    backgroundColor: `${player.color}20`,
                    color: player.color,
                    border: `1px solid ${player.color}60`,
                  }}
                >
                  {player.symbol}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{player.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center gap-0.5 text-emerald-400">
                      <Target className="w-3 h-3" /> W: {pStats.wins}
                    </span>
                    <span className="flex items-center gap-0.5 text-rose-400">
                      <ShieldAlert className="w-3 h-3" /> L: {pStats.losses}
                    </span>
                    <span className="flex items-center gap-0.5 text-amber-400">
                      <Equal className="w-3 h-3" /> D: {pStats.draws}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Win Rate</span>
                <span className="text-xs font-extrabold text-cyan-300 font-mono">{winRate}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
