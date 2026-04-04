import { readFileSync, existsSync } from "node:fs";

const packageJsonPath = new URL("../package.json", import.meta.url);
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

const nextVersion = packageJson.dependencies?.next;
const eslintConfigNextVersion = packageJson.devDependencies?.["eslint-config-next"];

if (!nextVersion || !eslintConfigNextVersion) {
  console.error("Missing next or eslint-config-next in package.json");
  process.exit(1);
}

if (nextVersion !== eslintConfigNextVersion) {
  console.error(`Version mismatch: next=${nextVersion} eslint-config-next=${eslintConfigNextVersion}`);
  process.exit(1);
}

const lockfilePath = new URL("../package-lock.json", import.meta.url);
if (!existsSync(lockfilePath)) {
  console.warn("package-lock.json not found; skipping lockfile version verification.");
  process.exit(0);
}

const lockfile = JSON.parse(readFileSync(lockfilePath, "utf8"));
const lockNextVersion =
  lockfile?.packages?.["node_modules/next"]?.version ??
  lockfile?.dependencies?.next?.version;

if (!lockNextVersion) {
  console.error("Could not find next version in package-lock.json");
  process.exit(1);
}

const normalizedPackageNext = nextVersion.replace(/^[~^]/, "");
if (lockNextVersion !== normalizedPackageNext) {
  console.error(`next version mismatch between package.json (${nextVersion}) and lockfile (${lockNextVersion})`);
  process.exit(1);
}

console.log("Dependency versions are aligned.");
