/**
 * CueItemList Component
 *
 * Displays list of cue items in table format
 * Supports drag-and-drop reordering (placeholder)
 */

import React from 'react';
import { useCuesheetStore } from '@/stores/cuesheetStore';
import { CueItemRow } from './CueItemRow';

export const CueItemList: React.FC = () => {
  const { items, selectedItemId } = useCuesheetStore();

  return (
    <div className="h-full overflow-y-auto scrollbar-thin" data-testid="cue-item-list">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-broadcast-panel border-b border-broadcast-border z-10">
          <tr className="text-left">
            <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase w-12">
              Order
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">
              Composition
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">
              Type
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">
              Hand #
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">
              Status
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">
              Priority
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">
              Timecode
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase w-32">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-broadcast-border">
          {items.map((item, index) => (
            <CueItemRow
              key={item.cueItemId}
              item={item}
              index={index}
              isSelected={item.cueItemId === selectedItemId}
            />
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #141822;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};
