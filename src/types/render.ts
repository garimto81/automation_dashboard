/**
 * Render Types
 *
 * Defines types for render jobs, render queue, and render outputs
 * Used in Sub Dashboard render queue management
 */

/**
 * Render job status
 */
export type RenderJobStatus =
  | 'pending'      // Created but not yet queued
  | 'queued'       // In queue waiting to start
  | 'rendering'    // Currently rendering
  | 'completed'    // Successfully completed
  | 'failed'       // Failed with error
  | 'cancelled';   // Cancelled by user

/**
 * Render error code
 */
export type RenderErrorCode =
  | 'SLOT_MAPPING_ERROR'      // Field mapping issue
  | 'COMPOSITION_NOT_FOUND'   // Composition not found in AEP
  | 'DATA_FETCH_ERROR'        // Failed to fetch source data
  | 'AE_SCRIPT_ERROR'         // After Effects script error
  | 'RENDER_TIMEOUT'          // Render exceeded timeout
  | 'OUTPUT_PATH_ERROR'       // Output path issue
  | 'UNKNOWN_ERROR';          // Unknown error

/**
 * Render output metadata
 */
export interface RenderOutput {
  /** Output ID */
  outputId: string;

  /** Job ID */
  jobId: string;

  /** Output file path */
  outputPath: string;

  /** File size in bytes */
  fileSize: number;

  /** Video duration in seconds */
  duration: number;

  /** Frame count */
  frameCount: number;

  /** Video codec */
  codec: string;

  /** Video width */
  width: number;

  /** Video height */
  height: number;

  /** Frame rate */
  frameRate: number;

  /** Created timestamp */
  createdAt: Date;

  /** Download URL */
  downloadUrl?: string;

  /** Thumbnail URL */
  thumbnailUrl?: string;
}

/**
 * Render error details
 */
export interface RenderError {
  /** Error code */
  code: RenderErrorCode;

  /** Error message */
  message: string;

  /** Error stack trace */
  stack?: string;

  /** Whether error is retryable */
  retryable: boolean;

  /** Related field ID (if slot mapping error) */
  fieldId?: string;

  /** Timestamp */
  timestamp: Date;
}

/**
 * Render job
 */
export interface RenderJob {
  /** Job ID */
  jobId: string;

  /** Hand ID */
  handId: string;

  /** Composition name */
  compositionName: string;

  /** Composition category */
  category: string;

  /** Job status */
  status: RenderJobStatus;

  /** Job priority (1=highest) */
  priority: number;

  /** Render progress (0-100) */
  progress: number;

  /** Created timestamp */
  createdAt: Date;

  /** Started timestamp */
  startedAt?: Date;

  /** Completed timestamp */
  completedAt?: Date;

  /** Duration in seconds */
  duration?: number;

  /** Estimated remaining time in seconds */
  estimatedRemaining?: number;

  /** Error details (if failed) */
  error?: RenderError;

  /** Output metadata (if completed) */
  output?: RenderOutput;

  /** Request ID (from Main Dashboard) */
  requestId?: string;

  /** Session ID */
  sessionId?: string;

  /** Hand number */
  handNum?: number;

  /** Created by user ID */
  createdBy?: string;
}

/**
 * Render queue state (Zustand store)
 */
export interface RenderQueueState {
  /** All jobs */
  jobs: RenderJob[];

  /** Active job IDs (currently rendering) */
  activeJobIds: string[];

  /** Selected job ID */
  selectedJobId: string | null;

  /** Whether queue is paused */
  isPaused: boolean;

  /** Maximum concurrent jobs */
  maxConcurrent: number;

  // Actions
  addJob: (job: Omit<RenderJob, 'jobId' | 'createdAt'>) => void;
  updateJobStatus: (jobId: string, status: RenderJobStatus, progress?: number) => void;
  updateJobProgress: (jobId: string, progress: number) => void;
  cancelJob: (jobId: string) => void;
  retryJob: (jobId: string) => void;
  setPriority: (jobId: string, priority: number) => void;
  pauseQueue: () => void;
  resumeQueue: () => void;
  selectJob: (jobId: string | null) => void;
  clearCompleted: () => void;

  // Selectors
  getPendingJobs: () => RenderJob[];
  getActiveJobs: () => RenderJob[];
  getCompletedJobs: () => RenderJob[];
  getFailedJobs: () => RenderJob[];
}
