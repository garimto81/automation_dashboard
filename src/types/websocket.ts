/**
 * WebSocket Types
 *
 * Defines types for WebSocket communication between Main and Sub Dashboard
 * Protocol: Main <-> Sub bidirectional messaging
 */

import type { FieldMapping } from './composition';
import type { HandPlayer } from './hand';
import type { RenderJobStatus, RenderErrorCode, RenderOutput } from './render';

/**
 * WebSocket connection status
 */
export type WebSocketConnectionStatus =
  | 'connected'
  | 'disconnected'
  | 'reconnecting';

/**
 * Main Dashboard status
 */
export type MainDashboardStatus = 'connected' | 'busy';

/**
 * Sub Dashboard status
 */
export type SubDashboardStatus = 'ready' | 'busy' | 'rendering';

/**
 * WebSocket configuration
 */
export interface WebSocketConfig {
  /** WebSocket URL */
  url: string;

  /** Reconnect interval in milliseconds */
  reconnectInterval: number;

  /** Maximum reconnect attempts */
  maxReconnectAttempts: number;

  /** Heartbeat interval in milliseconds */
  heartbeatInterval: number;
}

/**
 * Default WebSocket configuration
 */
export const DEFAULT_WS_CONFIG: WebSocketConfig = {
  url: 'ws://localhost:3001/ws/dashboard',
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 30000
};

// ============================================================================
// Main -> Sub Messages
// ============================================================================

/**
 * Cue item selected message
 */
export interface CueItemSelectedMessage {
  type: 'cue_item_selected';
  payload: {
    cueItemId: string;
    handId: string;
    compositionName: string;
    handData: {
      handNum: number;
      sessionId: string;
      players: HandPlayer[];
      boardCards: string[];
      pot: number;
      blindLevel: string;
    };
    suggestedMappings?: FieldMapping[];
  };
  timestamp: string;
}

/**
 * Cue item cancelled message
 */
export interface CueItemCancelledMessage {
  type: 'cue_item_cancelled';
  payload: {
    cueItemId: string;
  };
  timestamp: string;
}

/**
 * Hand updated message
 */
export interface HandUpdatedMessage {
  type: 'hand_updated';
  payload: {
    handId: string;
    sessionId: string;
    handNum: number;
    changedFields: string[];
    players: HandPlayer[];
  };
  timestamp: string;
}

/**
 * Session changed message
 */
export interface SessionChangedMessage {
  type: 'session_changed';
  payload: {
    sessionId: string;
    gameType: 'cash' | 'tournament';
    eventId?: string;
  };
  timestamp: string;
}

/**
 * Render request message
 */
export interface RenderRequestMessage {
  type: 'render_request';
  payload: {
    requestId: string;
    compositionName: string;
    handId: string;
    priority: number;
    gfxData: Record<string, unknown>;
  };
  timestamp: string;
}

/**
 * Heartbeat message from Main
 */
export interface HeartbeatMessage {
  type: 'heartbeat';
  payload: {
    mainStatus: MainDashboardStatus;
    activeSession?: string;
  };
  timestamp: string;
}

/**
 * Union type for all Main -> Sub messages
 */
export type MainToSubMessage =
  | CueItemSelectedMessage
  | CueItemCancelledMessage
  | HandUpdatedMessage
  | SessionChangedMessage
  | RenderRequestMessage
  | HeartbeatMessage;

// ============================================================================
// Sub -> Main Messages
// ============================================================================

/**
 * Render status update message
 */
export interface RenderStatusUpdateMessage {
  type: 'render_status_update';
  payload: {
    jobId: string;
    requestId?: string;
    status: RenderJobStatus;
    progress: number;
    estimatedRemaining?: number;
  };
  timestamp: string;
}

/**
 * Render complete message
 */
export interface RenderCompleteMessage {
  type: 'render_complete';
  payload: {
    jobId: string;
    requestId?: string;
    output: RenderOutput;
  };
  timestamp: string;
}

/**
 * Render error message
 */
export interface RenderErrorMessage {
  type: 'render_error';
  payload: {
    jobId: string;
    requestId?: string;
    errorCode: RenderErrorCode;
    errorMessage: string;
    retryable: boolean;
  };
  timestamp: string;
}

/**
 * Mapping changed message
 */
export interface MappingChangedMessage {
  type: 'mapping_changed';
  payload: {
    compositionName: string;
    mappingId: string;
    changedFields: string[];
  };
  timestamp: string;
}

/**
 * Composition selected message
 */
export interface CompositionSelectedMessage {
  type: 'composition_selected';
  payload: {
    compositionName: string;
    category: string;
    fieldCount: number;
  };
  timestamp: string;
}

/**
 * Heartbeat acknowledgement message from Sub
 */
export interface HeartbeatAckMessage {
  type: 'heartbeat_ack';
  payload: {
    subStatus: SubDashboardStatus;
    queueLength: number;
    activeJobs: number;
  };
  timestamp: string;
}

/**
 * Union type for all Sub -> Main messages
 */
export type SubToMainMessage =
  | RenderStatusUpdateMessage
  | RenderCompleteMessage
  | RenderErrorMessage
  | MappingChangedMessage
  | CompositionSelectedMessage
  | HeartbeatAckMessage;

// ============================================================================
// WebSocket State
// ============================================================================

/**
 * WebSocket state (Zustand store)
 */
export interface WebSocketState {
  /** Connection status */
  isConnected: boolean;

  /** Main Dashboard URL */
  mainDashboardUrl: string;

  /** Last received message */
  lastMessage: MainToSubMessage | null;

  /** Message history */
  messageHistory: MainToSubMessage[];

  /** Reconnect attempts */
  reconnectAttempts: number;

  // Actions
  connect: () => void;
  disconnect: () => void;
  sendToMain: (message: SubToMainMessage) => void;
  handleMessage: (message: MainToSubMessage) => void;
  clearHistory: () => void;
}
