import { test, expect } from "@playwright/test";

/**
 * Mobile viewport check: ensures key bottom-anchored UI is not cut off.
 * See docs/DEVELOPMENT_GUIDELINES.md — Layout invariants.
 *
 * Requires: dev server running (or set CI for auto-start), then:
 *   npx playwright install
 *   npm run test:e2e
 */
test.describe("Mobile viewport — no horizontal cutoff", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("tour panel and action bar stay within viewport when tour is visible", async ({
    page,
  }) => {
    await page.goto("/");

    // Skip lobby so we get to the UI + guided tour quickly
    await page.getByRole("button", { name: /skip/i }).click();

    // Wait for either the guided tour panel or the action bar to be visible
    const tourPanel = page.getByText("ZAMBIA UNTOLD · SYSTEM", { exact: false });
    const actionBar = page.getByRole("navigation");

    await expect(tourPanel.or(actionBar)).toBeVisible({ timeout: 15_000 });

    const viewportWidth = 390;
    const tolerance = 2;

    // Guided tour panel: must not be cut off on left or right
    if ((await tourPanel.first().isVisible())) {
      const box = await tourPanel.first().boundingBox();
      if (box) {
        expect(box.x).toBeGreaterThanOrEqual(-tolerance);
        expect(box.x + box.width).toBeLessThanOrEqual(viewportWidth + tolerance);
      }
    }

    // Action bar (nav): must not be cut off
    if ((await actionBar.first().isVisible())) {
      const box = await actionBar.first().boundingBox();
      if (box) {
        expect(box.x).toBeGreaterThanOrEqual(-tolerance);
        expect(box.x + box.width).toBeLessThanOrEqual(viewportWidth + tolerance);
      }
    }
  });

  test("main content has no horizontal scroll (no viewport drift)", async ({
    page,
  }) => {
    await page.goto("/");

    // Skip lobby
    const skip = page.getByRole("button", { name: /skip/i });
    if (await skip.isVisible()) await skip.click();

    // Wait for page to settle
    await page.waitForTimeout(2000);

    // Body/main should not be wider than viewport (no horizontal scroll)
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });
});
