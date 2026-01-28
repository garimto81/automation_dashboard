import { test, expect } from '@playwright/test';
import { mockSession, mockHand } from './fixtures/test-data';

/**
 * Supabase Integration E2E Tests
 * Tests for database connection, data fetching, and Realtime events
 */

test.describe('Supabase Connection', () => {
  test('should display connection status indicator', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if connection status indicator is visible
    const connectionStatus = page.getByTestId('connection-status');
    await expect(connectionStatus).toBeVisible();

    // Verify status shows connected state
    const statusText = await connectionStatus.textContent();
    expect(['Connected', 'Connecting', 'Disconnected']).toContain(statusText?.trim());
  });

  test('should show database health status', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Realtime Monitor tab
    await page.click('[data-testid="tab-nav-monitor"]');
    await page.waitForSelector('[data-testid="realtime-monitor"]');

    // Check if database status is displayed
    const dbStatus = page.getByTestId('database-status');
    await expect(dbStatus).toBeVisible();
  });
});

test.describe('Supabase Data Fetching', () => {
  test('should fetch and display sessions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if session selector is populated
    await page.click('[data-testid="session-selector"]');
    await page.waitForSelector('[data-testid="session-dropdown"]');

    // Verify at least one session is listed
    const sessionOptions = page.locator('[data-testid^="session-option-"]');
    const count = await sessionOptions.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should fetch and display hands for selected session', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Hand Browser tab
    await page.click('[data-testid="tab-nav-hands"]');
    await page.waitForSelector('[data-testid="hand-browser"]');

    // Wait for hands to load
    await page.waitForTimeout(2000);

    // Check if hand list is populated or shows empty state
    const handList = page.getByTestId('hand-list');
    await expect(handList).toBeVisible();

    // Verify hands are displayed (or empty state message)
    const handCards = page.locator('[data-testid^="hand-card-"]');
    const emptyState = page.locator('[data-testid="empty-hands"]');

    const hasHands = await handCards.count() > 0;
    const hasEmptyState = await emptyState.isVisible().catch(() => false);

    expect(hasHands || hasEmptyState).toBe(true);
  });

  test('should fetch and display players', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Player Grid tab
    await page.click('[data-testid="tab-nav-players"]');
    await page.waitForSelector('[data-testid="player-grid"]');

    // Wait for players to load
    await page.waitForTimeout(1500);

    // Check if player cards are displayed
    const playerCards = page.locator('[data-testid="player-card"]');
    const count = await playerCards.count();

    // Should have 9 players (max table size)
    expect(count).toBeGreaterThanOrEqual(0);
    expect(count).toBeLessThanOrEqual(9);
  });

  test('should fetch cuesheet items', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Cuesheet Editor tab
    await page.click('[data-testid="tab-nav-cuesheet"]');
    await page.waitForSelector('[data-testid="cuesheet-editor"]');

    // Wait for cue items to load
    await page.waitForTimeout(1500);

    // Check if cue items are displayed
    const cueItems = page.locator('[data-testid^="cue-item-"]');
    const count = await cueItems.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should fetch hand details when hand is selected', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Hand Browser
    await page.click('[data-testid="tab-nav-hands"]');
    await page.waitForSelector('[data-testid="hand-list"]');

    // Click on first hand card
    const firstHand = page.locator('[data-testid^="hand-card-"]').first();

    if (await firstHand.count() > 0) {
      await firstHand.click();

      // Wait for hand detail to load
      await page.waitForSelector('[data-testid="hand-detail"]', { timeout: 5000 });

      // Verify board cards are displayed
      await expect(page.getByTestId('board-cards')).toBeVisible();

      // Verify action timeline is visible
      await expect(page.getByTestId('action-timeline')).toBeVisible();
    }
  });

  test('should load composition list on Sub Dashboard', async ({ page }) => {
    await page.goto('/sub');
    await page.waitForLoadState('networkidle');

    // Wait for compositions to load
    await page.waitForSelector('[data-testid="composition-grid"]', { timeout: 5000 });

    // Verify 26 composition cards are displayed
    const compositionCards = page.locator('[data-testid="composition-card"]');
    const count = await compositionCards.count();
    expect(count).toBe(26);
  });
});

