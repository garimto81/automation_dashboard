/**
 * Composition Store
 *
 * Sub Dashboard composition state management
 * Manages composition metadata, filtering, and favorites
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { CompositionState, Composition, CompositionCategory } from '@/types';

export const useCompositionStore = create<CompositionState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // State
        compositions: [],
        selectedId: null,
        filter: {
          search: '',
          category: 'all',
          favorites: false
        },

        // Actions
        loadCompositions: async () => {
          // TODO: Fetch compositions from API
          // const response = await fetch('/api/compositions');
          // const data = await response.json();

          set((state) => {
            // state.compositions = data;
          }, false, 'loadCompositions');
        },

        selectComposition: (id) =>
          set((state) => {
            state.selectedId = id;

            // Update lastUsed timestamp
            const comp = state.compositions.find((c) => c.id === id);
            if (comp) {
              comp.lastUsed = new Date();
            }
          }, false, 'selectComposition'),

        toggleFavorite: (id) =>
          set((state) => {
            const comp = state.compositions.find((c) => c.id === id);
            if (comp) {
              comp.isFavorite = !comp.isFavorite;
            }
          }, false, 'toggleFavorite'),

        setFilter: (filter) =>
          set((state) => {
            state.filter = { ...state.filter, ...filter };
          }, false, 'setFilter'),

        // Selectors
        getFilteredCompositions: () => {
          const { compositions, filter } = get();

          return compositions.filter((comp) => {
            // Search filter
            if (filter.search) {
              const searchLower = filter.search.toLowerCase();
              const matchesSearch =
                comp.name.toLowerCase().includes(searchLower) ||
                comp.description?.toLowerCase().includes(searchLower) ||
                comp.tags?.some((tag) => tag.toLowerCase().includes(searchLower));

              if (!matchesSearch) return false;
            }

            // Category filter
            if (filter.category !== 'all' && comp.category !== filter.category) {
              return false;
            }

            // Favorites filter
            if (filter.favorites && !comp.isFavorite) {
              return false;
            }

            return true;
          });
        },

        getCompositionsByCategory: (category: CompositionCategory) => {
          return get().compositions.filter((comp) => comp.category === category);
        }
      })),
      {
        name: 'composition-storage',
        partialize: (state) => ({
          filter: state.filter,
          compositions: state.compositions.map((comp) => ({
            id: comp.id,
            isFavorite: comp.isFavorite,
            lastUsed: comp.lastUsed
          }))
        })
      }
    ),
    { name: 'CompositionStore' }
  )
);
