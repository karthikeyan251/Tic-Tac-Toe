import { describe, it, expect } from 'vitest';
import { EasyAI } from '../ai/easyAI';
import { MediumAI } from '../ai/mediumAI';
import { MasterAI } from '../ai/masterAI';
import { evaluateTacticalMove } from '../ai/tacticalCoach';
import { DEFAULT_PLAYERS, BOARD_CONFIGS } from '../utils/constants';

describe('AI Engines & Tactical Coach', () => {
  const easyAI = new EasyAI();
  const mediumAI = new MediumAI();
  const masterAI = new MasterAI();

  it('Easy AI should return a legal available move', () => {
    const board = [
      [1, 2, 1],
      [2, 0, 1],
      [2, 1, 2],
    ];
    const move = easyAI.getBestMove(board, 1, BOARD_CONFIGS[3], 2);
    expect(move).toEqual({ row: 1, col: 1 });
  });

  it('Medium AI should block immediate opponent winning move', () => {
    const board = [
      [2, 2, 0], // Player 2 has 2 in a row -> needs block at (0,2)
      [1, 0, 0],
      [1, 0, 0],
    ];
    const move = mediumAI.getBestMove(board, 1, BOARD_CONFIGS[3], 2);
    expect(move).toEqual({ row: 0, col: 2 });
  });

  it('Master AI 3x3 should find winning move immediately', () => {
    const board = [
      [1, 1, 0], // Player 1 can win at (0,2)
      [2, 2, 0],
      [0, 0, 0],
    ];
    const move = masterAI.getBestMove(board, 1, BOARD_CONFIGS[3], 2);
    expect(move).toEqual({ row: 0, col: 2 });
  });

  it('Master AI should block forced winning threat', () => {
    const board = [
      [2, 2, 0], // Player 2 is threatening win at (0,2)
      [1, 0, 0],
      [0, 0, 0],
    ];
    const move = masterAI.getBestMove(board, 1, BOARD_CONFIGS[3], 2);
    expect(move).toEqual({ row: 0, col: 2 });
  });

  it('Tactical Coach should prioritize WIN NOW over BLOCK', () => {
    const board = [
      [1, 1, 0], // P1 can win at (0,2)
      [2, 2, 0], // P2 threatens at (0,2)
      [0, 0, 0],
    ];
    const rec = evaluateTacticalMove(board, DEFAULT_PLAYERS[0], BOARD_CONFIGS[3], 2);
    expect(rec.category).toBe('WIN NOW');
    expect(rec.coord).toEqual({ row: 0, col: 2 });
  });

  it('Tactical Coach should identify BLOCK when opponent is about to win', () => {
    const board = [
      [2, 2, 0], // P2 threatens win at (0,2)
      [1, 0, 0],
      [0, 0, 0],
    ];
    const rec = evaluateTacticalMove(board, DEFAULT_PLAYERS[0], BOARD_CONFIGS[3], 2);
    expect(rec.category).toBe('BLOCK');
    expect(rec.coord).toEqual({ row: 0, col: 2 });
  });
});
