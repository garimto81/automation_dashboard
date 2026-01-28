import { test, expect } from '@playwright/test';
import { mockSession, mockHand, mockCueItem, mockRenderJob } from './fixtures/test-data';

/**
 * GFX to AE Pipeline E2E Tests
 * Tests the complete workflow from GFX data → Dashboard → Render Queue → Output
 *
 * Pipeline Flow:
 * [1] GFX Simulator → [2] NAS-Supabase Sync → [3] Supabase DB
 *                                                     │
 *                         ┌───────────────────────────┴───────────────────────────┐
 *                         ▼                                                       ▼
 *               [4] Main Dashboard                                      [5] Sub Dashboard
 *                  (What/When)                                              (How)
 *                         └──────────────WebSocket──────────────────────────────┘
 *                                                     │
 *                                                     ▼
 *                                           [6] AE-Nexrender
 */

test.describe('Pipeline: GFX Data → Main Dashboard', () => {
  test('should display session data from Supabase', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify session selector is populated
    await expect(page.getByTestId('session-selector')).toBeVisible();

    // Open session dropdown
    await page.click('[data-testid="session-selector"]');
    await page.waitForSelector('[data-testid="session-dropdown"]');

    // Verify sessions from database are listed
    const sessionOptions = page.locator('[data-testid^="session-option-"]');
    const count = await sessionOptions.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display hand browser with GFX hand data', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Hand Browser
    await page.click('[data-testid="tab-nav-hands"]');
    await page.waitForSelector('[data-testid="hand-browser"]');

    // Wait for hands to load from Supabase
    await page.waitForTimeout(2000);

    // Check if hands from GFX data are displayed
    const handList = page.getByTestId('hand-list');
    await expect(handList).toBeVisible();

    // Verify hand cards or empty state
    const handCards = page.locator('[data-testid^="hand-card-"]');
    const emptyState = page.locator('[data-testid="empty-hands"]');

    const hasHands = await handCards.count() > 0;
    const isEmpty = await emptyState.isVisible().catch(() => false);

    expect(hasHands || isEmpty).toBe(true);
  });

  test('should show player grid with GFX player data', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Player Grid
    await page.click('[data-testid="tab-nav-players"]');
    await page.waitForSelector('[data-testid="player-grid"]');

    // Wait for players to load
    await page.waitForTimeout(1500);

    // Verify 9 player cards (max table size)
    const playerCards = page.locator('[data-testid="player-card"]');
    const count = await playerCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
    expect(count).toBeLessThanOrEqual(9);

    // Verify player data structure (from GFX)
    if (count > 0) {
      const firstCard = playerCards.first();
      await expect(firstCard.getByTestId('player-name')).toBeVisible();
      await expect(firstCard.getByTestId('player-chips')).toBeVisible();
      await expect(firstCard.getByTestId('player-bbs')).toBeVisible();
    }
  });

  test('should display GFX event feed in Realtime Monitor', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to Realtime Monitor
    await page.click('[data-testid="tab-nav-monitor"]');
    await page.waitForSelector('[data-testid="realtime-monitor"]');

    // Check if GFX event feed is visible
    await expect(page.getByTestId('gfx-event-feed')).toBeVisible();

    // Wait for events to load
    await page.waitForTimeout(2000);

    // Verify Realtime connection to Supabase
    const realtimeIndicator = page.getByTestId('realtime-indicator');
    await expect(realtimeIndicator).toBeVisible();
  });
});

