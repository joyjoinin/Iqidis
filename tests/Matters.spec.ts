import { test } from "@playwright/test";
import Pages from "../common/page";

test.describe("Attach files functions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Create matter", async ({ page }) => {
    const Page = new Pages(page);
    const newMatter = {
      name: "auto test",
      details: "automation",
      instructions: "Test instructions",
    };
    await Page.matters.manageMatters();
    await Page.matters.createMatterButton.click();
    await page
      .getByPlaceholder("e.g., Smith vs. Jones Contract Dispute")
      .fill(newMatter.name);
    await page.getByPlaceholder("Client/Project").fill(newMatter.details);
    await page
      .getByPlaceholder(
        "Your instructions will guide every chat you create within this matter. You can also turn instructions off/on in each matter chat."
      )
      .fill(newMatter.instructions);
    await page.getByRole("button", { name: "Create Matter" }).click();
    await Page.assertElementsExist([
      page.getByText("Matter created successfully"),
      page.getByRole("heading", { name: newMatter.name }),
    ]);
  });

  test("Matter's function", async ({ page }) => {
    const Page = new Pages(page);
    await Page.matters.manageMatters();
    await page
      .locator('div[data-sentry-component="MatterCard"]')
      .last()
      .click();
    await page.getByRole("button", { name: "Edit Instructions" }).click();
    await page
      .getByPlaceholder(
        "Your instructions will guide every chat you create within this matter. You can also turn instructions off/on in each matter chat."
      )
      .fill("Edit one");
    await page.getByRole("button", { name: "Save" }).click();
    await Page.assertElementExist(page.getByText("Instructions updated"));
    await page.getByRole("button", { name: "Upload Documents" }).click();
    await page.getByRole("button", { name: "Discard" }).click();
    await page.getByRole("button", { name: "Start New Chat" }).click();
    await Page.assertElementsExist([
      page.getByRole("button", { name: "Instructions Active" }),
      page.getByRole("button", { name: "View Matter" }),
      page.getByRole("button", { name: "Docs" }),
      page.getByRole("textbox", { name: "Drop files here or click to" }),
    ]);
  });

  test("Delete matter", async ({ page }) => {
    const Page = new Pages(page);
    await Page.matters.manageMatters();
    await page
      .locator('div[data-sentry-component="MatterCard"] button')
      .last()
      .click();
    await page.getByRole("menuitem", { name: "Delete Matter" }).click();
    await page.getByRole("button", { name: "Delete" }).click();
    await Page.assertElementsExist([
      page.getByText("Matter deleted successfully"),
      page.getByRole("heading", { name: "No matters yet" }),
    ]);
  });
});
