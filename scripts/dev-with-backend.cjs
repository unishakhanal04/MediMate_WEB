/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require("child_process");
const http = require("http");
const path = require("path");

const webRoot = path.resolve(__dirname, "..");
const backendRoot = path.resolve(webRoot, "..", "medimatebackend");
const nextBin = path.join(webRoot, "node_modules", "next", "dist", "bin", "next");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const children = [];

const checkBackend = () =>
  new Promise((resolve) => {
    const request = http.get("http://localhost:5000/health", (response) => {
      response.resume();
      resolve(response.statusCode && response.statusCode < 500);
    });

    request.on("error", () => resolve(false));
    request.setTimeout(1000, () => {
      request.destroy();
      resolve(false);
    });
  });

const startProcess = (command, args, options) => {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: false,
    ...options,
  });

  children.push(child);
  return child;
};

const stopChildren = () => {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
};

process.on("SIGINT", () => {
  stopChildren();
  process.exit(0);
});

process.on("SIGTERM", () => {
  stopChildren();
  process.exit(0);
});

const main = async () => {
  const backendRunning = await checkBackend();

  if (backendRunning) {
    console.log("Backend already running on http://localhost:5000");
  } else {
    console.log("Starting backend on http://localhost:5000");
    startProcess(npmCommand, ["run", "dev"], { cwd: backendRoot });
  }

  const next = startProcess(process.execPath, [nextBin, "dev"], { cwd: webRoot });
  next.on("exit", (code) => {
    stopChildren();
    process.exit(code || 0);
  });
};

main().catch((error) => {
  console.error(error);
  stopChildren();
  process.exit(1);
});
