# Pull Request

<!--
Pull request template for viavitae-qa.

Complete every box. A box that genuinely does not apply is annotated "n/a" with a
reason — it is not left blank. Blank boxes are treated as "not done" and the review
is returned.
-->

## Summary

<!-- One or two sentences: what changes, and why. -->

## Linked issue

Closes #

## Type of change

- [ ] `feat` — a new test suite or spec
- [ ] `fix` — a bug fix (flaky test, broken assertion)
- [ ] `perf` — a performance improvement
- [ ] `refactor` — restructuring, no behaviour change
- [ ] `docs` — documentation only
- [ ] `test` — tests only, no production change
- [ ] `build` / `ci` — CI configuration
- [ ] `chore` — maintenance
- [ ] `revert` — reverting a previous commit
- [ ] **Breaking change** — append `!` to the commit type

## Checklist

### Change quality

- [ ] **Conventional Commit title** — `<type>(<scope>): <imperative summary>`
- [ ] **Linked issue** — `Closes #nnn` above, or "n/a" with a reason
- [ ] **Tests added/updated** — new behaviour has a test; a fix has a regression test
- [ ] **Linters and typecheck pass locally** — `pnpm lint`, `pnpm typecheck`
- [ ] **No secrets in diff** — TruffleHog run locally, no credential anywhere
- [ ] **No new deps without justification** — every added dependency named below

### QA-specific

- [ ] **No new PII in fixtures** — fixture data remains synthetic only; PII heuristics pass
- [ ] **Budget impact noted** — if `budgets/` changed, the cross-repo impact is stated below
- [ ] **Flake check** — if a test was modified, it has not been quarantined recently
- [ ] **Staging-only** — load tests target staging; no production side effects

### Compliance

- [ ] **GDPR impact assessed** — synthetic data confirmed, or DPIA reference given
- [ ] **Accessibility checked (WCAG 2.2 AA)** — if a11y specs changed, axe gate green
- [ ] **i18n parity LT/EN/RU** — if locale specs changed, all three locales updated

### Documentation

- [ ] **CHANGELOG entry** — follows from the commit type
- [ ] **Docs updated** — test-strategy.md, environments.md or README reflect the change

## New dependencies

| Package | Version | Licence | Why |
| --- | --- | --- | --- |
| | | | |

## Budget impact

<!-- Required if budgets/ changed. State which thresholds changed and which repos are affected. -->

## AI assistance

- [ ] No AI assistance was used
- [ ] AI assistance was used — I have reviewed every line and take responsibility

## Verification

<!-- Paste commands and output. "Tested locally" without evidence is not verification. -->

## Size

- [ ] Under 400 changed lines, excluding generated files and lockfiles
