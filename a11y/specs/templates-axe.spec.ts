import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const TEMPLATES = ["assessment", "donation", "ai-assistant", "sso-portal", "store"];
for (const tpl of TEMPLATES) {
  test(`${tpl}: axe scan top 5 routes`, async ({ page }) => {
    const url = process.env[`BASE_URL_DEMO_${tpl.replace(/-/g, "_").toUpperCase()}`];
    test.skip(!url, `BASE_URL_DEMO_${tpl.replace(/-/g, "_").toUpperCase()} not set`);
    await page.goto(url!);
    const results = await new AxeBuilder({ page }).withTags(["wcag22aa"]).analyze();
    expect(results.violations.filter(v => v.impact === "critical")).toHaveLength(0);
  });
}
