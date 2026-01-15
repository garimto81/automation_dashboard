/**
 * ChipDisplay Component
 *
 * Displays chip count with formatting and BB conversion
 * Shows +/- change with color coding
 */

import React from 'react';

interface ChipDisplayProps {
  /** Chip amount */
  amount: number;

  /** Change amount (+/-) */
  change: number;

  /** Stack in big blinds */
  bbs: number;

  /** Display size */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Format chip amount to readable string (2.4M, 120K)
 */
function formatChips(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}K`;
  }
  return amount.toLocaleString();
}

/**
 * Format change with sign
 */
function formatChange(change: number): string {
  const formatted = formatChips(Math.abs(change));
  return change >= 0 ? `+${formatted}` : `-${formatted}`;
}

export function ChipDisplay({
  amount,
  change,
  bbs,
  size = 'md'
}: ChipDisplayProps) {
  const changeColor =
    change > 0
      ? 'text-broadcast-success'
      : change < 0
      ? 'text-broadcast-danger'
      : 'text-gray-400';

  const chipSize = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }[size];

  return (
    <div className="space-y-2" data-testid="chip-display">
      {/* Main chip amount */}
      <div className="flex justify-between items-end">
        <span className="text-sm text-gray-400">Chips</span>
        <span className={`${chipSize} font-bold text-white font-mono`}>
          {amount.toLocaleString()}
        </span>
      </div>

      {/* BB and change */}
      <div className="flex justify-between text-xs">
        <span className="text-gray-400" data-testid="chip-display-bbs">
          BBs: {bbs.toFixed(1)}
        </span>
        <span className={changeColor} data-testid="chip-display-change">
          {formatChange(change)}
        </span>
      </div>
    </div>
  );
}
