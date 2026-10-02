import type { Coordinate } from './gameTypes';

export function isValidMove(board: number[][], coord: Coordinate | null): boolean {
  if (!coord) return false;
  const size = board.length;
  if (size === 0) return false;
  if (coord.row < 0 || coord.row >= size || coord.col < 0 || coord.col >= size) {
    return false;
  }
  return board[coord.row][coord.col] === 0;
}
