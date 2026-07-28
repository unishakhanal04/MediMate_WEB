import { test, expect } from "@playwright/test";
import { makeUser, registerViaUI, loginViaUI, registerAndLoginViaUI } from "./helpers/auth";
import { promoteToAdmin } from "./helpers/db";

test.describe("Admin feedback management", () => {
  test("admin can mark a member's submitted feedback as reviewed", async ({ page }) => {
    await registerAndLoginViaUI(page, "feedback-source");
    await page.goto("/user/feedback");
    const subject = `Playwright admin-feedback subject ${Date.now()}`;
    await page.getByPlaceholder("e.g., Reminder time picker doesn't save").fill(subject);
    await page
      .getByPlaceholder("Describe what happened, or what you'd like to see.")
      .fill("Submitted for the admin feedback e2e test.");
    await page.getByRole("button", { name: "Submit Feedback" }).click();
    await expect(page.getByText("Feedback submitted. Thank you!")).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    const admin = makeUser("feedback-admin");
    await registerViaUI(page, admin);
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    await promoteToAdmin(admin.email);
    await loginViaUI(page, admin, "admin");
    await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });

    await page.goto("/admin/feedback");
    await expect(page.getByText(subject)).toBeVisible({ timeout: 15000 });

    // Multiple ancestor <div>s contain both the subject text and *a* "Mark
    // Reviewed" button (the whole feedback list wrapper included) — .last()
    // resolves to the innermost one: this item's own Card.
    const card = page
      .locator("div")
      .filter({ hasText: subject })
      .filter({ has: page.getByRole("button", { name: "Mark Reviewed" }) })
      .last();
    await card.getByRole("button", { name: "Mark Reviewed" }).click();
    await expect(page.getByText("Marked as reviewed.")).toBeVisible({ timeout: 10000 });
  });
});
