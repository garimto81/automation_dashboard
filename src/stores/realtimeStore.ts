/**
 * Realtime Store
 *
 * Main Dashboard realtime events state
 * Manages Supabase Realtime events, connection status, and notifications
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { RealtimeState, RealtimeEvent, ConnectionStatus, RealtimeChannelConfig } from '@/types';

const MAX_EVENTS = 100; // Keep only last 100 events

export const useRealtimeStore = create<RealtimeState>()(
  devtools(
    immer((set, get) => ({
      // State
      events: [],
      unreadCount: 0,
      connectionStatus: 'disconnected',
      lastEventAt: null,
      activeChannels: [],

      // Actions
      addEvent: (event) =>
        set((state) => {
          state.events.unshift(event);

          // Trim to max events
          if (state.events.length > MAX_EVENTS) {
            state.events = state.events.slice(0, MAX_EVENTS);
          }

          if (!event.isRead) {
            state.unreadCount += 1;
          }

          state.lastEventAt = event.timestamp;
        }, false, 'addEvent'),

      clearEvents: () =>
        set((state) => {
          state.events = [];
          state.unreadCount = 0;
          state.lastEventAt = null;
        }, false, 'clearEvents'),

      markAllAsRead: () =>
        set((state) => {
          state.events.forEach((event) => {
            event.isRead = true;
          });
          state.unreadCount = 0;
        }, false, 'markAllAsRead'),

      markAsRead: (eventId) =>
        set((state) => {
          const event = state.events.find((e) => e.eventId === eventId);
          if (event && !event.isRead) {
            event.isRead = true;
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }, false, 'markAsRead'),

      setConnectionStatus: (status: ConnectionStatus) =>
        set((state) => {
          state.connectionStatus = status;
        }, false, 'setConnectionStatus'),

      subscribeChannel: (channel: RealtimeChannelConfig) =>
        set((state) => {
          if (!state.activeChannels.includes(channel.name)) {
            state.activeChannels.push(channel.name);
          }
        }, false, 'subscribeChannel'),

      unsubscribeChannel: (channelName) =>
        set((state) => {
          state.activeChannels = state.activeChannels.filter((ch) => ch !== channelName);
        }, false, 'unsubscribeChannel'),

      // Selectors
      getUnreadEvents: () => get().events.filter((event) => !event.isRead),

      getEventsByCategory: (category) =>
        get().events.filter((event) => event.category === category)
    })),
    { name: 'RealtimeStore' }
  )
);
