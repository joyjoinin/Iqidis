import { test } from "@playwright/test";
import Pages from "../common/page";

test.describe("Library functions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

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
    await Page.library.inputFolderName(editName);
    await Page.library.inputDescription(editDescription);
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

  test("Delete file by Actions", async ({ page }) => {
    const Page = new Pages(page);
    const document = "DeleteOneByActions.pdf";
    await Page.library.clickLibrary();
    await Page.library.uploadFile();
    await Page.library.clickSelectFiles();
    await Page.library.inputFile(document);
    await Page.library.upload();
    await Page.assertElementExist(
      page.getByText("1 files uploaded successfully")
    );
    await Page.library.closeUpload();
    try {
      await Page.assertElementExist(page.getByText(document));
    } catch (error) {
      await page.reload();
      await Page.assertElementExist(page.getByText(document));
    }
    await Page.library.deleteDocumentByAction(document);
    try {
      await Page.assertElementIsNotExist(page.getByText(document));
    } catch (error) {
      await page.reload();
      await Page.assertElementIsNotExist(page.getByText(document));
    }
  });

  test("Delete file ", async ({ page }) => {
    const Page = new Pages(page);
    const document = "DeleteOne.pdf";
    await Page.library.clickLibrary();
    await Page.library.uploadFile();
    await Page.library.clickSelectFiles();
    await Page.library.inputFile(document);
    await Page.library.upload();
    await Page.assertElementExist(
      page.getByText("1 files uploaded successfully")
    );
    await Page.library.closeUpload();
    try {
      await Page.assertElementExist(page.getByText(document));
    } catch (error) {
      await page.reload();
      await Page.assertElementExist(page.getByText(document));
    }
    await Page.library.deleteDocument(document);
    try {
      await Page.assertElementIsNotExist(page.getByText(document));
    } catch (error) {
      await page.reload();
      await Page.assertElementIsNotExist(page.getByText(document));
    }
  });

  test("Can't upload large file", async ({ page }) => {
    const Page = new Pages(page);
    const document = "LargeFile.pdf";
    await Page.library.clickLibrary();
    await Page.library.uploadFile();
    await Page.library.clickSelectFiles();
    await Page.library.inputFile(document);
    await Page.assertElementExist(page.getByText("File size exceeds 20MB"));
  });

  test("Search file", async ({ page }) => {
    const Page = new Pages(page);
    const document = "SearchOne.pdf";
    await Page.library.clickLibrary();
    await Page.library.searchDocument("noExistOne");
    await Page.assertElementExist(page.getByRole("img", { name: "No data" }));
    await Page.library.searchDocument(document);
    const result = (
      await page.getByRole("cell", { name: "SearchOne.pdf" }).all()
    ).length;
    await Page.assertElementEqualTo(1, result);
  });
});
