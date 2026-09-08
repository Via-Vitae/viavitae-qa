import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright base configuration for viavitae-qa.
 *
 * Projects:
 *   - web-chromium: funnel, commerce, AI, IAM, GIS, i18n, regression specs
 *   - demo-chromium: demo template and reset specs
 *   - firefox: regression only (EU public-sector clients)
 *   - mobile-chrome: regression only (≥60% church-audience traffic)
 *
 * Trace on first retry, screenshot only on failure. Environment URLs come from
 * GitHub Environments (populated as vars in the workflow).
 */

const webURL = process.env.BASE_URL_WEB ?? "http://localhost:3000";
const demoURL = process.env.BASE_URL_DEMO ?? "http://localhost:3001";

export default defineConfig({
  testDir: "./e2e/specs",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : [["html"], ["list"]],
  outputDir: "test-results",
  globalSetup: "./e2e/support/global-setup.ts",

  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "lt-LT",
    timezoneId: "Europe/Vilnius",
  },

  projects: [
    {
      name: "web-chromium",
      testMatch: /^(?!.*demos\/).*/,
      use: { ...devices["Desktop Chrome"], baseURL: webURL },
    },
    {
      name: "demo-chromium",
      testMatch: /demos\/.*/,
      use: { ...devices["Desktop Chrome"], baseURL: demoURL },
    },
    {
      name: "firefox",
      testMatch: /regression\/.*/,
      use: { ...devices["Desktop Firefox"], baseURL: webURL },
    },
    {
      name: "mobile-chrome",
      testMatch: /regression\/.*/,
      use: { ...devices["Pixel 7"], baseURL: webURL },
    },
  ],

  webServer: undefined, // Staging is remote; no local dev server needed.
});
