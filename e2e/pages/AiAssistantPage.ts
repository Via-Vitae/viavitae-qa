import { type Page, type Locator } from "@playwright/test";

export class AiAssistantPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    // Navigate to the page associated with this POM.
    // URL comes from environment variables set in CI.
    throw new Error("AiAssistantPage.goto() not yet implemented — set the base URL.");
  }
}
