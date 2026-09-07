# Contributing

Thank you for contributing to a ViaVitae repository. This document describes the workflow
that applies to every repository generated from `viavitae-template`.

Read [QODER.md](QODER.md) before contributing with AI assistance, and
[SECURITY.md](SECURITY.md) before reporting anything security-related. Security reports
never go through a public issue or pull request.

---

## Code of conduct

Contributors, reviewers and maintainers are expected to treat each other with respect, to
critique work rather than people, and to assume good faith. Harassment, discrimination and
personal attacks are not accepted in any ViaVitae space, including issues, pull requests,
commit messages and chat.

Report a concern to `legal@viavitae.com`. Reports are handled confidentially. Where a
repository needs a full standalone code of conduct, one is added as `CODE_OF_CONDUCT.md`
and owned by `.github/CODEOWNERS`; this section remains the binding baseline until then.

Because ViaVitae serves religious communities, contributors additionally commit to
respecting the confidentiality and dignity of data subjects — many of whom are members of a
congregation and never consented to their data being discussed in a public forum.

## Development model: trunk-based

We work trunk-based. `main` is always deployable, always protected, and always moving.

- Branch from `main`, merge back to `main`. No long-lived feature branches.
- A change that is not ready to ship goes behind a feature flag, not onto a branch that
  lives for a month.
- Releases are cut from `main` as tags. Release branches, where they exist, receive fixes
  only.
- Force-pushes to `main` are disabled. Review dismissal is disabled. Administrators are
  not exempt from branch protection.

## Branch naming

Prefix every branch with its type. The prefix drives changelog grouping and reviewer
routing.

| Prefix | Use | Example |
| --- | --- | --- |
| `feat/` | A new test suite or spec | `feat/donation-flow-spec` |
| `fix/` | A bug fix | `fix/flaky-assessment-retry` |
| `chore/` | Maintenance, dependencies, tooling | `chore/pin-action-shas` |
| `docs/` | Documentation only | `docs/test-strategy-update` |
| `test/` | Tests only, no production change | `test/k6-spike-scenario` |
| `ci/` | CI configuration only | `ci/nightly-sharding` |
| `refactor/` | Restructuring, no behaviour change | `refactor/page-object-extract` |

Keep names lowercase, hyphen-separated, and under 50 characters. Include the issue number
where one exists: `fix/214-flaky-donation-retry`.

## Conventional Commits

Every commit message follows [Conventional Commits](https://www.conventionalcommits.org/).
The changelog is generated from these messages, so a malformed title means a missing
release note.

```text
<type>(<scope>): <imperative summary, max 72 characters>

<optional body: what changed and why, wrapped at 100 columns>

<optional footer: BREAKING CHANGE, Closes #123>

Signed-off-by: Your Name <you@viavitae.com>
```

| Type | Meaning | Changelog section |
| --- | --- | --- |
| `feat` | A new feature | **Added** |
| `fix` | A bug fix | **Fixed** |
| `perf` | A performance improvement | **Changed** |
| `refactor` | Restructuring, no behaviour change | **Changed** |
| `docs` | Documentation only | **Documentation** |
| `test` | Adding or correcting tests | not released |
| `build` / `ci` | CI configuration | **Infrastructure** |
| `chore` | Other changes that touch neither source nor tests | not released |
| `revert` | Reverting a previous commit | **Reverted** |

Rules:

- Use the imperative mood: "add coverage gate", not "added coverage gate".
- Scope is the workspace or area affected: `feat(e2e):`, `fix(budgets):`, `test(load):`.
- Append `!` for a breaking change, and repeat it in a `BREAKING CHANGE:` footer.
- Reference the issue in the footer: `Closes #123`.
- Never mention a credential, token, customer name or personal data in a commit message.

Configure sign-off and message checking locally:

```bash
git config --local user.name "Your Name"
git config --local user.email "you@viavitae.com"
git config --local format.signOff true
```

## Developer Certificate of Origin

Every commit carries a DCO sign-off line:

```text
Signed-off-by: Your Name <you@viavitae.com>
```

Add it with `git commit -s`. A commit without a sign-off is rejected.

## Pull request rules

A pull request may be merged only when **all** of the following hold:

1. **One approving review.** `CODEOWNERS` requests the reviewers; approval is mandatory
   and cannot be self-granted.
2. **Green CI.** Every job in `.github/workflows/ci.yml` passes.
3. **Green compliance.** `.github/workflows/compliance-check.yml` passes.
4. **Clean CodeQL.** No new finding in `.github/workflows/codeql.yml`.
5. **A linked issue,** where one exists.
6. **The checklist in `.github/PULL_REQUEST_TEMPLATE.md` completed.**
7. **Linear history.** Rebase onto `main`; merge method is squash.

## Small-PR doctrine: under 400 lines

Keep every pull request under **400 changed lines**, excluding generated files and
lockfiles. Separate a refactor from the behaviour change it enables. Split a feature
behind a flag and land it in slices.

## Local quality gates before pushing

Run these locally. CI is a safety net, not a substitute for checking your own work.

```bash
# Install dependencies
pnpm install

# Lint and format
pnpm lint                          # eslint + prettier + markdownlint
pnpm format:check                  # prettier --check

# Type check
pnpm typecheck                     # tsc --noEmit (strict)

# Unit tests (fixture validators, budget schema, URL lists)
pnpm test:unit                     # node:test

# Fixture validation + PII heuristic scan
pnpm test:fixtures                 # schema validation + PII heuristics

# E2E smoke (requires staging URLs in .env)
pnpm test:smoke                    # playwright --grep @smoke

# Full e2e (all browsers)
pnpm test:e2e                      # playwright test

# Accessibility
pnpm test:a11y                     # axe-core scans

# Load test (staging ONLY)
pnpm test:load                     # k6 run

# Governance, all stacks
git diff --check                   # whitespace errors
```

Then confirm the diff is what you intended and nothing more:

```bash
git status
git diff --stat
git diff main...HEAD
```

## QA-specific compliance items

| Area | Requirement |
| --- | --- |
| **Synthetic data** | No production data in fixtures. PII heuristics hard-fail in CI. |
| **Budget changes** | Changes to `budgets/` affect every consuming repo; note in PR description. |
| **Flaky tests** | 3 flakes in 30 days triggers quarantine per `docs/flaky-test-policy.md`. |
| **Staging only** | Load tests target staging only. Production is read-only, weekly, informational. |
| **Secrets in fixtures** | Webhook fixtures must not contain live keys (`sk_live_`, `pk_live_`). |
| **Cross-repo contracts** | Contract test changes may break consuming repos; coordinate. |

## AI-assisted contributions

AI assistance is welcome and is expected to follow [QODER.md](QODER.md). You are
accountable for everything in your pull request, including AI-generated portions.

Before opening a pull request that used AI assistance, confirm:

- no file was invented beyond the requested scope;
- no stub, placeholder, `TODO` or invented identifier reached the diff;
- existing codebase conventions were followed;
- the diff is minimal;
- no GDPR, WCAG 2.2 AA, EU data residency or secrets stop-condition was worked around;
- you have read and understood every line.

Note in the pull request description that AI assistance was used and which parts.

## Getting help

| Question | Where |
| --- | --- |
| Workflow, review, branch or commit rules | This document, then `#engineering` |
| Architecture or design decisions | The architects, record as an ADR |
| Personal data, DPIA, retention | `dpo@viavitae.com` |
| Licensing and third-party components | `legal@viavitae.com` |
| Vulnerabilities and security incidents | `security@viavitae.com` — private, per [SECURITY.md](SECURITY.md) |
