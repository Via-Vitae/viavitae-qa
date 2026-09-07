// k6 scenario: assessment-spike
// Thresholds and executor config imported from budgets/k6-thresholds.json via k6.config.js.
import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.STAGING_API_URL || "http://localhost:3000";

export default function () {
  const res = http.get(`${BASE_URL}/v1/health`);
  check(res, { "status is 200": (r) => r.status === 200 });
  sleep(1);
}
