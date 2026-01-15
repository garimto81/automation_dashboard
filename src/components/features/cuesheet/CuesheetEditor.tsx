/**
 * CuesheetEditor Component
 *
 * Main cuesheet editing interface for Main Dashboard
 * Connects to cuesheetStore and displays list of cue items
 */

import React from 'react';
import { useCuesheetStore } from '@/stores/cuesheetStore';
import { CueItemList } from './CueItemList';

export const CuesheetEditor: React.FC = () => {
  const { cuesheetId, items, isDirty, sortOrder, saveToDb, setSortOrder } = useCuesheetStore();

  const handleSave = async () => {
    await saveToDb();
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'time' | 'priority');
  };

  return (
    <div className="flex flex-col h-full" data-testid="cuesheet-editor">
      {/* Header */}
      <div className="bg-broadcast-panel border-b border-broadcast-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-white">Cuesheet Editor</h2>
            {cuesheetId && (
              <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full">
                ID: {cuesheetId.slice(0, 8)}
              </span>
            )}
            {isDirty && (
              <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 text-sm rounded-full">
                Unsaved Changes
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Sort Order */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-400">Sort by:</label>
              <select
                value={sortOrder}
                onChange={handleSortChange}
                className="px-3 py-2 bg-broadcast-bg border border-broadcast-border rounded text-sm text-white focus:outline-none focus:border-blue-500"
                data-testid="sort-order-select"
              >
                <option value="time">Time Created</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="save-button"
            >
              Save Cuesheet
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 mt-3 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Total Items:</span>
            <span className="text-white font-medium">{items.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Completed:</span>
            <span className="text-green-400 font-medium">
              {items.filter((item) => item.status === 'completed').length}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Rendering:</span>
            <span className="text-blue-400 font-medium">
              {items.filter((item) => item.status === 'rendering').length}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Failed:</span>
            <span className="text-red-400 font-medium">
              {items.filter((item) => item.status === 'failed').length}
            </span>
          </div>
        </div>
      </div>

      {/* Cue Items List */}
      <div className="flex-1 overflow-hidden">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-gray-600 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-400 text-sm">No cue items yet</p>
              <p className="text-gray-500 text-xs mt-1">
                Add compositions from the library to start
              </p>
            </div>
          </div>
        ) : (
          <CueItemList />
        )}
      </div>
    </div>
  );
};
