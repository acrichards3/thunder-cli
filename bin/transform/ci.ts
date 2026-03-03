import { resolve } from "path";
import type { ProjectConfig } from "../types";

const DEPLOY_CI_TEMPLATE = resolve(import.meta.dir, "../templates/ci/ci.yml");

export const applyDeployCi = async (config: ProjectConfig): Promise<void> => {
  if (!config.includeDeploy || !config.includeGithub) {
    return;
  }

  const dest = resolve(config.targetDir, ".github", "workflows", "ci.yml");
  await Bun.write(dest, Bun.file(DEPLOY_CI_TEMPLATE));
};
