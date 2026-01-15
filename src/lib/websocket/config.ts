/**
 * WebSocket 서버 및 클라이언트 설정
 *
 * Main ↔ Sub Dashboard 통신을 위한 WebSocket 연결 설정
 */

export const WS_CONFIG = {
  /** WebSocket 서버 URL */
  url: 'ws://localhost:3001/ws/dashboard',

  /** 재연결 시도 간격 (밀리초) */
  reconnectInterval: 3000,

  /** 최대 재연결 시도 횟수 */
  maxReconnectAttempts: 5,

  /** Heartbeat 전송 간격 (밀리초) */
  heartbeatInterval: 30000,

  /** 메시지 타임아웃 (밀리초) */
  messageTimeout: 5000,
} as const;

export type WSConfig = typeof WS_CONFIG;
