import { test, expect } from "@playwright/test";
import { registerAndLoginViaUI } from "./helpers/auth";

const titleInput = (page: import("@playwright/test").Page) =>
  page.locator("label", { hasText: "Title" }).locator("input");

test.describe("Reminders", () => {
  test("creating a reminder adds it to the reminder list", async ({ page }) => {
    await registerAndLoginViaUI(page, "reminder-add");
    await page.goto("/user/reminders");

    await page.getByRole("button", { name: "+ Set New Reminder" }).click();
    await titleInput(page).fill("Take vitamins");
    await page.getByRole("button", { name: "Save Reminder" }).click();

    await expect(page.getByText("Reminder created successfully.")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("cell", { name: "Take vitamins" })).toBeVisible();
  });

  test("deleting a reminder removes it from the list", async ({ page }) => {
    await registerAndLoginViaUI(page, "reminder-delete");
    await page.goto("/user/reminders");

    await page.getByRole("button", { name: "+ Set New Reminder" }).click();
    await titleInput(page).fill("Check blood pressure");
    await page.getByRole("button", { name: "Save Reminder" }).click();
    await expect(page.getByText("Reminder created successfully.")).toBeVisible({ timeout: 10000 });

    const row = page.locator("tr", { hasText: "Check blood pressure" });
    await row.getByRole("button", { name: "Delete" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Delete" }).click();

    await expect(page.getByText("Reminder deleted successfully.")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("cell", { name: "Check blood pressure" })).not.toBeVisible();
  });
});
