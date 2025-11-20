import { test } from "@playwright/test";
import Pages from "../common/page";

test.describe("Organization", () => {
  function generateRandomString(length: number = 16): string {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length })
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join("");
  }
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
    await page.goto("/");
    await Page.organization.organization();
    await page.waitForTimeout(3000);
  });

  test("Organization overview", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("tab", { name: "Overview" }).click();
    await Page.assertElementsExist([
      page.getByRole("tab", { name: "Overview" }),
      page.getByRole("tab", { name: "Billing" }),
      page.getByRole("button", { name: "Purchase Licenses" }),
      page.getByRole("heading", { name: "Members" }),
      page.getByRole("button", { name: "Invite User" }),
      page.getByText("Total Members"),
      page.getByText("Licenses Used"),
      page.getByText("Pending Invites"),
      page.getByText("User", { exact: true }),
      page.getByText("Role", { exact: true }),
      page.getByText("Status", { exact: true }),
      page.getByText("Trial/Start", { exact: true }),
      page.getByText("Action", { exact: true }),
    ]);
  });

  test("Organization billing", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("tab", { name: "Billing" }).click();
    await Page.assertElementsExist([
      page.getByRole("heading", { name: "Billing history" }),
      page.getByRole("button", { name: "Export CSV" }),
      page.getByRole("heading", { name: "Licenses & Payment Method" }),
      page.getByRole("button", { name: "Purchase Licenses" }),
      page.getByRole("button", { name: "Manage Payment Methods" }),
      page.getByRole("heading", { name: "Billing Rules" }),
      page.getByText("Licenses", { exact: true }),
      page.getByText("Amount Paid", { exact: true }),
      page.getByText("Billing Cycle", { exact: true }),
      page.getByText("Paid Date", { exact: true }),
      page.getByText("Actions", { exact: true }),
    ]);
    await page.getByRole("button", { name: "Manage Payment Methods" }).click();
    await Page.assertElementsExist([
      page.getByRole("heading", { name: "Payment Methods" }),
      page.getByRole("button", { name: "Add New" }),
    ]);
    await page.getByRole("button", { name: "Close" }).first().click();
    await page.getByRole("button", { name: "Purchase Licenses" }).click();
    await Page.assertElementsExist([
      page.getByRole("heading", { name: "Purchase Licenses" }),
      page.getByRole("heading", { name: "Current Plan Overview" }),
      page.getByRole("button", { name: "Monthly" }),
      page.getByRole("button", { name: "Annual" }),
      page.getByRole("button", { name: "Billing History" }),
    ]);
  });

  test("Organization setting", async ({ page }) => {
    const Page = new Pages(page);
    const organizationName = "Organization" + Date.now().toString();
    const description = "description + " + generateRandomString();
    await page
      .locator(
        'div[data-sentry-component="OrganizationDetail"] button[aria-haspopup="menu"]'
      )
      .nth(0)
      .click();
    await page.getByRole("menuitem", { name: "Edit" }).click();
    await Page.assertElementsExist([
      page.getByRole("heading", { name: "Organization Setting" }),
      page.getByText("Manage your organization's"),
      page.getByRole("button", { name: "Close" }),
    ]);
    await page
      .getByPlaceholder("Enter organization name")
      .fill(organizationName);
    await page.getByPlaceholder("Enter organization detail").fill(description);
    await page.getByRole("button", { name: "Save Changes" }).click();
    await Page.assertElementsExist([
      page.getByText("Organization information updated successfully"),
      page.getByText(organizationName),
    ]);
  });

  test("Invite User", async ({ page }) => {
    const Page = new Pages(page);
    const email = "joy+" + Date.now().toString() + "@gmail.com";
    await page.getByRole("tab", { name: "Overview" }).click();
    await page.getByRole("button", { name: "Invite User" }).click();
    await page.getByPlaceholder("Enter Email here").fill(email);
    await page.getByRole("button", { name: "Send Invitation" }).click();
    await Page.assertElementsExist([
      page.getByText("The invitation has been"),
      page.getByText(email),
      page.getByText("Pending", { exact: true }),
      page.getByRole("cell", { name: "Member" }),
      page.getByText("Waiting for Acceptance"),
    ]);

    // resend invite email

    await page
      .locator('div [data-sentry-source-file="OverviewTab.tsx"] ')
      .filter({ hasText: email })
      .locator("button")
      .click();

    await page.getByRole("menuitem", { name: "Resend" }).click();
    await Page.assertElementExist(
      page.getByText("Invitation resent successfully")
    );

    // delete user to clean data

    await page
      .locator('div [data-sentry-source-file="OverviewTab.tsx"] ')
      .filter({ hasText: email })
      .locator("button")
      .click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await Page.assertElementExist(page.getByText("Are you sure you want to"));
    await page.getByRole("button", { name: "OK" }).click();
    await Page.assertElementExist(page.getByText("User Deleted successfully"));
    await Page.assertElementIsNotExist(
      page
        .locator('div [data-sentry-source-file="OverviewTab.tsx"] ')
        .filter({ hasText: email })
    );
  });

  test("Upgrade Subscription", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("tab", { name: "Overview" }).click();
    await page.getByRole("button", { name: "Upgrade Subscription" }).click();
    await Page.assertElementsExist([
      page.getByRole("heading", { name: "Purchase Licenses" }),
      page.getByRole("heading", { name: "Current Plan Overview" }),
      page.getByRole("button", { name: "Monthly" }),
      page.getByRole("button", { name: "Annual" }),
      page.getByRole("button", { name: "Billing History" }),
    ]);
  });

  test("Manage Billing", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("tab", { name: "Overview" }).click();
    await page.getByRole("button", { name: "Manage Billing" }).click();
    await Page.assertElementsExist([
      page.getByRole("heading", { name: "Billing history" }),
      page.getByRole("button", { name: "Export CSV" }),
      page.getByRole("heading", { name: "Licenses & Payment Method" }),
      page.getByRole("button", { name: "Purchase Licenses" }),
      page.getByRole("button", { name: "Manage Payment Methods" }),
      page.getByRole("heading", { name: "Billing Rules" }),
      page.getByText("Licenses", { exact: true }),
      page.getByText("Amount Paid", { exact: true }),
      page.getByText("Billing Cycle", { exact: true }),
      page.getByText("Paid Date", { exact: true }),
      page.getByText("Actions", { exact: true }),
    ]);
  });
});
