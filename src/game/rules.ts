import { BOARD_CONFIG } from '../utils/constants';
import type { BoardConfig } from './gameTypes';

export { BOARD_CONFIG };

export function getBoardConfig(size: number): BoardConfig {
  return BOARD_CONFIG[size] || BOARD_CONFIG[3];
}

export function sanitizePlayerCount(size: number, requestedPlayers: number): number {
  const config = getBoardConfig(size);
  if (config.allowedPlayers.includes(requestedPlayers)) {
    return requestedPlayers;
  }
  return config.allowedPlayers[0];
}
