/**
 * WebSocket 서버 (Node.js ws 라이브러리)
 *
 * Main Dashboard ↔ Sub Dashboard 통신을 중계하는 WebSocket 서버
 * 포트: 3001 (기본값)
 */

import { WebSocketServer, WebSocket } from 'ws';
import type { MainToSubMessage, SubToMainMessage } from './types';

/** 클라이언트 타입 */
type ClientType = 'main' | 'sub';

/** 연결된 클라이언트 정보 */
interface ConnectedClient {
  ws: WebSocket;
  type: ClientType;
  id: string;
  connectedAt: Date;
  lastHeartbeat: Date;
}

/** WebSocket 서버 설정 */
interface ServerConfig {
  port: number;
  heartbeatCheckInterval: number;
  heartbeatTimeout: number;
}

const DEFAULT_CONFIG: ServerConfig = {
  port: 3001,
  heartbeatCheckInterval: 35000, // 35초마다 체크
  heartbeatTimeout: 60000, // 60초 타임아웃
};

/**
 * Dashboard WebSocket 서버 클래스
 */
export class DashboardWebSocketServer {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, ConnectedClient> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private config: ServerConfig;

  constructor(config: Partial<ServerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * 서버 시작
   */
  start(): void {
    if (this.wss) {
      console.warn('[WS Server] 이미 실행 중입니다.');
      return;
    }

    this.wss = new WebSocketServer({ port: this.config.port });

    this.wss.on('connection', (ws, req) => {
      this.handleConnection(ws, req);
    });

    this.wss.on('error', (error) => {
      console.error('[WS Server] 에러:', error);
    });

    // Heartbeat 체크 시작
    this.startHeartbeatCheck();

    console.log(`[WS Server] 시작됨 (포트: ${this.config.port})`);
  }

  /**
   * 서버 중지
   */
  stop(): void {
    if (!this.wss) {
      return;
    }

    // Heartbeat 체크 중지
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // 모든 클라이언트 연결 종료
    this.clients.forEach((client) => {
      client.ws.close();
    });
    this.clients.clear();

    // 서버 종료
    this.wss.close(() => {
      console.log('[WS Server] 종료됨');
    });

    this.wss = null;
  }

  /**
   * 연결 처리
   */
  private handleConnection(ws: WebSocket, req: any): void {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const clientType = url.searchParams.get('type') as ClientType | null;

    if (!clientType || (clientType !== 'main' && clientType !== 'sub')) {
      console.error('[WS Server] 잘못된 클라이언트 타입:', clientType);
      ws.close(1008, 'Invalid client type');
      return;
    }

    const clientId = `${clientType}-${Date.now()}`;
    const client: ConnectedClient = {
      ws,
      type: clientType,
      id: clientId,
      connectedAt: new Date(),
      lastHeartbeat: new Date(),
    };

    this.clients.set(clientId, client);
    console.log(`[WS Server] ${clientType} 클라이언트 연결: ${clientId}`);

    // 메시지 수신 핸들러
    ws.on('message', (data) => {
      this.handleMessage(clientId, data.toString());
    });

    // 연결 종료 핸들러
    ws.on('close', () => {
      this.clients.delete(clientId);
      console.log(`[WS Server] ${clientType} 클라이언트 연결 종료: ${clientId}`);
    });

    // 에러 핸들러
    ws.on('error', (error) => {
      console.error(`[WS Server] ${clientType} 클라이언트 에러 (${clientId}):`, error);
    });
  }

  /**
   * 메시지 처리
   */
  private handleMessage(clientId: string, data: string): void {
    const client = this.clients.get(clientId);
    if (!client) {
      return;
    }

    try {
      const message = JSON.parse(data) as MainToSubMessage | SubToMainMessage;

      // Heartbeat 메시지 처리
      if (message.type === 'heartbeat' || message.type === 'heartbeat_ack') {
        client.lastHeartbeat = new Date();
        console.log(`[WS Server] Heartbeat 수신: ${clientId}`);

        // Heartbeat는 라우팅하지 않음
        return;
      }

      // 메시지 라우팅
      this.routeMessage(client, message);
    } catch (error) {
      console.error(`[WS Server] 메시지 파싱 에러 (${clientId}):`, error);
    }
  }

  /**
   * 메시지 라우팅
   */
  private routeMessage(
    sender: ConnectedClient,
    message: MainToSubMessage | SubToMainMessage
  ): void {
    const targetType: ClientType = sender.type === 'main' ? 'sub' : 'main';
    const targets = Array.from(this.clients.values()).filter(
      (c) => c.type === targetType && c.ws.readyState === WebSocket.OPEN
    );

    if (targets.length === 0) {
      console.warn(
        `[WS Server] 대상 클라이언트 없음 (${targetType}), 메시지: ${message.type}`
      );
      return;
    }

    const messageStr = JSON.stringify(message);
    targets.forEach((target) => {
      try {
        target.ws.send(messageStr);
        console.log(
          `[WS Server] 메시지 전달: ${sender.type} → ${target.type} (${message.type})`
        );
      } catch (error) {
        console.error(`[WS Server] 메시지 전송 에러 (${target.id}):`, error);
      }
    });
  }

  /**
   * Heartbeat 체크 시작
   */
  private startHeartbeatCheck(): void {
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();

      this.clients.forEach((client, clientId) => {
        const timeSinceLastHeartbeat = now - client.lastHeartbeat.getTime();

        if (timeSinceLastHeartbeat > this.config.heartbeatTimeout) {
          console.warn(
            `[WS Server] Heartbeat 타임아웃: ${clientId} (${timeSinceLastHeartbeat}ms)`
          );
          client.ws.close(1000, 'Heartbeat timeout');
          this.clients.delete(clientId);
        }
      });
    }, this.config.heartbeatCheckInterval);
  }

  /**
   * 연결된 클라이언트 수 조회
   */
  getClientCount(type?: ClientType): number {
    if (!type) {
      return this.clients.size;
    }
    return Array.from(this.clients.values()).filter((c) => c.type === type).length;
  }

  /**
   * 서버 상태 조회
   */
  getStatus() {
    return {
      running: this.wss !== null,
      port: this.config.port,
      totalClients: this.clients.size,
      mainClients: this.getClientCount('main'),
      subClients: this.getClientCount('sub'),
    };
  }
}

// 싱글톤 인스턴스
let serverInstance: DashboardWebSocketServer | null = null;

/**
 * 서버 인스턴스 가져오기 (싱글톤)
 */
export function getServerInstance(config?: Partial<ServerConfig>): DashboardWebSocketServer {
  if (!serverInstance) {
    serverInstance = new DashboardWebSocketServer(config);
  }
  return serverInstance;
}

/**
 * 서버 시작 (편의 함수)
 */
export function startServer(config?: Partial<ServerConfig>): void {
  const server = getServerInstance(config);
  server.start();
}

/**
 * 서버 중지 (편의 함수)
 */
export function stopServer(): void {
  if (serverInstance) {
    serverInstance.stop();
    serverInstance = null;
  }
}
