import { test, expect } from "../../fixtures/test-base";

test.describe("Demo Make It Mine wizard", () => {
  test("wizard prefills assessment form from demo context", async ({ page }) => {
    const baseUrl = process.env.BASE_URL_DEMO_ASSESSMENT;
    test.skip(!baseUrl, "BASE_URL_DEMO_ASSESSMENT not set");

    await page.goto(`${baseUrl}/wizard`);
    await page.fill('[data-testid="wizard-name"]', "Demo Parish");
    await page.click('[data-testid="wizard-next"]');

    // Verify prefill carried through
    await expect(page.locator('[data-testid="prefilled-name"]')).toHaveText("Demo Parish");
  });
});
