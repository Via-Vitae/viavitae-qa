# Test Strategy

This document defines the testing pyramid and risk-based scoping for viavitae-qa.
The repository is the organisation's cross-repo testing hub — it holds suites that
span multiple application repositories, not tests that belong to any single one.

---

## Testing pyramid

```
                    ┌─────────────┐
                    │  Manual a11y │  Quarterly screen-reader audit
                    │  (quarterly) │
                   ┌┴─────────────┴┐
                   │   Load (k6)   │  Nightly + on-demand against staging
                  ┌┴───────────────┴┐
                  │   E2E (Playwright) │  Nightly full matrix, PR @smoke
                 ┌┴──────────────────┴┐
                 │  Accessibility (axe) │  PR smoke + nightly full
                ┌┴─────────────────────┴┐
                │   Contract (OpenAPI,    │  Per-PR on API changes
                │   tenant schema, Stripe)│
               ┌┴────────────────────────┴┐
               │  Performance (Lighthouse)  │  Nightly + weekly prod-readonly
              ┌┴────────────────────────────┴┐
              │  Unit (fixtures validator,     │  Every CI job
              │  budget schema, URL lists)     │
              └────────────────────────────────┘
```

## Suite responsibilities

| Suite | Location | Runs | Purpose |
| --- | --- | --- | --- |
| **Unit** | `unit/` | Every CI job | Fixture validation + PII heuristics, budget schema consistency, URL list validation. Fast (< 30s). |
| **Contract** | `contract/` | Per-PR on API changes | OpenAPI diff (breaking changes), tenant schema cross-repo match, Stripe webhook contract. |
| **Performance** | `performance/` | Nightly + weekly | Lighthouse CI against staging URLs; weekly prod-readonly (informational only). |
| **Accessibility** | `a11y/` | PR smoke + nightly | axe-core WCAG 2.2 AA scan; contrast token verification against `@via-vitae/brand`. |
| **E2E** | `e2e/` | PR @smoke + nightly full | Playwright across chromium, firefox, mobile-chrome. Critical paths nightly, @smoke subset on PR. |
| **Load** | `load/` | Nightly + on-demand | k6 scenarios against staging API only. Prod is read-only and banned for load tests. |
| **Manual a11y** | `a11y/manual/` | Quarterly | Screen-reader pass, WCAG 2.2 AA checklist. Cadence enforced per `docs/reporting.md`. |

## Risk-based scope per repo

Not every application repo needs the same test coverage. Scope is determined by risk:

| Risk level | Criteria | Required suites |
| --- | --- | --- |
| **High** | Handles personal data, payments, or authentication | E2E + contract + load + a11y + unit |
| **Medium** | User-facing but no payments or auth | E2e + a11y + unit |
| **Low** | Internal API, no UI | Contract + unit |

| Repo | Risk | Suites |
| --- | --- | --- |
| viavitae-web | High | E2E, contract, load, a11y, performance |
| viavitae-api | High | Contract, load, unit |
| viavitae-demos | Medium | E2E, a11y, performance |
| viavitae-docs | Low | Unit |
| viavitae-infra | Low | Unit (schema validation) |

## PR vs nightly scope

| Gate | PR (`pr-smoke.yml`) | Nightly (`nightly-e2e.yml`) |
| --- | --- | --- |
| Playwright | `--grep @smoke`, chromium only | Full matrix: 3 browsers × all specs, sharded 1/4–4/4 |
| axe | 1 page per affected template | Full suite: all templates, all routes |
| Lighthouse | Budget schema validation only | Full CI against staging URLs |
| k6 | Not run | api-baseline scenario |
| Contract | Not run (runs in CI `unit` job) | Not run |
| Target duration | < 10 minutes | < 60 minutes |

## Flaky test handling

See [flaky-test-policy.md](flaky-test-policy.md) for the quarantine process.

## Fixture data policy

All fixture data is synthetic. The PII heuristic validator (`fixtures/validator/validate.ts`)
runs in every CI job and hard-fails on any match. See `fixtures/validator/README.md` for
the exact patterns checked.
