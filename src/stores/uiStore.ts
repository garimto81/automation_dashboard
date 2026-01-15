/**
 * UI Store
 *
 * Main Dashboard UI state management
 * Manages active tab, sidebar, modals, and UI preferences
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type TabName = 'hands' | 'cuesheet' | 'players' | 'monitor';
export type ModalName = 'playerDetail' | 'cueItemEdit' | 'confirmDelete';

interface UIState {
  // State
  activeTab: TabName;
  sidebarCollapsed: boolean;
  modals: Record<string, boolean>;
  modalParams: Record<string, unknown>;

  // Actions
  setActiveTab: (tab: TabName) => void;
  toggleSidebar: () => void;
  openModal: (name: ModalName, params?: Record<string, unknown>) => void;
  closeModal: (name: ModalName) => void;
  closeAllModals: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      immer((set) => ({
        // State
        activeTab: 'hands',
        sidebarCollapsed: false,
        modals: {},
        modalParams: {},

        // Actions
        setActiveTab: (tab) =>
          set((state) => {
            state.activeTab = tab;
          }, false, 'setActiveTab'),

        toggleSidebar: () =>
          set((state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
          }, false, 'toggleSidebar'),

        openModal: (name, params = {}) =>
          set((state) => {
            state.modals[name] = true;
            state.modalParams[name] = params;
          }, false, 'openModal'),

        closeModal: (name) =>
          set((state) => {
            state.modals[name] = false;
            delete state.modalParams[name];
          }, false, 'closeModal'),

        closeAllModals: () =>
          set((state) => {
            state.modals = {};
            state.modalParams = {};
          }, false, 'closeAllModals')
      })),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          activeTab: state.activeTab,
          sidebarCollapsed: state.sidebarCollapsed
        })
      }
    ),
    { name: 'UIStore' }
  )
);
