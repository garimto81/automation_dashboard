/**
 * WebSocket Store
 *
 * Sub Dashboard WebSocket state management
 * Manages connection to Main Dashboard and message handling
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { WebSocketState, MainToSubMessage, SubToMainMessage } from '@/types';
import { getSubClient } from '@/lib/websocket/subClient';

const MAX_HISTORY = 50; // Keep last 50 messages

export const useWebSocketStore = create<WebSocketState>()(
  devtools(
    immer((set, get) => {
      // Get Sub Dashboard client instance
      const client = getSubClient();

      // Register message handler
      client.onMessage((message) => {
        get().handleMessage(message);
      });

      // Register connection handler
      client.onConnection((status) => {
        set((state) => {
          state.isConnected = status === 'connected';
        }, false, 'connectionStatusChanged');
      });

      // Register error handler
      client.onError((error) => {
        console.error('[WebSocket Store] Error:', error);
      });

      return {
        // State
        isConnected: false,
        mainDashboardUrl: 'ws://localhost:3000/ws',
        lastMessage: null,
        messageHistory: [],
        reconnectAttempts: 0,

        // Actions
        connect: () => {
          client.connect();
          set((state) => {
            state.reconnectAttempts = 0;
          }, false, 'connect');
        },

        disconnect: () => {
          client.disconnect();
          set((state) => {
            state.isConnected = false;
          }, false, 'disconnect');
        },

        sendToMain: (message: SubToMainMessage) => {
          const { isConnected } = get();

          if (!isConnected) {
            console.warn('WebSocket not connected, cannot send message');
            return;
          }

          client.send(message);
        },

        handleMessage: (message: MainToSubMessage) =>
          set((state) => {
            state.lastMessage = message;
            state.messageHistory.unshift(message);

            // Trim history
            if (state.messageHistory.length > MAX_HISTORY) {
              state.messageHistory = state.messageHistory.slice(0, MAX_HISTORY);
            }

            // Handle different message types
            switch (message.type) {
              case 'cue_item_selected':
                console.log('Cue item selected:', message.payload);
                // TODO: Auto-select composition
                break;

              case 'hand_updated':
                console.log('Hand updated:', message.payload);
                // TODO: Refresh preview data
                break;

              case 'session_changed':
                console.log('Session changed:', message.payload);
                // TODO: Update session context
                break;

              case 'render_request':
                console.log('Render request:', message.payload);
                // TODO: Add to render queue
                break;

              case 'heartbeat':
                console.log('Heartbeat received');
                // TODO: Send heartbeat_ack
                break;

              case 'cue_item_cancelled':
                console.log('Cue item cancelled:', message.payload);
                // TODO: Clear selection
                break;

              default:
                console.warn('Unknown message type:', message);
            }
          }, false, 'handleMessage'),

        clearHistory: () =>
          set((state) => {
            state.messageHistory = [];
            state.lastMessage = null;
          }, false, 'clearHistory')
      };
    }),
    { name: 'WebSocketStore' }
  )
);