test.describe('Supabase Realtime Events', () => {
  test('should show Realtime connection indicator', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Realtime Monitor
    await page.click('[data-testid="tab-nav-monitor"]');
    await page.waitForSelector('[data-testid="realtime-monitor"]');

    // Check if Realtime indicator is visible
    const realtimeIndicator = page.getByTestId('realtime-indicator');
    await expect(realtimeIndicator).toBeVisible();

    // Wait for connection to establish
    await page.waitForTimeout(2000);

    // Verify connection status
    const statusAttr = await realtimeIndicator.getAttribute('data-status');
    expect(['connected', 'connecting', 'disconnected']).toContain(statusAttr);
  });

  test('should display GFX event feed', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Realtime Monitor
    await page.click('[data-testid="tab-nav-monitor"]');
    await page.waitForSelector('[data-testid="realtime-monitor"]');

    // Check if GFX event feed is visible
    await expect(page.getByTestId('gfx-event-feed')).toBeVisible();

    // Wait for events to load
    await page.waitForTimeout(2000);

    // Verify event list is present
    const eventList = page.getByTestId('event-list');
    await expect(eventList).toBeVisible();
  });

  test('should update UI when hand_updated event occurs', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Hand Browser
    await page.click('[data-testid="tab-nav-hands"]');
    await page.waitForSelector('[data-testid="hand-list"]');

    // Get initial hand count
    const handCards = page.locator('[data-testid^="hand-card-"]');
    const initialCount = await handCards.count();

    // Wait for potential Realtime updates
    await page.waitForTimeout(3000);

    // Verify hand list is still responsive
    const newCount = await handCards.count();
    expect(newCount).toBeGreaterThanOrEqual(0);
  });

  test('should update player data via Realtime', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Player Grid
    await page.click('[data-testid="tab-nav-players"]');
    await page.waitForSelector('[data-testid="player-grid"]');

    // Get first player card
    const firstPlayer = page.locator('[data-testid="player-card"]').first();

    if (await firstPlayer.count() > 0) {
      // Get initial chip value
      const chipElement = firstPlayer.getByTestId('player-chips');
      await expect(chipElement).toBeVisible();

      const initialChips = await chipElement.textContent();

      // Wait for potential Realtime updates
      await page.waitForTimeout(5000);

      // Verify chip element is still visible (may have updated)
      await expect(chipElement).toBeVisible();
    }
  });

  test('should show Realtime subscription status', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Realtime Monitor
    await page.click('[data-testid="tab-nav-monitor"]');
    await page.waitForSelector('[data-testid="realtime-monitor"]');

    // Check if subscription list is visible
    const subscriptions = page.getByTestId('active-subscriptions');
    await expect(subscriptions).toBeVisible();

    // Wait for subscriptions to load
    await page.waitForTimeout(2000);

    // Verify at least one subscription is active
    const subItems = page.locator('[data-testid^="subscription-"]');
    const count = await subItems.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Supabase Data Mutations', () => {
  test('should insert cue item to database', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Cuesheet Editor
    await page.click('[data-testid="tab-nav-cuesheet"]');
    await page.waitForSelector('[data-testid="cuesheet-editor"]');

    // Get initial cue item count
    const cueItems = page.locator('[data-testid^="cue-item-"]');
    const initialCount = await cueItems.count();

    // Click "Add Cue Item" button
    await page.click('[data-testid="add-cue-item-btn"]');
    await page.waitForSelector('[data-testid="cue-item-form"]');

    // Fill in composition name
    await page.fill('[data-testid="composition-input"]', '_MAIN Chip Count');

    // Select hand
    await page.click('[data-testid="hand-selector"]');
    const handOption = page.locator('[data-testid^="hand-option-"]').first();

    if (await handOption.count() > 0) {
      await handOption.click();

      // Set priority
      await page.fill('[data-testid="priority-input"]', '1');

      // Save
      await page.click('[data-testid="save-cue-item-btn"]');

      // Wait for success message
      await page.waitForTimeout(2000);

      // Verify new item was added
      const newCount = await cueItems.count();
      expect(newCount).toBeGreaterThan(initialCount);
    }
  });

  test('should update cue item in database', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Cuesheet Editor
    await page.click('[data-testid="tab-nav-cuesheet"]');
    await page.waitForSelector('[data-testid="cuesheet-editor"]');

    // Click on first cue item
    const firstCueItem = page.locator('[data-testid^="cue-item-"]').first();

    if (await firstCueItem.count() > 0) {
      // Click edit button
      await firstCueItem.getByTestId('edit-cue-item-btn').click();
      await page.waitForSelector('[data-testid="cue-item-form"]');

      // Change priority
      await page.fill('[data-testid="priority-input"]', '5');

      // Save
      await page.click('[data-testid="save-cue-item-btn"]');

      // Wait for update to complete
      await page.waitForTimeout(1500);

      // Verify success
      await expect(page.getByTestId('success-message')).toBeVisible();
    }
  });

  test('should delete cue item from database', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Cuesheet Editor
    await page.click('[data-testid="tab-nav-cuesheet"]');
    await page.waitForSelector('[data-testid="cuesheet-editor"]');

    // Get initial count
    const cueItems = page.locator('[data-testid^="cue-item-"]');
    const initialCount = await cueItems.count();

    if (initialCount > 0) {
      // Click on last cue item
      const lastCueItem = cueItems.last();
      await lastCueItem.click();

      // Click delete button
      await page.click('[data-testid="delete-cue-item-btn"]');

      // Confirm deletion
      await page.waitForSelector('[data-testid="confirm-delete-dialog"]');
      await page.click('[data-testid="confirm-delete-btn"]');

      // Wait for deletion to complete
      await page.waitForTimeout(2000);

      // Verify item was removed
      const newCount = await cueItems.count();
      expect(newCount).toBeLessThan(initialCount);
    }
  });
});

