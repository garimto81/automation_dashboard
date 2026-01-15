/**
 * Render Queue Store
 *
 * Sub Dashboard render queue state management
 * Manages render jobs, priorities, and job processing
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { RenderQueueState, RenderJob, RenderJobStatus } from '@/types';

const MAX_CONCURRENT = 2; // Default max concurrent renders

export const useRenderQueueStore = create<RenderQueueState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // State
        jobs: [],
        activeJobIds: [],
        selectedJobId: null,
        isPaused: false,
        maxConcurrent: MAX_CONCURRENT,

        // Actions
        addJob: (jobData) =>
          set((state) => {
            const newJob: RenderJob = {
              ...jobData,
              jobId: crypto.randomUUID(),
              createdAt: new Date(),
              status: 'pending',
              progress: 0
            };
            state.jobs.push(newJob);
          }, false, 'addJob'),

        updateJobStatus: (jobId, status, progress) =>
          set((state) => {
            const job = state.jobs.find((j) => j.jobId === jobId);
            if (job) {
              job.status = status;

              if (progress !== undefined) {
                job.progress = progress;
              }

              if (status === 'rendering' && !job.startedAt) {
                job.startedAt = new Date();
                if (!state.activeJobIds.includes(jobId)) {
                  state.activeJobIds.push(jobId);
                }
              }

              if (status === 'completed' || status === 'failed' || status === 'cancelled') {
                job.completedAt = new Date();
                state.activeJobIds = state.activeJobIds.filter((id) => id !== jobId);

                if (job.startedAt) {
                  job.duration = (job.completedAt.getTime() - job.startedAt.getTime()) / 1000;
                }
              }
            }
          }, false, 'updateJobStatus'),

        updateJobProgress: (jobId, progress) =>
          set((state) => {
            const job = state.jobs.find((j) => j.jobId === jobId);
            if (job) {
              job.progress = Math.min(100, Math.max(0, progress));
            }
          }, false, 'updateJobProgress'),

        cancelJob: (jobId) =>
          set((state) => {
            const job = state.jobs.find((j) => j.jobId === jobId);
            if (job) {
              job.status = 'cancelled';
              job.completedAt = new Date();
              state.activeJobIds = state.activeJobIds.filter((id) => id !== jobId);
            }
          }, false, 'cancelJob'),

        retryJob: (jobId) =>
          set((state) => {
            const job = state.jobs.find((j) => j.jobId === jobId);
            if (job && job.status === 'failed') {
              job.status = 'pending';
              job.progress = 0;
              job.error = undefined;
              job.startedAt = undefined;
              job.completedAt = undefined;
              job.duration = undefined;
            }
          }, false, 'retryJob'),

        setPriority: (jobId, priority) =>
          set((state) => {
            const job = state.jobs.find((j) => j.jobId === jobId);
            if (job) {
              job.priority = priority;

              // Re-sort pending jobs by priority
              const pendingJobs = state.jobs.filter(
                (j) => j.status === 'pending' || j.status === 'queued'
              );
              pendingJobs.sort((a, b) => a.priority - b.priority);
            }
          }, false, 'setPriority'),

        pauseQueue: () =>
          set((state) => {
            state.isPaused = true;
          }, false, 'pauseQueue'),

        resumeQueue: () =>
          set((state) => {
            state.isPaused = false;
          }, false, 'resumeQueue'),

        selectJob: (jobId) =>
          set((state) => {
            state.selectedJobId = jobId;
          }, false, 'selectJob'),

        clearCompleted: () =>
          set((state) => {
            state.jobs = state.jobs.filter(
              (job) => job.status !== 'completed' && job.status !== 'cancelled'
            );
          }, false, 'clearCompleted'),

        // Selectors
        getPendingJobs: () =>
          get().jobs.filter((job) => job.status === 'pending' || job.status === 'queued'),

        getActiveJobs: () =>
          get().jobs.filter((job) => job.status === 'rendering'),

        getCompletedJobs: () =>
          get().jobs.filter((job) => job.status === 'completed'),

        getFailedJobs: () =>
          get().jobs.filter((job) => job.status === 'failed')
      })),
      {
        name: 'render-queue-storage',
        partialize: (state) => ({
          maxConcurrent: state.maxConcurrent,
          isPaused: state.isPaused
        })
      }
    ),
    { name: 'RenderQueueStore' }
  )
);
