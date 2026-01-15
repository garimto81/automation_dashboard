/**
 * Realtime Types
 *
 * Defines types for Supabase Realtime events and connection status
 * Used for real-time data synchronization
 */

/**
 * Realtime connection status
 */
export type ConnectionStatus =
  | 'connected'
  | 'disconnected'
  | 'reconnecting'
  | 'error';

/**
 * Realtime event type
 */
export type RealtimeEventType =
  | 'INSERT'
  | 'UPDATE'
  | 'DELETE';

/**
 * Realtime table type
 */
export type RealtimeTable =
  | 'json.hands'
  | 'json.hand_players'
  | 'json.hand_actions'
  | 'ae.render_jobs'
  | 'manual.players_master'
  | 'wsop_plus.wsop_players'
  | 'wsop_plus.wsop_standings';

/**
 * Realtime channel configuration
 */
export interface RealtimeChannelConfig {
  /** Channel name */
  name: string;

  /** Table to subscribe to */
  table: RealtimeTable;

  /** Event types to listen for */
  events: RealtimeEventType[];

  /** Filter condition (e.g., "session_id=eq.{sessionId}") */
  filter?: string;
}

/**
 * Realtime payload (generic)
 */
export interface RealtimePayload<T = Record<string, unknown>> {
  /** Event type */
  eventType: RealtimeEventType;

  /** Table name */
  table: RealtimeTable;

  /** Schema name */
  schema: string;

  /** Old record (for UPDATE/DELETE) */
  old?: T;

  /** New record (for INSERT/UPDATE) */
  new?: T;

  /** Commit timestamp */
  commit_timestamp: string;
}

/**
 * Realtime event
 */
export interface RealtimeEvent<T = Record<string, unknown>> {
  /** Event ID */
  eventId: string;

  /** Event type */
  type: RealtimeEventType;

  /** Table */
  table: RealtimeTable;

  /** Payload */
  payload: RealtimePayload<T>;

  /** Timestamp */
  timestamp: Date;

  /** Whether event has been read */
  isRead: boolean;

  /** Event category (for UI grouping) */
  category: 'hand' | 'player' | 'render' | 'other';

  /** Event description */
  description: string;
}

/**
 * Realtime state (Zustand store)
 */
export interface RealtimeState {
  /** All events */
  events: RealtimeEvent[];

  /** Unread event count */
  unreadCount: number;

  /** Connection status */
  connectionStatus: ConnectionStatus;

  /** Last event timestamp */
  lastEventAt: Date | null;

  /** Active channels */
  activeChannels: string[];

  // Actions
  addEvent: (event: RealtimeEvent) => void;
  clearEvents: () => void;
  markAllAsRead: () => void;
  markAsRead: (eventId: string) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  subscribeChannel: (channel: RealtimeChannelConfig) => void;
  unsubscribeChannel: (channelName: string) => void;

  // Selectors
  getUnreadEvents: () => RealtimeEvent[];
  getEventsByCategory: (category: RealtimeEvent['category']) => RealtimeEvent[];
}

/**
 * Supabase Realtime channel names
 */
export const REALTIME_CHANNELS = {
  HANDS: 'hands_channel',
  HAND_PLAYERS: 'hand_players_channel',
  HAND_ACTIONS: 'hand_actions_channel',
  RENDER_JOBS: 'render_jobs_channel',
  UNIFIED_PLAYERS: 'unified_players_notify'
} as const;

/**
 * Helper type for channel names
 */
export type RealtimeChannelName = typeof REALTIME_CHANNELS[keyof typeof REALTIME_CHANNELS];
