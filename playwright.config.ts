import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 1,
  timeout: 30000,
  expect: {
    // Higher than the 5s default — this suite runs against a real dev server
    // and real MongoDB, not mocks, so assertions need room for actual network
    // round-trips instead of racing them.
    timeout: 10000,
  },
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // A production build, on its own port, dedicated to this suite — not the
    // dev server on :3000. Dev mode's React StrictMode double-invoked effects,
    // Fast Refresh reloading mid-request, and the Next.js dev-tools portal
    // intercepting clicks were all causing real (but non-bug) flakiness here.
    command: "npm run build && npm run start -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 180000,
  },
});
