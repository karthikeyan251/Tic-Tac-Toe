import { GoogleGenAI } from '@google/genai';
import { evaluateTacticalMove } from '../ai/tacticalCoach';
import type { BoardConfig, Coordinate, Player } from '../game/gameTypes';
import { isValidMove } from '../game/moveValidation';

export type GeminiMoveAnalysis = {
  recommendedMove: Coordinate | null;
  category: string;
  reason: string;
  strategy: string;
  isFallback: boolean;
};

export type GeminiMasterPlan = {
  assessment: string;
  dangerLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  recommendedMove: Coordinate | null;
  shortTermPlan: string;
  longTermPlan: string;
  counterStrategy: string;
  isFallback: boolean;
};

class GeminiService {
  private getApiKey(): string | null {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key || typeof key !== 'string' || key.trim() === '' || key === 'undefined') {
      return null;
    }
    return key.trim();
  }

  public async analyzeMove(
    board: number[][],
    activePlayer: Player,
    config: BoardConfig,
    totalPlayers: number
  ): Promise<GeminiMoveAnalysis> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      return this.getLocalAnalysisFallback(board, activePlayer, config, totalPlayers);
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const matrixStr = JSON.stringify(board);
      const prompt = `You are a Grandmaster Cyberpunk Tactical AI Coach for Tic-Tac-Toe.
Analyze this game state:
- Board Matrix (0=empty, player numbers 1 to ${totalPlayers}): ${matrixStr}
- Active Player: Player ${activePlayer.id} (${activePlayer.name}, Symbol: ${activePlayer.symbol})
- Board Size: ${config.size}x${config.size}
- Required Winning Length: ${config.winLength} in a row

CRITICAL RULE: The player must form EXACTLY ${config.winLength} symbols continuously to win. Shorter lines are NOT a win.
Choose the absolute optimal move for Player ${activePlayer.id}.
Row and column indices are 0-indexed (from 0 to ${config.size - 1}).

Return ONLY a valid JSON object matching this schema exactly (no markdown formatting outside JSON):
{
  "row": number,
  "col": number,
  "category": "WIN NOW" | "BLOCK" | "FORK" | "ATTACK" | "DEFEND" | "POSITION",
  "reason": "short clear explanation",
  "strategy": "tactical summary"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      const cleanJsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJsonStr);

      const move: Coordinate = { row: parsed.row, col: parsed.col };

      if (isValidMove(board, move)) {
        return {
          recommendedMove: move,
          category: parsed.category || 'POSITION',
          reason: parsed.reason || 'Strategic positioning',
          strategy: parsed.strategy || 'Optimal placement',
          isFallback: false,
        };
      } else {
        console.warn('Gemini returned invalid or occupied coordinate. Falling back to local AI.');
        return this.getLocalAnalysisFallback(board, activePlayer, config, totalPlayers);
      }
    } catch (error) {
      console.warn('Gemini API call failed or timed out. Falling back to local engine.', error);
      return this.getLocalAnalysisFallback(board, activePlayer, config, totalPlayers);
    }
  }

  public async generateMasterPlan(
    board: number[][],
    activePlayer: Player,
    config: BoardConfig,
    totalPlayers: number,
    gameMode: string,
    difficulty?: string
  ): Promise<GeminiMasterPlan> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      const localCoach = evaluateTacticalMove(board, activePlayer, config, totalPlayers);
      return {
        assessment: 'Using Local Tactical Engine analysis.',
        dangerLevel: 'Medium',
        recommendedMove: localCoach.coord,
        shortTermPlan: localCoach.message,
        longTermPlan: 'Secure center and build multi-directional threats.',
        counterStrategy: 'Watch opponent alignment and block forced forks.',
        isFallback: true,
      };
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Analyze this Tic-Tac-Toe battle:
Board: ${JSON.stringify(board)}
Active Player: Player ${activePlayer.id} (${activePlayer.name})
Game Mode: ${gameMode}, Difficulty: ${difficulty || 'N/A'}
Board Size: ${config.size}x${config.size}
Required Winning Length: ${config.winLength} in a row

Provide a high-level Master Plan based strictly on completing ${config.winLength} in a row.
Return ONLY valid JSON matching this schema:
{
  "assessment": "brief assessment of position",
  "dangerLevel": "Low" | "Medium" | "High" | "Critical",
  "row": number,
  "col": number,
  "shortTermPlan": "immediate priority",
  "longTermPlan": "endgame roadmap",
  "counterStrategy": "how to counter opponent"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const move: Coordinate = { row: parsed.row, col: parsed.col };
      const validRecMove = isValidMove(board, move) ? move : null;

      return {
        assessment: parsed.assessment || 'Position under control.',
        dangerLevel: parsed.dangerLevel || 'Medium',
        recommendedMove: validRecMove,
        shortTermPlan: parsed.shortTermPlan || 'Execute key positional move.',
        longTermPlan: parsed.longTermPlan || 'Build compound line threats.',
        counterStrategy: parsed.counterStrategy || 'Deny center and open diagonals.',
        isFallback: false,
      };
    } catch (error) {
      console.warn('Gemini master plan failed. Falling back to local engine.', error);
      const localCoach = evaluateTacticalMove(board, activePlayer, config, totalPlayers);
      return {
        assessment: 'Using Local Tactical Engine.',
        dangerLevel: 'Medium',
        recommendedMove: localCoach.coord,
        shortTermPlan: localCoach.message,
        longTermPlan: 'Control key line intersections.',
        counterStrategy: 'Block opponent winning paths.',
        isFallback: true,
      };
    }
  }

  public async sendFreeformChat(
    userMessage: string,
    board: number[][],
    activePlayer: Player,
    config: BoardConfig,
    _chatHistory: { role: string; parts: string }[]
  ): Promise<{ text: string; isFallback: boolean }> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      return {
        text: `⚡ [Using Local Tactical Engine]\nI am operating in offline mode. I can recommend moves directly on the HUD! To ask freeform AI questions, add VITE_GEMINI_API_KEY to your environment variables.`,
        isFallback: true,
      };
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemContext = `You are a Grandmaster Cyberpunk Tactical AI Coach in a high-tech Tic-Tac-Toe application.
Current Board state: ${JSON.stringify(board)}.
Board Size: ${config.size}x${config.size}
Required Winning Length: ${config.winLength} in a row.
Active turn: Player ${activePlayer.id} (${activePlayer.name}, Symbol: ${activePlayer.symbol}).
Keep your answer energetic, tactical, encouraging, concise, and game-focused!`;

      const prompt = `${systemContext}\n\nUser Question: ${userMessage}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return {
        text: response.text || 'No tactical response received.',
        isFallback: false,
      };
    } catch (error) {
      console.warn('Gemini chat failed.', error);
      return {
        text: `⚡ [Using Local Tactical Engine]\nConnection error to Gemini API. Falling back to local tactical system.`,
        isFallback: true,
      };
    }
  }

  private getLocalAnalysisFallback(
    board: number[][],
    activePlayer: Player,
    config: BoardConfig,
    totalPlayers: number
  ): GeminiMoveAnalysis {
    const local = evaluateTacticalMove(board, activePlayer, config, totalPlayers);
    return {
      recommendedMove: local.coord,
      category: local.category,
      reason: local.message,
      strategy: 'Using Local Tactical Engine',
      isFallback: true,
    };
  }
}

export const geminiService = new GeminiService();
