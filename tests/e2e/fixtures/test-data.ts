/**
 * Test Data Fixtures for E2E Tests
 * GFX Dashboard Test Suite
 */

export const mockSession = {
  id: 'session_test_001',
  gameType: 'tournament' as const,
  status: 'live' as const,
  handNum: 42,
  startTime: '2026-01-15T10:00:00Z',
  blindLevel: '50/100',
  eventId: 'wsop_2026_event_5',
};

export const mockHand = {
  id: 'hand_test_42',
  handNum: 42,
  sessionId: 'session_test_001',
  boardCards: ['As', 'Kh', 'Qd'],
  pot: 500000,
  status: 'completed' as const,
  createdAt: '2026-01-15T10:30:00Z',
};

export const mockPlayers = [
  {
    id: 'player_1',
    position: 1,
    playerName: 'PHIL IVEY',
    stackAmount: 2400000,
    bbs: 120,
    rank: 1,
    country: 'USA',
    avatar: '/avatars/phil_ivey.jpg',
  },
  {
    id: 'player_2',
    position: 2,
    playerName: 'DANIEL NEGREANU',
    stackAmount: 1800000,
    bbs: 90,
    rank: 2,
    country: 'CAN',
    avatar: '/avatars/daniel_negreanu.jpg',
  },
  {
    id: 'player_3',
    position: 3,
    playerName: 'PHIL HELLMUTH',
    stackAmount: 1500000,
    bbs: 75,
    rank: 3,
    country: 'USA',
    avatar: '/avatars/phil_hellmuth.jpg',
  },
  {
    id: 'player_4',
    position: 4,
    playerName: 'VANESSA SELBST',
    stackAmount: 1200000,
    bbs: 60,
    rank: 4,
    country: 'USA',
    avatar: '/avatars/vanessa_selbst.jpg',
  },
  {
    id: 'player_5',
    position: 5,
    playerName: 'DOUG POLK',
    stackAmount: 950000,
    bbs: 48,
    rank: 5,
    country: 'USA',
    avatar: '/avatars/doug_polk.jpg',
  },
  {
    id: 'player_6',
    position: 6,
    playerName: 'FEDOR HOLZ',
    stackAmount: 780000,
    bbs: 39,
    rank: 6,
    country: 'DEU',
    avatar: '/avatars/fedor_holz.jpg',
  },
  {
    id: 'player_7',
    position: 7,
    playerName: 'BRYN KENNEY',
    stackAmount: 620000,
    bbs: 31,
    rank: 7,
    country: 'USA',
    avatar: '/avatars/bryn_kenney.jpg',
  },
  {
    id: 'player_8',
    position: 8,
    playerName: 'JUSTIN BONOMO',
    stackAmount: 450000,
    bbs: 23,
    rank: 8,
    country: 'USA',
    avatar: '/avatars/justin_bonomo.jpg',
  },
  {
    id: 'player_9',
    position: 9,
    playerName: 'STEPHEN CHIDWICK',
    stackAmount: 310000,
    bbs: 16,
    rank: 9,
    country: 'GBR',
    avatar: '/avatars/stephen_chidwick.jpg',
  },
];

export const mockCueItem = {
  id: 'cue_test_001',
  cuesheetId: 'cuesheet_001',
  compositionName: '_MAIN Chip Count',
  handId: 'hand_test_42',
  priority: 1,
  status: 'pending' as const,
  createdAt: '2026-01-15T10:35:00Z',
};

