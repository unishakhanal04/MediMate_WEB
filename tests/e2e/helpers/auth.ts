import { Page, expect } from "@playwright/test";

let counter = 0;

export interface E2EUser {
  username: string;
  email: string;
  password: string;
}

export const makeUser = (label: string): E2EUser => {
  counter += 1;
  return {
    username: `E2E ${label} ${counter}`,
    email: `e2e-${label}-${counter}-${Date.now()}@example.com`,
    password: "Password123",
  };
};

export const registerViaUI = async (page: Page, user: E2EUser) => {
  await page.goto("/register");
  await page.getByLabel("Username").fill(user.username);
  await page.getByLabel("Email Address").fill(user.email);
  await page.getByLabel("Gender").selectOption("other");
  await page.getByLabel("Password", { exact: true }).fill(user.password);
  await page.getByLabel("Confirm Password", { exact: true }).fill(user.password);
  await page.getByRole("checkbox").click();
  await page.getByRole("button", { name: "Create Account" }).click();
};

export const loginViaUI = async (page: Page, user: E2EUser, portal: "user" | "admin" = "user") => {
  await page.goto("/login");
  if (portal === "admin") {
    await page.getByRole("radio", { name: "Admin" }).check();
  }
  await page.getByLabel("Email Address").fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill(user.password);
  await page.getByRole("button", { name: "Sign In" }).click();
};

export const registerAndLoginViaUI = async (page: Page, label: string): Promise<E2EUser> => {
  const user = makeUser(label);
  await registerViaUI(page, user);
  await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  await loginViaUI(page, user);
  await expect(page).toHaveURL(/\/user$/, { timeout: 10000 });
  return user;
};
