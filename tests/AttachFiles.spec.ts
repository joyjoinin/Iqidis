import { test } from "@playwright/test";
import Pages from "../common/page";

test.describe("Attach files functions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Attach documents", async ({ page }) => {
    const Page = new Pages(page);
    await Page.attachFiles.clickAttachFilesIcon();
    await Page.attachFiles.clickLibraryFiles();
    await Page.attachFiles.clickAllDocuments();

    //Attach first page files
    await Page.attachFiles.selectAllFiles();
    await Page.attachFiles.attachFile();

    // await Page.assertElementExist(
    //   page.getByText("File size or quantity exceeds")
    // );
    const FileAttached = (await page.locator(".w-20").all()).length;
    await Page.assertElementEqualTo(10, FileAttached);

    //Delete attach files
    for (let i = 0; i < 3; i++) {
      await page
        .locator("div[data-sentry-source-file='preview-attachment.tsx'] button")
        .last()
        .click();
      await Page.assertElementExist(page.getByText("File deleted:").last());
      await page.waitForTimeout(3000);
    }
    const restFiles = (await Page.file.all()).length;
    await Page.assertElementEqualTo(FileAttached - 3, restFiles);
  });

  test("Filter documents", async ({ page }) => {
    const Page = new Pages(page);
    await Page.attachFiles.clickAttachFilesIcon();
    await Page.attachFiles.clickLibraryFiles();
    await Page.attachFiles.clickAllDocuments();
    await Page.attachFiles.clickFilter();
    await Page.attachFiles.selectPDF();
    await Page.assertElementsAreNotExist([
      page.getByRole("cell", { name: "DOCX", exact: true }),
      page.getByRole("cell", { name: "TXT", exact: true }),
    ]);

    await Page.attachFiles.clickFilter();
    await Page.attachFiles.selectPDF();
    await Page.attachFiles.clickFilter();
    await Page.attachFiles.selectDoc();
    await Page.assertElementsAreNotExist([
      page.getByRole("cell", { name: "PDF", exact: true }),
      page.getByRole("cell", { name: "TXT", exact: true }),
    ]);

    await Page.attachFiles.clickFilter();
    await Page.attachFiles.selectDoc();
    await Page.attachFiles.clickFilter();
    await Page.attachFiles.selectTxt();
    await Page.assertElementsAreNotExist([
      page.getByRole("cell", { name: "DOCX", exact: true }),
      page.getByRole("cell", { name: "PDF", exact: true }),
    ]);
  });

  test("Recent documents", async ({ page }) => {
    const Page = new Pages(page);
    await Page.attachFiles.clickAttachFilesIcon();
    await Page.attachFiles.clickRecentFiles();

    //Attach first file
    await Page.page
      .locator('div[data-sentry-component="RecentView"]')
      .getByRole("button", { name: "Attach", exact: true })
      .first()
      .click();
    await Page.assertElementExist(
      page.getByRole("button", { name: "Click to preview" }).getByRole("button")
    );
  });

  test("Favorite documents", async ({ page }) => {
    const Page = new Pages(page);
    await Page.attachFiles.clickAttachFilesIcon();
    await Page.attachFiles.clickRecentFiles();

    // Add stars

    for (let i = 0; i < 3; i++) {
      await Page.attachFiles.star.first().click();
      await page.waitForTimeout(3000);
    }

    const stars = (await Page.attachFiles.yellowStar.all()).length;
    await Page.attachFiles.clickFavorites();
    const files = (await Page.attachFiles.yellowStar.all()).length;
    await Page.assertElementEqualTo(stars, files);

    // Remove stars

    for (let i = 0; i < 3; i++) {
      await Page.attachFiles.yellowStar.first().click();
      await page.waitForTimeout(3000);
    }

    await Page.assertElementExist(page.getByText("No documents found"));
  });

  test("Browse Library", async ({ page }) => {
    const Page = new Pages(page);
    await Page.attachFiles.clickAttachFilesIcon();
    await Page.attachFiles.clickRecentFiles();
    await Page.attachFiles.clickBrowseLibrary();
    await Page.assertElementExist(page.getByText("Select Source"));
  });

  test("Upload new from Recent", async ({ page }) => {
    const Page = new Pages(page);
    await Page.attachFiles.clickAttachFilesIcon();
    await Page.attachFiles.clickRecentFiles();

    //Browse library
    await Page.attachFiles.clickUploadNew();
    await Page.attachFiles.clickSelectFiles();
    await Page.attachFiles.inputFile();
    await Page.assertElementExist(Page.attachFiles.waitingButton);
    await Page.attachFiles.upload();
    await Page.assertElementExist(
      page.getByText("1 files uploaded successfully")
    );
    await Page.attachFiles.attachToChat();
    await Page.assertElementExist(Page.file);
  });

  test("Upload new from Upload New Files", async ({ page }) => {
    const Page = new Pages(page);
    await Page.attachFiles.clickAttachFilesIcon();
    await Page.attachFiles.clickUploadNewFiles();
    //Browse library
    await Page.attachFiles.clickSelectFiles();
    await Page.attachFiles.inputFile();
    await Page.assertElementExist(Page.attachFiles.waitingButton);
    await Page.attachFiles.upload();
    await Page.assertElementExist(
      page.getByText("1 files uploaded successfully")
    );
    await Page.attachFiles.attachToChat();
    await Page.assertElementExist(Page.file);
  });

  test("Do not add document to library", async ({ page }) => {
    const Page = new Pages(page);
    await Page.attachFiles.clickAttachFilesIcon();
    await Page.attachFiles.clickUploadNewFiles();
    await Page.attachFiles.doNotAddDocumentToLibrary();
    await Page.attachFiles.inputFile("common/testFiles/NoAddToLibrary.pdf");

    await Page.assertElementExist(Page.attachFiles.waitingButton);
    await Page.attachFiles.upload();
    await Page.assertElementExist(
      page.getByText("1 files uploaded successfully")
    );
    await Page.attachFiles.closeUpload();

    //Check file
    await Page.attachFiles.clickAttachFilesIcon();
    await Page.attachFiles.clickLibraryFiles();
    await Page.attachFiles.clickAllDocuments();
    await Page.assertElementIsNotExist(page.getByText("NoAddToLibrary.pdf"));
  });
});
