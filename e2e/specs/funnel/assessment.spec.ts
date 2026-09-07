import { test, expect } from "../../fixtures/test-base";

test.describe("@smoke Assessment funnel", () => {
  test("form submits → API 201 → booking link present → UTM preserved", async ({ page }) => {
    const baseUrl = process.env.BASE_URL_DEMO_ASSESSMENT;
    test.skip(!baseUrl, "BASE_URL_DEMO_ASSESSMENT not set");

    await page.goto(`${baseUrl}?utm_source=test&utm_campaign=smoke`);
    await page.fill('[data-testid="name"]', "Test Assessment User");
    await page.fill('[data-testid="email"]', "test@example.com");
    await page.click('[data-testid="submit"]');

    // Verify API returned 201 (via network interception or UI confirmation)
    await expect(page.locator('[data-testid="confirmation"]')).toBeVisible();
    await expect(page.locator('[data-testid="booking-link"]')).toBeVisible();

    // UTM parameters preserved in the redirect
    const url = page.url();
    expect(url).toContain("utm_source=test");
    expect(url).toContain("utm_campaign=smoke");
  });
});
