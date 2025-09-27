import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  use: {
    baseURL: process.env.APP_URL || "http://localhost:3000",
    storageState: "storageState.json"
  },
  globalSetup: "./tests/global-setup.ts"
});
