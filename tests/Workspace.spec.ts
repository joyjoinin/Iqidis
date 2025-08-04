import { test } from "@playwright/test";
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
      page.getByText("Seat Usage"),
      page.getByRole("heading", { name: "Admin Panel" }),
      page
        .locator('div[data-sentry-element="Card"]')
        .getByText("Quick Actions"),
      page.getByRole("tab", { name: "Overview" }),
      page.getByRole("tab", { name: "Users" }),
      page.getByRole("tab", { name: "Groups" }),
      page.getByRole("tab", { name: "Settings" }),
    ]);
  });

  test("Quick actions", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("button", { name: "Invite New Users" }).click();
    await Page.assertElementExist(page.getByText("Invite UserEmailCancelSend"));
    await page.getByRole("button", { name: "Cancel" }).click();
    await page.getByRole("button", { name: "Settings" }).click();
    await Page.assertElementExist(
      page.getByText("Organization NameOrganization")
    );
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

  test("Invite user and send it to groups", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("tab", { name: "Users" }).click();
    await page.getByRole("button", { name: "Invite User" }).click();
    await page.getByPlaceholder("Enter email address").fill(generateEmail);
    await page.locator(".ant-select-selection-overflow").click();
    await page.getByText("Beijing").click();
    await page.getByText("Sichuan").click();
    await page.locator(".ant-select-selection-overflow").click();
    await page.getByRole("button", { name: "Send Invitation" }).click();
    await page.getByRole("tab", { name: "Groups" }).click();
    await page
      .getByRole("row", { name: "Beijing" })
      .getByRole("button")
      .first()
      .click();
    await Page.assertElementExist(
      page.locator("tr").filter({ hasText: generateEmail })
    );
    await page
      .getByRole("dialog")
      .filter({ hasText: "Manage Members " })
      .getByLabel("Close", { exact: true })
      .click();
    await page
      .getByRole("row", { name: "Sichuan" })
      .getByRole("button")
      .first()
      .click();
    await Page.assertElementExist(
      page.locator("tr").filter({ hasText: generateEmail })
    );
    await page
      .getByRole("dialog")
      .filter({ hasText: "Manage Members " })
      .getByLabel("Close", { exact: true })
      .click();

    // delete user to clean data
    await page.getByRole("tab", { name: "Users" }).click();
    await page
      .getByRole("row", { name: generateEmail })
      .getByRole("button")
      .nth(1)
      .click();
    await page.getByRole("button", { name: "OK" }).click();
  });

  test("Search user", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("tab", { name: "Users" }).click();
    await page
      .getByRole("textbox", { name: "Search by name or email" })
      .click();

    // invalid user
    await page
      .getByPlaceholder("Search by name or email")
      .fill("test@57blocks.com");
    await Page.assertElementIsNotExist(
      page.getByRole("cell", { name: "test@57blocks.com" })
    );

    //
    await page
      .getByPlaceholder("Search by name or email")
      .fill("joy+05@57blocks.com");
    await Page.assertElementExist(
      page.getByRole("cell", { name: "joy+05@57blocks.com" })
    );

    const result = await page.locator("tbody tr").all();
    await Page.assertElementEqualTo(result.length, 1);
  });

  test("Create group/Edit/ Delete group", async ({ page }) => {
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
      .nth(1)
      .click();
    await page.getByPlaceholder("Enter group name").clear();
    await page.getByPlaceholder("Enter group name").fill("edit");
    await page.getByPlaceholder("Enter group description").clear();
    await page
      .getByPlaceholder("Enter group description")
      .fill("edit description");
    await page.getByRole("button", { name: "Update Group" }).click();
    await page
      .locator("tr")
      .filter({ hasText: "edit" })
      .getByRole("button")
      .last()
      .click();
    await page.getByRole("button", { name: "Yes, Delete" }).click();
    await Page.assertElementIsNotExist(
      page
        .locator("tr")
        .filter({ hasText: "edit" })
        .getByRole("cell", { name: "Enter group description" })
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

  test("Buy more seats", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("link", { name: "Buy more seats" }).click();
    await page.locator('button svg[data-sentry-element="Plus"]').click();
    await page.getByRole("button", { name: "Add Seats" }).click();
    await page.getByRole("button", { name: "Pay Now" }).click();
    await Page.assertElementExist(page.getByText("Backdev sandboxSandbox"));
  });

  test("Manage subscription", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("link", { name: "Buy more seats" }).click();
    await page.getByRole("button", { name: "Manage Subscription" }).click();
    await Page.assertElementsExist([
      page.getByText("Subscription History"),
      page.getByRole("cell", { name: "Cancel" }),
      page.getByText("Active", { exact: true }),
    ]);
  });

  test("subscription history", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("tab", { name: "Subscription History" }).click();
    await Page.assertElementsExist([
      page.getByRole("cell", { name: "Cancel" }),
      page.getByText("Active", { exact: true }),
    ]);
  });

  test("Cancel/Reactivate subscription ", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("tab", { name: "Subscription History" }).click();
    await page.locator("td button").filter({ hasText: "Cancel" }).click();
    await page.getByRole("button", { name: "Cancel Subscription" }).click();
    await page.waitForTimeout(10000);
    await Page.assertElementExist(
      page.getByRole("alert").filter({ hasText: "Subscription Cancellation" })
    );
    await page.getByRole("button", { name: "Reactivate Subscription" }).click();
    await Page.assertElementExist(page.getByText("Subscription reactivated"));
    await page.waitForTimeout(5000);
    await page.reload();
    await Page.assertElementExist(
      page.locator("td button").filter({ hasText: "Cancel" })
    );
  });
});
