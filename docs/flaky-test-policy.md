# Flaky Test Policy

A flaky test is one that passes and fails on the same code without any change to the
application under test. Flaky tests erode trust in CI, waste reviewer time, and mask
real regressions. This policy defines how flakes are identified, quarantined, and
resolved.

---

## Detection

Flakes are detected from nightly e2e results (`nightly-e2e.yml`). A test is counted as
flaky when it:

1. Passes in one nightly run and fails in another within a 30-day rolling window,
   **without** any code change to the spec or the application under test.
2. Fails on retry within the same run (Playwright `retries: 2` is configured).

## Quarantine process

```
Flake detected (nightly report)
        │
        ▼
3 flakes in 30 days for the same spec?
        │
   Yes ─┤─ No
   │         │
   ▼         ▼
Auto-create        Continue monitoring
quarantine issue
   │
   ▼
Tag spec with @quarantined
   │
   ▼
Remove from CI gate
(nightly report only)
   │
   ▼
5 business day fix SLA
   │
   ├─ Fixed → remove @quarantined, restore to CI
   │
   └─ Not fixed → delete the spec
```

### Step by step

1. **Detection.** The nightly report job identifies specs that have failed ≥ 3 times
   in the last 30 nightly runs (excluding runs where staging was unavailable).

2. **Issue creation.** An issue is automatically created (or updated if one already
   exists) with the label `type/flaky-test` and the affected spec path.

3. **Quarantine tag.** The spec is tagged with `@quarantined` in its Playwright
   annotation. Quarantined specs are excluded from `pr-smoke.yml` and from the
   nightly CI gate (they still run but their failure does not fail the job).

4. **Fix SLA.** The assignee has **5 business days** to fix the flake. If the spec
   is not fixed within the SLA, it is **deleted**.

5. **Resolution.** If fixed, the `@quarantined` tag is removed and the spec is
   restored to the CI gate. If deleted, a new spec covering the same path must be
   written before the gap is accepted.

## Tagging convention

```typescript
// In a Playwright spec:
test.describe("@quarantined", () => {
  test("flaky assessment funnel", async ({ page }) => {
    // ...
  });
});
```

Playwright's `--grep` is used to exclude quarantined specs:

```bash
# CI runs everything except @quarantined
npx playwright test --grep-invert @quarantined
```

## Metrics

The nightly report includes a flake summary:

| Metric             | Target                                       |
| ------------------ | -------------------------------------------- |
| Total specs        | Count of all active specs                    |
| Quarantined        | Count of `@quarantined` specs                |
| Flakes this week   | New specs that crossed the 3-flake threshold |
| Deleted this month | Specs removed after SLA expiry               |
| Fix rate           | % of quarantined specs fixed within SLA      |

## Prevention

Preventing flakes is cheaper than quarantining them:

1. **Avoid timing-dependent assertions.** Use `waitForSelector` or `waitForResponse`
   instead of `page.waitForTimeout()`.
2. **Isolate test data.** Each spec creates its own test data and cleans up after.
   No spec depends on state left by another.
3. **Stub external services.** Mailhog assertions use the API, not polling. Stripe
   test mode uses deterministic test card numbers.
4. **Consent banner handling.** The `test-base.ts` fixture auto-dismisses consent
   banners before each test.
5. **Staging health check.** The nightly workflow checks staging availability first;
   if staging is down, no specs run (preventing false-positive flakes from timeouts).
