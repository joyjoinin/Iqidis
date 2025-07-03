import { expect, test } from "@playwright/test";
import Pages from "../common/page";

function generateRandomString(length: number = 16): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length })
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join("");
}

const folderName = "folder" + generateRandomString(6);
const description = generateRandomString(16);
const editName = "Edit" + folderName;
const editDescription = "Edit" + description;

test.describe("Library functions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Upload from Library", async ({ page }) => {
    const Page = new Pages(page);
    await Page.library.clickLibrary();
    await Page.library.uploadFile();
    await Page.library.clickSelectFiles();
    await Page.library.inputFile();
    await Page.assertElementExist(Page.library.waitingButton);
    await Page.library.upload();
    await Page.assertElementExist(
      page.getByText("1 files uploaded successfully")
    );
    await Page.library.continueUpload();
    await Page.assertElementExist(page.getByText("Upload Documents"));
  });

  test("Create folder", async ({ page }) => {
    const Page = new Pages(page);
    await Page.library.clickLibrary();
    await Page.library.clickFolders();
    await Page.library.clickNewFolders();
    await Page.library.inputFolderName(folderName);
    await Page.library.inputDescription(description);
    await Page.library.create();
    await Page.assertElementsExist([
      page.getByText("Folder created successfully"),
      page.getByText(folderName + "" + description),
      page
        .locator("div")
        .filter({ hasText: /^Create New Folder$/ })
        .last(),
    ]);
  });

  test("Move Files", async ({ page }) => {
    const Page = new Pages(page);
    await Page.library.clickLibrary();
    const fileNumber = 3;
    for (let i = 0; i < fileNumber; i++) {
      await Page.library.checkFile(i);
    }
    await Page.assertElementExist(page.getByText(`${fileNumber} selected`));
    await Page.library.moveFile();
    await Page.library.selectFolder();
    await Page.library.move();
    await Page.assertElementExist(
      page.getByText("Document(s) moved successfully")
    );
    await Page.library.clickFolders();
    // first folder
    await page
      .locator(
        'div[data-sentry-component="FolderList"] > div:nth-child(2) > div > div:nth-child(1) > div'
      )
      .click();
    await page.waitForTimeout(5000);
    const filesCounts = (
      await page
        .locator('tbody tr[class="ant-table-row ant-table-row-level-0"]')
        .all()
    ).length;
    await Page.assertElementEqualTo(fileNumber, filesCounts);
  });

  test("Edit folder", async ({ page }) => {
    const Page = new Pages(page);
    await Page.library.clickLibrary();
    await Page.library.clickFolders();
    await Page.library.clickMore();
    await Page.library.edit();
    await Page.library.inputFolderName(folderName);
    await Page.library.inputDescription(description);
    await Page.library.rename();
    await Page.assertElementExist(
      page.getByText("Folder renamed successfully")
    );
  });

  test("Delete folder", async ({ page }) => {
    const Page = new Pages(page);
    await Page.library.clickLibrary();
    await Page.library.clickFolders();
    await Page.library.clickMore();
    await Page.library.delete();
    await Page.library.deleteConfirm();
    await Page.assertElementsExist([
      page.getByText("Folder deleted successfully"),
      page.getByText("No Records Yet"),
    ]);
  });

  test("Share on All Documents", async ({ page }) => {
    const Page = new Pages(page);
    await Page.library.clickLibrary();
    await Page.assertElementIsDisabled(Page.library.shareButton);
    await Page.library.shareButton.hover();
    await Page.assertElementExist(page.getByText("Coming soon"));
  });

  test("Shared on Tap", async ({ page }) => {
    const Page = new Pages(page);
    await Page.library.clickLibrary();
    await Page.library.sharedButton.hover();
    await Page.assertElementExist(page.getByText("Coming soon"));
  });
});
