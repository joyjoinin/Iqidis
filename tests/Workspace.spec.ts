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
    const Page = new Pages(page);
    await Page.workspace.manageOrganization();
  });

  test("Workspace homepage", async ({ page }) => {
    const Page = new Pages(page);
    await Page.assertElementsExist([
      Page.workspace.adminPanel,
      Page.workspace.seatUsage,
      Page.workspace.quickActions,
      Page.workspace.overview,
      Page.workspace.users,
      Page.workspace.workspaces,
      Page.workspace.settings,
    ]);
  });

  test("Quick actions", async ({ page }) => {
    const Page = new Pages(page);
    await Page.workspace.inviteNewUsers.click();
    await Page.assertElementExist(page.getByText("Invite UserEmailCancelSend"));
    await Page.workspace.cancelButton.click();
    await Page.workspace.settingsButton.click();
    await Page.assertElementExist(
      page.getByText("Organization NameOrganization")
    );
  });

  test("Invite user/ Delete user", async ({ page }) => {
    const Page = new Pages(page);
    await Page.workspace.users.click();
    await Page.workspace.inviteUserButton.click();
    await Page.workspace.inputEmail(generateEmail);
    await Page.workspace.sendInvitationButton.click();
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
    await Page.workspace.confirmButton.click();
    await Page.assertElementIsNotExist(
      page.locator("tr").filter({ hasText: generateEmail })
    );
  });

  test("Invite user and send it to workspace", async ({ page }) => {
    const Page = new Pages(page);
    const workspaceName = "Test 001";
    await Page.workspace.users.click();
    await Page.workspace.inviteUserButton.click();
    await Page.workspace.inputEmail(generateEmail);
    await page.locator(".ant-select-selection-overflow").click();
    await page.getByText(workspaceName).click();
    await page.locator(".ant-select-selection-overflow").click();
    await Page.workspace.sendInvitationButton.click();
    await Page.workspace.workspaces.click();
    await page
      .getByRole("row", { name: workspaceName })
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
      .getByRole("row", { name: workspaceName })
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
    await Page.workspace.users.click();
    await page
      .getByRole("row", { name: generateEmail })
      .getByRole("button")
      .nth(1)
      .click();
    await Page.workspace.confirmButton.click();
  });

  test("Search user", async ({ page }) => {
    const Page = new Pages(page);
    const invalidUser = "test@57blocks.com";
    const validUser = "joy+042@57blocks.com";
    await Page.workspace.users.click();

    // invalid user

    await Page.workspace.searchByNameOrEmail(invalidUser);
    await Page.assertElementIsNotExist(
      page.getByRole("cell", { name: invalidUser })
    );

    // valid user
    await Page.workspace.searchByNameOrEmail(validUser);
    await Page.assertElementExist(page.getByRole("cell", { name: validUser }));

    const result = await page.locator("tbody tr").all();
    await Page.assertElementEqualTo(result.length, 1);
  });

  test("Filter user", async ({ page }) => {
    const Page = new Pages(page);
    await Page.workspace.users.click();

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
    const editOne = {
      name: "edit",
      description: "edit description",
    };
    await Page.workspace.workspaces.click();
    await Page.workspace.createWorkspaceButton.click();
    await Page.workspace.inputWorkspaceName(newGroup.name);
    await Page.workspace.inputWorkspaceDescription(newGroup.description);
    await page.waitForTimeout(3000);
    await Page.workspace.createWorkspace();
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
    await Page.workspace.inputWorkspaceName(editOne.name);
    await Page.workspace.inputWorkspaceDescription(editOne.description);
    await Page.workspace.updateWorkspace();
    await page
      .locator("tr")
      .filter({ hasText: "edit" })
      .getByRole("button")
      .last()
      .click();
    await Page.workspace.deleteWorkspaceButton.click();
    await Page.assertElementIsNotExist(
      page
        .locator("tr")
        .filter({ hasText: "edit" })
        .getByRole("cell", { name: "Enter workspace description" })
    );
  });

  test("Invite user/Delete user in workspace", async ({ page }) => {
    const Page = new Pages(page);
    const user = "joy+03@57blocks.com";
    const workspace = "test 001";
    const addMessage = "1 member added to workspace successfully";
    const removeMessage = "Member removed from workspace successfully";
    await Page.workspace.workspaces.click();
    await page
      .getByRole("row", { name: workspace })
      .getByRole("button")
      .first()
      .click();
    await page.locator("#seatId").click();
    await page.getByText(user).click();
    await page.waitForTimeout(3000);
    await Page.workspace.addMembersButton.click();
    await Page.assertElementsExist([
      page.getByText(addMessage),
      page.getByRole("row", { name: user }),
    ]);
    await page.getByRole("row", { name: user }).getByRole("button").click();
    await Page.workspace.yesButton.click();
    await Page.assertElementExist(page.getByText(removeMessage));
    await Page.assertElementIsNotExist(page.getByRole("row", { name: user }));
  });

  test("Settings", async ({ page }) => {
    const Page = new Pages(page);
    await Page.workspace.settings.click();
    await Page.workspace.inputOrganizationName(settings.name);
    await Page.workspace.inputOrganizationDescription(settings.description);
    await Page.workspace.saveChangesButton.click();
    await Page.assertElementExist(
      page.getByText(settings.name, { exact: true })
    );
    await page.waitForTimeout(3000);
    await Page.workspace.inputOrganizationName(origin.name);
    await Page.workspace.inputOrganizationDescription(origin.description);
    await Page.workspace.saveChangesButton.click();
  });

  test("Purchase more seats", async ({ page }) => {
    const Page = new Pages(page);
    await Page.workspace.purchaseMoreSeatsButton.click();
    const initialValue = await Page.workspace.getPurchasedValue();
    await page.locator('button svg[data-sentry-element="Plus"]').click();
    const valueAdjusted = await Page.workspace.getPurchasedValue();
    await Page.assertElementEqualTo(
      Number(initialValue) + 1,
      Number(valueAdjusted)
    );
    await Page.workspace.addSeatsButton.click();
    await Page.workspace.payNowButton.click();
    await Page.assertElementExist(page.getByText("Backdev sandboxSandbox"));
  });

  test("Manage subscription", async ({ page }) => {
    const Page = new Pages(page);
    await Page.workspace.purchaseMoreSeatsButton.click();
    await Page.workspace.manageSubscriptionButton.click();
    await Page.assertElementsExist([
      Page.workspace.subscriptionHistoryText,
      Page.workspace.cancelCell,
      Page.workspace.activeStatus,
    ]);
  });

  test("Subscription history", async ({ page }) => {
    const Page = new Pages(page);
    await Page.workspace.subscriptionHistory.click();
    await Page.assertElementsExist([
      Page.workspace.cancelCell,
      Page.workspace.activeStatus,
    ]);
  });

  test("Cancel/Reactivate subscription ", async ({ page }) => {
    const Page = new Pages(page);
    await Page.workspace.subscriptionHistory.click();
    await page.locator("td button").filter({ hasText: "Cancel" }).click();
    await page.getByRole("button", { name: "Keep Subscription" }).click();
    await Page.assertElementExist(
      page.locator("td").filter({ hasText: "Active" })
    );
    await page.locator("td button").filter({ hasText: "Cancel" }).click();
    await Page.workspace.cancelSubscriptionButton.click();
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
    await Page.workspace.reactivateSubscriptionButton.click();
    await Page.assertElementExist(page.getByText("Subscription reactivated"));
    await page.waitForTimeout(30000);
    await page.reload();
    await Page.assertElementsExist([
      page.locator("td button").filter({ hasText: "Cancel" }),
      page.locator("td").filter({ hasText: "Active" }),
    ]);
  });
});
