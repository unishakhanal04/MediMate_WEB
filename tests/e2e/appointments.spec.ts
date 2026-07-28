import { test, expect } from "@playwright/test";
import { registerAndLoginViaUI } from "./helpers/auth";

const dateInDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const fieldInput = (page: import("@playwright/test").Page, labelText: string) =>
  page.getByText(labelText, { exact: true }).locator("xpath=following-sibling::input[1]");

const scheduleAppointment = async (
  page: import("@playwright/test").Page,
  purpose: string,
  doctorName: string,
  daysFromNow: number
) => {
  await page.getByRole("button", { name: "+ Schedule New Appointment" }).click();
  await fieldInput(page, "Purpose *").fill(purpose);
  await fieldInput(page, "Doctor Name *").fill(doctorName);
  await fieldInput(page, "Date *").fill(dateInDays(daysFromNow));
  await fieldInput(page, "Time *").fill("10:00");
  await page.getByRole("button", { name: "Schedule Appointment" }).click();
};

test.describe("Appointments", () => {
  test("scheduling an appointment adds it to the upcoming list", async ({ page }) => {
    await registerAndLoginViaUI(page, "appt-add");
    await page.goto("/user/appointments");

    await scheduleAppointment(page, "Annual Checkup", "Dr. Sharma", 1);

    await expect(page.getByText("Appointment scheduled successfully.")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Dr. Sharma")).toBeVisible();
  });

  test("editing an appointment updates its doctor name", async ({ page }) => {
    await registerAndLoginViaUI(page, "appt-edit");
    await page.goto("/user/appointments");

    await scheduleAppointment(page, "Cardiology Review", "Dr. Original", 2);
    await expect(page.getByText("Appointment scheduled successfully.")).toBeVisible({ timeout: 10000 });

    // With only one appointment scheduled it renders as the hero card, whose edit
    // control is labeled "Reschedule" rather than the list row's "Edit appointment".
    await page.getByRole("button", { name: "Reschedule" }).click();
    await fieldInput(page, "Doctor Name *").fill("Dr. Updated");
    await page.getByRole("button", { name: "Update Appointment" }).click();

    await expect(page.getByText("Appointment updated successfully.")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Dr. Updated")).toBeVisible();
    await expect(page.getByText("Dr. Original")).not.toBeVisible();
  });

  test("deleting an appointment removes it from the list", async ({ page }) => {
    await registerAndLoginViaUI(page, "appt-delete");
    await page.goto("/user/appointments");

    // Two appointments so the first becomes the hero card and the second stays
    // in the regular deletable list row.
    await scheduleAppointment(page, "First Visit", "Dr. Alpha", 1);
    await expect(page.getByText("Appointment scheduled successfully.")).toBeVisible({ timeout: 10000 });
    await scheduleAppointment(page, "Second Visit", "Dr. Beta", 3);
    await expect(page.getByText("Appointment scheduled successfully.").last()).toBeVisible({ timeout: 10000 });

    const row = page.locator("div", { hasText: "Dr. Beta" }).filter({
      has: page.getByRole("button", { name: "Appointment actions" }),
    }).last();
    await row.getByRole("button", { name: "Appointment actions" }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Delete" }).click();

    await expect(page.getByText("Appointment deleted successfully.")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Dr. Beta")).not.toBeVisible();
  });
});
