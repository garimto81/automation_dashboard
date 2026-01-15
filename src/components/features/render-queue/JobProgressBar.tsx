/**
 * JobProgressBar Component
 *
 * Progress bar with percentage and estimated time remaining
 */

import React from 'react';
import { Progress } from '@/components/ui';

export interface JobProgressBarProps {
  progress: number;
  estimatedRemaining?: number;
}

function formatTime(seconds?: number): string {
  if (!seconds || seconds <= 0) return 'Unknown';

  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  return `${minutes}m ${remainingSeconds}s`;
}

export function JobProgressBar({ progress, estimatedRemaining }: JobProgressBarProps) {
  return (
    <div data-testid="job-progress-bar">
      <Progress value={progress} variant="success" size="md" showLabel />
      {estimatedRemaining && estimatedRemaining > 0 && (
        <div className="mt-1 text-xs text-gray-400" data-testid="estimated-time">
          Estimated: {formatTime(estimatedRemaining)} remaining
        </div>
      )}
    </div>
  );
}
