# viavitae-qa

[![CI](https://github.com/Via-Vitae/viavitae-qa/actions/workflows/ci.yml/badge.svg)](https://github.com/Via-Vitae/viavitae-qa/actions/workflows/ci.yml)
[![Compliance](https://github.com/Via-Vitae/viavitae-qa/actions/workflows/compliance-check.yml/badge.svg)](https://github.com/Via-Vitae/viavitae-qa/actions/workflows/compliance-check.yml)
[![CodeQL](https://github.com/Via-Vitae/viavitae-qa/actions/workflows/codeql.yml/badge.svg)](https://github.com/Via-Vitae/viavitae-qa/actions/workflows/codeql.yml)
[![Licence](https://img.shields.io/badge/licence-Proprietary-0E1B3D?labelColor=F7F4EC)](LICENSE)
[![EU hosted](https://img.shields.io/badge/hosted-EU-0E1B3D?labelColor=F7F4EC)](SECURITY.md)

> Cross-repo testing assets for the ViaVitae platform — Playwright e2e, k6 load,
> Lighthouse budgets, axe accessibility and contract tests.

`viavitae-qa` is the single source of truth for performance budgets, synthetic test
fixtures and cross-repo test suites. Every application repository in the Via-Vitae
organisation inherits its CI gates from the budgets and workflows defined here.

ViaVitae builds church-vertical websites, e-commerce and a marketplace for an EU pilot
in Lithuania, on self-hosted Proxmox infrastructure. Personal data stays in the EEA.

---

## Table of Contents

- [Purpose](#purpose)
- [Repository layout](#repository-layout)
- [Running suites locally](#running-suites-locally)
- [Performance budgets](#performance-budgets)
- [Synthetic fixtures](#synthetic-fixtures)
- [Suite scoping](#suite-scoping)
- [Quality gates](#quality-gates)
- [Security and compliance](#security-and-compliance)
- [Documentation](#documentation)
- [Licence](#licence)

---

## Purpose

This repository holds:

- **Performance budgets** — Lighthouse, Core Web Vitals and k6 thresholds defined once
  and consumed by every application repo's CI.
- **Synthetic fixtures** — Faker-generated test data with a fixed seed, validated against
  JSON Schemas and scanned for PII heuristics in every CI run.
- **E2E suites** — Playwright end-to-end tests covering the assessment funnel, commerce
  flows, AI assistant, GIS map, SSO/RBAC, demo reset and i18n parity.
- **Contract tests** — OpenAPI diff, tenant-schema cross-repo comparison and Stripe
  webhook contract verification.
- **Load tests** — k6 scenarios for spike, sustained and baseline load against staging.
- **Accessibility audits** — axe-core scans against WCAG 2.2 AA, plus a quarterly manual
  screen-reader checklist.

## Repository layout

```text
viavitae-qa/
+-- README.md                     # This file
+-- LICENSE                       # Proprietary - All Rights Reserved
+-- SECURITY.md                   # Disclosure policy, SLA table, safe harbour, scope
+-- QODER.md                      # Behavioural guidelines for AI-assisted coding
+-- CONTRIBUTING.md               # Contribution workflow, PR rules, DCO sign-off
+-- CHANGELOG.md                  # Keep a Changelog driven by Conventional Commits
+-- .gitignore                    # Node + env + test artifacts superset
+-- .editorconfig                 # Deterministic formatting across editors
+-- .npmrc                        # @via-vitae scope -> GitHub Packages registry
+-- package.json                  # Root: pnpm workspace scripts, shared devDeps
+-- pnpm-workspace.yaml           # Workspaces: e2e, load, a11y, budgets, fixtures, ...
+-- pnpm-lock.yaml                # Committed lockfile for reproducible builds
+-- turbo.json                    # Turborepo pipeline orchestration
+-- playwright.config.ts          # Base Playwright config (chromium/firefox/mobile)
+-- tsconfig.json                 # Strict TypeScript, shared by TS suites
+-- .env.example                  # Non-secret URL templates
+-- .github/
|   +-- CODEOWNERS                # Owner mapping, R2 baseline
|   +-- dependabot.yml            # Weekly grouped updates
|   +-- PULL_REQUEST_TEMPLATE.md  # PR checklist including compliance items
|   +-- ISSUE_TEMPLATE/
|   |   +-- bug_report.yml        # Includes "flaky?" and "affected suite" fields
|   |   +-- feature_request.yml   # Includes "which suite" and "budget impact" fields
|   +-- workflows/
|       +-- ci.yml                # Lint, typecheck, unit tests, SAST, dependency scan
|       +-- compliance-check.yml  # TruffleHog, licences, governance, action SHA pinning
|       +-- codeql.yml            # Static analysis, TypeScript only
|       +-- pr-smoke.yml          # PR-scoped @smoke tests, budgets, axe
|       +-- nightly-e2e.yml       # Full matrix, HTML report, Loki + Alertmanager
+-- docs/                         # ADR template, DPIA, test strategy, environments
+-- budgets/                      # Single source of truth for performance budgets
+-- fixtures/                     # Synthetic data only, PII-validated in CI
+-- e2e/                          # Playwright end-to-end suites
+-- contract/                     # Cross-repo API contract tests
+-- load/                         # k6 performance suites
+-- a11y/                         # Accessibility suites (WCAG 2.2 AA)
+-- performance/                  # Lighthouse CI orchestration
+-- unit/                         # Fast logic tests (node:test)
+-- reports/                      # Generated output (gitignored)
```

## Running suites locally

```bash
# Prerequisites
pnpm install

# Smoke tests (PR-scoped)
pnpm test:smoke

# Full e2e (all browsers)
pnpm test:e2e

# Accessibility scan
pnpm test:a11y

# Load test against staging ONLY (never production)
pnpm test:load

# Fixture validation + PII heuristic scan
pnpm test:fixtures

# Budget schema consistency
pnpm test:budgets

# All unit tests
pnpm test:unit
```

Environment URLs are loaded from `.env` (copy `.env.example`). Real values come from
GitHub Environments at CI time; never commit actual URLs or credentials.

## Performance budgets

All budgets live in `budgets/` and are imported by consuming repos. Changing a value
here changes CI gates in every repository.

| Budget file               | Thresholds                                         |
| ------------------------- | -------------------------------------------------- |
| `lighthouse-budgets.json` | LCP < 1.8 s, CLS < 0.1, TBT < 200 ms, TTI < 3.5 s  |
| `cwv-budgets.json`        | CrUX-style field data thresholds per demo template |
| `k6-thresholds.json`      | p95 < 300 ms API, p99 < 800 ms, error rate < 0.1 % |

## Synthetic fixtures

Every fixture file is generated by Faker with a **fixed seed** (deterministic across runs).
The `fixtures/validator` runs in every CI job:

1. Validates every fixture against its JSON Schema.
2. Runs PII heuristics (Lithuanian personal code format, real phone ranges, email patterns).
3. Hard-fails CI on any match — no warnings, no ignore list.

**Never commit production data to this repository.** The `fixtures/anonymizer/scrub.ts`
is a reference implementation only; no pipeline connects production to this repo.

## Suite scoping

| Trigger      | What runs                                                                 | Target                                |
| ------------ | ------------------------------------------------------------------------- | ------------------------------------- |
| Pull request | `pr-smoke.yml` — `@smoke` tags, budgets, axe on 1 page per affected repo  | Staging, < 10 min                     |
| Nightly      | `nightly-e2e.yml` — full matrix (chromium x firefox x mobile), all suites | Staging                               |
| Weekly       | Lighthouse CI against production URLs                                     | Production (read-only, informational) |

## Quality gates

Every pull request must pass:

| Gate         | Tool                               | Threshold                                         |
| ------------ | ---------------------------------- | ------------------------------------------------- |
| Lint         | ESLint, Prettier, markdownlint     | zero findings                                     |
| Format       | Prettier                           | no diff                                           |
| Types        | `tsc --noEmit` (strict)            | zero errors                                       |
| Unit tests   | `node:test`, pnpm workspaces       | pass                                              |
| SAST         | Semgrep (TypeScript ruleset)       | zero findings                                     |
| Dependencies | Trivy filesystem                   | fail on `CRITICAL`                                |
| Secrets      | TruffleHog `--only-verified`       | fail on any verified finding                      |
| Licences     | npm allow-list scan                | unknown licence fails and is labelled             |
| Governance   | presence checks                    | CODEOWNERS, `.editorconfig`, `.gitignore` present |
| Fixtures     | Schema validation + PII heuristics | hard fail on any PII match                        |

## Security and compliance

- To report a vulnerability, follow the private disclosure process in
  [SECURITY.md](SECURITY.md). Do **not** open a public issue. Acknowledgement within
  24 hours, triage within 72 hours.
- Test data in this repository is **synthetic only**. A completed
  [DPIA](docs/DPIA-template.md) under GDPR Article 35 confirms no personal data
  processing occurs.
- Architectural choices with security, privacy or data-residency impact are recorded as
  an [ADR](docs/architecture.md).

## Documentation

| Document                                               | Purpose                                             |
| ------------------------------------------------------ | --------------------------------------------------- |
| [SECURITY.md](SECURITY.md)                             | Disclosure policy, SLA table, safe harbour, scope.  |
| [CONTRIBUTING.md](CONTRIBUTING.md)                     | Contribution workflow, PR rules, DCO sign-off.      |
| [CHANGELOG.md](CHANGELOG.md)                           | Release history in Keep a Changelog format.         |
| [QODER.md](QODER.md)                                   | AI pair-programming guardrails and stop-conditions. |
| [docs/architecture.md](docs/architecture.md)           | MADR decision records and index.                    |
| [docs/DPIA-template.md](docs/DPIA-template.md)         | GDPR Article 35 assessment template.                |
| [docs/test-strategy.md](docs/test-strategy.md)         | Test pyramid and risk-based scope.                  |
| [docs/environments.md](docs/environments.md)           | Environment URLs and credential policy.             |
| [docs/flaky-test-policy.md](docs/flaky-test-policy.md) | Quarantine process and fix SLA.                     |
| [docs/reporting.md](docs/reporting.md)                 | Nightly report format and alert routing.            |

## Licence

Proprietary — All Rights Reserved. (c) ViaVitae IT Technologies. No redistribution, no
derivative works and no commercial use by third parties without a written agreement.
Governed by the law of Lithuania (EU). See [LICENSE](LICENSE).
