import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
describe("URL list validation", () => {
  it("staging.urls.json is reachable from CI env and has no duplicates", () => {
    const data = JSON.parse(
      readFileSync(
        join(import.meta.dirname ?? ".", "..", "performance", "urls", "staging.urls.json"),
        "utf-8",
      ),
    );
    const urls = data.urls;
    const unique = new Set(urls);
    assert.equal(urls.length, unique.size, "duplicate URLs found");
    assert.ok(urls.length > 0, "at least one URL required");
  });
  it("prod.urls.json has no duplicates", () => {
    const data = JSON.parse(
      readFileSync(
        join(import.meta.dirname ?? ".", "..", "performance", "urls", "prod.urls.json"),
        "utf-8",
      ),
    );
    const urls = data.urls;
    const unique = new Set(urls);
    assert.equal(urls.length, unique.size, "duplicate URLs found");
  });
});
