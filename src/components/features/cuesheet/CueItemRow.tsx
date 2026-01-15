/**
 * CueItemRow Component
 *
 * Individual cue item row with composition info, status, and actions
 */

import React from 'react';
import type { CueItem } from '@/types';
import { useCuesheetStore } from '@/stores/cuesheetStore';

interface CueItemRowProps {
  item: CueItem;
  index: number;
  isSelected: boolean;
}

export const CueItemRow: React.FC<CueItemRowProps> = ({ item, index, isSelected }) => {
  const { selectItem, updateItem, deleteItem } = useCuesheetStore();

  const handleClick = () => {
    selectItem(item.cueItemId);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete cue item "${item.compositionName}"?`)) {
      deleteItem(item.cueItemId);
    }
  };

  const getStatusBadge = (status: CueItem['status']) => {
    const badges = {
      draft: 'bg-gray-600/20 text-gray-400',
      ready: 'bg-blue-600/20 text-blue-400',
      queued: 'bg-yellow-600/20 text-yellow-400',
      rendering: 'bg-green-600/20 text-green-400 animate-pulse',
      completed: 'bg-green-600/20 text-green-400',
      failed: 'bg-red-600/20 text-red-400',
      cancelled: 'bg-gray-600/20 text-gray-500',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badges[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: CueItem['type']) => {
    const badges = {
      chip_display: 'bg-blue-600/30 text-blue-300',
      payout: 'bg-purple-600/30 text-purple-300',
      event_info: 'bg-green-600/30 text-green-300',
      player_info: 'bg-cyan-600/30 text-cyan-300',
      schedule: 'bg-orange-600/30 text-orange-300',
      staff: 'bg-pink-600/30 text-pink-300',
      elimination: 'bg-red-600/30 text-red-300',
      transition: 'bg-indigo-600/30 text-indigo-300',
      other: 'bg-gray-600/30 text-gray-300',
    };

    return (
      <span className={`px-2 py-0.5 rounded text-xs ${badges[type]}`}>
        {type}
      </span>
    );
  };

  const getPriorityColor = (priority: number) => {
    if (priority === 1) return 'text-red-400';
    if (priority <= 3) return 'text-yellow-400';
    return 'text-gray-400';
  };

  return (
    <tr
      onClick={handleClick}
      className={`
        cursor-pointer transition-colors hover:bg-broadcast-bg
        ${isSelected ? 'bg-blue-600/10 border-l-2 border-l-blue-500' : ''}
      `}
      data-testid={`cue-item-row-${item.cueItemId}`}
    >
      {/* Order */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 font-mono text-xs">{index + 1}</span>
          {/* Drag handle placeholder */}
          <svg
            className="w-4 h-4 text-gray-600 cursor-grab"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
      </td>

      {/* Composition Name */}
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="text-white font-medium">{item.compositionName}</span>
          {item.notes && (
            <span className="text-xs text-gray-500 truncate max-w-xs">{item.notes}</span>
          )}
        </div>
      </td>

      {/* Type */}
      <td className="px-4 py-3">{getTypeBadge(item.type)}</td>

      {/* Hand Number */}
      <td className="px-4 py-3">
        <span className="text-white font-mono">#{item.handNum}</span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">{getStatusBadge(item.status)}</td>

      {/* Priority */}
      <td className="px-4 py-3">
        <span className={`font-bold ${getPriorityColor(item.priority)}`}>
          {item.priority}
        </span>
      </td>

      {/* Timecode */}
      <td className="px-4 py-3">
        <span className="text-gray-400 font-mono text-xs">
          {item.timecode || '—'}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Edit modal
              console.log('Edit', item.cueItemId);
            }}
            className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
            title="Edit"
            data-testid="edit-button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
            title="Delete"
            data-testid="delete-button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};
