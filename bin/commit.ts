import { execSync } from "child_process";

const input = process.argv.slice(2);

if (input.length < 1) {
  console.error("[❌] You need to provide at least one file to stage.");
  process.exit(1);
}

const filesToStage = input;

if (filesToStage.length === 0) {
  console.error("[❌] You must specify at least one file to stage.");
  process.exit(1);
}

try {
  console.log(`📥 Staging files: ${filesToStage.join(" ")}`);
  execSync(`git add ${filesToStage.join(" ")}`, { stdio: "inherit" });
  console.log("📦 Committing staged files...");
  execSync(`git commit`, { stdio: "inherit" });
} catch (error) {
  console.error("[❌] during commit:", error.message);
  process.exit(1);
}
