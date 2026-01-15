/**
 * Slot Mapping Store
 *
 * Sub Dashboard slot mapping state management
 * Manages field mappings, data sources, and preview data
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { CompositionMapping, DataSourceType, FieldMapping } from '@/types';

interface SlotMappingState {
  // State
  selectedComposition: CompositionMapping | null;
  dataSource: DataSourceType;
  selectedFieldId: string | null;
  isDirty: boolean;
  previewData: Record<string, string>;

  // Actions
  selectComposition: (name: string) => Promise<void>;
  updateMapping: (fieldId: string, updates: Partial<FieldMapping>) => void;
  setDataSource: (source: DataSourceType) => void;
  saveMapping: () => Promise<void>;
  refreshPreview: () => Promise<void>;
  selectField: (fieldId: string | null) => void;
  resetMapping: () => void;
}

export const useSlotMappingStore = create<SlotMappingState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // State
        selectedComposition: null,
        dataSource: 'gfx',
        selectedFieldId: null,
        isDirty: false,
        previewData: {},

        // Actions
        selectComposition: async (name: string) => {
          // TODO: Fetch composition mapping from API
          // const response = await fetch(`/api/slot-mappings?composition=${name}`);
          // const mapping = await response.json();

          set((state) => {
            // state.selectedComposition = mapping;
            state.isDirty = false;
            state.selectedFieldId = null;
          }, false, 'selectComposition');

          // Refresh preview after selection
          get().refreshPreview();
        },

        updateMapping: (fieldId, updates) =>
          set((state) => {
            if (state.selectedComposition) {
              const field = state.selectedComposition.fields.find(
                (f) => f.fieldId === fieldId
              );
              if (field) {
                Object.assign(field, updates);
                state.isDirty = true;
              }
            }
          }, false, 'updateMapping'),

        setDataSource: (source) =>
          set((state) => {
            state.dataSource = source;

            // Update all mappings to use new data source
            if (state.selectedComposition) {
              state.selectedComposition.dataSource = source;
              state.isDirty = true;
            }
          }, false, 'setDataSource'),

        saveMapping: async () => {
          const { selectedComposition } = get();
          if (!selectedComposition) return;

          // TODO: Save to API
          // await fetch(`/api/slot-mappings/${selectedComposition.mappingId}`, {
          //   method: 'PATCH',
          //   body: JSON.stringify(selectedComposition)
          // });

          set((state) => {
            state.isDirty = false;
          }, false, 'saveMapping');
        },

        refreshPreview: async () => {
          const { selectedComposition, dataSource } = get();
          if (!selectedComposition) return;

          // TODO: Fetch preview data from API
          // const response = await fetch('/api/data/preview', {
          //   method: 'POST',
          //   body: JSON.stringify({ composition: selectedComposition, dataSource })
          // });
          // const previewData = await response.json();

          set((state) => {
            // state.previewData = previewData;

            // Update currentValue for each field
            if (state.selectedComposition) {
              state.selectedComposition.fields.forEach((field) => {
                // field.currentValue = previewData[field.fieldId];
              });
            }
          }, false, 'refreshPreview');
        },

        selectField: (fieldId) =>
          set((state) => {
            state.selectedFieldId = fieldId;
          }, false, 'selectField'),

        resetMapping: () =>
          set((state) => {
            state.selectedComposition = null;
            state.selectedFieldId = null;
            state.isDirty = false;
            state.previewData = {};
          }, false, 'resetMapping')
      })),
      {
        name: 'slot-mapping-storage',
        partialize: (state) => ({
          dataSource: state.dataSource
        })
      }
    ),
    { name: 'SlotMappingStore' }
  )
);
