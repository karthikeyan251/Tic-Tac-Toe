import { getAvailableMoves, cloneBoard } from '../game/board';
import type { BoardConfig, Coordinate } from '../game/gameTypes';
import { checkWinner } from '../game/winDetection';
import type { AIEngine } from './aiInterface';

export class EasyAI implements AIEngine {
  getBestMove(
    board: number[][],
    playerVal: number,
    config: BoardConfig,
    totalPlayers: number
  ): Coordinate {
    const available = getAvailableMoves(board);
    if (available.length === 0) return { row: 0, col: 0 };

    for (const move of available) {
      const tempBoard = cloneBoard(board);
      tempBoard[move.row][move.col] = playerVal;
      const winRes = checkWinner(tempBoard, config.winLength);
      if (winRes.winner === playerVal) {
        return move;
      }
    }

    const opponents: number[] = [];
    for (let p = 1; p <= totalPlayers; p++) {
      if (p !== playerVal) opponents.push(p);
    }

    for (const opp of opponents) {
      for (const move of available) {
        const tempBoard = cloneBoard(board);
        tempBoard[move.row][move.col] = opp;
        const winRes = checkWinner(tempBoard, config.winLength);
        if (winRes.winner === opp) {
          return move;
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  }
}
