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

  test("Organization homepage", async ({ page }) => {
    const Page = new Pages(page);
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
});
