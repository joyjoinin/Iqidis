import { expect, Locator, Page } from "@playwright/test";
import { AttachFiles } from "./AttachFiles";
import { Library } from "./Library";

export default class Pages {
  page: Page;
  attachFiles: AttachFiles;
  library: Library;
  file: Locator;
  constructor(page: Page) {
    this.page = page;
    this.attachFiles = new AttachFiles(page);
    this.library = new Library(page);
    this.file = page.locator(".w-20");
  }

  async homepage() {
    await this.page.goto("/");
  }

  async assertElementExist(element: Locator) {
    await element.scrollIntoViewIfNeeded({ timeout: 15000 });
    // await expect(element).toBeInViewport({ timeout: 10000 });
  }

  async assertElementIsNotExist(element: Locator) {
    await expect(element).toBeHidden({ timeout: 3000 });
  }

  async assertElementsExist(elements: Locator[]) {
    try {
      await Promise.all(
        elements.map(async (element) => {
          await element.scrollIntoViewIfNeeded({ timeout: 15000 });
          // await expect(element).toBeInViewport({ timeout: 10000 });
        })
      );
    } catch (error) {
      throw new Error(`Element assertion failed: ${error}`);
    }
  }

  async assertElementsAreNotExist(elements: Locator[]) {
    try {
      await Promise.all(
        elements.map(async (element) => {
          await expect(element).toBeHidden({ timeout: 3000 });
        })
      );
    } catch (error) {
      throw new Error(`Element assertion failed: ${error}`);
    }
  }

  async assertElementEqualTo(initialValue: any, value: any) {
    expect(value).toBe(initialValue);
  }

  async assertToBeTruthy(value: any) {
    expect(value).toBeTruthy();
  }

  async assertElementIsDisabled(element: Locator) {
    await expect(element).toBeDisabled({ timeout: 10000 });
  }
}
