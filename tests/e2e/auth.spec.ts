import { test, expect } from "@playwright/test";
import { makeUser, registerViaUI, loginViaUI, registerAndLoginViaUI } from "./helpers/auth";

test.describe("Auth flows", () => {
  test("registering a new account redirects to login, then login lands on the dashboard", async ({ page }) => {
    const user = makeUser("register-ok");
    await registerViaUI(page, user);
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    await loginViaUI(page, user);
    await expect(page).toHaveURL(/\/user$/, { timeout: 10000 });
    await expect(page.getByText(user.username, { exact: true })).toBeVisible();
  });

  test("registering with an already-used email shows an error", async ({ page }) => {
    const user = makeUser("dup-email");
    await registerViaUI(page, user);
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    await registerViaUI(page, user);
    await expect(page.getByText(/already registered/i)).toBeVisible({ timeout: 10000 });
  });

  test("mismatched confirm password blocks submission with a validation error", async ({ page }) => {
    const user = makeUser("mismatch");
    await page.goto("/register");
    await page.getByLabel("Username").fill(user.username);
    await page.getByLabel("Email Address").fill(user.email);
    await page.getByLabel("Gender").selectOption("other");
    await page.getByLabel("Password", { exact: true }).fill(user.password);
    await page.getByLabel("Confirm Password", { exact: true }).fill("SomethingElse1");
    await page.getByRole("checkbox").click();
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page.getByText(/match/i)).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });

  test("logging in with the wrong password shows an error and stays on the login page", async ({ page }) => {
    const user = await registerAndLoginViaUI(page, "wrong-pass-setup");
    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    await loginViaUI(page, { ...user, password: "WrongPassword1" });
    await expect(page.getByText(/invalid credentials/i)).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("logging out returns to the login page and blocks re-entry to the dashboard", async ({ page }) => {
    await registerAndLoginViaUI(page, "logout");
    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    await page.goto("/user");
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test("forgot-password flow advances to the OTP entry step", async ({ page }) => {
    const user = makeUser("forgot-pass");
    await registerViaUI(page, user);
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    await page.goto("/forgot-password");
    await page.getByLabel("Email Address").fill(user.email);
    await page.getByRole("button", { name: "Send Verification Code" }).click();

    await expect(page.getByRole("heading", { name: "Enter verification code" })).toBeVisible({ timeout: 15000 });
    await expect(page.getByLabel("Verification Code")).toBeVisible();
  });
});
