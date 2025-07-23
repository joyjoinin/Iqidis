import { chromium, test } from "@playwright/test";
import Pages from "../common/page";

test.describe("Workspace", () => {
  const generateEmail = "joy+" + Date.now().toString() + "@gmail.com";
  const newGroup = { name: "New group", description: "This is new group" };
  const origin = {
    name: "China",
    description: "Personal workspace for joy",
  };
  const settings = {
    name: "New Settings",
    description: "This is new settings",
  };
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator('span[data-sentry-element="Avatar"]').click();
    await page.getByRole("menuitem", { name: "Manage Organization" }).click();
  });

  test("Workspace homepage", async ({ page }) => {
    const Page = new Pages(page);
    await Page.assertElementsExist([
      page
        .locator("div")
        .filter({ hasText: /^Seat Usage$/ })
        .first(),
      page.getByRole("heading", { name: "Admin Panel" }),
      page.getByText("Quick Actions"),
      page.getByRole("tab", { name: "Overview" }),
      page.getByRole("tab", { name: "Users" }),
      page.getByRole("tab", { name: "Groups" }),
      page.getByRole("tab", { name: "Settings" }),
    ]);
  });

  test("Invite user/ Delete user", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("tab", { name: "Users" }).click();
    await page.getByRole("button", { name: "Invite User" }).click();
    await page.getByPlaceholder("Enter email address").fill(generateEmail);
    await page.getByRole("button", { name: "Send Invitation" }).click();
    await Page.assertElementExist(
      page
        .locator("tr")
        .filter({ hasText: generateEmail })
        .getByRole("cell", { name: "PENDING" })
    );
    await page
      .locator("tr")
      .filter({ hasText: generateEmail })
      .getByRole("button", { name: "Delete" })
      .first()
      .click();
    await page.getByRole("button", { name: "OK" }).click();
    await Page.assertElementIsNotExist(
      page.locator("tr").filter({ hasText: generateEmail })
    );
  });

  test("Create group/ Delete group", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("tab", { name: "Groups" }).click();
    await page.getByRole("button", { name: "Create Group" }).click();
    await page.getByPlaceholder("Enter group name").fill(newGroup.name);
    await page
      .getByPlaceholder("Enter group description")
      .fill(newGroup.description);
    await page.waitForTimeout(3000);
    await page
      .getByLabel("Create Group")
      .getByRole("button", { name: "Create Group" })
      .click();
    await Page.assertElementExist(
      page
        .locator("tr")
        .filter({ hasText: newGroup.name })
        .getByRole("cell", { name: newGroup.description })
    );
    await page
      .locator("tr")
      .filter({ hasText: newGroup.name })
      .getByRole("button")
      .last()
      .click();
    await page.getByRole("button", { name: "Yes, Delete" }).click();
    await Page.assertElementIsNotExist(
      page
        .locator("tr")
        .filter({ hasText: newGroup.name })
        .getByRole("cell", { name: newGroup.description })
    );
  });

  test("Invite user/Delete user in group", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("tab", { name: "Groups" }).click();
    await page
      .getByRole("row", { name: "Shanghai test" })
      .getByRole("button")
      .first()
      .click();
    await page.locator("#seatId").click();
    await page.getByText("joy+04@57blocks.com").click();
    await page.waitForTimeout(3000);
    await page.getByRole("button", { name: "Add Member" }).click();
    await Page.assertElementsExist([
      page.getByText("Member added to group"),
      page.getByRole("row", { name: "joy+04@57blocks.com" }),
    ]);
    await page
      .getByRole("row", { name: "joy+04@57blocks.com Member" })
      .getByRole("button")
      .click();
    await page.getByRole("button", { name: "Yes" }).click();
    await Page.assertElementExist(page.getByText("Member removed from group"));
    await Page.assertElementIsNotExist(
      page.getByRole("row", { name: "joy+04@57blocks.com" })
    );
  });

  test("Settings", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("tab", { name: "Settings" }).click();
    await page.getByPlaceholder("Enter organization name").fill(settings.name);
    await page
      .getByPlaceholder("Enter organization description (optional)")
      .fill(settings.description);
    await page.getByRole("button", { name: "Save Changes" }).click();
    await Page.assertElementExist(page.getByText(settings.name));
    await page.waitForTimeout(3000);
    await page.getByPlaceholder("Enter organization name").fill(origin.name);
    await page
      .getByPlaceholder("Enter organization description (optional)")
      .fill(origin.description);
    await page.getByRole("button", { name: "Save Changes" }).click();
  });
});
