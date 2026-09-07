import { test, expect } from "../../fixtures/test-base";
test.describe("RBAC enforcement", () => {
  test("editor cannot access approver endpoints (403 proofs)", async ({ page }) => {
    const baseUrl = process.env.BASE_URL_DEMO_AI;
    test.skip(!baseUrl, "BASE_URL_DEMO_AI not set");
    const response = await page.goto(`${baseUrl}/admin/approver`);
    expect(response?.status()).toBe(403);
  });
});
