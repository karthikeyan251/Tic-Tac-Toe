import { getAvailableMoves, cloneBoard } from '../game/board';
import type { BoardConfig, Coordinate } from '../game/gameTypes';
import { checkWinner } from '../game/winDetection';
import { evaluateBoardScore } from '../utils/boardEvaluation';
import type { AIEngine } from './aiInterface';

export class MediumAI implements AIEngine {
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
      if (checkWinner(tempBoard, config.winLength).winner === playerVal) {
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
        if (checkWinner(tempBoard, config.winLength).winner === opp) {
          return move;
        }
      }
    }

    let bestScore = -Infinity;
    let bestMove = available[0];

    const candidateMoves = this.pruneCandidateMoves(board, available);

    for (const move of candidateMoves) {
      const tempBoard = cloneBoard(board);
      tempBoard[move.row][move.col] = playerVal;

      let score = evaluateBoardScore(tempBoard, playerVal, config, totalPlayers);

      let maxOpponentResponse = -Infinity;
      const nextAvailable = getAvailableMoves(tempBoard);

      for (const opp of opponents) {
        for (const oppMove of nextAvailable) {
          const oppBoard = cloneBoard(tempBoard);
          oppBoard[oppMove.row][oppMove.col] = opp;
          const oppScore = evaluateBoardScore(oppBoard, opp, config, totalPlayers);
          if (oppScore > maxOpponentResponse) {
            maxOpponentResponse = oppScore;
          }
        }
      }

      score -= maxOpponentResponse * 0.8;

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  private pruneCandidateMoves(board: number[][], available: Coordinate[]): Coordinate[] {
    const size = board.length;
    const isBoardEmpty = available.length === size * size;
    if (isBoardEmpty) {
      const mid = Math.floor(size / 2);
      return [{ row: mid, col: mid }];
    }

    const candidates = available.filter((move) => {
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const r = move.row + dr;
          const c = move.col + dc;
          if (r >= 0 && r < size && c >= 0 && c < size) {
            if (board[r][c] !== 0) return true;
          }
        }
      }
      return false;
    });

    return candidates.length > 0 ? candidates : available;
  }
}
