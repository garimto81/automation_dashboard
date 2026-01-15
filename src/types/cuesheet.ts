/**
 * Cuesheet Types
 *
 * Defines types for cuesheet management, cue items, and rendering queue
 * Used in Main Dashboard cuesheet editor
 */

/**
 * Cue item status
 */
export type CueItemStatus =
  | 'draft'       // Not yet finalized
  | 'ready'       // Ready to render
  | 'queued'      // In render queue
  | 'rendering'   // Currently rendering
  | 'completed'   // Render completed
  | 'failed'      // Render failed
  | 'cancelled';  // Cancelled by user

/**
 * Cue item type (composition categories)
 */
export type CueItemType =
  | 'chip_display'
  | 'payout'
  | 'event_info'
  | 'player_info'
  | 'schedule'
  | 'staff'
  | 'elimination'
  | 'transition'
  | 'other';

/**
 * Individual cue item
 */
export interface CueItem {
  /** Cue item ID */
  cueItemId: string;

  /** Cuesheet ID */
  cuesheetId: string;

  /** Composition name (e.g., "_MAIN Chip Count") */
  compositionName: string;

  /** Composition type/category */
  type: CueItemType;

  /** Associated hand ID */
  handId: string;

  /** Hand number */
  handNum: number;

  /** Item status */
  status: CueItemStatus;

  /** Display order */
  order: number;

  /** Priority (1=highest) */
  priority: number;

  /** Target timecode (optional) */
  timecode?: string;

  /** Notes/description */
  notes?: string;

  /** Created timestamp */
  createdAt: Date;

  /** Updated timestamp */
  updatedAt: Date;

  /** Created by user ID */
  createdBy?: string;

  /** Render job ID (if started) */
  renderJobId?: string;

  /** Output path (if completed) */
  outputPath?: string;

  /** Error message (if failed) */
  errorMessage?: string;
}

/**
 * Cuesheet
 */
export interface Cuesheet {
  /** Cuesheet ID */
  cuesheetId: string;

  /** Cuesheet name */
  name: string;

  /** Session ID */
  sessionId: string;

  /** Event ID (if tournament) */
  eventId?: string;

  /** Cue items */
  items: CueItem[];

  /** Total items count */
  totalItems: number;

  /** Completed items count */
  completedItems: number;

  /** Created timestamp */
  createdAt: Date;

  /** Updated timestamp */
  updatedAt: Date;

  /** Created by user ID */
  createdBy?: string;

  /** Cuesheet status */
  status: 'active' | 'archived';
}

/**
 * Cuesheet state (Zustand store)
 */
export interface CuesheetState {
  /** Current cuesheet ID */
  cuesheetId: string | null;

  /** Cue items */
  items: CueItem[];

  /** Selected item ID */
  selectedItemId: string | null;

  /** Whether cuesheet has unsaved changes */
  isDirty: boolean;

  /** Sort order */
  sortOrder: 'time' | 'priority';

  // Actions
  loadCuesheet: (id: string) => Promise<void>;
  addItem: (item: Omit<CueItem, 'cueItemId' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, updates: Partial<CueItem>) => void;
  deleteItem: (id: string) => void;
  reorderItems: (sourceIndex: number, destIndex: number) => void;
  selectItem: (id: string | null) => void;
  saveToDb: () => Promise<void>;
  setSortOrder: (order: 'time' | 'priority') => void;
}
