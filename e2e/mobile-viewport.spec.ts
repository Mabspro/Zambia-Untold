import { test, expect, type Page } from "@playwright/test";

const VIEWPORTS = [
  { width: 320, height: 640, label: "320x640" },
  { width: 360, height: 800, label: "360x800" },
  { width: 390, height: 844, label: "390x844" },
  { width: 430, height: 932, label: "430x932" },
] as const;

async function resetClientState(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
}

async function dismissReentryPrompt(page: Page) {
  const dismiss = page.getByRole("button", { name: /^dismiss$/i });
  if (await dismiss.isVisible({ timeout: 1500 }).catch(() => false)) {
    await dismiss.click();
  }
}

async function handleLowFiPrompt(page: Page) {
  const notNow = page.getByRole("button", { name: /not now/i });
  if (await notNow.isVisible({ timeout: 1500 }).catch(() => false)) {
    await notNow.click();
  }
}

async function skipLobby(page: Page) {
  const skip = page.getByRole("button", { name: /skip/i });
  if (await skip.isVisible({ timeout: 10_000 }).catch(() => false)) {
    await skip.click();
  }
}

async function expectInViewport(page: Page, locator: ReturnType<Page["locator"]>, viewportWidth: number) {
  if (!(await locator.first().isVisible().catch(() => false))) return;
  const box = await locator.first().boundingBox();
  if (!box) return;
  const tolerance = 2;
  expect(box.x).toBeGreaterThanOrEqual(-tolerance);
  expect(box.x + box.width).toBeLessThanOrEqual(viewportWidth + tolerance);
}

test.describe("Strict mobile viewport audit", () => {
  for (const vp of VIEWPORTS) {
    test(`no horizontal overflow at ${vp.label}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await resetClientState(page);
      await page.goto("/");
      await skipLobby(page);
      await handleLowFiPrompt(page);
      await dismissReentryPrompt(page);
      await handleLowFiPrompt(page);
      await dismissReentryPrompt(page);
      await page.waitForTimeout(2200);

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

      await page.screenshot({
        path: `test-results/mobile-audit-${vp.width}-base.png`,
        fullPage: true,
      });
    });

    test(`mission + nav + live HUD bounds at ${vp.label}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await resetClientState(page);
      await page.goto("/");
      await skipLobby(page);
      await handleLowFiPrompt(page);
      await dismissReentryPrompt(page);
      await page.waitForTimeout(2500);

      const missionPanel = page.getByText("ZAMBIA UNTOLD · MISSION SYSTEM", { exact: false });
      const actionNav = page.getByRole("navigation");
      const mobileHud = page.getByText("Space Signal", { exact: false });

      await expect(actionNav).toBeVisible({ timeout: 12_000 });
      await expectInViewport(page, missionPanel, vp.width);
      await expectInViewport(page, actionNav, vp.width);
      await expectInViewport(page, mobileHud, vp.width);

      await page.screenshot({
        path: `test-results/mobile-audit-${vp.width}-hud.png`,
        fullPage: true,
      });
    });

    test(`narrative panel tabs + export reachable at ${vp.label}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await resetClientState(page);
      await page.goto("/");
      await skipLobby(page);
      await handleLowFiPrompt(page);
      await dismissReentryPrompt(page);
      await page.waitForTimeout(2000);

      // Open map layers and jump to a marker to force the narrative panel open.
      const mapLayers = page.getByRole("button", { name: /map layers/i });
      await mapLayers.click();

      const jumpToNkoloso = page.getByRole("button", { name: /jump to nkoloso/i });
      await expect(jumpToNkoloso).toBeVisible({ timeout: 8000 });
      await jumpToNkoloso.click();

      const storyTab = page.getByRole("button", { name: /^story$/i });
      const mythologyTab = page.getByRole("button", { name: /^mythology$/i });
      const evidenceTab = page.getByRole("button", { name: /^evidence$/i });
      const exportBrief = page.getByRole("button", { name: /export brief/i });

      await expect(storyTab).toBeVisible({ timeout: 8000 });
      await expect(mythologyTab).toBeVisible();
      await expect(evidenceTab).toBeVisible();
      await expect(exportBrief).toBeVisible();

      await expectInViewport(page, storyTab, vp.width);
      await expectInViewport(page, mythologyTab, vp.width);
      await expectInViewport(page, evidenceTab, vp.width);
      await expectInViewport(page, exportBrief, vp.width);

      await page.screenshot({
        path: `test-results/mobile-audit-${vp.width}-narrative.png`,
        fullPage: true,
      });
    });
  }
});





