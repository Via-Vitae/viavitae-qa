import { test, expect } from "../../fixtures/test-base";

test.describe("Online store checkout", () => {
  test("cart → Paysera sandbox → order confirmation", async ({ page }) => {
    const baseUrl = process.env.BASE_URL_DEMO_STORE;
    test.skip(!baseUrl, "BASE_URL_DEMO_STORE not set");

    await page.goto(baseUrl!);
    await page.click('[data-testid="add-to-cart"]:first-child');
    await page.click('[data-testid="checkout"]');
    await page.fill('[data-testid="email"]', "store-test@example.com");
    await page.click('[data-testid="pay-with-paysera"]');

    // Paysera sandbox redirect
    await expect(page).toHaveURL(/paysera/, { timeout: 10000 });
  });
});
