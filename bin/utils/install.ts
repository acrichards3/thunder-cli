import chalk from "chalk";
import type { ProjectConfig } from "../types";
import { askYesNo } from "../prompts";

export const runInstall = async (config: ProjectConfig): Promise<void> => {
  const doInstall = await askYesNo(
    "Run bun install for all workspaces now?",
    true,
  );

  if (!doInstall) return;

  console.log(
    chalk.blue.bold("\n› Installing dependencies (root workspace)...\n"),
  );

  const installResult = Bun.spawnSync(["bun", "install"], {
    cwd: config.targetDir,
    stdio: ["inherit", "inherit", "inherit"],
  });

  if (installResult.exitCode !== 0) {
    console.error(
      chalk.red("bun install failed. You can run it manually later."),
    );
    return;
  }

  console.log(chalk.blue.bold("\n› Building lib...\n"));

  const buildResult = Bun.spawnSync(["bun", "run", "build:lib"], {
    cwd: config.targetDir,
    stdio: ["inherit", "inherit", "inherit"],
  });

  if (buildResult.exitCode !== 0) {
    console.error(
      chalk.red("lib build failed. You can run 'bun run build:lib' later."),
    );
  }
};
