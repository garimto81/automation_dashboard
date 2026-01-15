/**
 * QueueControls Component
 *
 * Queue control buttons (Pause/Resume, Clear All)
 */

import React from 'react';
import { Button } from '@/components/ui';

export interface QueueControlsProps {
  isPaused: boolean;
  completedCount: number;
  onPause: () => void;
  onResume: () => void;
  onClearCompleted: () => void;
}

export function QueueControls({
  isPaused,
  completedCount,
  onPause,
  onResume,
  onClearCompleted
}: QueueControlsProps) {
  return (
    <div className="flex items-center space-x-2" data-testid="queue-controls">
      {/* Pause/Resume */}
      {isPaused ? (
        <Button
          variant="success"
          size="sm"
          onClick={onResume}
          data-testid="resume-btn"
        >
          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Resume Queue
        </Button>
      ) : (
        <Button
          variant="warning"
          size="sm"
          onClick={onPause}
          data-testid="pause-btn"
        >
          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pause Queue
        </Button>
      )}

      {/* Clear Completed */}
      {completedCount > 0 && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onClearCompleted}
          data-testid="clear-completed-btn"
        >
          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear Completed ({completedCount})
        </Button>
      )}
    </div>
  );
}
