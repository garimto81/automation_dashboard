/**
 * Main Dashboard WebSocket 클라이언트
 *
 * Main Dashboard → Sub Dashboard 메시지 전송 및 Sub → Main 메시지 수신
 */

import type {
  MainToSubMessage,
  SubToMainMessage,
  ConnectionStatus,
  ConnectionInfo,
} from './types';
import { WS_CONFIG } from './config';

/** 이벤트 핸들러 타입 */
export type MessageHandler<T = SubToMainMessage> = (message: T) => void;
export type ConnectionHandler = (status: ConnectionStatus) => void;
export type ErrorHandler = (error: Error) => void;

/**
 * Main Dashboard WebSocket 클라이언트
 */
export class MainDashboardClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  private connectionInfo: ConnectionInfo = {
    status: 'disconnected',
    reconnectAttempts: 0,
  };

  /**
   * 연결 시작
   */
  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.warn('[Main Client] 이미 연결되어 있습니다.');
      return;
    }

    try {
      const url = `${WS_CONFIG.url}?type=main`;
      this.ws = new WebSocket(url);

      this.ws.onopen = () => this.handleOpen();
      this.ws.onmessage = (event) => this.handleMessage(event);
      this.ws.onerror = (event) => this.handleError(event);
      this.ws.onclose = () => this.handleClose();

      this.updateConnectionStatus('reconnecting');
    } catch (error) {
      console.error('[Main Client] 연결 실패:', error);
      this.notifyError(error as Error);
      this.scheduleReconnect();
    }
  }

  /**
   * 연결 해제
   */
  disconnect(): void {
    this.clearReconnectTimeout();
    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this.updateConnectionStatus('disconnected');
  }

  /**
   * 메시지 전송
   */
  send(message: MainToSubMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('[Main Client] 연결되지 않음. 메시지 전송 실패:', message.type);
      return;
    }

    try {
      this.ws.send(JSON.stringify(message));
      console.log(`[Main Client] 메시지 전송: ${message.type}`);
    } catch (error) {
      console.error('[Main Client] 메시지 전송 에러:', error);
      this.notifyError(error as Error);
    }
  }

  /**
   * 큐 아이템 선택 메시지 전송
   */
  sendCueItemSelected(payload: MainToSubMessage & { type: 'cue_item_selected' }['payload']): void {
    this.send({
      type: 'cue_item_selected',
      payload,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 큐 아이템 취소 메시지 전송
   */
  sendCueItemCancelled(cueItemId: string): void {
    this.send({
      type: 'cue_item_cancelled',
      payload: { cueItemId },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Hand 업데이트 메시지 전송
   */
  sendHandUpdated(payload: MainToSubMessage & { type: 'hand_updated' }['payload']): void {
    this.send({
      type: 'hand_updated',
      payload,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 세션 변경 메시지 전송
   */
  sendSessionChanged(payload: MainToSubMessage & { type: 'session_changed' }['payload']): void {
    this.send({
      type: 'session_changed',
      payload,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 렌더 요청 메시지 전송
   */
  sendRenderRequest(payload: MainToSubMessage & { type: 'render_request' }['payload']): void {
    this.send({
      type: 'render_request',
      payload,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 연결 열림 핸들러
   */
  private handleOpen(): void {
    console.log('[Main Client] 연결됨');
    this.reconnectAttempts = 0;
    this.updateConnectionStatus('connected');
    this.startHeartbeat();
  }

  /**
   * 메시지 수신 핸들러
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message = JSON.parse(event.data) as SubToMainMessage;
      console.log(`[Main Client] 메시지 수신: ${message.type}`);

      this.messageHandlers.forEach((handler) => {
        try {
          handler(message);
        } catch (error) {
          console.error('[Main Client] 메시지 핸들러 에러:', error);
        }
      });
    } catch (error) {
      console.error('[Main Client] 메시지 파싱 에러:', error);
      this.notifyError(error as Error);
    }
  }

  /**
   * 에러 핸들러
   */
  private handleError(event: Event): void {
    console.error('[Main Client] WebSocket 에러:', event);
    this.notifyError(new Error('WebSocket error'));
  }

  /**
   * 연결 종료 핸들러
   */
  private handleClose(): void {
    console.log('[Main Client] 연결 종료');
    this.stopHeartbeat();
    this.updateConnectionStatus('disconnected');
    this.scheduleReconnect();
  }

  /**
   * 재연결 스케줄링
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= WS_CONFIG.maxReconnectAttempts) {
      console.error(
        `[Main Client] 최대 재연결 시도 횟수 초과 (${WS_CONFIG.maxReconnectAttempts})`
      );
      this.notifyError(new Error('Max reconnect attempts reached'));
      return;
    }

    this.reconnectAttempts++;
    this.connectionInfo.reconnectAttempts = this.reconnectAttempts;

    console.log(
      `[Main Client] ${WS_CONFIG.reconnectInterval}ms 후 재연결 시도 (${this.reconnectAttempts}/${WS_CONFIG.maxReconnectAttempts})`
    );

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, WS_CONFIG.reconnectInterval);
  }

  /**
   * 재연결 타임아웃 클리어
   */
  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  /**
   * Heartbeat 시작
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatInterval = setInterval(() => {
      this.send({
        type: 'heartbeat',
        payload: {
          mainStatus: 'connected',
        },
        timestamp: new Date().toISOString(),
      });
    }, WS_CONFIG.heartbeatInterval);
  }

  /**
   * Heartbeat 중지
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * 연결 상태 업데이트
   */
  private updateConnectionStatus(status: ConnectionStatus): void {
    this.connectionInfo.status = status;

    if (status === 'connected') {
      this.connectionInfo.lastConnectedAt = new Date();
    } else if (status === 'disconnected') {
      this.connectionInfo.lastDisconnectedAt = new Date();
    }

    this.connectionHandlers.forEach((handler) => {
      try {
        handler(status);
      } catch (error) {
        console.error('[Main Client] 연결 상태 핸들러 에러:', error);
      }
    });
  }

  /**
   * 에러 알림
   */
  private notifyError(error: Error): void {
    this.errorHandlers.forEach((handler) => {
      try {
        handler(error);
      } catch (err) {
        console.error('[Main Client] 에러 핸들러 에러:', err);
      }
    });
  }

  /**
   * 메시지 핸들러 등록
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  /**
   * 연결 상태 핸들러 등록
   */
  onConnection(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    return () => this.connectionHandlers.delete(handler);
  }

  /**
   * 에러 핸들러 등록
   */
  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  /**
   * 연결 정보 조회
   */
  getConnectionInfo(): ConnectionInfo {
    return { ...this.connectionInfo };
  }

  /**
   * 연결 상태 조회
   */
  isConnected(): boolean {
    return this.connectionInfo.status === 'connected';
  }
}

// 싱글톤 인스턴스
let clientInstance: MainDashboardClient | null = null;

/**
 * 클라이언트 인스턴스 가져오기 (싱글톤)
 */
export function getMainClient(): MainDashboardClient {
  if (!clientInstance) {
    clientInstance = new MainDashboardClient();
  }
  return clientInstance;
}
