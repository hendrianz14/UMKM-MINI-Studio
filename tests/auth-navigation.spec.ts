import { test, expect } from "@playwright/test";

test.use({ storageState: undefined });

const loginUnavailable = process.env.PLAYWRIGHT_AUTH_AVAILABLE !== "true";
const signInPattern = /sign\s*in|masuk/i;
const signUpPattern = /sign\s*up|daftar/i;

test.describe("Public landing navigation", () => {
  test("landing sign in button opens /signin", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: signInPattern }).first().click();
    await expect(page).toHaveURL(/\/signin$/);
  });

  test("landing sign up button opens /signup", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: signUpPattern }).first().click();
    await expect(page).toHaveURL(/\/signup$/);
  });

  test("mobile navigation sheet exposes auth links", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const trigger = page.getByRole("button", { name: "Buka menu navigasi" });
    await trigger.click();

    const signInLink = page.getByRole("link", { name: signInPattern }).first();
    await expect(signInLink).toBeVisible();
    await signInLink.click();

    await expect(page).toHaveURL(/\/signin$/);
  });
});

test.describe("Authenticated navigation", () => {
  test.skip(loginUnavailable, "Login credentials not configured. Skipping authenticated navigation checks.");
  test.use({ storageState: "storageState.json" });

  test("dashboard stays accessible", async ({ page }) => {
    const response = await page.goto("/dashboard");
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
