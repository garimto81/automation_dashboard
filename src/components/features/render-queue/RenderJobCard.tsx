/**
 * RenderJobCard Component
 *
 * Individual render job card with composition info, progress, and actions
 */

import React from 'react';
import type { RenderJob } from '@/types';
import { Badge, Button } from '@/components/ui';
import { JobProgressBar } from './JobProgressBar';

export interface RenderJobCardProps {
  job: RenderJob;
  onCancel?: (jobId: string) => void;
  onRetry?: (jobId: string) => void;
  onView?: (jobId: string) => void;
}

const statusColors: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
  pending: 'default',
  queued: 'warning',
  rendering: 'primary',
  completed: 'success',
  failed: 'danger',
  cancelled: 'default'
};

export function RenderJobCard({ job, onCancel, onRetry, onView }: RenderJobCardProps) {
  const showProgress = job.status === 'rendering' || job.status === 'queued';
  const showActions = job.status === 'rendering' || job.status === 'queued';
  const showRetry = job.status === 'failed';
  const showView = job.status === 'completed';

  return (
    <div
      className={[
        'bg-broadcast-bg rounded border p-4',
        job.status === 'rendering' ? 'border-green-500/50' : 'border-broadcast-border',
        job.status === 'failed' ? 'border-red-500/50' : ''
      ].filter(Boolean).join(' ')}
      data-testid="render-job-card"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white" data-testid="job-composition">
            {job.compositionName}
          </h3>
          <p className="text-xs text-gray-400 mt-1" data-testid="job-info">
            {job.handNum ? `Hand #${job.handNum}` : job.sessionId || 'No session'}
            {job.sessionId && ` - ${job.sessionId}`}
          </p>
        </div>
        <Badge variant={statusColors[job.status]} data-testid="job-status">
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </Badge>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-3">
          <JobProgressBar
            progress={job.progress}
            estimatedRemaining={job.estimatedRemaining}
          />
        </div>
      )}

      {/* Error Message */}
      {job.error && (
        <div className="mb-3 p-2 bg-red-600/10 border border-red-500/50 rounded">
          <p className="text-xs text-red-400" data-testid="error-message">
            {job.error.message}
          </p>
        </div>
      )}

      {/* Duration (Completed) */}
      {job.status === 'completed' && job.duration && (
        <div className="mb-3 text-xs text-gray-400">
          Completed in {Math.round(job.duration)}s
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {job.createdAt && (
            <span className="text-xs text-gray-500">
              {new Date(job.createdAt).toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {showActions && onCancel && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onCancel(job.jobId)}
              data-testid="cancel-btn"
            >
              Cancel
            </Button>
          )}
          {showRetry && onRetry && (
            <Button
              variant="warning"
              size="sm"
              onClick={() => onRetry(job.jobId)}
              data-testid="retry-btn"
            >
              Retry
            </Button>
          )}
          {showView && onView && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onView(job.jobId)}
              data-testid="view-btn"
            >
              View
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
