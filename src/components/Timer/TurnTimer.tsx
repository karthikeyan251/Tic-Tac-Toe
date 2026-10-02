import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

export const TurnTimer: React.FC = () => {
  const timerMode = useGameStore((state) => state.timerMode);
  const remainingTime = useGameStore((state) => state.remainingTime);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const updateTimer = useGameStore((state) => state.updateTimer);

  useEffect(() => {
    if (timerMode === 'unlimited' || gameStatus !== 'playing') return;

    const interval = setInterval(() => {
      updateTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [timerMode, gameStatus, remainingTime, updateTimer]);

  if (timerMode === 'unlimited' || gameStatus !== 'playing') {
    return null;
  }

  const total = typeof timerMode === 'number' ? timerMode : 10;
  const percentage = (remainingTime / total) * 100;
  const isWarning = remainingTime <= 3;

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel border-cyan-500/20 bg-slate-900/90 shadow-md">
      <div className="relative w-9 h-9 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            className={`transition-all duration-1000 ease-linear ${
              isWarning ? 'stroke-rose-500' : 'stroke-cyan-400'
            }`}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span
          className={`absolute text-xs font-black ${
            isWarning ? 'text-rose-400 animate-ping' : 'text-cyan-300'
          }`}
        >
          {remainingTime}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
          Turn Timer
        </span>
        <span className="text-xs font-bold text-slate-200">{remainingTime}s remaining</span>
      </div>
    </div>
  );
};
