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
    };
    await Page.matters.manageMatters();
    await Page.matters.createMatterButton.click();
    await page
      .getByPlaceholder("e.g., Smith vs. Jones Contract Dispute")
      .fill(newMatter.name);
    await page.getByPlaceholder("Client/Project").fill(newMatter.details);
    await page.getByRole("button", { name: "Create Matter" }).click();
    await Page.assertElementsExist([
      page.getByText("Matter created successfully"),
      page.getByRole("heading", { name: newMatter.name }),
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
