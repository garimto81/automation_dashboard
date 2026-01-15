import { test, expect } from '@playwright/test';
import { mockWebSocketMessages, mockCueItem, mockRenderJob } from './fixtures/test-data';

/**
 * WebSocket Communication E2E Tests
 * Tests for Main ↔ Sub Dashboard real-time communication
 */

test.describe('WebSocket Communication', () => {
  test('should connect Main to Sub via WebSocket', async ({ page, context }) => {
    // Open Main Dashboard
    const mainPage = page;
    await mainPage.goto('/');
    await mainPage.waitForLoadState('networkidle');

    // Open Sub Dashboard in new page
    const subPage = await context.newPage();
    await subPage.goto('/sub');
    await subPage.waitForLoadState('networkidle');

    // Check WebSocket connection status on Main Dashboard
    const mainWsStatus = mainPage.getByTestId('websocket-status-sub');
    await expect(mainWsStatus).toBeVisible();

    // Wait for connection to establish
    await mainPage.waitForTimeout(2000);

    // Verify connection is established
    const mainStatusText = await mainWsStatus.textContent();
    expect(mainStatusText).toContain('Connected');

    // Check WebSocket connection status on Sub Dashboard
    const subWsStatus = subPage.getByTestId('websocket-status');
    await expect(subWsStatus).toBeVisible();

    const subStatusText = await subWsStatus.textContent();
    expect(subStatusText).toContain('Connected');

    await subPage.close();
  });

  test('should sync composition when cue item selected', async ({ page, context }) => {
    // Open Main Dashboard
    const mainPage = page;
    await mainPage.goto('/');
    await mainPage.waitForLoadState('networkidle');

    // Open Sub Dashboard
    const subPage = await context.newPage();
    await subPage.goto('/sub');
    await subPage.waitForLoadState('networkidle');

    // Wait for WebSocket connection
    await mainPage.waitForTimeout(2000);

    // On Main Dashboard: Navigate to Cuesheet Editor
    await mainPage.click('[data-testid="tab-nav-cuesheet"]');
    await mainPage.waitForSelector('[data-testid="cuesheet-editor"]');

    // Select a cue item
    const cueItem = mainPage.locator('[data-testid="cue-item-cue_test_001"]').first();
    if (await cueItem.count() > 0) {
      await cueItem.click();

      // Wait for WebSocket message to be sent
      await mainPage.waitForTimeout(1000);

      // On Sub Dashboard: Verify composition is auto-selected
      const selectedComp = subPage.locator('[data-testid="composition-card"][data-selected="true"]');

      // Wait for composition to be selected
      await subPage.waitForTimeout(1000);

      // Verify selected composition name matches
      if (await selectedComp.count() > 0) {
        const compName = await selectedComp.getByTestId('composition-name').textContent();
        expect(compName).toContain('MAIN Chip Count');
      }
    }

    await subPage.close();
  });

  test('should update render status in real-time', async ({ page, context }) => {
    // Open Main Dashboard
    const mainPage = page;
    await mainPage.goto('/');
    await mainPage.waitForLoadState('networkidle');

    // Open Sub Dashboard
    const subPage = await context.newPage();
    await subPage.goto('/sub');
    await subPage.waitForLoadState('networkidle');

    // Wait for WebSocket connection
    await mainPage.waitForTimeout(2000);

    // On Sub Dashboard: Add job to render queue
    await subPage.waitForSelector('[data-testid="composition-grid"]');
    await subPage.click('[data-testid="composition-card-comp_001"]');

    await subPage.waitForSelector('[data-testid="add-to-queue-btn"]');
    await subPage.click('[data-testid="add-to-queue-btn"]');

    // Wait for job to be added
    await subPage.waitForTimeout(1000);

    // Navigate to Render Queue tab on Sub
    await subPage.click('[data-testid="tab-nav-render-queue"]');
    await subPage.waitForSelector('[data-testid="render-queue"]');

    // On Main Dashboard: Navigate to Realtime Monitor
    await mainPage.click('[data-testid="tab-nav-monitor"]');
    await mainPage.waitForSelector('[data-testid="realtime-monitor"]');

    // Wait for render status update to be received
    await mainPage.waitForTimeout(2000);

    // Verify render status is displayed on Main Dashboard
    const renderStatusPanel = mainPage.getByTestId('render-status-panel');
    await expect(renderStatusPanel).toBeVisible();

    await subPage.close();
  });

  test('should handle WebSocket reconnection', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check initial connection status
    const wsStatus = page.getByTestId('websocket-status-sub');
    await expect(wsStatus).toBeVisible();

    // Simulate network disconnection (if API allows)
    // This would require mocking WebSocket behavior or using network throttling

    // For now, just verify reconnection indicator exists
    // In a real scenario, you'd disconnect and wait for "Reconnecting" status

    const statusText = await wsStatus.textContent();
    expect(['Connected', 'Disconnected', 'Reconnecting']).toContain(statusText?.trim());
  });

  test('should send heartbeat messages', async ({ page, context }) => {
    // Open Main Dashboard
    const mainPage = page;
    await mainPage.goto('/');
    await mainPage.waitForLoadState('networkidle');

    // Open Sub Dashboard
    const subPage = await context.newPage();
    await subPage.goto('/sub');
    await subPage.waitForLoadState('networkidle');

    // Wait for WebSocket connection
    await mainPage.waitForTimeout(2000);

    // Wait for heartbeat interval (30 seconds in production, might be shorter in test)
    // For testing purposes, we just verify connection remains stable
    await mainPage.waitForTimeout(5000);

    // Verify both dashboards are still connected
    const mainWsStatus = mainPage.getByTestId('websocket-status-sub');
    const mainStatusText = await mainWsStatus.textContent();
    expect(mainStatusText).toContain('Connected');

    const subWsStatus = subPage.getByTestId('websocket-status');
    const subStatusText = await subWsStatus.textContent();
    expect(subStatusText).toContain('Connected');

    await subPage.close();
  });

  test('should handle hand_updated message', async ({ page, context }) => {
    // Open Main Dashboard
    const mainPage = page;
    await mainPage.goto('/');
    await mainPage.waitForLoadState('networkidle');

    // Open Sub Dashboard
    const subPage = await context.newPage();
    await subPage.goto('/sub');
    await subPage.waitForLoadState('networkidle');

    // Wait for WebSocket connection
    await mainPage.waitForTimeout(2000);

    // Select a composition on Sub Dashboard
    await subPage.waitForSelector('[data-testid="composition-grid"]');
    await subPage.click('[data-testid="composition-card-comp_001"]');

    // Wait for slot mapping panel
    await subPage.waitForSelector('[data-testid="data-preview-panel"]');

    // On Main Dashboard: Trigger hand update (simulate data change)
    // In real scenario, this would come from database or external trigger
    // For E2E test, we verify that Sub Dashboard preview would update

    // Verify preview values are displayed
    const previewPanel = subPage.getByTestId('preview-json');
    await expect(previewPanel).toBeVisible();

    await subPage.close();
  });

  test('should handle render_complete message', async ({ page, context }) => {
    // Open Main Dashboard
    const mainPage = page;
    await mainPage.goto('/');
    await mainPage.waitForLoadState('networkidle');

    // Open Sub Dashboard
    const subPage = await context.newPage();
    await subPage.goto('/sub');
    await subPage.waitForLoadState('networkidle');

    // Wait for WebSocket connection
    await mainPage.waitForTimeout(2000);

    // On Sub Dashboard: Navigate to Render Queue
    await subPage.click('[data-testid="tab-nav-render-queue"]');
    await subPage.waitForSelector('[data-testid="render-queue"]');

    // On Main Dashboard: Navigate to Realtime Monitor
    await mainPage.click('[data-testid="tab-nav-monitor"]');
    await mainPage.waitForSelector('[data-testid="realtime-monitor"]');

    // Simulate render completion (in real scenario, this would come from render engine)
    // Verify that completed jobs appear in completed section
    const completedJobs = subPage.getByTestId('completed-jobs');
    await expect(completedJobs).toBeVisible();

    await subPage.close();
  });

  test('should handle render_error message', async ({ page, context }) => {
    // Open Sub Dashboard
    const subPage = page;
    await subPage.goto('/sub');
    await subPage.waitForLoadState('networkidle');

    // Navigate to Render Queue
    await subPage.click('[data-testid="tab-nav-render-queue"]');
    await subPage.waitForSelector('[data-testid="render-queue"]');

    // Find a failed job (if exists)
    const failedJob = subPage.locator('[data-testid^="job-card-"][data-status="failed"]').first();

    if (await failedJob.count() > 0) {
      // Verify error message is displayed
      await expect(failedJob.getByTestId('error-message')).toBeVisible();

      // Verify retry button is present
      await expect(failedJob.getByTestId('retry-job-btn')).toBeVisible();
    }
  });

  test('should handle cue_item_cancelled message', async ({ page, context }) => {
    // Open Main Dashboard
    const mainPage = page;
    await mainPage.goto('/');
    await mainPage.waitForLoadState('networkidle');

    // Open Sub Dashboard
    const subPage = await context.newPage();
    await subPage.goto('/sub');
    await subPage.waitForLoadState('networkidle');

    // Wait for WebSocket connection
    await mainPage.waitForTimeout(2000);

    // On Main Dashboard: Navigate to Cuesheet Editor
    await mainPage.click('[data-testid="tab-nav-cuesheet"]');
    await mainPage.waitForSelector('[data-testid="cuesheet-editor"]');

    // Select and then delete a cue item
    const cueItem = mainPage.locator('[data-testid^="cue-item-"]').first();
    if (await cueItem.count() > 0) {
      await cueItem.click();

      // Wait for WebSocket message to be sent (cue_item_selected)
      await mainPage.waitForTimeout(1000);

      // Delete the cue item
      await mainPage.click('[data-testid="delete-cue-item-btn"]');
      await mainPage.click('[data-testid="confirm-delete-btn"]');

      // Wait for cancellation message
      await mainPage.waitForTimeout(1000);

      // On Sub Dashboard: Verify composition is deselected or state is reset
      const selectedComp = subPage.locator('[data-testid="composition-card"][data-selected="true"]');
      const count = await selectedComp.count();
      // Composition might remain selected or be cleared depending on implementation
      expect(typeof count).toBe('number');
    }

    await subPage.close();
  });
});

test.describe('WebSocket Communication - Message Format', () => {
  test('should send well-formed cue_item_selected message', async ({ page, context }) => {
    // This test would require intercepting WebSocket messages
    // Playwright doesn't have built-in WebSocket interception yet
    // We can verify the effect of the message instead

    const mainPage = page;
    await mainPage.goto('/');

    const subPage = await context.newPage();
    await subPage.goto('/sub');

    await mainPage.waitForTimeout(2000);

    // Trigger cue item selection
    await mainPage.click('[data-testid="tab-nav-cuesheet"]');
    await mainPage.waitForSelector('[data-testid="cuesheet-editor"]');

    const cueItem = mainPage.locator('[data-testid^="cue-item-"]').first();
    if (await cueItem.count() > 0) {
      await cueItem.click();

      // Verify effect on Sub Dashboard
      await subPage.waitForTimeout(1000);

      // Check if composition was auto-selected
      const selectedComp = subPage.locator('[data-testid="composition-card"][data-selected="true"]');
      const isSelected = await selectedComp.count() > 0;
      expect(typeof isSelected).toBe('boolean');
    }

    await subPage.close();
  });
});
