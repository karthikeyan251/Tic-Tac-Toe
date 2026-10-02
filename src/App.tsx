import React, { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { AppHeader } from './components/Header/AppHeader';
import { GameSetup } from './components/Setup/GameSetup';
import { GameBoard } from './components/Board/GameBoard';
import { TacticalHUD } from './components/TacticalCoach/TacticalHUD';
import { TurnTimer } from './components/Timer/TurnTimer';
import { TacticalInfoPanel } from './components/Sidebar/TacticalInfoPanel';
import { Scoreboard } from './components/Scoreboard/Scoreboard';
import { MoveHistory } from './components/MoveHistory/MoveHistory';
import { GameControls } from './components/GameControls/GameControls';
import { AIChatDrawer } from './components/Chatbot/AIChatDrawer';
import { VictoryOverlay } from './components/VictoryModal/VictoryOverlay';
import { SettingsModal } from './components/Settings/SettingsModal';

export const App: React.FC = () => {
  const initStore = useGameStore((state) => state.initStore);
  const gameStatus = useGameStore((state) => state.gameStatus);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

  useEffect(() => {
    initStore();
  }, [initStore]);

  if (gameStatus === 'setup') {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-slate-100 flex flex-col">
        <GameSetup />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <AppHeader
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleChatDrawer={() => setIsChatDrawerOpen((prev) => !prev)}
      />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        {/* Left Column (Desktop: Specs & Scoreboard) */}
        <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
          <TacticalInfoPanel />
          <Scoreboard />
        </div>

        {/* Center Column (Battlefield Board, HUD, Timer & Controls) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-3 order-1 lg:order-2 w-full">
          <TacticalHUD />

          <div className="w-full flex items-center justify-between px-2 max-w-lg">
            <TurnTimer />
          </div>

          <GameBoard />

          <GameControls />

          <div className="w-full max-w-lg pt-2">
            <MoveHistory />
          </div>
        </div>

        {/* Right Column (Desktop: Quick Chatbot teaser / info) */}
        <div className="lg:col-span-3 space-y-4 order-3 hidden lg:block">
          <div className="glass-panel p-4 rounded-2xl border-cyan-500/20 shadow-xl space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-black text-cyan-400">
              AI Command Station
            </h3>
            <p className="text-xs text-slate-300">
              Access real-time Gemini AI strategic planning, board analysis, and counter-threat recommendations.
            </p>
            <button
              type="button"
              onClick={() => setIsChatDrawerOpen(true)}
              className="w-full py-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 hover:bg-cyan-900/80 text-cyan-300 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Open AI Master Drawer
            </button>
          </div>
        </div>
      </main>

      {/* Modals & Overlays */}
      <VictoryOverlay />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <AIChatDrawer isOpen={isChatDrawerOpen} onClose={() => setIsChatDrawerOpen(false)} />
    </div>
  );
};

export default App;
