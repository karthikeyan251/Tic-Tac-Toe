import { describe, it, expect } from 'vitest';
import { checkWinner, checkDraw } from '../game/winDetection';
import { createBoard } from '../game/board';
import { isValidMove } from '../game/moveValidation';
import { sanitizePlayerCount } from '../game/rules';

describe('Board-Size-Based Win Conditions & Game Rules', () => {
  it('3x3: 3 in a row is a win', () => {
    const board = [
      [1, 1, 1],
      [0, 2, 0],
      [2, 0, 0],
    ];
    const res = checkWinner(board, 3);
    expect(res.winner).toBe(1);
    expect(res.winningCells).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ]);
  });

  it('4x4: 4 in a row is a WIN; 3 in a row is NOT a win', () => {
    const board3InRow = [
      [1, 1, 1, 0],
      [0, 2, 0, 0],
      [0, 2, 0, 0],
      [0, 0, 0, 0],
    ];
    // With winLength = 4 for 4x4, 3 in a row is NOT a win!
    expect(checkWinner(board3InRow, 4).winner).toBeNull();

    const board4InRow = [
      [1, 1, 1, 1],
      [0, 2, 0, 0],
      [0, 2, 0, 0],
      [0, 0, 0, 0],
    ];
    // 4 in a row IS a win
    const res = checkWinner(board4InRow, 4);
    expect(res.winner).toBe(1);
    expect(res.winningCells).toHaveLength(4);
  });

  it('4x4: diagonal of 4 is a win', () => {
    const board = [
      [2, 0, 0, 0],
      [0, 2, 0, 0],
      [0, 0, 2, 0],
      [0, 0, 0, 2],
    ];
    const res = checkWinner(board, 4);
    expect(res.winner).toBe(2);
    expect(res.winningCells).toHaveLength(4);
  });

  it('5x5: 5 in a row is a WIN; 4 in a row is NOT a win', () => {
    const board4InRow = [
      [1, 1, 1, 1, 0],
      [0, 2, 0, 0, 0],
      [0, 0, 2, 0, 0],
      [0, 0, 0, 2, 0],
      [0, 0, 0, 0, 0],
    ];
    // With winLength = 5 for 5x5, 4 in a row is NOT a win!
    expect(checkWinner(board4InRow, 5).winner).toBeNull();

    const board5InRow = [
      [1, 1, 1, 1, 1],
      [0, 2, 0, 0, 0],
      [0, 0, 2, 0, 0],
      [0, 0, 0, 2, 0],
      [0, 0, 0, 0, 0],
    ];
    // 5 in a row IS a win
    const res = checkWinner(board5InRow, 5);
    expect(res.winner).toBe(1);
    expect(res.winningCells).toHaveLength(5);
  });

  it('5x5: diagonal of 5 is a win', () => {
    const board = [
      [2, 0, 0, 0, 0],
      [0, 2, 0, 0, 0],
      [0, 0, 2, 0, 0],
      [0, 0, 0, 2, 0],
      [0, 0, 0, 0, 2],
    ];
    const res = checkWinner(board, 5);
    expect(res.winner).toBe(2);
    expect(res.winningCells).toHaveLength(5);
  });

  it('6x6: 6 in a row is a WIN; 5 in a row is NOT a win', () => {
    const board5InRow = createBoard(6);
    board5InRow[0] = [1, 1, 1, 1, 1, 0];
    expect(checkWinner(board5InRow, 6).winner).toBeNull();

    const board6InRow = createBoard(6);
    board6InRow[0] = [1, 1, 1, 1, 1, 1];
    const res = checkWinner(board6InRow, 6);
    expect(res.winner).toBe(1);
    expect(res.winningCells).toHaveLength(6);
  });

  it('6x6: reverse diagonal of 6 is a win', () => {
    const board = createBoard(6);
    for (let i = 0; i < 6; i++) {
      board[i][5 - i] = 3;
    }
    const res = checkWinner(board, 6);
    expect(res.winner).toBe(3);
    expect(res.winningCells).toHaveLength(6);
  });

  it('should detect draw when board is completely filled without a win', () => {
    const board = [
      [1, 2, 1],
      [1, 2, 2],
      [2, 1, 1],
    ];
    const winRes = checkWinner(board, 3);
    expect(winRes.winner).toBeNull();
    expect(checkDraw(board, winRes)).toBe(true);
  });

  it('should validate move boundaries and cell emptiness', () => {
    const board = createBoard(4);
    board[1][1] = 1;

    expect(isValidMove(board, { row: 1, col: 1 })).toBe(false); // Occupied
    expect(isValidMove(board, { row: 4, col: 0 })).toBe(false); // Out of bounds
    expect(isValidMove(board, { row: 0, col: 0 })).toBe(true); // Valid empty
  });

  it('checkWinner overloaded signature with target player parameter', () => {
    const board = [
      [1, 1, 1, 1],
      [0, 2, 0, 0],
      [0, 2, 0, 0],
      [0, 0, 0, 0],
    ];
    // Check specifically for player 1 with winLength 4
    const resP1 = checkWinner(board, 1, 4);
    expect(resP1.winner).toBe(1);

    // Check specifically for player 2 with winLength 4 (player 2 only has 2 cells)
    const resP2 = checkWinner(board, 2, 4);
    expect(resP2.winner).toBeNull();
  });

  it('should sanitize player counts based on grid limits', () => {
    expect(sanitizePlayerCount(3, 4)).toBe(2); // 3x3 -> 2
    expect(sanitizePlayerCount(4, 3)).toBe(3); // 4x4 -> 3
    expect(sanitizePlayerCount(5, 4)).toBe(4); // 5x5 -> 4
    expect(sanitizePlayerCount(6, 4)).toBe(4); // 6x6 -> 4
  });
});
