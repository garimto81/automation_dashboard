/**
 * Connection Store
 *
 * Unified connection state management for WebSocket and Supabase
 * Monitors connection health and provides centralized status
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/**
 * WebSocket connection state
 */
interface WebSocketConnectionState {
  isConnected: boolean;
  reconnectAttempts: number;
  lastError: string | null;
  lastConnectedAt: Date | null;
  lastDisconnectedAt: Date | null;
}

/**
 * Supabase connection state
 */
interface SupabaseConnectionState {
  isConnected: boolean;
  activeChannels: string[];
  lastError: string | null;
  lastSyncAt: Date | null;
}

/**
 * Overall connection state
 */
interface ConnectionState {
  websocket: WebSocketConnectionState;
  supabase: SupabaseConnectionState;

  // Actions
  updateWebSocketStatus: (status: Partial<WebSocketConnectionState>) => void;
  updateSupabaseStatus: (status: Partial<SupabaseConnectionState>) => void;
  resetConnections: () => void;
  isFullyConnected: () => boolean;
}

const INITIAL_WEBSOCKET_STATE: WebSocketConnectionState = {
  isConnected: false,
  reconnectAttempts: 0,
  lastError: null,
  lastConnectedAt: null,
  lastDisconnectedAt: null
};

const INITIAL_SUPABASE_STATE: SupabaseConnectionState = {
  isConnected: false,
  activeChannels: [],
  lastError: null,
  lastSyncAt: null
};

export const useConnectionStore = create<ConnectionState>()(
  devtools(
    immer((set, get) => ({
      // State
      websocket: INITIAL_WEBSOCKET_STATE,
      supabase: INITIAL_SUPABASE_STATE,

      // Actions
      updateWebSocketStatus: (status) =>
        set((state) => {
          Object.assign(state.websocket, status);

          // Track connection/disconnection timestamps
          if (status.isConnected === true) {
            state.websocket.lastConnectedAt = new Date();
            state.websocket.reconnectAttempts = 0;
            state.websocket.lastError = null;
          } else if (status.isConnected === false) {
            state.websocket.lastDisconnectedAt = new Date();
          }
        }, false, 'updateWebSocketStatus'),

      updateSupabaseStatus: (status) =>
        set((state) => {
          Object.assign(state.supabase, status);

          // Track sync timestamp
          if (status.isConnected === true) {
            state.supabase.lastSyncAt = new Date();
            state.supabase.lastError = null;
          }
        }, false, 'updateSupabaseStatus'),

      resetConnections: () =>
        set((state) => {
          state.websocket = { ...INITIAL_WEBSOCKET_STATE };
          state.supabase = { ...INITIAL_SUPABASE_STATE };
        }, false, 'resetConnections'),

      isFullyConnected: () => {
        const state = get();
        return state.websocket.isConnected && state.supabase.isConnected;
      }
    })),
    { name: 'ConnectionStore' }
  )
);
