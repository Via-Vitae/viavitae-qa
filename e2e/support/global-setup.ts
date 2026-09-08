/**
 * Playwright global setup — staging health check.
 *
 * Referenced as a file path string in playwright.config.ts globalSetup.
 */
export default async function globalSetup(): Promise<void> {
  if (!process.env.CI) return; // local runs: developer's responsibility
  const target = process.env.BASE_URL_WEB ?? process.env.BASE_URL_DEMO ?? "http://localhost:3000";
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
