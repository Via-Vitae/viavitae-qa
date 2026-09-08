import { test, expect } from "../../fixtures/test-base";

test.describe("AI assistant", () => {
  test("retrieval-only: answer contains citation; refuses off-corpus; disclosure visible", async ({
    page,
  }) => {
    const baseUrl = process.env.BASE_URL_DEMO_AI;
    test.skip(!baseUrl, "BASE_URL_DEMO_AI not set");

    await page.goto(baseUrl!);

    // On-corpus question — should return answer with citation
    await page.fill('[data-testid="question-input"]', "What is the assessment process?");
    await page.click('[data-testid="ask-button"]');
    await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="citation"]')).toBeVisible();
    await expect(page.locator('[data-testid="ai-disclosure"]')).toBeVisible();

    // Off-corpus question — should refuse
    await page.fill('[data-testid="question-input"]', "What is the weather today?");
    await page.click('[data-testid="ask-button"]');
    await expect(page.locator('[data-testid="ai-refusal"]')).toBeVisible({ timeout: 10000 });
  });
});
