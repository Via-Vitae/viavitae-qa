import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright base configuration for viavitae-qa.
 *
 * Projects: chromium, firefox, mobile-chrome (mobile Safari requires a macOS
 * host and is not included in CI). Trace on first retry, screenshot only on
 * failure. Environment URLs come from .env (populated by GitHub Environments).
 */

const baseURL = process.env.BASE_URL_DEMO_BASILICA ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e/specs",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["html", { open: "never" }], ["list"]]
    : [["html"], ["list"]],
  outputDir: "test-results",

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "lt-LT",
    timezoneId: "Europe/Vilnius",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
    },
  ],

  /* Staging health-check: skip the full matrix if staging is unreachable. */
  globalSetup: undefined,

  webServer: undefined, // Staging is remote; no local dev server needed.
});
