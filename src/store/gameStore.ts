import { create } from 'zustand';
import { EasyAI } from '../ai/easyAI';
import { MediumAI } from '../ai/mediumAI';
import { MasterAI } from '../ai/masterAI';
import { evaluateTacticalMove } from '../ai/tacticalCoach';
import { createBoard, cloneBoard } from '../game/board';
import type {
  AIDifficulty,
  BoardConfig,
  Coordinate,
  GameMode,
  GameStats,
  GameStatus,
  Move,
  Player,
  TacticalRecommendation,
  TimerMode,
  TimeoutBehavior,
  UserPreferences,
} from '../game/gameTypes';
import { sanitizePlayerCount, getBoardConfig } from '../game/rules';
import { checkWinner, checkDraw } from '../game/winDetection';
import { audioService } from '../services/audioService';
import { storageService } from '../services/storageService';
import { DEFAULT_PLAYERS } from '../utils/constants';

interface GameSnapshot {
  board: number[][];
  currentPlayerIndex: number;
  moveHistory: Move[];
}

interface GameStore {
  // State
  board: number[][];
  boardSize: number;
  winLength: number;
  players: Player[];
  currentPlayerIndex: number;
  mode: GameMode;
  difficulty: AIDifficulty;
  gameStatus: GameStatus;
  winner: Player | null;
  winningCells: Coordinate[];

  moveHistory: Move[];
  undoStack: GameSnapshot[];
  redoStack: GameSnapshot[];

  suggestedMove: Coordinate | null;
  tacticalRecommendation: TacticalRecommendation | null;

  timerMode: TimerMode;
  remainingTime: number;
  timeoutBehavior: TimeoutBehavior;

  coachEnabled: boolean;
  soundEnabled: boolean;

  gameStartTime: number;
  gameDurationSeconds: number;

  stats: GameStats;
  preferences: UserPreferences;

  // Actions
  initStore: () => void;
  setupGame: (config: {
    boardSize: number;
    playersCount: number;
    mode: GameMode;
    difficulty: AIDifficulty;
    timerMode: TimerMode;
    coachEnabled: boolean;
    soundEnabled: boolean;
    playerNames?: Record<number, string>;
  }) => void;

  makeMove: (coord: Coordinate) => boolean;
  handleTimeout: () => void;
  undo: () => void;
  redo: () => void;

  // Separate modular reset functions (Requirement 11)
  startNewGame: (config?: {
    boardSize: number;
    playersCount: number;
    mode: GameMode;
    difficulty: AIDifficulty;
    timerMode: TimerMode;
    coachEnabled: boolean;
    soundEnabled: boolean;
    playerNames?: Record<number, string>;
  }) => void;
  playAgain: () => void;
  goToMainMenu: () => void;
  resetBoard: () => void;
  resetMoveHistory: () => void;
  resetTimer: () => void;
  resetTacticalCoach: () => void;
  resetStats: () => void;

  toggleCoach: () => void;
  toggleSound: () => void;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  updateTimer: () => void;
  executeAIMove: () => void;
  updateTacticalCoach: () => void;
}

const easyEngine = new EasyAI();
const mediumEngine = new MediumAI();
const masterEngine = new MasterAI();

