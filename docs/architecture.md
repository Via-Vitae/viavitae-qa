# Architecture Decision Records

This file is the ADR index and template for viavitae-qa. Every architectural decision
with a security, privacy, data-residency, cost or maintainability consequence is recorded
here. Decisions are made in conversations and lost; ADRs are how a team remembers why the
system is shaped the way it is.

Records follow [MADR](https://adr.github.io/madr/) adapted for a regulated EU context: the
**Compliance impact** section is mandatory, because under rules R1 and R5 a decision that
touches personal data or residency cannot be taken without it.

---

## When an ADR is required

Write an ADR before implementing, not after. An ADR written afterwards is a justification;
an ADR written before is a decision.

| Situation | ADR required |
| --- | --- |
| Adding a new test suite or workspace | Yes |
| Changing the browser matrix or shard strategy | Yes |
| Introducing a new third-party dependency for testing | Yes |
| Changing the staging environment contract | Yes |
| Modifying PII heuristic patterns in the fixture validator | Yes |
| Changing budget thresholds in `budgets/` (rule R1 — single source of truth) | Yes |
| Diverging from `viavitae-template` governance or CI defaults (rule R1) | Yes |
| Adding a Loki label or Alertmanager route | Yes |
| A bug fix inside an existing agreed design | No |
| Adding a test spec, a translation, or documentation | No |

## Numbering convention

- Format: `ADR-QA-NNN`, zero-padded to three digits, starting at `ADR-QA-001`.
- Numbers are allocated sequentially and **never reused**, even when a record is superseded
  or withdrawn.
- The file heading is `## ADR-QA-NNN: <short title in sentence case>`.
- Superseding a record does not delete it. Set its status to `Superseded by ADR-QA-MMM`.

## Status values

| Status | Meaning |
| --- | --- |
| `Proposed` | Under discussion. Implementation must not start. |
| `Accepted` | Agreed and in force. Implementation may proceed. |
| `Deprecated` | No longer applies to new work; existing suites may still depend on it. |
| `Superseded by ADR-QA-MMM` | Replaced. Kept for history. |
| `Rejected` | Considered and declined. |

---

## Index

| ADR | Title | Status | Owner | Date |
| --- | --- | --- | --- | --- |
| [ADR-QA-001](#adr-qa-001-repo-placement-polyrepo-over-monorepo-test-folder) | Repo placement: polyrepo over monorepo test folder | Accepted | @JourneyOfLife | 2026-09-07 |
| _ADR-QA-002_ | _next available number_ | — | — | — |

---

## ADR-QA-001: Repo placement — polyrepo over monorepo test folder

| Field | Value |
| --- | --- |
| **Status** | Accepted |
| **Owner** | `@JourneyOfLife` |
| **Date** | 2026-09-07 |
| **Deciders** | Architects, QA |
| **Consulted** | Security, DPO |
| **Supersedes** | — |
| **Superseded by** | — |

### Context

ViaVitae operates ten repositories. Testing assets (Playwright e2e, k6 load, Lighthouse
budgets, axe accessibility, contract tests, synthetic fixtures) span multiple application
repositories. The question was whether to embed these inside a single application repo
(e.g. viavitae-web) as a `tests/` folder, or to create a dedicated viavitae-qa repository.

### Decision

viavitae-qa is a standalone repository, not a subfolder of any application repo.

1. Testing assets live in `viavitae-qa/` as a pnpm workspace monorepo.
2. Performance budgets are defined once in `budgets/` and consumed by every application
   repo's CI via shared workflow or direct import.
3. Fixture data is synthetic-only, validated by PII heuristics in CI.
4. Contract tests verify API shape guarantees across repos independently.

### Consequences

**Positive**

- Independent release cadence: test additions do not trigger application deployments.
- Single source of truth for budgets — changing a budget here changes CI gates everywhere.
- PII validator and synthetic-only policy have independent enforcement.
- Cross-repo contract testing is possible without coupling to any single app repo.

**Negative and accepted**

- An additional repository to maintain (governance, CI, dependabot). Accepted as lower
  cost than the coupling and duplication of embedding tests in app repos.
- Nightly CI depends on staging being available. Mitigated by health-check gate.

### Alternatives considered

| Alternative | Why rejected |
| --- | --- |
| Embed tests in viavitae-web `tests/` | Couples cross-repo tests to a single app; budget changes trigger app deployments; contract tests cannot span repos. |
| Monorepo containing all projects | Conflicts with per-repo ownership, licensing, and GitHub template mechanism. Widens blast radius of credential compromise. |
| Shared GitHub Actions workflows only | Does not solve fixture governance, budget single-sourcing, or cross-repo contract testing. |

### Compliance impact

| Area | Impact |
| --- | --- |
| GDPR | Positive. Synthetic-only fixtures with PII heuristic validation are the GDPR safeguard for test data. Independent enforcement prevents drift. |
| Data residency | None. No personal data is processed. |
| Accessibility | Positive. axe WCAG 2.2 AA gates are independently enforced. |
| New processors introduced | None. |

---

## ADR template

Copy everything below the line into a new section at the end of this file, assign the next
number from the index, and add the index row in the same pull request.

```markdown
## ADR-QA-NNN: <short title in sentence case>

| Field | Value |
| --- | --- |
| **Status** | Proposed |
| **Owner** | <team handle, e.g. @JourneyOfLife> |
| **Date** | <YYYY-MM-DD> |
| **Deciders** | <roles and teams that agreed> |
| **Consulted** | <roles and teams whose input was sought> |
| **Supersedes** | <ADR-QA-NNN or —> |
| **Superseded by** | <ADR-QA-NNN or —> |

### Context

<The situation, constraints, and why a decision is needed now.>

### Decision

<The decision, specific enough to be implemented without further interpretation.>

### Consequences

<What becomes easier, what becomes harder, and what risk is knowingly accepted.>

### Alternatives considered

<Each rejected alternative and the reason for rejection.>

### Compliance impact

<Effects on GDPR, data residency, accessibility, licensing. State "none" where there is
genuinely no impact.>
```
