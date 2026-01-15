/**
 * Session Related Types
 *
 * Defines types for session state, game types, and session statistics
 * Used in both Main and Sub Dashboard components
 */

/**
 * Session game type
 */
export type GameType = 'cash' | 'tournament';

/**
 * Session status
 */
export type SessionStatus = 'live' | 'paused' | 'ended';

/**
 * Core session data structure
 */
export interface Session {
  /** Unique session identifier */
  sessionId: string;

  /** Type of poker game */
  gameType: GameType;

  /** Current session status */
  status: SessionStatus;

  /** Session start timestamp */
  startTime: Date;

  /** Session end timestamp (if ended) */
  endTime?: Date;

  /** WSOP+ event ID (for tournament sessions) */
  eventId?: string;

  /** Current hand number */
  currentHandNum: number;

  /** Total number of hands played */
  totalHands: number;

  /** Current blind level (e.g., "50/100") */
  blindLevel?: string;
}

/**
 * Session statistics
 */
export interface SessionStats {
  /** Total number of hands */
  totalHands: number;

  /** Number of active players */
  activePlayers: number;

  /** Current pot size */
  currentPot: number;

  /** Total chips in play */
  totalChips: number;

  /** Average pot size */
  averagePot: number;

  /** Session duration in seconds */
  duration: number;

  /** Number of eliminations (tournament only) */
  eliminations?: number;
}

/**
 * Session state (Zustand store)
 */
export interface SessionState {
  /** Current session ID */
  sessionId: string | null;

  /** Game type */
  gameType: GameType;

  /** Session status */
  status: SessionStatus;

  /** Current hand ID */
  currentHandId: string | null;

  /** Current hand number */
  handNum: number;

  /** Session start time */
  startTime: Date | null;

  // Actions
  setSession: (sessionId: string) => void;
  updateStatus: (status: SessionStatus) => void;
  setCurrentHand: (handId: string, handNum: number) => void;
  clearSession: () => void;
}
