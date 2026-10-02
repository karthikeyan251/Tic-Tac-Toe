import type { BoardConfig, Coordinate } from '../game/gameTypes';

export function getAllLines(board: number[][], winLength: number): Coordinate[][] {
  const size = board.length;
  const lines: Coordinate[][] = [];

  // Horizontal segments
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      const seg: Coordinate[] = [];
      for (let k = 0; k < winLength; k++) {
        seg.push({ row: r, col: c + k });
      }
      lines.push(seg);
    }
  }

  // Vertical segments
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - winLength; r++) {
      const seg: Coordinate[] = [];
      for (let k = 0; k < winLength; k++) {
        seg.push({ row: r + k, col: c });
      }
      lines.push(seg);
    }
  }

  // Diagonals (Top-Left to Bottom-Right)
  for (let r = 0; r <= size - winLength; r++) {
    for (let c = 0; c <= size - winLength; c++) {
      const seg: Coordinate[] = [];
      for (let k = 0; k < winLength; k++) {
        seg.push({ row: r + k, col: c + k });
      }
      lines.push(seg);
    }
  }

  // Reverse Diagonals (Top-Right to Bottom-Left)
  for (let r = 0; r <= size - winLength; r++) {
    for (let c = winLength - 1; c < size; c++) {
      const seg: Coordinate[] = [];
      for (let k = 0; k < winLength; k++) {
        seg.push({ row: r + k, col: c - k });
      }
      lines.push(seg);
    }
  }

  return lines;
}

export function evaluateBoardScore(
  board: number[][],
  targetPlayer: number,
  config: BoardConfig,
  _totalPlayers: number
): number {
  const winLength = config.winLength;
  const lines = getAllLines(board, winLength);
  let totalScore = 0;

  for (const line of lines) {
    let targetCount = 0;
    let opponentCount = 0;

    for (const cell of line) {
      const val = board[cell.row][cell.col];
      if (val === targetPlayer) {
        targetCount++;
      } else if (val !== 0) {
        opponentCount++;
      }
    }

    if (targetCount > 0 && opponentCount === 0) {
      if (targetCount === winLength) totalScore += 100000;
      else if (targetCount === winLength - 1) totalScore += 2000;
      else if (targetCount === winLength - 2) totalScore += 150;
      else totalScore += 15;
    } else if (opponentCount > 0 && targetCount === 0) {
      if (opponentCount === winLength) totalScore -= 100000;
      else if (opponentCount === winLength - 1) totalScore -= 3000;
      else if (opponentCount === winLength - 2) totalScore -= 200;
      else totalScore -= 20;
    }
  }

  const size = board.length;
  const center = (size - 1) / 2;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === targetPlayer) {
        const distFromCenter = Math.abs(r - center) + Math.abs(c - center);
        totalScore += Math.max(0, 10 - distFromCenter * 3);
      }
    }
  }

  return totalScore;
}
