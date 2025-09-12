import { test } from "@playwright/test";
import Pages from "../common/page";

test.describe("Attach files functions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Create matters", async ({ page }) => {
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
});
