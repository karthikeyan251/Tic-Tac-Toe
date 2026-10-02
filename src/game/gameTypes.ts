export type Coordinate = {
  row: number;
  col: number;
};

export type BoardConfig = {
  size: number;
  allowedPlayers: number[];
  winLength: number;
};

export type Player = {
  id: number; // 1, 2, 3, 4
  symbol: string;
  name: string;
  color: string;
  wins: number;
  losses: number;
  draws: number;
};

export type GameMode = 'pvp' | 'pvai';

export type AIDifficulty = 'easy' | 'medium' | 'master';

export type GameStatus = 'setup' | 'playing' | 'won' | 'draw';

export type TimerMode = 'unlimited' | 5 | 10 | 15;

export type TimeoutBehavior = 'auto-move' | 'forfeit';

export type WinResult = {
  winner: number | null; // 1, 2, 3, 4 or null if no winner
  winningCells: Coordinate[];
};

export type Move = {
  moveNumber: number;
  player: Player;
  coord: Coordinate;
  timestamp: number;
};

export type TacticalCategory = 'WIN NOW' | 'BLOCK' | 'FORK' | 'ATTACK' | 'DEFEND' | 'POSITION';

export type TacticalRecommendation = {
  coord: Coordinate | null;
  category: TacticalCategory;
  message: string;
};

export type GameStats = {
  gamesPlayed: number;
  playerStats: Record<number, { wins: number; losses: number; draws: number }>;
};

export type UserPreferences = {
  soundEnabled: boolean;
  coachEnabled: boolean;
  reducedMotion: boolean;
  timerMode: TimerMode;
  timeoutBehavior: TimeoutBehavior;
  customPlayerNames: Record<number, string>;
};
