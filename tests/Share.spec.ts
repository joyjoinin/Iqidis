import { test } from "@playwright/test";
import Pages from "../common/page";

test.describe("Share ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Share document / Cancel share", async ({ page }) => {
    const Page = new Pages(page);
    await page.goto(
      "https://iqidisai-git-feat-multi-tenancy-iqidis.vercel.app"
    );
    await Page.library.clickLibrary();
    await Page.page
      .getByRole("row", { name: "admin-folder-beijing.txt TXT" })
      .getByRole("img")
      .nth(1)
      .click();
    await Page.library.shareButton.click();
    await page.locator("#rc_select_2").click();
    await page.locator('input[id="rc_select_2"]').fill("joy+05@57blocks.com");
    await page.getByTitle("joy+05@57blocks.com").click();
    await Page.assertElementExist(
      page.getByText("Documents shared successfully")
    );
    await page.getByRole("button", { name: "Close" }).click();
    await Page.library.sharedButton.click();
    await Page.assertElementExist(
      page.getByRole("cell", { name: "admin-folder-beijing.txt" })
    );

    // Cancel share

    await Page.library.documentsTap.click();
    await Page.page
      .getByRole("row", { name: "admin-folder-beijing.txt TXT" })
      .getByRole("img")
      .nth(1)
      .click();
    await Page.library.shareButton.click();
    await page
      .locator("div")
      .filter({ hasText: "joy+05@57blocks.com" })
      .getByRole("button")
      .last()
      .click();
    await Page.assertElementExist(
      page.getByText("Documents shared successfully")
    );
    await page.getByRole("button", { name: "Close" }).click();
    await Page.library.sharedButton.click();
    await Page.assertElementIsNotExist(
      page.getByRole("cell", { name: "admin-folder-beijing.txt" })
    );
  });
});
