import type { BoardConfig, Player } from '../game/gameTypes';

export const DEFAULT_PLAYERS: Player[] = [
  {
    id: 1,
    symbol: 'X',
    name: 'Player 1',
    color: '#00eaff', // Cyan neon
    wins: 0,
    losses: 0,
    draws: 0,
  },
  {
    id: 2,
    symbol: 'O',
    name: 'Player 2',
    color: '#ff2bd6', // Magenta neon
    wins: 0,
    losses: 0,
    draws: 0,
  },
  {
    id: 3,
    symbol: '△',
    name: 'Player 3',
    color: '#ffb020', // Amber neon
    wins: 0,
    losses: 0,
    draws: 0,
  },
  {
    id: 4,
    symbol: '▢',
    name: 'Player 4',
    color: '#19f59a', // Emerald neon
    wins: 0,
    losses: 0,
    draws: 0,
  },
];

export const BOARD_CONFIG: Record<number, BoardConfig> = {
  3: {
    size: 3,
    allowedPlayers: [2],
    winLength: 3,
  },
  4: {
    size: 4,
    allowedPlayers: [2, 3],
    winLength: 4,
  },
  5: {
    size: 5,
    allowedPlayers: [2, 3, 4],
    winLength: 5,
  },
  6: {
    size: 6,
    allowedPlayers: [2, 3, 4],
    winLength: 6,
  },
};

export const BOARD_CONFIGS = BOARD_CONFIG;

export const STORAGE_KEYS = {
  PREFERENCES: 'tictactoe.preferences.v1',
  STATS: 'tictactoe.stats.v1',
  PLAYERS: 'tictactoe.players.v1',
} as const;
