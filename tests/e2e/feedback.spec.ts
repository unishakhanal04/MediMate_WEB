import { test, expect } from "@playwright/test";
import { registerAndLoginViaUI } from "./helpers/auth";

test.describe("Feedback", () => {
  test("submitting feedback shows a success message and appears in history", async ({ page }) => {
    await registerAndLoginViaUI(page, "feedback");
    await page.goto("/user/feedback");

    await page.getByPlaceholder("e.g., Reminder time picker doesn't save").fill("E2E test subject");
    await page
      .getByPlaceholder("Describe what happened, or what you'd like to see.")
      .fill("This feedback was submitted by an automated Playwright test.");
    await page.getByRole("button", { name: "Submit Feedback" }).click();

    await expect(page.getByText("Feedback submitted. Thank you!")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("E2E test subject")).toBeVisible();
  });
});
