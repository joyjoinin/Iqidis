import { test } from "@playwright/test";
import Pages from "../common/page";

test.describe("Library functions", () => {
  test.skip();
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
  });

  test("Create folder/Share folder", async ({ page }) => {
    const Page = new Pages(page);
  });

  test("Move Files", async ({ page }) => {
    const Page = new Pages(page);
  });

  test("Move Files by action", async ({ page }) => {
    const Page = new Pages(page);
  });

  test("Edit folder", async ({ page }) => {
    const Page = new Pages(page);
  });

  test("Delete folder", async ({ page }) => {
    const Page = new Pages(page);
  });

  test("Delete file by Actions", async ({ page }) => {
    const Page = new Pages(page);
  });

  test("Delete file ", async ({ page }) => {
    const Page = new Pages(page);
  });

  test("Can't upload large file", async ({ page }) => {
    const Page = new Pages(page);
  });

  test("Search file", async ({ page }) => {
    const Page = new Pages(page);
  });
});
