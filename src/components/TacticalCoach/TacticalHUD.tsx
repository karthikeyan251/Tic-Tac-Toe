import React from 'react';
import { Zap, ShieldAlert, Target, Shield, Compass, Swords } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import type { TacticalCategory } from '../../game/gameTypes';

export const TacticalHUD: React.FC = () => {
  const coachEnabled = useGameStore((state) => state.coachEnabled);
  const tacticalRecommendation = useGameStore((state) => state.tacticalRecommendation);
  const gameStatus = useGameStore((state) => state.gameStatus);

  if (!coachEnabled || gameStatus !== 'playing' || !tacticalRecommendation) {
    return null;
  }

  const { category, message } = tacticalRecommendation;

  const getCategoryBadge = (cat: TacticalCategory) => {
    switch (cat) {
      case 'WIN NOW':
        return {
          icon: <Target className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />,
          bg: 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300',
        };
      case 'BLOCK':
        return {
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />,
          bg: 'bg-rose-950/80 border-rose-500/60 text-rose-300',
        };
      case 'FORK':
        return {
          icon: <Swords className="w-3.5 h-3.5 text-amber-400" />,
          bg: 'bg-amber-950/80 border-amber-500/60 text-amber-300',
        };
      case 'ATTACK':
        return {
          icon: <Target className="w-3.5 h-3.5 text-cyan-400" />,
          bg: 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300',
        };
      case 'DEFEND':
        return {
          icon: <Shield className="w-3.5 h-3.5 text-sky-400" />,
          bg: 'bg-sky-950/80 border-sky-500/60 text-sky-300',
        };
      case 'POSITION':
      default:
        return {
          icon: <Compass className="w-3.5 h-3.5 text-indigo-400" />,
          bg: 'bg-indigo-950/80 border-indigo-500/60 text-indigo-300',
        };
    }
  };

  const badgeStyle = getCategoryBadge(category);

  return (
    <div className="w-full max-w-lg mx-auto mb-3 px-2">
      <div className="glass-panel p-3 rounded-xl border-cyan-500/30 flex items-center justify-between gap-3 shadow-lg bg-slate-950/80">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 shrink-0">
            <Zap className="w-4 h-4 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-cyan-400">
                LIVE TACTICAL COACH
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle.bg}`}
              >
                {badgeStyle.icon}
                {category}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-200 truncate mt-0.5">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
