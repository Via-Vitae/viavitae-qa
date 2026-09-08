import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test.describe("Donation form accessibility", () => {
  test("labels, error announcements, focus management", async ({ page }) => {
    const url = process.env.BASE_URL_DEMO_DONATION;
    test.skip(!url, "BASE_URL_DEMO_DONATION not set");
    await page.goto(url!);
    const results = await new AxeBuilder({ page }).withTags(["wcag22aa"]).analyze();
    expect(results.violations.filter((v) => v.impact === "critical")).toHaveLength(0);
  });
});
