import { cloneBoard, getAvailableMoves } from '../game/board';
import type { BoardConfig, Player, TacticalRecommendation } from '../game/gameTypes';
import { checkWinner } from '../game/winDetection';

export function evaluateTacticalMove(
  board: number[][],
  activePlayer: Player,
  config: BoardConfig,
  totalPlayers: number
): TacticalRecommendation {
  const size = board.length;
  const available = getAvailableMoves(board);
  const playerName = activePlayer.name;
  const pVal = activePlayer.id;

  if (available.length === 0) {
    return { coord: null, category: 'POSITION', message: 'No moves available.' };
  }

  // Priority 1: Immediate Win
  for (const move of available) {
    const tempBoard = cloneBoard(board);
    tempBoard[move.row][move.col] = pVal;
    if (checkWinner(tempBoard, config.winLength).winner === pVal) {
      return {
        coord: move,
        category: 'WIN NOW',
        message: `${playerName}: Win now at [${move.row + 1}, ${move.col + 1}]`,
      };
    }
  }

  // Priority 2: Emergency Defensive Block
  const opponents: number[] = [];
  for (let p = 1; p <= totalPlayers; p++) {
    if (p !== pVal) opponents.push(p);
  }

  for (const opp of opponents) {
    for (const move of available) {
      const tempBoard = cloneBoard(board);
      tempBoard[move.row][move.col] = opp;
      if (checkWinner(tempBoard, config.winLength).winner === opp) {
        return {
          coord: move,
          category: 'BLOCK',
          message: `${playerName}: Block Player ${opp}'s winning threat at [${move.row + 1}, ${move.col + 1}]`,
        };
      }
    }
  }

  // Priority 3: Create a Fork
  for (const move of available) {
    const tempBoard = cloneBoard(board);
    tempBoard[move.row][move.col] = pVal;
    const nextAvailable = getAvailableMoves(tempBoard);
    let winningThreats = 0;

    for (const nextMove of nextAvailable) {
      const forkTestBoard = cloneBoard(tempBoard);
      forkTestBoard[nextMove.row][nextMove.col] = pVal;
      if (checkWinner(forkTestBoard, config.winLength).winner === pVal) {
        winningThreats++;
      }
    }

    if (winningThreats >= 2) {
      return {
        coord: move,
        category: 'FORK',
        message: `Setup double winning fork at [${move.row + 1}, ${move.col + 1}]`,
      };
    }
  }

  // Priority 4: Extend a Strong Sequence
  for (const move of available) {
    const tempBoard = cloneBoard(board);
    tempBoard[move.row][move.col] = pVal;
    let countInSequence = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const r = move.row + dr;
        const c = move.col + dc;
        if (r >= 0 && r < size && c >= 0 && c < size && tempBoard[r][c] === pVal) {
          countInSequence++;
        }
      }
    }
    if (countInSequence >= 2) {
      return {
        coord: move,
        category: 'ATTACK',
        message: `Extend ${playerName}'s pressure line at [${move.row + 1}, ${move.col + 1}]`,
      };
    }
  }

  // Priority 5: Center Control
  const centerR = Math.floor(size / 2);
  const centerC = Math.floor(size / 2);
  const centerMove = available.find((m) => m.row === centerR && m.col === centerC);
  if (centerMove) {
    return {
      coord: centerMove,
      category: 'POSITION',
      message: `Center control improves future lines at [${centerMove.row + 1}, ${centerMove.col + 1}]`,
    };
  }

  // Priority 6: Control Corners
  const corners = [
    { row: 0, col: 0 },
    { row: 0, col: size - 1 },
    { row: size - 1, col: 0 },
    { row: size - 1, col: size - 1 },
  ];
  for (const corner of corners) {
    if (board[corner.row][corner.col] === 0) {
      return {
        coord: corner,
        category: 'POSITION',
        message: `Corner improves attack paths at [${corner.row + 1}, ${corner.col + 1}]`,
      };
    }
  }

  // Priority 7: General Mobility
  const firstAvail = available[0];
  return {
    coord: firstAvail,
    category: 'DEFEND',
    message: `Open position with multiple options at [${firstAvail.row + 1}, ${firstAvail.col + 1}]`,
  };
}