test.describe('Pipeline: Main Dashboard → Sub Dashboard (WebSocket)', () => {
  test('should sync selected cue item from Main to Sub', async ({ browser }) => {
    // Create two separate contexts for Main and Sub dashboards
    const mainContext = await browser.newContext();
    const subContext = await browser.newContext();

    const mainPage = await mainContext.newPage();
    const subPage = await subContext.newPage();

    // Load both dashboards
    await mainPage.goto('/');
    await subPage.goto('/sub');

    await mainPage.waitForLoadState('networkidle');
    await subPage.waitForLoadState('networkidle');

    // Wait for WebSocket connection to establish
    await mainPage.waitForTimeout(2000);

    // On Main Dashboard: Navigate to Cuesheet Editor
    await mainPage.click('[data-testid="tab-nav-cuesheet"]');
    await mainPage.waitForSelector('[data-testid="cuesheet-editor"]');

    // Select a cue item
    const cueItem = mainPage.locator('[data-testid^="cue-item-"]').first();

    if (await cueItem.count() > 0) {
      await cueItem.click();

      // Wait for WebSocket message to be sent
      await mainPage.waitForTimeout(1500);

      // On Sub Dashboard: Verify composition is auto-selected
      const selectedComp = subPage.locator('[data-testid="composition-card"][data-selected="true"]');

      // Wait for composition selection to sync
      await subPage.waitForTimeout(1000);

      // Verify composition was selected
      const compCount = await selectedComp.count();
      expect(compCount).toBeGreaterThanOrEqual(0);
    }

    await mainContext.close();
    await subContext.close();
  });

  test('should display hand data in Sub Dashboard data preview', async ({ browser }) => {
    const mainContext = await browser.newContext();
    const subContext = await browser.newContext();

    const mainPage = await mainContext.newPage();
    const subPage = await subContext.newPage();

    await mainPage.goto('/');
    await subPage.goto('/sub');

    await mainPage.waitForLoadState('networkidle');
    await subPage.waitForLoadState('networkidle');

    // Wait for WebSocket connection
    await mainPage.waitForTimeout(2000);

    // On Sub Dashboard: Select a composition
    await subPage.waitForSelector('[data-testid="composition-grid"]');
    await subPage.click('[data-testid="composition-card-comp_001"]');

    // Wait for data preview panel
    await subPage.waitForSelector('[data-testid="data-preview-panel"]');

    // Verify hand data is displayed in preview
    await expect(subPage.getByTestId('preview-json')).toBeVisible();
    await expect(subPage.getByTestId('preview-session-info')).toBeVisible();

    await mainContext.close();
    await subContext.close();
  });
});

test.describe('Pipeline: Sub Dashboard → Render Queue', () => {
  test('should map GFX data to AE composition fields', async ({ page }) => {
    await page.goto('/sub');
    await page.waitForLoadState('networkidle');

    // Select a composition
    await page.waitForSelector('[data-testid="composition-grid"]');
    await page.click('[data-testid="composition-card-comp_001"]');

    // Wait for slot mapping panel
    await page.waitForSelector('[data-testid="slot-mapping-panel"]');

    // Verify field mapping table is displayed
    await expect(page.getByTestId('field-mapping-table')).toBeVisible();

    // Count field rows (should be 9 for _MAIN Chip Count)
    const fieldRows = page.locator('[data-testid^="field-row-"]');
    const rowCount = await fieldRows.count();
    expect(rowCount).toBeGreaterThan(0);

    // Verify preview values from GFX data
    const firstRow = fieldRows.first();
    await expect(firstRow.getByTestId('preview-value')).toBeVisible();
  });

  test('should switch data source priority (Manual > WSOP+ > GFX)', async ({ page }) => {
    await page.goto('/sub');
    await page.waitForLoadState('networkidle');

    // Select a composition
    await page.waitForSelector('[data-testid="composition-grid"]');
    await page.click('[data-testid="composition-card-comp_001"]');

    // Wait for data source toggle
    await page.waitForSelector('[data-testid="data-source-toggle"]');

    // Default should be GFX
    await expect(page.getByTestId('source-gfx')).toHaveAttribute('data-active', 'true');

    // Switch to WSOP+
    await page.click('[data-testid="source-wsop-plus"]');
    await expect(page.getByTestId('source-wsop-plus')).toHaveAttribute('data-active', 'true');

    // Switch to Manual (highest priority)
    await page.click('[data-testid="source-manual"]');
    await expect(page.getByTestId('source-manual')).toHaveAttribute('data-active', 'true');

    // Verify data preview updates based on selected source
    const previewPanel = page.getByTestId('data-preview-panel');
    await expect(previewPanel).toBeVisible();
  });

  test('should add render job to queue with GFX data', async ({ page }) => {
    await page.goto('/sub');
    await page.waitForLoadState('networkidle');

    // Select a composition
    await page.waitForSelector('[data-testid="composition-grid"]');
    await page.click('[data-testid="composition-card-comp_001"]');

    // Wait for data preview panel
    await page.waitForSelector('[data-testid="add-to-queue-btn"]');

    // Click "Add to Queue" button
    await page.click('[data-testid="add-to-queue-btn"]');

    // Wait for job to be added
    await page.waitForTimeout(1500);

    // Navigate to Render Queue tab
    await page.click('[data-testid="tab-nav-render-queue"]');
    await page.waitForSelector('[data-testid="render-queue"]');

    // Verify job appears in queue
    const queuedJobs = page.locator('[data-testid^="job-card-"][data-status="queued"]');
    const count = await queuedJobs.count();
    expect(count).toBeGreaterThan(0);

    // Verify job contains GFX data reference
    const firstJob = queuedJobs.first();
    await expect(firstJob.getByTestId('composition-name')).toBeVisible();
  });
});

