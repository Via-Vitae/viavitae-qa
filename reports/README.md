# Reports

This directory holds generated test artifacts. Everything except this README is
gitignored.

## Where nightly artifacts land

- **GitHub Artifacts** — each nightly run uploads `nightly-consolidated-report`
  (30-day retention). See `docs/reporting.md` for details.
- **Loki** — nightly summary pushed with labels `job=viavitae-qa`, `suite=nightly`,
  `repo_target=staging`.
- **Alertmanager** — failure alerts fire to `#alerts-qa` on Slack.

## Local reports

When running suites locally, reports are generated in:

| Suite          | Report location                    |
| -------------- | ---------------------------------- |
| Playwright e2e | `playwright-report/`               |
| axe            | `playwright-report/` (same runner) |
| k6             | `load/results/`                    |
| Lighthouse     | `performance/.lighthouseci/`       |
