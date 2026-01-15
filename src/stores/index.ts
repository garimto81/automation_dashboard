/**
 * Stores Index
 *
 * Central export point for all Zustand stores
 * Total: 8 stores (4 Main Dashboard + 4 Sub Dashboard)
 */

// Main Dashboard stores
export { useSessionStore } from './sessionStore';
export { useCuesheetStore } from './cuesheetStore';
export { useRealtimeStore } from './realtimeStore';
export { useUIStore } from './uiStore';

// Sub Dashboard stores
export { useRenderQueueStore } from './renderQueueStore';
export { useSlotMappingStore } from './slotMappingStore';
export { useCompositionStore } from './compositionStore';
export { useWebSocketStore } from './websocketStore';

// Re-export types for convenience
export type { TabName, ModalName } from './uiStore';
