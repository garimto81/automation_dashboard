/**
 * Session Store
 *
 * Main Dashboard session state management
 * Manages current session, game type, status, and current hand
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { SessionState, SessionStatus } from '@/types';

export const useSessionStore = create<SessionState>()(
  devtools(
    (set) => ({
      // State
      sessionId: null,
      gameType: 'cash',
      status: 'paused',
      currentHandId: null,
      handNum: 0,
      startTime: null,

      // Actions
      setSession: (sessionId: string) =>
        set({ sessionId, startTime: new Date() }, false, 'setSession'),

      updateStatus: (status: SessionStatus) =>
        set({ status }, false, 'updateStatus'),

      setCurrentHand: (handId: string, handNum: number) =>
        set({ currentHandId: handId, handNum }, false, 'setCurrentHand'),

      clearSession: () =>
        set(
          {
            sessionId: null,
            gameType: 'cash',
            status: 'paused',
            currentHandId: null,
            handNum: 0,
            startTime: null
          },
          false,
          'clearSession'
        )
    }),
    { name: 'SessionStore' }
  )
);
