/**
 * PlayerCard Component
 *
 * Displays individual player information:
 * - Avatar and name
 * - Seat position
 * - Chip count with ChipDisplay
 * - Chip distribution chart
 * - Selection highlight
 */

import React from 'react';
import type { HandPlayer } from '@/types';
import { ChipDisplay } from './ChipDisplay';
import { ChipChart } from './ChipChart';

interface PlayerCardProps {
  /** Player data */
  player: HandPlayer;

  /** Total chips in play */
  totalChips: number;

  /** Is player selected */
  isSelected?: boolean;

  /** Selection callback */
  onSelect?: (position: number) => void;
}

/**
 * Get player initials from name
 */
function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Get status badge style
 */
function getStatusStyle(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-broadcast-success/20 text-broadcast-success';
    case 'all_in':
      return 'bg-broadcast-warning/20 text-broadcast-warning';
    case 'folded':
      return 'bg-gray-700 text-gray-300';
    case 'sitting_out':
      return 'bg-gray-800 text-gray-500';
    default:
      return 'bg-gray-700 text-gray-300';
  }
}

/**
 * Get status label
 */
function getStatusLabel(status: string): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'all_in':
      return 'All In';
    case 'folded':
      return 'Folded';
    case 'sitting_out':
      return 'Out';
    default:
      return status;
  }
}

export function PlayerCard({
  player,
  totalChips,
  isSelected = false,
  onSelect
}: PlayerCardProps) {
  const chipChange = player.endStack - player.startStack;
  const borderStyle = isSelected
    ? 'border-2 border-broadcast-accent'
    : 'border border-broadcast-border';

  const handleClick = () => {
    if (onSelect) {
      onSelect(player.position);
    }
  };

  return (
    <div
      className={`bg-broadcast-card ${borderStyle} rounded-lg p-4 cursor-pointer hover:border-gray-500 transition-colors`}
      onClick={handleClick}
      data-testid={`player-card-${player.position}`}
    >
      {/* Header: Avatar + Name + Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div
            className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-bold"
            data-testid="player-avatar"
          >
            {player.avatarUrl ? (
              <img
                src={player.avatarUrl}
                alt={player.playerName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(player.playerName)
            )}
          </div>

          {/* Name and Seat */}
          <div>
            <div
              className="font-bold text-white"
              data-testid="player-name"
            >
              {player.playerName}
            </div>
            <div
              className="text-xs text-gray-400"
              data-testid="player-seat"
            >
              Seat {player.position}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${getStatusStyle(
            player.status
          )}`}
          data-testid="player-status"
        >
          {getStatusLabel(player.status)}
        </span>
      </div>

      {/* Chip Display */}
      <ChipDisplay
        amount={player.endStack}
        change={chipChange}
        bbs={player.bbs}
      />

      {/* Chip Chart */}
      <div className="mt-2">
        <ChipChart amount={player.endStack} totalChips={totalChips} />
      </div>
    </div>
  );
}
