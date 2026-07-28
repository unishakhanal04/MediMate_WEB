import { test, expect } from "@playwright/test";
import { makeUser, registerViaUI, loginViaUI } from "./helpers/auth";
import { promoteToAdmin, setMaintenanceMode } from "./helpers/db";

test.describe("Admin settings", () => {
  // Regardless of pass/fail, force maintenance mode back off so a failed assertion
  // here can't leave every later test in this single-worker suite unable to log in.
  test.afterEach(async () => {
    await setMaintenanceMode(false);
  });

  test("toggling maintenance mode updates the banner and is reflected by the public status API", async ({
    page,
    request,
  }) => {
    const admin = makeUser("settings-admin");
    await registerViaUI(page, admin);
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    await promoteToAdmin(admin.email);
    await loginViaUI(page, admin, "admin");
    await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });

    await page.goto("/admin/settings");
    const toggle = page.getByRole("switch", { name: "Toggle maintenance mode" });
    await expect(toggle).toBeVisible({ timeout: 10000 });

    await toggle.click();
    await page.getByRole("button", { name: "Enable" }).click();
    await expect(page.getByText("Maintenance mode enabled.")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Maintenance mode is currently ON/)).toBeVisible();

    const enabledStatus = await request.get("http://localhost:5000/api/v1/system/maintenance-status");
    expect((await enabledStatus.json()).data.maintenanceMode).toBe(true);

    await toggle.click();
    await page.getByRole("button", { name: "Disable" }).click();
    await expect(page.getByText("Maintenance mode disabled.")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Maintenance mode is currently ON/)).not.toBeVisible();

    const disabledStatus = await request.get("http://localhost:5000/api/v1/system/maintenance-status");
    expect((await disabledStatus.json()).data.maintenanceMode).toBe(false);
  });
});
