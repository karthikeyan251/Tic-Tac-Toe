import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, Trash2, Target } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { geminiService } from '../../services/geminiService';
import { ChatMessage } from './ChatMessage';
import type { ChatMessageItem } from './ChatMessage';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({ isOpen, onClose }) => {
  const board = useGameStore((state) => state.board);
  const boardSize = useGameStore((state) => state.boardSize);
  const winLength = useGameStore((state) => state.winLength);
  const players = useGameStore((state) => state.players);
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);
  const mode = useGameStore((state) => state.mode);
  const difficulty = useGameStore((state) => state.difficulty);

  const activePlayer = players[currentPlayerIndex];

  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'Greetings Commander. I am your Gemini Tactical Assistant. Ask me for real-time move analysis, strategic master plans, or grandmaster advice.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: ChatMessageItem = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const res = await geminiService.sendFreeformChat(
      userText,
      board,
      activePlayer,
      { size: boardSize, allowedPlayers: [players.length], winLength },
      messages.map((m) => ({ role: m.sender, parts: m.text }))
    );

    const aiMsg: ChatMessageItem = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: res.text,
      isFallback: res.isFallback,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleAnalyzeBoard = async () => {
    if (loading) return;
    setLoading(true);

    const userMsg: ChatMessageItem = {
      id: Date.now().toString(),
      sender: 'user',
      text: '⚡ Analyze Current Board & Recommend Move',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    const res = await geminiService.analyzeMove(
      board,
      activePlayer,
      { size: boardSize, allowedPlayers: [players.length], winLength },
      players.length
    );

    let text = `Analysis for ${activePlayer.name}:\nCategory: [${res.category}]\nStrategy: ${res.strategy}\n\nReason: ${res.reason}`;
    if (res.recommendedMove) {
      text = `🎯 Recommended Move: Row ${res.recommendedMove.row + 1}, Col ${res.recommendedMove.col + 1}\n` + text;
    }

    const aiMsg: ChatMessageItem = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text,
      isFallback: res.isFallback,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleMasterPlan = async () => {
    if (loading) return;
    setLoading(true);

    const userMsg: ChatMessageItem = {
      id: Date.now().toString(),
      sender: 'user',
      text: '🛡️ Generate Strategic Master Plan',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    const plan = await geminiService.generateMasterPlan(
      board,
      activePlayer,
      { size: boardSize, allowedPlayers: [players.length], winLength },
      players.length,
      mode,
      difficulty
    );

    const aiMsg: ChatMessageItem = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: plan.assessment,
      isFallback: plan.isFallback,
      structuredPlan: {
        assessment: plan.assessment,
        dangerLevel: plan.dangerLevel,
        recommendedMove: plan.recommendedMove,
        shortTermPlan: plan.shortTermPlan,
        longTermPlan: plan.longTermPlan,
        counterStrategy: plan.counterStrategy,
      },
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full sm:w-[420px] h-full glass-panel border-l border-cyan-500/30 flex flex-col shadow-2xl animate-in slide-in-from-right duration-250 bg-slate-950/95">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-500 to-sky-600 text-slate-950 font-black shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-100 tracking-wide uppercase">
                AI Master Assistant
              </h2>
              <p className="text-[10px] text-cyan-400 font-medium">Gemini 2.5 Flash Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMessages([])}
              title="Clear Conversation"
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Close Drawer"
              className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-3 bg-slate-900/40 border-b border-slate-800/80 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAnalyzeBoard}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/80 transition-all"
          >
            <Target className="w-3.5 h-3.5" /> Analyze Move
          </button>
          <button
            type="button"
            onClick={handleMasterPlan}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-900 border border-slate-700 text-slate-200 hover:border-slate-600 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Master Plan
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-cyan-500/20">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 italic p-2 bg-slate-900/60 rounded-xl w-fit border border-cyan-500/30 animate-pulse">
              <Bot className="w-4 h-4" /> AI Master is evaluating tactical options...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-slate-800 bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask AI strategic advice..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 disabled:opacity-50 transition-all shadow-md shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
