import { test, expect } from "../../fixtures/test-base";
test.describe("@smoke SSO login", () => {
  test("Keycloak SSO → client portal → logout → no session leakage", async ({ page }) => {
    const baseUrl = process.env.BASE_URL_DEMO_SSO;
    test.skip(!baseUrl, "BASE_URL_DEMO_SSO not set");
    await page.goto(baseUrl!);
    await page.click('[data-testid="sso-login"]');
    await expect(page).toHaveURL(/keycloak/, { timeout: 10000 });
    await page.fill("#username", "testuser");
    await page.fill("#password", process.env.KEYCLOAK_TEST_PASSWORD ?? "test-password");
    await page.click("#kc-login");
    await expect(page.locator('[data-testid="portal-dashboard"]')).toBeVisible({ timeout: 10000 });
    await page.click('[data-testid="logout"]');
    await page.goBack();
    await expect(page).toHaveURL(/login|keycloak/);
  });
});
