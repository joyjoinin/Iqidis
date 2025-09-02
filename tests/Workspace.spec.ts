import { test } from "@playwright/test";
import Pages from "../common/page";

test.describe("Workspace", () => {
  const generateEmail = "joy+" + Date.now().toString() + "@gmail.com";
  const newGroup = { name: "New group", description: "This is new group" };
  const origin = {
    name: "Automation",
    description: "Automation test",
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
      page.getByRole("tab", { name: "Workspaces" }),
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

  test("Invite user and send it to workspace", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("tab", { name: "Users" }).click();
    await page.getByRole("button", { name: "Invite User" }).click();
    await page.getByPlaceholder("Enter email address").fill(generateEmail);
    await page.locator(".ant-select-selection-overflow").click();
    await page.getByText("Test 001").click();
    await page.locator(".ant-select-selection-overflow").click();
    await page.getByRole("button", { name: "Send Invitation" }).click();
    await page.getByRole("tab", { name: "Workspaces" }).click();
    await page
      .getByRole("row", { name: "Test 001" })
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
      .getByRole("row", { name: "Test 001" })
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
      .fill("joy+042@57blocks.com");
    await Page.assertElementExist(
      page.getByRole("cell", { name: "joy+042@57blocks.com" })
    );

    const result = await page.locator("tbody tr").all();
    await Page.assertElementEqualTo(result.length, 1);
  });

  test("Filter user", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("tab", { name: "Users" }).click();

    // Accepted user
    await page.getByLabel("Users").getByText("All Status").click();
    await page.getByText("Accepted", { exact: true }).click();
    await Page.assertElementsExist([
      page.getByRole("cell", { name: "ACCEPTED" }).first(),
      page.getByRole("cell", { name: "Owner", exact: true }),
    ]);
    await Page.assertElementIsNotExist(
      page.getByRole("cell", { name: "PENDING" })
    );

    // Pending user
    await page
      .getByLabel("Users")
      .locator("div")
      .filter({ hasText: /^Accepted$/ })
      .click();
    await page.getByText("Pending", { exact: true }).click();
    await Page.assertElementExist(
      page.getByRole("cell", { name: "PENDING" }).first()
    );
    await Page.assertElementsAreNotExist([
      page.getByRole("cell", { name: "ACCEPTED" }),
      page.getByRole("cell", { name: "Owner", exact: true }),
    ]);
  });

  test("Create workspace/Edit/ Delete workspace", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("tab", { name: "Workspaces" }).click();
    await page.getByRole("button", { name: "Create Workspace" }).click();
    await page.getByPlaceholder("Enter workspace name").fill(newGroup.name);
    await page
      .getByPlaceholder("Enter workspace description")
      .fill(newGroup.description);
    await page.waitForTimeout(3000);
    await page
      .getByLabel("Create workspace")
      .getByRole("button", { name: "Create Workspace" })
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
    await page.getByPlaceholder("Enter workspace name").clear();
    await page.getByPlaceholder("Enter workspace name").fill("edit");
    await page.getByPlaceholder("Enter workspace description").clear();
    await page
      .getByPlaceholder("Enter workspace description")
      .fill("edit description");
    await page.getByRole("button", { name: "Update workspace" }).click();
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
        .getByRole("cell", { name: "Enter workspace description" })
    );
  });

  test("Invite user/Delete user in workspace", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("tab", { name: "Workspaces" }).click();
    await page
      .getByRole("row", { name: "test 001" })
      .getByRole("button")
      .first()
      .click();
    await page.locator("#seatId").click();
    await page.getByText("joy+03@57blocks.com").click();
    await page.waitForTimeout(3000);
    await page.getByRole("button", { name: "Add Members" }).click();
    await Page.assertElementsExist([
      page.getByText("1 member added to workspace successfully"),
      page.getByRole("row", { name: "joy+03@57blocks.com" }),
    ]);
    await page
      .getByRole("row", { name: "joy+03@57blocks.com Member" })
      .getByRole("button")
      .click();
    await page.getByRole("button", { name: "Yes" }).click();
    await Page.assertElementExist(
      page.getByText("Member removed from workspace successfully")
    );
    await Page.assertElementIsNotExist(
      page.getByRole("row", { name: "joy+03@57blocks.com" })
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
    await Page.assertElementExist(
      page.getByText(settings.name, { exact: true })
    );
    await page.waitForTimeout(3000);
    await page.getByPlaceholder("Enter organization name").fill(origin.name);
    await page
      .getByPlaceholder("Enter organization description (optional)")
      .fill(origin.description);
    await page.getByRole("button", { name: "Save Changes" }).click();
  });

  test("Purchase more seats", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("button", { name: "Purchase more seats" }).click();
    const initialValue = await page
      .locator("input.ant-input-number-input")
      .getAttribute("value");
    await page.locator('button svg[data-sentry-element="Plus"]').click();
    const valueAdjusted = await page
      .locator("input.ant-input-number-input")
      .getAttribute("value");
    await Page.assertElementEqualTo(
      Number(initialValue) + 1,
      Number(valueAdjusted)
    );
    await page.getByRole("button", { name: "Add Seats" }).click();
    await page.getByRole("button", { name: "Pay Now" }).click();
    await Page.assertElementExist(page.getByText("Backdev sandboxSandbox"));
  });

  test("Manage subscription", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("button", { name: "Purchase more seats" }).click();
    await page.getByRole("button", { name: "Manage Subscription" }).click();
    await Page.assertElementsExist([
      page.getByText("Subscription History"),
      page.getByRole("cell", { name: "Cancel" }),
      page.getByText("Active", { exact: true }),
    ]);
  });

  test("Subscription history", async ({ page }) => {
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
    await page.getByRole("button", { name: "Keep Subscription" }).click();
    await Page.assertElementExist(
      page.locator("td").filter({ hasText: "Active" })
    );
    await page.locator("td button").filter({ hasText: "Cancel" }).click();
    await page.getByRole("button", { name: "Cancel Subscription" }).click();
    await page.waitForTimeout(25000);
    await page.reload();
    await Page.assertElementExist(
      page.getByRole("alert").filter({ hasText: "Subscription Cancellation" })
    );
    await page.waitForTimeout(20000);
    await page.reload();
    await Page.assertElementExist(
      page.locator("td").filter({ hasText: "Canceled" })
    );
    await page.getByRole("button", { name: "Reactivate Subscription" }).click();
    await Page.assertElementExist(page.getByText("Subscription reactivated"));
    await page.waitForTimeout(30000);
    await page.reload();
    await Page.assertElementsExist([
      page.locator("td button").filter({ hasText: "Cancel" }),
      page.locator("td").filter({ hasText: "Active" }),
    ]);
  });
});
