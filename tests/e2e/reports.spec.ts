import { test, expect } from "@playwright/test";
import { registerAndLoginViaUI } from "./helpers/auth";

test.describe("Reports", () => {
  test("shows adherence stats and active medicine count after adding a medicine", async ({ page }) => {
    await registerAndLoginViaUI(page, "reports");
    await page.goto("/user/medicines");

    await page.getByRole("button", { name: "+ Add Medicine" }).click();
    await page.locator(".form-group", { hasText: "Medicine Name" }).locator("input").fill("Losartan");
    await page.locator(".form-group", { hasText: "Dosage" }).locator("input").fill("50mg");
    await page.getByRole("button", { name: "Add Medicine", exact: true }).click();
    await expect(page.getByText("Medicine added successfully.")).toBeVisible({ timeout: 10000 });

    await page.goto("/user/reports");
    await expect(page.getByRole("heading", { name: "Reports & Insights" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Active Medicines")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Weekly Adherence")).toBeVisible();
  });
});
