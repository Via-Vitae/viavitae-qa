import { test, expect } from "../../fixtures/test-base";

test.describe("Donor portal — donation history", () => {
  test("shows history and annual statement download", async ({ page }) => {
    const baseUrl = process.env.BASE_URL_DEMO_PORTAL;
    test.skip(!baseUrl, "BASE_URL_DEMO_PORTAL not set");

    await page.goto(`${baseUrl}/donations`);
    await expect(page.locator('[data-testid="donation-list"]')).toBeVisible();

    const downloadPromise = page.waitForEvent("download");
    await page.click('[data-testid="annual-statement"]');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/statement.*\.pdf$/);
  });
});
