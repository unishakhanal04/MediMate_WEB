import { test, expect } from "@playwright/test";
import { makeUser, registerViaUI, loginViaUI } from "./helpers/auth";
import { promoteToAdmin } from "./helpers/db";

test.describe("Admin user management", () => {
  test("admin can search for a member and deactivate their account", async ({ page }) => {
    const member = makeUser("users-target");
    await registerViaUI(page, member);
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    const admin = makeUser("users-admin");
    await registerViaUI(page, admin);
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    await promoteToAdmin(admin.email);
    await loginViaUI(page, admin, "admin");
    await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });

    await page.goto("/admin/users");
    await page.getByPlaceholder("Search by name or email").fill(member.email);
    await expect(page.getByText(member.username, { exact: true })).toBeVisible({ timeout: 10000 });

    const row = page.locator("tr", { hasText: member.username });
    await row.getByRole("button", { name: "Deactivate" }).click();

    await expect(page.getByText("User deactivated.")).toBeVisible({ timeout: 10000 });
  });
});
