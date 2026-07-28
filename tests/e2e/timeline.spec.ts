import { test, expect } from "@playwright/test";
import { registerAndLoginViaUI } from "./helpers/auth";

test.describe("Timeline", () => {
  test("adding a medicine creates a timeline event", async ({ page }) => {
    await registerAndLoginViaUI(page, "timeline-add");
    await page.goto("/user/medicines");

    await page.getByRole("button", { name: "+ Add Medicine" }).click();
    await page.locator(".form-group", { hasText: "Medicine Name" }).locator("input").fill("Simvastatin");
    await page.locator(".form-group", { hasText: "Dosage" }).locator("input").fill("20mg");
    await page.getByRole("button", { name: "Add Medicine", exact: true }).click();
    await expect(page.getByText("Medicine added successfully.")).toBeVisible({ timeout: 10000 });

    await page.goto("/user/timeline");
    await expect(page.getByRole("heading", { name: "Health Timeline" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Medicine added: Simvastatin")).toBeVisible({ timeout: 10000 });
  });

  test("filtering by Medications category hides appointment events", async ({ page }) => {
    await registerAndLoginViaUI(page, "timeline-filter");

    await page.goto("/user/medicines");
    await page.getByRole("button", { name: "+ Add Medicine" }).click();
    await page.locator(".form-group", { hasText: "Medicine Name" }).locator("input").fill("Atorvastatin");
    await page.locator(".form-group", { hasText: "Dosage" }).locator("input").fill("10mg");
    await page.getByRole("button", { name: "Add Medicine", exact: true }).click();
    await expect(page.getByText("Medicine added successfully.")).toBeVisible({ timeout: 10000 });

    await page.goto("/user/appointments");
    await page.getByRole("button", { name: "+ Schedule New Appointment" }).click();
    const fieldInput = (labelText: string) =>
      page.getByText(labelText, { exact: true }).locator("xpath=following-sibling::input[1]");
    await fieldInput("Purpose *").fill("Dermatology Visit");
    await fieldInput("Doctor Name *").fill("Dr. Timeline");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await fieldInput("Date *").fill(tomorrow.toISOString().split("T")[0]);
    await fieldInput("Time *").fill("10:00");
    await page.getByRole("button", { name: "Schedule Appointment" }).click();
    await expect(page.getByText("Appointment scheduled successfully.")).toBeVisible({ timeout: 10000 });

    await page.goto("/user/timeline");
    await expect(page.getByText("Dr. Timeline")).toBeVisible({ timeout: 10000 });

    await page.getByRole("tab", { name: "Medications" }).click();
    await expect(page.getByText("Medicine added: Atorvastatin")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Dr. Timeline")).not.toBeVisible();
  });
});
