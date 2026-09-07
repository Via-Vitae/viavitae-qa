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

/**
 * Staging health-check: fail fast if the target is unreachable.
 * Prevents the full nightly matrix from burning 20–40 runner-minutes when
 * staging is down.
 */
async function stagingHealthCheck(): Promise<void> {
  if (!process.env.CI) return; // local runs: developer's responsibility
  const target = process.env.BASE_URL_WEB ?? demoURL;
  const res = await fetch(`${target}/api/health`, {
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
  if (!res?.ok) {
    throw new Error(
      `[globalSetup] staging unreachable: ${target} — aborting suite before runner burn. ` +
        `Check staging status or re-run with BASE_URL_WEB set correctly.`,
    );
  }
}

export default defineConfig({
  testDir: "./e2e/specs",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [["html", { open: "never" }], ["list"]]
    : [["html"], ["list"]],
  outputDir: "test-results",
  globalSetup: stagingHealthCheck,

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
      testMatch: /^(?!.*demos/).*/,
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
