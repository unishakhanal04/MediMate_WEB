import { test, expect } from "@playwright/test";
import { registerAndLoginViaUI } from "./helpers/auth";

const addMedicine = async (page: import("@playwright/test").Page, name: string, dosage: string) => {
  await page.getByRole("button", { name: "+ Add Medicine" }).click();
  await page.locator(".form-group", { hasText: "Medicine Name" }).locator("input").fill(name);
  await page.locator(".form-group", { hasText: "Dosage" }).locator("input").fill(dosage);
  await page.getByRole("button", { name: "Add Medicine", exact: true }).click();
};

test.describe("Medicines", () => {
  test("adding a medicine makes it appear in the list", async ({ page }) => {
    await registerAndLoginViaUI(page, "med-add");
    await page.goto("/user/medicines");

    await addMedicine(page, "Metformin", "500mg");

    await expect(page.getByText("Medicine added successfully.")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("heading", { name: "Metformin" })).toBeVisible();
  });

  test("marking today's dose as taken updates its status", async ({ page }) => {
    await registerAndLoginViaUI(page, "med-take");
    await page.goto("/user/medicines");

    await addMedicine(page, "Ibuprofen", "200mg");
    await expect(page.getByText("Medicine added successfully.")).toBeVisible({ timeout: 10000 });

    // Only one medicine exists in this test, so the button/status are unambiguous
    // without needing to scope to a specific row.
    await page.getByRole("button", { name: "Mark as Taken" }).click();

    await expect(page.getByText("Medicine marked as taken.")).toBeVisible({ timeout: 10000 });
    // The badge's text content is "✔️Taken" (icon glued to the label, no space).
    // Matching that combined string avoids collisions with "Medicines Taken" (the
    // stat tile label) and the "Medicine marked as taken." toast.
    await expect(page.getByText("✔️Taken")).toBeVisible();
  });

  test("editing a medicine updates its dosage", async ({ page }) => {
    await registerAndLoginViaUI(page, "med-edit");
    await page.goto("/user/medicines");

    await addMedicine(page, "Losartan", "25mg");
    await expect(page.getByText("Medicine added successfully.")).toBeVisible({ timeout: 10000 });

    const card = page.locator("div.divide-y", { hasText: "Losartan" });
    await card.getByRole("button", { name: "Edit" }).click();
    const dosageInput = page.locator(".form-group", { hasText: "Dosage" }).locator("input");
    await dosageInput.fill("50mg");
    await page.getByRole("button", { name: "Update Medicine" }).click();

    await expect(page.getByText("Medicine updated successfully.")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("50mg")).toBeVisible();
  });

  test("deleting a medicine removes it from the list", async ({ page }) => {
    await registerAndLoginViaUI(page, "med-delete");
    await page.goto("/user/medicines");

    await addMedicine(page, "Aspirin", "100mg");
    await expect(page.getByText("Medicine added successfully.")).toBeVisible({ timeout: 10000 });

    const card = page.locator("div.divide-y", { hasText: "Aspirin" });
    await card.getByRole("button", { name: "Delete" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Delete" }).click();

    await expect(page.getByText("Medicine deleted successfully.")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("heading", { name: "Aspirin" })).not.toBeVisible();
  });
});
