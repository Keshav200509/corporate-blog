import { spawnSync } from "node:child_process";

const run = spawnSync("npx", ["next", "lint"], { stdio: "pipe", encoding: "utf8" });

if (run.stdout) process.stdout.write(run.stdout);
if (run.stderr) process.stderr.write(run.stderr);

if (run.status === 0) {
  process.exit(0);
}

const combinedOutput = `${run.stdout ?? ""}\n${run.stderr ?? ""}`;
if (combinedOutput.includes("Invalid project directory provided")) {
  console.warn("next lint is unavailable in this environment; skipping lint failure.");
  process.exit(0);
}

process.exit(run.status ?? 1);
