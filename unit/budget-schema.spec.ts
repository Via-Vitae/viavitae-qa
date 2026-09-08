import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
describe("Budget schema consistency", () => {
  it("lighthouse-budgets.json is valid JSON with required fields", () => {
    const data = JSON.parse(
      readFileSync(
        join(import.meta.dirname ?? ".", "..", "budgets", "lighthouse-budgets.json"),
        "utf-8",
      ),
    );
    assert.ok(Array.isArray(data.budgets), "budgets must be an array");
    assert.ok(data.budgets.length > 0, "at least one budget required");
  });
  it("cwv-budgets.json has all 9 templates", () => {
    const data = JSON.parse(
      readFileSync(join(import.meta.dirname ?? ".", "..", "budgets", "cwv-budgets.json"), "utf-8"),
    );
    assert.ok(Object.keys(data.templates).length >= 9, "9 templates required");
  });
  it("k6-thresholds.json has valid threshold expressions", () => {
    const data = JSON.parse(
      readFileSync(
        join(import.meta.dirname ?? ".", "..", "budgets", "k6-thresholds.json"),
        "utf-8",
      ),
    );
    assert.ok(data.thresholds, "thresholds required");
    assert.ok(data.scenarios, "scenarios required");
  });
});
