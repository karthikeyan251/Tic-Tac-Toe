import { STORAGE_KEYS } from '../utils/constants';
import type { GameStats, UserPreferences } from '../game/gameTypes';

const DEFAULT_PREFERENCES: UserPreferences = {
  soundEnabled: true,
  coachEnabled: true,
  reducedMotion: false,
  timerMode: 'unlimited',
  timeoutBehavior: 'auto-move',
  customPlayerNames: {
    1: 'Player 1',
    2: 'Player 2',
    3: 'Player 3',
    4: 'Player 4',
  },
};

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  playerStats: {
    1: { wins: 0, losses: 0, draws: 0 },
    2: { wins: 0, losses: 0, draws: 0 },
    3: { wins: 0, losses: 0, draws: 0 },
    4: { wins: 0, losses: 0, draws: 0 },
  },
};

export const storageService = {
  loadPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (!data) return DEFAULT_PREFERENCES;
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(data) };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  savePreferences(prefs: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Failed to save preferences to localStorage', e);
    }
  },

  loadStats(): GameStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      if (!data) return DEFAULT_STATS;
      return { ...DEFAULT_STATS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_STATS;
    }
  },

  saveStats(stats: GameStats): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed to save stats to localStorage', e);
    }
  },
};
