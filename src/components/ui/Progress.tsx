/**
 * Progress Component
 *
 * Progress bar with percentage display
 */

import React from 'react';

export interface ProgressProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3'
};

const variantClasses: Record<string, string> = {
  primary: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500'
};

export function Progress({
  value,
  size = 'md',
  showLabel = true,
  variant = 'primary',
  className = ''
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, value));

  return (
    <div className={className} data-testid="progress">
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span data-testid="progress-value">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${variantClasses[variant]} ${sizeClasses[size]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
          data-testid="progress-bar"
        />
      </div>
    </div>
  );
}
