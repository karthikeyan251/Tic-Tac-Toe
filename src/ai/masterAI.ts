import type { BoardConfig, Coordinate } from '../game/gameTypes';
import type { AIEngine } from './aiInterface';
import { getOptimalMove3x3, getDepthLimitedMoveNxN } from './minimax';

export class MasterAI implements AIEngine {
  getBestMove(
    board: number[][],
    playerVal: number,
    config: BoardConfig,
    totalPlayers: number
  ): Coordinate {
    if (config.size === 3) {
      return getOptimalMove3x3(board, playerVal, config, totalPlayers);
    } else if (config.size === 4) {
      return getDepthLimitedMoveNxN(board, playerVal, config, totalPlayers, 4);
    } else {
      return getDepthLimitedMoveNxN(board, playerVal, config, totalPlayers, 3);
    }
  }
}
