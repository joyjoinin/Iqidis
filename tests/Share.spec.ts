import { test } from "@playwright/test";
import Pages from "../common/page";

test.describe("Share ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Change Share Policy to public", async ({ page }) => {
    const Page = new Pages(page);
    await page.locator('span[data-sentry-element="Avatar"]').click();
    await page.getByRole("menuitem", { name: "Manage Organization" }).click();
    await page.getByRole("tab", { name: "Settings" }).click();
    await page.locator('div[data-sentry-element="Select"]').click();
    await page.getByText("Public", { exact: true }).click();
    await page.getByRole("button", { name: "Save Changes" }).click();
  });

  test("Change Share Policy to Inner", async ({ page }) => {
    const Page = new Pages(page);
    await page.locator('span[data-sentry-element="Avatar"]').click();
    await page.getByRole("menuitem", { name: "Manage Organization" }).click();
    await page.getByRole("tab", { name: "Settings" }).click();
    await page.locator('div[data-sentry-element="Select"]').click();
    await page.getByText("Inner", { exact: true }).click();
    await page.getByRole("button", { name: "Save Changes" }).click();
  });

  test("Change Share Policy to approval", async ({ page }) => {
    const Page = new Pages(page);
    await page.locator('span[data-sentry-element="Avatar"]').click();
    await page.getByRole("menuitem", { name: "Manage Organization" }).click();
    await page.getByRole("tab", { name: "Settings" }).click();
    await page.locator('div[data-sentry-element="Select"]').click();
    await page.getByText("Require Approval", { exact: true }).click();
    await page.getByRole("button", { name: "Save Changes" }).click();
  });

  test("Share document / Cancel share", async ({ page }) => {
    const Page = new Pages(page);
    await Page.library.clickLibrary();
    await Page.page
      .getByRole("row", { name: "UploadFile1.pdf PDF" })
      .getByRole("img")
      .nth(1)
      .click();
    await Page.library.shareButton.click();
    await page.locator("#rc_select_2").click();
    await page.locator('input[id="rc_select_2"]').fill("joy+04@57blocks.com");
    await page.getByTitle("joy+04@57blocks.com").click();
    await Page.assertElementExist(
      page.getByText("Documents shared successfully")
    );
    await page.getByRole("button", { name: "Close" }).click();
    await Page.library.sharedButton.click();
    await page.waitForTimeout(3000);
    await Page.assertElementExist(
      page.getByRole("cell", { name: "UploadFile1.pdf" })
    );

    // Cancel share

    await Page.library.documentsTap.click();
    await Page.page
      .getByRole("row", { name: "UploadFile1.pdf" })
      .getByRole("img")
      .nth(1)
      .click();
    await Page.library.shareButton.click();
    await page
      .locator("div")
      .filter({ hasText: "joy+04@57blocks.com" })
      .getByRole("button")
      .last()
      .click();
    await Page.assertElementExist(
      page.getByText("Documents shared successfully")
    );
    await page.getByRole("button", { name: "Close" }).click();
    await Page.library.sharedButton.click();
    await page.waitForTimeout(3000);
    await Page.assertElementIsNotExist(
      page.getByRole("cell", { name: "UploadFile1.pdf" })
    );
  });

  test("Enabled/Disabled share", async ({ page }) => {
    const Page = new Pages(page);
    await Page.library.clickLibrary();
    await Page.library.sharedButton.click();
    await page.waitForTimeout(3000);
    // Disable share
    await page
      .locator("tr")
      .filter({ hasText: "innerShareOne" })
      .getByText("Enabled")
      .click();
    await page.getByText("Disabled", { exact: true }).last().click();
    await Page.assertElementExist(
      page.getByText("Status updated successfully")
    );

    // Enable share
    await page
      .locator("tr")
      .filter({ hasText: "innerShareOne" })
      .getByText("Disabled")
      .last()
      .click();
    await page.getByText("Enabled", { exact: true }).last().click();
    await Page.assertElementExist(
      page.getByText("Status updated successfully")
    );
  });

  test("Approve/Reject share", async ({ page }) => {
    const Page = new Pages(page);
    await Page.library.clickLibrary();
    await Page.library.sharedButton.click();
    await page.waitForTimeout(3000);
    await page.getByText("Inner Share").click();
    await page.getByText("Public Share").click();
    await page.getByRole("main").getByText("Approved").last().click();
    await page.getByText("Rejected", { exact: true }).click();
    await Page.assertElementExist(
      page.getByText("Status updated successfully")
    );
    await Page.assertElementIsNotExist(
      page.getByRole("row").getByRole("button")
    );
    await page.getByRole("main").getByText("Rejected").last().click();
    await page.getByText("Approved", { exact: true }).click();
    await Page.assertElementsExist([
      page.getByText("Status updated successfully"),
      page.getByRole("row").getByRole("button"),
    ]);
  });
});
