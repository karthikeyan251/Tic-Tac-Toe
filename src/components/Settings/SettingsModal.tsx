import React, { useState } from 'react';
import { X, Settings as SettingsIcon, Volume2, Zap, Timer, User, Save, RotateCcw } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import type { TimerMode, TimeoutBehavior } from '../../game/gameTypes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const preferences = useGameStore((state) => state.preferences);
  const updatePreferences = useGameStore((state) => state.updatePreferences);
  const resetStats = useGameStore((state) => state.resetStats);

  const [soundEnabled, setSoundEnabled] = useState(preferences.soundEnabled);
  const [coachEnabled, setCoachEnabled] = useState(preferences.coachEnabled);
  const [timerMode, setTimerMode] = useState<TimerMode>(preferences.timerMode);
  const [timeoutBehavior, setTimeoutBehavior] = useState<TimeoutBehavior>(preferences.timeoutBehavior);
  const [customPlayerNames, setCustomPlayerNames] = useState<Record<number, string>>(
    preferences.customPlayerNames || { 1: 'Player 1', 2: 'Player 2', 3: 'Player 3', 4: 'Player 4' }
  );

  if (!isOpen) return null;

  const handleSave = () => {
    updatePreferences({
      soundEnabled,
      coachEnabled,
      timerMode,
      timeoutBehavior,
      customPlayerNames,
    });
    onClose();
  };

  const handleResetStats = () => {
    if (window.confirm('Are you sure you want to reset all player statistics?')) {
      resetStats();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border-cyan-500/30 shadow-2xl space-y-5 bg-slate-950/95">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <SettingsIcon className="w-5 h-5" />
            <h2 className="text-base font-extrabold text-slate-100 uppercase tracking-wide">
              Game Preferences
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 font-bold">
                <Volume2 className="w-4 h-4 text-cyan-400" /> Sound FX
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 font-bold">
                <Zap className="w-4 h-4 text-cyan-400" /> Tactical Coach
              </div>
              <input
                type="checkbox"
                checked={coachEnabled}
                onChange={(e) => setCoachEnabled(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <label className="font-bold text-slate-200 flex items-center gap-2">
              <Timer className="w-4 h-4 text-amber-400" /> Default Turn Timer
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['unlimited', 5, 10, 15] as TimerMode[]).map((mode) => (
                <button
                  key={String(mode)}
                  type="button"
                  onClick={() => setTimerMode(mode)}
                  className={`py-1.5 rounded-lg font-bold border transition-all ${
                    timerMode === mode
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {mode === 'unlimited' ? 'Off' : `${mode}s`}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <label className="font-bold text-slate-200">Timer Expiration Action</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTimeoutBehavior('auto-move')}
                className={`py-2 rounded-lg font-bold border transition-all ${
                  timeoutBehavior === 'auto-move'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Auto-Select Move
              </button>
              <button
                type="button"
                onClick={() => setTimeoutBehavior('forfeit')}
                className={`py-2 rounded-lg font-bold border transition-all ${
                  timeoutBehavior === 'forfeit'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Forfeit Turn
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <label className="font-bold text-slate-200 flex items-center gap-2">
              <User className="w-4 h-4 text-sky-400" /> Default Player Identifiers
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((id) => (
                <div key={id} className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400">P{id}:</span>
                  <input
                    type="text"
                    value={customPlayerNames[id] || ''}
                    onChange={(e) =>
                      setCustomPlayerNames((prev) => ({ ...prev, [id]: e.target.value }))
                    }
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetStats}
              className="w-full py-2 px-3 rounded-xl border border-rose-500/40 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Persistent Statistics
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase text-xs tracking-wider flex items-center gap-2 shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
