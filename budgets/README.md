# Performance Budgets — Single Source of Truth

This directory is the **single source of truth** for all performance budgets in the
ViaVitae organisation. Every consuming repository inherits these values via shared
workflows or direct import.

**Changing a budget here changes CI gates in every repo.**

---

## Files

| File                      | Consumed by                                                       | Purpose                                                                      |
| ------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `lighthouse-budgets.json` | `performance/lighthouserc.json`, application repos' Lighthouse CI | LCP, CLS, TBT, TTI, FCP, resource sizes/counts per page path                 |
| `cwv-budgets.json`        | Monitoring dashboards, field data alerts                          | Core Web Vitals pass thresholds per demo template (CrUX-style)               |
| `k6-thresholds.json`      | `load/k6.config.js`, all k6 scenarios                             | p95/p99 latency, error rate, RPS targets per endpoint + scenario definitions |

## Rules

1. **One place to change.** Never duplicate budget values in consuming repos. Import
   from this directory.
2. **CODEOWNERS guarded.** Changes to `budgets/` require review from `@JourneyOfLife`
   and `@IterVitae`. Budget changes affect every repo's CI gate.
3. **ADR required.** Tightening or loosening a budget requires ADR-QA-NNN documenting
   the reason, the evidence (e.g. CrUX field data), and the impact on consuming repos.
4. **Schema validated.** `unit/budget-schema.spec.ts` runs in every CI job and verifies
   that all three JSON files are internally consistent and reference valid metrics.

## Budget values (summary)

### Lighthouse

| Metric | Default | Assessment | Donation | AI Assistant |
| ------ | ------- | ---------- | -------- | ------------ |
| LCP    | < 1.8s  | < 2.2s     | < 2.0s   | < 2.5s       |
| CLS    | < 0.1   | < 0.1      | < 0.05   | < 0.1        |
| TBT    | < 200ms | < 300ms    | < 200ms  | < 400ms      |
| TTI    | < 3.5s  | < 3.5s     | < 3.5s   | < 3.5s       |

### k6

| Metric      | Threshold |
| ----------- | --------- |
| p95 latency | < 300ms   |
| p99 latency | < 800ms   |
| Error rate  | < 0.1%    |

### CWV

Per-template thresholds in `cwv-budgets.json`. Default "good" thresholds: LCP < 2.5s,
INP < 200ms, CLS < 0.1.

## How consuming repos inherit

Application repos import budgets via one of:

1. **npm package** — `@via-vitae/qa` publishes `budgets/` as a package; repos import
   the JSON at build time.
2. **GitHub Actions** — `nightly-e2e.yml` and `pr-smoke.yml` in this repo run budgets
   directly against staging.
3. **Git submodule** — repos that need budgets at CI time without an npm publish can
   use a sparse checkout of `budgets/`.

The chosen strategy per repo is recorded in ADR-QA-002 (pending).
