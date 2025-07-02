import { expect, test } from "@playwright/test";

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
  await page.goto("/");
  await page.getByRole("button", { name: "Library" }).click();
  await page.getByRole("button", { name: "Upload" }).click();

  await page.getByRole("button", { name: "Select files", exact: true }).click();
  const file_input = page.locator("input[name='file']");
  await file_input.setInputFiles("common/testFiles/UploadFile1.pdf");
  await expect(
    page.getByRole("button", { name: "files waiting to upload Add files" })
  ).toBeInViewport();
  await page
    .getByLabel("Upload Documents")
    .getByRole("button", { name: "Upload", exact: true })
    .click();
  await expect(page.getByText("1 files uploaded successfully")).toBeInViewport({
    timeout: 15000,
  });
  await page
    .getByRole("button", { name: "Continue Upload" })
    .click({ timeout: 3000 });
  await expect(page.getByText("Upload Documents")).toBeInViewport();
});

test("Create folder", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Library" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Folders$/ })
    .click();
  await page.getByRole("button", { name: "New Folder" }).click();
  await page.getByPlaceholder("Please input folder name").fill(folderName);
  await page.waitForTimeout(3000);
  await page
    .getByPlaceholder("Please input folder description")
    .fill(description);
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Folder created successfully")).toBeInViewport();
  await expect(page.getByText(folderName + "" + description)).toBeInViewport();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Create New Folder$/ })
      .nth(1)
  ).toBeInViewport();
});

test("Move Files", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Library" }).click();
  const fileNumber = 3;
  for (let i = 0; i < fileNumber; i++) {
    await page.locator("td input[class='ant-checkbox-input']").nth(i).check();
    await page.waitForTimeout(1000);
  }
  await expect(page.getByText(`${fileNumber} selected`)).toBeInViewport();
  await page.getByRole("button", { name: "Move Files" }).click();
  await page
    .locator(
      ".ant-select.ant-select-outlined.sm\\:w-\\[220px\\] > .ant-select-selector"
    )
    .click();
  await page
    .locator('div[class="ant-select-item ant-select-item-option"]')
    .last()
    .click();
  await page.getByRole("button", { name: "Move", exact: true }).click();
  await expect(
    page.getByText("Document(s) moved successfully")
  ).toBeInViewport();
  await page
    .locator("div")
    .filter({ hasText: /^Folders$/ })
    .click();
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

  expect(filesCounts).toEqual(fileNumber);
});

test("Edit folder", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Library" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Folders$/ })
    .click();
  await page
    .locator(
      'svg[class="lucide lucide-ellipsis size-4 dark:group-hover:text-white group-hover:text-function-message"]'
    )
    .first()
    .click();
  await page.getByRole("menuitem", { name: "Edit" }).click();
  await page.getByPlaceholder("Please input folder name").fill(editName);
  await page.waitForTimeout(3000);
  await page
    .getByPlaceholder("Please input folder description")
    .fill(editDescription);
  await page.getByRole("button", { name: "Rename" }).click();
  await expect(page.getByText("Folder renamed successfully")).toBeInViewport();
});

test("Delete folder", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Library" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Folders$/ })
    .click();
  await page
    .locator(
      'svg[class="lucide lucide-ellipsis size-4 dark:group-hover:text-white group-hover:text-function-message"]'
    )
    .first()
    .click();
  await page.getByRole("menuitem", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText("Folder deleted successfully")).toBeInViewport();
  await expect(page.getByText("No Records Yet")).toBeInViewport();
});

test("Share on All Documents", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Library" }).click();
  await expect(page.getByRole("button", { name: "Share" })).toBeDisabled();
  await page.getByRole("button", { name: "Share" }).hover();
  await expect(page.getByText("Coming soon")).toBeInViewport();
});

test("Shared on Tap", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Library" }).click();
  await page.getByText("Shared", { exact: true }).hover();
  await expect(page.getByText("Coming soon")).toBeInViewport();
});
