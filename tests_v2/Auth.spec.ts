import { chromium, test } from "@playwright/test";

test.describe("Attach files functions", () => {
  test("Auth", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(60000);
    await page.context().storageState({ path: ".auth/template.json" });
  });
});
