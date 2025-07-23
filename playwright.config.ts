import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from "dotenv";
// import path from "path";
// dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  outputDir: "test-results",

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["json", { outputFile: "test-results.json" }],
    ["html", { outputFolder: "playwright-report" }],
  ] /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */,
  timeout: 3 * 60 * 60 * 1000,

  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL:
      process.env.baseURL ||
      "https://iqidisai-git-feat-multi-tenancy-iqidis.vercel.app",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
    video: { mode: "retain-on-failure", size: { width: 1720, height: 1080 } },
    // video: { mode: "retain-on-failure" },
    screenshot: "on",
    actionTimeout: 20 * 1000,
    navigationTimeout: 60 * 1000,
    permissions: ["camera", "microphone"],
  },

  /* Configure projects for major browsers */
  projects: [
    {
      use: {
        ...devices["Desktop Chrome"],
        // channel: "chrome",
        viewport: { width: 1720, height: 1080 },
        storageState: ".auth/template.json",
        headless: true,
        // headless: false,
        launchOptions: {
          args: [
            // "--disable-web-security",
            // "--use-fake-ui-for-media-stream",
            // "--use-fake-device-for-media-stream",
            // "--no-sandbox",
            "--start-maximized",
          ],
        },
      },
    },
  ],
});
