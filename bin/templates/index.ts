import type { ProjectConfig } from "../types";
import { copyBaseTemplate } from "./base";

export const applyTemplates = async (config: ProjectConfig): Promise<void> => {
  // Copy the base template
  await copyBaseTemplate(config);

  // Future: Apply feature-specific templates based on config
  // if (config.includeAuth) {
  //   await applyAuthTemplate(config);
  // }
  // if (config.router === "react-router") {
  //   await applyReactRouterTemplate(config);
  // }
  // await applyDatabaseTemplate(config);
};
