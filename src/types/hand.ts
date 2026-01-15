/**
 * Hand and Player Types
 *
 * Defines types for poker hands, players, actions, and chip data
 * Supports 9-player tables with full action history
 */

/**
 * Player position (1-9 for 9-max table)
 */
export type PlayerPosition = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Action type
 */
export type ActionType =
  | 'fold'
  | 'check'
  | 'call'
  | 'bet'
  | 'raise'
  | 'all_in'
  | 'post_sb'
  | 'post_bb'
  | 'post_ante';

/**
 * Board cards (up to 5 cards)
 */
export interface BoardCards {
  /** Flop cards (3 cards) */
  flop?: [string, string, string];

  /** Turn card */
  turn?: string;

  /** River card */
  river?: string;
}

/**
 * Chip data for a player
 */
export interface ChipData {
  /** Player position */
  position: PlayerPosition;

  /** Player name */
  playerName: string;

  /** Starting chip stack */
  startStack: number;

  /** Ending chip stack */
  endStack: number;

  /** Stack in big blinds */
  bbs: number;

  /** Chip change (+/-) */
  change: number;

  /** Win/loss percentage */
  changePercent: number;

  /** Current rank */
  rank?: number;

  /** Player avatar URL */
  avatarUrl?: string;

  /** Player country code */
  countryCode?: string;
}

/**
 * Hand action
 */
export interface HandAction {
  /** Action ID */
  actionId: string;

  /** Player position who made the action */
  position: PlayerPosition;

  /** Action type */
  action: ActionType;

  /** Amount (for bet/raise/call) */
  amount?: number;

  /** Action sequence number */
  sequence: number;

  /** Street (preflop/flop/turn/river) */
  street: 'preflop' | 'flop' | 'turn' | 'river';

  /** Timestamp */
  timestamp: Date;
}

/**
 * Player in a hand
 */
export interface HandPlayer {
  /** Player position */
  position: PlayerPosition;

  /** Player name */
  playerName: string;

  /** Starting stack */
  startStack: number;

  /** Ending stack */
  endStack: number;

  /** Stack in big blinds */
  bbs: number;

  /** Hole cards (if shown) */
  holeCards?: [string, string];

  /** Whether player won the hand */
  isWinner: boolean;

  /** Winnings amount */
  winnings?: number;

  /** Player avatar URL */
  avatarUrl?: string;

  /** Player country code */
  countryCode?: string;

  /** Seat status */
  status: 'active' | 'folded' | 'all_in' | 'sitting_out';
}

/**
 * Poker hand
 */
export interface Hand {
  /** Hand ID */
  handId: string;

  /** Session ID */
  sessionId: string;

  /** Hand number */
  handNum: number;

  /** Game type */
  gameType: 'cash' | 'tournament';

  /** Small blind amount */
  smallBlind: number;

  /** Big blind amount */
  bigBlind: number;

  /** Ante amount (if any) */
  ante?: number;

  /** Total pot */
  pot: number;

  /** Board cards */
  boardCards: BoardCards;

  /** Players in the hand */
  players: HandPlayer[];

  /** Hand actions */
  actions: HandAction[];

  /** Hand start timestamp */
  startTime: Date;

  /** Hand end timestamp */
  endTime?: Date;

  /** Hand status */
  status: 'active' | 'completed';

  /** Button position */
  buttonPosition: PlayerPosition;
}
