/**
 * ChipChart Component
 *
 * Displays chip distribution as a progress bar
 * Shows percentage relative to total chips
 */

import React from 'react';

interface ChipChartProps {
  /** Current chip amount */
  amount: number;

  /** Total chip pool */
  totalChips: number;

  /** Show percentage label */
  showLabel?: boolean;
}

/**
 * Get color based on chip percentage
 */
function getChipColor(percentage: number): string {
  if (percentage >= 70) return 'bg-broadcast-success';
  if (percentage >= 50) return 'bg-broadcast-warning';
  return 'bg-broadcast-danger';
}

export function ChipChart({
  amount,
  totalChips,
  showLabel = false
}: ChipChartProps) {
  const percentage = totalChips > 0 ? (amount / totalChips) * 100 : 0;
  const color = getChipColor(percentage);

  return (
    <div className="space-y-1" data-testid="chip-chart">
      {/* Progress bar */}
      <div className="w-full bg-broadcast-bg rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
          data-testid="chip-chart-bar"
        />
      </div>

      {/* Optional percentage label */}
      {showLabel && (
        <div className="text-xs text-gray-400 text-right">
          {percentage.toFixed(1)}%
        </div>
      )}
    </div>
  );
}
