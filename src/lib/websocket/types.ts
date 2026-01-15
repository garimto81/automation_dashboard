/**
 * WebSocket 메시지 타입 정의
 *
 * Main Dashboard ↔ Sub Dashboard 양방향 통신 메시지 스키마
 */

/** 플레이어 데이터 구조 */
export interface PlayerData {
  position: number;
  playerName: string;
  stackAmount: number;
  bbs: number;
}

/** 필드 매핑 구조 */
export interface FieldMapping {
  fieldId: string;
  targetFieldKey: string;
  slotIndex?: number;
  sourceTable: string;
  sourceColumn: string;
  sourceJoin?: string;
  transform: string;
  currentValue?: string;
}

/** render_gfx_data_v3 스키마 */
export interface RenderGfxDataV3 {
  slots: Record<string, {
    name?: string;
    chips?: string;
    bbs?: string;
    rank?: string;
    [key: string]: string | undefined;
  }>;
}

// ============================================
// Main → Sub 메시지 타입
// ============================================

/** 큐 아이템 선택 메시지 */
export interface CueItemSelectedMessage {
  type: 'cue_item_selected';
  payload: {
    cueItemId: string;
    handId: string;
    compositionName: string;
    handData: {
      handNum: number;
      sessionId: string;
      players: PlayerData[];
      boardCards: string[];
      pot: number;
      blindLevel: string;
    };
    suggestedMappings?: FieldMapping[];
  };
  timestamp: string;
}

/** 큐 아이템 취소 메시지 */
export interface CueItemCancelledMessage {
  type: 'cue_item_cancelled';
  payload: {
    cueItemId: string;
  };
  timestamp: string;
}

/** Hand 데이터 업데이트 메시지 */
export interface HandUpdatedMessage {
  type: 'hand_updated';
  payload: {
    handId: string;
    sessionId: string;
    handNum: number;
    changedFields: string[];
    players: PlayerData[];
  };
  timestamp: string;
}

/** 세션 변경 메시지 */
export interface SessionChangedMessage {
  type: 'session_changed';
  payload: {
    sessionId: string;
    gameType: 'cash' | 'tournament';
    eventId?: string;
  };
  timestamp: string;
}

/** 렌더링 요청 메시지 */
export interface RenderRequestMessage {
  type: 'render_request';
  payload: {
    requestId: string;
    compositionName: string;
    handId: string;
    priority: number;
    gfxData: RenderGfxDataV3;
  };
  timestamp: string;
}

/** Heartbeat 메시지 */
export interface HeartbeatMessage {
  type: 'heartbeat';
  payload: {
    mainStatus: 'connected' | 'busy';
    activeSession?: string;
  };
  timestamp: string;
}

/** Main → Sub 메시지 유니온 타입 */
export type MainToSubMessage =
  | CueItemSelectedMessage
  | CueItemCancelledMessage
  | HandUpdatedMessage
  | SessionChangedMessage
  | RenderRequestMessage
  | HeartbeatMessage;

// ============================================
// Sub → Main 메시지 타입
// ============================================

/** 렌더 상태 업데이트 메시지 */
export interface RenderStatusUpdateMessage {
  type: 'render_status_update';
  payload: {
    jobId: string;
    requestId?: string;
    status: 'queued' | 'rendering' | 'completed' | 'failed';
    progress: number;
    estimatedRemaining?: number;
  };
  timestamp: string;
}

/** 렌더 완료 메시지 */
export interface RenderCompleteMessage {
  type: 'render_complete';
  payload: {
    jobId: string;
    requestId?: string;
    outputPath: string;
    duration: number;
    frameCount: number;
    fileSize: number;
  };
  timestamp: string;
}

/** 렌더 에러 메시지 */
export interface RenderErrorMessage {
  type: 'render_error';
  payload: {
    jobId: string;
    requestId?: string;
    errorCode: string;
    errorMessage: string;
    retryable: boolean;
  };
  timestamp: string;
}

/** 매핑 변경 메시지 */
export interface MappingChangedMessage {
  type: 'mapping_changed';
  payload: {
    compositionName: string;
    mappingId: string;
    changedFields: string[];
  };
  timestamp: string;
}

/** Composition 선택 메시지 */
export interface CompositionSelectedMessage {
  type: 'composition_selected';
  payload: {
    compositionName: string;
    category: string;
    fieldCount: number;
  };
  timestamp: string;
}

/** Heartbeat 응답 메시지 */
export interface HeartbeatAckMessage {
  type: 'heartbeat_ack';
  payload: {
    subStatus: 'ready' | 'busy' | 'rendering';
    queueLength: number;
    activeJobs: number;
  };
  timestamp: string;
}

/** Sub → Main 메시지 유니온 타입 */
export type SubToMainMessage =
  | RenderStatusUpdateMessage
  | RenderCompleteMessage
  | RenderErrorMessage
  | MappingChangedMessage
  | CompositionSelectedMessage
  | HeartbeatAckMessage;

// ============================================
// 연결 상태 타입
// ============================================

export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';

/** WebSocket 연결 정보 */
export interface ConnectionInfo {
  status: ConnectionStatus;
  reconnectAttempts: number;
  lastConnectedAt?: Date;
  lastDisconnectedAt?: Date;
}
