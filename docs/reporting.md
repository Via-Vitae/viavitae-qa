# Reporting

This document defines how nightly test results are reported, where artifacts are stored,
how alerts are routed, and the cadence for manual accessibility audits.

---

## Nightly report

The nightly e2e workflow (`nightly-e2e.yml`) produces a consolidated report after all
jobs complete. The report is published to three destinations:

### 1. GitHub Artifacts

Each nightly run uploads a consolidated artifact named `nightly-consolidated-report`
containing:

| Path                         | Contents                                               |
| ---------------------------- | ------------------------------------------------------ |
| `playwright-report/`         | HTML report from Playwright (all browsers, all shards) |
| `test-results/`              | JSON results, screenshots on failure, traces on retry  |
| `load/results/`              | k6 summary JSON and CSV                                |
| `performance/.lighthouseci/` | Lighthouse CI JSON reports                             |

Artifacts are retained for **30 days**. After that, only the GitHub Actions run log
preserves the summary.

### 2. Loki

The nightly report job pushes a summary to Loki for long-term querying:

| Field              | Value                                                                    |
| ------------------ | ------------------------------------------------------------------------ |
| **Endpoint**       | `LOKI_URL` secret (GitHub Environment: `staging`)                        |
| **Authentication** | `LOKI_TOKEN` bearer token                                                |
| **Labels**         | `job=viavitae-qa`, `suite=nightly`, `repo_target=staging`                |
| **Payload**        | JSON of job results (e2e, load, a11y, performance) with pass/fail counts |
| **Timestamp**      | UTC ISO 8601 of the report generation                                    |

Querying Loki:

```logql
{job="viavitae-qa", suite="nightly"} |= "failed"
```

### 3. Alertmanager

If any nightly job fails, an alert is posted to Alertmanager:

| Field           | Value                                                     |
| --------------- | --------------------------------------------------------- |
| **Endpoint**    | `ALERTMANAGER_URL` secret (GitHub Environment: `staging`) |
| **Alert name**  | `viavitae-qa-nightly-failure`                             |
| **Severity**    | `warning`                                                 |
| **Labels**      | `repo=viavitae-qa`, `run_id=<github run id>`              |
| **Annotations** | `summary`, `description` with failure count and run URL   |

Alert routing is managed by viavitae-infra/monitoring. The on-call process is:

1. Alertmanager fires → Slack channel `#alerts-qa`
2. On-call checks the GitHub Actions run URL
3. If staging was unavailable → acknowledge and close (not a real failure)
4. If real failures → triage by suite (e2e, load, a11y, performance)
5. Flaky failures → follow [flaky-test-policy.md](flaky-test-policy.md)

---

## PR smoke report

PR smoke tests (`pr-smoke.yml`) upload artifacts per job:

| Artifact                  | Retention |
| ------------------------- | --------- |
| `playwright-smoke-report` | 14 days   |
| `axe-smoke-report`        | 14 days   |

These are available on the PR's Actions tab. No Loki or Alertmanager integration for
PR runs — failures block the merge via the required status check.

---

## Weekly production report

The weekly Lighthouse CI scan against production URLs (`performance/urls/prod.urls.json`)
uploads its report as a GitHub Artifact (`lighthouse-report`, 7-day retention). This scan
is **informational only**:

- No failure alerts are sent.
- No merge gates are affected.
- Results are reviewed manually during the weekly architecture review.

---

## Manual accessibility audit cadence

The quarterly manual accessibility audit (`a11y/manual/wcag-2.2-aa-checklist.md`) is
enforced by this reporting schedule:

| Quarter      | Audit due    | Owner          |
| ------------ | ------------ | -------------- |
| Q1 (Jan–Mar) | 31 March     | @JourneyOfLife |
| Q2 (Apr–Jun) | 30 June      | @JourneyOfLife |
| Q3 (Jul–Sep) | 30 September | @JourneyOfLife |
| Q4 (Oct–Dec) | 31 December  | @JourneyOfLife |

The audit covers:

1. **Screen reader pass.** NVDA (Windows) and VoiceOver (macOS) walkthrough of the
   assessment funnel, donation flow, and AI assistant.
2. **Keyboard-only navigation.** Full tab path through every demo template.
3. **Focus state review.** Visible focus indicators on all interactive elements.
4. **Colour contrast spot check.** Using the WebAIM contrast checker on any token
   not covered by `@via-vitae/brand` automated verification.

Audit results are recorded as an issue with the label `type/a11y-audit` and linked
to the quarterly changelog entry.

---

## Report format

### Nightly summary (Slack message)

```
📊 Nightly QA Report — 2026-09-07

✅ E2E:        142/145 passed (3 quarantined)
✅ Load:       p95 245ms (budget: 300ms)
⚠️ A11y:      1 violation (templates-axe: donation form label)
✅ Performance: LCP 1.4s (budget: 1.8s)

Staging: healthy
Duration: 47m 12s
Run: https://github.com/Via-Vitae/viavitae-qa/actions/runs/12345
```

### Loki labels

| Label         | Values                               | Purpose               |
| ------------- | ------------------------------------ | --------------------- |
| `job`         | `viavitae-qa`                        | Repository identifier |
| `suite`       | `nightly`, `pr-smoke`, `weekly-prod` | Suite type            |
| `repo_target` | `staging`, `production`              | Environment tested    |
| `run_id`      | GitHub Actions run ID                | Cross-reference       |
