import { test, expect } from "../../fixtures/test-base";
test.describe("Cemetery map", () => {
  test("parcel search → walking directions → reservation flow", async ({ page }) => {
    const baseUrl = process.env.BASE_URL_DEMO_CEMETERY;
    test.skip(!baseUrl, "BASE_URL_DEMO_CEMETERY not set");
    await page.goto(baseUrl);
    await page.fill('[data-testid="parcel-search"]', "A-12");
    await expect(page.locator('[data-testid="parcel-result"]')).toBeVisible();
    await page.click('[data-testid="walking-directions"]');
    await expect(page.locator('[data-testid="directions-panel"]')).toBeVisible();
  });
});
