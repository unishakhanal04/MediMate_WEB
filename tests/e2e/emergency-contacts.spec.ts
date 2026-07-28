import { test, expect } from "@playwright/test";
import { registerAndLoginViaUI } from "./helpers/auth";

// Scoped to the modal dialog — the page behind it also has a "Full Name *" field
// (the profile form), so an unscoped locator would match both.
const fieldInput = (page: import("@playwright/test").Page, labelText: string) =>
  page.getByRole("dialog").getByText(labelText, { exact: true }).locator("xpath=following-sibling::input[1]");

test.describe("Emergency contacts", () => {
  test("adding an emergency contact appears in the list", async ({ page }) => {
    await registerAndLoginViaUI(page, "contact-add");
    await page.goto("/user/profile");

    await page.getByRole("button", { name: "+ Add Contact" }).click();
    await fieldInput(page, "Full Name *").fill("Sita Rai");
    await fieldInput(page, "Relationship *").fill("Sister");
    await fieldInput(page, "Phone Number *").fill("9800000000");
    await page.getByRole("button", { name: "Add Contact", exact: true }).click();

    await expect(page.getByText("Emergency contact added.")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Sita Rai")).toBeVisible();
  });

  test("editing an emergency contact updates its details", async ({ page }) => {
    await registerAndLoginViaUI(page, "contact-edit");
    await page.goto("/user/profile");

    await page.getByRole("button", { name: "+ Add Contact" }).click();
    await fieldInput(page, "Full Name *").fill("Ram Bahadur");
    await fieldInput(page, "Relationship *").fill("Father");
    await fieldInput(page, "Phone Number *").fill("9811111111");
    await page.getByRole("button", { name: "Add Contact", exact: true }).click();
    await expect(page.getByText("Emergency contact added.")).toBeVisible({ timeout: 10000 });

    const row = page.locator("div", { hasText: "Ram Bahadur" }).filter({ has: page.getByRole("button", { name: "Edit" }) });
    await row.getByRole("button", { name: "Edit" }).click();
    await fieldInput(page, "Relationship *").fill("Guardian");
    await page.getByRole("button", { name: "Update Contact" }).click();

    await expect(page.getByText("Emergency contact updated.")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Guardian ·")).toBeVisible();
  });

  test("deleting an emergency contact removes it from the list", async ({ page }) => {
    await registerAndLoginViaUI(page, "contact-delete");
    await page.goto("/user/profile");

    await page.getByRole("button", { name: "+ Add Contact" }).click();
    await fieldInput(page, "Full Name *").fill("Backup Contact");
    await fieldInput(page, "Relationship *").fill("Friend");
    await fieldInput(page, "Phone Number *").fill("9822222222");
    await page.getByRole("button", { name: "Add Contact", exact: true }).click();
    await expect(page.getByText("Emergency contact added.")).toBeVisible({ timeout: 10000 });

    const row = page.locator("div", { hasText: "Backup Contact" }).filter({ has: page.getByRole("button", { name: "Delete" }) });
    await row.getByRole("button", { name: "Delete" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Delete" }).click();

    await expect(page.getByText("Emergency contact deleted.")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Backup Contact")).not.toBeVisible();
  });
});
