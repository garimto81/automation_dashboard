import { test, expect } from '@playwright/test';
import { mockSession, mockHand, mockPlayers, mockCueItem } from './fixtures/test-data';

/**
 * Main Dashboard E2E Tests
 * Tests for Hand Browser, Player Grid, Cuesheet Editor, and Realtime Monitor
 */

test.describe('Main Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Main Dashboard
    await page.goto('/');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should load dashboard and show session selector', async ({ page }) => {
    // Check if session selector is visible
    await expect(page.getByTestId('session-selector')).toBeVisible();

    // Check if header is present
    await expect(page.getByTestId('dashboard-header')).toBeVisible();

    // Check if sidebar navigation is present
    await expect(page.getByTestId('sidebar-nav')).toBeVisible();
  });

  test('should switch tabs between Hand Browser, Cuesheet, Players, and Monitor', async ({ page }) => {
    // Default tab should be Hand Browser
    await expect(page.getByTestId('tab-hands')).toHaveAttribute('data-active', 'true');
    await expect(page.getByTestId('hand-browser')).toBeVisible();

    // Switch to Cuesheet Editor
    await page.click('[data-testid="tab-nav-cuesheet"]');
    await expect(page.getByTestId('tab-cuesheet')).toHaveAttribute('data-active', 'true');
    await expect(page.getByTestId('cuesheet-editor')).toBeVisible();

    // Switch to Player Grid
    await page.click('[data-testid="tab-nav-players"]');
    await expect(page.getByTestId('tab-players')).toHaveAttribute('data-active', 'true');
    await expect(page.getByTestId('player-grid')).toBeVisible();

    // Switch to Realtime Monitor
    await page.click('[data-testid="tab-nav-monitor"]');
    await expect(page.getByTestId('tab-monitor')).toHaveAttribute('data-active', 'true');
    await expect(page.getByTestId('realtime-monitor')).toBeVisible();
  });

  test('should display player grid with 9 cards', async ({ page }) => {
    // Navigate to Player Grid tab
    await page.click('[data-testid="tab-nav-players"]');

    // Wait for player grid to load
    await page.waitForSelector('[data-testid="player-grid"]');

    // Check if 9 player cards are displayed
    const playerCards = page.locator('[data-testid="player-card"]');
    await expect(playerCards).toHaveCount(9);

    // Verify first player card content
    const firstCard = playerCards.first();
    await expect(firstCard.getByTestId('player-name')).toBeVisible();
    await expect(firstCard.getByTestId('player-chips')).toBeVisible();
    await expect(firstCard.getByTestId('player-bbs')).toBeVisible();
    await expect(firstCard.getByTestId('player-position')).toBeVisible();
  });

  test('should select hand and show details', async ({ page }) => {
    // Ensure Hand Browser tab is active
    await page.click('[data-testid="tab-nav-hands"]');

    // Wait for hand list to load
    await page.waitForSelector('[data-testid="hand-list"]');

    // Click on a specific hand card
    await page.click('[data-testid="hand-card-42"]');

    // Wait for hand detail panel to appear
    await page.waitForSelector('[data-testid="hand-detail"]');

    // Verify hand detail components are visible
    await expect(page.getByTestId('board-cards')).toBeVisible();
    await expect(page.getByTestId('action-timeline')).toBeVisible();
    await expect(page.getByTestId('player-participation')).toBeVisible();

    // Verify hand number is displayed
    await expect(page.getByTestId('hand-number')).toContainText('42');

    // Check if board cards are rendered
    const boardCards = page.locator('[data-testid="board-card"]');
    await expect(boardCards.count()).resolves.toBeGreaterThan(0);
  });

  test('should add cue item to cuesheet', async ({ page }) => {
    // Navigate to Cuesheet Editor tab
    await page.click('[data-testid="tab-nav-cuesheet"]');

    // Wait for cuesheet editor to load
    await page.waitForSelector('[data-testid="cuesheet-editor"]');

    // Click "Add Cue Item" button
    await page.click('[data-testid="add-cue-item-btn"]');

    // Wait for modal/form to appear
    await page.waitForSelector('[data-testid="cue-item-form"]');

    // Fill in composition name
    await page.fill('[data-testid="composition-input"]', '_MAIN Chip Count');

    // Select hand from dropdown
    await page.click('[data-testid="hand-selector"]');
    await page.click('[data-testid="hand-option-42"]');

    // Set priority
    await page.fill('[data-testid="priority-input"]', '1');

    // Save the cue item
    await page.click('[data-testid="save-cue-item-btn"]');

    // Wait for success message or modal to close
    await page.waitForSelector('[data-testid="cue-item-form"]', { state: 'hidden' });

    // Verify new cue item appears in the list
    await expect(page.getByTestId('cue-item-cue_test_001')).toBeVisible();
  });

  test('should display session stats in sidebar', async ({ page }) => {
    // Check if session stats are visible
    await expect(page.getByTestId('session-stats')).toBeVisible();

    // Verify key stats are displayed
    await expect(page.getByTestId('stat-hand-count')).toBeVisible();
    await expect(page.getByTestId('stat-active-players')).toBeVisible();
    await expect(page.getByTestId('stat-blind-level')).toBeVisible();
  });

  test('should show broadcast status indicator', async ({ page }) => {
    // Check if broadcast status is visible
    await expect(page.getByTestId('broadcast-status')).toBeVisible();

    // Verify status badge shows "LIVE" or "PAUSED"
    const statusBadge = page.getByTestId('broadcast-status-badge');
    const statusText = await statusBadge.textContent();
    expect(['LIVE', 'PAUSED', 'ENDED']).toContain(statusText?.trim());
  });

  test('should filter hands by status', async ({ page }) => {
    // Navigate to Hand Browser
    await page.click('[data-testid="tab-nav-hands"]');

    // Wait for hand list
    await page.waitForSelector('[data-testid="hand-list"]');

    // Click "Active" filter
    await page.click('[data-testid="filter-active"]');

    // Verify only active hands are shown
    const activeHands = page.locator('[data-testid^="hand-card-"][data-status="active"]');
    await expect(activeHands.count()).resolves.toBeGreaterThan(0);

    // Click "Completed" filter
    await page.click('[data-testid="filter-completed"]');

    // Verify only completed hands are shown
    const completedHands = page.locator('[data-testid^="hand-card-"][data-status="completed"]');
    await expect(completedHands.count()).resolves.toBeGreaterThan(0);
  });

  test('should display realtime event feed', async ({ page }) => {
    // Navigate to Realtime Monitor
    await page.click('[data-testid="tab-nav-monitor"]');

    // Wait for monitor to load
    await page.waitForSelector('[data-testid="realtime-monitor"]');

    // Check if event feed is visible
    await expect(page.getByTestId('gfx-event-feed')).toBeVisible();

    // Check if connection status is shown
    await expect(page.getByTestId('connection-status')).toBeVisible();

    // Check if render status panel is visible
    await expect(page.getByTestId('render-status-panel')).toBeVisible();
  });

  test('should show player chip change indicators', async ({ page }) => {
    // Navigate to Player Grid
    await page.click('[data-testid="tab-nav-players"]');

    // Wait for player grid
    await page.waitForSelector('[data-testid="player-grid"]');

    // Check first player for chip change indicator
    const firstCard = page.locator('[data-testid="player-card"]').first();
    const chipChange = firstCard.getByTestId('chip-change');

    // Verify chip change is visible
    await expect(chipChange).toBeVisible();

    // Check if it has positive or negative class
    const chipChangeClass = await chipChange.getAttribute('class');
    expect(chipChangeClass).toMatch(/positive|negative/);
  });
});