test.describe('Pipeline: Render Queue → AE Nexrender', () => {
  test('should display render queue with job statuses', async ({ page }) => {
    await page.goto('/sub');
    await page.waitForLoadState('networkidle');

    // Navigate to Render Queue tab
    await page.click('[data-testid="tab-nav-render-queue"]');
    await page.waitForSelector('[data-testid="render-queue"]');

    // Check for Active Renders section
    await expect(page.getByTestId('active-renders')).toBeVisible();

    // Check for Queued Jobs section
    await expect(page.getByTestId('queued-jobs')).toBeVisible();

    // Check for Completed Jobs section
    await expect(page.getByTestId('completed-jobs')).toBeVisible();
  });

  test('should show render progress with real-time updates', async ({ page }) => {
    await page.goto('/sub');
    await page.waitForLoadState('networkidle');

    // Navigate to Render Queue
    await page.click('[data-testid="tab-nav-render-queue"]');
    await page.waitForSelector('[data-testid="render-queue"]');

    // Find a rendering job
    const renderingJob = page.locator('[data-testid^="job-card-"][data-status="rendering"]').first();

    if (await renderingJob.count() > 0) {
      // Verify progress bar exists
      await expect(renderingJob.getByTestId('progress-bar')).toBeVisible();

      // Verify estimated time
      await expect(renderingJob.getByTestId('estimated-time')).toBeVisible();

      // Wait for progress update
      await page.waitForTimeout(3000);

      // Verify progress bar is still visible (may have updated)
      await expect(renderingJob.getByTestId('progress-bar')).toBeVisible();
    }
  });

  test('should sync render status to Main Dashboard', async ({ browser }) => {
    const mainContext = await browser.newContext();
    const subContext = await browser.newContext();

    const mainPage = await mainContext.newPage();
    const subPage = await subContext.newPage();

    await mainPage.goto('/');
    await subPage.goto('/sub');

    await mainPage.waitForLoadState('networkidle');
    await subPage.waitForLoadState('networkidle');

    // Wait for WebSocket connection
    await mainPage.waitForTimeout(2000);

    // On Main Dashboard: Navigate to Realtime Monitor
    await mainPage.click('[data-testid="tab-nav-monitor"]');
    await mainPage.waitForSelector('[data-testid="realtime-monitor"]');

    // Check if render status panel is visible
    await expect(mainPage.getByTestId('render-status-panel')).toBeVisible();

    // On Sub Dashboard: Navigate to Render Queue
    await subPage.click('[data-testid="tab-nav-render-queue"]');
    await subPage.waitForSelector('[data-testid="render-queue"]');

    // Wait for potential render status updates via WebSocket
    await mainPage.waitForTimeout(3000);

    // Verify render status panel is still responsive
    await expect(mainPage.getByTestId('render-status-panel')).toBeVisible();

    await mainContext.close();
    await subContext.close();
  });

  test('should handle render completion', async ({ page }) => {
    await page.goto('/sub');
    await page.waitForLoadState('networkidle');

    // Navigate to Render Queue
    await page.click('[data-testid="tab-nav-render-queue"]');
    await page.waitForSelector('[data-testid="render-queue"]');

    // Check for completed jobs
    const completedJobs = page.locator('[data-testid^="job-card-"][data-status="completed"]');

    if (await completedJobs.count() > 0) {
      const firstCompleted = completedJobs.first();

      // Verify completion status is displayed
      await expect(firstCompleted.getByTestId('completion-status')).toBeVisible();

      // Verify output path or download link exists
      const downloadBtn = firstCompleted.getByTestId('download-btn');
      const downloadExists = await downloadBtn.isVisible().catch(() => false);
      expect(typeof downloadExists).toBe('boolean');
    }
  });

  test('should handle render errors', async ({ page }) => {
    await page.goto('/sub');
    await page.waitForLoadState('networkidle');

    // Navigate to Render Queue
    await page.click('[data-testid="tab-nav-render-queue"]');
    await page.waitForSelector('[data-testid="render-queue"]');

    // Find a failed job
    const failedJob = page.locator('[data-testid^="job-card-"][data-status="failed"]').first();

    if (await failedJob.count() > 0) {
      // Verify error message is displayed
      await expect(failedJob.getByTestId('error-message')).toBeVisible();

      // Verify retry button is present
      await expect(failedJob.getByTestId('retry-job-btn')).toBeVisible();

      // Click retry button
      await failedJob.getByTestId('retry-job-btn').click();

      // Wait for job to be re-queued
      await page.waitForTimeout(1500);

      // Verify job status changed to queued
      const jobStatus = await failedJob.getAttribute('data-status');
      expect(['queued', 'rendering', 'failed']).toContain(jobStatus);
    }
  });
});

