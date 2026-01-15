/**
 * WebSocket 모듈 Export
 *
 * Main ↔ Sub Dashboard 통신을 위한 WebSocket 클라이언트/서버
 */

// Config
export { WS_CONFIG } from './config';
export type { WSConfig } from './config';

// Types
export * from './types';

// Server
export {
  DashboardWebSocketServer,
  getServerInstance,
  startServer,
  stopServer,
} from './server';

// Main Client
export {
  MainDashboardClient,
  getMainClient,
} from './mainClient';
export type {
  MessageHandler as MainMessageHandler,
  ConnectionHandler as MainConnectionHandler,
  ErrorHandler as MainErrorHandler,
} from './mainClient';

// Sub Client
export {
  SubDashboardClient,
  getSubClient,
} from './subClient';
export type {
  MessageHandler as SubMessageHandler,
  ConnectionHandler as SubConnectionHandler,
  ErrorHandler as SubErrorHandler,
} from './subClient';

// Handlers
export {
  createMainMessageRouter,
  createSubMessageRouter,
  isMainToSubMessage,
  isSubToMainMessage,
  validateMessage,
} from './handlers';
export type { MessageHandlers } from './handlers';