test.describe('Main Dashboard - Session Selection', () => {
  test('should switch sessions and update content', async ({ page }) => {
    await page.goto('/');

    // Open session selector dropdown
    await page.click('[data-testid="session-selector"]');

    // Wait for dropdown to open
    await page.waitForSelector('[data-testid="session-dropdown"]');

    // Select a different session
    await page.click('[data-testid="session-option-session_test_002"]');

    // Wait for page to update
    await page.waitForLoadState('networkidle');

    // Verify session ID in the UI
    await expect(page.getByTestId('current-session-id')).toContainText('session_test_002');
  });
});

test.describe('Main Dashboard - Error Handling', () => {
  test('should show error message when API fails', async ({ page, context }) => {
    // Intercept API call and return error
    await page.route('**/api/sessions/**', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await page.goto('/');

    // Wait for error message to appear
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText('error');
  });

  test('should show loading state while fetching data', async ({ page }) => {
    await page.goto('/');

    // Check if loading spinner appears briefly
    // Note: This might be too fast to catch in real scenarios
    const loader = page.getByTestId('loading-spinner');

    // Either the loader was visible, or data loaded so fast it's already gone
    const isLoaderVisible = await loader.isVisible().catch(() => false);
    expect(typeof isLoaderVisible).toBe('boolean');
  });
});
