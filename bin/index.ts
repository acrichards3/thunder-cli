#!/usr/bin/env bun
import { colors } from "./constants";
import { main } from "./cli";
import { closeReadline } from "./prompts";

main().catch((err: Error) => {
  closeReadline();
  console.error(colors.red(colors.bold("Error:")), colors.red(String(err)));
  process.exit(1);
});
