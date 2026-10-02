import type { Coordinate } from '../game/gameTypes';

export function isSameCoord(c1: Coordinate | null, c2: Coordinate | null): boolean {
  if (!c1 || !c2) return false;
  return c1.row === c2.row && c1.col === c2.col;
}

export function containsCoord(coords: Coordinate[], target: Coordinate): boolean {
  return coords.some((c) => c.row === target.row && c.col === target.col);
}

export function coordToString(coord: Coordinate): string {
  return `[${coord.row + 1}, ${coord.col + 1}]`;
}

export function indexToCoord(index: number, boardSize: number): Coordinate {
  return {
    row: Math.floor(index / boardSize),
    col: index % boardSize,
  };
}

export function coordToIndex(coord: Coordinate, boardSize: number): number {
  return coord.row * boardSize + coord.col;
}
