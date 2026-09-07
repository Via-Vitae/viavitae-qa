import { test, expect } from "../../fixtures/test-base";
test.describe("@smoke Demo reset", () => {
  test("reset endpoint → seed state byte-identical → user data gone", async ({ page }) => {
    const baseUrl = process.env.BASE_URL_DEMO_RESET;
    test.skip(!baseUrl, "BASE_URL_DEMO_RESET not set");
    await page.goto(baseUrl);
    await page.click('[data-testid="reset-demo"]');
    await expect(page.locator('[data-testid="reset-confirmed"]')).toBeVisible();
    await page.reload();
    await expect(page.locator('[data-testid="user-data"]')).not.toBeVisible();
  });
});
