/**
 * Type Definitions Index
 *
 * Central export point for all GFX Dashboard type definitions
 * Total: 8 type modules
 */

// Session types
export type {
  GameType,
  SessionStatus,
  Session,
  SessionStats,
  SessionState
} from './session';

// Hand types
export type {
  PlayerPosition,
  ActionType,
  BoardCards,
  ChipData,
  HandAction,
  HandPlayer,
  Hand
} from './hand';

// Cuesheet types
export type {
  CueItemStatus,
  CueItemType,
  CueItem,
  Cuesheet,
  CuesheetState
} from './cuesheet';

// Composition types
export type {
  CompositionCategory,
  TransformType,
  DataSourceType,
  FieldMapping,
  SlotMapping,
  Composition,
  CompositionMapping,
  CompositionState
} from './composition';

// Render types
export type {
  RenderJobStatus,
  RenderErrorCode,
  RenderOutput,
  RenderError,
  RenderJob,
  RenderQueueState
} from './render';

// WebSocket types
export type {
  WebSocketConnectionStatus,
  MainDashboardStatus,
  SubDashboardStatus,
  WebSocketConfig,
  CueItemSelectedMessage,
  CueItemCancelledMessage,
  HandUpdatedMessage,
  SessionChangedMessage,
  RenderRequestMessage,
  HeartbeatMessage,
  MainToSubMessage,
  RenderStatusUpdateMessage,
  RenderCompleteMessage,
  RenderErrorMessage,
  MappingChangedMessage,
  CompositionSelectedMessage,
  HeartbeatAckMessage,
  SubToMainMessage,
  WebSocketState
} from './websocket';

export { DEFAULT_WS_CONFIG } from './websocket';

// Realtime types
export type {
  ConnectionStatus,
  RealtimeEventType,
  RealtimeTable,
  RealtimeChannelConfig,
  RealtimePayload,
  RealtimeEvent,
  RealtimeState,
  RealtimeChannelName
} from './realtime';

export { REALTIME_CHANNELS } from './realtime';
