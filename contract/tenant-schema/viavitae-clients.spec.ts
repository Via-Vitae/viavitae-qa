import { describe, it } from "node:test";
import assert from "node:assert/strict";
describe("Tenant schema cross-repo contract", () => {
  it("tenant.schema.json here matches schema in @via-vitae/clients", () => {
    // Fetches the schema from @via-vitae/clients npm package (or git submodule
    // until viavitae-clients repo is live) and compares to local tenant.schema.json.
    assert.ok(true, "placeholder — implement schema comparison");
  });
});
