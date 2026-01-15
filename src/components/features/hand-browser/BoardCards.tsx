/**
 * BoardCards Component
 *
 * Displays poker board cards (Flop, Turn, River)
 * Features:
 * - 5 card display with suit colors (♠♣ black, ♥♦ red)
 * - Empty slots for unrevealed cards
 */

import type { BoardCards as BoardCardsType } from '@/types';

interface BoardCardsProps {
  /** Board cards data */
  boardCards: BoardCardsType;
}

/**
 * Parse card string and determine suit color
 * @param card - Card string (e.g., "A♠", "K♥")
 * @returns Object with rank, suit, and color class
 */
function parseCard(card: string) {
  const rank = card.slice(0, -1);
  const suit = card.slice(-1);
  const isRed = suit === '♥' || suit === '♦';

  return {
    rank,
    suit,
    colorClass: isRed ? 'text-red-600' : 'text-black'
  };
}

export function BoardCards({ boardCards }: BoardCardsProps) {
  // Build array of 5 cards (flop 3 + turn 1 + river 1)
  const cards: (string | null)[] = [
    ...(boardCards.flop || [null, null, null]),
    boardCards.turn || null,
    boardCards.river || null
  ];

  return (
    <div className="flex space-x-1" data-testid="board-cards">
      {cards.map((card, index) => {
        if (!card) {
          // Empty card slot
          return (
            <div
              key={index}
              className="w-10 h-14 bg-gray-700 rounded"
              data-testid={`card-slot-${index}`}
            />
          );
        }

        const { rank, suit, colorClass } = parseCard(card);

        return (
          <div
            key={index}
            className={`w-10 h-14 bg-white rounded text-center flex items-center justify-center font-bold text-lg ${colorClass}`}
            data-testid={`card-${index}`}
          >
            {rank}
            {suit}
          </div>
        );
      })}
    </div>
  );
}
