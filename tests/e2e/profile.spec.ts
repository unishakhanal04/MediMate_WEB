import { test, expect } from "@playwright/test";
import { registerAndLoginViaUI, loginViaUI } from "./helpers/auth";

const fieldInput = (page: import("@playwright/test").Page, labelText: string) =>
  page.getByText(labelText, { exact: true }).locator("xpath=following-sibling::input[1]");

test.describe("Profile", () => {
  test("updating personal information saves and reflects the new name", async ({ page }) => {
    await registerAndLoginViaUI(page, "profile-update");
    await page.goto("/user/profile");

    await expect(page.getByRole("heading", { name: "Personal Information" })).toBeVisible({ timeout: 10000 });
    const nameInput = fieldInput(page, "Full Name *");
    await nameInput.fill("Updated E2E Name");
    await page.getByRole("button", { name: "Save Personal Information" }).click();

    await expect(page.getByText("Personal information updated successfully.")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Updated E2E Name").first()).toBeVisible();
  });

  test("changing password allows logging in with the new password", async ({ page }) => {
    const user = await registerAndLoginViaUI(page, "profile-password");
    await page.goto("/user/password");

    await fieldInput(page, "Current Password *").fill(user.password);
    await fieldInput(page, "New Password *").fill("NewPassword456");
    await fieldInput(page, "Confirm New Password *").fill("NewPassword456");
    await page.getByRole("button", { name: "Update Password" }).click();

    await expect(page.getByText("Password updated successfully.")).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    await loginViaUI(page, { ...user, password: "NewPassword456" });
    await expect(page).toHaveURL(/\/user$/, { timeout: 10000 });
  });
});
