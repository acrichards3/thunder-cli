import chalk from "chalk";
import { prompt } from "./base";
import { DEFAULT_PROJECT_NAME } from "../constants";

export const promptProjectName = async (argName: string): Promise<string> => {
  let projectName = argName;

  if (!projectName) {
    const answer = await prompt(
      chalk.cyan(`Project name (${DEFAULT_PROJECT_NAME}): `),
    );
    projectName = answer || DEFAULT_PROJECT_NAME;
  }

  // Sanitize: lowercase, only alphanumeric and hyphens
  projectName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  return projectName || DEFAULT_PROJECT_NAME;
};
