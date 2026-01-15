/**
 * HandList Component
 *
 * Horizontal scrollable list of hand cards
 * Features:
 * - Renders HandCard components
 * - Highlights current/selected hand
 * - Smooth horizontal scroll
 */

import type { Hand } from '@/types';
import { HandCard } from './HandCard';

interface HandListProps {
  /** Array of hands to display */
  hands: Hand[];

  /** Currently selected hand ID */
  selectedHandId: string | null;

  /** Handler when hand is selected */
  onSelectHand: (handId: string) => void;
}

export function HandList({ hands, selectedHandId, onSelectHand }: HandListProps) {
  if (hands.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-64 bg-broadcast-card border border-broadcast-border rounded-lg"
        data-testid="hand-list-empty"
      >
        <div className="text-center">
          <p className="text-gray-400 text-lg">No hands available</p>
          <p className="text-gray-500 text-sm mt-2">
            Hands will appear here when a session is active
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4" data-testid="hand-list">
      <div className="flex space-x-4 min-w-max">
        {hands.map((hand) => (
          <HandCard
            key={hand.handId}
            hand={hand}
            isSelected={hand.handId === selectedHandId}
            onClick={() => onSelectHand(hand.handId)}
          />
        ))}
      </div>
    </div>
  );
}
