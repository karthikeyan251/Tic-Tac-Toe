import React from 'react';
import { Bot, User, Zap } from 'lucide-react';

export type ChatMessageItem = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isFallback?: boolean;
  structuredPlan?: {
    assessment?: string;
    dangerLevel?: string;
    recommendedMove?: { row: number; col: number } | null;
    shortTermPlan?: string;
    longTermPlan?: string;
    counterStrategy?: string;
  };
  timestamp: number;
};

interface ChatMessageProps {
  message: ChatMessageItem;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shrink-0 mt-1 shadow-sm">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 ${
          isUser
            ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-slate-950 font-medium rounded-tr-none shadow-md'
            : 'glass-panel bg-slate-900/90 border-slate-700/80 text-slate-200 rounded-tl-none shadow-md'
        }`}
      >
        {message.isFallback && !isUser && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/40 w-fit">
            <Zap className="w-3 h-3" /> Using Local Tactical Engine
          </div>
        )}

        <div className="whitespace-pre-wrap">{message.text}</div>

        {/* Render Structured Master Plan if present */}
        {message.structuredPlan && (
          <div className="bg-slate-950/80 p-3 rounded-xl border border-cyan-500/30 space-y-2 mt-2 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              <span className="text-[10px] uppercase font-bold text-cyan-400">Master Plan</span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  message.structuredPlan.dangerLevel === 'Critical' || message.structuredPlan.dangerLevel === 'High'
                    ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                }`}
              >
                Threat: {message.structuredPlan.dangerLevel}
              </span>
            </div>

            {message.structuredPlan.recommendedMove && (
              <p className="font-bold text-cyan-300">
                🎯 Recommended Move: Row {message.structuredPlan.recommendedMove.row + 1}, Col{' '}
                {message.structuredPlan.recommendedMove.col + 1}
              </p>
            )}
            {message.structuredPlan.shortTermPlan && (
              <p className="text-slate-300">
                <span className="font-bold text-slate-400">Short-Term:</span> {message.structuredPlan.shortTermPlan}
              </p>
            )}
            {message.structuredPlan.longTermPlan && (
              <p className="text-slate-300">
                <span className="font-bold text-slate-400">Long-Term:</span> {message.structuredPlan.longTermPlan}
              </p>
            )}
            {message.structuredPlan.counterStrategy && (
              <p className="text-slate-300">
                <span className="font-bold text-slate-400">Counter Strategy:</span> {message.structuredPlan.counterStrategy}
              </p>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