export const mockCompositions = [
  // chip_display (6개)
  {
    id: 'comp_001',
    name: '_MAIN Chip Count',
    category: 'chip_display',
    fieldCount: 9,
    slotCount: 9,
    thumbnailPath: '/thumbnails/main_chip_count.png',
  },
  {
    id: 'comp_002',
    name: '_MINI Chip Count',
    category: 'chip_display',
    fieldCount: 9,
    slotCount: 9,
    thumbnailPath: '/thumbnails/mini_chip_count.png',
  },
  {
    id: 'comp_003',
    name: '_CHIP LEADER',
    category: 'chip_display',
    fieldCount: 1,
    slotCount: 1,
    thumbnailPath: '/thumbnails/chip_leader.png',
  },
  {
    id: 'comp_004',
    name: '_SHORT STACK',
    category: 'chip_display',
    fieldCount: 1,
    slotCount: 1,
    thumbnailPath: '/thumbnails/short_stack.png',
  },
  {
    id: 'comp_005',
    name: '_CHIP CHANGE',
    category: 'chip_display',
    fieldCount: 2,
    slotCount: 1,
    thumbnailPath: '/thumbnails/chip_change.png',
  },
  {
    id: 'comp_006',
    name: '_CHIP RACE',
    category: 'chip_display',
    fieldCount: 9,
    slotCount: 9,
    thumbnailPath: '/thumbnails/chip_race.png',
  },

  // payout (3개)
  {
    id: 'comp_007',
    name: '_PRIZE POOL',
    category: 'payout',
    fieldCount: 1,
    slotCount: 0,
    thumbnailPath: '/thumbnails/prize_pool.png',
  },
  {
    id: 'comp_008',
    name: '_PAYOUTS',
    category: 'payout',
    fieldCount: 9,
    slotCount: 9,
    thumbnailPath: '/thumbnails/payouts.png',
  },
  {
    id: 'comp_009',
    name: '_FIRST PLACE',
    category: 'payout',
    fieldCount: 1,
    slotCount: 1,
    thumbnailPath: '/thumbnails/first_place.png',
  },

  // event_info (4개)
  {
    id: 'comp_010',
    name: '_EVENT TITLE',
    category: 'event_info',
    fieldCount: 1,
    slotCount: 0,
    thumbnailPath: '/thumbnails/event_title.png',
  },
  {
    id: 'comp_011',
    name: '_BLIND LEVEL',
    category: 'event_info',
    fieldCount: 1,
    slotCount: 0,
    thumbnailPath: '/thumbnails/blind_level.png',
  },
  {
    id: 'comp_012',
    name: '_LEVEL TIME',
    category: 'event_info',
    fieldCount: 1,
    slotCount: 0,
    thumbnailPath: '/thumbnails/level_time.png',
  },
  {
    id: 'comp_013',
    name: '_PLAYERS REMAINING',
    category: 'event_info',
    fieldCount: 1,
    slotCount: 0,
    thumbnailPath: '/thumbnails/players_remaining.png',
  },

  // player_info (4개)
  {
    id: 'comp_014',
    name: '_PLAYER PROFILE',
    category: 'player_info',
    fieldCount: 5,
    slotCount: 1,
    thumbnailPath: '/thumbnails/player_profile.png',
  },
  {
    id: 'comp_015',
    name: '_PLAYER STATS',
    category: 'player_info',
    fieldCount: 3,
    slotCount: 1,
    thumbnailPath: '/thumbnails/player_stats.png',
  },
  {
    id: 'comp_016',
    name: '_PLAYER COMPARISON',
    category: 'player_info',
    fieldCount: 8,
    slotCount: 2,
    thumbnailPath: '/thumbnails/player_comparison.png',
  },
  {
    id: 'comp_017',
    name: '_PLAYER SPOTLIGHT',
    category: 'player_info',
    fieldCount: 4,
    slotCount: 1,
    thumbnailPath: '/thumbnails/player_spotlight.png',
  },

  // schedule (1개)
  {
    id: 'comp_018',
    name: '_EVENT SCHEDULE',
    category: 'schedule',
    fieldCount: 5,
    slotCount: 0,
    thumbnailPath: '/thumbnails/event_schedule.png',
  },

  // staff (2개)
  {
    id: 'comp_019',
    name: '_HOST INFO',
    category: 'staff',
    fieldCount: 2,
    slotCount: 1,
    thumbnailPath: '/thumbnails/host_info.png',
  },
  {
    id: 'comp_020',
    name: '_DEALER INFO',
    category: 'staff',
    fieldCount: 2,
    slotCount: 1,
    thumbnailPath: '/thumbnails/dealer_info.png',
  },

  // elimination (2개)
  {
    id: 'comp_021',
    name: '_ELIMINATION',
    category: 'elimination',
    fieldCount: 3,
    slotCount: 1,
    thumbnailPath: '/thumbnails/elimination.png',
  },
  {
    id: 'comp_022',
    name: '_FINAL 2',
    category: 'elimination',
    fieldCount: 8,
    slotCount: 2,
    thumbnailPath: '/thumbnails/final_2.png',
  },

  // transition (2개)
  {
    id: 'comp_023',
    name: '_SCENE TRANSITION IN',
    category: 'transition',
    fieldCount: 0,
    slotCount: 0,
    thumbnailPath: '/thumbnails/transition_in.png',
  },
  {
    id: 'comp_024',
    name: '_SCENE TRANSITION OUT',
    category: 'transition',
    fieldCount: 0,
    slotCount: 0,
    thumbnailPath: '/thumbnails/transition_out.png',
  },

  // other (2개)
  {
    id: 'comp_025',
    name: '_CUSTOM TEXT',
    category: 'other',
    fieldCount: 3,
    slotCount: 0,
    thumbnailPath: '/thumbnails/custom_text.png',
  },
  {
    id: 'comp_026',
    name: '_SPONSOR LOGO',
    category: 'other',
    fieldCount: 1,
    slotCount: 0,
    thumbnailPath: '/thumbnails/sponsor_logo.png',
  },
];

export const mockRenderJob = {
  jobId: 'job_test_001',
  handId: 'hand_test_42',
  compositionName: '_MAIN Chip Count',
  status: 'rendering' as const,
  priority: 1,
  progress: 65,
  createdAt: '2026-01-15T10:40:00Z',
  startedAt: '2026-01-15T10:40:10Z',
  estimatedRemaining: 15,
};

export const mockWebSocketMessages = {
  cue_item_selected: {
    type: 'cue_item_selected',
    payload: {
      cueItemId: 'cue_test_001',
      handId: 'hand_test_42',
      compositionName: '_MAIN Chip Count',
      handData: mockHand,
    },
    timestamp: '2026-01-15T10:35:00Z',
  },

  render_status_update: {
    type: 'render_status_update',
    payload: {
      jobId: 'job_test_001',
      requestId: 'req_test_001',
      status: 'rendering',
      progress: 65,
      estimatedRemaining: 15,
    },
    timestamp: '2026-01-15T10:40:30Z',
  },

  render_complete: {
    type: 'render_complete',
    payload: {
      jobId: 'job_test_001',
      requestId: 'req_test_001',
      outputPath: '/outputs/cue_test_001_20260115_104100.mp4',
      duration: 12500,
      frameCount: 300,
      fileSize: 245000000,
    },
    timestamp: '2026-01-15T10:41:00Z',
  },
};
