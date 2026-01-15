/**
 * WebSocket 메시지 핸들러
 *
 * Main ↔ Sub 간 메시지 처리 로직
 */

import type {
  MainToSubMessage,
  SubToMainMessage,
  CueItemSelectedMessage,
  HandUpdatedMessage,
  RenderStatusUpdateMessage,
  RenderCompleteMessage,
  RenderErrorMessage,
} from './types';

/**
 * 메시지 핸들러 인터페이스
 */
export interface MessageHandlers {
  /** Main → Sub: 큐 아이템 선택 */
  onCueItemSelected?: (message: CueItemSelectedMessage) => void | Promise<void>;

  /** Main → Sub: 큐 아이템 취소 */
  onCueItemCancelled?: (cueItemId: string) => void | Promise<void>;

  /** Main → Sub: Hand 데이터 업데이트 */
  onHandUpdated?: (message: HandUpdatedMessage) => void | Promise<void>;

  /** Main → Sub: 세션 변경 */
  onSessionChanged?: (sessionId: string, gameType: 'cash' | 'tournament') => void | Promise<void>;

  /** Main → Sub: 렌더 요청 */
  onRenderRequest?: (requestId: string, compositionName: string, handId: string) => void | Promise<void>;

  /** Sub → Main: 렌더 상태 업데이트 */
  onRenderStatusUpdate?: (message: RenderStatusUpdateMessage) => void | Promise<void>;

  /** Sub → Main: 렌더 완료 */
  onRenderComplete?: (message: RenderCompleteMessage) => void | Promise<void>;

  /** Sub → Main: 렌더 에러 */
  onRenderError?: (message: RenderErrorMessage) => void | Promise<void>;

  /** Sub → Main: 매핑 변경 */
  onMappingChanged?: (compositionName: string, changedFields: string[]) => void | Promise<void>;

  /** Sub → Main: Composition 선택 */
  onCompositionSelected?: (compositionName: string, category: string) => void | Promise<void>;

  /** Heartbeat */
  onHeartbeat?: () => void | Promise<void>;
}

/**
 * Main Dashboard 메시지 라우터
 *
 * Sub → Main 메시지를 적절한 핸들러로 전달
 */
export function createMainMessageRouter(handlers: MessageHandlers) {
  return async (message: SubToMainMessage): Promise<void> => {
    try {
      switch (message.type) {
        case 'render_status_update':
          if (handlers.onRenderStatusUpdate) {
            await handlers.onRenderStatusUpdate(message);
          }
          break;

        case 'render_complete':
          if (handlers.onRenderComplete) {
            await handlers.onRenderComplete(message);
          }
          break;

        case 'render_error':
          if (handlers.onRenderError) {
            await handlers.onRenderError(message);
          }
          break;

        case 'mapping_changed':
          if (handlers.onMappingChanged) {
            await handlers.onMappingChanged(
              message.payload.compositionName,
              message.payload.changedFields
            );
          }
          break;

        case 'composition_selected':
          if (handlers.onCompositionSelected) {
            await handlers.onCompositionSelected(
              message.payload.compositionName,
              message.payload.category
            );
          }
          break;

        case 'heartbeat_ack':
          if (handlers.onHeartbeat) {
            await handlers.onHeartbeat();
          }
          break;

        default:
          console.warn('[Main Router] 알 수 없는 메시지 타입:', (message as any).type);
      }
    } catch (error) {
      console.error('[Main Router] 메시지 처리 에러:', error);
      throw error;
    }
  };
}

/**
 * Sub Dashboard 메시지 라우터
 *
 * Main → Sub 메시지를 적절한 핸들러로 전달
 */
export function createSubMessageRouter(handlers: MessageHandlers) {
  return async (message: MainToSubMessage): Promise<void> => {
    try {
      switch (message.type) {
        case 'cue_item_selected':
          if (handlers.onCueItemSelected) {
            await handlers.onCueItemSelected(message);
          }
          break;

        case 'cue_item_cancelled':
          if (handlers.onCueItemCancelled) {
            await handlers.onCueItemCancelled(message.payload.cueItemId);
          }
          break;

        case 'hand_updated':
          if (handlers.onHandUpdated) {
            await handlers.onHandUpdated(message);
          }
          break;

        case 'session_changed':
          if (handlers.onSessionChanged) {
            await handlers.onSessionChanged(
              message.payload.sessionId,
              message.payload.gameType
            );
          }
          break;

        case 'render_request':
          if (handlers.onRenderRequest) {
            await handlers.onRenderRequest(
              message.payload.requestId,
              message.payload.compositionName,
              message.payload.handId
            );
          }
          break;

        case 'heartbeat':
          if (handlers.onHeartbeat) {
            await handlers.onHeartbeat();
          }
          break;

        default:
          console.warn('[Sub Router] 알 수 없는 메시지 타입:', (message as any).type);
      }
    } catch (error) {
      console.error('[Sub Router] 메시지 처리 에러:', error);
      throw error;
    }
  };
}

/**
 * 타입 가드: MainToSubMessage 체크
 */
export function isMainToSubMessage(message: any): message is MainToSubMessage {
  const validTypes = [
    'cue_item_selected',
    'cue_item_cancelled',
    'hand_updated',
    'session_changed',
    'render_request',
    'heartbeat',
  ];
  return message && typeof message === 'object' && validTypes.includes(message.type);
}

/**
 * 타입 가드: SubToMainMessage 체크
 */
export function isSubToMainMessage(message: any): message is SubToMainMessage {
  const validTypes = [
    'render_status_update',
    'render_complete',
    'render_error',
    'mapping_changed',
    'composition_selected',
    'heartbeat_ack',
  ];
  return message && typeof message === 'object' && validTypes.includes(message.type);
}

/**
 * 메시지 유효성 검사
 */
export function validateMessage(message: any): { valid: boolean; error?: string } {
  if (!message || typeof message !== 'object') {
    return { valid: false, error: 'Invalid message format' };
  }

  if (!message.type || typeof message.type !== 'string') {
    return { valid: false, error: 'Missing or invalid message type' };
  }

  if (!message.payload || typeof message.payload !== 'object') {
    return { valid: false, error: 'Missing or invalid payload' };
  }

  if (!message.timestamp || typeof message.timestamp !== 'string') {
    return { valid: false, error: 'Missing or invalid timestamp' };
  }

  return { valid: true };
}
