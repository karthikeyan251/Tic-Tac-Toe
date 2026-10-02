import { getAvailableMoves, cloneBoard } from '../game/board';
import type { BoardConfig, Coordinate } from '../game/gameTypes';
import { checkWinner, checkDraw } from '../game/winDetection';
import { evaluateBoardScore } from '../utils/boardEvaluation';

const transpositionTable = new Map<string, { depth: number; score: number }>();

export function getOptimalMove3x3(
  board: number[][],
  playerVal: number,
  config: BoardConfig,
  _totalPlayers: number
): Coordinate {
  const available = getAvailableMoves(board);
  if (available.length === 0) return { row: 0, col: 0 };
  if (available.length === 9) return { row: 1, col: 1 };

  const opponentVal = playerVal === 1 ? 2 : 1;

  let bestScore = -Infinity;
  let bestMove = available[0];

  for (const move of available) {
    const tempBoard = cloneBoard(board);
    tempBoard[move.row][move.col] = playerVal;

    const score = minimax3x3(tempBoard, 0, false, playerVal, opponentVal, config, -Infinity, Infinity);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function minimax3x3(
  board: number[][],
  depth: number,
  isMaximizing: boolean,
  aiPlayer: number,
  humanPlayer: number,
  config: BoardConfig,
  alpha: number,
  beta: number
): number {
  const winRes = checkWinner(board, config.winLength);
  if (winRes.winner === aiPlayer) return 100 - depth;
  if (winRes.winner === humanPlayer) return depth - 100;
  if (checkDraw(board, winRes)) return 0;

  const available = getAvailableMoves(board);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of available) {
      board[move.row][move.col] = aiPlayer;
      const evalScore = minimax3x3(board, depth + 1, false, aiPlayer, humanPlayer, config, alpha, beta);
      board[move.row][move.col] = 0;
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of available) {
      board[move.row][move.col] = humanPlayer;
      const evalScore = minimax3x3(board, depth + 1, true, aiPlayer, humanPlayer, config, alpha, beta);
      board[move.row][move.col] = 0;
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function getDepthLimitedMoveNxN(
  board: number[][],
  playerVal: number,
  config: BoardConfig,
  totalPlayers: number,
  maxDepth: number = 3
): Coordinate {
  const available = getAvailableMoves(board);
  if (available.length === 0) return { row: 0, col: 0 };
  const size = board.length;

  if (available.length === size * size) {
    const mid = Math.floor(size / 2);
    return { row: mid, col: mid };
  }

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

  const candidateMoves = getCandidateMoves(board, available);

  candidateMoves.sort((a, b) => {
    const b1 = cloneBoard(board); b1[a.row][a.col] = playerVal;
    const b2 = cloneBoard(board); b2[b.row][b.col] = playerVal;
    return evaluateBoardScore(b2, playerVal, config, totalPlayers) - evaluateBoardScore(b1, playerVal, config, totalPlayers);
  });

  let bestScore = -Infinity;
  let bestMove = candidateMoves[0];
  transpositionTable.clear();

  for (const move of candidateMoves) {
    const tempBoard = cloneBoard(board);
    tempBoard[move.row][move.col] = playerVal;

    const score = alphaBetaNxN(
      tempBoard,
      1,
      maxDepth,
      false,
      playerVal,
      opponents,
      config,
      totalPlayers,
      -Infinity,
      Infinity
    );

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function alphaBetaNxN(
  board: number[][],
  depth: number,
  maxDepth: number,
  isMaximizing: boolean,
  aiPlayer: number,
  opponents: number[],
  config: BoardConfig,
  totalPlayers: number,
  alpha: number,
  beta: number
): number {
  const winRes = checkWinner(board, config.winLength);
  if (winRes.winner === aiPlayer) return 100000 - depth * 100;
  if (winRes.winner !== null && winRes.winner !== aiPlayer) return -100000 + depth * 100;
  if (checkDraw(board, winRes)) return 0;
  if (depth >= maxDepth) {
    return evaluateBoardScore(board, aiPlayer, config, totalPlayers);
  }

  const boardKey = JSON.stringify(board) + isMaximizing;
  const cached = transpositionTable.get(boardKey);
  if (cached && cached.depth >= maxDepth - depth) {
    return cached.score;
  }

  const available = getAvailableMoves(board);
  const candidates = getCandidateMoves(board, available);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of candidates) {
      board[move.row][move.col] = aiPlayer;
      const evalScore = alphaBetaNxN(board, depth + 1, maxDepth, false, aiPlayer, opponents, config, totalPlayers, alpha, beta);
      board[move.row][move.col] = 0;

      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    transpositionTable.set(boardKey, { depth: maxDepth - depth, score: maxEval });
    return maxEval;
  } else {
    let minEval = Infinity;
    const oppPlayer = opponents[0] || (aiPlayer === 1 ? 2 : 1);
    for (const move of candidates) {
      board[move.row][move.col] = oppPlayer;
      const evalScore = alphaBetaNxN(board, depth + 1, maxDepth, true, aiPlayer, opponents, config, totalPlayers, alpha, beta);
      board[move.row][move.col] = 0;

      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    transpositionTable.set(boardKey, { depth: maxDepth - depth, score: minEval });
    return minEval;
  }
}

function getCandidateMoves(board: number[][], available: Coordinate[]): Coordinate[] {
  const size = board.length;
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
