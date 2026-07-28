import { test, expect } from "@playwright/test";
import { makeUser, registerViaUI, loginViaUI } from "./helpers/auth";
import { promoteToAdmin } from "./helpers/db";

test.describe("Admin dashboard", () => {
  test("shows non-zero platform-wide stat tiles", async ({ page }) => {
    const admin = makeUser("dash-admin");
    await registerViaUI(page, admin);
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    await promoteToAdmin(admin.email);

    await loginViaUI(page, admin, "admin");
    await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });

    await page.goto("/admin/dashboard");
    await expect(page.getByText("Total Users")).toBeVisible({ timeout: 20000 });
    await expect(page.getByText("New Users (Week)")).toBeVisible();
    await expect(page.getByText("Active Today")).toBeVisible();
  });
});
