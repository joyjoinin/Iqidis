import { test } from "@playwright/test";
import Pages from "../common/page";

test.describe("Workspace", () => {
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
  });

  test("Create new plan", async ({ page }) => {
    const Page = new Pages(page);
    const amount = getRandomNumberString();
    await page.getByRole("button", { name: "Plans" }).click();
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
});
