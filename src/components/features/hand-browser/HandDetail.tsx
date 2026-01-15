/**
 * HandDetail Component
 *
 * Detailed view of selected hand
 * Features:
 * - Board cards display
 * - Player list with chip stacks
 * - Action timeline
 */

import type { Hand, HandAction } from '@/types';
import { BoardCards } from './BoardCards';

interface HandDetailProps {
  /** Hand to display */
  hand: Hand;
}

/**
 * Format chip amount
 */
function formatChips(amount: number): string {
  return amount.toLocaleString();
}

/**
 * Format action for display
 */
function formatAction(action: HandAction): string {
  const { action: type, amount } = action;

  switch (type) {
    case 'fold':
      return 'Fold';
    case 'check':
      return 'Check';
    case 'call':
      return amount ? `Call $${formatChips(amount)}` : 'Call';
    case 'bet':
      return amount ? `Bet $${formatChips(amount)}` : 'Bet';
    case 'raise':
      return amount ? `Raise to $${formatChips(amount)}` : 'Raise';
    case 'all_in':
      return amount ? `All-in $${formatChips(amount)}` : 'All-in';
    case 'post_sb':
      return 'Post SB';
    case 'post_bb':
      return 'Post BB';
    case 'post_ante':
      return 'Post Ante';
    default:
      return type;
  }
}

export function HandDetail({ hand }: HandDetailProps) {
  return (
    <div className="space-y-6" data-testid="hand-detail">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">
          Hand #{hand.handNum}
        </h3>
        <span
          className={`px-3 py-1 text-sm font-medium rounded ${
            hand.status === 'active'
              ? 'bg-broadcast-success/20 text-broadcast-success'
              : 'bg-gray-700 text-gray-300'
          }`}
        >
          {hand.status === 'active' ? 'Active' : 'Completed'}
        </span>
      </div>

      {/* Board Cards */}
      <div className="bg-broadcast-card border border-broadcast-border rounded-lg p-6">
        <div className="text-sm text-gray-400 mb-3">Board Cards</div>
        <BoardCards boardCards={hand.boardCards} />
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-gray-400">Total Pot</span>
          <span className="font-mono text-white font-bold text-lg">
            ${formatChips(hand.pot)}
          </span>
        </div>
      </div>

      {/* Players */}
      <div className="bg-broadcast-card border border-broadcast-border rounded-lg p-6">
        <h4 className="text-lg font-bold text-white mb-4">Players</h4>
        <div className="space-y-3">
          {hand.players.map((player) => (
            <div
              key={player.position}
              className="flex items-center justify-between p-3 bg-broadcast-bg rounded-lg"
              data-testid={`player-${player.position}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-bold text-sm">
                  {player.position}
                </div>
                <div>
                  <div className="font-bold text-white">{player.playerName}</div>
                  <div className="text-xs text-gray-400">
                    Seat {player.position}
                    {player.holeCards && (
                      <span className="ml-2 text-broadcast-accent">
                        {player.holeCards.join(' ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-white font-bold">
                  ${formatChips(player.endStack)}
                </div>
                <div className="text-xs text-gray-400">
                  {player.bbs.toFixed(1)} BB
                </div>
                {player.isWinner && (
                  <div className="text-xs text-broadcast-success font-medium mt-1">
                    Winner
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Timeline */}
      <div className="bg-broadcast-card border border-broadcast-border rounded-lg p-6">
        <h4 className="text-lg font-bold text-white mb-4">Action Timeline</h4>
        {hand.actions.length === 0 ? (
          <p className="text-gray-400 text-sm">No actions recorded yet</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {hand.actions
              .sort((a, b) => a.sequence - b.sequence)
              .map((action) => {
                const player = hand.players.find(
                  (p) => p.position === action.position
                );

                return (
                  <div
                    key={action.actionId}
                    className="flex items-center justify-between p-3 bg-broadcast-bg rounded-lg text-sm"
                    data-testid={`action-${action.sequence}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-500 font-mono w-8">
                        #{action.sequence}
                      </span>
                      <span className="text-white font-medium">
                        {player?.playerName || `Seat ${action.position}`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-400 uppercase text-xs">
                        {action.street}
                      </span>
                      <span className="text-broadcast-accent font-medium">
                        {formatAction(action)}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
