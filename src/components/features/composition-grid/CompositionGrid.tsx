/**
 * CompositionGrid Component
 *
 * Displays 26 AE compositions in 6-column grid
 * Integrates with CategoryFilter and compositionStore
 */

import React from 'react';
import { useCompositionStore } from '@/stores/compositionStore';
import { CompositionCard } from './CompositionCard';
import { CategoryFilter } from './CategoryFilter';

export const CompositionGrid: React.FC = () => {
  const { getFilteredCompositions, filter } = useCompositionStore();

  const compositions = getFilteredCompositions();

  return (
    <div className="flex flex-col h-full space-y-4" data-testid="composition-grid">
      {/* Category Filter */}
      <CategoryFilter />

      {/* Composition Cards Grid */}
      <div className="flex-1 bg-broadcast-panel rounded-lg border border-broadcast-border overflow-hidden">
        <div className="p-4 h-full overflow-y-auto scrollbar-thin">
          {compositions.length === 0 ? (
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
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
                <p className="text-gray-400 text-sm">No compositions found</p>
                <p className="text-gray-500 text-xs mt-1">
                  {filter.search
                    ? `No results for "${filter.search}"`
                    : 'Try changing your filters'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
              {compositions.map((composition) => (
                <CompositionCard key={composition.id} composition={composition} />
              ))}
            </div>
          )}
        </div>
      </div>

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
