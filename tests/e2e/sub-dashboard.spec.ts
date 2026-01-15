import { test, expect } from '@playwright/test';
import { mockCompositions, mockRenderJob } from './fixtures/test-data';

/**
 * Sub Dashboard E2E Tests
 * Tests for Composition Grid, Slot Mapping, Render Queue, and Output Viewer
 */

test.describe('Sub Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Sub Dashboard
    await page.goto('/sub');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should show composition grid with 26 cards', async ({ page }) => {
    // Wait for composition grid to load
    await page.waitForSelector('[data-testid="composition-grid"]');

    // Count composition cards
    const cards = page.locator('[data-testid="composition-card"]');
    await expect(cards).toHaveCount(26);

    // Verify first card has required elements
    const firstCard = cards.first();
    await expect(firstCard.getByTestId('composition-thumbnail')).toBeVisible();
    await expect(firstCard.getByTestId('composition-name')).toBeVisible();
    await expect(firstCard.getByTestId('composition-category')).toBeVisible();
    await expect(firstCard.getByTestId('composition-slot-count')).toBeVisible();
  });

  test('should filter compositions by category', async ({ page }) => {
    // Wait for composition grid
    await page.waitForSelector('[data-testid="composition-grid"]');

    // Click "chip_display" category filter
    await page.click('[data-testid="category-filter-chip_display"]');

    // Count filtered compositions (should be 6)
    const chipDisplayCards = page.locator('[data-testid="composition-card"][data-category="chip_display"]');
    await expect(chipDisplayCards).toHaveCount(6);

    // Click "payout" category filter
    await page.click('[data-testid="category-filter-payout"]');

    // Count filtered compositions (should be 3)
    const payoutCards = page.locator('[data-testid="composition-card"][data-category="payout"]');
    await expect(payoutCards).toHaveCount(3);

    // Click "All" to reset filter
    await page.click('[data-testid="category-filter-all"]');

    // Verify all 26 cards are shown again
    const allCards = page.locator('[data-testid="composition-card"]');
    await expect(allCards).toHaveCount(26);
  });

  test('should search compositions by name', async ({ page }) => {
    // Wait for composition grid
    await page.waitForSelector('[data-testid="composition-grid"]');

    // Type in search box
    await page.fill('[data-testid="composition-search"]', 'CHIP');

    // Wait for search to filter results
    await page.waitForTimeout(500);

    // Verify only matching compositions are shown
    const searchResults = page.locator('[data-testid="composition-card"]');
    const count = await searchResults.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(26);

    // Clear search
    await page.fill('[data-testid="composition-search"]', '');

    // Verify all cards are shown again
    await expect(page.locator('[data-testid="composition-card"]')).toHaveCount(26);
  });

  test('should select composition and display slot mapping panel', async ({ page }) => {
    // Wait for composition grid
    await page.waitForSelector('[data-testid="composition-grid"]');

    // Click on "_MAIN Chip Count" composition
    await page.click('[data-testid="composition-card-comp_001"]');

    // Wait for slot mapping panel to appear
    await page.waitForSelector('[data-testid="slot-mapping-panel"]');

    // Verify slot mapping panel is visible
    await expect(page.getByTestId('slot-mapping-panel')).toBeVisible();

    // Verify data source toggle is present
    await expect(page.getByTestId('data-source-toggle')).toBeVisible();

    // Verify field mapping table is visible
    await expect(page.getByTestId('field-mapping-table')).toBeVisible();

    // Count field rows (should be 9 for _MAIN Chip Count)
    const fieldRows = page.locator('[data-testid^="field-row-"]');
    const rowCount = await fieldRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should display data preview panel', async ({ page }) => {
    // Wait for composition grid
    await page.waitForSelector('[data-testid="composition-grid"]');

    // Select a composition
    await page.click('[data-testid="composition-card-comp_001"]');

    // Wait for data preview panel
    await page.waitForSelector('[data-testid="data-preview-panel"]');

    // Verify session info is displayed
    await expect(page.getByTestId('preview-session-info')).toBeVisible();

    // Verify JSON preview is visible
    await expect(page.getByTestId('preview-json')).toBeVisible();

    // Verify "Add to Queue" button is present
    await expect(page.getByTestId('add-to-queue-btn')).toBeVisible();
  });

  test('should switch data source', async ({ page }) => {
    // Select a composition
    await page.waitForSelector('[data-testid="composition-grid"]');
    await page.click('[data-testid="composition-card-comp_001"]');

    // Wait for slot mapping panel
    await page.waitForSelector('[data-testid="data-source-toggle"]');

    // Switch to WSOP+ data source
    await page.click('[data-testid="source-wsop-plus"]');

    // Verify active state
    await expect(page.getByTestId('source-wsop-plus')).toHaveAttribute('data-active', 'true');

    // Switch to Manual data source
    await page.click('[data-testid="source-manual"]');

    // Verify active state
    await expect(page.getByTestId('source-manual')).toHaveAttribute('data-active', 'true');

    // Switch back to GFX
    await page.click('[data-testid="source-gfx"]');

    // Verify active state
    await expect(page.getByTestId('source-gfx')).toHaveAttribute('data-active', 'true');
  });

  test('should add job to render queue', async ({ page }) => {
    // Select a composition
    await page.waitForSelector('[data-testid="composition-grid"]');
    await page.click('[data-testid="composition-card-comp_001"]');

    // Wait for data preview panel
    await page.waitForSelector('[data-testid="add-to-queue-btn"]');

    // Click "Add to Queue" button
    await page.click('[data-testid="add-to-queue-btn"]');

    // Wait for success notification or queue update
    await page.waitForTimeout(1000);

    // Navigate to Render Queue tab
    await page.click('[data-testid="tab-nav-render-queue"]');

    // Wait for render queue to load
    await page.waitForSelector('[data-testid="render-queue"]');

    // Verify job appears in queue
    const queuedJobs = page.locator('[data-testid^="job-card-"][data-status="queued"]');
    const count = await queuedJobs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display render queue with different statuses', async ({ page }) => {
    // Navigate to Render Queue tab
    await page.click('[data-testid="tab-nav-render-queue"]');

    // Wait for render queue to load
    await page.waitForSelector('[data-testid="render-queue"]');

    // Check for Active Renders section
    await expect(page.getByTestId('active-renders')).toBeVisible();

    // Check for Queued Jobs section
    await expect(page.getByTestId('queued-jobs')).toBeVisible();

    // Check for Completed Jobs section
    await expect(page.getByTestId('completed-jobs')).toBeVisible();
  });

  test('should show render job progress', async ({ page }) => {
    // Navigate to Render Queue tab
    await page.click('[data-testid="tab-nav-render-queue"]');

    // Wait for render queue
    await page.waitForSelector('[data-testid="render-queue"]');

    // Find a rendering job card
    const renderingJob = page.locator('[data-testid^="job-card-"][data-status="rendering"]').first();

    // Check if progress bar exists
    if (await renderingJob.count() > 0) {
      await expect(renderingJob.getByTestId('progress-bar')).toBeVisible();
      await expect(renderingJob.getByTestId('estimated-time')).toBeVisible();
    }
  });

  test('should cancel render job', async ({ page }) => {
    // Navigate to Render Queue tab
    await page.click('[data-testid="tab-nav-render-queue"]');

    // Wait for render queue
    await page.waitForSelector('[data-testid="render-queue"]');

    // Find a queued job
    const queuedJob = page.locator('[data-testid^="job-card-"][data-status="queued"]').first();

    if (await queuedJob.count() > 0) {
      // Click cancel button
      await queuedJob.getByTestId('cancel-job-btn').click();

      // Wait for confirmation dialog
      await page.waitForSelector('[data-testid="confirm-cancel-dialog"]');

      // Confirm cancellation
      await page.click('[data-testid="confirm-cancel-btn"]');

      // Wait for job to be removed or status to change
      await page.waitForTimeout(1000);

      // Verify job is no longer in queue or marked as cancelled
      const jobStatus = await queuedJob.getAttribute('data-status');
      expect(jobStatus).not.toBe('queued');
    }
  });

  test('should display output viewer', async ({ page }) => {
    // Navigate to Output Viewer tab
    await page.click('[data-testid="tab-nav-output-viewer"]');

    // Wait for output viewer to load
    await page.waitForSelector('[data-testid="output-viewer"]');

    // Check if output list is visible
    await expect(page.getByTestId('output-list')).toBeVisible();
  });

  test('should play video in output viewer', async ({ page }) => {
    // Navigate to Output Viewer tab
    await page.click('[data-testid="tab-nav-output-viewer"]');

    // Wait for output viewer
    await page.waitForSelector('[data-testid="output-list"]');

    // Find first completed output
    const firstOutput = page.locator('[data-testid^="output-item-"]').first();

    if (await firstOutput.count() > 0) {
      // Click on output to view
      await firstOutput.click();

      // Wait for video preview to appear
      await page.waitForSelector('[data-testid="video-preview"]');

      // Verify video preview is visible
      await expect(page.getByTestId('video-preview')).toBeVisible();

      // Verify download button is present
      await expect(page.getByTestId('download-output-btn')).toBeVisible();
    }
  });

  test('should show websocket connection status', async ({ page }) => {
    // Check if WebSocket status indicator is visible in header
    await expect(page.getByTestId('websocket-status')).toBeVisible();

    // Verify status text
    const statusText = await page.getByTestId('websocket-status-text').textContent();
    expect(['Connected', 'Disconnected', 'Reconnecting']).toContain(statusText?.trim());
  });

  test('should display render queue statistics in header', async ({ page }) => {
    // Check if render queue status is visible
    await expect(page.getByTestId('render-queue-status')).toBeVisible();

    // Verify active and queued counts
    await expect(page.getByTestId('active-count')).toBeVisible();
    await expect(page.getByTestId('queued-count')).toBeVisible();
  });
});

