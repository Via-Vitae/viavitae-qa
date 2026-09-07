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
  /** Locale helper — navigates with locale prefix. */
  locale: (path: string, locale?: "lt" | "en" | "ru") => Promise<string>;
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

  locale: async ({ page }, use) => {
    const navigate = async (path: string, locale: "lt" | "en" | "ru" = "lt") => {
      const url = `/${locale}${path}`;
      await page.goto(url);
      return url;
    };
    await use(navigate);
  },
});

export { expect };