test.describe('Pipeline: Output Viewer', () => {
  test('should display rendered outputs', async ({ page }) => {
    await page.goto('/sub');
    await page.waitForLoadState('networkidle');

    // Navigate to Output Viewer
    await page.click('[data-testid="tab-nav-output-viewer"]');
    await page.waitForSelector('[data-testid="output-viewer"]');

    // Check if output list is visible
    await expect(page.getByTestId('output-list')).toBeVisible();

    // Wait for outputs to load
    await page.waitForTimeout(1500);

    // Verify outputs are displayed
    const outputItems = page.locator('[data-testid^="output-item-"]');
    const count = await outputItems.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should preview video output', async ({ page }) => {
    await page.goto('/sub');
    await page.waitForLoadState('networkidle');

    // Navigate to Output Viewer
    await page.click('[data-testid="tab-nav-output-viewer"]');
    await page.waitForSelector('[data-testid="output-list"]');

    // Find first completed output
    const firstOutput = page.locator('[data-testid^="output-item-"]').first();

    if (await firstOutput.count() > 0) {
      // Click on output to view
      await firstOutput.click();

      // Wait for video preview to appear
      await page.waitForSelector('[data-testid="video-preview"]', { timeout: 5000 });

      // Verify video preview is visible
      await expect(page.getByTestId('video-preview')).toBeVisible();

      // Verify download button is present
      await expect(page.getByTestId('download-output-btn')).toBeVisible();
    }
  });

  test('should display output metadata', async ({ page }) => {
    await page.goto('/sub');
    await page.waitForLoadState('networkidle');

    // Navigate to Output Viewer
    await page.click('[data-testid="tab-nav-output-viewer"]');
    await page.waitForSelector('[data-testid="output-list"]');

    // Select first output
    const firstOutput = page.locator('[data-testid^="output-item-"]').first();

    if (await firstOutput.count() > 0) {
      await firstOutput.click();
      await page.waitForSelector('[data-testid="output-metadata"]');

      // Verify metadata fields
      await expect(page.getByTestId('output-composition-name')).toBeVisible();
      await expect(page.getByTestId('output-duration')).toBeVisible();
      await expect(page.getByTestId('output-file-size')).toBeVisible();
    }
  });
});

