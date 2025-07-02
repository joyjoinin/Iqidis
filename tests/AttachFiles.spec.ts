import { expect, test } from "@playwright/test";

test("Attach documents", async ({ page }) => {
  await page.goto("/");
  await page.locator("button[data-role='attachments-button']").click();
  await page.getByText("Library Files").click();
  await page.getByText("All Documents").click();

  //Attach first page files
  await page.getByRole("checkbox", { name: "Select all" }).check();
  await page.getByRole("button", { name: "Attach" }).click();
  await expect(
    page.getByText("File size or quantity exceeds")
  ).toBeInViewport();
  const FileAttached = (await page.locator(".w-20").all()).length;
  expect(FileAttached).toEqual(10);

  //Delete attach files
  for (let i = 0; i < 3; i++) {
    await page
      .locator("div[data-sentry-source-file='preview-attachment.tsx'] button")
      .last()
      .click();
    await expect(page.getByText("File deleted:").last()).toBeInViewport();

    await page.waitForTimeout(3000);
  }
  const restFiles = (await page.locator(".w-20").all()).length;
  expect(restFiles).toEqual(FileAttached - 3);
});

test("Filter documents", async ({ page }) => {
  await page.goto("/");
  await page.locator("button[data-role='attachments-button']").click();
  await page.getByText("Library Files").click();
  await page.getByText("All Documents").click();
  await page.locator(".lucide.lucide-filter").click();
  await page.locator(".lucide.lucide-filter").hover();
  await page.getByText("PDF Files").click();
  await page.waitForTimeout(3000);
  await expect(
    page.getByRole("cell", { name: "DOCX", exact: true })
  ).toBeHidden();
  await expect(
    page.getByRole("cell", { name: "TXT", exact: true })
  ).toBeHidden();
});

test("Recent documents", async ({ page }) => {
  await page.goto("/");
  await page.locator("button[data-role='attachments-button']").click();

  //Go to Recent Files
  await page.getByText("Recent Files").click();

  //Attach File
  await page.getByRole("button", { name: "Attach" }).first().click();
  await expect(page.locator(".w-20")).toBeInViewport();
});

test("Favorite documents", async ({ page }) => {
  await page.goto("/");
  await page.locator("button[data-role='attachments-button']").click();
  await page.getByText("Recent Files").click();

  // Add stars

  for (let i = 0; i < 3; i++) {
    await page
      .locator(
        'svg[class="lucide lucide-star size-4 cursor-pointer hover:text-yellow-700"]'
      )
      .first()
      .click();
    await page.waitForTimeout(3000);
  }

  const stars = (
    await page
      .locator(
        'svg[class="lucide lucide-star size-4 cursor-pointer hover:text-yellow-700 text-yellow-300 fill-current"]'
      )
      .all()
  ).length;
  await page.locator("label").filter({ hasText: "Favorites" }).click();
  await page.waitForTimeout(3000);
  const files = (
    await page
      .locator(
        'svg[class="lucide lucide-star size-4 cursor-pointer hover:text-yellow-700 text-yellow-300 fill-current"]'
      )
      .all()
  ).length;

  expect(files).toEqual(stars);

  // Remove stars

  for (let i = 0; i < 3; i++) {
    await page
      .locator(
        'svg[class="lucide lucide-star size-4 cursor-pointer hover:text-yellow-700 text-yellow-300 fill-current"]'
      )
      .first()
      .click();
    await page.waitForTimeout(3000);
  }

  await expect(page.getByText("No documents found")).toBeInViewport();
});

test("Browse Library", async ({ page }) => {
  await page.goto("/");
  await page.locator("button[data-role='attachments-button']").click();

  //Go to Recent Files
  await page.getByText("Recent Files").click();

  //Browse library
  await page.getByRole("button", { name: "Browse Library" }).click();
  expect(page.getByText("Select Source")).toBeInViewport();
});

test("Upload new from Recent", async ({ page }) => {
  await page.goto("/");
  await page.locator("button[data-role='attachments-button']").click();

  //Go to Recent Files
  await page.getByText("Recent Files").click();

  //Browse library
  await page.getByRole("button", { name: "Upload New" }).click();
  await page.getByRole("button", { name: "Select files", exact: true }).click();
  const file_input = page.locator("input[name='file']");
  await file_input.setInputFiles("common/testFiles/UploadFile1.pdf");
  await expect(
    page.getByRole("button", { name: "files waiting to upload Add files" })
  ).toBeInViewport();
  await page.getByRole("button", { name: "Upload", exact: true }).click();
  await expect(page.getByText("1 files uploaded successfully")).toBeInViewport({
    timeout: 15000,
  });
  await page
    .getByRole("button", { name: "Attach to chat" })
    .click({ timeout: 15000 });
  await expect(page.locator(".w-20")).toBeInViewport();
});

test("Upload new from Upload New Files", async ({ page }) => {
  await page.goto("/");
  await page.locator("button[data-role='attachments-button']").click();

  //Go to Recent Files
  await page.getByText("Upload New Files").click();

  //Browse library
  await page.getByRole("button", { name: "Select files", exact: true }).click();
  const file_input = page.locator("input[name='file']");
  await file_input.setInputFiles("common/testFiles/UploadFile1.pdf");
  await expect(
    page.getByRole("button", { name: "files waiting to upload Add files" })
  ).toBeInViewport();
  await page.getByRole("button", { name: "Upload", exact: true }).click();
  await expect(page.getByText("1 files uploaded successfully")).toBeInViewport({
    timeout: 15000,
  });

  await page
    .getByRole("button", { name: "Attach to chat" })
    .click({ timeout: 15000 });
  await expect(page.locator(".w-20")).toBeInViewport();
});

test("Do not add document to library", async ({ page }) => {
  await page.goto("/");
  await page.locator("button[data-role='attachments-button']").click();

  //Go to Recent Files
  await page.getByText("Upload New Files").click();

  await page
    .getByRole("checkbox", { name: "Do not add document to library" })
    .check();
  await page.getByRole("button", { name: "Select files", exact: true }).click();
  const file_input = page.locator("input[name='file']");
  await file_input.setInputFiles("common/testFiles/NoAddToLibrary.pdf");
  await expect(
    page.getByRole("button", { name: "files waiting to upload Add files" })
  ).toBeInViewport();
  await page.getByRole("button", { name: "Upload", exact: true }).click();
  await expect(page.getByText("1 files uploaded successfully")).toBeInViewport({
    timeout: 30000,
  });
  await page.locator("button").filter({ hasText: "Close" }).click();

  //Check file
  await page.locator("button[data-role='attachments-button']").click();
  await page.getByText("Library Files").click();
  await page.getByText("All Documents").click();
  await expect(page.getByText("NoAddToLibrary.pdf")).toBeHidden();
});
