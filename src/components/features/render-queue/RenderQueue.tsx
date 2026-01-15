/**
 * RenderQueue Component
 *
 * Main render queue container with Active, Queued, and Completed sections
 */

import React from 'react';
import { useRenderQueueStore } from '@/stores/renderQueueStore';
import { Card } from '@/components/ui';
import { RenderJobCard } from './RenderJobCard';
import { QueueControls } from './QueueControls';

export function RenderQueue() {
  const {
    isPaused,
    getActiveJobs,
    getPendingJobs,
    getCompletedJobs,
    cancelJob,
    retryJob,
    pauseQueue,
    resumeQueue,
    clearCompleted
  } = useRenderQueueStore();

  const activeJobs = getActiveJobs();
  const pendingJobs = getPendingJobs();
  const completedJobs = getCompletedJobs();

  return (
    <div className="space-y-6" data-testid="render-queue">
      {/* Queue Controls */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Render Queue</h2>
            <p className="text-xs text-gray-400 mt-1">
              {activeJobs.length} Active, {pendingJobs.length} Queued, {completedJobs.length} Completed
            </p>
          </div>
          <QueueControls
            isPaused={isPaused}
            completedCount={completedJobs.length}
            onPause={pauseQueue}
            onResume={resumeQueue}
            onClearCompleted={clearCompleted}
          />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Active Jobs */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">
            Active Renders ({activeJobs.length})
          </h3>
          <div className="space-y-3">
            {activeJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No active render jobs
              </div>
            ) : (
              activeJobs.map((job) => (
                <RenderJobCard
                  key={job.jobId}
                  job={job}
                  onCancel={cancelJob}
                />
              ))
            )}
          </div>
        </Card>

        {/* Queued Jobs */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">
            Queued ({pendingJobs.length})
          </h3>
          <div className="space-y-3">
            {pendingJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No queued jobs
              </div>
            ) : (
              pendingJobs.slice(0, 5).map((job) => (
                <RenderJobCard
                  key={job.jobId}
                  job={job}
                  onCancel={cancelJob}
                />
              ))
            )}
            {pendingJobs.length > 5 && (
              <div className="text-center text-xs text-gray-500 py-2">
                +{pendingJobs.length - 5} more jobs
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Completed Jobs */}
      {completedJobs.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">
            Completed ({completedJobs.length})
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {completedJobs.slice(0, 9).map((job) => (
              <RenderJobCard
                key={job.jobId}
                job={job}
                onRetry={job.status === 'failed' ? retryJob : undefined}
              />
            ))}
          </div>
          {completedJobs.length > 9 && (
            <div className="text-center text-xs text-gray-500 py-2 mt-3">
              +{completedJobs.length - 9} more completed jobs
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
