/**
 * Composition Types
 *
 * Defines types for AE compositions, field mappings, and slot configurations
 * Total: 26 compositions across 9 categories, 84 total fields
 */

/**
 * Composition category (9 categories)
 */
export type CompositionCategory =
  | 'chip_display'   // 6 compositions
  | 'payout'         // 3 compositions
  | 'event_info'     // 4 compositions
  | 'player_info'    // 4 compositions
  | 'schedule'       // 1 composition
  | 'staff'          // 2 compositions
  | 'elimination'    // 2 compositions
  | 'transition'     // 2 compositions
  | 'other';         // 2 compositions

/**
 * Transform function type
 */
export type TransformType =
  | 'direct'         // No transformation
  | 'UPPER'          // Convert to uppercase
  | 'LOWER'          // Convert to lowercase
  | 'format_chips'   // Format chip amount (e.g., "2400000" -> "2.4M")
  | 'format_bbs'     // Format big blinds (e.g., "120" -> "120 BB")
  | 'format_flag'    // Convert country code to flag emoji
  | 'format_rank'    // Format rank with suffix (e.g., "1" -> "1st")
  | 'format_money'   // Format prize money (e.g., "1000000" -> "$1,000,000")
  | 'format_time'    // Format time (e.g., "90" -> "1:30")
  | 'custom';        // Custom transform function

/**
 * Data source type
 */
export type DataSourceType =
  | 'gfx'            // GFX JSON schema (json.*)
  | 'wsop_plus'      // WSOP+ schema (wsop_plus.*)
  | 'manual'         // Manual schema (manual.*)
  | 'unified';       // Unified view (auto-merge priority: Manual > GFX > WSOP+)

/**
 * Field mapping for a single field
 */
export interface FieldMapping {
  /** Field ID */
  fieldId: string;

  /** Target field key (e.g., 'name', 'chips', 'bbs', 'rank') */
  targetFieldKey: string;

  /** Slot index (1-9 for slotted fields, null for global fields) */
  slotIndex?: number;

  /** Source table (e.g., 'gfx_hand_players', 'wsop_players') */
  sourceTable: string;

  /** Source column (e.g., 'player_name', 'stack_amount') */
  sourceColumn: string;

  /** Source join clause (if needed) */
  sourceJoin?: string;

  /** Transform function */
  transform: TransformType;

  /** Current preview value (live data) */
  currentValue?: string;

  /** Default value (if data is null) */
  defaultValue?: string;

  /** Whether field is required */
  isRequired: boolean;

  /** Field description */
  description?: string;
}

/**
 * Slot mapping for a composition (e.g., 9 slots for chip display)
 */
export interface SlotMapping {
  /** Slot index (1-9) */
  slotIndex: number;

  /** Fields for this slot */
  fields: FieldMapping[];

  /** Whether slot is active */
  isActive: boolean;
}

/**
 * Composition metadata
 */
export interface Composition {
  /** Composition ID */
  id: string;

  /** Composition name (e.g., "_MAIN Chip Count") */
  name: string;

  /** Category */
  category: CompositionCategory;

  /** Width in pixels */
  width: number;

  /** Height in pixels */
  height: number;

  /** Duration in seconds */
  duration: number;

  /** Frame rate */
  frameRate: number;

  /** Thumbnail path */
  thumbnailPath: string;

  /** Total number of layers */
  layerCount: number;

  /** Total number of mappable fields */
  fieldCount: number;

  /** Number of slots (0-9) */
  slotCount: number;

  /** Slot mappings */
  slots?: SlotMapping[];

  /** Global fields (non-slotted) */
  globalFields?: FieldMapping[];

  /** Last used timestamp */
  lastUsed?: Date;

  /** Whether composition is favorited */
  isFavorite: boolean;

  /** Composition description */
  description?: string;

  /** Tags for search */
  tags?: string[];
}

/**
 * Composition mapping (complete configuration)
 */
export interface CompositionMapping {
  /** Mapping ID */
  mappingId: string;

  /** Composition name */
  compositionName: string;

  /** Category */
  category: CompositionCategory;

  /** Total number of slots */
  totalSlots: number;

  /** All field mappings */
  fields: FieldMapping[];

  /** Data source */
  dataSource: DataSourceType;

  /** Created timestamp */
  createdAt: Date;

  /** Updated timestamp */
  updatedAt: Date;

  /** Created by user ID */
  createdBy?: string;
}

/**
 * Composition state (Zustand store)
 */
export interface CompositionState {
  /** All compositions */
  compositions: Composition[];

  /** Selected composition ID */
  selectedId: string | null;

  /** Filter settings */
  filter: {
    search: string;
    category: CompositionCategory | 'all';
    favorites: boolean;
  };

  // Actions
  loadCompositions: () => Promise<void>;
  selectComposition: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setFilter: (filter: Partial<CompositionState['filter']>) => void;

  // Selectors
  getFilteredCompositions: () => Composition[];
  getCompositionsByCategory: (category: CompositionCategory) => Composition[];
}
