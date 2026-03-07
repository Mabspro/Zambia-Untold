import { test, expect } from "@playwright/test";

test("museum entry does not boot observatory requests before explicit intent", async ({ page }) => {
  const requests: string[] = [];

  await page.route("**/api/space/**", async (route) => {
    requests.push(route.request().url());
    await route.continue();
  });
  await page.route("**/api/earth/**", async (route) => {
    requests.push(route.request().url());
    await route.continue();
  });

  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  const skip = page.getByRole("button", { name: /skip/i });
  if (await skip.isVisible({ timeout: 10000 }).catch(() => false)) {
    await skip.click();
  }

  const notNow = page.getByRole("button", { name: /not now/i });
  if (await notNow.isVisible({ timeout: 1500 }).catch(() => false)) {
    await notNow.click();
  }

  await page.waitForTimeout(1500);
  await expect(page.getByRole("button", { name: /review/i })).toHaveCount(0);
  expect(requests).toEqual([]);

  await page.getByRole("button", { name: /observe the present/i }).click();
  await expect.poll(() => requests.length, { timeout: 10000 }).toBeGreaterThan(0);
});
