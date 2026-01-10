import chalk from "chalk";
import { BANNER } from "./constants";
import { gatherConfig, closeReadline } from "./prompts";
import { applyTemplates } from "./templates";
import { transformProject } from "./transform";
import { runInstall } from "./utils";
import type { ProjectConfig } from "./types";

function printBanner(): void {
  console.log();
  console.log(BANNER);
}

function printSuccess(config: ProjectConfig): void {
  console.log();
  console.log(chalk.green.bold(`✓ Project initialized as "${config.name}"`));
  console.log(chalk.yellow.bold("🚀 Thunder App template initialized!"));
  console.log();
  console.log(
    chalk.cyan.bold("📍 Project location:"),
    chalk.gray(config.targetDir),
  );
  console.log();
  console.log(chalk.cyan.bold("Next steps:"));
  console.log(chalk.white(`  1. cd ${config.name}`));
  console.log(
    chalk.white(
      "  2. bun install    # installs all workspaces (frontend, lib, backend)",
    ),
  );
  console.log(chalk.white("  3. bun run build:lib"));
  console.log(chalk.white("  4. bun run dev"));
  console.log();
}

export async function main(): Promise<void> {
  const argName = (Bun.argv[2] || "").trim();

  try {
    printBanner();

    // Gather configuration from user
    const config = await gatherConfig(argName);

    // Copy template files
    await applyTemplates(config);

    // Transform package.json and source files
    await transformProject(config);

    // Optionally run install
    await runInstall(config);

    // Print success message
    printSuccess(config);
  } finally {
    closeReadline();
  }
}
