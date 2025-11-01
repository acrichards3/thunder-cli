#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// Get the target directory (where the template was cloned)
const targetDir = process.cwd();

// Check if this is a new project or already initialized
const packageJsonPath = resolve(targetDir, "package.json");
if (!existsSync(packageJsonPath)) {
  // Not a template installation, skip
  process.exit(0);
}

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

// Only run if this is still the template package
if (
  packageJson.name === "create-thunder-app" ||
  packageJson.name === "ak-wedding"
) {
  // Get project name from directory name
  const projectName =
    targetDir
      .split("/")
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9-]/g, "-") || "thunder-app";

  // Update root package.json
  packageJson.name = projectName;
  packageJson.private = true;
  delete packageJson.postinstall;
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");

  // Update workspace package names
  const updateWorkspacePackage = (workspacePath, oldPrefix, newPrefix) => {
    const pkgPath = resolve(targetDir, workspacePath, "package.json");
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      if (pkg.name?.startsWith(oldPrefix)) {
        pkg.name = pkg.name.replace(oldPrefix, newPrefix);
        writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
      }
    }
  };

  // Update all workspace packages
  updateWorkspacePackage("frontend", "@ak-wedding/", `@${projectName}/`);
  updateWorkspacePackage("backend", "@ak-wedding/", `@${projectName}/`);
  updateWorkspacePackage("lib", "@ak-wedding/", `@${projectName}/`);

  // Update workspace dependencies in frontend and backend
  const updateDependencies = (workspacePath) => {
    const pkgPath = resolve(targetDir, workspacePath, "package.json");
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      let updated = false;

      if (pkg.dependencies) {
        Object.keys(pkg.dependencies).forEach((dep) => {
          if (dep.startsWith("@ak-wedding/")) {
            const newDep = dep.replace("@ak-wedding/", `@${projectName}/`);
            pkg.dependencies[newDep] = pkg.dependencies[dep];
            delete pkg.dependencies[dep];
            updated = true;
          }
        });
      }

      if (updated) {
        writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
      }
    }
  };

  updateDependencies("frontend");
  updateDependencies("backend");

  // Update build scripts that reference old package names
  const updateScripts = () => {
    const scripts = packageJson.scripts || {};
    Object.keys(scripts).forEach((key) => {
      if (scripts[key] && typeof scripts[key] === "string") {
        scripts[key] = scripts[key].replace(
          /@ak-wedding\//g,
          `@${projectName}/`
        );
      }
    });
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
  };

  updateScripts();

  console.log(`\n✓ Project initialized as "${projectName}"\n`);
  console.log("🚀 Thunder App template initialized!\n");
  console.log("Next steps:");
  console.log("  1. bun install");
  console.log("  2. bun run build:lib");
  console.log("  3. bun run dev\n");
}
