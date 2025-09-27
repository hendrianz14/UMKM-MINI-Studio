import { test, expect } from "@playwright/test";

const loginUnavailable = process.env.PLAYWRIGHT_AUTH_AVAILABLE !== "true";

test.describe("Authenticated dashboard", () => {
  test.skip(loginUnavailable, "Login credentials not configured. Skipping authenticated smoke test.");
  test.use({ storageState: "storageState.json" });

  test("dashboard loads (logged-in)", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText(/Credits/i)).toBeVisible();
  });
});
