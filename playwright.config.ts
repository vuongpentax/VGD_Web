import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT ?? 3100);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Smoke tests run against a production build, like the deployed site.
    command: `npm run build && npm run start -- -p ${port}`,
    url: `${baseURL}/vi`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
