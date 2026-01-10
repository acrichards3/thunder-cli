#!/usr/bin/env bun
import chalk from "chalk";
import { main } from "./cli";
import { closeReadline } from "./prompts";

main().catch((err: Error) => {
  closeReadline();
  console.error(chalk.red.bold("Error:"), chalk.red(err));
  process.exit(1);
});