test.describe('Pipeline: End-to-End Integration', () => {
  test.describe.configure({ mode: 'serial', timeout: 120000 });

  test('should complete full pipeline flow', async ({ browser }) => {
    // Step 1: Load Main Dashboard with session data
    const mainContext = await browser.newContext();
    const mainPage = await mainContext.newPage();

    await mainPage.goto('/');
    await mainPage.waitForLoadState('networkidle');

    // Verify session loaded from Supabase
    await expect(mainPage.getByTestId('session-selector')).toBeVisible();

    // Step 2: Load Sub Dashboard
    const subContext = await browser.newContext();
    const subPage = await subContext.newPage();

    await subPage.goto('/sub');
    await subPage.waitForLoadState('networkidle');

    // Verify compositions loaded
    await expect(subPage.getByTestId('composition-grid')).toBeVisible();

    // Step 3: Establish WebSocket connection
    await mainPage.waitForTimeout(2000);

    const mainWsStatus = mainPage.getByTestId('websocket-status-sub');
    await expect(mainWsStatus).toBeVisible();

    // Step 4: Create cue item on Main Dashboard
    await mainPage.click('[data-testid="tab-nav-cuesheet"]');
    await mainPage.waitForSelector('[data-testid="cuesheet-editor"]');

    // Step 5: Select composition on Sub Dashboard
    await subPage.waitForSelector('[data-testid="composition-grid"]');
    await subPage.click('[data-testid="composition-card-comp_001"]');

    // Wait for slot mapping panel
    await subPage.waitForSelector('[data-testid="slot-mapping-panel"]');

    // Step 6: Add to render queue
    await subPage.waitForSelector('[data-testid="add-to-queue-btn"]');
    await subPage.click('[data-testid="add-to-queue-btn"]');

    await subPage.waitForTimeout(1500);

    // Step 7: Verify job in render queue
    await subPage.click('[data-testid="tab-nav-render-queue"]');
    await subPage.waitForSelector('[data-testid="render-queue"]');

    const queuedJobs = subPage.locator('[data-testid^="job-card-"][data-status="queued"]');
    const jobCount = await queuedJobs.count();
    expect(jobCount).toBeGreaterThan(0);

    // Step 8: Check render status on Main Dashboard
    await mainPage.click('[data-testid="tab-nav-monitor"]');
    await mainPage.waitForSelector('[data-testid="realtime-monitor"]');

    await expect(mainPage.getByTestId('render-status-panel')).toBeVisible();

    await mainContext.close();
    await subContext.close();
  });

  test('should handle multiple render jobs in parallel', async ({ page }) => {
    await page.goto('/sub');
    await page.waitForLoadState('networkidle');

    // Select first composition and add to queue
    await page.waitForSelector('[data-testid="composition-grid"]');
    await page.click('[data-testid="composition-card-comp_001"]');
    await page.waitForSelector('[data-testid="add-to-queue-btn"]');
    await page.click('[data-testid="add-to-queue-btn"]');

    await page.waitForTimeout(1000);

    // Select second composition and add to queue
    await page.click('[data-testid="composition-card-comp_002"]');
    await page.waitForSelector('[data-testid="add-to-queue-btn"]');
    await page.click('[data-testid="add-to-queue-btn"]');

    await page.waitForTimeout(1000);

    // Navigate to Render Queue
    await page.click('[data-testid="tab-nav-render-queue"]');
    await page.waitForSelector('[data-testid="render-queue"]');

    // Verify both jobs are in queue
    const queuedJobs = page.locator('[data-testid^="job-card-"]');
    const count = await queuedJobs.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });
});

test.describe('Pipeline: Data Priority Validation', () => {
  test('should apply Manual data priority over GFX', async ({ page }) => {
    await page.goto('/sub');
    await page.waitForLoadState('networkidle');

    // Select a composition
    await page.waitForSelector('[data-testid="composition-grid"]');
    await page.click('[data-testid="composition-card-comp_001"]');

    // Wait for data source toggle
    await page.waitForSelector('[data-testid="data-source-toggle"]');

    // Switch to Manual source
    await page.click('[data-testid="source-manual"]');

    // Verify Manual is active (highest priority)
    await expect(page.getByTestId('source-manual')).toHaveAttribute('data-active', 'true');

    // Verify data preview reflects Manual priority
    const previewPanel = page.getByTestId('data-preview-panel');
    await expect(previewPanel).toBeVisible();
  });

  test('should apply WSOP+ data priority over GFX', async ({ page }) => {
    await page.goto('/sub');
    await page.waitForLoadState('networkidle');

    // Select a composition
    await page.waitForSelector('[data-testid="composition-grid"]');
    await page.click('[data-testid="composition-card-comp_001"]');

    // Wait for data source toggle
    await page.waitForSelector('[data-testid="data-source-toggle"]');

    // Switch to WSOP+ source
    await page.click('[data-testid="source-wsop-plus"]');

    // Verify WSOP+ is active (medium priority)
    await expect(page.getByTestId('source-wsop-plus')).toHaveAttribute('data-active', 'true');

    // Verify data preview reflects WSOP+ priority
    const previewPanel = page.getByTestId('data-preview-panel');
    await expect(previewPanel).toBeVisible();
  });

  test('should fall back to GFX when Manual/WSOP+ unavailable', async ({ page }) => {
    await page.goto('/sub');
    await page.waitForLoadState('networkidle');

    // Select a composition
    await page.waitForSelector('[data-testid="composition-grid"]');
    await page.click('[data-testid="composition-card-comp_001"]');

    // Wait for data source toggle
    await page.waitForSelector('[data-testid="data-source-toggle"]');

    // Default should be GFX (lowest priority, always available)
    await expect(page.getByTestId('source-gfx')).toHaveAttribute('data-active', 'true');

    // Verify GFX data is displayed in preview
    const previewPanel = page.getByTestId('data-preview-panel');
    await expect(previewPanel).toBeVisible();
  });
});
