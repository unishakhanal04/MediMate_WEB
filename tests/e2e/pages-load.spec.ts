import { test, expect } from "@playwright/test";
import { registerAndLoginViaUI } from "./helpers/auth";

test.describe("Core pages load without errors", () => {
  test("Reminders page loads and renders its heading", async ({ page }) => {
    await registerAndLoginViaUI(page, "reminders-load");
    await page.goto("/user/reminders");
    await expect(page.getByText("Health Reminders")).toBeVisible({ timeout: 10000 });
  });

  test("Prescriptions page loads and shows the empty state for a new user", async ({ page }) => {
    await registerAndLoginViaUI(page, "prescriptions-load");
    await page.goto("/user/prescriptions");
    await expect(page.getByText("No prescriptions yet")).toBeVisible({ timeout: 10000 });
  });
});
