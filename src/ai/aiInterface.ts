import type { BoardConfig, Coordinate } from '../game/gameTypes';

export interface AIEngine {
  getBestMove(
    board: number[][],
    playerVal: number,
    config: BoardConfig,
    totalPlayers: number
  ): Coordinate;
}
