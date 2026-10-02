import React, { useState, useEffect } from 'react';
import { Play, Grid, Users, Cpu, Timer, Zap, Volume2, User, Sparkles } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import type { AIDifficulty, GameMode, TimerMode } from '../../game/gameTypes';
import { BOARD_CONFIGS } from '../../utils/constants';

export const GameSetup: React.FC = () => {
  const setupGame = useGameStore((state) => state.setupGame);
  const preferences = useGameStore((state) => state.preferences);

  const [boardSize, setBoardSize] = useState<number>(3);
  const [mode, setMode] = useState<GameMode>('pvai');
  const [playersCount, setPlayersCount] = useState<number>(2);
  const [difficulty, setDifficulty] = useState<AIDifficulty>('medium');
  const [timerMode, setTimerMode] = useState<TimerMode>('unlimited');
  const [coachEnabled, setCoachEnabled] = useState<boolean>(preferences.coachEnabled);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(preferences.soundEnabled);
  const [playerNames, setPlayerNames] = useState<Record<number, string>>({
    1: 'Player 1',
    2: 'Player 2',
    3: 'Player 3',
    4: 'Player 4',
  });

  const currentConfig = BOARD_CONFIGS[boardSize];

  useEffect(() => {
    if (!currentConfig.allowedPlayers.includes(playersCount)) {
      setPlayersCount(currentConfig.allowedPlayers[0]);
    }
  }, [boardSize, playersCount, currentConfig]);

  const handleStartGame = () => {
    setupGame({
      boardSize,
      playersCount: mode === 'pvai' ? 2 : playersCount,
      mode,
      difficulty,
      timerMode,
      coachEnabled,
      soundEnabled,
      playerNames,
    });
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border-cyan-500/30 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Cyberpunk Tactical Command
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-200 to-magenta-400 uppercase">
            Tic-Tac-Toe Ultimate
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Think ahead. Control the board. Outplay the AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                <Grid className="w-4 h-4 text-cyan-400" />
                Board Grid Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 4, 5, 6].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setBoardSize(size)}
                    className={`py-2 rounded-xl text-xs font-black transition-all border ${
                      boardSize === size
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {size}×{size}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Win Condition: {currentConfig.winLength} in a row
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-sky-400" />
                Game Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('pvai')}
                  className={`py-2.5 rounded-xl text-xs font-extrabold transition-all border flex items-center justify-center gap-1.5 ${
                    mode === 'pvai'
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Cpu className="w-4 h-4" /> Player vs AI
                </button>
                <button
                  type="button"
                  onClick={() => setMode('pvp')}
                  className={`py-2.5 rounded-xl text-xs font-extrabold transition-all border flex items-center justify-center gap-1.5 ${
                    mode === 'pvp'
                      ? 'bg-gradient-to-r from-magenta-500 to-pink-500 text-slate-950 border-magenta-400 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Users className="w-4 h-4" /> Player vs Player
                </button>
              </div>
            </div>

            {mode === 'pvp' && (
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  Player Count
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 3, 4].map((count) => {
                    const isAllowed = currentConfig.allowedPlayers.includes(count);
                    return (
                      <button
                        key={count}
                        type="button"
                        disabled={!isAllowed}
                        onClick={() => isAllowed && setPlayersCount(count)}
                        className={`py-2 rounded-xl text-xs font-extrabold transition-all border ${
                          playersCount === count && isAllowed
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                            : isAllowed
                            ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                            : 'bg-slate-950/40 border-slate-900 text-slate-700 cursor-not-allowed'
                        }`}
                      >
                        {count} Players
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {mode === 'pvai' && (
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-magenta-400" />
                  AI Intelligence Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'master'] as AIDifficulty[]).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`py-2 rounded-xl text-xs font-extrabold uppercase transition-all border ${
                        difficulty === diff
                          ? 'bg-magenta-500 text-slate-950 border-magenta-400 shadow-md shadow-magenta-500/30'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                <Timer className="w-4 h-4 text-amber-400" />
                Blitz Turn Timer
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['unlimited', 5, 10, 15] as TimerMode[]).map((t) => (
                  <button
                    key={String(t)}
                    type="button"
                    onClick={() => setTimerMode(t)}
                    className={`py-2 rounded-xl text-xs font-extrabold transition-all border ${
                      timerMode === t
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {t === 'unlimited' ? '∞ Off' : `${t}s`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-cyan-400" />
                Custom Player Identifiers
              </label>
              <div className="space-y-2">
                {Array.from({ length: mode === 'pvai' ? 2 : playersCount }).map((_, idx) => {
                  const pId = idx + 1;
                  return (
                    <div key={pId} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-16">P{pId}:</span>
                      <input
                        type="text"
                        value={playerNames[pId] || ''}
                        onChange={(e) =>
                          setPlayerNames((prev) => ({ ...prev, [pId]: e.target.value }))
                        }
                        className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCoachEnabled(!coachEnabled)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                  coachEnabled
                    ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Coach {coachEnabled ? 'ON' : 'OFF'}
              </button>
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                  soundEnabled
                    ? 'bg-slate-800/80 border-slate-700 text-cyan-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                Audio {soundEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleStartGame}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-magenta-500 hover:from-cyan-300 hover:to-magenta-400 text-slate-950 font-black text-lg uppercase tracking-wider shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.01] active:scale-95 cursor-pointer"
          >
            <Play className="w-6 h-6 fill-current" />
            Initialize Battlefield
          </button>
        </div>
      </div>
    </div>
  );
};
