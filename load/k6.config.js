// Shared k6 configuration — thresholds imported from budgets/k6-thresholds.json.
// NOTE: k6 does not natively support TypeScript; this file is .js by runtime constraint.
import { readFileSync } from "k6/experimental/fs";

const thresholds = JSON.parse(readFileSync("../budgets/k6-thresholds.json"));

export const options = {
  thresholds: thresholds.thresholds,
  scenarios: thresholds.scenarios,
};
