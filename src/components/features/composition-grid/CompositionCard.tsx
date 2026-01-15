/**
 * CompositionCard Component
 *
 * Individual composition card with thumbnail, name, category, and slot count
 */

import React from 'react';
import type { Composition } from '@/types';
import { useCompositionStore } from '@/stores/compositionStore';

interface CompositionCardProps {
  composition: Composition;
}

export const CompositionCard: React.FC<CompositionCardProps> = ({ composition }) => {
  const { selectedId, selectComposition, toggleFavorite } = useCompositionStore();

  const isSelected = composition.id === selectedId;

  const handleClick = () => {
    selectComposition(composition.id);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(composition.id);
  };

  const getCategoryColor = (category: Composition['category']) => {
    const colors = {
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

    return colors[category];
  };

  return (
    <div
      onClick={handleClick}
      className={`
        rounded-lg p-3 cursor-pointer transition-all
        ${
          isSelected
            ? 'bg-blue-600/20 border-2 border-blue-500 shadow-lg shadow-blue-500/20'
            : 'bg-broadcast-bg border border-broadcast-border hover:border-blue-500'
        }
      `}
      data-testid={`composition-card-${composition.id}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-800 rounded mb-2 flex items-center justify-center overflow-hidden">
        {composition.thumbnailPath ? (
          <img
            src={composition.thumbnailPath}
            alt={composition.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            className="w-8 h-8 text-gray-600"
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
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-2 right-2 p-1 bg-black/50 rounded hover:bg-black/70 transition-colors"
          data-testid="favorite-button"
        >
          <svg
            className={`w-4 h-4 ${
              composition.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      </div>

      {/* Composition Name */}
      <h3
        className={`text-xs font-semibold mb-1 truncate ${
          isSelected ? 'text-white' : 'text-gray-300'
        }`}
        title={composition.name}
      >
        {composition.name}
      </h3>

      {/* Category & Slot Count */}
      <div className="flex items-center justify-between text-xs">
        <span className={`px-2 py-0.5 rounded ${getCategoryColor(composition.category)}`}>
          {composition.category}
        </span>
        <span className={isSelected ? 'text-gray-300' : 'text-gray-500'}>
          {composition.slotCount} {composition.slotCount === 1 ? 'slot' : 'slots'}
        </span>
      </div>

      {/* Additional Info (optional) */}
      {composition.description && (
        <p className="text-xs text-gray-500 mt-2 truncate" title={composition.description}>
          {composition.description}
        </p>
      )}
    </div>
  );
};