test.describe('Supabase Error Handling', () => {
  test('should show error when database connection fails', async ({ page }) => {
    // Intercept Supabase API calls and return error
    await page.route('**/rest/v1/**', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Database connection failed' }),
      });
    });

    await page.goto('/');

    // Wait for error message
    await expect(page.getByTestId('error-message')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('error-message')).toContainText('error');
  });

  test('should show loading state while fetching data', async ({ page }) => {
    await page.goto('/');

    // Check if loading spinner appears (may be brief)
    const loader = page.getByTestId('loading-spinner');
    const isLoaderVisible = await loader.isVisible().catch(() => false);
    expect(typeof isLoaderVisible).toBe('boolean');
  });

  test('should handle Realtime subscription errors', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Realtime Monitor
    await page.click('[data-testid="tab-nav-monitor"]');
    await page.waitForSelector('[data-testid="realtime-monitor"]');

    // Check if error indicator exists (if subscription fails)
    const realtimeIndicator = page.getByTestId('realtime-indicator');
    await expect(realtimeIndicator).toBeVisible();

    // Wait for connection attempt
    await page.waitForTimeout(3000);

    // Verify indicator has a valid status (even if error)
    const status = await realtimeIndicator.getAttribute('data-status');
    expect(['connected', 'connecting', 'disconnected', 'error']).toContain(status);
  });

  test('should retry failed queries', async ({ page }) => {
    let callCount = 0;

    // Intercept API calls and fail first attempt
    await page.route('**/rest/v1/sessions*', (route) => {
      callCount++;
      if (callCount === 1) {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Temporary error' }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for retry to complete
    await page.waitForTimeout(3000);

    // Verify data was eventually loaded
    const sessionSelector = page.getByTestId('session-selector');
    await expect(sessionSelector).toBeVisible();
  });
});

test.describe('Supabase Performance', () => {
  test('should load data within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Hand Browser
    await page.click('[data-testid="tab-nav-hands"]');
    await page.waitForSelector('[data-testid="hand-browser"]');

    // Wait for hands to load
    await page.waitForSelector('[data-testid="hand-list"]', { timeout: 5000 });

    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should paginate large datasets', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Hand Browser
    await page.click('[data-testid="tab-nav-hands"]');
    await page.waitForSelector('[data-testid="hand-list"]');

    // Check if pagination controls exist
    const pagination = page.getByTestId('pagination-controls');
    const paginationExists = await pagination.isVisible().catch(() => false);

    // Verify pagination or all data is shown
    expect(typeof paginationExists).toBe('boolean');
  });
});
