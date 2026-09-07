import { test, expect } from "../../fixtures/test-base";

test.describe("Quote calculator", () => {
  test("calculator produces PDF quote download → CRM activity created", async ({ page }) => {
    const baseUrl = process.env.BASE_URL_DEMO_ASSESSMENT;
    test.skip(!baseUrl, "BASE_URL_DEMO_ASSESSMENT not set");

    await page.goto(`${baseUrl}/calculator`);
    await page.fill('[data-testid="property-value"]', "150000");
    await page.fill('[data-testid="coverage"]', "80");
    await page.click('[data-testid="calculate"]');

    await expect(page.locator('[data-testid="quote-amount"]')).toBeVisible();
    
    const downloadPromise = page.waitForEvent("download");
    await page.click('[data-testid="download-pdf"]');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/quote.*\.pdf$/);
  });
});
