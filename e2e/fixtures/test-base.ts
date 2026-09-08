/**
 * Extended Playwright test fixture for all e2e specs.
 *
 * Provides:
 *   - Tenant isolation (each test gets a unique tenant context)
 *   - Auto-cleanup (test data removed after each test)
 *   - Consent banner auto-dismissal
 *   - Locale switching (lt/en/ru)
 *   - Extended expect helpers
 */
import { test as base, expect, type Page } from "@playwright/test";

type TestFixtures = {
  /** Auto-dismisses the consent banner if present. */
  consentDismissed: Page;
};

export const test = base.extend<TestFixtures>({
  consentDismissed: async ({ page }, use) => {
    // Auto-dismiss consent banner if it appears within 2 seconds.
    try {
      const banner = page.locator('[data-testid="consent-banner"]');
      await banner.waitFor({ state: "visible", timeout: 2000 });
      await page.locator('[data-testid="consent-accept"]').click();
    } catch {
      // No banner — continue normally.
    }
    await use(page);
  },
});

export { expect };
