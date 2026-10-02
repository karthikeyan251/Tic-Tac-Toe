import type { Coordinate, WinResult } from './gameTypes';

export function checkWinner(board: number[][], winLength: number): WinResult;
export function checkWinner(board: number[][], player: number, winLength: number): WinResult;
export function checkWinner(board: number[][], arg2: number, arg3?: number): WinResult {
  let targetPlayer: number | null = null;
  let winLength: number;

  if (typeof arg3 === 'number') {
    targetPlayer = arg2;
    winLength = arg3;
  } else {
    winLength = arg2;
  }

  const size = board.length;
  if (size === 0) return { winner: null, winningCells: [] };

  const checkLine = (line: Coordinate[]): WinResult | null => {
    let currentVal = 0;
    let count = 0;
    let lineCells: Coordinate[] = [];

    for (const cell of line) {
      const val = board[cell.row][cell.col];
      if (val !== 0 && val === currentVal && (targetPlayer === null || val === targetPlayer)) {
        count++;
        lineCells.push(cell);
        if (count >= winLength) {
          return { winner: currentVal, winningCells: lineCells };
        }
      } else {
        currentVal = val;
        const isValidVal = val !== 0 && (targetPlayer === null || val === targetPlayer);
        count = isValidVal ? 1 : 0;
        lineCells = isValidVal ? [cell] : [];
      }
    }
    return null;
  };

  // 1. Check Horizontal Rows
  for (let r = 0; r < size; r++) {
    const rowCoords: Coordinate[] = [];
    for (let c = 0; c < size; c++) {
      rowCoords.push({ row: r, col: c });
    }
    const res = checkLine(rowCoords);
    if (res) return res;
  }

  // 2. Check Vertical Columns
  for (let c = 0; c < size; c++) {
    const colCoords: Coordinate[] = [];
    for (let r = 0; r < size; r++) {
      colCoords.push({ row: r, col: c });
    }
    const res = checkLine(colCoords);
    if (res) return res;
  }

  // 3. Check Main Diagonals (Top-Left to Bottom-Right)
  for (let colStart = 0; colStart <= size - winLength; colStart++) {
    const diagCoords: Coordinate[] = [];
    for (let k = 0; k < size - colStart; k++) {
      diagCoords.push({ row: k, col: colStart + k });
    }
    const res = checkLine(diagCoords);
    if (res) return res;
  }

  for (let rowStart = 1; rowStart <= size - winLength; rowStart++) {
    const diagCoords: Coordinate[] = [];
    for (let k = 0; k < size - rowStart; k++) {
      diagCoords.push({ row: rowStart + k, col: k });
    }
    const res = checkLine(diagCoords);
    if (res) return res;
  }

  // 4. Check Reverse Diagonals (Top-Right to Bottom-Left)
  for (let colStart = winLength - 1; colStart < size; colStart++) {
    const revCoords: Coordinate[] = [];
    for (let k = 0; k <= colStart; k++) {
      revCoords.push({ row: k, col: colStart - k });
    }
    const res = checkLine(revCoords);
    if (res) return res;
  }

  for (let rowStart = 1; rowStart <= size - winLength; rowStart++) {
    const revCoords: Coordinate[] = [];
    for (let k = 0; k < size - rowStart; k++) {
      revCoords.push({ row: rowStart + k, col: size - 1 - k });
    }
    const res = checkLine(revCoords);
    if (res) return res;
  }

  return { winner: null, winningCells: [] };
}

export function checkDraw(board: number[][], winResult: WinResult): boolean {
  if (winResult.winner !== null) return false;
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === 0) return false;
    }
  }
  return true;
}
