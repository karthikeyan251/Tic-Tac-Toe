import React from 'react';
import { Undo2, Redo2, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const GameControls: React.FC = () => {
  const undoStack = useGameStore((state) => state.undoStack);
  const redoStack = useGameStore((state) => state.redoStack);
  const undo = useGameStore((state) => state.undo);
  const redo = useGameStore((state) => state.redo);
  const playAgain = useGameStore((state) => state.playAgain);
  const goToMainMenu = useGameStore((state) => state.goToMainMenu);

  const canUndo = undoStack.length > 1;
  const canRedo = redoStack.length > 0;

  return (
    <div className="w-full max-w-lg mx-auto flex items-center justify-center gap-2 sm:gap-3 py-2">
      {/* Undo */}
      <button
        type="button"
        onClick={undo}
        disabled={!canUndo}
        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
          canUndo
            ? 'glass-panel hover:bg-cyan-950/40 hover:border-cyan-500/50 text-cyan-300 active:scale-95'
            : 'bg-slate-900/40 border-slate-800/60 text-slate-600 cursor-not-allowed'
        }`}
      >
        <Undo2 className="w-3.5 h-3.5" />
        Undo
      </button>

      {/* Redo */}
      <button
        type="button"
        onClick={redo}
        disabled={!canRedo}
        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
          canRedo
            ? 'glass-panel hover:bg-cyan-950/40 hover:border-cyan-500/50 text-cyan-300 active:scale-95'
            : 'bg-slate-900/40 border-slate-800/60 text-slate-600 cursor-not-allowed'
        }`}
      >
        <Redo2 className="w-3.5 h-3.5" />
        Redo
      </button>

      {/* Reset Game */}
      <button
        type="button"
        onClick={playAgain}
        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold glass-panel hover:bg-slate-800/80 hover:border-slate-600 text-slate-200 border-slate-700/80 transition-all active:scale-95 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset
      </button>

      {/* Setup Screen */}
      <button
        type="button"
        onClick={goToMainMenu}
        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold glass-panel hover:bg-slate-800/80 hover:border-slate-600 text-slate-300 border-slate-700/80 transition-all active:scale-95 cursor-pointer"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        Setup
      </button>
    </div>
  );
};
