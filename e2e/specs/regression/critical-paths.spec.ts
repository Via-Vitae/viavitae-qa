import { test, expect } from "../../fixtures/test-base";
test.describe("Critical paths regression", () => {
  test("homepage → pricing → product → assessment golden path", async ({ page }) => {
    const webUrl = process.env.STAGING_WEB_URL;
    test.skip(!webUrl, "STAGING_WEB_URL not set");
    await page.goto(webUrl!);
    await page.click('[data-testid="nav-pricing"]');
    await expect(page).toHaveURL(/pricing/);
    await page.click('[data-testid="nav-product"]');
    await expect(page).toHaveURL(/product/);
    await page.click('[data-testid="cta-assessment"]');
    await expect(page.locator('[data-testid="assessment-form"]')).toBeVisible();
  });
});
