import { defineConfig } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "127.0.0.1";
const baseURL = process.env.APP_URL || `http://${HOST}:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  timeout: 30_000,
  use: {
    baseURL,
    storageState: "storageState.json"
  },
  globalSetup: "./tests/global-setup.ts",
  webServer: {
    command: "pnpm build && pnpm start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000
  }
});
