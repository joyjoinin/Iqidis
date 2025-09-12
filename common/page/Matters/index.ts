import { type Locator, type Page } from "@playwright/test";

export class Matters {
  page: Page;
  createMatterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createMatterButton = page.getByRole("button", {
      name: "Create Matter",
    });
  }

  async manageMatters() {
    // await this.page.locator('span[data-sentry-element="Avatar"]').click();
    await this.page
      .locator('ul li[class="group/menu-item relative"]')
      .nth(3)
      .click();
  }
}
