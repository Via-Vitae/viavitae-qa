# Load Tests — k6

All k6 scenarios run against **staging only**. Production is read-only and banned for
load tests under all circumstances.

## Running locally

```bash
export STAGING_API_URL=https://staging-api.viavitae.com
pnpm test:load -- --scenario api-baseline
```

## TypeScript constraint

k6 does not natively support TypeScript. Scenarios are `.js` by runtime constraint.
The ESLint `k6/` override relaxes the TypeScript rule for this directory only.

## Thresholds

All thresholds are imported from `budgets/k6-thresholds.json` — the single source of
truth. Changing a threshold there changes all scenarios.

## Dashboards

`dashboards/grafana-import.json` imports into the Grafana instance managed by
viavitae-infra/monitoring. k6 results are pushed to Prometheus via remote write.
