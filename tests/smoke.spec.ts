import { test, expect } from "@playwright/test";

test("dashboard loads (logged-in)", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByText(/Credits/i)).toBeVisible();
});
