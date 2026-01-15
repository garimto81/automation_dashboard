/**
 * PlayerGrid Component
 *
 * 3x3 grid layout displaying up to 9 players
 * Integrates with sessionStore for real-time updates
 */

import React, { useState, useEffect } from 'react';
import type { HandPlayer } from '@/types';
import { PlayerCard } from './PlayerCard';

interface PlayerGridProps {
  /** Players to display (max 9) */
  players: HandPlayer[];

  /** Optional callback when player is selected */
  onPlayerSelect?: (position: number) => void;

  /** Show refresh button */
  showRefresh?: boolean;

  /** Refresh callback */
  onRefresh?: () => void;
}

export function PlayerGrid({
  players,
  onPlayerSelect,
  showRefresh = true,
  onRefresh
}: PlayerGridProps) {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  // Calculate total chips for percentage display
  const totalChips = players.reduce(
    (sum, player) => sum + player.endStack,
    0
  );

  // Ensure max 9 players
  const displayPlayers = players.slice(0, 9);

  // Fill empty slots if less than 9 players
  const gridSlots = Array.from({ length: 9 }, (_, index) => {
    return displayPlayers[index] || null;
  });

  const handlePlayerSelect = (position: number) => {
    setSelectedPosition(position);
    if (onPlayerSelect) {
      onPlayerSelect(position);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <section data-testid="player-grid">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Player Chip Count</h2>
        {showRefresh && (
          <button
            onClick={handleRefresh}
            className="text-sm text-broadcast-accent hover:underline"
            data-testid="refresh-button"
          >
            Refresh Data
          </button>
        )}
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-4">
        {gridSlots.map((player, index) =>
          player ? (
            <PlayerCard
              key={player.position}
              player={player}
              totalChips={totalChips}
              isSelected={selectedPosition === player.position}
              onSelect={handlePlayerSelect}
            />
          ) : (
            <div
              key={`empty-${index}`}
              className="bg-broadcast-card border border-broadcast-border border-dashed rounded-lg p-4 flex items-center justify-center"
              data-testid={`empty-slot-${index + 1}`}
            >
              <span className="text-gray-600 text-sm">Empty Seat</span>
            </div>
          )
        )}
      </div>

      {/* Player Count Info */}
      {players.length > 0 && (
        <div className="mt-4 text-sm text-gray-400" data-testid="player-count">
          {players.length} player{players.length !== 1 ? 's' : ''} active
        </div>
      )}
    </section>
  );
}