export const useGameStore = create<GameStore>((set, get) => ({
  board: createBoard(3),
  boardSize: 3,
  winLength: 3,
  players: DEFAULT_PLAYERS.slice(0, 2),
  currentPlayerIndex: 0,
  mode: 'pvp',
  difficulty: 'medium',
  gameStatus: 'setup',
  winner: null,
  winningCells: [],

  moveHistory: [],
  undoStack: [],
  redoStack: [],

  suggestedMove: null,
  tacticalRecommendation: null,

  timerMode: 'unlimited',
  remainingTime: 0,
  timeoutBehavior: 'auto-move',

  coachEnabled: true,
  soundEnabled: true,

  gameStartTime: 0,
  gameDurationSeconds: 0,

  stats: storageService.loadStats(),
  preferences: storageService.loadPreferences(),

  initStore: () => {
    const prefs = storageService.loadPreferences();
    const stats = storageService.loadStats();

    audioService.setSoundEnabled(prefs.soundEnabled);

    set({
      preferences: prefs,
      stats: stats,
      soundEnabled: prefs.soundEnabled,
      coachEnabled: prefs.coachEnabled,
      timerMode: prefs.timerMode,
      timeoutBehavior: prefs.timeoutBehavior,
    });
  },

  setupGame: ({ boardSize, playersCount, mode, difficulty, timerMode, coachEnabled, soundEnabled, playerNames }) => {
    const validCount = sanitizePlayerCount(boardSize, playersCount);
    const bConfig = getBoardConfig(boardSize);

    const updatedPlayers = DEFAULT_PLAYERS.slice(0, validCount).map((p) => {
      const customName = playerNames?.[p.id] || get().preferences.customPlayerNames?.[p.id] || p.name;
      const pStats = get().stats.playerStats[p.id] || { wins: 0, losses: 0, draws: 0 };
      return {
        ...p,
        name: customName,
        wins: pStats.wins,
        losses: pStats.losses,
        draws: pStats.draws,
      };
    });

    const newBoard = createBoard(boardSize);
    const timerVal = typeof timerMode === 'number' ? timerMode : 0;

    audioService.setSoundEnabled(soundEnabled);

    const initialSnapshot: GameSnapshot = {
      board: newBoard,
      currentPlayerIndex: 0,
      moveHistory: [],
    };

    set({
      board: newBoard,
      boardSize: boardSize,
      winLength: bConfig.winLength, // Always equals boardSize!
      players: updatedPlayers,
      currentPlayerIndex: 0,
      mode: mode,
      difficulty: difficulty,
      gameStatus: 'playing',
      winner: null,
      winningCells: [],
      moveHistory: [],
      undoStack: [initialSnapshot],
      redoStack: [],
      timerMode: timerMode,
      remainingTime: timerVal,
      coachEnabled: coachEnabled,
      soundEnabled: soundEnabled,
      gameStartTime: Date.now(),
      gameDurationSeconds: 0,
    });

    get().updateTacticalCoach();
  },

  makeMove: (coord: Coordinate) => {
    const state = get();
    if (state.gameStatus !== 'playing') {
      audioService.playInvalidMove();
      return false;
    }

    const { board, currentPlayerIndex, players, winLength, moveHistory, undoStack, gameStartTime } = state;

    if (board[coord.row][coord.col] !== 0) {
      audioService.playInvalidMove();
      return false;
    }

    const currentPlayer = players[currentPlayerIndex];
    const newBoard = cloneBoard(board);
    newBoard[coord.row][coord.col] = currentPlayer.id;

    audioService.playValidMove();

    const newMove: Move = {
      moveNumber: moveHistory.length + 1,
      player: currentPlayer,
      coord: coord,
      timestamp: Date.now(),
    };

    const nextHistory = [...moveHistory, newMove];

    // Check Win/Draw using winLength (equals boardSize)
    const winResult = checkWinner(newBoard, winLength);
    const isDraw = checkDraw(newBoard, winResult);

    let nextStatus: GameStatus = 'playing';
    let winningPlayer: Player | null = null;
    let durationSec = 0;

    if (winResult.winner !== null) {
      nextStatus = 'won';
      winningPlayer = players.find((p) => p.id === winResult.winner) || currentPlayer;
      durationSec = Math.max(1, Math.round((Date.now() - gameStartTime) / 1000));
      audioService.playVictory();
    } else if (isDraw) {
      nextStatus = 'draw';
      durationSec = Math.max(1, Math.round((Date.now() - gameStartTime) / 1000));
      audioService.playDraw();
    }

    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;

    const newSnapshot: GameSnapshot = {
      board: newBoard,
      currentPlayerIndex: nextPlayerIndex,
      moveHistory: nextHistory,
    };

    const updatedUndoStack = [...undoStack, newSnapshot];
    const timerVal = typeof state.timerMode === 'number' ? state.timerMode : 0;

    set({
      board: newBoard,
      currentPlayerIndex: nextPlayerIndex,
      moveHistory: nextHistory,
      undoStack: updatedUndoStack,
      redoStack: [],
      gameStatus: nextStatus,
      winner: winningPlayer,
      winningCells: winResult.winningCells,
      remainingTime: timerVal,
      gameDurationSeconds: durationSec > 0 ? durationSec : state.gameDurationSeconds,
    });

    // Persistent statistics update (Requirement 12)
    if (nextStatus === 'won' && winningPlayer) {
      const stats = get().stats;
      const updatedPlayerStats = { ...stats.playerStats };

      players.forEach((p) => {
        if (!updatedPlayerStats[p.id]) {
          updatedPlayerStats[p.id] = { wins: 0, losses: 0, draws: 0 };
        }
        if (p.id === winningPlayer!.id) {
          updatedPlayerStats[p.id].wins += 1;
        } else {
          updatedPlayerStats[p.id].losses += 1;
        }
      });

      const newStats: GameStats = {
        gamesPlayed: stats.gamesPlayed + 1,
        playerStats: updatedPlayerStats,
      };

      storageService.saveStats(newStats);
      set({ stats: newStats });
    } else if (nextStatus === 'draw') {
      const stats = get().stats;
      const updatedPlayerStats = { ...stats.playerStats };

      players.forEach((p) => {
        if (!updatedPlayerStats[p.id]) {
          updatedPlayerStats[p.id] = { wins: 0, losses: 0, draws: 0 };
        }
        updatedPlayerStats[p.id].draws += 1;
      });

      const newStats: GameStats = {
        gamesPlayed: stats.gamesPlayed + 1,
        playerStats: updatedPlayerStats,
      };

      storageService.saveStats(newStats);
      set({ stats: newStats });
    }

    get().updateTacticalCoach();

    if (nextStatus === 'playing' && state.mode === 'pvai' && nextPlayerIndex === 1) {
      setTimeout(() => {
        get().executeAIMove();
      }, 350);
    }

    return true;
  },

  executeAIMove: () => {
    const state = get();
    if (state.gameStatus !== 'playing' || state.mode !== 'pvai' || state.currentPlayerIndex !== 1) {
      return;
    }

    const { board, difficulty, boardSize, winLength, players } = state;
    const bConfig: BoardConfig = { size: boardSize, allowedPlayers: [players.length], winLength };
    const aiPlayerVal = players[1].id;

    let bestMove: Coordinate;

    if (difficulty === 'easy') {
      bestMove = easyEngine.getBestMove(board, aiPlayerVal, bConfig, players.length);
    } else if (difficulty === 'medium') {
      bestMove = mediumEngine.getBestMove(board, aiPlayerVal, bConfig, players.length);
    } else {
      bestMove = masterEngine.getBestMove(board, aiPlayerVal, bConfig, players.length);
    }

    get().makeMove(bestMove);
  },

  handleTimeout: () => {
    const state = get();
    if (state.gameStatus !== 'playing' || state.timerMode === 'unlimited') return;

    audioService.playTimerWarning();

    if (state.mode === 'pvai' || state.timeoutBehavior === 'auto-move') {
      const available = get().board.flatMap((row, r) => row.map((val, c) => (val === 0 ? { row: r, col: c } : null)).filter(Boolean)) as Coordinate[];
      if (available.length > 0) {
        const move = state.suggestedMove || available[0];
        get().makeMove(move);
      }
    } else {
      const nextIdx = (state.currentPlayerIndex + 1) % state.players.length;
      const timerVal = typeof state.timerMode === 'number' ? state.timerMode : 0;
      set({
        currentPlayerIndex: nextIdx,
        remainingTime: timerVal,
      });
      get().updateTacticalCoach();
    }
  },

  undo: () => {
    const state = get();
    const { undoStack, redoStack, mode } = state;

    if (undoStack.length <= 1) return;

    const currentSnapshot = undoStack[undoStack.length - 1];
    let stepsToUndo = 1;

    if (mode === 'pvai' && undoStack.length >= 3 && currentSnapshot.currentPlayerIndex === 0) {
      stepsToUndo = 2;
    }

    const targetIndex = undoStack.length - 1 - stepsToUndo;
    if (targetIndex < 0) return;

    const previousSnapshot = undoStack[targetIndex];
    const newUndoStack = undoStack.slice(0, targetIndex + 1);
    const poppedSnapshots = undoStack.slice(targetIndex + 1);
    const timerVal = typeof state.timerMode === 'number' ? state.timerMode : 0;

    set({
      board: previousSnapshot.board,
      currentPlayerIndex: previousSnapshot.currentPlayerIndex,
      moveHistory: previousSnapshot.moveHistory,
      undoStack: newUndoStack,
      redoStack: [...poppedSnapshots, ...redoStack],
      gameStatus: 'playing',
      winner: null,
      winningCells: [],
      remainingTime: timerVal,
    });

    audioService.playButtonClick();
    get().updateTacticalCoach();
  },

  redo: () => {
    const state = get();
    const { undoStack, redoStack, mode } = state;

    if (redoStack.length === 0) return;

    let stepsToRedo = 1;
    if (mode === 'pvai' && redoStack.length >= 2) {
      stepsToRedo = 2;
    }

    const snapshotsToRestore = redoStack.slice(0, stepsToRedo);
    const targetSnapshot = snapshotsToRestore[snapshotsToRestore.length - 1];
    const newRedoStack = redoStack.slice(stepsToRedo);
    const timerVal = typeof state.timerMode === 'number' ? state.timerMode : 0;

    set({
      board: targetSnapshot.board,
      currentPlayerIndex: targetSnapshot.currentPlayerIndex,
      moveHistory: targetSnapshot.moveHistory,
      undoStack: [...undoStack, ...snapshotsToRestore],
      redoStack: newRedoStack,
      remainingTime: timerVal,
    });

    audioService.playButtonClick();
    get().updateTacticalCoach();
  },

  // Separate modular reset functions (Requirement 11)
  startNewGame: (config) => {
    if (config) {
      get().setupGame(config);
    } else {
      get().playAgain();
    }
  },

  playAgain: () => {
    const state = get();
    const freshBoard = createBoard(state.boardSize);
    const initialSnapshot: GameSnapshot = {
      board: freshBoard,
      currentPlayerIndex: 0,
      moveHistory: [],
    };
    const timerVal = typeof state.timerMode === 'number' ? state.timerMode : 0;

    set({
      board: freshBoard,
      currentPlayerIndex: 0,
      gameStatus: 'playing',
      winner: null,
      winningCells: [],
      moveHistory: [],
      undoStack: [initialSnapshot],
      redoStack: [],
      remainingTime: timerVal,
      gameStartTime: Date.now(),
      gameDurationSeconds: 0,
    });

    get().resetTacticalCoach();
    audioService.playButtonClick();
  },

  goToMainMenu: () => {
    set({
      gameStatus: 'setup',
      winner: null,
      winningCells: [],
      moveHistory: [],
      undoStack: [],
      redoStack: [],
      suggestedMove: null,
      tacticalRecommendation: null,
    });
    audioService.playButtonClick();
  },

  resetBoard: () => {
    const size = get().boardSize;
    const freshBoard = createBoard(size);
    set({ board: freshBoard });
  },

  resetMoveHistory: () => {
    const freshBoard = createBoard(get().boardSize);
    set({
      moveHistory: [],
      undoStack: [{ board: freshBoard, currentPlayerIndex: 0, moveHistory: [] }],
      redoStack: [],
    });
  },

  resetTimer: () => {
    const state = get();
    const timerVal = typeof state.timerMode === 'number' ? state.timerMode : 0;
    set({ remainingTime: timerVal });
  },

  resetTacticalCoach: () => {
    get().updateTacticalCoach();
  },

  resetStats: () => {
    const emptyStats: GameStats = {
      gamesPlayed: 0,
      playerStats: {
        1: { wins: 0, losses: 0, draws: 0 },
        2: { wins: 0, losses: 0, draws: 0 },
        3: { wins: 0, losses: 0, draws: 0 },
        4: { wins: 0, losses: 0, draws: 0 },
      },
    };
    storageService.saveStats(emptyStats);
    set({ stats: emptyStats });
    audioService.playButtonClick();
  },

  toggleCoach: () => {
    const newVal = !get().coachEnabled;
    set({ coachEnabled: newVal });
    const prefs = { ...get().preferences, coachEnabled: newVal };
    storageService.savePreferences(prefs);
    set({ preferences: prefs });
    if (newVal) audioService.playTacticalHint();
    get().updateTacticalCoach();
  },

  toggleSound: () => {
    const newVal = !get().soundEnabled;
    audioService.setSoundEnabled(newVal);
    set({ soundEnabled: newVal });
    const prefs = { ...get().preferences, soundEnabled: newVal };
    storageService.savePreferences(prefs);
    set({ preferences: prefs });
  },

  updatePreferences: (newPrefs) => {
    const merged = { ...get().preferences, ...newPrefs };
    storageService.savePreferences(merged);
    set({
      preferences: merged,
      soundEnabled: merged.soundEnabled,
      coachEnabled: merged.coachEnabled,
      timerMode: merged.timerMode,
      timeoutBehavior: merged.timeoutBehavior,
    });
    audioService.setSoundEnabled(merged.soundEnabled);
  },

  updateTimer: () => {
    const state = get();
    if (state.gameStatus !== 'playing' || state.timerMode === 'unlimited') return;

    if (state.remainingTime <= 1) {
      get().handleTimeout();
    } else {
      if (state.remainingTime <= 4) {
        audioService.playTimerWarning();
      }
      set({ remainingTime: state.remainingTime - 1 });
    }
  },

  updateTacticalCoach: () => {
    const state = get();
    if (state.gameStatus !== 'playing' || !state.coachEnabled) {
      set({ suggestedMove: null, tacticalRecommendation: null });
      return;
    }

    const activePlayer = state.players[state.currentPlayerIndex];
    const bConfig: BoardConfig = { size: state.boardSize, allowedPlayers: [state.players.length], winLength: state.winLength };

    const rec = evaluateTacticalMove(state.board, activePlayer, bConfig, state.players.length);

    set({
      suggestedMove: rec.coord,
      tacticalRecommendation: rec,
    });
  },
}));
