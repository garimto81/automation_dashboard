/**
 * HandCard Component
 *
 * Individual hand card in horizontal scroll list
 * Features:
 * - Hand number, pot, player count display
 * - Active/Completed status badge
 * - Click to select
 * - Visual highlight when selected
 */

import type { Hand } from '@/types';
import { BoardCards } from './BoardCards';

interface HandCardProps {
  /** Hand data */
  hand: Hand;

  /** Whether this hand is selected */
  isSelected: boolean;

  /** Click handler */
  onClick: () => void;
}

/**
 * Format pot amount to readable string
 * @param amount - Pot amount
 * @returns Formatted string (e.g., "$124,500")
 */
function formatPot(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

export function HandCard({ hand, isSelected, onClick }: HandCardProps) {
  const isActive = hand.status === 'active';
  const activePlayers = hand.players.filter((p) => p.status === 'active').length;

  // Determine winner for completed hands
  const winner = hand.status === 'completed'
    ? hand.players.find((p) => p.isWinner)?.playerName
    : null;

  // Determine current street based on board cards
  const getCurrentStreet = () => {
    if (hand.boardCards.river) return 'River';
    if (hand.boardCards.turn) return 'Turn';
    if (hand.boardCards.flop) return 'Flop';
    return 'Preflop';
  };

  return (
    <div
      className={`w-80 bg-broadcast-card rounded-lg p-4 cursor-pointer transition-all ${
        isSelected
          ? 'border-2 border-broadcast-accent'
          : 'border border-broadcast-border hover:border-gray-500'
      }`}
      onClick={onClick}
      data-testid={`hand-card-${hand.handNum}`}
    >
      {/* Header: Hand number + Status badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-gray-400" data-testid="hand-number">
          #{hand.handNum}
        </span>
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${
            isActive
              ? 'bg-broadcast-success/20 text-broadcast-success'
              : 'bg-gray-700 text-gray-300'
          }`}
          data-testid="hand-status"
        >
          {isActive ? 'Active' : 'Completed'}
        </span>
      </div>

      {/* Board cards */}
      <div className="mb-3">
        <div className="text-sm text-gray-400 mb-1">Board</div>
        <BoardCards boardCards={hand.boardCards} />
      </div>

      {/* Hand info */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Pot</span>
          <span className="font-mono text-white font-bold" data-testid="hand-pot">
            {formatPot(hand.pot)}
          </span>
        </div>

        {isActive ? (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Players</span>
              <span className="text-white" data-testid="active-players">
                {activePlayers} active
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Stage</span>
              <span className="text-white" data-testid="current-street">
                {getCurrentStreet()}
              </span>
            </div>
          </>
        ) : (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Winner</span>
            <span className="text-broadcast-success" data-testid="hand-winner">
              {winner || 'N/A'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
