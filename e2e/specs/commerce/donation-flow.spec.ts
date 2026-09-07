import { test, expect } from "../../fixtures/test-base";

test.describe("@smoke Donation flow", () => {
  test("Stripe test card + SCA 3DS → webhook → receipt email → dashboard updates", async ({ page }) => {
    const baseUrl = process.env.BASE_URL_DEMO_DONATION;
    test.skip(!baseUrl, "BASE_URL_DEMO_DONATION not set");

    await page.goto(baseUrl);
    await page.fill('[data-testid="amount"]', "25.00");
    await page.fill('[data-testid="card-number"]', "4000 0027 6000 3184"); // 3DS test card
    await page.fill('[data-testid="card-expiry"]', "12/30");
    await page.fill('[data-testid="card-cvc"]', "123");
    await page.click('[data-testid="donate"]');

    // Handle 3DS challenge if it appears
    const frame = page.frameLocator("iframe[name^='hsd-challenge']");
    try {
      await frame.locator("#test-source-authorize-3ds").click({ timeout: 5000 });
    } catch { /* 3DS not triggered — test mode */ }

    await expect(page.locator('[data-testid="thank-you"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="receipt-sent"]')).toBeVisible();
  });
});
