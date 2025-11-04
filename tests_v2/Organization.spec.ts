import { test } from "@playwright/test";
import Pages from "../common/page";

test.describe("Organization", () => {
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
      page.getByRole("button", { name: "Add Payment Method" }),
      page.getByRole("heading", { name: "Billing Rules" }),
      page.getByText("Licenses", { exact: true }),
      page.getByText("Amount Paid", { exact: true }),
      page.getByText("Billing Cycle", { exact: true }),
      page.getByText("Paid Date", { exact: true }),
      page.getByText("Actions", { exact: true }),
    ]);
  });
});
