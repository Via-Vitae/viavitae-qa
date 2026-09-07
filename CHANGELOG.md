# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Entries are derived from [Conventional Commits](https://www.conventionalcommits.org/). A
commit whose title does not parse produces no release note, which is a defect in the
commit, not in the changelog.

## Enforcement

- **Commits** are validated against the Conventional Commits grammar in CI.
- **Every section** below a version header is present, even when empty, marked _None._
- **Security** entries are published only after the fix is deployed. See [SECURITY.md](SECURITY.md).

---

## [Unreleased]

### Added

_None._

### Changed

_None._

### Deprecated

_None._

### Removed

_None._

### Fixed

_None._

### Security

_None._

### Documentation

_None._

### Infrastructure

_None._

### Reverted

_None._

---

## [1.0.0] - 2026-09-07

Initial release of the ViaVitae cross-repo QA repository. Generated from `viavitae-template`
with QA-type adaptations.

### Added

- Governance baseline: `README.md`, `LICENSE`, `SECURITY.md`, `QODER.md`, `CONTRIBUTING.md`,
  `CHANGELOG.md`, `.gitignore`, `.editorconfig`, `.npmrc`.
- `.github/CODEOWNERS` — `* @JourneyOfLife @IterVitae` with guarded paths for `/budgets/`
  and `/fixtures/`.
- `.github/dependabot.yml` — weekly grouped updates for npm and github-actions ecosystems.
- `.github/PULL_REQUEST_TEMPLATE.md` — compliance checklist with "no new PII in fixtures"
  checkbox and budget-change notification.
- `.github/ISSUE_TEMPLATE/bug_report.yml` — structured form with "flaky?" and "affected
  suite" fields.
- `.github/ISSUE_TEMPLATE/feature_request.yml` — structured form with "which suite" and
  "budget impact" fields.
- `.github/workflows/ci.yml` — lint (ESLint, Prettier, markdownlint), typecheck (tsc strict),
  unit tests (node:test), fixture validation, SAST (Semgrep), dependency scan (Trivy).
- `.github/workflows/compliance-check.yml` — TruffleHog `--only-verified` secret scanning,
  npm licence allowlist, governance file presence checks, action SHA pinning enforcement.
- `.github/workflows/codeql.yml` — CodeQL `security-and-quality` for JavaScript/TypeScript.
- `.github/workflows/pr-smoke.yml` — PR-scoped Playwright `@smoke` tests, budget check,
  axe scan on 1 page per affected repo.
- `.github/workflows/nightly-e2e.yml` — full browser matrix, HTML report artifact, Loki
  summary push, Alertmanager on failure.
- `budgets/` — single source of truth for Lighthouse, CWV and k6 performance thresholds.
- `fixtures/` — synthetic-only test data with JSON Schemas, Faker generators, PII heuristic
  validator and anonymizer reference.
- `e2e/` — Playwright end-to-end suites: funnel, commerce, AI, GIS, IAM, demos, i18n,
  regression. Page Object Model and typed API clients.
- `contract/` — OpenAPI diff, tenant-schema cross-repo comparison, Stripe webhook contract.
- `load/` — k6 scenarios: assessment spike, donation sustained, API baseline, demo browse,
  GIS search. Grafana dashboard import.
- `a11y/` — axe-core WCAG 2.2 AA scans for templates, funnel, donation forms, and brand
  token contrast verification. Quarterly manual checklist.
- `performance/` — Lighthouse CI orchestration importing budgets from `budgets/`.
- `unit/` — fast logic tests for fixture validation, budget schema and URL lists.
- `docs/` — ADR template, DPIA template, test strategy, environments reference, flaky-test
  policy, reporting guide.

### Changed

_None._

### Deprecated

_None._

### Removed

- `main.py` — the IDE-generated sample entrypoint. Not part of the QA repository tree.

### Fixed

_None._

### Security

_None._

### Documentation

_None._

### Infrastructure

_None._

### Reverted

_None._

---

[Unreleased]: https://github.com/Via-Vitae/viavitae-qa/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Via-Vitae/viavitae-qa/releases/tag/v1.0.0