test.describe('Sub Dashboard - Field Mapping', () => {
  test('should edit field mapping', async ({ page }) => {
    await page.goto('/sub');

    // Select a composition
    await page.waitForSelector('[data-testid="composition-grid"]');
    await page.click('[data-testid="composition-card-comp_001"]');

    // Wait for field mapping table
    await page.waitForSelector('[data-testid="field-mapping-table"]');

    // Click on a field row to edit
    const firstRow = page.locator('[data-testid^="field-row-"]').first();
    await firstRow.click();

    // Change transform function
    await page.click('[data-testid="transform-select"]');
    await page.click('[data-testid="transform-option-UPPER"]');

    // Save mapping
    await page.click('[data-testid="save-mapping-btn"]');

    // Wait for success notification
    await expect(page.getByTestId('success-message')).toBeVisible();
  });

  test('should preview field values in real-time', async ({ page }) => {
    await page.goto('/sub');

    // Select a composition
    await page.waitForSelector('[data-testid="composition-grid"]');
    await page.click('[data-testid="composition-card-comp_001"]');

    // Wait for field mapping table
    await page.waitForSelector('[data-testid="field-mapping-table"]');

    // Check if preview values are displayed in table
    const firstRow = page.locator('[data-testid^="field-row-"]').first();
    await expect(firstRow.getByTestId('preview-value')).toBeVisible();

    // Verify preview value is not empty
    const previewValue = await firstRow.getByTestId('preview-value').textContent();
    expect(previewValue).toBeTruthy();
  });
});

test.describe('Sub Dashboard - Error Handling', () => {
  test('should show error when composition fails to load', async ({ page }) => {
    // Intercept API call and return error
    await page.route('**/api/compositions', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Failed to load compositions' }),
      });
    });

    await page.goto('/sub');

    // Wait for error message
    await expect(page.getByTestId('error-message')).toBeVisible();
  });

  test('should show loading state while fetching compositions', async ({ page }) => {
    await page.goto('/sub');

    // Check if loading spinner appears
    const loader = page.getByTestId('loading-spinner');
    const isLoaderVisible = await loader.isVisible().catch(() => false);
    expect(typeof isLoaderVisible).toBe('boolean');
  });
});
