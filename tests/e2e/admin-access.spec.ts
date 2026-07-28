import { test, expect } from "@playwright/test";
import { makeUser, registerViaUI, loginViaUI, registerAndLoginViaUI } from "./helpers/auth";
import { promoteToAdmin } from "./helpers/db";

test.describe("Admin access control", () => {
  test("a regular user visiting /admin is redirected back to /user", async ({ page }) => {
    await registerAndLoginViaUI(page, "admin-blocked");
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/user$/, { timeout: 10000 });
  });

  test("a promoted admin logging in via the Admin portal lands on the admin dashboard", async ({ page }) => {
    const user = makeUser("admin-flow");
    await registerViaUI(page, user);
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    await promoteToAdmin(user.email);

    await loginViaUI(page, user, "admin");
    await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });
    // Dashboard fetches summary + notifications after the layout's own admin-access
    // check resolves, so a cold admin session needs more room than a typical assertion.
    await expect(page.getByText("System Overview")).toBeVisible({ timeout: 20000 });
  });
});
