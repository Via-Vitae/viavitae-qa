import { test, expect } from "../../fixtures/test-base";
const TEMPLATES = ["assessment", "donation", "ai-assistant", "sso-portal", "store", "cemetery-map", "donor-portal", "i18n", "reset"];
test.describe("Demo templates — banner, disclaimer, CTA", () => {
  for (const tpl of TEMPLATES) {
    test(`${tpl}: banner + disclaimer + CTA present`, async ({ page }) => {
      const url = process.env[`BASE_URL_DEMO_${tpl.replace(/-/g, "_").toUpperCase()}`];
      test.skip(!url, `BASE_URL_DEMO_${tpl.replace(/-/g, "_").toUpperCase()} not set`);
      await page.goto(url!);
      await expect(page.locator('[data-testid="demo-banner"]')).toBeVisible();
      await expect(page.locator('[data-testid="demo-disclaimer"]')).toBeVisible();
      await expect(page.locator('[data-testid="demo-cta"]')).toBeVisible();
    });
  }
});
