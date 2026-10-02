import React, { useRef, useEffect } from 'react';
import { History, MoveRight } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const MoveHistory: React.FC = () => {
  const moveHistory = useGameStore((state) => state.moveHistory);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moveHistory]);

  return (
    <div className="glass-panel p-3.5 rounded-2xl border-cyan-500/20 shadow-xl space-y-2.5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-xs uppercase tracking-widest font-black text-cyan-400 flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          Move History
        </h3>
        <span className="text-[10px] font-semibold text-slate-400">
          {moveHistory.length} Moves
        </span>
      </div>

      <div
        ref={scrollRef}
        className="max-h-36 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-cyan-500/30"
      >
        {moveHistory.length === 0 ? (
          <p className="text-center text-xs text-slate-500 py-3 italic">
            No moves played yet.
          </p>
        ) : (
          moveHistory.map((m) => (
            <div
              key={m.moveNumber}
              className="flex items-center justify-between text-xs bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800/80"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-500 font-bold">
                  #{m.moveNumber}
                </span>
                <span
                  className="font-bold flex items-center gap-1"
                  style={{ color: m.player.color }}
                >
                  <span className="w-4 h-4 rounded flex items-center justify-center text-[10px] bg-slate-800">
                    {m.player.symbol}
                  </span>
                  {m.player.name}
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[11px] text-slate-300 font-medium">
                <MoveRight className="w-3 h-3 text-slate-500" />
                [{m.coord.row + 1}, {m.coord.col + 1}]
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
