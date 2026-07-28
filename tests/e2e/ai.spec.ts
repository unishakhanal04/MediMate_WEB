import { test, expect } from "@playwright/test";
import { registerAndLoginViaUI } from "./helpers/auth";

test.describe("AI Assistant", () => {
  test("page loads with a greeting, without sending a real message", async ({ page }) => {
    await registerAndLoginViaUI(page, "ai-load");
    await page.goto("/user/ai");

    await expect(page.getByRole("heading", { name: "AI Health Assistant" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Hello! I'm your AI health assistant. How can I help you today?")).toBeVisible();
  });
});
