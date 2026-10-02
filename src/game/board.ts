import type { Coordinate } from './gameTypes';

export function createBoard(size: number): number[][] {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

export function cloneBoard(board: number[][]): number[][] {
  return board.map((row) => [...row]);
}

export function getAvailableMoves(board: number[][]): Coordinate[] {
  const moves: Coordinate[] = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === 0) {
        moves.push({ row: r, col: c });
      }
    }
  }
  return moves;
}

export function isBoardFull(board: number[][]): boolean {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === 0) return false;
    }
  }
  return true;
}
