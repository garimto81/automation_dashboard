/**
 * CategoryFilter Component
 *
 * Filter compositions by category with button pills
 * Shows count for each category
 */

import React from 'react';
import { useCompositionStore } from '@/stores/compositionStore';
import type { CompositionCategory } from '@/types';

export const CategoryFilter: React.FC = () => {
  const { compositions, filter, setFilter } = useCompositionStore();

  const categories: Array<{ key: CompositionCategory | 'all'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'chip_display', label: 'Chip Display' },
    { key: 'payout', label: 'Payout' },
    { key: 'event_info', label: 'Event Info' },
    { key: 'player_info', label: 'Player Info' },
    { key: 'schedule', label: 'Schedule' },
    { key: 'staff', label: 'Staff' },
    { key: 'elimination', label: 'Elimination' },
    { key: 'transition', label: 'Transition' },
    { key: 'other', label: 'Other' },
  ];

  const getCategoryCount = (category: CompositionCategory | 'all') => {
    if (category === 'all') return compositions.length;
    return compositions.filter((comp) => comp.category === category).length;
  };

  const handleCategoryClick = (category: CompositionCategory | 'all') => {
    setFilter({ category });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ search: e.target.value });
  };

  const handleFavoritesToggle = () => {
    setFilter({ favorites: !filter.favorites });
  };

  return (
    <div className="bg-broadcast-panel rounded-lg border border-broadcast-border p-4" data-testid="category-filter">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white">Composition Library</h2>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-400">{compositions.length} Compositions</span>

          {/* Favorites Toggle */}
          <button
            onClick={handleFavoritesToggle}
            className={`
              p-1.5 rounded transition-colors
              ${
                filter.favorites
                  ? 'bg-yellow-600/20 text-yellow-400'
                  : 'bg-broadcast-bg text-gray-400 hover:text-yellow-400'
              }
            `}
            title={filter.favorites ? 'Show all' : 'Show favorites only'}
            data-testid="favorites-toggle"
          >
            <svg className="w-4 h-4" fill={filter.favorites ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search compositions..."
          value={filter.search}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 bg-broadcast-bg border border-broadcast-border rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          data-testid="search-input"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const count = getCategoryCount(category.key);
          const isActive = filter.category === category.key;

          return (
            <button
              key={category.key}
              onClick={() => handleCategoryClick(category.key)}
              disabled={count === 0}
              className={`
                px-3 py-1.5 text-xs rounded-full font-medium transition-colors
                ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : count > 0
                    ? 'bg-broadcast-bg text-gray-400 hover:bg-gray-700'
                    : 'bg-broadcast-bg text-gray-600 cursor-not-allowed'
                }
              `}
              data-testid={`category-button-${category.key}`}
            >
              {category.label} ({count})
            </button>
          );
        })}
      </div>
    </div>
  );
};
