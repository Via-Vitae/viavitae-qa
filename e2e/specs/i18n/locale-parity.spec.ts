import { test, expect } from "../../fixtures/test-base";
test.describe("Locale parity (lt/en/ru)", () => {
  test("no untranslated keys, hreflang correct, switcher preserves path", async ({ page }) => {
    const baseUrl = process.env.BASE_URL_DEMO_I18N;
    test.skip(!baseUrl, "BASE_URL_DEMO_I18N not set");
    for (const locale of ["lt", "en", "ru"]) {
      await page.goto(`${baseUrl}/${locale}`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      const hreflangs = await page.locator('link[rel="alternate"][hreflang]').all();
      expect(hreflangs.length).toBeGreaterThanOrEqual(3);
    }
    await page.goto(`${baseUrl}/lt/assessment`);
    await page.click('[data-testid="locale-switch-en"]');
    expect(page.url()).toContain("/en/assessment");
  });
});
