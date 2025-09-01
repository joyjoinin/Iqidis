import { test } from "@playwright/test";
import Pages from "../common/page";

test.describe("User manage", () => {
  const planName = "Test" + Date.now().toString();
  const description = "description" + Date.now().toString();

  const getRandomNumberString = (): string => {
    const digitCount = Math.floor(Math.random() * 3) + 1;

    let min = 1;
    let max = 9;
    if (digitCount === 2) {
      min = 10;
      max = 99;
    } else if (digitCount === 3) {
      min = 100;
      max = 999;
    }

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomNumber.toString();
  };

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator('span[data-sentry-element="Avatar"]').click();
    await page.getByRole("menuitem", { name: "Manage Users" }).click();
    await page.getByRole("button", { name: "Manage Org" }).click();
  });

  test("Create new plan", async ({ page }) => {
    const Page = new Pages(page);
    const amount = getRandomNumberString();
    await page.getByRole("menuitem", { name: "Plans" }).click();
    await page.getByRole("button", { name: "Create Plan" }).click();
    await page.locator("#name").fill(planName);
    await page.locator("#description").fill(description);
    await page.locator("#amount").fill(amount);
    await page.getByRole("button", { name: "Create Plan" }).click();
    await Page.assertElementsExist([
      page
        .locator("tr")
        .filter({ hasText: planName })
        .locator("td")
        .filter({ hasText: description }),
      page
        .locator("tr")
        .filter({ hasText: planName })
        .locator("td")
        .filter({ hasText: `$${amount}.00/month` }),
    ]);
  });

  test("Set minimum Seats", async ({ page }) => {
    const Page = new Pages(page);
    const seats = getRandomNumberString();
    await page.getByRole("menuitem", { name: "Organization" }).click();
    await page
      .getByRole("row", { name: "Automation" })
      .getByRole("img")
      .nth(2)
      .click();
    await page.getByRole("spinbutton").fill(seats);
    await page.keyboard.press("Enter");
    await Page.assertElementExist(
      page
        .getByRole("row", { name: "Automation" })
        .locator("td:nth-child(5)")
        .filter({ hasText: seats })
    );
  });

  test("Check different status", async ({ page }) => {
    const Page = new Pages(page);
    await page.getByRole("menuitem", { name: "Organization" }).click();
    await Page.assertElementsExist([
      // page.getByText("CANCELED AT PERIOD END").first(),
      page.getByText("CANCELED", { exact: true }).first(),
      page.getByText("ACTIVE", { exact: true }).first(),
      page.getByText("NO SUBSCRIPTION", { exact: true }).first(),
    ]);
  });

  test("Price settings", async ({ page }) => {
    // Add tier
    const Page = new Pages(page);
    await page.getByRole("menuitem", { name: "Organization" }).click();
    await page
      .getByRole("row", { name: "Joy test" })
      .getByRole("button")
      .last()
      .click();
    await page.getByRole("button", { name: "Add Tier" }).click();
    await page.getByPlaceholder("Enter minimum seats").nth(1).fill("10");
    await page.getByRole("combobox").nth(1).click();
    await page.getByLabel("Joy Test 002 ($199.00/seat/").click();
    await page.getByRole("button", { name: "Save" }).click();

    // Delete tier
    await page
      .getByRole("row", { name: "Joy test	" })
      .getByRole("button")
      .last()
      .click();
    await page.getByRole("button").filter({ hasText: /^$/ }).click();
    await page.getByRole("button", { name: "Save" }).click();
    await Page.assertElementExist(page.getByText("Pricing settings saved"));
  });

  test("Search organization", async ({ page }) => {
    // Search not exist one
    const Page = new Pages(page);
    await page.getByRole("menuitem", { name: "Organization" }).click();

    await page
      .getByPlaceholder("Search organizations by name")
      .fill("Not exist one");
    await Page.assertElementExist(
      page.getByRole("cell", { name: "No organizations found" })
    );

    // Search exist one
    await page.getByPlaceholder("Search organizations by name").fill("China");
    await Page.assertElementsExist(
      await page.getByRole("cell", { name: "China" }).all()
    );
  });
});
