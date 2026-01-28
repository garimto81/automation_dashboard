/**
 * Cuesheet Store
 *
 * Main Dashboard cuesheet editing state
 * Manages cue items, selection, and saving
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { CuesheetState, CueItem } from '@/types';

export const useCuesheetStore = create<CuesheetState>()(
  devtools(
    persist(
      immer((set) => ({
        // State
        cuesheetId: null,
        items: [],
        selectedItemId: null,
        isDirty: false,
        sortOrder: 'time',

        // Actions
        loadCuesheet: async (id: string) => {
          set((state) => {
            state.cuesheetId = id;
            state.isDirty = false;
          }, false, 'loadCuesheet');

          // TODO: Fetch items from API
          // const response = await fetch(`/api/cuesheets/${id}`);
          // const data = await response.json();
          // set((state) => { state.items = data.items; });
        },

        addItem: (item) =>
          set((state) => {
            const newItem: CueItem = {
              ...item,
              cueItemId: crypto.randomUUID(),
              createdAt: new Date(),
              updatedAt: new Date()
            };
            state.items.push(newItem);
            state.isDirty = true;
          }, false, 'addItem'),

        updateItem: (id, updates) =>
          set((state) => {
            const index = state.items.findIndex((item) => item.cueItemId === id);
            if (index !== -1) {
              state.items[index] = {
                ...state.items[index],
                ...updates,
                updatedAt: new Date()
              };
              state.isDirty = true;
            }
          }, false, 'updateItem'),

        deleteItem: (id) =>
          set((state) => {
            state.items = state.items.filter((item) => item.cueItemId !== id);
            if (state.selectedItemId === id) {
              state.selectedItemId = null;
            }
            state.isDirty = true;
          }, false, 'deleteItem'),

        reorderItems: (sourceIndex, destIndex) =>
          set((state) => {
            const [removed] = state.items.splice(sourceIndex, 1);
            state.items.splice(destIndex, 0, removed);

            // Update order field
            state.items.forEach((item, idx) => {
              item.order = idx;
            });
            state.isDirty = true;
          }, false, 'reorderItems'),

        selectItem: (id) =>
          set((state) => {
            state.selectedItemId = id;

            // Send cue_item_selected event via WebSocket (Main → Sub)
            const selectedItem = state.items.find((item) => item.cueItemId === id);
            if (selectedItem) {
              // Import at runtime to avoid circular dependencies
              import('@/lib/websocket/mainClient').then(({ getMainClient }) => {
                const mainClient = getMainClient();

                // TODO: Fetch full hand data from API
                // For now, send minimal data structure with required fields
                mainClient.send({
                  type: 'cue_item_selected',
                  payload: {
                    cueItemId: selectedItem.cueItemId,
                    handId: selectedItem.handId,
                    compositionName: selectedItem.compositionName,
                    handData: {
                      handNum: selectedItem.handNum,
                      sessionId: '', // TODO: Get from session context
                      players: [],   // TODO: Fetch from hand data
                      boardCards: [],
                      pot: 0,
                      blindLevel: ''
                    }
                  },
                  timestamp: new Date().toISOString()
                });
              });
            }
          }, false, 'selectItem'),

        saveToDb: async () => {
          // TODO: Save to database via API
          // const response = await fetch(`/api/cuesheets/${cuesheetId}`, {
          //   method: 'PATCH',
          //   body: JSON.stringify({ items })
          // });
          set((state) => {
            state.isDirty = false;
          }, false, 'saveToDb');
        },

        setSortOrder: (order) =>
          set((state) => {
            state.sortOrder = order;

            // Re-sort items
            if (order === 'time') {
              state.items.sort((a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              );
            } else if (order === 'priority') {
              state.items.sort((a, b) => a.priority - b.priority);
            }
          }, false, 'setSortOrder')
      })),
      {
        name: 'cuesheet-storage',
        partialize: (state) => ({
          cuesheetId: state.cuesheetId,
          sortOrder: state.sortOrder
        })
      }
    ),
    { name: 'CuesheetStore' }
  )
);
