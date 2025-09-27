import { test, expect } from "@playwright/test";

test.use({ storageState: undefined });

test("landing sign in button opens /signin", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/signin$/);
});

test("landing sign up button opens /signup", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /sign up/i }).click();
  await expect(page).toHaveURL(/\/signup$/);
});

test("mobile navigation sheet exposes auth links", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Buka menu navigasi" });
  await trigger.click();

  const signInLink = page.getByRole("link", { name: /sign in/i });
  await expect(signInLink).toBeVisible();
  await signInLink.click();

  await expect(page).toHaveURL(/\/signin$/);
});

