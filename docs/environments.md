# Environments

This document defines the environments viavitae-qa tests against and how credentials
are managed. **No secrets are stored in this repository.** All environment-specific
values come from GitHub Environments.

---

## Environment matrix

| Environment | Purpose | Access | Side effects |
| --- | --- | --- | --- |
| **dev** | Local development, fixture generation | Developer machine | None — uses local mock servers |
| **staging** | PR smoke tests, nightly e2e, load tests | GitHub Actions (`staging` Environment) | Write operations allowed (test data only) |
| **prod-readonly** | Weekly Lighthouse informational scan | GitHub Actions (`production` Environment) | **Read-only — no write operations** |

## Staging

Staging is the primary test target. All PR smoke tests and nightly e2e suites run against
staging. The staging environment is managed by viavitae-infra.

### URLs (from GitHub Environment variables)

| Variable | Description |
| --- | --- |
| `STAGING_API_URL` | Staging API base URL (e.g. `https://staging-api.viavitae.com`) |
| `STAGING_WEB_URL` | Staging web base URL |
| `BASE_URL_DEMO_ASSESSMENT` | Assessment funnel demo template |
| `BASE_URL_DEMO_DONATION` | Donation flow demo template |
| `BASE_URL_DEMO_AI` | AI assistant demo template |
| `BASE_URL_DEMO_SSO` | SSO/client portal demo template |
| `BASE_URL_DEMO_RESET` | Demo reset endpoint |
| `BASE_URL_DEMO_STORE` | Online store demo template |
| `BASE_URL_DEMO_CEMETERY` | Cemetery map demo template |
| `BASE_URL_DEMO_PORTAL` | Donor portal demo template |
| `BASE_URL_DEMO_I18N` | i18n parity test template |

### Secrets (from GitHub Environment secrets)

| Secret | Description |
| --- | --- |
| `KEYCLOAK_TEST_REALM` | Keycloak test realm URL (isolated from production) |
| `MAILHOG_URL` | Mailhog EU test inbox URL for email assertions |
| `LOKI_URL` | Loki ingestion endpoint for nightly report push |
| `LOKI_TOKEN` | Loki authentication token |
| `ALERTMANAGER_URL` | Alertmanager webhook URL for failure alerts |
| `LHCI_GITHUB_APP_TOKEN` | Lighthouse CI GitHub App token (optional) |

## Production (read-only)

Production is accessed **only** for the weekly Lighthouse CI scan. This scan is
**informational only** — failures do not trigger alerts and do not block any workflow.
No write operations are performed against production under any circumstances.

| Variable | Description |
| --- | --- |
| `PROD_WEB_URL` | Production web URL (for Lighthouse only) |

## Credential management

1. **GitHub Environments only.** All URLs and secrets are stored as Environment variables
   or secrets in the `staging` and `production` GitHub Environments.
2. **Never committed.** `.env` files are gitignored. `.env.example` contains only
   non-secret URL templates for local reference.
3. **Test realm isolation.** The Keycloak test realm is completely separate from
   production — different realm, different client IDs, no shared secrets.
4. **Rotation.** Secrets are rotated quarterly or on compromise. Rotation is managed
   by viavitae-infra.

## Health checks

Both `pr-smoke.yml` and `nightly-e2e.yml` include a staging health-check step that
verifies staging API and web are reachable before running any tests. If staging is
unavailable:

- PR smoke tests fail with a clear "staging unavailable" message.
- Nightly suite skips all jobs with `staging-up: false` output, preventing cascading
  false-positive failures.
