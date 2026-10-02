import React from 'react';
import { Volume2, VolumeX, Zap, Settings, Bot } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface AppHeaderProps {
  onOpenSettings: () => void;
  onToggleChatDrawer: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenSettings, onToggleChatDrawer }) => {
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const coachEnabled = useGameStore((state) => state.coachEnabled);
  const players = useGameStore((state) => state.players);
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const toggleCoach = useGameStore((state) => state.toggleCoach);

  const activePlayer = players[currentPlayerIndex];

  return (
    <header className="w-full glass-panel border-b border-cyan-500/20 px-4 py-3 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-magenta-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 font-black text-slate-950 text-xl tracking-tighter">
            X
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-200 to-magenta-400 uppercase">
              Tic-Tac-Toe <span className="text-cyan-400 font-light">Ultimate</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wide hidden sm:block">
              Cyberpunk Tactical AI Coach Engine
            </p>
          </div>
        </div>

        {/* Turn Badge */}
        {gameStatus === 'playing' && activePlayer && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 shadow-inner">
            <span
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: activePlayer.color }}
            />
            <span className="text-xs font-semibold text-slate-300">Turn:</span>
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: activePlayer.color }}
            >
              {activePlayer.name} ({activePlayer.symbol})
            </span>
          </div>
        )}

        {/* Quick Action Control Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleCoach}
            title={coachEnabled ? 'Disable Tactical Coach' : 'Enable Tactical Coach'}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
              coachEnabled
                ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${coachEnabled ? 'text-cyan-400 animate-pulse' : ''}`} />
            <span className="hidden md:inline">{coachEnabled ? 'Coach ON' : 'Coach OFF'}</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            className={`p-2 rounded-lg text-xs font-semibold transition-all duration-200 border ${
              soundEnabled
                ? 'bg-slate-800/80 border-slate-700 text-cyan-400'
                : 'bg-slate-900/50 border-slate-800 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            title="Game Settings"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onToggleChatDrawer}
            title="Open AI Master Assistant"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 shadow-md shadow-cyan-500/20 transition-all duration-200 active:scale-95"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>
        </div>
      </div>
    </header>
  );
};
