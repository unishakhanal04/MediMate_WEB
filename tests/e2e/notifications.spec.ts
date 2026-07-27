import { test, expect } from "@playwright/test";
import { registerAndLoginViaUI } from "./helpers/auth";

test.describe("Notifications", () => {
  test("marking all as read hides the button once nothing is unread", async ({ page }) => {
    await registerAndLoginViaUI(page, "notif-read");

    // A low-stock medicine guarantees at least one unread notification exists.
    await page.goto("/user/medicines");
    await page.getByRole("button", { name: "+ Add Medicine" }).click();
    await page.locator(".form-group", { hasText: "Medicine Name" }).locator("input").fill("Insulin");
    await page.locator(".form-group", { hasText: "Dosage" }).locator("input").fill("10 units");
    await page.locator(".form-group", { hasText: "Quantity Remaining" }).locator("input").fill("2");
    await page.getByRole("button", { name: "Add Medicine", exact: true }).click();
    await expect(page.getByText("Medicine added successfully.")).toBeVisible({ timeout: 10000 });

    await page.goto("/user/notifications");
    const markAllButton = page.getByRole("button", { name: "Mark all as read" });
    await expect(markAllButton).toBeVisible({ timeout: 10000 });

    await markAllButton.click();
    await expect(page.getByText("All notifications marked as read.")).toBeVisible({ timeout: 10000 });
    await expect(markAllButton).not.toBeVisible();
  });
});
