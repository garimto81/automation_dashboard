/**
 * HandBrowser Component
 *
 * Main container for hand browsing feature
 * Features:
 * - Horizontal scrollable hand list
 * - Selected hand detail view
 * - Integration with sessionStore and realtimeStore
 */

import { useState, useEffect } from 'react';
import { useSessionStore } from '@/stores/sessionStore';
import { useRealtimeStore } from '@/stores/realtimeStore';
import type { Hand } from '@/types';
import { HandList } from './HandList';
import { HandDetail } from './HandDetail';

export function HandBrowser() {
  const { sessionId, currentHandId } = useSessionStore();
  const [hands, setHands] = useState<Hand[]>([]);
  const [selectedHandId, setSelectedHandId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-select current hand when it changes
  useEffect(() => {
    if (currentHandId) {
      setSelectedHandId(currentHandId);
    }
  }, [currentHandId]);

  // Load hands for current session
  useEffect(() => {
    if (!sessionId) {
      setHands([]);
      setSelectedHandId(null);
      return;
    }

    // TODO: Fetch hands from Supabase
    // For now, using mock data
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockHands: Hand[] = [
        {
          handId: 'hand-147',
          sessionId: sessionId,
          handNum: 147,
          gameType: 'cash',
          smallBlind: 500,
          bigBlind: 1000,
          pot: 124500,
          boardCards: {
            flop: ['A♦', 'K♠', 'Q♥']
          },
          players: [
            {
              position: 1,
              playerName: 'Daniel Negreanu',
              startStack: 1000000,
              endStack: 1124500,
              bbs: 112.45,
              isWinner: false,
              status: 'active'
            },
            {
              position: 2,
              playerName: 'Phil Hellmuth',
              startStack: 1099500,
              endStack: 987500,
              bbs: 98.75,
              isWinner: false,
              status: 'active'
            }
          ],
          actions: [],
          startTime: new Date(),
          status: 'active',
          buttonPosition: 1
        },
        {
          handId: 'hand-146',
          sessionId: sessionId,
          handNum: 146,
          gameType: 'cash',
          smallBlind: 500,
          bigBlind: 1000,
          pot: 89200,
          boardCards: {
            flop: ['7♣', '7♠', '2♥'],
            turn: 'J♠',
            river: '3♦'
          },
          players: [
            {
              position: 1,
              playerName: 'Daniel Negreanu',
              startStack: 910800,
              endStack: 1000000,
              bbs: 100,
              isWinner: true,
              winnings: 89200,
              status: 'active'
            }
          ],
          actions: [],
          startTime: new Date(),
          endTime: new Date(),
          status: 'completed',
          buttonPosition: 9
        }
      ];

      setHands(mockHands);
      setIsLoading(false);
    }, 500);
  }, [sessionId]);

  // Get selected hand
  const selectedHand = hands.find((h) => h.handId === selectedHandId);

  return (
    <div className="space-y-6" data-testid="hand-browser">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Recent Hands</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search hand #..."
            className="bg-broadcast-bg border border-broadcast-border rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-broadcast-accent w-64"
            data-testid="hand-search"
          />
          <button
            className="px-4 py-2 bg-broadcast-bg border border-broadcast-border rounded-lg text-sm text-gray-300 hover:bg-broadcast-border"
            data-testid="hand-filter"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading hands...</div>
        </div>
      )}

      {/* Hand list */}
      {!isLoading && (
        <HandList
          hands={hands}
          selectedHandId={selectedHandId}
          onSelectHand={setSelectedHandId}
        />
      )}

      {/* Selected hand detail */}
      {selectedHand && (
        <div className="mt-8">
          <HandDetail hand={selectedHand} />
        </div>
      )}

      {/* No selection state */}
      {!selectedHand && !isLoading && hands.length > 0 && (
        <div className="flex items-center justify-center h-64 bg-broadcast-card border border-broadcast-border rounded-lg">
          <p className="text-gray-400">Select a hand to view details</p>
        </div>
      )}
    </div>
  );
}
