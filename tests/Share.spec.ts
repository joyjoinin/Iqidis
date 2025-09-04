import { test } from "@playwright/test";
import Pages from "../common/page";

test.describe("Share ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Change Share Policy to public", async ({ page }) => {
    const Page = new Pages(page);
    const policy = "Public";
    await Page.workspace.manageOrganization();
    await Page.workspace.settingsTab.click();
    await Page.workspace.policy.click();
    await Page.workspace.selectPolicy(policy);
    await Page.workspace.saveChangesButton.click();
  });

  test("Change Share Policy to Inner", async ({ page }) => {
    const Page = new Pages(page);
    const policy = "Inner";
    await Page.workspace.manageOrganization();
    await Page.workspace.settingsTab.click();
    await Page.workspace.policy.click();
    await Page.workspace.selectPolicy(policy);
    await Page.workspace.saveChangesButton.click();
  });

  test("Change Share Policy to approval", async ({ page }) => {
    const Page = new Pages(page);
    const policy = "Require Approval";
    await Page.workspace.manageOrganization();
    await Page.workspace.settingsTab.click();
    await Page.workspace.policy.click();
    await Page.workspace.selectPolicy(policy);
    await Page.workspace.saveChangesButton.click();
  });

  test("Share document / Cancel share", async ({ page }) => {
    const Page = new Pages(page);
    const title = "joy+04@57blocks.com";
    const document = "UploadFile1.pdf";
    const successMessage = page.getByText("Documents shared successfully");
    await Page.library.clickLibrary();
    await Page.page
      .getByRole("row", { name: document })
      .getByRole("img")
      .nth(1)
      .click();
    await Page.library.shareButton.click();
    await page.locator("#rc_select_2").click();
    await page.locator('input[id="rc_select_2"]').fill(title);
    await page.getByTitle(title).click();
    await Page.assertElementExist(successMessage);
    await Page.library.closeByRoleButton.click();
    await Page.library.sharedButton.click();
    await page.waitForTimeout(3000);
    await Page.assertElementExist(page.getByRole("cell", { name: document }));

    // Cancel share

    await Page.library.documentsTap.click();
    await Page.page
      .getByRole("row", { name: document })
      .getByRole("img")
      .nth(1)
      .click();
    await Page.library.shareButton.click();
    await page
      .locator("div")
      .filter({ hasText: title })
      .getByRole("button")
      .last()
      .click();
    await Page.assertElementExist(successMessage);
    await Page.library.closeByRoleButton.click();
    await Page.library.sharedButton.click();
    await page.waitForTimeout(3000);
    await Page.assertElementIsNotExist(
      page.getByRole("cell", { name: document })
    );
  });

  test("Enabled/Disabled share", async ({ page }) => {
    const Page = new Pages(page);
    const successMessage = page.getByText("Status updated successfully");
    await Page.library.clickLibrary();
    await page.waitForTimeout(3000);
    await Page.library.sharedButton.click();
    await page.waitForTimeout(3000);
    // Disable share
    await page
      .locator("tr")
      .filter({ hasText: "innerShareOne" })
      .getByText("Enabled")
      .click();
    await page.getByText("Disabled", { exact: true }).last().click();
    await Page.assertElementExist(successMessage);

    // Enable share
    await page
      .locator("tr")
      .filter({ hasText: "innerShareOne" })
      .getByText("Disabled")
      .last()
      .click();
    await page.getByText("Enabled", { exact: true }).last().click();
    await Page.assertElementExist(successMessage);
  });

  test("Approve/Reject share", async ({ page }) => {
    const Page = new Pages(page);
    const successMessage = page.getByText("Status updated successfully");
    const copyLinkButton = page.getByRole("row").getByRole("button");
    await Page.library.clickLibrary();
    await page.waitForTimeout(3000);
    await Page.library.sharedButton.click();
    await page.waitForTimeout(3000);
    await page.getByText("Inner Share").click();
    await page.getByText("Public Share").click();
    await page.getByRole("main").getByText("Approved").last().click();
    await page.getByText("Rejected", { exact: true }).click();
    await Page.assertElementExist(successMessage);
    await Page.assertElementIsNotExist(copyLinkButton);
    await page.getByRole("main").getByText("Rejected").last().click();
    await page.getByText("Approved", { exact: true }).click();
    await Page.assertElementsExist([successMessage, copyLinkButton]);
  });
});
