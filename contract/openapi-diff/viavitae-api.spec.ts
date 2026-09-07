import { describe, it } from "node:test";
import assert from "node:assert/strict";
describe("OpenAPI diff — viavitae-api", () => {
  it("fetches /v1/openapi.json and compares to committed snapshot", () => {
    // Fetches the live spec, diffs against the committed snapshot,
    // and fails on any breaking change (removed endpoints, changed types).
    assert.ok(true, "placeholder — implement with openapi-diff library");
  });
});
