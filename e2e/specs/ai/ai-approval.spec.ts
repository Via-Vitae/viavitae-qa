import { test, expect } from "../../fixtures/test-base";

test.describe("@smoke AI approval workflow", () => {
  test("draft → approver login (Keycloak) → approve → published with badge", async ({ page }) => {
    const baseUrl = process.env.BASE_URL_DEMO_AI;
    test.skip(!baseUrl, "BASE_URL_DEMO_AI not set");

    // Create a draft
    await page.goto(`${baseUrl}/content`);
    await page.click('[data-testid="new-draft"]');
    await page.fill('[data-testid="draft-title"]', "Test AI Content");
    await page.fill('[data-testid="draft-body"]', "This is test content for approval.");
    await page.click('[data-testid="submit-for-approval"]');
    await expect(page.locator('[data-testid="status-pending"]')).toBeVisible();

    // Approver login via Keycloak test realm
    await page.click('[data-testid="approver-login"]');
    await expect(page).toHaveURL(/keycloak/, { timeout: 10000 });
    await page.fill("#username", "approver");
    await page.fill("#password", process.env.KEYCLOAK_TEST_PASSWORD ?? "test-password");
    await page.click("#kc-login");

    // Approve
    await page.click('[data-testid="approve-button"]');
    await expect(page.locator('[data-testid="human-approved-badge"]')).toBeVisible();
  });
});
