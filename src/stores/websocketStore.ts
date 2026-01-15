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

const MAX_HISTORY = 50; // Keep last 50 messages

export const useWebSocketStore = create<WebSocketState>()(
  devtools(
    immer((set, get) => ({
      // State
      isConnected: false,
      mainDashboardUrl: 'ws://localhost:3000/ws',
      lastMessage: null,
      messageHistory: [],
      reconnectAttempts: 0,

      // Actions
      connect: () => {
        // TODO: Implement WebSocket connection
        // const ws = new WebSocket(mainDashboardUrl);
        // ws.onopen = () => { set({ isConnected: true, reconnectAttempts: 0 }); };
        // ws.onclose = () => { set({ isConnected: false }); reconnect(); };
        // ws.onmessage = (event) => { handleMessage(JSON.parse(event.data)); };

        set((state) => {
          state.isConnected = true;
          state.reconnectAttempts = 0;
        }, false, 'connect');
      },

      disconnect: () => {
        // TODO: Close WebSocket connection
        // ws?.close();

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

        // TODO: Send message via WebSocket
        // ws?.send(JSON.stringify(message));
        console.log('Send to Main:', message);
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
    })),
    { name: 'WebSocketStore' }
  )
);
