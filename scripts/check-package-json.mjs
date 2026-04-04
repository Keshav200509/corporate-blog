import { readFileSync } from "node:fs";

try {
  const content = readFileSync(new URL("../package.json", import.meta.url), "utf8");
  JSON.parse(content);
  console.log("package.json is valid JSON");
} catch (error) {
  console.error("Invalid package.json JSON:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
